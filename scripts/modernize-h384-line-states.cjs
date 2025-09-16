#!/usr/bin/env node
/**
 * modernize-h384-line-states.cjs
 * - public/data/h384-line-states.json を現代語・一文敬体へ整形する支援スクリプト
 * - 自動変換 + 要レビュー箇所のマーキング + 差分レポート
 * 使い方:
 *   node scripts/modernize-h384-line-states.cjs --check
 *   node scripts/modernize-h384-line-states.cjs --write --log
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(process.cwd(), 'public/data/h384-line-states.json');
const OUT = path.join(process.cwd(), 'public/data/h384-line-states.cleaned.json');
const OUT_DIR = path.join(process.cwd(), 'scripts/output');
const REPORT_JSON = path.join(OUT_DIR, 'h384-modernize-report.json');
const REPORT_CSV = path.join(OUT_DIR, 'h384-modernize-diff.csv');

const args = new Set(process.argv.slice(2));
const DO_WRITE = args.has('--write');
const DO_LOG = args.has('--log');

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }); } catch {} }

function loadJson(p) {
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

// 置換ルール（安全度高 → 低の順）
const REPLACEMENTS = [
  [/素早らしい/g, '素早い'],
  [/がちなになりがち/g, 'がち'],
  [/しがちなになりがち/g, 'しがち'],
  [/になりがちがち/g, 'になりがち'],
  [/です、/g, 'です。'],
  [/、、+/g, '、'],
  [/。。+/g, '。'],
  [/\s+/g, (m)=> m.includes('\n') ? ' ' : ' '],
  [/顕らかに比す/g, '率直に親しくするのが良いです'],
  [/咎なし/g, '問題はありません'],
  [/利あり/g, '有利です'],
  [/亨る/g, 'うまく進みます'],
  [/亨/g, 'うまく進みます'],
];

// 文脈依存の古語・漢籍語は REVIEW マークに留める（人手修正前提）
const REVIEW_PATTERNS = [
  /君子|小人/, /貞/, /厲し|厲/, /孚|孚交如/, /賁如|賁/, /夬|履/, /鼎|井/, /蒺藜|茨/, /邑人|朋/,
];

function normalizeSentence(s) {
  if (!s) return '';
  let t = String(s).trim();
  // 一旦末尾句点がなければ付与（あとで重複は正規化）
  if (!/[。.!?！？」』\)]$/.test(t)) t += '。';
  for (const [re, rep] of REPLACEMENTS) {
    t = t.replace(re, rep);
  }
  // 二重句点・読点の再正規化
  t = t.replace(/、、+/g, '、').replace(/。。+/g, '。');
  // 敬体で終わらせる（荒いが実務上有効）
  if (!/です。$/.test(t) && /です$/.test(t)) t = t + '。';
  // 末尾が「ます」「です」以外の場合でも句点で閉じる
  if (!/[。]$/.test(t)) t += '。';
  return t;
}

function markReview(t) {
  let needs = false;
  for (const re of REVIEW_PATTERNS) {
    if (re.test(t)) { needs = true; break; }
  }
  return needs ? `【REVIEW】${t}` : t;
}

function modernizeValue(v) {
  const before = String(v || '').trim();
  let after = normalizeSentence(before);
  after = markReview(after);
  return { before, after };
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source file not found:', SRC);
    process.exit(1);
  }
  const data = loadJson(SRC);
  const keys = Object.keys(data).sort((a,b)=>{
    const [ah,al] = a.split('-').map(Number); const [bh,bl] = b.split('-').map(Number);
    return ah - bh || al - bl;
  });

  const cleaned = {};
  const report = [];
  for (const k of keys) {
    const { before, after } = modernizeValue(data[k]);
    cleaned[k] = after;
    const flagged = after.startsWith('【REVIEW】');
    report.push({ key: k, before, after, review: flagged });
  }

  // 出力
  if (DO_WRITE) {
    ensureDir(path.dirname(OUT));
    saveJson(OUT, cleaned);
  }
  if (DO_LOG) {
    ensureDir(OUT_DIR);
    fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8');
    const csvHeader = 'key,before,after,review\n';
    const csvBody = report.map(r => {
      const esc = (x)=> '"' + String(x).replace(/"/g,'""') + '"';
      return [r.key, esc(r.before), esc(r.after), r.review ? '1':'0'].join(',');
    }).join('\n');
    fs.writeFileSync(REPORT_CSV, csvHeader + csvBody + '\n', 'utf8');
  }

  // 要約
  const reviewCount = report.filter(r => r.review).length;
  console.log(`Processed: ${keys.length} entries. Review flags: ${reviewCount}.`);
  if (DO_WRITE) console.log(`Written: ${OUT}`);
  if (DO_LOG) console.log(`Reports: ${REPORT_JSON}, ${REPORT_CSV}`);
}

main();

