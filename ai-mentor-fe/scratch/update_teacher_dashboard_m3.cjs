const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/Minh/AI-Code-Mentor/ai-mentor-fe/src/components/teacher/TeacherDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add getRealStudentSubmissionsForTeacher to imports
if (!content.includes('getRealStudentSubmissionsForTeacher,')) {
  content = content.replace(
    '  getExerciseLeaderboard,\r\n} from \'../../services/mockTeacherData\';',
    '  getExerciseLeaderboard,\r\n  getRealStudentSubmissionsForTeacher,\r\n} from \'../../services/mockTeacherData\';'
  );
  if (!content.includes('getRealStudentSubmissionsForTeacher,')) {
    content = content.replace(
      '  getExerciseLeaderboard,\n} from \'../../services/mockTeacherData\';',
      '  getExerciseLeaderboard,\n  getRealStudentSubmissionsForTeacher,\n} from \'../../services/mockTeacherData\';'
    );
  }
}

// 2. Add storageTick state and listener right inside TeacherDashboard component
const componentStart = `export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onLogout,
  currentTheme,
  onThemeToggle,
  currentLang,
  onLanguageChange,
  initialTab = 'analytics',
  initialDrilldown = {},
  onDrilldownChange,
}) => {`;

const newStorageHook = `export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onLogout,
  currentTheme,
  onThemeToggle,
  currentLang,
  onLanguageChange,
  initialTab = 'analytics',
  initialDrilldown = {},
  onDrilldownChange,
}) => {
  const [storageTick, setStorageTick] = useState(0);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('ai_mentor_')) {
        setStorageTick((prev) => prev + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);`;

content = content.replace(componentStart.replace(/\r?\n/g, '\r\n'), newStorageHook.replace(/\r?\n/g, '\r\n'));
if (!content.includes('const [storageTick, setStorageTick]')) {
  content = content.replace(componentStart.replace(/\r?\n/g, '\n'), newStorageHook.replace(/\r?\n/g, '\n'));
}

// 3. Update exerciseSubmissions dependency
content = content.replace(
  '  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId]);',
  '  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, storageTick]);'
);

// 4. Update teacherCourseLeaderboard & teacherExerciseLeaderboard
content = content.replace(
  '    return getCourseLeaderboard(drilldown.courseId, selectedCourseExercises.length, user.studentId || user.id);\r\n  }, [drilldown.courseId, selectedCourseExercises.length, user.studentId, user.id]);',
  '    return getCourseLeaderboard(drilldown.courseId, selectedCourseExercises.length);\r\n  }, [drilldown.courseId, selectedCourseExercises.length, storageTick]);'
);
content = content.replace(
  '    return getCourseLeaderboard(drilldown.courseId, selectedCourseExercises.length, user.studentId || user.id);\n  }, [drilldown.courseId, selectedCourseExercises.length, user.studentId, user.id]);',
  '    return getCourseLeaderboard(drilldown.courseId, selectedCourseExercises.length);\n  }, [drilldown.courseId, selectedCourseExercises.length, storageTick]);'
);

content = content.replace(
  '      user.studentId || user.id\r\n    );\r\n  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, user.studentId, user.id]);',
  '      undefined\r\n    );\r\n  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, storageTick]);'
);
content = content.replace(
  '      user.studentId || user.id\n    );\n  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, user.studentId, user.id]);',
  '      undefined\n    );\n  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, storageTick]);'
);

// 5. Update filteredSubmissions to prepend real student submissions
const oldFilteredSubs = `  // Filtered Live Submissions
  const filteredSubmissions = useMemo(() => {
    return MOCK_LIVE_SUBMISSIONS.filter((sub) => {
      const matchClass = sub.classGroup === selectedClassId || selectedClassId === 'ALL';
      const matchStatus =
        liveSubmissionFilter === 'all' || sub.status === liveSubmissionFilter;
      const matchSearch =
        sub.studentName.toLowerCase().includes(liveSubmissionSearch.toLowerCase()) ||
        sub.studentId.includes(liveSubmissionSearch) ||
        sub.exerciseTitle.toLowerCase().includes(liveSubmissionSearch.toLowerCase());
      return matchClass && matchStatus && matchSearch;
    });
  }, [selectedClassId, liveSubmissionFilter, liveSubmissionSearch]);`;

