#!/usr/bin/env node
// Audit H384 keywords quality across 384爻
// - Checks empties, length, placeholders, duplicates, per-position alignment, and suggests improvements

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const H384_PATH = path.resolve(__dirname, '../public/assets/H384H64database.js');

function loadH384() {
  const code = fs.readFileSync(H384_PATH, 'utf8');
  const fakeDoc = { readyState: 'complete', addEventListener: () => {}, getElementById: () => null, createElement: () => ({ style: {}, appendChild: ()=>{} }) };
  const ctx = { console, window: { document: fakeDoc }, document: fakeDoc }; // simulate browser
  vm.createContext(ctx);
  // Wrap to capture H384_DATA value into ctx
  const wrapped = `var H384_DATA; var H64_DATA;\n(function(){\n${code}\n;if (this.window && this.window.H384_DATA){ this.__H384__=this.window.H384_DATA; } else { this.__H384__=H384_DATA; } }).call(this);`;
  vm.runInContext(wrapped, ctx, { filename: 'H384H64database.js' });
  const data = ctx.__H384__;
  if (!Array.isArray(data)) throw new Error('Failed to load H384_DATA');
  return data;
}

function normalizeKana(s) { return (s||'').trim(); }

function isPlaceholderKeyword(k) {
  const bad = new Set([
    '問題なし','注意','吉','凶','良','可','不可','調整','タイミング','公の場'
  ]);
  return bad.has(k);
}

function getYaoPosition(yaoStr) {
  const map = { '初九':1, '九二':2, '九三':3, '九四':4, '九五':5, '上九':6, '用九':7, '初六':1, '六二':2, '六三':3, '六四':4, '六五':5, '上六':6, '用六':7 };
  return map[yaoStr] || null;
}

function expectedPositionSignals(pos) {
  // Expected semantic signals by position (broad)
  switch (pos) {
    case 1: return ['始まり','基礎','準備','芽生え'];
    case 2: return ['支援','受容','公正','協力'];
    case 3: return ['試練','困難','注意','挑戦'];
    case 4: return ['転換','展開','調整','機会'];
    case 5: return ['中心','リーダー','統率','公明'];
    case 6: return ['完成','極み','引き際','亢'];
    default: return [];
  }
}

function extractPhraseSuggestions(summary) {
  if (!summary) return [];
  // Simple heuristic: split by punctuation, pick short noun-ish tokens
  const parts = String(summary).split(/[、。・，．\s]+/).filter(Boolean);
  const stop = new Set(['こと','もの','ため','よう','時期','段階','場合','状況']);
  const candidates = [];
  for (const p of parts) {
    const t = p.trim();
    if (t.length < 2) continue;
    if (stop.has(t)) continue;
    // Prefer phrases containing Kanji
    if (/\p{Script=Han}/u.test(t)) candidates.push(t);
  }
  // Unique, top 3
  return Array.from(new Set(candidates)).slice(0, 3);
}

function audit(data) {
  const issues = [];
  const keywordCounts = new Map();
  let emptyCount = 0;
  let placeholderCount = 0;
  let positionMismatch = 0;

  const suggestions = [];
  for (const row of data) {
    const hex = row['卦番号'];
    const hexName = row['卦名'];
    const yao = row['爻'];
    const pos = getYaoPosition(yao);
    const kw = Array.isArray(row['キーワード']) ? row['キーワード'].map(normalizeKana).filter(Boolean) : [];
    const summary = row['現代解釈の要約'] || '';

    if (kw.length === 0) {
      emptyCount++;
      issues.push({ type: 'empty_keywords', hex, hexName, yao, suggest: extractPhraseSuggestions(summary) });
    }
    // Placeholder detection
    const bads = kw.filter(isPlaceholderKeyword);
    if (bads.length) {
      placeholderCount += bads.length;
      const sug = extractPhraseSuggestions(summary);
      issues.push({ type: 'placeholder_keywords', hex, hexName, yao, keywords: bads, suggest: sug });
      if (sug.length) {
        const clean = kw.filter(k => !isPlaceholderKeyword(k));
        const next = Array.from(new Set([...clean, ...sug])).slice(0, 3);
        suggestions.push({ hex, hexName, yao, current: kw, suggested: next, reason: 'placeholder_replacement' });
      }
    }
    // Position alignment (weak heuristic): expect at least one signal word present
    if (pos && kw.length) {
      const signals = expectedPositionSignals(pos);
      const hasSignal = kw.some(k => signals.some(s => k.includes(s)));
      if (!hasSignal) {
        positionMismatch++;
        const sug = extractPhraseSuggestions(summary);
        issues.push({ type: 'position_signal_missing', hex, hexName, yao, expected: signals.slice(0,3), keywords: kw, suggest: sug });
        // Proposal: augment with one missing signal
        const add = signals[0];
        if (add && !kw.some(k => k.includes(add))) {
          const augmented = Array.from(new Set([...kw, add])).slice(0, 4);
          suggestions.push({ hex, hexName, yao, current: kw, suggested: augmented, reason: 'position_signal_augmentation' });
        }
      }
    }
    // Count duplicates
    for (const k of kw) keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1);
  }

  // Top duplicate keywords
  const topDupes = Array.from(keywordCounts.entries())
    .sort((a,b) => b[1]-a[1])
    .slice(0, 20)
    .map(([k,c]) => ({ keyword:k, count:c }));

  // Summary
  const total = data.length;
  const byHex = new Map();
  data.forEach(r => {
    const h=r['卦番号']; byHex.set(h, (byHex.get(h)||0)+1);
  });

  return {
    totals: {
      entries: total,
      hexagramCount: byHex.size,
      emptyKeywords: emptyCount,
      placeholderKeywords: placeholderCount,
      positionSignalMissing: positionMismatch
    },
    topDuplicateKeywords: topDupes,
    sampleIssues: issues.slice(0, 50),
    allIssues: issues,
    suggestions
  };
}

function main() {
  const h384 = loadH384();
  const report = audit(h384);
  const outPath = path.resolve(process.cwd(), 'h384-keyword-audit-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
  const sugPath = path.resolve(process.cwd(), 'h384-keyword-suggestions.json');
  fs.writeFileSync(sugPath, JSON.stringify(report.suggestions, null, 2), 'utf8');
  console.log('✅ Audit complete');
  console.log(' - Entries:', report.totals.entries);
  console.log(' - Empty keywords:', report.totals.emptyKeywords);
  console.log(' - Placeholder hits:', report.totals.placeholderKeywords);
  console.log(' - Position-signal missing:', report.totals.positionSignalMissing);
  console.log(' - Top duplicates:', report.topDuplicateKeywords.slice(0,5).map(x=>`${x.keyword}(${x.count})`).join(', '));
  console.log('📄 Report saved to', outPath);
  console.log('✍️ Suggestions saved to', sugPath);
}

if (require.main === module) {
  main();
}
