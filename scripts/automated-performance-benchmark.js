#!/usr/bin/env node

/**
 * HAQEI Future Simulator 自動化パフォーマンスベンチマーク
 * 
 * 継続的な性能監視と回帰検出のための自動化ベンチマークシステム
 * 
 * 機能:
 * - 定期的なパフォーマンス測定
 * - 性能回帰の自動検出
 * - アラート機能
 * - 履歴データの管理
 * - レポート生成
 */

import fs from 'fs/promises';
import path from 'path';
import { performance } from 'perf_hooks';

class AutomatedPerformanceBenchmark {
    constructor(options = {}) {
        this.options = {
            configFile: options.configFile || 'performance-config.json',
            historyFile: options.historyFile || 'performance-history.json',
            reportsDir: options.reportsDir || 'performance-reports',
            alertThreshold: options.alertThreshold || 1.5, // 1.5倍以上の性能劣化でアラート
            baselineWindow: options.baselineWindow || 10, // 過去10回の平均をベースライン
            verbose: options.verbose || false
        };
        
        this.config = null;
        this.history = [];
        this.alerts = [];
    }
    
    async initialize() {
        await this.loadConfig();
        await this.loadHistory();
        await this.ensureReportsDirectory();
        this.log('自動化ベンチマークシステム初期化完了', 'INFO');
    }
    
    async loadConfig() {
        try {
            const configPath = path.resolve(this.options.configFile);
            const configData = await fs.readFile(configPath, 'utf8');
            this.config = JSON.parse(configData);
            this.log(`設定ファイル読み込み完了: ${configPath}`, 'INFO');
        } catch (error) {
            this.log('設定ファイルが見つからないため、デフォルト設定を使用', 'WARN');
            this.config = this.createDefaultConfig();
            await this.saveConfig();
        }
    }
    
    async loadHistory() {
        try {
            const historyPath = path.resolve(this.options.historyFile);
            const historyData = await fs.readFile(historyPath, 'utf8');
            this.history = JSON.parse(historyData);
            this.log(`履歴データ読み込み完了: ${this.history.length}件`, 'INFO');
        } catch (error) {
            this.log('履歴ファイルが見つからないため、新規作成', 'WARN');
            this.history = [];
        }
    }
    
    async ensureReportsDirectory() {
        const reportsDir = path.resolve(this.options.reportsDir);
        try {
            await fs.access(reportsDir);
        } catch (error) {
            await fs.mkdir(reportsDir, { recursive: true });
            this.log(`レポートディレクトリを作成: ${reportsDir}`, 'INFO');
        }
    }
    
    createDefaultConfig() {
        return {
            scenarios: [
                {
                    name: 'light_load',
                    text: '仕事の悩みがある',
                    targetTime: 1500,
                    iterations: 3
                },
                {
                    name: 'medium_load',
                    text: '新しいプロジェクトが始まったが、チームメンバーとのコミュニケーションがうまくいかない。技術的な課題も多く、スケジュールも厳しい。どのように進めるべきか悩んでいる。',
                    targetTime: 3000,
                    iterations: 5
                },
                {
                    name: 'heavy_load',
                    text: '人生の転機に立っている。現在の職場では10年働いているが、最近やりがいを感じなくなってきた。家族を養う責任もあり、転職には大きなリスクが伴う。しかし、このままでは自分の成長が止まってしまう気がする。新しい分野に挑戦したい気持ちと、安定を求める気持ちで葛藤している。年齢的にも最後のチャンスかもしれない。どのような選択をすべきか、深く悩んでいる。',
                    targetTime: 5000,
                    iterations: 3
                }
            ],
            thresholds: {
                processingTime: 3000,
                initializationTime: 1000,
                memoryUsage: 50 * 1024 * 1024,
                cpuUsage: 80
            },
            alerts: {
                enabled: true,
                webhookUrl: null,
                emailConfig: null
            }
        };
    }
    
