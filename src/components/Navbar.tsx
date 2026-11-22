import React, { useEffect, useState } from 'react';
import { normalizeAssetUrl } from '../utils/portfolioLogic';

export type PortfolioTrack = 'design' | 'media';

interface NavbarProps {
  activeTrack: PortfolioTrack;
  onSelectTrack: (track: PortfolioTrack) => void;
  onOpenAssetDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTrack,
  onSelectTrack,
}) => {
  const [activeNav, setActiveNav] = useState<'profile' | 'partners' | 'design' | 'media'>('design');

  // Synchronize only when track switches externally (no scroll hijacking)
  useEffect(() => {
    if (activeTrack === 'media') {
      setActiveNav('media');
    } else if (activeNav === 'media') {
      setActiveNav('design');
    }
  }, [activeTrack]);

  // Helper to reliably scroll to target element even during track switching re-renders
  const scrollToTarget = (id: string, offset = 74) => {
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
        window.scrollTo({ top, behavior: 'smooth' });
        return true;
      }
      return false;
    };

    if (!tryScroll()) {
      const timer = setInterval(() => {
        attempts++;
        if (tryScroll() || attempts > 15) {
          clearInterval(timer);
        }
      }, 30);
    }
  };

  const handleNavProfile = () => {
    setActiveNav('profile');
    if (activeTrack !== 'design') {
      onSelectTrack('design');
    }
    scrollToTarget('about', 74);
  };

  const handleNavPartners = () => {
    setActiveNav('partners');
    if (activeTrack !== 'design') {
      onSelectTrack('design');
    }
    scrollToTarget('works', 74);
  };

  const handleNavDesign = () => {
    setActiveNav('design');
    if (activeTrack !== 'design') {
      onSelectTrack('design');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavMedia = () => {
    setActiveNav('media');
    if (activeTrack !== 'media') {
      onSelectTrack('media');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full border-b border-white/12 backdrop-blur-2xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)]"
      style={{
        background:
          'linear-gradient(180deg, rgba(6, 9, 23, 0.88) 0%, rgba(8, 15, 38, 0.82) 100%)',
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6 py-2 sm:py-3 lg:px-12">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('design');
            if (activeTrack !== 'design') {
              onSelectTrack('design');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Gia Phát — Home"
          className="group flex cursor-pointer items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6]"
        >
          <img
            src={normalizeAssetUrl('/assets/aistudio/logo_gphat.png')}
            alt="Gphat"
            className="h-6 sm:h-8 md:h-10 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-[1.04]"
          />
        </button>

        {/* Primary Navigation Bar: Design, Media, Profile, Brand & Partners */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 text-[10.5px] sm:text-xs md:text-sm lg:text-[14px] font-bold shrink min-w-0"
        >
          {/* 1. Design */}
          <button
            type="button"
            onClick={handleNavDesign}
            aria-current={activeNav === 'design' ? 'page' : undefined}
            className={`relative cursor-pointer px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap shrink-0 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6] ${
              activeNav === 'design'
                ? 'text-white bg-white/20 border border-white/35 backdrop-blur-md shadow-[0_2px_12px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.4)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                : 'text-white/75 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            }`}
          >
            <span>Design</span>
          </button>

          {/* 2. Media */}
          <button
            type="button"
            onClick={handleNavMedia}
            aria-current={activeNav === 'media' ? 'page' : undefined}
            className={`relative cursor-pointer px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap shrink-0 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6] ${
              activeNav === 'media'
                ? 'text-white bg-white/20 border border-white/35 backdrop-blur-md shadow-[0_2px_12px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.4)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                : 'text-white/75 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            }`}
          >
            <span>Media</span>
          </button>

          {/* 3. Profile */}
          <button
            type="button"
            onClick={handleNavProfile}
            aria-current={activeNav === 'profile' ? 'page' : undefined}
            className={`relative cursor-pointer px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap shrink-0 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6] ${
              activeNav === 'profile'
                ? 'text-white bg-white/20 border border-white/35 backdrop-blur-md shadow-[0_2px_12px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.4)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                : 'text-white/75 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            }`}
          >
            <span>Profile</span>
          </button>

          {/* 4. Brand & Partners */}
          <button
            type="button"
            onClick={handleNavPartners}
            aria-current={activeNav === 'partners' ? 'page' : undefined}
            className={`relative cursor-pointer px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap shrink-0 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B82F6] ${
              activeNav === 'partners'
                ? 'text-white bg-white/20 border border-white/35 backdrop-blur-md shadow-[0_2px_12px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.4)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                : 'text-white/75 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            }`}
          >
            <span><span className="hidden sm:inline">Brand &amp; </span>Partners</span>
          </button>
        </nav>

        {/* Right Corner Facebook Contact Button */}
        <div className="flex items-center shrink-0">
          <a
            href="https://www.facebook.com/giaphat.vanhuu.7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via Facebook — Văn Hữu Gia Phát"
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] p-2 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-white shadow-lg shadow-blue-500/35 transition-all duration-150 hover:from-[#3B82F6] hover:to-[#2563EB] hover:shadow-blue-500/55 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA] active:scale-[0.98] border border-white/25 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          >
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="hidden sm:inline">Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
};
