import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Language, translations } from './i18n';

interface BrandSidebarProps {
  lang: Language;
}

export const BrandSidebar: React.FC<BrandSidebarProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <aside
      aria-label="AI Code Mentor Platform Branding"
      className="relative hidden lg:flex flex-col justify-between w-[55%] h-full max-h-screen bg-slate-950 text-white overflow-hidden select-none"
    >
      {/* 1. REAL HIGH-RESOLUTION PHOTOGRAPHY BACKGROUND */}
      <img
        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85"
        alt="Night starry sky over mountain photography"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        loading="eager"
      />

      {/* 2. SMOOTH GRADIENT OVERLAYS FOR OPTIMAL READABILITY & DEPTH */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none bg-gradient-to-b from-slate-950/85 via-slate-900/40 to-slate-950/95"
        aria-hidden="true"
      />

      {/* Delicate Coordinate Grid */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden="true"
      />

      {/* Subtle Atmospheric Glow Accents */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full bg-teal-500/10 blur-[140px]"
        aria-hidden="true"
      />

      {/* 3. TOP BRAND HEADER: Logo chữ H xanh lá + tên dự án AI CODE MENTOR */}
      <div className="relative z-10 flex items-center gap-3 p-6 lg:p-8 xl:p-10 pointer-events-none">
        <div className="relative flex items-center pointer-events-auto">
          <div className="w-10 h-10 rounded-md bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/50 transition-transform hover:scale-105">
            <span className="font-sans text-2xl tracking-tighter font-extrabold select-none">H</span>
          </div>
        </div>
        <div className="flex flex-col pointer-events-auto">
          <span className="text-xl xl:text-2xl font-bold tracking-tight text-white uppercase font-sans">
            {t.brandTitle}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <SparklesIcon className="w-3.5 h-3.5 text-[#00EA64]" aria-hidden="true" />
            <span>{t.brandTag}</span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM HERO CONTENT: Elevated text with generous breathing space & perfect contrast */}
      <div className="relative z-10 space-y-3 max-w-xl px-6 lg:px-8 xl:px-10 pb-20 sm:pb-24 xl:pb-28 mb-4 sm:mb-6 pointer-events-none">
        <div className="pointer-events-auto space-y-3">
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md font-sans">
            {t.heroTitleLine1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
              {t.heroTitleLine2}
            </span>
          </h1>

          <p className="text-slate-200/90 text-xs sm:text-sm font-normal leading-relaxed max-w-lg drop-shadow">
            {t.heroDesc}
          </p>
        </div>
      </div>
    </aside>
  );
};
