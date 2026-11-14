import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useMemo, useState } from 'react';
import { PARTNER_LOGOS } from '../data/projects';
import { PartnerLogo, ProjectCaseStudy, ProjectCategory } from '../types/portfolio';

interface SelectedWorksIntroProps {
  projects: ProjectCaseStudy[];
  selectedCategory?: ProjectCategory | 'All';
  onSelectCategory?: (category: ProjectCategory | 'All') => void;
  onSelectTrack?: (track: 'design' | 'media') => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SelectedWorksIntro: React.FC<SelectedWorksIntroProps> = ({
  projects,
  selectedCategory,
  onSelectCategory,
  onSelectTrack,
}) => {
  const [hoveredPartnerId, setHoveredPartnerId] = useState<string | null>(null);

  const rowOnePartners = useMemo(() => PARTNER_LOGOS.slice(0, 5), []);
  const rowTwoPartners = useMemo(() => PARTNER_LOGOS.slice(5), []);

  const rowOneLoop = useMemo(
    () => [...rowOnePartners, ...rowOnePartners, ...rowOnePartners, ...rowOnePartners],
    [rowOnePartners],
  );
  const rowTwoLoop = useMemo(
    () => [...rowTwoPartners, ...rowTwoPartners, ...rowTwoPartners, ...rowTwoPartners],
    [rowTwoPartners],
  );

  const handlePartnerJump = (partner: PartnerLogo) => {
    if (partner.targetProjectId === 'motion-cultural-recap') {
      if (onSelectTrack) {
        onSelectTrack('media');
        window.setTimeout(() => {
          const mediaEl =
            document.getElementById('media-video-edit') ||
            document.getElementById('media');
          if (mediaEl) {
            const rect = mediaEl.getBoundingClientRect();
            const top = rect.top + window.scrollY - 76;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 100);
      }
      return;
    }

    const isCurrentlyVisible = projects.some(
      (p) => p.id === partner.targetProjectId,
    );
    if (!isCurrentlyVisible && onSelectCategory) {
      onSelectCategory('All');
    }

    const scrollToTarget = () => {
      const target = document.getElementById(`project-${partner.targetProjectId}`);
      if (target) {
        const rect = target.getBoundingClientRect();
        const top = rect.top + window.scrollY - 76;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    if (!isCurrentlyVisible) {
      window.setTimeout(scrollToTarget, 100);
    } else {
      scrollToTarget();
    }
  };

  const renderPartnerTile = (
    partner: PartnerLogo,
    keyPrefix: string,
    index: number,
  ) => {
    const isHovered = hoveredPartnerId === partner.id;

    return (
      <button
        key={`${keyPrefix}-${partner.id}-${index}`}
        type="button"
        onClick={() => handlePartnerJump(partner)}
        onMouseEnter={() => setHoveredPartnerId(partner.id)}
        onFocus={() => setHoveredPartnerId(partner.id)}
        aria-label={`Jump to ${partner.name} case study`}
        className={`group relative flex h-32 w-[210px] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-44 sm:w-[290px] sm:rounded-2xl sm:p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] ${
          isHovered
            ? '-translate-y-1 border-[#3B82F6]/70 shadow-[0_14px_34px_rgba(37,99,235,0.22)]'
            : partner.isLightSurface
              ? 'border-white/20 hover:-translate-y-1 hover:border-[#3B82F6]/60'
              : 'border-white/15 hover:-translate-y-1 hover:border-[#3B82F6]/60'
        }`}
        style={{ backgroundColor: partner.cardBg }}
      >
        <div className="flex h-20 w-full items-center justify-center sm:h-30">
          <img
            src={partner.logoPath}
            alt={partner.name}
            referrerPolicy="no-referrer"
            loading="eager"
            className="max-h-full max-w-[92%] object-contain transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
        </div>

        <div
          className={`flex items-center justify-between gap-2 border-t pt-2 text-[10px] sm:text-[11px] font-semibold tracking-tight ${
            partner.isLightSurface
              ? 'border-[#0B1024]/10 text-[#0B1024]/85'
              : 'border-white/14 text-white/90'
          }`}
        >
          <span className="truncate">{partner.name}</span>
          <ArrowUpRight
            aria-hidden="true"
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
              partner.isLightSurface ? 'text-[#2563EB]' : 'text-[#60A5FA]'
            }`}
          />
        </div>
      </button>
    );
  };

  return (
    <section
      id="works"
      data-testid="brands-partners-section"
      className="relative scroll-mt-20 w-full max-w-full overflow-hidden border-b border-blue-400/25 bg-gradient-to-b from-[#122254] via-[#1A2E70] to-[#101E4A] text-white py-12 sm:py-16 lg:py-20"
    >
      {/* Ambient Lighting Orbs for Brighter Atmospheric Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-blue-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-sky-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-[100px]" />

      {/* Technical Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-50"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 75%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 75%, transparent 100%)',
        }}
      />

      {/* Centered Header Container */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="text-center"
        >
          <h2 className="font-editorial-display text-3xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
            BRANDS &amp; <span className="text-[#3B82F6]">PARTNERS.</span>
          </h2>
          <p className="mx-auto mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-base text-white/65">
            A showcase of brands, businesses, and partners I’ve had the pleasure of collaborating with on design, media, and digital projects.
          </p>
        </motion.div>
      </div>

      {/* 100% Full-Bleed Edge-to-Edge Marquee: Runs completely across the entire display width */}
      <div className="partner-marquee-container relative w-full max-w-full space-y-4 sm:space-y-6 overflow-hidden">
        <div className="animate-partner-marquee gap-4 sm:gap-5 py-1">
          {rowOneLoop.map((partner, index) =>
            renderPartnerTile(partner, 'row1', index),
          )}
        </div>

        <div className="animate-partner-marquee-reverse gap-4 sm:gap-5 py-1">
          {rowTwoLoop.map((partner, index) =>
            renderPartnerTile(partner, 'row2', index),
          )}
        </div>
      </div>
    </section>
  );
};
