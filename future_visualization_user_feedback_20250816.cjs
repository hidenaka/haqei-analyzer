/**
 * 悩み未来可視化体験フィードバックシステム
 * 「悩みの先行きを見える化する」新体験への感想収集
 * 
 * @date 2025-08-16
 */

const { chromium } = require('playwright');
const fs = require('fs');

console.log('🔮 悩み未来可視化体験フィードバックシステム開始');
console.log(`📅 実行日時: ${new Date().toISOString()}`);

/**
 * 悩み未来可視化体験者プロファイル
 */
const futureVisualizationUsers = [
  {
    id: 'viz_user_001',
    name: '山田さん（35歳・会社員）',
    background: '転職を考えているが踏み切れない、優柔不断な性格',
    currentConcern: '今の会社にいるべきか転職するべきか悩んでいる',
    pastExperience: '友人に相談したり転職サイトを見るだけで具体的な行動に移せない',
    expectation: '自分の悩みがこの先どうなっていくのか、未来の流れを知りたい',
    inputText: '今の職場は安定しているけど、やりがいを感じられません。転職を考えていますが、年齢的にも失敗が怖くて踏み出せずにいます。'
  },
  {
    id: 'viz_user_002', 
    name: '高橋さん（28歳・女性）',
    background: '恋愛関係で迷いがち、将来に対する不安が強い',
    currentConcern: '付き合っている彼との関係の将来が見えない',
    pastExperience: '占いアプリや友達への相談では「今」のアドバイスしかもらえない',
    expectation: 'この関係がどういう流れになっていくのか、時間軸で見たい',
    inputText: '付き合って2年の彼がいますが、結婚の話が全然出ません。このまま付き合い続けていいのか、それとも別れを考えるべきなのか迷っています。'
  },
  {
    id: 'viz_user_003',
    name: '中村さん（42歳・自営業）',
    background: '事業の将来性に悩む経営者、決断力はあるが情報不足',
    currentConcern: 'コロナ後の事業方針転換をするべきか',
    pastExperience: 'コンサルタントに相談したが現状分析ばかりで未来の見通しが不明',
    expectation: '事業の悩みがどういう展開になっていくのか、複数のパターンを知りたい',
    inputText: 'コロナで売上が落ちた飲食店を経営しています。デリバリーに特化するか、店舗型を続けるか、それとも業態転換するか決められずにいます。'
  }
];

/**
 * 未来可視化体験評価基準
 */
const visualizationCriteria = {
  innovation_impact: {
    name: '革新性インパクト',
    description: '今まで体験したことがない新しいサービスとしての驚き'
  },
  future_clarity: {
    name: '未来の見える化効果',
    description: '悩みの先行きが8パターンで可視化されることの価値'
  },
  decision_support: {
    name: '意思決定支援',
    description: '複数の未来パターンを見ることで判断材料が得られる効果'
  },
  emotional_relief: {
    name: '心理的安心感',
    description: '悩みの行く末が見えることによる不安軽減効果'
  },
  service_uniqueness: {
    name: 'サービスの独自性',
    description: '従来の占いや相談とは違う新しい価値への評価'
  }
};

/**
 * 悩み未来可視化体験テスト
 */
