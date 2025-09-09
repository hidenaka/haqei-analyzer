#!/usr/bin/env node

/**
 * V3データ表示テスト
 * Interface OSとSafeMode OSのV3データが正しく表示されるか確認
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
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('\n📱 OSアナライザーでテストデータを設定中...');
    
    // OSアナライザーへアクセス
    await page.goto(`http://localhost:${port}/os_analyzer.html`);
    await page.waitForTimeout(1000);
    
    // テストデータを設定（各OSに異なる卦を設定）
    const testData = {
        engineOS: {
            name: 'Engine OS',
            hexagram: { symbol: '☰', name: '乾為天' },
            hexagramId: 1,
            score: 85,
            traits: ['創造的', 'リーダー']
        },
        interfaceOS: {
            name: 'Interface OS',
            hexagram: { symbol: '☷', name: '坤為地' },
            hexagramId: 2,
            score: 72,
            traits: ['協調的', '社交的']
        },
        safeModeOS: {
            name: 'SafeMode OS',
            hexagram: { symbol: '☲', name: '離為火' },
            hexagramId: 30,
            score: 65,
            traits: ['安定', '保守的']
        }
    };
    
    // LocalStorageにテストデータを保存
    await page.evaluate((data) => {
        localStorage.setItem('haqei_analysis_result', JSON.stringify(data));
        localStorage.setItem('haqei_timestamp', new Date().toISOString());
        console.log('✅ テストデータ設定完了:', data);
    }, testData);
    
    console.log('📊 結果ページへ遷移...');
    
    // 結果ページへ移動
    await page.goto(`http://localhost:${port}/results.html`);
    await page.waitForTimeout(2000);
    
    // V3データの表示を確認
    console.log('\n🔍 V3データ表示確認:');
    
    // Engine OSカードの確認
    const engineOSCard = await page.evaluate(() => {
        const card = document.querySelector('.os-card-engine');
        if (!card) return null;
        
        return {
            type: card.querySelector('.v3-type .v3-value')?.textContent,
            description: card.querySelector('.v3-description p')?.textContent,
            normalState: card.querySelector('.v3-example p')?.textContent,
            energyLevel: card.querySelector('.v3-energy span:last-child')?.textContent,
            advice: card.querySelector('.v3-advice p')?.textContent
        };
    });
    
    console.log('\n✅ Engine OS V3データ:');
    console.log('  タイプ:', engineOSCard?.type || '❌ 未表示');
    console.log('  説明:', engineOSCard?.description?.substring(0, 50) || '❌ 未表示');
    console.log('  通常状態:', engineOSCard?.normalState?.substring(0, 50) || '❌ 未表示');
    console.log('  エネルギー:', engineOSCard?.energyLevel || '❌ 未表示');
    console.log('  アドバイス:', engineOSCard?.advice?.substring(0, 50) || '❌ 未表示');
    
    // Interface OSカードの確認
    const interfaceOSCard = await page.evaluate(() => {
        const card = document.querySelector('.os-card-interface');
        if (!card) return null;
        
        return {
            type: card.querySelector('.v3-type .v3-value')?.textContent,
            description: card.querySelector('.v3-description p')?.textContent,
            communication: card.querySelector('.v3-communication p')?.textContent,
            example: card.querySelector('.v3-example p')?.textContent,
            environment: card.querySelector('.v3-environment p')?.textContent,
            relationshipTips: card.querySelector('.v3-advice p')?.textContent
        };
    });
    
    console.log('\n✅ Interface OS V3データ:');
    console.log('  タイプ:', interfaceOSCard?.type || '❌ 未表示');
    console.log('  説明:', interfaceOSCard?.description?.substring(0, 50) || '❌ 未表示');
    console.log('  コミュニケーション:', interfaceOSCard?.communication?.substring(0, 50) || '❌ 未表示');
    console.log('  例:', interfaceOSCard?.example?.substring(0, 50) || '❌ 未表示');
    console.log('  最適な環境:', interfaceOSCard?.environment?.substring(0, 50) || '❌ 未表示');
    console.log('  関係性のヒント:', interfaceOSCard?.relationshipTips?.substring(0, 50) || '❌ 未表示');
    
    // SafeMode OSカードの確認
    const safeModeOSCard = await page.evaluate(() => {
        const card = document.querySelector('.os-card-safemode');
        if (!card) return null;
        
        return {
            type: card.querySelector('.v3-type .v3-value')?.textContent,
            description: card.querySelector('.v3-description p')?.textContent,
            stressResponse: card.querySelector('.v3-stress p')?.textContent,
            example: card.querySelector('.v3-example p')?.textContent,
            emergencyMode: card.querySelector('.v3-emergency p')?.textContent,
            recovery: card.querySelector('.v3-advice p')?.textContent
        };
    });
    
    console.log('\n✅ SafeMode OS V3データ:');
    console.log('  タイプ:', safeModeOSCard?.type || '❌ 未表示');
    console.log('  説明:', safeModeOSCard?.description?.substring(0, 50) || '❌ 未表示');
    console.log('  ストレス反応:', safeModeOSCard?.stressResponse?.substring(0, 50) || '❌ 未表示');
    console.log('  例:', safeModeOSCard?.example?.substring(0, 50) || '❌ 未表示');
    console.log('  緊急モード:', safeModeOSCard?.emergencyMode?.substring(0, 50) || '❌ 未表示');
    console.log('  回復方法:', safeModeOSCard?.recovery?.substring(0, 50) || '❌ 未表示');
    
    // スクリーンショット保存
    await page.screenshot({ path: 'v3-display-test.png', fullPage: true });
    console.log('\n📸 スクリーンショット保存: v3-display-test.png');
    
    // 結果サマリー
    console.log('\n📋 テスト結果サマリー:');
    const engineOK = engineOSCard && engineOSCard.type && engineOSCard.normalState;
    const interfaceOK = interfaceOSCard && interfaceOSCard.type && interfaceOSCard.communication;
    const safeModeOK = safeModeOSCard && safeModeOSCard.type && safeModeOSCard.stressResponse;
    
    console.log('  Engine OS V3データ:', engineOK ? '✅ 正常表示' : '❌ 不完全');
    console.log('  Interface OS V3データ:', interfaceOK ? '✅ 正常表示' : '❌ 不完全');
    console.log('  SafeMode OS V3データ:', safeModeOK ? '✅ 正常表示' : '❌ 不完全');
    
    if (engineOK && interfaceOK && safeModeOK) {
        console.log('\n🎉 すべてのV3データが正常に表示されています！');
    } else {
        console.log('\n⚠️ 一部のV3データが表示されていません。修正が必要です。');
    }
    
    console.log('\nブラウザを閉じるには、任意のキーを押してください...');
    
    // キー入力待機
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async () => {
        await browser.close();
        server.close();
        process.exit(0);
    });
});