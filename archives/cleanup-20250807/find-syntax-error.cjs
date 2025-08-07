const fs = require('fs');

// Read the HTML file
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// Extract all JavaScript content between script tags
const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);

if (scriptMatches) {
    scriptMatches.forEach((scriptBlock, index) => {
        const jsCode = scriptBlock.replace(/<\/?script[^>]*>/gi, '');
        
        // Try to validate the JavaScript syntax
        try {
            // Use Function constructor to test syntax
            new Function(jsCode);
            console.log(`✅ Script block ${index + 1}: Syntax OK`);
        } catch (error) {
            console.error(`❌ Script block ${index + 1}: Syntax Error`);
            console.error(`Error: ${error.message}`);
            
            // Try to find the problematic line
            const lines = jsCode.split('\n');
            let tryCount = 0;
            let catchCount = 0;
            let finallyCount = 0;
            
            lines.forEach((line, lineIndex) => {
                if (line.includes('try') && line.includes('{')) {
                    tryCount++;
                    console.log(`Line ${lineIndex + 1}: try block found`);
                }
                if (line.includes('catch') && line.includes('(')) {
                    catchCount++;
                    console.log(`Line ${lineIndex + 1}: catch block found`);
                }
                if (line.includes('finally') && line.includes('{')) {
                    finallyCount++;
                    console.log(`Line ${lineIndex + 1}: finally block found`);
                }
            });
            
            console.log(`Summary: ${tryCount} try blocks, ${catchCount} catch blocks, ${finallyCount} finally blocks`);
            
            // Show the problematic area
            const errorLines = jsCode.split('\n').slice(Math.max(0, error.lineNumber - 10), error.lineNumber + 10);
            console.log('Context around error:');
            errorLines.forEach((line, idx) => {
                console.log(`${idx}: ${line}`);
            });
        }
    });
} else {
    console.log('No script blocks found');
}