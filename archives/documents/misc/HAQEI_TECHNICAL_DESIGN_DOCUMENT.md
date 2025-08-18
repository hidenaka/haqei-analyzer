# HAQEI統合戦略システム：技術設計書

## システムアーキテクチャ概要

### アーキテクチャ方針
- **マイクロサービス指向**: 機能別分離による可用性・拡張性確保
- **既存実装活用**: strategic-cockpit.html等の完成機能を基盤として利用
- **単独運用最適化**: 一人運用に特化した自動化・エージェント連携
- **1,572,864パターン対応**: 超大規模データ処理の効率化

### 全体アーキテクチャ図
```
🌐 Frontend Layer
├─ os_analyzer.html (既存)
├─ future_simulator.html (既存)  
├─ strategic-cockpit.html (既存完成)
└─ 管理画面 (新規)

🔗 API Gateway Layer
├─ 認証・認可
├─ レート制限
├─ ログ記録
└─ ルーティング

⚙️ Microservices Layer  
├─ OS分析サービス (既存API化)
├─ Future分析サービス (既存API化)
├─ 戦略統合サービス (新規)
├─ LLM統合サービス (新規)
└─ ユーザー管理サービス (新規)

💾 Data Layer
├─ PostgreSQL (メインDB)
├─ Redis (キャッシュ・セッション)
├─ S3 (静的ファイル・バックアップ)
└─ ElasticSearch (ログ・分析)

☁️ Infrastructure Layer
├─ AWS ECS (コンテナオーケストレーション)
├─ AWS RDS (データベース)
├─ AWS ElastiCache (Redis)
└─ AWS CloudFront (CDN)
```

## データベース設計

### 1. メインデータベース（PostgreSQL）

