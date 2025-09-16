#!/usr/bin/env node
/**
 * Prepare per-hexagram work items for one-liner authoring.
 * - Outputs for each start (卦名+爻) x TRIAD the 3-step destinations with H384 snippets
 * - Helps human authors craft one-liners with context
 * Usage:
 *   node scripts/prepare-one-liner-work-items.cjs --hex 乾為天
 *   node scripts/prepare-one-liner-work-items.cjs --all (writes multiple files)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const HFILE = path.join(ROOT, 'public/assets/H384H64database.js');
const NFILE = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');
const OUTDIR = path.join(ROOT, 'public/data/authoring/one_liner_work');

const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

// Canonicalize name variants to support simplified/traditional differences
function canonNameSimple(s) {
  return String(s)
    .replace(/澤/g, '沢')
    .replace(/隨/g, '随')
    .replace(/觀/g, '観');
}

// Map to H64_DATA name variants for lookup
function toH64Name(s) {
  // H64 uses: 澤, 隨, 観（混在）。
  return String(s)
    .replace(/沢/g, '澤')
    .replace(/随/g, '隨');
}

function loadH() {
  const code = fs.readFileSync(HFILE, 'utf8');
  const sandbox = { window: {}, console: { log(){}, warn(){}, error(){} }, document: { readyState:'complete', addEventListener(){} } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  const H384 = sandbox.window.H384_DATA;
  const H64 = sandbox.window.H64_DATA;
  if (!Array.isArray(H384) || !Array.isArray(H64)) throw new Error('H384/H64 load failed');
  return { H384, H64 };
}

function loadDB() {
  const raw = fs.readFileSync(NFILE, 'utf8');
  return JSON.parse(raw);
}

function argMap() {
  const args = process.argv.slice(2);
  const map = {}; let k=null;
  for (const a of args) {
    if (a.startsWith('--')) { k=a.replace(/^--/,''); map[k]=true; k=a.replace(/^--/,''); continue; }
    if (k) { map[k]=a; k=null; }
  }
  return map;
}

function lineFromPos(pos) { return Number(pos)+1; }

function buildH64Maps(H64) {
  const byNum = new Map(); const nameToNum = new Map();
  for (const r of H64) {
    byNum.set(Number(r['卦番号']), r);
    // store both raw and canonical variants for robustness
    const raw = String(r['名前']).trim();
    nameToNum.set(raw, Number(r['卦番号']));
    nameToNum.set(canonNameSimple(raw), Number(r['卦番号']));
  }
  return { byNum, nameToNum };
}

function lineNameToPos(n){
  const s=String(n);
  if (s.includes('初')) return 1;
  if (s.includes('二')) return 2;
  if (s.includes('三')) return 3;
  if (s.includes('四')) return 4;
  if (s.includes('五')) return 5;
  if (s.includes('上')) return 6;
  return null;
}

function buildH384ByHex(H384){
  const by=new Map();
  for (const e of H384){
    const hex=Number(e['卦番号']);
    const pos=lineNameToPos(e['爻']);
    if (!hex || !pos) continue;
    if (!by.has(hex)) by.set(hex, new Array(6));
    by.get(hex)[pos-1]=e;
  }
  return by;
}

let H384_BY_HEX=null;
function h384(H384, hex, line) {
  if (!H384_BY_HEX) H384_BY_HEX=buildH384ByHex(H384);
  const arr=H384_BY_HEX.get(hex);
  return arr ? arr[line-1] : null;
}

function transHex(byNum, hex, line) {
  const r = byNum.get(hex); if (!r) return hex;
  const key = line===1?'初爻変':line===2?'二爻変':line===3?'三爻変':line===4?'四爻変':line===5?'五爻変':'上爻変';
  const v = Number(r[key]); return Number.isFinite(v)?v:hex;
}

function step(state, ch, maps){
  if (ch==='J') return { hex: state.hex, line: state.line<6?state.line+1:1, kind:'進爻' };
  return { hex: transHex(maps.byNum, state.hex, state.line), line: state.line, kind:'変爻' };
}

function summarizeEntry(e){
  if (!e) return { 卦名: '', 爻: '', キーワード: '', 要約: '' };
  const kw = Array.isArray(e['キーワード'])? e['キーワード'].slice(0,2).join(' / '): '';
  const sum = String(e['現代解釈の要約']||'').trim();
  return { 卦名: e['卦名'], 爻: e['爻'], キーワード: kw, 要約: sum };
}

function makeWorkForStart(hexName, startYaoName, triad, maps, H384){
  const h64Name = toH64Name(String(hexName).trim());
  const hexNum = maps.nameToNum.get(h64Name) || maps.nameToNum.get(canonNameSimple(h64Name));
  const line = (startYaoName && startYaoName.includes) ?
    (startYaoName.includes('初')?1:startYaoName.includes('二')?2:startYaoName.includes('三')?3:startYaoName.includes('四')?4:startYaoName.includes('五')?5:startYaoName.includes('上')?6:1)
    : 1;
  let state = { hex: Number(hexNum), line };
  const steps = [];
  for (let i=0;i<3;i++) {
    state = step(state, triad[i], maps);
    steps.push( summarizeEntry(h384(H384, state.hex, state.line)) );
  }
  return { triad, path_code: triad.replace(/J/g,'進').replace(/H/g,'変').split('').join('→'), steps };
}

function main(){
  const { H384, H64 } = loadH();
  const maps = buildH64Maps(H64);
  const db = loadDB();
  const args = argMap();
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

  const targetHex = args.hex ? String(args.hex).trim() : null; const doAll = !!args.all;
  const targetCanon = targetHex ? canonNameSimple(targetHex) : null;
  const grouped = new Map(); // key: canonical hex name
  const firstHexDisplay = new Map(); // canonical -> display name to use in filename
  for (const [key, val] of Object.entries(db)) {
    const [left, triadRaw] = key.split('|').map(s=>s.trim());
    const [hexName] = left.split(' ');
    const hexCanon = canonNameSimple(hexName);
    if (targetCanon && hexCanon !== targetCanon) continue;
    if (!grouped.has(hexCanon)) grouped.set(hexCanon, []);
    grouped.get(hexCanon).push({ key, triad: triadRaw, entry: val, hexName });
    if (!firstHexDisplay.has(hexCanon)) firstHexDisplay.set(hexCanon, targetHex || hexName);
  }

  if (!doAll && !targetHex) {
    console.log('Usage: --hex 卦名 | --all');
    process.exit(0);
  }

  for (const [hexCanon, list] of grouped.entries()) {
    const outHexName = firstHexDisplay.get(hexCanon) || list[0]?.hexName || hexCanon;
    const out = { hexagram: outHexName, generated_at: new Date().toISOString(), items: [] };
    // group by start key (爻) for readability
    const byStart = new Map();
    for (const it of list) {
      const startKey = db[it.key].start?.name || it.key.split(' ')[1];
      if (!byStart.has(startKey)) byStart.set(startKey, []);
      byStart.get(startKey).push(it);
    }
    for (const [startYao, arr] of byStart.entries()) {
      const bucket = { start_yao: startYao, combinations: [] };
      // keep triads in fixed order
      TRIADS.forEach(t => {
        const hit = arr.find(a => a.triad === t);
        if (hit) bucket.combinations.push({ key: hit.key, ...makeWorkForStart(outHexName, startYao, t, maps, H384), one_liner: "" });
      });
      out.items.push(bucket);
    }
    const ofile = path.join(OUTDIR, `${outHexName}.json`);
    fs.writeFileSync(ofile, JSON.stringify(out, null, 2));
    console.log('✅ Wrote', ofile);
    if (!doAll) break;
  }
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e.message); process.exit(1); }
}
