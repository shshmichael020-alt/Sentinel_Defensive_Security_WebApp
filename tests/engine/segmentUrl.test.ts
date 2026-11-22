import { describe, it, expect } from 'vitest';
import { analyzeUrl } from '../../src/engine/analyzeUrl';

describe('segmentUrl concatenation invariant', () => {
  const testUrls = [
    'https://paypa1.com/login?token=abc',
    'http://bit.ly/3xyz',
    'https://user:pass@evil.com/path',
    'https://sub.portal.sbi.co.in/web/home?ref=123#hash',
    'http://192.168.1.1:8080/admin',
    'https://paypal.com.phish.xyz/login/verify',
    'javascript:alert(1)',
  ];

  for (const urlStr of testUrls) {
    it(`reproduces displayed URL exactly when concatenating segments for: ${urlStr}`, () => {
      const result = analyzeUrl(urlStr);
      expect(result.status).toBe('ok');
      if (result.status === 'ok') {
        const concatenated = result.segments.map((s) => s.text).join('');
        expect(concatenated).toBe(result.normalizedUrl);
      }
    });
  }
});
