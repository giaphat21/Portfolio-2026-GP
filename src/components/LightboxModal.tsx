import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { PortfolioAsset, ResolvedAssetState } from '../types/portfolio';

interface LightboxModalProps {
  asset: PortfolioAsset | null;
  resolved?: ResolvedAssetState;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onStep: (direction: 'prev' | 'next') => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  asset,
  resolved,
  currentIndex,
  totalCount,
  onClose,
  onStep,
}) => {
  useEffect(() => {
    if (!asset) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        onStep('prev');
      } else if (event.key === 'ArrowRight') {
        onStep('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [asset, onClose, onStep]);

  if (!asset) return null;

  const isAvailable = Boolean(resolved && resolved.source !== 'missing' && resolved.url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Artwork viewer: ${asset.projectName}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#080A16]/95 text-[#F1EDE8] backdrop-blur-md"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#F1EDE8]">
            {asset.projectName}
          </p>
          <p className="mt-0.5 truncate text-xs text-[#F1EDE8]/65">
            {asset.brand} · {asset.category}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-editorial-mono text-xs text-[#93C5FD] tabular-nums">
            {currentIndex + 1} / {totalCount}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-[#2563EB] hover:border-[#2563EB]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Media Stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-10">
        <button
          type="button"
          onClick={() => onStep('prev')}
          aria-label="Previous artwork"
          className="absolute left-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-[#101327]/80 text-white transition-colors hover:bg-[#2563EB] hover:border-[#2563EB]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className={`flex items-center justify-center ${
            asset.mediaType === 'video'
              ? 'max-h-[82vh] w-auto'
              : 'max-h-[72vh] w-full max-w-5xl'
          }`}
        >
          {isAvailable && resolved?.url ? (
            asset.mediaType === 'video' ? (
              <div className="relative flex items-center justify-center max-h-[80vh] h-[80vh] w-auto max-w-[min(90vw,440px)] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-[0_0_60px_rgba(0,0,0,0.85)] border border-white/20">
                <video
                  src={resolved.url}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain bg-black"
                />
              </div>
            ) : asset.mediaType === 'pdf' ? (
              <iframe
                src={resolved.url}
                title={asset.caption}
                className="h-[72vh] w-full rounded-xl border border-white/15 bg-white"
              />
            ) : (
              <img
                src={resolved.url}
                alt={asset.caption}
                referrerPolicy="no-referrer"
                className={`max-h-[72vh] max-w-full rounded-xl object-contain ${
                  asset.needsLightMat ? 'bg-[#F1EDE8] p-6 sm:p-10' : ''
                }`}
              />
            )
          ) : (
            <div
              className="flex w-full max-w-2xl flex-col justify-between rounded-2xl border border-white/15 p-8 sm:p-12"
              style={{
                background: `linear-gradient(145deg, ${asset.dominantColors[0] || '#101327'} 0%, #101327 100%)`,
              }}
            >
              <p className="font-editorial-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                {asset.observedCopy || asset.caption}
              </p>
              <p className="mt-4 text-xs text-white/65">
                {asset.brand} · {asset.category}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onStep('next')}
          aria-label="Next artwork"
          className="absolute right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-[#101327]/80 text-white transition-colors hover:bg-[#2563EB] hover:border-[#2563EB]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Caption Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-xs text-[#F1EDE8]/75">
        <p>{asset.caption}</p>
        <p className="font-editorial-mono text-[#F1EDE8]/55">
          ← / → Navigate · ESC Close
        </p>
      </div>
    </div>
  );
};
