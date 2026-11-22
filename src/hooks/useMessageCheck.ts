import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import type { MessageAnalysisResult } from '../types/analysis';
import { MESSAGE_PRESETS } from '../constants/presets';
import { analyzeMessage } from '../engine/analyzeMessage';

export interface UseMessageCheckResult {
  readonly input: string;
  readonly setInput: (value: string) => void;
  readonly result: MessageAnalysisResult;
  readonly applyPreset: (value: string) => void;
}

const DEFAULT_MESSAGE_INPUT =
  MESSAGE_PRESETS[0]?.value ??
  'URGENT: Your SBI account has been locked due to pending KYC! Share your 6-digit OTP immediately: http://sbi-verification.xyz/kyc';

/**
 * Hook managing message scam evaluation state, presets, and live static analysis.
 *
 * @param initialText - Optional initial text to pre-load.
 * @returns State and handlers for message text analysis.
 */
export function useMessageCheck(initialText: string = DEFAULT_MESSAGE_INPUT): UseMessageCheckResult {
  const [input, setInputState] = useState<string>(initialText);
  const deferredInput = useDeferredValue(input);

  const result = useMemo<MessageAnalysisResult>(() => {
    return analyzeMessage(deferredInput);
  }, [deferredInput]);

  const setInput = useCallback((value: string) => {
    setInputState(value);
  }, []);

  const applyPreset = useCallback((presetText: string) => {
    setInputState(presetText);
  }, []);

  return {
    input,
    setInput,
    result,
    applyPreset,
  };
}
