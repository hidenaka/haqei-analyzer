const fs = require('fs');

console.log('🔧 SYSTEMATIC METHOD PLACEMENT FIX');

const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const lines = content.split('\n');

// Find all method definitions outside class
const orphanedMethods = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Identify method definitions
    if (trimmed.match(/^\w+\([^)]*\)\s*\{/) && 
        !trimmed.includes('function') && 
        !trimmed.includes('if') && 
        !trimmed.includes('for') &&
        !trimmed.includes('while')) {
        
        orphanedMethods.push({
            line: i,
            method: trimmed,
            content: line
        });
    }
}

console.log(`📊 Found ${orphanedMethods.length} orphaned methods`);

// Show first 10 problematic methods
console.log('\n🚨 Top 10 Orphaned Methods:');
orphanedMethods.slice(0, 10).forEach((method, index) => {
    console.log(`${index + 1}. Line ${method.line + 1}: ${method.method}`);
});

// Find CriticalCSSAnalyzer class boundaries
let classStart = -1;
let classEnd = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class CriticalCSSAnalyzer')) {
        classStart = i;
        console.log(`\n📍 CriticalCSSAnalyzer starts at line ${i + 1}`);
    }
    
    if (classStart !== -1 && lines[i].includes('DOMContentLoaded')) {
        classEnd = i - 1;
        console.log(`📍 Class should end before line ${i + 1} (DOMContentLoaded)`);
        break;
    }
}

if (classStart === -1) {
    console.log('❌ Could not find CriticalCSSAnalyzer class');
    process.exit(1);
}

// Strategy: Move ALL methods between classStart and classEnd inside the class
// by removing early class closure

console.log('\n🔧 FIXING STRATEGY:');
console.log('1. Remove premature class closing brace');
console.log('2. Add proper class closing brace before DOMContentLoaded');

const newLines = [...lines];

// Find and remove premature class closures
let removedClosures = 0;
for (let i = classStart + 1; i < classEnd; i++) {
    const line = newLines[i].trim();
    
    // Remove standalone closing braces that close the class prematurely
    if (line === '}' || line === '} // End of CriticalCSSAnalyzer class') {
        // Check if this is really closing the class by looking at surrounding context
        const prevLine = i > 0 ? newLines[i - 1].trim() : '';
        const nextLine = i < newLines.length - 1 ? newLines[i + 1].trim() : '';
        
        // If next line is a method definition, this closure is premature
        if (nextLine.match(/^\w+\([^)]*\)\s*\{/) || 
            nextLine.includes('//') || 
            nextLine === '') {
            
            console.log(`🗑️  Removing premature closure at line ${i + 1}: "${line}"`);
            newLines[i] = '        // Removed premature class closure';
            removedClosures++;
        }
    }
}

// Add proper class closure before DOMContentLoaded
if (classEnd > 0) {
    newLines.splice(classEnd, 0, '        } // End of CriticalCSSAnalyzer class - FIXED');
    console.log(`✅ Added proper class closure at line ${classEnd + 1}`);
}

console.log(`📊 Removed ${removedClosures} premature closures`);

// Write the fixed content
const fixedContent = newLines.join('\n');
fs.writeFileSync('public/os_analyzer.html', fixedContent);

console.log(`✅ Systematic fix applied! Size: ${Math.round(fixedContent.length / 1024)}KB`);

// Quick syntax validation
const scriptMatch = fixedContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

fs.writeFileSync('temp-validation-check.js', jsCode);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-validation-check.js']);

syntaxCheck.on('close', (code) => {
    console.log(`\n📊 VALIDATION RESULT: ${code === 0 ? '✅ SYNTAX FIXED!' : '❌ Still has issues'}`);
    
    // Clean up
    try { fs.unlinkSync('temp-validation-check.js'); } catch(e) {}
    
    if (code === 0) {
        console.log('🎉 SUCCESS! JavaScript syntax is now valid');
        console.log('🚀 Ready for user testing');
    } else {
        console.log('⚠️ Partial improvement - need further fixing');
    }
});

console.log('\n🎯 Systematic method placement fix complete');