import type { Verdict } from '../types/severity';
import type { PasswordStrengthLevel } from '../types/password';
import type { SessionPosture } from '../types/ui';

const VERDICT_SEVERITY_ORDER: Readonly<Record<Verdict, number>> = {
  Dangerous: 4,
  Suspicious: 3,
  Caution: 2,
  'Low risk': 1,
};

function mapPasswordLevelToVerdict(level: PasswordStrengthLevel): Verdict {
  if (level === 0) {
    return 'Dangerous';
  }
  if (level === 1) {
    return 'Suspicious';
  }
  if (level === 2) {
    return 'Caution';
  }
  return 'Low risk';
}

function getPostureSummarySentence(worst: Verdict, checksCount: number): string {
  if (checksCount === 0) {
    return 'No security checks evaluated in this session yet.';
  }
  if (worst === 'Dangerous') {
    return 'Critical active threat patterns detected across your analyzed sessions; immediate protective action recommended.';
  }
  if (worst === 'Suspicious') {
    return 'Multiple suspicious signals identified; treat links and messages with extreme skepticism.';
  }
  if (worst === 'Caution') {
    return 'Mild risk indicators observed; verify identities independently before proceeding.';
  }
  return 'All evaluated assets meet baseline safety criteria with no active red flags detected.';
}

function findWorstVerdict(verdicts: readonly Verdict[]): Verdict {
  let worst: Verdict = 'Low risk';
  let highest = 0;
  for (const v of verdicts) {
    const score = VERDICT_SEVERITY_ORDER[v];
    if (score > highest) {
      highest = score;
      worst = v;
    }
  }
  return worst;
}

/**
 * Computes overall session security posture based on the worst verdict among analyzed modules.
 *
 * @param linkVerdict - Latest link analysis verdict (or null).
 * @param messageVerdict - Latest message analysis verdict (or null).
 * @param passwordLevel - Latest password strength level (or null).
 * @param checksRunCount - Total number of checks run in current session.
 * @returns Comprehensive session posture evaluation.
 */
export function computeSessionPosture(
  linkVerdict: Verdict | null,
  messageVerdict: Verdict | null,
  passwordLevel: PasswordStrengthLevel | null,
  checksRunCount: number,
): SessionPosture {
  const verdicts: Verdict[] = [];
  if (linkVerdict !== null) verdicts.push(linkVerdict);
  if (messageVerdict !== null) verdicts.push(messageVerdict);
  if (passwordLevel !== null) verdicts.push(mapPasswordLevelToVerdict(passwordLevel));

  const worstVerdict = findWorstVerdict(verdicts);
  const summary = getPostureSummarySentence(worstVerdict, verdicts.length);

  return {
    worstVerdict,
    checksRunCount,
    summary,
  };
}

