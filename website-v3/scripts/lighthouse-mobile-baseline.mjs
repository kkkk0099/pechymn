#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const tmpReportPath = path.join(projectRoot, '.tmp-lighthouse-mobile.json');
const outputPath = path.join(projectRoot, 'public', 'data', 'lighthouse-mobile-baseline.json');
const targetUrl = process.argv[2] || process.env.LIGHTHOUSE_URL || 'http://localhost:4324/';

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeResult(payload) {
  ensureDir(outputPath);
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function scoreOf(lhr, key) {
  const score = lhr?.categories?.[key]?.score;
  return typeof score === 'number' ? Math.round(score * 100) : null;
}

function metricOf(lhr, key) {
  const value = lhr?.audits?.[key]?.numericValue;
  return typeof value === 'number' ? value : null;
}

function main() {
  try {
    if (fs.existsSync(tmpReportPath)) {
      fs.unlinkSync(tmpReportPath);
    }

    const args = [
      'lighthouse',
      targetUrl,
      '--quiet',
      '--output=json',
      `--output-path=${tmpReportPath}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--emulated-form-factor=mobile',
      '--chrome-flags=--headless=new --no-sandbox',
    ];

    const run = spawnSync('npx', args, {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 10 * 60 * 1000,
    });

    if (run.status !== 0 || !fs.existsSync(tmpReportPath)) {
      writeResult({
        generatedAt: new Date().toISOString(),
        targetUrl,
        status: 'unavailable',
        reason: run.stderr?.trim() || run.stdout?.trim() || 'Failed to run lighthouse.',
      });
      console.log(`Lighthouse baseline unavailable: ${path.relative(projectRoot, outputPath)}`);
      return;
    }

    const lhr = JSON.parse(fs.readFileSync(tmpReportPath, 'utf8'));
    const baseline = {
      generatedAt: new Date().toISOString(),
      targetUrl,
      status: 'ok',
      lighthouseVersion: lhr?.lighthouseVersion || null,
      userAgent: lhr?.userAgent || null,
      categories: {
        performance: scoreOf(lhr, 'performance'),
        accessibility: scoreOf(lhr, 'accessibility'),
        bestPractices: scoreOf(lhr, 'best-practices'),
        seo: scoreOf(lhr, 'seo'),
      },
      metrics: {
        firstContentfulPaintMs: metricOf(lhr, 'first-contentful-paint'),
        largestContentfulPaintMs: metricOf(lhr, 'largest-contentful-paint'),
        totalBlockingTimeMs: metricOf(lhr, 'total-blocking-time'),
        cumulativeLayoutShift: metricOf(lhr, 'cumulative-layout-shift'),
        speedIndexMs: metricOf(lhr, 'speed-index'),
      },
    };

    writeResult(baseline);
    fs.unlinkSync(tmpReportPath);
    console.log(`Lighthouse baseline written: ${path.relative(projectRoot, outputPath)}`);
  } catch (error) {
    writeResult({
      generatedAt: new Date().toISOString(),
      targetUrl,
      status: 'unavailable',
      reason: String(error),
    });
    console.log(`Lighthouse baseline unavailable: ${path.relative(projectRoot, outputPath)}`);
  }
}

main();
