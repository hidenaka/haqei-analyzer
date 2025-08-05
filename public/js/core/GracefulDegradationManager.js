/**
 * HAQEIアナライザー グレースフルデグラデーション管理システム
 * GracefulDegradationManager.js
 * 
 * bunenjin哲学に基づく段階的機能縮退・復旧システム
 * 易経の変化原理とTriple OS Architectureを活用した適応的システム
 * 
 * 核心理念:
 * - 完全停止よりも部分機能継続（生存戦略）
 * - 段階的縮退による影響最小化
 * - 状況に応じた適応的回復（易経変化）
 * - ユーザー体験の継続性確保
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0-graceful-harmony
 * Created: 2025-08-05
 */

class GracefulDegradationManager {
  constructor(options = {}) {
    this.version = "1.0.0-graceful-harmony";
    this.philosophyAlignment = "bunenjin-adaptive-harmony";
    
    // 設定
    this.config = {
      enableAutoRecovery: options.enableAutoRecovery !== false,
      recoveryCheckInterval: options.recoveryCheckInterval || 30000,
      maxDegradationLevel: options.maxDegradationLevel || 5,
      userNotificationEnabled: options.userNotificationEnabled !== false,
      performanceMonitoring: options.performanceMonitoring !== false,
      bunenjinAdaptation: options.bunenjinAdaptation !== false,
      debugMode: options.debugMode || false,
      ...options
    };
    
    // 縮退レベル定義
    this.degradationLevels = new Map([
      [0, {
        name: '正常動作',
        description: 'すべての機能が正常に動作',
        features: ['all'],
        restrictions: [],
        priority: 0
      }],
      [1, {
        name: '軽微な機能制限',
        description: '拡張機能の一部を無効化',
        features: ['core', 'analysis', 'results'],
        restrictions: ['animations', 'advanced-visualizations'],
        priority: 1
      }],
      [2, {
        name: '中程度の機能制限',
        description: 'パフォーマンスへの影響を最小化',
        features: ['core', 'analysis'],
        restrictions: ['animations', 'advanced-visualizations', 'real-time-updates'],
        priority: 2
      }],
      [3, {
        name: '基本機能モード',
        description: '基本的な分析機能のみ提供',
        features: ['core'],
        restrictions: ['visualizations', 'export', 'sharing', 'real-time-updates'],
        priority: 3
      }],
      [4, {
        name: 'セーフモード',
        description: '最低限の機能で動作継続',
        features: ['basic-ui'],
        restrictions: ['analysis', 'calculations', 'data-processing'],
        priority: 4
      }],
      [5, {
        name: '緊急モード',
        description: 'エラー報告とシステム情報のみ',
        features: ['error-reporting'],
        restrictions: ['all-user-features'],
        priority: 5
      }]
    ]);
    
    // 機能モジュール定義
    this.featureModules = new Map([
      ['core', {
        name: 'コア機能',
        essential: true,
        dependencies: [],
        fallback: null,
        status: 'active'
      }],
      ['analysis', {
        name: '分析エンジン',
        essential: true,
        dependencies: ['core'],
        fallback: 'basic-analysis',
        status: 'active'
      }],
      ['results', {
        name: '結果表示',
        essential: true,
        dependencies: ['core', 'analysis'],
        fallback: 'simple-results',
        status: 'active'
      }],
      ['visualizations', {
        name: 'データ可視化',
        essential: false,
        dependencies: ['results'],
        fallback: 'text-only',
        status: 'active'
      }],
      ['animations', {
        name: 'アニメーション',
        essential: false,
        dependencies: [],
        fallback: null,
        status: 'active'
      }],
      ['export', {
        name: 'データエクスポート',
        essential: false,
        dependencies: ['results'],
        fallback: 'basic-copy',
        status: 'active'
      }],
      ['sharing', {
        name: '結果共有',
        essential: false,
        dependencies: ['export'],
        fallback: null,
        status: 'active'
      }],
      ['real-time-updates', {
        name: 'リアルタイム更新',
        essential: false,
        dependencies: ['core'],
        fallback: 'manual-refresh',
        status: 'active'
      }]
    ]);
    
    // 現在の状態
    this.currentDegradationLevel = 0;
    this.activeFeatures = new Set(['all']);
    this.disabledFeatures = new Set();
    this.degradationHistory = [];
    this.recoveryAttempts = 0;
    
    // 監視・回復システム
    this.healthCheckInterval = null;
    this.recoveryInProgress = false;
    this.lastHealthCheck = null;
    
    // イベントエミッター
    this.eventListeners = new Map();
    
    this.initialize();
    
    console.log(`🛡️ GracefulDegradationManager v${this.version} initialized`);
  }
  
