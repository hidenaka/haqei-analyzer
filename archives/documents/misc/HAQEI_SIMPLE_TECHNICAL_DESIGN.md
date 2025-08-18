# HAQEI統合戦略システム：シンプル技術設計書

## システム設計原則

### 設計哲学
1. **シンプル・イズ・ベスト**: 複雑性を排除し、保守性を最大化
2. **既存資産活用**: strategic-cockpit.html等の完成機能を基盤として継続
3. **段階的成長**: MVP→成長版→スケール版の自然な進化
4. **運用効率**: 一人運用を前提とした徹底的自動化

### 技術戦略
- **プロンプト駆動**: 事前定義プロンプト + LLM動的生成
- **API第一**: マイクロサービス指向の疎結合設計
- **クラウドネイティブ**: スケーラブルなサーバーレス構成
- **モニタリング**: 包括的な自動監視体制

## システムアーキテクチャ

### 全体構成図
```
🌐 Frontend Layer（継続使用）
├─ os_analyzer.html（既存）
├─ future_simulator.html（既存）  
├─ strategic-cockpit.html（既存・拡張）
└─ admin-dashboard.html（新規・簡易）

🔗 API Layer（新規・シンプル）
├─ /api/strategy-generate（戦略生成）
├─ /api/user-auth（認証）
├─ /api/usage-track（利用状況）
└─ /api/admin（管理）

🧠 LLM Integration（核心機能）
├─ プロンプトテンプレート管理
├─ Gemini/GPT/Claude統合
├─ 品質チェック・フォールバック
└─ レート制限・コスト管理

💾 Data Layer（最小構成）
├─ Supabase（ユーザー・利用履歴）
├─ Redis（キャッシュ・セッション）
└─ Local Storage（一時データ）

☁️ Infrastructure（段階的）
├─ Vercel（初期・MVP）
├─ AWS Lambda（成長期）
└─ Multi-Cloud（スケール期）
```

## 核心技術：プロンプト駆動戦略生成

### 1. マスタープロンプトテンプレート

#### 基本戦略生成プロンプト
```javascript
const HAQEI_MASTER_PROMPT = `
# HAQEI個人戦略コンサルタント

あなたは実践的な人生戦略アドバイザーです。bunenjin（分人）哲学に基づき、ユーザーの複数人格を統合した個別戦略を生成してください。

## 入力データ分析
### OS分析結果
- Engine OS: {engineOS}（創造・実行システム）
  - 特徴: {engineCharacteristics}
  - 強み: {engineStrengths}
  
- Interface OS: {interfaceOS}（社会・対人システム）
  - 特徴: {interfaceCharacteristics}
  - 強み: {interfaceStrengths}
  
- Safe Mode OS: {safeModeOS}（安全・継続システム）
  - 特徴: {safeModeCharacteristics}
  - 強み: {safeModeStrengths}

### 現在の状況・課題
{currentSituation}

### 未来への展望・不安
{futureWorries}

## 出力フォーマット

### 1. 📊 現状整理・人格統合分析
（150-200文字）
あなたの3つのOSの相互作用を分析し、現在の状況における内的な動機とニーズを整理します。

### 2. 🎯 戦略的アプローチ
（300-400文字）
Engine、Interface、Safe Modeの各OSを効果的に活用する具体的戦略を提示します。状況に応じたOS切り替えのタイミングと方法を含みます。

### 3. 📋 3段階行動計画
#### Phase 1（1-3ヶ月）：基盤構築
- 具体的アクション1: {短期行動1}
- 具体的アクション2: {短期行動2}

#### Phase 2（3-6ヶ月）：展開・実行
- 具体的アクション1: {中期行動1}
- 具体的アクション2: {中期行動2}

#### Phase 3（6-12ヶ月）：発展・最適化
- 具体的アクション1: {長期行動1}
- 具体的アクション2: {長期行動2}

### 4. ⚠️ リスク管理・注意点
（100-150文字）
各段階で注意すべきリスクと、Safe Mode OSを活用した回避・軽減策を提示します。

### 5. 📈 成功指標・振り返り
（100-150文字）
進歩を測定する具体的指標と、定期的な見直しのタイミング・観点を示します。

