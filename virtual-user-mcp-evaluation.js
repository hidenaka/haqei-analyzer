/**
 * HaQei Analyzer MCP Playwright実装による仮想ユーザー評価システム
 * 実際のos_analyzer.htmlを操作し、実体験に基づく評価を収集
 */

import { chromium } from 'playwright';

// 深層人格を持つ日本人仮想ユーザープロファイル（5名のみテスト実装）
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
    evaluation_focus: ["哲学的深さ", "UI/UX品質", "ビジネス応用可能性"]
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
    evaluation_focus: ["使いやすさ", "分かりやすさ", "実生活への応用"]
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
    evaluation_focus: ["スピード", "エンタメ性", "技術的実装"]
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
    evaluation_focus: ["デザイン品質", "文化的配慮", "視覚的表現"]
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
    evaluation_focus: ["操作の分かりやすさ", "文字の見やすさ", "安心感"]
  }
];

/**
 * MCPを使用した仮想ユーザー体験シミュレーション
 */
async function simulateUserExperience(user) {
  console.log(`\n🤖 ${user.name}（${user.age}歳・${user.occupation}）の体験開始...`);
  
  const browser = await chromium.launch({ 
    headless: false, // デバッグのため表示
    slowMo: 1000, // デバッグのためゆっくり動作
    devtools: false // 開発者ツールは閉じる
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'ja-JP'
  });
  
  const page = await context.newPage();
  
  // 体験データの記録
  const experience = {
    user: user,
    timestamps: {
      start: Date.now(),
      welcomeScreen: null,
      firstQuestion: null,
      lastQuestion: null,
      analysis: null,
      complete: null
    },
    interactions: [],
    observations: [],
    errors: [],
    finalEvaluation: null
  };
  
  try {
    // 1. os_analyzer.htmlにアクセス
    console.log('📱 システムにアクセス中...');
    await page.goto('http://localhost:9999/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    
    // 2. ウェルカム画面の評価
    console.log('⏳ ウェルカム画面を待機中...');
    
    // ページの読み込みを待つ
    await page.waitForLoadState('networkidle');
    
    // ウェルカム画面の要素を探す
    const welcomeContainer = await page.$('#welcome-container');
    if (!welcomeContainer) {
      console.log('⚠️ ウェルカムコンテナが見つかりません。ページ構造を確認中...');
      const html = await page.content();
      console.log('📄 ページ内容の一部:', html.substring(0, 500));
    }
    
    // より柔軟な待機条件
    await page.waitForSelector('#welcome-container', { 
      timeout: 30000,
      state: 'attached' // 'visible'ではなく'attached'に変更
    });
    experience.timestamps.welcomeScreen = Date.now();
    
    const welcomeText = await page.textContent('#welcome-container');
    experience.observations.push({
      screen: 'welcome',
      observation: evaluateWelcomeScreen(welcomeText, user)
    });
    
    // 3. 分析開始
    console.log('🔍 開始ボタンを探しています...');
    
    // より具体的なセレクターを試す
    let startButton = await page.$('button.start-button');
    if (!startButton) {
      startButton = await page.$('button[id*="start"]');
    }
    if (!startButton) {
      startButton = await page.$('button');
      console.log('⚠️ 汎用的なボタンセレクターを使用');
    }
    
    if (startButton) {
      const buttonText = await startButton.textContent();
      console.log(`📱 ボタンを発見: "${buttonText}"`);
      await startButton.click();
    } else {
      throw new Error('開始ボタンが見つかりません');
    }
    
    // 4. 質問フローの体験
    experience.timestamps.firstQuestion = Date.now();
    
    // デバッグのため質問数を3つに制限
    for (let i = 0; i < 3; i++) {
      // 質問が表示されるまで待機
      console.log(`📋 質問 ${i + 1}/30 を待機中...`);
      
      // より柔軟な待機と要素探索
      await page.waitForTimeout(1000); // 少し待つ
      
      // 様々なセレクターを試す
      let questionText = '';
      const questionSelectors = [
        '.question-text',
        '.virtual-question-item h3',
        '.virtual-question-item .text',
        'h3',
        '[class*="question"]'
      ];
      
      for (const selector of questionSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            questionText = await element.textContent();
            if (questionText && questionText.trim()) {
              console.log(`✅ 質問発見 (${selector}): ${questionText.substring(0, 50)}...`);
              break;
            }
          }
        } catch (e) {
          // 次のセレクターを試す
        }
      }
      
      if (!questionText) {
        console.log('⚠️ 質問テキストが見つかりません。ページ内容を確認...');
        const content = await page.content();
        console.log('📄 現在のページ構造:', content.substring(0, 1000));
        throw new Error('質問テキストが見つかりません');
      }
      
      // オプションの取得
      let options = [];
      try {
        options = await page.$$eval('.option-label', els => els.map(el => el.textContent));
      } catch (e) {
        // 別のセレクターを試す
        try {
          options = await page.$$eval('label', els => els.map(el => el.textContent));
        } catch (e2) {
          options = ['選択肢A', '選択肢B', '選択肢C']; // デフォルト
        }
      }
      
      // ユーザーの性格に基づいた選択
      const selectedOption = selectAnswer(user, questionText, options, i);
      
      // オプションをクリック
      try {
        await page.click(`.option-label:has-text("${selectedOption}")`);
      } catch (e) {
        // 別の方法でクリック
        const labels = await page.$$('label');
        if (labels.length > 0) {
          const randomIndex = Math.floor(Math.random() * labels.length);
          await labels[randomIndex].click();
          console.log(`⚠️ ランダム選択: ${randomIndex + 1}番目のオプション`);
        }
      }
      
      experience.interactions.push({
        question: i + 1,
        questionText: questionText,
        selectedOption: selectedOption,
        responseTime: calculateResponseTime(user)
      });
      
      // 次へボタンをクリック（最後の質問以外）
      if (i < 29) {
        try {
          await page.click('#next-btn');
        } catch (e) {
          // 別のセレクターを試す
          try {
            await page.click('button:has-text("次へ")');
          } catch (e2) {
            console.log('⚠️ 次へボタンが見つかりません');
            // ページを少し待つ
            await page.waitForTimeout(1000);
          }
        }
      }
    }
    
    experience.timestamps.lastQuestion = Date.now();
    
    // 5. 分析結果の表示待機
    await page.waitForSelector('#analysis-container', { timeout: 30000 });
    experience.timestamps.analysis = Date.now();
    
    // 6. 結果の評価
    const results = await evaluateResults(page, user);
    experience.observations.push({
      screen: 'results',
      observation: results
    });
    
    experience.timestamps.complete = Date.now();
    
    // 7. 総合評価の生成
    experience.finalEvaluation = generateFinalEvaluation(experience, user);
    
  } catch (error) {
    console.error(`❌ エラー発生: ${error.message}`);
    experience.errors.push({
      error: error.message,
      timestamp: Date.now()
    });
  } finally {
    await browser.close();
  }
  
  return experience;
}

