#!/usr/bin/env node
/**
 * Aggregate one-liners from per-hex work files into a single JSON:
 * - Scans: public/data/authoring/one_liner_work/*.json
 * - Writes: public/data/authoring/narratives_chain_one_liners.json
 * - Key format: "卦名 爻名 | TRIAD" (卦名はベースDBの表記に正規化)
 * - Fields: { one_liner, path_code, version, generated_at }
 *
 * Usage:
 *   node scripts/aggregate-one-liners.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WORK_DIR = path.join(ROOT, 'public/data/authoring/one_liner_work');
const OUT_FILE = path.join(ROOT, 'public/data/authoring/narratives_chain_one_liners.json');
const BASE_DB = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');

function canonSimple(s) {
  return String(s)
    .replace(/澤/g, '沢')
    .replace(/隨/g, '随')
    .replace(/觀/g, '観');
}

function buildHexNameMap(base) {
  const set = new Set();
  Object.keys(base).forEach(k => {
    const hex = k.split('|')[0].trim().split(' ')[0].trim();
    set.add(hex);
  });
  // Map canonical simplified -> actual base name
  const map = new Map();
  for (const name of set) {
    map.set(canonSimple(name), name);
  }
  return map;
}

function loadJSONSafe(fp, fallback) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return fallback; }
}

function main() {
  if (!fs.existsSync(WORK_DIR)) {
    console.error('Work directory not found:', WORK_DIR);
    process.exit(1);
  }

  const base = loadJSONSafe(BASE_DB, {});
  const hexMap = buildHexNameMap(base);

  const out = loadJSONSafe(OUT_FILE, {});
  const now = new Date().toISOString();

  const files = fs.readdirSync(WORK_DIR).filter(f => f.endsWith('.json'));
  let seen = 0, added = 0, updated = 0, skippedEmpty = 0;

  for (const file of files) {
    const fp = path.join(WORK_DIR, file);
    const data = loadJSONSafe(fp, null);
    if (!data || !Array.isArray(data.items)) continue;

    for (const bucket of data.items) {
      const startYao = String(bucket.start_yao || '').trim();
      const combinations = Array.isArray(bucket.combinations) ? bucket.combinations : [];
      for (const combo of combinations) {
        const triad = String(combo.triad || '').trim();
        const pathCode = String(combo.path_code || '').trim();
        const keyRaw = String(combo.key || '').trim();
        const ol = (combo.one_liner || '').trim();
        if (!ol) { skippedEmpty++; continue; }

        // Prefer building key from parts to ensure proper normalization
        // keyRaw format is "卦名 爻名 | TRIAD"; but normalize 卦名
        let hex = '';
        let yao = startYao;
        try {
          const left = keyRaw.split('|')[0].trim();
          const segs = left.split(' ').filter(Boolean);
          hex = segs[0] || '';
          yao = segs[1] || startYao;
        } catch {}

        const baseHex = hexMap.get(canonSimple(hex)) || hex;
        const key = `${baseHex} ${yao} | ${triad}`;

        seen++;
        if (!out[key]) {
          out[key] = { one_liner: ol, path_code: pathCode, version: 'v1.0', generated_at: now };
          added++;
        } else {
          // Overwrite if different and non-empty
          if (typeof out[key].one_liner !== 'string' || out[key].one_liner !== ol) {
            out[key] = { ...out[key], one_liner: ol, path_code: pathCode || out[key].path_code, generated_at: now };
            updated++;
          }
        }
      }
    }
  }

  // Write sorted by key for stable diffs
  const sorted = Object.keys(out).sort().reduce((acc, k) => { acc[k] = out[k]; return acc; }, {});
  fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2));

  console.log('✅ Aggregated one-liners');
  console.log({ files: files.length, seen, added, updated, skippedEmpty, outFile: OUT_FILE });
  console.log('➡️  Next: node scripts/merge-one-liners.cjs public/data/authoring/narratives_chain_one_liners.json');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}

