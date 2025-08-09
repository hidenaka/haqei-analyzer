/**
 * 厳しめ仮想ユーザー実体験テスト - 3名の批判的視点ユーザー
 * より厳格な評価基準でシステムの限界を探る
 */

import { chromium } from 'playwright';

// 3名の厳しめ仮想ユーザープロファイル
const criticalUsers = [
  {
    id: 6,
    name: "佐々木 厳",
    age: 55,
    occupation: "元大手コンサルティング会社シニアパートナー",
    background: "外資系コンサル歴30年。数百のプロジェクトを手がけ、品質に対して妥協を許さない。",
    personality: {
      openness: 0.3,
      patience: 0.4,
      techSavvy: 0.6,
      philosophicalInterest: 0.2,
      criticalThinking: 0.95,
      perfectionism: 0.9
    },
    answering_pattern: "analytical", // 分析的に選択
    evaluation_focus: ["ROI", "実用性", "競合比較", "ビジネス価値"],
    expectations: "既存ソリューションを明確に上回る価値提供",
    critical_areas: [
      "30問は長すぎる - 時間効率が悪い",
      "結果の科学的根拠が不明確",
      "MBTIとの差別化が不十分",
      "ビジネス適用の具体的方法論が欠如"
    ]
  },
  {
    id: 7,
    name: "山田 理恵",
    age: 38,
    occupation: "UX研究者・心理学博士",
    background: "認知心理学専門。ユーザビリティ研究歴15年。学術的厳密性を重視。",
    personality: {
      openness: 0.7,
      patience: 0.6,
      techSavvy: 0.8,
      philosophicalInterest: 0.4,
      criticalThinking: 0.9,
      scientificRigor: 0.95
    },
    answering_pattern: "scientific", // 科学的根拠で選択
    evaluation_focus: ["信頼性", "妥当性", "統計的根拠", "UX設計"],
    expectations: "学術的に検証された測定ツール",
    critical_areas: [
      "質問設計の心理測定学的妥当性が不明",
      "結果の再現性が担保されていない",
      "統計的サンプルサイズが不足",
      "認知バイアスへの配慮が不十分"
    ]
  },
  {
    id: 8,
    name: "井上 健太",
    age: 29,
    occupation: "テックスタートアップCTO",
    background: "シリコンバレー勤務経験。最新技術トレンドに精通。完璧主義者。",
    personality: {
      openness: 0.8,
      patience: 0.2,
      techSavvy: 0.98,
      philosophicalInterest: 0.1,
      criticalThinking: 0.9,
      innovationOriented: 0.95
    },
    answering_pattern: "disruptive", // 破壊的視点で選択
    evaluation_focus: ["技術革新性", "スケーラビリティ", "競争優位性", "実装品質"],
    expectations: "既存の枠を超えた革新的技術体験",
    critical_areas: [
      "AIやMLの活用が表面的",
      "リアルタイムパーソナライゼーション不足",
      "API連携・拡張性が限定的",
      "デジタルネイティブ世代への訴求力不足"
    ]
  }
];

/**
 * 厳しめユーザーの個別体験テスト
 */
