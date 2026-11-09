export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface Exercise {
  id: number;
  subjectId: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  language: 'python' | 'cpp' | 'c' | 'java' | 'sql' | 'bash' | 'javascript';
  timeLimitMs: number;
  memoryLimitMb: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  boilerplateCode: string;
  sampleTestCases: TestCase[];
  hiddenTestCaseCount: number;
  status?: 'solved' | 'in_progress' | 'not_started';
  score?: number;
  trackIds?: string[];
  titleEn?: string;
  categoryEn?: string;
  titleVie?: string;
  categoryVie?: string;
  descriptionEn?: string;
}

export interface TestCaseResult {
  testCaseId: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  errorMessage?: string;
}

export interface ExecutionResult {
  status: 'idle' | 'running' | 'passed' | 'failed' | 'error';
  stdout?: string;
  errorMessage?: string;
  executionTimeMs: number;
  results: TestCaseResult[];
  passedTests: number;
  totalTests: number;
  isOfflineEvaluator?: boolean;
}

export interface SubmissionRecord {
  id: number;
  exerciseId: number;
  submittedAt: string;
  submittedAtISO?: string;
  status: 'passed' | 'failed' | 'error';
  verdict?: 'accepted' | 'wrong_answer' | 'time_limit' | 'compile_error';
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  code: string;
  studentKey?: string;
  studentName?: string;
  studentEmail?: string;
  studentId?: string;
  memoryMb?: number;
}