  /**
   * システム初期化
   */
  initialize() {
    // 自動回復監視開始
    if (this.config.enableAutoRecovery) {
      this.startRecoveryMonitoring();
    }
    
    // パフォーマンス監視開始
    if (this.config.performanceMonitoring) {
      this.startPerformanceMonitoring();
    }
    
    // 初期ヘルスチェック
    this.performHealthCheck();
    
    console.log("✅ GracefulDegradationManager initialized");
  }
  
  /**
   * 縮退実行（メインエントリーポイント）
   */
  async degradeToLevel(targetLevel, reason = '', forceDegrade = false) {
    try {
      const startTime = performance.now();
      
      // 縮退レベル検証
      if (!this.degradationLevels.has(targetLevel)) {
        throw new Error(`Invalid degradation level: ${targetLevel}`);
      }
      
      // 現在のレベル以下への縮退は無視（強制でない限り）
      if (targetLevel <= this.currentDegradationLevel && !forceDegrade) {
        console.log(`⚠️ Already at or below target level ${targetLevel}, skipping degradation`);
        return false;
      }
      
      const levelConfig = this.degradationLevels.get(targetLevel);
      
      console.log(`⬇️ Degrading to level ${targetLevel}: ${levelConfig.name}`);
      console.log(`📝 Reason: ${reason}`);
      
      // 縮退前の状態保存
      const previousState = this.captureCurrentState();
      
      // 段階的縮退実行
      const success = await this.executeGradualDegradation(targetLevel, levelConfig);
      
      if (success) {
        // 状態更新
        this.currentDegradationLevel = targetLevel;
        this.updateActiveFeatures(levelConfig);
        
        // 履歴記録
        this.recordDegradation(targetLevel, reason, previousState);
        
        // ユーザー通知
        if (this.config.userNotificationEnabled) {
          this.notifyUserOfDegradation(levelConfig, reason);
        }
        
        // イベント発火
        this.emitEvent('degradation-applied', {
          level: targetLevel,
          config: levelConfig,
          reason: reason,
          duration: performance.now() - startTime
        });
        
        console.log(`✅ Successfully degraded to level ${targetLevel}`);
        return true;
      } else {
        console.error(`❌ Failed to degrade to level ${targetLevel}`);
        return false;
      }
      
    } catch (error) {
      console.error("❌ Degradation execution failed:", error);
      return false;
    }
  }
  
  /**
   * 段階的縮退実行
   */
  async executeGradualDegradation(targetLevel, levelConfig) {
    try {
      // 各機能の段階的無効化
      const featuresToDisable = this.calculateFeaturesToDisable(targetLevel);
      
      for (const feature of featuresToDisable) {
        try {
          await this.disableFeature(feature);
          console.log(`📴 Disabled feature: ${feature}`);
        } catch (featureError) {
          console.warn(`⚠️ Failed to disable feature ${feature}:`, featureError);
          // 個別機能の無効化失敗は全体を停止させない
        }
      }
      
      // フォールバック機能の有効化
      await this.enableFallbacks(levelConfig);
      
      // UI調整
      await this.adjustUIForDegradationLevel(targetLevel);
      
      return true;
      
    } catch (error) {
      console.error("❌ Gradual degradation failed:", error);
      return false;
    }
  }
  
  /**
   * 機能無効化
   */
  async disableFeature(feature) {
    const featureConfig = this.featureModules.get(feature);
    if (!featureConfig) {
      console.warn(`⚠️ Unknown feature: ${feature}`);
      return;
    }
    
    try {
      // 機能固有の無効化処理
      switch (feature) {
        case 'animations':
          await this.disableAnimations();
          break;
          
        case 'visualizations':
          await this.disableVisualizations();
          break;
          
        case 'real-time-updates':
          await this.disableRealTimeUpdates();
          break;
          
        case 'export':
          await this.disableExport();
          break;
          
        case 'sharing':
          await this.disableSharing();
          break;
          
        case 'analysis':
          await this.disableAnalysis();
          break;
          
        default:
          console.log(`📴 Generic disable for feature: ${feature}`);
      }
      
      featureConfig.status = 'disabled';
      this.disabledFeatures.add(feature);
      this.activeFeatures.delete(feature);
      
    } catch (error) {
      console.error(`❌ Failed to disable feature ${feature}:`, error);
      throw error;
    }
  }
  
