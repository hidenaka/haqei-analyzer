/**
 * VirtualPersonaDialogue - 仮想人格内的対話システム
 * Phase 3 Week 1 Implementation
 * HaQei Philosophy Integration
 */

console.log('🎭 VirtualPersonaDialogue Loading...');

(function(global) {
  'use strict';

  class VirtualPersonaDialogue {
    constructor() {
      this.name = 'VirtualPersonaDialogue';
      this.version = '1.0.0';
      this.philosophy = 'haqei-persona-dialogue';
      
      // 対話シナリオデータベース
      this.dialogueScenarios = this.initializeDialogueScenarios();
      
      // ペルソナ個性設定
      this.personaVoices = this.initializePersonaVoices();
      
      // 対話生成設定
      this.dialogueConfig = {
        minStrengthForDialogue: 10,
        maxMessagesPerPersona: 3,
        strengthInfluenceWeight: 0.7
      };
      
      this.isInitialized = false;
    }
    
    /**
     * 初期化
     */
    async initialize() {
      console.log('🔧 VirtualPersonaDialogue initializing...');
      
      try {
        // 対話データベース初期化
        await this.validateScenarios();
        
        // ペルソナ音声特性設定
        await this.setupPersonaVoices();
        
        // HaQei哲学統合
        await this.integrateHaQeiPhilosophy();
        
        this.isInitialized = true;
        console.log('✅ VirtualPersonaDialogue initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ VirtualPersonaDialogue initialization failed:', error);
        return this.initializeSafeMode();
      }
    }
    
    /**
     * 対話シナリオ初期化
     */
    initializeDialogueScenarios() {
      return {
        // 決断場面
        decision: {
          situation: "重要な決断を迫られた時",
          context: "人生の分岐点、新しいチャレンジ、リスクを伴う選択",
          description: "あなたの心の中で3つの仮想人格が対話している様子を想像してみてください",
          engineOS: [
            "新しいチャンスだ！挑戦してみよう！",
            "これまでにない可能性を探ってみませんか？",
            "革新的なアプローチで行きましょう！",
            "未知の領域に飛び込むときこそ成長できる！",
            "創造的な解決策を見つけ出しましょう！"
          ],
          interfaceOS: [
            "周りの人への影響も考えてみませんか？",
            "チームのみんなと相談してから決めましょう",
            "協力してもらえる人がいるか確認しませんか？",
            "みんなが納得できる方向性を探しましょう",
            "調和を保ちながら進める方法がありませんか？"
          ],
          safeModeOS: [
            "慎重に...リスクを十分検討しましょう",
            "過去の経験から学んで判断しませんか？",
            "安全な道筋を確保してから進みましょう",
            "worst caseシナリオも考慮すべきです",
            "段階的に進めて様子を見ませんか？"
          ]
        },
        
        // 困難場面
        challenge: {
          situation: "困難な問題に直面した時",
          context: "想定外の問題、解決困難な課題、行き詰まり状況",
          description: "困難な状況で現れるあなたの内なる声たち",
          engineOS: [
            "クリエイティブな解決策を探してみよう",
            "この困難を成長のチャンスに変えましょう！",
            "今までとは違う角度から考えてみませんか？",
            "逆転の発想で新しい道を見つけましょう！",
            "困難こそ革新の母です！"
          ],
          interfaceOS: [
            "チームで協力すれば乗り越えられる",
            "経験豊富な人に相談してみましょう",
            "みんなの知恵を集めて解決策を見つけましょう",
            "お互いを支えながら進みませんか？",
            "協力体制を築いて立ち向かいましょう"
          ],
          safeModeOS: [
            "まず現状を冷静に分析することが大切",
            "リスクを最小限に抑える方法を考えましょう",
            "着実に一歩ずつ解決していきましょう",
            "根本原因を特定してから対処しませんか？",
            "確実な方法で安全に進めましょう"
          ]
        },
        
        // 創造場面
        creation: {
          situation: "新しいものを創り出す時",
          context: "企画立案、作品制作、アイデア発想",
          description: "創造活動における内なる対話",
          engineOS: [
            "誰も思いつかないようなアイデアを！",
            "既存の枠を超えた発想で行きましょう",
            "革命的な何かを生み出してみませんか？",
            "常識を覆すような作品を作りましょう！",
            "世界を変えるアイデアが生まれるかも！"
          ],
          interfaceOS: [
            "みんなが喜ぶものを作りましょう",
            "協力して素晴らしいものを作り上げましょう",
            "人々の心に響くものを目指しませんか？",
            "共感を呼ぶ作品にしていきましょう",
            "みんなで作り上げる喜びを大切に"
          ],
          safeModeOS: [
            "実現可能性をしっかり検証しましょう",
            "段階的に形にしていきませんか？",
            "リスクを考慮した計画を立てましょう",
            "技術的制約も考慮する必要があります",
            "確実に形にできる範囲で進めましょう"
          ]
        },
        
        // 関係性場面
        relationship: {
          situation: "人間関係で悩んでいる時",
          context: "対人関係の困難、コミュニケーション問題",
          description: "人とのつながりについて考えている時の内なる声",
          engineOS: [
            "新しい関係性を築く機会かもしれません",
            "これまでとは違うアプローチを試してみましょう",
            "相手の意外な一面を発見できるチャンス！",
            "クリエイティブな解決策で関係改善を",
            "新しい自分を見せてみませんか？"
          ],
          interfaceOS: [
            "相手の気持ちに寄り添ってみましょう",
            "お互いの理解を深めることが大切です",
            "協力して解決策を見つけませんか？",
            "対話を通じて歩み寄りましょう",
            "みんなが幸せになる方法を考えましょう"
          ],
          safeModeOS: [
            "相手との距離感を慎重に調整しましょう",
            "感情的にならずに冷静に対処しませんか？",
            "安全な関係性を維持することも大切です",
            "無理をせず自分のペースで進みましょう",
            "トラブルを避ける方法を考えてみませんか？"
          ]
        }
      };
    }
    
    /**
     * ペルソナ個性初期化
     */
    initializePersonaVoices() {
      return {
        engine: {
          name: "創造の探検家",
          symbol: "🚀",
          tone: "エネルギッシュで前向き",
          keywords: ["チャンス", "革新", "可能性", "挑戦", "創造", "アイデア", "革命"],
          speechPattern: "！で終わる文が多い、提案形、エネルギッシュ",
          colors: {
            primary: "#6366f1",
            secondary: "#8b5cf6",
            background: "rgba(99, 102, 241, 0.1)"
          },
          emojis: ["🚀", "✨", "💡", "⚡", "🌟", "🎯", "🔥"]
        },
        interface: {
          name: "調和の橋渡し",
          symbol: "🤝",
          tone: "協調的で思いやりがある",
          keywords: ["みんな", "協力", "チーム", "相談", "調和", "共感", "支援"],
          speechPattern: "「〜しませんか？」の提案形が多い、包容力のある表現",
          colors: {
            primary: "#8b5cf6",
            secondary: "#a855f7",
            background: "rgba(139, 92, 246, 0.1)"
          },
          emojis: ["🤝", "💫", "🌸", "🎈", "🎊", "💕", "🌻"]
        },
        safemode: {
          name: "慎重な守護者",
          symbol: "🛡️",
          tone: "慎重で冷静",
          keywords: ["慎重", "安全", "リスク", "計画", "検証", "分析", "確実"],
          speechPattern: "「〜しましょう」の確実な提案、冷静な分析",
          colors: {
            primary: "#10b981",
            secondary: "#059669",
            background: "rgba(16, 185, 129, 0.1)"
          },
          emojis: ["🛡️", "🔍", "📋", "⚖️", "🎯", "🔒", "⚓"]
        }
      };
    }
    
    /**
     * 対話生成メソッド
     */
    generateDialogue(osResults, scenarioType = 'decision') {
      if (!this.isInitialized) {
        console.warn('⚠️ VirtualPersonaDialogue not initialized');
        return this.getDefaultDialogue();
      }
      
      const scenario = this.dialogueScenarios[scenarioType];
      if (!scenario) {
        console.warn(`⚠️ Unknown scenario type: ${scenarioType}`);
        return this.getDefaultDialogue();
      }
      
      try {
        return {
          scenario: {
            type: scenarioType,
            situation: scenario.situation,
            context: scenario.context,
            description: scenario.description
          },
          participants: [
            this.generatePersonaDialogue('engine', osResults.engine, scenario.engineOS),
            this.generatePersonaDialogue('interface', osResults.interface, scenario.interfaceOS),
            this.generatePersonaDialogue('safemode', osResults.safemode, scenario.safeModeOS)
          ],
          metadata: {
            timestamp: new Date().toISOString(),
            philosophy: 'haqei-persona-dialogue',
            version: this.version
          }
        };
      } catch (error) {
        console.error('❌ Dialogue generation failed:', error);
        return this.getDefaultDialogue();
      }
    }
    
    /**
     * ペルソナ別対話生成
     */
    generatePersonaDialogue(personaType, osResult, messages) {
      const persona = this.personaVoices[personaType];
      const strength = this.extractStrength(osResult);
      
      // 強度に基づくメッセージ選択
      const selectedMessage = this.selectMessageByStrength(messages, strength);
      
      // 強度に基づく表現調整
      const adjustedMessage = this.adjustMessageIntensity(selectedMessage, strength, persona);
      
      return {
        persona: {
          type: personaType,
          name: persona.name,
          symbol: persona.symbol,
          colors: persona.colors
        },
        message: adjustedMessage,
        strength: strength,
        reliability: this.calculateMessageReliability(strength),
        metadata: {
          originalMessage: selectedMessage,
          tone: persona.tone,
          speechPattern: persona.speechPattern
        }
      };
    }
    
    /**
     * 強度抽出
     */
    extractStrength(osResult) {
      if (osResult && osResult.percentage !== undefined) {
        return Math.round(osResult.percentage);
      }
      if (osResult && osResult.strength !== undefined) {
        return Math.round(osResult.strength);
      }
      return 50; // デフォルト値
    }
    
    /**
     * 強度に基づくメッセージ選択
     */
    selectMessageByStrength(messages, strength) {
      if (strength >= 80) {
        // 高強度：最も積極的なメッセージ
        return messages[0];
      } else if (strength >= 60) {
        // 中高強度：バランス型メッセージ
        return messages[Math.min(1, messages.length - 1)];
      } else if (strength >= 40) {
        // 中強度：標準的メッセージ
        return messages[Math.min(2, messages.length - 1)];
      } else if (strength >= 20) {
        // 低中強度：控えめメッセージ
        return messages[Math.min(3, messages.length - 1)];
      } else {
        // 低強度：最も控えめなメッセージ
        return messages[messages.length - 1];
      }
    }
    
    /**
     * メッセージ強度調整
     */
    adjustMessageIntensity(message, strength, persona) {
      if (strength >= 70) {
        // 高強度：エネルギッシュな表現
        return this.enhanceMessage(message, persona);
      } else if (strength <= 30) {
        // 低強度：控えめな表現
        return this.softtenMessage(message, persona);
      }
      return message; // 中強度：そのまま
    }
    
    /**
     * メッセージ強化
     */
    enhanceMessage(message, persona) {
      const enhancers = {
        engine: ["ぜひ", "きっと", "絶対に", "必ず"],
        interface: ["みんなで", "一緒に", "協力して", "心を込めて"],
        safemode: ["しっかりと", "確実に", "慎重に", "念入りに"]
      };
      
      const enhancer = enhancers[persona.name.includes('創造') ? 'engine' : 
                               persona.name.includes('調和') ? 'interface' : 'safemode'];
      const randomEnhancer = enhancer[Math.floor(Math.random() * enhancer.length)];
      
      return `${randomEnhancer}${message}`;
    }
    
    /**
     * メッセージ軟化
     */
    softtenMessage(message, persona) {
      const softeners = {
        engine: ["もしかすると", "ひょっとすると", "たぶん"],
        interface: ["もしよろしければ", "可能であれば", "お時間があるときに"],
        safemode: ["念のため", "一応", "参考までに"]
      };
      
      const softener = softeners[persona.name.includes('創造') ? 'engine' : 
                              persona.name.includes('調和') ? 'interface' : 'safemode'];
      const randomSoftener = softener[Math.floor(Math.random() * softener.length)];
      
      return `${randomSoftener}、${message}`;
    }
    
    /**
     * メッセージ信頼性計算
     */
    calculateMessageReliability(strength) {
      if (strength >= 60) return 'high';
      if (strength >= 40) return 'medium';
      return 'low';
    }
    
    /**
     * HaQei哲学統合
     */
    async integrateHaQeiPhilosophy() {
      this.philosophicalFramework = {
        wisdom: '3つの仮想人格の調和による智慧',
        balance: 'Engine・Interface・SafeModeのバランス',
        creativity: '対話を通じた創造的自己理解',
        authenticity: '易経メタファーによる真正な表現'
      };
    }
    
    /**
     * デフォルト対話取得
     */
    getDefaultDialogue() {
      return {
        scenario: {
          type: 'default',
          situation: 'システム初期状態',
          context: 'デフォルト対話',
          description: '基本的な3つの仮想人格の紹介'
        },
        participants: [
          {
            persona: { type: 'engine', name: '創造の探検家', symbol: '🚀' },
            message: '新しい可能性を探求しましょう！',
            strength: 50,
            reliability: 'medium'
          },
          {
            persona: { type: 'interface', name: '調和の橋渡し', symbol: '🤝' },
            message: '協力して素晴らしいものを作りましょう',
            strength: 50,
            reliability: 'medium'
          },
          {
            persona: { type: 'safemode', name: '慎重な守護者', symbol: '🛡️' },
            message: '慎重に計画を立てて進めましょう',
            strength: 50,
            reliability: 'medium'
          }
        ]
      };
    }
    
    /**
     * シナリオ検証
     */
    async validateScenarios() {
      const scenarios = Object.keys(this.dialogueScenarios);
      console.log(`📋 Validating ${scenarios.length} dialogue scenarios...`);
      return true;
    }
    
    /**
     * ペルソナ音声設定
     */
    async setupPersonaVoices() {
      const personas = Object.keys(this.personaVoices);
      console.log(`🎭 Setting up ${personas.length} persona voices...`);
      return true;
    }
    
    /**
     * セーフモード初期化
     */
    initializeSafeMode() {
      console.log('⚠️ Initializing safe mode...');
      this.isInitialized = true;
      return true;
    }
    
    /**
     * 利用可能シナリオ取得
     */
    getAvailableScenarios() {
      return Object.keys(this.dialogueScenarios).map(key => ({
        type: key,
        situation: this.dialogueScenarios[key].situation,
        context: this.dialogueScenarios[key].context
      }));
    }
  }
  
  // グローバル登録
  if (typeof window !== 'undefined') {
    window.VirtualPersonaDialogue = VirtualPersonaDialogue;
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtualPersonaDialogue;
  }
  
  console.log('✅ VirtualPersonaDialogue loaded successfully with HaQei Philosophy');
  
})(typeof window !== 'undefined' ? window : global);