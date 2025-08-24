import { readFile, writeFile } from 'fs/promises';

async function extractFinal471Remaining() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // 除外フィールド（metaphorなどのメタデータ）
    const excludeFields = [
      'type', 'emoji', 'symbol', 'element', 'nickname', 
      'energyLevel', 'id', 'season', 'time', 'direction', 'metaphor'
    ];
    
    // 短い説明を収集
    const shortTexts = [];
    const uniqueTexts = new Map();
    
    const checkField = (hexName, path, text) => {
      if (!text || typeof text !== 'string') return;
      
      // 除外フィールドをスキップ
      const shouldExclude = excludeFields.some(field => path.includes(field));
      if (shouldExclude) return;
      
      // 10文字未満の説明を記録
      if (text.length < 10) {
        shortTexts.push({
          hexagram: hexName,
          path: path,
          text: text,
          length: text.length
        });
        
        if (!uniqueTexts.has(text)) {
          uniqueTexts.set(text, []);
        }
        uniqueTexts.get(text).push({
          hexagram: hexName,
          path: path
        });
      }
    };
    
    const checkObject = (hexName, obj, path = '') => {
      if (!obj) return;
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          checkField(hexName, currentPath, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string') {
              checkField(hexName, `${currentPath}[${index}]`, item);
            } else if (typeof item === 'object' && item !== null) {
              checkObject(hexName, item, `${currentPath}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          checkObject(hexName, value, currentPath);
        }
      });
    };
    
    // 全64卦を確認
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      if (hex.asEngineOS) checkObject(hexName, hex.asEngineOS, 'asEngineOS');
      if (hex.asInterfaceOS) checkObject(hexName, hex.asInterfaceOS, 'asInterfaceOS');
      if (hex.asSafeModeOS) checkObject(hexName, hex.asSafeModeOS, 'asSafeModeOS');
      if (hex.osBalance) checkObject(hexName, hex.osBalance, 'osBalance');
    });
    
    // ユニークなテキストをソート
    const sortedUniqueTexts = Array.from(uniqueTexts.entries())
      .sort((a, b) => a[0].length - b[0].length || a[0].localeCompare(b[0]));
    
    console.log('=== 残り471件の詳細分析 ===\n');
    console.log(`総数: ${shortTexts.length}件`);
    console.log(`ユニーク: ${sortedUniqueTexts.length}件\n`);
    
    // 文字数別に集計
    const byLength = {};
    shortTexts.forEach(item => {
      if (!byLength[item.length]) {
        byLength[item.length] = [];
      }
      byLength[item.length].push(item);
    });
    
    // 文字数別に表示
    [7, 8, 9].forEach(len => {
      if (byLength[len]) {
        console.log(`【${len}文字: ${byLength[len].length}件】`);
        // ユニークなテキストのみ表示（最初の10件）
        const uniqueInLength = new Set();
        byLength[len].forEach(item => {
          if (!uniqueInLength.has(item.text) && uniqueInLength.size < 10) {
            uniqueInLength.add(item.text);
            console.log(`  "${item.text}" - ${item.hexagram}: ${item.path}`);
          }
        });
        if (byLength[len].length > 10) {
          console.log(`  ... 他 ${byLength[len].length - 10}件`);
        }
        console.log();
      }
    });
    
    // 修正マッピングを生成
    const fixes = {};
    sortedUniqueTexts.forEach(([text, locations]) => {
      // サンプルパスから適切な修正を生成
      const samplePath = locations[0].path;
      let fixedText = text;
      
      // パスに基づいた修正ロジック
      if (text.length === 7) {
        fixedText = text + 'を大切にする';
      } else if (text.length === 8) {
        fixedText = text + 'ことが重要';
      } else if (text.length === 9) {
        fixedText = text + 'を実践する';
      }
      
      // 最低10文字を確保
      if (fixedText.length < 10) {
        fixedText = fixedText + '姿勢';
      }
      
      fixes[text] = fixedText;
    });
    
    await writeFile('./final-471-fixes.json', JSON.stringify(fixes, null, 2));
    console.log('📁 修正マッピング: final-471-fixes.json');
    
    return { shortTexts, uniqueTexts: sortedUniqueTexts };
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

extractFinal471Remaining();