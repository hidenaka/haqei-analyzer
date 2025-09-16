#!/usr/bin/env node
/**
 * Merge one_liners.json into narratives_chain_complete_final.json
 * Usage: node scripts/merge-one-liners.cjs public/data/authoring/narratives_chain_one_liners.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDB = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');
const OUTDB = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.merged.json');

// Normalize known variant characters so one-liner keys match base DB keys
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

function main(){
  const src = process.argv[2];
  if (!src) { console.error('Usage: merge-one-liners.cjs <one_liners.json>'); process.exit(1); }
  const base = JSON.parse(fs.readFileSync(INDB, 'utf8'));
  const linRaw = JSON.parse(fs.readFileSync(path.resolve(src), 'utf8'));

  // Remap one-liner keys to match base variant names
  const hexNameMap = buildHexNameMap(base);
  const lin = {};
  for (const [key, val] of Object.entries(linRaw)) {
    try {
      const [left, triad] = key.split('|').map(s => s.trim());
      const [hex, yao] = left.split(' ').map(s => s.trim());
      const baseHex = hexNameMap.get(canonSimple(hex)) || hex;
      const newKey = `${baseHex} ${yao} | ${triad}`;
      lin[newKey] = val;
    } catch {
      // If parsing fails, keep original
      lin[key] = val;
    }
  }
  const out = {};
  for (const [k,v] of Object.entries(base)) {
    const add = lin[k];
    if (add && add.one_liner) {
      out[k] = { ...v, one_liner: add.one_liner, path_code: add.path_code || '', one_liner_version: add.version || 'v1.0', one_liner_generated_at: add.generated_at || new Date().toISOString() };
    } else {
      out[k] = v;
    }
  }
  fs.writeFileSync(OUTDB, JSON.stringify(out, null, 2));
  console.log('✅ Merged to', OUTDB);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}
