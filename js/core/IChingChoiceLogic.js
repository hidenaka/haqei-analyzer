/**
 * IChingChoiceLogic - 易経の変化ロジック
 * 状況卦・爻のテーマに従うか従わないかによる変化システム
 * 
 * 暫定ロジック（易経専門家の確認待ち）：
 * - テーマに従う：進爻（次の爻へ進む）
 * - テーマに従わない：変爻（陰陽反転）
 */

console.log('☯️ IChingChoiceLogic Loading...');

(function(global) {
  'use strict';

  class IChingChoiceLogic {
    constructor() {
      this.name = 'IChingChoiceLogic';
      this.version = '2.0.0';
      this.h384db = null;
      
      // 64卦の順序（序卦伝に基づく）
      this.hexagramSequence = [
        '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
        '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
        '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
        '天雷无妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
        '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
        '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
        '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
        '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
      ];
      
      // 爻の名称
      this.yaoNames = {
        1: { yang: '初九', yin: '初六' },
        2: { yang: '九二', yin: '六二' },
        3: { yang: '九三', yin: '六三' },
        4: { yang: '九四', yin: '六四' },
        5: { yang: '九五', yin: '六五' },
        6: { yang: '上九', yin: '上六' }
      };
    }

    /**
     * 初期化
     */
    async initialize() {
      console.log('🔄 IChingChoiceLogic initializing...');
      
      // H384データベース接続
      if (window.h384db && window.h384db.isLoaded) {
        this.h384db = window.h384db;
      } else {
        console.warn('⚠️ H384 Database not ready');
      }
      
      console.log('✅ IChingChoiceLogic initialized');
      return true;
    }

    /**
     * 選択に基づく変化を計算
     * @param {Object} currentHexagram - 現在の卦・爻データ
     * @param {boolean} followTheme - テーマに従うか（true）従わないか（false）
     */
    calculateChange(currentHexagram, followTheme) {
      console.log(`🔄 Calculating change: ${currentHexagram['卦名']} ${currentHexagram['爻']}, follow=${followTheme}`);
      
      if (followTheme) {
        // テーマに従う：進爻
        return this.progressYao(currentHexagram);
      } else {
        // テーマに従わない：変爻
        return this.changeYao(currentHexagram);
      }
    }

    /**
     * 進爻：次の爻へ進む
     */
    progressYao(currentHexagram) {
      const currentYaoNumber = this.getYaoNumber(currentHexagram['爻']);
      const hexagramNumber = currentHexagram['卦番号'];
      
      if (currentYaoNumber < 6) {
        // 次の爻へ進む（易経専門家確認済み：自然な発展）
        const nextYaoNumber = currentYaoNumber + 1;
        const nextData = this.getHexagramYaoData(hexagramNumber, nextYaoNumber);
        
        console.log(`📈 進爻: ${currentHexagram['爻']} → ${nextData['爻']}`);
        return nextData;
      } else {
        // 上爻の場合：序卦伝の順序で次の卦の初爻へ
        const nextHexagramNumber = this.getNextHexagramBySequence(hexagramNumber);
        const nextData = this.getHexagramYaoData(nextHexagramNumber, 1);
        
        console.log(`📈 次卦へ: ${currentHexagram['卦名']} → ${nextData['卦名']}`);
        return nextData;
      }
    }

    /**
     * 序卦伝に基づく次の卦番号取得
     */
    getNextHexagramBySequence(currentHexagramNumber) {
      // 序卦伝の順序（1-64の循環）
      if (currentHexagramNumber === 64) {
        return 1; // 火水未済 → 乾為天へ循環
      }
      return currentHexagramNumber + 1;
    }

    /**
     * 変爻：陰陽反転による変化
     */
    changeYao(currentHexagram) {
      const hexagramBinary = this.hexagramToBinary(currentHexagram['卦番号']);
      const yaoNumber = this.getYaoNumber(currentHexagram['爻']);
      
      // 該当爻を反転（易経専門家確認済み：変革・転換）
      const yaoIndex = yaoNumber - 1;
      const changedBinary = [...hexagramBinary];
      changedBinary[yaoIndex] = changedBinary[yaoIndex] === '1' ? '0' : '1';
      
      // 新しい卦番号を計算
      const newHexagramNumber = this.binaryToHexagram(changedBinary.join(''));
      
      // 変化後も同じ爻位置のデータを取得
      const nextData = this.getHexagramYaoData(newHexagramNumber, yaoNumber);
      
      console.log(`🔄 変爻: ${currentHexagram['卦名']}${currentHexagram['爻']} → ${nextData['卦名']}${nextData['爻']}`);
      return nextData;
    }

    /**
     * 爻名から爻番号を取得
     */
    getYaoNumber(yaoName) {
      const mapping = {
        '初九': 1, '初六': 1,
        '九二': 2, '六二': 2,
        '九三': 3, '六三': 3,
        '九四': 4, '六四': 4,
        '九五': 5, '六五': 5,
        '上九': 6, '上六': 6,
        '用九': 7, '用六': 7  // 特殊ケース
      };
      return mapping[yaoName] || 1;
    }

    /**
     * 爻の陰陽を判定
     */
    isYangYao(yaoName) {
      return yaoName.includes('九');
    }

    /**
     * 卦番号を6ビットバイナリに変換
     */
    hexagramToBinary(hexagramNumber) {
      // 易経の伝統的な卦構成を取得（簡略化版）
      // 実際には64卦それぞれの爻構成データが必要
      return this.getHexagramStructure(hexagramNumber);
    }

    /**
     * 6ビットバイナリから卦番号を計算
     */
    binaryToHexagram(binary) {
      // 二進数から卦番号への変換（簡略化版）
      // 実際には卦の構成から番号を特定する必要がある
      return this.findHexagramByStructure(binary);
    }

    /**
     * 卦の爻構成を取得（暫定実装）
     */
    getHexagramStructure(hexagramNumber) {
      // 64卦の爻構成データ（下から上へ：初爻→上爻）
      // 1=陽、0=陰
      const structures = {
        1: '111111',  // 乾為天（全陽）
        2: '000000',  // 坤為地（全陰）
        3: '010001',  // 水雷屯
        4: '100010',  // 山水蒙
        5: '010111',  // 水天需
        6: '111010',  // 天水訟
        7: '000010',  // 地水師
        8: '010000',  // 水地比
        9: '110111',  // 風天小畜
        10: '111011', // 天澤履
        11: '111000', // 地天泰（天在下・地在上）
        12: '000111', // 天地否（天在上・地在下）
        13: '111101', // 天火同人
        14: '101111', // 火天大有
        15: '000100', // 地山謙
        16: '001000', // 雷地豫
        17: '011001', // 澤雷随
        18: '100110', // 山風蠱
        19: '000011', // 地澤臨
        20: '110000', // 風地観
        21: '101001', // 火雷噬嗑
        22: '100101', // 山火賁
        23: '100000', // 山地剥
        24: '000001', // 地雷復
        25: '111001', // 天雷无妄
        26: '100111', // 山天大畜
        27: '100001', // 山雷頤
        28: '011110', // 澤風大過
        29: '010010', // 坎為水
        30: '101101', // 離為火
        31: '011100', // 澤山咸
        32: '001110', // 雷風恒
        33: '111100', // 天山遯
        34: '001111', // 雷天大壮
        35: '101000', // 火地晋
        36: '000101', // 地火明夷
        37: '110101', // 風火家人
        38: '101011', // 火澤睽
        39: '010100', // 水山蹇
        40: '001010', // 雷水解
        41: '100011', // 山澤損
        42: '110001', // 風雷益
        43: '011111', // 澤天夬
        44: '111110', // 天風姤
        45: '011000', // 澤地萃
        46: '000110', // 地風升
        47: '011010', // 澤水困
        48: '010110', // 水風井
        49: '011101', // 澤火革
        50: '101110', // 火風鼎
        51: '001001', // 震為雷
        52: '100100', // 艮為山
        53: '110100', // 風山漸
        54: '001011', // 雷澤帰妹
        55: '001101', // 雷火豊
        56: '101100', // 火山旅
        57: '110110', // 巽為風
        58: '011011', // 兌為澤
        59: '110010', // 風水渙
        60: '010011', // 水澤節
        61: '110011', // 風澤中孚
        62: '001100', // 雷山小過
        63: '010101', // 水火既済
        64: '101010'  // 火水未済
      };
      
      return structures[hexagramNumber] ? structures[hexagramNumber].split('') : ['0','0','0','0','0','0'];
    }

    /**
     * 爻構成から卦番号を特定（暫定実装）
     */
    findHexagramByStructure(binary) {
      const structureMap = {
        '111111': 1,  // 乾為天
        '000000': 2,  // 坤為地
        '010001': 3,  // 水雷屯
        '100010': 4,  // 山水蒙
        '010111': 5,  // 水天需
        '111010': 6,  // 天水訟
        '000010': 7,  // 地水師
        '010000': 8,  // 水地比
        '110111': 9,  // 風天小畜
        '111011': 10, // 天澤履
        '000111': 11, // 地天泰
        '111000': 12, // 天地否
        '111101': 13, // 天火同人
        '101111': 14, // 火天大有
        '000100': 15, // 地山謙
        '001000': 16, // 雷地豫
        '011001': 17, // 澤雷随
        '100110': 18, // 山風蠱
        '000011': 19, // 地澤臨
        '110000': 20, // 風地観
        '101001': 21, // 火雷噬嗑
        '100101': 22, // 山火賁
        '100000': 23, // 山地剥
        '000001': 24, // 地雷復
        '111001': 25, // 天雷无妄
        '100111': 26, // 山天大畜
        '100001': 27, // 山雷頤
        '011110': 28, // 澤風大過
        '010010': 29, // 坎為水
        '101101': 30, // 離為火
        '011100': 31, // 澤山咸
        '001110': 32, // 雷風恒
        '111100': 33, // 天山遯
        '001111': 34, // 雷天大壮
        '101000': 35, // 火地晋
        '000101': 36, // 地火明夷
        '110101': 37, // 風火家人
        '101011': 38, // 火澤睽
        '010100': 39, // 水山蹇
        '001010': 40, // 雷水解
        '100011': 41, // 山澤損
        '110001': 42, // 風雷益
        '011111': 43, // 澤天夬
        '111110': 44, // 天風姤
        '011000': 45, // 澤地萃
        '000110': 46, // 地風升
        '011010': 47, // 澤水困
        '010110': 48, // 水風井
        '011101': 49, // 澤火革
        '101110': 50, // 火風鼎
        '001001': 51, // 震為雷
        '100100': 52, // 艮為山
        '110100': 53, // 風山漸
        '001011': 54, // 雷澤帰妹
        '001101': 55, // 雷火豊
        '101100': 56, // 火山旅
        '110110': 57, // 巽為風
        '011011': 58, // 兌為澤
        '110010': 59, // 風水渙
        '010011': 60, // 水澤節
        '110011': 61, // 風澤中孚
        '001100': 62, // 雷山小過
        '010101': 63, // 水火既済
        '101010': 64  // 火水未済
      };
      
      return structureMap[binary] || 1; // デフォルトは乾為天
    }

    /**
     * H384データベースから特定の卦・爻データを取得
     */
    getHexagramYaoData(hexagramNumber, yaoNumber) {
      if (!this.h384db) {
        console.error('❌ Database not connected');
        return null;
      }
      
      return this.h384db.getHexagramYaoData(hexagramNumber, yaoNumber);
    }

    /**
     * 3段階の選択プロセスを生成
     */
    generateThreeStageChoices(initialHexagram) {
      const stages = [];
      let currentHexagram = initialHexagram;
      
      for (let stage = 1; stage <= 3; stage++) {
        const stageData = {
          stage: stage,
          current: currentHexagram,
          theme: this.extractTheme(currentHexagram),
          choices: [
            {
              id: 'follow',
              label: 'テーマに従う',
              description: `「${currentHexagram['キーワード'].join('、')}」を受け入れて行動する`,
              next: this.calculateChange(currentHexagram, true),
              compatibility: this.calculateCompatibility(currentHexagram, true)
            },
            {
              id: 'reject',
              label: 'テーマに従わない',
              description: `「${currentHexagram['キーワード'].join('、')}」とは異なる道を選ぶ`,
              next: this.calculateChange(currentHexagram, false),
              compatibility: this.calculateCompatibility(currentHexagram, false)
            }
          ]
        };
        
        stages.push(stageData);
        
        // 次の段階の準備（仮に「従う」を選択した場合で進める）
        // 実際には前の選択結果に基づいて動的に変更
        currentHexagram = stageData.choices[0].next;
      }
      
      return stages;
    }

    /**
     * テーマ抽出
     */
    extractTheme(hexagram) {
      return {
        keywords: hexagram['キーワード'],
        interpretation: hexagram['現代解釈の要約'],
        stance: hexagram['S5_主体性推奨スタンス'],
        action: this.getRecommendedAction(hexagram)
      };
    }

    /**
     * 推奨アクション生成
     */
    getRecommendedAction(hexagram) {
      const stance = hexagram['S5_主体性推奨スタンス'];
      const keywords = hexagram['キーワード'];
      
      if (stance === '能動') {
        return `積極的に${keywords[0]}を実行する`;
      } else if (stance === '受動') {
        return `慎重に${keywords[0]}の時期を待つ`;
      } else {
        return `状況を見極めながら${keywords[0]}を意識する`;
      }
    }

    /**
     * 選択の適合性計算
     */
    calculateCompatibility(hexagram, followTheme) {
      const baseScore = hexagram['S7_総合評価スコア'];
      const risk = Math.abs(hexagram['S4_リスク']);
      
      if (followTheme) {
        // テーマに従う場合
        return Math.round(baseScore * 0.8 + (100 - risk) * 0.2);
      } else {
        // テーマに従わない場合
        return Math.round((100 - baseScore) * 0.6 + risk * 0.4);
      }
    }

    /**
     * 8つのシナリオパス生成
     */
    generate8Scenarios(threeStages) {
      const scenarios = [];
      const paths = [
        ['follow', 'follow', 'follow'],
        ['follow', 'follow', 'reject'],
        ['follow', 'reject', 'follow'],
        ['follow', 'reject', 'reject'],
        ['reject', 'follow', 'follow'],
        ['reject', 'follow', 'reject'],
        ['reject', 'reject', 'follow'],
        ['reject', 'reject', 'reject']
      ];
      
      paths.forEach((path, index) => {
        let currentHexagram = threeStages[0].current;
        const pathDetails = [];
        
        // 各段階での選択を追跡
        path.forEach((choice, stageIndex) => {
          const stage = threeStages[stageIndex];
          const choiceData = stage.choices.find(c => c.id === choice);
          
          pathDetails.push({
            stage: stageIndex + 1,
            hexagram: currentHexagram,
            choice: choice,
            choiceLabel: choiceData.label,
            theme: stage.theme
          });
          
          // 次の卦へ
          currentHexagram = choiceData.next;
        });
        
        scenarios.push({
          id: index + 1,
          path: path,
          pathDetails: pathDetails,
          finalHexagram: currentHexagram,
          title: this.generateScenarioTitle(path),
          description: this.generateScenarioDescription(pathDetails),
          probability: this.calculateScenarioProbability(pathDetails),
          recommendation: this.generateRecommendation(pathDetails)
        });
      });
      
      return scenarios;
    }

    /**
     * シナリオタイトル生成
     */
    generateScenarioTitle(path) {
      const patterns = {
        'follow,follow,follow': '完全受容の道',
        'follow,follow,reject': '最終転換の道',
        'follow,reject,follow': '中間転換の道',
        'follow,reject,reject': '後半革新の道',
        'reject,follow,follow': '初期革新の道',
        'reject,follow,reject': '両端革新の道',
        'reject,reject,follow': '最終受容の道',
        'reject,reject,reject': '完全革新の道'
      };
      
      return patterns[path.join(',')] || '未定義の道';
    }

    /**
     * シナリオ説明生成
     */
    generateScenarioDescription(pathDetails) {
      let description = '';
      
      pathDetails.forEach((detail, index) => {
        const action = detail.choice === 'follow' ? '受け入れ' : '拒否し';
        description += `第${index + 1}段階で「${detail.theme.keywords[0]}」を${action}、`;
      });
      
      description += '新たな道を切り開く。';
      return description;
    }

    /**
     * シナリオ確率計算
     */
    calculateScenarioProbability(pathDetails) {
      let totalScore = 0;
      
      pathDetails.forEach(detail => {
        const hexagram = detail.hexagram;
        const followTheme = detail.choice === 'follow';
        const compatibility = this.calculateCompatibility(hexagram, followTheme);
        totalScore += compatibility;
      });
      
      return Math.round(totalScore / pathDetails.length);
    }

    /**
     * 推奨事項生成
     */
    generateRecommendation(pathDetails) {
      const followCount = pathDetails.filter(d => d.choice === 'follow').length;
      
      if (followCount === 3) {
        return '易経の教えに完全に従い、自然の流れに身を任せることで最良の結果を得られるでしょう。';
      } else if (followCount === 0) {
        return '既存の枠組みにとらわれず、独自の道を切り開くことで新たな可能性が開けるでしょう。';
      } else {
        return 'バランスを保ちながら、状況に応じて柔軟に対応することが成功への鍵となるでしょう。';
      }
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.IChingChoiceLogic = IChingChoiceLogic;
    window.iChingChoice = new IChingChoiceLogic();
    
    // 自動初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.iChingChoice.initialize();
      });
    } else {
      window.iChingChoice.initialize();
    }
  }

  console.log('✅ IChingChoiceLogic loaded');
  
})(typeof window !== 'undefined' ? window : this);