import type { DrillState } from '../types/ui';

export type DrillAction =
  | { readonly type: 'ANSWER'; readonly isScam: boolean; readonly correct: boolean }
  | { readonly type: 'NEXT'; readonly totalItems: number }
  | { readonly type: 'RESET' };

export const INITIAL_DRILL_STATE: DrillState = {
  currentIndex: 0,
  answered: false,
  selectedAnswer: null,
  score: 0,
  totalAnswered: 0,
};

/**
 * Pure reducer handling transitions for the Spot-the-Scam awareness drill.
 *
 * @param state - The current drill state.
 * @param action - Drill action to execute.
 * @returns Updated immutable drill state.
 */
export function drillReducer(state: DrillState, action: DrillAction): DrillState {
  switch (action.type) {
    case 'ANSWER': {
      if (state.answered) {
        return state;
      }
      return {
        ...state,
        answered: true,
        selectedAnswer: action.isScam,
        score: action.correct ? state.score + 1 : state.score,
        totalAnswered: state.totalAnswered + 1,
      };
    }
    case 'NEXT': {
      const nextIndex = (state.currentIndex + 1) % action.totalItems;
      return {
        ...state,
        currentIndex: nextIndex,
        answered: false,
        selectedAnswer: null,
      };
    }
    case 'RESET': {
      return INITIAL_DRILL_STATE;
    }
    default: {
      return state;
    }
  }
}
