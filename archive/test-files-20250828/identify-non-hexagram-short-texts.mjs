import { readFile } from 'fs/promises';

async function identifyNonHexagramShortTexts() {
  try {
    console.log('=== 卦名以外の短い説明文を特定 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 正式な64卦（これらは変更しない）
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
    const shortTexts = new Map();
    
    allStrings.forEach(str => {
      const text = str.slice(1, -1); // ダブルクォートを除去
      
      // 10文字未満で日本語を含む文字列
      if (text.length < 10 && text.match(/[ぁ-んァ-ヶー一-龯]/)) {
        // 卦名でない場合のみ
        if (!hexagramNames.has(text)) {
          if (!shortTexts.has(text)) {
            shortTexts.set(text, { count: 0, contexts: [] });
          }
          shortTexts.get(text).count++;
          
          // 最初の3つまでコンテキストを保存
          if (shortTexts.get(text).contexts.length < 3) {
            // どの行にあるか探す
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(str)) {
                // プロパティ名を推定
                let property = 'unknown';
                if (lines[i].includes('nickname:')) property = 'nickname';
                else if (lines[i].includes('persona:')) property = 'persona';
                else if (lines[i].includes('type:')) property = 'type';
                else if (lines[i].includes('description:')) property = 'description';
                else if (lines[i].includes('profile:')) property = 'profile';
                else if (lines[i].includes('strategy:')) property = 'strategy';
                else if (lines[i].includes('recovery:')) property = 'recovery';
                else if (lines[i].includes('environment:')) property = 'environment';
                else if (lines[i].includes('metaphor:')) property = 'metaphor';
                else if (lines[i].includes('example:')) property = 'example';
                else if (lines[i].includes('element:')) property = 'element';
                else if (lines[i].includes('symbol:')) property = 'symbol';
                
                shortTexts.get(text).contexts.push({
                  line: i + 1,
                  property,
                  snippet: lines[i].trim().substring(0, 80)
                });
                break;
              }
            }
          }
        }
      }
    });
    
    // カテゴリ別に分類
    const categories = {
      types: [],      // タイプ名・役割名
      engines: [],    // エンジン名
      environments: [], // 環境名
      descriptions: [], // 説明文
      symbols: [],    // 記号類
      others: []      // その他
    };
    
    shortTexts.forEach((data, text) => {
      // 英数字のみ、絵文字、記号は除外
      if (text.match(/^[a-zA-Z0-9]+$/) || text.match(/^[☰☱☲☳☴☵☶☷🚀🎯📊💡🔥⚡️🏔️💨💧✨]+$/)) {
        categories.symbols.push({ text, ...data });
      }
      // エンジン名
      else if (text.includes('エンジン')) {
        categories.engines.push({ text, ...data });
      }
      // 環境名
      else if (text.includes('環境') || text.includes('な場所')) {
        categories.environments.push({ text, ...data });
      }
      // タイプ名・型
      else if (text.includes('型') || text.includes('者') || text.includes('タイプ') || text.includes('人')) {
        categories.types.push({ text, ...data });
      }
      // その他（説明文など）
      else {
        categories.others.push({ text, ...data });
      }
    });
    
    // 結果表示
    console.log('【修正対象の短い説明文（卦名を除く）】\n');
    
    console.log(`1. タイプ名・役割名: ${categories.types.length}種類`);
    console.log('   例:');
    categories.types.slice(0, 10).forEach(item => {
      console.log(`   ✅ "${item.text}" (${item.count}箇所)`);
    });
    
    console.log(`\n2. エンジン名: ${categories.engines.length}種類`);
    console.log('   例:');
    categories.engines.slice(0, 10).forEach(item => {
      console.log(`   ✅ "${item.text}" (${item.count}箇所)`);
    });
    
    console.log(`\n3. 環境名: ${categories.environments.length}種類`);
    console.log('   例:');
    categories.environments.slice(0, 10).forEach(item => {
      console.log(`   ✅ "${item.text}" (${item.count}箇所)`);
    });
    
    console.log(`\n4. その他の説明: ${categories.others.length}種類`);
    console.log('   例:');
    categories.others.slice(0, 10).forEach(item => {
      console.log(`   ✅ "${item.text}" (${item.count}箇所)`);
    });
    
    console.log(`\n5. 記号・絵文字（修正不要）: ${categories.symbols.length}種類`);
    
    // 修正優先度
    const totalFixable = categories.types.length + categories.engines.length + 
                        categories.environments.length + categories.others.length;
    
    console.log('\n【修正サマリー】');
    console.log(`🔒 卦名（保護）: 64個`);
    console.log(`✅ 修正対象: ${totalFixable}種類`);
    console.log(`   - タイプ名: ${categories.types.length}種類`);
    console.log(`   - エンジン名: ${categories.engines.length}種類`);
    console.log(`   - 環境名: ${categories.environments.length}種類`);
    console.log(`   - その他: ${categories.others.length}種類`);
    console.log(`⭕ 記号類（修正不要）: ${categories.symbols.length}種類`);
    
    // 最も短いものから優先的に
    console.log('\n【文字数別の修正優先度】');
    const byLength = {};
    [...categories.types, ...categories.engines, ...categories.environments, ...categories.others]
      .forEach(item => {
        const len = item.text.length;
        if (!byLength[len]) byLength[len] = [];
        byLength[len].push(item.text);
      });
    
    Object.keys(byLength).sort((a, b) => a - b).forEach(len => {
      console.log(`\n${len}文字: ${byLength[len].length}種類`);
      byLength[len].slice(0, 5).forEach(text => {
        console.log(`   "${text}"`);
      });
      if (byLength[len].length > 5) {
        console.log(`   ... 他 ${byLength[len].length - 5}種類`);
      }
    });
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

identifyNonHexagramShortTexts();