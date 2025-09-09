import { chromium } from 'playwright';

(async () => {
  console.log('=== パターン検出テスト ===\n');
  console.log('同じテキストの繰り返し入力と異なるテキストの入力パターンを検証\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8089/test-384-browser.html', {
      waitUntil: 'networkidle'
    });
    
    const results = await page.evaluate(async () => {
      const bridge = new TextTo384LinesBridge();
      await bridge.initialize();
      
      // Test 1: 同じテキストを複数回入力
      const sameTextResults = [];
      const testText = '新しいビジネスを始めたい';
      for (let i = 0; i < 10; i++) {
        const result = await bridge.analyzeTextToSpecificLine(testText);
        sameTextResults.push({
          iteration: i + 1,
          lineId: result?.line_384_id,
          position: ((result?.line_384_id - 1) % 6) + 1
        });
      }
      
      // Test 2: 異なるテキストを順番に入力
      const differentTexts = [
        'ビジネスを始める',
        '事業を開始する',
        '新規プロジェクト',
        '起業したい',
        'スタートアップ',
        '会社を作る',
        '独立する',
        '開業する',
        'ベンチャー',
        '創業する'
      ];
      
      const differentTextResults = [];
      for (const text of differentTexts) {
        const result = await bridge.analyzeTextToSpecificLine(text);
        differentTextResults.push({
          text,
          lineId: result?.line_384_id,
          position: ((result?.line_384_id - 1) % 6) + 1
        });
      }
      
      // Test 3: 特定のキーワードを含むテキストのパターン
      const keywordTests = {
        '始': ['始める', '始まり', '開始', '始動', '始めたい'],
        '終': ['終わる', '終了', '完了', '終結', '終える'],
        'リーダー': ['リーダー', 'リーダーシップ', 'リーダーとして', '指導者', '統率']
      };
      
      const keywordResults = {};
      for (const [keyword, texts] of Object.entries(keywordTests)) {
        keywordResults[keyword] = [];
        for (const text of texts) {
          const result = await bridge.analyzeTextToSpecificLine(text);
          keywordResults[keyword].push({
            text,
            lineId: result?.line_384_id,
            position: ((result?.line_384_id - 1) % 6) + 1
          });
        }
      }
      
      return { sameTextResults, differentTextResults, keywordResults };
    });
    
    // 結果分析
    console.log('📊 Test 1: 同じテキストの一貫性\n');
    console.log('入力: "新しいビジネスを始めたい" × 10回');
    const uniqueLines = new Set(results.sameTextResults.map(r => r.lineId));
    console.log(`結果: ${uniqueLines.size === 1 ? '✅ 一貫性あり' : '❌ 一貫性なし'}`);
    results.sameTextResults.forEach(r => {
      console.log(`  ${r.iteration}回目: Line ${r.lineId} (${r.position}爻)`);
    });
    
    console.log('\n📊 Test 2: 類似テキストのパターン\n');
    console.log('テーマ: ビジネス開始に関する10個のテキスト');
    
    // 連続性チェック
    const lineIds = results.differentTextResults.map(r => r.lineId);
    let isSequential = true;
    for (let i = 1; i < lineIds.length; i++) {
      if (lineIds[i] !== lineIds[i-1] + 1) {
        isSequential = false;
        break;
      }
    }
    
    if (isSequential) {
      console.log('⚠️ 警告: Line IDが連続している（1, 2, 3, 4...）');
      console.log('これは意味的な分類ではなく、順番割り当ての可能性があります\n');
    }
    
    results.differentTextResults.forEach(r => {
      console.log(`  "${r.text}": Line ${r.lineId} (${r.position}爻)`);
    });
    
    // 分布分析
    const positionDist = new Array(6).fill(0);
    results.differentTextResults.forEach(r => {
      positionDist[r.position - 1]++;
    });
    
    console.log('\n爻位置分布:');
    positionDist.forEach((count, i) => {
      console.log(`  ${i + 1}爻: ${count}回`);
    });
    
    console.log('\n📊 Test 3: キーワード別パターン\n');
    
    for (const [keyword, keywordResults] of Object.entries(results.keywordResults)) {
      console.log(`キーワード「${keyword}」を含むテキスト:`);
      const positions = keywordResults.map(r => r.position);
      const avgPosition = (positions.reduce((a, b) => a + b, 0) / positions.length).toFixed(1);
      console.log(`  平均爻位置: ${avgPosition}爻`);
      
      keywordResults.forEach(r => {
        console.log(`    "${r.text}": Line ${r.lineId} (${r.position}爻)`);
      });
      console.log('');
    }
    
    // 最終診断
    console.log('=' .repeat(60));
    console.log('\n🔍 診断結果:\n');
    
    const consistencyOK = uniqueLines.size === 1;
    const notSequential = !isSequential;
    const keywordPattern = Math.abs(parseFloat(results.keywordResults['始'][0].position) - 
                                   parseFloat(results.keywordResults['終'][0].position)) >= 2;
    
    if (consistencyOK && notSequential && keywordPattern) {
      console.log('✅ 正常: テキストの意味を理解して分類している');
    } else {
      console.log('❌ 問題あり:');
      if (!consistencyOK) console.log('  - 同じテキストで異なる結果');
      if (isSequential) console.log('  - 単純な順番割り当ての可能性');
      if (!keywordPattern) console.log('  - キーワードによる意味的な差別化ができていない');
    }
    
  } catch (error) {
    console.error('エラー:', error.message);
  } finally {
    await browser.close();
  }
})();