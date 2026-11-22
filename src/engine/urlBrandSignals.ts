import type { Signal } from '../types/signal';
import { SIGNAL_COPY } from '../constants/copy';
import {
  SUBDOMAIN_EXCESS_THRESHOLD,
  EVIDENCE_MAX_LENGTH,
  BRAND_SHORT_TOKEN_LENGTH,
} from '../constants/limits';
import { BRANDS, OFFICIAL_DOMAIN_TO_BRAND, type BrandEntry } from '../constants/brands';
import { levenshtein } from './levenshtein';
import { normalizeHomoglyphs } from './normalizeHomoglyphs';
import { extractDomainBreakdown, type DomainBreakdown } from './domainBreakdown';

export { extractDomainBreakdown, type DomainBreakdown };

interface NormalizedToken {
  readonly raw: string;
  readonly normalized: string;
}

function isTokenLookalike(token: NormalizedToken, brand: BrandEntry): boolean {
  const distanceLimit = brand.token.length <= BRAND_SHORT_TOKEN_LENGTH ? 1 : 2;
  const distance = levenshtein(token.normalized, brand.token);
  const isClose = distance <= distanceLimit && distance > 0;
  const isExactHomoglyph = token.normalized === brand.token && token.raw !== brand.token;
  const isExactBrand = token.normalized === brand.token;
  return isClose || isExactHomoglyph || isExactBrand;
}

function checkLookalikeForBrand(
  tokens: readonly NormalizedToken[],
  brand: BrandEntry,
  registrableDomain: string,
): Signal | null {
  const matched = tokens.some((token) => isTokenLookalike(token, brand));
  if (matched) {
    const evidenceText = `Look-alike of ${brand.name} in domain ${registrableDomain}`;
    return {
      id: 'brand_lookalike',
      severity: 'critical',
      label: SIGNAL_COPY.brand_lookalike.label,
      evidence: evidenceText.slice(0, EVIDENCE_MAX_LENGTH),
      advice: SIGNAL_COPY.brand_lookalike.advice,
    };
  }
  return null;
}

function checkSubdomainOrPathBrand(
  url: URL,
  breakdown: DomainBreakdown,
  brand: BrandEntry,
): Signal | null {
  const checkArea = `${breakdown.subdomain}/${url.pathname}`.toLowerCase();
  if (checkArea.includes(brand.token)) {
    const ev = `Brand token "${brand.token}" found in non-registrable path or subdomain`;
    return {
      id: 'brand_in_subdomain_or_path',
      severity: 'high',
      label: SIGNAL_COPY.brand_in_subdomain_or_path.label,
      evidence: ev.slice(0, EVIDENCE_MAX_LENGTH),
      advice: SIGNAL_COPY.brand_in_subdomain_or_path.advice,
    };
  }
  return null;
}

function evaluateBrandImpersonation(
  url: URL,
  breakdown: DomainBreakdown,
  tokens: readonly NormalizedToken[],
  signals: Signal[],
): void {
  for (const brand of BRANDS) {
    const lookalike = checkLookalikeForBrand(tokens, brand, breakdown.registrableDomain);
    if (lookalike) {
      signals.push(lookalike);
      break;
    }
    const subOrPath = checkSubdomainOrPathBrand(url, breakdown, brand);
    if (subOrPath) {
      signals.push(subOrPath);
      break;
    }
  }
}

function checkSubdomainExcess(breakdown: DomainBreakdown, signals: Signal[]): void {
  if (breakdown.subdomainLabelsCount > SUBDOMAIN_EXCESS_THRESHOLD) {
    signals.push({
      id: 'excess_subdomains',
      severity: 'medium',
      label: SIGNAL_COPY.excess_subdomains.label,
      evidence: `${String(breakdown.subdomainLabelsCount)} subdomain labels`.slice(0, EVIDENCE_MAX_LENGTH),
      advice: SIGNAL_COPY.excess_subdomains.advice,
    });
  }
}

function prepareBrandTokens(mainLabel: string): NormalizedToken[] {
  const rawTokens = [mainLabel, ...mainLabel.split('-')].filter((t) => t.length > 0);
  return rawTokens.map((raw) => ({
    raw,
    normalized: normalizeHomoglyphs(raw),
  }));
}

/**
 * Evaluates brand impersonation, spoofing, and official domain matching.
 *
 * @param url - Parsed standard URL.
 * @param breakdown - Extracted domain breakdown.
 * @returns Array of brand-related signals.
 */
export function extractUrlBrandSignals(url: URL, breakdown: DomainBreakdown): Signal[] {
  const signals: Signal[] = [];
  checkSubdomainExcess(breakdown, signals);

  const officialBrand = OFFICIAL_DOMAIN_TO_BRAND.get(breakdown.registrableDomain);
  if (officialBrand) {
    if (signals.length === 0) {
      signals.push({
        id: 'official_domain_match',
        severity: 'info',
        label: SIGNAL_COPY.official_domain_match.label,
        evidence: `Official domain for ${officialBrand.name}`.slice(0, EVIDENCE_MAX_LENGTH),
        advice: SIGNAL_COPY.official_domain_match.advice,
      });
    }
    return signals;
  }

  const tokens = prepareBrandTokens(breakdown.mainLabel);
  evaluateBrandImpersonation(url, breakdown, tokens, signals);
  return signals;
}