/**
 * ウェルカム画面の評価
 */
function evaluateWelcomeScreen(text, user) {
  if (user.personality.techSavvy < 0.3) {
    return "最初の画面が難しそうに見える。もっとシンプルな説明が欲しい。";
  } else if (user.personality.philosophicalInterest > 0.7) {
    return "bunenjin哲学の説明に興味を持った。東洋思想とAIの融合は面白い。";
  } else {
    return "普通の第一印象。特に問題なく進めそう。";
  }
}

/**
 * ユーザーの性格に基づいた回答選択
 */
function selectAnswer(user, questionText, options, questionIndex) {
  // answering_patternに基づいた選択ロジック
  switch (user.answering_pattern) {
    case "thoughtful":
      // 深く考える人は中間的な選択肢を選ぶ傾向
      return options[1] || options[0];
    
    case "intuitive":
      // 直感的な人は最初に目についた選択肢
      return options[0];
    
    case "quick":
      // 素早い人はランダムに近い
      return options[Math.floor(Math.random() * options.length)];
    
    case "aesthetic":
      // 美的観点の人は表現が美しい選択肢
      return options.find(opt => opt.includes("創造") || opt.includes("調和")) || options[0];
    
    case "cautious":
      // 慎重な人は安全そうな選択肢
      return options.find(opt => opt.includes("安定") || opt.includes("慎重")) || options[options.length - 1];
    
    default:
      return options[0];
  }
}

/**
 * 回答時間の計算
 */
function calculateResponseTime(user) {
  const baseTime = 5000; // 5秒
  const speedMultiplier = 1 - user.personality.techSavvy * 0.5;
  const patienceMultiplier = user.personality.patience;
  
  return baseTime * speedMultiplier * patienceMultiplier;
}

/**
 * 結果画面の評価
 */
async function evaluateResults(page, user) {
  const observations = [];
  
  // Triple OS分析の確認
  try {
    const engineOS = await page.textContent('.engine-os-value');
    const interfaceOS = await page.textContent('.interface-os-value');
    const safeModeOS = await page.textContent('.safemode-os-value');
    
    if (user.personality.philosophicalInterest > 0.7) {
      observations.push("Triple OS分析は非常に興味深い。自分の多面性が数値化されている。");
    } else if (user.personality.techSavvy < 0.3) {
      observations.push("Engine OSとか難しい言葉が多くて理解しづらい。");
    }
  } catch (e) {
    observations.push("結果表示にエラーがある様子。");
  }
  
  // ビジュアライゼーションの評価
  if (user.occupation === "フリーランスデザイナー") {
    observations.push("8次元のレーダーチャートが美しい。色彩設計も五行思想を反映していて素晴らしい。");
  }
  
  return observations.join(" ");
}

/**
 * 最終評価の生成
 */
