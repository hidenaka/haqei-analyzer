import fs from 'fs';
import path from 'path';

console.log('🔍 重要な重複問題の詳細調査を開始します...');

// 完全重複ファイルの詳細確認
function investigateIdenticalFiles() {
  console.log('\n🔴 完全重複ファイルの詳細調査:');
  
  const file1 = 'public/js/emergency-bypass.js';
  const file2 = 'public/emergency-bypass.js';
  
  if (fs.existsSync(file1) && fs.existsSync(file2)) {
    const content1 = fs.readFileSync(file1, 'utf-8');
    const content2 = fs.readFileSync(file2, 'utf-8');
    
    console.log(`📄 ${file1}: ${(content1.length/1024).toFixed(1)}KB`);
    console.log(`📄 ${file2}: ${(content2.length/1024).toFixed(1)}KB`);
    
    if (content1 === content2) {
      console.log('✅ 完全に同一のファイルです');
      
      // 使用箇所の確認
      const usage1 = findFileUsage(file1);
      const usage2 = findFileUsage(file2);
      
      console.log(`\n📍 ${file1} の使用箇所: ${usage1.length}個`);
      usage1.forEach(usage => console.log(`   - ${usage}`));
      
      console.log(`📍 ${file2} の使用箇所: ${usage2.length}個`);
      usage2.forEach(usage => console.log(`   - ${usage}`));
      
      return {
        type: 'identical',
        file1, file2,
        usage1, usage2,
        recommendation: usage1.length >= usage2.length ? `${file2}を削除し、${file1}に統一` : `${file1}を削除し、${file2}に統一`
      };
    }
  }
  
  return null;
}

// 高類似度ファイルの調査
function investigateSimilarFiles() {
  console.log('\n🟡 高類似度ファイルの詳細調査:');
  
  const similarPairs = [
    ['public/js/AdvanceProcessor.js', 'public/js/iching/AdvanceProcessor.js'],
    ['public/js/KingWenMapping.js', 'public/js/iching/KingWenMapping.js'],
    ['public/js/LineSelector.js', 'public/js/iching/LineSelector.js'],
    ['public/js/MultiLineInterpreter.js', 'public/js/iching/MultiLineInterpreter.js']
  ];
  
  const results = [];
  
  for (const [file1, file2] of similarPairs) {
    if (fs.existsSync(file1) && fs.existsSync(file2)) {
      const content1 = fs.readFileSync(file1, 'utf-8');
      const content2 = fs.readFileSync(file2, 'utf-8');
      
      console.log(`\n📄 ${path.basename(file1)} vs ${path.basename(file2)}:`);
      console.log(`   サイズ: ${(content1.length/1024).toFixed(1)}KB vs ${(content2.length/1024).toFixed(1)}KB`);
      
      // 主要な関数定義を比較
      const functions1 = extractFunctionNames(content1);
      const functions2 = extractFunctionNames(content2);
      
      const commonFunctions = functions1.filter(f => functions2.includes(f));
      const uniqueToFile1 = functions1.filter(f => !functions2.includes(f));
      const uniqueToFile2 = functions2.filter(f => !functions1.includes(f));
      
      console.log(`   共通関数: ${commonFunctions.length}個`);
      console.log(`   ${path.basename(file1)}のみ: ${uniqueToFile1.length}個`);
      console.log(`   ${path.basename(file2)}のみ: ${uniqueToFile2.length}個`);
      
      const usage1 = findFileUsage(file1);
      const usage2 = findFileUsage(file2);
      
      console.log(`   使用箇所: ${usage1.length}個 vs ${usage2.length}個`);
      
      let recommendation = '';
      if (commonFunctions.length / Math.max(functions1.length, functions2.length) > 0.8) {
        recommendation = '統合を強く推奨 - ほぼ同じ機能';
      } else if (uniqueToFile1.length === 0) {
        recommendation = `${file1}は${file2}に含まれるため削除可能`;
      } else if (uniqueToFile2.length === 0) {
        recommendation = `${file2}は${file1}に含まれるため削除可能`;
      } else {
        recommendation = '共通部分を基底クラス化し、差分を個別クラス化';
      }
      
      results.push({
        file1, file2,
        functions1: functions1.length,
        functions2: functions2.length,
        commonFunctions: commonFunctions.length,
        usage1: usage1.length,
        usage2: usage2.length,
        recommendation
      });
    }
  }
  
  return results;
}

// 巨大ファイルの分析
function investigateLargeFiles() {
  console.log('\n📏 巨大ファイルの分析:');
  
  const largeFiles = [
    'public/js/os-analyzer-main.js',
    'public/assets/H384H64database.js',
    'public/js/binary-tree-complete-display.js',
    'public/js/core/ScreenManager.js'
  ];
  
  const results = [];
  
  for (const file of largeFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n').length;
      const functions = extractFunctionNames(content);
      
      console.log(`\n📄 ${file}:`);
      console.log(`   サイズ: ${(content.length/1024).toFixed(1)}KB`);
      console.log(`   行数: ${lines}行`);
      console.log(`   関数数: ${functions.length}個`);
      
      // 複雑度の簡易計算
      const complexity = calculateComplexity(content);
      console.log(`   複雑度スコア: ${complexity}`);
      
      let recommendation = '';
      if (functions.length > 50) {
        recommendation = '関数数が多すぎ - 機能別ファイル分割を推奨';
      } else if (lines > 1000) {
        recommendation = '行数が多すぎ - クラス/モジュール分割を推奨';
      } else if (complexity > 100) {
        recommendation = '複雑度が高すぎ - リファクタリングを推奨';
      } else {
        recommendation = 'サイズは大きいが構造は許容範囲';
      }
      
      results.push({
        file,
        sizeKB: Math.round(content.length / 1024),
        lines,
        functions: functions.length,
        complexity,
        recommendation
      });
    }
  }
  
  return results;
}

