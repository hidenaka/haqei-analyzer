#!/usr/bin/env node
// Build compact overrides JSON from suggestions
const fs = require('fs');
const path = require('path');

const SUG_PATH = path.resolve(__dirname, '../h384-keyword-suggestions.json');
const OUT_PATH = path.resolve(__dirname, '../public/data/h384-keyword-overrides.json');

function lineNum(yao) {
  const map = { '初九':1, '九二':2, '九三':3, '九四':4, '九五':5, '上九':6, '初六':1, '六二':2, '六三':3, '六四':4, '六五':5, '上六':6 };
  return map[yao] || null;
}

function main() {
  const suggestions = JSON.parse(fs.readFileSync(SUG_PATH, 'utf8'));
  const overrides = {};
  for (const s of suggestions) {
    const ln = lineNum(s.yao);
    if (!ln) continue;
    const key = `${s.hex}-${ln}`;
    const arr = (s.suggested || []).filter(Boolean).map(x => String(x).trim()).slice(0, 4);
    if (!arr.length) continue;
    // Merge with existing (prefer earliest placeholder_replacement)
    if (!overrides[key]) overrides[key] = arr;
    else {
      const merged = Array.from(new Set([...overrides[key], ...arr])).slice(0, 4);
      overrides[key] = merged;
    }
  }
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(overrides, null, 2), 'utf8');
  console.log('✅ Built overrides:', Object.keys(overrides).length, 'entries');
  console.log('📄 Saved to', OUT_PATH);
}

if (require.main === module) main();

