# HAQEIアナライザー セキュリティ要件定義書

**文書番号**: REQ-011  
**文書名**: セキュリティ要件定義書  
**作成日**: 2025年8月5日  
**作成者**: HAQEI Requirements Analyst Agent  
**承認者**: HAQEI CTO Agent  
**版数**: 1.0  
**関連文書**: システム設計書、Triple OS統合要件（REQ-009）、パフォーマンス要件（REQ-002）

---

## 1. エグゼクティブサマリー

### 1.1 セキュリティ脅威の現状

HAQEIアナライザーは個人の価値観や心理的傾向を扱う高度にセンシティブなシステムであり、以下の重大なセキュリティリスクに直面している：

| 脅威カテゴリ | リスクレベル | 影響範囲 | 現在の対策状況 |
|-------------|-------------|----------|----------------|
| **XSS攻撃** | 高 | ユーザーデータ漏洩 | 部分的実装 |
| **CSRF攻撃** | 中 | 不正操作実行 | 未実装 |
| **データ漏洩** | 高 | プライバシー侵害 | 基本的暗号化のみ |
| **セッション管理** | 中 | 不正アクセス | 基本実装 |
| **入力検証** | 高 | インジェクション | 部分的実装 |

### 1.2 セキュリティ目標

1. **ゼロトラストアーキテクチャ**: すべての入力を信頼しない
2. **多層防御**: 複数のセキュリティレイヤーによる保護
3. **プライバシーバイデザイン**: 設計段階からのプライバシー保護
4. **最小権限の原則**: 必要最小限のアクセス権限
5. **継続的監視**: リアルタイムでの脅威検出と対応

### 1.3 準拠基準

- **OWASP Top 10 2021**: Webアプリケーションセキュリティ
- **GDPR**: 個人データ保護（EUユーザー向け）
- **CCPA**: カリフォルニア州プライバシー法
- **NIST サイバーセキュリティフレームワーク**: 包括的セキュリティ管理

---

## 2. XSS（クロスサイトスクリプティング）対策要件

### 2.1 脅威モデル

```javascript
// 潜在的XSS脆弱性の例
// 危険：HTMLに直接挿入
element.innerHTML = userInput; // ❌ 危険

// 危険：属性値への直接挿入
element.setAttribute('data-value', userInput); // ❌ 危険

// 危険：JavaScriptコードとして実行
eval(userInput); // ❌ 絶対禁止
new Function(userInput)(); // ❌ 絶対禁止
```

### 2.2 防御要件

#### 入力検証とサニタイゼーション
```javascript
class SecurityValidator {
  // HTML特殊文字のエスケープ
  static escapeHtml(str) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return String(str).replace(/[&<>"'\/]/g, s => map[s]);
  }
  
  // 属性値のエスケープ
  static escapeAttribute(str) {
    return String(str)
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  // JavaScript文字列のエスケープ
  static escapeJs(str) {
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }
}
```

#### Content Security Policy (CSP)
```html
<!-- 厳格なCSPヘッダー -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'nonce-{random}';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.haqei.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
">
```

#### DOM操作のセキュア化
```javascript
// 安全なDOM操作
class SecureDOM {
  static setText(element, text) {
    element.textContent = text; // ✅ 安全
  }
  
  static setHTML(element, html) {
    // DOMPurifyによるサニタイゼーション
    element.innerHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
      ALLOWED_ATTR: ['class']
    });
  }
  
  static setAttribute(element, name, value) {
    // 属性名のホワイトリスト検証
    const allowedAttributes = ['class', 'id', 'data-question-id'];
    if (allowedAttributes.includes(name)) {
      element.setAttribute(name, SecurityValidator.escapeAttribute(value));
    }
  }
}
```

### 2.3 実装チェックリスト

| 対策項目 | 実装状況 | 優先度 | 検証方法 |
|----------|----------|--------|----------|
| HTML出力のエスケープ | 必須 | 高 | 自動テスト |
| 属性値のエスケープ | 必須 | 高 | 自動テスト |
| JavaScript内のエスケープ | 必須 | 高 | コードレビュー |
| CSPヘッダー実装 | 必須 | 高 | セキュリティスキャン |
| DOMPurify導入 | 必須 | 高 | 統合テスト |
| eval/Function使用禁止 | 必須 | 高 | 静的解析 |

---

## 3. CSRF（クロスサイトリクエストフォージェリ）対策要件

