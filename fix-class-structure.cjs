const fs = require('fs');

console.log('🔧 Complete Class Structure Fix...');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const lines = content.split('\n');

// Find where CriticalCSSAnalyzer class starts
const classStart = lines.findIndex(line => line.includes('class CriticalCSSAnalyzer'));
if (classStart === -1) {
    console.log('❌ CriticalCSSAnalyzer class not found');
    process.exit(1);
}

console.log(`Found class at line ${classStart + 1}`);

// Find where DOMContentLoaded listener starts (this is where class should end)
const domLoadedStart = lines.findIndex(line => line.includes('DOMContentLoaded'));
if (domLoadedStart === -1) {
    console.log('❌ DOMContentLoaded listener not found');
    process.exit(1);
}

console.log(`DOMContentLoaded starts at line ${domLoadedStart + 1}`);

// Find the last method before DOMContentLoaded
let lastMethodEnd = -1;
for (let i = domLoadedStart - 1; i > classStart; i--) {
    const line = lines[i].trim();
    if (line === '}' && !line.includes('catch') && !line.includes('if') && !line.includes('for')) {
        lastMethodEnd = i;
        break;
    }
}

if (lastMethodEnd === -1) {
    console.log('❌ Could not find last method');
    process.exit(1);
}

console.log(`Last method ends at line ${lastMethodEnd + 1}: "${lines[lastMethodEnd].trim()}"`);

// Show context around last method
console.log('\n📍 Context around last method:');
for (let i = Math.max(0, lastMethodEnd - 5); i <= Math.min(lines.length - 1, lastMethodEnd + 5); i++) {
    const marker = i === lastMethodEnd ? '>>> ' : '    ';
    console.log(`${marker}${i + 1}: ${lines[i]}`);
}

// Insert class closing brace after last method
const newLines = [...lines];
newLines.splice(lastMethodEnd + 1, 0, '        } // End of CriticalCSSAnalyzer class');

console.log('\n✅ Added class closing brace');

// Remove any malformed syntax around line 6877
const errorIndex = newLines.findIndex(line => line.includes(');'));
if (errorIndex !== -1) {
    console.log(`Removing malformed syntax at line ${errorIndex + 1}`);
    newLines[errorIndex] = '        }';
}

// Write back
const fixedContent = newLines.join('\n');
fs.writeFileSync('public/os_analyzer.html', fixedContent);

console.log(`✅ Class structure fixed! File size: ${Math.round(fixedContent.length / 1024)}KB`);

// Validate by counting braces in the class section
let braceBalance = 0;
const classEndLine = lastMethodEnd + 1; // Where we added the closing brace
for (let i = classStart; i <= classEndLine; i++) {
    const line = newLines[i];
    braceBalance += (line.match(/\{/g) || []).length;
    braceBalance -= (line.match(/\}/g) || []).length;
}

console.log(`🔧 Class brace balance: ${braceBalance === 0 ? '✅ Perfect' : '❌ Imbalanced (' + braceBalance + ')'}`);
console.log('🎯 Ready for syntax validation...');