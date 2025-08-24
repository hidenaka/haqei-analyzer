import { chromium } from 'playwright';

console.log('🔍 TRAE実装レビューテスト開始\n');

const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
});
const context = await browser.newContext();
const page = await context.newPage();

// コンソールログ収集
const logs = [];
const errors = [];
page.on('console', msg => {
    if (msg.type() === 'error') {
        errors.push(msg.text());
    }
    logs.push(`[${msg.type()}] ${msg.text()}`);
});

page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
});

// Step 1: ページを開く
console.log('📍 Step 1: ページを開く');
await page.goto('http://localhost:8012/public/results.html', {
    waitUntil: 'networkidle'
});
await page.waitForTimeout(2000);

// Step 2: エラーチェック
console.log('\n🔴 Step 2: エラーチェック');
if (errors.length > 0) {
    console.log('❌ JavaScriptエラーが発生しています:');
    errors.forEach(err => console.log('  - ' + err));
} else {
    console.log('✅ JavaScriptエラーなし');
}

// Step 3: 必要な要素の存在確認
console.log('\n📋 Step 3: 必要な要素の存在確認');
const elementChecks = await page.evaluate(() => {
    return {
        h384Data: typeof H384_DATA !== 'undefined',
        hexagramExtractor: typeof HexagramExtractor !== 'undefined',
        basicResultsTab: typeof BasicResultsTab !== 'undefined',
        storageManager: typeof StorageManager !== 'undefined',
        tabNavigator: typeof TabNavigator !== 'undefined',
        osCardsContainer: !!document.getElementById('osCardsContainer'),
        summaryContent: !!document.getElementById('summaryContent'),
        actionButtons: !!document.getElementById('actionButtons')
    };
});

Object.entries(elementChecks).forEach(([key, value]) => {
    console.log(`  ${value ? '✅' : '❌'} ${key}`);
});

// Step 4: OSカードの表示確認
console.log('\n🎴 Step 4: OSカードの表示確認');

// エラーコンテナを非表示
await page.evaluate(() => {
    const errorContainer = document.getElementById('error-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    if (errorContainer) errorContainer.style.display = 'none';
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        loadingOverlay.classList.remove('active');
    }
});

const osCardInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('.os-card');
    return {
        count: cards.length,
        cards: Array.from(cards).map(card => ({
            title: card.querySelector('.os-title')?.textContent,
            score: card.querySelector('.os-score-value')?.textContent,
            scoreLevel: card.querySelector('.score-level')?.textContent,
            hexagramSymbol: card.querySelector('.hexagram-symbol')?.textContent,
            hexagramName: card.querySelector('.hexagram-name')?.textContent,
            hexagramMeaning: card.querySelector('.hexagram-meaning')?.textContent,
            keywords: Array.from(card.querySelectorAll('.keyword-tag')).map(k => k.textContent),
            progressBar: !!card.querySelector('.progress-bar'),
            advice: card.querySelector('.hexagram-advice')?.textContent
        }))
    };
});

console.log(`OSカード数: ${osCardInfo.count}`);
if (osCardInfo.count > 0) {
    osCardInfo.cards.forEach((card, i) => {
        console.log(`\n  カード${i+1}:`);
        console.log(`    タイトル: ${card.title || '❌ なし'}`);
        console.log(`    スコア: ${card.score || '❌ なし'} (${card.scoreLevel || 'レベル表示なし'})`);
        console.log(`    易卦: ${card.hexagramSymbol || '❌'} ${card.hexagramName || '名前なし'}`);
        console.log(`    意味: ${card.hexagramMeaning ? '✅ あり' : '❌ なし'}`);
        console.log(`    キーワード: ${card.keywords.length > 0 ? card.keywords.join(', ') : '❌ なし'}`);
        console.log(`    プログレスバー: ${card.progressBar ? '✅' : '❌'}`);
        console.log(`    アドバイス: ${card.advice ? '✅ あり' : '❌ なし'}`);
    });
} else {
    console.log('❌ OSカードが表示されていません');
}

// Step 5: H384データベースの活用確認
console.log('\n💾 Step 5: H384データベースの活用確認');
const h384Usage = await page.evaluate(() => {
    if (typeof HexagramExtractor === 'undefined') {
        return { error: 'HexagramExtractorが未定義' };
    }
    
    const extractor = new HexagramExtractor();
    const testHexagram = '乾為天';
    const data = extractor.getHexagramDataByName(testHexagram);
    
    return {
        dataLoaded: data.length > 0,
        yaoCount: data.length,
        sampleYao: data[0] ? {
            yao: data[0]['爻'],
            keywords: data[0]['キーワード'],
            interpretation: data[0]['現代解釈の要約'],
            basicScore: data[0]['S1_基本スコア']
        } : null,
        statistics: extractor.getHexagramStatistics ? extractor.getHexagramStatistics(testHexagram) : null
    };
});

