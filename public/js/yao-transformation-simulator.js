/**
 * Yao Transformation Simulator
 * 爻変化シミュレーター - テーマ選択による爻の変化と未来シナリオ生成
 */

class YaoTransformationSimulator {
  constructor(ichingAnalyzer, options = {}) {
    
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.ichingAnalyzer = ichingAnalyzer;
    this.h384Data = null;
    this.transformationRules = this.initTransformationRules();
    
    console.log('🔄 Yao Transformation Simulator initialized');
  }

  /**
   * H384データの初期化
   */
  async init() {
    try {
      if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
        this.h384Data = window.H384_DATA;
        console.log('✅ YaoTransformationSimulator H384_DATA loaded:', this.h384Data.length, 'entries');
        return true;
      } else {
        console.error('❌ H384_DATA not available for YaoTransformationSimulator');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize YaoTransformationSimulator:', error);
      return false;
    }
  }

  /**
   * メイン変化シミュレーション関数
   * @param {Object} currentSituation - 現在の状況分析結果
   * @param {string} themeChoice - ユーザーが選択したテーマ ('follow', 'change', 'create')
   * @returns {Object} 変化結果とシナリオ
   */
  simulateTransformation(currentSituation, themeChoice) {
    console.log('🔄 Simulating transformation for choice:', themeChoice);

    try {
      // 1. テーマ選択による爻の変化パターンを決定
      const transformationPattern = this.determineTransformationPattern(
        currentSituation, 
        themeChoice
      );

      // 2. 新しい爻位置を計算
      const newYaoPosition = this.calculateNewYaoPosition(
        currentSituation.yao.position, 
        transformationPattern
      );

      // 3. 卦の変化を確認（爻の変化により卦が変わる場合）
      const hexagramChange = this.calculateHexagramChange(
        currentSituation.hexagram, 
        currentSituation.yao.position, 
        newYaoPosition
      );

      // 4. 新しいH384エントリを取得
      const newH384Entry = this.ichingAnalyzer.getH384Entry(
        hexagramChange.newHexagram.number, 
        newYaoPosition
      );

      // 5. 複数の未来シナリオを生成
      const futureScenarios = this.generateFutureScenarios(
        currentSituation, 
        newH384Entry, 
        themeChoice, 
        transformationPattern
      );

      // 6. 変化の詳細メタファーを生成
      const transformationMetaphor = this.generateTransformationMetaphor(
        currentSituation, 
        newH384Entry, 
        transformationPattern
      );

      const result = {
        choice: themeChoice,
        transformation: {
          pattern: transformationPattern,
          confidence: this.calculateTransformationConfidence(transformationPattern),
          metaphor: transformationMetaphor
        },
        newSituation: {
          hexagram: hexagramChange.newHexagram,
          yao: {
            position: newYaoPosition,
            name: this.getYaoName(newYaoPosition),
            description: this.ichingAnalyzer.getYaoDescription(newYaoPosition)
          },
          h384Entry: newH384Entry
        },
        scenarios: futureScenarios,
        comparison: this.compareWithCurrent(currentSituation, newH384Entry)
      };

      console.log('✅ Transformation simulation complete:', result);
      return result;

    } catch (error) {
      console.error('❌ Transformation simulation failed:', error);
      return this.getFallbackTransformation(currentSituation, themeChoice);
    }
  }

  /**
   * 変化パターンの決定
   */
  determineTransformationPattern(currentSituation, themeChoice) {
    const currentYao = currentSituation.yao.position;
    const currentEmotion = currentSituation.analysis.emotion;
    const currentPattern = currentSituation.analysis.pattern;

    let transformationPattern = {
      type: themeChoice,
      direction: 'stable', // 'up', 'down', 'stable', 'reverse'
      intensity: 0.5,
      risk: 0.3,
      opportunity: 0.6
    };

    // テーマ選択による基本的な変化方向
    switch (themeChoice) {
      case 'follow':
        // 現在のテーマに従う = 安定的な変化
        transformationPattern.direction = this.getFollowDirection(currentYao, currentPattern);
        transformationPattern.intensity = 0.3;
        transformationPattern.risk = 0.2;
        transformationPattern.opportunity = 0.5;
        break;

      case 'change':
        // テーマを変える = 積極的な変化
        transformationPattern.direction = this.getChangeDirection(currentYao, currentEmotion);
        transformationPattern.intensity = 0.7;
        transformationPattern.risk = 0.6;
        transformationPattern.opportunity = 0.8;
        break;

      case 'create':
        // 新しいテーマを創造 = 革新的な変化
        transformationPattern.direction = this.getCreativeDirection(currentYao, currentPattern);
        transformationPattern.intensity = 0.9;
        transformationPattern.risk = 0.8;
        transformationPattern.opportunity = 0.9;
        break;
    }

    // 現在の状況による調整
    if (currentEmotion.dominant === 'anxiety' && currentEmotion.intensity > 0.7) {
      transformationPattern.risk += 0.2;
      transformationPattern.intensity = Math.max(0.1, transformationPattern.intensity - 0.3);
    }

    return transformationPattern;
  }

  /**
   * フォロー方向の決定
   */
  getFollowDirection(currentYao, pattern) {
    // 現在の流れを続ける
    if (pattern.primary === 'growth') return 'up';
    if (pattern.primary === 'completion') return 'stable';
    if (pattern.primary === 'crisis') return 'down';
    if (currentYao <= 2) return 'up'; // 下位爻は上昇
    if (currentYao >= 5) return 'stable'; // 上位爻は安定
    return 'up'; // デフォルトは上昇
  }

  /**
   * 変化方向の決定
   */
  getChangeDirection(currentYao, emotion) {
    // 積極的な変化を求める
    if (emotion.dominant === 'confusion') return 'reverse';
    if (emotion.dominant === 'stagnation') return 'up';
    if (currentYao === 6) return 'down'; // 上爻から下へ
    if (currentYao <= 3) return 'up'; // 下位から上位へ
    return this.rng.next() > 0.5 ? 'up' : 'down';
  }

  /**
   * 創造方向の決定
   */
  getCreativeDirection(currentYao, pattern) {
    // 創造的な変化は予測不可能
    if (pattern.primary === 'stagnation') return 'reverse';
    if (pattern.primary === 'completion') return 'reverse';
    return ['up', 'down', 'reverse'][Math.floor(this.rng.next() * 3)];
  }

