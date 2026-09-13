import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, Trophy, AlertCircle, Info, X } from 'lucide-react';

// Simple global event bus for lightweight zero-dependency toasts
const listeners = new Set();

export const notify = {
  show: (toast) => {
    const id = Date.now() + Math.random();
    const item = { id, duration: 4000, ...toast };
    listeners.forEach((cb) => cb({ type: 'ADD', toast: item }));
    return id;
  },
  success: (title, message) => notify.show({ type: 'success', title, message }),
  xp: (xp, message = 'Quest Completed!') =>
    notify.show({ type: 'xp', title: `+${xp} XP Earned`, message }),
  achievement: (title, message = 'New achievement unlocked!') =>
    notify.show({ type: 'achievement', title, message }),
  error: (title, message) => notify.show({ type: 'error', title, message }),
  info: (title, message) => notify.show({ type: 'info', title, message }),
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (action) => {
      if (action.type === 'ADD') {
        setToasts((prev) => [...prev.slice(-3), action.toast]); // Keep max 4 toasts
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== action.toast.id));
        }, action.toast.duration || 4000);
      }
    };

    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />;
        let borderClass = 'border-[var(--border-strong)]';
        let bgClass = 'bg-[var(--bg-surface)]';

        if (toast.type === 'xp') {
          icon = <Sparkles className="h-4 w-4 text-[var(--accent)]" />;
          borderClass = 'border-[var(--accent)]/40 shadow-[0_0_15px_rgba(181,227,74,0.15)]';
        } else if (toast.type === 'achievement') {
          icon = <Trophy className="h-4 w-4 text-[var(--gold)]" />;
          borderClass = 'border-[var(--gold)]/40 shadow-[0_0_15px_rgba(230,184,77,0.15)]';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="h-4 w-4 text-[var(--danger)]" />;
          borderClass = 'border-[var(--danger)]/40';
        } else if (toast.type === 'info') {
          icon = <Info className="h-4 w-4 text-[var(--info)]" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} ${bgClass} shadow-xl backdrop-blur-md animate-toast-in font-sans text-xs transition-all`}
          >
            <div className="p-1 rounded-md bg-[var(--bg-elevated)] shrink-0 mt-0.5">
              {icon}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="font-display font-bold text-[var(--text-primary)] text-xs tracking-tight">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
