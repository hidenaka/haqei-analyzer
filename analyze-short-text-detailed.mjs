import { readFile } from 'fs/promises';

async function analyzeShortTextDetailed() {
  try {
    console.log('=== 短い文字列の使用場所を詳細分析 ===\n');
    
    // データベース読み込み
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 64卦の正式な卦名リスト
    const hexagramNames = new Set([
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ]);
    
    // 10文字未満の日本語文字列を抽出
    const shortTexts = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 文字列を抽出
      const stringMatches = line.match(/"([^"]+)"/g);
      if (stringMatches) {
        stringMatches.forEach(match => {
          const text = match.slice(1, -1);
          
          // 10文字未満の日本語を含む文字列
          if (text.length < 10 && text.match(/[ぁ-んァ-ヶー一-龯]/)) {
            // どのコンテキストか判定
            let context = 'unknown';
            let property = '';
            
            // プロパティ名を探す
            if (line.includes('name:')) {
              property = 'name';
            } else if (line.includes('symbol:')) {
              property = 'symbol';
            } else if (line.includes('element:')) {
              property = 'element';
            } else if (line.includes('persona:')) {
              property = 'persona';
            } else if (line.includes('type:')) {
              property = 'type';
            } else if (line.includes('description:')) {
              property = 'description';
            } else if (line.includes('profile:')) {
              property = 'profile';
            } else if (line.includes('strategy:')) {
              property = 'strategy';
            } else if (line.includes('recovery:')) {
              property = 'recovery';
            } else if (line.includes('environment:')) {
              property = 'environment';
            } else if (line.includes('metaphor:')) {
              property = 'metaphor';
            } else if (line.includes('example:')) {
              property = 'example';
            }
            
            // OSのコンテキストを判定
            let osContext = '';
            for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
              if (lines[j].includes('asEngineOS:')) {
                osContext = 'EngineOS';
                break;
              } else if (lines[j].includes('asInterfaceOS:')) {
                osContext = 'InterfaceOS';
                break;
              } else if (lines[j].includes('asSafeModeOS:')) {
                osContext = 'SafeModeOS';
                break;
              }
            }
            
            shortTexts.push({
              text,
              length: text.length,
              property: property || 'unknown',
              osContext,
              line: i + 1,
              isHexagramName: hexagramNames.has(text)
            });
          }
        });
      }
    }
    
    // 文字数別に集計
    const byLength = new Map();
    shortTexts.forEach(item => {
      if (!byLength.has(item.length)) {
        byLength.set(item.length, []);
      }
      byLength.get(item.length).push(item);
    });
    
    // 結果表示
    console.log('【文字数別の内訳】');
    Array.from(byLength.keys()).sort((a, b) => a - b).forEach(length => {
      const items = byLength.get(length);
      console.log(`\n${length}文字: ${items.length}件`);
      
      // サンプル表示（最大5件）
      const samples = items.slice(0, 5);
      samples.forEach(item => {
        if (item.isHexagramName) {
          console.log(`  ✖️ "${item.text}" [卦名・変更禁止]`);
        } else {
          console.log(`  ✅ "${item.text}" (${item.property}${item.osContext ? '/' + item.osContext : ''})`);
        }
      });
      
      if (items.length > 5) {
        console.log(`  ... 他 ${items.length - 5}件`);
      }
    });
    
    // プロパティ別集計
    const byProperty = new Map();
    shortTexts.forEach(item => {
      if (!byProperty.has(item.property)) {
        byProperty.set(item.property, []);
      }
      byProperty.get(item.property).push(item);
    });
    
    console.log('\n【プロパティ別の内訳】');
    byProperty.forEach((items, property) => {
      const hexagramCount = items.filter(i => i.isHexagramName).length;
      const otherCount = items.length - hexagramCount;
      
      console.log(`\n${property}: ${items.length}件`);
      if (hexagramCount > 0) {
        console.log(`  ✖️ 卦名: ${hexagramCount}件（変更禁止）`);
      }
      if (otherCount > 0) {
        console.log(`  ✅ その他: ${otherCount}件（修正対象）`);
        
        // 修正対象のサンプル
        const fixable = items.filter(i => !i.isHexagramName).slice(0, 3);
        fixable.forEach(item => {
          console.log(`     "${item.text}"`);
        });
      }
    });
    
    // 修正対象のリスト作成
    const toFix = shortTexts.filter(item => !item.isHexagramName);
    const uniqueTexts = new Set(toFix.map(i => i.text));
    
    console.log('\n【修正サマリー】');
    console.log(`総件数: ${shortTexts.length}件`);
    console.log(`卦名（保護）: ${shortTexts.filter(i => i.isHexagramName).length}件`);
    console.log(`修正対象: ${toFix.length}件`);
    console.log(`ユニークな修正対象: ${uniqueTexts.size}種類`);
    
    // 修正優先度の高いもの
    console.log('\n【修正優先度が高いもの（5文字以下）】');
    const highPriority = Array.from(uniqueTexts).filter(text => text.length <= 5).sort();
    highPriority.slice(0, 20).forEach(text => {
      console.log(`  "${text}" → 10文字以上の説明に拡張`);
    });
    
    if (highPriority.length > 20) {
      console.log(`  ... 他 ${highPriority.length - 20}種類`);
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyzeShortTextDetailed();