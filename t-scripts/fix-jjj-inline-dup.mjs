import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.cwd(), 'public', 'data', 'scenario-db-easy');

function normalize(s) {
  return String(s || '')
    .replace(/[\u3000\s]+/g, ' ')
    .replace(/\s*。\s*/g, '。')
    .trim();
}

function collapseExactDuplicateBlock(text) {
  const s = String(text || '');
  const m = s.match(/^([\s\S]+?)\s*\1\s*$/); // two identical halves
  if (m) return m[1].trim();
  return null;
}

function collapseConsecutiveDuplicateSentences(text) {
  const s = normalize(text);
  const parts = s.split('。').map(t => t.trim()).filter(t => t.length > 0);
  const out = [];
  let prev = '';
  for (const p of parts) {
    const n = p; // already trimmed, punctuation removed
    if (normalize(n) !== normalize(prev)) out.push(n);
    prev = n;
  }
  if (!out.length) return s; // no change
  return out.join('。') + '。';
}

function processFile(fp) {
  const raw = fs.readFileSync(fp, 'utf8');
  const data = JSON.parse(raw);
  const items = data.items || {};
  let changed = 0;
  for (const [key, rec] of Object.entries(items)) {
    if (!/_JJJ$/.test(key)) continue;
    const old = rec?.easy?.oneLine;
    if (!old || typeof old !== 'string') continue;
    let newer = old;
    // 1) whole block duplicated twice
    const collapsed = collapseExactDuplicateBlock(newer);
    if (collapsed) newer = collapsed;
    // 2) consecutive duplicate sentences inside
    newer = collapseConsecutiveDuplicateSentences(newer);
    if (newer !== old) {
      rec.easy.oneLine = newer;
      changed++;
    }
  }
  if (changed > 0) {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n');
  }
  return changed;
}

function main() {
  const files = fs.readdirSync(dir).filter(f => /^hex-\d+\.json$/.test(f));
  let total = 0, touched = 0;
  for (const f of files) {
    const c = processFile(path.join(dir, f));
    if (c > 0) { total += c; touched++; }
  }
  console.log(`✅ Fixed inline JJJ duplicates in ${touched}/${files.length} files, entries updated: ${total}`);
}

main();

