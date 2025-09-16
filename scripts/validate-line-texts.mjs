#!/usr/bin/env node
/**
 * H384 LINEテキスト検証スクリプト
 * - 対象: public/assets/H384H64database.js の H384_DATA
 * - 目的: 易経の卦・爻ごとの構造的正しさと網羅性を検証
 *   - 64卦 x 6爻 + 用九/用六 の386エントリ確認
 *   - 卦番号と卦名が King Wen 順と一致
 *   - 各爻の陰/陽ラベル（六/九）が卦のビット構造と一致
 *   - 必須フィールドの有無と型/範囲の基本チェック
 * - 出力: コンソールに要約と不整合の詳細
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = process.cwd();
const H384_PATH = path.join(root, 'public', 'assets', 'H384H64database.js');
const KINGWEN_CSV = path.join(root, 'data', 'kingwen-canonical.csv');

// 八卦→ビット（下爻→上爻）
const trigramToBits = {
  '乾': '111', // ☰ 天
  '坤': '000', // ☷ 地
  '震': '001', // ☳ 雷
  '坎': '010', // ☵ 水
  '艮': '100', // ☶ 山
  '巽': '110', // ☴ 風
  '離': '101', // ☲ 火
  '兑': '011', // ☱ 沢（注: 兌/兑）
  '兌': '011', // 全角異体字も許容
};

function loadH384() {
  const code = fs.readFileSync(H384_PATH, 'utf-8');
  // 最小限のブラウザAPIスタブ
  const fakeDocument = {
    readyState: 'complete',
    addEventListener: () => {},
  };
  const fakeWindow = {
    document: fakeDocument,
    addEventListener: () => {},
  };
  const context = vm.createContext({ window: fakeWindow, document: fakeDocument, console });
  vm.runInContext(code, context, { filename: 'H384H64database.js' });
  const H384 = context.window.H384_DATA || context.H384_DATA;
  if (!Array.isArray(H384)) throw new Error('H384_DATA not found or not an array');
  return H384;
}

function loadKingWen() {
  const csv = fs.readFileSync(KINGWEN_CSV, 'utf-8').trim().split('\n');
  const headers = csv.shift(); // num,name,lowerTrigram,upperTrigram
  const rows = csv.map(l => l.split(','));
  const map = new Map(); // num -> { name, binary, bits: [b1..b6] }
  for (const [num, name, lower, upper] of rows) {
    const lb = trigramToBits[lower.trim()];
    const ub = trigramToBits[upper.trim()];
    if (!lb || !ub) throw new Error(`Unknown trigram in CSV: ${lower}, ${upper}`);
    const binary = lb + ub; // 6ビット（下3 + 上3）
    const bits = binary.split('').map(c => (c === '1' ? 1 : 0));
    map.set(Number(num), { name: name.trim(), binary, bits });
  }
  if (map.size !== 64) throw new Error(`KingWen CSV size ${map.size} !== 64`);
  return map;
}

function expectedYaoLabel(pos, yang) {
  // pos: 1..6, yang: boolean
  if (pos === 1) return `初${yang ? '九' : '六'}`;
  if (pos === 6) return `上${yang ? '九' : '六'}`;
  const posLabel = { 2: '二', 3: '三', 4: '四', 5: '五' }[pos];
  return `${yang ? '九' : '六'}${posLabel}`;
}

function normalizeName(s) {
  if (!s) return s;
  return String(s)
    .replace(/澤/g, '沢')
    .replace(/兌/g, '兑')
    .replace(/剝/g, '剥')
    .replace(/无/g, '無');
}

function main() {
  const errors = [];
  const warnings = [];
  const info = [];

  // 1) ロード
  const H384 = loadH384();
  const kingwen = loadKingWen();

  // 2) 件数・用九/用六
  const lengthOk = H384.length === 386;
  if (!lengthOk) errors.push(`H384_DATA length ${H384.length} !== 386 (64x6 + 用九 + 用六)`);

  const hasYou9 = H384.some(e => e['卦番号'] === 1 && e['爻'] === '用九');
  const hasYou6 = H384.some(e => e['卦番号'] === 2 && e['爻'] === '用六');
  if (!hasYou9) errors.push('乾為天(1) の 用九 が見つかりません');
  if (!hasYou6) errors.push('坤為地(2) の 用六 が見つかりません');

  // 3) 卦番号→卦名一致、各卦の爻ラベル整合性
  // 集計用
  const perHex = new Map(); // num -> entries[]
  for (const e of H384) {
    const n = Number(e['卦番号']);
    const name = e['卦名'];
    const yao = e['爻'];
    if (!kingwen.has(n)) {
      errors.push(`未知の卦番号: ${n} (通し番号 ${e['通し番号']})`);
      continue;
    }
    const kw = kingwen.get(n);
    if (normalizeName(kw.name) !== normalizeName(name)) {
      errors.push(`卦名不一致: 卦番号${n} は '${kw.name}' であるべきですが '${name}' が記載 (通し番号 ${e['通し番号']})`);
    }
    if (!perHex.has(n)) perHex.set(n, []);
    perHex.get(n).push(e);
  }

  // 4) 各卦の爻構造チェック
  for (const [num, entries] of perHex) {
    const kw = kingwen.get(num);
    // 期待爻ラベル（用九/用六除く）
    const expected = [];
    const bitAt = (pos) => {
      // bitsは [lowerTop, lowerMid, lowerBot, upperTop, upperMid, upperBot]
      switch (pos) {
        case 1: return kw.bits[2]; // lower bottom
        case 2: return kw.bits[1]; // lower middle
        case 3: return kw.bits[0]; // lower top
        case 4: return kw.bits[5]; // upper bottom
        case 5: return kw.bits[4]; // upper middle
        case 6: return kw.bits[3]; // upper top
        default: return 0;
      }
    };
    for (let pos = 1; pos <= 6; pos++) {
      const yang = bitAt(pos) === 1;
      expected.push(expectedYaoLabel(pos, yang));
    }
    // 実際（用九/用六以外）
    const actual = entries
      .map(e => e['爻'])
      .filter(y => !/^用[六九]$/.test(y));
    if (actual.length !== 6) {
      errors.push(`卦 ${num}-${kw.name}: 爻の件数 ${actual.length} !== 6`);
      continue;
    }
    // 存在一致チェック（順序は不問）
    for (let i = 0; i < 6; i++) {
      const exp = expected[i];
      if (!actual.includes(exp)) {
        errors.push(`卦 ${num}-${kw.name}: 期待する爻ラベル '${exp}' が見つかりません`);
      }
    }
    // 用九/用六のチェック
    if (num === 1) {
      const ok = entries.some(e => e['爻'] === '用九');
      if (!ok) errors.push(`卦 1-乾為天: 用九 が存在しません`);
    }
    if (num === 2) {
      const ok = entries.some(e => e['爻'] === '用六');
      if (!ok) errors.push(`卦 2-坤為地: 用六 が存在しません`);
    }
  }

  // 5) 必須フィールドと値範囲の基本検証
  for (const e of H384) {
    const idx = e['通し番号'];
    if (!e['卦名'] || !e['爻'] || !e['卦番号']) {
      errors.push(`通し番号${idx}: 必須フィールド欠落（卦名/爻/卦番号）`);
    }
    if (!Array.isArray(e['キーワード']) || e['キーワード'].length === 0) {
      warnings.push(`通し番号${idx}: キーワードが空、または配列でない`);
    }
    if (typeof e['現代解釈の要約'] !== 'string' || e['現代解釈の要約'].trim().length < 10) {
      warnings.push(`通し番号${idx}: 現代解釈の要約が短すぎる/未設定`);
    }
    // スコア範囲（暫定）
    const scoreKeys = ['S1_基本スコア','S2_ポテンシャル','S3_安定性スコア','S4_リスク','S5_主体性推奨スタンス','S6_変動性スコア','S7_総合評価スコア'];
    for (const k of scoreKeys) {
      const v = e[k];
      if (k === 'S5_主体性推奨スタンス') {
        if (!['能動','受動','中立'].includes(v)) warnings.push(`通し番号${idx}: ${k}='${v}' が不正`);
      } else if (k === 'S4_リスク') {
        if (typeof v !== 'number' || v < -100 || v > 100) warnings.push(`通し番号${idx}: ${k}=${v} 範囲外`);
      } else {
        if (typeof v !== 'number' || v < 0 || v > 100) warnings.push(`通し番号${idx}: ${k}=${v} 範囲外`);
      }
    }
  }

  // 6) 卦ごとの件数まとめ
  const counts = Array.from(perHex.entries()).map(([num, arr]) => ({ num, name: kingwen.get(num).name, count: arr.length }));
  const countIssues = counts.filter(c => !(c.num === 1 || c.num === 2 ? c.count === 7 : c.count === 6));
  for (const c of countIssues) {
    errors.push(`卦 ${c.num}-${c.name}: エントリ数 ${c.count} 件（期待 ${c.num===1||c.num===2?7:6} 件）`);
  }

  // 7) 結果出力
  console.log('===== H384 構造検証レポート =====');
  console.log(`データ件数: ${H384.length} / 386  ${lengthOk ? '✅' : '❌'}`);
  console.log(`用九(乾): ${hasYou9 ? '✅' : '❌'}  用六(坤): ${hasYou6 ? '✅' : '❌'}`);
  console.log(`卦の内訳: 1/2 = 7件, 他 = 6件  問題卦: ${countIssues.length}件`);
  if (errors.length) {
    console.log('\n❌ 重大問題一覧:');
    errors.slice(0, 200).forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    if (errors.length > 200) console.log(`  ... 他 ${errors.length - 200} 件`);
  } else {
    console.log('\n✅ 重大問題は検出されませんでした');
  }
  if (warnings.length) {
    console.log('\n⚠️ 注意事項一覧:');
    warnings.slice(0, 200).forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
    if (warnings.length > 200) console.log(`  ... 他 ${warnings.length - 200} 件`);
  } else {
    console.log('\nℹ️ 追加の注意事項はありません');
  }

  // 成否コード
  if (errors.length) process.exitCode = 1;
}

main();
