import React, { useState, useMemo, useEffect } from 'react';
import { Exercise, Difficulty } from '../../types/exercise';
import { User } from '../../types/auth';
import { SKILL_TRACKS, SkillIconType } from '../../types/skills';
import { Language, dashboardTranslations } from './dashboardI18n';
import { getCourseLeaderboard } from '../../services/mockTeacherData';
import {
  getUserStorageKey,
  getUserSolvedExerciseIds,
  getUserAttemptedExerciseIds,
  getUserDraft,
} from '../../services/userStorage';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Circle,
  Play,
  RotateCcw,
  Sparkles,
  X,
  Layers,
  GitBranch,
  Calculator,
  Brain,
  Coffee,
  Database,
  Trophy,
} from 'lucide-react';

interface CourseDetailViewProps {
  trackId: string;
  exercises: Exercise[];
  currentLang: Language;
  onBack: () => void;
  onOpenIDE: (exerciseId: number) => void;
  user?: User;
}

const renderTrackHeaderIcon = (iconType: SkillIconType, color: string) => {
  switch (iconType) {
    case 'algorithms':
      return <GitBranch className="w-6 h-6" style={{ color }} />;
    case 'data-structures':
      return <Layers className="w-6 h-6" style={{ color }} />;
    case 'mathematics':
      return <Calculator className="w-6 h-6" style={{ color }} />;
    case 'ai':
      return <Brain className="w-6 h-6" style={{ color }} />;
    case 'c':
      return (
        <span className="font-mono font-extrabold text-lg tracking-tighter" style={{ color }}>
          C
        </span>
      );
    case 'cpp':
      return (
        <span className="font-mono font-extrabold text-base tracking-tighter" style={{ color }}>
          C++
        </span>
      );
    case 'java':
      return <Coffee className="w-6 h-6" style={{ color }} />;
    case 'python':
      return (
        <span className="font-mono font-extrabold text-base tracking-tight text-amber-500">
          Py
        </span>
      );
    case 'sql':
      return <Database className="w-6 h-6" style={{ color }} />;
    default:
      return <Layers className="w-6 h-6" style={{ color }} />;
  }
};

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  trackId,
  exercises,
  currentLang,
  onBack,
  onOpenIDE,
  user,
}) => {
  const t = dashboardTranslations[currentLang];

  const userKey = useMemo(() => getUserStorageKey(user), [user]);
  const userSolvedIds = useMemo(() => getUserSolvedExerciseIds(userKey), [userKey]);
  const userAttemptedIds = useMemo(() => getUserAttemptedExerciseIds(userKey), [userKey]);

  // Current track information
  const track = useMemo(
    () => SKILL_TRACKS.find((tr) => tr.id === trackId),
    [trackId]
  );

  useEffect(() => {
    if (!track) {
      onBack();
    }
  }, [track, onBack]);

  // All exercises belonging to this track
  const trackExercises = useMemo(() => {
    if (!track) return [];
    const list = exercises.filter(
      (ex) => ex.trackIds && ex.trackIds.includes(trackId)
    );
    if (list.length > 0) return list;
    // Fallback if specific track has no assigned exercises yet
    return exercises.slice(0, 4);
  }, [exercises, trackId, track]);

  if (!track) {
    return null;
  }

  // Overall track progress
  const totalExercises = trackExercises.length;
  const solvedCount = useMemo(() => {
    return trackExercises.filter((ex) => userSolvedIds.includes(ex.id)).length;
  }, [trackExercises, userSolvedIds]);
  const progressPercent = totalExercises > 0 ? Math.round((solvedCount / totalExercises) * 100) : 0;

  // View Mode: Exercises List vs Course Leaderboard
  const [courseViewMode, setCourseViewMode] = useState<'exercises' | 'leaderboard'>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_student_course_view_mode');
      if (saved === 'exercises' || saved === 'leaderboard') return saved;
    } catch {
      // ignore
    }
    return 'exercises';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_mentor_student_course_view_mode', courseViewMode);
    } catch {
      // ignore
    }
  }, [courseViewMode]);

  const currentUserStudentId = useMemo(() => {
    if (user?.studentId) return user.studentId;
    if (user?.id) return user.id;
    try {
      const raw = localStorage.getItem('ai_mentor_user');
      if (raw) {
        const u = JSON.parse(raw);
        return u.studentId || u.id;
      }
    } catch {
      // ignore
    }
    return undefined;
  }, [user]);

  const courseLeaderboard = useMemo(
    () => getCourseLeaderboard(track.id, totalExercises, currentUserStudentId),
    [track.id, totalExercises, currentUserStudentId]
  );

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const difficulties = [
    { id: 'all', label: t.diffAll },
    { id: 'easy', label: t.diffEasy },
    { id: 'medium', label: t.diffMedium },
    { id: 'hard', label: t.diffHard },
  ];

  const statuses = [
    { id: 'all', label: t.statusAll },
    { id: 'not_started', label: t.statusNotStarted },
    { id: 'in_progress', label: t.statusInProgress },
    { id: 'solved', label: t.statusSolved },
  ];

  // Filter and Sort: Easy -> Medium -> Hard
  const filteredAndSortedExercises = useMemo(() => {
    const difficultyOrder: Record<Difficulty, number> = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    return trackExercises
      .filter((ex) => {
        // 1. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const title = (currentLang === 'eng' && ex.titleEn ? ex.titleEn : ex.title).toLowerCase();
          const category = (currentLang === 'eng' && ex.categoryEn ? ex.categoryEn : ex.category).toLowerCase();
          const matchDesc = ex.description.toLowerCase().includes(q);
          if (!title.includes(q) && !category.includes(q) && !matchDesc) return false;
        }

        // 2. Difficulty
        if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) {
          return false;
        }

        // 3. Status
        const isSolved = userSolvedIds.includes(ex.id);
        const hasDraft = !!getUserDraft(userKey, ex.id);
        const hasAttempt = userAttemptedIds.includes(ex.id);
        const isInProgress = !isSolved && (hasDraft || hasAttempt);
        const currentStatus = isSolved ? 'solved' : (isInProgress ? 'in_progress' : 'not_started');

        if (selectedStatus !== 'all' && currentStatus !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Strict sort: Easy (1) -> Medium (2) -> Hard (3)
        const orderDiff = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        if (orderDiff !== 0) return orderDiff;
        // Secondary sort: Problem ID
        return a.id - b.id;
      });
  }, [trackExercises, searchQuery, selectedDifficulty, selectedStatus, currentLang, userSolvedIds, userAttemptedIds, userKey]);

  // Difficulty badge styling
  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return {
          label: t.diffEasy,
          className:
            'bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border-emerald-200 dark:border-emerald-800/60',
        };
      case 'medium':
        return {
          label: t.diffMedium,
          className:
            'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
        };
      case 'hard':
        return {
          label: t.diffHard,
          className:
            'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
        };
    }
  };

  const trackTitle = currentLang === 'vie' ? track.nameVie : track.nameEng;
  const trackDesc = currentLang === 'vie' ? track.descVie : track.descEng;

  return (
    <div className="space-y-6">
      {/* 1. BREADCRUMB HEADER & BACK BUTTON */}
      <div className="flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-[#00EA64] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t.backToSkills}</span>
          </button>
        </div>

        {/* TRACK HERO BANNER */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
          {/* Subtle Ambient Background */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: track.color }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Icon & Course Details */}
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm"
                style={{
                  backgroundColor: `${track.color}15`,
                  borderColor: `${track.color}40`,
                }}
              >
                {renderTrackHeaderIcon(track.iconType, track.color)}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>HackerRank Skill Track</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
                  {trackTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {trackDesc}
                </p>
              </div>
            </div>

            {/* Right: Progress Overview Card */}
            <div className="w-full md:w-64 flex-shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-[#0e1420] border border-slate-200/80 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <span>{t.courseProgress}</span>
                <span className="text-[#1BA94C] dark:text-[#00EA64] font-bold">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#00EA64] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  {t.solvedLabel}:{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {solvedCount} / {totalExercises}
                  </strong>
                </span>
                <span>{t.sortDifficultyAsc}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1.5 COURSE VIEW MODE TABS: EXERCISES vs LEADERBOARD */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-gray-800 pb-2">
        <button
          type="button"
          onClick={() => setCourseViewMode('exercises')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
            courseViewMode === 'exercises'
              ? 'bg-[#1BA94C] text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{currentLang === 'vie' ? 'Danh sách bài tập' : 'Exercises'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
            {totalExercises}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCourseViewMode('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
            courseViewMode === 'leaderboard'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{currentLang === 'vie' ? 'Bảng xếp hạng khóa học' : 'Course Leaderboard'}</span>
        </button>
      </div>

      {/* 2. EXERCISES LIST VIEW */}
      {courseViewMode === 'exercises' && (
        <div className="space-y-6">
          {/* FILTER BAR & SEARCH */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm space-y-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    currentLang === 'vie'
                      ? 'Tìm kiếm bài tập theo tên hoặc chủ đề...'
                      : 'Search challenges in this track...'
                  }
                  className="w-full h-10 pl-9 pr-9 text-xs rounded-lg bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Result Count and Sort Indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {filteredAndSortedExercises.length}
                </span>
                <span>/ {totalExercises} {currentLang === 'vie' ? 'bài tập' : 'challenges'}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#00EA64] font-medium text-[11px]">
                  {t.sortDifficultyAsc}
                </span>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-gray-800/80 text-xs">
              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-600 dark:text-slate-400 font-semibold mr-1">{t.filterDifficulty}:</span>
                {difficulties.map((diff) => {
                  const isActive = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1BA94C] text-white shadow-sm font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                      }`}
                    >
                      {diff.label}
                    </button>
                  );
                })}
              </div>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-600 dark:text-slate-400 font-semibold mr-1">{t.filterStatus}:</span>
                {statuses.map((st) => {
                  const isActive = selectedStatus === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStatus(st.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1BA94C] text-white shadow-sm font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Clear Filters (if any filter active) */}
              {(selectedDifficulty !== 'all' || selectedStatus !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDifficulty('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium ml-auto"
                >
                  {t.resetFilterBtn}
                </button>
              )}
            </div>
          </div>

          {/* PROBLEM CARDS LIST */}
          {filteredAndSortedExercises.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800">
              <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t.emptyTrackExercises}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {currentLang === 'vie'
                  ? 'Hãy thử thay đổi độ khó hoặc xóa từ khóa tìm kiếm để xem danh sách bài tập đầy đủ.'
                  : 'Try switching difficulty or clearing search terms to explore full challenges.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDifficulty('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#1BA94C] text-white text-xs font-semibold shadow-sm hover:bg-[#15893d] transition-all"
              >
                {t.resetFilterBtn}
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredAndSortedExercises.map((exercise) => {
                const isSolved = userSolvedIds.includes(exercise.id);
                const hasDraft = !!getUserDraft(userKey, exercise.id);
                const hasAttempt = userAttemptedIds.includes(exercise.id);
                const isInProgress = !isSolved && (hasDraft || hasAttempt);
                const badge = getDifficultyBadge(exercise.difficulty);
                const displayCategory = currentLang === 'eng' && exercise.categoryEn ? exercise.categoryEn : exercise.category;
                const displayTitle = currentLang === 'eng' && exercise.titleEn ? exercise.titleEn : exercise.title;

                return (
                  <div
                    key={exercise.id}
                    className="group p-4 sm:p-5 rounded-xl bg-white dark:bg-[#121926] border border-slate-200/90 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left Content */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Metadata Row: Difficulty Badge + Category + Status */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${badge.className}`}
                        >
                          {badge.label}
                        </span>

                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {displayCategory}
                        </span>

                        <span className="text-slate-300 dark:text-slate-700">•</span>

                        {/* Status Pill */}
                        {isSolved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1BA94C] dark:text-[#00EA64]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.statusSolved}</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 dark:text-blue-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t.statusInProgress}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            <Circle className="w-3.5 h-3.5" />
                            <span>{t.statusNotStarted}</span>
                          </span>
                        )}

                        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                          {exercise.timeLimitMs}ms / {exercise.memoryLimitMb}MB
                        </span>
                      </div>

                      {/* Title only (No gray description excerpt) */}
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00EA64] transition-colors truncate">
                          {displayTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Right Action Button */}
                    <div className="flex-shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => onOpenIDE(exercise.id)}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm ${
                          isSolved
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50 hover:bg-[#1BA94C] hover:text-white dark:hover:bg-[#1BA94C] dark:hover:text-white'
                            : isInProgress
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-[#1BA94C] hover:bg-[#15893d] text-white shadow-emerald-700/20'
                        }`}
                      >
                        {isSolved ? (
                          <RotateCcw className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        <span>
                          {isSolved
                            ? t.solveAgain
                            : isInProgress
                            ? t.continueSolving
                            : t.startSolving}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. COURSE LEADERBOARD VIEW */}
      {courseViewMode === 'leaderboard' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-sans">
                  {currentLang === 'vie' ? 'Bảng xếp hạng Khóa học' : 'Course Leaderboard'} - {currentLang === 'vie' ? track.nameVie : track.nameEng}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentLang === 'vie'
                    ? 'Sắp xếp theo số bài đã giải, tổng điểm khóa học và thời gian thực thi trung bình.'
                    : 'Ranked by solved challenges, total score, and average execution runtime.'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold font-sans self-start sm:self-auto">
              {courseLeaderboard.length} {currentLang === 'vie' ? 'sinh viên xếp hạng' : 'students ranked'}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-sans">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-[#0b1322] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-center w-16">{currentLang === 'vie' ? 'Hạng' : 'Rank'}</th>
                  <th className="py-3 px-4">{currentLang === 'vie' ? 'Sinh viên' : 'Student'}</th>
                  <th className="py-3 px-4">{currentLang === 'vie' ? 'Bài đã giải' : 'Solved'}</th>
                  <th className="py-3 px-4">{currentLang === 'vie' ? 'Tổng điểm' : 'Total Score'}</th>
                  <th className="py-3 px-4">{currentLang === 'vie' ? 'Tốc độ TB' : 'Avg Runtime'}</th>
                  <th className="py-3 px-4">{currentLang === 'vie' ? 'Ngôn ngữ chính' : 'Language'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {courseLeaderboard.map((entry) => (
                  <tr
                    key={entry.studentId}
                    className={`transition ${
                      entry.isCurrentUser
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-l-[#1BA94C]'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold">
                      {entry.rank === 1 ? (
                        <span className="text-base" title="Top 1">🥇</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-base" title="Top 2">🥈</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-base" title="Top 3">🥉</span>
                      ) : (
                        <span className="text-slate-500 font-mono text-xs">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${entry.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                          {entry.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {entry.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#1BA94C] text-white">
                                {currentLang === 'vie' ? 'Bạn' : 'You'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {entry.studentId} • {entry.classGroup}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-600 dark:text-[#00EA64]">
                          {entry.solvedCount} / {entry.totalExercises} {currentLang === 'vie' ? 'bài' : 'solved'}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1BA94C] rounded-full"
                            style={{ width: `${Math.round((entry.solvedCount / entry.totalExercises) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400 font-sans">
                      {entry.totalScore} / {entry.totalExercises * 10}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {entry.avgRuntimeMs} ms
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {entry.mainLanguage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
