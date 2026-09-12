import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import QuestModal from '../components/QuestModal';
import { getLevelProgress } from '../utils/levelMath';
import { sounds } from '../utils/sound';
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  Sparkles,
  Flame,
  Coins,
  Shield,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage({
  setActiveTab,
  onOpenCreateModal,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) {
  const { user, character, updateCharacterState } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [filterView, setFilterView] = useState('all'); // 'all' | 'pending' | 'completed'

  // Fetch pending and today's completed tasks
  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [tasksRes, historyRes] = await Promise.all([
        api.get('/tasks?status=pending'),
        api.get('/tasks/history'),
      ]);

      if (tasksRes?.data?.success && Array.isArray(tasksRes.data.data)) {
        setTasks(tasksRes.data.data);
      } else {
        setTasks([]);
      }

      if (historyRes?.data?.success && Array.isArray(historyRes.data.data)) {
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        const todayDone = historyRes.data.data.filter((h) => {
          if (!h || !h.completed_at) return false;
          const d = new Date(h.completed_at);
          return (
            d.getFullYear() === todayYear &&
            d.getMonth() === todayMonth &&
            d.getDate() === todayDate
          );
        });
        setCompletedToday(todayDone);
      } else {
        setCompletedToday([]);
      }
    } catch (err) {
      const isAuthErr =
        err?.message?.includes('Access denied') ||
        err?.message?.includes('expired') ||
        err?.message?.includes('token');
      if (user && !isAuthErr) {
        console.error('Failed to load dashboard data:', err);
      }
      if (!isAuthErr) {
        setError(err?.message || 'Failed to load progress.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Complete Quest with immediate sound & optimistic update
  const handleComplete = async (taskId) => {
    const targetQuest = tasks.find((t) => String(t.id) === String(taskId));
    if (!targetQuest) return;

    sounds.playComplete();

    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => String(t.id) !== String(taskId)));

    const newCompletedItem = {
      id: targetQuest.id,
      task_title: targetQuest.title,
      xp_earned: Number(targetQuest.xp_reward) || 30,
      gold_earned: Number(targetQuest.gold_reward) || 10,
      attribute_gained: targetQuest.attribute_type || 'intellect',
      attribute_points: 1,
      completed_at: new Date().toISOString(),
    };

    setCompletedToday((prev) => [
      newCompletedItem,
      ...prev.filter((p) => String(p.id) !== String(taskId)),
    ]);

    try {
      const res = await api.post(`/tasks/${taskId}/complete`, {});
      if (res.data?.success) {
        const charData = res.data.data.character;
        updateCharacterState(charData, charData.leveledUp);
      }
    } catch (err) {
      console.error('Quest completion failed', err);
      fetchData();
    }
  };

  // Delete Quest
  const handleDelete = async (taskId) => {
    sounds.playClick();
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => String(t.id) !== String(taskId)));
    } catch (err) {
      console.error(err);
    }
  };

  // Create or Edit Quest Submission from Modal
  const handleModalSubmit = async (formData) => {
    if (selectedQuest) {
      const res = await api.put(`/tasks/${selectedQuest.id}`, formData);
      if (res.data?.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedQuest.id ? res.data.data : t))
        );
      }
    } else {
      const res = await api.post('/tasks', formData);
      if (res.data?.success) {
        setTasks((prev) => [res.data.data, ...prev]);
      }
    }
    setSelectedQuest(null);
    setIsCreateModalOpen(false);
  };

  // Progression Math
  const totalXp = Number(character?.totalXp ?? character?.total_xp ?? 0);
  const levelProgress = getLevelProgress(totalXp);
  const currentLevel = character?.level ?? levelProgress.currentLevel;
  const currentLevelBaseXp = levelProgress.currentLevelBaseXp;
  const nextLevelBaseXp = levelProgress.nextLevelBaseXp;
  const xpInTier = levelProgress.xpInCurrentTier;
  const xpRequiredForTier = levelProgress.xpRequiredForNextLevel;
  const xpRemaining = levelProgress.xpRemaining;
  const xpPercentage = levelProgress.progressPercent;
  const streak = character?.streaks?.currentStreak ?? character?.streaks?.current_streak ?? 0;
  const currentGold = character?.gold ?? 0;
  const characterTitle = character?.title || 'Ascendant';

  // Completion Metrics
  const completedCount = completedToday.length;
  const pendingCount = tasks.length;
  const totalQuestsToday = completedCount + pendingCount;
  const completionPercentage =
    totalQuestsToday > 0 ? Math.round((completedCount / totalQuestsToday) * 100) : 0;

  const earnedXpToday = completedToday.reduce(
    (acc, curr) => acc + (Number(curr.xp_earned) || 0),
    0
  );
  const earnedGoldToday = completedToday.reduce(
    (acc, curr) => acc + (Number(curr.gold_earned) || 0),
    0
  );

  // Formatted Live Date e.g. "Friday, September 12"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Character Attributes Scaling
  const attrs = character?.attributes || {};
  const intellectScore = Number(attrs.intellect || 10);
  const disciplineScore = Number(attrs.discipline || 10);
  const strengthScore = Number(attrs.strength || 10);
  const creativityScore = Number(attrs.creativity || 10);
  const consistencyScore = Number(attrs.consistency || 10);

  const characterAttributes = [
    {
      id: 'intellect',
      name: 'Intellect',
      category: 'Mind & Academics',
      points: intellectScore,
      color: 'var(--attr-mind, #5B8DEF)',
      badge: 'INT',
    },
    {
      id: 'discipline',
      name: 'Discipline',
      category: 'Will & Routines',
      points: disciplineScore,
      color: 'var(--attr-will, #B5E34A)',
      badge: 'DIS',
    },
    {
      id: 'strength',
      name: 'Strength',
      category: 'Body & Fitness',
      points: strengthScore,
      color: 'var(--attr-body, #3FA56F)',
      badge: 'STR',
    },
    {
      id: 'creativity',
      name: 'Creativity',
      category: 'Craft & Projects',
      points: creativityScore,
      color: 'var(--attr-craft, #9B7AC7)',
      badge: 'CRT',
    },
    {
      id: 'consistency',
      name: 'Consistency',
      category: 'Habits & Streaks',
      points: consistencyScore,
      color: 'var(--attr-habit, #C99628)',
      badge: 'CON',
    },
  ];

  const getAttributeMeta = (type) => {
    const key = (type || 'intellect').toLowerCase();
    return (
      characterAttributes.find((a) => a.id === key) || {
        name: 'Mind',
        color: 'var(--attr-mind, #5B8DEF)',
        badge: 'GEN',
      }
    );
  };

  if (loading && tasks.length === 0 && completedToday.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] gap-3">
        <Loader2 className="h-7 w-7 text-[var(--accent)] animate-spin" />
        <span className="font-sans text-xs uppercase tracking-wider font-semibold">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto space-y-5 animate-fadeIn pb-12">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Daily Operations
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              • {streak} Day Streak
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            {formattedDate}
          </h1>
          <p className="font-sans text-xs text-[var(--text-secondary)] mt-0.5">
            Turn daily action into measurable character progress.
          </p>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => {
            setSelectedQuest(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Quest</span>
        </button>
      </div>

      {/* ERROR NOTICE IF ANY */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-sans">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. CARD 1: COMMAND HUD — LEVEL PROGRESS & DAILY YIELD */}
      <div className="mettle-card rounded-md p-5 sm:p-6 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs relative overflow-hidden">
        {/* Subtle Ambient Backlight */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Left Column: Character Tier & XP Progress (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-sm bg-[var(--bg-primary)] border border-[var(--border-strong)] flex items-center justify-center font-display font-black text-sm text-[var(--accent)] shadow-2xs">
                    L{currentLevel}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)]">
                        LEVEL {currentLevel}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
                        {characterTitle}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                      {Number(totalXp).toLocaleString()} Cumulative XP
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {xpPercentage}%
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                    to Lvl {currentLevel + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* High Precision XP Gauge */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2.5 w-full rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border)] p-[1px]">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(4, Math.min(100, xpPercentage))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span>Tier: {Number(xpInTier).toLocaleString()} / {Number(xpRequiredForTier).toLocaleString()} XP</span>
                <span>{Number(xpRemaining).toLocaleString()} XP Needed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Daily Yield & Momentum Matrix (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 lg:border-l lg:border-[var(--border)] lg:pl-6">
            {/* 1. Daily Quests Progress */}
            <div className="p-3 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <span>Quests</span>
                <Target className="h-3 w-3 text-[var(--accent)]" />
              </div>
              <div className="mt-2">
                <span className="font-display text-lg font-bold text-[var(--text-primary)]">
                  {completedCount}/{totalQuestsToday}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] block">
                  {completionPercentage}% Complete
                </span>
              </div>
            </div>

            {/* 2. Consistency Streak */}
            <div className="p-3 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <span>Streak</span>
                <Flame className={`h-3 w-3 ${streak > 0 ? 'text-amber-500' : 'text-[var(--text-muted)]'}`} />
              </div>
              <div className="mt-2">
                <span className="font-display text-lg font-bold text-[var(--text-primary)]">
                  {streak} {streak === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-[10px] font-mono text-[var(--accent)] block">
                  Consistent
                </span>
              </div>
            </div>

            {/* 3. XP Harvested Today */}
            <div className="p-3 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <span>Earned XP</span>
                <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              </div>
              <div className="mt-2">
                <span className="font-mono text-base sm:text-lg font-bold text-[var(--accent)]">
                  +{earnedXpToday}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  XP Today
                </span>
              </div>
            </div>

            {/* 4. Gold Earned Today */}
            <div className="p-3 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <span>Gold Yield</span>
                <Coins className="h-3 w-3 text-[var(--gold)]" />
              </div>
              <div className="mt-2">
                <span className="font-mono text-base sm:text-lg font-bold text-[var(--gold)]">
                  +{earnedGoldToday}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  Treasury
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD 2: TODAY'S QUESTS — TACTICAL MISSIONS */}
      <div className="mettle-card rounded-md p-5 sm:p-6 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] space-y-4 shadow-xs">
        {/* Card Top Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
              TODAY'S QUESTS
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-xs bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-[10px] font-bold text-[var(--accent)]">
                {pendingCount} Active
              </span>
              {completedCount > 0 && (
                <span className="px-2 py-0.5 rounded-xs bg-[var(--bg-primary)] border border-[var(--border)] font-mono text-[10px] font-bold text-[var(--text-muted)]">
                  {completedCount} Done
                </span>
              )}
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)]">
            <button
              onClick={() => setFilterView('all')}
              className={`px-2.5 py-1 rounded-xs font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterView === 'all'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({totalQuestsToday})
            </button>
            <button
              onClick={() => setFilterView('pending')}
              className={`px-2.5 py-1 rounded-xs font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterView === 'pending'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterView('completed')}
              className={`px-2.5 py-1 rounded-xs font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterView === 'completed'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Quests List Container */}
        <div className="space-y-2.5">
          {/* Active Pending Tasks */}
          {(filterView === 'all' || filterView === 'pending') &&
            tasks.map((task) => {
              const meta = getAttributeMeta(task.attribute_type);
              return (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-sm bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--accent)] transition-all gap-3 shadow-2xs"
                >
                  {/* Left: Custom Tactile Checkbox + Details */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="h-5 w-5 rounded-full border-2 border-[var(--border-strong)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] flex items-center justify-center shrink-0 transition-all cursor-pointer group-hover:scale-105"
                      title="Mark Complete & Claim XP"
                      aria-label="Complete Quest"
                    >
                      <Check className="h-3 w-3 text-[var(--accent)] opacity-0 group-hover:opacity-80 transition-opacity stroke-[3]" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug">
                          {task.title}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs text-[9px] font-mono font-bold uppercase tracking-wider border"
                          style={{
                            borderColor: `${meta.color}40`,
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: meta.color }}
                          />
                          <span>{meta.name}</span>
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-[var(--text-secondary)] truncate font-sans mt-0.5 max-w-lg">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Rewards & Actions */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* XP & Gold Chips */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded-xs bg-[var(--accent-soft)] border border-[var(--accent-border)] font-bold text-[var(--accent)]">
                        +{task.xp_reward || 30} XP
                      </span>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-xs bg-[var(--gold)]/10 border border-[var(--gold)]/30 font-bold text-[var(--gold)]">
                        +{task.gold_reward || 10} G
                      </span>
                    </div>

                    {/* Action Buttons (Edit / Delete) */}
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedQuest(task);
                          setIsCreateModalOpen(true);
                        }}
                        className="p-1.5 rounded-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                        title="Edit Quest"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 rounded-xs text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors cursor-pointer"
                        title="Delete Quest"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Completed Quests List */}
          {(filterView === 'all' || filterView === 'completed') &&
            completedToday.map((done) => (
              <div
                key={`done-${done.id}`}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-sm bg-[var(--bg-primary)]/40 border border-[var(--border)] opacity-60 gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-5 w-5 rounded-full bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-xs sm:text-sm text-[var(--text-muted)] line-through">
                      {done.task_title || done.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                  <span className="text-[var(--accent)] font-semibold">
                    +{done.xp_earned || 30} XP Claimed
                  </span>
                </div>
              </div>
            ))}

          {/* Empty State */}
          {tasks.length === 0 && completedToday.length === 0 && (
            <div className="p-8 text-center rounded-sm bg-[var(--bg-primary)] border border-dashed border-[var(--border-strong)] space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                <Target className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-sm font-bold text-[var(--text-primary)]">
                  No Quests Scheduled for Today
                </p>
                <p className="font-sans text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  Create a task to build your attributes, earn XP, and level up your character.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedQuest(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Create First Quest</span>
              </button>
            </div>
          )}
        </div>

        {/* Add Quest Bottom Prompt */}
        {(tasks.length > 0 || completedToday.length > 0) && (
          <button
            onClick={() => {
              setSelectedQuest(null);
              setIsCreateModalOpen(true);
            }}
            className="w-full py-2.5 rounded-sm border border-dashed border-[var(--border-strong)] hover:border-[var(--accent)] bg-[var(--bg-primary)] hover:bg-[var(--accent-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer pt-2 mt-1"
          >
            <Plus className="h-3.5 w-3.5 text-[var(--accent)] stroke-[2.5]" />
            <span>Add Another Quest</span>
          </button>
        )}
      </div>

      {/* 4. CARD 3: ATTRIBUTE MASTERY MATRIX */}
      <div className="mettle-card rounded-md p-5 sm:p-6 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
              ATTRIBUTE MASTERY
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)] font-sans mt-0.5">
              Attributes scale as you complete related real-world quests.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('character')}
            className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer group"
          >
            <span>Character Sheet</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {characterAttributes.map((attr) => {
            const maxTier = 50;
            const progressRatio = Math.min(100, Math.max(12, (attr.points / maxTier) * 100));
            return (
              <div
                key={attr.id}
                className="p-3.5 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: attr.color,
                        boxShadow: `0 0 6px ${attr.color}40`,
                      }}
                    />
                    <div>
                      <span className="font-sans text-xs font-bold text-[var(--text-primary)] block">
                        {attr.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-sans">
                        {attr.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] px-2 py-0.5 rounded-xs bg-[var(--bg-elevated)] border border-[var(--border)]">
                    {attr.points} <span className="text-[9px] text-[var(--text-muted)]">pts</span>
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progressRatio}%`,
                        backgroundColor: attr.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quest Modal for Creating / Editing */}
      <QuestModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedQuest(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={selectedQuest}
      />
    </div>
  );
}
