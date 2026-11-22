import { useState, useCallback, type KeyboardEvent } from 'react';
import type { TabId } from '../types/ui';

export interface UseRovingTabsResult {
  readonly activeTab: TabId;
  readonly setActiveTab: (tab: TabId) => void;
  readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  readonly tabs: readonly TabId[];
}

const ORDERED_TABS: readonly TabId[] = ['link', 'message', 'password', 'learn'];

function resolveNextTabIndex(key: string, current: number, total: number): number | null {
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % total;
    case 'ArrowLeft':
      return (current - 1 + total) % total;
    case 'Home':
      return 0;
    case 'End':
      return total - 1;
    default:
      return null;
  }
}

/**
 * Hook providing roving tabindex keyboard navigation and ARIA accessibility for tab navigation.
 * Supports ArrowLeft, ArrowRight, Home, and End keys.
 *
 * @param defaultTab - Initial active tab identifier.
 * @returns State and keyboard handlers for tab controls.
 */
export function useRovingTabs(defaultTab: TabId = 'link'): UseRovingTabsResult {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const currentIndex = ORDERED_TABS.indexOf(activeTab);
      const nextIndex = resolveNextTabIndex(event.key, currentIndex, ORDERED_TABS.length);
      if (nextIndex === null) return;

      event.preventDefault();
      const targetTab = ORDERED_TABS[nextIndex];
      if (targetTab && targetTab !== activeTab) {
        setActiveTab(targetTab);
        document.getElementById(`tab-${targetTab}`)?.focus();
      }
    },
    [activeTab],
  );

  return {
    activeTab,
    setActiveTab,
    handleKeyDown,
    tabs: ORDERED_TABS,
  };
}
