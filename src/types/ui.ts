import type { Verdict } from './severity';

export const TAB_IDS = ['link', 'message', 'password', 'learn'] as const;
export type TabId = (typeof TAB_IDS)[number];

export interface Playbook {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly howItWorks: string;
  readonly redFlags: readonly string[];
  readonly whatToDo: readonly string[];
}

export interface DrillItem {
  readonly id: string;
  readonly text: string;
  readonly isScam: boolean;
  readonly explanation: string;
}

export interface DrillState {
  readonly currentIndex: number;
  readonly answered: boolean;
  readonly selectedAnswer: boolean | null;
  readonly score: number;
  readonly totalAnswered: number;
}

export interface SessionPosture {
  readonly worstVerdict: Verdict;
  readonly checksRunCount: number;
  readonly summary: string;
}

export interface KpiCardData {
  readonly label: string;
  readonly value: string;
  readonly badgeText: string;
  readonly verdict: Verdict;
}
