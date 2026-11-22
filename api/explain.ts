export interface ExplainReq {
  readonly method?: string;
  readonly headers: Record<string, string | string[] | undefined>;
  readonly body?: unknown;
}
export interface ExplainRes {
  setHeader(name: string, value: string): void; status(code: number): ExplainRes; json(body: unknown): void;
}
interface ValidSignal { readonly id: string; readonly severity: string; }
interface ValidBody {
  readonly kind: 'link' | 'message'; readonly score: number; readonly verdict: string; readonly signals: readonly ValidSignal[];
}

const HTTP = { OK: 200, BAD_REQ: 400, NOT_ALLOWED: 405, TOO_LARGE: 413, TOO_MANY: 429 } as const;
const LIMITS = { SIGNALS: 12, TOP: 3, WINDOW_MS: 60000, MAX_REQ: 20, BYTES: 32768, TIMEOUT_MS: 6000, OUT_LEN: 600 } as const;
const SEVERITIES = new Set(['info', 'low', 'medium', 'high', 'critical']);
const VERDICTS = new Set(['Low risk', 'Caution', 'Suspicious', 'Dangerous']);
const FORBIDDEN_KEYS = ['url', 'text', 'password', 'content'] as const;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, now: number): boolean {
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < LIMITS.WINDOW_MS);
  if (timestamps.length >= LIMITS.MAX_REQ) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function parseSignalItem(s: unknown): ValidSignal | null {
  if (typeof s !== 'object' || s === null) return null;
  const item = s as Record<string, unknown>;
  if (typeof item.id !== 'string' || !/^[a-z_]{2,40}$/.test(item.id)) return null;
  if (!SEVERITIES.has(String(item.severity))) return null;
  return { id: item.id, severity: String(item.severity) };
}

function parseSignalArray(signals: unknown): ValidSignal[] | null {
  if (!Array.isArray(signals) || signals.length > LIMITS.SIGNALS) return null;
  const valid: ValidSignal[] = [];
  for (const s of signals) {
    const item = parseSignalItem(s);
    if (!item) return null;
    valid.push(item);
  }
  return valid;
}

function isScoreValid(score: unknown): score is number {
  return typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= 100;
}

function buildValidatedBody(body: Record<string, unknown>): ValidBody | null {
  if (!isScoreValid(body.score) || !VERDICTS.has(String(body.verdict))) return null;
  const signals = parseSignalArray(body.signals);
  if (!signals) return null;
  const kind = body.kind === 'link' ? ('link' as const) : ('message' as const);
  return { kind, score: body.score, verdict: String(body.verdict), signals };
}

function isRecord(b: unknown): b is Record<string, unknown> {
  return typeof b === 'object' && b !== null && !Array.isArray(b);
}

function parseAndValidate(b: unknown): ValidBody | null {
  if (!isRecord(b) || FORBIDDEN_KEYS.some((k) => k in b)) return null;
  if (b.kind !== 'link' && b.kind !== 'message') return null;
  return buildValidatedBody(b);
}

function buildFallback(data: ValidBody): string {
  if (data.signals.length === 0) {
    return `Sentinel assessed this ${data.kind} as ${data.verdict} with a score of ${String(data.score)}/100. No red flags found. Still verify through an official channel.`;
  }
  const top = data.signals.slice(0, LIMITS.TOP).map((s) => s.id.replaceAll('_', ' ')).join(', ');
  return `Sentinel evaluated this ${data.kind} as ${data.verdict} (${String(data.score)}/100) based on ${String(data.signals.length)} risk signals including: ${top}. Exercise caution and verify via official channels.`;
}

function validateAiOutput(text: string, score: number, signalCount: number): boolean {
  if (text.length > LIMITS.OUT_LEN) return false;
  if (/(?:https?:\/\/|www\.|\.com|\.org|\.xyz|\[.*?\]\(.*?\))/i.test(text)) return false;
  const numbers = text.match(/\b\d+\b/g) ?? [];
  const allowed = new Set([String(score), String(signalCount), '100']);
  return numbers.every((n) => allowed.has(n));
}

function extractPartText(first: unknown): string | null {
  if (typeof first !== 'object' || first === null) return null;
  const text = (first as { text?: unknown }).text;
  return typeof text === 'string' ? text.trim() : null;
}

function getFirstCandidateParts(cand: unknown): unknown[] | null {
  if (typeof cand !== 'object' || cand === null) return null;
  const content = (cand as { content?: { parts?: unknown[] } }).content;
  if (!content || !Array.isArray(content.parts) || content.parts.length === 0) return null;
  return content.parts;
}

function extractCandidateText(json: unknown): string | null {
  if (typeof json !== 'object' || json === null) return null;
  const cands = (json as { candidates?: unknown[] }).candidates;
  if (!Array.isArray(cands) || cands.length === 0) return null;
  const parts = getFirstCandidateParts(cands[0]);
  return parts ? extractPartText(parts[0]) : null;
}

async function requestGemini(data: ValidBody, apiKey: string): Promise<string | null> {
  const model = process.env.AI_MODEL ?? 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const controller = new AbortController();
  const timer = setTimeout(() => { controller.abort(); }, LIMITS.TIMEOUT_MS);
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

function getClientIp(req: ExplainReq): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd !== 'string') return '127.0.0.1';
  const first = fwd.split(',')[0];
  return first ? first.trim() : '127.0.0.1';
}

function checkRequestPreconditions(req: ExplainReq, res: ExplainRes): boolean {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(HTTP.NOT_ALLOWED).json({ error: 'Method not allowed' });
    return false;
  }
  if (isRateLimited(getClientIp(req), Date.now())) {
    res.setHeader('Retry-After', '60');
    res.status(HTTP.TOO_MANY).json({ error: 'Rate limit exceeded' });
    return false;
  }
  const len = Number(req.headers['content-length'] ?? 0);
  if (len > LIMITS.BYTES) {
    res.status(HTTP.TOO_LARGE).json({ error: 'Payload too large' });
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
  if (!checkRequestPreconditions(req, res)) return;
  const valid = parseAndValidate(req.body);
  if (!valid) {
    res.status(HTTP.BAD_REQ).json({ error: 'Invalid request payload' });
    return;
  }
  const fallback = buildFallback(valid);
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    res.status(HTTP.OK).json({ explanation: fallback, source: 'fallback' });
    return;
  }
  const aiText = await requestGemini(valid, apiKey);
  const isAiValid = aiText && validateAiOutput(aiText, valid.score, valid.signals.length);
  res.status(HTTP.OK).json({
    explanation: isAiValid ? aiText : fallback,
    source: isAiValid ? 'ai' : 'fallback',
  });
}
