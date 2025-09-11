#!/usr/bin/env node
// Interactive curation tool for scenario-db-easy
// Usage examples:
//  - List next uncurated: node scripts/curate-scenario-easy.mjs --list-next 10
//  - Edit one item:       node scripts/curate-scenario-easy.mjs --key 35_2_JJH
//  - Apply from JSON:     node scripts/curate-scenario-easy.mjs --key 35_2_JJH --apply-from ./patch.json
// Data paths are configurable via --src and --out
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const SRC = opt.src || './public/data/scenario-db';
const OUT = opt.out || './public/data/scenario-db-easy';
const KEY = opt.key || '';
const LIST_NEXT = Number(opt['list-next'] || 0);
const APPLY_FROM = opt['apply-from'] || '';
const PHRASES = JSON.parse(fs.readFileSync('scripts/easy-phrase-map.json','utf8'));

function ensureDirSync(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
async function readJson(p){ try { const s = await fsp.readFile(p,'utf8'); return JSON.parse(s); } catch { return null; } }
async function writeJson(p, obj){ const s = JSON.stringify(obj, null, 2); await fsp.writeFile(p, s, 'utf8'); }

const ngWords = Object.keys(PHRASES.ngReplace||{});
const cap = (s,n)=>{ const t=String(s||'').trim(); return t.length>n ? (t.slice(0,n-1)+'…') : t; };
function validateEasy(easy){
  const fields = [easy.oneLine, easy.next3?.first, easy.next3?.second, easy.next3?.final, ...(easy.why||[]), easy.caution, easy.outcome, easy.fit, easy.avoid, easy.confidenceLabel, ...(easy.hints||[])].filter(Boolean);
  const ngHits = [];
  for (const f of fields){ for (const ng of ngWords){ if (String(f).includes(ng)) ngHits.push({ng, text:f}); } }
  const tooLong = fields.filter(t=> String(t).length>25);
  const nonEmpty = fields.every(s=> String(s||'').trim().length>0);
  return { ok: nonEmpty && ngHits.length===0 && tooLong.length===0, ngHits, tooLong: tooLong.length };
}

async function loadBundle(hex){
  const p = path.join(OUT, `hex-${hex}.json`);
  let json = await readJson(p);
  if (!json){
    // fallback to SRC then copy structure
    const src = await readJson(path.join(SRC, `hex-${hex}.json`));
    if (!src) return null;
    json = JSON.parse(JSON.stringify(src));
  }
  return { path: p, json };
}

function parseKey(key){
  const m = String(key).trim().match(/^(\d+)_(\d+)_([A-Z]{3})$/);
  if (!m) return null;
  return { hex: Number(m[1]), line: Number(m[2]), sig: m[3] };
}

async function listNext(n=10){
  const results = [];
  for (let h=1; h<=64 && results.length<n; h++){
    const b = await readJson(path.join(OUT, `hex-${h}.json`)) || await readJson(path.join(SRC, `hex-${h}.json`));
    if (!b || !b.items) continue;
    for (const k of Object.keys(b.items)){
      const it = b.items[k];
      const curated = !!(it?.meta?.easyCurated?.verified);
      if (!curated) results.push(k);
      if (results.length>=n) break;
    }
  }
  console.log(results.join('\n'));
}

async function saveItem(hex, key, updater){
  const { path: outPath, json } = await loadBundle(hex);
  if (!json || !json.items || !json.items[key]) throw new Error('Item not found in bundle');
  const item = json.items[key];
  const updated = await updater(item);
  json.items[key] = updated;
  ensureDirSync(path.dirname(outPath));
  await writeJson(outPath, json);
  return outPath;
}

function prompt(question){
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve=> rl.question(question, ans=>{ rl.close(); resolve(ans); }));
}

