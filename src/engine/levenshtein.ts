function computeNextRow(
  prevRow: readonly number[],
  currRow: number[],
  aChar: string,
  b: string,
): void {
  for (let j = 1; j <= b.length; j += 1) {
    const bChar = b.charAt(j - 1);
    const cost = aChar === bChar ? 0 : 1;
    const prevAbove = (prevRow[j] ?? 0) + 1;
    const prevLeft = (currRow[j - 1] ?? 0) + 1;
    const prevDiag = (prevRow[j - 1] ?? 0) + cost;

    currRow[j] = Math.min(prevAbove, prevLeft, prevDiag);
  }
}

/**
 * Computes the Levenshtein distance between two strings using dynamic programming.
 *
 * @param a - First string to compare.
 * @param b - Second string to compare.
 * @returns The minimum number of single-character edits.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prevRow: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  const currRow: number[] = new Array<number>(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i += 1) {
    currRow[0] = i;
    computeNextRow(prevRow, currRow, a.charAt(i - 1), b);
    prevRow = [...currRow];
  }

  return prevRow[b.length] ?? 0;
}
