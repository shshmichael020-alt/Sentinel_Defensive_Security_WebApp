import type { LinkAnalysisResult } from '../types/analysis';
import { parseUrl } from './parseUrl';
import { extractUrlStructureSignals } from './urlStructureSignals';
import { extractDomainBreakdown, extractUrlBrandSignals } from './urlBrandSignals';
import { combineRisk } from './combineRisk';
import { getVerdictFromScore } from './verdict';
import { segmentUrl } from './segmentUrl';

/**
 * Analyzes a URL string statically for deceptive patterns, brand spoofing, and structure risks.
 * Never connects to or fetches the destination URL.
 *
 * @param input - The raw URL string to analyze.
 * @returns Discriminated union of link analysis result.
 */
export function analyzeUrl(input: string): LinkAnalysisResult {
  const parsed = parseUrl(input);
  if (parsed.status === 'empty') {
    return { status: 'empty' };
  }
  if (parsed.status === 'invalid') {
    return { status: 'invalid', reason: parsed.reason };
  }

  const { url, normalizedInput } = parsed;
  const breakdown = extractDomainBreakdown(url.hostname.toLowerCase());

  const structureSignals = extractUrlStructureSignals(url, normalizedInput);
  const brandSignals = extractUrlBrandSignals(url, breakdown);
  const allSignals = [...structureSignals, ...brandSignals];

  const score = combineRisk(allSignals);
  const verdict = getVerdictFromScore(score);
  const segments = segmentUrl(url, normalizedInput, allSignals, breakdown);

  return {
    status: 'ok',
    score,
    verdict,
    signals: allSignals,
    segments,
    normalizedUrl: normalizedInput,
  };
}
