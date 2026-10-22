/**
 * Client HTTP tập trung sử dụng Fetch API
 * - Tự động đính kèm Bearer Token (nếu có trong localStorage)
 * - Tự động thiết lập Base URL từ biến môi trường VITE_API_BASE_URL
 * - Hỗ trợ timeout qua AbortController
 * - Bắt lỗi tập trung: 401 Unauthorized (tự xóa token và redirect/dispatch logout), Network Error, Timeout
 */

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Storage keys dùng đồng bộ toàn bộ app
export const AUTH_TOKEN_KEY = 'ai_mentor_token';
export const AUTH_USER_KEY = 'ai_mentor_user';

// Lấy Base URL từ .env, fallback về http://localhost:8000/api/v1
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
).replace(/\/+$/, '');

/**
 * Lấy Bearer Token hiện tại từ localStorage
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Lưu token vào localStorage
 */
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (err) {
    console.error('Không thể lưu auth token vào localStorage:', err);
  }
}

/**
 * Xóa token và user để đăng xuất
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.error('Lỗi khi xóa phiên đăng nhập:', err);
  }
}

/**
 * Sự kiện tùy biến khi phiên đăng nhập hết hạn (401)
 * Các component React (như App.tsx hoặc AuthProvider) có thể lắng nghe sự kiện này để cập nhật UI ngay lập tức
 */
export const AUTH_UNAUTHORIZED_EVENT = 'ai-mentor:unauthorized';

export function notifyUnauthorized(): void {
  clearAuthSession();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
  }
}

/**
 * Hàm gọi API tập trung
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeoutMs = 15000,
    params,
    headers: customHeaders = {},
    ...customConfig
  } = options;

  // 1. Tạo Query String nếu có params
  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // 2. Chuẩn bị Headers
  const headers = new Headers(customHeaders);

  // Mặc định JSON nếu body không phải FormData
  if (!(customConfig.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Đính kèm Bearer Token nếu có
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 3. Timeout Controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 4. Xử lý phản hồi 401 Unauthorized
    if (response.status === 401) {
      notifyUnauthorized();
      let errorDetail = 'SESSION_EXPIRED';
      try {
        const errorJson = (await response.json()) as { detail?: string };
        if (errorJson?.detail) errorDetail = errorJson.detail;
      } catch {
        // bỏ qua nếu response body không phải json
      }
      throw new ApiError(errorDetail, 401);
    }

    // 5. Kiểm tra mã trạng thái HTTP khác lỗi
    if (!response.ok) {
      let errorDetail = `Yêu cầu thất bại với mã lỗi ${response.status}`;
      let errorData: unknown = null;
      try {
        errorData = await response.json();
        if (typeof errorData === 'string') {
          errorDetail = errorData;
        } else if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'detail' in errorData
        ) {
          const detail = (errorData as { detail: unknown }).detail;
          errorDetail = typeof detail === 'string' ? detail : JSON.stringify(detail);
        } else if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'message' in errorData
        ) {
          errorDetail = String((errorData as { message: unknown }).message);
        }
      } catch {
        errorDetail = response.statusText || errorDetail;
      }

      throw new ApiError(errorDetail, response.status, errorData);
    }

    // Nếu response là 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        `Yêu cầu đến máy chủ quá hạn (${timeoutMs / 1000}s). Vui lòng kiểm tra lại kết nối mạng.`,
        408
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Lỗi mạng hoặc mất kết nối với server
    const networkMsg = error instanceof Error ? error.message : 'NETWORK_ERROR';
    throw new ApiError(
      networkMsg,
      0,
      error
    );
  }
}

// Shortcut methods tiện lợi
export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown, B = unknown>(endpoint: string, body?: B, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = unknown, B = unknown>(endpoint: string, body?: B, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = unknown, B = unknown>(endpoint: string, body?: B, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