### 3.1 CSRFトークン実装

#### トークン生成と管理
```javascript
class CSRFProtection {
  constructor() {
    this.tokenStore = new Map();
  }
  
  // トークン生成
  generateToken(sessionId) {
    const token = this.generateSecureRandom(32);
    this.tokenStore.set(sessionId, {
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000) // 30分有効
    });
    return token;
  }
  
  // トークン検証
  validateToken(sessionId, token) {
    const stored = this.tokenStore.get(sessionId);
    if (!stored) return false;
    
    if (Date.now() > stored.expiresAt) {
      this.tokenStore.delete(sessionId);
      return false;
    }
    
    return crypto.timingSafeEqual(
      Buffer.from(stored.token),
      Buffer.from(token)
    );
  }
  
  // セキュアなランダム値生成
  generateSecureRandom(length) {
    return crypto.randomBytes(length).toString('hex');
  }
}
```

#### フォーム実装
```html
<!-- CSRFトークン付きフォーム -->
<form method="POST" action="/api/analyze">
  <input type="hidden" name="_csrf" value="${csrfToken}">
  <!-- その他のフォーム要素 -->
</form>
```

#### AJAX実装
```javascript
// セキュアなAJAXリクエスト
class SecureAPI {
  static async request(url, options = {}) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    const secureOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...options.headers
      },
      credentials: 'same-origin' // Cookie送信を同一オリジンに限定
    };
    
    const response = await fetch(url, secureOptions);
    
    // CSRFトークンの更新チェック
    const newToken = response.headers.get('X-New-CSRF-Token');
    if (newToken) {
      document.querySelector('meta[name="csrf-token"]').content = newToken;
    }
    
    return response;
  }
}
```

### 3.2 SameSite Cookie設定

```javascript
// セキュアなCookie設定
class SecureCookie {
  static set(name, value, options = {}) {
    const secureOptions = {
      httpOnly: true,      // JavaScriptからのアクセス禁止
      secure: true,        // HTTPS必須
      sameSite: 'Strict',  // CSRF対策
      path: '/',
      maxAge: 3600,        // 1時間
      ...options
    };
    
    document.cookie = `${name}=${value}; ${this.buildCookieString(secureOptions)}`;
  }
  
  static buildCookieString(options) {
    return Object.entries(options)
      .map(([key, value]) => {
        if (key === 'maxAge') return `Max-Age=${value}`;
        if (key === 'httpOnly' && value) return 'HttpOnly';
        if (key === 'secure' && value) return 'Secure';
        if (key === 'sameSite') return `SameSite=${value}`;
        return `${key}=${value}`;
      })
      .join('; ');
  }
}
```

### 3.3 リファラーチェック

```javascript
// リファラー検証ミドルウェア
class RefererValidator {
  static validate(request) {
    const referer = request.headers.get('Referer');
    const origin = request.headers.get('Origin');
    
    // 期待されるオリジン
    const expectedOrigin = 'https://haqei.com';
    
    // OriginヘッダーまたはRefererヘッダーの検証
    if (origin && origin !== expectedOrigin) {
      return false;
    }
    
    if (referer && !referer.startsWith(expectedOrigin)) {
      return false;
    }
    
    // POSTリクエストでOriginもRefererもない場合は拒否
    if (request.method === 'POST' && !origin && !referer) {
      return false;
    }
    
    return true;
  }
}
```

---

## 4. データ保護要件

### 4.1 データ分類とセキュリティレベル

| データカテゴリ | 機密レベル | 保護要件 | 暗号化 |
|---------------|-----------|----------|---------|
| **個人識別情報** | 極高 | 完全暗号化・アクセス制限 | AES-256 |
| **診断回答データ** | 高 | 暗号化・匿名化 | AES-256 |
| **分析結果** | 中 | 暗号化・整合性保護 | AES-128 |
| **システムログ** | 低 | アクセス制限 | なし |

### 4.2 暗号化実装

#### データ暗号化クラス
```javascript
class DataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyDerivationIterations = 100000;
  }
  
  // 暗号化
  async encrypt(data, password) {
    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    const key = await this.deriveKey(password, salt);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted.toString('base64'),
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    };
  }
  
  // 復号化
  async decrypt(encryptedData, password) {
    const salt = Buffer.from(encryptedData.salt, 'base64');
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const authTag = Buffer.from(encryptedData.authTag, 'base64');
    const encrypted = Buffer.from(encryptedData.encrypted, 'base64');
    
    const key = await this.deriveKey(password, salt);
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  }
  
  // 鍵導出
  async deriveKey(password, salt) {
    return crypto.pbkdf2Sync(
      password,
      salt,
      this.keyDerivationIterations,
      32,
      'sha256'
    );
  }
}
```

