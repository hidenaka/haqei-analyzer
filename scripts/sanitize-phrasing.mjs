#!/usr/bin/env node
// Sanitize vague phrasing in easy.why and related fields to clearer, plain expressions
// Usage: node scripts/sanitize-phrasing.mjs --out ./public/data/scenario-db-easy
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const OUT = opt.out || './public/data/scenario-db-easy';

function cap(s,n){ const t=String(s||'').trim(); return t.length>n ? (t.slice(0,n-1)+'…') : t; }

const directMap = new Map([
  ['謙と節度が効く', '礼を保ち、ほどよさが続く'],
  ['調和と共有が効く', '調和が広がり、気持ちが合う'],
  ['包容と公平が効く', '受け入れが広がり、かたよりなく進む'],
  ['礼儀が効く', '礼が行き届く'],
  ['礼が効く', '礼が行き届く'],
  ['基盤が効く', '土台がしっかりしている'],
  ['調和が効く', '調和が広がる'],
  ['公平が効く', 'かたよりなく進める'],
  ['準備が効く', '準備が整っている'],
  ['援けが効く', '支えが集まる'],
  ['危険察知が支える', '危ない気配に気づける']
]);

function sanitizeText(s){
  let t = String(s||'');
  directMap.forEach((to, from)=>{
    if (t.includes(from)) t = t.replaceAll(from, to);
  });
  // generic: 「◯◯が効く」→「◯◯で進める/続く」までは避け、保守的に維持
  return cap(t, 25);
}

async function readJson(p){ try { return JSON.parse(await fsp.readFile(p,'utf8')); } catch { return null; } }
async function writeJson(p, obj){ await fsp.writeFile(p, JSON.stringify(obj, null, 2)+'\n','utf8'); }

async function run(){
  let changed=0, files=0;
  for (let h=1; h<=64; h++){
    const p = path.join(OUT, `hex-${h}.json`);
    const b = await readJson(p);
    if (!b || !b.items) continue;
    let fileChanged = false;
    for (const key of Object.keys(b.items)){
      const it = b.items[key];
      if (!it || !it.easy) continue;
      const ez = it.easy;
      if (Array.isArray(ez.why) && ez.why.length){
        const before = ez.why.slice(0);
        ez.why = ez.why.map(sanitizeText);
        if (JSON.stringify(before) !== JSON.stringify(ez.why)) { fileChanged = true; changed++; }
      }
    }
    if (fileChanged){
      await writeJson(p, b);
      files++;
    }
  }
  console.log(JSON.stringify({ filesUpdated: files, itemsChanged: changed }, null, 2));
}

run().catch(e=>{ console.error(e); process.exit(1); });

