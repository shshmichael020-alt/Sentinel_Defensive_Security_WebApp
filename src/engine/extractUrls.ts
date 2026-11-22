import { MAX_EMBEDDED_URLS } from '../constants/limits';

const EMBEDDED_URL_REGEX = /\b(?:https?:\/\/[^\s<>"'{}|\\^`]+|www\.[^\s<>"'{}|\\^`]+)/gi;
const TRAILING_PUNCT_REGEX = /[.,;:!?]+$/;

/**
 * Safely extracts up to 5 HTTP/HTTPS/WWW URLs embedded inside raw message text without network access.
 *
 * @param text - The full message body.
 * @returns Array of unique URL strings found (up to 5).
 */
export function extractUrls(text: string): string[] {
  EMBEDDED_URL_REGEX.lastIndex = 0;
  const matches = text.match(EMBEDDED_URL_REGEX) ?? [];
  const uniqueUrls: string[] = [];

  for (const match of matches) {
    const cleaned = match.replace(TRAILING_PUNCT_REGEX, '');
    if (!uniqueUrls.includes(cleaned)) {
      uniqueUrls.push(cleaned);
    }
    if (uniqueUrls.length >= MAX_EMBEDDED_URLS) {
      break;
    }
  }

  return uniqueUrls;
}

