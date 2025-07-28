// hexagram-details-fallback.js - HEXAGRAM_DETAILSフォールバック機能
// HaQei Analyzer - Hexagram Details Fallback System (要件書準拠)

class HexagramDetailsFallback {
  constructor() {
    // 八卦の基本特性による詳細情報生成
    this.trigramCharacteristics = {
      1: { // 乾（天）
        engineStrengths: ['創造性と革新力', '強いリーダーシップ', '不屈の精神力'],
        engineWeaknesses: ['完璧主義の傾向', '他者への配慮不足', '過度なプレッシャー'],
        interfaceBehaviors: ['積極的な意見表明', '困難なタスクへの率先対応', 'ビジョンの明確な提示'],
        safeModePatterns: ['独断的な決定', '他者の介入拒絶', '孤立傾向']
      },
      2: { // 兌（沢）
        engineStrengths: ['優れたコミュニケーション能力', '社交性と親しみやすさ', '楽観的な発想力'],
        engineWeaknesses: ['一貫性の欠如', '表面的な関係性', '軽率な判断'],
        interfaceBehaviors: ['明るい雰囲気作り', '積極的な対話', '人間関係の橋渡し'],
        safeModePatterns: ['過度な愛想笑い', '本心の隠蔽', '八方美人的行動']
      },
      3: { // 離（火）
        engineStrengths: ['鋭い洞察力', '情熱的な表現力', '美的センス'],
        engineWeaknesses: ['感情の起伏', '依存的傾向', 'プライドの高さ'],
        interfaceBehaviors: ['知的な議論', '創造的な提案', '感情豊かな表現'],
        safeModePatterns: ['注目を求める行動', '感情的な反応', '華やかさへの固執']
      },
      4: { // 震（雷）
        engineStrengths: ['瞬発力と行動力', '変化への適応力', '困難突破力'],
        engineWeaknesses: ['衝動性', '計画性の不足', '持続力の欠如'],
        interfaceBehaviors: ['エネルギッシュな行動', '迅速な決断', '変化の先導'],
        safeModePatterns: ['短気な反応', '計画なしの行動', '混乱時のパニック']
      },
      5: { // 巽（風）
        engineStrengths: ['柔軟性と適応力', '協調性', '継続的な努力'],
        engineWeaknesses: ['優柔不断', '自己主張の弱さ', '流されやすさ'],
        interfaceBehaviors: ['穏やかな調整', '人に合わせる姿勢', '静かな影響力'],
        safeModePatterns: ['決断回避', '責任転嫁', '曖昧な態度']
      },
      6: { // 坎（水）
        engineStrengths: ['深い思考力', '探究心', '困難への耐性'],
        engineWeaknesses: ['悲観的思考', '孤立傾向', 'リスク回避'],
        interfaceBehaviors: ['慎重な発言', '深い洞察の提供', '問題の本質追求'],
        safeModePatterns: ['悲観的な予測', '引きこもり', '過度な心配']
      },
      7: { // 艮（山）
        engineStrengths: ['安定性と信頼性', '慎重な判断力', '忍耐力'],
        engineWeaknesses: ['頑固さ', '変化への抵抗', '保守的思考'],
        interfaceBehaviors: ['安定した対応', '慎重な意見', '確実な実行'],
        safeModePatterns: ['頑固な態度', '変化拒絶', '孤立化']
      },
      8: { // 坤（地）
        engineStrengths: ['包容力', '支援能力', '持続的な努力'],
        engineWeaknesses: ['自己主張の弱さ', '過度な献身', '境界線の曖昧さ'],
        interfaceBehaviors: ['支援的な行動', '調和を重視した対応', '受容的な態度'],
        safeModePatterns: ['自己犠牲', '境界線の喪失', '過度な我慢']
      }
    };

    // 八卦の組み合わせパターンによる核となる動機
    this.coreDrivePatterns = {
      // 同じ八卦の重複（純卦）
      pure: {
        1: '創造と革新を通じて世界に影響を与えること',
        2: '人々との交流と喜びの共有',
        3: '知性と美を通じた自己表現',
        4: '変化と挑戦を通じた成長',
        5: '調和と協力による価値創造',
        6: '深い探求による真理の発見',
        7: '安定と継続による価値の保全',
        8: '支援と育成による他者の成長促進'
      },
      // 相対する八卦の組み合わせ
      opposite: {
        '1-8': '創造力と受容性の調和による包括的リーダーシップ',
        '2-7': '社交性と安定性の組み合わせによる信頼関係構築',
        '3-6': '洞察力と探求心の融合による深い理解力',
        '4-5': '行動力と協調性のバランスによる効果的な変革'
      },
      // その他の組み合わせ
      mixed: '複数の価値観の統合による独自の世界観の構築'
    };
  }

