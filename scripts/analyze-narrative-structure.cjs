'use strict';

const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
const db = JSON.parse(fs.readFileSync(file, 'utf8'));

// サンプリングチェック - 各パターンから数個ずつ内容を確認
console.log('=== サンプル内容確認 ===\n');

const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
const samples = [
  '乾為天 初九',
  '坤為地 六二',
  '水雷屯 初九',
  '山水蒙 六三',
  '水火既済 九三',
  '火水未済 上六'
];

samples.forEach(sample => {
  console.log(`\n【${sample}】`);
  patterns.slice(0, 2).forEach(pattern => { // 最初の2パターンのみチェック
    const key = `${sample} | ${pattern}`;
    if (db[key]) {
      const entry = db[key];
      console.log(`\n${pattern} (${entry.label}):`);
      if (entry.chain_long) {
        // 最初の100文字のみ表示
        const preview = entry.chain_long.substring(0, 100);
        console.log(`  内容: ${preview}...`);
        console.log(`  文字数: ${entry.chain_long.length}文字`);
        console.log(`  適用場面: ${entry.suitability || '未設定'}`);
      } else {
        console.log('  ⚠️ 内容が空です');
      }
    } else {
      console.log(`  ⚠️ エントリーが存在しません`);
    }
  });
});

// 文字数統計
console.log('\n\n=== 文字数統計 ===');
const lengths = Object.values(db)
  .filter(v => v.chain_long)
  .map(v => v.chain_long.length);

if (lengths.length > 0) {
  const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  
  console.log(`平均文字数: ${avgLength}文字`);
  console.log(`最小文字数: ${minLength}文字`);
  console.log(`最大文字数: ${maxLength}文字`);
  
  // 文字数分布
  console.log('\n文字数分布:');
  const ranges = [
    [0, 100],
    [100, 200],
    [200, 300],
    [300, 400],
    [400, 500],
    [500, Infinity]
  ];
  
  ranges.forEach(([min, max]) => {
    const count = lengths.filter(l => l >= min && l < max).length;
    const label = max === Infinity ? `${min}文字以上` : `${min}-${max}文字`;
    const bar = '■'.repeat(Math.round(count / 50));
    console.log(`${label.padEnd(12)}: ${count.toString().padStart(4)}件 ${bar}`);
  });
}

// 必須フィールドのチェック
console.log('\n\n=== 必須フィールドチェック ===');
const requiredFields = ['chain_long', 'tone', 'suitability', 'caution', 'label', 'start', 'updated_at'];
const missingFields = {};

Object.entries(db).forEach(([key, value]) => {
  requiredFields.forEach(field => {
    if (!value[field] || (typeof value[field] === 'string' && value[field] === '')) {
      if (!missingFields[field]) missingFields[field] = [];
      missingFields[field].push(key);
    }
  });
});

requiredFields.forEach(field => {
  const missing = missingFields[field] || [];
  if (missing.length > 0) {
    console.log(`${field}: ${missing.length}件が未設定`);
    if (missing.length <= 5) {
      missing.forEach(key => console.log(`  - ${key}`));
    }
  } else {
    console.log(`${field}: ✓ 全て設定済み`);
  }
});