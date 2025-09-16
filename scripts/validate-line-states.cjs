#!/usr/bin/env node
// Validate ALL 384 line states against style rules and known bad patterns
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const statesPath = path.join(root, 'public/data/h384-line-states.json');
const overridesPath = path.join(root, 'public/data/h384-keyword-overrides.json');
const explainPath = path.join(root, 'public/data/keyword-explanations.json');

function load(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }

const states = load(statesPath);
const overrides = load(overridesPath);
const explain = load(explainPath);

const banned = [
  /ですです/g, /ますです/g, /でします/g, /ありまします/g, /れります/g, /ながらながら/g,
  /厳格にです/g, /素晴/g,
  /孚/g, /攣如/g, /鄰/g, /玄黄/g,
];

const issues = [];
const keys = Object.keys(states).sort((a,b)=>{
  const [ah,al]=a.split('-').map(Number); const [bh,bl]=b.split('-').map(Number);
  return ah===bh ? al-bl : ah-bh;
});

for (const key of keys) {
  const text = String(states[key]||'').trim();
  const errs = [];
  if (!/[。!?？]$/.test(text)) errs.push('終端:句点なし');
  if (!/(です|ます|ません)[。!?？]?$/.test(text)) errs.push('丁寧語なし');
  if (text.length > 60) errs.push(`長すぎ(${text.length})`);
  if (text.length < 12) errs.push(`短すぎ(${text.length})`);
  if (/（|）/.test(text)) errs.push('括弧禁止');
  for (const r of banned) { if (r.test(text)) errs.push(`禁止:${r}`); }
  // overrides coverage
  const ov = overrides[key] || [];
  const explained = ov.some(w => !!explain[w]);
  if (!explained && ov.length) errs.push('辞書未定義(override語)');
  if (errs.length) issues.push({ key, text, ov, errs });
}

const total = keys.length;
console.log(`Checked ${total} line states.`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  for (const it of issues) {
    console.log(`- ${it.key} :: ${it.errs.join(', ')}\n  state: ${it.text}\n  kw: ${it.ov.join(' / ')}`);
  }
  process.exitCode = 1;
}
