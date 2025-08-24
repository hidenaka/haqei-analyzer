/**
 * 包括的入力検証システム
 * SQLインジェクション・XSS・制御文字攻撃からの多層防御
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-05
 * Security Level: Enterprise
 */

class InputValidationSystem {
  constructor() {
    this.config = this.getValidationConfig();
    this.violations = [];
    this.patterns = this.getSecurityPatterns();
    this.init();
  }

  /**
   * 検証設定の定義
   */
  getValidationConfig() {
    return {
      // 文字数制限
      maxLength: {
        text: 1000,
        name: 100,
        email: 254,
        url: 2048,
        password: 128
      },
      
      // 最小文字数
      minLength: {
        text: 1,
        name: 2,
        password: 12
      },
      
      // 許可文字パターン
      allowedCharacters: {
        name: /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s_-]+$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        alphanumeric: /^[a-zA-Z0-9]+$/,
        japanese: /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+$/
      },
      
      // 禁止パターン
      forbiddenPatterns: {
        sqlKeywords: /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi,
        scriptTags: /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gi,
        htmlTags: /<[^>]+>/g,
        javascriptProtocol: /javascript\s*:/gi,
        controlChars: /[\x00-\x1F\x7F-\x9F]/g
      },
      
      // レート制限
      rateLimits: {
        maxValidationsPerMinute: 1000,
        maxViolationsPerMinute: 10
      }
    };
  }

  /**
   * セキュリティパターンの定義
   */
  getSecurityPatterns() {
    return {
      // SQLインジェクション検出パターン
      sqlInjection: [
        /(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.+)|(begin\s*[\s\w\preceq]+\s*end)|(\s*[\/\*]+\s*...\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s*[\(].*[\)])))))/i,
        /'(\s*or\s*')/i,
        /exec(\s|\+)+(s|x)p\w+/i
      ],
      
      // XSS検出パターン  
      xss: [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript\s*:/gi,
        /on\w+\s*=\s*["'][^"']*["']/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /<object[^>]*>.*?<\/object>/gi,
        /<embed[^>]*>/gi,
        /expression\s*\(/gi
      ],
      
      // パストラバーサル検出
      pathTraversal: [
        /\.\.[\/\\]/g,
        /[\/\\]\.\.[\/\\]/g,
        /%2e%2e[\/\\]/gi,
        /\.\.%2f/gi,
        /\.\.%5c/gi
      ],
      
      // コマンドインジェクション検出
      commandInjection: [
        /[;&|`$()]/g,
        /\bnc\s+-/i,
        /\bwget\s+/i,
        /\bcurl\s+/i,
        /\bpython\s+/i
      ]
    };
  }

  /**
   * システム初期化
   */
  init() {
    this.setupGlobalValidation();
    this.setupFormValidation();
    this.setupRealTimeValidation();
    this.startViolationMonitoring();
    
    console.log('✅ 入力検証システム初期化完了');
  }

  /**
   * グローバル検証の設定
   */
  setupGlobalValidation() {
    // 全てのinput要素に検証を適用
    document.addEventListener('input', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.validateInput(event.target);
      }
    });

    // フォーム送信時の検証
    document.addEventListener('submit', (event) => {
      if (!this.validateForm(event.target)) {
        event.preventDefault();
        this.showValidationError('フォームに無効な入力が含まれています');
      }
    });
  }

  /**
   * フォーム検証の設定
   */
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('data-validation-enabled', 'true');
      
      // カスタム検証属性の処理
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        this.setupInputValidation(input);
      });
    });
  }

  /**
   * 個別入力要素の検証設定
   */
  setupInputValidation(input) {
    // データ属性による設定
    const validationType = input.dataset.validation || 'text';
    const maxLength = parseInt(input.dataset.maxLength) || this.config.maxLength[validationType];
    const minLength = parseInt(input.dataset.minLength) || this.config.minLength[validationType];
    
    // 属性の設定
    input.setAttribute('data-validation-type', validationType);
    if (maxLength) input.setAttribute('maxlength', maxLength);
    if (minLength) input.setAttribute('data-minlength', minLength);
    
    // リアルタイム検証
    input.addEventListener('input', () => this.validateInput(input));
    input.addEventListener('blur', () => this.validateInput(input, true));
  }

  /**
   * リアルタイム検証の設定
   */
  setupRealTimeValidation() {
    // MutationObserverで新しい要素を監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const inputs = node.tagName && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')
              ? [node]
              : node.querySelectorAll && node.querySelectorAll('input, textarea');
            
            if (inputs) {
              inputs.forEach(input => this.setupInputValidation(input));
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * メイン入力検証API
   */
  validateInput(input, showErrors = false) {
    if (!input || !input.value) return true;

    const value = input.value;
    const validationType = input.dataset.validationType || 'text';
    const results = [];

    try {
      // 基本検証
      results.push(this.validateLength(value, validationType));
      results.push(this.validateCharacters(value, validationType));
      results.push(this.validateSecurity(value));
      
      // 特殊検証
      if (validationType === 'email') {
        results.push(this.validateEmail(value));
      } else if (validationType === 'url') {
        results.push(this.validateURL(value));
      } else if (validationType === 'password') {
        results.push(this.validatePassword(value));
      }

      // 結果の統合
      const combinedResult = this.combineValidationResults(results);
      
      // UI更新
      this.updateInputValidationUI(input, combinedResult, showErrors);
      
      // 違反のログ記録
      if (!combinedResult.isValid) {
        this.logValidationViolation(input, combinedResult);
      }

      return combinedResult.isValid;

    } catch (error) {
      console.error('❌ 入力検証エラー:', error);
      return false;
    }
  }

  /**
   * 文字数検証
   */
  validateLength(value, type) {
    const maxLength = this.config.maxLength[type] || this.config.maxLength.text;
    const minLength = this.config.minLength[type] || this.config.minLength.text;

    const errors = [];
    
    if (value.length > maxLength) {
      errors.push(`文字数が制限を超えています（最大${maxLength}文字）`);
    }
    
    if (value.length < minLength) {
      errors.push(`文字数が不足しています（最小${minLength}文字）`);
    }

    return {
      type: 'length',
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * 文字種検証
   */
  validateCharacters(value, type) {
    const allowedPattern = this.config.allowedCharacters[type];
    const errors = [];

    if (allowedPattern && !allowedPattern.test(value)) {
      errors.push(`許可されていない文字が含まれています`);
    }

    // 制御文字の検出
    if (this.config.forbiddenPatterns.controlChars.test(value)) {
      errors.push(`制御文字が含まれています`);
    }

    return {
      type: 'characters',
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * セキュリティ検証
   */
  validateSecurity(value) {
    const errors = [];
    const threats = [];

    // SQLインジェクション検証
    this.patterns.sqlInjection.forEach((pattern, index) => {
      if (pattern.test(value)) {
        errors.push('SQLインジェクションの可能性があります');
        threats.push({ type: 'SQL_INJECTION', pattern: index });
      }
    });

    // XSS検証
    this.patterns.xss.forEach((pattern, index) => {
      if (pattern.test(value)) {
        errors.push('XSS攻撃の可能性があります');
        threats.push({ type: 'XSS', pattern: index });
      }
    });

    // パストラバーサル検証
    this.patterns.pathTraversal.forEach((pattern, index) => {
      if (pattern.test(value)) {
        errors.push('パストラバーサル攻撃の可能性があります');
        threats.push({ type: 'PATH_TRAVERSAL', pattern: index });
      }
    });

    // コマンドインジェクション検証
    this.patterns.commandInjection.forEach((pattern, index) => {
      if (pattern.test(value)) {
        errors.push('コマンドインジェクション攻撃の可能性があります');
        threats.push({ type: 'COMMAND_INJECTION', pattern: index });
      }
    });

    return {
      type: 'security',
      isValid: errors.length === 0,
      errors: errors,
      threats: threats
    };
  }

  /**
   * メールアドレス検証
   */
  validateEmail(email) {
    const errors = [];
    
    if (!this.config.allowedCharacters.email.test(email)) {
      errors.push('有効なメールアドレス形式ではありません');
    }

    // 追加のメール検証
    const parts = email.split('@');
    if (parts.length !== 2) {
      errors.push('メールアドレス形式が正しくありません');
    } else {
      const [local, domain] = parts;
      
      if (local.length > 64) {
        errors.push('メールアドレスのローカル部が長すぎます');
      }
      
      if (domain.length > 253) {
        errors.push('メールアドレスのドメイン部が長すぎます');
      }
    }

    return {
      type: 'email',
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * URL検証
   */
  validateURL(url) {
    const errors = [];
    
    try {
      const urlObj = new URL(url);
      
      // プロトコル検証
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('HTTPまたはHTTPSプロトコルのみ許可されています');
      }
      
      // 長さ検証
      if (url.length > this.config.maxLength.url) {
        errors.push(`URL長が制限を超えています（最大${this.config.maxLength.url}文字）`);
      }
      
    } catch (error) {
      errors.push('有効なURL形式ではありません');
    }

    return {
      type: 'url',
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * パスワード検証
   */
  validatePassword(password) {
    const errors = [];
    
    // 長さ検証
    if (password.length < this.config.minLength.password) {
      errors.push(`パスワードは${this.config.minLength.password}文字以上必要です`);
    }
    
    // 複雑さ検証
    if (!/[A-Z]/.test(password)) {
      errors.push('大文字を1文字以上含めてください');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('小文字を1文字以上含めてください');
    }
    
    if (!/\d/.test(password)) {
      errors.push('数字を1文字以上含めてください');
    }
    
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('記号を1文字以上含めてください');
    }

    // 連続文字チェック
    if (/(.)\1{2,}/.test(password)) {
      errors.push('同じ文字を3回以上繰り返すことはできません');
    }

    return {
      type: 'password',
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * 検証結果の統合
   */
  combineValidationResults(results) {
    const allErrors = [];
    const allThreats = [];
    let isValid = true;

    results.forEach(result => {
      if (!result.isValid) {
        isValid = false;
      }
      
      if (result.errors) {
        allErrors.push(...result.errors);
      }
      
      if (result.threats) {
        allThreats.push(...result.threats);
      }
    });

    return {
      isValid,
      errors: allErrors,
      threats: allThreats
    };
  }

  /**
   * フォーム検証
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input, true)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  /**
   * 入力の自動サニタイゼーション
   */
  sanitizeInput(value, type = 'text') {
    if (typeof value !== 'string') return '';

    let sanitized = value;

    // 基本的なHTMLエスケープ
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // 制御文字の除去
    sanitized = sanitized.replace(this.config.forbiddenPatterns.controlChars, '');

    // タイプ別サニタイゼーション
    switch (type) {
      case 'name':
        sanitized = sanitized.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s_-]/g, '');
        break;
      
      case 'alphanumeric':
        sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
        break;
    }

    return sanitized.trim();
  }

  /**
   * UI更新
   */
  updateInputValidationUI(input, result, showErrors) {
    // エラークラスの管理
    input.classList.toggle('validation-error', !result.isValid);
    input.classList.toggle('validation-success', result.isValid);

    // エラーメッセージの表示
    if (showErrors && !result.isValid) {
      this.displayValidationErrors(input, result.errors);
    } else {
      this.clearValidationErrors(input);
    }
  }

  /**
   * エラーメッセージの表示
   */
  displayValidationErrors(input, errors) {
    const errorContainer = this.getOrCreateErrorContainer(input);
    errorContainer.innerHTML = '';
    
    errors.forEach(error => {
      const errorElement = document.createElement('div');
      errorElement.className = 'validation-error-message';
      errorElement.textContent = error;
      errorContainer.appendChild(errorElement);
    });
    
    errorContainer.style.display = 'block';
  }

  /**
   * エラーメッセージのクリア
   */
  clearValidationErrors(input) {
    const errorContainer = input.parentNode.querySelector('.validation-errors');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }
  }

  /**
   * エラーコンテナの取得または作成
   */
  getOrCreateErrorContainer(input) {
    let container = input.parentNode.querySelector('.validation-errors');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'validation-errors';
      input.parentNode.appendChild(container);
    }
    
    return container;
  }

  /**
   * 検証違反のログ記録
   */
  logValidationViolation(input, result) {
    const violation = {
      timestamp: new Date().toISOString(),
      inputName: input.name || input.id || 'unknown',
      inputType: input.type || 'unknown',
      validationType: input.dataset.validationType || 'text',
      errors: result.errors,
      threats: result.threats,
      value: input.value.substring(0, 100), // 最初の100文字のみ
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.violations.push(violation);
    
    // 重大な脅威の場合は即座に報告
    if (result.threats && result.threats.length > 0) {
      console.warn('🚨 セキュリティ脅威検出:', violation);
      this.reportSecurityThreat(violation);
    }
  }

  /**
   * セキュリティ脅威の報告
   */
  reportSecurityThreat(violation) {
    // セキュリティログシステムへの報告
    if (window.SecurityLogger) {
      window.SecurityLogger.logThreat(violation);
    }

    // 管理者への通知（実装環境に応じて）
    if (window.AdminNotification) {
      window.AdminNotification.securityAlert(violation);
    }
  }

  /**
   * 違反監視の開始
   */
  startViolationMonitoring() {
    setInterval(() => {
      this.analyzeViolationTrends();
    }, 60 * 1000); // 1分毎
  }

  /**
   * 違反傾向の分析
   */
  analyzeViolationTrends() {
    const recentViolations = this.violations.filter(v => 
      Date.now() - new Date(v.timestamp).getTime() < 60 * 1000
    );

    if (recentViolations.length > this.config.rateLimits.maxViolationsPerMinute) {
      console.warn('🚨 異常な検証違反率を検出:', recentViolations.length);
      this.reportAnomalousActivity(recentViolations);
    }
  }

  /**
   * 異常活動の報告
   */
  reportAnomalousActivity(violations) {
    const report = {
      timestamp: new Date().toISOString(),
      violationCount: violations.length,
      threatTypes: [...new Set(violations.flatMap(v => v.threats?.map(t => t.type) || []))],
      affectedInputs: [...new Set(violations.map(v => v.inputName))],
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('🚨 異常活動検出レポート:', report);
  }

  /**
   * 検証エラーの表示
   */
  showValidationError(message) {
    console.error('❌ 検証エラー:', message);
    
    // ユーザーへの通知
    if (window.notifications) {
      window.notifications.showError(message);
    }
  }

  /**
   * 統計情報の取得
   */
  getValidationStats() {
    return {
      totalViolations: this.violations.length,
      recentViolations: this.violations.filter(v => 
        Date.now() - new Date(v.timestamp).getTime() < 60 * 60 * 1000
      ).length,
      threatTypes: this.getTopThreatTypes(),
      validatedInputs: document.querySelectorAll('[data-validation-type]').length,
      protectedForms: document.querySelectorAll('form[data-validation-enabled]').length
    };
  }

  /**
   * 上位脅威タイプの取得
   */
  getTopThreatTypes() {
    const threatCounts = {};
    
    this.violations.forEach(violation => {
      if (violation.threats) {
        violation.threats.forEach(threat => {
          threatCounts[threat.type] = (threatCounts[threat.type] || 0) + 1;
        });
      }
    });

    return Object.entries(threatCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }
}

// グローバル利用可能化
if (typeof window !== 'undefined') {
  window.InputValidationSystem = InputValidationSystem;
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.inputValidation = new InputValidationSystem();
    });
  } else {
    window.inputValidation = new InputValidationSystem();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputValidationSystem;
}

console.log('🔒 InputValidationSystem.js 読み込み完了 - 企業レベル入力検証');