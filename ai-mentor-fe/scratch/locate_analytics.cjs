const fs = require('fs');
const content = fs.readFileSync('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes("activeTab === 'analytics'") || line.includes("activeTab === 'assignments'") || line.includes("gradeDistribution") || line.includes("weeklyLogins")) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
