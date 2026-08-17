import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-mist font-sans ${className}`}>
      <nav className="flex gap-6 -mb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap
                ${isActive 
                  ? 'border-mineral text-ink font-semibold' 
                  : 'border-transparent text-charcoal-subtle hover:text-charcoal hover:border-mist-dark'}
              `}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full font-mono ${isActive ? 'bg-sage-subtle text-slate' : 'bg-mist/50 text-charcoal-subtle'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
