#!/usr/bin/env node
/**
 * Validate narratives_chain_complete_final.json integrity
 * Checks:
 * - Entry count = 3072
 * - Key format: "<卦名> <爻位> | <JJJ..HHH>"
 * - Required fields present and non-empty
 * - triad_headline matches triad_p1 → triad_p2 → triad_p3
 * - Labels in allowed set (8 triads)
 * - 64×6起点ごとに8パターン揃っている
 * - Distribution: each triad has exactly 384 entries
 * - Sample keys exist (e.g., 地天泰 六五 | HHH, 水天需 初九 | JJJ)
 */
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../public/data/authoring/narratives_chain_complete_final.json');

function fail(msg) {
  console.error('❌', msg);
}

function ok(msg) {
  console.log('✅', msg);
}

function warn(msg) {
  console.warn('⚠️', msg);
}

(function main() {
  const start = Date.now();
  console.log('🔍 Validating', FILE);
  let raw;
  try {
    raw = fs.readFileSync(FILE, 'utf8');
  } catch (e) {
    fail(`Cannot read file: ${FILE}`);
    process.exit(1);
  }
  let db;
  try {
    db = JSON.parse(raw);
  } catch (e) {
    fail('JSON parse error: ' + e.message);
    process.exit(1);
  }

  const entries = Object.entries(db);
  const total = entries.length;
  const EXPECTED_TOTAL = 3072;
  if (total !== EXPECTED_TOTAL) {
    fail(`Total entries mismatch. Expected ${EXPECTED_TOTAL}, got ${total}`);
  } else {
    ok(`Total entries: ${total}`);
  }

  const TRIADS = new Set(['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH']);
  const REQUIRED_FIELDS = ['chain_long','tone','suitability','caution','label','start','final','triad_p1','triad_p2','triad_p3','triad_headline','updated_at'];

  const errors = [];
  const triadCounts = new Map();
  const baseKeyToTriads = new Map(); // key: "卦名 爻名" -> Set of triads

  function pushError(key, msg) {
    errors.push({ key, msg });
  }

  // Regex: <卦名> <爻位> | <triad>
  const keyRe = /^(.+?)\s+(初九|初六|九二|六二|九三|六三|九四|六四|九五|六五|上九|上六)\s*\|\s*(JJJ|JJH|JHJ|JHH|HJJ|HJH|HHJ|HHH)$/;

  for (const [key, val] of entries) {
    // key format
    const m = key.match(keyRe);
    if (!m) {
      pushError(key, 'Invalid key format');
      continue;
    }
    const [, hexName, lineName, triad] = m;
    // triad label matches
    if (!TRIADS.has(triad)) pushError(key, `Unknown triad: ${triad}`);
    if (val.label !== triad) pushError(key, `label mismatch: label=${val.label} keyTriad=${triad}`);

    // required fields presence
    for (const f of REQUIRED_FIELDS) {
      if (!(f in val)) pushError(key, `missing field: ${f}`);
    }

    // types / non-empty
    if (typeof val.chain_long !== 'string' || val.chain_long.trim().length < 10) pushError(key, 'chain_long too short');
    if (typeof val.tone !== 'string' || !val.tone) pushError(key, 'tone invalid');
    if (typeof val.suitability !== 'string' || !val.suitability) pushError(key, 'suitability invalid');
    if (typeof val.caution !== 'string' || !val.caution) pushError(key, 'caution invalid');
    if (typeof val.triad_p1 !== 'string' || !val.triad_p1) pushError(key, 'triad_p1 invalid');
    if (typeof val.triad_p2 !== 'string' || !val.triad_p2) pushError(key, 'triad_p2 invalid');
    if (typeof val.triad_p3 !== 'string' || !val.triad_p3) pushError(key, 'triad_p3 invalid');
    if (typeof val.triad_headline !== 'string' || !val.triad_headline.includes('→')) pushError(key, 'triad_headline invalid');

    // headline consistency
    const parts = val.triad_headline.split('→').map(s => s.trim());
    if (parts.length !== 3) pushError(key, 'triad_headline must contain 3 parts');
    else {
      if (parts[0] !== val.triad_p1 || parts[1] !== val.triad_p2 || parts[2] !== val.triad_p3) {
        pushError(key, 'triad_headline does not match triad_p1/p2/p3');
      }
    }

    // start/final structure
    if (!val.start || typeof val.start.hex !== 'string' || typeof val.start.pos !== 'number' || typeof val.start.name !== 'string') {
      pushError(key, 'start object invalid');
    }
    if (!val.final || typeof val.final.hex !== 'string' || typeof val.final.pos !== 'number') {
      pushError(key, 'final object invalid');
    }
    // pos range 0..5
    if (val.start && (val.start.pos < 0 || val.start.pos > 5)) pushError(key, 'start.pos out of range');
    if (val.final && (val.final.pos < 0 || val.final.pos > 5)) pushError(key, 'final.pos out of range');

    // base key coverage map
    const base = `${hexName} ${lineName}`;
    if (!baseKeyToTriads.has(base)) baseKeyToTriads.set(base, new Set());
    baseKeyToTriads.get(base).add(triad);

    // triad counts
    triadCounts.set(triad, (triadCounts.get(triad) || 0) + 1);
  }

  // coverage check: each base has 8 triads
  const missingPerBase = [];
  for (const [base, triads] of baseKeyToTriads.entries()) {
    for (const t of TRIADS) {
      if (!triads.has(t)) missingPerBase.push({ base, missing: t });
    }
  }

  if (missingPerBase.length > 0) {
    fail(`Missing triads per base (${missingPerBase.length} cases). First 10:`);
    missingPerBase.slice(0, 10).forEach(x => console.error('  -', x.base, 'missing', x.missing));
  } else {
    ok('Each base (卦名+爻位) has all 8 triads');
  }

  // triad distribution
  let triadDistOk = true;
  for (const t of TRIADS) {
    const c = triadCounts.get(t) || 0;
    if (c !== 384) {
      triadDistOk = false;
      fail(`Triad ${t} count mismatch: ${c} (expected 384)`);
    }
  }
  if (triadDistOk) ok('Triad distribution correct (384 each)');

  // sample presence
  const samples = [
    '地天泰 六五 | HHH',
    '水天需 初九 | JJJ',
  ];
  for (const s of samples) {
    if (db[s]) ok(`Sample exists: ${s}`); else fail(`Sample missing: ${s}`);
  }

  if (errors.length > 0) {
    fail(`Found ${errors.length} data issues. Showing up to 20:`);
    errors.slice(0, 20).forEach(e => console.error(` - [${e.key}] ${e.msg}`));
  } else {
    ok('No structural/content errors detected');
  }

  const duration = Date.now() - start;
  console.log(`\n📋 Summary`);
  console.log(` - Entries: ${total}`);
  console.log(` - Bases (卦×爻): ${baseKeyToTriads.size}`);
  console.log(` - Errors: ${errors.length}`);
  console.log(` - Duration: ${duration}ms`);

  // Exit with non-zero if any failures
  if (total !== EXPECTED_TOTAL || errors.length > 0 || missingPerBase.length > 0 || !triadDistOk) {
    process.exit(2);
  }
  process.exit(0);
})();

