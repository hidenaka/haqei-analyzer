/**
 * IChingGuidanceEngine - 易経変化哲学に基づく段階的選択プロセス
 * 3段階の変化を通じて、主体的な行動選択の指針を提供
 */

console.log('☯️ IChingGuidanceEngine Loading...');

(function(global) {
  'use strict';

  class IChingGuidanceEngine {
    constructor() {
      this.name = 'IChingGuidanceEngine';
      this.version = '2.0.0';
      this.h384db = null;
      this.currentHexagram = null;
      this.currentYao = null;
      this.choiceHistory = [];
      this.isInitialized = false;
    }

    /**
     * 初期化
     */
    async initialize() {
      console.log('🔄 IChingGuidanceEngine initializing...');
      
      try {
        // H384データベース接続
        await this.connectDatabase();
        
        // 変化パターン初期化
        this.initializeChangePatterns();
        
        // 行動指針システム初期化
        this.initializeGuidanceSystem();
        
        this.isInitialized = true;
        console.log('✅ IChingGuidanceEngine initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ IChingGuidanceEngine initialization failed:', error);
        return false;
      }
    }

    /**
     * データベース接続
     */
    async connectDatabase() {
      // H384DatabaseConnectorの利用
      if (window.h384db && window.h384db.isLoaded) {
        this.h384db = window.h384db;
        console.log('✅ Connected to H384 Database');
      } else {
        // フォールバック
        console.warn('⚠️ H384db not ready, using getDatabaseData()');
        const data = window.getDatabaseData ? window.getDatabaseData() : [];
        if (data.length > 0) {
          this.h384db = { getDatabaseData: () => data };
        }
      }
    }

    /**
     * 変化パターン初期化
     */
    initializeChangePatterns() {
      // 易経の基本的な変化パターン
      this.changePatterns = {
        // 陽から陰への変化
        yangToYin: {
          name: '陽転陰',
          description: '積極的な状態から受容的な状態への変化',
          guidance: '力を抜いて、自然の流れに身を任せる時期'
        },
        // 陰から陽への変化
        yinToYang: {
          name: '陰転陽',
          description: '受動的な状態から能動的な状態への変化',
          guidance: '行動を起こし、主体的に動き出す時期'
        },
        // 老陽（極まった陽）
        oldYang: {
          name: '老陽',
          description: '陽が極まり、変化の時を迎える',
          guidance: '成功の頂点にあるが、謙虚さを忘れずに'
        },
        // 老陰（極まった陰）
        oldYin: {
          name: '老陰',
          description: '陰が極まり、転換点を迎える',
          guidance: '最も暗い時期を過ぎ、光が見え始める'
        }
      };
    }

    /**
     * 行動指針システム初期化
     */
    initializeGuidanceSystem() {
      // 3段階の選択における指針パターン
      this.guidancePatterns = {
        stage1: {
          conservative: {
            name: '保守的選択',
            keywords: ['安定', '継続', '忍耐'],
            description: '現状を維持し、内なる力を蓄える',
            iChingPrinciple: '潜龍勿用 - 力を秘めて時を待つ'
          },
          progressive: {
            name: '進歩的選択',
            keywords: ['変革', '挑戦', '革新'],
            description: '新しい可能性に向かって一歩踏み出す',
            iChingPrinciple: '見龍在田 - 才能を世に現す時'
          }
        },
        stage2: {
          collaborative: {
            name: '協調的選択',
            keywords: ['協力', '調和', '共生'],
            description: '他者との協力関係を重視する',
            iChingPrinciple: '群龍無首 - 皆が協力して進む'
          },
          independent: {
            name: '独立的選択',
            keywords: ['自立', '独創', '個性'],
            description: '自分の道を独自に切り開く',
            iChingPrinciple: '飛龍在天 - 独自の道を行く'
          }
        },
        stage3: {
          cautious: {
            name: '慎重な選択',
            keywords: ['熟慮', '計画', '準備'],
            description: '十分な準備と計画を重視',
            iChingPrinciple: '君子終日乾乾 - 慎重に努力を続ける'
          },
          decisive: {
            name: '決断的選択',
            keywords: ['即断', '直感', '勇気'],
            description: '直感を信じて迅速に行動',
            iChingPrinciple: '或躍在淵 - 機を見て躍動する'
          }
        }
      };
    }

    /**
     * 状況卦の算出
     */
    calculateSituationHexagram(inputText) {
      if (!this.h384db) {
        console.error('❌ Database not connected');
        return null;
      }

      const data = this.h384db.getDatabaseData();
      if (!data || data.length === 0) {
        console.error('❌ No database data available');
        return null;
      }

      // テキスト分析によるスコア計算
      const analysis = this.analyzeText(inputText);
      
      // 最適な卦・爻の選択
      let bestMatch = null;
      let highestScore = 0;

      data.forEach(entry => {
        const score = this.calculateMatchScore(analysis, entry);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = entry;
        }
      });

      if (bestMatch) {
        this.currentHexagram = bestMatch['卦番号'];
        this.currentYao = bestMatch['爻'];
        console.log(`📍 状況卦: ${bestMatch['卦名']} ${bestMatch['爻']}`);
        return bestMatch;
      }

      return null;
    }

    /**
     * テキスト分析
     */
    analyzeText(text) {
      const analysis = {
        length: text.length,
        emotionScore: 0,
        urgencyScore: 0,
        complexityScore: 0,
        keywords: []
      };

      // 感情スコア計算
      const positiveWords = ['希望', '成功', '良い', '楽しい', '嬉しい', '前向き'];
      const negativeWords = ['不安', '心配', '困難', '問題', '失敗', '悩み'];
      
      positiveWords.forEach(word => {
        if (text.includes(word)) analysis.emotionScore += 10;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) analysis.emotionScore -= 10;
      });

      // 緊急度スコア
      const urgentWords = ['急ぐ', '至急', '緊急', 'すぐ', '今すぐ', '締切'];
      urgentWords.forEach(word => {
        if (text.includes(word)) analysis.urgencyScore += 15;
      });

      // 複雑度スコア
      analysis.complexityScore = Math.min(100, text.length / 5);

      return analysis;
    }

    /**
     * マッチングスコア計算
     */
    calculateMatchScore(analysis, entry) {
      let score = 0;

      // 基本スコアを考慮
      score += entry['S1_基本スコア'] * 0.3;

      // 感情との適合性
      if (analysis.emotionScore > 0 && entry['S5_主体性推奨スタンス'] === '能動') {
        score += 20;
      } else if (analysis.emotionScore < 0 && entry['S5_主体性推奨スタンス'] === '受動') {
        score += 20;
      }

      // 緊急度との適合性
      if (analysis.urgencyScore > 30 && entry['S6_変動性スコア'] > 50) {
        score += 15;
      }

      // 複雑度との適合性
      if (analysis.complexityScore > 50 && entry['S3_安定性スコア'] > 50) {
        score += 10;
      }

      // リスクファクター
      score += entry['S4_リスク'] * 0.1;

      // 総合評価スコアを加味
      score += entry['S7_総合評価スコア'] * 0.2;

      return score;
    }

    /**
     * 3段階選択プロセスの生成
     */
    generateThreeStageProcess(situationHexagram) {
      const process = {
        currentSituation: situationHexagram,
        stages: []
      };

      // Stage 1: 基本方針の選択
      const stage1 = {
        stageNumber: 1,
        title: '第一段階：基本方針の選択',
        description: '現在の状況に対する基本的な態度を決める',
        choices: [],
        iChingGuidance: this.getStageGuidance(situationHexagram, 1)
      };

      // 保守的選択
      stage1.choices.push({
        id: 'conservative',
        ...this.guidancePatterns.stage1.conservative,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'conservative'),
        outcome: this.predictOutcome(situationHexagram, 'conservative', 1)
      });

      // 進歩的選択
      stage1.choices.push({
        id: 'progressive',
        ...this.guidancePatterns.stage1.progressive,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'progressive'),
        outcome: this.predictOutcome(situationHexagram, 'progressive', 1)
      });

      process.stages.push(stage1);

      // Stage 2: 実行方法の選択
      const stage2 = {
        stageNumber: 2,
        title: '第二段階：実行方法の選択',
        description: '選んだ方針をどのように実行するか',
        choices: [],
        iChingGuidance: this.getStageGuidance(situationHexagram, 2)
      };

      // 協調的選択
      stage2.choices.push({
        id: 'collaborative',
        ...this.guidancePatterns.stage2.collaborative,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'collaborative'),
        outcome: this.predictOutcome(situationHexagram, 'collaborative', 2)
      });

      // 独立的選択
      stage2.choices.push({
        id: 'independent',
        ...this.guidancePatterns.stage2.independent,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'independent'),
        outcome: this.predictOutcome(situationHexagram, 'independent', 2)
      });

      process.stages.push(stage2);

      // Stage 3: タイミングの選択
      const stage3 = {
        stageNumber: 3,
        title: '第三段階：タイミングの選択',
        description: '行動のタイミングと速度を決める',
        choices: [],
        iChingGuidance: this.getStageGuidance(situationHexagram, 3)
      };

      // 慎重な選択
      stage3.choices.push({
        id: 'cautious',
        ...this.guidancePatterns.stage3.cautious,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'cautious'),
        outcome: this.predictOutcome(situationHexagram, 'cautious', 3)
      });

      // 決断的選択
      stage3.choices.push({
        id: 'decisive',
        ...this.guidancePatterns.stage3.decisive,
        compatibility: this.calculateChoiceCompatibility(situationHexagram, 'decisive'),
        outcome: this.predictOutcome(situationHexagram, 'decisive', 3)
      });

      process.stages.push(stage3);

      return process;
    }

    /**
     * 各段階での易経的指導
     */
    getStageGuidance(hexagram, stageNumber) {
      const guidance = {
        principle: '',
        advice: '',
        warning: ''
      };

      // 卦の性質に基づく指導
      const stance = hexagram['S5_主体性推奨スタンス'];
      const stability = hexagram['S3_安定性スコア'];
      const risk = Math.abs(hexagram['S4_リスク']);

      switch(stageNumber) {
        case 1:
          if (stance === '能動') {
            guidance.principle = '陽の気が強い - 積極的な行動が吉';
            guidance.advice = '今は行動を起こす好機。自信を持って前進せよ。';
          } else {
            guidance.principle = '陰の気が強い - 受容と観察が吉';
            guidance.advice = '今は静観の時。状況をよく見極めてから動くべし。';
          }
          guidance.warning = risk > 50 ? '大きなリスクあり。慎重に。' : 'リスクは管理可能。';
          break;

        case 2:
          if (stability > 60) {
            guidance.principle = '安定の卦 - 着実な進歩を';
            guidance.advice = '基盤は固い。計画的に進めることで成功する。';
          } else {
            guidance.principle = '変動の卦 - 柔軟な対応を';
            guidance.advice = '状況は流動的。臨機応変に対応することが重要。';
          }
          guidance.warning = '固執は避け、状況に応じて調整せよ。';
          break;

        case 3:
          const volatility = hexagram['S6_変動性スコア'];
          if (volatility > 50) {
            guidance.principle = '変化激しき時 - 機を見て動け';
            guidance.advice = 'タイミングが重要。好機を逃さぬよう準備せよ。';
          } else {
            guidance.principle = '安定の時 - 着実に進め';
            guidance.advice = '焦る必要なし。自分のペースで進めばよい。';
          }
          guidance.warning = '時機を誤れば、努力も水泡に帰す。';
          break;
      }

      return guidance;
    }

    /**
     * 選択肢との適合性計算
     */
    calculateChoiceCompatibility(hexagram, choiceId) {
      let compatibility = 50; // 基準値

      const stance = hexagram['S5_主体性推奨スタンス'];
      const stability = hexagram['S3_安定性スコア'];
      const potential = hexagram['S2_ポテンシャル'];

      switch(choiceId) {
        case 'conservative':
          if (stance === '受動') compatibility += 30;
          if (stability > 60) compatibility += 20;
          break;
        
        case 'progressive':
          if (stance === '能動') compatibility += 30;
          if (potential > 60) compatibility += 20;
          break;
        
        case 'collaborative':
          if (hexagram['キーワード'].includes('協力')) compatibility += 25;
          compatibility += stability * 0.3;
          break;
        
        case 'independent':
          if (hexagram['キーワード'].includes('自立')) compatibility += 25;
          compatibility += potential * 0.3;
          break;
        
        case 'cautious':
          if (Math.abs(hexagram['S4_リスク']) > 50) compatibility += 30;
          break;
        
        case 'decisive':
          if (hexagram['S6_変動性スコア'] > 50) compatibility += 30;
          break;
      }

      return Math.min(100, Math.max(0, compatibility));
    }

    /**
     * 選択の結果予測
     */
    predictOutcome(hexagram, choiceId, stage) {
      const baseScore = hexagram['S7_総合評価スコア'];
      const compatibility = this.calculateChoiceCompatibility(hexagram, choiceId);
      
      // 成功確率の計算
      const successProbability = (baseScore * 0.5 + compatibility * 0.5);
      
      // 結果の記述
      let outcome = {
        probability: Math.round(successProbability),
        description: '',
        nextStep: ''
      };

      if (successProbability > 70) {
        outcome.description = '非常に良い選択。高い確率で望む結果が得られる。';
        outcome.nextStep = '自信を持って進め。';
      } else if (successProbability > 50) {
        outcome.description = '適切な選択。努力次第で良い結果が期待できる。';
        outcome.nextStep = '着実に実行することが重要。';
      } else if (successProbability > 30) {
        outcome.description = '挑戦的な選択。困難はあるが不可能ではない。';
        outcome.nextStep = '十分な準備と覚悟が必要。';
      } else {
        outcome.description = '困難な選択。別の道を検討することも視野に。';
        outcome.nextStep = '慎重に再考することを勧める。';
      }

      return outcome;
    }

    /**
     * 8つの未来シナリオ生成（3段階の選択の組み合わせ）
     */
    generate8Scenarios(process) {
      const scenarios = [];
      const combinations = [
        ['conservative', 'collaborative', 'cautious'],
        ['conservative', 'collaborative', 'decisive'],
        ['conservative', 'independent', 'cautious'],
        ['conservative', 'independent', 'decisive'],
        ['progressive', 'collaborative', 'cautious'],
        ['progressive', 'collaborative', 'decisive'],
        ['progressive', 'independent', 'cautious'],
        ['progressive', 'independent', 'decisive']
      ];

      combinations.forEach((combo, index) => {
        const scenario = {
          id: index + 1,
          path: combo,
          title: this.generateScenarioTitle(combo),
          description: this.generateScenarioDescription(combo, process.currentSituation),
          probability: this.calculateScenarioProbability(combo, process),
          characteristics: this.getScenarioCharacteristics(combo),
          iChingReference: this.getScenarioIChingReference(combo, process.currentSituation),
          visualPath: this.createVisualPath(combo)
        };
        scenarios.push(scenario);
      });

      // 確率順にソート
      scenarios.sort((a, b) => b.probability - a.probability);

      return scenarios;
    }

    /**
     * シナリオタイトル生成
     */
    generateScenarioTitle(combo) {
      const patterns = {
        'conservative,collaborative,cautious': '堅実な協調路線',
        'conservative,collaborative,decisive': '協調的現状改革',
        'conservative,independent,cautious': '独立的現状維持',
        'conservative,independent,decisive': '独自の保守革新',
        'progressive,collaborative,cautious': '慎重な共同革新',
        'progressive,collaborative,decisive': '迅速な協調変革',
        'progressive,independent,cautious': '計画的独立革新',
        'progressive,independent,decisive': '独創的即断革新'
      };
      
      return patterns[combo.join(',')] || '未定義の道';
    }

    /**
     * シナリオ説明生成
     */
    generateScenarioDescription(combo, hexagram) {
      let description = '';
      
      // Stage 1の選択による説明
      if (combo[0] === 'conservative') {
        description += '現状を基盤としながら、';
      } else {
        description += '新しい可能性を追求し、';
      }
      
      // Stage 2の選択による説明
      if (combo[1] === 'collaborative') {
        description += '周囲との協力関係を重視して、';
      } else {
        description += '独自の道を切り開きながら、';
      }
      
      // Stage 3の選択による説明
      if (combo[2] === 'cautious') {
        description += '慎重に計画を進める道。';
      } else {
        description += '機を見て素早く行動する道。';
      }
      
      // 卦の特性を加味
      const keywords = hexagram['キーワード'] || [];
      if (keywords.length > 0) {
        description += `特に「${keywords[0]}」の要素が重要となる。`;
      }
      
      return description;
    }

    /**
     * シナリオ確率計算
     */
    calculateScenarioProbability(combo, process) {
      let totalProbability = 0;
      let count = 0;
      
      combo.forEach((choice, stageIndex) => {
        const stage = process.stages[stageIndex];
        const choiceData = stage.choices.find(c => c.id === choice);
        if (choiceData && choiceData.outcome) {
          totalProbability += choiceData.outcome.probability;
          count++;
        }
      });
      
      return count > 0 ? Math.round(totalProbability / count) : 50;
    }

    /**
     * シナリオ特性取得
     */
    getScenarioCharacteristics(combo) {
      const characteristics = [];
      
      combo.forEach(choice => {
        // 各選択の特性を集約
        if (choice === 'conservative') characteristics.push('安定重視');
        if (choice === 'progressive') characteristics.push('革新重視');
        if (choice === 'collaborative') characteristics.push('協調性');
        if (choice === 'independent') characteristics.push('独立性');
        if (choice === 'cautious') characteristics.push('慎重さ');
        if (choice === 'decisive') characteristics.push('決断力');
      });
      
      return characteristics;
    }

    /**
     * シナリオの易経参照
     */
    getScenarioIChingReference(combo, hexagram) {
      // 組み合わせに基づく易経の教え
      const teachings = {
        'conservative,collaborative,cautious': '地山謙 - 謙虚に協力する',
        'conservative,collaborative,decisive': '地天泰 - 安定の中の決断',
        'conservative,independent,cautious': '山天大畜 - 内に力を蓄える',
        'conservative,independent,decisive': '天山遯 - 退いて機を待つ',
        'progressive,collaborative,cautious': '風天小畜 - 小さく蓄えて進む',
        'progressive,collaborative,decisive': '天火同人 - 志を同じくする',
        'progressive,independent,cautious': '火天大有 - 大いに保つ',
        'progressive,independent,decisive': '乾為天 - 天の道を行く'
      };
      
      const key = combo.join(',');
      const reference = teachings[key] || hexagram['卦名'];
      
      return {
        hexagram: reference.split(' - ')[0],
        meaning: reference.split(' - ')[1] || hexagram['現代解釈の要約']
      };
    }

    /**
     * ビジュアルパス作成
     */
    createVisualPath(combo) {
      // 3段階の選択を視覚化するためのパス情報
      return {
        stage1: {
          choice: combo[0],
          position: combo[0] === 'conservative' ? 'left' : 'right',
          color: combo[0] === 'conservative' ? '#3B82F6' : '#10B981'
        },
        stage2: {
          choice: combo[1],
          position: combo[1] === 'collaborative' ? 'left' : 'right',
          color: combo[1] === 'collaborative' ? '#F59E0B' : '#8B5CF6'
        },
        stage3: {
          choice: combo[2],
          position: combo[2] === 'cautious' ? 'left' : 'right',
          color: combo[2] === 'cautious' ? '#EF4444' : '#06B6D4'
        }
      };
    }

    /**
     * 選択履歴の記録
     */
    recordChoice(stage, choice) {
      this.choiceHistory.push({
        stage: stage,
        choice: choice,
        timestamp: new Date().toISOString()
      });
      
      // localStorageに保存
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('iching_choice_history', JSON.stringify(this.choiceHistory));
      }
    }

    /**
     * 選択履歴の取得
     */
    getChoiceHistory() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('iching_choice_history');
        if (saved) {
          this.choiceHistory = JSON.parse(saved);
        }
      }
      return this.choiceHistory;
    }

    /**
     * 完全な分析実行
     */
    async performCompleteAnalysis(inputText) {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // 1. 状況卦の算出
      const situationHexagram = this.calculateSituationHexagram(inputText);
      if (!situationHexagram) {
        console.error('❌ Failed to calculate situation hexagram');
        return null;
      }

      // 2. 3段階選択プロセスの生成
      const process = this.generateThreeStageProcess(situationHexagram);

      // 3. 8つの未来シナリオの生成
      const scenarios = this.generate8Scenarios(process);

      // 4. 結果の統合
      const result = {
        inputText: inputText,
        currentSituation: situationHexagram,
        threeStageProcess: process,
        eightScenarios: scenarios,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Complete analysis performed:', result);
      return result;
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.IChingGuidanceEngine = IChingGuidanceEngine;
    window.iChingGuidance = new IChingGuidanceEngine();
    
    // 自動初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.iChingGuidance.initialize();
      });
    } else {
      window.iChingGuidance.initialize();
    }
  }

  console.log('✅ IChingGuidanceEngine loaded');
  
})(typeof window !== 'undefined' ? window : this);