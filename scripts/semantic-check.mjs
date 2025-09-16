#!/usr/bin/env node
/**
 * H384 意味的特徴の照合チェック
 * - 参照: data/sources/databasemake/keywordmaster.csv（各卦・各爻の共通キーワード）
 * - 対象: public/assets/H384H64database.js の H384_DATA（キーワード/現代解釈の要約）
 * - 出力: 整合率が低い爻を抽出しレポート
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = process.cwd();
const H384_PATH = path.join(root, 'public', 'assets', 'H384H64database.js');
const CSV_PATH = path.join(root, 'data', 'sources', 'databasemake', 'keywordmaster.csv');

function loadH384() {
  const code = fs.readFileSync(H384_PATH, 'utf-8');
  const fakeDocument = { readyState: 'complete', addEventListener: () => {} };
  const fakeWindow = { document: fakeDocument, addEventListener: () => {} };
  const context = vm.createContext({ window: fakeWindow, document: fakeDocument, console });
  vm.runInContext(code, context, { filename: 'H384H64database.js' });
  const H384 = context.window.H384_DATA || context.H384_DATA;
  if (!Array.isArray(H384)) throw new Error('H384_DATA not found or not an array');
  return H384;
}

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  const rows = lines.map(l => {
    // CSVは単純構造: 5列。末尾列にカンマを含むため、素朴分割は不可
    // ここでは簡易的に最初の4カンマで分割し、残りを5列目とみなす
    const parts = [];
    let rest = l;
    for (let i = 0; i < 4; i++) {
      const idx = rest.indexOf(',');
      if (idx === -1) { parts.push(rest); rest = ''; }
      else { parts.push(rest.slice(0, idx)); rest = rest.slice(idx + 1); }
    }
    parts.push(rest);
    return parts;
  });
  return rows; // [ID,データ種別,親ID,項目名,関連する共通キーワード]
}

function buildReference(csvRows) {
  // hex系の行・line系の行を抽出
  const ref = {
    hexKeywords: new Map(), // num -> [keywords]
    lineRef: new Map(),     // `${num}-${pos}` -> { snippet, keywords[] }
  };
  for (const [id, type, parent, item, related] of csvRows.slice(1)) { // skip header
    if (!id) continue;
    if (id.startsWith('hex_')) {
      const num = Number(id.slice(4));
      const kw = (related || '').replace(/^"|"$/g, '').split(/\s*,\s*/).filter(Boolean);
      ref.hexKeywords.set(num, kw);
    } else if (id.startsWith('line_')) {
      // id: line_03_2 -> hex 3, position 2
      const m = id.match(/^line_(\d{2})_(\d)$/);
      if (!m) continue;
      const num = Number(m[1]);
      const pos = Number(m[2]);
      const snippet = (item || '').trim(); // 例: "初六：発蒙"
      const kw = (related || '').replace(/^"|"$/g, '').split(/\s*,\s*/).filter(Boolean);
      ref.lineRef.set(`${num}-${pos}`, { snippet, keywords: kw });
    }
  }
  return ref;
}

function yaoPosFromLabel(label) {
  if (!label) return null;
  // ラベル例: 初九, 九二, 六三, 六四, 九五, 上六, 上九
  const first = label[0];
  switch (first) {
    case '初': return 1;
    case '二': return 2;
    case '三': return 3;
    case '四': return 4;
    case '五': return 5;
    case '上': return 6;
    case '九':
    case '六': {
      // 形式が「九五」「六四」のケースもある
      const second = label[1];
      const map = { '二': 2, '三': 3, '四': 4, '五': 5 };
      return map[second] || null;
    }
    default: return null;
  }
}

// 簡易同義語・標準化
const normalize = (s) => String(s || '').replace(/[・\s]/g, '');
const synonyms = new Map([
  ['リーダー', 'リーダーシップ'],
  ['リーダー性', 'リーダーシップ'],
  ['主導', 'リーダーシップ'],
  ['安定', '持続・安定'],
  ['継続', '持続・安定'],
  ['持続', '持続・安定'],
  ['成長', '成長・発展'],
  ['発展', '成長・発展'],
  ['進展', '成長・発展'],
  ['慎重', '受動・待機'],
  ['待機', '受動・待機'],
  ['静観', '内省・静観'],
  ['内省', '内省・静観'],
  ['学び', '知性・学習'],
  ['学習', '知性・学習'],
  ['教育', '知性・学習'],
  ['知性', '知性・学習'],
  ['秩序', '構造化・秩序'],
  ['基礎固め', '構造化・秩序'],
  ['構造', '構造化・秩序'],
  ['整理', '構造化・秩序'],
  ['規律', '構造化・秩序'],
  ['調和', '調和・平和'],
  ['平和', '調和・平和'],
  ['共感', '共感・受容'],
  ['受容', '共感・受容'],
  ['支援', '育成・支援'],
  ['育成', '育成・支援'],
  ['サポート', '育成・支援'],
  ['慈愛', '母性・慈愛'],
  ['母性', '母性・慈愛'],
  ['革新', '創造・革新'],
  ['創造', '創造・革新'],
  ['挑戦', '挑戦・困難'],
  ['困難', '挑戦・困難'],
  ['リスク', '挑戦・困難'],
  ['停滞', '困難・停滞'],
  ['危機', '困難・停滞'],
  ['始まり', '始動・萌芽'],
  ['萌芽', '始動・萌芽'],
  ['始動', '始動・萌芽'],
  ['本質', '本質・真実'],
  ['真実', '本質・真実'],
  ['分析', '分析・探求'],
  ['探求', '分析・探求'],
  ['直感', '直感・感性'],
  ['感性', '直感・感性'],
  ['表現', '表現・伝達'],
  ['伝達', '表現・伝達'],
  ['社交', '社交性・人脈'],
  ['人脈', '社交性・人脈'],
  ['関係', '社交性・人脈'],
  ['交渉', '交渉・取引'],
  ['取引', '交渉・取引'],
  ['分配', '分配・贈与'],
  ['共有', '分配・贈与'],
  ['贈与', '分配・贈与'],
  ['富', '富・豊かさ'],
  ['豊か', '富・豊かさ'],
  ['成功', '実行・達成'],
  ['実行', '実行・達成'],
  ['達成', '実行・達成'],
  ['戦略', '戦略・計画'],
  ['計画', '戦略・計画'],
  ['慎重', '受動・待機'],
  ['先見', '先見・大局観'],
  ['大局観', '先見・大局観'],
  ['象徴', '美的感覚・洗練'],
  ['洗練', '美的感覚・洗練'],
  ['矛盾', '葛藤・矛盾'],
  ['対立', '葛藤・矛盾'],
  ['争い', '葛藤・矛盾'],
  ['浪費', '損失・浪費'],
  ['損失', '損失・浪費'],
  ['変化', '変動・転換'],
  ['転換', '変動・転換'],
  ['改革', '自己変容・脱皮'],
  ['変容', '自己変容・脱皮'],
  ['脱皮', '自己変容・脱皮'],
  ['リーダー', 'リーダーシップ'],
  ['チャンス', '成長・発展'],
]);

