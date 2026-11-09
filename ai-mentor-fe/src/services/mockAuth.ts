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
      isActive: true,
      status: 'active',
      createdAt: '2026-09-01T08:00:00.000Z',
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
      department: 'Khoa Công nghệ Thông tin',
      isActive: true,
      status: 'active',
      createdAt: '2026-08-15T09:00:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'adm-hnue-001',
      name: 'Quản trị viên Hệ thống',
      username: 'admin',
      email: 'admin@hnue.edu.vn',
      role: 'admin',
      classGroup: 'Phòng Quản trị Hệ thống',
      department: 'Khoa Công nghệ Thông tin',
      isActive: true,
      status: 'active',
      createdAt: '2026-08-01T07:30:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105012',
      name: 'Lê Thủy Tiên',
      username: 'tien_le',
      email: 'tien.lt@hnue.edu.vn',
      role: 'student',
      studentId: '725105012',
      classGroup: 'K72 CNTT A',
      isActive: true,
      status: 'active',
      createdAt: '2026-09-02T10:15:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105023',
      name: 'Trần Duy Anh',
      username: 'duyanh_tran',
      email: 'anh.td@hnue.edu.vn',
      role: 'student',
      studentId: '725105023',
      classGroup: 'K72 CNTT B',
      isActive: true,
      status: 'active',
      createdAt: '2026-09-02T11:00:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105034',
      name: 'Phạm Hoàng Long',
      username: 'long_pham',
      email: 'long.ph@hnue.edu.vn',
      role: 'student',
      studentId: '725105034',
      classGroup: 'K71 CNTT A',
      isActive: true,
      status: 'active',
      createdAt: '2026-09-03T14:20:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105045',
      name: 'Vũ Hương Ly',
      username: 'ly_vu',
      email: 'ly.vh@hnue.edu.vn',
      role: 'student',
      studentId: '725105045',
      classGroup: 'K72 CNTT B',
      isActive: true,
      status: 'active',
      createdAt: '2026-09-03T16:00:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105056',
      name: 'Đặng Minh Tuấn',
      username: 'tuan_dang',
      email: 'tuan.dm@hnue.edu.vn',
      role: 'student',
      studentId: '725105056',
      classGroup: 'K71 CNTT B',
      isActive: true,
      status: 'active',
      createdAt: '2026-09-04T08:45:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105067',
      name: 'Bùi Phương Thảo',
      username: 'thao_bui',
      email: 'thao.bp@hnue.edu.vn',
      role: 'student',
      studentId: '725105067',
      classGroup: 'K73 CNTT A',
      isActive: true,
      status: 'active',
      createdAt: '2026-09-04T09:30:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'sv-725105078',
      name: 'Ngô Quang Huy',
      username: 'huy_ngo',
      email: 'huy.nq@hnue.edu.vn',
      role: 'student',
      studentId: '725105078',
      classGroup: 'K72 CNTT A',
      isActive: false,
      status: 'locked',
      createdAt: '2026-09-05T13:10:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'gv-hnue-015',
      name: 'PGS. TS. Trần Thành Nam',
      username: 'nam_tran',
      email: 'nam.tt@hnue.edu.vn',
      role: 'teacher',
      classGroup: 'Khoa Công nghệ Thông tin',
      department: 'Bộ môn Khoa học Máy tính',
      isActive: true,
      status: 'active',
      createdAt: '2026-08-20T08:30:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'gv-hnue-022',
      name: 'ThS. Nguyễn Thị Mai Anh',
      username: 'maianh_nguyen',
      email: 'anh.ntm@hnue.edu.vn',
      role: 'teacher',
      classGroup: 'Khoa Công nghệ Thông tin',
      department: 'Bộ môn Hệ thống Thông tin',
      isActive: true,
      status: 'active',
      createdAt: '2026-08-22T10:00:00.000Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'adm-hnue-002',
      name: 'Kỹ sư An toàn Mạng',
      username: 'sec_admin',
      email: 'security@hnue.edu.vn',
      role: 'admin',
      classGroup: 'Trung tâm CNTT',
      department: 'Đội Ứng cứu Sự cố',
      isActive: true,
      status: 'active',
      createdAt: '2026-08-10T14:00:00.000Z',
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
    // Sanitize user names from any legacy suffixes and ensure status/isActive consistency
    const sanitized: StoredAccount[] = parsed.map((acc: StoredAccount) => {
      const cleanName = getCleanDisplayName(acc.user.name);
      const isLocked = acc.user.status === 'locked' || acc.user.isActive === false;
      return {
        ...acc,
        user: {
          ...acc.user,
          name: cleanName,
          status: isLocked ? 'locked' : 'active',
          isActive: !isLocked,
        },
      };
    });

    // Ensure default core accounts (student, teacher, admin) and baseline users exist
    let updated = false;
    for (const defAcc of DEFAULT_ACCOUNTS) {
      const defUsername = (defAcc.user.username || '').toLowerCase();
      const defEmail = defAcc.user.email.toLowerCase();
      const exists = sanitized.some(
        (a: StoredAccount) =>
          (a.user.username || '').toLowerCase() === defUsername ||
          a.user.email.toLowerCase() === defEmail
      );
      if (!exists) {
        sanitized.push(defAcc);
        updated = true;
      }
    }
    if (updated) {
      saveStoredAccounts(sanitized);
    }

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

