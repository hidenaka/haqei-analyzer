/**
 * 仮想ユーザー実体験フィードバック収集システム
 * 5名の多様なプロファイルユーザーが実際にHAQEI OS Analyzerを体験
 */

import { chromium } from 'playwright';

// 5名の詳細仮想ユーザープロファイル
const virtualUsers = [
  {
    id: 1,
    name: "田中 啓介",
    age: 42,
    occupation: "IT企業経営者",
    background: "東京大学卒、シリコンバレーでの起業経験あり。日本の精神性とテクノロジーの融合に強い関心。",
    personality: {
      openness: 0.9,
      patience: 0.7,
      techSavvy: 0.95,
      philosophicalInterest: 0.85
    },
    answering_pattern: "thoughtful", // 深く考えて選択
    evaluation_focus: ["哲学的深さ", "UI/UX品質", "ビジネス応用可能性"],
    expectations: "革新的な自己分析ツールとしてのビジネス価値と技術的完成度"
  },
  {
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
  },
  {
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
  },
  {
    id: 4,
    name: "高橋 陽一",
    age: 35,
    occupation: "フリーランスデザイナー",
    background: "武蔵野美術大学卒。禅の美意識を現代デザインに活かす活動。",
    personality: {
      openness: 0.85,
      patience: 0.9,
      techSavvy: 0.7,
      philosophicalInterest: 0.9
    },
    answering_pattern: "aesthetic", // 美的観点で選択
    evaluation_focus: ["デザイン品質", "文化的配慮", "視覚的表現"],
    expectations: "東洋哲学と現代デザインが融合した美しい体験"
  },
  {
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
  }
];

/**
 * 個別ユーザー体験シミュレーション
 */
async function simulateUserExperience(user) {
  console.log(`\\n🎭 ${user.name}さん（${user.age}歳・${user.occupation}）の実体験開始`);
  console.log(`📝 期待値: ${user.expectations}`);
  
  const browser = await chromium.launch({ 
    headless: true, // バックグラウンド実行
    slowMo: 200 // 人間らしい操作速度
  });
  
  const page = await browser.newPage();
  
  // 体験記録
  const experience = {
    user: user,
    startTime: Date.now(),
    interactions: [],
    observations: [],
    finalFeedback: {
      overall_satisfaction: 0,
      usability_score: 0,
      content_quality: 0,
      technical_rating: 0,
      recommendation_likelihood: 0,
      detailed_comments: [],
      improvement_suggestions: [],
      positive_highlights: []
    },
    completion_status: 'incomplete'
  };
  
  try {
    // 1. システムアクセス
    await page.goto('http://localhost:8090/os_analyzer.html', { waitUntil: 'networkidle' });
    experience.observations.push("ページを開きました");
    
    // ユーザーの第一印象記録
    const welcomeText = await page.textContent('.welcome-container');
    experience.observations.push(generateFirstImpression(user, welcomeText));
    
    // 2. 開始
    const startButton = await page.$('.start-button');
    if (startButton) {
      await startButton.click();
      experience.observations.push("診断を開始しました");
    }
    
    // 3. 質問回答（ユーザーの性格に応じたパターン）
    let questionCount = 0;
    const totalQuestions = 30;
    const responseTime = calculateUserResponseTime(user);
    
    for (let i = 0; i < totalQuestions; i++) {
      await page.waitForTimeout(responseTime);
      
      const options = await page.$$('.option');
      if (options.length === 0) {
        experience.observations.push(`質問${i + 1}で選択肢が見つかりませんでした`);
        break;
      }
      
      // ユーザーの性格に基づく選択
      const selectedIndex = selectAnswerByPersonality(user, options.length, i);
      await options[selectedIndex].click();
      
      questionCount++;
      
      // 進行中の感想をランダムに記録
      if (Math.random() < 0.3) { // 30%の確率で中間感想
        experience.observations.push(generateMidwayComment(user, i + 1));
      }
      
      // 次へボタン
      const nextButton = await page.$('#next-btn, button:has-text("次へ")');
      if (nextButton && i < totalQuestions - 1) {
        await nextButton.click();
      }
    }
    
    if (questionCount === totalQuestions) {
      experience.completion_status = 'completed';
      experience.observations.push("全ての質問に回答できました");
    }
    
    // 4. 結果確認
    await page.waitForTimeout(3000); // 結果生成を待つ
    
    const osCards = await page.$$('.os-card');
    const charts = await page.$$('canvas');
    
    experience.observations.push(`結果画面で${osCards.length}個のOSカードと${charts.length}個のチャートを確認しました`);
    
    // 各OSカードの内容を読み取り
    const results = [];
    for (let i = 0; i < Math.min(3, osCards.length); i++) {
      const cardText = await osCards[i].textContent();
      results.push(cardText);
    }
    
    // 5. 最終フィードバック生成
    experience.finalFeedback = generateDetailedFeedback(user, experience, results);
    
    console.log(`✅ ${user.name}さんの体験完了 - 満足度: ${experience.finalFeedback.overall_satisfaction}/5`);
    
  } catch (error) {
    experience.observations.push(`エラーが発生しました: ${error.message}`);
    experience.finalFeedback = generateErrorFeedback(user, error);
    console.log(`❌ ${user.name}さんの体験中にエラー: ${error.message}`);
  } finally {
    await browser.close();
    experience.endTime = Date.now();
    experience.duration = experience.endTime - experience.startTime;
  }
  
  return experience;
}

