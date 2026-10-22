const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/services/userStorage.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newCode = `import type { LiveSubmission } from './mockTeacherData';

export interface StoredUserSubmission {
  id: number;
  exerciseId: number;
  exerciseTitle?: string;
  category?: string;
  submittedAt: string;
  status: 'passed' | 'failed' | 'error';
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  code: string;
  language?: string;
  score?: number;
  studentKey?: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  memoryMb?: number;
}

/**
 * Returns a normalized, sanitized unique storage key for a user (studentId, id, or email)
 * TUYỆT ĐỐI không fallback sang mã cứng nào.
 */
export function getUserStorageKey(user?: { email?: string; id?: string | number; studentId?: string } | null): string {
  if (!user) {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ai_mentor_user') : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        const rawKey = parsed.studentId ?? (parsed.id !== undefined && parsed.id !== null ? String(parsed.id) : null) ?? parsed.email;
        if (rawKey) return encodeURIComponent(String(rawKey).trim().toLowerCase());
      }
    } catch {
      // ignore
    }
    return 'guest';
  }
  const rawKey = user.studentId ?? (user.id !== undefined && user.id !== null ? String(user.id) : null) ?? user.email ?? 'guest';
  return encodeURIComponent(String(rawKey).trim().toLowerCase());
}

/**
 * Alias for studentKey extraction
 */
export function getStudentKey(user?: { email?: string; id?: string | number; studentId?: string } | null): string {
  return getUserStorageKey(user);
}

/**
 * Get solved exercise IDs for a specific user
 */
export function getUserSolvedExerciseIds(userKey: string): number[] {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return [];
  try {
    const raw = localStorage.getItem(\`ai_mentor_solved_exercise_ids_\${userKey}\`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add an exercise to the user's solved list
 */
export function markExerciseAsSolved(userKey: string, exerciseId: number): void {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return;
  try {
    const ids = getUserSolvedExerciseIds(userKey);
    if (!ids.includes(exerciseId)) {
      ids.push(exerciseId);
      localStorage.setItem(\`ai_mentor_solved_exercise_ids_\${userKey}\`, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

/**
 * Retrieve submission history for a specific user
 */
export function getUserSubmissions(userKey: string): StoredUserSubmission[] {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return [];
  try {
    const raw = localStorage.getItem(\`ai_mentor_submissions_\${userKey}\`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new submission record for a user
 */
export function saveUserSubmission(userKey: string, submission: StoredUserSubmission): void {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return;
  try {
    submission.studentKey = userKey;
    const list = getUserSubmissions(userKey);
    list.unshift(submission);
    localStorage.setItem(\`ai_mentor_submissions_\${userKey}\`, JSON.stringify(list.slice(0, 100)));

    // Đồng bộ ngay key latest user submission
    const latestPayload = {
      id: submission.id,
      name: submission.studentName || 'Học viên',
      studentId: submission.studentId || userKey,
      studentEmail: submission.studentEmail,
      studentKey: userKey,
      exerciseId: submission.exerciseId,
      exerciseTitle: submission.exerciseTitle,
      score: submission.score !== undefined ? submission.score : (submission.status === 'passed' ? 10 : Math.round((submission.passedTests / submission.totalTests) * 10)),
      executionTimeMs: submission.executionTimeMs || 28,
      memoryMb: submission.memoryMb || 14.1,
      language: submission.language || 'Python 3',
      timeAgo: submission.submittedAt || 'Vừa xong',
      submittedCode: submission.code,
      status: submission.status,
      passedTests: submission.passedTests,
      totalTests: submission.totalTests,
    };
    localStorage.setItem(
      \`ai_mentor_latest_user_submission_\${userKey}_\${submission.exerciseId}\`,
      JSON.stringify(latestPayload)
    );
  } catch {
    // ignore
  }
}

/**
 * Check if the user has attempted an exercise (has non-accepted submissions)
 */
export function getUserAttemptedExerciseIds(userKey: string): number[] {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return [];
  try {
    const subs = getUserSubmissions(userKey);
    const attempted = new Set<number>();
    for (const sub of subs) {
      attempted.add(sub.exerciseId);
    }
    return Array.from(attempted);
  } catch {
    return [];
  }
}

/**
 * Get draft code for a user on a given exercise
 */
export function getUserDraft(userKey: string, exerciseId: number, langId?: string): string | null {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return null;
  try {
    if (langId) {
      const draft = localStorage.getItem(\`ai_mentor_draft_\${userKey}_\${exerciseId}_\${langId}\`);
      if (draft) return draft;
    }
    return localStorage.getItem(\`ai_mentor_draft_\${userKey}_\${exerciseId}\`);
  } catch {
    return null;
  }
}

/**
 * Save user draft code
 */
export function saveUserDraft(userKey: string, exerciseId: number, code: string, langId?: string): void {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return;
  try {
    if (langId) {
      localStorage.setItem(\`ai_mentor_draft_\${userKey}_\${exerciseId}_\${langId}\`, code);
    }
    localStorage.setItem(\`ai_mentor_draft_\${userKey}_\${exerciseId}\`, code);
  } catch {
    // ignore
  }
}

/**
 * Remove user draft code
 */
export function clearUserDraft(userKey: string, exerciseId: number, langId?: string): void {
  if (typeof window === 'undefined' || !userKey || userKey === 'guest') return;
  try {
    if (langId) {
      localStorage.removeItem(\`ai_mentor_draft_\${userKey}_\${exerciseId}_\${langId}\`);
    }
    localStorage.removeItem(\`ai_mentor_draft_\${userKey}_\${exerciseId}\`);
  } catch {
    // ignore
  }
}

/**
 * Đọc toàn bộ bài nộp thật của các sinh viên đã lưu trong localStorage,
 * chuẩn hóa về đúng cấu trúc LiveSubmission mà TeacherDashboard đang dùng.
 * 
 * Lưu ý: Cơ chế đọc chéo qua localStorage chỉ dành cho chế độ mock/offline.
 * Khi BE trả được danh sách bài nộp của lớp thì Teacher ưu tiên dữ liệu BE.
 */
export function getRealStudentSubmissionsForTeacher(): LiveSubmission[] {
  if (typeof window === 'undefined') return [];
  const results: LiveSubmission[] = [];
  const seenKeys = new Set<string>();

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (key.startsWith('ai_mentor_submissions_')) {
        const studentKey = key.replace('ai_mentor_submissions_', '');
        if (!studentKey || studentKey === 'guest') continue;

        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const items: StoredUserSubmission[] = JSON.parse(raw);
          if (Array.isArray(items)) {
            for (const item of items) {
              const effectiveKey = item.studentKey || item.studentId || item.studentEmail || studentKey;
              if (!effectiveKey || effectiveKey === 'guest') continue;

              const uniqueKey = \`\${effectiveKey}_\${item.exerciseId}_\${item.id}\`;
              if (seenKeys.has(uniqueKey)) continue;
              seenKeys.add(uniqueKey);

              const liveSub: LiveSubmission = {
                id: item.id || Date.now(),
                studentName: item.studentName || 'Sinh viên',
                studentId: item.studentId || item.studentKey || decodeURIComponent(studentKey),
                classGroup: 'K71A-CNTT',
                exerciseId: item.exerciseId,
                exerciseTitle: item.exerciseTitle || \`Bài tập #\${item.exerciseId}\`,
                language: item.language || 'Python 3',
                testCasesPassed: item.passedTests ?? 0,
                totalTestCases: item.totalTests ?? 10,
                score: item.score !== undefined ? item.score : (item.status === 'passed' ? 10 : Math.round(((item.passedTests || 0) / (item.totalTests || 10)) * 10)),
                executionTimeMs: item.executionTimeMs ?? 28,
                memoryMb: item.memoryMb ?? 14.1,
                status: item.status === 'passed' ? 'accepted' : item.status === 'error' ? 'runtime_error' : 'wrong_answer',
                timeAgo: item.submittedAt || 'Vừa xong',
                plagiarismScore: 0,
                submittedCode: item.code || '',
              };
              results.push(liveSub);
            }
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  } catch {
    // ignore
  }

  // Sắp xếp bài mới nhất lên đầu
  results.sort((a, b) => b.id - a.id);
  return results;
}
`;

fs.writeFileSync(filePath, newCode, 'utf8');
console.log('Successfully updated userStorage.ts');
