import fs from 'fs';
import path from 'path';

console.log('🔍 特定の重複パターンと重要なファイルの詳細分析を開始します...');

// 重要な関数名の重複を確認
function analyzeSpecificDuplications() {
  const duplicateFiles = [
    // 同じ機能を持つ可能性のあるファイル
    { 
      files: [
        'public/js/PerformanceOptimizer.js',
        'public/js/core/PerformanceOptimizer.js',
        'public/js/performance/PerformanceManager.js',
        'public/js/core/PerformanceBenchmark.js'
      ],
      category: 'パフォーマンス関連'
    },
    {
      files: [
        'public/js/QuestionManager.js',
        'public/js/core/QuestionManager.js',
        'public/js/ui/QuestionManager.js'
      ],
      category: '質問管理'
    },
    {
      files: [
        'public/js/StorageManager.js',
        'public/js/core/storage.js',
        'public/js/shared/core/StorageManager.js',
        'public/quick-analyzer/js/core/StorageManager.js'
      ],
      category: 'ストレージ管理'
    },
    {
      files: [
        'public/js/emergency-bypass.js',
        'public/emergency-bypass.js'
      ],
      category: '緊急バイパス'
    },
    {
      files: [
        'public/js/app.js',
        'public/assets/js/app.js',
        'public/quick-analyzer/js/app.js'
      ],
      category: 'メインアプリケーション'
    },
    {
      files: [
        'public/js/AdvanceProcessor.js',
        'public/js/iching/AdvanceProcessor.js'
      ],
      category: '前進処理'
    },
    {
      files: [
        'public/js/KingWenMapping.js',
        'public/js/iching/KingWenMapping.js'
      ],
      category: 'キングウェンマッピング'
    },
    {
      files: [
        'public/js/LineSelector.js',
        'public/js/iching/LineSelector.js'
      ],
      category: 'ライン選択'
    },
    {
      files: [
        'public/js/MultiLineInterpreter.js',
        'public/js/iching/MultiLineInterpreter.js'
      ],
      category: 'マルチライン解釈'
    }
  ];
  
  const results = {
    duplicateFiles: [],
    identicalFiles: [],
    partialDuplicates: [],
    recommendations: []
  };
  
  for (const group of duplicateFiles) {
    console.log(`\n📂 ${group.category}の分析中...`);
    
    const existingFiles = group.files.filter(file => {
      try {
        fs.accessSync(file);
        return true;
      } catch {
        return false;
      }
    });
    
    if (existingFiles.length > 1) {
      console.log(`✅ 存在するファイル: ${existingFiles.length}個`);
      
      const fileContents = existingFiles.map(file => ({
        path: file,
        content: fs.readFileSync(file, 'utf-8'),
        size: fs.statSync(file).size
      }));
      
      // ファイルサイズの比較
      fileContents.forEach(file => {
        console.log(`📄 ${file.path}: ${(file.size/1024).toFixed(1)}KB`);
      });
      
      // 完全に同一のファイルをチェック
      for (let i = 0; i < fileContents.length; i++) {
        for (let j = i + 1; j < fileContents.length; j++) {
          const file1 = fileContents[i];
          const file2 = fileContents[j];
          
          if (file1.content === file2.content) {
            results.identicalFiles.push({
              file1: file1.path,
              file2: file2.path,
              category: group.category
            });
            console.log(`🔴 完全同一ファイル発見: ${file1.path} ⟷ ${file2.path}`);
          } else {
            // 類似度チェック（簡易）
            const similarity = calculateSimilarity(file1.content, file2.content);
            if (similarity > 0.8) {
              results.partialDuplicates.push({
                file1: file1.path,
                file2: file2.path,
                similarity: Math.round(similarity * 100),
                category: group.category
              });
              console.log(`🟡 高い類似度: ${file1.path} ⟷ ${file2.path} (${Math.round(similarity * 100)}%)`);
            }
          }
        }
      }
      
      results.duplicateFiles.push({
        category: group.category,
        files: existingFiles,
        count: existingFiles.length
      });
    } else {
      console.log(`➖ 重複なし (${existingFiles.length}個のファイル)`);
    }
  }
  
  return results;
}

