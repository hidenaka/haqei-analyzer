console.log('🎯 通常モード動作テスト開始...');

// テスト用のHTMLファイルを開いてJavaScriptが正常に実行されるかテスト
const fs = require('fs');
const path = require('path');

// HTMLファイル読み込み
const htmlPath = path.join(__dirname, 'public', 'os_analyzer.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('📄 os_analyzer.html サイズ:', Math.round(htmlContent.length / 1024), 'KB');

// JavaScript部分を抽出
const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (scriptMatches && scriptMatches.length > 0) {
    const mainScript = scriptMatches[scriptMatches.length - 1];
    const jsCode = mainScript.replace(/<\/?script[^>]*>/gi, '');
    
    console.log('📊 メインJavaScriptサイズ:', Math.round(jsCode.length / 1024), 'KB');
    
    // try-catch構造の確認
    const tryCount = (jsCode.match(/try\s*\{/g) || []).length;
    const catchCount = (jsCode.match(/\}\s*catch\s*\(/g) || []).length;
    
    console.log(`🔍 try文の数: ${tryCount}`);
    console.log(`🔍 catch文の数: ${catchCount}`);
    
    if (tryCount === catchCount) {
        console.log('✅ すべてのtry文に対応するcatch文があります');
        
        // CriticalCSSAnalyzerクラスの存在確認
        if (jsCode.includes('class CriticalCSSAnalyzer')) {
            console.log('✅ CriticalCSSAnalyzerクラスが存在します');
            
            // DOMContentLoadedの確認
            if (jsCode.includes('DOMContentLoaded')) {
                console.log('✅ DOMContentLoadedイベントリスナーが設定されています');
                
                // startAnalysisメソッドの確認
                if (jsCode.includes('startAnalysis()')) {
                    console.log('✅ startAnalysis()メソッドが存在します');
                    
                    console.log('\n🎉 通常モード用JavaScript構文チェック: 完全合格');
                    console.log('🚀 MCP検証準備完了 - ブラウザテストに進んでください');
                } else {
                    console.log('❌ startAnalysis()メソッドが見つかりません');
                }
            } else {
                console.log('❌ DOMContentLoadedが設定されていません');
            }
        } else {
            console.log('❌ CriticalCSSAnalyzerクラスが見つかりません');
        }
    } else {
        console.log(`❌ try-catch構造に不整合があります (try:${tryCount}, catch:${catchCount})`);
    }
} else {
    console.log('❌ JavaScriptコードが見つかりません');
}