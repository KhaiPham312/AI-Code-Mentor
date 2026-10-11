import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Language } from './i18n';

interface AuthLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  sidebar,
  children,
  currentLang,
  onLanguageChange,
}) => {
  return (
    <div className="h-screen max-h-screen w-full flex bg-white text-slate-900 overflow-hidden antialiased">
      {/* LEFT COLUMN: BRANDING & 3D GLOBE (55% on Desktop) */}
      {sidebar}

      {/* RIGHT COLUMN: BALANCED AUTH CARD (45% on Desktop, zero-scroll) */}
      <main className="relative w-full lg:w-[45%] h-full max-h-screen flex flex-col justify-center items-center py-4 px-6 sm:px-8 bg-white overflow-hidden">
        {/* Language Switcher Pill at Top-Right */}
        <div className="absolute top-4 sm:top-5 right-5 sm:right-7 z-20">
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
        </div>

        {/* Auth Form Container */}
        {children}
      </main>
    </div>
  );
};
