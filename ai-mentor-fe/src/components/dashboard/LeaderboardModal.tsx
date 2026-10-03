import React from 'react';
import { Language, dashboardTranslations } from './dashboardI18n';
import { Trophy, X, Flame, CheckCircle2 } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

interface LeaderboardStudent {
  rank: number;
  name: string;
  avatar: string;
  classGroup: string;
  solvedCount: number;
  score: number;
  streak: number;
  isCurrentUser?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  if (!isOpen) return null;
  const t = dashboardTranslations[currentLang];

  const students: LeaderboardStudent[] = [
    { rank: 1, name: 'Trần Quang Huy', avatar: 'H', classGroup: 'K72 CNTT A', solvedCount: 58, score: 2840, streak: 14 },
    { rank: 2, name: 'Lê Hoàng Long', avatar: 'L', classGroup: 'K72 CNTT A', solvedCount: 52, score: 2590, streak: 12 },
    { rank: 3, name: 'Phạm Thu Trang', avatar: 'T', classGroup: 'K72 CNTT B', solvedCount: 47, score: 2310, streak: 9 },
    { rank: 4, name: 'Nguyễn Văn Minh (Bạn)', avatar: 'M', classGroup: 'K72 CNTT A', solvedCount: 18, score: 1450, streak: 5, isCurrentUser: true },
    { rank: 5, name: 'Đỗ Minh Đức', avatar: 'D', classGroup: 'K72 CNTT A', solvedCount: 16, score: 1200, streak: 4 },
    { rank: 6, name: 'Vũ Thị Mai', avatar: 'M', classGroup: 'K72 CNTT B', solvedCount: 14, score: 1050, streak: 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-scaleUp">
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-gray-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.leaderboardTitle}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/40">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.leaderboardSub}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="p-5 sm:p-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-gray-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 pl-2 w-16">{t.rankCol}</th>
                <th className="pb-3">{t.studentCol}</th>
                <th className="pb-3 text-center">{t.solvedCol}</th>
                <th className="pb-3 text-center">{t.scoreCol}</th>
                <th className="pb-3 text-right pr-2">{t.streakCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60">
              {students.map((student) => {
                const isTop1 = student.rank === 1;
                const isTop2 = student.rank === 2;
                const isTop3 = student.rank === 3;

                return (
                  <tr
                    key={student.rank}
                    className={`transition-colors ${
                      student.isCurrentUser
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* RANK */}
                    <td className="py-3 pl-2">
                      {isTop1 ? (
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-extrabold flex items-center justify-center text-[11px] shadow-sm">
                          1
                        </div>
                      ) : isTop2 ? (
                        <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-500 text-slate-900 font-extrabold flex items-center justify-center text-[11px] shadow-sm">
                          2
                        </div>
                      ) : isTop3 ? (
                        <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold flex items-center justify-center text-[11px] shadow-sm">
                          3
                        </div>
                      ) : (
                        <span className="text-slate-500 pl-1.5 font-mono">{student.rank}</span>
                      )}
                    </td>

                    {/* STUDENT NAME & CLASS */}
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                            student.isCurrentUser
                              ? 'bg-[#1BA94C]'
                              : isTop1
                              ? 'bg-amber-500'
                              : 'bg-slate-500'
                          }`}
                        >
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900 dark:text-white font-semibold">
                              {student.name}
                            </span>
                            {student.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-[#1BA94C] dark:text-[#00EA64]">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {student.classGroup}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SOLVED COUNT */}
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{student.solvedCount}</span>
                      </span>
                    </td>

                    {/* SCORE */}
                    <td className="py-3 text-center">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {student.score}
                      </span>
                    </td>

                    {/* STREAK */}
                    <td className="py-3 text-right pr-2">
                      <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{student.streak}d</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-[#0e141f] border-t border-slate-100 dark:border-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
