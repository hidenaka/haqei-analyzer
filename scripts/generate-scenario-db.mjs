#!/usr/bin/env node
// Generate baseline scenario-db bundles (64 files, 384 starts x 8 paths = 3072)
// Usage: node scripts/generate-scenario-db.mjs --out ./public/data/scenario-db --version v2025-09-11 --serena-session 20250911-gen
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const OUT = opt.out || './public/data/scenario-db';
const VERSION = opt.version || 'v2025-09-11';
const SERENA_SESSION = opt['serena-session'] || `gen-${new Date().toISOString().slice(0,10).replaceAll('-','')}`;

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

function triadFromSig(sig){ return String(sig).toUpperCase().replace(/[^JH]/g,''); }
function seriesFromTriad(triad){ return Array.from(triad).map(ch=> ch==='J'?'進':'変').join('→'); }

function getLineText(lineStates, hex, line){
  const key = `${Number(hex)}-${Number(line)}`;
  const s = lineStates?.[key] || '';
  return String(s || '').trim() || '（記述未設定）';
}

function stepForIndex(startHex, startLine, idx, sigChar){
  const action = sigChar === 'J' ? '進' : '変';
  let hex = Number(startHex);
  let line = Number(startLine);
  if (idx === 0) {
    // as-is
  } else if (idx === 1) {
    if (sigChar === 'J') { line = Math.min(6, line + 1); }
    else { hex = (hex % 64) + 1; line = ((line + 1 - 1) % 6) + 1; }
  } else if (idx === 2) {
    if (sigChar === 'J') { line = Math.min(6, line + 1); }
    else { hex = ((hex + 1) % 64) + 1; line = ((line + 2 - 1) % 6) + 1; }
  }
  return { hex, line, action };
}

async function main(){
  await serenaAppend('session', { type:'start', title:'scenario-db 生成', intent:'64バンドル/3072レコードの雛形生成', version: VERSION });
  ensureDirSync(OUT);
  // optional: use line states as source for lineText
  const lineStates = await readJson(path.resolve('public/data/h384-line-states.json'));
  const sigs = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];
  let filesWritten=0, itemsWritten=0;

  for (let h=1; h<=64; h++){
    const items = {};
    for (let line=1; line<=6; line++){
      for (const sig of sigs){
        const triad = triadFromSig(sig);
        const key = `${h}_${line}_${sig}`;
        const steps = Array.from(triad).map((ch, idx)=>{
          const s = stepForIndex(h, line, idx, ch);
          return { ...s, lineText: getLineText(lineStates, s.hex, s.line) };
        });
        const final = steps[2];
        const probBase = { JJJ:0.72, JJH:0.66, JHJ:0.62, JHH:0.58, HJJ:0.56, HJH:0.54, HHJ:0.52, HHH:0.50 }[sig] ?? 0.5;
        const jitter = (((h*7 + line*3 + sig.charCodeAt(0)) % 7) - 3) * 0.005; // ±1.5%
        items[key] = {
          pathSig: sig,
          series: seriesFromTriad(triad),
          steps,
          finalHex: final.hex,
          finalLine: final.line,
          probability: Math.max(0.3, Math.min(0.9, probBase + jitter)),
          meta: { source: `generated:${VERSION}` }
        };
        itemsWritten++;
      }
    }
    const bundle = { dbVersion: VERSION, items };
    const outPath = path.join(OUT, `hex-${h}.json`);
    await writeJson(outPath, bundle);
    filesWritten++;
  }

  await serenaAppend('implementation', { title:'scenario-db 生成完了', changes_summary: { filesWritten, itemsWritten, version: VERSION } });
  await serenaAppend('session', { type:'end', title:'scenario-db 生成', result:'完了' });
  console.log(JSON.stringify({ status:'ok', filesWritten, itemsWritten }, null, 2));
}

main().catch(async (e)=>{
  console.error(e);
  await serenaAppend('checkpoint', { title:'generator error', error: e?.message||String(e) });
  process.exit(1);
});

