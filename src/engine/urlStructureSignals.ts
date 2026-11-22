import type { Signal } from '../types/signal';
import { SIGNAL_COPY } from '../constants/copy';
import {
  URL_LONG_THRESHOLD,
  HYPHENS_EXCESS_THRESHOLD,
  PERCENT_ENCODED_THRESHOLD,
  PHISHING_KEYWORD_MEDIUM_COUNT,
  EVIDENCE_MAX_LENGTH,
} from '../constants/limits';
import {
  SUSPICIOUS_TLDS,
  URL_SHORTENERS,
  PHISHING_KEYWORDS,
  DANGEROUS_SCHEMES,
} from '../constants/urlRules';

function sanitizeEvidence(text: string): string {
  return text.slice(0, EVIDENCE_MAX_LENGTH).replace(/[\r\n\t]/g, ' ');
}

function checkSchemeSignals(url: URL, signals: Signal[]): boolean {
  if (DANGEROUS_SCHEMES.includes(url.protocol.toLowerCase())) {
    signals.push({
      id: 'dangerous_scheme',
      severity: 'critical',
      label: SIGNAL_COPY.dangerous_scheme.label,
      evidence: sanitizeEvidence(`Protocol: ${url.protocol}`),
      advice: SIGNAL_COPY.dangerous_scheme.advice,
    });
    return true;
  }
  if (url.protocol === 'http:') {
    signals.push({
      id: 'no_https',
      severity: 'medium',
      label: SIGNAL_COPY.no_https.label,
      evidence: sanitizeEvidence('Plain HTTP connection'),
      advice: SIGNAL_COPY.no_https.advice,
    });
  }
  return false;
}

function checkHostIpPunycode(host: string, signals: Signal[]): void {
  const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host);
  const isIpv6 = host.startsWith('[') && host.endsWith(']');
  if (isIpv4 || isIpv6) {
    signals.push({
      id: 'ip_host',
      severity: 'high',
      label: SIGNAL_COPY.ip_host.label,
      evidence: sanitizeEvidence(`Host IP: ${host}`),
      advice: SIGNAL_COPY.ip_host.advice,
    });
  }
  if (host.includes('xn--') || /[\u0080-\uFFFF]/.test(host)) {
    signals.push({
      id: 'punycode_idn',
      severity: 'high',
      label: SIGNAL_COPY.punycode_idn.label,
      evidence: sanitizeEvidence(`Punycode/IDN: ${host}`),
      advice: SIGNAL_COPY.punycode_idn.advice,
    });
  }
}

function checkHostCredentials(url: URL, signals: Signal[]): void {
  const host = url.hostname.toLowerCase();
  if (url.username !== '' || url.password !== '') {
    signals.push({
      id: 'userinfo_at',
      severity: 'high',
      label: SIGNAL_COPY.userinfo_at.label,
      evidence: sanitizeEvidence('Userinfo prefix before @'),
      advice: SIGNAL_COPY.userinfo_at.advice,
    });
  }
  const hyphenCount = (host.match(/-/g) ?? []).length;
  if (hyphenCount >= HYPHENS_EXCESS_THRESHOLD) {
    signals.push({
      id: 'many_hyphens',
      severity: 'low',
      label: SIGNAL_COPY.many_hyphens.label,
      evidence: sanitizeEvidence(`${String(hyphenCount)} hyphens in host: ${host}`),
      advice: SIGNAL_COPY.many_hyphens.advice,
    });
  }
}

function checkDomainAndPortSignals(url: URL, signals: Signal[]): void {
  const host = url.hostname.toLowerCase();
  const tld = host.split('.').pop() ?? '';
  if (SUSPICIOUS_TLDS.includes(tld)) {
    signals.push({
      id: 'suspicious_tld',
      severity: 'medium',
      label: SIGNAL_COPY.suspicious_tld.label,
      evidence: sanitizeEvidence(`TLD .${tld}`),
      advice: SIGNAL_COPY.suspicious_tld.advice,
    });
  }
  if (URL_SHORTENERS.includes(host)) {
    signals.push({
      id: 'url_shortener',
      severity: 'medium',
      label: SIGNAL_COPY.url_shortener.label,
      evidence: sanitizeEvidence(`Shortener domain: ${host}`),
      advice: SIGNAL_COPY.url_shortener.advice,
    });
  }
  if (url.port !== '' && url.port !== '80' && url.port !== '443') {
    signals.push({
      id: 'nonstandard_port',
      severity: 'medium',
      label: SIGNAL_COPY.nonstandard_port.label,
      evidence: sanitizeEvidence(`Port: ${url.port}`),
      advice: SIGNAL_COPY.nonstandard_port.advice,
    });
  }
}

function checkPathKeywords(url: URL, signals: Signal[]): void {
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

function checkEncodingAndRedirect(url: URL, fullUrl: string, signals: Signal[]): void {
  if (fullUrl.length > URL_LONG_THRESHOLD) {
    signals.push({
      id: 'long_url',
      severity: 'low',
      label: SIGNAL_COPY.long_url.label,
      evidence: sanitizeEvidence(`Length: ${String(fullUrl.length)} chars`),
      advice: SIGNAL_COPY.long_url.advice,
    });
  }
  const percentMatches = fullUrl.match(/%[0-9a-fA-F]{2}/g) ?? [];
  if (percentMatches.length >= PERCENT_ENCODED_THRESHOLD) {
    signals.push({
      id: 'encoded_obfuscation',
      severity: 'low',
      label: SIGNAL_COPY.encoded_obfuscation.label,
      evidence: sanitizeEvidence(`${String(percentMatches.length)} encoded sequences`),
      advice: SIGNAL_COPY.encoded_obfuscation.advice,
    });
  }
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
}

/**
 * Evaluates structural and protocol-level risk signals of a URL.
 *
 * @param url - Parsed standard URL instance.
 * @param originalOrNormalized - Full URL string as parsed.
 * @returns Array of detected structural signals.
 */
export function extractUrlStructureSignals(url: URL, originalOrNormalized: string): Signal[] {
  const signals: Signal[] = [];
  const isDangerousScheme = checkSchemeSignals(url, signals);
  if (isDangerousScheme) return signals;

  const host = url.hostname.toLowerCase();
  checkHostIpPunycode(host, signals);
  checkHostCredentials(url, signals);
  checkDomainAndPortSignals(url, signals);
  checkEncodingAndRedirect(url, originalOrNormalized, signals);
  checkPathKeywords(url, signals);
  return signals;
}