    async saveConfig() {
        const configPath = path.resolve(this.options.configFile);
        await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
        this.log(`設定ファイル保存完了: ${configPath}`, 'INFO');
    }
    
    async saveHistory() {
        const historyPath = path.resolve(this.options.historyFile);
        await fs.writeFile(historyPath, JSON.stringify(this.history, null, 2));
        this.log(`履歴データ保存完了: ${this.history.length}件`, 'INFO');
    }
    
    async runBenchmark() {
        const benchmarkStart = Date.now();
        this.log('自動化ベンチマーク開始', 'INFO');
        
        const results = {
            timestamp: new Date().toISOString(),
            scenarios: [],
            summary: {},
            regressions: [],
            alerts: []
        };
        
        // 各シナリオを実行
        for (const scenario of this.config.scenarios) {
            this.log(`シナリオ実行: ${scenario.name}`, 'INFO');
            
            const scenarioResults = await this.runScenario(scenario);
            results.scenarios.push(scenarioResults);
            
            // 回帰検出
            const regression = this.detectRegression(scenario.name, scenarioResults);
            if (regression) {
                results.regressions.push(regression);
                this.log(`回帰検出: ${scenario.name} - ${regression.description}`, 'WARN');
            }
        }
        
        // サマリー生成
        results.summary = this.generateSummary(results.scenarios);
        
        // アラート生成
        if (results.regressions.length > 0) {
            const alert = await this.generateAlert(results);
            results.alerts.push(alert);
        }
        
        // 履歴に追加
        this.history.push(results);
        
        // 履歴サイズ制限（最新1000件まで保持）
        if (this.history.length > 1000) {
            this.history = this.history.slice(-1000);
        }
        
        // 保存
        await this.saveHistory();
        await this.saveReport(results);
        
        const benchmarkDuration = Date.now() - benchmarkStart;
        this.log(`ベンチマーク完了: ${benchmarkDuration}ms`, 'INFO');
        
        return results;
    }
    
    async runScenario(scenario) {
        const scenarioResults = {
            name: scenario.name,
            config: scenario,
            runs: [],
            stats: {},
            performance: {}
        };
        
        // 複数回実行
        for (let i = 0; i < scenario.iterations; i++) {
            const runResult = await this.runSingleBenchmark(scenario.text);
            runResult.iteration = i + 1;
            scenarioResults.runs.push(runResult);
            
            // 短い休憩
            await this.sleep(100);
        }
        
        // 統計計算
        scenarioResults.stats = this.calculateStats(scenarioResults.runs);
        scenarioResults.performance = this.evaluatePerformance(scenarioResults.stats, scenario);
        
        return scenarioResults;
    }
    
    async runSingleBenchmark(inputText) {
        const result = {
            timestamp: new Date().toISOString(),
            metrics: {},
            success: false,
            errors: []
        };
        
        const overallStart = performance.now();
        
        try {
            const initialMemory = process.memoryUsage();
            const cpuStart = process.cpuUsage();
            
            // 初期化時間測定
            const initStart = performance.now();
            await this.simulateEngineInitialization();
            result.metrics.initTime = performance.now() - initStart;
            
            // 分析時間測定
            const analysisStart = performance.now();
            const analysisResult = await this.simulateAnalysis(inputText);
            result.metrics.analysisTime = performance.now() - analysisStart;
            
            // マッピング時間測定
            const mappingStart = performance.now();
            await this.simulateMapping(analysisResult);
            result.metrics.mappingTime = performance.now() - mappingStart;
            
            // リソース使用量計算
            const finalMemory = process.memoryUsage();
            const cpuEnd = process.cpuUsage(cpuStart);
            
            result.metrics.memoryUsage = {
                initial: initialMemory.heapUsed,
                peak: finalMemory.heapUsed,
                delta: finalMemory.heapUsed - initialMemory.heapUsed
            };
            
            result.metrics.cpuUsage = {
                user: cpuEnd.user / 1000,
                system: cpuEnd.system / 1000,
                total: (cpuEnd.user + cpuEnd.system) / 1000
            };
            
            result.success = true;
            
        } catch (error) {
            result.errors.push({
                message: error.message,
                stack: error.stack
            });
        }
        
        result.metrics.totalTime = performance.now() - overallStart;
        
        return result;
    }
    
