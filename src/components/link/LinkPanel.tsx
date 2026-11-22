import type { FC } from 'react';
import type { UseLinkCheckResult } from '@/hooks/useLinkCheck';
import { LINK_PRESETS } from '@/constants/presets';
import { PresetChips } from '../common/PresetChips';
import { RiskGauge } from '../common/RiskGauge';
import { SeverityPill } from '../common/SeverityPill';
import { UrlAnatomy } from './UrlAnatomy';
import { SignalList } from '../common/SignalList';
import { ActionPlan } from '../common/ActionPlan';
import { ExplainPanel } from '../common/ExplainPanel';
import { Link2, AlertCircle } from 'lucide-react';

export interface LinkPanelProps {
  readonly check: UseLinkCheckResult;
}

const LinkInputCard: FC<{
  readonly input: string;
  readonly setInput: (v: string) => void;
  readonly applyPreset: (v: string) => void;
}> = ({ input, setInput, applyPreset }) => (
  <div className="flex flex-col gap-3 p-5 rounded-xl border border-sentinel-border bg-white shadow-sm">
    <div className="flex flex-col gap-1.5">
      <label htmlFor="url-input" className="text-sm font-semibold text-sentinel-ink flex items-center gap-1.5">
        <Link2 size={16} className="text-blue-700" aria-hidden="true" />
        <span>Target Web Address (URL)</span>
      </label>
      <p className="text-xs text-sentinel-secondary">
        Evaluates domain homoglyphs, impersonation tokens, security keywords, and structural anomalies.
      </p>
      <input
        id="url-input"
        type="text"
        value={input}
        onChange={(e) => { setInput(e.target.value); }}
        placeholder="e.g. https://example.com/login"
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-mono text-xs sm:text-sm text-sentinel-ink focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
    <PresetChips presets={LINK_PRESETS} onSelect={applyPreset} currentValue={input} label="Test Presets:" />
  </div>
);

export const LinkPanel: FC<LinkPanelProps> = ({ check }) => {
  const { input, setInput, result, applyPreset } = check;

  return (
    <div role="tabpanel" id="panel-link" aria-labelledby="tab-link" className="flex flex-col gap-6">
      <LinkInputCard input={input} setInput={setInput} applyPreset={applyPreset} />
      {result.status === 'invalid' && (
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0 text-amber-700" aria-hidden="true" />
          <span>{result.reason}</span>
        </div>
      )}
      {result.status === 'ok' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 flex flex-col gap-4 p-5 rounded-xl border border-sentinel-border bg-white shadow-sm items-center">
            <RiskGauge score={result.score} verdict={result.verdict} label="Link Risk" />
            <SeverityPill verdict={result.verdict} size="md" />
            <div className="w-full mt-2">
              <ExplainPanel kind="link" score={result.score} verdict={result.verdict} signals={result.signals} />
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-5">
            <UrlAnatomy segments={result.segments} />
            <SignalList signals={result.signals} />
            <ActionPlan verdict={result.verdict} />
          </div>
        </div>
      )}
    </div>
  );
};
