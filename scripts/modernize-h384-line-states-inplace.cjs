#!/usr/bin/env node
/**
 * modernize-h384-line-states-inplace.cjs
 * public/data/h384-line-states.json を現代語・一文敬体へ上書き更新する簡易スクリプト（レポート無し）
 * 使用: node scripts/modernize-h384-line-states-inplace.cjs
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(process.cwd(), 'public/data/h384-line-states.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

// 句読点・誤連結・古語の簡易置換（安全度の高いものを優先）
const REPLACEMENTS = [
  [/\s+/g, ' '],
  [/です、/g, 'です。'],
  [/、、+/g, '、'],
  [/。。+/g, '。'],
  [/素早らしい/g, '素早い'],
  [/がちなになりがち/g, 'がち'],
  [/しがちなになりがち/g, 'しがち'],
  [/になりがちがち/g, 'になりがち'],
  [/顕らかに比す/g, '率直に親しくするのが良いです'],
  [/咎なし/g, '問題はありません'],
  [/利あり/g, '有利です'],
  [/亨る/g, 'うまく進みます'],
  [/亨/g, 'うまく進みます'],
  // 価値語の中立化（文脈に依存するため控えめに）
  [/君子/g, '模範的な人'],
  [/小人/g, '未熟な人'],
  // 古語→現代語の簡易説明（語尾は末尾で整える）
  [/貞(?=\W|$)/g, '正しい態度なら'],
  [/厲/g, '危うい'],
  [/孚/g, '誠実さ'],
  [/賁/g, '装い'],
  [/夬/g, '決断'],
];

function modernizeOne(s) {
  if (!s) return '';
  let t = String(s).trim();
  // 一旦句点を付与
  if (!/[。.!?！？」』)]$/.test(t)) t += '。';
  for (const [re, rep] of REPLACEMENTS) t = t.replace(re, rep);
  // 語尾統一（必要最低限）
  t = t.replace(/です\s*。?$/, 'です。');
  if (!/[。]$/.test(t)) t += '。';
  // 再度重複除去
  t = t.replace(/、、+/g, '、').replace(/。。+/g, '。');
  return t;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source not found:', SRC);
    process.exit(1);
  }
  const json = loadJson(SRC);
  const out = {};
  const keys = Object.keys(json);
  let changed = 0;
  for (const k of keys) {
    const before = json[k];
    const after = modernizeOne(before);
    out[k] = after;
    if (after !== before) changed++;
  }
  saveJson(SRC, out);
  console.log(`modernized ${changed}/${keys.length} entries in-place.`);
}

main();

