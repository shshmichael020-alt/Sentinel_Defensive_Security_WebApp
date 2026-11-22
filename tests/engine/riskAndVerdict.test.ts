import { describe, it, expect } from 'vitest';
import { combineRisk } from '../../src/engine/combineRisk';
import { getVerdictFromScore } from '../../src/engine/verdict';

describe('combineRisk', () => {
  it('returns 0 when signals array is empty', () => {
    expect(combineRisk([])).toBe(0);
  });

  it('calculates single critical signal as 60', () => {
    expect(combineRisk([{ severity: 'critical' }])).toBe(60);
  });

  it('calculates two high signals as 58', () => {
    // 1 - (1 - 0.35)^2 = 1 - 0.65^2 = 1 - 0.4225 = 0.5775 -> 58
    expect(combineRisk([{ severity: 'high' }, { severity: 'high' }])).toBe(58);
  });

  it('calculates critical + high as 74', () => {
    // 1 - (1 - 0.60)*(1 - 0.35) = 1 - 0.40 * 0.65 = 1 - 0.26 = 0.74 -> 74
    expect(combineRisk([{ severity: 'critical' }, { severity: 'high' }])).toBe(74);
  });

  it('is monotonic when adding more signals', () => {
    const s1 = combineRisk([{ severity: 'low' }]);
    const s2 = combineRisk([{ severity: 'low' }, { severity: 'low' }]);
    const s3 = combineRisk([{ severity: 'low' }, { severity: 'low' }, { severity: 'medium' }]);
    expect(s2).toBeGreaterThanOrEqual(s1);
    expect(s3).toBeGreaterThanOrEqual(s2);
  });

  it('clamps correctly between 0 and 100', () => {
    const extreme = combineRisk([
      { severity: 'critical' },
      { severity: 'critical' },
      { severity: 'critical' },
      { severity: 'critical' },
    ]);
    expect(extreme).toBeLessThanOrEqual(100);
    expect(extreme).toBeGreaterThan(90);
  });

  it('ignores info severity with zero weight', () => {
    expect(combineRisk([{ severity: 'info' }])).toBe(0);
    expect(combineRisk([{ severity: 'info' }, { severity: 'low' }])).toBe(8);
  });
});

describe('getVerdictFromScore boundaries', () => {
  it('evaluates exact boundary at 19 (Low risk) vs 20 (Caution)', () => {
    expect(getVerdictFromScore(19)).toBe('Low risk');
    expect(getVerdictFromScore(20)).toBe('Caution');
  });

  it('evaluates exact boundary at 44 (Caution) vs 45 (Suspicious)', () => {
    expect(getVerdictFromScore(44)).toBe('Caution');
    expect(getVerdictFromScore(45)).toBe('Suspicious');
  });

  it('evaluates exact boundary at 69 (Suspicious) vs 70 (Dangerous)', () => {
    expect(getVerdictFromScore(69)).toBe('Suspicious');
    expect(getVerdictFromScore(70)).toBe('Dangerous');
  });
});
