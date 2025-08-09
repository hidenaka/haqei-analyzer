#!/usr/bin/env node

/**
 * HAQEI Future Simulator パフォーマンス分析スクリプト
 * 
 * 使用方法:
 * node scripts/run-performance-analysis.js [options]
 * 
 * オプション:
 * --scenario light|medium|heavy  テストシナリオを指定
 * --iterations N                 実行回数を指定（デフォルト: 5）
 * --output path                  結果出力ファイルパス
 * --verbose                      詳細ログを表示
 */

import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

class NodePerformanceAnalyzer {
    constructor(options = {}) {
        this.options = {
            scenario: options.scenario || 'medium',
            iterations: options.iterations || 5,
            outputPath: options.outputPath || 'performance-report.json',
            verbose: options.verbose || false
        };
        
        this.testScenarios = {
            light: "仕事の悩みがある",
            medium: "新しいプロジェクトが始まったが、チームメンバーとのコミュニケーションがうまくいかない。技術的な課題も多く、スケジュールも厳しい。どのように進めるべきか悩んでいる。",
            heavy: "人生の転機に立っている。現在の職場では10年働いているが、最近やりがいを感じなくなってきた。家族を養う責任もあり、転職には大きなリスクが伴う。しかし、このままでは自分の成長が止まってしまう気がする。新しい分野に挑戦したい気持ちと、安定を求める気持ちで葛藤している。年齢的にも最後のチャンスかもしれない。どのような選択をすべきか、深く悩んでいる。"
        };
        
        this.results = [];
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        
        if (this.options.verbose || level === 'ERROR') {
            console.log(logMessage);
        }
        
        return logMessage;
    }
    
    async runAnalysis() {
        this.log('パフォーマンス分析開始', 'INFO');
        this.log(`シナリオ: ${this.options.scenario}`, 'INFO');
        this.log(`実行回数: ${this.options.iterations}`, 'INFO');
        
        const testText = this.testScenarios[this.options.scenario];
        if (!testText) {
            throw new Error(`無効なシナリオ: ${this.options.scenario}`);
        }
        
        for (let i = 0; i < this.options.iterations; i++) {
            this.log(`実行 ${i + 1}/${this.options.iterations}`, 'INFO');
            
            const result = await this.runSingleTest(testText, i + 1);
            this.results.push(result);
            
            // 短い休憩
            await this.sleep(100);
        }
        
        const analysis = this.analyzeResults();
        await this.saveResults(analysis);
        
        this.log('パフォーマンス分析完了', 'INFO');
        return analysis;
    }
    
    async runSingleTest(inputText, iteration) {
        const testResult = {
            iteration: iteration,
            inputText: inputText.substring(0, 50) + '...',
            timestamp: new Date().toISOString(),
            metrics: {},
            errors: [],
            success: false
        };
        
        const overallStart = performance.now();
        
        try {
            // メモリ使用量監視開始
            const initialMemory = process.memoryUsage();
            testResult.metrics.initialMemory = initialMemory;
            
            // CPU使用率監視開始
            const cpuStart = process.cpuUsage();
            
            // 1. 初期化時間測定
            const initStart = performance.now();
            await this.simulateInitialization();
            testResult.metrics.initTime = performance.now() - initStart;
            
            // 2. テキスト分析時間測定
            const analysisStart = performance.now();
            const analysisResult = await this.simulateTextAnalysis(inputText);
            testResult.metrics.analysisTime = performance.now() - analysisStart;
            
            // 3. 易経変換時間測定
            const mappingStart = performance.now();
            const mappingResult = await this.simulateHexagramMapping(analysisResult);
            testResult.metrics.mappingTime = performance.now() - mappingStart;
            
            // 4. UI更新時間測定（シミュレート）
            const uiStart = performance.now();
            await this.simulateUIUpdate(mappingResult);
            testResult.metrics.uiUpdateTime = performance.now() - uiStart;
            
            // CPU使用率計算
            const cpuEnd = process.cpuUsage(cpuStart);
            testResult.metrics.cpuUsage = {
                user: cpuEnd.user / 1000, // マイクロ秒をミリ秒に変換
                system: cpuEnd.system / 1000
            };
            
            // 最終メモリ使用量
            const finalMemory = process.memoryUsage();
            testResult.metrics.finalMemory = finalMemory;
            testResult.metrics.memoryDelta = {
                rss: finalMemory.rss - initialMemory.rss,
                heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
                heapTotal: finalMemory.heapTotal - initialMemory.heapTotal
            };
            
            testResult.success = true;
            
        } catch (error) {
            this.log(`テストエラー (実行${iteration}): ${error.message}`, 'ERROR');
            testResult.errors.push({
                message: error.message,
                stack: error.stack
            });
        }
        
        testResult.metrics.totalTime = performance.now() - overallStart;
        
        return testResult;
    }
    
    async simulateInitialization() {
        // エンジン初期化のシミュレート
        await this.sleep(Math.random() * 500 + 200); // 200-700ms
        
        // 重い処理をシミュレート
        const data = new Array(10000).fill(0).map(() => Math.random());
        const processed = data.map(x => Math.sin(x) * Math.cos(x));
        
        return processed.length;
    }
    
    async simulateTextAnalysis(inputText) {
        // テキスト分析のシミュレート
        const complexity = inputText.length;
        const processingTime = Math.min(complexity * 2, 2000); // 最大2秒
        
        await this.sleep(processingTime);
        
        // メモリを消費する処理をシミュレート
        const words = inputText.split(/\s+/);
        const analysis = {
            wordCount: words.length,
            complexity: complexity,
            keywords: words.filter(word => word.length > 3),
            sentiment: Math.random() * 2 - 1, // -1 to 1
            confidence: Math.random() * 0.5 + 0.5 // 0.5 to 1
        };
        
        return analysis;
    }
    
    async simulateHexagramMapping(analysisResult) {
        // 易経マッピングのシミュレート
        const mappingTime = 300 + Math.random() * 700; // 300-1000ms
        await this.sleep(mappingTime);
        
        // 複雑な計算をシミュレート
        const hexagramId = Math.floor(Math.random() * 64) + 1;
        const lineId = Math.floor(Math.random() * 6) + 1;
        
        const mapping = {
            hexagramId: hexagramId,
            hexagramName: `第${hexagramId}卦`,
            lineId: lineId,
            confidence: analysisResult.confidence * (0.8 + Math.random() * 0.2),
            processingComplexity: analysisResult.complexity
        };
        
        return mapping;
    }
    
    async simulateUIUpdate(mappingResult) {
        // UI更新のシミュレート
        await this.sleep(50 + Math.random() * 100); // 50-150ms
        
        // DOM操作相当の処理をシミュレート
        const elements = [];
        for (let i = 0; i < 100; i++) {
            elements.push({
                id: i,
                content: `Element ${i}`,
                visible: Math.random() > 0.5
            });
        }
        
        return elements.length;
    }
    
    analyzeResults() {
        if (this.results.length === 0) {
            throw new Error('分析する結果がありません');
        }
        
        const analysis = {
            summary: {
                totalTests: this.results.length,
                successfulTests: this.results.filter(r => r.success).length,
                failedTests: this.results.filter(r => !r.success).length,
                scenario: this.options.scenario
            },
            performance: this.calculatePerformanceStats(),
            memory: this.calculateMemoryStats(),
            cpu: this.calculateCPUStats(),
            bottlenecks: this.identifyBottlenecks(),
            recommendations: this.generateRecommendations(),
            rawData: this.results
        };
        
        return analysis;
    }
    
    calculatePerformanceStats() {
        const successfulResults = this.results.filter(r => r.success);
        if (successfulResults.length === 0) {
            return null;
        }
        
        const times = {
            total: successfulResults.map(r => r.metrics.totalTime),
            init: successfulResults.map(r => r.metrics.initTime),
            analysis: successfulResults.map(r => r.metrics.analysisTime),
            mapping: successfulResults.map(r => r.metrics.mappingTime),
            uiUpdate: successfulResults.map(r => r.metrics.uiUpdateTime)
        };
        
        const stats = {};
        Object.keys(times).forEach(key => {
            const values = times[key];
            stats[key] = {
                min: Math.min(...values),
                max: Math.max(...values),
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                median: this.calculateMedian(values),
                stddev: this.calculateStandardDeviation(values)
            };
        });
        
        return stats;
    }
    
    calculateMemoryStats() {
        const successfulResults = this.results.filter(r => r.success);
        if (successfulResults.length === 0) {
            return null;
        }
        
        const memoryDeltas = successfulResults.map(r => r.metrics.memoryDelta);
        
        return {
            rss: {
                min: Math.min(...memoryDeltas.map(m => m.rss)),
                max: Math.max(...memoryDeltas.map(m => m.rss)),
                avg: memoryDeltas.reduce((sum, m) => sum + m.rss, 0) / memoryDeltas.length
            },
            heapUsed: {
                min: Math.min(...memoryDeltas.map(m => m.heapUsed)),
                max: Math.max(...memoryDeltas.map(m => m.heapUsed)),
                avg: memoryDeltas.reduce((sum, m) => sum + m.heapUsed, 0) / memoryDeltas.length
            },
            heapTotal: {
                min: Math.min(...memoryDeltas.map(m => m.heapTotal)),
                max: Math.max(...memoryDeltas.map(m => m.heapTotal)),
                avg: memoryDeltas.reduce((sum, m) => sum + m.heapTotal, 0) / memoryDeltas.length
            }
        };
    }
    
