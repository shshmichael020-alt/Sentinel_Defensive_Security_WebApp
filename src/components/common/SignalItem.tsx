import type { FC } from 'react';
import type { Signal } from '../../types/signal';
import type { Verdict } from '../../types/severity';
import { SeverityPill } from './SeverityPill';

export interface SignalItemProps {
  readonly signal: Signal;
}

function mapSeverityToVerdict(severity: Signal['severity']): Verdict {
  if (severity === 'critical') return 'Dangerous';
  if (severity === 'high') return 'Suspicious';
  if (severity === 'medium') return 'Caution';
  return 'Low risk';
}

export const SignalItem: FC<SignalItemProps> = ({ signal }) => {
  const verdict = mapSeverityToVerdict(signal.severity);

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-md border border-sentinel-border bg-white text-sm">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="font-semibold text-sentinel-ink">{signal.label}</span>
        <SeverityPill verdict={verdict} customLabel={signal.severity.toUpperCase()} size="sm" />
      </div>
      <div className="font-mono text-xs text-sentinel-secondary bg-slate-50 px-2 py-1 rounded border border-slate-100 break-all">
        {signal.evidence}
      </div>
      <p className="text-xs text-sentinel-secondary leading-relaxed">{signal.advice}</p>
    </div>
  );
};
