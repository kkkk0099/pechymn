#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '..');
const sourceFile = path.join(workspaceRoot, 'hymn_script.js');

const outputRoot = path.join(projectRoot, 'public', 'data');
const lyricsRoot = path.join(outputRoot, 'lyrics');
const searchIndexLiteFile = path.join(outputRoot, 'search-index-lite.json');
const legacySearchIndexFile = path.join(outputRoot, 'search-index-fulltext.json');
const summaryFile = path.join(outputRoot, 'collections-summary.json');
const reportFile = path.join(outputRoot, 'data-validation-report.json');

const collectionDefs = [
  { key: 'hymn_a_data', collection: 'hymn_a', midiPrefix: 'p' },
  { key: 'hymn_b_data', collection: 'hymn_b', midiPrefix: 'w' },
  { key: 'hymn_c_data', collection: 'hymn_c', midiPrefix: '' },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readSource(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function loadCollections(sourceCode) {
  const sandbox = {};
  vm.runInNewContext(sourceCode, sandbox, { filename: 'hymn_script.js' });

  const out = {};
  for (const def of collectionDefs) {
    const data = sandbox[def.key];
    if (!data || typeof data !== 'object') {
      throw new Error(`Cannot find ${def.key} in source file.`);
    }
    out[def.collection] = { ...def, data };
  }
  return out;
}

function decodeHtmlEntities(input) {
  return input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripHtmlToText(html) {
  return decodeHtmlEntities(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function normalizeForSearch(text) {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u3000\s]+/g, ' ')
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function numericValueFromId(id) {
  const parts = id.split('_');
  const last = parts[parts.length - 1] || '';
  const parsed = Number.parseInt(last, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function pad3(n) {
  return String(n).padStart(3, '0');
}

function computeRange(dataObj) {
  const numericIds = Object.keys(dataObj)
    .map(numericValueFromId)
    .filter((n) => n !== null);

  if (numericIds.length === 0) {
    return '000-000';
  }

  const min = Math.min(...numericIds);
  const max = Math.max(...numericIds);
  return `${pad3(min)}-${pad3(max)}`;
}

function buildAudioPath(midiPrefix, number) {
  if (!midiPrefix) {
    return '';
  }
  return `midi/${midiPrefix}${number}.mp3`;
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function getCollectionFullFileName(collection) {
  if (collection === 'hymn_a') return 'hymn-a-full.json';
  if (collection === 'hymn_b') return 'hymn-b-full.json';
  if (collection === 'hymn_c') return 'hymn-c-full.json';
  return `${collection}-full.json`;
}

function main() {
  const sourceCode = readSource(sourceFile);
  const collections = loadCollections(sourceCode);

  ensureDir(outputRoot);
  fs.rmSync(lyricsRoot, { recursive: true, force: true });
  fs.rmSync(legacySearchIndexFile, { force: true });

  const searchIndexLite = [];
  const collectionFullItems = {
    hymn_a: [],
    hymn_b: [],
    hymn_c: [],
  };
  const collectionSummary = {};
  const seenIds = new Set();
  const report = {
    generatedAt: new Date().toISOString(),
    sourceFile,
    totalSongs: 0,
    collections: {},
    duplicateIds: [],
    malformedRows: [],
    malformedHtml: [],
    audioMissing: [],
    invalidEncoding: [],
  };

  for (const [collection, meta] of Object.entries(collections)) {
    const range = computeRange(meta.data);

    let collectionCount = 0;
    let missingAudioCount = 0;

    for (const [id, row] of Object.entries(meta.data)) {
      if (!Array.isArray(row) || row.length < 3) {
        report.malformedRows.push({ collection, id });
        continue;
      }

      if (seenIds.has(id)) {
        report.duplicateIds.push(id);
        continue;
      }
      seenIds.add(id);

      const title = String(row[0] ?? '').trim();
      const number = String(row[1] ?? '').trim();
      const lyricsHtml = String(row[2] ?? '');
      const lyricsText = stripHtmlToText(lyricsHtml);
      const normalizedTitle = normalizeForSearch(title);
      const normalizedLyrics = normalizeForSearch(lyricsText);
      const normalizedNumber = normalizeForSearch(number);
      const audioPath = buildAudioPath(meta.midiPrefix, number);

      if ((lyricsHtml.match(/</g) || []).length !== (lyricsHtml.match(/>/g) || []).length) {
        report.malformedHtml.push({ collection, id });
      }

      if (lyricsHtml.includes('\uFFFD') || title.includes('\uFFFD')) {
        report.invalidEncoding.push({ collection, id });
      }

      if (audioPath) {
        const absAudioPath = path.join(workspaceRoot, audioPath);
        if (!fs.existsSync(absAudioPath)) {
          report.audioMissing.push({ collection, id, audioPath });
          missingAudioCount += 1;
        }
      }

      const lyricPayload = {
        id,
        collection,
        number,
        title,
        lyricsHtml,
        categoryRange: range,
        audioPath,
      };

      collectionFullItems[collection].push(lyricPayload);

      searchIndexLite.push({
        id,
        collection,
        number,
        title,
        normalizedTitle,
        normalizedLyrics,
        normalizedNumber,
        categoryRange: range,
        audioPath,
      });

      collectionCount += 1;
    }

    collectionSummary[collection] = {
      count: collectionCount,
      range,
      missingAudioCount,
    };

    report.collections[collection] = {
      count: collectionCount,
      range,
      missingAudioCount,
    };

    report.totalSongs += collectionCount;
  }

  searchIndexLite.sort((a, b) => {
    if (a.collection !== b.collection) {
      return a.collection.localeCompare(b.collection);
    }
    if (a.number !== b.number) {
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    }
    return a.id.localeCompare(b.id);
  });

  writeJson(searchIndexLiteFile, {
    generatedAt: new Date().toISOString(),
    totalSongs: searchIndexLite.length,
    items: searchIndexLite,
  });

  for (const [collection, items] of Object.entries(collectionFullItems)) {
    items.sort((a, b) => {
      if (a.number !== b.number) {
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      }
      return a.id.localeCompare(b.id);
    });

    writeJson(path.join(outputRoot, getCollectionFullFileName(collection)), {
      generatedAt: new Date().toISOString(),
      totalSongs: items.length,
      collection,
      items,
    });
  }

  writeJson(summaryFile, {
    generatedAt: new Date().toISOString(),
    collections: collectionSummary,
  });

  writeJson(reportFile, report);

  console.log(`Generated ${searchIndexLite.length} songs.`);
  console.log(`Search index: ${path.relative(projectRoot, searchIndexLiteFile)}`);
  console.log(`Collection full files: hymn-a-full.json, hymn-b-full.json, hymn-c-full.json`);
  console.log(`Validation report: ${path.relative(projectRoot, reportFile)}`);
  console.log(`Audio missing entries: ${report.audioMissing.length}`);
}

main();
