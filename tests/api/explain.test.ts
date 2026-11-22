import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler, { type ExplainReq, type ExplainRes } from '../../api/explain';

interface MockResponseState {
  statusCode: number;
  headers: Record<string, string>;
  data: unknown;
}

function createMockResponse(): { res: ExplainRes; getState: () => MockResponseState } {
  const state: MockResponseState = {
    statusCode: 200,
    headers: {},
    data: null,
  };

  const res: ExplainRes = {
    setHeader(name: string, value: string) {
      state.headers[name.toLowerCase()] = value;
    },
    status(code: number) {
      state.statusCode = code;
      return res;
    },
    json(body: unknown) {
      state.data = body;
    },
  };

  return { res, getState: () => state };
}

describe('api/explain handler', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.AI_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('responds with 405 when HTTP method is not POST', async () => {
    const { res, getState } = createMockResponse();
    const req: ExplainReq = { method: 'GET', headers: {} };
    await handler(req, res);

    expect(getState().statusCode).toBe(405);
    expect(getState().headers.allow).toBe('POST');
  });

  it('rejects payloads containing raw text, URLs, or passwords with 400', async () => {
    const { res, getState } = createMockResponse();
    const req: ExplainReq = {
      method: 'POST',
      headers: {},
      body: {
        kind: 'link',
        score: 50,
        verdict: 'Suspicious',
        signals: [{ id: 'no_https', severity: 'medium' }],
        url: 'https://raw-url-leak.com',
      },
    };
    await handler(req, res);

    expect(getState().statusCode).toBe(400);
    expect(getState().data).toEqual({ error: 'Invalid request payload' });
  });

  it('rejects invalid scores, kinds, or verdicts with 400', async () => {
    const { res, getState } = createMockResponse();
    const req: ExplainReq = {
      method: 'POST',
      headers: {},
      body: { kind: 'invalid_kind', score: 999, verdict: 'Bad', signals: [] },
    };
    await handler(req, res);

    expect(getState().statusCode).toBe(400);
  });

  it('responds with 413 when content-length exceeds 32KB', async () => {
    const { res, getState } = createMockResponse();
    const req: ExplainReq = {
      method: 'POST',
      headers: { 'content-length': '35000' },
      body: { kind: 'link', score: 10, verdict: 'Low risk', signals: [] },
    };
    await handler(req, res);

    expect(getState().statusCode).toBe(413);
  });

  it('responds with 429 after 20 requests from the same IP', async () => {
    const ip = '198.51.100.1';
    for (let i = 0; i < 20; i += 1) {
      const { res } = createMockResponse();
      const req: ExplainReq = {
        method: 'POST',
        headers: { 'x-forwarded-for': ip },
        body: { kind: 'link', score: 0, verdict: 'Low risk', signals: [] },
      };
      await handler(req, res);
    }

    const { res: throttledRes, getState } = createMockResponse();
    const throttledReq: ExplainReq = {
      method: 'POST',
      headers: { 'x-forwarded-for': ip },
      body: { kind: 'link', score: 0, verdict: 'Low risk', signals: [] },
    };
    await handler(throttledReq, throttledRes);

    expect(getState().statusCode).toBe(429);
    expect(getState().headers['retry-after']).toBe('60');
  });

  it('returns deterministic 200 fallback when AI_API_KEY is not set', async () => {
    const { res, getState } = createMockResponse();
    const req: ExplainReq = {
      method: 'POST',
      headers: {},
      body: {
        kind: 'message',
        score: 60,
        verdict: 'Suspicious',
        signals: [{ id: 'credential_request', severity: 'critical' }],
      },
    };
    await handler(req, res);

    expect(getState().statusCode).toBe(200);
    const body = getState().data as { explanation: string; source: string };
    expect(body.source).toBe('fallback');
    expect(body.explanation).toContain('credential request');
  });

  it('returns fallback gracefully when AI fetch rejects or aborts', async () => {
    process.env.AI_API_KEY = 'test-key';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network timeout')));

    const { res, getState } = createMockResponse();
    const req: ExplainReq = {
      method: 'POST',
      headers: {},
      body: { kind: 'link', score: 60, verdict: 'Suspicious', signals: [] },
    };
    await handler(req, res);

    expect(getState().statusCode).toBe(200);
    const body = getState().data as { explanation: string; source: string };
    expect(body.source).toBe('fallback');
  });

  it('rejects AI output containing hallucinated numbers not in payload', async () => {
    process.env.AI_API_KEY = 'test-key';
    const mockAiResponse = {
      ok: true,
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: 'We detected 9999 attacks on port 8080.' }] } }],
      }),
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockAiResponse));

    const { res, getState } = createMockResponse();
    const req: ExplainReq = {
      method: 'POST',
      headers: {},
      body: { kind: 'link', score: 40, verdict: 'Caution', signals: [] },
    };
    await handler(req, res);

    expect(getState().statusCode).toBe(200);
    const body = getState().data as { explanation: string; source: string };
    expect(body.source).toBe('fallback');
  });
});
