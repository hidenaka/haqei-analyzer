# DataPersistenceManager 統合ガイド

## 概要

HAQEIプロジェクト用のDataPersistenceManagerは、IndexedDBベースの永続化システムで、7変化パターン全データの安全な管理を実現します。

### 主要機能

- **IndexedDBベース**: ブラウザローカルストレージによる高速データアクセス
- **AES-256暗号化**: 個人情報の完全保護
- **90日自動削除**: プライバシー保護を考慮したデータ管理
- **1000件以上対応**: 大量データでも高速動作
- **データ匿名化**: GDPR準拠のプライバシー保護

## 基本的な使用方法

### 1. 初期化

```javascript
// DataPersistenceManager作成
const persistenceManager = new DataPersistenceManager();

// 初期化実行
const initResult = await persistenceManager.initialize();

if (initResult.success) {
  console.log('✅ DataPersistenceManager初期化成功');
} else {
  console.error('❌ 初期化失敗:', initResult.message);
}
```

### 2. 分析結果の保存

```javascript
// HAQEI分析結果データ
const analysisData = {
  inputAnalysis: {
    originalText: 'ユーザー入力テキスト',
    textLength: 50,
    complexity: 'medium'
  },
  finalResult: {
    hexagram: 23,
    line: 4,
    confidence: 0.85,
    reasoning: '分析結果の詳細な説明',
    tripleOSIntegration: {
      engineOS: 0.7,
      interfaceOS: 0.6,
      safeModeOS: 0.3
    }
  },
  stageResults: {
    // 7段階分析の各段階結果
  },
  qualityMetrics: {
    overallConfidence: 0.85,
    stageCompletionRate: 1.0,
    errorCount: 0,
    processingTime: 1250,
    qualityGrade: 'A'
  },
  systemInfo: {
    engineVersion: '2.1',
    timestamp: new Date().toISOString()
  }
};

// 7変化パターンデータ
const patterns = [
  {
    type: 'transformation',
    data: {
      description: '変化パターンの詳細',
      intensity: 0.8,
      probability: 0.7,
      timeframe: 'medium'
    }
  },
  // ... 残り6つのパターン
];

// ユーザープロファイル（オプション）
const userProfile = {
  age: 30,
  location: { prefecture: '東京都' },
  interests: ['philosophy', 'self-development']
};

// データ保存実行
const saveResult = await persistenceManager.saveAnalysisResult(
  analysisData, 
  patterns, 
  userProfile
);

if (saveResult.success) {
  console.log('✅ 分析結果保存成功:', saveResult.analysisId);
} else {
  console.error('❌ 保存失敗:', saveResult.error);
}
```

### 3. データの取得

```javascript
// 分析結果取得
const analysisId = 'analysis_xxx_yyy'; // 保存時に取得したID
const getResult = await persistenceManager.getAnalysisResult(analysisId, true);

if (getResult.success) {
  const data = getResult.data;
  console.log('取得した分析結果:', data);
  console.log('関連パターン:', data.patterns);
} else {
  console.error('❌ 取得失敗:', getResult.error);
}
```

### 4. データの検索

```javascript
// 検索条件
const searchCriteria = {
  confidenceRange: { min: 0.8, max: 1.0 }, // 信頼度0.8以上
  dateRange: { 
    start: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30日前から
    end: Date.now() 
  },
  limit: 50,
  sortBy: 'timestamp',
  sortOrder: 'desc'
};

const searchResult = await persistenceManager.searchAnalysisResults(searchCriteria);

if (searchResult.success) {
  console.log(`検索結果: ${searchResult.results.length}件`);
  searchResult.results.forEach(result => {
    console.log(`ID: ${result.id}, 信頼度: ${result.result.confidence}`);
  });
}
```

### 5. データの削除

```javascript
// 特定の分析結果削除
const deleteResult = await persistenceManager.deleteAnalysisResult(analysisId);

if (deleteResult.success) {
  console.log('✅ 削除成功:', deleteResult.analysisId);
} else {
  console.error('❌ 削除失敗:', deleteResult.error);
}
```

## HAQEI Future Simulatorとの統合

### IntegratedAnalysisEngineとの連携

