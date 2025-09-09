#!/usr/bin/env node
/**
 * Print 8 triad cards (JJJ〜HHH) for a start position
 * - Source of truth: public/data/authoring/narratives_chain_complete_final.json
 * - Start is determined by 卦名+爻（例: "乾為天 初九"）または H384 index
 * - Falls back to 乾為天 初九 when unspecified
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NFILE = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');

// Allowed triad labels (order preserved)
const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

function loadNarratives() {
  const raw = fs.readFileSync(NFILE, 'utf8');
  return JSON.parse(raw);
}

function normalizeStartKey(input) {
  const s = String(input).trim();
  // Expect format: "卦名 爻" e.g. "乾為天 初九"
  return s;
}

function findTriadEntries(db, startKey) {
  const entries = [];
  for (const triad of TRIADS) {
    const key = `${startKey} | ${triad}`;
    if (db[key]) {
      entries.push({ triad, key, data: db[key] });
    }
  }
  return entries;
}

function main() {
  const db = loadNarratives();
  const inputKey = process.argv.slice(2).join(' ').trim();
  const startKey = normalizeStartKey(inputKey || '乾為天 初九');

  const rows = findTriadEntries(db, startKey);
  if (rows.length === 0) {
    console.error(`❌ Triad narratives not found for: ${startKey}`);
    process.exit(2);
  }

  console.log(`🔮 8つのカード（${startKey} 起点, J/H三段階）`);
  for (const { triad, data } of rows) {
    const title = data.triad_headline || triad;
    const long = data.chain_long || '';
    const suit = data.suitability || '';
    const caution = data.caution || '';
    console.log(`
【${triad}】${title}
  適合: ${suit}
  注意: ${caution}
  物語: ${long}
`);
  }
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}

