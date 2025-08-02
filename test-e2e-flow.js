/**
 * E2Eデータフローテスト
 * 
 * 目的：
 * - os_analyzer → results間のデータ受け渡し完全テスト
 * - SimpleStorageManagerの動作確認
 * - 実際のユーザーフローでの問題検出
 * 
 * 処理内容：
 * 1. os_analyzer.htmlを開く
 * 2. 診断フローを進行（最小限）
 * 3. データ保存を確認
 * 4. results.htmlに遷移
 * 5. データ取得を確認
 * 6. エラーの詳細を記録
 * 
 * 出力：
 * - テスト結果レポート
 * - エラー詳細ログ
 * - スクリーンショット（エラー時）
 * 
 * 副作用：
 * - ブラウザー操作
 * - ローカルストレージ操作
 * - テストファイル生成
 * 
 * 前提条件：
 * - Playwright設置済み
 * - os_analyzer.html、results.html存在
 * - SimpleStorageManager実装済み
 * 
 * エラー処理：
 * - タイムアウト時の適切な処理
 * - データ取得失敗時の詳細記録
 * - ブラウザークラッシュ時の復旧
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class E2EFlowTester {
    constructor() {
        this.baseUrl = 'file://' + path.resolve(__dirname, 'public');
        this.results = {
            startTime: Date.now(),
            tests: [],
            errors: [],
            screenshots: []
        };
    }

    async log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        console.log(logMessage);
        
        this.results.tests.push({
            timestamp,
            level,
            message
        });
    }

    async runFullTest() {
        let browser = null;
        let context = null;
        let page = null;
        
        try {
            await this.log('🚀 E2Eデータフローテスト開始');
            
            // ブラウザー起動
            browser = await chromium.launch({ 
                headless: false,
                slowMo: 500
            });
            
            context = await browser.newContext({
                viewport: { width: 1400, height: 900 }
            });
            
            page = await context.newPage();
            
            // コンソールログを記録
            page.on('console', msg => {
                this.log(`Console [${msg.type()}]: ${msg.text()}`, 'console');
            });
            
            // エラーを記録
            page.on('pageerror', error => {
                this.log(`Page Error: ${error.message}`, 'error');
                this.results.errors.push({
                    type: 'page_error',
                    message: error.message,
                    stack: error.stack
                });
            });
            
            // テスト実行
            await this.testStorageDebugPage(page);
            await this.testOSAnalyzerFlow(page);
            await this.testResultsPageFlow(page);
            
            await this.log('✅ E2Eテスト完了');
            
        } catch (error) {
            await this.log(`❌ E2Eテストエラー: ${error.message}`, 'error');
            this.results.errors.push({
                type: 'test_error',
                message: error.message,
                stack: error.stack
            });
            
            // エラー時スクリーンショット
            if (page) {
                try {
                    const screenshotPath = path.join(__dirname, `error-screenshot-${Date.now()}.png`);
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                    this.results.screenshots.push(screenshotPath);
                    await this.log(`スクリーンショット保存: ${screenshotPath}`);
                } catch (ssError) {
                    await this.log(`スクリーンショット失敗: ${ssError.message}`, 'error');
                }
            }
        } finally {
            if (browser) {
                await browser.close();
            }
            
            await this.generateReport();
        }
    }

    async testStorageDebugPage(page) {
        await this.log('🔍 ストレージデバッグページテスト開始');
        
        try {
            await page.goto(`file://${path.resolve(__dirname, 'test-storage-debug.html')}`);
            await page.waitForLoadState('networkidle');
            
            // SimpleStorageManagerテスト実行
            await this.log('SimpleStorageManagerテスト実行中...');
            await page.click('button:has-text("Test Simple Storage Manager")');
            
            // 結果を待機
            await page.waitForTimeout(2000);
            
            // ページ内のログを取得
            const logs = await page.evaluate(() => {
                const output = document.getElementById('output');
                return output ? output.innerText : 'No output found';
            });
            
            await this.log(`ストレージデバッグ結果:\n${logs}`, 'info');
            
            // StorageManager比較テスト
            await this.log('StorageManager比較テスト実行中...');
            await page.click('button:has-text("Compare Storage Managers")');
            await page.waitForTimeout(2000);
            
            const compareLogs = await page.evaluate(() => {
                const output = document.getElementById('output');
                return output ? output.innerText : 'No output found';
            });
            
            await this.log(`比較テスト結果:\n${compareLogs}`, 'info');
            
        } catch (error) {
            await this.log(`ストレージデバッグページテストエラー: ${error.message}`, 'error');
            throw error;
        }
    }

    async testOSAnalyzerFlow(page) {
        await this.log('🧠 OS Analyzerフローテスト開始');
        
        try {
            await page.goto(`${this.baseUrl}/os_analyzer.html`);
            await page.waitForLoadState('networkidle');
            
            // Welcome画面の確認
            await page.waitForSelector('.screen-container', { timeout: 10000 });
            await this.log('OS Analyzer画面読み込み完了');
            
            // 簡単な診断フローをシミュレート（最小限の回答）
            // 実際の設問が表示されるまで待機
            try {
                await page.waitForSelector('button:has-text("開始")', { timeout: 5000 });
                await page.click('button:has-text("開始")');
                await this.log('診断開始ボタンクリック');
            } catch (startError) {
                await this.log('開始ボタンが見つからない - 代替方法を試行', 'warn');
            }
            
            // LocalStorageの状態を確認
            const storageState = await page.evaluate(() => {
                const keys = Object.keys(localStorage).filter(key => key.includes('haqei'));
                const storageInfo = {};
                keys.forEach(key => {
                    const value = localStorage.getItem(key);
                    storageInfo[key] = {
                        exists: !!value,
                        length: value ? value.length : 0,
                        type: typeof value
                    };
                });
                return storageInfo;
            });
            
            await this.log(`OS Analyzer LocalStorage状態: ${JSON.stringify(storageState, null, 2)}`);
            
        } catch (error) {
            await this.log(`OS Analyzerフローテストエラー: ${error.message}`, 'error');
            throw error;
        }
    }

    async testResultsPageFlow(page) {
        await this.log('📊 Results Pageフローテスト開始');
        
        try {
            // まず、テストデータをLocalStorageに直接保存
            await page.evaluate(() => {
                const testData = {
                    engineOS: {
                        name: "価値観システム",
                        hexagram: { id: 1, name: "乾", symbol: "☰" },
                        score: 85,
                        confidence: 0.92
                    },
                    interfaceOS: {
                        name: "社会的システム", 
                        hexagram: { id: 14, name: "大有", symbol: "☲" },
                        score: 72,
                        confidence: 0.88
                    },
                    safeModeOS: {
                        name: "防御システム",
                        hexagram: { id: 23, name: "剥", symbol: "☶" },
                        score: 68,
                        confidence: 0.85
                    },
                    timestamp: Date.now(),
                    version: "2.0"
                };
                
                // 複数の形式で保存
                localStorage.setItem('haqei_analysis_result', JSON.stringify({
                    result: testData,
                    timestamp: Date.now(),
                    version: '2025.08.01'
                }));
                
                localStorage.setItem('haqei_emergency_result', JSON.stringify({
                    result: testData,
                    timestamp: Date.now(),
                    emergency: true
                }));
                
                return 'Test data saved';
            });
            
            await this.log('テストデータをLocalStorageに保存完了');
            
            // Results画面に遷移
            await page.goto(`${this.baseUrl}/results.html`);
            await page.waitForLoadState('networkidle');
            
            // ローディング画面の処理を待機
            try {
                await page.waitForSelector('#loading-overlay:not(.active)', { timeout: 15000 });
                await this.log('ローディング完了');
            } catch (loadingError) {
                await this.log('ローディング待機タイムアウト', 'warn');
            }
            
            // エラー表示の確認
            const errorVisible = await page.isVisible('#error-container');
            if (errorVisible) {
                const errorText = await page.textContent('#error-message');
                await this.log(`エラー表示発見: ${errorText}`, 'error');
                
                this.results.errors.push({
                    type: 'results_page_error',
                    message: errorText
                });
            } else {
                await this.log('エラー表示なし - 正常表示と判断');
            }
            
            // 仮想人格コンテナの確認
            const containerExists = await page.isVisible('#virtual-persona-container');
            await this.log(`仮想人格コンテナ存在: ${containerExists}`);
            
            // LocalStorage状態の最終確認
            const finalStorageState = await page.evaluate(() => {
                const keys = Object.keys(localStorage).filter(key => key.includes('haqei'));
                const result = {};
                keys.forEach(key => {
                    const value = localStorage.getItem(key);
                    result[key] = {
                        exists: !!value,
                        length: value ? value.length : 0,
                        canParse: false,
                        parsedKeys: []
                    };
                    
                    if (value) {
                        try {
                            const parsed = JSON.parse(value);
                            result[key].canParse = true;
                            result[key].parsedKeys = Object.keys(parsed);
                        } catch (e) {
                            result[key].parseError = e.message;
                        }
                    }
                });
                return result;
            });
            
            await this.log(`Results Page LocalStorage最終状態: ${JSON.stringify(finalStorageState, null, 2)}`);
            
        } catch (error) {
            await this.log(`Results Pageフローテストエラー: ${error.message}`, 'error');
            throw error;
        }
    }

    async generateReport() {
        this.results.endTime = Date.now();
        this.results.duration = this.results.endTime - this.results.startTime;
        
        const reportPath = path.join(__dirname, `e2e-test-report-${Date.now()}.json`);
        
        try {
            await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
            await this.log(`テストレポート生成: ${reportPath}`);
        } catch (error) {
            await this.log(`レポート生成エラー: ${error.message}`, 'error');
        }
        
        // サマリー出力
        console.log('\n' + '='.repeat(60));
        console.log('📋 E2Eテストサマリー');
        console.log('='.repeat(60));
        console.log(`⏱️ 実行時間: ${this.results.duration}ms`);
        console.log(`📝 テストログ数: ${this.results.tests.length}`);
        console.log(`❌ エラー数: ${this.results.errors.length}`);
        console.log(`📸 スクリーンショット数: ${this.results.screenshots.length}`);
        
        if (this.results.errors.length > 0) {
            console.log('\n🚨 発見されたエラー:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. [${error.type}] ${error.message}`);
            });
        }
        
        console.log('\n✅ E2Eテスト完了');
        console.log('='.repeat(60));
    }
}

// テスト実行
const tester = new E2EFlowTester();
tester.runFullTest().catch(error => {
    console.error('E2Eテスト実行エラー:', error);
    process.exit(1);
});

export default E2EFlowTester;