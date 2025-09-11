#!/usr/bin/env node
// ESM script: Convert scenario-db records to easy Japanese fields
// Usage:
//   node scripts/convert-scenario-db-easy.mjs --src ./public/data/scenario-db --out ./public/data/scenario-db-easy [--sample 0.1] [--serena-session 20250911-easy]
//   node scripts/convert-scenario-db-easy.mjs --validate-only --out ./public/data/scenario-db-easy
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const SRC = opt.src || './public/data/scenario-db';
const OUT = opt.out || './public/data/scenario-db-easy';
const SAMPLE = opt.sample ? Number(opt.sample) : null; // e.g. 0.1 for 10%
const VALIDATE_ONLY = !!opt['validate-only'];
const SERENA_SESSION = opt['serena-session'] || `easy-${new Date().toISOString().slice(0,10).replaceAll('-','')}`;

const PHRASES_PATH = path.resolve('scripts/easy-phrase-map.json');
const PHRASES = JSON.parse(fs.readFileSync(PHRASES_PATH, 'utf8'));
const EASY_VERSION = PHRASES.version || `v${new Date().toISOString().slice(0,10)}`;

function ensureDirSync(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function safeSlice(s, max){ const str = String(s||'').trim(); return str.length>max ? (str.slice(0, max-1) + '…') : str; }
function applyNgReplace(s){ let t = String(s||''); for (const [k,v] of Object.entries(PHRASES.ngReplace||{})) t=t.replaceAll(k,v); return t; }
function nonEmpty(s){ return String(s||'').trim().length>0; }

function triadFromSig(sig){ const s = String(sig||'').toUpperCase(); return s.replace(/[^JH]/g,''); }
function oneLineFromTriad(triad){ return PHRASES.triadOneLine[triad] || '状況に合わせて整える'; }

function pickActionVerbs(tags=[]) {
  const verbs = [];
  const map = PHRASES.actionVerbMap || {};
  const uniqTags = Array.from(new Set(tags.filter(Boolean)));
  uniqTags.forEach(tag => { if (map[tag]) verbs.push(map[tag]); });
  if (!verbs.length) verbs.push(map['デフォルト'] || '手を動かす');
  return verbs.slice(0,3);
}

function inferTagsFromSteps(steps=[]) {
  // Heuristic: detect simple tags from lineText/action keywords
  const tags = [];
  const textJoin = steps.map(s=> String(s?.lineText||'')).join(' ');
  if (/信|誠|頼/.test(textJoin)) tags.push('信頼');
  if (/合意|和|同/.test(textJoin)) tags.push('合意');
  if (/危|険|災/.test(textJoin)) tags.push('リスク高め');
  if (/明|示|見える/.test(textJoin)) tags.push('透明性');
  if (/試|験|小さく/.test(textJoin)) tags.push('実験');
  if (/整|調|準/.test(textJoin)) tags.push('調整');
  return Array.from(new Set(tags));
}

function buildNext3(tags){
  const verbs = pickActionVerbs(tags);
  const [a,b,c] = [verbs[0], verbs[1]||verbs[0], verbs[2]||verbs[1]||verbs[0]];
  return { first: safeSlice(applyNgReplace(a), 25), second: safeSlice(applyNgReplace(b), 25), final: safeSlice(applyNgReplace(c), 25) };
}

function buildWhy(tags){
  const why = [];
  if (tags[0]) why.push(safeSlice(applyNgReplace(`今は『${tags[0]}』が強み`), 25));
  if (tags[1]) why.push(safeSlice(applyNgReplace(`途中は『${tags[1]}』に配慮`), 25));
  return why.slice(0,2);
}

function buildCaution(finalAction, prob){
  const cautious = (Number(prob||0) < 0.5);
  if (finalAction === 'H' || finalAction === '変') return safeSlice(applyNgReplace('急がず合意をとって進める'), 25);
  return safeSlice(applyNgReplace(cautious ? '安全を優先する' : '焦らず手早く進める'), 25);
}

function buildOutcome(triad){
  const map = {
    JJJ: '小さく進めて、支持を広げる',
    JJH: '方向を整えて締める',
    JHJ: '向きをそろえて、土台を固める',
    JHH: '前半に切り替え、負荷を抑える',
    HJJ: '最初に切り替え、無理なく伸ばす',
    HJH: '整えてから、最後に締める',
    HHJ: '軸を変えて、道を開く',
    HHH: 'やり方を変え、きれいに締める'
  };
  return safeSlice(applyNgReplace(map[triad] || '進めながら、向きを整える'), 25);
}

function buildFitAvoid(tags){
  const fit = safeSlice(applyNgReplace(tags[0] ? `向いている: 今は『${tags[0]}』が強み` : '向いている: 今ある強みを活かせる'), 25);
  const avoid = safeSlice(applyNgReplace(tags.includes('リスク高め') ? '向かない: 危ない所への気配りが苦手' : '向かない: 気配りが面倒だと感じる'), 25);
  return { fit, avoid };
}

function confidenceLabelFromPct(pct){
  const v = Number(pct||0);
  if (v < 30) return 'データ少なめ';
  if (v > 70) return 'かなり自信あり';
  return 'ふつう';
}

function pickHints(){
  const list = Array.isArray(PHRASES.hints) ? PHRASES.hints : [];
  if (list.length === 0) return [];
  const a = list[0];
  const b = list[1] || list[0];
  return [safeSlice(a, 25), safeSlice(b, 25)];
}

function buildEasy(item){
  const pathSig = String(item.pathSig||'').toUpperCase();
  const triad = triadFromSig(pathSig);
  const steps = Array.isArray(item.steps) ? item.steps : [];
  const tags = inferTagsFromSteps(steps);
  const next3 = buildNext3(tags);
  const why = buildWhy(tags);
  const probPct = Math.round(((item.probability ?? 0.5) * 100));
  const finalAction = (steps[2]?.action || (pathSig.endsWith('H')?'H':'J'));
  const out = {
    oneLine: safeSlice(applyNgReplace(oneLineFromTriad(triad)), 20),
    next3,
    why,
    caution: buildCaution(finalAction, item.probability),
    outcome: buildOutcome(triad),
    ...buildFitAvoid(tags),
    confidenceLabel: confidenceLabelFromPct(probPct),
    hints: pickHints()
  };
  // Validate empties
  if (!nonEmpty(out.oneLine)) out.oneLine = '方向を決めて、進める';
  if (!nonEmpty(out.caution)) out.caution = '安全を優先する';
  if (!nonEmpty(out.outcome)) out.outcome = '小さく進めて、整えて締める';
  if (!Array.isArray(out.why) || out.why.length===0) out.why = ['今の強みを活かせる'];
  if (!Array.isArray(out.hints) || out.hints.length===0) out.hints = ['関係を先に整える'];
  if (!nonEmpty(out.fit)) out.fit = '今の強みを活かせる';
  if (!nonEmpty(out.avoid)) out.avoid = '極端な打ち手だけを好む';
  return out;
}

function enforceLimits(easy){
  const cap = (s, n)=> safeSlice(s, n);
  easy.oneLine = cap(easy.oneLine, 20);
  easy.caution = cap(easy.caution, 25);
  easy.outcome = cap(easy.outcome, 25);
  easy.fit = cap(easy.fit, 25);
  easy.avoid = cap(easy.avoid, 25);
  if (Array.isArray(easy.why)) easy.why = easy.why.slice(0,2).map(s=> cap(s,25));
  if (easy.next3) {
    easy.next3.first = cap(easy.next3.first, 25);
    easy.next3.second = cap(easy.next3.second, 25);
    easy.next3.final = cap(easy.next3.final, 25);
  }
  if (Array.isArray(easy.hints)) easy.hints = easy.hints.slice(0,2).map(s=> cap(s,25));
  return easy;
}

function validateEasy(easy){
  const ngs = Object.keys(PHRASES.ngReplace||{});
  const fields = [
    easy.oneLine,
    easy.next3?.first, easy.next3?.second, easy.next3?.final,
    ...(easy.why||[]), easy.caution, easy.outcome, easy.fit, easy.avoid,
    easy.confidenceLabel, ...(easy.hints||[])
  ].filter(Boolean);
  const ngHits = [];
  fields.forEach((t)=>{
    for (const ng of ngs) if (String(t).includes(ng)) ngHits.push({ ng, text: t });
  });
  const longHits = fields.filter(t=> String(t).length>25);
  const ok = fields.every(nonEmpty) && ngHits.length===0 && longHits.length===0;
  return { ok, ngHits, longHitsCount: longHits.length };
}

async function readJson(p){ try { const s = await fsp.readFile(p,'utf8'); return JSON.parse(s); } catch { return null; } }
async function writeJson(p, obj){ const s = JSON.stringify(obj, null, 2); await fsp.writeFile(p, s, 'utf8'); }

async function listBundles(dir){
  try {
    const all = await fsp.readdir(dir);
    const files = all.filter(f=> /^hex-\d+\.json$/.test(f));
    files.sort((a,b)=> Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
    return files;
  } catch { return []; }
}

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
    // Update index.json (tracked)
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

async function convertOneBundle(inPath, outPath, sampleKeys=null){
  const json = await readJson(inPath);
  if (!json || !json.items) return { count:0, ok:0, ng:0 };
  const out = { ...json };
  const items = json.items;
  const keys = Object.keys(items).filter(k=> !sampleKeys || sampleKeys.has(k));
  let count=0, ok=0, ng=0;
  keys.forEach(key => {
    const item = items[key];
    if (!item) return;
    const easy = enforceLimits(buildEasy({ ...item, pathSig: item.pathSig || key.split('_')[2] }));
    const val = validateEasy(easy);
    if (!item.meta) item.meta = {};
    item.easy = easy;
    item.meta.easyVersion = EASY_VERSION;
    count++;
    ok += val.ok ? 1 : 0;
    ng += val.ok ? 0 : 1;
  });
  out.items = items;
  ensureDirSync(path.dirname(outPath));
  await writeJson(outPath, out);
  return { count, ok, ng };
}

async function run(){
  // validate-only: scan OUT and report
  if (VALIDATE_ONLY) {
    const files = await listBundles(OUT);
    let total=0, empty=0, ng=0;
    for (const f of files) {
      const p = path.join(OUT, f);
      const json = await readJson(p);
      if (!json || !json.items) continue;
      for (const k of Object.keys(json.items)){
        const it = json.items[k];
        total++;
        if (!it.easy) { empty++; continue; }
        const v = validateEasy(it.easy);
        if (!v.ok) ng++;
      }
    }
    console.log(JSON.stringify({ validated: total, easyMissing: empty, invalid: ng }, null, 2));
    return;
  }

  // Session start log
  await serenaAppend('session', { type:'start', title:'scenario-db easy 変換', intent:'全3072件のやさしい日本語化', scope:'converter+maps', version:EASY_VERSION });

  if (!fs.existsSync(SRC)) {
    console.warn(`Source not found: ${SRC}`);
    await serenaAppend('checkpoint', { title:'source missing', path:SRC });
    return;
  }
  ensureDirSync(OUT);

  const bundles = await listBundles(SRC);
  // Sampling logic: take every Nth file if SAMPLE provided
  let target = bundles;
  if (SAMPLE && SAMPLE>0 && SAMPLE<1) {
    const pick = Math.max(1, Math.round(1/SAMPLE));
    target = bundles.filter((_,i)=> i % pick === 0);
  }

  let total=0, okCount=0, ngCount=0;
  for (const f of target) {
    const inPath = path.join(SRC, f);
    const outPath = path.join(OUT, f);
    // For sampling within bundle, we could also sample item keys, but keep simple: full bundle if picked
    const { count, ok, ng } = await convertOneBundle(inPath, outPath, null);
    total += count; okCount += ok; ngCount += ng;
  }

  const summary = { filesProcessed: target.length, itemsProcessed: total, valid: okCount, invalid: ngCount, easyVersion: EASY_VERSION };
  console.log(JSON.stringify({ status:'done', ...summary }, null, 2));

  // Implementation log
  await serenaAppend('implementation', { title:'easy変換完了', changes_summary: summary, next_steps: ['UIでeasy優先表示', '10%→100%拡大'] });
  // Session end log
  await serenaAppend('session', { type:'end', title:'scenario-db easy 変換', result:'完了', remaining: ngCount>0 ? '一部検証修正' : 'なし' });
}

run().catch(async (e)=>{
  console.error(e);
  await serenaAppend('checkpoint', { title:'converter error', error: e?.message||String(e) });
  process.exit(1);
});

