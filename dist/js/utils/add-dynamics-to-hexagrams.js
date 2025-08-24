// add-dynamics-to-hexagrams.js - hexagrams.jsに力学データを追加するスクリプト
// HaQei Analyzer - Hexagram Dynamics Injector

// HexagramDynamicsCalculatorをロード
if (typeof HexagramDynamicsCalculator === 'undefined') {
  // Node.js環境の場合
  try {
    const HexagramDynamicsCalculator = require('./hexagram-dynamics-calculator.js');
    global.HexagramDynamicsCalculator = HexagramDynamicsCalculator;
  } catch (e) {
    console.error('HexagramDynamicsCalculatorのロードに失敗しました:', e);
  }
}

class HexagramDynamicsInjector {
  constructor() {
    this.calculator = new HexagramDynamicsCalculator();
    
    // 六十四卦の三爻卦対応表（1-64の卦IDから上卦・下卦IDを算出）
    this.hexagramTrigramMapping = {};
    this.initializeTrigramMapping();
  }

  // 卦番号から三爻卦の組み合わせを初期化
  initializeTrigramMapping() {
    // 伝統的な八卦配列（乾兌離震巽坎艮坤）
    const trigramOrder = [1, 2, 3, 4, 5, 6, 7, 8]; // 乾兌離震巽坎艮坤
    
    let hexagramId = 1;
    for (let upper of trigramOrder) {
      for (let lower of trigramOrder) {
        this.hexagramTrigramMapping[hexagramId] = {
          upper: upper,
          lower: lower
        };
        hexagramId++;
      }
    }
  }

  // 単一の卦に力学データを追加
  addDynamicsToHexagram(hexagramData) {
    const hexagramId = hexagramData.hexagram_id;
    
    // 三爻卦の組み合わせを取得
    const trigramInfo = this.hexagramTrigramMapping[hexagramId];
    if (!trigramInfo) {
      console.warn(`⚠️ 卦${hexagramId}の三爻卦情報が見つかりません`);
      return hexagramData;
    }

    // 力学データを計算
    const dynamics = this.calculator.calculateHexagramDynamics(
      trigramInfo.upper, 
      trigramInfo.lower
    );

    // 既存のデータに力学スコアを追加
    return {
      ...hexagramData,
      ...dynamics
    };
  }

  // hexagrams_master配列全体に力学データを追加
  addDynamicsToAllHexagrams(hexagramsArray) {
    console.log('🔬 力学データの計算開始...');
    
    const updatedHexagrams = hexagramsArray.map((hexagram, index) => {
      const updated = this.addDynamicsToHexagram(hexagram);
      
      // 進捗表示
      if ((index + 1) % 10 === 0) {
        console.log(`📊 ${index + 1}/64 卦の力学データ計算完了`);
      }
      
      return updated;
    });
    
    console.log('✅ 全64卦の力学データ計算完了');
    return updatedHexagrams;
  }

  // 更新されたhexagrams.jsファイルのコンテンツを生成
  generateUpdatedFileContent(hexagramsArray) {
    const updatedHexagrams = this.addDynamicsToAllHexagrams(hexagramsArray);
    
    // ファイルのヘッダー
    const header = `// hexagrams.js - 易経64卦データ定義ファイル（力学データ統合版）
// HaQei Analyzer - Hexagrams Master Data with Dynamics
// 64卦の基本情報 + 力学データ（自動生成）

var hexagrams_master = [`;
    
    // 各卦のJSONデータを整形
    const hexagramsJson = updatedHexagrams.map(hexagram => {
      return '  ' + JSON.stringify(hexagram, null, 2).replace(/\n/g, '\n  ');
    }).join(',\n');
    
    // ファイルのフッター
    const footer = `];

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.hexagrams_master = hexagrams_master;
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = hexagrams_master;
}`;
    
    return `${header}\n${hexagramsJson}\n${footer}`;
  }

  // デバッグ用：特定の卦の力学データをログ出力
  debugHexagramDynamics(hexagramId) {
    const trigramInfo = this.hexagramTrigramMapping[hexagramId];
    const dynamics = this.calculator.calculateHexagramDynamics(
      trigramInfo.upper, 
      trigramInfo.lower
    );
    
    console.log(`🔍 卦${hexagramId}の力学データ:`, {
      trigrams: trigramInfo,
      dynamics
    });
    
    return dynamics;
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.HexagramDynamicsInjector = HexagramDynamicsInjector;
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexagramDynamicsInjector;
}

// スクリプトとして直接実行される場合のテスト関数
if (typeof window !== 'undefined') {
  window.testDynamicsInjection = function() {
    const injector = new HexagramDynamicsInjector();
    
    // テスト用の卦データ
    const testHexagram = {
      hexagram_id: 1,
      name_jp: "乾為天",
      reading: "けんいてん"
    };
    
    const result = injector.addDynamicsToHexagram(testHexagram);
    console.log('🧪 テスト結果:', result);
    
    return result;
  };
}