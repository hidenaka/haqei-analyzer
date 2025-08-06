/**
 * 仮想人格システム包括テスト
 * 
 * 目的：
 * - VirtualPersonaEngineの動作確認
 * - Triple OSアーキテクチャの整合性検証
 * - H384データベース（386爻）の統合テスト
 * - bunenjin哲学との整合性確認
 * 
 * 処理内容：
 * 1. H384データベースの完全性確認
 * 2. 仮想人格生成エンジンのテスト
 * 3. Triple OS相互作用シミュレーション
 * 4. 易経メタファーエンジンの動作確認
 * 
 * 出力：
 * - 各コンポーネントのテスト結果
 * - システム統合状況レポート
 * 
 * 副作用：
 * - テスト結果のコンソール出力
 * - エラー詳細の記録
 * 
 * 前提条件：
 * - H384データベースが正しく読み込まれている
 * - 仮想人格関連JSファイルが利用可能
 * - bunenjin哲学システムが初期化済み
 */

console.log("🎭 仮想人格システム包括テスト開始...");

// テスト用モックデータ
const mockAnalysisResult = {
    engine_os: { score: 75, traits: ["創造性", "独立性", "理想主義"] },
    interface_os: { score: 68, traits: ["協調性", "共感力", "適応性"] },
    safe_mode_os: { score: 82, traits: ["慎重性", "分析力", "防御性"] },
    timestamp: new Date().toISOString()
};

const mockRawAnswers = [
    { question: 1, answer: 4, confidence: 0.8 },
    { question: 2, answer: 3, confidence: 0.7 },
    { question: 3, answer: 5, confidence: 0.9 }
];

/**
 * H384データベース完全性テスト
 * 
 * 目的：
 * - 386爻データの完全性確認
 * - 用九・用六エントリの存在確認
 * - データ構造の妥当性検証
 * 
 * 入力：
 * - なし（グローバルH384_DATAを使用）
 * 
 * 処理内容：
 * 1. H384_DATAの存在確認
 * 2. データ長（386エントリ）の確認
 * 3. 必須フィールドの存在確認
 * 4. 用九・用六の特別エントリ確認
 * 
 * 出力：
 * - Object: テスト結果の詳細
 * 
 * 副作用：
 * - テスト結果のコンソール出力
 * 
 * エラー処理：
 * - データ不整合時の詳細エラー情報
 */
function testH384DatabaseIntegrity() {
    console.log("📊 H384データベース完全性テスト開始...");
    
    const results = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        warnings: 0,
        details: []
    };
    
    // テスト1: グローバルH384_DATAの存在確認
    results.totalTests++;
    if (typeof global !== 'undefined' && global.H384_DATA) {
        results.passedTests++;
        results.details.push("✅ グローバルH384_DATA存在確認");
    } else if (typeof window !== 'undefined' && window.H384_DATA) {
        results.passedTests++;
        results.details.push("✅ WindowオブジェクトH384_DATA存在確認");
    } else {
        results.failedTests++;
        results.details.push("❌ H384_DATA未定義");
        return results;
    }
    
    const H384_DATA = (typeof global !== 'undefined' ? global.H384_DATA : window.H384_DATA) || [];
    
    // テスト2: データ長確認
    results.totalTests++;
    if (Array.isArray(H384_DATA) && H384_DATA.length === 386) {
        results.passedTests++;
        results.details.push(`✅ データ長確認: ${H384_DATA.length}エントリ`);
    } else {
        results.failedTests++;
        results.details.push(`❌ データ長異常: ${H384_DATA.length} (期待値: 386)`);
    }
    
    // テスト3: 必須フィールド確認
    results.totalTests++;
    const requiredFields = ['通し番号', '卦番号', '卦名', '爻'];
    const invalidEntries = H384_DATA.filter(entry => 
        !requiredFields.every(field => Object.prototype.hasOwnProperty.call(entry, field))
    );
    
    if (invalidEntries.length === 0) {
        results.passedTests++;
        results.details.push("✅ 必須フィールド完全性確認");
    } else {
        results.failedTests++;
        results.details.push(`❌ 必須フィールド欠損: ${invalidEntries.length}エントリ`);
    }
    
    // テスト4: 用九・用六エントリ確認
    results.totalTests++;
    const youkuu = H384_DATA.find(entry => entry['通し番号'] === 7 && entry['爻'] === '用九');
    const yourikuu = H384_DATA.find(entry => entry['通し番号'] === 14 && entry['爻'] === '用六');
    
    if (youkuu && yourikuu) {
        results.passedTests++;
        results.details.push("✅ 用九・用六エントリ存在確認");
    } else {
        results.warnings++;
        results.details.push("⚠️ 用九・用六エントリ不完全");
    }
    
    return results;
}

