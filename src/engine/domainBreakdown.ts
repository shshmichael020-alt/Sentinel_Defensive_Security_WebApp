import { MULTI_PART_SLICE } from '../constants/limits';
import { MULTI_PART_SUFFIXES_SET } from '../constants/urlRules';

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
  const isMultiPart = MULTI_PART_SUFFIXES_SET.has(lastTwoJoined);
  const registrablePartsCount = isMultiPart ? MULTI_PART_SLICE : 2;

  const registrableSlice = parts.slice(Math.max(0, parts.length - registrablePartsCount));
  const subdomainSlice = parts.slice(0, Math.max(0, parts.length - registrablePartsCount));

  return {
    hostname,
    registrableDomain: registrableSlice.join('.'),
    mainLabel: registrableSlice[0] ?? '',
    subdomain: subdomainSlice.join('.'),
    subdomainLabelsCount: subdomainSlice.length,
  };
}
