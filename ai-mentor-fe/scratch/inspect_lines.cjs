const fs = require('fs');
const content = fs.readFileSync('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx', 'utf8');
const lines = content.split(/\r?\n/);
for (let i = 930; i < 970; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
