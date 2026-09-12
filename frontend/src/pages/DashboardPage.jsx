import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import QuestModal from '../components/QuestModal';
import LevelUpModal from '../components/LevelUpModal';
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
  Award,
} from 'lucide-react';

export default function DashboardPage({
  setActiveTab,
  onOpenCreateModal,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) {
  const { user, character, updateCharacterState, levelUpData, setLevelUpData } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Fetch pending and today's completed tasks
  const fetchData = async () => {
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
      console.error('Failed to load dashboard data:', err);
      setError(err?.message || 'Failed to load progress.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      xp_earned: Number(targetQuest.xp_reward) || 0,
      gold_earned: Number(targetQuest.gold_reward) || 0,
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
      if (res.data.success) {
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
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedQuest.id ? res.data.data : t))
        );
      }
    } else {
      const res = await api.post('/tasks', formData);
      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
      }
    }
    setSelectedQuest(null);
    setIsCreateModalOpen(false);
  };

  // RPG Progression Math
  const totalXp = Number(character?.totalXp ?? character?.total_xp ?? 0);
  const levelProgress = getLevelProgress(totalXp);
  const currentLevel = character?.level ?? levelProgress.currentLevel;
  const currentLevelXp = levelProgress.currentLevelXp;
  const nextLevelXp = levelProgress.nextLevelXp;
  const xpPercentage = levelProgress.progressPercentage;

  // Task / Daily Completion Calculations
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

  // Formatted Live Date e.g. "Thursday, September 12"
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

  // Normalizing scores to display values (between 40 and 95 based on character level & stats)
  const characterAttributes = [
    {
      id: 'mind',
      name: 'MIND',
      score: Math.min(99, intellectScore * 4 + 22),
      color: 'var(--attr-mind)',
    },
    {
      id: 'will',
      name: 'WILL',
      score: Math.min(99, disciplineScore * 4 + 14),
      color: 'var(--attr-will)',
    },
    {
      id: 'body',
      name: 'BODY',
      score: Math.min(99, strengthScore * 4 + 19),
      color: 'var(--attr-body)',
    },
    {
      id: 'craft',
      name: 'CRAFT',
      score: Math.min(99, creativityScore * 4 + 26),
      color: 'var(--attr-craft)',
    },
    {
      id: 'habit',
      name: 'HABIT',
      score: Math.min(99, consistencyScore * 4 + 20),
      color: 'var(--attr-habit)',
    },
  ];

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
    <div className="max-w-[760px] mx-auto space-y-4 animate-fadeIn pb-10">
      {/* 1. TOP HEADER */}
      <div className="space-y-0.5 pt-1 pb-1">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] block">
          TODAY
        </span>
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {formattedDate}
        </h1>
        <p className="font-sans text-xs text-[var(--text-secondary)]">
          Turn today's effort into progress.
        </p>
      </div>

      {/* ERROR NOTICE IF ANY */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-sans">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. CARD 1: LEVEL & TODAY'S PROGRESS (Dual Progress Overview Card) */}
      <div className="mettle-card rounded-md p-4 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Level Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase">
                LEVEL {currentLevel}
              </span>
              <span className="font-mono text-[11px] font-semibold text-[var(--accent)]">
                {Number(currentLevelXp).toLocaleString()} / {Number(nextLevelXp).toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
                style={{ width: `${Math.max(4, Math.min(100, xpPercentage))}%` }}
              />
            </div>
          </div>

          {/* Today's Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sans text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase">
                TODAY'S PROGRESS
              </span>
              <span className="font-mono text-[11px] font-semibold text-[var(--text-secondary)]">
                {completedCount} / {totalQuestsToday} Quests
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
                style={{ width: `${Math.max(completedCount > 0 ? 5 : 0, Math.min(100, completionPercentage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD 2: TODAY'S QUESTS (Small Cards Grid) */}
      <div className="mettle-card rounded-md p-4 sm:p-5 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] space-y-3 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            TODAY'S QUESTS
          </span>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-xs bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)]">
            {pendingCount} Pending
          </span>
        </div>

        {/* Small Quests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Active Pending Tasks as Small Cards */}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex flex-col justify-between p-2.5 sm:p-3 rounded-md bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--accent)] transition-all gap-2"
            >
              {/* Top: Circle Tick + Title + Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="mt-0.5 h-4 w-4 rounded-full border border-[var(--border-strong)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    title="Mark as Complete"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[var(--accent)] text-[8px]">
                      ✓
                    </span>
                  </button>
                  <span className="font-sans text-xs font-semibold text-[var(--text-primary)] leading-tight line-clamp-2">
                    {task.title}
                  </span>
                </div>

                {/* Edit / Delete Icons on Hover */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mr-1">
                  <button
                    onClick={() => {
                      setSelectedQuest(task);
                      setIsCreateModalOpen(true);
                    }}
                    className="p-1 rounded-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                    title="Edit Quest"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 rounded-xs text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors cursor-pointer"
                    title="Delete Quest"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Bottom: Attribute tag + XP Reward */}
              <div className="flex items-center justify-between text-[10px] font-mono border-t border-[var(--border)] pt-1.5 mt-0.5">
                <span className="capitalize text-[var(--text-muted)] font-sans font-medium text-[10px]">
                  {task.attribute_type || 'Mind'}
                </span>
                <span className="font-mono text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded-xs border border-[var(--accent-border)]">
                  +{task.xp_reward || 30} XP
                </span>
              </div>
            </div>
          ))}

          {/* Today's Completed Tasks as Small Cards */}
          {completedToday.map((done) => (
            <div
              key={`done-${done.id}`}
              className="flex flex-col justify-between p-2.5 sm:p-3 rounded-md bg-[var(--bg-primary)]/50 border border-[var(--border)] opacity-60 gap-2"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 rounded-full bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span className="font-sans text-xs text-[var(--text-muted)] line-through leading-tight line-clamp-2">
                  {done.task_title || done.title}
                </span>
              </div>
              <div className="flex items-center justify-end text-[10px] font-mono border-t border-[var(--border)] pt-1.5 mt-0.5">
                <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)]">
                  +{done.xp_earned || done.xp_reward || 30} XP
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when no quests exist */}
        {tasks.length === 0 && completedToday.length === 0 && (
          <div className="py-6 text-center text-xs text-[var(--text-muted)] font-sans">
            No quests scheduled for today. Click below to add your first quest.
          </div>
        )}

        {/* Add Quest Button */}
        <button
          onClick={() => {
            setSelectedQuest(null);
            setIsCreateModalOpen(true);
          }}
          className="w-full py-2 rounded-sm border border-dashed border-[var(--border-strong)] hover:border-[var(--accent)] bg-[var(--bg-primary)] hover:bg-[var(--accent-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
        >
          <Plus className="h-3.5 w-3.5 text-[var(--accent)] stroke-[2.5]" />
          <span>+ Add Quest</span>
        </button>
      </div>

      {/* 4. CARD 3: DAILY PROGRESS */}
      <div className="mettle-card rounded-md p-4 sm:p-5 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] space-y-3 shadow-2xs">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] block border-b border-[var(--border)] pb-2.5">
          DAILY PROGRESS
        </span>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-xl sm:text-2xl font-black text-[var(--accent)] tracking-tight">
              {completionPercentage}% complete
            </span>
            <span className="font-sans text-xs font-medium text-[var(--text-secondary)]">
              {completedCount} of {totalQuestsToday} quests completed
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)]">
              <span className="font-mono text-xs font-bold text-[var(--accent)]">
                +{earnedXpToday} XP
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)]">
              <span className="font-mono text-xs font-bold text-[var(--gold)]">
                +{earnedGoldToday} Gold
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CARD 4: YOUR CHARACTER (Compact Attributes) */}
      <div className="mettle-card rounded-md p-4 sm:p-5 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            YOUR CHARACTER
          </span>
          <button
            onClick={() => setActiveTab('character')}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline cursor-pointer"
          >
            View Full Stats →
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {characterAttributes.map((attr) => (
            <div key={attr.id} className="flex items-center gap-3 text-xs">
              <span className="w-14 font-mono text-[11px] font-bold text-[var(--text-secondary)] uppercase shrink-0">
                {attr.name}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${attr.score}%`,
                    backgroundColor: attr.color,
                  }}
                />
              </div>
              <span className="w-7 text-right font-mono text-xs font-bold text-[var(--text-primary)] shrink-0">
                {attr.score}
              </span>
            </div>
          ))}
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

      {/* Level Up Confetti Modal */}
      <LevelUpModal data={levelUpData} onClose={() => setLevelUpData(null)} />
    </div>
  );
}
