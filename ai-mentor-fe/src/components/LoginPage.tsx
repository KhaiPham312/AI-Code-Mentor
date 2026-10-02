import React, { useState } from 'react';
import { AuthLayout } from './auth/AuthLayout';
import { BrandSidebar } from './auth/BrandSidebar';
import { LoginForm } from './auth/LoginForm';
import { Language } from './auth/i18n';
import { User } from '../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_lang');
      if (saved === 'eng' || saved === 'vie') return saved;
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'vie';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('ai_mentor_lang', newLang);
    } catch {
      // Ignore storage error
    }
  };

  return (
    <AuthLayout
      sidebar={<BrandSidebar lang={lang} />}
      currentLang={lang}
      onLanguageChange={handleLanguageChange}
    >
      <LoginForm onLoginSuccess={onLoginSuccess} lang={lang} />
    </AuthLayout>
  );
};

export default LoginPage;
