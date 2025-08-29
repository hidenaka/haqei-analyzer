/**
 * phase3-4-test.mjs
 * Phase 3 実装内容のテストファイル
 * 
 * テスト対象:
 * - InsightsTab.js のH384データベース連携
 * - ScenariosTab.js のH384データベース連携
 * - ExportTab.js のモバイル向け機能
 * - insights-enhanced.css の適用
 * - export-mobile.css の適用
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// テスト結果を格納する配列
const testResults = [];

// テストヘルパー関数
function addTestResult(testName, passed, message = '') {
    testResults.push({
        test: testName,
        passed,
        message,
        timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}${message ? ': ' + message : ''}`);
}

// ファイル存在チェック
async function checkFileExists(filePath, testName) {
    try {
        await fs.access(filePath);
        addTestResult(testName, true, `ファイルが存在します: ${filePath}`);
        return true;
    } catch (error) {
        addTestResult(testName, false, `ファイルが見つかりません: ${filePath}`);
        return false;
    }
}

// ファイル内容チェック
async function checkFileContent(filePath, searchStrings, testName) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const missingStrings = [];
        
        for (const searchString of searchStrings) {
            if (!content.includes(searchString)) {
                missingStrings.push(searchString);
            }
        }
        
        if (missingStrings.length === 0) {
            addTestResult(testName, true, `すべての必要な内容が含まれています`);
            return true;
        } else {
            addTestResult(testName, false, `不足している内容: ${missingStrings.join(', ')}`);
            return false;
        }
    } catch (error) {
        addTestResult(testName, false, `ファイル読み込みエラー: ${error.message}`);
        return false;
    }
}

// メイン関数
async function runTests() {
    console.log('🚀 Phase 3 実装テストを開始します...\n');
    
    const publicDir = path.join(__dirname, 'public');
    const jsTabsDir = path.join(publicDir, 'js', 'components', 'tabs');
    const cssDir = path.join(publicDir, 'css');
    
    // 1. ファイル存在チェック
    console.log('📁 ファイル存在チェック');
    await checkFileExists(path.join(jsTabsDir, 'InsightsTab.js'), 'InsightsTab.js 存在確認');
    await checkFileExists(path.join(jsTabsDir, 'ScenariosTab.js'), 'ScenariosTab.js 存在確認');
    await checkFileExists(path.join(jsTabsDir, 'ExportTab.js'), 'ExportTab.js 存在確認');
    await checkFileExists(path.join(cssDir, 'insights-enhanced.css'), 'insights-enhanced.css 存在確認');
    await checkFileExists(path.join(cssDir, 'export-mobile.css'), 'export-mobile.css 存在確認');
    await checkFileExists(path.join(publicDir, 'results.html'), 'results.html 存在確認');
    
    console.log('\n🔍 InsightsTab.js 内容チェック');
    await checkFileContent(
        path.join(jsTabsDir, 'InsightsTab.js'),
        [
            'initializeHexagramExtractor',
            'generateEnhancedInsights',
            'extractHexagramKeywords',
            'renderEnhancedInsights',
            'renderKeywordCloud'
        ],
        'InsightsTab.js H384連携機能'
    );
    
    console.log('\n🎭 ScenariosTab.js 内容チェック');
    await checkFileContent(
        path.join(jsTabsDir, 'ScenariosTab.js'),
        [
            'initializeHexagramExtractor',
            'getAvailableScenarios',
            'generateInnerConflictScript',
            'generateSocialHarmonyScript',
            'generateIntegratedGrowthScript',
            'extractHexagramKeywords'
        ],
        'ScenariosTab.js H384連携機能'
    );
    
    console.log('\n📱 ExportTab.js 内容チェック');
    await checkFileContent(
        path.join(jsTabsDir, 'ExportTab.js'),
        [
            'renderMobileExport',
            'bindMobileExportEvents',
            'shareToSocialMedia',
            'generateSNSImage',
            'generateQRCode',
            'copyTextToClipboard'
        ],
        'ExportTab.js モバイル機能'
    );
    
    console.log('\n🎨 insights-enhanced.css 内容チェック');
    await checkFileContent(
        path.join(cssDir, 'insights-enhanced.css'),
        [
            '.enhanced-insights-section',
            '.keyword-cloud',
            '.hexagram-insight-card',
            '.hexagram-connections',
            '@media (max-width: 768px)'
        ],
        'insights-enhanced.css スタイル定義'
    );
    
    console.log('\n📱 export-mobile.css 内容チェック');
    await checkFileContent(
        path.join(cssDir, 'export-mobile.css'),
        [
            '.mobile-export-section',
            '.sns-card',
            '.line-card',
            '.qr-card',
            '.share-btn',
            '@media (max-width: 768px)'
        ],
        'export-mobile.css スタイル定義'
    );
    
    console.log('\n🔗 results.html CSS読み込みチェック');
    await checkFileContent(
        path.join(publicDir, 'results.html'),
        [
            'insights-enhanced.css',
            'export-mobile.css'
        ],
        'results.html CSS読み込み'
    );
    
    // テスト結果サマリー
    console.log('\n📊 テスト結果サマリー');
    const totalTests = testResults.length;
    const passedTests = testResults.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`総テスト数: ${totalTests}`);
    console.log(`成功: ${passedTests}`);
    console.log(`失敗: ${failedTests}`);
    console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
        console.log('\n❌ 失敗したテスト:');
        testResults
            .filter(result => !result.passed)
            .forEach(result => {
                console.log(`  - ${result.test}: ${result.message}`);
            });
    }
    
    // テスト結果をJSONファイルに保存
    const resultFile = path.join(__dirname, 'phase3-test-results.json');
    await fs.writeFile(resultFile, JSON.stringify({
        summary: {
            totalTests,
            passedTests,
            failedTests,
            successRate: ((passedTests / totalTests) * 100).toFixed(1) + '%',
            timestamp: new Date().toISOString()
        },
        details: testResults
    }, null, 2));
    
    console.log(`\n💾 テスト結果を保存しました: ${resultFile}`);
    
    // 終了コード設定
    if (failedTests > 0) {
        console.log('\n⚠️  一部のテストが失敗しました。');
        process.exit(1);
    } else {
        console.log('\n🎉 すべてのテストが成功しました！');
        process.exit(0);
    }
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
    console.error('未処理のPromise拒否:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('未処理の例外:', error);
    process.exit(1);
});

// テスト実行
runTests().catch(error => {
    console.error('テスト実行エラー:', error);
    process.exit(1);
});