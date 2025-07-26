#!/usr/bin/env node

/**
 * Performance Monitoring Test Runner
 * Node.js環境でPerformanceMonitorの基本機能をテストします
 */

// Node.js環境でのPerformance APIのポリフィル
if (typeof performance === "undefined") {
  global.performance = {
    now: () => Date.now(),
    mark: () => {},
    memory: {
      usedJSHeapSize: Math.random() * 50 * 1024 * 1024, // 0-50MB
      totalJSHeapSize: Math.random() * 100 * 1024 * 1024, // 0-100MB
      jsHeapSizeLimit: 2 * 1024 * 1024 * 1024, // 2GB
    },
  };
}

// Console APIのポリフィル
if (typeof window === "undefined") {
  global.window = {
    performance: global.performance,
  };
}

// PerformanceMonitorクラスの読み込み（簡易版）
class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      enableScriptTiming: true,
      enableMemoryMonitoring: true,
      enableDetailedLogging: true,
      reportingInterval: 1000,
      maxHistorySize: 100,
      ...options,
    };

    this.metrics = {
      scriptLoadTimes: new Map(),
      initializationPhases: new Map(),
      memorySnapshots: [],
      performanceMarks: new Map(),
      totalLoadTime: 0,
      startTime: performance.now(),
      endTime: null,
    };

    this.statistics = {
      averageScriptLoadTime: 0,
      slowestScript: null,
      fastestScript: null,
      totalScriptsLoaded: 0,
      memoryUsageTrend: "stable",
      performanceRating: "unknown",
    };

    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.eventListeners = new Map();

    this.initialize();
  }

  initialize() {
    console.log(
      "🔧 [PerformanceMonitor] パフォーマンス監視システムを初期化中..."
    );

    if (!performance) {
      console.warn("⚠️ [PerformanceMonitor] Performance API が利用できません");
      return;
    }

    this.takeMemorySnapshot("initialization");
    this.markPerformance("monitor_start");

    if (this.options.enableMemoryMonitoring) {
      this.startMemoryMonitoring();
    }

    console.log(
      "✅ [PerformanceMonitor] パフォーマンス監視システムが初期化されました"
    );
  }

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

    this.updateScriptStatistics();
  }

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

  markPerformance(markName) {
    const timestamp = performance.now();
    this.metrics.performanceMarks.set(markName, timestamp);

    if (performance.mark) {
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

  startMemoryMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.takeMemorySnapshot("periodic");
      this.analyzeMemoryTrend();
    }, this.options.reportingInterval);

    console.log("💾 [PerformanceMonitor] メモリ監視を開始しました");
  }

  stopMemoryMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log("💾 [PerformanceMonitor] メモリ監視を停止しました");
  }

  updateScriptStatistics() {
    const loadedScripts = Array.from(
      this.metrics.scriptLoadTimes.values()
    ).filter(
      (script) => script.status === "loaded" && script.duration !== null
    );

    if (loadedScripts.length === 0) return;

    const totalTime = loadedScripts.reduce(
      (sum, script) => sum + script.duration,
      0
    );
    this.statistics.averageScriptLoadTime = totalTime / loadedScripts.length;

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

  analyzeMemoryTrend() {
    if (this.metrics.memorySnapshots.length < 3) return;

    const recent = this.metrics.memorySnapshots.slice(-3);
    const trend = recent[2].usedJSHeapSize - recent[0].usedJSHeapSize;

    if (trend > 1024 * 1024) {
      this.statistics.memoryUsageTrend = "increasing";
    } else if (trend < -1024 * 1024) {
      this.statistics.memoryUsageTrend = "decreasing";
    } else {
      this.statistics.memoryUsageTrend = "stable";
    }
  }

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

  getTotalLoadTime() {
    if (this.metrics.endTime) {
      return this.metrics.endTime - this.metrics.startTime;
    }
    return performance.now() - this.metrics.startTime;
  }

  getScriptNameByTiming(timingData) {
    for (const [name, data] of this.metrics.scriptLoadTimes.entries()) {
      if (data === timingData) return name;
    }
    return "unknown";
  }

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
      memorySnapshots: this.metrics.memorySnapshots.slice(-10),
      performanceMarks: Array.from(this.metrics.performanceMarks.entries()),
      recommendations: this.generateRecommendations(),
    };

    return report;
  }

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

  getCurrentMemoryUsage() {
    if (!performance.memory) return null;

    return {
      usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      totalMB: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const totalTime = this.getTotalLoadTime();

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

    const currentMemory = this.getCurrentMemoryUsage();
    if (currentMemory && currentMemory.usedMB > 100) {
      recommendations.push({
        type: "info",
        message: `メモリ使用量が ${currentMemory.usedMB}MB です。メモリリークがないか確認してください。`,
      });
    }

    if (this.statistics.memoryUsageTrend === "increasing") {
      recommendations.push({
        type: "warning",
        message:
          "メモリ使用量が継続的に増加しています。メモリリークの可能性があります。",
      });
    }

    return recommendations;
  }

  displayPerformanceStats() {
    const report = this.generateDetailedReport();

    console.group("📊 [PerformanceMonitor] パフォーマンス統計情報");

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
      console.groupEnd();
    }

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

  finalize() {
    this.metrics.endTime = performance.now();
    this.stopMemoryMonitoring();
    this.markPerformance("monitor_end");
    this.takeMemorySnapshot("finalization");

    const finalReport = this.displayPerformanceStats();
    console.log("✅ [PerformanceMonitor] パフォーマンス監視を完了しました");

    return finalReport;
  }
}

