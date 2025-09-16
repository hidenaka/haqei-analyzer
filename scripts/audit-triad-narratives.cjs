#!/usr/bin/env node
/**
 * Audit triad narratives for duplication and variation
 * - Loads public/data/authoring/narratives_chain_complete_final.json
 * - Computes duplication rates per triad (JJJ..HHH) across different starts
 * - Checks within a start: how distinct are the 8 chain_long texts
 * - Prints a concise summary and sample duplicates
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');

function loadDB() {
  const raw = fs.readFileSync(FILE, 'utf8');
  return JSON.parse(raw);
}

function keyParts(k) {
  // format: "卦名 爻 | TRIAD"
  const [left, triad] = k.split('|').map(s => s.trim());
  return { start: left, triad };
}

function normalize(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function jaccard(a, b) {
  const sa = new Set(a.split(' '));
  const sb = new Set(b.split(' '));
  const inter = new Set([...sa].filter(x => sb.has(x))).size;
  const uni = new Set([...sa, ...sb]).size;
  return uni === 0 ? 0 : inter / uni;
}

function main() {
  const db = loadDB();
  const triads = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

  // Group by triad
  const byTriad = new Map();
  // Group by start
  const byStart = new Map();

  for (const [k, v] of Object.entries(db)) {
    const { start, triad } = keyParts(k);
    const text = normalize(v.chain_long);
    if (!byTriad.has(triad)) byTriad.set(triad, []);
    byTriad.get(triad).push({ key: k, start, text });
    if (!byStart.has(start)) byStart.set(start, []);
    byStart.get(start).push({ triad, text, key: k });
  }

  // 1) Across-start duplication per triad
  const triadDupSummary = [];
  for (const t of triads) {
    const arr = byTriad.get(t) || [];
    const seen = new Map();
    let exactDup = 0;
    for (const item of arr) {
      const sig = item.text;
      const prev = seen.get(sig) || 0;
      seen.set(sig, prev + 1);
    }
    for (const [, count] of seen.entries()) {
      if (count > 1) exactDup += count;
    }
    const dupRate = arr.length ? (exactDup / arr.length) : 0;
    triadDupSummary.push({ triad: t, entries: arr.length, exactDupCount: exactDup, exactDupRate: dupRate });
  }

  // 2) Within-start variation (8 triads for the same start)
  const withinStartSummary = [];
  for (const [start, arr] of byStart.entries()) {
    // measure pairwise jaccard average
    let pairs = 0, sumJ = 0, exactDup = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        pairs++;
        const ji = jaccard(arr[i].text, arr[j].text);
        sumJ += ji;
        if (arr[i].text === arr[j].text) exactDup++;
      }
    }
    const avgJ = pairs ? (sumJ / pairs) : 0;
    withinStartSummary.push({ start, triads: arr.length, avgJaccard: Number(avgJ.toFixed(3)), exactDupPairs: exactDup });
  }

  // Sort summaries for readability
  triadDupSummary.sort((a,b) => b.exactDupRate - a.exactDupRate);
  withinStartSummary.sort((a,b) => b.avgJaccard - a.avgJaccard);

  // Print concise report
  console.log('=== Triad Narratives Duplication Report ===');
  console.log('\n1) Across-start duplication per triad (exact text match):');
  triadDupSummary.forEach(s => {
    console.log(`- ${s.triad}: entries=${s.entries}, exactDup=${s.exactDupCount}, rate=${(s.exactDupRate*100).toFixed(1)}%`);
  });

  console.log('\n2) Within-start variation (8 triads same start): top 10 by similarity');
  withinStartSummary.slice(0, 10).forEach(s => {
    console.log(`- ${s.start}: triads=${s.triads}, avgJaccard=${s.avgJaccard}, exactDupPairs=${s.exactDupPairs}`);
  });

  // 3) Sample duplicates: pick one triad with high duplication
  const worst = triadDupSummary[0];
  if (worst && worst.entries > 0) {
    const arr = byTriad.get(worst.triad) || [];
    const seen = new Map();
    for (const item of arr) {
      const sig = item.text;
      const prev = seen.get(sig) || [];
      prev.push(item.key);
      seen.set(sig, prev);
    }
    const samples = [...seen.entries()].filter(([,keys])=> keys.length>1).slice(0,2);
    console.log(`\n3) Sample exact-duplicate groups for triad ${worst.triad}:`);
    samples.forEach(([text, keys], idx) => {
      console.log(`  Group ${idx+1} (${keys.length} entries)`);
      console.log('  Text:', text.slice(0,160) + (text.length>160?'...':''));
      console.log('  Keys:', keys.slice(0,5).join(' | ') + (keys.length>5?` ...(+${keys.length-5})`:''));
    });
  }
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}
