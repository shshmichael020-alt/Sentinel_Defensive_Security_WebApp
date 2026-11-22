import { useState, useCallback, useRef, useEffect } from 'react';
import type { Severity, Verdict } from '../types/severity';
import type { ExplainRequestPayload, ExplainResponsePayload } from '../types/api';
import { MAX_EXPLAIN_SIGNALS } from '../constants/limits';
import { generateFallbackExplain } from '../engine/fallbackExplain';

export interface UseExplainResult {
  readonly explanation: string | null;
  readonly source: 'ai' | 'fallback' | null;
  readonly isLoading: boolean;
  readonly requestExplanation: (
    kind: 'link' | 'message',
    score: number,
    verdict: Verdict,
    signals: readonly { id: string; severity: Severity }[],
  ) => Promise<void>;
  readonly clearExplanation: () => void;
}

interface ExplainInput {
  readonly kind: 'link' | 'message';
  readonly score: number;
  readonly verdict: Verdict;
  readonly signals: readonly { id: string; severity: Severity }[];
}

const CLIENT_TIMEOUT_MS = 8000;

function prepareExplainPayload(input: ExplainInput): { payload: ExplainRequestPayload; fallbackText: string } {
  const bounded = input.signals.slice(0, MAX_EXPLAIN_SIGNALS);
  const fallbackText = generateFallbackExplain(input.kind, input.score, input.verdict, bounded);
  const payload: ExplainRequestPayload = {
    kind: input.kind,
    score: input.score,
    verdict: input.verdict,
    signals: bounded.map((s) => ({ id: s.id, severity: s.severity })),
  };
  return { payload, fallbackText };
}

async function fetchExplanation(
  payload: ExplainRequestPayload,
  fallbackText: string,
  externalSignal: AbortSignal,
): Promise<{ text: string; source: 'ai' | 'fallback' }> {
  const controller = new AbortController();
  const timer = setTimeout(() => { controller.abort(); }, CLIENT_TIMEOUT_MS);
  const onExternalAbort = () => { controller.abort(); };
  externalSignal.addEventListener('abort', onExternalAbort, { once: true });

  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) return { text: fallbackText, source: 'fallback' };
    const data = (await res.json()) as ExplainResponsePayload;
    return { text: data.explanation || fallbackText, source: data.source === 'ai' ? 'ai' : 'fallback' };
  } catch {
    return { text: fallbackText, source: 'fallback' };
  } finally {
    clearTimeout(timer);
    externalSignal.removeEventListener('abort', onExternalAbort);
  }
}

async function runExplainFetch(input: ExplainInput, signal: AbortSignal): Promise<{ text: string; source: 'ai' | 'fallback' } | null> {
  const { payload, fallbackText } = prepareExplainPayload(input);
  const result = await fetchExplanation(payload, fallbackText, signal);
  return signal.aborted ? null : result;
}

async function triggerFetch(
  abortRef: React.MutableRefObject<AbortController | null>,
  input: ExplainInput,
  setIsLoading: (v: boolean) => void,
): Promise<{ text: string; source: 'ai' | 'fallback' } | null> {
  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;
  setIsLoading(true);
  return runExplainFetch(input, controller.signal);
}

/**
 * Hook to request plain-language explanations from the API with automatic local fallback.
 * Guarantees privacy: never sends raw user text, passwords, or visited destinations.
 *
 * @returns Explanation state and fetch trigger function.
 */
export function useExplain(): UseExplainResult {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const clearExplanation = useCallback(() => {
    abortRef.current?.abort();
    setExplanation(null);
    setSource(null);
  }, []);

  const requestExplanation = useCallback(
    async (kind: 'link' | 'message', score: number, verdict: Verdict, signals: readonly { id: string; severity: Severity }[]) => {
      const res = await triggerFetch(abortRef, { kind, score, verdict, signals }, setIsLoading);
      if (res) {
        setExplanation(res.text);
        setSource(res.source);
        setIsLoading(false);
      }
    },
    [],
  );

  return { explanation, source, isLoading, requestExplanation, clearExplanation };
}
