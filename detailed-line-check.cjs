const fs = require('fs');

console.log('🔍 DETAILED LINE-BY-LINE CHECK');

// Extract JavaScript exactly as Node sees it
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log(`📊 Total JavaScript lines: ${lines.length}`);

// Write exactly what we extracted
fs.writeFileSync('debug-extracted.js', jsCode);

// Parse each line for obvious syntax issues
let issues = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Check for common syntax issues
    
    // Unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    
    if (closeBrackets > openBrackets) {
        issues.push({
            line: lineNum,
            type: 'EXTRA_CLOSE_BRACKET',
            content: line,
            detail: `${closeBrackets} close brackets, ${openBrackets} open brackets`
        });
    }
    
    // Orphaned closing brackets
    if (trimmed === '];' && i > 0) {
        const prevLine = lines[i - 1].trim();
        if (!prevLine.endsWith(',') && !prevLine.endsWith('[')) {
            issues.push({
                line: lineNum,
                type: 'ORPHANED_ARRAY_CLOSE',
                content: line,
                detail: `Previous line: "${prevLine}"`
            });
        }
    }
    
    // Method definitions outside context
    if (trimmed.match(/^\w+\([^)]*\)\s*\{/) && !trimmed.includes('function')) {
        let hasContext = false;
        
        // Check previous 10 lines for class/object context
        for (let j = Math.max(0, i - 10); j < i; j++) {
            const checkLine = lines[j];
            if (checkLine.includes('class ') || 
                (checkLine.includes('const ') && checkLine.includes('= {'))) {
                hasContext = true;
                break;
            }
        }
        
        if (!hasContext) {
            issues.push({
                line: lineNum,
                type: 'METHOD_WITHOUT_CONTEXT',
                content: line,
                detail: 'Method definition without class/object context'
            });
        }
    }
    
    // Malformed array/object syntax
    if (trimmed.includes('][') || trimmed.includes('}{')) {
        issues.push({
            line: lineNum,
            type: 'MALFORMED_BRACKETS',
            content: line,
            detail: 'Malformed bracket sequence'
        });
    }
}

console.log(`\n🚨 Found ${issues.length} potential syntax issues:`);

issues.forEach((issue, index) => {
    console.log(`\n${index + 1}. LINE ${issue.line} - ${issue.type}:`);
    console.log(`   Content: "${issue.content}"`);
    console.log(`   Detail: ${issue.detail}`);
    
    // Show context
    const start = Math.max(0, issue.line - 4);
    const end = Math.min(lines.length - 1, issue.line + 2);
    console.log(`   Context:`);
    for (let k = start; k <= end; k++) {
        const marker = k === issue.line - 1 ? '>>> ' : '    ';
        console.log(`   ${marker}${(k + 1).toString().padStart(4, ' ')}: ${lines[k]}`);
    }
});

// Now test the extracted file
console.log('\n🔍 Testing extracted JavaScript...');

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'debug-extracted.js']);

syntaxCheck.on('close', (code) => {
    if (code === 0) {
        console.log('✅ JavaScript syntax is valid');
    } else {
        console.log('❌ JavaScript still has syntax errors');
    }
    
    // Keep the debug file for inspection
    console.log('📋 Debug file saved as: debug-extracted.js');
});