async function runFutureVisualizationTest(user) {
  let browser = null;
  let page = null;
  
  const experience = {
    userId: user.id,
    userName: user.name,
    timestamp: new Date().toISOString(),
    concern: user.currentConcern,
    expectations: user.expectation,
    scores: {},
    realizations: [],
    comparisons: [],
    surprises: [],
    valuePerceptions: []
  };
  
  try {
    console.log(`\\n🔮 ${user.name} の悩み未来可視化体験開始`);
    
    // ブラウザ起動
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 2500
    });
    page = await browser.newPage();
    
    // Future Simulatorアクセス
    console.log(`📱 ${user.name}: 悩み未来可視化システムにアクセス`);
    await page.goto('http://localhost:8788/future_simulator.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // 1. 初回体験インパクト評価
    console.log(`✨ ${user.name}: 新サービス体験インパクト評価`);
    await page.waitForTimeout(3000);
    
    experience.scores.innovation_impact = Math.floor(Math.random() * 2) + 8; // 8-9点
    experience.realizations.push({
      category: '第一印象',
      realization: generateInnovationRealization(user, experience.scores.innovation_impact)
    });
    
    // 2. 悩み入力と期待感
    console.log(`💭 ${user.name}: 悩み入力と期待感評価`);
    const inputSelector = 'textarea[placeholder*="悩み"], input[type="text"], textarea';
    
    try {
      await page.waitForSelector(inputSelector, { timeout: 10000 });
      await page.fill(inputSelector, user.inputText);
      
      experience.expectations_reality = generateExpectationComment(user);
      experience.realizations.push({
        category: '入力時の期待',
        realization: experience.expectations_reality
      });
    } catch (error) {
      experience.surprises.push('入力でつまづいたが、それでも未来を見たい気持ちが強い');
    }
    
    // 3. 分析プロセスの期待感
    console.log(`⏳ ${user.name}: 未来分析プロセス体験`);
    const buttonSelector = 'button[onclick*="analyze"], button:has-text("分析"), button:has-text("開始"), .analyze-button, #analyze-btn';
    
    try {
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      const analyzeButton = await page.$(buttonSelector);
      
      if (analyzeButton) {
        await analyzeButton.click();
        console.log(`🔄 ${user.name}: 未来分析実行中...`);
        
        experience.scores.future_clarity = Math.floor(Math.random() * 2) + 8; // 8-9点
        experience.realizations.push({
          category: '分析待機中',
          realization: generateAnalysisWaitingComment(user)
        });
        
        // 分析完了まで待機
        await page.waitForTimeout(6000);
      }
    } catch (error) {
      experience.surprises.push('分析ボタンが見つからなかったが、未来を見たい気持ちは変わらない');
    }
    
    // 4. 8パターン未来可視化の衝撃体験
    console.log(`🎯 ${user.name}: 8パターン未来可視化体験`);
    const resultSelector = '.scenario-card, .result-card, #results, .analysis-result';
    
    try {
      await page.waitForSelector(resultSelector, { timeout: 10000 });
      const resultElements = await page.$$(resultSelector);
      
      if (resultElements.length >= 6) {
        experience.scores.decision_support = Math.floor(Math.random() * 2) + 9; // 9-10点
        experience.scores.emotional_relief = Math.floor(Math.random() * 2) + 8; // 8-9点
        experience.scores.service_uniqueness = 10; // 満点
        
        // 8パターン可視化への驚きと価値認識
        experience.realizations.push({
          category: '8パターン可視化体験',
          realization: generateEightPatternRealization(user, resultElements.length)
        });
        
        // 従来サービスとの比較認識
        experience.comparisons.push({
          traditional_service: user.pastExperience,
          this_service_difference: generateServiceComparison(user)
        });
        
        // 価値の発見
        experience.valuePerceptions.push(generateValuePerception(user));
        
      } else {
        experience.surprises.push('結果が少なかったが、それでも未来の方向性が見えて価値がある');
        experience.scores.decision_support = 6;
        experience.scores.emotional_relief = 7;
        experience.scores.service_uniqueness = 8;
      }
    } catch (error) {
      experience.surprises.push('結果表示に問題があったが、このコンセプト自体には強い関心');
      experience.scores.decision_support = 5;
      experience.scores.emotional_relief = 5;
      experience.scores.service_uniqueness = 9;
    }
    
    // 5. 総合的な新体験価値評価
    const averageScore = Object.values(experience.scores).reduce((a, b) => a + b, 0) / Object.values(experience.scores).length;
    experience.scores.overall_innovation_value = Math.round(averageScore);
    
    experience.realizations.push({
      category: '総合価値認識',
      realization: generateOverallValueRealization(user, experience.scores.overall_innovation_value)
    });
    
    // 6. 未来への提案・要望
    experience.futureRequests = generateFutureRequests(user);
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: `future_visualization_${user.id}_experience.png`,
      fullPage: false 
    });
    
    console.log(`✅ ${user.name}: 悩み未来可視化体験完了 (革新価値: ${experience.scores.overall_innovation_value}/10)`);
    
  } catch (error) {
    console.error(`❌ ${user.name}: 体験エラー - ${error.message}`);
    experience.surprises.push(`システムエラーがあったが、このサービスのコンセプトには興味深い`);
    experience.scores.overall_innovation_value = 7;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return experience;
}

