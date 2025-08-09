const fs = require('fs');

console.log('🔧 COMPREHENSIVE BRACKET & STRUCTURE FIX');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 Original size: ${Math.round(jsCode.length / 1024)}KB`);

const lines = jsCode.split('\n');
const fixedLines = [];

let inQuestionsArray = false;
let questionDepth = 0;
let braceBalance = 0;
let inClass = false;
let classDepth = 0;

console.log('🔍 Processing each line...');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Track QUESTIONS array
    if (trimmed.includes('const QUESTIONS = [')) {
        inQuestionsArray = true;
        fixedLines.push(line);
        console.log(`📍 QUESTIONS array starts at line ${lineNum}`);
        continue;
    }
    
    // End QUESTIONS array properly
    if (inQuestionsArray && trimmed === '];') {
        inQuestionsArray = false;
        fixedLines.push(line);
        console.log(`📍 QUESTIONS array ends at line ${lineNum}`);
        continue;
    }
    
    // Fix QUESTIONS array structure issues
    if (inQuestionsArray) {
        // Remove extra closing brackets in question objects
        if (trimmed === '}],' || trimmed === '}],') {
            fixedLines.push(line.replace('}],', '},').replace('}],', '},'));
            continue;
        }
        
        // Remove orphaned closing brackets
        if (trimmed === ']' && fixedLines[fixedLines.length - 1].trim().endsWith('}')) {
            console.log(`🗑️  Removed orphaned ] at line ${lineNum}`);
            continue;
        }
    }
    
    // Track class boundaries
    if (trimmed.includes('class CriticalCSSAnalyzer')) {
        inClass = true;
        classDepth = 0;
        fixedLines.push(line);
        console.log(`✅ Class starts at line ${lineNum}`);
        continue;
    }
    
    // Count braces in class context
    if (inClass) {
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        classDepth += openBraces - closeBraces;
        
        // Don't allow class to close prematurely
        if (classDepth <= 0 && trimmed === '}' && !trimmed.includes('catch')) {
            // Check if this is truly end of class or premature closure
            let lookAhead = false;
            for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
                const nextLine = lines[j].trim();
                if (nextLine.match(/^\w+\([^)]*\)\s*\{/) && !nextLine.includes('function')) {
                    // Method definition follows - this is premature closure
                    console.log(`🗑️  Removed premature class closure at line ${lineNum}`);
                    lookAhead = true;
                    break;
                }
                if (nextLine.includes('DOMContentLoaded') || nextLine.includes('document.addEventListener')) {
                    // Legitimate class end
                    inClass = false;
                    fixedLines.push(line);
                    console.log(`✅ Class ends at line ${lineNum}`);
                    lookAhead = true;
                    break;
                }
            }
            
            if (!lookAhead) {
                // Default: keep the brace but check context
                fixedLines.push(line);
            }
            continue;
        }
    }
    
    // Fix method definitions outside class context
    if (!inClass && trimmed.match(/^\w+\([^)]*\)\s*\{/) && !trimmed.includes('function')) {
        console.log(`🔧 Method outside class at line ${lineNum}: ${trimmed.substring(0, 50)}...`);
        
        // Find the nearest class and ensure it's open
        let foundClass = false;
        for (let k = i - 1; k >= Math.max(0, i - 100); k--) {
            if (lines[k].includes('class CriticalCSSAnalyzer')) {
                foundClass = true;
                console.log(`📍 Reopening class context for method at line ${lineNum}`);
                break;
            }
        }
        
        if (foundClass) {
            // This method should be inside class
            inClass = true;
            classDepth = 1; // Assume we're inside class
        }
    }
    
    // Skip obviously broken lines
    if (trimmed === '// Removed premature class closure' ||
        trimmed.match(/^\s*\}\s*\/\/ Removed/) ||
        (trimmed === ');' && !line.includes('function') && !line.includes('addEventListener'))) {
        console.log(`🗑️  Skipped broken line ${lineNum}: ${trimmed}`);
        continue;
    }
    
    fixedLines.push(line);
}

// Ensure class is properly closed
if (inClass) {
    // Find the right place to close class
    for (let i = fixedLines.length - 1; i >= 0; i--) {
        if (fixedLines[i].trim().includes('DOMContentLoaded') || 
            fixedLines[i].trim().includes('document.addEventListener')) {
            fixedLines.splice(i, 0, '    } // End CriticalCSSAnalyzer class');
            console.log(`✅ Added class closure before DOMContentLoaded`);
            break;
        }
    }
}

const fixedJs = fixedLines.join('\n');

console.log(`📊 Fixed size: ${Math.round(fixedJs.length / 1024)}KB`);
console.log(`📈 Lines: ${lines.length} → ${fixedLines.length}`);

// Rebuild complete HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Save fixed version
fs.writeFileSync('public/os_analyzer.html', fullContent);

console.log('✅ Fixed version saved');

// Test syntax
fs.writeFileSync('temp-syntax-test.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-syntax-test.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    if (code === 0) {
        console.log('🎉 SYNTAX CHECK PASSED! JavaScript is valid');
    } else {
        console.log('❌ Syntax errors remain:');
        console.log(errorOutput);
        
        // Extract exact error location
        const match = errorOutput.match(/temp-syntax-test\.js:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            console.log(`🎯 Error at line ${line}, column ${col}:`);
            console.log(`"${fixedLines[line - 1]}"`);
        }
    }
    
    // Clean up
    try { fs.unlinkSync('temp-syntax-test.js'); } catch(e) {}
    
    console.log('\n🏁 Comprehensive fix complete');
});