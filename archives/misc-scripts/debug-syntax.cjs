#!/usr/bin/env node

// Simple syntax and runtime test for DynamicKeywordGenerator.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/js/pages/future-simulator/DynamicKeywordGenerator.js');

console.log('🔍 Testing DynamicKeywordGenerator.js syntax and structure...');

try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log('✅ File read successfully');
    console.log(`📏 File size: ${content.length} characters`);
    
    // Check for common syntax issues
    const issues = [];
    
    // Check for unmatched brackets
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    
    if (openBraces !== closeBraces) {
        issues.push(`Brace mismatch: ${openBraces} opening, ${closeBraces} closing`);
    }
    
    if (openParens !== closeParens) {
        issues.push(`Parenthesis mismatch: ${openParens} opening, ${closeParens} closing`);
    }
    
    if (openBrackets !== closeBrackets) {
        issues.push(`Bracket mismatch: ${openBrackets} opening, ${closeBrackets} closing`);
    }
    
    // Check for specific "if" statement issues
    const lines = content.split('\n');
    const problemLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNumber = i + 1;
        
        // Look for problematic "if" patterns
        if (line.includes('if') && !line.includes('//') && !line.includes('/*')) {
            // Check for common "if" syntax errors
            if (line.match(/if\s*[^(]/)) {
                problemLines.push({
                    line: lineNumber,
                    content: line,
                    issue: 'if statement without parentheses'
                });
            }
            
            if (line.match(/if\s*\(\s*[^)]*$/) && !line.includes('//')) {
                problemLines.push({
                    line: lineNumber,
                    content: line,
                    issue: 'unclosed if condition'
                });
            }
        }
        
        // Check for other common syntax errors
        if (line.includes('function') && line.includes('(') && !line.includes(')')) {
            problemLines.push({
                line: lineNumber,
                content: line,
                issue: 'unclosed function parameters'
            });
        }
    }
    
    console.log('📊 Structure analysis:');
    console.log(`   Braces: ${openBraces} opening, ${closeBraces} closing ${openBraces === closeBraces ? '✅' : '❌'}`);
    console.log(`   Parentheses: ${openParens} opening, ${closeParens} closing ${openParens === closeParens ? '✅' : '❌'}`);
    console.log(`   Brackets: ${openBrackets} opening, ${closeBrackets} closing ${openBrackets === closeBrackets ? '✅' : '❌'}`);
    
    if (issues.length > 0) {
        console.log('\n❌ Structural issues found:');
        issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (problemLines.length > 0) {
        console.log('\n⚠️ Potential problem lines:');
        problemLines.forEach(problem => {
            console.log(`   Line ${problem.line}: ${problem.issue}`);
            console.log(`     ${problem.content}`);
        });
    }
    
    if (issues.length === 0 && problemLines.length === 0) {
        console.log('\n✅ No obvious syntax issues detected');
        console.log('🔍 The "Unexpected token if" error may be context-dependent');
        console.log('   Possible causes:');
        console.log('   1. Missing semicolon before an if statement');
        console.log('   2. Incorrect placement within object literal');
        console.log('   3. Missing closing bracket/brace before if');
        console.log('   4. Browser compatibility issue');
    }
    
    // Try to run a basic syntax check
    try {
        new Function(content);
        console.log('✅ Function constructor syntax check passed');
    } catch (syntaxError) {
        console.log('❌ Function constructor syntax check failed:');
        console.log(`   ${syntaxError.message}`);
        
        // Try to find the line where the error occurred
        if (syntaxError.message.includes('line')) {
            const match = syntaxError.message.match(/line (\d+)/);
            if (match) {
                const errorLine = parseInt(match[1]);
                console.log(`   Problem line ${errorLine}: ${lines[errorLine - 1]}`);
            }
        }
    }
    
} catch (error) {
    console.error('❌ Error testing file:', error.message);
}