/**
 * VirtualPersonaEnhancer - 仮想ペルソナ表現強化システム
 * DAY 2 Implementation - ペルソナキャラクター性向上
 * HaQei Philosophy Integration
 */

console.log('🎭 VirtualPersonaEnhancer Loading...');

(function(global) {
  'use strict';

  class VirtualPersonaEnhancer {
    constructor() {
      this.name = 'VirtualPersonaEnhancer';
      this.version = '1.0.0';
      this.philosophy = 'haqei-persona-enhancement';
      
      // ペルソナキャラクター定義
      this.personas = this.initializePersonas();
      
      // 表現強化設定
      this.enhancementConfig = {
        includeTraits: true,
        includeCatchphrase: true,
        includeMetaphor: true,
        includeHexagramStyle: true,
        includeColorTheme: true
      };
      
      this.isInitialized = false;
    }
    
    /**
     * 初期化
     */
    async initialize() {
      console.log('🔧 VirtualPersonaEnhancer initializing...');
      
      try {
        // ペルソナ定義検証
        await this.validatePersonas();
        
        // HaQei哲学統合
        await this.integrateHaQeiPhilosophy();
        
        this.isInitialized = true;
        console.log('✅ VirtualPersonaEnhancer initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ VirtualPersonaEnhancer initialization failed:', error);
        return this.initializeSafeMode();
      }
    }
    
    /**
     * ペルソナキャラクター定義
     */
    initializePersonas() {
      return {
        engine: {
          name: "創造の探検家",
          symbol: "🚀",
          traits: ["好奇心旺盛", "革新的", "チャレンジ精神", "先見性", "独創性"],
          catchphrase: "新しい可能性を切り開く",
          metaphor: "未踏の地を探求する冒険者のように",
          hexagramStyle: "乾為天（創造力の象徴）",
          personalityDescription: "常に新しい挑戦を求め、未来に向かって突き進む革新者",
          strengths: ["創造性", "リーダーシップ", "先見性", "行動力"],
          approaches: ["革新的解決策", "新規開拓", "変革リーダー", "未来思考"],
          colors: {
            primary: "#6366f1",
            secondary: "#8b5cf6",
            background: "rgba(99, 102, 241, 0.1)",
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)"
          },
          emojis: ["🚀", "✨", "💡", "⚡", "🌟", "🎯", "🔥", "🦅", "⭐", "🌌"]
        },
        interface: {
          name: "調和の橋渡し",
          symbol: "🤝",
          traits: ["共感力", "協調性", "コミュニケーション", "思いやり", "包容力"],
          catchphrase: "人との繋がりを大切にする",
          metaphor: "異なる世界を繋ぐ橋のように",
          hexagramStyle: "地天泰（調和の象徴）",
          personalityDescription: "人と人との間に立ち、調和と理解を促進する仲介者",
          strengths: ["協調性", "コミュニケーション", "共感力", "チームワーク"],
          approaches: ["対話促進", "合意形成", "関係構築", "調和創出"],
          colors: {
            primary: "#8b5cf6",
            secondary: "#a855f7",
            background: "rgba(139, 92, 246, 0.1)",
            gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)"
          },
          emojis: ["🤝", "💫", "🌸", "🎈", "🎊", "💕", "🌻", "🌈", "🕊️", "💐"]
        },
        safemode: {
          name: "慎重な守護者",
          symbol: "🛡️",
          traits: ["分析力", "慎重性", "安全志向", "責任感", "持続性"],
          catchphrase: "リスクを見極め、安全を確保する",
          metaphor: "嵐の中でも灯台のように",
          hexagramStyle: "山雷頤（慎重さの象徴）",
          personalityDescription: "冷静な判断で危険を回避し、安定を維持する守護者",
          strengths: ["分析力", "慎重性", "持続力", "安定性"],
          approaches: ["リスク分析", "段階的実行", "安全確保", "持続可能"],
          colors: {
            primary: "#10b981",
            secondary: "#059669",
            background: "rgba(16, 185, 129, 0.1)",
            gradient: "linear-gradient(135deg, #10b981, #059669)"
          },
          emojis: ["🛡️", "🔍", "📋", "⚖️", "🎯", "🔒", "⚓", "🏰", "🗿", "🌿"]
        }
      };
    }
    
    /**
     * OS結果の表現強化
     */
    enhanceOSResult(osResult, osType) {
      if (!this.isInitialized) {
        console.warn('⚠️ VirtualPersonaEnhancer not initialized');
        return osResult;
      }
      
      const persona = this.personas[osType];
      if (!persona) {
        console.warn(`⚠️ Unknown persona type: ${osType}`);
        return osResult;
      }
      
      try {
        // OS強度計算
        const strength = this.calculateOSStrength(osResult);
        
        // 強度に基づいて特徴を調整
        const adjustedTraits = this.adjustTraitsByStrength(persona.traits, strength);
        const adjustedCatchphrase = this.adjustCatchphraseByStrength(persona.catchphrase, strength);
        
        return {
          ...osResult,
          persona: {
            // 基本ペルソナ情報
            name: persona.name,
            symbol: persona.symbol,
            traits: adjustedTraits,
            catchphrase: adjustedCatchphrase,
            metaphor: persona.metaphor,
            
            // 詳細情報
            personalityDescription: persona.personalityDescription,
            strengths: persona.strengths,
            approaches: persona.approaches,
            hexagramStyle: persona.hexagramStyle,
            
            // UI要素
            colors: persona.colors,
            emojis: persona.emojis,
            
            // 動的要素
            strength: strength,
            dominanceLevel: this.calculateDominanceLevel(strength),
            expressionIntensity: this.calculateExpressionIntensity(strength),
            
            // 説明文
            description: `あなたの${persona.name}は、${persona.metaphor}、${adjustedCatchphrase}特徴を持っています。`,
            detailedDescription: this.generateDetailedDescription(persona, strength)
          }
        };
      } catch (error) {
        console.error('❌ OS result enhancement failed:', error);
        return osResult;
      }
    }
    
    /**
     * OS強度計算
     */
    calculateOSStrength(osResult) {
      if (osResult.percentage !== undefined) {
        return Math.round(osResult.percentage);
      }
      if (osResult.strength !== undefined) {
        return Math.round(osResult.strength);
      }
      // フォールバック：三爻エネルギーから計算
      if (osResult.trigramEnergy) {
        const total = Object.values(osResult.trigramEnergy).reduce((sum, val) => sum + val, 0);
        return Math.round(total / Object.keys(osResult.trigramEnergy).length);
      }
      return 50; // デフォルト値
    }
    
    /**
     * 強度による特徴調整
     */
    adjustTraitsByStrength(traits, strength) {
      if (strength >= 80) {
        // 高強度：全特徴を強調表現
        return traits.map(trait => `強い${trait}`);
      } else if (strength >= 60) {
        // 中高強度：標準表現
        return traits;
      } else if (strength >= 40) {
        // 中強度：控えめ表現
        return traits.map(trait => `適度な${trait}`);
      } else {
        // 低強度：潜在表現
        return traits.map(trait => `潜在的な${trait}`);
      }
    }
    
    /**
     * 強度によるキャッチフレーズ調整
     */
    adjustCatchphraseByStrength(catchphrase, strength) {
      if (strength >= 80) {
        return `積極的に${catchphrase}`;
      } else if (strength >= 60) {
        return catchphrase;
      } else if (strength >= 40) {
        return `慎重に${catchphrase}`;
      } else {
        return `時には${catchphrase}`;
      }
    }
    
    /**
     * 支配度レベル計算
     */
    calculateDominanceLevel(strength) {
      if (strength >= 80) return 'dominant';
      if (strength >= 60) return 'strong';
      if (strength >= 40) return 'moderate';
      if (strength >= 20) return 'weak';
      return 'minimal';
    }
    
    /**
     * 表現強度計算
     */
    calculateExpressionIntensity(strength) {
      return Math.floor(strength / 20) + 1; // 1-5のレベル
    }
    
    /**
     * 詳細説明生成
     */
    generateDetailedDescription(persona, strength) {
      const intensityText = strength >= 70 ? '非常に強く' :
                           strength >= 50 ? '比較的強く' :
                           strength >= 30 ? 'ある程度' : '時折';
      
      return `この仮想人格は${intensityText}現れる傾向があります。` +
             `${persona.personalityDescription}として、` +
             `${persona.approaches.join('、')}などのアプローチを取ります。`;
    }
    
    /**
     * ペルソナ定義検証
     */
    async validatePersonas() {
      const personaTypes = Object.keys(this.personas);
      console.log(`📋 Validating ${personaTypes.length} persona definitions...`);
      
      personaTypes.forEach(type => {
        const persona = this.personas[type];
        if (!persona.name || !persona.symbol || !persona.traits || !persona.catchphrase) {
          throw new Error(`Invalid persona definition for ${type}`);
        }
      });
      
      return true;
    }
    
    /**
     * HaQei哲学統合
     */
    async integrateHaQeiPhilosophy() {
      this.philosophicalFramework = {
        principle: '3つの仮想人格の個性的表現による深い自己理解',
        approach: '易経メタファーと現代心理学の融合',
        goal: '創造的自己表現を通じた成長と調和',
        wisdom: '内なる多様性を受け入れ、統合的な視点を育む'
      };
      
      console.log('🔯 HaQei philosophy integrated with persona enhancement');
    }
    
    /**
     * セーフモード初期化
     */
    initializeSafeMode() {
      console.log('⚠️ Initializing safe mode...');
      
      // 最小限のペルソナ定義
      this.personas = {
        engine: { name: "Engine OS", symbol: "⚡", traits: ["創造性"], catchphrase: "新しい可能性" },
        interface: { name: "Interface OS", symbol: "🤝", traits: ["協調性"], catchphrase: "人との繋がり" },
        safemode: { name: "SafeMode OS", symbol: "🛡️", traits: ["慎重性"], catchphrase: "安全確保" }
      };
      
      this.isInitialized = true;
      return true;
    }
    
    /**
     * 利用可能なペルソナタイプ取得
     */
    getAvailablePersonas() {
      return Object.keys(this.personas).map(type => ({
        type: type,
        name: this.personas[type].name,
        symbol: this.personas[type].symbol,
        description: this.personas[type].personalityDescription
      }));
    }
  }
  
  // グローバル登録
  if (typeof window !== 'undefined') {
    window.VirtualPersonaEnhancer = VirtualPersonaEnhancer;
  }
  
  console.log('✅ VirtualPersonaEnhancer loaded successfully with HaQei Philosophy');
  
})(typeof window !== 'undefined' ? window : global);