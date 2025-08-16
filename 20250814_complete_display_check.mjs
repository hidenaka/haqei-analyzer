/**
 * 完全な表示要素チェック - すべての要素を漏れなく確認
 * 細かい部分も含めて徹底的に検証
 */

import { chromium } from 'playwright';

async function completeDisplayCheck() {
    console.log('🔍 完全な表示要素チェック開始');
    console.log('=====================================');
    console.log('すべての要素を漏れなく確認します');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    const issues = [];
    
    try {
        const page = await browser.newPage();
        
        console.log('📄 ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(5000);
        
        // ================ 初期画面の全要素チェック ================
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 初期画面の全要素チェック');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const initialElements = await page.evaluate(() => {
            const checkElement = (selector, description) => {
                const element = document.querySelector(selector);
                if (!element) return { selector, description, exists: false };
                
                const rect = element.getBoundingClientRect();
                const style = window.getComputedStyle(element);
                const isVisible = rect.width > 0 && rect.height > 0 && 
                                 style.display !== 'none' && 
                                 style.visibility !== 'hidden' &&
                                 parseFloat(style.opacity) > 0;
                
                return {
                    selector,
                    description,
                    exists: true,
                    visible: isVisible,
                    text: element.textContent?.trim().substring(0, 50),
                    width: rect.width,
                    height: rect.height,
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    color: style.color,
                    backgroundColor: style.backgroundColor,
                    fontSize: style.fontSize,
                    hasContent: element.textContent?.trim().length > 0
                };
            };
            
            // チェックする要素のリスト（すべて重要）
            const elementsToCheck = [
                // ヘッダー関連
                ['h1', 'メインタイトル'],
                ['h2', 'サブタイトル'],
                ['.page-title', 'ページタイトル'],
                ['.site-header', 'サイトヘッダー'],
                
                // 入力関連
                ['#situation-text', 'テキスト入力欄'],
                ['label[for="situation-text"]', 'テキスト入力欄のラベル'],
                ['.analyze-btn.primary', '分析ボタン'],
                ['#quick-analysis-btn', 'クイック分析ボタン'],
                ['.input-header h3', '入力セクションタイトル'],
                ['.input-header p', '入力セクション説明'],
                
                // サンプル例
                ['.example-situations h4', 'サンプル例タイトル'],
                ['.example-btn[data-example="career"]', 'キャリアサンプルボタン'],
                ['.example-btn[data-example="love"]', '恋愛サンプルボタン'],
                ['.example-btn[data-example="life"]', '人生サンプルボタン'],
                
                // ステータス表示
                ['.status-indicator', 'ステータスインジケータ'],
                ['.status-icon', 'ステータスアイコン'],
                ['.status-text', 'ステータステキスト'],
                
                // コンテナ
                ['#main-container', 'メインコンテナ'],
                ['#i-ching-container', 'I Chingコンテナ'],
                ['#resultsContainer', '結果コンテナ'],
                ['#situation-input-section', '入力セクション'],
                ['#simulator-status', 'シミュレータステータス'],
                
                // その他の要素
                ['.three-stage-title', '3段階タイトル'],
                ['.three-stage-subtitle', '3段階サブタイトル'],
                ['.eight-scenarios-container', '8シナリオコンテナ'],
                ['.scenario-grid', 'シナリオグリッド'],
                
                // フッター・バージョン表示など
                ['.app-version', 'アプリバージョン'],
                ['.copyright', '著作権表示'],
                ['footer', 'フッター']
            ];
            
            const results = {};
            elementsToCheck.forEach(([selector, description]) => {
                results[selector] = checkElement(selector, description);
            });
            
            return results;
        });
        
        // 初期画面の結果表示
        Object.entries(initialElements).forEach(([selector, data]) => {
            if (!data.exists) {
                console.log(`❌ ${data.description}: 存在しない`);
                issues.push(`${data.description} (${selector}): 要素が存在しない`);
            } else if (!data.visible) {
                console.log(`⚠️ ${data.description}: 存在するが非表示 (${data.width}x${data.height}px)`);
                issues.push(`${data.description} (${selector}): 非表示状態`);
            } else if (!data.hasContent && !selector.includes('input') && !selector.includes('textarea')) {
                console.log(`⚠️ ${data.description}: 表示されているがテキストなし`);
                issues.push(`${data.description} (${selector}): コンテンツが空`);
            } else {
                console.log(`✅ ${data.description}: 正常表示`);
            }
        });
        
        // ================ 分析実行 ================
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🧪 分析実行');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        await page.fill('#situation-text', '完全な表示チェックのためのテスト分析を実行します。');
        await page.click('.analyze-btn.primary');
        await page.waitForTimeout(5000);
        
        // ================ 分析後の全要素チェック ================
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 分析後の全要素チェック');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const afterAnalysisElements = await page.evaluate(() => {
            const checkDetailedElement = (selector, description) => {
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) return { selector, description, count: 0, exists: false };
                
                const details = Array.from(elements).map((element, index) => {
                    const rect = element.getBoundingClientRect();
                    const style = window.getComputedStyle(element);
                    const isVisible = rect.width > 0 && rect.height > 0 && 
                                     style.display !== 'none' && 
                                     style.visibility !== 'hidden' &&
                                     parseFloat(style.opacity) > 0;
                    
                    // 子要素の詳細チェック
                    const children = {
                        images: element.querySelectorAll('img').length,
                        links: element.querySelectorAll('a').length,
                        buttons: element.querySelectorAll('button').length,
                        spans: element.querySelectorAll('span').length,
                        divs: element.querySelectorAll('div').length
                    };
                    
                    // テキストノードの詳細
                    const textNodes = [];
                    const walker = document.createTreeWalker(
                        element,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    let node;
                    while (node = walker.nextNode()) {
                        const text = node.textContent.trim();
                        if (text && text !== '') {
                            textNodes.push(text.substring(0, 30));
                        }
                    }
                    
                    return {
                        index,
                        visible: isVisible,
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        text: element.textContent?.trim().substring(0, 100),
                        hasUndefined: element.textContent?.includes('undefined'),
                        hasNull: element.textContent?.includes('null'),
                        hasNaN: element.textContent?.includes('NaN'),
                        isEmpty: element.textContent?.trim() === '',
                        children,
                        textNodes: textNodes.slice(0, 3),
                        classes: element.className,
                        id: element.id
                    };
                });
                
                return {
                    selector,
                    description,
                    count: elements.length,
                    exists: true,
                    details
                };
            };
            
            // 分析後にチェックする要素
            const elementsToCheck = [
                // シナリオカード関連
                ['.scenario-card', 'シナリオカード'],
                ['.scenario-title', 'シナリオタイトル'],
                ['.scenario-description', 'シナリオ説明'],
                ['.scenario-metadata', 'シナリオメタデータ'],
                ['.scenario-rank', 'シナリオランク'],
                ['.hexagram-transformation', '卦変化表示'],
                ['.change-method-badge', '変化方式バッジ'],
                
                // フェーズブロック関連
                ['.phase-block', 'フェーズブロック'],
                ['.phase-header', 'フェーズヘッダー'],
                ['.phase-icon', 'フェーズアイコン'],
                ['.phase-name', 'フェーズ名'],
                ['.phase-content', 'フェーズコンテンツ'],
                ['.score-indicator', 'スコア表示'],
                ['.phase-description', 'フェーズ説明'],
                
                // 3段階変化関連
                ['.three-phase-container', '3段階コンテナ'],
                ['.phase-1', 'フェーズ1（動爻期）'],
                ['.phase-2', 'フェーズ2（転爻期）'],
                ['.phase-3', 'フェーズ3（成爻期）'],
                
                // その他の表示要素
                ['.temporal-steps', '時間的ステップ'],
                ['.iching-wisdom', '易経の知恵'],
                ['.scenario-iching', 'シナリオ易経情報'],
                ['.characteristic-tag', '特性タグ'],
                ['.positive', 'ポジティブ表示'],
                ['.negative', 'ネガティブ表示'],
                ['.final-score', '最終スコア']
            ];
            
            const results = {};
            elementsToCheck.forEach(([selector, description]) => {
                results[selector] = checkDetailedElement(selector, description);
            });
            
            return results;
        });
        
        // 分析後の結果表示
        Object.entries(afterAnalysisElements).forEach(([selector, data]) => {
            if (!data.exists || data.count === 0) {
                console.log(`❌ ${data.description}: 存在しない`);
                issues.push(`分析後: ${data.description} (${selector}): 要素が存在しない`);
            } else {
                console.log(`📦 ${data.description}: ${data.count}個`);
                
                // 詳細な問題チェック
                data.details.forEach((detail, index) => {
                    if (!detail.visible) {
                        console.log(`  ⚠️ ${index + 1}番目: 非表示`);
                        issues.push(`分析後: ${data.description} #${index + 1}: 非表示`);
                    }
                    if (detail.hasUndefined) {
                        console.log(`  ❌ ${index + 1}番目: "undefined"を含む`);
                        issues.push(`分析後: ${data.description} #${index + 1}: undefined表示`);
                    }
                    if (detail.hasNull) {
                        console.log(`  ❌ ${index + 1}番目: "null"を含む`);
                        issues.push(`分析後: ${data.description} #${index + 1}: null表示`);
                    }
                    if (detail.hasNaN) {
                        console.log(`  ❌ ${index + 1}番目: "NaN"を含む`);
                        issues.push(`分析後: ${data.description} #${index + 1}: NaN表示`);
                    }
                    if (detail.isEmpty && !selector.includes('icon')) {
                        console.log(`  ⚠️ ${index + 1}番目: コンテンツが空`);
                        issues.push(`分析後: ${data.description} #${index + 1}: 空のコンテンツ`);
                    }
                });
            }
        });
        
        // ================ CSSスタイルの適用チェック ================
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎨 CSSスタイル適用チェック');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const styleCheck = await page.evaluate(() => {
            const styles = document.querySelectorAll('style');
            const links = document.querySelectorAll('link[rel="stylesheet"]');
            
            return {
                inlineStyles: styles.length,
                externalStyles: links.length,
                customStyleIds: Array.from(styles).map(s => s.id).filter(id => id),
                externalStylesheets: Array.from(links).map(l => l.href)
            };
        });
        
        console.log(`インラインスタイル: ${styleCheck.inlineStyles}個`);
        console.log(`外部スタイルシート: ${styleCheck.externalStyles}個`);
        if (styleCheck.customStyleIds.length > 0) {
            console.log(`カスタムスタイルID: ${styleCheck.customStyleIds.join(', ')}`);
        }
        
        // ================ コンソールエラーチェック ================
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚨 コンソールエラーチェック');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        
        // エラーを誘発するための再読み込み
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        if (consoleErrors.length > 0) {
            console.log(`❌ コンソールエラー: ${consoleErrors.length}件`);
            consoleErrors.forEach(error => {
                console.log(`  - ${error}`);
                issues.push(`コンソールエラー: ${error}`);
            });
        } else {
            console.log('✅ コンソールエラーなし');
        }
        
        // スクリーンショット
        await page.screenshot({ 
            fullPage: true,
            path: '20250814_complete_check_screenshot.png'
        });
        console.log('\n📸 スクリーンショット保存: 20250814_complete_check_screenshot.png');
        
        return issues;
        
    } catch (error) {
        console.error('❌ チェックエラー:', error);
        issues.push(`チェックエラー: ${error.message}`);
        return issues;
    } finally {
        console.log('\n⏱️ 20秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 20000));
        await browser.close();
    }
}

