// Direct validation script for Triple OS Analysis Engine
console.log('🧪 Starting Triple OS Analysis Engine Validation...');

function generateAnswers(pattern) {
    const answers = {};
    
    switch (pattern) {
        case 'creative':
            for (let i = 1; i <= 30; i++) {
                if (i <= 3) answers['q' + i] = '5';
                else if (i <= 6) answers['q' + i] = '4';
                else if (i <= 24) answers['q' + i] = '3';
                else answers['q' + i] = String(Math.floor(Math.random() * 3) + 3);
            }
            break;
        case 'stable': 
            for (let i = 1; i <= 30; i++) {
                if (i >= 10 && i <= 12) answers['q' + i] = '5';
                else if (i >= 13 && i <= 15) answers['q' + i] = '4';
                else if (i <= 24) answers['q' + i] = '3';
                else answers['q' + i] = String(Math.floor(Math.random() * 3) + 2);
            }
            break;
        case 'social':
            for (let i = 1; i <= 30; i++) {
                if (i <= 24) answers['q' + i] = '3';
                else answers['q' + i] = String(Math.floor(Math.random() * 2) + 4);
            }
            break;
        case 'defensive':
            for (let i = 1; i <= 30; i++) {
                answers['q' + i] = String(Math.floor(Math.random() * 2) + 1);
            }
            break;
        default:
            for (let i = 1; i <= 30; i++) {
                answers['q' + i] = String(Math.floor(Math.random() * 5) + 1);
            }
    }
    
    return answers;
}

function validateHexagramId(id, osType) {
    const valid = id >= 1 && id <= 64;
    console.log((valid ? '✅' : '❌') + ' ' + osType + ': 卦番号 ' + id + ' ' + (valid ? '(正常)' : '(範囲外)'));
    return valid;
}

function formatResult(result, patternName) {
    console.log('\n📊 ' + patternName + ' パターン結果:');
    console.log('   Engine OS: ' + result.engineOS.hexagramId + '. ' + result.engineOS.name);
    console.log('   Interface OS: ' + result.interfaceOS.hexagramId + '. ' + result.interfaceOS.name);
    console.log('   Safe Mode OS: ' + result.safeModeOS.hexagramId + '. ' + result.safeModeOS.name);
    
    const engineValid = validateHexagramId(result.engineOS.hexagramId, 'Engine OS');
    const interfaceValid = validateHexagramId(result.interfaceOS.hexagramId, 'Interface OS');
    const safeModeValid = validateHexagramId(result.safeModeOS.hexagramId, 'Safe Mode OS');
    
    return engineValid && interfaceValid && safeModeValid;
}

async function runValidation() {
    try {
        console.log('🔍 UltraAnalysisEngine クラス確認...');
        
        if (typeof UltraAnalysisEngine === 'undefined') {
            console.error('❌ UltraAnalysisEngine が見つかりません');
            return false;
        }
        
        console.log('✅ UltraAnalysisEngine クラスが存在します');
        
        const engine = new UltraAnalysisEngine();
        console.log('✅ エンジンインスタンス作成成功');
        
        if (\!engine.H64_HEXAGRAMS || engine.H64_HEXAGRAMS.length \!== 64) {
            console.warn('⚠️ 64卦データベースに問題: ' + (engine.H64_HEXAGRAMS ? engine.H64_HEXAGRAMS.length : 0) + ' 卦');
        } else {
            console.log('✅ 64卦データベース正常');
        }
        
        if (\!engine.trigramTable || Object.keys(engine.trigramTable).length \!== 8) {
            console.warn('⚠️ 三爻テーブルに問題');
        } else {
            console.log('✅ 三爻テーブル正常');
        }
        
        const testPatterns = ['creative', 'balanced', 'stable', 'social', 'defensive'];
        let successCount = 0;
        
        for (let i = 0; i < testPatterns.length; i++) {
            const patternName = testPatterns[i];
            console.log('\n🧪 ' + patternName + ' パターンテスト開始...');
            
            try {
                const testAnswers = generateAnswers(patternName);
                const result = engine.analyzeTripleOS(testAnswers);
                
                if (result && result.engineOS && result.interfaceOS && result.safeModeOS) {
                    const valid = formatResult(result, patternName);
                    if (valid) {
                        successCount++;
                        console.log('✅ ' + patternName + ' パターン成功');
                    } else {
                        console.log('❌ ' + patternName + ' パターン: 無効な卦番号');
                    }
                } else {
                    console.log('❌ ' + patternName + ' パターン: 不完全な結果');
                }
                
            } catch (error) {
                console.error('❌ ' + patternName + ' パターンでエラー:', error);
            }
        }
        
        const successRate = (successCount / testPatterns.length) * 100;
        console.log('\n📈 総合結果: ' + successCount + '/' + testPatterns.length + ' パターン成功 (' + successRate + '%)');
        
        if (successRate >= 80) {
            console.log('🎉 検証結果: 優秀 - Triple OS分析エンジンは正常に動作しています');
            return true;
        } else if (successRate >= 60) {
            console.log('⚠️ 検証結果: 良好 - 一部改善の余地があります');
            return true;
        } else {
            console.log('❌ 検証結果: 要改善 - 重大な問題があります');
            return false;
        }
        
    } catch (error) {
        console.error('❌ 検証中に重大エラー:', error);
        return false;
    }
}

