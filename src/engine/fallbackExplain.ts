import type { Severity, Verdict } from '../types/severity';
import { TOP_SIGNALS_COUNT } from '../constants/limits';

export interface SignalSummaryItem {
  readonly id: string;
  readonly severity: Severity;
}

/**
 * Generates a deterministic plain-language defensive explanation from signals.
 * Used when offline, during network failures, or when AI explanations are unavailable.
 *
 * @param kind - Whether the evaluated target was a link or message.
 * @param score - Calculated risk score (0-100).
 * @param verdict - Assigned qualitative verdict.
 * @param signals - Array of signal identifiers and severities.
 * @returns Pure deterministic explanation string.
 */
export function generateFallbackExplain(
  kind: 'link' | 'message',
  score: number,
  verdict: Verdict,
  signals: readonly SignalSummaryItem[],
): string {
  if (signals.length === 0) {
    return `Sentinel assessed this ${kind} as ${verdict} with a risk score of ${String(score)}/100. No known red flags or deception indicators were matched. Still verify through an official channel before sharing sensitive details.`;
  }

  const criticalCount = signals.filter((s) => s.severity === 'critical').length;
  const highCount = signals.filter((s) => s.severity === 'high').length;
  const mediumCount = signals.filter((s) => s.severity === 'medium').length;

  const topSignals = signals
    .slice(0, TOP_SIGNALS_COUNT)
    .map((s) => s.id.replaceAll('_', ' '))
    .join(', ');

  const threatCountDesc =
    criticalCount > 0
      ? `${String(criticalCount)} critical and ${String(highCount + mediumCount)} warning signals`
      : `${String(highCount + mediumCount)} risk signals`;

  return `Sentinel assessed this ${kind} as ${verdict} with a risk score of ${String(score)}/100 based on ${threatCountDesc}. Primary indicators include: ${topSignals}. Do not enter sensitive information or proceed without independent verification.`;
}
