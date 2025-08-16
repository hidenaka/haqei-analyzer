#!/usr/bin/env node
/**
 * ローカル静的配信のブラウザテスト
 */

import puppeteer from 'puppeteer';

async function testStaticDeployment() {
    console.log('🌐 ローカル静的配信のブラウザテスト開始...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // パフォーマンス測定
    const performanceMetrics = [];
    
    try {
        // 1. 静的配信サイトへアクセス
        console.log('📡 1. 静的配信テスト中...');
        
        const startTime = Date.now();
        await page.goto('http://localhost:8083/os_analyzer_clean.html', {
            waitUntil: 'networkidle2'
        });
        const loadTime = Date.now() - startTime;
        
        console.log(`   読み込み時間: ${loadTime}ms`);
        performanceMetrics.push(`LoadTime: ${loadTime}ms`);
        
        // 2. 基本要素の確認
        const basicElements = await page.evaluate(() => {
            return {
                title: document.title,
                hasWelcomeScreen: !!document.getElementById('welcome-screen'),
                hasStartButton: !!document.getElementById('start-btn'),
                bodyText: document.body.textContent.substring(0, 100),
                scriptsLoaded: document.querySelectorAll('script').length,
                stylesLoaded: document.querySelectorAll('link[rel="stylesheet"]').length
            };
        });
        
        console.log('🔍 2. 基本要素確認:');
        console.log(`   タイトル: ${basicElements.title}`);
        console.log(`   ウェルカム画面: ${basicElements.hasWelcomeScreen ? '✅' : '❌'}`);
        console.log(`   開始ボタン: ${basicElements.hasStartButton ? '✅' : '❌'}`);
        console.log(`   スクリプト数: ${basicElements.scriptsLoaded}`);
        console.log(`   CSS数: ${basicElements.stylesLoaded}`);
        
        // 3. セキュリティヘッダーの確認
        const securityHeaders = await page.evaluate(() => {
            // CSPメタタグの確認
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            return {
                hasCspMeta: !!cspMeta,
                cspContent: cspMeta ? cspMeta.getAttribute('content') : null
            };
        });
        
        console.log('🔒 3. セキュリティ設定:');
        console.log(`   CSPメタタグ: ${securityHeaders.hasCspMeta ? '✅' : '⚠️'}`);
        
        // 4. Core Web Vitals測定
        const metrics = await page.evaluate(() => {
            return new Promise((resolve) => {
                if ('web-vital' in window) {
                    resolve({ lcp: 'N/A', fid: 'N/A', cls: 'N/A' });
                } else {
                    // 簡易的なLCP測定
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lcp = entries[entries.length - 1];
                        resolve({
                            lcp: Math.round(lcp ? lcp.startTime : 0),
                            fid: 'N/A',
                            cls: 'N/A'
                        });
                    });
                    observer.observe({ type: 'largest-contentful-paint', buffered: true });
                    
                    // タイムアウト
                    setTimeout(() => {
                        resolve({ lcp: '測定タイムアウト', fid: 'N/A', cls: 'N/A' });
                    }, 3000);
                }
            });
        });
        
        console.log('⚡ 4. Core Web Vitals:');
        console.log(`   LCP (Largest Contentful Paint): ${metrics.lcp}ms ${metrics.lcp < 2500 ? '✅' : '⚠️'}`);
        
        // 5. 機能テスト
        console.log('🧪 5. 基本機能テスト:');
        
        // 開始ボタンのクリックテスト
        if (basicElements.hasStartButton) {
            await page.click('#start-btn');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const afterClick = await page.evaluate(() => {
                const questionScreen = document.getElementById('question-screen');
                return {
                    questionScreenActive: questionScreen ? questionScreen.classList.contains('active') : false,
                    questionTitle: document.getElementById('question-title')?.textContent || 'N/A'
                };
            });
            
            console.log(`   分析開始機能: ${afterClick.questionScreenActive ? '✅' : '❌'}`);
            console.log(`   質問表示: ${afterClick.questionTitle !== 'N/A' ? '✅' : '❌'}`);
        }
        
        // 6. スクリーンショット撮影
        await page.screenshot({ 
            path: 'test-static-deployment.png',
            fullPage: false
        });
        console.log('\n📸 test-static-deployment.png 保存完了');
        
        // 7. リソース読み込み確認
        const resources = await page.evaluate(() => {
            const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
            const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
            
            return {
                scripts: scripts.length,
                styles: styles.length,
                externalResources: [...scripts, ...styles].filter(url => !url.includes('localhost')).length
            };
        });
        
        console.log('📦 6. リソース読み込み状況:');
        console.log(`   JavaScriptファイル: ${resources.scripts}個`);
        console.log(`   CSSファイル: ${resources.styles}個`);
        console.log(`   外部リソース: ${resources.externalResources}個 ${resources.externalResources === 0 ? '✅' : '⚠️'}`);
        
        // 8. 総合評価
        const overallSuccess = 
            basicElements.hasWelcomeScreen &&
            basicElements.hasStartButton &&
            loadTime < 5000 &&
            resources.externalResources === 0;
            
        console.log('\n' + '='.repeat(60));
        console.log('🎯 ローカル静的配信テスト結果:');
        console.log('='.repeat(60));
        console.log(`📄 HTML配信: ${basicElements.title ? '✅' : '❌'}`);
        console.log(`🎨 UI表示: ${basicElements.hasWelcomeScreen ? '✅' : '❌'}`);
        console.log(`⚡ 読み込み速度: ${loadTime}ms ${loadTime < 3000 ? '✅' : '⚠️'}`);
        console.log(`🔒 セキュリティ: ${securityHeaders.hasCspMeta ? '✅' : '⚠️'}`);
        console.log(`📦 自己完結性: ${resources.externalResources === 0 ? '✅ 外部依存なし' : '⚠️ 外部依存あり'}`);
        console.log(`🧪 基本機能: ${afterClick?.questionScreenActive ? '✅' : '⚠️'}`);
        console.log('='.repeat(60));
        console.log(`🏆 総合評価: ${overallSuccess ? '✅ 静的配信成功' : '⚠️ 要確認項目あり'}`);
        console.log('='.repeat(60));
        
        console.log('\n⏸️ ブラウザは開いたままです。手動で確認してください。');
        process.stdin.resume();
        
    } catch (error) {
        console.error('❌ テストエラー:', error.message);
        await browser.close();
    }
}

testStaticDeployment().catch(console.error);