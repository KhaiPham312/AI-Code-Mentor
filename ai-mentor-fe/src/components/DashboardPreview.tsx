import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { AppSidebar } from './common/AppSidebar';
import { BackToTopButton } from './common/BackToTopButton';

interface DashboardPreviewProps {
  user: User;
  onLogout: () => void;
  onOpenIDE?: (exerciseId: number, trackId?: string) => void;
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
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

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

  // Real AI interactions count from localStorage
  const [aiInteractions, setAiInteractions] = useState<number>(0);
  useEffect(() => {
    if (typeof window === 'undefined' || !userKey || userKey === 'guest') {
      setAiInteractions(0);
      return;
    }
    try {
      const val = localStorage.getItem(`ai_mentor_ai_interactions_${userKey}`);
      setAiInteractions(val ? parseInt(val, 10) || 0 : 0);
    } catch {
      setAiInteractions(0);
    }
  }, [userKey]);

  const realSolvedCount = userSolvedIds.length;

  // Real date calculations for streak, best streak, and today's goal
  const { streakDays, bestStreakDays, todayGoalSolved } = useMemo(() => {
    if (userSubmissions.length === 0) {
      return { streakDays: 0, bestStreakDays: 0, todayGoalSolved: 0 };
    }

    const toLocalDateStr = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const todayStr = toLocalDateStr(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toLocalDateStr(yesterday);

    const submissionDates = new Set<string>();
    const passedTodayExercises = new Set<number>();

    for (const sub of userSubmissions) {
      let dateStr = '';
      if (sub.submittedAtISO) {
        const d = new Date(sub.submittedAtISO);
        if (!isNaN(d.getTime())) dateStr = toLocalDateStr(d);
      }
      if (!dateStr && sub.id && sub.id > 1000000000000) {
        const d = new Date(sub.id);
        if (!isNaN(d.getTime())) dateStr = toLocalDateStr(d);
      }
      if (dateStr) {
        submissionDates.add(dateStr);
        if (dateStr === todayStr && (sub.status === 'passed' || sub.verdict === 'accepted')) {
          passedTodayExercises.add(sub.exerciseId);
        }
      }
    }

    // Daily goal: unique passed exercises today
    const goalSolved = passedTodayExercises.size;

    // Current streak: count backwards consecutive days with >= 1 submission
    let currentStreak = 0;
    let checkDate: Date | null = new Date();
    if (!submissionDates.has(todayStr)) {
      if (submissionDates.has(yesterdayStr)) {
        checkDate = yesterday;
      } else {
        checkDate = null;
      }
    }

    if (checkDate) {
      while (true) {
        const str = toLocalDateStr(checkDate);
        if (submissionDates.has(str)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Best streak: maximum consecutive days with submissions
    const sortedDates = Array.from(submissionDates).sort();
    let maxStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dStr of sortedDates) {
      const curDate = new Date(dStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevDate = curDate;
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    }

    return {
      streakDays: currentStreak,
      bestStreakDays: Math.max(maxStreak, currentStreak),
      todayGoalSolved: goalSolved,
    };
  }, [userSubmissions]);

  const todayGoalTotal = 3;
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

  const handleLaunchIDE = (exerciseId: number = 1, trackId?: string) => {
    if (onOpenIDE) {
      onOpenIDE(exerciseId, trackId || selectedTrackId || undefined);
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
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
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

  const handleSidebarTabChange = (tab: string) => {
    if (tab === 'leaderboard') {
      setIsLeaderboardOpen(true);
      return;
    }
    if (tab === 'submissions') {
      if (onOpenSubmissions) {
        onOpenSubmissions();
      }
      return;
    }
    if (tab === 'courses') {
      setSelectedTrackId(null);
      if (onTrackChange) onTrackChange(null);
      setActiveNavTab('practice');
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const el = document.getElementById('practice-skills-section') || document.getElementById('section-skills');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }
    if (tab === 'kits') {
      setSelectedTrackId(null);
      if (onTrackChange) onTrackChange(null);
      setActiveNavTab('kits');
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const el = document.getElementById('section-kits');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }
    // practice
    setSelectedTrackId(null);
    if (onTrackChange) onTrackChange(null);
    setActiveNavTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen w-full transition-colors duration-200 bg-[#f4f6f8] text-slate-900 dark:bg-[#0b0f17] dark:text-[#f3f7f8] antialiased">
      {/* Gemini-style Left Vertical Sidebar */}
      <AppSidebar
        role="student"
        activeTab={activeNavTab}
        onTabChange={handleSidebarTabChange}
        user={user}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        onOpenSettings={(tab) => onOpenSettings && onOpenSettings(tab as 'profile' | 'password' | 'appearance')}
      />

      {/* Main content right side */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* 1. TOP GLOBAL NAVBAR (Clean bar, nav tabs moved to Left Sidebar) */}
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
          hideNavTabs={true}
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
              userSubmissions={userSubmissions}
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
            <div id="practice-skills-section" className="scroll-mt-20">
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

      {/* 4. FLOATING AI SOCRATIC MENTOR WIDGET & BACK TO TOP BUTTON */}
      <BackToTopButton currentLang={currentLang} position="above-chat" />
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
    </div>
  );
};

export default DashboardPreview;
