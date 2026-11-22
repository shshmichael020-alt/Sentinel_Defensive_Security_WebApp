import { memo, type FC } from 'react';
import type { PasswordStrengthLevel, PasswordStrengthLabel } from '@/types/password';
import { PASSWORD_STRENGTH_THEME } from '@/constants/theme';
import { SeverityPill } from '../common/SeverityPill';

export interface StrengthMeterProps {
  readonly level: PasswordStrengthLevel;
  readonly label: PasswordStrengthLabel;
  readonly effectiveEntropy: number;
}

const TOTAL_SEGMENTS = 5;

const MeterSegments: FC<{ readonly activeSegments: number; readonly hexText: string }> = ({
  activeSegments,
  hexText,
}) => (
  <>
    {Array.from({ length: TOTAL_SEGMENTS }).map((_, idx) => (
      <div
        key={idx}
        className="flex-1 h-full rounded-sm transition-colors duration-300"
        style={{ backgroundColor: idx < activeSegments ? hexText : '#E2E8F0' }}
      />
    ))}
  </>
);

export const StrengthMeter: FC<StrengthMeterProps> = memo(({ level, label, effectiveEntropy }) => {
  const activeSegments = level + 1;
  const theme = PASSWORD_STRENGTH_THEME[label];

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-sentinel-border bg-slate-50/50">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-sentinel-secondary uppercase tracking-wider text-[11px]">
          Password Strength Meter
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sentinel-secondary text-xs">
            {effectiveEntropy} bits entropy
          </span>
          <SeverityPill strength={label} size="sm" />
        </div>
      </div>

      <div
        role="meter"
        aria-label="Password Resilience Meter"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={level}
        aria-valuetext={label}
        className="flex items-center gap-1.5 h-2.5 w-full"
      >
        <MeterSegments activeSegments={activeSegments} hexText={theme.hexText} />
      </div>
    </div>
  );
});

StrengthMeter.displayName = 'StrengthMeter';
