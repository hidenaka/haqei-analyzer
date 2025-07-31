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

// フロントエンドデベロッパーエージェント統合（ES Modules対応）
let HAQEIFrontendDeveloper;
async function loadFrontendDeveloper() {
    if (!HAQEIFrontendDeveloper) {
        const module = await import('./haqei-frontend-developer.js');
        HAQEIFrontendDeveloper = module.default;
    }
    return HAQEIFrontendDeveloper;
}

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

// フロントエンドデザイン分析コマンド
program
    .command('frontend')
    .alias('ui')
    .description('フロントエンド・UI/UX分析を実行')
    .option('-f, --feature <name>', '機能名', 'default-feature')
    .option('-t, --type <type>', '分析タイプ (uiux|component|audit|performance)', 'uiux')
    .option('--component <name>', 'コンポーネント名（component/audit用）')
    .option('--device <device>', 'デバイスタイプ (mobile|tablet|desktop)', 'mobile')
    .option('--save', 'レポートを保存', true)
    .action(async (options) => {
        try {
            console.log(`🎨 HAQEIフロントエンド分析を開始します: ${options.type}\n`);
            
            const FrontendDeveloper = await loadFrontendDeveloper();
            const frontendDev = new FrontendDeveloper();
            
            let result;
            
            switch (options.type) {
                case 'uiux':
                    result = frontendDev.analyzeUIUXRequirements(options.feature, {
                        device: options.device,
                        context: 'haqei-analysis'
                    });
                    console.log(`✅ UI/UX分析完了 - Primary OS: ${result.tripleOSMapping.primaryOS}`);
                    break;
                    
                case 'component':
                    const componentName = options.component || 'DefaultComponent';
                    result = frontendDev.designComponent(componentName, {
                        accessibility: 'high',
                        responsive: true
                    });
                    console.log(`✅ コンポーネント設計完了: ${componentName}`);
                    break;
                    
                case 'audit':
                    const auditTarget = options.component || 'DefaultComponent';
                    result = frontendDev.auditAccessibility(auditTarget);
                    console.log(`✅ アクセシビリティ監査完了 - スコア: ${result.score}/100`);
                    break;
                    
                case 'performance':
                    result = frontendDev.optimizePerformance(options.feature);
                    console.log(`✅ パフォーマンス最適化完了`);
                    break;
                    
                default:
                    console.log(`❌ 不明な分析タイプ: ${options.type}`);
                    return;
            }
            
            if (options.save) {
                const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
                const fileName = `${timestamp}_FRONTEND_${options.type}_${options.feature}_分析レポート.json`;
                const filePath = `./docs/reports/${fileName}`;
                
                await fs.writeFile(filePath, JSON.stringify(result, null, 2), 'utf-8');
                console.log(`📄 分析レポート保存: ${filePath}`);
            }
            
        } catch (error) {
            console.error(`❌ フロントエンド分析エラー: ${error.message}`);
            process.exit(1);
        }
    });

// デザインシステム生成コマンド  
program
    .command('designsystem')
    .alias('ds')
    .description('HAQEIデザインシステムを生成')
    .option('--save', 'ドキュメントを保存', true)
    .action(async (options) => {
        try {
            console.log('🎨 HAQEIデザインシステム生成を開始します...\n');
            
            const FrontendDeveloper = await loadFrontendDeveloper();
            const frontendDev = new FrontendDeveloper();
            
            const designSystem = frontendDev.buildDesignSystem();
            const recommendations = frontendDev.generateImplementationRecommendations({
                feature: 'design-system',
                context: 'full-system'
            });
            
            console.log('✅ デザインシステム生成完了');
            console.log(`   トークン: ${Object.keys(designSystem.tokens).join(', ')}`);
            console.log(`   コンポーネント階層: ${Object.keys(designSystem.components).join(' → ')}`);
            
            if (options.save) {
                const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
                
                // デザインシステムドキュメント
                const dsFileName = `${timestamp}_DESIGN_SYSTEM_HAQEIデザインシステム.json`;
                const dsFilePath = `./docs/development/${dsFileName}`;
                await fs.writeFile(dsFilePath, JSON.stringify(designSystem, null, 2), 'utf-8');
                
                // 実装推奨事項
                const recFileName = `${timestamp}_FRONTEND_実装推奨事項.json`;
                const recFilePath = `./docs/implementation/${recFileName}`;
                await fs.writeFile(recFilePath, JSON.stringify(recommendations, null, 2), 'utf-8');
                
                console.log(`📄 デザインシステム保存: ${dsFilePath}`);
                console.log(`📄 実装推奨事項保存: ${recFilePath}`);
            }
            
        } catch (error) {
            console.error(`❌ デザインシステム生成エラー: ${error.message}`);
            process.exit(1);
        }
    });

// テストコマンド
program
    .command('test')
    .description('システムテストを実行')
    .option('--performance', 'パフォーマンステストも実行')
    .option('--frontend', 'フロントエンドテストも実行')
    .action(async (options) => {
        try {
            console.log('🧪 HAQEIシステムテストを開始します...\n');
            
            // フィードバックシステムテスト
            const testModule = require('./test-feedback-workflow');
            await testModule.runWorkflowTest();
            
            // フロントエンドテスト（オプション）
            if (options.frontend) {
                console.log('\n🎨 フロントエンドテストを実行中...');
                const frontendTestModule = await import('./test-frontend-developer.js');
                await frontendTestModule.testFrontendDeveloper();
            }
            
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
    console.log('  $ haqei-feedback frontend -f "分析画面" # UI/UX分析');
    console.log('  $ haqei-feedback designsystem           # デザインシステム生成');
    console.log('  $ haqei-feedback status                  # システム状態');
    console.log('  $ haqei-feedback test --frontend        # 全システムテスト');
    console.log('');
    console.log('HAQEIシステムについて:');
    console.log('  このシステムは、HAQEI独自の3つの人格システム理論に基づき、');
    console.log('  実装内容を多角的に評価し、具体的な改善提案を生成します。');
    console.log('');
    console.log('  🧠 Engine OS - 価値観・本質重視の評価');
    console.log('  🤝 Interface OS - 実用性・使いやすさ重視の評価');
    console.log('  🛡️ Safe Mode OS - 安全性・信頼性重視の評価');
    console.log('');
    console.log('フロントエンド機能:');
    console.log('  🎨 UI/UX設計分析 - Triple OS哲学に基づく設計');
    console.log('  🧩 コンポーネント設計 - アクセシビリティ重視');
    console.log('  ♿ A11y監査 - WCAG AA準拠チェック');
    console.log('  ⚡ パフォーマンス最適化 - Core Web Vitals対応');
    console.log('  📱 レスポンシブ設計 - モバイルファースト');
    console.log('  🎯 デザインシステム - 一貫性のある設計言語');
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