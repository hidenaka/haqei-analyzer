const { chromium } = require('playwright');
const fs = require('fs');

async function locateSyntaxError() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let syntaxError = null;
  
  // Capture the exact syntax error with location
  page.on('pageerror', error => {
    if (error.message.includes('Unexpected token')) {
      syntaxError = {
        message: error.message,
        stack: error.stack,
        line: error.lineNumber,
        column: error.columnNumber
      };
      console.log('🎯 Syntax Error Found:');
      console.log('Message:', error.message);
      console.log('Stack:', error.stack);
    }
  });
  
  try {
    await page.goto('http://127.0.0.1:8788/future_simulator.html');
    await page.waitForTimeout(2000);
  } catch (error) {
    console.log('Page load error:', error.message);
  }
  
  await browser.close();
  
  if (syntaxError) {
    // Read the HTML file to examine the problematic area
    const htmlContent = fs.readFileSync('/Users/nakanohideaki/Desktop/haqei-analyzer/public/future_simulator.html', 'utf8');
    const lines = htmlContent.split('\n');
    
    console.log('\n🔍 Examining HTML file around potential error locations...');
    
    // Look for common syntax error patterns
    const errorPatterns = [
      /\{\s*\{/,           // Double opening braces
      /\}\s*\}/,           // Double closing braces  
      /\{[^}]*$/m,         // Unclosed braces
      /^[^{]*\}/m,         // Unmatched closing braces
      /,\s*\}/,            // Trailing comma before }
      /\{\s*,/,            // Leading comma after {
    ];
    
    lines.forEach((line, index) => {
      errorPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          console.log(`⚠️  Line ${index + 1}: ${line.trim()}`);
        }
      });
      
      // Check for specific problematic constructs
      if (line.includes('{{') || line.includes('}}')) {
        console.log(`🚨 Double brace found at line ${index + 1}: ${line.trim()}`);
      }
    });
    
    return syntaxError;
  }
  
  return null;
}

async function validateJavaScriptSections() {
  console.log('🔍 Checking JavaScript sections in HTML file...');
  
  const htmlContent = fs.readFileSync('/Users/nakanohideaki/Desktop/haqei-analyzer/public/future_simulator.html', 'utf8');
  const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  
  if (scriptMatches) {
    scriptMatches.forEach((script, index) => {
      const scriptContent = script.replace(/<script[^>]*>|<\/script>/gi, '');
      
      try {
        // Try to parse the JavaScript (this won't execute, just parse)
        new Function(scriptContent);
        console.log(`✅ Script section ${index + 1}: Valid syntax`);
      } catch (error) {
        console.log(`❌ Script section ${index + 1}: ${error.message}`);
        console.log('Script preview:', scriptContent.substring(0, 200) + '...');
      }
    });
  }
}

// Run both checks
locateSyntaxError()
  .then(error => {
    if (error) {
      console.log('\n✅ Syntax error located and analyzed');
    } else {
      console.log('\n⚠️  Syntax error not caught by page error handler');
    }
    
    return validateJavaScriptSections();
  })
  .then(() => {
    console.log('\n🏁 JavaScript validation completed');
  })
  .catch(err => {
    console.error('Validation failed:', err);
  });