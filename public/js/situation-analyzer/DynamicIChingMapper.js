/**
 * 動的易経マッピングシステム
 * 
 * 状況分析結果を易経の64卦に動的にマッピングし、
 * 最も適切な卦と爻を選択する革新的システム
 */

class DynamicIChingMapper {
  constructor() {
    // HexagramDatabaseが利用可能な場合は使用、そうでない場合は動的にロード
    try {
      this.hexagramEssences = window.HexagramDatabase || this.loadHexagramDatabase();
    } catch (error) {
      console.error('HexagramDatabase読み込みエラー:', error);
      // フォールバックとして基本的な卦のみ定義
      this.hexagramEssences = this.getBasicHexagrams();
    }
    
    // 爻位置の意味（1-6）
    this.linePositions = {
      1: { name: '初爻', meaning: '事の始まり、潜在的な状態', weight: 0.8 },
      2: { name: '二爻', meaning: '内的な対応、慎重な行動', weight: 0.9 },
      3: { name: '三爻', meaning: '転換点、危険と機会', weight: 1.0 },
      4: { name: '四爻', meaning: '外的な対応、社会との関わり', weight: 0.9 },
      5: { name: '五爻', meaning: '中心的位置、リーダーシップ', weight: 1.1 },
      6: { name: '上爻', meaning: '極まった状態、転換の必要', weight: 0.8 }
    };
    
    // TDD Green新設: 使用頻度統計（希少卦ボーナス用）
    this.usageStatistics = {};
    
    // TDD Green新設: フォールバックレベル管理
    this.fallbackLevel = 64;
    this.fallbackInfo = { isActive: false, level: 64 };
  }
  
  /**
   * 状況分析結果から最適な卦を選択
   * 
   * 目的：
   * - SituationClassifierの分析結果を易経64卦の中から最適な卦にマッピング
   * - 主要卦・代替卦・爻位置・動的解釈を統合的に生成
   * - bunenjin哲学に基づく易経メタファーによる状況理解の提供
   * 
   * 入力：
   * @param {Object} situationAnalysis - SituationClassifierの分析結果
   *   - essence: {archetype, temporalState, dynamicBalance, relationalFocus}
   *   - transformation: {from, to, obstacles, resources}
   *   - metadata: {confidence, complexity, urgency}
   * 
   * 処理内容：
   * 1. 分析結果のフォーマット変換（formatForIChingMapping）
   * 2. 64卦それぞれとの適合度スコア計算（重み付け合計100点満点）
   * 3. 上位3卦の選択（primary + alternatives 2つ）
   * 4. 最適爻位置の決定（1-6爻の中から状況に最適な位置）
   * 5. 動的解釈生成（状況・指針・警告・機会・タイミング）
   * 6. マッピング信頼度計算
   * 
   * 出力：
   * @returns {Object} 易経マッピング結果
   *   - primary: {hexagram, score, essence, matchDetails} メイン卦
   *   - alternatives: Array<{hexagram, score, essence}> 代替卦（2つ）
   *   - line: {position, name, meaning, weight, score} 最適爻位置
   *   - interpretation: {situation, guidance, warnings, opportunities, timing} 動的解釈
   *   - confidence: 0-1のマッピング信頼度
   * 
   * 副作用：
   * - console.error（HexagramDatabase読み込み失敗時）
   * - console.warn（フォールバックモード使用時）
   * 
   * 前提条件：
   * - this.hexagramEssences が適切に初期化されている（64卦 or 8卦フォールバック）
   * - this.linePositions が1-6爻の定義を持つ
   * 
   * 【重要な問題】18個未使用卦の根本原因：
   * 1. フォールバック時は8卦のみ使用（56卦が完全未使用）
   * 2. アーキタイプ一致（30点）+ 時間軸一致（20点）= 50点の巨大重み
   * 3. 同じarchetype/temporalの卦群のみが高スコアとなり、他が選ばれない
   * 4. 力学類似度（25点）も固定4パターンでの数値化のため多様性不足
   */
  mapToHexagram(situationAnalysis) {
    const formattedAnalysis = situationAnalysis.formatForIChingMapping 
      ? situationAnalysis.formatForIChingMapping(situationAnalysis)
      : situationAnalysis;
    
    // 各卦との適合度を計算
    const hexagramScores = this.calculateHexagramScores(formattedAnalysis);
    
    // 最適な卦を選択（複数候補も返す）
    const topHexagrams = this.selectTopHexagrams(hexagramScores, 3);
    
    // 最適な爻位置を決定
    const optimalLine = this.determineOptimalLine(formattedAnalysis, topHexagrams[0]);
    
    // 動的解釈を生成
    const interpretation = this.generateDynamicInterpretation(
      formattedAnalysis,
      topHexagrams[0],
      optimalLine
    );
    
    // TDD Green修正: 使用統計更新
    this.updateUsageStatistics(topHexagrams[0].hexagram);
    
    return {
      primary: topHexagrams[0],
      alternatives: topHexagrams.slice(1),
      line: optimalLine,
      interpretation: interpretation,
      confidence: this.calculateMappingConfidence(formattedAnalysis, topHexagrams[0]),
      // TDD Green新設: フォールバック情報とメタデータ
      fallbackInfo: this.fallbackInfo,
      metadata: {
        availableHexagrams: Object.keys(this.hexagramEssences).length,
        qualityLevel: this.fallbackLevel / 64
      },
      diversityBonus: topHexagrams[0].details?.rarityBonus ? {
        appliedHexagrams: [topHexagrams[0].hexagram],
        bonusAmount: topHexagrams[0].details.rarityBonus
      } : null
    };
  }
  