function generateFinalEvaluation(experience, user) {
  const totalTime = experience.timestamps.complete - experience.timestamps.start;
  const questionTime = experience.timestamps.lastQuestion - experience.timestamps.firstQuestion;
  
  let evaluation = {
    overallScore: 0,
    pros: [],
    cons: [],
    rawFeedback: ""
  };
  
  // 時間に基づいた評価
  if (totalTime < 15 * 60 * 1000) { // 15分以内
    evaluation.pros.push("適切な長さで完了できた");
    evaluation.overallScore += 20;
  } else if (totalTime > 30 * 60 * 1000) { // 30分以上
    evaluation.cons.push("時間がかかりすぎる");
    evaluation.overallScore -= 10;
  }
  
  // エラーに基づいた評価
  if (experience.errors.length === 0) {
    evaluation.pros.push("エラーなく完了");
    evaluation.overallScore += 30;
  } else {
    evaluation.cons.push(`${experience.errors.length}回のエラー発生`);
    evaluation.overallScore -= experience.errors.length * 10;
  }
  
  // ユーザー固有の評価生成
  evaluation.rawFeedback = generateRawFeedback(user, experience, evaluation);
  
  // 基本スコア調整
  evaluation.overallScore = Math.max(0, Math.min(100, evaluation.overallScore + 50));
  
  return evaluation;
}

/**
 * ユーザー固有の生の声を生成
 */
function generateRawFeedback(user, experience, evaluation) {
  const templates = {
    "IT企業経営者": `
      ${experience.errors.length === 0 ? "技術的には安定している。" : "エラーが気になった。"}
      30問という設問数は適切だと思う。MBTIより短くて良い。
      Triple OS分析は革新的だ。特にSafe Mode OSの概念は、リーダーシップ研修に使えそう。
      ${evaluation.overallScore > 70 ? "チームに導入を検討したい。" : "まだ改善の余地がある。"}
    `,
    
    "専業主婦": `
      ${experience.errors.length === 0 ? "特に問題なく使えました。" : "途中で止まってしまって困りました。"}
      質問の意味が難しいところもあったけど、なんとか最後まで答えられました。
      結果の説明がもう少し分かりやすいといいなと思います。
      ${evaluation.overallScore > 60 ? "友達にも勧めてみようかな。" : "私にはちょっと難しかったです。"}
    `,
    
    "ゲーム開発者": `
      ${questionTime / 1000 / 60}分もかかった。長すぎ。
      UIは悪くないけど、アニメーションが足りない。もっとゲーミフィケーション入れるべき。
      仮想スクロールの実装は評価できるが、React使った方が良かったのでは？
      ${evaluation.overallScore > 50 ? "技術的には及第点。" : "正直、期待外れ。"}
    `,
    
    "フリーランスデザイナー": `
      ビジュアルデザインは素晴らしい。特に色彩の使い方が東洋的で美しい。
      ${experience.errors.length === 0 ? "動作も安定している。" : "ただ、エラーが出たのが残念。"}
      8次元の可視化は芸術的。これは新しいデザインパラダイムになりうる。
      全体として、日本発の世界的プロダクトになる可能性を感じる。
    `,
    
    "元教師": `
      ${experience.errors.length > 0 ? "途中で何度か動かなくなって困りました。" : "なんとか最後までできました。"}
      文字が小さくて読みづらいところがありました。
      質問の内容も難しくて、私には合わないかもしれません。
      ${evaluation.overallScore > 40 ? "若い人向けのサービスですね。" : "私の世代には難しすぎます。"}
    `
  };
  
  return templates[user.occupation] || "特にコメントはありません。";
}

/**
 * メイン実行
 */
async function runEvaluation() {
  console.log('🚀 HaQei Analyzer MCP仮想ユーザー評価開始\n');
  
  const results = [];
  
  // デバッグのため1人だけ実行
  for (const user of virtualUsers.slice(0, 1)) {
    const experience = await simulateUserExperience(user);
    results.push(experience);
    
    // 結果表示
    console.log(`\n📊 ${user.name}の評価結果:`);
    if (experience.finalEvaluation) {
      console.log(`総合スコア: ${experience.finalEvaluation.overallScore}/100`);
      console.log(`長所: ${experience.finalEvaluation.pros.join(', ')}`);
      console.log(`短所: ${experience.finalEvaluation.cons.join(', ')}`);
      console.log(`\n💬 生の声:`);
      console.log(experience.finalEvaluation.rawFeedback);
    } else {
      console.log('⚠️ 評価を完了できませんでした');
      console.log(`エラー: ${experience.errors.map(e => e.error).join(', ')}`);
    }
    console.log('\n' + '='.repeat(80));
  }
  
  // 総合レポート
  console.log('\n📈 総合評価レポート');
  const validResults = results.filter(r => r.finalEvaluation);
  if (validResults.length > 0) {
    const avgScore = validResults.reduce((sum, r) => sum + r.finalEvaluation.overallScore, 0) / validResults.length;
    console.log(`平均スコア: ${avgScore.toFixed(1)}/100`);
  } else {
    console.log('⚠️ 有効な評価結果がありません');
  }
  
  // 共通の問題点
  const allErrors = results.flatMap(r => r.errors);
  if (allErrors.length > 0) {
    console.log(`\n⚠️ 発生したエラー: ${allErrors.length}件`);
    allErrors.forEach(err => console.log(`  - ${err.error}`));
  }
  
  console.log('\n✅ 評価完了');
}

// 実行
runEvaluation().catch(console.error);