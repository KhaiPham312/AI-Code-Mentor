import React, { useState, useRef, useEffect } from 'react';
import { Language, dashboardTranslations } from './dashboardI18n';
import {
  ArrowRight,
  Layers,
  Cpu,
  Award,
  Binary,
  Globe,
  Database,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';

interface SkillPreparationKitsProps {
  currentLang: Language;
  onSelectKit: (kitId: string) => void;
}

export const SkillPreparationKits: React.FC<SkillPreparationKitsProps> = ({
  currentLang,
  onSelectKit,
}) => {
  const t = dashboardTranslations[currentLang];
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allKits = [
    {
      id: 'dsa',
      title:
        currentLang === 'vie'
          ? 'Cấu trúc dữ liệu & Giải thuật'
          : 'Data Structures & Algorithms',
      desc:
        currentLang === 'vie'
          ? 'Nắm vững mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây nhị phân, đồ thị và các giải thuật tìm kiếm, sắp xếp tối ưu.'
          : 'Master arrays, linked lists, stacks, queues, binary trees, graph algorithms, searching and sorting.',
      tags: ['Python', 'C++', 'Java', 'Big-O'],
      level: currentLang === 'vie' ? 'Cơ bản đến Nâng cao' : 'Beginner to Advanced',
      progress: 65,
      progressLabel: currentLang === 'vie' ? '26 / 40 bài hoàn thành' : '26 / 40 completed',
      icon: Layers,
      color: 'emerald',
      trackId: 'data-structures',
    },
    {
      id: 'oop',
      title:
        currentLang === 'vie'
          ? 'Lập trình Hướng đối tượng & Python nâng cao'
          : 'OOP & Advanced Python',
      desc:
        currentLang === 'vie'
          ? 'Kỹ thuật kế thừa, đa hình, đóng gói, đệ quy nâng cao, Generator, Decorator và phân tích độ phức tạp thời gian Big-O.'
          : 'Inheritance, polymorphism, encapsulation, advanced recursion, generators, decorators & complexity analysis.',
      tags: ['Python 3', 'OOP', 'Recursion'],
      level: currentLang === 'vie' ? 'Trung cấp' : 'Intermediate',
      progress: 35,
      progressLabel: currentLang === 'vie' ? '7 / 20 bài hoàn thành' : '7 / 20 completed',
      icon: Cpu,
      color: 'blue',
      trackId: 'python',
    },
    {
      id: 'cpp-core',
      title:
        currentLang === 'vie'
          ? 'Lập trình C / C++ chuyên sâu'
          : 'Advanced C / C++ Systems',
      desc:
        currentLang === 'vie'
          ? 'Con trỏ bộ nhớ, quản lý cấp phát động heap/stack, STL containers, generic templates và con trỏ thông minh.'
          : 'Pointer arithmetic, dynamic memory allocation, STL algorithms, templates & smart pointers.',
      tags: ['C', 'C++ 17', 'Pointers', 'STL'],
      level: currentLang === 'vie' ? 'Trung cấp đến Nâng cao' : 'Intermediate to Advanced',
      progress: 40,
      progressLabel: currentLang === 'vie' ? '8 / 20 bài hoàn thành' : '8 / 20 completed',
      icon: Binary,
      color: 'indigo',
      trackId: 'cpp',
    },
    {
      id: 'fullstack',
      title:
        currentLang === 'vie'
          ? 'Lập trình Web Fullstack với React & Node.js'
          : 'Fullstack Web with React & Node.js',
      desc:
        currentLang === 'vie'
          ? 'Xây dựng giao diện Single Page App hiện đại với React Hooks, TypeScript, Tailwind và kết nối API xử lý dữ liệu.'
          : 'Modern single-page applications with React Hooks, TypeScript, state management & REST APIs.',
      tags: ['React', 'TypeScript', 'Node.js', 'REST API'],
      level: currentLang === 'vie' ? 'Trung cấp' : 'Intermediate',
      progress: 50,
      progressLabel: currentLang === 'vie' ? '10 / 20 bài hoàn thành' : '10 / 20 completed',
      icon: Globe,
      color: 'cyan',
      trackId: 'react',
    },
    {
      id: 'sql-db',
      title:
        currentLang === 'vie'
          ? 'Cơ sở dữ liệu SQL & Thiết kế hệ thống'
          : 'SQL Databases & System Design',
      desc:
        currentLang === 'vie'
          ? 'Truy vấn SELECT JOIN nhiều bảng, GROUP BY, Aggregate functions, Indexing và thiết kế chuẩn hóa lược đồ ERD.'
          : 'Complex multi-table JOINs, aggregations, window functions, indexing & ERD normalization.',
      tags: ['PostgreSQL', 'MySQL', 'ERD', 'Indexing'],
      level: currentLang === 'vie' ? 'Cơ bản đến Trung cấp' : 'Beginner to Intermediate',
      progress: 60,
      progressLabel: currentLang === 'vie' ? '12 / 20 bài hoàn thành' : '12 / 20 completed',
      icon: Database,
      color: 'amber',
      trackId: 'sql',
    },
    {
      id: 'exam',
      title:
        currentLang === 'vie'
          ? 'Luyện phỏng vấn & Chấm thi thực hành HNUE'
          : 'HNUE Assessment & Mock Interview',
      desc:
        currentLang === 'vie'
          ? 'Lộ trình bài tập mô phỏng kỳ thi đánh giá năng lực lập trình HNUE với thời gian thực và test cases ẩn nghiêm ngặt.'
          : 'Simulated examination track with strict time constraints, hidden edge cases & automated evaluation.',
      tags: ['Mô phỏng kỳ thi', 'Chấm tự động', 'Hidden Tests'],
      level: currentLang === 'vie' ? 'Nâng cao' : 'Advanced',
      progress: 20,
      progressLabel: currentLang === 'vie' ? '2 / 10 đề hoàn thành' : '2 / 10 completed',
      icon: Award,
      color: 'purple',
      trackId: 'algorithms',
    },
  ];

  // Animate newly revealed cards with GSAP
  useEffect(() => {
    if (isExpanded && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [isExpanded]);

  const displayedKits = isExpanded ? allKits : allKits.slice(0, 3);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          icon: 'bg-emerald-500/10 text-[#1BA94C] dark:text-[#00EA64] border-emerald-500/20',
          bar: 'bg-[#1BA94C] dark:bg-[#00EA64]',
          hoverBorder: 'hover:border-emerald-500/50',
        };
      case 'blue':
        return {
          icon: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          bar: 'bg-blue-500',
          hoverBorder: 'hover:border-blue-500/50',
        };
      case 'indigo':
        return {
          icon: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
          bar: 'bg-indigo-500',
          hoverBorder: 'hover:border-indigo-500/50',
        };
      case 'cyan':
        return {
          icon: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
          bar: 'bg-cyan-500',
          hoverBorder: 'hover:border-cyan-500/50',
        };
      case 'amber':
        return {
          icon: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          bar: 'bg-amber-500',
          hoverBorder: 'hover:border-amber-500/50',
        };
      case 'purple':
      default:
        return {
          icon: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
          bar: 'bg-purple-500',
          hoverBorder: 'hover:border-purple-500/50',
        };
    }
  };

  return (
    <section className="space-y-4">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-3 border-slate-200 dark:border-gray-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-[#1BA94C] dark:text-[#00EA64] border border-emerald-200 dark:border-emerald-800/50 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Preparation Tracks</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {t.kitsSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            {t.kitsSectionSub}
          </p>
        </div>

        {/* View All Tracks Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#1BA94C] dark:text-[#00EA64] hover:underline flex items-center gap-1 self-start sm:self-auto py-1 px-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
        >
          <span>
            {isExpanded
              ? currentLang === 'vie'
                ? 'Thu gọn (3 lộ trình)'
                : 'Collapse (3 tracks)'
              : currentLang === 'vie'
              ? 'Xem tất cả 6 lộ trình'
              : 'View all 6 tracks'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* 3-COLUMN RESPONSIVE KITS GRID */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedKits.map((kit) => {
          const Icon = kit.icon;
          const colors = getColorClasses(kit.color);

          return (
            <div
              key={kit.id}
              onClick={() => onSelectKit(kit.id)}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${colors.hoverBorder}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectKit(kit.id);
                }
              }}
            >
              <div>
                {/* CARD TOP: ICON & LEVEL BADGE */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors.icon}`}
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
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                    {kit.progressLabel}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                    style={{ width: `${kit.progress}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectKit(kit.id);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-[#1BA94C] hover:text-white dark:bg-slate-800 dark:hover:bg-[#1BA94C] text-slate-700 dark:text-slate-200 transition-all duration-150"
                >
                  <span>{currentLang === 'vie' ? 'Tiếp tục học lộ trình' : 'Continue Track'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