const newFilteredSubs = `  // Filtered Live Submissions (ghép bài nộp thật lên đầu danh sách mock)
  const filteredSubmissions = useMemo(() => {
    const realSubs = getRealStudentSubmissionsForTeacher();
    const realKeys = new Set(realSubs.map((s) => \`\${s.studentId}_\${s.exerciseId}\`));
    const mockList = MOCK_LIVE_SUBMISSIONS.filter(
      (m) => !realKeys.has(\`\${m.studentId}_\${m.exerciseId}\`)
    );
    const combined = [...realSubs, ...mockList];

    return combined.filter((sub) => {
      const matchClass = sub.classGroup === selectedClassId || selectedClassId === 'ALL';
      const matchStatus =
        liveSubmissionFilter === 'all' || sub.status === liveSubmissionFilter;
      const matchSearch =
        sub.studentName.toLowerCase().includes(liveSubmissionSearch.toLowerCase()) ||
        sub.studentId.includes(liveSubmissionSearch) ||
        sub.exerciseTitle.toLowerCase().includes(liveSubmissionSearch.toLowerCase());
      return matchClass && matchStatus && matchSearch;
    });
  }, [selectedClassId, liveSubmissionFilter, liveSubmissionSearch, storageTick]);`;

content = content.replace(oldFilteredSubs.replace(/\r?\n/g, '\r\n'), newFilteredSubs.replace(/\r?\n/g, '\r\n'));
if (!content.includes('const combined = [...realSubs, ...mockList];')) {
  content = content.replace(oldFilteredSubs.replace(/\r?\n/g, '\n'), newFilteredSubs.replace(/\r?\n/g, '\n'));
}

// 6. Update filteredRoster to sync with real submissions
const oldFilteredRoster = `  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return MOCK_STUDENT_ROSTER.filter((st) => {
      const matchClass = st.classGroup === selectedClassId || selectedClassId === 'ALL';
      const matchStatus =
        rosterStatusFilter === 'all' || st.status === rosterStatusFilter;
      const matchSearch =
        st.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        st.studentId.includes(rosterSearch) ||
        st.email.toLowerCase().includes(rosterSearch.toLowerCase());
      return matchClass && matchStatus && matchSearch;
    });
  }, [selectedClassId, rosterStatusFilter, rosterSearch]);`;

const newFilteredRoster = `  // Filtered Roster (đồng bộ với bài nộp thật của sinh viên)
  const filteredRoster = useMemo(() => {
    const realSubs = getRealStudentSubmissionsForTeacher();
    const realByStudent = new Map<string, LiveSubmission[]>();
    for (const sub of realSubs) {
      const list = realByStudent.get(sub.studentId) || [];
      list.push(sub);
      realByStudent.set(sub.studentId, list);
    }

    return MOCK_STUDENT_ROSTER.map((st) => {
      const studentRealSubs = realByStudent.get(st.studentId);
      if (studentRealSubs && studentRealSubs.length > 0) {
        const solved = new Set(
          studentRealSubs.filter((s) => s.status === 'accepted' || s.score >= 8).map((s) => s.exerciseId)
        ).size;
        const latest = studentRealSubs[0];
        return {
          ...st,
          solvedCount: solved,
          recentActivity: isVie
            ? \`Nộp bài: \${latest.exerciseTitle} đạt \${latest.score}/10 (\${latest.timeAgo})\`
            : \`Submitted: \${translateExerciseTitle(latest.exerciseTitle, 'eng')} scored \${latest.score}/10 (\${latest.timeAgo})\`,
        };
      }
      return st;
    }).filter((st) => {
      const matchClass = st.classGroup === selectedClassId || selectedClassId === 'ALL';
      const matchStatus =
        rosterStatusFilter === 'all' || st.status === rosterStatusFilter;
      const matchSearch =
        st.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        st.studentId.includes(rosterSearch) ||
        st.email.toLowerCase().includes(rosterSearch.toLowerCase());
      return matchClass && matchStatus && matchSearch;
    });
  }, [selectedClassId, rosterStatusFilter, rosterSearch, storageTick, isVie]);`;

content = content.replace(oldFilteredRoster.replace(/\r?\n/g, '\r\n'), newFilteredRoster.replace(/\r?\n/g, '\r\n'));
if (!content.includes('realByStudent = new Map<string, LiveSubmission[]>()')) {
  content = content.replace(oldFilteredRoster.replace(/\r?\n/g, '\n'), newFilteredRoster.replace(/\r?\n/g, '\n'));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated TeacherDashboard.tsx');
