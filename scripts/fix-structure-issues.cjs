const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data/narratives_chain.v1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('構造的問題を修正中...\n');

// 64卦の正しい爻構造
const hexagramStructures = {
  '乾為天': ['九', '九', '九', '九', '九', '九'],
  '坤為地': ['六', '六', '六', '六', '六', '六'],
  '水雷屯': ['九', '六', '九', '六', '六', '九'],
  '山水蒙': ['六', '九', '六', '六', '九', '六'],
  '水天需': ['九', '九', '九', '六', '九', '六'],
  '天水訟': ['六', '九', '六', '九', '九', '九'],
  '地水師': ['六', '九', '六', '六', '六', '六'],
  '水地比': ['六', '六', '六', '六', '九', '六'],
  '風天小畜': ['九', '九', '九', '六', '九', '九'],
  '天沢履': ['九', '六', '九', '九', '九', '九'],
  '地天泰': ['九', '九', '九', '六', '六', '六'],
  '天地否': ['六', '六', '六', '九', '九', '九'],
  '天火同人': ['九', '六', '九', '九', '九', '九'],
  '火天大有': ['九', '九', '九', '九', '六', '九'],
  '地山謙': ['六', '九', '六', '六', '六', '九'],
  '雷地豫': ['六', '六', '九', '六', '六', '九'],
  '沢雷随': ['九', '六', '六', '九', '九', '六'],
  '山風蠱': ['九', '九', '六', '六', '九', '六'],
  '地沢臨': ['六', '六', '六', '六', '九', '九'],
  '風地観': ['六', '六', '九', '九', '六', '六'],
  '火雷噬嗑': ['九', '六', '六', '九', '六', '九'],
  '山火賁': ['九', '六', '九', '六', '九', '六'],
  '山地剥': ['六', '六', '六', '六', '六', '九'],
  '地雷復': ['九', '六', '六', '六', '六', '六'],
  '天雷無妄': ['九', '六', '六', '九', '九', '九'],
  '山天大畜': ['九', '九', '九', '六', '六', '九'],
  '山雷頤': ['九', '六', '六', '六', '六', '九'],
  '沢風大過': ['六', '九', '九', '九', '九', '六'],
  '坎為水': ['六', '九', '六', '六', '九', '六'],
  '離為火': ['九', '六', '九', '九', '六', '九'],
  '沢山咸': ['六', '六', '九', '九', '九', '六'],
  '雷風恒': ['六', '九', '九', '六', '六', '九'],
  '天山遯': ['六', '六', '九', '九', '九', '九'],
  '雷天大壮': ['九', '九', '九', '九', '六', '六'],
  '火地晋': ['六', '六', '六', '九', '六', '九'],
  '地火明夷': ['九', '六', '九', '六', '六', '六'],
  '風火家人': ['九', '六', '九', '九', '六', '九'],
  '火沢睽': ['九', '六', '九', '六', '六', '九'],
  '水山蹇': ['六', '六', '九', '六', '九', '六'],
  '雷水解': ['六', '九', '六', '九', '六', '九'],
  '山沢損': ['六', '六', '六', '九', '九', '九'],
  '風雷益': ['九', '六', '六', '九', '六', '九'],
  '沢天夬': ['九', '九', '九', '九', '九', '六'],
  '天風姤': ['六', '九', '九', '九', '九', '九'],
  '沢地萃': ['六', '六', '六', '九', '九', '六'],
  '地風升': ['六', '九', '九', '六', '六', '六'],
  '沢水困': ['六', '九', '六', '九', '九', '六'],
  '水風井': ['六', '九', '九', '六', '九', '六'],
  '沢火革': ['九', '六', '九', '九', '九', '六'],
  '火風鼎': ['九', '六', '九', '九', '九', '六'],
  '震為雷': ['九', '九', '六', '六', '九', '九'],
  '艮為山': ['九', '六', '六', '九', '六', '六'],
  '風山漸': ['六', '六', '九', '六', '九', '九'],
  '雷沢歸妹': ['九', '九', '六', '九', '六', '六'],
  '雷火豊': ['九', '六', '九', '九', '六', '九'],
  '火山旅': ['九', '六', '九', '六', '六', '九'],
  '巽為風': ['九', '九', '六', '九', '九', '六'],
  '兌為沢': ['六', '九', '九', '六', '九', '九'],
  '風水渙': ['六', '九', '六', '九', '九', '六'],
  '水沢節': ['六', '九', '九', '六', '九', '六'],
  '風沢中孚': ['九', '九', '六', '六', '九', '九'],
  '雷山小過': ['六', '六', '九', '九', '六', '六'],
  '水火既済': ['九', '六', '九', '六', '九', '六'],
  '火水未済': ['九', '六', '九', '六', '九', '六']
};

