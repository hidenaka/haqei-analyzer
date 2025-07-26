// update-hexagrams-safe.js - hexagrams.jsファイルに力学データを安全に追加

const fs = require('fs');
const path = require('path');

// 力学データ計算器
class HexagramDynamicsCalculator {
  constructor() {
    this.trigramProperties = {
      1: { innovation: 9, stability: 7, cooperation: 4, independence: 10, intuition: 6,
           resilience: 8, adaptability: 6, protection: 9, support_seeking: 2, introspection: 4 },
      2: { innovation: 6, stability: 5, cooperation: 9, independence: 4, intuition: 8,
           resilience: 5, adaptability: 8, protection: 4, support_seeking: 8, introspection: 6 },
      3: { innovation: 8, stability: 4, cooperation: 7, independence: 7, intuition: 9,
           resilience: 6, adaptability: 7, protection: 5, support_seeking: 6, introspection: 8 },
      4: { innovation: 8, stability: 3, cooperation: 5, independence: 8, intuition: 7,
           resilience: 7, adaptability: 9, protection: 6, support_seeking: 4, introspection: 5 },
      5: { innovation: 7, stability: 6, cooperation: 8, independence: 5, intuition: 8,
           resilience: 6, adaptability: 9, protection: 4, support_seeking: 7, introspection: 7 },
      6: { innovation: 6, stability: 8, cooperation: 6, independence: 6, intuition: 10,
           resilience: 9, adaptability: 6, protection: 8, support_seeking: 5, introspection: 9 },
      7: { innovation: 4, stability: 10, cooperation: 5, independence: 8, intuition: 6,
           resilience: 8, adaptability: 4, protection: 9, support_seeking: 3, introspection: 8 },
      8: { innovation: 3, stability: 9, cooperation: 10, independence: 2, intuition: 5,
           resilience: 7, adaptability: 8, protection: 6, support_seeking: 9, introspection: 6 }
    };
  }

  calculateHexagramDynamics(upperTrigramId, lowerTrigramId) {
    const upper = this.trigramProperties[upperTrigramId];
    const lower = this.trigramProperties[lowerTrigramId];
    
    if (!upper || !lower) return this.getZeroScores();

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
    return Math.round(Math.max(0, Math.min(10, rawScore)) * 10) / 10;
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

async function updateHexagramsFile() {
  try {
    console.log('🔄 hexagrams.jsファイルの更新開始...');
    
    const hexagramsPath = path.join(__dirname, 'public/js/data/hexagrams.js');
    const fileContent = fs.readFileSync(hexagramsPath, 'utf8');
    
    const calculator = new HexagramDynamicsCalculator();
    
    // 各卦オブジェクトを順次更新
    let updatedContent = fileContent;
    
    for (let hexagramId = 1; hexagramId <= 64; hexagramId++) {
      // 卦IDから上卦・下卦を計算
      const upperTrigramId = Math.ceil(hexagramId / 8);
      const lowerTrigramId = ((hexagramId - 1) % 8) + 1;
      
      // 力学データを計算
      const dynamics = calculator.calculateHexagramDynamics(upperTrigramId, lowerTrigramId);
      
      // 該当する卦のオブジェクトを見つけて更新
      const hexagramPattern = new RegExp(
        `(\\{[^}]*hexagram_id:\\s*${hexagramId}[^}]*)(keywords:\\s*"[^"]*")([^}]*\\})`,
        'ms'
      );
      
      const match = updatedContent.match(hexagramPattern);
      if (match) {
        const dynamicsProperties = Object.entries(dynamics)
          .map(([key, value]) => `    ${key}: ${value}`)
          .join(',\n');
        
        const replacement = `${match[1]}${match[2]},
${dynamicsProperties}${match[3]}`;
        
        updatedContent = updatedContent.replace(hexagramPattern, replacement);
        
        if (hexagramId % 10 === 0) {
          console.log(`🔬 ${hexagramId}/64 卦の力学データ追加完了`);
        }
      } else {
        console.warn(`⚠️ 卦${hexagramId}のパターンが見つかりません`);
      }
    }
    
    // ヘッダーコメントを更新
    updatedContent = updatedContent.replace(
      /\/\/ hexagrams\.js - 易経64卦データ定義ファイル.*?\n/,
      `// hexagrams.js - 易経64卦データ定義ファイル（力学データ統合版）\n// HaQei Analyzer - Hexagrams Master Data with Dynamics (updated ${new Date().toISOString()})\n`
    );
    
    // ファイルを保存
    fs.writeFileSync(hexagramsPath, updatedContent, 'utf8');
    
    console.log('✅ hexagrams.jsファイルの更新完了');
    console.log('📈 追加された力学データ: innovation_score, stability_score, cooperation_score, independence_score, intuition_score');
    console.log('🛡️ 追加された防御データ: resilience_score, adaptability_score, protection_score, support_seeking_score, introspection_score');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

updateHexagramsFile();