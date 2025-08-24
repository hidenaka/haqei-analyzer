/**
 * HAQEI Analyzer - クロスブラウザ & モバイル対応検証
 * Chrome, Firefox, Safari, モバイルでの動作確認
 */

import { chromium, firefox, webkit } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testBrowser(browserName, browserContext) {
    console.log(`\n🔍 ${browserName} テスト開始`);
    
    const page = await browserContext.newPage();
    
    // エラーキャプチャ
    const errors = [];
    page.on('pageerror', error => {
        errors.push(`${browserName}: ${error.message}`);
    });
    
    try {
        const resultsPath = join(__dirname, 'public', 'results.html');
        await page.goto(`file://${resultsPath}`);
        await page.waitForTimeout(3000);
        
        // 基本機能テスト
        const basicTest = await page.evaluate(() => {
            return {
                summaryGenerator: typeof window.SummaryGenerator !== 'undefined',
                v3Database: typeof window.HexagramHumanTraitsV3 !== 'undefined',
                basicResultsTab: typeof window.BasicResultsTab !== 'undefined'
            };
        });
        
        // SummaryGenerator機能テスト
        const functionalTest = await page.evaluate(() => {
            if (typeof window.SummaryGenerator === 'undefined') {
                return { error: 'SummaryGenerator未対応' };
            }
            
            try {
                const generator = new window.SummaryGenerator();
                const testData = {
                    engineOS: { hexagramName: '乾為天', score: 75 },
                    interfaceOS: { hexagramName: '兌為澤', score: 68 },
                    safeModeOS: { hexagramName: '坤為地', score: 82 }
                };
                
                const fourLine = generator.generateFourLineSummary(testData);
                return { 
                    success: true, 
                    hasContent: !!fourLine.line1 
                };
            } catch (error) {
                return { error: error.message };
            }
        });
        
        // UI要素の表示確認
        const uiTest = await page.evaluate(() => {
            const elements = {
                osCards: document.querySelectorAll('.haqei-os-card').length,
                progressBars: document.querySelectorAll('.haqei-progress-bar').length,
                accordions: document.querySelectorAll('.haqei-accordion-header').length
            };
            return elements;
        });
        
        return {
            browser: browserName,
            basic: basicTest,
            functional: functionalTest,
            ui: uiTest,
            errors: errors
        };
        
    } catch (error) {
        return {
            browser: browserName,
            error: error.message,
            errors: errors
        };
    } finally {
        await page.close();
    }
}

async function testMobileViewport(browserContext, deviceName, viewport) {
    console.log(`\n📱 ${deviceName} テスト開始`);
    
    const page = await browserContext.newPage();
    await page.setViewportSize(viewport);
    
    try {
        const resultsPath = join(__dirname, 'public', 'results.html');
        await page.goto(`file://${resultsPath}`);
        await page.waitForTimeout(3000);
        
        // モバイル表示確認
        const mobileTest = await page.evaluate(() => {
            const body = document.body;
            const computedStyle = getComputedStyle(body);
            
            return {
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                bodyWidth: body.offsetWidth,
                isMobileLayout: window.innerWidth < 768,
                hasResponsiveElements: document.querySelectorAll('[class*="mobile"], [class*="responsive"]').length > 0
            };
        });
        
        // UI要素のモバイル対応確認
        const mobileUiTest = await page.evaluate(() => {
            const osCards = Array.from(document.querySelectorAll('.haqei-os-card'));
            const isStackedLayout = osCards.length > 0 ? 
                osCards.every(card => card.offsetWidth > window.innerWidth * 0.8) : false;
            
            return {
                osCardsCount: osCards.length,
                isStackedLayout: isStackedLayout,
                maxCardWidth: Math.max(...osCards.map(card => card.offsetWidth))
            };
        });
        
        // スクロール動作確認
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        
        const scrollTest = await page.evaluate(() => {
            return {
                scrollHeight: document.body.scrollHeight,
                scrollY: window.scrollY,
                canScroll: document.body.scrollHeight > window.innerHeight
            };
        });
        
        return {
            device: deviceName,
            viewport: viewport,
            mobile: mobileTest,
            ui: mobileUiTest,
            scroll: scrollTest
        };
        
    } catch (error) {
        return {
            device: deviceName,
            error: error.message
        };
    } finally {
        await page.close();
    }
}

