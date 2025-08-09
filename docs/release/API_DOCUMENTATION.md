# HAQEI API 仕様書

## API 概要

HAQEI システムは Supabase をバックエンドとした RESTful API と リアルタイム API を提供します。

## 認証・セキュリティ

### 認証システム
```typescript
// JWT Token Based Authentication
Authorization: Bearer <jwt_token>

// Row Level Security (RLS) 適用
// ユーザーは自分のデータのみアクセス可能
```

### セキュリティポリシー
- **すべてのAPIエンドポイント** JWT認証必須
- **Row Level Security** データベースレベルでアクセス制御
- **HTTPS必須** 全通信暗号化
- **Rate Limiting** API呼び出し制限

## 分析結果 API

### 分析結果作成

```http
POST /rest/v1/analysis_results
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "session_id": "string",
  "analysis_data": {
    "triple_os": {
      "engine": { "score": 85, "characteristics": [...] },
      "interface": { "score": 78, "characteristics": [...] },
      "safe_mode": { "score": 92, "characteristics": [...] }
    },
    "hexagram": {
      "primary": 23,
      "changing_lines": [2, 4],
      "resulting": 45,
      "interpretation": "..."
    },
    "future_simulation": {
      "scenarios": [...],
      "probability": 0.89,
      "recommendations": [...]
    }
  },
  "triple_os_data": {
    "detailed_scores": {...},
    "dimension_analysis": {...},
    "relationships": {...}
  },
  "hexagram_data": {
    "yao_analysis": [...],
    "seasonal_context": "...",
    "cultural_interpretation": "..."
  }
}
```

**レスポンス**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "uuid",
  "user_id": "uuid", 
  "session_id": "string",
  "analysis_data": {...},
  "triple_os_data": {...},
  "hexagram_data": {...},
  "created_at": "2025-08-03T12:00:00Z",
  "updated_at": "2025-08-03T12:00:00Z"
}
```

### 分析結果取得

```http
GET /rest/v1/analysis_results?select=*&user_id=eq.{user_id}
Authorization: Bearer <jwt_token>
```

**レスポンス**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "string", 
    "analysis_data": {...},
    "triple_os_data": {...},
    "hexagram_data": {...},
    "created_at": "2025-08-03T12:00:00Z",
    "updated_at": "2025-08-03T12:00:00Z"
  }
]
```

### 単一分析結果取得

```http
GET /rest/v1/analysis_results?select=*&id=eq.{analysis_id}
Authorization: Bearer <jwt_token>
```

### 分析結果更新

```http
PATCH /rest/v1/analysis_results?id=eq.{analysis_id}
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "analysis_data": {...},
  "triple_os_data": {...},
  "updated_at": "2025-08-03T12:30:00Z"
}
```

### 分析結果削除

```http
DELETE /rest/v1/analysis_results?id=eq.{analysis_id}
Authorization: Bearer <jwt_token>
```

## 診断履歴 API

### 診断履歴作成

```http
POST /rest/v1/diagnosis_history
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "diagnosis_type": "triple_os_analysis",
  "result_data": {
    "answers": [...],
    "analysis_result": {...},
    "completion_time": 1250,
    "accuracy_score": 0.94
  },
  "metadata": {
    "version": "1.0.0",
    "platform": "web",
    "user_agent": "...",
    "session_duration": 1250
  }
}
```

### 診断履歴取得

```http
GET /rest/v1/diagnosis_history?select=*&user_id=eq.{user_id}&order=created_at.desc&limit=20
Authorization: Bearer <jwt_token>
```

## ユーザープロファイル API

### プロファイル取得

```http
GET /rest/v1/user_profiles?select=*&id=eq.{user_id}
Authorization: Bearer <jwt_token>
```

**レスポンス**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "uuid",
  "email": "user@example.com",
  "preferences": {
    "language": "ja",
    "theme": "eastern",
    "privacy_level": "maximum",
    "notifications": {
      "email": false,
      "push": false,
      "in_app": true
    }
  },
  "privacy_settings": {
    "data_sharing": false,
    "analytics": false,
    "cookies": "essential_only",
    "export_format": "json"
  },
  "last_login": "2025-08-03T12:00:00Z"
}
```

### プロファイル更新

```http
PATCH /rest/v1/user_profiles?id=eq.{user_id}
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "preferences": {
    "language": "en",
    "theme": "modern",
    "privacy_level": "high"
  },
  "privacy_settings": {
    "data_sharing": false,
    "analytics": false
  }
}
```

## リアルタイム API

### 分析結果リアルタイム購読

```typescript
// Supabase Realtime API
const supabase = createClient(supabaseUrl, supabaseKey)

