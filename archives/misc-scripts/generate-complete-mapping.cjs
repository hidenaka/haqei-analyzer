const fs = require('fs');

// 基本八卦定義（King Wen順序）
const trigrams = {
  '111': '乾', // 天
  '000': '坤', // 地  
  '100': '震', // 雷
  '010': '坎', // 水
  '001': '艮', // 山
  '110': '巽', // 風
  '101': '離', // 火
  '011': '兌'  // 澤
};

// 卦名から八卦を推定する関数
function getTrigramsFromName(name) {
  const mapping = {
    // 単一卦（同じ八卦の重複）
    '乾為天': ['乾', '乾'],
    '坤為地': ['坤', '坤'], 
    '坎為水': ['坎', '坎'],
    '離為火': ['離', '離'],
    '震為雷': ['震', '震'],
    '艮為山': ['艮', '艮'],
    '巽為風': ['巽', '巽'],
    '兌為沢': ['兌', '兌'],
    
    // 複合卦（卦名から推定）
    '水雷屯': ['坎', '震'],
    '山水蒙': ['艮', '坎'],
    '水天需': ['坎', '乾'],
    '天水訟': ['乾', '坎'],
    '地水師': ['坤', '坎'],
    '水地比': ['坎', '坤'],
    '風天小畜': ['巽', '乾'],
    '天澤履': ['乾', '兌'],
    '地天泰': ['坤', '乾'],
    '天地否': ['乾', '坤'],
    '天火同人': ['乾', '離'],
    '火天大有': ['離', '乾'],
    '地山謙': ['坤', '艮'],
    '雷地豫': ['震', '坤'],
    '沢雷随': ['兌', '震'],
    '山風蠱': ['艮', '巽'],
    '地沢臨': ['坤', '兌'],
    '風地観': ['巽', '坤'],
    '火雷噬嗑': ['離', '震'],
    '山火賁': ['艮', '離'],
    '山地剝': ['艮', '坤'],
    '地雷復': ['坤', '震'],
    '天雷无妄': ['乾', '震'],
    '山天大畜': ['艮', '乾'],
    '山雷頤': ['艮', '震'],
    '澤風大過': ['兌', '巽'],
    '沢山咸': ['兌', '艮'],
    '雷風恒': ['震', '巽'],
    '天山遯': ['乾', '艮'],
    '雷天大壮': ['震', '乾'],
    '火地晋': ['離', '坤'],
    '地火明夷': ['坤', '離'],
    '風火家人': ['巽', '離'],
    '火沢睽': ['離', '兌'],
    '水山蹇': ['坎', '艮'],
    '雷水解': ['震', '坎'],
    '山沢損': ['艮', '兌'],
    '風雷益': ['巽', '震'],
    '沢天夬': ['兌', '乾'],
    '天風姤': ['乾', '巽'],
    '沢地萃': ['兌', '坤'],
    '地風升': ['坤', '巽'],
    '沢水困': ['兌', '坎'],
    '水風井': ['坎', '巽'],
    '沢火革': ['兌', '離'],
    '火風鼎': ['離', '巽'],
    '風山漸': ['巽', '艮'],
    '雷沢帰妹': ['震', '兌'],
    '雷火豊': ['震', '離'],
    '火山旅': ['離', '艮'],
    '風水渙': ['巽', '坎'],
    '水沢節': ['坎', '兌'],
    '風沢中孚': ['巽', '兌'],
    '雷山小過': ['震', '艮'],
    '水火既済': ['坎', '離'],
    '火水未済': ['離', '坎']
  };
  
  return mapping[name] || ['unknown', 'unknown'];
}

// 八卦から線配置を生成
function getTrigramLines(trigramName) {
  const mapping = {
    '乾': [1, 1, 1],
    '坤': [0, 0, 0],
    '震': [1, 0, 0],
    '坎': [0, 1, 0],
    '艮': [0, 0, 1],
    '巽': [1, 1, 0],
    '離': [1, 0, 1],
    '兌': [0, 1, 1]
  };
  
  return mapping[trigramName] || [0, 0, 0];
}

// 64卦の線配置を生成
function generateHexagramLines(lowerTrigram, upperTrigram) {
  const upperLines = getTrigramLines(upperTrigram);
  const lowerLines = getTrigramLines(lowerTrigram);
  
  // 下卦（1-3爻）+ 上卦（4-6爻）
  return [...lowerLines, ...upperLines];
}

// H384データベースから卦名を取得
const content = fs.readFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/public/assets/H384H64database.js', 'utf8');
const hexagramMatches = content.matchAll(/卦番号': (\d+), '卦名': '([^']+)'/g);

const hexagrams = {};
for (const match of hexagramMatches) {
  const number = parseInt(match[1]);
  const name = match[2];
  
  if (!hexagrams[number]) {
    hexagrams[number] = { number, name };
  }
}

// 既存のマッピングを読み込み
const existingMapping = JSON.parse(fs.readFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/config/kingwen-mapping.json', 'utf8'));

// 完全なマッピングを生成
const completeMapping = {
  ...existingMapping,
  hexagrams: {
    ...existingMapping.hexagrams
  }
};

// 58卦を追加
Object.values(hexagrams).sort((a, b) => a.number - b.number).forEach(hex => {
  if (!completeMapping.hexagrams[hex.number]) {
    const trigrams = getTrigramsFromName(hex.name);
    const lines = generateHexagramLines(trigrams[1], trigrams[0]); // [下卦, 上卦]
    
    completeMapping.hexagrams[hex.number] = {
      name: hex.name,
      lines: lines,
      trigrams: [trigrams[1], trigrams[0]] // [下卦, 上卦]の順序で保存
    };
  }
});

// バリデーション情報更新
completeMapping.metadata.validation.confidence = 0.8; // 8割の卦を新規追加
completeMapping.metadata.created = new Date().toISOString();

// 結果を保存
fs.writeFileSync('/Users/hideakimacbookair/Desktop/haqei-analyzer/config/kingwen-mapping-complete.json', JSON.stringify(completeMapping, null, 2));

console.log('✅ Complete 64-hexagram mapping generated!');
console.log(`Total hexagrams: ${Object.keys(completeMapping.hexagrams).length}`);

// 新規追加された卦を確認
const newHexagrams = Object.keys(completeMapping.hexagrams).filter(num => ![1, 2, 11, 12, 63, 64].includes(parseInt(num)));
console.log(`Added ${newHexagrams.length} new hexagrams`);

// サンプル表示
console.log('\n=== Sample new hexagrams ===');
newHexagrams.slice(0, 5).forEach(num => {
  const hex = completeMapping.hexagrams[num];
  console.log(`${num}: ${hex.name} - ${hex.trigrams.join('+')} - [${hex.lines.join(',')}]`);
});

console.log('\nFile saved as: config/kingwen-mapping-complete.json');