  /**
   * 新しい爻位置の計算
   */
  calculateNewYaoPosition(currentYao, transformationPattern) {
    let newYao = currentYao;

    switch (transformationPattern.direction) {
      case 'up':
        newYao = Math.min(6, currentYao + Math.ceil(transformationPattern.intensity * 2));
        break;
      case 'down':
        newYao = Math.max(1, currentYao - Math.ceil(transformationPattern.intensity * 2));
        break;
      case 'reverse':
        newYao = 7 - currentYao; // 逆転: 1↔6, 2↔5, 3↔4
        break;
      case 'stable':
        // 小幅な変化のみ
        if (this.rng.next() < transformationPattern.intensity) {
          newYao = currentYao + (this.rng.next() > 0.5 ? 1 : -1);
          newYao = Math.max(1, Math.min(6, newYao));
        }
        break;
    }

    return newYao;
  }

  /**
   * 卦の変化計算（簡易版）
   */
  calculateHexagramChange(currentHexagram, oldYao, newYao) {
    console.log('🔄 [DEBUG] calculateHexagramChange called:', {
      currentHexagram: currentHexagram?.name,
      oldYao,
      newYao
    });
    
    // 進爻・変爻の計算ロジック実装
    const yaoChange = Math.abs(newYao - oldYao);
    let newHexagram = currentHexagram; // デフォルトは現在の卦を維持
    let changeType = 'minimal'; // 変化の種類
    
    // 変爻（changing lines）の判定
    if (yaoChange >= 1) {
      changeType = yaoChange >= 3 ? 'major_transformation' : 'progression';
      console.log('🔄 [DEBUG] Change type determined:', changeType);
      
      // 進爻（progressing lines）による卦の変化計算
      newHexagram = this.calculateProgressingHexagram(currentHexagram, oldYao, newYao, changeType);
    }
    
    // 8つの変化パターンに対応する卦の定義
    const transformationHexagrams = {
      // 基本変化パターン
      'upward_strong': { number: 1, name: '乾為天', symbol: '☰☰' }, // 強い上昇
      'upward_gentle': { number: 57, name: '巽為風', symbol: '☴☴' }, // 穏やかな浸透
      'downward_adaptive': { number: 2, name: '坤為地', symbol: '☷☷' }, // 適応的下降
      'downward_retreat': { number: 33, name: '天山遯', symbol: '☰☶' }, // 戦略的退却
      
      // 変革パターン
      'revolutionary': { number: 49, name: '沢火革', symbol: '☱☲' }, // 革命的変化
      'innovative': { number: 50, name: '火風鼎', symbol: '☲☴' }, // 革新的変革
      'shocking': { number: 51, name: '震為雷', symbol: '☳☳' }, // 衝撃的変化
      'penetrating': { number: 57, name: '巽為風', symbol: '☴☴' } // 浸透的変化
    };

    // 変化の方向と強度に基づく適切な卦の選択
    if (changeType === 'major_transformation') {
      if (newYao > oldYao) {
        // 上昇変化
        newHexagram = yaoChange >= 4 ? transformationHexagrams.revolutionary : transformationHexagrams.upward_strong;
      } else if (newYao < oldYao) {
        // 下降変化
        newHexagram = yaoChange >= 4 ? transformationHexagrams.shocking : transformationHexagrams.downward_adaptive;
      } else {
        // 革新的変化
        newHexagram = transformationHexagrams.innovative;
      }
    } else if (changeType === 'progression') {
      if (newYao > oldYao) {
        newHexagram = transformationHexagrams.upward_gentle;
      } else {
        newHexagram = transformationHexagrams.downward_retreat;
      }
    }

    const result = {
      changed: newHexagram.number !== currentHexagram.number,
      oldHexagram: currentHexagram,
      newHexagram: newHexagram,
      changeType: changeType,
      yaoMovement: {
        from: oldYao,
        to: newYao,
        direction: newYao > oldYao ? 'ascending' : (newYao < oldYao ? 'descending' : 'stable'),
        magnitude: yaoChange
      },
      // 進爻・変爻の詳細情報
      lineChanges: this.calculateLineChanges(oldYao, newYao),
      changeReason: this.getChangeReason(changeType, yaoChange)
    };

    console.log('🔄 [DEBUG] Calculated hexagram change result:', {
      changed: result.changed,
      oldName: result.oldHexagram.name,
      newName: result.newHexagram.name,
      changeType: result.changeType
    });

    return result;
  }

  /**
   * 進爻による卦の変化計算
   */
  calculateProgressingHexagram(currentHexagram, oldYao, newYao, changeType) {
    console.log('🔄 [DEBUG] calculateProgressingHexagram:', { currentHexagram: currentHexagram?.name, oldYao, newYao, changeType });
    
    // 現在の卦の基本情報
    const currentNumber = currentHexagram.number;
    
    // 進爻の方向性を分析
    const direction = newYao > oldYao ? 'ascending' : 'descending';
    const magnitude = Math.abs(newYao - oldYao);
    
    // 進爻に基づく卦の変化ルール
    const progressionRules = {
      // 上昇進爻パターン
      ascending: {
        1: { // 初爻から上昇
          small: currentNumber < 32 ? currentNumber + 1 : currentNumber,
          medium: currentNumber < 30 ? currentNumber + 3 : currentNumber,
          large: Math.min(64, currentNumber + 10)
        },
        2: { // 二爻から上昇  
          small: currentNumber < 32 ? currentNumber + 2 : currentNumber,
          medium: Math.min(64, currentNumber + 5),
          large: Math.min(64, currentNumber + 12)
        },
        3: { // 三爻から上昇
          small: Math.min(64, currentNumber + 1),
          medium: Math.min(64, currentNumber + 7),
          large: Math.min(64, currentNumber + 15)
        }
      },
      // 下降進爻パターン
      descending: {
        6: { // 上爻から下降
          small: currentNumber > 1 ? currentNumber - 1 : currentNumber,
          medium: Math.max(1, currentNumber - 5),
          large: Math.max(1, currentNumber - 12)
        },
        5: { // 五爻から下降
          small: Math.max(1, currentNumber - 2),
          medium: Math.max(1, currentNumber - 7),
          large: Math.max(1, currentNumber - 15)
        },
        4: { // 四爻から下降
          small: Math.max(1, currentNumber - 1),
          medium: Math.max(1, currentNumber - 3),
          large: Math.max(1, currentNumber - 10)
        }
      }
    };
    
    // 変化の強度を決定
    let intensityLevel = magnitude <= 1 ? 'small' : (magnitude <= 3 ? 'medium' : 'large');
    
    // 適用ルールの選択
    const ruleSet = progressionRules[direction]?.[oldYao];
    let newHexagramNumber = currentNumber; // フォールバック
    
    if (ruleSet && ruleSet[intensityLevel]) {
      newHexagramNumber = ruleSet[intensityLevel];
      console.log('🔄 [DEBUG] Applied progression rule:', { direction, oldYao, intensityLevel, newNumber: newHexagramNumber });
    }
    
    // 新しい卦の構築
    const newHexagram = this.getHexagramByNumber(newHexagramNumber) || currentHexagram;
    
    console.log('🔄 [DEBUG] Progression result:', {
      oldNumber: currentNumber,
      newNumber: newHexagramNumber,
      newName: newHexagram.name
    });
    
    return newHexagram;
  }

