#!/usr/bin/env node

/**
 * V3データ表示クイックテスト（自動終了版）
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
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // テストデータを設定
    const testData = {
        engineOS: {
            name: 'Engine OS',
            hexagram: { symbol: '☰', name: '乾為天' },
            hexagramId: 1,
            score: 85
        },
        interfaceOS: {
            name: 'Interface OS',
            hexagram: { symbol: '☷', name: '坤為地' },
            hexagramId: 2,
            score: 72
        },
        safeModeOS: {
            name: 'SafeMode OS',
            hexagram: { symbol: '☲', name: '離為火' },
            hexagramId: 30,
            score: 65
        }
    };
    
    // OSアナライザーでデータ設定
    await page.goto(`http://localhost:${port}/os_analyzer.html`);
    await page.evaluate((data) => {
        localStorage.setItem('haqei_analysis_result', JSON.stringify(data));
        localStorage.setItem('haqei_timestamp', new Date().toISOString());
    }, testData);
    
    // 結果ページへ移動
    await page.goto(`http://localhost:${port}/results.html`);
    await page.waitForTimeout(2000);
    
    // V3データの表示を確認
    const results = await page.evaluate(() => {
        const getCardData = (selector) => {
            const card = document.querySelector(selector);
            if (!card) return null;
            
            return {
                type: card.querySelector('.v3-type .v3-value')?.textContent,
                description: card.querySelector('.v3-description p')?.textContent?.substring(0, 50),
                hasSpecificData: {
                    // Engine OS用
                    normalState: !!card.querySelector('.v3-example p')?.textContent,
                    energyLevel: !!card.querySelector('.v3-energy span:last-child')?.textContent,
                    // Interface OS用
                    communication: !!card.querySelector('.v3-communication p')?.textContent,
                    environment: !!card.querySelector('.v3-environment p')?.textContent,
                    // SafeMode OS用
                    stressResponse: !!card.querySelector('.v3-stress p')?.textContent,
                    emergencyMode: !!card.querySelector('.v3-emergency p')?.textContent
                },
                advice: !!card.querySelector('.v3-advice p')?.textContent
            };
        };
        
        return {
            engine: getCardData('.os-card-engine'),
            interface: getCardData('.os-card-interface'),
            safemode: getCardData('.os-card-safemode')
        };
    });
    
    // 結果表示
    console.log('\n📋 V3データ表示チェック結果:\n');
    
    console.log('Engine OS:');
    console.log('  ✅ タイプ:', results.engine?.type || '❌ 未表示');
    console.log('  ✅ 説明:', results.engine?.description ? '表示中' : '❌ 未表示');
    console.log('  ✅ 通常状態例:', results.engine?.hasSpecificData.normalState ? '表示中' : '❌ 未表示');
    console.log('  ✅ エネルギー:', results.engine?.hasSpecificData.energyLevel ? '表示中' : '❌ 未表示');
    console.log('  ✅ アドバイス:', results.engine?.advice ? '表示中' : '❌ 未表示');
    
    console.log('\nInterface OS:');
    console.log('  ✅ タイプ:', results.interface?.type || '❌ 未表示');
    console.log('  ✅ 説明:', results.interface?.description ? '表示中' : '❌ 未表示');
    console.log('  ✅ コミュニケーション:', results.interface?.hasSpecificData.communication ? '表示中' : '❌ 未表示');
    console.log('  ✅ 最適環境:', results.interface?.hasSpecificData.environment ? '表示中' : '❌ 未表示');
    console.log('  ✅ アドバイス:', results.interface?.advice ? '表示中' : '❌ 未表示');
    
    console.log('\nSafeMode OS:');
    console.log('  ✅ タイプ:', results.safemode?.type || '❌ 未表示');
    console.log('  ✅ 説明:', results.safemode?.description ? '表示中' : '❌ 未表示');
    console.log('  ✅ ストレス反応:', results.safemode?.hasSpecificData.stressResponse ? '表示中' : '❌ 未表示');
    console.log('  ✅ 緊急モード:', results.safemode?.hasSpecificData.emergencyMode ? '表示中' : '❌ 未表示');
    console.log('  ✅ アドバイス:', results.safemode?.advice ? '表示中' : '❌ 未表示');
    
    // 総合判定
    const engineOK = results.engine?.type && results.engine?.hasSpecificData.normalState;
    const interfaceOK = results.interface?.type && results.interface?.hasSpecificData.communication;
    const safemodeOK = results.safemode?.type && results.safemode?.hasSpecificData.stressResponse;
    
    console.log('\n📊 総合判定:');
    if (engineOK && interfaceOK && safemodeOK) {
        console.log('🎉 すべてのV3データが正常に表示されています！');
    } else {
        console.log('⚠️ 一部のV3データが表示されていません。');
        if (!engineOK) console.log('  - Engine OSの固有データが不完全');
        if (!interfaceOK) console.log('  - Interface OSの固有データが不完全');
        if (!safemodeOK) console.log('  - SafeMode OSの固有データが不完全');
    }
    
    // スクリーンショット保存
    await page.screenshot({ path: 'v3-display-final.png', fullPage: true });
    console.log('\n📸 スクリーンショット: v3-display-final.png');
    
    await browser.close();
    server.close();
    process.exit(0);
});