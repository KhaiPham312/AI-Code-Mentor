import { COMPREHENSIVE_EXERCISES } from './mockExercisesData';
import { SKILL_TRACKS } from '../types/skills';
import { getRealStudentSubmissionsForTeacher } from './userStorage';
import { MOCK_CLASS_GROUPS } from './mockTeacherData';

export interface DayActivity {
  day: string;
  dayEn: string;
  studentCount: number;
  totalStudents: number;
  percent: number;
  peakHour: string;
  submissionsCount: number;
}

export interface GradeDistribution {
  gioiCount: number;
  gioiPercent: number; // >= 8.0
  khaCount: number;
  khaPercent: number; // 6.5 - 7.9
  tbCount: number;
  tbPercent: number; // 5.0 - 6.4
  yeuCount: number;
  yeuPercent: number; // < 5.0
}

export interface CourseCompletionStats {
  trackId: string;
  trackNameVie: string;
  trackNameEng: string;
  color: string;
  totalExercises: number;
  totalStudents: number;
  passedCount: number;
  passedPercent: number;
  inProgressCount: number;
  inProgressPercent: number;
  notStartedCount: number;
  notStartedPercent: number;
  avgScore: number;
  gradeDistribution: GradeDistribution;
  isHighest?: boolean;
  isLowest?: boolean;
}

export interface ExerciseStats {
  exerciseId: number;
  title: string;
  titleEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  trackId: string;
  totalStudents: number;
  completedCount: number;
  completedPercent: number;
  inProgressCount: number;
  inProgressPercent: number;
  notStartedCount: number;
  notStartedPercent: number;
  avgScore: number;
  gradeDistribution: GradeDistribution;
}

/**
 * Deterministic string hasher for reproducible seeding
 */
function seededHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Lấy tổng số sinh viên theo sĩ số chuẩn của lớp
 */
export function getClassTotalStudents(classId: string): number {
  if (classId === 'ALL') {
    return MOCK_CLASS_GROUPS.reduce((acc, c) => acc + c.totalStudents, 0);
  }
  const found = MOCK_CLASS_GROUPS.find((c) => c.id === classId);
  return found ? found.totalStudents : 68;
}

/**
 * Mục 4.1: Thống kê hoạt động 7 ngày của lớp
 * Sinh số xác định theo classId, hiển thị số SV làm bài và % từng ngày.
 */
export function getWeeklyActivity(classId: string): DayActivity[] {
  const total = getClassTotalStudents(classId);

  // Mẫu tỷ lệ học chuẩn theo ngày trong tuần
  const dayPatterns = [
    { day: 'T2', dayEn: 'Mon', baseRatio: 0.76, peak: '14:30', subFactor: 1.8 },
    { day: 'T3', dayEn: 'Tue', baseRatio: 0.85, peak: '20:15', subFactor: 2.1 },
    { day: 'T4', dayEn: 'Wed', baseRatio: 0.89, peak: '19:45', subFactor: 2.4 },
    { day: 'T5', dayEn: 'Thu', baseRatio: 0.81, peak: '16:00', subFactor: 1.9 },
    { day: 'T6', dayEn: 'Fri', baseRatio: 0.95, peak: '21:30', subFactor: 2.8 },
    { day: 'T7', dayEn: 'Sat', baseRatio: 0.72, peak: '10:30', subFactor: 1.5 },
    { day: 'CN', dayEn: 'Sun', baseRatio: 0.65, peak: '15:00', subFactor: 1.3 },
  ];

  const classSeed = seededHash(classId) % 10;
  const realSubs = getRealStudentSubmissionsForTeacher();
  const realCount = realSubs.length;

  return dayPatterns.map((pat, idx) => {
    // Biến thiên nhẹ xác định theo classId (không dùng Math.random)
    const variation = (((classSeed + idx * 3) % 7) - 3) * 0.015;
    const finalRatio = Math.max(0.45, Math.min(0.98, pat.baseRatio + variation));
    let count = Math.round(total * finalRatio);

    // Cộng bài nộp thực tế nếu có
    if (realCount > 0 && idx === 4) {
      count = Math.min(total, count + Math.min(realCount, 3));
    }

    const percent = Math.round((count / total) * 100);
    const submissionsCount = Math.round(count * pat.subFactor);

    return {
      day: pat.day,
      dayEn: pat.dayEn,
      studentCount: count,
      totalStudents: total,
      percent,
      peakHour: pat.peak,
      submissionsCount,
    };
  });
}

/**
 * Mục 4 & 5: Thống kê chi tiết từng bài tập
 */
export function getExerciseStats(exerciseId: number, classId: string): ExerciseStats {
  const total = getClassTotalStudents(classId);
  const exercise = COMPREHENSIVE_EXERCISES.find((e) => e.id === exerciseId);
  const title = exercise?.title || `Bài tập #${exerciseId}`;
  const titleEn = exercise?.titleEn || exercise?.title || `Exercise #${exerciseId}`;
  const difficulty = exercise?.difficulty || 'medium';
  const trackId = exercise?.trackIds?.[0] || 'algorithms';

  // Tỷ lệ hoàn thành gốc theo độ khó
  const baseRate = difficulty === 'easy' ? 0.78 : difficulty === 'medium' ? 0.62 : 0.46;
  const hash = seededHash(`${classId}_ex_${exerciseId}`);
  const jitter = ((hash % 100) - 50) / 400; // -0.125 .. +0.125
  const passRate = Math.max(0.3, Math.min(0.92, baseRate + jitter));

  let completedCount = Math.max(5, Math.min(total - 4, Math.round(total * passRate)));
  let inProgressCount = Math.max(2, Math.min(total - completedCount - 1, Math.round((total - completedCount) * 0.45)));
  let notStartedCount = total - completedCount - inProgressCount;

  // Tích hợp bài nộp của người dùng thật
  const realSubs = getRealStudentSubmissionsForTeacher().filter((s) => s.exerciseId === exerciseId);
  if (realSubs.length > 0) {
    const hasAccepted = realSubs.some((s) => s.status === 'accepted' || s.score >= 8);
    if (hasAccepted && notStartedCount > 0) {
      completedCount++;
      notStartedCount--;
    } else if (notStartedCount > 0) {
      inProgressCount++;
      notStartedCount--;
    }
  }

  // Đảm bảo tổng phần trăm Đạt + Đang làm + Chưa làm = 100%
  const completedPercent = Math.round((completedCount / total) * 100);
  const inProgressPercent = Math.round((inProgressCount / total) * 100);
  const notStartedPercent = 100 - completedPercent - inProgressPercent;

  // Phổ điểm (Giỏi / Khá / TB / Yếu)
  let gioiCount = Math.max(1, Math.round(completedCount * 0.62));
  let khaCount = Math.max(1, Math.round(completedCount * 0.28 + inProgressCount * 0.2));
  let tbCount = Math.max(1, Math.round(inProgressCount * 0.6 + notStartedCount * 0.15));
  let yeuCount = total - (gioiCount + khaCount + tbCount);

  if (yeuCount < 0) {
    tbCount += yeuCount;
    yeuCount = 0;
  }

  const gioiPercent = Math.round((gioiCount / total) * 100);
  const khaPercent = Math.round((khaCount / total) * 100);
  const tbPercent = Math.round((tbCount / total) * 100);
  const yeuPercent = 100 - (gioiPercent + khaPercent + tbPercent);

  // Điểm trung bình bài tập
  const avgScore =
    Math.round(
      ((gioiCount * 9.1 + khaCount * 7.4 + tbCount * 5.8 + yeuCount * 3.6) / total) * 10
    ) / 10;

  return {
    exerciseId,
    title,
    titleEn,
    difficulty,
    trackId,
    totalStudents: total,
    completedCount,
    completedPercent,
    inProgressCount,
    inProgressPercent,
    notStartedCount,
    notStartedPercent,
    avgScore,
    gradeDistribution: {
      gioiCount,
      gioiPercent,
      khaCount,
      khaPercent,
      tbCount,
      tbPercent,
      yeuCount,
      yeuPercent,
    },
  };
}

