import React from 'react';
import { Language } from './i18n';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  return (
    <div
      role="group"
      aria-label="Language Selector"
      className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-sm text-[11px] font-semibold select-none transition-all"
    >
      <button
        type="button"
        onClick={() => onLanguageChange('vie')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
          currentLang === 'vie'
            ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
        aria-pressed={currentLang === 'vie'}
      >
        VIE
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('eng')}
        className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
          currentLang === 'eng'
            ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
        aria-pressed={currentLang === 'eng'}
      >
        ENG
      </button>
    </div>
  );
};
