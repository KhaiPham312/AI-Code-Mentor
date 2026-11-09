export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  classGroup?: string;
  department?: string;
  bio?: string;
  isActive?: boolean;
  status?: 'active' | 'locked';
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

