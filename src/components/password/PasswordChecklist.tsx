import type { FC } from 'react';
import type { PasswordChecklistItem } from '../../types/password';
import { Check, OctagonX } from 'lucide-react';

export interface PasswordChecklistProps {
  readonly items: readonly PasswordChecklistItem[];
}

export const PasswordChecklist: FC<PasswordChecklistProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-2.5 p-4 rounded-lg border border-sentinel-border bg-white">
      <h3 className="text-xs font-semibold text-sentinel-secondary uppercase tracking-wider text-[11px]">
        Defense Checklist
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 text-xs py-1 px-1.5 rounded"
          >
            {item.passed ? (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                <Check size={11} aria-hidden="true" />
              </span>
            ) : (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-700 shrink-0">
                <OctagonX size={11} aria-hidden="true" />
              </span>
            )}
            <span
              className={
                item.passed
                  ? 'text-sentinel-ink font-medium'
                  : 'text-sentinel-secondary line-through'
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
