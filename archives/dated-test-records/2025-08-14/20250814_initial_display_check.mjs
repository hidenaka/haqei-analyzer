/**
 * 初期表示チェック - 入力前に何が表示されているか確認
 */

import { chromium } from 'playwright';

async function checkInitialDisplay() {
    console.log('🔍 初期表示チェック - 入力前の状態確認');
    console.log('=====================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('📄 ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(3000);
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 初期状態の可視要素チェック');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // 可視要素の詳細調査
        const visibleElements = await page.evaluate(() => {
            const results = [];
            
            // すべての要素を取得
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const style = window.getComputedStyle(element);
                
                // 可視条件チェック
                const isVisible = rect.width > 0 && 
                                 rect.height > 0 && 
                                 rect.top < window.innerHeight &&
                                 rect.bottom > 0 &&
                                 style.display !== 'none' && 
                                 style.visibility !== 'hidden' &&
                                 parseFloat(style.opacity) > 0;
                
                if (isVisible) {
                    // テキストコンテンツがある要素のみ
                    const text = element.textContent?.trim();
                    const hasDirectText = element.childNodes.length > 0 && 
                                         Array.from(element.childNodes).some(node => 
                                            node.nodeType === 3 && node.textContent.trim().length > 0
                                         );
                    
                    if (hasDirectText || (text && text.length > 0 && element.children.length === 0)) {
                        // 親要素との重複を避ける
                        const tagName = element.tagName.toLowerCase();
                        const className = element.className;
                        const id = element.id;
                        
                        results.push({
                            tag: tagName,
                            id: id || '',
                            class: className || '',
                            text: text?.substring(0, 100),
                            position: {
                                top: Math.round(rect.top),
                                left: Math.round(rect.left),
                                width: Math.round(rect.width),
                                height: Math.round(rect.height)
                            },
                            zIndex: style.zIndex,
                            backgroundColor: style.backgroundColor,
                            color: style.color
                        });
                    }
                }
            });
            
            return results;
        });
        
        // 位置でソート（上から下へ）
        visibleElements.sort((a, b) => a.position.top - b.position.top);
        
        console.log(`\n🎯 可視テキスト要素: ${visibleElements.length}個`);
        
        // 主要な可視要素を表示
        let elementIndex = 0;
        visibleElements.forEach((elem) => {
            if (elem.text && elem.text.length > 0) {
                elementIndex++;
                console.log(`\n${elementIndex}. ${elem.tag}${elem.id ? '#' + elem.id : ''}${elem.class ? '.' + elem.class.split(' ')[0] : ''}`);
                console.log(`   位置: (${elem.position.left}, ${elem.position.top}) サイズ: ${elem.position.width}x${elem.position.height}`);
                console.log(`   テキスト: "${elem.text.substring(0, 50)}${elem.text.length > 50 ? '...' : ''}"`);
            }
        });
        
        // 特に下部の不要な表示をチェック
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📍 画面下部（Y > 600px）の要素');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const bottomElements = visibleElements.filter(elem => elem.position.top > 600);
        
        if (bottomElements.length > 0) {
            console.log(`\n⚠️ 画面下部に${bottomElements.length}個の要素が表示されています：`);
            let bottomIndex = 0;
            bottomElements.forEach((elem) => {
                bottomIndex++;
                console.log(`\n${bottomIndex}. ${elem.tag}${elem.id ? '#' + elem.id : ''}${elem.class ? '.' + elem.class.split(' ')[0] : ''}`);
                console.log(`   位置: Y=${elem.position.top}px`);
                console.log(`   テキスト: "${elem.text?.substring(0, 80)}${elem.text?.length > 80 ? '...' : ''}"`);
            });
        } else {
            console.log('✅ 画面下部に不要な要素はありません');
        }
        
        // resultsContainerの状態確認
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 結果コンテナの状態');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const containerCheck = await page.evaluate(() => {
            const container = document.getElementById('resultsContainer');
            if (!container) return { exists: false };
            
            const style = window.getComputedStyle(container);
            const rect = container.getBoundingClientRect();
            
            return {
                exists: true,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                position: {
                    top: Math.round(rect.top),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                innerHTML: container.innerHTML.substring(0, 200),
                childCount: container.children.length,
                textContent: container.textContent?.trim().substring(0, 100)
            };
        });
        
        if (containerCheck.exists) {
            console.log('結果コンテナ状態:');
            console.log(`  display: ${containerCheck.display}`);
            console.log(`  visibility: ${containerCheck.visibility}`);
            console.log(`  opacity: ${containerCheck.opacity}`);
            console.log(`  サイズ: ${containerCheck.position.width}x${containerCheck.position.height}`);
            console.log(`  子要素数: ${containerCheck.childCount}`);
            if (containerCheck.textContent) {
                console.log(`  内容: "${containerCheck.textContent}"`);
            }
        }
        
        // スクリーンショット
        await page.screenshot({ 
            fullPage: true,
            path: '20250814_initial_display_screenshot.png'
        });
        console.log('\n📸 スクリーンショット保存: 20250814_initial_display_screenshot.png');
        
        return { visibleElements, bottomElements, containerCheck };
        
    } catch (error) {
        console.error('❌ チェックエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⏱️ 10秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
    }
}

// 実行
checkInitialDisplay().then(result => {
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 初期表示チェック結果サマリー');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (result.bottomElements && result.bottomElements.length > 0) {
        console.log('\n⚠️ 問題: 入力前に下部に要素が表示されています');
        console.log('これらの要素は初期状態では非表示にすべきかもしれません');
    } else {
        console.log('\n✅ 初期表示は正常です');
    }
    
}).catch(console.error);