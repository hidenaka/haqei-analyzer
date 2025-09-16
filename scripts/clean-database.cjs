const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('クリーンアップ前のエントリー数:', Object.keys(data).length);

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

// 異体字マッピング（削除対象 -> 正しい表記）
const variantMappings = {
  '天澤履': '天沢履',
  '山地剝': '山地剥',
  '天雷无妄': '天雷無妄',
  '澤風大過': '沢風大過',
  '雷沢帰妹': '雷沢歸妹'
};

// 新しいデータオブジェクト
const cleanedData = {};

// 各卦ごとに最新の48件だけを保持
correct64Hexagrams.forEach(hexName => {
  const hexEntries = [];
  
  // 現在のデータから該当する卦のエントリーを収集
  Object.entries(data).forEach(([key, value]) => {
    const keyHex = key.split(' ')[0];
    
    // 正しい卦名と一致するか、異体字マッピングに該当する場合
    if (keyHex === hexName || variantMappings[keyHex] === hexName) {
      // キーを正しい卦名に修正
      const correctedKey = keyHex === hexName ? key : key.replace(keyHex, hexName);
      hexEntries.push({ key: correctedKey, value, updated: value.updated_at });
    }
  });
  
  // 更新日時でソートして最新の48件を選択
  hexEntries.sort((a, b) => {
    const dateA = new Date(a.updated || '2025-01-01');
    const dateB = new Date(b.updated || '2025-01-01');
    return dateB - dateA;
  });
  
  // 各爻とパターンごとに1つずつ確実に取得
  const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
  const lines = ['初', '二', '三', '四', '五', '上'];
  
  lines.forEach(line => {
    patterns.forEach(pattern => {
      // 該当するエントリーを探す
      const entry = hexEntries.find(e => 
        e.key.includes(` ${line}`) && e.key.endsWith(`| ${pattern}`)
      );
      
      if (entry) {
        cleanedData[entry.key] = entry.value;
      }
    });
  });
});

console.log('クリーンアップ後のエントリー数:', Object.keys(cleanedData).length);

// ファイルに書き込み
fs.writeFileSync(dataPath, JSON.stringify(cleanedData, null, 2), 'utf8');

// 検証
const expectedCount = 64 * 6 * 8;
const actualCount = Object.keys(cleanedData).length;
console.log('期待値:', expectedCount);
console.log('実際:', actualCount);
console.log('結果:', actualCount === expectedCount ? '✓ 正常に3072件になりました' : `✗ ${expectedCount - actualCount}件不足`);

// 各卦のエントリー数を確認
const hexCounts = {};
Object.keys(cleanedData).forEach(key => {
  const hex = key.split(' ')[0];
  hexCounts[hex] = (hexCounts[hex] || 0) + 1;
});

const problematicHexagrams = Object.entries(hexCounts).filter(([_, count]) => count !== 48);
if (problematicHexagrams.length > 0) {
  console.log('\n48件でない卦:');
  problematicHexagrams.forEach(([hex, count]) => {
    console.log(`${hex}: ${count}件`);
  });
} else {
  console.log('\n✓ 全64卦が正しく48件ずつ入っています');
}