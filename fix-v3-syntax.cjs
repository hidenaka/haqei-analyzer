#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');

try {
  console.log('Reading V3 database file...');
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log('Checking syntax...');
  
  // Try to parse the JavaScript to see where the syntax error is
  try {
    eval(content);
    console.log('✅ Syntax is valid!');
  } catch (error) {
    console.log('❌ Syntax error found:', error.message);
    
    // Try to fix common issues
    let fixedContent = content;
    
    // Look for missing commas between objects
    const lines = content.split('\n');
    const fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];
      
      // Check if this line ends with "}" and next line starts with a key
      if (line.trim() === '}' && nextLine && nextLine.trim().match(/^"[^"]+"\s*:/)) {
        // Add comma after the closing brace
        fixedLines.push(line.replace('}', '},'));
      } else {
        fixedLines.push(line);
      }
    }
    
    const potentialFix = fixedLines.join('\n');
    
    try {
      eval(potentialFix);
      console.log('✅ Auto-fix successful! Writing fixed version...');
      fs.writeFileSync(filePath + '.backup', content);
      fs.writeFileSync(filePath, potentialFix);
      console.log('✅ Fixed file written. Original backed up as .backup');
    } catch (fixError) {
      console.log('❌ Auto-fix failed:', fixError.message);
      console.log('Manual fix required');
    }
  }
  
} catch (err) {
  console.error('Error:', err.message);
}