import type { Verdict } from '../types/severity';
import { VERDICT_THRESHOLDS } from '../constants/scoring';

/**
 * Maps a numeric risk score (0-100) to a qualitative Verdict.
 * Thresholds:
 * - 0 - 19: Low risk
 * - 20 - 44: Caution
 * - 45 - 69: Suspicious
 * - 70 - 100: Dangerous
 *
 * @param score - The calculated risk score from 0 to 100.
 * @returns The associated verdict category.
 */
export function getVerdictFromScore(score: number): Verdict {
  if (score <= VERDICT_THRESHOLDS.LOW_MAX) {
    return 'Low risk';
  }
  if (score <= VERDICT_THRESHOLDS.CAUTION_MAX) {
    return 'Caution';
  }
  if (score <= VERDICT_THRESHOLDS.SUSPICIOUS_MAX) {
    return 'Suspicious';
  }
  return 'Dangerous';
}
