import React, { useMemo } from 'react';
import { User } from '../../types/auth';
import { Language, dashboardTranslations } from './dashboardI18n';
import { Flame, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface DashboardHeroProps {
  user: User;
  currentLang: Language;
  onOpenIDE?: () => void;
  solvedCount?: number;
  totalCount?: number;
  streakDays?: number;
  aiInteractions?: number;
}

interface DayContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  user,
  currentLang,
  solvedCount = 18,
  totalCount = 64,
  streakDays = 5,
  aiInteractions = 42,
}) => {
  const t = dashboardTranslations[currentLang];
  const cleanName = (user.name || '').replace(/\s*\([^)]*\)/g, '').trim();
  const firstName = cleanName.split(' ').filter(Boolean).pop() || cleanName;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  // Generate 22 weeks of mock GitHub-style contribution data
  const heatmapData = useMemo(() => {
    const weeksCount = 22;
    const totalDays = weeksCount * 7;
    const weeks: DayContribution[][] = [];

    // Seeded pseudo-random activity to have consistent realistic active streak
    let currentWeek: DayContribution[] = [];

    for (let i = 0; i < totalDays; i++) {
      const daysFromEnd = totalDays - 1 - i;
      let count = 0;

      // Active streak for last 5 days
      if (daysFromEnd >= 0 && daysFromEnd < streakDays) {
        count = 2 + (daysFromEnd % 3);
      } else if (i % 7 === 2 || i % 7 === 4 || i % 5 === 0) {
        count = (i * 7) % 5;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 5) level = 4;
      else if (count >= 3) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      currentWeek.push({
        date: `Day ${i + 1}`,
        count,
        level,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  }, [streakDays]);

  const levelColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-800';
      case 2:
        return 'bg-emerald-300 dark:bg-emerald-800 border-emerald-400 dark:border-emerald-700';
      case 3:
        return 'bg-emerald-400 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-500';
      case 4:
        return 'bg-emerald-600 dark:bg-emerald-400 border-emerald-700 dark:border-emerald-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700/60';
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#101725] dark:via-[#0e1420] dark:to-[#0b0f17] border border-slate-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm transition-all duration-200 select-none">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* TOP HEADER: GREETING & MOTIVATION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-gray-800/80">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HNUE AI-Powered Learning Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            {t.welcomeBack},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-[#00EA64]">
              {firstName}!
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-700 dark:text-slate-400 font-normal leading-relaxed">
            {t.heroMotivation}
          </p>
        </div>
      </div>

      {/* BALANCED 2-COLUMN SECTION: ACTIVITY HEATMAP (~68%) + STATS CARDS (~32%) */}
      <div className="relative z-10 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* LEFT COLUMN: ACTIVITY HEATMAP (~68%) */}
          <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-white dark:bg-[#131b29] border border-slate-200 dark:border-gray-800 shadow-sm">
            {/* Heatmap Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
                <span className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
                  {currentLang === 'vie' ? 'BIỂU ĐỒ HOẠT ĐỘNG LUYỆN TẬP' : 'ACTIVITY HEATMAP'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                  🔥 Chuỗi: {streakDays} {currentLang === 'vie' ? 'ngày liên tục' : 'days streak'}
                </span>
              </div>

              <div className="text-xs text-neutral-600 dark:text-slate-400 font-medium whitespace-nowrap">
                {currentLang === 'vie'
                  ? `${solvedCount} bài nộp trong 150 ngày qua`
                  : `${solvedCount} submissions in last 150 days`}
              </div>
            </div>

            {/* Heatmap Grid (Bounded, exactly 12px x 12px squares) */}
            <div className="overflow-x-auto py-1">
              <div className="w-fit mx-auto sm:mx-0">
                {/* Months row */}
                <div className="flex text-[10px] text-neutral-500 dark:text-slate-500 mb-1.5 pl-7 font-mono">
                  <span className="w-14 sm:w-16">Nov</span>
                  <span className="w-14 sm:w-16">Dec</span>
                  <span className="w-14 sm:w-16">Jan</span>
                  <span className="w-14 sm:w-16">Feb</span>
                  <span className="w-14 sm:w-16">Mar</span>
                  <span className="w-14 sm:w-16">Apr</span>
                </div>

                <div className="flex items-start gap-2">
                  {/* Day Labels (7 rows, Mon-Sun) */}
                  <div className="flex flex-col gap-[3px] text-[9px] text-neutral-500 dark:text-slate-500 pr-1 select-none font-mono">
                    <span className="h-3 flex items-center leading-none">Mon</span>
                    <span className="h-3 flex items-center leading-none">Tue</span>
                    <span className="h-3 flex items-center leading-none">Wed</span>
                    <span className="h-3 flex items-center leading-none">Thu</span>
                    <span className="h-3 flex items-center leading-none">Fri</span>
                    <span className="h-3 flex items-center leading-none">Sat</span>
                    <span className="h-3 flex items-center leading-none">Sun</span>
                  </div>

                  {/* Weekly Columns: exactly square w-3 h-3 (12px x 12px) */}
                  <div className="flex gap-[3px]">
                    {heatmapData.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px]">
                        {week.map((day, dIdx) => (
                          <div
                            key={dIdx}
                            title={
                              day.count > 0
                                ? `${day.count} bài tập đã nộp (${day.date})`
                                : `0 bài tập (${day.date})`
                            }
                            className={`w-3 h-3 rounded-sm border transition-transform hover:scale-125 hover:z-10 cursor-pointer ${levelColorClass(
                              day.level
                            )}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatmap Footer Legend */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-neutral-700 dark:text-slate-400">Tiến độ tổng:</span>
                    <span className="font-bold text-emerald-600 dark:text-[#00EA64]">
                      {progressPercent}% hoàn thành lộ trình
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-neutral-700 dark:text-slate-400">{currentLang === 'vie' ? 'Ít' : 'Less'}</span>
                    <span className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" title="0" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-800" title="1-2" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800 border border-emerald-400 dark:border-emerald-700" title="2-3" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-600 border border-emerald-500 dark:border-emerald-500" title="3-4" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-400 border border-emerald-700 dark:border-emerald-300" title="5+" />
                    <span className="text-neutral-700 dark:text-slate-400">{currentLang === 'vie' ? 'Nhiều' : 'More'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 BALANCED STATS CARDS (~32%) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3.5">
            {/* Card 1: Đã giải bài tập */}
            <div className="flex-1 p-4 sm:p-5 rounded-xl bg-white dark:bg-[#131b29] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-slate-200">
                    {currentLang === 'vie' ? 'Bài tập đã hoàn thành' : 'Solved Challenges'}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-[#00EA64]">
                  {progressPercent}%
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                  {solvedCount} <span className="text-sm font-semibold text-neutral-500 dark:text-slate-400">/ {totalCount} bài</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-gray-800 mt-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#00EA64] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Lượt tương tác AI Socratic */}
            <div className="flex-1 p-4 sm:p-5 rounded-xl bg-white dark:bg-[#131b29] border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-slate-200">
                    {currentLang === 'vie' ? 'Lượt tương tác AI Socratic' : 'AI Socratic Mentorship'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                  Gợi mở 100%
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                  {aiInteractions} <span className="text-sm font-semibold text-neutral-500 dark:text-slate-400">lượt trao đổi</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-slate-400 mt-1.5 font-normal">
                  {currentLang === 'vie'
                    ? 'Hỗ trợ định hướng tư duy giải thuật & phân tích test case'
                    : 'Guided computational thinking & edge-case diagnosis'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
