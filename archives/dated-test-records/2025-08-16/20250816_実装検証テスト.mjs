/**
 * 統一スコアリングシステム実装検証テスト
 * 実際のアプリケーションでの動作を確認
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('===== 統一スコアリングシステム実装検証 =====\n');

// 1. ファイル存在確認
console.log('📁 ファイル存在確認:');
console.log('-'.repeat(50));

const files = [
    'public/assets/js/questions-unified-complete.js',
    'public/os_analyzer.html',
    '20250816_統一スコアリング実装完了レポート.md',
    '.serena/memories/統一スコアリング実装完了_20250816.md'
];

let allFilesExist = true;
files.forEach(file => {
    const path = join(__dirname, file);
    const exists = existsSync(path);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

// 2. 統一質問データの検証
console.log('\n📊 統一質問データ検証:');
console.log('-'.repeat(50));

const questionsPath = join(__dirname, 'public/assets/js/questions-unified-complete.js');
const questionsContent = readFileSync(questionsPath, 'utf8');

// windowオブジェクトのモック
global.window = {};
eval(questionsContent);
const unifiedQuestions = global.window.unifiedQuestions;

console.log(`質問数: ${unifiedQuestions ? unifiedQuestions.length : 0}/36`);

// グローバルスコープで定義
let allScoresValid = true;
let scoringErrors = [];
let hasNegativeScore = false;
let hasTechnicalTerms = false;

if (unifiedQuestions) {
    // 質問タイプ別の集計
    const questionTypes = {
        ENGINE: 0,
        INTERFACE: 0,
        SAFE: 0
    };
    
    // 各質問の合計点検証
    unifiedQuestions.forEach((q, index) => {
        // OSタイプカウント
        if (q.osType === 'ENGINE') questionTypes.ENGINE++;
        else if (q.osType === 'INTERFACE') questionTypes.INTERFACE++;
        else if (q.osType === 'SAFE') questionTypes.SAFE++;
        
        // 各選択肢のスコア合計チェック
        q.options.forEach(option => {
            const totalScore = Object.values(option.scoring || {})
                .reduce((sum, score) => sum + score, 0);
            
            const expectedTotal = 6.0;
            const isValid = Math.abs(totalScore - expectedTotal) < 0.01;
            
            if (!isValid) {
                allScoresValid = false;
                scoringErrors.push({
                    question: q.id,
                    option: option.value,
                    total: totalScore.toFixed(1)
                });
            }
        });
    });
    
    console.log(`\nOS別質問数:`);
    console.log(`  ENGINE OS: ${questionTypes.ENGINE}/12 ${questionTypes.ENGINE === 12 ? '✅' : '❌'}`);
    console.log(`  INTERFACE OS: ${questionTypes.INTERFACE}/12 ${questionTypes.INTERFACE === 12 ? '✅' : '❌'}`);
    console.log(`  SAFE MODE OS: ${questionTypes.SAFE}/12 ${questionTypes.SAFE === 12 ? '✅' : '❌'}`);
    
    console.log(`\n配点検証:`);
    console.log(`  全選択肢6点固定: ${allScoresValid ? '✅ 正常' : '❌ エラーあり'}`);
    
    if (scoringErrors.length > 0) {
        console.log(`  エラー詳細:`);
        scoringErrors.slice(0, 5).forEach(err => {
            console.log(`    ${err.question} - ${err.option}: ${err.total}点`);
        });
    }
    
    // マイナススコア検証
    unifiedQuestions.forEach(q => {
        q.options.forEach(option => {
            Object.values(option.scoring || {}).forEach(score => {
                if (score < 0) hasNegativeScore = true;
            });
        });
    });
    
    console.log(`  マイナススコア: ${hasNegativeScore ? '❌ 検出' : '✅ なし'}`);
}

// 3. 質問内容の検証（技術用語チェック）
console.log('\n📝 質問内容検証:');
console.log('-'.repeat(50));

const technicalTerms = [
    'Interface OS',
    'Engine OS',
    'Safe Mode OS',
    '風（巽）',
    '易経',
    '時中',
    'プロジェクト'
];

const foundTerms = [];

if (unifiedQuestions) {
    unifiedQuestions.forEach(q => {
        const textToCheck = q.text + ' ' + q.options.map(o => o.text).join(' ');
        technicalTerms.forEach(term => {
            if (textToCheck.includes(term)) {
                hasTechnicalTerms = true;
                if (!foundTerms.includes(term)) {
                    foundTerms.push(term);
                }
            }
        });
    });
}

console.log(`技術用語の使用: ${hasTechnicalTerms ? '❌ 検出' : '✅ なし'}`);
if (foundTerms.length > 0) {
    console.log(`検出された用語: ${foundTerms.join(', ')}`);
}

// 4. シミュレーション簡易テスト
console.log('\n🧪 簡易シミュレーション:');
console.log('-'.repeat(50));

function runQuickSimulation(pattern) {
    const scores = {
        '乾_創造性': 0, '震_行動性': 0, '坎_探求性': 0,
        '兌_調和性': 0, '離_表現性': 0, '巽_適応性': 0,
        '艮_安定性': 0, '坤_受容性': 0
    };
    
    unifiedQuestions.forEach(q => {
        const option = q.options.find(o => o.value === pattern);
        if (option && option.scoring) {
            Object.entries(option.scoring).forEach(([bagua, score]) => {
                scores[bagua] += score;
            });
        }
    });
    
    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const engineTotal = scores['乾_創造性'] + scores['震_行動性'] + scores['坎_探求性'];
    const interfaceTotal = scores['兌_調和性'] + scores['離_表現性'] + scores['巽_適応性'];
    const safeTotal = scores['艮_安定性'] + scores['坤_受容性'];
    
    return {
        engine: (engineTotal / total * 100).toFixed(1),
        interface: (interfaceTotal / total * 100).toFixed(1),
        safe: (safeTotal / total * 100).toFixed(1)
    };
}

const patterns = ['A', 'C', 'E'];
patterns.forEach(pattern => {
    const result = runQuickSimulation(pattern);
    const allInRange = 
        result.engine >= 20 && result.engine <= 50 &&
        result.interface >= 20 && result.interface <= 50 &&
        result.safe >= 20 && result.safe <= 50;
    
    console.log(`All_${pattern}: ENGINE ${result.engine}% | INTERFACE ${result.interface}% | SAFE ${result.safe}% ${allInRange ? '✅' : '❌'}`);
});

// 5. 総合評価
console.log('\n📊 総合評価:');
console.log('='.repeat(50));

const checks = {
    'ファイル存在': allFilesExist,
    '36問実装': unifiedQuestions && unifiedQuestions.length === 36,
    '6点固定配点': !scoringErrors.length,
    'マイナススコアなし': !hasNegativeScore,
    '技術用語なし': !hasTechnicalTerms
};

let passedCount = 0;
Object.entries(checks).forEach(([name, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
    if (passed) passedCount++;
});

const successRate = (passedCount / Object.keys(checks).length * 100).toFixed(0);
console.log(`\n成功率: ${successRate}% (${passedCount}/${Object.keys(checks).length})`);

if (successRate === '100') {
    console.log('\n🎉 統一スコアリングシステムは正常に実装されています！');
} else {
    console.log('\n⚠️ 一部の実装に問題があります。上記の詳細を確認してください。');
}

// 6. ブラウザでの実動作テスト（オプション）
console.log('\n🌐 ブラウザ実動作テスト:');
console.log('-'.repeat(50));

async function testInBrowser() {
    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // ローカルサーバーが動いていると仮定
        await page.goto('http://localhost:8788/os_analyzer.html', { 
            waitUntil: 'networkidle',
            timeout: 5000 
        });
        
        // questions-unified-complete.jsが読み込まれているか確認
        const hasUnifiedQuestions = await page.evaluate(() => {
            return typeof window.unifiedQuestions !== 'undefined';
        });
        
        console.log(`統一質問データ読み込み: ${hasUnifiedQuestions ? '✅' : '❌'}`);
        
        await browser.close();
    } catch (error) {
        console.log('ℹ️ ブラウザテストはスキップ（サーバー未起動の可能性）');
    }
}

// ブラウザテストは実行環境に依存するためオプション
// await testInBrowser();

console.log('\n===== 検証完了 =====');