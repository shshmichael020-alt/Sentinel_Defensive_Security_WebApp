import type {
  PasswordAnalysisResult,
  PasswordStrengthLevel,
  PasswordStrengthLabel,
  PasswordChecklistItem,
} from '../types/password';
import {
  PASSWORD_MAX_LENGTH,
  MIN_PASS_CHECK_LENGTH,
  ENTROPY_DECIMAL_MULTIPLIER,
} from '../constants/limits';
import {
  PASSWORD_PENALTIES,
  ENTROPY_THRESHOLDS,
  STRENGTH_LEVELS,
} from '../constants/passwordRules';
import { getCharPool, computeRawEntropy } from './passwordEntropy';
import { detectPasswordPatterns } from './passwordPatterns';
import { estimateCrackTime } from './crackTime';

const LEVEL_ENTROPY_THRESHOLDS = [
  { max: ENTROPY_THRESHOLDS.VERY_WEAK_MAX, index: 0 },
  { max: ENTROPY_THRESHOLDS.WEAK_MAX, index: 1 },
  { max: ENTROPY_THRESHOLDS.FAIR_MAX, index: 2 },
  { max: ENTROPY_THRESHOLDS.STRONG_MAX, index: 3 },
] as const;

function getStrengthLevel(entropy: number): {
  level: PasswordStrengthLevel;
  label: PasswordStrengthLabel;
} {
  const fallback = STRENGTH_LEVELS[0] ?? { level: 0 as const, label: 'Very weak' as const };
  for (const item of LEVEL_ENTROPY_THRESHOLDS) {
    if (entropy < item.max) {
      return STRENGTH_LEVELS[item.index] ?? fallback;
    }
  }
  return STRENGTH_LEVELS[4] ?? fallback;
}

function buildChecklist(
  pwd: string,
  hasLower: boolean,
  hasUpper: boolean,
  hasDigits: boolean,
  hasSymbols: boolean,
  isCommon: boolean,
  penalties: readonly string[],
): PasswordChecklistItem[] {
  const hasPattern = penalties.some((p) =>
    p.includes('keyboard') || p.includes('repeated') || p.includes('sequential'),
  );

  return [
    { id: 'length', label: 'Minimum 12 characters length', passed: pwd.length >= MIN_PASS_CHECK_LENGTH },
    { id: 'mixed-case', label: 'Includes uppercase and lowercase letters', passed: hasLower && hasUpper },
    { id: 'digits', label: 'Includes at least one numeric digit', passed: hasDigits },
    { id: 'symbols', label: 'Includes at least one special symbol', passed: hasSymbols },
    { id: 'not-common', label: 'Not found in common password databases', passed: !isCommon },
    { id: 'no-patterns', label: 'No keyboard walks, repeats, or sequences', passed: !hasPattern },
  ];
}

/**
 * Evaluates password resilience locally in the client without transmitting data.
 * Computes Shannon entropy, deducts pattern penalties, and determines crack times.
 *
 * @param input - The raw password string.
 * @returns Password analysis result with entropy, strength level, and checklist.
 */
export function analyzePassword(input: string): PasswordAnalysisResult {
  if (input.length === 0) return { status: 'empty' };

  const bounded = input.slice(0, PASSWORD_MAX_LENGTH);
  const rawEntropy = computeRawEntropy(bounded);
  const pool = getCharPool(bounded);
  const { isCommon, penalties, totalPenaltyBits } = detectPasswordPatterns(bounded);

  const effectiveEntropy = isCommon
    ? Math.min(PASSWORD_PENALTIES.COMMON_PASSWORD_CAP, rawEntropy)
    : Math.max(0, Math.round((rawEntropy - totalPenaltyBits) * ENTROPY_DECIMAL_MULTIPLIER) / ENTROPY_DECIMAL_MULTIPLIER);

  const { level, label } = getStrengthLevel(effectiveEntropy);
  const crack = estimateCrackTime(effectiveEntropy);
  const checklist = buildChecklist(
    bounded,
    pool.hasLower,
    pool.hasUpper,
    pool.hasDigits,
    pool.hasSymbols,
    isCommon,
    penalties,
  );

  return {
    status: 'ok',
    rawEntropy,
    effectiveEntropy,
    level,
    label,
    crackTimeOnline: crack.online,
    crackTimeOffline: crack.offline,
    crackTimeGpu: crack.gpu,
    checklist,
    penalties,
  };
}
