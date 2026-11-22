import type { PasswordStrengthLevel, PasswordStrengthLabel } from '../types/password';

export const POOL_SIZES = {
  LOWER: 26,
  UPPER: 26,
  DIGITS: 10,
  SYMBOLS: 33,
} as const;

export const PASSWORD_PENALTIES = {
  COMMON_PASSWORD_CAP: 10,
  KEYBOARD_RUN: 20,
  REPEATED_RUN: 8,
  SEQUENTIAL_RUN: 10,
  YEAR_IN_RANGE: 6,
  ONLY_LETTERS_OR_DIGITS: 6,
  SUSPICIOUS_WORD: 15,
} as const;

export const ENTROPY_THRESHOLDS = {
  VERY_WEAK_MAX: 28,
  WEAK_MAX: 36,
  FAIR_MAX: 60,
  STRONG_MAX: 80,
} as const;

export const STRENGTH_LEVELS: readonly {
  readonly level: PasswordStrengthLevel;
  readonly label: PasswordStrengthLabel;
}[] = [
  { level: 0, label: 'Very weak' },
  { level: 1, label: 'Weak' },
  { level: 2, label: 'Fair' },
  { level: 3, label: 'Strong' },
  { level: 4, label: 'Very strong' },
];

export const KEYBOARD_PATTERNS: readonly string[] = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1234567890',
  '1qaz2wsx3edc',
  'qazwsxedcrfv',
  'poiuytrewq',
  'lkjhgfdsa',
  'mnbvcxz',
  '0987654321',
];

export const CRACK_SPEEDS = {
  ONLINE_THROTTLED: 1e3,
  OFFLINE_FAST_HASH: 1e10,
  OFFLINE_GPU_CLUSTER: 1e11,
} as const;

export const AMBIGUOUS_CHARS = new Set(['0', 'O', 'o', '1', 'l', 'I']);

export const CHARSET_LOWER = 'abcdefghijkmnpqrstuvwxyz';
export const CHARSET_UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
export const CHARSET_DIGITS = '23456789';
export const CHARSET_SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
export const DEFAULT_GENERATED_LENGTH = 20;
export const MIN_GENERATED_LENGTH = 12;
export const MAX_GENERATED_LENGTH = 64;
