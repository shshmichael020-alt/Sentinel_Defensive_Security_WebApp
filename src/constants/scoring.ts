import type { Severity, Verdict } from '../types/severity';

export const SEVERITY_WEIGHTS: Readonly<Record<Severity, number>> = {
  info: 0,
  low: 8,
  medium: 18,
  high: 35,
  critical: 60,
};

export const VERDICT_THRESHOLDS = {
  LOW_MAX: 19,
  CAUTION_MAX: 44,
  SUSPICIOUS_MAX: 69,
  DANGEROUS_MAX: 100,
} as const;

export const VERDICTS: Readonly<Record<Verdict, Verdict>> = {
  'Low risk': 'Low risk',
  Caution: 'Caution',
  Suspicious: 'Suspicious',
  Dangerous: 'Dangerous',
};
