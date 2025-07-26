/**
 * PerformanceMonitor - パフォーマンス監視システム
 * スクリプト読み込み時間、初期化プロセス、メモリ使用量を監視し、統計情報を提供
 */
class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      enableScriptTiming: true,
      enableMemoryMonitoring: true,
      enableDetailedLogging: true,
      reportingInterval: 1000, // 1秒間隔でレポート
      maxHistorySize: 100,
      ...options,
    };

    // パフォーマンス測定データ
    this.metrics = {
      scriptLoadTimes: new Map(),
      initializationPhases: new Map(),
      memorySnapshots: [],
      performanceMarks: new Map(),
      totalLoadTime: 0,
      startTime: performance.now(),
      endTime: null,
    };

    // 統計情報
    this.statistics = {
      averageScriptLoadTime: 0,
      slowestScript: null,
      fastestScript: null,
      totalScriptsLoaded: 0,
      memoryUsageTrend: "stable",
      performanceRating: "unknown",
    };

    // 監視状態
    this.isMonitoring = false;
    this.monitoringInterval = null;

    // イベントリスナー
    this.eventListeners = new Map();

    this.initialize();
  }

  /**
   * パフォーマンス監視システムの初期化
   */
  initialize() {
    console.log(
      "🔧 [PerformanceMonitor] パフォーマンス監視システムを初期化中..."
    );

    // Performance API の利用可能性チェック
    if (!window.performance) {
      console.warn("⚠️ [PerformanceMonitor] Performance API が利用できません");
      return;
    }

    // 初期メモリスナップショット
    this.takeMemorySnapshot("initialization");

    // パフォーマンスマークの設定
    this.markPerformance("monitor_start");

    // スクリプト読み込み監視の開始
    this.startScriptLoadMonitoring();

    // メモリ監視の開始
    if (this.options.enableMemoryMonitoring) {
      this.startMemoryMonitoring();
    }

    console.log(
      "✅ [PerformanceMonitor] パフォーマンス監視システムが初期化されました"
    );
  }

  /**
   * スクリプト読み込み時間の測定開始
   * @param {string} scriptName - スクリプト名
   */
  startScriptTiming(scriptName) {
    if (!this.options.enableScriptTiming) return;

    const startTime = performance.now();
    this.metrics.scriptLoadTimes.set(scriptName, {
      startTime,
      endTime: null,
      duration: null,
      status: "loading",
    });

    this.markPerformance(`script_start_${scriptName}`);

    if (this.options.enableDetailedLogging) {
      console.log(
        `⏱️ [PerformanceMonitor] スクリプト読み込み開始: ${scriptName}`
      );
    }
  }

  /**
   * スクリプト読み込み時間の測定終了
   * @param {string} scriptName - スクリプト名
   * @param {boolean} success - 読み込み成功フラグ
   */
  endScriptTiming(scriptName, success = true) {
    if (!this.options.enableScriptTiming) return;

    const scriptTiming = this.metrics.scriptLoadTimes.get(scriptName);
    if (!scriptTiming) {
      console.warn(
        `⚠️ [PerformanceMonitor] スクリプトタイミングが見つかりません: ${scriptName}`
      );
      return;
    }

    const endTime = performance.now();
    const duration = endTime - scriptTiming.startTime;

    scriptTiming.endTime = endTime;
    scriptTiming.duration = duration;
    scriptTiming.status = success ? "loaded" : "failed";

    this.markPerformance(`script_end_${scriptName}`);

    if (this.options.enableDetailedLogging) {
      console.log(
        `⏱️ [PerformanceMonitor] スクリプト読み込み完了: ${scriptName} (${duration.toFixed(
          2
        )}ms)`
      );
    }

    // 統計情報の更新
    this.updateScriptStatistics();
  }

  /**
   * 初期化フェーズの測定開始
   * @param {string} phaseName - フェーズ名
   */
  startInitializationPhase(phaseName) {
    const startTime = performance.now();
    this.metrics.initializationPhases.set(phaseName, {
      startTime,
      endTime: null,
      duration: null,
      status: "running",
    });

    this.markPerformance(`phase_start_${phaseName}`);

    if (this.options.enableDetailedLogging) {
      console.log(`🚀 [PerformanceMonitor] 初期化フェーズ開始: ${phaseName}`);
    }
  }

  /**
   * 初期化フェーズの測定終了
   * @param {string} phaseName - フェーズ名
   * @param {boolean} success - 成功フラグ
   */
  endInitializationPhase(phaseName, success = true) {
    const phaseData = this.metrics.initializationPhases.get(phaseName);
    if (!phaseData) {
      console.warn(
        `⚠️ [PerformanceMonitor] 初期化フェーズが見つかりません: ${phaseName}`
      );
      return;
    }

    const endTime = performance.now();
    const duration = endTime - phaseData.startTime;

    phaseData.endTime = endTime;
    phaseData.duration = duration;
    phaseData.status = success ? "completed" : "failed";

    this.markPerformance(`phase_end_${phaseName}`);

    if (this.options.enableDetailedLogging) {
      console.log(
        `🚀 [PerformanceMonitor] 初期化フェーズ完了: ${phaseName} (${duration.toFixed(
          2
        )}ms)`
      );
    }
  }

  /**
   * メモリスナップショットの取得
   * @param {string} label - スナップショットのラベル
   */
  takeMemorySnapshot(label) {
    if (!performance.memory) {
      return null;
    }

    const snapshot = {
      timestamp: performance.now(),
      label,
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
    };

    this.metrics.memorySnapshots.push(snapshot);

    // 履歴サイズの制限
    if (this.metrics.memorySnapshots.length > this.options.maxHistorySize) {
      this.metrics.memorySnapshots.shift();
    }

    if (this.options.enableDetailedLogging) {
      console.log(
        `💾 [PerformanceMonitor] メモリスナップショット: ${label} - ${snapshot.usedMB}MB`
      );
    }

    return snapshot;
  }

  /**
   * パフォーマンスマークの設定
   * @param {string} markName - マーク名
   */
  markPerformance(markName) {
    const timestamp = performance.now();
    this.metrics.performanceMarks.set(markName, timestamp);

    if (window.performance.mark) {
      performance.mark(markName);
    }

    if (this.options.enableDetailedLogging) {
      console.log(
        `📍 [PerformanceMonitor] パフォーマンスマーク: ${markName} (${timestamp.toFixed(
          2
        )}ms)`
      );
    }
  }

  /**
   * スクリプト読み込み監視の開始
   */
  startScriptLoadMonitoring() {
    // 既存のスクリプトタグを監視
    const scripts = document.querySelectorAll("script[src]");

    scripts.forEach((script) => {
      const src = script.getAttribute("src");
      const scriptName = src.split("/").pop();

      // 読み込み開始をマーク
      this.startScriptTiming(scriptName);

      // 読み込み完了イベント
      script.addEventListener("load", () => {
        this.endScriptTiming(scriptName, true);
      });

      // 読み込み失敗イベント
      script.addEventListener("error", () => {
        this.endScriptTiming(scriptName, false);
        console.error(
          `❌ [PerformanceMonitor] スクリプト読み込み失敗: ${scriptName}`
        );
      });
    });

    console.log(
      `🔍 [PerformanceMonitor] ${scripts.length}個のスクリプトの監視を開始しました`
    );
  }

  /**
   * メモリ監視の開始
   */
  startMemoryMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.takeMemorySnapshot("periodic");
      this.analyzeMemoryTrend();
    }, this.options.reportingInterval);

    console.log("💾 [PerformanceMonitor] メモリ監視を開始しました");
  }

  /**
   * メモリ監視の停止
   */
  stopMemoryMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log("💾 [PerformanceMonitor] メモリ監視を停止しました");
  }

  /**
   * スクリプト統計情報の更新
   */
  updateScriptStatistics() {
    const loadedScripts = Array.from(
      this.metrics.scriptLoadTimes.values()
    ).filter(
      (script) => script.status === "loaded" && script.duration !== null
    );

    if (loadedScripts.length === 0) return;

    // 平均読み込み時間
    const totalTime = loadedScripts.reduce(
      (sum, script) => sum + script.duration,
      0
    );
    this.statistics.averageScriptLoadTime = totalTime / loadedScripts.length;

    // 最遅・最速スクリプト
    const sortedScripts = loadedScripts.sort((a, b) => a.duration - b.duration);
    this.statistics.fastestScript = {
      name: this.getScriptNameByTiming(sortedScripts[0]),
      duration: sortedScripts[0].duration,
    };
    this.statistics.slowestScript = {
      name: this.getScriptNameByTiming(sortedScripts[sortedScripts.length - 1]),
      duration: sortedScripts[sortedScripts.length - 1].duration,
    };

    this.statistics.totalScriptsLoaded = loadedScripts.length;
  }

  /**
   * メモリ使用量トレンドの分析
   */
  analyzeMemoryTrend() {
    if (this.metrics.memorySnapshots.length < 3) return;

    const recent = this.metrics.memorySnapshots.slice(-3);
    const trend = recent[2].usedJSHeapSize - recent[0].usedJSHeapSize;

    if (trend > 1024 * 1024) {
      // 1MB以上増加
      this.statistics.memoryUsageTrend = "increasing";
    } else if (trend < -1024 * 1024) {
      // 1MB以上減少
      this.statistics.memoryUsageTrend = "decreasing";
    } else {
      this.statistics.memoryUsageTrend = "stable";
    }
  }

  /**
   * パフォーマンス評価の計算
   */
  calculatePerformanceRating() {
    const totalTime = this.getTotalLoadTime();

    if (totalTime < 1000) {
      this.statistics.performanceRating = "excellent";
    } else if (totalTime < 3000) {
      this.statistics.performanceRating = "good";
    } else if (totalTime < 5000) {
      this.statistics.performanceRating = "fair";
    } else {
      this.statistics.performanceRating = "poor";
    }

    return this.statistics.performanceRating;
  }

  /**
   * 総読み込み時間の取得
   */
  getTotalLoadTime() {
    if (this.metrics.endTime) {
      return this.metrics.endTime - this.metrics.startTime;
    }
    return performance.now() - this.metrics.startTime;
  }

  /**
   * スクリプト名の取得（タイミングデータから）
   */
  getScriptNameByTiming(timingData) {
    for (const [name, data] of this.metrics.scriptLoadTimes.entries()) {
      if (data === timingData) return name;
    }
    return "unknown";
  }

  /**
   * 詳細なパフォーマンスレポートの生成
   */
  generateDetailedReport() {
    const report = {
      summary: {
        totalLoadTime: this.getTotalLoadTime(),
        performanceRating: this.calculatePerformanceRating(),
        scriptsLoaded: this.statistics.totalScriptsLoaded,
        memoryUsage: this.getCurrentMemoryUsage(),
        memoryTrend: this.statistics.memoryUsageTrend,
      },
      scriptTiming: {
        average: this.statistics.averageScriptLoadTime,
        fastest: this.statistics.fastestScript,
        slowest: this.statistics.slowestScript,
        details: this.getScriptTimingDetails(),
      },
      initializationPhases: this.getInitializationPhaseDetails(),
      memorySnapshots: this.metrics.memorySnapshots.slice(-10), // 最新10件
      performanceMarks: Array.from(this.metrics.performanceMarks.entries()),
      recommendations: this.generateRecommendations(),
    };

    return report;
  }

  /**
   * スクリプトタイミング詳細の取得
   */
  getScriptTimingDetails() {
    const details = [];
    for (const [name, timing] of this.metrics.scriptLoadTimes.entries()) {
      details.push({
        name,
        duration: timing.duration,
        status: timing.status,
        startTime: timing.startTime,
        endTime: timing.endTime,
      });
    }
    return details.sort((a, b) => (b.duration || 0) - (a.duration || 0));
  }

  /**
   * 初期化フェーズ詳細の取得
   */
  getInitializationPhaseDetails() {
    const details = [];
    for (const [name, phase] of this.metrics.initializationPhases.entries()) {
      details.push({
        name,
        duration: phase.duration,
        status: phase.status,
        startTime: phase.startTime,
        endTime: phase.endTime,
      });
    }
    return details.sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
  }

  /**
   * 現在のメモリ使用量の取得
   */
  getCurrentMemoryUsage() {
    if (!performance.memory) return null;

    return {
      usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
    };
  }

  /**
   * パフォーマンス改善の推奨事項生成
   */
  generateRecommendations() {
    const recommendations = [];
    const totalTime = this.getTotalLoadTime();

    // 読み込み時間に基づく推奨事項
    if (totalTime > 5000) {
      recommendations.push({
        type: "critical",
        message:
          "スクリプト読み込み時間が5秒を超えています。スクリプトの最適化を検討してください。",
      });
    } else if (totalTime > 3000) {
      recommendations.push({
        type: "warning",
        message:
          "スクリプト読み込み時間が3秒を超えています。パフォーマンスの改善を検討してください。",
      });
    }

    // 遅いスクリプトに基づく推奨事項
    if (
      this.statistics.slowestScript &&
      this.statistics.slowestScript.duration > 1000
    ) {
      recommendations.push({
        type: "warning",
        message: `${
          this.statistics.slowestScript.name
        } の読み込みが遅いです (${this.statistics.slowestScript.duration.toFixed(
          2
        )}ms)。`,
      });
    }

    // メモリ使用量に基づく推奨事項
    const currentMemory = this.getCurrentMemoryUsage();
    if (currentMemory && currentMemory.usedMB > 100) {
      recommendations.push({
        type: "info",
        message: `メモリ使用量が ${currentMemory.usedMB}MB です。メモリリークがないか確認してください。`,
      });
    }

    // メモリトレンドに基づく推奨事項
    if (this.statistics.memoryUsageTrend === "increasing") {
      recommendations.push({
        type: "warning",
        message:
          "メモリ使用量が継続的に増加しています。メモリリークの可能性があります。",
      });
    }

    return recommendations;
  }

  /**
   * パフォーマンス統計の表示
   */
  displayPerformanceStats() {
    const report = this.generateDetailedReport();

    console.group("📊 [PerformanceMonitor] パフォーマンス統計情報");

    // サマリー情報
    console.group("📋 概要");
    console.log(
      `⏱️ 総読み込み時間: ${report.summary.totalLoadTime.toFixed(2)}ms`
    );
    console.log(`🎯 パフォーマンス評価: ${report.summary.performanceRating}`);
    console.log(`📜 読み込み済みスクリプト数: ${report.summary.scriptsLoaded}`);
    if (report.summary.memoryUsage) {
      console.log(
        `💾 現在のメモリ使用量: ${report.summary.memoryUsage.usedMB}MB`
      );
      console.log(`📈 メモリ使用量トレンド: ${report.summary.memoryTrend}`);
    }
    console.groupEnd();

    // スクリプトタイミング情報
    if (report.scriptTiming.details.length > 0) {
      console.group("⏱️ スクリプト読み込み時間");
      console.log(
        `📊 平均読み込み時間: ${report.scriptTiming.average.toFixed(2)}ms`
      );
      if (report.scriptTiming.fastest) {
        console.log(
          `🚀 最速: ${
            report.scriptTiming.fastest.name
          } (${report.scriptTiming.fastest.duration.toFixed(2)}ms)`
        );
      }
      if (report.scriptTiming.slowest) {
        console.log(
          `🐌 最遅: ${
            report.scriptTiming.slowest.name
          } (${report.scriptTiming.slowest.duration.toFixed(2)}ms)`
        );
      }

      // 上位5つの遅いスクリプト
      const slowScripts = report.scriptTiming.details.slice(0, 5);
      console.log("📋 読み込み時間上位5位:");
      slowScripts.forEach((script, index) => {
        if (script.duration) {
          console.log(
            `  ${index + 1}. ${script.name}: ${script.duration.toFixed(2)}ms`
          );
        }
      });
      console.groupEnd();
    }

    // 初期化フェーズ情報
    if (report.initializationPhases.length > 0) {
      console.group("🚀 初期化フェーズ");
      report.initializationPhases.forEach((phase) => {
        if (phase.duration) {
          console.log(
            `${phase.name}: ${phase.duration.toFixed(2)}ms (${phase.status})`
          );
        }
      });
      console.groupEnd();
    }

    // 推奨事項
    if (report.recommendations.length > 0) {
      console.group("💡 推奨事項");
      report.recommendations.forEach((rec) => {
        const icon =
          rec.type === "critical" ? "🚨" : rec.type === "warning" ? "⚠️" : "ℹ️";
        console.log(`${icon} ${rec.message}`);
      });
      console.groupEnd();
    }

    console.groupEnd();

    return report;
  }

  /**
   * 監視の完了処理
   */
  finalize() {
    this.metrics.endTime = performance.now();
    this.stopMemoryMonitoring();
    this.markPerformance("monitor_end");

    // 最終メモリスナップショット
    this.takeMemorySnapshot("finalization");

    // 最終レポートの表示
    const finalReport = this.displayPerformanceStats();

    console.log("✅ [PerformanceMonitor] パフォーマンス監視を完了しました");

    return finalReport;
  }

  /**
   * イベントリスナーの追加
   */
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(callback);
  }

  /**
   * イベントの発火
   */
  dispatchEvent(eventType, data) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `❌ [PerformanceMonitor] イベントリスナーエラー (${eventType}):`,
            error
          );
        }
      });
    }
  }
}

// グローバルに公開
window.PerformanceMonitor = PerformanceMonitor;
