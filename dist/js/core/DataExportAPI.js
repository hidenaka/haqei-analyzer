/**
 * DataExportAPI - HaQei哲学準拠データエクスポートシステム
 * Triple OS Architecture準拠の安全なデータ出力機能
 */

console.log('📊 DataExportAPI Loading...');

window.DataExportAPI = {
  // Triple OS Architecture準拠の初期化
  init() {
    console.log('🔧 DataExportAPI initializing...');
    this.setupExportMethods();
    this.validateStorageAccess();
    console.log('✅ DataExportAPI initialized successfully');
  },

  // HaQei理論に基づく調和的データエクスポート
  setupExportMethods() {
    this.exportFormats = {
      json: this.exportAsJSON.bind(this),
      csv: this.exportAsCSV.bind(this),
      text: this.exportAsText.bind(this),
      iching: this.exportAsIChingFormat.bind(this)
    };
  },

  // ストレージアクセス検証（Safe Mode準拠）
  validateStorageAccess() {
    try {
      const testKey = '_dataexport_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.storageAvailable = true;
    } catch (e) {
      console.warn('⚠️ LocalStorage not available, using memory storage');
      this.storageAvailable = false;
      this.memoryStorage = new Map();
    }
  },

  // 易経卦象データとしてエクスポート
  exportAsIChingFormat(data) {
    const ichingData = {
      timestamp: new Date().toISOString(),
      hexagram: data.hexagram || '乾',
      analysis: data.analysis || {},
      scenarios: data.scenarios || [],
      haqei_philosophy: {
        harmony: this.calculateHarmonyIndex(data),
        balance: this.calculateBalanceScore(data),
        wisdom: this.extractWisdomElements(data)
      }
    };

    return this.generateDownload(JSON.stringify(ichingData, null, 2), 'haqei-iching-analysis.json', 'application/json');
  },

  // JSON形式エクスポート
  exportAsJSON(data) {
    const exportData = {
      ...data,
      exported_at: new Date().toISOString(),
      format_version: '1.0',
      haqei_signature: this.generateHaQeiSignature(data)
    };

    return this.generateDownload(JSON.stringify(exportData, null, 2), 'haqei-analysis.json', 'application/json');
  },

  // CSV形式エクスポート
  exportAsCSV(data) {
    const csvData = this.convertToCSV(data);
    return this.generateDownload(csvData, 'haqei-analysis.csv', 'text/csv');
  },

  // テキスト形式エクスポート
  exportAsText(data) {
    const textData = this.convertToText(data);
    return this.generateDownload(textData, 'haqei-analysis.txt', 'text/plain');
  },

  // CSVデータ変換
  convertToCSV(data) {
    let csv = 'Category,Value,Timestamp\n';
    
    if (data.hexagram) csv += `Hexagram,${data.hexagram},${new Date().toISOString()}\n`;
    if (data.scenarios) {
      data.scenarios.forEach((scenario, index) => {
        csv += `Scenario ${index + 1},"${scenario.replace(/"/g, '""')}",${new Date().toISOString()}\n`;
      });
    }
    if (data.analysis) {
      Object.entries(data.analysis).forEach(([key, value]) => {
        csv += `${key},"${String(value).replace(/"/g, '""')}",${new Date().toISOString()}\n`;
      });
    }

    return csv;
  },

  // テキストデータ変換
  convertToText(data) {
    let text = '=== HAQEI Analysis Report ===\n\n';
    text += `Generated: ${new Date().toLocaleString('ja-JP')}\n\n`;
    
    if (data.hexagram) {
      text += `易経卦象: ${data.hexagram}\n\n`;
    }
    
    if (data.scenarios) {
      text += '--- 8つのシナリオ ---\n';
      data.scenarios.forEach((scenario, index) => {
        text += `${index + 1}. ${scenario}\n`;
      });
      text += '\n';
    }
    
    if (data.analysis) {
      text += '--- 分析結果 ---\n';
      Object.entries(data.analysis).forEach(([key, value]) => {
        text += `${key}: ${value}\n`;
      });
    }

    text += '\n--- HaQei Philosophy Signature ---\n';
    text += this.generateHaQeiSignature(data);

    return text;
  },

  // ダウンロード生成
  generateDownload(content, filename, mimeType) {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log(`✅ Data exported as ${filename}`);
      return true;
    } catch (error) {
      console.error('❌ Export failed:', error);
      return false;
    }
  },

  // HaQei哲学署名生成
  generateHaQeiSignature(data) {
    const harmony = this.calculateHarmonyIndex(data);
    const balance = this.calculateBalanceScore(data);
    const wisdom = this.extractWisdomElements(data);
    
    return `Harmony: ${harmony.toFixed(2)} | Balance: ${balance.toFixed(2)} | Wisdom Elements: ${wisdom.length}`;
  },

  // 調和指数計算
  calculateHarmonyIndex(data) {
    let harmonyScore = 0.5; // 基準値
    
    if (data.scenarios && data.scenarios.length === 8) {
      harmonyScore += 0.2; // 完全な8卦システム
    }
    
    if (data.analysis && Object.keys(data.analysis).length > 0) {
      harmonyScore += 0.2; // 分析の深度
    }
    
    if (data.hexagram) {
      harmonyScore += 0.1; // 易経統合
    }
    
    return Math.min(harmonyScore, 1.0);
  },

  // バランススコア計算
  calculateBalanceScore(data) {
    const elements = [
      data.scenarios?.length || 0,
      Object.keys(data.analysis || {}).length,
      data.hexagram ? 1 : 0
    ];
    
    const variance = this.calculateVariance(elements);
    return Math.max(0, 1 - variance / 10); // 分散を逆転してスコア化
  },

  // 分散計算
  calculateVariance(arr) {
    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  },

  // 知恵要素抽出
  extractWisdomElements(data) {
    const wisdomElements = [];
    
    if (data.hexagram) wisdomElements.push('hexagram_wisdom');
    if (data.scenarios?.length >= 8) wisdomElements.push('complete_scenarios');
    if (data.analysis?.depth > 0.7) wisdomElements.push('deep_analysis');
    
    return wisdomElements;
  },

  // 公開APIメソッド
  async exportData(data, format = 'json') {
    if (!this.exportFormats[format]) {
      console.error(`❌ Unsupported format: ${format}`);
      return false;
    }
    
    try {
      return await this.exportFormats[format](data);
    } catch (error) {
      console.error('❌ Export error:', error);
      return false;
    }
  }
};

// 自動初期化（DOMContentLoadedで）
document.addEventListener('DOMContentLoaded', () => {
  window.DataExportAPI.init();
});

console.log('✅ DataExportAPI loaded successfully');