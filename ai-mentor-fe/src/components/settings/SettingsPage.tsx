import React, { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { changeUserPassword } from '../../services/mockAuth';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  User as UserIcon,
  KeyRound,
  Palette,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Check,
  Sun,
  Moon,
  School,
} from 'lucide-react';

interface SettingsPageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBackToDashboard: () => void;
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  initialTab?: 'profile' | 'password' | 'appearance';
  onTabChange?: (tab: 'profile' | 'password' | 'appearance') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  onBackToDashboard,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  initialTab = 'profile',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'appearance'>(initialTab);

  const handleSelectTab = (tab: 'profile' | 'password' | 'appearance') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Synchronize when initialTab prop updates
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Profile Form States
  const [displayName, setDisplayName] = useState(user.name);
  const [username, setUsername] = useState(user.username || 'student');
  const [bio, setBio] = useState(
    user.bio ||
      (currentLang === 'vie'
        ? 'Sinh viên Khoa Công nghệ Thông tin - Trường Đại học Sư phạm Hà Nội (HNUE). Đam mê cấu trúc dữ liệu và giải thuật.'
        : 'Computer Science student at Hanoi National University of Education (HNUE). Passionate about DSA and AI.')
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatar);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // 1. Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name: displayName.trim() || user.name,
      username: username.trim() || user.username,
      bio: bio.trim(),
      avatar: avatarUrl,
    };

    onUpdateUser(updatedUser);
    try {
      localStorage.setItem('ai_mentor_user', JSON.stringify(updatedUser));
    } catch {
      // Local storage fallback
    }

    setProfileSuccessMsg(
      currentLang === 'vie'
        ? 'Hồ sơ cá nhân đã được cập nhật thành công!'
        : 'Profile updated successfully!'
    );
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  // Handle Avatar Image Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // 2. Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError(
        currentLang === 'vie' ? 'Vui lòng nhập mật khẩu hiện tại.' : 'Please enter your current password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        currentLang === 'vie'
          ? 'Mật khẩu mới phải có tối thiểu 6 ký tự.'
          : 'New password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        currentLang === 'vie'
          ? 'Xác nhận mật khẩu mới không trùng khớp.'
          : 'New password confirmation does not match.'
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await changeUserPassword(user.id, currentPassword, newPassword);
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra.';
      setPasswordError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e141e] text-gray-900 dark:text-white transition-colors duration-200 antialiased">
      {/* 1. TOP HEADER / BREADCRUMBS */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-[#00EA64] hover:bg-gray-100 dark:hover:bg-slate-800/60 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentLang === 'vie' ? 'Quay lại Luyện tập' : 'Back to Practice'}</span>
          </button>

          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span
              onClick={onBackToDashboard}
              className="hover:text-emerald-600 dark:hover:text-[#00EA64] cursor-pointer font-medium"
            >
              AI Code Mentor
            </span>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-bold">
              {currentLang === 'vie' ? 'Cài đặt tài khoản' : 'Account Settings'}
            </span>
          </nav>
        </div>

        {/* Actions: Language Switcher, Theme Toggle & User Mini Profile Tag */}
        <div className="flex items-center gap-3">
          {/* Language Switcher VIE | ENG */}
          {onLanguageChange && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('vie')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currentLang === 'vie'
                    ? 'bg-white dark:bg-slate-700 text-[#1BA94C] dark:text-[#00EA64] font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                VIE
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('eng')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currentLang === 'eng'
                    ? 'bg-white dark:bg-slate-700 text-[#1BA94C] dark:text-[#00EA64] font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          {onThemeToggle && (
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors focus:outline-none"
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          )}

          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

          {/* User Mini Profile Tag */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0)
              )}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden md:inline">
              {displayName}
            </span>
          </div>
        </div>
      </header>

      {/* 2. GITHUB 2-COLUMN SETTINGS CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* ================= COLUMN 1: SIDEBAR NAVIGATION ================= */}
          <aside className="w-full md:w-64 flex-shrink-0">
            {/* Header: User Avatar & Account context */}
            <div className="flex items-center gap-3 pb-5 mb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#1BA94C] to-[#00EA64] text-white font-bold text-base flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">{displayName}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentLang === 'vie' ? 'Tài khoản cá nhân' : 'Your personal account'}
                </p>
              </div>
            </div>

            {/* Vertical Menu Buttons (GitHub Style) */}
            <nav className="flex flex-col gap-1" aria-label="Settings Categories">
              <button
                type="button"
                onClick={() => handleSelectTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00EA64] font-bold border-l-4 border-[#1BA94C]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <UserIcon className="w-4 h-4 flex-shrink-0" />
                <span>{currentLang === 'vie' ? 'Hồ sơ công khai' : 'Public Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('password')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === 'password'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00EA64] font-bold border-l-4 border-[#1BA94C]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <KeyRound className="w-4 h-4 flex-shrink-0" />
                <span>{currentLang === 'vie' ? 'Mật khẩu & Xác thực' : 'Password & Security'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('appearance')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === 'appearance'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00EA64] font-bold border-l-4 border-[#1BA94C]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Palette className="w-4 h-4 flex-shrink-0" />
                <span>{currentLang === 'vie' ? 'Giao diện (Appearance)' : 'Appearance'}</span>
              </button>
            </nav>
          </aside>

          {/* ================= COLUMN 2: CONTENT PANEL ================= */}
          <section className="flex-1 min-w-0">
            {/* TAB 1: PUBLIC PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-sans">
                    {currentLang === 'vie' ? 'Hồ sơ công khai' : 'Public Profile'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentLang === 'vie'
                      ? 'Thông tin này sẽ được hiển thị công khai trên bảng xếp hạng và hồ sơ thành tích sinh viên.'
                      : 'This information will be displayed publicly across leaderboards and course progress.'}
                  </p>
                </div>

                {/* Success Banner */}
                {profileSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-[#00EA64] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-white dark:bg-[#151f2e] border border-gray-200 dark:border-gray-800">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1BA94C] to-[#00EA64] text-white font-extrabold text-2xl flex items-center justify-center overflow-hidden ring-4 ring-emerald-500/20 shadow-md">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          displayName.charAt(0)
                        )}
                      </div>
                      <label className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-bold">Edit</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {user.role === 'teacher'
                          ? currentLang === 'vie'
                            ? 'Ảnh đại diện giảng viên'
                            : 'Instructor Profile Picture'
                          : currentLang === 'vie'
                          ? 'Ảnh đại diện sinh viên'
                          : 'Student Profile Picture'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentLang === 'vie'
                          ? 'PNG, JPG hoặc WebP. Kích thước khuyến nghị 256x256 px.'
                          : 'PNG, JPG or WebP. Recommended size 256x256 px.'}
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{currentLang === 'vie' ? 'Tải ảnh mới' : 'Upload photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {currentLang === 'vie' ? 'Họ và tên (Name)' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      placeholder={
                        user.role === 'teacher'
                          ? currentLang === 'vie'
                            ? 'TS. Phạm Văn Khải'
                            : 'Dr. Pham Van Khai'
                          : currentLang === 'vie'
                          ? 'Nguyễn Văn Minh'
                          : 'Nguyen Van Minh'
                      }
                      className="w-full max-w-lg h-11 px-3.5 text-xs rounded-xl bg-white dark:bg-[#151f2e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C]"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
                      {currentLang === 'vie'
                        ? 'Tên này sẽ xuất hiện trên giấy chứng nhận và giao diện IDE.'
                        : 'Your name will appear on certificates and the workspace header.'}
                    </p>
                  </div>

                  {/* Username Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {currentLang === 'vie' ? 'Tên đăng nhập (Username)' : 'Username'}
                    </label>
                    <div className="relative max-w-lg">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={user.role === 'teacher' ? 'dr_khai_cs' : 'student_k72'}
                        className="w-full h-11 pl-8 pr-3.5 text-xs rounded-xl bg-white dark:bg-[#151f2e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C]"
                      />
                    </div>
                  </div>

                  {/* Bio Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {currentLang === 'vie' ? 'Giới thiệu ngắn (Bio)' : 'Bio'}
                    </label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={
                        currentLang === 'vie'
                          ? 'Chia sẻ ngắn về mục tiêu học tập, kỹ năng lập trình của bạn...'
                          : 'Briefly share your learning goals or coding experience...'
                      }
                      className="w-full max-w-lg p-3.5 text-xs rounded-xl bg-white dark:bg-[#151f2e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C]"
                    />
                  </div>

                  {/* Institutional Info Card */}
                  <div className="max-w-lg p-4 rounded-xl bg-slate-50 dark:bg-[#121926] border border-gray-200 dark:border-gray-800 text-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00EA64] font-bold">
                      <School className="w-4 h-4" />
                      <span>
                        {currentLang === 'vie'
                          ? 'Trường Đại học Sư phạm Hà Nội (HNUE)'
                          : 'Hanoi National University of Education (HNUE)'}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{currentLang === 'vie' ? 'Email trường:' : 'Institutional Email:'}</span>
                      <span className="font-mono text-gray-900 dark:text-white font-semibold">{user.email}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>
                        {user.role === 'teacher'
                          ? currentLang === 'vie'
                            ? 'Đơn vị công tác:'
                            : 'Department:'
                          : currentLang === 'vie'
                          ? 'Lớp sinh hoạt:'
                          : 'Class Group:'}
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {user.role === 'teacher'
                          ? currentLang === 'vie'
                            ? 'Bộ môn KHMT • Giảng viên'
                            : 'CS Dept • Lecturer'
                          : user.classGroup || 'K72 CNTT A'}
                      </span>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#1BA94C] hover:bg-[#15893d] text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{currentLang === 'vie' ? 'Lưu thay đổi hồ sơ' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: PASSWORD AND AUTHENTICATION */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-sans">
                    {currentLang === 'vie' ? 'Mật khẩu & Xác thực' : 'Password & Security'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentLang === 'vie'
                      ? 'Cập nhật mật khẩu thường xuyên để tăng cường an toàn cho tài khoản.'
                      : 'Update your password regularly to keep your account safe.'}
                  </p>
                </div>

                {/* Error Banner */}
                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {passwordSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-[#00EA64] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {currentLang === 'vie' ? 'Mật khẩu hiện tại (Old password)' : 'Current Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 px-3.5 pr-10 text-xs rounded-xl bg-white dark:bg-[#151f2e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {currentLang === 'vie' ? 'Mật khẩu mới (New password)' : 'New Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={
                          currentLang === 'vie' ? 'Tối thiểu 6 ký tự' : 'Minimum 6 characters'
                        }
                        className="w-full h-11 px-3.5 pr-10 text-xs rounded-xl bg-white dark:bg-[#151f2e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>
                          {newPassword.length >= 6
                            ? currentLang === 'vie'
                              ? 'Độ dài đạt chuẩn an toàn'
                              : 'Strong password length'
                            : currentLang === 'vie'
                            ? 'Cần thêm ký tự'
                            : 'Too short'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                      {currentLang === 'vie' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 px-3.5 pr-10 text-xs rounded-xl bg-white dark:bg-[#151f2e] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <div className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            confirmPassword === newPassword ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>
                          {confirmPassword === newPassword
                            ? currentLang === 'vie'
                              ? 'Mật khẩu trùng khớp hoàn toàn'
                              : 'Passwords match'
                            : currentLang === 'vie'
                            ? 'Chưa trùng khớp'
                            : 'Does not match'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-6 py-2.5 rounded-xl bg-[#1BA94C] hover:bg-[#15893d] text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-700/20 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      {isChangingPassword ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <KeyRound className="w-4 h-4" />
                      )}
                      <span>{currentLang === 'vie' ? 'Cập nhật mật khẩu' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-sans">
                    {currentLang === 'vie' ? 'Tùy chỉnh giao diện' : 'Appearance Settings'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentLang === 'vie'
                      ? 'Chọn chủ đề hiển thị yêu thích cho toàn bộ giao diện bài học và Web IDE.'
                      : 'Choose your preferred theme across the platform and Web IDE.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
                  {/* Dark Mode Card */}
                  <div
                    onClick={() => {
                      if (currentTheme !== 'dark') onThemeToggle();
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      currentTheme === 'dark'
                        ? 'border-[#00EA64] bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                    }`}
                  >
                    <div className="h-28 rounded-xl bg-[#0e141e] border border-gray-800 p-3 flex flex-col justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-3/4 h-2 rounded bg-slate-700" />
                        <div className="w-1/2 h-2 rounded bg-slate-800" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {currentLang === 'vie' ? 'Giao diện tối (Mặc định)' : 'Dark Mode (Default)'}
                        </span>
                      </div>
                      {currentTheme === 'dark' && (
                        <span className="w-5 h-5 rounded-full bg-[#1BA94C] text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Light Mode Card */}
                  <div
                    onClick={() => {
                      if (currentTheme !== 'light') onThemeToggle();
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      currentTheme === 'light'
                        ? 'border-[#1BA94C] bg-emerald-50 shadow-lg shadow-emerald-100'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                    }`}
                  >
                    <div className="h-28 rounded-xl bg-white border border-gray-200 p-3 flex flex-col justify-between mb-3 shadow-inner">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-3/4 h-2 rounded bg-slate-200" />
                        <div className="w-1/2 h-2 rounded bg-slate-100" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {currentLang === 'vie' ? 'Giao diện sáng' : 'Light Mode'}
                        </span>
                      </div>
                      {currentTheme === 'light' && (
                        <span className="w-5 h-5 rounded-full bg-[#1BA94C] text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
