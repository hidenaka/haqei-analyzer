const fs = require('fs');

console.log('🔍 JavaScript構文エラー詳細解析開始');

// HTMLファイルを読み込み
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// 最後の大きなscriptタグを抽出
const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatches[scriptMatches.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 メインスクリプトサイズ: ${jsCode.length} 文字`);

// try-catch-finallyの構造解析
let tryCount = 0;
let catchCount = 0;
let finallyCount = 0;
let braceDepth = 0;
let inTryBlock = false;
let tryPositions = [];

const lines = jsCode.split('\n');

lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // tryブロック開始検出
    if (trimmedLine.includes('try') && trimmedLine.includes('{')) {
        tryCount++;
        inTryBlock = true;
        tryPositions.push({
            line: lineNum,
            content: trimmedLine,
            hasCorrespondingCatch: false,
            hasCorrespondingFinally: false
        });
        console.log(`🔍 try ブロック発見 [行 ${lineNum}]: ${trimmedLine}`);
    }
    
    // catchブロック検出
    if (trimmedLine.includes('catch') && trimmedLine.includes('(')) {
        catchCount++;
        // 最新のtryブロックにcatch対応を記録
        if (tryPositions.length > 0) {
            tryPositions[tryPositions.length - 1].hasCorrespondingCatch = true;
        }
        console.log(`✅ catch ブロック発見 [行 ${lineNum}]: ${trimmedLine}`);
    }
    
    // finallyブロック検出
    if (trimmedLine.includes('finally') && trimmedLine.includes('{')) {
        finallyCount++;
        // 最新のtryブロックにfinally対応を記録
        if (tryPositions.length > 0) {
            tryPositions[tryPositions.length - 1].hasCorrespondingFinally = true;
        }
        console.log(`✅ finally ブロック発見 [行 ${lineNum}]: ${trimmedLine}`);
    }
});

console.log(`\n📊 構造統計:`);
console.log(`try ブロック数: ${tryCount}`);
console.log(`catch ブロック数: ${catchCount}`);
console.log(`finally ブロック数: ${finallyCount}`);

// 問題のあるtryブロックを特定
console.log(`\n❌ 問題のあるtryブロック:`);
const problematicTryBlocks = tryPositions.filter(tryBlock => 
    !tryBlock.hasCorrespondingCatch && !tryBlock.hasCorrespondingFinally
);

if (problematicTryBlocks.length > 0) {
    problematicTryBlocks.forEach(problematicBlock => {
        console.log(`🚨 [行 ${problematicBlock.line}] try文にcatchもfinallyもありません:`);
        console.log(`   ${problematicBlock.content}`);
        
        // 周辺コードを表示
        const startLine = Math.max(0, problematicBlock.line - 5);
        const endLine = Math.min(lines.length - 1, problematicBlock.line + 10);
        
        console.log(`\n📝 周辺コード (行 ${startLine + 1} - ${endLine + 1}):`);
        for (let i = startLine; i <= endLine; i++) {
            const marker = (i + 1 === problematicBlock.line) ? '>>>' : '   ';
            console.log(`${marker} ${i + 1}: ${lines[i]}`);
        }
        console.log('');
    });
} else {
    console.log('✅ すべてのtryブロックに対応するcatch/finallyが見つかりました');
    
    // それでもエラーが出る場合は、より詳細な解析が必要
    console.log('\n🔍 他の構文エラーの可能性を調査中...');
    
    // 非同期関数のtry-catch確認
    const asyncFunctionMatches = jsCode.match(/async\s+function[^{]*\{[\s\S]*?\}/g);
    if (asyncFunctionMatches) {
        console.log(`🔍 非同期関数の数: ${asyncFunctionMatches.length}`);
        asyncFunctionMatches.forEach((func, index) => {
            const hasTry = func.includes('try');
            const hasCatch = func.includes('catch');
            console.log(`   非同期関数 ${index + 1}: try=${hasTry}, catch=${hasCatch}`);
        });
    }
}

console.log('\n🎯 構文エラー解析完了');