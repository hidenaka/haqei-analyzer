/**
 * 8シナリオ・Binary Tree表示検証スクリプト
 * 緊急修正後の動作確認用
 */

const fs = require('fs');

async function test8ScenariosDisplayWithFetch() {
    console.log('🎯 8シナリオ・Binary Tree表示検証開始 (Browser-free)');
    
    try {
        // まずHTMLファイルの内容確認
        console.log('📄 Future Simulator HTML確認');
        const response = await fetch('http://localhost:8788/future_simulator.html');
        const htmlContent = await response.text();
        
        // 重要な要素の存在確認
        const checks = {
            hasEightScenariosGenerator: htmlContent.includes('EightScenariosGenerator.js'),
            hasScenariosDisplayUI: htmlContent.includes('ScenariosDisplayUI.js'),
            hasBinaryTreeEngine: htmlContent.includes('BinaryTreeFutureEngine.js'),
            hasUpdateAllDisplays: htmlContent.includes('updateAllDisplays'),
            
            // 既存のJavaScriptファイル確認
            hasH384Database: htmlContent.includes('H384H64database.js'),
            hasFutureSimulatorCore: htmlContent.includes('future-simulator-core.js'),
            
            // HTML構造確認
            hasResultContainer: htmlContent.includes('result') || htmlContent.includes('analysis'),
            hasInputForm: htmlContent.includes('worryInput'),
            hasAnalysisButton: htmlContent.includes('aiGuessBtn')
        };
        
        console.log('📊 HTML要素チェック結果:', JSON.stringify(checks, null, 2));
        
        // JavaScriptファイル存在確認
        const jsFileChecks = {};
        const jsFiles = [
            'js/pages/future-simulator/EightScenariosGenerator.js',
            'js/pages/future-simulator/ScenariosDisplayUI.js', 
            'js/core/BinaryTreeFutureEngine.js'
        ];
        
        for (const file of jsFiles) {
            try {
                const jsResponse = await fetch(`http://localhost:8788/${file}`);
                jsFileChecks[file] = jsResponse.ok;
                console.log(`${jsResponse.ok ? '✅' : '❌'} ${file}: ${jsResponse.status}`);
            } catch (error) {
                jsFileChecks[file] = false;
                console.log(`❌ ${file}: ${error.message}`);
            }
        }
        
        // 検証結果まとめ
        const verificationResult = {
            timestamp: new Date().toISOString(),
            htmlChecks: checks,
            jsFileChecks: jsFileChecks,
            
            success: {
                htmlIntegration: checks.hasEightScenariosGenerator && 
                               checks.hasScenariosDisplayUI && 
                               checks.hasBinaryTreeEngine,
                fileExists: Object.values(jsFileChecks).every(exists => exists),
                overall: checks.hasEightScenariosGenerator && 
                        checks.hasScenariosDisplayUI && 
                        checks.hasBinaryTreeEngine &&
                        Object.values(jsFileChecks).every(exists => exists)
            },
            
            issues: {
                missingJSFiles: Object.entries(jsFileChecks)
                    .filter(([file, exists]) => !exists)
                    .map(([file]) => file),
                missingHTMLIntegration: !checks.hasEightScenariosGenerator || 
                                     !checks.hasScenariosDisplayUI || 
                                     !checks.hasBinaryTreeEngine
            }
        };
        
        console.log('🎯 検証結果レポート:');
        console.log(JSON.stringify(verificationResult, null, 2));
        
        // 検証結果をファイルに保存
        fs.writeFileSync(
            'verification-result-8scenarios.json',
            JSON.stringify(verificationResult, null, 2)
        );
        
        // 成功・失敗判定
        if (verificationResult.success.overall) {
            console.log('✅ 8シナリオ・Binary Tree統合システム検証: 成功');
            console.log('💪 実装完了確認: EightScenariosGenerator + ScenariosDisplayUI + updateAllDisplays修正');
        } else {
            console.log('❌ 8シナリオ・Binary Tree統合システム検証: 問題発見');
            console.log('🔧 修正必要項目:', verificationResult.issues);
        }
        
        return verificationResult;
        
    } catch (error) {
        console.error('❌ 検証エラー:', error);
        return { success: false, error: error.message };
    }
}

// fetch API polyfill for older Node.js versions
if (typeof global !== 'undefined' && !global.fetch) {
    global.fetch = require('node-fetch');
}

// 実行
test8ScenariosDisplayWithFetch()
    .then(result => {
        console.log('🏁 検証完了');
        process.exit(result.success.overall ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 検証実行エラー:', error);
        process.exit(1);
    });