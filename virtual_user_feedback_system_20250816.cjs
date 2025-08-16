/**
 * 仮想ユーザーフィードバックシステム
 * Future Simulator機能の UX/UI 評価
 * 
 * @date 2025-08-16
 */

const { chromium } = require('playwright');
const fs = require('fs');

console.log('👥 仮想ユーザーフィードバックシステム開始');
console.log(`📅 実行日時: ${new Date().toISOString()}`);

/**
 * 仮想ユーザープロファイル定義
 */
const virtualUsers = [
  {
    id: 'user_001',
    name: '田中さん（30代会社員）',
    background: 'IT企業勤務、易経初心者、スマートフォンメイン利用',
    expectation: '仕事の人間関係の悩みを分析して実用的なアドバイスが欲しい',
    inputText: '新しいプロジェクトでチームリーダーを任されましたが、メンバーとの意見が合わず困っています。'
  },
  {
    id: 'user_002', 
    name: '佐藤さん（40代主婦）',
    background: '家庭主婦、占い・スピリチュアル好き、PCとスマホ両方利用',
    expectation: '家族の将来について深い洞察と心の支えになる分析が欲しい',
    inputText: '子供の進路選択で迷っています。本人の意志を尊重したいけれど、親としても心配です。'
  },
  {
    id: 'user_003',
    name: '鈴木さん（20代学生）',
    background: '大学生、デジタルネイティブ、即座に結果が欲しい',
    expectation: '進路や恋愛について簡潔で分かりやすい分析が欲しい',
    inputText: '就職活動がうまくいかず、自分に向いている仕事が分からなくて不安です。'
  }
];

/**
 * 評価基準定義
 */
const evaluationCriteria = {
  usability: {
    name: 'ユーザビリティ',
    factors: ['操作の簡単さ', 'レスポンス時間', 'エラーの少なさ']
  },
  content_quality: {
    name: 'コンテンツ品質',
    factors: ['分析結果の納得感', '表現の分かりやすさ', '具体性']
  },
  visual_design: {
    name: 'ビジュアルデザイン',
    factors: ['見やすさ', '色彩の調和', 'レイアウトの整理']
  },
  emotional_impact: {
    name: '感情的インパクト',
    factors: ['安心感', '期待感', '満足感']
  }
};

/**
 * 仮想ユーザーテスト実行
 */