  // メインのフォールバック機能 - os_analyzer分析結果統合対応
  generateHexagramDetails(hexagramId, hexagramData, osAnalysisContext = null) {
    try {
      // 既存のHEXAGRAM_DETAILSを優先使用
      if (window.HEXAGRAM_DETAILS && window.HEXAGRAM_DETAILS[hexagramId]) {
        return window.HEXAGRAM_DETAILS[hexagramId];
      }

      // os_analyzer分析結果との統合チェック
      const enhancedContext = this.integrateOSAnalysisContext(osAnalysisContext, hexagramId);
      
      // フォールバック生成
      const upperTrigramId = hexagramData.upper_trigram_id;
      const lowerTrigramId = hexagramData.lower_trigram_id;
      
      return this.generateFallbackDetails(hexagramId, hexagramData, upperTrigramId, lowerTrigramId, enhancedContext);
      
    } catch (error) {
      console.warn(`⚠️ フォールバック生成エラー (卦${hexagramId}):`, error);
      return this.generateBasicFallback(hexagramId, hexagramData, osAnalysisContext);
    }
  }

  // os_analyzer分析結果との統合処理
  integrateOSAnalysisContext(osAnalysisContext, hexagramId) {
    if (!osAnalysisContext) return null;
    
    try {
      // StorageManagerからの分析結果取得を試行
      let analysisResult = osAnalysisContext;
      
      // 文字列の場合は解析
      if (typeof osAnalysisContext === 'string') {
        analysisResult = JSON.parse(osAnalysisContext);
      }
      
      // 分析結果の妥当性チェック
      if (analysisResult && (analysisResult.engineOS || analysisResult.interfaceOS || analysisResult.safeModeOS)) {
        console.log(`🔗 [HexagramDetailsFallback] OS分析結果を統合 (卦${hexagramId})`);
        return {
          engineOS: analysisResult.engineOS,
          interfaceOS: analysisResult.interfaceOS,
          safeModeOS: analysisResult.safeModeOS,
          userVector: analysisResult.userVector,
          integrated: true
        };
      }
      
      // StorageManagerから直接取得を試行
      if (window.storageManager) {
        const storedAnalysis = window.storageManager.getAnalysisResult();
        if (storedAnalysis && storedAnalysis.engineOS) {
          console.log(`🔄 [HexagramDetailsFallback] StorageManagerから分析結果を取得 (卦${hexagramId})`);
          return {
            engineOS: storedAnalysis.engineOS,
            interfaceOS: storedAnalysis.interfaceOS,
            safeModeOS: storedAnalysis.safeModeOS,
            userVector: storedAnalysis.userVector,
            integrated: true
          };
        }
      }
      
      return null;
    } catch (error) {
      console.warn(`⚠️ [HexagramDetailsFallback] OS分析結果統合エラー:`, error);
      return null;
    }
  }