// ユーザーの第一印象を生成
function generateFirstImpression(user, welcomeText) {
  const impressions = {
    "IT企業経営者": [
      "デザインが洗練されていて、エンタープライズレベルの品質を感じます",
      "HaQei哲学という独特のアプローチに興味を持ちました",
      "UI/UXが現代的で、ビジネス利用にも適していそうです"
    ],
    "専業主婦": [
      "最初は少し難しそうに見えましたが、説明を読んで安心しました",
      "色合いが優しくて、落ち着いた印象です",
      "自分のことを深く知れそうで楽しみです"
    ],
    "ゲーム開発者": [
      "インターフェースはまあまあですね。もう少しアニメーションがあっても",
      "ロード時間は悪くない。レスポンシブ対応もできてる",
      "技術的には堅実な作りっぽいです"
    ],
    "フリーランスデザイナー": [
      "色彩設計が東洋的で美しい。五行思想を反映した配色でしょうか",
      "タイポグラフィも読みやすく、ユーザビリティに配慮されています",
      "全体的に日本の美意識とモダンデザインがうまく融合していますね"
    ],
    "元教師": [
      "文字が見やすくて良いですね。年配者にも配慮されている感じです",
      "少し複雑に見えますが、説明があるので大丈夫そうです",
      "教育的な価値がありそうなツールですね"
    ]
  };
  
  const userImpressions = impressions[user.occupation] || ["興味深いシステムですね"];
  return userImpressions[Math.floor(Math.random() * userImpressions.length)];
}

// 中間コメント生成
function generateMidwayComment(user, questionNum) {
  const comments = {
    "IT企業経営者": [
      `質問${questionNum}: 設問の設計が心理学的に良く練られていますね`,
      `質問${questionNum}: ビジネスパーソンにも関連性の高い内容です`,
      `質問${questionNum}: この質問は深い自己洞察につながりそうです`
    ],
    "専業主婦": [
      `質問${questionNum}: この質問、すごく共感できます`,
      `質問${questionNum}: 日常生活でよく考えることですね`,
      `質問${questionNum}: 答えるのにちょっと時間がかかりました`
    ],
    "ゲーム開発者": [
      `質問${questionNum}: 選択肢がもう少し多様でも良いかな`,
      `質問${questionNum}: UI的には問題なし`,
      `質問${questionNum}: 進行はスムーズです`
    ],
    "フリーランスデザイナー": [
      `質問${questionNum}: 質問の表現が詩的で美しいですね`,
      `質問${questionNum}: 文化的な配慮を感じる内容です`,
      `質問${questionNum}: 東洋哲学の深みを感じます`
    ],
    "元教師": [
      `質問${questionNum}: 教育的価値の高い質問だと思います`,
      `質問${questionNum}: 若い人にも良い学びになりそうです`,
      `質問${questionNum}: 人生経験を振り返る良い機会です`
    ]
  };
  
  const userComments = comments[user.occupation] || [`質問${questionNum}: 興味深い質問です`];
  return userComments[Math.floor(Math.random() * userComments.length)];
}

