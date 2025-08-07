const fs = require('fs');

console.log('🎯 REAL SYNTAX ERROR FINDER');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

// Check the area around line 4914 (from the read output)
console.log('\n📋 CONTEXT AROUND LINE 4914 (SUSPECTED REAL ERROR):');
for (let i = 4905; i <= 4925; i++) {
    const marker = '   ';
    const lineNum = i + 1;
    if (lines[i]) {
        console.log(`${marker}${lineNum.toString().padStart(4, ' ')}: ${lines[i]}`);
    }
}

// Look for incomplete try-catch-finally blocks
console.log('\n🔍 SCANNING FOR INCOMPLETE TRY BLOCKS:');

let foundIncomplete = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Look for try blocks
    if (trimmed.includes('try {') || trimmed === 'try {') {
        console.log(`📍 Try block at line ${lineNum}: ${trimmed}`);
        
        // Check what follows this try block
        let hasCatch = false;
        let hasFinally = false;
        let braceDepth = 1;
        let blockEnd = false;
        
        for (let j = i + 1; j < Math.min(lines.length, i + 50); j++) {
            const followingLine = lines[j];
            const followingTrimmed = followingLine.trim();
            
            // Track brace depth
            braceDepth += (followingLine.match(/\{/g) || []).length;
            braceDepth -= (followingLine.match(/\}/g) || []).length;
            
            // Check for catch or finally
            if (followingTrimmed.includes('catch') && followingTrimmed.includes('(')) {
                hasCatch = true;
                console.log(`   ✅ Found catch at line ${j + 1}: ${followingTrimmed}`);
            }
            
            if (followingTrimmed.includes('finally') && followingTrimmed.includes('{')) {
                hasFinally = true;
                console.log(`   ✅ Found finally at line ${j + 1}: ${followingTrimmed}`);
            }
            
            // If we've closed all braces and haven't found catch/finally
            if (braceDepth === 0 && !hasCatch && !hasFinally) {
                console.log(`   ❌ Try block ends at line ${j + 1} without catch or finally`);
                foundIncomplete.push({
                    tryLine: lineNum,
                    endLine: j + 1,
                    content: line
                });
                blockEnd = true;
                break;
            }
            
            // If we found catch or finally, we're good
            if (braceDepth === 0 && (hasCatch || hasFinally)) {
                console.log(`   ✅ Try block properly closed at line ${j + 1}`);
                blockEnd = true;
                break;
            }
        }
        
        if (!blockEnd) {
            console.log(`   ⚠️  Try block analysis incomplete (reached limit)`);
        }
    }
}

// Report incomplete try blocks
if (foundIncomplete.length > 0) {
    console.log(`\n🚨 FOUND ${foundIncomplete.length} INCOMPLETE TRY BLOCK(S):`);
    foundIncomplete.forEach((block, index) => {
        console.log(`${index + 1}. Line ${block.tryLine}: ${block.content.trim()}`);
        console.log(`   Ends at line ${block.endLine} without catch or finally`);
        
        // Show context around this try block
        console.log(`   Context:`);
        for (let k = block.tryLine - 3; k <= block.endLine + 2; k++) {
            const marker = k === block.tryLine ? '🚨 ' : k === block.endLine ? '❌ ' : '   ';
            if (lines[k - 1]) {
                console.log(`   ${marker}${k.toString().padStart(4, ' ')}: ${lines[k - 1]}`);
            }
        }
        console.log('');
    });
} else {
    console.log('\n✅ No obviously incomplete try blocks found');
}

// Check for syntax errors in the specific area we found
console.log('\n🧪 CHECKING SPECIFIC AREA AROUND 4910-4920:');
const testArea = lines.slice(4905, 4925).join('\n');
fs.writeFileSync('temp-test-area.js', testArea);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-test-area.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    if (code !== 0) {
        console.log('🚨 SYNTAX ERROR IN THIS AREA:');
        console.log(errorOutput);
        
        const match = errorOutput.match(/temp-test-area\.js:(\d+)/);
        if (match) {
            const errorLine = parseInt(match[1]);
            const actualLine = 4905 + errorLine;
            console.log(`🎯 Actual error line: ${actualLine}`);
            console.log(`🎯 Error content: "${lines[actualLine - 1]}"`);
        }
    } else {
        console.log('✅ No syntax error in this specific area');
    }
    
    // Clean up
    try { fs.unlinkSync('temp-test-area.js'); } catch(e) {}
    
    console.log('\n🏁 Real syntax error finder complete');
});