  // 詳細なフォールバック生成 - 統合コンテキスト対応
  generateFallbackDetails(hexagramId, hexagramData, upperTrigramId, lowerTrigramId, enhancedContext = null) {
    const upperChars = this.trigramCharacteristics[upperTrigramId];
    const lowerChars = this.trigramCharacteristics[lowerTrigramId];
    
    // os_analyzer統合データがある場合の処理
    let personalizedEngine = null;
    let personalizedInterface = null;
    let personalizedSafeMode = null;
    
    if (enhancedContext && enhancedContext.integrated) {
      console.log(`🎯 [HexagramDetailsFallback] パーソナライズ生成開始 (卦${hexagramId})`);
      personalizedEngine = this.generatePersonalizedEngine(enhancedContext, upperChars, lowerChars);
      personalizedInterface = this.generatePersonalizedInterface(enhancedContext, upperChars, lowerChars);
      personalizedSafeMode = this.generatePersonalizedSafeMode(enhancedContext, upperChars, lowerChars);
    }
    
    // Engine OS詳細（パーソナライズ優先）
    const engine = personalizedEngine || {
      strength_meter: this.calculateStrengthMeter(upperTrigramId, lowerTrigramId),
      core_drive: this.generateCoreDrive(upperTrigramId, lowerTrigramId),
      potential_strengths: this.combineStrengths(upperChars, lowerChars),
      potential_weaknesses: this.combineWeaknesses(upperChars, lowerChars)
    };

    // Interface OS詳細（パーソナライズ優先）
    const interface = personalizedInterface || {
      how_it_appears: this.generateAppearance(upperTrigramId, lowerTrigramId),
      behavioral_patterns: this.combineBehaviors(upperChars, lowerChars),
      impression_on_others: this.generateImpression(upperTrigramId, lowerTrigramId)
    };

    // Safe Mode OS詳細（パーソナライズ優先）
    const safe_mode = personalizedSafeMode || {
      trigger_situations: this.generateTriggers(upperTrigramId, lowerTrigramId),
      defensive_patterns: this.combineDefensivePatterns(upperChars, lowerChars),
      internal_state: this.generateInternalState(upperTrigramId, lowerTrigramId)
    };

    // 八卦構成
    const trigrams = {
      upper: this.getTrigramInfo(upperTrigramId),
      lower: this.getTrigramInfo(lowerTrigramId)
    };

    // bunenjin哲学に基づく統合されたキャッチフレーズ生成
    const personalizedCatchphrase = enhancedContext ? 
      this.generateBunenjinCatchphrase(enhancedContext, hexagramData, upperTrigramId, lowerTrigramId) :
      hexagramData.catchphrase || '深い智慧を持つ人';

    return {
      name_jp: hexagramData.name_jp || `第${hexagramId}卦`,
      catchphrase: personalizedCatchphrase,
      description: hexagramData.description || `${hexagramData.name_jp}の卦は、独特な価値観と深い洞察力を持つ存在です。`,
      keywords: hexagramData.keywords ? hexagramData.keywords.split(',') : ['成長', '変化', '調和'],
      engine,
      interface,
      safe_mode,
      trigrams,
      bunenjin_enhanced: enhancedContext ? true : false,
      generation_quality: enhancedContext ? 0.9 : 0.7
    };
  }

  // パーソナライズされたEngine OS生成
  generatePersonalizedEngine(context, upperChars, lowerChars) {
    const userVector = context.userVector || {};
    const engineOS = context.engineOS || {};
    
    // ユーザーの8次元ベクトルから強みを動的生成
    const personalizedStrengths = this.extractPersonalizedStrengths(userVector, upperChars, lowerChars);
    const adjustedStrengthMeter = Math.round((engineOS.compatibilityScore || 75) * 1.2);
    
    return {
      strength_meter: Math.min(adjustedStrengthMeter, 100),
      core_drive: this.generatePersonalizedCoreDrive(context),
      potential_strengths: personalizedStrengths,
      potential_weaknesses: this.generatePersonalizedWeaknesses(userVector, upperChars, lowerChars),
      personalized: true
    };
  }

  // パーソナライズされたInterface OS生成
  generatePersonalizedInterface(context, upperChars, lowerChars) {
    const interfaceOS = context.interfaceOS || {};
    
    return {
      how_it_appears: this.generatePersonalizedAppearance(context),
      behavioral_patterns: this.generatePersonalizedBehaviors(context, upperChars, lowerChars),
      impression_on_others: this.generatePersonalizedImpression(context),
      personalized: true
    };
  }

  // パーソナライズされたSafe Mode OS生成
  generatePersonalizedSafeMode(context, upperChars, lowerChars) {
    const safeModeOS = context.safeModeOS || {};
    
    return {
      trigger_situations: this.generatePersonalizedTriggers(context),
      defensive_patterns: this.generatePersonalizedDefensivePatterns(context, upperChars, lowerChars),
      internal_state: this.generatePersonalizedInternalState(context),
      personalized: true
    };
  }

