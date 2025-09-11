#!/usr/bin/env node
// Rewrite easy fields to situation-focused phrasing for a range of items
// Usage: node scripts/curate-situation-batch.mjs --src ./public/data/scenario-db --out ./public/data/scenario-db-easy --start 0 --count 100 --serena-session 20250911-sit
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const SRC = opt.src || './public/data/scenario-db';
const OUT = opt.out || './public/data/scenario-db-easy';
const START = Number(opt.start || 0);
const COUNT = Number(opt.count || 100);
const SERENA_SESSION = opt['serena-session'] || `sit-${new Date().toISOString().slice(0,10).replaceAll('-','')}`;

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

const cap = (s,n)=>{ const t=String(s||'').trim(); return t.length>n ? (t.slice(0,n-1)+'…') : t; };
const clean = (s)=> String(s||'').replace(/[\s\u3000]+/g,' ').trim();

function phraseFromText(txt, pos){
  const s = String(txt||'');
  if (/(礼|慎|謙|節)/.test(s)) return pos===0 ? '礼が保たれ' : 'ほどよさが保たれ';
  if (/(危|災|険|患)/.test(s)) return pos===1 ? '危険を察し' : '緊張が混じる';
  if (/(和|合|親|比|泰|包)/.test(s)) return '調和が広がる';
  if (/(光|明|昇|晋)/.test(s)) return '光が増す';
  if (/(閉|塞|否|滞)/.test(s)) return '塞がる空気';
  if (/(戻|復|返|反)/.test(s)) return '戻る気配';
  if (/(助|援|支|友|朋)/.test(s)) return '支えが集まる';
  if (/(整|備|準|節)/.test(s)) return '整いが進む';
  if (/(公正|公平|中)/.test(s)) return 'かたよりなく進む';
  return pos===0 ? '静かに進む' : (pos===1 ? '向きが定まる' : '落ち着く');
}

function buildSituationEasy(item){
  const steps = Array.isArray(item.steps) ? item.steps.slice(0,3) : [];
  const s1 = phraseFromText(steps?.[0]?.lineText||'', 0);
  const s2 = phraseFromText(steps?.[1]?.lineText||'', 1);
  const s3 = phraseFromText(steps?.[2]?.lineText||'', 2);
  const headline = cap(`${s1}、${s3}`, 25);
  const why1 = /礼|慎|謙|節/.test(String(steps?.[0]?.lineText||'')) ? '礼儀が効く' : (/和|合|親|包/.test(String(steps?.[0]?.lineText||'')) ? '調和が効く' : '基盤が効く');
  const care = /危|災|険|患/.test(String(steps?.[1]?.lineText||'')) ? '危険察知が支える' : '偏りを抑える';
  const risk = /危|災|険|患/.test(String(steps?.[1]?.lineText||'')) || /危|災|険|患/.test(String(steps?.[2]?.lineText||'')) ? '無理に踏み込むと崩れる' : '緩みで鈍りやすい';
  const after = /閉|塞|否|滞/.test(String(steps?.[2]?.lineText||'')) ? '静まりへ' : (/昇|明|光|晋/.test(String(steps?.[2]?.lineText||'')) ? '明るさへ' : '安定へ');
  const easy = {
    oneLine: headline,
    next3: { first: cap(`${s1}`,25), second: cap(`${s2}`,25), final: cap(`${s3}`,25) },
    why: [ cap(why1,25), cap(care,25) ],
    caution: cap(risk,25),
    outcome: cap(after,25),
    fit: '合う場面: 静かに整えたい',
    avoid: '合わない場面: 速さだけを求める',
    confidenceLabel: (Number(item.probability||0.5)*100>70)?'かなり自信あり':((Number(item.probability||0.5)*100)<30?'データ少なめ':'ふつう'),
    hints: ['状況の流れを見る']
  };
  return easy;
}

async function listAllKeys(){
  const keys=[];
  for (let h=1; h<=64; h++){
    const p = path.join(OUT, `hex-${h}.json`);
    const q = path.join(SRC, `hex-${h}.json`);
    const b = (await readJson(p)) || (await readJson(q));
    if (!b||!b.items) continue;
    for (const k of Object.keys(b.items)) keys.push({ h, key:k });
  }
  keys.sort((a,b)=> a.key.localeCompare(b.key,'ja'));
  return keys;
}

async function saveItem(hex, key, updater){
  const p = path.join(OUT, `hex-${hex}.json`);
  let b = await readJson(p);
  if (!b){ b = await readJson(path.join(SRC, `hex-${hex}.json`)); if (!b) throw new Error('missing bundle'); }
  b.items[key] = await updater(b.items[key]);
  ensureDirSync(path.dirname(p));
  await writeJson(p, b);
}

async function run(){
  await serenaAppend('session', { type:'start', title:'situation curation', intent:`range ${START}..${START+COUNT-1}` });
  const keys = await listAllKeys();
  const target = keys.slice(START, START+COUNT);
  let ok=0, fail=0; const examples=[];
  for (const {h,key} of target){
    const b = (await readJson(path.join(OUT, `hex-${h}.json`))) || (await readJson(path.join(SRC, `hex-${h}.json`)));
    const item = b?.items?.[key]; if (!item) { fail++; continue; }
    const ez = buildSituationEasy(item);
    await saveItem(h, key, async (it)=>{ it.easy = ez; it.meta = it.meta||{}; it.meta.easyCurated = { verified:true, style:'situation-v2', by:'curator-sit', ts:new Date().toISOString() }; return it; });
    if (examples.length<5) examples.push({ key, oneLine: ez.oneLine, next3: ez.next3 });
    ok++;
  }
  await serenaAppend('implementation', { title:'situation curation done', changes_summary:{ ok, fail }, samples: examples });
  await serenaAppend('session', { type:'end', title:'situation curation', result:`ok=${ok}, fail=${fail}` });
  console.log(JSON.stringify({ ok, fail, samples: examples }, null, 2));
}

run().catch(async (e)=>{ console.error(e); await serenaAppend('checkpoint', { title:'situation curation error', error:e?.message||String(e) }); process.exit(1); });

