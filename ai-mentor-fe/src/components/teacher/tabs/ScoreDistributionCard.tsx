import React, { useState, useMemo } from 'react';
import { SKILL_TRACKS } from '../../../types/skills';
import { COMPREHENSIVE_EXERCISES } from '../../../services/mockExercisesData';
import {
  getOverallClassStats,
  getCourseStats,
  getExerciseStats,
} from '../../../services/teacherAnalytics';
import { BarChart3 } from 'lucide-react';

export interface ScoreDistributionCardProps {
  selectedClassId: string;
  isDark: boolean;
  isVie: boolean;
  storageTick?: number;
}

export const ScoreDistributionCard: React.FC<ScoreDistributionCardProps> = ({
  selectedClassId,
  isDark,
  isVie,
  storageTick = 0,
}) => {
  // Filter states (URL query & localStorage persistence for F5 retention)
  const [selectedCourse, setSelectedCourse] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = new URLSearchParams(window.location.search);
        const c = p.get('analyticsCourse');
        if (c && (c === 'all' || SKILL_TRACKS.some((t) => t.id === c))) return c;
        const saved = localStorage.getItem('ai_mentor_teacher_analytics_course');
        if (saved && (saved === 'all' || SKILL_TRACKS.some((t) => t.id === saved))) return saved;
      } catch {
        // ignore
      }
    }
    return 'all';
  });

  const [selectedExerciseId, setSelectedExerciseId] = useState<number | 'all'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = new URLSearchParams(window.location.search);
        const ex = p.get('analyticsExercise');
        if (ex && ex !== 'all') {
          const num = Number(ex);
          if (!isNaN(num)) return num;
        }
        const saved = localStorage.getItem('ai_mentor_teacher_analytics_exercise');
        if (saved && saved !== 'all') {
          const num = Number(saved);
          if (!isNaN(num)) return num;
        }
      } catch {
        // ignore
      }
    }
    return 'all';
  });

  // Sync filters to URL query params and localStorage
  const updateFilters = (course: string, exId: number | 'all') => {
    setSelectedCourse(course);
    setSelectedExerciseId(exId);
    try {
      const url = new URL(window.location.href);
      if (course === 'all') {
        url.searchParams.delete('analyticsCourse');
      } else {
        url.searchParams.set('analyticsCourse', course);
      }

      if (exId === 'all') {
        url.searchParams.delete('analyticsExercise');
      } else {
        url.searchParams.set('analyticsExercise', String(exId));
      }

      window.history.replaceState({}, '', url.toString());
      localStorage.setItem('ai_mentor_teacher_analytics_course', course);
      localStorage.setItem('ai_mentor_teacher_analytics_exercise', String(exId));
    } catch {
      // ignore
    }
  };

  const handleCourseChange = (newCourse: string) => {
    updateFilters(newCourse, 'all');
  };

  const handleExerciseChange = (newExId: string) => {
    updateFilters(selectedCourse, newExId === 'all' ? 'all' : Number(newExId));
  };

  // List of exercises in the currently selected course
  const currentCourseExercises = useMemo(() => {
    if (selectedCourse === 'all') return [];
    return COMPREHENSIVE_EXERCISES.filter(
      (ex) => ex.trackIds && ex.trackIds.includes(selectedCourse)
    );
  }, [selectedCourse]);

  // Statistics for the top "Phổ điểm & Phân bổ thành tích lớp" box
  const currentStats = useMemo(() => {
    if (selectedCourse === 'all') {
      const overall = getOverallClassStats(selectedClassId);
      return {
        label: isVie ? 'Toàn bộ 9 khóa học' : 'All 9 Courses',
        avgScore: overall.avgScore,
        passedPercent: overall.passedPercent,
        inProgressPercent: overall.inProgressPercent,
        notStartedPercent: overall.notStartedPercent,
        gradeDistribution: overall.gradeDistribution,
        totalStudents: overall.totalStudents,
      };
    }

    if (selectedExerciseId !== 'all') {
      const exStats = getExerciseStats(selectedExerciseId, selectedClassId);
      return {
        label: isVie ? exStats.title : exStats.titleEn,
        avgScore: exStats.avgScore,
        passedPercent: exStats.completedPercent,
        inProgressPercent: exStats.inProgressPercent,
        notStartedPercent: exStats.notStartedPercent,
        gradeDistribution: exStats.gradeDistribution,
        totalStudents: exStats.totalStudents,
      };
    }

    const cStats = getCourseStats(selectedCourse, selectedClassId);
    return {
      label: isVie ? cStats.trackNameVie : cStats.trackNameEng,
      avgScore: cStats.avgScore,
      passedPercent: cStats.passedPercent,
      inProgressPercent: cStats.inProgressPercent,
      notStartedPercent: cStats.notStartedPercent,
      gradeDistribution: cStats.gradeDistribution,
      totalStudents: cStats.totalStudents,
    };
  }, [selectedClassId, selectedCourse, selectedExerciseId, isVie, storageTick]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Phổ điểm & Phân bổ thành tích lớp */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 shadow-xs ${
          isDark ? 'bg-[#101b2d] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Header & 2 Selector Dropdowns trên 1 hàng ngang */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white">
                {isVie ? 'Phổ điểm & Phân bổ thành tích lớp' : 'Grade Distribution & Performance'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              {isVie
                ? `Thang điểm 10 • Điểm trung bình: ${currentStats.avgScore}/10 • Tỷ lệ qua môn: ${currentStats.passedPercent}%`
                : `10-point scale • Average GPA: ${currentStats.avgScore}/10 • Pass rate: ${currentStats.passedPercent}%`}
            </p>
          </div>

          {/* 2 Filter Dropdowns: Khóa học & Bài tập */}
          <div className="flex flex-wrap items-center gap-3 font-sans">
            {/* Filter 1: Course Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                {isVie ? 'Khóa học:' : 'Course:'}
              </span>
              <select
                aria-label="Chọn khóa học"
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
                className={`w-56 px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors truncate ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="all">{isVie ? 'Tất cả 9 khóa học' : 'All 9 Courses'}</option>
                {SKILL_TRACKS.map((track) => (
                  <option key={track.id} value={track.id}>
                    {isVie ? track.nameVie : track.nameEng}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Exercise Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                {isVie ? 'Bài tập:' : 'Problem:'}
              </span>
              <select
                aria-label="Chọn bài tập"
                value={selectedExerciseId}
                onChange={(e) => handleExerciseChange(e.target.value)}
                disabled={selectedCourse === 'all'}
                className={`w-64 px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors truncate ${
                  selectedCourse === 'all'
                    ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800'
                    : isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="all">
                  {selectedCourse === 'all'
                    ? (isVie ? '(Chọn khóa để lọc bài)' : '(Select course to filter)')
                    : (isVie ? 'Tất cả bài tập trong khóa' : 'All problems in course')}
                </option>
                {currentCourseExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {isVie ? ex.title : (ex.titleEn || ex.title)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cột trái (7/12): 4 thanh ngang biểu diễn 4 mức điểm */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* 1. Giỏi / Xuất sắc: 8.0 - 10.0 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium font-sans">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{isVie ? '8.0 – 10.0 (Giỏi / Xuất sắc)' : '8.0 – 10.0 (Excellent)'}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-sans font-bold text-right">
                  {currentStats.gradeDistribution.gioiCount} {isVie ? 'sinh viên' : 'students'} ({currentStats.gradeDistribution.gioiPercent}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${currentStats.gradeDistribution.gioiPercent}%` }}
                  className="h-full rounded-full bg-[#10b981] transition-all duration-300"
                />
              </div>
            </div>

            {/* 2. Khá: 6.5 - 7.9 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium font-sans">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{isVie ? '6.5 – 7.9 (Khá)' : '6.5 – 7.9 (Good)'}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-sans font-bold text-right">
                  {currentStats.gradeDistribution.khaCount} {isVie ? 'sinh viên' : 'students'} ({currentStats.gradeDistribution.khaPercent}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${currentStats.gradeDistribution.khaPercent}%` }}
                  className="h-full rounded-full bg-[#3b82f6] transition-all duration-300"
                />
              </div>
            </div>

            {/* 3. Trung bình: 5.0 - 6.4 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium font-sans">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{isVie ? '5.0 – 6.4 (Trung bình)' : '5.0 – 6.4 (Average)'}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-sans font-bold text-right">
                  {currentStats.gradeDistribution.tbCount} {isVie ? 'sinh viên' : 'students'} ({currentStats.gradeDistribution.tbPercent}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${currentStats.gradeDistribution.tbPercent}%` }}
                  className="h-full rounded-full bg-[#f59e0b] transition-all duration-300"
                />
              </div>
            </div>

            {/* 4. Yếu: < 5.0 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium font-sans">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{isVie ? '< 5.0 (Yếu / Cần cố gắng)' : '< 5.0 (Weak / Needs Work)'}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-sans font-bold text-right">
                  {currentStats.gradeDistribution.yeuCount} {isVie ? 'sinh viên' : 'students'} ({currentStats.gradeDistribution.yeuPercent}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${currentStats.gradeDistribution.yeuPercent}%` }}
                  className="h-full rounded-full bg-[#ef4444] transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Cột phải (5/12): Khung tóm tắt nhanh Trạng thái hoàn thành */}
          <div
            className={`lg:col-span-5 p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-sans">
                  {isVie ? 'Trạng thái hoàn thành' : 'Completion Status'}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 max-w-[190px] truncate">
                  {currentStats.label}
                </span>
              </div>

              {/* Stacked bar visual for current scope */}
              <div className="space-y-1.5 my-3.5">
                <div className="flex justify-between items-center text-xs font-semibold font-sans">
                  <span className="text-slate-700 dark:text-slate-300">
                    {isVie ? 'Tiến độ nộp bài' : 'Submission Progress'}
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-[#00EA64]">
                    {currentStats.passedPercent}% {isVie ? 'Đạt' : 'Passed'}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div
                    style={{ width: `${currentStats.passedPercent}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Đạt: ${currentStats.passedPercent}%`}
                  />
                  <div
                    style={{ width: `${currentStats.inProgressPercent}%` }}
                    className="bg-amber-400 h-full"
                    title={`Đang làm: ${currentStats.inProgressPercent}%`}
                  />
                  <div
                    style={{ width: `${currentStats.notStartedPercent}%` }}
                    className="bg-rose-500/70 h-full"
                    title={`Chưa làm: ${currentStats.notStartedPercent}%`}
                  />
                </div>
              </div>
            </div>

            {/* 4 Mini Cards Grid đồng bộ chiều cao với 4 thanh phổ điểm bên trái */}
            <div className="grid grid-cols-2 gap-2 text-xs font-sans pt-1">
              {/* Mini Card 1: Đạt */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/50 border-slate-700/80' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 truncate text-[11px]">
                    {isVie ? 'Đạt' : 'Passed'}
                  </span>
                </div>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
                  {currentStats.passedPercent}%
                </span>
              </div>

              {/* Mini Card 2: Đang làm */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/50 border-slate-700/80' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 truncate text-[11px]">
                    {isVie ? 'Đang làm' : 'In Progress'}
                  </span>
                </div>
                <span className="font-bold font-mono text-amber-600 dark:text-amber-400 text-xs shrink-0">
                  {currentStats.inProgressPercent}%
                </span>
              </div>

              {/* Mini Card 3: Chưa làm */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/50 border-slate-700/80' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 truncate text-[11px]">
                    {isVie ? 'Chưa làm' : 'Not Started'}
                  </span>
                </div>
                <span className="font-bold font-mono text-rose-500 text-xs shrink-0">
                  {currentStats.notStartedPercent}%
                </span>
              </div>

              {/* Mini Card 4: Điểm TB */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/50 border-slate-700/80' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400 truncate text-[11px]">
                    {isVie ? 'Điểm TB' : 'Avg GPA'}
                  </span>
                </div>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
                  {currentStats.avgScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

