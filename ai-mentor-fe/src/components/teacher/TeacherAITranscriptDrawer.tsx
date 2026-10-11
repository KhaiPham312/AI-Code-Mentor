import React from 'react';
import { StudentAIAuditLog } from '../../services/mockTeacherData';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  X,
  Bot,
  User,
  AlertTriangle,
  Sparkles,
  Code,
  Send,
  Lightbulb,
} from 'lucide-react';

interface TeacherAITranscriptDrawerProps {
  log: StudentAIAuditLog | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentTheme: ThemeMode;
  onPreviewStudentIDE?: (exerciseId: number) => void;
}

export const TeacherAITranscriptDrawer: React.FC<TeacherAITranscriptDrawerProps> = ({
  log,
  isOpen,
  onClose,
  currentLang,
  currentTheme,
  onPreviewStudentIDE,
}) => {
  if (!isOpen || !log) return null;

  const isDark = currentTheme === 'dark';
  const isVie = currentLang === 'vie';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`relative z-10 w-full max-w-xl h-full flex flex-col shadow-2xl transition-transform duration-300 animate-in slide-in-from-right ${
          isDark
            ? 'bg-[#0f172a] text-slate-100 border-l border-slate-800'
            : 'bg-white text-neutral-900 border-l border-slate-200'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`p-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-[#0b1322]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base truncate">
                  {isVie ? 'Nhật ký Hội thoại AI Socratic' : 'AI Socratic Chat Transcript'}
                </h3>
                {log.needsTeacherHelp ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                    {isVie ? 'Cần hỗ trợ !' : 'Needs Help !'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {isVie ? 'Đã tự giải quyết ✔' : 'Resolved ✔'}
                  </span>
                )}
              </div>
              <p
                className={`text-xs truncate ${
                  isDark ? 'text-slate-400' : 'text-neutral-500'
                }`}
              >
                {log.studentName} ({log.studentId}) • {log.timeAgo}
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

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Exercise & Error Diagnostic Card */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              isDark
                ? 'bg-[#15233c]/60 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider block ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  {isVie ? 'Bài tập đang thực hành' : 'Current Exercise'}
                </span>
                <h4 className="text-sm font-bold mt-0.5">{log.exerciseTitle}</h4>
              </div>
              {onPreviewStudentIDE && (
                <button
                  type="button"
                  onClick={() => onPreviewStudentIDE(log.exerciseId)}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1 shrink-0"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{isVie ? 'Xem bài' : 'Open IDE'}</span>
                </button>
              )}
            </div>

            {/* Error Banner */}
            <div
              className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                log.needsTeacherHelp
                  ? isDark
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                  : isDark
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <span className="font-bold font-mono block">{log.errorType}</span>
                <span className="text-[11px] font-mono leading-relaxed block mt-0.5">
                  {log.errorDetails}
                </span>
                <span className="text-[10px] mt-1 block opacity-80">
                  {isVie
                    ? `Sinh viên đã thử ${log.attemptCount} lần liên tiếp`
                    : `Student attempted ${log.attemptCount} consecutive times`}
                </span>
              </div>
            </div>
          </div>

          {/* Pedagogical Insight Card */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isVie ? 'Phân tích Tư duy Sư phạm (AI Insights)' : 'Pedagogical Evaluation'}</span>
            </div>
            <p className="text-xs leading-relaxed font-sans opacity-95">
              {log.pedagogicalInsight}
            </p>
          </div>

          {/* Code Snapshot at Time of Error */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isVie ? 'Đoạn mã lúc phát sinh lỗi' : 'Code Snapshot at Error'}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Python 3.11</span>
            </div>
            <pre
              className={`p-3.5 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto ${
                isDark
                  ? 'bg-[#0b101b] border-slate-800 text-slate-200'
                  : 'bg-slate-100 border-slate-300 text-neutral-900'
              }`}
            >
              {log.studentCodeSnapshot}
            </pre>
          </div>

          {/* Chronological Chat Conversation Stream */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{isVie ? 'Dòng trao đổi trực tiếp với AI' : 'Live Dialogue Flow'}</span>
            </h4>

            <div className="space-y-4">
              {log.transcript.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'student' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    {msg.sender === 'student' ? (
                      <>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {log.studentName}
                        </span>
                        <User className="w-3 h-3 text-slate-400" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-semibold text-emerald-500">
                          AI Socratic Mentor
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.time}
                    </span>
                  </div>

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'student'
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-sm'
                        : isDark
                        ? 'bg-[#15233c] text-slate-100 border border-slate-800 rounded-tl-xs shadow-sm'
                        : 'bg-slate-100 text-neutral-900 border border-slate-200 rounded-tl-xs shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.codeSnippet && (
                      <pre
                        className={`mt-2 p-2 rounded-lg text-[11px] font-mono whitespace-pre-wrap ${
                          msg.sender === 'student'
                            ? 'bg-indigo-800/70 text-indigo-100'
                            : isDark
                            ? 'bg-[#0c121d] text-emerald-400 border border-slate-800'
                            : 'bg-white text-emerald-700 border border-slate-300'
                        }`}
                      >
                        {msg.codeSnippet}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 shrink-0 ${
            isDark ? 'border-slate-800 bg-[#0b1322]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                log.resolved ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'
              }`}
            />
            <span className="text-xs font-medium">
              {log.resolved
                ? isVie
                  ? 'Trạng thái: Hoàn thành'
                  : 'Status: Completed'
                : isVie
                ? 'Trạng thái: Bế tắc'
                : 'Status: Blocked'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                alert(
                  isVie
                    ? `Đã gửi lời khuyên sư phạm tới sinh viên ${log.studentName}!`
                    : `Guidance feedback sent to student ${log.studentName}!`
                );
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isVie ? 'Gửi lời khuyên' : 'Send Feedback'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
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
