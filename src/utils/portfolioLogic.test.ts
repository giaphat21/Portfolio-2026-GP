import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  INTRO_HIGHLIGHT_CASE_STUDY,
  PARTNER_LOGOS,
  PHOTOGRAPHY_CASE_STUDIES,
  PORTFOLIO_ASSETS,
  PROJECT_CASE_STUDIES,
  VIDEO_EDIT_CASE_STUDY,
} from '../data/projects.ts';
import { ResolvedAssetState } from '../types/portfolio.ts';
import {
  buildSymmetricLayoutBands,
  chunkSymmetricRowSizes,
  classifyAssetOrientation,
  computeManifestAudit,
  filterArchiveAssets,
  filterCaseStudiesByCategory,
  matchUploadedFilesToAssets,
  splitCredentialsIntoRows,
  stepLightboxIndex,
} from './portfolioLogic.ts';

test('manifest contains unique IDs and all expected project references', () => {
  const ids = new Set(PORTFOLIO_ASSETS.map((a) => a.id));
  assert.equal(ids.size, PORTFOLIO_ASSETS.length);
  assert.ok(PORTFOLIO_ASSETS.length >= 100);

  assert.equal(PROJECT_CASE_STUDIES.length, 12);
  assert.ok(
    PROJECT_CASE_STUDIES.every((p) => p.category !== 'Motion & Recap' && p.category !== 'Photography'),
    'Design case studies should not include Motion & Recap or Photography',
  );
  assert.equal(INTRO_HIGHLIGHT_CASE_STUDY.assetIds.length, 4);
  assert.equal(VIDEO_EDIT_CASE_STUDY.assetIds.length, 12);
  assert.equal(PHOTOGRAPHY_CASE_STUDIES.length, 2);
  assert.equal(
    PHOTOGRAPHY_CASE_STUDIES.reduce((sum, p) => sum + p.assetIds.length, 0),
    9,
  );

  assert.equal(ids.has('gp-banner-1'), false, 'Horizontal Vòng Quay May Mắn strip should be removed');
  const giaPhong29 = PROJECT_CASE_STUDIES.find((p) => p.id === 'gia-phong-2-9');
  assert.ok(giaPhong29);
  assert.deepEqual(giaPhong29.assetIds.slice(-4), [
    'gp-kv-1-png',
    'gp-sieusale-2',
    'gp-png-1',
    'gp-png-2',
  ]);

  const pongDang = PROJECT_CASE_STUDIES.find((p) => p.id === 'pongdang-buffet');
  assert.ok(pongDang);
  assert.equal(pongDang.assetIds.length, 8);
  assert.ok(pongDang.assetIds.includes('pongdang-bua-trua-kho'));
  assert.ok(pongDang.assetIds.includes('pongdang-bua-trua-159k'));
  assert.ok(pongDang.assetIds.includes('pongdang-phao-hoa'));

  const projectIdSet = new Set([
    ...PROJECT_CASE_STUDIES.map((p) => p.id),
    VIDEO_EDIT_CASE_STUDY.id,
  ]);
  assert.equal(PARTNER_LOGOS.length, 10);
  for (const partner of PARTNER_LOGOS) {
    assert.ok(projectIdSet.has(partner.targetProjectId), `Unknown partner target ${partner.targetProjectId}`);
    const logoDisk = path.join(process.cwd(), 'public', partner.logoPath.replace(/^\//, ''));
    assert.ok(fs.existsSync(logoDisk), `Missing partner logo file on disk: ${logoDisk}`);
  }

  for (const asset of PORTFOLIO_ASSETS) {
    const diskPath = path.join(process.cwd(), 'public', asset.uploadedPath.replace(/^\//, ''));
    assert.ok(fs.existsSync(diskPath), `Missing asset file on disk: ${diskPath}`);
    if (asset.posterPath) {
      const posterDisk = path.join(process.cwd(), 'public', asset.posterPath.replace(/^\//, ''));
      assert.ok(fs.existsSync(posterDisk), `Missing poster file on disk: ${posterDisk}`);
    }
  }

  const credentials = PORTFOLIO_ASSETS.filter((a) => a.classification === 'credential');
  assert.equal(credentials.length, 14);
  const [rowOne, rowTwo] = splitCredentialsIntoRows(credentials);
  assert.equal(rowOne.length, 7);
  assert.equal(rowTwo.length, 7);

  for (const project of [
    ...PROJECT_CASE_STUDIES,
    INTRO_HIGHLIGHT_CASE_STUDY,
    VIDEO_EDIT_CASE_STUDY,
    ...PHOTOGRAPHY_CASE_STUDIES,
  ]) {
    assert.ok(project.assetIds.length > 0, `Project ${project.id} should reference assets`);
    for (const assetId of project.assetIds) {
      assert.ok(ids.has(assetId), `Missing asset ${assetId} referenced by ${project.id}`);
    }
  }
});

test('matchUploadedFilesToAssets matches Vietnamese diacritics, hashed names, and spacing', () => {
  const files = [
    { name: 'folder/Phát1.jpg', objectUrl: 'blob:phat1' },
    { name: 'KV__3__fba1e653.jpg', objectUrl: 'blob:kv3' },
    { name: 'Standee  (1).png', objectUrl: 'blob:standee1' },
    { name: 'tap chi.png', objectUrl: 'blob:tapchi' },
  ];

  const matched = matchUploadedFilesToAssets(files, PORTFOLIO_ASSETS);
  assert.equal(matched['portrait-phat-1'], 'blob:phat1');
  assert.equal(matched['gp-kv-3'], 'blob:kv3');
  assert.equal(matched['gp-standee-1'], 'blob:standee1');
  assert.equal(matched['print-tap-chi'], 'blob:tapchi');
});

test('filterCaseStudiesByCategory returns all or matching projects', () => {
  const all = filterCaseStudiesByCategory(PROJECT_CASE_STUDIES, 'All');
  assert.equal(all.length, PROJECT_CASE_STUDIES.length);

  const brand = filterCaseStudiesByCategory(PROJECT_CASE_STUDIES, 'Brand Identity');
  assert.equal(brand.length, 2);
  assert.ok(brand.some((p) => p.id === 'leadership-boost-jci'));
  assert.ok(brand.some((p) => p.id === 'aura-production'));
});

test('filterArchiveAssets filters by classification, project, search query, and missing status', () => {
  const resolvedMap: Record<string, ResolvedAssetState> = {
    'jci-lds-1': { url: 'blob:jci', source: 'local-upload' },
  };

  const mockups = filterArchiveAssets(PORTFOLIO_ASSETS, {
    classification: 'mockup',
  });
  assert.ok(mockups.length > 0);
  assert.ok(mockups.every((a) => a.classification === 'mockup'));

  const ryoSearch = filterArchiveAssets(PORTFOLIO_ASSETS, {
    query: 'Bính Ngọ',
  });
  assert.equal(ryoSearch.length, 6);

  const maDaoSearch = filterArchiveAssets(PORTFOLIO_ASSETS, {
    query: 'Mã đáo',
  });
  assert.equal(maDaoSearch.length, 1);
  assert.equal(maDaoSearch[0].id, 'ryo-3');

  const onlyMissingJci = filterArchiveAssets(PORTFOLIO_ASSETS, {
    projectId: 'leadership-boost-jci',
    onlyMissing: true,
    resolvedMap,
  });
  assert.equal(onlyMissingJci.length, 3);
  assert.ok(onlyMissingJci.every((a) => a.id !== 'jci-lds-1'));
});

test('computeManifestAudit calculates accurate hydrated and missing totals', () => {
  const resolvedMap: Record<string, ResolvedAssetState> = {
    'jci-lds-1': { url: '/assets/aistudio/LDS__1__379e33f7.png', source: 'disk-aistudio' },
    'ryo-3': { url: 'blob:ryo3', source: 'local-upload' },
  };

  const summary = computeManifestAudit(PORTFOLIO_ASSETS, PROJECT_CASE_STUDIES, resolvedMap);
  assert.equal(summary.totalCataloged, PORTFOLIO_ASSETS.length);
  assert.equal(summary.availableCount, 2);
  assert.equal(summary.missingCount, PORTFOLIO_ASSETS.length - 2);
  assert.equal(
    summary.countsByClassification.original +
      summary.countsByClassification.mockup +
      summary.countsByClassification.portrait +
      summary.countsByClassification.credential +
      summary.countsByClassification.motion +
      summary.countsByClassification.tool_icon +
      summary.countsByClassification.document,
    PORTFOLIO_ASSETS.length,
  );
});

test('stepLightboxIndex wraps forward and backward safely', () => {
  assert.equal(stepLightboxIndex(0, 5, 'prev'), 4);
  assert.equal(stepLightboxIndex(4, 5, 'next'), 0);
  assert.equal(stepLightboxIndex(2, 5, 'next'), 3);
  assert.equal(stepLightboxIndex(0, 0, 'next'), -1);
});

test('classifyAssetOrientation separates strip, panoramic, widescreen, landscape, square, portrait, and tall', () => {
  assert.equal(classifyAssetOrientation(14.1), 'strip');
  assert.equal(classifyAssetOrientation(2.7), 'panoramic');
  assert.equal(classifyAssetOrientation(16 / 9), 'widescreen');
  assert.equal(classifyAssetOrientation(2.0), 'widescreen');
  assert.equal(classifyAssetOrientation(4 / 3), 'landscape');
  assert.equal(classifyAssetOrientation(1.0), 'square');
  assert.equal(classifyAssetOrientation(1312 / 1199), 'square');
  assert.equal(classifyAssetOrientation(3 / 4), 'portrait');
  assert.equal(classifyAssetOrientation(0.5), 'tall');
});

test('chunkSymmetricRowSizes never produces orphan single-item rows for counts >= 2', () => {
  for (const maxCols of [2, 3, 4] as const) {
    for (let count = 2; count <= 20; count += 1) {
      const sizes = chunkSymmetricRowSizes(count, maxCols);
      const sum = sizes.reduce((acc, s) => acc + s, 0);
      assert.equal(sum, count, `Sum mismatch for count=${count}, maxCols=${maxCols}`);
      assert.ok(
        sizes.every((s) => s >= 2),
        `Found orphan single-card row in ${JSON.stringify(sizes)} for count=${count}, maxCols=${maxCols}`,
      );
    }
  }
});

test('buildSymmetricLayoutBands covers 100% of every project assets with orientation-pure rows and zero holes', () => {
  const assetsById = new Map(PORTFOLIO_ASSETS.map((a) => [a.id, a]));
  assert.ok(assetsById.has('motion-intro-giaphat'), 'Intro Giaphat.mp4 should be cataloged');

  for (const project of PROJECT_CASE_STUDIES) {
    const projectAssets = project.assetIds
      .map((id) => assetsById.get(id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a));

    const bands = buildSymmetricLayoutBands(projectAssets);
    const placedIds = bands.flatMap((band) => band.rows.flatMap((r) => r.assets.map((a) => a.id)));

    assert.equal(
      placedIds.length,
      projectAssets.length,
      `Project ${project.id} placed ${placedIds.length} instead of ${projectAssets.length}`,
    );

    for (const band of bands) {
      for (const row of band.rows) {
        assert.equal(
          row.assets.length,
          row.columns,
          `Project ${project.id} band ${band.id} row has ${row.assets.length} items for ${row.columns} columns`,
        );
      }

      if (band.bucket === 'square') {
        for (const row of band.rows) {
          for (const item of row.assets) {
            assert.equal(classifyAssetOrientation(item.aspectNumeric), 'square');
          }
        }
      }
    }
  }
});

