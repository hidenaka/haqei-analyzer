/**
 * app.js - Future Simulator v2.0 Main Application
 * 
 * bunenjin哲学による統合アプリケーション
 * ES6モジュールシステムとイベント駆動アーキテクチャ
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 2.0.0-modular
 */

import { FutureSimulatorCore } from './core/FutureSimulatorCore.js';
import { TextAnalyzer } from './modules/TextAnalyzer.js';
import { ScenarioGenerator } from './modules/ScenarioGenerator.js';
import { UIController } from './modules/UIController.js';

/**
 * FutureSimulatorApp - メインアプリケーションクラス
 */
class FutureSimulatorApp {
  constructor() {
    this.version = "2.0.0-modular";
    this.initialized = false;
    this.modules = new Map();
    this.errorHandler = null;
    
    // 初期化状態管理
    this.initializationSteps = [
      'core',
      'textAnalyzer', 
      'scenarioGenerator',
      'uiController',
      'errorHandling',
      'finalSetup'
    ];
    this.currentStep = 0;
    
    console.log('🚀 Future Simulator App v2.0.0 starting...');
  }

  /**
   * アプリケーション初期化
   */
  async initialize() {
    if (this.initialized) {
      console.log('✅ Future Simulator App already initialized');
      return;
    }

    const startTime = performance.now();

    try {
      // 初期化プロセスの開始
      this.notifyInitializationStart();
      
      // 段階的初期化
      for (const step of this.initializationSteps) {
        await this.executeInitializationStep(step);
        this.currentStep++;
        this.updateInitializationProgress();
      }

      // 初期化完了
      const initTime = performance.now() - startTime;
      this.initialized = true;
      
      this.notifyInitializationComplete(initTime);
      console.log(`✅ Future Simulator App initialized in ${initTime.toFixed(2)}ms`);

    } catch (error) {
      console.error('❌ Future Simulator App initialization failed:', error);
      this.handleInitializationError(error);
      throw error;
    }
  }

  /**
   * 初期化ステップ実行
   */
  async executeInitializationStep(step) {
    console.log(`🔄 Executing initialization step: ${step}`);
    
    switch (step) {
      case 'core':
        await this.initializeCore();
        break;
      case 'textAnalyzer':
        await this.initializeTextAnalyzer();
        break;
      case 'scenarioGenerator':
        await this.initializeScenarioGenerator();
        break;
      case 'uiController':
        await this.initializeUIController();
        break;
      case 'errorHandling':
        await this.initializeErrorHandling();
        break;
      case 'finalSetup':
        await this.executeFinalSetup();
        break;
      default:
        throw new Error(`Unknown initialization step: ${step}`);
    }
  }

  /**
   * コア初期化
   */
  async initializeCore() {
    const core = new FutureSimulatorCore();
    await core.initialize();
    this.modules.set('core', core);
    
    // グローバルアクセス用
    window.FutureSimulatorCore = core;
  }

  /**
   * テキストアナライザー初期化
   */
  async initializeTextAnalyzer() {
    const core = this.modules.get('core');
    const textAnalyzer = new TextAnalyzer(core);
    this.modules.set('textAnalyzer', textAnalyzer);
  }

  /**
   * シナリオジェネレーター初期化
   */
  async initializeScenarioGenerator() {
    const core = this.modules.get('core');
    const scenarioGenerator = new ScenarioGenerator(core);
    this.modules.set('scenarioGenerator', scenarioGenerator);
  }

  /**
   * UIコントローラー初期化
   */
  async initializeUIController() {
    const core = this.modules.get('core');
    const uiController = new UIController(core);
    await uiController.initialize();
    this.modules.set('uiController', uiController);
    
    // グローバルアクセス用
    window.FutureSimulatorUI = uiController;
  }

  /**
   * エラーハンドリング初期化
   */
  async initializeErrorHandling() {
    this.errorHandler = new ErrorHandler(this.modules);
    
    // グローバルエラーハンドラーの設定
    window.addEventListener('error', this.errorHandler.handleGlobalError.bind(this.errorHandler));
    window.addEventListener('unhandledrejection', this.errorHandler.handleUnhandledRejection.bind(this.errorHandler));
    
    console.log('🛡️ Error handling system activated');
  }

  /**
   * 最終セットアップ
   */
  async executeFinalSetup() {
    // モジュール間の連携設定
    this.setupModuleIntegration();
    
    // パフォーマンス監視開始
    this.startPerformanceMonitoring();
    
    // 自動保存設定
    this.setupAutoSave();
    
    // デバッグ機能設定
    this.setupDebugging();
    
    console.log('🔧 Final setup completed');
  }

