export interface EmergencyStep {
  readonly title: string;
  readonly description: string;
  readonly urgency: 'immediate' | 'high' | 'medium';
}

export const EMERGENCY_STEPS: readonly EmergencyStep[] = [
  {
    title: '1. Sever All Contact Immediately',
    description:
      'Hang up the call, stop replying to messages, and do not attempt to negotiate. Do not send further money or fees.',
    urgency: 'immediate',
  },
  {
    title: '2. Freeze Cards & Block Digital Payment Channels',
    description:
      'Call your bank fraud helpline directly to freeze compromised cards, suspend UPI handles, and halt internet banking access.',
    urgency: 'immediate',
  },
  {
    title: '3. Rotate Passwords & Enable Two-Factor Authentication',
    description:
      'Change master passwords from an uncompromised, clean device. Terminate all active sessions on Google, Apple, and email accounts.',
    urgency: 'high',
  },
  {
    title: '4. Preserve Crucial Digital Evidence',
    description:
      'Take screenshots of chat threads, sender phone numbers, fake URLs, UPI transaction IDs, and bank debit SMS alerts.',
    urgency: 'medium',
  },
  {
    title: '5. File an Official Cybercrime Report',
    description:
      'Report the incident promptly. Fast reporting increases the likelihood of freezing illicit transfers before cash-out.',
    urgency: 'medium',
  },
];

export const HELPLINE_INDIA = {
  number: '1930',
  title: 'National Cyber Crime Helpline (India)',
  description: 'Available 24x7 for urgent financial fraud reporting.',
  portalUrl: 'https://cybercrime.gov.in',
  portalLabel: 'cybercrime.gov.in',
};

export const GLOBAL_ADVICE =
  'For users outside India: Contact your local municipal police cybercrime unit, financial regulatory authority, and your bank fraud department immediately.';
