#!/usr/bin/env node
/**
 * Fixed UI Test - 修正後の動作確認
 */

import puppeteer from 'puppeteer';

async function testFixedUI() {
    console.log('🔧 修正後のUI動作確認を開始...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // ログ収集
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`📝 [${type}] ${text}`);
    });
    
    try {
        await page.goto('http://localhost:8789/public/os_analyzer.html', {
            waitUntil: 'networkidle2'
        });
        
        // 1. QUESTIONSデータ確認
        const questionsCheck = await page.evaluate(() => {
            return {
                exists: typeof QUESTIONS !== 'undefined',
                length: typeof QUESTIONS !== 'undefined' ? QUESTIONS.length : 0,
                sampleQuestions: typeof QUESTIONS !== 'undefined' ? 
                    QUESTIONS.slice(0, 3).map(q => q.text.substring(0, 30) + '...') : []
            };
        });
        
        console.log('\n✅ QUESTIONSデータ確認:');
        console.log(`   長さ: ${questionsCheck.length} (期待値: 36)`);
        console.log(`   存在: ${questionsCheck.exists}`);
        console.log(`   サンプル質問:`);
        questionsCheck.sampleQuestions.forEach((q, i) => {
            console.log(`     Q${i+1}: ${q}`);
        });
        
        // 2. ボタンテキスト確認
        const buttonCheck = await page.evaluate(() => {
            const btn = document.getElementById('start-btn');
            return {
                exists: !!btn,
                text: btn ? btn.textContent.trim() : 'N/A'
            };
        });
        
        console.log('\n✅ ボタン確認:');
        console.log(`   テキスト: "${buttonCheck.text}"`);
        console.log(`   期待値: "分析を始める"`);
        console.log(`   正常: ${buttonCheck.text === '分析を始める' ? '✅' : '❌'}`);
        
        // 3. スクリーンショット（修正前）
        await page.screenshot({ 
            path: 'test-fixed-welcome.png',
            fullPage: false
        });
        console.log('\n📸 test-fixed-welcome.png 保存完了');
        
        // 4. ボタンクリックテスト
        console.log('\n🖱️ ボタンクリックテスト実行...');
        await page.click('#start-btn');
        
        // 待機
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 5. 画面遷移確認
        const transitionCheck = await page.evaluate(() => {
            const welcomeScreen = document.getElementById('welcome-screen');
            const questionScreen = document.getElementById('question-screen');
            const questionText = document.getElementById('question-text');
            const progressFill = document.getElementById('progress-fill');
            
            return {
                welcomeActive: welcomeScreen ? welcomeScreen.classList.contains('active') : false,
                questionActive: questionScreen ? questionScreen.classList.contains('active') : false,
                questionText: questionText ? questionText.textContent : 'Element not found',
                progressWidth: progressFill ? progressFill.style.width : 'Element not found',
                questionTextEmpty: !questionText || questionText.textContent.trim() === '' || questionText.textContent === 'No content'
            };
        });
        
        console.log('\n📊 画面遷移結果:');
        console.log(`   Welcome画面非表示: ${!transitionCheck.welcomeActive ? '✅' : '❌'}`);
        console.log(`   Question画面表示: ${transitionCheck.questionActive ? '✅' : '❌'}`);
        console.log(`   質問テキスト: "${transitionCheck.questionText.substring(0, 50)}..."`);
        console.log(`   質問テキスト空: ${transitionCheck.questionTextEmpty ? '❌' : '✅'}`);
        console.log(`   プログレス幅: ${transitionCheck.progressWidth}`);
        
        // 6. スクリーンショット（修正後）
        await page.screenshot({ 
            path: 'test-fixed-question.png',
            fullPage: false
        });
        console.log('\n📸 test-fixed-question.png 保存完了');
        
        // 7. 総合評価
        const success = 
            questionsCheck.length === 36 && 
            buttonCheck.text === '分析を始める' &&
            transitionCheck.questionActive &&
            !transitionCheck.questionTextEmpty;
            
        console.log('\n🎯 修正結果総合評価:');
        console.log(`   QUESTIONSデータ: ${questionsCheck.length === 36 ? '✅' : '❌'} (${questionsCheck.length}/36)`);
        console.log(`   ボタンテキスト: ${buttonCheck.text === '分析を始める' ? '✅' : '❌'}`);
        console.log(`   画面遷移機能: ${transitionCheck.questionActive ? '✅' : '❌'}`);
        console.log(`   質問表示機能: ${!transitionCheck.questionTextEmpty ? '✅' : '❌'}`);
        console.log('\n' + '='.repeat(50));
        console.log(`🎉 修正完了度: ${success ? '100%' : 'まだ課題あり'}`);
        console.log('='.repeat(50));
        
        // ブラウザを開いたままにする
        console.log('\n⏸️ ブラウザは開いたままです。手動で動作確認してください。');
        process.stdin.resume();
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await browser.close();
    }
}

testFixedUI().catch(console.error);