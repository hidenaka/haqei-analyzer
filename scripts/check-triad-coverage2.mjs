#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = process.cwd();
const H384_PATH = path.join(root, 'public/assets/H384H64database.js');
let NARR_DB_PATH = path.join(root, 'public/data/authoring/narratives_chain_complete_final.merged.json');

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

const norm = s => String(s || '').replace(/\s+/g,' ').replace(/　+/g,' ').trim();

function writeIf(outPath, text) {
  if (!outPath) return;
  const dir = path.dirname(outPath);
  if (dir && dir !== '.' && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, text, 'utf-8');
}

function main() {
  const args = process.argv.slice(2);
  let outPath = null; let dbPath = null;
  for (let i=0;i<args.length;i++) {
    if ((args[i]==='--out'||args[i]==='-o') && args[i+1]) { outPath=args[i+1]; i++; } else if ((args[i]==='--db'||args[i]==='-d') && args[i+1]) { dbPath=args[i+1]; i++; }
  }
  const H384 = loadH384();
  if (dbPath) NARR_DB_PATH = path.isAbsolute(dbPath)? dbPath : path.join(root, dbPath);
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
      const k1 = `${hexName} ${lineName} | ${t}`;
      const k2 = `${hexName.replace(/\s+/g,'')} ${lineName} | ${t}`;
      if (keys.has(k1) || keys.has(k2)) found++; else missing.push(k1);
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
    writeIf(outPath, missing.join("\n"));
    if (outPath) console.log(`
Missing list written to: ${outPath}`);
  } else {
    console.log('All keys covered.');
  }
}

try { main(); } catch (e) {
  console.error('Coverage check failed:', e.message);
  process.exit(1);
}
