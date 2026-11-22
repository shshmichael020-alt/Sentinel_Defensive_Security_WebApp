import type { Signal } from '../types/signal';
import { SIGNAL_COPY } from '../constants/copy';
import {
  URL_LONG_THRESHOLD,
  PERCENT_ENCODED_THRESHOLD,
  PHISHING_KEYWORD_MEDIUM_COUNT,
  EVIDENCE_MAX_LENGTH,
} from '../constants/limits';
import { PHISHING_KEYWORDS } from '../constants/urlRules';

const PERCENT_MATCH_REGEX = /%[0-9a-fA-F]{2}/g;
const SANITIZE_WHITESPACE_REGEX = /[\r\n\t]/g;

function sanitizeEvidence(text: string): string {
  return text.slice(0, EVIDENCE_MAX_LENGTH).replace(SANITIZE_WHITESPACE_REGEX, ' ');
}

function checkLengthAndEncoding(fullUrl: string, signals: Signal[]): void {
  if (fullUrl.length > URL_LONG_THRESHOLD) {
    signals.push({
      id: 'long_url',
      severity: 'low',
      label: SIGNAL_COPY.long_url.label,
      evidence: sanitizeEvidence(`Length: ${String(fullUrl.length)} chars`),
      advice: SIGNAL_COPY.long_url.advice,
    });
  }
  PERCENT_MATCH_REGEX.lastIndex = 0;
  const percentMatches = fullUrl.match(PERCENT_MATCH_REGEX) ?? [];
  if (percentMatches.length >= PERCENT_ENCODED_THRESHOLD) {
    signals.push({
      id: 'encoded_obfuscation',
      severity: 'low',
      label: SIGNAL_COPY.encoded_obfuscation.label,
      evidence: sanitizeEvidence(`${String(percentMatches.length)} encoded sequences`),
      advice: SIGNAL_COPY.encoded_obfuscation.advice,
    });
  }
}

function checkRedirectAndKeywords(url: URL, signals: Signal[]): void {
  const queryStr = url.search.toLowerCase();
  if (queryStr.includes('http://') || queryStr.includes('https://')) {
    signals.push({
      id: 'embedded_redirect',
      severity: 'medium',
      label: SIGNAL_COPY.embedded_redirect.label,
      evidence: sanitizeEvidence('Query contains nested http/https target'),
      advice: SIGNAL_COPY.embedded_redirect.advice,
    });
  }
  const combinedHostPath = (url.hostname + url.pathname).toLowerCase();
  const matchedKeywords = PHISHING_KEYWORDS.filter((kw) => combinedHostPath.includes(kw));
  if (matchedKeywords.length > 0) {
    const isMedium = matchedKeywords.length >= PHISHING_KEYWORD_MEDIUM_COUNT;
    signals.push({
      id: 'phishing_keywords',
      severity: isMedium ? 'medium' : 'low',
      label: SIGNAL_COPY.phishing_keywords.label,
      evidence: sanitizeEvidence(`Keywords: ${matchedKeywords.join(', ')}`),
      advice: SIGNAL_COPY.phishing_keywords.advice,
    });
  }
}

/**
 * Evaluates obfuscation, length, nested redirect, and keyword signals in a URL.
 *
 * @param url - Parsed standard URL.
 * @param fullUrl - Full raw or normalized URL string.
 * @returns Array of detected encoding and content signals.
 */
export function extractUrlEncodingSignals(url: URL, fullUrl: string): Signal[] {
  const signals: Signal[] = [];
  checkLengthAndEncoding(fullUrl, signals);
  checkRedirectAndKeywords(url, signals);
  return signals;
}
