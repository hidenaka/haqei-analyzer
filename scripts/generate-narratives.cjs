'use strict';

// Generate story-style narratives from H384 database
// Output: public/data/narratives.v1.json

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadH384(dbPath) {
  const code = fs.readFileSync(dbPath, 'utf8');
  // Try executing as-is
  const sandbox = { H384_DATA: [], window: { setH384Data: function(){} }, document: { readyState: 'complete', addEventListener: function(){} } };
  vm.createContext(sandbox);
  try {
    vm.runInContext(code, sandbox, { filename: dbPath });
  } catch (_) {}
  if (Array.isArray(sandbox.H384_DATA) && sandbox.H384_DATA.length > 0) return sandbox.H384_DATA;
  // Fallback: extract array literal by regex and eval into isolated context
  const m = code.match(/let\s+H384_DATA\s*=\s*(\[([\s\S]*?)\]);/);
  if (!m) return [];
  const arrCode = 'var H384_OUT = ' + m[1] + ';';
  const sb2 = {};
  vm.createContext(sb2);
  vm.runInContext(arrCode, sb2, { filename: dbPath + ':array' });
  return Array.isArray(sb2.H384_OUT) ? sb2.H384_OUT : [];
}

function ensurePeriod(s) {
  const t = String(s || '').trim();
  if (!t) return '';
  return /[。.]$/.test(t) ? t : t + '。';
}

function toStoryLong(row) {
  const base = String(row['現代解釈の要約'] || '').trim();
  const k = (row['キーワード'] || []).map(String).filter(Boolean);
  const hex = row['卦名'];
  const yao = row['爻'];
  // Simple story conversion: calm intro → situation → gentle guidance
  const intro = `空気が静まり、足元を確かめるときです。`;
  const body = base ? base.replace(/。+/g, '。').replace(/\s+/g, ' ').trim() : `${hex} ${yao} の要点に沿い、無理なく歩を進めます。`;
  const hint = k.length ? `鍵は「${k.slice(0,3).join('・')}」。` : '';
  const guide = `肩の力を抜き、関係を丁寧に整えるほど、次の扉が静かに開きます。`;
  return [ensurePeriod(intro), ensurePeriod(body), ensurePeriod(hint), ensurePeriod(guide)].filter(Boolean).join('');
}

function toStoryShort(row) {
  const base = String(row['現代解釈の要約'] || '').trim();
  const s = base || `${row['卦名']} ${row['爻']} の要点。`;
  return ensurePeriod(s);
}

function main() {
  const dbPath = path.resolve(__dirname, '..', 'public', 'assets', 'H384H64database.js');
  const outPath = path.resolve(__dirname, '..', 'public', 'data', 'narratives.v1.json');
  const data = loadH384(dbPath);
  const out = {};
  for (const row of data) {
    const key = `${row['卦名']} ${row['爻']}`;
    out[key] = {
      short: toStoryShort(row),
      long: toStoryLong(row),
      tone: 'story',
      suitability: '',
      caution: ''
    };
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', outPath, 'items=', Object.keys(out).length);
}

if (require.main === module) {
  main();
}
