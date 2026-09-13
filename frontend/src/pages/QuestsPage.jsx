import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import { useAuth } from '../context/AuthContext';
import { notify } from '../components/common/ToastContainer';
import { sounds } from '../utils/sound';
import { Plus, Check, Target, Clock, Sparkles, Coins } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'academics', label: 'Academics' },
  { id: 'coding', label: 'Coding' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'routine', label: 'Routine' },
  { id: 'mindset', label: 'Mindset' },
];

export default function QuestsPage({ onOpenCreateModal, isCreateModalOpen, setIsCreateModalOpen }) {
  const { user, updateCharacterState } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      if (res.data.success && Array.isArray(res.data.data)) {
        setTasks(res.data.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      const isAuthErr =
        err?.message?.includes('Access denied') ||
        err?.message?.includes('expired') ||
        err?.message?.includes('token');
      if (user && !isAuthErr) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/tasks/history');
      if (res.data.success && Array.isArray(res.data.data)) {
        setHistory(res.data.data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      const isAuthErr =
        err?.message?.includes('Access denied') ||
        err?.message?.includes('expired') ||
        err?.message?.includes('token');
      if (user && !isAuthErr) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (activeTab === 'active') {
        fetchTasks();
      } else {
        fetchHistory();
      }
    }
  }, [activeTab, user]);

  const handleComplete = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    sounds.playComplete();
    if (target) {
      notify.xp(Number(target.xp_reward) || 30, `Completed "${target.title}"`);
    }

    // Optimistic status update: Immediately shift out of active tasks
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );

    if (target) {
      setHistory((prev) => [
        {
          id: target.id,
          task_title: target.title,
          xp_earned: target.xp_reward || 30,
          gold_earned: target.gold_reward || 10,
          attribute_gained: target.attribute_type || 'intellect',
          completed_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    try {
      const res = await api.post(`/tasks/${taskId}/complete`, {});
      if (res.data.success) {
        const charData = res.data.data.character;
        updateCharacterState(charData, charData.leveledUp);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
      fetchTasks();
    }
  };

  const handleDelete = async (taskId) => {
    sounds.playClick();
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalSubmit = async (formData) => {
    if (selectedQuest) {
      const res = await api.put(`/tasks/${selectedQuest.id}`, formData);
      if (res.data.success) {
        setTasks((prev) => prev.map((t) => (t.id === selectedQuest.id ? res.data.data : t)));
      }
    } else {
      const res = await api.post('/tasks', formData);
      if (res.data.success) {
        setTasks((prev) => [res.data.data, ...prev]);
      }
    }
    setSelectedQuest(null);
  };

  // Strictly filter for active (pending) quests in the active view
  const activeTasks = tasks.filter((t) => t.status === 'pending');
  const filteredActiveTasks = activeTasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn max-w-[1000px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-wide">
            TASKS
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Create, organize, and complete your daily tasks.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-xs font-sans font-semibold">
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'active'
                  ? 'border-[var(--accent)] text-[var(--accent)] font-bold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Active ({activeTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'border-[var(--accent)] text-[var(--accent)] font-bold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Completed Tasks
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedQuest(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-black uppercase tracking-wider text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[var(--accent)]/20"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        <>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                  categoryFilter === cat.id
                    ? 'bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--accent-border)] shadow-xs font-bold scale-102'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tasks Cards Grid (Active pending only) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-28 rounded-xl skeleton-shimmer border border-[var(--border)]" />
              ))}
            </div>
          ) : filteredActiveTasks.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] space-y-3 animate-fadeIn">
              <div className="h-12 w-12 mx-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-xs animate-pulse">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  {categoryFilter === 'all'
                    ? 'All active tasks completed! 🎉'
                    : `No active tasks found in "${categoryFilter}".`}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
                  Create new quests to continue building your character progress.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedQuest(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[var(--accent)]/20 active:scale-95"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Create New Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
              {filteredActiveTasks.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={handleComplete}
                  onEdit={(q) => {
                    setSelectedQuest(q);
                    setIsCreateModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Completed Tasks History View */
        <div className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Check className="h-4 w-4 text-[var(--accent)] stroke-[3]" />
              Completed Task Log ({history.length})
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              All Time Records
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 rounded-xl skeleton-shimmer border border-[var(--border)]" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] font-semibold space-y-2">
              <Clock className="h-8 w-8 mx-auto text-[var(--text-muted)] stroke-[1.5]" />
              <p>No completed task records found yet.</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Complete quests from the active tab to see your log here.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((record) => (
                <div
                  key={record.id || `hist-${record.completed_at}-${record.task_title}`}
                  className="mettle-card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-sans text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate">
                        {record.task_title}
                      </h4>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        Completed on {new Date(record.completed_at).toLocaleDateString()} at {new Date(record.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold shrink-0 self-end sm:self-auto">
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      +{record.xp_earned || 30} XP
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      +{record.gold_earned || 10} G
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quest Creator Modal */}
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
