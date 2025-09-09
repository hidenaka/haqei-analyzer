import fs from 'fs';
import path from 'path';

console.log('🔍 軽量コード重複分析を開始します...');

// 重要な重複候補を効率的に検出
function analyzeKeyDuplications() {
  const suspiciousPairs = [
    // 同名ファイル群
    ['public/js/PerformanceOptimizer.js', 'public/js/core/PerformanceOptimizer.js'],
    ['public/js/emergency-bypass.js', 'public/emergency-bypass.js'],
    ['public/js/app.js', 'public/assets/js/app.js'],
    ['public/js/AdvanceProcessor.js', 'public/js/iching/AdvanceProcessor.js'],
    ['public/js/KingWenMapping.js', 'public/js/iching/KingWenMapping.js'],
    ['public/js/LineSelector.js', 'public/js/iching/LineSelector.js'],
    ['public/js/MultiLineInterpreter.js', 'public/js/iching/MultiLineInterpreter.js'],
    
    // QuestionManager系
    ['public/js/QuestionManager.js', 'public/js/core/QuestionManager.js'],
    ['public/js/QuestionManager.js', 'public/js/ui/QuestionManager.js'],
    
    // StorageManager系
    ['public/js/shared/core/StorageManager.js', 'public/quick-analyzer/js/core/StorageManager.js'],
    
    // TripleOSInteractionAnalyzer系
    ['public/js/core/TripleOSInteractionAnalyzer.js', 'public/js/core/TripleOSInteractionAnalyzer_improved.js'],
    ['public/js/core/TripleOSInteractionAnalyzer.js', 'public/js/core/TripleOSInteractionAnalyzer.backup.20250111.js'],
  ];
  
  const results = {
    identical: [],
    similar: [],
    different: [],
    missing: []
  };
  
  console.log('📊 重要ファイルペアの分析中...\n');
  
  for (const [file1, file2] of suspiciousPairs) {
    try {
      // ファイル存在確認
      if (!fs.existsSync(file1)) {
        results.missing.push(`${file1} が存在しません`);
        continue;
      }
      if (!fs.existsSync(file2)) {
        results.missing.push(`${file2} が存在しません`);
        continue;
      }
      
      const content1 = fs.readFileSync(file1, 'utf-8');
      const content2 = fs.readFileSync(file2, 'utf-8');
      const size1 = content1.length;
      const size2 = content2.length;
      
      console.log(`🔍 ${path.basename(file1)} vs ${path.basename(file2)}`);
      console.log(`   📏 サイズ: ${(size1/1024).toFixed(1)}KB vs ${(size2/1024).toFixed(1)}KB`);
      
      if (content1 === content2) {
        results.identical.push({ file1, file2, size: size1 });
        console.log(`   🔴 完全一致 (${(size1/1024).toFixed(1)}KB)`);
      } else {
        // 簡易類似度チェック（先頭1000文字で比較）
        const sample1 = content1.substring(0, 1000);
        const sample2 = content2.substring(0, 1000);
        const similarity = calculateQuickSimilarity(sample1, sample2);
        
        if (similarity > 0.8) {
          results.similar.push({ file1, file2, similarity: Math.round(similarity * 100), size1, size2 });
          console.log(`   🟡 高い類似度 (${Math.round(similarity * 100)}%)`);
        } else {
          results.different.push({ file1, file2, similarity: Math.round(similarity * 100), size1, size2 });
          console.log(`   ✅ 異なるファイル (${Math.round(similarity * 100)}%)`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ 分析エラー: ${error.message}`);
    }
    
    console.log('');
  }
  
  return results;
}

// クイック類似度計算（軽量版）
function calculateQuickSimilarity(str1, str2) {
  const normalize = (str) => str.replace(/\s+/g, ' ').replace(/[{}();]/g, '').trim().toLowerCase();
  const norm1 = normalize(str1);
  const norm2 = normalize(str2);
  
  if (norm1 === norm2) return 1.0;
  if (norm1.length === 0 || norm2.length === 0) return 0.0;
  
  // 簡易的な重複単語カウント
  const words1 = new Set(norm1.split(' ').filter(w => w.length > 3));
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 3));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// 巨大ファイルの検出
function findLargeFiles() {
  console.log('📏 巨大ファイルの検出中...\n');
  
  const largeFiles = [];
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDirectory(fullPath);
          } else if ((item.endsWith('.js') || item.endsWith('.mjs')) && stat.size > 50000) {
            largeFiles.push({
              path: fullPath,
              size: stat.size,
              sizeKB: Math.round(stat.size / 1024)
            });
          }
        } catch (error) {
          // ファイルアクセスエラーはスキップ
        }
      }
    } catch (error) {
      // ディレクトリアクセスエラーはスキップ
    }
  }
  
  scanDirectory('./public');
  
  // サイズ順でソート
  largeFiles.sort((a, b) => b.size - a.size);
  
  console.log('🔥 大きすぎるファイル (50KB+):');
  largeFiles.slice(0, 10).forEach((file, index) => {
    console.log(`${index + 1}. ${file.path}: ${file.sizeKB}KB`);
  });
  
  return largeFiles;
}

// 未使用疑いファイルの検出
function findSuspiciousFiles() {
  console.log('\n🗑️ 未使用疑いファイルの検出中...\n');
  
  const suspiciousPatterns = [
    'backup', 'old', 'deprecated', 'unused', 'test', 'temp', 'debug',
    'copy', 'duplicate', '20250', '-v', '.v', '_v', 'bak'
  ];
  
  const suspiciousFiles = [];
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDirectory(fullPath);
          } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
            const basename = path.basename(item).toLowerCase();
            if (suspiciousPatterns.some(pattern => basename.includes(pattern))) {
              suspiciousFiles.push({
                path: fullPath,
                size: stat.size,
                sizeKB: Math.round(stat.size / 1024)
              });
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
  
  scanDirectory('./public');
  
  console.log('⚠️ 未使用の可能性があるファイル:');
  suspiciousFiles.forEach(file => {
    console.log(`  - ${file.path} (${file.sizeKB}KB)`);
  });
  
  return suspiciousFiles;
}

// メイン実行
function main() {
  console.log('🎯 軽量コード重複分析開始\n');
  
  const duplicateResults = analyzeKeyDuplications();
  const largeFiles = findLargeFiles();
  const suspiciousFiles = findSuspiciousFiles();
  
  console.log('\n📊 分析結果サマリー:');
  console.log(`完全同一ファイル: ${duplicateResults.identical.length}ペア`);
  console.log(`高い類似度ファイル: ${duplicateResults.similar.length}ペア`);
  console.log(`巨大ファイル (50KB+): ${largeFiles.length}個`);
  console.log(`未使用疑いファイル: ${suspiciousFiles.length}個`);
  
  // 重要な推奨事項
  console.log('\n💡 緊急リファクタリング推奨事項:');
  
  if (duplicateResults.identical.length > 0) {
    console.log('\n🔴 即座に統合すべき完全重複ファイル:');
    duplicateResults.identical.forEach(dup => {
      console.log(`   ✂️ ${dup.file1}`);
      console.log(`      ↕️ ${dup.file2}`);
      console.log(`      → どちらか一方を削除し、importパスを統一`);
    });
  }
  
  if (duplicateResults.similar.length > 0) {
    console.log('\n🟡 統合を検討すべき類似ファイル:');
    duplicateResults.similar.forEach(dup => {
      console.log(`   🔄 ${path.basename(dup.file1)} ⟷ ${path.basename(dup.file2)} (${dup.similarity}%)`);
    });
  }
  
  if (largeFiles.length > 0) {
    console.log('\n📂 分割を検討すべき巨大ファイル:');
    largeFiles.slice(0, 3).forEach(file => {
      console.log(`   📏 ${file.path} (${file.sizeKB}KB)`);
    });
  }
  
  // 結果をファイルに保存
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      identicalFiles: duplicateResults.identical.length,
      similarFiles: duplicateResults.similar.length,
      largeFiles: largeFiles.length,
      suspiciousFiles: suspiciousFiles.length
    },
    details: {
      identical: duplicateResults.identical,
      similar: duplicateResults.similar,
      largeFiles: largeFiles.slice(0, 10),
      suspicious: suspiciousFiles
    }
  };
  
  fs.writeFileSync('./lightweight-duplication-analysis.json', JSON.stringify(report, null, 2));
  console.log('\n📄 分析結果を lightweight-duplication-analysis.json に保存しました');
  
  return report;
}

// 実行
main();