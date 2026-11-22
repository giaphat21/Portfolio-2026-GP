import { FileText, Maximize2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { PortfolioAsset, ResolvedAssetState } from '../types/portfolio';
import { normalizeAssetUrl } from '../utils/portfolioLogic';

interface ArtworkFrameProps {
  asset: PortfolioAsset;
  resolved?: ResolvedAssetState;
  onSelect: (asset: PortfolioAsset) => void;
  variant?: 'dark' | 'light';
  showCaption?: boolean;
  customAccent?: string;
  customSurface?: string;
  frameAspect?: string;
  className?: string;
}

export const ArtworkFrame: React.FC<ArtworkFrameProps> = ({
  asset,
  resolved,
  onSelect,
  variant = 'dark',
  showCaption = false,
  customAccent,
  customSurface,
  frameAspect,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isNearViewport, setIsNearViewport] = React.useState(false);
  const isAvailable = Boolean(resolved && resolved.source !== 'missing' && resolved.url);
  const primaryColor = asset.dominantColors[0] || '#161B38';
  const secondaryColor = asset.dominantColors[1] || '#F0C885';
  const accentColor = customAccent || asset.dominantColors[2] || '#FF713F';
  const isLight = variant === 'light';

  const safeAspect = Math.max(0.42, Math.min(20, asset.aspectNumeric));
  const resolvedAspectRatio = frameAspect || `${safeAspect}`;
  const resolvedSurface = asset.needsLightMat
    ? '#F1EDE8'
    : customSurface || primaryColor;

  useEffect(() => {
    if (asset.mediaType !== 'video' || !isAvailable || !resolved?.url) return;
    const vid = videoRef.current;
    if (!vid) return;

    vid.defaultMuted = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;

    let visible = false;

    const attemptPlay = () => {
      if (!visible) return;
      if (vid.paused) {
        vid.muted = true;
        vid.play().catch(() => undefined);
      }
    };

    const rect = vid.getBoundingClientRect();
    const initialInRange =
      rect.bottom >= -450 && rect.top <= (window.innerHeight || 900) + 450;
    if (initialInRange) {
      visible = true;
      setIsNearViewport(true);
      attemptPlay();
    }

    vid.addEventListener('canplay', attemptPlay);
    vid.addEventListener('loadeddata', attemptPlay);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visible = entry.isIntersecting;
            if (entry.isIntersecting) {
              setIsNearViewport(true);
              if (vid.readyState === 0 && vid.preload !== 'auto') {
                vid.preload = 'auto';
                vid.load();
              }
              attemptPlay();
            } else if (!vid.paused) {
              vid.pause();
            }
          }
        },
        { rootMargin: '450px 0px', threshold: 0.01 },
      );
      observer.observe(vid);
    } else {
      visible = true;
      setIsNearViewport(true);
      attemptPlay();
    }

    return () => {
      vid.removeEventListener('canplay', attemptPlay);
      vid.removeEventListener('loadeddata', attemptPlay);
      observer?.disconnect();
    };
  }, [asset.mediaType, isAvailable, resolved?.url]);

  return (
    <figure className={`group flex flex-col ${className}`}>
      <button
        type="button"
        onClick={() => onSelect(asset)}
        aria-label={`Inspect ${asset.projectName} — ${asset.caption}`}
        className={`relative w-full cursor-pointer overflow-hidden rounded-xl border text-left transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] ${
          isLight || asset.needsLightMat
            ? 'border-[#101327]/12 bg-[#F1EDE8]'
            : 'border-white/12 bg-[#161933]'
        }`}
        style={{
          aspectRatio: resolvedAspectRatio,
          backgroundColor: resolvedSurface,
        }}
      >
        {isAvailable && resolved?.url ? (
          asset.mediaType === 'video' ? (
            <div className="relative h-full w-full bg-[#060917]">
              <video
                ref={videoRef}
                src={resolved.url}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={(event) => {
                  const vid = event.currentTarget;
                  if (isNearViewport && vid.paused) {
                    vid.muted = true;
                    void vid.play().catch(() => undefined);
                  }
                }}
                onCanPlay={(event) => {
                  const vid = event.currentTarget;
                  if (isNearViewport && vid.paused) {
                    vid.muted = true;
                    void vid.play().catch(() => undefined);
                  }
                }}
              />
            </div>
          ) : asset.mediaType === 'pdf' ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-[#F1EDE8]">
              <FileText className="mb-3 h-10 w-10 text-[#F0C885]" />
              <p className="text-sm font-semibold">{asset.caption}</p>
            </div>
          ) : (
            <img
              src={resolved.url}
              alt={`${asset.projectName} — ${asset.caption}`}
              referrerPolicy="no-referrer"
              loading={asset.classification === 'portrait' ? 'eager' : 'lazy'}
              decoding="async"
              className={`h-full w-full object-contain transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
                asset.needsLightMat ? 'p-4 sm:p-6' : ''
              }`}
            />
          )
        ) : (
          <div
            className="relative flex h-full w-full flex-col justify-between p-5 sm:p-6"
            style={{
              background: `linear-gradient(145deg, ${primaryColor} 0%, ${customSurface || primaryColor} 68%, ${secondaryColor}22 100%)`,
            }}
          >
            <div className="my-auto py-3">
              <div
                className="mb-3 h-[2px] w-10"
                style={{ backgroundColor: accentColor }}
              />
              <p className="font-editorial-display text-lg sm:text-xl font-semibold leading-snug text-[#F8F6F0] text-balance">
                {asset.observedCopy || asset.caption}
              </p>
            </div>

            <div className="border-t border-white/12 pt-3 text-xs text-white/75">
              <span className="truncate">{asset.brand}</span>
            </div>
          </div>
        )}

        <div className="card-shine-sweep" aria-hidden="true" />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B0D1C]/80 text-[#F2EFE9] opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {showCaption && (
        <figcaption className="mt-2.5">
          <p
            className={`truncate text-sm font-medium ${
              isLight ? 'text-[#101327]' : 'text-[#F2EFE9]'
            }`}
          >
            {asset.caption}
          </p>
        </figcaption>
      )}
    </figure>
  );
};
