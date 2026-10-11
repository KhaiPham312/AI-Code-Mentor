import React, { useState, useMemo } from 'react';
import { Exercise, Difficulty } from '../../types/exercise';
import { Language, dashboardTranslations } from './dashboardI18n';
import {
  Search,
  CheckCircle2,
  Clock,
  Circle,
  Bot,
  Play,
  RotateCcw,
  Filter,
  X,
  Code,
} from 'lucide-react';

interface ChallengeCatalogProps {
  exercises: Exercise[];
  currentLang: Language;
  onOpenIDE: (exerciseId: number) => void;
}

export const ChallengeCatalog: React.FC<ChallengeCatalogProps> = ({
  exercises,
  currentLang,
  onOpenIDE,
}) => {
  const t = dashboardTranslations[currentLang];

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const topics = [
    { id: 'all', label: t.tabAll },
    { id: 'python', label: t.tabPython },
    { id: 'cpp', label: t.tabCpp },
    { id: 'data_structures', label: t.tabDataStructures },
    { id: 'algorithms', label: t.tabAlgorithms },
  ];

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

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = ex.title.toLowerCase().includes(query);
        const matchCategory = ex.category.toLowerCase().includes(query);
        const matchDesc = ex.description.toLowerCase().includes(query);
        if (!matchTitle && !matchCategory && !matchDesc) return false;
      }

      // 2. Topic
      if (selectedTopic === 'python' && ex.language !== 'python') return false;
      if (selectedTopic === 'cpp' && ex.language !== 'cpp') return false;
      if (
        selectedTopic === 'data_structures' &&
        !ex.category.toLowerCase().includes('cấu trúc dữ liệu') &&
        !ex.category.toLowerCase().includes('stack') &&
        !ex.category.toLowerCase().includes('mảng')
      ) {
        return false;
      }
      if (
        selectedTopic === 'algorithms' &&
        !ex.category.toLowerCase().includes('giải thuật') &&
        !ex.category.toLowerCase().includes('thuật toán')
      ) {
        return false;
      }

      // 3. Difficulty
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) {
        return false;
      }

      // 4. Status
      const currentStatus = ex.status || 'not_started';
      if (selectedStatus !== 'all' && currentStatus !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [exercises, searchQuery, selectedTopic, selectedDifficulty, selectedStatus]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-500/20">
            {t.diffEasy}
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {t.diffMedium}
          </span>
        );
      case 'hard':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            {t.diffHard}
          </span>
        );
    }
  };

  const getStatusBadge = (status?: 'solved' | 'in_progress' | 'not_started') => {
    switch (status) {
      case 'solved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.statusSolved}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.statusInProgress}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
            <Circle className="w-3 h-3" />
            <span>{t.statusNotStarted}</span>
          </span>
        );
    }
  };

  return (
    <section className="space-y-5">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1BA94C] dark:bg-[#00EA64]" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {t.catalogSectionTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.catalogSectionSub}
          </p>
        </div>

        {/* Counter */}
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t.showingResults}{' '}
          <span className="font-bold text-slate-900 dark:text-white">{filteredExercises.length}</span>{' '}
          {t.ofExercises} {exercises.length} {t.exercisesLabel}
        </div>
      </div>

      {/* FILTER CONTROLS BAR (HackerRank Filter Bar Style) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 space-y-3.5 shadow-sm">
        {/* ROW 1: SEARCH & TOPIC TABS */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-10 pl-9 pr-9 rounded-lg bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1BA94C] dark:focus:border-[#00EA64] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TOPIC TABS */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {topics.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#1BA94C] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: DIFFICULTY & STATUS PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-gray-800/80 text-xs">
          {/* Difficulty pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{t.filterDifficulty}:</span>
            </span>
            {difficulties.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedDifficulty === d.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 text-[11px]">
              {t.filterStatus}:
            </span>
            {statuses.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStatus(s.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedStatus === s.id
                    ? 'bg-[#1BA94C] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                }`}
              >
                {s.label}
              </button>
            ))}

            {(searchQuery || selectedTopic !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-2 text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>{t.resetFilterBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHALLENGE CARDS GRID */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-[#121926] border border-dashed border-slate-300 dark:border-gray-800 space-y-3">
          <Code className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {t.noExercisesFound}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1BA94C] text-white hover:bg-[#15893d] transition-colors"
          >
            {t.resetFilterBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((exercise) => {
            const isSolved = exercise.status === 'solved';
            const isInProgress = exercise.status === 'in_progress';

            return (
              <div
                key={exercise.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* CARD HEADER: BADGES */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      {getDifficultyBadge(exercise.difficulty)}
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                        {exercise.language}
                      </span>
                    </div>

                    {getStatusBadge(exercise.status)}
                  </div>

                  {/* TITLE */}
                  <h3
                    onClick={() => onOpenIDE(exercise.id)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#1BA94C] dark:group-hover:text-[#00EA64] transition-colors leading-snug cursor-pointer line-clamp-1"
                  >
                    {exercise.title}
                  </h3>

                  {/* CATEGORY */}
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1">
                    {exercise.category}
                  </div>

                  {/* SUMMARY */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {exercise.description.replace(/[`$*#]/g, '')}
                  </p>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-gray-800/80 space-y-3">
                  {/* AI Socratic Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    <Bot className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{t.aiSocraticBadge}</span>
                  </div>

                  {/* ACTION BUTTON */}
                  <button
                    type="button"
                    onClick={() => onOpenIDE(exercise.id)}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] ${
                      isSolved
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50 hover:bg-[#1BA94C] hover:text-white dark:hover:bg-[#1BA94C] dark:hover:text-white'
                        : isInProgress
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                        : 'bg-[#1BA94C] hover:bg-[#15893d] text-white shadow-sm'
                    }`}
                  >
                    {isSolved ? (
                      <RotateCcw className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>
                      {isSolved ? t.redoBtn : isInProgress ? t.continueBtn : t.solveBtn}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
