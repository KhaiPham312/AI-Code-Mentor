import React, { useState } from 'react';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { forgotPassword } from '../../services/authService';
import { Language, translations } from './i18n';

interface ForgotPasswordFormProps {
  lang: Language;
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  lang,
  onBackToLogin,
}) => {
  const t = translations[lang];

  const [identifier, setIdentifier] = useState('student@hnue.edu.vn');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    const trimmed = identifier.trim();

    if (!trimmed) {
      setErrorMessage(
        lang === 'vie'
          ? 'Vui lòng nhập email hoặc tên đăng nhập của bạn.'
          : 'Please enter your email or username.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API forgotPassword (POST /api/v1/auth/forgot-password)
      const res = await forgotPassword(trimmed);
      setResetEmail(res.email || trimmed);
      setSentSuccess(true);
      setIsLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.forgotNotFound;
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

      {/* HEADER SECTION (HackerRank Clean Typography) */}
      <div className="select-none text-left mb-5 space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
          {t.forgotTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {t.forgotDesc}
        </p>
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

      {/* SUCCESS CONFIRMATION BANNER */}
      {sentSuccess && (
        <div
          role="status"
          className="mb-4 p-3.5 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-md flex items-start gap-2.5 text-emerald-800 text-xs shadow-sm animate-fadeIn"
        >
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed font-medium">
            <span>{t.forgotSuccessSentPart1}</span>
            <strong className="underline text-emerald-950 font-mono font-bold">{resetEmail}</strong>
            <span>{t.forgotSuccessSentPart2}</span>
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="forgot-identifier-input"
            className="block text-xs font-semibold text-slate-700 mb-1.5 select-none"
          >
            {t.forgotInputLabel}
          </label>
          <input
            id="forgot-identifier-input"
            name="identifier"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrorMessage(null);
            }}
            placeholder={t.forgotInputPlaceholder}
            required
            aria-required="true"
            className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-md text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]/25"
          />
        </div>

        {/* PRIMARY SUBMIT BUTTON */}
        <button
          type="submit"
          id="btn-send-reset-link"
          disabled={isLoading}
          style={{ backgroundColor: '#16a34a' }}
          className="w-full h-12 py-3 mt-2 rounded-md hover:bg-[#15803d] active:scale-[0.99] text-white font-bold text-base tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed select-none"
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>{t.forgotSendingBtn}</span>
            </>
          ) : (
            <span>{t.forgotSendBtn}</span>
          )}
        </button>
      </form>

      {/* FOOTER: BACK TO LOGIN */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600 select-none">
        <span>{t.forgotBackTo}</span>
        <button
          type="button"
          onClick={onBackToLogin}
          id="btn-back-to-login"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus-visible:outline-none ml-1"
        >
          {t.forgotLoginWord}
        </button>
      </div>
    </div>
  );
};