// Register new user with auto-generated unique username - always defaults to student
export async function mockRegister(
  fullName: string,
  email: string,
  password: string,
  _role: UserRole = 'student',
  customUsername?: string
): Promise<{ token: string; user: User }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const trimmedEmail = email.trim().toLowerCase();

  if (checkEmailExists(trimmedEmail)) {
    throw new Error('Email này đã được đăng ký tài khoản!');
  }

  // Auto-generate username with suffix if not provided
  const finalUsername = customUsername?.trim().toLowerCase() || generateUniqueUsername(trimmedEmail);

  if (checkUsernameExists(finalUsername)) {
    throw new Error('Tên đăng nhập này đã tồn tại!');
  }

  const cleanName = getCleanDisplayName(fullName);
  // Registration is strictly 'student'
  const assignedRole: UserRole = 'student';

  const newUser: User = {
    id: `user-${Date.now().toString().slice(-6)}`,
    name: cleanName,
    username: finalUsername,
    email: trimmedEmail,
    role: assignedRole,
    studentId: `SV${Math.floor(100000 + Math.random() * 900000)}`,
    classGroup: 'K72 CNTT A',
    isActive: true,
    status: 'active',
    createdAt: new Date().toISOString(),
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
  await new Promise((resolve) => setTimeout(resolve, 300));

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

  // Check if account is locked
  if (account.user.status === 'locked' || account.user.isActive === false) {
    throw new Error('ACCOUNT_LOCKED');
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  const accounts = getStoredAccounts();
  const student = accounts.find((acc) => acc.user.role === 'student' && acc.user.status !== 'locked') || DEFAULT_ACCOUNTS[0];
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
  await new Promise((resolve) => setTimeout(resolve, 300));
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
  await new Promise((resolve) => setTimeout(resolve, 300));
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

// ================= ADMIN MANAGEMENT FUNCTIONS (100% PERSISTENT TO LOCALSTORAGE) =================

export function getAllAccounts(): StoredAccount[] {
  return getStoredAccounts();
}

export function updateAccountRole(
  accountIdOrEmail: string | number,
  newRole: UserRole
): boolean {
  const accounts = getStoredAccounts();
  const target = String(accountIdOrEmail).trim().toLowerCase();
  const accIndex = accounts.findIndex(
    (acc) =>
      String(acc.user.id).toLowerCase() === target ||
      (acc.user.username || '').toLowerCase() === target ||
      acc.user.email.toLowerCase() === target
  );

  if (accIndex === -1) return false;

  accounts[accIndex].user.role = newRole;
  saveStoredAccounts(accounts);

  // If the updated user is currently logged in, sync session in localStorage
  try {
    const rawCurr = localStorage.getItem('ai_mentor_user');
    if (rawCurr) {
      const curr = JSON.parse(rawCurr);
      if (
        String(curr.id).toLowerCase() === target ||
        (curr.username || '').toLowerCase() === target ||
        curr.email?.toLowerCase() === target
      ) {
        curr.role = newRole;
        localStorage.setItem('ai_mentor_user', JSON.stringify(curr));
      }
    }
  } catch {
    // ignore
  }

  return true;
}

export function toggleAccountStatus(
  accountIdOrEmail: string | number
): 'active' | 'locked' {
  const accounts = getStoredAccounts();
  const target = String(accountIdOrEmail).trim().toLowerCase();
  const accIndex = accounts.findIndex(
    (acc) =>
      String(acc.user.id).toLowerCase() === target ||
      (acc.user.username || '').toLowerCase() === target ||
      acc.user.email.toLowerCase() === target
  );

  if (accIndex === -1) return 'active';

  const currentStatus = accounts[accIndex].user.status || (accounts[accIndex].user.isActive === false ? 'locked' : 'active');
  const newStatus: 'active' | 'locked' = currentStatus === 'active' ? 'locked' : 'active';

  accounts[accIndex].user.status = newStatus;
  accounts[accIndex].user.isActive = newStatus === 'active';
  saveStoredAccounts(accounts);

  return newStatus;
}

export function adminCreateAccount(data: {
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  studentId?: string;
  classGroup?: string;
  department?: string;
  status?: 'active' | 'locked';
}): StoredAccount {
  const trimmedEmail = data.email.trim().toLowerCase();
  if (checkEmailExists(trimmedEmail)) {
    throw new Error('Email này đã tồn tại trên hệ thống!');
  }
  const cleanName = getCleanDisplayName(data.name);
  const username = data.username?.trim().toLowerCase() || generateUniqueUsername(trimmedEmail);

  if (checkUsernameExists(username)) {
    throw new Error('Tên đăng nhập này đã tồn tại!');
  }

  const isLocked = data.status === 'locked';

  const newAcc: StoredAccount = {
    password: data.password || '123456',
    user: {
      id: `user-${Date.now().toString().slice(-6)}`,
      name: cleanName,
      username,
      email: trimmedEmail,
      role: data.role,
      studentId: data.studentId || (data.role === 'student' ? `SV${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      classGroup: data.classGroup || (data.role === 'student' ? 'K72 CNTT A' : 'Khoa Công nghệ Thông tin'),
      department: data.department || (data.role === 'teacher' ? 'Khoa Công nghệ Thông tin' : undefined),
      isActive: !isLocked,
      status: isLocked ? 'locked' : 'active',
      createdAt: new Date().toISOString(),
    },
  };

  const accounts = getStoredAccounts();
  accounts.push(newAcc);
  saveStoredAccounts(accounts);
  return newAcc;
}

export function adminResetPassword(
  accountIdOrEmail: string | number,
  newPassword: string = '123456'
): boolean {
  const accounts = getStoredAccounts();
  const target = String(accountIdOrEmail).trim().toLowerCase();
  const accIndex = accounts.findIndex(
    (acc) =>
      String(acc.user.id).toLowerCase() === target ||
      (acc.user.username || '').toLowerCase() === target ||
      acc.user.email.toLowerCase() === target
  );

  if (accIndex === -1) return false;

  accounts[accIndex].password = newPassword;
  saveStoredAccounts(accounts);
  return true;
}

export function adminDeleteAccount(
  accountIdOrEmail: string | number
): boolean {
  const accounts = getStoredAccounts();
  const target = String(accountIdOrEmail).trim().toLowerCase();
  const acc = accounts.find(
    (a) =>
      String(a.user.id).toLowerCase() === target ||
      (a.user.username || '').toLowerCase() === target ||
      a.user.email.toLowerCase() === target
  );

  if (!acc) return false;

  // Protect default admin from deletion
  if (acc.user.username === 'admin' || acc.user.email === 'admin@hnue.edu.vn') {
    throw new Error('Không thể xóa tài khoản Quản trị viên mặc định!');
  }

  const remaining = accounts.filter((a) => a !== acc);
  saveStoredAccounts(remaining);
  return true;
}

// Backward compatibility helper
export const MOCK_ACCOUNTS: Record<string, { password: string; user: User }> = {
  student: DEFAULT_ACCOUNTS[0],
  teacher: DEFAULT_ACCOUNTS[1],
  admin: DEFAULT_ACCOUNTS[2],
  'student@hnue.edu.vn': DEFAULT_ACCOUNTS[0],
  'teacher@hnue.edu.vn': DEFAULT_ACCOUNTS[1],
  'admin@hnue.edu.vn': DEFAULT_ACCOUNTS[2],
};
