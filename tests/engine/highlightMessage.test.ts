import { describe, it, expect } from 'vitest';
import { highlightMessage } from '@/engine/highlightMessage';
import { analyzeMessage } from '@/engine/analyzeMessage';

describe('highlightMessage', () => {
  it('returns empty array on empty input', () => {
    expect(highlightMessage('')).toEqual([]);
  });

  it('guarantees concatenation invariant equals original input', () => {
    const samples = [
      'Your account is suspended! Please share your OTP immediately to avoid penalty.',
      'Congratulations you have won a lucky draw prize of Rs 50000. Pay fee at http://win.xyz',
      'Normal benign message with no highlights whatsoever.',
      'URGENT: Act now within 24 hours. Message on Telegram @scam.',
    ];

    for (const sample of samples) {
      const res = analyzeMessage(sample);
      expect(res.status).toBe('ok');
      if (res.status === 'ok') {
        const joined = res.highlights.map((h) => h.text).join('');
        expect(joined).toBe(sample);
      }
    }
  });

  it('flags matched phrases with correct signalId', () => {
    const text = 'Send your OTP now';
    const chunks = highlightMessage(text);
    const flagged = chunks.filter((c) => c.flagged);
    expect(flagged.length).toBeGreaterThan(0);
    expect(flagged[0]?.signalId).toBe('credential_request');
  });
});
