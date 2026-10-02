import React from 'react';
import { Language, dashboardTranslations } from './dashboardI18n';
import { BookOpen, ArrowRight, Layers, Cpu, Award } from 'lucide-react';

interface SkillPreparationKitsProps {
  currentLang: Language;
  onSelectKit: (kitId: string) => void;
}

export const SkillPreparationKits: React.FC<SkillPreparationKitsProps> = ({
  currentLang,
  onSelectKit,
}) => {
  const t = dashboardTranslations[currentLang];

  const kits = [
    {
      id: 'dsa',
      title: t.kit1Title,
      desc: t.kit1Desc,
      tags: ['Python', 'C++', 'Java'],
      level: t.kit1Level,
      progress: 65,
      progressLabel: t.kit1Progress,
      icon: Layers,
      color: 'emerald',
      actionLabel: t.resumeKitBtn,
      exerciseId: 2,
    },
    {
      id: 'oop',
      title: t.kit2Title,
      desc: t.kit2Desc,
      tags: ['Python 3', 'OOP', 'Recursion'],
      level: t.kit2Level,
      progress: 20,
      progressLabel: t.kit2Progress,
      icon: Cpu,
      color: 'blue',
      actionLabel: t.resumeKitBtn,
      exerciseId: 7,
    },
    {
      id: 'assessment',
      title: t.kit3Title,
      desc: t.kit3Desc,
      tags: ['HNUE Assessment', 'Timed', 'Auto-grade'],
      level: t.kit3Level,
      progress: 10,
      progressLabel: t.kit3Progress,
      icon: Award,
      color: 'purple',
      actionLabel: t.startKitBtn,
      exerciseId: 6,
    },
  ];

  return (
    <section className="space-y-4">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1BA94C] dark:bg-[#00EA64]" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {t.kitsSectionTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.kitsSectionSub}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectKit('dsa')}
          className="text-xs font-semibold text-[#1BA94C] dark:text-[#00EA64] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>{t.viewAllKits}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 FEATURED CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kits.map((kit) => {
          const Icon = kit.icon;
          return (
            <div
              key={kit.id}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* CARD TOP: ICON & LEVEL BADGE */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      kit.color === 'emerald'
                        ? 'bg-emerald-500/10 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-500/20'
                        : kit.color === 'blue'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                    {kit.level}
                  </span>
                </div>

                {/* CARD TITLE & DESCRIPTION */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#1BA94C] dark:group-hover:text-[#00EA64] transition-colors leading-snug">
                  {kit.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {kit.desc}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {kit.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CARD BOTTOM: PROGRESS BAR & RESUME BUTTON */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-gray-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                    {kit.progress}%
                  </span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                    {kit.progressLabel}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      kit.color === 'emerald'
                        ? 'bg-[#1BA94C] dark:bg-[#00EA64]'
                        : kit.color === 'blue'
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${kit.progress}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onSelectKit(kit.id)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800/70 hover:bg-[#1BA94C] hover:text-white dark:hover:bg-[#1BA94C] dark:hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 transition-all duration-150 flex items-center justify-center gap-1.5 group-hover:border-[#1BA94C]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{kit.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
