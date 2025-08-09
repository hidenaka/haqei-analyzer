// Triple OSデータ保存問題の調査スクリプト
const puppeteer = require('puppeteer');

async function investigateSaveIssue() {
    console.log('🔍 Triple OSデータ保存問題を調査開始\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // コンソールログを表示
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('save') || text.includes('Analysis') || text.includes('Triple') || text.includes('storage')) {
            console.log(`[Browser] ${text}`);
        }
    });
    
    try {
        // テストページを開く
        console.log('📄 Triple OS保存テストページを開く...');
        await page.goto('http://localhost:3000/test-triple-os-save.html');
        await page.waitForTimeout(1000);
        
        // 1. 完全な分析フローをテスト
        console.log('\n🔬 Test 1: 完全な分析フローをテスト');
        await page.click('button[onclick="testCompleteFlow()"]');
        await page.waitForTimeout(5000); // 分析完了まで待機
        
        // 結果を取得
        const flowResult = await page.evaluate(() => {
            const resultEl = document.getElementById('flow-result');
            return resultEl ? resultEl.textContent : 'No result';
        });
        
        console.log('分析フロー結果:');
        console.log(flowResult);
        
        // 2. LocalStorageデータを確認
        console.log('\n🔍 Test 2: LocalStorageの内容を確認');
        const storageData = await page.evaluate(() => {
            const data = {};
            const keys = ['haqei_analysis_result', 'haqei_diagnosis_result', 'haqei_simple_analysis_result'];
            
            keys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) {
                    try {
                        const parsed = JSON.parse(value);
                        data[key] = {
                            exists: true,
                            hasEngineOS: !!parsed.engineOS,
                            hasInterfaceOS: !!parsed.interfaceOS,
                            hasSafeModeOS: !!parsed.safeModeOS,
                            keys: Object.keys(parsed)
                        };
                    } catch (e) {
                        data[key] = { exists: true, error: 'JSON parse error' };
                    }
                } else {
                    data[key] = { exists: false };
                }
            });
            
            return data;
        });
        
        console.log('LocalStorage状態:');
        console.log(JSON.stringify(storageData, null, 2));
        
        // 3. 直接保存テスト
        console.log('\n💾 Test 3: saveAnalysisResultを直接テスト');
        await page.click('button[onclick="testDirectSave()"]');
        await page.waitForTimeout(2000);
        
        const saveResult = await page.evaluate(() => {
            const resultEl = document.getElementById('save-result');
            return resultEl ? resultEl.textContent : 'No result';
        });
        
        console.log('直接保存テスト結果:');
        console.log(saveResult);
        
        // 4. 最終的なLocalStorage確認
        console.log('\n📊 最終的なLocalStorage状態:');
        const finalCheck = await page.evaluate(() => {
            const analysisResult = localStorage.getItem('haqei_analysis_result');
            if (analysisResult) {
                try {
                    const parsed = JSON.parse(analysisResult);
                    return {
                        dataExists: true,
                        analysisType: parsed.analysisType,
                        hasTripleOS: !!(parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS),
                        timestamp: parsed.timestamp,
                        dataSize: analysisResult.length
                    };
                } catch (e) {
                    return { dataExists: true, error: e.message };
                }
            }
            return { dataExists: false };
        });
        
        console.log(JSON.stringify(finalCheck, null, 2));
        
        // スクリーンショットを保存
        await page.screenshot({ path: 'triple-os-save-test.png', fullPage: true });
        console.log('\n📸 スクリーンショット保存: triple-os-save-test.png');
        
    } catch (error) {
        console.error('\n❌ エラー:', error.message);
        await page.screenshot({ path: 'triple-os-save-error.png' });
    } finally {
        await browser.close();
        console.log('\n✅ 調査完了');
    }
}

// 実行
investigateSaveIssue();