#!/usr/bin/env node
// Build a concise context summary from recent daily logs

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

function main() {
  const args = process.argv.slice(2);
  const daysArgIdx = args.indexOf('--days');
  const days = daysArgIdx >= 0 ? parseInt(args[daysArgIdx + 1] || '7', 10) : 7;

  const index = readIndex();
  const dates = Object.keys(index.dates).sort().slice(-days);
  const events = [];
  for (const d of dates) {
    const rel = index.dates[d].file;
    const file = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
    events.push(...readNDJSON(file));
  }

  // Summarize: keep session starts, decisions titles, and checkpoints
  const summary = {
    generatedAt: new Date().toISOString(),
    daysIncluded: dates,
    sessions: {},
    checkpoints: []
  };
  for (const e of events) {
    if (e.kind === 'session' && (e.type === 'start' || e.type === 'end')) {
      const sid = e.session_id || 'adhoc';
      summary.sessions[sid] = summary.sessions[sid] || { intent: '', plan: [], start: '', end: '', decisions: [] };
      if (e.type === 'start') {
        summary.sessions[sid].intent = e.intent || summary.sessions[sid].intent;
        summary.sessions[sid].plan = e.plan || summary.sessions[sid].plan;
        summary.sessions[sid].start = e.ts;
      } else if (e.type === 'end') {
        summary.sessions[sid].end = e.ts;
      }
    }
    if (e.kind === 'decision') {
      const sid = e.session_id || 'adhoc';
      summary.sessions[sid] = summary.sessions[sid] || { intent: '', plan: [], start: '', end: '', decisions: [] };
      summary.sessions[sid].decisions.push({ ts: e.ts, type: e.type, title: e.title, intent: e.intent, changes: e.changes_summary });
    }
    if (e.kind === 'checkpoint') {
      summary.checkpoints.push({ ts: e.ts, tag: e.tag, git: e.git, note: e.note, session_id: e.session_id });
    }
  }

  const outPath = path.join(process.cwd(), '.serena', 'context.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`✅ Context summary refreshed: ${path.relative(process.cwd(), outPath)}`);
}

main();

