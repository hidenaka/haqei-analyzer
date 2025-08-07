/**
 * Debug用簡易テスト - DOM要素確認
 */

console.log('🔧 HAQEI OS Analyzer Debug Test');

// サーバー稼働確認
fetch('http://localhost:8090/os_analyzer.html')
  .then(response => {
    console.log('✅ Server response:', response.status);
    return response.text();
  })
  .then(html => {
    console.log('📄 HTML size:', html.length, 'chars');
    
    // 重要な要素の存在確認
    const checks = [
      { name: 'ウェルカムコンテナ', pattern: /class="welcome-container"/ },
      { name: '開始ボタン', pattern: /class=".*start.*button.*"/ },
      { name: '質問コンテナ', pattern: /id="question-container"/ },
      { name: '結果画面', pattern: /id="results-screen"/ },
      { name: 'OSカードコンテナ', pattern: /id="os-cards-container"/ },
      { name: '選択肢コンテナ', pattern: /id="options-container"/ },
      { name: 'Option要素', pattern: /class="option"/ },
      { name: 'Triple OSエンジン', pattern: /class TripleOSEngine/ },
      { name: 'VirtualPersonaEnhancer', pattern: /class VirtualPersonaEnhancer/ }
    ];
    
    console.log('\n📋 HTML要素チェック:');
    checks.forEach(check => {
      const found = check.pattern.test(html);
      console.log(`  ${found ? '✅' : '❌'} ${check.name}: ${found ? '発見' : '未発見'}`);
    });
    
    // JavaScript読み込みの確認
    const scriptMatches = html.match(/<script[^>]*>[\s\S]*?<\/script>/g);
    console.log(`\n📜 JavaScript blocks: ${scriptMatches ? scriptMatches.length : 0}個`);
    
    // QUESTIONS配列の確認
    const questionsMatch = html.match(/QUESTIONS\s*=\s*\[([\s\S]*?)\];/);
    if (questionsMatch) {
      console.log('✅ QUESTIONS配列: 発見');
      // 質問数をカウント
      const questionCount = (questionsMatch[1].match(/text\s*:/g) || []).length;
      console.log(`  📊 質問数: ${questionCount}問`);
    } else {
      console.log('❌ QUESTIONS配列: 未発見');
    }
    
    // HEXAGRAMS配列の確認
    const hexagramsMatch = html.match(/HEXAGRAMS\s*=\s*\[([\s\S]*?)\];/);
    if (hexagramsMatch) {
      console.log('✅ HEXAGRAMS配列: 発見');
      const hexagramCount = (hexagramsMatch[1].match(/hexagram_id\s*:/g) || []).length;
      console.log(`  📊 卦数: ${hexagramCount}卦`);
    } else {
      console.log('❌ HEXAGRAMS配列: 未発見');
    }
    
  })
  .catch(error => {
    console.error('❌ エラー:', error.message);
  });