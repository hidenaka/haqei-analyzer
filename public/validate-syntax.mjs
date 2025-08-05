import fs from 'fs';
import { parse } from 'acorn';

const content = fs.readFileSync('future_simulator.html', 'utf8');

// Extract module script
const moduleMatch = content.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!moduleMatch) {
  console.log('No module script found');
  process.exit(1);
}

const moduleScript = moduleMatch[1];
console.log(`Module script length: ${moduleScript.length} characters`);

// Try to parse with acorn
try {
  parse(moduleScript, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  });
  console.log('✅ Script is syntactically valid!');
} catch (error) {
  console.log('❌ Syntax error found:');
  console.log(`  Message: ${error.message}`);
  console.log(`  Position: ${error.pos}`);
  
  // Show context around error
  if (error.pos) {
    const start = Math.max(0, error.pos - 200);
    const end = Math.min(moduleScript.length, error.pos + 200);
    const context = moduleScript.substring(start, end);
    const relativePos = error.pos - start;
    
    console.log('\nContext around error:');
    console.log(context);
    console.log(' '.repeat(relativePos) + '^--- Error here');
    
    // Count lines to find line number
    const lines = moduleScript.substring(0, error.pos).split('\n');
    console.log(`\nError at line ${lines.length} of module script`);
  }
}