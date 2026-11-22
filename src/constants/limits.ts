import type { PasswordStrengthLevel } from '../types/password';

export const URL_MAX_LENGTH = 2048;
export const MESSAGE_MAX_LENGTH = 4000;
export const PASSWORD_MAX_LENGTH = 128;
export const EVIDENCE_MAX_LENGTH = 80;
export const MAX_EMBEDDED_URLS = 5;

export const URL_LONG_THRESHOLD = 75;
export const SUBDOMAIN_EXCESS_THRESHOLD = 3;
export const HYPHENS_EXCESS_THRESHOLD = 3;
export const PERCENT_ENCODED_THRESHOLD = 3;
export const PHISHING_KEYWORD_MEDIUM_COUNT = 2;

export const SHOUTING_UPPERCASE_RATIO = 0.4;
export const SHOUTING_MIN_WORD_LENGTH = 4;
export const SHOUTING_EXCLAMATION_THRESHOLD = 3;
export const MAX_EXPLAIN_SIGNALS = 12;

export const TOP_SIGNALS_COUNT = 3;
export const CLIPBOARD_RESET_MS = 2000;
export const ICON_SIZE_SM = 12;
export const ICON_SIZE_MD = 14;
export const ENTROPY_DECIMAL_MULTIPLIER = 10;
export const MIN_PASS_CHECK_LENGTH = 12;
export const KEYBOARD_SLICE_LENGTH = 4;
export const MULTI_PART_SLICE = 3;
export const BRAND_SHORT_TOKEN_LENGTH = 6;
export const MAX_ENTROPY_CAP = 128;
export const DEFAULT_PASSWORD_LEVEL: PasswordStrengthLevel = 3;
export const TOTAL_APP_CHECKS = 3;
