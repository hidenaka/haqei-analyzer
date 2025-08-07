const fs = require('fs');

console.log('🔧 精密TRY-CATCH修正ツール実行中...');

// ファイルを読み込み
let content = fs.readFileSync('public/os_analyzer.html', 'utf8');

console.log(`📄 Original file size: ${Math.round(content.length / 1024)}KB`);

// 重複catch文の削除（batch-fix-try-catch.cjsで追加された不正なcatch文）
let fixCount = 0;

// パターン1: 重複catch文の削除
const duplicateCatchPattern = /(\}\s*catch\s*\([^)]*\)\s*\{[^}]*\}\s*)\s*\}\s*catch\s*\(error\)\s*\{\s*console\.error\(`❌ Operation failed: \$\{error\.message\}`\);\s*return null; \/\/ Default fallback\s*\}/g;

content = content.replace(duplicateCatchPattern, (match, originalCatch) => {
    fixCount++;
    console.log(`🔧 Fix ${fixCount}: Removed duplicate catch block`);
    return originalCatch; // 元のcatch文のみ残す
});

// パターン2: 不正なcatch文の単独削除
const standaloneDuplicatePattern = /\s*\}\s*catch\s*\(error\)\s*\{\s*console\.error\(`❌ Operation failed: \$\{error\.message\}`\);\s*return null; \/\/ Default fallback\s*\}/g;

const beforeCleanup = content;
content = content.replace(standaloneDuplicatePattern, '');
const removedStandalone = (beforeCleanup.length - content.length) / 150; // Rough estimate

if (removedStandalone > 0) {
    console.log(`🧹 Cleaned up ${Math.round(removedStandalone)} standalone duplicate catches`);
}

// パターン3: 真の未完了try文の検出と修正
const lines = content.split('\n');
let realIncompleteBlocks = [];
let inTryBlock = false;
let braceDepth = 0;
let tryStartIndex = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // tryブロック開始検出
    if (trimmedLine.match(/^try\s*\{/) && !inTryBlock) {
        inTryBlock = true;
        tryStartIndex = i;
        braceDepth = 1;
        continue;
    }
    
    if (inTryBlock) {
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceDepth += openBraces - closeBraces;
        
        // tryブロックが終了した場合
        if (braceDepth <= 0) {
            // 次の行がcatchかfinallyかチェック
            const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
            const nextTrimmed = nextLine.trim();
            
            if (!nextTrimmed.startsWith('} catch') && !nextTrimmed.startsWith('}catch') && 
                !nextTrimmed.startsWith('} finally') && !nextTrimmed.startsWith('}finally') &&
                !nextTrimmed.startsWith('catch') && !nextTrimmed.startsWith('finally')) {
                
                realIncompleteBlocks.push({
                    startLine: tryStartIndex,
                    endLine: i,
                    content: lines[tryStartIndex].trim()
                });
            }
            
            inTryBlock = false;
            braceDepth = 0;
        }
    }
}

console.log(`\n🔍 Found ${realIncompleteBlocks.length} truly incomplete try blocks:`);
realIncompleteBlocks.forEach((block, index) => {
    console.log(`   ${index + 1}. Line ${block.startLine + 1}: ${block.content}`);
});

// 真の未完了try文の修正
if (realIncompleteBlocks.length > 0) {
    const newLines = [...lines];
    let insertOffset = 0;
    
    realIncompleteBlocks.forEach((block, index) => {
        const insertAt = block.endLine + 1 + insertOffset;
        const indent = lines[block.endLine].match(/^(\s*)/)[1];
        
        newLines.splice(insertAt, 0, 
            indent + '} catch (error) {',
            indent + '    console.error(`❌ Error: ${error.message}`);',
            indent + '    return null;'
        );
        
        insertOffset += 3;
        console.log(`🔧 Added catch block for try at line ${block.startLine + 1}`);
    });
    
    content = newLines.join('\n');
}

// ファイルを保存
fs.writeFileSync('public/os_analyzer.html', content);

console.log(`\n🎉 修正完了！`);
console.log(`📊 重複catch削除: ${fixCount}個`);
console.log(`📊 真の未完了try修正: ${realIncompleteBlocks.length}個`);
console.log(`📄 最終ファイルサイズ: ${Math.round(content.length / 1024)}KB`);

console.log('\n✅ 通常モード用TRY-CATCH構造修正完了');