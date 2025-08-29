import { chromium } from 'playwright';

/**
 * BasicResultsTabの実装確認テスト
 * 36問回答後の結果表示が固定データでなく動的に変更されているか確認
 */

async function testBasicResultsTab() {
    console.log('🚀 BasicResultsTab実装確認テスト開始');
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox']
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // エラーログを捕捉
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('❌ ブラウザエラー:', msg.text());
            }
        });
        
        // Step 1: OSアナライザーページへ移動
        console.log('\n📍 Step 1: OSアナライザーページへ移動');
        await page.goto('http://localhost:8088/public/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // Step 2: 診断開始
        console.log('\n📍 Step 2: 診断を開始');
        const startButton = await page.locator('button:has-text("診断を開始")').first();
        if (await startButton.isVisible()) {
            await startButton.click();
            console.log('✅ 診断開始ボタンをクリック');
        }
        
        await page.waitForTimeout(1000);
        
        // Step 3: 36問に回答（パターンを変えて回答）
        console.log('\n📍 Step 3: 36問に順次回答');
        const answerPatterns = [
            // Engine OS関連 (1-12) - 論理的思考を高めに
            5, 4, 5, 5, 4, 5, 4, 5, 5, 4, 5, 4,
            // Interface OS関連 (13-24) - 社交性を中程度に
            3, 4, 3, 3, 4, 3, 4, 3, 3, 4, 3, 4,
            // SafeMode OS関連 (25-36) - 安全性を低めに
            2, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2
        ];
        
        for (let i = 0; i < 36; i++) {
            try {
                // 質問が表示されるまで待機
                await page.waitForSelector('.question-text', { timeout: 5000 });
                
                // 質問内容を取得
                const questionText = await page.locator('.question-text').first().textContent();
                console.log(`  問${i + 1}: ${questionText?.substring(0, 30)}...`);
                
                // 回答を選択（パターンに基づく）
                const answerValue = answerPatterns[i];
                const radioSelector = `input[type="radio"][value="${answerValue}"]`;
                await page.locator(radioSelector).first().click();
                
                // 次へボタンをクリック
                await page.locator('button:has-text("次へ")').first().click();
                await page.waitForTimeout(300);
                
            } catch (error) {
                console.log(`  ⚠️ 問${i + 1}でエラー:`, error.message);
            }
        }
        
        console.log('✅ 36問の回答完了');
        
        // Step 4: 結果ページへの遷移を待つ
        console.log('\n📍 Step 4: 結果ページへの遷移を待機');
        await page.waitForURL('**/results.html', { timeout: 10000 });
        console.log('✅ 結果ページに遷移');
        
        // ページロード完了を待つ
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Step 5: 基本結果タブの内容を確認
        console.log('\n📍 Step 5: 基本結果タブの内容を確認');
        
        // 各OSカードの情報を取得
        const osCards = await page.locator('.os-card').all();
        console.log(`\n発見されたOSカード数: ${osCards.length}`);
        
        const results = {
            engineOS: null,
            interfaceOS: null,
            safeModeOS: null
        };
        
        for (const card of osCards) {
            const title = await card.locator('.os-name').textContent().catch(() => '');
            const hexagramName = await card.locator('.hexagram-name').textContent().catch(() => '');
            const traits = await card.locator('.trait-badge').allTextContents().catch(() => []);
            const personality = await card.locator('.personality-core').textContent().catch(() => '');
            const description = await card.locator('.trait-description').textContent().catch(() => '');
            
            const osData = {
                title: title?.trim(),
                hexagram: hexagramName?.trim(),
                traits: traits,
                personality: personality?.trim(),
                description: description?.trim()
            };
            
            if (title?.includes('Engine')) {
                results.engineOS = osData;
            } else if (title?.includes('Interface')) {
                results.interfaceOS = osData;
            } else if (title?.includes('SafeMode')) {
                results.safeModeOS = osData;
            }
        }
        
        // Step 6: 結果の検証
        console.log('\n📊 取得した結果データ:');
        console.log('\n【Engine OS】');
        if (results.engineOS) {
            console.log('  卦名:', results.engineOS.hexagram);
            console.log('  特性:', results.engineOS.traits.join(', '));
            console.log('  人物像:', results.engineOS.personality);
            console.log('  説明:', results.engineOS.description?.substring(0, 50) + '...');
        } else {
            console.log('  ❌ データが取得できませんでした');
        }
        
        console.log('\n【Interface OS】');
        if (results.interfaceOS) {
            console.log('  卦名:', results.interfaceOS.hexagram);
            console.log('  特性:', results.interfaceOS.traits.join(', '));
            console.log('  人物像:', results.interfaceOS.personality);
            console.log('  説明:', results.interfaceOS.description?.substring(0, 50) + '...');
        } else {
            console.log('  ❌ データが取得できませんでした');
        }
        
        console.log('\n【SafeMode OS】');
        if (results.safeModeOS) {
            console.log('  卦名:', results.safeModeOS.hexagram);
            console.log('  特性:', results.safeModeOS.traits.join(', '));
            console.log('  人物像:', results.safeModeOS.personality);
            console.log('  説明:', results.safeModeOS.description?.substring(0, 50) + '...');
        } else {
            console.log('  ❌ データが取得できませんでした');
        }
        
        // Step 7: 固定データ問題のチェック
        console.log('\n🔍 固定データ問題のチェック:');
        
        // 「調和、成長、変化」のような固定表示がないか確認
        const pageContent = await page.content();
        const hasFixedTraits = pageContent.includes('調和') && 
                               pageContent.includes('成長') && 
                               pageContent.includes('変化');
        
        if (hasFixedTraits) {
            console.log('⚠️ 固定データ「調和、成長、変化」が検出されました');
        } else {
            console.log('✅ 固定データは検出されませんでした');
        }
        
        // 「この易卦は特別な意味を持ちます」のような汎用表現がないか確認
        const hasGenericText = pageContent.includes('この易卦は特別な意味を持ちます') ||
                               pageContent.includes('内なる声に耳を傾ける');
        
        if (hasGenericText) {
            console.log('⚠️ 汎用的な表現が検出されました');
        } else {
            console.log('✅ 汎用的な表現は検出されませんでした');
        }
        
        // 各OSが異なる内容を表示しているか確認
        const allTraits = [
            results.engineOS?.traits || [],
            results.interfaceOS?.traits || [],
            results.safeModeOS?.traits || []
        ];
        
        const uniqueTraits = new Set(allTraits.flat());
        if (uniqueTraits.size > 6) {
            console.log(`✅ 各OSで異なる特性が表示されています（${uniqueTraits.size}種類）`);
        } else {
            console.log(`⚠️ 特性の種類が少ない可能性があります（${uniqueTraits.size}種類）`);
        }
        
        // スクリーンショットを保存
        await page.screenshot({ 
            path: 'basic-results-tab-test.png',
            fullPage: true
        });
        console.log('\n📸 スクリーンショットを保存: basic-results-tab-test.png');
        
        // 総合評価
        console.log('\n========================================');
        console.log('📊 テスト結果サマリー');
        console.log('========================================');
        
        const hasAllData = results.engineOS && results.interfaceOS && results.safeModeOS;
        const hasUniqueContent = uniqueTraits.size > 6;
        const noFixedData = !hasFixedTraits && !hasGenericText;
        
        if (hasAllData && hasUniqueContent && noFixedData) {
            console.log('✅ BasicResultsTabは正しく実装されています！');
            console.log('  - 3つのOSすべてのデータが表示されている');
            console.log('  - 各OSで異なる内容が表示されている');
            console.log('  - 固定データや汎用表現が排除されている');
        } else {
            console.log('⚠️ 改善が必要な項目があります:');
            if (!hasAllData) console.log('  - OSデータの取得に問題があります');
            if (!hasUniqueContent) console.log('  - 内容の多様性が不足しています');
            if (!noFixedData) console.log('  - 固定データまたは汎用表現が残っています');
        }
        
        console.log('\n⏱️ テストを10秒後に終了します...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('\n❌ テスト実行エラー:', error);
    } finally {
        await browser.close();
        console.log('\n✅ テスト完了');
    }
}

// テスト実行
testBasicResultsTab().catch(console.error);