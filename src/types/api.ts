import type { Severity, Verdict } from './severity';

export interface ExplainSignalPayload {
  readonly id: string;
  readonly severity: Severity;
}

export interface ExplainRequestPayload {
  readonly kind: 'link' | 'message';
  readonly score: number;
  readonly verdict: Verdict;
  readonly signals: readonly ExplainSignalPayload[];
}

export interface ExplainResponsePayload {
  readonly explanation: string;
  readonly source: 'ai' | 'fallback';
}
