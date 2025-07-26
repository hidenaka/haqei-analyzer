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

  // メインのフォールバック機能
  generateHexagramDetails(hexagramId, hexagramData) {
    try {
      // 既存のHEXAGRAM_DETAILSを優先使用
      if (window.HEXAGRAM_DETAILS && window.HEXAGRAM_DETAILS[hexagramId]) {
        return window.HEXAGRAM_DETAILS[hexagramId];
      }

      // フォールバック生成
      const upperTrigramId = hexagramData.upper_trigram_id;
      const lowerTrigramId = hexagramData.lower_trigram_id;
      
      return this.generateFallbackDetails(hexagramId, hexagramData, upperTrigramId, lowerTrigramId);
      
    } catch (error) {
      console.warn(`⚠️ フォールバック生成エラー (卦${hexagramId}):`, error);
      return this.generateBasicFallback(hexagramId, hexagramData);
    }
  }

  // 詳細なフォールバック生成
  generateFallbackDetails(hexagramId, hexagramData, upperTrigramId, lowerTrigramId) {
    const upperChars = this.trigramCharacteristics[upperTrigramId];
    const lowerChars = this.trigramCharacteristics[lowerTrigramId];
    
    // Engine OS詳細
    const engine = {
      strength_meter: this.calculateStrengthMeter(upperTrigramId, lowerTrigramId),
      core_drive: this.generateCoreDrive(upperTrigramId, lowerTrigramId),
      potential_strengths: this.combineStrengths(upperChars, lowerChars),
      potential_weaknesses: this.combineWeaknesses(upperChars, lowerChars)
    };

    // Interface OS詳細
    const interface = {
      how_it_appears: this.generateAppearance(upperTrigramId, lowerTrigramId),
      behavioral_patterns: this.combineBehaviors(upperChars, lowerChars),
      impression_on_others: this.generateImpression(upperTrigramId, lowerTrigramId)
    };

    // Safe Mode OS詳細
    const safe_mode = {
      trigger_situations: this.generateTriggers(upperTrigramId, lowerTrigramId),
      defensive_patterns: this.combineDefensivePatterns(upperChars, lowerChars),
      internal_state: this.generateInternalState(upperTrigramId, lowerTrigramId)
    };

    // 八卦構成
    const trigrams = {
      upper: this.getTrigramInfo(upperTrigramId),
      lower: this.getTrigramInfo(lowerTrigramId)
    };

    return {
      name_jp: hexagramData.name_jp || `第${hexagramId}卦`,
      catchphrase: hexagramData.catchphrase || '深い智慧を持つ人',
      description: hexagramData.description || `${hexagramData.name_jp}の卦は、独特な価値観と深い洞察力を持つ存在です。`,
      keywords: hexagramData.keywords ? hexagramData.keywords.split(',') : ['成長', '変化', '調和'],
      engine,
      interface,
      safe_mode,
      trigrams
    };
  }

  // 基本的なフォールバック（最終手段）
  generateBasicFallback(hexagramId, hexagramData) {
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

  // 公開メソッド：外部から使用
  getHexagramDetails(hexagramId) {
    // hexagrams_masterからデータ取得
    const hexagramData = window.hexagrams_master?.find(h => h.hexagram_id === hexagramId);
    if (!hexagramData) {
      console.warn(`⚠️ 卦${hexagramId}のデータが見つかりません`);
      return this.generateBasicFallback(hexagramId, null);
    }
    
    return this.generateHexagramDetails(hexagramId, hexagramData);
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