  /**
   * 各卦との適合度スコアを計算
   * 
   * 目的：
   * - 64卦（または8卦）それぞれと入力状況の適合度を数値化
   * - 重み付け合計により最適卦を客観的に選択
   * 
   * 入力：
   * @param {Object} analysis - formatForIChingMapping変換済みの分析結果
   * 
   * 処理内容：
   * 1. 各卦をループしてスコア計算（合計100点満点）
   *    - アーキタイプ一致: 30点（最重要）
   *    - 時間軸一致: 20点
   *    - 力学類似度: 25点（コサイン類似度）
   *    - 変化適合度: 15点
   *    - 複雑さ調整: 10点
   * 2. 詳細情報付きスコアオブジェクト生成
   * 
   * 出力：
   * @returns {Object} 卦番号をキーとするスコア辞書
   *   - hexagram: 卦番号
   *   - score: 総合スコア（0-100点）
   *   - details: {archetype, temporal, dynamics, transformation} マッチ詳細
   * 
   * 【偏重問題の核心】：
   * - アーキタイプ + 時間軸で50点（全体の半分）
   * - transformation卦は "transformation" + "transitional" で50点確保
   * - 他のアーキタイプは基本30点止まりで不利
   * - 力学類似度も4パターン固定のため、同一パターン卦が同スコアに
   */
  calculateHexagramScores(analysis) {
    const scores = {};
    
    // TDD Green修正: 使用頻度統計を取得（希少卢ボーナス用）
    const usageStats = this.getUsageStatistics ? this.getUsageStatistics() : {};
    
    Object.entries(this.hexagramEssences).forEach(([hexNum, hexagram]) => {
      let score = 0;
      
      // TDD Green修正: archetype重み 30 → 20 に削減（多様性向上）
      if (hexagram.archetype === analysis.essence.archetype) {
        score += 20;
      }
      
      // TDD Green修正: temporal重み 20 → 10 に大幅削減（偏重解消）
      if (hexagram.temporal === analysis.essence.temporalState) {
        score += 10;
      }
      
      // TDD Green修正: dynamics重み 25 → 30 に強化（力学的類似度重視）
      score += this.calculateDynamicsSimilarity(
        hexagram.dynamics,
        analysis.essence.dynamicBalance
      ) * 30;
      
      // TDD Green修正: transformation重み 15 → 20 に強化
      score += this.calculateTransformationFit(
        hexagram,
        analysis.transformation
      ) * 20;
      
      // TDD Green修正: complexity重み 10 → 10 維持
      score += this.adjustForComplexity(
        hexagram,
        analysis.metadata
      ) * 10;
      
      // TDD Green新設: 希少卢ボーナス機構（10点枠）
      const usageCount = usageStats[hexNum] || 0;
      const rarityBonus = this.calculateRarityBonus(usageCount);
      score += rarityBonus;
      
      scores[hexNum] = {
        hexagram: hexNum,
        score: score,
        details: {
          archetype: hexagram.archetype === analysis.essence.archetype,
          temporal: hexagram.temporal === analysis.essence.temporalState,
          dynamics: this.calculateDynamicsSimilarity(hexagram.dynamics, analysis.essence.dynamicBalance),
          transformation: this.calculateTransformationFit(hexagram, analysis.transformation),
          rarityBonus: rarityBonus // TDD Green新設
        }
      };
    });
    
    return scores;
  }
  
