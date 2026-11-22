export const SEVERITIES = ['info', 'low', 'medium', 'high', 'critical'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const VERDICTS = ['Low risk', 'Caution', 'Suspicious', 'Dangerous'] as const;
export type Verdict = (typeof VERDICTS)[number];

/**
 * Exhaustiveness check helper for TypeScript discriminated unions and switches.
 *
 * @param value - Unreachable value in exhaustive match.
 * @returns Never returns.
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
