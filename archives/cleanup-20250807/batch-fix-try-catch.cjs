const fs = require('fs');

console.log('🔧 一括TRY-CATCH修正ツール実行中...');

// ファイルを読み込み
let content = fs.readFileSync('public/os_analyzer.html', 'utf8');

// すべての不完全なtryブロックを検索・修正
let fixCount = 0;

// パターン1: try { で始まってcatchもfinallyもない場合
// より正確なパターンマッチングのため、関数の終わりまでを対象に
const tryPatterns = [
    // 関数内のtryブロック（多くの場合）
    {
        search: /(try \{\s*[\s\S]*?)\n(\s*}\s*\n\s*(?:\/\*\*|\/\/|\w+\s*\(|\w+\s*\{|$))/g,
        replace: (match, tryBlock, ending) => {
            // catchブロックが既に存在するかチェック
            if (tryBlock.includes('} catch (') || tryBlock.includes('}catch(')) {
                return match; // 既にcatchがある場合はそのまま
            }
            fixCount++;
            return tryBlock + '\n                } catch (error) {\n                    console.error(\`❌ Error in operation: \${error.message}\`);\n                    return null;\n' + ending;
        }
    }
];

// より厳密な修正：各tryブロックの終了を正確に検出
const lines = content.split('\n');
let fixedLines = [];
let inTryBlock = false;
let tryStartIndex = -1;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // tryブロック開始検出
    if (trimmedLine.match(/^\s*try\s*\{/) && !inTryBlock) {
        inTryBlock = true;
        tryStartIndex = i;
        braceDepth = 1;
        fixedLines.push(line);
        continue;
    }
    
    if (inTryBlock) {
        // 波括弧をカウント
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceDepth += openBraces - closeBraces;
        
        fixedLines.push(line);
        
        // tryブロックが終了した場合
        if (braceDepth <= 0) {
            // 次の行がcatchかfinallyかチェック
            const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
            const nextTrimmed = nextLine.trim();
            
            if (!nextTrimmed.startsWith('} catch') && !nextTrimmed.startsWith('}catch') && 
                !nextTrimmed.startsWith('} finally') && !nextTrimmed.startsWith('}finally')) {
                
                // catch文を挿入
                const indent = line.match(/^(\s*)/)[1]; // 現在行のインデントを取得
                fixedLines.push(indent + '} catch (error) {');
                fixedLines.push(indent + '    console.error(`❌ Operation failed: ${error.message}`);'); 
                fixedLines.push(indent + '    return null; // Default fallback');
                
                fixCount++;
                console.log(`🔧 Fix ${fixCount}: Added catch block at line ${i + 1}`);
            }
            
            inTryBlock = false;
            braceDepth = 0;
        }
    } else {
        fixedLines.push(line);
    }
}

// 修正された内容を結合
const fixedContent = fixedLines.join('\n');

// ファイルを保存
fs.writeFileSync('public/os_analyzer.html', fixedContent);

console.log(`\n🎉 修正完了！`);
console.log(`📊 修正されたTRYブロック数: ${fixCount}個`);
console.log(`📄 ファイルサイズ: ${Math.round(fixedContent.length / 1024)}KB`);

console.log('\n✅ すべてのTRYブロックにCATCH文を追加しました');