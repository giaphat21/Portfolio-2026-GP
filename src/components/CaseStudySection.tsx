import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { PortfolioAsset, ProjectCaseStudy, ResolvedAssetState } from '../types/portfolio';
import { buildSymmetricLayoutBands } from '../utils/portfolioLogic';
import { ArtworkFrame } from './ArtworkFrame';

interface CaseStudySectionProps {
  project: ProjectCaseStudy;
  assetsById: Map<string, PortfolioAsset>;
  resolvedMap: Record<string, ResolvedAssetState>;
  onSelectAsset: (asset: PortfolioAsset) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

function getRowGridClass(columns: 1 | 2 | 3 | 4): string {
  switch (columns) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 sm:grid-cols-2';
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  }
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({
  project,
  assetsById,
  resolvedMap,
  onSelectAsset,
}) => {
  const projectAssets = useMemo(
    () =>
      project.assetIds
        .map((id) => assetsById.get(id))
        .filter((a): a is PortfolioAsset => Boolean(a)),
    [project.assetIds, assetsById],
  );

  const bands = useMemo(
    () => buildSymmetricLayoutBands(projectAssets),
    [projectAssets],
  );

  const isLightCanvas = isLightHex(project.palette.canvas);
  const frameVariant: 'light' | 'dark' = isLightCanvas ? 'light' : 'dark';

  return (
    <article
      id={`project-${project.id}`}
      style={{
        backgroundColor: project.palette.canvas,
        color: project.palette.ink,
        borderColor: project.palette.border,
      }}
      className="relative scroll-mt-20 w-full max-w-full overflow-hidden border-b py-12 sm:py-16 lg:py-24"
    >
      {/* 1. Subtle Background Halftone & Technical Grid */}
      <div 
        className="pointer-events-none absolute inset-0 dot-matrix-overlay opacity-25" 
        style={{
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
        }}
      />
      <div 
        className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-30" 
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)',
        }}
      />

      {/* 2. Soft Ambient Lighting Orb matching Project Palette Accent */}
      <div 
        className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full blur-[110px]"
        style={{ backgroundColor: project.palette.accent, opacity: isLightCanvas ? 0.08 : 0.12 }}
      />

      {/* 3. Giant Typographic Index Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none" aria-hidden="true">
        <span 
          className="font-editorial-display text-[16vw] font-black uppercase tracking-widest leading-none"
          style={{ color: project.palette.ink, opacity: isLightCanvas ? 0.04 : 0.03 }}
        >
          {project.indexNumber}
        </span>
      </div>

      {/* 4. Floating Precision Crosshairs & Design Stars */}
      <span className="pointer-events-none absolute top-24 left-[8%] text-sm select-none opacity-25 animate-pulse" style={{ color: project.palette.accent }} aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute bottom-24 right-[8%] text-xs select-none opacity-25 animate-pulse delay-500" style={{ color: project.palette.accent }} aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute top-1/2 right-6 text-xs font-mono select-none opacity-20" aria-hidden="true">+</span>
      <span className="pointer-events-none absolute top-1/2 left-6 text-xs font-mono select-none opacity-20" aria-hidden="true">+</span>
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        {/* Clean Project Header */}
        <div
          className="mb-6 sm:mb-8 flex flex-wrap items-baseline justify-between gap-3 sm:gap-4 border-b pb-4 text-xs font-medium"
          style={{ borderColor: project.palette.border }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-editorial-mono font-semibold"
              style={{ color: project.palette.accent }}
            >
              {project.indexNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.brand}</span>
          </div>

          <span
            className="font-editorial-mono"
            style={{ color: project.palette.mutedInk }}
          >
            {project.year}
          </span>
        </div>

        {/* Centered Symmetric Project Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.04 }}
          transition={{ duration: 0.48, ease: EASE_OUT_EXPO }}
          className="mx-auto max-w-6xl text-center"
        >
          <h3 className="font-editorial-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem] text-balance">
            {project.title}
          </h3>
        </motion.div>

        {/* Orientation-Matched Symmetric Artwork Bands — Pure Visual Plates */}
        <div
          className={`mt-8 sm:mt-10 space-y-4 sm:space-y-6 ${
            project.id === 'editorial-skincare-print'
              ? 'mx-auto max-w-[1380px]'
              : ''
          }`}
        >
          {bands.map((band) => (
            <div key={band.id} data-band-id={band.id} className="space-y-4 sm:space-y-6">
              {band.rows.map((row, rowIndex) => (
                <motion.div
                  key={`${band.id}-row-${rowIndex}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.04 }}
                  transition={{
                    duration: 0.42,
                    delay: Math.min(rowIndex * 0.04, 0.14),
                    ease: EASE_OUT_EXPO,
                  }}
                  className={`grid gap-4 sm:gap-6 ${getRowGridClass(row.columns)}`}
                >
                  {row.assets.map((asset, assetIndex) => {
                    const rowFrameAspect = `${asset.aspectNumeric}`;

                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.08 }}
                        transition={{
                          duration: 0.48,
                          delay: assetIndex * 0.07,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="w-full"
                      >
                        <ArtworkFrame
                          asset={asset}
                          resolved={resolvedMap[asset.id]}
                          onSelect={onSelectAsset}
                          variant={frameVariant}
                          showCaption={false}
                          frameAspect={rowFrameAspect}
                          customAccent={project.palette.accent}
                          customSurface={project.palette.surface}
                          className={
                            band.bucket === 'strip' && asset.aspectNumeric >= 8
                              ? 'mx-auto w-full max-w-[904px]'
                              : ''
                          }
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
