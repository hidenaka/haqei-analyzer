#!/usr/bin/env node
/**
 * HAQEI フィードバックシステム CLI
 * 
 * コマンドライン経由でフィードバックワークフローを実行するインターフェース
 */

const HAQEIFeedbackCoordinator = require('./haqei-feedback-coordinator');
const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// CLI設定
program
    .name('haqei-feedback')
    .description('HAQEI 3人格フィードバックシステム')
    .version('1.0.0');

// 評価コマンド
program
    .command('evaluate')
    .description('実装内容の評価を実行')
    .option('-f, --feature <name>', '機能名')
    .option('-d, --description <desc>', '説明')
    .option('--files <files>', 'ファイルパス（カンマ区切り）')
    .option('--detail <level>', '詳細レベル (basic|comprehensive)', 'comprehensive')
    .option('--format <format>', 'レポート形式 (json|markdown)', 'markdown')
    .option('--no-save', 'ファイル保存をスキップ')
    .action(async (options) => {
        try {
            console.log('🔍 HAQEI実装評価を開始します...\n');
            
            const implementationData = {
                feature: options.feature || 'HAQEI実装',
                description: options.description || '実装内容の評価',
                files: options.files ? options.files.split(',').map(f => f.trim()) : [],
                timestamp: new Date().toISOString()
            };
            
            const coordinator = new HAQEIFeedbackCoordinator();
            
            const result = await coordinator.executeFullFeedbackWorkflow(implementationData, {
                detailLevel: options.detail,
                reportFormat: options.format,
                saveToFile: options.save
            });
            
            console.log('\n📊 評価結果:');
            console.log(`総合スコア: ${result.summary.overallScore}点`);
            console.log(`CTO評価: ${result.summary.ctoRating}`);
            console.log(`合意レベル: ${result.summary.consensusLevel}`);
            
            if (result.results.reports.markdownPath) {
                console.log(`\n📄 レポート: ${result.results.reports.markdownPath}`);
            }
            
        } catch (error) {
            console.error(`❌ エラー: ${error.message}`);
            process.exit(1);
        }
    });

// デモコマンド
program
    .command('demo')
    .description('デモンストレーションを実行')
    .action(async () => {
        try {
            console.log('🎬 HAQEIフィードバックシステムのデモを開始します...\n');
            
            const coordinator = new HAQEIFeedbackCoordinator();
            const result = await coordinator.demonstrateWorkflow();
            
            console.log('\n🎉 デモ完了！');
            console.log(`ワークフローID: ${result.workflowId}`);
            
        } catch (error) {
            console.error(`❌ デモエラー: ${error.message}`);
            process.exit(1);
        }
    });

// ステータスコマンド
program
    .command('status')
    .description('システム状態を表示')
    .action(async () => {
        try {
            const coordinator = new HAQEIFeedbackCoordinator();
            const status = coordinator.getSystemStatus();
            
            console.log('🖥️  HAQEIフィードバックシステム状態:');
            console.log(`   実行状態: ${status.isRunning ? '実行中' : '待機中'}`);
            console.log(`   総実行回数: ${status.totalWorkflows}回`);
            console.log(`   平均スコア: ${Math.round(status.averageScore)}点`);
            console.log(`   最終実行: ${status.lastExecution || '未実行'}`);
            
        } catch (error) {
            console.error(`❌ ステータス取得エラー: ${error.message}`);
            process.exit(1);
        }
    });