## 指示・制約
- 温かく寄り添う言葉を使用（上から目線禁止）
- 実践可能な具体的アドバイスに重点
- bunenjin哲学の多重性を肯定的に受容
- 「正解」でなく「その人に最適な道」を提示
- 総文字数: 800-1200文字
- 日本語での出力
`;
```

#### 品質保証プロンプト
```javascript
const QUALITY_CHECK_PROMPT = `
上記の戦略アドバイスを以下の観点で評価してください：

## 評価基準（各項目0-100点）
1. **個別性**: この人だけの戦略になっているか
2. **具体性**: 実際に実行可能な内容か
3. **バランス**: 3つのOSが適切に活用されているか
4. **共感性**: 温かく寄り添う表現か
5. **実用性**: 現実的で継続可能か

## 改善指示
- 80点未満の項目がある場合、具体的改善点を指摘
- より良いアドバイス案を提示
- 最終的に全項目85点以上を目指す

総合評価点が425点未満の場合、戦略を再生成してください。
`;
```

### 2. LLM統合システム

#### マルチLLMオーケストレーター
```javascript
class HAQEILLMOrchestrator {
  constructor() {
    this.providers = {
      primary: {
        name: 'gemini',
        model: 'gemini-1.5-flash',
        costPerToken: 0.000375,
        maxTokens: 8192,
        strengths: ['コスト効率', '日本語理解', '創造性']
      },
      
      fallback: {
        name: 'openai',
        model: 'gpt-4o-mini', 
        costPerToken: 0.00015,
        maxTokens: 16384,
        strengths: ['安定性', '論理的思考', '構造化']
      },
      
      premium: {
        name: 'claude',
        model: 'claude-3-5-sonnet',
        costPerToken: 0.003,
        maxTokens: 200000,
        strengths: ['深い洞察', '共感性', '長文処理']
      }
    };
    
    this.currentUsage = {
      monthly: 0,
      budget: 100000, // 月10万円予算
      threshold: 0.8   // 80%で制限
    };
  }

  async generateStrategy(userData, planType = 'basic') {
    const prompt = this.buildPrompt(userData);
    
    try {
      // プラン別プロバイダー選択
      const provider = this.selectProvider(planType);
      const strategy = await this.callLLM(provider, prompt);
      
      // 品質チェック
      const qualityScore = await this.checkQuality(strategy);
      
      if (qualityScore < 425) {
        // フォールバック: より高性能なLLMで再試行
        return await this.callLLM(this.providers.premium, prompt);
      }
      
      await this.trackUsage(provider, prompt, strategy);
      return strategy;
      
    } catch (error) {
      return await this.handleError(error, userData);
    }
  }

  selectProvider(planType) {
    switch (planType) {
      case 'free':
        return this.providers.primary;
      case 'basic':
        return this.providers.fallback;
      case 'pro':
        return this.providers.premium;
      default:
        return this.providers.primary;
    }
  }

  async callLLM(provider, prompt) {
    const response = await fetch(`/api/llm/${provider.name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        model: provider.model,
        maxTokens: provider.maxTokens,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`LLM API Error: ${response.status}`);
    }
    
    return await response.json();
  }

  buildPrompt(userData) {
    return HAQEI_MASTER_PROMPT
      .replace('{engineOS}', userData.tripleOS.engine.name)
      .replace('{engineCharacteristics}', userData.tripleOS.engine.characteristics)
      .replace('{engineStrengths}', userData.tripleOS.engine.strengths)
      .replace('{interfaceOS}', userData.tripleOS.interface.name)
      .replace('{interfaceCharacteristics}', userData.tripleOS.interface.characteristics)
      .replace('{interfaceStrengths}', userData.tripleOS.interface.strengths)
      .replace('{safeModeOS}', userData.tripleOS.safeMode.name)
      .replace('{safeModeCharacteristics}', userData.tripleOS.safeMode.characteristics)
      .replace('{safeModeStrengths}', userData.tripleOS.safeMode.strengths)
      .replace('{currentSituation}', userData.currentSituation.text)
      .replace('{futureWorries}', userData.futureWorries.text);
  }
}
```

## データベース設計（最小構成）

### 1. Supabase スキーマ

#### ユーザー管理
```sql
-- ユーザー基本情報
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- ユーザー利用状況
CREATE TABLE user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  month_year VARCHAR(7), -- 'YYYY-MM'
  strategy_generations INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_incurred DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_user_usage_month ON user_usage(user_id, month_year);
