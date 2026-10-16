export type AppView = 'dashboard' | 'ide' | 'settings' | 'submissions';
export type SettingsTab = 'profile' | 'password' | 'appearance';

export interface RouteState {
  view: AppView;
  exerciseId: number;
  settingsTab: SettingsTab;
  trackId: string | null;
}

/**
 * Phân tích URL hiện tại của trình duyệt (pathname và query params)
 * để lấy ra view, exerciseId, settingsTab hoặc trackId tương ứng.
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === 'undefined') {
    return {
      view: 'dashboard',
      exerciseId: 1,
      settingsTab: 'profile',
      trackId: null,
    };
  }

  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);

  const state: RouteState = {
    view: 'dashboard',
    exerciseId: 1,
    settingsTab: 'profile',
    trackId: searchParams.get('trackId') || null,
  };

  // 1. Settings page (/settings)
  if (rawPath === '/settings') {
    state.view = 'settings';
    const tab = searchParams.get('tab');
    if (tab === 'profile' || tab === 'password' || tab === 'appearance') {
      state.settingsTab = tab;
    }
    return state;
  }

  // 2. Submissions history (/submissions)
  if (rawPath === '/submissions') {
    state.view = 'submissions';
    return state;
  }

  // 3. IDE Workspace: hỗ trợ /ide, /ide/:id, /ide?exerciseId=..., /ide?id=...
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

  // 4. Default: Dashboard (/ hoặc /dashboard hoặc các đường dẫn khác)
  state.view = 'dashboard';
  return state;
}

/**
 * Xây dựng URL chuẩn từ view và các options kèm theo
 */
export function buildRouteUrl(
  view: AppView,
  options?: {
    exerciseId?: number;
    settingsTab?: SettingsTab;
    trackId?: string | null;
  }
): string {
  switch (view) {
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
  options?: {
    exerciseId?: number;
    settingsTab?: SettingsTab;
    trackId?: string | null;
  },
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
