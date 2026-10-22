import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types/auth';
import { getExercises } from '../services/mockExerciseService';
import { Language, ThemeMode, dashboardTranslations } from './dashboard/dashboardI18n';
import { SKILL_TRACKS } from '../types/skills';
import {
  getUserStorageKey,
  getUserSolvedExerciseIds,
  getUserSubmissions,
} from '../services/userStorage';
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
  const t = dashboardTranslations[currentLang];

  // Navigation & Track states
  const [activeNavTab, setActiveNavTab] = useState<
    'practice' | 'kits' | 'leaderboard' | 'ai-mentor'
  >('practice');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(initialTrackId);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Sync if initialTrackId changes and validate against SKILL_TRACKS
  useEffect(() => {
    if (initialTrackId) {
      const isValid = SKILL_TRACKS.some((tr) => tr.id === initialTrackId);
      if (isValid) {
        setSelectedTrackId(initialTrackId);
      } else {
        setSelectedTrackId(null);
        if (onTrackChange) onTrackChange(null);
      }
    } else {
      setSelectedTrackId(null);
    }
  }, [initialTrackId, onTrackChange]);

  // Exercise Data
  const exercises = getExercises();
  const totalCount = exercises.length;

  // Real user submissions metrics isolated by userKey
  const userKey = useMemo(() => getUserStorageKey(user), [user]);
  const userSolvedIds = useMemo(() => getUserSolvedExerciseIds(userKey), [userKey]);
  const userSubmissions = useMemo(() => getUserSubmissions(userKey), [userKey]);

  const realSolvedCount = userSolvedIds.length;
  const streakDays = realSolvedCount > 0 ? 1 : 0;
  const bestStreakDays = realSolvedCount > 0 ? 1 : 0;
  const todayGoalTotal = 3;
  const todayGoalSolved = Math.min(todayGoalTotal, realSolvedCount);
  const acRatePercent =
    userSubmissions.length > 0
      ? Math.round(
          (userSubmissions.filter((s) => s.status === 'passed').length /
            userSubmissions.length) *
            100
        )
      : 0;
  const codingHours =
    userSubmissions.length > 0
      ? Math.round(userSubmissions.length * 0.4 * 10) / 10
      : 0;

  const topTopics = useMemo(() => {
    if (userSolvedIds.length === 0) return [];
    const counts: Record<string, number> = {};
    exercises.forEach((ex) => {
      if (userSolvedIds.includes(ex.id)) {
        const cat = currentLang === 'eng' && ex.categoryEn ? ex.categoryEn : ex.category;
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    const total = userSolvedIds.length;
    const colorClasses = [
      'text-amber-500 bg-amber-500/10 border-amber-500/20',
      'text-blue-500 bg-blue-500/10 border-blue-500/20',
      'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      'text-purple-500 bg-purple-500/10 border-purple-500/20',
    ];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, cnt], idx) => ({
        label,
        percent: Math.round((cnt / total) * 100),
        colorClass: colorClasses[idx % colorClasses.length],
      }));
  }, [userSolvedIds, exercises, currentLang]);

  const aiInteractions = 0; // Real count: no fake numbers

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
            user={user}
          />
        ) : (
          /* MAIN PRACTICE SKILLS DASHBOARD */
          <>
            {/* WELCOME HERO & QUICK STATS */}
            <DashboardHero
              user={user}
              currentLang={currentLang}
              onOpenIDE={() => handleLaunchIDE(1)}
              solvedCount={realSolvedCount}
              totalCount={totalCount}
              streakDays={streakDays}
              aiInteractions={aiInteractions}
              todayGoalSolved={todayGoalSolved}
              todayGoalTotal={todayGoalTotal}
              bestStreakDays={bestStreakDays}
              acRatePercent={acRatePercent}
              codingHours={codingHours}
              topTopics={topTopics}
            />

            {/* SECTION A: SKILL PREPARATION KITS */}
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
                solvedExerciseIds={userSolvedIds}
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
        user={user}
      />

      {/* 4. FLOATING AI SOCRATIC MENTOR WIDGET */}
      <FloatingAIMentorChat theme={currentTheme} currentLang={currentLang} />

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
            <span>{t.footerFaculty}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-[#00EA64]">
              <span className="w-2 h-2 rounded-full bg-[#00EA64] animate-ping" />
              <span>{t.footerOnlineStatus}</span>
            </span>
            <span>•</span>
            <span>{t.footerVersion}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPreview;