  /**
   * アニメーション無効化
   */
  async disableAnimations() {
    // CSS アニメーション無効化
    const style = document.createElement('style');
    style.id = 'degradation-disable-animations';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
    
    // JavaScript アニメーション停止
    if (window.requestAnimationFrame) {
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = (callback) => {
        // アニメーションフレームを即座に実行
        setTimeout(callback, 0);
      };
    }
  }
  
  /**
   * データ可視化無効化
   */
  async disableVisualizations() {
    // グラフ・チャート要素の非表示
    const visualElements = document.querySelectorAll(
      '.chart, .graph, .visualization, .interactive-element'
    );
    
    visualElements.forEach(element => {
      element.style.display = 'none';
      
      // 代替テキストの表示
      const fallback = document.createElement('div');
      fallback.className = 'visualization-fallback';
      fallback.textContent = 'データ可視化は現在利用できません（テキスト表示に切り替え）';
      fallback.style.cssText = `
        padding: 12px;
        background: #f3f4f6;
        border-radius: 4px;
        color: #6b7280;
        text-align: center;
        font-size: 14px;
      `;
      
      element.parentNode.insertBefore(fallback, element);
    });
  }
  
  /**
   * リアルタイム更新無効化
   */
  async disableRealTimeUpdates() {
    // WebSocket接続の停止
    if (window.WebSocket && window.webSocketConnections) {
      window.webSocketConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    }
    
    // SSE (Server-Sent Events) の停止
    if (window.eventSources) {
      window.eventSources.forEach(source => {
        source.close();
      });
    }
    
    // ポーリングの停止
    if (window.pollingIntervals) {
      window.pollingIntervals.forEach(interval => {
        clearInterval(interval);
      });
    }
  }
  
  /**
   * 分析機能無効化
   */
  async disableAnalysis() {
    // 複雑な分析処理の停止
    if (window.IChingTransformationEngine) {
      // 軽量版エンジンへの切り替え
      window.IChingTransformationEngine_Original = window.IChingTransformationEngine;
      window.IChingTransformationEngine = new LightweightAnalysisEngine();
    }
    
    // 重い計算の停止
    if (window.heavyCalculationWorkers) {
      window.heavyCalculationWorkers.forEach(worker => {
        worker.terminate();
      });
    }
  }
  
  /**
   * フォールバック機能有効化
   */
  async enableFallbacks(levelConfig) {
    for (const [feature, config] of this.featureModules.entries()) {
      if (config.fallback && this.disabledFeatures.has(feature)) {
        try {
          await this.enableFallback(feature, config.fallback);
        } catch (error) {
          console.warn(`⚠️ Failed to enable fallback for ${feature}:`, error);
        }
      }
    }
  }
  
  /**
   * 個別フォールバック有効化
   */
  async enableFallback(feature, fallbackType) {
    switch (fallbackType) {
      case 'basic-analysis':
        await this.enableBasicAnalysis();
        break;
        
      case 'simple-results':
        await this.enableSimpleResults();
        break;
        
      case 'text-only':
        await this.enableTextOnlyMode();
        break;
        
      case 'basic-copy':
        await this.enableBasicCopy();
        break;
        
      case 'manual-refresh':
        await this.enableManualRefresh();
        break;
        
      default:
        console.log(`📋 Generic fallback enabled for ${feature}: ${fallbackType}`);
    }
  }
  
  /**
   * 回復試行
   */
  async attemptRecovery(targetLevel = 0) {
    if (this.recoveryInProgress) {
      console.log("🔄 Recovery already in progress, skipping");
      return false;
    }
    
    this.recoveryInProgress = true;
    this.recoveryAttempts++;
    
    try {
      console.log(`🔄 Attempting recovery to level ${targetLevel} (attempt ${this.recoveryAttempts})`);
      
      // ヘルスチェック実行
      const healthStatus = await this.performDetailedHealthCheck();
      
      if (healthStatus.canRecoverTo >= targetLevel) {
        const success = await this.executeRecovery(targetLevel);
        
        if (success) {
          this.recoveryAttempts = 0;
          console.log(`✅ Successfully recovered to level ${targetLevel}`);
          
          // ユーザー通知
          if (this.config.userNotificationEnabled) {
            this.notifyUserOfRecovery(targetLevel);
          }
          
          return true;
        }
      } else {
        console.log(`⚠️ Health check indicates cannot recover to level ${targetLevel} yet`);
      }
      
      return false;
      
    } catch (error) {
      console.error("❌ Recovery attempt failed:", error);
      return false;
    } finally {
      this.recoveryInProgress = false;
    }
  }
  
