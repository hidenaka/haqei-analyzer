# HaQei アナライザー API リファレンス

**Version**: 1.0.0  
**Last Updated**: 2025年8月3日  
**Base URL**: `https://api.haqei-analyzer.com`

---

## 📋 概要

HaQei アナライザーは、易経（I Ching）の知恵とHaQei哲学を組み合わせた戦略分析システムです。このAPIドキュメントでは、すべての利用可能なエンドポイントとその使用方法を説明します。

### 🔑 認証

すべてのAPIエンドポイントはSupabaseを使用したJWT認証が必要です。

```bash
Authorization: Bearer <your-jwt-token>
```

### 📡 ベースレスポンス形式

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    version: string
    requestId: string
  }
}
```

---

## 🧠 分析エンドポイント

### POST /api/analysis/quick
クイック分析を実行します。

**Request Body:**
```typescript
interface QuickAnalysisRequest {
  answers: Array<{
    questionId: string
    value: number
    confidence?: number
  }>
  options?: {
    includeHexagram?: boolean
    language?: 'ja' | 'en'
  }
}
```

**Response:**
```typescript
interface QuickAnalysisResponse {
  analysisId: string
  result: {
    primaryTendency: string
    secondaryTendency: string
    confidence: number
    hexagram?: {
      number: number
      name: string
      description: string
    }
  }
  insights: string[]
  recommendations: string[]
  timestamp: string
}
```

**Example:**
```bash
curl -X POST https://api.haqei-analyzer.com/api/analysis/quick \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "q1", "value": 7, "confidence": 0.8},
      {"questionId": "q2", "value": 4, "confidence": 0.9}
    ],
    "options": {
      "includeHexagram": true,
      "language": "ja"
    }
  }'
