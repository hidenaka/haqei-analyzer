/**
 * UI可視性問題の詳細デバッグ
 */

import { chromium } from 'playwright';

async function debugUIVisibility() {
    console.log('[UI DEBUG] UI可視性問題デバッグ開始');
    console.log('===================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-web-security']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('[UI DEBUG] ページアクセス...');
        await page.goto('http://localhost:8788/future_simulator.html', { 
            waitUntil: 'networkidle',
            timeout: 20000
        });
        
        await page.waitForTimeout(8000);
        
        // テキストエリアの詳細分析
        const textareaAnalysis = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            if (!textarea) return { exists: false };
            
            const computedStyle = window.getComputedStyle(textarea);
            const rect = textarea.getBoundingClientRect();
            
            return {
                exists: true,
                // 基本属性
                id: textarea.id,
                tagName: textarea.tagName,
                type: textarea.type || 'textarea',
                
                // 可視性関連
                visible: {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    position: computedStyle.position,
                    zIndex: computedStyle.zIndex,
                    transform: computedStyle.transform,
                    overflow: computedStyle.overflow
                },
                
                // 位置・サイズ
                dimensions: {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom
                },
                
                // DOM状態
                attributes: {
                    disabled: textarea.disabled,
                    readonly: textarea.readOnly,
                    required: textarea.required,
                    placeholder: textarea.placeholder?.substring(0, 50) + '...'
                },
                
                // 親要素の状態
                parent: {
                    id: textarea.parentElement?.id || 'no-id',
                    className: textarea.parentElement?.className || 'no-class',
                    display: textarea.parentElement ? window.getComputedStyle(textarea.parentElement).display : 'none',
                    visibility: textarea.parentElement ? window.getComputedStyle(textarea.parentElement).visibility : 'hidden'
                },
                
                // フォーム状態
                form: {
                    id: textarea.form?.id || 'no-form',
                    display: textarea.form ? window.getComputedStyle(textarea.form).display : 'none',
                    visibility: textarea.form ? window.getComputedStyle(textarea.form).visibility : 'hidden'
                },
                
                // 実際の表示確認
                isVisibleToUser: rect.width > 0 && rect.height > 0 && 
                                computedStyle.display !== 'none' && 
                                computedStyle.visibility !== 'hidden' &&
                                parseFloat(computedStyle.opacity) > 0,
                
                // スクロール状態
                scrollIntoView: () => {
                    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return 'scrolled';
                }
            };
        });
        
        console.log('\\n[UI DEBUG] テキストエリア詳細分析:');
        console.log('===================================');
        console.log(`📋 要素存在: ${textareaAnalysis.exists ? '✅' : '❌'}`);
        
        if (textareaAnalysis.exists) {
            console.log(`🏷️ ID: ${textareaAnalysis.id}`);
            console.log(`🏷️ タグ: ${textareaAnalysis.tagName}`);
            console.log('');
            console.log('👁️ 可視性プロパティ:');
            console.log(`  display: ${textareaAnalysis.visible.display}`);
            console.log(`  visibility: ${textareaAnalysis.visible.visibility}`);
            console.log(`  opacity: ${textareaAnalysis.visible.opacity}`);
            console.log(`  position: ${textareaAnalysis.visible.position}`);
            console.log(`  z-index: ${textareaAnalysis.visible.zIndex}`);
            console.log(`  transform: ${textareaAnalysis.visible.transform}`);
            console.log('');
            console.log('📏 位置・サイズ:');
            console.log(`  width: ${textareaAnalysis.dimensions.width}px`);
            console.log(`  height: ${textareaAnalysis.dimensions.height}px`);
            console.log(`  top: ${textareaAnalysis.dimensions.top}px`);
            console.log(`  left: ${textareaAnalysis.dimensions.left}px`);
            console.log('');
            console.log('🔧 DOM状態:');
            console.log(`  disabled: ${textareaAnalysis.attributes.disabled}`);
            console.log(`  readonly: ${textareaAnalysis.attributes.readonly}`);
            console.log(`  required: ${textareaAnalysis.attributes.required}`);
            console.log(`  placeholder: "${textareaAnalysis.attributes.placeholder}"`);
            console.log('');
            console.log('👨‍👩‍👧‍👦 親要素状態:');
            console.log(`  parent.id: ${textareaAnalysis.parent.id}`);
            console.log(`  parent.className: ${textareaAnalysis.parent.className}`);
            console.log(`  parent.display: ${textareaAnalysis.parent.display}`);
            console.log(`  parent.visibility: ${textareaAnalysis.parent.visibility}`);
            console.log('');
            console.log('📝 フォーム状態:');
            console.log(`  form.id: ${textareaAnalysis.form.id}`);
            console.log(`  form.display: ${textareaAnalysis.form.display}`);
            console.log(`  form.visibility: ${textareaAnalysis.form.visibility}`);
            console.log('');
            console.log(`🎯 ユーザーに見える: ${textareaAnalysis.isVisibleToUser ? '✅' : '❌'}`);
        }
        
        // スクロールして表示を試行
        if (textareaAnalysis.exists && !textareaAnalysis.isVisibleToUser) {
            console.log('\\n[UI DEBUG] スクロールして要素を表示範囲に移動...');
            await page.evaluate(() => {
                const textarea = document.getElementById('situation-text');
                if (textarea) {
                    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            await page.waitForTimeout(2000);
            
            // 再度確認
            const afterScrollAnalysis = await page.evaluate(() => {
                const textarea = document.getElementById('situation-text');
                if (!textarea) return { visible: false };
                
                const rect = textarea.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(textarea);
                
                return {
                    visible: rect.width > 0 && rect.height > 0 && 
                            computedStyle.display !== 'none' && 
                            computedStyle.visibility !== 'hidden' &&
                            parseFloat(computedStyle.opacity) > 0,
                    rect: {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left
                    }
                };
            });
            
            console.log(`📊 スクロール後の可視性: ${afterScrollAnalysis.visible ? '✅' : '❌'}`);
            console.log(`📊 位置: top=${afterScrollAnalysis.rect.top}, left=${afterScrollAnalysis.rect.left}`);
        }
        
        // DOM階層の調査
        const domHierarchy = await page.evaluate(() => {
            const textarea = document.getElementById('situation-text');
            if (!textarea) return { error: 'textarea not found' };
            
            const hierarchy = [];
            let current = textarea;
            
            while (current && current !== document.body) {
                const computedStyle = window.getComputedStyle(current);
                hierarchy.push({
                    tagName: current.tagName,
                    id: current.id || 'no-id',
                    className: current.className || 'no-class',
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    position: computedStyle.position
                });
                current = current.parentElement;
            }
            
            return { hierarchy };
        });
        
        console.log('\\n[UI DEBUG] DOM階層分析:');
        console.log('=========================');
        domHierarchy.hierarchy?.forEach((element, index) => {
            const indent = '  '.repeat(index);
            console.log(`${indent}${element.tagName}#${element.id}.${element.className}`);
            console.log(`${indent}  display: ${element.display}, visibility: ${element.visibility}, opacity: ${element.opacity}`);
        });
        
        // 手動での入力テスト
        console.log('\\n[UI DEBUG] 手動入力テスト...');
        try {
            await page.evaluate(() => {
                const textarea = document.getElementById('situation-text');
                if (textarea) {
                    // 強制的に表示
                    textarea.style.display = 'block';
                    textarea.style.visibility = 'visible';
                    textarea.style.opacity = '1';
                    textarea.style.position = 'relative';
                    textarea.style.zIndex = '9999';
                    
                    // 親要素も表示
                    let parent = textarea.parentElement;
                    while (parent && parent !== document.body) {
                        parent.style.display = 'block';
                        parent.style.visibility = 'visible';
                        parent.style.opacity = '1';
                        parent = parent.parentElement;
                    }
                    
                    console.log('🔧 強制表示処理完了');
                    return 'forced visible';
                }
                return 'not found';
            });
            
            await page.waitForTimeout(1000);
            
            // 強制表示後のテスト
            await page.fill('#situation-text', 'テスト入力文字列');
            console.log('✅ 強制表示後の入力テスト成功');
            
            const value = await page.inputValue('#situation-text');
            console.log(`📝 入力値確認: "${value}"`);
            
        } catch (error) {
            console.log(`❌ 手動入力テスト失敗: ${error.message}`);
        }
        
        return {
            textareaExists: textareaAnalysis.exists,
            isVisible: textareaAnalysis.isVisibleToUser,
            domHierarchy: domHierarchy.hierarchy?.length || 0
        };
        
    } catch (error) {
        console.error('[UI DEBUG] デバッグエラー:', error);
        return { error: error.message };
    } finally {
        console.log('\\n[UI DEBUG] 15秒間確認画面表示...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        await browser.close();
    }
}

// 実行
debugUIVisibility().then(result => {
    console.log('\\n📋 UI可視性デバッグ完了');
    console.log('========================');
    
    if (result.error) {
        console.log(`❌ デバッグエラー: ${result.error}`);
    } else {
        console.log(`📋 テキストエリア存在: ${result.textareaExists ? '✅' : '❌'}`);
        console.log(`👁️ ユーザーに見える: ${result.isVisible ? '✅' : '❌'}`);
        console.log(`🌳 DOM階層深度: ${result.domHierarchy}レベル`);
        
        if (!result.isVisible) {
            console.log('\\n🔧 解決が必要な問題:');
            console.log('- テキストエリアがユーザーに見えない状態');
            console.log('- CSS表示プロパティの調整が必要');
            console.log('- 親要素の可視性設定の確認が必要');
        }
    }
    
}).catch(console.error);