    calculateCPUStats() {
        const successfulResults = this.results.filter(r => r.success);
        if (successfulResults.length === 0) {
            return null;
        }
        
        const cpuUsages = successfulResults.map(r => r.metrics.cpuUsage);
        
        return {
            user: {
                min: Math.min(...cpuUsages.map(c => c.user)),
                max: Math.max(...cpuUsages.map(c => c.user)),
                avg: cpuUsages.reduce((sum, c) => sum + c.user, 0) / cpuUsages.length
            },
            system: {
                min: Math.min(...cpuUsages.map(c => c.system)),
                max: Math.max(...cpuUsages.map(c => c.system)),
                avg: cpuUsages.reduce((sum, c) => sum + c.system, 0) / cpuUsages.length
            }
        };
    }
    
    identifyBottlenecks() {
        const bottlenecks = [];
        const performance = this.calculatePerformanceStats();
        
        if (!performance) {
            return bottlenecks;
        }
        
        // 総合処理時間ボトルネック
        if (performance.total.avg > 3000) { // 3秒以上
            bottlenecks.push({
                type: 'processing_time',
                severity: 'high',
                description: `総合処理時間が目標値(3000ms)を超過: 平均${performance.total.avg.toFixed(0)}ms`,
                impact: 'ユーザー体験の大幅な悪化'
            });
        }
        
        // 初期化時間ボトルネック
        if (performance.init.avg > 1000) { // 1秒以上
            bottlenecks.push({
                type: 'initialization_time',
                severity: 'medium',
                description: `初期化時間が目標値(1000ms)を超過: 平均${performance.init.avg.toFixed(0)}ms`,
                impact: 'アプリケーション起動の遅延'
            });
        }
        
        // 分析時間ボトルネック
        if (performance.analysis.avg > 2000) { // 2秒以上
            bottlenecks.push({
                type: 'analysis_time',
                severity: 'high',
                description: `テキスト分析時間が過大: 平均${performance.analysis.avg.toFixed(0)}ms`,
                impact: '分析レスポンスの大幅な遅延'
            });
        }
        
        // 処理時間のばらつきボトルネック
        if (performance.total.stddev > performance.total.avg * 0.3) {
            bottlenecks.push({
                type: 'performance_inconsistency',
                severity: 'medium',
                description: `処理時間のばらつきが大きい: 標準偏差${performance.total.stddev.toFixed(0)}ms`,
                impact: '予測困難なパフォーマンス'
            });
        }
        
        return bottlenecks;
    }
    
    generateRecommendations() {
        const recommendations = [];
        const performance = this.calculatePerformanceStats();
        const bottlenecks = this.identifyBottlenecks();
        
        if (!performance) {
            return recommendations;
        }
        
        // 総合パフォーマンス改善
        if (performance.total.avg > 2500) {
            recommendations.push({
                category: 'performance',
                priority: 'high',
                title: '並列処理の導入',
                description: 'SituationalContextEngineとHexagramMappingEngineの並列実行により処理時間を短縮',
                expectedImpact: '20-30%の処理時間短縮',
                implementation: 'Web Workers またはPromise.allを使用した並列処理'
            });
        }
        
        // 初期化最適化
        if (performance.init.avg > 800) {
            recommendations.push({
                category: 'initialization',
                priority: 'medium',
                title: '遅延初期化の実装',
                description: '必要な時点でのみエンジンを初期化することで起動時間を短縮',
                expectedImpact: '30-50%の初期化時間短縮',
                implementation: 'Lazy loading pattern の実装'
            });
        }
        
        // メモリ最適化
        const memoryStats = this.calculateMemoryStats();
        if (memoryStats && memoryStats.heapUsed.avg > 10 * 1024 * 1024) { // 10MB以上
            recommendations.push({
                category: 'memory',
                priority: 'medium',
                title: 'メモリ使用量の最適化',
                description: '不要なオブジェクトの早期解放とデータ構造の最適化',
                expectedImpact: '15-25%のメモリ使用量削減',
                implementation: 'WeakMap/WeakSetの活用、オブジェクトプールの実装'
            });
        }
        
        // キャッシュ機能
        if (performance.analysis.avg > 1500) {
            recommendations.push({
                category: 'caching',
                priority: 'high',
                title: '分析結果キャッシュの実装',
                description: '同様のテキストに対する分析結果をキャッシュして再利用',
                expectedImpact: '50-70%の分析時間短縮（キャッシュヒット時）',
                implementation: 'LRUキャッシュまたはブラウザストレージの活用'
            });
        }
        
        // エラーハンドリング改善
        const failedTests = this.results.filter(r => !r.success).length;
        if (failedTests > 0) {
            recommendations.push({
                category: 'reliability',
                priority: 'high',
                title: 'エラーハンドリングの強化',
                description: `${failedTests}回のテスト失敗を改善するためのエラー処理強化`,
                expectedImpact: '信頼性とユーザー体験の向上',
                implementation: 'try-catch文の追加、フォールバック処理の実装'
            });
        }
        
        return recommendations;
    }
    
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
    
