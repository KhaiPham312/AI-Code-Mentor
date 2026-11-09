import { apiClient } from './apiClient';
import { UserRole } from '../types/auth';
import {
  getAllAccounts,
  updateAccountRole as mockUpdateRole,
  toggleAccountStatus as mockToggleStatus,
  adminCreateAccount as mockCreateAccount,
  adminResetPassword as mockResetPass,
  adminDeleteAccount as mockDeleteAcc,
  getCleanDisplayName,
} from './mockAuth';

export interface AdminUserItem {
  id: number;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  student_id?: string;
  class_group?: string;
  is_active: boolean;
  created_at?: string;
}

export interface SecurityIncident {
  id: number;
  user_id: number;
  username: string;
  user_name: string;
  exercise_id: number;
  exercise_title: string;
  language: string;
  source_code: string;
  error_message: string;
  submitted_at: string;
}

export interface SystemAIConfigData {
  provider: string;
  model_name: string;
  temperature: number;
  max_tokens: number;
  daily_quota_per_student: number;
  rate_limit_per_minute: number;
  system_prompt: string;
  api_key_configured: boolean;
  socratic_guardrail?: boolean;
}

export interface PlatformAnalyticsData {
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_admins: number;
  total_exercises: number;
  total_submissions: number;
  passed_submissions: number;
  overall_pass_rate: number;
  security_incidents_count: number;
  daily_activity: Array<{ date: string; submissions: number }>;
  top_languages: Array<{ language: string; count: number }>;
}

