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
      className="relative hidden lg:flex flex-col justify-between w-[55%] h-full max-h-screen bg-[#02050c] text-white overflow-hidden select-none"
    >
      {/* 1. FULL-BLEED DEEP SPACE NEBULA & COSMIC DUST BACKGROUND */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none bg-gradient-to-b from-[#02050e] via-[#050c1e] to-[#020612]"
        aria-hidden="true"
      />
      
      {/* Cosmic Nebula Glow Clusters */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-emerald-500/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[#1BA94C]/15 blur-[160px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full bg-cyan-600/15 blur-[140px]"
        aria-hidden="true"
      />

      {/* 2. FULL-BLEED 3D EARTH WEBGL CANVAS (SEAMLESSLY BLENDED, ZERO BOX/BORDERS) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <InteractiveGlobe3D />
      </div>

      {/* 3. TOP BRAND HEADER: Logo chữ H xanh lá + tên dự án AI CODE MENTOR */}
      <div className="relative z-10 flex items-center gap-3 p-6 lg:p-8 xl:p-10 pointer-events-none">
        <div className="relative flex items-center pointer-events-auto">
          <div className="w-10 h-10 rounded-md bg-[#1BA94C] flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/50 transition-transform hover:scale-105">
            <span className="font-mono text-2xl tracking-tighter font-extrabold select-none">H</span>
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

      {/* 4. BOTTOM HERO CONTENT: Elevated well above bottom border with generous visual breathing space */}
      <div className="relative z-10 space-y-2.5 max-w-xl px-6 lg:px-8 xl:px-10 pb-20 sm:pb-24 xl:pb-28 mb-4 sm:mb-6 pointer-events-none">
        <div className="pointer-events-auto space-y-2.5">
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
            {t.heroTitleLine1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
              {t.heroTitleLine2}
            </span>
          </h1>

          <p className="text-slate-300/90 text-xs sm:text-sm font-normal leading-relaxed max-w-lg drop-shadow">
            {t.heroDesc}
          </p>
        </div>
      </div>
    </aside>
  );
};
