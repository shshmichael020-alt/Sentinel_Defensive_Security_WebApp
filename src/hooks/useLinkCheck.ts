import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import type { LinkAnalysisResult } from '../types/analysis';
import { LINK_PRESETS } from '../constants/presets';
import { analyzeUrl } from '../engine/analyzeUrl';

export interface UseLinkCheckResult {
  readonly input: string;
  readonly setInput: (value: string) => void;
  readonly result: LinkAnalysisResult;
  readonly applyPreset: (value: string) => void;
}

const DEFAULT_LINK_INPUT = LINK_PRESETS[0]?.value ?? 'http://paypa1-security-update.xyz/login';

/**
 * Hook managing link checking state, presets, and live analysis.
 *
 * @param initialUrl - Optional initial URL to pre-load.
 * @returns State and handlers for URL analysis.
 */
export function useLinkCheck(initialUrl: string = DEFAULT_LINK_INPUT): UseLinkCheckResult {
  const [input, setInputState] = useState<string>(initialUrl);
  const deferredInput = useDeferredValue(input);

  const result = useMemo<LinkAnalysisResult>(() => {
    return analyzeUrl(deferredInput);
  }, [deferredInput]);

  const setInput = useCallback((value: string) => {
    setInputState(value);
  }, []);

  const applyPreset = useCallback((presetUrl: string) => {
    setInputState(presetUrl);
  }, []);

  return {
    input,
    setInput,
    result,
    applyPreset,
  };
}
