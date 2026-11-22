import type { FC } from 'react';
import type { UsePasswordCheckResult } from '@/hooks/usePasswordCheck';
import type { PasswordAnalysisResult } from '@/types/password';
import { PASSWORD_PRESETS } from '@/constants/presets';
import { PASSWORD_MAX_LENGTH } from '@/constants/limits';
import { PresetChips } from '../common/PresetChips';
import { StrengthMeter } from './StrengthMeter';
import { PasswordChecklist } from './PasswordChecklist';
import { CrackTimeCards } from './CrackTimeCards';
import { GeneratorCard } from './GeneratorCard';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

export interface PasswordPanelProps {
  readonly check: UsePasswordCheckResult;
}

const PasswordInputField: FC<{
  readonly isVisible: boolean;
  readonly toggleVisibility: () => void;
  readonly password: string;
  readonly setPassword: (v: string) => void;
}> = ({ isVisible, toggleVisibility, password, setPassword }) => (
  <div className="relative flex items-center">
    <input
      id="password-input"
      type={isVisible ? 'text' : 'password'}
      value={password}
      maxLength={PASSWORD_MAX_LENGTH}
      autoComplete="new-password"
      spellCheck={false}
      onChange={(e) => { setPassword(e.target.value); }}
      placeholder="Enter password to analyze..."
      className="w-full pr-10 pl-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-mono text-xs sm:text-sm text-sentinel-ink focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
    />
    <button
      type="button"
      onClick={toggleVisibility}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      aria-pressed={isVisible}
      className="absolute right-2.5 p-1 text-sentinel-secondary hover:text-sentinel-ink focus-visible:ring-2 focus-visible:ring-blue-600 rounded transition-colors"
    >
      {isVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
    </button>
  </div>
);

const PasswordInputCard: FC<{
  readonly password: string;
  readonly setPassword: (v: string) => void;
  readonly isVisible: boolean;
  readonly toggleVisibility: () => void;
  readonly applyPreset: (v: string) => void;
}> = ({ password, setPassword, isVisible, toggleVisibility, applyPreset }) => (
  <div className="flex flex-col gap-3 p-5 rounded-xl border border-sentinel-border bg-white shadow-sm">
    <div className="flex flex-col gap-1.5">
      <label htmlFor="password-input" className="text-sm font-semibold text-sentinel-ink flex items-center gap-1.5">
        <KeyRound size={16} className="text-blue-700" aria-hidden="true" />
        <span>Password Resilience & Defense Check</span>
      </label>
      <p className="text-xs text-sentinel-secondary">
        Never transmitted over network. Evaluated 100% in-browser against Shannon entropy and dictionary patterns.
      </p>
      <PasswordInputField
        isVisible={isVisible}
        toggleVisibility={toggleVisibility}
        password={password}
        setPassword={setPassword}
      />
    </div>
    <PresetChips presets={PASSWORD_PRESETS} onSelect={applyPreset} currentValue={password} label="Test Scenarios:" />
  </div>
);

const PasswordResultsSection: FC<{
  readonly result: Extract<PasswordAnalysisResult, { status: 'ok' }>;
  readonly generatorLength: number;
  readonly setGeneratorLength: (n: number) => void;
  readonly generateAndApply: () => string;
  readonly password: string;
}> = ({ result, generatorLength, setGeneratorLength, generateAndApply, password }) => (
  <div className="flex flex-col gap-5">
    <StrengthMeter level={result.level} label={result.label} effectiveEntropy={result.effectiveEntropy} />
    <CrackTimeCards
      onlineDuration={result.crackTimeOnline}
      offlineDuration={result.crackTimeOffline}
      gpuDuration={result.crackTimeGpu}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <PasswordChecklist items={result.checklist} />
      <GeneratorCard
        length={generatorLength}
        onLengthChange={setGeneratorLength}
        onGenerate={generateAndApply}
        currentPassword={password}
      />
    </div>
  </div>
);

export const PasswordPanel: FC<PasswordPanelProps> = ({ check }) => {
  const { password, setPassword, isVisible, toggleVisibility, result, applyPreset, generatorLength, setGeneratorLength, generateAndApply } = check;

  return (
    <div role="tabpanel" id="panel-password" aria-labelledby="tab-password" className="flex flex-col gap-6">
      <PasswordInputCard
        password={password}
        setPassword={setPassword}
        isVisible={isVisible}
        toggleVisibility={toggleVisibility}
        applyPreset={applyPreset}
      />
      {result.status === 'ok' && (
        <PasswordResultsSection
          result={result}
          generatorLength={generatorLength}
          setGeneratorLength={setGeneratorLength}
          generateAndApply={generateAndApply}
          password={password}
        />
      )}
    </div>
  );
};
