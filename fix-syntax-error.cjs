const fs = require('fs');

// Read the HTML file
const htmlContent = fs.readFileSync('/Users/nakanohideaki/Desktop/haqei-analyzer/public/future_simulator.html', 'utf8');

// Look for the specific syntax error around the ProgressiveLoader class
const lines = htmlContent.split('\n');

// Find the problematic line that's causing the "Unexpected token '{'" error
let foundError = false;
let errorLine = null;

for (let i = 1440; i < Math.min(lines.length, 1500); i++) {
  const line = lines[i];
  const prevLine = lines[i-1] || '';
  
  // Look for problematic patterns that could cause "Unexpected token '{'"
  if (line.includes('{') && 
      (prevLine.includes('// 新しい最適化機能初期化') || 
       prevLine.trim().endsWith('初期化') ||
       line.match(/^\s*{/) ||
       prevLine.match(/^\s*$/))) {
    
    console.log(`⚠️  Line ${i + 1}: "${line.trim()}"`);
    console.log(`     Previous: "${prevLine.trim()}"`);
    
    // Check if this looks like a syntax error
    if (line.trim().startsWith('{') && !prevLine.includes('constructor') && !prevLine.includes('function') && !prevLine.includes('if') && !prevLine.includes('for') && !prevLine.includes('while')) {
      console.log(`🚨 POTENTIAL ERROR at line ${i + 1}`);
      errorLine = i + 1;
      foundError = true;
    }
  }
}

// Also check for missing content after initialization comment
const initLine = lines.findIndex(line => line.includes('// 新しい最適化機能初期化'));
if (initLine !== -1 && initLine < lines.length - 1) {
  console.log(`\n🔍 Checking initialization section around line ${initLine + 1}:`);
  for (let i = Math.max(0, initLine - 2); i < Math.min(lines.length, initLine + 10); i++) {
    const marker = i === initLine ? '>>> ' : '    ';
    console.log(`${marker}Line ${i + 1}: "${lines[i].trim()}"`);
  }
}

// Look for incomplete constructor
const constructorStart = lines.findIndex(line => line.includes('constructor()'));
if (constructorStart !== -1) {
  console.log(`\n🔍 Checking constructor completion around line ${constructorStart + 1}:`);
  let braceCount = 0;
  let constructorEnd = -1;
  
  for (let i = constructorStart; i < Math.min(lines.length, constructorStart + 50); i++) {
    const line = lines[i];
    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;
    
    if (braceCount === 0 && i > constructorStart) {
      constructorEnd = i;
      break;
    }
    
    console.log(`    Line ${i + 1} (braces: ${braceCount}): "${line.trim()}"`);
  }
  
  if (constructorEnd === -1) {
    console.log('❌ Constructor appears to be incomplete!');
  } else {
    console.log(`✅ Constructor ends at line ${constructorEnd + 1}`);
  }
}

if (foundError) {
  console.log(`\n🎯 Syntax error likely at line ${errorLine}`);
  console.log('This needs to be fixed to resolve the page rendering issue.');
} else {
  console.log('\n🤔 Syntax error pattern not immediately obvious from static analysis');
  console.log('The error might be more subtle or require runtime analysis');
}

console.log('\n📋 Next steps:');
console.log('1. Fix the identified syntax error');
console.log('2. Re-run browser test to verify fix');
console.log('3. Complete user experience validation');