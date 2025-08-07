const fs = require('fs');

console.log('🔍 JavaScript構文エラー詳細検証...');

// HTMLファイルを読み込み
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// 最後の大きなscriptタグを抽出
const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatches[scriptMatches.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 JavaScript size: ${Math.round(jsCode.length / 1024)}KB`);

// テスト用ファイルに書き出してNode.jsで構文チェック
const testJsPath = 'temp-syntax-test.js';
fs.writeFileSync(testJsPath, jsCode);

const { spawn } = require('child_process');

// Node.js syntax check
const syntaxCheck = spawn('node', ['--check', testJsPath], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

syntaxCheck.stdout.on('data', (data) => {
    output += data.toString();
});

syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log(`\n📊 Node.js構文チェック結果: ${code === 0 ? '✅ 成功' : '❌ 失敗'}`);
    
    if (code !== 0) {
        console.log('❌ 構文エラー詳細:');
        console.log(errorOutput);
        
        // エラー行の特定
        const errorMatch = errorOutput.match(/(\d+):(\d+)/);
        if (errorMatch) {
            const errorLine = parseInt(errorMatch[1]);
            const errorColumn = parseInt(errorMatch[2]);
            
            console.log(`\n🎯 エラー位置: Line ${errorLine}, Column ${errorColumn}`);
            
            const lines = jsCode.split('\n');
            const startLine = Math.max(0, errorLine - 5);
            const endLine = Math.min(lines.length - 1, errorLine + 5);
            
            console.log('\n📝 エラー周辺コード:');
            for (let i = startLine; i <= endLine; i++) {
                const marker = i === errorLine - 1 ? '>>> ' : '    ';
                console.log(`${marker}${i + 1}: ${lines[i]}`);
            }
        }
    } else {
        console.log('✅ JavaScript構文は正常です');
    }
    
    // Clean up
    fs.unlinkSync(testJsPath);
    
    // 追加のチェック: 括弧のバランス
    console.log('\n🔧 括弧バランスチェック:');
    let braceBalance = 0;
    let parenBalance = 0;
    let bracketBalance = 0;
    
    for (let char of jsCode) {
        switch (char) {
            case '{': braceBalance++; break;
            case '}': braceBalance--; break;
            case '(': parenBalance++; break;
            case ')': parenBalance--; break;
            case '[': bracketBalance++; break;
            case ']': bracketBalance--; break;
        }
    }
    
    console.log(`波括弧 {}: ${braceBalance === 0 ? '✅ バランス' : `❌ 不均衡 (${braceBalance})`}`);
    console.log(`丸括弧 (): ${parenBalance === 0 ? '✅ バランス' : `❌ 不均衡 (${parenBalance})`}`);
    console.log(`角括弧 []: ${bracketBalance === 0 ? '✅ バランス' : `❌ 不均衡 (${bracketBalance})`}`);
});