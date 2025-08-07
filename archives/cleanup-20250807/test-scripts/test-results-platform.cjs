/**
 * Results仮想人格対話プラットフォーム包括テスト
 * 
 * 目的：
 * - VirtualPersonaResultsViewの機能確認
 * - 対話システムの動作検証
 * - レスポンシブ対応の確認
 * - bunenjin哲学統合の検証
 * 
 * 処理内容：
 * 1. Results HTMLページの構造解析
 * 2. VirtualPersonaResultsViewコンポーネントのテスト
 * 3. 対話システム機能の確認
 * 4. レスポンシブUI要素の検証
 * 
 * 出力：
 * - プラットフォーム機能テスト結果
 * - 問題点の詳細分析
 * 
 * 副作用：
 * - テスト結果のコンソール出力
 * - 問題検出時の詳細ログ
 * 
 * 前提条件：
 * - public/results.html が存在する
 * - VirtualPersonaResultsView.js が利用可能
 * - 必要なCSSファイルが存在する
 */

const fs = require('fs');
const path = require('path');

console.log("🎭 Results仮想人格対話プラットフォーム包括テスト開始...");

/**
 * Results HTMLページ構造解析
 * 
 * 目的：
 * - HTMLファイルの基本構造確認
 * - 必要なスクリプトタグの存在確認
 * - CSSリンクの妥当性確認
 * 
 * 入力：
 * - htmlPath: string - HTMLファイルのパス
 * 
 * 処理内容：
 * 1. HTMLファイルの読み込み
 * 2. 基本要素の存在確認
 * 3. スクリプトタグの検証
 * 4. CSS依存関係の確認
 * 
 * 出力：
 * - Object: 構造解析結果
 * 
 * エラー処理：
 * - ファイル読み込みエラーの適切な処理
 * - 構造不正時の詳細報告
 */
function analyzeResultsHTMLStructure(htmlPath) {
    console.log("📄 Results HTML構造解析開始...");
    
    const results = {
        fileExists: false,
        hasBasicStructure: false,
        scriptsCount: 0,
        cssLinksCount: 0,
        virtualPersonaElements: [],
        issues: [],
        details: []
    };
    
    try {
        // ファイル存在確認
        if (!fs.existsSync(htmlPath)) {
            results.issues.push(`HTMLファイルが見つかりません: ${htmlPath}`);
            return results;
        }
        
        results.fileExists = true;
        results.details.push("✅ HTMLファイル存在確認");
        
        // HTMLコンテンツ読み込み
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        
        // 基本構造確認
        if (htmlContent.includes('<html') && 
            htmlContent.includes('<head>') && 
            htmlContent.includes('<body>')) {
            results.hasBasicStructure = true;
            results.details.push("✅ 基本HTML構造確認");
        } else {
            results.issues.push("基本HTML構造が不完全");
        }
        
        // スクリプトタグ確認
        const scriptMatches = htmlContent.match(/<script[^>]*>/g) || [];
        results.scriptsCount = scriptMatches.length;
        results.details.push(`📊 スクリプトタグ数: ${results.scriptsCount}`);
        
        // Chart.js確認
        if (htmlContent.includes('Chart.js') || htmlContent.includes('chart.min.js')) {
            results.details.push("✅ Chart.js依存関係確認");
        } else {
            results.issues.push("Chart.js依存関係が見つからない");
        }
        
        // CSSリンク確認
        const cssMatches = htmlContent.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || [];
        results.cssLinksCount = cssMatches.length;
        results.details.push(`🎨 CSSリンク数: ${results.cssLinksCount}`);
        
        // 仮想人格関連要素確認
        const virtualPersonaPatterns = [
            'virtual-persona',
            'persona-results',
            'dialogue-player',
            'os-voice-switcher',
            'personality-construction'
        ];
        
        virtualPersonaPatterns.forEach(pattern => {
            if (htmlContent.includes(pattern)) {
                results.virtualPersonaElements.push(pattern);
            }
        });
        
        results.details.push(`🎭 仮想人格要素: ${results.virtualPersonaElements.length}個検出`);
        
        // 特定の重要要素確認
        const criticalElements = [
            { name: 'loading-overlay', required: true },
            { name: 'virtual-persona-container', required: true },
            { name: 'dialogue-interface', required: false },
            { name: 'personality-cards', required: false }
        ];
        
        criticalElements.forEach(element => {
            if (htmlContent.includes(element.name)) {
                results.details.push(`✅ 重要要素確認: ${element.name}`);
            } else if (element.required) {
                results.issues.push(`必須要素未検出: ${element.name}`);
            } else {
                results.details.push(`⚠️ オプション要素未検出: ${element.name}`);
            }
        });
        
    } catch (error) {
        results.issues.push(`HTML解析エラー: ${error.message}`);
    }
    
    return results;
}