### 4.3 データ匿名化

```javascript
class DataAnonymizer {
  // 個人識別情報の匿名化
  static anonymizePII(data) {
    return {
      ...data,
      id: this.generateAnonymousId(data.id),
      email: this.hashEmail(data.email),
      ip: this.anonymizeIP(data.ip),
      timestamp: this.generalizeTimestamp(data.timestamp)
    };
  }
  
  // 匿名ID生成
  static generateAnonymousId(originalId) {
    const hash = crypto.createHash('sha256');
    hash.update(originalId + process.env.ANONYMIZATION_SALT);
    return hash.digest('hex').substring(0, 16);
  }
  
  // メールアドレスのハッシュ化
  static hashEmail(email) {
    const [local, domain] = email.split('@');
    const hashedLocal = crypto.createHash('sha256')
      .update(local)
      .digest('hex')
      .substring(0, 8);
    return `${hashedLocal}@${domain}`;
  }
  
  // IPアドレスの匿名化（最後のオクテットを削除）
  static anonymizeIP(ip) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
    return ip; // IPv6の場合は別処理が必要
  }
  
  // タイムスタンプの一般化（時間単位に丸める）
  static generalizeTimestamp(timestamp) {
    const date = new Date(timestamp);
    date.setMinutes(0, 0, 0);
    return date.toISOString();
  }
}
```

### 4.4 アクセス制御

```javascript
class AccessControl {
  constructor() {
    this.permissions = new Map();
  }
  
  // 役割ベースのアクセス制御（RBAC）
  defineRoles() {
    return {
      admin: {
        permissions: ['read', 'write', 'delete', 'export'],
        dataAccess: ['all']
      },
      analyst: {
        permissions: ['read', 'export'],
        dataAccess: ['anonymized']
      },
      user: {
        permissions: ['read'],
        dataAccess: ['own']
      }
    };
  }
  
  // アクセス権限チェック
  checkPermission(userId, resource, action) {
    const userRole = this.getUserRole(userId);
    const rolePermissions = this.defineRoles()[userRole];
    
    if (!rolePermissions) {
      return false;
    }
    
    // アクションの権限チェック
    if (!rolePermissions.permissions.includes(action)) {
      return false;
    }
    
    // データアクセス範囲のチェック
    if (rolePermissions.dataAccess.includes('all')) {
      return true;
    }
    
    if (rolePermissions.dataAccess.includes('own')) {
      return this.isOwnResource(userId, resource);
    }
    
    return false;
  }
  
  // 監査ログ記録
  logAccess(userId, resource, action, result) {
    const log = {
      timestamp: new Date().toISOString(),
      userId,
      resource,
      action,
      result,
      ip: this.getClientIP(),
      userAgent: this.getUserAgent()
    };
    
    // 監査ログの永続化
    this.persistAuditLog(log);
  }
}
```

---

## 5. 入力検証要件

### 5.1 包括的入力検証

```javascript
class InputValidator {
  // 汎用的な入力検証
  static validate(input, rules) {
    const errors = [];
    
    for (const rule of rules) {
      const result = rule.validate(input);
      if (!result.valid) {
        errors.push(result.error);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  // 質問回答の検証
  static validateAnswer(answer) {
    const rules = [
      {
        name: 'required',
        validate: (value) => ({
          valid: value !== null && value !== undefined && value !== '',
          error: '回答は必須です'
        })
      },
      {
        name: 'type',
        validate: (value) => ({
          valid: ['single', 'multiple', 'text'].includes(value.type),
          error: '無効な回答タイプです'
        })
      },
      {
        name: 'range',
        validate: (value) => {
          if (value.type === 'single') {
            return {
              valid: value.value >= 1 && value.value <= 5,
              error: '回答は1-5の範囲で選択してください'
            };
          }
          return { valid: true };
        }
      },
      {
        name: 'length',
        validate: (value) => {
          if (value.type === 'text') {
            return {
              valid: value.value.length <= 1000,
              error: 'テキストは1000文字以内で入力してください'
            };
          }
          return { valid: true };
        }
      }
    ];
    
    return this.validate(answer, rules);
  }
  
  // SQLインジェクション対策
  static sanitizeForSQL(input) {
    // パラメータ化クエリを使用するため、この関数は使用しない
    throw new Error('Use parameterized queries instead of sanitization');
  }
  
  // ファイルアップロード検証
  static validateFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const rules = [
      {
        name: 'type',
        validate: (f) => ({
          valid: allowedTypes.includes(f.type),
          error: `許可されたファイル形式: ${allowedTypes.join(', ')}`
        })
      },
      {
        name: 'size',
        validate: (f) => ({
          valid: f.size <= maxSize,
          error: `ファイルサイズは${maxSize / 1024 / 1024}MB以下にしてください`
        })
      },
      {
        name: 'name',
        validate: (f) => ({
          valid: /^[\w\-. ]+$/.test(f.name),
          error: 'ファイル名に使用できない文字が含まれています'
        })
      }
    ];
    
    return this.validate(file, rules);
  }
}
```

