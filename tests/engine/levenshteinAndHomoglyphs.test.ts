import { describe, it, expect } from 'vitest';
import { levenshtein } from '../../src/engine/levenshtein';
import { normalizeHomoglyphs } from '../../src/engine/normalizeHomoglyphs';

describe('levenshtein distance', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('paypal', 'paypal')).toBe(0);
  });

  it('handles empty string cases', () => {
    expect(levenshtein('', 'apple')).toBe(5);
    expect(levenshtein('google', '')).toBe(6);
    expect(levenshtein('', '')).toBe(0);
  });

  it('computes single substitution, insertion, and deletion', () => {
    expect(levenshtein('paypa1', 'paypal')).toBe(1);
    expect(levenshtein('paypall', 'paypal')).toBe(1);
    expect(levenshtein('paypa', 'paypal')).toBe(1);
  });

  it('computes arbitrary edit distances', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });
});

describe('normalizeHomoglyphs', () => {
  it('normalizes common digit substitutions', () => {
    // 0->o, 1->l, 5->s, 3->e, 4->a
    expect(normalizeHomoglyphs('p4yp41')).toBe('paypal');
    expect(normalizeHomoglyphs('g00gl3')).toBe('google');
    expect(normalizeHomoglyphs('5bi')).toBe('sbi');
    expect(normalizeHomoglyphs('4ppl3')).toBe('apple');
  });

  it('normalizes multi-character substitutions and strips hyphens', () => {
    // rn -> m, vv -> w
    expect(normalizeHomoglyphs('pay-pal')).toBe('paypal');
    expect(normalizeHomoglyphs('am-a-z0n')).toBe('amazon');
    expect(normalizeHomoglyphs('rnicros0ft')).toBe('microsoft');
    expect(normalizeHomoglyphs('vvhatsapp')).toBe('whatsapp');
  });
});