  /**
   * 番号による卦の取得
   */
  getHexagramByNumber(number) {
    // 基本64卦のマッピング（主要な卦のみ実装）
    const hexagramsByNumber = {
      1: { number: 1, name: '乾為天', symbol: '☰☰' },
      2: { number: 2, name: '坤為地', symbol: '☷☷' },
      3: { number: 3, name: '水雷屯', symbol: '☵☳' },
      4: { number: 4, name: '山水蒙', symbol: '☶☵' },
      5: { number: 5, name: '水天需', symbol: '☵☰' },
      6: { number: 6, name: '天水訟', symbol: '☰☵' },
      7: { number: 7, name: '地水師', symbol: '☷☵' },
      8: { number: 8, name: '水地比', symbol: '☵☷' },
      // 継続的にマッピングを拡張可能
      33: { number: 33, name: '天山遯', symbol: '☰☶' },
      49: { number: 49, name: '沢火革', symbol: '☱☲' },
      50: { number: 50, name: '火風鼎', symbol: '☲☴' },
      51: { number: 51, name: '震為雷', symbol: '☳☳' },
      57: { number: 57, name: '巽為風', symbol: '☴☴' }
    };
    
    const hexagram = hexagramsByNumber[number];
    if (!hexagram && number >= 1 && number <= 64) {
      // 未定義の卦番号の場合、基本的な名前を生成
      return {
        number: number,
        name: `第${number}卦`,
        symbol: '☰☰' // デフォルトシンボル
      };
    }
    
    return hexagram;
  }

  /**
   * 爻の変化詳細計算
   */
  calculateLineChanges(oldYao, newYao) {
    const changes = {
      type: newYao > oldYao ? 'progressing' : (newYao < oldYao ? 'regressing' : 'stable'),
      steps: Math.abs(newYao - oldYao),
      trajectory: [],
      significance: this.getChangeSignificance(oldYao, newYao)
    };
    
    // 変化の軌跡を計算
    if (changes.steps > 0) {
      const direction = newYao > oldYao ? 1 : -1;
      for (let i = oldYao; i !== newYao; i += direction) {
        const nextYao = i + direction;
        changes.trajectory.push({
          from: i,
          to: nextYao,
          significance: this.getPositionSignificance(nextYao)
        });
      }
    }
    
    return changes;
  }

  /**
   * 変化の重要度取得
   */
  getChangeSignificance(oldYao, newYao) {
    // 特定の爻位の組み合わせは特別な意味を持つ
    const significantTransitions = {
      '1-6': 'complete_cycle', // 初爻から上爻：完全な循環
      '6-1': 'renewal', // 上爻から初爻：再生
      '3-4': 'critical_transition', // 三爻から四爻：危機から変化へ
      '2-5': 'elevation', // 二爻から五爻：大躍進
      '5-2': 'humility' // 五爻から二爻：謙遜への回帰
    };
    
    const transitionKey = `${oldYao}-${newYao}`;
    return significantTransitions[transitionKey] || 'normal';
  }

  /**
   * 爻位の重要度取得
   */
  getPositionSignificance(yaoPosition) {
    const significance = {
      1: { level: 'foundation', meaning: '基礎・始まり' },
      2: { level: 'support', meaning: '協力・支援' },
      3: { level: 'challenge', meaning: '試練・困難' },
      4: { level: 'transition', meaning: '変化・転換' },
      5: { level: 'leadership', meaning: '指導・統率' },
      6: { level: 'completion', meaning: '完成・終了' }
    };
    
    return significance[yaoPosition] || { level: 'neutral', meaning: '中立' };
  }

  /**
   * 変化理由の取得
   */
  getChangeReason(changeType, magnitude) {
    const reasons = {
      minimal: '小幅な調整による安定化',
      progression: `${magnitude}段階の進展による発展`,
      major_transformation: `${magnitude}段階の大変化による革新`
    };
    
    return reasons[changeType] || '状況の自然な発展';
  }

