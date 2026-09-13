import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState(null);

  // Theme Management (Default: 'dark', Options: 'dark' | 'light')
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('mettle-theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  // Apply theme class to documentElement whenever theme state changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('mettle-theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('mettle-theme', next);
      } catch (e) {}
      return next;
    });
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('mettle-theme', newTheme);
      } catch (e) {}
      setThemeState(newTheme);
    }
  };

  // RPG Equipped Skin Theme ('default' | 'theme-cyberpunk' | 'theme-midnight')
  const [activeTheme, setActiveThemeState] = useState(() => {
    try {
      return localStorage.getItem('mettle-active-theme') || 'default';
    } catch (e) {
      return 'default';
    }
  });

  const setActiveTheme = (newTheme) => {
    const val = newTheme || 'default';
    setActiveThemeState(val);
    try {
      localStorage.setItem('mettle-active-theme', val);
    } catch (e) {}
  };

  // Check current user session on mount (including handling OAuth redirect tokens)
  const checkAuth = async () => {
    try {
      setLoading(true);

      // Check if arriving from Google OAuth redirect
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('token');
        const oauthError = urlParams.get('error');

        if (oauthToken) {
          try {
            localStorage.setItem('mettle_token', oauthToken);
          } catch (e) {}
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (oauthError) {
          window.history.replaceState({}, document.title, window.location.pathname);
          console.error('Google OAuth error:', oauthError);
        }
      }

      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        setCharacter(res.data.data.character);
      }
    } catch (err) {
      setUser(null);
      setCharacter(null);
      try {
        localStorage.removeItem('mettle_token');
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setCharacter(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, []);

  // Register
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.success) {
      const token = res.data.data.token;
      if (token) {
        try {
          localStorage.setItem('mettle_token', token);
        } catch (e) {}
      }
      setUser(res.data.data.user);
      setCharacter(res.data.data.character);
    }
    return res.data;
  };

  // Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const token = res.data.data.token;
      if (token) {
        try {
          localStorage.setItem('mettle_token', token);
        } catch (e) {}
      }
      setUser(res.data.data.user);
      setCharacter(res.data.data.character);
    }
    return res.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      try {
        localStorage.removeItem('mettle_token');
      } catch (e) {}
      setUser(null);
      setCharacter(null);
    }
  };

  // Update Character Stats locally from action responses
  const updateCharacterState = (newCharacterData, leveledUp = false) => {
    setCharacter((prev) => {
      const oldLevel = Number(prev?.level) || 1;
      const newLevel = Number(newCharacterData?.level);
      const isActualLevelUp = Boolean(leveledUp) && Boolean(newLevel) && newLevel > oldLevel;

      if (isActualLevelUp) {
        setLevelUpData({
          level: newLevel,
          title: newCharacterData.title || prev?.title || 'Novice Scholar',
        });
      }

      return { ...prev, ...newCharacterData };
    });
  };

  // Update User Profile state directly across the entire app
  const updateUserProfile = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        character,
        loading,
        register,
        login,
        logout,
        checkAuth,
        updateCharacterState,
        updateUserProfile,
        levelUpData,
        setLevelUpData,
        theme,
        toggleTheme,
        setTheme,
        activeTheme,
        setActiveTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
