/*
  Batch runner: evaluate 10+ sample inputs with IChingGuidanceEngine
*/

global.window = global;
global.document = { readyState: 'complete', addEventListener: () => {} };
global.localStorage = { _s:new Map(), getItem(k){return this._s.get(k)||null;}, setItem(k,v){this._s.set(k,String(v));}, removeItem(k){this._s.delete(k);} };

const fs = require('fs');

require('../public/assets/H384H64database.js');
// minimal db provider for engine
global.window.h384db = {
  isLoaded: true,
  getDatabaseData: () => window.H384_DATA
};

require('../public/js/core/IChingGuidanceEngine.js');

async function runOne(engine, inputText){
  if (!engine.isInitialized) await engine.initialize();
  const res = await engine.performCompleteAnalysis(inputText);
  if (!res) return null;
  const cs = res.currentSituation||{};
  const top = res.topCandidates||[];
  return {
    current: { hex: cs.hexagramName, line: cs.yaoName, s1: cs['S1_基本スコア'] },
    reasons: cs.reasons||{},
    top: top.map(t=>({ hex: t.hexagramName, line: t.yaoName, score: Math.round(t.score) }))
  };
}

async function main(){
  const path = process.env.INPUTS || 'tests/sample_inputs_10.json';
  const list = JSON.parse(fs.readFileSync(path, 'utf8'));
  const engine = window.iChingGuidance || new window.IChingGuidanceEngine();

  const out = [];
  for (const item of list){
    const r = await runOne(engine, item.text);
    out.push({ id: item.id, result: r });
  }
  console.log(JSON.stringify(out, null, 2));
}

main().catch(e=>{ console.error(e); process.exit(1); });

