const fs = require('fs');
const { execSync } = require('child_process');

console.log('=== Checking 2151050012 occurrences in src ===');
try {
  const grep215 = execSync('grep -rn "2151050012" src', { encoding: 'utf8' });
  console.log(grep215.trim());
} catch (e) {
  console.log(e.stdout || e.message);
}

console.log('\n=== Checking : any / as any in files touched or created in Round 2 ===');
const touchedFiles = [
  'src/services/mockExercisesData.en.ts',
  'src/services/teacherAnalytics.ts',
  'src/services/userStorage.ts',
  'src/services/mockExerciseService.ts',
  'src/services/mockTeacherData.ts',
  'src/components/teacher/tabs/AnalyticsBreakdown.tsx',
  'src/components/teacher/TeacherDashboard.tsx',
  'src/components/ide/StudentWorkspace.tsx',
  'src/components/ide/ProblemDescription.tsx',
  'src/components/submissions/SubmissionsPage.tsx',
  'src/components/dashboard/LeaderboardModal.tsx',
  'src/components/dashboard/SkillPreparationKits.tsx',
  'src/components/DashboardPreview.tsx',
  'src/App.tsx'
];

touchedFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (line.includes(': any') || line.includes('as any')) {
        console.log(`[ANY FOUND] ${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
console.log('Done checking any.');
