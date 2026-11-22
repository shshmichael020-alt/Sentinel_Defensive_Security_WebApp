import type { MessageHighlightChunk } from '../types/analysis';
import type { SignalId } from '../types/signal';
import { MESSAGE_CATEGORY_RULES } from '../constants/messageRules';

interface MatchSpan {
  readonly start: number;
  readonly end: number;
  readonly signalId: SignalId;
}

function matchPatternSpans(text: string, pattern: RegExp, signalId: SignalId): MatchSpan[] {
  const spans: MatchSpan[] = [];
  const globalRegex = new RegExp(pattern.source, 'gi');
  let match: RegExpExecArray | null = globalRegex.exec(text);
  while (match !== null) {
    if (match[0].length > 0) {
      spans.push({ start: match.index, end: match.index + match[0].length, signalId });
    }
    match = globalRegex.exec(text);
  }
  return spans;
}

function collectSpans(text: string, embeddedUrls: readonly string[]): MatchSpan[] {
  const spans: MatchSpan[] = [];

  for (const rule of MESSAGE_CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      spans.push(...matchPatternSpans(text, pattern, rule.id));
    }
  }

  for (const url of embeddedUrls) {
    let searchIndex = 0;
    let foundIndex = text.indexOf(url, searchIndex);
    while (foundIndex !== -1) {
      spans.push({ start: foundIndex, end: foundIndex + url.length, signalId: 'risky_link_inside' });
      searchIndex = foundIndex + url.length;
      foundIndex = text.indexOf(url, searchIndex);
    }
  }

  return spans.sort((a, b) => a.start - b.start);
}

function filterOverlappingSpans(sortedSpans: readonly MatchSpan[]): MatchSpan[] {
  const nonOverlapping: MatchSpan[] = [];
  let lastEnd = 0;

  for (const span of sortedSpans) {
    if (span.start >= lastEnd) {
      nonOverlapping.push(span);
      lastEnd = span.end;
    }
  }

  return nonOverlapping;
}

/**
 * Slices message text into non-overlapping highlighted and unhighlighted chunks.
 * INVARIANT: Concatenating all chunk texts exactly equals the original message.
 *
 * @param text - The original input text.
 * @param embeddedUrls - URLs extracted from message.
 * @returns Ordered sequence of text chunks.
 */
export function highlightMessage(
  text: string,
  embeddedUrls: readonly string[] = [],
): MessageHighlightChunk[] {
  if (text.length === 0) return [];

  const rawSpans = collectSpans(text, embeddedUrls);
  const cleanSpans = filterOverlappingSpans(rawSpans);

  const chunks: MessageHighlightChunk[] = [];
  let cursor = 0;

  for (const span of cleanSpans) {
    if (span.start > cursor) {
      chunks.push({ text: text.slice(cursor, span.start), flagged: false });
    }
    chunks.push({
      text: text.slice(span.start, span.end),
      flagged: true,
      signalId: span.signalId,
    });
    cursor = span.end;
  }

  if (cursor < text.length) {
    chunks.push({ text: text.slice(cursor), flagged: false });
  }

  return chunks;
}
