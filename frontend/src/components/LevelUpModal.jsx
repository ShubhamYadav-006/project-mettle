import React, { useEffect } from 'react';
import { ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

export default function LevelUpModal({ data, onClose }) {
  useEffect(() => {
    if (!data) return;

    sounds.playLevelUp();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#D8FF55', '#6EA8FE', '#E6B84D', '#F4F3EE'],
      });
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-sm text-center rounded-md mettle-panel p-6 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)]">
        {/* Level Icon */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--accent)]">
          <Award className="h-7 w-7" />
        </div>

        <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[var(--accent-soft)] text-[var(--accent)] font-sans text-[11px] font-semibold uppercase tracking-wider border border-[var(--accent-border)] mb-2">
          Level Up Reached
        </span>

        <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          LEVEL {data.level}
        </h2>

        <p className="font-sans text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-1">
          {data.title}
        </p>

        {/* Perks Box */}
        <div className="my-5 p-3.5 rounded-sm bg-[var(--bg-primary)] border border-[var(--border)] text-left space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)] font-medium uppercase text-[11px]">
              Gold Reward:
            </span>
            <span className="font-display font-bold text-[var(--gold)]">+10 Gold</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)] font-medium uppercase text-[11px]">
              Mettle Score:
            </span>
            <span className="font-display font-bold text-[var(--accent)]">+25 Score</span>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-semibold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Continue</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
