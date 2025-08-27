import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== 384爻システム品質テスト ===\n');
  console.log('このテストは実際のシステムの品質を検証します。');
  console.log('誤った前提の「期待値との比較」ではなく、以下を検証:\n');
  console.log('1. 一貫性: 同じテキストは同じ爻を返すか');
  console.log('2. 分布: 多様なテキストが適切に分布するか');
  console.log('3. 意味的妥当性: 選ばれた爻がテキストと意味的に一致するか\n');
  
  try {
    await page.goto('http://localhost:8080/test/384-accuracy/test-384-accuracy-final.html', {
      waitUntil: 'domcontentloaded'
    });
    
    await page.waitForTimeout(2000);
    
    const testResults = await page.evaluate(async () => {
      // TextTo384LinesBridgeを初期化
      const bridge = new TextTo384LinesBridge();
      await bridge.initialize();
      
      // Test 1: 一貫性テスト
      console.log('Test 1: 一貫性テスト実行中...');
      const consistencyTest = {
        passed: true,
        details: []
      };
      
      const testTexts = [
        '新しいビジネスを始めたい',
        '人間関係で悩んでいる',
        'キャリアの転換期にいる'
      ];
      
      for (const text of testTexts) {
        const results = [];
        // 同じテキストを3回分析
        for (let i = 0; i < 3; i++) {
          const result = await bridge.analyzeTextToSpecificLine(text);
          results.push(result?.line_384_id || 0);
        }
        
        const allSame = results.every(r => r === results[0]);
        consistencyTest.details.push({
          text: text.substring(0, 20) + '...',
          results: results,
          consistent: allSame
        });
        
        if (!allSame) {
          consistencyTest.passed = false;
        }
      }
      
      // Test 2: 分布テスト
      console.log('Test 2: 分布テスト実行中...');
      const distributionTest = {
        passed: true,
        details: {}
      };
      
      // 100個の多様なテキストを生成
      const diverseTexts = [];
      const themes = ['事業', '恋愛', '健康', '学習', '変化', '決断', '成長', '財運'];
      const modifiers = ['新しい', '困難な', '順調な', '停滞した', '急速な', '慎重な'];
      
      themes.forEach(theme => {
        modifiers.forEach(modifier => {
          diverseTexts.push(`${modifier}${theme}について考えている`);
        });
      });
      
      // 追加のランダムテキスト
      while (diverseTexts.length < 100) {
        diverseTexts.push(`状況${diverseTexts.length}についての相談`);
      }
      
      const lineDistribution = new Map();
      const positionDistribution = new Array(6).fill(0);
      
      for (const text of diverseTexts.slice(0, 100)) {
        const result = await bridge.analyzeTextToSpecificLine(text);
        if (result && result.line_384_id) {
          const lineId = result.line_384_id;
          lineDistribution.set(lineId, (lineDistribution.get(lineId) || 0) + 1);
          const position = ((lineId - 1) % 6);
          positionDistribution[position]++;
        }
      }
      
      // 分布の分析
      const uniqueLines = lineDistribution.size;
      const maxFrequency = Math.max(...lineDistribution.values());
      const avgFrequency = 100 / uniqueLines;
      
      distributionTest.details = {
        totalSamples: 100,
        uniqueLines: uniqueLines,
        coverage: (uniqueLines / 384 * 100).toFixed(1) + '%',
        maxFrequency: maxFrequency,
        avgFrequency: avgFrequency.toFixed(2),
        positionDistribution: positionDistribution
      };
      
      // 判定基準
      if (uniqueLines < 20) {
        distributionTest.passed = false;
        distributionTest.reason = '選択される爻が少なすぎる（20未満）';
      } else if (maxFrequency > 10) {
        distributionTest.passed = false;
        distributionTest.reason = '特定の爻に偏りすぎている（10回以上）';
      }
      
      // Test 3: 意味的妥当性テスト（サンプル）
      console.log('Test 3: 意味的妥当性テスト実行中...');
      const semanticTest = {
        passed: true,
        details: []
      };
      
      const semanticTestCases = [
        { text: '始まりの段階にいる', expectedPosition: [1, 2] }, // 初爻または二爻
        { text: '困難に直面している', expectedPosition: [3, 4] }, // 三爻または四爻
        { text: 'リーダーシップを発揮する', expectedPosition: [5] }, // 五爻
        { text: '完成に向かっている', expectedPosition: [6] }  // 上爻
      ];
      
      for (const testCase of semanticTestCases) {
        const result = await bridge.analyzeTextToSpecificLine(testCase.text);
        if (result && result.line_384_id) {
          const position = ((result.line_384_id - 1) % 6) + 1;
          const isExpected = testCase.expectedPosition.includes(position);
          
          semanticTest.details.push({
            text: testCase.text,
            lineId: result.line_384_id,
            position: position,
            expected: testCase.expectedPosition,
            matched: isExpected
          });
          
          if (!isExpected) {
            semanticTest.passed = false;
          }
        }
      }
      
      return {
        consistency: consistencyTest,
        distribution: distributionTest,
        semantic: semanticTest
      };
    });
    
    // 結果表示
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // 1. 一貫性テスト結果
    console.log('📊 Test 1: 一貫性テスト');
    console.log('─────────────────────────');
    testResults.consistency.details.forEach(detail => {
      const status = detail.consistent ? '✅' : '❌';
      console.log(`${status} "${detail.text}"`);
      console.log(`   結果: [${detail.results.join(', ')}]`);
    });
    console.log(`\n判定: ${testResults.consistency.passed ? '✅ 合格' : '❌ 不合格'}`);
    
    // 2. 分布テスト結果
    console.log('\n📊 Test 2: 分布テスト');
    console.log('─────────────────────────');
    const dist = testResults.distribution.details;
    console.log(`   サンプル数: ${dist.totalSamples}`);
    console.log(`   ユニーク爻数: ${dist.uniqueLines} (カバー率: ${dist.coverage})`);
    console.log(`   最大頻度: ${dist.maxFrequency}回`);
    console.log(`   平均頻度: ${dist.avgFrequency}回`);
    console.log('\n   爻位置分布:');
    dist.positionDistribution.forEach((count, i) => {
      const percentage = (count / dist.totalSamples * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 2));
      console.log(`     ${i+1}爻: ${count} (${percentage}%) ${bar}`);
    });
    
    if (testResults.distribution.reason) {
      console.log(`\n   問題: ${testResults.distribution.reason}`);
    }
    console.log(`\n判定: ${testResults.distribution.passed ? '✅ 合格' : '❌ 不合格'}`);
    
    // 3. 意味的妥当性テスト結果
    console.log('\n📊 Test 3: 意味的妥当性テスト');
    console.log('─────────────────────────');
    testResults.semantic.details.forEach(detail => {
      const status = detail.matched ? '✅' : '❌';
      console.log(`${status} "${detail.text}"`);
      console.log(`   Line ${detail.lineId} (${detail.position}爻) - 期待: ${detail.expected.join('または')}爻`);
    });
    console.log(`\n判定: ${testResults.semantic.passed ? '✅ 合格' : '❌ 不合格'}`);
    
    // 総合評価
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 総合評価');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const allPassed = testResults.consistency.passed && 
                     testResults.distribution.passed && 
                     testResults.semantic.passed;
    
    if (allPassed) {
      console.log('✅ すべてのテストに合格しました！');
      console.log('384爻システムは正常に動作しています。');
    } else {
      console.log('⚠️ 一部のテストが不合格でした。');
      console.log('\n改善が必要な点:');
      if (!testResults.consistency.passed) {
        console.log('  - 一貫性: 同じ入力に対して異なる結果を返している');
      }
      if (!testResults.distribution.passed) {
        console.log('  - 分布: 特定の爻に偏りすぎている');
      }
      if (!testResults.semantic.passed) {
        console.log('  - 意味的妥当性: 爻の意味とテキストが一致していない');
      }
    }
    
  } catch (error) {
    console.error('テストエラー:', error);
  } finally {
    await browser.close();
  }
})();