import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Coins,
  Sun,
  Moon,
  MoreVertical,
  LogOut,
  User,
  Shield,
  X,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, character, logout, theme, toggleTheme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const menuRef = useRef(null);

  const gold = character?.gold ?? 0;
  const streak = character?.streaks?.currentStreak ?? character?.streaks?.current_streak ?? 0;
  const level = character?.level ?? 1;

  const formattedGold = Number(gold).toLocaleString();
  const firstName = user?.name?.split(' ')[0] || 'Player';

  const isDark = theme === 'dark';

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 max-w-[1240px] mx-auto">
        {/* LEFT: Brand Logo & Title */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
        >
          <span className="font-display text-base font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            Mettle
          </span>
        </button>

        {/* RIGHT: Segmented Stats & Controls with Vertical Dividers */}
        <div className="flex items-center text-xs font-sans">
          {user && (
            <div className="flex items-center">
              {/* 1. Player Level & Name */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs transition-colors cursor-pointer hover:text-[var(--text-primary)] ${activeTab === 'profile'
                  ? 'text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-secondary)]'
                  }`}
                title="View Profile"
              >
                <span className="font-mono font-bold text-[var(--accent)] text-[11px] sm:text-xs">
                  Lvl {level}
                </span>
                <span className="font-semibold text-[var(--text-primary)] hidden md:inline truncate max-w-[90px]">
                  {firstName}
                </span>
              </button>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-[var(--border)] mx-0.5 sm:mx-1" />

              {/* 2. Consistency Streak */}
              <div
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 font-sans text-xs cursor-default"
                title={`${streak} Day Habit Consistency Streak`}
              >
                <Flame className={`h-3.5 w-3.5 ${streak > 0 ? 'text-amber-500 fill-amber-500/20' : 'text-[var(--text-muted)]'}`} />
                <span className="font-mono font-bold text-[var(--text-primary)] text-[11px] sm:text-xs">
                  {streak} <span className="hidden sm:inline">{streak === 1 ? 'day' : 'days'}</span>
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-[var(--border)] mx-0.5 sm:mx-1" />

              {/* 3. Gold Treasury */}
              <button
                onClick={() => setActiveTab('shop')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs transition-colors cursor-pointer hover:text-[var(--gold)] ${activeTab === 'shop'
                  ? 'text-[var(--gold)] font-bold'
                  : 'text-[var(--text-secondary)]'
                  }`}
                title="Reward Bazaar"
              >
                <Coins className="h-3.5 w-3.5 text-[var(--gold)]" />
                <span className="font-mono font-bold text-[var(--gold)] text-[11px] sm:text-xs">
                  {formattedGold}
                </span>
              </button>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-[var(--border)] mx-0.5 sm:mx-1" />
            </div>
          )}

          {/* 4. Action Utilities (Theme, Sound, Options) */}
          <div className="flex items-center gap-1 pl-2">
            {/* Theme Toggle (☾ / ☼) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4 text-[var(--accent)]" /> : <Moon className="h-4 w-4 text-[var(--text-secondary)]" />}
            </button>

            {/* Options Dropdown Menu (⋮) */}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`p-1.5 rounded-sm transition-colors cursor-pointer ${menuOpen
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  title="Menu"
                  aria-label="Open Menu"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {/* Dropdown Popover */}
                {menuOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 rounded-md bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-lg py-1 z-50 animate-fadeIn font-sans text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('character');
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                    >
                      <Shield className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span>Character Stats</span>
                    </button>

                    <div className="my-1 border-t border-[var(--border)]" />

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors cursor-pointer font-semibold"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-md mettle-panel border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xl space-y-4 font-sans text-xs">
            {/* Header with Close */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
                  <LogOut className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-[var(--text-primary)] uppercase tracking-wide">
                    Log Out
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    End active session
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-sm transition-colors cursor-pointer"
                title="Cancel"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              Are you sure you want to log out? Your daily progress, character stats, and streaks are safely saved.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-sm border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="px-4 py-2 rounded-sm bg-[var(--danger)] hover:bg-[var(--danger)]/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
