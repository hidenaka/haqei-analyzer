#!/usr/bin/env node
/**
 * Backfill missing base entries for a given hexagram into
 * public/data/authoring/narratives_chain_complete_final.json
 *
 * - Adds minimal skeleton records so one_liners can merge
 * - Fills: start, final (pos = (start.pos+2)%6), updated_at, triad_p1..p3
 * - Leaves descriptive fields empty (chain_long, tone, suitability, caution, label, triad_headline)
 *
 * Usage:
 *   node scripts/backfill-missing-base-entries.cjs 地風升
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_FP = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');

const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
const STARTS = [
  { name: '六二', pos: 1 },
  { name: '六三', pos: 2 },
  { name: '九五', pos: 4 },
];

function usage() {
  console.log('Usage: node scripts/backfill-missing-base-entries.cjs <hexagram-name>');
}

function nowISO() { return new Date().toISOString(); }

function main(){
  const hex = process.argv[2];
  if (!hex) { usage(); process.exit(1); }

  const raw = fs.readFileSync(BASE_FP, 'utf-8');
  const db = JSON.parse(raw);

  let added = 0; const createdKeys = [];
  for (const s of STARTS) {
    for (const t of TRIADS) {
      const key = `${hex} ${s.name} | ${t}`;
      if (db[key]) continue;
      const finalPos = (s.pos + 2) % 6; // observed pattern in base: pos advances by +2
      db[key] = {
        chain_long: '',
        tone: '',
        suitability: '',
        caution: '',
        label: '',
        start: { hex, pos: s.pos, name: s.name },
        final: { hex, pos: finalPos },
        updated_at: nowISO(),
        triad_p1: '状況開始段階',
        triad_p2: '変化展開段階',
        triad_p3: '完成到達段階',
        triad_headline: ''
      };
      added++; createdKeys.push(key);
    }
  }

  if (added > 0) {
    fs.writeFileSync(BASE_FP, JSON.stringify(db, null, 2));
    console.log(`✅ Backfilled ${added} entries for ${hex}`);
  } else {
    console.log(`No entries added; all present for ${hex}`);
  }
  // Print a short recap
  createdKeys.slice(0, 5).forEach(k => console.log(' +', k));
  if (createdKeys.length > 5) console.log(` ... and ${createdKeys.length - 5} more`);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}

