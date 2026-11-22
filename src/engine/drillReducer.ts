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

function handleAnswer(state: DrillState, isScam: boolean, correct: boolean): DrillState {
  if (state.answered) return state;
  return {
    ...state,
    answered: true,
    selectedAnswer: isScam,
    score: correct ? state.score + 1 : state.score,
    totalAnswered: state.totalAnswered + 1,
  };
}

/**
 * Pure reducer handling transitions for the Spot-the-Scam awareness drill.
 *
 * @param state - The current drill state.
 * @param action - Drill action to execute.
 * @returns Updated immutable drill state.
 */
export function drillReducer(state: DrillState, action: DrillAction): DrillState {
  switch (action.type) {
    case 'ANSWER':
      return handleAnswer(state, action.isScam, action.correct);
    case 'NEXT':
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % action.totalItems,
        answered: false,
        selectedAnswer: null,
      };
    case 'RESET':
      return INITIAL_DRILL_STATE;
    default:
      return state;
  }
}
