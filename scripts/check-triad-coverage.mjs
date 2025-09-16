#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = process.cwd();
const H384_PATH = path.join(root, 'public/assets/H384H64database.js');
const NARR_DB_PATH = path.join(root, 'public/data/authoring/narratives_chain_complete_final.merged.json');

function loadH384() {
  const code = fs.readFileSync(H384_PATH, 'utf-8');
  const dummyDoc = { addEventListener: () => {}, body: {}, createElement: () => ({}) };
  const context = { console, window: {}, globalThis: {}, document: dummyDoc };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: 'H384H64database.js' });
  const H384 = context.window.H384_DATA || context.H384_DATA || [];
  if (!Array.isArray(H384) || H384.length === 0) {
    throw new Error('Failed to load H384_DATA from assets/H384H64database.js');
  }
  return H384;
}

function loadNarratives() {
  const json = JSON.parse(fs.readFileSync(NARR_DB_PATH, 'utf-8'));
  const keys = new Set(Object.keys(json));
  return { json, keys };
}

const norm = s => String(s || '').trim();

function main() {
  const H384 = loadH384();
  const { keys } = loadNarratives();
  const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

  let total = 0;
  let found = 0;
  const missing = [];

  for (const e of H384) {
    const hexName = norm(e['卦名']);
    const lineName = norm(e['爻']);
    if (!hexName || !lineName) continue;
    for (const t of TRIADS) {
      total++;
      const k = `${hexName} ${lineName} | ${t}`;
      if (keys.has(k)) found++; else missing.push(k);
    }
  }

  const pct = total ? ((found/total)*100).toFixed(2) : '0.00';
  console.log('=== TRIAD Coverage Report ===');
  console.log(`Start points (H384 valid entries) x TRIAD(8) = ${total}`);
  console.log(`Covered: ${found} / ${total} (${pct}%)`);
  if (missing.length) {
    console.log(`Missing keys: ${missing.length}`);
    console.log('Sample:');
    missing.slice(0, 20).forEach(k => console.log('  -', k));
  } else {
    console.log('All keys covered.');
  }
}

try { main(); } catch (e) {
  console.error('Coverage check failed:', e.message);
  process.exit(1);
}