  /**
   * 未来シナリオ生成（複数パターン）
   */
  generateFutureScenarios(currentSituation, newH384Entry, themeChoice, transformationPattern) {
    console.log('🔮 [DEBUG] generateFutureScenarios with 進爻・変爻 integration');
    
    const scenarios = [];
    const baseKeywords = newH384Entry ? (newH384Entry['キーワード'] || []) : ['変化'];
    const timeframes = ['1ヶ月後', '3ヶ月後', '6ヶ月後', '1年後'];

    // 8つの基本シナリオタイプ（進爻・変爻パターンに基づく）
    const scenarioTypes = [
      {
        type: 'optimistic_strong',
        hexagramPattern: 'ascending_major', // 上昇大変化
        probability: this.calculateOptimisticProbability(transformationPattern, newH384Entry) * 0.9,
        title: '最良・積極展開',
        icon: '🌟',
        yaoMovement: 'strong_upward'
      },
      {
        type: 'optimistic_gentle',
        hexagramPattern: 'ascending_gradual', // 上昇漸進
        probability: this.calculateOptimisticProbability(transformationPattern, newH384Entry) * 0.7,
        title: '良好・着実成長',
        icon: '📈',
        yaoMovement: 'gentle_upward'
      },
      {
        type: 'realistic_stable',
        hexagramPattern: 'stable_progression', // 安定進行
        probability: 0.6,
        title: '現実的・安定展開',
        icon: '⚖️',
        yaoMovement: 'stable'
      },
      {
        type: 'realistic_adaptive',
        hexagramPattern: 'adaptive_change', // 適応変化
        probability: 0.65,
        title: '現実的・適応展開',
        icon: '🔄',
        yaoMovement: 'adaptive'
      },
      {
        type: 'challenging_manageable',
        hexagramPattern: 'descending_controlled', // 下降制御
        probability: this.calculateChallengingProbability(transformationPattern, newH384Entry) * 0.6,
        title: '試練・管理可能',
        icon: '⚡',
        yaoMovement: 'controlled_descent'
      },
      {
        type: 'challenging_severe',
        hexagramPattern: 'descending_major', // 下降大変化
        probability: this.calculateChallengingProbability(transformationPattern, newH384Entry) * 0.8,
        title: '困難・大きな試練',
        icon: '🌪️',
        yaoMovement: 'strong_downward'
      },
      {
        type: 'transformative_breakthrough',
        hexagramPattern: 'revolutionary', // 革命的変化
        probability: transformationPattern.opportunity * 0.7,
        title: '変革・ブレークスルー',
        icon: '🚀',
        yaoMovement: 'revolutionary'
      },
      {
        type: 'transformative_cyclical',
        hexagramPattern: 'cyclical_return', // 循環回帰
        probability: transformationPattern.intensity * 0.5,
        title: '変革・循環的展開',
        icon: '🔁',
        yaoMovement: 'cyclical'
      }
    ];

    // 各シナリオタイプを生成（8つ全て）
    for (const scenarioType of scenarioTypes) {
      const scenario = {
        id: `scenario_${scenarioType.type}_${Date.now()}`,
        type: scenarioType.type,
        title: scenarioType.title,
        icon: scenarioType.icon,
        probability: scenarioType.probability,
        hexagramPattern: scenarioType.hexagramPattern,
        yaoMovement: scenarioType.yaoMovement,
        
        // 進爻・変爻に基づくタイムライン
        timeline: this.generateProgressionTimeline(scenarioType, baseKeywords, timeframes, currentSituation),
        
        // 卦の変化に基づく結果
        outcomes: this.generateHexagramBasedOutcomes(scenarioType, newH384Entry, themeChoice, currentSituation),
        
        // 爻位変化に基づくリスク
        risks: this.generateYaoBasedRisks(scenarioType, transformationPattern),
        
        // 進爻による機会
        opportunities: this.generateProgressionOpportunities(scenarioType, transformationPattern),
        
        // 卦象メタファー
        metaphor: this.generateHexagramMetaphor(scenarioType, newH384Entry, currentSituation)
      };
      
      scenarios.push(scenario);
    }

    console.log('🔮 [DEBUG] Generated 8 scenarios with 進爻・変爻 integration:', scenarios.length);
    return scenarios;
  }

  /**
   * 進爻に基づくタイムライン生成
   */
  generateProgressionTimeline(scenarioType, keywords, timeframes, currentSituation) {
    const timeline = [];
    const yaoProgression = this.calculateYaoProgression(scenarioType.yaoMovement, timeframes.length);
    
    for (let i = 0; i < timeframes.length; i++) {
      const timeframe = timeframes[i];
      const keyword = keywords[i % keywords.length] || '発展';
      const yaoState = yaoProgression[i];
      
      let description = this.generateProgressionDescription(
        scenarioType.hexagramPattern, 
        yaoState, 
        keyword, 
        currentSituation
      );
      
      timeline.push({
        timeframe,
        keyword,
        description,
        yaoPosition: yaoState.position,
        yaoSignificance: yaoState.significance,
        milestone: this.generateProgressionMilestone(scenarioType.type, i, yaoState)
      });
    }
    
    return timeline;
  }

  /**
   * 爻の進行計算
   */
  calculateYaoProgression(movementType, steps) {
    const progression = [];
    const startYao = 1; // 初爻から開始
    
    for (let i = 0; i < steps; i++) {
      let position;
      let significance;
      
      switch (movementType) {
        case 'strong_upward':
          position = Math.min(6, startYao + i * 2); // 急速上昇
          significance = 'rapid_growth';
          break;
        case 'gentle_upward':
          position = Math.min(6, startYao + i); // 着実上昇
          significance = 'steady_progress';
          break;
        case 'strong_downward':
          position = Math.max(1, 6 - i * 2); // 急速下降
          significance = 'rapid_decline';
          break;
        case 'controlled_descent':
          position = Math.max(1, 6 - i); // 制御下降
          significance = 'managed_challenge';
          break;
        case 'stable':
          position = 3 + (i % 2); // 中央安定
          significance = 'stable_foundation';
          break;
        case 'revolutionary':
          position = [1, 6, 3, 4][i % 4]; // 革命的変化
          significance = 'transformative_leap';
          break;
        case 'cyclical':
          position = [1, 3, 6, 2][i % 4]; // 循環的変化
          significance = 'cyclical_renewal';
          break;
        default:
          position = Math.min(6, startYao + i);
          significance = 'natural_flow';
      }
      
      progression.push({
        position: position,
        significance: significance,
        stage: i + 1
      });
    }
    
    return progression;
  }