CREATE INDEX idx_users_plan ON users(plan_type);
```

#### 戦略履歴（簡易版）
```sql
-- 生成された戦略の保存
CREATE TABLE strategy_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  os_data JSONB NOT NULL,
  future_data JSONB NOT NULL,
  generated_strategy TEXT NOT NULL,
  llm_provider VARCHAR(20),
  quality_score INTEGER,
  user_rating INTEGER, -- 1-5星評価
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_strategy_history_user ON strategy_history(user_id, created_at);
CREATE INDEX idx_strategy_history_rating ON strategy_history(user_rating);
```

### 2. Redis キャッシュ設計

#### セッション管理
```javascript
const REDIS_SCHEMA = {
  // ユーザーセッション
  [`session:${userId}`]: {
    ttl: 1800, // 30分
    data: {
      plan: 'basic',
      usage: { monthly: 15, limit: 50 },
      preferences: { llm: 'gemini', language: 'ja' }
    }
  },
  
  // 戦略キャッシュ（同じ入力に対する結果）
  [`strategy:${hashInput}`]: {
    ttl: 3600, // 1時間
    data: {
      strategy: '生成された戦略テキスト',
      provider: 'gemini',
      timestamp: '2024-01-06T12:00:00Z'
    }
  },
  
  // LLM使用量追跡
  [`usage:${provider}:${monthYear}`]: {
    ttl: 2678400, // 31日
    data: {
      requests: 1240,
      tokens: 156000,
      cost: 58.5
    }
  }
};
```

## API設計

### RESTful エンドポイント

#### 認証・ユーザー管理
```javascript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
// Response: { "token": "jwt-token", "user": {...} }

// GET /api/user/profile
// Response: { "id": "uuid", "email": "...", "plan": "basic", "usage": {...} }

// PUT /api/user/plan
{
  "plan": "pro"
}
// Response: { "success": true, "new_plan": "pro" }
```

#### 戦略生成（核心API）
```javascript
// POST /api/strategy/generate
{
  "os_data": {
    "engine": { "name": "乾為天", "characteristics": "..." },
    "interface": { "name": "坤為地", "characteristics": "..." },
    "safeMode": { "name": "水雷屯", "characteristics": "..." }
  },
  "current_situation": "現在の悩みや課題...",
  "future_worries": "将来への不安や希望...",
  "options": {
    "format": "detailed", // simple/detailed/premium
    "language": "ja"
  }
}

// Response:
{
  "success": true,
  "strategy": {
    "current_analysis": "現状整理テキスト...",
    "strategic_approach": "戦略的アプローチ...",
    "action_plan": {
      "phase1": ["アクション1", "アクション2"],
      "phase2": ["アクション1", "アクション2"], 
      "phase3": ["アクション1", "アクション2"]
    },
    "risk_management": "リスク管理...",
    "success_metrics": "成功指標..."
  },
  "metadata": {
    "provider": "gemini",
    "quality_score": 456,
    "generation_time": 2.34,
    "cost": 0.002
  }
}
```

#### 履歴・分析
```javascript
// GET /api/strategy/history
// Response: [{ "id": "uuid", "date": "...", "summary": "...", "rating": 4 }]

// GET /api/strategy/history/:id
// Response: { "id": "uuid", "full_strategy": "...", "os_data": {...} }

// POST /api/strategy/rating
{
  "strategy_id": "uuid",
  "rating": 4,
  "feedback": "とても参考になった"
}
```

## フロントエンド設計

### 1. 既存HTML拡張

#### strategic-cockpit.html 改良版
```javascript
// 既存のStrategicDataIntegrator拡張
class SimpleStrategyIntegrator extends StrategicDataIntegrator {
  constructor() {
    super();
    this.llmOrchestrator = new HAQEILLMOrchestrator();
    this.userAuth = new UserAuth();
  }

  async generateAIStrategicAdvice() {
    // 既存のgenerateBasicStrategicAdvice()を置換
    
    if (!this.userAuth.isAuthenticated()) {
      this.showAuthDialog();
      return;
    }
    
    if (!this.userAuth.canGenerateStrategy()) {
      this.showUpgradeDialog();
      return;
    }
    
    const userData = this.prepareUserData();
    
    try {
      this.showLoading('AIが戦略を生成中...');
      
      const strategy = await this.llmOrchestrator.generateStrategy(
        userData,
        this.userAuth.getPlanType()
      );
      
      this.displayStrategy(strategy);
      this.saveToHistory(strategy);
      this.userAuth.incrementUsage();
      
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoading();
    }
  }

