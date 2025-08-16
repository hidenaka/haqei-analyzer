/**
 * OSアナライザー包括的テスト - 2025年8月16日
 * QA Tester Agent による詳細検証
 */
import { chromium } from 'playwright';

async function comprehensiveOSAnalyzerTest() {
    console.log('🔍 OSアナライザー包括的テスト開始');
    console.log('='.repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500,
        args: ['--disable-web-security', '--allow-running-insecure-content']
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // コンソールエラーをキャプチャ
    const consoleErrors = [];
    const networkErrors = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    page.on('response', response => {
        if (!response.ok()) {
            networkErrors.push(response.status() + ' ' + response.url());
        }
    });
    
    try {
        console.log('📋 Test 1: ページ読み込み状況');
        console.log('-'.repeat(40));
        
        const filePath = 'file://' + process.cwd() + '/public/os_analyzer.html';
        console.log('Loading: ' + filePath);
        
        await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // ページタイトル確認
        const title = await page.title();
        console.log('✅ Page Title: ' + title);
        
        // 基本的なHTML構造確認
        const body = await page.$('body');
        console.log('✅ Body Element: ' + (body ? 'Found' : 'Not Found'));
        
        // Head要素のscriptタグ数を確認
        const scriptTags = await page.$$eval('script', scripts => scripts.length);
        console.log('✅ Script Tags: ' + scriptTags + ' found');
        
        // CSS読み込み確認
        const styleTags = await page.$$eval('style', styles => styles.length);
        console.log('✅ Style Tags: ' + styleTags + ' found');
        
        console.log();
        console.log('📋 Test 2: JavaScriptエラー分析');
        console.log('-'.repeat(40));
        
        // 2秒待機してエラーをキャプチャ
        await page.waitForTimeout(2000);
        
        if (consoleErrors.length > 0) {
            console.log('❌ JavaScript Errors Found: ' + consoleErrors.length);
            consoleErrors.forEach((error, index) => {
                console.log('   ' + (index + 1) + '. ' + error);
            });
        } else {
            console.log('✅ No JavaScript Errors Detected');
        }
        
        console.log();
        console.log('📋 Test 3: ネットワークエラー分析');
        console.log('-'.repeat(40));
        
        if (networkErrors.length > 0) {
            console.log('❌ Network Errors Found: ' + networkErrors.length);
            networkErrors.forEach((error, index) => {
                console.log('   ' + (index + 1) + '. ' + error);
            });
        } else {
            console.log('✅ No Network Errors Detected');
        }
        
        console.log();
        console.log('📋 Test 4: DOM要素構造確認');
        console.log('-'.repeat(40));
        
        // メイン画面要素の確認
        const welcomeScreen = await page.$('#welcome-screen');
        console.log('✅ Welcome Screen: ' + (welcomeScreen ? 'Found' : 'Not Found'));
        
        const questionScreen = await page.$('#question-screen');
        console.log('✅ Question Screen: ' + (questionScreen ? 'Found' : 'Not Found'));
        
        const resultScreen = await page.$('#result-screen');
        console.log('✅ Result Screen: ' + (resultScreen ? 'Found' : 'Not Found'));
        
        // ボタン要素の確認
        const analysisButton = await page.$('button');
        console.log('✅ Button Elements: ' + (analysisButton ? 'Found' : 'Not Found'));
        
        if (analysisButton) {
            const buttonText = await analysisButton.textContent();
            console.log('   Button Text: "' + buttonText + '"');
        }
        
        console.log();
        console.log('📋 Test 5: JavaScript実行状況確認');
        console.log('-'.repeat(40));
        
        // グローバル変数の確認
        const hasQuestions = await page.evaluate(() => {
            return typeof window.QUESTIONS !== 'undefined';
        });
        console.log('✅ window.QUESTIONS: ' + (hasQuestions ? 'Available' : 'Not Available'));
        
        const hasScreenManager = await page.evaluate(() => {
            return typeof ScreenManager !== 'undefined';
        });
        console.log('✅ ScreenManager: ' + (hasScreenManager ? 'Available' : 'Not Available'));
        
        const hasTripleOSAnalyzer = await page.evaluate(() => {
            return typeof TripleOSAnalyzer !== 'undefined';
        });
        console.log('✅ TripleOSAnalyzer: ' + (hasTripleOSAnalyzer ? 'Available' : 'Not Available'));
        
        console.log();
        console.log('📋 Test 6: 統合課題テスト');
        console.log('-'.repeat(40));
        
        try {
            // 全てのボタンを取得
            const allButtons = await page.$$('button');
            console.log('見つかったボタン数: ' + allButtons.length);
            
            for (let i = 0; i < allButtons.length; i++) {
                const buttonText = await allButtons[i].textContent();
                console.log('   ボタン' + (i + 1) + ': "' + buttonText + '"');
            }
            
            // 「分析を始める」ボタンを探してクリック
            const startButtonFound = await page.getByText('分析を始める');
            const startButtonCount = await startButtonFound.count();
            console.log('「分析を始める」ボタン数: ' + startButtonCount);
            
            if (startButtonCount > 0) {
                console.log('✅ 「分析を始める」ボタンが見つかりました');
                await startButtonFound.first().click();
                await page.waitForTimeout(1000);
                
                // 画面遷移確認
                const questionVisible = await page.isVisible('#question-screen');
                const welcomeVisible = await page.isVisible('#welcome-screen');
                
                console.log('   質問画面表示: ' + (questionVisible ? 'Yes' : 'No'));
                console.log('   ウェルカム画面非表示: ' + (!welcomeVisible ? 'Yes' : 'No'));
                
                if (questionVisible && !welcomeVisible) {
                    console.log('✅ I1: 画面遷移 - 成功');
                } else {
                    console.log('❌ I1: 画面遷移 - 失敗');
                }
            } else {
                console.log('❌ 「分析を始める」ボタンが見つかりません');
            }
        } catch (error) {
            console.log('❌ 統合課題テスト実行エラー: ' + error.message);
        }
        
        console.log();
        console.log('📋 Test 7: 36問質問システム確認');
        console.log('-'.repeat(40));
        
        const questionsCount = await page.evaluate(() => {
            return window.QUESTIONS ? window.QUESTIONS.length : 0;
        });
        console.log('✅ 読み込まれた質問数: ' + questionsCount);
        
        if (questionsCount === 36) {
            console.log('✅ 36問質問システム: 正常');
        } else {
            console.log('❌ 36問質問システム: 異常 (' + questionsCount + '問)');
        }
        
        console.log();
        console.log('📋 Test 8: スクリーンショット撮影');
        console.log('-'.repeat(40));
        
        await page.screenshot({ 
            path: 'qa_os_analyzer_screenshot_20250816.png',
            fullPage: false
        });
        console.log('✅ スクリーンショット保存: qa_os_analyzer_screenshot_20250816.png');
        
    } catch (error) {
        console.log('❌ テスト実行エラー: ' + error.message);
    } finally {
        await browser.close();
    }
    
    console.log();
    console.log('🎯 テスト完了サマリー');
    console.log('='.repeat(60));
    console.log('JavaScript Errors: ' + consoleErrors.length);
    console.log('Network Errors: ' + networkErrors.length);
    console.log('テスト実行日時: ' + new Date().toLocaleString('ja-JP'));
    
    return {
        consoleErrors,
        networkErrors,
        timestamp: new Date().toISOString()
    };
}

// テスト実行
comprehensiveOSAnalyzerTest().catch(console.error);
