import { User, UserRole } from '../types/auth';

const STORAGE_USERS_KEY = 'ai_mentor_users_db';
const LEGACY_STORAGE_USERS_KEY = 'ai_mentor_users_list';

export interface StoredAccount {
  user: User;
  password: string;
}

export function getCleanDisplayName(name: string): string {
  return (name || '').replace(/\s*\([^)]*\)/g, '').trim();
}

export function getFirstName(name: string): string {
  const clean = getCleanDisplayName(name);
  const parts = clean.split(' ').filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : clean;
}

export const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    password: '123456',
    user: {
      id: 'sv-725105001',
      name: 'Nguyễn Văn Minh',
      username: 'student',
      email: 'student@hnue.edu.vn',
      role: 'student',
      studentId: '725105001',
      classGroup: 'K72 CNTT A',
    },
  },
  {
    password: '123456',
    user: {
      id: 'gv-hnue-009',
      name: 'TS. Phạm Văn Khải',
      username: 'teacher',
      email: 'teacher@hnue.edu.vn',
      role: 'teacher',
      classGroup: 'Khoa Công nghệ Thông tin',
    },
  },
];

// Seed and retrieve accounts from localStorage with key 'ai_mentor_users_db'
export function getStoredAccounts(): StoredAccount[] {
  try {
    let raw = localStorage.getItem(STORAGE_USERS_KEY);
    // Migration: check legacy key if primary key doesn't exist
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_USERS_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(STORAGE_USERS_KEY, legacyRaw);
      }
    }

    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return [...DEFAULT_ACCOUNTS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return [...DEFAULT_ACCOUNTS];
    }
    // Sanitize user names from any legacy suffixes
    const sanitized = parsed.map((acc: StoredAccount) => ({
      ...acc,
      user: {
        ...acc.user,
        name: getCleanDisplayName(acc.user.name),
      },
    }));
    return sanitized;
  } catch {
    return [...DEFAULT_ACCOUNTS];
  }
}

export function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('Failed to save accounts to localStorage:', err);
  }
}

// Normalize email prefix into a clean username (no accents, only a-z0-9_)
export function generateBaseUsername(email: string): string {
  const rawPrefix = (email.split('@')[0] || 'user').toLowerCase();
  // Strip Vietnamese diacritics and special characters
  const clean = rawPrefix
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9_]/g, '')
    .trim();
  return clean.length >= 2 ? clean : 'user';
}

// Generate unique username with sequential suffix _1, _2, etc. if collision occurs
export function generateUniqueUsername(email: string): string {
  const base = generateBaseUsername(email);
  const accounts = getStoredAccounts();
  const existingUsernames = new Set(
    accounts.map((acc) => (acc.user.username || '').toLowerCase())
  );

  if (!existingUsernames.has(base)) {
    return base;
  }

  let counter = 1;
  while (existingUsernames.has(`${base}_${counter}`)) {
    counter++;
  }
  return `${base}_${counter}`;
}

// Check if username already exists (case-insensitive)
export function checkUsernameExists(username: string): boolean {
  const trimmed = username.trim().toLowerCase();
  const accounts = getStoredAccounts();
  return accounts.some((acc) => (acc.user.username || '').toLowerCase() === trimmed);
}

// Check if email already exists (case-insensitive)
export function checkEmailExists(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  return accounts.some((acc) => acc.user.email.toLowerCase() === trimmed);
}

// Register new user with auto-generated unique username
export async function mockRegister(
  fullName: string,
  email: string,
  password: string,
  role: UserRole = 'student',
  customUsername?: string
): Promise<{ token: string; user: User }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const trimmedEmail = email.trim().toLowerCase();

  if (checkEmailExists(trimmedEmail)) {
    throw new Error('Email này đã được đăng ký tài khoản!');
  }

  // Auto-generate username with suffix if not provided
  const finalUsername = customUsername?.trim().toLowerCase() || generateUniqueUsername(trimmedEmail);

  if (checkUsernameExists(finalUsername)) {
    throw new Error('Tên đăng nhập này đã tồn tại!');
  }

  const newUser: User = {
    id: `user-${Date.now().toString().slice(-6)}`,
    name: fullName.trim(),
    username: finalUsername,
    email: trimmedEmail,
    role: role,
    studentId: role === 'student' ? `SV${Math.floor(100000 + Math.random() * 900000)}` : undefined,
    classGroup: role === 'student' ? 'K72 CNTT' : 'Bộ môn Công nghệ Phần mềm',
  };

  const currentAccounts = getStoredAccounts();
  currentAccounts.push({ user: newUser, password });
  saveStoredAccounts(currentAccounts);

  return {
    token: `mock_jwt_token_${Date.now()}`,
    user: newUser,
  };
}

