import { chromium } from 'playwright';

/**
 * 🔍 選択肢要素の構造確認
 */

async function checkOptionElements() {
    console.log('🔍 選択肢要素の構造確認開始\n');
    
    const browser = await chromium.launch({ 
        headless: false
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. ページロード
        console.log('📡 ページロード...');
        await page.goto('http://localhost:8788/os_analyzer.html');
        await page.waitForTimeout(2000);
        
        // 2. 分析開始
        console.log('🖱️ 分析開始...');
        await page.locator('#start-btn').click();
        await page.waitForTimeout(1000);
        
        // 3. 選択肢の構造を確認
        console.log('\n📋 選択肢の構造確認:');
        const optionStructure = await page.evaluate(() => {
            const container = document.querySelector('#question-screen');
            const options = document.querySelectorAll('.option');
            const inputs = document.querySelectorAll('input[type="radio"]');
            const labels = document.querySelectorAll('label');
            
            const firstOption = options[0];
            const firstInput = inputs[0];
            const firstLabel = labels[0];
            
            return {
                containerHTML: container?.innerHTML?.substring(0, 500),
                optionCount: options.length,
                inputCount: inputs.length,
                labelCount: labels.length,
                firstOptionHTML: firstOption?.outerHTML,
                firstInputHTML: firstInput?.outerHTML,
                firstLabelHTML: firstLabel?.outerHTML,
                optionClickable: firstOption ? getComputedStyle(firstOption).pointerEvents : null
            };
        });
        
        console.log('選択肢構造:', JSON.stringify(optionStructure, null, 2));
        
        // 4. イベントリスナーの確認
        console.log('\n📋 イベントリスナー確認:');
        const listenerInfo = await page.evaluate(() => {
            const options = document.querySelectorAll('.option');
            const inputs = document.querySelectorAll('input[type="radio"]');
            
            // 最初の選択肢にテストリスナーを追加
            if (options[0]) {
                options[0].addEventListener('click', () => console.log('TEST: option clicked'));
            }
            if (inputs[0]) {
                inputs[0].addEventListener('change', () => console.log('TEST: input changed'));
            }
            
            return {
                optionListenerTest: !!options[0],
                inputListenerTest: !!inputs[0]
            };
        });
        
        console.log('リスナーテスト設定:', listenerInfo);
        
        // 5. 実際にクリックしてテスト
        console.log('\n🖱️ クリックテスト...');
        
        // コンソール監視
        page.on('console', msg => {
            if (msg.text().includes('TEST:')) {
                console.log(`[イベント発火] ${msg.text()}`);
            }
        });
        
        // 選択肢をクリック
        await page.locator('.option').first().click();
        await page.waitForTimeout(500);
        
        // inputをクリック
        await page.locator('input[type="radio"]').first().click();
        await page.waitForTimeout(500);
        
        // labelをクリック
        await page.locator('label').first().click();
        await page.waitForTimeout(500);
        
        // 6. 選択状態の確認
        console.log('\n📋 選択状態確認:');
        const selectionState = await page.evaluate(() => {
            return {
                selectedOption: document.querySelector('.option.selected')?.textContent?.trim(),
                checkedInput: document.querySelector('input[type="radio"]:checked')?.value,
                analyzerState: window.criticalCSSAnalyzer?.state?.answers?.length || 0
            };
        });
        
        console.log('選択状態:', JSON.stringify(selectionState, null, 2));
        
        return optionStructure;
        
    } catch (error) {
        console.error('❌ エラー:', error);
        return { error: error.message };
    } finally {
        console.log('\n⚠️ ブラウザは開いたままです。');
    }
}

// 実行
checkOptionElements()
    .then(result => {
        console.log('\n' + '='.repeat(50));
        console.log('📋 確認完了');
        
        if (result.inputCount > 0) {
            console.log('\n❌ 問題: input[type="radio"]要素が使われています');
            console.log('   選択肢のイベントハンドラーを修正する必要があります');
        } else if (result.optionCount > 0) {
            console.log('\n✅ .option要素が使われています');
        }
        
        console.log('='.repeat(50));
    })
    .catch(error => {
        console.error('❌ 致命的エラー:', error);
    });