const { test, expect } = require('@playwright/test');

test.describe('人物像表示機能テスト', () => {
    test('人物像生成と表示の確認', async ({ page }) => {
        // テストページにアクセス
        await page.goto('http://localhost:8080/test-personality-display.html');
        
        // ページタイトル確認
        await expect(page).toHaveTitle('人物像表示テスト - HAQEI');
        
        // 初期表示の確認
        console.log('✅ ページ読み込み完了');
        
        // Engine OS選択
        await page.selectOption('#engine-select', '乾為天');
        console.log('✅ Engine OS: 乾為天を選択');
        
        // Interface OS選択
        await page.selectOption('#interface-select', '天澤履');
        console.log('✅ Interface OS: 天澤履を選択');
        
        // Safe Mode OS選択
        await page.selectOption('#safemode-select', '風地觀');
        console.log('✅ Safe Mode OS: 風地觀を選択');
        
        // 生成ボタンクリック前のスクリーンショット
        await page.screenshot({ 
            path: 'test-before-generate.png',
            fullPage: true 
        });
        console.log('📸 生成前のスクリーンショット取得');
        
        // 人物像生成ボタンをクリック
        await page.click('.generate-btn');
        console.log('✅ 人物像生成ボタンをクリック');
        
        // 結果が表示されるまで待機
        await page.waitForSelector('.personality-profile-section', { timeout: 5000 });
        console.log('✅ 人物像セクションが表示されました');
        
        // 各要素の存在確認
        const profileTitle = await page.locator('.profile-title').textContent();
        expect(profileTitle).toContain('あなたの人物像');
        console.log('✅ タイトル表示確認:', profileTitle);
        
        // 総合的な人物像の確認
        const summary = await page.locator('.main-summary').textContent();
        expect(summary).toContain('創造的リーダー');
        expect(summary).toContain('礼儀正しい社交家');
        expect(summary).toContain('洞察力ある観察者');
        console.log('✅ 総合人物像:', summary);
        
        // 3つの側面の確認
        const innerDrive = await page.locator('.inner-drive p').textContent();
        expect(innerDrive).toBeTruthy();
        console.log('✅ 内なる原動力:', innerDrive.substring(0, 50) + '...');
        
        const socialFace = await page.locator('.social-face p').textContent();
        expect(socialFace).toBeTruthy();
        console.log('✅ 社会での顔:', socialFace.substring(0, 50) + '...');
        
        const foundation = await page.locator('.foundation p').textContent();
        expect(foundation).toBeTruthy();
        console.log('✅ 心の基盤:', foundation.substring(0, 50) + '...');
        
        // 特徴エリアの確認
        const workStyle = await page.locator('.area-item:has-text("仕事") p').textContent();
        expect(workStyle).toContain('仕事では');
        console.log('✅ 仕事スタイル:', workStyle);
        
        const relationshipStyle = await page.locator('.area-item:has-text("人間関係") p').textContent();
        expect(relationshipStyle).toContain('人間関係では');
        console.log('✅ 人間関係スタイル:', relationshipStyle);
        
        const stressManagement = await page.locator('.area-item:has-text("ストレス対処") p').textContent();
        expect(stressManagement).toContain('ストレス対処は');
        console.log('✅ ストレス対処:', stressManagement);
        
        // 成長へのヒントの確認
        const growthSuggestions = await page.locator('.growth-suggestions').isVisible();
        expect(growthSuggestions).toBeTruthy();
        console.log('✅ 成長へのヒントセクション表示確認');
        
        // 個別OSカードの確認
        const osCards = await page.locator('.human-trait-section').count();
        expect(osCards).toBeGreaterThan(0);
        console.log('✅ 個別OSカード数:', osCards);
        
        // 最終スクリーンショット
        await page.screenshot({ 
            path: 'test-after-generate.png',
            fullPage: true 
        });
        console.log('📸 生成後のスクリーンショット取得');
        
        // デバッグ情報の確認
        const debugInfo = await page.locator('#debug-info').isVisible();
        expect(debugInfo).toBeTruthy();
        console.log('✅ デバッグ情報表示確認');
        
        // コンソールログ確認
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('❌ コンソールエラー:', msg.text());
            }
        });
        
        // 異なる組み合わせでテスト
        await page.selectOption('#engine-select', '坤為地');
        await page.selectOption('#interface-select', '地天泰');
        await page.selectOption('#safemode-select', '地雷復');
        await page.click('.generate-btn');
        
        await page.waitForTimeout(1000);
        
        const newSummary = await page.locator('.main-summary').textContent();
        expect(newSummary).toContain('受容的サポーター');
        console.log('✅ 組み合わせ変更後の確認:', newSummary.substring(0, 100) + '...');
        
        // モバイル表示テスト
        await page.setViewportSize({ width: 375, height: 667 });
        await page.screenshot({ 
            path: 'test-mobile-view.png',
            fullPage: true 
        });
        console.log('📸 モバイル表示のスクリーンショット取得');
        
        console.log('\n✅ すべてのテストが成功しました！');
    });
});