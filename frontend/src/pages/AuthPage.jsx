import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiBase } from '../utils/api';
import { ArrowRight, ArrowLeft, Sun, Moon, Eye, EyeOff } from 'lucide-react';

export default function AuthPage({ initialIsRegister = false, onBackToLanding }) {
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  useEffect(() => {
    setIsRegister(initialIsRegister);
    // Check if error passed via query param from OAuth redirect
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthError = urlParams.get('error');
      if (oauthError) {
        setError(decodeURIComponent(oauthError));
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [initialIsRegister]);

  const handleGoogleLogin = () => {
    window.location.href = `${apiBase}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your name.');
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] relative select-none transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-[1200px] mx-auto z-10">
        {onBackToLanding ? (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs font-sans font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>
        ) : (
          <span className="font-display text-base font-bold tracking-tight text-[var(--text-primary)]">
            Mettle
          </span>
        )}

        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-[var(--accent)]" />
          ) : (
            <Moon className="h-4 w-4 text-[var(--text-secondary)]" />
          )}
        </button>
      </header>

      {/* Center Auth Card Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Main Card */}
          <div className="mettle-panel rounded-md p-6 sm:p-8 border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-xl space-y-6 animate-modal-pop">
            {/* Header / Brand Identity */}
            <div className="text-center space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
                {isRegister ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="font-sans text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                {isRegister
                  ? 'Start tracking your tasks, habits, and personal progress.'
                  : 'Sign in to continue tracking your progress.'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-sm bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-xs font-semibold font-sans animate-fade-in">
                {error}
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-sm bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] border border-[var(--border-strong)] hover:border-[var(--border-interactive)] text-[var(--text-primary)] font-sans font-semibold text-xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-sm cursor-pointer hover:shadow-md"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Visual Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[var(--border)]" />
              <span className="flex-shrink mx-3 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-[var(--border)]" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs focus:outline-none focus:border-[var(--accent)] transition-all font-sans mettle-input"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs focus:outline-none focus:border-[var(--accent)] transition-all font-sans mettle-input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-sm bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs focus:outline-none focus:border-[var(--accent)] transition-all font-sans mettle-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] font-sans font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-3 shadow-md hover:shadow-[0_0_20px_var(--accent-soft)] cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </form>

            {/* Toggle Mode Switcher */}
            <div className="pt-2 border-t border-[var(--border)] text-center">
              <p className="text-xs font-sans text-[var(--text-secondary)]">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  className="text-[var(--accent)] font-bold hover:underline ml-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
                >
                  {isRegister ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer / copyright */}
      <footer className="w-full py-4 text-center text-[10px] font-sans text-[var(--text-muted)]">
        © 2026 Mettle. Built for real-world progress.
      </footer>
    </div>
  );
}
