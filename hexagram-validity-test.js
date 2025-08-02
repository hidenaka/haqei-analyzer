/**
 * 状況卦妥当性検証システム
 * テキスト内容と選出された卦の適切性を評価
 */

// 易経64卦の基本情報と適用状況
const HEXAGRAM_CONTEXTS = {
  1: { name: '乾為天', themes: ['創始', '積極性', 'リーダーシップ', '男性的エネルギー'], situations: ['新規事業', '挑戦', '指導的立場'] },
  2: { name: '坤為地', themes: ['受容', '柔軟性', '母性', '支援'], situations: ['協力', '受け身の立場', '育成'] },
  3: { name: '水雷屯', themes: ['困難', '始まり', '混乱', '成長痛'], situations: ['初期の困難', '新しい環境', '準備期間'] },
  4: { name: '山水蒙', themes: ['学習', '無知', '教育', '啓発'], situations: ['学び', '指導を受ける', '経験不足'] },
  5: { name: '水天需', themes: ['待機', '忍耐', '準備', '時機'], situations: ['待つ時期', '準備期間', 'タイミング待ち'] },
  6: { name: '天水訟', themes: ['争い', '対立', '法的問題', '論争'], situations: ['紛争', '意見対立', '権利主張'] },
  7: { name: '地水師', themes: ['組織', 'チームワーク', '規律', '統率'], situations: ['チーム管理', '組織運営', '集団行動'] },
  8: { name: '水地比', themes: ['協調', '親密', '結束', '連帯'], situations: ['仲間作り', '協力関係', '結束'] },
  9: { name: '風天小畜', themes: ['小さな蓄積', '節制', '準備', '抑制'], situations: ['準備期間', '自制', '小さな進歩'] },
  10: { name: '天沢履', themes: ['行動', '実践', '礼儀', '慎重'], situations: ['実行段階', '慎重な行動', 'マナー'] },
  
  // 人間関係関連の卦
  31: { name: '沢山咸', themes: ['感応', '恋愛', '相互作用', '感情'], situations: ['恋愛関係', '感情的つながり', '相互理解'] },
  32: { name: '雷風恒', themes: ['持続', '継続', '安定', '永続'], situations: ['長期関係', '継続的努力', '安定維持'] },
  37: { name: '風火家人', themes: ['家族', '家庭', '内部', '私的'], situations: ['家庭問題', '家族関係', '内輪のこと'] },
  
  // ビジネス・仕事関連の卦
  14: { name: '火天大有', themes: ['豊かさ', '成功', '繁栄', '大成'], situations: ['事業成功', '豊かな成果', '充実'] },
  18: { name: '山風蠱', themes: ['腐敗', '改革', '修正', '立て直し'], situations: ['問題修正', '改革', '立て直し'] },
  21: { name: '火雷噬嗑', themes: ['決断', '処理', '解決', '処罰'], situations: ['問題解決', '決断', '処理'] },
  25: { name: '天雷無妄', themes: ['無心', '自然', '純粋', '災害'], situations: ['予期しない出来事', '自然な流れ'] },
  
  // 個人的成長・哲学的な卦
  1: { name: '乾為天', themes: ['創造', '積極', '天', '父'], situations: ['新しい始まり', 'リーダーシップ', '積極的行動'] },
  22: { name: '山火贲', themes: ['美', '装飾', '外見', '文化'], situations: ['美的感覚', '文化活動', '外見重視'] },
  27: { name: '山雷頤', themes: ['養う', '栄養', 'ケア', '育成'], situations: ['健康管理', '人を育てる', 'セルフケア'] },
  
  // 時間・変化関連の卦
  49: { name: '沢火革', themes: ['革命', '変革', '改革', '新しい'], situations: ['大きな変化', '革新', '転換点'] },
  50: { name: '火風鼎', themes: ['変革完成', '新秩序', '文明', '鼎新'], situations: ['変革の完成', '新体制', '文明的発展'] },
  64: { name: '火水未済', themes: ['未完成', '継続', '進行中', '課題'], situations: ['未完了の状態', '継続中の努力', '発展途上'] }
};