// 簡易類似度計算
function calculateSimilarity(str1, str2) {
  const normalize = (str) => str.replace(/\s+/g, ' ').trim().toLowerCase();
  const norm1 = normalize(str1);
  const norm2 = normalize(str2);
  
  if (norm1 === norm2) return 1.0;
  
  const shorter = norm1.length < norm2.length ? norm1 : norm2;
  const longer = norm1.length < norm2.length ? norm2 : norm1;
  
  if (shorter.length === 0) return 0.0;
  
  // Levenshtein距離ベースの類似度（簡易版）
  const editDistance = levenshteinDistance(shorter, longer);
  return 1.0 - editDistance / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// 巨大ファイルの分析
function analyzeLargeFiles() {
  console.log('\n📏 巨大ファイルの分析...');
  
  const jsFiles = [];
  
  function findJSFiles(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        findJSFiles(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
        jsFiles.push({
          path: fullPath,
          size: stat.size,
          lines: fs.readFileSync(fullPath, 'utf-8').split('\n').length
        });
      }
    }
  }
  
  findJSFiles('./public');
  
  // サイズ順でソート
  const largeFiles = jsFiles
    .filter(file => file.size > 50000) // 50KB以上
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  
  console.log('\n🔥 大きすぎるファイル (Top 10):');
  largeFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path}: ${(file.size/1024).toFixed(1)}KB, ${file.lines}行`);
  });
  
  return largeFiles;
}

// 未使用ファイルの検出
function findUnusedFiles() {
  console.log('\n🗑️ 未使用可能性のあるファイルを検出...');
  
  const suspiciousPatterns = [
    'backup',
    'old',
    'deprecated',
    'unused',
    'test',
    'temp',
    'debug',
    'v1', 'v2', 'v3', 'v4',
    '20250',  // 日付パターン
    'copy',
    'duplicate'
  ];
  
  const jsFiles = [];
  
  function findJSFiles(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        findJSFiles(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
        jsFiles.push(fullPath);
      }
    }
  }
  
  findJSFiles('./public');
  
  const suspiciousFiles = jsFiles.filter(file => {
    const basename = path.basename(file).toLowerCase();
    return suspiciousPatterns.some(pattern => basename.includes(pattern));
  });
  
  console.log('⚠️ 未使用の可能性があるファイル:');
  suspiciousFiles.forEach(file => {
    const stat = fs.statSync(file);
    console.log(`  - ${file} (${(stat.size/1024).toFixed(1)}KB)`);
  });
  
  return suspiciousFiles;
}

// メイン実行
async function main() {
  console.log('🎯 重複ファイル詳細分析開始\n');
  
  const duplicateResults = analyzeSpecificDuplications();
  const largeFiles = analyzeLargeFiles();
  const unusedFiles = findUnusedFiles();
  
  console.log('\n📊 分析結果サマリー:');
  console.log(`完全同一ファイル: ${duplicateResults.identicalFiles.length}ペア`);
  console.log(`高い類似度ファイル: ${duplicateResults.partialDuplicates.length}ペア`);
  console.log(`巨大ファイル (50KB+): ${largeFiles.length}個`);
  console.log(`未使用疑いファイル: ${unusedFiles.length}個`);
  
  // 推奨事項の生成
  console.log('\n💡 リファクタリング推奨事項:');
  
  if (duplicateResults.identicalFiles.length > 0) {
    console.log('\n1. 完全同一ファイルの統合:');
    duplicateResults.identicalFiles.forEach(dup => {
      console.log(`   ✂️ ${dup.file1} と ${dup.file2} を統合`);
      console.log(`      → 1つのファイルを残して他方を削除し、importパスを更新`);
    });
  }
  
  if (duplicateResults.partialDuplicates.length > 0) {
    console.log('\n2. 類似ファイルの統合・リファクタリング:');
    duplicateResults.partialDuplicates.forEach(dup => {
      console.log(`   🔄 ${dup.file1} と ${dup.file2} (類似度: ${dup.similarity}%)`);
      console.log(`      → 共通部分を抽出して基底クラス/ユーティリティ化`);
    });
  }
  
  if (largeFiles.length > 0) {
    console.log('\n3. 巨大ファイルの分割:');
    largeFiles.slice(0, 3).forEach(file => {
      console.log(`   📂 ${file.path} (${(file.size/1024).toFixed(1)}KB)`);
      console.log(`      → 機能別に複数ファイルに分割`);
    });
  }
  
  if (unusedFiles.length > 0) {
    console.log('\n4. 未使用ファイルの削除検討:');
    console.log(`   🗑️ ${unusedFiles.length}個のファイルの必要性を確認`);
    console.log(`      → バックアップファイル、テストファイル等の整理`);
  }
  
  // 結果をJSONに保存
  const report = {
    timestamp: new Date().toISOString(),
    duplicateResults,
    largeFiles,
    unusedFiles,
    summary: {
      identicalFiles: duplicateResults.identicalFiles.length,
      partialDuplicates: duplicateResults.partialDuplicates.length,
      largeFiles: largeFiles.length,
      unusedFiles: unusedFiles.length
    }
  };
  
  fs.writeFileSync('./code-duplication-detailed-analysis.json', JSON.stringify(report, null, 2));
  console.log('\n📄 詳細分析結果を code-duplication-detailed-analysis.json に保存しました');
  
  return report;
}

// 実行
main().catch(console.error);