if (h384Usage.error) {
    console.log(`❌ ${h384Usage.error}`);
} else {
    console.log(`  データ読み込み: ${h384Usage.dataLoaded ? '✅' : '❌'}`);
    console.log(`  爻データ数: ${h384Usage.yaoCount}`);
    if (h384Usage.sampleYao) {
        console.log(`  サンプル爻: ${h384Usage.sampleYao.yao}`);
        console.log(`    キーワード: ${h384Usage.sampleYao.keywords?.join(', ')}`);
        console.log(`    基本スコア: ${h384Usage.sampleYao.basicScore}`);
    }
    if (h384Usage.statistics) {
        console.log(`  統計情報: 平均スコア ${h384Usage.statistics.averageScore?.toFixed(1)}`);
    }
}

// Step 6: スコア解釈機能の確認
console.log('\n📊 Step 6: スコア解釈機能の確認');
const scoreInterpretation = await page.evaluate(() => {
    const cards = document.querySelectorAll('.os-card');
    return Array.from(cards).map(card => {
        const scoreText = card.querySelector('.os-score-value')?.textContent;
        const score = parseInt(scoreText);
        const level = card.querySelector('.score-level')?.textContent;
        const progressBar = card.querySelector('.progress-bar');
        const width = progressBar ? progressBar.style.width : null;
        const color = progressBar ? progressBar.style.backgroundColor : null;
        
        return {
            score,
            level,
            progressWidth: width,
            progressColor: color
        };
    });
});

scoreInterpretation.forEach((item, i) => {
    console.log(`  カード${i+1}: スコア${item.score} → "${item.level}" (幅:${item.progressWidth}, 色:${item.progressColor})`);
});

// Step 7: ユーザビリティチェック
console.log('\n🎨 Step 7: ユーザビリティチェック');
const usabilityChecks = await page.evaluate(() => {
    const checks = {
        readability: {
            fontSize: window.getComputedStyle(document.querySelector('.os-card') || document.body).fontSize,
            hexagramVisible: !!document.querySelector('.hexagram-symbol'),
            keywordsReadable: !!document.querySelector('.keyword-tag')
        },
        interactivity: {
            buttonsClickable: document.querySelectorAll('.action-btn').length,
            hoverEffects: !!document.querySelector('.os-card:hover')
        },
        mobile: {
            viewport: document.querySelector('meta[name="viewport"]')?.content,
            responsive: window.innerWidth < 768 ? 'モバイル' : 'デスクトップ'
        }
    };
    return checks;
});

console.log('  可読性:');
console.log(`    フォントサイズ: ${usabilityChecks.readability.fontSize}`);
console.log(`    易卦表示: ${usabilityChecks.readability.hexagramVisible ? '✅' : '❌'}`);
console.log(`    キーワード: ${usabilityChecks.readability.keywordsReadable ? '✅' : '❌'}`);
console.log('  インタラクティブ性:');
console.log(`    アクションボタン数: ${usabilityChecks.interactivity.buttonsClickable}`);
console.log('  レスポンシブ:');
console.log(`    表示モード: ${usabilityChecks.mobile.responsive}`);

// Step 8: スクリーンショット
await page.screenshot({ 
    path: 'trae-review-screenshot.png', 
    fullPage: true 
});
console.log('\n📸 スクリーンショット保存: trae-review-screenshot.png');

// 最終評価
console.log('\n========== 最終評価 ==========');
const finalScore = {
    technical: 0,
    usability: 0,
    dataIntegration: 0
};

// 技術的実装
if (elementChecks.h384Data && elementChecks.hexagramExtractor) finalScore.technical += 30;
if (errors.length === 0) finalScore.technical += 20;

// ユーザビリティ
if (osCardInfo.count >= 3) finalScore.usability += 20;
if (osCardInfo.cards[0]?.hexagramMeaning) finalScore.usability += 15;
if (osCardInfo.cards[0]?.keywords.length > 0) finalScore.usability += 15;

// データ統合
if (h384Usage.dataLoaded) finalScore.dataIntegration += 30;
if (h384Usage.yaoCount === 6 || h384Usage.yaoCount === 7) finalScore.dataIntegration += 20;

const totalScore = finalScore.technical + finalScore.usability + finalScore.dataIntegration;

console.log(`技術的実装: ${finalScore.technical}/50点`);
console.log(`ユーザビリティ: ${finalScore.usability}/50点`);
console.log(`データ統合: ${finalScore.dataIntegration}/50点`);
console.log(`総合評価: ${totalScore}/150点`);

if (totalScore >= 120) {
    console.log('\n🎉 優秀な実装です！');
} else if (totalScore >= 90) {
    console.log('\n✅ 良い実装ですが、改善の余地があります');
} else {
    console.log('\n⚠️ 重要な改善が必要です');
}

console.log('\n🌐 ブラウザは開いたままです。手動で確認してください。');
console.log('終了するには Ctrl+C を押してください。');

// 無限待機
await new Promise(() => {});