/**
 * テストファースト：単一DOM管理システムのテスト
 * CLAUDE.md準拠：まずテストを書く
 */

import { chromium } from 'playwright';
import assert from 'assert';

async function testSingleDOMSystem() {
    console.log('🧪 単一DOM管理システムテスト');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle'
        });
        
        // テスト1: Canvas要素が破壊されないこと
        console.log('✓ テスト1: Canvas要素の保護');
        
        // 初期Canvas要素のIDを記録
        const initialCanvasIds = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('canvas')).map(c => c.id);
        });
        
        console.log(`  初期Canvas数: ${initialCanvasIds.length}個`);
        
        // 分析実行
        await page.fill('textarea, #worryInput, #situation-text', 'テスト入力');
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        
        await page.waitForTimeout(3000);
        
        // 分析後のCanvas要素を確認
        const afterCanvasIds = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('canvas')).map(c => c.id);
        });
        
        console.log(`  分析後Canvas数: ${afterCanvasIds.length}個`);
        
        // テスト2: eight-scenarios-display-containerが存在すること
        console.log('\n✓ テスト2: コンテナの存在');
        
        const containerExists = await page.evaluate(() => {
            return !!document.getElementById('eight-scenarios-display-container');
        });
        
        console.log(`  eight-scenarios-display-container: ${containerExists ? '✅' : '❌'}`);
        
        // テスト3: エラーが発生しないこと
        console.log('\n✓ テスト3: エラーチェック');
        
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        
        await page.fill('textarea, #worryInput, #situation-text', 'エラーテスト');
        await page.click('button[type="submit"], .analyze-btn, #aiGuessBtn');
        
        await page.waitForTimeout(2000);
        
        const nonCSPErrors = errors.filter(e => !e.includes('CSP'));
        console.log(`  エラー数: ${nonCSPErrors.length}件`);
        
        // アサーション
        const passed = 
            afterCanvasIds.length >= 3 && // 3個以上のCanvas
            containerExists && // コンテナ存在
            nonCSPErrors.length === 0; // エラーなし
        
        console.log('\n=====================================');
        console.log(passed ? '✅ テスト成功' : '❌ テスト失敗');
        console.log('=====================================');
        
        return passed;
        
    } finally {
        await browser.close();
    }
}

// 実行
testSingleDOMSystem().then(passed => {
    process.exit(passed ? 0 : 1);
}).catch(error => {
    console.error('❌ テストエラー:', error);
    process.exit(1);
});