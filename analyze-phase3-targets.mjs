import { readFile, writeFile } from 'fs/promises';

async function analyzePhase3Targets() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    console.log('=== フェーズ3対象の詳細分析 ===\n');
    
    // 残っている短い説明を詳細に分類
    const shortTexts = {
      example: [],     // 矢印形式の例
      warning: [],     // 注意事項
      tip: [],        // アドバイス
      howTo: [],      // 方法論
      style: [],      // スタイル説明
      goodAt: [],     // 得意なこと
      notGoodAt: [],  // 苦手なこと
      metaphor: [],   // 比喩表現
      other: []       // その他
    };
    
    // 全ての短い説明を収集
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      const checkField = (path, text) => {
        if (!text || typeof text !== 'string') return;
        
        // 10文字未満をチェック
        if (text.length < 10 && 
            !path.includes('type') && 
            !path.includes('emoji') &&
            !path.includes('symbol') &&
            !path.includes('element') &&
            !path.includes('nickname') &&
            !path.includes('energyLevel') &&
            !path.includes('id')) {
          
          const item = {
            hexagram: hexName,
            path: path,
            text: text,
            length: text.length
          };
          
          // パスに基づいて分類
          if (path.includes('example')) {
            shortTexts.example.push(item);
          } else if (path.includes('warning')) {
            shortTexts.warning.push(item);
          } else if (path.includes('tip')) {
            shortTexts.tip.push(item);
          } else if (path.includes('how')) {
            shortTexts.howTo.push(item);
          } else if (path.includes('style')) {
            shortTexts.style.push(item);
          } else if (path.includes('goodAt')) {
            shortTexts.goodAt.push(item);
          } else if (path.includes('notGoodAt')) {
            shortTexts.notGoodAt.push(item);
          } else if (path.includes('metaphor')) {
            shortTexts.metaphor.push(item);
          } else {
            shortTexts.other.push(item);
          }
        }
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
    });
    
    // 結果表示
    console.log('【カテゴリ別内訳】');
    Object.entries(shortTexts).forEach(([category, items]) => {
      console.log(`${category}: ${items.length}件`);
    });
    
    // 矢印形式の例を詳細表示
    console.log('\n【矢印形式のexample（優先修正）】');
    const arrowExamples = shortTexts.example.filter(item => item.text.includes('→'));
    console.log(`矢印形式: ${arrowExamples.length}件`);
    arrowExamples.slice(0, 10).forEach(item => {
      console.log(`  "${item.text}" - ${item.hexagram}`);
    });
    
    // 短すぎるwarning
    console.log('\n【短いwarning（要充実）】');
    shortTexts.warning.slice(0, 10).forEach(item => {
      console.log(`  "${item.text}" (${item.length}文字) - ${item.hexagram}`);
    });
    
    // 短すぎるtip
    console.log('\n【短いtip（要充実）】');
    shortTexts.tip.slice(0, 10).forEach(item => {
      console.log(`  "${item.text}" (${item.length}文字) - ${item.hexagram}`);
    });
    
    // 最も短いmetaphor
    console.log('\n【短いmetaphor（要改善）】');
    shortTexts.metaphor.sort((a, b) => a.length - b.length);
    shortTexts.metaphor.slice(0, 10).forEach(item => {
      console.log(`  "${item.text}" (${item.length}文字) - ${item.hexagram}`);
    });
    
    // 詳細レポート保存
    const report = {
      timestamp: new Date().toISOString(),
      total: Object.values(shortTexts).reduce((sum, arr) => sum + arr.length, 0),
      categories: Object.entries(shortTexts).map(([cat, items]) => ({
        category: cat,
        count: items.length,
        samples: items.slice(0, 5)
      })),
      arrowExamples: arrowExamples,
      priorityFixes: {
        arrows: arrowExamples.length,
        warnings: shortTexts.warning.length,
        tips: shortTexts.tip.length,
        metaphors: shortTexts.metaphor.filter(i => i.length < 8).length
      }
    };
    
    await writeFile('./phase3-analysis.json', JSON.stringify(report, null, 2));
    
    console.log('\n📊 合計: ' + report.total + '件の短い説明が残存');
    console.log('📁 詳細レポート: phase3-analysis.json');
    
    return report;
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyzePhase3Targets();