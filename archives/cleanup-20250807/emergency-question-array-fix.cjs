const fs = require('fs');

console.log('🚑 EMERGENCY QUESTIONS ARRAY REPAIR');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');

console.log('🔍 Finding QUESTIONS array boundaries...');

let questionsStart = -1;
let questionsEnd = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('const QUESTIONS = [')) {
        questionsStart = i;
        console.log(`📍 QUESTIONS array starts at line ${i + 1}`);
    }
    if (questionsStart !== -1 && line === '];' && questionsEnd === -1) {
        questionsEnd = i;
        console.log(`📍 QUESTIONS array ends at line ${i + 1}`);
        break;
    }
}

if (questionsStart === -1 || questionsEnd === -1) {
    console.log('❌ Could not find QUESTIONS array boundaries');
    process.exit(1);
}

console.log(`📊 QUESTIONS array spans lines ${questionsStart + 1} to ${questionsEnd + 1}`);

// Extract and analyze the QUESTIONS array
const questionLines = lines.slice(questionsStart, questionsEnd + 1);
console.log(`📋 Analyzing ${questionLines.length} lines in QUESTIONS array...`);

// Build corrected QUESTIONS array structure
const correctedQuestionLines = [];
let inQuestion = false;
let questionDepth = 0;

for (let i = 0; i < questionLines.length; i++) {
    const line = questionLines[i];
    const trimmed = line.trim();
    const originalLineNum = questionsStart + i + 1;
    
    // Start of array
    if (trimmed.includes('const QUESTIONS = [')) {
        correctedQuestionLines.push(line);
        console.log(`✅ Array declaration: line ${originalLineNum}`);
        continue;
    }
    
    // End of array
    if (trimmed === '];') {
        correctedQuestionLines.push(line);
        console.log(`✅ Array closing: line ${originalLineNum}`);
        continue;
    }
    
    // Question object start
    if (trimmed === '{') {
        inQuestion = true;
        questionDepth = 1;
        correctedQuestionLines.push(line);
        continue;
    }
    
    // Question object end
    if (inQuestion && (trimmed === '},' || trimmed === '}')) {
        // Check if this is actually the end of a question
        if (questionDepth === 1) {
            // Look ahead to see if next line starts new question or ends array
            const nextLine = i + 1 < questionLines.length ? questionLines[i + 1].trim() : '';
            
            if (nextLine === '{' || nextLine === '];') {
                // Valid question ending
                correctedQuestionLines.push(line);
                inQuestion = false;
                questionDepth = 0;
                console.log(`✅ Question ends: line ${originalLineNum}`);
            } else if (nextLine === '') {
                // Empty line after question - also valid
                correctedQuestionLines.push(line);
                inQuestion = false;
                questionDepth = 0;
                console.log(`✅ Question ends (empty next): line ${originalLineNum}`);
            } else {
                // Unexpected structure - might be broken
                console.log(`⚠️  Suspicious question end at line ${originalLineNum}: next="${nextLine}"`);
                correctedQuestionLines.push(line);
                inQuestion = false;
                questionDepth = 0;
            }
        } else {
            // Nested object/array closure
            correctedQuestionLines.push(line);
            questionDepth--;
        }
        continue;
    }
    
    // Track depth for nested structures
    if (inQuestion) {
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        questionDepth += openBraces - closeBraces;
    }
    
    // Regular content lines
    if (trimmed !== '' && trimmed !== '},' && trimmed !== '}') {
        correctedQuestionLines.push(line);
    } else if (trimmed === '') {
        // Keep empty lines for formatting
        correctedQuestionLines.push(line);
    } else {
        // Suspicious lone braces
        console.log(`🗑️  Removing suspicious line ${originalLineNum}: "${trimmed}"`);
    }
}

console.log(`📊 Original array lines: ${questionLines.length}`);
console.log(`📊 Corrected array lines: ${correctedQuestionLines.length}`);

// Rebuild full JavaScript with corrected array
const beforeQuestions = lines.slice(0, questionsStart);
const afterQuestions = lines.slice(questionsEnd + 1);

const fullLines = [...beforeQuestions, ...correctedQuestionLines, ...afterQuestions];
const fixedJs = fullLines.join('\n');

console.log(`📊 Total lines: ${lines.length} → ${fullLines.length}`);

// Rebuild complete HTML
const beforeJs = content.indexOf('<script>');
const afterJs = content.lastIndexOf('</script>') + 9;
const htmlBefore = content.substring(0, beforeJs);
const htmlAfter = content.substring(afterJs);

const fullContent = htmlBefore + '<script>\n' + fixedJs + '\n    </script>' + htmlAfter;

// Save fixed version
fs.writeFileSync('public/os_analyzer.html', fullContent);
console.log('✅ Emergency questions array repair applied');

// Test syntax
fs.writeFileSync('temp-questions-test.js', fixedJs);

const { spawn } = require('child_process');
const syntaxCheck = spawn('node', ['--check', 'temp-questions-test.js']);

let errorOutput = '';
syntaxCheck.stderr.on('data', (data) => {
    errorOutput += data.toString();
});

syntaxCheck.on('close', (code) => {
    console.log('\n🚑 EMERGENCY REPAIR RESULT:');
    
    if (code === 0) {
        console.log('🎉 EMERGENCY REPAIR SUCCESSFUL!');
        console.log('✨ QUESTIONS array structure fixed');
        console.log('🚀 JavaScript syntax is now valid');
    } else {
        console.log('❌ Emergency repair incomplete:');
        console.log(errorOutput);
    }
    
    // Clean up
    try { fs.unlinkSync('temp-questions-test.js'); } catch(e) {}
    
    console.log('\n🏁 Emergency questions array repair complete');
});