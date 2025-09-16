import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'public', 'data', 'scenario-db-easy');

function summarizeSeries(series) {
  try {
    const parts = String(series || '').split('→');
    const prog = parts.filter(p => p.includes('進')).length;
    const trans = parts.filter(p => p.includes('変')).length;
    if (prog === 3) return 'この道は、三段階で前に進みます。';
    if (trans === 3) return 'この道は、三段階で大きく方向を変えます。';
    if (prog === 2) return 'この道は、前に進みつつ、要所で見直します。';
    if (trans === 2) return 'この道は、変化を中心に、必要な場面では進みます。';
    return 'この道は、進むことと変えることをバランスよく行います。';
  } catch { return ''; }
}

function buildReadableOneLine(easy, series) {
  const intro = summarizeSeries(series);
  const n3 = easy?.next3 || {};
  const why = Array.isArray(easy?.why) ? easy.why.filter(Boolean) : [];
  const caution = (easy?.caution || '').trim();

  const steps = [];
  if (n3.first) steps.push(`まず、${n3.first}。`);
  if (n3.second) steps.push(`次に、${n3.second}。`);
  if (n3.final) steps.push(`最後に、${n3.final}。`);

  const reasons = why.length ? `こうすることで、${why.join('、')}。` : '';
  const cautionPart = caution ? `ただし、${caution}。` : '';

  // 2〜4文で高校生レベルのやさしい敬体に統一
  return [intro, ...steps, reasons, cautionPart]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function processFile(filePath, dryRun=false) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const items = data.items || {};
  let changed = 0;
  for (const [key, rec] of Object.entries(items)) {
    if (!rec || !rec.easy) continue;
    const newText = buildReadableOneLine(rec.easy, rec.series || rec.pathSig || '');
    if (newText && newText !== rec.easy.oneLine) {
      rec.easy.oneLine = newText;
      changed++;
    }
  }
  if (!dryRun && changed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  }
  return changed;
}

function main() {
  const files = fs.readdirSync(root).filter(f => /^hex-\d+\.json$/.test(f));
  let total = 0, filesTouched = 0;
  for (const f of files) {
    const fp = path.join(root, f);
    const c = processFile(fp, false);
    if (c > 0) { filesTouched++; total += c; }
  }
  console.log(`✅ Rewrote oneLine texts: ${total} items in ${filesTouched}/${files.length} files.`);
}

main();

