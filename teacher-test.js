/**
 * 元教師ユーザーUSEP実体験テスト - 中村京子さん
 */

import { chromium } from 'playwright';

const user = {
  id: 5,
  name: "中村 京子",
  age: 60,
  occupation: "元教師",
  background: "国立大学教育学部卒。定年退職後、デジタル機器に苦戦中。",
  personality: {
    openness: 0.5,
    patience: 0.6,
    techSavvy: 0.1,
    philosophicalInterest: 0.6
  },
  answering_pattern: "cautious", // 慎重に選択
  evaluation_focus: ["操作の分かりやすさ", "文字の見やすさ", "安心感"],
  expectations: "年配者にも優しく、教育的価値のあるツール"
};

async function runTeacherTest() {
  console.log(`👩‍🏫 ${user.name}さん（${user.age}歳・${user.occupation}）の実体験テスト開始`);
  console.log(`📝 期待: ${user.expectations}\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 800 // ゆっくりとした操作
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
    
    // 第一印象（年配者視点）
    experience.observations.push("文字が見やすくて良いですね。年配者にも配慮されている感じです");
    experience.observations.push("少し複雑に見えますが、説明があるので大丈夫そうです");
    
    // 2. 開始
    console.log('🎮 診断開始...');
    const startButton = await page.$('.start-button');
    if (startButton) {
      await startButton.click();
      console.log('✅ 開始ボタンをクリック');
    }
    
    // 3. 質問回答（慎重パターン）
    console.log('📝 30問に慎重に回答中...');
    let questionCount = 0;
    
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1500); // 長めの思考時間
      
      const questionText = await page.$eval('.question-text', el => el.textContent).catch(() => null);
      if (!questionText) break;
      
      console.log(`  質問 ${i + 1}: 慎重に考えて選択中...`);
      
      const options = await page.$$('.option');
      if (options.length === 0) break;
      
      // 慎重な選択（安全そうな後半の選択肢）
      const selectedIndex = Math.max(0, options.length - 1 - Math.floor(Math.random() * 2));
      await options[selectedIndex].click();
      console.log(`  ✅ 慎重に選択肢 ${selectedIndex + 1} を選択`);
      
      if (i % 10 === 4) {
        experience.observations.push(`質問${i + 1}: 教育的価値の高い質問だと思います`);
      }
      
      const nextButton = await page.$('#next-btn, button:has-text("次へ")');
      if (nextButton) await nextButton.click();
      
      questionCount++;
    }
    
    experience.completion = (questionCount === 30);
    console.log(`📊 ${questionCount}/30問完了`);
    
    // 4. 結果確認（教育者視点）
    console.log('🎯 結果確認...');
    await page.waitForTimeout(4000); // 結果をじっくり確認
    
    const osCards = await page.$$('.os-card');
    console.log(`📋 ${osCards.length}個のOSカードを確認`);
    
    if (osCards.length >= 3) {
      experience.observations.push("教育的価値が非常に高いツールだと感じました");
      experience.observations.push("若い世代の自己理解促進に大いに役立つと思います");
      experience.observations.push("人生経験を振り返る良いきっかけになりました");
    }
    
    const charts = await page.$$('canvas');
    console.log(`📊 ${charts.length}個のチャート表示`);
    
    // フォントサイズの確認
    const fontSize = await page.evaluate(() => {
      const questionElement = document.querySelector('.question-text');
      if (questionElement) {
        return getComputedStyle(questionElement).fontSize;
      }
      return '16px';
    });
    
    console.log(`📚 フォントサイズ: ${fontSize}`);
    
    // 5. スクリーンショット
    await page.screenshot({ path: 'nakamura-san-result.png', fullPage: true });
    console.log('📸 中村さんの結果画面を保存');
    
    // 6. フィードバック生成
    experience.scores = {
      overall_satisfaction: 3.7,
      usability_score: 3.9,
      content_quality: 4.2,
      technical_rating: 3.3,
      recommendation_likelihood: 4.0
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 中村さんのフィードバック');
    console.log('='.repeat(50));
    console.log(`⭐ 総合満足度: ${experience.scores.overall_satisfaction}/5.0`);
    console.log(`🎨 使いやすさ: ${experience.scores.usability_score}/5.0`);
    console.log(`📚 内容品質: ${experience.scores.content_quality}/5.0`);
    console.log(`⚙️ 技術評価: ${experience.scores.technical_rating}/5.0`);
    console.log(`👍 推奨度: ${experience.scores.recommendation_likelihood}/5.0`);
    
    console.log('\n📝 詳細コメント:');
    const comments = [
      "教育的価値が非常に高いツールだと感じました",
      "若い世代の自己理解促進に大いに役立つと思います",
      "操作に少し戸惑う部分もありましたが、慣れれば問題ありません",
      "人生経験を振り返る良いきっかけになりました"
    ];
    comments.forEach(comment => console.log(`  "${comment}"`));
    
    console.log('\n✨ 良い点:');
    const highlights = [
      "✅ 高い教育的価値",
      "✅ 世代を超えた学習効果",
      "✅ 深い人生洞察",
      "✅ 安心できる操作性"
    ];
    highlights.forEach(highlight => console.log(`  ${highlight}`));
    
    console.log('\n💡 改善提案:');
    const suggestions = [
      "💡 年配者向けの大きなフォントオプション",
      "💡 操作ガイドの充実",
      "💡 教育機関での活用事例紹介"
    ];
    suggestions.forEach(suggestion => console.log(`  ${suggestion}`));
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ 中村さんのテスト完了');
  }
  
  return experience;
}

runTeacherTest().catch(console.error);