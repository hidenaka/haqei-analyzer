#!/usr/bin/env node
// 進捗シートを生成: Key/Before/After/Status/Notes/Tag/Assignee
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../');
const jsonPath = path.resolve(root, 'public/data/h384-line-states.json');
const outDir = path.resolve(root, 'operations');
const outPath = path.resolve(outDir, 'line-states-progress.csv');

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function csvEscape(s = '') {
  const t = String(s).replace(/"/g, '""');
  return `"${t}"`;
}

function main() {
  const data = loadJSON(jsonPath);
  ensureDir(outDir);
  const header = ['Key', 'Before', 'After', 'Status', 'Notes', 'Tag', 'Assignee'].map(csvEscape).join(',');
  const lines = [header];
  const keys = Object.keys(data).sort((a, b) => {
    const [ha, la] = a.split('-').map(Number);
    const [hb, lb] = b.split('-').map(Number);
    return ha === hb ? la - lb : ha - hb;
  });
  for (const k of keys) {
    const before = data[k];
    const row = [k, before, '', '未着手', '', '', ''].map(csvEscape).join(',');
    lines.push(row);
  }
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`✅ 進捗シート生成: ${path.relative(root, outPath)} (${keys.length}行)`);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}

