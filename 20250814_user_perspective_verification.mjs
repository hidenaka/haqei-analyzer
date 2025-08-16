/**
 * ユーザー視点での動作確認テスト
 */

import { chromium } from 'playwright';

async function verifyUserExperience() {
    console.log('[USER TEST] ユーザー視点での動作確認開始');
    console.log('==========================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        // エラー監視
        const errors = [];
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });
        
        console.log('[USER TEST] Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        console.log('[USER TEST] ページ読み込み完了、8秒待機...');
        await page.waitForTimeout(8000);
        
        // 初期状態確認（ユーザーが最初に見るもの）
        const initialState = await page.evaluate(() => {
            return {
                pageTitle: document.title,
                hasTextarea: !!document.getElementById('situation-text'),
                hasAnalyzeButton: !!document.querySelector('.analyze-btn.primary'),
                buttonText: document.querySelector('.analyze-btn.primary')?.textContent?.trim(),
                placeholderText: document.getElementById('situation-text')?.placeholder?.substring(0, 50) + '...',
                statusText: document.querySelector('.status-text')?.textContent?.trim(),
                visibleContent: document.body.innerText.includes('状況分析'),
                scenariosVisible: document.querySelectorAll('.scenario-card').length > 0
            };
        });
        
        console.log('\\n[USER TEST] 初期画面確認:');
        console.log('===========================');
        console.log(`📄 ページタイトル: "${initialState.pageTitle}"`);
        console.log(`📝 テキスト入力欄: ${initialState.hasTextarea ? '✅ あり' : '❌ なし'}`);
        console.log(`🎯 分析ボタン: ${initialState.hasAnalyzeButton ? '✅ あり' : '❌ なし'}`);
        console.log(`📋 ボタンテキスト: "${initialState.buttonText}"`);
        console.log(`💭 プレースホルダー: "${initialState.placeholderText}"`);
        console.log(`📊 ステータス: "${initialState.statusText}"`);
        console.log(`👁️ 状況分析UI表示: ${initialState.visibleContent ? '✅' : '❌'}`);
        console.log(`🎴 初期シナリオカード: ${initialState.scenariosVisible ? '表示済み' : '非表示（正常）'}`);
        
        if (!initialState.hasTextarea || !initialState.hasAnalyzeButton) {
            throw new Error('必要なUI要素が不足しています');
        }
        
        // ユーザー操作シミュレーション
        console.log('\\n[USER TEST] ユーザー操作シミュレーション開始...');
        console.log('=============================================');
        
        // STEP 1: テキスト入力
        console.log('STEP 1: 悩み相談テキストを入力...');
        const userInput = '転職するか現職に留まるか迷っています。新しい環境での成長と、今の安定した収入のどちらを重視すべきでしょうか。将来的なキャリアも考えて判断したいです。';
        
        await page.fill('#situation-text', userInput);
        console.log(`✅ 入力完了: "${userInput.substring(0, 40)}..."`);
        
        // STEP 2: 分析ボタンクリック
        console.log('\\nSTEP 2: 「状況を分析する」ボタンをクリック...');
        await page.click('.analyze-btn.primary');
        console.log('✅ 分析ボタンクリック完了');
        
        // STEP 3: 分析処理の監視（ユーザー目線）
        console.log('\\nSTEP 3: 分析処理を監視（ユーザーが見る画面変化）...');
        
        let analysisCompleted = false;
        let scenariosAppeared = false;
        
        for (let i = 0; i < 15; i++) {
            await page.waitForTimeout(2000);
            
            const currentView = await page.evaluate(() => {
                return {
                    statusText: document.querySelector('.status-text')?.textContent?.trim() || 'ステータスなし',
                    scenarioCards: document.querySelectorAll('.scenario-card').length,
                    eightScenariosContainer: !!document.querySelector('.eight-scenarios-container'),
                    scenarioGrid: !!document.querySelector('.scenario-grid'),
                    threeStageHeader: !!document.querySelector('.three-stage-header'),
                    scenarioTitles: Array.from(document.querySelectorAll('.scenario-card .scenario-title')).map(el => el.textContent?.trim()).slice(0, 3),
                    visiblePhaseBlocks: document.querySelectorAll('.phase-block').length,
                    containerContent: document.getElementById('i-ching-container')?.innerHTML?.length || 0
                };
            });
            
            console.log(`  ⏱️ ${i*2}秒後:`)
            console.log(`    📊 ステータス: "${currentView.statusText}"`);
            console.log(`    🎴 シナリオカード: ${currentView.scenarioCards}枚`);
            console.log(`    📦 シナリオコンテナ: ${currentView.eightScenariosContainer ? '✅' : '❌'}`);
            console.log(`    🏷️ シナリオタイトル例: ${currentView.scenarioTitles.join(', ')}`);
            console.log(`    🔄 フェーズブロック: ${currentView.visiblePhaseBlocks}個`);
            
            if (currentView.statusText.includes('完了') && !analysisCompleted) {
                analysisCompleted = true;
                console.log('    → ✅ 分析完了を確認');
            }
            
            if (currentView.scenarioCards >= 8 && !scenariosAppeared) {
                scenariosAppeared = true;
                console.log('    → 🎉 8つのシナリオが表示されました！');
                break;
            }
            
            if (currentView.scenarioCards > 0) {
                console.log(`    → 📈 シナリオ表示進行中 (${currentView.scenarioCards}/${8})`);
            }
        }
        
        // STEP 4: 最終結果確認（ユーザーが最終的に見るもの）
        console.log('\\nSTEP 4: 最終結果確認（ユーザーの最終画面）...');
        console.log('==============================================');
        
        const finalUserView = await page.evaluate(() => {
            const scenarioCards = document.querySelectorAll('.scenario-card');
            const phaseBlocks = document.querySelectorAll('.phase-block');
            
            return {
                // 基本要素
                statusText: document.querySelector('.status-text')?.textContent?.trim(),
                totalScenarios: scenarioCards.length,
                totalPhaseBlocks: phaseBlocks.length,
                
                // UI構造
                hasMainTitle: !!document.querySelector('.three-stage-title'),
                mainTitle: document.querySelector('.three-stage-title')?.textContent?.trim(),
                hasSubtitle: !!document.querySelector('.three-stage-subtitle'),
                subtitle: document.querySelector('.three-stage-subtitle')?.textContent?.trim(),
                
                // シナリオ詳細
                scenarioTitles: Array.from(scenarioCards).map(card => 
                    card.querySelector('.scenario-title')?.textContent?.trim()
                ).filter(title => title),
                
                // タイムライン要素
                timelineElements: Array.from(phaseBlocks).map(block => ({
                    phase: block.querySelector('.phase-title')?.textContent?.trim(),
                    content: block.querySelector('.phase-content')?.textContent?.trim()?.substring(0, 30) + '...'
                })).slice(0, 6), // 最初の6個のフェーズ
                
                // 表示品質
                hasVisualStyling: !!document.querySelector('.scenario-card[style*="background"]') || 
                                 !!document.getElementById('eight-scenarios-styles'),
                contentLength: document.getElementById('i-ching-container')?.innerHTML?.length || 0,
                
                // インタラクティブ要素
                hasClickableCards: Array.from(scenarioCards).some(card => 
                    card.style.cursor === 'pointer' || card.classList.contains('clickable')
                ),
                
                // レスポンシブ対応
                isResponsive: !!document.querySelector('.scenario-grid[style*="grid"]') ||
                             !!document.querySelector('.scenario-grid')
            };
        });
        
        console.log('📊 最終ユーザー画面分析:');
        console.log('========================');
        console.log(`🎯 ステータス: "${finalUserView.statusText}"`);
        console.log(`🎴 表示シナリオ数: ${finalUserView.totalScenarios}枚`);
        console.log(`⏰ タイムライン要素: ${finalUserView.totalPhaseBlocks}個`);
        console.log('');
        console.log(`📋 メインタイトル: "${finalUserView.mainTitle}"`);
        console.log(`📋 サブタイトル: "${finalUserView.subtitle}"`);
        console.log('');
        console.log('🏷️ シナリオタイトル一覧:');
        finalUserView.scenarioTitles.forEach((title, index) => {
            console.log(`  ${index + 1}. ${title}`);
        });
        console.log('');
        console.log('⏰ タイムライン要素例:');
        finalUserView.timelineElements.forEach((element, index) => {
            console.log(`  Phase ${index + 1}: ${element.phase} - ${element.content}`);
        });
        console.log('');
        console.log(`🎨 ビジュアルスタイリング: ${finalUserView.hasVisualStyling ? '✅' : '❌'}`);
        console.log(`📱 レスポンシブ対応: ${finalUserView.isResponsive ? '✅' : '❌'}`);
        console.log(`📊 総コンテンツ量: ${finalUserView.contentLength.toLocaleString()}文字`);
        
        // 成功判定
        const userExperienceSuccess = 
            finalUserView.totalScenarios === 8 &&
            finalUserView.totalPhaseBlocks >= 24 &&
            finalUserView.statusText.includes('完了') &&
            finalUserView.scenarioTitles.length === 8 &&
            finalUserView.hasVisualStyling;
        
        console.log('\\n🎯 ユーザー体験評価:');
        console.log('==================');
        console.log(`✅ 8カード表示: ${finalUserView.totalScenarios === 8 ? '完璧' : '要改善'}`);
        console.log(`✅ タイムライン: ${finalUserView.totalPhaseBlocks >= 24 ? '完璧' : '要改善'}`);
        console.log(`✅ UI完成度: ${finalUserView.hasVisualStyling ? '高品質' : '要改善'}`);
        console.log(`✅ コンテンツ充実度: ${finalUserView.contentLength > 30000 ? '豊富' : '要改善'}`);
        
        console.log(`\\n[USER TEST] エラー発生数: ${errors.length}件`);
        if (errors.length > 0) {
            console.log('エラー詳細:');
            errors.forEach(error => console.log(`  ❌ ${error}`));
        }
        
        return {
            success: userExperienceSuccess,
            finalView: finalUserView,
            errors: errors.length,
            analysisCompleted,
            scenariosAppeared
        };
        
    } catch (error) {
        console.error('[USER TEST] テスト実行エラー:', error);
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        console.log('\\n[USER TEST] 最終確認のため20秒間ユーザー画面を表示...');
        await new Promise(resolve => setTimeout(resolve, 20000));
        await browser.close();
    }
}

// 実行
verifyUserExperience().then(result => {
    console.log('\\n🎉 ユーザー視点動作確認完了');
    console.log('=============================');
    
    if (result.success) {
        console.log('✅ ユーザー体験: 完璧');
        console.log('✅ 8カードシナリオシステム: 完全動作');
        console.log('✅ タイムライン表示: 正常表示');
        console.log('✅ UI品質: 高水準');
        console.log('');
        console.log('🎯 結論: システムはユーザーの期待通りに動作しています');
    } else {
        console.log('❌ ユーザー体験: 改善必要');
        if (result.error) {
            console.log(`Error: ${result.error}`);
        }
        console.log('→ ユーザーが期待する機能が正しく動作していません');
    }
    
}).catch(console.error);