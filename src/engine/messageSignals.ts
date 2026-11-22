import type { Signal, MessageSignalId } from '../types/signal';
import type { Severity, Verdict } from '../types/severity';
import { SIGNAL_COPY } from '../constants/copy';
import {
  SHOUTING_UPPERCASE_RATIO,
  SHOUTING_MIN_WORD_LENGTH,
  SHOUTING_EXCLAMATION_THRESHOLD,
  EVIDENCE_MAX_LENGTH,
  TOP_SIGNALS_COUNT,
} from '../constants/limits';
import { MESSAGE_CATEGORY_RULES, type MessageCategoryRule } from '../constants/messageRules';

const SEVERITY_BY_CATEGORY: Readonly<Record<MessageSignalId, Severity>> = {
  credential_request: 'critical',
  urgency_pressure: 'medium',
  account_threat: 'high',
  prize_lottery: 'high',
  risky_payment_method: 'high',
  authority_impersonation: 'medium',
  secrecy_request: 'high',
  contact_off_platform: 'medium',
  too_good_job_offer: 'high',
  shouting_style: 'low',
  risky_link_inside: 'high',
  pressure_combo: 'high',
};

function checkShouting(text: string): Signal | null {
  const exclamationMatches = text.match(/!/g) ?? [];
  const hasManyExclamations = exclamationMatches.length >= SHOUTING_EXCLAMATION_THRESHOLD;

  const words = text.split(/\s+/).filter((w) => w.length >= SHOUTING_MIN_WORD_LENGTH);
  let upperCount = 0;
  for (const word of words) {
    const letters = word.replace(/[^a-zA-Z]/g, '');
    if (letters.length >= SHOUTING_MIN_WORD_LENGTH && letters === letters.toUpperCase()) {
      upperCount += 1;
    }
  }

  const isShouting = words.length > 0 && upperCount / words.length > SHOUTING_UPPERCASE_RATIO;
  if (hasManyExclamations || isShouting) {
    const ev = `Upper words: ${String(upperCount)}/${String(words.length)}, ! count: ${String(exclamationMatches.length)}`;
    return {
      id: 'shouting_style',
      severity: 'low',
      label: SIGNAL_COPY.shouting_style.label,
      evidence: ev.slice(0, EVIDENCE_MAX_LENGTH),
      advice: SIGNAL_COPY.shouting_style.advice,
    };
  }
  return null;
}

/**
 * Maps link analysis verdict to message embedded link severity.
 *
 * @param verdict - Verdict from link analysis.
 * @returns Severity for the embedded link signal, or null if low risk.
 */
export function mapLinkVerdictToSeverity(verdict: Verdict): Severity | null {
  if (verdict === 'Dangerous') return 'critical';
  if (verdict === 'Suspicious') return 'high';
  if (verdict === 'Caution') return 'medium';
  return null;
}

function matchPhrases(text: string, rule: MessageCategoryRule): string[] {
  const matched: string[] = [];
  for (const pattern of rule.patterns) {
    const match = pattern.exec(text);
    if (match?.[0] && !matched.includes(match[0].toLowerCase())) {
      matched.push(match[0]);
    }
    if (matched.length >= TOP_SIGNALS_COUNT) break;
  }
  return matched;
}

/**
 * Scans text against category regexes and stylistic heuristic rules.
 *
 * @param text - The message text.
 * @returns Detected message signals.
 */
export function extractMessageCategorySignals(text: string): Signal[] {
  const signals: Signal[] = [];

  for (const rule of MESSAGE_CATEGORY_RULES) {
    const matchedPhrases = matchPhrases(text, rule);
    if (matchedPhrases.length > 0) {
      signals.push({
        id: rule.id,
        severity: SEVERITY_BY_CATEGORY[rule.id],
        label: SIGNAL_COPY[rule.id].label,
        evidence: `Matched: "${matchedPhrases.join('", "')}"`.slice(0, EVIDENCE_MAX_LENGTH),
        advice: SIGNAL_COPY[rule.id].advice,
      });
    }
  }

  const shouting = checkShouting(text);
  if (shouting) {
    signals.push(shouting);
  }

  return signals;
}

/**
 * Applies compound threat rule: urgency/threat paired with payment/credential/risky link demands.
 *
 * @param signals - Existing detected signals.
 * @returns Updated signals array with pressure_combo added if criteria met.
 */
export function applyPressureCombo(signals: readonly Signal[]): Signal[] {
  const ids = new Set(signals.map((s) => s.id));
  const hasPressure = ids.has('urgency_pressure') || ids.has('account_threat');
  const hasDemand =
    ids.has('credential_request') || ids.has('risky_payment_method') || ids.has('risky_link_inside');

  if (hasPressure && hasDemand && !ids.has('pressure_combo')) {
    return [
      ...signals,
      {
        id: 'pressure_combo',
        severity: 'high',
        label: SIGNAL_COPY.pressure_combo.label,
        evidence: 'Urgency / threat coercion combined with payment or credential demand',
        advice: SIGNAL_COPY.pressure_combo.advice,
      },
    ];
  }

  return [...signals];
}
