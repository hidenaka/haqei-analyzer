const fs = require('fs');
const path = require('path');

function fixNewlines(filePath) {
  try {
    console.log(`修正中: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // \n文字リテラルを実際の改行に置換
    const originalContent = content;
    
    // パターン1: \\n  を実際の改行に
    content = content.replace(/\\n  /g, '\n  ');
    
    // パターン2: \\n} を実際の改行に
    content = content.replace(/\\n}/g, '\n}');
    
    // パターン3: \\n\n を実際の改行に
    content = content.replace(/\\n\n/g, '\n\n');
    
    // パターン4: 単独の\\n
    content = content.replace(/\\n/g, '\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 修正完了: ${filePath}`);
      return true;
    } else {
      console.log(`📝 変更なし: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ エラー ${filePath}:`, error.message);
    return false;
  }
}

// 修正対象ファイル
const filesToFix = [
  '/Users/nakanohideaki/Desktop/haqei-analyzer/public/js/utils/ChunkLoader.js',
  '/Users/nakanohideaki/Desktop/haqei-analyzer/public/js/utils/BundleOptimizer.js',
  '/Users/nakanohideaki/Desktop/haqei-analyzer/public/js/utils/CodeSplitter.js'
];

console.log('🔧 JavaScript構文エラー一括修正開始...');

let fixedCount = 0;
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    if (fixNewlines(file)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️ ファイルが見つかりません: ${file}`);
  }
});

console.log(`\n🎯 修正完了: ${fixedCount}/${filesToFix.length} ファイル`);