/**
 * VirtualPersonaResultsViewコンポーネントテスト
 * 
 * 目的：
 * - JavaScriptファイルの存在確認
 * - コンポーネント構造の分析
 * - 関数・メソッドの確認
 * 
 * 入力：
 * - jsPath: string - JavaScriptファイルのパス
 * 
 * 処理内容：
 * 1. JSファイルの読み込み
 * 2. クラス定義の確認
 * 3. 主要メソッドの存在確認
 * 4. bunenjin哲学統合の確認
 * 
 * 出力：
 * - Object: コンポーネントテスト結果
 */
function testVirtualPersonaResultsViewComponent(jsPath) {
    console.log("🔧 VirtualPersonaResultsViewコンポーネントテスト開始...");
    
    const results = {
        fileExists: false,
        hasClassDefinition: false,
        methods: [],
        bunenjinIntegration: false,
        issues: [],
        details: []
    };
    
    try {
        if (!fs.existsSync(jsPath)) {
            results.issues.push(`JSファイルが見つかりません: ${jsPath}`);
            return results;
        }
        
        results.fileExists = true;
        results.details.push("✅ JSファイル存在確認");
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // クラス定義確認
        if (jsContent.includes('class VirtualPersonaResultsView')) {
            results.hasClassDefinition = true;
            results.details.push("✅ VirtualPersonaResultsViewクラス定義確認");
        } else {
            results.issues.push("VirtualPersonaResultsViewクラス定義が見つかりません");
        }
        
        // 主要メソッド確認
        const expectedMethods = [
            'constructor',
            'init',
            'buildInterface',
            'generateVirtualPersona',
            'setupInteractions',
            'handleOSVoiceSwitch',
            'playDialogue',
            'updatePersonalityView'
        ];
        
        expectedMethods.forEach(method => {
            if (jsContent.includes(`${method}(`)) {
                results.methods.push(method);
                results.details.push(`✅ メソッド確認: ${method}`);
            } else {
                results.details.push(`⚠️ メソッド未検出: ${method}`);
            }
        });
        
        // bunenjin哲学統合確認
        const philosophyKeywords = [
            'bunenjin',
            'Triple OS',
            '易経',
            'I Ching',
            'hexagram',
            'OS相互作用'
        ];
        
        let philosophyMatches = 0;
        philosophyKeywords.forEach(keyword => {
            if (jsContent.includes(keyword)) {
                philosophyMatches++;
            }
        });
        
        if (philosophyMatches >= 3) {
            results.bunenjinIntegration = true;
            results.details.push(`✅ bunenjin哲学統合確認 (${philosophyMatches}個のキーワード)`);
        } else {
            results.details.push(`⚠️ bunenjin哲学統合不完全 (${philosophyMatches}個のキーワード)`);
        }
        
        // エラーハンドリング確認
        const errorHandlingPatterns = ['try', 'catch', 'throw', 'error'];
        let errorHandlingCount = 0;
        errorHandlingPatterns.forEach(pattern => {
            const matches = (jsContent.match(new RegExp(pattern, 'gi')) || []).length;
            errorHandlingCount += matches;
        });
        
        results.details.push(`🛡️ エラーハンドリング: ${errorHandlingCount}箇所`);
        
    } catch (error) {
        results.issues.push(`JSコンポーネント解析エラー: ${error.message}`);
    }
    
    return results;
}

/**
 * 対話システム機能確認
 * 
 * 目的：
 * - DialoguePlayer関連ファイルの確認
 * - OSVoiceSwitcher機能の確認
 * - PersonalityConstructionView機能の確認
 * 
 * 処理内容：
 * 1. 関連JSファイルの存在確認
 * 2. 対話システム構成要素の分析
 * 3. 統合性の確認
 */
function testDialogueSystemComponents() {
    console.log("💬 対話システム機能確認開始...");
    
    const results = {
        components: {},
        totalFiles: 0,
        existingFiles: 0,
        issues: [],
        details: []
    };
    
    const dialogueComponents = [
        'public/js/components/VirtualPersonaResultsView.js',
        'public/js/os-analyzer/components/DialoguePlayer.js',
        'public/js/os-analyzer/components/OSVoiceSwitcher.js',
        'public/js/os-analyzer/components/PersonalityConstructionView.js',
        'public/js/os-analyzer/core/VirtualPersonaEngine.js',
        'public/js/os-analyzer/core/OSInteractionSimulator.js'
    ];
    
    results.totalFiles = dialogueComponents.length;
    
    dialogueComponents.forEach(filePath => {
        const componentName = path.basename(filePath, '.js');
        const exists = fs.existsSync(filePath);
        
        results.components[componentName] = {
            exists: exists,
            path: filePath,
            issues: []
        };
        
        if (exists) {
            results.existingFiles++;
            results.details.push(`✅ ${componentName}ファイル存在確認`);
            
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                
                // 基本的な機能チェック
                if (componentName.includes('DialoguePlayer')) {
                    if (content.includes('playDialogue') || content.includes('dialogue')) {
                        results.details.push(`✅ ${componentName}: 対話機能確認`);
                    } else {
                        results.components[componentName].issues.push('対話機能未検出');
                    }
                }
                
                if (componentName.includes('OSVoiceSwitcher')) {
                    if (content.includes('switchVoice') || content.includes('voice')) {
                        results.details.push(`✅ ${componentName}: 音声切り替え機能確認`);
                    } else {
                        results.components[componentName].issues.push('音声切り替え機能未検出');
                    }
                }
                
                if (componentName.includes('PersonalityConstruction')) {
                    if (content.includes('construct') || content.includes('personality')) {
                        results.details.push(`✅ ${componentName}: 人格構築機能確認`);
                    } else {
                        results.components[componentName].issues.push('人格構築機能未検出');
                    }
                }
                
            } catch (error) {
                results.components[componentName].issues.push(`読み込みエラー: ${error.message}`);
            }
        } else {
            results.issues.push(`必須ファイル未検出: ${filePath}`);
        }
    });
    
    const completeness = (results.existingFiles / results.totalFiles) * 100;
    results.details.push(`📊 システム完成度: ${completeness.toFixed(1)}% (${results.existingFiles}/${results.totalFiles})`);
    
    return results;
}

