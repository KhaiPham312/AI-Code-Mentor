import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User } from '../../types/auth';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import { StatusBadge } from '../common/StatusBadge';
import { AppSidebar } from '../common/AppSidebar';
import { BackToTopButton } from '../common/BackToTopButton';
import { getUserSubmissions, getUserStorageKey } from '../../services/userStorage';
import { COMPREHENSIVE_EXERCISES } from '../../services/mockExercisesData';
import {
  CheckCircle2,
  Code2,
  Search,
  Filter,
  Copy,
  Check,
  Sun,
  Moon,
  ExternalLink,
  Layers,
  BarChart3,
  X,
} from 'lucide-react';

export type SubmissionStatusFilter = 'all' | 'accepted' | 'wrong_answer' | 'time_limit';

export interface SubmissionItem {
  id: string;
  exerciseId: number;
  problemTitle: string;
  topic: string;
  trackId: string;
  language: 'Python' | 'C++' | 'SQL' | 'Java' | 'JavaScript';
  status: 'accepted' | 'wrong_answer' | 'time_limit';
  passedTests: number;
  totalTests: number;
  score: number;
  executionTimeMs: number;
  memoryMb: number;
  submittedAt: string;
  code: string;
}


interface SubmissionsPageProps {
  user: User;
  onBackToDashboard: () => void;
  onOpenIDE: (exerciseId: number) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onLogout: () => void;
  onOpenSettings?: (tab?: 'profile' | 'password' | 'appearance') => void;
}

