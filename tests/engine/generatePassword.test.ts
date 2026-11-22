import { describe, it, expect } from 'vitest';
import { generatePassword } from '@/engine/generatePassword';
import { AMBIGUOUS_CHARS } from '@/constants/passwordRules';

describe('generatePassword', () => {
  it('generates password of requested length', () => {
    const pwd16 = generatePassword(16);
    expect(pwd16).toHaveLength(16);

    const pwd32 = generatePassword(32);
    expect(pwd32).toHaveLength(32);
  });

  it('guarantees at least one lowercase, uppercase, digit, and symbol', () => {
    for (let i = 0; i < 20; i += 1) {
      const pwd = generatePassword(20);
      expect(/[a-z]/.test(pwd)).toBe(true);
      expect(/[A-Z]/.test(pwd)).toBe(true);
      expect(/[0-9]/.test(pwd)).toBe(true);
      expect(/[^a-zA-Z0-9]/.test(pwd)).toBe(true);
    }
  });

  it('excludes ambiguous characters (0, O, o, 1, l, I)', () => {
    for (let i = 0; i < 20; i += 1) {
      const pwd = generatePassword(30);
      for (const char of pwd) {
        expect(AMBIGUOUS_CHARS.has(char)).toBe(false);
      }
    }
  });

  it('supports deterministic testing via injected RNG', () => {
    let callIndex = 0;
    const deterministicRng = (max: number): number => {
      callIndex += 1;
      return (callIndex * 7) % max;
    };

    const pwd1 = generatePassword(16, deterministicRng);
    callIndex = 0;
    const pwd2 = generatePassword(16, deterministicRng);
    expect(pwd1).toBe(pwd2);
  });
});
