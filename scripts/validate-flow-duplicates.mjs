#!/usr/bin/env node
// Detect duplicates or near-duplicates inside next3 (first/second/final) and versus headline
// Usage: node scripts/validate-flow-duplicates.mjs --out ./public/data/scenario-db-easy
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(x=>x.length));
const OUT = opt.out || './public/data/scenario-db-easy';

const norm = (s)=> String(s||'').replace(/[、。・\s]/g,'').trim();
function sim(a,b){ const A=[...new Set(norm(a))], B=[...new Set(norm(b))]; if(!A.length||!B.length) return 0; const inter=A.filter(ch=>B.includes(ch)).length; const uni=new Set([...A,...B]).size; return inter/uni; }

async function readJson(p){ try { return JSON.parse(await fsp.readFile(p,'utf8')); } catch { return null; } }

async function run(){
  const issues=[];
  for (let h=1; h<=64; h++){
    const file = path.join(OUT, `hex-${h}.json`);
    if (!fs.existsSync(file)) continue;
    const b = await readJson(file); if(!b||!b.items) continue;
    for (const [key, it] of Object.entries(b.items)){
      const ez = it?.easy; if (!ez) continue;
      const head = String(ez.oneLine||'');
      const n = ez.next3||{};
      const f1 = String(n.first||'');
      const f2 = String(n.second||'');
      const f3 = String(n.final||'');
      const dups = [];
      if (norm(f1) && norm(f1)===norm(f2)) dups.push('first=second');
      if (norm(f2) && norm(f2)===norm(f3)) dups.push('second=final');
      if (norm(f1) && norm(f1)===norm(f3)) dups.push('first=final');
      const sh1 = sim(head, f1), sh2 = sim(head, f2), sh3 = sim(head, f3);
      const near = [];
      if (sh1>=0.85) near.push('head~first');
      if (sh2>=0.85) near.push('head~second');
      if (sh3>=0.85) near.push('head~final');
      if (dups.length || near.length){ issues.push({ key, dups, near, head, next3:{first:f1,second:f2,final:f3} }); }
    }
  }
  console.log(JSON.stringify({ count: issues.length, issues: issues.slice(0,50) }, null, 2));
}

run().catch(e=>{ console.error(e); process.exit(1); });

