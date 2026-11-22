import type { FC } from 'react';
import { ShieldCheck, Cpu, Server } from 'lucide-react';
import { ICON_SIZE_MD } from '../../constants/limits';

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

const TierCard: FC<{ readonly tier: TierConfig }> = ({ tier }) => {
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
};

function getTiers(
  onlineDuration: string,
  offlineDuration: string,
  gpuDuration: string,
): readonly TierConfig[] {
  return [
    {
      id: 'online',
      title: 'Online Throttled (1,000 / s)',
      duration: onlineDuration,
      description: 'Rate-limited web logins & APIs.',
      icon: ShieldCheck,
      iconClass: 'text-blue-700',
    },
    {
      id: 'fast-hash',
      title: 'Offline Fast Hash (10B / s)',
      duration: offlineDuration,
      description: 'Single high-speed GPU hash cracking.',
      icon: Cpu,
      iconClass: 'text-amber-700',
    },
    {
      id: 'gpu-cluster',
      title: 'Offline GPU Cluster (100B / s)',
      duration: gpuDuration,
      description: 'Dedicated multi-GPU cluster array.',
      icon: Server,
      iconClass: 'text-rose-700',
    },
  ];
}

export const CrackTimeCards: FC<CrackTimeCardsProps> = ({
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
};
