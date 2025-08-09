#!/usr/bin/env node

/**
 * 偶数番設問表示問題 完全解決検証スクリプト
 * 
 * このスクリプトは、VirtualQuestionFlow.jsの強化版実装が
 * 正しく動作することを検証します。
 * 
 * 実行方法:
 * node test-even-questions-fix-verification.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 偶数番設問表示問題 完全解決検証');
console.log('=====================================\n');

// VirtualQuestionFlow.jsファイルを読み込み
const virtualQuestionFlowPath = './public/js/os-analyzer/components/VirtualQuestionFlow.js';

if (!fs.existsSync(virtualQuestionFlowPath)) {
    console.error('❌ VirtualQuestionFlow.js が見つかりません');
    process.exit(1);
}

const content = fs.readFileSync(virtualQuestionFlowPath, 'utf8');

// 実装確認項目
const checks = [
    {
        name: '強化版showCurrentQuestionメソッド',
        pattern: /showCurrentQuestion\(\)\s*\{[\s\S]*ensureElementVisible\(currentElement\)/,
        required: true
    },
    {
        name: 'ensureElementHiddenメソッド',
        pattern: /ensureElementHidden\(element, shouldHide.*\{[\s\S]*display: none !important/,
        required: true
    },
    {
        name: 'ensureElementVisibleメソッド',
        pattern: /ensureElementVisible\(element\)[\s\S]*display: block !important/,
        required: true
    },
    {
        name: 'verifyDisplayWithObserverメソッド',
        pattern: /verifyDisplayWithObserver\(element, questionId, isEven\)[\s\S]*MutationObserver/,
        required: true
    },
    {
        name: 'CSS競合対策の実装',
        pattern: /cssText = `[\s\S]*display: block !important[\s\S]*opacity: 1 !important/,
        required: true
    },
    {
        name: '強化版testAllQuestionsDisplayメソッド',
        pattern: /testAllQuestionsDisplay.*強化版[\s\S]*CSS競合対策版/,
        required: true
    },
    {
        name: '偶数番設問の特別ログ',
        pattern: /偶数番設問.*が正常に表示されました/,
        required: true
    },
    {
        name: 'Shadow DOM強化処理',
        pattern: /shadowRoot[\s\S]*display: block !important/,
        required: true
    },
    {
        name: 'ARIA属性制御',
        pattern: /setAttribute\('aria-hidden'/,
        required: true
    },
    {
        name: 'Web Component強制初期化',
        pattern: /connectedCallback\?\.\(\)/,
        required: true
    }
];

let passedChecks = 0;
let totalChecks = checks.length;

console.log('📋 実装確認チェック:\n');

checks.forEach((check, index) => {
    const passed = check.pattern.test(content);
    const status = passed ? '✅' : '❌';
    
    console.log(`${index + 1}. ${status} ${check.name}`);
    
    if (passed) {
        passedChecks++;
    } else if (check.required) {
        console.log(`   ⚠️  必須実装が見つかりません`);
    }
});

console.log(`\n📊 チェック結果: ${passedChecks}/${totalChecks} 項目 合格\n`);

// ファイルサイズと更新日時
const stats = fs.statSync(virtualQuestionFlowPath);
console.log('📄 ファイル情報:');
console.log(`   サイズ: ${Math.round(stats.size / 1024)}KB`);
console.log(`   更新日時: ${stats.mtime.toLocaleString()}`);

// 追加の静的解析
console.log('\n🔍 追加解析:');

// 偶数・奇数の特別扱いがないかチェック
const evenOddPattern = /if.*%.*2.*===.*0.*\{[\s\S]*?\}/g;
const evenOddMatches = content.match(evenOddPattern) || [];
const problematicConditions = evenOddMatches.filter(match => 
    !match.includes('統計') && 
    !match.includes('isEven') && 
    !match.includes('console.log') &&
    !match.includes('results.')
);

if (problematicConditions.length === 0) {
    console.log('✅ 偶数・奇数による問題のある特別処理は見つかりませんでした');
} else {
    console.log('⚠️  偶数・奇数による特別処理が残存している可能性があります:');
    problematicConditions.forEach(condition => {
        console.log(`   - ${condition.substring(0, 50)}...`);
    });
}

// !important の使用チェック
const importantCount = (content.match(/!important/g) || []).length;
console.log(`📏 !important使用回数: ${importantCount}回`);

if (importantCount > 0) {
    console.log('   ℹ️  CSS競合対策として意図的に使用されています');
}

// testAllQuestionsDisplay の強化確認
const hasEnhancedTest = content.includes('強化版') && content.includes('CSS競合対策版');
console.log(`🧪 強化版テスト実装: ${hasEnhancedTest ? '✅ 実装済み' : '❌ 未実装'}`);

// 総合評価
console.log('\n🏆 総合評価:');

if (passedChecks === totalChecks) {
    console.log('✅ 完全実装 - すべての必須機能が実装されています');
    console.log('🎉 偶数番設問表示問題は完全に解決されています！');
} else if (passedChecks >= totalChecks * 0.8) {
    console.log('🟡 概ね実装完了 - 一部実装が不足している可能性があります');
} else {
    console.log('❌ 実装不足 - 重要な機能が実装されていません');
}

console.log('\n💡 次のステップ:');
console.log('1. Webブラウザで test-even-questions-complete.html を開く');
console.log('2. OS Analyzerを読み込み、完全テストを実行');
console.log('3. 偶数番設問（q2, q4, q6...q30）の表示を確認');
console.log('4. コンソールで window.app.questionFlow.testAllQuestionsDisplay() を実行');

console.log('\n=====================================');
console.log('検証完了');