import type { MessageSignalId } from '../types/signal';
import { MESSAGE_CATEGORY_RULES } from '../constants/messageRules';
import { TOP_SIGNALS_COUNT } from '../constants/limits';

export interface MatchSpan {
  readonly start: number;
  readonly end: number;
  readonly signalId: MessageSignalId;
}

export interface MessageScanResult {
  readonly spans: readonly MatchSpan[];
  readonly phrasesByRule: ReadonlyMap<MessageSignalId, readonly string[]>;
}

interface PrecompiledPattern {
  readonly ruleId: MessageSignalId;
  readonly regex: RegExp;
}

const COMPILED_PATTERNS: readonly PrecompiledPattern[] = MESSAGE_CATEGORY_RULES.flatMap(
  (rule) => rule.patterns.map((p) => ({
    ruleId: rule.id,
    regex: new RegExp(p.source, 'gi'),
  })),
);

function recordPhrase(
  phrasesMap: Map<MessageSignalId, string[]>,
  ruleId: MessageSignalId,
  phrase: string,
): void {
  const list = phrasesMap.get(ruleId) ?? [];
  const lower = phrase.toLowerCase();
  const alreadyPresent = list.some((p) => p.toLowerCase() === lower);
  if (!alreadyPresent && list.length < TOP_SIGNALS_COUNT) {
    list.push(phrase);
    phrasesMap.set(ruleId, list);
  }
}

function scanPattern(
  text: string,
  entry: PrecompiledPattern,
  spans: MatchSpan[],
  phrasesMap: Map<MessageSignalId, string[]>,
): void {
  const { ruleId, regex } = entry;
  regex.lastIndex = 0;
  let match = regex.exec(text);
  while (match !== null) {
    if (match[0].length > 0) {
      spans.push({ start: match.index, end: match.index + match[0].length, signalId: ruleId });
      recordPhrase(phrasesMap, ruleId, match[0]);
    }
    match = regex.exec(text);
  }
}

/**
 * Scans text once with precompiled regexes to extract category match spans and phrases.
 *
 * @param text - Input message text.
 * @returns Scan result containing match spans and detected phrases by rule.
 */
export function findMessageMatches(text: string): MessageScanResult {
  const spans: MatchSpan[] = [];
  const phrasesMap = new Map<MessageSignalId, string[]>();

  for (const entry of COMPILED_PATTERNS) {
    scanPattern(text, entry, spans, phrasesMap);
  }

  return { spans, phrasesByRule: phrasesMap };
}
