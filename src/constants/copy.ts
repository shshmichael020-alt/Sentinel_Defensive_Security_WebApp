import type { SignalId } from '../types/signal';
import { URL_SIGNAL_COPY, type SignalCopyItem } from './copy.link';
import { MESSAGE_SIGNAL_COPY } from './copy.message';

export const ZERO_SIGNAL_COPY =
  'No known red flags found. Still verify through an official channel.';

export const SIGNAL_COPY: Readonly<Record<SignalId, SignalCopyItem>> = {
  ...URL_SIGNAL_COPY,
  ...MESSAGE_SIGNAL_COPY,
};

export const ACTION_PLAN_STEPS = {
  'Low risk': [
    'Confirm that the destination matches the official channel you intended to visit.',
    'Ensure HTTPS encryption remains active throughout your entire browsing session.',
    'Never submit secondary credentials unless you initiated the session directly.',
  ],
  Caution: [
    'Do not click through unexpected redirects or shortened links from this source.',
    'Verify the organization identity by navigating to their known website independently.',
    'Avoid inputting sensitive financial details, passwords, or personal identity numbers.',
  ],
  Suspicious: [
    'Cease interaction immediately; do not follow any links or instructions provided.',
    'Check official customer support contact details independently through a search engine.',
    'If you entered credentials, reset passwords on your legitimate account from a fresh browser.',
  ],
  Dangerous: [
    'Block the sender immediately and do NOT click any links, attachments, or buttons.',
    'If credentials or OTP were entered, immediately notify your bank to freeze cards or UPI.',
    'Preserve screenshots and transaction details, then report to cybercrime authorities.',
  ],
} as const;
