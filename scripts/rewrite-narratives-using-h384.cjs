#!/usr/bin/env node
/**
 * Rebuild narratives_chain_complete_final.json chain_long using H384/H64
 * - Keeps keys and metadata; replaces chain_long with stage snapshots per triad
 * - Output: public/data/authoring/narratives_chain_complete_final.rebuilt.json
 * - Style: no advice, just state transitions with features from H384
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const HFILE = path.join(ROOT, 'public/assets/H384H64database.js');
const INFILE = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.json');
const OUTFILE = path.join(ROOT, 'public/data/authoring/narratives_chain_complete_final.rebuilt.json');

function loadHData() {
  const code = fs.readFileSync(HFILE, 'utf8');
  const sandbox = { window: {}, console: { log(){}, warn(){}, error(){} }, document: { readyState:'complete', addEventListener(){} } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  const H384 = sandbox.window.H384_DATA;
  const H64 = sandbox.window.H64_DATA;
  if (!Array.isArray(H384) || !Array.isArray(H64)) throw new Error('Failed to load H384/H64');
  return { H384, H64 };
}

const TRIADS = ['JJJ','JJH','JHJ','JHH','HJJ','HJH','HHJ','HHH'];

function linePosFromName(name) {
  const s = String(name);
  if (s.includes('初')) return 1;
  if (s.includes('二')) return 2;
  if (s.includes('三')) return 3;
  if (s.includes('四')) return 4;
  if (s.includes('五')) return 5;
  if (s.includes('上')) return 6;
  return null;
}

function buildH64Map(H64) {
  const byNum = new Map();
  for (const row of H64) byNum.set(Number(row['卦番号']), row);
  return byNum;
}

function getH384(H384, hex, line) {
  const idx = (hex - 1) * 6 + (line - 1);
  return H384[idx];
}

function transformHexByLine(H64ByNum, hex, line) {
  const row = H64ByNum.get(hex);
  if (!row) return hex;
  const field = line === 1 ? '初爻変' : line === 2 ? '二爻変' : line === 3 ? '三爻変' : line === 4 ? '四爻変' : line === 5 ? '五爻変' : '上爻変';
  const nextHex = Number(row[field]);
  return Number.isFinite(nextHex) ? nextHex : hex;
}

function step(state, char, H64ByNum) {
  if (char === 'J') {
    const nextLine = state.line < 6 ? state.line + 1 : 1;
    return { hex: state.hex, line: nextLine, kind: '進爻' };
  } else {
    const nextHex = transformHexByLine(H64ByNum, state.hex, state.line);
    return { hex: nextHex, line: state.line, kind: '変爻' };
  }
}

function classifyRisk(r) {
  const v = Math.abs(Number(r)||0);
  if (v >= 60) return '高';
  if (v >= 40) return '中';
  return '低';
}

function classifyVar(v) {
  v = Number(v)||0;
  if (v >= 60) return '高';
  if (v >= 35) return '中';
  return '低';
}

function makeStageLine(entry, label) {
  const hex = String(entry['卦名']).trim();
  const yao = String(entry['爻']).trim();
  const kw = Array.isArray(entry['キーワード']) ? entry['キーワード'].slice(0,3).join(' / ') : '';
  const sum = String(entry['現代解釈の要約']||'').trim();
  const stance = String(entry['S5_主体性推奨スタンス']||'').trim();
  const risk = classifyRisk(entry['S4_リスク']);
  const vari = classifyVar(entry['S6_変動性スコア']);
  return `- ${label}: ${hex} ${yao}｜特徴: ${kw}｜要約: ${sum}｜主体性: ${stance}｜リスク:${risk}｜揺れ:${vari}`;
}

function rebuildChainLong(H384, H64ByNum, startHexName, startPos, triad) {
  // Resolve start hex num by name
  const hexRow = [...H64ByNum.values()].find(r => String(r['名前']).trim() === String(startHexName).trim());
  if (!hexRow) return '';
  const start = { hex: Number(hexRow['卦番号']), line: Number(startPos)+1 };
  let state = { ...start };
  const lines = [];
  for (let i=0;i<3;i++) {
    const ch = triad[i];
    state = step(state, ch, H64ByNum);
    const e = getH384(H384, state.hex, state.line);
    const label = `段階${i+1}（${state.kind}）`;
    lines.push(makeStageLine(e, label));
  }
  return lines.join('\n');
}

function main() {
  const { H384, H64 } = loadHData();
  const H64ByNum = buildH64Map(H64);
  const db = JSON.parse(fs.readFileSync(INFILE, 'utf8'));
  const out = {};
  for (const [key, val] of Object.entries(db)) {
    const parts = key.split('|');
    const start = parts[0].trim(); // "卦名 爻"
    const triad = parts[1].trim();
    const [hexName] = start.split(' ');
    const startPos = val.start?.pos ?? null;
    let chain = '';
    try {
      chain = rebuildChainLong(H384, H64ByNum, hexName, startPos, triad);
    } catch (e) {}
    out[key] = { ...val, chain_long: chain || val.chain_long };
  }
  fs.writeFileSync(OUTFILE, JSON.stringify(out, null, 2));
  console.log('✅ Rebuilt:', OUTFILE);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌', e); process.exit(1); }
}