  displayStrategy(strategy) {
    const container = document.getElementById('ai-strategic-analysis');
    
    container.innerHTML = `
      <div class="strategy-result">
        <div class="strategy-section">
          <h3>📊 現状整理・人格統合分析</h3>
          <p>${strategy.current_analysis}</p>
        </div>
        
        <div class="strategy-section">
          <h3>🎯 戦略的アプローチ</h3>
          <p>${strategy.strategic_approach}</p>
        </div>
        
        <div class="strategy-section">
          <h3>📋 3段階行動計画</h3>
          <div class="action-phases">
            ${this.renderActionPhases(strategy.action_plan)}
          </div>
        </div>
        
        <div class="strategy-section">
          <h3>⚠️ リスク管理・注意点</h3>
          <p>${strategy.risk_management}</p>
        </div>
        
        <div class="strategy-section">
          <h3>📈 成功指標・振り返り</h3>
          <p>${strategy.success_metrics}</p>
        </div>
        
        <div class="strategy-actions">
          <button onclick="this.saveAsPDF()">📄 PDF保存</button>
          <button onclick="this.shareStrategy()">🔗 シェア</button>
          <button onclick="this.rateStrategy()">⭐ 評価</button>
        </div>
      </div>
    `;
  }
}
```

### 2. 認証システム統合

#### 軽量認証UI
```html
<!-- 認証ダイアログ（strategic-cockpit.htmlに追加） -->
<div id="auth-modal" class="modal hidden">
  <div class="modal-content">
    <h2>🔐 HAQEIアカウント</h2>
    
    <div class="auth-tabs">
      <button class="tab-btn active" onclick="showLogin()">ログイン</button>
      <button class="tab-btn" onclick="showSignup()">新規登録</button>
    </div>
    
    <form id="auth-form" onsubmit="handleAuth(event)">
      <input type="email" placeholder="メールアドレス" required>
      <input type="password" placeholder="パスワード" required>
      <button type="submit">開始する</button>
    </form>
    
    <div class="plan-info">
      <h3>💎 プラン比較</h3>
      <div class="plans">
        <div class="plan free">
          <h4>フリー</h4>
          <p>月3回まで</p>
        </div>
        <div class="plan basic">
          <h4>ベーシック ¥980/月</h4>
          <p>無制限利用</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

## インフラ構成（段階別）

### Stage 1: MVP（Vercel + Supabase）
```yaml
# vercel.json
{
  "functions": {
    "api/strategy/generate.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}

# api/strategy/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { os_data, current_situation, future_worries } = req.body;
    
    // Gemini API呼び出し
    const strategy = await generateWithGemini({
      os_data,
      current_situation,
      future_worries
    });
    
    // Supabaseに保存
    await saveStrategy(strategy);
    
    res.json({ success: true, strategy });
    
  } catch (error) {
    console.error('Strategy generation error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
}
```

### Stage 2: 成長期（AWS Lambda）
```yaml
# serverless.yml
service: haqei-api

provider:
  name: aws
  runtime: nodejs18.x
  stage: production
  environment:
    GEMINI_API_KEY: ${env:GEMINI_API_KEY}
    OPENAI_API_KEY: ${env:OPENAI_API_KEY}
    REDIS_URL: ${env:REDIS_URL}

functions:
  strategyGenerate:
    handler: handlers/strategy.generate
    timeout: 30
    memory: 512
    events:
      - http:
          path: strategy/generate
          method: post
          cors: true
          
  userAuth:
    handler: handlers/auth.authenticate
    events:
      - http:
          path: auth/{action}
          method: post
          cors: true
```

### Stage 3: スケール期（マルチクラウド）
```yaml
# Kubernetes deployment for high scale
apiVersion: apps/v1
kind: Deployment
metadata:
  name: haqei-api
spec:
  replicas: 10
  selector:
    matchLabels:
      app: haqei-api
  template:
    spec:
      containers:
      - name: api
        image: haqei/api:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: LLM_PROVIDER
          value: "multi"
        - name: REDIS_CLUSTER
          value: "redis-cluster:6379"
```

