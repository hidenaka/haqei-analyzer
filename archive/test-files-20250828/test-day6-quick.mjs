import { TextTo384LinesBridge } from './public/js/ai/TextTo384LinesBridge.js';

async function quickTest() {
    console.log('🚀 Day 6 微調整効果の測定\n');
    
    const bridge = new TextTo384LinesBridge();
    await bridge.initialize();
    
    // テストサンプル
    const samples = [
        '新しい始まり',
        '協力関係',
        '困難克服',
        '変化対応', 
        'リーダーシップ',
        '完成段階',
        '決断の時',
        '戦略立案'
    ];
    
    const results = {
        positionCount: [0, 0, 0, 0, 0, 0, 0],
        uniqueLines: new Set(),
        times: []
    };
    
    console.log('📊 サンプル分析中...\n');
    
    for (const sample of samples) {
        const start = performance.now();
        const result = await bridge.analyzeText(sample);
        const time = performance.now() - start;
        
        results.times.push(time);
        results.positionCount[result.line_position]++;
        results.uniqueLines.add(`${result.hexagram_number}-${result.line_position}`);
        
        console.log(`"${sample}" → ${result.hexagram_number}卦${result.line_position}爻 (${time.toFixed(2)}ms)`);
    }
    
    console.log('\n📈 結果サマリー:');
    console.log('================');
    
    // 位置分布
    console.log('\n位置分布:');
    for (let i = 1; i <= 6; i++) {
        const count = results.positionCount[i];
        const rate = ((count / samples.length) * 100).toFixed(1);
        const bar = '█'.repeat(Math.round(count * 5));
        console.log(`${i}爻: ${count}回 (${rate}%) ${bar}`);
    }
    
    // パフォーマンス
    const avgTime = results.times.reduce((a, b) => a + b, 0) / results.times.length;
    console.log(`\n⚡ 平均処理時間: ${avgTime.toFixed(2)}ms`);
    console.log(`   最小: ${Math.min(...results.times).toFixed(2)}ms`);
    console.log(`   最大: ${Math.max(...results.times).toFixed(2)}ms`);
    
    // カバー率
    console.log(`\n📊 ユニーク爻数: ${results.uniqueLines.size}個`);
    console.log(`   カバー率: ${((results.uniqueLines.size / 384) * 100).toFixed(2)}%`);
    
    // Day 6-2調整の評価
    console.log('\n✅ Day 6-2 調整効果:');
    const pos5Rate = (results.positionCount[5] / samples.length) * 100;
    if (pos5Rate <= 15) {
        console.log(`   5爻選択率: ${pos5Rate.toFixed(1)}% (✅ 適正範囲)`);
    } else {
        console.log(`   5爻選択率: ${pos5Rate.toFixed(1)}% (⚠️ まだ高め)`);
    }
}

quickTest().catch(console.error);