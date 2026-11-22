import { memo, type FC } from 'react';
import type { Verdict } from '@/types/severity';
import type { PasswordStrengthLabel } from '@/types/password';
import { VERDICT_THEME, PASSWORD_STRENGTH_THEME } from '@/constants/theme';
import { ICON_SIZE_SM, ICON_SIZE_MD } from '@/constants/limits';

export interface SeverityPillProps {
  readonly verdict?: Verdict | undefined;
  readonly strength?: PasswordStrengthLabel | undefined;
  readonly customLabel?: string | undefined;
  readonly size?: 'sm' | 'md' | undefined;
}

export const SeverityPill: FC<SeverityPillProps> = memo(({
  verdict,
  strength,
  customLabel,
  size = 'md',
}) => {
  const theme = strength
    ? PASSWORD_STRENGTH_THEME[strength]
    : verdict
      ? VERDICT_THEME[verdict]
      : VERDICT_THEME['Low risk'];

  const IconComponent = theme.icon;
  const displayText = customLabel ?? theme.label;
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';
  const iconSize = size === 'sm' ? ICON_SIZE_SM : ICON_SIZE_MD;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${theme.borderClass} ${theme.bgClass} ${theme.textClass} ${paddingClass} tabular-nums transition-colors`}
    >
      <IconComponent size={iconSize} aria-hidden="true" className="shrink-0" />
      <span>{displayText}</span>
    </span>
  );
});

SeverityPill.displayName = 'SeverityPill';

