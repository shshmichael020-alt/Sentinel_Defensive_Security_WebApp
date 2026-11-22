import type { FC } from 'react';
import { MIN_GENERATED_LENGTH, MAX_GENERATED_LENGTH } from '../../constants/passwordRules';
import { CopyButton } from '../common/CopyButton';
import { RefreshCw, KeyRound } from 'lucide-react';

export interface GeneratorCardProps {
  readonly length: number;
  readonly onLengthChange: (length: number) => void;
  readonly onGenerate: () => string;
  readonly currentPassword: string;
}

const LengthSlider: FC<{ readonly length: number; readonly onChange: (v: number) => void }> = ({
  length,
  onChange,
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between text-[11px] text-sentinel-secondary font-mono">
      <span>{MIN_GENERATED_LENGTH}</span>
      <span>{MAX_GENERATED_LENGTH}</span>
    </div>
    <input
      type="range"
      min={MIN_GENERATED_LENGTH}
      max={MAX_GENERATED_LENGTH}
      value={length}
      aria-valuemin={MIN_GENERATED_LENGTH}
      aria-valuemax={MAX_GENERATED_LENGTH}
      aria-valuenow={length}
      aria-valuetext={`${String(length)} characters`}
      onChange={(e) => { onChange(Number(e.target.value)); }}
      className="w-full accent-blue-700 cursor-pointer"
    />
  </div>
);

export const GeneratorCard: FC<GeneratorCardProps> = ({
  length,
  onLengthChange,
  onGenerate,
  currentPassword,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-sentinel-border bg-white">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-sentinel-ink flex items-center gap-1.5">
          <KeyRound size={15} className="text-blue-700" aria-hidden="true" />
          <span>Local Password Generator</span>
        </span>
        <span className="text-sentinel-secondary font-mono text-xs">Length: {length} chars</span>
      </div>
      <LengthSlider length={length} onChange={onLengthChange} />
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={() => { onGenerate(); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors shadow-sm"
        >
          <RefreshCw size={12} aria-hidden="true" />
          <span>Generate Secure Password</span>
        </button>
        <CopyButton textToCopy={currentPassword} label="Copy Password" copiedLabel="Password Copied!" />
      </div>
    </div>
  );
};
