const fs = require('fs');
const filePath = 'c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove translateDayOfWeek from import
content = content.replace("  translateDayOfWeek,\r\n", "");
content = content.replace("  translateDayOfWeek,\n", "");

// 2. Move weeklyActivity block after selectedClassId & activeClass
const block = `  const [isCourseProgressExpanded, setIsCourseProgressExpanded] = useState(false);

  const weeklyActivity = useMemo(() => {
    return getWeeklyActivity(selectedClassId);
  }, [selectedClassId, storageTick]);

  const allCoursesProgress = useMemo(() => {
    return getAllCoursesStats(selectedClassId);
  }, [selectedClassId, storageTick]);

  const classTotalStudents = useMemo(() => {
    return getClassTotalStudents(selectedClassId);
  }, [selectedClassId]);

  const peakWeekly = useMemo(() => {
    if (weeklyActivity.length === 0) return { studentCount: 0, day: 'T6' };
    return weeklyActivity.reduce((max, cur) => cur.studentCount > max.studentCount ? cur : max, weeklyActivity[0]);
  }, [weeklyActivity]);
`;

content = content.replace(block.replace(/\n/g, '\r\n'), '');
content = content.replace(block, '');

// Place after activeClass memo
const afterActiveClass = `  const activeClass = useMemo(() => {
    return (
      MOCK_CLASS_GROUPS.find((c) => c.id === selectedClassId) ||
      MOCK_CLASS_GROUPS[0]
    );
  }, [selectedClassId]);`;

content = content.replace(
  afterActiveClass.replace(/\n/g, '\r\n'),
  afterActiveClass.replace(/\n/g, '\r\n') + '\r\n\r\n' + block.replace(/\n/g, '\r\n')
);
if (!content.includes('const allCoursesProgress = useMemo')) {
  content = content.replace(
    afterActiveClass,
    afterActiveClass + '\n\n' + block
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully reordered hooks in TeacherDashboard.tsx');
