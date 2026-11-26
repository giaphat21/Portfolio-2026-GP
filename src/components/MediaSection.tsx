import { motion } from 'motion/react';
import React, { useMemo, useState } from 'react';
import { PortfolioAsset, ProjectCaseStudy, ResolvedAssetState } from '../types/portfolio';
import { ArtworkFrame } from './ArtworkFrame';

interface MediaSectionProps {
  introProject?: ProjectCaseStudy;
  videoProject: ProjectCaseStudy;
  photographyProjects: ProjectCaseStudy[];
  assetsById: Map<string, PortfolioAsset>;
  resolvedMap: Record<string, ResolvedAssetState>;
  onSelectAsset: (asset: PortfolioAsset) => void;
}

type MediaDisciplineFilter = 'all' | 'video' | 'photography';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const MediaSection: React.FC<MediaSectionProps> = ({
  introProject,
  videoProject,
  photographyProjects,
  assetsById,
  resolvedMap,
  onSelectAsset,
}) => {
  const [discipline, setDiscipline] = useState<MediaDisciplineFilter>('all');

  const introVideos = useMemo(
    () =>
      (introProject?.assetIds ?? [])
        .map((id) => assetsById.get(id))
        .filter((a): a is PortfolioAsset => Boolean(a)),
    [introProject?.assetIds, assetsById],
  );

  const introHorizontal = useMemo(
    () => introVideos.find((a) => a.aspectRatio === '16:9') || introVideos[0],
    [introVideos],
  );

  const introVerticals = useMemo(
    () => introVideos.filter((a) => a.id !== introHorizontal?.id),
    [introVideos, introHorizontal],
  );

  const videos = useMemo(
    () =>
      videoProject.assetIds
        .map((id) => assetsById.get(id))
        .filter((a): a is PortfolioAsset => Boolean(a)),
    [videoProject.assetIds, assetsById],
  );

  const videoRows = useMemo(() => {
    const rows: PortfolioAsset[][] = [];
    for (let i = 0; i < videos.length; i += 4) {
      rows.push(videos.slice(i, i + 4));
    }
    return rows;
  }, [videos]);

  const hoianSeries = photographyProjects[0];
  const hoianPhotos = useMemo(
    () =>
      (hoianSeries?.assetIds ?? [])
        .map((id) => assetsById.get(id))
        .filter((a): a is PortfolioAsset => Boolean(a)),
    [hoianSeries, assetsById],
  );
  const hoianHero = hoianPhotos[0];
  const hoianPortraits = hoianPhotos.slice(1);

  const interiorSeries = photographyProjects[1];
  const interiorPhotos = useMemo(
    () =>
      (interiorSeries?.assetIds ?? [])
        .map((id) => assetsById.get(id))
        .filter((a): a is PortfolioAsset => Boolean(a)),
    [interiorSeries, assetsById],
  );
  const interiorDetail = interiorPhotos[0];
  const interiorSquares = interiorPhotos.slice(1);

  const showVideos = discipline === 'all' || discipline === 'video';
  const showPhotography = discipline === 'all' || discipline === 'photography';

  return (
    <section
      id="media"
      data-testid="media-section"
      aria-label="Media"
      className="relative min-h-[calc(100vh-140px)] w-full max-w-full overflow-x-hidden bg-[#F1EDE8] pt-14 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-24 text-[#1C1615]"
    >
      {/* Subtle Warm Paper Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(255, 255, 255, 0.75) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 90% 45%, rgba(230, 223, 214, 0.45) 0%, transparent 65%), radial-gradient(ellipse 55% 45% at 10% 75%, rgba(225, 217, 206, 0.45) 0%, transparent 65%)',
        }}
      />

      {/* Technical Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-15"
        style={{
          filter: 'invert(1)',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
        }}
      />

      {/* Giant Background Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none" aria-hidden="true">
        <span className="font-editorial-display text-[18vw] font-black uppercase tracking-widest text-[#1C1615]/[0.035] leading-none whitespace-nowrap">
          MEDIA
        </span>
      </div>

      {/* Floating Design Sparkles & Precision Markers */}
      <span className="pointer-events-none absolute top-28 left-[12%] text-[#7B1B11]/35 text-sm select-none animate-pulse" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute bottom-28 right-[12%] text-[#2563EB]/35 text-xs select-none animate-pulse delay-500" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute top-1/2 right-8 text-xs font-mono text-[#1C1615]/20 select-none" aria-hidden="true">+</span>
      <span className="pointer-events-none absolute top-1/2 left-8 text-xs font-mono text-[#1C1615]/20 select-none" aria-hidden="true">+</span>
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        {/* Centered Header + Clean Underlined Discipline Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="border-b border-[#1C1615]/15 pb-6 sm:pb-8 text-center"
        >
          <h1 className="font-editorial-display text-3xl sm:text-5xl font-black tracking-tight text-[#1C1615] lg:text-6xl text-balance">
            MEDIA
          </h1>

          <div
            role="tablist"
            aria-label="Media discipline filter"
            className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10 text-xs sm:text-sm font-semibold"
          >
            {(
              [
                { id: 'all', label: 'All Media' },
                {
                  id: 'video',
                  label: `Video Edit (${introVideos.length + videos.length})`,
                },
                {
                  id: 'photography',
                  label: `Photography (${hoianPhotos.length + interiorPhotos.length})`,
                },
              ] as const
            ).map((tab) => {
              const active = discipline === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDiscipline(tab.id)}
                  className={`relative cursor-pointer py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] ${
                    active ? 'text-[#1C1615]' : 'text-[#1C1615]/55 hover:text-[#1C1615]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#2563EB]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* === BLOCK 01: VIDEO EDIT (INTRO REELS AT TOP + 4-COLUMN ROWS) === */}
        {showVideos && (
          <div id="media-video-edit" className="scroll-mt-20 pt-12 lg:pt-16">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-[#1C1615]/15 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-editorial-mono text-xs font-semibold text-[#2563EB]">
                  01
                </span>
                <h2 className="font-editorial-display text-2xl font-extrabold tracking-tight text-[#1C1615] sm:text-3xl">
                  VIDEO EDIT
                </h2>
              </div>
              <p className="text-xs font-medium text-[#1C1615]/60">
                DaVinci Resolve Studio · After Effects · CapCut
              </p>
            </div>

            {/* 1 Ngang Trên + 3 Dọc Dưới */}
            {introVideos.length > 0 && (
              <div className="mb-10 sm:mb-12 space-y-6 sm:space-y-8">
                {/* 1 Video Ngang Trên (16:9) */}
                {introHorizontal && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                    className="mx-auto w-full max-w-[960px]"
                  >
                    <ArtworkFrame
                      asset={introHorizontal}
                      resolved={resolvedMap[introHorizontal.id]}
                      onSelect={onSelectAsset}
                      variant="light"
                      showCaption={false}
                      frameAspect="16 / 9"
                      customAccent={videoProject.palette.accent}
                      customSurface={videoProject.palette.surface}
                    />
                    <div className="mt-3 px-0.5">
                      <p className="truncate text-sm sm:text-base font-semibold text-[#1C1615]">
                        {introHorizontal.brand}
                      </p>
                      <p className="mt-0.5 truncate text-xs sm:text-[13px] text-[#1C1615]/65">
                        {introHorizontal.caption}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 3 Video Dọc Dưới (9:16) */}
                {introVerticals.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT_EXPO }}
                    className="mx-auto grid w-full max-w-[960px] grid-cols-3 gap-2.5 sm:gap-6"
                  >
                    {introVerticals.map((asset) => (
                      <div key={asset.id} className="w-full">
                        <ArtworkFrame
                          asset={asset}
                          resolved={resolvedMap[asset.id]}
                          onSelect={onSelectAsset}
                          variant="light"
                          showCaption={false}
                          frameAspect="9 / 16"
                          customAccent={videoProject.palette.accent}
                          customSurface={videoProject.palette.surface}
                        />
                        <div className="mt-2.5 sm:mt-3 px-0.5">
                          <p className="truncate text-xs sm:text-sm font-semibold text-[#1C1615]">
                            {asset.brand}
                          </p>
                          <p className="mt-0.5 truncate text-[10.5px] sm:text-xs text-[#1C1615]/65">
                            {asset.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            <div className="space-y-8" data-testid="video-edit-rows">
              {videoRows.map((row, rowIndex) => {
                const isFullRow = row.length === 4;
                return (
                  <motion.div
                    key={`video-row-${rowIndex}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.04 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(rowIndex * 0.05, 0.15),
                      ease: EASE_OUT_EXPO,
                    }}
                    className={
                      isFullRow
                        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'
                        : 'flex flex-wrap justify-center gap-4 sm:gap-6'
                    }
                  >
                    {row.map((asset) => (
                      <div
                        key={asset.id}
                        className={
                          isFullRow
                            ? 'w-full'
                            : 'w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]'
                        }
                      >
                        <ArtworkFrame
                          asset={asset}
                          resolved={resolvedMap[asset.id]}
                          onSelect={onSelectAsset}
                          variant="light"
                          showCaption={false}
                          frameAspect="9 / 16"
                          customAccent={videoProject.palette.accent}
                          customSurface={videoProject.palette.surface}
                        />
                        <div className="mt-3 px-0.5">
                          <p className="truncate text-sm font-semibold text-[#1C1615]">
                            {asset.brand}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#1C1615]/65">
                            {asset.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* === BLOCK 02: PHOTOGRAPHY === */}
        {showPhotography && (
          <div id="media-photography" className="scroll-mt-20 pt-16 lg:pt-24">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-[#1C1615]/15 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-editorial-mono text-xs font-semibold text-[#2563EB]">
                  02
                </span>
                <h2 className="font-editorial-display text-2xl font-extrabold tracking-tight text-[#1C1615] sm:text-3xl">
                  PHOTOGRAPHY
                </h2>
              </div>
              <p className="text-xs font-medium text-[#1C1615]/60">
                Editorial Fashion · Architectural & Interior Spaces
              </p>
            </div>

            {/* Series 01: Hội An Heritage Editorial (KHUNG XANH LÁ GIỮ NGUYÊN) */}
            {hoianSeries && (
              <div
                data-testid="photography-hoian"
                className="rounded-2xl border border-[#7A9958]/35 bg-gradient-to-br from-[#4A6335]/95 via-[#3B502A]/95 to-[#2A3B1E]/95 backdrop-blur-md p-4 sm:p-8 lg:p-10 shadow-2xl text-white"
              >
                <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-white/15 pb-4">
                  <div>
                    <p className="font-editorial-mono text-xs font-semibold text-[#BDE298]">
                      SERIES 01 · EDITORIAL
                    </p>
                    <h3 className="mt-1 font-editorial-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {hoianSeries.title}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-white/75">
                    {hoianSeries.subtitle}
                  </span>
                </div>

                {/* Landscape 3:2 Lead Frame */}
                {hoianHero && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="mx-auto max-w-5xl"
                  >
                    <ArtworkFrame
                      asset={hoianHero}
                      resolved={resolvedMap[hoianHero.id]}
                      onSelect={onSelectAsset}
                      variant="dark"
                      showCaption={false}
                      frameAspect="3 / 2"
                      customAccent={hoianSeries.palette.accent}
                      customSurface={hoianSeries.palette.surface}
                    />
                  </motion.div>
                )}

                {/* 4 Matching 2:3 Portrait Plates */}
                {hoianPortraits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5, delay: 0.06, ease: EASE_OUT_EXPO }}
                    className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
                  >
                    {hoianPortraits.map((asset) => (
                      <ArtworkFrame
                        key={asset.id}
                        asset={asset}
                        resolved={resolvedMap[asset.id]}
                        onSelect={onSelectAsset}
                        variant="dark"
                        showCaption={false}
                        frameAspect="2 / 3"
                        customAccent={hoianSeries.palette.accent}
                        customSurface={hoianSeries.palette.surface}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* Series 02: Architectural & Interior Spaces */}
            {interiorSeries && (
              <div
                data-testid="photography-interior"
                className="mt-10 rounded-2xl border border-[#D4A373]/35 bg-gradient-to-br from-[#382216]/95 via-[#2A180E]/95 to-[#1A0E08]/95 backdrop-blur-md p-4 sm:p-8 lg:p-10 shadow-2xl"
              >
                <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-white/15 pb-4">
                  <div>
                    <p className="font-editorial-mono text-xs font-semibold text-[#F0C885]">
                      SERIES 02 · ARCHITECTURE
                    </p>
                    <h3 className="mt-1 font-editorial-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {interiorSeries.title}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-white/75">
                    {interiorSeries.subtitle}
                  </span>
                </div>

                {/* 3-Up 1:1 Spatial Perspectives */}
                {interiorSquares.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3"
                  >
                    {interiorSquares.map((asset) => (
                      <ArtworkFrame
                        key={asset.id}
                        asset={asset}
                        resolved={resolvedMap[asset.id]}
                        onSelect={onSelectAsset}
                        variant="dark"
                        showCaption={false}
                        frameAspect="1 / 1"
                        customAccent={interiorSeries.palette.accent}
                        customSurface={interiorSeries.palette.surface}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Vertical Architectural Joinery Study Paired with Editorial Specification Card */}
                {interiorDetail && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.5, delay: 0.06, ease: EASE_OUT_EXPO }}
                    className="mt-6 sm:mt-8 grid grid-cols-1 items-center gap-6 sm:gap-8 rounded-xl border border-[#D4A373]/25 bg-[#140B06]/90 p-4 sm:p-6 lg:p-8 lg:grid-cols-12"
                  >
                    <div className="mx-auto w-full max-w-[340px] lg:col-span-5">
                      <ArtworkFrame
                        asset={interiorDetail}
                        resolved={resolvedMap[interiorDetail.id]}
                        onSelect={onSelectAsset}
                        variant="dark"
                        showCaption={false}
                        frameAspect={`${819 / 1254}`}
                        customAccent={interiorSeries.palette.accent}
                        customSurface={interiorSeries.palette.surface}
                      />
                    </div>

                    <div className="space-y-5 lg:col-span-7 lg:px-6">
                      <p className="font-editorial-mono text-xs font-semibold uppercase tracking-wider text-[#F0C885]">
                        Spatial Lighting & Material Study
                      </p>
                      <h4 className="font-editorial-display text-2xl font-bold leading-snug text-white sm:text-3xl text-balance">
                        Walnut Joinery, Warm Cove Illumination & Natural Daylight Balance
                      </h4>
                      <p className="max-w-xl text-sm leading-relaxed text-white/70">
                        {interiorSeries.narrative}
                      </p>
                      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-xs">
                        <div>
                          <p className="text-white/45">Subject</p>
                          <p className="mt-1 font-semibold text-white">
                            Custom Walnut Cabinetry & Study
                          </p>
                        </div>
                        <div>
                          <p className="text-white/45">Color Treatment</p>
                          <p className="mt-1 font-semibold text-white">
                            True-to-Material Neutral Balance
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
