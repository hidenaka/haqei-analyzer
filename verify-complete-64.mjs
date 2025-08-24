import { readFile } from 'fs/promises';

async function verifyComplete64() {
  try {
    console.log('=== 完全な64卦の確認 ===\n');
    
    // 正式な64卦の完全なリスト（正しい64個）
    const complete64Hexagrams = [
      // 1-8
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      // 9-16
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      // 17-24
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      // 25-32
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      // 33-40
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      // 41-48
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      // 49-56
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      // 57-64
      '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ];
    
    console.log(`正式な64卦リスト: ${complete64Hexagrams.length}個`);
    
    // 重複チェック
    const uniqueSet = new Set(complete64Hexagrams);
    console.log(`ユニーク数: ${uniqueSet.size}個`);
    console.log(uniqueSet.size === 64 ? '✅ 重複なし' : '❌ 重複あり');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 各卦の存在確認
    const foundInDB = [];
    const notFoundInDB = [];
    
    complete64Hexagrams.forEach((hexName, index) => {
      const regex = new RegExp(`"${hexName}"\\s*:\\s*\\{`);
      if (content.match(regex)) {
        foundInDB.push(hexName);
      } else {
        notFoundInDB.push({ index: index + 1, name: hexName });
      }
    });
    
    console.log(`\nデータベース内で見つかった卦: ${foundInDB.length}個`);
    console.log(`データベース内で見つからない卦: ${notFoundInDB.length}個`);
    
    if (notFoundInDB.length > 0) {
      console.log('\n【データベースに存在しない卦】');
      notFoundInDB.forEach(({ index, name }) => {
        console.log(`  ${index}. ❌ ${name}`);
      });
    }
    
    // 10文字未満の卦名
    const shortHexagrams = complete64Hexagrams.filter(name => name.length < 10);
    console.log(`\n【10文字未満の卦名: ${shortHexagrams.length}個】`);
    
    // 文字数別集計
    const byLength = {};
    shortHexagrams.forEach(name => {
      const len = name.length;
      if (!byLength[len]) byLength[len] = [];
      byLength[len].push(name);
    });
    
    Object.keys(byLength).sort((a, b) => a - b).forEach(len => {
      console.log(`  ${len}文字: ${byLength[len].length}個`);
    });
    
    // 最終判定
    console.log('\n【最終判定】');
    if (foundInDB.length === 64) {
      console.log('✅ 64卦すべてがデータベースに正しく存在します！');
      console.log('✅ 卦名は一切変更しません');
    } else {
      console.log(`⚠️ ${notFoundInDB.length}個の卦が欠けています`);
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

verifyComplete64();