import { describe, it, expect } from 'vitest';
import { analyzePassword } from '../../src/engine/analyzePassword';
import { humanizeDuration } from '../../src/engine/crackTime';

describe('analyzePassword', () => {
  it('returns empty for empty input', () => {
    expect(analyzePassword('')).toEqual({ status: 'empty' });
  });

  it('caps common password effective entropy at 10 bits', () => {
    const res = analyzePassword('password123');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.effectiveEntropy).toBeLessThanOrEqual(10);
      expect(res.level).toBe(0);
      expect(res.label).toBe('Very weak');
    }
  });

  it('deducts penalties for keyboard runs and repeated characters', () => {
    const res = analyzePassword('qwerty123456');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.penalties.length).toBeGreaterThan(0);
      expect(res.label).toBe('Very weak');
    }
  });

  it('rates resilient complex passwords as Strong or Very strong', () => {
    const res = analyzePassword('K9#vX2$mP8@wL5!qR4');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.effectiveEntropy).toBeGreaterThanOrEqual(80);
      expect(res.label).toBe('Very strong');
      expect(res.level).toBe(4);
      expect(res.crackTimeOnline).toBeDefined();
      expect(res.crackTimeOffline).toBeDefined();
      expect(res.crackTimeGpu).toBeDefined();
    }
  });
});

describe('humanizeDuration thresholds', () => {
  it('formats boundaries accurately', () => {
    expect(humanizeDuration(0.5)).toBe('instantly');
    expect(humanizeDuration(15)).toBe('15 seconds');
    expect(humanizeDuration(180)).toBe('3 minutes');
    expect(humanizeDuration(7200)).toBe('2 hours');
    expect(humanizeDuration(172800)).toBe('2 days');
    expect(humanizeDuration(31536000 * 5)).toBe('5 years');
    expect(humanizeDuration(31536000 * 150)).toBe('centuries');
  });
});
