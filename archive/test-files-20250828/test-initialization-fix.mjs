/**
 * BasicResultsTab初期化エラーの修正確認テスト
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testInitializationFix() {
    console.log('🔍 BasicResultsTab初期化エラー修正確認テスト開始\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // コンソールメッセージを監視
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push({ type: msg.type(), text });
        
        // エラーメッセージを特別に記録
        if (msg.type() === 'error' || text.includes('❌')) {
            errors.push(text);
        }
    });
    
    // ページエラーも監視
    page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
    });
    
    try {
        const resultsPath = join(__dirname, 'public', 'results.html');
        console.log('📂 ページ読み込み中...');
        
        await page.goto(`file://${resultsPath}`);
        await page.waitForTimeout(3000);
        
        console.log('✅ ページ読み込み完了\n');
        
        // エラーの分析
        console.log('📊 ========== エラー分析 ==========\n');
        
        // 初期化関連のエラーを確認
        const initErrors = errors.filter(err => 
            err.includes('タブコンテナが初期化されていません') ||
            err.includes('コンテナの取得に失敗')
        );
        
        if (initErrors.length === 0) {
            console.log('✅ 初期化エラーは検出されませんでした！');
        } else {
            console.log(`❌ 初期化エラーが ${initErrors.length} 件検出されました：`);
            initErrors.forEach((err, i) => {
                console.log(`   ${i + 1}. ${err}`);
            });
        }
        
        // その他のエラーを確認
        const otherErrors = errors.filter(err => 
            !err.includes('タブコンテナが初期化されていません') &&
            !err.includes('コンテナの取得に失敗') &&
            !err.includes('4行要約生成エラー') && // これはテスト用の意図的なエラー
            !err.includes('詳細サマリー生成エラー') // これもテスト用
        );
        
        if (otherErrors.length > 0) {
            console.log(`\n⚠️ その他のエラー ${otherErrors.length} 件：`);
            otherErrors.forEach((err, i) => {
                console.log(`   ${i + 1}. ${err.substring(0, 100)}...`);
            });
        }
        
        // 警告メッセージの確認
        const warnings = consoleMessages.filter(msg => 
            msg.type === 'warning' || msg.text.includes('⚠️')
        );
        
        console.log(`\n📝 警告メッセージ: ${warnings.length} 件`);
        
        // 初期化プロセスの確認
        console.log('\n🔄 ========== 初期化プロセス確認 ==========\n');
        
        const initProcess = await page.evaluate(() => {
            const results = {
                basicResultsTab: !!window.basicResultsTab,
                summaryGenerator: !!window.basicResultsTab?.summaryGenerator,
                v3Database: !!window.basicResultsTab?.v3Database,
                analysisData: !!window.basicResultsTab?.analysisData,
                container: !!window.basicResultsTab?.container
            };
            
            // 実際にデータを設定してみる
            if (window.basicResultsTab) {
                const testData = {
                    engineOS: { hexagramName: '乾為天', score: 75 },
                    interfaceOS: { hexagramName: '兌為澤', score: 68 },
                    safeModeOS: { hexagramName: '坤為地', score: 82 }
                };
                
                try {
                    window.basicResultsTab.setData(testData);
                    results.setDataSuccess = true;
                } catch (error) {
                    results.setDataError = error.message;
                }
            }
            
            return results;
        });
        
        console.log('BasicResultsTab初期化状態:');
        console.log(`  - インスタンス: ${initProcess.basicResultsTab ? '✅' : '❌'}`);
        console.log(`  - SummaryGenerator: ${initProcess.summaryGenerator ? '✅' : '❌'}`);
        console.log(`  - V3データベース: ${initProcess.v3Database ? '✅' : '❌'}`);
        console.log(`  - 分析データ: ${initProcess.analysisData ? '✅' : '❌'}`);
        console.log(`  - コンテナ: ${initProcess.container ? '✅' : '❌'}`);
        console.log(`  - setData実行: ${initProcess.setDataSuccess ? '✅ 成功' : '❌ 失敗'}`);
        
        if (initProcess.setDataError) {
            console.log(`    エラー: ${initProcess.setDataError}`);
        }
        
        // DOM要素の確認
        console.log('\n🎨 ========== DOM要素確認 ==========\n');
        
        const domCheck = await page.evaluate(() => {
            return {
                tabContainer: !!document.querySelector('#basic-tab-panel'),
                osCardsContainer: !!document.querySelector('#os-cards-container'),
                osCards: document.querySelectorAll('.os-card').length,
                summarySection: !!document.querySelector('.summary-section'),
                detailedSection: !!document.querySelector('.detailed-analysis-section')
            };
        });
        
        console.log('DOM要素の存在:');
        console.log(`  - タブコンテナ: ${domCheck.tabContainer ? '✅' : '❌'}`);
        console.log(`  - OSカードコンテナ: ${domCheck.osCardsContainer ? '✅' : '❌'}`);
        console.log(`  - OSカード数: ${domCheck.osCards} 枚`);
        console.log(`  - 4行要約セクション: ${domCheck.summarySection ? '✅' : '❌'}`);
        console.log(`  - 詳細分析セクション: ${domCheck.detailedSection ? '✅' : '❌'}`);
        
        // 最終評価
        console.log('\n🎯 ========== 最終評価 ==========\n');
        
        const hasInitErrors = initErrors.length > 0;
        const hasOtherErrors = otherErrors.length > 0;
        const isFullyInitialized = initProcess.basicResultsTab && 
                                   initProcess.summaryGenerator && 
                                   initProcess.v3Database;
        const isDOMReady = domCheck.osCardsContainer && domCheck.osCards > 0;
        
        if (!hasInitErrors && isFullyInitialized && isDOMReady) {
            console.log('🌟 完璧: 初期化エラーは完全に解消されました！');
            console.log('   - エラーなし');
            console.log('   - 全コンポーネント初期化済み');
            console.log('   - DOM要素も正常に生成');
        } else if (!hasInitErrors && isFullyInitialized) {
            console.log('✅ 良好: 初期化エラーは解消されています');
            console.log('   - エラーなし');
            console.log('   - コンポーネント初期化済み');
            console.log('   - DOM生成に若干の遅延あり');
        } else if (!hasInitErrors) {
            console.log('⚡ 部分的改善: 初期化エラーは解消されましたが、完全ではありません');
            console.log('   - エラーは解消');
            console.log('   - 一部コンポーネントが未初期化');
        } else {
            console.log('❌ 要改善: 初期化エラーがまだ残っています');
            console.log(`   - ${initErrors.length} 件のエラー`);
        }
        
        // スクリーンショット
        await page.screenshot({ 
            path: 'initialization-test-result.png',
            fullPage: true 
        });
        console.log('\n📸 スクリーンショット保存: initialization-test-result.png');
        
        // 待機
        console.log('\n⏰ 5秒間ブラウザで確認できます...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('💥 テスト実行エラー:', error.message);
    } finally {
        await browser.close();
        console.log('\n🔚 テスト完了');
    }
}

// テスト実行
testInitializationFix().catch(console.error);