async function runCriticalUserTest(user) {
  console.log(`🔍 ${user.name}さん（${user.age}歳・${user.occupation}）の厳しめ評価開始`);
  console.log(`📋 期待水準: ${user.expectations}`);
  console.log(`⚠️ 予想される批判点: ${user.critical_areas.length}項目\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 150
  });
  
  const page = await browser.newPage();
  const experience = {
    user: user,
    startTime: Date.now(),
    criticalObservations: [],
    positivePoints: [],
    majorConcerns: [],
    scores: {},
    completion: false,
    dropOffPoint: null
  };
  
  try {
    // 1. 初期アクセス（批判的視点）
    console.log('🌐 システムアクセス - 第一印象評価...');
    await page.goto('http://localhost:8090/os_analyzer.html', { waitUntil: 'networkidle' });
    
    // ロード時間測定
    const loadTime = await page.evaluate(() => performance.timing.loadEventEnd - performance.timing.navigationStart);
    if (loadTime > 2000) {
      experience.criticalObservations.push(`ページロード時間${loadTime}ms - 現代基準では遅い`);
    }
    
    // 第一印象（職業別批判的視点）
    switch(user.occupation) {
      case "元大手コンサルティング会社シニアパートナー":
        experience.criticalObservations.push("価値提案が不明確。ROIが見えない");
        experience.criticalObservations.push("競合優位性の説明が不十分");
        break;
      case "UX研究者・心理学博士":
        experience.criticalObservations.push("測定理論の科学的根拠が提示されていない");
        experience.criticalObservations.push("サンプルサイズや信頼性係数の記載なし");
        break;
      case "テックスタートアップCTO":
        experience.criticalObservations.push("技術的イノベーションが感じられない");
        experience.criticalObservations.push("AIやMLの活用レベルが2020年代基準では低い");
        break;
    }
    
    // 2. 開始プロセスの評価
    console.log('🎯 診断開始プロセス評価...');
    const startButton = await page.$('.start-button');
    if (startButton) {
      await startButton.click();
    } else {
      experience.majorConcerns.push("開始ボタンが不明確 - UX設計に問題");
      throw new Error('開始フローに問題');
    }
    
    // 3. 質問フローの厳しい評価
    console.log('📋 30問質問フローの批判的分析...');
    let questionCount = 0;
    let qualityIssues = 0;
    
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(300);
      
      const questionText = await page.$eval('.question-text', el => el.textContent).catch(() => null);
      if (!questionText) {
        experience.majorConcerns.push(`質問${i + 1}で技術的問題発生`);
        break;
      }
      
      // 質問品質の厳しいチェック
      if (questionText.length < 20) {
        qualityIssues++;
        experience.criticalObservations.push(`質問${i + 1}: 質問が短すぎ、測定精度に疑問`);
      }
      
      if (questionText.includes('あなた') && !questionText.includes('具体的')) {
        qualityIssues++;
      }
      
      // 批判的ユーザーの回答パターン
      const options = await page.$$('.option');
      if (options.length === 0) break;
      
      let selectedIndex;
      switch(user.answering_pattern) {
        case "analytical":
          // 分析的 - 中間を避けて極端な選択
          selectedIndex = Math.random() < 0.5 ? 0 : options.length - 1;
          break;
        case "scientific":
          // 科学的 - 一貫性を保つ選択
          selectedIndex = i % 3; // 一定のパターン
          break;
        case "disruptive":
          // 破壊的 - 予期しない選択
          selectedIndex = Math.floor(Math.random() * options.length);
          break;
        default:
          selectedIndex = Math.floor(options.length / 2);
      }
      
      await options[selectedIndex].click();
      
      const nextButton = await page.$('#next-btn, button:has-text("次へ")');
      if (nextButton) await nextButton.click();
      
      questionCount++;
      
      // 途中離脱の可能性（批判的ユーザーの特徴）
      if (i === 15 && qualityIssues > 3) {
        experience.criticalObservations.push("質問品質が低いため途中離脱を検討");
        // 実際には離脱せず継続（テストのため）
      }
    }
    
    experience.completion = (questionCount === 30);
    
    if (qualityIssues > 5) {
      experience.majorConcerns.push(`質問品質に${qualityIssues}個の問題を発見`);
    }
    
    // 4. 結果の厳しい評価
    console.log('📊 結果分析 - 批判的評価...');
    await page.waitForTimeout(3000);
    
    const osCards = await page.$$('.os-card');
    const charts = await page.$$('canvas');
    
    // 結果の科学的妥当性チェック
    if (osCards.length >= 3) {
      const cardTexts = [];
      for (let i = 0; i < Math.min(3, osCards.length); i++) {
        const cardText = await osCards[i].textContent();
        cardTexts.push(cardText);
      }
      
      const allText = cardTexts.join(' ');
      
      // 厳しいチェック項目
      if (!allText.includes('信頼度') && !allText.includes('精度')) {
        experience.majorConcerns.push("結果の信頼度・精度が表示されていない");
      }
      
      if (allText.length < 300) {
        experience.criticalObservations.push("結果の情報量が不十分");
      }
      
      if (!allText.includes('改善') && !allText.includes('行動')) {
        experience.criticalObservations.push("実行可能な改善提案が不足");
      }
      
    } else {
      experience.majorConcerns.push("Triple OS結果が不完全");
    }
    
    // チャート評価
    if (charts.length < 2) {
      experience.criticalObservations.push("データ可視化が不十分");
    }
    
    // 5. スクリーンショット保存
    await page.screenshot({ 
      path: `critical-user-${user.id}-result.png`, 
      fullPage: true 
    });
    console.log(`📸 ${user.name}さんの結果画面を保存`);
    
    // 6. 厳しい最終評価
    experience.scores = generateCriticalScores(user, experience);
    
  } catch (error) {
    experience.majorConcerns.push(`システムエラー: ${error.message}`);
    experience.dropOffPoint = questionCount;
  } finally {
    await browser.close();
    experience.endTime = Date.now();
    experience.duration = experience.endTime - experience.startTime;
  }
  
  return experience;
}

/**
 * 厳しい評価スコア生成
 */
function generateCriticalScores(user, experience) {
  let baseScore = 2.5; // 厳しめの基準点
  
  // 職業別の厳しさ調整
  switch(user.occupation) {
    case "元大手コンサルティング会社シニアパートナー":
      baseScore = 2.0; // 最も厳しい
      break;
    case "UX研究者・心理学博士":
      baseScore = 2.2; // 科学的厳密性
      break;
    case "テックスタートアップCTO":
      baseScore = 2.3; // 技術革新性
      break;
  }
  
  // 重大な問題がある場合はさらに減点
  const majorIssues = experience.majorConcerns.length;
  const minorIssues = experience.criticalObservations.length;
  
  const overallPenalty = (majorIssues * 0.5) + (minorIssues * 0.1);
  
  return {
    overall_satisfaction: Math.max(1.0, baseScore - overallPenalty),
    usability_score: Math.max(1.0, baseScore - overallPenalty + 0.3),
    content_quality: Math.max(1.0, baseScore - overallPenalty - 0.2),
    technical_rating: Math.max(1.0, baseScore - overallPenalty + 0.1),
    recommendation_likelihood: Math.max(1.0, baseScore - overallPenalty - 0.3),
    scientific_validity: Math.max(1.0, baseScore - overallPenalty - 0.4),
    business_value: Math.max(1.0, baseScore - overallPenalty - 0.1)
  };
}

/**
 * 全厳しめユーザーのテスト実行
 */
async function runAllCriticalTests() {
  console.log('🔥 厳しめ仮想ユーザー3名による批判的評価開始\n');
  console.log('⚠️ 注意: このテストは意図的に厳しい基準で評価を行います\n');
  
  const allExperiences = [];
  
  for (const user of criticalUsers) {
    console.log(`${'='.repeat(60)}`);
    const experience = await runCriticalUserTest(user);
    allExperiences.push(experience);
    
    // 個別結果表示
    console.log(`\n📊 ${user.name}さんの厳しめ評価結果`);
    console.log(`⭐ 総合満足度: ${experience.scores.overall_satisfaction.toFixed(1)}/5.0`);
    console.log(`🎨 使いやすさ: ${experience.scores.usability_score.toFixed(1)}/5.0`);
    console.log(`📚 内容品質: ${experience.scores.content_quality.toFixed(1)}/5.0`);
    console.log(`⚙️ 技術評価: ${experience.scores.technical_rating.toFixed(1)}/5.0`);
    console.log(`👍 推奨度: ${experience.scores.recommendation_likelihood.toFixed(1)}/5.0`);
    
    if (experience.majorConcerns.length > 0) {
      console.log(`\n🚨 重大な懸念 (${experience.majorConcerns.length}件):`);
      experience.majorConcerns.forEach(concern => console.log(`  ❌ ${concern}`));
    }
    
    if (experience.criticalObservations.length > 0) {
      console.log(`\n⚠️ 批判的観察 (${experience.criticalObservations.length}件):`);
      experience.criticalObservations.slice(0, 5).forEach(obs => console.log(`  📍 ${obs}`));
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // 厳しめ評価の統合分析
  generateCriticalReport(allExperiences);
  
  return allExperiences;
}

/**
 * 厳しめ評価の統合レポート
 */
function generateCriticalReport(experiences) {
  console.log(`\n\n${'🔥'.repeat(20)}`);
  console.log('📊 厳しめ評価統合分析レポート');
  console.log(`${'🔥'.repeat(20)}\n`);
  
  // 平均スコア計算（完了したユーザーのみ）
  const completedUsers = experiences.filter(exp => exp.completion);
  const avgScores = {
    overall_satisfaction: 0,
    usability_score: 0,
    content_quality: 0,
    technical_rating: 0,
    recommendation_likelihood: 0
  };
  
  completedUsers.forEach(exp => {
    avgScores.overall_satisfaction += exp.scores.overall_satisfaction;
    avgScores.usability_score += exp.scores.usability_score;
    avgScores.content_quality += exp.scores.content_quality;
    avgScores.technical_rating += exp.scores.technical_rating;
    avgScores.recommendation_likelihood += exp.scores.recommendation_likelihood;
  });
  
  Object.keys(avgScores).forEach(key => {
    avgScores[key] = (avgScores[key] / completedUsers.length).toFixed(1);
  });
  
  console.log(`📈 厳しめ評価平均スコア (${completedUsers.length}名):`);
  console.log(`  ⭐ 総合満足度: ${avgScores.overall_satisfaction}/5.0`);
  console.log(`  🎨 使いやすさ: ${avgScores.usability_score}/5.0`);
  console.log(`  📚 内容品質: ${avgScores.content_quality}/5.0`);
  console.log(`  ⚙️ 技術評価: ${avgScores.technical_rating}/5.0`);
  console.log(`  👍 推奨度: ${avgScores.recommendation_likelihood}/5.0`);
  
  // 共通の重大懸念
  const allConcerns = experiences.flatMap(exp => exp.majorConcerns);
  const concernCounts = {};
  allConcerns.forEach(concern => {
    concernCounts[concern] = (concernCounts[concern] || 0) + 1;
  });
  
  console.log(`\n🚨 共通して指摘された重大懸念:`);
  Object.entries(concernCounts)
    .filter(([concern, count]) => count > 1)
    .forEach(([concern, count]) => console.log(`  ❌ ${concern} (${count}名が指摘)`));
  
  // 最終判定
  const overallScore = parseFloat(avgScores.overall_satisfaction);
  console.log(`\n🏆 厳しめ評価総合判定:`);
  if (overallScore >= 3.5) {
    console.log(`✅ 合格 (${overallScore}/5.0) - 厳しい基準でも一定水準をクリア`);
  } else if (overallScore >= 2.5) {
    console.log(`⚠️ 要改善 (${overallScore}/5.0) - 重要な改善点が存在`);
  } else {
    console.log(`❌ 不合格 (${overallScore}/5.0) - 根本的な見直しが必要`);
  }
  
  console.log(`\n✅ 厳しめユーザー評価完了`);
  console.log(`📅 ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST`);
}

// 実行
runAllCriticalTests().catch(console.error);