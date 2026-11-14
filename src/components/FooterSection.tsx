import { ArrowUp, ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { PortfolioTrack } from './Navbar';

interface FooterSectionProps {
  onSelectTrack: (track: PortfolioTrack) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onSelectTrack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('vanhuugiaphat@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="closing"
      className="relative w-full max-w-full overflow-hidden border-t border-blue-500/25 bg-gradient-to-b from-[#08153A] via-[#0B1A48] to-[#04091A] text-white py-16 sm:py-20 lg:py-24"
    >
      {/* Ambient Lighting Orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-sky-500/15 blur-[120px]" />

      {/* Subtle Technical Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-[#93C5FD] backdrop-blur-sm mb-6 sm:mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>SẴN SÀNG HỢP TÁC / FREELANCE &amp; FULL-TIME</span>
        </div>

        {/* Monumental THANKS FOR WATCHING Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="font-editorial-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            THANKS FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-[#93C5FD]">WATCHING!</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/75 max-w-2xl mx-auto font-medium leading-relaxed">
            Cảm ơn bạn đã dành thời gian theo dõi các dự án của tôi. Nếu bạn có ý tưởng hoặc dự án cần hiện thực hóa, hãy kết nối nhé!
          </p>
        </motion.div>

        {/* Action / Contact Hub */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="https://www.facebook.com/giaphat.vanhuu.7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via Facebook — Văn Hữu Gia Phát"
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/20 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold tracking-wider uppercase text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA] active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 fill-current shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Contact</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.14] px-5 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white/90 hover:text-white backdrop-blur-md transition-all hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
            title="Sao chép địa chỉ email"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-blue-400" />
                <span>vanhuugiaphat@gmail.com</span>
              </>
            )}
          </button>
        </div>

        {/* Divider & Lower Footer Metadata */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-white/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-bold text-white tracking-wide">VĂN HỮU GIA PHÁT</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span>Graphic Designer / UI/UX / Editor</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button
              type="button"
              onClick={() => onSelectTrack('design')}
              className="cursor-pointer transition-colors hover:text-[#60A5FA]"
            >
              Design Works
            </button>
            <button
              type="button"
              onClick={() => onSelectTrack('media')}
              className="cursor-pointer transition-colors hover:text-[#60A5FA]"
            >
              Media &amp; Reels
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 cursor-pointer transition-colors hover:text-[#60A5FA]"
            >
              <span>Lên đầu trang</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-white/40 font-editorial-mono">
          © 2026 VĂN HỮU GIA PHÁT · ALL RIGHTS RESERVED · PORTFOLIO
        </p>
      </div>
    </footer>
  );
};
