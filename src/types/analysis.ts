import type { Verdict } from './severity';
import type { Signal, SignalId } from './signal';

export type SegmentKind = 'scheme' | 'subdomain' | 'domain' | 'path' | 'query';

export interface UrlSegment {
  readonly kind: SegmentKind;
  readonly text: string;
  readonly flagged: boolean;
  readonly reason?: SignalId | undefined;
}

export type LinkAnalysisResult =
  | { readonly status: 'empty' }
  | { readonly status: 'invalid'; readonly reason: string }
  | {
      readonly status: 'ok';
      readonly score: number;
      readonly verdict: Verdict;
      readonly signals: readonly Signal[];
      readonly segments: readonly UrlSegment[];
      readonly normalizedUrl: string;
    };

export interface MessageHighlightChunk {
  readonly text: string;
  readonly flagged: boolean;
  readonly signalId?: SignalId | undefined;
}

export type MessageAnalysisResult =
  | { readonly status: 'empty' }
  | {
      readonly status: 'ok';
      readonly score: number;
      readonly verdict: Verdict;
      readonly signals: readonly Signal[];
      readonly highlights: readonly MessageHighlightChunk[];
      readonly extractedUrls: readonly string[];
    };
