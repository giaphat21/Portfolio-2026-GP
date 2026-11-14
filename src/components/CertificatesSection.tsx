import { Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { PortfolioAsset, ResolvedAssetState } from '../types/portfolio';
import { splitCredentialsIntoRows } from '../utils/portfolioLogic';

interface CertificatesSectionProps {
  credentials: PortfolioAsset[];
  resolvedMap: Record<string, ResolvedAssetState>;
  onSelectAsset: (asset: PortfolioAsset) => void;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  credentials,
  resolvedMap,
  onSelectAsset,
}) => {
  const [rowOne, rowTwo] = useMemo(
    () => splitCredentialsIntoRows(credentials),
    [credentials],
  );

  if (credentials.length === 0) return null;

  const renderCertificateCard = (
    cert: PortfolioAsset,
    isDuplicate: boolean,
  ) => {
    const resolved = resolvedMap[cert.id];
    const isAvailable = Boolean(resolved && resolved.source !== 'missing' && resolved.url);
    const isPortrait = cert.aspectNumeric < 0.9;

    return (
      <figure
        key={isDuplicate ? `${cert.id}-dup` : cert.id}
        aria-hidden={isDuplicate || undefined}
        className="group flex shrink-0 flex-col"
        style={{
          width: isPortrait ? '192px' : '336px',
        }}
      >
        <button
          type="button"
          tabIndex={isDuplicate ? -1 : 0}
          onClick={() => onSelectAsset(cert)}
          aria-label={`Inspect certificate — ${cert.brand} (${cert.caption})`}
          className="relative w-full cursor-pointer overflow-hidden rounded-xl border border-[#060917]/12 bg-white shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          style={{
            height: '240px',
          }}
        >
          {isAvailable && resolved?.url ? (
            <img
              src={resolved.url}
              alt={isDuplicate ? '' : `${cert.brand} — ${cert.caption}`}
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              className="h-full w-full object-contain p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-center p-5 text-left">
              <span className="text-xs font-semibold text-[#2563EB]">
                {cert.brand}
              </span>
              <p className="mt-2 font-editorial-display text-base font-bold text-[#060917]">
                {cert.caption}
              </p>
            </div>
          )}

          <div className="card-shine-sweep" aria-hidden="true" />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#060917]/85 text-white opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        </button>

        <figcaption className="mt-2.5 px-0.5">
          <p className="truncate text-sm font-semibold text-[#060917]">
            {cert.brand}
          </p>
          <p className="mt-0.5 truncate text-xs text-[#060917]/65">
            {cert.caption}
          </p>
        </figcaption>
      </figure>
    );
  };

  return (
    <section
      id="credentials"
      data-testid="certificates-section"
      className="scroll-mt-16 border-b border-[#060917]/12 bg-[#F5F2EB] text-[#060917] block lg:hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-14 lg:px-12 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="border-b border-[#060917]/12 pb-8 text-center"
        >
          <h2 className="font-editorial-display text-4xl font-black tracking-tight text-[#060917] sm:text-5xl text-balance">
            CERTIFICATES
          </h2>
        </motion.div>
      </div>

      {/* Dual Opposing Animated Certificate Marquee Rows */}
      <div className="cert-marquee-container relative mx-auto max-w-[1440px] space-y-8 overflow-hidden pb-16 pt-2 lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F2EB] to-transparent lg:w-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F5F2EB] to-transparent lg:w-20"
        />

        {/* Row 1 — Scrolling Left */}
        <div
          data-testid="certificates-row-1"
          className="animate-cert-marquee items-start gap-6 px-6"
        >
          {rowOne.map((cert) => renderCertificateCard(cert, false))}
          {rowOne.map((cert) => renderCertificateCard(cert, true))}
        </div>

        {/* Row 2 — Scrolling Right (Opposite Direction) */}
        {rowTwo.length > 0 && (
          <div
            data-testid="certificates-row-2"
            className="animate-cert-marquee-reverse items-start gap-6 px-6"
          >
            {rowTwo.map((cert) => renderCertificateCard(cert, false))}
            {rowTwo.map((cert) => renderCertificateCard(cert, true))}
          </div>
        )}
      </div>
    </section>
  );
};
