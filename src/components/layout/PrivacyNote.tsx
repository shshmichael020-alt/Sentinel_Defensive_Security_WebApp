import type { FC } from 'react';
import { Lock } from 'lucide-react';

export const PrivacyNote: FC = () => {
  return (
    <aside
      aria-label="Privacy Guarantees"
      className="bg-slate-50 border-b border-sentinel-border text-xs text-sentinel-secondary py-2 px-4 sm:px-6"
    >
      <div className="max-w-app mx-auto flex items-center gap-2">
        <Lock size={13} className="text-blue-600 shrink-0" aria-hidden="true" />
        <p className="leading-normal">
          <strong className="text-sentinel-ink font-semibold">Privacy Guarantee:</strong> Zero URL visits
          or web fetches. Passwords evaluated 100% in-browser and never transmitted. AI sees only computed
          signal IDs and scores—never raw inputs. No analytics, tracking, or cookies.
        </p>
      </div>
    </aside>
  );
};
