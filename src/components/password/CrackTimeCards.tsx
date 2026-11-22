import { memo, type FC } from 'react';
import { ShieldCheck, Cpu, Server } from 'lucide-react';
import { ICON_SIZE_MD } from '@/constants/limits';

export interface CrackTimeCardsProps {
  readonly onlineDuration: string;
  readonly offlineDuration: string;
  readonly gpuDuration: string;
}

interface TierConfig {
  readonly id: string;
  readonly title: string;
  readonly duration: string;
  readonly description: string;
  readonly icon: typeof ShieldCheck;
  readonly iconClass: string;
}

const TierCard: FC<{ readonly tier: TierConfig }> = memo(({ tier }) => {
  const Icon = tier.icon;
  return (
    <div className="p-3.5 rounded-lg border border-sentinel-border bg-white flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-sentinel-secondary font-medium">
        <Icon size={ICON_SIZE_MD} className={tier.iconClass} aria-hidden="true" />
        <span>{tier.title}</span>
      </div>
      <div className="text-base font-bold font-mono text-sentinel-ink tabular-nums mt-1">
        {tier.duration}
      </div>
      <p className="text-[11px] text-sentinel-secondary">{tier.description}</p>
    </div>
  );
});

TierCard.displayName = 'TierCard';

const TIER_TEMPLATES = [
  { id: 'online', title: 'Online Throttled (1,000 / s)', desc: 'Rate-limited web logins & APIs.', icon: ShieldCheck, cls: 'text-blue-700' },
  { id: 'fast-hash', title: 'Offline Fast Hash (10B / s)', desc: 'Single high-speed GPU hash cracking.', icon: Cpu, cls: 'text-amber-700' },
  { id: 'gpu-cluster', title: 'Offline GPU Cluster (100B / s)', desc: 'Dedicated multi-GPU cluster array.', icon: Server, cls: 'text-rose-700' },
] as const;

function getTiers(on: string, off: string, gpu: string): readonly TierConfig[] {
  const durations = [on, off, gpu];
  return TIER_TEMPLATES.map((t, idx) => ({
    id: t.id,
    title: t.title,
    duration: durations[idx] ?? '',
    description: t.desc,
    icon: t.icon,
    iconClass: t.cls,
  }));
}



export const CrackTimeCards: FC<CrackTimeCardsProps> = memo(({
  onlineDuration,
  offlineDuration,
  gpuDuration,
}) => {
  const tiers = getTiers(onlineDuration, offlineDuration, gpuDuration);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {tiers.map((tier) => (
        <TierCard key={tier.id} tier={tier} />
      ))}
    </div>
  );
});

CrackTimeCards.displayName = 'CrackTimeCards';

