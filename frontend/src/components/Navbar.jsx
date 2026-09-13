import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AnimatedNumber from './common/AnimatedNumber';
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

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLogoutModalOpen(false);
      }
    };
    if (isLogoutModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 max-w-[1240px] mx-auto">
        {/* LEFT: Brand Logo & Title */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
        >
          <span className="font-display text-base font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] group-hover:scale-105 transition-all">
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
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs transition-all cursor-pointer hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-md ${activeTab === 'profile'
                  ? 'text-[var(--text-primary)] font-bold bg-[var(--bg-elevated)]'
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
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 font-sans text-xs cursor-default rounded-md transition-colors hover:bg-[var(--bg-elevated)]"
                title={`${streak} Day Habit Consistency Streak`}
              >
                <Flame className={`h-3.5 w-3.5 transition-all ${streak > 0 ? 'text-amber-500 fill-amber-500/20 animate-flame' : 'text-[var(--text-muted)]'}`} />
                <span className="font-mono font-bold text-[var(--text-primary)] text-[11px] sm:text-xs flex items-baseline gap-1">
                  <AnimatedNumber value={streak} />
                  <span className="hidden sm:inline font-sans text-[11px] text-[var(--text-muted)]">{streak === 1 ? 'day' : 'days'}</span>
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="h-4 w-px bg-[var(--border)] mx-0.5 sm:mx-1" />

              {/* 3. Gold Treasury */}
              <button
                onClick={() => setActiveTab('shop')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs transition-all cursor-pointer hover:text-[var(--gold)] hover:bg-[var(--bg-elevated)] rounded-md ${activeTab === 'shop'
                  ? 'text-[var(--gold)] font-bold bg-[var(--bg-elevated)]'
                  : 'text-[var(--text-secondary)]'
                  }`}
                title="Reward Bazaar"
              >
                <Coins className="h-3.5 w-3.5 text-[var(--gold)] transition-transform hover:scale-110" />
                <AnimatedNumber value={gold} className="font-mono font-bold text-[var(--gold)] text-[11px] sm:text-xs" />
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
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-90 transition-all cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[var(--accent)] transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--text-secondary)] transition-transform duration-300 hover:-rotate-12" />
              )}
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
                  <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-xl py-1 z-50 animate-fadeIn font-sans text-xs overflow-hidden">
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
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer font-semibold"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] p-6 sm:p-7 shadow-2xl space-y-5 font-sans text-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

            {/* Header with Icon and Close Button */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)] shrink-0">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                    Confirm Logout
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    End active player session
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                title="Cancel"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Information Card */}
            <div className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] p-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-2.5">
              <p>
                Are you sure you want to log out? Your daily progress, quest streak, character XP, and gold are securely saved.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-mono pt-1 border-t border-[var(--border)]">
                <Shield className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Progress safely synchronized</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer hover:border-[var(--text-muted)] active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/45 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
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
