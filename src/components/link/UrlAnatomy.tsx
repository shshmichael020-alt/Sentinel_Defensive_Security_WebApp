import type { FC } from 'react';
import type { UrlSegment } from '../../types/analysis';
import { TriangleAlert, ShieldAlert } from 'lucide-react';

export interface UrlAnatomyProps {
  readonly segments: readonly UrlSegment[];
}

const SegmentChip: FC<{ readonly segment: UrlSegment }> = ({ segment }) => {
  const isCritical = segment.reason === 'dangerous_scheme' || segment.reason === 'brand_lookalike';
  const borderStyle = segment.flagged
    ? isCritical
      ? 'border-2 border-red-500 bg-red-50 text-red-950 font-semibold'
      : 'border-2 border-amber-500 bg-amber-50 text-amber-950 font-semibold'
    : 'border border-slate-200 bg-white text-sentinel-ink';

  return (
    <div className={`inline-flex flex-col rounded px-2 py-1 ${borderStyle}`}>
      <div className="flex items-center gap-1">
        {segment.flagged && (
          isCritical ? (
            <ShieldAlert size={12} className="text-red-700 shrink-0" aria-hidden="true" />
          ) : (
            <TriangleAlert size={12} className="text-amber-700 shrink-0" aria-hidden="true" />
          )
        )}
        <span>{segment.text}</span>
      </div>
      <div className="flex items-center gap-1 mt-0.5 text-[10px] uppercase font-sans font-medium text-sentinel-secondary">
        <span>{segment.kind}</span>
        {segment.reason && (
          <span className="text-red-800 font-bold">[{segment.reason.replaceAll('_', ' ')}]</span>
        )}
      </div>
    </div>
  );
};

export const UrlAnatomy: FC<UrlAnatomyProps> = ({ segments }) => {
  if (segments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-lg border border-sentinel-border bg-slate-50/50">
      <div className="flex items-center justify-between text-xs text-sentinel-secondary">
        <span className="font-semibold uppercase tracking-wider text-[11px]">Attack Anatomy</span>
        <span>Inspection by Component</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs break-all">
        {segments.map((segment, index) => (
          <SegmentChip key={`${String(index)}-${segment.text}`} segment={segment} />
        ))}
      </div>
    </div>
  );
};
