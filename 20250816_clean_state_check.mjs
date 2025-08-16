/**
 * クリーンな状態確認
 * SafeDOMUpdaterとbinary-tree無効化後の動作確認
 */

import { chromium } from 'playwright';

async function checkCleanState() {
    console.log('🧹 クリーンな状態確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        console.log('📋 Step 1: ページ読み込み');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        // 無効化されたものの確認
        const status = await page.evaluate(() => {
            return {
                SafeDOMUpdater: typeof window.SafeDOMUpdater,
                displayBinaryTreeResults: typeof window.displayBinaryTreeResults,
                resultsContainer: !!document.getElementById('resultsContainer'),
                eightScenariosContainer: !!document.getElementById('eight-scenarios-display-container')
            };
        });
        
        console.log('\n  無効化確認:');
        console.log(`    SafeDOMUpdater: ${status.SafeDOMUpdater === 'undefined' ? '✅ 無効' : '❌ まだ有効'}`);
        console.log(`    displayBinaryTreeResults: ${status.displayBinaryTreeResults}`);
        console.log(`    resultsContainer: ${status.resultsContainer ? '✅ 存在' : '❌'}`);
        console.log(`    eight-scenarios-container: ${status.eightScenariosContainer ? '存在' : '無し'}`);
        
        console.log('\n📋 Step 2: 分析実行（エラーが出ないか確認）');
        
        await page.fill('textarea', 'テスト入力');
        await page.click('#aiGuessBtn');
        await page.waitForTimeout(3000);
        
        console.log('\n  エラー状況:');
        if (errors.length === 0) {
            console.log('    ✅ エラーなし');
        } else {
            console.log(`    ❌ ${errors.length}個のエラー:`);
            errors.slice(0, 3).forEach(err => {
                console.log(`      - ${err.substring(0, 100)}`);
            });
        }
        
        // 現在の表示内容
        const content = await page.evaluate(() => {
            const container = document.getElementById('resultsContainer');
            return {
                hasContent: container && container.innerHTML.length > 100,
                childCount: container?.children.length || 0,
                firstChildTag: container?.firstElementChild?.tagName
            };
        });
        
        console.log('\n  resultsContainer状態:');
        console.log(`    コンテンツあり: ${content.hasContent ? '✅' : '❌'}`);
        console.log(`    子要素数: ${content.childCount}`);
        console.log(`    最初の要素: ${content.firstChildTag || 'なし'}`);
        
        console.log('\n=====================================');
        console.log('📊 結果');
        console.log('=====================================\n');
        
        if (status.SafeDOMUpdater === 'undefined' && errors.length === 0) {
            console.log('✅ クリーンな状態です！');
            console.log('   SafeDOMUpdaterとbinary-treeが無効化され、');
            console.log('   エラーも発生していません。');
            console.log('\n🎯 次のステップ:');
            console.log('   新しいシンプルな表示システムを実装できます。');
        } else {
            console.log('⚠️ まだ問題があります');
        }
        
    } finally {
        console.log('\n⏰ 5秒後にブラウザを閉じます...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
checkCleanState().catch(console.error);