import { URL_MAX_LENGTH } from '../constants/limits';

export interface ParsedUrlSuccess {
  readonly status: 'valid';
  readonly url: URL;
  readonly normalizedInput: string;
  readonly prependedHttps: boolean;
}

export type ParsedUrlResult =
  | { readonly status: 'empty' }
  | { readonly status: 'invalid'; readonly reason: string }
  | ParsedUrlSuccess;

/**
 * Parses and validates an input URL candidate safely.
 * Caps length at 2048 characters, automatically prepends https:// if scheme is missing,
 * and validates URL structure.
 *
 * @param input - The raw string from the user or message.
 * @returns Discriminated union indicating empty, invalid, or valid parsed URL.
 */
export function parseUrl(input: string): ParsedUrlResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { status: 'empty' };
  }

  if (trimmed.length > URL_MAX_LENGTH) {
    return {
      status: 'invalid',
      reason: `URL exceeds maximum supported length of ${String(URL_MAX_LENGTH)} characters.`,
    };
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
  const normalized = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(normalized);
    return {
      status: 'valid',
      url: parsed,
      normalizedInput: normalized,
      prependedHttps: !hasScheme,
    };
  } catch {
    return {
      status: 'invalid',
      reason: 'Malformed URL: Unable to parse host and scheme structure.',
    };
  }
}