#### ユーザー管理テーブル
```sql
-- ユーザー基本情報
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- ユーザープロファイル
CREATE TABLE user_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    display_name VARCHAR(100),
    age_range VARCHAR(20),
    occupation VARCHAR(100),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### OS分析データテーブル
```sql
-- OS分析結果
CREATE TABLE os_analyses (
    analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    selected_answers JSONB NOT NULL,
    engine_os JSONB NOT NULL,
    interface_os JSONB NOT NULL,
    safemode_os JSONB NOT NULL,
    analysis_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OS分析インデックス
CREATE INDEX idx_os_analyses_user_id ON os_analyses(user_id);
CREATE INDEX idx_os_analyses_created_at ON os_analyses(created_at);
```

#### Future分析データテーブル
```sql
-- Future分析結果
CREATE TABLE future_simulations (
    simulation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    input_text TEXT NOT NULL,
    current_situation JSONB NOT NULL,
    eight_scenarios JSONB NOT NULL,
    analysis_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Future分析インデックス
CREATE INDEX idx_future_simulations_user_id ON future_simulations(user_id);
CREATE INDEX idx_future_simulations_created_at ON future_simulations(created_at);
```

#### 戦略統合テーブル
```sql
-- 統合戦略結果
CREATE TABLE integrated_strategies (
    strategy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    os_analysis_id UUID REFERENCES os_analyses(analysis_id),
    future_simulation_id UUID REFERENCES future_simulations(simulation_id),
    strategy_pattern_id VARCHAR(50) NOT NULL, -- "8-8-8-64-6-8" format
    selected_scenario INTEGER NOT NULL,
    strategy_content JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 戦略インデックス（1,572,864パターン対応）
CREATE INDEX idx_integrated_strategies_pattern_id ON integrated_strategies(strategy_pattern_id);
CREATE INDEX idx_integrated_strategies_user_id ON integrated_strategies(user_id);
```

### 2. 1,572,864パターン効率管理

#### 戦略パターンマスターテーブル
```sql  
-- 戦略パターンマスター（事前生成）
CREATE TABLE strategy_patterns (
    pattern_id VARCHAR(50) PRIMARY KEY, -- "E-I-S-H-Y-Sc" format
    engine_os_index INTEGER NOT NULL,
    interface_os_index INTEGER NOT NULL,
    safemode_os_index INTEGER NOT NULL,
    hexagram_index INTEGER NOT NULL,
    yao_index INTEGER NOT NULL,
    scenario_index INTEGER NOT NULL,
    base_strategy JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- パターン効率検索用インデックス
CREATE INDEX idx_strategy_patterns_composite ON strategy_patterns(
    engine_os_index, interface_os_index, safemode_os_index, 
    hexagram_index, yao_index, scenario_index
);
```

### 3. キャッシュ設計（Redis）

#### キャッシュ戦略
```yaml
# Redis設計
cache_layers:
  hot_patterns:    # 頻出1,000パターン
    ttl: 86400     # 24時間
    memory: 100MB
    
  warm_patterns:   # 中頻度10,000パターン  
    ttl: 3600      # 1時間
    memory: 500MB
    
  user_sessions:   # ユーザーセッション
    ttl: 1800      # 30分
    memory: 50MB
    
  llm_responses:   # LLM応答キャッシュ
    ttl: 3600      # 1時間  
    memory: 200MB
```

## API設計

### 1. RESTful API仕様

#### 認証API
```yaml
POST /api/auth/login
  request:
    email: string
    password: string
  response:
    token: string (JWT)
    user: object
    expires_in: number

POST /api/auth/refresh
  headers:
    Authorization: Bearer <token>
  response:
    token: string
    expires_in: number
```

#### OS分析API
```yaml
POST /api/os-analysis
  headers:
    Authorization: Bearer <token>
  request:
    answers: object[]
  response:
    analysis_id: string
    triple_os:
      engine_os: object
      interface_os: object  
      safemode_os: object
    created_at: string

GET /api/os-analysis/{analysis_id}
  headers:
    Authorization: Bearer <token>
  response:
    analysis_id: string
    triple_os: object
    created_at: string
```

#### Future分析API
```yaml
POST /api/future-simulation
  headers:
    Authorization: Bearer <token>
  request:
    input_text: string
  response:
    simulation_id: string
    current_situation:
      hexagram: number
      yao: number
      interpretation: string
    eight_scenarios: object[]
    created_at: string
```

#### 戦略統合API（新規実装）
```yaml
POST /api/strategic-integration
  headers:
    Authorization: Bearer <token>
  request:
    os_analysis_id: string
    future_simulation_id: string
    selected_scenario: number
  response:
    strategy_id: string
    pattern_id: string
    strategy_content:
      main_advice: string
      action_plan: object[]
      risk_assessment: object[]
      timeline: object[]
    generated_at: string
```

#### LLM統合API（新規実装）
```yaml
POST /api/llm/strategic-advice
  headers:
    Authorization: Bearer <token>
  request:
    strategy_context:
      triple_os: object
      current_situation: object
      scenario: object
  response:
    advice_id: string
    enhanced_strategy:
      personalized_advice: string
      detailed_action_plan: object[]
      risk_mitigation: object[]
    llm_provider: string
    confidence_score: number
    generated_at: string
```

### 2. GraphQL API（管理用）

#### スキーマ定義
```graphql
type User {
  id: ID!
  email: String!
  subscriptionType: SubscriptionType!
  profile: UserProfile
  osAnalyses: [OSAnalysis!]!
  futureSimulations: [FutureSimulation!]!
  strategies: [IntegratedStrategy!]!
}

type OSAnalysis {
  id: ID!
  user: User!
  selectedAnswers: JSON!
  tripleOS: TripleOS!
  createdAt: DateTime!
}

type IntegratedStrategy {
  id: ID!
  user: User!
  osAnalysis: OSAnalysis!
  futureSimulation: FutureSimulation!
  patternId: String!
  strategyContent: JSON!
  generatedAt: DateTime!
}

type Query {
  users(limit: Int, offset: Int): [User!]!
  strategies(userId: ID, limit: Int): [IntegratedStrategy!]!
  systemMetrics: SystemMetrics!
}
```

## フロントエンド技術設計

### 1. 既存実装の活用
```
📁 既存ファイル構成（活用）
├─ dist/os_analyzer.html          # OS分析UI（完成）
├─ dist/future_simulator.html     # Future分析UI（完成）
├─ dist/strategic-cockpit.html    # 戦略統合UI（完成）
├─ dist/js/future-simulator-core.js  # Future分析コア（完成）
└─ dist/assets/H384H64database.js    # 易経データベース（完成）
```

### 2. 新規追加コンポーネント
```javascript
// 管理画面用React Components（新規）
components/
├─ Dashboard/
│   ├─ UserMetrics.jsx
│   ├─ RevenueChart.jsx
│   └─ SystemHealth.jsx
├─ UserManagement/
│   ├─ UserList.jsx
│   ├─ UserDetail.jsx
│   └─ SubscriptionManager.jsx
└─ Analytics/
    ├─ StrategyAnalytics.jsx
    ├─ UsagePatterns.jsx
    └─ PerformanceMetrics.jsx
```

### 3. 状態管理設計
```javascript
// Redux Store設計
const store = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  osAnalysis: {
    currentAnalysis: null,
    history: []
  },
  futureSimulation: {
    currentSimulation: null, 
    history: []
  },
  strategies: {
    currentStrategy: null,
    recommendations: [],
    history: []
  },
  ui: {
    loading: false,
    error: null,
    notifications: []
  }
};
```

## バックエンド技術設計

### 1. マイクロサービス構成

#### OS分析サービス
```python
# FastAPI実装例
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI(title="OS Analysis Service")

class OSAnalysisRequest(BaseModel):
    answers: dict
    user_id: str

class TripleOS(BaseModel):
    engine_os: dict
    interface_os: dict
    safemode_os: dict

@app.post("/analyze", response_model=TripleOS)
async def analyze_os(
    request: OSAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    # 既存のOS分析ロジックをサービス化
    analyzer = OSAnalyzer()
    triple_os = await analyzer.analyze(request.answers)
    
    # データベース保存
    await save_os_analysis(request.user_id, request.answers, triple_os)
    
    return triple_os
```

#### LLM統合サービス
```python
# LLM統合サービス
from typing import List
import asyncio

class LLMOrchestrator:
    def __init__(self):
        self.providers = {
            'deepseek': DeepSeekProvider(),
            'llama': LlamaProvider(),
            'gemini': GeminiProvider(),
            'cyberagent': CyberAgentProvider()
        }
        
    async def generate_strategy_advice(
        self, 
        strategy_context: dict
    ) -> dict:
        # プライマリプロバイダーで試行（低コスト）
        try:
            result = await self.providers['deepseek'].generate(strategy_context)
            if self._validate_quality(result):
                return result
        except Exception as e:
            logger.warning(f"Primary LLM failed: {e}")
        
        # フォールバック（高品質）
        return await self.providers['gemini'].generate(strategy_context)
    
    def _validate_quality(self, result: dict) -> bool:
        # 品質チェックロジック
        return len(result.get('advice', '')) > 100
```

### 2. データ処理最適化

#### 1,572,864パターン効率処理
```python
class StrategyPatternCache:
    def __init__(self):
        self.redis_client = redis.Redis()
        self.db_pool = create_db_pool()
        
    async def get_strategy(
        self, 
        engine_os: int, 
        interface_os: int,
        safemode_os: int, 
        hexagram: int, 
        yao: int, 
        scenario: int
    ) -> dict:
        # パターンID生成
        pattern_id = f"{engine_os}-{interface_os}-{safemode_os}-{hexagram}-{yao}-{scenario}"
        
        # キャッシュ確認（O(1)）
        cached = await self.redis_client.get(f"strategy:{pattern_id}")
        if cached:
            return json.loads(cached)
        
        # データベースから取得（インデックス最適化済み）
        strategy = await self._fetch_from_db(pattern_id)
        
        # キャッシュに保存
        await self.redis_client.setex(
            f"strategy:{pattern_id}", 
            3600, 
            json.dumps(strategy)
        )
        
        return strategy
```

## インフラ設計

### 1. AWS構成

#### ECS/Fargate構成
```yaml
# docker-compose.yml（開発用）
version: '3.8'
services:
  os-analysis:
    build: ./services/os-analysis
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      
  future-simulation:
    build: ./services/future-simulation  
    ports:
      - "8002:8000"
      
  strategy-integration:
    build: ./services/strategy-integration
    ports:
      - "8003:8000"
      
  llm-orchestrator:
    build: ./services/llm-orchestrator
    ports:
      - "8004:8000"
    environment:
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

#### インフラ自動化（Terraform）
```hcl
# main.tf
resource "aws_ecs_cluster" "haqei_cluster" {
  name = "haqei-production"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_rds_instance" "main_db" {
  identifier = "haqei-postgres"
  engine     = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.medium"
  
  allocated_storage = 100
  max_allocated_storage = 1000
  
  db_name  = "haqei"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 7
  backup_window = "03:00-04:00"
  maintenance_window = "Sun:04:00-Sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "haqei-final-snapshot"
}
```

### 2. 監視・ログ設計

#### CloudWatch設定
```yaml
metrics:
  custom_metrics:
    - strategy_generation_duration
    - llm_api_response_time
    - cache_hit_ratio
    - active_user_count
    
alerts:
  - name: high_error_rate
    condition: error_rate > 1%
    action: sns_notification
    
  - name: slow_response
    condition: response_time > 3s
    action: auto_scale_up
```

## セキュリティ設計

### 1. 認証・認可
```python
# JWT実装
from jose import JWTError, jwt
from datetime import datetime, timedelta

class AuthService:
    def create_access_token(self, user_id: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=30)
        payload = {
            "sub": user_id,
            "exp": expire,
            "type": "access"
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    def verify_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
```

### 2. データ暗号化
```python
# 個人データ暗号化
from cryptography.fernet import Fernet

class DataEncryption:
    def __init__(self):
        self.cipher = Fernet(ENCRYPTION_KEY)
    
    def encrypt_pii(self, data: str) -> str:
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt_pii(self, encrypted_data: str) -> str:
        return self.cipher.decrypt(encrypted_data.encode()).decode()
```

この技術設計により、既存実装を活用しながら1,572,864パターンの超大規模システムを効率的に構築できます。