import { describe, it, expect } from 'vitest';
import { drillReducer, INITIAL_DRILL_STATE } from '@/engine/drillReducer';
import { computeSessionPosture } from '@/engine/postureSummary';

describe('drillReducer', () => {
  it('handles ANSWER action correctly', () => {
    const nextState = drillReducer(INITIAL_DRILL_STATE, {
      type: 'ANSWER',
      isScam: true,
      correct: true,
    });
    expect(nextState.answered).toBe(true);
    expect(nextState.selectedAnswer).toBe(true);
    expect(nextState.score).toBe(1);
    expect(nextState.totalAnswered).toBe(1);
  });

  it('ignores duplicate ANSWER actions when already answered', () => {
    const answeredState = drillReducer(INITIAL_DRILL_STATE, {
      type: 'ANSWER',
      isScam: true,
      correct: true,
    });
    const duplicate = drillReducer(answeredState, {
      type: 'ANSWER',
      isScam: false,
      correct: false,
    });
    expect(duplicate.score).toBe(1);
    expect(duplicate.totalAnswered).toBe(1);
  });

  it('cycles to next item on NEXT action', () => {
    const answeredState = drillReducer(INITIAL_DRILL_STATE, {
      type: 'ANSWER',
      isScam: true,
      correct: true,
    });
    const nextItem = drillReducer(answeredState, { type: 'NEXT', totalItems: 6 });
    expect(nextItem.currentIndex).toBe(1);
    expect(nextItem.answered).toBe(false);
    expect(nextItem.selectedAnswer).toBeNull();
  });

  it('resets back to initial state on RESET', () => {
    const advanced = {
      currentIndex: 3,
      answered: true,
      selectedAnswer: false,
      score: 2,
      totalAnswered: 3,
    };
    const reset = drillReducer(advanced, { type: 'RESET' });
    expect(reset).toEqual(INITIAL_DRILL_STATE);
  });
});

describe('computeSessionPosture', () => {
  it('evaluates empty session as Low risk', () => {
    const posture = computeSessionPosture(null, null, null, 0);
    expect(posture.worstVerdict).toBe('Low risk');
    expect(posture.checksRunCount).toBe(0);
  });

  it('identifies worst verdict across all checks', () => {
    const posture = computeSessionPosture('Caution', 'Dangerous', 3, 3);
    expect(posture.worstVerdict).toBe('Dangerous');
    expect(posture.summary).toContain('Critical active threat patterns');
  });

  it('computes Suspicious when highest threat is Suspicious', () => {
    const posture = computeSessionPosture('Low risk', 'Suspicious', 2, 2);
    expect(posture.worstVerdict).toBe('Suspicious');
  });
});
