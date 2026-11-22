import { HOMOGLYPH_MAP, MULTI_CHAR_HOMOGLYPHS } from '../constants/homoglyphs';

/**
 * Normalizes visual homoglyphs and leetspeak substitutions to combat spoofing.
 * Converts characters (e.g. 0->o, 1->l, 5->s, 3->e, 4->a, rn->m, vv->w) and strips hyphens.
 *
 * @param input - The raw domain label or token to normalize.
 * @returns The normalized lowercase string.
 */
export function normalizeHomoglyphs(input: string): string {
  let result = input.toLowerCase().replaceAll('-', '');

  for (const [pattern, replacement] of MULTI_CHAR_HOMOGLYPHS) {
    result = result.replaceAll(pattern, replacement);
  }

  let charBuffer = '';
  for (let i = 0; i < result.length; i += 1) {
    const char = result.charAt(i);
    charBuffer += HOMOGLYPH_MAP[char] ?? char;
  }

  return charBuffer;
}
