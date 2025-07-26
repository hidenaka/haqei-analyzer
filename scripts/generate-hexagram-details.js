// generate-hexagram-details.js - 残り63卦のHEXAGRAM_DETAILSデータを生成

const fs = require('fs');
const path = require('path');

// フォールバック機能をNode.js環境で使用するため、ブラウザ専用部分を除いた実装
class HexagramDataGenerator {
  constructor() {
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

    this.coreDrivePatterns = {
      pure: {
        1: '新しいものを創造し、世界に影響を与えること',
        2: '人々との交流を通じて喜びと楽しさを分かち合うこと',
        3: '知性と美を通じて自己を表現し、他者を啓発すること',
        4: '変化と挑戦を通じて成長し、新たな可能性を開拓すること',
        5: '調和と協力を重んじ、持続可能な価値を創造すること',
        6: '深い探求と洞察によって真理を見つけ、智慧を分かち合うこと',
        7: '安定と継続性を保ち、確実な価値を築き上げること',
        8: '他者を支援し育成することで、全体の調和と発展を促すこと'
      },
      mixed: '複数の価値観を統合し、独自の世界観を構築すること'
    };
  }

  // hexagrams.jsから卦データを読み込み
  loadHexagramsData() {
    try {
      const hexagramsPath = path.join(__dirname, 'public/js/data/hexagrams.js');
      const content = fs.readFileSync(hexagramsPath, 'utf8');
      
      // hexagrams_master配列を抽出
      const hexagramsMatch = content.match(/var hexagrams_master = (\[[\s\S]*?\]);/);
      if (!hexagramsMatch) {
        throw new Error('hexagrams_master配列が見つかりません');
      }
      
      // evalの代わりに、より安全な方法でデータを取得
      const hexagramsArrayString = hexagramsMatch[1];
      
      // Function constructorを使って安全にevaluate
      const hexagramsArray = new Function('return ' + hexagramsArrayString)();
      
      console.log(`📊 ${hexagramsArray.length}個の卦データを読み込み`);
      return hexagramsArray;
      
    } catch (error) {
      console.error('❌ hexagrams.js読み込みエラー:', error);
      return [];
    }
  }

  // 卦詳細データを生成
  generateHexagramDetails(hexagramId, hexagramData) {
    const upperTrigramId = hexagramData.upper_trigram_id;
    const lowerTrigramId = hexagramData.lower_trigram_id;
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
    const interfaceOS = {
      how_it_appears: this.generateAppearance(upperTrigramId, lowerTrigramId, hexagramData),
      behavioral_patterns: this.combineBehaviors(upperChars, lowerChars),
      impression_on_others: this.generateImpression(upperTrigramId, lowerTrigramId, hexagramData)
    };

    // Safe Mode OS詳細
    const safe_mode = {
      trigger_situations: this.generateTriggers(upperTrigramId, lowerTrigramId),
      defensive_patterns: this.combineDefensivePatterns(upperChars, lowerChars),
      internal_state: this.generateInternalState(upperTrigramId, lowerTrigramId, hexagramData)
    };

    // 八卦構成
    const trigrams = {
      upper: this.getTrigramInfo(upperTrigramId),
      lower: this.getTrigramInfo(lowerTrigramId)
    };

    return {
      name_jp: hexagramData.name_jp,
      catchphrase: hexagramData.catchphrase,
      description: hexagramData.description,
      keywords: hexagramData.keywords ? hexagramData.keywords.split(',') : ['成長', '変化', '調和'],
      engine,
      interface: interfaceOS,
      safe_mode,
      trigrams
    };
  }

  // ヘルパーメソッド群
  calculateStrengthMeter(upper, lower) {
    const baseStrength = {1: 95, 2: 70, 3: 85, 4: 80, 5: 75, 6: 78, 7: 82, 8: 72};
    const upperStr = baseStrength[upper] || 75;
    const lowerStr = baseStrength[lower] || 75;
    return Math.round((upperStr * 0.6 + lowerStr * 0.4));
  }

