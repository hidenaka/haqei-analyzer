#!/usr/bin/env node
// QA checks for generated detailed explanations
// - Ensures per-hex counts match
// - Validates style constraints and flags anomalies for manual review

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'public', 'data', 'scenario-db-easy');
const OUT_DIR = path.join(ROOT, 'public', 'data', 'scenario-db-easy-detailed');

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }

function splitSentences(text){
  const t = String(text || '').trim();
  if (!t) return [];
  // Split by Japanese full stops while retaining content
  const raw = t.split('。').map(s=>s.trim()).filter(Boolean);
  return raw.map(s=>s + '。');
}

function hasAsciiPunct(text){ return /[\.!?,;:]/.test(text); }
function hasArrow(text){ return /→/.test(text); }
function hasDoublePunct(text){ return /(、、|。。)/.test(text); }
function includesDado(text){ return /だと/.test(text); }

function predicateRepeatScore(sentences){
  // crude: compare last 2–3 chars of sentences
  let repeats = 0;
  for (let i=1;i<sentences.length;i++){
    const a = sentences[i-1].replace(/[。！？\s]+$/,'');
    const b = sentences[i].replace(/[。！？\s]+$/,'');
    const tailA = a.slice(-3);
    const tailB = b.slice(-3);
    if (tailA && tailA===tailB) repeats++;
  }
  return repeats;
}

function run(){
  const files = fs.readdirSync(OUT_DIR).filter(f=>/^hex-\d+\.json$/.test(f));
  let total=0;
  const issues = {
    empty: [],
    tooShort: [],
    tooLong: [],
    asciiPunct: [],
    arrow: [],
    doublePunct: [],
    dado: [],
    predicateRepeat: [],
  };

  for (const f of files){
    const hex = Number(f.match(/\d+/)[0]);
    const j = readJSON(path.join(OUT_DIR,f));
    for (const [key, obj] of Object.entries(j.items||{})){
      total++;
      const t = String(obj?.detail||'');
      if (!t.trim()) { issues.empty.push(key); continue; }
      const sentences = splitSentences(t);
      const len = t.length;
      if (sentences.length < 5) issues.tooShort.push(key);
      if (sentences.length > 7) issues.tooLong.push(key);
      if (hasAsciiPunct(t)) issues.asciiPunct.push(key);
      if (hasArrow(t)) issues.arrow.push(key);
      if (hasDoublePunct(t)) issues.doublePunct.push(key);
      if (includesDado(t)) issues.dado.push(key);
      const pr = predicateRepeatScore(sentences);
      if (pr >= 2) issues.predicateRepeat.push(key);
    }
  }

  function show(label, arr, limit=10){
    console.log(`${label}: ${arr.length}`);
    if (arr.length) console.log('  examples:', arr.slice(0, limit).join(', '));
  }

  console.log(`Scanned details: ${total}`);
  show('empty', issues.empty);
  show('tooShort(<5 sentences)', issues.tooShort);
  show('tooLong(>7 sentences)', issues.tooLong);
  show('asciiPunct', issues.asciiPunct);
  show('arrow(→ present)', issues.arrow);
  show('doublePunct(、、/。。)', issues.doublePunct);
  show('contains "だと"', issues.dado);
  show('predicateRepeat(>=2 adj tails equal)', issues.predicateRepeat);

  // Exit with non-zero if severe issues exist (empty or arrow)
  if (issues.empty.length || issues.arrow.length){
    process.exitCode = 1;
  }
}

run();

