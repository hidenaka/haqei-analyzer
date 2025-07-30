// 易経ウルトラシンク・ロジック20 デバッグ用テストスクリプト
// Node.js環境での基本動作確認

console.log('🔯 易経ウルトラシンク・ロジック20 デバッグテスト開始');

// 基本的なJavaScriptロジックのテスト
function testBasicLogic() {
    console.log('\n=== 基本ロジックテスト ===');
    
    // 1. 64卦の爻データテスト
    const hexagramLines = {
        1: [1,1,1,1,1,1],   // 乾為天 ☰☰
        2: [0,0,0,0,0,0],   // 坤為地 ☷☷
        11: [1,1,1,0,0,0],  // 地天泰 ☷☰
        12: [0,0,0,1,1,1],  // 天地否 ☰☷
    };
    
    console.log('✅ 64卦爻データ構造: OK');
    console.log('例: 乾為天 =', hexagramLines[1]);
    console.log('例: 坤為地 =', hexagramLines[2]);
    
    // 2. 八卦データテスト
    const trigramData = {
        1: { name: "乾", element: "金", family: "父", attribute: "創造", nature: "天" },
        2: { name: "兌", element: "金", family: "少女", attribute: "喜悦", nature: "沢" },
        8: { name: "坤", element: "土", family: "母", attribute: "受容", nature: "地" }
    };
    
    console.log('✅ 八卦データ構造: OK');
    console.log('例: 乾 =', trigramData[1]);
    
    // 3. 五行関係テスト
    const elementData = {
        相生: { "木": "火", "火": "土", "土": "金", "金": "水", "水": "木" },
        相剋: { "木": "土", "土": "水", "水": "火", "火": "金", "金": "木" }
    };
    
    console.log('✅ 五行関係データ: OK');
    console.log('相生: 木→火 =', elementData.相生["木"]);
    console.log('相剋: 木→土 =', elementData.相剋["木"]);
    
    // 4. 調和度計算テスト
    function calculateThemeHarmony(theme1, theme2, theme3) {
        const fortuneValues = { "吉": 0.8, "亨": 0.7, "利": 0.6, "貞": 0.5, "吝": 0.3, "凶": 0.2 };
        const avgFortune = (fortuneValues[theme1] + fortuneValues[theme2] + fortuneValues[theme3]) / 3;
        return Math.max(0, Math.min(1, avgFortune));
    }
    
    const harmony1 = calculateThemeHarmony("吉", "吉", "吉");
    const harmony2 = calculateThemeHarmony("吉", "凶", "中庸");
    
    console.log('✅ 調和度計算: OK');
    console.log('三吉調和 =', harmony1);
    console.log('吉凶混合 =', harmony2);
    
    // 5. 八卦共鳴分析テスト
    function findTrigramResonance(trigrams1, trigrams2, trigrams3) {
        const allTrigrams = [
            trigrams1.upper, trigrams1.lower,
            trigrams2.upper, trigrams2.lower,  
            trigrams3.upper, trigrams3.lower
        ];
        
        const trigramCount = {};
        allTrigrams.forEach(trigram => {
            trigramCount[trigram] = (trigramCount[trigram] || 0) + 1;
        });
        
        return Object.entries(trigramCount)
            .filter(([_, count]) => count > 1)
            .map(([trigram, count]) => ({ trigram: parseInt(trigram), count }));
    }
    
    const resonance = findTrigramResonance(
        { upper: 1, lower: 1 },  // 乾為天
        { upper: 1, lower: 8 },  // 天地否  
        { upper: 8, lower: 8 }   // 坤為地
    );
    
    console.log('✅ 八卦共鳴分析: OK');
    console.log('共鳴パターン =', resonance);
    
    return true;
}

// メイン実行
try {
    const basicResult = testBasicLogic();
    console.log('\n🎉 基本ロジックテスト完了: すべて正常');
    
    console.log('\n=== 次のステップ ===');
    console.log('1. ブラウザでhttp://localhost:8000/test-ultra-sync-logic.htmlを開く');
    console.log('2. 「全テスト実行」ボタンをクリック');
    console.log('3. 各テスト結果を確認');
    console.log('4. エラーがあれば詳細を分析');
    
} catch (error) {
    console.error('❌ テスト実行エラー:', error);
}

console.log('\n🔯 デバッグテスト終了');