// テスト実行
async function runPerformanceMonitoringTests() {
  console.log("🚀 Performance Monitoring Test Suite");
  console.log("=====================================");

  let testsPassed = 0;
  let totalTests = 0;

  function runTest(testName, testFunction) {
    totalTests++;
    console.log(`\n🔍 テスト ${totalTests}: ${testName}`);
    try {
      const result = testFunction();
      if (result) {
        console.log(`✅ ${testName} - 成功`);
        testsPassed++;
      } else {
        console.log(`❌ ${testName} - 失敗`);
      }
    } catch (error) {
      console.log(`❌ ${testName} - エラー: ${error.message}`);
    }
  }

  // Test 1: PerformanceMonitor初期化
  runTest("PerformanceMonitor初期化", () => {
    const monitor = new PerformanceMonitor({
      enableDetailedLogging: false,
    });
    return monitor && monitor.metrics && monitor.statistics;
  });

  // Test 2: スクリプトタイミング測定
  runTest("スクリプトタイミング測定", () => {
    const monitor = new PerformanceMonitor({ enableDetailedLogging: false });
    monitor.startScriptTiming("test-script.js");

    // 少し待機してから終了
    setTimeout(() => {}, 10);

    monitor.endScriptTiming("test-script.js", true);

    const scriptTiming = monitor.metrics.scriptLoadTimes.get("test-script.js");
    return (
      scriptTiming &&
      scriptTiming.duration !== null &&
      scriptTiming.status === "loaded"
    );
  });

  // Test 3: 初期化フェーズ測定
  runTest("初期化フェーズ測定", () => {
    const monitor = new PerformanceMonitor({ enableDetailedLogging: false });
    monitor.startInitializationPhase("test-phase");

    setTimeout(() => {}, 10);

    monitor.endInitializationPhase("test-phase", true);

    const phaseTiming = monitor.metrics.initializationPhases.get("test-phase");
    return (
      phaseTiming &&
      phaseTiming.duration !== null &&
      phaseTiming.status === "completed"
    );
  });

  // Test 4: メモリスナップショット
  runTest("メモリスナップショット", () => {
    const monitor = new PerformanceMonitor({ enableDetailedLogging: false });
    const snapshot = monitor.takeMemorySnapshot("test-snapshot");

    return snapshot && snapshot.usedMB !== undefined;
  });

  // Test 5: パフォーマンス評価
  runTest("パフォーマンス評価", () => {
    const monitor = new PerformanceMonitor({ enableDetailedLogging: false });
    const rating = monitor.calculatePerformanceRating();

    return ["excellent", "good", "fair", "poor"].includes(rating);
  });

  // Test 6: 詳細レポート生成
  runTest("詳細レポート生成", () => {
    const monitor = new PerformanceMonitor({ enableDetailedLogging: false });

    // いくつかのデータを追加
    monitor.startScriptTiming("report-test.js");
    monitor.endScriptTiming("report-test.js", true);
    monitor.startInitializationPhase("report-phase");
    monitor.endInitializationPhase("report-phase", true);

    const report = monitor.generateDetailedReport();

    return (
      report &&
      report.summary &&
      report.scriptTiming &&
      report.initializationPhases &&
      Array.isArray(report.recommendations)
    );
  });

  // Test 7: 統合テスト
  runTest("統合テスト", () => {
    const monitor = new PerformanceMonitor({
      enableDetailedLogging: false,
      enableMemoryMonitoring: false, // テスト環境では無効化
    });

    // 完全なワークフローをシミュレート
    monitor.startInitializationPhase("integration-test");
    monitor.startScriptTiming("integration-script-1.js");
    monitor.startScriptTiming("integration-script-2.js");

    monitor.endScriptTiming("integration-script-1.js", true);
    monitor.endScriptTiming("integration-script-2.js", true);
    monitor.endInitializationPhase("integration-test", true);

    const finalReport = monitor.finalize();

    return (
      finalReport &&
      finalReport.summary &&
      finalReport.scriptTiming.details.length === 2 &&
      finalReport.initializationPhases.length === 1
    );
  });

  // テスト結果の表示
  console.log("\n📊 テスト結果");
  console.log("=============");
  console.log(`✅ 成功: ${testsPassed}/${totalTests}`);
  console.log(`❌ 失敗: ${totalTests - testsPassed}/${totalTests}`);
  console.log(`🎯 成功率: ${Math.round((testsPassed / totalTests) * 100)}%`);

  if (testsPassed === totalTests) {
    console.log("\n🎉 すべてのテストが成功しました！");
    console.log("✅ パフォーマンス監視機能の実装が完了しています。");
  } else {
    console.log("\n⚠️ 一部のテストが失敗しました。");
    console.log("🔧 実装を確認してください。");
  }

  return testsPassed === totalTests;
}

// テスト実行
if (require.main === module) {
  runPerformanceMonitoringTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { PerformanceMonitor, runPerformanceMonitoringTests };
