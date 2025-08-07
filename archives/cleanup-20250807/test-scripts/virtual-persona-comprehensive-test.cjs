/**
 * 仮想人格プラットフォーム包括的テストスクリプト
 * 
 * 目的：
 * - 仮想人格対話プラットフォームの核心機能を包括的にテスト
 * - Triple OSの視覚化、対話システム、易経メタファーの検証
 * - 統合機能とパフォーマンスの評価
 * 
 * テスト対象：
 * 1. データセットアップとローカルストレージ機能
 * 2. Triple OSの視覚化（Engine/Interface/SafeMode）
 * 3. インタラクティブ対話システム
 * 4. 易経メタファー生成・表示
 * 5. 統合機能とパフォーマンス
 * 
 * @version 1.0.0
 * @date 2025-08-01
 * @author HAQEI Test Team
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

class VirtualPersonaTestSuite {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        this.testResults = [];
        this.startTime = Date.now();
        
        console.log('🎭 仮想人格プラットフォーム包括テスト開始');
        console.log(`📅 実行時刻: ${new Date().toISOString()}`);
        console.log(`🌐 テストURL: ${this.baseURL}`);
    }
    
    /**
     * HTTPリクエストのラッパー
     */
    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
            
            http.get(fullURL, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                });
            }).on('error', reject);
        });
    }
    
    /**
     * テスト結果の記録
     */
    recordTest(testName, passed, details = '', metrics = {}) {
        const result = {
            name: testName,
            passed,
            details,
            metrics,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${details}`);
        
        if (Object.keys(metrics).length > 0) {
            console.log(`   📊 メトリクス:`, metrics);
        }
    }
    
    /**
     * 1. サーバーとファイル構造のテスト
     */
    async testServerAndFiles() {
        console.log('\n🔍 == サーバーとファイル構造のテスト ==');
        
        // 基本ページの存在確認
        const pages = [
            '/results.html',
            '/debug-results.html', 
            '/test-setup-data.html',
            '/os_analyzer.html'
        ];
        
        for (const page of pages) {
            try {
                const response = await this.makeRequest(page);
                const passed = response.statusCode === 200;
                this.recordTest(
                    `ページ存在確認: ${page}`,
                    passed,
                    passed ? `ステータス: ${response.statusCode}` : `失敗: ${response.statusCode}`,
                    { statusCode: response.statusCode, contentLength: response.body.length }
                );
            } catch (error) {
                this.recordTest(
                    `ページ存在確認: ${page}`,
                    false,
                    `エラー: ${error.message}`
                );
            }
        }
        
        // 重要なJavaScriptファイルの確認
        const jsFiles = [
            '/js/components/VirtualPersonaResultsView.js',
            '/js/os-analyzer/core/VirtualPersonality.js',
            '/js/os-analyzer/core/TripleOSEngine.js',
            '/js/os-analyzer/core/OSRelationshipEngine.js',
            '/js/os-analyzer/core/IchingMetaphorEngine.js'
        ];
        
        for (const jsFile of jsFiles) {
            try {
                const response = await this.makeRequest(jsFile);
                const passed = response.statusCode === 200 && response.body.includes('class');
                this.recordTest(
                    `JSファイル確認: ${jsFile}`,
                    passed,
                    passed ? 'クラス定義を確認' : 'クラス定義が見つからない',
                    { statusCode: response.statusCode, hasClass: response.body.includes('class') }
                );
            } catch (error) {
                this.recordTest(
                    `JSファイル確認: ${jsFile}`,
                    false,
                    `エラー: ${error.message}`
                );
            }
        }
    }
    
    /**
     * 2. Triple OSアーキテクチャのテスト
     */
    async testTripleOSArchitecture() {
        console.log('\n🧠 == Triple OSアーキテクチャのテスト ==');
        
        try {
            // VirtualPersonaResultsView.jsの詳細解析
            const response = await this.makeRequest('/js/components/VirtualPersonaResultsView.js');
            const content = response.body;
            
            // Triple OS関連のメソッドやプロパティをチェック
            const tripleOSFeatures = [
                'engineOS',
                'interfaceOS', 
                'safeModeOS',
                'generateOSCards',
                'calculateOSMetrics',
                'visualizeRelationships',
                'initializeVirtualPersonality'
            ];
            
            let foundFeatures = 0;
            const featureDetails = [];
            
            for (const feature of tripleOSFeatures) {
                if (content.includes(feature)) {
                    foundFeatures++;
                    featureDetails.push(`✓ ${feature}`);
                } else {
                    featureDetails.push(`✗ ${feature}`);
                }
            }
            
            const passed = foundFeatures >= tripleOSFeatures.length * 0.8; // 80%以上で合格
            this.recordTest(
                'Triple OSアーキテクチャ実装確認',
                passed,
                `${foundFeatures}/${tripleOSFeatures.length} 機能を確認`,
                { 
                    foundFeatures, 
                    totalFeatures: tripleOSFeatures.length,
                    completionRate: (foundFeatures / tripleOSFeatures.length * 100).toFixed(1) + '%',
                    details: featureDetails
                }
            );
            
        } catch (error) {
            this.recordTest(
                'Triple OSアーキテクチャ実装確認',
                false,
                `エラー: ${error.message}`
            );
        }
    }
    
    /**
     * 3. 仮想人格対話機能のテスト
     */
    async testVirtualPersonaDialogue() {
        console.log('\n💬 == 仮想人格対話機能のテスト ==');
        
        try {
            // DialoguePlayer関連ファイルの確認
            const dialogueResponse = await this.makeRequest('/js/os-analyzer/components/DialoguePlayer.js');
            const dialogueContent = dialogueResponse.body;
            
            const dialogueFeatures = [
                'DialoguePlayer',
                'playScenario',
                'generateDialogueScenario',
                'scenario',
                'speaker',
                'message'
            ];
            
            let foundDialogueFeatures = 0;
            const dialogueDetails = [];
            
            for (const feature of dialogueFeatures) {
                if (dialogueContent.includes(feature)) {
                    foundDialogueFeatures++;
                    dialogueDetails.push(`✓ ${feature}`);
                } else {
                    dialogueDetails.push(`✗ ${feature}`);
                }
            }
            
            const passed = foundDialogueFeatures >= dialogueFeatures.length * 0.7;
            this.recordTest(
                '仮想人格対話機能実装確認',
                passed,
                `${foundDialogueFeatures}/${dialogueFeatures.length} 機能を確認`,
                { 
                    foundFeatures: foundDialogueFeatures,
                    totalFeatures: dialogueFeatures.length,
                    completionRate: (foundDialogueFeatures / dialogueFeatures.length * 100).toFixed(1) + '%',
                    details: dialogueDetails
                }
            );
            
        } catch (error) {
            this.recordTest(
                '仮想人格対話機能実装確認',
                false,
                `エラー: ${error.message}`
            );
        }
    }
    
    /**
     * 4. 易経メタファー機能のテスト
     */
    async testIChingMetaphor() {
        console.log('\n☯️ == 易経メタファー機能のテスト ==');
        
        try {
            // IchingMetaphorEngineの確認
            const response = await this.makeRequest('/js/os-analyzer/core/IchingMetaphorEngine.js');
            const content = response.body;
            
            const ichingFeatures = [
                'IchingMetaphorEngine',
                'generateMetaphor',
                'hexagram',
                'metaphor',
                'bunenjin',
                '易経'
            ];
            
            let foundIchingFeatures = 0;
            const ichingDetails = [];
            
            for (const feature of ichingFeatures) {
                if (content.includes(feature)) {
                    foundIchingFeatures++;
                    ichingDetails.push(`✓ ${feature}`);
                } else {
                    ichingDetails.push(`✗ ${feature}`);
                }
            }
            
            // hexagram_details.jsの確認
            const hexagramResponse = await this.makeRequest('/js/os-analyzer/data/hexagram_details.js');
            const hexagramData = hexagramResponse.statusCode === 200;
            
            const passed = foundIchingFeatures >= ichingFeatures.length * 0.6 && hexagramData;
            this.recordTest(
                '易経メタファー機能実装確認',
                passed,
                `${foundIchingFeatures}/${ichingFeatures.length} 機能を確認, hexagramデータ: ${hexagramData ? '有' : '無'}`,
                { 
                    foundFeatures: foundIchingFeatures,
                    totalFeatures: ichingFeatures.length,
                    hasHexagramData: hexagramData,
                    completionRate: (foundIchingFeatures / ichingFeatures.length * 100).toFixed(1) + '%',
                    details: ichingDetails
                }
            );
            
        } catch (error) {
            this.recordTest(
                '易経メタファー機能実装確認',
                false,
                `エラー: ${error.message}`
            );
        }
    }
    
    /**
     * 5. 統合機能とパフォーマンステスト
     */
    async testIntegrationAndPerformance() {
        console.log('\n⚡ == 統合機能とパフォーマンステスト ==');
        
        // CSS統合テスト
        try {
            const cssFiles = [
                '/css/virtual-persona-results.css',
                '/css/main.css',
                '/css/components.css',
                '/css/animations.css'
            ];
            
            let cssLoaded = 0;
            for (const cssFile of cssFiles) {
                try {
                    const response = await this.makeRequest(cssFile);
                    if (response.statusCode === 200) cssLoaded++;
                } catch (e) {
                    // CSS file not found, continue
                }
            }
            
            this.recordTest(
                'CSS統合確認',
                cssLoaded >= 2, // 最低2つのCSSファイルがあれば合格
                `${cssLoaded}/${cssFiles.length} CSSファイルを読み込み`
            );
            
        } catch (error) {
            this.recordTest(
                'CSS統合確認',
                false,
                `エラー: ${error.message}`
            );
        }
        
        // パフォーマンステスト（レスポンス時間）
        const performanceTests = [
            '/results.html',
            '/js/components/VirtualPersonaResultsView.js'
        ];
        
        for (const url of performanceTests) {
            try {
                const start = Date.now();
                const response = await this.makeRequest(url);
                const responseTime = Date.now() - start;
                
                const passed = responseTime < 1000; // 1秒以内で合格
                this.recordTest(
                    `パフォーマンス: ${url}`,
                    passed,
                    `レスポンス時間: ${responseTime}ms`,
                    { responseTime, threshold: 1000 }
                );
                
            } catch (error) {
                this.recordTest(
                    `パフォーマンス: ${url}`,
                    false,
                    `エラー: ${error.message}`
                );
            }
        }
    }
    
    /**
     * 6. bunenjin哲学統合テスト
     */
    async testBunenjinPhilosophy() {
        console.log('\n🎋 == bunenjin哲学統合テスト ==');
        
        try {
            // bunenjin関連キーワードの存在確認
            const files = [
                '/js/components/VirtualPersonaResultsView.js',
                '/results.html'
            ];
            
            const bunenjinKeywords = [
                'bunenjin',
                '易経',
                'Triple OS',
                '仮想人格',
                '陰陽',
                '八卦'
            ];
            
            let totalOccurrences = 0;
            const fileDetails = [];
            
            for (const file of files) {
                try {
                    const response = await this.makeRequest(file);
                    const content = response.body;
                    
                    let fileOccurrences = 0;
                    const foundKeywords = [];
                    
                    for (const keyword of bunenjinKeywords) {
                        const matches = (content.match(new RegExp(keyword, 'gi')) || []).length;
                        if (matches > 0) {
                            fileOccurrences += matches;
                            foundKeywords.push(`${keyword}(${matches})`);
                        }
                    }
                    
                    totalOccurrences += fileOccurrences;
                    fileDetails.push(`${file}: ${foundKeywords.join(', ') || 'なし'}`);
                    
                } catch (error) {
                    fileDetails.push(`${file}: エラー`);
                }
            }
            
            const passed = totalOccurrences >= 5; // 最低5回の出現で合格
            this.recordTest(
                'bunenjin哲学統合確認',
                passed,
                `bunenjin関連キーワード${totalOccurrences}回出現`,
                { 
                    totalOccurrences,
                    threshold: 5,
                    details: fileDetails
                }
            );
            
        } catch (error) {
            this.recordTest(
                'bunenjin哲学統合確認',
                false,
                `エラー: ${error.message}`
            );
        }
    }
    
    /**
     * メインテスト実行
     */
    async runAllTests() {
        console.log('🚀 仮想人格プラットフォーム包括テストを開始します...\n');
        
        // 各テストカテゴリを順次実行
        await this.testServerAndFiles();
        await this.testTripleOSArchitecture();  
        await this.testVirtualPersonaDialogue();
        await this.testIChingMetaphor();
        await this.testIntegrationAndPerformance();
        await this.testBunenjinPhilosophy();
        
        // 結果の集計と表示
        this.generateReport();
    }
    
    /**
     * テスト結果レポートの生成
     */
    generateReport() {
        console.log('\n📊 == テスト結果レポート ==');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = (passedTests / totalTests * 100).toFixed(1);
        const executionTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
        
        console.log(`\n📈 テスト実行結果:`);
        console.log(`   🎯 総テスト数: ${totalTests}`);
        console.log(`   ✅ 成功: ${passedTests}`);
        console.log(`   ❌ 失敗: ${failedTests}`);
        console.log(`   📊 成功率: ${successRate}%`);
        console.log(`   ⏱️ 実行時間: ${executionTime}秒\n`);
        
        // カテゴリ別の成功率
        const categories = {};
        this.testResults.forEach(test => {
            const category = test.name.split(':')[0] || test.name.split('確認')[0] + '確認';
            if (!categories[category]) {
                categories[category] = { total: 0, passed: 0 };
            }
            categories[category].total++;
            if (test.passed) categories[category].passed++;
        });
        
        console.log('📋 カテゴリ別結果:');
        Object.entries(categories).forEach(([category, stats]) => {
            const rate = (stats.passed / stats.total * 100).toFixed(1);
            const status = stats.passed === stats.total ? '✅' : stats.passed > 0 ? '⚠️' : '❌';
            console.log(`   ${status} ${category}: ${stats.passed}/${stats.total} (${rate}%)`);
        });
        
        // 失敗したテストの詳細
        const failedTestDetails = this.testResults.filter(test => !test.passed);
        if (failedTestDetails.length > 0) {
            console.log('\n🔍 失敗したテストの詳細:');
            failedTestDetails.forEach(test => {
                console.log(`   ❌ ${test.name}: ${test.details}`);
            });
        }
        
        // 総合評価
        console.log('\n🎭 仮想人格プラットフォーム評価:');
        if (successRate >= 90) {
            console.log('   🌟 優秀: 仮想人格プラットフォームは高品質で動作しています');
        } else if (successRate >= 70) {
            console.log('   ✅ 良好: 基本機能は動作していますが、いくつかの改善点があります');
        } else if (successRate >= 50) {
            console.log('   ⚠️ 要改善: 重要な機能に問題があります');
        } else {
            console.log('   ❌ 重大な問題: プラットフォームに深刻な問題があります');
        }
        
        // レポートファイルの生成
        this.saveReport(successRate, executionTime);
    }
    
    /**
     * レポートファイルの保存
     */
    saveReport(successRate, executionTime) {
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: this.testResults.length,
                passedTests: this.testResults.filter(test => test.passed).length,
                successRate: parseFloat(successRate),
                executionTime: parseFloat(executionTime)
            },
            testResults: this.testResults,
            evaluation: {
                tripleOSArchitecture: this.evaluateCategory('Triple OS'),
                virtualPersonaDialogue: this.evaluateCategory('仮想人格対話'),
                ichingMetaphor: this.evaluateCategory('易経メタファー'),
                integration: this.evaluateCategory('統合'),
                bunenjinPhilosophy: this.evaluateCategory('bunenjin哲学'),
                performance: this.evaluateCategory('パフォーマンス')
            }
        };
        
        const reportPath = `virtual-persona-test-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
        
        console.log(`\n💾 詳細レポートを保存しました: ${reportPath}`);
    }
    
    /**
     * カテゴリ別評価
     */
    evaluateCategory(categoryKeyword) {
        const categoryTests = this.testResults.filter(test => 
            test.name.includes(categoryKeyword)
        );
        
        if (categoryTests.length === 0) return null;
        
        const passed = categoryTests.filter(test => test.passed).length;
        const total = categoryTests.length;
        
        return {
            passed,
            total,
            successRate: (passed / total * 100).toFixed(1) + '%',
            status: passed === total ? 'excellent' : passed >= total * 0.7 ? 'good' : 'needs_improvement'
        };
    }
}

// テストスイートの実行
async function main() {
    const testSuite = new VirtualPersonaTestSuite();
    
    try {
        await testSuite.runAllTests();
        process.exit(0);
    } catch (error) {
        console.error('❌ テストスイート実行エラー:', error);
        process.exit(1);
    }
}

// スクリプトが直接実行された場合にテストを開始
if (require.main === module) {
    main();
}

module.exports = VirtualPersonaTestSuite;