```

---

### POST /api/analysis/comprehensive
包括的分析を実行します。

**Request Body:**
```typescript
interface ComprehensiveAnalysisRequest {
  personalityData: {
    engineOS: OSProfile
    interfaceOS: OSProfile
    safeMode: SafeModeProfile
  }
  contextData?: {
    currentSituation: string
    goals: string[]
    challenges: string[]
  }
  options?: {
    includeTimeline?: boolean
    includePredictions?: boolean
    language?: 'ja' | 'en'
  }
}
```

**Response:**
```typescript
interface ComprehensiveAnalysisResponse {
  analysisId: string
  tripleOSAnalysis: {
    engineOS: OSAnalysisResult
    interfaceOS: OSAnalysisResult
    safeMode: SafeModeAnalysisResult
    integration: IntegrationResult
  }
  strategicInsights: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  timeline?: TimelineEvent[]
  predictions?: PredictionResult[]
}
```

---

### GET /api/analysis/{analysisId}
分析結果を取得します。

**Parameters:**
- `analysisId` (string): 分析ID

**Response:**
```typescript
interface AnalysisResult {
  id: string
  type: 'quick' | 'comprehensive'
  status: 'pending' | 'completed' | 'failed'
  result?: QuickAnalysisResponse | ComprehensiveAnalysisResponse
  createdAt: string
  completedAt?: string
}
```

---

### GET /api/analysis/history
ユーザーの分析履歴を取得します。

**Query Parameters:**
- `limit` (number, optional): 取得件数 (default: 20, max: 100)
- `offset` (number, optional): オフセット (default: 0)
- `type` (string, optional): 分析タイプフィルター ('quick' | 'comprehensive')

**Response:**
```typescript
interface AnalysisHistoryResponse {
  analyses: AnalysisResult[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}
```

---

## 🔮 易経（I Ching）エンドポイント

### GET /api/iching/hexagrams
全64卦の一覧を取得します。

**Query Parameters:**
- `language` (string, optional): 言語設定 ('ja' | 'en', default: 'ja')

**Response:**
```typescript
interface HexagramsResponse {
  hexagrams: Array<{
    number: number
    name: string
    chineseName: string
    upperTrigram: string
    lowerTrigram: string
    description: string
    keywords: string[]
  }>
}
```

---

### GET /api/iching/hexagrams/{number}
特定の卦の詳細情報を取得します。

**Parameters:**
- `number` (number): 卦番号 (1-64)

**Response:**
```typescript
interface HexagramDetailResponse {
  hexagram: {
    number: number
    name: string
    chineseName: string
    upperTrigram: TrigramInfo
    lowerTrigram: TrigramInfo
    lines: LineInfo[]
    interpretation: {
      general: string
      love: string
      career: string
      health: string
      advice: string
    }
    relatedHexagrams: number[]
  }
}
```

---

### POST /api/iching/divine
卦占いを実行します。

**Request Body:**
```typescript
interface DivinationRequest {
  question?: string
  method?: 'coins' | 'yarrow' | 'random'
  context?: {
    situation: string
    focus: string
  }
}
```

**Response:**
```typescript
interface DivinationResponse {
  primaryHexagram: HexagramInfo
  changingLines?: number[]
  resultingHexagram?: HexagramInfo
  interpretation: {
    situation: string
    action: string
    outcome: string
    advice: string
  }
  timestamp: string
}
```

---

## 👤 ユーザープロファイル

### GET /api/user/profile
ユーザープロファイルを取得します。

**Response:**
```typescript
interface UserProfileResponse {
  user: {
    id: string
    email: string
    name?: string
    avatar?: string
    preferences: {
      language: 'ja' | 'en'
      timezone: string
      notifications: NotificationSettings
    }
    subscription?: {
      plan: 'free' | 'premium' | 'enterprise'
      status: 'active' | 'cancelled' | 'expired'
      expiresAt?: string
    }
  }
  stats: {
    totalAnalyses: number
    lastAnalysisAt?: string
    favoriteHexagrams: number[]
  }
}
```

---

### PUT /api/user/profile
ユーザープロファイルを更新します。

**Request Body:**
```typescript
interface UpdateProfileRequest {
  name?: string
  preferences?: {
    language?: 'ja' | 'en'
    timezone?: string
    notifications?: NotificationSettings
  }
}
```

---

### GET /api/user/insights
パーソナライズされたインサイトを取得します。

**Response:**
```typescript
interface UserInsightsResponse {
  insights: Array<{
    type: 'pattern' | 'recommendation' | 'warning'
    title: string
    description: string
    confidence: number
    actionable: boolean
    relatedAnalyses?: string[]
  }>
  trends: {
    personalityTrends: TrendData[]
    decisionPatterns: PatternData[]
    progressMetrics: MetricData[]
  }
}
```

---

## 📊 データ同期

### POST /api/sync/upload
オフラインデータをアップロードします。

**Request Body:**
```typescript
interface SyncUploadRequest {
  data: {
    analyses: OfflineAnalysis[]
    preferences: UserPreferences
    lastSyncAt: string
  }
  clientVersion: string
  conflicts?: ConflictResolution[]
}
```

---

### GET /api/sync/download
サーバーデータをダウンロードします。

**Query Parameters:**
- `lastSyncAt` (string, optional): 最終同期時刻（ISO 8601形式）

**Response:**
```typescript
interface SyncDownloadResponse {
  data: {
    analyses: Analysis[]
    preferences: UserPreferences
    deletedItems: string[]
  }
  serverVersion: string
  conflicts?: ConflictData[]
}
```

---

## 🔒 管理者エンドポイント

### GET /api/admin/analytics
システム分析データを取得します。

**Query Parameters:**
- `period` (string): 期間 ('day' | 'week' | 'month' | 'year')
- `startDate` (string, optional): 開始日
- `endDate` (string, optional): 終了日

**Response:**
```typescript
interface AdminAnalyticsResponse {
  usage: {
    totalUsers: number
    activeUsers: number
    totalAnalyses: number
    apiCalls: number
  }
  performance: {
    averageResponseTime: number
    errorRate: number
    uptime: number
  }
  trends: {
    userGrowth: number[]
    usagePattern: UsageData[]
  }
}
```

---

## 🚨 エラーハンドリング

### エラーコード一覧

| コード | 説明 | HTTPステータス |
|--------|------|----------------|
| `AUTH_REQUIRED` | 認証が必要 | 401 |
| `FORBIDDEN` | アクセス禁止 | 403 |
| `NOT_FOUND` | リソース未発見 | 404 |
| `VALIDATION_ERROR` | リクエスト検証エラー | 400 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `INTERNAL_ERROR` | 内部サーバーエラー | 500 |
| `SERVICE_UNAVAILABLE` | サービス利用不可 | 503 |

### エラーレスポンス例

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "リクエストデータが不正です",
    "details": {
      "field": "answers",
      "reason": "必須フィールドが不足しています"
    }
  },
  "meta": {
    "timestamp": "2025-08-03T12:00:00Z",
    "version": "1.0.0",
    "requestId": "req_123456789"
  }
}
```

---

## 📈 レート制限

| エンドポイント | 制限 | 期間 |
|---------------|------|------|
| `/api/analysis/*` | 10回 | 1分 |
| `/api/iching/*` | 100回 | 1時間 |
| `/api/user/*` | 60回 | 1分 |
| `/api/sync/*` | 5回 | 1分 |

レート制限に達した場合、`429 Too Many Requests`が返されます。

---

## 🔗 Webhooks

システムイベントに対するWebhookを設定できます。

### サポートイベント

- `analysis.completed` - 分析完了時
- `user.subscribed` - ユーザー登録時
- `sync.conflict` - 同期競合発生時

### Webhook形式

```typescript
interface WebhookPayload {
  event: string
  timestamp: string
  data: any
  signature: string // HMAC-SHA256署名
}
```

---

## 📚 SDK・ライブラリ

### JavaScript/TypeScript SDK

```bash
npm install @haqei/analyzer-sdk
```

```typescript
import { HaQeiClient } from '@haqei/analyzer-sdk'

const client = new HaQeiClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.haqei-analyzer.com'
})

// クイック分析実行
const result = await client.analysis.quick({
  answers: [
    { questionId: 'q1', value: 7 }
  ]
})
```

### Python SDK

```bash
pip install haqei-analyzer-python
```

```python
from haqei_analyzer import HaQeiClient

client = HaQeiClient(api_key='your-api-key')

# 包括的分析実行
result = client.analysis.comprehensive({
    'personalityData': {
        'engineOS': engine_profile,
        'interfaceOS': interface_profile
    }
})
```

---

## 📞 サポート

- **技術サポート**: dev@haqei-analyzer.com
- **API問い合わせ**: api@haqei-analyzer.com
- **ドキュメント**: https://docs.haqei-analyzer.com
- **ステータスページ**: https://status.haqei-analyzer.com

---

## 📄 ライセンス

このAPIは[MIT License](LICENSE)の下で提供されています。

---

**更新履歴**:
- v1.0.0 (2025-08-03): 初版リリース
- 国際化対応完了
- セキュリティヘッダー強化
- オフライン同期機能追加

*このドキュメントは自動生成されており、常に最新の状態に保たれています。*