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
import { getCharPool, computeRawEntropy, type CharPoolBreakdown } from './passwordEntropy';
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
  pool: CharPoolBreakdown,
  isCommon: boolean,
  penalties: readonly string[],
): PasswordChecklistItem[] {
  const hasPattern = penalties.some((p) =>
    p.includes('keyboard') || p.includes('repeated') || p.includes('sequential'),
  );

  return [
    { id: 'length', label: 'Minimum 12 characters length', passed: pwd.length >= MIN_PASS_CHECK_LENGTH },
    { id: 'mixed-case', label: 'Includes uppercase and lowercase letters', passed: pool.hasLower && pool.hasUpper },
    { id: 'digits', label: 'Includes at least one numeric digit', passed: pool.hasDigits },
    { id: 'symbols', label: 'Includes at least one special symbol', passed: pool.hasSymbols },
    { id: 'not-common', label: 'Not found in common password databases', passed: !isCommon },
    { id: 'no-patterns', label: 'No keyboard walks, repeats, or sequences', passed: !hasPattern },
  ];
}

function computeEffectiveEntropy(isCommon: boolean, raw: number, penalty: number): number {
  if (isCommon) {
    return Math.min(PASSWORD_PENALTIES.COMMON_PASSWORD_CAP, raw);
  }
  return Math.max(0, Math.round((raw - penalty) * ENTROPY_DECIMAL_MULTIPLIER) / ENTROPY_DECIMAL_MULTIPLIER);
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

  const effectiveEntropy = computeEffectiveEntropy(isCommon, rawEntropy, totalPenaltyBits);
  const { level, label } = getStrengthLevel(effectiveEntropy);
  const crack = estimateCrackTime(effectiveEntropy);
  const checklist = buildChecklist(bounded, pool, isCommon, penalties);

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
