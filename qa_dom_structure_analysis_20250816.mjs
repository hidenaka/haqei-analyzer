/**
 * DOM構造詳細分析 - 2025年8月16日
 */
import { chromium } from 'playwright';

async function analyzeDOMStructure() {
    console.log('🔍 DOM構造詳細分析開始');
    console.log('='.repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        const filePath = 'file://' + process.cwd() + '/public/os_analyzer.html';
        await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // 3秒待機してJavaScript初期化を待つ
        await page.waitForTimeout(3000);
        
        console.log('📋 Test 1: Body内の全要素構造');
        console.log('-'.repeat(40));
        
        const bodyStructure = await page.evaluate(() => {
            const body = document.body;
            const children = Array.from(body.children);
            return children.map(child => ({
                tagName: child.tagName,
                id: child.id,
                className: child.className,
                textContent: child.textContent ? child.textContent.substring(0, 100) : '',
                style: child.style.display
            }));
        });
        
        bodyStructure.forEach((element, index) => {
            console.log('Element ' + (index + 1) + ':');
            console.log('  Tag: ' + element.tagName);
            console.log('  ID: ' + (element.id || 'なし'));
            console.log('  Class: ' + (element.className || 'なし'));
            console.log('  Display: ' + (element.style || 'default'));
            console.log('  Content: ' + element.textContent.substring(0, 50) + '...');
            console.log();
        });
        
        console.log('📋 Test 2: screen要素の検索');
        console.log('-'.repeat(40));
        
        const screenElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('[id*="screen"]');
            return Array.from(elements).map(el => ({
                id: el.id,
                tagName: el.tagName,
                className: el.className,
                display: window.getComputedStyle(el).display,
                visibility: window.getComputedStyle(el).visibility
            }));
        });
        
        if (screenElements.length > 0) {
            console.log('見つかったscreen要素:');
            screenElements.forEach((el, index) => {
                console.log('  ' + (index + 1) + '. ' + el.tagName + '#' + el.id);
                console.log('     Class: ' + el.className);
                console.log('     Display: ' + el.display);
                console.log('     Visibility: ' + el.visibility);
            });
        } else {
            console.log('❌ screen要素が見つかりません');
        }
        
        console.log();
        console.log('📋 Test 3: ボタン要素の詳細分析');
        console.log('-'.repeat(40));
        
        const buttonAnalysis = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            return Array.from(buttons).map(btn => ({
                text: btn.textContent.trim(),
                id: btn.id,
                className: btn.className,
                onclick: btn.onclick ? btn.onclick.toString() : null,
                display: window.getComputedStyle(btn).display,
                visibility: window.getComputedStyle(btn).visibility
            }));
        });
        
        console.log('ボタン要素数: ' + buttonAnalysis.length);
        buttonAnalysis.forEach((btn, index) => {
            console.log('  ボタン' + (index + 1) + ':');
            console.log('    Text: "' + btn.text + '"');
            console.log('    ID: ' + (btn.id || 'なし'));
            console.log('    Class: ' + (btn.className || 'なし'));
            console.log('    OnClick: ' + (btn.onclick ? 'あり' : 'なし'));
            console.log('    Display: ' + btn.display);
            console.log('    Visibility: ' + btn.visibility);
            console.log();
        });
        
        console.log('📋 Test 4: 「分析」関連テキスト検索');
        console.log('-'.repeat(40));
        
        const analysisText = await page.evaluate(() => {
            const allElements = document.querySelectorAll('*');
            const found = [];
            allElements.forEach(el => {
                if (el.textContent && el.textContent.includes('分析')) {
                    found.push({
                        tagName: el.tagName,
                        id: el.id,
                        className: el.className,
                        textContent: el.textContent.trim().substring(0, 100),
                        display: window.getComputedStyle(el).display
                    });
                }
            });
            return found;
        });
        
        console.log('「分析」を含む要素数: ' + analysisText.length);
        analysisText.forEach((el, index) => {
            console.log('  ' + (index + 1) + '. ' + el.tagName + (el.id ? '#' + el.id : ''));
            console.log('     Text: "' + el.textContent + '"');
            console.log('     Display: ' + el.display);
            console.log();
        });
        
        console.log('📋 Test 5: JavaScript実行状況詳細');
        console.log('-'.repeat(40));
        
        const jsStatus = await page.evaluate(() => {
            return {
                questionsLength: window.QUESTIONS ? window.QUESTIONS.length : 0,
                screenManagerExists: typeof ScreenManager !== 'undefined',
                screenManagerMethods: typeof ScreenManager !== 'undefined' ? Object.getOwnPropertyNames(ScreenManager) : [],
                tripleOSExists: typeof TripleOSAnalyzer !== 'undefined',
                windowKeys: Object.keys(window).filter(key => key.includes('Screen') || key.includes('Manager') || key.includes('Analyzer'))
            };
        });
        
        console.log('JavaScript状況:');
        console.log('  QUESTIONS長: ' + jsStatus.questionsLength);
        console.log('  ScreenManager存在: ' + jsStatus.screenManagerExists);
        console.log('  ScreenManagerメソッド: ' + jsStatus.screenManagerMethods.join(', '));
        console.log('  TripleOSAnalyzer存在: ' + jsStatus.tripleOSExists);
        console.log('  関連windowキー: ' + jsStatus.windowKeys.join(', '));
        
        console.log();
        console.log('📋 Test 6: エラー状況再確認');
        console.log('-'.repeat(40));
        
        await page.waitForTimeout(1000);
        
        // コンソールログを再度取得
        const logs = await page.evaluate(() => {
            return window.console ? 'Console available' : 'Console not available';
        });
        console.log('Console状況: ' + logs);
        
    } catch (error) {
        console.log('❌ 分析エラー: ' + error.message);
    } finally {
        await browser.close();
    }
}

analyzeDOMStructure().catch(console.error);
