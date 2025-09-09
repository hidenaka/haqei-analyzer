import { readFile } from 'fs/promises';

async function findMissingHexagrams() {
  try {
    console.log('=== 欠けている2つの卦を特定 ===\n');
    
    // 正式な64卦の完全なリスト
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
      '巽為風', '兌為澤', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ];
    
    console.log(`正式な64卦リストの長さ: ${complete64Hexagrams.length}個`);
    
    // 私が使っていたリスト（62個）
    const my62List = [
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ];
    
    console.log(`私のリストの長さ: ${my62List.length}個`);
    
    // 重複チェック
    const uniqueInMyList = new Set(my62List);
    console.log(`私のリストのユニーク数: ${uniqueInMyList.size}個`);
    
    // 欠けているものを特定
    const missing = complete64Hexagrams.filter(hex => !my62List.includes(hex));
    console.log(`\n欠けている卦: ${missing.length}個`);
    missing.forEach((hex, i) => {
      const index = complete64Hexagrams.indexOf(hex) + 1;
      console.log(`  ${index}. ${hex}`);
    });
    
    // 番号の範囲確認
    console.log('\n【番号別確認】');
    let foundIssue = false;
    complete64Hexagrams.forEach((hex, i) => {
      const num = i + 1;
      const exists = my62List.includes(hex);
      if (!exists) {
        console.log(`  ${num}. ❌ ${hex} - 欠落`);
        foundIssue = true;
      }
    });
    
    if (!foundIssue) {
      console.log('私のリストに欠けはないが、長さが合わない...');
      
      // 重複を探す
      const duplicates = my62List.filter((item, index) => my62List.indexOf(item) !== index);
      if (duplicates.length > 0) {
        console.log('\n【重複している卦】');
        duplicates.forEach(dup => {
          console.log(`  ${dup}`);
        });
      }
    }
    
    // データベースを実際に確認
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    console.log('\n【データベース内の実際の状況】');
    let dbFoundCount = 0;
    const dbNotFound = [];
    
    complete64Hexagrams.forEach((hex, i) => {
      const regex = new RegExp(`"${hex}"\\s*:\\s*\\{`);
      if (content.match(regex)) {
        dbFoundCount++;
      } else {
        dbNotFound.push({ num: i + 1, name: hex });
      }
    });
    
    console.log(`データベースに存在: ${dbFoundCount}/64個`);
    
    if (dbNotFound.length > 0) {
      console.log('\n【データベースに欠けている卦】');
      dbNotFound.forEach(({ num, name }) => {
        console.log(`  ${num}. ${name}`);
      });
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

findMissingHexagrams();