/**
 * QuestionManager使用例とテストコード
 * 
 * HaQei哲学に基づくHAQEI質問データ管理システムの使用方法
 * I Ching 8次元統合・Triple OS Architecture対応の実用例
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0
 * Created: 2025-08-05
 */

/**
 * 基本的な使用例
 */
async function basicUsageExample() {
  console.log('🌟 === QuestionManager基本使用例 ===');
  
  // 1. QuestionManagerの初期化
  const questionManager = new QuestionManager({
    enableCaching: true,
    enableHaQeiMode: true,
    enableIChing8Dimensions: true,
    enableTripleOSMode: true,
    enableErrorRecovery: true,
    debugMode: true
  });
  
  // 2. 初期化完了を待つ
  await questionManager.initialize();
  
  // 3. 基本的な質問取得
  const allQuestions = questionManager.getAllQuestions();
  console.log(`📚 全質問数: ${allQuestions.length}`);
  
  // 4. VirtualQuestionFlow互換の配列取得
  const questionsArray = questionManager.getQuestionsArray();
  console.log(`📋 配列形式: ${questionsArray.length}問`);
  
  // 5. 特定の質問取得
  const firstQuestion = questionManager.getQuestionById('q1');
  console.log(`🔍 Q1の内容:`, firstQuestion?.text);
  
  // 6. システム統計の表示
  const stats = questionManager.getSystemStatistics();
  console.log('📊 システム統計:', stats);
}

/**
 * HaQei分人機能の使用例
 */
async function HaQeiUsageExample() {
  console.log('\n🎭 === HaQei分人機能使用例 ===');
  
  const questionManager = new QuestionManager({
    enableHaQeiMode: true,
    enableIChing8Dimensions: true
  });
  
  await questionManager.initialize();
  
  // 1. 各分人別の質問取得
  const personas = ['analyticalSelf', 'emotionalSelf', 'pragmaticSelf', 'creativeSelf'];
  
  personas.forEach(persona => {
    const questions = questionManager.getQuestionsByHaQeiPersona(persona);
    console.log(`🎭 ${persona}: ${questions.length}問`);
    
    if (questions.length > 0) {
      console.log(`   例: ${questions[0].text.substring(0, 50)}...`);
      console.log(`   HaQei重要度: ${questions[0].HaQeiWeight.toFixed(2)}`);
    }
  });
  
  // 2. HaQei分析レポート
  const HaQeiReport = questionManager.getHaQeiAnalysisReport();
  console.log('\n📋 HaQei分析レポート:');
  Object.entries(HaQeiReport.personas).forEach(([persona, data]) => {
    console.log(`  ${persona}: ${data.questionCount}問 (${data.percentage.toFixed(1)}%)`);
    console.log(`    アプローチ: ${data.approach}`);
    console.log(`    易経対応: [${data.ichingAlignment.join(', ')}]`);
  });
  
  // 3. 推奨質問の取得（現在の回答状況を考慮）
  const currentAnswers = [{ questionId: 'q1' }, { questionId: 'q2' }];
  const recommended = questionManager.getRecommendedQuestionsForPersona('analyticalSelf', currentAnswers);
  console.log(`\n🎯 分析型分人への推奨質問: ${recommended.length}問`);
}

/**
 * I Ching 8次元機能の使用例
 */
