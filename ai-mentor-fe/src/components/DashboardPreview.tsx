import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { getExercises } from '../services/mockExerciseService';
import { Language, ThemeMode } from './dashboard/dashboardI18n';
import { DashboardNavbar } from './dashboard/DashboardNavbar';
import { DashboardHero } from './dashboard/DashboardHero';
import { SkillPreparationKits } from './dashboard/SkillPreparationKits';
import { PracticeSkillsGrid } from './dashboard/PracticeSkillsGrid';
import { CourseDetailView } from './dashboard/CourseDetailView';
import { LeaderboardModal } from './dashboard/LeaderboardModal';
import { FloatingAIMentorChat } from './common/FloatingAIMentorChat';

interface DashboardPreviewProps {
  user: User;
  onLogout: () => void;
  onOpenIDE?: (exerciseId: number) => void;
  onOpenSettings?: (tab?: 'profile' | 'password' | 'appearance') => void;
  onOpenSubmissions?: () => void;
  initialTrackId?: string | null;
  onTrackChange?: (trackId: string | null) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  user,
  onLogout,
  onOpenIDE,
  onOpenSettings,
  onOpenSubmissions,
  initialTrackId = null,
  onTrackChange,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
}) => {
  // Navigation & Track states
  const [activeNavTab, setActiveNavTab] = useState<
    'practice' | 'kits' | 'leaderboard' | 'ai-mentor'
  >('practice');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(initialTrackId);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Sync if initialTrackId changes
  useEffect(() => {
    setSelectedTrackId(initialTrackId);
  }, [initialTrackId]);

  // Exercise Data
  const exercises = getExercises();
  const solvedCount = exercises.filter((ex) => ex.status === 'solved').length;
  const totalCount = exercises.length;

  const handleLaunchIDE = (exerciseId: number = 1) => {
    if (onOpenIDE) {
      onOpenIDE(exerciseId);
    }
  };

  const handleNavTabChange = (
    tab: 'practice' | 'kits' | 'leaderboard' | 'ai-mentor'
  ) => {
    setActiveNavTab(tab);
    if (tab === 'leaderboard') {
      setIsLeaderboardOpen(true);
    } else if (tab === 'ai-mentor') {
      // Handled by floating chat
      setActiveNavTab('practice');
    } else if (tab === 'practice') {
      setSelectedTrackId(null);
      if (onTrackChange) onTrackChange(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'kits') {
      setSelectedTrackId(null);
      if (onTrackChange) onTrackChange(null);
      setTimeout(() => {
        const el = document.getElementById('section-kits');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    if (onTrackChange) onTrackChange(trackId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSkills = () => {
    setSelectedTrackId(null);
    if (onTrackChange) onTrackChange(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#f4f6f8] text-slate-900 dark:bg-[#0b0f17] dark:text-[#f3f7f8] antialiased">
      {/* 1. TOP GLOBAL NAVBAR */}
      <DashboardNavbar
        user={user}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        onOpenIDE={() => handleLaunchIDE(1)}
        onOpenSubmissions={onOpenSubmissions}
        activeNavTab={activeNavTab}
        onNavTabChange={handleNavTabChange}
        onOpenSettings={(tab) => {
          if (onOpenSettings) {
            onOpenSettings(tab);
          }
        }}
        onOpenAIMentor={() => {
          // Triggers floating chat bubble
        }}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {selectedTrackId ? (
          /* COURSE DETAIL VIEW (PROBLEM SETS) */
          <CourseDetailView
            trackId={selectedTrackId}
            exercises={exercises}
            currentLang={currentLang}
            onBack={handleBackToSkills}
            onOpenIDE={handleLaunchIDE}
          />
        ) : (
          /* MAIN PRACTICE SKILLS DASHBOARD */
          <>
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

            {/* SECTION A: SKILL PREPARATION KITS (ALL 6 TRACKS SUPPORTED) */}
            <div id="section-kits" className="scroll-mt-20">
              <SkillPreparationKits
                currentLang={currentLang}
                onSelectKit={(kitId) => {
                  switch (kitId) {
                    case 'dsa':
                      handleSelectTrack('data-structures');
                      break;
                    case 'oop':
                      handleSelectTrack('python');
                      break;
                    case 'cpp-core':
                      handleSelectTrack('cpp');
                      break;
                    case 'fullstack':
                      handleSelectTrack('react');
                      break;
                    case 'sql-db':
                      handleSelectTrack('sql');
                      break;
                    case 'exam':
                      handleSelectTrack('algorithms');
                      break;
                    default:
                      handleSelectTrack('algorithms');
                  }
                }}
              />
            </div>

            {/* SECTION B: PRACTICE SKILLS GRID (3-COLUMN HACKERRANK LAYOUT) */}
            <div id="section-skills" className="scroll-mt-20">
              <PracticeSkillsGrid
                currentLang={currentLang}
                exercises={exercises}
                onSelectTrack={handleSelectTrack}
              />
            </div>
          </>
        )}
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

      {/* 4. FLOATING AI SOCRATIC MENTOR WIDGET */}
      <FloatingAIMentorChat theme={currentTheme} />

      {/* 5. CLEAN FOOTER */}
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
            <span>Phiên bản 2.5.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPreview;