  // パーソナライズされた強み抽出
  extractPersonalizedStrengths(userVector, upperChars, lowerChars) {
    const strengths = [];
    
    // 8次元ベクトルから上位3つの特性を取得
    const sortedDimensions = Object.entries(userVector)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    sortedDimensions.forEach(([dimension, value]) => {
      if (value > 0.6) {
        const strengthMap = {
          innovation: '革新的な発想力',
          stability: '安定した継続力', 
          cooperation: '優れた協調性',
          independence: '自立した行動力',
          intuition: '鋭い直感力',
          resilience: '困難への耐久力',
          adaptability: '柔軟な適応力',
          protection: '他者を守る力'
        };
        
        const strength = strengthMap[dimension.split('_')[1]] || strengthMap[dimension];
        if (strength) strengths.push(strength);
      }
    });
    
    // 八卦特性との組み合わせ
    if (upperChars && upperChars.engineStrengths) {
      strengths.push(...upperChars.engineStrengths.slice(0, 1));
    }
    
    return strengths.length > 0 ? strengths.slice(0, 3) : ['独特な視点', '深い思考力', '価値観への忠実さ'];
  }

  // bunenjin哲学に基づくキャッチフレーズ生成
  generateBunenjinCatchphrase(context, hexagramData, upperTrigramId, lowerTrigramId) {
    const engineOS = context.engineOS?.osName || '';
    const interfaceOS = context.interfaceOS?.osName || '';
    const safeModeOS = context.safeModeOS?.osName || '';
    
    // 各OSの特性を組み合わせたキャッチフレーズ
    const bunenjinPhrases = {
      // 創造系
      '創造': '新しい可能性を切り拓く革新者',
      '直感': '深い洞察で真理を見抜く賢者',
      '行動': '迷いなく前進する実践者',
      // 協調系
      '調和': '人々を結ぶ架け橋となる存在',
      '支援': '他者の成長を支える育成者',
      '受容': '包容力で安心を与える癒し手',
      // 安定系
      '安定': '確固たる信念を持つ堅実者',
      '継続': '地道な努力で価値を築く建設者',
      '保護': '大切なものを守り抜く守護者'
    };
    
    // OS名から特性キーワードを抽出
    let catchphrase = hexagramData.catchphrase || '深い智慧を持つ人';
    
    for (const [key, phrase] of Object.entries(bunenjinPhrases)) {
      if (engineOS.includes(key) || interfaceOS.includes(key)) {
        catchphrase = phrase;
        break;
      }
    }
    
    return catchphrase;
  }

  // パーソナライズヘルパーメソッド群
  generatePersonalizedCoreDrive(context) {
    const engineOS = context.engineOS?.osName || '';
    return `${engineOS}を通じて自分らしい価値を世界に表現すること`;
  }

  generatePersonalizedWeaknesses(userVector, upperChars, lowerChars) {
    // 低い次元から弱点を推測
    const weakDimensions = Object.entries(userVector || {})
      .filter(([,value]) => value < 0.4)
      .slice(0, 2);
    
    const weaknessMap = {
      innovation: '新しい変化への躊躇',
      stability: '継続的な取り組みの困難',
      cooperation: '他者との協働の難しさ',
      independence: '自立した決断への不安'
    };
    
    const weaknesses = weakDimensions.map(([dim]) => 
      weaknessMap[dim.split('_')[1]] || weaknessMap[dim]
    ).filter(Boolean);
    
    return weaknesses.length > 0 ? weaknesses : ['理想と現実のギャップ', '他者との価値観の違い'];
  }

  generatePersonalizedAppearance(context) {
    const interfaceOS = context.interfaceOS?.osName || '';
    return `${interfaceOS}の特性を活かした自然な存在感`;
  }

  generatePersonalizedBehaviors(context, upperChars, lowerChars) {
    const interfaceOS = context.interfaceOS?.osName || '';
    const behaviors = [`${interfaceOS}に基づく一貫した行動`];
    
    if (upperChars && upperChars.interfaceBehaviors) {
      behaviors.push(...upperChars.interfaceBehaviors.slice(0, 2));
    }
    
    return behaviors;
  }

