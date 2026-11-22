import type { MessageSignalId } from '../types/signal';

export interface MessageCategoryRule {
  readonly id: MessageSignalId;
  readonly patterns: readonly RegExp[];
}

export const MESSAGE_CATEGORY_RULES: readonly MessageCategoryRule[] = [
  {
    id: 'credential_request',
    patterns: [
      /\b(?:otp|one[- ]time[- ]password|pin|cvv|password|passcode)\b/i,
      /\b(?:card[- ]number|atm[- ]card|credit[- ]card|debit[- ]card)\b/i,
      /\b(?:aadhaar|pan[- ]card|ssn)\b/i,
      /\b(?:share|send|enter|verify|provide)\s+your\s+(?:otp|pin|password|details|credentials|aadhaar)\b/i,
    ],
  },
  {
    id: 'urgency_pressure',
    patterns: [
      /\b(?:urgent(?:ly)?|immediate(?:ly)?|right\s+now)\b/i,
      /\b(?:within\s+(?:24|12|48|2)\s*(?:hours|hrs|mins|minutes))\b/i,
      /\b(?:last\s+warning|final\s+notice|action\s+required|act\s+now)\b/i,
      /\b(?:before\s+it(?:'s|\s+is)\s+too\s+late)\b/i,
    ],
  },
  {
    id: 'account_threat',
    patterns: [
      /\b(?:account\s+(?:is\s+)?(?:suspended|blocked|locked|closed|deactivated))\b/i,
      /\b(?:kyc\s+(?:is\s+)?(?:expired|pending|suspended|required))\b/i,
      /\b(?:legal\s+action|police\s+case|court\s+notice|arrest\s+warrant|penalty\s+charges)\b/i,
      /\b(?:electricity\s+will\s+be\s+disconnected|sim\s+blocked)\b/i,
    ],
  },
  {
    id: 'prize_lottery',
    patterns: [
      /\b(?:you\s+have\s+won|you've\s+won|congratulations\s+you\s+won)\b/i,
      /\b(?:lucky\s+draw|lottery\s+winner|jackpot)\b/i,
      /\b(?:claim\s+(?:your\s+)?(?:reward|prize|cashback|gift|bonus))\b/i,
      /\b(?:refund\s+pending|credited\s+(?:rs|inr|\$))\b/i,
    ],
  },
  {
    id: 'risky_payment_method',
    patterns: [
      /\b(?:gift\s*card|apple\s*card|steam\s*card|google\s*play\s*card)\b/i,
      /\b(?:crypto|bitcoin|btc|usdt|binance)\b/i,
      /\b(?:wire\s+transfer|western\s+union|moneygram)\b/i,
      /\b(?:upi\s+collect\s+request|approve\s+collect\s+request)\b/i,
      /\b(?:pay\s+(?:a\s+)?(?:small\s+)?fee|processing\s+fee|customs\s+fee|delivery\s+charges)\b/i,
    ],
  },
  {
    id: 'authority_impersonation',
    patterns: [
      /\b(?:reserve\s+bank|rbi|cbi|police|customs\s+officer|tax\s+department|income\s+tax)\b/i,
      /\b(?:bank\s+manager|security\s+team|fraud\s+prevention\s+team)\b/i,
      /\b(?:customer\s+care|support\s+desk|official\s+executive)\b/i,
      /\b(?:fedex\s+customs|dhl\s+clearance|postal\s+department)\b/i,
    ],
  },
  {
    id: 'secrecy_request',
    patterns: [
      /\b(?:do\s+not\s+(?:tell|share|inform)\s+anyone)\b/i,
      /\b(?:keep\s+this\s+(?:strictly\s+)?confidential|private\s+matter)\b/i,
      /\b(?:don't\s+disconnect\s+the\s+call|stay\s+on\s+line)\b/i,
    ],
  },
  {
    id: 'contact_off_platform',
    patterns: [
      /\b(?:call\s+this\s+number|reach\s+us\s+at\s+\+?[0-9]{10,12})\b/i,
      /\b(?:whatsapp\s+me|message\s+on\s+telegram|join\s+telegram\s+channel)\b/i,
      /\b(?:t\.me\/[a-zA-Z0-9_]+|wa\.me\/[0-9]+)\b/i,
    ],
  },
  {
    id: 'too_good_job_offer',
    patterns: [
      /\b(?:work\s+from\s+home\s+earn|part[- ]time\s+earn\s*(?:rs|inr|\$)?\s*\d+)\b/i,
      /\b(?:like\s+and\s+earn|youtube\s+like\s+task|task[- ]based\s+income)\b/i,
      /\b(?:daily\s+income\s*(?:rs|inr|\$)?\s*\d+|earn\s+from\s+mobile)\b/i,
    ],
  },
];
