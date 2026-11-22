import { MAX_EMBEDDED_URLS } from '../constants/limits';

/**
 * Safely extracts up to 5 HTTP/HTTPS/WWW URLs embedded inside raw message text without network access.
 *
 * @param text - The full message body.
 * @returns Array of unique URL strings found (up to 5).
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /\b(?:https?:\/\/[^\s<>"'{}|\\^`]+|www\.[^\s<>"'{}|\\^`]+)/gi;
  const matches = text.match(urlRegex) ?? [];
  const uniqueUrls: string[] = [];

  for (const match of matches) {
    const cleaned = match.replace(/[.,;:!?]+$/, '');
    if (!uniqueUrls.includes(cleaned)) {
      uniqueUrls.push(cleaned);
    }
    if (uniqueUrls.length >= MAX_EMBEDDED_URLS) {
      break;
    }
  }

  return uniqueUrls;
}
