const fs = require('fs');

// Test smaller chunks of the file to find exactly where the error is
const content = fs.readFileSync('public/js/data/hexagram-human-traits-v3.js', 'utf8');
const lines = content.split('\n');

// Try to find the exact line with the syntax error
for (let i = 2940; i < 2960; i++) {
  console.log(`Line ${i}: ${lines[i-1]}`);
}

// Try to evaluate just the problematic section
console.log('\n=== Testing syntax around line 2949 ===');
const testSection = lines.slice(2940, 2960).join('\n');
console.log(testSection);