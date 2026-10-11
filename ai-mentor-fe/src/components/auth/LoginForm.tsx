import React, { useState, useEffect } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  mockLogin,
  mockRegister,
  checkEmailExists,
} from '../../services/mockAuth';
import { User, UserRole } from '../../types/auth';
import { Language, translations } from './i18n';

interface LoginFormProps {
  onLoginSuccess: (user: User, token: string) => void;
  lang: Language;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  loginIdentifier?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, lang }) => {
  const t = translations[lang];
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('student');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status and error states
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toastSuccess) return;
    const timer = setTimeout(() => {
      setToastSuccess(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastSuccess]);

  const clearErrors = (field?: keyof FieldErrors) => {
    if (field) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      setFieldErrors({});
    }
    setGeneralError(null);
  };

  const switchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setFieldErrors({});
    setGeneralError(null);
    setToastSuccess(null);
    if (mode === 'register') {
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      if (!loginIdentifier) setLoginIdentifier('student');
      if (!password) setPassword('123456');
    }
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (authMode === 'register') {
      // 1. Full name (Họ và tên)
      const trimmedName = fullName.trim();
      if (!trimmedName) {
        errors.fullName = t.errFullNameRequired;
      } else if (trimmedName.length < 3) {
        errors.fullName = t.errFullNameMin;
      }

      // 2. Email (Địa chỉ Email)
      const trimmedEmail = email.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmedEmail) {
        errors.email = t.errEmailRequired;
      } else if (!emailRegex.test(trimmedEmail)) {
        errors.email = t.errEmailInvalid;
      } else if (checkEmailExists(trimmedEmail)) {
        errors.email = t.errEmailExists;
      }

      // 3. Password (Mật khẩu)
      if (!password) {
        errors.password = t.errPasswordRequired;
      } else if (password.length < 6) {
        errors.password = t.errPasswordMin;
      }

      // 4. Confirm password (Xác nhận mật khẩu)
      if (!confirmPassword) {
        errors.confirmPassword = t.errConfirmPasswordRequired;
      } else if (password !== confirmPassword) {
        errors.confirmPassword = t.errConfirmPasswordMismatch;
      }
    } else {
      // Login validation
      const trimmedIdentifier = loginIdentifier.trim();
      if (!trimmedIdentifier) {
        errors.loginIdentifier = t.errLoginIdentifierRequired;
      }
      if (!password) {
        errors.password = t.errPasswordRequired;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    clearErrors();
    setToastSuccess(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (authMode === 'register') {
        // Register new account with auto-generated unique username
        const result = await mockRegister(fullName, email, password, role);

        // Show self-dismissing success toast
        setToastSuccess(
          lang === 'vie'
            ? `Đăng ký thành công! Tên đăng nhập: ${result.user.username}`
            : `Account created! Your username: ${result.user.username}`
        );

        // Switch to login form with pre-filled registered username
        setTimeout(() => {
          setAuthMode('login');
          setLoginIdentifier(result.user.username || email.trim().toLowerCase());
          setPassword('');
          setFieldErrors({});
          setGeneralError(null);
          setIsLoading(false);
        }, 1500);
      } else {
        // Login with username or email
        const result = await mockLogin(loginIdentifier, password);
        onLoginSuccess(result.user, result.token);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError(
          lang === 'vie'
            ? 'Đã xảy ra lỗi không xác định. Vui lòng thử lại!'
            : 'An unexpected error occurred. Please try again!'
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${authMode === 'register' ? 'max-w-[420px]' : 'max-w-[450px]'} mx-auto px-4 sm:px-6 transition-all duration-200`}>
      {/* MOBILE / TABLET LOGO (Khi ẩn cột trái) */}
      <div className="flex lg:hidden items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-md bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-sm">
          <span className="font-mono text-lg font-extrabold select-none">H</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 uppercase font-sans">
          AI Code Mentor
        </span>
      </div>

      {/* HEADER SECTION (Top-aligned, HackerRank style) */}
      <div className={`select-none text-left ${authMode === 'register' ? 'mb-2 space-y-0.5' : 'mb-5 space-y-1'}`}>
        <h2 className={`${authMode === 'register' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold text-slate-900 tracking-tight font-sans`}>
          {authMode === 'login' ? t.loginWelcome : t.registerWelcome}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-700">
          {authMode === 'login' ? t.loginSub : t.registerSub}
        </p>
        {authMode === 'login' && (
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {t.loginDesc}
          </p>
        )}
      </div>

      {/* GENERAL ERROR BANNER */}
      {generalError && (
        <div
          role="alert"
          id="auth-general-error"
          className="mb-2 p-2 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-2 text-red-700 text-xs animate-shake"
        >
          <ExclamationCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="font-medium leading-snug">{generalError}</div>
        </div>
      )}

      {/* SUCCESS TOAST NOTIFICATION (Tự động tắt sau 3 giây) */}
      {toastSuccess && (
        <div
          role="status"
          className="mb-2 p-2 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-md flex items-center justify-between gap-2 text-emerald-800 text-xs shadow-sm animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <span className="font-semibold">{toastSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded transition-colors"
            aria-label="Đóng thông báo"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN AUTH FORM (Fit 100vh Zero-Scroll) */}
      <form onSubmit={handleSubmit} noValidate className={authMode === 'register' ? 'space-y-2' : 'space-y-4'}>
        {/* ================= REGISTER FIELDS (4 trường + Vai trò) ================= */}
        {authMode === 'register' && (
          <>
            {/* 1. Full name (Họ và tên) */}
            <div>
              <label
                htmlFor="fullname-input"
                className="block text-[11px] font-semibold text-slate-700 mb-0.5 select-none"
              >
                {t.fullNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="fullname-input"
                name="name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearErrors('fullName');
                }}
                placeholder={t.fullNamePlaceholder}
                required
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? 'fullname-error' : undefined}
                className={`w-full h-9 px-3 bg-white border rounded-md text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none ${
                  fieldErrors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                    : 'border-slate-300 focus:border-[#1BA94C] focus:ring-1 focus:ring-[#1BA94C]/25'
                }`}
              />
              {fieldErrors.fullName && (
                <p id="fullname-error" className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1 font-medium">
                  <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{fieldErrors.fullName}</span>
                </p>
              )}
            </div>

            {/* 2. Email (Địa chỉ Email) */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-[11px] font-semibold text-slate-700 mb-0.5 select-none"
              >
                {t.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="email-input"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearErrors('email');
                }}
                placeholder={t.emailPlaceholder}
                required
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className={`w-full h-9 px-3 bg-white border rounded-md text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none ${
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                    : 'border-slate-300 focus:border-[#1BA94C] focus:ring-1 focus:ring-[#1BA94C]/25'
                }`}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1 font-medium">
                  <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* ================= LOGIN FIELD: USERNAME OR EMAIL ================= */}
        {authMode === 'login' && (
          <div>
            <label
              htmlFor="login-identifier-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5 select-none"
            >
              {t.loginUsernameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              id="login-identifier-input"
              name="loginIdentifier"
              type="text"
              autoComplete="username"
              value={loginIdentifier}
              onChange={(e) => {
                setLoginIdentifier(e.target.value);
                clearErrors('loginIdentifier');
              }}
              placeholder={t.loginUsernamePlaceholder}
              required
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.loginIdentifier)}
              aria-describedby={fieldErrors.loginIdentifier ? 'login-identifier-error' : undefined}
              className={`w-full h-11 px-3.5 bg-white border rounded-md text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none ${
                fieldErrors.loginIdentifier
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                  : 'border-slate-300 focus:border-[#1BA94C] focus:ring-1 focus:ring-[#1BA94C]/25'
              }`}
            />
            {fieldErrors.loginIdentifier && (
              <p id="login-identifier-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{fieldErrors.loginIdentifier}</span>
              </p>
            )}
          </div>
        )}

        {/* ================= PASSWORD FIELD ================= */}
        <div>
          <label
            htmlFor="password-input"
            className={`block font-semibold text-slate-700 select-none ${
              authMode === 'register' ? 'text-[11px] mb-0.5' : 'text-xs mb-1'
            }`}
          >
            {t.passwordLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password-input"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors('password');
              }}
              placeholder={authMode === 'register' ? t.passwordRegisterPlaceholder : t.passwordLoginPlaceholder}
              required
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              className={`w-full ${authMode === 'register' ? 'h-9 text-sm' : 'h-11 text-[15px]'} pl-3.5 pr-11 bg-white border rounded-md text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none ${
                fieldErrors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                  : 'border-slate-300 focus:border-[#1BA94C] focus:ring-1 focus:ring-[#1BA94C]/25'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <EyeIcon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1 font-medium">
              <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{fieldErrors.password}</span>
            </p>
          )}
        </div>

        {/* AUXILIARY ROW (LOGIN ONLY): REMEMBER ME & FORGOT PASSWORD */}
        {authMode === 'login' && (
          <div className="flex items-center justify-between pt-0.5 select-none">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                id="remember-me-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#1BA94C] focus:ring-[#1BA94C] accent-[#1BA94C] cursor-pointer"
              />
              <span>{t.rememberMe}</span>
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert(t.forgotPasswordAlert);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus-visible:outline-none"
            >
              {t.forgotPassword}
            </a>
          </div>
        )}

        {/* REGISTER FIELDS: CONFIRM PASSWORD & ROLE */}
        {authMode === 'register' && (
          <>
            <div>
              <label
                htmlFor="confirm-password-input"
                className="block text-[11px] font-semibold text-slate-700 mb-0.5 select-none"
              >
                {t.confirmPasswordLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password-input"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearErrors('confirmPassword');
                  }}
                  placeholder={t.confirmPasswordPlaceholder}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                  className={`w-full h-9 pl-3.5 pr-11 bg-white border rounded-md text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none ${
                    fieldErrors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : 'border-slate-300 focus:border-[#1BA94C] focus:ring-1 focus:ring-[#1BA94C]/25'
                  }`}
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
              {fieldErrors.confirmPassword && (
                <p id="confirm-password-error" className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1 font-medium">
                  <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{fieldErrors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* ROLE SELECTOR */}
            <div className="pt-0 select-none">
              <span className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                {t.roleSelectorLabel}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`h-8 px-2.5 rounded-md text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    role === 'student'
                      ? 'border-[#1BA94C] bg-emerald-50 text-[#1BA94C]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{t.studentRoleOption}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`h-8 px-2.5 rounded-md text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    role === 'teacher'
                      ? 'border-[#1BA94C] bg-emerald-50 text-[#1BA94C]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{t.teacherRoleOption}</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* PRIMARY SUBMIT BUTTON */}
        <button
          type="submit"
          id="btn-auth-submit"
          disabled={isLoading}
          className={`w-full ${authMode === 'register' ? 'h-10 py-2 mt-1 text-sm' : 'h-12 py-3 mt-2 text-base'} rounded-md bg-[#1BA94C] hover:bg-[#15893d] active:scale-[0.99] text-white font-semibold tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1BA94C] disabled:opacity-60 disabled:cursor-not-allowed select-none`}
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>{authMode === 'login' ? t.loggingInBtn : t.signingUpBtn}</span>
            </>
          ) : (
            <span>{authMode === 'login' ? t.logInBtn : t.signUpBtn}</span>
          )}
        </button>
      </form>

      {/* FOOTER: TOGGLE AUTH MODES (HackerRank Clean Style) */}
      <div className={`${authMode === 'register' ? 'mt-2.5 pt-1.5' : 'mt-5 pt-3.5'} border-t border-slate-100 text-center text-xs text-slate-600 select-none`}>
        {authMode === 'login' ? (
          <>
            <span>{t.dontHaveAccount} </span>
            <button
              type="button"
              id="btn-switch-to-register"
              onClick={() => switchMode('register')}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus-visible:outline-none ml-1"
            >
              {t.signUpLink}
            </button>
          </>
        ) : (
          <>
            <span>{t.alreadyHaveAccount} </span>
            <button
              type="button"
              id="btn-switch-to-login"
              onClick={() => switchMode('login')}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus-visible:outline-none ml-1"
            >
              {t.logInLink}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
