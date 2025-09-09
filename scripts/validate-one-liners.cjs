#!/usr/bin/env node
/**
 * Validate one-liners against authoring guide rules.
 * - Reads public/data/authoring/narratives_chain_one_liners.json
 * - Checks per key:
 *   - Single sentence style: no '。'
 *   - Commas '、' <= 2
 *   - Length 35..80 chars (soft bounds; report outside)
 *   - No advice/evaluation vocabulary
 * - Optional: --hex <name1,name2,...> filter by hex prefix
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let hexFilter = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--hex' && args[i + 1]) {
    hexFilter = new Set(args[i + 1].split(',').map(s => s.trim()).filter(Boolean));
    i++;
  }
}

const FP = path.join(process.cwd(), 'public/data/authoring/narratives_chain_one_liners.json');
const raw = fs.readFileSync(FP, 'utf-8');
const data = JSON.parse(raw);

const adviceWords = [
  'べき', 'すべき', 'しよう', 'しましょう', 'したほうが', 'した方が',
  '気をつけよう', '気を付けよう', '注意しよう', 'おすすめ', '推奨',
  '必要がある', 'すべきだ', 'べきだ', 'すべきです', 'しまうとよい'
];

let total = 0, violations = 0;
for (const [key, { one_liner }] of Object.entries(data)) {
  if (hexFilter) {
    const hex = key.split(' ')[0];
    if (!hexFilter.has(hex)) continue;
  }
  total++;
  const issues = [];
  const len = [...one_liner].length; // count by code points
  const commas = (one_liner.match(/、/g) || []).length;
  const hasPeriod = one_liner.includes('。');
  const badWord = adviceWords.find(w => one_liner.includes(w));

  if (hasPeriod) issues.push('contains 。');
  if (commas > 2) issues.push(`too many 、 (${commas})`);
  const minLen = 25; // guide 35±10 -> lower bound 25
  if (len < minLen || len > 80) issues.push(`length ${len} out of [${minLen}..80]`);
  if (badWord) issues.push(`advice word: ${badWord}`);

  if (issues.length) {
    violations++;
    console.log(`- ${key}: ${issues.join('; ')}`);
    console.log(`  -> ${one_liner}`);
  }
}

if (violations === 0) {
  console.log(`✅ Passed: ${total} items checked, no violations`);
} else {
  console.log(`⚠️  Violations: ${violations}/${total} items`);
}