    async saveResults(analysis) {
        const outputPath = path.resolve(this.options.outputPath);
        const reportData = {
            timestamp: new Date().toISOString(),
            options: this.options,
            analysis: analysis
        };
        
        try {
            await fs.promises.writeFile(outputPath, JSON.stringify(reportData, null, 2), 'utf8');
            this.log(`結果を保存しました: ${outputPath}`, 'INFO');
        } catch (error) {
            this.log(`結果保存エラー: ${error.message}`, 'ERROR');
            throw error;
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// コマンドライン引数パース
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '--scenario' && i + 1 < args.length) {
            options.scenario = args[++i];
        } else if (arg === '--iterations' && i + 1 < args.length) {
            options.iterations = parseInt(args[++i], 10);
        } else if (arg === '--output' && i + 1 < args.length) {
            options.outputPath = args[++i];
        } else if (arg === '--verbose') {
            options.verbose = true;
        } else if (arg === '--help') {
            console.log(`
HAQEI Future Simulator パフォーマンス分析ツール

使用方法: node scripts/run-performance-analysis.js [options]

オプション:
  --scenario light|medium|heavy  テストシナリオを指定 (デフォルト: medium)
  --iterations N                 実行回数を指定 (デフォルト: 5)
  --output path                  結果出力ファイルパス (デフォルト: performance-report.json)
  --verbose                      詳細ログを表示
  --help                         このヘルプを表示

例:
  node scripts/run-performance-analysis.js --scenario heavy --iterations 10 --verbose
  node scripts/run-performance-analysis.js --output reports/perf-$(date +%Y%m%d).json
            `);
            process.exit(0);
        }
    }
    
    return options;
}

// メイン実行
async function main() {
    try {
        const options = parseArgs();
        const analyzer = new NodePerformanceAnalyzer(options);
        
        console.log('🚀 HAQEI Future Simulator パフォーマンス分析開始');
        console.log('=' .repeat(60));
        
        const analysis = await analyzer.runAnalysis();
        
        console.log('=' .repeat(60));
        console.log('📊 分析結果サマリー:');
        console.log(`  成功したテスト: ${analysis.summary.successfulTests}/${analysis.summary.totalTests}`);
        
        if (analysis.performance) {
            console.log(`  平均処理時間: ${analysis.performance.total.avg.toFixed(0)}ms`);
            console.log(`  初期化時間: ${analysis.performance.init.avg.toFixed(0)}ms`);
            console.log(`  分析時間: ${analysis.performance.analysis.avg.toFixed(0)}ms`);
            console.log(`  マッピング時間: ${analysis.performance.mapping.avg.toFixed(0)}ms`);
        }
        
        if (analysis.bottlenecks.length > 0) {
            console.log(`  検出されたボトルネック: ${analysis.bottlenecks.length}件`);
            analysis.bottlenecks.forEach(bottleneck => {
                console.log(`    - ${bottleneck.description}`);
            });
        } else {
            console.log('  ✅ ボトルネックは検出されませんでした');
        }
        
        console.log(`  推奨改善策: ${analysis.recommendations.length}件`);
        analysis.recommendations.forEach(rec => {
            console.log(`    - [${rec.priority.toUpperCase()}] ${rec.title}`);
        });
        
        console.log('=' .repeat(60));
        console.log(`📄 詳細レポート: ${options.outputPath || 'performance-report.json'}`);
        console.log('✨ 分析完了');
        
    } catch (error) {
        console.error('❌ 分析エラー:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// スクリプト直接実行時のみmainを実行
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default NodePerformanceAnalyzer;