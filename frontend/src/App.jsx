import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import QuestsPage from './pages/QuestsPage';
import CharacterPage from './pages/CharacterPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading, activeTheme } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [unauthView, setUnauthView] = useState('landing'); // 'landing' | 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-[var(--text-primary)] gap-3">
        <Loader2 className="h-8 w-8 text-[var(--accent)] animate-spin" />
        <p className="font-display text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Synchronizing Character...
        </p>
      </div>
    );
  }

  // If user is not authenticated:
  if (!user) {
    if (unauthView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setUnauthView('register')}
          onLogin={() => setUnauthView('login')}
        />
      );
    }
    return (
      <AuthPage
        initialIsRegister={unauthView === 'register'}
        onBackToLanding={() => setUnauthView('landing')}
      />
    );
  }

  const themeClass = activeTheme && activeTheme !== 'default' ? activeTheme : '';

  return (
    <div className={`min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] pb-16 lg:pb-0 transition-colors duration-200 ${themeClass}`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex max-w-[1200px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              isCreateModalOpen={isCreateModalOpen}
              setIsCreateModalOpen={setIsCreateModalOpen}
            />
          )}

          {activeTab === 'quests' && (
            <QuestsPage
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              isCreateModalOpen={isCreateModalOpen}
              setIsCreateModalOpen={setIsCreateModalOpen}
            />
          )}

          {activeTab === 'character' && <CharacterPage />}

          {activeTab === 'shop' && <ShopPage />}

          {activeTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
