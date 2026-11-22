import { memo, type FC } from 'react';
import type { Verdict } from '@/types/severity';
import type { PasswordStrengthLabel } from '@/types/password';
import { KpiCard } from './KpiCard';

export interface KpiStripProps {
  readonly linkScore: number;
  readonly linkVerdict: Verdict;
  readonly messageScore: number;
  readonly messageVerdict: Verdict;
  readonly passwordLabel: PasswordStrengthLabel;
  readonly passwordVerdict: Verdict;
  readonly sessionPostureVerdict: Verdict;
  readonly sessionChecksCount: number;
}

export const KpiStrip: FC<KpiStripProps> = memo(({
  linkScore,
  linkVerdict,
  messageScore,
  messageVerdict,
  passwordLabel,
  passwordVerdict,
  sessionPostureVerdict,
  sessionChecksCount,
}) => (
  <section aria-label="Executive Security Posture" className="py-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Link Risk" value={`${String(linkScore)} / 100`} verdict={linkVerdict} />
      <KpiCard label="Message Risk" value={`${String(messageScore)} / 100`} verdict={messageVerdict} />
      <KpiCard label="Password Strength" value={passwordLabel} verdict={passwordVerdict} />
      <KpiCard
        label="Session Posture"
        value={sessionPostureVerdict}
        subValue={`(${String(sessionChecksCount)} checked)`}
        verdict={sessionPostureVerdict}
      />
    </div>
  </section>
));


KpiStrip.displayName = 'KpiStrip';

