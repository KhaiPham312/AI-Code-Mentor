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
  language: 'python' | 'cpp' | 'java';
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
}

export interface SubmissionRecord {
  id: number;
  exerciseId: number;
  submittedAt: string;
  status: 'passed' | 'failed' | 'error';
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  code: string;
}
