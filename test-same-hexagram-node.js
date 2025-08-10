// Node.js script for same hexagram engine-safe verification
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulate browser environment for the scripts
global.document = {};
global.window = {};

// Read and evaluate the H384H64database
const dbPath = path.join(__dirname, 'public/assets/H384H64database.js');
eval(fs.readFileSync(dbPath, 'utf8'));

// Read and evaluate the TripleOSInteractionAnalyzer (modified to work in Node)
const analyzerPath = path.join(__dirname, 'public/js/core/TripleOSInteractionAnalyzer.js');
let analyzerCode = fs.readFileSync(analyzerPath, 'utf8');

// Remove class declaration and make it a simple function
analyzerCode = analyzerCode.replace('class TripleOSInteractionAnalyzer {', 'function TripleOSInteractionAnalyzer() { this.init = function() {};');

eval(analyzerCode);

function verifyAllSameHexagrams() {
    const analyzer = new TripleOSInteractionAnalyzer();
    const results = [];
    const anomalies = [];
    
    console.log('開始: 64卦すべてのengine-safe同一卦検証');
    
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
                const harmonicKeywords = ['調和', '協調', '安定', '平和', '受容性', '包容力', '柔軟性', '慈悲', '母性'];
                const isHarmonic = result.keywords.some(k => harmonicKeywords.includes(k));
                
                if (isHarmonic && (result.category === 'TENSION' || result.category === 'CONFLICT')) {
                    anomalies.push({
                        ...result,
                        reason: `調和系キーワード [${result.keywords.filter(k => harmonicKeywords.includes(k)).join(', ')}] なのに ${result.category}`
                    });
                }
                
                // 反対に、競争系卦がHARMONYになっているケースもチェック
                const competitiveKeywords = ['競争', '争い', '闘争', '対立', '衝突'];
                const isCompetitive = result.keywords.some(k => competitiveKeywords.includes(k));
                
                if (isCompetitive && result.category === 'HARMONY') {
                    anomalies.push({
                        ...result,
                        reason: `競争系キーワード [${result.keywords.filter(k => competitiveKeywords.includes(k)).join(', ')}] なのに ${result.category}`
                    });
                }
                
                console.log(`${i}. ${result.name}: ${result.category} (${result.synergy?.toFixed(3)}) - ${result.keywords.slice(0,3).join(', ')}`);
            }
        } catch (error) {
            console.error(`第${i}卦の分析でエラー:`, error.message);
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
    console.log('検証対象: 64卦すべてのengine-safe同一卦ペア');
    console.log('異常ケース:', anomalies.length, '件');
    
    console.log('\nカテゴリ分布:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
        console.log(`${cat}: ${count}件 (${(count/64*100).toFixed(1)}%)`);
    });
    
    if (anomalies.length > 0) {
        console.log('\n🚨 発見された異常ケース:');
        anomalies.forEach(anomaly => {
            console.log(`${anomaly.id}. ${anomaly.name}: ${anomaly.reason}`);
        });
    } else {
        console.log('\n✅ 異常ケースはありませんでした');
    }
    
    return { results, anomalies, categoryCount };
}

// 実行
try {
    verifyAllSameHexagrams();
} catch (error) {
    console.error('検証実行エラー:', error);
}