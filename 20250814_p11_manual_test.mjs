/**
 * P1-1: 手動テスト（60秒）
 * OS Analyzerでの実際の保存テスト
 */

import { chromium } from 'playwright';

async function testTripleOSStorage() {
    console.log('🧪 P1-1: Triple OS Storage Manual Test (60秒)');
    
    const browser = await chromium.launch({ 
        headless: false, // 手動確認のためヘッドレスモードなし
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
        
        // コンソールログ監視（保存関連）
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('HAQEI') || text.includes('Triple OS') || text.includes('保存')) {
                console.log(`[CONSOLE] ${text}`);
            }
        });
        
        console.log('📍 OS Analyzerページを開いています...');
        await page.goto('http://localhost:8788/os_analyzer.html', { 
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        console.log('⏱️  5秒待機（初期化完了を待つ）...');
        await page.waitForTimeout(5000);
        
        // triple-os-storage.jsがロードされているかチェック
        const storageModuleLoaded = await page.evaluate(() => {
            // モジュールスクリプトが存在するかチェック
            const moduleScripts = document.querySelectorAll('script[type="module"]');
            for (let script of moduleScripts) {
                if (script.textContent.includes('triple-os-storage.js')) {
                    return true;
                }
            }
            return false;
        });
        
        console.log(`🔍 triple-os-storage.js module: ${storageModuleLoaded ? '✅ Loaded' : '❌ Not Found'}`);
        
        // saveTripleOSToStorageメソッドが追加されているかチェック
        const saveMethodExists = await page.evaluate(() => {
            return window.criticalCSSAnalyzer && 
                   typeof window.criticalCSSAnalyzer.saveTripleOSToStorage === 'function';
        });
        
        console.log(`🔍 saveTripleOSToStorage method: ${saveMethodExists ? '✅ Available' : '❌ Not Found'}`);
        
        // showToastメソッドが追加されているかチェック
        const toastMethodExists = await page.evaluate(() => {
            return window.criticalCSSAnalyzer && 
                   typeof window.criticalCSSAnalyzer.showToast === 'function';
        });
        
        console.log(`🔍 showToast method: ${toastMethodExists ? '✅ Available' : '❌ Not Found'}`);
        
        console.log('\n📋 手動テスト手順（以下を目視確認してください）:');
        console.log('1. OS Analyzer診断を完了させる');
        console.log('2. 診断完了時にトースト通知「OS結果を保存しました（24時間有効）」が表示される');
        console.log('3. ブラウザDevTools → Application → Local Storage → haqei.tripleOS.v1 が存在する');
        console.log('4. JSONの内容が契約通りの形式である');
        
        // 検証用のコンソールテストコード提示
        console.log('\n📝 DevTools Console で以下を実行して検証:');
        console.log('// 保存データの確認');
        console.log('JSON.parse(localStorage.getItem("haqei.tripleOS.v1"));');
        console.log('');
        console.log('// 時刻形式の確認'); 
        console.log('const rec = JSON.parse(localStorage.getItem("haqei.tripleOS.v1"));');
        console.log('new Date(rec.createdAt) < new Date(rec.expiresAt);');
        console.log('');
        console.log('// トースト表示テスト');
        console.log('window.criticalCSSAnalyzer.showToast("テストメッセージ", "success");');
        
        console.log('\n⏳ 60秒間待機（手動テスト実行時間）...');
        await page.waitForTimeout(60000);
        
        // 最終的な保存状態確認
        const finalStorageState = await page.evaluate(() => {
            const raw = localStorage.getItem('haqei.tripleOS.v1');
            if (!raw) return { found: false };
            
            try {
                const parsed = JSON.parse(raw);
                return {
                    found: true,
                    data: parsed,
                    validDates: new Date(parsed.createdAt) < new Date(parsed.expiresAt),
                    hasRequired: !!(parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS)
                };
            } catch (e) {
                return { found: true, parseError: e.message };
            }
        });
        
        console.log('\n🎯 最終確認結果:');
        if (finalStorageState.found) {
            if (finalStorageState.parseError) {
                console.log('❌ データが壊れています:', finalStorageState.parseError);
            } else {
                console.log('✅ データが保存されています');
                console.log('  - 時刻整合性:', finalStorageState.validDates ? '✅' : '❌');
                console.log('  - 必須フィールド:', finalStorageState.hasRequired ? '✅' : '❌');
                console.log('  - Data preview:', JSON.stringify(finalStorageState.data, null, 2).substring(0, 200) + '...');
            }
        } else {
            console.log('❌ データが保存されていません');
        }
        
        console.log(`\n🔍 JavaScript エラー数: ${errors.length}`);
        if (errors.length > 0) {
            console.log('❌ 検出されたエラー:');
            errors.forEach(error => console.log(`  - ${error}`));
        }
        
        return {
            storageModuleLoaded,
            saveMethodExists,
            toastMethodExists,
            storageWorking: finalStorageState.found && !finalStorageState.parseError,
            errorCount: errors.length
        };
        
    } catch (error) {
        console.error('❌ テストエラー:', error);
        return { success: false, error: error.message };
    } finally {
        console.log('\n🔍 ブラウザを開いたまま残します（追加確認用）');
        // await browser.close(); // コメントアウト: 手動確認のため開いたままにする
    }
}

// 実行
testTripleOSStorage().then(result => {
    console.log('\n🎯 テスト結果サマリー:', result);
    
    const allGreen = result.storageModuleLoaded && 
                     result.saveMethodExists && 
                     result.toastMethodExists && 
                     result.errorCount === 0;
                     
    if (allGreen) {
        console.log('🎉 P1-1実装: 基本構成OK - 手動テスト結果次第で合格判定');
    } else {
        console.log('💥 P1-1実装: 要修正 - 上記の問題を解決してください');
    }
}).catch(console.error);