```javascript
// IntegratedAnalysisEngineから結果を取得して保存
class HAQEIAnalyzer {
  constructor() {
    this.analysisEngine = new IntegratedAnalysisEngine(kuromojiTokenizer);
    this.persistenceManager = new DataPersistenceManager();
  }

  async initialize() {
    await this.persistenceManager.initialize();
    console.log('HAQEI分析システム初期化完了');
  }

  async analyzeAndSave(inputText, contextType = null, userPersona = null) {
    try {
      // 7段階統合分析実行
      const analysisResult = await this.analysisEngine.performSevenStageAnalysis(
        inputText, 
        contextType, 
        userPersona
      );

      // 7変化パターン生成（SituationalContextEngineからも取得可能）
      const patterns = this.generateSevenTransformationPatterns(analysisResult);

      // 永続化
      const saveResult = await this.persistenceManager.saveAnalysisResult(
        analysisResult,
        patterns,
        userPersona
      );

      return {
        analysis: analysisResult,
        persistence: saveResult,
        success: saveResult.success
      };

    } catch (error) {
      console.error('❌ 分析・保存エラー:', error);
      return { success: false, error: error.message };
    }
  }

  generateSevenTransformationPatterns(analysisResult) {
    // 7変化パターンの生成ロジック
    const patterns = [
      {
        type: 'transformation',
        data: {
          description: '現状からの変化可能性',
          intensity: analysisResult.finalResult.confidence * 0.8,
          probability: 0.7,
          timeframe: 'medium'
        }
      },
      {
        type: 'evolution',
        data: {
          description: '段階的発展パターン',
          intensity: analysisResult.finalResult.tripleOSIntegration.engineOS,
          probability: 0.6,
          timeframe: 'long'
        }
      },
      // ... 残り5つのパターン
    ];

    return patterns;
  }

  async getAnalysisHistory(userId, limit = 10) {
    const searchCriteria = {
      userId: userId,
      limit: limit,
      sortBy: 'timestamp',
      sortOrder: 'desc'
    };

    return await this.persistenceManager.searchAnalysisResults(searchCriteria);
  }
}

// 使用例
const analyzer = new HAQEIAnalyzer();
await analyzer.initialize();

const result = await analyzer.analyzeAndSave(
  '最近、仕事での人間関係に悩んでいます。',
  'work_stress',
  { age: 35, interests: ['career', 'relationships'] }
);

console.log('分析・保存結果:', result);
```

### Future Simulator UIとの統合

```javascript
// future_simulator.htmlでの使用例
class FutureSimulatorApp {
  constructor() {
    this.persistenceManager = new DataPersistenceManager();
    this.analyzer = new HAQEIAnalyzer();
  }

  async initialize() {
    await this.persistenceManager.initialize();
    await this.analyzer.initialize();
    
    // 過去の分析履歴をロード
    await this.loadAnalysisHistory();
  }

  async performAnalysis() {
    const inputText = document.getElementById('userInput').value;
    
    if (!inputText.trim()) {
      this.showMessage('入力テキストを入力してください', 'warning');
      return;
    }

    try {
      this.showProgress('分析中...');
      
      // 分析実行
      const result = await this.analyzer.analyzeAndSave(inputText);
      
      if (result.success) {
        // 結果表示
        this.displayAnalysisResult(result.analysis);
        
        // 履歴更新
        this.addToHistory(result.persistence.analysisId, result.analysis);
        
        this.showMessage('分析完了', 'success');
      } else {
        this.showMessage(`分析失敗: ${result.error}`, 'error');
      }
      
    } catch (error) {
      console.error('分析エラー:', error);
      this.showMessage(`エラーが発生しました: ${error.message}`, 'error');
    } finally {
      this.hideProgress();
    }
  }

  async loadAnalysisHistory() {
    try {
      const historyResult = await this.persistenceManager.searchAnalysisResults({
        limit: 20,
        sortBy: 'timestamp',
        sortOrder: 'desc'
      });

      if (historyResult.success) {
        this.updateHistoryUI(historyResult.results);
      }
    } catch (error) {
      console.error('履歴読み込みエラー:', error);
    }
  }

  async loadPreviousAnalysis(analysisId) {
    try {
      const result = await this.persistenceManager.getAnalysisResult(analysisId);
      
      if (result.success) {
        this.displayAnalysisResult(result.data);
        this.showMessage('過去の分析結果を表示しました', 'info');
      } else {
        this.showMessage('分析結果の読み込みに失敗しました', 'error');
      }
    } catch (error) {
      console.error('分析結果読み込みエラー:', error);
    }
  }

  displayAnalysisResult(analysisData) {
    // 結果表示ロジック
    document.getElementById('hexagramResult').textContent = analysisData.finalResult.hexagram;
    document.getElementById('lineResult').textContent = analysisData.finalResult.line;
    document.getElementById('confidenceResult').textContent = 
      `${(analysisData.finalResult.confidence * 100).toFixed(1)}%`;
    document.getElementById('reasoningResult').textContent = analysisData.finalResult.reasoning;
    
    // パターン表示
    if (analysisData.patterns) {
      this.displayTransformationPatterns(analysisData.patterns);
    }
  }

  displayTransformationPatterns(patterns) {
    const patternsContainer = document.getElementById('patternsContainer');
    patternsContainer.innerHTML = '';
    
    patterns.forEach((pattern, index) => {
      const patternElement = document.createElement('div');
      patternElement.className = 'pattern-card';
      patternElement.innerHTML = `
        <h4>パターン${index + 1}: ${pattern.patternType}</h4>
        <p>${pattern.patternData.description}</p>
        <div class="pattern-metrics">
          <span>強度: ${(pattern.patternData.intensity * 100).toFixed(0)}%</span>
          <span>確率: ${(pattern.patternData.probability * 100).toFixed(0)}%</span>
          <span>期間: ${pattern.patternData.timeframe}</span>
        </div>
      `;
      patternsContainer.appendChild(patternElement);
    });
  }

  updateHistoryUI(historyData) {
    const historyContainer = document.getElementById('analysisHistory');
    historyContainer.innerHTML = '';
    
    historyData.forEach(analysis => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-header">
          <span class="history-date">${new Date(analysis.timestamp).toLocaleDateString()}</span>
          <span class="history-confidence">${(analysis.result.confidence * 100).toFixed(0)}%</span>
        </div>
        <div class="history-content">
          <p>${analysis.input.text.substring(0, 50)}...</p>
          <span class="history-hexagram">卦${analysis.result.hexagram} 爻${analysis.result.line}</span>
        </div>
      `;
      
      historyItem.addEventListener('click', () => {
        this.loadPreviousAnalysis(analysis.id);
      });
      
      historyContainer.appendChild(historyItem);
    });
  }

  showMessage(message, type) {
    // メッセージ表示ロジック
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  showProgress(message) {
    // プログレス表示
    console.log(`進行中: ${message}`);
  }

  hideProgress() {
    // プログレス非表示
    console.log('進行完了');
  }
}

