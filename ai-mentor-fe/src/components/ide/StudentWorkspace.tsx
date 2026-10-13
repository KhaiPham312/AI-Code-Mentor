import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../../types/auth';
import { Exercise, ExecutionResult, SubmissionRecord } from '../../types/exercise';
import {
  MOCK_EXERCISES,
  getExerciseById,
  runStudentCode,
  submitStudentCode,
  getSubmissionsForExercise,
} from '../../services/mockExerciseService';
import {
  fetchExerciseById,
  executeStudentCode,
  submitStudentCodeBackend,
  fetchSubmissionsForExercise,
} from '../../services/exerciseService';
import { CodeEditor } from './CodeEditor';
import { ProblemDescription } from './ProblemDescription';
import { TerminalPanel } from './TerminalPanel';
import { FloatingAIMentorChat } from '../common/FloatingAIMentorChat';
import {
  Play,
  ArrowLeft,
  Check,
  CheckCircle2,
  Maximize2,
  Minimize2,
  GripVertical,
  GripHorizontal,
  Sun,
  Moon,
} from 'lucide-react';
import { ThemeMode } from '../dashboard/dashboardI18n';

interface StudentWorkspaceProps {
  user: User;
  onBackToDashboard: (trackId?: string) => void;
  initialExerciseId?: number;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  user: _user,
  onBackToDashboard,
  initialExerciseId = 1,
  currentTheme = 'dark',
  onThemeToggle,
}) => {
  // 1. Current Exercise State
  const [currentExercise, setCurrentExercise] = useState<Exercise>(
    getExerciseById(initialExerciseId) || MOCK_EXERCISES[0]
  );
  const [code, setCode] = useState<string>(currentExercise.boilerplateCode);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(
    getSubmissionsForExercise(currentExercise.id)
  );

  // Sync with Backend on mount or when initialExerciseId changes
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const beEx = await fetchExerciseById(initialExerciseId);
        if (isMounted && beEx) {
          setCurrentExercise(beEx);
          setCode((prev) => (prev === currentExercise.boilerplateCode ? beEx.boilerplateCode : prev));
        }
      } catch (err) {
        console.warn('Fallback to mock exercise data:', err);
      }

      try {
        const beSubs = await fetchSubmissionsForExercise(initialExerciseId);
        if (isMounted && beSubs && beSubs.length > 0) {
          setSubmissions(beSubs);
        }
      } catch {
        // Fallback to existing mock submissions
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [initialExerciseId]);

  // 2. Execution & Submission States
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 3. 2-Pane Resizable Layout States (Standard HackerRank)
  // Left: Problem Description (42%) | Right: Code Editor (top) + Terminal (bottom)
  const [leftWidth, setLeftWidth] = useState(42); // 42%
  const [editorHeight, setEditorHeight] = useState(60); // 60% top, 40% bottom drawer

  // Dragging states
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Switch Exercise helper
  const _handleSelectExercise = (exerciseId: number) => {
    const selected = getExerciseById(exerciseId);
    if (!selected) return;

    setCurrentExercise(selected);
    setCode(selected.boilerplateCode);
    setExecutionResult(null);
    setSubmissions(getSubmissionsForExercise(selected.id));
    setSubmitSuccessNotice(null);
  };
  void _handleSelectExercise;

  // Reset boilerplate
  const handleResetBoilerplate = () => {
    if (
      window.confirm(
        'Bạn có chắc muốn khôi phục lại mã nguồn ban đầu? Các thay đổi chưa lưu sẽ bị mất.'
      )
    ) {
      setCode(currentExercise.boilerplateCode);
    }
  };

  // Run Code (Sample Test Cases)
  const handleRunCode = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setSubmitSuccessNotice(null);

    try {
      let result: ExecutionResult;
      try {
        result = await executeStudentCode(
          currentExercise.id,
          code,
          currentExercise.language || 'python'
        );
      } catch (beErr) {
        console.warn('Backend run failed, fallback to mock runner:', beErr);
        result = await runStudentCode(currentExercise, code);
      }
      setExecutionResult(result);
    } catch {
      setExecutionResult({
        status: 'error',
        totalTests: currentExercise.sampleTestCases.length,
        passedTests: 0,
        executionTimeMs: 0,
        errorMessage: 'Đã xảy ra sự cố trong quá trình khởi tạo môi trường biên dịch.',
        results: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code (Official Evaluation)
  const handleSubmitCode = async () => {
    if (isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitSuccessNotice(null);

    try {
      let subRecord: SubmissionRecord;
      try {
        subRecord = await submitStudentCodeBackend(
          currentExercise.id,
          code,
          currentExercise.language || 'python'
        );
      } catch (beErr) {
        console.warn('Backend submit failed, fallback to mock submit:', beErr);
        subRecord = await submitStudentCode(currentExercise, code);
      }

      // Refresh submissions list
      try {
        const beSubs = await fetchSubmissionsForExercise(currentExercise.id);
        if (beSubs.length > 0) setSubmissions(beSubs);
        else setSubmissions(getSubmissionsForExercise(currentExercise.id));
      } catch {
        setSubmissions(getSubmissionsForExercise(currentExercise.id));
      }

      const isAllPassed = subRecord.status === 'passed';
      setExecutionResult({
        status: subRecord.status,
        executionTimeMs: subRecord.executionTimeMs,
        passedTests: subRecord.passedTests,
        totalTests: subRecord.totalTests,
        results: currentExercise.sampleTestCases.map((tc, idx) => ({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.expectedOutput,
          passed: isAllPassed || idx < subRecord.passedTests,
          executionTimeMs: 14 + idx * 5,
        })),
        stdout: `[SUBMISSION SCORING] ${subRecord.passedTests}/${subRecord.totalTests} test cases passed. Status: ${subRecord.status.toUpperCase()}`,
      });

      if (isAllPassed) {
        setSubmitSuccessNotice(
          `🎉 Chúc mừng! Bạn đã giải thành công bài tập "${currentExercise.title}" (+${currentExercise.score || 100} điểm).`
        );
      } else {
        setSubmitSuccessNotice(
          `Kết quả nộp bài: Đạt ${subRecord.passedTests}/${subRecord.totalTests} test cases. Hãy kiểm tra lại các trường hợp biên!`
        );
      }
    } catch {
      setExecutionResult({
        status: 'error',
        totalTests: currentExercise.sampleTestCases.length + currentExercise.hiddenTestCaseCount,
        passedTests: 0,
        executionTimeMs: 0,
        errorMessage: 'Không thể kết nối đến máy chủ chấm bài.',
        results: [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Resizing mouse listeners
  const handleMouseDownVerticalDivider = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingVertical(true);
  };

  const handleMouseDownHorizontalDivider = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingHorizontal(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (isDraggingVertical) {
        const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
        if (newLeftWidth >= 22 && newLeftWidth <= 68) {
          setLeftWidth(newLeftWidth);
        }
      }

      if (isDraggingHorizontal) {
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        if (newHeight >= 25 && newHeight <= 80) {
          setEditorHeight(newHeight);
        }
      }
    },
    [isDraggingVertical, isDraggingHorizontal]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingHorizontal(false);
  }, []);

  useEffect(() => {
    if (isDraggingVertical || isDraggingHorizontal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDraggingHorizontal ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingVertical, isDraggingHorizontal, handleMouseMove, handleMouseUp]);

  const primaryTrack = currentExercise.trackIds?.[0] || 'python';

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden select-none antialiased ${
        currentTheme === 'dark' ? 'dark bg-[#0e141e] text-slate-100' : 'bg-slate-50 text-neutral-900'
      }`}
    >
      {/* ================= 1. HACKERRANK 1:1 SITE HEADER (TINH GỌN) ================= */}
      <header className="h-14 bg-white dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 text-slate-900 dark:text-white transition-colors">
        {/* LEFT: Logo + Breadcrumbs (AI CODE MENTOR | Prepare > Track > Problem) */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          {/* Logo */}
          <div
            onClick={() => onBackToDashboard()}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            title="Quay lại danh mục luyện tập"
          >
            <div className="w-8 h-8 rounded bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
              <span className="font-mono text-lg font-extrabold tracking-tighter">H</span>
            </div>
            <span className="hidden lg:inline text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              AI Code Mentor
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block flex-shrink-0" />

          {/* Clean Breadcrumb Navigation: AI CODE MENTOR | Prepare > [Topic] > [Problem] */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 truncate"
          >
            <span
              onClick={() => onBackToDashboard()}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer font-semibold transition-colors"
            >
              Prepare
            </span>
            <span>&gt;</span>
            <span
              onClick={() => onBackToDashboard(primaryTrack)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer font-medium transition-colors truncate max-w-[120px] sm:max-w-[160px]"
              title={`Xem danh sách bài tập của khóa: ${currentExercise.category}`}
            >
              {currentExercise.category}
            </span>
            <span>&gt;</span>
            <span className="text-slate-950 dark:text-slate-100 font-bold truncate max-w-[160px] sm:max-w-[280px] lg:max-w-[360px]">
              {currentExercise.title}
            </span>
          </nav>
        </div>

        {/* RIGHT: Run Code, Submit Code, Theme Toggle, Fullscreen & Back */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Run Code Button */}
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Chạy thử code với Sample Test Cases"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#21262d] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600/80 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
          >
            <Play
              className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 ${
                isRunning ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Code Button (HackerRank Green) */}
          <button
            type="button"
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            title="Nộp bài chính thức để chấm điểm toàn bộ test cases"
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#1BA94C] hover:bg-[#15893d] text-white text-xs font-semibold transition active:scale-95 shadow-sm shadow-emerald-900/40 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Scoring...' : 'Submit Code'}</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Theme Toggle Button */}
          {onThemeToggle && (
            <button
              type="button"
              onClick={onThemeToggle}
              title={currentTheme === 'dark' ? 'Chuyển sang Theme Sáng' : 'Chuyển sang Theme Tối'}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Back to Dashboard */}
          <button
            type="button"
            onClick={() => onBackToDashboard()}
            title="Quay lại Dashboard"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Submission Success Notice Banner */}
      {submitSuccessNotice && (
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-emerald-800 text-xs text-emerald-300 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{submitSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmitSuccessNotice(null)}
            className="text-slate-400 hover:text-white font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= 2. 2-PANE RESIZABLE WORKSPACE (HACKERRANK 1:1) ================= */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* PANE 1: PROBLEM DESCRIPTION (LEFT) */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="h-full shrink-0 flex flex-col overflow-hidden min-w-[280px] max-w-[70%]"
        >
          <ProblemDescription exercise={currentExercise} submissions={submissions} theme={currentTheme} />
        </div>

        {/* VERTICAL DRAGGABLE RESIZER HANDLE (Between Left Problem & Right Editor) */}
        <div
          onMouseDown={handleMouseDownVerticalDivider}
          className={`w-2 hover:w-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-[#1BA94C] dark:hover:bg-[#1BA94C] transition-all cursor-col-resize flex items-center justify-center group z-10 ${
            isDraggingVertical ? 'bg-[#1BA94C]' : ''
          }`}
          title="Kéo thả để điều chỉnh độ rộng Đề bài / Code Editor"
        >
          <GripVertical className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-white" />
        </div>

        {/* PANE 2: RIGHT SIDE (CODE EDITOR + CONSOLE DRAWER) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-[340px]">
          {/* Top: Code Editor */}
          <div style={{ height: `${editorHeight}%` }} className="overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              exerciseLanguage={currentExercise.language}
              onResetBoilerplate={handleResetBoilerplate}
              systemTheme={currentTheme}
              onThemeToggle={onThemeToggle}
            />
          </div>

          {/* HORIZONTAL DRAGGABLE RESIZER HANDLE */}
          <div
            onMouseDown={handleMouseDownHorizontalDivider}
            className={`h-2 hover:h-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-[#1BA94C] dark:hover:bg-[#1BA94C] transition-all cursor-row-resize flex items-center justify-center group z-10 ${
              isDraggingHorizontal ? 'bg-[#1BA94C]' : ''
            }`}
            title="Kéo thả để điều chỉnh chiều cao Terminal"
          >
            <GripHorizontal className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-white" />
          </div>

          {/* Bottom: Terminal & Test Cases Drawer */}
          <div style={{ height: `${100 - editorHeight}%` }} className="overflow-hidden min-h-[160px]">
            <TerminalPanel
              result={executionResult}
              isRunning={isRunning}
              theme={currentTheme}
            />
          </div>
        </div>
      </div>

      {/* ================= 3. FLOATING AI MENTOR CHAT BUBBLE ================= */}
      <FloatingAIMentorChat
        exerciseTitle={currentExercise.title}
        category={currentExercise.category}
        codeContext={code}
        errorContext={
          executionResult?.status === 'error'
            ? executionResult.errorMessage
            : undefined
        }
        theme={currentTheme}
      />
    </div>
  );
};