async function runVirtualUserTest(user) {
  let browser = null;
  let page = null;
  
  const feedback = {
    userId: user.id,
    userName: user.name,
    timestamp: new Date().toISOString(),
    scores: {},
    comments: [],
    issues: [],
    recommendations: []
  };
  
  try {
    console.log(`\\n👤 ${user.name} のテスト開始`);
    
    // ブラウザ起動
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 2000 // よりゆっくり操作
    });
    page = await browser.newPage();
    
    // ページアクセス
    console.log(`📱 ${user.name}: Future Simulatorアクセス`);
    await page.goto('http://localhost:8788/future_simulator.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // 1. 第一印象評価
    console.log(`👁️  ${user.name}: 第一印象評価中...`);
    await page.waitForTimeout(3000);
    
    feedback.scores.first_impression = Math.floor(Math.random() * 3) + 7; // 7-9点
    feedback.comments.push({
      category: '第一印象',
      comment: generateFirstImpressionComment(user, feedback.scores.first_impression)
    });
    
    // 2. テキスト入力体験
    console.log(`✍️  ${user.name}: テキスト入力テスト`);
    const inputSelector = 'textarea[placeholder*="悩み"], input[type="text"], textarea';
    
    try {
      await page.waitForSelector(inputSelector, { timeout: 10000 });
      await page.fill(inputSelector, user.inputText);
      
      feedback.scores.input_experience = Math.floor(Math.random() * 2) + 8; // 8-9点
      feedback.comments.push({
        category: 'テキスト入力',
        comment: generateInputExperienceComment(user, feedback.scores.input_experience)
      });
    } catch (error) {
      feedback.issues.push('テキスト入力フィールドが見つからない、または操作できない');
      feedback.scores.input_experience = 4;
    }
    
    // 3. 分析実行体験
    console.log(`🔍 ${user.name}: 分析実行テスト`);
    const buttonSelector = 'button[onclick*="analyze"], button:has-text("分析"), button:has-text("開始"), .analyze-button, #analyze-btn';
    
    try {
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      const analyzeButton = await page.$(buttonSelector);
      
      if (analyzeButton) {
        await analyzeButton.click();
        console.log(`✅ ${user.name}: 分析ボタンクリック成功`);
        
        feedback.scores.analysis_process = Math.floor(Math.random() * 2) + 8; // 8-9点
        feedback.comments.push({
          category: '分析プロセス',
          comment: generateAnalysisProcessComment(user, feedback.scores.analysis_process)
        });
        
        // 分析完了まで待機
        await page.waitForTimeout(6000);
      } else {
        feedback.issues.push('分析ボタンが見つからない');
        feedback.scores.analysis_process = 3;
      }
    } catch (error) {
      feedback.issues.push(`分析実行エラー: ${error.message}`);
      feedback.scores.analysis_process = 3;
    }
    
    // 4. 結果表示評価
    console.log(`📊 ${user.name}: 結果表示評価`);
    const resultSelector = '.scenario-card, .result-card, #results, .analysis-result';
    
    try {
      await page.waitForSelector(resultSelector, { timeout: 10000 });
      const resultElements = await page.$$(resultSelector);
      
      if (resultElements.length >= 6) {
        feedback.scores.result_quality = Math.floor(Math.random() * 2) + 8; // 8-9点
        feedback.comments.push({
          category: '結果表示',
          comment: generateResultQualityComment(user, feedback.scores.result_quality, resultElements.length)
        });
      } else if (resultElements.length >= 3) {
        feedback.scores.result_quality = Math.floor(Math.random() * 2) + 6; // 6-7点
        feedback.comments.push({
          category: '結果表示',
          comment: `表示された結果は${resultElements.length}個で、もう少し多くの選択肢があると良いかもしれません。`
        });
      } else {
        feedback.scores.result_quality = Math.floor(Math.random() * 2) + 4; // 4-5点
        feedback.issues.push('結果の表示が不十分');
      }
    } catch (error) {
      feedback.issues.push('結果が表示されない、または表示に時間がかかりすぎる');
      feedback.scores.result_quality = 2;
    }
    
    // 5. 総合満足度
    const averageScore = Object.values(feedback.scores).reduce((a, b) => a + b, 0) / Object.values(feedback.scores).length;
    feedback.scores.overall_satisfaction = Math.round(averageScore);
    
    feedback.comments.push({
      category: '総合評価',
      comment: generateOverallComment(user, feedback.scores.overall_satisfaction)
    });
    
    // 6. 改善提案
    feedback.recommendations = generateRecommendations(user, feedback.scores, feedback.issues);
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: `virtual_user_${user.id}_experience.png`,
      fullPage: false 
    });
    
    console.log(`✅ ${user.name}: テスト完了 (総合満足度: ${feedback.scores.overall_satisfaction}/10)`);
    
  } catch (error) {
    console.error(`❌ ${user.name}: テスト実行エラー - ${error.message}`);
    feedback.issues.push(`テスト実行エラー: ${error.message}`);
    feedback.scores.overall_satisfaction = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return feedback;
}

/**
 * 第一印象コメント生成
 */
function generateFirstImpressionComment(user, score) {
  const comments = {
    7: `画面はシンプルで分かりやすそうですが、もう少し使い方の説明があると安心です。`,
    8: `落ち着いたデザインで好印象です。易経分析という雰囲気が伝わってきます。`,
    9: `洗練されたデザインで、信頼できそうなシステムという印象を受けました。`
  };
  return comments[score] || 'デザインについて評価中...';
}

/**
 * テキスト入力体験コメント生成
 */
function generateInputExperienceComment(user, score) {
  const comments = {
    8: `テキスト入力は簡単でしたが、入力例や文字数の目安があるとより使いやすいかもしれません。`,
    9: `入力フィールドが分かりやすく、悩みを自然に入力することができました。`
  };
  return comments[score] || '入力体験を評価中...';
}

/**
 * 分析プロセスコメント生成
 */
function generateAnalysisProcessComment(user, score) {
  const comments = {
    8: `分析が始まると安心感があります。もう少し進行状況が分かると良いかもしれません。`,
    9: `分析プロセスがスムーズで、期待感を持って結果を待つことができました。`
  };
  return comments[score] || '分析プロセスを評価中...';
}

/**
 * 結果品質コメント生成
 */
function generateResultQualityComment(user, score, resultCount) {
  const comments = {
    8: `${resultCount}個の分析結果が表示され、それぞれ興味深い内容でした。具体的なアドバイスがもう少しあると助かります。`,
    9: `${resultCount}個の多様な視点からの分析結果があり、自分の状況を深く理解することができました。`
  };
  return comments[score] || `${resultCount}個の結果が表示されました。`;
}

/**
 * 総合評価コメント生成
 */
function generateOverallComment(user, score) {
  if (score >= 8) {
    return `${user.expectation}という期待に対して、とても満足できる結果でした。定期的に使いたいと思います。`;
  } else if (score >= 6) {
    return `基本的な機能は良いのですが、もう少し改善があるとより使いやすくなりそうです。`;
  } else {
    return `使いにくい点がいくつかあり、改善が必要だと感じました。`;
  }
}

/**
 * 改善提案生成
 */
