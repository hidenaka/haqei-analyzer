/**
 * H384_DATA 読み込み単体テスト
 */

const { chromium } = require('playwright');

async function testH384Data() {
    console.log('🧪 H384_DATA 単体テスト開始...\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // コンソールログをキャプチャ
    page.on('console', msg => {
        console.log(`[${msg.type()}] ${msg.text()}`);
    });
    
    try {
        console.log('📄 テストページロード中...');
        await page.goto('http://localhost:8790/test-h384-data.html');
        
        // ページ読み込み完了まで待機
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // H384_DATAの状態確認
        const dataStatus = await page.evaluate(() => {
            return {
                exists: typeof H384_DATA !== 'undefined',
                type: typeof H384_DATA,
                length: H384_DATA ? H384_DATA.length : 0,
                isArray: Array.isArray(H384_DATA),
                firstEntry: H384_DATA ? H384_DATA[0] : null
            };
        });
        
        console.log('\n🎯 H384_DATA 状態:');
        console.log(`   存在: ${dataStatus.exists}`);
        console.log(`   タイプ: ${dataStatus.type}`);
        console.log(`   長さ: ${dataStatus.length}`);
        console.log(`   配列: ${dataStatus.isArray}`);
        
        if (dataStatus.firstEntry) {
            console.log(`   最初のエントリ: ${JSON.stringify(dataStatus.firstEntry).substring(0, 100)}...`);
        }
        
        // 結果表示を待機
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
    } finally {
        await browser.close();
    }
    
    console.log('\n🏁 H384_DATA 単体テスト完了');
}

// テスト実行
if (require.main === module) {
    testH384Data().catch(console.error);
}

module.exports = { testH384Data };