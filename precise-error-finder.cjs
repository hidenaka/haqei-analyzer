const fs = require('fs');

console.log('🎯 PRECISE JavaScript構文エラー特定システム');

const htmlContent = fs.readFileSync('dist/os_analyzer.html', 'utf8');
const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

if (!scriptMatch) {
  console.log('❌ Script tag not found');
  process.exit(1);
}

const jsCode = scriptMatch[1];
const lines = jsCode.split('\n');

// 詳細な括弧バランス解析
let openBraces = 0;
let openParens = 0;
let openBrackets = 0;
let inString = false;
let stringChar = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    const prevChar = j > 0 ? line[j - 1] : '';
    
    // 文字列処理
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
    }
    
    if (!inString) {
      switch (char) {
        case '{': openBraces++; break;
        case '}': openBraces--; break;
        case '(': openParens++; break;
        case ')': openParens--; break;
        case '[': openBrackets++; break;
        case ']': openBrackets--; break;
      }
      
      // 負のバランスをチェック（閉じ括弧が多すぎる）
      if (openBraces < 0 || openParens < 0 || openBrackets < 0) {
        console.log(`❌ 括弧バランス異常 at Line ${lineNum}, Column ${j + 1}`);
        console.log(`   Line: "${line.trim()}"`);
        console.log(`   Braces: ${openBraces}, Parens: ${openParens}, Brackets: ${openBrackets}`);
        
        // 周辺5行を表示
        for (let k = Math.max(0, i - 2); k <= Math.min(lines.length - 1, i + 2); k++) {
          const marker = k === i ? '>>> ' : '    ';
          console.log(`${marker}${k + 1}: ${lines[k]}`);
        }
        break;
      }
    }
  }
  
  // try文の孤立検出
  if (line.trim() === 'try {') {
    let hasCatchOrFinally = false;
    
    // 次の20行でcatchかfinallyを探す
    for (let k = i + 1; k < Math.min(lines.length, i + 21); k++) {
      if (lines[k].includes('} catch (') || lines[k].includes('} finally {')) {
        hasCatchOrFinally = true;
        break;
      }
    }
    
    if (!hasCatchOrFinally) {
      console.log(`❌ 孤立したtry文発見 at Line ${lineNum}`);
      console.log(`   Line: "${line.trim()}"`);
      
      // 周辺を表示
      for (let k = Math.max(0, i - 2); k <= Math.min(lines.length - 1, i + 10); k++) {
        const marker = k === i ? '>>> ' : '    ';
        console.log(`${marker}${k + 1}: ${lines[k]}`);
      }
    }
  }
}

console.log(`\n✅ 最終括弧バランス - Braces: ${openBraces}, Parens: ${openParens}, Brackets: ${openBrackets}`);

if (openBraces !== 0 || openParens !== 0 || openBrackets !== 0) {
  console.log('❌ 括弧バランスが不完全です');
} else {
  console.log('✅ 括弧バランスは正常');
}