import type { FC } from 'react';
import { Shield } from 'lucide-react';

export const Header: FC = () => {
  return (
    <header className="border-b border-sentinel-border bg-white sticky top-0 z-40">
      <div className="max-w-app mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-sm">
            <Shield size={20} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sentinel-ink tracking-tight flex items-center gap-2">
              <span>Sentinel</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold tracking-wider">
                Defensive Suite
              </span>
            </h1>
            <p className="text-xs text-sentinel-secondary">
              Proactive personal threat detection, scam analysis, and security awareness
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-sentinel-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          <span>Local Engine Active</span>
        </div>
      </div>
    </header>
  );
};
