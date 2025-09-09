// 現在の重み配分を可視化するスクリプト

import { TextTo384LinesBridge } from './public/js/ai/TextTo384LinesBridge.js';

async function analyzeWeights() {
    console.log('=== 現在の重み配分分析 ===\n');
    
    const bridge = new TextTo384LinesBridge();
    await bridge.initialize();
    
    // テストテキスト
    const testText = "リーダーシップを発揮する";
    
    // デバッグ用にcalculateLineScoreを呼び出す
    const analysis = await bridge.performComprehensiveAnalysis(testText);
    
    console.log('1. 位置別重み（encodePositionVector）:');
    console.log('  1爻: 0.50');
    console.log('  2爻: 0.48');
    console.log('  3爻: 0.52');
    console.log('  4爻: 0.55');
    console.log('  5爻: 0.50 ← 問題: 標準値に戻されている');
    console.log('  6爻: 0.45\n');
    
    console.log('2. 位置別探索ノイズ（getPositionExplorationNoise）:');
    console.log('  1爻: 0.08');
    console.log('  2爻: 0.05');
    console.log('  3爻: 0.10');
    console.log('  4爻: 0.12');
    console.log('  5爻: 0.06 ← 問題: 低すぎる');
    console.log('  6爻: 0.09\n');
    
    console.log('3. キーワード配分（getEnhancedPositionAdjustment）:');
    console.log('  1爻: 23個のキーワード × 0.08倍');
    console.log('  2爻: 25個のキーワード × 0.07倍');
    console.log('  3爻: 25個のキーワード × 0.09倍');
    console.log('  4爻: 26個のキーワード × 0.10倍');
    console.log('  5爻: 25個のキーワード × 0.08倍 ← 問題: 倍率が低い');
    console.log('  6爻: 26個のキーワード × 0.07倍\n');
    
    console.log('4. 5爻が選ばれない主要因:');
    console.log('  - 位置重みが0.50（標準値）');
    console.log('  - 探索ノイズが0.06（最低クラス）');
    console.log('  - キーワードボーナスが0.08（2番目に低い）');
    console.log('  - 決定論的テキストボーナス1.1倍のみ\n');
    
    console.log('5. 改善提案:');
    console.log('  - 位置重みを0.50→0.65に増加');
    console.log('  - 探索ノイズを0.06→0.12に増加');
    console.log('  - キーワードボーナスを0.08→0.15に増加');
    console.log('  - 5爻専用キーワードを10個追加');
}

analyzeWeights();