async function runCrossBrowserTests() {
    console.log('🌐 HAQEI SummaryGenerator クロスブラウザ & モバイル検証開始');
    
    const results = [];
    
    try {
        // Chrome テスト
        console.log('\n🔧 Chrome ブラウザテスト');
        const chromeBrowser = await chromium.launch({ headless: true });
        const chromeResult = await testBrowser('Chrome', chromeBrowser);
        results.push(chromeResult);
        await chromeBrowser.close();
        
        // Firefox テスト
        console.log('\n🦊 Firefox ブラウザテスト');
        const firefoxBrowser = await firefox.launch({ headless: true });
        const firefoxResult = await testBrowser('Firefox', firefoxBrowser);
        results.push(firefoxResult);
        await firefoxBrowser.close();
        
        // Safari/WebKit テスト
        console.log('\n🍎 Safari/WebKit ブラウザテスト');
        try {
            const webkitBrowser = await webkit.launch({ headless: true });
            const safariResult = await testBrowser('Safari', webkitBrowser);
            results.push(safariResult);
            await webkitBrowser.close();
        } catch (error) {
            console.log('⚠️ Safari/WebKit テストスキップ:', error.message);
            results.push({
                browser: 'Safari',
                error: 'WebKit not available: ' + error.message
            });
        }
        
        // モバイルデバイステスト
        console.log('\n📱 モバイルデバイステスト');
        const mobileChrome = await chromium.launch({ headless: true });
        
        const mobileDevices = [
            { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
            { name: 'iPad', viewport: { width: 768, height: 1024 } },
            { name: 'Android Phone', viewport: { width: 360, height: 640 } }
        ];
        
        const mobileResults = [];
        for (const device of mobileDevices) {
            const result = await testMobileViewport(mobileChrome, device.name, device.viewport);
            mobileResults.push(result);
        }
        
        await mobileChrome.close();
        
        // 📊 結果レポート生成
        console.log('\n📊 ========== クロスブラウザテスト結果 ==========');
        
        results.forEach(result => {
            if (result.error) {
                console.log(`❌ ${result.browser}: ${result.error}`);
            } else {
                const score = [
                    result.basic.summaryGenerator,
                    result.basic.v3Database, 
                    result.basic.basicResultsTab,
                    result.functional.success
                ].filter(Boolean).length;
                
                console.log(`${score === 4 ? '✅' : score >= 2 ? '⚡' : '❌'} ${result.browser}: ${score}/4 機能対応`);
                console.log(`   - SummaryGenerator: ${result.basic.summaryGenerator ? '✅' : '❌'}`);
                console.log(`   - V3データベース: ${result.basic.v3Database ? '✅' : '❌'}`);
                console.log(`   - BasicResultsTab: ${result.basic.basicResultsTab ? '✅' : '❌'}`);
                console.log(`   - 機能動作: ${result.functional.success ? '✅' : '❌'}`);
                console.log(`   - UI要素: Cards:${result.ui.osCards}, Progress:${result.ui.progressBars}, Accordions:${result.ui.accordions}`);
                
                if (result.errors.length > 0) {
                    console.log(`   - エラー: ${result.errors.length}件`);
                }
            }
        });
        
        console.log('\n📱 ========== モバイル対応テスト結果 ==========');
        
        mobileResults.forEach(result => {
            if (result.error) {
                console.log(`❌ ${result.device}: ${result.error}`);
            } else {
                const responsiveScore = [
                    result.mobile.isMobileLayout,
                    result.ui.isStackedLayout,
                    result.scroll.canScroll
                ].filter(Boolean).length;
                
                console.log(`${responsiveScore >= 2 ? '✅' : '⚡'} ${result.device} (${result.viewport.width}x${result.viewport.height})`);
                console.log(`   - モバイルレイアウト: ${result.mobile.isMobileLayout ? '✅' : '❌'}`);
                console.log(`   - カードスタック表示: ${result.ui.isStackedLayout ? '✅' : '❌'}`);
                console.log(`   - スクロール対応: ${result.scroll.canScroll ? '✅' : '❌'}`);
                console.log(`   - OSカード数: ${result.ui.osCardsCount}`);
            }
        });
        
        // 📋 総合評価
        console.log('\n🏆 ========== 総合評価 ==========');
        
        const browserSupport = results.filter(r => !r.error && r.functional?.success).length;
        const totalBrowsers = results.length;
        const mobileSupport = mobileResults.filter(r => !r.error && r.mobile?.isMobileLayout).length;
        const totalMobileDevices = mobileResults.length;
        
        console.log(`🌐 ブラウザ対応: ${browserSupport}/${totalBrowsers} (${Math.round(browserSupport/totalBrowsers*100)}%)`);
        console.log(`📱 モバイル対応: ${mobileSupport}/${totalMobileDevices} (${Math.round(mobileSupport/totalMobileDevices*100)}%)`);
        
        const overallScore = Math.round(((browserSupport/totalBrowsers) + (mobileSupport/totalMobileDevices)) / 2 * 100);
        
        if (overallScore >= 80) {
            console.log(`🌟 優秀: SummaryGeneratorは幅広い環境で正常に動作します (${overallScore}%)`);
        } else if (overallScore >= 60) {
            console.log(`⚡ 良好: SummaryGeneratorは主要環境で動作しますが改善余地があります (${overallScore}%)`);
        } else {
            console.log(`🔧 要改善: SummaryGeneratorのクロスプラットフォーム対応が必要です (${overallScore}%)`);
        }
        
        // 🎯 推奨事項
        console.log('\n🎯 推奨事項:');
        
        const failedBrowsers = results.filter(r => r.error || !r.functional?.success);
        if (failedBrowsers.length > 0) {
            console.log(`- ${failedBrowsers.map(r => r.browser).join(', ')} での動作改善`);
        }
        
        const poorMobileSupport = mobileResults.filter(r => r.error || !r.mobile?.isMobileLayout);
        if (poorMobileSupport.length > 0) {
            console.log(`- ${poorMobileSupport.map(r => r.device).join(', ')} でのレスポンシブ対応改善`);
        }
        
        if (browserSupport === totalBrowsers && mobileSupport === totalMobileDevices) {
            console.log('- 現在の実装は十分です。パフォーマンス最適化に注力できます');
        }
        
    } catch (error) {
        console.error('💥 テスト実行エラー:', error.message);
    }
    
    console.log('\n🔚 クロスブラウザ & モバイル検証完了');
}

// テスト実行
runCrossBrowserTests().catch(console.error);