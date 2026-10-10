import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types/auth';
import { Language, ThemeMode, dashboardTranslations } from './dashboardI18n';
import {
  Sun,
  Moon,
  LogOut,
  Trophy,
  BookOpen,
  Code2,
  ChevronDown,
  Sparkles,
  User as UserIcon,
  Settings as SettingsIcon,
  History,
} from 'lucide-react';
import gsap from 'gsap';

interface DashboardNavbarProps {
  user: User;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onLogout: () => void;
  onOpenIDE?: () => void;
  onOpenSubmissions?: () => void;
  activeNavTab: 'practice' | 'kits' | 'leaderboard' | 'ai-mentor';
  onNavTabChange: (tab: 'practice' | 'kits' | 'leaderboard' | 'ai-mentor') => void;
  onOpenSettings: (tab?: 'profile' | 'password' | 'appearance') => void;
  onOpenAIMentor?: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  onLogout,
  onOpenIDE = () => {},
  onOpenSubmissions,
  activeNavTab,
  onNavTabChange,
  onOpenSettings,
}) => {
  const t = dashboardTranslations[currentLang];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const cleanName = (user.name || '').replace(/\s*\([^)]*\)/g, '').trim() || user.name;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GSAP animation when profile dropdown toggles
  useEffect(() => {
    if (isProfileOpen && dropdownMenuRef.current) {
      gsap.fromTo(
        dropdownMenuRef.current,
        { opacity: 0, y: -8, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [isProfileOpen]);

  const navItems = [
    { id: 'practice' as const, label: t.navPractice, icon: Code2 },
    { id: 'kits' as const, label: t.navKits, icon: BookOpen },
    { id: 'leaderboard' as const, label: t.navLeaderboard, icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b transition-colors duration-200 select-none bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-slate-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* LEFT: BRANDING & HNUE SUBTITLE */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavTabChange('practice')}
        >
          <div className="w-9 h-9 rounded-md bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-md shadow-emerald-900/20 flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
            <span className="font-mono text-xl font-extrabold tracking-tighter">H</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                {t.brandTitle}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {t.brandSubtitle}
            </span>
          </div>
        </div>

        {/* CENTER: CLEAN NAVIGATION MENU */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() =>
                  onNavTabChange(item.id as 'practice' | 'kits' | 'leaderboard' | 'ai-mentor')
                }
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-[#1BA94C] dark:text-[#00EA64] bg-emerald-50 dark:bg-emerald-950/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#1BA94C] dark:text-[#00EA64]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-13px] left-3 right-3 h-[2px] bg-[#1BA94C] dark:bg-[#00EA64] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: CONTROLS & PROFILE */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher Pill */}
          <div
            role="group"
            aria-label="Language Selector"
            className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('vie')}
              className={`px-2 py-0.5 rounded-full transition-all duration-150 ${
                currentLang === 'vie'
                  ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              VIE
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('eng')}
              className={`px-2 py-0.5 rounded-full transition-all duration-150 ${
                currentLang === 'eng'
                  ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
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
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors focus:outline-none"
            title={currentTheme === 'dark' ? t.lightTheme : t.darkTheme}
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all focus:outline-none"
              aria-expanded={isProfileOpen}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {cleanName.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00EA64] ring-2 ring-white dark:ring-[#0b0f17]" />
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white max-w-[130px] truncate leading-tight">
                  {cleanName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight">
                  {user.classGroup || 'K72 CNTT A'}
                </div>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* HackerRank-style Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-2xl py-1.5 text-xs text-slate-700 dark:text-slate-200 z-50 overflow-hidden"
              >
                {/* User Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800/80 bg-slate-50/50 dark:bg-[#0e1420]/50">
                  <p className="font-bold text-slate-900 dark:text-white truncate text-xs">
                    {cleanName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                    {user.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50">
                    <Sparkles className="w-3 h-3 text-[#00EA64]" />
                    <span>{t.studentRoleTag}</span>
                  </div>
                </div>

                {/* HackerRank Menu List: Exactly 4 options + Logout */}
                <div className="py-1">
                  {/* 1. Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings('profile');
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentLang === 'vie' ? 'Hồ sơ cá nhân' : 'Profile'}</span>
                  </button>

                  {/* 2. Leaderboard */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavTabChange('leaderboard');
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.navLeaderboard}</span>
                  </button>

                  {/* 3. Settings (Đổi mật khẩu) */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings('password');
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {currentLang === 'vie' ? 'Cài đặt (Đổi mật khẩu)' : 'Settings (Password)'}
                    </span>
                  </button>

                  {/* 4. Submissions History */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onOpenSubmissions) {
                        onOpenSubmissions();
                      } else {
                        onOpenIDE();
                      }
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-purple-500" />
                    <span>{currentLang === 'vie' ? 'Lịch sử nộp bài' : 'Submissions'}</span>
                  </button>
                </div>

                {/* Logout Divider & Button */}
                <div className="border-t border-slate-100 dark:border-gray-800/80 pt-1">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
