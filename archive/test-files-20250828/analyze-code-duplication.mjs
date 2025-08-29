import fs from 'fs';
import path from 'path';

console.log('🔍 コード重複・関数重複分析を開始します...');

// JavaScriptファイルを再帰的に検索
function findJSFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findJSFiles(fullPath, files);
    } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 関数定義を抽出
function extractFunctions(content, filePath) {
  const functions = [];
  
  // 関数定義のパターン
  const patterns = [
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,  // function name()
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function/g,  // const name = function
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(/g,  // const name = ()
    /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function/g,  // let name = function
    /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function/g,  // var name = function
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*function/g,  // name: function (object method)
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/g,  // name() { (method shorthand)
    /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,  // class Name
  ];
  
  patterns.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      functions.push({
        name: match[1],
        type: ['function', 'const_function', 'const_arrow', 'let_function', 'var_function', 'method', 'method_shorthand', 'class'][index],
        file: filePath,
        line: content.substring(0, match.index).split('\n').length
      });
    }
  });
  
  return functions;
}

// 重複するコードブロックを検出
function findCodeDuplication(content, filePath) {
  const lines = content.split('\n');
  const codeBlocks = [];
  
  // 5行以上の連続したコードブロックを抽出
  for (let i = 0; i < lines.length - 4; i++) {
    const block = lines.slice(i, i + 5).join('\n').trim();
    if (block.length > 50 && !block.includes('//') && !block.includes('/*')) {
      codeBlocks.push({
        content: block,
        file: filePath,
        startLine: i + 1,
        endLine: i + 5
      });
    }
  }
  
  return codeBlocks;
}

// メイン分析
async function analyzeCodeDuplication() {
  console.log('📁 JavaScriptファイルを検索中...');
  
  const jsFiles = findJSFiles('./public');
  console.log(`✅ ${jsFiles.length}個のJavaScriptファイルを発見`);
  
  const allFunctions = [];
  const allCodeBlocks = [];
  const fileAnalysis = {};
  
  // 各ファイルを分析
  for (const file of jsFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const functions = extractFunctions(content, file);
      const codeBlocks = findCodeDuplication(content, file);
      
      allFunctions.push(...functions);
      allCodeBlocks.push(...codeBlocks);
      
      fileAnalysis[file] = {
        size: content.length,
        lines: content.split('\n').length,
        functions: functions.length,
        codeBlocks: codeBlocks.length
      };
      
      console.log(`📝 ${file}: ${functions.length}個の関数, ${codeBlocks.length}個のコードブロック`);
    } catch (error) {
      console.log(`❌ ${file}: 読み込みエラー - ${error.message}`);
    }
  }
  
  console.log('\n🔍 重複分析を実行中...');
  
  // 関数名の重複チェック
  const functionsByName = new Map();
  allFunctions.forEach(func => {
    if (!functionsByName.has(func.name)) {
      functionsByName.set(func.name, []);
    }
    functionsByName.get(func.name).push(func);
  });
  
  const duplicateFunctions = Array.from(functionsByName.entries())
    .filter(([name, funcs]) => funcs.length > 1)
    .map(([name, funcs]) => ({ name, functions: funcs }));
  
  // コードブロックの重複チェック
  const blocksByContent = {};
  allCodeBlocks.forEach(block => {
    const key = block.content.replace(/\s+/g, ' ').trim();
    if (!blocksByContent[key]) {
      blocksByContent[key] = [];
    }
    blocksByContent[key].push(block);
  });
  
  const duplicateBlocks = Object.entries(blocksByContent)
    .filter(([content, blocks]) => blocks.length > 1)
    .map(([content, blocks]) => ({ content: content.substring(0, 100) + '...', blocks }));
  
  // 結果出力
  console.log('\n📊 分析結果:');
  console.log(`総ファイル数: ${jsFiles.length}`);
  console.log(`総関数数: ${allFunctions.length}`);
  console.log(`重複関数名: ${duplicateFunctions.length}`);
  console.log(`重複コードブロック: ${duplicateBlocks.length}`);
  
  // 重複関数の詳細
  if (duplicateFunctions.length > 0) {
    console.log('\n❌ 重複している関数名:');
    duplicateFunctions.forEach(duplicate => {
      console.log(`\n🔴 関数名: ${duplicate.name} (${duplicate.functions.length}箇所で定義)`);
      duplicate.functions.forEach(func => {
        console.log(`  - ${func.file}:${func.line} (${func.type})`);
      });
    });
  }
  
  // 重複コードブロックの詳細
  if (duplicateBlocks.length > 0) {
    console.log('\n❌ 重複しているコードブロック:');
    duplicateBlocks.slice(0, 5).forEach((duplicate, index) => {
      console.log(`\n🔴 重複コード ${index + 1}: (${duplicate.blocks.length}箇所)`);
      console.log(`内容: ${duplicate.content}`);
      duplicate.blocks.forEach(block => {
        console.log(`  - ${block.file}:${block.startLine}-${block.endLine}`);
      });
    });
  }
  
  // ファイル別統計
  console.log('\n📈 ファイル別統計:');
  Object.entries(fileAnalysis)
    .sort(([,a], [,b]) => b.functions - a.functions)
    .slice(0, 10)
    .forEach(([file, stats]) => {
      console.log(`${file}: ${stats.functions}関数, ${stats.lines}行, ${(stats.size/1024).toFixed(1)}KB`);
    });
  
  // 問題のあるファイルを特定
  const problematicFiles = Object.entries(fileAnalysis)
    .filter(([file, stats]) => stats.functions > 20 || stats.lines > 1000)
    .map(([file, stats]) => ({ file, ...stats }));
  
  if (problematicFiles.length > 0) {
    console.log('\n⚠️ 大きすぎるファイル（リファクタリング推奨）:');
    problematicFiles.forEach(file => {
      console.log(`${file.file}: ${file.functions}関数, ${file.lines}行`);
    });
  }
  
  // 具体的な推奨事項
  console.log('\n💡 推奨事項:');
  
  if (duplicateFunctions.length > 0) {
    console.log('1. 重複関数名の解決:');
    console.log('   - 名前空間を使用して関数名の衝突を避ける');
    console.log('   - 共通処理は単一の関数にまとめる');
    console.log('   - 異なる処理の場合は関数名を変更する');
  }
  
  if (duplicateBlocks.length > 0) {
    console.log('2. 重複コードの削減:');
    console.log('   - 共通処理を関数として抽出する');
    console.log('   - ユーティリティ関数を作成する');
    console.log('   - 設定オブジェクトやパラメータで差異を吸収する');
  }
  
  if (problematicFiles.length > 0) {
    console.log('3. ファイル分割:');
    console.log('   - 大きなファイルを機能別に分割する');
    console.log('   - クラスやモジュールパターンを使用する');
    console.log('   - 関連する関数をグループ化する');
  }
  
  return {
    totalFiles: jsFiles.length,
    totalFunctions: allFunctions.length,
    duplicateFunctions,
    duplicateBlocks,
    problematicFiles,
    fileAnalysis
  };
}

// 実行
analyzeCodeDuplication()
  .then(result => {
    console.log('\n✅ 分析完了');
    
    // 結果をJSONファイルに保存
    fs.writeFileSync('./code-duplication-analysis.json', JSON.stringify(result, null, 2));
    console.log('📄 詳細結果を code-duplication-analysis.json に保存しました');
  })
  .catch(error => {
    console.error('❌ 分析エラー:', error);
  });