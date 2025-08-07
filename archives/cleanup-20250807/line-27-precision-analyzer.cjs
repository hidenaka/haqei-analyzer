const fs = require('fs');

console.log('🎯 LINE 27 PRECISION ANALYZER');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log(`📍 LINE 27 CONTENT: "${lines[26]}"`);
console.log(`📍 LINE 27 TRIMMED: "${lines[26].trim()}"`);

// Show extensive context around line 27
console.log('\n📋 CONTEXT AROUND LINE 27:');
for (let i = 15; i <= 40; i++) {
    const marker = i === 26 ? '🚨 ' : '   ';
    const lineNum = i + 1;
    console.log(`${marker}${lineNum.toString().padStart(3, ' ')}: ${lines[i] || '[END OF FILE]'}`);
}

// Analyze structure from the beginning
console.log('\n🔍 STRUCTURE ANALYSIS FROM START:');

let braceBalance = 0;
let inQuestions = false;
let questionStart = -1;

for (let i = 0; i < Math.min(50, lines.length); i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;
    
    // Track QUESTIONS array
    if (trimmed.includes('const QUESTIONS = [')) {
        inQuestions = true;
        questionStart = i;
        console.log(`📍 QUESTIONS array starts at line ${lineNum}`);
    }
    
    // Track braces
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceBalance += openBraces - closeBraces;
    
    if (lineNum <= 30) {
        console.log(`Line ${lineNum.toString().padStart(3, ' ')}: balance=${braceBalance.toString().padStart(2, ' ')} | ${trimmed}`);
    }
    
    // Check for issues around line 27
    if (lineNum === 27) {
        console.log(`\n🚨 LINE 27 DIAGNOSIS:`);
        console.log(`   Content: "${trimmed}"`);
        console.log(`   Brace balance: ${braceBalance}`);
        console.log(`   In QUESTIONS: ${inQuestions}`);
        
        // Check if this is part of an object
        if (trimmed === '},') {
            console.log(`   🔍 This is an object separator`);
            
            // Check what precedes it
            const prevLine = lines[i - 1]?.trim() || '';
            const nextLine = lines[i + 1]?.trim() || '';
            
            console.log(`   Previous: "${prevLine}"`);
            console.log(`   Next: "${nextLine}"`);
            
            // Check if previous line properly closes
            if (prevLine.endsWith('}')) {
                console.log(`   ✅ Previous line properly closed with }`);
            } else if (prevLine.endsWith('"')) {
                console.log(`   🤔 Previous line ends with quote - might be property`);
            } else {
                console.log(`   ❌ Previous line doesn't properly close: "${prevLine}"`);
            }
            
            // Check if this is valid in context
            if (nextLine.startsWith('{') || nextLine === '{') {
                console.log(`   ✅ Next line starts new object - valid separator`);
            } else if (nextLine === '') {
                console.log(`   🤔 Next line is empty - checking further`);
            } else {
                console.log(`   ❌ Next line doesn't start object: "${nextLine}"`);
            }
        }
    }
}

// Specific check for question array structure
if (questionStart !== -1) {
    console.log(`\n📋 QUESTIONS ARRAY STRUCTURE CHECK:`);
    
    let questionCount = 0;
    let inQuestionObject = false;
    let objectDepth = 0;
    
    for (let i = questionStart; i < Math.min(questionStart + 100, lines.length); i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const lineNum = i + 1;
        
        // Track question objects
        if (trimmed === '{' && !inQuestionObject) {
            inQuestionObject = true;
            questionCount++;
            objectDepth = 1;
            console.log(`   Question ${questionCount} starts at line ${lineNum}`);
        } else if (inQuestionObject) {
            objectDepth += (line.match(/\{/g) || []).length;
            objectDepth -= (line.match(/\}/g) || []).length;
            
            if (objectDepth === 0 && (trimmed === '}' || trimmed === '},')) {
                console.log(`   Question ${questionCount} ends at line ${lineNum}: "${trimmed}"`);
                inQuestionObject = false;
                
                // Check what follows
                const nextLine = lines[i + 1]?.trim() || '';
                console.log(`     Next: "${nextLine}"`);
                
                if (nextLine === '{') {
                    console.log(`     ✅ Next question follows properly`);
                } else if (nextLine === '') {
                    console.log(`     🤔 Empty line follows`);
                } else if (nextLine === '];') {
                    console.log(`     ✅ Array ends properly`);
                } else {
                    console.log(`     ❌ Unexpected content after question: "${nextLine}"`);
                }
            }
        }
        
        // Stop at array end
        if (trimmed === '];') {
            console.log(`   QUESTIONS array ends at line ${lineNum}`);
            break;
        }
        
        // Focus on line 27 area
        if (lineNum >= 25 && lineNum <= 30) {
            console.log(`   Line ${lineNum}: depth=${objectDepth} | ${trimmed}`);
        }
    }
}

console.log('\n🏁 Line 27 precision analysis complete');