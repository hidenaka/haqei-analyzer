/**
 * 視覚確認 - 実際のUI状態をスクリーンショットで確認
 */

import { chromium } from 'playwright';

async function visualCheck() {
    console.log('📸 視覚確認 - UI状態をスクリーンショットで確認');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(3000);
        
        // 現在の表示内容を確認
        const content = await page.evaluate(() => {
            const title = document.querySelector('h1')?.textContent;
            const textarea = document.querySelector('textarea, #situation-text, #worryInput');
            const button = document.querySelector('button[type="submit"], .analyze-btn');
            
            return {
                title: title,
                placeholder: textarea?.placeholder,
                buttonText: button?.textContent?.trim(),
                textareaId: textarea?.id,
                allTextareas: Array.from(document.querySelectorAll('textarea')).map(t => ({
                    id: t.id,
                    placeholder: t.placeholder
                }))
            };
        });
        
        console.log('現在の表示内容:');
        console.log('  タイトル:', content.title);
        console.log('  入力欄プレースホルダー:', content.placeholder);
        console.log('  ボタンテキスト:', content.buttonText);
        console.log('  使用中のテキストエリアID:', content.textareaId);
        console.log('  全テキストエリア:', content.allTextareas);
        
        // スクリーンショット撮影
        await page.screenshot({ 
            path: '20250814_ui_visual_check.png',
            fullPage: false
        });
        
        console.log('\n📷 スクリーンショット保存: 20250814_ui_visual_check.png');
        
        return content;
        
    } catch (error) {
        console.error('❌ エラー:', error);
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// 実行
visualCheck().catch(console.error);