// テストケース定義
const TEST_CASES = [
  {
    id: 'personal_anxiety',
    text: '私は最近とても不安に感じています。将来のことを考えると夜も眠れず、自分に自信が持てません。',
    expectedContext: 'personal',
    validHexagrams: [3, 4, 5, 27, 29, 47], // 屯、蒙、需、頤、坎、困 など
    invalidHexagrams: [1, 14, 58], // 乾、大有、兌 など（積極的すぎる）
    reasoning: '個人的な不安と自信の欠如には、困難な状況（屯）、学びの必要性（蒙）、待機の時（需）、自己ケア（頤）などが適切'
  },
  {
    id: 'workplace_relationship',
    text: '職場の上司との関係に悩んでいます。コミュニケーションがうまくいかず、毎日がストレスです。',
    expectedContext: 'relationship',
    validHexagrams: [6, 18, 38, 45, 47], // 訟、蠱、睽、萃、困
    invalidHexagrams: [8, 31], // 比、咸（調和的すぎる）
    reasoning: '上司との対立には争い（訟）、関係修復（蠱）、意見の相違（睽）、ストレス（困）などが適切'
  },
  {
    id: 'career_decision',
    text: '転職を考えているが、家族のことも心配で決断できない。経済的な不安もあり、どうすればいいかわからない。',
    expectedContext: 'hybrid', // business + relationship + personal
    validHexagrams: [5, 21, 25, 47, 64], // 需、噬嗑、無妄、困、未済
    invalidHexagrams: [1, 14], // 乾、大有（決断済みを示唆）
    reasoning: '複合的な悩みには待機の時（需）、決断の必要性（噬嗑）、困難な状況（困）、未解決状態（未済）が適切'
  },
  {
    id: 'life_meaning',
    text: '人生の意味がわからなくなりました。存在することの価値について深く考えています。',
    expectedContext: 'philosophical',
    validHexagrams: [4, 20, 22, 27, 61], // 蒙、観、贲、頤、中孚
    invalidHexagrams: [14, 58], // 大有、兌（物質的・享楽的）
    reasoning: '哲学的探求には学び（蒙）、観察・瞑想（観）、内的養成（頤）、真実の探求（中孚）が適切'
  },
  {
    id: 'technical_choice',
    text: 'APIの設計で悩んでいます。RESTとGraphQLどちらを選ぶべきか、アーキテクチャの決定に迷っています。',
    expectedContext: 'technical',
    validHexagrams: [5, 21, 43, 50], // 需、噬嗑、夬、鼎
    invalidHexagrams: [2, 31], // 坤、咸（受動的・感情的）
    reasoning: '技術的決断には慎重な検討（需）、明確な判断（噬嗑）、決断（夬）、新しい秩序（鼎）が適切'
  },
  {
    id: 'emotional_extreme',
    text: 'もう本当に嫌だ！！！絶対に無理！！死にたい！！！',
    expectedContext: 'personal',
    validHexagrams: [29, 47, 36, 39], // 坎、困、明夷、蹇
    invalidHexagrams: [1, 14, 58], // 乾、大有、兌（ポジティブすぎる）
    reasoning: '極度の絶望状態には危険（坎）、困窮（困）、暗闇（明夷）、難しい状況（蹇）が適切'
  },
  {
    id: 'short_input',
    text: '困った',
    expectedContext: 'hybrid',
    validHexagrams: [3, 4, 5, 47], // 屯、蒙、需、困
    invalidHexagrams: [1, 14], // 乾、大有（積極的すぎる）
    reasoning: '短い表現での困惑には基本的な困難状況を示す卦が適切'
  }
];

class HexagramValidityTester {
  constructor() {
    this.testResults = [];
    this.validityScores = [];
  }