// 未使用ファイルの検証
function verifyUnusedFiles() {
  console.log('\n🗑️ 未使用疑いファイルの検証:');
  
  const suspiciousFiles = [
    'public/assets/js/questions-full-backup-20250118.js',
    'public/js/core/TripleOSInteractionAnalyzer.backup.20250111.js',
    'public/future-simulator-test.js',
    'public/test-console-check.js',
    'public/test-core-logic.js'
  ];
  
  const results = [];
  
  for (const file of suspiciousFiles) {
    if (fs.existsSync(file)) {
      const usage = findFileUsage(file);
      const content = fs.readFileSync(file, 'utf-8');
      
      console.log(`\n📄 ${file}:`);
      console.log(`   サイズ: ${(content.length/1024).toFixed(1)}KB`);
      console.log(`   使用箇所: ${usage.length}個`);
      
      if (usage.length > 0) {
        console.log('   使用されています:');
        usage.slice(0, 3).forEach(u => console.log(`     - ${u}`));
      }
      
      let status = '';
      if (usage.length === 0) {
        if (file.includes('backup') || file.includes('test')) {
          status = '削除可能 - バックアップ/テストファイル';
        } else {
          status = '要確認 - 使用されていない可能性';
        }
      } else {
        status = '使用中 - 削除不可';
      }
      
      results.push({
        file,
        sizeKB: Math.round(content.length / 1024),
        usageCount: usage.length,
        status
      });
    }
  }
  
  return results;
}

// ファイル使用箇所の検索
function findFileUsage(targetFile) {
  const usage = [];
  const targetBasename = path.basename(targetFile, '.js');
  const targetPath = targetFile.replace(/^public\//, '');
  
  // 簡易的な検索パターン
  const searchPatterns = [
    `import.*${targetBasename}`,
    `require.*${targetBasename}`,
    `script.*src.*${targetBasename}`,
    targetPath
  ];
  
  function searchInDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            searchInDirectory(fullPath);
          } else if (item.endsWith('.js') || item.endsWith('.html') || item.endsWith('.mjs')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            for (const pattern of searchPatterns) {
              if (content.includes(targetBasename) || content.includes(targetPath)) {
                if (!usage.includes(fullPath)) {
                  usage.push(fullPath);
                }
                break;
              }
            }
          }
        } catch (error) {
          // ファイルアクセスエラーはスキップ
        }
      }
    } catch (error) {
      // ディレクトリアクセスエラーはスキップ
    }
  }
  
  searchInDirectory('./public');
  searchInDirectory('./');
  
  return usage.filter(u => u !== targetFile); // 自身を除外
}

// 関数名の抽出
function extractFunctionNames(content) {
  const functionPatterns = [
    /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function/g,
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(/g,
    /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*function/g,
    /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
  ];
  
  const functions = new Set();
  
  for (const pattern of functionPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && match[1] !== 'if' && match[1] !== 'for' && match[1] !== 'while') {
        functions.add(match[1]);
      }
    }
  }
  
  return Array.from(functions);
}

// 複雑度の簡易計算
function calculateComplexity(content) {
  const complexityIndicators = [
    /if\s*\(/g,
    /for\s*\(/g,
    /while\s*\(/g,
    /switch\s*\(/g,
    /catch\s*\(/g,
    /\?\s*.*\s*:/g, // 三項演算子
  ];
  
  let complexity = 0;
  
  for (const pattern of complexityIndicators) {
    const matches = content.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  }
  
  return complexity;
}

// メイン実行
function main() {
  console.log('🎯 重要な重複問題の詳細調査開始\n');
  
  const identicalResult = investigateIdenticalFiles();
  const similarResults = investigateSimilarFiles();
  const largeFileResults = investigateLargeFiles();
  const unusedFileResults = verifyUnusedFiles();
  
  console.log('\n📊 詳細調査結果サマリー:');
  
  if (identicalResult) {
    console.log('🔴 完全重複ファイル: 1ペア (即座に統合推奨)');
  }
  
  console.log(`🟡 高類似度ファイル: ${similarResults.length}ペア`);
  console.log(`📏 巨大ファイル: ${largeFileResults.length}個`);
  console.log(`🗑️ 未使用疑いファイル: ${unusedFileResults.length}個`);
  
  // 具体的なアクションプラン
  console.log('\n🎯 具体的アクションプラン:');
  
  console.log('\n【即座に実行すべき】');
  if (identicalResult) {
    console.log(`1. ${identicalResult.recommendation}`);
  }
  
  console.log('\n【中期的に実行すべき】');
  similarResults.forEach((result, index) => {
    console.log(`${index + 2}. ${path.basename(result.file1)} & ${path.basename(result.file2)}: ${result.recommendation}`);
  });
  
  console.log('\n【長期的に実行すべき】');
  largeFileResults.forEach((result, index) => {
    if (result.recommendation.includes('推奨')) {
      console.log(`${index + 6}. ${path.basename(result.file)}: ${result.recommendation}`);
    }
  });
  
  console.log('\n【削除検討可能】');
  unusedFileResults.forEach(result => {
    if (result.status.includes('削除可能')) {
      console.log(`- ${result.file}: ${result.status}`);
    }
  });
  
  // 結果保存
  const report = {
    timestamp: new Date().toISOString(),
    identical: identicalResult,
    similar: similarResults,
    largeFiles: largeFileResults,
    unusedFiles: unusedFileResults
  };
  
  fs.writeFileSync('./critical-duplication-investigation.json', JSON.stringify(report, null, 2));
  console.log('\n📄 詳細調査結果を critical-duplication-investigation.json に保存しました');
  
  return report;
}

// 実行
main();