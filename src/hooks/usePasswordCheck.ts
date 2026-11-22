import { useState, useMemo, useCallback } from 'react';
import type { PasswordAnalysisResult } from '../types/password';
import { PASSWORD_PRESETS } from '../constants/presets';
import { DEFAULT_GENERATED_LENGTH } from '../constants/passwordRules';
import { analyzePassword } from '../engine/analyzePassword';
import { generatePassword } from '../engine/generatePassword';

export interface UsePasswordCheckResult {
  readonly password: string;
  readonly setPassword: (value: string) => void;
  readonly isVisible: boolean;
  readonly toggleVisibility: () => void;
  readonly result: PasswordAnalysisResult;
  readonly applyPreset: (value: string) => void;
  readonly generatorLength: number;
  readonly setGeneratorLength: (length: number) => void;
  readonly generateAndApply: () => string;
}

const DEFAULT_PASSWORD = PASSWORD_PRESETS[0]?.value ?? 'password123';

function usePasswordGenerator(setPassword: (s: string) => void) {
  const [generatorLength, setGeneratorLength] = useState<number>(DEFAULT_GENERATED_LENGTH);
  const generateAndApply = useCallback((): string => {
    const generated = generatePassword(generatorLength);
    setPassword(generated);
    return generated;
  }, [generatorLength, setPassword]);
  return { generatorLength, setGeneratorLength, generateAndApply };
}

/**
 * Hook managing password resilience checking, visibility toggle, and secure generation.
 *
 * @param initialPassword - Optional initial password to pre-load.
 * @returns State and handlers for password evaluation.
 */
export function usePasswordCheck(initialPassword: string = DEFAULT_PASSWORD): UsePasswordCheckResult {
  const [password, setPasswordState] = useState<string>(initialPassword);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { generatorLength, setGeneratorLength, generateAndApply } = usePasswordGenerator(setPasswordState);

  const result = useMemo<PasswordAnalysisResult>(() => {
    return analyzePassword(password);
  }, [password]);

  const setPassword = useCallback((value: string) => { setPasswordState(value); }, []);
  const toggleVisibility = useCallback(() => { setIsVisible((prev) => !prev); }, []);
  const applyPreset = useCallback((presetValue: string) => { setPasswordState(presetValue); }, []);

  return {
    password,
    setPassword,
    isVisible,
    toggleVisibility,
    result,
    applyPreset,
    generatorLength,
    setGeneratorLength,
    generateAndApply,
  };
}