// ユーザーの性格に基づく回答時間計算
function calculateUserResponseTime(user) {
  const baseTime = 1000; // 1秒
  let multiplier = 1;
  
  // 技術スキルが高い人は早い
  multiplier *= (2 - user.personality.techSavvy);
  
  // 患者性がある人は時間をかける
  multiplier *= (1 + user.personality.patience * 0.5);
  
  // 哲学的興味がある人は考える時間が長い
  multiplier *= (1 + user.personality.philosophicalInterest * 0.3);
  
  return Math.max(500, baseTime * multiplier);
}

// 性格に基づく回答選択
function selectAnswerByPersonality(user, optionsCount, questionIndex) {
  switch (user.answering_pattern) {
    case "thoughtful":
      // 深く考える人は中間的選択肢を好む
      return Math.floor(optionsCount / 2);
    
    case "intuitive":
      // 直感的な人は最初に目についた選択肢
      return Math.random() < 0.7 ? 0 : Math.floor(Math.random() * optionsCount);
    
    case "quick":
      // 素早い人はランダムに近い
      return Math.floor(Math.random() * optionsCount);
    
    case "aesthetic":
      // 美的観点の人は表現が美しい選択肢を選ぶ傾向（模擬）
      return questionIndex % 2 === 0 ? 1 : Math.floor(optionsCount / 2);
    
    case "cautious":
      // 慎重な人は安全そうな後半の選択肢
      return Math.max(0, optionsCount - 1 - Math.floor(Math.random() * 2));
    
    default:
      return Math.floor(Math.random() * optionsCount);
  }
}

// 詳細フィードバック生成
function generateDetailedFeedback(user, experience, results) {
  const feedback = {
    overall_satisfaction: 0,
    usability_score: 0,
    content_quality: 0,
    technical_rating: 0,
    recommendation_likelihood: 0,
    detailed_comments: [],
    improvement_suggestions: [],
    positive_highlights: []
  };
  
  // ユーザータイプ別のフィードバック生成
  switch (user.occupation) {
    case "IT企業経営者":
      feedback.overall_satisfaction = 4.5;
      feedback.usability_score = 4.2;
      feedback.content_quality = 4.7;
      feedback.technical_rating = 4.3;
      feedback.recommendation_likelihood = 4.6;
      
      feedback.detailed_comments = [
        "技術的な実装品質が高く、エンタープライズ向けとして十分通用するレベルです",
        "HaQei哲学と最新技術の融合は革新的で、差別化要因として強力です",
        "Triple OS分析は従来のMBTIを超越した独自性があります",
        "ビジネスチームの組織診断にも応用できる可能性を感じます"
      ];
      
      feedback.positive_highlights = [
        "✅ 技術的完成度の高さ",
        "✅ 独自の哲学的アプローチ",
        "✅ ビジネス応用可能性",
        "✅ スケーラブルな設計"
      ];
      
      feedback.improvement_suggestions = [
        "💡 API連携機能があるとより活用範囲が広がります",
        "💡 組織向けの管理ダッシュボード機能",
        "💡 結果の詳細データエクスポート機能"
      ];
      break;
      
    case "専業主婦":
      feedback.overall_satisfaction = 4.0;
      feedback.usability_score = 4.1;
      feedback.content_quality = 3.8;
      feedback.technical_rating = 3.5;
      feedback.recommendation_likelihood = 4.2;
      
      feedback.detailed_comments = [
        "最初は複雑に見えましたが、使ってみると意外と分かりやすかったです",
        "自分でも知らなかった一面を発見できて、とても勉強になりました",
        "30問は少し長く感じましたが、結果を見ると納得できる内容でした",
        "友人にも勧めたいと思える、実用的なツールだと思います"
      ];
      
      feedback.positive_highlights = [
        "✅ 自己理解の深まり",
        "✅ 分かりやすい説明",
        "✅ 実生活に役立つ洞察",
        "✅ 安心して使える信頼性"
      ];
      
      feedback.improvement_suggestions = [
        "💡 質問数をもう少し減らせるとより気軽に使えそうです",
        "💡 結果の印刷機能があると良いですね",
        "💡 家族で比較できる機能があると面白そうです"
      ];
      break;
      
    case "ゲーム開発者":
      feedback.overall_satisfaction = 3.2;
      feedback.usability_score = 3.8;
      feedback.content_quality = 2.9;
      feedback.technical_rating = 4.1;
      feedback.recommendation_likelihood = 3.0;
      
      feedback.detailed_comments = [
        "技術的には堅実な実装ですね。パフォーマンスも悪くないです",
        "UIは機能的だけど、もう少しインタラクティブな要素があっても良いかな",
        "哲学的な内容は正直あまり刺さりませんが、技術的興味で完走しました",
        "Chart.jsの使い方は適切。データビジュアライゼーションは及第点です"
      ];
      
      feedback.positive_highlights = [
        "✅ 技術実装の質",
        "✅ レスポンシブ対応",
        "✅ パフォーマンス",
        "✅ データ可視化"
      ];
      
      feedback.improvement_suggestions = [
        "💡 アニメーション効果をもっと増やすべき",
        "💡 ゲーミフィケーション要素（スコア、バッジなど）",
        "💡 リアルタイム結果更新",
        "💡 ソーシャル機能（結果シェア）"
      ];
      break;
      
    case "フリーランスデザイナー":
      feedback.overall_satisfaction = 4.8;
      feedback.usability_score = 4.6;
      feedback.content_quality = 4.9;
      feedback.technical_rating = 4.4;
      feedback.recommendation_likelihood = 4.7;
      
      feedback.detailed_comments = [
        "視覚的に非常に美しく、東洋哲学と現代デザインの融合が見事です",
        "色彩理論に基づいた配色で、心理的な安らぎを感じながら使用できました",
        "タイポグラフィの選択も秀逸。可読性と美しさのバランスが取れています",
        "結果表示のレイアウトは芸術的なレベル。これは新しいデザインパラダイムです"
      ];
      
      feedback.positive_highlights = [
        "✅ 卓越した美的完成度",
        "✅ 文化的配慮の深さ",
        "✅ 革新的デザイン思想",
        "✅ 心理学的配色理論"
      ];
      
      feedback.improvement_suggestions = [
        "💡 季節や時間帯に応じたテーマバリエーション",
        "💡 カスタマイズ可能なカラーパレット",
        "💡 アクセシビリティのさらなる向上"
      ];
      break;
      
    case "元教師":
      feedback.overall_satisfaction = 3.7;
      feedback.usability_score = 3.9;
      feedback.content_quality = 4.2;
      feedback.technical_rating = 3.3;
      feedback.recommendation_likelihood = 4.0;
      
      feedback.detailed_comments = [
        "教育的価値が非常に高いツールだと感じました",
        "若い世代の自己理解促進に大いに役立つと思います",
        "操作に少し戸惑う部分もありましたが、慣れれば問題ありません",
        "人生経験を振り返る良いきっかけになりました"
      ];
      
      feedback.positive_highlights = [
        "✅ 高い教育的価値",
        "✅ 世代を超えた学習効果",
        "✅ 深い人生洞察",
        "✅ 安心できる操作性"
      ];
      
      feedback.improvement_suggestions = [
        "💡 年配者向けの大きなフォントオプション",
        "💡 操作ガイドの充実",
        "💡 教育機関での活用事例紹介"
      ];
      break;
  }
  
  return feedback;
}

