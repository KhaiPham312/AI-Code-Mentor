import React, { useState } from 'react';
import { User } from '../../types/auth';
import { Exercise, ExecutionResult, SubmissionRecord } from '../../types/exercise';
import { AIMessage, QuickPrompt, SocraticIntent } from '../../types/ai';
import {
  MOCK_EXERCISES,
  getExerciseById,
  runStudentCode,
  submitStudentCode,
  getSubmissionsForExercise
} from '../../services/mockExerciseService';
import {
  INITIAL_AI_MESSAGES,
  generateSocraticResponse
} from '../../services/mockAIService';
import { CodeEditor } from './CodeEditor';
import { ProblemDescription } from './ProblemDescription';
import { TerminalPanel } from './TerminalPanel';
import { AIMentorPanel } from './AIMentorPanel';
import {
  Play,
  ArrowLeft,
  ChevronDown,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Check,
  CheckCircle2
} from 'lucide-react';

interface StudentWorkspaceProps {
  user: User;
  onBackToDashboard: () => void;
  initialExerciseId?: number;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  user,
  onBackToDashboard,
  initialExerciseId = 1
}) => {
  // 1. Quản lý trạng thái bài tập hiện tại
  const [currentExercise, setCurrentExercise] = useState<Exercise>(
    getExerciseById(initialExerciseId) || MOCK_EXERCISES[0]
  );
  const [code, setCode] = useState<string>(currentExercise.boilerplateCode);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(
    getSubmissionsForExercise(currentExercise.id)
  );

  // 2. Trạng thái thực thi code & terminal
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // 3. Trạng thái AI Mentor Socratic
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 4. Quản lý hiển thị / ẩn panel (Thu gọn để tập trung viết code)
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Chuyển bài tập khác
  const handleSelectExercise = (exerciseId: number) => {
    const selected = getExerciseById(exerciseId);
    if (!selected) return;

    setCurrentExercise(selected);
    setCode(selected.boilerplateCode);
    setExecutionResult(null);
    setSubmissions(getSubmissionsForExercise(selected.id));
    setSubmitSuccessNotice(null);
  };

  // Khôi phục boilerplate
  const handleResetBoilerplate = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục lại mã nguồn ban đầu? Các thay đổi chưa lưu sẽ bị mất.')) {
      setCode(currentExercise.boilerplateCode);
    }
  };

  // Chạy thử code (Run Code Sandbox)
  const handleRunCode = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setSubmitSuccessNotice(null);

    try {
      const result = await runStudentCode(currentExercise, code);
      setExecutionResult(result);
    } catch {
      setExecutionResult({
        status: 'error',
        errorMessage: 'Lỗi không xác định khi kết nối tới Sandbox.',
        executionTimeMs: 0,
        results: [],
        passedTests: 0,
        totalTests: currentExercise.sampleTestCases.length
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Nộp bài chính thức (Submit Code)
  const handleSubmitCode = async () => {
    if (isSubmitting || isRunning) return;
    setIsSubmitting(true);
    setSubmitSuccessNotice(null);

    try {
      const record = await submitStudentCode(currentExercise, code);
      setSubmissions(prev => [record, ...prev]);

      if (record.status === 'passed') {
        setSubmitSuccessNotice(`🎉 Chúc mừng! Bạn đã giải thành công toàn bộ ${record.totalTests} test cases!`);
      } else {
        setSubmitSuccessNotice(`⚠️ Bài nộp đạt ${record.passedTests}/${record.totalTests} test cases. Hãy tối ưu lại code nhé!`);
      }
    } catch {
      alert('Gửi bài nộp thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gửi tin nhắn tới AI Mentor
  const handleSendMessage = async (
    content: string,
    intent: SocraticIntent = 'free_chat'
  ) => {
    if (isAiGenerating) return;

    // 1. Thêm tin nhắn của User
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content,
      timestamp: 'Vừa xong',
      intent
    };
    setAiMessages(prev => [...prev, userMsg]);
    setIsAiGenerating(true);

    // 2. Chuẩn bị tin nhắn phản hồi của AI (streaming)
    const aiMsgId = `ai-${Date.now()}`;
    const placeholderAiMsg: AIMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: 'Đang phản hồi...',
      isStreaming: true
    };
    setAiMessages(prev => [...prev, placeholderAiMsg]);

    try {
      const terminalErr =
        executionResult?.status === 'error' || executionResult?.status === 'failed'
          ? executionResult.errorMessage || executionResult.stdout
          : undefined;

      await generateSocraticResponse(
        intent,
        content,
        code,
        terminalErr,
        (currentText) => {
          setAiMessages(prev =>
            prev.map(m => (m.id === aiMsgId ? { ...m, content: currentText } : m))
          );
        }
      );
    } catch {
      setAiMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: 'Đã có lỗi xảy ra trong quá trình phản hồi của AI Mentor.' }
            : m
        )
      );
    } finally {
      setIsAiGenerating(false);
      setAiMessages(prev =>
        prev.map(m => (m.id === aiMsgId ? { ...m, isStreaming: false, timestamp: 'Vừa xong' } : m))
      );
    }
  };

  // Xử lý nút Prompt gợi ý nhanh
  const handleQuickPrompt = (prompt: QuickPrompt) => {
    let customText = prompt.title;
    if (prompt.id === 'explain_error') {
      customText = `Em đang gặp lỗi: "${executionResult?.errorMessage || 'Chưa vượt qua test case'}". Thầy/AI giải thích nguyên nhân và gợi mở hướng xử lý cho em với ạ!`;
    } else if (prompt.id === 'hint_next_step') {
      customText = 'Em đang viết đến đoạn này thì bị bí ý tưởng, AI có thể gợi mở bước tiếp theo cho em không?';
    } else if (prompt.id === 'analyze_complexity') {
      customText = 'Nhờ AI phân tích độ phức tạp thời gian và không gian bộ nhớ của thuật toán này giúp em.';
    } else if (prompt.id === 'suggest_test_cases') {
      customText = 'Có những trường hợp kiểm thử biên (edge cases) nào dễ gây lỗi cho bài này không ạ?';
    }

    if (!showRightPanel) {
      setShowRightPanel(true);
    }

    handleSendMessage(customText, prompt.id);
  };

  // Hỏi AI trực tiếp từ nút bấm ở Terminal
  const handleAskAIAboutError = (errorText: string) => {
    if (!showRightPanel) {
      setShowRightPanel(true);
    }
    handleSendMessage(
      `Mã nguồn của em chạy ra lỗi: ${errorText}. AI hãy giải thích bản chất lỗi và cho em câu hỏi gợi mở để tự sửa nhé!`,
      'explain_error'
    );
  };

  return (
    <div className="h-screen w-screen bg-[#0e0e17] text-slate-100 flex flex-col overflow-hidden">
      {/* ================= TOP NAVBAR ================= */}
      <header className="h-14 bg-[#11111b] border-b border-slate-800 px-4 flex items-center justify-between z-10 shrink-0 select-none">
        {/* Left: Logo & Exercise Picker */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700/60"
            title="Quay lại danh sách bài tập"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden md:block"></div>

          {/* Exercise Dropdown Selector */}
          <div className="relative group">
            <select
              value={currentExercise.id}
              onChange={(e) => handleSelectExercise(Number(e.target.value))}
              className="appearance-none bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-8 cursor-pointer focus:outline-none focus:border-blue-500 font-medium"
            >
              {MOCK_EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id} className="bg-slate-900 text-white">
                  {ex.title} ({ex.difficulty.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Center: Run & Submit Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Chạy thử code với Sample Test Cases (Ctrl + Enter)"
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/80 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 fill-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Đang chạy...' : 'Chạy thử'}</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            title="Nộp bài chính thức để chấm điểm toàn bộ test cases"
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition active:scale-95 shadow-sm shadow-emerald-900/40 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang chấm...' : 'Nộp bài'}</span>
          </button>
        </div>

        {/* Right: Layout Panel Toggles & User info */}
        <div className="flex items-center space-x-2">
          {/* Toggle Left (Problem) */}
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            title={showLeftPanel ? 'Thu gọn đề bài' : 'Mở rộng đề bài'}
            className={`p-1.5 rounded-lg text-xs border transition ${
              showLeftPanel
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {showLeftPanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          {/* Toggle Right (AI Mentor) */}
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            title={showRightPanel ? 'Thu gọn AI Mentor' : 'Mở AI Mentor'}
            className={`p-1.5 rounded-lg text-xs border transition flex items-center gap-1 ${
              showRightPanel
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            {showRightPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
          </button>

          <div className="h-5 w-px bg-slate-800 hidden md:block"></div>

          {/* User Avatar */}
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center font-bold text-[10px]">
              {user.name.charAt(0)}
            </div>
            <span className="text-slate-300 font-medium truncate max-w-[120px]">
              {user.name}
            </span>
          </div>
        </div>
      </header>

      {/* Thông báo kết quả nộp bài (nếu có) */}
      {submitSuccessNotice && (
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-emerald-800 text-xs text-emerald-300 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{submitSuccessNotice}</span>
          </div>
          <button
            onClick={() => setSubmitSuccessNotice(null)}
            className="text-slate-400 hover:text-white font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= WORKSPACE BODY ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL 1: PROBLEM DESCRIPTION (LEFT) */}
        {showLeftPanel && (
          <div className="w-[32%] min-w-[300px] max-w-[480px] h-full shrink-0 flex flex-col">
            <ProblemDescription
              exercise={currentExercise}
              submissions={submissions}
            />
          </div>
        )}

        {/* PANEL 2 & 3: CODE EDITOR + TERMINAL (CENTER) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-[360px]">
          {/* Top: Code Editor */}
          <div className="flex-1 h-3/5 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              language={currentExercise.language}
              onResetBoilerplate={handleResetBoilerplate}
            />
          </div>

          {/* Bottom: Terminal & Test Cases */}
          <div className="h-2/5 min-h-[180px] overflow-hidden">
            <TerminalPanel
              result={executionResult}
              isRunning={isRunning}
              onAskAIAboutError={handleAskAIAboutError}
            />
          </div>
        </div>

        {/* PANEL 4: AI CODE MENTOR SIDE-PANEL (RIGHT) */}
        {showRightPanel && (
          <div className="w-[32%] min-w-[320px] max-w-[480px] h-full shrink-0 flex flex-col">
            <AIMentorPanel
              messages={aiMessages}
              isGenerating={isAiGenerating}
              onSendMessage={handleSendMessage}
              onQuickPrompt={handleQuickPrompt}
              onClearHistory={() => setAiMessages(INITIAL_AI_MESSAGES)}
              hasTerminalError={
                executionResult?.status === 'error' ||
                (executionResult !== null &&
                  executionResult.passedTests < executionResult.totalTests)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