  /**
   * 進行に基づく説明生成
   */
  generateProgressionDescription(hexagramPattern, yaoState, keyword, currentSituation) {
    const patternDescriptions = {
      ascending_major: `${keyword}を軸として力強く上昇し、第${yaoState.position}爻の段階で大きな変化を実現`,
      ascending_gradual: `${keyword}を通じて着実に進展し、第${yaoState.position}爻で安定した成長を継続`,
      stable_progression: `${keyword}の基盤の上で第${yaoState.position}爻の安定した立場を築く`,
      adaptive_change: `${keyword}に柔軟に対応し、第${yaoState.position}爻で適応的な変化を遂げる`,
      descending_controlled: `${keyword}の調整期間として第${yaoState.position}爻で戦略的な見直しを実行`,
      descending_major: `${keyword}に関する大きな試練を第${yaoState.position}爻で経験し学びを得る`,
      revolutionary: `${keyword}による革命的な変化が第${yaoState.position}爻で発現する`,
      cyclical_return: `${keyword}を通じた循環的な展開が第${yaoState.position}爻で新たな周期を開始`
    };
    
    return patternDescriptions[hexagramPattern] || `${keyword}による第${yaoState.position}爻での展開`;
  }

  /**
   * 卦象に基づく結果生成
   */
  generateHexagramBasedOutcomes(scenarioType, h384Entry, themeChoice, currentSituation) {
    const baseOutcome = h384Entry ? h384Entry['現代解釈の要約'] : '';
    const keywords = h384Entry ? h384Entry['キーワード'] || [] : [];
    
    const outcomes = [];
    
    // 主要な結果（卦象に基づく）
    outcomes.push({
      category: 'primary',
      title: this.generateHexagramOutcomeTitle(scenarioType.hexagramPattern, keywords[0]),
      description: this.adaptOutcomeToHexagramPattern(baseOutcome, scenarioType.hexagramPattern, themeChoice),
      impact: this.calculateHexagramImpact(scenarioType.type, scenarioType.yaoMovement),
      hexagramInfluence: scenarioType.hexagramPattern
    });
    
    // 副次的な結果（進爻の影響）
    if (keywords.length > 1) {
      outcomes.push({
        category: 'secondary',
        title: this.generateYaoOutcomeTitle(scenarioType.yaoMovement, keywords[1]),
        description: this.generateYaoInfluencedOutcome(keywords[1], scenarioType.yaoMovement),
        impact: this.calculateHexagramImpact(scenarioType.type, scenarioType.yaoMovement) * 0.7,
        yaoInfluence: scenarioType.yaoMovement
      });
    }
    
    return outcomes;
  }

  /**
   * 卦象結果タイトル生成
   */
  generateHexagramOutcomeTitle(hexagramPattern, keyword) {
    if (!keyword) keyword = '変化';
    
    const titleTemplates = {
      ascending_major: `${keyword}による力強い飛躍的成功`,
      ascending_gradual: `${keyword}を通じた着実で持続的な成長`,
      stable_progression: `${keyword}による安定した基盤の確立`,
      adaptive_change: `${keyword}への柔軟な適応による調和`,
      descending_controlled: `${keyword}の調整による戦略的立て直し`,
      descending_major: `${keyword}の試練を通じた根本的な変革`,
      revolutionary: `${keyword}による革命的なブレークスルー`,
      cyclical_return: `${keyword}の循環による新たな始まり`
    };
    
    return titleTemplates[hexagramPattern] || `${keyword}による変化`;
  }

  /**
   * 爻象結果タイトル生成
   */
  generateYaoOutcomeTitle(yaoMovement, keyword) {
    if (!keyword) keyword = '変化';
    
    const yaoTitleTemplates = {
      strong_upward: `${keyword}の勢いによる急速な向上`,
      gentle_upward: `${keyword}の力による段階的な発展`,
      controlled_descent: `${keyword}への対処による賢明な調整`,
      strong_downward: `${keyword}の困難による深い学び`,
      stable: `${keyword}による安定した持続`,
      revolutionary: `${keyword}の革新による飛躍`,
      cyclical: `${keyword}の循環による再生`,
      adaptive: `${keyword}への適応による進化`
    };
    
    return yaoTitleTemplates[yaoMovement] || `${keyword}の影響`;
  }

  /**
   * 卦象パターンに基づく結果適応
   */
  adaptOutcomeToHexagramPattern(baseOutcome, hexagramPattern, themeChoice) {
    if (!baseOutcome) {
      return `${themeChoice}の選択により${hexagramPattern}の展開が始まります。`;
    }
    
    const patternAdaptations = {
      ascending_major: '力強い上昇気流に乗り、',
      ascending_gradual: '着実な歩みを続けながら、',
      stable_progression: '安定した基盤の上で、',
      adaptive_change: '状況に柔軟に適応しつつ、',
      descending_controlled: '戦略的な調整を行いながら、',
      descending_major: '大きな試練を通じて、',
      revolutionary: '革命的な変化の中で、',
      cyclical_return: '新たな周期の始まりとして、'
    };
    
    const adaptation = patternAdaptations[hexagramPattern] || '';
    return `${adaptation}${baseOutcome}`;
  }

  /**
   * 卦象インパクト計算
   */
  calculateHexagramImpact(scenarioType, yaoMovement) {
    const baseImpacts = {
      optimistic_strong: 0.9,
      optimistic_gentle: 0.7,
      realistic_stable: 0.6,
      realistic_adaptive: 0.65,
      challenging_manageable: 0.5,
      challenging_severe: 0.4,
      transformative_breakthrough: 0.85,
      transformative_cyclical: 0.75
    };
    
    const yaoMultipliers = {
      strong_upward: 1.2,
      gentle_upward: 1.0,
      stable: 0.9,
      adaptive: 1.0,
      controlled_descent: 0.8,
      strong_downward: 0.6,
      revolutionary: 1.3,
      cyclical: 1.1
    };
    
    const baseImpact = baseImpacts[scenarioType] || 0.6;
    const multiplier = yaoMultipliers[yaoMovement] || 1.0;
    
    return Math.min(1.0, baseImpact * multiplier);
  }

  /**
   * 爻位に基づくリスク生成
   */
  generateYaoBasedRisks(scenarioType, transformationPattern) {
    const risks = [];
    const baseRisk = transformationPattern.risk;
    
    const yaoRisks = {
      strong_upward: {
        type: 'overextension',
        description: '急速な上昇による基盤の不安定化',
        probability: baseRisk * 0.8,
        mitigation: '段階的な基盤強化と慎重な拡大'
      },
      strong_downward: {
        type: 'spiral_decline',
        description: '下降の勢いが制御困難になるリスク',
        probability: baseRisk * 0.9,
        mitigation: '早期の介入と支援体制の構築'
      },
      revolutionary: {
        type: 'disruption_chaos',
        description: '革命的変化による既存システムの混乱',
        probability: baseRisk * 0.7,
        mitigation: '変化管理と段階的な移行計画'
      },
      cyclical: {
        type: 'repetitive_pattern',
        description: '同じパターンの繰り返しによる停滞',
        probability: baseRisk * 0.6,
        mitigation: '新たな要素の導入と学習の継続'
      }
    };
    
    const riskPattern = yaoRisks[scenarioType.yaoMovement];
    if (riskPattern) {
      risks.push(riskPattern);
    }
    
    return risks;
  }

