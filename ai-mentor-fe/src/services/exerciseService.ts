import { api } from './apiClient';
import {
  Exercise,
  ExecutionResult,
  SubmissionRecord,
  Difficulty,
  TestCaseResult,
} from '../types/exercise';
import { COMPREHENSIVE_EXERCISES } from './mockExercisesData';

// Backend Response Schemas
export interface BackendTestCase {
  id: number;
  input: string;
  expected_output: string;
  explanation?: string | null;
  is_hidden: boolean;
}

export interface BackendExerciseListItem {
  id: number;
  subject_id?: number | null;
  title: string;
  difficulty: string;
  category: string;
  language: string;
  status?: string;
  sample_test_cases_count: number;
  hidden_test_cases_count: number;
  created_at: string;
}

export interface BackendExerciseDetail {
  id: number;
  subject_id?: number | null;
  title: string;
  difficulty: string;
  category: string;
  language: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  description: string;
  input_format?: string | null;
  output_format?: string | null;
  constraints?: string | null;
  boilerplate_code?: string | null;
  is_published: boolean;
  sample_test_cases: BackendTestCase[];
  hidden_test_cases_count: number;
  status?: string;
}

export interface BackendCodeRunResponse {
  status: 'idle' | 'running' | 'passed' | 'failed' | 'error';
  stdout?: string | null;
  error_message?: string | null;
  execution_time_ms: number;
  passed_tests: number;
  total_tests: number;
  results: {
    test_case_id: number;
    input: string;
    expected_output: string;
    actual_output: string;
    passed: boolean;
    execution_time_ms: number;
    error_message?: string | null;
  }[];
}

export interface BackendSubmissionItem {
  id: number;
  exercise_id: number;
  user_id: number;
  language: string;
  status: string;
  passed_tests: number;
  total_tests: number;
  execution_time_ms: number;
  submitted_at: string;
  source_code?: string;
}

/**
 * Adapter: Chuyển đổi ExerciseDetail từ Backend sang Exercise Interface của Frontend
 */
export function mapBackendExerciseToFrontend(bEx: BackendExerciseDetail): Exercise {
  let parsedConstraints: string[] = [];
  if (bEx.constraints) {
    try {
      const parsed = JSON.parse(bEx.constraints);
      if (Array.isArray(parsed)) parsedConstraints = parsed;
      else parsedConstraints = [bEx.constraints];
    } catch {
      parsedConstraints = [bEx.constraints];
    }
  }

  return {
    id: bEx.id,
    subjectId: bEx.subject_id || 1,
    title: bEx.title,
    difficulty: (bEx.difficulty.toLowerCase() || 'easy') as Difficulty,
    category: bEx.category,
    language: (bEx.language || 'python') as any,
    timeLimitMs: bEx.time_limit_ms,
    memoryLimitMb: bEx.memory_limit_mb,
    description: bEx.description,
    inputFormat: bEx.input_format || '',
    outputFormat: bEx.output_format || '',
    constraints: parsedConstraints,
    boilerplateCode: bEx.boilerplate_code || '# Viết mã nguồn của bạn tại đây\n',
    sampleTestCases: (bEx.sample_test_cases || []).map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expected_output,
      explanation: tc.explanation || undefined,
      isHidden: tc.is_hidden,
    })),
    hiddenTestCaseCount: bEx.hidden_test_cases_count || 0,
    status: (bEx.status as any) || 'not_started',
  };
}

/**
 * Lấy danh sách bài tập từ Backend (fallback sang mock nếu backend chưa chạy hoặc chưa có data)
 */
export async function fetchExercises(params?: {
  skip?: number;
  limit?: number;
  difficulty?: string;
  category?: string;
}): Promise<Exercise[]> {
  try {
    const list = await api.get<BackendExerciseListItem[]>('/exercises', { params });
    if (!list || list.length === 0) {
      return COMPREHENSIVE_EXERCISES;
    }

    // Map list items thành format Exercise
    return list.map((item) => {
      // Tìm trong mock nếu cần boilerplate hoặc lấy cơ bản
      const mockMatch = COMPREHENSIVE_EXERCISES.find((m) => m.id === item.id);
      return {
        id: item.id,
        subjectId: item.subject_id || 1,
        title: item.title,
        difficulty: (item.difficulty.toLowerCase() || 'easy') as Difficulty,
        category: item.category,
        language: (item.language || 'python') as any,
        timeLimitMs: mockMatch?.timeLimitMs || 1000,
        memoryLimitMb: mockMatch?.memoryLimitMb || 128,
        description: mockMatch?.description || item.title,
        inputFormat: mockMatch?.inputFormat || '',
        outputFormat: mockMatch?.outputFormat || '',
        constraints: mockMatch?.constraints || [],
        boilerplateCode: mockMatch?.boilerplateCode || '# Viết code của bạn tại đây\n',
        sampleTestCases: mockMatch?.sampleTestCases || [],
        hiddenTestCaseCount: item.hidden_test_cases_count,
        status: (item.status as any) || 'not_started',
        trackIds: mockMatch?.trackIds,
      };
    });
  } catch (err) {
    console.warn('Lỗi khi fetch bài tập từ backend, sử dụng mock exercises:', err);
    return COMPREHENSIVE_EXERCISES;
  }
}

