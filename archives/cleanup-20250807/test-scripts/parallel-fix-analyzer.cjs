const fs = require('fs');

console.log('🔧 PARALLEL FIX & DEEP ANALYSIS');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log('🔍 DEEP ANALYSIS: Character-level inspection of Line 27');

// Character-by-character analysis of line 27
const line27 = lines[26];
const line26 = lines[25];
const line28 = lines[27];

console.log(`Line 26: "${line26}"`);
console.log(`Line 27: "${line27}"`);  
console.log(`Line 28: "${line28}"`);

// Check for hidden characters
console.log('\n🔬 CHARACTER ANALYSIS:');
const chars27 = line27.split('');
chars27.forEach((char, index) => {
    const code = char.charCodeAt(0);
    console.log(`Position ${index}: "${char}" (ASCII: ${code})`);
});

// Check for BOM or unusual encoding
const buffer = Buffer.from(line27);
console.log(`\n📊 Buffer analysis: ${buffer.toString('hex')}`);

console.log('\n🛠️ PARALLEL FIX: Creating corrected version');

// Create a comprehensive fix
const fixedLines = [];
let inQuestionsArray = false;
let questionArrayStart = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Track QUESTIONS array boundaries
    if (trimmed.includes('const QUESTIONS = [')) {
        inQuestionsArray = true;
        questionArrayStart = i;
        fixedLines.push(line);
        continue;
    }
    
    if (inQuestionsArray && trimmed === '];') {
        inQuestionsArray = false;
        fixedLines.push(line);
        continue;
    }
    
    // Fix potential issues in line 27 area
    if (lineNum === 27) {
        // Try different variations to fix the issue
        if (trimmed === '},') {
            // Check if previous line ends properly
            const prevTrimmed = lines[i-1]?.trim() || '';
            
            if (prevTrimmed.endsWith('},')) {
                // Previous line already has comma - this might be extra
                console.log(`🔧 Line 27: Removing potentially extra comma separator`);
                fixedLines.push('          }');  // Remove comma
            } else if (prevTrimmed.endsWith('}')) {
                // Previous line needs comma - this is correct
                fixedLines.push(line);
            } else {
                // Previous line is malformed - try to fix context
                console.log(`🔧 Line 27: Previous line malformed, fixing context`);
                fixedLines.push('          }');
            }
        } else {
            fixedLines.push(line);
        }
        continue;
    }
    
    // Additional safety fixes
    if (inQuestionsArray) {
        // Ensure question objects are properly formatted
        if (trimmed.match(/^{ value: "[A-E]",.*}$/) && !trimmed.endsWith(',')) {
            // Question option missing comma
            fixedLines.push(line.replace(/}$/, '},'));
            console.log(`🔧 Fixed missing comma in question option at line ${lineNum}`);
            continue;
        }
    }
    
    fixedLines.push(line);
}

const fixedJs = fixedLines.join('\n');

console.log(`\n📊 STATISTICS:`);
console.log(`Original lines: ${lines.length}`);
console.log(`Fixed lines: ${fixedLines.length}`);

// Save the fixed version
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Create backup
fs.writeFileSync('public/os_analyzer_backup.html', content);
console.log('✅ Backup created: os_analyzer_backup.html');

// Apply fix
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log('✅ Applied comprehensive fix');

// Test the fix
fs.writeFileSync('temp-test-fix.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-test-fix.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('\n🧪 FIX VALIDATION:');
    
    if (code === 0) {
        console.log('🎉 SUCCESS! JavaScript syntax is now valid');
        console.log('✨ Ready for MCP user flow testing');
    } else {
        console.log('❌ Fix incomplete, remaining issues:');
        console.log(errorOutput);
        
        // Parse remaining error
        const match = errorOutput.match(/temp-test-fix\.js:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            console.log(`🎯 Next issue at line ${line}, column ${col}:`);
            console.log(`"${fixedLines[line - 1]}"`);
        }
    }
    
    // Clean up
    try { fs.unlinkSync('temp-test-fix.js'); } catch(e) {}
    
    console.log('\n🏁 Parallel fix & analysis complete');
});