async function interactiveEdit(item){
  const ez = item.easy || {};
  const show = (label, val, limit)=> console.log(`- ${label}: ${val||''} (${String(val||'').length}/${limit})`);
  console.log('\nCurrent easy:');
  show('oneLine', ez.oneLine, 20);
  show('next3.first', ez.next3?.first, 25);
  show('next3.second', ez.next3?.second, 25);
  show('next3.final', ez.next3?.final, 25);
  console.log(`- why: ${(ez.why||[]).join(' / ')}`);
  show('caution', ez.caution, 25);
  show('outcome', ez.outcome, 25);
  show('fit', ez.fit, 25);
  show('avoid', ez.avoid, 25);
  console.log(`- confidenceLabel: ${ez.confidenceLabel}`);
  console.log(`- hints: ${(ez.hints||[]).join(' / ')}`);

  const oneLine = cap((await prompt('oneLine (<=20, Enter=keep): ')) || ez.oneLine, 20);
  const n1 = cap((await prompt('next3.first (<=25, Enter=keep): ')) || ez.next3?.first, 25);
  const n2 = cap((await prompt('next3.second (<=25, Enter=keep): ')) || ez.next3?.second, 25);
  const n3 = cap((await prompt('next3.final (<=25, Enter=keep): ')) || ez.next3?.final, 25);
  const why1 = cap((await prompt('why[0] (<=25, Enter=keep/empty): ')) || (ez.why?.[0]||''), 25);
  const why2 = cap((await prompt('why[1] (<=25, Enter=keep/empty): ')) || (ez.why?.[1]||''), 25);
  const caution = cap((await prompt('caution (<=25, Enter=keep): ')) || ez.caution, 25);
  const outcome = cap((await prompt('outcome (<=25, Enter=keep): ')) || ez.outcome, 25);
  const fit = cap((await prompt('fit (<=25, Enter=keep): ')) || ez.fit, 25);
  const avoid = cap((await prompt('avoid (<=25, Enter=keep): ')) || ez.avoid, 25);
  const conf = (await prompt('confidenceLabel [データ少なめ/ふつう/かなり自信あり] (Enter=keep): ')) || ez.confidenceLabel;
  const h1 = cap((await prompt('hint[0] (<=25, Enter=keep/empty): ')) || (ez.hints?.[0]||''), 25);
  const h2 = cap((await prompt('hint[1] (<=25, Enter=keep/empty): ')) || (ez.hints?.[1]||''), 25);

  const easy = {
    oneLine,
    next3: { first: n1, second: n2, final: n3 },
    why: [why1, why2].filter(s=> String(s||'').trim().length>0).slice(0,2),
    caution, outcome, fit, avoid,
    confidenceLabel: conf,
    hints: [h1, h2].filter(s=> String(s||'').trim().length>0).slice(0,2)
  };
  const v = validateEasy(easy);
  if (!v.ok){
    console.log('❌ Validation failed. NG/tooLong:', v.ngHits, v.tooLong);
    const retry = await prompt('Retry edit? (y/N): ');
    if (String(retry).toLowerCase().startsWith('y')) return interactiveEdit(item);
  }
  return easy;
}

async function run(){
  if (LIST_NEXT>0) return listNext(LIST_NEXT);
  if (!KEY) { console.log('Provide --key <hex_line_sig> or --list-next <N>'); return; }
  const parsed = parseKey(KEY);
  if (!parsed) throw new Error('Invalid key format. Expected N_L_TRIAD e.g., 35_2_JJH');
  const { hex } = parsed;
  const { json } = await loadBundle(hex);
  const item = json?.items?.[KEY];
  if (!item) throw new Error('Item not found');

  let easy = null;
  if (APPLY_FROM){
    easy = await readJson(APPLY_FROM);
  } else {
    easy = await interactiveEdit(item);
  }
  const v = validateEasy(easy);
  if (!v.ok) console.log('⚠️ Validation warnings:', v);

  const outPath = await saveItem(hex, KEY, async (it)=>{
    it.easy = easy;
    it.meta = it.meta || {};
    it.meta.easyCurated = { verified: true, by: process.env.USER || process.env.LOGNAME || 'curator', ts: new Date().toISOString() };
    return it;
  });
  console.log('✅ Saved:', KEY, '->', outPath);
}

run().catch(e=>{ console.error(e); process.exit(1); });

