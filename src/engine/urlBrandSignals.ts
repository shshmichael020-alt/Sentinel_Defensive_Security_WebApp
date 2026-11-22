import type { Signal } from '../types/signal';
import { SIGNAL_COPY } from '../constants/copy';
import {
  SUBDOMAIN_EXCESS_THRESHOLD,
  EVIDENCE_MAX_LENGTH,
  MULTI_PART_SLICE,
  BRAND_SHORT_TOKEN_LENGTH,
} from '../constants/limits';
import { MULTI_PART_SUFFIXES } from '../constants/urlRules';
import { BRANDS, type BrandEntry } from '../constants/brands';
import { levenshtein } from './levenshtein';
import { normalizeHomoglyphs } from './normalizeHomoglyphs';

export interface DomainBreakdown {
  readonly hostname: string;
  readonly registrableDomain: string;
  readonly mainLabel: string;
  readonly subdomain: string;
  readonly subdomainLabelsCount: number;
}

/**
 * Extracts registrable domain and subdomain parts without external PSL dependencies.
 *
 * @param hostname - Full lowercase hostname.
 * @returns Breakdown of domain components.
 */
export function extractDomainBreakdown(hostname: string): DomainBreakdown {
  const parts = hostname.split('.').filter((p) => p.length > 0);
  if (parts.length <= 2) {
    return {
      hostname,
      registrableDomain: hostname,
      mainLabel: parts[0] ?? hostname,
      subdomain: '',
      subdomainLabelsCount: 0,
    };
  }

  const lastTwoJoined = `${parts[parts.length - 2] ?? ''}.${parts[parts.length - 1] ?? ''}`;
  const isMultiPart = MULTI_PART_SUFFIXES.includes(lastTwoJoined);
  const registrablePartsCount = isMultiPart ? MULTI_PART_SLICE : 2;

  const registrableSlice = parts.slice(Math.max(0, parts.length - registrablePartsCount));
  const subdomainSlice = parts.slice(0, Math.max(0, parts.length - registrablePartsCount));

  const registrableDomain = registrableSlice.join('.');
  const mainLabel = registrableSlice[0] ?? '';
  const subdomain = subdomainSlice.join('.');

  return {
    hostname,
    registrableDomain,
    mainLabel,
    subdomain,
    subdomainLabelsCount: subdomainSlice.length,
  };
}

function isTokenLookalike(token: string, brand: BrandEntry): boolean {
  const normalized = normalizeHomoglyphs(token);
  const distanceLimit = brand.token.length <= BRAND_SHORT_TOKEN_LENGTH ? 1 : 2;
  const distance = levenshtein(normalized, brand.token);
  const isClose = distance <= distanceLimit && distance > 0;
  const isExactHomoglyph = normalized === brand.token && token !== brand.token;
  const isExactBrand = normalized === brand.token;
  return isClose || isExactHomoglyph || isExactBrand;
}

function checkLookalikeForBrand(
  mainLabel: string,
  brand: BrandEntry,
  registrableDomain: string,
): Signal | null {
  if (brand.officialDomains.includes(registrableDomain)) {
    return null;
  }

  const tokensToCheck = [mainLabel, ...mainLabel.split('-')].filter((t) => t.length > 0);
  const matched = tokensToCheck.some((token) => isTokenLookalike(token, brand));

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
  if (brand.officialDomains.includes(breakdown.registrableDomain)) {
    return null;
  }
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

/**
 * Evaluates brand impersonation, spoofing, and official domain matching.
 *
 * @param url - Parsed standard URL.
 * @param breakdown - Extracted domain breakdown.
 * @returns Array of brand-related signals.
 */
export function extractUrlBrandSignals(url: URL, breakdown: DomainBreakdown): Signal[] {
  const signals: Signal[] = [];

  if (breakdown.subdomainLabelsCount > SUBDOMAIN_EXCESS_THRESHOLD) {
    signals.push({
      id: 'excess_subdomains',
      severity: 'medium',
      label: SIGNAL_COPY.excess_subdomains.label,
      evidence: `${String(breakdown.subdomainLabelsCount)} subdomain labels`.slice(0, EVIDENCE_MAX_LENGTH),
      advice: SIGNAL_COPY.excess_subdomains.advice,
    });
  }

  let matchedOfficial = false;
  for (const brand of BRANDS) {
    if (brand.officialDomains.includes(breakdown.registrableDomain)) {
      matchedOfficial = true;
      signals.push({
        id: 'official_domain_match',
        severity: 'info',
        label: SIGNAL_COPY.official_domain_match.label,
        evidence: `Official domain for ${brand.name}`.slice(0, EVIDENCE_MAX_LENGTH),
        advice: SIGNAL_COPY.official_domain_match.advice,
      });
      break;
    }

    const lookalike = checkLookalikeForBrand(breakdown.mainLabel, brand, breakdown.registrableDomain);
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

  if (matchedOfficial && signals.length > 1) {
    return signals.filter((s) => s.id !== 'official_domain_match');
  }

  return signals;
}
