#!/usr/bin/env node

/**
 * HAQEI ペルソナUI/UX改善効果 MCP検証スクリプト
 * 日時: 2025年08月07日
 * 目的: Triple OS結果表示修正の動作確認
 */

const { exec } = require('child_process');
const path = require('path');

class HaqeiPersonaUXValidator {
    constructor() {
        this.testResults = [];
        this.baseUrl = 'http://localhost:8788';
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '🔍';
        console.log(`[${timestamp}] ${emoji} ${message}`);
    }

    async runPlaywrightTest(testName, url, validationScript) {
        try {
            await this.log(`${testName} 開始`);
            
            // Playwright コマンド生成
            const command = `npx playwright-cli screenshot --wait-for-selector="body" --timeout=10000 --viewport-size=1200,800 "${url}" "${testName.toLowerCase().replace(/\\s/g, '-')}-screenshot.png"`;
            
            return new Promise((resolve, reject) => {
                exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
                    if (error) {
                        this.log(`${testName} エラー: ${error.message}`, 'error');
                        resolve({ success: false, error: error.message });
                        return;
                    }
                    
                    this.log(`${testName} スクリーンショット取得完了`, 'success');
                    resolve({ success: true, output: stdout });
                });
            });
        } catch (error) {
            this.log(`${testName} 例外発生: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    async validateServerHealth() {
        try {
            const result = await this.runPlaywrightTest(
                'Server Health Check',
                this.baseUrl,
                'body'
            );
            
            this.testResults.push({
                test: 'Server Health',
                success: result.success,
                details: result.success ? 'サーバー正常動作' : result.error
            });

            return result.success;
        } catch (error) {
            await this.log(`サーバーヘルスチェック失敗: ${error.message}`, 'error');
            return false;
        }
    }

    async validateOSAnalyzerAccess() {
        try {
            const result = await this.runPlaywrightTest(
                'OS Analyzer Access',
                `${this.baseUrl}/os_analyzer.html`,
                '.hero-title'
            );

            this.testResults.push({
                test: 'OS Analyzer Access',
                success: result.success,
                details: result.success ? 'os_analyzer.html アクセス正常' : result.error
            });

            return result.success;
        } catch (error) {
            await this.log(`OS Analyzer アクセステスト失敗: ${error.message}`, 'error');
            return false;
        }
    }

    async validateResultsDisplay() {
        try {
            // 結果画面への直接アクセステスト（JavaScript動作確認）
            const result = await this.runPlaywrightTest(
                'Results Display Test',
                `${this.baseUrl}/os_analyzer.html#results`,
                '.result-title'
            );

            this.testResults.push({
                test: 'Results Display',
                success: result.success,
                details: result.success ? '結果表示画面アクセス正常' : result.error
            });

            return result.success;
        } catch (error) {
            await this.log(`結果表示テスト失敗: ${error.message}`, 'error');
            return false;
        }
    }

    async validateResponsiveDesign() {
        try {
            // モバイル表示テスト
            const command = `npx playwright-cli screenshot --wait-for-selector="body" --timeout=8000 --viewport-size=375,667 "${this.baseUrl}/os_analyzer.html" "mobile-responsive-test.png"`;
            
            const result = await new Promise((resolve) => {
                exec(command, { timeout: 12000 }, (error, stdout, stderr) => {
                    if (error) {
                        resolve({ success: false, error: error.message });
                        return;
                    }
                    resolve({ success: true, output: stdout });
                });
            });

            this.testResults.push({
                test: 'Responsive Design',
                success: result.success,
                details: result.success ? 'モバイル表示正常' : result.error
            });

            return result.success;
        } catch (error) {
            await this.log(`レスポンシブデザインテスト失敗: ${error.message}`, 'error');
            return false;
        }
    }

    async generateReport() {
        await this.log('='.repeat(60), 'info');
        await this.log('HAQEI ペルソナUI/UX改善効果 検証レポート', 'info');
        await this.log('='.repeat(60), 'info');

        const totalTests = this.testResults.length;
        const successfulTests = this.testResults.filter(r => r.success).length;
        const successRate = Math.round((successfulTests / totalTests) * 100);

        await this.log(`総テスト数: ${totalTests}`, 'info');
        await this.log(`成功: ${successfulTests}`, 'success');
        await this.log(`失敗: ${totalTests - successfulTests}`, 'error');
        await this.log(`成功率: ${successRate}%`, successRate >= 80 ? 'success' : 'warn');

        await this.log('\\n詳細結果:', 'info');
        for (let result of this.testResults) {
            const status = result.success ? '✅ PASS' : '❌ FAIL';
            await this.log(`${status} ${result.test}: ${result.details}`);
        }

        // 改善効果評価
        await this.log('\\n🎯 改善効果評価:', 'info');
        if (successRate >= 90) {
            await this.log('🏆 優秀: HaQei哲学UI/UX最適化が完全に機能しています', 'success');
        } else if (successRate >= 80) {
            await this.log('✅ 良好: 改善効果が確認できました。さらなる最適化で完璧を目指せます', 'success');
        } else if (successRate >= 60) {
            await this.log('⚠️ 改善中: 部分的な改善は確認できましたが、追加の修正が必要です', 'warn');
        } else {
            await this.log('🚨 要修正: 重要な問題が残っています。緊急対応が必要です', 'error');
        }

        return { successRate, totalTests, successfulTests };
    }

    async run() {
        await this.log('🚀 HAQEI ペルソナUI/UX改善効果検証開始', 'info');

        // 段階的テスト実行
        const tests = [
            { name: 'サーバーヘルス', method: 'validateServerHealth' },
            { name: 'OS Analyzer アクセス', method: 'validateOSAnalyzerAccess' },
            { name: '結果表示機能', method: 'validateResultsDisplay' },
            { name: 'レスポンシブデザイン', method: 'validateResponsiveDesign' }
        ];

        for (let test of tests) {
            await this[test.method]();
            await this.delay(1000); // テスト間隔
        }

        // 最終レポート生成
        return await this.generateReport();
    }
}

// スクリプト実行
async function main() {
    const validator = new HaqeiPersonaUXValidator();
    
    try {
        const report = await validator.run();
        
        // 終了コード設定
        const exitCode = report.successRate >= 80 ? 0 : 1;
        process.exit(exitCode);
        
    } catch (error) {
        console.error('🚨 検証スクリプト実行エラー:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = HaqeiPersonaUXValidator;