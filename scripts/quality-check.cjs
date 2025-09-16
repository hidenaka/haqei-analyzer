const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('='.repeat(80));
console.log('HAQEI 384爻ナラティブデータベース クオリティチェックレポート');
console.log('='.repeat(80));
console.log();

// 1. データ構造の完全性チェック
console.log('【1. データ構造完全性チェック】');
console.log('-'.repeat(40));

let structureErrors = 0;
let missingFields = [];

Object.entries(data).forEach(([key, value]) => {
  // 必須フィールドチェック
  const requiredFields = ['chain_long', 'tone', 'suitability', 'caution', 'label', 'start', 'final', 'updated_at'];
  requiredFields.forEach(field => {
    if (!value[field]) {
      missingFields.push(`${key} - ${field}がありません`);
      structureErrors++;
    }
  });
  
  // start/finalの構造チェック
  if (value.start && (!value.start.hex || value.start.pos === undefined || !value.start.name)) {
    missingFields.push(`${key} - start構造が不完全`);
    structureErrors++;
  }
  if (value.final && (!value.final.hex || value.final.pos === undefined || !value.final.name)) {
    missingFields.push(`${key} - final構造が不完全`);
    structureErrors++;
  }
});

console.log(`構造エラー数: ${structureErrors}`);
if (structureErrors > 0 && missingFields.length <= 10) {
  missingFields.forEach(err => console.log(`  - ${err}`));
} else if (structureErrors > 10) {
  console.log(`  （${structureErrors}件のエラーがあります - 最初の10件のみ表示）`);
  missingFields.slice(0, 10).forEach(err => console.log(`  - ${err}`));
}
console.log();

// 2. chain_longフォーマットチェック
console.log('【2. ナラティブフォーマットチェック】');
console.log('-'.repeat(40));

let formatIssues = {
  missingPhases: [],
  missingBreakthrough: [],
  tooShort: [],
  duplicate: new Map()
};

Object.entries(data).forEach(([key, value]) => {
  const narrative = value.chain_long || '';
  
  // 3フェーズ構造チェック
  if (!narrative.includes('まず、')) {
    formatIssues.missingPhases.push(key);
  }
  if (!narrative.includes('続いて、')) {
    formatIssues.missingPhases.push(key);
  }
  if (!narrative.includes('最後に、')) {
    formatIssues.missingPhases.push(key);
  }
  
  // 突破口チェック
  if (!narrative.includes('突破口：')) {
    formatIssues.missingBreakthrough.push(key);
  }
  
  // 長さチェック（100文字未満は短すぎる可能性）
  if (narrative.length < 100) {
    formatIssues.tooShort.push(`${key} (${narrative.length}文字)`);
  }
  
  // 重複チェック
  if (formatIssues.duplicate.has(narrative)) {
    const existing = formatIssues.duplicate.get(narrative);
    existing.push(key);
  } else {
    formatIssues.duplicate.set(narrative, [key]);
  }
});

// フェーズ構造の問題を表示
const uniqueMissingPhases = [...new Set(formatIssues.missingPhases)];
console.log(`3フェーズ構造の問題: ${uniqueMissingPhases.length}件`);
if (uniqueMissingPhases.length > 0 && uniqueMissingPhases.length <= 5) {
  uniqueMissingPhases.forEach(key => console.log(`  - ${key}`));
}

console.log(`突破口なし: ${formatIssues.missingBreakthrough.length}件`);
if (formatIssues.missingBreakthrough.length > 0 && formatIssues.missingBreakthrough.length <= 5) {
  formatIssues.missingBreakthrough.forEach(key => console.log(`  - ${key}`));
}

console.log(`短すぎるナラティブ: ${formatIssues.tooShort.length}件`);
if (formatIssues.tooShort.length > 0 && formatIssues.tooShort.length <= 5) {
  formatIssues.tooShort.forEach(item => console.log(`  - ${item}`));
}

// 完全重複のチェック
const duplicates = Array.from(formatIssues.duplicate.entries())
  .filter(([_, keys]) => keys.length > 1)
  .map(([narrative, keys]) => ({
    narrative: narrative.substring(0, 50) + '...',
    keys: keys
  }));

console.log(`完全重複ナラティブ: ${duplicates.length}件`);
if (duplicates.length > 0 && duplicates.length <= 3) {
  duplicates.forEach(dup => {
    console.log(`  - 重複グループ: ${dup.keys.join(', ')}`);
  });
}
console.log();

// 3. 爻名の正確性チェック
console.log('【3. 爻名正確性チェック】');
console.log('-'.repeat(40));

const hexagramStructures = {
  '乾為天': ['九', '九', '九', '九', '九', '九'],
  '坤為地': ['六', '六', '六', '六', '六', '六'],
  '水雷屯': ['九', '六', '九', '六', '六', '九'],
  '山水蒙': ['六', '九', '六', '六', '九', '六'],
  '水天需': ['九', '九', '九', '六', '九', '六'],
  '天水訟': ['六', '九', '六', '九', '九', '九'],
  '地水師': ['六', '九', '六', '六', '六', '六'],
  '水地比': ['六', '六', '六', '六', '九', '六']
};

