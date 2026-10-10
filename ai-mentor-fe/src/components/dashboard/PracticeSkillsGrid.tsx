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
  Server,
  HardDrive,
  Variable,
  Search,
  Atom,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PracticeSkillsGridProps {
  currentLang: Language;
  exercises: Exercise[];
  onSelectTrack: (trackId: string) => void;
}

/**
 * Render specialized icon for each HackerRank skill track
 */
const renderSkillIcon = (iconType: SkillIconType, color: string) => {
  switch (iconType) {
    case 'algorithms':
      return <GitBranch className="w-5 h-5" style={{ color }} />;
    case 'data-structures':
      return <Layers className="w-5 h-5" style={{ color }} />;
    case 'mathematics':
      return <Calculator className="w-5 h-5" style={{ color }} />;
    case 'ai':
      return <Brain className="w-5 h-5" style={{ color }} />;
    case 'c':
      return (
        <span className="font-mono font-extrabold text-sm tracking-tighter" style={{ color }}>
          C
        </span>
      );
    case 'cpp':
      return (
        <span className="font-mono font-extrabold text-xs tracking-tighter" style={{ color }}>
          C++
        </span>
      );
    case 'java':
      return <Coffee className="w-5 h-5" style={{ color }} />;
    case 'python':
      return (
        <span className="font-mono font-extrabold text-xs tracking-tight text-amber-500">
          Py
        </span>
      );
    case 'sql':
      return <Database className="w-5 h-5" style={{ color }} />;
    case 'databases':
      return <Server className="w-5 h-5" style={{ color }} />;
    case 'linux-shell':
      return <HardDrive className="w-5 h-5" style={{ color }} />;
    case 'fp':
      return <Variable className="w-5 h-5" style={{ color }} />;
    case 'regex':
      return <Search className="w-5 h-5" style={{ color }} />;
    case 'react':
      return <Atom className="w-5 h-5" style={{ color }} />;
    default:
      return <Layers className="w-5 h-5" style={{ color }} />;
  }
};

export const PracticeSkillsGrid: React.FC<PracticeSkillsGridProps> = ({
  currentLang,
  exercises,
  onSelectTrack,
}) => {
  const t = dashboardTranslations[currentLang];

  // Calculate track progress
  const getTrackStats = (trackId: string) => {
    const trackExercises = exercises.filter(
      (ex) => ex.trackIds && ex.trackIds.includes(trackId)
    );
    const count = trackExercises.length > 0 ? trackExercises.length : 3;
    const solved = trackExercises.filter((ex) => ex.status === 'solved').length;
    return { count, solved };
  };

  return (
    <section className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b pb-4 border-slate-200 dark:border-gray-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>HackerRank Practice Tracks</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            {t.practiceSkillsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t.practiceSkillsSub}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#1BA94C] dark:bg-[#00EA64]" />
          <span>
            {SKILL_TRACKS.length} {t.skillsAvailable}
          </span>
        </div>
      </div>

      {/* 3-COLUMN RESPONSIVE SKILLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SKILL_TRACKS.map((track: SkillTrack) => {
          const stats = getTrackStats(track.id);
          const title = currentLang === 'vie' ? track.nameVie : track.nameEng;
          const isCompleted = stats.solved > 0 && stats.solved === stats.count;

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className="group relative flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-[#121926] border border-slate-200/90 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTrack(track.id);
                }
              }}
              aria-label={`Khóa học ${title}`}
            >
              {/* TOP: ICON BADGE + COURSE TITLE */}
              <div className="flex items-start gap-3.5">
                {/* Left: Distinctive Skill Icon */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border transition-transform duration-200 group-hover:scale-105"
                  style={{
                    backgroundColor: `${track.color}15`,
                    borderColor: `${track.color}35`,
                  }}
                >
                  {renderSkillIcon(track.iconType, track.color)}
                </div>

                {/* Right: Title & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00EA64] transition-colors truncate">
                      {title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* BOTTOM: FOOTER PROGRESS & CHALLENGE COUNT */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-[#1BA94C] transition-colors" />
                  <span>
                    {stats.count} {currentLang === 'vie' ? 'bài tập' : 'challenges'}
                  </span>
                </span>

                {stats.solved > 0 && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>
                      {stats.solved}/{stats.count} {t.solvedLabel}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
