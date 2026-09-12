import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-200">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base sm:text-lg font-black tracking-wider text-[var(--text-primary)]">
              Mettle
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans mt-0.5">
              Build yourself. Level by level.
            </p>
          </div>
          <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans sm:text-right">
            © 2026 Mettle
          </div>
        </div>
      </div>
    </footer>
  );
}
