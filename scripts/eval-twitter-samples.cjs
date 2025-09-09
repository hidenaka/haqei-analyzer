#!/usr/bin/env node
/**
 * Eval Twitter-like consultation samples against IChingGuidanceEngine
 * - Loads browser-oriented scripts into a VM sandbox
 * - Stubs fetch() to read semantic lexicon from local file
 * - Outputs Top1/Top3 with reasons and detected semantics
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const HFILE = path.join(ROOT, 'public/assets/H384H64database.js');
const ENGINE = path.join(ROOT, 'public/js/core/IChingGuidanceEngine.js');
const LEXICON = path.join(ROOT, 'public/data/semantic-lexicon.json');
const SAMPLES = path.join(__dirname, 'twitter-like-samples.json');

function createSandbox() {
  const silentConsole = console; // keep visible for debugging
  const sandbox = {
    window: {},
    console: silentConsole,
    document: { readyState: 'complete', addEventListener: () => {} },
    setTimeout, clearTimeout,
    fetch: async (url) => {
      // Map the engine's '/data/semantic-lexicon.json' to local file path
      const target = url.includes('/data/semantic-lexicon.json') ? LEXICON : null;
      if (!target) return { ok: false, status: 404, json: async () => ({}) };
      const txt = fs.readFileSync(target, 'utf8');
      return { ok: true, status: 200, json: async () => JSON.parse(txt) };
    }
  };
  vm.createContext(sandbox);
  return sandbox;
}

function loadIntoSandbox(sandbox, filePath, label) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInContext(code, sandbox, { filename: label || path.basename(filePath) });
}

async function ensureEngineReady(sandbox) {
  if (!sandbox.window.iChingGuidance) throw new Error('Engine not loaded');
  if (!sandbox.window.iChingGuidance.isInitialized) {
    await sandbox.window.iChingGuidance.initialize();
  }
}

function formatReasons(r) {
  const kw = (r.matchKw || []).slice(0, 8).join('、');
  const cat = (r.matchCat || []).join(',');
  return `kw:[${kw}] cat:[${cat}] phraseBoost:${r.phraseBoost||0} catBoost:${r.catBoost||0}`;
}

async function main() {
  const samples = JSON.parse(fs.readFileSync(SAMPLES, 'utf8'));
  const sandbox = createSandbox();

  // Load data and engine
  loadIntoSandbox(sandbox, HFILE, 'H384H64database.js');
  loadIntoSandbox(sandbox, ENGINE, 'IChingGuidanceEngine.js');

  // Sanity checks
  if (!Array.isArray(sandbox.window.H384_DATA) || sandbox.window.H384_DATA.length === 0) {
    throw new Error('H384_DATA not available in sandbox');
  }
  if (!sandbox.window.iChingGuidance) throw new Error('Engine failed to attach to window');

  await ensureEngineReady(sandbox);

  const engine = sandbox.window.iChingGuidance;
  console.log('🔬 Twitter-like Samples Evaluation');
  console.log(`H384 entries: ${sandbox.window.H384_DATA.length}`);

  for (const s of samples) {
    const text = s.text.trim();
    const semantics = engine.getSemantics(text);
    const top = await engine.rankCandidates(text, 3);
    const t1 = top[0];
    const t2 = top[1];
    const t3 = top[2];

    console.log('');
    console.log(`[#${s.id}] ${text}`);
    if (s.expectCategories && s.expectCategories.length) {
      console.log(`  expectCats: ${s.expectCategories.join(', ')}`);
    }
    console.log(`  semantics: kw=${(semantics.keywords||[]).slice(0,10).join('、')} cats=${(semantics.categories||[]).join(',')} frames=${(semantics.frames||[]).join(',')}`);
    if (t1) console.log(`  Top1: ${t1.hexagramName} ${t1.yaoName} (score=${t1.score}) reasons: ${formatReasons(t1.reasons)}`);
    if (t2) console.log(`  Top2: ${t2.hexagramName} ${t2.yaoName} (score=${t2.score}) reasons: ${formatReasons(t2.reasons)}`);
    if (t3) console.log(`  Top3: ${t3.hexagramName} ${t3.yaoName} (score=${t3.score}) reasons: ${formatReasons(t3.reasons)}`);
  }
}

if (require.main === module) {
  main().catch(err => { console.error('❌ Eval failed:', err.message); process.exit(1); });
}
