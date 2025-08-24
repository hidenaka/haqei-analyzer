const { chromium } = require('playwright');

async function testBasicResultsTab() {
    console.log('🔍 BasicResultsTabの包括的QAテスト開始');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // コンソールログを監視
        const consoleMessages = [];
        page.on('console', (msg) => {
            const msgType = msg.type();
            const msgText = msg.text();
            consoleMessages.push({
                type: msgType,
                text: msgText,
                timestamp: new Date().toISOString()
            });
            console.log('Console [' + msgType + ']: ' + msgText);
        });
        
        // エラーを監視
        const errors = [];
        page.on('pageerror', (error) => {
            errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });
        
        console.log('📱 results.htmlにアクセス中...');
        await page.goto('http://localhost:8080/results.html');
        
        // ページロード完了を待機
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('\n📊 テスト1: V3データベース読み込み確認');
        
        // V3データベース読み込みログを確認
        const v3DatabaseLogs = consoleMessages.filter(msg => 
            msg.text.includes('V3データベース読み込み') || 
            msg.text.includes('hexagram-human-traits-v3')
        );
        
        console.log('- V3データベース関連ログ: ' + v3DatabaseLogs.length + '件');
        v3DatabaseLogs.forEach(log => {
            console.log('  ' + log.type + ': ' + log.text);
        });
        
        // データベース読み込み成功ログを確認
        const successLog = consoleMessages.find(msg => 
            msg.text.includes('✅ V3データベース読み込み成功: 64 卦')
        );
        
        if (successLog) {
            console.log('✅ V3データベース読み込み成功ログを確認');
        } else {
            console.log('❌ V3データベース読み込み成功ログが見つからない');
        }
        
        console.log('\n🔧 テスト2: Triple OSカードの表示確認');
        
        // 代替方法: クラス名で検索
        const osCards = await page.locator('.os-card').count();
        console.log('- 総OSカード数 (by class): ' + osCards);
        
        // OSタイトルの確認
        const osTitles = await page.locator('h3, h4').allTextContents();
        const osRelatedTitles = osTitles.filter(title => 
            title.includes('Engine OS') || 
            title.includes('Interface OS') || 
            title.includes('Safe Mode') ||
            title.includes('SafeMode')
        );
        console.log('- OS関連タイトル: ' + osRelatedTitles.length + '件');
        osRelatedTitles.forEach(title => console.log('  - ' + title));
        
        console.log('\n📋 テスト3: V3データの表示確認');
        
        // ページ内のテキストコンテンツを取得
        const pageContent = await page.textContent('body');
        
        // V3データベースの特徴的なキーワードを確認
        const v3Keywords = [
            '創造的リーダーシップ',
            '受容的サポート', 
            '困難への対処',
            '慎重な判断',
            '待機の美学',
            'コミュニケーション重視',
            '対立の調和'
        ];
        
        const foundKeywords = v3Keywords.filter(keyword => 
            pageContent.includes(keyword)
        );
        
        console.log('- V3データキーワード検出: ' + foundKeywords.length + '/' + v3Keywords.length);
        foundKeywords.forEach(keyword => console.log('  ✅ ' + keyword));
        
        const missingKeywords = v3Keywords.filter(keyword => 
            !pageContent.includes(keyword)
        );
        missingKeywords.forEach(keyword => console.log('  ❌ ' + keyword));
        
        console.log('\n⚙️ テスト4: 開発モードでの動作確認');
        
        // 開発モードボタンの確認
        const devModeButton = await page.locator('button').filter({ hasText: /開発|Dev|デバッグ/ }).count();
        console.log('- 開発モードボタン数: ' + devModeButton);
        
        console.log('\n🔍 テスト5: DOM構造の詳細確認');
        
        // 主要なコンテナの確認
        const containers = await page.locator('.container, .content, .results, .basic-results').count();
        console.log('- メインコンテナ数: ' + containers);
        
        // タブの確認
        const tabs = await page.locator('.tab, .tab-content, [role="tab"]').count();
        console.log('- タブ要素数: ' + tabs);
        
        // カードの確認
        const cards = await page.locator('.card, .result-card, .analysis-card').count();
        console.log('- カード要素数: ' + cards);
        
        console.log('\n📊 テスト6: JavaScript実行エラーの確認');
        
        console.log('- 総エラー数: ' + errors.length);
        if (errors.length > 0) {
            errors.forEach((error, index) => {
                console.log('  ' + (index + 1) + '. ' + error);
            });
        } else {
            console.log('✅ JavaScriptエラーなし');
        }
        
        console.log('\n📸 テスト7: スクリーンショット取得');
        
        await page.screenshot({ 
            path: 'basic-results-tab-screenshot.png',
            fullPage: true 
        });
        console.log('✅ スクリーンショットを保存: basic-results-tab-screenshot.png');
        
        console.log('\n🎯 QAテスト結果サマリー');
        console.log('================================');
        console.log('V3データベースログ: ' + (v3DatabaseLogs.length > 0 ? '✅' : '❌'));
        console.log('V3読み込み成功ログ: ' + (successLog ? '✅' : '❌'));
        console.log('OSカード表示: ' + (osCards > 0 ? '✅' : '❌') + ' (' + osCards + '個)');
        console.log('V3キーワード: ' + (foundKeywords.length > 0 ? '✅' : '❌') + ' (' + foundKeywords.length + '/' + v3Keywords.length + ')');
        console.log('JavaScriptエラー: ' + (errors.length === 0 ? '✅' : '❌') + ' (' + errors.length + '件)');
        
        return {
            v3DatabaseLogs: v3DatabaseLogs.length,
            successLog: !!successLog,
            osCards: osCards,
            foundKeywords: foundKeywords.length,
            totalKeywords: v3Keywords.length,
            errors: errors.length,
            consoleMessages: consoleMessages.length
        };
        
    } catch (error) {
        console.error('❌ テスト実行エラー:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

testBasicResultsTab().then(result => {
    console.log('\n🏆 テスト完了');
    console.log('結果:', JSON.stringify(result, null, 2));
}).catch(error => {
    console.error('❌ テスト失敗:', error.message);
    process.exit(1);
});
