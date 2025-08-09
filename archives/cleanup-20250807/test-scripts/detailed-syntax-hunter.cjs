const fs = require('fs');

console.log('🔍 より詳細なJavaScript構文エラー解析');

// HTMLファイルを読み込み
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// メインスクリプトタグを抽出
const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatches[scriptMatches.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 解析対象: ${jsCode.length} 文字のメインスクリプト`);

// より厳密なtry-catch-finally解析
const lines = jsCode.split('\n');
let braceStack = [];
let tryBlocks = [];
let currentTryBlock = null;

lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // tryブロック開始の検出（より厳密に）
    if (trimmedLine.match(/^\s*try\s*\{/)) {
        currentTryBlock = {
            startLine: lineNum,
            content: trimmedLine,
            braceDepth: 0,
            hasCatch: false,
            hasFinally: false,
            endLine: null
        };
        tryBlocks.push(currentTryBlock);
        console.log(`🔍 TRY開始 [行 ${lineNum}]: ${trimmedLine}`);
    }
    
    // 波括弧の追跡
    let openBraces = (line.match(/\{/g) || []).length;
    let closeBraces = (line.match(/\}/g) || []).length;
    
    if (currentTryBlock) {
        currentTryBlock.braceDepth += openBraces - closeBraces;
        
        // tryブロック終了の検出
        if (currentTryBlock.braceDepth <= 0 && closeBraces > 0) {
            currentTryBlock.endLine = lineNum;
            console.log(`🔍 TRY終了候補 [行 ${lineNum}]: ${trimmedLine}`);
        }
    }
    
    // catchブロックの検出
    if (trimmedLine.match(/^\s*\}\s*catch\s*\(/)) {
        if (currentTryBlock) {
            currentTryBlock.hasCatch = true;
            console.log(`✅ CATCH発見 [行 ${lineNum}]: ${trimmedLine}`);
        }
    }
    
    // finallyブロックの検出
    if (trimmedLine.match(/^\s*\}\s*finally\s*\{/)) {
        if (currentTryBlock) {
            currentTryBlock.hasFinally = true;
            console.log(`✅ FINALLY発見 [行 ${lineNum}]: ${trimmedLine}`);
        }
    }
    
    // 新しいtry以外の文や関数が始まったらcurrentTryBlockをリセット
    if (trimmedLine.match(/^(class|function|const|let|var|if|for|while)/) && !trimmedLine.includes('try')) {
        if (currentTryBlock && !currentTryBlock.hasCatch && !currentTryBlock.hasFinally) {
            // 問題があるブロックとしてマーク
            console.log(`🚨 未完了TRYブロック [行 ${currentTryBlock.startLine}-${lineNum}]`);
        }
        currentTryBlock = null;
    }
});

// 問題のあるtryブロックの詳細分析
console.log(`\n📊 TRYブロック解析結果:`);
console.log(`総TRYブロック数: ${tryBlocks.length}`);

const problematicBlocks = tryBlocks.filter(block => !block.hasCatch && !block.hasFinally);

if (problematicBlocks.length > 0) {
    console.log(`\n❌ 問題のあるTRYブロック: ${problematicBlocks.length}個`);
    
    problematicBlocks.forEach((block, index) => {
        console.log(`\n🚨 問題ブロック ${index + 1}:`);
        console.log(`   開始行: ${block.startLine}`);
        console.log(`   内容: ${block.content}`);
        console.log(`   終了行: ${block.endLine || '不明'}`);
        console.log(`   CATCH: ${block.hasCatch ? 'あり' : 'なし'}`);
        console.log(`   FINALLY: ${block.hasFinally ? 'あり' : 'なし'}`);
        
        // 問題箇所の周辺コードを表示
        const startIdx = Math.max(0, block.startLine - 5);
        const endIdx = Math.min(lines.length - 1, (block.endLine || block.startLine) + 10);
        
        console.log(`\n📝 周辺コード (行 ${startIdx + 1} - ${endIdx + 1}):`);
        for (let i = startIdx; i <= endIdx; i++) {
            const marker = (i + 1 === block.startLine) ? '>>>' : '   ';
            console.log(`${marker} ${i + 1}: ${lines[i]}`);
        }
    });
} else {
    console.log('✅ すべてのTRYブロックが正常です');
}

console.log('\n🎯 詳細解析完了');