/**
 * Mục 4.2 & 5.1: Thống kê tổng hợp cho một khóa học
 * Điểm TB của khóa = trung bình điểm các bài trong khóa;
 * Số bài của khóa = số bài thật theo trackIds trong kho bài tập;
 * Các tổng luôn bằng 100%.
 */
export function getCourseStats(trackId: string, classId: string): CourseCompletionStats {
  const total = getClassTotalStudents(classId);
  const track = SKILL_TRACKS.find((t) => t.id === trackId) || SKILL_TRACKS[0];

  // Lấy các bài tập thật thuộc khóa học này
  const exercises = COMPREHENSIVE_EXERCISES.filter(
    (ex) => ex.trackIds && ex.trackIds.includes(trackId)
  );
  const totalExercises = exercises.length;

  if (totalExercises === 0) {
    return {
      trackId,
      trackNameVie: track.nameVie,
      trackNameEng: track.nameEng,
      color: track.color,
      totalExercises: 0,
      totalStudents: total,
      passedCount: 0,
      passedPercent: 0,
      inProgressCount: 0,
      inProgressPercent: 0,
      notStartedCount: total,
      notStartedPercent: 100,
      avgScore: 0,
      gradeDistribution: {
        gioiCount: 0,
        gioiPercent: 0,
        khaCount: 0,
        khaPercent: 0,
        tbCount: 0,
        tbPercent: 0,
        yeuCount: total,
        yeuPercent: 100,
      },
    };
  }

  // Thống kê từng bài tập
  const exStatsList = exercises.map((ex) => getExerciseStats(ex.id, classId));

  // Điểm TB của khóa = trung bình điểm các bài trong khóa
  const sumAvg = exStatsList.reduce((acc, s) => acc + s.avgScore, 0);
  const avgScore = Math.round((sumAvg / totalExercises) * 10) / 10;

  // Trung bình số sinh viên Đạt / Đang làm / Chưa làm trên mỗi bài
  const avgCompleted = Math.round(
    exStatsList.reduce((acc, s) => acc + s.completedCount, 0) / totalExercises
  );
  const avgInProgress = Math.round(
    exStatsList.reduce((acc, s) => acc + s.inProgressCount, 0) / totalExercises
  );
  const notStarted = Math.max(0, total - avgCompleted - avgInProgress);

  const passedPercent = Math.round((avgCompleted / total) * 100);
  const inProgressPercent = Math.round((avgInProgress / total) * 100);
  const notStartedPercent = 100 - passedPercent - inProgressPercent;

  // Phổ điểm trung bình của khóa
  const avgGioi = Math.round(
    exStatsList.reduce((acc, s) => acc + s.gradeDistribution.gioiCount, 0) / totalExercises
  );
  const avgKha = Math.round(
    exStatsList.reduce((acc, s) => acc + s.gradeDistribution.khaCount, 0) / totalExercises
  );
  const avgTb = Math.round(
    exStatsList.reduce((acc, s) => acc + s.gradeDistribution.tbCount, 0) / totalExercises
  );
  const yeu = Math.max(0, total - (avgGioi + avgKha + avgTb));

  const gioiPercent = Math.round((avgGioi / total) * 100);
  const khaPercent = Math.round((avgKha / total) * 100);
  const tbPercent = Math.round((avgTb / total) * 100);
  const yeuPercent = 100 - (gioiPercent + khaPercent + tbPercent);

  return {
    trackId,
    trackNameVie: track.nameVie,
    trackNameEng: track.nameEng,
    color: track.color,
    totalExercises,
    totalStudents: total,
    passedCount: avgCompleted,
    passedPercent,
    inProgressCount: avgInProgress,
    inProgressPercent,
    notStartedCount: notStarted,
    notStartedPercent,
    avgScore,
    gradeDistribution: {
      gioiCount: avgGioi,
      gioiPercent,
      khaCount: avgKha,
      khaPercent: avgTb,
      tbCount: avgTb,
      tbPercent,
      yeuCount: yeu,
      yeuPercent,
    },
  };
}

