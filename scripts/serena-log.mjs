#!/usr/bin/env node
// Serena activity logger: appends NDJSON entries to .serena/activity.ndjson
// Usage:
//   node scripts/serena-log.mjs --event deploy --meta '{"branch":"main"}'

import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const args = { event: undefined, meta: {} };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--event' && argv[i + 1]) {
      args.event = argv[++i];
    } else if (a === '--meta' && argv[i + 1]) {
      try { args.meta = JSON.parse(argv[++i]); } catch { args.meta = { raw: argv[i] }; }
    }
  }
  return args;
}

function redact(obj, keys = ['apiKey', 'token', 'password', 'authorization']) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (keys.includes(k)) { out[k] = '[redacted]'; continue; }
    out[k] = (v && typeof v === 'object') ? redact(v, keys) : v;
  }
  return out;
}

async function main() {
  const { event, meta } = parseArgs(process.argv);
  if (!event) {
    console.error('Usage: serena-log --event <name> [--meta "{...}"]');
    process.exit(2);
  }

  const record = {
    ts: new Date().toISOString(),
    event,
    meta: redact(meta)
  };

  const target = path.join(process.cwd(), '.serena', 'activity.ndjson');
  const dir = path.dirname(target);
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(target, JSON.stringify(record) + '\n', 'utf8');
  console.log(`✅ Logged to ${target}: ${record.event}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

