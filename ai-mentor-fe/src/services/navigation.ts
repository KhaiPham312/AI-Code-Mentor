export type AppView = 'dashboard' | 'ide' | 'settings' | 'submissions' | 'teacher';
export type SettingsTab = 'profile' | 'password' | 'appearance';
export type TeacherTab = 'analytics' | 'assignments' | 'logs' | 'roster';
export type TeacherDrilldownView = 'submissions' | 'leaderboard';

export function isTeacherTab(x: unknown): x is TeacherTab {
  return typeof x === 'string' && ['analytics', 'assignments', 'logs', 'roster'].includes(x);
}

export interface RouteOptions {
  exerciseId?: number;
  settingsTab?: SettingsTab;
  trackId?: string | null;
  courseId?: string | null;
  exerciseView?: TeacherDrilldownView | null;
  teacherTab?: TeacherTab;
  teacherCourse?: string | null;
  teacherExercise?: number | null;
  teacherView?: TeacherDrilldownView | null;
}

export interface RouteState {
  view: AppView;
  exerciseId: number;
  settingsTab: SettingsTab;
  trackId: string | null;
  courseId?: string | null;
  exerciseView?: TeacherDrilldownView | null;
  teacherTab?: TeacherTab;
  teacherCourse?: string | null;
  teacherExercise?: number | null;
  teacherView?: TeacherDrilldownView | null;
}

export function resolveHomeRoute(role?: string): string {
  return role === 'teacher' ? '/teacher' : '/dashboard';
}

/**
 * Phân tích URL hiện tại của trình duyệt (pathname và query params)
 * để lấy ra view, exerciseId, settingsTab hoặc trackId tương ứng.
 */
export function parseCurrentRoute(
  customPath?: string,
  customSearch?: string
): RouteState {
  let rawPath = '/';
  let searchParams = new URLSearchParams();

  if (customPath !== undefined) {
    rawPath = customPath.replace(/\/+$/, '') || '/';
    searchParams = new URLSearchParams(customSearch || '');
  } else if (typeof window !== 'undefined') {
    rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
    searchParams = new URLSearchParams(window.location.search);
  } else {
    return {
      view: 'dashboard',
      exerciseId: 1,
      settingsTab: 'profile',
      trackId: null,
    };
  }

  const state: RouteState = {
    view: 'dashboard',
    exerciseId: 1,
    settingsTab: 'profile',
    trackId: searchParams.get('trackId') || null,
  };

  // 1. Teacher Dashboard (/teacher)
  if (rawPath === '/teacher') {
    state.view = 'teacher';
    const tab = searchParams.get('tab');
    if (isTeacherTab(tab)) {
      state.teacherTab = tab;
    }
    const course = searchParams.get('course') || null;
    state.teacherCourse = course;
    state.courseId = course;
    const ex = searchParams.get('exercise');
    const parsedEx = ex && !isNaN(Number(ex)) ? Number(ex) : null;
    state.teacherExercise = parsedEx;
    if (parsedEx) state.exerciseId = parsedEx;
    const v = searchParams.get('view');
    if (v === 'submissions' || v === 'leaderboard') {
      state.teacherView = v;
      state.exerciseView = v;
    }
    return state;
  }

  // 2. Settings page (/settings)
  if (rawPath === '/settings') {
    state.view = 'settings';
    const tab = searchParams.get('tab');
    if (tab === 'profile' || tab === 'password' || tab === 'appearance') {
      state.settingsTab = tab;
    }
    return state;
  }

  // 3. Submissions history (/submissions)
  if (rawPath === '/submissions') {
    state.view = 'submissions';
    return state;
  }

  // 4. IDE Workspace: hỗ trợ /ide, /ide/:id, /ide?exerciseId=..., /ide?id=...
  if (rawPath === '/ide' || rawPath.startsWith('/ide/')) {
    state.view = 'ide';
    let idFromPath: number | null = null;
    const parts = rawPath.split('/').filter(Boolean);
    if (parts.length >= 2 && !isNaN(Number(parts[1]))) {
      idFromPath = parseInt(parts[1], 10);
    }

    const exId =
      idFromPath ??
      Number(searchParams.get('exerciseId') || searchParams.get('id') || 1);

    state.exerciseId = isNaN(exId) || exId <= 0 ? 1 : exId;
    return state;
  }

  // 5. Default: Dashboard (/ hoặc /dashboard hoặc các đường dẫn khác)
  state.view = 'dashboard';
  return state;
}

/**
 * Xây dựng URL chuẩn từ view và các options kèm theo
 */
export function buildRouteUrl(view: AppView, options?: RouteOptions): string {
  switch (view) {
    case 'teacher': {
      const params = new URLSearchParams();
      const tab = options?.teacherTab;
      const course = options?.courseId ?? options?.teacherCourse;
      const exercise = options?.exerciseId ?? options?.teacherExercise;
      const viewType = options?.exerciseView ?? options?.teacherView;

      if (tab) params.set('tab', tab);
      if (course) params.set('course', course);
      if (exercise !== undefined && exercise !== null) {
        params.set('exercise', String(exercise));
      }
      if (viewType) params.set('view', viewType);
      const q = params.toString();
      return q ? `/teacher?${q}` : '/teacher';
    }
    case 'ide': {
      const id = options?.exerciseId ?? 1;
      return `/ide?exerciseId=${id}`;
    }
    case 'settings': {
      const tab = options?.settingsTab ?? 'profile';
      return `/settings?tab=${tab}`;
    }
    case 'submissions': {
      return '/submissions';
    }
    case 'dashboard':
    default: {
      if (options?.trackId) {
        return `/dashboard?trackId=${encodeURIComponent(options.trackId)}`;
      }
      return '/dashboard';
    }
  }
}

/**
 * Cập nhật thanh địa chỉ URL trình duyệt qua HTML5 History API
 */
export function syncBrowserUrl(
  view: AppView,
  options?: RouteOptions,
  replace: boolean = false
): void {
  if (typeof window === 'undefined') return;

  const targetUrl = buildRouteUrl(view, options);
  const currentUrl = window.location.pathname + window.location.search;

  if (currentUrl !== targetUrl) {
    if (replace) {
      window.history.replaceState(null, '', targetUrl);
    } else {
      window.history.pushState(null, '', targetUrl);
    }
  }
}
