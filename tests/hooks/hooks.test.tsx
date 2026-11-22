import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLinkCheck } from '../../src/hooks/useLinkCheck';
import { usePasswordCheck } from '../../src/hooks/usePasswordCheck';
import { useRovingTabs } from '../../src/hooks/useRovingTabs';

describe('useLinkCheck', () => {
  it('initializes with pre-loaded preset and computes result', () => {
    const { result } = renderHook(() => useLinkCheck());
    expect(result.current.input.length).toBeGreaterThan(0);
    expect(result.current.result.status).toBe('ok');
  });

  it('updates input and dynamically updates analysis result', () => {
    const { result } = renderHook(() => useLinkCheck());
    act(() => {
      result.current.setInput('https://sbi.co.in/portal');
    });
    expect(result.current.input).toBe('https://sbi.co.in/portal');
    if (result.current.result.status === 'ok') {
      expect(result.current.result.verdict).toBe('Low risk');
    }
  });

  it('applies presets correctly', () => {
    const { result } = renderHook(() => useLinkCheck());
    act(() => {
      result.current.applyPreset('https://paypa1.com');
    });
    expect(result.current.input).toBe('https://paypa1.com');
    if (result.current.result.status === 'ok') {
      expect(result.current.result.signals.some((s) => s.id === 'brand_lookalike')).toBe(true);
    }
  });
});

describe('usePasswordCheck', () => {
  it('toggles password visibility', () => {
    const { result } = renderHook(() => usePasswordCheck());
    expect(result.current.isVisible).toBe(false);
    act(() => {
      result.current.toggleVisibility();
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('generates a strong password and updates state', () => {
    const { result } = renderHook(() => usePasswordCheck());
    act(() => {
      result.current.generateAndApply();
    });
    expect(result.current.password.length).toBe(20);
    if (result.current.result.status === 'ok') {
      expect(result.current.result.label).toBe('Very strong');
    }
  });
});

describe('useRovingTabs', () => {
  it('cycles through tabs with ArrowRight and ArrowLeft', () => {
    const { result } = renderHook(() => useRovingTabs('link'));
    expect(result.current.activeTab).toBe('link');

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowRight',
        preventDefault: () => undefined,
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });
    expect(result.current.activeTab).toBe('message');

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowLeft',
        preventDefault: () => undefined,
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });
    expect(result.current.activeTab).toBe('link');
  });

  it('navigates to first/last tab with Home/End keys', () => {
    const { result } = renderHook(() => useRovingTabs('link'));
    act(() => {
      result.current.handleKeyDown({
        key: 'End',
        preventDefault: () => undefined,
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });
    expect(result.current.activeTab).toBe('learn');

    act(() => {
      result.current.handleKeyDown({
        key: 'Home',
        preventDefault: () => undefined,
      } as unknown as React.KeyboardEvent<HTMLElement>);
    });
    expect(result.current.activeTab).toBe('link');
  });
});