let lineNameErrors = [];
const linePositions = ['初', '二', '三', '四', '五', '上'];

Object.entries(data).forEach(([key, value]) => {
  const parts = key.split(' ');
  const hexName = parts[0];
  const lineName = parts[1];
  
  if (hexagramStructures[hexName]) {
    const linePos = linePositions.findIndex(pos => lineName.includes(pos));
    if (linePos !== -1) {
      const expectedType = hexagramStructures[hexName][linePos];
      const expectedName = linePositions[linePos] + expectedType;
      if (lineName !== expectedName) {
        lineNameErrors.push(`${key} - 期待値: ${expectedName}, 実際: ${lineName}`);
      }
    }
  }
});

console.log(`爻名エラー: ${lineNameErrors.length}件`);
if (lineNameErrors.length > 0 && lineNameErrors.length <= 10) {
  lineNameErrors.forEach(err => console.log(`  - ${err}`));
}
console.log();

// 4. パターン分布チェック
console.log('【4. パターン分布チェック】');
console.log('-'.repeat(40));

const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
const patternCounts = {};
patterns.forEach(p => patternCounts[p] = 0);

Object.entries(data).forEach(([key, value]) => {
  if (value.label && patternCounts[value.label] !== undefined) {
    patternCounts[value.label]++;
  }
});

console.log('各パターンの出現回数（期待値: 各384回）:');
Object.entries(patternCounts).forEach(([pattern, count]) => {
  const diff = count - 384;
  const status = diff === 0 ? '✓' : '✗';
  console.log(`  ${pattern}: ${count}回 ${status} ${diff !== 0 ? `(差: ${diff > 0 ? '+' : ''}${diff})` : ''}`);
});
console.log();

// 5. 内容の質的チェック（サンプリング）
console.log('【5. 内容品質サンプルチェック】');
console.log('-'.repeat(40));

// ランダムに5つのエントリーをサンプリング
const entries = Object.entries(data);
const sampleSize = 5;
const samples = [];
for (let i = 0; i < sampleSize; i++) {
  const randomIndex = Math.floor(Math.random() * entries.length);
  samples.push(entries[randomIndex]);
}

console.log(`ランダムサンプル ${sampleSize}件:`);
samples.forEach(([key, value], index) => {
  console.log(`\n[サンプル ${index + 1}] ${key}`);
  console.log(`  文字数: ${value.chain_long.length}文字`);
  console.log(`  tone: ${value.tone}`);
  console.log(`  冒頭: ${value.chain_long.substring(0, 50)}...`);
  
  // キーワードの存在確認
  const keywords = ['まず', '続いて', '最後に', '突破口'];
  const foundKeywords = keywords.filter(kw => value.chain_long.includes(kw));
  console.log(`  キーワード: ${foundKeywords.join(', ')}`);
});
console.log();

// 6. 統計情報
console.log('【6. 統計情報】');
console.log('-'.repeat(40));

const narrativeLengths = Object.values(data).map(v => v.chain_long.length);
const avgLength = Math.round(narrativeLengths.reduce((a, b) => a + b, 0) / narrativeLengths.length);
const minLength = Math.min(...narrativeLengths);
const maxLength = Math.max(...narrativeLengths);

console.log(`総エントリー数: ${Object.keys(data).length}`);
console.log(`平均文字数: ${avgLength}文字`);
console.log(`最短: ${minLength}文字`);
console.log(`最長: ${maxLength}文字`);

// tone分布
const toneCounts = {};
Object.values(data).forEach(v => {
  toneCounts[v.tone] = (toneCounts[v.tone] || 0) + 1;
});
console.log('\ntone分布:');
Object.entries(toneCounts).forEach(([tone, count]) => {
  console.log(`  ${tone}: ${count}件 (${(count / entries.length * 100).toFixed(1)}%)`);
});

// 最終評価
console.log();
console.log('='.repeat(80));
console.log('【総合評価】');
console.log('='.repeat(80));

const totalIssues = structureErrors + uniqueMissingPhases.length + 
                   formatIssues.missingBreakthrough.length + 
                   formatIssues.tooShort.length + 
                   duplicates.length + 
                   lineNameErrors.length;

const qualityScore = Math.max(0, 100 - (totalIssues / entries.length * 100));

console.log(`検出された問題総数: ${totalIssues}`);
console.log(`品質スコア: ${qualityScore.toFixed(1)}%`);

if (qualityScore >= 95) {
  console.log('評価: 優秀 ✓ - プロダクション利用可能');
} else if (qualityScore >= 80) {
  console.log('評価: 良好 - 軽微な修正推奨');
} else if (qualityScore >= 60) {
  console.log('評価: 要改善 - 修正が必要');
} else {
  console.log('評価: 不十分 - 大幅な修正が必要');
}

console.log();
console.log('チェック完了: ' + new Date().toLocaleString('ja-JP'));