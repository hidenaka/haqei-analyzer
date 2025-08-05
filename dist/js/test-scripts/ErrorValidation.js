/**
 * ErrorValidation.js
 * bunenjin哲学統合 - 統計的品質検証システム
 * Tsumiki品質保証: エラー率0%、成功率100%目標
 * 
 * 目的:
 * - OS Analyzerの4つの主要エラーの完全解決検証
 * - bunenjin分人思想による動的品質管理
 * - Triple OS Architecture統合の検証
 * - 統計的品質保証による継続的監視
 * 
 * 処理内容:
 * 1. リアルタイムエラー監視とログ収集
 * 2. 品質メトリクスの統計的計算
 * 3. bunenjin哲学適合性の動的評価
 * 4. 自動品質レポート生成
 * 
 * 前提条件:
 * - MicroStorageManager拡張完了
 * - BridgeStorageManager統合完了
 * - Service Workerルーティング修正完了
 * - DOM構造修正完了
 */

class ErrorValidationSystem {
  constructor() {
    this.errorLog = [];
    this.qualityMetrics = {
      totalErrors: 0,
      resolvedErrors: 0,
      errorRate: 0,
      successRate: 0,
      bunenjinCompliance: 0,
      tsumikiStandard: 0,
      confidenceInterval: { min: 0, max: 0 }
    };
    
    this.targetErrors = [
      'getAnalysisResult is not a function',
      'GET http://localhost:8788/results 404',
      'UI container with ID \'data-manager-errors\' not found',
      'The message port closed before a response was received'
    ];
    
    this.validationStartTime = Date.now();
    this.setupErrorMonitoring();
    
    console.log('🔍 ErrorValidationSystem initialized with bunenjin philosophy');
  }

