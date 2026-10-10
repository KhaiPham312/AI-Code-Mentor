import React, { useState } from 'react';
import { ExecutionResult } from '../../types/exercise';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Bot, Play, Copy, Check, FileCode } from 'lucide-react';

interface TerminalPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onAskAIAboutError?: (errorText: string) => void;
  theme?: 'dark' | 'light';
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  result,
  isRunning,
  onAskAIAboutError,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'compiler' | 'console'>('tests');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isDark = theme
    ? theme === 'dark'
    : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasCompilerError = result?.status === 'error' || Boolean(result?.errorMessage);

  return (
    <div
      className={`flex flex-col h-full select-none transition-colors ${
        isDark ? 'bg-[#0d1117] text-slate-200' : 'bg-white text-neutral-900'
      }`}
    >
      {/* 1. TERMINAL HEADER: HackerRank Test Cases Tab Bar */}
      <div className="h-10 px-3 bg-slate-100 dark:bg-[#161b22] border-t border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Test Cases Results Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'tests'
                ? 'bg-white dark:bg-[#21262d] text-neutral-950 dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Test Cases</span>
            {result && result.results.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  result.passedTests === result.totalTests
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                }`}
              >
                {result.passedTests}/{result.totalTests}
              </span>
            )}
          </button>

          {/* Compiler Message Tab (shows red badge if error) */}
          {hasCompilerError && (
            <button
              type="button"
              onClick={() => setActiveTab('compiler')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'compiler'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span>Compiler Message</span>
            </button>
          )}

          {/* Raw Console Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'bg-white dark:bg-[#21262d] text-neutral-950 dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Raw Console</span>
          </button>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center space-x-3 text-xs">
          {isRunning ? (
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Executing test cases...</span>
            </div>
          ) : result ? (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {result.executionTimeMs} ms
              </span>
              {(result.status === 'error' || result.passedTests < result.totalTests) &&
                onAskAIAboutError && (
                  <button
                    type="button"
                    onClick={() =>
                      onAskAIAboutError(
                        result.errorMessage || result.stdout || 'Chưa vượt qua test case'
                      )
                    }
                    className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Hỏi AI gợi ý</span>
                  </button>
                )}
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Ready to run</span>
          )}
        </div>
      </div>

      {/* 2. TERMINAL BODY */}
      <div className="flex-1 overflow-y-auto p-4 text-xs font-mono select-text bg-white dark:bg-[#0d1117] transition-colors">
        {isRunning ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs">Hệ thống Sandbox đang biên dịch và chạy kiểm thử...</p>
          </div>
        ) : !result ? (
          <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-500 dark:text-slate-400">
            <Play className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            <p className="text-xs text-neutral-700 dark:text-slate-400">
              Nhấn <strong className="text-neutral-900 dark:text-slate-200">"Chạy thử (Run Code)"</strong> hoặc phím <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-neutral-900 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-sans">Ctrl + Enter</kbd> để kiểm tra mã nguồn.
            </p>
          </div>
        ) : activeTab === 'compiler' || (hasCompilerError && activeTab !== 'console' && result.results.length === 0) ? (
          /* Compiler Error View */
          <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>Compilation & Runtime Error</span>
            </div>
            <pre className="text-xs text-rose-700 dark:text-rose-300 whitespace-pre-wrap font-mono leading-relaxed bg-white dark:bg-[#0e0e15] p-3 rounded border border-rose-200 dark:border-rose-950">
              {result.errorMessage || result.stdout}
            </pre>
          </div>
        ) : activeTab === 'tests' ? (
          /* HackerRank Exact Test Cases View */
          <div className="space-y-4">
            {/* HackerRank-style horizontal sub-tabs: Test case 0, Test case 1... */}
            {result.results.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
                  {result.results.map((tc, idx) => (
                    <button
                      key={tc.testCaseId}
                      type="button"
                      onClick={() => setSelectedTestCaseIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                        selectedTestCaseIdx === idx
                          ? 'bg-white dark:bg-[#21262d] text-neutral-950 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-[#161b22] text-slate-600 dark:text-slate-400 hover:text-neutral-900 dark:hover:text-slate-200 border border-slate-200 dark:border-transparent'
                      }`}
                    >
                      {tc.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                      )}
                      <span>Test case {idx}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Test Case Card (HackerRank 1:1 format) */}
                {result.results[selectedTestCaseIdx] && (
                  <div className="space-y-3 bg-slate-50 dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            result.results[selectedTestCaseIdx].passed
                              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                              : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                          }`}
                        >
                          {result.results[selectedTestCaseIdx].passed ? 'Success' : 'Wrong Answer'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Execution time: {result.results[selectedTestCaseIdx].executionTimeMs} ms
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            result.results[selectedTestCaseIdx].input,
                            selectedTestCaseIdx
                          )
                        }
                        className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                      >
                        {copiedIndex === selectedTestCaseIdx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Input</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Input */}
                    <div>
                      <span className="text-neutral-800 dark:text-slate-400 block text-[11px] font-semibold mb-1">
                        Input
                      </span>
                      <pre className="p-3 rounded-lg bg-white dark:bg-[#0d1117] text-neutral-900 dark:text-slate-200 font-mono border border-slate-200 dark:border-slate-800/80 overflow-x-auto shadow-inner">
                        {result.results[selectedTestCaseIdx].input}
                      </pre>
                    </div>

                    {/* Your Output vs Expected Output */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-neutral-800 dark:text-slate-400 block text-[11px] font-semibold mb-1">
                          Your Output
                        </span>
                        <pre
                          className={`p-3 rounded-lg bg-white dark:bg-[#0d1117] font-mono border overflow-x-auto shadow-inner ${
                            result.results[selectedTestCaseIdx].passed
                              ? 'text-emerald-700 dark:text-emerald-400 border-slate-200 dark:border-slate-800/80'
                              : 'text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900/60'
                          }`}
                        >
                          {result.results[selectedTestCaseIdx].actualOutput}
                        </pre>
                      </div>

                      <div>
                        <span className="text-neutral-800 dark:text-slate-400 block text-[11px] font-semibold mb-1">
                          Expected Output
                        </span>
                        <pre className="p-3 rounded-lg bg-white dark:bg-[#0d1117] text-emerald-700 dark:text-emerald-400 font-mono border border-slate-200 dark:border-slate-800/80 overflow-x-auto shadow-inner">
                          {result.results[selectedTestCaseIdx].expectedOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 text-center py-6">
                Chưa có dữ liệu test cases trả về.
              </div>
            )}
          </div>
        ) : (
          /* Raw Console Output */
          <div className="h-full">
            <pre className="p-3.5 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-slate-800 text-neutral-900 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed min-h-[140px]">
              {result.stdout || 'Không có dữ liệu xuất ra màn hình (stdout rỗng).'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