  /**
   * 進爻による機会生成
   */
  generateProgressionOpportunities(scenarioType, transformationPattern) {
    const opportunities = [];
    const baseOpportunity = transformationPattern.opportunity;
    
    const progressionOpportunities = {
      strong_upward: {
        type: 'acceleration',
        description: '上昇の勢いを活かした更なる飛躍の機会',
        probability: baseOpportunity * 0.9,
        action: '勢いを維持しながら戦略的な拡大を図る'
      },
      gentle_upward: {
        type: 'sustainable_growth',
        description: '持続可能な成長基盤の確立機会',
        probability: baseOpportunity * 0.8,
        action: '着実な歩みで長期的な価値を築く'
      },
      revolutionary: {
        type: 'paradigm_shift',
        description: 'パラダイムシフトによる先駆者優位の機会',
        probability: baseOpportunity * 0.85,
        action: '変革の波に乗り新しい価値を創造'
      },
      adaptive: {
        type: 'flexibility_advantage',
        description: '適応性を活かした多様な展開の機会',
        probability: baseOpportunity * 0.75,
        action: '柔軟性を武器に変化する環境で優位を確立'
      }
    };
    
    const oppPattern = progressionOpportunities[scenarioType.yaoMovement];
    if (oppPattern) {
      opportunities.push(oppPattern);
    }
    
    return opportunities;
  }

  /**
   * 卦象メタファー生成
   */
  generateHexagramMetaphor(scenarioType, h384Entry, currentSituation) {
    if (!h384Entry) {
      return {
        symbol: '変化の流れ',
        meaning: `${scenarioType.hexagramPattern}による新しい展開の時`
      };
    }
    
    const keywords = h384Entry['キーワード'] || ['変化'];
    const hexagramName = h384Entry['卦名'] || '';
    
    const metaphorTemplates = {
      ascending_major: {
        symbol: `${keywords[0]}の龍が昇天する如く`,
        meaning: `${hexagramName}の力が最も強く発現し、大きな飛躍を遂げる時`
      },
      ascending_gradual: {
        symbol: `${keywords[0]}の風が山を登る如く`,
        meaning: `${hexagramName}の教えに従い、一歩ずつ高みに向かう時`
      },
      stable_progression: {
        symbol: `${keywords[0]}の大地が万物を支える如く`,
        meaning: `${hexagramName}の安定した力で基盤を固める時`
      },
      revolutionary: {
        symbol: `${keywords[0]}の雷が天地を震わす如く`,
        meaning: `${hexagramName}の革新の力で世界を変える時`
      },
      cyclical_return: {
        symbol: `${keywords[0]}の季節が巡り来る如く`,
        meaning: `${hexagramName}の循環の中で新たな始まりを迎える時`
      }
    };
    
    return metaphorTemplates[scenarioType.hexagramPattern] || {
      symbol: `${keywords[0]}の流れ`,
      meaning: `${hexagramName}による変化の時`
    };
  }

  /**
   * 爻影響による結果生成
   */
  generateYaoInfluencedOutcome(keyword, yaoMovement) {
    const yaoOutcomeTemplates = {
      strong_upward: `${keyword}の勢いにより予想を上回る成果が期待される`,
      gentle_upward: `${keyword}を通じて持続可能な発展が見込まれる`,
      controlled_descent: `${keyword}の調整により必要な修正が実現される`,
      strong_downward: `${keyword}の困難を通じて重要な気づきを得る`,
      stable: `${keyword}により安定した状態が維持される`,
      revolutionary: `${keyword}の革新により従来の枠を超えた展開となる`,
      cyclical: `${keyword}の循環により新たな可能性が開かれる`,
      adaptive: `${keyword}への適応により柔軟な対応力を獲得する`
    };
    
    return yaoOutcomeTemplates[yaoMovement] || `${keyword}による変化が起こる`;
  }

  /**
   * 進行マイルストーン生成
   */
  generateProgressionMilestone(scenarioType, index, yaoState) {
    const stageNames = ['準備期', '展開期', '発展期', '完成期'];
    const stageName = stageNames[index] || '継続期';
    
    const yaoMilestones = {
      1: '基礎確立',
      2: '協力獲得', 
      3: '試練克服',
      4: '転換実現',
      5: '頂点達成',
      6: '完成到達'
    };
    
    const yaoMilestone = yaoMilestones[yaoState.position] || '進展';
    
    return `${stageName}：${yaoMilestone}`;
  }

  /**
   * タイムライン生成
   */
  generateTimeline(scenarioType, keywords, timeframes) {
    const timeline = [];
    
    for (let i = 0; i < timeframes.length; i++) {
      const timeframe = timeframes[i];
      const keyword = keywords[i % keywords.length] || '発展';
      
      let description;
      switch (scenarioType.type) {
        case 'optimistic':
          description = `${keyword}を活かして順調に進展。新しい機会が生まれる。`;
          break;
        case 'realistic':
          description = `${keyword}に関する課題に取り組み、着実に前進。`;
          break;
        case 'challenging':
          description = `${keyword}に関する困難に直面するが、学びを得る。`;
          break;
      }
      
      timeline.push({
        timeframe,
        keyword,
        description,
        milestone: this.generateMilestone(scenarioType.type, i)
      });
    }
    
    return timeline;
  }

  /**
   * マイルストーン生成
   */
  generateMilestone(scenarioType, index) {
    const milestones = {
      optimistic: [
        '基盤構築完了', '第一目標達成', '大きな成果実現', '新たなステージへ'
      ],
      realistic: [
        '準備段階完了', '中間目標達成', '課題克服', '安定した成長'
      ],
      challenging: [
        '困難認識', '対策立案', '試練克服', '強靭性獲得'
      ]
    };
    
    return milestones[scenarioType][index] || '進展';
  }

