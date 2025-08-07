const fs = require('fs');

console.log('🔬 MINIMAL ERROR ISOLATOR - Binary Search Approach');

// Read and extract JavaScript
const content = fs.readFileSync('public/os_analyzer.html', 'utf8');
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
const jsCode = scriptMatch[scriptMatch.length - 1].replace(/<\/?script[^>]*>/gi, '');

const lines = jsCode.split('\n');
console.log(`📊 Total lines: ${lines.length}`);

// Test progressively smaller chunks to isolate the exact error location
const testChunk = (startLine, endLine, chunkName) => {
    console.log(`\n🧪 Testing ${chunkName} (lines ${startLine + 1}-${endLine})`);
    
    const chunk = lines.slice(startLine, endLine).join('\n');
    const filename = `temp-chunk-${startLine}-${endLine}.js`;
    
    fs.writeFileSync(filename, chunk);
    
    const { spawn } = require('child_process');
    const syntaxCheck = spawn('node', ['--check', filename]);
    
    return new Promise((resolve) => {
        let errorOutput = '';
        
        syntaxCheck.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        syntaxCheck.on('close', (code) => {
            try { fs.unlinkSync(filename); } catch(e) {}
            
            if (code !== 0) {
                const match = errorOutput.match(new RegExp(`${filename}:(\\d+):(\\d+)`));
                if (match) {
                    const chunkLine = parseInt(match[1]);
                    const actualLine = startLine + chunkLine;
                    
                    console.log(`❌ Error in ${chunkName}: line ${chunkLine} (actual: ${actualLine})`);
                    console.log(`   Content: "${lines[actualLine - 1]}"`);
                    console.log(`   Error: ${errorOutput.split('\n')[0]}`);
                    
                    resolve({
                        hasError: true,
                        errorLine: actualLine,
                        chunkLine: chunkLine,
                        error: errorOutput.split('\n')[0],
                        content: lines[actualLine - 1]
                    });
                } else {
                    console.log(`❌ Error in ${chunkName} but couldn't parse location`);
                    console.log(`   Error: ${errorOutput}`);
                    resolve({ hasError: true, unparseable: true });
                }
            } else {
                console.log(`✅ ${chunkName} is syntactically correct`);
                resolve({ hasError: false });
            }
        });
    });
};

// Binary search to find the problematic section
const binarySearchError = async () => {
    console.log('\n🔍 Starting binary search for error location...');
    
    // First test the full file to confirm error exists
    const fullResult = await testChunk(0, lines.length, 'Full file');
    if (!fullResult.hasError) {
        console.log('🤔 No error found in full file - this is unexpected');
        return;
    }
    
    console.log(`🎯 Confirmed error at line ${fullResult.errorLine}`);
    
    // Now do binary search around that area
    let start = 0;
    let end = Math.min(lines.length, fullResult.errorLine + 100);
    
    while (end - start > 10) {
        const mid = Math.floor((start + end) / 2);
        
        const result = await testChunk(start, mid, `First half (${start + 1}-${mid})`);
        
        if (result.hasError) {
            // Error is in first half
            end = mid;
            console.log(`🔍 Error is in first half, narrowing to ${start + 1}-${end}`);
        } else {
            // Error is in second half
            start = mid;
            console.log(`🔍 Error is in second half, narrowing to ${start + 1}-${end}`);
        }
    }
    
    // Test the final small range line by line
    console.log(`\n🔬 Final analysis of lines ${start + 1}-${end}:`);
    for (let i = start; i < end; i++) {
        const result = await testChunk(i, i + 1, `Line ${i + 1}`);
        if (result.hasError) {
            console.log(`🚨 FOUND PROBLEMATIC LINE: ${i + 1}`);
            console.log(`   Content: "${lines[i]}"`);
            console.log(`   Error: ${result.error}`);
        }
    }
};

// Run the binary search
binarySearchError().then(() => {
    console.log('\n🏁 Minimal error isolator complete');
}).catch(console.error);