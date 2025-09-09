import { chromium } from 'playwright';

console.log('🔍 TRAE実装レビューテスト開始\n');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// コンソールログ収集
const logs = [];
const errors = [];
page.on('console', msg => {
    if (msg.type() === 'error') {
        errors.push(msg.text());
    }
});

page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
});

try {
    // ページを開く
    console.log('📍 ページを開く...');
    await page.goto('http://localhost:8012/public/results.html', {
        waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);

    // エラーチェック
    console.log('\n🔴 エラーチェック');
    if (errors.length > 0) {
        console.log('❌ JavaScriptエラー:', errors.length + '件');
        errors.slice(0, 3).forEach(err => console.log('  - ' + err.substring(0, 100)));
    } else {
        console.log('✅ エラーなし');
    }

    // OSカードの表示確認
    console.log('\n🎴 OSカード表示確認');
    const osCardInfo = await page.evaluate(() => {
        const cards = document.querySelectorAll('.os-card');
        return {
            count: cards.length,
            hasContent: cards.length > 0 && Array.from(cards).some(card => 
                card.querySelector('.os-title')?.textContent && 
                card.querySelector('.os-score-value')?.textContent
            )
        };
    });

    console.log(`  カード数: ${osCardInfo.count}`);
    console.log(`  コンテンツ: ${osCardInfo.hasContent ? '✅ あり' : '❌ なし'}`);

    // H384データベース確認
    console.log('\n💾 H384データベース');
    const h384Check = await page.evaluate(() => {
        return {
            loaded: typeof H384_DATA !== 'undefined',
            extractor: typeof HexagramExtractor !== 'undefined'
        };
    });
    console.log(`  データ: ${h384Check.loaded ? '✅' : '❌'}`);
    console.log(`  Extractor: ${h384Check.extractor ? '✅' : '❌'}`);

    // 詳細なカード情報
    if (osCardInfo.count > 0) {
        console.log('\n📊 カード詳細:');
        const cardDetails = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.os-card')).slice(0, 3).map(card => ({
                title: card.querySelector('.os-title')?.textContent || 'なし',
                score: card.querySelector('.os-score-value')?.textContent || 'なし',
                hexagram: card.querySelector('.hexagram-name')?.textContent || 'なし',
                keywords: Array.from(card.querySelectorAll('.keyword-tag')).map(k => k.textContent).join(', ') || 'なし'
            }));
        });
        
        cardDetails.forEach((card, i) => {
            console.log(`  ${i+1}. ${card.title}: スコア${card.score}, ${card.hexagram}`);
            if (card.keywords !== 'なし') {
                console.log(`     キーワード: ${card.keywords}`);
            }
        });
    }

    // スクリーンショット
    await page.screenshot({ 
        path: 'test-result.png', 
        fullPage: true 
    });
    console.log('\n📸 スクリーンショット: test-result.png');

    // 総合評価
    const score = {
        errors: errors.length === 0 ? 30 : 0,
        cards: osCardInfo.count >= 3 ? 30 : 0,
        content: osCardInfo.hasContent ? 30 : 0,
        database: h384Check.loaded && h384Check.extractor ? 10 : 0
    };
    
    const total = Object.values(score).reduce((a, b) => a + b, 0);
    
    console.log('\n========== 評価 ==========');
    console.log(`エラーなし: ${score.errors}/30点`);
    console.log(`カード表示: ${score.cards}/30点`);
    console.log(`コンテンツ: ${score.content}/30点`);
    console.log(`データ統合: ${score.database}/10点`);
    console.log(`総合: ${total}/100点`);
    
    if (total >= 80) {
        console.log('\n🎉 優秀な実装です！');
    } else if (total >= 60) {
        console.log('\n✅ 良い実装です');
    } else {
        console.log('\n⚠️ 改善が必要です');
    }

} finally {
    await browser.close();
}