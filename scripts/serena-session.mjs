#!/usr/bin/env node
// Serena session lifecycle + decision logger (code/decision oriented)
// Usage examples:
//   node scripts/serena-session.mjs start --agent codex-cli --intent "Fix analyze trigger"
//   node scripts/serena-session.mjs decision --type implementation --title "Wire analyze button" --plan "connect click->performAnalysis" --decisions "Prefer Integration over Core"
//   node scripts/serena-session.mjs end --summary "Verified on local"

import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), '.serena', 'decisions.ndjson');

function ensureSerenaStructure() {
  const dir = path.join(process.cwd(), '.serena');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, '', 'utf8');
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
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n', 'utf8');
  console.log(`📝 Serena recorded: ${entry.kind} (${entry.type || ''})`);
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

