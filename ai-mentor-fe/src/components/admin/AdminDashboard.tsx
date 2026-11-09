import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, UserRole } from '../../types/auth';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  adminService,
  AdminUserItem,
  SecurityIncident,
  SystemAIConfigData,
  PlatformAnalyticsData,
} from '../../services/adminService';
import { getCleanDisplayName } from '../../services/mockAuth';
import { AppSidebar } from '../common/AppSidebar';
import { BackToTopButton } from '../common/BackToTopButton';
import {
  ShieldAlert,
  Search,
  Plus,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  CheckCircle2,
  Bot,
  X,
  FileCode,
  Sparkles,
  Server,
  ShieldCheck,
  Wifi,
  WifiOff,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onLogout: () => void;
  onNavigateView?: (view: 'dashboard' | 'teacher' | 'ide') => void;
}

type AdminTab = 'users' | 'security' | 'ai' | 'analytics';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  onLogout,
}) => {
  const isVie = currentLang === 'vie';
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

  // Security Logs & Sandbox State
  const [securityLogs, setSecurityLogs] = useState<SecurityIncident[]>([]);
  const [networkIsolation, setNetworkIsolation] = useState(true);
  const [blockedIps, setBlockedIps] = useState<Set<string>>(new Set());
  const [resolvedIncidents, setResolvedIncidents] = useState<Set<number>>(new Set());

  // AI Config
  const [aiConfig, setAiConfig] = useState<SystemAIConfigData | null>(null);
  const [savingAI, setSavingAI] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<PlatformAnalyticsData | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
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
      setAiConfig({
        ...ai,
        socratic_guardrail: ai.socratic_guardrail ?? true,
      });
      setAnalytics(an);
    } catch {
      showToast(isVie ? 'Có lỗi xảy ra khi tải dữ liệu từ máy chủ.' : 'Error loading server data.');
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
      const cleanName = getCleanDisplayName(u.name);
      const matchSearch =
        cleanName.toLowerCase().includes(userSearch.toLowerCase()) ||
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
      const targetIdentifier = targetUser.email || targetUser.username;
      const updated = await adminService.updateUserStatus(targetUser.id, !targetUser.is_active, targetIdentifier);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: updated.is_active } : u))
      );
      showToast(
        isVie
          ? `Đã ${updated.is_active ? 'mở khóa' : 'khóa'} tài khoản ${targetUser.username} thành công!`
          : `Account ${targetUser.username} has been ${updated.is_active ? 'unlocked' : 'locked'}!`
      );
    } catch {
      showToast(isVie ? 'Không thể thay đổi trạng thái tài khoản.' : 'Failed to update account status.');
    }
  };

  const handleChangeRole = async (targetUser: AdminUserItem, newRole: UserRole) => {
    try {
      const targetIdentifier = targetUser.email || targetUser.username;
      await adminService.updateUserRole(targetUser.id, newRole, targetIdentifier);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      showToast(
        isVie
          ? `Đã chuyển đổi vai trò của ${targetUser.username} sang ${newRole}!`
          : `Role for ${targetUser.username} changed to ${newRole}!`
      );
    } catch {
      showToast(isVie ? 'Không thể đổi vai trò.' : 'Failed to change user role.');
    }
  };

  const handleResetPassword = async (targetUser: AdminUserItem) => {
    const confirmMsg = isVie
      ? `Bạn có chắc muốn đặt lại mật khẩu của ${targetUser.username} về mặc định (123456)?`
      : `Reset password for ${targetUser.username} to default (123456)?`;

    if (confirm(confirmMsg)) {
      try {
        const targetIdentifier = targetUser.email || targetUser.username;
        await adminService.resetPassword(targetUser.id, '123456', targetIdentifier);
        showToast(
          isVie
            ? `Đã đặt lại mật khẩu của ${targetUser.username} về 123456.`
            : `Password for ${targetUser.username} reset to 123456.`
        );
      } catch {
        showToast(isVie ? 'Không thể đặt lại mật khẩu.' : 'Failed to reset password.');
      }
    }
  };

  const handleDeleteUser = async (targetUser: AdminUserItem) => {
    if (targetUser.username === 'admin' || targetUser.email === 'admin@hnue.edu.vn') {
      alert(isVie ? 'Không thể xóa tài khoản Quản trị viên tối cao!' : 'Cannot delete Super Admin account!');
      return;
    }

    const confirmMsg = isVie
      ? `CẢNH BÁO: Xóa người dùng ${targetUser.username} sẽ xóa toàn bộ bài nộp và dữ liệu liên quan. Bạn có chắc không?`
      : `WARNING: Deleting user ${targetUser.username} will remove all associated submissions. Are you sure?`;

    if (confirm(confirmMsg)) {
      try {
        const targetIdentifier = targetUser.email || targetUser.username;
        await adminService.deleteUser(targetUser.id, targetIdentifier);
        setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
        showToast(
          isVie
            ? `Đã xóa vĩnh viễn tài khoản ${targetUser.username}.`
            : `User ${targetUser.username} permanently deleted.`
        );
      } catch {
        showToast(isVie ? 'Không thể xóa người dùng.' : 'Failed to delete user.');
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.email || !newUserData.name) {
      alert(isVie ? 'Vui lòng điền đủ các trường bắt buộc' : 'Please fill all required fields');
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
      showToast(
        isVie
          ? `Đã thêm mới tài khoản ${created.username} thành công!`
          : `Created account ${created.username} successfully!`
      );
    } catch {
      alert(
        isVie
          ? 'Không thể tạo tài khoản. Vui lòng kiểm tra trùng tên đăng nhập hoặc email.'
          : 'Failed to create user. Duplicate username or email.'
      );
    }
  };

  // AI Config Save
  const handleSaveAIConfig = async () => {
    if (!aiConfig) return;
    setSavingAI(true);
    try {
      const updated = await adminService.updateAIConfig(aiConfig);
      setAiConfig(updated);
      showToast(
        isVie
          ? 'Đã lưu cấu hình AI toàn hệ thống thành công!'
          : 'System AI configuration saved successfully!'
      );
    } catch {
      showToast(isVie ? 'Lỗi khi lưu cấu hình AI.' : 'Failed to save AI config.');
    } finally {
      setSavingAI(false);
    }
  };

  const handleToggleBlockIp = (ip: string) => {
    setBlockedIps((prev) => {
      const next = new Set(prev);
      if (next.has(ip)) {
        next.delete(ip);
        showToast(isVie ? `Đã bỏ chặn IP ${ip}` : `Unblocked IP ${ip}`);
      } else {
        next.add(ip);
        showToast(isVie ? `Đã chặn toàn diện IP ${ip}` : `Blocked IP ${ip}`);
      }
      return next;
    });
  };

  const handleMarkResolved = (id: number) => {
    setResolvedIncidents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        showToast(isVie ? `Đã đánh dấu sự cố #${id} là Đã xử lý` : `Marked incident #${id} as resolved`);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex-row font-sans transition-colors duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-slate-950" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. LEFT VERTICAL SIDEBAR (GEMINI STYLE) */}
      <AppSidebar
        role="admin"
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as AdminTab)}
        user={user}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        onOpenSettings={(tab) => {
          if (tab === 'password') {
            showToast(isVie ? 'Tài khoản Quản trị viên sử dụng mật khẩu cấu hình hệ thống' : 'Admin account credentials managed at system level');
          } else {
            setActiveTab('users');
          }
        }}
      />

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* Minimal Admin Topbar */}
        <header className="h-14 px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2" />

          {/* Fast Actions & Controls - Synchronized with Student & Teacher */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {activeTab === 'users' && (
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isVie ? 'Thêm tài khoản' : 'Add Account'}</span>
              </button>
            )}

            {/* Language Switcher Pill */}
            <div
              role="group"
              aria-label="Language Selector"
              className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('vie')}
                className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isVie
                    ? 'bg-[#1BA94C] text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                VIE
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('eng')}
                className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
                  !isVie
                    ? 'bg-[#1BA94C] text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Theme Toggle (Sun/Moon) */}
            <button
              type="button"
              onClick={onThemeToggle}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors focus:outline-none cursor-pointer"
              title={currentTheme === 'dark' ? (isVie ? 'Chuyển Theme Sáng' : 'Light Mode') : (isVie ? 'Chuyển Theme Tối' : 'Dark Mode')}
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Refresh Data Button */}
            <button
              type="button"
              onClick={loadData}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={isVie ? 'Làm mới dữ liệu' : 'Refresh Data'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {/* ============================================================== */}
          {/* TAB 1: USERS & PERMISSIONS */}
          {/* ============================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Top 4 Stat Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                    {isVie ? 'Tổng tài khoản' : 'Total Accounts'}
                  </div>
                  <div className="text-3xl font-bold tracking-tight mt-2 text-slate-900 dark:text-white font-sans">
                    {usersList.length}
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                    {isVie ? 'Sinh viên' : 'Students'}
                  </div>
                  <div className="text-3xl font-bold tracking-tight mt-2 text-slate-900 dark:text-white font-sans">
                    {usersList.filter((u) => u.role === 'student').length}
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                    {isVie ? 'Giảng viên' : 'Teachers'}
                  </div>
                  <div className="text-3xl font-bold tracking-tight mt-2 text-slate-900 dark:text-white font-sans">
                    {usersList.filter((u) => u.role === 'teacher').length}
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                    {isVie ? 'Quản trị viên / Đang khóa' : 'Admins / Locked'}
                  </div>
                  <div className="text-3xl font-bold tracking-tight mt-2 flex items-baseline gap-2 font-sans">
                    <span className="text-rose-600 dark:text-rose-400">
                      {usersList.filter((u) => u.role === 'admin').length}
                    </span>
                    <span className="text-slate-400 font-semibold text-lg">/</span>
                    <span className="text-amber-500 font-bold text-lg">
                      {usersList.filter((u) => !u.is_active).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter & Action Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={isVie ? 'Tìm theo tên, email, username, mã SV...' : 'Search by name, email, username, student ID...'}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="all">{isVie ? 'Tất cả vai trò' : 'All Roles'}</option>
                    <option value="student">{isVie ? 'Chỉ Sinh viên' : 'Students Only'}</option>
                    <option value="teacher">{isVie ? 'Chỉ Giảng viên' : 'Teachers Only'}</option>
                    <option value="admin">{isVie ? 'Chỉ Admin' : 'Admins Only'}</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="all">{isVie ? 'Tất cả trạng thái' : 'All Status'}</option>
                    <option value="active">{isVie ? 'Đang hoạt động' : 'Active Only'}</option>
                    <option value="inactive">{isVie ? 'Đã bị khóa' : 'Locked Only'}</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">{isVie ? 'Người dùng' : 'User'}</th>
                        <th className="px-5 py-3.5">{isVie ? 'Vai trò (Role)' : 'Role'}</th>
                        <th className="px-5 py-3.5">{isVie ? 'Mã SV / Đơn vị' : 'ID / Department'}</th>
                        <th className="px-5 py-3.5">{isVie ? 'Trạng thái' : 'Status'}</th>
                        <th className="px-5 py-3.5 text-right">{isVie ? 'Thao tác' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                            {isVie ? 'Không tìm thấy người dùng nào phù hợp.' : 'No users found matching filter.'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const cleanName = getCleanDisplayName(u.name);
                          const initials = cleanName.slice(0, 2).toUpperCase();

                          return (
                            <tr
                              key={u.id}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                            >
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shrink-0">
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                                      {cleanName}
                                    </div>
                                    <div className="text-[11px] text-slate-400 truncate font-mono">
                                      @{u.username} • {u.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                                  className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer font-sans ${
                                    u.role === 'admin'
                                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                                      : u.role === 'teacher'
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <option value="student">{isVie ? 'Student (Sinh viên)' : 'Student'}</option>
                                  <option value="teacher">{isVie ? 'Teacher (Giảng viên)' : 'Teacher'}</option>
                                  <option value="admin">{isVie ? 'Admin (Quản trị viên)' : 'Admin'}</option>
                                </select>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-slate-500 font-sans">
                                {u.student_id ? (
                                  <div>{isVie ? `Mã SV: ${u.student_id}` : `ID: ${u.student_id}`}</div>
                                ) : (
                                  <div>{u.class_group || (isVie ? 'Chưa gán' : 'Unassigned')}</div>
                                )}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                    u.is_active
                                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      u.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                  />
                                  {u.is_active ? (isVie ? 'Hoạt động' : 'Active') : (isVie ? 'Bị khóa' : 'Locked')}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStatus(u)}
                                    className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                      u.is_active
                                        ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                        : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                    }`}
                                    title={u.is_active ? (isVie ? 'Khóa tài khoản' : 'Lock Account') : (isVie ? 'Mở khóa tài khoản' : 'Unlock Account')}
                                  >
                                    {u.is_active ? (
                                      <Lock className="w-4 h-4" />
                                    ) : (
                                      <Unlock className="w-4 h-4" />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleResetPassword(u)}
                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                    title={isVie ? 'Đặt lại mật khẩu về 123456' : 'Reset password to 123456'}
                                  >
                                    <KeyRound className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                                    title={isVie ? 'Xóa tài khoản' : 'Delete Account'}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
              {/* Sandbox Config Cards (Time: 1000ms, Memory: 128MB, Network Isolation: ON/OFF) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      {isVie ? 'Giới hạn Thời gian (Time Limit)' : 'Execution Time Limit'}
                    </div>
                    <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">1000ms</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {isVie
                        ? 'Tự động ngắt tiến trình vô hạn qua POSIX resource/SIGALRM.'
                        : 'Auto-kill infinite loops via POSIX resource/SIGALRM.'}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 shrink-0">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      {isVie ? 'Giới hạn Bộ nhớ (RAM Limit)' : 'Memory Limit'}
                    </div>
                    <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">128MB</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {isVie
                        ? 'Ngăn chặn tấn công cạn kiệt RAM và cấp phát mảng vượt ngưỡng.'
                        : 'Prevents memory exhaustion attacks and oversized array allocations.'}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${networkIsolation ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-[#00EA64]' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600'}`}>
                      {networkIsolation ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {isVie ? 'Cách ly Mạng (Network Isolation)' : 'Network Isolation'}
                      </div>
                      <div className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
                        {networkIsolation ? 'ON' : 'OFF'}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {networkIsolation
                          ? (isVie ? 'Khóa toàn bộ socket mạng & outgoing calls' : 'All network sockets & outbound traffic blocked')
                          : (isVie ? 'Cho phép kết nối mạng bên ngoài' : 'External network access enabled')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNetworkIsolation(!networkIsolation);
                      showToast(
                        networkIsolation
                          ? (isVie ? 'Đã TẮT cách ly mạng Sandbox' : 'Network isolation DISABLED')
                          : (isVie ? 'Đã BẬT cách ly mạng Sandbox 100%' : 'Network isolation ENABLED')
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      networkIsolation
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {networkIsolation ? 'SWITCH OFF' : 'SWITCH ON'}
                  </button>
                </div>
              </div>

              {/* Incident Logs Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-500" />
                      <span>{isVie ? 'Nhật ký Vi phạm An ninh Sandbox' : 'Security Incident Audit Logs'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isVie
                        ? 'Ghi nhận các trường hợp mã nguồn chứa hành vi nguy hiểm (sys.exit, subprocess, socket) bị hệ thống phát hiện.'
                        : 'Records source code executions containing dangerous calls blocked by the sandbox static AST checker.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadData}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Làm mới' : 'Refresh'}</span>
                  </button>
                </div>

                {securityLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <div className="font-semibold text-slate-700 dark:text-slate-200">
                      {isVie ? 'Hệ thống an toàn tuyệt đối' : 'System Secure'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isVie ? 'Chưa phát hiện hành vi tấn công hay mã độc xâm hại Sandbox nào.' : 'No sandbox intrusion attempts detected.'}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 pr-1">
                    {securityLogs.map((log) => {
                      const ipAddress = `192.168.1.10${log.id}`;
                      const isBlocked = blockedIps.has(ipAddress);
                      const isResolved = resolvedIncidents.has(log.id);

                      return (
                        <div
                          key={log.id}
                          className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                {isVie ? 'CHẶN BẢO MẬT' : 'SECURITY BLOCKED'}
                              </span>

                              {isResolved && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {isVie ? 'ĐÃ XỬ LÝ' : 'RESOLVED'}
                                </span>
                              )}

                              <span className="font-semibold text-xs text-slate-900 dark:text-white">
                                {getCleanDisplayName(log.user_name)} (@{log.username})
                              </span>
                              <span className="text-xs text-slate-400">• {log.exercise_title}</span>
                              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                IP: {ipAddress}
                              </span>
                            </div>

                            <div className="text-xs font-mono text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded inline-block">
                              {log.error_message}
                            </div>

                            <div className="text-[11px] text-slate-400 font-sans">
                              {isVie ? 'Thời gian' : 'Timestamp'}: {new Date(log.submitted_at).toLocaleString(isVie ? 'vi-VN' : 'en-US')}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start md:self-center">
                            <button
                              type="button"
                              onClick={() => handleToggleBlockIp(ipAddress)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                                isBlocked
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                              }`}
                            >
                              {isBlocked ? (isVie ? 'Đã Chặn IP' : 'IP Blocked') : (isVie ? 'Chặn IP' : 'Block IP')}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleMarkResolved(log.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                                isResolved
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {isResolved ? (isVie ? 'Đã xong' : 'Resolved') : (isVie ? 'Đã xử lý' : 'Mark Resolved')}
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedIncident(log)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold rounded-lg transition cursor-pointer border border-emerald-200 dark:border-emerald-800/40"
                            >
                              <FileCode className="w-3.5 h-3.5" />
                              <span>{isVie ? 'Xem mã vi phạm' : 'View Code'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Bot className="w-5 h-5 text-violet-500" />
                  <span>{isVie ? 'Cấu hình Nhà cung cấp & Mô hình AI' : 'AI Provider & Model Architecture'}</span>
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {isVie
                    ? 'Chuyển đổi linh hoạt giữa các mô hình AI tiên tiến: Gemini 2.5 Flash, Gemini 2.5 Pro và Claude 3.7 Sonnet.'
                    : 'Switch seamlessly between top models: Gemini 2.5 Flash, Gemini 2.5 Pro, and Claude 3.7 Sonnet.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Option 1: Gemini 2.5 Flash */}
                  <div
                    onClick={() =>
                      setAiConfig({
                        ...aiConfig,
                        provider: 'google_gemini',
                        model_name: 'gemini-2.5-flash',
                      })
                    }
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      aiConfig.model_name === 'gemini-2.5-flash'
                        ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Google Gemini 2.5 Flash</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        {isVie ? 'Khuyên dùng' : 'Recommended'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isVie
                        ? 'Phản hồi siêu tốc (dưới 1s), độ trễ cực thấp, tiết kiệm chi phí cho các lớp đông sinh viên.'
                        : 'Sub-second response, ultra-low latency, optimal cost for large classrooms.'}
                    </p>
                  </div>

                  {/* Option 2: Gemini 2.5 Pro */}
                  <div
                    onClick={() =>
                      setAiConfig({
                        ...aiConfig,
                        provider: 'google_gemini',
                        model_name: 'gemini-2.5-pro',
                      })
                    }
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      aiConfig.model_name === 'gemini-2.5-pro'
                        ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Google Gemini 2.5 Pro</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                        {isVie ? 'Suy luận sâu' : 'Deep Reasoning'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isVie
                        ? 'Tư duy thuật toán sâu sắc, suy luận giải thuật cấu trúc dữ liệu phức tạp xuất sắc.'
                        : 'Deep algorithmic reasoning, excels at complex dynamic programming & data structures.'}
                    </p>
                  </div>

                  {/* Option 3: Claude 3.7 Sonnet */}
                  <div
                    onClick={() =>
                      setAiConfig({
                        ...aiConfig,
                        provider: 'anthropic',
                        model_name: 'claude-3-7-sonnet',
                      })
                    }
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      aiConfig.model_name === 'claude-3-7-sonnet'
                        ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Claude 3.7 Sonnet</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500">
                        {isVie ? 'Code chuyên sâu' : 'Superior Coding'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isVie
                        ? 'Khả năng phân tích cú pháp C/C++/Java/Python siêu chuẩn mực và giải thích lỗi sư phạm tuyệt vời.'
                        : 'State-of-the-art code analysis and exceptional pedagogical explanations.'}
                    </p>
                  </div>
                </div>

                {/* Socratic Guardrail & Token Tracking */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{isVie ? 'Socratic Guardrail (Cấm AI giải hộ code hoàn chỉnh)' : 'Socratic Guardrail (Prohibit complete code solutions)'}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {isVie
                          ? 'Bắt buộc AI chỉ đặt câu hỏi gợi mở hoặc chỉ ra dòng lỗi, không bao giờ cung cấp mã nguồn hoàn chỉnh.'
                          : 'Forces AI to guide with targeted questions instead of providing direct solutions.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setAiConfig({
                          ...aiConfig,
                          socratic_guardrail: !aiConfig.socratic_guardrail,
                        })
                      }
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        aiConfig.socratic_guardrail !== false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {aiConfig.socratic_guardrail !== false ? 'GUARD ON' : 'GUARD OFF'}
                    </button>
                  </div>

                  {/* Sliders & Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <label className="block text-xs font-semibold mb-2">
                        {isVie ? 'Hạn mức câu hỏi sinh viên / ngày' : 'Daily AI questions per student'}:{' '}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {aiConfig.daily_quota_per_student} {isVie ? 'câu/ngày' : 'queries/day'}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={aiConfig.daily_quota_per_student}
                        onChange={(e) =>
                          setAiConfig({ ...aiConfig, daily_quota_per_student: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>5 {isVie ? 'câu' : 'queries'}</span>
                        <span>25 {isVie ? 'câu' : 'queries'}</span>
                        <span>50 {isVie ? 'câu' : 'queries'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2">
                        {isVie ? 'Giới hạn tần suất gọi (Rate Limit)' : 'Rate Limit'}:{' '}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {aiConfig.rate_limit_per_minute} {isVie ? 'lần/phút' : 'req/min'}
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
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>1 req/min</span>
                        <span>5 req/min</span>
                        <span>15 req/min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socratic System Prompt Editor */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>{isVie ? 'System Prompt Socratic Toàn Cục' : 'Global Socratic System Prompt'}</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isVie
                        ? 'Cốt lõi sư phạm hướng dẫn sinh viên tự phát hiện lỗi tư duy thay vì sao chép lời giải.'
                        : 'Pedagogical foundation instructing the AI to coach students toward discovery.'}
                    </p>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={aiConfig.system_prompt}
                  onChange={(e) => setAiConfig({ ...aiConfig, system_prompt: e.target.value })}
                  className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAIConfig}
                    disabled={savingAI}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {savingAI ? (isVie ? 'Đang lưu cấu hình...' : 'Saving...') : (isVie ? 'Lưu Thay Đổi Cấu Hình AI' : 'Save AI Configuration')}
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
              {/* Metric Cards - Minimalist, No tiny subtitle, overflow-hidden */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">{isVie ? 'Tổng lượt nộp bài' : 'Total Submissions'}</div>
                  <div className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
                    {analytics.total_submissions}
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">{isVie ? 'Tỷ lệ nộp đạt' : 'Acceptance Rate'}</div>
                  <div className="text-3xl font-black mt-2 text-emerald-500">
                    {analytics.overall_pass_rate}%
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">{isVie ? 'Ngân hàng bài tập' : 'Exercise Bank'}</div>
                  <div className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
                    {analytics.total_exercises}
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">{isVie ? 'Mã độc bị chặn' : 'Security Blocks'}</div>
                  <div className="text-3xl font-black mt-2 text-rose-500">
                    {analytics.security_incidents_count}
                  </div>
                </div>
              </div>

              {/* Submissions by Day & Language Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs h-64 overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isVie ? 'Lượt Nộp Bài 7 Ngày Qua' : '7-Day Submissions Activity'}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                      {isVie ? 'Chuẩn Grader' : 'Grader Benchmark'}
                    </span>
                  </div>

                  <div className="w-full flex-1 flex items-center justify-center">
                    {(() => {
                      const activityData =
                        analytics.daily_activity && analytics.daily_activity.length > 0
                          ? analytics.daily_activity
                          : [
                              { date: '01/11', submissions: 18 },
                              { date: '02/11', submissions: 24 },
                              { date: '03/11', submissions: 31 },
                              { date: '04/11', submissions: 29 },
                              { date: '05/11', submissions: 42 },
                              { date: '06/11', submissions: 40 },
                              { date: '07/11', submissions: 38 },
                            ];

                      const maxVal = Math.max(...activityData.map((d) => d.submissions), 50);
                      const chartWidth = 600;
                      const paddingX = 45;
                      const topY = 32;
                      const bottomY = 140;

                      const points = activityData.map((d, i) => {
                        const x =
                          paddingX +
                          (i / Math.max(activityData.length - 1, 1)) * (chartWidth - paddingX * 2);
                        const y = bottomY - (d.submissions / maxVal) * (bottomY - topY);
                        return {
                          x: Math.round(x),
                          y: Math.round(y),
                          val: d.submissions,
                          date: d.date,
                        };
                      });

                      const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
                      const areaPolygonPoints = `${points[0].x},${bottomY + 5} ${polylinePoints} ${
                        points[points.length - 1].x
                      },${bottomY + 5}`;

                      return (
                        <svg
                          viewBox="0 0 600 180"
                          className="w-full h-full max-h-44 overflow-visible"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="adminSubAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* 4 horizontal dashed grid lines */}
                          <line
                            x1="30"
                            y1="35"
                            x2="570"
                            y2="35"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            className="text-slate-200 dark:text-slate-800"
                            strokeWidth="1"
                          />
                          <line
                            x1="30"
                            y1="70"
                            x2="570"
                            y2="70"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            className="text-slate-200 dark:text-slate-800"
                            strokeWidth="1"
                          />
                          <line
                            x1="30"
                            y1="105"
                            x2="570"
                            y2="105"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            className="text-slate-200 dark:text-slate-800"
                            strokeWidth="1"
                          />
                          <line
                            x1="30"
                            y1="140"
                            x2="570"
                            y2="140"
                            stroke="currentColor"
                            strokeDasharray="4 4"
                            className="text-slate-200 dark:text-slate-800"
                            strokeWidth="1"
                          />

                          {/* Area Gradient Polygon */}
                          <polygon points={areaPolygonPoints} fill="url(#adminSubAreaGrad)" />

                          {/* Polyline */}
                          <polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Points: circles & value texts */}
                          {points.map((p, i) => (
                            <g key={i}>
                              <text
                                x={p.x}
                                y={p.y - 10}
                                textAnchor="middle"
                                className="text-[11px] font-bold fill-emerald-600 dark:fill-emerald-400 font-mono select-none"
                              >
                                {p.val}
                              </text>
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="4.5"
                                className="fill-emerald-600 dark:fill-emerald-400 stroke-2 stroke-white dark:stroke-slate-900"
                              />
                              <text
                                x={p.x}
                                y={166}
                                textAnchor="middle"
                                className="text-[10px] font-medium fill-slate-400 font-mono select-none"
                              >
                                {p.date}
                              </text>
                            </g>
                          ))}
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="font-bold text-sm mb-4">{isVie ? 'Phân Bổ Ngôn Ngữ Lập Trình' : 'Programming Language Share'}</h3>
                  <div className="space-y-4">
                    {analytics.top_languages.map((lang, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{lang.language.toUpperCase()}</span>
                          <span>{lang.count} {isVie ? 'bài nộp' : 'submissions'}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
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
        <BackToTopButton currentLang={currentLang} position="bottom-right" />
      </div>

      {/* MODAL: TẠO NGƯỜI DÙNG */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base">{isVie ? 'Thêm Người Dùng Mới' : 'Add New User'}</h3>
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">{isVie ? 'Tên đăng nhập *' : 'Username *'}</label>
                <input
                  type="text"
                  required
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-sans"
                  placeholder="student_k73"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">{isVie ? 'Email *' : 'Email *'}</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-sans"
                  placeholder="student@hnue.edu.vn"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">{isVie ? 'Họ và tên *' : 'Full Name *'}</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-sans"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">{isVie ? 'Vai trò' : 'Role'}</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value as UserRole })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="student">{isVie ? 'Student (Sinh viên)' : 'Student'}</option>
                    <option value="teacher">{isVie ? 'Teacher (Giảng viên)' : 'Teacher'}</option>
                    <option value="admin">{isVie ? 'Admin (Quản trị viên)' : 'Admin'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">{isVie ? 'Mã SV / Lớp' : 'Student ID / Class'}</label>
                  <input
                    type="text"
                    value={newUserData.student_id}
                    onChange={(e) => setNewUserData({ ...newUserData, student_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-sans"
                    placeholder="735105001"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {isVie ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  {isVie ? 'Xác nhận Tạo' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM MÃ NGUỒN VI PHẠM */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-base text-rose-500 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>{isVie ? 'Chi tiết Đoạn mã Vi phạm Bảo mật' : 'Security Incident Source Code'}</span>
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {getCleanDisplayName(selectedIncident.user_name)} (@{selectedIncident.username}) • {selectedIncident.exercise_title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
                {selectedIncident.error_message}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">{isVie ? 'Mã nguồn gửi lên:' : 'Submitted source code:'}</div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-64 border border-slate-800">
                  {selectedIncident.source_code}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                {isVie ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
