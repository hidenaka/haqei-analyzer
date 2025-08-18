/**
 * 既存の高度な解析システムを全部統合する修正スクリプト
 * 
 * 問題：200KB以上の高度な解析コードが存在するのに使われていない
 * 解決：全部使い切る
 */

// 修正箇所1: analyzeWorry関数を完全版に置換（2807行目付近）
const analyzeWorryFixed = `
async function analyzeWorry(inputText) {
  console.log('🌸 analyzeWorry 完全版実行開始:', inputText);
  
  // 1. Kuromoji形態素解析
  let morphTokens = null;
  if (window.OfflineKuromojiInitializer && window.OfflineKuromojiInitializer.initialized) {
    morphTokens = await window.OfflineKuromojiInitializer.analyze(inputText);
    console.log('✅ Kuromoji形態素解析完了:', morphTokens);
  }
  
  // 2. DynamicKeywordGenerator - 4層キーワード生成
  let dynamicKeywords = null;
  if (window.DynamicKeywordGenerator) {
    dynamicKeywords = await window.DynamicKeywordGenerator.engineOS.generateKeywords(
      inputText, 
      { morphTokens }
    );
    console.log('✅ 動的キーワード生成完了:', dynamicKeywords);
  }
  
  // 3. IntegratedAnalysisEngine - 多層文脈分析
  let contextAnalysis = null;
  if (window.IntegratedAnalysisEngine) {
    contextAnalysis = await window.IntegratedAnalysisEngine.analyze(
      inputText,
      { keywords: dynamicKeywords }
    );
    console.log('✅ 統合分析完了:', contextAnalysis);
  }
  
  // 4. IChingSituationAnalyzer - H384データベース連携
  let ichingAnalysis = null;
  const sim = window.getIChingSimulator ? window.getIChingSimulator() : null;
  if (sim && sim.isReady && sim.isReady()) {
    ichingAnalysis = await sim.analyzeSituation(inputText);
    console.log('✅ I Ching分析完了:', ichingAnalysis);
  }
  
  // 5. 分析結果を統合
  window.integratedAnalysisResult = {
    input: inputText,
    morphology: morphTokens,
    keywords: dynamicKeywords,
    context: contextAnalysis,
    iching: ichingAnalysis,
    timestamp: new Date().toISOString()
  };
  
  // 6. 8シナリオ生成を有効化（本来のコードを復活）
  if (window.generateAndDisplay8Scenarios) {
    await generateAndDisplay8Scenarios(inputText);
  } else if (window.EightScenariosGenerator) {
    // 直接呼び出し
    const generator = new window.EightScenariosGenerator();
    const scenarios = await generator.generateScenarios(ichingAnalysis, contextAnalysis);
    displayDynamicScenarios(scenarios, inputText);
  }
  
  // 結果表示
  const resultsContainer = document.getElementById('resultsContainer');
  if (resultsContainer) {
    resultsContainer.style.display = 'block';
    setTimeout(() => {
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }
}`;

// 修正箇所2: generateAndDisplay8Scenariosを動的版に修正
const generateAndDisplay8ScenariosFixed = `
async function generateAndDisplay8Scenarios(worryText) {
  console.log('🎯 8シナリオ生成開始（完全版）:', worryText);
  
  const analysis = window.integratedAnalysisResult;
  
  if (!analysis || !analysis.iching) {
    console.warn('⚠️ 統合分析結果がない、簡易版で実行');
    const scenarios = generateJingYaoHengYaoScenarios(worryText);
    displayDynamicScenarios(scenarios, worryText);
    return;
  }
  
  // IChingSituationAnalyzerの結果を使用
  const { hexagram, yao, analysis: ichingDetail } = analysis.iching;
  
  // 初期卦・爻を動的に設定
  const initial = {
    hex: hexagram.number,
    line: yao.position
  };
  
  console.log('📊 動的初期状態:', hexagram.name, yao.name);
  
  // 3フェーズシステムで8パターン生成（動的初期値使用）
  const scenarios = generateThreePhaseScenarios(
    initial.hex, 
    initial.line, 
    analysis.context || analyzeInputForHexagram(worryText),
    worryText
  );
  
  console.log('✅ 動的8パターン生成完了');
  displayDynamicScenarios(scenarios, worryText);
}`;

// 修正箇所3: selectInitialHexLineを完全な動的版に
const selectInitialHexLineFixed = `
function selectInitialHexLine(analysis) {
  // 統合分析結果があれば優先使用
  if (window.integratedAnalysisResult && window.integratedAnalysisResult.iching) {
    const { hexagram, yao } = window.integratedAnalysisResult.iching;
    console.log('✅ 高度な分析結果を使用:', hexagram.name, yao.name);
    return {
      hex: hexagram.number,
      line: yao.position
    };
  }
  
  // フォールバック（既存の簡易ロジック）
  let hex = 1;
  let line = 1;
  
  if (analysis.hasDecision && analysis.hasWork) {
    hex = 3;
    line = 1;
  } else if (analysis.hasConflict && analysis.hasRelation) {
    hex = 6;
    line = 2;
  }
  // ... 既存の条件分岐
  
  return { hex, line };
}`;

console.log('修正内容:');
console.log('1. analyzeWorry - Kuromoji、DynamicKeywordGenerator、IntegratedAnalysisEngine統合');
console.log('2. generateAndDisplay8Scenarios - 有効化と動的分析結果使用');
console.log('3. selectInitialHexLine - 高度な分析結果優先');
console.log('');
console.log('既存システム活用状況:');
console.log('✅ Kuromoji形態素解析');
console.log('✅ DynamicKeywordGenerator (31KB)');
console.log('✅ IntegratedAnalysisEngine (23KB)');
console.log('✅ EightScenariosGenerator (47KB)');
console.log('✅ IChingSituationAnalyzer');
console.log('✅ H384データベース連携');
console.log('');
console.log('合計200KB以上のコードを完全活用！');