// アプリケーション初期化
const app = new FutureSimulatorApp();
app.initialize().then(() => {
  console.log('✅ Future Simulator アプリケーション準備完了');
});
```

## セキュリティとプライバシー

### データ暗号化

```javascript
// 個人情報の暗号化例
const sensitiveData = 'ユーザーの個人情報';
const encrypted = await persistenceManager.encryptData(sensitiveData);
const decrypted = await persistenceManager.decryptData(encrypted);

console.log('元データ:', sensitiveData);
console.log('暗号化済み:', encrypted);
console.log('復号化後:', decrypted);
```

### データ匿名化

```javascript
// ユーザープロファイルの匿名化
const userProfile = {
  name: '田中太郎',
  email: 'tanaka@example.com',
  age: 35,
  location: { prefecture: '東京都', city: '渋谷区' }
};

const anonymized = persistenceManager.anonymizeUserData(userProfile);

console.log('匿名化前:', userProfile);
console.log('匿名化後:', anonymized);
// 結果: { ageGroup: 30, region: '東京都', anonymizedAt: '...' }
```

### 自動削除設定

```javascript
// 保持期間の設定（デフォルト90日）
persistenceManager.dataRetentionDays = 60; // 60日に変更

// 手動クリーンアップ実行
await persistenceManager.performAutoCleanup();
```

## パフォーマンス最適化

### バッチ処理

```javascript
// 大量データの効率的な保存
const analysisPromises = [];

for (let i = 0; i < 100; i++) {
  const analysisData = generateAnalysisData(i);
  const patterns = generatePatterns(i);
  
  analysisPromises.push(
    persistenceManager.saveAnalysisResult(analysisData, patterns)
  );
}

// 並列実行
const results = await Promise.all(analysisPromises);
const successCount = results.filter(r => r.success).length;

console.log(`${successCount}/${results.length}件保存成功`);
```

### キャッシュ活用

```javascript
// キャッシュ設定
persistenceManager.cacheEnabled = true;
persistenceManager.maxCacheSize = 1000;

// 頻繁にアクセスするデータはキャッシュから高速取得
const result = await persistenceManager.getAnalysisResult(analysisId);
// 2回目以降はキャッシュから取得されるため高速
```

### インデックス活用

```javascript
// 効率的な検索（インデックスを活用）
const searchCriteria = {
  // timestampインデックスを使用
  dateRange: { start: startDate, end: endDate },
  
  // hexagramインデックスを使用
  hexagram: 23,
  
  // confidenceインデックスを使用
  confidenceRange: { min: 0.8, max: 1.0 }
};

