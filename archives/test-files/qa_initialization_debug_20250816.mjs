/**
 * 初期化プロセスデバッグ - 2025年8月16日
 */
import { chromium } from 'playwright';

async function debugInitialization() {
    console.log('🔍 初期化プロセスデバッグ開始');
    console.log('='.repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // 全てのコンソールメッセージをキャプチャ
    const consoleLogs = [];
    
    page.on('console', msg => {
        consoleLogs.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
    });
    
    try {
        const filePath = 'file://' + process.cwd() + '/public/os_analyzer.html';
        console.log('📋 Loading page: ' + filePath);
        
        await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        // 初期化プロセスを段階的に監視
        console.log('📋 Stage 1: DOMContentLoaded後の状態');
        console.log('-'.repeat(40));
        
        await page.waitForTimeout(1000);
        
        const initialState = await page.evaluate(() => {
            return {
                bodyChildren: document.body.children.length,
                hasWelcomeScreen: !!document.getElementById('welcome-screen'),
                hasQuestionScreen: !!document.getElementById('question-screen'),
                hasErrorDiv: document.body.innerHTML.includes('初期化エラー'),
                scriptCount: document.scripts.length,
                windowKeys: Object.keys(window).filter(k => k.includes('Manager') || k.includes('Analyzer')).slice(0, 10)
            };
        });
        
        console.log('初期状態:');
        console.log('  Body子要素数: ' + initialState.bodyChildren);
        console.log('  Welcome Screen存在: ' + initialState.hasWelcomeScreen);
        console.log('  Question Screen存在: ' + initialState.hasQuestionScreen);
        console.log('  エラー画面表示: ' + initialState.hasErrorDiv);
        console.log('  Script要素数: ' + initialState.scriptCount);
        console.log('  Window Manager/Analyzer: ' + initialState.windowKeys.join(', '));
        
        console.log();
        console.log('📋 Stage 2: 2秒後の状態変化');
        console.log('-'.repeat(40));
        
        await page.waitForTimeout(2000);
        
        const laterState = await page.evaluate(() => {
            return {
                bodyChildren: document.body.children.length,
                hasWelcomeScreen: !!document.getElementById('welcome-screen'),
                hasQuestionScreen: !!document.getElementById('question-screen'),
                hasErrorDiv: document.body.innerHTML.includes('初期化エラー'),
                bodyHTML: document.body.innerHTML.substring(0, 500)
            };
        });
        
        console.log('2秒後状態:');
        console.log('  Body子要素数: ' + laterState.bodyChildren);
        console.log('  Welcome Screen存在: ' + laterState.hasWelcomeScreen);
        console.log('  Question Screen存在: ' + laterState.hasQuestionScreen);
        console.log('  エラー画面表示: ' + laterState.hasErrorDiv);
        
        if (laterState.hasErrorDiv) {
            console.log('❌ エラー画面が表示されています');
            console.log('Body HTML preview:');
            console.log(laterState.bodyHTML);
        }
        
        console.log();
        console.log('📋 Stage 3: コンソールログ分析');
        console.log('-'.repeat(40));
        
        console.log('キャプチャされたログ数: ' + consoleLogs.length);
        consoleLogs.forEach((log, index) => {
            console.log('  ' + (index + 1) + '. [' + log.type.toUpperCase() + '] ' + log.text);
        });
        
        console.log();
        console.log('📋 Stage 4: スクリプト実行状況確認');
        console.log('-'.repeat(40));
        
        const scriptStatus = await page.evaluate(() => {
            const scripts = Array.from(document.scripts);
            return scripts.map(script => ({
                src: script.src || 'inline',
                loaded: script.readyState || 'unknown',
                hasContent: script.innerHTML.length > 0
            }));
        });
        
        console.log('スクリプト実行状況:');
        scriptStatus.forEach((script, index) => {
            console.log('  ' + (index + 1) + '. ' + script.src);
            console.log('     状態: ' + script.loaded);
            console.log('     内容あり: ' + script.hasContent);
        });
        
        console.log();
        console.log('📋 Stage 5: 特定エラーの詳細追跡');
        console.log('-'.repeat(40));
        
        // CriticalCSSAnalyzerエラーの詳細
        const cssAnalyzerError = await page.evaluate(() => {
            try {
                // CriticalCSSAnalyzerが原因かチェック
                const btn = document.querySelector('button');
                return {
                    buttonExists: !!btn,
                    buttonHasListener: btn ? !!btn.onclick : false,
                    criticalCSS: typeof CriticalCSSAnalyzer !== 'undefined'
                };
            } catch (e) {
                return { error: e.message };
            }
        });
        
        console.log('CSS Analyzer詳細:');
        console.log('  ボタン存在: ' + cssAnalyzerError.buttonExists);
        console.log('  ボタンリスナー: ' + cssAnalyzerError.buttonHasListener);
        console.log('  CriticalCSSAnalyzer: ' + cssAnalyzerError.criticalCSS);
        if (cssAnalyzerError.error) {
            console.log('  エラー: ' + cssAnalyzerError.error);
        }
        
    } catch (error) {
        console.log('❌ デバッグエラー: ' + error.message);
    } finally {
        await browser.close();
    }
    
    return consoleLogs;
}

debugInitialization().catch(console.error);
