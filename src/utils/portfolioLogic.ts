import {
  AssetClassification,
  ManifestAuditSummary,
  OrientationBucket,
  PortfolioAsset,
  ProjectCaseStudy,
  ProjectCategory,
  ResolvedAssetState,
  SymmetricLayoutBand,
  SymmetricLayoutRow,
} from '../types/portfolio';

export function normalizeFilenameKey(filename: string): string {
  return filename
    .trim()
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s+/g, ' ');
}

export function stripDiacriticsAndPunctuation(filename: string): string {
  return filename
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9.]+/g, '');
}

export function matchUploadedFilesToAssets(
  files: Array<{ name: string; objectUrl: string }>,
  assets: PortfolioAsset[],
): Record<string, string> {
  const exactMap = new Map<string, string>();
  const fuzzyMap = new Map<string, string>();

  for (const file of files) {
    const baseName = file.name.split('/').pop() ?? file.name;
    exactMap.set(normalizeFilenameKey(baseName), file.objectUrl);
    fuzzyMap.set(stripDiacriticsAndPunctuation(baseName), file.objectUrl);
  }

  const matched: Record<string, string> = {};
  for (const asset of assets) {
    const exactKey = normalizeFilenameKey(asset.originalFilename);
    const uploadedBase = asset.uploadedPath.split('/').pop() ?? '';
    const uploadedKey = normalizeFilenameKey(uploadedBase);

    if (exactMap.has(exactKey)) {
      matched[asset.id] = exactMap.get(exactKey)!;
    } else if (exactMap.has(uploadedKey)) {
      matched[asset.id] = exactMap.get(uploadedKey)!;
    } else {
      const fuzzyKey = stripDiacriticsAndPunctuation(asset.originalFilename);
      if (fuzzyMap.has(fuzzyKey)) {
        matched[asset.id] = fuzzyMap.get(fuzzyKey)!;
      }
    }
  }

  return matched;
}

export function filterCaseStudiesByCategory(
  projects: ProjectCaseStudy[],
  selectedCategory: ProjectCategory | 'All',
): ProjectCaseStudy[] {
  if (selectedCategory === 'All') {
    return projects;
  }
  return projects.filter((project) => project.category === selectedCategory);
}

