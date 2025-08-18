/**
 * Context Type Safety System for HAQEI Analyzer
 * v4.3.0 - Type-safe Context handling with JSDoc annotations
 * 
 * @module ContextTypeSystem
 * @description 型安全なContext処理システム - 文字列とオブジェクト両形式をサポート
 */

/**
 * @typedef {Object} ContextObject
 * @property {string} domain - コンテキストドメイン (business, personal, general等)
 * @property {string} [question] - ユーザーの質問
 * @property {string} [category] - カテゴリ分類
 * @property {number} [urgency] - 緊急度 (0-10)
 * @property {Object} [metadata] - 追加メタデータ
 */

/**
 * @typedef {string|ContextObject} Context
 * @description Context型 - 文字列またはオブジェクト形式をサポート
 */

/**
 * Context型安全システム
 * @class
 */
class ContextTypeSystem {
  constructor() {
    /**
     * @type {string}
     * @private
     */
    this.version = '4.3.0';
    
    /**
     * 有効なドメインリスト
     * @type {Set<string>}
     * @private
     */
    this.validDomains = new Set([
      'default',
      'business',
      'personal',
      'relationship',
      'health',
      'career',
      'investment',
      'spiritual',
      'general'
    ]);
    
    /**
     * デフォルトコンテキスト値
     * @type {ContextObject}
     * @private
     */
    this.defaultContext = {
      domain: 'default',
      question: '',
      category: 'general',
      urgency: 5,
      metadata: {}
    };
  }
  
  /**
   * Contextを正規化
   * @param {Context} context - 入力コンテキスト
   * @returns {ContextObject} 正規化されたコンテキストオブジェクト
   * @throws {TypeError} 無効な型の場合
   */
  normalizeContext(context) {
    // null/undefined チェック
    if (context == null) {
      return { ...this.defaultContext };
    }
    
    // 文字列の場合
    if (typeof context === 'string') {
      return {
        ...this.defaultContext,
        domain: this.validateDomain(context),
        question: context
      };
    }
    
    // オブジェクトの場合
    if (typeof context === 'object' && !Array.isArray(context)) {
      return this.validateContextObject(context);
    }
    
    // 無効な型
    throw new TypeError(
      `Invalid context type: expected string or object, got ${typeof context}`
    );
  }
  
  /**
   * ドメインの検証
   * @param {string} domain - ドメイン文字列
   * @returns {string} 検証済みドメイン
   * @private
   */
  validateDomain(domain) {
    const normalizedDomain = String(domain).toLowerCase().trim();
    
    // 有効なドメインか確認
    if (this.validDomains.has(normalizedDomain)) {
      return normalizedDomain;
    }
    
    // ドメインマッピング（エイリアス処理）
    const domainMapping = {
      'work': 'business',
      'job': 'career',
      'love': 'relationship',
      'family': 'relationship',
      'medical': 'health',
      'finance': 'investment'
    };
    
    if (domainMapping[normalizedDomain]) {
      return domainMapping[normalizedDomain];
    }
    
    console.warn(`Unknown domain: ${domain}, using default`);
    return 'default';
  }
  
  /**
   * コンテキストオブジェクトの検証
   * @param {Object} contextObj - コンテキストオブジェクト
   * @returns {ContextObject} 検証済みコンテキストオブジェクト
   * @private
   */
  validateContextObject(contextObj) {
    const validated = { ...this.defaultContext };
    
    // domainの検証
    if ('domain' in contextObj) {
      validated.domain = this.validateDomain(contextObj.domain);
    }
    
    // questionの検証
    if ('question' in contextObj) {
      validated.question = String(contextObj.question || '');
    }
    
    // categoryの検証
    if ('category' in contextObj) {
      validated.category = String(contextObj.category || 'general');
    }
    
    // urgencyの検証（0-10の範囲）
    if ('urgency' in contextObj) {
      const urgency = Number(contextObj.urgency);
      if (!isNaN(urgency)) {
        validated.urgency = Math.max(0, Math.min(10, urgency));
      }
    }
    
    // metadataの検証
    if ('metadata' in contextObj && typeof contextObj.metadata === 'object') {
      validated.metadata = { ...contextObj.metadata };
    }
    
    return validated;
  }
  
  /**
   * Contextドメインを取得（後方互換性用）
   * @param {Context} context - コンテキスト
   * @returns {string} ドメイン文字列
   */
  getDomain(context) {
    const normalized = this.normalizeContext(context);
    return normalized.domain;
  }
  
