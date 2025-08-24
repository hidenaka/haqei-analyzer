import { readFile } from 'fs/promises';

async function checkNonHexagramShort() {
  try {
    console.log('=== 64卦以外の10文字未満の説明文を確認 ===\n');
    
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
    
    // すべての文字列を抽出
    const allStrings = content.match(/"[^"]+"/g) || [];
    const shortTexts = new Map();
    const allShortTexts = [];
    
    allStrings.forEach(str => {
      const text = str.slice(1, -1); // ダブルクォートを除去
      
      // 日本語を含む文字列のみ
      if (text.match(/[ぁ-んァ-ヶー一-龯]/)) {
        // 10文字未満
        if (text.length < 10) {
          // 卦名でない
          if (!hexagramNames.has(text)) {
            // 絵文字・記号のみは除外
            if (!text.match(/^[☰☱☲☳☴☵☶☷🚀🎯📊💡🔥⚡️🏔️💨💧✨]+$/)) {
              allShortTexts.push(text);
              if (!shortTexts.has(text)) {
                shortTexts.set(text, { count: 0, length: text.length });
              }
              shortTexts.get(text).count++;
            }
          }
        }
      }
    });
    
    // 長さ別に分類
    const byLength = {};
    shortTexts.forEach((data, text) => {
      const len = data.length;
      if (!byLength[len]) byLength[len] = [];
      byLength[len].push({ text, count: data.count });
    });
    
    // 統計情報
    const totalUnique = shortTexts.size;
    const totalOccurrences = allShortTexts.length;
    
    console.log('【統計サマリー】');
    console.log(`卦名以外の10文字未満のユニークな説明: ${totalUnique}個`);
    console.log(`総出現回数: ${totalOccurrences}回\n`);
    
    // 文字数別の内訳
    console.log('【文字数別内訳（卦名を除く）】');
    Object.keys(byLength).sort((a, b) => a - b).forEach(len => {
      const items = byLength[len];
      console.log(`\n${len}文字: ${items.length}種類`);
      
      // 最初の10個を表示
      items.slice(0, 10).forEach(item => {
        console.log(`  "${item.text}" (${item.count}回)`);
      });
      
      if (items.length > 10) {
        console.log(`  ... 他 ${items.length - 10}種類`);
      }
    });
    
    // 特に短いもの（5文字以下）を詳細表示
    console.log('\n【特に短い説明（5文字以下、卦名を除く）】');
    let under5Count = 0;
    Object.keys(byLength).sort((a, b) => a - b).forEach(len => {
      if (len <= 5) {
        const items = byLength[len];
        under5Count += items.length;
        console.log(`\n${len}文字: ${items.length}種類`);
        items.forEach(item => {
          console.log(`  "${item.text}"`);
        });
      }
    });
    
    console.log(`\n【修正推奨】`);
    console.log(`5文字以下の説明: ${under5Count}個`);
    
    // 6-9文字のサンプル
    let count6to9 = 0;
    [6, 7, 8, 9].forEach(len => {
      if (byLength[len]) {
        count6to9 += byLength[len].length;
      }
    });
    console.log(`6-9文字の説明: ${count6to9}個`);
    
    console.log('\n【結論】');
    if (totalUnique === 0) {
      console.log('✅ 卦名以外の10文字未満の説明はすべて修正済みです！');
    } else if (under5Count === 0) {
      console.log('✅ 5文字以下の短い説明はすべて修正済みです。');
      console.log(`📝 6-9文字の説明が${count6to9}個残っていますが、これらは比較的適切な長さです。`);
    } else {
      console.log(`⚠️ まだ${under5Count}個の5文字以下の短い説明が残っています。`);
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkNonHexagramShort();