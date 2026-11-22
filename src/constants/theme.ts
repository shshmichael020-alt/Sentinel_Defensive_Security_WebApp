import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { ShieldCheck, TriangleAlert, ShieldAlert, OctagonX } from 'lucide-react';
import type { Verdict } from '../types/severity';
import type { PasswordStrengthLabel } from '../types/password';

export interface VerdictThemeConfig {
  readonly bgClass: string;
  readonly textClass: string;
  readonly borderClass: string;
  readonly icon: ComponentType<LucideProps>;
  readonly label: string;
  readonly hexBg: string;
  readonly hexText: string;
}

export const VERDICT_THEME = {
  'Low risk': {
    bgClass: 'bg-[#ECFDF5]',
    textClass: 'text-[#047857]',
    borderClass: 'border-[#A7F3D0]',
    icon: ShieldCheck,
    label: 'Low risk',
    hexBg: '#ECFDF5',
    hexText: '#047857',
  },
  Caution: {
    bgClass: 'bg-[#FFFBEB]',
    textClass: 'text-[#92400E]',
    borderClass: 'border-[#FDE68A]',
    icon: TriangleAlert,
    label: 'Caution',
    hexBg: '#FFFBEB',
    hexText: '#92400E',
  },
  Suspicious: {
    bgClass: 'bg-[#FFF7ED]',
    textClass: 'text-[#9A3412]',
    borderClass: 'border-[#FED7AA]',
    icon: ShieldAlert,
    label: 'Suspicious',
    hexBg: '#FFF7ED',
    hexText: '#9A3412',
  },
  Dangerous: {
    bgClass: 'bg-[#FEF2F2]',
    textClass: 'text-[#B91C1C]',
    borderClass: 'border-[#FECACA]',
    icon: OctagonX,
    label: 'Dangerous',
    hexBg: '#FEF2F2',
    hexText: '#B91C1C',
  },
} satisfies Readonly<Record<Verdict, VerdictThemeConfig>>;

export const PASSWORD_STRENGTH_THEME = {
  'Very weak': {
    ...VERDICT_THEME.Dangerous,
    label: 'Very weak',
  },
  Weak: {
    ...VERDICT_THEME.Suspicious,
    label: 'Weak',
  },
  Fair: {
    ...VERDICT_THEME.Caution,
    label: 'Fair',
  },
  Strong: {
    ...VERDICT_THEME['Low risk'],
    label: 'Strong',
  },
  'Very strong': {
    ...VERDICT_THEME['Low risk'],
    label: 'Very strong',
  },
} satisfies Readonly<Record<PasswordStrengthLabel, VerdictThemeConfig>>;

