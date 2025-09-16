#!/usr/bin/env node
// Build overrides from original texts in data/enhanced_hexagrams_complete.json
// Policy: derive 2-3 keywords from 六爻 text (original), keep only substrings from the classical text.

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../data/enhanced_hexagrams_complete.json');
const OUT = path.resolve(__dirname, '../public/data/h384-keyword-overrides.json');

function tokenizeText(text) {
  if (!text) return [];
  // Split by punctuation and spaces
  const parts = String(text).split(/[，。．、\s]+/).filter(Boolean);
  // Further split by connector terms (在/於/其/之/不/無/有/利/見)
  const tokens = [];
  for (const p of parts) {
    const t = p.trim();
    if (!t) continue;
    // Keep phrases of length 2-4 characters (heuristic)
    // Special: keep canonical bigrams commonly used in texts
    const preserve = ['潜龍','見龍','飛龍','亢龍','無咎','有悔','大人','在田','乾乾','夕惕','履霜','堅冰','直方','含章','括嚢','黄裳','龍戦','玄黄'];
    if (preserve.some(k => t.includes(k))) {
      preserve.forEach(k => { if (t.includes(k)) tokens.push(k); });
      continue;
    }
    if (t.length >= 2 && t.length <= 4) tokens.push(t);
  }
  // Unique, prioritized by preserve order
  const uniq = Array.from(new Set(tokens));
  return uniq.slice(0, 3);
}

function build() {
  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const overrides = {};
  for (const hex of src) {
    const id = Number(hex.hexagram_id);
    if (!Array.isArray(hex.six_lines)) continue;
    for (const line of hex.six_lines) {
      const pos = Number(line.position);
      const key = `${id}-${pos}`;
      const kws = tokenizeText(line.text);
      if (kws.length) overrides[key] = kws;
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(overrides, null, 2), 'utf8');
  console.log('✅ Built original-text overrides:', Object.keys(overrides).length, 'entries');
  console.log('📄 Saved to', OUT);
}

if (require.main === module) build();

