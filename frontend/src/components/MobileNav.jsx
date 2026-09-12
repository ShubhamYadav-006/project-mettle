import React from 'react';
import { LayoutDashboard, CheckSquare, Shield, User, Plus } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, onOpenCreateModal }) {
  const leftItems = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'quests', label: 'Tasks', icon: CheckSquare },
  ];

  const rightItems = [
    { id: 'character', label: 'Character', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around">
      {leftItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Central Tactile Task Button */}
      <button
        onClick={onOpenCreateModal}
        className="flex items-center justify-center -mt-4 h-11 w-11 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-black shadow-subtle border border-[var(--border-strong)] active:scale-95 transition-all"
        title="Add New Task"
        aria-label="Add Task"
      >
        <Plus className="h-5 w-5 stroke-[2.5]" />
      </button>

      {rightItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
