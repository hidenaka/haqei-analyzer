import { chromium } from 'playwright';

(async () => {
  console.log('=== 384爻システム包括的テスト (300サンプル) ===\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8089/test-384-browser.html', {
      waitUntil: 'networkidle'
    });
    
    // Run comprehensive test with 300 samples
    const results = await page.evaluate(async () => {
      const bridge = new TextTo384LinesBridge();
      await bridge.initialize();
      
      // Generate 300 diverse samples
      const samples = [];
      const templates = [
        'これからどうすればいいですか',
        '新しいことを始めたい',
        '人間関係で悩んでいます',
        '仕事で成功したい',
        '決断に迷っています',
        'リーダーとして頑張りたい',
        '今の状況を変えたい',
        '問題を解決したい',
        '将来が不安です',
        '選択肢で悩んでいる',
        '変化の時期にいる',
        '成長したいと思う',
        '新しい挑戦をしたい',
        '困難を乗り越えたい',
        '目標を達成したい'
      ];
      
      // Create 300 samples with variations
      for (let i = 0; i < 300; i++) {
        const template = templates[i % templates.length];
        const variation = i < templates.length ? template : `${template} (${Math.floor(i / templates.length) + 1})`;
        samples.push(variation);
      }
      
      const lineDistribution = new Map();
      const positionCount = new Array(6).fill(0);
      const startTime = Date.now();
      
      for (const sample of samples) {
        const result = await bridge.analyzeTextToSpecificLine(sample);
        if (result && result.line_384_id) {
          const lineId = result.line_384_id;
          lineDistribution.set(lineId, (lineDistribution.get(lineId) || 0) + 1);
          const position = ((lineId - 1) % 6);
          positionCount[position]++;
        }
      }
      
      const endTime = Date.now();
      
      // Calculate statistics
      const frequencies = Array.from(lineDistribution.values());
      const maxFreq = Math.max(...frequencies);
      const minFreq = Math.min(...frequencies);
      const avgFreq = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
      
      return {
        totalSamples: samples.length,
        uniqueLines: lineDistribution.size,
        coverage: (lineDistribution.size / 384 * 100).toFixed(1),
        positionDistribution: positionCount,
        maxFrequency: maxFreq,
        minFrequency: minFreq,
        avgFrequency: avgFreq.toFixed(2),
        processingTime: endTime - startTime,
        topLines: Array.from(lineDistribution.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([id, count]) => ({ id, count, percent: (count/300*100).toFixed(1) }))
      };
    });
    
    // Display results
    console.log('📊 テスト結果サマリー');
    console.log('─'.repeat(50));
    console.log(`総サンプル数: ${results.totalSamples}`);
    console.log(`処理時間: ${results.processingTime}ms (${(results.processingTime/results.totalSamples).toFixed(1)}ms/サンプル)`);
    console.log(`ユニーク爻数: ${results.uniqueLines}/384`);
    console.log(`カバー率: ${results.coverage}%`);
    console.log(`最大頻度: ${results.maxFrequency}回`);
    console.log(`最小頻度: ${results.minFrequency}回`);
    console.log(`平均頻度: ${results.avgFrequency}回`);
    
    console.log('\n📊 爻位置分布');
    console.log('─'.repeat(50));
    results.positionDistribution.forEach((count, i) => {
      const percent = (count / results.totalSamples * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 5));
      const status = percent === '0.0' ? '❌' : percent < '10' ? '⚠️' : '✅';
      console.log(`${i+1}爻: ${count.toString().padStart(3)} (${percent.padStart(5)}%) ${status} ${bar}`);
    });
    
    console.log('\n📊 最頻出Top10');
    console.log('─'.repeat(50));
    results.topLines.forEach(({ id, count, percent }) => {
      console.log(`Line ${id.toString().padStart(3)}: ${count}回 (${percent}%)`);
    });
    
    // Evaluation
    console.log('\n🎯 評価');
    console.log('─'.repeat(50));
    
    const coverageTarget = 13;
    const coverageActual = parseFloat(results.coverage);
    const fiveYaoPercent = (results.positionDistribution[4] / results.totalSamples * 100).toFixed(1);
    
    const checks = [
      {
        name: 'カバー率',
        target: `${coverageTarget}%以上`,
        actual: `${results.coverage}%`,
        passed: coverageActual >= coverageTarget
      },
      {
        name: '5爻選択率',
        target: '3%以上',
        actual: `${fiveYaoPercent}%`,
        passed: parseFloat(fiveYaoPercent) >= 3
      },
      {
        name: '最大頻度',
        target: '10回以下',
        actual: `${results.maxFrequency}回`,
        passed: results.maxFrequency <= 10
      },
      {
        name: '全位置使用',
        target: '全位置5%以上',
        actual: results.positionDistribution.every(c => c/results.totalSamples >= 0.05) ? '達成' : '未達成',
        passed: results.positionDistribution.every(c => c/results.totalSamples >= 0.05)
      }
    ];
    
    checks.forEach(check => {
      const status = check.passed ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.actual} (目標: ${check.target})`);
    });
    
    const allPassed = checks.every(c => c.passed);
    console.log('\n' + '='.repeat(50));
    console.log(allPassed ? '🎉 全目標達成！システムは正常に動作しています。' : '⚠️ 一部の目標が未達成です。');
    
  } catch (error) {
    console.error('エラー:', error.message);
  } finally {
    await browser.close();
  }
})();