  /**
   * 力学的類似度の計算
   */
  calculateDynamicsSimilarity(hexDynamics, situationBalance) {
    // 状況バランスを数値化
    const balanceScores = {
      'strong-drive': { drive: 8, resistance: 2, balance: 3 },
      'strong-resistance': { drive: 2, resistance: 8, balance: 3 },
      'seeking-balance': { drive: 5, resistance: 5, balance: 8 },
      'neutral': { drive: 5, resistance: 5, balance: 5 }
    };
    
    const situationScores = balanceScores[situationBalance] || balanceScores.neutral;
    
    // コサイン類似度で計算
    const dotProduct = 
      hexDynamics.drive * situationScores.drive +
      hexDynamics.resistance * situationScores.resistance +
      hexDynamics.balance * situationScores.balance;
    
    const hexMagnitude = Math.sqrt(
      hexDynamics.drive ** 2 + 
      hexDynamics.resistance ** 2 + 
      hexDynamics.balance ** 2
    );
    
    const situationMagnitude = Math.sqrt(
      situationScores.drive ** 2 + 
      situationScores.resistance ** 2 + 
      situationScores.balance ** 2
    );
    
    return dotProduct / (hexMagnitude * situationMagnitude);
  }
  
  /**
   * 変化への適合度計算
   */
  calculateTransformationFit(hexagram, transformation) {
    let fit = 0;
    
    // 現在の状態との適合
    if (transformation.from.emotional === 'struggling' && hexagram.dynamics.resistance > 5) {
      fit += 0.3;
    }
    if (transformation.from.relational === 'connected' && hexagram.dynamics.balance > 5) {
      fit += 0.2;
    }
    
    // 未来の方向性との適合
    if (transformation.to.growth && hexagram.dynamics.drive > 6) {
      fit += 0.3;
    }
    if (transformation.to.transformation && hexagram.archetype === 'transformation') {
      fit += 0.2;
    }
    
    return fit;
  }
  
  /**
   * 複雑さによる調整
   */
  adjustForComplexity(hexagram, metadata) {
    let adjustment = 1;
    
    // 複雑な状況には陰陽バランスの取れた卦が適する
    if (metadata.complexity > 0.7) {
      const balance = Math.abs(hexagram.attributes.yang - hexagram.attributes.yin);
      adjustment = balance < 2 ? 1.2 : 0.8;
    }
    
    // 緊急度が高い場合は動的な卦が適する
    if (metadata.urgency > 0.7) {
      adjustment *= hexagram.movement === 'ascending' || 
                   hexagram.movement === 'revolutionary' ? 1.1 : 0.9;
    }
    
    return adjustment;
  }
  