export const SubmissionsPage: React.FC<SubmissionsPageProps> = ({
  user,
  onBackToDashboard,
  onOpenIDE,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  onLogout,
  onOpenSettings,
}) => {
  const isVie = currentLang === 'vie';

  // Filter states
  const [statusFilter, setStatusFilter] = useState<SubmissionStatusFilter>('all');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Code inspection modal state
  const [activeCodeModal, setActiveCodeModal] = useState<SubmissionItem | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const userKey = getUserStorageKey(user);

  // Read real submissions of the current student
  const submissionsList = useMemo(() => {
    const rawSubs = getUserSubmissions(userKey);
    return rawSubs.map((sub): SubmissionItem => {
      const ex = COMPREHENSIVE_EXERCISES.find((e) => e.id === sub.exerciseId);
      const exLang = (sub.language || (ex?.language === 'cpp' ? 'C++' : ex?.language === 'sql' ? 'SQL' : ex?.language === 'java' ? 'Java' : 'Python')) as SubmissionItem['language'];
      const status: SubmissionItem['status'] = sub.status === 'passed' ? 'accepted' : sub.status === 'error' ? 'time_limit' : 'wrong_answer';
      const score = sub.score !== undefined ? sub.score * 10 : (sub.status === 'passed' ? 100 : Math.round((sub.passedTests / Math.max(1, sub.totalTests)) * 100));

      return {
        id: `sub-real-${sub.id}`,
        exerciseId: sub.exerciseId,
        problemTitle: isVie ? (sub.exerciseTitle || ex?.title || `Bài tập #${sub.exerciseId}`) : (ex?.titleEn || sub.exerciseTitle || ex?.title || `Exercise #${sub.exerciseId}`),
        topic: sub.category || ex?.category || (isVie ? 'Luyện tập' : 'Practice'),
        trackId: ex?.trackIds?.[0] || 'algorithms',
        language: exLang,
        status,
        passedTests: sub.passedTests,
        totalTests: sub.totalTests,
        score,
        executionTimeMs: sub.executionTimeMs,
        memoryMb: sub.memoryMb || 14.1,
        submittedAt: sub.submittedAt,
        code: sub.code,
      };
    });
  }, [userKey, isVie]);

  // Filtered submissions
  const filteredList = useMemo(() => {
    return submissionsList.filter((sub) => {
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchLang = langFilter === 'all' || sub.language.toLowerCase() === langFilter.toLowerCase();
      const matchSearch =
        sub.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchLang && matchSearch;
    });
  }, [submissionsList, statusFilter, langFilter, searchQuery]);

  // Key KPI stats - Zero division safe (edge case new user)
  const totalSubmissions = submissionsList.length;
  const acceptedCount = submissionsList.filter((s) => s.status === 'accepted').length;
  const accuracyRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

  // Calculate unique solved exercises count (Accepted)
  const solvedUniqueCount = useMemo(() => {
    const solvedSet = new Set<number>();
    submissionsList.forEach((s) => {
      if (s.status === 'accepted') {
        solvedSet.add(s.exerciseId);
      }
    });
    return solvedSet.size;
  }, [submissionsList]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen w-full transition-colors duration-200 bg-[#f4f6f8] text-slate-900 dark:bg-[#0b0f17] dark:text-[#f3f7f8] antialiased">
      {/* 1. LEFT VERTICAL SIDEBAR (STUDENT) */}
      <AppSidebar
        role="student"
        activeTab="submissions"
        onTabChange={(tabId) => {
          if (tabId === 'submissions') return;
          if (tabId === 'courses') {
            onBackToDashboard();
            setTimeout(() => {
              document.getElementById('practice-skills-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          } else {
            onBackToDashboard();
          }
        }}
        user={user}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        onOpenSettings={(tab) => onOpenSettings?.(tab as 'profile' | 'password' | 'appearance')}
      />

      {/* 2. RIGHT MAIN CONTENT WRAPPER */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* Minimal Topbar: VIE | ENG and Light/Dark Mode */}
        <header className="h-14 px-4 sm:px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors backdrop-blur-md bg-white/80 dark:bg-[#0c121d]/80 border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2" />

          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {/* Language Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('vie')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  currentLang === 'vie'
                    ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                VIE
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('eng')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  currentLang === 'eng'
                    ? 'bg-[#1BA94C] text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onThemeToggle}
              title={currentTheme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition cursor-pointer"
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Header Title (Clean, no subtitle, no Open IDE button) */}
          <div className="pb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {isVie ? 'Lịch sử nộp bài' : 'Submission History'}
            </h1>
          </div>

          {/* 3. KPI SUMMARY CARDS (CLEAN TASTE-SKILL, NO SUBTITLES) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Submissions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                  {isVie ? 'Tổng bài nộp' : 'Total Submissions'}
                </span>
                <Layers className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 font-sans">
                {totalSubmissions}
              </div>
            </div>

            {/* Card 2: Accepted */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                  {isVie ? 'Bài đạt chuẩn (Accepted)' : 'Accepted'}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-[#00EA64] mt-2 font-sans">
                {acceptedCount}
              </div>
            </div>

            {/* Card 3: Problems Solved */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                  {isVie ? 'Bài tập đã giải' : 'Problems Solved'}
                </span>
                <Code2 className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 font-sans">
                {solvedUniqueCount} <span className="text-sm font-semibold text-slate-400 font-sans">/ 75</span>
              </div>
            </div>

            {/* Card 4: Accuracy Rate */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                  {isVie ? 'Tỷ lệ chính xác' : 'Accuracy Rate'}
                </span>
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 font-sans">
                {totalSubmissions > 0 ? `${accuracyRate}%` : '-'}
              </div>
            </div>
          </div>

        {/* 4. FILTERS & SEARCH CONTROLS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVie ? 'Tìm theo tên bài tập hoặc chủ đề...' : 'Search by problem title or topic...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 focus:outline-none focus:border-[#1BA94C] text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{isVie ? 'Bộ lọc:' : 'Filters:'}</span>
            </div>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatusFilter)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#1BA94C]"
            >
              <option value="all">{isVie ? 'Tất cả trạng thái' : 'All Statuses'}</option>
              <option value="accepted">Accepted</option>
              <option value="wrong_answer">Wrong Answer</option>
              <option value="time_limit">Time Limit Exceeded</option>
            </select>

            {/* Language Select */}
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-gray-700/80 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#1BA94C]"
            >
              <option value="all">{isVie ? 'Tất cả ngôn ngữ' : 'All Languages'}</option>
              <option value="python">Python</option>
              <option value="c++">C++</option>
              <option value="sql">SQL</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* 5. HACKERRANK-GRADE SUBMISSIONS TABLE */}
        <div className="rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50/70 dark:bg-[#0e1420]/70 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">{isVie ? 'Bài tập' : 'Problem'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Khóa học / Chủ đề' : 'Topic'}</th>
                  <th className="py-3.5 px-3">{isVie ? 'Ngôn ngữ' : 'Language'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Trạng thái' : 'Status'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Test Cases / Điểm' : 'Score / Tests'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Thời gian & Bộ nhớ' : 'Runtime & Memory'}</th>
                  <th className="py-3.5 px-4">{isVie ? 'Thời gian nộp' : 'Submitted'}</th>
                  <th className="py-3.5 px-4 text-right">{isVie ? 'Hành động' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 font-medium">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      {isVie ? 'Không tìm thấy lượt nộp bài nào phù hợp bộ lọc.' : 'No submissions found matching criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((sub) => {
                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Problem Name */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <button
                            type="button"
                            onClick={() => onOpenIDE(sub.exerciseId)}
                            className="text-left font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-[#00EA64] transition-colors flex items-center gap-1.5 group"
                          >
                            <span>{sub.problemTitle}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>

                        {/* Course / Topic */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {sub.topic}
                          </span>
                        </td>

                        {/* Language */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {sub.language}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={sub.status} size="sm" />
                        </td>

                        {/* Score & Test cases */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {sub.passedTests}/{sub.totalTests} tests
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {sub.score} / 100 pts
                          </div>
                        </td>

                        {/* Runtime & Memory */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-700 dark:text-slate-300">
                            {sub.executionTimeMs} ms
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {sub.memoryMb} MB
                          </div>
                        </td>

                        {/* Submitted Time */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                          {sub.submittedAt}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveCodeModal(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-[#00EA64] text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-[#00EA64] bg-white dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>{isVie ? 'Xem mã nguồn' : 'View Code'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <BackToTopButton currentLang={currentLang} position="above-chat" />
    </div>

      {/* 6. HACKERRANK-STYLE CODE REVIEW MODAL */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0e1420]/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeCodeModal.problemTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#00EA64]">
                    {activeCodeModal.language}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isVie ? 'Nộp vào lúc:' : 'Submitted at:'} {activeCodeModal.submittedAt} •{' '}
                  {activeCodeModal.executionTimeMs}ms • {activeCodeModal.memoryMb}MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCodeModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Status Banner */}
            <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-[#0b0f17] border-b border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  {isVie ? 'Kết quả kiểm thử:' : 'Test Results:'}
                </span>
                <span
                  className={`font-bold ${
                    activeCodeModal.status === 'accepted'
                      ? 'text-emerald-600 dark:text-[#00EA64]'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {activeCodeModal.passedTests}/{activeCodeModal.totalTests} tests ({activeCodeModal.score} pts)
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(activeCodeModal.code)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-[#00EA64] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isVie ? 'Đã sao chép!' : 'Copied!') : isVie ? 'Sao chép code' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Source Code Container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-text">
              <pre className="overflow-x-auto whitespace-pre">
                <code>{activeCodeModal.code}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0e1420]/70">
              <span className="text-xs text-slate-500 font-medium">
                {isVie ? 'Mã nguồn đã qua kiểm thử Sandbox' : 'Sandbox validated code'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isVie ? 'Đóng' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exId = activeCodeModal.exerciseId;
                    setActiveCodeModal(null);
                    onOpenIDE(exId);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1BA94C] hover:bg-[#168a3e] text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{isVie ? 'Luyện tập lại trên IDE' : 'Practice in IDE'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
