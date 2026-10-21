import { api, setAuthToken, clearAuthSession, getAuthToken, ApiError } from './apiClient';
import { User, UserRole } from '../types/auth';

export interface BackendUserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  student_id?: string | null;
  class_group?: string | null;
  avatar?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BackendLoginResponse {
  access_token: string;
  token_type: string;
  user: BackendUserResponse;
}

/**
 * Adapter: Chuyển đổi User từ Backend format sang Frontend format
 */
export function mapBackendUserToFrontend(bUser: BackendUserResponse): User {
  return {
    id: String(bUser.id),
    name: bUser.name,
    username: bUser.username,
    email: bUser.email,
    role: (bUser.role === 'teacher' ? 'teacher' : 'student') as UserRole,
    avatar: bUser.avatar || undefined,
    studentId: bUser.student_id || undefined,
    classGroup: bUser.class_group || undefined,
  };
}

/**
 * Đăng nhập qua API Backend
 */
export async function loginUser(
  identifier: string,
  password: string
): Promise<{ token: string; user: User }> {
  const data = await api.post<BackendLoginResponse>('/auth/login', {
    username_or_email: identifier.trim(),
    password: password,
  });

  // Lưu token vào apiClient
  setAuthToken(data.access_token);

  const frontendUser = mapBackendUserToFrontend(data.user);
  localStorage.setItem('ai_mentor_user', JSON.stringify(frontendUser));

  return {
    token: data.access_token,
    user: frontendUser,
  };
}

/**
 * Đăng ký tài khoản qua API Backend
 */
export async function registerUser(params: {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  username?: string;
}): Promise<{ token?: string; user: User }> {
  const generatedUsername =
    params.username ||
    params.email.split('@')[0] ||
    `user_${Date.now()}`;

  const registeredUser = await api.post<BackendUserResponse>('/auth/register', {
    name: params.fullName.trim(),
    email: params.email.trim().toLowerCase(),
    password: params.password,
    username: generatedUsername,
    role: params.role || 'student',
    student_id:
      params.role === 'student'
        ? `SV${Math.floor(100000 + Math.random() * 900000)}`
        : null,
    class_group:
      params.role === 'teacher'
        ? 'Khoa Công nghệ Thông tin'
        : 'K72 CNTT A',
  });

  // Tự động đăng nhập sau khi đăng ký thành công
  try {
    const loginRes = await loginUser(params.email, params.password);
    return loginRes;
  } catch {
    return {
      user: mapBackendUserToFrontend(registeredUser),
    };
  }
}

/**
 * Lấy thông tin User hiện tại từ API (/auth/me)
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const data = await api.get<BackendUserResponse>('/auth/me');
    const user = mapBackendUserToFrontend(data);
    localStorage.setItem('ai_mentor_user', JSON.stringify(user));
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearAuthSession();
    }
    return null;
  }
}

/**
 * Đăng xuất
 */
export function logoutUser(): void {
  clearAuthSession();
}

/**
 * Yêu cầu gửi email đặt lại mật khẩu (Forgot Password)
 */
export async function forgotPassword(
  accountOrEmail: string
): Promise<{ success: boolean; message: string; email: string; reset_link?: string }> {
  const trimmed = accountOrEmail.trim();
  if (!trimmed) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  try {
    const res = await api.post<{ message: string; email: string; reset_link?: string }>(
      '/auth/forgot-password',
      { account_or_email: trimmed }
    );
    return {
      success: true,
      message: res.message,
      email: res.email,
      reset_link: res.reset_link,
    };
  } catch (err: unknown) {
    // Nếu backend trả về lỗi HTTP 404 hoặc 400, forward lỗi ngay
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      throw err;
    }

    // Smart Offline Fallback: Chỉ khi là LỖI MẠNG (status === 0 hoặc không có HTTP status)
    const isNetworkError =
      (err instanceof ApiError && err.status === 0) ||
      err instanceof TypeError ||
      (typeof err === 'object' && err !== null && 'status' in err && (err as { status: number }).status === 0);

    if (isNetworkError) {
      const { findAccountByIdentifier } = await import('./mockAuth');
      const mockAcc = findAccountByIdentifier(trimmed);
      if (!mockAcc) {
        throw new Error('ACCOUNT_NOT_FOUND');
      }
      return {
        success: true,
        message: `Liên kết đặt lại mật khẩu đã được gửi tới email ${mockAcc.user.email}! Vui lòng mở hộp thư Gmail của bạn và nhấn vào nút "Đặt lại mật khẩu" trong thư.`,
        email: mockAcc.user.email,
      };
    }

    throw err;
  }
}

/**
 * Đặt lại mật khẩu mới với token từ Email (Reset Password)
 */
export async function resetPassword(params: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const email = (params.email || '').trim();
  const token = (params.token || '').trim();
  const { newPassword } = params;

  // Nếu email hoặc token rỗng -> throw INVALID_RESET_LINK
  if (!email || !token) {
    throw new Error('INVALID_RESET_LINK');
  }

  // 1. Gọi BE POST /auth/reset-password TRƯỚC
  try {
    const res = await api.post<{ message: string }>('/auth/reset-password', {
      email,
      token,
      new_password: newPassword,
    });

    // BE thành công -> gọi mockAuth.resetPassword(email, newPassword) để đồng bộ bản mock vào localStorage
    try {
      const { resetPassword: mockReset } = await import('./mockAuth');
      await mockReset(email, newPassword);
    } catch (mockErr) {
      console.warn('Mock password sync fallback:', mockErr);
    }

    return {
      success: true,
      message: res?.message || 'RESET_SUCCESS',
    };
  } catch (beErr: unknown) {
    // BE trả lỗi HTTP (400/401/404/422/5xx) -> throw ngay để UI hiển thị, TUYỆT ĐỐI KHÔNG đụng mockAuth
    if (beErr instanceof ApiError && beErr.status > 0) {
      throw beErr;
    }

    // Smart Offline Fallback: Chỉ khi là LỖI MẠNG (status === 0 hoặc không có HTTP status)
    const isNetworkError =
      (beErr instanceof ApiError && beErr.status === 0) ||
      beErr instanceof TypeError ||
      (typeof beErr === 'object' && beErr !== null && 'status' in beErr && (beErr as { status: number }).status === 0);

    if (isNetworkError) {
      const { resetPassword: mockReset } = await import('./mockAuth');
      await mockReset(email, newPassword);
      return {
        success: true,
        message: 'RESET_SUCCESS',
      };
    }

    // Nếu là lỗi khác
    throw beErr;
  }
}

// Backward compatibility alias
export const resetPasswordService = resetPassword;
export const forgotPasswordService = forgotPassword;