  /**
   * 楽観的確率計算
   */
  calculateOptimisticProbability(transformationPattern, h384Entry) {
    let probability = 0.3; // ベース確率
    
    // 機会度による調整
    probability += transformationPattern.opportunity * 0.4;
    
    // H384スコアによる調整
    if (h384Entry) {
      const potential = h384Entry['S2_ポテンシャル'] || 50;
      const basicScore = h384Entry['S1_基本スコア'] || 50;
      probability += (potential + basicScore) / 200 * 0.3;
    }
    
    return Math.min(0.8, Math.max(0.1, probability));
  }

  /**
   * 困難確率計算
   */
  calculateChallengingProbability(transformationPattern, h384Entry) {
    let probability = 0.2; // ベース確率
    
    // リスクによる調整
    probability += transformationPattern.risk * 0.3;
    
    // H384リスクスコアによる調整
    if (h384Entry) {
      const risk = h384Entry['S4_リスク'] || 30;
      probability += risk / 100 * 0.2;
    }
    
    return Math.min(0.6, Math.max(0.1, probability));
  }

  /**
   * 結果生成
   */
  generateOutcomes(scenarioType, h384Entry, themeChoice) {
    const baseOutcome = h384Entry ? h384Entry['現代解釈の要約'] : '';
    const keywords = h384Entry ? h384Entry['キーワード'] || [] : [];
    
    const outcomes = [];
    
    // 主要な結果
    outcomes.push({
      category: 'primary',
      title: this.generateOutcomeTitle(scenarioType.type, keywords[0]),
      description: this.adaptOutcomeToChoice(baseOutcome, themeChoice, scenarioType.type),
      impact: this.calculateImpact(scenarioType.type)
    });
    
    // 副次的な結果
    if (keywords.length > 1) {
      outcomes.push({
        category: 'secondary',
        title: this.generateOutcomeTitle(scenarioType.type, keywords[1]),
        description: this.generateSecondaryOutcome(keywords[1], scenarioType.type),
        impact: this.calculateImpact(scenarioType.type) * 0.7
      });
    }
    
    return outcomes;
  }

  /**
   * 結果タイトル生成
   */
  generateOutcomeTitle(scenarioType, keyword) {
    if (!keyword) keyword = '変化';
    
    const titleTemplates = {
      optimistic: `${keyword}による大きな成功`,
      realistic: `${keyword}を通じた着実な成長`,
      challenging: `${keyword}の試練を経た成熟`
    };
    
    return titleTemplates[scenarioType] || `${keyword}による変化`;
  }

  /**
   * 結果の選択への適応
   */
  adaptOutcomeToChoice(baseOutcome, themeChoice, scenarioType) {
    if (!baseOutcome) {
      return `${themeChoice}の選択により新しい展開が始まります。`;
    }
    
    const adaptations = {
      follow: 'このテーマに従うことで、',
      change: 'テーマを変えることで、',
      create: '新しいテーマを創ることで、'
    };
    
    const adaptation = adaptations[themeChoice] || '';
    return `${adaptation}${baseOutcome}`;
  }

  /**
   * インパクト計算
   */
  calculateImpact(scenarioType) {
    const impacts = {
      optimistic: 0.8,
      realistic: 0.6,
      challenging: 0.4
    };
    
    return impacts[scenarioType] || 0.5;
  }

  /**
   * リスク生成
   */
  generateRisks(scenarioType, transformationPattern) {
    const risks = [];
    const baseRisk = transformationPattern.risk;
    
    switch (scenarioType.type) {
      case 'optimistic':
        if (baseRisk > 0.3) {
          risks.push({
            type: 'overconfidence',
            description: '成功による慢心のリスク',
            probability: baseRisk * 0.5,
            mitigation: '謙虚さを保つ'
          });
        }
        break;
        
      case 'realistic':
        risks.push({
          type: 'stagnation',
          description: '進展の停滞',
          probability: baseRisk * 0.7,
          mitigation: '定期的な見直しと調整'
        });
        break;
        
      case 'challenging':
        risks.push({
          type: 'overwhelm',
          description: '困難の重複による疲弊',
          probability: baseRisk * 0.9,
          mitigation: 'サポートの求め方を学ぶ'
        });
        break;
    }
    
    return risks;
  }

  /**
   * 機会生成
   */
  generateOpportunities(scenarioType, transformationPattern) {
    const opportunities = [];
    const baseOpportunity = transformationPattern.opportunity;
    
    switch (scenarioType.type) {
      case 'optimistic':
        opportunities.push({
          type: 'expansion',
          description: '更なる発展の機会',
          probability: baseOpportunity * 0.9,
          action: '積極的な行動で機会を活かす'
        });
        break;
        
      case 'realistic':
        opportunities.push({
          type: 'learning',
          description: 'スキル向上の機会',
          probability: baseOpportunity * 0.7,
          action: '継続的な学習と改善'
        });
        break;
        
      case 'challenging':
        opportunities.push({
          type: 'resilience',
          description: '精神的強さを獲得する機会',
          probability: baseOpportunity * 0.8,
          action: '困難を成長の糧とする'
        });
        break;
    }
    
    return opportunities;
  }

  /**
   * シナリオメタファー生成
   */
  generateScenarioMetaphor(scenarioType, h384Entry) {
    if (!h384Entry) {
      return {
        symbol: '変化の波',
        meaning: '新しい流れが生まれる時'
      };
    }
    
    const keywords = h384Entry['キーワード'] || ['変化'];
    const hexagramName = h384Entry['卦名'] || '';
    
    const metaphors = {
      optimistic: {
        symbol: `${keywords[0]}の花開く`,
        meaning: `${hexagramName}のエネルギーが最高の形で現れる時`
      },
      realistic: {
        symbol: `${keywords[0]}の成長`,
        meaning: `${hexagramName}の教えに従い着実に進む時`
      },
      challenging: {
        symbol: `${keywords[0]}の試練`,
        meaning: `${hexagramName}の深い意味を理解する時`
      }
    };
    
    return metaphors[scenarioType.type] || {
      symbol: '変化の時',
      meaning: '新しい段階への移行'
    };
  }

