import type { DrillItem } from '../types/ui';

export const DRILL_ITEMS: readonly DrillItem[] = [
  {
    id: 'drill-1',
    text: 'Dear customer, your SBI card reward points worth Rs 9,850 expire today. Redeem now to your bank account: http://sbi-rewards-redeem.xyz/login',
    isScam: true,
    explanation:
      'Scam: Legitimate reward programs never expire on arbitrary threat deadlines via third-party .xyz domains demanding banking credentials.',
  },
  {
    id: 'drill-2',
    text: 'Your package with tracking number 1Z9999999999999999 was delivered today at 2:15 PM at your front porch. Thank you for using UPS.',
    isScam: false,
    explanation:
      'Legitimate: Informational delivery confirmation with no coercive deadlines, payment demands, credential requests, or untrusted external links.',
  },
  {
    id: 'drill-3',
    text: 'FINAL NOTICE: Delhi Police Cyber Cell has detected illegal downloads on your IP. An arrest warrant will be issued in 2 hours unless you call +91-9876543210 immediately.',
    isScam: true,
    explanation:
      'Scam: Law enforcement agencies never issue arrest warrants or legal notices via informal SMS or require emergency phone consultations.',
  },
  {
    id: 'drill-4',
    text: 'Your two-factor authentication code for GitHub is 849201. If you did not initiate this request, review your recent sign-ins at github.com/settings/security.',
    isScam: false,
    explanation:
      'Legitimate: Standard 2FA notification pointing directly to the official platform domain with no request to share the code.',
  },
  {
    id: 'drill-5',
    text: 'Congratulations! You have been selected for a part-time Amazon product reviewer role. Earn $500/day working 1 hour. WhatsApp our HR lead right now: wa.me/192837465',
    isScam: true,
    explanation:
      'Scam: Unrealistic compensation, cold outreach, and redirection to WhatsApp are signature hallmarks of employment advance-fee scams.',
  },
  {
    id: 'drill-6',
    text: 'Hi Dad, my phone broke so I am texting from my friend phone. Can you transfer 200 to help me pay for groceries urgently? I will pay you back tonight.',
    isScam: true,
    explanation:
      'Scam: The classic "Hi Mum / Hi Dad" impersonation scam. Always verify independently through a phone call to the real family member before sending funds.',
  },
];