  /**
   * 卦の妥当性を評価
   * @param {string} inputText - 入力テキスト
   * @param {number} selectedHexagram - 選出された卦番号
   * @param {number} selectedLine - 選出された爻
   * @param {string} detectedContext - 検出されたコンテキスト
   * @param {Object} testCase - テストケース情報
   * @returns {Object} 評価結果
   */
  evaluateHexagramValidity(inputText, selectedHexagram, selectedLine, detectedContext, testCase) {
    const evaluation = {
      testId: testCase.id,
      inputText,
      selectedHexagram,
      selectedHexagramName: HEXAGRAM_CONTEXTS[selectedHexagram]?.name || '不明',
      selectedLine,
      detectedContext,
      expectedContext: testCase.expectedContext,
      isValidHexagram: false,
      isInvalidHexagram: false,
      contextMatch: false,
      validityScore: 0,
      reasoning: '',
      issues: []
    };

    // コンテキスト一致性チェック
    evaluation.contextMatch = detectedContext === testCase.expectedContext || testCase.expectedContext === 'hybrid';
    if (!evaluation.contextMatch) {
      evaluation.issues.push(`コンテキスト不一致: 期待=${testCase.expectedContext}, 検出=${detectedContext}`);
    }

    // 卦の適切性チェック
    evaluation.isValidHexagram = testCase.validHexagrams.includes(selectedHexagram);
    evaluation.isInvalidHexagram = testCase.invalidHexagrams.includes(selectedHexagram);

    if (evaluation.isValidHexagram) {
      evaluation.validityScore += 70; // 基本点
      evaluation.reasoning += `✅ 適切な卦: ${HEXAGRAM_CONTEXTS[selectedHexagram]?.name} - `;
      evaluation.reasoning += `${testCase.reasoning}`;
    } else if (evaluation.isInvalidHexagram) {
      evaluation.validityScore -= 30;
      evaluation.reasoning += `❌ 不適切な卦: ${HEXAGRAM_CONTEXTS[selectedHexagram]?.name} - `;
      evaluation.reasoning += `この状況には適さない`;
      evaluation.issues.push('明らかに不適切な卦が選出された');
    } else {
      evaluation.validityScore += 30; // 中間的評価
      evaluation.reasoning += `⚠️ 中間的妥当性: ${HEXAGRAM_CONTEXTS[selectedHexagram]?.name} - `;
      evaluation.reasoning += `適切でも不適切でもない`;
    }

    // コンテキスト適合性による加点
    if (evaluation.contextMatch) {
      evaluation.validityScore += 20;
    }

    // 爻の妥当性チェック（簡易版）
    if (selectedLine >= 1 && selectedLine <= 6) {
      evaluation.validityScore += 10;
    } else {
      evaluation.issues.push(`不正な爻番号: ${selectedLine}`);
    }

    // 最終スコア調整
    evaluation.validityScore = Math.max(0, Math.min(100, evaluation.validityScore));

    return evaluation;
  }

  /**
   * テキスト内容の感情・状況分析
   * @param {string} text - 分析対象テキスト
   * @returns {Object} 分析結果
   */
  analyzeTextContent(text) {
    const analysis = {
      emotionalTone: 'neutral',
      urgencyLevel: 'low',
      complexity: 'simple',
      keywords: [],
      suggestedThemes: []
    };

    // 感情的トーン分析
    const negativeWords = ['不安', '心配', '困', '嫌', '無理', '死', 'ストレス', '悩', '辛', '苦'];
    const positiveWords = ['嬉しい', '楽しい', '良い', '満足', '幸せ', '成功'];
    const extremeWords = ['絶対', '必ず', '死ぬ', '最悪', '!!!', '！！！'];

    let negativeCount = negativeWords.filter(word => text.includes(word)).length;
    let positiveCount = positiveWords.filter(word => text.includes(word)).length;
    let extremeCount = extremeWords.filter(word => text.includes(word)).length;

    if (extremeCount > 0) {
      analysis.emotionalTone = 'extreme_negative';
      analysis.urgencyLevel = 'high';
    } else if (negativeCount > positiveCount) {
      analysis.emotionalTone = 'negative';
      analysis.urgencyLevel = negativeCount > 2 ? 'high' : 'medium';
    } else if (positiveCount > negativeCount) {
      analysis.emotionalTone = 'positive';
    }

    // 複雑さ分析
    const complexityWords = ['家族', '経済', '将来', '転職', '決断', '関係', '意味', '価値'];
    const complexityCount = complexityWords.filter(word => text.includes(word)).length;
    
    if (complexityCount >= 3) {
      analysis.complexity = 'complex';
    } else if (complexityCount >= 1) {
      analysis.complexity = 'moderate';
    }

    // キーワード抽出
    analysis.keywords = [...negativeWords, ...positiveWords, ...complexityWords]
      .filter(word => text.includes(word));

    return analysis;
  }

