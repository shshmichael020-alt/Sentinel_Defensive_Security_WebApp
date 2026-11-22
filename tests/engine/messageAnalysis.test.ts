import { describe, it, expect } from 'vitest';
import { analyzeMessage } from '@/engine/analyzeMessage';

describe('analyzeMessage', () => {
  it('returns empty status for empty input', () => {
    expect(analyzeMessage('')).toEqual({ status: 'empty' });
    expect(analyzeMessage('   ')).toEqual({ status: 'empty' });
  });

  it('evaluates benign text with no red flags and score 0', () => {
    const res = analyzeMessage('Hey Alice, see you tomorrow at lunch in the cafeteria!');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals).toHaveLength(0);
      expect(res.score).toBe(0);
      expect(res.verdict).toBe('Low risk');
    }
  });

  it('detects credential_request as critical signal', () => {
    const res = analyzeMessage('Please share your bank OTP to complete the security check.');
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'credential_request' && s.severity === 'critical')).toBe(true);
    }
  });

  it('triggers pressure_combo when urgency/threat is combined with demands', () => {
    const res = analyzeMessage(
      'URGENT: Your account has been blocked! Send your OTP immediately to verify your identity.',
    );
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'pressure_combo')).toBe(true);
      expect(res.verdict).toBe('Dangerous');
    }
  });

  it('propagates embedded risky link risk into message signals', () => {
    const res = analyzeMessage(
      'Review your invoice at http://paypa1-security-update.xyz/login today.',
    );
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.signals.some((s) => s.id === 'risky_link_inside')).toBe(true);
      expect(res.extractedUrls).toHaveLength(1);
    }
  });

  it('caps input length at 4000 characters without crashing', () => {
    const huge = 'A'.repeat(5000);
    const res = analyzeMessage(huge);
    expect(res.status).toBe('ok');
  });
});
