export interface PresetItem<T = string> {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly value: T;
}

export const LINK_PRESETS: readonly PresetItem[] = [
  {
    id: 'lookalike-bank',
    label: 'Lookalike Bank Scam',
    description: 'Imposter domain targeting PayPal credentials',
    value: 'http://paypa1-security-update.xyz/login',
  },
  {
    id: 'http-shortener',
    label: 'Insecure URL Shortener',
    description: 'Plain HTTP shortened link with redirect',
    value: 'http://bit.ly/claim-refund-2024?dest=http://evil.com',
  },
  {
    id: 'official-control',
    label: 'Official Domain Control',
    description: 'Legitimate State Bank of India portal',
    value: 'https://sbi.co.in/portal/web/home',
  },
];

export const MESSAGE_PRESETS: readonly PresetItem[] = [
  {
    id: 'otp-bank-scam',
    label: 'Urgent Bank OTP Scam',
    description: 'Coercive threat demanding one-time passcode',
    value:
      'URGENT: Your SBI account has been locked due to pending KYC! Share your 6-digit OTP immediately to avoid permanent account block and penalty: http://sbi-verification.xyz/kyc',
  },
  {
    id: 'parcel-fee-scam',
    label: 'Customs Parcel Scam',
    description: 'Delivery fee extortion via off-platform link',
    value:
      'FedEx Courier Alert: Your parcel #FX-9821 is held at customs. Pay a small processing fee of $2.99 within 12 hours or package will be returned: http://fedx-customs-clearance.top/pay',
  },
  {
    id: 'fake-job-scam',
    label: 'Task-Based Job Scam',
    description: 'Work-from-home like-and-earn scheme',
    value:
      'Part-time Work from Home! Earn Rs 5000 per day by liking YouTube videos. No experience required. Message our manager on Telegram @EarnDailyFast to claim your first reward.',
  },
  {
    id: 'benign-control',
    label: 'Benign Dinner Plan',
    description: 'Normal communication with zero red flags',
    value:
      'Hi team, meeting is confirmed for tomorrow at 10 AM in Conference Room B. See you there!',
  },
];

export const PASSWORD_PRESETS: readonly PresetItem[] = [
  {
    id: 'weak-password',
    label: 'Weak Password',
    description: 'Common dictionary word with simple digits',
    value: 'password123',
  },
  {
    id: 'pattern-password',
    label: 'Keyboard Pattern',
    description: 'Keyboard sequence with year',
    value: 'qwerty!2022',
  },
  {
    id: 'strong-passphrase',
    label: 'Resilient Passphrase',
    description: 'High-entropy complex mix',
    value: 'K9#vX2$mP8@wL5!qR4',
  },
];
