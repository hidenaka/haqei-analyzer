#!/usr/bin/env node
// Locate a checkpoint and output concatenated events until that point (dry-run)

import fs from 'fs';
import path from 'path';

function readIndex() {
  const p = path.join(process.cwd(), '.serena', 'index.json');
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return { dates: {}, lastUpdated: '' }; }
}

function readNDJSON(file) {
  try {
    return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

function parseArgs(argv) {
  const out = {}; for (let i=2;i<argv.length;i++){ if(argv[i].startsWith('--')){ const k=argv[i].slice(2); const v=argv[i+1] && !argv[i+1].startsWith('--') ? argv[++i]:'true'; out[k]=v; } }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  const tag = args.tag;
  const date = args.date;
  const index = readIndex();

  // Find target checkpoint
  let target = null; let targetDate = null;
  const dates = Object.keys(index.dates).sort();
  for (const d of dates) {
    const cps = index.dates[d].checkpoints || [];
    for (const cp of cps) {
      if ((tag && cp.tag === tag) || (!tag && date === d)) {
        target = cp; targetDate = d; break;
      }
    }
    if (target) break;
  }
  if (!target) {
    console.error('Checkpoint not found. Use --tag <name> or --date YYYY-MM-DD');
    process.exit(1);
  }

  // Collect events up to the checkpoint date (inclusive)
  const out = [];
  for (const d of dates) {
    const rel = index.dates[d].file; const file = path.isAbsolute(rel)?rel:path.join(process.cwd(), rel);
    const items = readNDJSON(file);
    for (const e of items) {
      out.push(e);
      if (d === targetDate && e.kind === 'checkpoint' && e.tag === target.tag) {
        console.error(`Reached checkpoint ${target.tag} at ${e.ts}`);
        const dest = path.join(process.cwd(), '.serena', `restore-until-${target.tag}.ndjson`);
        fs.writeFileSync(dest, out.map(x=>JSON.stringify(x)).join('\n')+'\n','utf8');
        console.log(`✅ Wrote events until checkpoint to ${path.relative(process.cwd(), dest)}`);
        console.log('Dry-run complete. Apply manually based on your workflow.');
        return;
      }
    }
  }
}

main();

