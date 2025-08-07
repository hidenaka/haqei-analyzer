const fs = require('fs');

console.log('✂️ MANUAL QUESTIONS ARRAY SURGICAL FIX');

// Read the file and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log('🔍 Finding exact line 25 issue...');
console.log(`Line 25: "${lines[24]}"`);

// Show detailed context
console.log('\n📋 Detailed context around line 25:');
for (let i = 20; i <= 30; i++) {
    const marker = i === 24 ? '🚨 ' : '   ';
    const lineNum = i + 1;
    console.log(`${marker}${lineNum.toString().padStart(3, ' ')}: ${lines[i]}`);
}

// The issue appears to be a missing comma after the question object
// Let's manually fix the structure

const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Find the specific problem: question option without comma
    if (lineNum === 24 && trimmed.includes('{ value: "E"') && !trimmed.endsWith(',')) {
        // This is the problematic line - add comma
        const fixedLine = line.replace(/}$/, '},');
        fixedLines.push(fixedLine);
        console.log(`🔧 Fixed line ${lineNum}: Added missing comma`);
        continue;
    }
    
    // Fix similar pattern throughout the file
    if (trimmed.match(/{ value: "[A-E]".*}$/) && !trimmed.endsWith(',')) {
        // Check if this is the last option in an array
        let isLastOption = false;
        
        // Look ahead for closing bracket
        for (let j = i + 1; j < Math.min(lines.length, i + 5); j++) {
            const nextTrimmed = lines[j].trim();
            if (nextTrimmed === ']' || nextTrimmed === ']}') {
                isLastOption = true;
                break;
            }
            if (nextTrimmed.includes('{ value:')) {
                break; // Found another option, so this wasn't the last
            }
        }
        
        if (!isLastOption) {
            // Add comma
            const fixedLine = line.replace(/}$/, '},');
            fixedLines.push(fixedLine);
            console.log(`🔧 Fixed line ${lineNum}: Added missing comma to option`);
            continue;
        }
    }
    
    // Check for malformed bracket sequences
    if (trimmed === '},') {
        // Check context
        const prevLine = i > 0 ? lines[i - 1].trim() : '';
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
        
        // If previous line doesn't end with } and next line doesn't start with {
        if (!prevLine.endsWith('}') && !nextLine.startsWith('{')) {
            console.log(`🗑️  Removed orphaned '}, ' at line ${lineNum}`);
            continue;
        }
    }
    
    fixedLines.push(line);
}

console.log(`📊 Lines processed: ${lines.length} → ${fixedLines.length}`);

const fixedJs = fixedLines.join('\n');

// Rebuild complete HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Save the manually fixed version
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log('✅ Manual surgical fix applied');

// Final syntax test
fs.writeFileSync('temp-manual-fix-test.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-manual-fix-test.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('\n✂️ MANUAL SURGICAL RESULT:');
    
    if (code === 0) {
        console.log('🎉 MANUAL FIX SUCCESSFUL!');
        console.log('✨ JavaScript syntax is now completely valid');
        console.log('🚀 Ready for user button testing');
    } else {
        console.log('❌ Manual fix incomplete:');
        console.log(errorOutput);
        
        // Show next error if exists
        const match = errorOutput.match(/temp-manual-fix-test\.js:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            console.log(`\n🎯 Next error at line ${line}, column ${col}:`);
            console.log(`"${fixedLines[line - 1]}"`);
        }
    }
    
    // Clean up
    try { fs.unlinkSync('temp-manual-fix-test.js'); } catch(e) {}
    
    console.log('\n🏁 Manual questions array fix complete');
});