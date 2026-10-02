import React, { useState } from 'react';
import { Exercise, SubmissionRecord } from '../../types/exercise';
import { Clock, HardDrive, CheckCircle2, XCircle, History, FileText } from 'lucide-react';

interface ProblemDescriptionProps {
  exercise: Exercise;
  submissions: SubmissionRecord[];
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  exercise,
  submissions
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions'>('problem');

  const getDifficultyBadge = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            Dễ (Easy)
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 text-amber-400 border border-amber-800">
            Trung bình (Medium)
          </span>
        );
      case 'hard':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/80 text-rose-400 border border-rose-800">
            Khó (Hard)
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200">
      {/* Tab Header */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'problem'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Mô tả đề bài</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Lịch sử nộp ({submissions.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
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
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                  {exercise.category}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {exercise.title}
              </h1>

              {/* Limits */}
              <div className="flex items-center space-x-4 mt-3 text-xs text-slate-400 pb-4 border-b border-slate-800">
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

            {/* Description */}
            <div className="text-sm leading-relaxed text-slate-300 space-y-3 whitespace-pre-line">
              {exercise.description}
            </div>

            {/* Input & Output Format */}
            <div className="space-y-4 pt-2">
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Đầu vào (Input)
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  {exercise.inputFormat}
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Đầu ra (Output)
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  {exercise.outputFormat}
                </div>
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Ràng buộc bài toán (Constraints)
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                {exercise.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Sample Test Cases */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Ví dụ mẫu (Sample Test Cases)
              </h3>
              <div className="space-y-3">
                {exercise.sampleTestCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs"
                  >
                    <div className="text-blue-400 font-semibold text-[11px] uppercase tracking-wider">
                      Ví dụ {idx + 1}:
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Đầu vào:</span>
                      <pre className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono overflow-x-auto">
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Kết quả kỳ vọng:</span>
                      <pre className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono overflow-x-auto">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                    {tc.explanation && (
                      <div className="text-slate-400 text-[11px] pt-1 italic">
                        Giải thích: {tc.explanation}
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
            <h2 className="text-sm font-semibold text-slate-200">
              Lịch sử các lần nộp bài của bạn
            </h2>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Chưa có lần nộp bài nào. Hãy bấm "Nộp bài" sau khi hoàn thành code!
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {sub.status === 'passed' ? (
                          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted (Đã đạt)</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-rose-400 font-semibold">
                            <XCircle className="w-4 h-4" />
                            <span>Wrong Answer (Chưa đạt)</span>
                          </div>
                        )}
                        <span className="text-slate-400 text-[11px]">
                          ({sub.passedTests}/{sub.totalTests} tests)
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {sub.submittedAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Thời gian: {sub.executionTimeMs}ms</span>
                      <span className="text-blue-400 hover:underline cursor-pointer">
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
