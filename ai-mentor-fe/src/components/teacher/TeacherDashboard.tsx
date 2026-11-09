import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../../types/auth';
import {
  MOCK_CLASS_GROUPS,
  MOCK_LIVE_SUBMISSIONS,
  MOCK_AI_AUDIT_LOGS,
  MOCK_ASSIGNMENTS,
  MOCK_STUDENT_ROSTER,
  LiveSubmission,
  StudentAIAuditLog,
  TeacherAssignment,
  translateExerciseTitle,
  translateTimeAgo,
  translateRecentActivity,
  translateLogSummary,
  getTeacherSubmissionsForExercise,
  getCourseLeaderboard,
  getExerciseLeaderboard,
  getRealStudentSubmissionsForTeacher,
} from '../../services/mockTeacherData';
import { SKILL_TRACKS, SkillIconType } from '../../types/skills';
import { COMPREHENSIVE_EXERCISES } from '../../services/mockExercisesData';
import { TeacherAITranscriptDrawer } from './TeacherAITranscriptDrawer';
import { TeacherCodeReviewModal } from './TeacherCodeReviewModal';
import { TeacherAssignmentModal } from './TeacherAssignmentModal';
import { ScoreDistributionCard } from './tabs/ScoreDistributionCard';
import { AppSidebar } from '../common/AppSidebar';
import { BackToTopButton } from '../common/BackToTopButton';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import { StatusBadge } from '../common/StatusBadge';
import { isTeacherTab, TeacherTab } from '../../services/navigation';
import { getClassTotalStudents } from '../../services/teacherAnalytics';
import {
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Search,
  Eye,
  Bot,
  Users,
  AlertTriangle,
  ChevronDown,
  Code,
  ArrowLeft,
  ArrowRight,
  Layers,
  GitBranch,
  Calculator,
  Brain,
  Coffee,
  Database,
  ChevronRight,
  Trophy,
  Sun,
  Moon,
} from 'lucide-react';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  onOpenSettings?: (tab?: 'profile' | 'password') => void;
  onPreviewStudentIDE?: (exerciseId: number) => void;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onLogout,
  onOpenSettings,
  onPreviewStudentIDE,
  currentTheme = 'dark',
  onThemeToggle,
  currentLang = 'vie',
  onLanguageChange,
}) => {
  const isDark = currentTheme === 'dark';
  const isVie = currentLang === 'vie';


  const [storageTick, setStorageTick] = useState(0);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('ai_mentor_')) {
        setStorageTick((prev) => prev + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 1. Global Class Selector (with localStorage persistence)
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ai_mentor_teacher_class_id');
      if (saved && MOCK_CLASS_GROUPS.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'K71A-CNTT';
  });

  const activeClass = useMemo(() => {
    return (
      MOCK_CLASS_GROUPS.find((c) => c.id === selectedClassId) ||
      MOCK_CLASS_GROUPS[0]
    );
  }, [selectedClassId]);

  const classTotalStudents = useMemo(() => {
    return getClassTotalStudents(selectedClassId);
  }, [selectedClassId]);


  // Sync selectedClassId to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_mentor_teacher_class_id', selectedClassId);
    } catch {
      // Ignore
    }
  }, [selectedClassId]);

  // 2. Tab Navigation: 'analytics' | 'assignments' | 'logs' | 'roster' (with URL query & localStorage persistence)
  const [activeTab, setActiveTab] = useState<TeacherTab>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (isTeacherTab(tabParam)) {
        return tabParam;
      }
      const saved = localStorage.getItem('ai_mentor_teacher_tab');
      if (isTeacherTab(saved)) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'analytics';
  });

  // 3. Modals & Drawers state
  const [selectedLogForTranscript, setSelectedLogForTranscript] = useState<StudentAIAuditLog | null>(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const [selectedSubmissionForCode, setSelectedSubmissionForCode] = useState<LiveSubmission | null>(null);
  const [isCodeReviewOpen, setIsCodeReviewOpen] = useState(false);

  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);

  // 4. Assignments state
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(MOCK_ASSIGNMENTS);

  // 5. Search & Filters state
  const [liveSubmissionFilter, setLiveSubmissionFilter] = useState<string>('all');
  const [liveSubmissionSearch, setLiveSubmissionSearch] = useState<string>('');

  const [logErrorFilter, setLogErrorFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState<string>('');
  const [onlyStuckLogs, setOnlyStuckLogs] = useState<boolean>(false);

  const [rosterSearch, setRosterSearch] = useState<string>('');
  const [rosterStatusFilter, setRosterStatusFilter] = useState<string>('all');

  // Drill-down states for Course & Exercise Management
  const [drilldown, setDrilldown] = useState<{
    level: 'courses' | 'exercises' | 'submissions';
    courseId: string | null;
    exerciseId: number | null;
  }>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const course = searchParams.get('course');
      const exParam = searchParams.get('exercise');
      const exId = exParam && !isNaN(Number(exParam)) ? Number(exParam) : null;
      if (course && exId) {
        return { level: 'submissions', courseId: course, exerciseId: exId };
      }
      if (course) {
        return { level: 'exercises', courseId: course, exerciseId: null };
      }
      const saved = localStorage.getItem('ai_mentor_teacher_drilldown');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          (parsed.level === 'courses' || parsed.level === 'exercises' || parsed.level === 'submissions')
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return { level: 'courses', courseId: null, exerciseId: null };
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_mentor_teacher_drilldown', JSON.stringify(drilldown));
    } catch {
      // ignore
    }
  }, [drilldown]);

  // Selected course details
  const selectedCourse = useMemo(() => {
    if (!drilldown.courseId) return null;
    return SKILL_TRACKS.find((tr) => tr.id === drilldown.courseId) || SKILL_TRACKS[0];
  }, [drilldown.courseId]);

  // Selected course exercises (>= 10 exercises)
  const selectedCourseExercises = useMemo(() => {
    if (!drilldown.courseId) return [];
    return COMPREHENSIVE_EXERCISES.filter(
      (ex) => ex.trackIds && ex.trackIds.includes(drilldown.courseId!)
    );
  }, [drilldown.courseId]);

  // Selected exercise details
  const selectedExercise = useMemo(() => {
    if (!drilldown.exerciseId) return null;
    return COMPREHENSIVE_EXERCISES.find((ex) => ex.id === drilldown.exerciseId) || null;
  }, [drilldown.exerciseId]);

  // Exercise student submissions
  const exerciseSubmissions = useMemo(() => {
    if (!drilldown.exerciseId || !selectedExercise) return [];
    return getTeacherSubmissionsForExercise(
      selectedExercise.id,
      drilldown.courseId || 'algorithms',
      selectedExercise.title,
      selectedExercise.boilerplateCode,
      selectedExercise.language
    );
  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, storageTick]);

  // Search & Filter for Exercises in Course (Level 2)
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseDiffFilter, setExerciseDiffFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredCourseExercises = useMemo(() => {
    return selectedCourseExercises.filter((ex) => {
      const q = exerciseSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        ex.title.toLowerCase().includes(q) ||
        (ex.titleEn && ex.titleEn.toLowerCase().includes(q)) ||
        ex.category.toLowerCase().includes(q) ||
        (ex.categoryEn && ex.categoryEn.toLowerCase().includes(q));
      const matchDiff =
        exerciseDiffFilter === 'all' || ex.difficulty === exerciseDiffFilter;
      return matchSearch && matchDiff;
    });
  }, [selectedCourseExercises, exerciseSearch, exerciseDiffFilter]);

  // Search & Filter for Submissions in Exercise (Level 3)
  const [subSearch, setSubSearch] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState<string>('all');

  const filteredExerciseSubmissions = useMemo(() => {
    return exerciseSubmissions.filter((sub) => {
      const q = subSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        sub.studentName.toLowerCase().includes(q) ||
        sub.studentId.toLowerCase().includes(q);
      const matchStatus =
        subStatusFilter === 'all' || sub.status === subStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [exerciseSubmissions, subSearch, subStatusFilter]);

  // Level 2 tab: 'exercises' | 'leaderboard'
  const [teacherCourseTab, setTeacherCourseTab] = useState<'exercises' | 'leaderboard'>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');
      if (view === 'leaderboard') return 'leaderboard';
      const saved = localStorage.getItem('ai_mentor_teacher_course_tab');
      if (saved === 'exercises' || saved === 'leaderboard') return saved;
    } catch {
      // ignore
    }
    return 'exercises';
  });

  // Level 3 tab: 'submissions' | 'leaderboard'
  const [teacherExerciseTab, setTeacherExerciseTab] = useState<'submissions' | 'leaderboard'>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');
      if (view === 'leaderboard') return 'leaderboard';
      const saved = localStorage.getItem('ai_mentor_teacher_exercise_tab');
      if (saved === 'submissions' || saved === 'leaderboard') return saved;
    } catch {
      // ignore
    }
    return 'submissions';
  });

  const buildTeacherUrl = (
    tab: TeacherTab,
    level: 'courses' | 'exercises' | 'submissions',
    courseId: string | null,
    exerciseId: number | null,
    cTab: 'exercises' | 'leaderboard',
    exTab: 'submissions' | 'leaderboard'
  ) => {
    const params = new URLSearchParams();
    if (tab !== 'analytics') {
      params.set('tab', tab);
    }
    if (tab === 'analytics' || tab === 'assignments') {
      if (level === 'exercises' && courseId) {
        params.set('course', courseId);
        if (cTab === 'leaderboard') {
          params.set('view', 'leaderboard');
        }
      } else if (level === 'submissions' && courseId && exerciseId) {
        params.set('course', courseId);
        params.set('exercise', String(exerciseId));
        if (exTab === 'leaderboard') {
          params.set('view', 'leaderboard');
        }
      }
    }
    const q = params.toString();
    return q ? `/teacher?${q}` : '/teacher';
  };

  const handleSelectTab = (tab: TeacherTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('ai_mentor_teacher_tab', tab);
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(tab, drilldown.level, drilldown.courseId, drilldown.exerciseId, teacherCourseTab, teacherExerciseTab);
    window.history.replaceState(null, '', url);
  };

  const handleDrilldownToCourse = (courseId: string) => {
    setTeacherCourseTab('exercises');
    const newDrilldown = { level: 'exercises' as const, courseId, exerciseId: null };
    setDrilldown(newDrilldown);
    try {
      localStorage.setItem('ai_mentor_teacher_drilldown', JSON.stringify(newDrilldown));
      localStorage.setItem('ai_mentor_teacher_course_tab', 'exercises');
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(activeTab, 'exercises', courseId, null, 'exercises', teacherExerciseTab);
    window.history.pushState(null, '', url);
  };

  const handleDrilldownToExercise = (exerciseId: number) => {
    setTeacherExerciseTab('submissions');
    const courseId = selectedCourse?.id || drilldown.courseId || 'algorithms';
    const newDrilldown = { level: 'submissions' as const, courseId, exerciseId };
    setDrilldown(newDrilldown);
    try {
      localStorage.setItem('ai_mentor_teacher_drilldown', JSON.stringify(newDrilldown));
      localStorage.setItem('ai_mentor_teacher_exercise_tab', 'submissions');
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(activeTab, 'submissions', courseId, exerciseId, teacherCourseTab, 'submissions');
    window.history.pushState(null, '', url);
  };

  const handleBackToExercises = () => {
    const courseId = selectedCourse?.id || drilldown.courseId || 'algorithms';
    const newDrilldown = { level: 'exercises' as const, courseId, exerciseId: null };
    setDrilldown(newDrilldown);
    try {
      localStorage.setItem('ai_mentor_teacher_drilldown', JSON.stringify(newDrilldown));
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(activeTab, 'exercises', courseId, null, teacherCourseTab, teacherExerciseTab);
    window.history.pushState(null, '', url);
  };

  const handleBackToCourses = () => {
    const newDrilldown = { level: 'courses' as const, courseId: null, exerciseId: null };
    setDrilldown(newDrilldown);
    try {
      localStorage.setItem('ai_mentor_teacher_drilldown', JSON.stringify(newDrilldown));
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(activeTab, 'courses', null, null, teacherCourseTab, teacherExerciseTab);
    window.history.pushState(null, '', url);
  };

  const handleSelectCourseTab = (cTab: 'exercises' | 'leaderboard') => {
    setTeacherCourseTab(cTab);
    try {
      localStorage.setItem('ai_mentor_teacher_course_tab', cTab);
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(activeTab, 'exercises', drilldown.courseId, null, cTab, teacherExerciseTab);
    window.history.replaceState(null, '', url);
  };

  const handleSelectExerciseTab = (exTab: 'submissions' | 'leaderboard') => {
    setTeacherExerciseTab(exTab);
    try {
      localStorage.setItem('ai_mentor_teacher_exercise_tab', exTab);
    } catch {
      // ignore
    }
    const url = buildTeacherUrl(activeTab, 'submissions', drilldown.courseId, drilldown.exerciseId, teacherCourseTab, exTab);
    window.history.replaceState(null, '', url);
  };

  // Sync state on PopState (browser Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (isTeacherTab(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab('analytics');
      }

      const course = searchParams.get('course');
      const exParam = searchParams.get('exercise');
      const exId = exParam && !isNaN(Number(exParam)) ? Number(exParam) : null;
      const view = searchParams.get('view');

      if (course && exId) {
        setDrilldown({ level: 'submissions', courseId: course, exerciseId: exId });
        setTeacherExerciseTab(view === 'leaderboard' ? 'leaderboard' : 'submissions');
      } else if (course) {
        setDrilldown({ level: 'exercises', courseId: course, exerciseId: null });
        setTeacherCourseTab(view === 'leaderboard' ? 'leaderboard' : 'exercises');
      } else {
        setDrilldown({ level: 'courses', courseId: null, exerciseId: null });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial URL on mount if on /teacher
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/teacher') {
      const currentUrl = window.location.pathname + window.location.search;
      const targetUrl = buildTeacherUrl(activeTab, drilldown.level, drilldown.courseId, drilldown.exerciseId, teacherCourseTab, teacherExerciseTab);
      if (currentUrl !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
      }
    }
  }, []);

  // Course leaderboard for Level 2
  const teacherCourseLeaderboard = useMemo(() => {
    if (!drilldown.courseId) return [];
    return getCourseLeaderboard(drilldown.courseId, selectedCourseExercises.length);
  }, [drilldown.courseId, selectedCourseExercises.length, storageTick]);

  // Exercise leaderboard for Level 3
  const teacherExerciseLeaderboard = useMemo(() => {
    if (!drilldown.exerciseId || !selectedExercise) return [];
    return getExerciseLeaderboard(
      selectedExercise.id,
      drilldown.courseId || 'algorithms',
      selectedExercise.title,
      selectedExercise.boilerplateCode,
      selectedExercise.language,
      undefined,
      undefined
    );
  }, [drilldown.exerciseId, selectedExercise, drilldown.courseId, storageTick]);

  const renderCourseTrackIcon = (iconType: SkillIconType, color: string) => {
    switch (iconType) {
      case 'algorithms':
        return <GitBranch className="w-6 h-6" style={{ color }} />;
      case 'data-structures':
        return <Layers className="w-6 h-6" style={{ color }} />;
      case 'mathematics':
        return <Calculator className="w-6 h-6" style={{ color }} />;
      case 'ai':
        return <Brain className="w-6 h-6" style={{ color }} />;
      case 'c':
        return <span className="font-mono font-bold text-base tracking-tight text-blue-500">C</span>;
      case 'cpp':
        return <span className="font-mono font-bold text-sm tracking-tight text-blue-600">C++</span>;
      case 'java':
        return <Coffee className="w-6 h-6" style={{ color }} />;
      case 'python':
        return <span className="font-mono font-extrabold text-sm tracking-tight text-amber-500">Py</span>;
      case 'sql':
        return <Database className="w-6 h-6" style={{ color }} />;
      default:
        return <BookOpen className="w-6 h-6" style={{ color }} />;
    }
  };

  // Filtered Live Submissions (ghép bài nộp thật lên đầu danh sách mock)
  const filteredSubmissions = useMemo(() => {
    const realSubs = getRealStudentSubmissionsForTeacher();
    const realKeys = new Set(realSubs.map((s) => `${s.studentId}_${s.exerciseId}`));
    const mockList = MOCK_LIVE_SUBMISSIONS.filter(
      (m) => !realKeys.has(`${m.studentId}_${m.exerciseId}`)
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
  }, [selectedClassId, liveSubmissionFilter, liveSubmissionSearch, storageTick]);

  // Filtered AI Audit Logs
  const filteredLogs = useMemo(() => {
    return MOCK_AI_AUDIT_LOGS.filter((log) => {
      const matchClass = log.classGroup === selectedClassId || selectedClassId === 'ALL';
      const matchError =
        logErrorFilter === 'all' || log.errorType === logErrorFilter;
      const matchStuck = !onlyStuckLogs || log.needsTeacherHelp;
      const matchSearch =
        log.studentName.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.studentId.includes(logSearch) ||
        log.errorDetails.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.exerciseTitle.toLowerCase().includes(logSearch.toLowerCase());
      return matchClass && matchError && matchStuck && matchSearch;
    });
  }, [selectedClassId, logErrorFilter, onlyStuckLogs, logSearch]);

  // Filtered Roster (đồng bộ với bài nộp thật của sinh viên)
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
            ? `Nộp bài: ${latest.exerciseTitle} đạt ${latest.score}/10 (${latest.timeAgo})`
            : `Submitted: ${translateExerciseTitle(latest.exerciseTitle, isVie)} scored ${latest.score}/10 (${latest.timeAgo})`,
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
  }, [selectedClassId, rosterStatusFilter, rosterSearch, storageTick, isVie]);

  // Handle adding new assignment
  const handleSaveNewAssignment = (newAss: Partial<TeacherAssignment>) => {
    const created: TeacherAssignment = {
      id: assignments.length + 1,
      title: newAss.title || 'Bài tập mới',
      category: newAss.category || 'Algorithms',
      difficulty: newAss.difficulty || 'medium',
      language: 'Python 3',
      classGroup: newAss.classGroup || selectedClassId,
      deadline: newAss.deadline || '23:59 • 30/10/2026',
      deadlineDate: newAss.deadlineDate || new Date().toISOString(),
      submittedCount: 0,
      totalStudents: activeClass.totalStudents,
      passRate: 0,
      aiSocraticEnabled: newAss.aiSocraticEnabled ?? true,
      antiPlagiarismEnabled: newAss.antiPlagiarismEnabled ?? true,
      status: 'active',
      testCasesCount: newAss.testCasesCount || 10,
      description: newAss.description || '',
    };
    setAssignments([created, ...assignments]);
    setActiveTab('assignments');
  };

  const openTranscriptDrawer = (log: StudentAIAuditLog) => {
    setSelectedLogForTranscript(log);
    setIsTranscriptOpen(true);
  };

  const openCodeReviewModal = (submission: LiveSubmission) => {
    setSelectedSubmissionForCode(submission);
    setIsCodeReviewOpen(true);
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-row transition-colors duration-150 antialiased ${
        isDark
          ? 'bg-[#0b1322] text-slate-100'
          : 'bg-[#f8fafc] text-neutral-900'
      }`}
    >
      <AppSidebar
        role="teacher"
        activeTab={activeTab === 'assignments' ? 'courses' : activeTab === 'logs' ? 'ai-monitor' : activeTab}
        onTabChange={(tabId) => {
          if (tabId === 'courses') {
            handleSelectTab('assignments');
            handleBackToCourses();
          } else if (tabId === 'ai-monitor') {
            handleSelectTab('logs');
          } else if (tabId === 'roster') {
            handleSelectTab('roster');
          } else {
            handleSelectTab('analytics');
          }
        }}
        user={user}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        onOpenSettings={(tab) => onOpenSettings?.(tab as 'profile' | 'password')}
        onNewAssignment={() => setIsCreateAssignmentOpen(true)}
        aiLogBadgeCount={activeClass.stuckStudentsCount}
      />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* ================= 1. MINIMAL TEACHER TOPBAR ================= */}
        <header
          className={`h-14 px-4 sm:px-6 border-b flex items-center justify-between gap-4 w-full sticky top-0 z-30 transition-colors backdrop-blur-md ${
            isDark
              ? 'bg-[#0c1626]/95 border-slate-800'
              : 'bg-white/95 border-slate-200'
          }`}
        >
          {/* Left: Only Class Selector dropdown */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-auto max-w-[260px] md:max-w-[320px] shrink min-w-0">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                aria-label={isVie ? 'Chọn lớp học' : 'Select class'}
                className="w-full max-w-[260px] md:max-w-[320px] truncate pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer font-sans transition-colors"
              >
                {MOCK_CLASS_GROUPS.map((cls) => (
                  <option key={cls.id} value={cls.id} className="py-1">
                    {isVie ? cls.name : (cls.nameEng || cls.name)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right: Language toggle (VIE | ENG) & Theme toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            {onLanguageChange && (
              <div
                role="group"
                aria-label="Language Selector"
                className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold"
              >
                <button
                  type="button"
                  onClick={() => onLanguageChange('vie')}
                  className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
                    isVie
                      ? 'bg-[#1BA94C] text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  VIE
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('eng')}
                  className={`px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer ${
                    !isVie
                      ? 'bg-[#1BA94C] text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ENG
                </button>
              </div>
            )}

            {onThemeToggle && (
              <button
                type="button"
                onClick={onThemeToggle}
                aria-label={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors focus:outline-none cursor-pointer"
                title={isDark ? (isVie ? 'Chuyển Theme Sáng' : 'Light Mode') : (isVie ? 'Chuyển Theme Tối' : 'Dark Mode')}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
            )}
          </div>
        </header>

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ================= 2. SMART METRIC CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {/* CARD 1: TOTAL STUDENTS */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                {isVie ? 'Tổng sinh viên' : 'Total Students'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                {classTotalStudents}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-sans">
                {activeClass.activePercentage}% {isVie ? 'hoạt động' : 'active'}
              </span>
            </div>
          </div>

          {/* CARD 2: COMPLETION RATE */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                {isVie ? 'Tiến độ hoàn thành' : 'Completion Rate'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                {activeClass.completionRate}%
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-sans">
                {activeClass.maxCompleted}/{classTotalStudents} {isVie ? 'SV đạt yêu cầu' : 'passed'}
              </span>
            </div>
          </div>

          {/* CARD 3: AI SOCRATIC USAGE */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                {isVie ? 'Tương tác AI Socratic' : 'AI Socratic Usage'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                {activeClass.totalAIQueries}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-sans">
                {activeClass.resolvedWithAI}% {isVie ? 'tự sửa sau gợi ý' : 'resolved via hints'}
              </span>
            </div>
          </div>

          {/* CARD 4: STUCK ALERTS */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
                {isVie ? 'Cảnh báo bế tắc' : 'Stuck Alerts'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-sans">
                {activeClass.stuckStudentsCount}
              </span>
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400 font-sans">
                {isVie ? 'Sinh viên cần hỗ trợ' : 'Students need help'}
              </span>
            </div>
          </div>
        </section>

        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Khung Phổ điểm & Phân bổ thành tích lớp (có 2 bộ lọc Khóa/Bài) */}
            <ScoreDistributionCard
              selectedClassId={selectedClassId}
              isDark={isDark}
              isVie={isVie}
              storageTick={storageTick}
            />

            {/* 2. Live Submissions Real-time Stream Table */}
            <div
              className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                    {isVie ? 'Dòng nộp bài trực tiếp (Live Submissions Stream)' : 'Live Submissions Stream'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    REALTIME
                  </span>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap font-sans">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder={isVie ? 'Tìm SV, bài tập...' : 'Search student...'}
                      value={liveSubmissionSearch}
                      onChange={(e) => setLiveSubmissionSearch(e.target.value)}
                      className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                      }`}
                    />
                  </div>

                  <select
                    value={liveSubmissionFilter}
                    onChange={(e) => setLiveSubmissionFilter(e.target.value)}
                    aria-label="Lọc trạng thái nộp bài"
                    className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none font-sans ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                    }`}
                  >
                    <option value="all">{isVie ? 'Tất cả trạng thái' : 'All Status'}</option>
                    <option value="accepted">Accepted (10/10)</option>
                    <option value="wrong_answer">Wrong Answer</option>
                    <option value="time_limit">Time Limit Exceeded</option>
                    <option value="compile_error">Compilation Error</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 font-bold font-sans text-neutral-600 dark:text-slate-400">
                    <tr className="border-b border-slate-200 dark:border-slate-800 font-bold font-sans">
                      <th className="py-3 px-4">{isVie ? 'Sinh viên' : 'Student'}</th>
                      <th className="py-3 px-4">{isVie ? 'Bài tập' : 'Assignment'}</th>
                      <th className="py-3 px-4">{isVie ? 'Ngôn ngữ' : 'Language'}</th>
                      <th className="py-3 px-4">{isVie ? 'Điểm / Test cases' : 'Score'}</th>
                      <th className="py-3 px-4">{isVie ? 'Thời gian chạy' : 'Runtime'}</th>
                      <th className="py-3 px-4">{isVie ? 'Trạng thái' : 'Status'}</th>
                      <th className="py-3 px-4">{isVie ? 'Đạo văn' : 'Similarity'}</th>
                      <th className="py-3 px-4 text-right">{isVie ? 'Thời gian' : 'Time'}</th>
                      <th className="py-3 px-4 text-center">{isVie ? 'Hành động' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium font-sans">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-500">
                          {isVie ? 'Không có bài nộp nào phù hợp bộ lọc.' : 'No submissions found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr
                          key={sub.id}
                          className={`transition ${
                            isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold font-sans">
                            <div>{sub.studentName}</div>
                            <div className="text-[11px] font-sans text-slate-500 font-normal">
                              {sub.studentId}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold font-sans">
                            {translateExerciseTitle(sub.exerciseTitle, isVie)}
                          </td>
                          <td className="py-3 px-4 font-sans text-[11px] text-slate-500">
                            {sub.language}
                          </td>
                          <td className="py-3 px-4 font-sans font-bold">
                            <span
                              className={
                                sub.testCasesPassed === sub.totalTestCases
                                    ? 'text-emerald-500'
                                  : 'text-rose-500'
                              }
                            >
                              {sub.testCasesPassed}/{sub.totalTestCases}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans text-[11px]">
                            {sub.executionTimeMs} ms
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={sub.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 font-sans text-[11px] text-emerald-600 dark:text-emerald-400">
                            {sub.plagiarismScore}%
                          </td>
                          <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-sans">
                            {translateTimeAgo(sub.timeAgo, isVie)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => openCodeReviewModal(sub)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Code className="w-3 h-3" />
                              <span>{isVie ? 'Xem code' : 'Code'}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: COURSES & EXERCISES (3-LEVEL DRILL-DOWN) ================= */}
        {activeTab === 'assignments' && (
          <div className="space-y-5">
            {/* ---------------- LEVEL 1: 9 COURSES GRID ---------------- */}
            {drilldown.level === 'courses' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2 text-slate-900 dark:text-white font-sans">
                      <BookOpen className="w-5 h-5 text-emerald-500" />
                      <span>{isVie ? 'Quản lý Khóa học' : 'Course Management'}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold font-sans">
                      <span className="w-2 h-2 rounded-full bg-[#1BA94C] dark:bg-[#00EA64]" />
                      <span>{SKILL_TRACKS.length} {isVie ? 'khóa học đang mở' : 'active courses'}</span>
                    </span>
                  </div>
                </div>

                {/* 9 Courses Grid (3 rows x 3 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SKILL_TRACKS.map((track) => {
                    const courseTitle = isVie ? track.nameVie : track.nameEng;

                    return (
                      <div
                        key={track.id}
                        onClick={() => handleDrilldownToCourse(track.id)}
                        className="h-24 px-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer select-none group"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDrilldownToCourse(track.id);
                          }
                        }}
                      >
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                          style={{
                            backgroundColor: `${track.color}15`,
                            borderColor: `${track.color}35`,
                          }}
                        >
                          {renderCourseTrackIcon(track.iconType, track.color)}
                        </div>

                        {/* Title */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[17px] font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#00EA64] transition-colors truncate font-sans">
                            {courseTitle}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- LEVEL 2: EXERCISES LIST IN COURSE ---------------- */}
            {drilldown.level === 'exercises' && (
              <div className="space-y-4">
                {/* Breadcrumb & Navigation Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={handleBackToCourses}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isVie ? 'Khóa học' : 'Courses'}</span>
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-bold font-sans">
                        {isVie ? selectedCourse?.nameVie : selectedCourse?.nameEng}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white font-sans">
                      {isVie ? selectedCourse?.nameVie : selectedCourse?.nameEng}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToCourses}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs font-sans"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Quay lại danh sách khóa học' : 'Back to Courses'}</span>
                  </button>
                </div>

                {/* 2-Mode Switcher: Exercises vs Course Leaderboard */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    type="button"
                    onClick={() => handleSelectCourseTab('exercises')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
                      teacherCourseTab === 'exercises'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Danh sách bài tập' : 'Exercises'}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
                      {selectedCourseExercises.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCourseTab('leaderboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
                      teacherCourseTab === 'leaderboard'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Bảng xếp hạng khóa học' : 'Course Leaderboard'}</span>
                  </button>
                </div>

                {/* Exercises Tab View */}
                {teacherCourseTab === 'exercises' && (
                  <div className="space-y-4">
                    {/* Filter and Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder={isVie ? 'Tìm bài tập, chủ đề...' : 'Search exercises...'}
                            value={exerciseSearch}
                            onChange={(e) => setExerciseSearch(e.target.value)}
                            className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans ${
                              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                            }`}
                          />
                        </div>

                        <select
                          value={exerciseDiffFilter}
                          onChange={(e) =>
                            setExerciseDiffFilter(e.target.value as 'all' | 'easy' | 'medium' | 'hard')
                          }
                          aria-label="Lọc theo độ khó bài tập"
                          className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none font-sans ${
                            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                          }`}
                        >
                          <option value="all">{isVie ? 'Tất cả độ khó' : 'All Difficulties'}</option>
                          <option value="easy">{isVie ? 'Dễ (Easy)' : 'Easy'}</option>
                          <option value="medium">{isVie ? 'Trung bình (Medium)' : 'Medium'}</option>
                          <option value="hard">{isVie ? 'Khó (Hard)' : 'Hard'}</option>
                        </select>
                      </div>

                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
                        {filteredCourseExercises.length} / {selectedCourseExercises.length} {isVie ? 'bài tập hiển thị' : 'exercises shown'}
                      </span>
                    </div>

                    {/* Exercises Cards / Rows */}
                    <div className="space-y-3">
                      {filteredCourseExercises.length === 0 ? (
                        <div
                          className={`p-10 rounded-2xl border text-center text-slate-500 text-xs ${
                            isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          {isVie ? 'Không có bài tập nào phù hợp với bộ lọc.' : 'No exercises match the filter.'}
                        </div>
                      ) : (
                        filteredCourseExercises.map((ex, index) => {
                          const passedCount = 45 + ((ex.id * 7) % 20); // 45..64 students AC
                          const totalStudents = activeClass.totalStudents || 68;
                          const avgScore = (7.5 + ((ex.id * 3) % 25) / 10).toFixed(1);
                          const socraticRate = 75 + ((ex.id * 5) % 22);

                          return (
                            <div
                              key={ex.id}
                              className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-emerald-500/50 ${
                                isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                              }`}
                            >
                              {/* Left: Index + Info */}
                              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 font-sans">
                                  {index + 1}
                                </div>

                                <div className="space-y-1.5 flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase font-sans ${
                                        ex.difficulty === 'easy'
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                          : ex.difficulty === 'medium'
                                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                      }`}
                                    >
                                      {ex.difficulty === 'easy' ? (isVie ? 'Dễ' : 'Easy') : ex.difficulty === 'medium' ? (isVie ? 'Trung bình' : 'Medium') : (isVie ? 'Khó' : 'Hard')}
                                    </span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 font-sans">
                                      {!isVie && ex.categoryEn ? ex.categoryEn : ex.category}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      {ex.language}
                                    </span>
                                  </div>

                                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate font-sans">
                                    {translateExerciseTitle(ex.title, isVie)}
                                  </h4>
                                </div>
                              </div>

                              {/* Middle: Exercise Performance Metrics */}
                              <div className="flex items-center gap-4 sm:gap-6 text-xs shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800 font-sans">
                                <div>
                                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                    {isVie ? 'Sinh viên đạt AC' : 'Passed AC'}
                                  </div>
                                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {passedCount}/{totalStudents} {isVie ? 'sinh viên' : 'students'}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                    {isVie ? 'Điểm trung bình' : 'Avg Score'}
                                  </div>
                                  <div className="font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                                    {avgScore} / 10
                                  </div>
                                </div>

                                <div className="hidden lg:block">
                                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                    {isVie ? 'AI Socratic' : 'AI Socratic'}
                                  </div>
                                  <div className="font-semibold text-slate-600 dark:text-slate-300">
                                    {socraticRate}% {isVie ? 'tương tác' : 'active'}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                {onPreviewStudentIDE && (
                                  <button
                                    type="button"
                                    onClick={() => onPreviewStudentIDE(ex.id)}
                                    title={isVie ? 'Xem thử giao diện học sinh trên Web IDE' : 'Preview in Student Web IDE'}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-500/50 transition cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDrilldownToExercise(ex.id)}
                                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-emerald-900/30 cursor-pointer font-sans"
                                >
                                  <span>{isVie ? 'Xem danh sách bài làm' : 'View Submissions'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Course Leaderboard Tab View */}
                {teacherCourseTab === 'leaderboard' && (
                  <div
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-sans">
                            {isVie ? 'Bảng xếp hạng Khóa học' : 'Course Leaderboard'} - {isVie ? selectedCourse?.nameVie : selectedCourse?.nameEng}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isVie
                              ? 'Sắp xếp theo số bài đã giải trong khóa, tổng điểm và thời gian thực thi trung bình.'
                              : 'Ranked by solved challenges in this track, total score, and average execution runtime.'}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold font-sans self-start sm:self-auto">
                        {teacherCourseLeaderboard.length} {isVie ? 'sinh viên' : 'students'}
                      </span>
                    </div>

                    {/* Table */}
                    <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-sans">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 font-bold text-neutral-600 dark:text-slate-400">
                          <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
                            <th className="py-3 px-4 text-center w-16">{isVie ? 'Hạng' : 'Rank'}</th>
                            <th className="py-3 px-4">{isVie ? 'Sinh viên' : 'Student'}</th>
                            <th className="py-3 px-4">{isVie ? 'Bài đã giải' : 'Solved'}</th>
                            <th className="py-3 px-4">{isVie ? 'Tổng điểm' : 'Total Score'}</th>
                            <th className="py-3 px-4">{isVie ? 'Tốc độ TB' : 'Avg Runtime'}</th>
                            <th className="py-3 px-4">{isVie ? 'Ngôn ngữ chính' : 'Language'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                          {teacherCourseLeaderboard.map((entry) => (
                            <tr
                              key={entry.studentId}
                              className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                            >
                              <td className="py-3.5 px-4 text-center font-bold">
                                {entry.rank === 1 ? (
                                  <span className="text-base" title="Top 1">🥇</span>
                                ) : entry.rank === 2 ? (
                                  <span className="text-base" title="Top 2">🥈</span>
                                ) : entry.rank === 3 ? (
                                  <span className="text-base" title="Top 3">🥉</span>
                                ) : (
                                  <span className="text-slate-500 font-mono text-xs">#{entry.rank}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-7 h-7 rounded-full ${entry.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                    {entry.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                      <span>{entry.name}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                      {entry.studentId} • {entry.classGroup}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {entry.solvedCount} / {entry.totalExercises} {isVie ? 'bài' : 'solved'}
                                  </div>
                                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 rounded-full"
                                      style={{ width: `${Math.round((entry.solvedCount / entry.totalExercises) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                                {entry.totalScore} / {entry.totalExercises * 10}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px]">
                                {entry.avgRuntimeMs} ms
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                                {entry.mainLanguage}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- LEVEL 3: EXERCISE STUDENT SUBMISSIONS STREAM ---------------- */}
            {drilldown.level === 'submissions' && (
              <div className="space-y-4">
                {/* Breadcrumb & Navigation Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    {/* 3-Level Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                      <button
                        type="button"
                        onClick={handleBackToCourses}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer font-sans"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isVie ? 'Khóa học' : 'Courses'}</span>
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <button
                        type="button"
                        onClick={handleBackToExercises}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer font-sans"
                      >
                        {isVie ? selectedCourse?.nameVie : selectedCourse?.nameEng}
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-bold font-sans">
                        {translateExerciseTitle(selectedExercise?.title || '', isVie)}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white font-sans flex items-center gap-2">
                      <span>{translateExerciseTitle(selectedExercise?.title || '', isVie)}</span>
                      {selectedExercise?.difficulty && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            selectedExercise.difficulty === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : selectedExercise.difficulty === 'medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {selectedExercise.difficulty === 'easy'
                            ? isVie
                              ? 'Dễ'
                              : 'Easy'
                            : selectedExercise.difficulty === 'medium'
                            ? isVie
                              ? 'Trung bình'
                              : 'Medium'
                            : isVie
                            ? 'Khó'
                            : 'Hard'}
                        </span>
                      )}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToExercises}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs font-sans"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Quay lại danh sách bài tập' : 'Back to Exercise List'}</span>
                  </button>
                </div>

                {/* 2-Mode Switcher: Submissions vs Problem Leaderboard */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    type="button"
                    onClick={() => handleSelectExerciseTab('submissions')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
                      teacherExerciseTab === 'submissions'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Danh sách nộp bài' : 'Submissions'}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
                      {filteredExerciseSubmissions.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectExerciseTab('leaderboard')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
                      teacherExerciseTab === 'leaderboard'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{isVie ? 'Bảng xếp hạng bài tập' : 'Problem Leaderboard'}</span>
                  </button>
                </div>

                {/* Submissions Tab View */}
                {teacherExerciseTab === 'submissions' && (
                  <div
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                          {isVie ? 'Danh sách sinh viên nộp bài cho bài tập này' : 'Student Submissions for this Exercise'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {filteredExerciseSubmissions.length} {isVie ? 'bài nộp' : 'submissions'}
                        </span>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center gap-2 flex-wrap font-sans">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder={isVie ? 'Tìm theo tên hoặc MSSV...' : 'Search student or ID...'}
                            value={subSearch}
                            onChange={(e) => setSubSearch(e.target.value)}
                            className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans ${
                              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                            }`}
                          />
                        </div>

                        <select
                          value={subStatusFilter}
                          onChange={(e) => setSubStatusFilter(e.target.value)}
                          aria-label="Lọc trạng thái nộp bài"
                          className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none font-sans ${
                            isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                          }`}
                        >
                          <option value="all">{isVie ? 'Tất cả trạng thái' : 'All Status'}</option>
                          <option value="accepted">Accepted (10/10)</option>
                          <option value="wrong_answer">Wrong Answer</option>
                          <option value="time_limit">Time Limit Exceeded (TLE)</option>
                          <option value="compile_error">Compilation Error</option>
                        </select>
                      </div>
                    </div>

                    {/* Table with columns matching Live Submissions Stream */}
                    <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 font-bold font-sans text-neutral-600 dark:text-slate-400">
                          <tr className="border-b border-slate-200 dark:border-slate-800 font-bold font-sans">
                            <th className="py-3 px-4">{isVie ? 'Sinh viên' : 'Student'}</th>
                            <th className="py-3 px-4">{isVie ? 'Bài tập' : 'Assignment'}</th>
                            <th className="py-3 px-4">{isVie ? 'Ngôn ngữ' : 'Language'}</th>
                            <th className="py-3 px-4">{isVie ? 'Điểm / Test cases' : 'Score'}</th>
                            <th className="py-3 px-4">{isVie ? 'Thời gian chạy' : 'Runtime'}</th>
                            <th className="py-3 px-4">{isVie ? 'Trạng thái' : 'Status'}</th>
                            <th className="py-3 px-4">{isVie ? 'Đạo văn' : 'Similarity'}</th>
                            <th className="py-3 px-4 text-right">{isVie ? 'Thời gian' : 'Time'}</th>
                            <th className="py-3 px-4 text-center">{isVie ? 'Hành động' : 'Action'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium font-sans">
                          {filteredExerciseSubmissions.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="py-8 text-center text-slate-500">
                                {isVie ? 'Không có bài nộp nào phù hợp bộ lọc.' : 'No submissions found.'}
                              </td>
                            </tr>
                          ) : (
                            filteredExerciseSubmissions.map((sub) => (
                              <tr
                                key={sub.id}
                                className={`transition ${
                                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                                }`}
                              >
                                <td className="py-3 px-4 font-bold font-sans">
                                  <div>{sub.studentName}</div>
                                  <div className="text-[11px] font-sans text-slate-500 font-normal">
                                    {sub.studentId}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold font-sans">
                                  {translateExerciseTitle(sub.exerciseTitle, isVie)}
                                </td>
                                <td className="py-3 px-4 font-sans text-[11px] text-slate-500">
                                  {sub.language}
                                </td>
                                <td className="py-3 px-4 font-sans font-bold">
                                  <span
                                    className={
                                      sub.testCasesPassed === sub.totalTestCases
                                        ? 'text-emerald-500'
                                        : 'text-rose-500'
                                    }
                                  >
                                    {sub.testCasesPassed}/{sub.totalTestCases}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-sans text-[11px]">
                                  {sub.executionTimeMs} ms
                                </td>
                                <td className="py-3 px-4">
                                  <StatusBadge status={sub.status} size="sm" />
                                </td>
                                <td className="py-3 px-4 font-sans text-[11px] text-emerald-600 dark:text-emerald-400">
                                  {sub.plagiarismScore}%
                                </td>
                                <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-sans">
                                  {translateTimeAgo(sub.timeAgo, isVie)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => openCodeReviewModal(sub)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto cursor-pointer font-sans"
                                  >
                                    <Code className="w-3 h-3" />
                                    <span>{isVie ? 'Xem code' : 'Code'}</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Problem Leaderboard Tab View */}
                {teacherExerciseTab === 'leaderboard' && (
                  <div
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-sans">
                            {isVie ? 'Bảng xếp hạng bài tập' : 'Problem Leaderboard'} - {translateExerciseTitle(selectedExercise?.title || '', isVie)}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isVie
                              ? 'Sắp xếp theo chuẩn HackerRank: Điểm số cao nhất -> Thời gian chạy (ms) nhanh nhất -> Bộ nhớ tối ưu nhất.'
                              : 'Ranked by HackerRank standard: Highest score -> Lowest runtime ms -> Lowest memory MB.'}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold font-sans self-start sm:self-auto">
                        {teacherExerciseLeaderboard.length} {isVie ? 'sinh viên hoàn thành' : 'students completed'}
                      </span>
                    </div>

                    {/* Problem Leaderboard Table */}
                    <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-sans">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 font-bold text-neutral-600 dark:text-slate-400">
                          <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
                            <th className="py-3 px-4 text-center w-16">{isVie ? 'Hạng' : 'Rank'}</th>
                            <th className="py-3 px-4">{isVie ? 'Sinh viên' : 'Student'}</th>
                            <th className="py-3 px-4">{isVie ? 'Ngôn ngữ' : 'Language'}</th>
                            <th className="py-3 px-4">{isVie ? 'Điểm' : 'Score'}</th>
                            <th className="py-3 px-4">{isVie ? 'Thời gian chạy' : 'Runtime'}</th>
                            <th className="py-3 px-4">{isVie ? 'Bộ nhớ' : 'Memory'}</th>
                            <th className="py-3 px-4 text-right">{isVie ? 'Thời gian nộp' : 'Submitted'}</th>
                            <th className="py-3 px-4 text-center">{isVie ? 'Hành động' : 'Action'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                          {teacherExerciseLeaderboard.map((row) => (
                            <tr
                              key={row.studentId}
                              className={`transition ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                            >
                              <td className="py-3.5 px-4 text-center font-bold">
                                {row.rank === 1 ? (
                                  <span className="text-base" title="Top 1">🥇</span>
                                ) : row.rank === 2 ? (
                                  <span className="text-base" title="Top 2">🥈</span>
                                ) : row.rank === 3 ? (
                                  <span className="text-base" title="Top 3">🥉</span>
                                ) : (
                                  <span className="text-slate-500 font-mono text-xs">#{row.rank}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-7 h-7 rounded-full ${row.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                    {row.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                      <span>{row.name}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                      {row.studentId} • {row.classGroup}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                                {row.language}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                                {row.score}/{row.maxScore}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px]">
                                {row.executionTimeMs} ms
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                                {row.memoryMb} MB
                              </td>
                              <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                                {translateTimeAgo(row.timeAgo, isVie)}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const sub: LiveSubmission = {
                                      id: (selectedExercise?.id || 1) * 1000 + row.rank,
                                      studentName: row.name,
                                      studentId: row.studentId,
                                      classGroup: row.classGroup,
                                      exerciseId: selectedExercise?.id || 1,
                                      exerciseTitle: selectedExercise?.title || 'Bài tập thực hành',
                                      language: row.language,
                                      testCasesPassed: row.score,
                                      totalTestCases: row.maxScore,
                                      score: row.score,
                                      executionTimeMs: row.executionTimeMs,
                                      memoryMb: row.memoryMb,
                                      status: 'accepted',
                                      timeAgo: row.timeAgo,
                                      plagiarismScore: 2,
                                      submittedCode: row.submittedCode,
                                    };
                                    openCodeReviewModal(sub);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto cursor-pointer font-sans"
                                >
                                  <Code className="w-3 h-3" />
                                  <span>{isVie ? 'Xem code' : 'Code'}</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: AI AUDIT TRAIL & LOGS ================= */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Filter toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder={isVie ? 'Tìm SV, mã SV, nội dung lỗi...' : 'Search logs...'}
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                    }`}
                  />
                </div>

                {/* Error Type Filter */}
                <select
                  value={logErrorFilter}
                  onChange={(e) => setLogErrorFilter(e.target.value)}
                  aria-label="Lọc loại lỗi"
                  className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                  }`}
                >
                  <option value="all">{isVie ? 'Tất cả loại lỗi' : 'All Error Types'}</option>
                  <option value="IndexError">IndexError</option>
                  <option value="TimeLimitExceeded">TimeLimitExceeded (TLE)</option>
                  <option value="LogicError">LogicError</option>
                  <option value="SyntaxError">SyntaxError</option>
                  <option value="TypeError">TypeError</option>
                </select>

                {/* Stuck Only Checkbox */}
                <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyStuckLogs}
                    onChange={(e) => setOnlyStuckLogs(e.target.checked)}
                    className="rounded text-rose-600 w-3.5 h-3.5"
                  />
                  <span>{isVie ? 'Chỉ xem SV bế tắc (Stuck Alert)' : 'Stuck Only'}</span>
                </label>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isVie ? `Hiển thị ${filteredLogs.length} bản ghi vấn đáp AI` : `Showing ${filteredLogs.length} audit records`}
              </div>
            </div>

            {/* AI Audit Logs Table */}
            <div
              className={`p-1 rounded-2xl border overflow-hidden ${
                isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 font-bold text-neutral-600 dark:text-slate-400">
                    <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
                      <th className="py-3 px-4">{isVie ? 'Sinh viên' : 'Student'}</th>
                      <th className="py-3 px-4">{isVie ? 'Bài tập' : 'Problem'}</th>
                      <th className="py-3 px-4">{isVie ? 'Lỗi sinh viên gặp' : 'Error'}</th>
                      <th className="py-3 px-4 max-w-xs">{isVie ? 'Câu hỏi sinh viên & Gợi ý AI' : 'Dialogue Summary'}</th>
                      <th className="py-3 px-4 text-center">{isVie ? 'Trạng thái' : 'Status'}</th>
                      <th className="py-3 px-4 text-right">{isVie ? 'Thời gian' : 'Time'}</th>
                      <th className="py-3 px-4 text-center">{isVie ? 'Chi tiết' : 'Transcript'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          {isVie ? 'Không tìm thấy bản ghi tương tác nào.' : 'No audit records match filters.'}
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className={`transition ${
                            isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold font-sans">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg ${log.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans`}>
                                {log.studentName.charAt(0)}
                              </div>
                              <div>
                                <div className="truncate max-w-[130px] font-sans">{log.studentName}</div>
                                <div className="text-[11px] font-sans text-slate-500 font-normal">
                                  {log.studentId}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[150px] font-sans">
                            {translateExerciseTitle(log.exerciseTitle, isVie)}
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
                              {log.errorType}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs font-sans">
                            {(() => {
                              const s = translateLogSummary(
                                log.id,
                                log.studentPrompt,
                                log.aiHintSummary,
                                log.pedagogicalInsight,
                                isVie
                              );
                              return (
                                <>
                                  <div className="text-slate-700 dark:text-slate-300 italic truncate">
                                    "{s.prompt}"
                                  </div>
                                  <div className="text-emerald-600 dark:text-emerald-400 text-[11px] truncate mt-0.5">
                                    🤖 {s.hint}
                                  </div>
                                </>
                              );
                            })()}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {log.resolved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-sans">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isVie ? 'Đã tự sửa' : 'Resolved'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse font-sans">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{isVie ? 'Cần giúp' : 'Stuck'}</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-sans whitespace-nowrap">
                            {translateTimeAgo(log.timeAgo, isVie)}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => openTranscriptDrawer(log)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto whitespace-nowrap shadow-xs cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{isVie ? 'Xem Chat' : 'Transcript'}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: STUDENT ROSTER & GRADEBOOK ================= */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {/* Roster Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder={isVie ? 'Tìm sinh viên theo tên, MSSV, email...' : 'Search student...'}
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                    }`}
                  />
                </div>

                <select
                  value={rosterStatusFilter}
                  onChange={(e) => setRosterStatusFilter(e.target.value)}
                  aria-label="Lọc tình trạng học tập"
                  className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                  }`}
                >
                  <option value="all">{isVie ? 'Tất cả trạng thái' : 'All Academic Status'}</option>
                  <option value="excellent">{isVie ? 'Xuất sắc / Hoàn thành tốt' : 'Excellent'}</option>
                  <option value="progressing">{isVie ? 'Tiến bộ tốt' : 'Progressing'}</option>
                  <option value="needs_attention">{isVie ? 'Cần chú ý' : 'Needs Attention'}</option>
                  <option value="at_risk">{isVie ? 'Có nguy cơ bế tắc' : 'At Risk'}</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isVie
                  ? `Sĩ số: ${filteredRoster.length} / ${activeClass.totalStudents} sinh viên`
                  : `Class size: ${filteredRoster.length} / ${activeClass.totalStudents} students`}
              </div>
            </div>

            {/* Roster Table */}
            <div
              className={`p-1 rounded-2xl border overflow-hidden ${
                isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 font-bold text-neutral-600 dark:text-slate-400">
                    <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
                      <th className="py-3 px-4">MSSV</th>
                      <th className="py-3 px-4">{isVie ? 'Họ và tên' : 'Student Name'}</th>
                      <th className="py-3 px-4">{isVie ? 'Bài tập đã giải' : 'Solved'}</th>
                      <th className="py-3 px-4">{isVie ? 'Điểm trung bình (GPA)' : 'GPA'}</th>
                      <th className="py-3 px-4">{isVie ? 'Chuyên cần' : 'Attendance'}</th>
                      <th className="py-3 px-4">{isVie ? 'Lượt hỏi AI' : 'AI Queries'}</th>
                      <th className="py-3 px-4">{isVie ? 'Tình trạng học tập' : 'Status'}</th>
                      <th className="py-3 px-4">{isVie ? 'Hoạt động gần nhất' : 'Recent Activity'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                    {filteredRoster.map((st) => (
                      <tr
                        key={st.studentId}
                        className={`transition ${
                          isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-sans font-bold">{st.studentId}</td>
                        <td className="py-3.5 px-4 font-bold font-sans">
                          <div>{st.name}</div>
                          <div className="text-[11px] font-sans text-slate-500 font-normal">
                            {st.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className="font-bold text-emerald-500">{st.solvedCount}</span>
                          <span> / {st.totalAssignments} ({Math.round((st.solvedCount / st.totalAssignments) * 100)}%)</span>
                        </td>
                        <td className="py-3.5 px-4 font-sans font-black text-sm">
                          <span
                            className={
                              st.gpa >= 8.5
                                ? 'text-emerald-500'
                                : st.gpa >= 7.0
                                ? 'text-teal-500 dark:text-teal-400'
                                : st.gpa >= 6.0
                                ? 'text-amber-400'
                                : 'text-rose-500'
                            }
                          >
                            {st.gpa.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-500">
                          {st.attendanceRate}%
                        </td>
                        <td className="py-3.5 px-4 font-sans text-emerald-600 dark:text-emerald-400 font-bold">
                          {st.aiQueriesCount} {isVie ? 'lượt' : 'queries'}
                        </td>
                        <td className="py-3.5 px-4">
                          {st.status === 'excellent' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {isVie ? 'Xuất sắc' : 'Excellent'}
                            </span>
                          ) : st.status === 'progressing' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {isVie ? 'Tiến bộ tốt' : 'Progressing'}
                            </span>
                          ) : st.status === 'needs_attention' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {isVie ? 'Cần chú ý' : 'Needs Attention'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              {isVie ? 'Nguy cơ bế tắc' : 'At Risk'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] truncate max-w-[200px]">
                          {translateRecentActivity(st.recentActivity, isVie)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      <BackToTopButton currentLang={currentLang} position="bottom-right" />
      </div>

      {/* ================= DRAWERS & MODALS ================= */}
      {/* 1. AI Socratic Transcript Slide-Over Drawer */}
      <TeacherAITranscriptDrawer
        log={selectedLogForTranscript}
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        currentLang={currentLang}
        currentTheme={currentTheme}
        onPreviewStudentIDE={onPreviewStudentIDE}
      />

      {/* 2. Student Code Review Modal */}
      <TeacherCodeReviewModal
        submission={selectedSubmissionForCode}
        isOpen={isCodeReviewOpen}
        onClose={() => setIsCodeReviewOpen(false)}
        currentLang={currentLang}
        currentTheme={currentTheme}
      />

      {/* 3. Create & Assign New Assignment Modal */}
      <TeacherAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
        onSaveAssignment={handleSaveNewAssignment}
        currentLang={currentLang}
        currentTheme={currentTheme}
        selectedClassId={selectedClassId}
      />
    </div>
  );
};
