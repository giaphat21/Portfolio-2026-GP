import { MotionConfig } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AssetDrawerModal } from './components/AssetDrawerModal';
import { BackToTopButton } from './components/BackToTopButton';
import { CaseStudySection } from './components/CaseStudySection';
import { CertificatesSection } from './components/CertificatesSection';
import { FooterSection } from './components/FooterSection';
import { HeroAboutStage } from './components/HeroAboutStage';
import { LightboxModal } from './components/LightboxModal';
import { MediaSection } from './components/MediaSection';
import { Navbar, PortfolioTrack } from './components/Navbar';
import { ScrollProgress } from './components/ScrollProgress';
import { SelectedWorksIntro } from './components/SelectedWorksIntro';
import { SmoothScrollAndCursor } from './components/SmoothScrollAndCursor';
import {
  INTRO_HIGHLIGHT_CASE_STUDY,
  PHOTOGRAPHY_CASE_STUDIES,
  PORTFOLIO_ASSETS,
  PROJECT_CASE_STUDIES,
  VIDEO_EDIT_CASE_STUDY,
} from './data/projects';
import { PortfolioAsset, ProjectCategory, ResolvedAssetState } from './types/portfolio';
import {
  clearSavedLocalAssets,
  loadSavedLocalAssets,
  probeDiskAssets,
  saveLocalAssetFiles,
} from './utils/assetStore';
import {
  computeManifestAudit,
  filterCaseStudiesByCategory,
  normalizeAssetUrl,
  stepLightboxIndex,
} from './utils/portfolioLogic';

