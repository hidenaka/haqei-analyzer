const fs = require('fs');

console.log('🏥 SURGICAL LINE 28 FIX - Root Cause Elimination');

// Read current content
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log('🔍 TARGETING THE REAL PROBLEM:');
console.log(`Line 27: "${lines[26]}"`);
console.log(`Line 28: "${lines[27]}"`); // This is the problem!
console.log(`Line 29: "${lines[28]}"`);

// The issue is clear: Line 28 has a lonely "}" that doesn't belong
// Line 27 should be the last line of the first question object
// Line 29 should be the start of the second question object

const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    if (lineNum === 28) {
        // Line 28 contains the problematic "          }" 
        console.log(`🗑️ REMOVING problematic line 28: "${line.trim()}"`);
        // Skip this line completely - it's the root cause
        continue;
    }
    
    fixedLines.push(line);
}

console.log(`📊 Lines: ${lines.length} → ${fixedLines.length} (removed 1 problematic line)`);

const fixedJs = fixedLines.join('\n');

// Rebuild complete HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Apply the surgical fix
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log('✅ Applied surgical fix - removed problematic line 28');

// Test the fix
fs.writeFileSync('temp-surgical.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-surgical.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('\n🏥 SURGICAL RESULT:');
    
    if (code === 0) {
        console.log('🎉 SURGERY SUCCESSFUL!');
        console.log('✨ JavaScript syntax is now completely valid');
        console.log('🚀 Ready for full user flow testing');
    } else {
        console.log('❌ Additional issues remain:');
        console.log(errorOutput);
    }
    
    // Clean up
    try { fs.unlinkSync('temp-surgical.js'); } catch(e) {}
    
    console.log('\n🏁 Surgical line 28 fix complete');
});