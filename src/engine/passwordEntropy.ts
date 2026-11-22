import { POOL_SIZES } from '../constants/passwordRules';
import { ENTROPY_DECIMAL_MULTIPLIER } from '../constants/limits';

export interface CharPoolBreakdown {
  readonly hasLower: boolean;
  readonly hasUpper: boolean;
  readonly hasDigits: boolean;
  readonly hasSymbols: boolean;
  readonly poolSize: number;
}

/**
 * Calculates character pool diversity for a candidate password.
 *
 * @param password - The password string.
 * @returns Character pool breakdown and total pool size.
 */
export function getCharPool(password: string): CharPoolBreakdown {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += POOL_SIZES.LOWER;
  if (hasUpper) poolSize += POOL_SIZES.UPPER;
  if (hasDigits) poolSize += POOL_SIZES.DIGITS;
  if (hasSymbols) poolSize += POOL_SIZES.SYMBOLS;

  return { hasLower, hasUpper, hasDigits, hasSymbols, poolSize };
}

/**
 * Calculates theoretical raw Shannon entropy bits based on character pool diversity.
 * Formula: length * log2(poolSize).
 *
 * @param password - The candidate password.
 * @returns Raw entropy in bits.
 */
export function computeRawEntropy(password: string): number {
  if (password.length === 0) return 0;
  const { poolSize } = getCharPool(password);
  if (poolSize === 0) return 0;
  const entropy = password.length * Math.log2(poolSize);
  return Math.round(entropy * ENTROPY_DECIMAL_MULTIPLIER) / ENTROPY_DECIMAL_MULTIPLIER;
}