  generateCoreDrive(upper, lower) {
    if (upper === lower) {
      return this.coreDrivePatterns.pure[upper] || this.coreDrivePatterns.mixed;
    }
    return this.coreDrivePatterns.mixed;
  }

  combineStrengths(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['創造性', '洞察力', '価値観への忠実さ'];
    return [...upperChars.engineStrengths.slice(0, 2), ...lowerChars.engineStrengths.slice(0, 1)];
  }

  combineWeaknesses(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['理想主義的傾向', '他者との価値観の違い', '変化への抵抗'];
    return [...upperChars.engineWeaknesses.slice(0, 2), ...lowerChars.engineWeaknesses.slice(0, 1)];
  }

  combineBehaviors(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['慎重な発言', '深い洞察の提供', '価値観に基づく行動'];
    return [...upperChars.interfaceBehaviors.slice(0, 2), ...lowerChars.interfaceBehaviors.slice(0, 1)];
  }

  combineDefensivePatterns(upperChars, lowerChars) {
    if (!upperChars || !lowerChars) return ['内向的になる', '自分の世界に閉じこもる', '頑固な態度'];
    return [...upperChars.safeModePatterns.slice(0, 2), ...lowerChars.safeModePatterns.slice(0, 1)];
  }

  generateAppearance(upper, lower, hexagramData) {
    const appearances = {
      1: '自信に満ちた堂々とした振る舞い。常にグループの中心にいる。',
      2: '明るく親しみやすい雰囲気。誰とでもすぐに打ち解ける。',
      3: '知的で華やかな存在感。美的センスが光る。',
      4: 'エネルギッシュで活動的な様子。変化を恐れない。',
      5: '穏やかで協調的な態度。人の間を上手に取り持つ。',
      6: '慎重で思慮深い姿勢。問題の本質を見抜く。',
      7: '安定感のある落ち着いた様子。信頼できる存在。',
      8: '温和で支援的な雰囲気。人を受け入れる包容力。'
    };
    
    return appearances[upper] || '独特な存在感を持つ人。';
  }

  generateImpression(upper, lower, hexagramData) {
    return `${hexagramData.catchphrase}として周囲に印象を与える。その特性は時に理解されにくいが、深く関わると魅力的な人物だとわかる。`;
  }

  generateTriggers(upper, lower) {
    return [
      '自分の価値観が否定された時',
      '理不尽な状況に直面した時',
      '長期間のストレスにさらされた時'
    ];
  }