  /**
   * モジュール統合設定
   */
  setupModuleIntegration() {
    const core = this.modules.get('core');
    const textAnalyzer = this.modules.get('textAnalyzer');
    const scenarioGenerator = this.modules.get('scenarioGenerator');
    const uiController = this.modules.get('uiController');

    // 分析パイプラインの設定
    core.addEventListener('analysis:start', async (event) => {
      try {
        const { text } = event.detail;
        
        // 高度分析実行
        const analysis = await textAnalyzer.analyzeAdvanced(text);
        
        // シナリオ生成
        const scenarios = await scenarioGenerator.generateAdvancedScenarios(analysis);
        
        // 結果通知
        core.dispatchEvent('analysis:complete', {
          detail: {
            result: {
              analysis,
              scenarios: scenarios.scenarios,
              metadata: scenarios.metadata
            }
          }
        });
        
      } catch (error) {
        core.dispatchEvent('analysis:error', { detail: { error } });
      }
    });

    console.log('🔗 Module integration configured');
  }

  /**
   * パフォーマンス監視開始
   */
  startPerformanceMonitoring() {
    this.performanceMonitor = new PerformanceMonitor();
    this.performanceMonitor.start();
    
    // 定期的なメトリクス収集
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 30000); // 30秒ごと
  }

  /**
   * 自動保存設定
   */
  setupAutoSave() {
    // 5分ごとに状態を自動保存
    setInterval(() => {
      this.saveApplicationState();
    }, 300000); // 5分
    
    // ページ離脱時の保存
    window.addEventListener('beforeunload', () => {
      this.saveApplicationState();
    });
  }

  /**
   * デバッグ機能設定
   */
  setupDebugging() {
    // 開発環境でのデバッグ機能
    if (this.isDevelopmentMode()) {
      window.FutureSimulatorApp = this;
      window.FutureSimulatorDebug = {
        getModules: () => Array.from(this.modules.keys()),
        getModule: (name) => this.modules.get(name),
        getPerformanceMetrics: () => this.getPerformanceMetrics(),
        getSystemStatus: () => this.getSystemStatus()
      };
      
      console.log('🐛 Debug mode enabled');
    }
  }

  /**
   * 初期化通知
   */
  notifyInitializationStart() {
    // プログレスバーの表示
    this.showInitializationProgress(0);
    
    // ローディング画面の表示
    this.showLoadingScreen();
  }

  notifyInitializationComplete(initTime) {
    // プログレスバーの完了
    this.showInitializationProgress(100);
    
    // ローディング画面の非表示
    this.hideLoadingScreen();
    
    // 成功通知
    this.showSuccessNotification(`システムが正常に起動しました (${initTime.toFixed(0)}ms)`);
  }

  /**
   * 初期化プログレス更新
   */
  updateInitializationProgress() {
    const progress = (this.currentStep / this.initializationSteps.length) * 100;
    this.showInitializationProgress(progress);
  }

  showInitializationProgress(percentage) {
    const progressBar = document.querySelector('#initProgress');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    const progressText = document.querySelector('#initProgressText');
    if (progressText) {
      const currentStepName = this.initializationSteps[this.currentStep - 1] || 'starting';
      progressText.textContent = `${currentStepName}... ${Math.round(percentage)}%`;
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.querySelector('#loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.querySelector('#loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  showSuccessNotification(message) {
    // 成功通知の表示ロジック
    console.log(`✅ ${message}`);
    
    // UI要素があれば表示
    const notification = document.querySelector('#successNotification');
    if (notification) {
      notification.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }

  /**
   * エラーハンドリング
   */
  handleInitializationError(error) {
    console.error('❌ Initialization error:', error);
    
    // エラー画面の表示
    this.showErrorScreen(error);
    
    // エラー報告
    this.reportError(error, 'initialization');
  }

  showErrorScreen(error) {
    const errorScreen = document.querySelector('#errorScreen');
    if (errorScreen) {
      const errorMessage = errorScreen.querySelector('#errorMessage');
      if (errorMessage) {
        errorMessage.textContent = error.message || 'システムの初期化に失敗しました';
      }
      errorScreen.style.display = 'flex';
    }
  }

  reportError(error, context) {
    // エラー情報の収集と報告
    const errorReport = {
      timestamp: Date.now(),
      context,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      version: this.version
    };
    
    // ローカルストレージに保存
    try {
      const existingReports = JSON.parse(localStorage.getItem('futureSimulator:errorReports') || '[]');
      existingReports.push(errorReport);
      
      // 最新10件のみ保持
      if (existingReports.length > 10) {
        existingReports.splice(0, existingReports.length - 10);
      }
      
      localStorage.setItem('futureSimulator:errorReports', JSON.stringify(existingReports));
    } catch (e) {
      console.warn('⚠️ Failed to save error report:', e);
    }
  }

  /**
   * パフォーマンスメトリクス収集
   */
  collectPerformanceMetrics() {
    const metrics = {
      timestamp: Date.now(),
      memoryUsage: this.getMemoryUsage(),
      modulePerformance: this.getModulePerformance(),
      userInteractions: this.getUserInteractionMetrics()
    };
    
    // メトリクスの保存
    this.savePerformanceMetrics(metrics);
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  getModulePerformance() {
    const performance = {};
    
    this.modules.forEach((module, name) => {
      if (module.getPerformanceMetrics) {
        performance[name] = module.getPerformanceMetrics();
      }
    });
    
    return performance;
  }

  getUserInteractionMetrics() {
    // UI インタラクションのメトリクス
    const uiController = this.modules.get('uiController');
    if (uiController && uiController.getInteractionMetrics) {
      return uiController.getInteractionMetrics();
    }
    return {};
  }

  savePerformanceMetrics(metrics) {
    try {
      const key = 'futureSimulator:performanceMetrics';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(metrics);
      
      // 最新50件のみ保持
      if (existing.length > 50) {
        existing.splice(0, existing.length - 50);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.warn('⚠️ Failed to save performance metrics:', error);
    }
  }

  /**
   * アプリケーション状態保存
   */
  saveApplicationState() {
    try {
      const state = {
        version: this.version,
        timestamp: Date.now(),
        modules: this.getModuleStates(),
        performance: this.getPerformanceMetrics()
      };
      
      localStorage.setItem('futureSimulator:appState', JSON.stringify(state));
      console.log('💾 Application state saved');
      
    } catch (error) {
      console.warn('⚠️ Failed to save application state:', error);
    }
  }

  getModuleStates() {
    const states = {};
    
    this.modules.forEach((module, name) => {
      if (module.getState) {
        states[name] = module.getState();
      }
    });
    
    return states;
  }

  /**
   * システム状態取得
   */
  getSystemStatus() {
    return {
      version: this.version,
      initialized: this.initialized,
      modules: Array.from(this.modules.keys()),
      performance: this.getPerformanceMetrics(),
      errors: this.getErrorHistory()
    };
  }

  getPerformanceMetrics() {
    const core = this.modules.get('core');
    return core ? core.getPerformanceMetrics() : {};
  }

  getErrorHistory() {
    try {
      return JSON.parse(localStorage.getItem('futureSimulator:errorReports') || '[]');
    } catch (error) {
      return [];
    }
  }

  /**
   * 開発モード判定
   */
  isDevelopmentMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.search.includes('debug=true');
  }

  /**
   * クリーンアップ
   */
  dispose() {
    // モジュールのクリーンアップ
    this.modules.forEach((module, name) => {
      if (module.dispose) {
        module.dispose();
      }
    });
    this.modules.clear();
    
    // パフォーマンス監視停止
    if (this.performanceMonitor) {
      this.performanceMonitor.stop();
    }
    
    // 状態保存
    this.saveApplicationState();
    
    console.log('🧹 Future Simulator App disposed');
  }
}

/**
 * エラーハンドラークラス
 */
class ErrorHandler {
  constructor(modules) {
    this.modules = modules;
    this.errorCount = 0;
    this.maxErrors = 10;
  }

  handleGlobalError(event) {
    this.errorCount++;
    
    console.error('Global error caught:', event.error);
    
    if (this.errorCount >= this.maxErrors) {
      this.showCriticalErrorMessage();
      return;
    }
    
    // UI要素にエラーを表示
    const uiController = this.modules.get('uiController');
    if (uiController) {
      uiController.showError('予期しないエラーが発生しました。');
    }
  }

  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // プロミス拒否の処理
    const uiController = this.modules.get('uiController');
    if (uiController) {
      uiController.showError('処理中にエラーが発生しました。');
    }
  }

  showCriticalErrorMessage() {
    const message = 'システムで重大なエラーが発生しました。ページを再読み込みしてください。';
    alert(message);
    console.error('Critical error threshold reached');
  }
}

/**
 * パフォーマンス監視クラス
 */
class PerformanceMonitor {
  constructor() {
    this.isRunning = false;
    this.metrics = [];
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.collectMetrics();
    console.log('📊 Performance monitoring started');
  }

  stop() {
    this.isRunning = false;
    console.log('📊 Performance monitoring stopped');
  }

  collectMetrics() {
    if (!this.isRunning) return;
    
    const metrics = {
      timestamp: Date.now(),
      navigation: performance.getEntriesByType('navigation')[0],
      memory: performance.memory,
      timing: performance.timing
    };
    
    this.metrics.push(metrics);
    
    // 1秒後に再実行
    setTimeout(() => this.collectMetrics(), 1000);
  }

  getMetrics() {
    return this.metrics;
  }
}

// アプリケーションインスタンスの作成とグローバル公開
const futureSimulatorApp = new FutureSimulatorApp();

// DOM読み込み完了後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    futureSimulatorApp.initialize().catch(console.error);
  });
} else {
  // すでに読み込み完了している場合
  futureSimulatorApp.initialize().catch(console.error);
}

// グローバルアクセス用
window.FutureSimulatorApp = futureSimulatorApp;

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FutureSimulatorApp, futureSimulatorApp };
}

// エクスポート
export { FutureSimulatorApp, futureSimulatorApp };
export default futureSimulatorApp;