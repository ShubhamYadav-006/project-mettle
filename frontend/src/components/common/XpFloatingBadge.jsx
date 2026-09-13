import React from 'react';
import { Sparkles, Coins } from 'lucide-react';

/**
 * XpFloatingBadge Component
 * Renders an energetic floating particle (+50 XP / +10 Gold) that ascends and fades out.
 */
export default function XpFloatingBadge({ xp = 0, gold = 0, onComplete }) {
  if (!xp && !gold) return null;

  return (
    <div
      onAnimationEnd={onComplete}
      className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--accent)]/50 shadow-[0_0_20px_rgba(181,227,74,0.35)] animate-xp-float select-none text-xs font-bold"
    >
      {xp > 0 && (
        <span className="flex items-center gap-1 text-[var(--accent)] font-mono">
          <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
          +{xp} XP
        </span>
      )}
      {gold > 0 && (
        <span className="flex items-center gap-0.5 text-[var(--gold)] font-mono">
          <Coins className="h-3 w-3" />
          +{gold} G
        </span>
      )}
    </div>
  );
}
