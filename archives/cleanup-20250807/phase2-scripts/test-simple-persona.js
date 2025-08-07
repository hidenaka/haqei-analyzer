/**
 * シンプルなペルソナテスト - 動作確認用
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';

async function testSimplePersona() {
    console.log('🎭 Simple Persona Test Starting...');
    
    let browser = null;
    
    try {
        browser = await chromium.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage({
            viewport: { width: 1280, height: 1024 }
        });
        
        // コンソール監視
        page.on('console', msg => {
            console.log('📝 Console:', msg.text());
        });
        
        page.on('pageerror', error => {
            console.error('❌ Page Error:', error.message);
        });
        
        console.log('🌐 Loading simple test page...');
        await page.goto('http://localhost:8000/test-persona-simple.html', {
            waitUntil: 'networkidle'
        });
        
        // 初期スクリーンショット
        await fs.mkdir('screenshots', { recursive: true });
        await page.screenshot({ 
            path: `screenshots/simple_test_initial_${Date.now()}.png`,
            fullPage: true
        });
        console.log('📸 Initial screenshot captured');
        
        // テストボタンクリック
        console.log('🔘 Clicking test button...');
        await page.click('.test-button');
        
        // 結果が表示されるまで少し待機
        await page.waitForTimeout(3000);
        
        // ペルソナカードの確認
        const personaCards = await page.$$('.virtual-persona-card');
        console.log(`🎭 Found ${personaCards.length} persona cards`);
        
        // テスト結果の取得
        const testResults = await page.textContent('#test-results');
        console.log('📊 Test Results:');
        console.log(testResults);
        
        // 各ペルソナカードの詳細情報を取得
        for (let i = 0; i < personaCards.length; i++) {
            const cardInfo = await page.evaluate((index) => {
                const card = document.querySelectorAll('.virtual-persona-card')[index];
                if (card) {
                    return {
                        name: card.querySelector('.persona-name')?.textContent,
                        symbol: card.querySelector('.persona-symbol')?.textContent,
                        metaphor: card.querySelector('.persona-metaphor')?.textContent,
                        catchphrase: card.querySelector('.persona-catchphrase')?.textContent,
                        traits: Array.from(card.querySelectorAll('.trait-tag')).map(t => t.textContent)
                    };
                }
                return null;
            }, i);
            
            if (cardInfo) {
                console.log(`🎭 Persona ${i + 1}:`, JSON.stringify(cardInfo, null, 2));
            }
        }
        
        // 最終スクリーンショット
        await page.screenshot({ 
            path: `screenshots/simple_test_final_${Date.now()}.png`,
            fullPage: true
        });
        console.log('📸 Final screenshot captured');
        
        // 成功判定
        const success = personaCards.length >= 3 && testResults.includes('SUCCESS');
        
        console.log('\n=== SIMPLE PERSONA TEST SUMMARY ===');
        console.log(`Status: ${success ? 'SUCCESS' : 'NEEDS_ATTENTION'}`);
        console.log(`Persona Cards: ${personaCards.length}/3`);
        console.log(`Test Results: ${testResults.includes('SUCCESS') ? 'PASS' : 'FAIL'}`);
        console.log('===================================\n');
        
        return success;
        
    } catch (error) {
        console.error('❌ Simple test failed:', error);
        return false;
    } finally {
        if (browser) {
            // 5秒間開いておく
            console.log('⏱️ Keeping browser open for 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            await browser.close();
            console.log('🧹 Browser closed');
        }
    }
}

testSimplePersona();