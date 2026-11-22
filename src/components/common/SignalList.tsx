import { memo, type FC } from 'react';
import type { Signal } from '@/types/signal';
import { ZERO_SIGNAL_COPY } from '@/constants/copy';
import { SignalItem } from './SignalItem';
import { ShieldCheck } from 'lucide-react';

export interface SignalListProps {
  readonly signals: readonly Signal[];
}

export const SignalList: FC<SignalListProps> = memo(({ signals }) => {
  if (signals.length === 0) {
    return (
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm">
        <ShieldCheck className="shrink-0" size={18} aria-hidden="true" />
        <span>{ZERO_SIGNAL_COPY}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-sentinel-secondary">
        Detected Risk Signals ({signals.length})
      </h3>
      <div className="flex flex-col gap-2">
        {signals.map((signal) => (
          <SignalItem key={`${signal.id}-${signal.evidence}`} signal={signal} />
        ))}
      </div>
    </div>
  );
});

SignalList.displayName = 'SignalList';

