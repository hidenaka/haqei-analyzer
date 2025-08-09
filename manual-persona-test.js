/**
 * 手動ペルソナテスト - ブラウザを開いて画面キャプチャのみ実行
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';

async function manualPersonaTest() {
    console.log('🎭 Manual Persona Test - Opening browser for manual testing');
    
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
            if (msg.text().includes('VirtualPersonaEnhancer') || msg.text().includes('persona')) {
                console.log('📝 Console:', msg.text());
            }
        });
        
        page.on('pageerror', error => {
            console.error('❌ Page Error:', error.message);
        });
        
        console.log('🌐 Loading OS Analyzer page...');
        await page.goto('http://localhost:8000/os_analyzer.html', {
            waitUntil: 'networkidle'
        });
        
        // VirtualPersonaEnhancerの確認
        const personaEnhancerCheck = await page.evaluate(() => {
            return {
                enhancerExists: typeof window.virtualPersonaEnhancer !== 'undefined',
                enhancerClass: typeof VirtualPersonaEnhancer !== 'undefined',
                personaData: window.virtualPersonaEnhancer ? Object.keys(window.virtualPersonaEnhancer) : null
            };
        });
        
        console.log('🔍 Persona Enhancer Status:', personaEnhancerCheck);
        
        // 初期画面スクリーンショット
        await fs.mkdir('screenshots', { recursive: true });
        await page.screenshot({ 
            path: `screenshots/manual_test_initial_${Date.now()}.png`,
            fullPage: true
        });
        console.log('📸 Initial screenshot captured');
        
        // スタートボタンの検出
        const startButtons = await page.evaluate(() => {
            const allButtons = Array.from(document.querySelectorAll('button, .button, [onclick], [data-action]'));
            return allButtons.map(btn => ({
                id: btn.id,
                className: btn.className,
                textContent: btn.textContent?.trim(),
                tagName: btn.tagName,
                onclick: btn.onclick ? 'has onclick' : null
            })).filter(btn => 
                btn.textContent?.includes('開始') || 
                btn.textContent?.includes('スタート') ||
                btn.textContent?.includes('始める') ||
                btn.id?.includes('start') ||
                btn.className?.includes('start')
            );
        });
        
        console.log('🔍 Found start buttons:', startButtons);
        
        // 10秒待機してからブラウザ閉じる（手動操作時間）
        console.log('⏱️  Manual testing window - Browser will close automatically in 20 seconds');
        console.log('📋 Please manually:');
        console.log('   1. Click the start button');
        console.log('   2. Answer some questions');
        console.log('   3. Check if persona information appears in results');
        
        await page.waitForTimeout(20000);
        
        // 最終スクリーンショット
        await page.screenshot({ 
            path: `screenshots/manual_test_final_${Date.now()}.png`,
            fullPage: true
        });
        console.log('📸 Final screenshot captured');
        
    } catch (error) {
        console.error('❌ Manual test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('🧹 Browser closed');
        }
    }
}

manualPersonaTest();