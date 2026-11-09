import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../dashboard/dashboardI18n';

export interface BackToTopButtonProps {
  currentLang?: Language;
  position?: 'above-chat' | 'bottom-right';
  scrollThreshold?: number;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  currentLang = 'vie',
  position = 'bottom-right',
  scrollThreshold = 350,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isVie = currentLang === 'vie';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const posClass = position === 'above-chat' ? 'bottom-24' : 'bottom-6';

  return (
    <div
      className={`fixed right-6 ${posClass} z-40 select-none group transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={isVie ? 'Lên đầu trang' : 'Back to top'}
        className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-500 border border-slate-700/60 shadow-lg flex items-center justify-center transition-all cursor-pointer focus:outline-none"
      >
        <ArrowUp className="w-5 h-5 shrink-0" />
      </button>

      {/* Floating Tooltip to the left */}
      <div className="hidden group-hover:flex items-center absolute right-full top-1/2 -translate-y-1/2 mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50">
        {isVie ? 'Lên đầu trang' : 'Back to top'}
      </div>
    </div>
  );
};

