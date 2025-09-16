#!/usr/bin/env node
// Serena session lifecycle + decision logger (code/decision oriented)
// Usage examples:
//   node scripts/serena-session.mjs start --agent codex-cli --intent "Fix analyze trigger"
//   node scripts/serena-session.mjs decision --type implementation --title "Wire analyze button" --plan "connect click->performAnalysis" --decisions "Prefer Integration over Core"
//   node scripts/serena-session.mjs end --summary "Verified on local"

import fs from 'fs';
import path from 'path';

function ensureSerenaStructure() {
  const dir = path.join(process.cwd(), '.serena');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const logs = path.join(dir, 'logs');
  if (!fs.existsSync(logs)) fs.mkdirSync(logs, { recursive: true });
  const indexPath = path.join(dir, 'index.json');
  if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, JSON.stringify({ dates: {}, lastUpdated: new Date().toISOString() }, null, 2), 'utf8');
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

function parseKV(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    out[key] = val;
  }
  return out;
}

function redact(obj, keys = ['apiKey','token','password','authorization']) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = keys.includes(k) ? '[redacted]' : (v && typeof v === 'object') ? redact(v, keys) : v;
  }
  return out;
}

function append(entry) {
  const now = new Date(entry.ts || Date.now());
  const logFile = dailyLogPath(now);
  const line = JSON.stringify(entry) + '\n';
  fs.appendFileSync(logFile, line, 'utf8');

  // Update index
  const idx = readIndex();
  const { ymdd } = dateParts(now);
  if (!idx.dates[ymdd]) idx.dates[ymdd] = { file: logFile.replace(process.cwd() + path.sep, ''), sessions: {}, checkpoints: [] };
  if (entry.kind === 'session') {
    const sid = entry.session_id || 'adhoc';
    const ds = idx.dates[ymdd].sessions;
    if (!ds[sid]) ds[sid] = { first_ts: entry.ts, last_ts: entry.ts, count: 0 };
    ds[sid].last_ts = entry.ts;
    ds[sid].count = (ds[sid].count || 0) + 1;
  }
  if (entry.kind === 'checkpoint') {
    idx.dates[ymdd].checkpoints.push({ tag: entry.tag, ts: entry.ts, session_id: entry.session_id || '', git: entry.git || '', note: entry.note || '' });
  }
  writeIndex(idx);

  console.log(`📝 Serena recorded: ${entry.kind} (${entry.type || entry.tag || ''}) → ${path.relative(process.cwd(), logFile)}`);
}

function sessionId() {
  const d = new Date();
  return [d.getFullYear(), (d.getMonth()+1).toString().padStart(2,'0'), d.getDate().toString().padStart(2,'0')].join('') +
         '-' + Math.random().toString(36).slice(2, 7);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command) {
    console.error('Usage: serena-session <start|decision|end> [--key value ...]');
    process.exit(2);
  }
  ensureSerenaStructure();
  const args = parseKV(rest);

  const base = {
    ts: new Date().toISOString(),
    repo: path.basename(process.cwd()),
    branch: process.env.GIT_BRANCH || '',
    agent: args.agent || process.env.CLI_AGENT || 'codex-cli',
  };

  if (command === 'start') {
    const entry = {
      kind: 'session',
      type: 'start',
      session_id: args.session_id || sessionId(),
      intent: args.intent || '',
      plan: args.plan ? [].concat(args.plan) : [],
      ...base
    };
    append(entry);
    console.log(`SESSION_ID=${entry.session_id}`);
    return;
  }

  if (command === 'decision') {
    const details = args.details ? (()=>{ try { return JSON.parse(args.details); } catch { return { text: args.details }; } })() : {};
    const entry = {
      kind: 'decision',
      type: args.type || 'implementation',
      session_id: args.session_id || process.env.SERENA_SESSION_ID || 'adhoc',
      title: args.title || '',
      intent: args.intent || '',
      context: args.context || '',
      plan: args.plan ? [].concat(args.plan) : [],
      decisions: args.decisions ? [].concat(args.decisions) : [],
      changes_summary: args.changes || '',
      next_steps: args.next ? [].concat(args.next) : [],
      details: redact(details),
      ...base
    };
    append(entry);
    return;
  }

  if (command === 'end') {
    const entry = {
      kind: 'session',
      type: 'end',
      session_id: args.session_id || process.env.SERENA_SESSION_ID || 'adhoc',
      summary: args.summary || '',
      ...base
    };
    append(entry);
    return;
  }

  console.error('Unknown command:', command);
  process.exit(2);
}

main().catch(e => { console.error(e); process.exit(1); });
