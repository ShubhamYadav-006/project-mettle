import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Check,
  Shield,
  Zap,
  Sparkles,
  Target,
  Palette,
  TrendingUp,
  ChevronDown,
  Trophy,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  const { theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showcaseTab, setShowcaseTab] = useState('quests');
  const [quests, setQuests] = useState([
    {
      id: 1,
      title: 'Deep Focus Session',
      category: 'MIND',
      badgeColor: '#3B82F6',
      xp: 60,
      done: true,
    },
    {
      id: 2,
      title: 'Interval Conditioning',
      category: 'BODY',
      badgeColor: '#10B981',
      xp: 45,
      done: true,
    },
    {
      id: 3,
      title: 'Systems Thinking',
      category: 'CRAFT',
      badgeColor: '#8B5CF6',
      xp: 50,
      done: true,
    },
    {
      id: 4,
      title: 'Weekly Audit & Review',
      category: 'HABIT',
      badgeColor: '#F59E0B',
      xp: 35,
      done: false,
    },
  ]);

  const isDark = theme === 'dark';

  const toggleQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, done: !q.done } : q))
    );
  };

  const completedXp = quests.filter((q) => q.done).reduce((sum, q) => sum + q.xp, 0);
  const baseXp = 1085;
  const totalXp = baseXp + completedXp;
  const targetXp = 1500;
  const xpPercent = Math.min(100, Math.round((totalXp / targetXp) * 100));

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--accent)] selection:text-black overflow-x-hidden w-full transition-colors duration-200">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
          {/* Left: Brand Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left group focus:outline-none z-10 cursor-pointer"
          >
            <span className="font-display font-extrabold text-lg tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              Mettle
            </span>
          </button>

          {/* Center: Desktop Nav Links (Mathematically Centered with isolated pointer events) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium text-[var(--text-secondary)] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer pointer-events-auto"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('attributes')}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer pointer-events-auto"
            >
              Attributes
            </button>
            <button
              onClick={() => scrollToSection('progression')}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer pointer-events-auto"
            >
              Progression
            </button>
            <button
              onClick={() => scrollToSection('rewards')}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer pointer-events-auto"
            >
              Rewards
            </button>
          </nav>

          {/* Right: Interactive Minimalist Toggle + Actions */}
          <div className="flex items-center gap-2 sm:gap-3 z-20 relative">
            {/* Minimalist Tactile Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              type="button"
              className={`relative inline-flex h-7 w-12 items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none cursor-pointer group shadow-inner ${
                isDark
                  ? 'bg-[#18181B] border border-[#2E2E33] hover:border-[#B5E34A]/60'
                  : 'bg-zinc-200 border border-zinc-300 hover:border-zinc-400'
              }`}
              aria-label="Toggle theme mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 transform shadow-sm ${
                  isDark
                    ? 'translate-x-[20px] bg-[#B5E34A] text-black shadow-[0_0_10px_rgba(181,227,74,0.5)]'
                    : 'translate-x-0 bg-white text-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
                }`}
              >
                {isDark ? (
                  <Moon className="h-3.5 w-3.5 stroke-[2.5]" />
                ) : (
                  <Sun className="h-3.5 w-3.5 stroke-[2.5] text-amber-500" />
                )}
              </span>
            </button>

            <button
              onClick={onLogin}
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={onGetStarted}
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-extrabold text-xs uppercase tracking-wider px-3 sm:px-3.5 py-2 rounded-md transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(181,227,74,0.25)] active:scale-95 shrink-0 cursor-pointer"
            >
              <span>START FREE</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Mobile Hamburger Menu Toggle (< md) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-md transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--text-primary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 space-y-3 animate-fadeIn">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] py-1.5 transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('attributes')}
              className="block w-full text-left text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] py-1.5 transition-colors"
            >
              Attributes
            </button>
            <button
              onClick={() => scrollToSection('progression')}
              className="block w-full text-left text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] py-1.5 transition-colors"
            >
              Progression
            </button>
            <button
              onClick={() => scrollToSection('rewards')}
              className="block w-full text-left text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] py-1.5 transition-colors"
            >
              Rewards
            </button>

            {/* Mobile Theme Toggle Row */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Theme Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#18181B] border border-[#2E2E33]'
                    : 'bg-zinc-200 border border-zinc-300'
                }`}
                aria-label="Toggle theme mode"
              >
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 transform shadow-sm ${
                    isDark
                      ? 'translate-x-[20px] bg-[#B5E34A] text-black shadow-[0_0_10px_rgba(181,227,74,0.5)]'
                      : 'translate-x-0 bg-white text-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  {isDark ? (
                    <Moon className="h-3.5 w-3.5 stroke-[2.5]" />
                  ) : (
                    <Sun className="h-3.5 w-3.5 stroke-[2.5] text-amber-500" />
                  )}
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogin();
                }}
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="text-xs font-bold text-[var(--accent)] uppercase py-1.5"
              >
                Create Account &rarr;
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="space-y-20 sm:space-y-28 lg:space-y-36 pb-20 sm:pb-28">
        {/* 2. Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 lg:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] font-black uppercase text-[var(--text-primary)] leading-[1.08] tracking-tight">
                FORGE YOURSELF <br />
                <span className="text-[var(--accent)]">THROUGH DAILY</span> <br />
                PROGRESS.
              </h1>

              <p className="text-[var(--text-secondary)] text-xs sm:text-sm md:text-base leading-relaxed max-w-md">
                Complete real-world quests, earn XP, build attributes, and level up the person you're becoming.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onGetStarted}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(181,227,74,0.3)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3.5 rounded-md border border-[var(--border-strong)] hover:border-[var(--text-secondary)] transition-all text-center cursor-pointer"
                >
                  SEE HOW IT WORKS
                </button>
              </div>
            </div>

            {/* Hero Right Preview Card */}
            <div className="lg:col-span-6 w-full min-w-0">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm w-full transition-colors duration-200">
                {/* Card Top Nav */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[var(--text-primary)] tracking-tight">
                      Mettle
                    </span>
                    <span className="bg-[var(--accent)] text-[var(--accent-text)] text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                      LEVEL 1 <ChevronDown className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    <button
                      onClick={() => setShowcaseTab('quests')}
                      className={`transition-colors pb-0.5 cursor-pointer ${
                        showcaseTab === 'quests'
                          ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      QUESTS
                    </button>
                    <button
                      onClick={() => setShowcaseTab('stats')}
                      className={`transition-colors pb-0.5 cursor-pointer ${
                        showcaseTab === 'stats'
                          ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      STATS
                    </button>
                    <button
                      onClick={() => setShowcaseTab('rewards')}
                      className={`transition-colors pb-0.5 cursor-pointer ${
                        showcaseTab === 'rewards'
                          ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      REWARDS
                    </button>
                  </div>
                </div>

                {/* Card XP / Level Header */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      NOVICE SCHOLAR
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                      + {completedXp} XP TODAY
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-mono tracking-tight">
                      {totalXp.toLocaleString()} XP
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      / {targetXp.toLocaleString()} XP
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(181,227,74,0.5)]"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>

                {/* Showcase Tab Content */}
                {showcaseTab === 'quests' && (
                  <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-2.5">
                    {quests.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => toggleQuest(q.id)}
                        className={`p-2.5 sm:p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer select-none gap-2 ${
                          q.done
                            ? 'bg-[var(--bg-secondary)] border-[var(--border)]'
                            : 'bg-[var(--bg-surface)] border-[var(--border-strong)] hover:border-[var(--accent)]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div
                            className={`w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors ${
                              q.done
                                ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                                : 'border border-[var(--border-strong)] bg-transparent'
                            }`}
                          >
                            {q.done && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs font-bold truncate ${
                              q.done ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                            }`}
                          >
                            {q.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <span
                            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                            style={{
                              backgroundColor: `${q.badgeColor}18`,
                              color: q.badgeColor,
                              border: `1px solid ${q.badgeColor}33`,
                            }}
                          >
                            {q.category}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[var(--accent)]">
                            +{q.xp} XP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showcaseTab === 'stats' && (
                  <div className="mt-4 sm:mt-5 py-4 flex flex-col items-center justify-center">
                    <div className="w-full max-w-[240px] aspect-square flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                        {[0.25, 0.5, 0.75, 1].map((r, idx) => {
                          const pts = [0, 1, 2, 3, 4]
                            .map((i) => {
                              const angle = i * ((Math.PI * 2) / 5) - Math.PI / 2;
                              return `${100 + 70 * r * Math.cos(angle)},${100 + 70 * r * Math.sin(angle)}`;
                            })
                            .join(' ');
                          return (
                            <polygon
                              key={idx}
                              points={pts}
                              fill="none"
                              stroke={isDark ? '#2E2E33' : '#E2E2E2'}
                              strokeWidth="1"
                            />
                          );
                        })}
                        <polygon
                          points="100,50 148,85 130,145 70,145 52,85"
                          fill="#B5E34A"
                          fillOpacity="0.25"
                          stroke="#B5E34A"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <p className="text-[11px] font-mono text-[var(--text-muted)] mt-2 text-center">
                      Core Attributes dynamically tracked in real-time.
                    </p>
                  </div>
                )}

                {showcaseTab === 'rewards' && (
                  <div className="mt-4 sm:mt-5 space-y-2 text-xs">
                    <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg flex items-center justify-between">
                      <span className="font-bold text-[var(--text-primary)]">Streak Freeze Shield</span>
                      <span className="font-mono text-[#F59E0B] font-bold">100 Gold</span>
                    </div>
                    <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg flex items-center justify-between">
                      <span className="font-bold text-[var(--text-primary)]">Guilt-Free Gaming Pass</span>
                      <span className="font-mono text-[#F59E0B] font-bold">150 Gold</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Section 2: "HOW METTLE WORKS" */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
            HOW METTLE WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-[var(--text-primary)] tracking-tight mt-2">
            DO. EARN. GROW.
          </h2>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-3 max-w-lg mx-auto">
            Complete real-life quests, earn XP, improve your stats, and level up.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 sm:mt-12 text-left">
            {/* Card 01 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)] font-bold">01</span>
                  <Target className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <h3 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  CHOOSE A QUEST
                </h3>
                <p className="text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
                  Pick something you want to accomplish today. Turn it into a quest.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)] font-bold">02</span>
                  <Check className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <h3 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  GET IT DONE
                </h3>
                <p className="text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
                  Complete the quest in real life and mark it done.
                </p>
              </div>
            </div>

            {/* Card 03 (Highlighted Active Card) */}
            <div className="bg-[var(--bg-surface)] border border-[var(--accent)]/60 rounded-xl p-5 sm:p-6 shadow-[0_0_20px_var(--accent-soft)] flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--accent)] font-bold">03</span>
                  <div className="w-6 h-6 rounded bg-[var(--accent-soft)] flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </div>
                </div>
                <h3 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  EARN XP
                </h3>
                <p className="text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
                  Earn XP and rewards every time you make progress.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)] font-bold">04</span>
                  <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <h3 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  GROW &amp; LEVEL UP
                </h3>
                <p className="text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
                  Use your progress to grow your stats and reach the next level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Section 3: "CORE ATTRIBUTES" */}
        <section id="attributes" className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-left space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
              STATS THAT MATTER
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-[var(--text-primary)] tracking-tight">
              GROW IN EVERY PART OF LIFE.
            </h2>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm">
              Every quest helps you improve a different part of yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 sm:mt-10 items-center">
            {/* Left 5 Attributes */}
            <div className="lg:col-span-6 space-y-2.5 sm:space-y-3">
              {[
                {
                  dot: '#3B82F6',
                  title: 'MIND',
                  desc: 'Learning, coding, reading and thinking.',
                },
                {
                  dot: '#EAB308',
                  title: 'WILL',
                  desc: 'Discipline, routines and getting things done.',
                },
                {
                  dot: '#10B981',
                  title: 'BODY',
                  desc: 'Fitness, exercise and staying active.',
                },
                {
                  dot: '#A855F7',
                  title: 'CRAFT',
                  desc: 'Building, creating, writing and designing.',
                },
                {
                  dot: '#F97316',
                  title: 'HABIT',
                  desc: 'Consistency and keeping your streak going.',
                },
              ].map((attr, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-lg p-3 sm:p-3.5 flex items-center gap-3 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: attr.dot }}
                  />
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] tracking-wider shrink-0 w-14 sm:w-16">
                    {attr.title}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] min-w-0 flex-1 leading-snug">
                    {attr.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Pentagon Radar Chart Card */}
            <div className="lg:col-span-6 w-full min-w-0">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-4 sm:p-6 relative transition-colors duration-200">
                {/* Header inside card */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    YOUR PROGRESS
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 rounded uppercase">
                    SAMPLE PROGRESS
                  </span>
                </div>

                {/* Fully responsive viewBox with ample margin to avoid label clipping */}
                <div className="flex items-center justify-center py-2 sm:py-4">
                  <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[360/300] flex items-center justify-center">
                    <svg
                      viewBox="0 0 360 300"
                      className="w-full h-full select-none"
                    >
                      {/* Concentric pentagon rings (cx=180, cy=155, R=85) */}
                      {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
                        const points = [0, 1, 2, 3, 4]
                          .map((i) => {
                            const angle = i * ((Math.PI * 2) / 5) - Math.PI / 2;
                            const x = 180 + 85 * scale * Math.cos(angle);
                            const y = 155 + 85 * scale * Math.sin(angle);
                            return `${x.toFixed(1)},${y.toFixed(1)}`;
                          })
                          .join(' ');
                        return (
                          <polygon
                            key={sIdx}
                            points={points}
                            fill="none"
                            stroke={isDark ? '#2E2E33' : '#E2E2E2'}
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Radial axis lines */}
                      {[0, 1, 2, 3, 4].map((i) => {
                        const angle = i * ((Math.PI * 2) / 5) - Math.PI / 2;
                        const x = 180 + 85 * Math.cos(angle);
                        const y = 155 + 85 * Math.sin(angle);
                        return (
                          <line
                            key={i}
                            x1="180"
                            y1="155"
                            x2={x.toFixed(1)}
                            y2={y.toFixed(1)}
                            stroke={isDark ? '#2E2E33' : '#E2E2E2'}
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Active Attribute Polygon (Values: [0.70, 0.90, 0.50, 0.80, 0.60]) */}
                      {(() => {
                        const values = [0.7, 0.9, 0.5, 0.8, 0.6];
                        const polygonPts = values
                          .map((val, i) => {
                            const angle = i * ((Math.PI * 2) / 5) - Math.PI / 2;
                            const x = 180 + 85 * val * Math.cos(angle);
                            const y = 155 + 85 * val * Math.sin(angle);
                            return `${x.toFixed(1)},${y.toFixed(1)}`;
                          })
                          .join(' ');

                        return (
                          <>
                            <polygon
                              points={polygonPts}
                              fill="#B5E34A"
                              fillOpacity="0.22"
                              stroke="#B5E34A"
                              strokeWidth="2"
                            />
                            {values.map((val, i) => {
                              const angle = i * ((Math.PI * 2) / 5) - Math.PI / 2;
                              const x = 180 + 85 * val * Math.cos(angle);
                              const y = 155 + 85 * val * Math.sin(angle);
                              return (
                                <circle
                                  key={i}
                                  cx={x.toFixed(1)}
                                  cy={y.toFixed(1)}
                                  r="3.5"
                                  fill="#B5E34A"
                                />
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* Attribute Labels */}
                      {/* Top: Intellect 14 */}
                      <text
                        x="180"
                        y="50"
                        textAnchor="middle"
                        fill={isDark ? '#D4D4D8' : '#3F3F46'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        Intellect 14
                      </text>

                      {/* Top Right: Discipline 18 */}
                      <text
                        x="270"
                        y="132"
                        textAnchor="start"
                        fill={isDark ? '#D4D4D8' : '#3F3F46'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        Discipline 18
                      </text>

                      {/* Bottom Right: Strength 10 */}
                      <text
                        x="236"
                        y="250"
                        textAnchor="start"
                        fill={isDark ? '#D4D4D8' : '#3F3F46'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        Strength 10
                      </text>

                      {/* Bottom Left: Creativity 16 */}
                      <text
                        x="124"
                        y="250"
                        textAnchor="end"
                        fill={isDark ? '#D4D4D8' : '#3F3F46'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        Creativity 16
                      </text>

                      {/* Top Left: Consistency 12 */}
                      <text
                        x="90"
                        y="132"
                        textAnchor="end"
                        fill={isDark ? '#D4D4D8' : '#3F3F46'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        Consistency 12
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Section 4: "LEVEL UP" */}
        <section id="progression" className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
            LEVEL UP
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-[var(--text-primary)] tracking-tight mt-2">
            KEEP GOING. KEEP LEVELING UP.
          </h2>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-3 max-w-xl mx-auto">
            Earn XP through consistent effort. As you level up, each new milestone takes more progress to reach.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 text-left">
            {/* Card 1 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 hover:border-[var(--border-strong)] transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[var(--text-primary)]">LEVEL 1</span>
                <span className="font-mono text-xs font-bold text-[var(--accent)]">100 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] w-full rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
                NOVICE
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 hover:border-[var(--border-strong)] transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[var(--text-primary)]">LEVEL 5</span>
                <span className="font-mono text-xs font-bold text-[var(--accent)]">800 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] w-full rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
                APPRENTICE
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 hover:border-[var(--border-strong)] transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[var(--text-primary)]">LEVEL 10</span>
                <span className="font-mono text-xs font-bold text-[var(--accent)]">2,700 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] w-[75%] rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
                ADEPT
              </span>
            </div>

            {/* Card 4 */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 hover:border-[var(--border-strong)] transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[var(--text-primary)]">LEVEL 20</span>
                <span className="font-mono text-xs font-bold text-[var(--accent)]">8,200 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] w-[40%] rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
                MASTER
              </span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] italic mt-6 sm:mt-8">
            *Every level is earned through consistent progress.*
          </p>
        </section>

        {/* 6. Section 5: "YOUR EFFORT EARNS REWARDS." */}
        <section id="rewards" className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy & CTA */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-[var(--text-primary)] leading-tight tracking-tight">
                YOUR EFFORT <br />
                EARNS REWARDS.
              </h2>
              <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed max-w-sm">
                Earn Gold through consistent progress and spend it on rewards that make your journey more satisfying.
              </p>
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={onGetStarted}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(181,227,74,0.25)] hover:scale-[1.02] active:scale-95 w-full sm:w-auto cursor-pointer"
                >
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right 2x2 Reward Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              {/* Reward 1 */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] uppercase tracking-wide">
                  STREAK FREEZE
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  Protect your streak when life gets unpredictable.
                </p>
              </div>

              {/* Reward 2 */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] uppercase tracking-wide">
                  GUILT-FREE BREAK
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  Enjoy your gaming or entertainment downtime.
                </p>
              </div>

              {/* Reward 3 */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                  <Palette className="w-4 h-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] uppercase tracking-wide">
                  PROFILE THEME
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  Customize your Mettle aesthetic and interface.
                </p>
              </div>

              {/* Reward 4 */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[var(--text-primary)] uppercase tracking-wide">
                  MILESTONE REWARD
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  Celebrate reaching long-term personal progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Section 6: Final CTA Banner */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-4 sm:pt-8">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black uppercase text-[var(--text-primary)] tracking-tight leading-tight">
              YOUR NEXT LEVEL STARTS <br />
              TODAY.
            </h2>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm max-w-md mx-auto">
              Stop waiting for motivation. Start building momentum.
            </p>
            <div className="pt-4 sm:pt-6">
              <button
                onClick={onGetStarted}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-md inline-flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(181,227,74,0.35)] hover:scale-105 active:scale-95 w-full sm:w-auto cursor-pointer"
              >
                <span>START YOUR JOURNEY</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-4 sm:px-6 bg-[var(--bg-primary)] transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[var(--text-primary)] tracking-tight">
              Mettle
            </span>
            <span className="text-[var(--text-muted)] text-xs ml-2">
              Build yourself. Level by level.
            </span>
          </div>

          <div className="text-[var(--text-muted)] text-xs font-mono">
            &copy; 2026 Mettle
          </div>
        </div>
      </footer>
    </div>
  );
}
