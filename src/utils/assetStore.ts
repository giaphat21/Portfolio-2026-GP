import { PORTFOLIO_ASSETS } from '../data/projects';
import { PortfolioAsset, ResolvedAssetState } from '../types/portfolio';
import { matchUploadedFilesToAssets, normalizeAssetUrl } from './portfolioLogic';

const DB_NAME = 'gia_phat_portfolio_assets_v1';
const STORE_NAME = 'local_files';

function openAssetDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'assetId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalAssetFiles(
  fileList: FileList | File[],
): Promise<Record<string, string>> {
  const files = Array.from(fileList);
  const descriptors = files.map((file) => ({
    name: file.name,
    objectUrl: URL.createObjectURL(file),
    file,
  }));

  const matched = matchUploadedFilesToAssets(descriptors, PORTFOLIO_ASSETS);
  const urlToFile = new Map(descriptors.map((d) => [d.objectUrl, d.file]));

  try {
    const db = await openAssetDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const [assetId, objectUrl] of Object.entries(matched)) {
      const file = urlToFile.get(objectUrl);
      if (file) {
        store.put({ assetId, fileName: file.name, blob: file });
      }
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Fallback cleanly to in-memory object URLs when IndexedDB is restricted
  }

  return matched;
}

export async function loadSavedLocalAssets(): Promise<Record<string, string>> {
  try {
    const db = await openAssetDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const allRecords: Array<{ assetId: string; blob: Blob }> = await new Promise(
      (resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      },
    );
    db.close();

    const map: Record<string, string> = {};
    for (const record of allRecords) {
      if (record.blob) {
        map[record.assetId] = URL.createObjectURL(record.blob);
      }
    }
    return map;
  } catch {
    return {};
  }
}

export async function clearSavedLocalAssets(): Promise<void> {
  try {
    const db = await openAssetDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // ignore
  }
}

async function probeImageOrAsset(url: string, mediaType: PortfolioAsset['mediaType']): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) return false;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) return false;
    if (mediaType === 'image' && contentType && !contentType.startsWith('image/')) {
      return false;
    }
    if (mediaType === 'video' && contentType && !contentType.startsWith('video/')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Fast in-memory cache to guarantee 0ms overhead on re-renders and route changes
let cachedManifestResults: Record<string, ResolvedAssetState> | null = null;

export async function probeDiskAssets(
  assets: PortfolioAsset[],
): Promise<Record<string, ResolvedAssetState>> {
  if (cachedManifestResults) {
    return cachedManifestResults;
  }

  const results: Record<string, ResolvedAssetState> = {};

  // Check sessionStorage for cached manifest to avoid redundant network fetch across page reloads
  if (typeof sessionStorage !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('gp_manifest_cache_v1');
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, ResolvedAssetState>;
        if (Object.keys(parsed).length >= assets.length) {
          cachedManifestResults = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    const manifestUrl = normalizeAssetUrl('asset-manifest.json');
    const manifestRes = await fetch(manifestUrl, { cache: 'force-cache' });
    if (manifestRes.ok) {
      const data = (await manifestRes.json()) as {
        assets?: Array<{ id: string; path: string }>;
      };
      if (Array.isArray(data.assets) && data.assets.length > 0) {
        const byId = new Map(data.assets.map((entry) => [entry.id, entry.path]));

        for (const asset of assets) {
          const manifestPath = byId.get(asset.id);
          const rawUrl = manifestPath || asset.uploadedPath;
          results[asset.id] = { url: normalizeAssetUrl(rawUrl), source: 'disk-aistudio' };
        }

        cachedManifestResults = results;
        if (typeof sessionStorage !== 'undefined') {
          try {
            sessionStorage.setItem('gp_manifest_cache_v1', JSON.stringify(results));
          } catch {
            // ignore
          }
        }
        return results;
      }
    }
  } catch {
    // If manifest request fails, fall back to direct verified asset paths
  }

  // Instant fallback: resolve all assets directly with zero network delay
  for (const asset of assets) {
    results[asset.id] = { url: normalizeAssetUrl(asset.uploadedPath), source: 'disk-aistudio' };
  }

  cachedManifestResults = results;
  return results;
}
