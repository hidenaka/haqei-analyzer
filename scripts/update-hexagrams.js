// update-hexagrams.js - hexagrams.jsファイルに力学データを追加するスクリプト

const fs = require('fs');
const path = require('path');

// HexagramDynamicsCalculatorクラスを定義（ファイルから読み込めない場合のフォールバック）
class HexagramDynamicsCalculator {
  constructor() {
    // 八つの基本三爻卦（八卦）の基本特性値定義
    this.trigramProperties = {
      1: { // 乾（天）
        innovation: 9, stability: 7, cooperation: 4, independence: 10, intuition: 6,
        resilience: 8, adaptability: 6, protection: 9, support_seeking: 2, introspection: 4
      },
      2: { // 兌（沢）
        innovation: 6, stability: 5, cooperation: 9, independence: 4, intuition: 8,
        resilience: 5, adaptability: 8, protection: 4, support_seeking: 8, introspection: 6
      },
      3: { // 離（火）
        innovation: 8, stability: 4, cooperation: 7, independence: 7, intuition: 9,
        resilience: 6, adaptability: 7, protection: 5, support_seeking: 6, introspection: 8
      },
      4: { // 震（雷）
        innovation: 8, stability: 3, cooperation: 5, independence: 8, intuition: 7,
        resilience: 7, adaptability: 9, protection: 6, support_seeking: 4, introspection: 5
      },
      5: { // 巽（風）
        innovation: 7, stability: 6, cooperation: 8, independence: 5, intuition: 8,
        resilience: 6, adaptability: 9, protection: 4, support_seeking: 7, introspection: 7
      },
      6: { // 坎（水）
        innovation: 6, stability: 8, cooperation: 6, independence: 6, intuition: 10,
        resilience: 9, adaptability: 6, protection: 8, support_seeking: 5, introspection: 9
      },
      7: { // 艮（山）
        innovation: 4, stability: 10, cooperation: 5, independence: 8, intuition: 6,
        resilience: 8, adaptability: 4, protection: 9, support_seeking: 3, introspection: 8
      },
      8: { // 坤（地）
        innovation: 3, stability: 9, cooperation: 10, independence: 2, intuition: 5,
        resilience: 7, adaptability: 8, protection: 6, support_seeking: 9, introspection: 6
      }
    };
  }

  calculateHexagramDynamics(upperTrigramId, lowerTrigramId) {
    const upper = this.trigramProperties[upperTrigramId];
    const lower = this.trigramProperties[lowerTrigramId];
    
    if (!upper || !lower) {
      console.warn(`⚠️ Invalid trigram IDs: upper=${upperTrigramId}, lower=${lowerTrigramId}`);
      return this.getZeroScores();
    }

    // 上卦70%、下卦30%の重み付けで計算
    const upperWeight = 0.7;
    const lowerWeight = 0.3;

    return {
      innovation_score: this.normalizeScore(upper.innovation * upperWeight + lower.innovation * lowerWeight),
      stability_score: this.normalizeScore(upper.stability * upperWeight + lower.stability * lowerWeight),
      cooperation_score: this.normalizeScore(upper.cooperation * upperWeight + lower.cooperation * lowerWeight),
      independence_score: this.normalizeScore(upper.independence * upperWeight + lower.independence * lowerWeight),
      intuition_score: this.normalizeScore(upper.intuition * upperWeight + lower.intuition * lowerWeight),
      resilience_score: this.normalizeScore(upper.resilience * upperWeight + lower.resilience * lowerWeight),
      adaptability_score: this.normalizeScore(upper.adaptability * upperWeight + lower.adaptability * lowerWeight),
      protection_score: this.normalizeScore(upper.protection * upperWeight + lower.protection * lowerWeight),
      support_seeking_score: this.normalizeScore(upper.support_seeking * upperWeight + lower.support_seeking * lowerWeight),
      introspection_score: this.normalizeScore(upper.introspection * upperWeight + lower.introspection * lowerWeight)
    };
  }