## 監視・運用

### 1. 自動監視システム

#### ヘルスチェック
```javascript
// api/health.js
export default async function handler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };
  
  try {
    // データベース接続確認
    health.services.database = await checkDatabase();
    
    // LLM API確認
    health.services.llm = await checkLLMAPIs();
    
    // Redis接続確認  
    health.services.cache = await checkRedis();
    
    // 全体ステータス判定
    const allHealthy = Object.values(health.services)
      .every(service => service.status === 'healthy');
    
    health.status = allHealthy ? 'healthy' : 'degraded';
    
    res.status(allHealthy ? 200 : 503).json(health);
    
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
    res.status(503).json(health);
  }
}
```

#### メトリクス収集
```javascript
// utils/metrics.js
class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      costs: 0,
      users: new Set()
    };
  }

  recordRequest(userId, duration, cost, error = null) {
    this.metrics.requests++;
    this.metrics.responseTime.push(duration);
    this.metrics.costs += cost;
    this.metrics.users.add(userId);
    
    if (error) {
      this.metrics.errors++;
      console.error('Request error:', error);
    }
    
    // 定期的にCloudWatchに送信
    if (this.metrics.requests % 100 === 0) {
      this.sendToCloudWatch();
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgResponseTime: this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length,
      errorRate: this.metrics.errors / this.metrics.requests,
      uniqueUsers: this.metrics.users.size
    };
  }
}
```

### 2. 自動アラート

#### Slack通知
```javascript
// utils/alerts.js
class AlertSystem {
  async sendAlert(level, message, data = {}) {
    const payload = {
      text: `🚨 HAQEI Alert [${level.toUpperCase()}]`,
      attachments: [{
        color: level === 'error' ? 'danger' : 'warning',
        fields: [
          { title: 'Message', value: message, short: false },
          { title: 'Timestamp', value: new Date().toISOString(), short: true },
          { title: 'Data', value: JSON.stringify(data, null, 2), short: false }
        ]
      }]
    };
    
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  async checkAndAlert() {
    const metrics = metricsCollector.getMetrics();
    
    // エラー率チェック
    if (metrics.errorRate > 0.05) {
      await this.sendAlert('error', 'High error rate detected', {
        errorRate: metrics.errorRate,
        requests: metrics.requests
      });
    }
    
    // レスポンス時間チェック
    if (metrics.avgResponseTime > 10000) {
      await this.sendAlert('warning', 'Slow response time', {
        avgResponseTime: metrics.avgResponseTime
      });
    }
    
    // コストチェック
    if (metrics.costs > 50000) { // 月5万円超過
      await this.sendAlert('warning', 'High LLM costs', {
        totalCost: metrics.costs
      });
    }
  }
}
```

## セキュリティ設計

### 1. 認証・認可
```javascript
// middleware/auth.js
export function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function checkPlanLimits(req, res, next) {
  const { user } = req;
  const usage = getUserUsage(user.id);
  
  const limits = {
    free: 3,
    basic: 100,
    pro: 1000
  };
  
  if (usage.monthly >= limits[user.plan]) {
    return res.status(429).json({ 
      error: 'Usage limit exceeded',
      upgrade_url: '/upgrade'
    });
  }
  
  next();
}
```

### 2. データ保護
```javascript
// utils/encryption.js
const crypto = require('crypto');

class DataProtection {
  encryptPII(data) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptPII(encryptedData) {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  sanitizeInput(input) {
    // XSS防止
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}
```

## 実装ロードマップ

### Week 1: MVP基盤
- [ ] プロンプトテンプレート設計・最適化
- [ ] Gemini API統合実装
- [ ] 既存strategic-cockpit.html改修
- [ ] 基本認証システム実装

### Week 2: 機能拡張
- [ ] ユーザー管理・プラン制限
- [ ] 戦略履歴機能
- [ ] 品質チェック・フォールバック
- [ ] 基本的な分析・レポート

### Week 3-4: 本格運用準備
- [ ] 監視・アラートシステム
- [ ] セキュリティ強化
- [ ] パフォーマンス最適化
- [ ] 本番環境デプロイ

この設計により、シンプルで保守しやすく、段階的に成長できる技術基盤を構築します。