const results = await persistenceManager.searchAnalysisResults(searchCriteria);
```

## バックアップとリストア

### バックアップ作成

```javascript
// 全データのバックアップ作成
const backupResult = await persistenceManager.createBackup();

if (backupResult.success) {
  // バックアップデータをJSON形式で保存
  const backupJson = JSON.stringify(backupResult.backup, null, 2);
  
  // ファイルダウンロード（ブラウザ環境）
  const blob = new Blob([backupJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `haqei_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}
```

### バックアップ復元

```javascript
// バックアップファイルからの復元
const backupData = JSON.parse(backupFileContent);
const restoreResult = await persistenceManager.restoreBackup(backupData);

if (restoreResult.success) {
  console.log(`${restoreResult.restoredRecords}件のデータを復元しました`);
} else {
  console.error('復元失敗:', restoreResult.error);
}
```

## 統計とモニタリング

### システム統計取得

```javascript
const stats = persistenceManager.getPerformanceStatistics();

console.log('データベース情報:', stats.database);
console.log('操作統計:', stats.operations);
console.log('セキュリティ情報:', stats.security);
console.log('メンテナンス情報:', stats.maintenance);
console.log('キャッシュ情報:', stats.cache);
```

### パフォーマンス監視

```javascript
// 操作時間の監視
const startTime = performance.now();
const result = await persistenceManager.saveAnalysisResult(data, patterns);
const operationTime = performance.now() - startTime;

console.log(`保存操作時間: ${operationTime.toFixed(2)}ms`);
```

## エラーハンドリング

### 基本的なエラーハンドリング

```javascript
try {
  const result = await persistenceManager.saveAnalysisResult(data, patterns);
  
  if (!result.success) {
    console.error('保存失敗:', result.error);
    // エラー処理
  }
  
} catch (error) {
  console.error('例外発生:', error);
  // 例外処理
}
```

### 詳細なエラー分析

```javascript
const result = await persistenceManager.saveAnalysisResult(data, patterns);

if (!result.success) {
  switch (result.error) {
    case '無効な分析データ':
      // データ検証エラー
      break;
    case 'データベース接続エラー':
      // DB接続問題
      break;
    case '暗号化エラー':
      // 暗号化問題
      break;
    default:
      // その他のエラー
      break;
  }
}
```

## 開発とテスト

### テスト実行

プロジェクトに含まれるテストHTMLファイルを使用してテストを実行：

```bash
# テストページをブラウザで開く
open test-data-persistence-manager.html
```

### デバッグ設定

```javascript
// デバッグモードの有効化
window.DEBUG_PERSISTENCE = true;

// 詳細ログの表示
persistenceManager.enableDebugMode = true;
```

### パフォーマンステスト

```javascript
// 大量データテスト
async function performanceTest() {
  const testCount = 1000;
  const startTime = performance.now();
  
  for (let i = 0; i < testCount; i++) {
    const data = generateTestData(i);
    await persistenceManager.saveAnalysisResult(data, []);
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  console.log(`${testCount}件処理時間: ${totalTime.toFixed(2)}ms`);
  console.log(`1件あたり: ${(totalTime / testCount).toFixed(2)}ms`);
}
```

## トラブルシューティング

### 一般的な問題と解決法

1. **初期化失敗**
   ```javascript
   // IndexedDBサポート確認
   if (!window.indexedDB) {
     console.error('IndexedDBがサポートされていません');
   }
   ```

2. **暗号化エラー**
   ```javascript
   // Web Crypto APIサポート確認
   if (!window.crypto || !window.crypto.subtle) {
     console.warn('Web Crypto APIが利用できません');
   }
   ```

3. **データ取得失敗**
   ```javascript
   // データ存在確認
   const exists = await persistenceManager.getAnalysisResult(analysisId);
   if (!exists.success) {
     console.log('データが見つかりません');
   }
   ```

4. **パフォーマンス問題**
   ```javascript
   // キャッシュ設定確認
   console.log('キャッシュ状態:', persistenceManager.getCacheStatistics());
   
   // インデックス使用状況確認
   const stats = persistenceManager.getPerformanceStatistics();
   console.log('操作統計:', stats.operations);
   ```

## まとめ

DataPersistenceManagerは、HAQEIプロジェクトにおける包括的なデータ永続化ソリューションです：

- **セキュア**: AES-256暗号化による完全なデータ保護
- **プライバシー配慮**: 90日自動削除とデータ匿名化
- **高性能**: 1000件以上のデータでも高速動作
- **統合**: HAQEI Future Simulatorとの完全統合
- **テスト済み**: 包括的なテストスイートで品質保証

この統合ガイドを参考に、HAQEIプロジェクトでのデータ永続化を効果的に実装してください。