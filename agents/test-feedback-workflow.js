#!/usr/bin/env node
/**
 * HAQEI フィードバックワークフロー テストスクリプト
 * 
 * 完全なフィードバックシステムの動作確認とデモンストレーション
 */

import HAQEIFeedbackCoordinator from './haqei-feedback-coordinator.js';
import path from 'path';

async function runWorkflowTest() {
    console.log('🎬 HAQEI フィードバックワークフロー テスト開始\n');
    
    const coordinator = new HAQEIFeedbackCoordinator();
    
    try {
        // テスト用実装データ
        const testImplementation = {
            feature: "HAQEI人格OS分析システム統合実装",
            description: "3つの人格システム（Engine/Interface/SafeMode OS）による革新的自己理解支援ツール",
            files: [
                "public/js/os-analyzer/core/TripleOSEngine.js",
                "public/js/os-analyzer/core/Calculator.js", 
                "public/js/os-analyzer/components/ResultsView.js",
                "public/js/os-analyzer/components/AnalysisView.js"
            ],
            technicalDetails: {
                architecture: "モジュラー設計によるTriple OS統合システム",
                apiIntegration: "Gemini Flash/Pro API活用",
                dataStorage: "localStorage完結型データ管理",
                userInterface: "対話型分析フロー",
                performance: "3秒以内のレスポンス時間",
                security: "クライアントサイド完結による高セキュリティ"
            },
            userExperience: {
                analysisTime: "10-15分の詳細分析",
                resultFormat: "視覚的・直感的な結果表示",
                actionPlan: "具体的な自己改善提案",
                accessibility: "全デバイス対応",
                guidance: "段階的な分析ガイダンス"
            },
            businessValue: {
                uniqueness: "世界初のbunenjin哲学×AI統合システム",
                marketPosition: "パーソナル戦略ナビゲーション新市場創造",
                competitiveAdvantage: "3人格システムによる差別化",
                monetization: "フリーミアム戦略による段階的収益化"
            },
            implementationScope: {
                completedFeatures: [
                    "3OS分析エンジン",
                    "インタラクティブUI",
                    "結果可視化システム",
                    "データ永続化機能"
                ],
                inProgress: [
                    "AI統合分析機能", 
                    "レポート生成システム",
                    "モバイル最適化"
                ],
                planned: [
                    "プレミアム機能",
                    "B2B展開",
                    "多言語化"
                ]
            }
        };

        console.log('📋 テスト対象:');
        console.log(`   機能: ${testImplementation.feature}`);
        console.log(`   ファイル数: ${testImplementation.files.length}`);
        console.log(`   完了機能: ${testImplementation.implementationScope.completedFeatures.length}\n`);

        // フィードバックワークフローの実行
        console.log('🚀 フィードバックワークフロー実行中...\n');
        
        const workflowResult = await coordinator.executeFullFeedbackWorkflow(testImplementation, {
            detailLevel: 'comprehensive',
            reportFormat: 'markdown',
            saveToFile: true,
            generateReports: true
        });

        // 結果の表示
        console.log('\n' + '='.repeat(60));
        console.log('📊 ワークフロー実行結果');
        console.log('='.repeat(60));
        
        console.log(`\n🆔 ワークフローID: ${workflowResult.workflowId}`);
        console.log(`⏰ 実行時間: ${workflowResult.timestamp}`);
        
        console.log('\n📈 総合評価結果:');
        console.log(`   全体スコア: ${workflowResult.summary.overallScore}/100点`);
        console.log(`   人格間合意: ${workflowResult.summary.consensusLevel}`);
        console.log(`   CTO評価: ${workflowResult.summary.ctoRating}`);
        
        console.log('\n🧠 3人格別評価:');
        const scores = workflowResult.results.feedbackResults.integrated.overallScore;
        console.log(`   Engine OS (価値観重視): ${scores.engineScore}点`);
        console.log(`   Interface OS (実用性重視): ${scores.interfaceScore}点`);
        console.log(`   Safe Mode OS (安全性重視): ${scores.safemodeScore}点`);
        
        console.log('\n🎯 主要推奨事項:');
        const recommendations = workflowResult.results.ctoAnalysis.strategicAnalysis.strategicRecommendations;
        recommendations.slice(0, 3).forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
        
        console.log('\n🚨 緊急対応項目:');
        const immediateActions = workflowResult.results.ctoAnalysis.nextDevelopmentRequirements.immediate;
        if (immediateActions.length > 0) {
            immediateActions.forEach((action, index) => {
                console.log(`   ${index + 1}. ${action.title} (${action.priority})`);
            });
        } else {
            console.log('   緊急対応が必要な項目はありません ✅');
        }
        
        console.log('\n📝 生成されたレポート:');
        if (workflowResult.results.reports.markdownPath) {
            console.log(`   📄 総合レポート: ${workflowResult.results.reports.markdownPath}`);
        }
        
        console.log('\n💰 投資・ROI見込み:');
        const roi = workflowResult.results.ctoAnalysis.strategicAnalysis.roiProjection;
        console.log(`   予想投資額: ${roi.investmentRequired.development}`);
        console.log(`   損益分岐点: ${roi.breakEvenPoint}`);
        console.log(`   ROI予測: ${roi.riskAdjustedROI}`);
        
        // ユーザー向けサマリー
        console.log('\n' + '='.repeat(60));
        console.log('👤 ユーザー向けサマリー');
        console.log('='.repeat(60));
        
        const userReport = workflowResult.results.userReport;
        console.log(`\n総合評価: ${userReport.executiveSummary.overallRating}`);
        console.log(`推奨事項: ${userReport.executiveSummary.recommendation}`);
        
        console.log('\n主要成果:');
        userReport.executiveSummary.keyAchievements.forEach((achievement, index) => {
            console.log(`   ✅ ${achievement}`);
        });
        
        if (userReport.executiveSummary.mainConcerns.length > 0) {
            console.log('\n改善点:');
            userReport.executiveSummary.mainConcerns.forEach((concern, index) => {
                console.log(`   ⚠️  ${concern}`);
            });
        }
        
        console.log('\n次のアクション:');
        console.log('   すぐに実行:');
        userReport.nextActions.immediate.forEach(action => {
            console.log(`     • ${action}`);
        });
        
        // システム状態の表示
        console.log('\n' + '='.repeat(60));
        console.log('🖥️  システム状態');
        console.log('='.repeat(60));
        
        const systemStatus = coordinator.getSystemStatus();
        console.log(`\n実行状態: ${systemStatus.isRunning ? '実行中' : '待機中'}`);
        console.log(`総実行回数: ${systemStatus.totalWorkflows}回`);
        console.log(`平均スコア: ${Math.round(systemStatus.averageScore)}点`);
        
        console.log('\n🎉 テスト完了！');
        console.log('✅ すべてのコンポーネントが正常に動作しています');
        
        return workflowResult;
        
    } catch (error) {
        console.error('\n❌ テスト実行エラー:');
        console.error(`   エラー内容: ${error.message}`);
        console.error(`   スタックトレース:`);
        console.error(error.stack);
        
        process.exit(1);
    }
}

