import { ArrowUpRight, CheckCircle2, Mail, Maximize2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { SOFTWARE_TOOLKIT } from '../data/projects';
import { PortfolioAsset, ResolvedAssetState } from '../types/portfolio';
import { normalizeAssetUrl } from '../utils/portfolioLogic';

interface AboutSectionProps {
  portraitAsset?: PortfolioAsset;
  cvAsset?: PortfolioAsset;
  credentials?: PortfolioAsset[];
  resolvedMap: Record<string, ResolvedAssetState>;
  onSelectAsset: (asset: PortfolioAsset) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROFILE_SKILLS = [
  'THIẾT KẾ SOCIAL',
  'THIẾT KẾ KEY VISUAL',
  'THIẾT KẾ LOGO',
  'THIẾT KẾ WEB UI/UX',
  'NGHỆ THUẬT CHỮ (TYPOGRAPHY)',
  'CHỈNH SỬA ẢNH',
  'HÌNH ẢNH QUẢNG CÁO',
  'COLOR GRADING',
  'PHOTOGRAPHY',
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  portraitAsset,
  cvAsset,
  credentials = [],
  resolvedMap,
  onSelectAsset,
}) => {
  const cvUrl =
    (cvAsset && resolvedMap[cvAsset.id]?.url) ||
    normalizeAssetUrl(cvAsset?.uploadedPath) ||
    normalizeAssetUrl('/assets/aistudio/CV_ch_nh_cd47ebdf.pdf');

  const portraitUrl =
    (portraitAsset && resolvedMap[portraitAsset.id]?.url) ||
    normalizeAssetUrl(portraitAsset?.uploadedPath) ||
    normalizeAssetUrl('/assets/portfolio/Phát1.jpg');

  // Full set of certificates in both columns (left: normal, right: reversed for visual richness)
  const leftList = useMemo(() => credentials || [], [credentials]);
  const rightList = useMemo(() => [...(credentials || [])].reverse(), [credentials]);

  const renderCertCard = (cert: PortfolioAsset, key: string) => {
    const resolved = resolvedMap[cert.id];
    const isAvailable = Boolean(resolved && resolved.source !== 'missing' && resolved.url);

    const captionParts = cert.caption.split('—');
    const displayTitle = captionParts.length > 1 ? captionParts[1].trim() : cert.caption;

    return (
      <div key={key} className="mb-3 w-full shrink-0">
        <button
          type="button"
          onClick={() => onSelectAsset(cert)}
          aria-label={`View certificate: ${cert.brand} - ${cert.caption}`}
          className="group relative h-[168px] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-[#09132E]/90 p-2 text-left shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_10px_28px_rgba(59,130,246,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA] flex flex-col justify-between"
        >
          {/* Certificate White Canvas Plate */}
          <div className="relative h-[110px] w-full overflow-hidden rounded-xl bg-white p-1.5 flex items-center justify-center shadow-inner shrink-0">
            {isAvailable && resolved?.url ? (
              <img
                src={resolved.url}
                alt={cert.caption}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[11px] font-bold text-slate-800">{cert.brand}</span>
              </div>
            )}

            <div className="card-shine-sweep" aria-hidden="true" />

            {/* Quick Expand Icon Overlay */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-[#060917]/85 text-white opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
            >
              <Maximize2 className="h-3 w-3" />
            </span>
          </div>

          {/* Certificate Brand Tag & Course Title */}
          <div className="h-[42px] px-1 flex flex-col justify-center min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] leading-none">
              {cert.brand}
            </p>
            <p className="mt-1 truncate text-[11px] font-semibold text-white/90 group-hover:text-white leading-tight">
              {displayTitle}
            </p>
          </div>
        </button>
      </div>
    );
  };

  return (
    <section
      id="about"
      className="relative scroll-mt-20 min-h-screen w-full max-w-full overflow-hidden border-b border-blue-500/25 bg-gradient-to-b from-[#08153A] via-[#0E286B] to-[#06102E] text-white flex flex-col justify-center px-3 sm:px-5 lg:px-6 xl:px-8 py-10 sm:py-14 lg:py-16"
    >
      {/* 1. Atmospheric Ambient Glow Orbs (Layered Cyan, Electric Blue & Indigo Aurora) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[850px] rounded-full bg-blue-600/30 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 h-[480px] w-[650px] rounded-full bg-sky-500/25 blur-[110px]" />
      <div className="pointer-events-none absolute top-1/3 left-4 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[100px]" />

      {/* 2. Technical Architectural Grid & Dot Crosshair Pattern */}
      <div
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-70"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 tech-cross-pattern opacity-50"
        style={{
          maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.8) 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.8) 0%, transparent 80%)',
        }}
      />

      {/* 3. Concentric Orbital Compass & Architectural Rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[880px] h-[880px] rounded-full border border-blue-400/[0.08] flex items-center justify-center animate-spin-slow">
        <div className="w-[660px] h-[660px] rounded-full border border-dashed border-sky-400/[0.12] flex items-center justify-center">
          <div className="w-[450px] h-[450px] rounded-full border border-blue-300/[0.07]" />
        </div>
      </div>

      {/* 4. Giant Typographic Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden" aria-hidden="true">
        <span className="font-editorial-display text-[16vw] font-black uppercase tracking-widest text-white/[0.022] leading-none whitespace-nowrap">
          GIA PHAT
        </span>
      </div>

      {/* 5. Floating Graphic Stars & Precision Crosshairs */}
      <span className="pointer-events-none absolute top-16 left-[22%] text-blue-400/40 text-sm animate-pulse select-none" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute bottom-20 right-[24%] text-sky-400/40 text-xs animate-pulse select-none delay-500" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute top-1/4 right-[8%] text-white/20 text-xs font-mono select-none" aria-hidden="true">+</span>
      <span className="pointer-events-none absolute bottom-1/4 left-[8%] text-white/20 text-xs font-mono select-none" aria-hidden="true">+</span>

      {/* Main Unified Dashboard Container: Left Marquee + Centered Large Profile + Right Marquee */}
      <div className="relative z-10 flex w-full max-w-[1720px] items-center justify-between gap-4 sm:gap-5 lg:gap-6 xl:gap-8 mx-auto">
        {/* Left Column: Certificates Vertical Marquee (Visible on LG/XL desktop & wide laptop) */}
        {leftList.length > 0 && (
          <div
            className="cert-vertical-container relative hidden h-[620px] lg:h-[660px] xl:h-[720px] w-[180px] lg:w-[200px] xl:w-[230px] shrink-0 overflow-hidden lg:flex flex-col py-0 rounded-2xl border border-white/10"
          >
            {/* 3 identical sets of 14 certs: seamless vertical scroll */}
            <div className="animate-cert-vertical-up flex flex-col will-change-transform">
              {leftList.map((cert) => renderCertCard(cert, `l1-${cert.id}`))}
              {leftList.map((cert) => renderCertCard(cert, `l2-${cert.id}`))}
              {leftList.map((cert) => renderCertCard(cert, `l3-${cert.id}`))}
            </div>
          </div>
        )}

        {/* Center: Extra Large, Spacious & Fully Responsive Profile Stage */}
        <div className="relative z-10 flex-1 max-w-[960px] xl:max-w-[1050px] 2xl:max-w-[1140px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="relative w-full rounded-3xl border border-white/20 bg-white/[0.06] p-5 sm:p-7 lg:p-8 xl:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.55),inset_0_1px_2px_rgba(255,255,255,0.25)] backdrop-blur-2xl ring-1 ring-white/15 my-auto"
          >
            {/* Ambient Glass Reflections & Specular Highlights */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-95" />
            <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="card-shine-sweep opacity-40 pointer-events-none" aria-hidden="true" />

            {/* Header: PROFILE */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <h2 className="font-editorial-display text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                PROFILE
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#60A5FA]" />
              </h2>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                PORTFOLIO 2026
              </span>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="relative z-10 grid grid-cols-1 items-center gap-5 sm:gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[330px_1fr] lg:gap-7 xl:gap-9">
              {/* Left Column: Avatar + Name + Title + Software Icons in 1 Single Row */}
              <div className="flex flex-col items-center text-center">
                {/* Circular Avatar */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.04 }}
                  className="relative group h-36 w-36 sm:h-44 sm:w-44 lg:h-44 lg:w-44 xl:h-52 xl:w-52 rounded-full p-[2.5px] border-[1.5px] border-blue-400/90 bg-gradient-to-tr from-[#1D4ED8] via-[#3B82F6] to-[#60A5FA] shadow-[0_0_24px_rgba(59,130,246,0.5)] cursor-pointer overflow-hidden shrink-0"
                  onClick={() => portraitAsset && onSelectAsset(portraitAsset)}
                  title="Click to view portrait"
                >
                  <div className="h-full w-full rounded-full overflow-hidden bg-[#E2DFD8] relative">
                    <img
                      src={portraitUrl}
                      alt="Văn Hữu Gia Phát"
                      className="h-full w-full object-cover origin-[center_28%] scale-[1.35] transition-transform duration-300 group-hover:scale-[1.4]"
                    />
                  </div>
                  <div className="card-shine-sweep rounded-full" aria-hidden="true" />
                </motion.div>

                {/* Name & Role */}
                <h3 className="mt-3 sm:mt-3.5 font-editorial-display text-lg sm:text-xl xl:text-2xl font-black tracking-tight text-white">
                  VĂN HỮU GIA PHÁT
                </h3>
                <p className="mt-0.5 text-[11px] sm:text-xs xl:text-[13px] font-bold uppercase tracking-wider text-[#60A5FA]">
                  THIẾT KẾ ĐỒ HỌA / UI/UX / EDITOR
                </p>

                {/* Software Toolkit: STRICTLY 1 SINGLE ROW OF ALL 6 ICONS */}
                <div className="mt-3 sm:mt-3.5 w-full border-t border-white/10 pt-2.5 sm:pt-3">
                  <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/50 block mb-2">
                    SOFTWARE
                  </span>
                  {/* Grid 6 columns with clean responsive gaps */}
                  <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-[270px] sm:max-w-[310px] mx-auto">
                    {SOFTWARE_TOOLKIT.map((tool) => {
                      const toolState = resolvedMap[tool.assetId];
                      const hasIcon = Boolean(
                        toolState && toolState.source !== 'missing' && toolState.url,
                      );

                      return (
                        <motion.div
                          key={tool.name}
                          whileHover={{ scale: 1.15, y: -2 }}
                          title={tool.name}
                          className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#0B1536]/80 p-0 shadow-md transition-all hover:border-blue-400 hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] cursor-pointer"
                        >
                          {hasIcon && toolState?.url ? (
                            <img
                              src={toolState.url}
                              alt={tool.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover rounded-xl"
                            />
                          ) : (
                            <span
                              className="text-xs sm:text-sm font-bold"
                              style={{ color: tool.accent }}
                            >
                              {tool.shortCode}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct View CV PDF Button */}
                <motion.a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View CV (PDF)"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 sm:mt-3.5 inline-flex w-full max-w-[270px] sm:max-w-[310px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] px-3.5 py-2.5 sm:py-2.5 lg:py-2.5 xl:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-blue-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
                >
                  <span>View CV</span>
                  <ArrowUpRight className="h-4 w-4" />
                </motion.a>
              </div>

              {/* Right Column: Bio Narrative, Skills Tags, Experience & Contact */}
              <div className="flex flex-col space-y-3 sm:space-y-4 text-left">
                {/* ABOUT ME narrative */}
                <div>
                  <h4 className="text-[11px] sm:text-xs xl:text-[12.5px] font-bold uppercase tracking-wider text-[#60A5FA]">
                    ABOUT ME
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-[13px] lg:text-[13.5px] xl:text-[14px] leading-relaxed text-white/90 text-justify">
                    Sinh viên năm 2 ngành Social Media tại Đại học FPT Đà Nẵng, có hơn 1 năm kinh nghiệm thực chiến về Graphic Design, Video Editing và UI/UX trong các lĩnh vực du lịch, F&amp;B, sự kiện và thương mại. Từng làm việc tại Go Media Agency, Nội Thất Gia Phong, tham gia thiết kế UI/UX website cho Trung Nguyên Legend và triển khai social post cho PongDang, Ryo Japanese, Yoshino Izakaya Shoten. Ngoài ra, tôi từng là Design Coordinator tại AIESEC và thiết kế logo cho sự kiện JCI Leadership Boost.
                  </p>
                </div>

                {/* SKILLS Tags */}
                <div>
                  <h4 className="text-[11px] sm:text-xs xl:text-[12.5px] font-bold uppercase tracking-wider text-[#60A5FA]">
                    SKILLS
                  </h4>
                  <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    {PROFILE_SKILLS.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11.5px] font-semibold text-white/90 backdrop-blur-sm transition-all duration-150 hover:border-[#60A5FA] hover:bg-blue-500/25 hover:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CONTACT & STATUS */}
                <div className="border-t border-white/10 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/50 block">
                      CONTACT
                    </span>
                    <a
                      href="mailto:vanhuugiaphat@gmail.com"
                      className="mt-0.5 inline-flex items-center gap-1.5 text-white/90 hover:text-[#60A5FA] transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#60A5FA]" />
                      <span className="font-editorial-mono text-xs sm:text-[12.5px]">vanhuugiaphat@gmail.com</span>
                    </a>
                  </div>

                  <div>
                    <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/50 block">
                      STATUS
                    </span>
                    <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs sm:text-[12.5px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      SẴN SÀNG HỢP TÁC / FREELANCE
                    </span>
                  </div>
                </div>

                {/* EXPERIENCE */}
                <div className="border-t border-white/10 pt-2.5 text-xs sm:text-[12.5px] text-white/70">
                  <span className="font-semibold text-white/90">2024 — HIỆN TẠI:</span> Thiết kế Đồ họa / UI/UX / Editor
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Certificates Vertical Marquee (Visible on LG/XL desktop & wide laptop) */}
        {rightList.length > 0 && (
          <div
            className="cert-vertical-container relative hidden h-[620px] lg:h-[660px] xl:h-[720px] w-[180px] lg:w-[200px] xl:w-[230px] shrink-0 overflow-hidden lg:flex flex-col py-0 rounded-2xl border border-white/10"
          >
            {/* 3 identical sets of 14 certs: seamless vertical scroll */}
            <div className="animate-cert-vertical-down flex flex-col will-change-transform">
              {rightList.map((cert) => renderCertCard(cert, `r1-${cert.id}`))}
              {rightList.map((cert) => renderCertCard(cert, `r2-${cert.id}`))}
              {rightList.map((cert) => renderCertCard(cert, `r3-${cert.id}`))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
