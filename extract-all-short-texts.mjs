import { readFile, writeFile } from 'fs/promises';

async function extractAllShortTexts() {
  try {
    console.log('=== すべての短い説明文を抽出 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 64卦の名前（これらは除外）
    const hexagramNames = new Set([
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ]);
    
    // 10文字未満のすべての文字列を抽出
    const allStrings = content.match(/"[^"]+"/g) || [];
    const shortTexts = [];
    
    allStrings.forEach(str => {
      const text = str.slice(1, -1); // ダブルクォートを除去
      
      // 10文字未満で日本語を含み、卦名でない
      if (text.length < 10 && 
          text.match(/[ぁ-んァ-ヶー一-龯]/) && 
          !hexagramNames.has(text) &&
          !text.match(/^[☰☱☲☳☴☵☶☷🚀🎯📊💡🔥⚡️🏔️💨💧✨]+$/)) { // 記号・絵文字は除外
        shortTexts.push(text);
      }
    });
    
    // 重複を除去してユニークなものだけ
    const uniqueTexts = [...new Set(shortTexts)];
    
    // 長さ別に分類
    const byLength = {};
    uniqueTexts.forEach(text => {
      const len = text.length;
      if (!byLength[len]) byLength[len] = [];
      byLength[len].push(text);
    });
    
    // JSONファイルに保存
    const data = {
      totalCount: uniqueTexts.length,
      byLength: byLength,
      texts: uniqueTexts.sort()
    };
    
    await writeFile('short-texts-to-fix.json', JSON.stringify(data, null, 2));
    
    console.log(`総数: ${uniqueTexts.length}個の短い説明文（卦名を除く）`);
    
    Object.keys(byLength).sort((a, b) => a - b).forEach(len => {
      console.log(`${len}文字: ${byLength[len].length}個`);
      if (len <= 5) {
        console.log('  サンプル:', byLength[len].slice(0, 5).join(', '));
      }
    });
    
    console.log('\n📝 short-texts-to-fix.json に保存しました');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

extractAllShortTexts();
