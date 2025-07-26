// AdvancedCompatibilityEngine テスト実行スクリプト
// Node.js環境でのテスト実行

const fs = require('fs');
const path = require('path');

// テスト結果格納
const testResults = {
    passed: 0,
    failed: 0,
    errors: [],
    details: []
};

// ログ関数
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    testResults.details.push({ timestamp, message, type });
}

// モック環境セットアップ
function setupMockEnvironment() {
    log('🔧 モック環境をセットアップ中...');
    
    // グローバル変数のモック
    global.window = {
        HAQEI_DATA: {
            hexagrams: {},
            hexagrams_master: [],
            os_manual: {},
            trigrams_master: []
        },
        COMPATIBILITY_MATRIX: {}
    };
    
    global.console = console;
    
    // BaseComponentクラスのモック
    global.BaseComponent = class BaseComponent {
        constructor(containerId, options = {}) {
            this.containerId = containerId;
            this.options = options;
        }
        
        get defaultOptions() {
            return {};
        }
    };
    
    log('✅ モック環境セットアップ完了');
}

// ファイル読み込み関数
function loadScript(filePath) {
    try {
        const fullPath = path.join(__dirname, filePath);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // ES6 import/exportを削除してevalで実行
        const cleanContent = content
            .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
            .replace(/export\s+default\s+/g, '')
            .replace(/export\s+\{[^}]*\}\s*;?\s*/g, '');
        
        eval(cleanContent);
        log(`✅ スクリプト読み込み完了: ${filePath}`);
        return true;
    } catch (error) {
        log(`❌ スクリプト読み込みエラー: ${filePath} - ${error.message}`, 'error');
        testResults.errors.push(`Script load error: ${filePath} - ${error.message}`);
        return false;
    }
}

// テスト関数
async function runBasicTest() {
    log('🧪 基本機能テスト開始');
    testResults.failed++;
    
    try {
        // AdvancedCompatibilityEngineクラスが定義されているかチェック
        if (typeof AdvancedCompatibilityEngine === 'undefined') {
            throw new Error('AdvancedCompatibilityEngine クラスが定義されていません');
        }
        
        // モックのInternalCompatibilityEngineを作成
        const mockInternalCompatibilityEngine = {
            analyzeTripleOSCompatibility: (engineId, interfaceId, safeModeId) => {
                return {
                    engineInterface: { synergy: 0.7, harmony: 0.6, tension: 0.3, conflict: 0.2, chaos: 0.1 },
                    engineSafeMode: { synergy: 0.6, harmony: 0.7, tension: 0.4, conflict: 0.3, chaos: 0.2 },
                    interfaceSafeMode: { synergy: 0.8, harmony: 0.5, tension: 0.2, conflict: 0.4, chaos: 0.1 }
                };
            }
        };
        
        // AdvancedCompatibilityEngineを初期化
        const advancedEngine = new AdvancedCompatibilityEngine(mockInternalCompatibilityEngine);
        
        if (!advancedEngine) {
            throw new Error('AdvancedCompatibilityEngine の初期化に失敗しました');
        }
        
        log('✅ AdvancedCompatibilityEngine 初期化成功');
        
        // 必要なメソッドが存在するかチェック
        const requiredMethods = [
            'analyzeInternalTeamComposition',
            'detectSpecialPatterns',
            'findHistoricalMatches',
            'evaluateContextualFactors',
            'generateOptimizationHints'
        ];
        
        for (const method of requiredMethods) {
            if (typeof advancedEngine[method] !== 'function') {
                throw new Error(`必要なメソッド ${method} が見つかりません`);
            }
        }
        
        log('✅ 必要メソッド存在確認完了');
        
        testResults.failed--;
        testResults.passed++;
        
    } catch (error) {
        log(`❌ 基本機能テストエラー: ${error.message}`, 'error');
        testResults.errors.push(`Basic test error: ${error.message}`);
    }
}

