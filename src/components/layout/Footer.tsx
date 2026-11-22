import type { FC } from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="mt-16 border-t border-sentinel-border bg-white text-xs text-sentinel-secondary py-8">
      <div className="max-w-app mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-700" aria-hidden="true" />
          <span className="font-semibold text-sentinel-ink">Sentinel Defensive Suite</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <p className="text-center sm:text-right max-w-xl leading-relaxed">
          Purely defensive security software designed to protect users without causing harm.
          Static analysis heuristics are not a substitute for verified banking or institutional channels.
        </p>
      </div>
    </footer>
  );
};
