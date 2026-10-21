import React, { useState, useEffect } from 'react';
import { AuthLayout } from './auth/AuthLayout';
import { BrandSidebar } from './auth/BrandSidebar';
import { LoginForm } from './auth/LoginForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import { ResetPasswordForm } from './auth/ResetPasswordForm';
import { Language } from './auth/i18n';
import { User } from '../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  currentLang?: Language;
  onLanguageChange?: (newLang: Language) => void;
}

type AuthRouteView = 'login' | 'forgot' | 'reset';

function parseAuthUrl(): { view: AuthRouteView; token: string; account: string } {
  if (typeof window === 'undefined') {
    return { view: 'login', token: '', account: '' };
  }

  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search;
  const hash = window.location.hash;

  // 1. Kiểm tra Route Đặt lại mật khẩu (từ link Gmail hoặc hash)
  const isResetPath =
    pathname === '/auth/reset-password' ||
    pathname === '/reset-password' ||
    pathname.endsWith('/auth/reset-password') ||
    pathname.endsWith('/reset-password');

  const isResetHash =
    hash.startsWith('#/auth/reset-password') ||
    hash.startsWith('#/reset-password');

  if (isResetPath || isResetHash) {
    // Ưu tiên đọc search params từ URL query chuẩn (?email=...&token=...)
    let searchParams = new URLSearchParams(search);

    // Nếu search rỗng, thử đọc query params đính kèm trong hash (#/reset-password?email=...)
    if (!searchParams.get('email') && !searchParams.get('token') && hash.includes('?')) {
      const hashQuery = hash.split('?')[1] || '';
      searchParams = new URLSearchParams(hashQuery);
    }

    const emailParam = searchParams.get('email') || searchParams.get('account') || '';
    const tokenParam = searchParams.get('token') || '';

    return {
      view: 'reset',
      token: tokenParam,
      account: emailParam,
    };
  }

  // 2. Kiểm tra Route Quên mật khẩu
  const isForgotPath =
    pathname === '/auth/forgot-password' ||
    pathname === '/forgot-password';

  const isForgotHash =
    hash.startsWith('#/auth/forgot-password') ||
    hash.startsWith('#/forgot-password');

  if (isForgotPath || isForgotHash) {
    return { view: 'forgot', token: '', account: '' };
  }

  // 3. Mặc định là Trang Đăng nhập
  return { view: 'login', token: '', account: '' };
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  currentLang = 'vie',
  onLanguageChange,
}) => {
  const initialNav = parseAuthUrl();
  const [authView, setAuthView] = useState<AuthRouteView>(initialNav.view);
  const [resetAccount, setResetAccount] = useState<string>(initialNav.account || '');
  const [resetToken, setResetToken] = useState<string>(initialNav.token || '');
  const [prefilledIdentifier, setPrefilledIdentifier] = useState<string>('');

  const lang = currentLang;

  // Lắng nghe cả sự kiện hashchange và popstate để back/forward/F5 hoạt động chuẩn xác 100%
  useEffect(() => {
    const handleUrlChange = () => {
      const currentNav = parseAuthUrl();
      setAuthView(currentNav.view);
      if (currentNav.account !== undefined) setResetAccount(currentNav.account);
      if (currentNav.token !== undefined) setResetToken(currentNav.token);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      try {
        localStorage.setItem('ai_mentor_lang', newLang);
      } catch {
        // Ignore storage error
      }
    }
  };

  const navigateToLogin = (accountToPrefill?: string) => {
    if (accountToPrefill) {
      setPrefilledIdentifier(accountToPrefill);
    }
    // Nếu đang ở pathname /auth/reset-password, chuyển về path root hoặc /login
    if (window.location.pathname.includes('/reset-password') || window.location.pathname.includes('/forgot-password')) {
      window.history.pushState(null, '', '/login');
    } else {
      window.location.hash = '#/login';
    }
    setAuthView('login');
  };

  const navigateToForgot = () => {
    window.location.hash = '#/forgot-password';
    setAuthView('forgot');
  };

  return (
    <AuthLayout
      sidebar={<BrandSidebar lang={lang} />}
      currentLang={lang}
      onLanguageChange={handleLanguageChange}
    >
      {authView === 'forgot' && (
        <ForgotPasswordForm
          lang={lang}
          onBackToLogin={() => navigateToLogin()}
        />
      )}

      {authView === 'reset' && (
        <ResetPasswordForm
          lang={lang}
          account={resetAccount}
          token={resetToken}
          onSuccessRedirect={(updatedUser) => navigateToLogin(updatedUser || resetAccount)}
          onBackToLogin={() => navigateToLogin()}
        />
      )}

      {authView === 'login' && (
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          lang={lang}
          onNavigateToForgot={navigateToForgot}
          initialIdentifier={prefilledIdentifier}
        />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
