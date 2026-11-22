import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      className={`group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center gap-2 rounded-full border border-blue-400/40 bg-[#0B1120]/90 p-2.5 sm:px-4 sm:py-2.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-[#1E293B]/95 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-4 w-4 sm:h-4 sm:w-4 text-[#60A5FA] transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="hidden sm:inline font-editorial-sans text-xs font-bold uppercase tracking-wider text-white">
        Back to Top
      </span>
    </button>
  );
};
