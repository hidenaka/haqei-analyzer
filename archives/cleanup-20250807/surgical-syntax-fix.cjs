const fs = require('fs');

console.log('🔬 SURGICAL SYNTAX FIX - Precise Error Location');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// Extract main script section
const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatches[scriptMatches.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 JavaScript size: ${Math.round(jsCode.length / 1024)}KB`);

// Write to temp file for detailed analysis
fs.writeFileSync('temp-debug.js', jsCode);

const { spawn } = require('child_process');

// Get exact error location
const syntaxCheck = spawn('node', ['--check', 'temp-debug.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('📍 Exact Error Analysis:');
    console.log(errorOutput);
    
    if (errorOutput.includes('SyntaxError')) {
        // Parse error line
        const errorMatch = errorOutput.match(/temp-debug\.js:(\d+):(\d+)/);
        if (errorMatch) {
            const errorLine = parseInt(errorMatch[1]);
            const errorColumn = parseInt(errorMatch[2]);
            
            console.log(`\n🎯 EXACT ERROR LOCATION:`);
            console.log(`Line: ${errorLine}, Column: ${errorColumn}`);
            
            const jsLines = jsCode.split('\n');
            const problemLine = jsLines[errorLine - 1];
            
            console.log(`\n📝 PROBLEM LINE:`);
            console.log(`${errorLine}: ${problemLine}`);
            
            // Show surrounding context
            console.log(`\n📋 CONTEXT (${errorLine - 5} to ${errorLine + 5}):`);
            for (let i = Math.max(0, errorLine - 6); i <= Math.min(jsLines.length - 1, errorLine + 4); i++) {
                const lineNum = i + 1;
                const marker = lineNum === errorLine ? '🚨 ' : '   ';
                console.log(`${marker}${lineNum}: ${jsLines[i]}`);
            }
            
            // Analyze the specific issue
            console.log(`\n🔍 ANALYSIS:`);
            
            if (problemLine.includes('{') && !problemLine.trim().endsWith('{')) {
                console.log('❌ Issue: Unexpected content after opening brace');
            }
            
            if (problemLine.match(/^\s*\w+\([^)]*\)\s*\{/)) {
                console.log('❌ Issue: Method definition outside class/object context');
                
                // Find the previous class/object context
                for (let j = errorLine - 2; j >= 0; j--) {
                    const prevLine = jsLines[j].trim();
                    if (prevLine.includes('class ') || prevLine.includes('const ') || prevLine.includes('let ')) {
                        console.log(`📍 Last context at line ${j + 1}: ${prevLine}`);
                        break;
                    }
                    if (j === errorLine - 20) {
                        console.log('📍 No class context found in last 20 lines');
                        break;
                    }
                }
            }
            
            // Suggest fix
            console.log(`\n🔧 SUGGESTED FIX:`);
            if (problemLine.trim().match(/^\w+\([^)]*\)\s*\{/)) {
                console.log('1. This method needs to be inside a class');
                console.log('2. Add proper class closing brace before this method');
                console.log('3. Or move this method inside the CriticalCSSAnalyzer class');
                
                // Look for CriticalCSSAnalyzer class
                for (let k = 0; k < jsLines.length; k++) {
                    if (jsLines[k].includes('class CriticalCSSAnalyzer')) {
                        console.log(`📍 CriticalCSSAnalyzer found at line ${k + 1}`);
                        
                        // Find where it should end
                        let classLines = 0;
                        for (let m = k + 1; m < errorLine - 1; m++) {
                            if (jsLines[m].trim().match(/^\w+\([^)]*\)\s*\{/) || 
                                jsLines[m].includes('constructor') ||
                                jsLines[m].includes('async ')) {
                                classLines++;
                            }
                        }
                        console.log(`📊 Found ${classLines} methods that should be in class`);
                        break;
                    }
                }
            }
        }
    }
    
    // Clean up
    fs.unlinkSync('temp-debug.js');
    
    console.log('\n✅ Surgical analysis complete');
    console.log('🎯 Next: Apply targeted fix based on analysis');
});