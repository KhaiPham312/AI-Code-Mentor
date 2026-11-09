import React from 'react';
import { SKILL_TRACKS, SkillTrack, SkillIconType } from '../../types/skills';
import { Exercise } from '../../types/exercise';
import { Language, dashboardTranslations } from './dashboardI18n';
import {
  GitBranch,
  Layers,
  Calculator,
  Brain,
  Coffee,
  Database,
} from 'lucide-react';

interface PracticeSkillsGridProps {
  currentLang: Language;
  exercises: Exercise[];
  onSelectTrack: (trackId: string) => void;
  solvedExerciseIds?: number[];
}

/**
 * Render specialized enlarged icon for each HackerRank skill track
 */
const renderSkillIcon = (iconType: SkillIconType, color: string) => {
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
      return (
        <span className="font-mono font-extrabold text-base tracking-tighter" style={{ color }}>
          C
        </span>
      );
    case 'cpp':
      return (
        <span className="font-mono font-extrabold text-sm tracking-tighter" style={{ color }}>
          C++
        </span>
      );
    case 'java':
      return <Coffee className="w-6 h-6" style={{ color }} />;
    case 'python':
      return (
        <span className="font-mono font-extrabold text-sm tracking-tight text-amber-500">
          Py
        </span>
      );
    case 'sql':
      return <Database className="w-6 h-6" style={{ color }} />;
    default:
      return <Layers className="w-6 h-6" style={{ color }} />;
  }
};

export const PracticeSkillsGrid: React.FC<PracticeSkillsGridProps> = ({
  currentLang,
  onSelectTrack,
}) => {
  const t = dashboardTranslations[currentLang];

  return (
    <section className="space-y-6">
      {/* SECTION HEADER (CLEAN HACKERRANK STYLE) */}
      <div className="border-b pb-4 border-slate-200 dark:border-gray-800">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
          {t.practiceSkillsTitle}
        </h2>
      </div>

      {/* 3-COLUMN RESPONSIVE SKILLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SKILL_TRACKS.map((track: SkillTrack) => {
          const title = currentLang === 'vie' ? track.nameVie : track.nameEng;

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className="h-24 px-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer select-none group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTrack(track.id);
                }
              }}
              aria-label={title}
            >
              {/* Left: Distinctive Enlarged Skill Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: `${track.color}15`,
                  borderColor: `${track.color}35`,
                }}
              >
                {renderSkillIcon(track.iconType, track.color)}
              </div>

              {/* Right: Course Title */}
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-emerald-600 dark:group-hover:text-[#00EA64] transition-colors truncate font-sans">
                  {title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
