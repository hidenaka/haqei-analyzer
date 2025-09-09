#!/usr/bin/env node
// h384-line-states.json の自動検証（長さ/文数/禁止表現/語尾 重複）
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../');
const jsonPath = path.resolve(root, 'public/data/h384-line-states.json');

const bannedPhrases = [
  'です、',
  '、、',
  '。。',
];

// よくある誤りの検出（必要に応じ拡張）
const suspiciousPatterns = [
  /がちなになりがち/, // 二重
  /ますます。$/,      // 二重語尾の一例
];

// モダンさの観点で避けたい語感（比喩や文語が強い語）
const archaicHints = [
  '鼎',
  '黄牛',
  '雲上',
  /[^階]段に/, // 「段に」→「段階に」推奨（ただし「段階」は許容）
  /[^階]段なので/,
  /[^階]段とな/,
];

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function countSentences(s) {
  return (s.match(/。/g) || []).length;
}

function countChars(s) {
  // 全角半角を区別せず単純カウント（空白も含む）
  return [...String(s)].length;
}

function validateEntry(key, value) {
  const errors = [];
  const warnings = [];

  // 1行1文・文末「。」
  const sentences = countSentences(value);
  if (sentences !== 1) errors.push(`1文ルール違反（句点 ${sentences}個）`);
  if (!value.trim().endsWith('。')) errors.push('文末が「。」ではありません');

  // 長さ 60–110 字
  const len = countChars(value);
  if (len < 60 || len > 110) warnings.push(`文字数 ${len}（推奨 60–110）`);

  // 禁止表現
  for (const b of bannedPhrases) {
    if (value.includes(b)) errors.push(`禁止表現: ${b}`);
  }

  // 不審パターン
  for (const re of suspiciousPatterns) {
    if (re.test(value)) warnings.push(`表現要確認: ${re.toString()}`);
  }

  // モダンさチェック（参考警告）
  for (const h of archaicHints) {
    if (typeof h === 'string') {
      if (value.includes(h)) warnings.push(`古風/比喩強: ${h}`);
    } else if (h.test(value)) {
      warnings.push(`古風/比喩強: ${h}`);
    }
  }

  // 句読点過多（目安）
  const commas = (value.match(/、/g) || []).length;
  if (commas > 3) warnings.push(`読点が多め: ${commas}`);

  return { errors, warnings, len };
}

function main() {
  const data = loadJSON(jsonPath);
  const keys = Object.keys(data).sort((a, b) => {
    const [ha, la] = a.split('-').map(Number);
    const [hb, lb] = b.split('-').map(Number);
    return ha === hb ? la - lb : ha - hb;
  });

  let errorCount = 0;
  let warnCount = 0;
  for (const k of keys) {
    const v = data[k];
    const { errors, warnings, len } = validateEntry(k, v);
    if (errors.length || warnings.length) {
      console.log(`\n[${k}] (${len}字) ${v}`);
      for (const e of errors) { console.log(`  error: ${e}`); errorCount++; }
      for (const w of warnings) { console.log(`  warn : ${w}`); warnCount++; }
    }
  }

  if (errorCount === 0 && warnCount === 0) {
    console.log('✅ すべての行が規約に適合しています。');
  } else {
    console.log(`\n結果: errors=${errorCount}, warnings=${warnCount}`);
    if (errorCount > 0) process.exitCode = 1;
  }
}

if (require.main === module) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}
