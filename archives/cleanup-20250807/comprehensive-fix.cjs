const fs = require('fs');

console.log('🔧 COMPREHENSIVE JAVASCRIPT FIX - Starting...');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const lines = content.split('\n');

console.log(`📊 Total lines: ${lines.length}`);

// Extract JavaScript section
let jsStart = -1;
let jsEnd = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<script>') && jsStart === -1) {
        jsStart = i + 1;
    }
    if (lines[i].includes('</script>') && jsStart !== -1) {
        jsEnd = i - 1;
        break;
    }
}

if (jsStart === -1 || jsEnd === -1) {
    console.log('❌ Could not find JavaScript section');
    process.exit(1);
}

console.log(`📍 JavaScript section: lines ${jsStart + 1} to ${jsEnd + 1}`);

// Focus on the problematic area - rebuild structure
const jsLines = lines.slice(jsStart, jsEnd + 1);
let fixedJsLines = [];
let braceDepth = 0;
let inClass = false;
let classStartFound = false;

for (let i = 0; i < jsLines.length; i++) {
    const line = jsLines[i];
    const trimmed = line.trim();
    
    // Track class CriticalCSSAnalyzer
    if (trimmed.includes('class CriticalCSSAnalyzer')) {
        inClass = true;
        classStartFound = true;
        fixedJsLines.push(line);
        console.log(`✅ Found class at JS line ${i + 1}`);
        continue;
    }
    
    // If we're before class definition, just copy
    if (!classStartFound) {
        fixedJsLines.push(line);
        continue;
    }
    
    // If we're in class but hit DOMContentLoaded, close class first
    if (inClass && trimmed.includes('DOMContentLoaded')) {
        // Close the class
        fixedJsLines.push('        } // End CriticalCSSAnalyzer class');
        fixedJsLines.push('');
        inClass = false;
        console.log(`✅ Closed class before DOMContentLoaded at JS line ${i + 1}`);
    }
    
    // Add the current line
    fixedJsLines.push(line);
}

// If class was never closed, close it at the end
if (inClass) {
    fixedJsLines.push('        } // End CriticalCSSAnalyzer class');
    console.log('✅ Closed class at end of script');
}

// Rebuild the full file
const beforeJs = lines.slice(0, jsStart);
const afterJs = lines.slice(jsEnd + 1);
const newLines = [...beforeJs, ...fixedJsLines, ...afterJs];

// Save
const fixedContent = newLines.join('\n');
fs.writeFileSync('public/os_analyzer.html', fixedContent);

console.log(`✅ Comprehensive fix complete! Size: ${Math.round(fixedContent.length / 1024)}KB`);

// Quick validation
const { spawn } = require('child_process');

// Write test JS
const testJs = fixedJsLines.join('\n');
fs.writeFileSync('temp-validation.js', testJs);

console.log('🔍 Running final syntax validation...');

const syntaxCheck = spawn('node', ['--check', 'temp-validation.js']);
syntaxCheck.on('close', (code) => {
    console.log(`📊 Final syntax check: ${code === 0 ? '✅ SUCCESS' : '❌ STILL HAS ERRORS'}`);
    
    // Clean up
    try { fs.unlinkSync('temp-validation.js'); } catch(e) {}
    
    if (code === 0) {
        console.log('🎉 JavaScript syntax is now VALID!');
        console.log('🚀 Ready for user testing...');
    } else {
        console.log('⚠️ Still has syntax issues, but structure is improved');
    }
    
    process.exit(code);
});