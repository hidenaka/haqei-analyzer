import { readFile } from 'fs/promises';

async function analyzeShortTextLocations() {
  try {
    console.log('=== 短い文字列がどのプロパティで使われているか分析 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 64卦の正式な卦名リスト（これらは変更してはいけない）
    const hexagramNames = [
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風澤中孚', '澤山中孚', '雷山小過', '水火既済', '火水未済'
    ];
    
    // 八卦の要素名（これらも変更してはいけない）
    const eightTrigrams = ['天', '地', '水', '火', '雷', '山', '風', '澤'];
    
    // 短い文字列を収集（10文字未満）
    const shortTexts = new Map();
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(/"([^"]+)"/g);
      
      if (matches) {
        matches.forEach(match => {
          const text = match.slice(1, -1);
          
          // 10文字未満の日本語テキストのみ
          if (text.length < 10 && !text.match(/^[a-zA-Z_]+$/)) {
            // プロパティ名を特定
            const propMatch = line.match(/(\w+):\s*"/);
            const property = propMatch ? propMatch[1] : 'unknown';
            
            // 卦名を特定
            let hexagram = '';
            for (let j = i - 1; j >= Math.max(0, i - 30); j--) {
              if (lines[j].includes('"name":')) {
                const nameMatch = lines[j].match(/"name":\s*"([^"]+)"/);
                if (nameMatch) {
                  hexagram = nameMatch[1];
                  break;
                }
              }
            }
            
            if (!shortTexts.has(text)) {
              shortTexts.set(text, []);
            }
            
            shortTexts.get(text).push({
              property,
              hexagram: hexagram || '不明',
              line: i + 1,
              isHexagramName: hexagramNames.includes(text),
              isTrigram: eightTrigrams.includes(text),
              text
            });
          }
        });
      }
    }
    
    // カテゴリ別に分類
    const categories = {
      hexagramNames: [],      // 卦名（変更禁止）
      trigrams: [],          // 八卦要素（変更禁止）
      nameProperty: [],      // nameプロパティの値
      typeNames: [],         // type, persona等のタイプ名
      descriptions: [],      // description, profileの説明文
      metaphors: [],         // metaphorの比喩
      examples: [],          // exampleの例
      strategies: [],        // strategyの戦略
      others: []            // その他
    };
    
    shortTexts.forEach((locations, text) => {
      const firstLocation = locations[0];
      
      if (firstLocation.isHexagramName) {
        categories.hexagramNames.push({ text, locations });
      } else if (firstLocation.isTrigram) {
        categories.trigrams.push({ text, locations });
      } else if (firstLocation.property === 'name') {
        categories.nameProperty.push({ text, locations });
      } else if (['type', 'persona', 'role'].includes(firstLocation.property)) {
        categories.typeNames.push({ text, locations });
      } else if (['description', 'profile'].includes(firstLocation.property)) {
        categories.descriptions.push({ text, locations });
      } else if (firstLocation.property === 'metaphor') {
        categories.metaphors.push({ text, locations });
      } else if (firstLocation.property === 'example') {
        categories.examples.push({ text, locations });
      } else if (firstLocation.property === 'strategy') {
        categories.strategies.push({ text, locations });
      } else {
        categories.others.push({ text, locations });
      }
    });
    
    // 結果を表示
    console.log('【分析結果】\n');
    
    console.log(`1. 卦名（変更禁止）: ${categories.hexagramNames.length}件`);
    categories.hexagramNames.slice(0, 10).forEach(({ text }) => {
      console.log(`   ✖️ "${text}"`);
    });
    
    console.log(`\n2. 八卦要素（変更禁止）: ${categories.trigrams.length}件`);
    categories.trigrams.forEach(({ text }) => {
      console.log(`   ✖️ "${text}"`);
    });
    
    console.log(`\n3. nameプロパティ: ${categories.nameProperty.length}件`);
    console.log('   → 卦名の場合は変更禁止、それ以外は修正可能');
    categories.nameProperty.slice(0, 10).forEach(({ text, locations }) => {
      const isHexagram = hexagramNames.includes(text);
      console.log(`   ${isHexagram ? '✖️' : '✅'} "${text}" (${locations[0].hexagram})`);
    });
    
    console.log(`\n4. タイプ名（修正推奨）: ${categories.typeNames.length}件`);
    categories.typeNames.slice(0, 10).forEach(({ text, locations }) => {
      console.log(`   ✅ "${text}" → より詳細な説明に`);
    });
    
    console.log(`\n5. 説明文（修正必須）: ${categories.descriptions.length}件`);
    categories.descriptions.slice(0, 10).forEach(({ text, locations }) => {
      console.log(`   ✅ "${text}" → 10文字以上の説明に`);
    });
    
    console.log(`\n6. 比喩（修正推奨）: ${categories.metaphors.length}件`);
    categories.metaphors.slice(0, 10).forEach(({ text, locations }) => {
      console.log(`   ✅ "${text}" → より具体的な比喩に`);
    });
    
    console.log(`\n7. その他: ${categories.others.length}件`);
    categories.others.slice(0, 10).forEach(({ text, locations }) => {
      console.log(`   ❓ "${text}" (${locations[0].property})`);
    });
    
    // 修正対象の統計
    const fixableCount = 
      categories.typeNames.length + 
      categories.descriptions.length + 
      categories.metaphors.length + 
      categories.examples.length + 
      categories.strategies.length +
      categories.nameProperty.filter(({ text }) => !hexagramNames.includes(text)).length;
    
    const protectedCount = 
      categories.hexagramNames.length + 
      categories.trigrams.length +
      categories.nameProperty.filter(({ text }) => hexagramNames.includes(text)).length;
    
    console.log('\n【修正方針】');
    console.log(`🔒 保護対象（変更禁止）: ${protectedCount}件`);
    console.log(`✅ 修正対象: ${fixableCount}件`);
    console.log(`❓ 要確認: ${categories.others.length}件`);
    
    console.log('\n【推奨アクション】');
    console.log('1. タイプ名・役割名を具体的に（例: "サポーター" → "仲間を支援するサポーター"）');
    console.log('2. 説明文を10文字以上に拡張');
    console.log('3. 比喩をより具体的に');
    console.log('4. 卦名と八卦要素は絶対に変更しない');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyzeShortTextLocations();