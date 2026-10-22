const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/services/mockTeacherData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import of getRealStudentSubmissionsForTeacher from userStorage
if (!content.includes('getRealStudentSubmissionsForTeacher')) {
  content = content.replace(
    "import { EXERCISE_TITLE_TRANSLATIONS } from './mockExercisesData';",
    `import { EXERCISE_TITLE_TRANSLATIONS } from './mockExercisesData';\nimport { getRealStudentSubmissionsForTeacher } from './userStorage';\nexport { getRealStudentSubmissionsForTeacher } from './userStorage';`
  );
}

// 2. MOCK_LIVE_SUBMISSIONS: replace Nguyễn Văn Minh / 2151050012 with Bùi Tuấn Kiệt / 2151050028
content = content.replace(
  "    studentName: 'Nguyễn Văn Minh',\r\n    studentId: '2151050012',",
  "    studentName: 'Bùi Tuấn Kiệt',\r\n    studentId: '2151050028',"
);
content = content.replace(
  "    studentName: 'Nguyễn Văn Minh',\n    studentId: '2151050012',",
  "    studentName: 'Bùi Tuấn Kiệt',\n    studentId: '2151050028',"
);

// 3. MOCK_AI_AUDIT_LOGS: replace Nguyễn Văn Minh / 2151050012 with Bùi Tuấn Kiệt / 2151050028
content = content.replace(
  "    id: 1,\r\n    studentName: 'Nguyễn Văn Minh',\r\n    studentId: '2151050012',",
  "    id: 1,\r\n    studentName: 'Bùi Tuấn Kiệt',\r\n    studentId: '2151050028',"
);
content = content.replace(
  "    id: 1,\n    studentName: 'Nguyễn Văn Minh',\n    studentId: '2151050012',",
  "    id: 1,\n    studentName: 'Bùi Tuấn Kiệt',\n    studentId: '2151050028',"
);

// 4. MOCK_STUDENT_ROSTER: keep studentId '2151050012' in roster, but reset solvedCount to 0 and recentActivity to 'Chưa có hoạt động nộp bài'
const oldRosterItem = `  {
    studentId: '2151050012',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nv21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 4,
    totalAssignments: 4,
    gpa: 9.6,
    attendanceRate: 98,
    aiQueriesCount: 6,
    status: 'excellent',
    recentActivity: 'Nộp bài: Tìm số nguyên tố trong mảng đạt 10/10 (12 phút trước)',
  },`;

const newRosterItem = `  {
    studentId: '2151050012',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nv21@hnue.edu.vn',
    classGroup: 'K71A-CNTT',
    solvedCount: 0,
    totalAssignments: 4,
    gpa: 8.5,
    attendanceRate: 98,
    aiQueriesCount: 0,
    status: 'progressing',
    recentActivity: 'Chưa có hoạt động nộp bài',
  },`;

content = content.replace(oldRosterItem.replace(/\r?\n/g, '\r\n'), newRosterItem.replace(/\r?\n/g, '\r\n'));
if (!content.includes('Chưa có hoạt động nộp bài')) {
  content = content.replace(oldRosterItem.replace(/\r?\n/g, '\n'), newRosterItem.replace(/\r?\n/g, '\n'));
}

// 5. getTeacherSubmissionsForExercise: replace Nguyễn Văn Minh / 2151050012 in rosterStudents with Hoàng Bảo Ngọc / 2151050115
content = content.replace(
  "{ name: 'Nguyễn Văn Minh', id: '2151050012', status: 'accepted', score: 10, passed: 10, ms: 38, plag: 2, time: '3 phút trước' },",
  "{ name: 'Hoàng Bảo Ngọc', id: '2151050115', status: 'accepted', score: 10, passed: 10, ms: 38, plag: 2, time: '3 phút trước' },"
);

