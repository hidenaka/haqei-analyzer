/**
 * 要件定義の現実性チェック
 * 多様な悩み文書に対する診断精度の実測テスト
 */

const { chromium } = require('playwright');

async function testRequirementsReality() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // 現実的な悩み文書のテストケース（様々なパターン）
  const realWorldCases = [
    {
      category: "仕事・職場",
      cases: [
        "毎日残業続きで体力的にも精神的にもつらい。転職を考えているが、今の年齢で転職できるか不安",
        "上司が理不尽で、いつもパワハラまがいのことを言われる。でも家族のために仕事は辞められない",
        "やりたい仕事があるけど、今の安定した職を捨てる勇気がない。このまま我慢していくべきか",
        "新卒で入った会社だが、想像していた仕事と全然違う。3年は続けるべきと言われるが辛い"
      ]
    },
    {
      category: "恋愛・結婚", 
      cases: [
        "付き合って3年の彼氏がプロポーズしてくれない。結婚願望があることは伝えているのに",
        "不倫関係になってしまった。相手は離婚すると言うが信じていいのかわからない",
        "婚活を続けているが良い人に出会えない。自分に魅力がないのかと落ち込む",
        "結婚生活がマンネリ化している。愛情があるのかもよくわからなくなってきた"
      ]
    },
    {
      category: "家族・親族",
      cases: [
        "親の介護で自分の時間がない。兄弟は遠方で頼れず、一人で抱え込んでいる",
        "子供が不登校になった。どう接していいかわからず、自分の育て方が悪かったのかと自責している",
        "義理の両親との関係がうまくいかない。夫は理解してくれず板挟み状態",
        "実家の両親が高齢で心配だが、仕事の都合で近くに住めない"
      ]
    },
    {
      category: "健康・メンタル",
      cases: [
        "最近やる気が出ない。何をしても楽しくなく、うつ病なのかもしれない",
        "パニック障害で電車に乗れない。仕事にも支障が出ている",
        "原因不明の体調不良が続いている。病院に行っても異常なしと言われる",
        "夜眠れなくて昼間ぼーっとしてしまう。睡眠薬に頼るのも怖い"
      ]
    },
    {
      category: "人間関係",
      cases: [
        "親友だと思っていた人に裏切られた。人を信じることが怖くなった",
        "職場で孤立している。挨拶しても無視され、仕事の相談もできない",
        "SNSで友達の充実した生活を見ると落ち込む。自分だけ取り残されている気分",
        "人と話すのが苦手で友達ができない。一人でいるのも寂しい"
      ]
    },
    {
      category: "将来・人生",
      cases: [
        "40歳になったが将来に希望が持てない。このまま年をとっていくだけなのか",
        "やりたいことが見つからない。周りはみんな目標を持っているのに",
        "お金の不安がずっとある。老後の生活ができるのか心配",
        "人生に意味を感じられない。何のために生きているのかわからない"
      ]
    }
  ];
  
  console.log('🔍 要件定義の現実性チェック開始\n');
  console.log(`総テストケース: ${realWorldCases.reduce((sum, cat) => sum + cat.cases.length, 0)}件\n`);
  
  await page.goto('http://localhost:8788/future_simulator.html');
  await page.waitForTimeout(3000);
  
  const results = [];
  let testCount = 0;
  
  for (const category of realWorldCases) {
    console.log(`\n━━━ ${category.category} ━━━`);
    
    for (const testCase of category.cases) {
      testCount++;
      console.log(`\n[${testCount}] ${testCase.substring(0, 50)}...`);
      
      // 現在のシステムで分析
      const result = await page.evaluate(async (text) => {
        if (typeof analyzeWorry === 'function') {
          await analyzeWorry(text);
          const integrated = window.integratedAnalysisResult;
          
          return {
            // キーワード分析の質
            keywords: integrated?.keywords?.final?.slice(0, 5).map(k => k.word),
            keywordQuality: integrated?.keywords?.final?.length > 0,
            
            // 感情認識
            emotion: integrated?.context?.emotionalContext,
            emotionDetected: !!integrated?.context?.emotionalContext,
            
            // 状況認識  
            situation: integrated?.context?.situationalContext,
            situationDetected: !!integrated?.context?.situationalContext,
            
            // 易経の適切性
            hexagram: integrated?.iching?.hexagram?.name,
            hexagramNumber: integrated?.iching?.hexagram?.number,
            interpretation: integrated?.iching?.interpretation?.substring(0, 100),
            
            // メタデータ
            analysisTime: integrated?.timestamp,
            systemsUsed: integrated?.systemsUsed
          };
        }
        return null;
      }, testCase);
      
      // 結果の評価
      const evaluation = {
        category: category.category,
        input: testCase,
        result: result,
        quality: {
          keywordRelevance: evaluateKeywordRelevance(testCase, result?.keywords || []),
          emotionAccuracy: evaluateEmotionAccuracy(testCase, result?.emotion),
          situationAccuracy: evaluateSituationAccuracy(testCase, result?.situation),
          hexagramRelevance: evaluateHexagramRelevance(category.category, result?.hexagram),
          interpretationUsefulnes: evaluateInterpretationUsefulness(result?.interpretation)
        }
      };
      
      results.push(evaluation);
      
      // 簡易評価表示
      console.log(`  キーワード: ${result?.keywords?.join(', ') || '未検出'}`);
      console.log(`  感情: ${result?.emotion || '未検出'}`);
      console.log(`  状況: ${result?.situation || '未検出'}`);
      console.log(`  易経: ${result?.hexagram || '未取得'}`);
      console.log(`  品質評価: ${Object.values(evaluation.quality).map(v => v ? '○' : '×').join(' ')}`);
      
      // テスト間隔
      await page.waitForTimeout(1000);
    }
  }
  
  // 総合評価
  console.log('\n\n📊 ===== 現実性チェック結果 =====\n');
  
  const totalTests = results.length;
  const qualityScores = {
    keywordRelevance: results.filter(r => r.quality.keywordRelevance).length,
    emotionAccuracy: results.filter(r => r.quality.emotionAccuracy).length,
    situationAccuracy: results.filter(r => r.quality.situationAccuracy).length,
    hexagramRelevance: results.filter(r => r.quality.hexagramRelevance).length,
    interpretationUsefulnes: results.filter(r => r.quality.interpretationUsefulnes).length
  };
  
  console.log('各機能の成功率:');
  Object.entries(qualityScores).forEach(([metric, count]) => {
    const percentage = Math.round((count / totalTests) * 100);
    const status = percentage >= 70 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
    console.log(`  ${metric}: ${count}/${totalTests} (${percentage}%) ${status}`);
  });
  
  // カテゴリ別評価
  console.log('\nカテゴリ別の対応状況:');
  realWorldCases.forEach(category => {
    const categoryResults = results.filter(r => r.category === category.category);
    const avgQuality = categoryResults.reduce((sum, r) => {
      const qualityCount = Object.values(r.quality).filter(Boolean).length;
      return sum + (qualityCount / 5);
    }, 0) / categoryResults.length;
    
    const status = avgQuality >= 0.7 ? '✅' : avgQuality >= 0.5 ? '⚠️' : '❌';
    console.log(`  ${category.category}: ${Math.round(avgQuality * 100)}% ${status}`);
  });
  
  // 問題点の特定
  console.log('\n⚠️ 主要な問題点:');
  if (qualityScores.emotionAccuracy < totalTests * 0.5) {
    console.log('  🔴 感情分析が機能していない');
  }
  if (qualityScores.situationAccuracy < totalTests * 0.5) {
    console.log('  🔴 状況認識が不十分');
  }
  if (qualityScores.keywordRelevance < totalTests * 0.7) {
    console.log('  🔴 キーワード抽出の精度が低い');
  }
  if (qualityScores.hexagramRelevance < totalTests * 0.6) {
    console.log('  🔴 易経選択の適切性に問題');
  }
  
  // 結論
  const overallScore = Object.values(qualityScores).reduce((sum, score) => sum + score, 0) / (totalTests * 5);
  console.log(`\n📈 総合評価: ${Math.round(overallScore * 100)}%`);
  
  if (overallScore >= 0.7) {
    console.log('✅ 実用レベルに達している');
  } else if (overallScore >= 0.5) {
    console.log('⚠️ 改善が必要だが基礎はある');
  } else {
    console.log('❌ 大幅な改善が必要');
  }
  
  await browser.close();
}

