/**
 * 100名テストユーザー生成・分析実行スクリプト
 * 
 * 実行方法:
 * node execute-100-user-test.js
 * 
 * 中断から継続:
 * node execute-100-user-test.js --resume
 */

import TestExecutionController from './agents/test-execution-controller.js';

async function main() {
    const args = process.argv.slice(2);
    const isResume = args.includes('--resume');
    
    console.log('🎯 100名テストユーザー生成・分析システム');
    console.log('='.repeat(60));
    console.log(`実行時刻: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);
    console.log(`実行モード: ${isResume ? '継続実行' : '新規実行'}`);
    console.log('='.repeat(60));

    const controller = new TestExecutionController();

    try {
        let results;
        
        if (isResume) {
            console.log('🔄 既存プロジェクトから継続実行します...');
            results = await controller.resumeExecution();
        } else {
            console.log('🚀 新規プロジェクトを開始します...');
            results = await controller.execute100UserTest();
        }

        // 実行サマリー表示
        controller.displayExecutionSummary();

        // 最終結果表示
        console.log('\n🎉 プロジェクト完了！');
        console.log('='.repeat(60));
        console.log('📊 最終結果:');
        console.log(`   総ユーザー数: ${results.summary.totalUsers}名`);
        console.log(`   総合スコア: ${results.summary.overallScore}/5.0`);
        console.log(`   品質判定: ${results.summary.qualityGrade}`);
        console.log(`   実用化判定: ${results.summary.deploymentDecision}`);
        console.log(`   信頼区間: ${results.summary.confidenceInterval.lowerBound} - ${results.summary.confidenceInterval.upperBound}`);
        
        if (results.qualityValidation.criticalIssues.length > 0) {
            console.log(`\n⚠️ 致命的問題: ${results.qualityValidation.criticalIssues.length}件`);
            results.qualityValidation.criticalIssues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue}`);
            });
        }

        if (results.qualityValidation.recommendations.length > 0) {
            console.log('\n💡 推奨事項:');
            results.qualityValidation.recommendations.slice(0, 3).forEach((rec, index) => {
                console.log(`   ${index + 1}. [${rec.priority}] ${rec.action}`);
            });
        }

        console.log('='.repeat(60));
        console.log(`⏰ 実行時間: ${results.executionTime}`);
        console.log('✅ 全工程完了');

        // 成功終了
        process.exit(0);

    } catch (error) {
        console.error('\n❌ プロジェクト実行失敗');
        console.error('='.repeat(60));
        console.error(`エラー: ${error.message}`);
        
        if (error.stack) {
            console.error('\nスタックトレース:');
            console.error(error.stack);
        }

        // 進捗サマリー表示（エラー時も状況確認のため）
        try {
            controller.displayExecutionSummary();
        } catch (summaryError) {
            console.error('進捗サマリー表示エラー:', summaryError.message);
        }

        console.error('\n🔄 継続実行するには以下のコマンドを実行してください:');
        console.error('node execute-100-user-test.js --resume');
        console.error('='.repeat(60));

        // エラー終了
        process.exit(1);
    }
}

// エラーハンドリング
process.on('uncaughtException', (error) => {
    console.error('❌ 未処理例外:', error.message);
    console.error('🔄 継続実行: node execute-100-user-test.js --resume');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ 未処理Promise拒否:', reason);
    console.error('🔄 継続実行: node execute-100-user-test.js --resume');
    process.exit(1);
});

// Ctrl+C処理
process.on('SIGINT', () => {
    console.log('\n\n⏸️ 実行が中断されました');
    console.log('🔄 継続実行するには以下のコマンドを実行してください:');
    console.log('node execute-100-user-test.js --resume');
    process.exit(0);
});

// 実行開始
main();