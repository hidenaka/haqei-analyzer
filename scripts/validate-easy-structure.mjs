#!/usr/bin/env node
// Validate easy structure for presence and non-empty required fields (no length limit)
// Usage: node scripts/validate-easy-structure.mjs --out ./public/data/scenario-db-easy
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (args[i+1] && !args[i+1].startsWith('--')) ? args[i+1] : true] : []).filter(Boolean));
const OUT = opt.out || './public/data/scenario-db-easy';

function isNonEmpty(s){ return String(s||'').trim().length>0; }

async function run(){
  const issues=[]; let total=0;
  for (let h=1; h<=64; h++){
    const file = path.join(OUT, `hex-${h}.json`);
    if (!fs.existsSync(file)) continue;
    const b = JSON.parse(fs.readFileSync(file,'utf8'));
    for (const [key, it] of Object.entries(b.items||{})){
      total++;
      const ez = it.easy;
      if (!ez){ issues.push({ key, err:'missing_easy' }); continue; }
      const n = ez.next3||{};
      const fields = [ez.oneLine, n.first, n.second, n.final];
      const missing = [];
      if (!isNonEmpty(ez.oneLine)) missing.push('oneLine');
      if (!isNonEmpty(n.first)) missing.push('next3.first');
      if (!isNonEmpty(n.second)) missing.push('next3.second');
      if (!isNonEmpty(n.final)) missing.push('next3.final');
      // Ensure arrays (why/hints) have no empty strings if present
      const empties=[];
      for (const arrKey of ['why','hints']){
        const arr = Array.isArray(ez[arrKey]) ? ez[arrKey] : [];
        if (arr.some(x=> !isNonEmpty(x))) empties.push(arrKey);
      }
      if (missing.length || empties.length){ issues.push({ key, missing, empties }); }
    }
  }
  console.log(JSON.stringify({ totalItems: total, issuesCount: issues.length, issues: issues.slice(0,100) }, null, 2));
}

run().catch(e=>{ console.error(e); process.exit(1); });

