const fs = require('fs');

console.log('🔬 ADVANCED ERROR DETECTOR - Alternative Analysis Methods');

// Read file with different encodings to check for encoding issues
console.log('\n📝 ENCODING ANALYSIS:');

try {
    const utf8Content = fs.readFileSync('public/os_analyzer.html', 'utf8');
    const bufferContent = fs.readFileSync('public/os_analyzer.html');
    
    console.log(`UTF-8 size: ${utf8Content.length} chars`);
    console.log(`Buffer size: ${bufferContent.length} bytes`);
    
    // Check for BOM
    const bom = bufferContent.slice(0, 3);
    if (bom[0] === 0xEF && bom[1] === 0xBB && bom[2] === 0xBF) {
        console.log('⚠️ UTF-8 BOM detected');
    } else {
        console.log('✅ No UTF-8 BOM');
    }
    
    // Extract JavaScript with buffer method
    const scriptMatch = utf8Content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');
    
    const lines = jsCode.split('\n');
    
    // Advanced line 27 analysis
    console.log('\n🔍 ADVANCED LINE 27 ANALYSIS:');
    
    const targetLines = [25, 26, 27, 28, 29];
    
    targetLines.forEach(lineIndex => {
        const line = lines[lineIndex];
        if (line) {
            const lineNum = lineIndex + 1;
            console.log(`\nLine ${lineNum}:`);
            console.log(`  Content: "${line}"`);
            console.log(`  Length: ${line.length}`);
            console.log(`  Ends with: "${line.slice(-5)}"`);
            
            // Check for invisible characters
            const invisibleChars = [];
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const code = char.charCodeAt(0);
                
                if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
                    invisibleChars.push({pos: i, char: char, code: code});
                }
                if (code > 127) {
                    invisibleChars.push({pos: i, char: char, code: code, type: 'non-ASCII'});
                }
            }
            
            if (invisibleChars.length > 0) {
                console.log(`  ⚠️ Invisible/non-ASCII chars: ${invisibleChars.length}`);
                invisibleChars.forEach(item => {
                    console.log(`    Position ${item.pos}: code ${item.code} ${item.type || ''}`);
                });
            } else {
                console.log(`  ✅ No invisible characters`);
            }
        }
    });
    
    // Context structure analysis
    console.log('\n🏗️ STRUCTURE CONTEXT ANALYSIS:');
    
    let braceStack = [];
    let parenStack = [];
    let bracketStack = [];
    
    for (let i = 20; i < 35; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const lineNum = i + 1;
        
        // Track all brackets
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            const pos = `${lineNum}:${j + 1}`;
            
            switch(char) {
                case '{': braceStack.push(pos); break;
                case '}': 
                    if (braceStack.length === 0) {
                        console.log(`❌ Unmatched } at ${pos}`);
                    } else {
                        braceStack.pop();
                    }
                    break;
                case '(': parenStack.push(pos); break;
                case ')':
                    if (parenStack.length === 0) {
                        console.log(`❌ Unmatched ) at ${pos}`);
                    } else {
                        parenStack.pop();
                    }
                    break;
                case '[': bracketStack.push(pos); break;
                case ']':
                    if (bracketStack.length === 0) {
                        console.log(`❌ Unmatched ] at ${pos}`);
                    } else {
                        bracketStack.pop();
                    }
                    break;
            }
        }
        
        console.log(`Line ${lineNum}: braces=${braceStack.length}, parens=${parenStack.length}, brackets=${bracketStack.length}`);
    }
    
    // AST-like parsing attempt
    console.log('\n🌳 AST-LIKE PARSING:');
    
    const contextLines = lines.slice(15, 35);
    let inStringLiteral = false;
    let stringChar = '';
    let escaped = false;
    
    contextLines.forEach((line, index) => {
        const lineNum = 16 + index;
        let tokens = [];
        let currentToken = '';
        let tokenType = 'unknown';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (inStringLiteral) {
                if (escaped) {
                    escaped = false;
                } else if (char === '\\') {
                    escaped = true;
                } else if (char === stringChar) {
                    inStringLiteral = false;
                    stringChar = '';
                    tokens.push({type: 'string', value: currentToken + char, pos: i});
                    currentToken = '';
                } else {
                    currentToken += char;
                }
            } else {
                if (char === '"' || char === "'") {
                    if (currentToken) {
                        tokens.push({type: tokenType, value: currentToken, pos: i - currentToken.length});
                    }
                    inStringLiteral = true;
                    stringChar = char;
                    currentToken = char;
                    tokenType = 'string';
                } else if (['{', '}', '(', ')', '[', ']', ',', ';'].includes(char)) {
                    if (currentToken.trim()) {
                        tokens.push({type: tokenType, value: currentToken.trim(), pos: i - currentToken.length});
                    }
                    tokens.push({type: 'punctuation', value: char, pos: i});
                    currentToken = '';
                    tokenType = 'unknown';
                } else if (char === ' ' || char === '\t') {
                    if (currentToken.trim()) {
                        tokens.push({type: tokenType, value: currentToken.trim(), pos: i - currentToken.length});
                        currentToken = '';
                        tokenType = 'unknown';
                    }
                } else {
                    currentToken += char;
                }
            }
        }
        
        if (currentToken.trim()) {
            tokens.push({type: tokenType, value: currentToken.trim(), pos: line.length - currentToken.length});
        }
        
        if (lineNum === 27) {
            console.log(`🚨 Line 27 tokens:`, tokens);
        }
    });
    
} catch (error) {
    console.error('Error in advanced analysis:', error);
}

console.log('\n🏁 Advanced error detection complete');