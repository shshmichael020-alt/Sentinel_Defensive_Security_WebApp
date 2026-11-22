import { memo, type FC } from 'react';
import type { Verdict } from '@/types/severity';
import { SeverityPill } from '../common/SeverityPill';

export interface KpiCardProps {
  readonly label: string;
  readonly value: string;
  readonly subValue?: string | undefined;
  readonly verdict: Verdict;
  readonly customBadgeText?: string | undefined;
}

export const KpiCard: FC<KpiCardProps> = memo(({
  label,
  value,
  subValue,
  verdict,
  customBadgeText,
}) => {
  return (
    <div
      aria-live="polite"
      className="flex flex-col justify-between p-4 rounded-lg bg-white border border-sentinel-border shadow-sm min-w-0"
    >
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-xs font-medium text-sentinel-secondary uppercase tracking-wider truncate">
          {label}
        </span>
        <SeverityPill verdict={verdict} customLabel={customBadgeText} size="sm" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tabular-nums text-sentinel-ink truncate">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-sentinel-secondary font-mono truncate">{subValue}</span>
        )}
      </div>
    </div>
  );
});

KpiCard.displayName = 'KpiCard';

