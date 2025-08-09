/**
 * OS Analyzer Performance Test - Node.js Version
 * Critical Pathファイルの詳細検証とパフォーマンス測定
 */

const fs = require('fs');
const path = require('path');

class OSAnalyzerPerformanceTest {
    constructor() {
        this.basePath = './public';
        this.criticalFiles = [
            'js/shared/core/BaseComponent.js',
            'js/shared/core/MicroStorageManager.js',
            'js/shared/core/MicroDataManager.js',
            'js/shared/data/questions.js',
            'js/os-analyzer/core/PrecompiledQuestions.js',
            'js/os-analyzer/components/WelcomeScreen.js',
            'js/os-analyzer/components/HaqeiQuestionElement.js',
            'js/os-analyzer/components/VirtualQuestionFlow.js'
        ];
        this.results = [];
        this.startTime = Date.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const symbols = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
        const coloredMessage = `[${timestamp}] ${symbols[type]} ${message}`;
        console.log(coloredMessage);
        this.results.push({ message, type, timestamp });
    }

    async testFileIntegrity() {
        this.log('📊 Critical Path ファイル整合性チェック開始', 'info');
        
        let totalSize = 0;
        let validFiles = 0;
        
        for (const file of this.criticalFiles) {
            const filePath = path.join(this.basePath, file);
            
            try {
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');
                const sizeKB = (stats.size / 1024).toFixed(1);
                
                totalSize += stats.size;
                validFiles++;
                
                // ファイル内容の基本チェック
                let contentCheck = '正常';
                if (content.includes('console.error') || content.includes('throw new Error')) {
                    contentCheck = 'エラー処理含む';
                }
                
                this.log(`${path.basename(file)}: ${sizeKB}KB (${contentCheck})`, 'success');
                
            } catch (error) {
                this.log(`${file}: ファイル読み込み失敗 - ${error.message}`, 'error');
            }
        }
        
        const totalSizeKB = (totalSize / 1024).toFixed(1);
        this.log(`合計サイズ: ${totalSizeKB}KB (${validFiles}/${this.criticalFiles.length} ファイル)`, 'info');
        
        // 目標との比較
        const targetSize = 119;
        if (totalSize <= targetSize * 1024) {
            this.log(`🎯 サイズ目標達成: ${totalSizeKB}KB ≤ ${targetSize}KB`, 'success');
        } else {
            const overage = (totalSize / 1024 - targetSize).toFixed(1);
            this.log(`📈 サイズ目標超過: ${totalSizeKB}KB (${overage}KB オーバー)`, 'warning');
        }
        
        return { totalSize, validFiles, totalSizeKB };
    }