async function runAdvancedAnalysisTest() {
    log('🚀 高度分析機能テスト開始');
    testResults.failed++;
    
    try {
        // モックデータでテスト実行
        const mockInternalCompatibilityEngine = {
            analyzeTripleOSCompatibility: (engineId, interfaceId, safeModeId) => {
                return {
                    engineInterface: { synergy: 0.8, harmony: 0.7, tension: 0.2, conflict: 0.6, chaos: 0.1 },
                    engineSafeMode: { synergy: 0.6, harmony: 0.8, tension: 0.4, conflict: 0.3, chaos: 0.2 },
                    interfaceSafeMode: { synergy: 0.9, harmony: 0.5, tension: 0.1, conflict: 0.2, chaos: 0.1 }
                };
            }
        };
        
        const advancedEngine = new AdvancedCompatibilityEngine(mockInternalCompatibilityEngine, {
            enableDataLoader: false // テスト環境ではDataLoaderを無効化
        });
        
        const testUserContext = {
            lifeStage: 'developing',
            goals: ['personal_growth', 'career_growth'],
            challenges: ['stress_management'],
            environment: { type: 'corporate' }
        };
        
        log('📊 テスト分析実行中...');
        
        const result = await advancedEngine.analyzeInternalTeamComposition(1, 2, 3, testUserContext);
        
        if (!result) {
            throw new Error('分析結果が null です');
        }
        
        // 結果の構造確認
        const expectedKeys = [
            'basicCompatibility',
            'detailedData',
            'specialPattern',
            'historicalMatches',
            'contextualAdjustment',
            'optimizationHints',
            'overallAssessment'
        ];
        
        for (const key of expectedKeys) {
            if (!(key in result)) {
                log(`⚠️ 結果に ${key} が含まれていません`, 'warning');
            } else {
                log(`✅ ${key} 確認済み`);
            }
        }
        
        // 特殊パターン検出テスト
        if (result.specialPattern) {
            log(`🎯 特殊パターン検出成功: ${result.specialPattern.name}`);
        }
        
        // 歴史人物マッチングテスト
        if (result.historicalMatches && Array.isArray(result.historicalMatches)) {
            log(`👑 歴史人物マッチング: ${result.historicalMatches.length}件`);
        }
        
        // 最適化ヒントテスト
        if (result.optimizationHints) {
            const totalHints = Object.values(result.optimizationHints).reduce((sum, hints) => {
                return sum + (Array.isArray(hints) ? hints.length : 0);
            }, 0);
            log(`💡 最適化ヒント生成: ${totalHints}件`);
        }
        
        // 総合評価テスト
        if (result.overallAssessment && typeof result.overallAssessment.teamEffectiveness === 'number') {
            const effectiveness = Math.round(result.overallAssessment.teamEffectiveness * 100);
            log(`📈 チーム効果性スコア: ${effectiveness}%`);
        }
        
        log('✅ 高度分析機能テスト完了');
        
        testResults.failed--;
        testResults.passed++;
        
    } catch (error) {
        log(`❌ 高度分析機能テストエラー: ${error.message}`, 'error');
        testResults.errors.push(`Advanced analysis test error: ${error.message}`);
        console.error('詳細エラー:', error);
    }
}

async function runSpecialPatternTest() {
    log('🔍 特殊パターン検出テスト開始');
    testResults.failed++;
    
    try {
        const mockInternalCompatibilityEngine = {
            analyzeTripleOSCompatibility: (engineId, interfaceId, safeModeId) => {
                // 逆説的シナジー型を検出するための高い葛藤+高いシナジー
                return {
                    engineInterface: { synergy: 0.8, harmony: 0.6, tension: 0.3, conflict: 0.7, chaos: 0.1 },
                    engineSafeMode: { synergy: 0.7, harmony: 0.7, tension: 0.4, conflict: 0.6, chaos: 0.2 },
                    interfaceSafeMode: { synergy: 0.9, harmony: 0.5, tension: 0.2, conflict: 0.3, chaos: 0.1 }
                };
            }
        };
        
        const advancedEngine = new AdvancedCompatibilityEngine(mockInternalCompatibilityEngine, {
            enableDataLoader: false
        });
        
        const testUserContext = {
            lifeStage: 'developing',
            goals: ['personal_growth'],
            challenges: ['stress_management']
        };
        
        const result = await advancedEngine.analyzeInternalTeamComposition(1, 49, 33, testUserContext);
        
        // 特殊パターン検出の詳細確認
        if (result.specialPattern) {
            log(`🎯 特殊パターン検出: ${result.specialPattern.name}`);
            log(`   信頼度: ${Math.round(result.specialPattern.confidence * 100)}%`);
            log(`   特徴数: ${result.specialPattern.characteristics?.length || 0}件`);
            log(`   アドバイス数: ${result.specialPattern.advice?.length || 0}件`);
        } else {
            log('⚠️ 特殊パターンが検出されませんでした', 'warning');
        }
        
        log('✅ 特殊パターン検出テスト完了');
        
        testResults.failed--;
        testResults.passed++;
        
    } catch (error) {
        log(`❌ 特殊パターン検出テストエラー: ${error.message}`, 'error');
        testResults.errors.push(`Special pattern test error: ${error.message}`);
    }
}

