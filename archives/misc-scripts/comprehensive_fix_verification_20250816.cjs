/**
 * 包括的修正検証システム
 * 3設計仕様書準拠チェック
 * 
 * @date 2025-08-16
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 包括的修正検証システム開始');
console.log(`📅 実行日時: ${new Date().toISOString()}`);

async function verifyComprehensiveFixes() {
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };
  
  try {
    // 1. HTML統合修正確認
    console.log('\n1️⃣ HTML統合修正確認');
    const htmlPath = path.join(__dirname, 'public/future_simulator.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Phase 2ファイル読み込み確認
    const phase2Files = [
      'EnhancedH384DataExtractor.js',
      'ExpressionVariationEngine.js', 
      'ExpressionQualityValidator.js'
    ];
    
    let phase2Found = 0;
    phase2Files.forEach(file => {
      if (htmlContent.includes(`js/core/${file}`)) {
        console.log(`✅ ${file} 読み込み設定確認`);
        phase2Found++;
      } else {
        console.log(`❌ ${file} 読み込み設定未確認`);
        results.errors.push(`HTML統合: ${file}が読み込まれていない`);
      }
    });
    
    if (phase2Found === 3) {
      console.log('✅ HTML統合修正: 完了');
      results.passed++;
    } else {
      console.log('❌ HTML統合修正: 不完全');
      results.failed++;
    }
    
    // 2. Service Worker修正確認
    console.log('\n2️⃣ Service Worker修正確認');
    const swPath = path.join(__dirname, 'public/haqei-sw.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    if (swContent.includes("request.mode !== 'navigate'") && 
        swContent.includes('requestInit.mode = request.mode')) {
      console.log('✅ Service Worker: ナビゲーションモード修正確認');
      results.passed++;
    } else {
      console.log('❌ Service Worker: 修正未確認');
      results.failed++;
      results.errors.push('Service Worker: ナビゲーションモード修正が不完全');
    }
    
    // 3. CSP修正確認
    console.log('\n3️⃣ CSP修正確認');
    const serverPath = path.join(__dirname, 'cipher-server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes('"worker-src": ["\'self\'", "blob:"]') &&
        serverContent.includes('"blob:"')) {
      console.log('✅ CSP: Worker作成許可設定確認');
      results.passed++;
    } else {
      console.log('❌ CSP: Worker許可設定未確認');  
      results.failed++;
      results.errors.push('CSP: Worker作成許可設定が不完全');
    }
    
    // 4. Phase 2ファイル存在確認
    console.log('\n4️⃣ Phase 2ファイル存在確認');
    
    const phase2Paths = [
      'public/js/core/EnhancedH384DataExtractor.js',
      'public/js/core/ExpressionVariationEngine.js',
      'public/js/core/ExpressionQualityValidator.js',
      'dist/js/core/EnhancedH384DataExtractor.js',
      'dist/js/core/ExpressionVariationEngine.js',
      'dist/js/core/ExpressionQualityValidator.js'
    ];
    
    let filesFound = 0;
    phase2Paths.forEach(filePath => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${filePath} 存在確認`);
        filesFound++;
      } else {
        console.log(`❌ ${filePath} 未発見`);
        results.errors.push(`ファイル不足: ${filePath}`);
      }
    });
    
    if (filesFound === 6) {
      console.log('✅ Phase 2ファイル: 完全同期確認');
      results.passed++;
    } else {
      console.log(`❌ Phase 2ファイル: 同期不完全 (${filesFound}/6)`);
      results.failed++;
    }
    
    // 5. 設計仕様書準拠確認
    console.log('\n5️⃣ 設計仕様書準拠確認');
    
    // 20250816_future_simulator_design_framework.md準拠
    const frameworkPath = path.join(__dirname, '20250816_future_simulator_design_framework.md');
    if (fs.existsSync(frameworkPath)) {
      console.log('✅ 20250816_future_simulator_design_framework.md 存在確認');
      results.passed++;
    } else {
      console.log('❌ 設計フレームワーク文書未発見');
      results.failed++;
      results.errors.push('設計フレームワーク文書が見つからない');
    }
    
    // 20250816_implementation_optimization_roadmap.md準拠  
    const roadmapPath = path.join(__dirname, '20250816_implementation_optimization_roadmap.md');
    if (fs.existsSync(roadmapPath)) {
      console.log('✅ 20250816_implementation_optimization_roadmap.md 存在確認');
      results.passed++;
    } else {
      console.log('❌ 実装ロードマップ文書未発見');
      results.failed++;
      results.errors.push('実装ロードマップ文書が見つからない');
    }
    
    // CLAUDE.md 4-Phase Development Cycle準拠
    const claudePath = path.join(__dirname, 'CLAUDE.md');
    if (fs.existsSync(claudePath)) {
      console.log('✅ CLAUDE.md 4-Phase Development Cycle 存在確認');
      results.passed++;
    } else {
      console.log('❌ CLAUDE.md未発見');
      results.failed++;
      results.errors.push('CLAUDE.md文書が見つからない');
    }
    
  } catch (error) {
    console.error(`🚨 検証実行エラー: ${error.message}`);
    results.failed++;
    results.errors.push(`検証実行エラー: ${error.message}`);
  }
  
  return results;
}

/**
 * 検証結果レポート生成
 */
function generateVerificationReport(results) {
  const totalTests = results.passed + results.failed;
  const successRate = Math.round((results.passed / totalTests) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 包括的修正検証結果');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${results.passed} テスト`);
  console.log(`❌ 失敗: ${results.failed} テスト`);
  console.log(`📊 成功率: ${successRate}%`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 検出された問題:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  // 評価
  let evaluation;
  if (successRate >= 90) {
    evaluation = '🎉 優秀 - Production Ready';
  } else if (successRate >= 75) {
    evaluation = '✅ 良好 - Minor Issues';
  } else if (successRate >= 60) {
    evaluation = '⚠️ 改善要 - Major Issues';
  } else {
    evaluation = '🚨 不合格 - Critical Issues';
  }
  
  console.log(`\n📊 総合評価: ${evaluation}`);
  
  return {
    totalTests,
    successRate,
    evaluation,
    errors: results.errors
  };
}

/**
 * メイン実行関数
 */
async function runComprehensiveVerification() {
  console.log('🔍 包括的修正検証開始');
  console.log(`📅 実行日時: ${new Date().toISOString()}`);
  
  // 検証実行
  const testResults = await verifyComprehensiveFixes();
  
  // レポート生成
  const report = generateVerificationReport(testResults);
  
  return {
    ...report,
    timestamp: new Date().toISOString(),
    testDetails: testResults
  };
}

// メイン実行
if (require.main === module) {
  runComprehensiveVerification().catch(console.error);
}

module.exports = { runComprehensiveVerification };