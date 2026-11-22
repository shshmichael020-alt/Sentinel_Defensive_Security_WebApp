import type { FC } from 'react';
import type { UseMessageCheckResult } from '../../hooks/useMessageCheck';
import { MESSAGE_MAX_LENGTH } from '../../constants/limits';
import { MESSAGE_PRESETS } from '../../constants/presets';
import { PresetChips } from '../common/PresetChips';
import { RiskGauge } from '../common/RiskGauge';
import { SeverityPill } from '../common/SeverityPill';
import { HighlightedMessage } from './HighlightedMessage';
import { SignalList } from '../common/SignalList';
import { ActionPlan } from '../common/ActionPlan';
import { ExplainPanel } from '../common/ExplainPanel';
import { CopyButton } from '../common/CopyButton';
import { MessageSquareWarning } from 'lucide-react';

export interface MessagePanelProps {
  readonly check: UseMessageCheckResult;
}

const MessageInputCard: FC<{
  readonly input: string;
  readonly setInput: (v: string) => void;
  readonly applyPreset: (v: string) => void;
  readonly warningShareText: string;
  readonly showWarningBtn: boolean;
}> = ({ input, setInput, applyPreset, warningShareText, showWarningBtn }) => (
  <div className="flex flex-col gap-3 p-5 rounded-xl border border-sentinel-border bg-white shadow-sm">
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor="message-input" className="text-sm font-semibold text-sentinel-ink flex items-center gap-1.5">
          <MessageSquareWarning size={16} className="text-blue-700" aria-hidden="true" />
          <span>Suspicious Message Content</span>
        </label>
        <span id="char-counter" className="text-xs font-mono text-sentinel-secondary tabular-nums" aria-live="polite">
          {MESSAGE_MAX_LENGTH - input.length} chars remaining
        </span>
      </div>
      <p className="text-xs text-sentinel-secondary">
        Paste suspicious SMS, WhatsApp, or email text. Extracts and verifies nested links automatically.
      </p>
      <textarea
        id="message-input"
        rows={4}
        value={input}
        maxLength={MESSAGE_MAX_LENGTH}
        aria-describedby="char-counter"
        onChange={(e) => { setInput(e.target.value); }}
        placeholder="Paste suspicious SMS, WhatsApp, or email message..."
        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-sans text-xs sm:text-sm text-sentinel-ink focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all leading-relaxed resize-y"
        spellCheck={false}
      />
    </div>
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <PresetChips presets={MESSAGE_PRESETS} onSelect={applyPreset} currentValue={input} label="Sample Scenarios:" />
      {showWarningBtn && (
        <CopyButton textToCopy={warningShareText} label="Copy Warning to Share" copiedLabel="Warning Copied!" />
      )}
    </div>
  </div>
);

export const MessagePanel: FC<MessagePanelProps> = ({ check }) => {
  const { input, setInput, result, applyPreset } = check;
  const warningText = result.status === 'ok'
    ? `Security Warning: Sentinel analyzed this message as ${result.verdict} (Risk: ${String(result.score)}/100). Do NOT share OTPs, click links, or send funds.`
    : '';

  return (
    <div role="tabpanel" id="panel-message" aria-labelledby="tab-message" className="flex flex-col gap-6">
      <MessageInputCard
        input={input}
        setInput={setInput}
        applyPreset={applyPreset}
        warningShareText={warningText}
        showWarningBtn={result.status === 'ok' && result.verdict !== 'Low risk'}
      />
      {result.status === 'ok' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 flex flex-col gap-4 p-5 rounded-xl border border-sentinel-border bg-white shadow-sm items-center">
            <RiskGauge score={result.score} verdict={result.verdict} label="Message Risk" />
            <SeverityPill verdict={result.verdict} size="md" />
            <div className="w-full mt-2">
              <ExplainPanel kind="message" score={result.score} verdict={result.verdict} signals={result.signals} />
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-5">
            <HighlightedMessage highlights={result.highlights} />
            <SignalList signals={result.signals} />
            <ActionPlan verdict={result.verdict} />
          </div>
        </div>
      )}
    </div>
  );
};
