#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(projectRoot, 'public');
const reportPath = path.join(projectRoot, 'public', 'data', 'asset-audit-report.json');

const imageExt = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.ico']);
const includeExt = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.ico', '.js', '.css', '.json']);
const largeAssetThreshold = 200 * 1024;

function collectFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function toRel(file) {
  return path.relative(projectRoot, file).split(path.sep).join('/');
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function main() {
  const files = collectFiles(publicRoot);
  const inspected = [];
  const byType = {
    image: { count: 0, bytes: 0 },
    json: { count: 0, bytes: 0 },
    script: { count: 0, bytes: 0 },
    other: { count: 0, bytes: 0 },
  };

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!includeExt.has(ext)) continue;

    const stat = fs.statSync(file);
    let type = 'other';
    if (imageExt.has(ext)) type = 'image';
    else if (ext === '.json') type = 'json';
    else if (ext === '.js' || ext === '.css') type = 'script';

    byType[type].count += 1;
    byType[type].bytes += stat.size;

    inspected.push({
      path: toRel(file),
      type,
      sizeBytes: stat.size,
      sizeLabel: formatBytes(stat.size),
    });
  }

  inspected.sort((a, b) => b.sizeBytes - a.sizeBytes);

  const largeAssets = inspected.filter((item) => item.sizeBytes >= largeAssetThreshold);
  const largeImages = largeAssets.filter((item) => item.type === 'image');

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      largeAssetBytes: largeAssetThreshold,
      largeAssetLabel: formatBytes(largeAssetThreshold),
    },
    summary: {
      totalInspected: inspected.length,
      largeAssets: largeAssets.length,
      largeImages: largeImages.length,
      byType,
    },
    top20BySize: inspected.slice(0, 20),
    largeAssets,
    recommendations: [
      largeImages.length > 0
        ? 'Convert large raster images to modern formats (webp/avif) and ensure responsive dimensions.'
        : 'No large image assets detected in public/. Keep new graphics in SVG/WebP when adding assets.',
      'Keep lyrics JSON lazy-loaded as implemented; avoid prefetching per-song files on initial page load.',
      'Set long cache TTL for static immutable assets and short TTL for JSON index files at deployment.',
    ],
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Asset audit complete: ${toRel(reportPath)}`);
  console.log(`Total inspected: ${report.summary.totalInspected}`);
  console.log(`Large assets >= ${formatBytes(largeAssetThreshold)}: ${report.summary.largeAssets}`);
  console.log(`Large images: ${report.summary.largeImages}`);
}

main();
