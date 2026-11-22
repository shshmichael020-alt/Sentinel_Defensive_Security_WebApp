import { useReducer, useMemo, type FC } from 'react';
import type { DrillItem } from '@/types/ui';
import type { MessageAnalysisResult } from '@/types/analysis';
import { DRILL_ITEMS } from '@/constants/drills';
import { drillReducer, INITIAL_DRILL_STATE } from '@/engine/drillReducer';
import { analyzeMessage } from '@/engine/analyzeMessage';
import { SeverityPill } from '../common/SeverityPill';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const FeedbackFooter: FC<{ readonly onNext: () => void; readonly onReset: () => void }> = ({
  onNext,
  onReset,
}) => (
  <div className="flex items-center justify-between pt-1">
    <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-[11px] font-medium text-sentinel-secondary hover:text-sentinel-ink">
      <RotateCcw size={11} aria-hidden="true" />
      <span>Reset Drill</span>
    </button>
    <button type="button" onClick={onNext} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-sm">
      <span>Next Drill</span>
      <ArrowRight size={12} aria-hidden="true" />
    </button>
  </div>
);

const DrillAnswerFeedback: FC<{
  readonly isCorrect: boolean;
  readonly item: DrillItem;
  readonly analysis: MessageAnalysisResult;
  readonly onNext: () => void;
  readonly onReset: () => void;
}> = ({ isCorrect, item, analysis, onNext, onReset }) => (
  <div className="flex flex-col gap-3 p-3.5 rounded-lg border bg-slate-50/50 border-slate-200 text-xs leading-relaxed">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 font-semibold">
        {isCorrect ? (
          <>
            <CheckCircle2 size={16} className="text-emerald-600" aria-hidden="true" />
            <span className="text-emerald-800">Correct Assessment!</span>
          </>
        ) : (
          <>
            <XCircle size={16} className="text-red-600" aria-hidden="true" />
            <span className="text-red-800">Incorrect!</span>
          </>
        )}
      </div>
      {analysis.status === 'ok' && (
        <div className="flex items-center gap-1.5">
          <span className="text-sentinel-secondary text-[11px]">Sentinel Engine:</span>
          <SeverityPill verdict={analysis.verdict} size="sm" />
        </div>
      )}
    </div>
    <p className="text-sentinel-secondary">{item.explanation}</p>
    <FeedbackFooter onNext={onNext} onReset={onReset} />
  </div>
);


const DrillQuestionDisplay: FC<{ readonly text: string; readonly currentIdx: number; readonly score: number; readonly total: number }> = ({
  text,
  currentIdx,
  score,
  total,
}) => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Award size={18} className="text-blue-700" aria-hidden="true" />
        <h3 className="text-sm font-bold text-sentinel-ink">Spot the Scam Drill</h3>
      </div>
      <div className="flex items-center gap-2 text-xs font-mono text-sentinel-secondary">
        <span>Question {currentIdx + 1} / {DRILL_ITEMS.length}</span>
        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          Score: {score}/{total}
        </span>
      </div>
    </div>
    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-sans leading-relaxed text-sentinel-ink">
      <p className="font-mono text-xs text-sentinel-secondary mb-1 uppercase font-semibold">Incoming Message:</p>
      <blockquote className="border-l-2 border-blue-600 pl-3 italic text-sentinel-ink">&ldquo;{text}&rdquo;</blockquote>
    </div>
  </>
);

export const DrillCard: FC = () => {
  const [state, dispatch] = useReducer(drillReducer, INITIAL_DRILL_STATE);
  const currentItem = DRILL_ITEMS[state.currentIndex] ?? DRILL_ITEMS[0] ?? { id: 'fallback', text: '', isScam: true, explanation: '' };
  const engineAnalysis = useMemo(() => analyzeMessage(currentItem.text), [currentItem.text]);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-sentinel-border bg-white shadow-sm">
      <DrillQuestionDisplay text={currentItem.text} currentIdx={state.currentIndex} score={state.score} total={state.totalAnswered} />
      {!state.answered ? (
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => { dispatch({ type: 'ANSWER', isScam: true, correct: currentItem.isScam }); }} className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors shadow-sm">
            Mark as Phishing / Scam
          </button>
          <button type="button" onClick={() => { dispatch({ type: 'ANSWER', isScam: false, correct: !currentItem.isScam }); }} className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors shadow-sm">
            Mark as Legitimate Communication
          </button>
        </div>
      ) : (
        <DrillAnswerFeedback
          isCorrect={state.selectedAnswer === currentItem.isScam}
          item={currentItem}
          analysis={engineAnalysis}
          onNext={() => { dispatch({ type: 'NEXT', totalItems: DRILL_ITEMS.length }); }}
          onReset={() => { dispatch({ type: 'RESET' }); }}
        />
      )}
    </div>
  );
};
