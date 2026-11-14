export type AssetClassification =
  | 'original'
  | 'mockup'
  | 'portrait'
  | 'credential'
  | 'motion'
  | 'tool_icon'
  | 'document';

export type DisplayRole = 'hero' | 'supporting' | 'detail' | 'mockup';

export type VisualImportance = 'primary' | 'secondary' | 'supplementary';

export type ProjectCategory =
  | 'Brand Identity'
  | 'Key Visual & Advertising'
  | 'Festive & Social Editorial'
  | 'F&B & Retail Visuals'
  | 'Digital Product & UI'
  | 'Print & Packaging'
  | 'Motion & Recap'
  | 'Photography';

export type SpreadLayoutStyle =
  | 'asymmetric-split'
  | 'campaign-monolith'
  | 'editorial-duet'
  | 'modular-showcase'
  | 'product-system'
  | 'magazine-spread'
  | 'cinema-reel';

export interface PortfolioAsset {
  id: string;
  originalFilename: string;
  uploadedPath: string;
  portfolioPath: string;
  mediaType: 'image' | 'video' | 'pdf';
  projectId: string;
  projectName: string;
  brand: string;
  category: ProjectCategory | 'Personal Identity' | 'Credentials & Toolkit';
  aspectRatio: string;
  aspectNumeric: number;
  dominantColors: string[];
  displayRole: DisplayRole;
  visualImportance: VisualImportance;
  classification: AssetClassification;
  caption: string;
  observedCopy?: string;
  needsLightMat?: boolean;
  posterPath?: string;
}

export interface ProjectCaseStudy {
  id: string;
  indexNumber: string;
  title: string;
  subtitle: string;
  brand: string;
  category: ProjectCategory;
  year: string;
  layoutStyle: SpreadLayoutStyle;
  palette: {
    canvas: string;
    surface: string;
    ink: string;
    mutedInk: string;
    accent: string;
    accentInk: string;
    border: string;
  };
  narrative: string;
  deliverables: string[];
  assetIds: string[];
}

export interface ResolvedAssetState {
  url: string | null;
  source: 'disk-aistudio' | 'disk-portfolio' | 'local-upload' | 'missing';
}

export interface ManifestAuditSummary {
  totalCataloged: number;
  availableCount: number;
  missingCount: number;
  missingAssets: PortfolioAsset[];
  countsByClassification: Record<AssetClassification, number>;
  countsByProject: Array<{
    projectId: string;
    projectName: string;
    total: number;
    available: number;
  }>;
}

export type OrientationBucket =
  | 'strip'
  | 'panoramic'
  | 'widescreen'
  | 'landscape'
  | 'square'
  | 'portrait'
  | 'tall'
  | 'vertical';

export interface SymmetricLayoutRow {
  columns: 1 | 2 | 3 | 4;
  assets: PortfolioAsset[];
}

export interface SymmetricLayoutBand {
  id: string;
  bucket: OrientationBucket;
  label: string;
  frameAspect: string;
  rows: SymmetricLayoutRow[];
}

export interface PartnerLogo {
  id: string;
  name: string;
  discipline: string;
  logoPath: string;
  cardBg: string;
  isLightSurface: boolean;
  targetProjectId: string;
}
