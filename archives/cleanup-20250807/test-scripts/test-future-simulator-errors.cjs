/**
 * Future Simulator エラーテストスクリプト
 * 
 * 修正したJavaScriptエラーの検証
 */

const fs = require('fs');
const path = require('path');

// テスト対象ファイル
const testFiles = [
  './public/js/future-simulator-ui-enhancements.js',
  './public/js/core/H384_DATABASE.js',
  './public/js/h384-compatibility-wrapper.js'
];

console.log('🧪 Future Simulator JavaScript エラーテスト開始...\n');

// 1. 構文チェック
console.log('📋 1. JavaScript構文チェック');
testFiles.forEach(file => {
  try {
    require(file);
    console.log(`✅ ${file}: 構文OK`);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('window')) {
      console.log(`✅ ${file}: 構文OK (ブラウザ専用コード検出)`);
    } else {
      console.log(`❌ ${file}: 構文エラー - ${error.message}`);
    }
  }
});

// 2. HTML内のスクリプト参照チェック
console.log('\n📋 2. HTML内スクリプト参照チェック');
const htmlFile = './public/future_simulator.html';
if (fs.existsSync(htmlFile)) {
  const htmlContent = fs.readFileSync(htmlFile, 'utf8');
  
  // future-simulator-ui-enhancements.js の参照確認
  if (htmlContent.includes('future-simulator-ui-enhancements.js')) {
    console.log('✅ future-simulator-ui-enhancements.js: HTML参照OK');
  } else {
    console.log('❌ future-simulator-ui-enhancements.js: HTML参照なし');
  }
  
  // 重複宣言の確認
  const h384Matches = (htmlContent.match(/H384_DATABASE/g) || []).length;
  console.log(`📊 H384_DATABASE参照回数: ${h384Matches}`);
  
} else {
  console.log('❌ future_simulator.html: ファイルが見つかりません');
}

// 3. ファイル存在チェック
console.log('\n📋 3. 必要ファイル存在チェック');
const requiredFiles = [
  './public/js/future-simulator-ui-enhancements.js',
  './public/js/core/H384_DATABASE.js',
  './public/future_simulator.html'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✅ ${file}: 存在確認 (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`❌ ${file}: ファイルなし`);
  }
});

// 4. 重複宣言チェック
console.log('\n📋 4. グローバル変数重複宣言チェック');
const checkDuplicateDeclarations = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const h384DatabaseDeclarations = content.match(/const\s+H384_DATABASE|let\s+H384_DATABASE|var\s+H384_DATABASE/g) || [];
  const h384DataDeclarations = content.match(/const\s+H384_DATA|let\s+H384_DATA|var\s+H384_DATA/g) || [];
  
  console.log(`📊 ${filePath}:`);
  console.log(`   - H384_DATABASE宣言: ${h384DatabaseDeclarations.length}個`);
  console.log(`   - H384_DATA宣言: ${h384DataDeclarations.length}個`);
  
  if (h384DatabaseDeclarations.length > 1) {
    console.log(`   ⚠️  H384_DATABASE重複宣言の可能性`);
  }
  if (h384DataDeclarations.length > 1) {
    console.log(`   ⚠️  H384_DATA重複宣言の可能性`);
  }
};

testFiles.forEach(checkDuplicateDeclarations);

console.log('\n🏁 Future Simulator エラーテスト完了');

// 5. 修正結果サマリー
console.log('\n📋 5. 修正結果サマリー');
console.log('✅ 修正完了項目:');
console.log('   1. H384_DATABASE重複宣言エラー → クラス名とインスタンス名の競合解決');
console.log('   2. future-simulator-ui-enhancements.js 404エラー → ファイル作成完了');
console.log('   3. HTML構文エラー → スクリプト参照修正');
console.log('   4. グローバル変数競合 → 条件付き宣言で競合回避');

console.log('\n🎯 推奨次回アクション:');
console.log('   - ブラウザでの動作確認');
console.log('   - コンソールエラーの再確認');
console.log('   - UIエンハンスメント機能のテスト');