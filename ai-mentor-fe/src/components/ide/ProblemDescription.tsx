import React, { useState } from 'react';
import { Exercise, SubmissionRecord } from '../../types/exercise';
import { Clock, HardDrive, CheckCircle2, XCircle, History, FileText } from 'lucide-react';
import { MathMarkdownRenderer } from '../common/MathMarkdownRenderer';

interface ProblemDescriptionProps {
  exercise: Exercise;
  submissions: SubmissionRecord[];
  theme?: 'dark' | 'light';
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  exercise,
  submissions,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions'>('problem');

  const isDark = theme
    ? theme === 'dark'
    : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  const getDifficultyBadge = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            Dễ (Easy)
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            Trung bình (Medium)
          </span>
        );
      case 'hard':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
            Khó (Hard)
          </span>
        );
    }
  };

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
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
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
            <span>Mô tả đề bài</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
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
            <span>Lịch sử nộp ({submissions.length})</span>
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
                {getDifficultyBadge(exercise.difficulty)}
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'text-slate-300 bg-slate-800/70 border-slate-700'
                      : 'text-neutral-700 bg-slate-200 border-slate-300'
                  }`}
                >
                  {exercise.category}
                </span>
              </div>
              <h1
                className={`text-xl font-bold tracking-tight font-sans ${
                  isDark ? 'text-white' : 'text-neutral-950'
                }`}
              >
                {exercise.title}
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
                  <span>Giới hạn: {exercise.timeLimitMs}ms</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bộ nhớ: {exercise.memoryLimitMb}MB</span>
                </div>
              </div>
            </div>

            {/* Description with KaTeX and Markdown */}
            <div
              className={`text-sm leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-neutral-900'
              }`}
            >
              <MathMarkdownRenderer content={exercise.description} />
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
                  Đầu vào (Input)
                </h3>
                <div
                  className={`text-xs font-mono ${
                    isDark ? 'text-slate-300' : 'text-neutral-900'
                  }`}
                >
                  <MathMarkdownRenderer content={exercise.inputFormat} />
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
                  Đầu ra (Output)
                </h3>
                <div
                  className={`text-xs font-mono ${
                    isDark ? 'text-slate-300' : 'text-neutral-900'
                  }`}
                >
                  <MathMarkdownRenderer content={exercise.outputFormat} />
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
                Ràng buộc bài toán (Constraints)
              </h3>
              <ul
                className={`space-y-1.5 text-xs p-3 rounded-lg border shadow-xs transition-colors ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 text-neutral-900'
                }`}
              >
                {exercise.constraints.map((c, i) => (
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
                Ví dụ mẫu (Sample Test Cases)
              </h3>
              <div className="space-y-3">
                {exercise.sampleTestCases.map((tc, idx) => (
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
                      Ví dụ {idx + 1}:
                    </div>
                    <div>
                      <span
                        className={`block text-[11px] font-semibold ${
                          isDark ? 'text-slate-400' : 'text-neutral-700'
                        }`}
                      >
                        Đầu vào:
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
                        Kết quả kỳ vọng:
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
                        <span>Giải thích: </span>
                        <MathMarkdownRenderer content={tc.explanation} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Submissions List */
          <div className="space-y-4">
            <h2
              className={`text-sm font-bold ${
                isDark ? 'text-slate-200' : 'text-neutral-950'
              }`}
            >
              Lịch sử các lần nộp bài của bạn
            </h2>

            {submissions.length === 0 ? (
              <div
                className={`text-center py-12 text-xs font-medium ${
                  isDark ? 'text-slate-500' : 'text-neutral-500'
                }`}
              >
                Chưa có lần nộp bài nào. Hãy bấm "Nộp bài" sau khi hoàn thành code!
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
                        {sub.status === 'passed' ? (
                          <div
                            className={`flex items-center space-x-1.5 font-bold ${
                              isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted (Đã đạt)</span>
                          </div>
                        ) : (
                          <div
                            className={`flex items-center space-x-1.5 font-bold ${
                              isDark ? 'text-rose-400' : 'text-rose-600'
                            }`}
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Wrong Answer (Chưa đạt)</span>
                          </div>
                        )}
                        <span
                          className={`text-[11px] font-mono ${
                            isDark ? 'text-slate-400' : 'text-neutral-500'
                          }`}
                        >
                          ({sub.passedTests}/{sub.totalTests} tests)
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
                      <span>Thời gian: {sub.executionTimeMs}ms</span>
                      <span
                        className={`font-semibold hover:underline cursor-pointer ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      >
                        Xem lại mã nộp
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