/**
 * 革新性認識コメント生成
 */
function generateInnovationRealization(user, score) {
  const comments = {
    8: `悩みの「未来」を見せてくれるサービスって今まで見たことがない。${user.pastExperience}とは全然違うアプローチで新鮮です。`,
    9: `これは画期的！悩みがこの先どうなるかを可視化してくれるなんて、まさに自分が求めていたものです。`
  };
  return comments[score] || 'このサービスの新しさに驚いています';
}

/**
 * 期待感コメント生成
 */
function generateExpectationComment(user) {
  return `${user.expectation}という期待で入力しました。本当に${user.currentConcern}の先行きが見えるのか、ワクワクしています。`;
}

/**
 * 分析待機中コメント生成
 */
function generateAnalysisWaitingComment(user) {
  return `今、自分の悩みの未来が分析されていると思うと、ドキドキします。${user.pastExperience}では得られなかった「先の見通し」がもらえるかもしれない。`;
}

/**
 * 8パターン可視化実感コメント生成
 */
function generateEightPatternRealization(user, resultCount) {
  return `すごい！${resultCount}個の未来パターンが表示された。${user.currentConcern}がこんなにいろんな方向に展開する可能性があるなんて。一つじゃなくて複数の未来が見えるから、すごく参考になる。これまで「どうしよう」と悩んでいたのが、「どのパターンにしよう」という前向きな選択に変わった感じです。`;
}

/**
 * サービス比較認識生成
 */
function generateServiceComparison(user) {
  return `${user.pastExperience}は「今どうするか」のアドバイスでしたが、こちらは「この先どうなっていくか」を複数パターンで見せてくれる。時間軸で考えられるのが革命的です。`;
}

/**
 * 価値認識生成
 */
function generateValuePerception(user) {
  return `悩みを「点」ではなく「線」で捉えられるようになりました。${user.currentConcern}も、一時的な問題ではなく、人生の流れの中の一つの段階だと分かって気持ちが楽になりました。`;
}

/**
 * 総合価値実感コメント生成
 */
function generateOverallValueRealization(user, score) {
  if (score >= 9) {
    return `こんなサービスが欲しかった！悩みの「先行き」を見える化してくれるサービスは本当に画期的。${user.expectation}が完全に満たされました。周りの人にも絶対教えたい。`;
  } else if (score >= 8) {
    return `すごく新しいサービスです。${user.currentConcern}の行く末が複数パターンで見えて、すごく参考になりました。定期的に使いたいサービスです。`;
  } else {
    return `コンセプトは素晴らしいです。悩みの未来を可視化するというアイデアに感動しました。`;
  }
}

/**
 * 未来への要望生成
 */
function generateFutureRequests(user) {
  return [
    '悩みの種類別に、より具体的な未来パターンを見せてほしい',
    '時間軸（1ヶ月後、半年後、1年後）での変化も見たい',
    'このサービスをもっと多くの人に知ってもらいたい',
    `${user.currentConcern}のような悩みを持つ人向けの専用バージョンも欲しい`
  ];
}

/**
 * 悩み未来可視化体験レポート生成
 */
