#!/usr/bin/env node
// Validate easy fields for consistency issues (e.g., caution vs outcome overlap)
// Usage: node scripts/validate-easy-consistency.mjs --out ./public/data/scenario-db-easy --limit 200
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const OUT = opt.out || './public/data/scenario-db-easy';
const LIMIT = Number(opt.limit || 0); // if >0, check first N keys

function normalize(s){
  return String(s||'').replace(/[、。・\s]/g,'').trim();
}
function similarity(a,b){
  const A = new Set(Array.from(normalize(a))); // char set
  const B = new Set(Array.from(normalize(b)));
  if (!A.size || !B.size) return 0;
  let inter=0; A.forEach(ch=>{ if (B.has(ch)) inter++; });
  const uni = new Set([...A,...B]).size;
  return inter/uni;
}

async function readJson(p){ try { return JSON.parse(await fsp.readFile(p,'utf8')); } catch { return null; } }

async function listAll(){
  const keys=[];
  for (let h=1; h<=64; h++){
    const p = path.join(OUT, `hex-${h}.json`);
    const b = await readJson(p);
    if (!b||!b.items) continue;
    for (const k of Object.keys(b.items)) keys.push({h, key:k});
  }
  keys.sort((a,b)=> a.key.localeCompare(b.key,'ja'));
  return keys;
}

async function run(){
  const keys = await listAll();
  const target = LIMIT>0 ? keys.slice(0,LIMIT) : keys;
  const issues=[];
  for (const {h,key} of target){
    const p = path.join(OUT, `hex-${h}.json`);
    const b = await readJson(p); if (!b) continue;
    const item = b.items?.[key]; if (!item?.easy) continue;
    const ez = item.easy;
    const c = String(ez.caution||'');
    const o = String(ez.outcome||'');
    const head = String(ez.oneLine||'');
    const flow = ez.next3||{};
    const simCO = similarity(c, o);
    const simHO = similarity(head, o);
    const simHC = similarity(head, c);
    const dup = normalize(c) === normalize(o) || simCO >= 0.85;
    const headTooShort = head.length < 10;
    const flowMissing = !(flow.first && flow.second && flow.final);
    if (dup || headTooShort || flowMissing){
      issues.push({ key, dup, simCO: Number(simCO.toFixed(2)), headTooShort, flowMissing, head, caution:c, outcome:o });
    }
  }
  console.log(JSON.stringify({ checked: target.length, issues }, null, 2));
}

run().catch(e=>{ console.error(e); process.exit(1); });

