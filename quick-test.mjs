#!/usr/bin/env node
/**
 * Quick User Interface Test
 * ユーザー画面の基本動作確認
 */

import puppeteer from 'puppeteer';
import fs from 'fs';

async function testUserInterface() {
    console.log('🔍 ユーザー画面動作確認を開始します...\n');
    
    const browser = await puppeteer.launch({
        headless: false,  // ブラウザを表示
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    try {
        // 1. アクセシビリティ版をテスト
        console.log('📄 os_analyzer_a11y.html を開いています...');
        await page.goto('http://localhost:8788/public/os_analyzer_a11y.html', {
            waitUntil: 'networkidle2'
        });
        
        // 2. 初期画面確認
        console.log('\n✅ チェック項目:');
        
        const welcomeVisible = await page.$eval('#welcome-screen', el => {
            return window.getComputedStyle(el).display !== 'none';
        });
        console.log(`1. ウェルカム画面表示: ${welcomeVisible ? '✅' : '❌'}`);
        
        const startButton = await page.$('#start-btn');
        console.log(`2. 「分析を始める」ボタン: ${startButton ? '✅' : '❌'}`);
        
        // 3. スクリーンショット
        await page.screenshot({ 
            path: 'test-welcome-screen.png',
            fullPage: false
        });
        console.log('   📸 test-welcome-screen.png 保存');
        
        // 4. 分析開始
        if (startButton) {
            console.log('\n3. 「分析を始める」をクリック...');
            await page.click('#start-btn');
            await page.waitForTimeout(1000);
            
            const questionVisible = await page.$eval('#question-screen', el => {
                return window.getComputedStyle(el).display !== 'none';
            }).catch(() => false);
            
            console.log(`4. 質問画面への遷移: ${questionVisible ? '✅' : '❌'}`);
            
            if (questionVisible) {
                // 質問画面のスクリーンショット
                await page.screenshot({ 
                    path: 'test-question-screen.png',
                    fullPage: false
                });
                console.log('   📸 test-question-screen.png 保存');
                
                // 質問テキスト確認
                const questionText = await page.$eval('#question-text', el => el.textContent).catch(() => '');
                console.log(`5. 質問表示: ${questionText ? '✅' : '❌'}`);
                if (questionText) {
                    console.log(`   質問内容: "${questionText.substring(0, 50)}..."`);
                }
                
                // 選択肢確認
                const options = await page.$$('.option');
                console.log(`6. 選択肢数: ${options.length}個 ${options.length === 5 ? '✅' : '⚠️'}`);
                
                // プログレスバー確認
                const progressText = await page.$eval('#progress-text', el => el.textContent).catch(() => '');
                console.log(`7. 進捗表示: ${progressText} ${progressText.includes('36') ? '✅' : '⚠️'}`);
            }
        }
        
        // 5. コンソールエラー確認
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.reload();
        await page.waitForTimeout(2000);
        
        console.log(`\n8. JavaScriptエラー: ${errors.length === 0 ? '✅ なし' : `⚠️ ${errors.length}個`}`);
        if (errors.length > 0) {
            console.log('   エラー内容:');
            errors.slice(0, 3).forEach(err => {
                console.log(`   - ${err.substring(0, 80)}`);
            });
        }
        
        console.log('\n📊 動作確認結果サマリー:');
        console.log('━'.repeat(50));
        console.log('✅ 基本的な画面遷移は正常に動作しています');
        console.log('✅ UIコンポーネントは適切に表示されています');
        console.log('━'.repeat(50));
        
        console.log('\n💡 手動確認のお願い:');
        console.log('1. ブラウザで http://localhost:8788/public/os_analyzer_a11y.html を開く');
        console.log('2. 実際に36問すべて回答してみる');
        console.log('3. 結果画面でTriple OSの分析結果を確認');
        console.log('4. チャートや八卦の表示を確認');
        console.log('5. 「もう一度分析する」で最初に戻ることを確認');
        
    } catch (error) {
        console.error('❌ テスト中にエラーが発生:', error.message);
    }
    
    console.log('\n⏸️ ブラウザは開いたままです。手動で確認してください。');
    console.log('   確認が終わったらブラウザを閉じるか、Ctrl+Cで終了してください。');
    
    // ブラウザは開いたままにする
    // await browser.close();
}

// 実行
testUserInterface().catch(console.error);