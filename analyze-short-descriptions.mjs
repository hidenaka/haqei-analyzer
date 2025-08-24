import { readFile, writeFile } from 'fs/promises';

async function analyzeShortDescriptions() {
  try {
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    const window = {};
    eval(content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // カテゴリ別に短い説明を分析
    const categories = {
      profile: [],
      whatHappens: [],
      example: [],
      howTo: [],
      warning: [],
      metaphor: [],
      other: []
    };
    
    // パターン別分類
    const patterns = {
      incomplete: [],      // 「〜する」だけの不完全な説明
      abstract: [],        // 抽象的すぎる
      repetitive: [],      // 同じような表現の繰り返し
      contextMissing: []   // 文脈が不足
    };
    
    Object.entries(v3Data).forEach(([hexName, hex]) => {
      const checkField = (path, text) => {
        if (!text || typeof text !== 'string') return;
        
        // 10文字未満の短い説明を抽出
        if (text.length < 10 && 
            !path.includes('type') && 
            !path.includes('style') && 
            !path.includes('emoji') &&
            !path.includes('symbol') &&
            !path.includes('element') &&
            !path.includes('nickname') &&
            !path.includes('energyLevel') &&
            !path.includes('id')) {
          
          const item = {
            hexagram: hexName,
            hexId: hex.id,
            path: path,
            text: text,
            length: text.length
          };
          
          // カテゴリ分類
          if (path.includes('profile')) categories.profile.push(item);
          else if (path.includes('whatHappens')) categories.whatHappens.push(item);
          else if (path.includes('example')) categories.example.push(item);
          else if (path.includes('how')) categories.howTo.push(item);
          else if (path.includes('warning')) categories.warning.push(item);
          else if (path.includes('metaphor')) categories.metaphor.push(item);
          else categories.other.push(item);
          
          // パターン分類
          if (text.endsWith('する') || text.endsWith('いる')) {
            patterns.incomplete.push(item);
          } else if (text.includes('常に') || text.includes('全て') || text.includes('完全')) {
            patterns.abstract.push(item);
          } else if (text.split('、').length > 1 || text.includes('・')) {
            patterns.repetitive.push(item);
          } else {
            patterns.contextMissing.push(item);
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
    
    // 統計レポート生成
    console.log('=== 短い説明の分析レポート ===\n');
    
    console.log('【カテゴリ別分布】');
    Object.entries(categories).forEach(([cat, items]) => {
      if (items.length > 0) {
        console.log(`${cat}: ${items.length}件`);
      }
    });
    
    console.log('\n【パターン別分類】');
    console.log(`不完全な説明: ${patterns.incomplete.length}件`);
    console.log(`抽象的すぎる: ${patterns.abstract.length}件`);
    console.log(`繰り返し表現: ${patterns.repetitive.length}件`);
    console.log(`文脈不足: ${patterns.contextMissing.length}件`);
    
    console.log('\n【最も短い説明TOP10】');
    const allShort = Object.values(categories).flat();
    allShort.sort((a, b) => a.length - b.length);
    allShort.slice(0, 10).forEach((item, i) => {
      console.log(`${i+1}. "${item.text}" (${item.length}文字) - ${item.hexagram}`);
    });
    
    console.log('\n【最も問題の多い卦TOP10】');
    const byHexagram = {};
    allShort.forEach(item => {
      if (!byHexagram[item.hexagram]) {
        byHexagram[item.hexagram] = [];
      }
      byHexagram[item.hexagram].push(item);
    });
    
    const sorted = Object.entries(byHexagram)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);
    
    sorted.forEach(([hex, items], i) => {
      console.log(`${i+1}. ${hex}: ${items.length}件`);
    });
    
    // 修正方針の提案
    console.log('\n=== 修正方針の提案 ===\n');
    
    console.log('【優先度1: 即座に修正すべきもの】');
    console.log('- 5文字以下の説明（現在: ' + allShort.filter(i => i.length <= 5).length + '件）');
    console.log('- whatHappensフィールド（ユーザーが最も見る部分）');
    console.log('- profileのdescription（第一印象を決める）');
    
    console.log('\n【優先度2: 段階的に改善】');
    console.log('- example フィールド（具体例の充実）');
    console.log('- warning/tip フィールド（実用的アドバイスの追加）');
    
    console.log('\n【優先度3: 長期的改善】');
    console.log('- metaphor（比喩表現の洗練）');
    console.log('- その他の補足説明');
    
    // 修正テンプレート生成
    const template = {
      whatHappens: {
        before: "次の行動の準備",
        after: "次の行動に向けて心身の準備を整えている状態",
        principle: "「何が起きているか」を15-25文字で具体的に説明"
      },
      example: {
        before: "問題 → 原点回帰",
        after: "困難に直面したら基本に立ち返って対処する",
        principle: "「→」形式から自然な文章へ変換"
      },
      warning: {
        before: "急ぎすぎない",
        after: "焦って急ぎすぎると本来の良さを失う可能性がある",
        principle: "理由と結果を含む注意喚起"
      }
    };
    
    // レポートファイル保存
    const report = {
      timestamp: new Date().toISOString(),
      statistics: {
        total: allShort.length,
        byCategory: Object.entries(categories).map(([cat, items]) => ({
          category: cat,
          count: items.length
        })),
        byPattern: Object.entries(patterns).map(([pat, items]) => ({
          pattern: pat,
          count: items.length
        }))
      },
      worstCases: allShort.slice(0, 20),
      template: template,
      priorityPlan: {
        immediate: allShort.filter(i => i.length <= 5),
        high: categories.whatHappens.concat(categories.profile),
        medium: categories.example.concat(categories.warning),
        low: categories.metaphor.concat(categories.other)
      }
    };
    
    await writeFile('./short-descriptions-analysis.json', JSON.stringify(report, null, 2));
    console.log('\n📁 詳細分析: short-descriptions-analysis.json');
    
    return report;
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

analyzeShortDescriptions();