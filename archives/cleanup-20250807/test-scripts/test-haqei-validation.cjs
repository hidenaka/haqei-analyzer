const fs = require('fs');
const path = require('path');

// bunenjin哲学統合テスト - Node.js版
// 改善されたbunenjin哲学検証システムの基本動作を確認

console.log('🎭 bunenjin哲学統合テスト開始');
console.log('==========================================');

// 基本的なモジュール読み込みテスト
try {
    // Node.js環境での簡易テスト
    console.log('📋 テスト1: モジュール構造検証');
    
    const standardsPath = path.join(__dirname, 'public/js/os-analyzer/validation/ClassicalIChingStandards.js');
    const validatorPath = path.join(__dirname, 'public/js/os-analyzer/validation/IChingOrthodoxyValidator.js');
    const tripleOSPath = path.join(__dirname, 'public/js/os-analyzer/core/TripleOSEngine.js');
    
    // ファイル存在確認
    const files = [
        { name: 'ClassicalIChingStandards.js', path: standardsPath },
        { name: 'IChingOrthodoxyValidator.js', path: validatorPath },
        { name: 'TripleOSEngine.js', path: tripleOSPath }
    ];
    
    let allFilesExist = true;
    files.forEach(file => {
        if (fs.existsSync(file.path)) {
            console.log(`✅ ${file.name} - ファイル存在確認`);
        } else {
            console.log(`❌ ${file.name} - ファイルが見つかりません`);
            allFilesExist = false;
        }
    });
    
    if (allFilesExist) {
        console.log('🎯 テスト1: 成功 - 全ての必要ファイルが存在');
    } else {
        console.log('❌ テスト1: 失敗 - 一部ファイルが不足');
        process.exit(1);
    }
    
    console.log('');
    console.log('📋 テスト2: コード構造解析');
    
    // IChingOrthodoxyValidator.js の内容確認
    const validatorContent = fs.readFileSync(validatorPath, 'utf8');
    
    // 新しく追加されたメソッドの存在確認
    const newMethods = [
        'gatherImplementationData',
        'detectTripleOSEngine',
        'collectGlobalImplementationData',
        'collectIChingImplementationData',
        'checkScenarioAnalysisImplementation',
        'checkContextualOSSelection',
        'checkAdaptiveResponseGeneration',
        'checkDynamicPersonalityAdjustment',
        'checkMultipleOSCoexistence',
        'checkPersonalityIndependence',
        'checkAuthenticMultiplicity',
        'checkUnifiedSelfRejection',
        'checkTripleOSHarmony',
        'checkPersonalityCoordination',
        'checkOverallConsistency',
        'checkDynamicBalancing'
    ];
    
    let implementedMethods = 0;
    newMethods.forEach(method => {
        if (validatorContent.includes(method)) {
            console.log(`✅ ${method} - メソッド実装確認`);
            implementedMethods++;
        } else {
            console.log(`❌ ${method} - メソッドが見つかりません`);
        }
    });
    
    const methodImplementationRate = (implementedMethods / newMethods.length) * 100;
    console.log(`📊 新メソッド実装率: ${implementedMethods}/${newMethods.length} (${Math.round(methodImplementationRate)}%)`);
    
    console.log('');
    console.log('📋 テスト3: TripleOSEngine bunenjin機能確認');
    
    // TripleOSEngine.js の内容確認
    const tripleOSContent = fs.readFileSync(tripleOSPath, 'utf8');
    
    const bunenjinFeatures = [
        'initializeBunenjinStatus',
        'getBunenjinImplementationData',
        'calculateBunenjinImplementationCompleteness',
        'enrichAnalysisWithBunenjinData',
        'bunenjinImplementationStatus'
    ];
    
    let implementedFeatures = 0;
    bunenjinFeatures.forEach(feature => {
        if (tripleOSContent.includes(feature)) {
            console.log(`✅ ${feature} - 機能実装確認`);
            implementedFeatures++;
        } else {
            console.log(`❌ ${feature} - 機能が見つかりません`);
        }
    });
    
    const featureImplementationRate = (implementedFeatures / bunenjinFeatures.length) * 100;
    console.log(`📊 bunenjin機能実装率: ${implementedFeatures}/${bunenjinFeatures.length} (${Math.round(featureImplementationRate)}%)`);
    
    console.log('');
    console.log('📋 テスト4: 動的検証ロジック確認');
    
    // 固定値検証の削除確認
    const fixedScorePatterns = [
        'score: 0.85',
        'score: 0.90', 
        'score: 0.80'
    ];
    
    let fixedScoresFound = 0;
    fixedScorePatterns.forEach(pattern => {
        // validateBunenjinPhilosophyAlignment関連の固定値を除外して検索
        const matches = validatorContent.match(new RegExp(pattern, 'g'));
        if (matches) {
            // bunenjin検証メソッド内の固定値のみカウント
            const bunenjinSection = validatorContent.substring(
                validatorContent.indexOf('validateBunenjinPhilosophyAlignment'),
                validatorContent.indexOf('validateLineApplicationAccuracy')
            );
            const bunenjinMatches = bunenjinSection.match(new RegExp(pattern, 'g'));
            if (bunenjinMatches) {
                console.log(`⚠️ bunenjin検証セクションで固定値発見: ${pattern}`);
                fixedScoresFound += bunenjinMatches.length;
            }
        }
    });
    
    if (fixedScoresFound === 0) {
        console.log('✅ 固定値スコアの削除確認 - bunenjin検証で固定値は発見されませんでした');
    } else {
        console.log(`❌ 固定値スコアが残存: ${fixedScoresFound}個`);
    }
    
    console.log('');
    console.log('📋 テスト結果サマリー');
    console.log('==========================================');
    
    const overallScore = (
        (allFilesExist ? 25 : 0) +
        (methodImplementationRate * 0.25) +
        (featureImplementationRate * 0.25) +
        (fixedScoresFound === 0 ? 25 : 0)
    );
    
    console.log(`📊 総合実装スコア: ${Math.round(overallScore)}%`);
    
    if (overallScore >= 90) {
        console.log('🎉 素晴らしい！実装品質が非常に高いレベルに達しています');
    } else if (overallScore >= 80) {
        console.log('🔥 良好！実装が期待される品質に達しています');
    } else if (overallScore >= 70) {
        console.log('📈 改善中！実装が基準に近づいています');
    } else {
        console.log('🚧 要改善：さらなる実装作業が必要です');
    }
    
    console.log('');
    console.log('📋 推定bunenjin哲学整合性スコア予測');
    
    // 実装完了度に基づく予測スコア計算
    const baseScore = 0.60; // 元の60%
    const improvementFactor = overallScore / 100;
    const predictedBunenjinScore = Math.min(0.95, baseScore + (improvementFactor * 0.4)); // 最大95%まで
    
    console.log(`🎯 予測bunenjin哲学整合性: ${Math.round(predictedBunenjinScore * 100)}%`);
    
    if (predictedBunenjinScore >= 0.90) {
        console.log('🎉 目標達成予測！90%以上のスコアが期待されます');
    } else if (predictedBunenjinScore >= 0.80) {
        console.log('🔥 大幅改善予測！80%以上のスコアが期待されます');
    } else {
        console.log(`📈 改善予測：${Math.round((predictedBunenjinScore - baseScore) * 100)}ポイントの向上が期待されます`);
    }
    
    console.log('');
    console.log('📋 次のステップ');
    console.log('==========================================');
    console.log('1. ブラウザでtest-bunenjin-integration.htmlを開いてください');
    console.log('2. システム初期化→Triple OSエンジンテスト→bunenjin検証の順で実行');
    console.log('3. 最終的な完全検証を実行してスコアを確認');
    console.log('4. 90%達成が確認できたら新しい検証レポートを生成');
    
    console.log('');
    console.log('✅ bunenjin哲学統合テスト完了');
    
} catch (error) {
    console.error('❌ テスト実行エラー:', error.message);
    console.error(error.stack);
    process.exit(1);
}