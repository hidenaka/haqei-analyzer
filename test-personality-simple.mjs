import { chromium } from 'playwright';

(async () => {
    console.log('🚀 人物像表示機能テスト開始');
    
    // ブラウザ起動
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500 
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // テストページにアクセス
        console.log('📄 テストページにアクセス中...');
        await page.goto('http://localhost:8080/test-personality-display.html');
        
        // ページ読み込み確認
        await page.waitForLoadState('networkidle');
        console.log('✅ ページ読み込み完了');
        
        // タイトル確認
        const title = await page.title();
        console.log('📝 ページタイトル:', title);
        
        // 初期状態のスクリーンショット
        await page.screenshot({ 
            path: 'screenshots/01-initial.png',
            fullPage: true 
        });
        console.log('📸 初期状態のスクリーンショット保存');
        
        // Engine OS選択
        await page.selectOption('#engine-select', '乾為天');
        console.log('✅ Engine OS: 乾為天を選択');
        
        // Interface OS選択
        await page.selectOption('#interface-select', '天澤履');
        console.log('✅ Interface OS: 天澤履を選択');
        
        // Safe Mode OS選択
        await page.selectOption('#safemode-select', '風地觀');
        console.log('✅ Safe Mode OS: 風地觀を選択');
        
        // 選択後のスクリーンショット
        await page.screenshot({ 
            path: 'screenshots/02-selected.png',
            fullPage: true 
        });
        console.log('📸 OS選択後のスクリーンショット保存');
        
        // 人物像生成ボタンをクリック
        console.log('🔄 人物像生成中...');
        await page.click('.generate-btn');
        
        // 結果が表示されるまで待機
        await page.waitForSelector('.personality-profile-section', { timeout: 5000 });
        console.log('✅ 人物像セクションが表示されました');
        
        // 待機
        await page.waitForTimeout(1000);
        
        // 結果のスクリーンショット
        await page.screenshot({ 
            path: 'screenshots/03-result.png',
            fullPage: true 
        });
        console.log('📸 結果表示のスクリーンショット保存');
        
        // 各要素の内容を取得して表示
        const profileTitle = await page.textContent('.profile-title');
        console.log('\n=== 表示内容確認 ===');
        console.log('タイトル:', profileTitle);
        
        const summary = await page.textContent('.main-summary');
        console.log('\n総合人物像:');
        console.log(summary);
        
        const innerDrive = await page.textContent('.inner-drive p');
        console.log('\n内なる原動力:');
        console.log(innerDrive);
        
        const socialFace = await page.textContent('.social-face p');
        console.log('\n社会での顔:');
        console.log(socialFace);
        
        const foundation = await page.textContent('.foundation p');
        console.log('\n心の基盤:');
        console.log(foundation);
        
        // 特徴エリアの確認
        const workStyle = await page.textContent('.area-item:has-text("仕事") p');
        console.log('\n仕事スタイル:', workStyle);
        
        const relationshipStyle = await page.textContent('.area-item:has-text("人間関係") p');
        console.log('人間関係:', relationshipStyle);
        
        const stressManagement = await page.textContent('.area-item:has-text("ストレス対処") p');
        console.log('ストレス対処:', stressManagement);
        
        // 個別OSカードの数を確認
        const osCards = await page.locator('.human-trait-section').count();
        console.log('\n個別OSカード数:', osCards);
        
        // 異なる組み合わせでテスト
        console.log('\n=== 組み合わせ変更テスト ===');
        await page.selectOption('#engine-select', '坤為地');
        await page.selectOption('#interface-select', '地天泰');
        await page.selectOption('#safemode-select', '地雷復');
        await page.click('.generate-btn');
        
        await page.waitForTimeout(1000);
        
        const newSummary = await page.textContent('.main-summary');
        console.log('\n新しい組み合わせの人物像:');
        console.log(newSummary);
        
        await page.screenshot({ 
            path: 'screenshots/04-alternative.png',
            fullPage: true 
        });
        console.log('📸 別の組み合わせのスクリーンショット保存');
        
        // モバイル表示テスト
        console.log('\n=== モバイル表示テスト ===');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        
        await page.screenshot({ 
            path: 'screenshots/05-mobile.png',
            fullPage: true 
        });
        console.log('📸 モバイル表示のスクリーンショット保存');
        
        // コンソールエラーチェック
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('❌ コンソールエラー:', msg.text());
            }
        });
        
        // JavaScript関数の確認
        const functionsExist = await page.evaluate(() => {
            return {
                HexagramHumanTraits: typeof window.HexagramHumanTraits === 'object',
                generatePersonalityProfile: typeof window.generatePersonalityProfile === 'function',
                getHumanTraitsByName: typeof window.getHumanTraitsByName === 'function'
            };
        });
        
        console.log('\n=== 関数存在確認 ===');
        console.log('HexagramHumanTraits:', functionsExist.HexagramHumanTraits ? '✅' : '❌');
        console.log('generatePersonalityProfile:', functionsExist.generatePersonalityProfile ? '✅' : '❌');
        console.log('getHumanTraitsByName:', functionsExist.getHumanTraitsByName ? '✅' : '❌');
        
        // データ件数確認
        const dataCount = await page.evaluate(() => {
            return Object.keys(window.HexagramHumanTraits).length;
        });
        console.log('\n登録されている卦の数:', dataCount);
        
        console.log('\n✅ すべてのテストが完了しました！');
        console.log('📁 スクリーンショットは screenshots/ フォルダに保存されています');
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error);
        await page.screenshot({ 
            path: 'screenshots/error.png',
            fullPage: true 
        });
    } finally {
        // ブラウザを開いたままにする
        console.log('\n📝 ブラウザは開いたままです。手動で確認後、Ctrl+Cで終了してください。');
        // await browser.close();
    }
})();