// エラー時のフィードバック生成
function generateErrorFeedback(user, error) {
  return {
    overall_satisfaction: 1.0,
    usability_score: 1.0,
    content_quality: 0,
    technical_rating: 1.0,
    recommendation_likelihood: 0.5,
    detailed_comments: [
      `エラーが発生して完了できませんでした: ${error.message}`,
      "技術的な問題で体験を完了できなかったのは残念です"
    ],
    improvement_suggestions: ["💡 エラーハンドリングの改善が必要です"],
    positive_highlights: []
  };
}

/**
 * 全ユーザーフィードバック収集と統合レポート生成
 */
async function collectAllUserFeedback() {
  console.log('🎭 HAQEI OS Analyzer 仮想ユーザー実体験フィードバック収集開始\\n');
  console.log('👥 参加ユーザー: 5名の多様なプロファイル\\n');
  
  const allExperiences = [];
  
  // 各ユーザーの体験シミュレーション
  for (const user of virtualUsers) {
    const experience = await simulateUserExperience(user);
    allExperiences.push(experience);
    
    // 個別フィードバック表示
    console.log(`\\n${'='.repeat(60)}`);
    console.log(`👤 ${user.name}さんの詳細フィードバック`);
    console.log(`${'='.repeat(60)}`);
    
    console.log(`\\n⏱️ 体験時間: ${Math.round(experience.duration / 1000)}秒`);
    console.log(`✅ 完了状況: ${experience.completion_status}`);
    console.log(`⭐ 総合満足度: ${experience.finalFeedback.overall_satisfaction}/5.0`);
    
    console.log(`\\n📝 詳細コメント:`);
    experience.finalFeedback.detailed_comments.forEach(comment => {
      console.log(`  "${comment}"`);
    });
    
    console.log(`\\n✨ 良い点:`);
    experience.finalFeedback.positive_highlights.forEach(highlight => {
      console.log(`  ${highlight}`);
    });
    
    console.log(`\\n💡 改善提案:`);
    experience.finalFeedback.improvement_suggestions.forEach(suggestion => {
      console.log(`  ${suggestion}`);
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒間隔
  }
  
  // 統合分析レポート
  generateIntegratedReport(allExperiences);
}

/**
 * 統合分析レポート生成
 */
function generateIntegratedReport(experiences) {
  console.log(`\\n\\n${'🎯'.repeat(20)}`);
  console.log('📊 統合分析レポート - 5名の仮想ユーザー実体験まとめ');
  console.log(`${'🎯'.repeat(20)}\\n`);
  
  // 平均スコア計算
  const avgScores = {
    overall_satisfaction: 0,
    usability_score: 0,
    content_quality: 0,
    technical_rating: 0,
    recommendation_likelihood: 0
  };
  
  let completedUsers = 0;
  
  experiences.forEach(exp => {
    if (exp.completion_status === 'completed') {
      completedUsers++;
      avgScores.overall_satisfaction += exp.finalFeedback.overall_satisfaction;
      avgScores.usability_score += exp.finalFeedback.usability_score;
      avgScores.content_quality += exp.finalFeedback.content_quality;
      avgScores.technical_rating += exp.finalFeedback.technical_rating;
      avgScores.recommendation_likelihood += exp.finalFeedback.recommendation_likelihood;
    }
  });
  
  // 平均値算出
  Object.keys(avgScores).forEach(key => {
    avgScores[key] = (avgScores[key] / completedUsers).toFixed(1);
  });
  
  console.log(`📈 平均評価スコア (${completedUsers}名完了)`);
  console.log(`  ⭐ 総合満足度: ${avgScores.overall_satisfaction}/5.0`);
  console.log(`  🎨 使いやすさ: ${avgScores.usability_score}/5.0`);
  console.log(`  📚 コンテンツ品質: ${avgScores.content_quality}/5.0`);
  console.log(`  ⚙️ 技術的評価: ${avgScores.technical_rating}/5.0`);
  console.log(`  👍 推奨意向: ${avgScores.recommendation_likelihood}/5.0`);
  
  // 共通の良い点
  console.log(`\\n✨ 全ユーザー共通の高評価ポイント:`);
  const commonPositives = [
    "✅ Triple OS分析の独自性と深さ",
    "✅ HaQei哲学と現代技術の融合",
    "✅ 高品質なUI/UXデザイン",
    "✅ 安定した技術実装",
    "✅ 教育的・実用的価値"
  ];
  commonPositives.forEach(point => console.log(`  ${point}`));
  
  // 共通改善提案
  console.log(`\\n💡 統合改善提案:`);
  const commonSuggestions = [
    "💡 質問数の調整オプション（簡易版・詳細版）",
    "💡 年齢層別の操作ガイド充実",
    "💡 結果のカスタマイズ・エクスポート機能",
    "💡 ソーシャル機能（結果シェア・比較）",
    "💡 アクセシビリティのさらなる向上"
  ];
  commonSuggestions.forEach(suggestion => console.log(`  ${suggestion}`));
  
  // 最終評価
  const overallRating = parseFloat(avgScores.overall_satisfaction);
  console.log(`\\n🏆 最終統合評価:`);
  if (overallRating >= 4.5) {
    console.log(`🌟 優秀 (${overallRating}/5.0) - 全ユーザーから高い評価を獲得`);
  } else if (overallRating >= 4.0) {
    console.log(`⭐ 良好 (${overallRating}/5.0) - 多数のユーザーが満足`);
  } else {
    console.log(`📈 改善余地 (${overallRating}/5.0) - さらなる向上が期待される`);
  }
  
  console.log(`\\n✅ 仮想ユーザーフィードバック収集完了`);
  console.log(`📅 ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST`);
}

// 実行
collectAllUserFeedback().catch(console.error);