  generatePersonalizedImpression(context) {
    const interfaceOS = context.interfaceOS?.osName || '';
    return `${interfaceOS}らしい印象を与える、信頼できる人物`;
  }

  generatePersonalizedTriggers(context) {
    const safeModeOS = context.safeModeOS?.osName || '';
    return [`${safeModeOS}の特性が脅かされる状況`, '価値観が理解されない時', '過度なプレッシャーを感じた時'];
  }

  generatePersonalizedDefensivePatterns(context, upperChars, lowerChars) {
    const safeModeOS = context.safeModeOS?.osName || '';
    const patterns = [`${safeModeOS}による自己防御行動`];
    
    if (upperChars && upperChars.safeModePatterns) {
      patterns.push(...upperChars.safeModePatterns.slice(0, 2));
    }
    
    return patterns;
  }

  generatePersonalizedInternalState(context) {
    const safeModeOS = context.safeModeOS?.osName || '';
    return `${safeModeOS}が働いている時の内なる葛藤と自己保護の願い`;
  }

  // 基本的なフォールバック（最終手段） - 統合コンテキスト対応
  generateBasicFallback(hexagramId, hexagramData, osAnalysisContext = null) {
    return {
      name_jp: hexagramData?.name_jp || `第${hexagramId}卦`,
      catchphrase: hexagramData?.catchphrase || '深い智慧を持つ人',
      description: hexagramData?.description || `第${hexagramId}卦の深い智慧を持つあなたは、独自の価値観で世界を捉える特別な存在です。`,
      keywords: ['成長', '変化', '調和'],
      engine: {
        strength_meter: 75,
        core_drive: '自己実現と他者への貢献の調和',
        potential_strengths: ['独特な視点', '深い思考力', '価値観への忠実さ'],
        potential_weaknesses: ['理想と現実のギャップ', '他者との価値観の相違', '変化への適応']
      },
      interface: {
        how_it_appears: '静かで思慮深い存在感',
        behavioral_patterns: ['慎重な発言', '深い洞察の提供', '価値観に基づく行動'],
        impression_on_others: '信頼できるが少し読みにくい人'
      },
      safe_mode: {
        trigger_situations: ['価値観が脅かされた時', '理解されない状況', '過度なプレッシャー'],
        defensive_patterns: ['内向的になる', '自分の世界に閉じこもる', '頑固な態度'],
        internal_state: '「自分の道を貫こう」という意志と「理解されたい」という願い'
      },
      trigrams: {
        upper: { name: "上卦", symbol: "☰", description: "外向的な特性" },
        lower: { name: "下卦", symbol: "☷", description: "内向的な特性" }
      }
    };
  }

  // ヘルパーメソッド群
  calculateStrengthMeter(upper, lower) {
    // 八卦の組み合わせから強度を計算
    const baseStrength = {1: 95, 2: 70, 3: 85, 4: 80, 5: 75, 6: 78, 7: 82, 8: 72};
    const upperStr = baseStrength[upper] || 75;
    const lowerStr = baseStrength[lower] || 75;
    return Math.round((upperStr * 0.6 + lowerStr * 0.4));
  }

  generateCoreDrive(upper, lower) {
    if (upper === lower) {
      return this.coreDrivePatterns.pure[upper] || this.coreDrivePatterns.mixed;
    }
    
    const key = `${Math.min(upper, lower)}-${Math.max(upper, lower)}`;
    return this.coreDrivePatterns.opposite[key] || this.coreDrivePatterns.mixed;
  }

  combineStrengths(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['創造性', '洞察力', '価値観への忠実さ'];
    
    const combined = [...upperChars.engineStrengths.slice(0, 2), ...lowerChars.engineStrengths.slice(0, 1)];
    return combined.length > 0 ? combined : ['創造性', '洞察力', '価値観への忠実さ'];
  }

  combineWeaknesses(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['理想主義的傾向', '他者との価値観の違い', '変化への抵抗'];
    
    const combined = [...upperChars.engineWeaknesses.slice(0, 2), ...lowerChars.engineWeaknesses.slice(0, 1)];
    return combined.length > 0 ? combined : ['理想主義的傾向', '他者との価値観の違い', '変化への抵抗'];
  }