/**
 * Mục 4.2 & 5.2: Thống kê toàn bộ 9 khóa học, tự động gắn cờ cao nhất / thấp nhất
 */
export function getAllCoursesStats(classId: string): CourseCompletionStats[] {
  const stats = SKILL_TRACKS.map((t) => getCourseStats(t.id, classId));

  if (stats.length === 0) return [];

  // Tìm khóa có tỷ lệ hoàn thành cao nhất và thấp nhất
  let maxIdx = 0;
  let minIdx = 0;
  for (let i = 1; i < stats.length; i++) {
    if (stats[i].passedPercent > stats[maxIdx].passedPercent) maxIdx = i;
    if (stats[i].passedPercent < stats[minIdx].passedPercent) minIdx = i;
  }

  stats[maxIdx].isHighest = true;
  if (minIdx !== maxIdx) {
    stats[minIdx].isLowest = true;
  }

  return stats;
}

/**
 * Thống kê tổng hợp toàn bộ 9 khóa (dùng cho bộ lọc "Tất cả 9 khóa học")
 */
export function getOverallClassStats(classId: string): {
  totalStudents: number;
  totalExercises: number;
  avgScore: number;
  passedPercent: number;
  inProgressPercent: number;
  notStartedPercent: number;
  gradeDistribution: GradeDistribution;
} {
  const total = getClassTotalStudents(classId);
  const allCourses = getAllCoursesStats(classId);
  const totalExercises = COMPREHENSIVE_EXERCISES.length;

  if (allCourses.length === 0) {
    return {
      totalStudents: total,
      totalExercises,
      avgScore: 0,
      passedPercent: 0,
      inProgressPercent: 0,
      notStartedPercent: 100,
      gradeDistribution: {
        gioiCount: 0,
        gioiPercent: 0,
        khaCount: 0,
        khaPercent: 0,
        tbCount: 0,
        tbPercent: 0,
        yeuCount: total,
        yeuPercent: 100,
      },
    };
  }

  const avgScore =
    Math.round(
      (allCourses.reduce((acc, c) => acc + c.avgScore, 0) / allCourses.length) * 10
    ) / 10;

  const passedPercent = Math.round(
    allCourses.reduce((acc, c) => acc + c.passedPercent, 0) / allCourses.length
  );
  const inProgressPercent = Math.round(
    allCourses.reduce((acc, c) => acc + c.inProgressPercent, 0) / allCourses.length
  );
  const notStartedPercent = 100 - passedPercent - inProgressPercent;

  const gioiPercent = Math.round(
    allCourses.reduce((acc, c) => acc + c.gradeDistribution.gioiPercent, 0) / allCourses.length
  );
  const khaPercent = Math.round(
    allCourses.reduce((acc, c) => acc + c.gradeDistribution.khaPercent, 0) / allCourses.length
  );
  const tbPercent = Math.round(
    allCourses.reduce((acc, c) => acc + c.gradeDistribution.tbPercent, 0) / allCourses.length
  );
  const yeuPercent = 100 - (gioiPercent + khaPercent + tbPercent);

  const gioiCount = Math.round((gioiPercent / 100) * total);
  const khaCount = Math.round((khaPercent / 100) * total);
  const tbCount = Math.round((tbPercent / 100) * total);
  const yeuCount = total - (gioiCount + khaCount + tbCount);

  return {
    totalStudents: total,
    totalExercises,
    avgScore,
    passedPercent,
    inProgressPercent,
    notStartedPercent,
    gradeDistribution: {
      gioiCount,
      gioiPercent,
      khaCount,
      khaPercent,
      tbCount,
      tbPercent,
      yeuCount,
      yeuPercent,
    },
  };
}
