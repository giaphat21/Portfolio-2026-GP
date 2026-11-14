import React, { useEffect, useRef, useState } from 'react';
import { PortfolioAsset, ResolvedAssetState } from '../types/portfolio';
import { normalizeAssetUrl } from '../utils/portfolioLogic';
import { AboutSection } from './AboutSection';
import { OpeningCover } from './OpeningCover';

interface HeroAboutStageProps {
  portraitAsset?: PortfolioAsset;
  introVideoAsset?: PortfolioAsset;
  cvAsset?: PortfolioAsset;
  credentials?: PortfolioAsset[];
  resolvedMap: Record<string, ResolvedAssetState>;
  onSelectAsset: (asset: PortfolioAsset) => void;
}

export const HeroAboutStage: React.FC<HeroAboutStageProps> = ({
  portraitAsset,
  introVideoAsset,
  cvAsset,
  credentials,
  resolvedMap,
  onSelectAsset,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const introVideoUrl =
    (introVideoAsset && resolvedMap[introVideoAsset.id]?.url) ||
    normalizeAssetUrl(introVideoAsset?.uploadedPath) ||
    normalizeAssetUrl('/assets/aistudio/intro_giaphat_web.mp4');

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.defaultMuted = true;
    vid.muted = isMuted;
    vid.playsInline = true;

    const attemptPlay = () => {
      if (vid.paused) {
        vid.play().catch(() => {
          // If unmuted autoplay is blocked, enforce muted playback
          vid.muted = true;
          setIsMuted(true);
          vid.play().catch(() => undefined);
        });
      }
    };

    attemptPlay();
    vid.addEventListener('canplay', attemptPlay);
    return () => {
      vid.removeEventListener('canplay', attemptPlay);
    };
  }, [introVideoUrl, isMuted]);

  const handleToggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (videoRef.current.paused) {
        void videoRef.current.play().catch(() => undefined);
      }
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-[#071330]">
      {/* Continuous Sticky Full-Bleed Background Video Across Cover (#cover) and About Me (#about) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#071330]">
          <video
            ref={videoRef}
            src={introVideoUrl}
            poster={introVideoAsset?.posterPath ? normalizeAssetUrl(introVideoAsset.posterPath) : undefined}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onCanPlay={(event) => {
              const vid = event.currentTarget;
              if (vid.paused) {
                vid.muted = isMuted;
                void vid.play().catch(() => undefined);
              }
            }}
            className="h-full w-full object-cover object-center opacity-100 will-change-transform"
          />

          {/* Subtle Dot-Matrix Halftone Grid */}
          <div className="dot-matrix-overlay absolute inset-0 opacity-20" />

          {/* Light Cinematic Blue Scrim so Background Video Stays Clearly Visible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(20, 50, 130, 0.15) 0%, rgba(10, 25, 75, 0.30) 60%, rgba(6, 16, 46, 0.60) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071330]/20 via-transparent to-[#071330]/50" />
        </div>
      </div>

      {/* Foreground Content Layer Floating Over Live Looping Video */}
      <div className="relative z-10">
        <OpeningCover isMuted={isMuted} onToggleAudio={handleToggleAudio} />

        <AboutSection
          portraitAsset={portraitAsset}
          cvAsset={cvAsset}
          credentials={credentials}
          resolvedMap={resolvedMap}
          onSelectAsset={onSelectAsset}
        />
      </div>
    </div>
  );
};
