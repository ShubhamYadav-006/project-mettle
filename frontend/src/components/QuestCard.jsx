import React, { useState } from 'react';
import { Check, Trash2, Edit2 } from 'lucide-react';
import { sounds } from '../utils/sound';
import XpFloatingBadge from './common/XpFloatingBadge';

const ATTRIBUTE_LABELS = {
  intellect: { name: 'Mind', color: 'var(--attr-mind, #5B8DEF)' },
  discipline: { name: 'Will', color: 'var(--attr-will, #B5E34A)' },
  strength: { name: 'Body', color: 'var(--attr-body, #3FA56F)' },
  creativity: { name: 'Craft', color: 'var(--attr-craft, #9B7AC7)' },
  consistency: { name: 'Habit', color: 'var(--attr-habit, #C99628)' },
  mind: { name: 'Mind', color: 'var(--attr-mind, #5B8DEF)' },
  will: { name: 'Will', color: 'var(--attr-will, #B5E34A)' },
  body: { name: 'Body', color: 'var(--attr-body, #3FA56F)' },
  craft: { name: 'Craft', color: 'var(--attr-craft, #9B7AC7)' },
  habit: { name: 'Habit', color: 'var(--attr-habit, #C99628)' },
};

export default function QuestCard({ quest, onComplete, onEdit, onDelete }) {
  const [completing, setCompleting] = useState(false);
  const [showFloatingXp, setShowFloatingXp] = useState(false);
  const isCompleted = quest.status === 'completed';

  const handleCompleteClick = async (e) => {
    e?.stopPropagation();
    if (isCompleted || completing) return;

    try {
      setCompleting(true);
      setShowFloatingXp(true);
      sounds.playQuestComplete();
      await onComplete(quest.id);
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  const attr = ATTRIBUTE_LABELS[quest.attribute_type] || {
    name: 'Mind',
    color: 'var(--attr-mind, #5B8DEF)',
  };

  return (
    <div
      className={`relative group mettle-card-interactive rounded-xl p-3.5 sm:p-4 border bg-[var(--bg-surface)] border-[var(--border)] flex flex-col justify-between gap-3 shadow-xs ${
        isCompleted
          ? 'opacity-65 bg-black/5 dark:bg-black/25'
          : completing
          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30'
          : ''
      }`}
    >
      {/* Floating XP / Gold Particle Feedback */}
      {showFloatingXp && (
        <XpFloatingBadge
          xp={Number(quest.xp_reward) || 30}
          gold={Number(quest.gold_reward) || 0}
          onComplete={() => setShowFloatingXp(false)}
        />
      )}

      {/* Top Header: Checkbox + Title + Hover Actions */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Circle Checkbox Button */}
          <button
            onClick={handleCompleteClick}
            disabled={isCompleted || completing}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90 cursor-pointer ${
              isCompleted
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-text)]'
                : completing
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-text)] animate-check-pop'
                : 'border-[var(--border-strong)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:scale-105'
            }`}
            aria-label="Complete task"
            title={isCompleted ? 'Completed' : 'Click to complete'}
          >
            {isCompleted || completing ? (
              <Check className="h-3 w-3 stroke-[3] animate-check-pop" />
            ) : (
              <span className="opacity-0 group-hover:opacity-100 text-[var(--accent)] text-[10px] font-bold">
                ✓
              </span>
            )}
          </button>

          {/* Task Title */}
          <div className="flex-1 min-w-0">
            <h4
              className={`font-sans text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug break-words line-clamp-2 transition-colors ${
                isCompleted ? 'line-through text-[var(--text-muted)]' : ''
              }`}
              title={quest.title}
            >
              {quest.title}
            </h4>

            {quest.description && (
              <p className="font-sans text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                {quest.description}
              </p>
            )}
          </div>
        </div>

        {/* Quick Edit / Delete Icons on Hover */}
        {!isCompleted && (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center gap-1 shrink-0 -mr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(quest);
              }}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-90 transition-all cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(quest.id);
              }}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 active:scale-90 transition-all cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Row: Attribute Tag + XP / Gold Rewards */}
      <div className="flex items-center justify-between gap-1 text-[10px] font-mono border-t border-[var(--border)] pt-2.5 mt-0.5">
        <span className="font-sans font-medium text-[var(--text-muted)] flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: attr.color }}
          />
          <span style={{ color: attr.color }} className="font-semibold uppercase text-[10px]">
            {attr.name}
          </span>
          <span className="text-[var(--border-strong)]">•</span>
          <span className="capitalize text-[var(--text-muted)]">{quest.difficulty || 'medium'}</span>
        </span>

        <div className="flex items-center gap-1.5 font-bold shrink-0">
          <span className="font-mono text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-md border border-[var(--accent-border)] transition-transform group-hover:scale-105">
            +{quest.xp_reward || 30} XP
          </span>
          {quest.gold_reward > 0 && (
            <span className="font-mono text-[10px] font-bold text-[var(--gold)] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              +{quest.gold_reward} G
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