  normalizeScore(rawScore) {
    const normalized = Math.max(0, Math.min(10, rawScore));
    return Math.round(normalized * 10) / 10;
  }

  getZeroScores() {
    return {
      innovation_score: 0.0, stability_score: 0.0, cooperation_score: 0.0,
      independence_score: 0.0, intuition_score: 0.0, resilience_score: 0.0,
      adaptability_score: 0.0, protection_score: 0.0, support_seeking_score: 0.0,
      introspection_score: 0.0
    };
  }
}

// メイン処理
async function updateHexagramsFile() {
  try {
    console.log('🔄 hexagrams.jsファイルの更新開始...');
    
    // 現在のhexagrams.jsファイルを読み込み
    const hexagramsPath = path.join(__dirname, 'public/js/data/hexagrams.js');
    console.log('📁 読み込み中:', hexagramsPath);
    
    const fileContent = fs.readFileSync(hexagramsPath, 'utf8');
    
    // hexagrams_master配列を抽出（evalを使わずに正規表現で抽出）
    const hexagramsMatch = fileContent.match(/var hexagrams_master = (\[[\s\S]*?\]);/);
    if (!hexagramsMatch) {
      throw new Error('hexagrams_master配列が見つかりません');
    }
    
    // JSON形式に変換してパース
    const hexagramsArrayString = hexagramsMatch[1]
      .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":') // プロパティ名をクォート
      .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*[^",}\]]*)/g, ': "$1"') // 値をクォート（ただし数値は除く）
      .replace(/:\s*"(\d+(?:\.\d+)?)"/g, ': $1'); // 数値のクォートを除去
    
    const hexagramsArray = JSON.parse(hexagramsArrayString);
    console.log(`📊 ${hexagramsArray.length}個の卦データを読み込み完了`);
    
    // 力学データ計算器を初期化
    const calculator = new HexagramDynamicsCalculator();
    
    // 各卦に力学データを追加
    const updatedHexagrams = hexagramsArray.map((hexagram, index) => {
      const dynamics = calculator.calculateHexagramDynamics(
        hexagram.upper_trigram_id,
        hexagram.lower_trigram_id
      );
      
      if ((index + 1) % 10 === 0) {
        console.log(`🔬 ${index + 1}/64 卦の力学データ計算完了`);
      }
      
      return { ...hexagram, ...dynamics };
    });
    
    // 更新されたファイルコンテンツを生成
    const header = `// hexagrams.js - 易経64卦データ定義ファイル（力学データ統合版）
// HaQei Analyzer - Hexagrams Master Data with Dynamics
// 64卦の基本情報 + 力学データ（自動生成 ${new Date().toISOString()}）

var hexagrams_master = [`;
    
    const hexagramsJson = updatedHexagrams.map(hexagram => {
      const jsonStr = JSON.stringify(hexagram, null, 2);
      return '  ' + jsonStr.replace(/\n/g, '\n  ');
    }).join(',\n');
    
    // 元のファイルの残り部分を保持（trigrams_master等）
    const remainingContentMatch = fileContent.match(/];([\s\S]*?)$/);
    const remainingContent = remainingContentMatch ? remainingContentMatch[1] : `

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.hexagrams_master = hexagrams_master;
}`;
    
    const newFileContent = `${header}\n${hexagramsJson}\n]${remainingContent}`;
    
    // ファイルを更新
    fs.writeFileSync(hexagramsPath, newFileContent, 'utf8');
    
    console.log('✅ hexagrams.jsファイルの更新完了');
    console.log(`📈 追加された力学データ: innovation_score, stability_score, cooperation_score, independence_score, intuition_score`);
    console.log(`🛡️ 追加された防御データ: resilience_score, adaptability_score, protection_score, support_seeking_score, introspection_score`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
updateHexagramsFile();