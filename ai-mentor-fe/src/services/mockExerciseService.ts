import { Exercise, ExecutionResult, SubmissionRecord } from '../types/exercise';
import { COMPREHENSIVE_EXERCISES } from './mockExercisesData';
import { evaluateCodeLocally } from './exerciseService';
import { getUserSubmissions, getUserStorageKey } from './userStorage';
import { User } from '../types/auth';

export const MOCK_EXERCISES: Exercise[] = COMPREHENSIVE_EXERCISES;

// Lưu lịch sử nộp bài trong phiên làm việc (cô lập theo từng studentKey)
let mockSubmissionsHistory: SubmissionRecord[] = [];

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

/**
 * Đọc lịch sử nộp bài của sinh viên cho một bài tập cụ thể
 * Student chỉ đọc bài nộp của đúng studentKey đang đăng nhập (Student A không thấy lịch sử của Student B).
 * Bản ghi cũ không có studentKey thì bỏ qua, không gán cho ai.
 */
export const getSubmissionsForExercise = (exerciseId: number, studentKey?: string): SubmissionRecord[] => {
  if (!studentKey || studentKey === 'guest') {
    return [];
  }
  const userSubs = getUserSubmissions(studentKey);
  const matched = userSubs.filter(sub => sub.exerciseId === exerciseId);
  if (matched.length > 0) {
    return matched.map(s => ({
      id: s.id,
      exerciseId: s.exerciseId,
      submittedAt: s.submittedAt,
      status: s.status,
      passedTests: s.passedTests,
      totalTests: s.totalTests,
      executionTimeMs: s.executionTimeMs,
      code: s.code,
      studentKey: s.studentKey || studentKey,
      studentName: s.studentName,
      studentEmail: s.studentEmail,
      studentId: s.studentId,
      memoryMb: s.memoryMb,
    }));
  }
  return mockSubmissionsHistory.filter(sub => sub.exerciseId === exerciseId && sub.studentKey === studentKey);
};

/**
 * Giả lập trình thực thi đa ngôn ngữ Sandbox (Run Code) sử dụng Smart Local Evaluator
 */
export const runStudentCode = async (
  exercise: Exercise,
  code: string
): Promise<ExecutionResult> => {
  // Giả lập độ trễ ngắn 300ms
  await new Promise(resolve => setTimeout(resolve, 300));
  return evaluateCodeLocally(exercise, code, exercise.language || 'python', false);
};

/**
 * Nộp bài chính thức (chấm cả test case ẩn) sử dụng Smart Local Evaluator
 */
export const submitStudentCode = async (
  exercise: Exercise,
  code: string,
  user?: User | null
): Promise<SubmissionRecord> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const localResult = evaluateCodeLocally(exercise, code, exercise.language || 'python', true);

  const studentKey = getUserStorageKey(user);
  const newSubmission: SubmissionRecord = {
    id: Date.now(),
    exerciseId: exercise.id,
    submittedAt: 'Vừa xong',
    status: localResult.status === 'passed' ? 'passed' : localResult.status === 'error' ? 'error' : 'failed',
    passedTests: localResult.passedTests,
    totalTests: localResult.totalTests,
    executionTimeMs: localResult.executionTimeMs,
    code,
    studentKey: studentKey !== 'guest' ? studentKey : undefined,
    studentName: user?.name,
    studentEmail: user?.email,
    studentId: user?.studentId ? String(user.studentId) : user?.id ? String(user.id) : undefined,
    memoryMb: 14.1,
  };

  mockSubmissionsHistory.unshift(newSubmission);
  return newSubmission;
};