  /**
   * Context型のバリデーション
   * @param {any} value - 検証する値
   * @returns {boolean} 有効なContext型かどうか
   */
  isValidContext(value) {
    try {
      this.normalizeContext(value);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * TypeScript風の型ガード（JSDoc用）
   * @param {any} value - チェックする値
   * @returns {value is Context} Context型かどうか
   */
  isContext(value) {
    return this.isValidContext(value);
  }
  
  /**
   * コンテキストの等価性チェック
   * @param {Context} context1 - 比較元コンテキスト
   * @param {Context} context2 - 比較先コンテキスト
   * @returns {boolean} 等価かどうか
   */
  areContextsEqual(context1, context2) {
    const norm1 = this.normalizeContext(context1);
    const norm2 = this.normalizeContext(context2);
    
    return norm1.domain === norm2.domain &&
           norm1.question === norm2.question &&
           norm1.category === norm2.category &&
           norm1.urgency === norm2.urgency;
  }
  
  /**
   * コンテキストのマージ
   * @param {Context} baseContext - ベースコンテキスト
   * @param {Partial<ContextObject>} updates - 更新内容
   * @returns {ContextObject} マージされたコンテキスト
   */
  mergeContext(baseContext, updates) {
    const base = this.normalizeContext(baseContext);
    
    if (!updates || typeof updates !== 'object') {
      return base;
    }
    
    const merged = { ...base };
    
    // 各フィールドを安全にマージ
    if ('domain' in updates) {
      merged.domain = this.validateDomain(updates.domain);
    }
    
    if ('question' in updates) {
      merged.question = String(updates.question || '');
    }
    
    if ('category' in updates) {
      merged.category = String(updates.category || 'general');
    }
    
    if ('urgency' in updates) {
      const urgency = Number(updates.urgency);
      if (!isNaN(urgency)) {
        merged.urgency = Math.max(0, Math.min(10, urgency));
      }
    }
    
    if ('metadata' in updates && typeof updates.metadata === 'object') {
      merged.metadata = { ...merged.metadata, ...updates.metadata };
    }
    
    return merged;
  }
  
  /**
   * コンテキストのシリアライズ（localStorage用）
   * @param {Context} context - コンテキスト
   * @returns {string} JSON文字列
   */
  serialize(context) {
    const normalized = this.normalizeContext(context);
    return JSON.stringify(normalized);
  }
  
  /**
   * コンテキストのデシリアライズ
   * @param {string} json - JSON文字列
   * @returns {ContextObject} コンテキストオブジェクト
   */
  deserialize(json) {
    try {
      const parsed = JSON.parse(json);
      return this.normalizeContext(parsed);
    } catch (error) {
      console.error('Failed to deserialize context:', error);
      return { ...this.defaultContext };
    }
  }
  
  /**
   * デバッグ用の文字列表現
   * @param {Context} context - コンテキスト
   * @returns {string} デバッグ文字列
   */
  toString(context) {
    const normalized = this.normalizeContext(context);
    return `Context(domain="${normalized.domain}", urgency=${normalized.urgency})`;
  }
  
  /**
   * コンテキストの検証エラーメッセージ生成
   * @param {any} value - 検証した値
   * @returns {string[]} エラーメッセージの配列
   */
  getValidationErrors(value) {
    const errors = [];
    
    // 型チェック
    if (value == null) {
      return []; // null/undefinedは有効（デフォルト値使用）
    }
    
    if (typeof value !== 'string' && typeof value !== 'object') {
      errors.push(`Invalid type: expected string or object, got ${typeof value}`);
      return errors;
    }
    
    if (Array.isArray(value)) {
      errors.push('Arrays are not valid Context values');
      return errors;
    }
    
    // オブジェクトの場合、各フィールドを検証
    if (typeof value === 'object') {
      if ('domain' in value && typeof value.domain !== 'string') {
        errors.push(`Invalid domain type: expected string, got ${typeof value.domain}`);
      }
      
      if ('urgency' in value) {
        const urgency = Number(value.urgency);
        if (isNaN(urgency)) {
          errors.push(`Invalid urgency: must be a number`);
        } else if (urgency < 0 || urgency > 10) {
          errors.push(`Invalid urgency range: must be 0-10, got ${urgency}`);
        }
      }
      
      if ('metadata' in value && typeof value.metadata !== 'object') {
        errors.push(`Invalid metadata type: expected object, got ${typeof value.metadata}`);
      }
    }
    
    return errors;
  }
}

/**
 * PrimaryLineSelector統合クラス
 * @class
 */
class ContextAwarePrimaryLineSelector {
  constructor() {
    this.contextSystem = new ContextTypeSystem();
    
    /**
     * 主爻決定ルール設定
     * @type {Object}
     * @private
     */
    this.rules = {
      default: [
        { priority: 1, type: 'specific', value: 5, description: '5爻優先' },
        { priority: 2, type: 'position', value: 'lowest', description: '最下位' },
        { priority: 3, type: 'position', value: 'highest', description: '最上位' }
      ],
      business: [
        { priority: 1, type: 'specific', value: 5 },
        { priority: 2, type: 'specific', value: 2 }
      ],
      personal: [
        { priority: 1, type: 'position', value: 'lowest' }
      ],
      relationship: [
        { priority: 1, type: 'specific', value: 4 },
        { priority: 2, type: 'specific', value: 3 }
      ]
    };
  }
  
  /**
   * 主爻を選択（型安全版）
   * @param {number[]} changedLines - 変化した爻（1-6）
   * @param {Context} context - コンテキスト
   * @returns {number|null} 主爻番号
   */
  selectPrimaryLine(changedLines, context) {
    // 入力検証
    if (!Array.isArray(changedLines)) {
      throw new TypeError('changedLines must be an array');
    }
    
    if (changedLines.length === 0) return null;
    if (changedLines.length === 1) return changedLines[0];
    
    // 重複除去と範囲チェック
    const uniqueLines = [...new Set(changedLines)]
      .filter(line => line >= 1 && line <= 6)
      .sort((a, b) => a - b);
    
    if (uniqueLines.length === 0) return null;
    if (uniqueLines.length === 1) return uniqueLines[0];
    
    // コンテキストを正規化
    const normalizedContext = this.contextSystem.normalizeContext(context);
    const domain = normalizedContext.domain;
    
    // ドメイン別ルールを取得
    const rules = this.rules[domain] || this.rules.default;
    
    // ルールを順次適用
    for (const rule of rules) {
      const selected = this.applyRule(rule, uniqueLines);
      if (selected !== null) {
        console.log(`Selected line ${selected} using rule: ${rule.description || rule.type}`);
        return selected;
      }
    }
    
    // フォールバック：最下位
    return Math.min(...uniqueLines);
  }
  
  /**
   * ルールを適用
   * @param {Object} rule - ルール定義
   * @param {number[]} lines - 爻番号配列
   * @returns {number|null} 選択された爻番号
   * @private
   */
  applyRule(rule, lines) {
    switch (rule.type) {
      case 'specific':
        if (lines.includes(rule.value)) {
          return rule.value;
        }
        break;
        
      case 'position':
        switch (rule.value) {
          case 'lowest':
            return Math.min(...lines);
          case 'highest':
            return Math.max(...lines);
          case 'middle':
            const sorted = [...lines].sort((a, b) => a - b);
            return sorted[Math.floor(sorted.length / 2)];
        }
        break;
        
      case 'pattern':
        // 連続する爻を優先
        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i + 1] === lines[i] + 1) {
            return lines[i];
          }
        }
        break;
    }
    
