import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface OpeningCoverProps {
  isMuted?: boolean;
  onToggleAudio?: () => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const OpeningCover: React.FC<OpeningCoverProps> = () => {
  return (
    <section
      id="design"
      data-section="cover"
      className="relative scroll-mt-20 w-full max-w-full overflow-x-hidden border-b border-white/12 bg-transparent text-white"
    >
      {/* Floating Design Sparkles */}
      <span className="pointer-events-none absolute top-20 left-[12%] text-blue-400/40 text-base animate-pulse select-none" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute bottom-24 right-[14%] text-sky-400/40 text-xs animate-pulse select-none delay-700" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute top-1/3 right-[6%] text-white/25 text-xs font-mono select-none" aria-hidden="true">+</span>
      <span className="pointer-events-none absolute bottom-1/3 left-[6%] text-white/25 text-xs font-mono select-none" aria-hidden="true">+</span>

      <div className="relative mx-auto flex min-h-[calc(100vh-61px)] max-w-[1440px] flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-12">
        {/* Centered Full-Bleed Monumental Title Stage Directly Over Intro Video */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="flex w-full max-w-full flex-col items-center px-2 text-center"
        >
          <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.22em] text-white/85">
            <span className="font-editorial-mono text-[#93C5FD]">Graphic Design</span>
            <span className="h-px w-6 sm:w-10 bg-white/40" aria-hidden="true" />
            <span>Brand Identity / Key Visual / Digital</span>
          </div>

          <h1 className="max-w-full font-editorial-display text-[clamp(2.1rem,10.2vw,8.5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em] text-white drop-shadow-[0_14px_42px_rgba(0,0,0,0.65)] select-none">
            PORTFOLIO
          </h1>

          <p className="mt-4 sm:mt-5 font-editorial-display text-[11px] sm:text-sm font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.26em] text-white drop-shadow-[0_2px_10px_rgba(6,9,23,0.9)]">
            GRAPHIC DESIGN PORTFOLIO 2026
          </p>

          <p className="mt-2.5 sm:mt-3 font-editorial-display text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(6,9,23,0.85)]">
            Văn Hữu Gia Phát
          </p>

          <p className="mt-2 max-w-lg text-xs sm:text-sm md:text-base font-medium text-white/85 drop-shadow-[0_2px_12px_rgba(6,9,23,0.9)]">
            BEYOND THE VISUAL <span aria-hidden="true">·</span> Designed to make an impact
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#works"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.42)] transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA] whitespace-nowrap shrink-0"
            >
              <span>View Projects</span>
              <ArrowDown className="h-4 w-4" />
            </a>

            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-[#060917]/55 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-150 hover:border-white/50 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap shrink-0"
            >
              <span>About Me</span>
              <ArrowUpRight className="h-4 w-4 text-[#93C5FD]" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