async function runConsistencyTest() {
    console.log('\n🔄 一貫性テスト開始...');
    
    try {
        const engine = new UltraAnalysisEngine();
        const testAnswers = generateAnswers('balanced');
        const results = [];
        
        for (let i = 0; i < 5; i++) {
            const result = engine.analyzeTripleOS(testAnswers);
            results.push(result);
        }
        
        const firstResult = results[0];
        let consistent = true;
        
        for (let i = 1; i < results.length; i++) {
            if (results[i].engineOS.hexagramId \!== firstResult.engineOS.hexagramId ||
                results[i].interfaceOS.hexagramId \!== firstResult.interfaceOS.hexagramId ||
                results[i].safeModeOS.hexagramId \!== firstResult.safeModeOS.hexagramId) {
                consistent = false;
                break;
            }
        }
        
        if (consistent) {
            console.log('✅ 一貫性テスト成功: 同一入力で同一結果');
            return true;
        } else {
            console.log('❌ 一貫性テスト失敗: 結果にばらつきがあります');
            return false;
        }
        
    } catch (error) {
        console.error('❌ 一貫性テスト中にエラー:', error);
        return false;
    }
}

async function runEdgeCaseTest() {
    console.log('\n⚠️ エッジケーステスト開始...');
    
    try {
        const engine = new UltraAnalysisEngine();
        let passCount = 0;
        
        try {
            const result1 = engine.analyzeTripleOS({});
            console.log('✅ 空データ処理成功');
            passCount++;
        } catch (error) {
            console.log('⚠️ 空データでエラー: ' + error.message);
        }
        
        const minAnswers = {};
        for (let i = 1; i <= 30; i++) {
            minAnswers['q' + i] = '1';
        }
        
        try {
            const result2 = engine.analyzeTripleOS(minAnswers);
            if (result2.engineOS.hexagramId >= 1 && result2.engineOS.hexagramId <= 64) {
                console.log('✅ 最小値データ処理成功');
                passCount++;
            } else {
                console.log('❌ 最小値データで無効な卦番号: ' + result2.engineOS.hexagramId);
            }
        } catch (error) {
            console.log('❌ 最小値データでエラー: ' + error.message);
        }
        
        const maxAnswers = {};
        for (let i = 1; i <= 30; i++) {
            maxAnswers['q' + i] = '5';
        }
        
        try {
            const result3 = engine.analyzeTripleOS(maxAnswers);
            if (result3.engineOS.hexagramId >= 1 && result3.engineOS.hexagramId <= 64) {
                console.log('✅ 最大値データ処理成功');
                passCount++;
            } else {
                console.log('❌ 最大値データで無効な卦番号: ' + result3.engineOS.hexagramId);
            }
        } catch (error) {
            console.log('❌ 最大値データでエラー: ' + error.message);
        }
        
        console.log('📊 エッジケーステスト結果: ' + passCount + '/3 成功');
        return passCount >= 2;
        
    } catch (error) {
        console.error('❌ エッジケーステスト中に重大エラー:', error);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Triple OS Analysis Engine 完全検証開始\n' + '='.repeat(60));
    
    const mainTest = await runValidation();
    const consistencyTest = await runConsistencyTest();
    const edgeCaseTest = await runEdgeCaseTest();
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 最終評価:');
    console.log('   メイン機能テスト: ' + (mainTest ? '✅ 合格' : '❌ 不合格'));
    console.log('   一貫性テスト: ' + (consistencyTest ? '✅ 合格' : '❌ 不合格'));
    console.log('   エッジケーステスト: ' + (edgeCaseTest ? '✅ 合格' : '❌ 不合格'));
    
    const overallPass = mainTest && consistencyTest && edgeCaseTest;
    console.log('\n🎯 総合判定: ' + (overallPass ? '✅ 全ての検証項目をクリア' : '❌ 追加の修正が必要'));
    
    return {
        mainTest: mainTest,
        consistencyTest: consistencyTest,
        edgeCaseTest: edgeCaseTest,
        overall: overallPass
    };
}

console.log('✅ 検証スクリプト読み込み完了');
console.log('💡 実行方法: runAllTests() をブラウザコンソールで実行してください');

window.runTripleOSValidation = runAllTests;
window.validateTripleOS = runValidation;
window.testConsistency = runConsistencyTest;
window.testEdgeCases = runEdgeCaseTest;
EOF < /dev/null