### 5.2 出力エンコーディング

```javascript
class OutputEncoder {
  // コンテキストに応じたエンコーディング
  static encode(data, context) {
    switch (context) {
      case 'html':
        return this.encodeHTML(data);
      case 'attribute':
        return this.encodeAttribute(data);
      case 'javascript':
        return this.encodeJavaScript(data);
      case 'url':
        return this.encodeURL(data);
      case 'css':
        return this.encodeCSS(data);
      default:
        throw new Error(`Unknown encoding context: ${context}`);
    }
  }
  
  // HTMLコンテキスト用エンコーディング
  static encodeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // URL用エンコーディング
  static encodeURL(str) {
    return encodeURIComponent(str);
  }
  
  // CSS用エンコーディング
  static encodeCSS(str) {
    return str.replace(/[^\w\-]/g, (char) => {
      return '\\' + char.charCodeAt(0).toString(16) + ' ';
    });
  }
}
```

---

## 6. セッション管理要件

### 6.1 セキュアセッション実装

```javascript
class SecureSessionManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30分
    this.absoluteTimeout = 2 * 60 * 60 * 1000; // 2時間
  }
  
  // セッション作成
  createSession(userId) {
    const sessionId = this.generateSessionId();
    const now = Date.now();
    
    const session = {
      id: sessionId,
      userId,
      createdAt: now,
      lastActivityAt: now,
      csrfToken: this.generateCSRFToken(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    };
    
    this.sessions.set(sessionId, session);
    
    // セッション固定攻撃対策
    this.regenerateSessionId(sessionId);
    
    return session;
  }
  
  // セッションID再生成
  regenerateSessionId(oldSessionId) {
    const session = this.sessions.get(oldSessionId);
    if (!session) return null;
    
    const newSessionId = this.generateSessionId();
    session.id = newSessionId;
    
    this.sessions.delete(oldSessionId);
    this.sessions.set(newSessionId, session);
    
    return newSessionId;
  }
  
  // セッション検証
  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    const now = Date.now();
    
    // 絶対タイムアウトチェック
    if (now - session.createdAt > this.absoluteTimeout) {
      this.destroySession(sessionId);
      return false;
    }
    
    // アイドルタイムアウトチェック
    if (now - session.lastActivityAt > this.sessionTimeout) {
      this.destroySession(sessionId);
      return false;
    }
    
    // IPアドレス変更チェック
    if (session.ipAddress !== this.getClientIP()) {
      this.destroySession(sessionId);
      return false;
    }
    
    // セッション更新
    session.lastActivityAt = now;
    
    return true;
  }
  
  // セキュアなセッションID生成
  generateSessionId() {
    return crypto.randomBytes(32).toString('base64url');
  }
  
  // CSRFトークン生成
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}
```

### 6.2 セッションストレージセキュリティ

