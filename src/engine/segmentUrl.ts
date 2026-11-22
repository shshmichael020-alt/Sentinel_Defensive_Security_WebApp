import type { Signal, SignalId } from '../types/signal';
import type { UrlSegment, SegmentKind } from '../types/analysis';
import type { DomainBreakdown } from './urlBrandSignals';

interface SegmentDef {
  readonly kind: SegmentKind;
  readonly text: string;
  readonly flagged: boolean;
  readonly reason?: SignalId | undefined;
}

function findReason(signals: readonly Signal[], ids: SignalId[]): SignalId | undefined {
  return signals.find((s) => ids.includes(s.id))?.id;
}

function extractScheme(rem: string, sigs: readonly Signal[], segs: SegmentDef[]): string {
  const match = /^[a-zA-Z][a-zA-Z0-9+.-]*:(?:\/\/)*/.exec(rem);
  const text = match ? match[0] : '';
  if (text.length > 0) {
    const flagged = sigs.some((s) => s.id === 'no_https' || s.id === 'dangerous_scheme');
    segs.push({ kind: 'scheme', text, flagged, reason: findReason(sigs, ['dangerous_scheme', 'no_https']) });
    return rem.slice(text.length);
  }
  return rem;
}

function extractUserinfo(rem: string, segs: SegmentDef[]): string {
  if (rem.includes('@')) {
    const atIdx = rem.indexOf('@');
    const text = rem.slice(0, atIdx + 1);
    segs.push({ kind: 'subdomain', text, flagged: true, reason: 'userinfo_at' });
    return rem.slice(text.length);
  }
  return rem;
}

function extractSubdomain(rem: string, b: DomainBreakdown, sigs: readonly Signal[], segs: SegmentDef[]): string {
  if (b.subdomain.length > 0 && rem.startsWith(b.subdomain)) {
    const text = `${b.subdomain}.`;
    const flagged = sigs.some((s) => s.id === 'excess_subdomains' || s.id === 'brand_in_subdomain_or_path');
    segs.push({ kind: 'subdomain', text, flagged, reason: findReason(sigs, ['brand_in_subdomain_or_path', 'excess_subdomains']) });
    return rem.slice(text.length);
  }
  return rem;
}

function extractDomain(rem: string, url: URL, b: DomainBreakdown, sigs: readonly Signal[], segs: SegmentDef[]): string {
  const portSuffix = url.port.length > 0 ? `:${url.port}` : '';
  const domainWithPort = `${b.registrableDomain}${portSuffix}`;
  const text = rem.startsWith(domainWithPort) ? domainWithPort : b.registrableDomain;
  const flagged = sigs.some((s) => ['brand_lookalike', 'ip_host', 'punycode_idn', 'suspicious_tld', 'url_shortener', 'many_hyphens', 'nonstandard_port'].includes(s.id));
  const reason = findReason(sigs, ['brand_lookalike', 'ip_host', 'punycode_idn', 'suspicious_tld', 'url_shortener', 'nonstandard_port', 'many_hyphens']);
  segs.push({ kind: 'domain', text, flagged, reason });
  return rem.slice(text.length);
}

function extractPathAndQuery(rem: string, sigs: readonly Signal[], segs: SegmentDef[]): void {
  const queryIndex = rem.indexOf('?');
  const pathPart = queryIndex === -1 ? rem : rem.slice(0, queryIndex);
  if (pathPart.length > 0) {
    const flagged = sigs.some((s) => s.id === 'phishing_keywords' || s.id === 'encoded_obfuscation');
    segs.push({ kind: 'path', text: pathPart, flagged, reason: findReason(sigs, ['phishing_keywords', 'encoded_obfuscation']) });
  }
  const queryPart = queryIndex === -1 ? '' : rem.slice(queryIndex);
  if (queryPart.length > 0) {
    const flagged = sigs.some((s) => s.id === 'embedded_redirect');
    segs.push({ kind: 'query', text: queryPart, flagged, reason: flagged ? 'embedded_redirect' : undefined });
  }
}

/**
 * Splits a URL into structured, ordered segments for the Attack Anatomy visualization.
 * CRITICAL INVARIANT: Concatenating segment text MUST reproduce the displayed URL.
 *
 * @param url - Parsed URL instance.
 * @param displayedUrl - The exact normalized URL string displayed in UI.
 * @param signals - Computed risk signals for this URL.
 * @param breakdown - Extracted domain components.
 * @returns Ordered array of URL segments.
 */
export function segmentUrl(
  url: URL,
  displayedUrl: string,
  signals: readonly Signal[],
  breakdown: DomainBreakdown,
): UrlSegment[] {
  const segments: SegmentDef[] = [];
  let rem = extractScheme(displayedUrl, signals, segments);
  rem = extractUserinfo(rem, segments);
  rem = extractSubdomain(rem, breakdown, signals, segments);
  rem = extractDomain(rem, url, breakdown, signals, segments);
  extractPathAndQuery(rem, signals, segments);
  return segments;
}
