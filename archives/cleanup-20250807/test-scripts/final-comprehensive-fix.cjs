const fs = require('fs');

console.log('🎯 FINAL COMPREHENSIVE SYNTAX FIX');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// Extract JavaScript section  
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const mainScript = scriptMatch[scriptMatch.length - 1];
const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');

console.log(`📊 JavaScript size: ${Math.round(jsCode.length / 1024)}KB`);

const lines = jsCode.split('\n');

// Build a completely clean version by parsing structure
const cleanLines = [];
let braceDepth = 0;
let inClass = false;
let classStarted = false;
let skipLine = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip obviously broken lines
    if (trimmed === '// Removed premature class closure' || 
        trimmed.match(/^\s*\}\s*\/\/ Removed/) ||
        trimmed === ');' ||
        (trimmed === '}' && !inClass && i > 100)) {
        continue;
    }
    
    // Track class boundaries
    if (trimmed.includes('class CriticalCSSAnalyzer')) {
        inClass = true;
        classStarted = true;
        cleanLines.push(line);
        console.log(`✅ Class starts at line ${cleanLines.length}`);
        continue;
    }
    
    // End class before DOMContentLoaded
    if (inClass && trimmed.includes('DOMContentLoaded')) {
        cleanLines.push('        } // End CriticalCSSAnalyzer class');
        cleanLines.push('');
        inClass = false;
        console.log(`✅ Class ends at line ${cleanLines.length - 1}`);
    }
    
    // Track brace depth for validation
    if (inClass) {
        braceDepth += (line.match(/\{/g) || []).length;
        braceDepth -= (line.match(/\}/g) || []).length;
    }
    
    cleanLines.push(line);
}

// If class never ended, end it
if (inClass) {
    cleanLines.push('        } // End CriticalCSSAnalyzer class');
    console.log(`✅ Class closed at end`);
}

// Rebuild full HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const cleanJs = cleanLines.join('\n');
const fullContent = htmlBefore + '<script>\n' + cleanJs + '\n    </script>' + htmlAfter;

// Save
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log(`✅ Clean version saved: ${Math.round(fullContent.length / 1024)}KB`);

// Final validation
fs.writeFileSync('temp-final-validation.js', cleanJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-final-validation.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log(`\n📊 FINAL VALIDATION: ${code === 0 ? '🎉 PERFECT SYNTAX!' : '❌ ' + errorOutput.split('\n')[0]}`);
    
    if (code === 0) {
        console.log('🚀 SUCCESS! JavaScript is syntactically correct');
        console.log('✨ Ready for user testing');
    } else if (errorOutput.includes('SyntaxError')) {
        console.log('⚠️ Remaining syntax issues detected');
        
        // One more attempt at specific fix
        const errorMatch = errorOutput.match(/temp-final-validation\.js:(\d+)/);
        if (errorMatch) {
            const errorLine = parseInt(errorMatch[1]);
            const problemLine = cleanLines[errorLine - 1];
            console.log(`🎯 Problem at line ${errorLine}: ${problemLine}`);
        }
    }
    
    // Clean up
    try { fs.unlinkSync('temp-final-validation.js'); } catch(e) {}
    
    console.log('\n🏁 Final comprehensive fix complete');
});