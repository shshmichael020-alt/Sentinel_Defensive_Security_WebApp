import type { Severity } from '../types/severity';
import { SEVERITY_WEIGHTS } from '../constants/scoring';

/**
 * Combines multiple risk signals into a single score between 0 and 100.
 * Uses the formula: 100 * (1 - PRODUCT(1 - w_i / 100)).
 *
 * @param signals - Array of signals with their severity levels.
 * @returns An integer risk score between 0 and 100 inclusive.
 */
export function combineRisk(
  signals: readonly { readonly severity: Severity }[],
): number {
  if (signals.length === 0) {
    return 0;
  }

  let product = 1;
  for (const signal of signals) {
    const weight = SEVERITY_WEIGHTS[signal.severity];
    if (weight > 0) {
      product *= 1 - weight / 100;
    }
  }

  const rawScore = Math.round(100 * (1 - product));
  return Math.max(0, Math.min(100, rawScore));
}