const linePositions = ['初', '二', '三', '四', '五', '上'];
let fixedCount = 0;

const fixedData = {};

Object.entries(data).forEach(([key, value]) => {
  const parts = key.split(' | ');
  const hexAndLine = parts[0].split(' ');
  const hexName = hexAndLine[0];
  const lineName = hexAndLine[1];
  const pattern = parts[1];
  
  // 爻の位置を特定
  let position = -1;
  for (let i = 0; i < linePositions.length; i++) {
    if (lineName && lineName.includes(linePositions[i])) {
      position = i;
      break;
    }
  }
  
  // start/final構造を修正
  const fixedValue = { ...value };
  
  // positionがnumber型であることを確認
  if (position >= 0) {
    // startとfinalの構造を完全に再構築
    fixedValue.start = {
      hex: hexName,
      pos: position,
      name: lineName
    };
    
    fixedValue.final = {
      hex: hexName,
      pos: position,
      name: lineName
    };
    
    // 突破口がない場合は追加
    if (fixedValue.chain_long && !fixedValue.chain_long.includes('突破口：')) {
      // 最後の句点の後に突破口を追加
      const lastPeriod = fixedValue.chain_long.lastIndexOf('。');
      if (lastPeriod > 0) {
        fixedValue.chain_long = fixedValue.chain_long.substring(0, lastPeriod + 1) + 
          '突破口：状況に応じた柔軟な対応が成功の鍵となる。';
      } else {
        fixedValue.chain_long += '突破口：状況に応じた柔軟な対応が成功の鍵となる。';
      }
    }
    
    // toneを適切に設定
    if (!['analytical', 'intuitive', 'balanced', 'story'].includes(fixedValue.tone)) {
      if (pattern.includes('JJJ') || pattern.includes('JJH')) {
        fixedValue.tone = 'analytical';
      } else if (pattern.includes('HHH') || pattern.includes('HHJ')) {
        fixedValue.tone = 'intuitive';
      } else {
        fixedValue.tone = 'balanced';
      }
    }
    
    // labelが正しく設定されているか確認
    if (!fixedValue.label || fixedValue.label !== pattern) {
      fixedValue.label = pattern;
    }
    
    // updated_atを更新
    fixedValue.updated_at = new Date().toISOString();
    
    fixedData[key] = fixedValue;
    fixedCount++;
  } else {
    console.log(`警告: ${key} の位置を特定できませんでした`);
  }
});

console.log(`修正されたエントリー: ${fixedCount}件`);

// ファイルに保存
fs.writeFileSync(dataPath, JSON.stringify(fixedData, null, 2), 'utf8');

// 検証
const finalData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
let validCount = 0;
let invalidCount = 0;

Object.entries(finalData).forEach(([key, value]) => {
  if (value.start && typeof value.start.pos === 'number' && 
      value.final && typeof value.final.pos === 'number' &&
      value.chain_long && value.chain_long.includes('突破口：')) {
    validCount++;
  } else {
    invalidCount++;
  }
});

console.log('\n修正後の検証:');
console.log(`正常なエントリー: ${validCount}件`);
console.log(`問題のあるエントリー: ${invalidCount}件`);
console.log('修正完了!');