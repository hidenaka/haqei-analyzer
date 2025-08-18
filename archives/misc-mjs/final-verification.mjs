import { chromium } from 'playwright';

async function finalVerification() {
    console.log('🎯 最終動作確認\n');
    console.log('='.repeat(50));
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300
    });
    
    const page = await browser.newContext().then(ctx => ctx.newPage());
    
    try {
        // future_simulator.html確認
        console.log('\n📍 1. future_simulator.html確認');
        await page.goto('http://localhost:8080/public/future_simulator.html');
        await page.waitForTimeout(1500);
        
        await page.fill('#worryInput', 'テスト：転職するかどうか悩んでいます');
        await page.click('#aiGuessBtn');
        await page.waitForTimeout(3000);
        
        const futureSimResult = await page.evaluate(() => {
            const cards = document.querySelectorAll('.scenarios-container .scenario-card');
            return {
                scenarioCount: cards.length,
                hasContainer: document.querySelector('.scenarios-container') !== null
            };
        });
        
        console.log(`  シナリオ数: ${futureSimResult.scenarioCount}`);
        console.log(`  状態: ${futureSimResult.scenarioCount === 8 ? '✅ 正常' : '❌ 異常'}`);
        
        // os_analyzer.html確認
        console.log('\n📍 2. os_analyzer.html確認');
        await page.goto('http://localhost:8080/public/os_analyzer.html');
        await page.waitForTimeout(1500);
        
        const osAnalyzerResult = await page.evaluate(() => {
            return {
                title: document.title,
                hasTripleOS: document.body.textContent.includes('Triple OS'),
                hasFutureSimulator: document.body.textContent.includes('Future Simulator'),
                startBtnText: document.getElementById('start-btn')?.textContent?.trim()
            };
        });
        
        console.log(`  タイトル: ${osAnalyzerResult.title.substring(0, 30)}...`);
        console.log(`  Triple OS: ${osAnalyzerResult.hasTripleOS ? '✅' : '❌'}`);
        console.log(`  Future Simulator混入: ${osAnalyzerResult.hasFutureSimulator ? '❌ あり' : '✅ なし'}`);
        
        // 総合結果
        console.log('\n' + '='.repeat(50));
        console.log('📊 最終結果:');
        
        if (futureSimResult.scenarioCount === 8 && !osAnalyzerResult.hasFutureSimulator) {
            console.log('\n🎉 すべて正常に修正されました！');
            console.log('  - future_simulator.html: 8シナリオ生成機能正常');
            console.log('  - os_analyzer.html: Triple OS分析機能のみ（正常）');
        } else {
            console.log('\n⚠️ 一部問題があります');
            if (futureSimResult.scenarioCount !== 8) {
                console.log(`  - future_simulator.html: シナリオ数異常（${futureSimResult.scenarioCount}個）`);
            }
            if (osAnalyzerResult.hasFutureSimulator) {
                console.log('  - os_analyzer.html: Future Simulator要素が残っている');
            }
        }
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
    } finally {
        console.log('\n⏸️ Enterキーで終了...');
        await new Promise(resolve => process.stdin.once('data', resolve));
        await browser.close();
    }
}

finalVerification();