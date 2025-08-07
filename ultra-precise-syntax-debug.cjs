const fs = require('fs');

console.log('🔬 Ultra-Precise JavaScript Syntax Debugger');

// Read the HTML file
const htmlContent = fs.readFileSync('dist/os_analyzer.html', 'utf8');

// Find the main script tag
const scriptStartMatch = htmlContent.match(/<script>\s*\/\/ =========================================/);
if (!scriptStartMatch) {
  console.log('❌ Main script tag not found');
  process.exit(1);
}

const scriptStart = scriptStartMatch.index;
const scriptEndMatch = htmlContent.indexOf('</script>', scriptStart);
const scriptContent = htmlContent.substring(scriptStart + scriptStartMatch[0].length, scriptEndMatch);

console.log('📊 Script size:', scriptContent.length, 'characters');

// Split into lines and analyze each one
const lines = scriptContent.split('\n');

// Look for suspicious patterns that could cause "Unexpected token '{'"
const suspiciousPatterns = [
  /^\s*\{[^}]*$/,           // Opening brace without closure
  /}\s*[a-zA-Z]/,           // Closing brace followed by identifier
  /}\s*{/,                  // Closing brace immediately followed by opening brace
  /=\s*\{[^}]*$/,          // Assignment to unclosed object literal
  /:\s*\{[^}]*$/,          // Property with unclosed object value
  /,\s*\{[^}]*$/,          // Comma followed by unclosed object
  /^\s*}\s*[^\s,;\]}]/     // Stray closing brace
];

const suspiciousLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Check each suspicious pattern
  for (let j = 0; j < suspiciousPatterns.length; j++) {
    if (suspiciousPatterns[j].test(line)) {
      suspiciousLines.push({
        lineNum,
        line: line.trim(),
        pattern: j,
        context: lines.slice(Math.max(0, i - 2), i + 3).map((l, idx) => 
          `${Math.max(0, i - 2) + idx + 1}: ${l}`
        )
      });
    }
  }
  
  // Check for specific problematic constructs
  if (line.includes('{') && !line.includes('}') && line.trim().length < 100) {
    const openCount = (line.match(/\{/g) || []).length;
    const closeCount = (line.match(/\}/g) || []).length;
    
    if (openCount > closeCount && !line.includes('function') && !line.includes('class')) {
      suspiciousLines.push({
        lineNum,
        line: line.trim(),
        pattern: 'unbalanced_braces',
        openCount,
        closeCount,
        context: lines.slice(Math.max(0, i - 2), i + 3).map((l, idx) => 
          `${Math.max(0, i - 2) + idx + 1}: ${l}`
        )
      });
    }
  }
}

console.log('\n🚨 SUSPICIOUS LINES FOUND:', suspiciousLines.length);

suspiciousLines.forEach((item, index) => {
  console.log(`\n--- Suspicious Line #${index + 1} ---`);
  console.log(`Line ${item.lineNum}: "${item.line}"`);
  console.log(`Pattern: ${item.pattern}`);
  if (item.openCount !== undefined) {
    console.log(`Braces - Open: ${item.openCount}, Close: ${item.closeCount}`);
  }
  console.log('Context:');
  item.context.forEach(contextLine => {
    const marker = contextLine.startsWith(`${item.lineNum}:`) ? '>>> ' : '    ';
    console.log(marker + contextLine);
  });
});

if (suspiciousLines.length === 0) {
  console.log('✅ No obvious syntax issues found in pattern analysis');
  console.log('🔍 The error might be more subtle - checking object literal syntax...');
  
  // Look for more subtle issues
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for object literal issues
    if (line.includes(': {') && !line.includes('}')) {
      console.log(`🔍 Potential object literal issue at line ${i + 1}:`);
      console.log(`   "${line}"`);
      
      // Show next 5 lines
      for (let j = i + 1; j < Math.min(lines.length, i + 6); j++) {
        console.log(`   ${j + 1}: ${lines[j]}`);
        if (lines[j].includes('}')) break;
      }
    }
  }
}

console.log('\n🎯 Syntax analysis complete');