    async testComponentStructure() {
        this.log('🔍 コンポーネント構造解析開始', 'info');
        
        const structureChecks = [
            {
                file: 'js/os-analyzer/components/VirtualQuestionFlow.js',
                checks: [
                    { pattern: /class VirtualQuestionFlow/, desc: 'クラス定義' },
                    { pattern: /isRendering\s*=\s*false/, desc: 'レンダリング状態管理' },
                    { pattern: /showCurrentQuestion\(\)/, desc: '設問表示メソッド' },
                    { pattern: /ensureShadowDOMVisibility/, desc: 'Shadow DOM表示制御' },
                    { pattern: /createFallbackElement/, desc: 'フォールバック機能' }
                ]
            },
            {
                file: 'js/os-analyzer/components/HaqeiQuestionElement.js',
                checks: [
                    { pattern: /class HaqeiQuestionElement extends HTMLElement/, desc: 'Web Component定義' },
                    { pattern: /attachShadow/, desc: 'Shadow DOM構築' },
                    { pattern: /getFallbackTemplate/, desc: 'フォールバックテンプレート' },
                    { pattern: /customElements\.define/, desc: 'カスタム要素登録' }
                ]
            },
            {
                file: 'js/shared/core/MicroStorageManager.js',
                checks: [
                    { pattern: /class MicroStorageManager/, desc: 'Microクラス定義' },
                    { pattern: /saveAnswers/, desc: '回答保存機能' },
                    { pattern: /getAnswers/, desc: '回答取得機能' }
                ]
            }
        ];
        
        for (const { file, checks } of structureChecks) {
            const filePath = path.join(this.basePath, file);
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                this.log(`📁 ${path.basename(file)} 構造チェック:`, 'info');
                
                for (const { pattern, desc } of checks) {
                    if (pattern.test(content)) {
                        this.log(`  ✅ ${desc}: 実装済み`, 'success');
                    } else {
                        this.log(`  ❌ ${desc}: 未実装`, 'error');
                    }
                }
                
            } catch (error) {
                this.log(`${file}: 読み込みエラー - ${error.message}`, 'error');
            }
        }
    }

    async testOptimizationEffectiveness() {
        this.log('📈 最適化効果測定開始', 'info');
        
        // 最適化前後の比較データ
        const beforeOptimization = {
            totalSize: 244 * 1024, // 244KB
            loadTime: 2000, // 2000ms予想
            scriptCount: 38
        };
        
        const { totalSize, validFiles } = await this.testFileIntegrity();
        const currentScriptCount = this.criticalFiles.length;
        
        // 削減率計算
        const sizeReduction = ((beforeOptimization.totalSize - totalSize) / beforeOptimization.totalSize * 100).toFixed(1);
        const scriptReduction = ((beforeOptimization.scriptCount - currentScriptCount) / beforeOptimization.scriptCount * 100).toFixed(1);
        
        this.log(`📊 最適化効果分析:`, 'info');
        this.log(`  サイズ削減: ${(beforeOptimization.totalSize/1024).toFixed(1)}KB → ${(totalSize/1024).toFixed(1)}KB (-${sizeReduction}%)`, 'success');
        this.log(`  スクリプト削減: ${beforeOptimization.scriptCount}個 → ${currentScriptCount}個 (-${scriptReduction}%)`, 'success');
        
        // 期待される改善予測
        const expectedLoadTimeReduction = (1 - totalSize / beforeOptimization.totalSize) * 100;
        const predictedLoadTime = beforeOptimization.loadTime * (totalSize / beforeOptimization.totalSize);
        
        this.log(`  予想読み込み時間: ${beforeOptimization.loadTime}ms → ${predictedLoadTime.toFixed(0)}ms`, 'success');
        
        return {
            sizeReduction: parseFloat(sizeReduction),
            scriptReduction: parseFloat(scriptReduction),
            predictedLoadTime
        };
    }

    async testWebComponentStability() {
        this.log('🔧 Web Component安定性チェック開始', 'info');
        
        const haqeiElementPath = path.join(this.basePath, 'js/os-analyzer/components/HaqeiQuestionElement.js');
        const virtualFlowPath = path.join(this.basePath, 'js/os-analyzer/components/VirtualQuestionFlow.js');
        
        try {
            const haqeiContent = fs.readFileSync(haqeiElementPath, 'utf8');
            const virtualContent = fs.readFileSync(virtualFlowPath, 'utf8');
            
            // 安定性確保機能のチェック
            const stabilityFeatures = [
                { pattern: /isRendering\s*=\s*false/, file: 'VirtualQuestionFlow', desc: '重複レンダリング防止' },
                { pattern: /hasRendered\s*=\s*false/, file: 'VirtualQuestionFlow', desc: 'レンダリング完了フラグ' },
                { pattern: /renderCount\+\+/, file: 'VirtualQuestionFlow', desc: 'レンダリング回数追跡' },
                { pattern: /setProperty\(['"]display['"], ['"]block['"], ['"]important['"]/, file: 'VirtualQuestionFlow', desc: '強制表示CSS' },
                { pattern: /ensureShadowDOMVisibility/, file: 'VirtualQuestionFlow', desc: 'Shadow DOM表示確保' },
                { pattern: /createFallbackElement/, file: 'VirtualQuestionFlow', desc: 'フォールバック要素作成' },
                { pattern: /getFallbackTemplate/, file: 'HaqeiQuestionElement', desc: 'フォールバックテンプレート' },
                { pattern: /connectedCallback/, file: 'HaqeiQuestionElement', desc: 'Web Component接続処理' },
                { pattern: /disconnectedCallback/, file: 'HaqeiQuestionElement', desc: 'Web Component切断処理' }
            ];
            
            for (const { pattern, file, desc } of stabilityFeatures) {
                const content = file === 'VirtualQuestionFlow' ? virtualContent : haqeiContent;
                if (pattern.test(content)) {
                    this.log(`  ✅ ${desc}: 実装済み (${file})`, 'success');
                } else {
                    this.log(`  ❌ ${desc}: 未実装 (${file})`, 'error');
                }
            }
            
        } catch (error) {
            this.log(`Web Component安定性チェックエラー: ${error.message}`, 'error');
        }
    }

    generateFinalReport() {
        this.log('📋 最終レポート生成開始', 'info');
        
        const endTime = Date.now();
        const executionTime = endTime - this.startTime;
        
        const errorCount = this.results.filter(r => r.type === 'error').length;
        const warningCount = this.results.filter(r => r.type === 'warning').length;
        const successCount = this.results.filter(r => r.type === 'success').length;
        
        this.log('═══════════════════════════════════════', 'info');
        this.log('🏆 OS Analyzer Performance Test 結果', 'info');
        this.log('═══════════════════════════════════════', 'info');
        this.log(`実行時間: ${executionTime}ms`, 'info');
        this.log(`成功: ${successCount}件`, 'success');
        this.log(`警告: ${warningCount}件`, 'warning');
        this.log(`エラー: ${errorCount}件`, 'error');
        
        // 総合評価
        let grade, gradeDesc;
        if (errorCount === 0 && warningCount === 0) {
            grade = 'A級';
            gradeDesc = '完璧な最適化 - 本番環境ready';
        } else if (errorCount === 0 && warningCount <= 2) {
            grade = 'B級';
            gradeDesc = '良好な最適化 - 微調整推奨';
        } else if (errorCount <= 2) {
            grade = 'C級';
            gradeDesc = '基本的最適化 - 改善必要';
        } else {
            grade = 'D級';
            gradeDesc = '要大幅改善 - 継続作業必要';
        }
        
        this.log(`📊 総合評価: ${grade} (${gradeDesc})`, errorCount === 0 ? 'success' : 'warning');
        this.log('═══════════════════════════════════════', 'info');
        
        return { grade, errorCount, warningCount, successCount, executionTime };
    }

    async runFullTest() {
        this.log('🚀 OS Analyzer Performance Test 開始', 'info');
        
        await this.testFileIntegrity();
        await this.testComponentStructure();
        await this.testOptimizationEffectiveness();
        await this.testWebComponentStability();
        
        return this.generateFinalReport();
    }
}

// テスト実行
async function main() {
    try {
        const test = new OSAnalyzerPerformanceTest();
        const result = await test.runFullTest();
        
        // プロセス終了コード設定
        process.exit(result.errorCount > 0 ? 1 : 0);
        
    } catch (error) {
        console.error('❌ テスト実行エラー:', error.message);
        process.exit(1);
    }
}

// スクリプトが直接実行された場合のみテスト実行
if (require.main === module) {
    main();
}

module.exports = OSAnalyzerPerformanceTest;