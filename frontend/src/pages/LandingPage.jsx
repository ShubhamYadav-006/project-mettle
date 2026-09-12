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
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F5] font-sans antialiased selection:bg-[#C6F135] selection:text-black overflow-x-hidden w-full">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1C1C1F] bg-[#09090B]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
          {/* Left: Brand Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left group focus:outline-none z-10"
          >
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#C6F135] transition-colors">
              Mettle
            </span>
          </button>

          {/* Center: Desktop Nav Links (Mathematically Centered) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium text-zinc-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('attributes')}
              className="hover:text-white transition-colors"
            >
              Attributes
            </button>
            <button
              onClick={() => scrollToSection('progression')}
              className="hover:text-white transition-colors"
            >
              Progression
            </button>
            <button
              onClick={() => scrollToSection('rewards')}
              className="hover:text-white transition-colors"
            >
              Rewards
            </button>
          </nav>

          {/* Right: Interactive Minimalist Toggle + Actions */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            {/* Minimalist Tactile Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-[#161619] border border-[#27272A] p-0.5 transition-all duration-300 hover:border-[#C6F135]/60 focus:outline-none cursor-pointer group shadow-inner"
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`flex h-5.5 w-5.5 items-center justify-center rounded-full transition-all duration-300 transform shadow-sm ${
                  theme === 'dark'
                    ? 'translate-x-5 bg-[#C6F135] text-black shadow-[0_0_10px_rgba(198,241,53,0.5)]'
                    : 'translate-x-0 bg-zinc-800 text-zinc-300'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="h-3 w-3 stroke-[2.5]" />
                ) : (
                  <Sun className="h-3 w-3 stroke-[2.5] text-amber-400" />
                )}
              </span>
            </button>

            <button
              onClick={onLogin}
              className="text-xs font-semibold text-zinc-300 hover:text-white px-2.5 py-1.5 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={onGetStarted}
              className="bg-[#C6F135] hover:bg-[#b5e02e] text-[#0A0A0A] font-extrabold text-xs uppercase tracking-wider px-3 sm:px-3.5 py-2 rounded-md transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(198,241,53,0.25)] active:scale-95 shrink-0"
            >
              <span>START FREE</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Mobile Hamburger Menu Toggle (< md) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-md transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#222226] bg-[#0E0E11] px-5 py-4 space-y-3 animate-fadeIn">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-sm font-medium text-zinc-300 hover:text-[#C6F135] py-1.5 transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('attributes')}
              className="block w-full text-left text-sm font-medium text-zinc-300 hover:text-[#C6F135] py-1.5 transition-colors"
            >
              Attributes
            </button>
            <button
              onClick={() => scrollToSection('progression')}
              className="block w-full text-left text-sm font-medium text-zinc-300 hover:text-[#C6F135] py-1.5 transition-colors"
            >
              Progression
            </button>
            <button
              onClick={() => scrollToSection('rewards')}
              className="block w-full text-left text-sm font-medium text-zinc-300 hover:text-[#C6F135] py-1.5 transition-colors"
            >
              Rewards
            </button>
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogin();
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-white py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="text-xs font-bold text-[#C6F135] uppercase py-1.5"
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
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] font-black uppercase text-white leading-[1.08] tracking-tight">
                FORGE YOURSELF <br />
                <span className="text-[#C6F135]">THROUGH DAILY</span> <br />
                PROGRESS.
              </h1>

              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-md">
                Complete real-world quests, earn XP, build attributes, and level up the person you're becoming.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onGetStarted}
                  className="bg-[#C6F135] hover:bg-[#b5e02e] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(198,241,53,0.3)] hover:scale-[1.02] active:scale-95"
                >
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent hover:bg-zinc-800/60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3.5 rounded-md border border-zinc-700/80 hover:border-zinc-500 transition-all text-center"
                >
                  SEE HOW IT WORKS
                </button>
              </div>
            </div>

            {/* Hero Right Preview Card */}
            <div className="lg:col-span-6 w-full min-w-0">
              <div className="bg-[#111113] border border-[#222226] rounded-xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm w-full">
                {/* Card Top Nav */}
                <div className="flex items-center justify-between border-b border-[#222226] pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white tracking-tight">
                      Mettle
                    </span>
                    <span className="bg-[#C6F135] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                      LEVEL 1 <ChevronDown className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                    <button
                      onClick={() => setShowcaseTab('quests')}
                      className={`transition-colors pb-0.5 ${
                        showcaseTab === 'quests'
                          ? 'text-[#C6F135] border-b-2 border-[#C6F135]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      QUESTS
                    </button>
                    <button
                      onClick={() => setShowcaseTab('stats')}
                      className={`transition-colors pb-0.5 ${
                        showcaseTab === 'stats'
                          ? 'text-[#C6F135] border-b-2 border-[#C6F135]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      STATS
                    </button>
                    <button
                      onClick={() => setShowcaseTab('rewards')}
                      className={`transition-colors pb-0.5 ${
                        showcaseTab === 'rewards'
                          ? 'text-[#C6F135] border-b-2 border-[#C6F135]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      REWARDS
                    </button>
                  </div>
                </div>

                {/* Card XP / Level Header */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      NOVICE SCHOLAR
                    </span>
                    <span className="font-mono text-xs font-bold text-[#C6F135]">
                      + {completedXp} XP TODAY
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                      {totalXp.toLocaleString()} XP
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      / {targetXp.toLocaleString()} XP
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-[#1F1F23] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C6F135] rounded-full transition-all duration-500 shadow-[0_0_10px_#C6F135]"
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
                            ? 'bg-[#161619] border-[#222226]'
                            : 'bg-[#121214] border-[#26262B] hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div
                            className={`w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors ${
                              q.done
                                ? 'bg-[#C6F135] text-black'
                                : 'border border-zinc-600 bg-transparent'
                            }`}
                          >
                            {q.done && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs font-bold truncate ${
                              q.done ? 'text-zinc-200' : 'text-zinc-400'
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
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#C6F135]">
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
                              stroke="#27272A"
                              strokeWidth="1"
                            />
                          );
                        })}
                        <polygon
                          points="100,50 148,85 130,145 70,145 52,85"
                          fill="#C6F135"
                          fillOpacity="0.25"
                          stroke="#C6F135"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400 mt-2 text-center">
                      Core Attributes dynamically tracked in real-time.
                    </p>
                  </div>
                )}

                {showcaseTab === 'rewards' && (
                  <div className="mt-4 sm:mt-5 space-y-2 text-xs">
                    <div className="p-3 bg-[#161619] border border-[#222226] rounded-lg flex items-center justify-between">
                      <span className="font-bold text-white">Streak Freeze Shield</span>
                      <span className="font-mono text-[#F59E0B] font-bold">100 Gold</span>
                    </div>
                    <div className="p-3 bg-[#161619] border border-[#222226] rounded-lg flex items-center justify-between">
                      <span className="font-bold text-white">Guilt-Free Gaming Pass</span>
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
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#C6F135] uppercase">
            HOW METTLE WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-white tracking-tight mt-2">
            DO. EARN. GROW.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-lg mx-auto">
            Complete real-life quests, earn XP, improve your stats, and level up.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 sm:mt-12 text-left">
            {/* Card 01 */}
            <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 font-bold">01</span>
                  <Target className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  CHOOSE A QUEST
                </h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  Pick something you want to accomplish today. Turn it into a quest.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 font-bold">02</span>
                  <Check className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  GET IT DONE
                </h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  Complete the quest in real life and mark it done.
                </p>
              </div>
            </div>

            {/* Card 03 (Highlighted Active Card) */}
            <div className="bg-[#141416] border border-[#C6F135]/50 rounded-xl p-5 sm:p-6 shadow-[0_0_20px_rgba(198,241,53,0.1)] flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C6F135] font-bold">03</span>
                  <div className="w-6 h-6 rounded bg-[#C6F135]/20 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-[#C6F135]" />
                  </div>
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  EARN XP
                </h3>
                <p className="text-zinc-300 text-xs mt-2 leading-relaxed">
                  Earn XP and rewards every time you make progress.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 font-bold">04</span>
                  <TrendingUp className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="font-black text-white text-sm uppercase tracking-wide mt-4 sm:mt-5">
                  GROW &amp; LEVEL UP
                </h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  Use your progress to grow your stats and reach the next level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Section 3: "CORE ATTRIBUTES" */}
        <section id="attributes" className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-left space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#C6F135] uppercase">
              STATS THAT MATTER
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-white tracking-tight">
              GROW IN EVERY PART OF LIFE.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
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
                  className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-lg p-3 sm:p-3.5 flex items-center gap-3 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: attr.dot }}
                  />
                  <span className="font-mono text-xs font-bold text-white tracking-wider shrink-0 w-14 sm:w-16">
                    {attr.title}
                  </span>
                  <span className="text-xs text-zinc-400 min-w-0 flex-1 leading-snug">
                    {attr.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Pentagon Radar Chart Card */}
            <div className="lg:col-span-6 w-full min-w-0">
              <div className="bg-[#111113] border border-[#222226] rounded-xl p-4 sm:p-6 relative">
                {/* Header inside card */}
                <div className="flex items-center justify-between border-b border-[#222226] pb-3 mb-4">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    YOUR PROGRESS
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400 border border-zinc-700/80 px-2 py-0.5 rounded uppercase">
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
                            stroke="#222226"
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
                            stroke="#222226"
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
                              fill="#C6F135"
                              fillOpacity="0.22"
                              stroke="#C6F135"
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
                                  fill="#C6F135"
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
                        fill="#D4D4D8"
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
                        fill="#D4D4D8"
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
                        fill="#D4D4D8"
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
                        fill="#D4D4D8"
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
                        fill="#D4D4D8"
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
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#C6F135] uppercase">
            LEVEL UP
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-white tracking-tight mt-2">
            KEEP GOING. KEEP LEVELING UP.
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-xl mx-auto">
            Earn XP through consistent effort. As you level up, each new milestone takes more progress to reach.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 text-left">
            {/* Card 1 */}
            <div className="bg-[#111113] border border-[#222226] rounded-xl p-4 sm:p-5 hover:border-zinc-700 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">LEVEL 1</span>
                <span className="font-mono text-xs font-bold text-[#C6F135]">100 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[#1F1F23] rounded-full overflow-hidden">
                <div className="h-full bg-[#C6F135] w-full rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                NOVICE
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111113] border border-[#222226] rounded-xl p-4 sm:p-5 hover:border-zinc-700 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">LEVEL 5</span>
                <span className="font-mono text-xs font-bold text-[#C6F135]">800 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[#1F1F23] rounded-full overflow-hidden">
                <div className="h-full bg-[#C6F135] w-full rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                APPRENTICE
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111113] border border-[#222226] rounded-xl p-4 sm:p-5 hover:border-zinc-700 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">LEVEL 10</span>
                <span className="font-mono text-xs font-bold text-[#C6F135]">2,700 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[#1F1F23] rounded-full overflow-hidden">
                <div className="h-full bg-[#C6F135] w-[75%] rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                ADEPT
              </span>
            </div>

            {/* Card 4 */}
            <div className="bg-[#111113] border border-[#222226] rounded-xl p-4 sm:p-5 hover:border-zinc-700 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">LEVEL 20</span>
                <span className="font-mono text-xs font-bold text-[#C6F135]">8,200 XP</span>
              </div>
              <div className="h-1.5 w-full bg-[#1F1F23] rounded-full overflow-hidden">
                <div className="h-full bg-[#C6F135] w-[40%] rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                MASTER
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 italic mt-6 sm:mt-8">
            *Every level is earned through consistent progress.*
          </p>
        </section>

        {/* 6. Section 5: "YOUR EFFORT EARNS REWARDS." */}
        <section id="rewards" className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy & CTA */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase text-white leading-tight tracking-tight">
                YOUR EFFORT <br />
                EARNS REWARDS.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Earn Gold through consistent progress and spend it on rewards that make your journey more satisfying.
              </p>
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={onGetStarted}
                  className="bg-[#C6F135] hover:bg-[#b5e02e] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(198,241,53,0.25)] hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
                >
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right 2x2 Reward Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              {/* Reward 1 */}
              <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-white uppercase tracking-wide">
                  STREAK FREEZE
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Protect your streak when life gets unpredictable.
                </p>
              </div>

              {/* Reward 2 */}
              <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-white uppercase tracking-wide">
                  GUILT-FREE BREAK
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Enjoy your gaming or entertainment downtime.
                </p>
              </div>

              {/* Reward 3 */}
              <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-white uppercase tracking-wide">
                  PROFILE THEME
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Customize your Mettle aesthetic and interface.
                </p>
              </div>

              {/* Reward 4 */}
              <div className="bg-[#111113] border border-[#222226] hover:border-zinc-700 rounded-xl p-4 sm:p-5 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-zinc-300" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-white uppercase tracking-wide">
                  MILESTONE REWARD
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Celebrate reaching long-term personal progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Section 6: Final CTA Banner */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-4 sm:pt-8">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
              YOUR NEXT LEVEL STARTS <br />
              TODAY.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
              Stop waiting for motivation. Start building momentum.
            </p>
            <div className="pt-4 sm:pt-6">
              <button
                onClick={onGetStarted}
                className="bg-[#C6F135] hover:bg-[#b5e02e] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-md inline-flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(198,241,53,0.35)] hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>START YOUR JOURNEY</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-[#1C1C1F] py-8 px-4 sm:px-6 bg-[#09090B]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white tracking-tight">
              Mettle
            </span>
            <span className="text-zinc-600 text-xs ml-2">
              Build yourself. Level by level.
            </span>
          </div>

          <div className="text-zinc-600 text-xs font-mono">
            &copy; 2026 Mettle
          </div>
        </div>
      </footer>
    </div>
  );
}