  /**
   * 上位の卦を選択
   */
  selectTopHexagrams(scores, count = 3) {
    return Object.values(scores)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => ({
        hexagram: parseInt(item.hexagram),
        score: item.score,
        essence: this.hexagramEssences[item.hexagram],
        matchDetails: item.details
      }));
  }
  
  /**
   * 最適な爻位置を決定
   */
  determineOptimalLine(analysis, topHexagram) {
    let lineScores = {};
    
    // 各爻位置のスコアを計算
    Object.entries(this.linePositions).forEach(([position, line]) => {
      let score = line.weight;
      
      // 始まりの状況 → 初爻・二爻
      if (analysis.essence.archetype === 'creation') {
        score *= position <= 2 ? 1.3 : 0.8;
      }
      
      // 変革期 → 三爻・四爻
      if (analysis.essence.archetype === 'transformation') {
        score *= position >= 3 && position <= 4 ? 1.3 : 0.8;
      }
      
      // 成熟期 → 五爻・上爻
      if (analysis.essence.archetype === 'maturity') {
        score *= position >= 5 ? 1.3 : 0.8;
      }
      
      // 緊急度による調整
      if (analysis.metadata.urgency > 0.7) {
        score *= position === 3 || position === 4 ? 1.2 : 0.9;
      }
      
      lineScores[position] = score;
    });
    
    // 最高スコアの爻を選択
    const optimalPosition = Object.entries(lineScores)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      position: parseInt(optimalPosition),
      ...this.linePositions[optimalPosition],
      score: lineScores[optimalPosition]
    };
  }
  
  /**
   * 動的な解釈を生成
   */
  generateDynamicInterpretation(analysis, hexagram, line) {
    const interpretation = {
      situation: this.interpretSituation(analysis, hexagram),
      guidance: this.generateGuidance(analysis, hexagram, line),
      warnings: this.identifyWarnings(analysis, hexagram),
      opportunities: this.identifyOpportunities(analysis, hexagram),
      timing: this.interpretTiming(analysis, hexagram, line)
    };
    
    return interpretation;
  }
  
  /**
   * 状況の解釈
   */
  interpretSituation(analysis, hexagram) {
    const templates = {
      'creation-struggle': `新たな始まりの中で困難に直面しています。${hexagram.essence.essence}の力が必要な時期です。`,
      'development-balance': `発展の過程でバランスを模索しています。${hexagram.essence.essence}という姿勢が重要です。`,
      'transformation-drive': `大きな変革期にあります。${hexagram.essence.essence}を活かして前進する時です。`,
      'maturity-reflection': `一つの完成を迎えつつあります。${hexagram.essence.essence}という視点で次を見据えましょう。`
    };
    
    const key = `${analysis.essence.archetype}-${this.getDominantDynamic(analysis)}`;
    return templates[key] || `現在の状況は${hexagram.essence.essence}の性質を持っています。`;
  }
  
  /**
   * ガイダンスの生成
   */
  generateGuidance(analysis, hexagram, line) {
    const guidance = [];
    
    // 爻位置に基づく基本指針
    guidance.push(`${line.name}の位置にあるため、${line.meaning}を意識することが大切です。`);
    
    // 力学バランスに基づく助言
    if (analysis.essence.dynamicBalance === 'strong-drive') {
      guidance.push('推進力が強い今、勢いを活かしつつも慎重さを忘れずに。');
    } else if (analysis.essence.dynamicBalance === 'strong-resistance') {
      guidance.push('抵抗が強い時期ですが、これは成長のための試練と捉えましょう。');
    }
    
    // 関係性に基づく助言
    if (analysis.essence.relationalFocus === 'self-focused') {
      guidance.push('自己との対話を大切にしながら、他者とのつながりも意識してください。');
    } else if (analysis.essence.relationalFocus === 'other-focused') {
      guidance.push('他者との関係を重視する中で、自分の軸も見失わないように。');
    }
    
    return guidance;
  }
  
  /**
   * 警告事項の特定
   */
  identifyWarnings(analysis, hexagram) {
    const warnings = [];
    
    // 障害に基づく警告
    analysis.transformation.obstacles.forEach(obstacle => {
      if (obstacle.type === 'internal') {
        warnings.push('内なる抵抗や自己否定に注意が必要です。');
      } else if (obstacle.type === 'external') {
        warnings.push('外部からの圧力や制約に対する準備をしておきましょう。');
      }
    });
    
    // 卦の性質に基づく警告
    if (hexagram.essence.movement === 'struggling') {
      warnings.push('困難な時期ですが、焦らず着実に進むことが重要です。');
    }
    
    return warnings;
  }
  
  /**
   * 機会の特定
   */
  identifyOpportunities(analysis, hexagram) {
    const opportunities = [];
    
    // リソースに基づく機会
    analysis.transformation.resources.forEach(resource => {
      if (resource.type === 'internal') {
        opportunities.push('内なる動機と情熱を活かす絶好の機会です。');
      } else if (resource.type === 'relational') {
        opportunities.push('周囲との協力関係が成功の鍵となります。');
      }
    });
    
    // 卦の性質に基づく機会
    if (hexagram.essence.quality === 'creative') {
      opportunities.push('創造的なアイデアが形になりやすい時期です。');
    }
    
    return opportunities;
  }
  
  /**
   * タイミングの解釈
   */
  interpretTiming(analysis, hexagram, line) {
    let timing = {
      action: 'neutral',
      description: ''
    };
    
    // 緊急度と爻位置から判断
    if (analysis.metadata.urgency > 0.7 && line.position <= 3) {
      timing.action = 'immediate';
      timing.description = '早急な行動が求められています。';
    } else if (hexagram.essence.movement === 'waiting') {
      timing.action = 'wait';
      timing.description = '今は準備と観察の時期です。';
    } else if (line.position === 5) {
      timing.action = 'lead';
      timing.description = 'リーダーシップを発揮する好機です。';
    } else {
      timing.action = 'steady';
      timing.description = '着実に一歩ずつ進む時期です。';
    }
    
    return timing;
  }
  
  /**
   * マッピング信頼度の計算
   */
  calculateMappingConfidence(analysis, topHexagram) {
    let confidence = 0;
    
    // 基本スコアの高さ
    confidence += Math.min(topHexagram.score / 100, 0.4);
    
    // アーキタイプの一致
    if (topHexagram.matchDetails.archetype) confidence += 0.2;
    
    // 時間軸の一致
    if (topHexagram.matchDetails.temporal) confidence += 0.1;
    
    // 力学の類似度
    confidence += topHexagram.matchDetails.dynamics * 0.2;
    
    // 分析の信頼度
    confidence += (analysis.metadata.confidence || 0.5) * 0.1;
    
    return Math.min(confidence, 1);
  }
  
  // ヘルパーメソッド
  getDominantDynamic(analysis) {
    const balance = analysis.essence.dynamicBalance;
    if (balance === 'strong-drive') return 'drive';
    if (balance === 'strong-resistance') return 'struggle';
    if (balance === 'seeking-balance') return 'balance';
    return 'neutral';
  }
  
  /**
   * HexagramDatabaseの読み込み
   */
  loadHexagramDatabase() {
    // Node.js環境での読み込み
    if (typeof require !== 'undefined') {
      return require('./HexagramDatabase');
    }
    // ブラウザ環境でのフォールバック
    return this.getBasicHexagrams();
  }
  
  /**
   * 基本的な卦の定義（フォールバック用）
   * 
   * 目的：
   * - HexagramDatabase読み込み失敗時の緊急対応
   * - 最低限の8卦で基本的な易経マッピング機能を維持
   * 
   * 処理内容：
   * 1. 警告メッセージ出力（完全データベース未使用を明示）
   * 2. 4アーキタイプ × 2パターンの代表的8卦を定義
   * 3. 各卦に必要な属性（dynamics, temporal, archetype等）を設定
   * 
   * 出力：
   * @returns {Object} 8卦の基本定義辞書
   *   - 1,2: creation（乾・坤）
   *   - 3,4: creation困難パターン（屯・蒙）
   *   - 5: development（需）
   *   - 49: transformation（革）
   *   - 63,64: maturity（既済・未済）
   * 
   * 副作用：
   * - console.warn（フォールバック使用の警告表示）
   * 
   * 【致命的制限】：
   * - 64卦中56卦が完全に使用不可能
   * - 多様な状況に対応できず、8パターンに強制分類
   * - これが「18個未使用卦」問題の最大要因
   * - 本来の易経の豊かな表現力が失われる
   */
  getBasicHexagrams() {
    console.warn('完全なHexagramDatabaseが利用できません。基本的な8卦のみ使用します。');
    return {
      1: { name: '乾為天', essence: '純粋な創造力、強いリーダーシップ', dynamics: { drive: 10, resistance: 0, balance: 2 }, temporal: 'future-oriented', archetype: 'creation', attributes: { yang: 6, yin: 0, movement: 'ascending', element: 'heaven', quality: 'creative' } },
      2: { name: '坤為地', essence: '受容性、育む力、基盤', dynamics: { drive: 2, resistance: 0, balance: 8 }, temporal: 'present-focused', archetype: 'creation', attributes: { yang: 0, yin: 6, movement: 'grounding', element: 'earth', quality: 'receptive' } },
      3: { name: '水雷屯', essence: '困難な始まり、生みの苦しみ', dynamics: { drive: 6, resistance: 7, balance: 3 }, temporal: 'transitional', archetype: 'creation', attributes: { yang: 2, yin: 4, movement: 'struggling', element: 'water-thunder', quality: 'difficult-birth' } },
      4: { name: '山水蒙', essence: '無知からの学び、啓蒙の必要性', dynamics: { drive: 3, resistance: 2, balance: 5 }, temporal: 'future-oriented', archetype: 'creation', attributes: { yang: 2, yin: 4, movement: 'learning', element: 'mountain-water', quality: 'inexperience' } },
      5: { name: '水天需', essence: '待つことの知恵、適切なタイミング', dynamics: { drive: 4, resistance: 2, balance: 7 }, temporal: 'present-focused', archetype: 'development', attributes: { yang: 4, yin: 2, movement: 'waiting', element: 'water-heaven', quality: 'patience' } },
      49: { name: '沢火革', essence: '変革、古いものを新しくする', dynamics: { drive: 8, resistance: 6, balance: 4 }, temporal: 'transitional', archetype: 'transformation', attributes: { yang: 3, yin: 3, movement: 'revolutionary', element: 'lake-fire', quality: 'change' } },
      63: { name: '水火既済', essence: '完成、しかし警戒が必要', dynamics: { drive: 5, resistance: 3, balance: 8 }, temporal: 'present-focused', archetype: 'maturity', attributes: { yang: 3, yin: 3, movement: 'completed', element: 'water-fire', quality: 'accomplishment' } },
      64: { name: '火水未済', essence: '未完成、新たな始まりへ', dynamics: { drive: 7, resistance: 4, balance: 5 }, temporal: 'future-oriented', archetype: 'maturity', attributes: { yang: 3, yin: 3, movement: 'incomplete', element: 'fire-water', quality: 'not-yet' } }
    };
  }
  
  /**
   * 卦の名前取得
   */
  getHexagramName(number) {
    const hexagram = this.hexagramEssences[number];
    return hexagram?.name || `第${number}卦`;
  }
  
  // TDD Green新設機能: 希少卦ボーナス計算
  calculateRarityBonus(usageCount) {
    // 使用回数が少ないほどボーナスを付与
    if (usageCount === 0) return 10;      // 未使用卦: 最大ボーナス
    if (usageCount <= 2) return 7;        // 稀少使用: 高ボーナス
    if (usageCount <= 5) return 4;        // 低頻度: 中ボーナス
    if (usageCount <= 10) return 1;       // 標準使用: 小ボーナス
    return 0;                             // 高頻度: ボーナスなし
  }
  
  // TDD Green新設機能: 使用統計取得
  getUsageStatistics() {
    return this.usageStatistics;
  }
  
  // TDD Green新設機能: 使用統計更新
  updateUsageStatistics(hexagramNumber) {
    this.usageStatistics[hexagramNumber] = (this.usageStatistics[hexagramNumber] || 0) + 1;
  }
  
  // TDD Green新設機能: フォールバックレベル設定
  setFallbackLevel(level) {
    const validLevels = [64, 32, 16, 8];
    if (!validLevels.includes(level)) {
      throw new Error(`無効なフォールバックレベル: ${level}. 有効値: ${validLevels.join(', ')}`);
    }
    
    this.fallbackLevel = level;
    this.fallbackInfo = {
      isActive: level < 64,
      level: level,
      message: level < 64 ? `基本${level}卦モード` : 'フルモード',
      qualityImpact: level < 64 ? `${((64 - level) / 64 * 100).toFixed(1)}%の機能制限` : '制限なし'
    };
  }
  
  // TDD Green新設機能: データベース障害シミュレーション
  simulateDatabaseFailure() {
    this.setFallbackLevel(8);
    console.warn('データベース障害をシミュレーション中...');
  }
  
  // TDD Green新設機能: データベース復旧シミュレーション
  simulateDatabaseRecovery() {
    this.fallbackLevel = 64;
    this.fallbackInfo = { isActive: false, level: 64 };
    console.log('データベースが復旧しました。');
  }
  
  /**
   * 使用統計を取得
   * 
   * @private
   * @returns {Object} 使用統計オブジェクト
   */
  _getUsageStatistics() {
    return this.getUsageStatistics ? this.getUsageStatistics() : {};
  }
  
  /**
   * デフォルトスコアを取得
   * 
   * @private
   * @returns {Object} デフォルトスコアオブジェクト
   */
  _getDefaultScores() {
    return {
      1: { hexagram: '1', score: 50, details: { archetype: true, temporal: false, dynamics: 0.5, transformation: 0.5, rarityBonus: 0 } },
      2: { hexagram: '2', score: 45, details: { archetype: false, temporal: true, dynamics: 0.6, transformation: 0.4, rarityBonus: 0 } }
    };
  }
  
  /**
   * デフォルト解釈を取得
   * 
   * @private
   * @returns {Object} デフォルト解釈オブジェクト
   */
  _getDefaultInterpretation() {
    return {
      situation: '現在の状況は少し複雑で、深い理解が必要です。',
      guidance: ['冷静に状況を見極めることが大切です。'],
      warnings: ['急いで判断することは避けましょう。'],
      opportunities: ['現在の状況から学べることがたくさんあります。'],
      timing: { action: 'wait', description: '時を待つことが適切です。' },
      userFriendlyVersion: '今は無理をせず、自分のペースで進んでいくことが大切です。'
    };
  }
  
  /**
   * 簡単な解釈を生成
   * 
   * @private
   * @param {Object} analysis - 分析結果
   * @param {Object} hexagram - 選択された卐
   * @param {Object} line - 最適皆位置
   * @returns {string} ユーザーフレンドリーな解釈
   */
  _generateSimplifiedInterpretation(analysis, hexagram, line) {
    const archetype = analysis.essence?.archetype || '一般的';
    const essence = hexagram.essence?.essence || '状況の本質';
    
    return `あなたは${archetype}な状況にあり、${essence}を意識して進むことが重要です。`;
  }
  
  /**
   * 文脈的ガイダンスを生成
   * 
   * @private
   * @param {Object} analysis - 分析結果
   * @param {Object} hexagram - 選択された卐
   * @param {Object} line - 最適爆位置
   * @returns {Array} ガイダンス配列
   */
  _generateContextualGuidance(analysis, hexagram, line) {
    try {
      return this.generateGuidance(analysis, hexagram, line);
    } catch (error) {
      console.error('ガイダンス生成エラー:', error);
      return ['現在の状況を深く理解し、自分なりの答えを見つけてください。'];
    }
  }
  
  /**
   * 潜在的警告を特定
   * 
   * @private
   * @param {Object} analysis - 分析結果
   * @param {Object} hexagram - 選択された卐
   * @returns {Array} 警告配列
   */
  _identifyPotentialWarnings(analysis, hexagram) {
    try {
      return this.identifyWarnings(analysis, hexagram);
    } catch (error) {
      console.error('警告特定エラー:', error);
      return ['急いで結論を出さず、十分に検討してから行動してください。'];
    }
  }
  
  /**
   * 利用可能な機会を特定
   * 
   * @private
   * @param {Object} analysis - 分析結果
   * @param {Object} hexagram - 選択された卐
   * @returns {Array} 機会配列
   */
  _identifyAvailableOpportunities(analysis, hexagram) {
    try {
      return this.identifyOpportunities(analysis, hexagram);
    } catch (error) {
      console.error('機会特定エラー:', error);
      return ['新しい視点から状況を見ることで、新たな可能性が見えてくるかもしれません。'];
    }
  }
  
  /**
   * 最適タイミングを解釈
   * 
   * @private
   * @param {Object} analysis - 分析結果
   * @param {Object} hexagram - 選択された卐
   * @param {Object} line - 最適爆位置
   * @returns {Object} タイミング解釈
   */
  _interpretOptimalTiming(analysis, hexagram, line) {
    try {
      return this.interpretTiming(analysis, hexagram, line);
    } catch (error) {
      console.error('タイミング解釈エラー:', error);
      return { action: 'steady', description: '焦らず、自分のペースで進んでいくことが大切です。' };
    }
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.DynamicIChingMapper = DynamicIChingMapper;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicIChingMapper;
}