import { chromium } from 'playwright';

(async () => {
  console.log('=== 384爻システム 意味的分類精度テスト ===\n');
  console.log('目的: テキストの文脈を理解して適切な爻に分類できているか検証\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8089/test-384-browser.html', {
      waitUntil: 'networkidle'
    });
    
    // テストケースを定義（文脈と期待される爻の特徴）
    const testCases = [
      {
        category: '始まり・初期段階',
        texts: [
          '新しいプロジェクトを開始したい',
          'これから事業を立ち上げる',
          '何かを始めようと思っている',
          '初めての挑戦に臨む',
          'スタートラインに立っている'
        ],
        expectedPosition: 1, // 初爻
        expectedCharacteristics: '潜龍（まだ地中にある龍）- 準備段階'
      },
      {
        category: '成長・発展段階',
        texts: [
          '順調に成長している',
          '着実に進歩している',
          '基礎が固まってきた',
          '軌道に乗り始めた',
          '成果が出始めている'
        ],
        expectedPosition: 2, // 二爻
        expectedCharacteristics: '見龍（姿を現した龍）- 成長段階'
      },
      {
        category: '困難・試練',
        texts: [
          '大きな困難に直面している',
          '試練の時を迎えている',
          '壁にぶつかっている',
          '苦しい状況が続いている',
          '問題が山積みになっている'
        ],
        expectedPosition: 3, // 三爻
        expectedCharacteristics: '君子終日乾乾（終日努力）- 困難段階'
      },
      {
        category: '転換・変化',
        texts: [
          '大きな転換期を迎えている',
          '人生の岐路に立っている',
          '重要な選択を迫られている',
          '変化の時が来た',
          '新しい方向に進むべきか悩む'
        ],
        expectedPosition: 4, // 四爻
        expectedCharacteristics: '或躍在淵（淵に躍る）- 転換段階'
      },
      {
        category: 'リーダーシップ・責任',
        texts: [
          'リーダーとして決断する必要がある',
          '重要な責任を担っている',
          '組織を統率する立場にある',
          '大きな権限を持って判断する',
          '経営者として方向性を示す'
        ],
        expectedPosition: 5, // 五爻
        expectedCharacteristics: '飛龍在天（天を飛ぶ龍）- 最盛期'
      },
      {
        category: '完成・終結',
        texts: [
          'プロジェクトが完了に近づいている',
          '長い道のりが終わろうとしている',
          '集大成の時期を迎えている',
          '引退を考え始めている',
          '次の世代に引き継ぐ時が来た'
        ],
        expectedPosition: 6, // 上爻
        expectedCharacteristics: '亢龍有悔（高ぶった龍）- 極限段階'
      }
    ];
    
    const results = await page.evaluate(async (cases) => {
      const bridge = new TextTo384LinesBridge();
      await bridge.initialize();
      
      const categoryResults = [];
      
      for (const testCase of cases) {
        const results = [];
        
        for (const text of testCase.texts) {
          const result = await bridge.analyzeTextToSpecificLine(text);
          if (result && result.line_384_id) {
            const lineId = result.line_384_id;
            const hexagramNum = Math.floor((lineId - 1) / 6) + 1;
            const position = ((lineId - 1) % 6) + 1;
            
            results.push({
              text,
              lineId,
              hexagramNum,
              position,
              hexagramName: result.hexagram_name || '',
              lineMeaning: result.line_meaning || ''
            });
          }
        }
        
        // 統計を計算
        const positions = results.map(r => r.position);
        const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
        const matchCount = positions.filter(p => p === testCase.expectedPosition).length;
        const nearMatchCount = positions.filter(p => Math.abs(p - testCase.expectedPosition) <= 1).length;
        
        categoryResults.push({
          category: testCase.category,
          expectedPosition: testCase.expectedPosition,
          expectedCharacteristics: testCase.expectedCharacteristics,
          results,
          avgPosition: avgPosition.toFixed(2),
          exactMatchRate: (matchCount / testCase.texts.length * 100).toFixed(1),
          nearMatchRate: (nearMatchCount / testCase.texts.length * 100).toFixed(1)
        });
      }
      
      return categoryResults;
    }, testCases);
    
    // 結果を表示
    console.log('📊 カテゴリー別分類精度\n');
    console.log('=' .repeat(80));
    
    let totalExactMatch = 0;
    let totalNearMatch = 0;
    let totalTexts = 0;
    
    for (const category of results) {
      console.log(`\n【${category.category}】`);
      console.log(`期待される爻位置: ${category.expectedPosition}爻 - ${category.expectedCharacteristics}`);
      console.log(`平均爻位置: ${category.avgPosition}爻`);
      console.log(`完全一致率: ${category.exactMatchRate}%`);
      console.log(`近似一致率（±1）: ${category.nearMatchRate}%`);
      console.log('\n個別結果:');
      
      for (const result of category.results) {
        const match = result.position === category.expectedPosition ? '✅' : 
                     Math.abs(result.position - category.expectedPosition) <= 1 ? '🔶' : '❌';
        console.log(`  ${match} "${result.text.substring(0, 30)}..."`);
        console.log(`     → ${result.hexagramNum}番卦の${result.position}爻 (Line ${result.lineId})`);
      }
      
      totalExactMatch += parseFloat(category.exactMatchRate) * category.results.length / 100;
      totalNearMatch += parseFloat(category.nearMatchRate) * category.results.length / 100;
      totalTexts += category.results.length;
    }
    
    // 総合評価
    console.log('\n' + '=' .repeat(80));
    console.log('\n🎯 総合評価\n');
    
    const overallExactMatch = (totalExactMatch / totalTexts * 100).toFixed(1);
    const overallNearMatch = (totalNearMatch / totalTexts * 100).toFixed(1);
    
    console.log(`完全一致率（期待通りの爻）: ${overallExactMatch}%`);
    console.log(`近似一致率（±1の範囲）: ${overallNearMatch}%`);
    
    // 文脈理解の評価
    console.log('\n📝 文脈理解の評価:');
    
    if (parseFloat(overallExactMatch) >= 60) {
      console.log('✅ 優秀: テキストの文脈を正確に理解し、適切な爻に分類できています');
    } else if (parseFloat(overallExactMatch) >= 40) {
      console.log('🔶 良好: 基本的な文脈理解はできていますが、精度向上の余地があります');
    } else if (parseFloat(overallNearMatch) >= 60) {
      console.log('⚠️ 改善必要: 大まかな方向性は合っていますが、精度が不十分です');
    } else {
      console.log('❌ 要改修: 文脈理解が不十分で、ランダムに近い分類になっています');
    }
    
    // 一貫性チェック
    console.log('\n📝 同一カテゴリ内の一貫性:');
    for (const category of results) {
      const positions = category.results.map(r => r.position);
      const uniquePositions = new Set(positions).size;
      const consistency = (1 - (uniquePositions - 1) / 5) * 100; // 1なら100%、6なら0%
      
      console.log(`  ${category.category}: ${consistency.toFixed(0)}% (${uniquePositions}種類の爻位置)`);
    }
    
  } catch (error) {
    console.error('エラー:', error.message);
  } finally {
    await browser.close();
  }
})();