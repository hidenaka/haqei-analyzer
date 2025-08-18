#!/usr/bin/env node
/**
 * Button Click Debug - 分析を始めるボタンの動作詳細調査
 */

import puppeteer from 'puppeteer';

async function debugButtonClick() {
    console.log('🔍 ボタンクリック問題のデバッグを開始...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        devtools: true
    });
    
    const page = await browser.newPage();
    
    // コンソールログを全て捕捉
    const logs = [];
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        logs.push(`[${type}] ${text}`);
        console.log(`📝 [${type}] ${text}`);
    });
    
    // JavaScriptエラーを捕捉
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.log(`❌ JS Error: ${error.message}`);
    });
    
    try {
        // 1. ページ読み込み
        console.log('🌐 Loading os_analyzer.html...');
        await page.goto('http://localhost:8789/public/os_analyzer.html', {
            waitUntil: 'networkidle2'
        });
        
        // 2. 初期状態確認
        console.log('\n✅ 初期状態確認:');
        
        const welcomeVisible = await page.evaluate(() => {
            const welcomeScreen = document.getElementById('welcome-screen');
            if (!welcomeScreen) return false;
            
            const style = window.getComputedStyle(welcomeScreen);
            return {
                display: style.display,
                hasActiveClass: welcomeScreen.classList.contains('active'),
                exists: !!welcomeScreen
            };
        });
        console.log(`Welcome screen: ${JSON.stringify(welcomeVisible)}`);
        
        const questionVisible = await page.evaluate(() => {
            const questionScreen = document.getElementById('question-screen');
            if (!questionScreen) return false;
            
            const style = window.getComputedStyle(questionScreen);
            return {
                display: style.display,
                hasActiveClass: questionScreen.classList.contains('active'),
                exists: !!questionScreen
            };
        });
        console.log(`Question screen: ${JSON.stringify(questionVisible)}`);
        
        const startButton = await page.evaluate(() => {
            const btn = document.getElementById('start-btn');
            return {
                exists: !!btn,
                visible: btn ? window.getComputedStyle(btn).display !== 'none' : false,
                text: btn ? btn.textContent : 'N/A'
            };
        });
        console.log(`Start button: ${JSON.stringify(startButton)}`);
        
        // 3. QUESTIONSデータ確認
        const questionsData = await page.evaluate(() => {
            return {
                exists: typeof QUESTIONS !== 'undefined',
                length: typeof QUESTIONS !== 'undefined' ? QUESTIONS.length : 0,
                firstQuestion: typeof QUESTIONS !== 'undefined' && QUESTIONS[0] ? QUESTIONS[0].text : 'N/A'
            };
        });
        console.log(`QUESTIONS data: ${JSON.stringify(questionsData)}`);
        
        // 4. 初期スクリーンショット
        await page.screenshot({ 
            path: 'debug-welcome-before-click.png',
            fullPage: false
        });
        console.log('📸 debug-welcome-before-click.png saved');
        
        // 5. ボタンクリック前のDOM状態詳細取得
        const beforeClick = await page.evaluate(() => {
            const allScreens = Array.from(document.querySelectorAll('.screen')).map(screen => ({
                id: screen.id,
                display: window.getComputedStyle(screen).display,
                hasActive: screen.classList.contains('active'),
                classList: Array.from(screen.classList)
            }));
            
            return {
                screens: allScreens,
                hasOSAnalyzer: typeof window.OSAnalyzer !== 'undefined',
                hasShowScreen: typeof window.showScreen !== 'undefined'
            };
        });
        console.log('\n🔍 Before click DOM state:');
        console.log(JSON.stringify(beforeClick, null, 2));
        
        // 6. ボタンクリック実行
        console.log('\n🖱️ Clicking start button...');
        await page.click('#start-btn');
        
        // 少し待機
        await page.waitForTimeout(2000);
        
        // 7. クリック後のDOM状態確認
        const afterClick = await page.evaluate(() => {
            const allScreens = Array.from(document.querySelectorAll('.screen')).map(screen => ({
                id: screen.id,
                display: window.getComputedStyle(screen).display,
                hasActive: screen.classList.contains('active'),
                classList: Array.from(screen.classList)
            }));
            
            const questionText = document.getElementById('question-text');
            const progressFill = document.getElementById('progress-fill');
            
            return {
                screens: allScreens,
                questionText: questionText ? questionText.textContent : 'Element not found',
                progressWidth: progressFill ? progressFill.style.width : 'Element not found'
            };
        });
        console.log('\n🔍 After click DOM state:');
        console.log(JSON.stringify(afterClick, null, 2));
        
        // 8. クリック後スクリーンショット
        await page.screenshot({ 
            path: 'debug-after-click.png',
            fullPage: false
        });
        console.log('📸 debug-after-click.png saved');
        
        // 9. 画面遷移の検証
        const transitionSuccess = afterClick.screens.find(s => s.id === 'question-screen')?.hasActive;
        const welcomeHidden = !afterClick.screens.find(s => s.id === 'welcome-screen')?.hasActive;
        
        console.log('\n📊 結果:');
        console.log(`Question screen active: ${transitionSuccess ? '✅' : '❌'}`);
        console.log(`Welcome screen hidden: ${welcomeHidden ? '✅' : '❌'}`);
        console.log(`Question text loaded: ${afterClick.questionText !== 'Element not found' && afterClick.questionText !== '' ? '✅' : '❌'}`);
        
        // 10. JavaScript実行状況確認
        const jsExecution = await page.evaluate(() => {
            const btn = document.getElementById('start-btn');
            if (!btn) return 'Button not found';
            
            const handlers = getEventListeners ? getEventListeners(btn) : 'getEventListeners not available';
            return {
                hasClickHandler: handlers && handlers.click ? handlers.click.length > 0 : 'Cannot determine',
                buttonDisabled: btn.disabled,
                buttonStyle: window.getComputedStyle(btn).pointerEvents
            };
        });
        console.log(`JS execution state: ${JSON.stringify(jsExecution)}`);
        
        console.log('\n📋 ログサマリー:');
        console.log(`Total logs: ${logs.length}`);
        console.log(`Errors: ${errors.length}`);
        
        if (errors.length > 0) {
            console.log('\n❌ Errors found:');
            errors.forEach(error => console.log(`  - ${error}`));
        }
        
        // 手動確認のためブラウザを開いたままにする
        console.log('\n⏸️ ブラウザは開いたままです。手動で動作を確認してください。');
        console.log('Ctrl+C で終了してください。');
        
        // Process keep alive
        process.stdin.resume();
        
    } catch (error) {
        console.error('❌ Debug error:', error.message);
        await browser.close();
    }
}

debugButtonClick().catch(console.error);