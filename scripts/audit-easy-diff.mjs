#!/usr/bin/env node
// Audit differences of easy between a base commit and HEAD
// Usage: node scripts/audit-easy-diff.mjs --base <sha> --out .serena/audit-easy-diff.json
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(Boolean));
const BASE = opt.base || '92061add6a21c17b698b6a9ba28fc4a3be07ba87';
const OUT = opt.out || '.serena/audit-easy-diff.json';

function gitShow(sha, file){
  try { return execSync(`git show ${sha}:${file}`, { encoding:'utf8', stdio:['ignore','pipe','ignore'] }); } catch { return null; }
}
function listHexFiles(){
  const dir='public/data/scenario-db-easy';
  return fs.readdirSync(dir).filter(f=>/^hex-\d+\.json$/.test(f)).map(f=>path.join(dir,f));
}

function cmpEasy(a,b){ return JSON.stringify(a||null)===JSON.stringify(b||null); }

function norm(s){ return String(s||'').replace(/[\s\u3000]+/g,' ').trim(); }

async function run(){
  const files = listHexFiles();
  const changes=[]; let changedItems=0, totalItems=0;
  for (const fp of files){
    const cur = JSON.parse(fs.readFileSync(fp,'utf8'));
    const oldText = gitShow(BASE, fp); // may be null if file didn't exist
    const old = oldText ? JSON.parse(oldText) : { items:{} };
    const fileItemChanges=[];
    const keys = new Set([...Object.keys(cur.items||{}), ...Object.keys(old.items||{})]);
    for (const k of keys){
      const before = old.items?.[k]?.easy; const after = cur.items?.[k]?.easy;
      if (!cmpEasy(before, after)){
        fileItemChanges.push({ key:k, before, after });
        changedItems++;
      }
      totalItems++;
    }
    if (fileItemChanges.length) changes.push({ file: fp, count: fileItemChanges.length, items: fileItemChanges.slice(0,50) });
  }
  const summary = { base: BASE, totalFiles: files.length, totalItems, changedItems, filesChanged: changes.length };
  await fsp.mkdir(path.dirname(OUT), { recursive: true });
  await fsp.writeFile(OUT, JSON.stringify({ summary, changes }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

run().catch(e=>{ console.error(e); process.exit(1); });