// 分析結果変更購読
const subscription = supabase
  .channel('analysis-results')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'analysis_results',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Analysis result updated:', payload)
      // UI更新処理
    }
  )
  .subscribe()

// 購読解除
subscription.unsubscribe()
```

### 診断進捗リアルタイム通知

```typescript
// 診断進捗の購読
const progressSubscription = supabase
  .channel(`diagnosis-progress-${sessionId}`)
  .on('broadcast', { event: 'progress' }, (payload) => {
    console.log('Progress update:', payload.progress)
  })
  .subscribe()

// 進捗送信
supabase.channel(`diagnosis-progress-${sessionId}`)
  .send({
    type: 'broadcast',
    event: 'progress',
    progress: { step: 5, total: 20, percentage: 25 }
  })
```

## エラーハンドリング

### エラーレスポンス形式

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "invalid_request",
    "message": "Required field 'session_id' is missing",
    "details": {
      "field": "session_id",
      "expected": "string",
      "received": "undefined"
    }
  }
}
```

### 一般的なエラーコード

| HTTPステータス | エラーコード | 説明 |
|---------------|-------------|------|
| 400 | invalid_request | リクエスト形式不正 |
| 401 | unauthorized | 認証失敗 |
| 403 | forbidden | アクセス権限なし |
| 404 | not_found | リソース未発見 |
| 409 | conflict | データ競合 |
| 422 | validation_error | バリデーションエラー |
| 429 | rate_limit_exceeded | レート制限超過 |
| 500 | internal_error | サーバー内部エラー |

## API制限・配慮事項

### レート制限
- **読み取り**: 1000 requests/hour/user
- **書き込み**: 100 requests/hour/user  
- **リアルタイム**: 50 connections/user

### データサイズ制限
- **単一リクエスト**: 最大 10MB
- **分析データ**: 最大 5MB
- **添付ファイル**: 最大 20MB

### バージョニング
- **APIバージョン**: v1（現在）
- **後方互換性**: 最低6ヶ月保証
- **廃止予告**: 最低3ヶ月前通知

## TypeScript 型定義

```typescript
// 分析結果型定義
interface AnalysisResult {
  id: string
  user_id: string
  session_id: string
  analysis_data: {
    triple_os: TripleOSResult
    hexagram: HexagramResult
    future_simulation: FutureSimulationResult
  }
  triple_os_data: TripleOSDetailedData
  hexagram_data: HexagramDetailedData
  created_at: string
  updated_at: string
}

interface TripleOSResult {
  engine: { score: number; characteristics: string[] }
  interface: { score: number; characteristics: string[] }
  safe_mode: { score: number; characteristics: string[] }
}

interface HexagramResult {
  primary: number
  changing_lines: number[]
  resulting: number
  interpretation: string
}

interface FutureSimulationResult {
  scenarios: Scenario[]
  probability: number
  recommendations: string[]
}

// 診断履歴型定義
interface DiagnosisHistory {
  id: string
  user_id: string
  diagnosis_type: string
  result_data: {
    answers: Answer[]
    analysis_result: any
    completion_time: number
    accuracy_score: number
  }
  metadata: {
    version: string
    platform: string
    user_agent: string
    session_duration: number
  }
  created_at: string
}

// ユーザープロファイル型定義
interface UserProfile {
  id: string
  email: string
  preferences: {
    language: string
    theme: string
    privacy_level: string
    notifications: {
      email: boolean
      push: boolean
      in_app: boolean
    }
  }
  privacy_settings: {
    data_sharing: boolean
    analytics: boolean
    cookies: string
    export_format: string
  }
  last_login: string
}
```

## SDK・クライアントライブラリ

### JavaScript/TypeScript SDK

```typescript
import { createHAQEIClient } from '@haqei/client'

const client = createHAQEIClient({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY,
})

// 分析結果作成
const result = await client.analysis.create({
  sessionId: 'session-123',
  analysisData: {...},
  tripleOSData: {...},
  hexagramData: {...}
})

// 分析結果取得
const results = await client.analysis.list({
  userId: 'user-123',
  limit: 10,
  orderBy: 'created_at',
  order: 'desc'
})

// リアルタイム購読
client.realtime.subscribe('analysis-results', (update) => {
  console.log('Real-time update:', update)
})
```

---

**API責任者**: API開発チーム  
**最終更新**: 2025-08-03  
**APIバージョン**: v1.0.0  
**Base URL**: https://your-project.supabase.co