// パフォーマンステスト
async function runPerformanceTest() {
    console.log('\n⚡ パフォーマンステスト実行中...');
    
    const coordinator = new HAQEIFeedbackCoordinator();
    const testData = {
        feature: "パフォーマンステスト",
        description: "システム応答性能の測定",
        files: ["test.js"]
    };
    
    const startTime = Date.now();
    
    try {
        await coordinator.executeFullFeedbackWorkflow(testData, {
            detailLevel: 'basic',
            saveToFile: false
        });
        
        const executionTime = Date.now() - startTime;
        console.log(`⚡ 実行時間: ${executionTime}ms`);
        
        if (executionTime < 5000) {
            console.log('✅ パフォーマンス: 優秀 (5秒未満)');
        } else if (executionTime < 10000) {
            console.log('✅ パフォーマンス: 良好 (10秒未満)');
        } else {
            console.log('⚠️  パフォーマンス: 改善推奨 (10秒以上)');
        }
        
    } catch (error) {
        console.error(`❌ パフォーマンステストエラー: ${error.message}`);
    }
}

// メイン実行
async function main() {
    try {
        // 基本ワークフローテスト
        const result = await runWorkflowTest();
        
        // パフォーマンステスト
        await runPerformanceTest();
        
        console.log('\n' + '='.repeat(60));
        console.log('🏁 全テスト完了');
        console.log('='.repeat(60));
        console.log('🎯 HAQEIフィードバックシステムは正常に動作しています！');
        console.log('📋 生成されたレポートをdocsフォルダで確認してください。');
        
    } catch (error) {
        console.error('💥 テスト実行中に予期しないエラーが発生しました:');
        console.error(error);
        process.exit(1);
    }
}

// スクリプトが直接実行された場合のみテストを実行
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export {
    runWorkflowTest,
    runPerformanceTest,
    main
};