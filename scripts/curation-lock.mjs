#!/usr/bin/env node
// Simple lock manager for hex ranges to enable parallel curation without collisions
// Usage:
//  node scripts/curation-lock.mjs acquire --range h1-h16 --by alice --session 20250911-sit --note "start batch"
//  node scripts/curation-lock.mjs release --range h1-h16 --by alice
//  node scripts/curation-lock.mjs list
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const [,,cmd, ...rest] = process.argv;
const args = Object.fromEntries(rest.map((a,i)=> a.startsWith('--') ? [a.replace(/^--/,''), (rest[i+1] && !rest[i+1].startsWith('--')) ? rest[i+1] : true] : []).filter(x=>x.length));
const LOCK_PATH = path.resolve('curation/locks.json');

async function readJson(p){ try { return JSON.parse(await fsp.readFile(p,'utf8')); } catch { return null; } }
async function writeJson(p, obj){ await fsp.writeFile(p, JSON.stringify(obj, null, 2),'utf8'); }

function now(){ return new Date().toISOString(); }

async function list(){
  const data = await readJson(LOCK_PATH) || { locks:[], updatedAt:null };
  console.log(JSON.stringify({ updatedAt: data.updatedAt, locks: data.locks }, null, 2));
}

async function acquire(){
  const range = String(args.range||'').trim();
  const by = String(args.by||process.env.USER||process.env.LOGNAME||'unknown').trim();
  if (!range) throw new Error('range required (e.g., h1-h16)');
  const data = await readJson(LOCK_PATH) || { locks:[], updatedAt:null };
  if (data.locks.find(l=> l.range === range)){
    console.error('Lock already held:', range);
    process.exit(2);
  }
  data.locks.push({ range, by, session: String(args.session||''), startedAt: now(), note: String(args.note||'') });
  data.updatedAt = now();
  await writeJson(LOCK_PATH, data);
  console.log(JSON.stringify({ status:'acquired', range, by }, null, 2));
}

async function release(){
  const range = String(args.range||'').trim();
  const by = String(args.by||'').trim();
  if (!range) throw new Error('range required');
  const data = await readJson(LOCK_PATH) || { locks:[], updatedAt:null };
  const before = data.locks.length;
  data.locks = data.locks.filter(l=> !(l.range === range && (!by || l.by === by)));
  data.updatedAt = now();
  await writeJson(LOCK_PATH, data);
  console.log(JSON.stringify({ status:'released', range, removed: before - data.locks.length }, null, 2));
}

async function main(){
  if (cmd === 'list') return list();
  if (cmd === 'acquire') return acquire();
  if (cmd === 'release') return release();
  console.log('Usage: acquire|release|list --range h1-h16 --by <name> [--session xxx] [--note "..."]');
}

main().catch(e=>{ console.error(e); process.exit(1); });

