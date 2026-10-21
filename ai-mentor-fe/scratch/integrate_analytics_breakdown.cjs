const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import of AnalyticsBreakdown
if (!content.includes('AnalyticsBreakdown')) {
  content = content.replace(
    "import { TeacherAssignmentModal } from './TeacherAssignmentModal';",
    "import { TeacherAssignmentModal } from './TeacherAssignmentModal';\nimport { AnalyticsBreakdown } from './tabs/AnalyticsBreakdown';"
  );
}

// 2. Remove unused translateGradeBracket from import if present
content = content.replace("  translateGradeBracket,\r\n", "");
content = content.replace("  translateGradeBracket,\n", "");

// 3. In {activeTab === 'analytics' && (
// Replace from {/* 1. Grade Distribution Chart Section */} to {/* 2. Live Submissions Real-time Stream Table */}
const oldSectionStart = '{/* 1. Grade Distribution Chart Section */}';
const liveStreamStart = '{/* 2. Live Submissions Real-time Stream Table */}';

const startIndex = content.indexOf(oldSectionStart);
const endIndex = content.indexOf(liveStreamStart);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{/* Mục 5: Khung Phổ điểm & Phân bổ thành tích lớp (có 2 bộ lọc Khóa/Bài) + Khối Thống kê Tiến độ 9 khóa & từng bài */}
            <AnalyticsBreakdown
              selectedClassId={selectedClassId}
              isDark={isDark}
              isVie={isVie}
              storageTick={storageTick}
            />

            `;

  content = content.slice(0, startIndex) + replacement.replace(/\n/g, content.includes('\r\n') ? '\r\n' : '\n') + content.slice(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully integrated AnalyticsBreakdown into TeacherDashboard.tsx');
} else {
  console.error('Could not find boundaries for Grade Distribution section in TeacherDashboard.tsx');
}
