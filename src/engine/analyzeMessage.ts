import type { MessageAnalysisResult } from '../types/analysis';
import type { Signal } from '../types/signal';
import { MESSAGE_MAX_LENGTH, EVIDENCE_MAX_LENGTH } from '../constants/limits';
import { SIGNAL_COPY } from '../constants/copy';
import { extractUrls } from './extractUrls';
import { analyzeUrl } from './analyzeUrl';
import {
  extractMessageCategorySignals,
  mapLinkVerdictToSeverity,
  applyPressureCombo,
} from './messageSignals';
import { findMessageMatches } from './findMessageMatches';
import { combineRisk } from './combineRisk';
import { getVerdictFromScore } from './verdict';
import { highlightMessage } from './highlightMessage';

function analyzeEmbeddedLinks(urls: readonly string[]): {
  signals: Signal[];
  riskyUrls: string[];
} {
  const signals: Signal[] = [];
  const riskyUrls: string[] = [];

  for (const urlStr of urls) {
    const linkRes = analyzeUrl(urlStr);
    if (linkRes.status === 'ok') {
      const mappedSev = mapLinkVerdictToSeverity(linkRes.verdict);
      if (mappedSev !== null) {
        riskyUrls.push(urlStr);
        signals.push({
          id: 'risky_link_inside',
          severity: mappedSev,
          label: SIGNAL_COPY.risky_link_inside.label,
          evidence: `Embedded URL with ${linkRes.verdict}: ${urlStr}`.slice(0, EVIDENCE_MAX_LENGTH),
          advice: SIGNAL_COPY.risky_link_inside.advice,
        });
      }
    }
  }

  return { signals, riskyUrls };
}

/**
 * Analyzes pasted SMS, email, or messaging content for social engineering tactics.
 * Identifies urgency, threats, credential harvesting, payment scams, and embedded risky links.
 *
 * @param input - The pasted message text.
 * @returns Discriminated union of message analysis result.
 */
export function analyzeMessage(input: string): MessageAnalysisResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { status: 'empty' };
  }

  const bounded = trimmed.slice(0, MESSAGE_MAX_LENGTH);
  const foundUrls = extractUrls(bounded);
  const { signals: linkSignals, riskyUrls } = analyzeEmbeddedLinks(foundUrls);

  const scan = findMessageMatches(bounded);
  const categorySignals = extractMessageCategorySignals(bounded, scan);
  const rawSignals = [...categorySignals, ...linkSignals];
  const finalSignals = applyPressureCombo(rawSignals);

  const score = combineRisk(finalSignals);
  const verdict = getVerdictFromScore(score);
  const highlights = highlightMessage(bounded, riskyUrls, scan.spans);

  return {
    status: 'ok',
    score,
    verdict,
    signals: finalSignals,
    highlights,
    extractedUrls: foundUrls,
  };
}
