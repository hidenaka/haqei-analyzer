#!/usr/bin/env node
/**
 * Spot-check one-liners and compare with long chains (if present).
 * - Reads merged DB: public/data/authoring/narratives_chain_complete_final.merged.json
 * - Options:
 *    --count N             number of random samples (default: 20)
 *    --hex name1,name2     filter by hex names (comma-separated)
 *    --seed S              seed for reproducible sampling
 * - Outputs a console table and writes reports/one_liner_spot_check.json
 */
const fs = require('fs');
const path = require('path');

const MERGED = path.join(process.cwd(), 'public/data/authoring/narratives_chain_complete_final.merged.json');
const OUTDIR = path.join(process.cwd(), 'reports');
const OUTFP = path.join(OUTDIR, 'one_liner_spot_check.json');

const args = process.argv.slice(2);
let count = 20, hexFilter = null, seed = 42;
for (let i=0;i<args.length;i++) {
  if (args[i]==='--count' && args[i+1]) { count = parseInt(args[++i],10)||count; }
  else if (args[i]==='--hex' && args[i+1]) { hexFilter = new Set(args[++i].split(',').map(s=>s.trim()).filter(Boolean)); }
  else if (args[i]==='--seed' && args[i+1]) { seed = String(args[++i]); }
}

function mulberry32(a){
  return function(){ let t = a += 0x6D2B79F5; t = Math.imul(t ^ t>>>15, t | 1);
    t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14)>>>0)/4294967296; };
}

function ruleCheck(text) {
  const issues = [];
  const len = [...text].length;
  const commas = (text.match(/、/g)||[]).length;
  const hasFullStop = text.includes('。');
  if (hasFullStop) issues.push('contains 。');
  if (commas > 2) issues.push(`too many 、(${commas})`);
  if (len < 25 || len > 80) issues.push(`length ${len}`);
  const adviceWords = ['べき','すべき','しよう','しましょう','したほうが','した方が','注意しよう','おすすめ','推奨','必要がある'];
  const bad = adviceWords.find(w=>text.includes(w));
  if (bad) issues.push(`advice: ${bad}`);
  return issues;
}

function main(){
  const merged = JSON.parse(fs.readFileSync(MERGED,'utf-8'));
  const entries = Object.entries(merged)
    .filter(([k,v]) => v && v.start && v.start.hex && typeof v.one_liner === 'string')
    .filter(([k,v]) => !hexFilter || hexFilter.has(v.start.hex));

  // Reservoir-style sampling using seeded RNG for reproducibility
  const rng = mulberry32(Array.from(seed).reduce((a,c)=> (a*31 + c.charCodeAt(0))|0, 1) >>> 0);
  const picked = [];
  for (const e of entries) {
    if (picked.length < count) picked.push(e);
    else {
      const j = Math.floor(rng()* (picked.length+1));
      if (j < picked.length) picked[j] = e;
    }
  }

  const rows = picked.map(([key, val]) => {
    const [left, triad] = key.split('|').map(s=>s.trim());
    const ruleIssues = ruleCheck(val.one_liner);
    const long = val.chain_long || '';
    const longPreview = long ? String(long).slice(0, 80) : '';
    const hasLong = !!(long && long.trim());
    return {
      key,
      hex: val.start.hex,
      start: val.start.name,
      triad,
      one_liner: val.one_liner,
      one_liner_issues: ruleIssues,
      has_chain_long: hasLong,
      chain_long_preview: longPreview,
      final_pos: (val.final && Number.isFinite(val.final.pos)) ? val.final.pos : null,
    };
  });

  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
  fs.writeFileSync(OUTFP, JSON.stringify({ generated_at: new Date().toISOString(), seed, count, rows }, null, 2));

  // Console summary
  const withLong = rows.filter(r=>r.has_chain_long).length;
  const issues = rows.filter(r=>r.one_liner_issues.length);
  console.log(`Spot check ${rows.length} items (hex filter: ${hexFilter?Array.from(hexFilter).join(','):'ALL'})`);
  console.log(`- With chain_long: ${withLong}/${rows.length}`);
  console.log(`- One-liner issues: ${issues.length}`);
  rows.slice(0, Math.min(10, rows.length)).forEach(r => {
    console.log(`\n${r.key}`);
    console.log(`  start: ${r.hex} ${r.start} | triad: ${r.triad} | final.pos: ${r.final_pos}`);
    console.log(`  one_liner: ${r.one_liner}`);
    if (r.one_liner_issues.length) console.log(`  issues: ${r.one_liner_issues.join(', ')}`);
    if (r.has_chain_long) console.log(`  chain_long: ${r.chain_long_preview}...`);
    else console.log(`  chain_long: (none)`);
  });
  console.log(`\nSaved full report: ${OUTFP}`);
}

main();

