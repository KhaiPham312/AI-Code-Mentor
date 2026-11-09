import React from 'react';
import { User } from '../../types/auth';
import { Language, ThemeMode, dashboardTranslations } from './dashboardI18n';
import { Sun, Moon } from 'lucide-react';

interface DashboardNavbarProps {
  user: User;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onLogout?: () => void;
  onOpenIDE?: () => void;
  onOpenSubmissions?: () => void;
  activeNavTab?: 'practice' | 'kits' | 'leaderboard' | 'ai-mentor';
  onNavTabChange?: (tab: 'practice' | 'kits' | 'leaderboard' | 'ai-mentor') => void;
  onOpenSettings?: (tab?: 'profile' | 'password' | 'appearance') => void;
  onOpenAIMentor?: () => void;
  hideNavTabs?: boolean;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
}) => {
  const t = dashboardTranslations[currentLang];

  return (
    <header className="sticky top-0 z-20 w-full h-14 border-b transition-colors duration-150 select-none bg-white/95 dark:bg-[#0b1018]/95 backdrop-blur-md border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Clean space, brand logo is on Left Sidebar */}
        <div className="flex items-center gap-2" />

        {/* Right: Language toggle (VIE | ENG) & Theme toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          {/* Language Switcher Pill */}
          <div
            role="group"
            aria-label="Language Selector"
            className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('vie')}
              className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
                currentLang === 'vie'
                  ? 'bg-[#1BA94C] text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              VIE
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('eng')}
              className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
                currentLang === 'eng'
                  ? 'bg-[#1BA94C] text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ENG
            </button>
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            type="button"
            onClick={onThemeToggle}
            aria-label={currentTheme === 'dark' ? t.lightTheme : t.darkTheme}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors focus:outline-none cursor-pointer"
            title={currentTheme === 'dark' ? t.lightTheme : t.darkTheme}
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
