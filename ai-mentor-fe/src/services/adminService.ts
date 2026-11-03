import { apiClient } from './apiClient';
import { UserRole } from '../types/auth';

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
      // Fallback mock
      return {
        total_users: 3,
        total_students: 1,
        total_teachers: 1,
        total_admins: 1,
        total_exercises: 12,
        total_submissions: 42,
        passed_submissions: 38,
        overall_pass_rate: 90.5,
        security_incidents_count: 1,
        daily_activity: [
          { date: '25/10', submissions: 4 },
          { date: '26/10', submissions: 7 },
          { date: '27/10', submissions: 5 },
          { date: '28/10', submissions: 12 },
          { date: '29/10', submissions: 8 },
          { date: '30/10', submissions: 6 },
        ],
        top_languages: [
          { language: 'Python', count: 30 },
          { language: 'C++', count: 12 },
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
      return [
        {
          id: 1,
          username: 'student',
          email: 'student@hnue.edu.vn',
          name: 'Nguyễn Văn Minh (Sinh viên)',
          role: 'student',
          student_id: '725105001',
          class_group: 'K72 CNTT A',
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          username: 'teacher',
          email: 'teacher@hnue.edu.vn',
          name: 'TS. Phạm Văn Mười (Giảng viên)',
          role: 'teacher',
          class_group: 'Khoa Công nghệ Thông tin',
          is_active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          username: 'admin',
          email: 'admin@hnue.edu.vn',
          name: 'Quản trị viên Hệ thống (Admin)',
          role: 'admin',
          class_group: 'Phòng Quản trị Hệ thống',
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ];
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
    return await apiClient<AdminUserItem>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateUserRole(userId: number, role: UserRole): Promise<AdminUserItem> {
    return await apiClient<AdminUserItem>(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async updateUserStatus(userId: number, isActive: boolean): Promise<AdminUserItem> {
    return await apiClient<AdminUserItem>(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  async resetPassword(userId: number, newPassword: string = '123456'): Promise<{ message: string }> {
    return await apiClient<{ message: string }>(`/admin/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  },

  async deleteUser(userId: number): Promise<{ message: string }> {
    return await apiClient<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  async getSecurityLogs(): Promise<SecurityIncident[]> {
    try {
      return await apiClient<SecurityIncident[]>('/admin/security/logs');
    } catch {
      return [
        {
          id: 101,
          user_id: 1,
          username: 'student',
          user_name: 'Nguyễn Văn Minh',
          exercise_id: 1,
          exercise_title: 'Tìm hai số có tổng bằng S',
          language: 'python',
          source_code: 'import os\nprint(os.listdir("."))',
          error_message: "Vi phạm bảo mật: Module 'os' bị nghiêm cấm trong Sandbox.",
          submitted_at: new Date().toISOString(),
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
        system_prompt: 'Bạn là "AI Code Mentor" trong một hệ thống học lập trình...',
        api_key_configured: true,
      };
    }
  },

  async updateAIConfig(data: Partial<SystemAIConfigData>): Promise<SystemAIConfigData> {
    return await apiClient<SystemAIConfigData>('/admin/ai/config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
