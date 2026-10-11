import React, { useState } from 'react';
import { LiveSubmission } from '../../services/mockTeacherData';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  X,
  Code,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Cpu,
  Layers,
} from 'lucide-react';

interface TeacherCodeReviewModalProps {
  submission: LiveSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentTheme: ThemeMode;
}

export const TeacherCodeReviewModal: React.FC<TeacherCodeReviewModalProps> = ({
  submission,
  isOpen,
  onClose,
  currentLang,
  currentTheme,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !submission) return null;

  const isDark = currentTheme === 'dark';
  const isVie = currentLang === 'vie';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.submittedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (submission.status) {
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted ({submission.testCasesPassed}/{submission.totalTestCases})</span>
          </span>
        );
      case 'wrong_answer':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Wrong Answer ({submission.testCasesPassed}/{submission.totalTestCases})</span>
          </span>
        );
      case 'time_limit':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Limit Exceeded</span>
          </span>
        );
      case 'compile_error':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Compilation Error</span>
          </span>
        );
    }
  };

  const codeLines = submission.submittedCode.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative z-10 w-full max-w-3xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-[#0f172a] text-slate-100 border-slate-800'
            : 'bg-white text-neutral-900 border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-[#0b1322]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1BA94C] to-[#00EA64] text-white flex items-center justify-center font-bold text-sm shadow-md">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base">
                  {isVie ? 'Mã Nguồn Bài Nộp Của Sinh Viên' : 'Student Submitted Code Review'}
                </h3>
                {getStatusBadge()}
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-neutral-500'
                }`}
              >
                {submission.studentName} ({submission.studentId}) • {submission.exerciseTitle} • {submission.timeAgo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-200 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Key Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                isDark ? 'bg-[#15233c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {isVie ? 'Thời gian chạy' : 'Execution Time'}
                </span>
                <span className="font-bold font-mono">
                  {submission.executionTimeMs} ms
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                isDark ? 'bg-[#15233c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {isVie ? 'Bộ nhớ tiêu thụ' : 'Memory Peak'}
                </span>
                <span className="font-bold font-mono">
                  {submission.memoryMb} MB
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                isDark ? 'bg-[#15233c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#00EA64] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {isVie ? 'Kiểm tra đạo văn' : 'Plagiarism Scan'}
                </span>
                <span className="font-bold text-emerald-500">
                  {submission.plagiarismScore}% {isVie ? 'trùng lặp (Tự làm)' : 'similarity'}
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                isDark ? 'bg-[#15233c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Code className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {isVie ? 'Ngôn ngữ' : 'Language'}
                </span>
                <span className="font-bold font-mono">{submission.language}</span>
              </div>
            </div>
          </div>

          {/* Code Viewer Block */}
          <div className="border rounded-xl overflow-hidden shadow-xs border-slate-200 dark:border-slate-800">
            {/* Code Toolbar */}
            <div
              className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
                isDark ? 'bg-[#0a0f18] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-neutral-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="pl-2 font-medium">solution.py</span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 hover:text-emerald-500 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">{isVie ? 'Đã sao chép' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Sao chép mã' : 'Copy code'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Code lines with line numbers */}
            <div
              className={`p-4 font-mono text-xs overflow-x-auto leading-relaxed max-h-[380px] ${
                isDark ? 'bg-[#0b101b] text-slate-200' : 'bg-[#fcfdfd] text-neutral-900'
              }`}
            >
              <table className="w-full border-collapse">
                <tbody>
                  {codeLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-500/10">
                      <td className="pr-4 select-none text-right text-slate-400 dark:text-slate-600 w-8 text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-[#0b1322]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="text-xs text-slate-400">
            {isVie
              ? `Điểm hệ số: ${submission.score} / 10.0`
              : `Score: ${submission.score} / 10.0`}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-200 text-neutral-700'
              }`}
            >
              {isVie ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
