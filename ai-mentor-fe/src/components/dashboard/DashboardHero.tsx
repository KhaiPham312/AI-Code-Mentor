import React from 'react';
import { User } from '../../types/auth';
import { Language, dashboardTranslations } from './dashboardI18n';
import { Flame, CheckCircle2, Award, Bot } from 'lucide-react';
import type { StoredUserSubmission } from '../../services/userStorage';

interface DashboardHeroProps {
  user: User;
  currentLang: Language;
  onOpenIDE?: () => void;
  solvedCount?: number;
  totalCount?: number;
  streakDays?: number;
  aiInteractions?: number;
  todayGoalSolved?: number;
  todayGoalTotal?: number;
  bestStreakDays?: number;
  acRatePercent?: number;
  codingHours?: number;
  topTopics?: { label: string; percent: number; colorClass: string }[];
  userSubmissions?: StoredUserSubmission[];
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  user,
  currentLang,
  solvedCount = 0,
  totalCount = 75,
  streakDays = 0,
  aiInteractions = 0,
  todayGoalSolved = 0,
  todayGoalTotal = 3,
}) => {
  const t = dashboardTranslations[currentLang];
  const isVie = currentLang === 'vie';
  const cleanName = (user.name || '').replace(/\s*\([^)]*\)/g, '').trim();
  const firstName = cleanName.split(' ').filter(Boolean).pop() || cleanName;

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

      {/* TOP HEADER: GREETING */}
      <div className="relative z-10 flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-gray-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
            {t.welcomeBack},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-[#00EA64]">
              {firstName}!
            </span>
          </h1>
        </div>
      </div>

      {/* 4 BALANCED KPI STATS CARDS */}
      <div className="relative z-10 pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* CARD 1: LEARNING STREAK */}
        <div className="h-full p-5 rounded-2xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
              {isVie ? 'Chuỗi học tập' : 'Learning Streak'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {streakDays} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-sans">{isVie ? 'ngày' : 'days'}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: DAILY GOAL */}
        <div className="h-full p-5 rounded-2xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
              {isVie ? 'Mục tiêu hôm nay' : 'Daily Goal'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00EA64] border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {todayGoalSolved} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-sans">/ {todayGoalTotal} {isVie ? 'bài' : 'problems'}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: SOLVED EXERCISES */}
        <div className="h-full p-5 rounded-2xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
              {isVie ? 'Bài tập đã hoàn thành' : 'Solved Challenges'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {solvedCount} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-sans">/ {totalCount} {isVie ? 'bài' : 'problems'}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: AI INTERACTIONS */}
        <div className="h-full p-5 rounded-2xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-sans">
              {isVie ? 'Tương tác AI Socratic' : 'AI Socratic Mentorship'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {aiInteractions} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-sans">{isVie ? 'lượt' : 'queries'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