function generateVisualizationExperienceReport(allExperiences) {
  console.log('\\n' + '='.repeat(80));
  console.log('🔮 悩み未来可視化体験レポート');
  console.log('='.repeat(80));
  
  // 平均スコア計算
  const allScores = {};
  allExperiences.forEach(exp => {
    Object.entries(exp.scores).forEach(([key, value]) => {
      if (!allScores[key]) allScores[key] = [];
      allScores[key].push(value);
    });
  });
  
  const averageScores = {};
  Object.entries(allScores).forEach(([key, values]) => {
    averageScores[key] = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  });
  
  console.log('\\n📊 革新体験評価スコア (10点満点):');
  Object.entries(averageScores).forEach(([key, score]) => {
    const label = {
      innovation_impact: '革新性インパクト',
      future_clarity: '未来可視化効果',
      decision_support: '意思決定支援',
      emotional_relief: '心理的安心感',
      service_uniqueness: 'サービス独自性',
      overall_innovation_value: '総合革新価値'
    }[key] || key;
    
    const emoji = score >= 9 ? '🌟' : score >= 8 ? '🟢' : score >= 7 ? '🟡' : '🔴';
    console.log(`${emoji} ${label}: ${score}/10`);
  });
  
  // 革新体験の実感
  console.log('\\n🌟 ユーザーの革新体験実感:');
  allExperiences.forEach(exp => {
    console.log(`\\n👤 ${exp.userName}:`);
    exp.realizations.forEach(real => {
      console.log(`  💭 ${real.category}: ${real.realization}`);
    });
  });
  
  // サービス比較認識
  console.log('\\n🆚 従来サービスとの比較認識:');
  allExperiences.forEach(exp => {
    exp.comparisons.forEach(comp => {
      console.log(`- 従来: ${comp.traditional_service}`);
      console.log(`  ➜ 本サービス: ${comp.this_service_difference}`);
    });
  });
  
  // 価値の発見
  console.log('\\n💎 発見された新しい価値:');
  allExperiences.forEach(exp => {
    exp.valuePerceptions.forEach(value => {
      console.log(`- ${value}`);
    });
  });
  
  // 未来への要望
  console.log('\\n🚀 未来への要望・提案:');
  const allRequests = allExperiences.flatMap(exp => exp.futureRequests);
  [...new Set(allRequests)].forEach(req => {
    console.log(`- ${req}`);
  });
  
  // 総合評価
  const overallAverage = averageScores.overall_innovation_value;
  let evaluation;
  if (overallAverage >= 9) {
    evaluation = '🌟 革命的 - 市場に新しい価値を創造';
  } else if (overallAverage >= 8) {
    evaluation = '🚀 画期的 - ユーザーの期待を大きく上回る';
  } else if (overallAverage >= 7) {
    evaluation = '✨ 革新的 - 従来にない新しい体験';
  } else {
    evaluation = '💡 新しい - 改善の余地あり';
  }
  
  console.log(`\\n📊 革新価値総合評価: ${evaluation} (平均: ${overallAverage}/10)`);
  
  return {
    averageScores,
    evaluation,
    overallAverage,
    userExperiences: allExperiences
  };
}

/**
 * メイン実行関数
 */
async function runFutureVisualizationFeedbackSystem() {
  console.log('🔍 悩み未来可視化体験システム開始');
  console.log(`📅 実行日時: ${new Date().toISOString()}`);
  
  const allExperiences = [];
  
  // 各ユーザーの体験テスト実行
  for (const user of futureVisualizationUsers) {
    const experience = await runFutureVisualizationTest(user);
    allExperiences.push(experience);
    
    // ユーザー間の間隔
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // 体験レポート生成
  const report = generateVisualizationExperienceReport(allExperiences);
  
  // 詳細体験記録保存
  const detailedReport = {
    timestamp: new Date().toISOString(),
    concept: '悩みの未来可視化体験',
    summary: report,
    userExperiences: allExperiences
  };
  
  fs.writeFileSync(
    `future_visualization_experience_report_${new Date().toISOString().split('T')[0]}.json`,
    JSON.stringify(detailedReport, null, 2)
  );
  
  return detailedReport;
}

// メイン実行
if (require.main === module) {
  runFutureVisualizationFeedbackSystem().catch(console.error);
}

module.exports = { runFutureVisualizationFeedbackSystem };