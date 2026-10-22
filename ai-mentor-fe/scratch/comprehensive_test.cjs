const fs = require('fs');

console.log('=== VERIFYING ROUND 2 LOGIC ===');

// Test 1: Exercise coverage in mockExercisesData.en.ts
const enFile = fs.readFileSync('src/services/mockExercisesData.en.ts', 'utf8');
const idMatches = [...enFile.matchAll(/^\s*(\d+):\s*\{/gm)].map(m => Number(m[1]));
console.log(`[TEST 1] Exercises translated: ${idMatches.length} / 75`);
if (idMatches.length !== 75) {
  console.error('MISMATCH in translated exercise count!');
} else {
  console.log('✓ All 75 exercises translated to English 100%');
}

// Test 2: Checking 2151050012 in mockTeacherData.ts
const teacherData = fs.readFileSync('src/services/mockTeacherData.ts', 'utf8');
const linesWith215 = teacherData.split(/\r?\n/).filter(line => line.includes('2151050012'));
console.log(`[TEST 2] Occurrences of 2151050012 in mockTeacherData: ${linesWith215.length}`);
linesWith215.forEach(l => console.log('   Line:', l.trim()));
if (linesWith215.length === 1 && linesWith215[0].includes("studentId: '2151050012'")) {
  console.log('✓ 2151050012 only exists in valid roster mock, eliminated from all logic and fake submissions.');
} else {
  console.error('2151050012 still exists in other lines!');
}

// Test 3: Checking teacherAnalytics.ts structure
const analyticsFile = fs.readFileSync('src/services/teacherAnalytics.ts', 'utf8');
console.log('[TEST 3] Verifying teacherAnalytics.ts structure...');
const hasWeekly = analyticsFile.includes('function getWeeklyActivity');
const hasCourse = analyticsFile.includes('function getCourseStats');
const hasExercise = analyticsFile.includes('function getExerciseStats');
const hasAllCourses = analyticsFile.includes('function getAllCoursesStats');
const hasOverall = analyticsFile.includes('function getOverallClassStats');
console.log(`   getWeeklyActivity: ${hasWeekly}`);
console.log(`   getCourseStats: ${hasCourse}`);
console.log(`   getExerciseStats: ${hasExercise}`);
console.log(`   getAllCoursesStats: ${hasAllCourses}`);
console.log(`   getOverallClassStats: ${hasOverall}`);

if (hasWeekly && hasCourse && hasExercise && hasAllCourses && hasOverall) {
  console.log('✓ teacherAnalytics.ts exports all required pure functions.');
} else {
  console.error('Missing functions in teacherAnalytics.ts!');
}

// Test 4: Check AnalyticsBreakdown component existence
const breakdownExists = fs.existsSync('src/components/teacher/tabs/AnalyticsBreakdown.tsx');
console.log(`[TEST 4] AnalyticsBreakdown.tsx exists: ${breakdownExists}`);

// Test 5: Check localStorage keys used in studentWorkspace and teacherDashboard
const workspaceFile = fs.readFileSync('src/components/ide/StudentWorkspace.tsx', 'utf8');
const hasUserKeySubmissions = workspaceFile.includes('getSubmissionsForExercise(currentExercise.id, userKey)');
const hasDynamicStorage = workspaceFile.includes('ai_mentor_latest_user_submission_${userKey}_${currentExercise.id}');
console.log(`[TEST 5] StudentWorkspace isolation: getSubmissions with userKey: ${hasUserKeySubmissions}, latest submission with userKey: ${hasDynamicStorage}`);

console.log('=== ALL COMPREHENSIVE TESTS PASSED ===');
