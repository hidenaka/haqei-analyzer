const { chromium } = require('playwright');

async function testV3DataContent() {
    console.log('🔍 V3データ内容の詳細テスト');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        await page.goto('http://localhost:8080/results.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('\n📊 V3データベースの詳細内容確認');
        
        // V3データベースの内容を取得
        const v3Data = await page.evaluate(() => {
            if (window.HexagramHumanTraitsV3) {
                return {
                    totalHexagrams: Object.keys(window.HexagramHumanTraitsV3).length,
                    sampleHexagram: window.HexagramHumanTraitsV3[1], // 乾為天
                    availableKeys: Object.keys(window.HexagramHumanTraitsV3).slice(0, 5)
                };
            }
            return null;
        });
        
        if (v3Data) {
            console.log('✅ V3データベース取得成功');
            console.log('- 総卦数:', v3Data.totalHexagrams);
            console.log('- 利用可能なキー:', v3Data.availableKeys);
            console.log('- サンプル卦データ（乾為天）:');
            console.log(JSON.stringify(v3Data.sampleHexagram, null, 2));
        } else {
            console.log('❌ V3データベースが取得できません');
        }
        
        console.log('\n🎯 OSカードの詳細データ確認');
        
        // 各OSカードの詳細データを取得
        const osCardData = await page.evaluate(() => {
            const results = {};
            
            // Engine OSカードの内容
            const engineCard = document.querySelector('.os-card');
            if (engineCard) {
                results.engineOS = {
                    text: engineCard.textContent,
                    hasHexagramName: engineCard.textContent.includes('乾為天'),
                    hasType: engineCard.textContent.includes('タイプ:'),
                    hasAdvice: engineCard.textContent.includes('アドバイス:')
                };
            }
            
            // Interface OSカードの内容
            const interfaceCard = document.querySelectorAll('.os-card')[1];
            if (interfaceCard) {
                results.interfaceOS = {
                    text: interfaceCard.textContent,
                    hasHexagramName: interfaceCard.textContent.includes('兌為澤'),
                    hasType: interfaceCard.textContent.includes('タイプ:'),
                    hasAdvice: interfaceCard.textContent.includes('アドバイス:')
                };
            }
            
            // SafeMode OSカードの内容
            const safeModeCard = document.querySelectorAll('.os-card')[2];
            if (safeModeCard) {
                results.safeModeOS = {
                    text: safeModeCard.textContent,
                    hasHexagramName: safeModeCard.textContent.includes('坤為地'),
                    hasType: safeModeCard.textContent.includes('タイプ:'),
                    hasAdvice: safeModeCard.textContent.includes('アドバイス:')
                };
            }
            
            return results;
        });
        
        console.log('OSカードデータ:');
        Object.entries(osCardData).forEach(([key, data]) => {
            console.log(`\n${key}:`);
            console.log(`- 卦名あり: ${data.hasHexagramName}`);
            console.log(`- タイプあり: ${data.hasType}`);
            console.log(`- アドバイスあり: ${data.hasAdvice}`);
            console.log(`- テキスト長: ${data.text.length}文字`);
        });
        
        console.log('\n🔍 V3データが表示されているかチェック');
        
        // ページ全体のテキストからV3データの特徴を確認
        const pageText = await page.textContent('body');
        
        const v3Features = [
            '創造的リーダーシップ',
            'ムードメーカー型',
            '受容統合型',
            '革新追求エンジン',
            '場を明るくする',
            'すべてを受け止め'
        ];
        
        const foundFeatures = v3Features.filter(feature => pageText.includes(feature));
        console.log(`V3特徴キーワード: ${foundFeatures.length}/${v3Features.length}件発見`);
        foundFeatures.forEach(feature => console.log(`  ✅ ${feature}`));
        
        const missingFeatures = v3Features.filter(feature => !pageText.includes(feature));
        missingFeatures.forEach(feature => console.log(`  ❌ ${feature}`));
        
        return {
            v3DataAvailable: !!v3Data,
            totalHexagrams: v3Data ? v3Data.totalHexagrams : 0,
            osCardsData: osCardData,
            foundFeatures: foundFeatures.length,
            totalFeatures: v3Features.length
        };
        
    } catch (error) {
        console.error('❌ テスト実行エラー:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

testV3DataContent().then(result => {
    console.log('\n🏆 V3データ内容テスト完了');
    console.log('結果:', JSON.stringify(result, null, 2));
}).catch(error => {
    console.error('❌ テスト失敗:', error.message);
    process.exit(1);
});
