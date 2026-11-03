import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole } from '../../types/auth';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  adminService,
  AdminUserItem,
  SecurityIncident,
  SystemAIConfigData,
  PlatformAnalyticsData,
} from '../../services/adminService';
import {
  Users,
  ShieldAlert,
  Cpu,
  BarChart3,
  Search,
  Plus,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  CheckCircle2,
  Bot,
  LogOut,
  Sun,
  Moon,
  Code2,
  X,
  FileCode,
  Sparkles,
  Server,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onLogout: () => void;
  onNavigateView: (view: 'dashboard' | 'teacher' | 'ide') => void;
}

type AdminTab = 'users' | 'security' | 'ai' | 'analytics';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  onLogout,
  onNavigateView,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Users state
  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  // Create User Form
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    name: '',
    role: 'student' as UserRole,
    password: '123456',
    student_id: '',
    class_group: '',
  });

  // Security Logs
  const [securityLogs, setSecurityLogs] = useState<SecurityIncident[]>([]);

  // AI Config
  const [aiConfig, setAiConfig] = useState<SystemAIConfigData | null>(null);
  const [savingAI, setSavingAI] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<PlatformAnalyticsData | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [u, sec, ai, an] = await Promise.all([
        adminService.getUsers(),
        adminService.getSecurityLogs(),
        adminService.getAIConfig(),
        adminService.getAnalytics(),
      ]);
      setUsersList(u);
      setSecurityLogs(sec);
      setAiConfig(ai);
      setAnalytics(an);
    } catch {
      showToast('Có lỗi xảy ra khi tải dữ liệu từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.student_id && u.student_id.toLowerCase().includes(userSearch.toLowerCase()));

      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.is_active) ||
        (statusFilter === 'inactive' && !u.is_active);

      return matchSearch && matchRole && matchStatus;
    });
  }, [usersList, userSearch, roleFilter, statusFilter]);

  // Handlers for User Actions
  const handleToggleStatus = async (targetUser: AdminUserItem) => {
    try {
      const updated = await adminService.updateUserStatus(targetUser.id, !targetUser.is_active);
      setUsersList((prev) => prev.map((u) => (u.id === targetUser.id ? updated : u)));
      showToast(
        `Đã ${updated.is_active ? 'mở khóa' : 'khóa'} tài khoản ${targetUser.username} thành công!`
      );
    } catch {
      showToast('Không thể thay đổi trạng thái tài khoản.');
    }
  };

  const handleChangeRole = async (targetUser: AdminUserItem, newRole: UserRole) => {
    try {
      const updated = await adminService.updateUserRole(targetUser.id, newRole);
      setUsersList((prev) => prev.map((u) => (u.id === targetUser.id ? updated : u)));
      showToast(`Đã chuyển đổi vai trò của ${targetUser.username} sang ${newRole}!`);
    } catch {
      showToast('Không thể đổi vai trò.');
    }
  };

  const handleResetPassword = async (targetUser: AdminUserItem) => {
    if (confirm(`Bạn có chắc muốn đặt lại mật khẩu của ${targetUser.username} về mặc định (123456)?`)) {
      try {
        await adminService.resetPassword(targetUser.id, '123456');
        showToast(`Đã đặt lại mật khẩu của ${targetUser.username} về 123456.`);
      } catch {
        showToast('Không thể đặt lại mật khẩu.');
      }
    }
  };

  const handleDeleteUser = async (targetUser: AdminUserItem) => {
    if (confirm(`CẢNH BÁO: Xóa người dùng ${targetUser.username} sẽ xóa toàn bộ bài nộp và dữ liệu liên quan. Bạn có chắc không?`)) {
      try {
        await adminService.deleteUser(targetUser.id);
        setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
        showToast(`Đã xóa vĩnh viễn tài khoản ${targetUser.username}.`);
      } catch {
        showToast('Không thể xóa người dùng.');
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.email || !newUserData.name) {
      alert('Vui lòng điền đủ các trường bắt buộc');
      return;
    }
    try {
      const created = await adminService.createUser(newUserData);
      setUsersList((prev) => [...prev, created]);
      setIsCreateUserOpen(false);
      setNewUserData({
        username: '',
        email: '',
        name: '',
        role: 'student',
        password: '123456',
        student_id: '',
        class_group: '',
      });
      showToast(`Đã thêm mới tài khoản ${created.username} thành công!`);
    } catch {
      alert('Không thể tạo tài khoản. Vui lòng kiểm tra trùng tên đăng nhập hoặc email.');
    }
  };

  // AI Config Save
  const handleSaveAIConfig = async () => {
    if (!aiConfig) return;
    setSavingAI(true);
    try {
      const updated = await adminService.updateAIConfig(aiConfig);
      setAiConfig(updated);
      showToast('Đã lưu cấu hình AI toàn hệ thống thành công!');
    } catch {
      showToast('Lỗi khi lưu cấu hình AI.');
    } finally {
      setSavingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-slate-950" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  AI Code Mentor
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hệ thống Quản trị Tối cao & Giám sát An ninh Toàn trường
              </p>
            </div>
          </div>
        </div>

        {/* View Switchers & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateView('dashboard')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Xem giao diện học sinh"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Góc nhìn Học sinh</span>
          </button>

          <button
            onClick={() => onNavigateView('teacher')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Xem giao diện giảng viên"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Góc nhìn Giảng viên</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(currentLang === 'vie' ? 'eng' : 'vie')}
            className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Đổi ngôn ngữ giao diện"
          >
            {currentLang.toUpperCase()}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Đổi giao diện Sáng / Tối"
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400">Super Administrator</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Người dùng & Phân quyền</span>
            <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>An ninh & Sandbox</span>
            {securityLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                {securityLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Tầng AI & Quản trị Model</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống kê Toàn trường</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* ============================================================== */}
        {/* TAB 1: USERS & PERMISSIONS */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Top Stat Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500">Tổng tài khoản</div>
                <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
                  {usersList.length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500">Sinh viên (Students)</div>
                <div className="text-2xl font-black mt-1 text-indigo-600 dark:text-indigo-400">
                  {usersList.filter((u) => u.role === 'student').length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500">Giảng viên (Teachers)</div>
                <div className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
                  {usersList.filter((u) => u.role === 'teacher').length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500">Quản trị viên (Admins)</div>
                <div className="text-2xl font-black mt-1 text-rose-600 dark:text-rose-400">
                  {usersList.filter((u) => u.role === 'admin').length}
                </div>
              </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, email, username, mã SV..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="student">Chỉ Sinh viên</option>
                  <option value="teacher">Chỉ Giảng viên</option>
                  <option value="admin">Chỉ Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Đã bị khóa</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Làm mới danh sách"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsCreateUserOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm người dùng</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Người dùng</th>
                      <th className="px-6 py-3.5">Vai trò (Role)</th>
                      <th className="px-6 py-3.5">Mã SV / Đơn vị</th>
                      <th className="px-6 py-3.5">Trạng thái</th>
                      <th className="px-6 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                          Không tìm thấy người dùng nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-white">
                                  {u.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  @{u.username} • {u.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer ${
                                u.role === 'admin'
                                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                                  : u.role === 'teacher'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
                              }`}
                            >
                              <option value="student">Student (Học viên)</option>
                              <option value="teacher">Teacher (Giảng viên)</option>
                              <option value="admin">Admin (Quản trị viên)</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {u.student_id ? (
                              <div>Mã SV: {u.student_id}</div>
                            ) : (
                              <div>{u.class_group || 'Chưa gán'}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                u.is_active
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              {u.is_active ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleStatus(u)}
                                className={`p-1.5 rounded-md text-xs font-medium transition ${
                                  u.is_active
                                    ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                    : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                }`}
                                title={u.is_active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              >
                                {u.is_active ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleResetPassword(u)}
                                className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
                                title="Đặt lại mật khẩu về 123456"
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition"
                                title="Xóa tài khoản"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SECURITY & SANDBOX INCIDENT LOGS */}
        {/* ============================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Sandbox Config Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Giới hạn CPU Time
                  </div>
                  <div className="text-2xl font-bold mt-1">2.0 Giây</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Áp dụng <code className="text-indigo-400">resource.setrlimit</code> tự động ngắt
                    tiến trình vô hạn.
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Giới hạn Bộ nhớ (RAM)
                  </div>
                  <div className="text-2xl font-bold mt-1">256 Megabytes</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Ngăn chặn tấn công cạn kiệt RAM và cấp phát mảng vượt ngưỡng.
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    AST Static Sanitizer
                  </div>
                  <div className="text-2xl font-bold mt-1 text-rose-500">27 Thư viện cấm</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Chặn tuyệt đối <code className="text-rose-400">os, subprocess, socket</code> trước
                    khi chạy.
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Logs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <span>Nhật ký Vi phạm An ninh Sandbox (Security Incident Logs)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ghi nhận các trường hợp mã nguồn người dùng chứa hành vi nguy hiểm bị hệ thống phát hiện và chặn lại.
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Làm mới</span>
                </button>
              </div>

              {securityLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <div className="font-semibold text-slate-700 dark:text-slate-200">
                    Hệ thống an toàn tuyệt đối
                  </div>
                  <div className="text-xs text-slate-500">
                    Chưa phát hiện hành vi tấn công hay mã độc xâm hại Sandbox nào.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {securityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            CHẶN BẢO MẬT
                          </span>
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">
                            {log.user_name} (@{log.username})
                          </span>
                          <span className="text-xs text-slate-400">• Bài: {log.exercise_title}</span>
                        </div>
                        <div className="text-xs font-mono text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded inline-block">
                          {log.error_message}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Thời gian: {new Date(log.submitted_at).toLocaleString('vi-VN')}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedIncident(log)}
                        className="self-start md:self-center flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium rounded-lg transition"
                      >
                        <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Xem mã vi phạm</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AI GOVERNANCE & MODEL SWITCHER */}
        {/* ============================================================== */}
        {activeTab === 'ai' && aiConfig && (
          <div className="space-y-6">
            {/* Model Selection Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <Bot className="w-5 h-5 text-violet-500" />
                <span>Cấu hình Nhà cung cấp & Mô hình AI (Strategy Pattern Switcher)</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Chuyển đổi linh hoạt giữa các nhà cung cấp AI đám mây thương mại và mô hình mã nguồn mở nội bộ.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Option 1: Gemini Flash */}
                <div
                  onClick={() =>
                    setAiConfig({
                      ...aiConfig,
                      provider: 'google_gemini',
                      model_name: 'gemini-2.5-flash',
                    })
                  }
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    aiConfig.model_name.includes('flash')
                      ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">Google Gemini 2.5 Flash</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                      Tối ưu chi phí
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Phản hồi siêu tốc (dưới 1s), độ trễ thấp, phù hợp lớp học đông sinh viên.
                  </p>
                </div>

                {/* Option 2: Gemini Pro */}
                <div
                  onClick={() =>
                    setAiConfig({
                      ...aiConfig,
                      provider: 'google_gemini',
                      model_name: 'gemini-1.5-pro',
                    })
                  }
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    aiConfig.model_name.includes('pro')
                      ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">Google Gemini 1.5 Pro</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                      Độ chính xác cao
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tư duy thuật toán sâu sắc, suy luận giải thuật phức tạp xuất sắc.
                  </p>
                </div>

                {/* Option 3: Local LLM */}
                <div
                  onClick={() =>
                    setAiConfig({
                      ...aiConfig,
                      provider: 'local_ollama',
                      model_name: 'qwen2.5-coder-7b-local',
                    })
                  }
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    aiConfig.provider === 'local_ollama'
                      ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">Local LLM (Qwen2.5-Coder)</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
                      Nội bộ 100%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Chạy độc lập trên máy chủ GPU trường qua Ollama / vLLM, bảo mật dữ liệu sinh viên.
                  </p>
                </div>
              </div>

              {/* Sliders & Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Hạn mức câu hỏi sinh viên (Daily Quota):{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {aiConfig.daily_quota_per_student} câu/ngày
                    </span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={aiConfig.daily_quota_per_student}
                    onChange={(e) =>
                      setAiConfig({ ...aiConfig, daily_quota_per_student: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>10 câu</span>
                    <span>50 câu</span>
                    <span>100 câu</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Giới hạn tần suất gọi (Rate Limit):{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {aiConfig.rate_limit_per_minute} lần/phút
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={aiConfig.rate_limit_per_minute}
                    onChange={(e) =>
                      setAiConfig({ ...aiConfig, rate_limit_per_minute: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 lần/phút</span>
                    <span>5 lần/phút</span>
                    <span>15 lần/phút</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Socratic System Prompt Editor */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>System Prompt Socratic Toàn Cục (Pedagogical Prompt Template)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cốt lõi sư phạm ngăn chặn AI đưa ra lời giải hoàn chỉnh và buộc AI đặt câu hỏi gợi mở.
                  </p>
                </div>
              </div>

              <textarea
                rows={6}
                value={aiConfig.system_prompt}
                onChange={(e) => setAiConfig({ ...aiConfig, system_prompt: e.target.value })}
                className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveAIConfig}
                  disabled={savingAI}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
                >
                  {savingAI ? 'Đang lưu cấu hình...' : 'Lưu Thay Đổi Cấu Hình AI'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PLATFORM ANALYTICS */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold uppercase">Tổng lượt nộp bài</div>
                <div className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
                  {analytics.total_submissions}
                </div>
                <div className="text-xs text-emerald-500 font-semibold mt-1">
                  {analytics.passed_submissions} bài đạt (Accepted)
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold uppercase">Tỷ lệ nộp đạt (Acceptance)</div>
                <div className="text-3xl font-black mt-2 text-emerald-500">
                  {analytics.overall_pass_rate}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Chuẩn chấm Test Case tự động</div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold uppercase">Ngân hàng bài tập</div>
                <div className="text-3xl font-black mt-2 text-indigo-500">
                  {analytics.total_exercises}
                </div>
                <div className="text-xs text-slate-400 mt-1">Đầy đủ bộ test ẩn & mẫu</div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold uppercase">Mã độc bị chặn (Security)</div>
                <div className="text-3xl font-black mt-2 text-rose-500">
                  {analytics.security_incidents_count}
                </div>
                <div className="text-xs text-rose-500/80 font-medium mt-1">100% ngăn chặn thành công</div>
              </div>
            </div>

            {/* Daily activity chart & language breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-sm mb-4">Lượt Nộp Bài 7 Ngày Qua (Submissions Activity)</h3>
                <div className="flex items-end gap-3 h-48 pt-6">
                  {analytics.daily_activity.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {item.submissions}
                      </div>
                      <div
                        className="w-full bg-indigo-500 rounded-t-lg transition-all"
                        style={{
                          height: `${Math.max(item.submissions * 12, 10)}px`,
                        }}
                      />
                      <div className="text-[10px] text-slate-400">{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-sm mb-4">Phân Bổ Ngôn Ngữ Lập Trình</h3>
                <div className="space-y-4">
                  {analytics.top_languages.map((lang, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{lang.language.toUpperCase()}</span>
                        <span>{lang.count} bài nộp</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (lang.count / (analytics.total_submissions || 1)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: TẠO NGƯỜI DÙNG */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base">Thêm Người Dùng Mới</h3>
              <button
                onClick={() => setIsCreateUserOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Tên đăng nhập *</label>
                <input
                  type="text"
                  required
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  placeholder="ví dụ: student_k73"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  placeholder="student@hnue.edu.vn"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Vai trò (Role)</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value as UserRole })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  >
                    <option value="student">Student (Học viên)</option>
                    <option value="teacher">Teacher (Giảng viên)</option>
                    <option value="admin">Admin (Quản trị viên)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Mã SV (nếu có)</label>
                  <input
                    type="text"
                    value={newUserData.student_id}
                    onChange={(e) => setNewUserData({ ...newUserData, student_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                    placeholder="735105001"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  Xác nhận Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM MÃ NGUỒN VI PHẠM */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-base text-rose-500 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Chi tiết Đoạn mã Vi phạm Bảo mật</span>
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Người nộp: {selectedIncident.user_name} (@{selectedIncident.username}) • Bài:{' '}
                  {selectedIncident.exercise_title}
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
                {selectedIncident.error_message}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Mã nguồn gửi lên:</div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-64 border border-slate-800">
                  {selectedIncident.source_code}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
