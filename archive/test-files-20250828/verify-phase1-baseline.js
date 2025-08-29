// Phase 1 ベースライン検証スクリプト
// 現状の5爻選択率、カバー率、偏りを測定

import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const TextTo384LinesBridge = require('./public/js/ai/TextTo384LinesBridge.js');

async function verifyBaseline() {
    console.log('=== Phase 1 ベースライン検証 ===');
    console.log('日時:', new Date().toISOString());
    console.log('');
    
    // テストデータ読み込み
    const testData = JSON.parse(fs.readFileSync('test-samples-200-categorized.json', 'utf8'));
    const bridge = new TextTo384LinesBridge();
    await bridge.initialize();
    
    // 結果収集
    const results = {
        totalSamples: 0,
        positionCounts: [0, 0, 0, 0, 0, 0, 0], // index 0は未使用、1-6が爻位置
        uniqueLines: new Set(),
        categoryResults: {},
        timestamp: new Date().toISOString()
    };
    
    // カテゴリ別テスト
    for (const [category, samples] of Object.entries(testData.samples)) {
        console.log(`\nテスト中: ${category} (${samples.length}サンプル)`);
        
        const categoryStats = {
            total: samples.length,
            positionDistribution: [0, 0, 0, 0, 0, 0, 0],
            lines: []
        };
        
        for (const text of samples) {
            try {
                const result = await bridge.analyzeText(text);
                const lineKey = `${result.hexagram_number}-${result.line_position}`;
                
                results.uniqueLines.add(lineKey);
                results.positionCounts[result.line_position]++;
                categoryStats.positionDistribution[result.line_position]++;
                categoryStats.lines.push({
                    text: text,
                    hexagram: result.hexagram_number,
                    position: result.line_position,
                    line: lineKey
                });
                
                results.totalSamples++;
            } catch (error) {
                console.error(`エラー: ${text}`, error.message);
            }
        }
        
        results.categoryResults[category] = categoryStats;
    }
    
    // 統計計算
    const stats = calculateStatistics(results);
    
    // レポート生成
    generateReport(results, stats);
    
    // JSONファイル保存
    const reportData = {
        metadata: {
            timestamp: results.timestamp,
            totalSamples: results.totalSamples,
            uniqueLines: results.uniqueLines.size
        },
        statistics: stats,
        categoryResults: results.categoryResults,
        positionDistribution: results.positionCounts.slice(1) // index 0を除外
    };
    
    fs.writeFileSync(
        'phase1-baseline-report.json',
        JSON.stringify(reportData, null, 2)
    );
    
    console.log('\n✅ レポートを phase1-baseline-report.json に保存しました');
}

function calculateStatistics(results) {
    const total = results.totalSamples;
    const positions = results.positionCounts.slice(1); // index 0を除外
    
    // 位置別パーセンテージ
    const positionPercentages = positions.map(count => 
        ((count / total) * 100).toFixed(2)
    );
    
    // カバー率
    const coverageRate = ((results.uniqueLines.size / 384) * 100).toFixed(2);
    
    // 5爻選択率
    const yao5Rate = ((results.positionCounts[5] / total) * 100).toFixed(2);
    
    // 偏り計算（標準偏差）
    const expectedCount = total / 6;
    const variance = positions.reduce((sum, count) => 
        sum + Math.pow(count - expectedCount, 2), 0) / 6;
    const stdDev = Math.sqrt(variance);
    const biasScore = (stdDev / expectedCount * 100).toFixed(2);
    
    // χ²検定
    const chiSquare = positions.reduce((sum, count) => 
        sum + Math.pow(count - expectedCount, 2) / expectedCount, 0);
    
    return {
        coverageRate: parseFloat(coverageRate),
        uniqueLines: results.uniqueLines.size,
        yao5Rate: parseFloat(yao5Rate),
        positionPercentages: positionPercentages.map(p => parseFloat(p)),
        biasScore: parseFloat(biasScore),
        chiSquare: chiSquare.toFixed(2),
        maxPosition: positions.indexOf(Math.max(...positions)) + 1,
        minPosition: positions.indexOf(Math.min(...positions)) + 1
    };
}

function generateReport(results, stats) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Phase 1 ベースライン検証結果');
    console.log('='.repeat(60));
    
    console.log('\n【主要指標】');
    console.log(`カバー率: ${stats.coverageRate}% (${stats.uniqueLines}/384爻)`);
    console.log(`5爻選択率: ${stats.yao5Rate}%`);
    console.log(`偏りスコア: ${stats.biasScore}% (標準偏差ベース)`);
    console.log(`χ²値: ${stats.chiSquare}`);
    
    console.log('\n【位置別分布】');
    const positions = results.positionCounts.slice(1);
    positions.forEach((count, i) => {
        const percentage = stats.positionPercentages[i];
        const bar = '█'.repeat(Math.floor(percentage / 2));
        console.log(`${i + 1}爻: ${count}個 (${percentage}%) ${bar}`);
    });
    
    console.log('\n【カテゴリ別5爻選択率】');
    for (const [category, data] of Object.entries(results.categoryResults)) {
        const yao5Count = data.positionDistribution[5];
        const rate = ((yao5Count / data.total) * 100).toFixed(1);
        console.log(`${category}: ${yao5Count}/${data.total} (${rate}%)`);
    }
    
    console.log('\n【目標との差分】');
    console.log(`カバー率: 現在 ${stats.coverageRate}% → 目標 10-15%`);
    console.log(`5爻選択率: 現在 ${stats.yao5Rate}% → 目標 5-10%`);
    console.log(`ユニーク爻: 現在 ${stats.uniqueLines}個 → 目標 40-60個`);
    
    const targetAchieved = 
        stats.coverageRate >= 10 && 
        stats.yao5Rate >= 5 && 
        stats.uniqueLines >= 40;
    
    if (targetAchieved) {
        console.log('\n🎉 Phase 1の目標を達成しています！');
    } else {
        console.log('\n⚠️ 改善が必要です。Day 2以降のタスクを実行してください。');
    }
}

// 実行
verifyBaseline().catch(console.error);