#!/usr/bin/env node
/**
 * reports one-liner coverage per hexagram (64卦) from the merged DB
 * - Reads: public/data/authoring/narratives_chain_complete_final.merged.json
 * - Reads: public/assets/H384H64database.js (to get H64_DATA order)
 * - Prints per-hex: completed/total (out of 48), percent, and totals
 * - Suggests next hex to work on in King Wen order
 */
const fs = require('fs');
const path = require('path');

const MERGED = path.join(process.cwd(), 'public/data/authoring/narratives_chain_complete_final.merged.json');
const H64JS = path.join(process.cwd(), 'public/assets/H384H64database.js');

// Normalize known variant characters to match DB keys consistently
function normName(s) {
  return String(s)
    .replace(/澤/g, '沢')
    .replace(/随/g, '隨')
    .replace(/觀/g, '観');
}

function loadMerged() {
  const raw = fs.readFileSync(MERGED, 'utf-8');
  return JSON.parse(raw);
}

function loadH64Names() {
  const js = fs.readFileSync(H64JS, 'utf-8');
  const m = js.match(/H64_DATA\s*=\s*\[(\s|\S)*?\];/);
  if (!m) throw new Error('H64_DATA not found');
  const arrText = m[0].replace(/^.*?\[/s, '[').replace(/];\s*$/, ']');
  const arr = JSON.parse(arrText);
  // Normalize to DB forms for stable lookup
  return arr.map(x => ({ no: x['卦番号'], name: normName(x['名前']) }));
}

function main() {
  const merged = loadMerged();
  const h64 = loadH64Names();

  const totals = { have: 0, need: 64 * 6 * 8 };
  const byHex = new Map();

  // Group counts by start.hex
  Object.entries(merged).forEach(([key, val]) => {
    if (!val || !val.start || !val.start.hex) return;
    const hex = normName(val.start.hex);
    const has = typeof val.one_liner === 'string' && val.one_liner.length > 0;
    if (!byHex.has(hex)) byHex.set(hex, { have: 0, total: 0 });
    const rec = byHex.get(hex);
    rec.total += 1;
    if (has) {
      rec.have += 1;
      totals.have += 1;
    }
  });

  const lines = [];
  lines.push('One-liner coverage per hex (King Wen order)');
  lines.push('hexNo  卦名        done/total   percent');
  lines.push('--------------------------------------');

  let nextHex = null;
  for (const { no, name } of h64) {
    const rec = byHex.get(name) || { have: 0, total: 0 };
    const pct = rec.total ? Math.round((rec.have / 48) * 100) : 0;
    const displayName = normName(name);
    lines.push(`${String(no).padEnd(5)}  ${displayName.padEnd(8)}  ${String(rec.have).padStart(2)}/48      ${String(pct).padStart(3)}%`);
    if (!nextHex && rec.have < 48) nextHex = displayName;
  }

  lines.push('');
  const overallPct = Math.round((totals.have / totals.need) * 1000) / 10;
  lines.push(`Overall: ${totals.have}/${totals.need} (${overallPct}%)`);
  if (nextHex) lines.push(`Next to fill: ${nextHex}`);

  console.log(lines.join('\n'));
}

main();
