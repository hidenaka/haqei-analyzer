const fs = require('fs');

console.log('🏥 FINAL SYNTAX SURGEON - Line 23 Emergency Fix');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log(`🎯 Targeting line 23 error: "Unexpected token '}'"`);
console.log(`📍 Line 23 content: "${lines[22]}"`);

// Show context around line 23
console.log('\n📋 Context around line 23:');
for (let i = 18; i <= 27; i++) {
    const marker = i === 22 ? '🚨 ' : '   ';
    const lineNum = i + 1;
    console.log(`${marker}${lineNum.toString().padStart(3, ' ')}: ${lines[i]}`);
}

// Analyze the structure issue
const fixedLines = [];
let foundIssue = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Line 23 specific fix
    if (lineNum === 23) {
        // Check if this is a malformed object structure
        if (trimmed === '},') {
            // Look at surrounding lines to understand structure
            const prevLine = lines[i - 1]?.trim() || '';
            const nextLine = lines[i + 1]?.trim() || '';
            
            console.log(`🔍 Line 22: "${prevLine}"`);
            console.log(`🔍 Line 23: "${trimmed}" <- ERROR HERE`);
            console.log(`🔍 Line 24: "${nextLine}"`);
            
            // Check if we have a question object structure issue
            if (prevLine.includes('"') && nextLine.includes('"')) {
                // This is likely a question object separator
                fixedLines.push(line);
                console.log(`✅ Kept line 23 as valid question separator`);
            } else if (prevLine === '' || nextLine === '') {
                // Empty context - likely orphaned brace
                console.log(`🗑️  Removed orphaned brace at line 23`);
                foundIssue = true;
                continue;
            } else {
                fixedLines.push(line);
            }
        } else {
            fixedLines.push(line);
        }
        continue;
    }
    
    // Additional cleanup for common syntax issues
    if (trimmed === '},' && i > 0 && i < lines.length - 1) {
        const prevLine = lines[i - 1]?.trim() || '';
        const nextLine = lines[i + 1]?.trim() || '';
        
        // Check if this is part of a valid array structure
        if (!prevLine.includes('"') && !nextLine.includes('"') && !nextLine.startsWith('{')) {
            console.log(`🗑️  Removed orphaned object separator at line ${lineNum}`);
            continue;
        }
    }
    
    fixedLines.push(line);
}

console.log(`\n📊 Original lines: ${lines.length}`);
console.log(`📊 Fixed lines: ${fixedLines.length}`);
console.log(`🔧 Issues fixed: ${foundIssue ? 'Yes' : 'None detected'}`);

const fixedJs = fixedLines.join('\n');

// Rebuild complete HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Save fixed version
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log('✅ Surgical fix applied');

// Test syntax
fs.writeFileSync('temp-surgical-test.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-surgical-test.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('\n🏥 SURGICAL RESULT:');
    
    if (code === 0) {
        console.log('🎉 SURGERY SUCCESSFUL! Perfect syntax achieved');
        console.log('✨ JavaScript is now syntactically correct');
        console.log('🚀 Ready for user button testing');
    } else {
        console.log('⚠️  Surgery partially successful, remaining issues:');
        console.log(errorOutput);
        
        // Get next error location
        const match = errorOutput.match(/temp-surgical-test\.js:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            console.log(`🎯 Next issue at line ${line}, column ${col}:`);
            console.log(`"${fixedLines[line - 1]}"`);
            
            // Show next context
            console.log(`\n📋 Next context (Lines ${line - 2} to ${line + 2}):`);
            for (let i = Math.max(0, line - 3); i <= Math.min(fixedLines.length - 1, line + 1); i++) {
                const lineNum = i + 1;
                const marker = lineNum === line ? '🚨 ' : '   ';
                console.log(`${marker}${lineNum.toString().padStart(3, ' ')}: ${fixedLines[i]}`);
            }
        }
    }
    
    // Clean up
    try { fs.unlinkSync('temp-surgical-test.js'); } catch(e) {}
    
    console.log('\n🏁 Final syntax surgery complete');
});