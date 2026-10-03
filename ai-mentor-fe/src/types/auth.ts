export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  classGroup?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