```javascript
class SecureStorage {
  // LocalStorage暗号化ラッパー
  static setItem(key, value, encrypt = true) {
    let data = JSON.stringify(value);
    
    if (encrypt) {
      data = this.encrypt(data);
    }
    
    localStorage.setItem(key, data);
    
    // 自動有効期限設定
    const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24時間
    localStorage.setItem(`${key}_expiry`, expiry);
  }
  
  static getItem(key, decrypt = true) {
    // 有効期限チェック
    const expiry = localStorage.getItem(`${key}_expiry`);
    if (expiry && Date.now() > parseInt(expiry)) {
      this.removeItem(key);
      return null;
    }
    
    let data = localStorage.getItem(key);
    if (!data) return null;
    
    if (decrypt) {
      data = this.decrypt(data);
    }
    
    return JSON.parse(data);
  }
  
  static removeItem(key) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
  }
  
  // 簡易暗号化（本番環境では適切な暗号化ライブラリを使用）
  static encrypt(data) {
    // Web Crypto APIを使用した暗号化実装
    return btoa(data); // 仮実装
  }
  
  static decrypt(data) {
    // Web Crypto APIを使用した復号化実装
    return atob(data); // 仮実装
  }
}
```

---

## 7. 認証要件

### 7.1 多要素認証（MFA）

```javascript
class MultiFactorAuth {
  // TOTP（Time-based One-Time Password）実装
  generateSecret() {
    return crypto.randomBytes(20).toString('base32');
  }
  
  generateQRCode(user, secret) {
    const otpauth = `otpauth://totp/HAQEI:${user.email}?secret=${secret}&issuer=HAQEI`;
    // QRコード生成ライブラリを使用
    return QRCode.toDataURL(otpauth);
  }
  
  verifyToken(secret, token) {
    const window = 1; // 前後1つのウィンドウを許容
    
    for (let i = -window; i <= window; i++) {
      const time = Math.floor(Date.now() / 1000 / 30) + i;
      const expectedToken = this.generateTOTP(secret, time);
      
      if (token === expectedToken) {
        return true;
      }
    }
    
    return false;
  }
  
  generateTOTP(secret, time) {
    // TOTP生成アルゴリズム
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
    hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'));
    
    const hash = hmac.digest();
    const offset = hash[hash.length - 1] & 0xf;
    
    const code = (
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)
    ) % 1000000;
    
    return code.toString().padStart(6, '0');
  }
}
```

### 7.2 パスワードポリシー

```javascript
class PasswordPolicy {
  static requirements = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventUserInfo: true,
    preventRepeating: true,
    preventSequential: true
  };
  
  static validate(password, userInfo = {}) {
    const errors = [];
    
    // 長さチェック
    if (password.length < this.requirements.minLength) {
      errors.push(`パスワードは${this.requirements.minLength}文字以上必要です`);
    }
    
    // 大文字チェック
    if (this.requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字を1文字以上含めてください');
    }
    
    // 小文字チェック
    if (this.requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字を1文字以上含めてください');
    }
    
    // 数字チェック
    if (this.requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('数字を1文字以上含めてください');
    }
    
    // 特殊文字チェック
    if (this.requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('特殊文字を1文字以上含めてください');
    }
    
    // 一般的なパスワードチェック
    if (this.requirements.preventCommonPasswords && this.isCommonPassword(password)) {
      errors.push('よく使われるパスワードは使用できません');
    }
    
    // ユーザー情報の使用チェック
    if (this.requirements.preventUserInfo && this.containsUserInfo(password, userInfo)) {
      errors.push('ユーザー名やメールアドレスを含むパスワードは使用できません');
    }
    
    // 繰り返し文字チェック
    if (this.requirements.preventRepeating && /(.)\1{2,}/.test(password)) {
      errors.push('同じ文字を3回以上繰り返すことはできません');
    }
    
    // 連続文字チェック
    if (this.requirements.preventSequential && this.hasSequentialChars(password)) {
      errors.push('連続する文字列（abc, 123など）は使用できません');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      strength: this.calculateStrength(password)
    };
  }
  
  static calculateStrength(password) {
    let strength = 0;
    
    // 基本スコア
    strength += Math.min(password.length * 4, 40);
    
    // 文字種別ボーナス
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/\d/.test(password)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    
    // エントロピーボーナス
    const uniqueChars = new Set(password).size;
    strength += Math.min(uniqueChars * 2, 20);
    
    return Math.min(strength, 100);
  }
}
```

---

## 8. セキュリティヘッダー要件

### 8.1 必須セキュリティヘッダー

```javascript
class SecurityHeaders {
  static getHeaders() {
    return {
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'nonce-{nonce}'",
        "style-src 'self' 'nonce-{nonce}'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://api.haqei.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ].join('; '),
      
      // その他のセキュリティヘッダー
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      
      // HSTS（HTTP Strict Transport Security）
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // CORS設定
      'Access-Control-Allow-Origin': 'https://haqei.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
      'Access-Control-Allow-Credentials': 'true',
      
      // キャッシュ制御（機密データ用）
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }
  
  // Express.jsミドルウェア例
  static middleware() {
    return (req, res, next) => {
      const headers = this.getHeaders();
      
      // nonceの生成と置換
      const nonce = crypto.randomBytes(16).toString('base64');
      res.locals.nonce = nonce;
      
      Object.entries(headers).forEach(([key, value]) => {
        if (key === 'Content-Security-Policy') {
          value = value.replace(/{nonce}/g, nonce);
        }
        res.setHeader(key, value);
      });
      
      next();
    };
  }
}
```

---

## 9. 監査とログ要件

### 9.1 セキュリティイベントログ

```javascript
class SecurityAuditLogger {
  constructor() {
    this.logLevels = {
      INFO: 'INFO',
      WARNING: 'WARNING',
      ERROR: 'ERROR',
      CRITICAL: 'CRITICAL'
    };
  }
  