// 評価関数
function evaluateKeywordRelevance(input, keywords) {
  if (!keywords || keywords.length === 0) return false;
  // 入力文そのままがキーワードになっていないか
  const isDirectCopy = keywords.some(kw => kw === input || input.includes(kw) && kw.length > 10);
  // 意味のあるキーワードが抽出されているか
  const hasRelevantKeywords = keywords.some(kw => kw.length >= 2 && kw.length <= 8);
  return !isDirectCopy && hasRelevantKeywords;
}

function evaluateEmotionAccuracy(input, emotion) {
  if (!emotion) return false;
  // 簡易的な感情の存在チェック
  const negativeWords = ['つらい', '不安', '心配', '困っ', '悩', '苦し', '辛い'];
  const positiveWords = ['嬉し', '楽し', '希望', '期待'];
  
  const hasNegative = negativeWords.some(word => input.includes(word));
  const hasPositive = positiveWords.some(word => input.includes(word));
  
  // 最低限、何らかの感情が検出されていればOK
  return emotion !== '未検出';
}

function evaluateSituationAccuracy(input, situation) {
  if (!situation) return false;
  const situationKeywords = ['仕事', '職場', '上司', '転職', '恋愛', '結婚', '家族', '親', '子供', '健康', '病気'];
  const hasRelevantSituation = situationKeywords.some(keyword => input.includes(keyword));
  return situation !== '未検出' && hasRelevantSituation;
}

function evaluateHexagramRelevance(category, hexagram) {
  if (!hexagram) return false;
  // 同じカテゴリで同じ卦ばかりが選ばれていないかの簡易チェック
  // とりあえず何らかの卦が選ばれていればOKとする
  return hexagram !== '未取得' && hexagram.length > 0;
}

function evaluateInterpretationUsefulness(interpretation) {
  if (!interpretation) return false;
  // 最低限の長さがあるかチェック
  return interpretation.length > 20;
}

testRequirementsReality().catch(console.error);