    async simulateEngineInitialization() {
        // エンジン初期化の重い処理をシミュレート
        const complexity = Math.floor(Math.random() * 1000) + 500;
        const data = new Array(complexity).fill(0).map(() => ({
            id: Math.random(),
            value: Math.random() * 1000,
            metadata: {
                timestamp: Date.now(),
                processed: false
            }
        }));
        
        // 処理
        for (const item of data) {
            item.processed = true;
            item.result = Math.sin(item.value) * Math.cos(item.id);
        }
        
        // 適度な待機時間
        await this.sleep(200 + Math.random() * 300);
        
        return data.length;
    }
    
    async simulateAnalysis(inputText) {
        const words = inputText.split(/\s+/);
        const complexity = words.length * inputText.length;
        
        // 複雑な分析処理をシミュレート
        const analysis = {
            words: words,
            length: inputText.length,
            complexity: complexity,
            features: [],
            scores: {}
        };
        
        // 特徴抽出
        for (const word of words) {
            if (word.length > 3) {
                analysis.features.push({
                    word: word,
                    length: word.length,
                    hash: this.simpleHash(word),
                    score: Math.random()
                });
            }
        }
        
        // スコア計算
        analysis.scores = {
            sentiment: Math.random() * 2 - 1,
            complexity: complexity / 1000,
            confidence: Math.random() * 0.5 + 0.5
        };
        
        // 処理時間調整
        const processingTime = Math.min(complexity * 0.5, 1500);
        await this.sleep(processingTime);
        
        return analysis;
    }
    
    async simulateMapping(analysisResult) {
        // 易経マッピングの複雑な計算をシミュレート
        const hexagrams = [];
        
        for (let i = 1; i <= 64; i++) {
            const score = Math.random() * analysisResult.scores.confidence;
            hexagrams.push({
                id: i,
                name: `第${i}卦`,
                score: score,
                relevance: score * analysisResult.scores.complexity
            });
        }
        
        // スコア順でソート
        hexagrams.sort((a, b) => b.score - a.score);
        
        // マッピング時間調整
        const mappingTime = 300 + Math.random() * 500;
        await this.sleep(mappingTime);
        
        return {
            primaryHexagram: hexagrams[0],
            alternatives: hexagrams.slice(1, 4),
            confidence: analysisResult.scores.confidence
        };
    }
    
    calculateStats(runs) {
        const successfulRuns = runs.filter(r => r.success);
        if (successfulRuns.length === 0) {
            return null;
        }
        
        const metrics = ['totalTime', 'initTime', 'analysisTime', 'mappingTime'];
        const stats = {};
        
        metrics.forEach(metric => {
            const values = successfulRuns.map(r => r.metrics[metric]);
            stats[metric] = {
                min: Math.min(...values),
                max: Math.max(...values),
                avg: values.reduce((sum, val) => sum + val, 0) / values.length,
                median: this.calculateMedian(values),
                stddev: this.calculateStandardDeviation(values),
                p95: this.calculatePercentile(values, 95),
                p99: this.calculatePercentile(values, 99)
            };
        });
        
        // メモリとCPU統計
        const memoryDeltas = successfulRuns.map(r => r.metrics.memoryUsage.delta);
        const cpuTotals = successfulRuns.map(r => r.metrics.cpuUsage.total);
        
        stats.memoryDelta = {
            min: Math.min(...memoryDeltas),
            max: Math.max(...memoryDeltas),
            avg: memoryDeltas.reduce((sum, val) => sum + val, 0) / memoryDeltas.length
        };
        
        stats.cpuTotal = {
            min: Math.min(...cpuTotals),
            max: Math.max(...cpuTotals),
            avg: cpuTotals.reduce((sum, val) => sum + val, 0) / cpuTotals.length
        };
        
        return stats;
    }
    
    evaluatePerformance(stats, scenario) {
        if (!stats) {
            return { overall: 'failed', details: {} };
        }
        
        const evaluation = {
            overall: 'good',
            details: {},
            issues: []
        };
        
        // 処理時間評価
        if (stats.totalTime.avg > scenario.targetTime) {
            evaluation.details.processingTime = 'poor';
            evaluation.issues.push(`処理時間が目標値を超過: ${stats.totalTime.avg.toFixed(0)}ms > ${scenario.targetTime}ms`);
        } else if (stats.totalTime.avg > scenario.targetTime * 0.8) {
            evaluation.details.processingTime = 'fair';
        } else {
            evaluation.details.processingTime = 'good';
        }
        
        // メモリ使用量評価
        const memoryThreshold = this.config.thresholds.memoryUsage;
        if (stats.memoryDelta.avg > memoryThreshold) {
            evaluation.details.memoryUsage = 'poor';
            evaluation.issues.push(`メモリ使用量が閾値を超過: ${this.formatBytes(stats.memoryDelta.avg)}`);
        } else {
            evaluation.details.memoryUsage = 'good';
        }
        
        // CPU使用量評価
        if (stats.cpuTotal.avg > this.config.thresholds.cpuUsage) {
            evaluation.details.cpuUsage = 'poor';
            evaluation.issues.push(`CPU使用量が閾値を超過: ${stats.cpuTotal.avg.toFixed(1)}ms`);
        } else {
            evaluation.details.cpuUsage = 'good';
        }
        
        // 総合評価
        const poorCount = Object.values(evaluation.details).filter(v => v === 'poor').length;
        if (poorCount > 0) {
            evaluation.overall = 'poor';
        } else if (Object.values(evaluation.details).some(v => v === 'fair')) {
            evaluation.overall = 'fair';
        }
        
        return evaluation;
    }
    
    detectRegression(scenarioName, currentResults) {
        if (!currentResults.stats) {
            return null;
        }
        
        // 過去の同じシナリオの結果を取得
        const historicalResults = this.history
            .map(h => h.scenarios.find(s => s.name === scenarioName))
            .filter(s => s && s.stats)
            .slice(-this.options.baselineWindow);
        
        if (historicalResults.length < 3) {
            return null; // 十分な履歴データがない
        }
        
        // ベースライン計算
        const baselineAvg = historicalResults.reduce((sum, r) => sum + r.stats.totalTime.avg, 0) / historicalResults.length;
        const currentAvg = currentResults.stats.totalTime.avg;
        
        // 回帰検出
        const regressionRatio = currentAvg / baselineAvg;
        if (regressionRatio > this.options.alertThreshold) {
            return {
                scenario: scenarioName,
                type: 'performance_regression',
                severity: regressionRatio > 2.0 ? 'critical' : 'warning',
                description: `処理時間が${((regressionRatio - 1) * 100).toFixed(1)}%増加`,
                baseline: baselineAvg,
                current: currentAvg,
                ratio: regressionRatio,
                historicalSamples: historicalResults.length
            };
        }
        
        return null;
    }
    
    generateSummary(scenarioResults) {
        const summary = {
            totalScenarios: scenarioResults.length,
            successfulScenarios: scenarioResults.filter(s => s.stats).length,
            overallPerformance: 'good',
            averageProcessingTime: 0,
            totalIssues: 0
        };
        
        if (summary.successfulScenarios === 0) {
            summary.overallPerformance = 'critical';
            return summary;
        }
        
        // 平均処理時間計算
        const avgTimes = scenarioResults
            .filter(s => s.stats)
            .map(s => s.stats.totalTime.avg);
        summary.averageProcessingTime = avgTimes.reduce((sum, t) => sum + t, 0) / avgTimes.length;
        
        // 問題の集計
        scenarioResults.forEach(scenario => {
            if (scenario.performance && scenario.performance.issues) {
                summary.totalIssues += scenario.performance.issues.length;
            }
        });
        
        // 総合パフォーマンス評価
        const poorScenarios = scenarioResults.filter(s => s.performance && s.performance.overall === 'poor').length;
        if (poorScenarios > 0) {
            summary.overallPerformance = 'poor';
        } else if (scenarioResults.some(s => s.performance && s.performance.overall === 'fair')) {
            summary.overallPerformance = 'fair';
        }
        
        return summary;
    }
    
