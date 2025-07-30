#!/usr/bin/env node
/**
 * HAQEI フィードバックシステム 簡単テスト
 */

import FeedbackAgentPersonas from './feedback-personas.js';

async function runSimpleTest() {
    console.log('🎬 HAQEI フィードバックシステム 簡単テスト開始\n');
    
    try {
        const personas = new FeedbackAgentPersonas();
        
        // テスト用実装データ
        const testImplementation = {
            feature: "HAQEI人格OS分析システム",
            description: "Engine/Interface/SafeMode OSによる3次元人格分析",
            technicalDetails: {
                files: ["TripleOSEngine.js", "Calculator.js", "ResultsView.js"],
                apiUsage: "Gemini Flash API",
                userInterface: "対話型分析フロー"
            },
            userExperience: {
                analysisTime: "10分",
                resultDetail: "詳細レポート",
                actionPlan: "具体的改善提案"
            }
        };

        console.log('📋 テスト対象:');
        console.log(`   機能: ${testImplementation.feature}`);
        console.log(`   説明: ${testImplementation.description}\n`);

        // 3人格による評価
        console.log('🧠 3人格評価を実行中...');
        const evaluation = personas.evaluateFromAllPersonas(testImplementation);

        console.log('\n📊 評価結果:');
        console.log(`   総合スコア: ${evaluation.overallScore.average}/100点`);
        console.log(`   深津 静 (本質的探求者): ${evaluation.overallScore.fukatsuScore}点`);
        console.log(`   早乙女 健 (実利的自己投資家): ${evaluation.overallScore.saotomeScore}点`);
        console.log(`   橘 玲奈 (批評的知性派): ${evaluation.overallScore.tachibanaScore}点`);
        console.log(`   人格間合意レベル: ${evaluation.consensusLevel.level}`);

        console.log('\n🎯 主要推奨事項:');
        const allRecommendations = evaluation.summary.recommendations;
        allRecommendations.slice(0, 3).forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.suggestion}`);
        });

        console.log('\n✅ 簡単テスト完了！');
        console.log('🎉 深津 静・早乙女 健・橘 玲奈による3人格フィードバックシステムが正常に動作しています！');
        console.log('\n👥 フィードバックエージェント紹介:');
        console.log('   🌸 深津 静 - 本質的探求者（詩的で深い洞察）');
        console.log('   ⚡ 早乙女 健 - 実利的自己投資家（具体的で実用的）');
        console.log('   🔍 橘 玲奈 - 批評的知性派（論理的で知的）');
        
        return evaluation;
        
    } catch (error) {
        console.error('\n❌ テストエラー:');
        console.error(`   エラー内容: ${error.message}`);
        console.error(`   スタックトレース:`);
        console.error(error.stack);
        
        process.exit(1);
    }
}

// スクリプトが直接実行された場合のみテストを実行
if (import.meta.url === `file://${process.argv[1]}`) {
    runSimpleTest().catch(console.error);
}

export { runSimpleTest };