  /**
   * 回復実行
   */
  async executeRecovery(targetLevel) {
    try {
      // 段階的回復
      const currentLevel = this.currentDegradationLevel;
      
      for (let level = currentLevel - 1; level >= targetLevel; level--) {
        const success = await this.recoverToLevel(level);
        if (!success) {
          console.warn(`⚠️ Recovery stopped at level ${level + 1}`);
          return false;
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("❌ Recovery execution failed:", error);
      return false;
    }
  }
  
  /**
   * 特定レベルへの回復
   */
  async recoverToLevel(level) {
    try {
      const levelConfig = this.degradationLevels.get(level);
      console.log(`⬆️ Recovering to level ${level}: ${levelConfig.name}`);
      
      // 機能の段階的有効化
      const featuresToEnable = this.calculateFeaturesToEnable(level);
      
      for (const feature of featuresToEnable) {
        try {
          await this.enableFeature(feature);
          console.log(`📱 Enabled feature: ${feature}`);
        } catch (featureError) {
          console.warn(`⚠️ Failed to enable feature ${feature}:`, featureError);
          // 個別失敗は続行
        }
      }
      
      // 状態更新
      this.currentDegradationLevel = level;
      this.updateActiveFeatures(levelConfig);
      
      // UI復元
      await this.restoreUIForLevel(level);
      
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to recover to level ${level}:`, error);
      return false;
    }
  }
  
  /**
   * 機能有効化
   */
  async enableFeature(feature) {
    const featureConfig = this.featureModules.get(feature);
    if (!featureConfig) {
      console.warn(`⚠️ Unknown feature: ${feature}`);
      return;
    }
    
    try {
      // 機能固有の有効化処理
      switch (feature) {
        case 'animations':
          await this.enableAnimations();
          break;
          
        case 'visualizations':
          await this.enableVisualizations();
          break;
          
        case 'real-time-updates':
          await this.enableRealTimeUpdates();
          break;
          
        case 'export':
          await this.enableExport();
          break;
          
        case 'sharing':
          await this.enableSharing();
          break;
          
        case 'analysis':
          await this.enableAnalysis();
          break;
          
        default:
          console.log(`📱 Generic enable for feature: ${feature}`);
      }
      
      featureConfig.status = 'active';
      this.activeFeatures.add(feature);
      this.disabledFeatures.delete(feature);
      
    } catch (error) {
      console.error(`❌ Failed to enable feature ${feature}:`, error);
      throw error;
    }
  }
  
  /**
   * ヘルスチェック実行
   */
  async performDetailedHealthCheck() {
    const health = {
      timestamp: Date.now(),
      overallStatus: 'healthy',
      canRecoverTo: 0,
      issues: [],
      systemLoad: await this.measureSystemLoad(),
      memoryUsage: this.measureMemoryUsage(),
      networkStatus: await this.checkNetworkStatus(),
      featureStatus: this.checkFeatureStatus()
    };
    
    // 回復可能レベルの判定
    if (health.systemLoad < 0.7 && health.memoryUsage < 0.8) {
      health.canRecoverTo = 0; // 完全回復可能
    } else if (health.systemLoad < 0.8 && health.memoryUsage < 0.9) {
      health.canRecoverTo = 1; // 軽微な制限まで回復可能
    } else {
      health.canRecoverTo = Math.min(this.currentDegradationLevel, 2);
    }
    
    this.lastHealthCheck = health;
    return health;
  }
  
  /**
   * 自動回復監視開始
   */
  startRecoveryMonitoring() {
    this.healthCheckInterval = setInterval(async () => {
      if (this.currentDegradationLevel > 0 && !this.recoveryInProgress) {
        await this.attemptRecovery(this.currentDegradationLevel - 1);
      }
    }, this.config.recoveryCheckInterval);
    
    console.log("🔄 Recovery monitoring started");
  }
  
  /**
   * 統計情報取得
   */
  getStatistics() {
    return {
      currentLevel: this.currentDegradationLevel,
      levelName: this.degradationLevels.get(this.currentDegradationLevel)?.name,
      activeFeatures: Array.from(this.activeFeatures),
      disabledFeatures: Array.from(this.disabledFeatures),
      degradationHistory: this.degradationHistory.slice(-10),
      recoveryAttempts: this.recoveryAttempts,
      lastHealthCheck: this.lastHealthCheck,
      uptime: Date.now() - this.initTime
    };
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    // 監視停止
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // 縮退スタイルの削除
    const degradationStyles = document.querySelectorAll('[id^="degradation-"]');
    degradationStyles.forEach(style => style.remove());
    
    // フォールバック要素の削除
    const fallbackElements = document.querySelectorAll('.visualization-fallback, .feature-fallback');
    fallbackElements.forEach(element => element.remove());
    
    console.log("🧹 GracefulDegradationManager cleanup completed");
  }
  
  // ユーティリティメソッド（簡略化）
  captureCurrentState() {
    return {
      level: this.currentDegradationLevel,
      activeFeatures: Array.from(this.activeFeatures),
      timestamp: Date.now()
    };
  }
  
  recordDegradation(level, reason, previousState) {
    this.degradationHistory.push({
      level,
      reason,
      previousState,
      timestamp: Date.now()
    });
    
    // 履歴サイズ制限
    if (this.degradationHistory.length > 50) {
      this.degradationHistory = this.degradationHistory.slice(-50);
    }
  }
  
  calculateFeaturesToDisable(targetLevel) {
    const levelConfig = this.degradationLevels.get(targetLevel);
    const allowedFeatures = new Set(levelConfig.features);
    
    return Array.from(this.activeFeatures).filter(feature => 
      !allowedFeatures.has(feature) && feature !== 'all'
    );
  }
  
  calculateFeaturesToEnable(targetLevel) {
    const levelConfig = this.degradationLevels.get(targetLevel);
    const requiredFeatures = new Set(levelConfig.features);
    
    return Array.from(this.featureModules.keys()).filter(feature =>
      requiredFeatures.has(feature) && this.disabledFeatures.has(feature)
    );
  }
  
  updateActiveFeatures(levelConfig) {
    this.activeFeatures.clear();
    levelConfig.features.forEach(feature => this.activeFeatures.add(feature));
  }
  
  emitEvent(eventType, data) {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`❌ Event listener error for ${eventType}:`, error);
      }
    });
  }
  
  // プレースホルダーメソッド（簡略化）
  async measureSystemLoad() { return Math.random() * 0.5; }
  measureMemoryUsage() { return performance.memory ? performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit : 0.5; }
  async checkNetworkStatus() { return navigator.onLine; }
  checkFeatureStatus() { return {}; }
  async adjustUIForDegradationLevel(level) { console.log(`🎨 UI adjusted for level ${level}`); }
  async restoreUIForLevel(level) { console.log(`🎨 UI restored for level ${level}`); }
  async notifyUserOfDegradation(config, reason) { console.log(`📢 User notified of degradation: ${config.name}`); }
  async notifyUserOfRecovery(level) { console.log(`📢 User notified of recovery to level ${level}`); }
  
  // フォールバック機能（簡略化）
  async enableBasicAnalysis() { console.log("📊 Basic analysis enabled"); }
  async enableSimpleResults() { console.log("📋 Simple results enabled"); }
  async enableTextOnlyMode() { console.log("📝 Text-only mode enabled"); }
  async enableBasicCopy() { console.log("📄 Basic copy enabled"); }
  async enableManualRefresh() { console.log("🔄 Manual refresh enabled"); }
  
  // 機能有効化（簡略化）
  async enableAnimations() {
    const style = document.getElementById('degradation-disable-animations');
    if (style) style.remove();
  }
  
  async enableVisualizations() {
    document.querySelectorAll('.visualization-fallback').forEach(el => el.remove());
    document.querySelectorAll('.chart, .graph, .visualization').forEach(el => {
      el.style.display = '';
    });
  }
  
  async enableRealTimeUpdates() { console.log("🔄 Real-time updates enabled"); }
  async enableExport() { console.log("📤 Export enabled"); }
  async enableSharing() { console.log("🔗 Sharing enabled"); }
  async enableAnalysis() {
    if (window.IChingTransformationEngine_Original) {
      window.IChingTransformationEngine = window.IChingTransformationEngine_Original;
    }
  }
}

// 軽量版分析エンジン（フォールバック用）
class LightweightAnalysisEngine {
  calculateComprehensiveTransformation(data) {
    return {
      level1: { accuracy: 30, authenticity: 40, description: "軽量版分析結果" },
      simplified: true
    };
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.GracefulDegradationManager = GracefulDegradationManager;
}

console.log("🛡️ GracefulDegradationManager.js loaded - adaptive resilience ready");