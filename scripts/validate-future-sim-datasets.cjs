#!/usr/bin/env node
/**
 * Future Simulator datasets validator
 * - Loads public/assets/H384H64database.js in a VM to access window.H384_DATA / window.H64_DATA
 * - Validates textual completeness for H384 entries (現代解釈の要約, キーワード)
 * - Validates H64 transform map fields
 * - Cross-checks narratives_chain_complete_final.json keys vs H384 names/lines
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const HFILE = path.join(ROOT, 'public/assets/H384H64database.js');
const NFILE = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');

function ok(msg) { console.log('✅', msg); }
function fail(msg) { console.error('❌', msg); }
function warn(msg) { console.warn('⚠️', msg); }

function loadH384H64() {
  const code = fs.readFileSync(HFILE, 'utf8');
  const sandbox = {
    window: {},
    console,
    document: { readyState: 'complete', addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'H384H64database.js' });
  const H384 = sandbox.window.H384_DATA;
  const H64 = sandbox.window.H64_DATA;
  if (!Array.isArray(H384)) throw new Error('H384_DATA not available');
  if (!Array.isArray(H64)) throw new Error('H64_DATA not available');
  return { H384, H64 };
}

function validateH64(H64) {
  let errors = 0;
  if (H64.length !== 64) {
    fail(`H64 length mismatch: ${H64.length} (expected 64)`);
    errors++;
  } else {
    ok('H64 length = 64');
  }
  const req = ['卦番号','名前','初爻変','二爻変','三爻変','四爻変','五爻変','上爻変'];
  for (const row of H64) {
    for (const f of req) {
      if (!(f in row)) { fail(`H64 missing field ${f} in 卦番号=${row.卦番号}`); errors++; }
    }
    for (const f of req.slice(2)) {
      const v = row[f];
      if (!Number.isFinite(Number(v)) || Number(v) < 1 || Number(v) > 64) {
        fail(`H64 invalid transform ${f}=${v} for 卦番号=${row.卦番号}`); errors++;
      }
    }
  }
  if (errors === 0) ok('H64 transform map valid');
  return errors;
}

function validateH384(H384) {
  let errors = 0;
  if (H384.length < 384 || H384.length > 386) {
    fail(`H384 length unexpected: ${H384.length} (expected 384..386)`);
    errors++;
  } else {
    ok(`H384 length = ${H384.length}`);
  }
  const req = ['通し番号','卦番号','卦名','爻'];
  let missingText = 0, missingKw = 0;
  for (const item of H384) {
    for (const f of req) {
      if (!(f in item)) { fail(`H384 missing ${f} at 通し番号=${item.通し番号}`); errors++; }
    }
    // textual completeness
    const summary = item['現代解釈の要約'];
    if (typeof summary !== 'string' || summary.trim().length === 0) missingText++;
    const kw = item['キーワード'];
    if (!Array.isArray(kw) || kw.length === 0) missingKw++;
  }
  if (missingText === 0) ok('H384 全件「現代解釈の要約」あり'); else fail(`H384 要約欠落: ${missingText}`);
  if (missingKw === 0) ok('H384 全件「キーワード」あり'); else warn(`H384 キーワード欠落: ${missingKw}`);
  return errors + missingText;
}

function buildH64NameToNumber(H64) {
  const map = new Map();
  for (const row of H64) {
    map.set(String(row['名前']).trim(), Number(row['卦番号']));
  }
  return map;
}

function normalizeToH64Name(name) {
  const repl = new Map([
    ['澤','沢'], ['隨','随'], ['觀','観'], ['豊','豊'], // noop fallback
    ['豐','豊'], ['歸','帰'], ['濟','済'], ['風','風'],
    ['澤','沢'], ['澤','沢'], // duplicated to be safe
    ['無','无'], // H64 uses 简体 无 in 無妄
    ['恆','恒'], ['壯','壮'], ['晉','晋'],
  ]);
  let s = String(name);
  for (const [from, to] of repl.entries()) {
    s = s.split(from).join(to);
  }
  return s;
}

function lineNameToPos(yao) {
  const s = String(yao);
  if (s.includes('初')) return 1;
  if (s.includes('二')) return 2;
  if (s.includes('三')) return 3;
  if (s.includes('四')) return 4;
  if (s.includes('五')) return 5;
  if (s.includes('上')) return 6;
  return null;
}

function buildH384ByHex(H384) {
  const byHex = new Map();
  for (const item of H384) {
    const hex = Number(item['卦番号']);
    const pos = lineNameToPos(item['爻']);
    if (!Number.isFinite(hex) || !pos) continue;
    if (!byHex.has(hex)) byHex.set(hex, new Array(6));
    const arr = byHex.get(hex);
    arr[pos - 1] = item;
  }
  return byHex;
}

function crossCheckNarrativesWithH384(H384, H64) {
  const raw = fs.readFileSync(NFILE, 'utf8');
  const db = JSON.parse(raw);
  const nameToNum = buildH64NameToNumber(H64);
  const byHex = buildH384ByHex(H384);
  let errors = 0;
  for (const [key, val] of Object.entries(db)) {
    const start = val.start;
    if (!start || typeof start.hex !== 'string' || typeof start.pos !== 'number') {
      fail(`Narratives entry missing valid start: ${key}`);
      errors++;
      continue;
    }
    const normalized = normalizeToH64Name(String(start.hex).trim());
    const hexNum = nameToNum.get(normalized);
    if (!Number.isFinite(hexNum)) {
      fail(`H64 name→number not found for start.hex=${start.hex} (normalized=${normalized}) (key=${key})`);
      errors++;
      continue;
    }
    const line = Number(start.pos) + 1; // pos is 0-based in narratives DB
    const arr = byHex.get(hexNum);
    const h = arr && arr[line - 1];
    if (!h) {
      fail(`H384 group not found for hex=${hexNum} line=${line} (key=${key})`);
      errors++;
    } else if (String(h['卦名']).trim() !== String(start.hex).trim() && String(h['卦名']).trim() !== normalizeToH64Name(String(start.hex).trim())) {
      fail(`H384 cross-mismatch: expected 卦名=${start.hex}, got ${h['卦名']} (key=${key})`);
      errors++;
    }
  }
  if (errors === 0) ok('Cross-check OK: chain DB start positions align with H384 indices');
  return errors;
}

(function main(){
  try {
    console.log('🔍 Loading H384/H64 dataset...');
    const { H384, H64 } = loadH384H64();
    let err = 0;
    err += validateH64(H64);
    err += validateH384(H384);
    err += crossCheckNarrativesWithH384(H384, H64);
    if (err === 0) {
      ok('All datasets validated successfully');
      process.exit(0);
    } else {
      fail(`Validation completed with ${err} issue(s)`);
      process.exit(2);
    }
  } catch (e) {
    fail(e.message);
    process.exit(1);
  }
})();
