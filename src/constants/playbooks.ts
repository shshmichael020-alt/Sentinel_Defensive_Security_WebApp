import type { Playbook } from '../types/ui';

export const PLAYBOOKS: readonly Playbook[] = [
  {
    id: 'otp-kyc-fraud',
    title: 'Bank OTP & KYC Account Suspension Fraud',
    category: 'Banking / Impersonation',
    howItWorks:
      'Fraudsters send urgent SMS or WhatsApp messages claiming your bank account, debit card, or SIM card is suspended due to pending KYC. They provide a fake link or phone number asking for your confidential OTP, PIN, or net banking password.',
    redFlags: [
      'Threat of immediate account block within 24 hours',
      'Request to share OTP or login credentials over the phone or unverified link',
      'Unsolicited links using suspicious domains or unofficial subdomains',
    ],
    whatToDo: [
      'Never share an OTP, CVV, or PIN under any circumstances',
      'Call your bank directly using the phone number printed on the back of your card',
      'Forward suspicious phishing SMS to your telecom provider spam reporting code (e.g. 1909 in India)',
    ],
  },
  {
    id: 'parcel-customs-fee',
    title: 'Parcel Delivery & Customs Clearance Scam',
    category: 'E-commerce / Delivery',
    howItWorks:
      'You receive an alert pretending to be FedEx, DHL, or India Post stating a delivery is held at customs or has an incomplete address. Victims are directed to pay a small nominal fee ($2.99 or Rs 50) on a phishing page that steals credit card credentials.',
    redFlags: [
      'Unexpected package notification when you have not ordered anything',
      'Demands for immediate fee payment via unfamiliar payment gateways',
      'Links pointing to shortened URLs or top-level domains like .top or .xyz',
    ],
    whatToDo: [
      'Check tracking numbers exclusively on the official carrier app or website',
      'Never pay customs fees through third-party SMS or email links',
      'Legitimate couriers do not require gift cards or direct UPI payment for routine delivery',
    ],
  },
  {
    id: 'fake-job-offer',
    title: 'Part-Time Work-From-Home & Task Scam',
    category: 'Employment / Advance Fee',
    howItWorks:
      'Scammers lure job seekers with lucrative offers: earning $100/day or Rs 5000/day simply by liking YouTube videos or writing Google reviews. After paying a small initial bonus to build trust, they demand upfront deposits to unlock VIP tasks, then vanish.',
    redFlags: [
      'Extravagant earnings promised for trivial, unskilled online tasks',
      'Communication pushed exclusively to Telegram or WhatsApp private channels',
      'Demands to deposit your own money as security or recharge to withdraw earned income',
    ],
    whatToDo: [
      'Remember: legitimate employers never ask you to pay money to work',
      'Refuse invitations to unregulated Telegram work groups',
      'Report and block recruitment solicitations from unverified personal numbers',
    ],
  },
  {
    id: 'lottery-prize',
    title: 'Lottery, Gift Card & Pending Refund Scam',
    category: 'Sweepstakes / Advance Fee',
    howItWorks:
      'Attackers announce you have won a multi-million lottery, lucky draw, or government tax refund. To disburse the money, they demand upfront administrative fees, processing charges, or tax clearance.',
    redFlags: [
      'Winning a contest or lottery you never entered',
      'Requirement to pay money before receiving a prize',
      'Pressure to act before the offer expires in 12 or 24 hours',
    ],
    whatToDo: [
      'Delete and ignore lottery notices from unknown contacts',
      'Never pay any upfront fee to collect any supposed prize or refund',
      'Verify legitimate tax refunds directly on the official tax authority portal',
    ],
  },
  {
    id: 'tech-support',
    title: 'Tech Support & Remote Screen Access Scam',
    category: 'Malware / Coercion',
    howItWorks:
      'Popups or callers claim your computer has a critical virus, expired license, or illicit network traffic. They instruct you to install remote desktop software (AnyDesk, TeamViewer) which gives them unrestricted access to bank sessions.',
    redFlags: [
      'Unsolicited calls claiming to represent Microsoft, Apple, or Google support',
      'Demands to install remote control applications onto your device',
      'Browser popups that lock the screen with loud alarm sounds and phone numbers',
    ],
    whatToDo: [
      'Never install remote screen-sharing tools at the request of an incoming caller',
      'Hang up immediately; major tech companies do not place outbound security warning calls',
      'If software was installed, immediately disconnect internet and restart your PC',
    ],
  },
  {
    id: 'upi-collect-fraud',
    title: 'UPI Collect Request & QR Code Marketplace Scam',
    category: 'Digital Payments',
    howItWorks:
      'When selling goods online (OLX, Facebook Marketplace), the buyer claims they want to send an advance payment via UPI. Instead of sending money, they generate a "Collect Request" or send a QR code claiming "Scan and enter PIN to receive money".',
    redFlags: [
      'Claims that entering your UPI PIN is necessary to receive payment',
      'Receiving a payment notification with a "Pay" or "Approve" button when you are the seller',
      'Buyer insists on rapid remote payment without inspecting the item',
    ],
    whatToDo: [
      'Fundamental rule: UPI PIN is ONLY entered to deduct money, NEVER to receive money',
      'Decline all incoming Collect requests from unknown buyers',
      'Stick to cash-on-delivery or verified in-person escrow methods',
    ],
  },
];
