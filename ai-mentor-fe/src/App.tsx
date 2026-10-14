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

function parseInitialNavigationState() {
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const savedView = typeof localStorage !== 'undefined' ? localStorage.getItem('ai_mentor_current_view') : null;
  const savedCourseId = typeof localStorage !== 'undefined' ? localStorage.getItem('ai_mentor_selected_course_id') : null;
  const savedExerciseIdStr = typeof localStorage !== 'undefined' ? localStorage.getItem('ai_mentor_selected_exercise_id') : null;
  const savedExerciseId = savedExerciseIdStr ? parseInt(savedExerciseIdStr, 10) : 1;

  // 1. Hash-based resolution
  if (hash.startsWith('#/workspace/')) {
    const rawId = hash.replace('#/workspace/', '').trim();
    const match = rawId.match(/(\d+)/);
    const parsedId = match ? parseInt(match[1], 10) : savedExerciseId;
    return {
      view: 'ide' as const,
      exerciseId: isNaN(parsedId) ? 1 : parsedId,
      trackId: savedCourseId || null,
    };
  }

  if (hash.startsWith('#/course/')) {
    const track = hash.replace('#/course/', '').trim();
    return {
      view: 'dashboard' as const,
      exerciseId: savedExerciseId || 1,
      trackId: track || null,
    };
  }

  if (hash.startsWith('#/submissions')) {
    return {
      view: 'submissions' as const,
      exerciseId: savedExerciseId || 1,
      trackId: savedCourseId || null,
    };
  }

  if (hash.startsWith('#/settings')) {
    return {
      view: 'settings' as const,
      exerciseId: savedExerciseId || 1,
      trackId: savedCourseId || null,
    };
  }

  if (hash.startsWith('#/teacher')) {
    return {
      view: 'dashboard' as const,
      exerciseId: savedExerciseId || 1,
      trackId: null,
    };
  }

  // 2. LocalStorage-based fallback
  if (savedView === 'ide') {
    return {
      view: 'ide' as const,
      exerciseId: savedExerciseId || 1,
      trackId: savedCourseId || null,
    };
  }
  if (savedView === 'submissions') {
    return {
      view: 'submissions' as const,
      exerciseId: savedExerciseId || 1,
      trackId: savedCourseId || null,
    };
  }
  if (savedView === 'settings') {
    return {
      view: 'settings' as const,
      exerciseId: savedExerciseId || 1,
      trackId: savedCourseId || null,
    };
  }

  return {
    view: 'dashboard' as const,
    exerciseId: savedExerciseId || 1,
    trackId: savedCourseId || null,
  };
}

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

  const initialNav = parseInitialNavigationState();

  // Main view router: 'dashboard' | 'ide' | 'settings' | 'submissions'
  const [currentView, setCurrentView] = useState<'dashboard' | 'ide' | 'settings' | 'submissions'>(initialNav.view);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'appearance'>('profile');
  const [selectedExerciseId, setSelectedExerciseId] = useState<number>(initialNav.exerciseId);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(initialNav.trackId);

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

  // Sync view state to localStorage & URL Hash
  useEffect(() => {
    if (!currentUser) return;

    try {
      localStorage.setItem('ai_mentor_current_view', currentView);

      if (currentView === 'ide') {
        localStorage.setItem('ai_mentor_selected_exercise_id', String(selectedExerciseId));
        window.history.replaceState(null, '', `#/workspace/${selectedExerciseId}`);
      } else if (currentView === 'submissions') {
        window.history.replaceState(null, '', `#/submissions`);
      } else if (currentView === 'settings') {
        window.history.replaceState(null, '', `#/settings`);
      } else if (currentView === 'dashboard') {
        if (currentUser.role === 'teacher') {
          const teacherTab = localStorage.getItem('ai_mentor_teacher_tab') || 'analytics';
          window.history.replaceState(null, '', `#/teacher/${teacherTab}`);
        } else if (selectedTrackId) {
          localStorage.setItem('ai_mentor_selected_course_id', selectedTrackId);
          window.history.replaceState(null, '', `#/course/${selectedTrackId}`);
        } else {
          localStorage.removeItem('ai_mentor_selected_course_id');
          window.history.replaceState(null, '', `#/dashboard`);
        }
      }
    } catch {
      // Ignore
    }
  }, [currentView, selectedExerciseId, selectedTrackId, currentUser]);

  // Listen for hashchange events (back / forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const state = parseInitialNavigationState();
      setCurrentView(state.view);
      setSelectedExerciseId(state.exerciseId);
      setSelectedTrackId(state.trackId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    localStorage.removeItem('ai_mentor_current_view');
    localStorage.removeItem('ai_mentor_selected_course_id');
    localStorage.removeItem('ai_mentor_selected_exercise_id');
    localStorage.removeItem('ai_mentor_teacher_tab');
    window.history.replaceState(null, '', `#/`);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedTrackId(null);
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
    try {
      localStorage.setItem('ai_mentor_current_view', 'ide');
      localStorage.setItem('ai_mentor_selected_exercise_id', String(exerciseId));
      window.history.replaceState(null, '', `#/workspace/${exerciseId}`);
    } catch {
      // Ignore
    }
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
      try {
        localStorage.setItem('ai_mentor_selected_course_id', trackId);
        window.history.replaceState(null, '', `#/course/${trackId}`);
      } catch {
        // Ignore
      }
    } else {
      setSelectedTrackId(null);
      try {
        localStorage.removeItem('ai_mentor_selected_course_id');
        window.history.replaceState(null, '', `#/dashboard`);
      } catch {
        // Ignore
      }
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
      onTrackChange={(trackId) => setSelectedTrackId(trackId)}
      currentLang={currentLang}
      onLanguageChange={handleLanguageChange}
      currentTheme={currentTheme}
      onThemeToggle={handleThemeToggle}
    />
  );
}

export default App;