  combineBehaviors(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['慎重な発言', '深い洞察の提供', '価値観に基づく行動'];
    
    const combined = [...upperChars.interfaceBehaviors.slice(0, 2), ...lowerChars.interfaceBehaviors.slice(0, 1)];
    return combined.length > 0 ? combined : ['慎重な発言', '深い洞察の提供', '価値観に基づく行動'];
  }

  combineDefensivePatterns(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['内向的になる', '自分の世界に閉じこもる', '頑固な態度'];
    
    const combined = [...upperChars.safeModePatterns.slice(0, 2), ...lowerChars.safeModePatterns.slice(0, 1)];
    return combined.length > 0 ? combined : ['内向的になる', '自分の世界に閉じこもる', '頑固な態度'];
  }

  generateAppearance(upper, lower) {
    const appearances = {
      1: '自信に満ちた堂々とした振る舞い',
      2: '明るく親しみやすい雰囲気',
      3: '知的で華やかな存在感',
      4: 'エネルギッシュで活動的な様子',
      5: '穏やかで協調的な態度',
      6: '慎重で思慮深い姿勢',
      7: '安定感のある落ち着いた様子',
      8: '温和で支援的な雰囲気'
    };
    
    return appearances[upper] || '独特な存在感を持つ人';
  }

  generateImpression(upper, lower) {
    return '信頼できるが、その深い思考は時に理解するのが難しい。独自の視点を持つ興味深い人物。';
  }

  generateTriggers(upper, lower) {
    return [
      '自分の価値観が否定された時',
      '理不尽な状況に直面した時',
      '長期間のストレスにさらされた時'
    ];
  }

  generateInternalState(upper, lower) {
    return '「自分らしくありたい」という願いと「周囲との調和も大切」という思いの間での葛藤。';
  }

  getTrigramInfo(trigramId) {
    const trigramNames = {
      1: { name: "乾", symbol: "☰", description: "天、創造性、リーダーシップ" },
      2: { name: "兌", symbol: "☱", description: "沢、喜び、コミュニケーション" },
      3: { name: "離", symbol: "☲", description: "火、知性、美" },
      4: { name: "震", symbol: "☳", description: "雷、行動、変化" },
      5: { name: "巽", symbol: "☴", description: "風、柔軟性、浸透" },
      6: { name: "坎", symbol: "☵", description: "水、知恵、困難" },
      7: { name: "艮", symbol: "☶", description: "山、安定、静止" },
      8: { name: "坤", symbol: "☷", description: "地、受容、育成" }
    };
    
    return trigramNames[trigramId] || { name: "不明", symbol: "☰", description: "基本的な特性" };
  }

  // 公開メソッド：外部から使用（os_analyzer統合対応）
  getHexagramDetails(hexagramId, osAnalysisContext = null) {
    // hexagrams_masterからデータ取得
    const hexagramData = window.hexagrams_master?.find(h => h.hexagram_id === hexagramId);
    if (!hexagramData) {
      console.warn(`⚠️ 卦${hexagramId}のデータが見つかりません`);
      return this.generateBasicFallback(hexagramId, null, osAnalysisContext);
    }
    
    return this.generateHexagramDetails(hexagramId, hexagramData, osAnalysisContext);
  }

  // 品質評価メソッド
  assessFallbackQuality(generatedDetails) {
    let qualityScore = 0;
    const maxScore = 100;
    
    // bunenjin統合チェック
    if (generatedDetails.bunenjin_enhanced) qualityScore += 30;
    
    // パーソナライゼーションチェック  
    if (generatedDetails.engine?.personalized) qualityScore += 25;
    if (generatedDetails.interface?.personalized) qualityScore += 25;
    if (generatedDetails.safe_mode?.personalized) qualityScore += 20;
    
    return Math.min(qualityScore, maxScore);
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.HexagramDetailsFallback = HexagramDetailsFallback;
  
  // インスタンスを即座に作成
  window.hexagramDetailsFallback = new HexagramDetailsFallback();
  
  console.log('✅ HexagramDetailsFallback loaded and ready');
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexagramDetailsFallback;
}