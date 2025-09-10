#!/usr/bin/env node
// Serena checkpoint: marks a point-in-time tag for restoration/reference

import fs from 'fs';
import path from 'path';

function ensure() {
  const dir = path.join(process.cwd(), '.serena');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const logs = path.join(dir, 'logs');
  if (!fs.existsSync(logs)) fs.mkdirSync(logs, { recursive: true });
  const indexPath = path.join(dir, 'index.json');
  if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, JSON.stringify({ dates: {}, lastUpdated: new Date().toISOString() }, null, 2), 'utf8');
}

function parseKV(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      out[k] = v;
    }
  }
  return out;
}

function dateParts(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return { y, m, day, ymdd: `${y}-${m}-${day}` };
}

function dailyLogPath(d = new Date()) {
  const base = path.join(process.cwd(), '.serena', 'logs');
  const { y, ymdd } = dateParts(d);
  const dir = path.join(base, String(y));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${ymdd}.ndjson`);
}

function readIndex() {
  const indexPath = path.join(process.cwd(), '.serena', 'index.json');
  try { return JSON.parse(fs.readFileSync(indexPath, 'utf8')); } catch { return { dates: {}, lastUpdated: new Date().toISOString() }; }
}

function writeIndex(index) {
  const indexPath = path.join(process.cwd(), '.serena', 'index.json');
  index.lastUpdated = new Date().toISOString();
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
}

function appendLine(file, obj) {
  fs.appendFileSync(file, JSON.stringify(obj) + '\n', 'utf8');
}

function main() {
  ensure();
  const args = parseKV(process.argv);
  const tag = args.tag || args.name;
  if (!tag) {
    console.error('Usage: serena-checkpoint --tag <name> [--note "..."] [--git <commit>] [--session_id <id>]');
    process.exit(2);
  }
  const now = new Date();
  const logFile = dailyLogPath(now);
  const entry = {
    kind: 'checkpoint',
    ts: now.toISOString(),
    tag,
    note: args.note || '',
    git: args.git || process.env.GIT_COMMIT || '',
    session_id: args.session_id || process.env.SERENA_SESSION_ID || ''
  };
  appendLine(logFile, entry);

  const idx = readIndex();
  const { ymdd } = dateParts(now);
  if (!idx.dates[ymdd]) idx.dates[ymdd] = { file: logFile.replace(process.cwd() + path.sep, ''), sessions: {}, checkpoints: [] };
  idx.dates[ymdd].checkpoints.push({ tag: entry.tag, ts: entry.ts, session_id: entry.session_id, git: entry.git, note: entry.note });
  writeIndex(idx);
  console.log(`✅ Checkpoint '${tag}' recorded in ${path.relative(process.cwd(), logFile)}`);
}

main();

