'use strict';

const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
const db = JSON.parse(fs.readFileSync(file, 'utf8'));

// 64卦のリスト
const hexagrams = [
  '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
  '風天小畜', '天沢履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
  '沢雷随', '山風蠱', '地沢臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
  '天雷無妄', '山天大畜', '山雷頤', '沢風大過', '坎為水', '離為火', '沢山咸', '雷風恒',
  '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火沢睽', '水山蹇', '雷水解',
  '山沢損', '風雷益', '沢天夬', '天風姤', '沢地萃', '地風升', '沢水困', '水風井',
  '沢火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷沢帰妹', '雷火豊', '火山旅',
  '巽為風', '兌為沢', '風水渙', '水沢節', '風沢中孚', '雷山小過', '水火既済', '火水未済'
];

const lines = ['初九', '初六', '九二', '六二', '九三', '六三', '九四', '六四', '九五', '六五', '上九', '上六', '用九', '用六'];
const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];

let totalExpected = 0;
let totalFound = 0;
let emptyEntries = [];
let missingEntries = [];

// 各卦の爻をチェック
hexagrams.forEach(hex => {
  // 通常の6爻
  for (let i = 1; i <= 6; i++) {
    lines.forEach(line => {
      // 爻の位置と陰陽の組み合わせをチェック
      const lineNum = line.match(/初|二|三|四|五|上/)?.[0];
      const yinYang = line.includes('九') ? '陽' : '陰';
      
      // 位置に対応する爻名のみチェック
      if ((i === 1 && lineNum === '初') ||
          (i === 2 && lineNum === '二') ||
          (i === 3 && lineNum === '三') ||
          (i === 4 && lineNum === '四') ||
          (i === 5 && lineNum === '五') ||
          (i === 6 && lineNum === '上')) {
        
        patterns.forEach(pattern => {
          const key = `${hex} ${line} | ${pattern}`;
          
          // このキーが存在すべきかチェック
          if (db[key] !== undefined) {
            totalFound++;
            if (!db[key].chain_long || db[key].chain_long === '') {
              emptyEntries.push(key);
            }
          }
        });
      }
    });
  }
});

// 用九と用六をチェック（乾為天と坤為地のみ）
if (db['乾為天 用九 | JJJ']) {
  patterns.forEach(pattern => {
    const key = `乾為天 用九 | ${pattern}`;
    if (db[key]) {
      totalFound++;
      if (!db[key].chain_long || db[key].chain_long === '') {
        emptyEntries.push(key);
      }
    }
  });
}

if (db['坤為地 用六 | JJJ']) {
  patterns.forEach(pattern => {
    const key = `坤為地 用六 | ${pattern}`;
    if (db[key]) {
      totalFound++;
      if (!db[key].chain_long || db[key].chain_long === '') {
        emptyEntries.push(key);
      }
    }
  });
}

// 実際のデータベースの統計
const allEntries = Object.entries(db);
const totalEntries = allEntries.length;
const entriesWithContent = allEntries.filter(([k, v]) => v.chain_long && v.chain_long !== '').length;
const entriesEmpty = allEntries.filter(([k, v]) => !v.chain_long || v.chain_long === '').length;

console.log('=== データベース統計 ===');
console.log(`総エントリー数: ${totalEntries}`);
console.log(`内容ありエントリー: ${entriesWithContent}`);
console.log(`空のエントリー: ${entriesEmpty}`);

if (entriesEmpty > 0) {
  console.log('\n=== 空のエントリー（最初の20件）===');
  allEntries
    .filter(([k, v]) => !v.chain_long || v.chain_long === '')
    .slice(0, 20)
    .forEach(([key]) => {
      console.log(` - ${key}`);
    });
}

// パターン別の統計
console.log('\n=== パターン別統計 ===');
patterns.forEach(pattern => {
  const count = allEntries.filter(([k]) => k.includes(`| ${pattern}`)).length;
  const filled = allEntries.filter(([k, v]) => k.includes(`| ${pattern}`) && v.chain_long && v.chain_long !== '').length;
  console.log(`${pattern}: ${filled}/${count} 完成`);
});

// 卦別の統計（問題のある卦のみ表示）
console.log('\n=== 卦別統計（未完成の卦）===');
hexagrams.forEach(hex => {
  const hexEntries = allEntries.filter(([k]) => k.startsWith(hex + ' '));
  const hexFilled = hexEntries.filter(([k, v]) => v.chain_long && v.chain_long !== '').length;
  if (hexFilled < hexEntries.length) {
    console.log(`${hex}: ${hexFilled}/${hexEntries.length} 完成`);
  }
});

// 個別の空エントリーをパターン認識
console.log('\n=== 空エントリーの詳細分析 ===');
const emptyByHex = {};
allEntries
  .filter(([k, v]) => !v.chain_long || v.chain_long === '')
  .forEach(([key]) => {
    const hexName = key.split(' ')[0];
    if (!emptyByHex[hexName]) emptyByHex[hexName] = [];
    emptyByHex[hexName].push(key);
  });

Object.entries(emptyByHex).forEach(([hex, keys]) => {
  console.log(`\n${hex} (${keys.length}件):`);
  keys.slice(0, 5).forEach(key => console.log(`  - ${key}`));
  if (keys.length > 5) console.log(`  ... 他${keys.length - 5}件`);
});