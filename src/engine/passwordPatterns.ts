import { COMMON_PASSWORDS } from '../constants/commonPasswords';
import {
  PASSWORD_PENALTIES,
  KEYBOARD_PATTERNS,
} from '../constants/passwordRules';
import { KEYBOARD_SLICE_LENGTH } from '../constants/limits';
import { normalizeHomoglyphs } from './normalizeHomoglyphs';

export interface PatternPenaltyResult {
  readonly isCommon: boolean;
  readonly penalties: readonly string[];
  readonly totalPenaltyBits: number;
}

function checkSequential(pwd: string): boolean {
  const lower = pwd.toLowerCase();
  for (let i = 0; i < lower.length - 2; i += 1) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);
    if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
      return true;
    }
  }
  return false;
}

function countKeyboardRuns(pwd: string): number {
  const lower = pwd.toLowerCase();
  let count = 0;
  for (const pattern of KEYBOARD_PATTERNS) {
    for (let i = 0; i <= pattern.length - KEYBOARD_SLICE_LENGTH; i += 1) {
      const slice = pattern.slice(i, i + KEYBOARD_SLICE_LENGTH);
      if (lower.includes(slice)) {
        count += 1;
        break;
      }
    }
  }
  return count;
}

function checkHeuristicRules(pwd: string, penalties: string[]): number {
  let penalty = 0;
  if (/(.)\1{2,}/.test(pwd)) {
    penalties.push('Contains repeated character run (3+ identical chars)');
    penalty += PASSWORD_PENALTIES.REPEATED_RUN;
  }
  if (checkSequential(pwd)) {
    penalties.push('Contains sequential alphabet or digit run');
    penalty += PASSWORD_PENALTIES.SEQUENTIAL_RUN;
  }
  if (/\b(?:19[5-9]\d|20[0-3]\d)\b/.test(pwd)) {
    penalties.push('Contains calendar year in range 1950-2039');
    penalty += PASSWORD_PENALTIES.YEAR_IN_RANGE;
  }
  if (/^[a-zA-Z]+$/.test(pwd) || /^[0-9]+$/.test(pwd)) {
    penalties.push('Only letters or only numbers without character diversity');
    penalty += PASSWORD_PENALTIES.ONLY_LETTERS_OR_DIGITS;
  }
  if (/(?:password|admin|welcome)/i.test(pwd)) {
    penalties.push('Contains predictable dictionary word (password/admin/welcome)');
    penalty += PASSWORD_PENALTIES.SUSPICIOUS_WORD;
  }
  return penalty;
}

/**
 * Detects common vulnerabilities, dictionary words, and keyboard patterns.
 *
 * @param password - Candidate password.
 * @returns Result with pattern flags and bit deductions.
 */
export function detectPasswordPatterns(password: string): PatternPenaltyResult {
  const penalties: string[] = [];
  const lower = password.toLowerCase();
  const normalized = normalizeHomoglyphs(lower);

  const isCommon = COMMON_PASSWORDS.includes(lower) || COMMON_PASSWORDS.includes(normalized);
  if (isCommon) {
    penalties.push('Matches known common password list');
    return { isCommon: true, penalties, totalPenaltyBits: 0 };
  }

  let totalPenalty = 0;
  const kbCount = countKeyboardRuns(password);
  if (kbCount > 0) {
    penalties.push(`${String(kbCount)} keyboard sequence(s) detected (e.g. qwerty, 12345)`);
    totalPenalty += kbCount * PASSWORD_PENALTIES.KEYBOARD_RUN;
  }

  totalPenalty += checkHeuristicRules(password, penalties);

  return { isCommon: false, penalties, totalPenaltyBits: totalPenalty };
}