async function iching8DimensionUsageExample() {
  console.log('\n☯️ === I Ching 8次元機能使用例 ===');
  
  const questionManager = new QuestionManager({
    enableIChing8Dimensions: true,
    enableHaQeiMode: true
  });
  
  await questionManager.initialize();
  
  // 1. 8次元別の質問分布
  const dimensions = Object.keys(questionManager.ichingDimensions);
  
  console.log('📊 8次元別質問分布:');
  dimensions.forEach(dimension => {
    const questions = questionManager.getQuestionsByIChing8Dimension(dimension);
    const info = questionManager.ichingDimensions[dimension];
    
    console.log(`${info.trigram} ${dimension}: ${questions.length}問`);
    console.log(`   要素: ${info.element} | 性質: ${info.nature}`);
    console.log(`   補完: ${info.complementary}`);
    console.log(`   対立: ${info.conflicting}`);
  });
  
  // 2. I Ching 8次元分析レポート
  const ichingReport = questionManager.getIChing8DimensionReport();
  console.log('\n📋 I Ching 8次元分析レポート:');
  Object.entries(ichingReport.dimensions).forEach(([dimension, data]) => {
    console.log(`${data.trigram} ${dimension}: ${data.questionCount}問 (${data.percentage.toFixed(1)}%)`);
  });
  
  // 3. 相生相克による関連質問の取得
  const relatedQuestions = questionManager.getRelatedQuestionsByIChing8('q1');
  console.log(`\n🔗 Q1の関連質問（相生相克）: ${relatedQuestions.length}問`);
  relatedQuestions.forEach(q => {
    console.log(`   ${q.id}: ${q.primaryDimension} - ${q.text.substring(0, 40)}...`);
  });
}

/**
 * Triple OS Architecture機能の使用例
 */
async function tripleOSUsageExample() {
  console.log('\n🔺 === Triple OS Architecture使用例 ===');
  
  const questionManager = new QuestionManager({
    enableTripleOSMode: true,
    enableHaQeiMode: true
  });
  
  await questionManager.initialize();
  
  // 1. OS別質問分布
  const osModes = ['engine', 'interface', 'safeMode'];
  
  console.log('🖥️ Triple OS別質問分布:');
  osModes.forEach(osMode => {
    const questions = questionManager.getQuestionsByTripleOS(osMode);
    console.log(`${osMode}: ${questions.length}問`);
    
    if (questions.length > 0) {
      const avgComplexity = questions.reduce((sum, q) => sum + q.complexity, 0) / questions.length;
      console.log(`   平均複雑度: ${avgComplexity.toFixed(2)}`);
      console.log(`   例: ${questions[0].text.substring(0, 50)}...`);
    }
  });
  
  // 2. OS適合度による質問詳細
  const allQuestions = questionManager.getAllQuestions().slice(0, 5);
  console.log('\n🔍 質問のOS適合度詳細:');
  allQuestions.forEach(question => {
    console.log(`${question.id}: ${question.text.substring(0, 40)}...`);
    console.log(`   最適OS: ${question.tripleOSMode}`);
    console.log(`   適合度: Engine=${question.osCompatibility.engine.toFixed(2)}, Interface=${question.osCompatibility.interface.toFixed(2)}, Safe=${question.osCompatibility.safeMode.toFixed(2)}`);
  });
}

/**
 * 高度な検索機能の使用例
 */
async function advancedSearchExample() {
  console.log('\n🔍 === 高度な検索機能使用例 ===');
  
  const questionManager = new QuestionManager({
    enableHaQeiMode: true,
    enableIChing8Dimensions: true,
    enableTripleOSMode: true
  });
  
  await questionManager.initialize();
  
  // 1. 複合条件検索
  const searchCriteria = {
    HaQeiPersona: 'analyticalSelf',
    ichingDimension: '乾_創造性',
    minDifficulty: 0.3,
    maxDifficulty: 0.8,
    sortBy: 'HaQeiWeight',
    sortOrder: 'desc',
    limit: 5
  };
  
  const searchResults = questionManager.searchQuestions(searchCriteria);
  console.log(`🔍 複合検索結果: ${searchResults.length}問`);
  searchResults.forEach(question => {
    console.log(`   ${question.id}: 難易度=${question.difficulty.toFixed(2)}, HaQei重要度=${question.HaQeiWeight.toFixed(2)}`);
    console.log(`      ${question.text.substring(0, 60)}...`);
  });
  
  // 2. カテゴリ別検索
  const worldviewQuestions = questionManager.getQuestionsByCategory('worldview');
  const scenarioQuestions = questionManager.getQuestionsByCategory('scenario');
  
  console.log(`\n📂 カテゴリ別質問数:`);
  console.log(`   価値観質問: ${worldviewQuestions.length}問`);
  console.log(`   シナリオ質問: ${scenarioQuestions.length}問`);
  
  // 3. 難易度別検索
  const easyQuestions = questionManager.searchQuestions({ maxDifficulty: 0.4 });
  const hardQuestions = questionManager.searchQuestions({ minDifficulty: 0.7 });
  
  console.log(`\n📊 難易度別質問数:`);
  console.log(`   易しい質問 (≤0.4): ${easyQuestions.length}問`);
  console.log(`   難しい質問 (≥0.7): ${hardQuestions.length}問`);
}

