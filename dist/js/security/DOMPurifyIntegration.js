/**
 * DOMPurify統合セキュリティシステム
 * XSS攻撃からの包括的保護
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-05
 * Security Level: Enterprise
 */

class DOMPurifyIntegration {
  constructor() {
    this.isInitialized = false;
    this.config = this.getSecurityConfig();
    this.initDOMPurify();
  }

  /**
   * セキュリティ設定の定義
   */
  getSecurityConfig() {
    return {
      // 許可するHTMLタグ（最小限）
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'span', 'div', 'p', 'br',
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ],
      
      // 許可する属性（ホワイトリスト）
      ALLOWED_ATTR: [
        'class', 'id', 'data-question-id', 'data-answer-id',
        'data-hexagram-id', 'style'
      ],
      
      // 許可するスタイル属性
      ALLOWED_STYLE_PROPS: [
        'color', 'background-color', 'font-size', 'font-weight',
        'text-align', 'margin', 'padding', 'border'
      ],
      
      // URI スキーマのホワイトリスト
      ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      
      // 危険なタグの完全禁止
      FORBID_TAGS: [
        'script', 'object', 'embed', 'form', 'input', 'textarea',
        'select', 'button', 'iframe', 'frame', 'frameset', 'meta',
        'link', 'style', 'base', 'title'
      ],
      
      // 危険な属性の完全禁止
      FORBID_ATTR: [
        'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
        'onfocus', 'onblur', 'onchange', 'onsubmit', 'href', 'src'
      ]
    };
  }

  /**
   * DOMPurifyの初期化
   */
  async initDOMPurify() {
    try {
      // DOMPurifyライブラリの動的読み込み
      if (typeof DOMPurify === 'undefined') {
        await this.loadDOMPurifyLibrary();
      }

      // セキュリティフックの設定
      this.setupSecurityHooks();
      
      this.isInitialized = true;
      console.log('✅ DOMPurify セキュリティシステム初期化完了');
    } catch (error) {
      console.error('❌ DOMPurify初期化エラー:', error);
      this.isInitialized = false;
    }
  }

  /**
   * DOMPurifyライブラリの動的読み込み
   */
  async loadDOMPurifyLibrary() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.min.js';
      script.integrity = 'sha384-69eb1h/3FLKz1j3ChgOC6gH3+k0KvBfH7NrR+mOlKCl5vPnWRnNjB/LwEXxfKz0y';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        if (typeof DOMPurify !== 'undefined') {
          resolve();
        } else {
          reject(new Error('DOMPurify failed to load'));
        }
      };
      
      script.onerror = () => reject(new Error('Failed to load DOMPurify script'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * セキュリティフックの設定
   */
  setupSecurityHooks() {
    if (typeof DOMPurify === 'undefined') return;

    // 危険なコンテンツの検出フック
    DOMPurify.addHook('beforeSanitizeElements', (node, data) => {
      // スクリプトタグの検出
      if (data.tagName === 'script') {
        this.logSecurityViolation('SCRIPT_TAG_DETECTED', node);
        return false;
      }

      // 危険な属性の検出
      const dangerousAttrs = ['onclick', 'onload', 'onerror', 'href', 'src'];
      for (const attr of dangerousAttrs) {
        if (node.hasAttribute && node.hasAttribute(attr)) {
          this.logSecurityViolation('DANGEROUS_ATTRIBUTE_DETECTED', node, attr);
          node.removeAttribute(attr);
        }
      }
    });

    // 属性値のサニタイゼーションフック
    DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
      // data-*属性の検証
      if (node.hasAttributes()) {
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
          if (attr.name.startsWith('data-')) {
            attr.value = this.sanitizeDataAttribute(attr.value);
          }
        });
      }
    });

    console.log('🔒 DOMPurify セキュリティフック設定完了');
  }

  /**
   * HTMLのサニタイゼーション（メインAPI）
   */
  sanitizeHTML(dirtyHTML, options = {}) {
    if (!this.isInitialized) {
      console.warn('⚠️ DOMPurify未初期化 - フォールバック処理');
      return this.fallbackSanitize(dirtyHTML);
    }

    try {
      const config = {
        ...this.config,
        ...options,
        // 強制的にセキュリティ設定を適用
        KEEP_CONTENT: false,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        SANITIZE_DOM: true
      };

      const cleanHTML = DOMPurify.sanitize(dirtyHTML, config);
      
      // 追加検証
      this.validateSanitizedContent(cleanHTML);
      
      return cleanHTML;
    } catch (error) {
      console.error('❌ HTML サニタイゼーションエラー:', error);
      this.logSecurityViolation('SANITIZATION_ERROR', null, error.message);
      return this.fallbackSanitize(dirtyHTML);
    }
  }

  /**
   * テキストコンテンツの安全な挿入
   */
  safeSetTextContent(element, text) {
    if (!element || typeof text !== 'string') {
      console.warn('⚠️ safeSetTextContent: 無効なパラメータ');
      return false;
    }

    try {
      // textContentを使用してXSS攻撃を防止
      element.textContent = text;
      return true;
    } catch (error) {
      console.error('❌ テキスト挿入エラー:', error);
      return false;
    }
  }

  /**
   * 安全なHTML挿入
   */
  safeSetInnerHTML(element, html) {
    if (!element || typeof html !== 'string') {
      console.warn('⚠️ safeSetInnerHTML: 無効なパラメータ');
      return false;
    }

    try {
      const sanitizedHTML = this.sanitizeHTML(html);
      element.innerHTML = sanitizedHTML;
      
      // 挿入後の検証
      this.validateInsertedContent(element);
      
      return true;
    } catch (error) {
      console.error('❌ HTML挿入エラー:', error);
      return false;
    }
  }

  /**
   * 属性値の安全な設定
   */
  safeSetAttribute(element, name, value) {
    if (!element || typeof name !== 'string' || typeof value !== 'string') {
      console.warn('⚠️ safeSetAttribute: 無効なパラメータ');
      return false;
    }

    // 属性名のホワイトリスト検証
    if (!this.config.ALLOWED_ATTR.includes(name)) {
      console.warn(`⚠️ 許可されていない属性: ${name}`);
      return false;
    }

    try {
      const sanitizedValue = this.sanitizeAttributeValue(name, value);
      element.setAttribute(name, sanitizedValue);
      return true;
    } catch (error) {
      console.error('❌ 属性設定エラー:', error);
      return false;
    }
  }

  /**
   * data-*属性値のサニタイゼーション
   */
  sanitizeDataAttribute(value) {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/&/g, '&amp;');
  }

  /**
   * 属性値のサニタイゼーション
   */
  sanitizeAttributeValue(name, value) {
    switch (name) {
      case 'class':
        // CSS クラス名の検証
        return value.replace(/[^a-zA-Z0-9_-\s]/g, '');
      
      case 'id':
        // ID の検証
        return value.replace(/[^a-zA-Z0-9_-]/g, '');
      
      case 'style':
        // インラインスタイルの検証
        return this.sanitizeStyleAttribute(value);
      
      default:
        // 一般的な属性値のエスケープ
        return this.sanitizeDataAttribute(value);
    }
  }

  /**
   * スタイル属性のサニタイゼーション
   */
  sanitizeStyleAttribute(styleValue) {
    // 危険なCSSプロパティやjavascript:の除去
    const cleanStyle = styleValue
      .replace(/javascript:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace//@import/gi, '')
      .replace(/behavior\s*:/gi, '');

    // 許可されたプロパティのみ通す
    const declarations = cleanStyle.split(';');
    const allowedDeclarations = declarations.filter(decl => {
      const [property] = decl.split(':').map(s => s.trim());
      return this.config.ALLOWED_STYLE_PROPS.includes(property);
    });

    return allowedDeclarations.join('; ');
  }

  /**
   * フォールバック サニタイゼーション
   */
  fallbackSanitize(html) {
    if (typeof html !== 'string') return '';

    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * サニタイゼーション結果の検証
   */
  validateSanitizedContent(content) {
    // 危険なパターンの残存チェック
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        this.logSecurityViolation('DANGEROUS_CONTENT_DETECTED', null, content);
        throw new Error('危険なコンテンツが検出されました');
      }
    }
  }

  /**
   * 挿入されたコンテンツの検証
   */
  validateInsertedContent(element) {
    // 子要素の危険なタグをチェック
    const dangerousTags = element.querySelectorAll('script, object, embed, iframe');
    if (dangerousTags.length > 0) {
      console.error('❌ 危険なタグが挿入されました');
      dangerousTags.forEach(tag => tag.remove());
    }

    // 危険な属性をチェック
    const elementsWithDangerousAttrs = element.querySelectorAll('[onclick], [onload], [onerror], [href^="javascript:"]');
    elementsWithDangerousAttrs.forEach(elem => {
      ['onclick', 'onload', 'onerror'].forEach(attr => {
        if (elem.hasAttribute(attr)) {
          elem.removeAttribute(attr);
        }
      });
      
      if (elem.hasAttribute('href') && elem.getAttribute('href').startsWith('javascript:')) {
        elem.removeAttribute('href');
      }
    });
  }

  /**
   * セキュリティ違反のログ記録
   */
  logSecurityViolation(type, element, details) {
    const violation = {
      timestamp: new Date().toISOString(),
      type: type,
      url: window.location.href,
      userAgent: navigator.userAgent,
      element: element ? element.outerHTML : null,
      details: details
    };

    console.warn('🚨 セキュリティ違反検出:', violation);

    // セキュリティログの永続化（実装環境に応じて）
    if (window.SecurityLogger) {
      window.SecurityLogger.logViolation(violation);
    }
  }

  /**
   * セキュリティ統計の取得
   */
  getSecurityStats() {
    return {
      isInitialized: this.isInitialized,
      libraryLoaded: typeof DOMPurify !== 'undefined',
      configuredRules: Object.keys(this.config).length,
      allowedTags: this.config.ALLOWED_TAGS.length,
      allowedAttributes: this.config.ALLOWED_ATTR.length,
      forbiddenTags: this.config.FORBID_TAGS.length,
      forbiddenAttributes: this.config.FORBID_ATTR.length
    };
  }
}

// グローバル利用可能化
if (typeof window !== 'undefined') {
  window.DOMPurifyIntegration = DOMPurifyIntegration;
  
  // 即座に初期化
  window.domPurifyIntegration = new DOMPurifyIntegration();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOMPurifyIntegration;
}

console.log('🔒 DOMPurifyIntegration.js 読み込み完了 - 企業レベルXSS保護');