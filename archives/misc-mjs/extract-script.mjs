import fs from 'fs';

// HTMLファイルを読み込み
const html = fs.readFileSync('public/os_analyzer.html', 'utf-8');

// scriptタグの内容を抽出（2632行から8626行）
const lines = html.split('\n');
const scriptContent = lines.slice(2631, 8626).join('\n');

// 別ファイルに保存
fs.writeFileSync('extracted-script.js', scriptContent);

console.log('スクリプトを extracted-script.js に抽出しました');

// 簡単な構文チェック
try {
    new Function(scriptContent);
    console.log('✅ 構文エラーは検出されませんでした');
} catch (error) {
    console.error('❌ 構文エラー:', error.message);
    
    // エラー位置を特定
    const match = error.message.match(/(\d+):(\d+)/);
    if (match) {
        const lineNum = parseInt(match[1]);
        const errorLine = lines[2631 + lineNum - 1];
        console.log(`エラー行（${2631 + lineNum}行目）: ${errorLine}`);
    }
}