export function filterArchiveAssets(
  assets: PortfolioAsset[],
  options: {
    classification?: AssetClassification | 'all';
    projectId?: string | 'all';
    query?: string;
    onlyMissing?: boolean;
    resolvedMap?: Record<string, ResolvedAssetState>;
  },
): PortfolioAsset[] {
  const q = (options.query ?? '').trim().toLowerCase();

  return assets.filter((asset) => {
    if (
      options.classification &&
      options.classification !== 'all' &&
      asset.classification !== options.classification
    ) {
      return false;
    }

    if (options.projectId && options.projectId !== 'all' && asset.projectId !== options.projectId) {
      return false;
    }

    if (options.onlyMissing && options.resolvedMap) {
      const state = options.resolvedMap[asset.id];
      if (state && state.source !== 'missing') {
        return false;
      }
    }

    if (q.length > 0) {
      const haystack = [
        asset.originalFilename,
        asset.projectName,
        asset.brand,
        asset.category,
        asset.caption,
        asset.observedCopy ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

export function computeManifestAudit(
  assets: PortfolioAsset[],
  projects: ProjectCaseStudy[],
  resolvedMap: Record<string, ResolvedAssetState>,
): ManifestAuditSummary {
  const countsByClassification: Record<AssetClassification, number> = {
    original: 0,
    mockup: 0,
    portrait: 0,
    credential: 0,
    motion: 0,
    tool_icon: 0,
    document: 0,
  };

  const missingAssets: PortfolioAsset[] = [];
  let availableCount = 0;

  for (const asset of assets) {
    countsByClassification[asset.classification] += 1;
    const resolved = resolvedMap[asset.id];
    if (resolved && resolved.source !== 'missing' && resolved.url) {
      availableCount += 1;
    } else {
      missingAssets.push(asset);
    }
  }

  const projectGroups = new Map<
    string,
    { projectId: string; projectName: string; total: number; available: number }
  >();

  for (const project of projects) {
    projectGroups.set(project.id, {
      projectId: project.id,
      projectName: project.title,
      total: 0,
      available: 0,
    });
  }

  projectGroups.set('personal-identity', {
    projectId: 'personal-identity',
    projectName: 'Personal Portraits & CV',
    total: 0,
    available: 0,
  });

  projectGroups.set('credentials-toolkit', {
    projectId: 'credentials-toolkit',
    projectName: 'Certificates & Design Toolkit',
    total: 0,
    available: 0,
  });

  for (const asset of assets) {
    const group = projectGroups.get(asset.projectId);
    if (!group) continue;
    group.total += 1;
    const resolved = resolvedMap[asset.id];
    if (resolved && resolved.source !== 'missing' && resolved.url) {
      group.available += 1;
    }
  }

  return {
    totalCataloged: assets.length,
    availableCount,
    missingCount: missingAssets.length,
    missingAssets,
    countsByClassification,
    countsByProject: Array.from(projectGroups.values()),
  };
}

export function stepLightboxIndex(
  currentIndex: number,
  totalItems: number,
  direction: 'prev' | 'next',
): number {
  if (totalItems <= 0) return -1;
  if (direction === 'next') {
    return (currentIndex + 1) % totalItems;
  }
  return (currentIndex - 1 + totalItems) % totalItems;
}

export function classifyAssetOrientation(aspectNumeric: number): OrientationBucket {
  if (aspectNumeric >= 4.0) return 'strip';
  if (aspectNumeric >= 2.35) return 'panoramic';
  if (aspectNumeric >= 1.65) return 'widescreen';
  if (aspectNumeric >= 1.22) return 'landscape';
  if (aspectNumeric >= 0.88) return 'square';
  if (aspectNumeric >= 0.68) return 'portrait';
  return 'tall';
}

export function chunkSymmetricRowSizes(
  count: number,
  maxCols: 2 | 3 | 4 = 3,
): Array<1 | 2 | 3 | 4> {
  if (count <= 0) return [];
  if (count === 1) return [1];

  const rows: Array<1 | 2 | 3 | 4> = [];
  let remaining = count;

  while (remaining > 7) {
    rows.push(maxCols);
    remaining -= maxCols;
  }

  switch (remaining) {
    case 2:
      rows.push(2);
      break;
    case 3:
      rows.push(3);
      break;
    case 4:
      rows.push(maxCols === 4 ? 4 : 2);
      if (maxCols !== 4) rows.push(2);
      break;
    case 5:
      rows.push(2, 3);
      break;
    case 6:
      if (maxCols >= 3) {
        rows.push(3, 3);
      } else {
        rows.push(2, 2, 2);
      }
      break;
    case 7:
      if (maxCols === 4) {
        rows.push(3, 4);
      } else {
        rows.push(3, 2, 2);
      }
      break;
    default:
      break;
  }

  return rows;
}

function buildRowsForBand(
  items: PortfolioAsset[],
  maxCols: 1 | 2 | 3 | 4,
): SymmetricLayoutRow[] {
  if (items.length === 0) return [];
  if (maxCols === 1) {
    return items.map((item) => ({ columns: 1, assets: [item] }));
  }

  const rowSizes = chunkSymmetricRowSizes(items.length, maxCols);
  const rows: SymmetricLayoutRow[] = [];
  let offset = 0;

  for (const size of rowSizes) {
    rows.push({
      columns: size,
      assets: items.slice(offset, offset + size),
    });
    offset += size;
  }

  return rows;
}

export function buildSymmetricLayoutBands(
  assets: PortfolioAsset[],
): SymmetricLayoutBand[] {
  const buckets: Record<
    Exclude<OrientationBucket, 'vertical'>,
    PortfolioAsset[]
  > = {
    widescreen: [],
    panoramic: [],
    landscape: [],
    square: [],
    portrait: [],
    tall: [],
    strip: [],
  };

  for (const asset of assets) {
    const bucket = classifyAssetOrientation(asset.aspectNumeric) as Exclude<
      OrientationBucket,
      'vertical'
    >;
    buckets[bucket].push(asset);
  }

  const bands: SymmetricLayoutBand[] = [];

  if (buckets.widescreen.length > 0) {
    const allVideos = buckets.widescreen.every((a) => a.mediaType === 'video');
    const maxCols: 2 | 3 = allVideos ? 2 : 3;
    bands.push({
      id: 'widescreen',
      bucket: 'widescreen',
      label: allVideos ? 'Motion & Film Reels · 16:9' : 'Widescreen Key Visuals · 16:9 / 2:1',
      frameAspect: '16 / 9',
      rows: buildRowsForBand(buckets.widescreen, maxCols),
    });
  }

  if (buckets.panoramic.length > 0) {
    const maxCols: 1 | 2 = buckets.panoramic.length >= 2 ? 2 : 1;
    bands.push({
      id: 'panoramic',
      bucket: 'panoramic',
      label: 'Panoramic Masters · 27:10',
      frameAspect: '27 / 10',
      rows: buildRowsForBand(buckets.panoramic, maxCols),
    });
  }

  if (buckets.landscape.length > 0) {
    const avgRatio =
      buckets.landscape.reduce((sum, a) => sum + a.aspectNumeric, 0) /
      buckets.landscape.length;
    const frameAspect = avgRatio >= 1.4 ? '3 / 2' : '4 / 3';
    bands.push({
      id: 'landscape',
      bucket: 'landscape',
      label: 'Landscape Spreads · 3:2 / 4:3',
      frameAspect,
      rows: buildRowsForBand(buckets.landscape, 3),
    });
  }

  const shouldMergeSquareAndSinglePortrait =
    buckets.square.length > 0 &&
    buckets.portrait.length === 1 &&
    buckets.tall.length === 0 &&
    buckets.square.length + buckets.portrait.length <= 6;

  if (buckets.square.length > 0 && !shouldMergeSquareAndSinglePortrait) {
    const n = buckets.square.length;
    const maxCols: 2 | 3 | 4 = n === 4 || n >= 8 ? 4 : 3;
    bands.push({
      id: 'square',
      bucket: 'square',
      label: 'Square Editions · 1:1',
      frameAspect: '1 / 1',
      rows: buildRowsForBand(buckets.square, maxCols),
    });
  }

  if (shouldMergeSquareAndSinglePortrait) {
    const combinedUpright = [...buckets.square, ...buckets.portrait];
    const cols: 2 | 3 = combinedUpright.length === 2 ? 2 : 3;
    bands.push({
      id: 'upright',
      bucket: 'vertical',
      label: 'Social & Campaign Visuals · 1:1 / 4:5',
      frameAspect: '9 / 10',
      rows: buildRowsForBand(combinedUpright, cols),
    });
  } else {
    const shouldMergeVerticals =
      buckets.portrait.length > 0 &&
      buckets.tall.length > 0 &&
      (buckets.portrait.length === 1 || buckets.tall.length === 1);

    if (shouldMergeVerticals) {
      const combined = [...buckets.portrait, ...buckets.tall];
      bands.push({
        id: 'vertical',
        bucket: 'vertical',
        label: 'Vertical Editorial & Reels · 9:16',
        frameAspect: '9 / 16',
        rows: buildRowsForBand(combined, 3),
      });
    } else {
      if (buckets.portrait.length > 0) {
        const avgRatio =
          buckets.portrait.reduce((sum, a) => sum + a.aspectNumeric, 0) /
          buckets.portrait.length;
        const frameAspect = avgRatio < 0.77 ? '3 / 4' : '4 / 5';
        const maxCols: 2 | 3 | 4 = buckets.portrait.length === 4 ? 4 : 3;
        bands.push({
          id: 'portrait',
          bucket: 'portrait',
          label: frameAspect === '3 / 4' ? 'Portrait Posters · 3:4' : 'Portrait Socials · 4:5',
          frameAspect,
          rows: buildRowsForBand(buckets.portrait, maxCols),
        });
      }

      if (buckets.tall.length > 0) {
        const allVideos = buckets.tall.every((a) => a.mediaType === 'video');
        const maxCols: 2 | 3 | 4 = allVideos && buckets.tall.length === 4 ? 4 : 3;
        bands.push({
          id: 'tall',
          bucket: 'tall',
          label: allVideos ? 'Vertical Motion Reels · 9:16' : 'Vertical Standees · 1:2',
          frameAspect: allVideos ? '9 / 16' : '1 / 2',
          rows: buildRowsForBand(buckets.tall, maxCols),
        });
      }
    }
  }

  if (buckets.strip.length > 0) {
    bands.push({
      id: 'strip',
      bucket: 'strip',
      label: 'Fascia & Header Banners',
      frameAspect: '6 / 1',
      rows: buildRowsForBand(buckets.strip, 1),
    });
  }

  return bands;
}

export function splitCredentialsIntoRows(
  credentials: PortfolioAsset[],
): [PortfolioAsset[], PortfolioAsset[]] {
  const rowOne: PortfolioAsset[] = [];
  const rowTwo: PortfolioAsset[] = [];

  credentials.forEach((cert, index) => {
    if (index % 2 === 0) {
      rowOne.push(cert);
    } else {
      rowTwo.push(cert);
    }
  });

  return [rowOne, rowTwo];
}

export function normalizeAssetUrl(url?: string): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const base =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}


