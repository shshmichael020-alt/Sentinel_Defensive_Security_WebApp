import { describe, it, expect } from 'vitest';
import { analyzeUrl } from '../../src/engine/analyzeUrl';
import { extractDomainBreakdown } from '../../src/engine/urlBrandSignals';

describe('analyzeUrl', () => {
  it('returns empty status for empty or whitespace inputs', () => {
    expect(analyzeUrl('')).toEqual({ status: 'empty' });
    expect(analyzeUrl('   ')).toEqual({ status: 'empty' });
  });

  it('detects dangerous schemes like javascript: and data:', () => {
    const res = analyzeUrl('javascript:alert(1)');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'dangerous_scheme')).toBe(true);
      expect(res.score).toBe(60);
      expect(res.verdict).toBe('Suspicious');
    }
  });

  it('identifies official domain match with info severity', () => {
    const res = analyzeUrl('https://sbi.co.in/portal');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'official_domain_match')).toBe(true);
      expect(res.verdict).toBe('Low risk');
    }
  });

  it('flags brand lookalike domain paypa1.com with critical signal', () => {
    const res = analyzeUrl('https://paypa1.com/login');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'brand_lookalike' && s.severity === 'critical')).toBe(true);
      expect(res.score).toBeGreaterThanOrEqual(60);
    }
  });

  it('evaluates multi-threat compound lookalike phishing link as Dangerous', () => {
    const res = analyzeUrl('http://paypa1-security-update.xyz/login');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'brand_lookalike')).toBe(true);
      expect(res.signals.some((s) => s.id === 'no_https')).toBe(true);
      expect(res.signals.some((s) => s.id === 'suspicious_tld')).toBe(true);
      expect(res.score).toBeGreaterThanOrEqual(70);
      expect(res.verdict).toBe('Dangerous');
    }
  });

  it('detects raw IP address host as high risk', () => {
    const res = analyzeUrl('http://192.168.1.1/login');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'ip_host')).toBe(true);
    }
  });

  it('detects punycode xn-- host as high risk', () => {
    const res = analyzeUrl('https://xn--pypal-4ve.com');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'punycode_idn')).toBe(true);
    }
  });

  it('detects userinfo @ deception trick', () => {
    const res = analyzeUrl('https://paypal.com@evil.com/login');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'userinfo_at')).toBe(true);
    }
  });

  it('detects known URL shorteners and plain HTTP', () => {
    const res = analyzeUrl('http://bit.ly/test-link');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'url_shortener')).toBe(true);
      expect(res.signals.some((s) => s.id === 'no_https')).toBe(true);
    }
  });

  it('detects brand tokens placed inside subdomain or path', () => {
    const res = analyzeUrl('https://paypal.com.evil.xyz/login');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'brand_in_subdomain_or_path')).toBe(true);
    }
  });

  it('parses multi-part suffix domains like sbi.co.in correctly', () => {
    const breakdown = extractDomainBreakdown('online.sbi.co.in');
    expect(breakdown.registrableDomain).toBe('sbi.co.in');
    expect(breakdown.mainLabel).toBe('sbi');
    expect(breakdown.subdomain).toBe('online');
  });
});
