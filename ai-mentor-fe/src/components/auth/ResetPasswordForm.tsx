import React, { useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { resetPasswordService } from '../../services/authService';
import { Language, translations } from './i18n';

interface ResetPasswordFormProps {
  lang: Language;
  account: string;
  token?: string;
  onSuccessRedirect: (updatedUsername?: string) => void;
  onBackToLogin: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  lang,
  account,
  token: _token,
  onSuccessRedirect,
  onBackToLogin,
}) => {
  const t = translations[lang];

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!account) {
      setErrorMessage(t.resetInvalidLink);
      return;
    }

    if (!newPassword) {
      setErrorMessage(t.errPasswordRequired);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(t.resetMinLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t.resetMismatch);
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API resetPassword (POST /api/v1/auth/reset-password)
      await resetPasswordService({
        email: account,
        token: _token || '',
        newPassword,
      });

      setSuccessMessage(t.resetSuccessToast);
      setIsLoading(false);

      // Auto redirect to Login after 1.8 seconds with username prefilled
      setTimeout(() => {
        onSuccessRedirect(account);
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.resetInvalidLink;
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] mx-auto px-4 sm:px-6 transition-all duration-200">
      {/* MOBILE / TABLET LOGO */}
      <div className="flex lg:hidden items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-md bg-[#16a34a] flex items-center justify-center font-bold text-white shadow-sm">
          <span className="font-mono text-lg font-extrabold select-none">H</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 uppercase font-sans">
          AI Code Mentor
        </span>
      </div>

      {/* HEADER SECTION */}
      <div className="select-none text-left mb-5 space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
          {t.resetTitle}
        </h2>
        <div className="flex items-center gap-1.5 pt-0.5">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-slate-500 font-medium">
            {t.resetAccountPrefix}{' '}
            <strong className="text-slate-800 font-semibold font-mono">{account || 'student@hnue.edu.vn'}</strong>
          </span>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-3 p-2.5 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-2 text-red-700 text-xs animate-shake"
        >
          <ExclamationCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="font-medium leading-snug">{errorMessage}</div>
        </div>
      )}

      {/* SUCCESS BANNER */}
      {successMessage && (
        <div
          role="status"
          className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-md flex items-start gap-2 text-emerald-800 text-xs shadow-sm animate-fadeIn"
        >
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="font-semibold leading-relaxed">{successMessage}</div>
        </div>
      )}

      {/* RESET PASSWORD FORM */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* NEW PASSWORD */}
        <div>
          <label
            htmlFor="new-password-input"
            className="block text-xs font-semibold text-slate-700 mb-1 select-none"
          >
            {t.resetNewPassLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="new-password-input"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder={t.resetNewPassPlaceholder}
              required
              aria-required="true"
              className="w-full h-11 pl-3.5 pr-11 bg-white border border-slate-300 rounded-md text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/25"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <EyeIcon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* CONFIRM NEW PASSWORD */}
        <div>
          <label
            htmlFor="confirm-new-password-input"
            className="block text-xs font-semibold text-slate-700 mb-1 select-none"
          >
            {t.resetConfirmPassLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-new-password-input"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder={t.resetConfirmPassPlaceholder}
              required
              aria-required="true"
              className="w-full h-11 pl-3.5 pr-11 bg-white border border-slate-300 rounded-md text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/25"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <EyeIcon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* PRIMARY SUBMIT BUTTON */}
        <button
          type="submit"
          id="btn-update-password"
          disabled={isLoading || Boolean(successMessage)}
          style={{ backgroundColor: '#16a34a' }}
          className="w-full h-12 py-3 mt-2 rounded-md hover:bg-[#15803d] active:scale-[0.99] text-white font-bold text-base tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed select-none"
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>{t.resetUpdatingBtn}</span>
            </>
          ) : (
            <span>{t.resetSubmitBtn}</span>
          )}
        </button>
      </form>

      {/* FOOTER: BACK TO LOGIN */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600 select-none">
        <span>{t.forgotBackTo}</span>
        <button
          type="button"
          onClick={onBackToLogin}
          id="btn-back-to-login-from-reset"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus-visible:outline-none ml-1"
        >
          {t.forgotLoginWord}
        </button>
      </div>
    </div>
  );
};
