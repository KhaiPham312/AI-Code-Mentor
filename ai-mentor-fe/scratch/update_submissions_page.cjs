const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/submissions/SubmissionsPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
if (!content.includes('getUserSubmissions')) {
  content = content.replace(
    "import { StatusBadge } from '../common/StatusBadge';",
    `import { StatusBadge } from '../common/StatusBadge';\nimport { getUserSubmissions, getUserStorageKey } from '../../services/userStorage';\nimport { COMPREHENSIVE_EXERCISES } from '../../services/mockExercisesData';`
  );
}

// Replace the mock submission usage in SubmissionsPage component
const oldLogic = `  // Filtered submissions
  const filteredList = useMemo(() => {
    return MOCK_SUBMISSIONS.filter((sub) => {
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchLang = langFilter === 'all' || sub.language.toLowerCase() === langFilter.toLowerCase();
      const matchSearch =
        sub.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchLang && matchSearch;
    });
  }, [statusFilter, langFilter, searchQuery]);

  // Key KPI stats
  const totalSubmissions = MOCK_SUBMISSIONS.length;
  const acceptedCount = MOCK_SUBMISSIONS.filter((s) => s.status === 'accepted').length;
  const accuracyRate = Math.round((acceptedCount / totalSubmissions) * 100);`;

const newLogic = `  const userKey = getUserStorageKey(user);

  // Read real submissions of the current student
  const submissionsList = useMemo(() => {
    const rawSubs = getUserSubmissions(userKey);
    return rawSubs.map((sub): SubmissionItem => {
      const ex = COMPREHENSIVE_EXERCISES.find((e) => e.id === sub.exerciseId);
      const exLang = (sub.language || (ex?.language === 'cpp' ? 'C++' : ex?.language === 'sql' ? 'SQL' : ex?.language === 'java' ? 'Java' : 'Python')) as SubmissionItem['language'];
      const status: SubmissionItem['status'] = sub.status === 'passed' ? 'accepted' : sub.status === 'error' ? 'time_limit' : 'wrong_answer';
      const score = sub.score !== undefined ? sub.score * 10 : (sub.status === 'passed' ? 100 : Math.round((sub.passedTests / Math.max(1, sub.totalTests)) * 100));

      return {
        id: \`sub-real-\${sub.id}\`,
        exerciseId: sub.exerciseId,
        problemTitle: isVie ? (sub.exerciseTitle || ex?.title || \`Bài tập #\${sub.exerciseId}\`) : (ex?.titleEn || sub.exerciseTitle || ex?.title || \`Exercise #\${sub.exerciseId}\`),
        topic: sub.category || ex?.category || (isVie ? 'Luyện tập' : 'Practice'),
        trackId: ex?.trackIds?.[0] || 'algorithms',
        language: exLang,
        status,
        passedTests: sub.passedTests,
        totalTests: sub.totalTests,
        score,
        executionTimeMs: sub.executionTimeMs,
        memoryMb: sub.memoryMb || 14.1,
        submittedAt: sub.submittedAt,
        code: sub.code,
      };
    });
  }, [userKey, isVie]);

  // Filtered submissions
  const filteredList = useMemo(() => {
    return submissionsList.filter((sub) => {
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchLang = langFilter === 'all' || sub.language.toLowerCase() === langFilter.toLowerCase();
      const matchSearch =
        sub.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchLang && matchSearch;
    });
  }, [submissionsList, statusFilter, langFilter, searchQuery]);

  // Key KPI stats - Zero division safe (edge case new user)
  const totalSubmissions = submissionsList.length;
  const acceptedCount = submissionsList.filter((s) => s.status === 'accepted').length;
  const accuracyRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;
  const avgExecutionTime = totalSubmissions > 0
    ? (submissionsList.reduce((acc, s) => acc + s.executionTimeMs, 0) / totalSubmissions).toFixed(1)
    : '0';`;

content = content.replace(oldLogic.replace(/\r?\n/g, '\r\n'), newLogic.replace(/\r?\n/g, '\r\n'));
if (!content.includes('submissionsList = useMemo')) {
  content = content.replace(oldLogic.replace(/\r?\n/g, '\n'), newLogic.replace(/\r?\n/g, '\n'));
}

// Update the KPI cards: runtime and ranking
const oldRuntime = `<div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              18.4 ms
            </div>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 block">
              {isVie ? 'Rất nhanh và tối ưu' : 'Highly optimized'}
            </span>`;

const newRuntime = `<div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {avgExecutionTime} ms
            </div>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1 block">
              {totalSubmissions > 0 ? (isVie ? 'Rất nhanh và tối ưu' : 'Highly optimized') : (isVie ? 'Chưa có dữ liệu' : 'No runtime data')}
            </span>`;

content = content.replace(oldRuntime.replace(/\r?\n/g, '\r\n'), newRuntime.replace(/\r?\n/g, '\r\n'));
if (!content.includes('{avgExecutionTime} ms')) {
  content = content.replace(oldRuntime.replace(/\r?\n/g, '\n'), newRuntime.replace(/\r?\n/g, '\n'));
}

const oldRanking = `<div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Top 5%
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
              {isVie ? 'Thứ 3 / 68 sinh viên' : 'Rank 3 / 68 students'}
            </span>`;

const newRanking = `<div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {totalSubmissions > 0 ? \`Top \${Math.max(5, 100 - accuracyRate)}%\` : '-'}
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
              {totalSubmissions > 0
                ? (isVie ? \`Đã đạt \${acceptedCount}/\${totalSubmissions} bài\` : \`Passed \${acceptedCount}/\${totalSubmissions} submissions\`)
                : (isVie ? 'Chưa xếp hạng' : 'Unranked')}
            </span>`;

content = content.replace(oldRanking.replace(/\r?\n/g, '\r\n'), newRanking.replace(/\r?\n/g, '\r\n'));
if (!content.includes('Math.max(5, 100 - accuracyRate)')) {
  content = content.replace(oldRanking.replace(/\r?\n/g, '\n'), newRanking.replace(/\r?\n/g, '\n'));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SubmissionsPage.tsx');
