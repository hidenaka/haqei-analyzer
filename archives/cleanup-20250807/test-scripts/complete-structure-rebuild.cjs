const fs = require('fs');

console.log('🔧 COMPLETE STRUCTURE REBUILD - All Problematic Patterns');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log('🔍 SCANNING ALL PROBLEMATIC PATTERNS:');

// Find all lines that are just "          }," or "          }" 
// These are the orphaned braces causing structure issues
const problematicLines = [];
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Identify problematic standalone braces
    if (trimmed === '},' || trimmed === '}') {
        // Check context to see if this is truly orphaned
        const prevLine = lines[i - 1]?.trim() || '';
        const nextLine = lines[i + 1]?.trim() || '';
        
        // If previous line ends with }}, this brace is likely orphaned
        if (prevLine.endsWith('}},') || prevLine.endsWith('}}')) {
            console.log(`🗑️ Line ${lineNum}: Orphaned brace "${trimmed}" (prev ends with '}}')`);
            console.log(`   Previous: "${prevLine}"`);
            console.log(`   Next: "${nextLine}"`);
            problematicLines.push(lineNum);
            continue; // Skip this line
        }
        
        // If next line starts with {, this might be valid question separator
        if (nextLine.startsWith('{') || nextLine === '{') {
            console.log(`✅ Line ${lineNum}: Valid separator "${trimmed}"`);
            fixedLines.push(line);
        } else {
            console.log(`🗑️ Line ${lineNum}: Orphaned brace "${trimmed}" (next doesn't start with '{')`);
            console.log(`   Previous: "${prevLine}"`);
            console.log(`   Next: "${nextLine}"`);
            problematicLines.push(lineNum);
            continue; // Skip this line
        }
    } else {
        fixedLines.push(line);
    }
}

console.log(`\n📊 REBUILD STATISTICS:`);
console.log(`Original lines: ${lines.length}`);
console.log(`Fixed lines: ${fixedLines.length}`);
console.log(`Removed problematic lines: ${problematicLines.length}`);
console.log(`Removed line numbers: ${problematicLines.join(', ')}`);

const fixedJs = fixedLines.join('\n');

// Rebuild complete HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Apply the complete fix
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log('✅ Applied complete structure rebuild');

// Final validation
fs.writeFileSync('temp-complete-fix.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-complete-fix.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('\n🔧 COMPLETE REBUILD RESULT:');
    
    if (code === 0) {
        console.log('🎉 COMPLETE SUCCESS!');
        console.log('✨ All JavaScript syntax issues resolved');
        console.log('🚀 Ready for full 30-question diagnosis flow');
    } else {
        console.log('❌ Additional patterns remain:');
        console.log(errorOutput);
        
        // Parse remaining error location
        const match = errorOutput.match(/temp-complete-fix\.js:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            console.log(`🎯 Remaining issue at line ${line}, column ${col}:`);
            console.log(`"${fixedLines[line - 1]}"`);
        }
    }
    
    // Clean up
    try { fs.unlinkSync('temp-complete-fix.js'); } catch(e) {}
    
    console.log('\n🏁 Complete structure rebuild finished');
});