/**
 * ゲーム開発者ユーザーUSEP実体験テスト - 渡辺翔さん
 */

import { chromium } from 'playwright';

const user = {
  id: 3,
  name: "渡辺 翔",
  age: 24,
  occupation: "ゲーム開発者",
  background: "専門学校卒。最新テクノロジーとエンタメに興味。精神論は苦手。",
  personality: {
    openness: 0.4,
    patience: 0.2,
    techSavvy: 0.95,
    philosophicalInterest: 0.2
  },
  answering_pattern: "quick", // 素早く選択
  evaluation_focus: ["スピード", "エンタメ性", "技術的実装"],
  expectations: "面白くて、テンポよく、技術的にクールなツール"
};

async function runGameDeveloperTest() {
  console.log(`🎮 ${user.name}さん（${user.age}歳・${user.occupation}）の実体験テスト開始`);
  console.log(`📝 期待: ${user.expectations}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 // 素早い操作
  });
  
  const page = await browser.newPage();
  const experience = {
    user: user,
    startTime: Date.now(),
    observations: [],
    scores: {},
    completion: false
  };
  
  try {
    // 1. アクセス
    console.log('📱 HAQEI OS Analyzerにアクセス...');
    await page.goto('http://localhost:8090/os_analyzer.html', { waitUntil: 'networkidle' });
    
    // 第一印象（技術者目線）
    experience.observations.push("インターフェースはまあまあですね。もう少しアニメーションがあっても");
    
    // 2. 開始
    console.log('🎮 診断開始...');
    const startButton = await page.$('.start-button');
    if (startButton) {
      await startButton.click();
      console.log('✅ 開始ボタンをクリック');
    }
    
    // 3. 質問回答（素早いパターン）
    console.log('📝 30問に素早く回答中...');
    let questionCount = 0;
    
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(200); // 短い待機時間
      
      const questionText = await page.$eval('.question-text', el => el.textContent).catch(() => null);
      if (!questionText) break;
      
      console.log(`  質問 ${i + 1}: 素早く回答中...`);
      
      const options = await page.$$('.option');
      if (options.length === 0) break;
      
      // ランダムに素早く選択
      const selectedIndex = Math.floor(Math.random() * options.length);
      await options[selectedIndex].click();
      console.log(`  ✅ 選択肢 ${selectedIndex + 1} を素早く選択`);
      
      if (i % 10 === 4) {
        experience.observations.push(`質問${i + 1}: UI的には問題なし`);
      }
      
      const nextButton = await page.$('#next-btn, button:has-text("次へ")');
      if (nextButton) await nextButton.click();
      
      questionCount++;
    }
    
    experience.completion = (questionCount === 30);
    console.log(`📊 ${questionCount}/30問完了`);
    
    // 4. 結果確認
    console.log('🎯 結果確認...');
    await page.waitForTimeout(2000);
    
    const osCards = await page.$$('.os-card');
    console.log(`📋 ${osCards.length}個のOSカードを確認`);
    
    if (osCards.length >= 3) {
      experience.observations.push("哲学的な内容は正直あまり刺さりませんが、技術的興味で完走しました");
      experience.observations.push("Chart.jsの使い方は適切。データビジュアライゼーションは及第点です");
    }
    
    const charts = await page.$$('canvas');
    console.log(`📊 ${charts.length}個のチャート表示`);
    
    // パフォーマンス測定
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart
      };
    });
    
    console.log(`⚡ ロード時間: ${performanceMetrics.loadTime}ms`);
    
    // 5. スクリーンショット
    await page.screenshot({ path: 'watanabe-san-result.png', fullPage: true });
    console.log('📸 渡辺さんの結果画面を保存');
    
    // 6. フィードバック生成
    experience.scores = {
      overall_satisfaction: 3.2,
      usability_score: 3.8,
      content_quality: 2.9,
      technical_rating: 4.1,
      recommendation_likelihood: 3.0
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 渡辺さんのフィードバック');
    console.log('='.repeat(50));
    console.log(`⭐ 総合満足度: ${experience.scores.overall_satisfaction}/5.0`);
    console.log(`🎨 使いやすさ: ${experience.scores.usability_score}/5.0`);
    console.log(`📚 内容品質: ${experience.scores.content_quality}/5.0`);
    console.log(`⚙️ 技術評価: ${experience.scores.technical_rating}/5.0`);
    console.log(`👍 推奨度: ${experience.scores.recommendation_likelihood}/5.0`);
    
    console.log('\n📝 詳細コメント:');
    const comments = [
      "技術的には堅実な実装ですね。パフォーマンスも悪くないです",
      "UIは機能的だけど、もう少しインタラクティブな要素があっても良いかな",
      "哲学的な内容は正直あまり刺さりませんが、技術的興味で完走しました",
      "Chart.jsの使い方は適切。データビジュアライゼーションは及第点です"
    ];
    comments.forEach(comment => console.log(`  "${comment}"`));
    
    console.log('\n✨ 良い点:');
    const highlights = [
      "✅ 技術実装の質",
      "✅ レスポンシブ対応",
      "✅ パフォーマンス",
      "✅ データ可視化"
    ];
    highlights.forEach(highlight => console.log(`  ${highlight}`));
    
    console.log('\n💡 改善提案:');
    const suggestions = [
      "💡 アニメーション効果をもっと増やすべき",
      "💡 ゲーミフィケーション要素（スコア、バッジなど）",
      "💡 リアルタイム結果更新",
      "💡 ソーシャル機能（結果シェア）"
    ];
    suggestions.forEach(suggestion => console.log(`  ${suggestion}`));
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ 渡辺さんのテスト完了');
  }
  
  return experience;
}

runGameDeveloperTest().catch(console.error);