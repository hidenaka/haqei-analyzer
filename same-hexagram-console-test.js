// Browser console test for same hexagram engine-safe verification
// Copy and paste this into browser console on any HAQEI page

function verifyAllSameHexagramsConsole() {
    console.log('🔍 64卦すべてのengine-safe同一卦検証を開始...');
    
    if (!window.TripleOSInteractionAnalyzer || !window.H384H64database) {
        console.error('❌ 必要なクラスが見つかりません。HAQEIページ上で実行してください。');
        return;
    }
    
    const analyzer = new TripleOSInteractionAnalyzer();
    const results = [];
    const anomalies = [];
    
    for (let i = 1; i <= 64; i++) {
        const engineOS = { hexagramId: i, name: `第${i}卦`, score: 0.5 };
        const safeModeOS = { hexagramId: i, name: `第${i}卦`, score: 0.5 };
        const interfaceOS = { hexagramId: 30, name: '第30卦', score: 0.5 }; // 固定値
        
        try {
            const analysis = analyzer.analyze(engineOS, interfaceOS, safeModeOS);
            const engineSafePair = analysis.interactions.pair_insights.find(pair => 
                pair.pair === 'Engine-Safe'
            );
            
            if (engineSafePair) {
                const hexagram = H384H64database.find(h => h.id === i);
                const result = {
                    id: i,
                    name: hexagram?.name || `第${i}卦`,
                    keywords: hexagram?.keywords || [],
                    category: engineSafePair.category,
                    summary: engineSafePair.summary,
                    synergy: engineSafePair.synergy
                };
                
                results.push(result);
                
                // 異常判定: 調和系卦がTENSIONやCONFLICTになっているケース
                const harmonicKeywords = ['調和', '協調', '安定', '平和', '受容性', '包容力', '柔軟性', '慈悲', '母性', '包容', '温和'];
                const isHarmonic = result.keywords.some(k => harmonicKeywords.includes(k));
                
                if (isHarmonic && (result.category === 'TENSION' || result.category === 'CONFLICT')) {
                    anomalies.push({
                        ...result,
                        reason: `調和系キーワード [${result.keywords.filter(k => harmonicKeywords.includes(k)).join(', ')}] なのに ${result.category}`
                    });
                }
                
                // 反対に、競争系卦がHARMONYになっているケースもチェック
                const competitiveKeywords = ['競争', '争い', '闘争', '対立', '衝突', '戦争', '激化'];
                const isCompetitive = result.keywords.some(k => competitiveKeywords.includes(k));
                
                if (isCompetitive && result.category === 'HARMONY') {
                    anomalies.push({
                        ...result,
                        reason: `競争系キーワード [${result.keywords.filter(k => competitiveKeywords.includes(k)).join(', ')}] なのに ${result.category}`
                    });
                }
                
                if (i <= 10 || anomalies.length > 0) {
                    console.log(`${i}. ${result.name}: ${result.category} (${result.synergy?.toFixed(3)}) - ${result.keywords.slice(0,3).join(', ')}`);
                }
            }
        } catch (error) {
            console.error(`❌ 第${i}卦の分析でエラー:`, error.message);
            results.push({
                id: i,
                name: `第${i}卦`,
                category: 'ERROR',
                summary: error.message,
                synergy: null
            });
        }
    }
    
    // 統計サマリー
    const categoryCount = {};
    results.forEach(r => {
        categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
    });
    
    console.log('\n📊 検証結果サマリー:');
    console.log('🎯 検証対象: 64卦すべてのengine-safe同一卦ペア');
    console.log(`🚨 異常ケース: ${anomalies.length}件`);
    
    console.log('\n📈 カテゴリ分布:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
        console.log(`${cat}: ${count}件 (${(count/64*100).toFixed(1)}%)`);
    });
    
    if (anomalies.length > 0) {
        console.log('\n🚨 発見された異常ケース:');
        anomalies.forEach(anomaly => {
            console.log(`${anomaly.id}. ${anomaly.name}: ${anomaly.reason}`);
            console.log(`   表現: "${anomaly.summary}"`);
            console.log(`   キーワード: [${anomaly.keywords.join(', ')}]`);
            console.log('');
        });
    } else {
        console.log('\n✅ 異常ケースはありませんでした');
    }
    
    return { results, anomalies, categoryCount };
}

// 実行
console.log('コンソールで verifyAllSameHexagramsConsole() を実行してください');