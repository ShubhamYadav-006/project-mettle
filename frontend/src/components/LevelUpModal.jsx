import React, { useEffect } from 'react';
import { ArrowRight, Award, Sparkles, Shield, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import AnimatedNumber from './common/AnimatedNumber';

export default function LevelUpModal({ data, onClose }) {
  useEffect(() => {
    if (!data) return;

    sounds.playLevelUp();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#B5E34A', '#5B8DEF', '#E6B84D', '#FFFFFF'],
      });
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm text-center rounded-2xl mettle-panel p-6 sm:p-7 border border-[var(--accent)]/40 bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[0_0_50px_rgba(181,227,74,0.25)] animate-modal-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[var(--accent)]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Level Icon with Pulse Halo */}
        <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] animate-pulse-glow">
          <Award className="h-8 w-8 stroke-[2.2]" />
          <Sparkles className="absolute -top-1.5 -right-1.5 h-4 w-4 text-[var(--gold)] animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-sans text-[11px] font-bold uppercase tracking-widest border border-[var(--accent-border)] mb-2.5">
          Ascension Achieved
        </span>

        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
          LEVEL <AnimatedNumber value={data.level} />
        </h2>

        <p className="font-sans text-xs font-bold text-[var(--accent)] uppercase tracking-wider mt-1.5">
          {data.title}
        </p>

        {/* Perks Box */}
        <div className="my-5 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-left space-y-2.5 text-xs font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)] font-medium uppercase text-[11px] flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-[var(--gold)]" />
              Gold Bounty:
            </span>
            <span className="font-display font-bold text-[var(--gold)] text-sm">+10 Gold</span>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-2">
            <span className="text-[var(--text-muted)] font-medium uppercase text-[11px] flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[var(--accent)]" />
              Mettle Rating:
            </span>
            <span className="font-display font-bold text-[var(--accent)] text-sm">+25 Score</span>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/25 cursor-pointer"
        >
          <span>Claim & Continue</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