export default function App() {
  const [activeTrack, setActiveTrack] = useState<PortfolioTrack>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#media' || hash === '#video-edit') {
        return 'media';
      }
    }
    return 'design';
  });
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [diskResolved, setDiskResolved] = useState<Record<string, ResolvedAssetState>>(() => {
    const initial: Record<string, ResolvedAssetState> = {};
    for (const asset of PORTFOLIO_ASSETS) {
      initial[asset.id] = { url: normalizeAssetUrl(asset.uploadedPath), source: 'disk-aistudio' };
    }
    return initial;
  });
  const [localUrls, setLocalUrls] = useState<Record<string, string>>({});
  const [lightboxAssetId, setLightboxAssetId] = useState<string | null>(null);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      const [diskMap, savedLocal] = await Promise.all([
        probeDiskAssets(PORTFOLIO_ASSETS),
        loadSavedLocalAssets(),
      ]);
      if (!active) return;
      setDiskResolved(diskMap);
      setLocalUrls(savedLocal);
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, []);

  const resolvedMap = useMemo(() => {
    const merged: Record<string, ResolvedAssetState> = {};
    for (const asset of PORTFOLIO_ASSETS) {
      if (localUrls[asset.id]) {
        merged[asset.id] = { url: localUrls[asset.id], source: 'local-upload' };
      } else if (diskResolved[asset.id]) {
        merged[asset.id] = diskResolved[asset.id];
      } else {
        merged[asset.id] = { url: null, source: 'missing' };
      }
    }
    return merged;
  }, [diskResolved, localUrls]);

  const assetsById = useMemo(
    () => new Map(PORTFOLIO_ASSETS.map((asset) => [asset.id, asset])),
    [],
  );

  const visibleProjects = useMemo(
    () => filterCaseStudiesByCategory(PROJECT_CASE_STUDIES, selectedCategory),
    [selectedCategory],
  );

  const allCaseStudies = useMemo(
    () => [
      ...PROJECT_CASE_STUDIES,
      INTRO_HIGHLIGHT_CASE_STUDY,
      VIDEO_EDIT_CASE_STUDY,
      ...PHOTOGRAPHY_CASE_STUDIES,
    ],
    [],
  );

  const audit = useMemo(
    () => computeManifestAudit(PORTFOLIO_ASSETS, allCaseStudies, resolvedMap),
    [allCaseStudies, resolvedMap],
  );

  const portraits = useMemo(
    () => PORTFOLIO_ASSETS.filter((a) => a.classification === 'portrait'),
    [],
  );
  const introVideoAsset = useMemo(
    () => PORTFOLIO_ASSETS.find((a) => a.id === 'motion-intro-giaphat'),
    [],
  );
  const cvAsset = useMemo(
    () => PORTFOLIO_ASSETS.find((a) => a.classification === 'document'),
    [],
  );
  const credentials = useMemo(
    () => PORTFOLIO_ASSETS.filter((a) => a.classification === 'credential'),
    [],
  );

  const lightboxIndex = useMemo(() => {
    if (!lightboxAssetId) return -1;
    return PORTFOLIO_ASSETS.findIndex((a) => a.id === lightboxAssetId);
  }, [lightboxAssetId]);

  const activeLightboxAsset =
    lightboxIndex >= 0 ? PORTFOLIO_ASSETS[lightboxIndex] : null;

  const handleStepLightbox = useCallback(
    (direction: 'prev' | 'next') => {
      if (lightboxIndex < 0) return;
      const nextIdx = stepLightboxIndex(lightboxIndex, PORTFOLIO_ASSETS.length, direction);
      if (nextIdx >= 0) {
        setLightboxAssetId(PORTFOLIO_ASSETS[nextIdx].id);
      }
    },
    [lightboxIndex],
  );

  const handleFilesSelected = useCallback(async (files: FileList) => {
    const matched = await saveLocalAssetFiles(files);
    const count = Object.keys(matched).length;
    setLocalUrls((prev) => ({ ...prev, ...matched }));
    return count;
  }, []);

  const handleClearLocalAssets = useCallback(async () => {
    await clearSavedLocalAssets();
    setLocalUrls({});
  }, []);

  const handleSelectAsset = useCallback((asset: PortfolioAsset) => {
    setLightboxAssetId(asset.id);
  }, []);

  const handleSelectTrack = useCallback((track: PortfolioTrack) => {
    setActiveTrack(track);
    if (typeof window !== 'undefined') {
      const targetHash = track === 'media' ? '#media' : '#cover';
      window.history.replaceState(null, '', targetHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#060917] text-[#F8FAFC]">
        <SmoothScrollAndCursor />
        <ScrollProgress />
        <Navbar
          activeTrack={activeTrack}
          onSelectTrack={handleSelectTrack}
          onOpenAssetDrawer={() => setIsAssetDrawerOpen(true)}
        />

        <main className="w-full max-w-full overflow-x-hidden pt-[50px] sm:pt-[60px] md:pt-[66px]">
          {activeTrack === 'design' ? (
            <>
              <HeroAboutStage
                portraitAsset={portraits[0]}
                introVideoAsset={introVideoAsset}
                cvAsset={cvAsset}
                credentials={credentials}
                resolvedMap={resolvedMap}
                onSelectAsset={handleSelectAsset}
              />

              <CertificatesSection
                credentials={credentials}
                resolvedMap={resolvedMap}
                onSelectAsset={handleSelectAsset}
              />

              <SelectedWorksIntro
                projects={visibleProjects}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectTrack={handleSelectTrack}
              />

              {visibleProjects.map((project) => (
                <CaseStudySection
                  key={project.id}
                  project={project}
                  assetsById={assetsById}
                  resolvedMap={resolvedMap}
                  onSelectAsset={handleSelectAsset}
                />
              ))}
            </>
          ) : (
            <MediaSection
              introProject={INTRO_HIGHLIGHT_CASE_STUDY}
              videoProject={VIDEO_EDIT_CASE_STUDY}
              photographyProjects={PHOTOGRAPHY_CASE_STUDIES}
              assetsById={assetsById}
              resolvedMap={resolvedMap}
              onSelectAsset={handleSelectAsset}
            />
          )}
        </main>

        <FooterSection onSelectTrack={handleSelectTrack} />

        <LightboxModal
          asset={activeLightboxAsset}
          resolved={activeLightboxAsset ? resolvedMap[activeLightboxAsset.id] : undefined}
          currentIndex={lightboxIndex}
          totalCount={PORTFOLIO_ASSETS.length}
          onClose={() => setLightboxAssetId(null)}
          onStep={handleStepLightbox}
        />

        <AssetDrawerModal
          isOpen={isAssetDrawerOpen}
          audit={audit}
          onClose={() => setIsAssetDrawerOpen(false)}
          onFilesSelected={handleFilesSelected}
          onClearLocalAssets={handleClearLocalAssets}
        />

        <BackToTopButton />
      </div>
    </MotionConfig>
  );
}