function alignKeywordToCategory(word) {
  if (!word) return '';
  const n = normalize(word);
  for (const [k, v] of synonyms.entries()) {
    if (n.includes(normalize(k))) return v;
  }
  return word;
}

function scoreAlignment(h384Keywords, refKeywords) {
  const refSet = new Set(refKeywords.map(k => normalize(k)));
  let hit = 0;
  const matched = [];
  for (const w of h384Keywords || []) {
    const aligned = alignKeywordToCategory(w);
    const key = normalize(aligned);
    if (refSet.has(key)) {
      hit++;
      matched.push(aligned);
    } else {
      // 部分一致も許容（例: 本質 vs 本質・真実）
      for (const rk of refSet) {
        if (rk.includes(key) || key.includes(rk)) {
          hit++;
          matched.push(aligned);
          break;
        }
      }
    }
  }
  const score = refSet.size ? hit / refSet.size : 0;
  return { score, hit, total: refSet.size, matched };
}

function main() {
  const H384 = loadH384();
  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  const ref = buildReference(parseCSV(csv));

  const issues = [];
  const perHexStats = new Map(); // hex -> {count, low}

  for (const e of H384) {
    const num = Number(e['卦番号']);
    const pos = yaoPosFromLabel(e['爻']);
    if (!num || !pos) continue;
    const refLine = ref.lineRef.get(`${num}-${pos}`);
    if (!refLine) continue; // 参照がない場合はスキップ

    const hKeywords = Array.isArray(e['キーワード']) ? e['キーワード'] : [];
    const { score, hit, total, matched } = scoreAlignment(hKeywords, refLine.keywords);

    // しきい値: 整合率 < 0.34 または ヒット0 を要注意として報告
    if (score < 0.34 || hit === 0) {
      issues.push({
        num,
        name: e['卦名'],
        pos,
        yao: e['爻'],
        score: Number(score.toFixed(2)),
        matched,
        ref: refLine.keywords,
        hkw: hKeywords,
        snippet: refLine.snippet
      });
    }

    // 集計
    const stat = perHexStats.get(num) || { count: 0, low: 0 };
    stat.count++;
    if (score < 0.34 || hit === 0) stat.low++;
    perHexStats.set(num, stat);
  }

  // 出力
  console.log('===== H384 意味照合レポート =====');
  console.log(`参照: keywordmaster.csv | 対象: H384_DATA`);
  console.log(`対象卦数（概数）: ${perHexStats.size} / 64`);
  console.log(`注意要件数: ${issues.length}`);

  // 問題が多い卦TOP10
  const hot = Array.from(perHexStats.entries())
    .map(([num, s]) => ({ num, low: s.low, count: s.count }))
    .sort((a, b) => b.low - a.low)
    .slice(0, 10);
  console.log('\n=== 問題が多い卦 TOP10 ===');
  for (const h of hot) {
    const name = (H384.find(x => Number(x['卦番号']) === h.num) || {})['卦名'] || '';
    console.log(`  卦${h.num}-${name}: 注意 ${h.low}/${h.count}`);
  }

  // 代表的な20件を詳報
  console.log('\n=== 要注意の代表例 20件 ===');
  issues.slice(0, 20).forEach((it, i) => {
    console.log(`${i + 1}. 卦${it.num}-${it.name} ${it.yao} | 整合率 ${it.score}`);
    console.log(`   参照: ${it.snippet} | [${it.ref.join(' / ')}]`);
    console.log(`   H384: [${it.hkw.join(' / ')}]`);
    if (it.matched.length) console.log(`   一致: [${it.matched.join(' / ')}]`);
  });

  if (issues.length > 0) process.exitCode = 1;

  // 保存: 詳細レポート
  try {
    const outDir = path.join(root, 'reports');
    fs.mkdirSync(outDir, { recursive: true });
    const outfile = path.join(outDir, `semantic-issues-${Date.now()}.json`);
    fs.writeFileSync(outfile, JSON.stringify({ summary: {
      totalIssues: issues.length,
      hot: hot,
    }, issues }, null, 2), 'utf-8');
    console.log(`\n📝 レポート保存: ${outfile}`);
  } catch (e) {
    console.warn('⚠️ レポート保存に失敗:', e?.message || e);
  }
}

main();
