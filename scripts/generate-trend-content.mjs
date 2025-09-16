#!/usr/bin/env node
// Trend script generator: AI × 古代の知恵（オフライン）
// - Reads scenario-db-easy to compose 2–3 trajectories
// - No external network; deterministic with --seed

import fs from 'fs';
import path from 'path';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { topic: '', now: '', tracks: 2, seed: 0, template: 'content-ops/templates/trend_short.json', hex: null, line: null, triads: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--topic') out.topic = args[++i] ?? '';
    else if (a === '--now') out.now = args[++i] ?? '';
    else if (a === '--tracks') out.tracks = Number(args[++i] ?? 2);
    else if (a === '--seed') out.seed = Number(args[++i] ?? 0);
    else if (a === '--template') out.template = args[++i] ?? out.template;
    else if (a === '--hex') out.hex = Number(args[++i] ?? '');
    else if (a === '--line') out.line = Number(args[++i] ?? '');
    else if (a === '--triads') out.triads = String(args[++i] ?? '').split(',').map(s=>s.trim().toUpperCase()).filter(Boolean);
  }
  if (!out.topic) {
    console.error('Usage: node scripts/generate-trend-content.mjs --topic "..." --now "..." --tracks 2 [--seed 1] [--template path]');
    process.exit(1);
  }
  return out;
}

function loadTemplate(tplPath) {
  const p = path.isAbsolute(tplPath) ? tplPath : path.join(process.cwd(), tplPath);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  return j;
}

function listEasyItems() {
  const dir = path.join(process.cwd(), 'public/data/scenario-db-easy');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const items = [];
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const [key, val] of Object.entries(j.items || {})) {
      const sig = val.pathSig || deriveSig(val.steps || []);
      const easy = val.easy || {};
      // key format: "<hex>_<line>_<sig>"
      const [h, ln, sg] = key.split('_');
      items.push({ key, hex: Number(h), line: Number(ln), sig: sg || sig, next3: easy.next3, outcome: easy.outcome });
    }
  }
  return items.filter(x => x.next3 && x.outcome);
}

function deriveSig(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return 'JJJ';
  const map = { '進': 'J', '変': 'H' };
  return steps.slice(0, 3).map(s => map[s.action] || 'J').join('');
}

function classify(sig) {
  const h = (sig.match(/H/g) || []).length;
  if (h === 0) return 'stable';
  if (h === 1) return 'pivot';
  if (h === 2) return 'shuffle';
  return 'overhaul';
}

function prng(seed) {
  // xorshift32
  let x = (seed || 1) >>> 0;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17; x >>>= 0;
    x ^= x << 5;  x >>>= 0;
    return x / 0xffffffff;
  };
}

function pickByClass(items, rng, wantClasses) {
  const by = new Map();
  for (const c of wantClasses) by.set(c, []);
  for (const it of items) {
    const c = classify(it.sig);
    if (by.has(c)) by.get(c).push(it);
  }
  const taken = [];
  for (const c of wantClasses) {
    const arr = by.get(c) || [];
    if (arr.length === 0) continue;
    const idx = Math.floor((rng() || Math.random()) * arr.length);
    taken.push({ cls: c, ...arr[idx] });
  }
  return taken;
}

function next3ToLine(n3) {
  const p = [n3.first, n3.second, n3.final].filter(Boolean).join('→');
  return p;
}

function main() {
  const { topic, now, tracks, seed, template, hex, line, triads } = parseArgs();
  const tpl = loadTemplate(template);
  const items = listEasyItems();
  const rng = prng(seed);

  let picks = [];
  if (hex && line) {
    const scoped = items.filter(it => it.hex === Number(hex) && it.line === Number(line));
    if (triads && triads.length) {
      for (const sig of triads) {
        const it = scoped.find(x => x.sig === sig);
        if (it) picks.push({ cls: classify(sig), ...it });
      }
    } else {
      // Default for scoped: pick farthest pair per domain rule.
      // Prefer JJJ vs HJH (0変 vs 非連続2変) as最遠。次点: JJJ vs JHH/HHJ、次: JJJ vs HHH。
      const prefPairs = [ ['JJJ','HJH'], ['JJJ','JHH'], ['JJJ','HHJ'], ['JJJ','HHH'] ];
      const pref = ['JJJ','HJH','JHH','HHJ','HHH','JJH','JHJ','HJJ'];
      const has = new Set(scoped.map(x => x.sig));
      let chosen = null;
      for (const [a,b] of prefPairs){
        if (has.has(a) && has.has(b)) { chosen = [a,b]; break; }
      }
      if (chosen){
        picks = chosen.map(sig => ({ cls: classify(sig), ...scoped.find(x => x.sig === sig) }));
      } else {
        // fallback: choose min-H and max-H available
        const hcount = s => (s.match(/H/g)||[]).length;
        const sorted = Array.from(has).sort((a,b)=>hcount(a)-hcount(b));
        if (sorted.length){
          const a = sorted[0];
          const b = sorted[sorted.length-1];
          const A = scoped.find(x => x.sig===a);
          const B = scoped.find(x => x.sig===b);
          if (A) picks.push({ cls: classify(A.sig), ...A });
          if (B && B!==A) picks.push({ cls: classify(B.sig), ...B });
        }
        // last resort: use preference order to pick two different
        if (picks.length < 2){
          const list = pref.filter(s => has.has(s)).slice(0,2).map(sig => ({ cls: classify(sig), ...scoped.find(x=>x.sig===sig) }));
          picks = list;
        }
      }
    }
  } else {
    const order = [
      ['stable', 'pivot'],
      ['stable', 'shuffle'],
      ['pivot', 'shuffle'],
      ['stable', 'pivot', 'shuffle'],
      ['pivot', 'shuffle', 'overhaul']
    ];
    const want = order[Math.min(order.length - 1, Math.max(0, tracks - 2))];
    picks = pickByClass(items, rng, want);
  }

  const label = tpl.labels || {};
  const sect = new Map(tpl.sections.map(s => [s.id, s.text]));

  const out = [];
  out.push(sect.get('hook').replace('{topic}', topic));
  out.push(sect.get('now').replace('{now}', now));

  const lines = ['trackA', 'trackB', 'trackC'];
  picks.slice(0, tracks).forEach((p, i) => {
    const id = lines[i];
    const text = sect.get(id);
    if (!text) return;
    const n3 = next3ToLine(p.next3);
    const t = text
      .replace('{label' + String.fromCharCode(65 + i) + '}', label[p.cls] || p.cls)
      .replace('{next3' + String.fromCharCode(65 + i) + '}', n3)
      .replace('{outcome' + String.fromCharCode(65 + i) + '}', p.outcome);
    out.push(t);
  });

  out.push(sect.get('cta'));

  // 免責（短）
  out.push('※状況の見取り図であり、結果を保証しません。');

  console.log(out.join('\n'));
}

main();
