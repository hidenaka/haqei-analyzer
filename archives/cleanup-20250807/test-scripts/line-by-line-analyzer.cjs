const fs = require('fs');

console.log('🔍 LINE-BY-LINE SYNTAX ANALYZER - Starting detailed analysis...');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// Extract main script section
const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatches[scriptMatches.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log(`📊 Total lines to analyze: ${lines.length}`);

// Write JavaScript to temp file for exact line matching
fs.writeFileSync('temp-line-check.js', jsCode);

const { spawn } = require('child_process');

// Get exact error location
const syntaxCheck = spawn('node', ['--check', 'temp-line-check.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    if (code !== 0 && errorOutput.includes('SyntaxError')) {
        const errorMatch = errorOutput.match(/temp-line-check\.js:(\d+):(\d+)/);
        
        if (errorMatch) {
            const errorLine = parseInt(errorMatch[1]);
            const errorColumn = parseInt(errorMatch[2]);
            
            console.log(`\n🎯 EXACT ERROR LOCATION:`);
            console.log(`Line: ${errorLine}, Column: ${errorColumn}`);
            console.log(`Error: ${errorOutput.split('\n')[0]}`);
            
            const problemLine = lines[errorLine - 1];
            
            console.log(`\n📝 PROBLEM LINE ${errorLine}:`);
            console.log(`"${problemLine}"`);
            
            // Show 20 lines of context
            console.log(`\n📋 DETAILED CONTEXT (Lines ${errorLine - 10} to ${errorLine + 10}):`);
            for (let i = Math.max(0, errorLine - 11); i <= Math.min(lines.length - 1, errorLine + 9); i++) {
                const lineNum = i + 1;
                const marker = lineNum === errorLine ? '🚨 ' : lineNum === errorLine - 1 ? '⬆️  ' : lineNum === errorLine + 1 ? '⬇️  ' : '   ';
                const line = lines[i];
                console.log(`${marker}${lineNum.toString().padStart(4, ' ')}: ${line}`);
            }
            
            // Character-by-character analysis of problem line
            console.log(`\n🔬 CHARACTER ANALYSIS OF LINE ${errorLine}:`);
            const chars = problemLine.split('');
            chars.forEach((char, index) => {
                const code = char.charCodeAt(0);
                const desc = char === ' ' ? 'SPACE' : 
                           char === '\t' ? 'TAB' : 
                           char === '{' ? 'OPEN_BRACE' : 
                           char === '}' ? 'CLOSE_BRACE' :
                           char === '(' ? 'OPEN_PAREN' :
                           char === ')' ? 'CLOSE_PAREN' :
                           char === ';' ? 'SEMICOLON' :
                           char === ',' ? 'COMMA' :
                           `'${char}'`;
                
                const marker = index === errorColumn - 1 ? '🚨 ' : '   ';
                console.log(`${marker}${index.toString().padStart(3, ' ')}: ${desc} (${code})`);
            });
            
            // Analyze the specific syntax issue
            console.log(`\n🕵️ SYNTAX ANALYSIS:`);
            
            // Check for common issues
            if (problemLine.includes('{') && !problemLine.trim().endsWith('{')) {
                console.log('❌ Issue: Content after opening brace on same line');
            }
            
            if (problemLine.match(/^\s*\w+\([^)]*\)\s*\{/)) {
                console.log('❌ Issue: Method definition - checking context...');
                
                // Check if we're in a class
                let inClass = false;
                let inObject = false;
                
                for (let j = errorLine - 2; j >= Math.max(0, errorLine - 50); j--) {
                    const prevLine = lines[j].trim();
                    
                    if (prevLine.includes('class ')) {
                        inClass = true;
                        console.log(`✅ Found class context at line ${j + 1}: ${prevLine}`);
                        break;
                    }
                    
                    if (prevLine.includes('const ') && prevLine.includes('=') && prevLine.includes('{')) {
                        inObject = true;
                        console.log(`✅ Found object context at line ${j + 1}: ${prevLine}`);
                        break;
                    }
                    
                    if (prevLine.includes('function ') || prevLine.includes('=>')) {
                        console.log(`⚠️  Found function context at line ${j + 1}: ${prevLine}`);
                        break;
                    }
                }
                
                if (!inClass && !inObject) {
                    console.log('❌ Method definition outside any valid context');
                }
            }
            
            // Check for brace balance issues
            let braceBalance = 0;
            for (let k = 0; k < errorLine; k++) {
                const line = lines[k];
                braceBalance += (line.match(/\{/g) || []).length;
                braceBalance -= (line.match(/\}/g) || []).length;
            }
            console.log(`📊 Brace balance up to error line: ${braceBalance}`);
            
            // Suggest fix
            console.log(`\n💡 SUGGESTED FIX:`);
            if (problemLine.trim().match(/^\w+\([^)]*\)\s*\{/)) {
                console.log('1. This appears to be a method definition');
                console.log('2. Need to ensure it\'s inside a class or object');
                console.log('3. Check if previous class closing brace is missing');
                
                // Look backwards for class definition
                for (let m = errorLine - 2; m >= 0; m--) {
                    if (lines[m].includes('class CriticalCSSAnalyzer')) {
                        console.log(`📍 CriticalCSSAnalyzer class found at line ${m + 1}`);
                        console.log(`📏 Distance from class: ${errorLine - m - 1} lines`);
                        
                        // Check if there's a premature class closure
                        for (let n = m + 1; n < errorLine - 1; n++) {
                            if (lines[n].trim() === '}' && !lines[n].includes('catch') && !lines[n].includes('if')) {
                                console.log(`🚨 Possible premature class closure at line ${n + 1}`);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    
    // Clean up
    fs.unlinkSync('temp-line-check.js');
    
    console.log('\n✅ Line-by-line analysis complete');
});