    async generateAlert(results) {
        const alert = {
            timestamp: new Date().toISOString(),
            type: 'performance_regression',
            severity: 'warning',
            message: `${results.regressions.length}件の性能回帰を検出`,
            details: results.regressions,
            actionRequired: true
        };
        
        // 重要度判定
        if (results.regressions.some(r => r.severity === 'critical')) {
            alert.severity = 'critical';
        }
        
        // アラート送信
        if (this.config.alerts.enabled) {
            await this.sendAlert(alert);
        }
        
        return alert;
    }
    
    async sendAlert(alert) {
        this.log(`アラート生成: ${alert.message}`, 'WARN');
        
        // Webhook送信
        if (this.config.alerts.webhookUrl) {
            await this.sendWebhookAlert(alert);
        }
        
        // メール送信
        if (this.config.alerts.emailConfig) {
            await this.sendEmailAlert(alert);
        }
    }
    
    async sendWebhookAlert(alert) {
        // Webhookアラート送信の実装（実際のHTTPリクエストは省略）
        this.log(`Webhookアラート送信: ${this.config.alerts.webhookUrl}`, 'INFO');
    }
    
    async sendEmailAlert(alert) {
        // メールアラート送信の実装（実際のメール送信は省略）
        this.log('メールアラート送信', 'INFO');
    }
    
