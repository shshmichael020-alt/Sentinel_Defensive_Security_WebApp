import {
  CHARSET_LOWER,
  CHARSET_UPPER,
  CHARSET_DIGITS,
  CHARSET_SYMBOLS,
  DEFAULT_GENERATED_LENGTH,
  MIN_GENERATED_LENGTH,
  MAX_GENERATED_LENGTH,
} from '../constants/passwordRules';

const ALL_CHARSET = `${CHARSET_LOWER}${CHARSET_UPPER}${CHARSET_DIGITS}${CHARSET_SYMBOLS}`;
const UINT32_RANGE = 4294967296;

export type RngFunction = (max: number) => number;

function defaultCryptoRng(max: number): number {
  const limit = Math.floor(UINT32_RANGE / max) * max;
  const buffer = new Uint32Array(1);

  let rand = 0;
  do {
    crypto.getRandomValues(buffer);
    rand = buffer[0] ?? 0;
  } while (rand >= limit);

  return rand % max;
}

function pickRandomChar(charset: string, rng: RngFunction): string {
  const index = rng(charset.length);
  return charset.charAt(index);
}

/**
 * Generates a cryptographically strong password using rejection sampling.
 * Excludes ambiguous characters (0, O, o, 1, l, I) and guarantees at least one
 * character from each class: lowercase, uppercase, digit, and symbol.
 *
 * @param length - Desired character count (default 20, clamped between 12 and 64).
 * @param rng - Optional custom RNG function for deterministic testing.
 * @returns Generated secure password.
 */
export function generatePassword(
  length: number = DEFAULT_GENERATED_LENGTH,
  rng: RngFunction = defaultCryptoRng,
): string {
  const safeLength = Math.max(MIN_GENERATED_LENGTH, Math.min(MAX_GENERATED_LENGTH, length));

  // Guarantee at least one of each class
  const chars: string[] = [
    pickRandomChar(CHARSET_LOWER, rng),
    pickRandomChar(CHARSET_UPPER, rng),
    pickRandomChar(CHARSET_DIGITS, rng),
    pickRandomChar(CHARSET_SYMBOLS, rng),
  ];

  while (chars.length < safeLength) {
    chars.push(pickRandomChar(ALL_CHARSET, rng));
  }

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = rng(i + 1);
    const temp = chars[i] ?? '';
    chars[i] = chars[j] ?? '';
    chars[j] = temp;
  }

  return chars.join('');
}