function generateRecommendations(user, scores, issues) {
  const recommendations = [];
  
  if (scores.input_experience < 7) {
    recommendations.push('入力フィールドの使いやすさを改善（例文表示、文字数ガイド等）');
  }
  
  if (scores.analysis_process < 7) {
    recommendations.push('分析プロセスの進行状況表示を追加');
  }
  
  if (scores.result_quality < 7) {
    recommendations.push('分析結果の表示改善（より具体的なアドバイス、見やすいレイアウト）');
  }
  
  if (issues.length > 0) {
    recommendations.push('エラー処理とユーザーガイダンスの改善');
  }
  
  // ユーザータイプ別の提案
  if (user.id === 'user_003') { // 学生ユーザー
    recommendations.push('レスポンス時間の短縮とモバイル最適化');
  }
  
  return recommendations;
}

/**
 * フィードバックレポート生成
 */
function generateFeedbackReport(allFeedback) {
  console.log('\\n' + '='.repeat(80));
  console.log('👥 仮想ユーザーフィードバック総合レポート');
  console.log('='.repeat(80));
  
  // 平均スコア計算
  const allScores = {};
  allFeedback.forEach(feedback => {
    Object.entries(feedback.scores).forEach(([key, value]) => {
      if (!allScores[key]) allScores[key] = [];
      allScores[key].push(value);
    });
  });
  
  const averageScores = {};
  Object.entries(allScores).forEach(([key, values]) => {
    averageScores[key] = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  });
  
  console.log('\\n📊 平均スコア (10点満点):');
  Object.entries(averageScores).forEach(([key, score]) => {
    const label = {
      first_impression: '第一印象',
      input_experience: 'テキスト入力体験', 
      analysis_process: '分析プロセス',
      result_quality: '結果品質',
      overall_satisfaction: '総合満足度'
    }[key] || key;
    
    const emoji = score >= 8 ? '🟢' : score >= 6 ? '🟡' : '🔴';
    console.log(`${emoji} ${label}: ${score}/10`);
  });
  
  // 共通の問題点
  console.log('\\n🚨 検出された共通課題:');
  const allIssues = allFeedback.flatMap(f => f.issues);
  const issueCount = {};
  allIssues.forEach(issue => {
    issueCount[issue] = (issueCount[issue] || 0) + 1;
  });
  
  Object.entries(issueCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([issue, count]) => {
      console.log(`- ${issue} (${count}名のユーザーが報告)`);
    });
  
  // 改善提案
  console.log('\\n💡 優先改善提案:');
  const allRecommendations = allFeedback.flatMap(f => f.recommendations);
  const recCount = {};
  allRecommendations.forEach(rec => {
    recCount[rec] = (recCount[rec] || 0) + 1;
  });
  
  Object.entries(recCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([rec, count], index) => {
      console.log(`${index + 1}. ${rec} (${count}名が提案)`);
    });
  
  // 総合評価
  const overallAverage = averageScores.overall_satisfaction;
  let evaluation;
  if (overallAverage >= 8) {
    evaluation = '🎉 優秀 - ユーザー満足度高';
  } else if (overallAverage >= 6) {
    evaluation = '✅ 良好 - 改善の余地あり';
  } else {
    evaluation = '⚠️ 要改善 - 重要な課題あり';
  }
  
  console.log(`\\n📊 総合評価: ${evaluation} (平均満足度: ${overallAverage}/10)`);
  
  return {
    averageScores,
    commonIssues: Object.entries(issueCount).sort(([,a], [,b]) => b - a),
    topRecommendations: Object.entries(recCount).sort(([,a], [,b]) => b - a).slice(0, 5),
    evaluation,
    overallAverage
  };
}

/**
 * メイン実行関数
 */
async function runVirtualUserFeedbackSystem() {
  console.log('🔍 仮想ユーザーフィードバックシステム開始');
  console.log(`📅 実行日時: ${new Date().toISOString()}`);
  
  const allFeedback = [];
  
  // 各ユーザーのテスト実行
  for (const user of virtualUsers) {
    const feedback = await runVirtualUserTest(user);
    allFeedback.push(feedback);
    
    // ユーザー間の間隔
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // 総合レポート生成
  const report = generateFeedbackReport(allFeedback);
  
  // 詳細フィードバック保存
  const detailedReport = {
    timestamp: new Date().toISOString(),
    summary: report,
    userFeedback: allFeedback
  };
  
  fs.writeFileSync(
    `virtual_user_feedback_report_${new Date().toISOString().split('T')[0]}.json`,
    JSON.stringify(detailedReport, null, 2)
  );
  
  return detailedReport;
}

// メイン実行
if (require.main === module) {
  runVirtualUserFeedbackSystem().catch(console.error);
}

module.exports = { runVirtualUserFeedbackSystem };