'use strict';

const fs = require('fs');
const path = require('path');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function splitSentencesJP(text) {
  const t = String(text || '').trim();
  if (!t) return [];
  // Split by full stop and keep natural breaks
  const parts = t.split('。').map(s => s.trim()).filter(Boolean).map(s => s + '。');
  return parts;
}

function kanjiRatio(s) {
  const chars = Array.from(String(s||''));
  if (chars.length === 0) return 0;
  const kanji = chars.filter(ch => /[\u4e00-\u9faf]/.test(ch)).length;
  return kanji / chars.length;
}

function auditChain(key, body) {
  const issues = [];
  const sentences = splitSentencesJP(body);
  if (sentences.length === 0) {
    issues.push({ kind: 'empty', msg: '本文空' });
    return issues;
  }
  if (!/。$/.test(body.trim())) issues.push({ kind: 'no_final_period', msg: '本文末尾に「。」が無い' });
  if (sentences.length < 2) issues.push({ kind: 'too_few_sentences', msg: `文数が少ない(${sentences.length})` });
  if (sentences.length > 6) issues.push({ kind: 'too_many_sentences', msg: `文数が多い(${sentences.length})` });
  const connectorFirst = /^(まず|最初に|はじめに|冒頭で)/;
  const connectorSecond = /^(続いて|次に|そこで|一方で|さらに)/;
  const connectorFinal = /^(最後に|やがて|最終的に)/;

  sentences.forEach((s, idx) => {
    const raw = s.replace(/[\s　]/g, '');
    if (raw.length < 8) issues.push({ kind: 'too_short', idx, s });
    if (raw.length > 120) issues.push({ kind: 'too_long', idx, s });
    if (/\?\?|？？|ＴＯＤＯ|TODO|未定|執筆中/.test(raw)) issues.push({ kind: 'placeholder', idx, s });
    if (/。。|、、|，，/.test(raw)) issues.push({ kind: 'double_punct', idx, s });
    if (/(.)\1\1/.test(raw)) issues.push({ kind: 'triplicate_char', idx, s });
    const kr = kanjiRatio(raw);
    if (kr > 0.8 && raw.length > 20) issues.push({ kind: 'too_technical', idx, s, note: `漢字率${(kr*100).toFixed(0)}%` });
    if (idx === 0 && connectorSecond.test(raw)) issues.push({ kind: 'bad_connector_order', idx, s, note: '1文目に「続いて/そこで」等' });
    if (idx === 1 && connectorFinal.test(raw)) issues.push({ kind: 'early_final_connector', idx, s, note: '2文目で「最後に」等' });
  });
  // Redundancy across sentences
  const norm = sentences.map(s => s.replace(/[\s　。]/g, ''));
  for (let i=1;i<norm.length;i++) {
    if (norm[i] === norm[i-1]) issues.push({ kind: 'duplicate_sentence', idx: i, s: sentences[i] });
  }
  // Formulaic endings check (too many set phrases)
  const formulaCount = sentences.filter(s => /突破口は|まずは|〜ましょう。|〜していきます。/.test(s)).length;
  if (formulaCount >= 3) issues.push({ kind: 'too_formulaic', msg: `定型句が多い(${formulaCount})` });
  return issues;
}

function main() {
  const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
  const db = loadJSON(file);
  const results = [];
  for (const [key, v] of Object.entries(db)) {
    const body = String(v?.chain_long || '').trim();
    const issues = auditChain(key, body);
    if (issues.length) results.push({ key, issues, body });
  }
  // Rank by severity (empty, placeholder, bad connector first), then by length issue
  const scoreKind = k => ({empty:5, placeholder:5, bad_connector_order:4, early_final_connector:4, too_technical:3, too_many_sentences:3, too_short:2, too_long:2, double_punct:2, duplicate_sentence:2, too_formulaic:1, no_final_period:1, too_few_sentences:1}[k]||0);
  results.sort((a,b)=>{
    const sa = Math.max(...a.issues.map(i=>scoreKind(i.kind)));
    const sb = Math.max(...b.issues.map(i=>scoreKind(i.kind)));
    return sb - sa;
  });
  const top = results.slice(0, 60); // top 60 entries to review first
  const outPath = path.resolve(__dirname, '..', 'reports', 'narratives_chain_quality.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ total: Object.keys(db).length, flagged: results.length, sample: top }, null, 2), 'utf8');
  console.log('Flagged entries:', results.length, 'Sample written:', outPath);
}

if (require.main === module) main();

