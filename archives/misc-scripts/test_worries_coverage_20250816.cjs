/**
 * 様々な悩みタイプに対する分析精度テスト
 */

const { chromium } = require('playwright');

async function testWorriesCoverage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // 多様な悩みのテストケース
  const testCases = [
    // 仕事系
    { category: '仕事', input: '上司との関係がうまくいかない', expectedContext: '人間関係' },
    { category: '仕事', input: '給料が低くて生活が苦しい', expectedContext: '金銭' },
    { category: '仕事', input: '仕事にやりがいを感じられない', expectedContext: '意味・価値' },
    
    // 恋愛系
    { category: '恋愛', input: '彼氏が浮気しているかもしれない', expectedContext: '不安・疑い' },
    { category: '恋愛', input: '好きな人に告白する勇気が出ない', expectedContext: '決断・行動' },
    { category: '恋愛', input: '結婚するべきか迷っている', expectedContext: '人生の岐路' },
    
    // 家族系
    { category: '家族', input: '親の介護で疲れ果てている', expectedContext: '負担・疲労' },
    { category: '家族', input: '子供が不登校になってしまった', expectedContext: '教育・心配' },
    
    // 健康系
    { category: '健康', input: '最近体調が悪くて病気が心配', expectedContext: '不安・健康' },
    { category: '健康', input: 'ストレスで眠れない日が続いている', expectedContext: 'メンタル' },
    
    // 人生系
    { category: '人生', input: '将来が不安で何をすればいいかわからない', expectedContext: '方向性' },
    { category: '人生', input: '自分に自信が持てない', expectedContext: '自己肯定' }
  ];
  
  console.log('🔍 悩み分析システムの網羅性テスト開始\n');
  console.log(`テストケース数: ${testCases.length}種類\n`);
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n━━━ ${testCase.category}: ${testCase.input} ━━━`);
    
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // analyzeWorryを直接実行
    const result = await page.evaluate(async (text) => {
      if (typeof analyzeWorry === 'function') {
        await analyzeWorry(text);
        
        const integrated = window.integratedAnalysisResult;
        return {
          // 形態素解析結果
          morphology: integrated?.morphology?.slice(0, 5).map(m => m.surface_form),
          
          // キーワード分析
          keywords: {
            layer1: integrated?.keywords?.layer1?.slice(0, 3),
            final: integrated?.keywords?.final?.slice(0, 3).map(k => k.word)
          },
          
          // コンテキスト分析
          context: {
            emotion: integrated?.context?.emotionalContext,
            situation: integrated?.context?.situationalContext,
            intent: integrated?.context?.intent,
            timeFrame: integrated?.context?.timeFrame
          },
          
          // 易経結果
          iching: {
            hexagram: integrated?.iching?.hexagram?.name,
            number: integrated?.iching?.hexagram?.number,
            yao: integrated?.iching?.yao?.name,
            keywords: integrated?.iching?.keywords,
            interpretation: integrated?.iching?.interpretation?.substring(0, 100)
          }
        };
      }
      return null;
    }, testCase.input);
    
    results.push({ ...testCase, result });
    
    // 結果表示
    if (result) {
      console.log(`📝 形態素: ${result.morphology?.join(', ')}`);
      console.log(`🔑 キーワード: ${result.keywords?.final?.join(', ')}`);
      console.log(`😊 感情: ${result.context?.emotion || '未検出'}`);
      console.log(`📍 状況: ${result.context?.situation || '未検出'}`);
      console.log(`🎯 意図: ${result.context?.intent || '未検出'}`);
      console.log(`⏰ 時間軸: ${result.context?.timeFrame || '未検出'}`);
      console.log(`☯️ 易経: ${result.iching?.hexagram}（${result.iching?.number}番）${result.iching?.yao}`);
      console.log(`💡 解釈: ${result.iching?.interpretation || '未取得'}...`);
    } else {
      console.log('❌ 分析失敗');
    }
  }
  
  // 分析結果の集計
  console.log('\n\n📊 ===== 分析結果サマリー =====\n');
  
  // カテゴリ別の卦の分布
  const categoryHexagrams = {};
  results.forEach(r => {
    if (!categoryHexagrams[r.category]) {
      categoryHexagrams[r.category] = [];
    }
    if (r.result?.iching?.hexagram) {
      categoryHexagrams[r.category].push(r.result.iching.hexagram);
    }
  });
  
  Object.entries(categoryHexagrams).forEach(([cat, hexs]) => {
    console.log(`${cat}系の卦: ${hexs.join(', ')}`);
  });
  
  // 問題点の検出
  console.log('\n⚠️ ===== 潜在的な問題 =====\n');
  
  // 同じ卦が複数回出現しているか
  const allHexagrams = results.map(r => r.result?.iching?.hexagram).filter(Boolean);
  const hexagramCounts = {};
  allHexagrams.forEach(h => {
    hexagramCounts[h] = (hexagramCounts[h] || 0) + 1;
  });
  
  const duplicates = Object.entries(hexagramCounts).filter(([h, c]) => c > 1);
  if (duplicates.length > 0) {
    console.log('🔴 同じ卦が複数回出現:');
    duplicates.forEach(([h, c]) => {
      console.log(`  ${h}: ${c}回`);
    });
  }
  
  // 感情分析が機能しているか
  const emotionDetected = results.filter(r => r.result?.context?.emotion).length;
  console.log(`\n感情分析成功率: ${emotionDetected}/${results.length} (${Math.round(emotionDetected/results.length*100)}%)`);
  
  // 状況分析が機能しているか
  const situationDetected = results.filter(r => r.result?.context?.situation).length;
  console.log(`状況分析成功率: ${situationDetected}/${results.length} (${Math.round(situationDetected/results.length*100)}%)`);
  
  // 意図分析が機能しているか
  const intentDetected = results.filter(r => r.result?.context?.intent).length;
  console.log(`意図分析成功率: ${intentDetected}/${results.length} (${Math.round(intentDetected/results.length*100)}%)`);
  
  await browser.close();
}

testWorriesCoverage().catch(console.error);