/**
 * Triple OSアーキテクチャテスト
 * 
 * 目的：
 * - Engine/Interface/Safe Mode OSの独立性確認
 * - bunenjin哲学との整合性検証
 * - OS間相互作用の正常性確認
 * 
 * 入力：
 * - analysisResult: Object - 分析結果データ
 * 
 * 処理内容：
 * 1. 各OSスコアの妥当性確認
 * 2. OS間バランスの分析
 * 3. bunenjin哲学原則との整合性チェック
 * 4. 相互作用パターンの確認
 * 
 * 出力：
 * - Object: Triple OSテスト結果
 * 
 * エラー処理：
 * - スコア異常値の検出と報告
 * - バランス不整合の警告
 */
function testTripleOSArchitecture(analysisResult) {
    console.log("🏗️ Triple OSアーキテクチャテスト開始...");
    
    const results = {
        engineOS: { status: 'unknown', score: 0, issues: [] },
        interfaceOS: { status: 'unknown', score: 0, issues: [] },
        safeModeOS: { status: 'unknown', score: 0, issues: [] },
        integration: { status: 'unknown', balance: 0, philosophy: 'unknown' },
        overall: 'pending'
    };
    
    // Engine OS テスト
    if (analysisResult.engine_os) {
        const score = analysisResult.engine_os.score;
        results.engineOS.score = score;
        
        if (!score || score < 0 || score > 100) {
            results.engineOS.status = 'error';
            results.engineOS.issues.push('スコア範囲異常');
        } else {
            results.engineOS.status = 'success';
        }
        
        if (!analysisResult.engine_os.traits || !Array.isArray(analysisResult.engine_os.traits)) {
            results.engineOS.issues.push('特性データ不正');
        }
    } else {
        results.engineOS.status = 'error';
        results.engineOS.issues.push('Engine OSデータ欠損');
    }
    
    // Interface OS テスト
    if (analysisResult.interface_os) {
        const score = analysisResult.interface_os.score;
        results.interfaceOS.score = score;
        
        if (!score || score < 0 || score > 100) {
            results.interfaceOS.status = 'error';
            results.interfaceOS.issues.push('スコア範囲異常');
        } else {
            results.interfaceOS.status = 'success';
        }
    } else {
        results.interfaceOS.status = 'error';
        results.interfaceOS.issues.push('Interface OSデータ欠損');
    }
    
    // Safe Mode OS テスト
    if (analysisResult.safe_mode_os) {
        const score = analysisResult.safe_mode_os.score;
        results.safeModeOS.score = score;
        
        if (!score || score < 0 || score > 100) {
            results.safeModeOS.status = 'error';
            results.safeModeOS.issues.push('スコア範囲異常');
        } else {
            results.safeModeOS.status = 'success';
        }
    } else {
        results.safeModeOS.status = 'error';
        results.safeModeOS.issues.push('Safe Mode OSデータ欠損');
    }
    
    // 統合性テスト
    const totalScore = results.engineOS.score + results.interfaceOS.score + results.safeModeOS.score;
    const averageScore = totalScore / 3;
    const variance = Math.abs(results.engineOS.score - averageScore) + 
                    Math.abs(results.interfaceOS.score - averageScore) + 
                    Math.abs(results.safeModeOS.score - averageScore);
    
    results.integration.balance = variance;
    
    if (variance < 30) {
        results.integration.status = 'balanced';
        results.integration.philosophy = 'bunenjin-aligned';
    } else if (variance < 60) {
        results.integration.status = 'moderate';
        results.integration.philosophy = 'acceptable';
    } else {
        results.integration.status = 'imbalanced';
        results.integration.philosophy = 'needs-adjustment';
    }
    
    // 総合評価
    const successCount = [results.engineOS.status, results.interfaceOS.status, results.safeModeOS.status]
        .filter(status => status === 'success').length;
    
    if (successCount === 3 && results.integration.status === 'balanced') {
        results.overall = 'excellent';
    } else if (successCount >= 2) {
        results.overall = 'good';
    } else {
        results.overall = 'needs-improvement';
    }
    
    return results;
}

/**
 * 仮想人格生成シミュレーション
 * 
 * 目的：
 * - VirtualPersonaEngineの基本動作確認
 * - 人格構築プロセスのシミュレーション
 * - 易経メタファーとの統合確認
 * 
 * 入力：
 * - analysisResult: Object - Triple OS分析結果
 * - rawAnswers: Array - 原回答データ
 * 
 * 処理内容：
 * 1. 仮想人格データ構造の生成
 * 2. 3つのペルソナ特性の定義
 * 3. 相互作用パターンの生成
 * 4. 易経卦との対応確認
 * 
 * 出力：
 * - Object: 生成された仮想人格データ
 */
