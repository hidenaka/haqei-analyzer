import { readFile } from 'fs/promises';

async function checkHexagramKeys() {
  try {
    console.log('=== 64卦のキーを確認 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 64卦の正式な卦名リスト
    const expectedHexagrams = [
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ];
    
    // オブジェクトのキーとして卦名を検索
    const foundKeys = [];
    expectedHexagrams.forEach(name => {
      // キーとして存在するかチェック
      const regex = new RegExp(`"${name}"\\s*:\\s*\\{`);
      if (content.match(regex)) {
        foundKeys.push(name);
      }
    });
    
    console.log(`期待される卦名: ${expectedHexagrams.length}個`);
    console.log(`見つかった卦名キー: ${foundKeys.length}個\n`);
    
    // 欠けている卦名を確認
    const missing = expectedHexagrams.filter(name => !foundKeys.includes(name));
    
    if (missing.length > 0) {
      console.log('【欠けている卦名】');
      missing.forEach(name => {
        console.log(`  ❌ ${name}`);
      });
      console.log('');
    }
    
    // 10文字未満の卦名の状態
    const shortHexagrams = expectedHexagrams.filter(name => name.length < 10);
    console.log(`【10文字未満の正式な卦名: ${shortHexagrams.length}個】`);
    
    let shortFound = 0;
    let shortMissing = 0;
    
    shortHexagrams.forEach(name => {
      const found = foundKeys.includes(name);
      if (found) {
        shortFound++;
        console.log(`  ✅ ${name} (${name.length}文字)`);
      } else {
        shortMissing++;
        console.log(`  ❌ ${name} (${name.length}文字)`);
      }
    });
    
    console.log(`\n【サマリー】`);
    console.log(`✅ 存在する卦名: ${foundKeys.length}/64`);
    console.log(`❌ 欠けている卦名: ${missing.length}/64`);
    console.log(`📝 10文字未満の卦名: ${shortFound}個存在、${shortMissing}個欠落`);
    
    if (missing.length === 0) {
      console.log('\n✅ すべての卦名が正しく存在します');
    } else {
      console.log(`\n⚠️ ${missing.length}個の卦名が欠けています`);
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkHexagramKeys();