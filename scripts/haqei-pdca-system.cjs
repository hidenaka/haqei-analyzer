#!/usr/bin/env node

/**
 * HAQEI特化PDCAシステム
 * 仮想ユーザーによるOSアナライザー・Future Simulator評価→フィードバック→改善→検証のサイクル
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const EnhancedVirtualUserGenerator = require('./enhanced-virtual-user-generator.cjs');

// HAQEIサイト情報
const HAQEI_SITES = {
  'os-analyzer': {
    url: 'http://localhost:8788/os_analyzer.html',
    name: 'OSアナライザー',
    evaluationPoints: [
      'Triple OS概念の理解しやすさ',
      '質問フローの自然さ',
      '分析結果の納得感',
      '易経との統合感',
      'UI/UXの直感性',
      'bunenjin哲学の表現'
    ]
  },
  'future-simulator': {
    url: 'http://localhost:8788/future_simulator.html',
    name: 'Future Simulator',
    evaluationPoints: [
      'シナリオ生成の質',
      '戦略提案の実用性',
      'インタラクション体験',
      '自然言語処理の精度',
      '結果表示の分かりやすさ',
      'モチベーション向上効果'
    ]
  },
  'results': {
    url: 'http://localhost:8788/results.html',
    name: 'Results画面',
    evaluationPoints: [
      '分析結果の可読性',
      'データ可視化の効果',
      'アクションプランの具体性',
      '継続利用への誘導',
      'エクスポート機能の便利さ'
    ]
  }
};

// 仮想ユーザープロファイル（HAQEI特化）
const VIRTUAL_USERS = [  
  {
    id: 1,
    name: "田中 健一",
    age: 45,
    occupation: "コンサルタント",
    background: "戦略コンサルティング会社勤務。易経や東洋思想に興味があり、ビジネスでの活用を模索。",
    personality: {
      philosophicalInterest: 0.9,
      analyticalThinking: 0.8,
      techSavvy: 0.6,
      patience: 0.7,
      businessOriented: 0.9
    },
    expectations: "自己理解を深めつつ、クライアントへの提案にも活用したい",
    concerns: "難しすぎて理解できないのではないか",
    evaluationStyle: "ビジネス実用性と哲学的深さのバランス重視"
  },
  {
    id: 2,
    name: "鈴木 美香",
    age: 38,
    occupation: "会社員（人事）",
    background: "人材開発部門で働く。チームビルディングや個人の成長支援に関心。ITは苦手。",
    personality: {
      philosophicalInterest: 0.5,
      analyticalThinking: 0.6,
      techSavvy: 0.3,
      patience: 0.8,
      peopleOriented: 0.9
    },
    expectations: "自分や部下の性格を理解して、より良い人間関係を築きたい",
    concerns: "操作が複雑で途中で諦めてしまうかも",
    evaluationStyle: "使いやすさと実生活での応用可能性重視"
  },
  {
    id: 3,
    name: "山田 翔太",
    age: 28,
    occupation: "エンジニア",
    background: "スタートアップでフロントエンド開発。効率化とデータ分析が好き。精神論は懐疑的。",
    personality: {
      philosophicalInterest: 0.2,
      analyticalThinking: 0.9,
      techSavvy: 0.95,
      patience: 0.4,
      logicalThinking: 0.9
    },
    expectations: "科学的根拠のある自己分析ツールとして評価したい",
    concerns: "根拠不明な占い的内容だったら時間の無駄",
    evaluationStyle: "技術的精度とロジカルな分析結果重視"
  },
  {
    id: 4,
    name: "佐藤 恵子",
    age: 52,
    occupation: "自営業（カウンセラー）",
    background: "心理カウンセラーとして開業。クライアントの自己理解支援にツールを活用したい。",
    personality: {
      philosophicalInterest: 0.8,
      analyticalThinking: 0.7,
      techSavvy: 0.4,
      patience: 0.9,
      empathetic: 0.95
    },
    expectations: "クライアントが自分を客観視できるきっかけとして使えるか",
    concerns: "結果が一面的で、個人の複雑さを捉えきれないのでは",
    evaluationStyle: "心理的洞察の深さと配慮の丁寧さ重視"
  },
  {
    id: 5,
    name: "高橋 大輔",
    age: 33,
    occupation: "営業マネージャー",
    background: "営業成績優秀だが、チームマネジメントに課題。自分のリーダーシップスタイルを見直したい。",
    personality: {
      philosophicalInterest: 0.4,
      analyticalThinking: 0.6,
      techSavvy: 0.5,
      patience: 0.5,
      resultOriented: 0.8
    },
    expectations: "短時間で実用的な自己理解と改善のヒントを得たい",
    concerns: "時間をかけた割に、実際の行動変化につながらないかも",
    evaluationStyle: "即効性と行動変化への具体性重視"
  }
];

class HAQEIPDCASystem {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'output', 'pdca');
    this.userGenerator = new EnhancedVirtualUserGenerator();
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * メインPDCAサイクル実行
   */
  async runPDCACycle(siteName, options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sessionDir = path.join(this.outputDir, `pdca-${siteName}-${timestamp}`);
    fs.mkdirSync(sessionDir, { recursive: true });

    console.log(`🔄 PDCA サイクル開始: ${siteName}`);
    console.log(`📁 セッション記録: ${sessionDir}`);

    try {
      // PLAN: 評価計画の作成
      console.log('\n📋 PLAN: 評価計画作成中...');
      const plan = await this.createEvaluationPlan(siteName, options);
      fs.writeFileSync(path.join(sessionDir, 'plan.json'), JSON.stringify(plan, null, 2));

      // DO: 仮想ユーザーによる実際の評価実行
      console.log('\n🎭 DO: 仮想ユーザー評価実行中...');
      const evaluationResults = await this.executeVirtualUserEvaluation(siteName, plan);
      fs.writeFileSync(path.join(sessionDir, 'evaluation-results.json'), JSON.stringify(evaluationResults, null, 2));

      // CHECK: フィードバック分析と改善案生成
      console.log('\n🔍 CHECK: フィードバック分析中...');
      const feedback = await this.analyzeFeedbackAndGenerateImprovements(evaluationResults);
      fs.writeFileSync(path.join(sessionDir, 'feedback-analysis.json'), JSON.stringify(feedback, null, 2));

      // ACT: 改善案のレポート生成（Claude相談用）
      console.log('\n⚡ ACT: 改善提案レポート生成中...');
      const actionPlan = await this.generateActionPlanForClaude(feedback, siteName);
      fs.writeFileSync(path.join(sessionDir, 'action-plan.json'), JSON.stringify(actionPlan, null, 2));

      // HTMLレポート生成
      const htmlReport = this.generateHTMLReport({
        siteName,
        timestamp,
        plan,
        evaluationResults,
        feedback,
        actionPlan
      });
      
      const reportPath = path.join(sessionDir, 'pdca-report.html');
      fs.writeFileSync(reportPath, htmlReport);

      console.log(`\n✅ PDCA サイクル完了!`);
      console.log(`📊 レポート: ${reportPath}`);
      console.log(`\n🤝 次のステップ: 以下のコマンドでClaude相談を開始してください:`);
      console.log(`npm run pdca:discuss --session=${path.basename(sessionDir)}`);

      return {
        sessionDir,
        reportPath,
        actionPlan
      };

    } catch (error) {
      console.error('❌ PDCA サイクルエラー:', error);
      throw error;
    }
  }

  /**
   * 評価計画の作成
   */
  async createEvaluationPlan(siteName, options) {
    const site = HAQEI_SITES[siteName];
    if (!site) {
      throw new Error(`未対応サイト: ${siteName}`);
    }

    // 動的ユーザー生成
    const userCount = options.userCount || 15; // デフォルト15人に増加
    const dynamicUsers = this.userGenerator.generateDiverseUsers(userCount);
    
    console.log(`🎭 ${userCount}人の多様な仮想ユーザーを生成`);
    console.log(`   人格分布: ${this.userGenerator.getPersonalityDistribution(dynamicUsers)}`);

    return {
      siteName,
      site,
      evaluationUsers: dynamicUsers,
      testScenarios: this.generateTestScenarios(siteName),
      expectedDuration: options.duration || 300, // 5分
      focusAreas: options.focus || site.evaluationPoints,
      timestamp: new Date().toISOString(),
      userGenerationSummary: this.userGenerator.generateStatisticalSummary(dynamicUsers)
    };
  }

  /**
   * テストシナリオ生成
   */
  generateTestScenarios(siteName) {
    const baseScenarios = {
      'os-analyzer': [
        {
          name: "初回利用フルフロー",
          steps: [
            "サイトにアクセス",
            "説明を読んで理解",
            "質問に順次回答",
            "分析結果を確認",
            "結果の有用性を評価"
          ]
        },
        {
          name: "途中離脱パターン",
          steps: [
            "サイトにアクセス",
            "最初の数問に回答",
            "面倒に感じて離脱検討",
            "継続・離脱の判断"
          ]
        }
      ],
      'future-simulator': [
        {
          name: "戦略シミュレーション体験",
          steps: [
            "Future Simulatorにアクセス",
            "現在の状況を入力",
            "シナリオ生成を実行",
            "提案された戦略を評価",
            "実行可能性を判断"
          ]
        }
      ],
      'results': [
        {
          name: "結果確認と活用",
          steps: [
            "結果画面にアクセス",
            "分析結果を詳細確認",
            "アクションプランを検討",
            "エクスポート機能を試用"
          ]
        }
      ]
    };

    return baseScenarios[siteName] || [];
  }

  /**
   * 仮想ユーザー評価の実行
   */
  async executeVirtualUserEvaluation(siteName, plan) {
    const browser = await chromium.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-web-security']
    });

    const results = [];

    for (const user of plan.evaluationUsers) {
      console.log(`  👤 ${user.name}の評価開始...`);
      
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
      });
      
      const page = await context.newPage();
      
      // コンソールログ収集
      const logs = [];
      page.on('console', msg => {
        logs.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      });

      try {
        const userResult = await this.simulateUserExperience(page, user, plan);
        results.push({
          userId: user.id,
          userName: user.name,
          ...userResult,
          logs: logs
        });
      } catch (error) {
        console.error(`  ❌ ${user.name}の評価エラー:`, error.message);
        results.push({
          userId: user.id,
          userName: user.name,
          error: error.message,
          completed: false
        });
      }
      
      await context.close();
    }

    await browser.close();
    return results;
  }

  /**
   * ユーザー体験シミュレーション
   */
  async simulateUserExperience(page, user, plan) {
    const startTime = Date.now();
    const site = plan.site;
    
    // サイトアクセス
    await page.goto(site.url);
    await page.waitForTimeout(2000);

    const experience = {
      startTime: new Date().toISOString(),
      completed: false,
      timeSpent: 0,
      interactions: [],
      impressions: [],
      problems: [],
      suggestions: [],
      overallRating: 0
    };

    try {
      // ユーザープロファイルに基づく行動シミュレーション
      if (user.personality.patience < 0.5) {
        // せっかちなユーザー：素早く操作
        await this.simulateImpatientUser(page, user, experience);
      } else {
        // 慎重なユーザー：じっくり確認
        await this.simulateCarefulUser(page, user, experience);
      }

      // 技術レベルに応じた操作
      if (user.personality.techSavvy < 0.4) {
        await this.simulateNonTechUser(page, user, experience);
      }

      experience.completed = true;
      experience.timeSpent = Date.now() - startTime;
      
      // ユーザーの評価スタイルに基づく総合評価
      experience.overallRating = this.calculateOverallRating(user, experience);
      
    } catch (error) {
      experience.error = error.message;
      experience.timeSpent = Date.now() - startTime;
    }

    return experience;
  }

  /**
   * せっかちなユーザーの行動シミュレーション
   */
  async simulateImpatientUser(page, user, experience) {
    // 素早くスクロールして全体を把握
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    experience.impressions.push("最初に全体をざっと確認");

    // 開始ボタンを探して即クリック
    const startButtons = await page.$$('button, .button, .btn');
    if (startButtons.length > 0) {
      await startButtons[0].click();
      experience.interactions.push({ action: "開始ボタンクリック", time: Date.now() });
    }

    // 質問があれば素早く回答
    await this.simulateQuickAnswering(page, user, experience);
  }

  /**
   * 慎重なユーザーの行動シミュレーション
   */
  async simulateCarefulUser(page, user, experience) {
    // 説明文をしっかり読む
    const textElements = await page.$$('p, .description, .explanation');
    for (let i = 0; i < Math.min(textElements.length, 3); i++) {
      await textElements[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
    }
    
    experience.impressions.push("説明をじっくり読んで内容を理解");

    // 慎重に開始
    const startButtons = await page.$$('button, .button, .btn');
    if (startButtons.length > 0) {
      await page.waitForTimeout(1000); // 少し考える時間
      await startButtons[0].click();
      experience.interactions.push({ action: "十分検討してから開始", time: Date.now() });
    }

    // 質問を慎重に検討して回答
    await this.simulateThoughtfulAnswering(page, user, experience);
  }

  /**
   * 非技術系ユーザーの行動シミュレーション
   */
  async simulateNonTechUser(page, user, experience) {
    // 迷いやすい行動
    const allButtons = await page.$$('button, .button, .btn');
    if (allButtons.length > 1) {
      // 複数ボタンがあると迷う
      experience.problems.push("ボタンが複数あってどれを押すべきか迷った");
      await page.waitForTimeout(3000); // 迷う時間
    }

    // わからない用語があると困る
    const hasComplexTerms = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('OS') || text.includes('アルゴリズム') || text.includes('システム');
    });

    if (hasComplexTerms) {
      experience.problems.push("専門用語が多くて理解が困難");
      experience.suggestions.push("専門用語の説明や補足があると良い");
    }
  }

  /**
   * 素早い回答シミュレーション
   */
  async simulateQuickAnswering(page, user, experience) {
    // ラジオボタンやチェックボックスを探して素早く選択
    for (let i = 0; i < 5; i++) { // 最大5問
      const radioButtons = await page.$$('input[type="radio"]');
      const checkboxes = await page.$$('input[type="checkbox"]');
      
      if (radioButtons.length > 0) {
        // 最初のオプションを選択（早く済ませたい）
        await radioButtons[0].click();
        experience.interactions.push({ action: "素早く選択", time: Date.now() });
      } else if (checkboxes.length > 0) {
        // いくつかチェック
        for (let j = 0; j < Math.min(2, checkboxes.length); j++) {
          await checkboxes[j].click();
        }
        experience.interactions.push({ action: "複数選択", time: Date.now() });
      }

      // 次へボタンを探してクリック
      const nextButtons = await page.$$('button:has-text("次"), .next, .btn-next');
      if (nextButtons.length > 0) {
        await nextButtons[0].click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }
  }

  /**
   * 慎重な回答シミュレーション
   */
  async simulateThoughtfulAnswering(page, user, experience) {
    // 質問を読んで考えてから回答
    for (let i = 0; i < 5; i++) {
      // 質問文を読む
      const questionElements = await page.$$('.question, h2, h3');
      if (questionElements.length > 0) {
        await questionElements[0].scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000); // 読む時間
      }

      const radioButtons = await page.$$('input[type="radio"]');
      if (radioButtons.length > 0) {
        // ユーザーの性格に応じて選択傾向を変える
        let choiceIndex;
        if (user.personality.analyticalThinking > 0.7) {
          // 分析的：中間的な選択を好む
          choiceIndex = Math.floor(radioButtons.length / 2);
        } else if (user.personality.philosophicalInterest > 0.7) {
          // 哲学的：深い選択肢を好む（後半の選択肢）
          choiceIndex = Math.min(radioButtons.length - 1, Math.floor(radioButtons.length * 0.7));
        } else {
          // 一般的：最初の方を選ぶ傾向
          choiceIndex = Math.floor(Math.random() * Math.min(3, radioButtons.length));
        }
        
        await radioButtons[choiceIndex].click();
        experience.interactions.push({ 
          action: "慎重に選択", 
          choice: choiceIndex,
          time: Date.now() 
        });
        
        await page.waitForTimeout(1000); // 選択後の確認時間
      }

      // 次へボタン
      const nextButtons = await page.$$('button:has-text("次"), .next, .btn-next');
      if (nextButtons.length > 0) {
        await nextButtons[0].click();
        await page.waitForTimeout(1000);
      } else {
        break;
      }
    }
  }

  /**
   * 総合評価計算（強化版 - 個性とセッション変動考慮）
   */
  calculateOverallRating(user, experience) {
    let rating = 3.0; // 基準点

    // セッション変動要因を適用
    const sessionMod = user.sessionVariation || { mood: 0.7, concentration: 0.7, motivation: 0.7 };
    const baseModifier = (sessionMod.mood + sessionMod.concentration + sessionMod.motivation) / 3;
    rating *= (0.7 + 0.6 * baseModifier); // ±30%の変動

    // 完了できたかどうか
    if (experience.completed) {
      rating += 1.0;
    } else {
      rating -= 1.5;
    }

    // 問題の数に応じて減点（人格タイプで重み調整）
    let problemPenalty = experience.problems.length * 0.5;
    if (user.personalityType === 'empathetic' && experience.problems.some(p => p.includes('冷たい'))) {
      problemPenalty *= 1.5; // 共感型は冷たさに敏感
    }
    if (user.personalityType === 'technical' && experience.problems.some(p => p.includes('根拠'))) {
      problemPenalty *= 1.3; // 技術型は根拠不足に厳しい
    }
    rating -= problemPenalty;

    // 人格タイプ別の評価調整
    this.applyPersonalityBasedRating(rating, user, experience);

    // 年齢・経験による調整
    if (user.age > 50 && experience.problems.some(p => p.includes('操作'))) {
      rating -= 0.8; // シニアは操作問題に敏感
    }
    if (sessionMod.priorExperience && experience.completed) {
      rating += 0.3; // 経験者は完了時にボーナス
    }

    return Math.max(1.0, Math.min(5.0, rating));
  }

  /**
   * 人格タイプ別評価調整
   */
  applyPersonalityBasedRating(rating, user, experience) {
    switch (user.personalityType) {
      case 'philosophical':
        if (experience.problems.some(p => p.includes('浅い'))) rating -= 1.0;
        if (experience.insights && experience.insights.length > 2) rating += 0.5;
        break;
      case 'practical':
        if (experience.timeSpent > user.personality.efficiency * 240000) rating -= 0.8;
        if (experience.problems.some(p => p.includes('具体性'))) rating -= 0.7;
        break;
      case 'technical':
        if (experience.problems.some(p => p.includes('論理'))) rating -= 1.2;
        if (!experience.problems.some(p => p.includes('技術'))) rating += 0.4;
        break;
      case 'empathetic':
        if (experience.problems.some(p => p.includes('配慮'))) rating -= 1.0;
        if (experience.emotionalResponse === 'positive') rating += 0.6;
        break;
      case 'creative':
        if (experience.problems.some(p => p.includes('画一'))) rating -= 0.9;
        if (experience.uniqueInsights) rating += 0.7;
        break;
    }
    return rating;
  }

  /**
   * フィードバック分析と改善案生成
   */
  async analyzeFeedbackAndGenerateImprovements(evaluationResults) {
    const analysis = {
      summary: {
        totalUsers: evaluationResults.length,
        completedUsers: evaluationResults.filter(r => r.completed).length,
        averageRating: 0,
        averageTime: 0
      },
      commonProblems: [],
      suggestions: [],
      userSegmentAnalysis: {},
      prioritizedImprovements: []
    };

    // 基本統計
    const completedResults = evaluationResults.filter(r => r.completed && !r.error);
    if (completedResults.length > 0) {
      analysis.summary.averageRating = completedResults.reduce((sum, r) => sum + r.overallRating, 0) / completedResults.length;
      analysis.summary.averageTime = completedResults.reduce((sum, r) => sum + r.timeSpent, 0) / completedResults.length;
    }

    // 共通問題の抽出
    const problemCounts = {};
    evaluationResults.forEach(result => {
      if (result.problems) {
        result.problems.forEach(problem => {
          problemCounts[problem] = (problemCounts[problem] || 0) + 1;
        });
      }
    });

    analysis.commonProblems = Object.entries(problemCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([problem, count]) => ({ problem, count, frequency: count / evaluationResults.length }));

    // 改善提案の生成
    analysis.suggestions = this.generateImprovementSuggestions(analysis.commonProblems, evaluationResults);

    // 優先度付け
    analysis.prioritizedImprovements = this.prioritizeImprovements(analysis.suggestions, analysis.summary);

    return analysis;
  }

  /**
   * 改善提案生成
   */
  generateImprovementSuggestions(commonProblems, evaluationResults) {
    const suggestions = [];

    // 問題に対する具体的な改善提案
    commonProblems.forEach(({ problem, frequency }) => {
      if (frequency > 0.5) { // 半数以上が経験した問題
        if (problem.includes('専門用語')) {
          suggestions.push({
            category: 'UI/UX',
            priority: 'high',
            description: '専門用語の説明やツールチップを追加',
            implementation: '用語集機能、ホバー説明、初心者モードの追加',
            expectedImpact: '非技術系ユーザーの理解度30%向上'
          });
        }
        
        if (problem.includes('迷った') || problem.includes('どれを押す')) {
          suggestions.push({
            category: 'Navigation',
            priority: 'high',
            description: 'ボタンの視覚的階層とガイダンスを改善',
            implementation: '主要アクションの強調、進行状況表示、ヘルプテキスト追加',
            expectedImpact: 'ユーザーの迷い時間50%短縮'
          });
        }
      }
    });

    // 評価結果に基づく改善提案
    const lowRatingResults = evaluationResults.filter(r => r.overallRating < 3.0);
    if (lowRatingResults.length > 0) {
      suggestions.push({
        category: 'User Experience',
        priority: 'medium',
        description: '低評価ユーザーの体験フロー見直し',
        implementation: 'オンボーディング改善、段階的開示、モチベーション維持機能',
        expectedImpact: '全体満足度20%向上'
      });
    }

    return suggestions;
  }

  /**
   * 改善提案の優先度付け
   */
  prioritizeImprovements(suggestions, summary) {
    return suggestions.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }

  /**
   * Claude相談用アクションプラン生成
   */
  async generateActionPlanForClaude(feedback, siteName) {
    return {
      sessionInfo: {
        site: siteName,
        timestamp: new Date().toISOString(),
        summary: feedback.summary
      },
      claudeConsultationTopics: [
        {
          topic: "最優先改善項目の実装方針",
          details: feedback.prioritizedImprovements.slice(0, 3),
          questions: [
            "これらの改善提案の技術的実現可能性はどうですか？",
            "実装順序や相互依存関係について相談したいです",
            "予想される開発工数はどの程度でしょうか？"
          ]
        },
        {
          topic: "ユーザー体験設計の根本見直し",
          details: feedback.commonProblems,
          questions: [
            "HAQEIの哲学を保ちつつUI/UXを改善する方針を相談したいです",
            "非技術系ユーザーへの配慮と专门性のバランスについて",
            "段階的な機能開放の設計について"
          ]
        }
      ],
      recommendedActions: [
        "1. Claude相談セッションで改善方針を決定",
        "2. 優先度の高い改善から段階的実装",
        "3. 実装後の再評価でPDCAサイクル継続",
        "4. A/Bテストでの効果測定実施"
      ],
      nextSteps: {
        immediate: "Claude相談による実装計画策定",
        shortTerm: "高優先度改善の実装とテスト",
        longTerm: "継続的なPDCAサイクルの確立"
      }
    };
  }

  /**
   * HTMLレポート生成
   */
  generateHTMLReport(data) {
    const { siteName, timestamp, plan, evaluationResults, feedback, actionPlan } = data;
    
    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAQEI PDCA レポート - ${plan.site.name}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
        .metric { display: inline-block; margin: 10px 20px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #667eea; }
        .metric-label { font-size: 0.9em; color: #666; }
        .user-card { margin: 15px 0; padding: 15px; border-left: 4px solid #667eea; background: #f8f9ff; }
        .problem { margin: 10px 0; padding: 10px; border-left: 3px solid #ff6b6b; background: #fff5f5; }
        .suggestion { margin: 10px 0; padding: 10px; border-left: 3px solid #51cf66; background: #f3fff3; }
        .priority-high { border-left-color: #ff6b6b; }
        .priority-medium { border-left-color: #ffd93d; }
        .priority-low { border-left-color: #51cf66; }
        .claude-section { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 20px; border-radius: 8px; margin: 20px 0; }
        .rating { font-size: 1.2em; color: #667eea; font-weight: bold; }
        .progress-bar { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; margin: 5px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 HAQEI PDCA レポート</h1>
            <h2>${plan.site.name} 仮想ユーザー評価</h2>
            <p>実行日時: ${new Date(timestamp).toLocaleString('ja-JP')}</p>
        </div>

        <div class="section">
            <h2>📊 実行サマリー</h2>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">${feedback.summary.totalUsers}</div>
                    <div class="metric-label">評価ユーザー数</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${feedback.summary.completedUsers}</div>
                    <div class="metric-label">完了ユーザー数</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${feedback.summary.averageRating.toFixed(1)}</div>
                    <div class="metric-label">平均評価 (5点満点)</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${Math.round(feedback.summary.averageTime / 1000)}秒</div>
                    <div class="metric-label">平均完了時間</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>👥 仮想ユーザー評価結果</h2>
            ${evaluationResults.map(result => `
                <div class="user-card">
                    <h3>${result.userName}</h3>
                    <div class="rating">評価: ${result.overallRating?.toFixed(1) || 'N/A'} / 5.0</div>
                    <p><strong>完了状況:</strong> ${result.completed ? '✅ 完了' : '❌ 未完了'}</p>
                    <p><strong>所要時間:</strong> ${Math.round((result.timeSpent || 0) / 1000)}秒</p>
                    ${result.problems ? `
                        <div><strong>発見された問題:</strong></div>
                        ${result.problems.map(problem => `<div class="problem">• ${problem}</div>`).join('')}
                    ` : ''}
                    ${result.suggestions ? `
                        <div><strong>改善提案:</strong></div>
                        ${result.suggestions.map(suggestion => `<div class="suggestion">• ${suggestion}</div>`).join('')}
                    ` : ''}
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>🔍 共通問題分析</h2>
            ${feedback.commonProblems.map(({ problem, count, frequency }) => `
                <div class="problem">
                    <strong>${problem}</strong>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${frequency * 100}%"></div>
                    </div>
                    発生頻度: ${count}/${feedback.summary.totalUsers}人 (${Math.round(frequency * 100)}%)
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>💡 優先改善提案</h2>
            ${feedback.prioritizedImprovements.map(improvement => `
                <div class="suggestion priority-${improvement.priority}">
                    <h4>${improvement.description}</h4>
                    <p><strong>カテゴリ:</strong> ${improvement.category}</p>
                    <p><strong>優先度:</strong> ${improvement.priority.toUpperCase()}</p>
                    <p><strong>実装方法:</strong> ${improvement.implementation}</p>
                    <p><strong>期待効果:</strong> ${improvement.expectedImpact}</p>
                </div>
            `).join('')}
        </div>

        <div class="claude-section">
            <h2>🤖 Claude相談セッション準備</h2>
            <h3>相談トピック:</h3>
            ${actionPlan.claudeConsultationTopics.map((topic, index) => `
                <div style="margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.5); border-radius: 5px;">
                    <h4>${index + 1}. ${topic.topic}</h4>
                    <h5>相談したい質問:</h5>
                    <ul>
                        ${topic.questions.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
            
            <h3>推奨アクション:</h3>
            <ol>
                ${actionPlan.recommendedActions.map(action => `<li>${action}</li>`).join('')}
            </ol>

            <div style="background: rgba(255,255,255,0.8); padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h4>🚀 次のステップ</h4>
                <p><strong>immediate:</strong> ${actionPlan.nextSteps.immediate}</p>
                <p><strong>short-term:</strong> ${actionPlan.nextSteps.shortTerm}</p>
                <p><strong>long-term:</strong> ${actionPlan.nextSteps.longTerm}</p>
            </div>
        </div>

        <div class="section">
            <h2>📝 セッション情報</h2>
            <p><strong>サイト:</strong> ${siteName}</p>
            <p><strong>評価時間:</strong> ${new Date(timestamp).toLocaleString('ja-JP')}</p>
            <p><strong>評価観点:</strong> ${plan.focusAreas.join(', ')}</p>
            <p><strong>セッションID:</strong> pdca-${siteName}-${timestamp}</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}

// コマンドライン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  const siteName = process.env.npm_config_site || args[0] || 'os-analyzer';
  const users = process.env.npm_config_users ? parseInt(process.env.npm_config_users) : undefined;
  
  const pdcaSystem = new HAQEIPDCASystem();
  
  pdcaSystem.runPDCACycle(siteName, { users })
    .then(result => {
      console.log('\n🎉 PDCA評価完了！');
      console.log(`レポート: file://${result.reportPath}`);
    })
    .catch(error => {
      console.error('❌ エラー:', error);
      process.exit(1);
    });
}

module.exports = HAQEIPDCASystem;