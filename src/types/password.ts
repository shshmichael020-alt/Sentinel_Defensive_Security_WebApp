export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export type PasswordStrengthLabel =
  | 'Very weak'
  | 'Weak'
  | 'Fair'
  | 'Strong'
  | 'Very strong';

export interface PasswordChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly passed: boolean;
}

export type PasswordAnalysisResult =
  | { readonly status: 'empty' }
  | {
      readonly status: 'ok';
      readonly rawEntropy: number;
      readonly effectiveEntropy: number;
      readonly level: PasswordStrengthLevel;
      readonly label: PasswordStrengthLabel;
      readonly crackTimeOnline: string;
      readonly crackTimeOffline: string;
      readonly crackTimeGpu: string;
      readonly checklist: readonly PasswordChecklistItem[];
      readonly penalties: readonly string[];
    };
