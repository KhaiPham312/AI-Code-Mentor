import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardPreview } from './components/DashboardPreview';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentWorkspace } from './components/ide/StudentWorkspace';
import { SettingsPage } from './components/settings/SettingsPage';
import { SubmissionsPage } from './components/submissions/SubmissionsPage';
import { User } from './types/auth';
import { Language, ThemeMode } from './components/dashboard/dashboardI18n';
import {
  setAuthToken,
  clearAuthSession,
  AUTH_UNAUTHORIZED_EVENT,
} from './services/apiClient';

export function App() {
  // Current user state with localStorage initialization
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('ai_mentor_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // Ignore
    }
    return null;
  });

  // Main view router: 'dashboard' | 'ide' | 'settings' | 'submissions'
  const [currentView, setCurrentView] = useState<'dashboard' | 'ide' | 'settings' | 'submissions'>('dashboard');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'appearance'>('profile');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number>(1);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  // Global Language state
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_lang');
      if (saved === 'eng' || saved === 'vie') return saved;
    } catch {
      // Fallback
    }
    return 'vie';
  });

  // Global Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Fallback
    }
    return 'dark';
  });

  // Sync theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ai_mentor_theme', currentTheme);
    } catch {
      // Ignore
    }
  }, [currentTheme]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('ai_mentor_lang', lang);
    } catch {
      // Ignore
    }
  };

  const handleThemeToggle = () => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Listen for 401 Unauthorized globally
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setCurrentView('dashboard');
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (user: User, token: string) => {
    setAuthToken(token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('ai_mentor_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearAuthSession();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('ai_mentor_user');
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('ai_mentor_user', JSON.stringify(updatedUser));
    } catch {
      // Ignore
    }
  };

  const handleOpenIDE = (exerciseId: number = 1) => {
    setSelectedExerciseId(exerciseId);
    setCurrentView('ide');
  };

  const handleOpenSettings = (tab: 'profile' | 'password' | 'appearance' = 'profile') => {
    setSettingsTab(tab);
    setCurrentView('settings');
  };

  const handleOpenSubmissions = () => {
    setCurrentView('submissions');
  };

  const handleBackToDashboard = (trackId?: string) => {
    if (trackId) {
      setSelectedTrackId(trackId);
    } else {
      setSelectedTrackId(null);
    }
    setCurrentView('dashboard');
  };

  // 1. Unauthenticated -> Auth / Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Dedicated Settings Page (/settings)
  if (currentView === 'settings') {
    return (
      <SettingsPage
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onBackToDashboard={() => setCurrentView('dashboard')}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        initialTab={settingsTab}
      />
    );
  }

  // 2b. Dedicated Submissions History Page (/submissions)
  if (currentView === 'submissions') {
    return (
      <SubmissionsPage
        user={currentUser}
        onBackToDashboard={() => setCurrentView('dashboard')}
        onOpenIDE={handleOpenIDE}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
      />
    );
  }

  // 3. 1:1 HackerRank Student Workspace IDE
  if (currentView === 'ide') {
    return (
      <StudentWorkspace
        user={currentUser}
        initialExerciseId={selectedExerciseId}
        onBackToDashboard={handleBackToDashboard}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
      />
    );
  }

  // 4. Role-based views: Teacher Dashboard
  if (currentUser.role === 'teacher') {
    return (
      <TeacherDashboard
        user={currentUser}
        onLogout={handleLogout}
        onPreviewStudentIDE={handleOpenIDE}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // 5. Main Student Dashboard
  return (
    <DashboardPreview
      user={currentUser}
      onLogout={handleLogout}
      onOpenIDE={handleOpenIDE}
      onOpenSettings={handleOpenSettings}
      onOpenSubmissions={handleOpenSubmissions}
      initialTrackId={selectedTrackId}
      currentLang={currentLang}
      onLanguageChange={handleLanguageChange}
      currentTheme={currentTheme}
      onThemeToggle={handleThemeToggle}
    />
  );
}

export default App;
