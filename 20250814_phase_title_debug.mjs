/**
 * フェーズタイトル問題の詳細デバッグ
 * 「undefined」表示問題の原因特定
 */

import { chromium } from 'playwright';

async function debugPhaseTitleIssue() {
    console.log('🔍 フェーズタイトル「undefined」問題デバッグ');
    console.log('=========================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(3000);
        
        // 分析実行
        console.log('🧪 分析実行...');
        await page.fill('#situation-text', 'フェーズタイトル問題をデバッグするためのテスト分析です。');
        await page.click('.analyze-btn.primary');
        
        await page.waitForTimeout(5000);
        
        // フェーズブロックの詳細調査
        const phaseDebug = await page.evaluate(() => {
            const phaseBlocks = document.querySelectorAll('.phase-block');
            
            const analyzePhaseBlock = (block, index) => {
                const phaseHeader = block.querySelector('.phase-header');
                const phaseName = block.querySelector('.phase-name');
                const phaseTitle = block.querySelector('.phase-title'); // こちらも確認
                const phaseIcon = block.querySelector('.phase-icon');
                const phaseContent = block.querySelector('.phase-content');
                
                return {
                    index,
                    blockExists: !!block,
                    blockClasses: block.className,
                    blockHTML: block.innerHTML.substring(0, 200) + '...',
                    
                    // ヘッダー分析
                    header: {
                        exists: !!phaseHeader,
                        innerHTML: phaseHeader ? phaseHeader.innerHTML : null,
                        classes: phaseHeader ? phaseHeader.className : null
                    },
                    
                    // タイトル/名前分析
                    name: {
                        exists: !!phaseName,
                        text: phaseName ? phaseName.textContent : null,
                        innerHTML: phaseName ? phaseName.innerHTML : null
                    },
                    
                    title: {
                        exists: !!phaseTitle,
                        text: phaseTitle ? phaseTitle.textContent : null,
                        innerHTML: phaseTitle ? phaseTitle.innerHTML : null
                    },
                    
                    // アイコン分析
                    icon: {
                        exists: !!phaseIcon,
                        text: phaseIcon ? phaseIcon.textContent : null
                    },
                    
                    // コンテンツ分析
                    content: {
                        exists: !!phaseContent,
                        text: phaseContent ? phaseContent.textContent?.substring(0, 100) + '...' : null
                    },
                    
                    // 全テキスト解析（undefinedを探す）
                    allText: block.textContent,
                    hasUndefined: block.textContent.includes('undefined'),
                    undefinedCount: (block.textContent.match(/undefined/g) || []).length,
                    undefinedPositions: []
                };
            };
            
            const results = Array.from(phaseBlocks).map(analyzePhaseBlock);
            
            // undefinedの位置を特定
            results.forEach(result => {
                if (result.hasUndefined) {
                    const text = result.allText;
                    let pos = 0;
                    while ((pos = text.indexOf('undefined', pos)) !== -1) {
                        // 前後10文字を取得してコンテキストを確認
                        const start = Math.max(0, pos - 10);
                        const end = Math.min(text.length, pos + 19); // 'undefined' + 10文字
                        const context = text.substring(start, end);
                        result.undefinedPositions.push({
                            position: pos,
                            context: context,
                            beforeText: text.substring(start, pos),
                            afterText: text.substring(pos + 9, end) // 'undefined'の長さ=9
                        });
                        pos += 9;
                    }
                }
            });
            
            return {
                totalBlocks: phaseBlocks.length,
                results,
                summary: {
                    blocksWithUndefined: results.filter(r => r.hasUndefined).length,
                    totalUndefinedCount: results.reduce((sum, r) => sum + r.undefinedCount, 0)
                }
            };
        });
        
        console.log(`\\n📊 フェーズブロック分析結果:`);
        console.log(`総フェーズブロック数: ${phaseDebug.totalBlocks}`);
        console.log(`undefined含有ブロック: ${phaseDebug.summary.blocksWithUndefined}`);
        console.log(`undefinedの総出現回数: ${phaseDebug.summary.totalUndefinedCount}`);
        
        phaseDebug.results.forEach((result, index) => {
            console.log(`\\n--- フェーズブロック ${index + 1} ---`);
            console.log(`クラス: ${result.blockClasses}`);
            console.log(`ヘッダー存在: ${result.header.exists ? '✅' : '❌'}`);
            
            if (result.header.exists) {
                console.log(`  ヘッダーHTML: ${result.header.innerHTML}`);
            }
            
            console.log(`フェーズ名(.phase-name): ${result.name.exists ? '✅' : '❌'} - "${result.name.text}"`);
            console.log(`フェーズタイトル(.phase-title): ${result.title.exists ? '✅' : '❌'} - "${result.title.text}"`);
            console.log(`アイコン: ${result.icon.exists ? '✅' : '❌'} - "${result.icon.text}"`);
            console.log(`コンテンツ: ${result.content.exists ? '✅' : '❌'}`);
            
            if (result.hasUndefined) {
                console.log(`\\n⚠️ UNDEFINED問題発見!`);
                console.log(`  出現回数: ${result.undefinedCount}`);
                result.undefinedPositions.forEach((pos, i) => {
                    console.log(`  位置${i + 1}: "${pos.context}"`);
                    console.log(`    前: "${pos.beforeText}"`);
                    console.log(`    後: "${pos.afterText}"`);
                });
            }
            
            // ブロックHTMLの要約表示（デバッグ用）
            if (result.hasUndefined) {
                console.log(`\\n🔍 問題ブロックのHTML（抜粋）:`);
                console.log(result.blockHTML);
            }
        });
        
        // さらに詳しいDOM調査
        console.log('\\n🔬 DOM構造の詳細調査...');
        const domAnalysis = await page.evaluate(() => {
            // すべてのテキストノードをチェック
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const undefinedNodes = [];
            let node;
            
            while (node = walker.nextNode()) {
                if (node.textContent.includes('undefined')) {
                    // 親要素の情報を取得
                    let parent = node.parentElement;
                    const parentInfo = {
                        tagName: parent ? parent.tagName : 'NO_PARENT',
                        className: parent ? parent.className : 'NO_CLASS',
                        id: parent ? parent.id : 'NO_ID'
                    };
                    
                    undefinedNodes.push({
                        text: node.textContent,
                        parentInfo,
                        isInPhaseBlock: !!parent.closest('.phase-block'),
                        isInScenarioCard: !!parent.closest('.scenario-card')
                    });
                }
            }
            
            return {
                totalUndefinedNodes: undefinedNodes.length,
                nodes: undefinedNodes.slice(0, 10) // 最初の10個のみ
            };
        });
        
        console.log(`\\n🔬 DOM内のundefinedテキストノード: ${domAnalysis.totalUndefinedNodes}個`);
        domAnalysis.nodes.forEach((node, index) => {
            console.log(`\\n${index + 1}. "${node.text.trim()}"`);
            console.log(`   親要素: <${node.parentInfo.tagName} class="${node.parentInfo.className}" id="${node.parentInfo.id}">`);
            console.log(`   フェーズブロック内: ${node.isInPhaseBlock ? '✅' : '❌'}`);
            console.log(`   シナリオカード内: ${node.isInScenarioCard ? '✅' : '❌'}`);
        });
        
        return phaseDebug;
        
    } catch (error) {
        console.error('❌ デバッグエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\\n⏱️ 15秒間表示確認...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
debugPhaseTitleIssue().then(result => {
    console.log('\\n🎯 フェーズタイトルデバッグ完了');
    console.log('==============================');
    
    if (result.error) {
        console.log(`❌ エラー: ${result.error}`);
    } else if (result.summary.totalUndefinedCount > 0) {
        console.log('\\n📋 修正が必要な問題:');
        console.log('===================');
        console.log(`- ${result.summary.totalUndefinedCount}箇所で「undefined」が表示されています`);
        console.log(`- ${result.summary.blocksWithUndefined}個のフェーズブロックで問題発生`);
        console.log('\\n🔧 推奨修正方法:');
        console.log('- JavaScriptのプロパティアクセスでundefinedが返されている');
        console.log('- テンプレート内の変数参照を確認');
        console.log('- デフォルト値の設定を追加');
    } else {
        console.log('✅ undefinedの表示問題は見つかりませんでした');
    }
    
}).catch(console.error);