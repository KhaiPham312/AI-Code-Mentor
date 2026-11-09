import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Language, dashboardTranslations } from './dashboardI18n';
import {
  Layers,
  Cpu,
  Award,
  Binary,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { COMPREHENSIVE_EXERCISES } from '../../services/mockExercisesData';
import { getUserSolvedExerciseIds, getUserStorageKey } from '../../services/userStorage';

interface SkillPreparationKitsProps {
  currentLang: Language;
  onSelectKit: (kitId: string) => void;
}

export const SkillPreparationKits: React.FC<SkillPreparationKitsProps> = ({
  currentLang,
  onSelectKit,
}) => {
  const t = dashboardTranslations[currentLang];

  const getKitStats = (trackIds: string[]) => {
    const matchedExercises = COMPREHENSIVE_EXERCISES.filter(
      (ex) => ex.trackIds && ex.trackIds.some((t) => trackIds.includes(t))
    );
    const total = matchedExercises.length;
    let solved = 0;
    if (typeof window !== 'undefined') {
      const userKey = getUserStorageKey();
      const solvedIds = getUserSolvedExerciseIds(userKey);
      solved = matchedExercises.filter((ex) => solvedIds.includes(ex.id)).length;
    }
    const hasRealProgress = solved > 0;
    const progressPercent = total > 0 ? Math.round((solved / total) * 100) : 0;
    return {
      total,
      solved,
      hasRealProgress,
      progressPercent,
    };
  };

  const allKits = useMemo(() => {
    const dsaStats = getKitStats(['data-structures', 'algorithms']);
    const oopStats = getKitStats(['python']);
    const cppStats = getKitStats(['c', 'cpp']);
    const sqlStats = getKitStats(['sql']);
    const examStats = getKitStats(['algorithms']);

    return [
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
        progress: dsaStats.progressPercent,
        progressLabel: dsaStats.hasRealProgress
          ? currentLang === 'vie'
            ? `${dsaStats.solved} / ${dsaStats.total} bài hoàn thành`
            : `${dsaStats.solved} / ${dsaStats.total} completed`
          : currentLang === 'vie'
          ? `${dsaStats.total} bài tập`
          : `${dsaStats.total} exercises`,
        hasRealProgress: dsaStats.hasRealProgress,
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
        progress: oopStats.progressPercent,
        progressLabel: oopStats.hasRealProgress
          ? currentLang === 'vie'
            ? `${oopStats.solved} / ${oopStats.total} bài hoàn thành`
            : `${oopStats.solved} / ${oopStats.total} completed`
          : currentLang === 'vie'
          ? `${oopStats.total} bài tập`
          : `${oopStats.total} exercises`,
        hasRealProgress: oopStats.hasRealProgress,
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
        progress: cppStats.progressPercent,
        progressLabel: cppStats.hasRealProgress
          ? currentLang === 'vie'
            ? `${cppStats.solved} / ${cppStats.total} bài hoàn thành`
            : `${cppStats.solved} / ${cppStats.total} completed`
          : currentLang === 'vie'
          ? `${cppStats.total} bài tập`
          : `${cppStats.total} exercises`,
        hasRealProgress: cppStats.hasRealProgress,
        icon: Binary,
        color: 'indigo',
        trackId: 'cpp',
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
        progress: sqlStats.progressPercent,
        progressLabel: sqlStats.hasRealProgress
          ? currentLang === 'vie'
            ? `${sqlStats.solved} / ${sqlStats.total} bài hoàn thành`
            : `${sqlStats.solved} / ${sqlStats.total} completed`
          : currentLang === 'vie'
          ? `${sqlStats.total} bài tập`
          : `${sqlStats.total} exercises`,
        hasRealProgress: sqlStats.hasRealProgress,
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
        progress: examStats.progressPercent,
        progressLabel: examStats.hasRealProgress
          ? currentLang === 'vie'
            ? `${examStats.solved} / ${examStats.total} bài hoàn thành`
            : `${examStats.solved} / ${examStats.total} completed`
          : currentLang === 'vie'
          ? `${examStats.total} bài tập`
          : `${examStats.total} exercises`,
        hasRealProgress: examStats.hasRealProgress,
        icon: Award,
        color: 'purple',
        trackId: 'algorithms',
      },
    ];
  }, [currentLang]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollBounds = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollBounds();
    const handleResize = () => checkScrollBounds();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollBounds]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollDistance = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });
      setTimeout(checkScrollBounds, 350);
    }
  };

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
      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-gray-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {t.kitsSectionTitle}
          </h2>
        </div>
      </div>

      {/* CAROUSEL WITH PREVIOUS / NEXT CONTROLS */}
      <div className="relative group/carousel">
        {/* Previous (<) Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label={currentLang === 'vie' ? 'Lộ trình trước' : 'Previous tracks'}
          className={`absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-500 shadow-md flex items-center justify-center transition-all cursor-pointer ${
            !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-105'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollBounds}
          className="flex items-stretch gap-5 overflow-x-auto scroll-smooth py-1 px-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allKits.map((kit) => {
            const Icon = kit.icon;
            const colors = getColorClasses(kit.color);

            return (
              <div
                key={kit.id}
                onClick={() => onSelectKit(kit.id)}
                className="w-[320px] sm:w-[350px] lg:w-[380px] shrink-0 h-24 px-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer select-none group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectKit(kit.id);
                  }
                }}
                aria-label={kit.title}
              >
                {/* Left: Enlarged Kit Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${colors.icon}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Right: Full Kit Name (1-2 lines, 0 truncation) */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-[#00EA64] transition-colors leading-snug font-sans">
                    {kit.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next (>) Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label={currentLang === 'vie' ? 'Lộ trình tiếp theo' : 'Next tracks'}
          className={`absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-500 shadow-md flex items-center justify-center transition-all cursor-pointer ${
            !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-105'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