/**
 * エラー回復機能のテスト例
 */
async function errorRecoveryExample() {
  console.log('\n🛡️ === エラー回復機能テスト例 ===');
  
  // わざとエラーが起きやすい設定でテスト
  const questionManager = new QuestionManager({
    enableErrorRecovery: true,
    enableCaching: true,
    debugMode: true
  });
  
  // 初期化前にグローバル変数を一時的に削除してエラーを発生させる
  const originalWorldview = window.WORLDVIEW_QUESTIONS;
  const originalScenario = window.SCENARIO_QUESTIONS;
  
  delete window.WORLDVIEW_QUESTIONS;
  delete window.SCENARIO_QUESTIONS;
  
  try {
    await questionManager.initialize();
    console.log('✅ エラー回復機能が正常に動作しました');
    
    const questions = questionManager.getAllQuestions();
    console.log(`📚 回復後の質問数: ${questions.length}`);
    
    // ヘルスチェック実行
    const health = questionManager.performHealthCheck();
    console.log(`🏥 システム健康度: ${health.status} (スコア: ${health.score})`);
    if (health.issues.length > 0) {
      console.log('⚠️ 検出された問題:', health.issues);
      console.log('💡 推奨対応:', health.recommendations);
    }
    
  } catch (error) {
    console.error('❌ エラー回復に失敗:', error);
  } finally {
    // グローバル変数を復元
    window.WORLDVIEW_QUESTIONS = originalWorldview;
    window.SCENARIO_QUESTIONS = originalScenario;
  }
}

/**
 * パフォーマンステスト例
 */
async function performanceTestExample() {
  console.log('\n⚡ === パフォーマンステスト例 ===');
  
  const startTime = performance.now();
  
  const questionManager = new QuestionManager({
    enableCaching: true,
    enableHaQeiMode: true,
    enableIChing8Dimensions: true,
    enableTripleOSMode: true,
    enablePerformanceOptimization: true
  });
  
  // 初期化時間測定
  const initStart = performance.now();
  await questionManager.initialize();
  const initTime = performance.now() - initStart;
  
  console.log(`⏱️ 初期化時間: ${initTime.toFixed(2)}ms`);
  
  // 各種操作のパフォーマンス測定
  const operations = [
    { name: '全質問取得', fn: () => questionManager.getAllQuestions() },
    { name: 'ID指定取得', fn: () => questionManager.getQuestionById('q1') },
    { name: 'HaQei検索', fn: () => questionManager.getQuestionsByHaQeiPersona('analyticalSelf') },
    { name: 'I Ching検索', fn: () => questionManager.getQuestionsByIChing8Dimension('乾_創造性') },
    { name: '複合検索', fn: () => questionManager.searchQuestions({ minDifficulty: 0.5, limit: 10 }) },
    { name: '関連質問取得', fn: () => questionManager.getRelatedQuestionsByIChing8('q1') }
  ];
  
  console.log('\n📊 操作別パフォーマンス:');
  operations.forEach(operation => {
    const opStart = performance.now();
    const result = operation.fn();
    const opTime = performance.now() - opStart;
    
    console.log(`   ${operation.name}: ${opTime.toFixed(2)}ms (結果: ${Array.isArray(result) ? result.length : 1}件)`);
  });
  
  // システム統計の表示
  const stats = questionManager.getSystemStatistics();
  console.log('\n📈 最終パフォーマンス統計:');
  console.log(`   総処理時間: ${(performance.now() - startTime).toFixed(2)}ms`);
  console.log(`   メモリ使用量: ${stats.memoryUsage.toFixed(2)}MB`);
  console.log(`   キャッシュヒット率: ${stats.performanceMetrics.cacheHitRate.toFixed(1)}%`);
  console.log(`   データ整合性チェック: ${stats.performanceMetrics.dataIntegrityChecks}件の問題`);
}

