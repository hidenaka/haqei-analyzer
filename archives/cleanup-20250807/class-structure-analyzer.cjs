const fs = require('fs');

console.log('🔍 Class Structure Analysis...');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const lines = content.split('\n');

console.log(`Total lines: ${lines.length}`);

// Find CriticalCSSAnalyzer class
let classStart = -1;
let classEnd = -1;
let braceDepth = 0;
let inClass = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Find class start
    if (trimmed.includes('class CriticalCSSAnalyzer')) {
        classStart = i;
        console.log(`📍 Class starts at line ${i + 1}: ${trimmed}`);
        inClass = true;
        braceDepth = 0;
        continue;
    }
    
    if (inClass) {
        // Count braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceDepth += openBraces - closeBraces;
        
        // Class ends when brace depth returns to 0
        if (braceDepth === 0 && (openBraces > 0 || closeBraces > 0)) {
            classEnd = i;
            console.log(`🏁 Class ends at line ${i + 1}: ${trimmed}`);
            console.log(`Class spans ${classEnd - classStart + 1} lines`);
            break;
        }
        
        // Check for methods outside class (they would have brace depth issues)
        if (trimmed.match(/^\w+\([^)]*\)\s*\{/) && !trimmed.includes('function') && !trimmed.includes('if') && !trimmed.includes('for')) {
            console.log(`🚨 Potential orphaned method at line ${i + 1}: ${trimmed}`);
        }
    }
}

if (classStart !== -1 && classEnd === -1) {
    console.log('❌ CLASS NEVER CLOSES! This is the root cause of the syntax error.');
    
    // Look for the last method in the class
    console.log('🔍 Looking for last method in class...');
    for (let i = classStart + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().match(/^\w+\([^)]*\)\s*\{/) || line.includes('async ')) {
            console.log(`Last method around line ${i + 1}: ${line.trim()}`);
            
            // Show context around this line
            const start = Math.max(classStart, i - 5);
            const end = Math.min(lines.length - 1, i + 10);
            console.log('\nContext:');
            for (let j = start; j <= end; j++) {
                const marker = j === i ? '>>> ' : '    ';
                console.log(`${marker}${j + 1}: ${lines[j]}`);
            }
            break;
        }
    }
    
    console.log('\n🔧 SOLUTION: Need to close the CriticalCSSAnalyzer class properly');
} else if (classEnd !== -1) {
    console.log(`✅ Class properly closes at line ${classEnd + 1}`);
    
    // Check what comes after class end
    console.log('\n🔍 Checking what follows the class...');
    const start = Math.max(0, classEnd - 3);
    const end = Math.min(lines.length - 1, classEnd + 10);
    for (let i = start; i <= end; i++) {
        const marker = i === classEnd ? '>>> ' : '    ';
        console.log(`${marker}${i + 1}: ${lines[i]}`);
    }
} else {
    console.log('❌ CriticalCSSAnalyzer class not found!');
}

console.log('\n✅ Class structure analysis complete');