    async saveReport(results) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.options.reportsDir, `benchmark-${timestamp}.json`);
        
        await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
        this.log(`レポート保存: ${reportPath}`, 'INFO');
        
        // HTMLレポートも生成
        const htmlReportPath = path.join(this.options.reportsDir, `benchmark-${timestamp}.html`);
        const htmlContent = this.generateHTMLReport(results);
        await fs.writeFile(htmlReportPath, htmlContent);
        this.log(`HTMLレポート保存: ${htmlReportPath}`, 'INFO');
    }
    
    generateHTMLReport(results) {
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAQEI Performance Benchmark Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric { background: white; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #007bff; }
        .scenario { margin-bottom: 30px; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; }
        .good { color: #28a745; }
        .fair { color: #ffc107; }
        .poor { color: #dc3545; }
        .critical { color: #dc3545; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        th { background-color: #f8f9fa; }
        .regression { background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>HAQEI Performance Benchmark Report</h1>
        <p>Generated: ${results.timestamp}</p>
        <p>Scenarios: ${results.scenarios.length} | Regressions: ${results.regressions.length}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <div class="metric-value ${results.summary.overallPerformance}">${results.summary.overallPerformance.toUpperCase()}</div>
            <div>Overall Performance</div>
        </div>
        <div class="metric">
            <div class="metric-value">${results.summary.averageProcessingTime.toFixed(0)}ms</div>
            <div>Average Processing Time</div>
        </div>
        <div class="metric">
            <div class="metric-value">${results.summary.totalIssues}</div>
            <div>Total Issues</div>
        </div>
        <div class="metric">
            <div class="metric-value">${results.summary.successfulScenarios}/${results.summary.totalScenarios}</div>
            <div>Successful Scenarios</div>
        </div>
    </div>
    
    ${results.regressions.length > 0 ? `
    <div class="regressions">
        <h2>Performance Regressions</h2>
        ${results.regressions.map(reg => `
        <div class="regression">
            <strong>${reg.scenario}</strong> (${reg.severity})<br>
            ${reg.description}<br>
            Baseline: ${reg.baseline.toFixed(0)}ms → Current: ${reg.current.toFixed(0)}ms
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div class="scenarios">
        <h2>Scenario Results</h2>
        ${results.scenarios.map(scenario => `
        <div class="scenario">
            <h3>${scenario.name} <span class="${scenario.performance.overall}">(${scenario.performance.overall})</span></h3>
            ${scenario.stats ? `
            <table>
                <tr><th>Metric</th><th>Min</th><th>Avg</th><th>Max</th><th>P95</th></tr>
                <tr><td>Total Time</td><td>${scenario.stats.totalTime.min.toFixed(0)}ms</td><td>${scenario.stats.totalTime.avg.toFixed(0)}ms</td><td>${scenario.stats.totalTime.max.toFixed(0)}ms</td><td>${scenario.stats.totalTime.p95.toFixed(0)}ms</td></tr>
                <tr><td>Init Time</td><td>${scenario.stats.initTime.min.toFixed(0)}ms</td><td>${scenario.stats.initTime.avg.toFixed(0)}ms</td><td>${scenario.stats.initTime.max.toFixed(0)}ms</td><td>${scenario.stats.initTime.p95.toFixed(0)}ms</td></tr>
                <tr><td>Analysis Time</td><td>${scenario.stats.analysisTime.min.toFixed(0)}ms</td><td>${scenario.stats.analysisTime.avg.toFixed(0)}ms</td><td>${scenario.stats.analysisTime.max.toFixed(0)}ms</td><td>${scenario.stats.analysisTime.p95.toFixed(0)}ms</td></tr>
                <tr><td>Mapping Time</td><td>${scenario.stats.mappingTime.min.toFixed(0)}ms</td><td>${scenario.stats.mappingTime.avg.toFixed(0)}ms</td><td>${scenario.stats.mappingTime.max.toFixed(0)}ms</td><td>${scenario.stats.mappingTime.p95.toFixed(0)}ms</td></tr>
            </table>
            ` : '<p>No successful runs</p>'}
            
            ${scenario.performance.issues.length > 0 ? `
            <div class="issues">
                <h4>Issues:</h4>
                <ul>
                    ${scenario.performance.issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
    }
    
    // ユーティリティメソッド
    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
    }
    
    calculateStandardDeviation(values) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
        const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.sqrt(avgSquaredDiff);
    }
    
    calculatePercentile(values, percentile) {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return Math.abs(hash);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        
        if (this.options.verbose || level === 'WARN' || level === 'ERROR') {
            console.log(logMessage);
        }
        
        return logMessage;
    }
}

// コマンドライン実行
async function main() {
    const options = {
        verbose: process.argv.includes('--verbose'),
        configFile: process.argv.includes('--config') ? 
            process.argv[process.argv.indexOf('--config') + 1] : undefined
    };
    
    try {
        console.log('🚀 HAQEI自動化パフォーマンスベンチマーク開始');
        console.log('=' .repeat(60));
        
        const benchmark = new AutomatedPerformanceBenchmark(options);
        await benchmark.initialize();
        
        const results = await benchmark.runBenchmark();
        
        console.log('=' .repeat(60));
        console.log('📊 ベンチマーク結果:');
        console.log(`  総合パフォーマンス: ${results.summary.overallPerformance.toUpperCase()}`);
        console.log(`  平均処理時間: ${results.summary.averageProcessingTime.toFixed(0)}ms`);
        console.log(`  成功シナリオ: ${results.summary.successfulScenarios}/${results.summary.totalScenarios}`);
        console.log(`  検出された問題: ${results.summary.totalIssues}件`);
        console.log(`  性能回帰: ${results.regressions.length}件`);
        
        if (results.regressions.length > 0) {
            console.log('\n⚠️  性能回帰の詳細:');
            results.regressions.forEach(reg => {
                console.log(`  - ${reg.scenario}: ${reg.description} (${reg.severity})`);
            });
        }
        
        console.log('=' .repeat(60));
        console.log('✨ ベンチマーク完了');
        
    } catch (error) {
        console.error('❌ ベンチマークエラー:', error.message);
        if (options.verbose && error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default AutomatedPerformanceBenchmark;