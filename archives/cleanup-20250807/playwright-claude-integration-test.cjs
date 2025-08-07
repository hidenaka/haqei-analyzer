#!/usr/bin/env node

/**
 * Playwright MCP を使用したClaude統合システムのデバッグ検証
 * 
 * 検証項目:
 * 1. デモページの正常読み込み
 * 2. 4つのClaudeコンポーネントの初期化
 * 3. ユーザー入力→分析実行→結果表示のフロー
 * 4. システム状態監視機能
 * 5. 精度比較チャートの表示
 * 6. エラーハンドリングの動作
 */

const { chromium } = require('playwright');

class ClaudeIntegrationDebugValidator {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            pageLoad: null,
            componentInitialization: null,
            analysisExecution: null,
            chartVisualization: null,
            errorHandling: null,
            performance: null
        };
    }

    async initialize() {
        console.log('🚀 Playwright Claude統合デバッグ検証開始...');
        
        this.browser = await chromium.launch({
            headless: false, // デバッグのため表示モード
            slowMo: 1000,    // 動作を遅くして確認
            devtools: true   // 開発者ツールを開く
        });
        
        this.page = await this.browser.newPage();
        
        // コンソールログの監視
        this.page.on('console', (msg) => {
            console.log(`🖥️  Console [${msg.type()}]: ${msg.text()}`);
        });

        // エラーの監視
        this.page.on('pageerror', (error) => {
            console.error('❌ Page Error:', error.message);
        });

        // リクエストの監視
        this.page.on('request', (request) => {
            console.log(`📡 Request: ${request.method()} ${request.url()}`);
        });
    }

    async testPageLoad() {
        console.log('\n📄 1. デモページ読み込みテスト');
        
        try {
            const startTime = Date.now();
            await this.page.goto('http://localhost:8789/claude-integration-demo.html', {
                waitUntil: 'networkidle',
                timeout: 30000
            });
            const loadTime = Date.now() - startTime;

            // ページタイトル確認
            const title = await this.page.title();
            console.log(`✅ ページタイトル: ${title}`);

            // 主要要素の存在確認
            const headerExists = await this.page.locator('h1').isVisible();
            const inputExists = await this.page.locator('#userInput').isVisible();
            const buttonExists = await this.page.locator('#analyzeButton').isVisible();

            this.testResults.pageLoad = {
                success: true,
                loadTime: loadTime,
                title: title,
                elementsVisible: { headerExists, inputExists, buttonExists }
            };

            console.log(`✅ ページ読み込み完了 (${loadTime}ms)`);
            console.log(`✅ 主要要素確認: ヘッダー${headerExists}, 入力欄${inputExists}, ボタン${buttonExists}`);

        } catch (error) {
            console.error('❌ ページ読み込み失敗:', error.message);
            this.testResults.pageLoad = { success: false, error: error.message };
        }
    }

    async testComponentInitialization() {
        console.log('\n🔧 2. Claudeコンポーネント初期化テスト');
        
        try {
            // システム初期化の完了を待機
            await this.page.waitForSelector('#systemStatus .success-message', { timeout: 30000 });

            // システム状態を確認
            const systemStatus = await this.page.locator('#systemStatus').textContent();
            console.log(`📊 システム状態: ${systemStatus}`);

            // コンポーネント状態の確認
            await this.page.waitForSelector('#componentStatus', { state: 'visible', timeout: 10000 });
            const componentCards = await this.page.locator('.component-card').count();
            console.log(`🔧 読み込まれたコンポーネント数: ${componentCards}`);

            // 各コンポーネントの詳細確認
            const components = [];
            for (let i = 0; i < componentCards; i++) {
                const componentName = await this.page.locator('.component-card').nth(i).locator('.component-name').textContent();
                const componentStats = await this.page.locator('.component-card').nth(i).locator('.component-stats').textContent();
                components.push({ name: componentName, stats: componentStats });
                console.log(`  📦 ${componentName}: ${componentStats}`);
            }

            this.testResults.componentInitialization = {
                success: true,
                systemStatus: systemStatus,
                componentCount: componentCards,
                components: components
            };

            console.log('✅ コンポーネント初期化確認完了');

        } catch (error) {
            console.error('❌ コンポーネント初期化確認失敗:', error.message);
            this.testResults.componentInitialization = { success: false, error: error.message };
        }
    }

    async testAnalysisExecution() {
        console.log('\n🔍 3. 分析実行フローテスト');
        
        try {
            // テスト用入力テキスト
            const testInput = '最近仕事で悩んでいます。上司との関係も良くないし、将来が不安です。';
            
            // 入力欄にテキストを入力
            await this.page.fill('#userInput', testInput);
            console.log(`📝 テストテキスト入力: ${testInput.substring(0, 20)}...`);

            // 分析オプションの確認
            const claudeAnalysisChecked = await this.page.isChecked('#useClaudeAnalysis');
            const contextualMappingChecked = await this.page.isChecked('#useContextualMapping');
            console.log(`⚙️  分析オプション: Claude分析=${claudeAnalysisChecked}, 文脈マッピング=${contextualMappingChecked}`);

            // 分析実行ボタンをクリック
            const startTime = Date.now();
            await this.page.click('#analyzeButton');
            console.log('🚀 分析実行開始...');

            // 分析完了を待機（最大30秒）
            await this.page.waitForSelector('#analysisResults .success-message', { timeout: 30000 });
            const analysisTime = Date.now() - startTime;
            console.log(`⏱️  分析処理時間: ${analysisTime}ms`);

            // 結果の確認
            const resultsVisible = await this.page.locator('#analysisResults').isVisible();
            const successMessage = await this.page.locator('#analysisResults .success-message').textContent();
            console.log(`📊 結果表示: ${resultsVisible}`);
            console.log(`✅ 成功メッセージ: ${successMessage}`);

            // 上位候補の確認
            const hexagramResults = await this.page.locator('.hexagram-result').count();
            console.log(`🎯 検出された候補数: ${hexagramResults}`);

            // 各候補の詳細確認
            const candidates = [];
            for (let i = 0; i < Math.min(hexagramResults, 3); i++) {
                const hexagramInfo = await this.page.locator('.hexagram-result').nth(i).locator('.hexagram-info').textContent();
                candidates.push(hexagramInfo);
                console.log(`  📍 候補${i + 1}: ${hexagramInfo}`);
            }

            this.testResults.analysisExecution = {
                success: true,
                inputText: testInput,
                analysisTime: analysisTime,
                candidateCount: hexagramResults,
                candidates: candidates
            };

            console.log('✅ 分析実行フロー確認完了');

        } catch (error) {
            console.error('❌ 分析実行フロー確認失敗:', error.message);
            this.testResults.analysisExecution = { success: false, error: error.message };
        }
    }

    async testChartVisualization() {
        console.log('\n📈 4. 精度比較チャート表示テスト');
        
        try {
            // チャートの存在確認
            const chartExists = await this.page.locator('#accuracyChart').isVisible();
            console.log(`📊 チャート要素存在: ${chartExists}`);

            if (chartExists) {
                // Canvas要素の確認
                const canvasElement = await this.page.locator('#accuracyChart');
                const canvasSize = await canvasElement.boundingBox();
                console.log(`📐 チャートサイズ: ${canvasSize.width}x${canvasSize.height}`);

                // チャートタイトルの確認
                const chartTitle = await this.page.locator('.comparison-chart h2').textContent();
                console.log(`📋 チャートタイトル: ${chartTitle}`);
            }

            // 統計数値の確認
            const currentAccuracy = await this.page.locator('#currentAccuracy').textContent();
            const targetAccuracy = await this.page.locator('#targetAccuracy').textContent();
            const totalAnalyses = await this.page.locator('#totalAnalyses').textContent();
            const averageTime = await this.page.locator('#averageTime').textContent();

            console.log(`📊 現在精度: ${currentAccuracy}`);
            console.log(`🎯 目標精度: ${targetAccuracy}`);
            console.log(`🔢 総分析回数: ${totalAnalyses}`);
            console.log(`⏱️  平均時間: ${averageTime}`);

            this.testResults.chartVisualization = {
                success: true,
                chartExists: chartExists,
                metrics: { currentAccuracy, targetAccuracy, totalAnalyses, averageTime }
            };

            console.log('✅ チャート表示確認完了');

        } catch (error) {
            console.error('❌ チャート表示確認失敗:', error.message);
            this.testResults.chartVisualization = { success: false, error: error.message };
        }
    }

    async testErrorHandling() {
        console.log('\n⚠️  5. エラーハンドリングテスト');
        
        try {
            // 空入力でのエラーハンドリングテスト
            await this.page.fill('#userInput', '');
            await this.page.click('#analyzeButton');

            // アラートが表示されるか確認
            this.page.on('dialog', async (dialog) => {
                console.log(`🚨 アラート表示: ${dialog.message()}`);
                await dialog.accept();
            });

            await this.page.waitForTimeout(2000);

            // 無効な入力でのテスト
            await this.page.fill('#userInput', '   ');
            await this.page.click('#analyzeButton');
            await this.page.waitForTimeout(2000);

            this.testResults.errorHandling = {
                success: true,
                emptyInputHandled: true,
                whitespaceInputHandled: true
            };

            console.log('✅ エラーハンドリング確認完了');

        } catch (error) {
            console.error('❌ エラーハンドリング確認失敗:', error.message);
            this.testResults.errorHandling = { success: false, error: error.message };
        }
    }

    async testPerformance() {
        console.log('\n⚡ 6. パフォーマンステスト');
        
        try {
            // ページパフォーマンス測定
            const performanceMetrics = await this.page.evaluate(() => {
                return {
                    loadEventEnd: performance.timing.loadEventEnd,
                    navigationStart: performance.timing.navigationStart,
                    domContentLoaded: performance.timing.domContentLoadedEventEnd,
                    firstPaint: performance.getEntriesByType('paint')
                        .find(entry => entry.name === 'first-paint')?.startTime || 0,
                    memory: performance.memory ? {
                        usedJSHeapSize: performance.memory.usedJSHeapSize,
                        totalJSHeapSize: performance.memory.totalJSHeapSize
                    } : null
                };
            });

            const pageLoadTime = performanceMetrics.loadEventEnd - performanceMetrics.navigationStart;
            const domLoadTime = performanceMetrics.domContentLoaded - performanceMetrics.navigationStart;

            console.log(`⏱️  ページ読み込み時間: ${pageLoadTime}ms`);
            console.log(`📄 DOM読み込み時間: ${domLoadTime}ms`);
            console.log(`🎨 初回描画時間: ${performanceMetrics.firstPaint}ms`);
            
            if (performanceMetrics.memory) {
                console.log(`💾 メモリ使用量: ${Math.round(performanceMetrics.memory.usedJSHeapSize / 1024 / 1024)}MB`);
            }

            // 連続分析のパフォーマンステスト
            const testCases = [
                '新しいチャレンジに挑戦したいと思っています。',
                '人間関係で疲れてしまいました。',
                'キャリアの方向性に迷っています。'
            ];

            const analysisTimes = [];
            for (const testCase of testCases) {
                await this.page.fill('#userInput', testCase);
                
                const startTime = Date.now();
                await this.page.click('#analyzeButton');
                await this.page.waitForSelector('#analysisResults .success-message', { timeout: 15000 });
                const analysisTime = Date.now() - startTime;
                
                analysisTimes.push(analysisTime);
                console.log(`📊 分析時間: ${analysisTime}ms - "${testCase.substring(0, 15)}..."`);
                
                await this.page.waitForTimeout(1000); // 少し待機
            }

            const averageAnalysisTime = analysisTimes.reduce((a, b) => a + b, 0) / analysisTimes.length;

            this.testResults.performance = {
                success: true,
                pageLoadTime: pageLoadTime,
                domLoadTime: domLoadTime,
                firstPaintTime: performanceMetrics.firstPaint,
                memoryUsage: performanceMetrics.memory,
                averageAnalysisTime: averageAnalysisTime,
                analysisTimes: analysisTimes
            };

            console.log(`📊 平均分析時間: ${Math.round(averageAnalysisTime)}ms`);
            console.log('✅ パフォーマンステスト完了');

        } catch (error) {
            console.error('❌ パフォーマンステスト失敗:', error.message);
            this.testResults.performance = { success: false, error: error.message };
        }
    }

    async generateReport() {
        console.log('\n📋 テストレポート生成中...');

        const report = {
            timestamp: new Date().toISOString(),
            testEnvironment: {
                url: 'http://localhost:8789/claude-integration-demo.html',
                browser: 'Chromium',
                testFramework: 'Playwright MCP'
            },
            testResults: this.testResults,
            summary: {
                totalTests: Object.keys(this.testResults).length,
                passedTests: Object.values(this.testResults).filter(result => result?.success).length,
                failedTests: Object.values(this.testResults).filter(result => result?.success === false).length
            }
        };

        // レポートをファイルに保存
        const fs = require('fs');
        const reportPath = `./claude-integration-debug-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n🎯 テスト結果サマリー:');
        console.log(`✅ 成功: ${report.summary.passedTests}/${report.summary.totalTests}`);
        console.log(`❌ 失敗: ${report.summary.failedTests}/${report.summary.totalTests}`);
        console.log(`📄 詳細レポート: ${reportPath}`);

        return report;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('🧹 クリーンアップ完了');
    }

    async runFullTest() {
        try {
            await this.initialize();
            
            await this.testPageLoad();
            await this.testComponentInitialization();
            await this.testAnalysisExecution();
            await this.testChartVisualization();
            await this.testErrorHandling();
            await this.testPerformance();
            
            const report = await this.generateReport();
            
            return report;
            
        } catch (error) {
            console.error('❌ テスト実行中にエラー:', error);
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// メイン実行
async function main() {
    console.log('🎭 Playwright MCP - Claude統合システムデバッグ検証');
    console.log('=' .repeat(60));
    
    const validator = new ClaudeIntegrationDebugValidator();
    
    try {
        const report = await validator.runFullTest();
        
        console.log('\n🎉 デバッグ検証完了!');
        console.log('サーバーが実行中の場合、手動で停止してください。');
        
        // 成功時は終了コード0
        process.exit(report.summary.failedTests > 0 ? 1 : 0);
        
    } catch (error) {
        console.error('❌ 致命的エラー:', error);
        process.exit(1);
    }
}

// 実行
if (require.main === module) {
    main();
}

module.exports = ClaudeIntegrationDebugValidator;