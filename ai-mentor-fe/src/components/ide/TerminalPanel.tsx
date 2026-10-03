import React, { useState } from 'react';
import { ExecutionResult } from '../../types/exercise';
import { Terminal, CheckCircle2, XCircle, AlertTriangle, Loader2, Bot, Play } from 'lucide-react';

interface TerminalPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onAskAIAboutError?: (errorText: string) => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  result,
  isRunning,
  onAskAIAboutError
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'console'>('tests');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);

  return (
    <div className="flex flex-col h-full bg-[#14141e] text-slate-200">
      {/* Terminal Header */}
      <div className="h-10 px-4 bg-[#0e0e15] border-t border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Kết quả Test Cases</span>
            {result && result.results.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  result.passedTests === result.totalTests
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {result.passedTests}/{result.totalTests}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Console Output</span>
          </button>
        </div>

        {/* Status indicator / ask AI button */}
        <div className="flex items-center space-x-3 text-xs">
          {isRunning ? (
            <div className="flex items-center space-x-2 text-blue-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang thực thi code...</span>
            </div>
          ) : result ? (
            <div className="flex items-center space-x-3">
              <span className="text-[11px] text-slate-400 font-mono">
                {result.executionTimeMs}ms
              </span>

              {/* Nếu có lỗi, hiện nút hỏi AI nổi bật */}
              {(result.status === 'error' || result.passedTests < result.totalTests) && onAskAIAboutError && (
                <button
                  onClick={() =>
                    onAskAIAboutError(
                      result.errorMessage || result.stdout || 'Chưa vượt qua test case'
                    )
                  }
                  className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded text-xs font-medium transition shadow-sm flex items-center gap-1.5 animate-pulse"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Hỏi AI về lỗi này</span>
                </button>
              )}
            </div>
          ) : (
            <span className="text-slate-400 text-xs">Sẵn sàng chạy thử</span>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
        {isRunning ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p>Hệ thống Sandbox đang biên dịch và chạy kiểm thử mã nguồn...</p>
          </div>
        ) : !result ? (
          <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-400">
            <Play className="w-7 h-7 text-slate-600" />
            <p>Bấm nút <strong>"Chạy thử"</strong> hoặc nhấn <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Ctrl + Enter</kbd> để kiểm tra mã nguồn.</p>
          </div>
        ) : activeTab === 'tests' ? (
          /* Test Cases Result View */
          <div className="space-y-4">
            {/* Error Banner nếu có Runtime/Syntax Error */}
            {result.errorMessage && (
              <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-rose-200">
                    Phát hiện lỗi khi thực thi mã nguồn:
                  </div>
                  <pre className="text-xs text-rose-300 whitespace-pre-wrap font-mono">
                    {result.errorMessage}
                  </pre>
                </div>
              </div>
            )}

            {/* Test Case Selection Tabs */}
            {result.results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  {result.results.map((tc, idx) => (
                    <button
                      key={tc.testCaseId}
                      onClick={() => setSelectedTestCaseIdx(idx)}
                      className={`px-3 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition ${
                        selectedTestCaseIdx === idx
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tc.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Case {idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Test Case Details */}
                {result.results[selectedTestCaseIdx] && (
                  <div className="space-y-3 bg-[#0e0e15] p-4 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[11px] mb-1">
                        Dữ liệu đầu vào (Input):
                      </span>
                      <pre className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono">
                        {result.results[selectedTestCaseIdx].input}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[11px] mb-1">
                          Kết quả mong đợi (Expected Output):
                        </span>
                        <pre className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono">
                          {result.results[selectedTestCaseIdx].expectedOutput}
                        </pre>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] mb-1">
                          Kết quả chương trình trả về (Actual Output):
                        </span>
                        <pre
                          className={`p-2.5 rounded bg-slate-900 font-mono ${
                            result.results[selectedTestCaseIdx].passed
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {result.results[selectedTestCaseIdx].actualOutput}
                        </pre>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>
                        Thời gian chạy case: {result.results[selectedTestCaseIdx].executionTimeMs}ms
                      </span>
                      <span
                        className={`font-semibold ${
                          result.results[selectedTestCaseIdx].passed
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {result.results[selectedTestCaseIdx].passed ? 'PASSED ✔' : 'FAILED ✖'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : !result.errorMessage ? (
              <div className="text-slate-400 text-center py-6">
                Chưa có dữ liệu test cases trả về.
              </div>
            ) : null}
          </div>
        ) : (
          /* Raw Console View */
          <div className="h-full">
            <pre className="p-3 bg-[#0e0e15] rounded-lg border border-slate-800 text-slate-300 font-mono whitespace-pre-wrap leading-5 min-h-[140px]">
              {result.stdout || 'Không có dữ liệu xuất ra màn hình (stdout rỗng).'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
