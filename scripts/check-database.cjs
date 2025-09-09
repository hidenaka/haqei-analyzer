const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const entries = Object.keys(data);
console.log('総エントリー数:', entries.length);
console.log('期待値: 64卦 × 6爻 × 8パターン =', 64 * 6 * 8);
console.log('一致:', entries.length === 64 * 6 * 8 ? '✓' : '✗');
console.log('');

// 各卦のエントリー数を集計
const hexCounts = {};
entries.forEach(key => {
  const hex = key.split(' ')[0];
  hexCounts[hex] = (hexCounts[hex] || 0) + 1;
});

// 48件以外の卦を表示
console.log('=== 48件以外の卦 ===');
let problematicCount = 0;
Object.entries(hexCounts).sort().forEach(([hex, count]) => {
  if (count !== 48) {
    console.log(`${hex}: ${count}件 (期待値48との差: ${count - 48})`);
    problematicCount++;
  }
});

if (problematicCount === 0) {
  console.log('全ての卦が正しく48件ずつ入っています');
}

// ユニークな卦の数
const uniqueHexagrams = new Set(Object.keys(hexCounts));
console.log('\nユニークな卦の数:', uniqueHexagrams.size);

// 重複している可能性のある卦名をチェック
console.log('\n=== 重複の可能性がある卦名 ===');
const similarNames = [
  ['天澤履', '天沢履'],
  ['天雷無妄', '天雷无妄'],
  ['山地剝', '山地剥'],
  ['山風蠱', '山風蠱'],
  ['澤風大過', '沢風大過'],
  ['雷沢帰妹', '雷沢歸妹']
];

similarNames.forEach(([name1, name2]) => {
  const count1 = hexCounts[name1] || 0;
  const count2 = hexCounts[name2] || 0;
  if (count1 > 0 && count2 > 0) {
    console.log(`${name1}: ${count1}件, ${name2}: ${count2}件`);
  }
});

// 正しい64卦のリスト
const correct64Hexagrams = [
  '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
  '風天小畜', '天沢履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
  '沢雷随', '山風蠱', '地沢臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
  '天雷無妄', '山天大畜', '山雷頤', '沢風大過', '坎為水', '離為火', '沢山咸', '雷風恒',
  '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火沢睽', '水山蹇', '雷水解',
  '山沢損', '風雷益', '沢天夬', '天風姤', '沢地萃', '地風升', '沢水困', '水風井',
  '沢火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷沢歸妹', '雷火豊', '火山旅',
  '巽為風', '兌為沢', '風水渙', '水沢節', '風沢中孚', '雷山小過', '水火既済', '火水未済'
];

console.log('\n=== 期待される64卦で存在しないもの ===');
const missingHexagrams = correct64Hexagrams.filter(hex => !hexCounts[hex] || hexCounts[hex] === 0);
if (missingHexagrams.length > 0) {
  missingHexagrams.forEach(hex => console.log(`- ${hex}`));
} else {
  console.log('全て存在します');
}

console.log('\n=== 期待される64卦で48件未満のもの ===');
const incompleteHexagrams = correct64Hexagrams.filter(hex => hexCounts[hex] > 0 && hexCounts[hex] < 48);
if (incompleteHexagrams.length > 0) {
  incompleteHexagrams.forEach(hex => console.log(`- ${hex}: ${hexCounts[hex]}件`));
} else {
  console.log('全て48件以上です');
}

console.log('\n=== 余分な卦名（異体字など） ===');
const extraHexagrams = Object.keys(hexCounts).filter(hex => !correct64Hexagrams.includes(hex));
if (extraHexagrams.length > 0) {
  extraHexagrams.forEach(hex => console.log(`- ${hex}: ${hexCounts[hex]}件`));
} else {
  console.log('余分な卦名はありません');
}