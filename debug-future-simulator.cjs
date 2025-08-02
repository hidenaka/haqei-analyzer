/**
 * Future Simulator エラー詳細調査
 */

const { chromium } = require('playwright');

async function debugFutureSimulator() {
    console.log('🔍 Future Simulator エラー詳細調査開始...\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // ネットワークリクエストをモニター
    const networkRequests = [];
    
    page.on('request', request => {
        networkRequests.push({
            url: request.url(),
            method: request.method(),
            status: 'request'
        });
    });
    
    page.on('response', response => {
        const request = networkRequests.find(req => req.url === response.url());
        if (request) {
            request.status = response.status();
            request.statusText = response.statusText();
        }
    });
    
    // JavaScriptエラーをキャッチ
    const jsErrors = [];
    page.on('pageerror', error => {
        jsErrors.push(error.message);
    });
    
    // コンソールログをキャッチ
    const consoleLogs = [];
    page.on('console', msg => {
        consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });
    
    try {
        console.log('📄 ページロード中...');
        await page.goto('http://localhost:8790/public/future_simulator.html');
        
        // すべてのスクリプトが読み込まれるまで待機
        await page.waitForLoadState('networkidle');
        
        // さらに3秒待機
        await page.waitForTimeout(3000);
        
        console.log('\n🌐 ネットワークリクエスト確認:');
        networkRequests.forEach((req, index) => {
            const statusIcon = req.status === 200 ? '✅' : req.status >= 400 ? '❌' : '⚠️';
            console.log(`   ${statusIcon} ${req.status} ${req.url.split('/').pop()}`);
        });
        
        console.log('\n❌ JavaScriptエラー:');
        if (jsErrors.length > 0) {
            jsErrors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        } else {
            console.log('   エラーなし');
        }
        
        console.log('\n📝 コンソールログ:');
        consoleLogs.forEach((log, index) => {
            console.log(`   ${index + 1}. ${log}`);
        });
        
        // H384_DATAの詳細確認
        console.log('\n🎯 H384_DATA詳細確認:');
        const dataDetails = await page.evaluate(() => {
            const results = {
                H384_DATA_exists: typeof window.H384_DATA !== 'undefined',
                H384_DATA_type: typeof window.H384_DATA,
                H384_DATA_length: window.H384_DATA ? window.H384_DATA.length : 0,
                sample_entry: null,
                yoikyu_entry: null,
                yourikyu_entry: null
            };
            
            if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
                results.sample_entry = window.H384_DATA[0];
                results.yoikyu_entry = window.H384_DATA.find(item => item['通し番号'] === 7);
                results.yourikyu_entry = window.H384_DATA.find(item => item['通し番号'] === 14);
            }
            
            return results;
        });
        
        console.log(`   H384_DATA存在: ${dataDetails.H384_DATA_exists}`);
        console.log(`   データ型: ${dataDetails.H384_DATA_type}`);
        console.log(`   データ長: ${dataDetails.H384_DATA_length}`);
        
        if (dataDetails.sample_entry) {
            console.log(`   サンプルエントリ: ${JSON.stringify(dataDetails.sample_entry).substring(0, 100)}...`);
        }
        
        console.log(`   用九エントリ: ${dataDetails.yoikyu_entry ? 'あり' : 'なし'}`);
        console.log(`   用六エントリ: ${dataDetails.yourikyu_entry ? 'あり' : 'なし'}`);
        
        // DOMの状態確認
        console.log('\n🔍 DOM状態確認:');
        const domState = await page.evaluate(() => {
            return {
                inputExists: !!document.getElementById('worryInput'),
                buttonExists: !!document.getElementById('aiGuessBtn'),
                checkboxExists: !!document.getElementById('agreementCheckbox'),
                buttonDisabled: document.getElementById('aiGuessBtn')?.disabled,
                modalVisible: !!document.querySelector('#modalContainer:not([style*="display: none"])')
            };
        });
        
        console.log(`   入力エリア: ${domState.inputExists ? '存在' : '不存在'}`);
        console.log(`   分析ボタン: ${domState.buttonExists ? '存在' : '不存在'}`);
        console.log(`   チェックボックス: ${domState.checkboxExists ? '存在' : '不存在'}`);
        console.log(`   ボタン無効状態: ${domState.buttonDisabled}`);
        console.log(`   モーダル表示: ${domState.modalVisible}`);
        
        // 10秒待機
        console.log('\n⏸️ 10秒間待機（画面確認用）...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ デバッグエラー:', error.message);
    } finally {
        await browser.close();
    }
    
    console.log('\n🏁 Future Simulator エラー詳細調査完了');
}

// デバッグ実行
if (require.main === module) {
    debugFutureSimulator().catch(console.error);
}

module.exports = { debugFutureSimulator };