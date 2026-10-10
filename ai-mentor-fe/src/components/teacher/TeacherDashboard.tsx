import React, { useState, useMemo } from 'react';
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
} from '../../services/mockTeacherData';
import { TeacherAITranscriptDrawer } from './TeacherAITranscriptDrawer';
import { TeacherCodeReviewModal } from './TeacherCodeReviewModal';
import { TeacherAssignmentModal } from './TeacherAssignmentModal';
import { Language, ThemeMode } from '../dashboard/dashboardI18n';
import {
  BookOpen,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  LogOut,
  Bot,
  Users,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  Code,
  BarChart3,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  onPreviewStudentIDE?: (exerciseId: number) => void;
  currentTheme?: ThemeMode;
  onThemeToggle?: () => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onLogout,
  onPreviewStudentIDE,
  currentTheme = 'dark',
  onThemeToggle,
  currentLang = 'vie',
  onLanguageChange,
}) => {
  const isDark = currentTheme === 'dark';
  const isVie = currentLang === 'vie';

  // 1. Global Class Selector
  const [selectedClassId, setSelectedClassId] = useState<string>('K71A-CNTT');
  const activeClass = useMemo(() => {
    return (
      MOCK_CLASS_GROUPS.find((c) => c.id === selectedClassId) ||
      MOCK_CLASS_GROUPS[0]
    );
  }, [selectedClassId]);

  // 2. Tab Navigation: 'analytics' | 'assignments' | 'logs' | 'roster'
  const [activeTab, setActiveTab] = useState<'analytics' | 'assignments' | 'logs' | 'roster'>('analytics');

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

  // Filtered Live Submissions
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
  }, [selectedClassId, liveSubmissionFilter, liveSubmissionSearch]);

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

  // Filtered Roster
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
  }, [selectedClassId, rosterStatusFilter, rosterSearch]);

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
      className={`min-h-screen flex flex-col transition-colors duration-150 antialiased ${
        isDark
          ? 'bg-[#0b1322] text-slate-100'
          : 'bg-[#f8fafc] text-neutral-900'
      }`}
    >
      {/* ================= 1. HEADER & GLOBAL CONTROL BAR ================= */}
      <header
        className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors ${
          isDark
            ? 'bg-[#0c1626]/95 border-slate-800 backdrop-blur-md'
            : 'bg-white/95 border-slate-200 backdrop-blur-md'
        }`}
      >
        {/* LEFT: Brand Logo & Class Selector Dropdown */}
        <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1BA94C] to-[#00EA64] flex items-center justify-center font-bold text-white shadow-md">
              <span className="font-mono text-lg font-black">H</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm tracking-tight font-sans">
                  AI CODE MENTOR
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono">
                  {isVie ? 'Cổng Giảng Viên' : 'Instructor Portal'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5 truncate">
                HNUE • {isVie ? 'Quản lý & Giám sát AI Socratic' : 'EdTech Classroom Supervision'}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          {/* Class Selector Dropdown */}
          <div className="relative group min-w-0">
            <div className="flex items-center space-x-1.5">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                aria-label="Chọn lớp học"
                className={`appearance-none text-xs sm:text-sm font-bold rounded-xl px-3 py-1.5 pr-8 cursor-pointer border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-[#15233c] text-white border-slate-700 hover:border-indigo-500'
                    : 'bg-slate-100 text-neutral-900 border-slate-300 hover:border-indigo-500 shadow-xs'
                }`}
              >
                {MOCK_CLASS_GROUPS.map((cls) => (
                  <option key={cls.id} value={cls.id} className="py-1">
                    {cls.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* RIGHT: Language Toggle, Theme Toggle, CTA New Assignment & Teacher Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Language Toggle [ VIE | ENG ] */}
          {onLanguageChange && (
            <button
              type="button"
              onClick={() => onLanguageChange(isVie ? 'eng' : 'vie')}
              title={isVie ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-neutral-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isVie ? 'VIE' : 'ENG'}</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          {onThemeToggle && (
            <button
              type="button"
              onClick={onThemeToggle}
              title={isDark ? 'Chuyển sang Theme Sáng' : 'Chuyển sang Theme Tối'}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-amber-400'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* CTA: Giao bài tập mới */}
          <button
            type="button"
            onClick={() => setIsCreateAssignmentOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/30 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isVie ? 'Giao bài tập mới' : 'New Assignment'}</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Teacher Profile Card */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              PK
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <div className="font-bold truncate">{user.name || 'TS. Phạm Văn Khải'}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {isVie ? 'Bộ môn KHMT' : 'CS Department'}
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title={isVie ? 'Đăng xuất' : 'Sign out'}
              className={`p-1.5 rounded-lg border transition ${
                isDark
                  ? 'border-slate-700 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400'
                  : 'border-slate-300 hover:bg-rose-50 hover:text-rose-600 text-slate-600'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Course Context Ribbon */}
      <div
        className={`px-4 sm:px-6 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'bg-[#0d1829] border-slate-800/80 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-neutral-700'
        }`}
      >
        <div className="flex items-center space-x-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-bold">{activeClass.courseName}</span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono">{activeClass.code}</span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">{activeClass.term}</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-medium">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeClass.activeStudents} / {activeClass.totalStudents} {isVie ? 'sinh viên online' : 'active students'}</span>
          </span>
        </div>
      </div>

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ================= 2. SMART METRIC CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD 1: Enrolled & Active Students with 7-Day Sparkline */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isVie ? 'Tổng sinh viên & Tỷ lệ học' : 'Enrolled & Active'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black font-sans tracking-tight">
                {activeClass.totalStudents}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isVie ? 'sinh viên' : 'students'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ml-auto">
                {activeClass.activePercentage}% {isVie ? 'hoạt động' : 'active'}
              </span>
            </div>

            {/* 7-Day Mini Sparkline Bars */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5 flex justify-between">
                <span>{isVie ? 'Đăng nhập 7 ngày qua' : '7-Day Activity'}</span>
                <span className="font-mono text-emerald-500">Peak: 68 SV</span>
              </div>
              <div className="flex items-end justify-between gap-1.5 h-8">
                {activeClass.weeklyLogins.map((item, idx) => {
                  const barHeight = Math.max(20, Math.round((item.active / 70) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className="w-full rounded-xs bg-indigo-500/70 group-hover:bg-[#00EA64] transition-all cursor-pointer"
                        title={`${item.day}: ${item.active} sinh viên`}
                      />
                      <span className="text-[9px] text-slate-400 font-mono">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 2: Assignment Completion Progress */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isVie ? 'Tiến độ hoàn thành bài' : 'Completion Rate'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black font-sans tracking-tight text-emerald-600 dark:text-emerald-400">
                {activeClass.completionRate}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isVie ? 'đúng hạn' : 'on time'}
              </span>
            </div>

            {/* Tri-color Multi-Segment Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${(activeClass.maxCompleted / activeClass.totalStudents) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Đạt tối đa: ${activeClass.maxCompleted} SV`}
                />
                <div
                  style={{ width: `${(activeClass.inProgress / activeClass.totalStudents) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title={`Đang làm: ${activeClass.inProgress} SV`}
                />
                <div
                  style={{ width: `${(activeClass.notStarted / activeClass.totalStudents) * 100}%` }}
                  className="bg-rose-500/70 h-full"
                  title={`Chưa nộp: ${activeClass.notStarted} SV`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{activeClass.maxCompleted} {isVie ? 'Đạt' : 'Passed'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{activeClass.inProgress} {isVie ? 'Dở' : 'WIP'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{activeClass.notStarted} {isVie ? 'Chưa' : 'Not yet'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* CARD 3: AI Socratic Efficiency */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isVie ? 'Hiệu quả AI Socratic' : 'AI Socratic Impact'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black font-sans tracking-tight text-indigo-500">
                {activeClass.totalAIQueries}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isVie ? 'lượt hỏi' : 'queries'}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-slate-500 dark:text-slate-400">
                  {isVie ? 'Tự sửa sau gợi ý:' : 'Self-resolved rate:'}
                </span>
                <span className="font-bold text-emerald-500">{activeClass.resolvedWithAI}%</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                <span>{isVie ? '0% gian lận (100% Socratic)' : '0% Direct Solves'}</span>
              </div>
            </div>
          </div>

          {/* CARD 4: Stuck & Common Errors Alerts */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs ${
              isDark
                ? 'bg-[#101b2d] border-slate-800/90 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isVie ? 'Cảnh báo bế tắc' : 'Stuck & Errors'}
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black font-sans tracking-tight text-rose-500">
                {activeClass.stuckStudentsCount}
              </span>
              <span className="text-xs text-rose-500 font-semibold">
                {isVie ? 'sinh viên cần trợ giúp' : 'students stuck'}
              </span>
            </div>

            {/* Common Errors Tags */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">
                {isVie ? 'Lỗi phổ biến nhất lớp:' : 'Top class errors:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeClass.commonErrors.map((err, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setLogErrorFilter(err.name);
                      setActiveTab('logs');
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    {err.name} ({err.percentage}%)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. FOUR FUNCTIONAL TABS ================= */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          {/* Tab Navigation Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isVie ? 'Tổng quan & Phân tích' : 'Overview & Analytics'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('assignments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isVie ? 'Quản lý bài tập & Đề thi' : 'Assignments & Tests'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
                {assignments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isVie ? 'Nhật ký Giám sát AI' : 'AI Audit Log'}</span>
              {activeClass.stuckStudentsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                  {activeClass.stuckStudentsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isVie ? 'Danh sách sinh viên & Điểm số' : 'Roster & Grades'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
                {activeClass.totalStudents}
              </span>
            </button>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateAssignmentOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-[#1BA94C] to-[#00EA64] hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-900/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isVie ? 'Giao bài tập' : 'New Assignment'}</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 1. Grade Distribution Chart Section */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <span>{isVie ? 'Phổ điểm & Phân bổ thành tích lớp' : 'Class Grade Distribution'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isVie
                      ? `Thang điểm 10 • Điểm trung bình lớp: 7.82 • 81.4% đạt từ Khá trở lên`
                      : `10-point scale • Class GPA: 7.82 • 81.4% achieved Good or above`}
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    {isVie ? 'Tỷ lệ qua môn: 94.1%' : 'Pass Rate: 94.1%'}
                  </span>
                </div>
              </div>

              {/* Horizontal / Vertical Grade Distribution Bars */}
              <div className="space-y-3 pt-2">
                {activeClass.gradeDistribution.map((grade, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="font-semibold">{grade.bracket}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        {grade.count} {isVie ? 'sinh viên' : 'students'} ({grade.percentage}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{
                          width: `${grade.percentage * 2.2}%`,
                          backgroundColor: grade.color,
                        }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Live Submissions Real-time Stream Table */}
            <div
              className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-bold text-sm sm:text-base">
                    {isVie ? 'Dòng nộp bài trực tiếp (Live Submissions Stream)' : 'Live Submissions Stream'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    REALTIME
                  </span>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder={isVie ? 'Tìm SV, bài tập...' : 'Search student...'}
                      value={liveSubmissionSearch}
                      onChange={(e) => setLiveSubmissionSearch(e.target.value)}
                      className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-neutral-900'
                      }`}
                    />
                  </div>

                  <select
                    value={liveSubmissionFilter}
                    onChange={(e) => setLiveSubmissionFilter(e.target.value)}
                    aria-label="Lọc trạng thái nộp bài"
                    className={`px-3 py-1.5 rounded-xl text-xs border font-medium focus:outline-none ${
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
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className={isDark ? 'bg-[#0b1322] text-slate-400' : 'bg-slate-50 text-neutral-600'}>
                    <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
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
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
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
                          <td className="py-3 px-4 font-bold">
                            <div>{sub.studentName}</div>
                            <div className="text-[11px] font-mono text-slate-500 font-normal">
                              {sub.studentId}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-semibold">
                            {sub.exerciseTitle}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {sub.language}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold">
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
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {sub.executionTimeMs} ms
                          </td>
                          <td className="py-3 px-4">
                            {sub.status === 'accepted' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Accepted
                              </span>
                            ) : sub.status === 'time_limit' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                TLE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                {sub.status === 'compile_error' ? 'Compile Error' : 'Wrong Answer'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                            {sub.plagiarismScore}%
                          </td>
                          <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-mono">
                            {sub.timeAgo}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => openCodeReviewModal(sub)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto"
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

        {/* ================= TAB 2: ASSIGNMENTS & QUESTION BANK ================= */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base">
                  {isVie ? 'Ngân hàng Bài tập & Nhiệm vụ Lớp' : 'Class Assignments & Question Bank'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isVie
                    ? `Đang có ${assignments.length} bài tập được giao cho ${activeClass.name}`
                    : `Managing ${assignments.length} assignments for ${activeClass.name}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateAssignmentOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/30 w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>{isVie ? 'Giao bài tập mới' : 'Create Assignment'}</span>
              </button>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((ass) => (
                <div
                  key={ass.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                    isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            ass.difficulty === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : ass.difficulty === 'medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {ass.difficulty}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400">
                          {ass.category}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{ass.deadline}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-base leading-snug">{ass.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {ass.description}
                    </p>
                  </div>

                  {/* Submission Progress & Policy Badges */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>{isVie ? 'Tiến độ nộp bài:' : 'Submissions:'}</span>
                      <span className="font-mono font-bold text-emerald-500">
                        {ass.submittedCount} / {ass.totalStudents} ({Math.round((ass.submittedCount / ass.totalStudents) * 100)}%)
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{
                          width: `${Math.round((ass.submittedCount / ass.totalStudents) * 100)}%`,
                        }}
                        className="h-full bg-[#1BA94C] rounded-full"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                      <div className="flex items-center gap-2">
                        {ass.aiSocraticEnabled && (
                          <span className="flex items-center gap-1 text-indigo-500 font-semibold" title="AI Socratic Mentor đang bật">
                            <Bot className="w-3.5 h-3.5" />
                            <span>AI Socratic ON</span>
                          </span>
                        )}
                        {ass.antiPlagiarismEnabled && (
                          <span className="flex items-center gap-1 text-emerald-500 font-semibold" title="Quét phát hiện đạo văn đang bật">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Anti-Plagiarism</span>
                          </span>
                        )}
                      </div>

                      {onPreviewStudentIDE && (
                        <button
                          type="button"
                          onClick={() => onPreviewStudentIDE(ass.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isVie ? 'Xem thử Web IDE' : 'Preview in IDE'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                    className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className={isDark ? 'bg-[#0b1322] text-slate-400' : 'bg-slate-50 text-neutral-600'}>
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
                          <td className="py-3 px-4 font-bold">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg ${log.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                                {log.studentName.charAt(0)}
                              </div>
                              <div>
                                <div className="truncate max-w-[130px]">{log.studentName}</div>
                                <div className="text-[11px] font-mono text-slate-500 font-normal">
                                  {log.studentId}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[150px]">
                            {log.exerciseTitle}
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
                              {log.errorType}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            <div className="text-slate-700 dark:text-slate-300 italic truncate">
                              "{log.studentPrompt}"
                            </div>
                            <div className="text-emerald-600 dark:text-emerald-400 text-[11px] truncate mt-0.5">
                              🤖 {log.aiHintSummary}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {log.resolved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isVie ? 'Đã tự sửa' : 'Resolved'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{isVie ? 'Cần giúp' : 'Stuck'}</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-mono whitespace-nowrap">
                            {log.timeAgo}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => openTranscriptDrawer(log)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1 mx-auto whitespace-nowrap shadow-xs"
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
                    className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className={isDark ? 'bg-[#0b1322] text-slate-400' : 'bg-slate-50 text-neutral-600'}>
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
                        <td className="py-3.5 px-4 font-mono font-bold">{st.studentId}</td>
                        <td className="py-3.5 px-4 font-bold">
                          <div>{st.name}</div>
                          <div className="text-[11px] font-mono text-slate-500 font-normal">
                            {st.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-emerald-500">{st.solvedCount}</span>
                          <span> / {st.totalAssignments} ({Math.round((st.solvedCount / st.totalAssignments) * 100)}%)</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-sm">
                          <span
                            className={
                              st.gpa >= 8.5
                                ? 'text-emerald-500'
                                : st.gpa >= 7.0
                                ? 'text-indigo-400'
                                : st.gpa >= 6.0
                                ? 'text-amber-400'
                                : 'text-rose-500'
                            }
                          >
                            {st.gpa.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {st.attendanceRate}%
                        </td>
                        <td className="py-3.5 px-4 font-mono text-indigo-400 font-bold">
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
                          {st.recentActivity}
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
