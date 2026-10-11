import { Exercise, ExecutionResult, SubmissionRecord, TestCaseResult } from '../types/exercise';
import { COMPREHENSIVE_EXERCISES } from './mockExercisesData';

export const MOCK_EXERCISES: Exercise[] = COMPREHENSIVE_EXERCISES;

// Lưu lịch sử nộp bài trong phiên làm việc
let mockSubmissionsHistory: SubmissionRecord[] = [
  {
    id: 101,
    exerciseId: 1,
    submittedAt: 'Hôm qua, 14:30',
    status: 'failed',
    passedTests: 4,
    totalTests: 7,
    executionTimeMs: 58,
    code: `# Lần nộp trước (bị lỗi Time Limit với số lớn)
def is_prime(n):
    if n < 2: return False
    for i in range(2, n): # O(N) quá chậm
        if n % i == 0: return False
    return True`
  }
];

export const getExercises = (): Exercise[] => {
  return MOCK_EXERCISES;
};

export const getExercisesByTrack = (trackId: string): Exercise[] => {
  const matched = MOCK_EXERCISES.filter((ex) => (ex.trackIds || []).includes(trackId));
  if (matched.length > 0) return matched;
  // Fallback if a specific track doesn't have custom tags
  return MOCK_EXERCISES.slice(0, 4);
};

export const getExerciseById = (id: number): Exercise | undefined => {
  return MOCK_EXERCISES.find(ex => ex.id === id);
};

export const getSubmissionsForExercise = (exerciseId: number): SubmissionRecord[] => {
  return mockSubmissionsHistory.filter(sub => sub.exerciseId === exerciseId);
};

/**
 * Giả lập trình thực thi đa ngôn ngữ Sandbox (Run Code)
 */
export const runStudentCode = async (
  exercise: Exercise,
  code: string
): Promise<ExecutionResult> => {
  // Giả lập độ trễ mạng và chạy subprocess (500ms - 900ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  const lang = exercise.language || 'python';

  // Kiểm tra lỗi cú pháp cơ bản (Python syntax checks)
  if (lang === 'python' && code.includes('def ') && !code.includes(':')) {
    return {
      status: 'error',
      errorMessage: 'SyntaxError: expected \':\' at end of function definition header',
      executionTimeMs: 12,
      results: [],
      passedTests: 0,
      totalTests: exercise.sampleTestCases.length,
      stdout: 'Traceback (most recent call last):\n  File "solution.py", line 1\n    def ...\n           ^\nSyntaxError: expected \':\''
    };
  }

  // Phát hiện lỗi thụt lề
  if (lang === 'python') {
    const lines = code.split('\n');
    const hasIndentError = lines.some(line => line.startsWith(' ') && (line.length - line.trimStart().length) % 2 !== 0 && (line.length - line.trimStart().length) % 4 !== 0);
    if (hasIndentError) {
      return {
        status: 'error',
        errorMessage: 'IndentationError: unindent does not match any outer indentation level',
        executionTimeMs: 15,
        results: [],
        passedTests: 0,
        totalTests: exercise.sampleTestCases.length,
        stdout: 'Traceback (most recent call last):\n  File "solution.py", line 4\n    IndentationError: unexpected indent'
      };
    }
  }

  // Nếu code để trống hoặc chỉ có pass
  const cleanCode = code.replace(/#.*$/gm, '').replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\s+/g, '');
  if (cleanCode.length < 15 || (cleanCode.includes('pass') && !cleanCode.includes('return'))) {
    const failedResults: TestCaseResult[] = exercise.sampleTestCases.map(tc => ({
      testCaseId: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: 'None',
      passed: false,
      executionTimeMs: 8,
      errorMessage: 'Hàm trả về None hoặc chưa hoàn thiện logic.'
    }));
    return {
      status: 'failed',
      stdout: `Running test cases on ${lang} sandbox...\nResult: None\nExpected: ` + exercise.sampleTestCases[0]?.expectedOutput,
      executionTimeMs: 24,
      results: failedResults,
      passedTests: 0,
      totalTests: exercise.sampleTestCases.length
    };
  }

  // Giả lập chạy test cases mẫu
  const results: TestCaseResult[] = exercise.sampleTestCases.map((tc, idx) => {
    return {
      testCaseId: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      passed: true,
      executionTimeMs: 14 + idx * 6
    };
  });

  const passedCount = results.filter(r => r.passed).length;

  return {
    status: passedCount === results.length ? 'passed' : 'failed',
    stdout: `[SANDBOX] ${lang.toUpperCase()} environment executed successfully.\nTested ${results.length} sample cases.\nTotal time: 38ms | Memory: 12.8 MB`,
    executionTimeMs: 38,
    results,
    passedTests: passedCount,
    totalTests: results.length
  };
};

/**
 * Nộp bài chính thức (chấm cả test case ẩn)
 */
export const submitStudentCode = async (
  exercise: Exercise,
  code: string
): Promise<SubmissionRecord> => {
  await new Promise(resolve => setTimeout(resolve, 900));

  const totalTests = exercise.sampleTestCases.length + exercise.hiddenTestCaseCount;
  const isCorrect = !code.includes('pass') && code.length > 30;

  const passedTests = isCorrect ? totalTests : Math.max(1, totalTests - 2);
  const status = passedTests === totalTests ? 'passed' : 'failed';

  const newSubmission: SubmissionRecord = {
    id: Date.now(),
    exerciseId: exercise.id,
    submittedAt: 'Vừa xong',
    status,
    passedTests,
    totalTests,
    executionTimeMs: 64,
    code
  };

  mockSubmissionsHistory.unshift(newSubmission);
  return newSubmission;
};
