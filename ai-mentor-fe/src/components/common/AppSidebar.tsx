import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../../types/auth';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import { getCleanDisplayName } from '../../services/mockAuth';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Code2,
  BookOpen,
  Layers,
  Trophy,
  History,
  BarChart3,
  Bot,
  Users,
  ShieldCheck,
  Plus,
  Settings,
  LogOut,
  User as UserIcon,
  KeyRound,
} from 'lucide-react';

export interface AppSidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
  onLogout: () => void;
  onOpenSettings?: (tab?: 'profile' | 'password' | 'appearance' | 'notifications') => void;
  onNewAssignment?: () => void;
  aiLogBadgeCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  user,
  currentLang = 'vie',
  onLogout,
  onOpenSettings,
  onNewAssignment,
  aiLogBadgeCount = 0,
  isCollapsed: externalCollapsed,
  onToggleCollapse: externalToggleCollapse,
}) => {
  const isVie = currentLang === 'vie';

  // Internal collapse state if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ai_mentor_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (externalToggleCollapse) {
      externalToggleCollapse();
    } else {
      const next = !isCollapsed;
      setInternalCollapsed(next);
      try {
        localStorage.setItem('ai_mentor_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
    }
  };

  // Popover menu state for Settings Cog
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const cleanName = getCleanDisplayName(user.name);
  const initials =
    cleanName
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'U';

  const roleBadgeText =
    role === 'admin'
      ? isVie
        ? 'Quản trị viên'
        : 'Admin'
      : role === 'teacher'
      ? isVie
        ? 'Giảng viên'
        : 'Teacher'
      : isVie
      ? 'Sinh viên'
      : 'Student';

  // Navigation items by role
  const navItems = (() => {
    if (role === 'teacher') {
      return [
        { id: 'analytics', label: isVie ? 'Tổng quan' : 'Analytics', icon: BarChart3 },
        { id: 'courses', label: isVie ? 'Khóa học & Bài tập' : 'Courses & Exercises', icon: BookOpen },
        { id: 'ai-monitor', label: isVie ? 'Giám sát AI' : 'AI Logs', icon: Bot, badge: aiLogBadgeCount },
        { id: 'roster', label: isVie ? 'Sinh viên & Điểm số' : 'Roster & Grades', icon: Users },
      ];
    }
    if (role === 'admin') {
      return [
        { id: 'users', label: isVie ? 'Quản lý người dùng' : 'Users & Roles', icon: Users },
        { id: 'security', label: isVie ? 'An ninh & Sandbox' : 'Security & Sandbox', icon: ShieldCheck },
        { id: 'ai', label: isVie ? 'Cấu hình AI & Model' : 'AI & Model Config', icon: Bot },
        { id: 'analytics', label: isVie ? 'Thống kê Hệ thống' : 'System Metrics', icon: BarChart3 },
      ];
    }
    // Student
    return [
      { id: 'practice', label: isVie ? 'Luyện tập' : 'Practice', icon: Code2 },
      { id: 'courses', label: isVie ? 'Khóa học' : 'Courses', icon: BookOpen },
      { id: 'kits', label: isVie ? 'Lộ trình' : 'Prep Kits', icon: Layers },
      { id: 'leaderboard', label: isVie ? 'Bảng xếp hạng' : 'Leaderboard', icon: Trophy },
      { id: 'submissions', label: isVie ? 'Lịch sử nộp bài' : 'Submissions', icon: History },
    ];
  })();

  return (
    <aside
      className={`h-screen sticky top-0 shrink-0 select-none z-40 transition-all duration-200 border-r flex flex-col justify-between overflow-visible ${
        isCollapsed ? 'w-[68px] min-w-[68px] max-w-[68px]' : 'w-64 min-w-[256px] max-w-[256px]'
      } bg-slate-50/95 dark:bg-[#0b1018] border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200`}
    >
      {/* ================= 1. TOP: BRAND LOGO & COLLAPSE TOGGLE ================= */}
      {isCollapsed ? (
        <div className="h-16 flex items-center justify-center border-b border-slate-200/60 dark:border-slate-800/60 overflow-visible">
          <button
            type="button"
            onClick={handleToggle}
            className="group relative w-10 h-10 rounded-xl mx-auto flex items-center justify-center cursor-pointer transition-all duration-150 focus:outline-none"
            aria-label={isVie ? 'Mở thanh bên' : 'Expand menu'}
          >
            {/* Normal State: White H on Emerald background */}
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs group-hover:hidden transition-all">
              <span className="font-mono text-base font-extrabold select-none">H</span>
            </div>

            {/* Hover State: PanelLeftOpen icon */}
            <div className="hidden group-hover:flex w-10 h-10 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 items-center justify-center shadow-xs transition-all">
              <PanelLeftOpen className="w-5 h-5" />
            </div>

            {/* Floating Pill Tooltip */}
            <div className="hidden group-hover:flex items-center absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium whitespace-nowrap shadow-lg z-[60] pointer-events-none">
              {isVie ? 'Mở thanh bên' : 'Expand menu'}
            </div>
          </button>
        </div>
      ) : (
        <div className="h-16 px-3 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 overflow-visible">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs shrink-0">
              <span className="font-mono text-base font-extrabold select-none">H</span>
            </div>
            <div className="truncate">
              <span className="font-extrabold text-sm tracking-tight font-sans text-slate-900 dark:text-white uppercase block truncate">
                AI CODE MENTOR
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            title={isVie ? 'Thu gọn thanh bên' : 'Collapse menu'}
            className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= 2. MIDDLE: ACTION BUTTON & NAVIGATION ITEMS ================= */}
      <div className="flex-1 overflow-visible px-2 py-3 space-y-1">
        {/* Special Teacher Action Button (+ Giao bài tập mới) */}
        {role === 'teacher' && onNewAssignment && (
          isCollapsed ? (
            <div className="mb-3 flex justify-center overflow-visible">
              <button
                type="button"
                onClick={onNewAssignment}
                className="group relative w-10 h-10 rounded-xl p-0 flex items-center justify-center mx-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-all active:scale-95 focus:outline-none"
                aria-label={isVie ? 'Giao bài tập mới' : 'New Assignment'}
              >
                <Plus className="w-5 h-5 shrink-0" />
                <div className="hidden group-hover:flex items-center absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium whitespace-nowrap shadow-lg z-[60] pointer-events-none">
                  {isVie ? 'Giao bài tập mới' : 'New Assignment'}
                </div>
              </button>
            </div>
          ) : (
            <div className="mb-3 px-1 overflow-visible">
              <button
                type="button"
                onClick={onNewAssignment}
                className="w-full h-10 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-95 focus:outline-none"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">{isVie ? 'Giao bài tập mới' : 'New Assignment'}</span>
              </button>
            </div>
          )
        )}

        {/* Navigation List */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (isCollapsed) {
            return (
              <div key={item.id} className="flex justify-center overflow-visible">
                <button
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`group relative w-10 h-10 rounded-xl p-0 flex items-center justify-center mx-auto transition-all cursor-pointer focus:outline-none ${
                    isActive
                      ? 'bg-emerald-500/15 text-[#1BA94C] dark:text-[#00EA64] font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0b1018]" />
                  )}

                  <div className="hidden group-hover:flex items-center absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium whitespace-nowrap shadow-lg z-[60] pointer-events-none">
                    {item.label}
                  </div>
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full h-10 flex items-center justify-between px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-[#1BA94C] dark:text-[#00EA64] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-[#1BA94C] dark:text-[#00EA64]'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= 3. BOTTOM: SETTINGS COG & AVATAR WITH SIDE POPOVER ================= */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 overflow-visible relative" ref={popoverRef}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2 overflow-visible">
            {/* Settings Cog Button - The ONLY button that toggles isPopoverOpen */}
            <button
              type="button"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className={`group relative w-10 h-10 rounded-xl p-0 flex items-center justify-center mx-auto transition cursor-pointer focus:outline-none ${
                isPopoverOpen
                  ? 'bg-emerald-500/15 text-[#1BA94C] dark:text-[#00EA64]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
              aria-label={isVie ? 'Cài đặt' : 'Settings'}
            >
              <Settings className="w-5 h-5 shrink-0" />

              {/* Floating Tooltip ONLY when Popover is closed */}
              {!isPopoverOpen && (
                <div className="hidden group-hover:flex items-center absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-medium whitespace-nowrap shadow-lg z-[60] pointer-events-none">
                  {isVie ? 'Cài đặt' : 'Settings'}
                </div>
              )}
            </button>

            {/* Static Avatar Badge - NO onClick, NO tooltip, NO pointer */}
            <div
              className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-semibold text-xs select-none shrink-0 cursor-default ${
                role === 'admin'
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : role === 'teacher'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-[#00EA64] border border-emerald-500/30'
              }`}
              title={cleanName}
            >
              {initials}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 overflow-visible">
            {/* Settings Cog row */}
            <button
              type="button"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              className={`w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs font-semibold transition cursor-pointer focus:outline-none ${
                isPopoverOpen
                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-[#1BA94C] dark:text-[#00EA64]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>{isVie ? 'Cài đặt' : 'Settings'}</span>
            </button>

            {/* User Profile row - STATIC, NO onClick */}
            <div className="w-full px-2 py-1.5 rounded-xl flex items-center gap-3 select-none">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 select-none ${
                  role === 'admin'
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    : role === 'teacher'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-[#00EA64] border border-emerald-500/30'
                }`}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {cleanName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  {roleBadgeText} {user.classGroup ? `• ${user.classGroup}` : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIDE POPOVER MENU (Gemini Style - anchored directly to Settings Cog level) */}
        {isPopoverOpen && (
          <div className="absolute bottom-14 left-full ml-3 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-[70] text-xs font-sans animate-in fade-in duration-150">
            {/* Header info */}
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white truncate text-xs">
                {cleanName}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                {user.email || `${user.username || 'user'}@hnue.edu.vn`}
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50">
                <span>{roleBadgeText}</span>
                {user.classGroup && <span>• {user.classGroup}</span>}
              </div>
            </div>

            {/* Menu List */}
            <div className="py-1 space-y-0.5">
              {/* Profile */}
              <button
                type="button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  onOpenSettings?.('profile');
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{isVie ? 'Hồ sơ cá nhân' : 'Profile'}</span>
              </button>

              {/* Student specific: Leaderboard */}
              {role === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onTabChange('leaderboard');
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{isVie ? 'Bảng xếp hạng' : 'Leaderboard'}</span>
                </button>
              )}

              {/* Settings / Password */}
              <button
                type="button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  onOpenSettings?.('password');
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{isVie ? 'Cài đặt (Đổi mật khẩu)' : 'Settings (Password)'}</span>
              </button>

              {/* Student specific: Submissions history */}
              {role === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onTabChange('submissions');
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{isVie ? 'Lịch sử nộp bài' : 'Submissions'}</span>
                </button>
              )}
            </div>

            {/* Divider & Logout */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>{isVie ? 'Đăng xuất' : 'Log out'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
