import React from 'react';
import { useAuth } from '../context/AuthContext';
import AnimatedNumber from './common/AnimatedNumber';
import { LayoutDashboard, CheckSquare, Shield, Gift, User } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { character } = useAuth();
  const level = character?.level ?? 1;
  const totalXp = character?.totalXp ?? character?.total_xp ?? 0;

  const navItems = [
    { id: 'dashboard', label: 'TODAY', icon: LayoutDashboard },
    { id: 'quests', label: 'TASKS', icon: CheckSquare },
    { id: 'character', label: 'CHARACTER', icon: Shield },
    { id: 'shop', label: 'REWARDS', icon: Gift },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-primary)] p-5 min-h-[calc(100vh-3.5rem)] justify-between select-none transition-colors">
      {/* Top Nav Links */}
      <div className="space-y-1.5">
        <div className="px-3 pb-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-xs tracking-wider font-semibold transition-all text-left cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--accent)] border-l-2 border-[var(--accent)] pl-2.5 shadow-sm shadow-[var(--accent)]/5'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:translate-x-0.5'
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Character Summary */}
      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        {/* Character Quick State */}
        <div className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs transition-all hover:border-[var(--border-strong)]">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-xs font-bold tracking-wider text-[var(--text-primary)]">
              LEVEL <AnimatedNumber value={level} />
            </span>
            <span className="font-display text-xs font-bold text-[var(--accent)] flex items-baseline gap-1">
              <AnimatedNumber value={totalXp} /> <span>XP</span>
            </span>
          </div>
        </div>

        {/* Minimalist Quote */}
        <div className="px-3 text-left">
          <p className="font-sans text-xs font-medium text-[var(--text-muted)] leading-snug">
            "Consistent habits.<br />Continuous progress."
          </p>
        </div>
      </div>
    </aside>
  );
}
