import { chromium } from 'playwright';

(async () => {
  console.log('=== 384爻システム現状確認テスト ===\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // HTMLページを作成
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <script src="/public/js/lib/localforage.min.js"></script>
    <script src="/public/js/ai/TextTo384LinesBridge.js"></script>
    <script src="/public/assets/H384H64database.js"></script>
</head>
<body>
    <div id="output"></div>
</body>
</html>`;
    
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    const results = await page.evaluate(async () => {
      const bridge = new TextTo384LinesBridge();
      await bridge.initialize();
      
      const testSamples = [];
      const themes = ['事業', '恋愛', '健康', '学習', '変化', '決断', '成長', '財運'];
      const modifiers = ['新しい', '困難な', '順調な', '停滞した'];
      
      // 32サンプル生成
      themes.forEach(theme => {
        modifiers.forEach(modifier => {
          testSamples.push(`${modifier}${theme}について`);
        });
      });
      
      // 5爻関連のキーワードを含むテストを追加
      testSamples.push('リーダーとしての責任');
      testSamples.push('重要な決定を下す');
      testSamples.push('統率力を発揮する');
      testSamples.push('経営判断について');
      testSamples.push('マネージャーとして');
      
      const lineDistribution = new Map();
      const positionCount = new Array(6).fill(0);
      
      for (const text of testSamples) {
        const result = await bridge.analyzeTextToSpecificLine(text);
        if (result && result.line_384_id) {
          const lineId = result.line_384_id;
          lineDistribution.set(lineId, (lineDistribution.get(lineId) || 0) + 1);
          const position = ((lineId - 1) % 6);
          positionCount[position]++;
        }
      }
      
      return {
        totalSamples: testSamples.length,
        uniqueLines: lineDistribution.size,
        positionDistribution: positionCount,
        topLines: Array.from(lineDistribution.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
      };
    });
    
    console.log('📊 テスト結果:');
    console.log(`サンプル数: ${results.totalSamples}`);
    console.log(`ユニーク爻数: ${results.uniqueLines} (カバー率: ${(results.uniqueLines / 384 * 100).toFixed(1)}%)`);
    
    console.log('\n爻位置分布:');
    results.positionDistribution.forEach((count, i) => {
      const percent = (count / results.totalSamples * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(count / 2));
      console.log(`  ${i+1}爻: ${count} (${percent}%) ${bar}`);
    });
    
    // 5爻の確認
    const fiveYaoCount = results.positionDistribution[4];
    if (fiveYaoCount === 0) {
      console.log('\n❌ 問題: 5爻が一度も選ばれていません！');
    } else {
      console.log(`\n✅ 5爻が${fiveYaoCount}回 (${(fiveYaoCount/results.totalSamples*100).toFixed(1)}%) 選ばれました`);
    }
    
    console.log('\n最頻出の爻:');
    results.topLines.forEach(([lineId, count]) => {
      console.log(`  Line ${lineId}: ${count}回`);
    });
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await browser.close();
  }
})();