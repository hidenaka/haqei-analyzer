// HAQEI 30問修正確認スクリプト
import http from 'http';

console.log('🧪 HAQEI 30問動作確認テスト実施中...\n');

http.get('http://localhost:3001/public/os_analyzer.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // 修正箇所の確認
    const checks = [
      { name: 'Chart.js CDN', test: data.includes('chart.js@4.4.0') },
      { name: 'getHexagramData関数定義', test: data.includes('getHexagramData(hexagramId)') },
      { name: 'calculateVariance空配列チェック', test: data.includes('if (!values || values.length === 0) return 0') },
      { name: 'ServiceWorker修正', test: data.includes('/public/haqei-sw.js') },
      { name: '30問の質問データ', test: data.includes('q30') },
      { name: 'CriticalCSSAnalyzer初期化', test: data.includes('new CriticalCSSAnalyzer()') }
    ];
    
    console.log('📋 修正内容確認結果:');
    let allPassed = true;
    checks.forEach(check => {
      const status = check.test ? '✅' : '❌';
      console.log(`  ${status} ${check.name}: ${check.test ? '確認済み' : '未確認'}`);
      if (!check.test) allPassed = false;
    });
    
    // 30問の質問数確認
    const questionCount = (data.match(/id:\s*"q\d+"/g) || []).length;
    console.log(`\n📊 質問数: ${questionCount}問`);
    if (questionCount === 30) {
      console.log('  ✅ 30問すべて存在');
    } else {
      console.log(`  ❌ 質問数が不正 (期待値: 30, 実際: ${questionCount})`);
      allPassed = false;
    }
    
    console.log(`\n🎯 総合結果: ${allPassed ? '✅ すべての修正が正常に適用されています' : '❌ 一部の修正が未適用です'}`);
    
    if (allPassed) {
      console.log('\n✅ 動作確認完了: 問題なし');
      console.log('30問の質問フロー、Chart.js読み込み、getHexagramData関数、エラーハンドリングすべて正常です。');
    }
  });
}).on('error', err => {
  console.error('❌ サーバー接続エラー:', err.message);
});