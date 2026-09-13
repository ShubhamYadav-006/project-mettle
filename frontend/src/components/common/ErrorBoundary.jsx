import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Mettle ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full mettle-panel rounded-2xl p-7 border border-[var(--border-strong)] bg-[var(--bg-surface)] text-center space-y-5 shadow-2xl animate-modal-pop">
            <div className="h-14 w-14 rounded-2xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 mx-auto flex items-center justify-center text-[var(--danger)]">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Something went wrong
              </h1>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                An unexpected interface error occurred. Don't worry, your progress and data are safely saved.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)] text-left truncate">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md shadow-[var(--accent)]/20"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload App</span>
              </button>
              <button
                onClick={this.handleReset}
                className="py-2.5 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
