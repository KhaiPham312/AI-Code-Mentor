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
  RouteOptions,
  parseCurrentRoute,
  syncBrowserUrl,
  resolveHomeRoute,
} from './services/navigation';

export function clearSessionState(): void {
  clearAuthSession();
  const keysToRemove = [
    'auth_token',
    'ai_mentor_user',
    'ai_mentor_teacher_class_id',
    'ai_mentor_teacher_tab',
    'ai_mentor_teacher_course_tab',
    'ai_mentor_teacher_exercise_tab',
    'ai_mentor_teacher_drilldown',
    'ai_mentor_student_course_view_mode',
    'ai_mentor_ide_active_tab',
  ];
  keysToRemove.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  });
  // Note: Deliberately preserve user submissions and drafts across logout
  // so switching roles or re-logging into student accounts does not wipe submission records.
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
      options?: RouteOptions,
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
          teacherTab: initial.teacherTab,
          teacherCourse: initial.teacherCourse,
          teacherExercise: initial.teacherExercise,
          teacherView: initial.teacherView,
        },
        true
      );
    }
  }, [currentUser]);

  // Listen for 401 Unauthorized globally
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSessionState();
      setCurrentUser(null);
      window.history.replaceState(null, '', '/login');
      setCurrentView('dashboard');
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (user: User, token: string) => {
    setAuthToken(token);
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('ai_mentor_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    setCurrentUser(user);

    // Reset old course/drilldown states so fresh login lands clean
    setSelectedTrackId(null);

    // Navigate cleanly to role-based home without stale trackId or drilldown params
    const home = resolveHomeRoute(user.role);
    window.history.replaceState(null, '', home);
    setCurrentView(user.role === 'teacher' ? 'teacher' : 'dashboard');
  };

  const handleLogout = () => {
    clearSessionState();
    setCurrentUser(null);
    setSelectedTrackId(null);
    window.history.replaceState(null, '', '/login');
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
    navigateTo('ide', { exerciseId });
  };

  const handleTeacherPreviewIDE = (exerciseId: number = 1) => {
    try {
      sessionStorage.setItem('ai_mentor_teacher_return_url', window.location.pathname + window.location.search);
    } catch {
      // ignore
    }
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
    if (currentUser?.role === 'teacher') {
      let returnUrl = '/teacher';
      try {
        const saved = sessionStorage.getItem('ai_mentor_teacher_return_url');
        if (saved) {
          returnUrl = saved;
          sessionStorage.removeItem('ai_mentor_teacher_return_url');
        }
      } catch {
        // ignore
      }
      window.history.pushState(null, '', returnUrl);
      const parsed = parseCurrentRoute();
      setCurrentView(parsed.view);
      return;
    }
    navigateTo('dashboard', { trackId: trackId || null });
  };

  // Route paths inspection
  const rawPath = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/';
  const rawHash = typeof window !== 'undefined' ? window.location.hash : '';

  const isResetPasswordRoute =
    rawPath === '/auth/reset-password' ||
    rawPath === '/reset-password' ||
    rawHash.startsWith('#/auth/reset-password') ||
    rawHash.startsWith('#/reset-password');

  const isAuthLoginOrForgot =
    rawPath === '/login' ||
    rawPath === '/auth/forgot-password' ||
    rawPath === '/forgot-password' ||
    rawHash.startsWith('#/login') ||
    rawHash.startsWith('#/auth/forgot-password') ||
    rawHash.startsWith('#/forgot-password');

  // 1. Nếu đã đăng nhập mà truy cập /login hoặc /auth/forgot-password -> replace về trang chủ theo role
  useEffect(() => {
    if (currentUser && isAuthLoginOrForgot && !isResetPasswordRoute) {
      const homePath = resolveHomeRoute(currentUser.role);
      window.history.replaceState(null, '', homePath);
      setCurrentView(currentUser.role === 'teacher' ? 'teacher' : 'dashboard');
    }
  }, [currentUser, isAuthLoginOrForgot, isResetPasswordRoute]);

  // 2. Phân quyền: Student vào /teacher -> về /dashboard; Teacher vào /dashboard -> về /teacher
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student' && (currentView === 'teacher' || rawPath === '/teacher')) {
        window.history.replaceState(null, '', '/dashboard');
        setCurrentView('dashboard');
      } else if (currentUser.role === 'teacher' && (currentView === 'dashboard' || rawPath === '/dashboard')) {
        window.history.replaceState(null, '', '/teacher');
        setCurrentView('teacher');
      }
    }
  }, [currentUser, currentView, rawPath]);

  // 1. Unauthenticated or explicit Reset Password from Gmail
  if (!currentUser || isResetPasswordRoute) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // 2. Dedicated Settings Page (/settings)
  if (currentView === 'settings') {
    return (
      <SettingsPage
        user={currentUser}
        onUpdateUser={handleUpdateUser}
        onBackToDashboard={handleBackToDashboard}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
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
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // 4. Role-based views: Teacher Dashboard (/teacher)
  if (currentUser.role === 'teacher') {
    return (
      <TeacherDashboard
        user={currentUser}
        onLogout={handleLogout}
        onOpenSettings={handleOpenSettings}
        onPreviewStudentIDE={handleTeacherPreviewIDE}
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
