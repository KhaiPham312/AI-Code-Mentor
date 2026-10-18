import { useState, useEffect, useCallback } from 'react';
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
import {
  AppView,
  SettingsTab,
  parseCurrentRoute,
  syncBrowserUrl,
} from './services/navigation';

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

  // Khởi tạo trực tiếp từ URL hiện tại để khi F5 vẫn giữ nguyên trang & bài tập đang làm
  const [currentView, setCurrentView] = useState<AppView>(() => parseCurrentRoute().view);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>(() => parseCurrentRoute().settingsTab);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number>(() => parseCurrentRoute().exerciseId);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(() => parseCurrentRoute().trackId);

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

  // Helper điều hướng tập trung và cập nhật browser URL qua History API
  const navigateTo = useCallback(
    (
      view: AppView,
      options?: {
        exerciseId?: number;
        settingsTab?: SettingsTab;
        trackId?: string | null;
      },
      replace: boolean = false
    ) => {
      setCurrentView(view);
      if (options?.exerciseId !== undefined) {
        setSelectedExerciseId(options.exerciseId);
      }
      if (options?.settingsTab !== undefined) {
        setSettingsTab(options.settingsTab);
      }
      if (options?.trackId !== undefined) {
        setSelectedTrackId(options.trackId);
      }
      syncBrowserUrl(view, options, replace);
    },
    []
  );

  // Lắng nghe sự kiện Back/Forward của trình duyệt (PopState)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setCurrentView(route.view);
      setSelectedExerciseId(route.exerciseId);
      setSettingsTab(route.settingsTab);
      setSelectedTrackId(route.trackId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Đồng bộ URL ngay khi mount lần đầu (nếu URL đang ở / hoặc đường dẫn hợp lệ)
  useEffect(() => {
    if (currentUser) {
      const initial = parseCurrentRoute();
      syncBrowserUrl(
        initial.view,
        {
          exerciseId: initial.exerciseId,
          settingsTab: initial.settingsTab,
          trackId: initial.trackId,
        },
        true
      );
    }
  }, [currentUser]);

  // Listen for 401 Unauthorized globally
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      navigateTo('dashboard', {}, true);
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigateTo]);

  const handleLoginSuccess = (user: User, token: string) => {
    setAuthToken(token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('ai_mentor_user', JSON.stringify(user));
    setCurrentUser(user);

    // Nếu người dùng truy cập trực tiếp vào một URL cụ thể trước đó, giữ nguyên view đó
    const initial = parseCurrentRoute();
    if (initial.view !== 'dashboard') {
      navigateTo(
        initial.view,
        {
          exerciseId: initial.exerciseId,
          settingsTab: initial.settingsTab,
          trackId: initial.trackId,
        },
        true
      );
    } else {
      navigateTo('dashboard', { trackId: initial.trackId }, true);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('ai_mentor_user');
    localStorage.removeItem('ai_mentor_current_view');
    localStorage.removeItem('ai_mentor_selected_course_id');
    localStorage.removeItem('ai_mentor_selected_exercise_id');
    localStorage.removeItem('ai_mentor_teacher_tab');
    window.history.replaceState(null, '', `/`);
    setCurrentUser(null);
    navigateTo('dashboard', {}, true);
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
    navigateTo('ide', { exerciseId });
  };

  const handleOpenSettings = (tab: SettingsTab = 'profile') => {
    navigateTo('settings', { settingsTab: tab });
  };

  const handleSettingsTabChange = (tab: SettingsTab) => {
    setSettingsTab(tab);
    syncBrowserUrl('settings', { settingsTab: tab }, true);
  };

  const handleOpenSubmissions = () => {
    navigateTo('submissions');
  };

  const handleBackToDashboard = (trackId?: string) => {
    navigateTo('dashboard', { trackId: trackId || null });
  };

  // 1. Unauthenticated or explicit Auth Routes (Forgot Password / Reset Password from Gmail)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const isAuthRoute =
    pathname === '/auth/reset-password' ||
    pathname === '/reset-password' ||
    pathname === '/auth/forgot-password' ||
    pathname === '/forgot-password' ||
    pathname === '/login' ||
    hash.startsWith('#/auth/reset-password') ||
    hash.startsWith('#/reset-password') ||
    hash.startsWith('#/auth/forgot-password') ||
    hash.startsWith('#/forgot-password') ||
    hash.startsWith('#/login');

  if (!currentUser || isAuthRoute) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Dedicated Settings Page (/settings)
  if (currentView === 'settings') {
    return (
      <SettingsPage
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onBackToDashboard={handleBackToDashboard}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        initialTab={settingsTab}
        onTabChange={handleSettingsTabChange}
      />
    );
  }

  // 2b. Dedicated Submissions History Page (/submissions)
  if (currentView === 'submissions') {
    return (
      <SubmissionsPage
        user={currentUser}
        onBackToDashboard={handleBackToDashboard}
        onOpenIDE={handleOpenIDE}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
      />
    );
  }

  // 3. 1:1 HackerRank Student Workspace IDE (/ide)
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

  // 5. Main Student Dashboard (/dashboard)
  return (
    <DashboardPreview
      user={currentUser}
      onLogout={handleLogout}
      onOpenIDE={handleOpenIDE}
      onOpenSettings={handleOpenSettings}
      onOpenSubmissions={handleOpenSubmissions}
      initialTrackId={selectedTrackId}
      onTrackChange={(trackId) => navigateTo('dashboard', { trackId })}
      currentLang={currentLang}
      onLanguageChange={handleLanguageChange}
      currentTheme={currentTheme}
      onThemeToggle={handleThemeToggle}
    />
  );
}

export default App;
