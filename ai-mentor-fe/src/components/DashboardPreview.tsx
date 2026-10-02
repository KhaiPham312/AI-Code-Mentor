import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { getExercises } from '../services/mockExerciseService';
import { Language, ThemeMode } from './dashboard/dashboardI18n';
import { DashboardNavbar } from './dashboard/DashboardNavbar';
import { DashboardHero } from './dashboard/DashboardHero';
import { SkillPreparationKits } from './dashboard/SkillPreparationKits';
import { ChallengeCatalog } from './dashboard/ChallengeCatalog';
import { LeaderboardModal } from './dashboard/LeaderboardModal';

interface DashboardPreviewProps {
  user: User;
  onLogout: () => void;
  onOpenIDE?: (exerciseId: number) => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  user,
  onLogout,
  onOpenIDE,
}) => {
  // 1. Language state (Synced with localStorage)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_lang');
      if (saved === 'eng' || saved === 'vie') return saved;
    } catch {
      // Fallback
    }
    return 'vie';
  });

  // 2. Theme state (Synced with localStorage & document.documentElement class)
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Fallback
    }
    return 'dark';
  });

  // Sync theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ai_mentor_theme', currentTheme);
    } catch {
      // Ignore
    }
  }, [currentTheme]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('ai_mentor_lang', lang);
    } catch {
      // Ignore
    }
  };

  const handleThemeToggle = () => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 3. Navigation & Modal states
  const [activeNavTab, setActiveNavTab] = useState<'practice' | 'kits' | 'leaderboard'>('practice');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // 4. Exercise Data
  const exercises = getExercises();
  const solvedCount = exercises.filter((ex) => ex.status === 'solved').length;
  const totalCount = exercises.length;

  const handleLaunchIDE = (exerciseId: number = 1) => {
    if (onOpenIDE) {
      onOpenIDE(exerciseId);
    }
  };

  const handleNavTabChange = (tab: 'practice' | 'kits' | 'leaderboard') => {
    setActiveNavTab(tab);
    if (tab === 'leaderboard') {
      setIsLeaderboardOpen(true);
    } else {
      // Smooth scroll to target section
      const targetId = tab === 'kits' ? 'section-kits' : 'section-catalog';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#f4f6f8] text-slate-900 dark:bg-[#0b0f17] dark:text-[#f3f7f8] antialiased">
      {/* 1. TOP GLOBAL NAVBAR */}
      <DashboardNavbar
        user={user}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        onLogout={onLogout}
        onOpenIDE={() => handleLaunchIDE(1)}
        activeNavTab={activeNavTab}
        onNavTabChange={handleNavTabChange}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* WELCOME HERO & QUICK STATS */}
        <DashboardHero
          user={user}
          currentLang={currentLang}
          onOpenIDE={() => handleLaunchIDE(1)}
          solvedCount={solvedCount}
          totalCount={totalCount}
          streakDays={5}
          aiInteractions={42}
        />

        {/* SECTION A: SKILL PREPARATION KITS */}
        <div id="section-kits" className="scroll-mt-20">
          <SkillPreparationKits
            currentLang={currentLang}
            onSelectKit={(kitId) => {
              const kitTargetId = kitId === 'dsa' ? 2 : kitId === 'oop' ? 7 : 6;
              handleLaunchIDE(kitTargetId);
            }}
          />
        </div>

        {/* SECTION B: PRACTICE CHALLENGES CATALOG */}
        <div id="section-catalog" className="scroll-mt-20">
          <ChallengeCatalog
            exercises={exercises}
            currentLang={currentLang}
            onOpenIDE={handleLaunchIDE}
          />
        </div>
      </main>

      {/* 3. LEADERBOARD MODAL */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => {
          setIsLeaderboardOpen(false);
          if (activeNavTab === 'leaderboard') setActiveNavTab('practice');
        }}
        currentLang={currentLang}
      />

      {/* 4. CLEAN FOOTER */}
      <footer className="mt-auto border-t py-6 border-slate-200 dark:border-gray-800 bg-white dark:bg-[#0b0f17] text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#1BA94C] flex items-center justify-center font-bold text-white text-[11px]">
              H
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AI Code Mentor
            </span>
            <span>•</span>
            <span>Khoa Công nghệ Thông tin, Trường Đại học Sư phạm Hà Nội (HNUE)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-[#00EA64]">
              <span className="w-2 h-2 rounded-full bg-[#00EA64] animate-ping" />
              <span>Hệ thống trực tuyến 100%</span>
            </span>
            <span>•</span>
            <span>Phiên bản 2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPreview;