/**
 * VirtualQuestionFlowとの統合例
 */
async function virtualQuestionFlowIntegrationExample() {
  console.log('\n🎬 === VirtualQuestionFlow統合例 ===');
  
  const questionManager = new QuestionManager({
    enableHaQeiMode: true,
    enableIChing8Dimensions: true
  });
  
  await questionManager.initialize();
  
  // VirtualQuestionFlow互換のデータ形式で取得
  const questionsArray = questionManager.getQuestionsArray();
  console.log(`📋 VirtualQuestionFlow用配列: ${questionsArray.length}問`);
  
  // 実際のVirtualQuestionFlowとの統合（疑似コード）
  const virtualQuestionFlowConfig = {
    questions: questionsArray,
    
    // HaQei分人を考慮したカスタム質問順序
    customOrder: questionManager.getQuestionsByHaQeiPersona('analyticalSelf')
      .concat(questionManager.getQuestionsByHaQeiPersona('pragmaticSelf'))
      .concat(questionManager.getQuestionsByHaQeiPersona('emotionalSelf'))
      .concat(questionManager.getQuestionsByHaQeiPersona('creativeSelf'))
      .map(q => q.index),
    
    // I Ching 8次元を考慮した関連質問推奨システム
    getRelatedQuestions: (currentQuestionId) => {
      return questionManager.getRelatedQuestionsByIChing8(currentQuestionId);
    },
    
    // HaQei分人別の質問表示スタイル
    getQuestionStyle: (questionId) => {
      const question = questionManager.getQuestionById(questionId);
      if (!question) return 'default';
      
      const persona = question.HaQeiPersona;
      const styles = {
        analyticalSelf: 'analytical-theme',
        emotionalSelf: 'emotional-theme', 
        pragmaticSelf: 'pragmatic-theme',
        creativeSelf: 'creative-theme'
      };
      
      return styles[persona] || 'default';
    }
  };
  
  console.log('🔗 VirtualQuestionFlow統合設定完了');
  console.log(`   カスタム順序: ${virtualQuestionFlowConfig.customOrder.length}問`);
}

/**
 * 全使用例の実行
 */
async function runAllExamples() {
  console.log('🚀 === QuestionManager使用例・テスト実行開始 ===\n');
  
  try {
    await basicUsageExample();
    await HaQeiUsageExample();
    await iching8DimensionUsageExample();
    await tripleOSUsageExample();
    await advancedSearchExample();
    await errorRecoveryExample();
    await performanceTestExample();
    await virtualQuestionFlowIntegrationExample();
    
    console.log('\n✅ === 全使用例・テスト完了 ===');
    
  } catch (error) {
    console.error('\n❌ 使用例実行中にエラーが発生:', error);
  }
}

// 実行用の関数をグローバルに公開
if (typeof window !== 'undefined') {
  window.QuestionManagerExamples = {
    runAllExamples,
    basicUsageExample,
    HaQeiUsageExample,
    iching8DimensionUsageExample,
    tripleOSUsageExample,
    advancedSearchExample,
    errorRecoveryExample,
    performanceTestExample,
    virtualQuestionFlowIntegrationExample
  };
  
  console.log('📚 QuestionManager使用例が利用可能です:');
  console.log('   window.QuestionManagerExamples.runAllExamples() - 全例を実行');
  console.log('   window.QuestionManagerExamples.basicUsageExample() - 基本使用例');
  console.log('   その他の個別例も利用可能');
}

// Node.js環境での公開
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllExamples,
    basicUsageExample,
    HaQeiUsageExample,
    iching8DimensionUsageExample,
    tripleOSUsageExample,
    advancedSearchExample,
    errorRecoveryExample,
    performanceTestExample,
    virtualQuestionFlowIntegrationExample
  };
}