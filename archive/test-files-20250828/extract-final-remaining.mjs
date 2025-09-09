import { readFile, writeFile } from 'fs/promises';

async function extractFinalRemaining() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // 除外フィールド（metaデータなど）
    const excludeFields = [
      'type', 'emoji', 'symbol', 'element', 'nickname', 
      'energyLevel', 'id', 'season', 'time', 'direction', 'metaphor'
    ];
    
    // 全ての短い説明を文字数別に収集
    const shortByLength = {
      7: [],
      8: [],
      9: []
    };
    
    const checkField = (hexName, path, text) => {
      if (!text || typeof text !== 'string') return;
      
      // 除外フィールドをスキップ
      const shouldExclude = excludeFields.some(field => path.includes(field));
      if (shouldExclude) return;
      
      // 7-9文字の説明を記録
      if (text.length >= 7 && text.length <= 9) {
        shortByLength[text.length].push({
          hexagram: hexName,
          path: path,
          text: text
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
    
    // ユニークなテキストのみ抽出
    const uniqueTexts = new Map();
    
    [7, 8, 9].forEach(length => {
      console.log(`\n【${length}文字の短い説明: ${shortByLength[length].length}件】`);
      shortByLength[length].forEach(item => {
        if (!uniqueTexts.has(item.text)) {
          uniqueTexts.set(item.text, []);
        }
        uniqueTexts.get(item.text).push({
          hexagram: item.hexagram,
          path: item.path
        });
      });
    });
    
    // ユニークテキストを表示
    const sortedTexts = Array.from(uniqueTexts.entries())
      .sort((a, b) => a[0].length - b[0].length || a[0].localeCompare(b[0]));
    
    console.log('\n=== ユニークな短いテキスト ===');
    console.log(`総数: ${sortedTexts.length}件\n`);
    
    // 最初の30件を表示
    sortedTexts.slice(0, 30).forEach(([text, locations]) => {
      console.log(`"${text}" (${text.length}文字, ${locations.length}箇所)`);
      if (locations.length <= 2) {
        locations.forEach(loc => {
          console.log(`  - ${loc.hexagram}: ${loc.path}`);
        });
      }
    });
    
    // JSONファイルに保存
    const remainingData = {};
    sortedTexts.forEach(([text]) => {
      remainingData[text] = text + 'を充実させる';
    });
    
    await writeFile('./final-remaining-texts.json', JSON.stringify(remainingData, null, 2));
    console.log('\n📁 残りのテキスト: final-remaining-texts.json');
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

extractFinalRemaining();