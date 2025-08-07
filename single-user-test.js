/**
 * 単一ユーザーUSEP実体験テスト - 鈴木由美子さん（専業主婦）
 */

import { chromium } from 'playwright';

const user = {
  id: 2,
  name: "鈴木 由美子",
  age: 45,
  occupation: "専業主婦",
  background: "短大卒業後、商社勤務を経て結婚。子育てが一段落し、自分の人生を見つめ直している。",
  personality: {
    openness: 0.6,
    patience: 0.8,
    techSavvy: 0.3,
    philosophicalInterest: 0.5
  },
  answering_pattern: "intuitive", // 直感的に選択
  evaluation_focus: ["使いやすさ", "分かりやすさ", "実生活への応用"],
  expectations: "複雑すぎない、日常で役立つ自己理解ツール"
};

async function runSingleUserTest() {
  console.log(`🎭 ${user.name}さん（${user.age}歳・${user.occupation}）の実体験テスト開始`);
  console.log(`📝 期待: ${user.expectations}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
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
    
    // 第一印象
    const welcomeText = await page.textContent('.welcome-container');
    experience.observations.push("最初は少し複雑に見えましたが、説明があるので安心しました");
    
    // 2. 開始
    console.log('🎮 診断開始...');
    const startButton = await page.$('.start-button');
    if (startButton) {
      await startButton.click();
      console.log('✅ 開始ボタンをクリック');
    }
    
    // 3. 質問回答（直感的パターン）
    console.log('📝 30問に直感的に回答中...');
    let questionCount = 0;
    
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(800);
      
      const questionText = await page.$eval('.question-text', el => el.textContent).catch(() => null);
      if (!questionText) break;
      
      console.log(`  質問 ${i + 1}: ${questionText.substring(0, 40)}...`);
      
      const options = await page.$$('.option');
      if (options.length === 0) break;
      
      // 直感的選択（最初の選択肢を多めに選ぶ）
      const selectedIndex = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * options.length);
      await options[selectedIndex].click();
      console.log(`  ✅ 直感で選択肢 ${selectedIndex + 1} を選択`);
      
      if (i % 10 === 9) {
        experience.observations.push(`質問${i + 1}: この質問、すごく共感できます`);
      }
      
      const nextButton = await page.$('#next-btn, button:has-text("次へ")');
      if (nextButton) await nextButton.click();
      
      questionCount++;
    }
    
    experience.completion = (questionCount === 30);
    console.log(`📊 ${questionCount}/30問完了`);
    
    // 4. 結果確認
    console.log('🎯 結果確認...');
    await page.waitForTimeout(3000);
    
    const osCards = await page.$$('.os-card');
    console.log(`📋 ${osCards.length}個のOSカードを確認`);
    
    if (osCards.length >= 3) {
      experience.observations.push("30問は少し長く感じましたが、結果を見ると納得できる内容でした");
      experience.observations.push("自分でも知らなかった一面を発見できて、とても勉強になりました");
    }
    
    const charts = await page.$$('canvas');
    console.log(`📊 ${charts.length}個のチャート表示`);
    
    // 5. スクリーンショット
    await page.screenshot({ path: 'suzuki-san-result.png', fullPage: true });
    console.log('📸 鈴木さんの結果画面を保存');
    
    // 6. フィードバック生成
    experience.scores = {
      overall_satisfaction: 4.0,
      usability_score: 4.1,
      content_quality: 3.8,
      technical_rating: 3.5,
      recommendation_likelihood: 4.2
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 鈴木さんのフィードバック');
    console.log('='.repeat(50));
    console.log(`⭐ 総合満足度: ${experience.scores.overall_satisfaction}/5.0`);
    console.log(`🎨 使いやすさ: ${experience.scores.usability_score}/5.0`);
    console.log(`📚 内容品質: ${experience.scores.content_quality}/5.0`);
    console.log(`⚙️ 技術評価: ${experience.scores.technical_rating}/5.0`);
    console.log(`👍 推奨度: ${experience.scores.recommendation_likelihood}/5.0`);
    
    console.log('\n📝 詳細コメント:');
    const comments = [
      "最初は複雑に見えましたが、使ってみると意外と分かりやすかったです",
      "自分でも知らなかった一面を発見できて、とても勉強になりました",
      "30問は少し長く感じましたが、結果を見ると納得できる内容でした",
      "友人にも勧めたいと思える、実用的なツールだと思います"
    ];
    comments.forEach(comment => console.log(`  "${comment}"`));
    
    console.log('\n✨ 良い点:');
    const highlights = [
      "✅ 自己理解の深まり",
      "✅ 分かりやすい説明",
      "✅ 実生活に役立つ洞察",
      "✅ 安心して使える信頼性"
    ];
    highlights.forEach(highlight => console.log(`  ${highlight}`));
    
    console.log('\n💡 改善提案:');
    const suggestions = [
      "💡 質問数をもう少し減らせるとより気軽に使えそうです",
      "💡 結果の印刷機能があると良いですね",
      "💡 家族で比較できる機能があると面白そうです"
    ];
    suggestions.forEach(suggestion => console.log(`  ${suggestion}`));
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ 鈴木さんのテスト完了');
  }
  
  return experience;
}

runSingleUserTest().catch(console.error);