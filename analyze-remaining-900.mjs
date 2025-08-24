import { readFile, writeFile } from 'fs/promises';

async function analyzeRemaining900() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    console.log('=== 残り900件の詳細分析 ===\n');
    
    // 全ての短い説明を収集して詳細分類
    const allShortTexts = [];
    
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      const checkField = (path, text) => {
        if (!text || typeof text !== 'string') return;
        
        // 10文字未満をチェック（特定フィールドを除外）
        if (text.length < 10 && 
            !path.includes('type') && 
            !path.includes('emoji') &&
            !path.includes('symbol') &&
            !path.includes('element') &&
            !path.includes('nickname') &&
            !path.includes('energyLevel') &&
            !path.includes('id')) {
          
          allShortTexts.push({
            hexagram: hexName,
            hexId: hex.id,
            path: path,
            text: text,
            length: text.length,
            category: categorize(path)
          });
        }
      };
      
      const categorize = (path) => {
        if (path.includes('whatHappens')) return 'whatHappens';
        if (path.includes('example')) return 'example';
        if (path.includes('warning')) return 'warning';
        if (path.includes('tip')) return 'tip';
        if (path.includes('howTo')) return 'howTo';
        if (path.includes('metaphor')) return 'metaphor';
        if (path.includes('description')) return 'description';
        if (path.includes('where')) return 'where';
        if (path.includes('withWho')) return 'withWho';
        if (path.includes('avoid')) return 'avoid';
        if (path.includes('goodAt')) return 'goodAt';
        if (path.includes('notGoodAt')) return 'notGoodAt';
        if (path.includes('note')) return 'note';
        if (path.includes('when')) return 'when';
        if (path.includes('strength')) return 'strength';
        if (path.includes('weakness')) return 'weakness';
        if (path.includes('advice')) return 'advice';
        if (path.includes('goodPoint')) return 'goodPoint';
        if (path.includes('badPoint')) return 'badPoint';
        if (path.includes('recovery')) return 'recovery';
        if (path.includes('timeToRecover')) return 'timeToRecover';
        if (path.includes('bestWay')) return 'bestWay';
        if (path.includes('environment')) return 'environment';
        if (path.includes('support')) return 'support';
        if (path.includes('idealBalance')) return 'idealBalance';
        if (path.includes('whenBalanced')) return 'whenBalanced';
        if (path.includes('whenImbalanced')) return 'whenImbalanced';
        return 'other';
      };
      
      const checkObject = (obj, path = '') => {
        if (!obj) return;
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === 'string') {
            checkField(currentPath, value);
          } else if (typeof value === 'object' && value !== null) {
            checkObject(value, currentPath);
          }
        });
      };
      
      if (hex.asEngineOS) checkObject(hex.asEngineOS, 'asEngineOS');
      if (hex.asInterfaceOS) checkObject(hex.asInterfaceOS, 'asInterfaceOS');
      if (hex.asSafeModeOS) checkObject(hex.asSafeModeOS, 'asSafeModeOS');
      if (hex.osBalance) checkObject(hex.osBalance, 'osBalance');
    });
    
    // カテゴリ別に分類
    const byCategory = {};
    allShortTexts.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = [];
      }
      byCategory[item.category].push(item);
    });
    
    // カテゴリ別統計
    console.log('【カテゴリ別内訳】');
    Object.entries(byCategory).forEach(([cat, items]) => {
      console.log(`${cat}: ${items.length}件`);
    });
    
    // 各カテゴリの最初の10件を表示
    Object.entries(byCategory).forEach(([cat, items]) => {
      if (items.length > 0) {
        console.log(`\n【${cat}の例（最初の10件）】`);
        items.slice(0, 10).forEach((item, i) => {
          console.log(`${i+1}. "${item.text}" (${item.length}文字) - ${item.hexagram} - ${item.path}`);
        });
      }
    });
    
    // 修正が必要な項目をグループ化
    const fixGroups = {
      veryShort: allShortTexts.filter(i => i.length <= 5),
      short: allShortTexts.filter(i => i.length === 6),
      medium: allShortTexts.filter(i => i.length === 7),
      almostOk: allShortTexts.filter(i => i.length === 8),
      nearTen: allShortTexts.filter(i => i.length === 9)
    };
    
    console.log('\n【文字数別分布】');
    console.log(`5文字以下: ${fixGroups.veryShort.length}件`);
    console.log(`6文字: ${fixGroups.short.length}件`);
    console.log(`7文字: ${fixGroups.medium.length}件`);
    console.log(`8文字: ${fixGroups.almostOk.length}件`);
    console.log(`9文字: ${fixGroups.nearTen.length}件`);
    
    // 全テキストをユニークにして修正対象を特定
    const uniqueTexts = {};
    allShortTexts.forEach(item => {
      if (!uniqueTexts[item.text]) {
        uniqueTexts[item.text] = [];
      }
      uniqueTexts[item.text].push(item);
    });
    
    console.log(`\n【ユニークなテキスト数】: ${Object.keys(uniqueTexts).length}件`);
    
    // 詳細レポート保存
    const report = {
      timestamp: new Date().toISOString(),
      total: allShortTexts.length,
      byCategory: Object.entries(byCategory).map(([cat, items]) => ({
        category: cat,
        count: items.length,
        samples: items.slice(0, 20)
      })),
      byLength: {
        '5文字以下': fixGroups.veryShort.length,
        '6文字': fixGroups.short.length,
        '7文字': fixGroups.medium.length,
        '8文字': fixGroups.almostOk.length,
        '9文字': fixGroups.nearTen.length
      },
      uniqueTexts: Object.entries(uniqueTexts).map(([text, items]) => ({
        text: text,
        count: items.length,
        locations: items.map(i => `${i.hexagram}/${i.path}`)
      }))
    };
    
    await writeFile('./remaining-900-analysis.json', JSON.stringify(report, null, 2));
    
    console.log('\n📁 詳細レポート: remaining-900-analysis.json');
    
    return report;
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyzeRemaining900();