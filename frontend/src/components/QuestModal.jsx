import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DIFFICULTIES = [
  { id: 'trivial', name: 'Trivial', xp: 15, gold: 5 },
  { id: 'easy', name: 'Easy', xp: 30, gold: 10 },
  { id: 'medium', name: 'Medium', xp: 60, gold: 20 },
  { id: 'hard', name: 'Hard', xp: 120, gold: 45 },
  { id: 'epic', name: 'Epic', xp: 250, gold: 100 },
];

const ATTRIBUTES = [
  { id: 'intellect', name: 'Mind', color: 'var(--attr-mind)' },
  { id: 'discipline', name: 'Will', color: 'var(--attr-will)' },
  { id: 'strength', name: 'Body', color: 'var(--attr-body)' },
  { id: 'creativity', name: 'Craft', color: 'var(--attr-craft)' },
  { id: 'consistency', name: 'Habit', color: 'var(--attr-habit)' },
];

export default function QuestModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'academics');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'medium');
  const [attributeType, setAttributeType] = useState(initialData?.attribute_type || 'intellect');
  const [dueDate, setDueDate] = useState(initialData?.due_date ? initialData.due_date.split('T')[0] : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'academics');
      setDifficulty(initialData.difficulty || 'medium');
      setAttributeType(initialData.attribute_type || 'intellect');
      setDueDate(initialData.due_date ? initialData.due_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('academics');
      setDifficulty('medium');
      setAttributeType('intellect');
      setDueDate('');
    }
    setError('');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, initialData, onClose]);

  if (!isOpen) return null;

  const currentDiff = DIFFICULTIES.find((d) => d.id === difficulty) || DIFFICULTIES[2];
  const currentAttr = ATTRIBUTES.find((a) => a.id === attributeType) || ATTRIBUTES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        attributeType,
        dueDate: dueDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl mettle-panel p-5 sm:p-7 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] transition-all cursor-pointer active:scale-90"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="mb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent)] font-sans">
            Task Configuration
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)] mt-0.5">
            {initialData ? 'Edit Task' : 'Create New Quest'}
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold font-sans animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {/* Task Title */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-sans">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Study Operating Systems chapter for 45 mins"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-sans"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-sans">
              Description / Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Key subgoals or focus parameters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none font-sans"
            />
          </div>

          {/* Category & Attribute Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-sans">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-sans cursor-pointer"
              >
                <option value="academics">Academics</option>
                <option value="coding">Coding & Projects</option>
                <option value="fitness">Fitness & Health</option>
                <option value="routine">Habits & Routine</option>
                <option value="mindset">Mindset & Reading</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-sans">
                Attribute Area
              </label>
              <select
                value={attributeType}
                onChange={(e) => setAttributeType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-sans cursor-pointer"
              >
                {ATTRIBUTES.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty Tier */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-sans">
              Priority / Effort Tier
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-sans font-semibold border transition-all text-center cursor-pointer active:scale-95 ${
                    difficulty === d.id
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent)] border-[var(--accent)] shadow-sm shadow-[var(--accent)]/15 scale-102 font-bold'
                      : 'border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rewards Preview */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-between text-xs">
            <span className="text-[11px] uppercase font-bold text-[var(--text-muted)] font-sans">
              Bounty:
            </span>
            <div className="flex items-center gap-3 font-display font-bold text-xs">
              <span className="text-[var(--xp)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-md border border-[var(--accent-border)]">
                +{currentDiff.xp} XP
              </span>
              <span className="text-[var(--gold)] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                +{currentDiff.gold} Gold
              </span>
              <span style={{ color: currentAttr.color }} className="font-semibold">
                +1 {currentAttr.name}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-sans font-semibold transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md shadow-[var(--accent)]/20 disabled:opacity-40 cursor-pointer"
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
