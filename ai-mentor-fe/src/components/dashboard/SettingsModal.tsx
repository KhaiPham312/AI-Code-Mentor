import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/auth';
import { changeUserPassword } from '../../services/mockAuth';
import { Language } from './dashboardI18n';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User as UserIcon,
  Shield,
  Sliders,
  Check,
} from 'lucide-react';
import gsap from 'gsap';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  currentLang: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  currentLang,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'password' | 'profile' | 'preferences'>('password');

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // GSAP Entrance animation
  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power1.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.94, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage(
        currentLang === 'vie'
          ? 'Vui lòng nhập mật khẩu hiện tại.'
          : 'Please enter your current password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        currentLang === 'vie'
          ? 'Mật khẩu mới phải có tối thiểu 6 ký tự.'
          : 'New password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        currentLang === 'vie'
          ? 'Xác nhận mật khẩu mới không khớp.'
          : 'New password confirmation does not match.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await changeUserPassword(user.id, currentPassword, newPassword);
      setSuccessMessage(
        currentLang === 'vie' ? res.message : 'Password changed successfully!'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* LEFT: SIDEBAR TABS (HackerRank Settings style) */}
        <div className="w-full md:w-56 p-4 md:p-5 bg-slate-50 dark:bg-[#0c121d] border-b md:border-b-0 md:border-r border-slate-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
              {currentLang === 'vie' ? 'Cài đặt' : 'Settings'}
            </h2>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'password'
                  ? 'bg-[#1BA94C] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{currentLang === 'vie' ? 'Đổi mật khẩu' : 'Password'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-[#1BA94C] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{currentLang === 'vie' ? 'Hồ sơ người dùng' : 'Profile'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'bg-[#1BA94C] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{currentLang === 'vie' ? 'Tùy chọn & Bảo mật' : 'Security'}</span>
            </button>
          </nav>
        </div>

        {/* RIGHT: MAIN CONTENT AREA */}
        <div className="flex-1 p-6 sm:p-7 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Modal Header Row */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                  {activeTab === 'password'
                    ? currentLang === 'vie'
                      ? 'Đổi mật khẩu (Password)'
                      : 'Password'
                    : activeTab === 'profile'
                    ? currentLang === 'vie'
                      ? 'Hồ sơ cá nhân'
                      : 'Account Profile'
                    : currentLang === 'vie'
                    ? 'Tùy chọn bảo mật'
                    : 'Security Preferences'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeTab === 'password'
                    ? currentLang === 'vie'
                      ? 'Nhập mật khẩu hiện tại cùng mật khẩu mới để thay đổi.'
                      : 'Enter your current password along with a new one to change it.'
                    : currentLang === 'vie'
                    ? 'Thông tin định danh sinh viên Khoa CNTT - ĐHSP Hà Nội'
                    : 'Student information enrolled in Hanoi National University of Education'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB 1: PASSWORD CHANGE FORM */}
            {activeTab === 'password' && (
              <form onSubmit={handleSubmitPassword} className="space-y-4">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* 1. Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {currentLang === 'vie' ? 'Mật khẩu hiện tại (Current Password)' : 'Current Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 pr-10 text-xs rounded-lg bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {currentLang === 'vie' ? 'Mật khẩu mới (New Password)' : 'New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={
                        currentLang === 'vie' ? 'Tối thiểu 6 ký tự' : 'Minimum 6 characters'
                      }
                      className="w-full h-10 px-3.5 pr-10 text-xs rounded-lg bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span>
                        {newPassword.length >= 6
                          ? currentLang === 'vie'
                            ? 'Độ dài hợp lệ'
                            : 'Valid length'
                          : currentLang === 'vie'
                          ? 'Cần thêm ký tự'
                          : 'Too short'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {currentLang === 'vie'
                      ? 'Xác nhận mật khẩu mới (Confirm New Password)'
                      : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3.5 pr-10 text-xs rounded-lg bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          confirmPassword === newPassword ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span>
                        {confirmPassword === newPassword
                          ? currentLang === 'vie'
                            ? 'Mật khẩu trùng khớp'
                            : 'Passwords match'
                          : currentLang === 'vie'
                          ? 'Mật khẩu chưa khớp'
                          : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Change Password Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-[#1BA94C] hover:bg-[#15893d] text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>
                      {currentLang === 'vie' ? 'Đổi mật khẩu' : 'Change Password'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-gray-800">
                    <span className="text-slate-400 font-medium">Họ và tên:</span>
                    <strong className="text-slate-900 dark:text-white">{user.name}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-gray-800">
                    <span className="text-slate-400 font-medium">Tên đăng nhập:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{user.username || 'student'}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-gray-800">
                    <span className="text-slate-400 font-medium">Email trường:</span>
                    <strong className="text-slate-900 dark:text-white">{user.email}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Lớp sinh hoạt:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#00EA64] font-semibold text-[11px]">
                      {user.classGroup || 'K72 CNTT A • HNUE'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Bảo mật hai lớp (2FA)</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Xác thực mã OTP qua Email sinh viên</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                    Sắp ra mắt
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
