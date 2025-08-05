/**
 * HAQEIアナライザー 構造化ログ・監視システム
 * StructuredLogger.js
 * 
 * bunenjin哲学に基づく包括的ログ管理・メトリクス収集・デバッグ支援システム
 * 易経の記録原理とTriple OS Architectureを活用した知的ログシステム
 * 
 * 設計思想:
 * - ログから学ぶ（経験の蓄積と活用）
 * - 構造化された知識ベース構築
 * - 分人別ログレベル管理
 * - パフォーマンス影響最小化
 * - プライバシー配慮
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0-structured-intelligence
 * Created: 2025-08-05
 */

class StructuredLogger {
  constructor(options = {}) {
    this.version = "1.0.0-structured-intelligence";
    this.philosophyAlignment = "bunenjin-knowledge-harmony";
    
    // 設定
    this.config = {
      logLevel: options.logLevel || 'info', // debug, info, warn, error, critical
      maxLogEntries: options.maxLogEntries || 1000,
      maxMemoryUsage: options.maxMemoryUsage || 50 * 1024 * 1024, // 50MB
      enablePersistence: options.enablePersistence !== false,
      enableMetrics: options.enableMetrics !== false,
      enableRemoteLogging: options.enableRemoteLogging || false,
      enablePerformanceLogging: options.enablePerformanceLogging !== false,
      enableUserActionLogging: options.enableUserActionLogging !== false,
      enableErrorAggregation: options.enableErrorAggregation !== false,
      enablePrivacyMode: options.enablePrivacyMode !== false,
      bufferSize: options.bufferSize || 100,
      flushInterval: options.flushInterval || 30000, // 30秒
      compressionEnabled: options.compressionEnabled || false,
      ...options
    };
    
    // ログレベル定義
    this.logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      critical: 4
    };
    
