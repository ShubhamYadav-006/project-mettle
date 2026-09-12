import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Check,
  Sun,
  Moon,
  Shield,
  Zap,
  Sparkles,
  Target,
  Award,
  Palette,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RadarChart from '../components/RadarChart';

export default function LandingPage({ onGetStarted, onLogin }) {
  const { theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';
  const [showcaseTab, setShowcaseTab] = useState('quests'); // 'quests' | 'stats' | 'rewards'
  const [progressionVisible, setProgressionVisible] = useState(false);
  const progressionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgressionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgressionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (progressionRef.current) {
      observer.observe(progressionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const demoAttributes = {
    intellect: 42,
    discipline: 38,
    strength: 30,
    creativity: 35,
    consistency: 45,
  };

  const showcaseQuests = [
    {
      category: 'MIND',
      color: 'var(--attr-mind)',
      title: 'Deep Focus Session',
      desc: 'Complete core architecture module',
      xp: '+60 XP',
      done: true,
    },
    {
      category: 'BODY',
      color: 'var(--attr-body)',
      title: 'Interval Conditioning',
      desc: '30 minute workout & recovery',
      xp: '+45 XP',
      done: true,
    },
    {
      category: 'MIND',
      color: 'var(--attr-mind)',
      title: 'Systems Thinking',
      desc: 'Read 25 pages of deep literature',
      xp: '+30 XP',
      done: true,
    },
    {
      category: 'WILL',
      color: 'var(--attr-will)',
      title: 'Weekly Audit & Review',
      desc: 'Audit goals & habit consistency',
      xp: '+40 XP',
      done: false,
    },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="relative flex h-16 items-center justify-between px-4 md:px-8 max-w-[1200px] mx-auto">
          {/* Clickable Logo -> Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center text-left focus:outline-none group focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
          >
            <span className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              Mettle
            </span>
          </button>

          {/* Centered Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-sans font-semibold text-[var(--text-secondary)] absolute left-1/2 -translate-x-1/2">
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#attributes"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('attributes');
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Attributes
            </a>
            <a
              href="#progression"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('progression');
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Progression
            </a>
            <a
              href="#rewards"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('rewards');
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Rewards
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[var(--accent)]" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--text-secondary)]" />
              )}
            </button>

            <button
              onClick={onLogin}
              className="px-3 py-1.5 rounded-sm text-xs font-sans font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-semibold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-sm flex items-center gap-1"
            >
              <span>Start Free</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* 2. Hero Section */}
        <section className="px-4 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24 max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Hero Narrative */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">


              {/* Primary Single H1 */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.05]">
                FORGE YOURSELF<br />
                <span className="text-[var(--accent)]">THROUGH DAILY PROGRESS.</span>
              </h1>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto md:mx-0">
                Complete real-world quests, earn XP, build attributes, and level up the person you're becoming.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center md:justify-start">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-bold text-sm uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-sans font-semibold text-sm uppercase tracking-wider transition-all"
                >
                  SEE HOW IT WORKS
                </button>
              </div>


            </div>

            {/* Right Column: Life RPG Character Progression Screen */}
            <div className="md:col-span-5">
              <div className="mettle-panel rounded-md p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border)] shadow-md space-y-4">
                {/* Character Header & Tabs */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs font-bold tracking-wide text-[var(--text-primary)]">
                      Mettle
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-sm bg-[var(--accent)] text-[var(--accent-text)]">
                      LEVEL 12
                    </span>
                  </div>

                  {/* RPG Tabs */}
                  <div className="flex gap-1 bg-[var(--bg-elevated)] p-0.5 rounded-sm border border-[var(--border)] text-[11px] font-sans font-semibold">
                    <button
                      onClick={() => setShowcaseTab('quests')}
                      className={`px-2.5 py-0.5 rounded-sm transition-all ${showcaseTab === 'quests'
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      QUESTS
                    </button>
                    <button
                      onClick={() => setShowcaseTab('stats')}
                      className={`px-2.5 py-0.5 rounded-sm transition-all ${showcaseTab === 'stats'
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      STATS
                    </button>
                    <button
                      onClick={() => setShowcaseTab('rewards')}
                      className={`px-2.5 py-0.5 rounded-sm transition-all ${showcaseTab === 'rewards'
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      REWARDS
                    </button>
                  </div>
                </div>

                {/* Top XP Tier Strip */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Novice Scholar
                      </span>
                      <div className="font-display text-sm font-bold text-[var(--text-primary)]">
                        1,240 XP <span className="text-[var(--text-muted)]">/ 1,500 XP</span>
                      </div>
                    </div>
                    <span className="font-display text-xs font-bold text-[var(--accent)]">
                      +135 XP TODAY
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-sm bg-[var(--bg-elevated)] overflow-hidden border border-[var(--border)]">
                    <div className="h-full bg-[var(--accent)] w-[83%] transition-all duration-500" />
                  </div>
                </div>

                {/* Tab 1: Quests */}
                {showcaseTab === 'quests' && (
                  <div className="space-y-2 pt-2">
                    {showcaseQuests.map((q, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-sm border flex items-center justify-between text-xs transition-all ${q.done
                          ? 'bg-[var(--bg-secondary)]/50 border-[var(--border)] opacity-85'
                          : 'bg-[var(--bg-elevated)] border-[var(--border-strong)]'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`h-4 w-4 rounded-sm flex items-center justify-center shrink-0 border ${q.done
                              ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-text)]'
                              : 'border-[var(--border-strong)] bg-[var(--bg-surface)]'
                              }`}
                          >
                            {q.done && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div className="truncate">
                            <span
                              className={`font-sans font-semibold block truncate ${q.done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                                }`}
                            >
                              {q.title}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span
                            className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm border border-[var(--border)] bg-[var(--bg-surface)]"
                            style={{ color: q.color }}
                          >
                            {q.category}
                          </span>
                          <span className="text-[10px] font-display font-bold text-[var(--accent)]">
                            {q.xp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Stats (Radar Chart) */}
                {showcaseTab === 'stats' && (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <div className="scale-85 origin-center -my-4">
                      <RadarChart attributes={demoAttributes} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-sans font-bold pt-1">
                      <span className="px-1.5 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)]" style={{ color: 'var(--attr-mind)' }}>MIND 42</span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)]" style={{ color: 'var(--attr-will)' }}>WILL 38</span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)]" style={{ color: 'var(--attr-body)' }}>BODY 30</span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)]" style={{ color: 'var(--attr-craft)' }}>CRAFT 35</span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)]" style={{ color: 'var(--attr-habit)' }}>HABIT 45</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Rewards & Streaks */}
                {showcaseTab === 'rewards' && (
                  <div className="space-y-2.5 py-1 text-xs">
                    <div className="p-3 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                          Daily Streak
                        </span>
                        <span className="font-display text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
                          <Zap className="h-4 w-4 text-[var(--accent)]" />
                          <span>7 Days Active</span>
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-sm bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] font-sans text-xs font-bold flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Shield Active
                      </span>
                    </div>

                    <div className="p-3 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-sans font-semibold text-[var(--text-primary)]">Gold Treasury</span>
                        <span className="font-display font-bold text-[var(--gold)]">1,240 Gold</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Spend your hard-earned gold on custom breaks, streak protection, and themes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. How Mettle Works Section */}
        <section id="how-it-works" className="px-4 md:px-8 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-[1200px] mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                HOW METTLE WORKS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                DO. EARN. GROW.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Complete real-life quests, earn XP, improve your stats, and level up.
              </p>
            </div>

            {/* 4 Simplified Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'CHOOSE A QUEST',
                  desc: 'Pick something you want to accomplish today. Turn it into a quest.',
                  icon: Target,
                },
                {
                  step: '02',
                  title: 'GET IT DONE',
                  desc: 'Complete the quest in real life and mark it done.',
                  icon: Check,
                },
                {
                  step: '03',
                  title: 'EARN XP',
                  desc: 'Earn XP and rewards every time you make progress.',
                  icon: Zap,
                },
                {
                  step: '04',
                  title: 'GROW & LEVEL UP',
                  desc: 'Use your progress to grow your stats and reach the next level.',
                  icon: TrendingUp,
                },
              ].map((card, i) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={i}
                    className="mettle-panel rounded-md p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-200 space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-black text-[var(--accent)]">
                        {card.step}
                      </span>
                      <div className="h-7 w-7 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent-border)] transition-colors">
                        <CardIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <h3 className="font-display text-sm font-black text-[var(--text-primary)] uppercase tracking-wide">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Attributes Section */}
        <section id="attributes" className="px-4 md:px-8 py-16 md:py-20 border-t border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading + Explanation + 5 Attributes */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                  YOUR CHARACTER
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-[var(--text-primary)] mt-1">
                  GROW IN EVERY PART OF LIFE.
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Every quest helps you improve a different part of yourself.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'MIND', color: 'var(--attr-mind)', desc: 'Learning, coding, reading and thinking.' },
                  { name: 'WILL', color: 'var(--attr-will)', desc: 'Discipline, routines and getting things done.' },
                  { name: 'BODY', color: 'var(--attr-body)', desc: 'Fitness, exercise and staying active.' },
                  { name: 'CRAFT', color: 'var(--attr-craft)', desc: 'Building, creating, writing and designing.' },
                  { name: 'HABIT', color: 'var(--attr-habit)', desc: 'Consistency and keeping your streak going.' },
                ].map((attr, i) => (
                  <div key={i} className="p-3 rounded-sm bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: attr.color }} />
                      <h3 className="font-display text-xs font-black uppercase shrink-0" style={{ color: attr.color }}>
                        {attr.name}
                      </h3>
                      <span className="text-xs text-[var(--text-secondary)]">{attr.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Radar Chart Preview Card */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-6 mettle-panel rounded-md bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm space-y-3">
              <div className="flex items-center justify-between w-full border-b border-[var(--border)] pb-2.5 px-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
                  YOUR PROGRESS
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase px-2 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)]">
                  Example Progress
                </span>
              </div>
              <div className="scale-90 origin-center -my-2">
                <RadarChart attributes={demoAttributes} />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Progression Section */}
        <section
          id="progression"
          ref={progressionRef}
          className="px-4 md:px-8 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]"
        >
          <div className="max-w-[1000px] mx-auto text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                LEVEL UP
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                KEEP GOING. KEEP LEVELING UP.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
                Earn XP through consistent effort. As you level up, each new milestone takes more progress to reach.
              </p>
            </div>

            {/* Visual Progression Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                { lvl: 'LEVEL 1', tier: 'NOVICE', targetWidth: '25%', xp: '100 XP' },
                { lvl: 'LEVEL 5', tier: 'APPRENTICE', targetWidth: '50%', xp: '800 XP' },
                { lvl: 'LEVEL 10', tier: 'ADEPT', targetWidth: '75%', xp: '2,700 XP' },
                { lvl: 'LEVEL 20', tier: 'MASTER', targetWidth: '100%', xp: '8,200 XP' },
              ].map((p, i) => (
                <div
                  key={i}
                  className="p-5 rounded-md mettle-panel bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-200 space-y-3 shadow-sm"
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-sm font-black tracking-wide text-[var(--text-primary)]">
                      {p.lvl}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                      {p.xp}
                    </span>
                  </div>

                  {/* Scroll-Triggered Animated Progress Bar */}
                  <div className="w-full h-2 rounded-sm bg-[var(--bg-elevated)] overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-1000 ease-out"
                      style={{
                        width: progressionVisible ? p.targetWidth : '0%',
                        transitionDelay: `${i * 120}ms`,
                      }}
                      role="progressbar"
                      aria-valuenow={progressionVisible ? parseInt(p.targetWidth) : 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${p.lvl} progress bar`}
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] block uppercase tracking-wider">
                    {p.tier}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[var(--text-muted)] font-medium">
              "Every level is earned through consistent progress."
            </p>
          </div>
        </section>

        {/* 7. Rewards Section */}
        <section id="rewards" className="px-4 md:px-8 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4 text-center md:text-left">

              <h2 className="font-display text-3xl sm:text-4xl font-black text-[var(--text-primary)]">
                YOUR EFFORT EARNS REWARDS.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Earn Gold through consistent progress and spend it on rewards that make your journey more satisfying.
              </p>
              <div className="pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-5 py-2.5 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-bold text-xs uppercase tracking-wider transition-all"
                >
                  START YOUR JOURNEY
                </button>
              </div>
            </div>

            {/* 4 Reward Cards with clean SVG icons */}
            <div className="md:col-span-7 grid sm:grid-cols-2 gap-3">
              {[
                { icon: Shield, name: 'STREAK FREEZE', desc: 'Protect your streak when life gets unpredictable.' },
                { icon: Activity, name: 'GUILT-FREE BREAK', desc: 'Earn your gaming or entertainment downtime.' },
                { icon: Palette, name: 'PROFILE THEME', desc: 'Customize your Mettle aesthetic and interface.' },
                { icon: Award, name: 'MILESTONE REWARD', desc: 'Celebrate meaningful long-term personal progress.' },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-sm mettle-panel bg-[var(--bg-surface)] border border-[var(--border)] space-y-2 hover:border-[var(--accent)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                        <ItemIcon className="h-3.5 w-3.5" />
                      </div>
                      <h3 className="font-display text-xs font-black uppercase text-[var(--text-primary)]">{item.name}</h3>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. Final Call-to-Action Section */}
        <section className="px-4 md:px-8 py-20 border-t border-[var(--border)] bg-[var(--bg-surface)] text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
              YOUR NEXT LEVEL STARTS TODAY.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Stop waiting for motivation. Start building momentum.
            </p>
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-black text-sm uppercase tracking-wider active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>START YOUR JOURNEY</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10 px-4 md:px-8 bg-[var(--bg-primary)] text-xs">
        <div className="max-w-[1200px] mx-auto space-y-8">
          {/* Main Footer Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Left: Brand + Tagline */}
            <div className="space-y-1 text-center sm:text-left">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="font-display text-base font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
              >
                Mettle
              </button>
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                "Build yourself. Level by level."
              </p>
            </div>

            {/* Right: Product Navigation */}
            <div className="space-y-2 text-center sm:text-right">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Product
              </span>
              <nav className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2 text-xs font-sans font-semibold text-[var(--text-secondary)]">
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('how-it-works');
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
                >
                  How It Works
                </a>
                <a
                  href="#attributes"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('attributes');
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
                >
                  Attributes
                </a>
                <a
                  href="#rewards"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('rewards');
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
                >
                  Rewards
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] font-sans">
            <span>© 2026 Mettle</span>
            <span>Built for real-world progress.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
