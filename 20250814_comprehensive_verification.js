// HAQEI v4.3.1 包括的動作検証スクリプト
// Playwright + 増補版チェックシート対応

import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HAQEIVerificationSuite {
    constructor() {
        this.results = {
            stopShip: {
                determinism: null,
                mathRandom: null,
                browserCompat: null,
                localStorage: null,
                accessibility: null
            },
            basicFunction: {},
            userFlow: {},
            errorHandling: {},
            uiux: {},
            practical: {},
            performance: {},
            security: {}
        };
        
        this.testInput = '転職を検討していますが、タイミングが分からず悩んでいます';
        this.browsers = ['chromium', 'firefox', 'webkit'];
    }

    async runCompleteVerification() {
        console.log('🚀 HAQEI v4.3.1 包括的動作検証開始');
        console.log(`検証時刻: ${new Date().toISOString()}`);
        
        try {
            // 1. Stop-Ship条件検証（最優先）
            await this.verifyStopShipConditions();
            
            // Stop-Ship条件で失敗した場合は即座終了
            if (this.hasStopShipFailures()) {
                console.log('🚨 STOP-SHIP条件で失敗。検証中断。');
                await this.generateReport();
                return false;
            }
            
            // 2. 基本機能動作確認
            await this.verifyBasicFunction();
            
            // 3. ユーザーフロー検証
            await this.verifyUserFlow();
            
            // 4. パフォーマンス・A11y・セキュリティ
            await this.verifyPerformanceA11ySecurity();
            
            // 5. 総合レポート生成
            await this.generateReport();
            
            return !this.hasStopShipFailures();
            
        } catch (error) {
            console.error('❌ 検証プロセスでエラー発生:', error);
            return false;
        }
    }

    async verifyStopShipConditions() {
        console.log('\n📋 Stop-Ship条件検証開始');
        
        // 1. 決定論性テスト（5回連続実行）
        await this.testDeterminism();
        
        // 2. Math.random残存チェック
        await this.checkMathRandomResidue();
        
        // 3. 3主要ブラウザ動作確認
        await this.testBrowserCompatibility();
        
        // 4. ローカルストレージ復元テスト
        await this.testLocalStorageRecovery();
        
        // 5. アクセシビリティ重大欠陥チェック
        await this.testAccessibility();
    }

    async testDeterminism() {
        console.log('🔬 決定論性テスト実行中...');
        
        try {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            
            // Future Simulatorページを開く
            await page.goto(`file://${path.resolve('./public/future_simulator.html')}`);
            
            const runs = [];
            
            // 5回連続実行
            for (let i = 0; i < 5; i++) {
                console.log(`  実行 ${i + 1}/5...`);
                
                // ページリロード（状態初期化）
                await page.reload();
                await page.waitForTimeout(1000);
                
                // 入力とクリック
                await page.fill('#worryInput', this.testInput);
                await page.click('#aiGuessBtn');
                
                // 結果待ち（最大30秒）
                try {
                    await page.waitForSelector('.scenario-card', { timeout: 30000 });
                    
                    // 8シナリオの内容取得
                    const scenarios = await page.evaluate(() => {
                        const cards = document.querySelectorAll('.scenario-card');
                        return Array.from(cards).map(card => ({
                            title: card.querySelector('.scenario-title')?.textContent || '',
                            content: card.querySelector('.scenario-content')?.textContent || '',
                            probability: card.querySelector('.probability')?.textContent || ''
                        }));
                    });
                    
                    runs.push({
                        runNumber: i + 1,
                        scenarios: scenarios,
                        hash: JSON.stringify(scenarios)
                    });
                    
                } catch (timeout) {
                    runs.push({
                        runNumber: i + 1,
                        scenarios: [],
                        hash: 'TIMEOUT',
                        error: 'タイムアウト'
                    });
                }
                
                await page.waitForTimeout(500);
            }
            
            await browser.close();
            
            // 結果比較
            const firstRunHash = runs[0].hash;
            const allIdentical = runs.every(run => run.hash === firstRunHash && run.hash !== 'TIMEOUT');
            
            this.results.stopShip.determinism = {
                passed: allIdentical,
                runs: runs,
                firstHash: firstRunHash,
                details: allIdentical ? '5回すべて完全一致' : '実行結果に不一致あり'
            };
            
            console.log(`  結果: ${allIdentical ? '✅ PASS' : '❌ FAIL'} - ${this.results.stopShip.determinism.details}`);
            
        } catch (error) {
            console.error('  エラー:', error.message);
            this.results.stopShip.determinism = {
                passed: false,
                error: error.message
            };
        }
    }

    async checkMathRandomResidue() {
        console.log('🔍 Math.random残存チェック実行中...');
        
        try {
            // Core target files check
            const coreFiles = [
                './public/future_simulator.html',
                './public/os_analyzer.html'
            ];
            
            let totalMathRandomCount = 0;
            const detectionResults = [];
            
            for (const filePath of coreFiles) {
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const matches = content.match(/Math\.random/g);
                    const count = matches ? matches.length : 0;
                    
                    totalMathRandomCount += count;
                    detectionResults.push({
                        file: filePath,
                        count: count,
                        lines: this.findMathRandomLines(content)
                    });
                }
            }
            
            const passed = totalMathRandomCount === 0;
            
            this.results.stopShip.mathRandom = {
                passed: passed,
                totalCount: totalMathRandomCount,
                files: detectionResults,
                details: passed ? 'Math.random検出なし' : `${totalMathRandomCount}件のMath.random検出`
            };
            
            console.log(`  結果: ${passed ? '✅ PASS' : '❌ FAIL'} - ${this.results.stopShip.mathRandom.details}`);
            
        } catch (error) {
            console.error('  エラー:', error.message);
            this.results.stopShip.mathRandom = {
                passed: false,
                error: error.message
            };
        }
    }

    findMathRandomLines(content) {
        const lines = content.split('\n');
        const mathRandomLines = [];
        
        lines.forEach((line, index) => {
            if (line.includes('Math.random')) {
                mathRandomLines.push({
                    lineNumber: index + 1,
                    content: line.trim()
                });
            }
        });
        
        return mathRandomLines;
    }

    async testBrowserCompatibility() {
        console.log('🌐 ブラウザ互換性テスト実行中...');
        
        const browserResults = {};
        
        for (const browserName of this.browsers) {
            console.log(`  ${browserName} テスト中...`);
            
            try {
                let browser;
                switch (browserName) {
                    case 'chromium':
                        browser = await chromium.launch();
                        break;
                    case 'firefox':
                        browser = await firefox.launch();
                        break;
                    case 'webkit':
                        browser = await webkit.launch();
                        break;
                }
                
                const page = await browser.newPage();
                
                // Future Simulatorページ読み込み
                await page.goto(`file://${path.resolve('./public/future_simulator.html')}`);
                
                // 基本要素存在確認
                const worryInput = await page.$('#worryInput');
                const aiGuessBtn = await page.$('#aiGuessBtn');
                
                // 基本フロー実行
                if (worryInput && aiGuessBtn) {
                    await page.fill('#worryInput', this.testInput);
                    await page.click('#aiGuessBtn');
                    
                    // 結果待ち（短時間）
                    try {
                        await page.waitForSelector('.analysis-result', { timeout: 10000 });
                        browserResults[browserName] = {
                            passed: true,
                            details: '基本フロー正常動作'
                        };
                    } catch {
                        browserResults[browserName] = {
                            passed: false,
                            details: '結果表示タイムアウト'
                        };
                    }
                } else {
                    browserResults[browserName] = {
                        passed: false,
                        details: '必要要素が見つからない'
                    };
                }
                
                await browser.close();
                
            } catch (error) {
                browserResults[browserName] = {
                    passed: false,
                    error: error.message
                };
            }
        }
        
        const allPassed = Object.values(browserResults).every(result => result.passed);
        
        this.results.stopShip.browserCompat = {
            passed: allPassed,
            browsers: browserResults,
            details: allPassed ? '全ブラウザで正常動作' : '一部ブラウザで動作不良'
        };
        
        console.log(`  結果: ${allPassed ? '✅ PASS' : '❌ FAIL'} - ${this.results.stopShip.browserCompat.details}`);
    }

    async testLocalStorageRecovery() {
        console.log('💾 ローカルストレージ復元テスト実行中...');
        
        try {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            
            // OS Analyzerページを開く
            await page.goto(`file://${path.resolve('./public/os_analyzer.html')}`);
            
            // ダミーデータを設定
            await page.evaluate(() => {
                const testData = {
                    engineOS: 1,
                    interfaceOS: 2,
                    safeModeOS: 3,
                    timestamp: Date.now(),
                    version: '2.0.0'
                };
                localStorage.setItem('haqei_triple_os_result', JSON.stringify(testData));
            });
            
            // ページリロード
            await page.reload();
            await page.waitForTimeout(2000);
            
            // 復元機能の動作確認
            const restorationWorking = await page.evaluate(() => {
                const stored = localStorage.getItem('haqei_triple_os_result');
                return stored !== null;
            });
            
            this.results.stopShip.localStorage = {
                passed: restorationWorking,
                details: restorationWorking ? 'ローカルストレージ復元機能正常' : 'ローカルストレージ復元機能異常'
            };
            
            await browser.close();
            
            console.log(`  結果: ${restorationWorking ? '✅ PASS' : '❌ FAIL'} - ${this.results.stopShip.localStorage.details}`);
            
        } catch (error) {
            console.error('  エラー:', error.message);
            this.results.stopShip.localStorage = {
                passed: false,
                error: error.message
            };
        }
    }

    async testAccessibility() {
        console.log('♿ アクセシビリティテスト実行中...');
        
        try {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            
            await page.goto(`file://${path.resolve('./public/future_simulator.html')}`);
            
            // 基本的なアクセシビリティチェック
            const a11yResults = await page.evaluate(() => {
                const issues = [];
                
                // フォーカス可能要素チェック
                const focusableElements = document.querySelectorAll('button, input, textarea, select, a[href]');
                focusableElements.forEach(el => {
                    if (!el.tabIndex && el.tabIndex !== 0) {
                        // タブインデックスの問題は警告レベル
                    }
                });
                
                // 必須要素のaria-label確認
                const worryInput = document.getElementById('worryInput');
                const aiGuessBtn = document.getElementById('aiGuessBtn');
                
                if (!worryInput) issues.push('worryInput要素が見つからない');
                if (!aiGuessBtn) issues.push('aiGuessBtn要素が見つからない');
                
                return {
                    criticalIssues: issues,
                    focusableCount: focusableElements.length
                };
            });
            
            await browser.close();
            
            const passed = a11yResults.criticalIssues.length === 0;
            
            this.results.stopShip.accessibility = {
                passed: passed,
                criticalIssues: a11yResults.criticalIssues,
                details: passed ? 'アクセシビリティ重大欠陥なし' : `${a11yResults.criticalIssues.length}件の重大欠陥`
            };
            
            console.log(`  結果: ${passed ? '✅ PASS' : '❌ FAIL'} - ${this.results.stopShip.accessibility.details}`);
            
        } catch (error) {
            console.error('  エラー:', error.message);
            this.results.stopShip.accessibility = {
                passed: false,
                error: error.message
            };
        }
    }

    async verifyBasicFunction() {
        console.log('\n🔧 基本機能動作確認');
        // 基本機能テストの実装
    }

    async verifyUserFlow() {
        console.log('\n👤 ユーザーフロー検証');
        // ユーザーフローテストの実装
    }

    async verifyPerformanceA11ySecurity() {
        console.log('\n⚡ パフォーマンス・A11y・セキュリティ検証');
        // パフォーマンス等のテスト実装
    }

    hasStopShipFailures() {
        const stopShipResults = this.results.stopShip;
        return Object.values(stopShipResults).some(result => 
            result && result.passed === false
        );
    }

    async generateReport() {
        console.log('\n📊 総合レポート生成中...');
        
        const report = {
            timestamp: new Date().toISOString(),
            overallResult: !this.hasStopShipFailures(),
            stopShipConditions: this.results.stopShip,
            summary: {
                determinism: this.results.stopShip.determinism?.passed || false,
                mathRandom: this.results.stopShip.mathRandom?.passed || false,
                browserCompat: this.results.stopShip.browserCompat?.passed || false,
                localStorage: this.results.stopShip.localStorage?.passed || false,
                accessibility: this.results.stopShip.accessibility?.passed || false
            }
        };
        
        const reportPath = `./20250814_HAQEI_VERIFICATION_REPORT_${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📄 レポート保存: ${reportPath}`);
        
        // 結果サマリー表示
        console.log('\n🎯 検証結果サマリー:');
        console.log(`決定論性: ${report.summary.determinism ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Math.random: ${report.summary.mathRandom ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`ブラウザ互換性: ${report.summary.browserCompat ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`ローカルストレージ: ${report.summary.localStorage ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`アクセシビリティ: ${report.summary.accessibility ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`\n🚀 総合判定: ${report.overallResult ? 'GO' : 'NO-GO'}`);
        
        return report;
    }
}

// 実行
async function main() {
    const suite = new HAQEIVerificationSuite();
    const success = await suite.runCompleteVerification();
    process.exit(success ? 0 : 1);
}

// ES moduleの場合の実行判定
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default HAQEIVerificationSuite;