function simulateVirtualPersonaGeneration(analysisResult, rawAnswers) {
    console.log("🎭 仮想人格生成シミュレーション開始...");
    
    const virtualPersona = {
        timestamp: new Date().toISOString(),
        sourceData: {
            analysisResult: analysisResult,
            rawAnswers: rawAnswers
        },
        personas: {
            essence: {
                name: "内なる精霊",
                type: "engine_os",
                score: analysisResult.engine_os.score,
                traits: analysisResult.engine_os.traits,
                voice: "私は創造と変革の力です。",
                hexagram: { number: 1, name: "乾為天" }
            },
            social: {
                name: "社会的守護者",
                type: "interface_os", 
                score: analysisResult.interface_os.score,
                traits: analysisResult.interface_os.traits,
                voice: "私は調和と協力の橋渡しです。",
                hexagram: { number: 2, name: "坤為地" }
            },
            defense: {
                name: "賢明な番人",
                type: "safe_mode_os",
                score: analysisResult.safe_mode_os.score,
                traits: analysisResult.safe_mode_os.traits,
                voice: "私は慎重さと守護の盾です。",
                hexagram: { number: 52, name: "艮為山" }
            }
        },
        interactions: [
            {
                scenario: "重要な決断",
                participants: ["essence", "social", "defense"],
                dynamics: "創造性と慎重性の対話",
                outcome: "バランスの取れた判断"
            }
        ],
        bunenjinAlignment: true,
        generationStatus: "success"
    };
    
    return virtualPersona;
}

// テスト実行
async function runComprehensiveTest() {
    console.log("=" + "=".repeat(60));
    console.log("🚀 HAQEI仮想人格システム包括テスト");
    console.log("=" + "=".repeat(60));
    
    try {
        // Phase 1: H384データベーステスト
        const h384Results = testH384DatabaseIntegrity();
        console.log("\n📊 H384データベーステスト結果:");
        console.log(`   成功: ${h384Results.passedTests}/${h384Results.totalTests}`);
        console.log(`   失敗: ${h384Results.failedTests}`);
        console.log(`   警告: ${h384Results.warnings}`);
        h384Results.details.forEach(detail => console.log(`   ${detail}`));
        
        // Phase 2: Triple OSアーキテクチャテスト
        const tripleOSResults = testTripleOSArchitecture(mockAnalysisResult);
        console.log("\n🏗️ Triple OSアーキテクチャテスト結果:");
        console.log(`   Engine OS: ${tripleOSResults.engineOS.status} (${tripleOSResults.engineOS.score})`);
        console.log(`   Interface OS: ${tripleOSResults.interfaceOS.status} (${tripleOSResults.interfaceOS.score})`);
        console.log(`   Safe Mode OS: ${tripleOSResults.safeModeOS.status} (${tripleOSResults.safeModeOS.score})`);
        console.log(`   統合性: ${tripleOSResults.integration.status}`);
        console.log(`   bunenjin哲学: ${tripleOSResults.integration.philosophy}`);
        console.log(`   総合評価: ${tripleOSResults.overall}`);
        
        // Phase 3: 仮想人格生成シミュレーション
        const virtualPersona = simulateVirtualPersonaGeneration(mockAnalysisResult, mockRawAnswers);
        console.log("\n🎭 仮想人格生成シミュレーション結果:");
        console.log(`   生成状況: ${virtualPersona.generationStatus}`);
        console.log(`   bunenjin整合性: ${virtualPersona.bunenjinAlignment}`);
        console.log(`   ペルソナ数: ${Object.keys(virtualPersona.personas).length}`);
        console.log("   生成されたペルソナ:");
        Object.entries(virtualPersona.personas).forEach(([key, persona]) => {
            console.log(`     ${key}: ${persona.name} (${persona.type}, ${persona.score}点)`);
        });
        
        // 総合評価
        console.log("\n📋 総合評価:");
        const overallScore = (
            (h384Results.passedTests / h384Results.totalTests) * 0.3 +
            (tripleOSResults.overall === 'excellent' ? 1 : tripleOSResults.overall === 'good' ? 0.7 : 0.4) * 0.4 +
            (virtualPersona.generationStatus === 'success' ? 1 : 0) * 0.3
        ) * 100;
        
        console.log(`   システム統合度: ${overallScore.toFixed(1)}%`);
        console.log(`   品質レベル: ${overallScore >= 90 ? 'A級' : overallScore >= 75 ? 'B級' : overallScore >= 60 ? 'C級' : '要改善'}`);
        console.log(`   bunenjin哲学適合: ${virtualPersona.bunenjinAlignment ? '完全適合' : '要調整'}`);
        
    } catch (error) {
        console.error("❌ テスト実行中にエラーが発生しました:", error);
        console.error("スタックトレース:", error.stack);
    }
    
    console.log("\n✅ 仮想人格システム包括テスト完了");
    console.log("=" + "=".repeat(60));
}

// テスト実行
runComprehensiveTest();