  // セキュリティイベントログ
  logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType: event.type,
      severity: event.severity || this.logLevels.INFO,
      userId: event.userId || 'anonymous',
      sessionId: event.sessionId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      action: event.action,
      resource: event.resource,
      result: event.result,
      details: event.details,
      // 追加のコンテキスト情報
      context: {
        requestId: event.requestId,
        correlationId: event.correlationId,
        duration: event.duration
      }
    };
    
    // 重要度に応じた処理
    switch (logEntry.severity) {
      case this.logLevels.CRITICAL:
        this.handleCriticalEvent(logEntry);
        break;
      case this.logLevels.ERROR:
        this.handleErrorEvent(logEntry);
        break;
      case this.logLevels.WARNING:
        this.handleWarningEvent(logEntry);
        break;
      default:
        this.handleInfoEvent(logEntry);
    }
    
    // ログの永続化
    this.persistLog(logEntry);
  }
  
  // 監視対象イベント
  getMonitoredEvents() {
    return {
      // 認証関連
      LOGIN_ATTEMPT: { severity: 'INFO' },
      LOGIN_SUCCESS: { severity: 'INFO' },
      LOGIN_FAILURE: { severity: 'WARNING' },
      LOGOUT: { severity: 'INFO' },
      PASSWORD_CHANGE: { severity: 'WARNING' },
      
      // アクセス制御
      UNAUTHORIZED_ACCESS: { severity: 'ERROR' },
      PERMISSION_DENIED: { severity: 'WARNING' },
      PRIVILEGE_ESCALATION: { severity: 'CRITICAL' },
      
      // データアクセス
      DATA_ACCESS: { severity: 'INFO' },
      DATA_MODIFICATION: { severity: 'WARNING' },
      DATA_DELETION: { severity: 'WARNING' },
      DATA_EXPORT: { severity: 'WARNING' },
      
      // セキュリティ脅威
      XSS_ATTEMPT: { severity: 'CRITICAL' },
      SQL_INJECTION_ATTEMPT: { severity: 'CRITICAL' },
      CSRF_ATTEMPT: { severity: 'CRITICAL' },
      BRUTE_FORCE_ATTEMPT: { severity: 'CRITICAL' },
      
      // システムイベント
      CONFIGURATION_CHANGE: { severity: 'WARNING' },
      SYSTEM_ERROR: { severity: 'ERROR' },
      PERFORMANCE_DEGRADATION: { severity: 'WARNING' }
    };
  }
  
  // ログ分析とアラート
  analyzeSecurityTrends() {
    return {
      failedLoginAttempts: this.countEvents('LOGIN_FAILURE', '1h'),
      unauthorizedAccess: this.countEvents('UNAUTHORIZED_ACCESS', '24h'),
      suspiciousPatterns: this.detectAnomalies(),
      recommendations: this.generateSecurityRecommendations()
    };
  }
}
```

### 9.2 コンプライアンスログ

```javascript
class ComplianceLogger {
  // GDPR準拠のデータアクセスログ
  logDataAccess(access) {
    const log = {
      timestamp: new Date().toISOString(),
      dataSubjectId: access.subjectId,
      processingActivity: access.activity,
      legalBasis: access.legalBasis,
      purpose: access.purpose,
      dataCategories: access.categories,
      retention: access.retentionPeriod,
      processor: {
        userId: access.userId,
        role: access.userRole,
        department: access.department
      }
    };
    
    this.persistComplianceLog(log);
  }
  