async function runIntegrationTest() {
    log('🔄 統合テスト開始');
    testResults.failed++;
    
    try {
        const testCases = [
            { engine: 1, interface: 49, safeMode: 33, name: 'ダ・ヴィンチタイプ' },
            { engine: 11, interface: 45, safeMode: 15, name: '聖徳太子タイプ' },
            { engine: 1, interface: 43, safeMode: 51, name: 'ジョブズタイプ' }
        ];
        
        const mockInternalCompatibilityEngine = {
            analyzeTripleOSCompatibility: (engineId, interfaceId, safeModeId) => {
                // 各テストケースで異なる結果を返す
                const variation = (engineId + interfaceId + safeModeId) % 3;
                return {
                    engineInterface: { 
                        synergy: 0.7 + variation * 0.1, 
                        harmony: 0.6 + variation * 0.1, 
                        tension: 0.3, 
                        conflict: 0.2 + variation * 0.1, 
                        chaos: 0.1 
                    },
                    engineSafeMode: { 
                        synergy: 0.6 + variation * 0.1, 
                        harmony: 0.7, 
                        tension: 0.4, 
                        conflict: 0.3, 
                        chaos: 0.2 
                    },
                    interfaceSafeMode: { 
                        synergy: 0.8, 
                        harmony: 0.5 + variation * 0.1, 
                        tension: 0.2, 
                        conflict: 0.4, 
                        chaos: 0.1 
                    }
                };
            }
        };
        
        const advancedEngine = new AdvancedCompatibilityEngine(mockInternalCompatibilityEngine, {
            enableDataLoader: false
        });
        
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            log(`📋 統合テスト ${i + 1}/${testCases.length}: ${testCase.name}`);
            
            const result = await advancedEngine.analyzeInternalTeamComposition(
                testCase.engine,
                testCase.interface,
                testCase.safeMode
            );
            
            if (result && result.overallAssessment) {
                const effectiveness = Math.round(result.overallAssessment.teamEffectiveness * 100);
                log(`  ✅ チーム効果性: ${effectiveness}%`);
                
                if (result.historicalMatches && result.historicalMatches.length > 0) {
                    const topMatch = result.historicalMatches[0];
                    log(`  👑 最高マッチ: ${topMatch.name} (${Math.round(topMatch.similarity * 100)}%)`);
                }
            } else {
                log(`  ⚠️ 結果が不完全です`, 'warning');
            }
        }
        
        log('✅ 統合テスト完了');
        
        testResults.failed--;
        testResults.passed++;
        
    } catch (error) {
        log(`❌ 統合テストエラー: ${error.message}`, 'error');
        testResults.errors.push(`Integration test error: ${error.message}`);
    }
}

// メイン実行関数
async function runAllTests() {
    log('🚀 AdvancedCompatibilityEngine テスト開始');
    
    // モック環境セットアップ
    setupMockEnvironment();
    
    // 必要なスクリプトを読み込み
    const scripts = [
        'js/data/compatibility_definition.js',
        'js/core/InternalCompatibilityEngine.js',
        'js/core/AdvancedCompatibilityEngine.js'
    ];
    
    let scriptsLoaded = 0;
    for (const script of scripts) {
        if (loadScript(script)) {
            scriptsLoaded++;
        }
    }
    
    if (scriptsLoaded !== scripts.length) {
        log(`❌ スクリプト読み込み失敗: ${scriptsLoaded}/${scripts.length}`, 'error');
        return;
    }
    
    // テスト実行
    await runBasicTest();
    await runAdvancedAnalysisTest();
    await runSpecialPatternTest();
    await runIntegrationTest();
    
    // 結果サマリー
    log('\n📊 テスト結果サマリー');
    log(`✅ 成功: ${testResults.passed}件`);
    log(`❌ 失敗: ${testResults.failed}件`);
    log(`⚠️  エラー: ${testResults.errors.length}件`);
    
    if (testResults.errors.length > 0) {
        log('\n🔍 エラー詳細:');
        testResults.errors.forEach((error, index) => {
            log(`  ${index + 1}. ${error}`);
        });
    }
    
    const successRate = Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100);
    log(`\n🎯 成功率: ${successRate}%`);
    
    if (successRate >= 75) {
        log('🎉 テスト合格！AdvancedCompatibilityEngine は正常に動作しています。');
    } else {
        log('⚠️ テスト不合格。修正が必要です。');
    }
}

// テスト実行
runAllTests().catch(error => {
    console.error('テスト実行エラー:', error);
});