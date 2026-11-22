import { memo, type FC } from 'react';
import type { Verdict } from '@/types/severity';
import { VERDICT_THEME } from '@/constants/theme';

export interface RiskGaugeProps {
  readonly score: number;
  readonly verdict: Verdict;
  readonly label?: string | undefined;
}

const ARC_RADIUS = 60;
const ARC_LENGTH = Math.PI * ARC_RADIUS;

const GaugeArc: FC<{ readonly hexText: string; readonly offset: number }> = ({
  hexText,
  offset,
}) => (
  <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible" role="img" aria-hidden="true">
    <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
    <path
      d="M 20 80 A 60 60 0 0 1 140 80"
      fill="none"
      stroke={hexText}
      strokeWidth="12"
      strokeDasharray={ARC_LENGTH}
      strokeDashoffset={offset}
      strokeLinecap="round"
      className="transition-all duration-500 ease-out"
    />
  </svg>
);

export const RiskGauge: FC<RiskGaugeProps> = memo(({ score, verdict }) => {
  const theme = VERDICT_THEME[verdict];
  const clamped = Math.max(0, Math.min(100, score));
  const offset = ARC_LENGTH * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative w-44 h-24">
        <GaugeArc hexText={theme.hexText} offset={offset} />
        <div className="absolute inset-0 top-6 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-sentinel-ink tabular-nums leading-none">
            {clamped}
          </span>
          <span className="text-xs text-sentinel-secondary font-medium mt-1">/ 100</span>
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: theme.hexText }}>
        {verdict}
      </div>
    </div>
  );
});

RiskGauge.displayName = 'RiskGauge';