// インタラクティブモード
program
    .command('interactive')
    .alias('i')
    .description('インタラクティブモードで評価を実行')
    .action(async () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        try {
            console.log('🎯 HAQEIフィードバックシステム - インタラクティブモード\n');
            
            const feature = await question(rl, '機能名を入力してください: ');
            const description = await question(rl, '説明を入力してください: ');
            const filesInput = await question(rl, 'ファイルパス（カンマ区切り、省略可）: ');
            const detailLevel = await question(rl, '詳細レベル (basic/comprehensive) [comprehensive]: ') || 'comprehensive';
            
            const files = filesInput ? filesInput.split(',').map(f => f.trim()) : [];
            
            console.log('\n🔍 評価を開始します...');
            
            const implementationData = {
                feature: feature || 'HAQEI実装',
                description: description || '実装内容の評価',
                files,
                timestamp: new Date().toISOString()
            };
            
            const coordinator = new HAQEIFeedbackCoordinator();
            const result = await coordinator.executeFullFeedbackWorkflow(implementationData, {
                detailLevel,
                reportFormat: 'markdown',
                saveToFile: true
            });
            
            console.log('\n📊 評価完了:');
            console.log(`   総合スコア: ${result.summary.overallScore}点`);
            console.log(`   Engine OS: ${result.results.feedbackResults.integrated.overallScore.engineScore}点`);
            console.log(`   Interface OS: ${result.results.feedbackResults.integrated.overallScore.interfaceScore}点`);
            console.log(`   Safe Mode OS: ${result.results.feedbackResults.integrated.overallScore.safemodeScore}点`);
            
            if (result.results.reports.markdownPath) {
                console.log(`\n📄 詳細レポート: ${result.results.reports.markdownPath}`);
            }
            
            const viewReport = await question(rl, '\nレポートの概要を表示しますか？ (y/n) [n]: ');
            if (viewReport.toLowerCase() === 'y') {
                console.log('\n📋 ユーザー向けサマリー:');
                const userReport = result.results.userReport;
                console.log(`   総合評価: ${userReport.executiveSummary.overallRating}`);
                console.log(`   推奨事項: ${userReport.executiveSummary.recommendation}`);
                
                console.log('\n   主要成果:');
                userReport.executiveSummary.keyAchievements.forEach(achievement => {
                    console.log(`     ✅ ${achievement}`);
                });
                
                console.log('\n   次のアクション:');
                userReport.nextActions.immediate.slice(0, 3).forEach(action => {
                    console.log(`     🎯 ${action}`);
                });
            }
            
        } catch (error) {
            console.error(`❌ インタラクティブモードエラー: ${error.message}`);
        } finally {
            rl.close();
        }
    });

// テストコマンド
program
    .command('test')
    .description('システムテストを実行')
    .option('--performance', 'パフォーマンステストも実行')
    .action(async (options) => {
        try {
            console.log('🧪 HAQEIフィードバックシステムテストを開始します...\n');
            
            const testModule = require('./test-feedback-workflow');
            
            // 基本テスト
            await testModule.runWorkflowTest();
            
            // パフォーマンステスト（オプション）
            if (options.performance) {
                await testModule.runPerformanceTest();
            }
            
            console.log('\n✅ すべてのテストが正常に完了しました！');
            
        } catch (error) {
            console.error(`❌ テストエラー: ${error.message}`);
            process.exit(1);
        }
    });

// ヘルプの表示カスタマイズ
program.on('--help', () => {
    console.log('');
    console.log('使用例:');
    console.log('  $ haqei-feedback demo                    # デモ実行');
    console.log('  $ haqei-feedback interactive             # インタラクティブモード');
    console.log('  $ haqei-feedback evaluate -f "新機能"   # 機能評価');
    console.log('  $ haqei-feedback status                  # システム状態');
    console.log('  $ haqei-feedback test                    # システムテスト');
    console.log('');
    console.log('HAQEIフィードバックシステムについて:');
    console.log('  このシステムは、HAQEI独自の3つの人格システム理論に基づき、');
    console.log('  実装内容を多角的に評価し、具体的な改善提案を生成します。');
    console.log('');
    console.log('  🧠 Engine OS - 価値観・本質重視の評価');
    console.log('  🤝 Interface OS - 実用性・使いやすさ重視の評価');
    console.log('  🛡️ Safe Mode OS - 安全性・信頼性重視の評価');
    console.log('');
});

// 質問ヘルパー関数
function question(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

// メイン実行
if (require.main === module) {
    // コマンドライン引数がない場合はヘルプを表示
    if (process.argv.length <= 2) {
        program.help();
    } else {
        program.parse();
    }
}

module.exports = program;