  // データ主体の権利行使ログ
  logDataSubjectRequest(request) {
    const log = {
      timestamp: new Date().toISOString(),
      requestType: request.type, // access, rectification, erasure, portability
      dataSubjectId: request.subjectId,
      requestDetails: request.details,
      responseDeadline: this.calculateDeadline(request.type),
      status: 'pending',
      assignedTo: request.assignedTo
    };
    
    this.persistComplianceLog(log);
  }
}
```

---

## 10. インシデント対応要件

### 10.1 自動脅威検出

```javascript
class ThreatDetection {
  constructor() {
    this.thresholds = {
      loginFailures: 5,          // 5回の失敗で警告
      requestRate: 100,          // 100リクエスト/分で警告
      errorRate: 0.05,          // エラー率5%で警告
      responseTime: 2000        // 応答時間2秒で警告
    };
  }
  
  // リアルタイム脅威検出
  async detectThreats() {
    const threats = [];
    
    // ブルートフォース攻撃検出
    const loginFailures = await this.checkLoginFailures();
    if (loginFailures.count > this.thresholds.loginFailures) {
      threats.push({
        type: 'BRUTE_FORCE',
        severity: 'HIGH',
        details: loginFailures
      });
    }
    
    // DDoS攻撃検出
    const requestRate = await this.checkRequestRate();
    if (requestRate.rate > this.thresholds.requestRate) {
      threats.push({
        type: 'DDOS',
        severity: 'CRITICAL',
        details: requestRate
      });
    }
    
    // 異常なエラー率検出
    const errorRate = await this.checkErrorRate();
    if (errorRate.rate > this.thresholds.errorRate) {
      threats.push({
        type: 'ANOMALY',
        severity: 'MEDIUM',
        details: errorRate
      });
    }
    
    return threats;
  }
  