/**
 * Lấy chi tiết một bài tập theo ID
 */
export async function fetchExerciseById(id: number): Promise<Exercise> {
  try {
    const detail = await api.get<BackendExerciseDetail>(`/exercises/${id}`);
    const mockMatch = COMPREHENSIVE_EXERCISES.find((m) => m.id === id);
    const converted = mapBackendExerciseToFrontend(detail);
    if (mockMatch?.trackIds) {
      converted.trackIds = mockMatch.trackIds;
    }
    return converted;
  } catch (err) {
    console.warn(`Lỗi khi fetch bài tập #${id} từ backend, fallback sang mock:`, err);
    const mockEx = COMPREHENSIVE_EXERCISES.find((e) => e.id === id);
    if (mockEx) return mockEx;
    throw err;
  }
}

/**
 * Chạy thử nghiệm code (Run Code against sample test cases)
 */
export async function executeStudentCode(
  exerciseId: number,
  code: string,
  language: string = 'python',
  customInput?: string
): Promise<ExecutionResult> {
  try {
    const res = await api.post<BackendCodeRunResponse>('/submissions/run', {
      exercise_id: exerciseId,
      source_code: code,
      language: language,
      custom_input: customInput || null,
    });

    const mappedResults: TestCaseResult[] = (res.results || []).map((r) => ({
      testCaseId: r.test_case_id,
      input: r.input,
      expectedOutput: r.expected_output,
      actualOutput: r.actual_output,
      passed: r.passed,
      executionTimeMs: r.execution_time_ms,
      errorMessage: r.error_message || undefined,
    }));

    return {
      status: res.status,
      stdout: res.stdout || undefined,
      errorMessage: res.error_message || undefined,
      executionTimeMs: res.execution_time_ms,
      passedTests: res.passed_tests,
      totalTests: res.total_tests,
      results: mappedResults,
    };
  } catch (err: any) {
    return {
      status: 'error',
      errorMessage: err?.message || 'Lỗi kết nối máy chủ chấm code.',
      executionTimeMs: 0,
      passedTests: 0,
      totalTests: 0,
      results: [],
    };
  }
}

/**
 * Nộp bài chính thức (Submit Code against both sample & hidden test cases)
 */
export async function submitStudentCodeBackend(
  exerciseId: number,
  code: string,
  language: string = 'python'
): Promise<SubmissionRecord> {
  const data = await api.post<BackendSubmissionItem>('/submissions', {
    exercise_id: exerciseId,
    source_code: code,
    language: language,
  });

  return {
    id: data.id,
    exerciseId: data.exercise_id,
    submittedAt: new Date(data.submitted_at).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }),
    status: (data.status === 'passed' ? 'passed' : data.status === 'error' ? 'error' : 'failed'),
    passedTests: data.passed_tests,
    totalTests: data.total_tests,
    executionTimeMs: data.execution_time_ms,
    code: data.source_code || code,
  };
}

/**
 * Lấy lịch sử nộp bài của một bài tập
 */
export async function fetchSubmissionsForExercise(
  exerciseId: number
): Promise<SubmissionRecord[]> {
  try {
    const list = await api.get<BackendSubmissionItem[]>(
      `/submissions/exercise/${exerciseId}`
    );
    return list.map((item) => ({
      id: item.id,
      exerciseId: item.exercise_id,
      submittedAt: new Date(item.submitted_at).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      status: item.status === 'passed' ? 'passed' : item.status === 'error' ? 'error' : 'failed',
      passedTests: item.passed_tests,
      totalTests: item.total_tests,
      executionTimeMs: item.execution_time_ms,
      code: item.source_code || '',
    }));
  } catch {
    return [];
  }
}
