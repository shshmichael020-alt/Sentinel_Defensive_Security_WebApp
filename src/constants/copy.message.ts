import type { MessageSignalId } from '../types/signal';
import type { SignalCopyItem } from './copy.link';

export const MESSAGE_SIGNAL_COPY: Readonly<Record<MessageSignalId, SignalCopyItem>> = {
  credential_request: {
    label: 'Sensitive Credential Request',
    advice: 'Never share OTPs, passwords, PINs, or card details. Banks will never ask for these.',
  },
  urgency_pressure: {
    label: 'Urgent Action Pressure',
    advice: 'Scammers induce panic with fake deadlines. Step back and independently verify.',
  },
  account_threat: {
    label: 'Account Block or Legal Threat',
    advice: 'Threats of immediate arrest, penalty, or account closure are hallmarks of extortion scams.',
  },
  prize_lottery: {
    label: 'Unsolicited Prize or Cashback',
    advice: 'Unexpected lottery winnings or refunds requiring prior processing fees are fraudulent.',
  },
  risky_payment_method: {
    label: 'Irreversible / Unconventional Payment',
    advice: 'Demands for gift cards, crypto, wire transfers, or UPI collect requests cannot be reversed.',
  },
  authority_impersonation: {
    label: 'Authority or Institution Impersonation',
    advice: 'Verify caller or sender credentials by contacting official published department numbers directly.',
  },
  secrecy_request: {
    label: 'Demands for Secrecy',
    advice: 'Legitimate organizations never instruct you to keep transactions hidden from family or bank staff.',
  },
  contact_off_platform: {
    label: 'Off-Platform Redirection',
    advice: 'Scammers move targets to Telegram or WhatsApp to evade monitored platform protections.',
  },
  too_good_job_offer: {
    label: 'Unrealistic Work-from-Home Offer',
    advice: 'Task-based or like-and-earn schemes with promised daily returns are classic advance-fee scams.',
  },
  shouting_style: {
    label: 'Aggressive Capitalization or Punctuation',
    advice: 'Extreme capitalization and exclamation marks are psychological tactics to trigger panic.',
  },
  risky_link_inside: {
    label: 'Dangerous Embedded Link Detected',
    advice: 'Do not click the link enclosed in this message. Visit the official website directly instead.',
  },
  pressure_combo: {
    label: 'High-Pressure Financial Coercion',
    advice: 'The message pairs extreme urgency or threats with payment/credential demands—a hallmark of fraud.',
  },
};
