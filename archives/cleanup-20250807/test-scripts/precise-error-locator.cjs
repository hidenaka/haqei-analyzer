const fs = require('fs');

console.log('🎯 PRECISE ERROR LOCATION FINDER');

// Extract JavaScript from HTML
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

// Write to temp file
fs.writeFileSync('temp-precise.js', jsCode);

// Get Node.js syntax check
const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-precise.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    if (code !== 0) {
        console.log('🚨 SYNTAX ERROR FOUND:');
        console.log(errorOutput);
        
        // Parse exact location
        const match = errorOutput.match(/temp-precise\.js:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            
            const lines = jsCode.split('\n');
            const problemLine = lines[line - 1];
            
            console.log(`\n📍 ERROR AT LINE ${line}, COLUMN ${col}:`);
            console.log(`"${problemLine}"`);
            
            // Show character at error position
            console.log(`\n🔍 ERROR CHARACTER:`);
            const chars = problemLine.split('');
            console.log(`Position ${col}: "${chars[col - 1]}" (ASCII: ${chars[col - 1]?.charCodeAt(0)})`);
            
            // Show surrounding context
            console.log(`\n📋 CONTEXT (Lines ${line - 5} to ${line + 5}):`);
            for (let i = Math.max(0, line - 6); i <= Math.min(lines.length - 1, line + 4); i++) {
                const lineNum = i + 1;
                const prefix = lineNum === line ? '🚨 ' : '   ';
                console.log(`${prefix}${lineNum.toString().padStart(4, ' ')}: ${lines[i]}`);
                
                // If this is the error line, show column pointer
                if (lineNum === line) {
                    const pointer = ' '.repeat(7 + col - 1) + '^';
                    console.log(`     ${pointer}`);
                }
            }
            
            // Analyze the specific issue
            console.log(`\n🕵️ DETAILED ANALYSIS:`);
            
            if (problemLine.trim().match(/^\w+\([^)]*\)\s*\{/)) {
                console.log('❌ ISSUE: Method definition outside class context');
                
                // Find the nearest class definition
                for (let j = line - 2; j >= 0; j--) {
                    if (lines[j].includes('class ')) {
                        console.log(`📍 Nearest class at line ${j + 1}: ${lines[j].trim()}`);
                        break;
                    }
                }
                
                // Check for premature class closure
                for (let k = line - 2; k >= Math.max(0, line - 20); k--) {
                    const checkLine = lines[k].trim();
                    if (checkLine === '}' && !checkLine.includes('catch') && !checkLine.includes('if')) {
                        console.log(`🚨 Possible premature class closure at line ${k + 1}`);
                        console.log(`   Content: "${lines[k]}"`);
                        break;
                    }
                }
            }
            
            // Return the error info for fixing
            fs.writeFileSync('error-info.json', JSON.stringify({
                line: line,
                column: col,
                content: problemLine,
                error: errorOutput.split('\n')[0]
            }, null, 2));
            
            console.log('\n✅ Error info saved to error-info.json');
        }
    } else {
        console.log('✅ No syntax errors found');
    }
    
    // Clean up
    fs.unlinkSync('temp-precise.js');
});