  generateInternalState(upper, lower, hexagramData) {
    return `「${hexagramData.catchphrase}」としての自分を貫きたい気持ちと、周囲との調和を求める気持ちの間での内的な葛藤。`;
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

  // 全64卦のデータを生成
  generateAllHexagramDetails() {
    const hexagramsArray = this.loadHexagramsData();
    const allDetails = {};

    // 第1卦は既存データを保持（もし存在すれば）
    allDetails[1] = {
      name_jp: "乾為天（けんいてん）",
      catchphrase: "天の創造性。無限の可能性を秘めたリーダー。",
      description: "純粋な陽のエネルギーで構成され、創造、リーダーシップ、無限の可能性を象徴します。自ら道を切り開き、他者を導く力強い存在ですが、時にそのエネルギーが強すぎて傲慢に見えることもあります。",
      keywords: ["創造", "リーダーシップ", "父性", "無限", "行動", "決断力"],
      
      engine: {
        strength_meter: 95,
        core_drive: "新しいものを創造し、世界に影響を与えること。",
        potential_strengths: [
          "卓越したリーダーシップとカリスマ性",
          "困難な状況を打開する強力な実行力",
          "常に新しい可能性を追求する創造性"
        ],
        potential_weaknesses: [
          "自己中心的で、他者の意見を聞かない傾向",
          "完璧主義で、自分にも他人にも厳しすぎる",
          "休息を取らず、燃え尽きてしまうリスク"
        ]
      },

      interface: {
        how_it_appears: "自信に満ち、堂々とした振る舞い。常にグループの中心にいる。",
        behavioral_patterns: [
          "会議や議論で積極的に意見を述べ、場をリードする",
          "誰もやりたがらない困難なタスクに率先して取り組む",
          "明確なビジョンを語り、周囲を巻き込む"
        ],
        impression_on_others: "頼りになるリーダーだが、少し近寄りがたい。ワンマンに見えることもある。"
      },

      safe_mode: {
        trigger_situations: [
          "自分の権威や能力が脅かされたと感じた時",
          "計画が思い通りに進まず、コントロールを失ったと感じた時",
          "強いストレスやプレッシャーに長期間さらされた時"
        ],
        defensive_patterns: [
          "独断で物事を決定し、他者の介入を拒絶する",
          "過度に批判的になり、他者の欠点を厳しく指摘する",
          "自分の殻に閉じこもり、一切の助言を無視する"
        ],
        internal_state: "「なぜ誰も理解できないんだ」という孤独感と、「全て自分でやらなければ」という過剰な責任感。"
      },

      trigrams: {
        upper: { name: "乾", symbol: "☰", description: "天、創造性、父性" },
        lower: { name: "乾", symbol: "☰", description: "天、行動、決断力" }
      }
    };

    console.log('🔄 全64卦の詳細データ生成開始...');

    // 第2卦以降を生成
    hexagramsArray.forEach((hexagram, index) => {
      const hexagramId = hexagram.hexagram_id;
      
      if (hexagramId !== 1) { // 第1卦以外を生成
        allDetails[hexagramId] = this.generateHexagramDetails(hexagramId, hexagram);
        
        if (hexagramId % 10 === 0) {
          console.log(`📊 ${hexagramId}/64 卦の詳細データ生成完了`);
        }
      }
    });

    console.log('✅ 全64卦の詳細データ生成完了');
    return allDetails;
  }

  // hexagram_details.jsファイルを更新
  updateHexagramDetailsFile() {
    try {
      const allDetails = this.generateAllHexagramDetails();
      
      // ファイルコンテンツを生成
      const header = `// hexagram_details.js - 易経64卦詳細データ定義ファイル（完全版）
// HaQei Analyzer - Complete Hexagram Details Data
// 64卦の詳細情報（自動生成 ${new Date().toISOString()}）

const HEXAGRAM_DETAILS = {`;

      const detailsJson = Object.keys(allDetails).map(hexagramId => {
        const jsonStr = JSON.stringify(allDetails[hexagramId], null, 4);
        return `    ${hexagramId}: ${jsonStr.replace(/\n/g, '\n    ')}`;
      }).join(',\n');

      const footer = `};

if (typeof window !== 'undefined') {
    window.HEXAGRAM_DETAILS = HEXAGRAM_DETAILS;
    console.log('✅ Complete HEXAGRAM_DETAILS loaded:', Object.keys(HEXAGRAM_DETAILS).length, 'hexagrams');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HEXAGRAM_DETAILS;
}`;

      const newFileContent = `${header}\n${detailsJson}\n${footer}`;
      
      // ファイルを更新
      const detailsPath = path.join(__dirname, 'public/js/data/hexagram_details.js');
      fs.writeFileSync(detailsPath, newFileContent, 'utf8');
      
      console.log('✅ hexagram_details.jsファイルの更新完了');
      console.log(`📈 追加されたデータ: 全64卦の詳細情報`);
      console.log(`🔧 Engine OS詳細: 強度、核となる動機、強み・課題`);
      console.log(`🖥️ Interface OS詳細: 外見、行動パターン、他者の印象`);
      console.log(`🛡️ Safe Mode OS詳細: トリガー、防御パターン、内的状態`);
      
    } catch (error) {
      console.error('❌ エラーが発生しました:', error);
      process.exit(1);
    }
  }
}

// スクリプト実行
const generator = new HexagramDataGenerator();
generator.updateHexagramDetailsFile();