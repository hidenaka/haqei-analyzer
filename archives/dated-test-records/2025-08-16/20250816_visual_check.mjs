/**
 * 実際の画面を視覚的に確認
 */

import { chromium } from 'playwright';

async function visualCheck() {
    console.log('👁️ 実際の画面を確認');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false  // 画面を見る
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('📋 ページを開いています...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000);
        
        console.log('\n📋 分析を実行します...');
        await page.fill('textarea', '転職について悩んでいます');
        await page.click('#aiGuessBtn');
        
        console.log('⏳ 5秒待機中...');
        await page.waitForTimeout(5000);
        
        // スクリーンショットを撮る
        await page.screenshot({ 
            path: '20250816_current_state.png',
            fullPage: false
        });
        console.log('📸 スクリーンショット保存: 20250816_current_state.png');
        
        // 実際に何が表示されているか確認
        const visibleContent = await page.evaluate(() => {
            const container = document.getElementById('resultsContainer');
            if (!container) return { error: 'No container' };
            
            // 表示されているテキストを取得
            const visibleText = container.innerText?.substring(0, 500);
            
            // シナリオカードの確認
            const cards = container.querySelectorAll('.scenario-card');
            
            // 画像やグラフの確認
            const images = container.querySelectorAll('img');
            const canvas = container.querySelectorAll('canvas');
            
            // 実際に見える要素の高さ
            const rect = container.getBoundingClientRect();
            
            return {
                visibleText: visibleText || '(テキストなし)',
                cardCount: cards.length,
                imageCount: images.length,
                canvasCount: canvas.length,
                containerHeight: rect.height,
                hasVisibleContent: rect.height > 100,
                firstFewElements: Array.from(container.children).slice(0, 3).map(el => ({
                    tag: el.tagName,
                    className: el.className,
                    hasText: el.innerText?.length > 0
                }))
            };
        });
        
        console.log('\n🖼️ 実際の画面に表示されているもの:');
        console.log('=====================================');
        
        if (visibleContent.hasVisibleContent) {
            console.log('✅ 何か表示されています');
            console.log(`   高さ: ${visibleContent.containerHeight}px`);
            console.log(`   カード: ${visibleContent.cardCount}枚`);
            console.log(`   グラフ: ${visibleContent.canvasCount}個`);
            console.log(`   画像: ${visibleContent.imageCount}個`);
            
            console.log('\n   最初の要素:');
            visibleContent.firstFewElements.forEach((el, i) => {
                console.log(`   ${i+1}. ${el.tag} (${el.className}) - テキスト: ${el.hasText ? 'あり' : 'なし'}`);
            });
            
            console.log('\n   表示テキストの一部:');
            console.log(`   "${visibleContent.visibleText?.substring(0, 200)}..."`);
        } else {
            console.log('❌ 何も表示されていません（空っぽ）');
            console.log(`   コンテナの高さ: ${visibleContent.containerHeight}px`);
        }
        
        console.log('\n=====================================');
        console.log('💡 結論:');
        
        if (visibleContent.cardCount === 0 && visibleContent.canvasCount === 0) {
            console.log('✅ 画面はクリーンです（カードもグラフもなし）');
            console.log('   新しい表示システムを実装する準備ができています');
        } else {
            console.log('⚠️ まだ何か表示されています');
            console.log(`   カード: ${visibleContent.cardCount}枚`);
            console.log(`   グラフ: ${visibleContent.canvasCount}個`);
        }
        
        console.log('\n👀 ブラウザを確認してください');
        console.log('   実際の画面を目で見て確認してください');
        
    } finally {
        console.log('\n⏰ 15秒後にブラウザを閉じます...');
        await page.waitForTimeout(15000);
        await browser.close();
    }
}

// 実行
visualCheck().catch(console.error);