import { useState, useCallback } from 'react';
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

const CLIENT_TIMEOUT_MS = 8000;

async function fetchExplanation(
  payload: ExplainRequestPayload,
  fallbackText: string,
): Promise<{ text: string; source: 'ai' | 'fallback' }> {
  const controller = new AbortController();
  const timer = setTimeout(() => { controller.abort(); }, CLIENT_TIMEOUT_MS);
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
  }
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

  const clearExplanation = useCallback(() => {
    setExplanation(null);
    setSource(null);
  }, []);

  const requestExplanation = useCallback(
    async (
      kind: 'link' | 'message',
      score: number,
      verdict: Verdict,
      signals: readonly { id: string; severity: Severity }[],
    ): Promise<void> => {
      setIsLoading(true);
      const bounded = signals.slice(0, MAX_EXPLAIN_SIGNALS);
      const fallbackText = generateFallbackExplain(kind, score, verdict, bounded);
      const payload: ExplainRequestPayload = {
        kind,
        score,
        verdict,
        signals: bounded.map((s) => ({ id: s.id, severity: s.severity })),
      };

      const result = await fetchExplanation(payload, fallbackText);
      setExplanation(result.text);
      setSource(result.source);
      setIsLoading(false);
    },
    [],
  );

  return { explanation, source, isLoading, requestExplanation, clearExplanation };
}
