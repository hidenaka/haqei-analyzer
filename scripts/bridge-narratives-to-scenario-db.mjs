#!/usr/bin/env node
// Bridge: narratives_chain.v1.json -> scenario-db bundles (64 files, 3072 items)
// Usage:
//   node scripts/bridge-narratives-to-scenario-db.mjs \
//     --narr ./public/data/narratives_chain.v1.json \
//     --hex ./public/data/hexagrams.json \
//     --out ./public/data/scenario-db \
//     --version v2025-09-11 \
//     --serena-session 20250911-bridge
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const NARR = opt.narr || './public/data/narratives_chain.v1.json';
const HEX = opt.hex || './public/data/hexagrams.json';
const OUT = opt.out || './public/data/scenario-db';
const VERSION = opt.version || `v${new Date().toISOString().slice(0,10)}`;
const SERENA_SESSION = opt['serena-session'] || `bridge-${new Date().toISOString().slice(0,10).replaceAll('-','')}`;

function ensureDirSync(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
async function readJson(p){ try { const s = await fsp.readFile(p,'utf8'); return JSON.parse(s); } catch { return null; } }
async function writeJson(p, obj){ const s = JSON.stringify(obj, null, 2); await fsp.writeFile(p, s, 'utf8'); }

function serenaPaths(){
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const ymd = now.toISOString().slice(0,10);
  const dir = path.join('.serena','logs', yyyy);
  const file = path.join(dir, `${ymd}.ndjson`);
  return { dir, file, yyyy, ymd };
}

async function serenaAppend(kind, entry){
  try {
    const { dir, file, ymd } = serenaPaths();
    ensureDirSync(dir);
    const data = { kind, ts: new Date().toISOString(), session: SERENA_SESSION, ...entry };
    await fsp.appendFile(file, JSON.stringify(data)+'\n','utf8');
    const idxPath = path.join('.serena','index.json');
    let idx = await readJson(idxPath);
    if (!idx) idx = { dates:{}, lastUpdated: null };
    if (!idx.dates[ymd]) idx.dates[ymd] = { file: path.posix.join('.serena','logs', ymd.slice(0,4), `${ymd}.ndjson`), sessions:{}, checkpoints:[] };
    const d = idx.dates[ymd];
    const sess = d.sessions[SERENA_SESSION] || { first_ts: null, last_ts: null, count: 0 };
    if (!sess.first_ts) sess.first_ts = data.ts;
    sess.last_ts = data.ts;
    sess.count = Number(sess.count||0) + 1;
    d.sessions[SERENA_SESSION] = sess;
    idx.lastUpdated = data.ts;
    await writeJson(idxPath, idx);
  } catch (e) {
    console.warn('Serena log append failed:', e.message);
  }
}

const lineNameToNum = {
  '初九':1,'九二':2,'九三':3,'九四':4,'九五':5,'上九':6,
  '初六':1,'六二':2,'六三':3,'六四':4,'六五':5,'上六':6
};

function seriesFromTriad(triad){ return Array.from(triad).map(ch=> ch==='J'?'進':'変').join('→'); }

function getLineText(lineStates, hex, line){
  const key = `${Number(hex)}-${Number(line)}`;
  const s = lineStates?.[key] || '';
  return String(s || '').trim() || '';
}

function buildSteps(startHex, startLine, finalHex, finalLine, triad, lineStates){
  const chars = Array.from(triad);
  const step1 = { hex: startHex, line: startLine, action: (chars[0]==='J'?'進':'変'), lineText: getLineText(lineStates, startHex, startLine) };
  // Step2 heuristic
  let midHex = startHex, midLine = startLine;
  if (chars[1] === 'J') {
    midHex = startHex; midLine = Math.min(6, startLine + 1);
  } else {
    midHex = finalHex; midLine = Math.max(1, Math.min(6, finalLine - 1));
  }
  const step2 = { hex: midHex, line: midLine, action: (chars[1]==='J'?'進':'変'), lineText: getLineText(lineStates, midHex, midLine) };
  // Step3 is final
  const step3 = { hex: finalHex, line: finalLine, action: (chars[2]==='J'?'進':'変'), lineText: getLineText(lineStates, finalHex, finalLine) };
  return [step1, step2, step3];
}

function probabilityForTriad(sig){
  const base = { JJJ:0.72, JJH:0.66, JHJ:0.62, JHH:0.58, HJJ:0.56, HJH:0.54, HHJ:0.52, HHH:0.50 }[sig] ?? 0.5;
  return base;
}

async function main(){
  await serenaAppend('session', { type:'start', title:'narratives→scenario-db 変換', intent:'3072件の橋渡し', version: VERSION });
  const narr = await readJson(NARR);
  if (!narr) throw new Error(`narratives not found: ${NARR}`);
  const hexList = await readJson(HEX);
  if (!hexList) throw new Error(`hexagram list not found: ${HEX}`);
  const lineStates = await readJson('./public/data/h384-line-states.json');
  const nameToId = new Map(hexList.map(h=> [String(h.name_jp).trim(), Number(h.hexagram_id)]));
  const aliasMap = new Map([
    ['天沢履','天澤履'],
    ['山地剥','山地剝'],
    ['沢風大過','澤風大過'],
    ['雷沢歸妹','雷沢帰妹'],
    ['天雷無妄','天雷无妄']
  ]);
  const normalizeName = (n)=>{
    const s = String(n||'').trim();
    return aliasMap.get(s) || s;
  };

  ensureDirSync(OUT);
  const sigs = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
  const bundles = new Map();
  let count=0;

  for (const [key, obj] of Object.entries(narr)){
    // Parse key: "<卦名> <爻名> | TRIAD"
    const m = key.match(/^([^\s]+)\s+([^|]+)\|\s*(JJJ|JJH|JHJ|JHH|HJJ|HJH|HHJ|HHH)$/);
    const triad = obj?.label || (m ? m[3] : null);
    const startHexName = obj?.start?.hex || (m ? m[1] : null);
    const startYaoName = obj?.start?.name || (m ? m[2].trim() : null);
    if (!triad || !startHexName || !startYaoName) continue;
    const startHex = nameToId.get(normalizeName(startHexName));
    const startLine = lineNameToNum[String(startYaoName).trim()] || ((Number(obj?.start?.pos) || 0)+1);
    const finalHexName = obj?.final?.hex || startHexName;
    const finalHex = nameToId.get(normalizeName(finalHexName)) || startHex;
    const finalLine = Math.max(1, Math.min(6, (Number(obj?.final?.pos) || 0)+1));
    if (!Number.isFinite(startHex) || !Number.isFinite(startLine)) continue;

    // steps and item
    const steps = buildSteps(startHex, startLine, finalHex, finalLine, triad, lineStates);
    const item = {
      pathSig: triad,
      series: seriesFromTriad(triad),
      steps,
      finalHex,
      finalLine,
      probability: probabilityForTriad(triad),
      meta: { source: 'narratives:v1->bridge' }
    };
    const keyId = `${startHex}_${startLine}_${triad}`;
    // bundle path by startHex
    const bundleKey = startHex;
    if (!bundles.has(bundleKey)) bundles.set(bundleKey, { dbVersion: VERSION, items: {} });
    const bundle = bundles.get(bundleKey);
    bundle.items[keyId] = item;
    count++;
  }

  // Sanity: ensure 64 bundles exist even if empty (to match schema)
  for (let h=1; h<=64; h++) if (!bundles.has(h)) bundles.set(h, { dbVersion: VERSION, items: {} });

  // Write files
  let files=0;
  for (const [h, bundle] of bundles.entries()){
    const outPath = path.join(OUT, `hex-${h}.json`);
    await writeJson(outPath, bundle);
    files++;
  }

  await serenaAppend('implementation', { title:'bridge生成完了', changes_summary: { files, items: count, version: VERSION } });
  await serenaAppend('session', { type:'end', title:'narratives→scenario-db 変換', result:'完了' });
  console.log(JSON.stringify({ status:'ok', files, items: count }, null, 2));
}

main().catch(async (e)=>{
  console.error(e);
  await serenaAppend('checkpoint', { title:'bridge error', error: e?.message||String(e) });
  process.exit(1);
});