// メインテスト実行
async function runResultsPlatformTest() {
    console.log("=" + "=".repeat(70));
    console.log("🎭 HAQEI Results仮想人格対話プラットフォーム包括テスト");
    console.log("=" + "=".repeat(70));
    
    try {
        // Phase 1: HTML構造解析
        const htmlResults = analyzeResultsHTMLStructure('./public/results.html');
        console.log("\n📄 Results HTML構造解析結果:");
        console.log(`   ファイル存在: ${htmlResults.fileExists ? '✅' : '❌'}`);
        console.log(`   基本構造: ${htmlResults.hasBasicStructure ? '✅' : '❌'}`);
        console.log(`   スクリプト数: ${htmlResults.scriptsCount}`);
        console.log(`   CSS数: ${htmlResults.cssLinksCount}`);
        console.log(`   仮想人格要素: ${htmlResults.virtualPersonaElements.length}個`);
        console.log(`   問題数: ${htmlResults.issues.length}`);
        
        if (htmlResults.issues.length > 0) {
            console.log("   問題詳細:");
            htmlResults.issues.forEach(issue => console.log(`     ❌ ${issue}`));
        }
        
        // Phase 2: VirtualPersonaResultsViewコンポーネントテスト
        const componentResults = testVirtualPersonaResultsViewComponent('./public/js/components/VirtualPersonaResultsView.js');
        console.log("\n🔧 VirtualPersonaResultsViewコンポーネントテスト結果:");
        console.log(`   ファイル存在: ${componentResults.fileExists ? '✅' : '❌'}`);
        console.log(`   クラス定義: ${componentResults.hasClassDefinition ? '✅' : '❌'}`);
        console.log(`   メソッド数: ${componentResults.methods.length}`);
        console.log(`   bunenjin統合: ${componentResults.bunenjinIntegration ? '✅' : '⚠️'}`);
        console.log(`   問題数: ${componentResults.issues.length}`);
        
        // Phase 3: 対話システム機能確認
        const dialogueResults = testDialogueSystemComponents();
        console.log("\n💬 対話システム機能確認結果:");
        console.log(`   総ファイル数: ${dialogueResults.totalFiles}`);
        console.log(`   存在ファイル数: ${dialogueResults.existingFiles}`);
        console.log(`   システム完成度: ${((dialogueResults.existingFiles / dialogueResults.totalFiles) * 100).toFixed(1)}%`);
        console.log(`   問題数: ${dialogueResults.issues.length}`);
        
        // 総合評価
        console.log("\n📋 総合評価:");
        const htmlScore = htmlResults.fileExists && htmlResults.hasBasicStructure ? 1 : 0;
        const componentScore = componentResults.fileExists && componentResults.hasClassDefinition ? 1 : 0;
        const dialogueScore = dialogueResults.existingFiles / dialogueResults.totalFiles;
        const overallScore = ((htmlScore + componentScore + dialogueScore) / 3) * 100;
        
        console.log(`   プラットフォーム統合度: ${overallScore.toFixed(1)}%`);
        console.log(`   品質レベル: ${overallScore >= 90 ? 'A級' : overallScore >= 75 ? 'B級' : overallScore >= 60 ? 'C級' : '要改善'}`);
        console.log(`   bunenjin哲学適合: ${componentResults.bunenjinIntegration ? '完全適合' : '要調整'}`);
        
        // 推奨改善事項
        const allIssues = [...htmlResults.issues, ...componentResults.issues, ...dialogueResults.issues];
        if (allIssues.length > 0) {
            console.log("\n🔧 推奨改善事項:");
            allIssues.forEach(issue => console.log(`   • ${issue}`));
        }
        
    } catch (error) {
        console.error("❌ テスト実行中にエラーが発生しました:", error);
    }
    
    console.log("\n✅ Results仮想人格対話プラットフォーム包括テスト完了");
    console.log("=" + "=".repeat(70));
}

// テスト実行
runResultsPlatformTest();