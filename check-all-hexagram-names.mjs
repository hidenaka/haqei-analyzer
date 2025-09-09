import { readFile } from 'fs/promises';

async function checkAllHexagramNames() {
  try {
    console.log('=== 64卦の名前を確認 ===\n');
    
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
    
    // データベース内のnameプロパティを抽出
    const nameMatches = content.match(/"name":\s*"([^"]+)"/g);
    const foundNames = [];
    
    if (nameMatches) {
      nameMatches.forEach(match => {
        const name = match.match(/"name":\s*"([^"]+)"/)[1];
        if (!foundNames.includes(name)) {
          foundNames.push(name);
        }
      });
    }
    
    console.log(`期待される卦名: ${expectedHexagrams.length}個`);
    console.log(`データベース内の卦名: ${foundNames.length}個\n`);
    
    // 欠けている卦名を確認
    const missing = expectedHexagrams.filter(name => !foundNames.includes(name));
    const unexpected = foundNames.filter(name => !expectedHexagrams.includes(name));
    
    if (missing.length > 0) {
      console.log('【欠けている卦名】');
      missing.forEach(name => {
        console.log(`  ❌ ${name}`);
      });
      console.log('');
    }
    
    if (unexpected.length > 0) {
      console.log('【予期しない名前（変更されたか追加された）】');
      unexpected.forEach(name => {
        console.log(`  ⚠️ "${name}"`);
      });
      console.log('');
    }
    
    // 10文字未満の卦名をリスト
    const shortHexagrams = expectedHexagrams.filter(name => name.length < 10);
    console.log(`【10文字未満の正式な卦名: ${shortHexagrams.length}個】`);
    shortHexagrams.forEach(name => {
      const found = foundNames.includes(name);
      console.log(`  ${found ? '✅' : '❌'} ${name} (${name.length}文字)`);
    });
    
    if (missing.length === 0 && unexpected.length === 0) {
      console.log('\n✅ すべての卦名が正しく存在します');
    } else {
      console.log(`\n⚠️ 問題があります: ${missing.length}個欠落、${unexpected.length}個の予期しない名前`);
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkAllHexagramNames();