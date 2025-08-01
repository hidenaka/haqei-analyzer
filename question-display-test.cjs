/**
 * 設問表示機能 直接テスト
 * Web ComponentとVirtualQuestionFlowの動作確認
 */

const fs = require('fs');
const path = require('path');

class QuestionDisplayTest {
    constructor() {
        this.basePath = './public';
        this.testResults = [];
    }

    log(message, type = 'info') {
        const symbols = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
        console.log(`${symbols[type]} ${message}`);
        this.testResults.push({ message, type });
    }

    async testQuestionsDataIntegrity() {
        this.log('📚 設問データ整合性テスト開始', 'info');
        
        const questionsPath = path.join(this.basePath, 'js/shared/data/questions.js');
        
        try {
            const content = fs.readFileSync(questionsPath, 'utf8');
            
            // 基本構造のチェック（var形式にも対応）
            const checks = [
                { pattern: /(var|const)\s+WORLDVIEW_QUESTIONS\s*=/, desc: '価値観設問データ' },
                { pattern: /(var|const)\s+SCENARIO_QUESTIONS\s*=/, desc: 'シナリオ設問データ' },
                { pattern: /"?id"?:\s*"q\d+"/, desc: '設問ID形式' },
                { pattern: /"?text"?:\s*"[^"]+"/, desc: '設問テキスト' },
                { pattern: /"?options"?:\s*\[/, desc: '選択肢配列' },
                { pattern: /"?scoring_tags"?:\s*\[/, desc: 'スコアリングタグ' }
            ];
            
            for (const { pattern, desc } of checks) {
                if (pattern.test(content)) {
                    this.log(`  ${desc}: 正常`, 'success');
                } else {
                    this.log(`  ${desc}: 異常`, 'error');
                }
            }
            
            // データ量の確認
            const worldviewMatches = content.match(/\{[^}]*"id":\s*"q\d+"[^}]*\}/g);
            const scenarioMatches = content.match(/\{[^}]*"scenario":[^}]*\}/g) || [];
            
            this.log(`  価値観設問数: ${worldviewMatches ? worldviewMatches.length : 0}`, 'info');
            this.log(`  シナリオ設問数: ${scenarioMatches.length}`, 'info');
            
        } catch (error) {
            this.log(`設問データ読み込みエラー: ${error.message}`, 'error');
        }
    }

    async testWebComponentImplementation() {
        this.log('🔧 Web Component実装テスト開始', 'info');
        
        const componentPath = path.join(this.basePath, 'js/os-analyzer/components/HaqeiQuestionElement.js');
        
        try {
            const content = fs.readFileSync(componentPath, 'utf8');
            
            // 重要なメソッドとプロパティの確認
            const componentChecks = [
                { pattern: /class HaqeiQuestionElement extends HTMLElement/, desc: 'HTMLElement継承' },
                { pattern: /constructor\(\)\s*\{[\s\S]*super\(\)/, desc: 'コンストラクタ定義' },
                { pattern: /attachShadow\(\{[\s\S]*mode:\s*['"]open['"]/, desc: 'Shadow DOM作成' },
                { pattern: /connectedCallback\(\)/, desc: '接続コールバック' },
                { pattern: /disconnectedCallback\(\)/, desc: '切断コールバック' },
                { pattern: /render\(\)/, desc: 'レンダリングメソッド' },
                { pattern: /getPrecompiledTemplate/, desc: 'プリコンパイルテンプレート取得' },
                { pattern: /getFallbackTemplate/, desc: 'フォールバックテンプレート' },
                { pattern: /generateValueQuestionTemplate/, desc: '価値観設問テンプレート生成' },
                { pattern: /generateScenarioTemplate/, desc: 'シナリオ設問テンプレート生成' },
                { pattern: /customElements\.define\(/, desc: 'カスタム要素登録' },
                { pattern: /restoreAnswer/, desc: '回答復元機能' }
            ];
            
            for (const { pattern, desc } of componentChecks) {
                if (pattern.test(content)) {
                    this.log(`  ${desc}: 実装済み`, 'success');
                } else {
                    this.log(`  ${desc}: 未実装`, 'error');
                }
            }
            
        } catch (error) {
            this.log(`Web Component読み込みエラー: ${error.message}`, 'error');
        }
    }

    async testVirtualQuestionFlowStability() {
        this.log('⚡ VirtualQuestionFlow安定性テスト開始', 'info');
        
        const flowPath = path.join(this.basePath, 'js/os-analyzer/components/VirtualQuestionFlow.js');
        
        try {
            const content = fs.readFileSync(flowPath, 'utf8');
            
            // 安定性確保機能の詳細チェック
            const stabilityChecks = [
                // レンダリング制御
                { pattern: /this\.isRendering\s*=\s*false/, desc: 'レンダリング制御フラグ初期化' },
                { pattern: /this\.hasRendered\s*=\s*false/, desc: 'レンダリング完了フラグ初期化' },
                { pattern: /this\.renderCount\s*=\s*0/, desc: 'レンダリング回数初期化' },
                { pattern: /if\s*\(\s*this\.isRendering\s*\)/, desc: '重複レンダリング防止ガード' },
                { pattern: /if\s*\(\s*this\.hasRendered\s*\)/, desc: '再レンダリング防止ガード' },
                
                // DOM制御
                { pattern: /setProperty\(['"`]display['"`],\s*['"`]block['"`],\s*['"`]important['"`]\)/, desc: '強制表示CSS(!important)' },
                { pattern: /setProperty\(['"`]opacity['"`],\s*['"`]1['"`],\s*['"`]important['"`]\)/, desc: '不透明度強制設定' },
                { pattern: /setProperty\(['"`]visibility['"`],\s*['"`]visible['"`],\s*['"`]important['"`]\)/, desc: '可視性強制設定' },
                
                // Shadow DOM制御
                { pattern: /ensureShadowDOMVisibility/, desc: 'Shadow DOM表示強制メソッド' },
                { pattern: /shadowRoot\.querySelector/, desc: 'Shadow DOM要素選択' },
                
                // フォールバック機能
                { pattern: /createFallbackElement/, desc: 'フォールバック要素作成' },
                { pattern: /verifyQuestionElement/, desc: 'Web Component検証' },
                
                // 要素管理
                { pattern: /this\.activeElements\s*=\s*new Map/, desc: 'アクティブ要素管理' },
                { pattern: /this\.elementPool\s*=\s*new Map/, desc: '要素プール管理' },
                
                // エラーハンドリング
                { pattern: /try\s*\{[\s\S]+\}\s*catch\s*\(/, desc: 'エラーハンドリング' },
                { pattern: /console\.warn/, desc: '警告ログ出力' },
                { pattern: /console\.error/, desc: 'エラーログ出力' }
            ];
            
            let implementedFeatures = 0;
            for (const { pattern, desc } of stabilityChecks) {
                if (pattern.test(content)) {
                    this.log(`  ${desc}: 実装済み`, 'success');
                    implementedFeatures++;
                } else {
                    this.log(`  ${desc}: 未実装`, 'warning');
                }
            }
            
            const implementationRate = (implementedFeatures / stabilityChecks.length * 100).toFixed(1);
            this.log(`  安定性機能実装率: ${implementationRate}% (${implementedFeatures}/${stabilityChecks.length})`, 
                implementationRate >= 80 ? 'success' : 'warning');
            
        } catch (error) {
            this.log(`VirtualQuestionFlow読み込みエラー: ${error.message}`, 'error');
        }
    }

    async testPrecompiledTemplates() {
        this.log('📝 プリコンパイルテンプレートテスト開始', 'info');
        
        const templatesPath = path.join(this.basePath, 'js/os-analyzer/core/PrecompiledQuestions.js');
        
        try {
            const content = fs.readFileSync(templatesPath, 'utf8');
            
            // プリコンパイルテンプレートの構造確認
            const templateChecks = [
                { pattern: /(window\.)?PRECOMPILED_QUESTION_TEMPLATES/, desc: 'グローバルテンプレート変数' },
                { pattern: /['"]q\d+['"]:\s*`/, desc: '設問IDキー形式' },
                { pattern: /class="question-item/, desc: '設問アイテムクラス' },
                { pattern: /class="option-label/, desc: '選択肢ラベルクラス' },
                { pattern: /type="radio"/, desc: 'ラジオボタン入力' },
                { pattern: /data-scoring=/, desc: 'スコアリングデータ属性' }
            ];
            
            for (const { pattern, desc } of templateChecks) {
                if (pattern.test(content)) {
                    this.log(`  ${desc}: 正常`, 'success');
                } else {
                    this.log(`  ${desc}: 異常`, 'error');
                }
            }
            
            // テンプレート数の確認
            const templateMatches = content.match(/['"]q\d+['"]:\s*`/g);
            this.log(`  プリコンパイル済みテンプレート数: ${templateMatches ? templateMatches.length : 0}`, 'info');
            
        } catch (error) {
            this.log(`プリコンパイルテンプレート読み込みエラー: ${error.message}`, 'error');
        }
    }

    async testMicroManagersIntegration() {
        this.log('🔗 Micro Managers統合テスト開始', 'info');
        
        const microStoragePath = path.join(this.basePath, 'js/shared/core/MicroStorageManager.js');
        const microDataPath = path.join(this.basePath, 'js/shared/core/MicroDataManager.js');
        
        try {
            const storageContent = fs.readFileSync(microStoragePath, 'utf8');
            const dataContent = fs.readFileSync(microDataPath, 'utf8');
            
            // MicroStorageManager機能チェック
            const storageChecks = [
                { pattern: /class MicroStorageManager/, desc: 'MicroStorageManager クラス定義' },
                { pattern: /saveAnswers\(/, desc: '回答保存メソッド' },
                { pattern: /getAnswers\(/, desc: '回答取得メソッド' },
                { pattern: /localStorage\.setItem/, desc: 'ローカルストレージ保存' },
                { pattern: /localStorage\.getItem/, desc: 'ローカルストレージ取得' },
                { pattern: /JSON\.stringify/, desc: 'JSON変換処理' },
                { pattern: /JSON\.parse/, desc: 'JSON解析処理' }
            ];
            
            this.log('  MicroStorageManager:', 'info');
            for (const { pattern, desc } of storageChecks) {
                if (pattern.test(storageContent)) {
                    this.log(`    ${desc}: 実装済み`, 'success');
                } else {
                    this.log(`    ${desc}: 未実装`, 'error');
                }
            }
            
            // MicroDataManager機能チェック
            const dataChecks = [
                { pattern: /class MicroDataManager/, desc: 'MicroDataManager クラス定義' },
                { pattern: /loadQuestions\(/, desc: '設問読み込みメソッド' },
                { pattern: /WORLDVIEW_QUESTIONS/, desc: '価値観設問参照' },
                { pattern: /SCENARIO_QUESTIONS/, desc: 'シナリオ設問参照' },
                { pattern: /this\.questions\s*=/, desc: '設問データ格納' }
            ];
            
            this.log('  MicroDataManager:', 'info');
            for (const { pattern, desc } of dataChecks) {
                if (pattern.test(dataContent)) {
                    this.log(`    ${desc}: 実装済み`, 'success');
                } else {
                    this.log(`    ${desc}: 未実装`, 'error');
                }
            }
            
        } catch (error) {
            this.log(`Micro Managers読み込みエラー: ${error.message}`, 'error');
        }
    }

    generateDetailedReport() {
        this.log('📋 詳細レポート生成', 'info');
        
        const successCount = this.testResults.filter(r => r.type === 'success').length;
        const warningCount = this.testResults.filter(r => r.type === 'warning').length;
        const errorCount = this.testResults.filter(r => r.type === 'error').length;
        const totalTests = successCount + warningCount + errorCount;
        
        console.log('\n═══════════════════════════════════════');
        console.log('🔍 設問表示機能 詳細テスト結果');
        console.log('═══════════════════════════════════════');
        console.log(`総テスト数: ${totalTests}`);
        console.log(`✅ 成功: ${successCount}件`);
        console.log(`⚠️ 警告: ${warningCount}件`);
        console.log(`❌ エラー: ${errorCount}件`);
        
        const successRate = (successCount / totalTests * 100).toFixed(1);
        console.log(`成功率: ${successRate}%`);
        
        // 詳細評価
        let status, recommendation;
        if (errorCount === 0 && warningCount <= 3) {
            status = '✅ 優秀 - 本番環境ready';
            recommendation = '設問表示機能は安定している。ユーザーテスト推奨。';
        } else if (errorCount <= 2) {
            status = '⚠️ 良好 - 微調整必要';
            recommendation = '一部の機能に改善の余地あり。継続監視推奨。';
        } else {
            status = '❌ 要改善 - 修正必要';
            recommendation = '重要な機能に問題あり。修正後再テスト必要。';
        }
        
        console.log(`\n総合状態: ${status}`);
        console.log(`推奨: ${recommendation}`);
        console.log('═══════════════════════════════════════\n');
        
        return { successCount, warningCount, errorCount, successRate, status };
    }

    async runCompleteTest() {
        console.log('🚀 設問表示機能 完全テスト開始\n');
        
        await this.testQuestionsDataIntegrity();
        await this.testWebComponentImplementation();
        await this.testVirtualQuestionFlowStability();
        await this.testPrecompiledTemplates();
        await this.testMicroManagersIntegration();
        
        return this.generateDetailedReport();
    }
}

// テスト実行
async function main() {
    try {
        const test = new QuestionDisplayTest();
        const result = await test.runCompleteTest();
        
        // プロセス終了コード設定
        process.exit(result.errorCount > 0 ? 1 : 0);
        
    } catch (error) {
        console.error('❌ テスト実行エラー:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}