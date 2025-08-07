const fs = require('fs');

console.log('🕵️ ULTIMATE SYNTAX DETECTIVE - Root Cause Investigation');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 JavaScript size: ${Math.round(jsCode.length / 1024)}KB`);

// Write to temp file for exact Node.js analysis
fs.writeFileSync('temp-detective.js', jsCode);

const { spawn } = require('child_process');

// Get detailed syntax error information
console.log('🔍 Running Node.js syntax check...');
const syntaxCheck = spawn('node', ['--check', 'temp-detective.js']);

let errorOutput = '';
let hasError = false;

syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
    hasError = true;
});

syntaxCheck.on('close', (code) => {
    if (hasError) {
        console.log('🚨 SYNTAX ERROR DETECTED:');
        console.log(errorOutput);
        
        // Parse exact error location
        const match = errorOutput.match(/temp-detective\.js:(\d+):(\d+)/);
        if (match) {
            const errorLine = parseInt(match[1]);
            const errorColumn = parseInt(match[2]);
            
            console.log(`\n🎯 EXACT ERROR LOCATION:`);
            console.log(`Line: ${errorLine}, Column: ${errorColumn}`);
            
            const lines = jsCode.split('\n');
            const problemLine = lines[errorLine - 1];
            
            console.log(`\n📝 PROBLEM LINE ${errorLine}:`);
            console.log(`"${problemLine}"`);
            
            // Show extensive context - 20 lines before and after
            console.log(`\n📋 EXTENSIVE CONTEXT (Lines ${Math.max(1, errorLine - 20)} to ${Math.min(lines.length, errorLine + 20)}):`);
            
            for (let i = Math.max(0, errorLine - 21); i <= Math.min(lines.length - 1, errorLine + 19); i++) {
                const lineNum = i + 1;
                let marker = '   ';
                
                if (lineNum === errorLine) {
                    marker = '🚨 ';
                } else if (lineNum === errorLine - 1) {
                    marker = '⬆️  ';
                } else if (lineNum === errorLine + 1) {
                    marker = '⬇️  ';
                }
                
                console.log(`${marker}${lineNum.toString().padStart(4, ' ')}: ${lines[i]}`);
                
                // Show column pointer for error line
                if (lineNum === errorLine) {
                    const pointer = ' '.repeat(7 + errorColumn - 1) + '^';
                    console.log(`     ${pointer} ERROR HERE`);
                }
            }
            
            // Analyze try-catch-finally structures around error
            console.log(`\n🔍 TRY-CATCH-FINALLY ANALYSIS:`);
            
            let tryBlocks = [];
            let catchBlocks = [];
            let finallyBlocks = [];
            
            // Search in a large window around the error
            for (let i = Math.max(0, errorLine - 50); i <= Math.min(lines.length - 1, errorLine + 50); i++) {
                const line = lines[i].trim();
                const lineNum = i + 1;
                
                if (line.includes('try {') || line === 'try {') {
                    tryBlocks.push({line: lineNum, content: line});
                }
                if (line.includes('catch') && line.includes('(')) {
                    catchBlocks.push({line: lineNum, content: line});
                }
                if (line.includes('finally') && line.includes('{')) {
                    finallyBlocks.push({line: lineNum, content: line});
                }
            }
            
            console.log(`📊 TRY blocks found: ${tryBlocks.length}`);
            tryBlocks.forEach(block => {
                console.log(`   Line ${block.line}: ${block.content}`);
            });
            
            console.log(`📊 CATCH blocks found: ${catchBlocks.length}`);
            catchBlocks.forEach(block => {
                console.log(`   Line ${block.line}: ${block.content}`);
            });
            
            console.log(`📊 FINALLY blocks found: ${finallyBlocks.length}`);
            finallyBlocks.forEach(block => {
                console.log(`   Line ${block.line}: ${block.content}`);
            });
            
            // Analyze specific error type
            console.log(`\n🧪 ERROR TYPE ANALYSIS:`);
            
            if (errorOutput.includes('Unexpected token')) {
                const tokenMatch = errorOutput.match(/Unexpected token '(.*)'/);
                if (tokenMatch) {
                    const unexpectedToken = tokenMatch[1];
                    console.log(`❌ Unexpected Token: "${unexpectedToken}"`);
                    
                    if (unexpectedToken === '}') {
                        console.log(`🔍 Brace Analysis: Extra closing brace detected`);
                        
                        // Count braces in context
                        let braceBalance = 0;
                        for (let i = 0; i < errorLine - 1; i++) {
                            const line = lines[i];
                            braceBalance += (line.match(/\{/g) || []).length;
                            braceBalance -= (line.match(/\}/g) || []).length;
                        }
                        console.log(`📊 Brace balance before error line: ${braceBalance}`);
                        
                        if (braceBalance <= 0) {
                            console.log(`🚨 DIAGNOSIS: Extra closing brace - no matching opening brace`);
                        }
                    }
                }
            }
            
            if (errorOutput.includes('Missing catch or finally')) {
                console.log(`🚨 DIAGNOSIS: Incomplete try block structure`);
                
                // Find the try block that's missing catch/finally
                for (let i = errorLine - 1; i >= Math.max(0, errorLine - 20); i--) {
                    const line = lines[i].trim();
                    if (line.includes('try {') || line === 'try {') {
                        console.log(`📍 Incomplete try block at line ${i + 1}: ${line}`);
                        
                        // Check what follows this try block
                        for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
                            const followingLine = lines[j].trim();
                            console.log(`   Line ${j + 1}: ${followingLine}`);
                            if (followingLine.includes('catch') || followingLine.includes('finally')) {
                                console.log(`   ✅ Found ${followingLine.includes('catch') ? 'catch' : 'finally'} block`);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            
            // Save detailed analysis
            const analysisData = {
                errorLine: errorLine,
                errorColumn: errorColumn,
                problemLine: problemLine,
                errorType: errorOutput.split('\n')[0],
                context: lines.slice(Math.max(0, errorLine - 21), Math.min(lines.length, errorLine + 20)),
                tryBlocks: tryBlocks,
                catchBlocks: catchBlocks,
                finallyBlocks: finallyBlocks
            };
            
            fs.writeFileSync('syntax-analysis.json', JSON.stringify(analysisData, null, 2));
            console.log('\n📋 Detailed analysis saved to: syntax-analysis.json');
        }
    } else {
        console.log('✅ No syntax errors detected');
    }
    
    // Clean up
    try { fs.unlinkSync('temp-detective.js'); } catch(e) {}
    
    console.log('\n🏁 Ultimate syntax investigation complete');
});