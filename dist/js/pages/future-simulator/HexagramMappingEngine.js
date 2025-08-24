/**
 * HexagramMappingEngine - 易経卦象マッピングエンジン
 * HaQei Philosophy Implementation
 */

console.log('☯️ HexagramMappingEngine Loading...');

(function(global) {
  'use strict';

  class HexagramMappingEngine {
    constructor() {
      this.name = 'HexagramMappingEngine';
      this.version = '1.0.0';
      this.philosophy = 'haqei-hexagram-wisdom';
      
      // Triple OS Architecture
      this.tripleOS = {
        engineOS: null,
        interfaceOS: null,
        safeModeOS: null
      };
      
      // 易経64卦マッピング
      this.hexagramDatabase = this.initializeHexagramDatabase();
      
      // 八卦基本要素
      this.trigrams = this.initializeTrigrams();
      
      // 変化パターン
      this.changePatterns = this.initializeChangePatterns();
      
      // HaQei哲学統合
      this.haqeiIntegration = {
        wisdom: '智慧と簡潔さの統合',
        clarity: '明晰さと深遠さの調和',
        practicality: '実用性と神秘性の融合',
        accessibility: '誰もが理解できる易経'
      };
      
      this.isInitialized = false;
    }
    
    /**
     * 初期化
     */
    async initialize() {
      console.log('🔧 HexagramMappingEngine initializing...');
      
      try {
        // Triple OS Architecture設定
        await this.setupTripleOS();
        
        // 卦象データベース初期化
        await this.initializeDatabase();
        
        // 変化パターン分析器初期化
        await this.initializeChangeAnalyzer();
        
        // HaQei哲学統合
        await this.integrateHaQeiPhilosophy();
        
        this.isInitialized = true;
        console.log('✅ HexagramMappingEngine initialized successfully');
        return true;
      } catch (error) {
        console.error('❌ HexagramMappingEngine initialization failed:', error);
        return this.initializeSafeMode();
      }
    }
    
    /**
     * Triple OS Architecture設定
     */
    async setupTripleOS() {
      this.tripleOS.engineOS = {
        analyze: (text) => this.analyzeTextToHexagram(text),
        map: (context) => this.mapContextToHexagram(context),
        transform: (hexagram) => this.transformHexagram(hexagram)
      };
      
      this.tripleOS.interfaceOS = {
        display: (hexagram) => this.formatHexagramDisplay(hexagram),
        visualize: (data) => this.createHexagramVisualization(data),
        explain: (hexagram) => this.generateExplanation(hexagram)
      };
      
      this.tripleOS.safeModeOS = {
        fallback: () => this.getDefaultHexagram(),
        validate: (hexagram) => this.validateHexagram(hexagram),
        recover: (error) => this.recoverFromError(error)
      };
    }
    
    /**
     * 卦象データベース初期化
     */
    initializeHexagramDatabase() {
      return {
        1: { name: '乾', meaning: '天', attributes: ['創造', '強健', 'リーダーシップ'] },
        2: { name: '坤', meaning: '地', attributes: ['受容', '包容', 'サポート'] },
        3: { name: '屯', meaning: '始まりの困難', attributes: ['誕生', '成長', '挑戦'] },
        4: { name: '蒙', meaning: '啓蒙', attributes: ['学習', '教育', '成長'] },
        // ... 残りの60卦
        63: { name: '既済', meaning: '完成', attributes: ['達成', '調和', '完了'] },
        64: { name: '未済', meaning: '未完成', attributes: ['継続', '可能性', '未来'] }
      };
    }
    
    /**
     * 八卦初期化
     */
    initializeTrigrams() {
      return {
        '☰': { name: '乾', element: '天', attributes: ['創造的', '積極的', '父'] },
        '☷': { name: '坤', element: '地', attributes: ['受容的', '消極的', '母'] },
        '☳': { name: '震', element: '雷', attributes: ['動き', '衝撃', '長男'] },
        '☴': { name: '巽', element: '風', attributes: ['浸透', '柔軟', '長女'] },
        '☵': { name: '坎', element: '水', attributes: ['危険', '深淵', '中男'] },
        '☲': { name: '離', element: '火', attributes: ['明るさ', '美', '中女'] },
        '☶': { name: '艮', element: '山', attributes: ['静止', '瞑想', '少男'] },
        '☱': { name: '兌', element: '沢', attributes: ['喜び', '説得', '少女'] }
      };
    }
    
    /**
     * 変化パターン初期化
     */
    initializeChangePatterns() {
      return {
        '互綜': (hexagram) => this.calculateMutualChange(hexagram),
        '錯卦': (hexagram) => this.calculateOppositeChange(hexagram),
        '綜卦': (hexagram) => this.calculateReverseChange(hexagram),
        '変爻': (hexagram, line) => this.calculateLineChange(hexagram, line)
      };
    }
    
    /**
     * テキストから卦象へのマッピング
     */
    async analyzeTextToHexagram(text) {
      if (!text) return this.getDefaultHexagram();
      
      try {
        // テキスト分析
        const keywords = await this.extractKeywords(text);
        const sentiment = await this.analyzeSentiment(text);
        const context = await this.analyzeContext(text);
        
        // 卦象計算
        const hexagramNumber = this.calculateHexagramNumber(keywords, sentiment, context);
        
        // 卦象取得
        const hexagram = this.hexagramDatabase[hexagramNumber] || this.getDefaultHexagram();
        
        // 変化の可能性を追加
        hexagram.changes = this.calculatePossibleChanges(hexagramNumber);
        
        return hexagram;
      } catch (error) {
        console.error('Text to hexagram mapping failed:', error);
        return this.tripleOS.safeModeOS.fallback();
      }
    }
    
    /**
     * コンテキストから卦象へのマッピング
     */
    async mapContextToHexagram(context) {
      const mapping = {
        time: this.mapTimeToTrigram(context.time),
        space: this.mapSpaceToTrigram(context.space),
        emotion: this.mapEmotionToTrigram(context.emotion),
        action: this.mapActionToTrigram(context.action)
      };
      
      const upperTrigram = this.combineTrigrams([mapping.time, mapping.space]);
      const lowerTrigram = this.combineTrigrams([mapping.emotion, mapping.action]);
      
      return this.combineTrigramsToHexagram(upperTrigram, lowerTrigram);
    }
    
    /**
     * 卦象の変化計算
     */
    transformHexagram(hexagram) {
      return {
        original: hexagram,
        mutual: this.changePatterns['互綜'](hexagram),
        opposite: this.changePatterns['錯卦'](hexagram),
        reverse: this.changePatterns['綜卦'](hexagram),
        evolution: this.calculateEvolution(hexagram)
      };
    }
    
    /**
     * キーワード抽出
     */
    async extractKeywords(text) {
      // 簡易的なキーワード抽出
      const words = text.split(/\s+/);
      return words.filter(word => word.length > 2);
    }
    
    /**
     * 感情分析
     */
    async analyzeSentiment(text) {
      // 簡易的な感情分析
      const positiveWords = ['良い', '素晴らしい', '成功', '幸せ'];
      const negativeWords = ['悪い', '失敗', '困難', '不安'];
      
      let score = 0;
      positiveWords.forEach(word => {
        if (text.includes(word)) score++;
      });
      negativeWords.forEach(word => {
        if (text.includes(word)) score--;
      });
      
      return score;
    }
    
    /**
     * コンテキスト分析
     */
    async analyzeContext(text) {
      return {
        length: text.length,
        complexity: text.split(/[.!?]/).length,
        urgency: text.includes('緊急') || text.includes('今すぐ'),
        uncertainty: text.includes('かも') || text.includes('たぶん')
      };
    }
    
    /**
     * 卦象番号計算
     */
    calculateHexagramNumber(keywords, sentiment, context) {
      // 簡易的な計算ロジック
      let number = 1;
      
      number += keywords.length % 64;
      number += (sentiment > 0 ? 10 : -10);
      number += context.complexity * 5;
      
      // 1-64の範囲に正規化
      number = Math.abs(number) % 64 + 1;
      
      return number;
    }
    
    /**
     * 可能な変化の計算
     */
    calculatePossibleChanges(hexagramNumber) {
      return {
        next: (hexagramNumber % 64) + 1,
        previous: hexagramNumber > 1 ? hexagramNumber - 1 : 64,
        opposite: 65 - hexagramNumber,
        complement: ((hexagramNumber + 31) % 64) + 1
      };
    }
    
    /**
     * デフォルト卦象取得
     */
    getDefaultHexagram() {
      return {
        number: 1,
        name: '乾',
        meaning: '天',
        attributes: ['創造', '強健', 'リーダーシップ'],
        message: 'HaQei哲学による初期状態'
      };
    }
    
    /**
     * 卦象表示フォーマット
     */
    formatHexagramDisplay(hexagram) {
      return `
        【${hexagram.name}卦】
        意味: ${hexagram.meaning}
        特性: ${hexagram.attributes.join(', ')}
        ${hexagram.message || ''}
      `;
    }
    
    /**
     * HaQei哲学統合
     */
    async integrateHaQeiPhilosophy() {
      // HaQei哲学の価値観を統合
      this.philosophicalFramework = {
        simplicity: 'シンプルで理解しやすい',
        depth: '深い洞察を提供',
        practicality: '実用的なアドバイス',
        universality: '普遍的な智慧'
      };
    }
    
    /**
     * セーフモード初期化
     */
    initializeSafeMode() {
      console.log('⚠️ Initializing safe mode...');
      this.isInitialized = true;
      return true;
    }
  }
  
  // グローバル登録
  if (typeof window !== 'undefined') {
    window.HexagramMappingEngine = HexagramMappingEngine;
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramMappingEngine;
  }
  
  console.log('✅ HexagramMappingEngine loaded successfully with HaQei Philosophy');
  
})(typeof window !== 'undefined' ? window : global);