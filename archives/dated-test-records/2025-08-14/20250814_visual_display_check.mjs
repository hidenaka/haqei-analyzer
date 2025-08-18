/**
 * ユーザー目線での表示要素詳細チェック
 * パッと見た時に表示されていない・おかしい要素を特定
 */

import { chromium } from 'playwright';

async function checkVisualDisplay() {
    console.log('👀 ユーザー目線での表示要素チェック開始');
    console.log('=======================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('🌐 Future Simulatorページにアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(5000);
        
        // 初期表示の詳細チェック
        console.log('\n📋 初期表示の詳細チェック');
        console.log('========================');
        
        const initialCheck = await page.evaluate(() => {
            // 基本的な要素存在チェック
            const elements = {
                // 入力関連
                textarea: document.getElementById('situation-text'),
                analyzeBtn: document.querySelector('.analyze-btn.primary'),
                quickBtn: document.querySelector('#quick-analysis-btn'),
                form: document.getElementById('situation-analysis-form'),
                
                // コンテナ関連
                mainContainer: document.getElementById('main-container'),
                ichingContainer: document.getElementById('i-ching-container'),
                resultsContainer: document.getElementById('resultsContainer'),
                
                // 表示要素
                statusIndicator: document.querySelector('.status-indicator'),
                statusText: document.querySelector('.status-text'),
                statusIcon: document.querySelector('.status-icon'),
                
                // スタイリング関連
                inputStyles: document.getElementById('input-section-styles'),
                
                // 既存の表示要素
                existingScenarios: document.querySelectorAll('.scenario-card'),
                existingPhases: document.querySelectorAll('.phase-block')
            };
            
            const checkVisibility = (element) => {
                if (!element) return { exists: false };
                
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                
                return {
                    exists: true,
                    visible: rect.width > 0 && rect.height > 0 && 
                            computedStyle.display !== 'none' && 
                            computedStyle.visibility !== 'hidden' &&
                            parseFloat(computedStyle.opacity) > 0,
                    rect: {
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        top: Math.round(rect.top),
                        left: Math.round(rect.left)
                    },
                    style: {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        position: computedStyle.position,
                        zIndex: computedStyle.zIndex
                    },
                    content: element.textContent?.trim().substring(0, 30) + '...' || '(no text)',
                    classes: element.className || '(no class)',
                    id: element.id || '(no id)'
                };
            };
            
            const results = {};
            for (const [key, element] of Object.entries(elements)) {
                if (key === 'existingScenarios' || key === 'existingPhases') {
                    results[key] = {
                        count: element.length,
                        items: Array.from(element).slice(0, 3).map(el => checkVisibility(el))
                    };
                } else {
                    results[key] = checkVisibility(element);
                }
            }
            
            // 全体的なレイアウト情報
            results.layout = {
                bodyScrollHeight: document.body.scrollHeight,
                bodyScrollWidth: document.body.scrollWidth,
                viewportHeight: window.innerHeight,
                viewportWidth: window.innerWidth,
                documentTitle: document.title,
                hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
                hasVerticalScroll: document.body.scrollHeight > window.innerHeight
            };
            
            return results;
        });
        
        // 結果の表示
        console.log('\n🎯 重要要素の表示状況:');
        console.log('===================');
        
        const criticalElements = ['textarea', 'analyzeBtn', 'form', 'mainContainer', 'ichingContainer'];
        criticalElements.forEach(key => {
            const element = initialCheck[key];
            const status = element.exists ? (element.visible ? '✅ 表示OK' : '❌ 非表示') : '❌ 存在しない';
            console.log(`${key.padEnd(15)}: ${status}`);
            
            if (element.exists && !element.visible) {
                console.log(`  → 問題: ${element.rect.width}x${element.rect.height}px, display:${element.style.display}, visibility:${element.style.visibility}`);
            }
            
            if (element.exists && element.visible) {
                console.log(`  → サイズ: ${element.rect.width}x${element.rect.height}px`);
            }
        });
        
        console.log('\n📱 レイアウト情報:');
        console.log('================');
        console.log(`画面サイズ: ${initialCheck.layout.viewportWidth}x${initialCheck.layout.viewportHeight}px`);
        console.log(`コンテンツサイズ: ${initialCheck.layout.bodyScrollWidth}x${initialCheck.layout.bodyScrollHeight}px`);
        console.log(`水平スクロール: ${initialCheck.layout.hasHorizontalScroll ? 'あり' : 'なし'}`);
        console.log(`垂直スクロール: ${initialCheck.layout.hasVerticalScroll ? 'あり' : 'なし'}`);
        
        console.log('\n📦 コンテナ状況:');
        console.log('===============');
        const containers = ['mainContainer', 'ichingContainer', 'resultsContainer'];
        containers.forEach(key => {
            const container = initialCheck[key];
            if (container.exists) {
                console.log(`${key}:`);
                console.log(`  表示: ${container.visible ? '✅' : '❌'} (${container.rect.width}x${container.rect.height}px)`);
                console.log(`  CSS: ${container.style.display}, ${container.style.visibility}, opacity:${container.style.opacity}`);
            } else {
                console.log(`${key}: ❌ 存在しない`);
            }
        });
        
        console.log('\n🎴 既存のシナリオ表示:');
        console.log('====================');
        console.log(`シナリオカード: ${initialCheck.existingScenarios.count}枚`);
        console.log(`フェーズブロック: ${initialCheck.existingPhases.count}個`);
        
        if (initialCheck.existingScenarios.count > 0) {
            console.log('シナリオカード詳細:');
            initialCheck.existingScenarios.items.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.visible ? '✅' : '❌'} ${item.rect.width}x${item.rect.height}px - ${item.content}`);
            });
        }
        
        // 実際にテスト入力を行って動作チェック
        console.log('\n🧪 実際の操作テスト');
        console.log('==================');
        
        if (initialCheck.textarea.visible) {
            try {
                await page.fill('#situation-text', 'テスト入力：転職の悩みについて相談があります。');
                console.log('✅ テキスト入力: 成功');
                
                await page.click('.analyze-btn.primary');
                console.log('✅ 分析ボタンクリック: 成功');
                
                // 分析結果を3秒間待つ
                await page.waitForTimeout(3000);
                
                // 結果表示の確認
                const afterAnalysis = await page.evaluate(() => {
                    return {
                        scenarios: document.querySelectorAll('.scenario-card').length,
                        phases: document.querySelectorAll('.phase-block').length,
                        status: document.querySelector('.status-text')?.textContent?.trim() || 'ステータス不明',
                        newContainers: document.querySelectorAll('.eight-scenarios-container').length
                    };
                });
                
                console.log('📊 分析後の表示状況:');
                console.log(`  シナリオカード: ${afterAnalysis.scenarios}枚`);
                console.log(`  フェーズブロック: ${afterAnalysis.phases}個`);
                console.log(`  ステータス: "${afterAnalysis.status}"`);
                console.log(`  新規コンテナ: ${afterAnalysis.newContainers}個`);
                
            } catch (error) {
                console.log(`❌ 操作テスト失敗: ${error.message}`);
            }
        } else {
            console.log('❌ テキスト入力欄が見えないため操作テストをスキップ');
        }
        
        // スクリーンショット撮影
        console.log('\n📸 表示状況のスクリーンショット撮影...');
        const screenshot = await page.screenshot({ 
            fullPage: false,
            path: '20250814_visual_display_check.png'
        });
        console.log('✅ スクリーンショット保存: 20250814_visual_display_check.png');
        
        return initialCheck;
        
    } catch (error) {
        console.error('❌ 表示チェックエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⏱️ 30秒間画面を表示して目視確認...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        await browser.close();
    }
}

// 実行
checkVisualDisplay().then(result => {
    console.log('\n🎯 表示チェック完了');
    console.log('==================');
    
    if (result.error) {
        console.log(`❌ エラー: ${result.error}`);
    } else {
        // 問題のある要素をまとめて表示
        console.log('\n⚠️ 修正が必要な表示問題:');
        console.log('=========================');
        
        let hasIssues = false;
        
        const criticalElements = ['textarea', 'analyzeBtn', 'form', 'mainContainer', 'ichingContainer'];
        criticalElements.forEach(key => {
            const element = result[key];
            if (!element.exists) {
                console.log(`❌ ${key}: 要素が存在しません`);
                hasIssues = true;
            } else if (!element.visible) {
                console.log(`❌ ${key}: 要素は存在しますが表示されていません`);
                console.log(`   サイズ: ${element.rect.width}x${element.rect.height}px`);
                console.log(`   CSS: display:${element.style.display}, visibility:${element.style.visibility}, opacity:${element.style.opacity}`);
                hasIssues = true;
            }
        });
        
        if (!hasIssues) {
            console.log('✅ 重要要素の表示に問題は見つかりませんでした');
        } else {
            console.log('\n🔧 推奨される修正方法:');
            console.log('====================');
            console.log('1. 非表示要素のCSS display/visibility/opacity プロパティの確認');
            console.log('2. 要素のwidth/heightが0でないかの確認');
            console.log('3. 親要素が非表示になっていないかの確認'); 
            console.log('4. z-indexによる重なり順序の確認');
        }
    }
    
}).catch(console.error);