import { readFile } from 'fs/promises';

async function verify64Hexagrams() {
  try {
    console.log('=== 64卦が正確に64個あるか確認 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 正式な64卦のリスト（正確に64個）
    const all64Hexagrams = [
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ];
    
    console.log(`正式な64卦のリスト: ${all64Hexagrams.length}個`);
    
    // 重複チェック
    const uniqueHexagrams = new Set(all64Hexagrams);
    if (uniqueHexagrams.size !== 64) {
      console.log(`⚠️ リストに重複があります！ユニーク数: ${uniqueHexagrams.size}`);
    } else {
      console.log('✅ リストに重複はありません');
    }
    
    // データベース内で各卦名を検索
    const foundInDB = [];
    const notFoundInDB = [];
    
    all64Hexagrams.forEach((hexName, index) => {
      // オブジェクトのキーとして存在するかチェック
      const regex = new RegExp(`"${hexName}"\\s*:\\s*\\{`);
      if (content.match(regex)) {
        foundInDB.push(hexName);
      } else {
        notFoundInDB.push({ index: index + 1, name: hexName });
      }
    });
    
    console.log(`\nデータベース内で見つかった卦: ${foundInDB.length}個`);
    console.log(`データベース内で見つからない卦: ${notFoundInDB.length}個`);
    
    // 見つからない卦を表示
    if (notFoundInDB.length > 0) {
      console.log('\n【データベースに存在しない卦】');
      notFoundInDB.forEach(({ index, name }) => {
        console.log(`  ${index}. ❌ ${name}`);
      });
    }
    
    // 番号順に存在確認
    console.log('\n【64卦の存在確認（番号順）】');
    all64Hexagrams.forEach((hexName, index) => {
      const found = foundInDB.includes(hexName);
      const number = (index + 1).toString().padStart(2, '0');
      if (index < 10 || index >= 54 || !found) {  // 最初の10個、最後の10個、または見つからないもの
        console.log(`  ${number}. ${found ? '✅' : '❌'} ${hexName}`);
      } else if (index === 10) {
        console.log('  ... (省略) ...');
      }
    });
    
    // 最終判定
    console.log('\n【判定結果】');
    if (foundInDB.length === 64) {
      console.log('✅ 64卦すべてがデータベースに正しく存在します！');
    } else {
      console.log(`⚠️ 問題があります: ${foundInDB.length}/64個しか存在しません`);
      console.log(`   ${notFoundInDB.length}個の卦が欠けています`);
    }
    
    // データベース内の卦名っぽいキーを全て抽出して数を確認
    console.log('\n【データベース内のすべての卦キーを確認】');
    const allKeysInDB = content.match(/"[^"]*[為山水火雷風澤天地][^"]*"\s*:\s*\{/g) || [];
    const hexagramKeys = allKeysInDB
      .map(match => match.match(/"([^"]+)"/)[1])
      .filter(key => key.match(/^[山水火雷風澤天地為坎離震艮巽兌乾坤]+[山水火雷風澤天地為剥晋遯咸恒損益夬姤萃升困井革鼎漸旅孚過済妄畜頤豫随蠱臨観嗑賁復蒙屯需訟師比履泰否同人有謙]+$/));
    
    console.log(`データベース内の卦名らしきキー: ${hexagramKeys.length}個`);
    if (hexagramKeys.length > 0) {
      console.log('最初の10個:');
      hexagramKeys.slice(0, 10).forEach(key => {
        const isValid = all64Hexagrams.includes(key);
        console.log(`  ${isValid ? '✅' : '❓'} "${key}"`);
      });
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

verify64Hexagrams();