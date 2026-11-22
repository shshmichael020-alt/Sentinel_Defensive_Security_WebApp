import { useState, useCallback, type KeyboardEvent } from 'react';
import type { TabId } from '../types/ui';

export interface UseRovingTabsResult {
  readonly activeTab: TabId;
  readonly setActiveTab: (tab: TabId) => void;
  readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  readonly tabs: readonly TabId[];
}

const ORDERED_TABS: readonly TabId[] = ['link', 'message', 'password', 'learn'];

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
      let nextIndex = currentIndex;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % ORDERED_TABS.length;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (currentIndex - 1 + ORDERED_TABS.length) % ORDERED_TABS.length;
      } else if (event.key === 'Home') {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        nextIndex = ORDERED_TABS.length - 1;
      }

      const targetTab = ORDERED_TABS[nextIndex];
      if (targetTab && targetTab !== activeTab) {
        setActiveTab(targetTab);
        const nextButton = document.getElementById(`tab-${targetTab}`);
        nextButton?.focus();
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