// 実行
completeDisplayCheck().then(issues => {
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 完全表示チェック結果サマリー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (issues.length === 0) {
        console.log('✅ すべての表示要素が正常です！');
        console.log('問題は見つかりませんでした。');
    } else {
        console.log(`⚠️ ${issues.length}個の問題が見つかりました：`);
        console.log('');
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
        
        console.log('\n🔧 修正が必要な項目:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // 問題をカテゴリ分け
        const notExist = issues.filter(i => i.includes('存在しない'));
        const notVisible = issues.filter(i => i.includes('非表示'));
        const hasUndefined = issues.filter(i => i.includes('undefined'));
        const hasNull = issues.filter(i => i.includes('null'));
        const hasNaN = issues.filter(i => i.includes('NaN'));
        const isEmpty = issues.filter(i => i.includes('空'));
        
        if (notExist.length > 0) {
            console.log(`\n❌ 存在しない要素 (${notExist.length}個):`);
            notExist.forEach(i => console.log(`  - ${i}`));
        }
        if (notVisible.length > 0) {
            console.log(`\n⚠️ 非表示の要素 (${notVisible.length}個):`);
            notVisible.forEach(i => console.log(`  - ${i}`));
        }
        if (hasUndefined.length > 0) {
            console.log(`\n❌ undefined表示 (${hasUndefined.length}個):`);
            hasUndefined.forEach(i => console.log(`  - ${i}`));
        }
        if (hasNull.length > 0) {
            console.log(`\n❌ null表示 (${hasNull.length}個):`);
            hasNull.forEach(i => console.log(`  - ${i}`));
        }
        if (hasNaN.length > 0) {
            console.log(`\n❌ NaN表示 (${hasNaN.length}個):`);
            hasNaN.forEach(i => console.log(`  - ${i}`));
        }
        if (isEmpty.length > 0) {
            console.log(`\n⚠️ 空のコンテンツ (${isEmpty.length}個):`);
            isEmpty.forEach(i => console.log(`  - ${i}`));
        }
    }
    
}).catch(console.error);