import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { InteractiveGlobe3D } from './InteractiveGlobe3D';
import { Language, translations } from './i18n';

interface BrandSidebarProps {
  lang: Language;
}

export const BrandSidebar: React.FC<BrandSidebarProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <aside
      aria-label="AI Code Mentor Platform Branding"
      className="relative hidden lg:flex flex-col justify-between w-[55%] h-full max-h-screen bg-[#0b0f19] p-8 lg:p-10 xl:p-12 text-white overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-[#1BA94C]/15 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* TOP HEADER: Logo chữ H xanh lá + tên dự án AI CODE MENTOR */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="relative flex items-center">
          <div className="w-10 h-10 rounded-md bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/40">
            <span className="font-mono text-2xl tracking-tighter font-extrabold select-none">H</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl xl:text-2xl font-bold tracking-tight text-white uppercase font-sans">
            {t.brandTitle}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <SparklesIcon className="w-3.5 h-3.5 text-[#00EA64]" aria-hidden="true" />
            <span>{t.brandTag}</span>
          </div>
        </div>
      </div>

      {/* CENTER VISUAL: EXPANDED 3D ROTATING GLOBE */}
      <div className="relative z-10 my-auto py-3 xl:py-6 flex flex-col items-center justify-center">
        <InteractiveGlobe3D />
      </div>

      {/* BOTTOM HERO CONTENT: Rộng rãi, thoáng đãng trong tỉ lệ 60% */}
      <div className="relative z-10 space-y-2 max-w-xl pb-2">
        <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white tracking-tight leading-[1.25]">
          {t.heroTitleLine1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
            {t.heroTitleLine2}
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm font-normal leading-relaxed max-w-lg">
          {t.heroDesc}
        </p>
      </div>
    </aside>
  );
};