  /**
   * 現在との比較
   */
  compareWithCurrent(currentSituation, newH384Entry) {
    if (!newH384Entry || !currentSituation.h384Entry) {
      return {
        improvement: 0,
        changes: ['状況が変化します']
      };
    }
    
    const current = currentSituation.h384Entry;
    const changes = [];
    
    // スコア比較
    const scoreDiff = (newH384Entry['S1_基本スコア'] || 50) - (current['S1_基本スコア'] || 50);
    const potentialDiff = (newH384Entry['S2_ポテンシャル'] || 50) - (current['S2_ポテンシャル'] || 50);
    const riskDiff = (newH384Entry['S4_リスク'] || 30) - (current['S4_リスク'] || 30);
    
    if (scoreDiff > 10) changes.push('基本的な運勢が向上');
    if (scoreDiff < -10) changes.push('基本的な運勢に注意が必要');
    
    if (potentialDiff > 10) changes.push('将来の可能性が拡大');
    if (potentialDiff < -10) changes.push('可能性の慎重な見極めが必要');
    
    if (riskDiff > 10) changes.push('リスクが増加、注意深い行動を');
    if (riskDiff < -10) changes.push('リスクが減少、積極的に行動可能');
    
    const improvement = (scoreDiff + potentialDiff - riskDiff) / 30;
    
    return {
      improvement: Math.max(-1, Math.min(1, improvement)),
      changes: changes.length > 0 ? changes : ['状況に大きな変化はありません']
    };
  }

  /**
   * 変化確信度計算
   */
  calculateTransformationConfidence(transformationPattern) {
    let confidence = 0.5; // ベース確信度
    
    // 強度による調整
    confidence += transformationPattern.intensity * 0.3;
    
    // 方向性の明確さ
    if (transformationPattern.direction !== 'stable') {
      confidence += 0.2;
    }
    
    return Math.min(1.0, Math.max(0.3, confidence));
  }

  /**
   * 変化メタファー生成
   */
  generateTransformationMetaphor(currentSituation, newH384Entry, transformationPattern) {
    const currentKeyword = currentSituation.analysis.metaphor.primary || '現在';
    const newKeyword = newH384Entry ? (newH384Entry['キーワード'][0] || '変化') : '変化';
    
    const metaphorTemplates = {
      follow: `${currentKeyword}の流れに沿って${newKeyword}へ`,
      change: `${currentKeyword}から${newKeyword}への転換`,
      create: `${currentKeyword}を超えて${newKeyword}を創造`
    };
    
    return {
      transformation: metaphorTemplates[transformationPattern.type] || `${currentKeyword}から${newKeyword}へ`,
      direction: transformationPattern.direction,
      intensity: transformationPattern.intensity,
      symbol: this.getTransformationSymbol(transformationPattern)
    };
  }

  /**
   * 変化シンボル取得
   */
  getTransformationSymbol(transformationPattern) {
    const symbols = {
      up: '↗️',
      down: '↘️',
      reverse: '🔄',
      stable: '➡️'
    };
    
    return symbols[transformationPattern.direction] || '🔄';
  }

  /**
   * 爻名取得
   */
  getYaoName(position) {
    const yaoNames = ['初', '二', '三', '四', '五', '上'];
    return yaoNames[position - 1] || '初';
  }

  /**
   * フォールバック変化結果
   */
  getFallbackTransformation(currentSituation, themeChoice) {
    return {
      choice: themeChoice,
      transformation: {
        pattern: { type: themeChoice, direction: 'stable', intensity: 0.5, risk: 0.3, opportunity: 0.6 },
        confidence: 0.3,
        metaphor: { transformation: '新しい展開へ', symbol: '🔄' }
      },
      newSituation: {
        hexagram: currentSituation.hexagram,
        yao: { position: currentSituation.yao.position, name: currentSituation.yao.name },
        h384Entry: currentSituation.h384Entry
      },
      scenarios: [{
        id: 'fallback_scenario',
        type: 'realistic',
        title: '基本シナリオ',
        icon: '⚖️',
        probability: 0.6,
        timeline: [{ timeframe: '近い将来', description: '新しい展開が始まります' }],
        outcomes: [{ 
          category: 'primary', 
          title: '変化への適応', 
          description: 'この選択により新しい状況に適応していきます',
          impact: 0.5 
        }]
      }],
      comparison: { improvement: 0, changes: ['状況が変化します'] }
    };
  }

  /**
   * 副次的な結果生成
   * @param {string} keyword - キーワード
   * @param {string} scenarioType - シナリオタイプ
   * @returns {string} 副次的な結果の説明
   */
  generateSecondaryOutcome(keyword, scenarioType) {
    const secondaryTemplates = {
      optimistic: [
        `${keyword}を通じて新しい可能性が開かれます`,
        `${keyword}の影響で予期しない良い変化が起こります`,
        `${keyword}により周囲の環境も好転します`
      ],
      realistic: [
        `${keyword}に関連して着実な進歩が見られます`,
        `${keyword}を軸とした安定的な発展が期待できます`,
        `${keyword}による堅実な成果が得られます`
      ],
      cautious: [
        `${keyword}について慎重な検討が必要です`,
        `${keyword}に対する準備を怠らないことが重要です`,
        `${keyword}の管理に注意を払う必要があります`
      ],
      challenging: [
        `${keyword}を克服することで成長が期待できます`,
        `${keyword}との向き合い方が試されます`,
        `${keyword}への対処により新たな力を獲得します`
      ]
    };

    const templates = secondaryTemplates[scenarioType] || secondaryTemplates.realistic;
    const randomIndex = Math.floor(this.rng.next() * templates.length);
    return templates[randomIndex];
  }

  /**
   * 変化ルール初期化
   */
  initTransformationRules() {
    return {
      // 実装時に詳細な変化ルールを定義
      followRules: {
        // テーマに従う場合のルール
      },
      changeRules: {
        // テーマを変える場合のルール
      },
      createRules: {
        // 新しいテーマを創る場合のルール
      }
    };
  }
}

// グローバルスコープに公開
window.YaoTransformationSimulator = YaoTransformationSimulator;