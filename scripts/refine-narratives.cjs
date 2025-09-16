'use strict';

const fs = require('fs');
const path = require('path');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function saveJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

function splitSentences(text) {
  const t = String(text || '').trim();
  if (!t) return [];
  // naive JP sentence split by 。 keeping punctuation
  const arr = t.split('。').map(s => s.trim()).filter(Boolean).map(s => s + '。');
  return arr;
}

function auditIssues(body) {
  const issues = [];
  const sents = splitSentences(body);
  if (sents.length === 0) issues.push('empty');
  if (sents.length > 6) issues.push('too_many_sentences');
  if (sents.length < 2) issues.push('too_few_sentences');
  if (/。。|、、|，，/.test(body)) issues.push('double_punct');
  if (!/。$/.test(String(body).trim())) issues.push('no_final_period');
  if (/^続いて|^そこで|^最後に/.test((sents[0]||'').trim())) issues.push('bad_connector_order');
  const hasDupboiler = /突破口：状況に応じた柔軟な対応が成功の鍵となる。?/.test(body);
  if (hasDupboiler) issues.push('boilerplate');
  return issues;
}

function refineBody(body) {
  let sents = splitSentences(body);
  if (sents.length === 0) return body;

  // Remove duplicate consecutive sentences
  const dedup = [];
  for (const s of sents) {
    const norm = s.replace(/[\s　。]/g, '');
    const prev = dedup[dedup.length-1];
    if (!prev || prev.replace(/[\s　。]/g, '') !== norm) dedup.push(s);
  }
  sents = dedup;

  // Remove generic boilerplate like "突破口：状況に応じた柔軟な対応が成功の鍵となる。"
  sents = sents.filter(s => !/突破口：状況に応じた柔軟な対応が成功の鍵となる。?/.test(s));

  // Merge duplicate '突破口は…' / 'まずは…しましょう。' -> keep only one concluding guidance
  let lastGuidance = null;
  for (const s of sents) {
    if (/^突破口は/.test(s) || /^まずは/.test(s)) lastGuidance = s;
  }
  // Remove all guidance lines; add one at the end later
  sents = sents.filter(s => !/^突破口は/.test(s) && !/^まずは/.test(s));

  // Limit to max 6 sentences: keep first 4 + (optional) penultimate + guidance
  if (sents.length > 5) {
    sents = sents.slice(0, 5);
  }
  if (lastGuidance) sents.push(lastGuidance);

  // Ensure connectors order feels natural
  const addConnector = (s, prefix) => (s.startsWith(prefix) ? s : (prefix + s));
  if (sents[0] && !/^まず|^最初に/.test(sents[0])) {
    sents[0] = addConnector(sents[0], 'まず、');
  }
  if (sents[1] && /^最後に|^最終的に/.test(sents[1])) {
    // swap 1st and 2nd if second starts with final connector
    const tmp = sents[1]; sents[1] = sents[0]; sents[0] = tmp;
  }
  if (sents.length >= 3 && !/^最後に|^最終的に/.test(sents[sents.length-1])) {
    // if last isn't guidance and not final connector, add a gentle close
    const idx = sents.length - 1;
    sents[idx] = addConnector(sents[idx], '最後に、');
  }

  // Lighty simplify complex jargon phrases (very conservative)
  let out = sents.join('');
  out = out.replace(/現象界を超越/g, '状況を一段引いて捉え直し');
  out = out.replace(/意識が創り出した/g, '見方がつくり出した');
  out = out.replace(/入于穴/g, '内側の観察');

  // Ensure trailing period
  out = out.trim();
  if (!/。$/.test(out)) out += '。';
  return out;
}

function main() {
  const dbPath = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
  const db = loadJSON(dbPath);
  let changed = 0;
  for (const key of Object.keys(db)) {
    const v = db[key];
    const before = String(v.chain_long || '');
    const issues = auditIssues(before);
    if (issues.length === 0) continue;
    const after = refineBody(before);
    if (after && after !== before) {
      v.chain_long = after;
      v.updated_at = new Date().toISOString();
      db[key] = v;
      changed++;
    }
  }
  saveJSON(dbPath, db);
  console.log('Refined entries:', changed);
}

if (require.main === module) main();