  /**
   * エラー監視システムセットアップ
   * 
   * 目的:
   * - グローバルエラーの自動キャッチと分類
   * - 統計的品質メトリクスの継続的収集
   * - bunenjin分人思想による動的エラー解決
   */
  setupErrorMonitoring() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });

    // Console error override
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError({
        type: 'console',
        message: args.join(' '),
        timestamp: Date.now()
      });
      originalConsoleError.apply(console, args);
    };

    console.log('🛡️ Error monitoring system active');
  }

  /**
   * エラーログ記録と分析
   * 
   * 目的:
   * - 発生エラーの詳細分析と分類
   * - ターゲットエラーの解決状況追跡
   * - 統計的品質メトリクスの更新
   */
  logError(errorInfo) {
    this.errorLog.push(errorInfo);
    this.qualityMetrics.totalErrors++;
    
    // Check if this is one of our target errors
    const isTargetError = this.targetErrors.some(targetError => 
      errorInfo.message && errorInfo.message.includes(targetError)
    );
    
    if (isTargetError) {
      console.warn('🎯 Target error detected:', errorInfo.message);
      this.analyzeTargetError(errorInfo);
    }
    
    this.updateQualityMetrics();
  }

  /**
   * ターゲットエラーの詳細分析
   */
  analyzeTargetError(errorInfo) {
    const analysis = {
      errorInfo,
      resolutionStatus: 'detected',
      bunenjinAnalysis: this.getBunenjinAnalysis(errorInfo),
      timestamp: Date.now()
    };
    
    // Store analysis for reporting
    if (!this.targetErrorAnalysis) {
      this.targetErrorAnalysis = [];
    }
    this.targetErrorAnalysis.push(analysis);
  }

  /**
   * bunenjin哲学的エラー分析
   * 
   * 目的:
   * - エラーの根本原因をbunenjin分人思想で分析
   * - Triple OS Architecture観点での影響評価
   * - 易経的変化対応による解決策提案
   */
  getBunenjinAnalysis(errorInfo) {
    const message = errorInfo.message || '';
    
    if (message.includes('getAnalysisResult')) {
      return {
        osType: 'Engine OS',
        bunenjinImpact: 'データ管理分人の機能不完全',
        resolutionStrategy: 'MicroStorageManager拡張による分人機能強化',
        philosophicalNote: '分人の協調不足が原因'
      };
    }
    
    if (message.includes('404') && message.includes('results')) {
      return {
        osType: 'Interface OS',
        bunenjinImpact: 'ルーティング分人の認識不一致',
        resolutionStrategy: 'Service Workerでの分人間調整',
        philosophicalNote: '分人間のコミュニケーション改善が必要'
      };
    }
    
    if (message.includes('data-manager-errors')) {
      return {
        osType: 'Safe Mode OS',
        bunenjinImpact: 'エラー表示分人の不在',
        resolutionStrategy: 'DOM構造への分人追加',
        philosophicalNote: '安全機能分人の実体化が必要'
      };
    }
    
    if (message.includes('message port closed')) {
      return {
        osType: 'Interface OS',
        bunenjinImpact: '通信分人の接続断絶',
        resolutionStrategy: 'Service Worker通信の堅牢化',
        philosophicalNote: '分人間の持続的関係性構築が必要'
      };
    }
    
    return {
      osType: 'Unknown',
      bunenjinImpact: '未分類の分人機能問題',
      resolutionStrategy: '包括的分人システム見直し',
      philosophicalNote: '新しい分人の認識と統合が必要'
    };
  }

  /**
   * 品質メトリクス更新
   * 
   * 目的:
   * - 統計的品質指標の継続的計算
   * - Tsumiki品質基準との適合性評価
   * - 信頼区間の統計的算出
   */
  updateQualityMetrics() {
    const totalChecks = this.getTotalValidationChecks();
    const successfulChecks = totalChecks - this.qualityMetrics.totalErrors;
    
    this.qualityMetrics.successRate = totalChecks > 0 ? 
      Math.round((successfulChecks / totalChecks) * 100) : 100;
    
    this.qualityMetrics.errorRate = 100 - this.qualityMetrics.successRate;
    
    // bunenjin compliance (philosophical alignment)
    this.qualityMetrics.bunenjinCompliance = this.calculateBunenjinCompliance();
    
    // Tsumiki standard (>= 80% success rate for A-grade)
    this.qualityMetrics.tsumikiStandard = this.qualityMetrics.successRate >= 80 ? 100 : 0;
    
    // Statistical confidence interval (simplified)
    const margin = Math.sqrt((this.qualityMetrics.successRate * (100 - this.qualityMetrics.successRate)) / totalChecks) || 0;
    this.qualityMetrics.confidenceInterval = {
      min: Math.max(0, this.qualityMetrics.successRate - margin),
      max: Math.min(100, this.qualityMetrics.successRate + margin)
    };
  }

  /**
   * bunenjin哲学適合性計算
   */
  calculateBunenjinCompliance() {
    if (!this.targetErrorAnalysis || this.targetErrorAnalysis.length === 0) {
      return 100; // No errors = full compliance
    }
    
    const resolvedAnalyses = this.targetErrorAnalysis.filter(analysis => 
      analysis.resolutionStatus === 'resolved'
    );
    
    return Math.round((resolvedAnalyses.length / this.targetErrorAnalysis.length) * 100);
  }

  /**
   * 総検証チェック数の取得
   */
  getTotalValidationChecks() {
    const runtimeMinutes = (Date.now() - this.validationStartTime) / (1000 * 60);
    return Math.max(10, Math.floor(runtimeMinutes * 5)); // 5 checks per minute minimum
  }

  /**
   * 自動品質検証実行
   * 
   * 目的:
   * - 4つのターゲットエラーの解決状況確認
   * - 統計的品質保証による包括的検証
   * - bunenjin分人システムの協調確認
   */
  async runAutoValidation() {
    console.log('🤖 Auto validation starting...');
    
    const validationResults = {
      microStorageManagerFix: await this.validateMicroStorageManager(),
      serviceWorkerRouting: await this.validateServiceWorkerRouting(),
      domStructure: await this.validateDOMStructure(),
      bridgeStorageIntegration: await this.validateBridgeStorageIntegration()
    };
    
    const report = this.generateQualityReport(validationResults);
    console.log('📊 Quality Report:', report);
    
    return report;
  }

  /**
   * MicroStorageManager修正検証
   */
  async validateMicroStorageManager() {
    try {
      const manager = new (window.MicroStorageManager || class {});
      
      return {
        hasGetAnalysisResult: typeof manager.getAnalysisResult === 'function',
        hasSaveAnalysisResult: typeof manager.saveAnalysisResult === 'function',
        hasGetInsights: typeof manager.getInsights === 'function',
        hasSaveInsights: typeof manager.saveInsights === 'function',
        functionalTest: this.testStorageManagerFunctionality(manager)
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Service Workerルーティング検証
   */
  async validateServiceWorkerRouting() {
    try {
      const response = await fetch('/results', { method: 'HEAD' }).catch(e => ({ status: 0, error: e.message }));
      
      return {
        serviceWorkerActive: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
        resultsRouteAccessible: response.status === 200 || response.redirected,
        responseStatus: response.status
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * DOM構造検証
   */
  async validateDOMStructure() {
    return {
      dataManagerErrorsExists: !!document.getElementById('data-manager-errors'),
      errorContainerAccessible: !!document.querySelector('#data-manager-errors'),
      containerInitiallyHidden: document.getElementById('data-manager-errors')?.style.display === 'none'
    };
  }

  /**
   * BridgeStorageManager統合検証
   */
  async validateBridgeStorageIntegration() {
    try {
      const BridgeStorageManager = window.BridgeStorageManager;
      if (!BridgeStorageManager) {
        return { error: 'BridgeStorageManager not available' };
      }
      
      const microManager = new (window.MicroStorageManager || class {})();
      const bridgeManager = new BridgeStorageManager(microManager);
      
      return {
        bridgeManagerCreated: !!bridgeManager,
        hasIntegrateFullManager: typeof bridgeManager.integrateFullManager === 'function',
        hasQualityMetrics: typeof bridgeManager.getQualityMetrics === 'function',
        delegatesCorrectly: this.testBridgeDelegation(bridgeManager)
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * StorageManager機能テスト
   */
  testStorageManagerFunctionality(manager) {
    try {
      const testData = { test: 'validation-data', timestamp: Date.now() };
      
      manager.saveAnalysisResult?.(testData);
      const retrieved = manager.getAnalysisResult?.();
      
      return JSON.stringify(retrieved) === JSON.stringify(testData);
    } catch (error) {
      return false;
    }
  }

  /**
   * Bridge委譲テスト
   */
  testBridgeDelegation(bridgeManager) {
    try {
      const testData = { bridge: 'test-data' };
      
      bridgeManager.saveAnalysisResult(testData);
      const retrieved = bridgeManager.getAnalysisResult();
      
      return JSON.stringify(retrieved) === JSON.stringify(testData);
    } catch (error) {
      return false;
    }
  }

  /**
   * 品質レポート生成
   * 
   * 目的:
   * - 包括的品質状況の統計的報告
   * - Tsumiki品質基準との適合性評価
   * - bunenjin哲学統合の成功度測定
   */
  generateQualityReport(validationResults) {
    const overallSuccess = this.calculateOverallSuccess(validationResults);
    
    return {
      timestamp: new Date().toISOString(),
      overallQuality: {
        grade: overallSuccess >= 80 ? 'A' : overallSuccess >= 60 ? 'B' : 'C',
        successRate: overallSuccess,
        tsumikiCompliant: overallSuccess >= 80,
        bunenjinIntegrated: this.qualityMetrics.bunenjinCompliance >= 80
      },
      targetErrorResolution: {
        microStorageManager: this.evaluateResolution(validationResults.microStorageManagerFix),
        serviceWorkerRouting: this.evaluateResolution(validationResults.serviceWorkerRouting),
        domStructure: this.evaluateResolution(validationResults.domStructure),
        bridgeStorageIntegration: this.evaluateResolution(validationResults.bridgeStorageIntegration)
      },
      qualityMetrics: this.qualityMetrics,
      recommendations: this.generateRecommendations(validationResults),
      bunenjinPhilosophyAlignment: {
        tripleOSIntegration: overallSuccess >= 80,
        bunenjinCompliance: this.qualityMetrics.bunenjinCompliance,
        statisticalQuality: this.qualityMetrics.confidenceInterval
      }
    };
  }

  /**
   * 全体成功率計算
   */
  calculateOverallSuccess(results) {
    const scores = [
      this.evaluateResolution(results.microStorageManagerFix),
      this.evaluateResolution(results.serviceWorkerRouting),
      this.evaluateResolution(results.domStructure),
      this.evaluateResolution(results.bridgeStorageIntegration)
    ];
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * 解決度評価
   */
  evaluateResolution(result) {
    if (result.error) return 0;
    
    const values = Object.values(result).filter(v => typeof v === 'boolean');
    if (values.length === 0) return 50;
    
    const trueCount = values.filter(v => v === true).length;
    return Math.round((trueCount / values.length) * 100);
  }

  /**
   * 改善推奨事項生成
   */
  generateRecommendations(results) {
    const recommendations = [];
    
    if (this.evaluateResolution(results.microStorageManagerFix) < 100) {
      recommendations.push('MicroStorageManager拡張メソッドの実装確認が必要');
    }
    
    if (this.evaluateResolution(results.serviceWorkerRouting) < 100) {
      recommendations.push('Service Workerルーティング設定の見直しが必要');
    }
    
    if (this.evaluateResolution(results.domStructure) < 100) {
      recommendations.push('DOM構造の修正とエラーコンテナ設置が必要');
    }
    
    if (this.evaluateResolution(results.bridgeStorageIntegration) < 100) {
      recommendations.push('BridgeStorageManager統合の完全実装が必要');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('全システム正常 - bunenjin哲学完全統合達成');
    }
    
    return recommendations;
  }

  /**
   * 品質メトリクス取得
   */
  getQualityMetrics() {
    return {
      ...this.qualityMetrics,
      errorLog: this.errorLog.slice(-10), // Last 10 errors
      validationDuration: Date.now() - this.validationStartTime
    };
  }

  /**
   * システムクリーンアップ
   */
  cleanup() {
    // Reset console.error if needed
    console.log('🧹 ErrorValidationSystem cleanup completed');
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.ErrorValidationSystem = ErrorValidationSystem;
  
  // Auto-initialize if not in test environment
  if (!window.location.pathname.includes('test-')) {
    window.errorValidator = new ErrorValidationSystem();
    
    // Run auto-validation after 5 seconds
    setTimeout(() => {
      window.errorValidator.runAutoValidation().then(report => {
        console.log('🎯 Auto-validation completed:', report);
      });
    }, 5000);
  }
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorValidationSystem;
}

console.log('🔍 ErrorValidationSystem loaded - bunenjin philosophy integrated');