// 6. getTeacherSubmissionsForExercise: prepend real submissions
const oldGetTeacherSub = `  const existing = MOCK_LIVE_SUBMISSIONS.filter((s) => s.exerciseId === exerciseId);
  if (existing.length >= 6) {
    return existing.map(sub => ({
      ...sub,
      exerciseTitle: cleanTitle
    }));
  }`;

const newGetTeacherSub = `  // 1. Lấy bài nộp thật từ người dùng đã giải bài tập này
  const realSubs = getRealStudentSubmissionsForTeacher().filter(
    (s) => s.exerciseId === exerciseId
  ).map((s) => ({
    ...s,
    exerciseTitle: cleanTitle,
  }));
  const realStudentIds = new Set(realSubs.map((s) => s.studentId));

  const existing = MOCK_LIVE_SUBMISSIONS.filter((s) => s.exerciseId === exerciseId && !realStudentIds.has(s.studentId));
  if (existing.length >= 6) {
    return [
      ...realSubs,
      ...existing.map(sub => ({
        ...sub,
        exerciseTitle: cleanTitle
      }))
    ];
  }`;

content = content.replace(oldGetTeacherSub.replace(/\r?\n/g, '\r\n'), newGetTeacherSub.replace(/\r?\n/g, '\r\n'));
if (!content.includes('const realSubs = getRealStudentSubmissionsForTeacher()')) {
  content = content.replace(oldGetTeacherSub.replace(/\r?\n/g, '\n'), newGetTeacherSub.replace(/\r?\n/g, '\n'));
}

// And also prepend realSubs when returning generated
const oldReturnGen = `  return generated;`;
const newReturnGen = `  return [...realSubs, ...generated.filter(g => !realStudentIds.has(g.studentId))];`;
content = content.replace(oldReturnGen, newReturnGen);

// 7. getCourseLeaderboard: replace Nguyễn Văn Minh / 2151050012 in baseStudents with Hoàng Bảo Ngọc / 2151050115
content = content.replace(
  "{ name: 'Nguyễn Văn Minh', id: '2151050012', classGroup: 'K71A-CNTT', color: 'bg-emerald-600', solvedOffset: -1, ms: 28, lang: primaryLang },",
  "{ name: 'Hoàng Bảo Ngọc', id: '2151050115', classGroup: 'K71A-CNTT', color: 'bg-emerald-600', solvedOffset: -1, ms: 28, lang: primaryLang },"
);

// 8. In getCourseLeaderboard, update the real student resolution:
const oldCourseCurrentUserCheck = `    if (currentUserStudentId && st.id === currentUserStudentId) {
      try {
        const solvedIds = JSON.parse(localStorage.getItem('ai_mentor_solved_exercise_ids') || '[]');
        if (Array.isArray(solvedIds) && solvedIds.length > 0) {
          solved = Math.min(totalExercises, solved + Math.min(solvedIds.length, 2));
          ms = Math.max(18, ms - 6);
        }
      } catch {
        // ignore
      }
    }`;

const newCourseCurrentUserCheck = `    if (currentUserStudentId && st.id === currentUserStudentId) {
      try {
        const raw = localStorage.getItem(\`ai_mentor_solved_exercise_ids_\${currentUserStudentId}\`);
        const solvedIds = raw ? JSON.parse(raw) : [];
        if (Array.isArray(solvedIds) && solvedIds.length > 0) {
          solved = Math.min(totalExercises, solvedIds.length);
          ms = Math.max(18, ms - 6);
        } else {
          solved = 0;
        }
      } catch {
        // ignore
      }
    }`;

content = content.replace(oldCourseCurrentUserCheck.replace(/\r?\n/g, '\r\n'), newCourseCurrentUserCheck.replace(/\r?\n/g, '\r\n'));
if (!content.includes('ai_mentor_solved_exercise_ids_${currentUserStudentId}')) {
  content = content.replace(oldCourseCurrentUserCheck.replace(/\r?\n/g, '\n'), newCourseCurrentUserCheck.replace(/\r?\n/g, '\n'));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated mockTeacherData.ts');