// Login with either username OR email
export async function mockLogin(
  identifier: string,
  password: string
): Promise<{ token: string; user: User }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const trimmed = identifier.trim().toLowerCase();
  const accounts = getStoredAccounts();

  const account = accounts.find(
    (acc) =>
      (acc.user.username || '').toLowerCase() === trimmed ||
      acc.user.email.toLowerCase() === trimmed
  );

  if (!account) {
    throw new Error('Tài khoản không tồn tại trên hệ thống!');
  }

  if (account.password !== password) {
    throw new Error('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
  }

  return {
    token: `mock_jwt_token_${Date.now()}`,
    user: account.user,
  };
}

export async function mockSSOLogin(): Promise<{ token: string; user: User }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const accounts = getStoredAccounts();
  const student = accounts.find((acc) => acc.user.role === 'student') || DEFAULT_ACCOUNTS[0];
  return {
    token: `sso_hnue_token_${Date.now()}`,
    user: student.user,
  };
}

// Change password service
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const accounts = getStoredAccounts();
  const accIndex = accounts.findIndex((a) => a.user.id === userId);
  if (accIndex === -1) {
    throw new Error('Không tìm thấy thông tin người dùng trên hệ thống!');
  }
  if (accounts[accIndex].password !== currentPassword) {
    throw new Error('Mật khẩu hiện tại không chính xác!');
  }
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự!');
  }
  accounts[accIndex].password = newPassword;
  saveStoredAccounts(accounts);
  return { success: true, message: 'Đổi mật khẩu thành công!' };
}

// Find account by either username or email (case-insensitive)
export function findAccountByIdentifier(identifier: string): StoredAccount | null {
  const trimmed = identifier.trim().toLowerCase();
  if (!trimmed) return null;
  const accounts = getStoredAccounts();
  const found = accounts.find(
    (acc) =>
      (acc.user.username || '').toLowerCase() === trimmed ||
      acc.user.email.toLowerCase() === trimmed
  );
  return found || null;
}

// Reset password for Forgot Password flow
export async function resetPassword(
  accountOrEmail: string,
  newPassword: string
): Promise<{ success: boolean; message: string; user: User }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const trimmed = accountOrEmail.trim().toLowerCase();
  if (!trimmed) {
    throw new Error('Vui lòng cung cấp email hoặc tên đăng nhập!');
  }
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có tối thiểu 6 ký tự!');
  }

  const accounts = getStoredAccounts();
  const accIndex = accounts.findIndex(
    (acc) =>
      (acc.user.username || '').toLowerCase() === trimmed ||
      acc.user.email.toLowerCase() === trimmed
  );

  if (accIndex === -1) {
    throw new Error('Không tìm thấy tài khoản với email hoặc tên đăng nhập này!');
  }

  // Update password in DB - replaces old password completely
  accounts[accIndex].password = newPassword;
  saveStoredAccounts(accounts);

  return {
    success: true,
    message: 'Đặt lại mật khẩu thành công!',
    user: accounts[accIndex].user,
  };
}

// Backward compatibility helper
export const MOCK_ACCOUNTS: Record<string, { password: string; user: User }> = {
  student: DEFAULT_ACCOUNTS[0],
  teacher: DEFAULT_ACCOUNTS[1],
  'student@hnue.edu.vn': DEFAULT_ACCOUNTS[0],
  'teacher@hnue.edu.vn': DEFAULT_ACCOUNTS[1],
};