  // 自動対応アクション
  async respondToThreat(threat) {
    switch (threat.type) {
      case 'BRUTE_FORCE':
        await this.blockIP(threat.details.sourceIP);
        await this.enableCaptcha();
        break;
      
      case 'DDOS':
        await this.enableRateLimiting();
        await this.activateCDNProtection();
        break;
      
      case 'ANOMALY':
        await this.increaseLogging();
        await this.notifySecurityTeam(threat);
        break;
    }
  }
}
```

### 10.2 インシデントレスポンス手順

```javascript
class IncidentResponse {
  // インシデント対応フロー
  async handleIncident(incident) {
    const response = {
      incidentId: this.generateIncidentId(),
      detectedAt: new Date().toISOString(),
      type: incident.type,
      severity: incident.severity,
      status: 'detected',
      timeline: []
    };
    
    // 1. 検出と分類
    response.timeline.push({
      time: Date.now(),
      phase: 'detection',
      action: 'Incident detected and classified'
    });
    
    // 2. 封じ込め
    await this.containIncident(incident);
    response.timeline.push({
      time: Date.now(),
      phase: 'containment',
      action: 'Incident contained'
    });
    
    // 3. 根絶
    await this.eradicateThreat(incident);
    response.timeline.push({
      time: Date.now(),
      phase: 'eradication',
      action: 'Threat eradicated'
    });
    
    // 4. 復旧
    await this.recoverSystems(incident);
    response.timeline.push({
      time: Date.now(),
      phase: 'recovery',
      action: 'Systems recovered'
    });
    
    // 5. 事後分析
    await this.postIncidentAnalysis(incident);
    response.timeline.push({
      time: Date.now(),
      phase: 'lessons_learned',
      action: 'Post-incident analysis completed'
    });
    
    response.status = 'resolved';
    return response;
  }
}
```

---

## 11. セキュリティテスト要件

### 11.1 定期的セキュリティテスト

| テスト種別 | 頻度 | 範囲 | ツール |
|-----------|------|------|--------|
| **脆弱性スキャン** | 週次 | 全システム | OWASP ZAP |
| **ペネトレーションテスト** | 四半期 | 重要機能 | 専門業者 |
| **コード解析** | コミット毎 | 全コード | SonarQube |
| **依存関係チェック** | 日次 | npm packages | npm audit |

### 11.2 セキュリティテスト自動化

```javascript
// セキュリティテストスイート
describe('Security Tests', () => {
  // XSS脆弱性テスト
  describe('XSS Prevention', () => {
    it('should escape HTML in user input', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const output = SecurityValidator.escapeHtml(maliciousInput);
      expect(output).not.toContain('<script>');
      expect(output).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });
  });
  
  // CSRF対策テスト
  describe('CSRF Protection', () => {
    it('should validate CSRF token', async () => {
      const token = csrf.generateToken(sessionId);
      const isValid = csrf.validateToken(sessionId, token);
      expect(isValid).toBe(true);
    });
    
    it('should reject invalid CSRF token', async () => {
      const isValid = csrf.validateToken(sessionId, 'invalid-token');
      expect(isValid).toBe(false);
    });
  });
  
  // 入力検証テスト
  describe('Input Validation', () => {
    it('should validate answer format', () => {
      const validAnswer = { type: 'single', value: 3 };
      const result = InputValidator.validateAnswer(validAnswer);
      expect(result.valid).toBe(true);
    });
    
    it('should reject invalid answer', () => {
      const invalidAnswer = { type: 'single', value: 10 };
      const result = InputValidator.validateAnswer(invalidAnswer);
      expect(result.valid).toBe(false);
    });
  });
});
```

---

## 12. セキュリティ実装チェックリスト

### 12.1 開発フェーズ

- [ ] セキュアコーディング規約の遵守
- [ ] 入力検証の実装
- [ ] 出力エンコーディングの実装
- [ ] 認証・認可の実装
- [ ] セッション管理の実装
- [ ] エラーハンドリングの実装
- [ ] ログ記録の実装
- [ ] 暗号化の実装

### 12.2 テストフェーズ

- [ ] 静的コード解析の実施
- [ ] 動的セキュリティテストの実施
- [ ] ペネトレーションテストの実施
- [ ] 脆弱性診断の実施
- [ ] セキュリティレビューの実施

### 12.3 デプロイフェーズ

- [ ] セキュリティヘッダーの設定
- [ ] HTTPS の強制
- [ ] ファイアウォールの設定
- [ ] 監視・アラートの設定
- [ ] バックアップの設定
- [ ] インシデント対応手順の確認

---

## 13. 継続的改善

### 13.1 セキュリティメトリクス

```javascript
class SecurityMetrics {
  // 主要セキュリティ指標
  getKeyMetrics() {
    return {
      // 脆弱性指標
      vulnerabilities: {
        critical: this.countVulnerabilities('critical'),
        high: this.countVulnerabilities('high'),
        medium: this.countVulnerabilities('medium'),
        low: this.countVulnerabilities('low'),
        mttr: this.calculateMTTR() // 平均修復時間
      },
      
      // インシデント指標
      incidents: {
        total: this.countIncidents(),
        resolved: this.countResolvedIncidents(),
        averageResponseTime: this.calculateAverageResponseTime(),
        recurrence: this.calculateRecurrenceRate()
      },
      
      // コンプライアンス指標
      compliance: {
        policyAdherence: this.calculatePolicyAdherence(),
        auditFindings: this.countAuditFindings(),
        trainingCompletion: this.calculateTrainingCompletion()
      }
    };
  }
}
```

### 13.2 改善プロセス

1. **定期的評価**: 月次セキュリティレビュー
2. **脅威インテリジェンス**: 最新脅威情報の収集と対応
3. **教育・訓練**: 開発者向けセキュリティ研修
4. **ツール更新**: セキュリティツールの最新化
5. **プロセス改善**: インシデントからの学習と改善

---

## 14. 承認

| 役割 | 氏名 | 承認日 | 署名 |
|------|------|--------|------|
| セキュリティ責任者 | HAQEI Security Officer | 2025/08/05 | ✓ |
| 技術責任者 | HAQEI CTO Agent | - | - |
| 品質責任者 | HAQEI QA Tester Agent | - | - |
| プロジェクトマネージャー | - | - | - |

---

**文書管理:**
- **保存場所**: `/docs/requirements/20250805_REQ-011_SECURITY_REQUIREMENTS.md`
- **更新履歴**: v1.0 - 初版作成 (2025/08/05)
- **次回レビュー**: 2025/08/12（実装開始前）
- **配布先**: 開発チーム、セキュリティチーム、QAチーム、経営層

---

*本セキュリティ要件定義書は、HAQEIアナライザーを安全で信頼性の高いシステムとして運用するための包括的なセキュリティ基準を定めたものである。すべての開発者とステークホルダーは、これらの要件を遵守し、継続的なセキュリティ向上に努めなければならない。*