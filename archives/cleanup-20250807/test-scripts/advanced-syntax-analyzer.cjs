const fs = require('fs');

console.log('🔬 Advanced JavaScript Syntax Analyzer - Starting...');

// ファイル読み込み
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// JavaScriptセクションを抽出
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (!scriptMatch || scriptMatch.length === 0) {
    console.log('❌ No JavaScript sections found');
    process.exit(1);
}

const mainScript = scriptMatch[scriptMatch.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 Analyzing ${Math.round(jsCode.length / 1024)}KB of JavaScript code`);

// 行ごとに分割
const lines = jsCode.split('\n');

console.log('\n🔍 Detailed line-by-line analysis:');

// より詳細な構文チェック
let issues = [];
let openBraces = 0;
let openParens = 0;
let openBrackets = 0;
let inString = false;
let stringChar = '';
let inComment = false;
let inMultiComment = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trim();
    
    // 空行やコメント行をスキップ
    if (trimmed === '' || trimmed.startsWith('//')) continue;
    
    // 複数行コメントの処理
    if (trimmed.includes('/*')) inMultiComment = true;
    if (trimmed.includes('*/')) inMultiComment = false;
    if (inMultiComment) continue;
    
    // 特定のパターンをチェック
    
    // 1. try文の後にcatchまたはfinallyがない
    if (trimmed.includes('try {')) {
        let foundCatchFinally = false;
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
            const nextLine = lines[j].trim();
            if (nextLine.includes('} catch') || nextLine.includes('}catch') || 
                nextLine.includes('} finally') || nextLine.includes('}finally')) {
                foundCatchFinally = true;
                break;
            }
            if (nextLine.includes('function') || nextLine.includes('class')) break;
        }
        if (!foundCatchFinally) {
            issues.push({
                line: lineNum,
                type: 'INCOMPLETE_TRY',
                content: trimmed,
                description: 'Try block without corresponding catch or finally'
            });
        }
    }
    
    // 2. 関数/メソッド定義の異常パターン
    if (trimmed.match(/^\s*\w+\([^)]*\)\s*\{/) && !trimmed.includes('function') && !trimmed.includes('=>')) {
        // これはクラスメソッドの可能性があるが、文脈を確認
        let inClass = false;
        for (let k = Math.max(0, i - 10); k < i; k++) {
            if (lines[k].includes('class ') || lines[k].includes('const ') || lines[k].includes('let ') || lines[k].includes('var ')) {
                inClass = true;
                break;
            }
        }
        if (!inClass) {
            issues.push({
                line: lineNum,
                type: 'INVALID_METHOD_DEFINITION',
                content: trimmed,
                description: 'Method definition outside class context'
            });
        }
    }
    
    // 3. 波括弧の不整合
    for (let char of line) {
        if (char === '"' || char === "'") {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
                stringChar = '';
            }
        }
        
        if (!inString) {
            if (char === '{') openBraces++;
            if (char === '}') openBraces--;
            if (char === '(') openParens++;
            if (char === ')') openParens--;
            if (char === '[') openBrackets++;
            if (char === ']') openBrackets--;
        }
    }
    
    // 4. 疑わしいJavaScript構造
    if (trimmed.includes('separateAnswers(allAnswers) {') && 
        !trimmed.includes('function') && 
        !lines[i-1]?.trim().includes('class') &&
        !lines[i-1]?.trim().includes('const') &&
        !lines[i-1]?.trim().includes('let')) {
        issues.push({
            line: lineNum,
            type: 'ORPHANED_METHOD',
            content: trimmed,
            description: 'Method definition appears to be orphaned from its class/object'
        });
    }
}

console.log(`\n📋 Found ${issues.length} potential issues:`);

issues.forEach((issue, index) => {
    console.log(`\n🚨 ISSUE ${index + 1}:`);
    console.log(`   Line: ${issue.line}`);
    console.log(`   Type: ${issue.type}`);
    console.log(`   Content: ${issue.content}`);
    console.log(`   Description: ${issue.description}`);
    
    // 周辺コードを表示
    const start = Math.max(0, issue.line - 4);
    const end = Math.min(lines.length - 1, issue.line + 3);
    console.log(`   Context:`);
    for (let i = start; i <= end; i++) {
        const marker = i === issue.line - 1 ? '>>> ' : '    ';
        console.log(`${marker}${i + 1}: ${lines[i]}`);
    }
});

console.log(`\n🔧 Balance Check:`);
console.log(`   Braces {}: ${openBraces === 0 ? '✅' : '❌'} (${openBraces})`);
console.log(`   Parentheses (): ${openParens === 0 ? '✅' : '❌'} (${openParens})`);
console.log(`   Brackets []: ${openBrackets === 0 ? '✅' : '❌'} (${openBrackets})`);

// 最も疑わしい箇所を特定
if (issues.length > 0) {
    const criticalIssues = issues.filter(i => i.type === 'ORPHANED_METHOD' || i.type === 'INCOMPLETE_TRY');
    if (criticalIssues.length > 0) {
        console.log(`\n🎯 CRITICAL ISSUES (likely causing "Unexpected token '{'"): ${criticalIssues.length}`);
        criticalIssues.forEach(issue => {
            console.log(`   → Line ${issue.line}: ${issue.type}`);
        });
    }
}

console.log('\n✅ Advanced syntax analysis completed');