import { chromium } from 'playwright';

(async () => {
    console.log('========================================');
    console.log('🎯 最終ユーザー体験確認テスト');
    console.log('========================================\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    const improvements = [];
    const remainingIssues = [];
    
    try {
        // 1. サイトアクセス
        await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // タイトル確認
        const title = await page.title();
        console.log(`📌 新タイトル: "${title}"`);
        if (title.includes('性格タイプ診断')) {
            improvements.push('✅ タイトルが分かりやすくなった');
        } else if (title.includes('仮想人格')) {
            remainingIssues.push('❌ タイトルに「仮想人格」が残っている');
        }
        
        // メイン見出し確認
        const heading = await page.locator('h1').first().textContent();
        console.log(`📝 メイン見出し: "${heading}"\n`);
        
        // 開始ボタンテキスト確認
        const startBtn = await page.locator('button').filter({ hasText: /開始|スタート/ }).first();
        const btnText = await startBtn.textContent();
        console.log(`🔘 開始ボタン: "${btnText.trim()}"`);
        
        if (btnText.includes('性格タイプ診断')) {
            improvements.push('✅ ボタンテキストが親しみやすい');
        } else if (btnText.includes('仮想人格')) {
            remainingIssues.push('❌ ボタンに「仮想人格」が残っている');
        }
        
        // 2. 質問画面確認
        await startBtn.click();
        await page.waitForTimeout(1000);
        
        const questionTitle = await page.locator('#question-title').textContent();
        console.log(`\n❓ 質問1: "${questionTitle}"`);
        
        if (questionTitle.includes('新しいこと')) {
            improvements.push('✅ 質問が正しく表示される');
        } else if (questionTitle === 'HaQeiとは？') {
            remainingIssues.push('❌ 質問表示バグが残っている');
        }
        
        // 3. 分析中の表示確認
        // 最初の質問に答える
        await page.locator('.option').first().click();
        await page.locator('#next-btn').click();
        
        // スキップして分析画面へ
        for (let i = 1; i < 36; i++) {
            await page.locator('.option').first().click();
            await page.locator('#next-btn').click();
            await page.waitForTimeout(50);
        }
        
        await page.waitForTimeout(2000);
        
        // 分析中のテキスト確認
        const analysisText = await page.locator('.loading-text').textContent();
        console.log(`\n⏳ 分析中表示: "${analysisText}"`);
        
        if (analysisText.includes('3つの性格')) {
            improvements.push('✅ 「Triple OS」が「3つの性格」に変更された');
        } else if (analysisText.includes('Triple OS')) {
            remainingIssues.push('❌ 「Triple OS」表記が残っている');
        }
        
        // 4. 結果画面の確認
        await page.waitForTimeout(5000);
        
        // OSカードの確認
        const cards = await page.locator('.card').all();
        console.log(`\n📊 結果カード数: ${cards.length}`);
        
        // 専門用語チェック
        const pageContent = await page.content();
        
        if (!pageContent.includes('Engine OS')) {
            improvements.push('✅ 「Engine OS」が表示されない');
        } else {
            remainingIssues.push('❌ 「Engine OS」が残っている');
        }
        
        if (!pageContent.includes('Interface OS')) {
            improvements.push('✅ 「Interface OS」が表示されない');
        } else {
            remainingIssues.push('❌ 「Interface OS」が残っている');
        }
        
        if (pageContent.includes('内なる原動力')) {
            improvements.push('✅ 「内なる原動力」という分かりやすい表現');
        }
        
        if (pageContent.includes('人とのつながり方')) {
            improvements.push('✅ 「人とのつながり方」という親しみやすい表現');
        }
        
        if (pageContent.includes('守りの姿勢')) {
            improvements.push('✅ 「守りの姿勢」という理解しやすい表現');
        }
        
        // undefined/null/NaNチェック
        if (!pageContent.includes('undefined') && 
            !pageContent.includes('null') && 
            !pageContent.includes('NaN')) {
            improvements.push('✅ エラー表示（undefined/null/NaN）がない');
        } else {
            remainingIssues.push('❌ エラー表示が残っている');
        }
        
        // スクリーンショット
        await page.screenshot({ path: 'final-ux-results.png' });
        
    } catch (error) {
        console.error('エラー:', error);
    } finally {
        await browser.close();
        
        // 最終レポート
        console.log('\n========================================');
        console.log('📊 改善確認レポート');
        console.log('========================================\n');
        
        console.log('✨ 改善された点:');
        improvements.forEach(imp => console.log(`  ${imp}`));
        
        if (remainingIssues.length > 0) {
            console.log('\n⚠️ 残っている問題:');
            remainingIssues.forEach(issue => console.log(`  ${issue}`));
        }
        
        const score = (improvements.length / (improvements.length + remainingIssues.length)) * 100;
        console.log(`\n📈 改善率: ${score.toFixed(1)}%`);
        
        if (score >= 90) {
            console.log('🎉 素晴らしい！ユーザー体験が大幅に改善されました');
        } else if (score >= 70) {
            console.log('👍 良好です。主要な問題は解決されています');
        } else {
            console.log('🔧 まだ改善の余地があります');
        }
        
        console.log('\n✅ テスト完了');
    }
})();