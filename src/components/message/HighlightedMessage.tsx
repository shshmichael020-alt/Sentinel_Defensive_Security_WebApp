import type { FC } from 'react';
import type { MessageHighlightChunk } from '../../types/analysis';
import { AlertCircle } from 'lucide-react';

export interface HighlightedMessageProps {
  readonly highlights: readonly MessageHighlightChunk[];
}

export const HighlightedMessage: FC<HighlightedMessageProps> = ({ highlights }) => {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-sentinel-border bg-slate-50/50">
      <div className="flex items-center justify-between text-xs text-sentinel-secondary mb-1">
        <span className="font-semibold uppercase tracking-wider text-[11px]">Social Engineering Highlights</span>
        <span>Phishing Cues Identified</span>
      </div>
      <div className="text-xs sm:text-sm text-sentinel-ink font-sans leading-relaxed whitespace-pre-wrap">
        {highlights.map((chunk, index) => {
          if (!chunk.flagged) {
            return <span key={index}>{chunk.text}</span>;
          }

          const reasonLabel = chunk.signalId?.replaceAll('_', ' ') ?? 'threat signal';
          return (
            <mark
              key={index}
              className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-950 px-1 py-0.5 rounded border-b-2 border-amber-600 font-semibold"
            >
              <AlertCircle size={12} className="text-amber-700 shrink-0 inline" aria-hidden="true" />
              <span>{chunk.text}</span>
              <span className="sr-only"> (flagged: {reasonLabel})</span>
            </mark>
          );
        })}
      </div>
    </div>
  );
};
