/**
 * クイック検証テスト - dist修正後の確認
 */

import { chromium } from 'playwright';

async function quickVerification() {
    console.log('⚡ クイック検証テスト - dist修正後');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // キャッシュクリアのため強制リロード
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        // 強制リフレッシュ
        await page.keyboard.press('F5');
        await page.waitForTimeout(2000);
        
        // 修正結果の確認
        const result = await page.evaluate(() => {
            return {
                title: document.title,
                h1: document.querySelector('h1')?.textContent?.trim(),
                subtitle: document.querySelector('h1')?.nextElementSibling?.textContent?.trim(),
                placeholder: document.querySelector('textarea, #worryInput')?.placeholder,
                has384: document.body.textContent.includes('384'),
                hasAnalysisPrecision: document.body.textContent.includes('分析精度'),
                hasEmotionalWords: /悩み|迷い|不安/.test(document.body.textContent),
                textareaCount: document.querySelectorAll('textarea').length
            };
        });
        
        console.log('📊 修正結果確認:');
        console.log('--------------------------------');
        console.log(`タイトル: "${result.title}"`);
        console.log(`H1: "${result.h1}"`);
        console.log(`サブタイトル: "${result.subtitle}"`);
        console.log(`プレースホルダー: "${result.placeholder}"`);
        console.log(`384パターン言及: ${result.has384 ? '✅' : '❌'}`);
        console.log(`分析精度表示: ${result.hasAnalysisPrecision ? '✅' : '❌'}`);
        console.log(`感情的表現除去: ${!result.hasEmotionalWords ? '✅' : '❌'}`);
        
        let score = 0;
        
        // 評価
        if (result.title.includes('易経未来分析システム')) score += 25;
        if (result.h1.includes('易経') || result.subtitle?.includes('384')) score += 25;
        if (result.placeholder?.includes('客観的') && !result.placeholder?.includes('悩み')) score += 25;
        if (result.has384 && result.hasAnalysisPrecision) score += 25;
        
        console.log(`\n総合スコア: ${score}/100点`);
        
        if (score >= 75) {
            console.log('✅ 修正成功！客観的分析ツールに変更完了');
        } else if (score >= 50) {
            console.log('⚠️ 部分的成功。追加修正が必要');
        } else {
            console.log('❌ 修正が反映されていない');
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: '20250814_after_dist_fix.png',
            fullPage: false
        });
        
        console.log('\n📸 修正後スクリーンショット保存');
        
        return result;
        
    } catch (error) {
        console.error('❌ 検証エラー:', error);
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

quickVerification().catch(console.error);