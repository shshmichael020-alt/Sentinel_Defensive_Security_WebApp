import { CRACK_SPEEDS } from '../constants/passwordRules';
import { MAX_ENTROPY_CAP } from '../constants/limits';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_YEAR = 31536000;
const YEARS_IN_CENTURY = 100;

function formatShortDuration(seconds: number): string {
  if (seconds < 1) return 'instantly';
  if (seconds < SECONDS_IN_MINUTE) {
    const s = Math.round(seconds);
    return `${String(s)} second${s === 1 ? '' : 's'}`;
  }
  if (seconds < SECONDS_IN_HOUR) {
    const m = Math.round(seconds / SECONDS_IN_MINUTE);
    return `${String(m)} minute${m === 1 ? '' : 's'}`;
  }
  const h = Math.round(seconds / SECONDS_IN_HOUR);
  return `${String(h)} hour${h === 1 ? '' : 's'}`;
}

/**
 * Humanizes seconds into a readable timeframe.
 * Boundary tested: instantly, seconds, minutes, hours, days, years, centuries.
 *
 * @param seconds - Duration in seconds.
 * @returns Formatted human-readable string.
 */
export function humanizeDuration(seconds: number): string {
  if (seconds < SECONDS_IN_DAY) {
    return formatShortDuration(seconds);
  }
  if (seconds < SECONDS_IN_YEAR) {
    const d = Math.round(seconds / SECONDS_IN_DAY);
    return `${String(d)} day${d === 1 ? '' : 's'}`;
  }
  const years = Math.round(seconds / SECONDS_IN_YEAR);
  if (years >= YEARS_IN_CENTURY) {
    return 'centuries';
  }
  return `${String(years)} year${years === 1 ? '' : 's'}`;
}

/**
 * Computes estimated crack times for online throttled and offline fast-hash attack models.
 * Assumes average attack searches 50% of keyspace: guesses = 2^(effectiveEntropy - 1).
 *
 * @param effectiveEntropy - Net entropy in bits after pattern deductions.
 * @returns Pair of formatted crack time estimations.
 */
export function estimateCrackTime(effectiveEntropy: number): {
  online: string;
  offline: string;
  gpu: string;
} {
  if (effectiveEntropy <= 0) {
    return { online: 'instantly', offline: 'instantly', gpu: 'instantly' };
  }

  const cappedEntropy = Math.min(MAX_ENTROPY_CAP, effectiveEntropy);
  const guesses = Math.pow(2, Math.max(0, cappedEntropy - 1));

  const onlineSeconds = guesses / CRACK_SPEEDS.ONLINE_THROTTLED;
  const offlineSeconds = guesses / CRACK_SPEEDS.OFFLINE_FAST_HASH;
  const gpuSeconds = guesses / CRACK_SPEEDS.OFFLINE_GPU_CLUSTER;

  return {
    online: humanizeDuration(onlineSeconds),
    offline: humanizeDuration(offlineSeconds),
    gpu: humanizeDuration(gpuSeconds),
  };
}
