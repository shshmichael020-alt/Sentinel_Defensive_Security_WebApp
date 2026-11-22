import type { Signal } from '../types/signal';
import { SIGNAL_COPY } from '../constants/copy';
import {
  HYPHENS_EXCESS_THRESHOLD,
  EVIDENCE_MAX_LENGTH,
} from '../constants/limits';
import {
  SUSPICIOUS_TLDS_SET,
  URL_SHORTENERS_SET,
  DANGEROUS_SCHEMES_SET,
} from '../constants/urlRules';
import { extractUrlEncodingSignals } from './urlEncodingSignals';

const IPV4_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IDN_REGEX = /[\u0080-\uFFFF]/;
const SANITIZE_WHITESPACE_REGEX = /[\r\n\t]/g;

function sanitizeEvidence(text: string): string {
  return text.slice(0, EVIDENCE_MAX_LENGTH).replace(SANITIZE_WHITESPACE_REGEX, ' ');
}

function checkSchemeSignals(url: URL, signals: Signal[]): boolean {
  if (DANGEROUS_SCHEMES_SET.has(url.protocol.toLowerCase())) {
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
  const isIpv4 = IPV4_REGEX.test(host);
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
  if (host.includes('xn--') || IDN_REGEX.test(host)) {
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

function checkPortSignal(url: URL, signals: Signal[]): void {
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

function checkDomainAndPortSignals(url: URL, signals: Signal[]): void {
  const host = url.hostname.toLowerCase();
  const tld = host.split('.').pop() ?? '';
  if (SUSPICIOUS_TLDS_SET.has(tld)) {
    signals.push({
      id: 'suspicious_tld',
      severity: 'medium',
      label: SIGNAL_COPY.suspicious_tld.label,
      evidence: sanitizeEvidence(`TLD .${tld}`),
      advice: SIGNAL_COPY.suspicious_tld.advice,
    });
  }
  if (URL_SHORTENERS_SET.has(host)) {
    signals.push({
      id: 'url_shortener',
      severity: 'medium',
      label: SIGNAL_COPY.url_shortener.label,
      evidence: sanitizeEvidence(`Shortener domain: ${host}`),
      advice: SIGNAL_COPY.url_shortener.advice,
    });
  }
  checkPortSignal(url, signals);
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
  const encodingSignals = extractUrlEncodingSignals(url, originalOrNormalized);
  return [...signals, ...encodingSignals];
}
