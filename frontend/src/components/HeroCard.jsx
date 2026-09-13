import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLevelProgress } from '../utils/levelMath';
import AnimatedNumber from './common/AnimatedNumber';
import { ArrowDown, Plus, Sparkles, AlertCircle, RefreshCw, Flame, Coins, CheckCircle2 } from 'lucide-react';

export default function HeroCard({
  tasks = [],
  completedToday = [],
  loading = false,
  error = null,
  onRetry,
  onOpenCreateModal,
  onViewTasks,
}) {
  const { user, character } = useAuth();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimated(true);
      return;
    }
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 1. Time-of-day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // 2. Loading State: Skeleton Shimmer
  if (loading) {
    return (
      <div className="mettle-panel rounded-xl p-5 sm:p-7 bg-[var(--bg-surface)] border border-[var(--border)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2.5">
            <div className="h-4 w-32 skeleton-shimmer rounded-md" />
            <div className="h-7 w-56 sm:w-72 skeleton-shimmer rounded-md" />
            <div className="h-4 w-64 sm:w-80 skeleton-shimmer rounded-md" />
          </div>
          <div className="h-9 w-32 skeleton-shimmer rounded-md shrink-0" />
        </div>

        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 skeleton-shimmer rounded-md" />
            <div className="h-4 w-36 skeleton-shimmer rounded-md" />
          </div>
          <div className="h-2.5 w-full skeleton-shimmer rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="h-16 skeleton-shimmer rounded-xl" />
          <div className="h-16 skeleton-shimmer rounded-xl" />
          <div className="h-16 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    );
  }

  // 3. Error State: Graceful error fallback
  if (error) {
    return (
      <div className="mettle-panel rounded-xl p-6 bg-[var(--bg-surface)] border border-[var(--border)] text-center space-y-3">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)]">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
          Unable to load your progress.
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
          We encountered a connection issue while fetching your latest stats.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] border border-[var(--border-strong)] text-xs font-sans font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Dynamic Data Calculation from Real Authenticated User State
  const totalXp = Number(character?.totalXp ?? character?.total_xp ?? 0);
  const streak = Number(character?.streaks?.currentStreak ?? character?.streaks?.current_streak ?? 0);
  
  // Progression Math from Formula
  const { currentLevel, nextLevelBaseXp, xpRemaining, progressPercent } = getLevelProgress(totalXp);
  const level = character?.level || currentLevel;

  // Task & Activity Metrics for Today
  const totalTodayCount = tasks.length + completedToday.length;
  const completedTodayCount = completedToday.length;
  const todayXp = completedToday.reduce((acc, curr) => acc + (Number(curr.xp_earned) || 0), 0);
  const todayGold = completedToday.reduce((acc, curr) => acc + (Number(curr.gold_earned) || 0), 0);

  const userName = user?.name || 'Member';
  const greeting = getGreeting();

  const handleScrollToTasks = () => {
    if (onViewTasks) {
      onViewTasks();
    } else {
      const el = document.getElementById('todays-quests-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="mettle-panel card-ambient-glow rounded-2xl p-5 sm:p-7 bg-[var(--bg-surface)] border border-[var(--border)] shadow-md space-y-6 relative overflow-hidden">
      {/* Eyebrow + Header + Message */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative z-10">
        <div className="space-y-1.5 max-w-2xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded-md border border-[var(--accent-border)]">
            <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
            <span>CHARACTER PROGRESSION</span>
          </div>

          {/* User Greeting */}
          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            {greeting}, <span className="text-[var(--text-primary)]">{userName}</span>
          </h2>

          {/* Product Purpose Message */}
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Turn your daily quests into measurable progress. Build consistency and level up every day.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="px-4.5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-[var(--accent)]/20 hover:shadow-lg hover:shadow-[var(--accent)]/30 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Quest</span>
          </button>
        </div>
      </div>

      {/* Level & XP Progression Bar */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)] relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-black uppercase text-[var(--text-primary)] tracking-wider">
              Level <AnimatedNumber value={level} />
            </span>
            <span className="text-[var(--border-strong)]">•</span>
            <span className="font-sans text-xs font-semibold text-[var(--text-secondary)]">
              <AnimatedNumber value={totalXp} /> XP <span className="text-[var(--text-muted)]">/ {nextLevelBaseXp.toLocaleString()} XP</span>
            </span>
          </div>

          <span className="text-[11px] font-medium text-[var(--text-muted)] font-mono">
            {xpRemaining > 0 ? `${xpRemaining.toLocaleString()} XP to Level ${level + 1}` : 'Max Tier'} (<AnimatedNumber value={progressPercent} />%)
          </span>
        </div>

        {/* Animated XP Bar */}
        <div className="w-full h-3 rounded-full bg-[var(--bg-elevated)] overflow-hidden border border-[var(--border)] p-0.5">
          <div
            className="h-full rounded-full xp-bar-glitter transition-all duration-700 ease-out"
            style={{ width: animated ? `${Math.min(100, Math.max(2, progressPercent))}%` : '0%' }}
          />
        </div>
      </div>

      {/* Dynamic Real Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 relative z-10">
        {/* Metric 1: Today's Progress */}
        <div className="mettle-card-interactive p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Today's Progress
          </span>
          <div className="mt-1.5">
            {totalTodayCount > 0 ? (
              <span className="font-display text-base font-black text-[var(--text-primary)]">
                <AnimatedNumber value={completedTodayCount} /> of {totalTodayCount} quests completed
              </span>
            ) : (
              <span className="font-sans text-xs font-semibold text-[var(--text-muted)]">
                No active quests yet
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Today's Earned XP & Gold */}
        <div className="mettle-card-interactive p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Earned Today
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-base font-black text-[var(--accent)]">
              +<AnimatedNumber value={todayXp} /> XP
            </span>
            {todayGold > 0 && (
              <span className="font-display text-xs font-bold text-[var(--gold)]">
                +<AnimatedNumber value={todayGold} /> G
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Consistency Streak */}
        <div className="mettle-card-interactive p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
            Consistency Streak
          </span>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Flame className={`h-4 w-4 ${streak > 0 ? 'text-amber-500 fill-amber-500/20 animate-flame' : 'text-[var(--text-muted)]'}`} />
            {streak > 0 ? (
              <span className="font-display text-base font-black text-[var(--text-primary)]">
                <AnimatedNumber value={streak} /> day{streak === 1 ? '' : 's'}
              </span>
            ) : (
              <span className="font-sans text-xs font-semibold text-[var(--text-muted)]">
                Start your streak today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] relative z-10">
        {totalTodayCount > 0 ? (
          <button
            onClick={handleScrollToTasks}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors cursor-pointer group"
          >
            <span>View Today's Quests</span>
            <ArrowDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[var(--accent)] hover:underline transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Your First Quest</span>
          </button>
        )}

        <span className="text-[11px] text-[var(--text-muted)] font-medium font-mono">
          {completedTodayCount > 0
            ? `${Math.round((completedTodayCount / totalTodayCount) * 100)}% daily completion`
            : '0% completed today'}
        </span>
      </div>
    </div>
  );
}