    return null;
  }
  
  /**
   * 解釈モードと主爻の統合決定
   * @param {number[]} changedLines - 変化した爻
   * @param {Context} context - コンテキスト
   * @returns {{mode: string, primaryLine: number|null, changedLines: number[]}}
   */
  determineInterpretation(changedLines, context) {
    if (!Array.isArray(changedLines)) {
      throw new TypeError('changedLines must be an array');
    }
    
    const count = changedLines.length;
    let mode, primaryLine;
    
    switch (count) {
      case 0:
        mode = 'hexagram';
        primaryLine = null;
        break;
      case 1:
        mode = 'single';
        primaryLine = changedLines[0];
        break;
      case 2:
      case 3:
        mode = 'main';
        primaryLine = this.selectPrimaryLine(changedLines, context);
        break;
      case 4:
      case 5:
        mode = 'hexagram';
        primaryLine = null;
        break;
      case 6:
        mode = 'all';
        primaryLine = null;
        break;
      default:
        mode = 'hexagram';
        primaryLine = null;
    }
    
    return { 
      mode, 
      primaryLine, 
      changedLines: [...changedLines].sort((a, b) => a - b)
    };
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.ContextTypeSystem = ContextTypeSystem;
  window.ContextAwarePrimaryLineSelector = ContextAwarePrimaryLineSelector;
}

console.log('✅ Context Type Safety System v4.3.0 loaded');