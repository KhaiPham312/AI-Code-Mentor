const fs = require('fs');
const content = fs.readFileSync('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/ide/StudentWorkspace.tsx', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('getSubmissionsForExercise')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
