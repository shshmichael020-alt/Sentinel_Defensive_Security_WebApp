export interface ExplainReq {
  readonly method?: string;
  readonly headers: Record<string, string | string[] | undefined>;
  readonly body?: unknown;
}

export interface ExplainRes {
  setHeader(name: string, value: string): void;
  status(code: number): ExplainRes;
  json(body: unknown): void;
}

interface ValidSignal {
  readonly id: string;
  readonly severity: string;
}

interface ValidBody {
  readonly kind: 'link' | 'message';
  readonly score: number;
  readonly verdict: string;
  readonly signals: readonly ValidSignal[];
}

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_METHOD_NOT_ALLOWED = 405;
const HTTP_PAYLOAD_TOO_LARGE = 413;
const HTTP_TOO_MANY_REQUESTS = 429;

const MAX_SIGNALS_LIMIT = 12;
const MAX_TOP_SIGNALS = 3;
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_PAYLOAD_BYTES = 32768;
const AI_TIMEOUT_MS = 6000;
const MAX_OUTPUT_LENGTH = 600;

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, now: number): boolean {
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function hasForbiddenFields(b: Record<string, unknown>): boolean {
  return 'url' in b || 'text' in b || 'password' in b || 'content' in b;
}

function isValidSignalItem(item: Record<string, unknown>): boolean {
  if (typeof item.id !== 'string' || !/^[a-z_]{2,40}$/.test(item.id)) return false;
  return ['info', 'low', 'medium', 'high', 'critical'].includes(String(item.severity));
}

function parseSignalArray(signals: unknown): ValidSignal[] | null {
  if (!Array.isArray(signals) || signals.length > MAX_SIGNALS_LIMIT) return null;
  const valid: ValidSignal[] = [];
  for (const s of signals) {
    if (typeof s !== 'object' || s === null) return null;
    const item = s as Record<string, unknown>;
    if (!isValidSignalItem(item)) return null;
    valid.push({ id: String(item.id), severity: String(item.severity) });
  }
  return valid;
}

function isValidScoreAndVerdict(score: unknown, verdict: unknown): boolean {
  const isInt = typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= 100;
  return isInt && ['Low risk', 'Caution', 'Suspicious', 'Dangerous'].includes(String(verdict));
}

function isValidKind(kind: unknown): kind is 'link' | 'message' {
  return kind === 'link' || kind === 'message';
}

function isPlainObject(body: unknown): body is Record<string, unknown> {
  return typeof body === 'object' && body !== null && !Array.isArray(body);
}

function parseAndValidate(body: unknown): ValidBody | null {
  if (!isPlainObject(body)) return null;
  if (hasForbiddenFields(body)) return null;
  if (!isValidKind(body.kind)) return null;
  if (!isValidScoreAndVerdict(body.score, body.verdict)) return null;
  const parsedSignals = parseSignalArray(body.signals);
  if (!parsedSignals) return null;
  return { kind: body.kind, score: Number(body.score), verdict: String(body.verdict), signals: parsedSignals };
}

function buildFallback(data: ValidBody): string {
  if (data.signals.length === 0) {
    return `Sentinel assessed this ${data.kind} as ${data.verdict} with a score of ${String(data.score)}/100. No red flags found. Still verify through an official channel.`;
  }
  const top = data.signals.slice(0, MAX_TOP_SIGNALS).map((s) => s.id.replaceAll('_', ' ')).join(', ');
  return `Sentinel evaluated this ${data.kind} as ${data.verdict} (${String(data.score)}/100) based on ${String(data.signals.length)} risk signals including: ${top}. Exercise caution and verify via official channels.`;
}

function validateAiOutput(text: string, score: number, signalCount: number): boolean {
  if (text.length > MAX_OUTPUT_LENGTH) return false;
  if (/(?:https?:\/\/|www\.|\.com|\.org|\.xyz|\[.*?\]\(.*?\))/i.test(text)) return false;
  const numbers = text.match(/\b\d+\b/g) ?? [];
  const allowed = new Set([String(score), String(signalCount), '100']);
  return numbers.every((n) => allowed.has(n));
}

function extractCandidateText(json: unknown): string | null {
  const r = json as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  return r.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
}

async function requestGemini(data: ValidBody, apiKey: string): Promise<string | null> {
  const model = process.env.AI_MODEL ?? 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const controller = new AbortController();
  const timer = setTimeout(() => { controller.abort(); }, AI_TIMEOUT_MS);
  try {
    const prompt = `Explain strictly from this JSON: ${JSON.stringify(data)}. No new facts, no new numbers, under 90 words, calm defensive tone.`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal,
    });
    return resp.ok ? extractCandidateText(await resp.json()) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function checkRequestPreconditions(req: ExplainReq, res: ExplainRes): boolean {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(HTTP_METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
    return false;
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? (forwarded.split(',')[0]?.trim() ?? '127.0.0.1') : '127.0.0.1';
  if (isRateLimited(ip, Date.now())) {
    res.setHeader('Retry-After', '60');
    res.status(HTTP_TOO_MANY_REQUESTS).json({ error: 'Rate limit exceeded' });
    return false;
  }
  const contentLength = Number(req.headers['content-length'] ?? 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    res.status(HTTP_PAYLOAD_TOO_LARGE).json({ error: 'Payload too large' });
    return false;
  }
  return true;
}

/**
 * Serverless API handler for Sentinel explanation endpoint.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 */
export default async function handler(req: ExplainReq, res: ExplainRes): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (!checkRequestPreconditions(req, res)) {
    return;
  }
  const valid = parseAndValidate(req.body);
  if (!valid) {
    res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid request payload' });
    return;
  }
  const fallback = buildFallback(valid);
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    res.status(HTTP_OK).json({ explanation: fallback, source: 'fallback' });
    return;
  }
  const aiText = await requestGemini(valid, apiKey);
  const isAiValid = aiText && validateAiOutput(aiText, valid.score, valid.signals.length);
  res.status(HTTP_OK).json({
    explanation: isAiValid ? aiText : fallback,
    source: isAiValid ? 'ai' : 'fallback',
  });
}
