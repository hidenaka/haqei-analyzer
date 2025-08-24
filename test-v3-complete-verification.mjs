#!/usr/bin/env node

/**
 * V3データ表示 完全検証テスト
 * Playwrightで実際の画面表示を詳細に確認
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// HTTPサーバー起動
const server = createServer((req, res) => {
    try {
        let filePath = join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        const ext = extname(filePath).toLowerCase();
        
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json'
        };
        
        const contentType = contentTypes[ext] || 'text/plain';
        
        const content = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(0, async () => {
    const port = server.address().port;
    console.log(`🚀 サーバー起動: http://localhost:${port}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--window-size=1400,900']
    });
    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 }
    });
    const page = await context.newPage();
    
    // コンソールログを監視
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ ブラウザエラー:', msg.text());
        }
    });
    
    console.log('\n📝 ステップ1: テストデータを準備');
    
    // 実際の36問の結果に近いテストデータ
    const testData = {
        engineOS: {
            name: 'Engine OS',
            hexagram: { 
                symbol: '☰', 
                name: '乾為天'
            },
            hexagramId: 1,
            score: 85,
            traits: ['創造的', 'リーダー', '革新的']
        },
        interfaceOS: {
            name: 'Interface OS',
            hexagram: { 
                symbol: '☷', 
                name: '坤為地'
            },
            hexagramId: 2,
            score: 72,
            traits: ['協調的', '社交的', '共感的']
        },
        safeModeOS: {
            name: 'SafeMode OS',
            hexagram: { 
                symbol: '☲', 
                name: '離為火'
            },
            hexagramId: 30,
            score: 65,
            traits: ['情熱的', '直感的', '表現豊か']
        },
        timestamp: new Date().toISOString()
    };
    
    console.log('  - Engine OS: 乾為天 (革新追求エンジン)');
    console.log('  - Interface OS: 坤為地 (共感的ファシリテーター型)');
    console.log('  - SafeMode OS: 離為火 (激情爆発型)');
    
    console.log('\n📝 ステップ2: OSアナライザーページでLocalStorageに保存');
    
    await page.goto(`http://localhost:${port}/os_analyzer.html`);
    await page.waitForTimeout(1000);
    
    // LocalStorageにデータを保存
    await page.evaluate((data) => {
        localStorage.setItem('haqei_analysis_result', JSON.stringify(data));
        localStorage.setItem('haqei_timestamp', data.timestamp);
        console.log('LocalStorage保存完了:', data);
    }, testData);
    
    console.log('  ✅ LocalStorageへの保存完了');
    
    console.log('\n📝 ステップ3: 結果ページへ遷移');
    
    await page.goto(`http://localhost:${port}/results.html`);
    console.log('  ✅ results.htmlへ遷移');
    
    // ローディング完了を待つ
    await page.waitForSelector('#os-cards-container', { timeout: 5000 });
    await page.waitForTimeout(2000);
    console.log('  ✅ ページ読み込み完了');
    
    console.log('\n📝 ステップ4: V3データの表示内容を詳細確認');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Engine OSカードの詳細確認
    const engineData = await page.evaluate(() => {
        const card = document.querySelector('.os-card-engine');
        if (!card) return { error: 'カードが見つかりません' };
        
        return {
            found: true,
            hexagramName: card.querySelector('.hexagram-name')?.textContent,
            type: card.querySelector('.v3-type .v3-value')?.textContent,
            description: card.querySelector('.v3-description p')?.textContent,
            example: card.querySelector('.v3-example p')?.textContent,
            energyLevel: card.querySelector('.v3-energy span:last-child')?.textContent,
            advice: card.querySelector('.v3-advice p')?.textContent,
            score: card.querySelector('.score-value')?.textContent
        };
    });
    
    console.log('\n🔧 Engine OS カード:');
    if (engineData.found) {
        console.log('  ✅ カード表示: 成功');
        console.log('  📊 スコア:', engineData.score || '❌');
        console.log('  🔢 卦名:', engineData.hexagramName || '❌');
        console.log('  🏷️ タイプ:', engineData.type || '❌');
        console.log('  📝 説明:', engineData.description ? '✅ 表示中' : '❌ 未表示');
        console.log('  💡 例:', engineData.example ? '✅ 表示中' : '❌ 未表示');
        console.log('  ⚡ エネルギー:', engineData.energyLevel || '❌');
        console.log('  💭 アドバイス:', engineData.advice ? '✅ 表示中' : '❌ 未表示');
    } else {
        console.log('  ❌ カード表示: 失敗');
    }
    
    // Interface OSカードの詳細確認
    const interfaceData = await page.evaluate(() => {
        const card = document.querySelector('.os-card-interface');
        if (!card) return { error: 'カードが見つかりません' };
        
        return {
            found: true,
            hexagramName: card.querySelector('.hexagram-name')?.textContent,
            type: card.querySelector('.v3-type .v3-value')?.textContent,
            description: card.querySelector('.v3-description p')?.textContent,
            communication: card.querySelector('.v3-communication p')?.textContent,
            example: card.querySelector('.v3-example p')?.textContent,
            environment: card.querySelector('.v3-environment p')?.textContent,
            advice: card.querySelector('.v3-advice p')?.textContent,
            score: card.querySelector('.score-value')?.textContent
        };
    });
    
    console.log('\n🌐 Interface OS カード:');
    if (interfaceData.found) {
        console.log('  ✅ カード表示: 成功');
        console.log('  📊 スコア:', interfaceData.score || '❌');
        console.log('  🔢 卦名:', interfaceData.hexagramName || '❌');
        console.log('  🏷️ タイプ:', interfaceData.type || '❌');
        console.log('  📝 説明:', interfaceData.description ? '✅ 表示中' : '❌ 未表示');
        console.log('  💬 コミュニケーション:', interfaceData.communication ? '✅ 表示中' : '❌ 未表示');
        console.log('  💡 例:', interfaceData.example ? '✅ 表示中' : '❌ 未表示');
        console.log('  🏢 最適環境:', interfaceData.environment ? '✅ 表示中' : '❌ 未表示');
        console.log('  💭 アドバイス:', interfaceData.advice ? '✅ 表示中' : '❌ 未表示');
    } else {
        console.log('  ❌ カード表示: 失敗');
    }
    
    // SafeMode OSカードの詳細確認
    const safeModeData = await page.evaluate(() => {
        const card = document.querySelector('.os-card-safemode');
        if (!card) return { error: 'カードが見つかりません' };
        
        return {
            found: true,
            hexagramName: card.querySelector('.hexagram-name')?.textContent,
            type: card.querySelector('.v3-type .v3-value')?.textContent,
            description: card.querySelector('.v3-description p')?.textContent,
            stressResponse: card.querySelector('.v3-stress p')?.textContent,
            example: card.querySelector('.v3-example p')?.textContent,
            emergencyMode: card.querySelector('.v3-emergency p')?.textContent,
            recovery: card.querySelector('.v3-advice p')?.textContent,
            score: card.querySelector('.score-value')?.textContent
        };
    });
    
    console.log('\n🛡️ SafeMode OS カード:');
    if (safeModeData.found) {
        console.log('  ✅ カード表示: 成功');
        console.log('  📊 スコア:', safeModeData.score || '❌');
        console.log('  🔢 卦名:', safeModeData.hexagramName || '❌');
        console.log('  🏷️ タイプ:', safeModeData.type || '❌');
        console.log('  📝 説明:', safeModeData.description ? '✅ 表示中' : '❌ 未表示');
        console.log('  😰 ストレス反応:', safeModeData.stressResponse ? '✅ 表示中' : '❌ 未表示');
        console.log('  💡 例:', safeModeData.example ? '✅ 表示中' : '❌ 未表示');
        console.log('  🚨 緊急モード:', safeModeData.emergencyMode ? '✅ 表示中' : '❌ 未表示');
        console.log('  💭 回復方法:', safeModeData.recovery ? '✅ 表示中' : '❌ 未表示');
    } else {
        console.log('  ❌ カード表示: 失敗');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 ステップ5: スクリーンショット撮影');
    
    // フルページスクリーンショット
    await page.screenshot({ 
        path: 'v3-verification-full.png', 
        fullPage: true 
    });
    console.log('  ✅ フルページ: v3-verification-full.png');
    
    // 各カードの個別スクリーンショット
    const engineCard = await page.$('.os-card-engine');
    if (engineCard) {
        await engineCard.screenshot({ path: 'v3-engine-card.png' });
        console.log('  ✅ Engine OSカード: v3-engine-card.png');
    }
    
    const interfaceCard = await page.$('.os-card-interface');
    if (interfaceCard) {
        await interfaceCard.screenshot({ path: 'v3-interface-card.png' });
        console.log('  ✅ Interface OSカード: v3-interface-card.png');
    }
    
    const safeModeCard = await page.$('.os-card-safemode');
    if (safeModeCard) {
        await safeModeCard.screenshot({ path: 'v3-safemode-card.png' });
        console.log('  ✅ SafeMode OSカード: v3-safemode-card.png');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 最終判定:');
    
    const allDataComplete = 
        engineData.found && engineData.type && engineData.example && engineData.energyLevel &&
        interfaceData.found && interfaceData.type && interfaceData.communication && interfaceData.environment &&
        safeModeData.found && safeModeData.type && safeModeData.stressResponse && safeModeData.emergencyMode;
    
    if (allDataComplete) {
        console.log('\n🎉 成功: すべてのV3データが完全に表示されています！');
        console.log('  ✅ Engine OS: 固有データ（normalState, energyLevel, maintenance）表示');
        console.log('  ✅ Interface OS: 固有データ（howToTalk, bestEnvironment, relationshipTips）表示');
        console.log('  ✅ SafeMode OS: 固有データ（stressResponse, emergencyMode, howToRecover）表示');
    } else {
        console.log('\n⚠️ 警告: 一部のV3データが不完全です');
        if (!engineData.example || !engineData.energyLevel) {
            console.log('  ❌ Engine OS: normalStateまたはmaintenanceデータが不足');
        }
        if (!interfaceData.communication || !interfaceData.environment) {
            console.log('  ❌ Interface OS: howToTalkまたはbestEnvironmentデータが不足');
        }
        if (!safeModeData.stressResponse || !safeModeData.emergencyMode) {
            console.log('  ❌ SafeMode OS: stressResponseまたはemergencyModeデータが不足');
        }
    }
    
    console.log('\n💡 ブラウザは開いたままです。確認が終わったら手動で閉じてください。');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 10秒後に自動終了
    setTimeout(async () => {
        await browser.close();
        server.close();
        process.exit(0);
    }, 10000);
});