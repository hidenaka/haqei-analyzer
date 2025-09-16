#!/usr/bin/env node
// Curate first N scenario-db items deterministically and mark as verified
// Usage: node scripts/curate-batch.mjs --src ./public/data/scenario-db --out ./public/data/scenario-db-easy --count 100 --serena-session 20250911-curate
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const SRC = opt.src || './public/data/scenario-db';
const OUT = opt.out || './public/data/scenario-db-easy';
const COUNT = Number(opt.count || 100);
const SERENA_SESSION = opt['serena-session'] || `curate-${new Date().toISOString().slice(0,10).replaceAll('-','')}`;
const PHRASES = JSON.parse(fs.readFileSync('scripts/easy-phrase-map.json','utf8'));

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

const NG = Object.keys(PHRASES.ngReplace||{});
const cap = (s,n)=>{ const t=String(s||'').trim(); return t.length>n ? (t.slice(0,n-1)+'…') : t; };
const clean = (s)=>{ let t=String(s||''); for(const [a,b] of Object.entries(PHRASES.ngReplace||{})) t=t.replaceAll(a,b); return t; };

function detectTagsFromText(t){
  const s = String(t||'');
  const tags = [];
  if (/[信真誠]/.test(s)) tags.push('信頼');
  if (/[合和協調]/.test(s)) tags.push('合意');
  if (/[危険災険険険]/.test(s)) tags.push('リスク高め');
  if (/[見明示表]/.test(s)) tags.push('透明性');
  if (/[整調準備直]/.test(s)) tags.push('調整');
  if (/[試験験試小]/.test(s)) tags.push('実験');
  if (/[速急迅早]/.test(s)) tags.push('速度');
  if (/[丁寧慎謙]/.test(s)) tags.push('品質');
  return Array.from(new Set(tags));
}

function verbsForTags(tags){
  const map = PHRASES.actionVerbMap||{};
  const out=[]; tags.forEach(t=>{ if (map[t]) out.push(map[t]); });
  if (!out.length) out.push(map['デフォルト']||'手を動かす');
  return out.slice(0,3);
}

function triadToOneLine(triad){ return PHRASES.triadOneLine[triad] || '状況に合わせて整える'; }

function buildEasyFromItem(item){
  const triad = String(item.pathSig||'').toUpperCase();
  const steps = Array.isArray(item.steps) ? item.steps : [];
  const t1 = detectTagsFromText(steps[0]?.lineText||'');
  const t2 = detectTagsFromText(steps[1]?.lineText||'');
  const tags = Array.from(new Set([...(t1||[]), ...(t2||[])]));
  const verbs = verbsForTags(tags);
  const easy = {
    oneLine: cap(clean(triadToOneLine(triad)), 20),
    next3: { first: cap(clean(verbs[0]||''),25), second: cap(clean(verbs[1]||verbs[0]||''),25), final: cap(clean(verbs[2]||verbs[1]||verbs[0]||''),25) },
    why: [
      t1?.[0] ? cap(clean(`今は『${t1[0]}』が強み`),25) : null,
      t2?.[0] ? cap(clean(`途中は『${t2[0]}』に配慮`),25) : null
    ].filter(Boolean).slice(0,2),
    caution: cap(clean((triad.endsWith('H')||steps[2]?.action==='変') ? '急がず合意をとって進める' : '安全を優先する'),25),
    outcome: cap(clean(({
      JJJ:'小さく進めて、支持を広げる', JJH:'方向を整えて締める', JHJ:'向きをそろえて、土台を固める', JHH:'前半に切り替え、負荷を抑える',
      HJJ:'最初に切り替え、無理なく伸ばす', HJH:'整えてから、最後に締める', HHJ:'軸を変えて、道を開く', HHH:'やり方を変え、きれいに締める'
    })[triad]||'進めながら、向きを整える'),25),
    fit: cap(clean(tags[0] ? `向いている: 今は『${tags[0]}』が強み` : '向いている: 今ある強みを活かせる'),25),
    avoid: cap(clean(tags.includes('リスク高め') ? '向かない: 危ない所への気配りが苦手' : '向かない: 気配りが面倒だと感じる'),25),
    confidenceLabel: (Number(item.probability||0.5)*100>70)?'かなり自信あり':((Number(item.probability||0.5)*100)<30?'データ少なめ':'ふつう'),
    hints: [ '関係を先に整える', '利害を見える形に' ].slice(0,2)
  };
  return easy;
}

function validate(ez){
  const fields = [ez.oneLine, ez.next3?.first, ez.next3?.second, ez.next3?.final, ...(ez.why||[]), ez.caution, ez.outcome, ez.fit, ez.avoid, ez.confidenceLabel, ...(ez.hints||[])].filter(Boolean);
  if (!fields.every(s=> String(s||'').trim().length>0)) return false;
  if (fields.some(s=> String(s).length>25)) return false;
  for (const f of fields){ for (const ng of NG){ if (String(f).includes(ng)) return false; } }
  return true;
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
  keys.sort((a,b)=> a.key.localeCompare(b.key, 'ja')); // deterministic
  return keys;
}

async function saveItem(hex, key, updater){
  const p = path.join(OUT, `hex-${hex}.json`);
  let b = await readJson(p);
  if (!b){
    b = await readJson(path.join(SRC, `hex-${hex}.json`));
    if (!b) throw new Error('missing bundle');
  }
  b.items[key] = await updater(b.items[key]);
  ensureDirSync(path.dirname(p));
  await writeJson(p, b);
}

async function run(){
  await serenaAppend('session', { type:'start', title:'scenario-easy batch curation', intent:`first ${COUNT} items` });
  const keys = await listAllKeys();
  const target = keys.slice(0, COUNT);
  let ok=0, fail=0; const samples=[];
  for (const {h,key} of target){
    const b = (await readJson(path.join(OUT, `hex-${h}.json`))) || (await readJson(path.join(SRC, `hex-${h}.json`)));
    const item = b?.items?.[key];
    if (!item) { fail++; continue; }
    const ez = buildEasyFromItem(item);
    if (!validate(ez)) { fail++; samples.push({ key, ez }); continue; }
    await saveItem(h, key, async (it)=>{ it.easy = ez; it.meta = it.meta||{}; it.meta.easyCurated = { verified:true, by:'curator-batch', ts:new Date().toISOString() }; return it; });
    ok++;
  }
  await serenaAppend('implementation', { title:'batch curation complete', changes_summary:{ curated: ok, failed: fail } });
  await serenaAppend('session', { type:'end', title:'scenario-easy batch curation', result:`ok=${ok}, fail=${fail}` });
  console.log(JSON.stringify({ curated: ok, failed: fail }, null, 2));
}

run().catch(async (e)=>{ console.error(e); await serenaAppend('checkpoint', { title:'curate-batch error', error:e?.message||String(e) }); process.exit(1); });

