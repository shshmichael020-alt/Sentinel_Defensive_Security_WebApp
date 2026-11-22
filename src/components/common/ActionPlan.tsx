import { memo, type FC } from 'react';
import type { Verdict } from '@/types/severity';
import { ACTION_PLAN_STEPS } from '@/constants/copy';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export interface ActionPlanProps {
  readonly verdict: Verdict;
}

export const ActionPlan: FC<ActionPlanProps> = memo(({ verdict }) => {
  const steps = ACTION_PLAN_STEPS[verdict];
  const isHighRisk = verdict === 'Dangerous' || verdict === 'Suspicious';

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-sentinel-border bg-slate-50/50">
      <div className="flex items-center gap-2 text-sm font-semibold text-sentinel-ink">
        {isHighRisk ? (
          <ShieldAlert size={16} className="text-red-600" aria-hidden="true" />
        ) : (
          <ShieldCheck size={16} className="text-emerald-600" aria-hidden="true" />
        )}
        <span>Recommended Defensive Action Plan</span>
      </div>
      <ol className="list-decimal list-inside flex flex-col gap-1.5 text-xs text-sentinel-secondary leading-relaxed">
        {steps.map((step, idx) => (
          <li key={idx} className="pl-1">
            <span className="text-sentinel-ink font-medium">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
});

ActionPlan.displayName = 'ActionPlan';

