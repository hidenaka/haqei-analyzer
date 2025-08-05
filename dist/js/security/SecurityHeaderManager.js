/**
 * セキュリティヘッダー管理システム
 * CSP・HSTS・その他セキュリティヘッダーの包括的管理
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-05
 * Security Level: Enterprise
 */

class SecurityHeaderManager {
  constructor() {
    this.config = this.getSecurityConfig();
    this.nonce = this.generateNonce();
    this.violations = [];
    this.init();
  }

  /**
   * セキュリティ設定の定義
   */
  getSecurityConfig() {
    return {
      // Content Security Policy
      csp: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", 
          "'nonce-{nonce}'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],
        styleSrc: [
          "'self'", 
          "'nonce-{nonce}'",
          "'unsafe-inline'", // Tailwind CSS等のため（本番では削除推奨）
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net"
        ],
        imgSrc: [
          "'self'", 
          "data:", 
          "https:",
          "blob:"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net"
        ],
        connectSrc: [
          "'self'",
          "https://api.haqei.com",
          "https://*.haqei.com"
        ],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: true,
        blockAllMixedContent: true
      },
      
      // 他のセキュリティヘッダー
      headers: {
        strictTransportSecurity: {
          maxAge: 31536000, // 1年
          includeSubDomains: true,
          preload: true
        },
        xContentTypeOptions: 'nosniff',
        xFrameOptions: 'DENY',
        xXSSProtection: '1; mode=block',
        referrerPolicy: 'strict-origin-when-cross-origin',
        permissionsPolicy: {
          geolocation: [],
          microphone: [],
          camera: [],
          payment: ['self'],
          fullscreen: ['self']
        }
      },
      
      // 開発/本番環境別設定
      environment: {
        development: {
          reportOnly: true,
          allowUnsafeInline: true,
          allowUnsafeEval: false
        },
        production: {
          reportOnly: false,
          allowUnsafeInline: false,
          allowUnsafeEval: false
        }
      }
    };
  }

  /**
   * システム初期化
   */
  init() {
    try {
      this.detectEnvironment();
      this.applyClientSideHeaders();
      this.setupCSPViolationReporting();
      this.validateExistingHeaders();
      this.monitorSecurityViolations();
      
      console.log('🛡️ セキュリティヘッダー管理システム初期化完了');
    } catch (error) {
      console.error('❌ セキュリティヘッダー初期化エラー:', error);
    }
  }

  /**
   * 環境検出
   */
  detectEnvironment() {
    this.environment = 
      location.hostname === 'localhost' || 
      location.hostname === '127.0.0.1' || 
      location.hostname.includes('dev') || 
      location.protocol === 'http:'
        ? 'development'
        : 'production';
    
    console.log(`🔍 検出環境: ${this.environment}`);
  }

  /**
   * クライアントサイドヘッダーの適用
   */
  applyClientSideHeaders() {
    // CSPメタタグの設定
    this.setCSPMetaTag();
    
    // セキュリティ関連メタタグの設定
    this.setSecurityMetaTags();
    
    // Nonceの設定
    this.applyNonceToScripts();
    
    // リソース整合性の検証
    this.validateResourceIntegrity();
  }

  /**
   * CSPメタタグの設定
   */
  setCSPMetaTag() {
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!existingCSP) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = this.buildCSPHeader();
      document.head.appendChild(cspMeta);
      
      console.log('📋 CSPメタタグ設定完了');
    } else {
      console.log('📋 既存CSPメタタグ検出');
    }
  }

  /**
   * CSPヘッダーの構築
   */
  buildCSPHeader() {
    const envConfig = this.config.environment[this.environment];
    const csp = this.config.csp;
    const policies = [];

    // default-src
    policies.push(`default-src ${csp.defaultSrc.join(' ')}`);

    // script-src
    let scriptSrc = [...csp.scriptSrc];
    if (envConfig.allowUnsafeInline) {
      scriptSrc.push("'unsafe-inline'");
    }
    if (envConfig.allowUnsafeEval) {
      scriptSrc.push("'unsafe-eval'");
    }
    policies.push(`script-src ${scriptSrc.join(' ').replace(/{nonce}/g, this.nonce)}`);

    // style-src
    policies.push(`style-src ${csp.styleSrc.join(' ').replace(/{nonce}/g, this.nonce)}`);

    // img-src
    policies.push(`img-src ${csp.imgSrc.join(' ')}`);

    // font-src
    policies.push(`font-src ${csp.fontSrc.join(' ')}`);

    // connect-src
    policies.push(`connect-src ${csp.connectSrc.join(' ')}`);

    // その他のディレクティブ
    policies.push(`media-src ${csp.mediaSrc.join(' ')}`);
    policies.push(`object-src ${csp.objectSrc.join(' ')}`);
    policies.push(`frame-src ${csp.frameSrc.join(' ')}`);
    policies.push(`frame-ancestors ${csp.frameAncestors.join(' ')}`);
    policies.push(`base-uri ${csp.baseUri.join(' ')}`);
    policies.push(`form-action ${csp.formAction.join(' ')}`);

    // boolean ディレクティブ
    if (csp.upgradeInsecureRequests) {
      policies.push('upgrade-insecure-requests');
    }
    if (csp.blockAllMixedContent) {
      policies.push('block-all-mixed-content');
    }

    // report-uri (開発環境用)
    if (this.environment === 'development') {
      policies.push('report-uri /csp-violation-report');
    }

    return policies.join('; ');
  }

  /**
   * セキュリティメタタグの設定
   */
  setSecurityMetaTags() {
    const securityTags = [
      {
        httpEquiv: 'X-Content-Type-Options',
        content: this.config.headers.xContentTypeOptions
      },
      {
        httpEquiv: 'X-Frame-Options', 
        content: this.config.headers.xFrameOptions
      },
      {
        httpEquiv: 'X-XSS-Protection',
        content: this.config.headers.xXSSProtection
      },
      {
        httpEquiv: 'Referrer-Policy',
        content: this.config.headers.referrerPolicy
      },
      {
        httpEquiv: 'Permissions-Policy',
        content: this.buildPermissionsPolicyHeader()
      }
    ];

    securityTags.forEach(tag => {
      if (!document.querySelector(`meta[http-equiv="${tag.httpEquiv}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = tag.httpEquiv;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    console.log('🔒 セキュリティメタタグ設定完了');
  }

  /**
   * Permissions-Policyヘッダーの構築
   */
  buildPermissionsPolicyHeader() {
    const permissions = this.config.headers.permissionsPolicy;
    const policies = [];

    Object.entries(permissions).forEach(([feature, allowlist]) => {
      if (allowlist.length === 0) {
        policies.push(`${feature}=()`);
      } else {
        const origins = allowlist.map(origin => 
          origin === 'self' ? 'self' : `"${origin}"`
        ).join(' ');
        policies.push(`${feature}=(${origins})`);
      }
    });

    return policies.join(', ');
  }

  /**
   * スクリプトへのNonce適用
   */
  applyNonceToScripts() {
    const scripts = document.querySelectorAll('script[src]');
    const inlineScripts = document.querySelectorAll('script:not([src])');

    // 外部スクリプトへのnonce適用
    scripts.forEach(script => {
      if (!script.hasAttribute('nonce')) {
        script.setAttribute('nonce', this.nonce);
      }
    });

    // インラインスクリプトへのnonce適用
    inlineScripts.forEach(script => {
      if (!script.hasAttribute('nonce') && script.textContent.trim()) {
        script.setAttribute('nonce', this.nonce);
      }
    });

    console.log(`🔑 ${scripts.length + inlineScripts.length}個のスクリプトにNonce適用完了`);
  }

  /**
   * リソース整合性の検証
   */
  validateResourceIntegrity() {
    const externalResources = document.querySelectorAll('script[src], link[rel="stylesheet"][href]');
    const missingIntegrity = [];

    externalResources.forEach(resource => {
      const src = resource.src || resource.href;
      
      // CDNリソースの整合性チェック
      if (this.isExternalCDN(src) && !resource.hasAttribute('integrity')) {
        missingIntegrity.push(resource);
        console.warn(`⚠️ SRI未設定リソース: ${src}`);
      }
    });

    if (missingIntegrity.length > 0) {
      console.warn(`⚠️ ${missingIntegrity.length}個のリソースでSRIが未設定です`);
    }
  }

  /**
   * 外部CDNかどうかの判定
   */
  isExternalCDN(url) {
    const cdnPatterns = [
      /cdn\.jsdelivr\.net/,
      /cdnjs\.cloudflare\.com/,
      /unpkg\.com/,
      /fonts\.googleapis\.com/,
      /fonts\.gstatic\.com/
    ];

    return cdnPatterns.some(pattern => pattern.test(url));
  }

  /**
   * CSP違反レポートの設定
   */
  setupCSPViolationReporting() {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation(event);
    });

    // グローバルエラーハンドラーでのCSP違反検出
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('Content Security Policy')) {
        this.handleCSPError(event);
      }
    });

    console.log('📊 CSP違反レポート設定完了');
  }

  /**
   * CSP違反の処理
   */
  handleCSPViolation(event) {
    const violation = {
      timestamp: new Date().toISOString(),
      documentURI: event.documentURI,
      referrer: event.referrer,
      violatedDirective: event.violatedDirective,
      effectiveDirective: event.effectiveDirective,
      originalPolicy: event.originalPolicy,
      blockedURI: event.blockedURI,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      sourceFile: event.sourceFile,
      statusCode: event.statusCode,
      disposition: event.disposition // 'enforce' or 'report'
    };

    this.violations.push(violation);
    console.warn('🚨 CSP違反検出:', violation);

    // 重要な違反の場合は即座に対応
    if (this.isCriticalViolation(violation)) {
      this.handleCriticalViolation(violation);
    }

    // 違反統計の更新
    this.updateViolationStats();
  }

  /**
   * CSPエラーの処理
   */
  handleCSPError(event) {
    const error = {
      timestamp: new Date().toISOString(),
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.toString(),
      type: 'csp-error'
    };

    console.warn('⚠️ CSP関連エラー:', error);
    this.violations.push(error);
  }

  /**
   * 重要な違反かどうかの判定
   */
  isCriticalViolation(violation) {
    const criticalDirectives = [
      'script-src',
      'object-src', 
      'base-uri',
      'form-action'
    ];

    return criticalDirectives.includes(violation.effectiveDirective) ||
           violation.blockedURI.includes('javascript:') ||
           violation.blockedURI.includes('data:');
  }

  /**
   * 重要な違反の処理
   */
  handleCriticalViolation(violation) {
    console.error('🚨 重要なCSP違反:', violation);

    // セキュリティログへの記録
    if (window.SecurityLogger) {
      window.SecurityLogger.logCriticalViolation(violation);
    }

    // 管理者への通知
    if (window.AdminNotification) {
      window.AdminNotification.securityAlert({
        type: 'CSP_VIOLATION',
        severity: 'CRITICAL',
        details: violation
      });
    }
  }

  /**
   * 既存ヘッダーの検証
   */
  validateExistingHeaders() {
    const validationResults = {
      csp: this.validateCSP(),
      hsts: this.validateHSTS(),
      xContentTypeOptions: this.validateXContentTypeOptions(),
      xFrameOptions: this.validateXFrameOptions(),
      referrerPolicy: this.validateReferrerPolicy()
    };

    console.log('📋 ヘッダー検証結果:', validationResults);
    return validationResults;
  }

  /**
   * CSPの検証
   */
  validateCSP() {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!cspMeta) {
      return { status: 'missing', message: 'CSPメタタグが設定されていません' };
    }

    const policy = cspMeta.content;
    const issues = [];

    // unsafe-inlineの使用チェック
    if (policy.includes("'unsafe-inline'") && this.environment === 'production') {
      issues.push("'unsafe-inline'が本番環境で使用されています");
    }

    // unsafe-evalの使用チェック
    if (policy.includes("'unsafe-eval'")) {
      issues.push("'unsafe-eval'が使用されています");
    }

    // object-srcのチェック
    if (!policy.includes("object-src 'none'")) {
      issues.push("object-srcが適切に制限されていません");
    }

    return {
      status: issues.length === 0 ? 'valid' : 'warning',
      issues: issues,
      policy: policy
    };
  }

  /**
   * HSTSの検証
   */
  validateHSTS() {
    // クライアントサイドではHSTSヘッダーを直接確認できないため、
    // HTTPSの使用状況をチェック
    if (location.protocol !== 'https:' && this.environment === 'production') {
      return { 
        status: 'error', 
        message: '本番環境でHTTPSが使用されていません' 
      };
    }

    return { 
      status: 'valid', 
      message: 'HTTPS使用中' 
    };
  }

  /**
   * X-Content-Type-Optionsの検証
   */
  validateXContentTypeOptions() {
    const meta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    
    if (!meta || meta.content !== 'nosniff') {
      return { 
        status: 'missing', 
        message: 'X-Content-Type-Optionsが適切に設定されていません' 
      };
    }

    return { status: 'valid' };
  }

  /**
   * X-Frame-Optionsの検証
   */
  validateXFrameOptions() {
    const meta = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    
    if (!meta || !['DENY', 'SAMEORIGIN'].includes(meta.content)) {
      return { 
        status: 'missing', 
        message: 'X-Frame-Optionsが適切に設定されていません' 
      };
    }

    return { status: 'valid' };
  }

  /**
   * Referrer-Policyの検証
   */
  validateReferrerPolicy() {
    const meta = document.querySelector('meta[http-equiv="Referrer-Policy"]');
    
    if (!meta) {
      return { 
        status: 'missing', 
        message: 'Referrer-Policyが設定されていません' 
      };
    }

    const validPolicies = [
      'no-referrer',
      'no-referrer-when-downgrade',
      'origin',
      'origin-when-cross-origin',
      'same-origin',
      'strict-origin',
      'strict-origin-when-cross-origin'
    ];

    if (!validPolicies.includes(meta.content)) {
      return { 
        status: 'invalid', 
        message: '無効なReferrer-Policyが設定されています' 
      };
    }

    return { status: 'valid' };
  }

  /**
   * セキュリティ違反の監視
   */
  monitorSecurityViolations() {
    // 定期的な違反分析
    setInterval(() => {
      this.analyzeViolationTrends();
    }, 5 * 60 * 1000); // 5分毎

    // ページ離脱時の違反レポート送信
    window.addEventListener('beforeunload', () => {
      this.sendViolationReport();
    });
  }

  /**
   * 違反傾向の分析
   */
  analyzeViolationTrends() {
    const recentViolations = this.getRecentViolations(15 * 60 * 1000); // 15分以内
    
    if (recentViolations.length > 10) {
      console.warn('🚨 異常な違反数を検出:', recentViolations.length);
      this.reportAnomalousActivity(recentViolations);
    }

    // 違反パターンの分析
    const patterns = this.analyzeViolationPatterns(recentViolations);
    if (patterns.suspiciousPatterns.length > 0) {
      console.warn('🔍 疑わしい違反パターン:', patterns);
    }
  }

  /**
   * 最近の違反取得
   */
  getRecentViolations(timeWindow) {
    const cutoff = Date.now() - timeWindow;
    return this.violations.filter(v => 
      new Date(v.timestamp).getTime() > cutoff
    );
  }

  /**
   * 違反パターンの分析
   */
  analyzeViolationPatterns(violations) {
    const patterns = {
      blockedURIs: {},
      violatedDirectives: {},
      suspiciousPatterns: []
    };

    violations.forEach(violation => {
      // ブロックされたURIの集計
      if (violation.blockedURI) {
        patterns.blockedURIs[violation.blockedURI] = 
          (patterns.blockedURIs[violation.blockedURI] || 0) + 1;
      }

      // 違反ディレクティブの集計
      if (violation.violatedDirective) {
        patterns.violatedDirectives[violation.violatedDirective] = 
          (patterns.violatedDirectives[violation.violatedDirective] || 0) + 1;
      }

      // 疑わしいパターンの検出
      if (violation.blockedURI && 
          (violation.blockedURI.includes('javascript:') || 
           violation.blockedURI.includes('data:text/html'))) {
        patterns.suspiciousPatterns.push(violation);
      }
    });

    return patterns;
  }

  /**
   * 違反レポートの送信
   */
  sendViolationReport() {
    if (this.violations.length === 0) return;

    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      violations: this.violations,
      stats: this.getViolationStats()
    };

    // 実際の送信処理（実装環境に応じて）
    if (window.SecurityReporter) {
      window.SecurityReporter.sendReport(report);
    }

    console.log('📊 セキュリティ違反レポート送信:', report);
  }

  /**
   * セキュアなNonce生成
   */
  generateNonce() {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, array));
    } else {
      // フォールバック
      return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
    }
  }

  /**
   * 違反統計の更新
   */
  updateViolationStats() {
    // 統計情報をlocalStorageに保存（デバッグ用）
    if (this.environment === 'development') {
      const stats = this.getViolationStats();
      localStorage.setItem('csp-violation-stats', JSON.stringify(stats));
    }
  }

  /**
   * 違反統計の取得
   */
  getViolationStats() {
    return {
      totalViolations: this.violations.length,
      recentViolations: this.getRecentViolations(60 * 60 * 1000).length, // 1時間以内
      violationsByDirective: this.getViolationsByDirective(),
      violationsByURI: this.getViolationsByURI(),
      environment: this.environment,
      currentNonce: this.nonce
    };
  }

  /**
   * ディレクティブ別違反数
   */
  getViolationsByDirective() {
    const counts = {};
    this.violations.forEach(v => {
      if (v.violatedDirective) {
        counts[v.violatedDirective] = (counts[v.violatedDirective] || 0) + 1;
      }
    });
    return counts;
  }

  /**
   * URI別違反数
   */
  getViolationsByURI() {
    const counts = {};
    this.violations.forEach(v => {
      if (v.blockedURI) {
        counts[v.blockedURI] = (counts[v.blockedURI] || 0) + 1;
      }
    });
    return counts;
  }

  /**
   * 異常活動の報告
   */
  reportAnomalousActivity(violations) {
    const report = {
      timestamp: new Date().toISOString(),
      type: 'ANOMALOUS_CSP_VIOLATIONS',
      violationCount: violations.length,
      patterns: this.analyzeViolationPatterns(violations),
      environment: this.environment
    };

    console.error('🚨 異常なCSP違反活動:', report);

    if (window.SecurityLogger) {
      window.SecurityLogger.logAnomalousActivity(report);
    }
  }
}

// グローバル利用可能化
if (typeof window !== 'undefined') {
  window.SecurityHeaderManager = SecurityHeaderManager;
  
  // DOM読み込み完了前でも動作するよう即座に初期化
  window.securityHeaders = new SecurityHeaderManager();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityHeaderManager;
}

console.log('🛡️ SecurityHeaderManager.js 読み込み完了 - 企業レベルセキュリティヘッダー管理');