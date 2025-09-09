#!/usr/bin/env node
// Build overrides from Japanese translations in data/enhanced_hexagrams_complete.json
// Policy: derive 2-4 concise JP keywords from `meaning` and `personality_trait` per line.

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../data/enhanced_hexagrams_complete.json');
const OUT = path.resolve(__dirname, '../public/data/h384-keyword-overrides.json');

const STOP = new Set(['こと','もの','ため','よう','時期','段階','場合','状況','期間','能力','可能性','力','性','的','方','面','点','傾向','状態','関係','行為','作用','場合','面']);
// Preferred tokens will be ranked earlier if present
const PRIORITY = [
  '退避','直感','協力関係','協力','基盤','基礎','安定','調整','信頼','警告','油断','目印','車輪','つながり','対立','合意','現場','安全策','優先順位','効率'
];

function jpTokens(str) {
  if (!str) return [];
  const s = String(str);
  const kanjiPhrases = s.match(/\p{Script=Han}{2,5}/gu) || [];
  const kataPhrases = s.match(/[ァ-ヶー]{2,8}/g) || [];
  const picks = [...kanjiPhrases, ...kataPhrases]
    .map(t => t.trim())
    .filter(t => t && !STOP.has(t));
  const uniq = Array.from(new Set(picks));
  // rank by priority index; unknowns go to bottom unchanged order
  uniq.sort((a,b) => (PRIORITY.indexOf(a) === -1 ? 999 : PRIORITY.indexOf(a)) - (PRIORITY.indexOf(b) === -1 ? 999 : PRIORITY.indexOf(b)));
  return uniq.slice(0, 4);
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
      const fromMeaning = jpTokens(line.meaning || '');
      const fromTrait = jpTokens(line.personality_trait || '');
      const tokens = Array.from(new Set([...
        fromMeaning,
        ...fromTrait
      ])).slice(0, 4);
      if (tokens.length) overrides[key] = tokens;
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(overrides, null, 2), 'utf8');
  console.log('✅ Built JP overrides:', Object.keys(overrides).length, 'entries');
  console.log('📄 Saved to', OUT);
}

if (require.main === module) build();
