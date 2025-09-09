'use strict';

const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'public', 'data', 'narratives_chain.v1.json');
const db = JSON.parse(fs.readFileSync(file, 'utf8'));

let has3phases = 0;
let has2phases = 0;
let hasOther = 0;
let samples2phase = [];
let samples3phase = [];

Object.entries(db).forEach(([key, value]) => {
  if (value.chain_long) {
    const text = value.chain_long;
    const hasFirst = text.includes('まず');
    const hasContinue = text.includes('続いて') || text.includes('次に');
    const hasLast = text.includes('最後に');
    
    if (hasFirst && hasContinue && hasLast) {
      has3phases++;
      if (samples3phase.length < 3) {
        samples3phase.push({ key, text: text.substring(0, 200) + '...' });
      }
    } else if (hasFirst && hasContinue) {
      has2phases++;
      if (samples2phase.length < 5) {
        samples2phase.push({ key, text: text.substring(0, 200) + '...' });
      }
    } else {
      hasOther++;
    }
  }
});

console.log('=== フェーズ構造分析 ===');
console.log(`3段階構造（まず/続いて・次に/最後に）: ${has3phases}件`);
console.log(`2段階構造（まず/続いて・次に）: ${has2phases}件`);
console.log(`その他の構造: ${hasOther}件`);
console.log(`合計: ${has3phases + has2phases + hasOther}件\n`);

console.log('=== 2段階構造のサンプル ===');
samples2phase.forEach(({ key, text }) => {
  console.log(`\n【${key}】`);
  console.log(text);
});

console.log('\n=== 3段階構造のサンプル ===');
samples3phase.forEach(({ key, text }) => {
  console.log(`\n【${key}】`);
  console.log(text);
});