  /**
   * 専門的な卦の妥当性評価
   * @param {Object} evaluation - 基本評価結果
   * @param {Object} textAnalysis - テキスト分析結果
   * @returns {Object} 拡張評価結果
   */
  enhancedValidityEvaluation(evaluation, textAnalysis) {
    const enhanced = { ...evaluation };
    
    // 感情トーンと卦の一致性
    const hexagramInfo = HEXAGRAM_CONTEXTS[evaluation.selectedHexagram];
    if (hexagramInfo) {
      const hexagramThemes = hexagramInfo.themes;
      
      // 極度にネガティブな感情状態の場合
      if (textAnalysis.emotionalTone === 'extreme_negative') {
        const crisisHexagrams = [29, 47, 36, 39]; // 坎、困、明夷、蹇
        if (crisisHexagrams.includes(evaluation.selectedHexagram)) {
          enhanced.validityScore += 15;
          enhanced.reasoning += ' [危機状況への適切な対応]';
        } else if ([1, 14, 58].includes(evaluation.selectedHexagram)) {
          enhanced.validityScore -= 20;
          enhanced.reasoning += ' [危機状況に不適切]';
          enhanced.issues.push('極度のネガティブ感情にポジティブすぎる卦');
        }
      }
      
      // 複雑な状況の場合
      if (textAnalysis.complexity === 'complex') {
        const complexHexagrams = [5, 21, 64]; // 需、噬嗑、未済
        if (complexHexagrams.includes(evaluation.selectedHexagram)) {
          enhanced.validityScore += 10;
          enhanced.reasoning += ' [複雑な状況への適切な対応]';
        }
      }
    }

    return enhanced;
  }

  /**
   * テスト実行と結果評価
   * @param {Array} actualResults - 実際の分析結果
   * @returns {Object} 総合評価結果
   */
  runValidityTests(actualResults) {
    const results = {
      totalTests: actualResults.length,
      validResults: 0,
      invalidResults: 0,
      averageValidityScore: 0,
      detailedEvaluations: [],
      overallAssessment: ''
    };

    actualResults.forEach((result, index) => {
      const testCase = TEST_CASES[index];
      if (!testCase) return;

      const textAnalysis = this.analyzeTextContent(testCase.text);
      const basicEvaluation = this.evaluateHexagramValidity(
        testCase.text,
        result.hexagram,
        result.line,
        result.context,
        testCase
      );
      
      const finalEvaluation = this.enhancedValidityEvaluation(basicEvaluation, textAnalysis);
      finalEvaluation.textAnalysis = textAnalysis;
      
      results.detailedEvaluations.push(finalEvaluation);
      
      if (finalEvaluation.validityScore >= 70) {
        results.validResults++;
      } else {
        results.invalidResults++;
      }
    });

    // 平均妥当性スコア計算
    if (results.detailedEvaluations.length > 0) {
      results.averageValidityScore = results.detailedEvaluations
        .reduce((sum, eval) => sum + eval.validityScore, 0) / results.detailedEvaluations.length;
    }

    // 総合評価
    if (results.averageValidityScore >= 85) {
      results.overallAssessment = '優秀: 卦の選出が非常に適切';
    } else if (results.averageValidityScore >= 70) {
      results.overallAssessment = '良好: 概ね適切な卦が選出されている';
    } else if (results.averageValidityScore >= 50) {
      results.overallAssessment = '要改善: 一部不適切な卦が選出されている';
    } else {
      results.overallAssessment = '不十分: 卦の選出精度に大きな問題';
    }

    return results;
  }

  /**
   * 結果レポート生成
   * @param {Object} validityResults - 妥当性テスト結果
   * @returns {string} レポート文字列
   */
  generateValidityReport(validityResults) {
    let report = '\n=== 状況卦妥当性検証レポート ===\n\n';
    
    report += `📊 総合結果:\n`;
    report += `テスト総数: ${validityResults.totalTests}\n`;
    report += `適切な結果: ${validityResults.validResults}\n`;
    report += `不適切な結果: ${validityResults.invalidResults}\n`;
    report += `平均妥当性スコア: ${Math.round(validityResults.averageValidityScore)}%\n`;
    report += `総合評価: ${validityResults.overallAssessment}\n\n`;

    report += `📝 詳細評価:\n`;
    validityResults.detailedEvaluations.forEach((eval, index) => {
      report += `\n--- テスト ${index + 1}: ${eval.testId} ---\n`;
      report += `入力: "${eval.inputText.substring(0, 50)}..."\n`;
      report += `選出卦: ${eval.selectedHexagram}卦 ${eval.selectedHexagramName} ${eval.selectedLine}爻\n`;
      report += `コンテキスト: ${eval.detectedContext} (期待: ${eval.expectedContext})\n`;
      report += `妥当性スコア: ${eval.validityScore}%\n`;
      report += `評価: ${eval.reasoning}\n`;
      
      if (eval.issues.length > 0) {
        report += `問題点: ${eval.issues.join(', ')}\n`;
      }
      
      report += `感情分析: ${eval.textAnalysis.emotionalTone} (緊急度: ${eval.textAnalysis.urgencyLevel})\n`;
    });

    return report;
  }
}

export { HexagramValidityTester, TEST_CASES, HEXAGRAM_CONTEXTS };