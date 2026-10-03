import React from 'react';
import { User } from '../../types/auth';
import { Language, dashboardTranslations } from './dashboardI18n';
import { Terminal, Flame, CheckCircle, Bot, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardHeroProps {
  user: User;
  currentLang: Language;
  onOpenIDE: () => void;
  solvedCount?: number;
  totalCount?: number;
  streakDays?: number;
  aiInteractions?: number;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  user,
  currentLang,
  onOpenIDE,
  solvedCount = 18,
  totalCount = 64,
  streakDays = 5,
  aiInteractions = 42,
}) => {
  const t = dashboardTranslations[currentLang];
  const firstName = user.name.split(' ').pop() || user.name;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  // SVG circular calculation (radius = 18, circumference = 2 * PI * 18 ≈ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#101725] dark:via-[#0e1420] dark:to-[#0b0f17] border border-slate-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm transition-all duration-200">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* LEFT: GREETING & MOTIVATION */}
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/60 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HNUE AI-Powered Learning Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            {t.welcomeBack},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-[#00EA64]">
              {firstName}!
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            {t.heroMotivation}
          </p>
        </div>

        {/* RIGHT: CTA BUTTON */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenIDE}
            className="group relative inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#1BA94C] hover:bg-[#15893d] text-white font-semibold text-sm tracking-wide shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#1BA94C]/40"
          >
            <Terminal className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span>{t.openIDEBtn}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* QUICK STATS WIDGETS (3 Horizontal Cards) */}
      <div className="relative z-10 mt-6 pt-6 border-t border-slate-200/80 dark:border-gray-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* STAT 1: SOLVED CHALLENGES */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800/80 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="text-[#1BA94C] dark:text-[#00EA64] transition-all duration-1000 ease-out"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <CheckCircle className="w-4 h-4 text-[#1BA94C] dark:text-[#00EA64] absolute" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.statSolved}
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {solvedCount}{' '}
              <span className="text-xs text-slate-400 font-normal">/ {totalCount}</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-[#00EA64] font-semibold mt-0.5">
              {progressPercent}% hoàn thành
            </div>
          </div>
        </div>

        {/* STAT 2: ACTIVE STREAK */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800/80 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.statStreak}
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {streakDays} <span className="text-xs text-slate-400 font-normal">ngày liên tục</span>
            </div>
            {/* 7-day mini indicator dots */}
            <div className="flex items-center gap-1 mt-1.5" title="Chuỗi 7 ngày gần nhất">
              {[true, true, true, true, true, false, false].map((active, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    active
                      ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STAT 3: AI SOCRATIC INTERACTIONS */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#131b29] border border-slate-200/80 dark:border-gray-800/80 shadow-sm transition-transform hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.statAIInteractions}
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {aiInteractions}{' '}
              <span className="text-xs text-slate-400 font-normal">lượt tư duy</span>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              100% Socratic Guidance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
