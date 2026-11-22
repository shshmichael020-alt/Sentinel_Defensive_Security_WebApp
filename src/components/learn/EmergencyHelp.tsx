import type { FC } from 'react';
import { EMERGENCY_STEPS, HELPLINE_INDIA, GLOBAL_ADVICE } from '@/constants/emergencyHelp';
import { OctagonX, PhoneCall, ExternalLink, Globe } from 'lucide-react';

const HelplineCard: FC = () => (
  <div className="p-3.5 rounded-lg border border-red-300 bg-white flex flex-col gap-2 shadow-xs">
    <div className="flex items-center gap-2 font-semibold text-red-950">
      <PhoneCall size={15} className="text-red-700 shrink-0" aria-hidden="true" />
      <span>{HELPLINE_INDIA.title}</span>
    </div>
    <p className="text-sentinel-secondary">{HELPLINE_INDIA.description}</p>
    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
      <div className="flex items-center gap-1.5 font-mono text-base font-bold text-red-700">
        <span>Call:</span>
        <span className="bg-red-50 px-2 py-0.5 rounded border border-red-200">{HELPLINE_INDIA.number}</span>
      </div>
      <a
        href={HELPLINE_INDIA.portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
      >
        <span>{HELPLINE_INDIA.portalLabel}</span>
        <ExternalLink size={12} aria-hidden="true" />
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    </div>
  </div>
);

export const EmergencyHelp: FC = () => {
  return (
    <aside aria-label="Emergency Steps and Helplines" className="p-5 rounded-xl border border-red-200 bg-red-50/40 flex flex-col gap-4 text-xs leading-relaxed">
      <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
        <OctagonX size={18} className="text-red-700 shrink-0" aria-hidden="true" />
        <span>Already Scammed? Act Immediately</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {EMERGENCY_STEPS.map((step, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <span className="font-semibold text-sentinel-ink">{step.title}</span>
            <span className="text-sentinel-secondary">{step.description}</span>
          </div>
        ))}
      </div>
      <HelplineCard />
      <div className="flex items-start gap-2 text-[11px] text-sentinel-secondary bg-white/80 p-2.5 rounded border border-slate-200">
        <Globe size={13} className="text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p>{GLOBAL_ADVICE}</p>
      </div>
    </aside>
  );
};
