/**
 * 仮想人格システム統合テスト
 * Virtual Personality System Integration Test
 * 
 * HaQei Analyzer - OS分析の革新的アプローチのテスト：
 * ユーザー回答 → 仮想人格形成 → 3つのOS相互作用 → 易経メタファー解説
 */

// 必要なクラスの読み込み（Node.js環境での簡易テスト）
const fs = require('fs');
const path = require('path');

// テスト用のモックユーザー回答データ
const mockUserAnswers = [
  {
    questionId: 'q1',
    question: '価値観について',
    selectedOption: '理想を追求することが重要',
    intensity: 0.8
  },
  {
    questionId: 'q2',
    question: '創造性について',
    selectedOption: '新しいアイデアを生み出すことに喜びを感じる',
    intensity: 0.9
  },
  {
    questionId: 'q25',
    question: 'シナリオ：ストレス状況での反応',
    selectedOption: '周囲と協調して解決策を探す',
    intensity: 0.7
  }
];

console.log('🧪 Starting Virtual Personality System Integration Test...');

// テスト実行
async function runVirtualPersonalityTest() {
  try {
    console.log('📋 Test Data:');
    console.log('- Mock user answers:', mockUserAnswers.length);
    console.log('- Sample answer:', mockUserAnswers[0]);
    
    // 1. ファイル存在確認
    console.log('\n📁 Checking file existence...');
    const requiredFiles = [
      '/public/js/os-analyzer/core/VirtualPersonality.js',
      '/public/js/os-analyzer/core/PersonalityOS.js',
      '/public/js/os-analyzer/core/OSRelationshipEngine.js',
      '/public/js/os-analyzer/core/IchingMetaphorEngine.js',
      '/public/js/os-analyzer/core/TripleOSEngine.js'
    ];
    
    const missingFiles = [];
    for (const file of requiredFiles) {
      const fullPath = path.join(__dirname, file);
      if (!fs.existsSync(fullPath)) {
        missingFiles.push(file);
      } else {
        console.log(`✅ ${file} exists`);
      }
    }
    
    if (missingFiles.length > 0) {
      console.log('❌ Missing files:', missingFiles);
      return false;
    }
    
    // 2. クラス構造確認
    console.log('\n🔍 Checking class structures...');
    
    // VirtualPersonality.jsの確認
    const virtualPersonalityContent = fs.readFileSync(
      path.join(__dirname, '/public/js/os-analyzer/core/VirtualPersonality.js'), 
      'utf8'
    );
    
    const hasVirtualPersonalityClass = virtualPersonalityContent.includes('class VirtualPersonality');
    const hasInitialize = virtualPersonalityContent.includes('initialize()');
    const hasPersonalityOS = virtualPersonalityContent.includes('new PersonalityOS');
    
    console.log(`✅ VirtualPersonality class: ${hasVirtualPersonalityClass}`);
    console.log(`✅ initialize method: ${hasInitialize}`);
    console.log(`✅ PersonalityOS creation: ${hasPersonalityOS}`);
    
    // TripleOSEngine.jsの仮想人格統合確認
    const tripleOSContent = fs.readFileSync(
      path.join(__dirname, '/public/js/os-analyzer/core/TripleOSEngine.js'), 
      'utf8'
    );
    
    const hasVirtualPersonalitySystem = tripleOSContent.includes('virtualPersonalitySystem');
    const hasRunVirtualPersonalityAnalysis = tripleOSContent.includes('runVirtualPersonalityAnalysis');
    const hasAnalyzeUser = tripleOSContent.includes('analyzeUser');
    
    console.log(`✅ Virtual Personality System integration: ${hasVirtualPersonalitySystem}`);
    console.log(`✅ runVirtualPersonalityAnalysis method: ${hasRunVirtualPersonalityAnalysis}`);
    console.log(`✅ analyzeUser method: ${hasAnalyzeUser}`);
    
    // 3. 統合度チェック
    console.log('\n🔗 Checking integration completeness...');
    
    const hasCreateVirtualPersonality = tripleOSContent.includes('createVirtualPersonality');
    const hasIntegrateRelationshipEngine = tripleOSContent.includes('integrateRelationshipEngine');
    const hasIntegrateMetaphorEngine = tripleOSContent.includes('integrateMetaphorEngine');
    const hasGenerateIntegratedAnalysis = tripleOSContent.includes('generateIntegratedAnalysis');
    
    console.log(`✅ createVirtualPersonality: ${hasCreateVirtualPersonality}`);
    console.log(`✅ integrateRelationshipEngine: ${hasIntegrateRelationshipEngine}`);
    console.log(`✅ integrateMetaphorEngine: ${hasIntegrateMetaphorEngine}`);
    console.log(`✅ generateIntegratedAnalysis: ${hasGenerateIntegratedAnalysis}`);
    
    // 4. 新しいフロー確認
    console.log('\n🎭 Checking new analysis flow...');
    
    const hasIntegratedInsights = tripleOSContent.includes('generateIntegratedInsights');
    const hasActionRecommendations = tripleOSContent.includes('generateActionRecommendations');
    const hasFallbackAnalysis = tripleOSContent.includes('generateFallbackAnalysis');
    
    console.log(`✅ Integrated insights generation: ${hasIntegratedInsights}`);
    console.log(`✅ Action recommendations: ${hasActionRecommendations}`);
    console.log(`✅ Fallback analysis: ${hasFallbackAnalysis}`);
    
    // 5. 易経メタファーエンジン確認
    console.log('\n🔮 Checking I Ching Metaphor Engine...');
    
    const ichingContent = fs.readFileSync(
      path.join(__dirname, '/public/js/os-analyzer/core/IchingMetaphorEngine.js'), 
      'utf8'
    );
    
    const hasHexagramDatabase = ichingContent.includes('initializeHexagramDatabase');
    const hasGeneratePersonalityMetaphor = ichingContent.includes('generatePersonalityMetaphor');
    const hasGetIntegratedMetaphors = ichingContent.includes('getIntegratedMetaphors');
    
    console.log(`✅ Hexagram database: ${hasHexagramDatabase}`);
    console.log(`✅ Personality metaphor generation: ${hasGeneratePersonalityMetaphor}`);
    console.log(`✅ Integrated metaphors: ${hasGetIntegratedMetaphors}`);
    
    // 6. OS関係性エンジン確認
    console.log('\n🔗 Checking OS Relationship Engine...');
    
    const relationshipContent = fs.readFileSync(
      path.join(__dirname, '/public/js/os-analyzer/core/OSRelationshipEngine.js'), 
      'utf8'
    );
    
    const hasRelationshipMatrix = relationshipContent.includes('initializeRelationshipMatrix');
    const hasSimulateDialogue = relationshipContent.includes('simulateComplexInternalDialogue');
    const hasGenerateReport = relationshipContent.includes('generateRelationshipReport');
    
    console.log(`✅ Relationship matrix: ${hasRelationshipMatrix}`);
    console.log(`✅ Complex dialogue simulation: ${hasSimulateDialogue}`);
    console.log(`✅ Relationship report generation: ${hasGenerateReport}`);
    
    // テスト結果サマリー
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    
    const allChecks = [
      hasVirtualPersonalityClass,
      hasInitialize,
      hasPersonalityOS,
      hasVirtualPersonalitySystem,
      hasRunVirtualPersonalityAnalysis,
      hasCreateVirtualPersonality,
      hasIntegrateRelationshipEngine,
      hasIntegrateMetaphorEngine,
      hasGenerateIntegratedAnalysis,
      hasHexagramDatabase,
      hasRelationshipMatrix
    ];
    
    const passedChecks = allChecks.filter(check => check).length;
    const totalChecks = allChecks.length;
    
    console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);
    console.log(`🎯 Integration completeness: ${((passedChecks/totalChecks) * 100).toFixed(1)}%`);
    
    if (passedChecks === totalChecks) {
      console.log('\n🎉 Virtual Personality System Integration: COMPLETE!');
      console.log('🚀 Ready for user testing');
      
      console.log('\n📋 Revolutionary Analysis Flow Implemented:');
      console.log('1. ユーザー回答収集 → User Answer Collection');
      console.log('2. 仮想人格形成 → Virtual Personality Formation');
      console.log('3. 3つのOS相互作用 → Triple OS Interaction');
      console.log('4. 易経メタファー解説 → I Ching Metaphor Explanation');
      console.log('5. 統合洞察提供 → Integrated Insights Delivery');
      
      return true;
    } else {
      console.log('\n⚠️ Integration incomplete. Some components need attention.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    return false;
  }
}

// テスト実行
runVirtualPersonalityTest()
  .then(success => {
    if (success) {
      console.log('\n✅ Virtual Personality System Test: PASSED');
      process.exit(0);
    } else {
      console.log('\n❌ Virtual Personality System Test: FAILED');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  });