    // ログストレージ
    this.logs = [];
    this.logBuffer = [];
    this.metrics = new Map();
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      bunenjinProfile: null
    };
    
    // メトリクス収集
    this.performanceMetrics = {
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
      totalLogs: 0,
      sessionErrors: new Set(),
      memoryUsage: 0,
      averageLogSize: 0,
      peakMemoryUsage: 0
    };
    
    // ログカテゴリ
    this.categories = {
      SYSTEM: 'system',
      ERROR: 'error',
      PERFORMANCE: 'performance',
      USER_ACTION: 'user-action',
      ICHING: 'iching',
      TRIPLE_OS: 'triple-os',
      BUNENJIN: 'bunenjin',
      SECURITY: 'security',
      NETWORK: 'network',
      UI: 'ui'
    };
    
    // ログエンリッチメント
    this.enrichmentProviders = new Map();
    this.setupEnrichmentProviders();
    
    // フィルター
    this.filters = new Map();
    this.sensitiveDataPatterns = [
      /password/i,
      /token/i,
      /api[_-]?key/i,
      /secret/i,
      /credential/i
    ];
    
    // バッファ管理
    this.flushTimer = null;
    this.compressionWorker = null;
    
    this.initialize();
    
    console.log(`📊 StructuredLogger v${this.version} initialized`);
  }
  
  /**
   * システム初期化
   */
  async initialize() {
    try {
      // 既存ログの復元
      if (this.config.enablePersistence) {
        await this.restoreLogsFromStorage();
      }
      
      // バッファフラッシュの開始
      this.startBufferFlush();
      
      // パフォーマンス監視開始
      if (this.config.enablePerformanceLogging) {
        this.startPerformanceMonitoring();
      }
      
      // メモリ監視開始
      this.startMemoryMonitoring();
      
      // 初期ログ
      this.info('StructuredLogger initialized', { 
        category: this.categories.SYSTEM,
        config: this.config 
      });
      
      console.log("✅ StructuredLogger initialized");
      
    } catch (error) {
      console.error("❌ StructuredLogger initialization failed:", error);
    }
  }
  
  /**
   * デバッグログ
   */
  debug(message, data = {}, context = {}) {
    return this.log('debug', message, data, context);
  }
  
  /**
   * 情報ログ
   */
  info(message, data = {}, context = {}) {
    return this.log('info', message, data, context);
  }
  
  /**
   * 警告ログ
   */
  warn(message, data = {}, context = {}) {
    return this.log('warn', message, data, context);
  }
  
  /**
   * エラーログ
   */
  error(message, data = {}, context = {}) {
    return this.log('error', message, data, context);
  }
  
  /**
   * 重要エラーログ
   */
  critical(message, data = {}, context = {}) {
    return this.log('critical', message, data, context);
  }
  
  /**
   * メインログメソッド
   */
  log(level, message, data = {}, context = {}) {
    try {
      // ログレベルチェック
      if (this.logLevels[level] < this.logLevels[this.config.logLevel]) {
        return null;
      }
      
      // ログエントリ作成
      const logEntry = this.createLogEntry(level, message, data, context);
      
      // フィルタリング
      if (!this.passesFilters(logEntry)) {
        return null;
      }
      
      // プライバシー保護
      if (this.config.enablePrivacyMode) {
        this.sanitizeLogEntry(logEntry);
      }
      
      // エンリッチメント
      this.enrichLogEntry(logEntry);
      
      // バッファに追加
      this.addToBuffer(logEntry);
      
      // メトリクス更新
      this.updateMetrics(logEntry);
      
      // 重要ログの即座フラッシュ
      if (level === 'critical' || level === 'error') {
        this.flush();
      }
      
      // コンソール出力
      this.outputToConsole(logEntry);
      
      return logEntry.id;
      
    } catch (error) {
      // ログ機能自体のエラーは最小限の処理
      console.error('StructuredLogger internal error:', error);
      return null;
    }
  }
  
  /**
   * ログエントリ作成
   */
  createLogEntry(level, message, data, context) {
    const entry = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      iso8601: new Date().toISOString(),
      level: level,
      message: message,
      data: { ...data },
      context: { ...context },
      
      // セッション情報
      sessionId: this.sessionData.sessionId,
      
      // カテゴリ
      category: data.category || context.category || this.categories.SYSTEM,
      
      // ソース情報
      source: this.getSourceInfo(),
      
      // パフォーマンス情報
      performance: {
        timestamp: performance.now(),
        memoryUsage: this.getCurrentMemoryUsage()
      },
      
      // bunenjin情報
      bunenjin: {
        activePersona: this.getBunenjinActivePersona(),
        philosophyAlignment: this.philosophyAlignment
      },
      
      // サイズ情報
      size: 0 // 後で計算
    };
    
    // サイズ計算
    entry.size = this.calculateLogEntrySize(entry);
    
    return entry;
  }
  
  /**
   * ログエンリッチメント
   */
  enrichLogEntry(logEntry) {
    // URL情報
    logEntry.url = {
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    };
    
    // ブラウザ情報
    logEntry.browser = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      onLine: navigator.onLine
    };
    
    // 画面情報
    logEntry.screen = {
      width: screen.width,
      height: screen.height,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    // エラー情報の追加エンリッチメント
    if (logEntry.level === 'error' || logEntry.level === 'critical') {
      this.enrichErrorLogEntry(logEntry);
    }
    
    // カテゴリ別エンリッチメント
    const enricher = this.enrichmentProviders.get(logEntry.category);
    if (enricher) {
      enricher(logEntry);
    }
  }
  
  /**
   * エラーログエンリッチメント
   */
  enrichErrorLogEntry(logEntry) {
    // スタックトレース分析
    if (logEntry.data.error && logEntry.data.error.stack) {
      logEntry.stackTrace = this.parseStackTrace(logEntry.data.error.stack);
    }
    
    // エラー発生コンテキスト
    logEntry.errorContext = {
      userActions: this.getRecentUserActions(),
      systemState: this.getSystemState(),
      recentLogs: this.getRecentLogs(5)
    };
    
    // エラーパターン分析
    logEntry.errorPattern = this.analyzeErrorPattern(logEntry);
  }
  
  /**
   * ユーザーアクションログ
   */
  logUserAction(action, target, data = {}) {
    return this.info(`User action: ${action}`, {
      category: this.categories.USER_ACTION,
      action: action,
      target: target,
      ...data
    }, {
      userInitiated: true
    });
  }
  
  /**
   * パフォーマンスログ
   */
  logPerformance(operation, duration, data = {}) {
    return this.info(`Performance: ${operation}`, {
      category: this.categories.PERFORMANCE,
      operation: operation,
      duration: duration,
      ...data
    });
  }
  
  /**
   * 易経関連ログ
   */
  logIChingEvent(event, hexagram, data = {}) {
    return this.info(`I Ching: ${event}`, {
      category: this.categories.ICHING,
      event: event,
      hexagram: hexagram,
      ...data
    });
  }
  
  /**
   * Triple OS関連ログ
   */
  logTripleOSEvent(os, event, data = {}) {
    return this.info(`Triple OS [${os}]: ${event}`, {
      category: this.categories.TRIPLE_OS,
      os: os,
      event: event,
      ...data
    });
  }
  
  /**
   * セキュリティログ
   */
  logSecurityEvent(event, severity, data = {}) {
    const level = severity === 'high' ? 'critical' : 
                  severity === 'medium' ? 'error' : 'warn';
    
    return this.log(level, `Security: ${event}`, {
      category: this.categories.SECURITY,
      event: event,
      severity: severity,
      ...data
    });
  }
  
  /**
   * バッファフラッシュ
   */
  flush() {
    if (this.logBuffer.length === 0) return;
    
    try {
      // バッファからメインストレージへ移動
      this.logs.push(...this.logBuffer);
      this.logBuffer = [];
      
      // サイズ制限チェック
      this.enforceLogLimits();
      
      // 永続化
      if (this.config.enablePersistence) {
        this.persistLogs();
      }
      
      // リモート送信
      if (this.config.enableRemoteLogging) {
        this.sendToRemote();
      }
      
    } catch (error) {
      console.error('Log flush failed:', error);
    }
  }
  
  /**
   * ログ検索
   */
  search(query, options = {}) {
    const {
      level = null,
      category = null,
      startTime = null,
      endTime = null,
      limit = 100,
      includeBuffer = true
    } = options;
    
    let allLogs = [...this.logs];
    if (includeBuffer) {
      allLogs.push(...this.logBuffer);
    }
    
    let results = allLogs.filter(log => {
      // レベルフィルター
      if (level && log.level !== level) return false;
      
      // カテゴリフィルター
      if (category && log.category !== category) return false;
      
      // 時間範囲フィルター
      if (startTime && log.timestamp < startTime) return false;
      if (endTime && log.timestamp > endTime) return false;
      
      // テキスト検索
      if (query) {
        const searchText = JSON.stringify(log).toLowerCase();
        return searchText.includes(query.toLowerCase());
      }
      
      return true;
    });
    
    // 時間順ソート（新しい順）
    results.sort((a, b) => b.timestamp - a.timestamp);
    
    // 制限適用
    if (limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  }
  
  /**
   * エラー集約
   */
  aggregateErrors(timeWindow = 3600000) { // 1時間
    const now = Date.now();
    const cutoff = now - timeWindow;
    
    const recentErrors = this.search('', {
      level: 'error',
      startTime: cutoff,
      limit: null
    });
    
    // エラーをメッセージ別にグループ化
    const errorGroups = new Map();
    
    recentErrors.forEach(log => {
      const key = log.message;
      if (!errorGroups.has(key)) {
        errorGroups.set(key, {
          message: log.message,
          count: 0,
          firstOccurrence: log.timestamp,
          lastOccurrence: log.timestamp,
          occurrences: []
        });
      }
      
      const group = errorGroups.get(key);
      group.count++;
      group.lastOccurrence = Math.max(group.lastOccurrence, log.timestamp);
      group.firstOccurrence = Math.min(group.firstOccurrence, log.timestamp);
      group.occurrences.push(log);
    });
    
    // 発生頻度順にソート
    return Array.from(errorGroups.values())
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * メトリクス生成
   */
  generateMetrics() {
    const now = Date.now();
    const sessionDuration = now - this.sessionData.startTime;
    
    // 基本メトリクス
    const basicMetrics = {
      session: {
        id: this.sessionData.sessionId,
        duration: sessionDuration,
        startTime: this.sessionData.startTime
      },
      logs: {
        total: this.performanceMetrics.totalLogs,
        byLevel: {
          debug: this.performanceMetrics.debugCount,
          info: this.performanceMetrics.infoCount,
          warn: this.performanceMetrics.warningCount,
          error: this.performanceMetrics.errorCount,
          critical: this.performanceMetrics.criticalCount || 0
        },
        byCategory: this.getLogsByCategory(),
        averageSize: this.performanceMetrics.averageLogSize
      },
      memory: {
        current: this.performanceMetrics.memoryUsage,
        peak: this.performanceMetrics.peakMemoryUsage,
        logStorageSize: this.calculateLogStorageSize()
      },
      performance: {
        averageLogTime: this.calculateAverageLogTime(),
        flushFrequency: this.calculateFlushFrequency()
      }
    };
    
    // エラー分析
    const errorAnalysis = this.analyzeErrors();
    
    // ユーザー行動分析
    const userBehavior = this.analyzeUserBehavior();
    
    return {
      timestamp: now,
      basic: basicMetrics,
      errors: errorAnalysis,
      userBehavior: userBehavior,
      systemHealth: this.assessSystemHealth()
    };
  }
  
  /**
   * ログエクスポート
   */
  exportLogs(format = 'json', options = {}) {
    const {
      level = null,
      category = null,
      startTime = null,
      endTime = null,
      includeMetrics = false
    } = options;
    
    // ログのフィルタリング
    const filteredLogs = this.search('', {
      level,
      category,
      startTime,
      endTime,
      limit: null
    });
    
    let exportData = {
      metadata: {
        exportTime: new Date().toISOString(),
        totalEntries: filteredLogs.length,
        sessionId: this.sessionData.sessionId,
        version: this.version
      },
      logs: filteredLogs
    };
    
    if (includeMetrics) {
      exportData.metrics = this.generateMetrics();
    }
    
    // フォーマット変換
    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
        
      case 'csv':
        return this.convertToCSV(filteredLogs);
        
      case 'text':
        return this.convertToText(filteredLogs);
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
  
  /**
   * CSV変換
   */
  convertToCSV(logs) {
    if (logs.length === 0) return '';
    
    const headers = ['timestamp', 'level', 'category', 'message', 'data'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.level,
      log.category,
      log.message,
      JSON.stringify(log.data)
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
  
  /**
   * テキスト変換
   */
  convertToText(logs) {
    return logs.map(log => {
      const timestamp = new Date(log.timestamp).toISOString();
      const level = log.level.toUpperCase().padEnd(8);
      const category = log.category.padEnd(12);
      const message = log.message;
      
      let line = `${timestamp} [${level}] [${category}] ${message}`;
      
      if (Object.keys(log.data).length > 0) {
        line += '\n    Data: ' + JSON.stringify(log.data, null, 2).replace(/\n/g, '\n    ');
      }
      
      return line;
    }).join('\n\n');
  }
  
  /**
   * システム健全性評価
   */
  assessSystemHealth() {
    const recentErrors = this.search('', {
      level: 'error',
      startTime: Date.now() - 300000, // 5分
      limit: null
    });
    
    const recentCritical = this.search('', {
      level: 'critical',
      startTime: Date.now() - 300000,
      limit: null
    });
    
    let score = 100;
    let status = 'healthy';
    const issues = [];
    
    // エラー頻度チェック
    if (recentCritical.length > 0) {
      score -= 50;
      status = 'critical';
      issues.push(`${recentCritical.length} critical errors in last 5 minutes`);
    } else if (recentErrors.length > 10) {
      score -= 30;
      status = 'warning';
      issues.push(`${recentErrors.length} errors in last 5 minutes`);
    } else if (recentErrors.length > 5) {
      score -= 15;
      status = 'degraded';
      issues.push(`${recentErrors.length} errors in last 5 minutes`);
    }
    
    // メモリ使用量チェック
    if (this.performanceMetrics.memoryUsage > this.config.maxMemoryUsage * 0.9) {
      score -= 20;
      issues.push('High memory usage');
    }
    
    // ログサイズチェック
    if (this.logs.length > this.config.maxLogEntries * 0.9) {
      score -= 10;
      issues.push('Log storage near capacity');
    }
    
    return {
      score: Math.max(0, score),
      status: status,
      issues: issues,
      recommendations: this.generateHealthRecommendations(issues)
    };
  }
  
  /**
   * メモリ監視開始
   */
  startMemoryMonitoring() {
    setInterval(() => {
      this.updateMemoryMetrics();
    }, 10000); // 10秒間隔
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    // フラッシュタイマー停止
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    // 最終フラッシュ
    this.flush();
    
    // ワーカー終了
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
    }
    
    console.log("🧹 StructuredLogger cleanup completed");
  }
  
  // ユーティリティメソッド
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getCurrentMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }
  
  calculateLogEntrySize(entry) {
    return JSON.stringify(entry).length;
  }
  
  getSourceInfo() {
    const stack = new Error().stack;
    const lines = stack.split('\n');
    
    // ログメソッド呼び出し元を特定
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes('StructuredLogger')) {
        const match = line.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);
        if (match) {
          return {
            function: match[1],
            file: match[2],
            line: parseInt(match[3]),
            column: parseInt(match[4])
          };
        }
      }
    }
    
    return { function: 'unknown', file: 'unknown', line: 0, column: 0 };
  }
  
  getBunenjinActivePersona() {
    if (window.bunenjinPersona) {
      return window.bunenjinPersona.getActivePersona();
    }
    return 'unknown';
  }
  
  // プレースホルダーメソッド（簡略化）
  setupEnrichmentProviders() {
    this.enrichmentProviders.set(this.categories.ICHING, (log) => {
      log.iching = { enhanced: true };
    });
  }
  
  passesFilters(logEntry) { return true; }
  sanitizeLogEntry(logEntry) { /* プライバシー保護処理 */ }
  addToBuffer(logEntry) { this.logBuffer.push(logEntry); }
  updateMetrics(logEntry) { 
    this.performanceMetrics.totalLogs++;
    this.performanceMetrics[`${logEntry.level}Count`]++;
  }
  outputToConsole(logEntry) {
    const method = logEntry.level === 'critical' ? 'error' : logEntry.level;
    if (console[method]) {
      console[method](`[${logEntry.category}] ${logEntry.message}`, logEntry.data);
    }
  }
  
  startBufferFlush() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }
  
  enforceLogLimits() {
    if (this.logs.length > this.config.maxLogEntries) {
      this.logs = this.logs.slice(-this.config.maxLogEntries);
    }
  }
  
  async restoreLogsFromStorage() { /* ストレージからの復元 */ }
  persistLogs() { /* ストレージへの保存 */ }
  sendToRemote() { /* リモートサーバーへの送信 */ }
  startPerformanceMonitoring() { /* パフォーマンス監視 */ }
  parseStackTrace(stack) { return { parsed: true }; }
  getRecentUserActions() { return []; }
  getSystemState() { return {}; }
  getRecentLogs(count) { return this.logs.slice(-count); }
  analyzeErrorPattern(logEntry) { return { pattern: 'unknown' }; }
  getLogsByCategory() { return {}; }
  calculateLogStorageSize() { return 0; }
  calculateAverageLogTime() { return 0; }
  calculateFlushFrequency() { return 0; }
  analyzeErrors() { return {}; }
  analyzeUserBehavior() { return {}; }
  updateMemoryMetrics() { 
    this.performanceMetrics.memoryUsage = this.getCurrentMemoryUsage();
    this.performanceMetrics.peakMemoryUsage = Math.max(
      this.performanceMetrics.peakMemoryUsage, 
      this.performanceMetrics.memoryUsage
    );
  }
  generateHealthRecommendations(issues) { return []; }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.StructuredLogger = StructuredLogger;
}

console.log("📊 StructuredLogger.js loaded - intelligent logging ready");