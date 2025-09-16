// Audit easyScenario (やさしい指針) vs Final outcome (line-states/H384)
// - Flags cases where final severity is HIGH and last action is 変,
//   but easy guidance suggests forward progress (e.g., 進める/進む/拡張 など)
// - Also surfaces other potential mismatches for review.

import { readdir, readFile } from 'fs/promises';
import path from 'path';

const ROOT = path.resolve('./public/data');
const EASY_DIR = path.join(ROOT, 'scenario-db-easy');
const LINE_STATES = path.join(ROOT, 'h384-line-states.json');

function sevScore(text){
  const t = String(text||'');
  const HIGH = ['退く','退避','撤退','中止','治療','補強','再発防止','亀裂','損害','危険','深刻','崩れる','破綻','被害','断つ'];
  const MED  = ['見直し','調整','修正','慎重','注意','警戒','停滞','迷い','課題','リスク','再検討'];
  let s = 0; HIGH.forEach(k=>{ if (t.includes(k)) s += 2; }); MED.forEach(k=>{ if (t.includes(k)) s += 1; }); return s;
}

function lastActionFromSeries(series){
  const parts = String(series||'').split('→');
  return parts[2] || '';
}

function looksProgressive(text){
  const t = String(text||'');
  const P = ['進める','進む','押し進め','前へ','拡張','広げ','加速','推進'];
  return P.some(k => t.includes(k));
}

function looksConservative(text){
  const t = String(text||'');
  const C = ['止め','抑え','控え','待つ','静ま','退く','直す','補修','整える'];
  return C.some(k => t.includes(k));
}

function keyOf(hex, line){ return `${Number(hex)}-${Number(line)}`; }

async function loadLineStates(){
  const raw = await readFile(LINE_STATES, 'utf-8');
  return JSON.parse(raw);
}

async function* iterEasyItems(){
  const files = (await readdir(EASY_DIR)).filter(f => /^hex-\d+\.json$/.test(f));
  for (const f of files){
    const hex = Number(f.match(/^hex-(\d+)\.json$/)[1]);
    const obj = JSON.parse(await readFile(path.join(EASY_DIR, f), 'utf-8'));
    const items = obj.items || {};
    for (const [key, rec] of Object.entries(items)){
      yield { hex, key, rec };
    }
  }
}

function summarize(text, n=60){ const s=String(text||'').trim(); return s.length>n? s.slice(0,n-1)+'…' : s; }

async function main(){
  const lineStates = await loadLineStates();
  const issues = [];
  let total = 0;
  for await (const { hex, key, rec } of iterEasyItems()){
    total++;
    const finalHex = rec.finalHex; const finalLine = rec.finalLine; const series = rec.series;
    const lastAction = lastActionFromSeries(series);
    const finalKey = keyOf(finalHex, finalLine);
    const finalText = (typeof lineStates[finalKey] === 'string') ? lineStates[finalKey] : (lineStates[finalKey]?.text || rec.steps?.[2]?.lineText || '');
    const sev = sevScore(finalText);
    const easy = rec.easy || {};
    const n3 = easy.next3 || {};
    const flags = [];
    if (sev >= 3 && lastAction === '変'){
      if (looksProgressive(n3.second) || looksProgressive(n3.first)){
        flags.push('Severe+Change but easy suggests progress (first/second)');
      }
      if (!looksConservative(n3.final)){
        flags.push('Severe+Change but easy.final not conservative');
      }
    }
    // mild mismatch: severe outcome but easy.outcome too positive
    if (sev >= 3 && /支持|加速|拡/.test(String(easy.outcome||''))){
      flags.push('Severe outcome but easy.outcome suggests growth/expansion');
    }
    if (flags.length){
      issues.push({
        key, series, lastAction, finalHex, finalLine, sev,
        easyFirst: n3.first || '',
        easySecond: n3.second || '',
        easyFinal: n3.final || '',
        easyOutcome: easy.outcome || '',
        finalText: summarize(finalText, 100),
        flags
      });
    }
  }
  console.log(`対象: ${total} 件 / 不整合候補: ${issues.length} 件`);
  // Print top 30
  issues.slice(0, 30).forEach((it, i)=>{
    console.log(`\n#${i+1} ${it.key} ${it.series} 最終:${it.finalHex}-${it.finalLine} act:${it.lastAction} sev:${it.sev}`);
    console.log(`  easy.first : ${it.easyFirst}`);
    console.log(`  easy.second: ${it.easySecond}`);
    console.log(`  easy.final : ${it.easyFinal}`);
    console.log(`  easy.outcome: ${it.easyOutcome}`);
    console.log(`  final.text : ${it.finalText}`);
    console.log(`  flags: ${it.flags.join(' | ')}`);
  });
  if (issues.length > 30) console.log(`\n…他 ${issues.length-30} 件`);
}

main().catch(e=>{ console.error(e); process.exit(1); });

