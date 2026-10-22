import React, { useState, useMemo, useEffect } from 'react';
import { Exercise, SubmissionRecord } from '../../types/exercise';
import { Clock, HardDrive, History, FileText, Trophy } from 'lucide-react';
import { MathMarkdownRenderer } from '../common/MathMarkdownRenderer';
import { getExerciseLeaderboard } from '../../services/mockTeacherData';
import { Language, ideTranslations } from './ideI18n';
import { StatusBadge } from '../common/StatusBadge';
import { localizeExercise } from '../../services/mockExercisesData.en';

import { User } from '../../types/auth';
import { getUserStorageKey } from '../../services/userStorage';

interface ProblemDescriptionProps {
  exercise: Exercise;
  submissions: SubmissionRecord[];
  theme?: 'dark' | 'light';
  currentLang?: Language;
  user?: User;
}

interface StoredSubmission {
  studentId?: string;
  name?: string;
  executionTimeMs?: number;
  memoryMb?: number;
  language?: string;
  score?: number;
  timeAgo?: string;
  submittedCode?: string;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  exercise,
  submissions,
  theme,
  currentLang = 'vie',
  user,
}) => {
  const t = ideTranslations[currentLang];

  const [activeTab, setActiveTab] = useState<'problem' | 'submissions' | 'leaderboard'>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_ide_active_tab');
      if (saved === 'problem' || saved === 'submissions' || saved === 'leaderboard') return saved;
    } catch {
      // ignore
    }
    return 'problem';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_mentor_ide_active_tab', activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  const isDark = theme
    ? theme === 'dark'
    : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  const getDifficultyBadge = (difficulty: Exercise['difficulty']) => {
    const isVie = currentLang !== 'eng';
    switch (difficulty) {
      case 'easy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            {isVie ? 'Dễ' : 'Easy'}
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            {isVie ? 'Trung bình' : 'Medium'}
          </span>
        );
      case 'hard':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
            {isVie ? 'Khó' : 'Hard'}
          </span>
        );
    }
  };

  const currentUserStudentId = useMemo(() => {
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
  }, []);

  const userKey = getUserStorageKey(user);

  const displayExercise = useMemo(
    () => localizeExercise(exercise, currentLang),
    [exercise, currentLang]
  );

  const exerciseLeaderboard = useMemo(() => {
    let latestUserSub: StoredSubmission | undefined = undefined;
    try {
      const stored = userKey && userKey !== 'guest'
        ? localStorage.getItem(`ai_mentor_latest_user_submission_${userKey}_${displayExercise.id}`)
        : null;
      if (stored) {
        latestUserSub = JSON.parse(stored) as StoredSubmission;
      }
    } catch {
      // ignore
    }
    return getExerciseLeaderboard(
      displayExercise.id,
      displayExercise.trackIds?.[0] || 'algorithms',
      displayExercise.title,
      displayExercise.boilerplateCode,
      displayExercise.language,
      latestUserSub,
      currentUserStudentId
    );
  }, [displayExercise.id, displayExercise.trackIds, displayExercise.title, displayExercise.boilerplateCode, displayExercise.language, submissions, currentUserStudentId, userKey]);

  return (
    <div
      className={`flex flex-col h-full border-r transition-colors ${
        isDark
          ? 'bg-[#0e141e] border-slate-800 text-slate-200'
          : 'bg-[#f8fafc] border-slate-200 text-neutral-900'
      }`}
    >
      {/* Tab Header */}
      <div
        className={`h-10 px-4 border-b flex items-center justify-between shrink-0 transition-colors ${
          isDark ? 'bg-[#111827] border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('problem')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'problem'
                ? isDark
                  ? 'bg-[#1e293b] text-white border border-slate-700 shadow-sm'
                  : 'bg-white text-neutral-950 border border-slate-300 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.tabProblem}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'submissions'
                ? isDark
                  ? 'bg-[#1e293b] text-white border border-slate-700 shadow-sm'
                  : 'bg-white text-neutral-950 border border-slate-300 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.tabSubmissions(submissions.length)}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'leaderboard'
                ? isDark
                  ? 'bg-[#1e293b] text-white border border-slate-700 shadow-sm'
                  : 'bg-white text-neutral-950 border border-slate-300 shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.tabLeaderboard}</span>
          </button>
        </div>

        <span
          className={`text-[11px] font-mono font-bold ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          ID: #{exercise.id}
        </span>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'problem' ? (
          <>
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                {getDifficultyBadge(displayExercise.difficulty)}
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'text-slate-300 bg-slate-800/70 border-slate-700'
                      : 'text-neutral-700 bg-slate-200 border-slate-300'
                  }`}
                >
                  {displayExercise.category}
                </span>
              </div>
              <h1
                className={`text-xl font-bold tracking-tight font-sans ${
                  isDark ? 'text-white' : 'text-neutral-950'
                }`}
              >
                {displayExercise.title}
              </h1>

              {/* Limits */}
              <div
                className={`flex items-center space-x-4 mt-3 text-xs pb-4 border-b ${
                  isDark
                    ? 'text-slate-400 border-slate-800'
                    : 'text-neutral-600 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.timeLimitMs(displayExercise.timeLimitMs)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.memoryLimitMb(displayExercise.memoryLimitMb)}</span>
                </div>
              </div>
            </div>

            {/* Description with KaTeX and Markdown */}
            <div
              className={`text-sm leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-neutral-900'
              }`}
            >
              <MathMarkdownRenderer content={displayExercise.description} />
            </div>

            {/* Input & Output Format */}
            <div className="space-y-4 pt-2">
              <div
                className={`border rounded-lg p-3.5 shadow-xs transition-colors ${
                  isDark
                    ? 'bg-[#111827] border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-neutral-950'
                  }`}
                >
                  {t.inputFormatTitle}
                </h3>
                <div
                  className={`text-xs font-mono ${
                    isDark ? 'text-slate-300' : 'text-neutral-900'
                  }`}
                >
                  <MathMarkdownRenderer content={displayExercise.inputFormat} />
                </div>
              </div>

              <div
                className={`border rounded-lg p-3.5 shadow-xs transition-colors ${
                  isDark
                    ? 'bg-[#111827] border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-slate-300' : 'text-neutral-950'
                  }`}
                >
                  {t.outputFormatTitle}
                </h3>
                <div
                  className={`text-xs font-mono ${
                    isDark ? 'text-slate-300' : 'text-neutral-900'
                  }`}
                >
                  <MathMarkdownRenderer content={displayExercise.outputFormat} />
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-slate-300' : 'text-neutral-950'
                }`}
              >
                {t.constraintsTitle}
              </h3>
              <ul
                className={`space-y-1.5 text-xs p-3 rounded-lg border shadow-xs transition-colors ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 text-neutral-900'
                }`}
              >
                {displayExercise.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>
                      <MathMarkdownRenderer content={c} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Test Cases */}
            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? 'text-slate-300' : 'text-neutral-950'
                }`}
              >
                {t.sampleCasesTitle}
              </h3>
              <div className="space-y-3">
                {displayExercise.sampleTestCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className={`border rounded-lg p-3.5 space-y-2 text-xs shadow-xs transition-colors ${
                      isDark
                        ? 'bg-[#111827] border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div
                      className={`font-bold text-[11px] uppercase tracking-wider ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}
                    >
                      {t.sampleCaseNum(idx + 1)}
                    </div>
                    <div>
                      <span
                        className={`block text-[11px] font-semibold ${
                          isDark ? 'text-slate-400' : 'text-neutral-700'
                        }`}
                      >
                        {t.sampleInputLabel}
                      </span>
                      <pre
                        className={`mt-1 p-2 rounded border font-mono overflow-x-auto ${
                          isDark
                            ? 'bg-[#0a0f18] border-slate-800 text-slate-200'
                            : 'bg-slate-100 border-slate-200 text-neutral-900'
                        }`}
                      >
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <span
                        className={`block text-[11px] font-semibold ${
                          isDark ? 'text-slate-400' : 'text-neutral-700'
                        }`}
                      >
                        {t.sampleOutputLabel}
                      </span>
                      <pre
                        className={`mt-1 p-2 rounded border font-mono font-bold overflow-x-auto ${
                          isDark
                            ? 'bg-[#0a0f18] border-slate-800 text-emerald-400'
                            : 'bg-slate-100 border-slate-200 text-emerald-700'
                        }`}
                      >
                        {tc.expectedOutput}
                      </pre>
                    </div>
                    {tc.explanation && (
                      <div
                        className={`text-[11px] pt-1 italic ${
                          isDark ? 'text-slate-400' : 'text-neutral-600'
                        }`}
                      >
                        <span>{t.sampleExplainLabel}</span>
                        <MathMarkdownRenderer content={tc.explanation} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === 'submissions' ? (
          /* Submissions List */
          <div className="space-y-4">
            <h2
              className={`text-sm font-bold ${
                isDark ? 'text-slate-200' : 'text-neutral-950'
              }`}
            >
              {t.submissionsHistoryTitle}
            </h2>

            {submissions.length === 0 ? (
              <div
                className={`text-center py-12 text-xs font-medium ${
                  isDark ? 'text-slate-500' : 'text-neutral-500'
                }`}
              >
                {t.noSubmissionsTip}
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-3.5 rounded-lg border space-y-2 text-xs shadow-xs transition-colors ${
                      isDark
                        ? 'bg-[#111827] border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={sub.status} />
                        <span
                          className={`text-[11px] font-mono ${
                            isDark ? 'text-slate-400' : 'text-neutral-500'
                          }`}
                        >
                          {t.testsCount(sub.passedTests, sub.totalTests)}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono ${
                          isDark ? 'text-slate-400' : 'text-neutral-500'
                        }`}
                      >
                        {sub.submittedAt}
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-between text-[11px] pt-1 border-t ${
                        isDark
                          ? 'border-slate-800 text-slate-400'
                          : 'border-slate-200 text-neutral-600'
                      }`}
                    >
                      <span>{t.submissionTime(sub.executionTimeMs)}</span>
                      <span
                        className={`font-semibold hover:underline cursor-pointer ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      >
                        {t.viewSubmittedCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Tab 3: Exercise Leaderboard */
          <div className="space-y-4">
            <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
                  {t.exerciseLeaderboardTitle(exercise.id)}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.leaderboardSortDesc}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <table className="w-full text-left border-collapse font-sans">
                <thead
                  className={`border-b border-slate-200 dark:border-slate-800 font-bold ${
                    isDark ? 'bg-[#0f172a] text-slate-400' : 'bg-slate-50 text-neutral-600'
                  }`}
                >
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14">{t.rankCol}</th>
                    <th className="py-2.5 px-3">{t.studentCol}</th>
                    <th className="py-2.5 px-3">{t.languageCol}</th>
                    <th className="py-2.5 px-3 text-center">{t.scoreCol}</th>
                    <th className="py-2.5 px-3">{t.runtimeCol}</th>
                    <th className="py-2.5 px-3">{t.memoryCol}</th>
                    <th className="py-2.5 px-3 text-right">{t.submittedAtCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                  {exerciseLeaderboard.map((row) => (
                    <tr
                      key={row.studentId}
                      className={`transition ${
                        row.isCurrentUser
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-l-[#1BA94C]'
                          : isDark
                          ? 'hover:bg-slate-800/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-bold">
                        {row.rank === 1 ? (
                          <span className="text-sm" title="Top 1">🥇</span>
                        ) : row.rank === 2 ? (
                          <span className="text-sm" title="Top 2">🥈</span>
                        ) : row.rank === 3 ? (
                          <span className="text-sm" title="Top 3">🥉</span>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">#{row.rank}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{row.name}</span>
                          {row.isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#1BA94C] text-white">
                              {t.youBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {row.studentId}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-300">
                        {row.language}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-[#00EA64]">
                        {row.score}/{row.maxScore}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        {row.executionTimeMs} ms
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {row.memoryMb} MB
                      </td>
                      <td className="py-2.5 px-3 text-right text-[11px] text-slate-500 font-sans">
                        {row.timeAgo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
