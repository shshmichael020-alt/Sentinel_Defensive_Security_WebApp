import type { FC, KeyboardEvent, ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { Link2, MessageSquareWarning, KeyRound, BookOpen } from 'lucide-react';
import type { TabId } from '../../types/ui';

export interface TabBarProps {
  readonly activeTab: TabId;
  readonly onTabChange: (tab: TabId) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

interface TabDef {
  readonly id: TabId;
  readonly label: string;
  readonly icon: ComponentType<LucideProps>;
}

const TABS: readonly TabDef[] = [
  { id: 'link', label: 'Link Check', icon: Link2 },
  { id: 'message', label: 'Message Check', icon: MessageSquareWarning },
  { id: 'password', label: 'Password Check', icon: KeyRound },
  { id: 'learn', label: 'Learn & Emergency', icon: BookOpen },
];

const TabButton: FC<{ readonly tab: TabDef; readonly isActive: boolean; readonly onClick: () => void }> = ({
  tab,
  isActive,
  onClick,
}) => {
  const Icon = tab.icon;
  const activeStyle = isActive
    ? 'border-blue-700 text-blue-700 font-semibold'
    : 'border-transparent text-sentinel-secondary hover:text-sentinel-ink hover:border-slate-300';

  return (
    <button
      key={tab.id}
      role="tab"
      id={`tab-${tab.id}`}
      type="button"
      aria-selected={isActive}
      aria-controls={`panel-${tab.id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:rounded-t ${activeStyle}`}
    >
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      <span>{tab.label}</span>
    </button>
  );
};

export const TabBar: FC<TabBarProps> = ({ activeTab, onTabChange, onKeyDown }) => {
  return (
    <nav aria-label="Security Modules" className="border-b border-sentinel-border mb-6">
      <div
        role="tablist"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-label="Security Analysis Tabs"
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 -mb-px overflow-x-auto scrollbar-none focus:outline-none"
      >
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => { onTabChange(tab.id); }}
          />
        ))}
      </div>
    </nav>
  );
};
