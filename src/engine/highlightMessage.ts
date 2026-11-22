import type { MessageHighlightChunk } from '../types/analysis';
import { findMessageMatches, type MatchSpan } from './findMessageMatches';

function collectSpans(
  text: string,
  embeddedUrls: readonly string[],
  categorySpans?: readonly MatchSpan[],
): MatchSpan[] {
  const spans: MatchSpan[] = categorySpans ? [...categorySpans] : [...findMessageMatches(text).spans];

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
 * @param categorySpans - Optional precomputed category match spans.
 * @returns Ordered sequence of text chunks.
 */
export function highlightMessage(
  text: string,
  embeddedUrls: readonly string[] = [],
  categorySpans?: readonly MatchSpan[],
): MessageHighlightChunk[] {
  if (text.length === 0) return [];

  const rawSpans = collectSpans(text, embeddedUrls, categorySpans);
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
