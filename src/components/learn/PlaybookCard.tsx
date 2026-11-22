import { useState, type FC } from 'react';
import type { Playbook } from '../../types/ui';
import { ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface PlaybookCardProps {
  readonly playbook: Playbook;
}

const PlaybookDetail: FC<{ readonly playbook: Playbook }> = ({ playbook }) => (
  <div className="p-4 pt-1 border-t border-slate-100 flex flex-col gap-3 text-xs text-sentinel-ink bg-slate-50/50 leading-relaxed">
    <div>
      <h4 className="font-semibold text-sentinel-ink mb-1">How it operates:</h4>
      <p className="text-sentinel-secondary">{playbook.howItWorks}</p>
    </div>
    <div>
      <h4 className="font-semibold text-amber-900 mb-1 flex items-center gap-1">
        <AlertCircle size={13} className="text-amber-700" aria-hidden="true" />
        <span>Red Flags:</span>
      </h4>
      <ul className="list-disc list-inside flex flex-col gap-1 text-sentinel-secondary pl-1">
        {playbook.redFlags.map((flag, idx) => (
          <li key={idx}>{flag}</li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-emerald-900 mb-1 flex items-center gap-1">
        <CheckCircle2 size={13} className="text-emerald-700" aria-hidden="true" />
        <span>Protective Actions:</span>
      </h4>
      <ul className="list-disc list-inside flex flex-col gap-1 text-sentinel-secondary pl-1">
        {playbook.whatToDo.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>
    </div>
  </div>
);

export const PlaybookCard: FC<PlaybookCardProps> = ({ playbook }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="rounded-lg border border-sentinel-border bg-white shadow-sm overflow-hidden transition-all">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => { setIsOpen((prev) => !prev); }}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none transition-colors"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-mono font-bold text-blue-700 tracking-wider">
            {playbook.category}
          </span>
          <span className="text-sm font-semibold text-sentinel-ink">{playbook.title}</span>
        </div>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-sentinel-secondary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <PlaybookDetail playbook={playbook} />}
    </div>
  );
};