export const adminService = {
  async getAnalytics(): Promise<PlatformAnalyticsData> {
    try {
      return await apiClient<PlatformAnalyticsData>('/admin/analytics');
    } catch {
      const accounts = getAllAccounts();
      const total_users = accounts.length;
      const total_students = accounts.filter((a) => a.user.role === 'student').length;
      const total_teachers = accounts.filter((a) => a.user.role === 'teacher').length;
      const total_admins = accounts.filter((a) => a.user.role === 'admin').length;
      return {
        total_users,
        total_students,
        total_teachers,
        total_admins,
        total_exercises: 75,
        total_submissions: 184,
        passed_submissions: 156,
        overall_pass_rate: 84.8,
        security_incidents_count: 2,
        daily_activity: [
          { date: '01/11', submissions: 18 },
          { date: '02/11', submissions: 24 },
          { date: '03/11', submissions: 31 },
          { date: '04/11', submissions: 29 },
          { date: '05/11', submissions: 42 },
          { date: '06/11', submissions: 40 },
        ],
        top_languages: [
          { language: 'Python', count: 85 },
          { language: 'C++', count: 48 },
          { language: 'Java', count: 28 },
          { language: 'SQL', count: 23 },
        ],
      };
    }
  },

  async getUsers(search?: string, role?: string): Promise<AdminUserItem[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      const q = params.toString() ? `?${params.toString()}` : '';
      return await apiClient<AdminUserItem[]>(`/admin/users${q}`);
    } catch {
      const accounts = getAllAccounts();
      let list: AdminUserItem[] = accounts.map((acc, idx) => ({
        id: idx + 1,
        username: acc.user.username || acc.user.email.split('@')[0],
        email: acc.user.email,
        name: getCleanDisplayName(acc.user.name),
        role: acc.user.role,
        student_id: acc.user.studentId,
        class_group: acc.user.classGroup || acc.user.department,
        is_active: acc.user.status !== 'locked' && acc.user.isActive !== false,
        created_at: acc.user.createdAt || '2026-09-01T08:00:00.000Z',
      }));

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            u.username.toLowerCase().includes(s) ||
            (u.student_id && u.student_id.toLowerCase().includes(s))
        );
      }

      if (role && role !== 'all') {
        list = list.filter((u) => u.role === role);
      }

      return list;
    }
  },

  async createUser(data: {
    username: string;
    email: string;
    name: string;
    role: UserRole;
    password?: string;
    student_id?: string;
    class_group?: string;
  }): Promise<AdminUserItem> {
    try {
      return await apiClient<AdminUserItem>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const stored = mockCreateAccount({
        name: data.name,
        email: data.email,
        username: data.username,
        role: data.role,
        password: data.password,
        studentId: data.student_id,
        classGroup: data.class_group,
        status: 'active',
      });
      return {
        id: Date.now(),
        username: stored.user.username || data.username,
        email: stored.user.email,
        name: stored.user.name,
        role: stored.user.role,
        student_id: stored.user.studentId,
        class_group: stored.user.classGroup,
        is_active: true,
        created_at: stored.user.createdAt,
      };
    }
  },

  async updateUserRole(userId: number, role: UserRole, userEmailOrUsername?: string): Promise<AdminUserItem> {
    try {
      return await apiClient<AdminUserItem>(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    } catch {
      if (userEmailOrUsername) {
        mockUpdateRole(userEmailOrUsername, role);
      } else {
        const accounts = getAllAccounts();
        const acc = accounts[userId - 1];
        if (acc) mockUpdateRole(acc.user.email, role);
      }
      return {
        id: userId,
        username: userEmailOrUsername || '',
        email: userEmailOrUsername || '',
        name: '',
        role,
        is_active: true,
      };
    }
  },

  async updateUserStatus(userId: number, isActive: boolean, userEmailOrUsername?: string): Promise<AdminUserItem> {
    try {
      return await apiClient<AdminUserItem>(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: isActive }),
      });
    } catch {
      if (userEmailOrUsername) {
        mockToggleStatus(userEmailOrUsername);
      } else {
        const accounts = getAllAccounts();
        const acc = accounts[userId - 1];
        if (acc) mockToggleStatus(acc.user.email);
      }
      return {
        id: userId,
        username: userEmailOrUsername || '',
        email: userEmailOrUsername || '',
        name: '',
        role: 'student',
        is_active: isActive,
      };
    }
  },

  async resetPassword(userId: number, newPassword: string = '123456', userEmailOrUsername?: string): Promise<{ message: string }> {
    try {
      return await apiClient<{ message: string }>(`/admin/users/${userId}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ new_password: newPassword }),
      });
    } catch {
      if (userEmailOrUsername) {
        mockResetPass(userEmailOrUsername, newPassword);
      } else {
        const accounts = getAllAccounts();
        const acc = accounts[userId - 1];
        if (acc) mockResetPass(acc.user.email, newPassword);
      }
      return { message: 'Đặt lại mật khẩu thành công!' };
    }
  },

  async deleteUser(userId: number, userEmailOrUsername?: string): Promise<{ message: string }> {
    try {
      return await apiClient<{ message: string }>(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
    } catch {
      if (userEmailOrUsername) {
        mockDeleteAcc(userEmailOrUsername);
      } else {
        const accounts = getAllAccounts();
        const acc = accounts[userId - 1];
        if (acc) mockDeleteAcc(acc.user.email);
      }
      return { message: 'Đã xóa tài khoản thành công!' };
    }
  },

  async getSecurityLogs(): Promise<SecurityIncident[]> {
    try {
      return await apiClient<SecurityIncident[]>('/admin/security/logs');
    } catch {
      return [
        {
          id: 101,
          user_id: 10,
          username: 'huy_ngo',
          user_name: 'Ngô Quang Huy',
          exercise_id: 1,
          exercise_title: 'Tìm hai số có tổng bằng S',
          language: 'python',
          source_code: 'import os\nprint(os.system("rm -rf /"))',
          error_message: "Vi phạm an ninh: Module 'os' bị nghiêm cấm trong Docker Sandbox.",
          submitted_at: '2026-11-06T14:22:10.000Z',
        },
        {
          id: 102,
          user_id: 5,
          username: 'duyanh_tran',
          user_name: 'Trần Duy Anh',
          exercise_id: 4,
          exercise_title: 'Dãy con tăng dài nhất (LIS)',
          language: 'cpp',
          source_code: 'while(true) { malloc(1024 * 1024); }',
          error_message: 'Cảnh báo tài nguyên: Vượt ngưỡng bộ nhớ cho phép (Memory Limit > 128MB).',
          submitted_at: '2026-11-06T15:05:40.000Z',
        },
      ];
    }
  },

  async getAIConfig(): Promise<SystemAIConfigData> {
    try {
      return await apiClient<SystemAIConfigData>('/admin/ai/config');
    } catch {
      return {
        provider: 'google_gemini',
        model_name: 'gemini-2.5-flash',
        temperature: 0.4,
        max_tokens: 1000,
        daily_quota_per_student: 30,
        rate_limit_per_minute: 5,
        system_prompt: 'Bạn là "AI Code Mentor" trong một hệ thống học lập trình sư phạm...',
        api_key_configured: true,
        socratic_guardrail: true,
      };
    }
  },

  async updateAIConfig(data: Partial<SystemAIConfigData>): Promise<SystemAIConfigData> {
    try {
      return await apiClient<SystemAIConfigData>('/admin/ai/config', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      return {
        provider: 'google_gemini',
        model_name: data.model_name || 'gemini-2.5-flash',
        temperature: data.temperature ?? 0.4,
        max_tokens: data.max_tokens ?? 1000,
        daily_quota_per_student: data.daily_quota_per_student ?? 30,
        rate_limit_per_minute: data.rate_limit_per_minute ?? 5,
        system_prompt: data.system_prompt || 'Bạn là "AI Code Mentor" trong một hệ thống học lập trình sư phạm...',
        api_key_configured: true,
        socratic_guardrail: data.socratic_guardrail ?? true,
      };
    }
  },
};
