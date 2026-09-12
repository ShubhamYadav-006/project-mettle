import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import QuestCard from '../components/QuestCard';
import QuestModal from '../components/QuestModal';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'academics', label: 'Academics' },
  { id: 'coding', label: 'Coding' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'routine', label: 'Routine' },
  { id: 'mindset', label: 'Mindset' },
];

export default function QuestsPage({ onOpenCreateModal, isCreateModalOpen, setIsCreateModalOpen }) {
  const { updateCharacterState } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'active') {
      fetchTasks();
    } else {
      fetchHistory();
    }
  }, [activeTab]);

  const handleComplete = async (taskId) => {
    try {
      const res = await api.post(`/tasks/${taskId}/complete`, {});
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
        );
        const charData = res.data.data.character;
        updateCharacterState(charData, charData.leveledUp);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
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
        setTasks([res.data.data, ...tasks]);
      }
    }
    setSelectedQuest(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 select-none">
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
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Active ({tasks.filter((t) => t.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-[var(--accent)] text-[var(--accent)]'
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
            className="px-3.5 py-1.5 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-semibold text-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        <>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-sm font-sans text-xs font-semibold uppercase tracking-wider transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--accent-border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tasks Small Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-24 rounded-md bg-[var(--bg-surface)] border border-[var(--border)] animate-pulse" />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center rounded-sm mettle-panel border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-xs text-[var(--text-secondary)]">No tasks found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTasks.map((quest) => (
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
        /* Completion History */
        <div className="mettle-panel rounded-md p-6 bg-[var(--bg-surface)] border border-[var(--border)]">
          {loading ? (
            <div className="h-32 rounded-sm bg-[var(--bg-elevated)] animate-pulse" />
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] font-semibold">
              No completed task records found yet.
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block mb-2">
                Completed Task History
              </span>
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-baseline justify-between gap-4 py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-[var(--text-primary)]">
                      {record.task_title}
                    </h4>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {new Date(record.completed_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-display font-bold shrink-0">
                    <span className="text-[var(--xp)]">+{record.xp_earned} XP</span>
                    <span className="text-[var(--gold)]">+{record.gold_earned} Gold</span>
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
