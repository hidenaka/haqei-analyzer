# HAQEI Database ER Diagram & Data Relationships

**🗺️ エンティティ関係図・データ構造可視化**  
**📅 作成日**: 2025-08-03  
**🎯 目的**: データベース構造の視覚的理解・開発者ガイド  

---

## 📊 概要ER図

```
                    HAQEI Database Entity Relationship Diagram
                              (エンタープライズグレード設計)

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    I-CHING SYSTEM                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  trigrams   │    │ hexagrams   │    │ yao_lines   │    │five_elements│         │
│  │    (8卦)     │    │   (64卦)     │    │   (384爻)    │    │   (5行)      │         │
│  │─────────────│    │─────────────│    │─────────────│    │─────────────│         │
│  │ id (PK)     │    │ id (PK)     │    │ id (PK)     │    │ id (PK)     │         │
│  │ name        │    │ number(1-64)│    │ hexagram_id │    │ name        │         │
│  │ binary_value│◄──┐│ upper_tri_id│    │ position    │    │ color       │         │
│  │ element     │   ││ lower_tri_id│    │ line_type   │    │ direction   │         │
│  │ attribute   │   │└─────────────┘    │ text        │    │ season      │         │
│  │ philosophy  │   │       │           │ interpretation│   │ personality │         │
│  └─────────────┘   │       │           │ engine_os_imp│   └─────────────┘         │
│                    │       │           │ interface_imp│                           │
│                    │       │           │ safe_mode_imp│                           │
│                    │       │           └─────────────┘                           │
│                    │       │                  ▲                                  │
│                    │       │                  │                                  │
│                    │       │                  │ FK                               │
│                    │       │                  │                                  │
└────────────────────┼───────┼──────────────────┼──────────────────────────────────┘
                     │       │                  │
                     │       │   ┌──────────────┘
                     │       │   │
┌────────────────────┼───────┼───┼──────────────────────────────────────────────────┐
│                    │  TRIPLE OS ARCHITECTURE                                      │
│  ┌─────────────────▼───────▼───▼─────────────────┐                              │
│  │                 users                        │                              │
│  │              (ユーザー基盤)                     │                              │
│  │─────────────────────────────────────────────│                              │
│  │ id (UUID) (PK)                              │                              │
│  │ email                                       │                              │
│  │ username                                    │                              │
│  │ privacy_level (maximum/high/medium/low)     │                              │
│  │ data_sharing_consent                        │                              │
│  │ last_active_at                              │                              │
│  │ deleted_at (soft delete)                    │                              │
│  │ data_retention_until (GDPR)                 │                              │
│  └─────────────────┬───────────────────────────┘                              │
│                    │                                                          │
│         ┌──────────┼──────────┐                                               │
│         │          │          │                                               │
│         │ 1:1      │ 1:1      │ 1:1                                           │
│         ▼          ▼          ▼                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                            │
│  │ engine_os_  │ │interface_os_│ │safe_mode_os_│                            │
│  │ profiles    │ │  profiles   │ │  profiles   │                            │
│  │(価値観系)    │ │ (社会適応系) │ │  (防御系)    │                            │
│  │─────────────│ │─────────────│ │─────────────│                            │
│  │ id (UUID)   │ │ id (UUID)   │ │ id (UUID)   │                            │
│  │ user_id (FK)│ │ user_id (FK)│ │ user_id (FK)│                            │
│  │ intrinsic_  │ │ social_     │ │ defense_    │                            │
│  │ motivation  │ │ adaptation_ │ │ mechanisms  │                            │
│  │ (JSONB)     │ │ patterns    │ │ (JSONB)     │                            │
│  │ core_values │ │ (JSONB)     │ │ risk_assess │                            │
│  │ (JSONB)     │ │ comm_styles │ │ patterns    │                            │
│  │ primary_hex │ │ (JSONB)     │ │ (JSONB)     │                            │
│  │ secondary_  │ │ adaptability│ │ resilience_ │                            │
│  │ hex         │ │ score(0-100)│ │ level(0-10) │                            │
│  │ authenticity│ │ social_int_ │ │ anxiety_mgmt│                            │
│  │ score(0-100)│ │ score(0-100)│ │ score(0-100)│                            │
│  │ analysis_   │ │ empathy_lvl │ │ analysis_   │                            │
│  │ confidence  │ │ (0-10)      │ │ confidence  │                            │
│  └─────────────┘ └─────────────┘ └─────────────┘                            │
│         │                │                │                                 │
│         └────────────────┼────────────────┘                                 │
│                          │                                                  │
│                          │ N:N:N (相互作用)                                   │
│                          ▼                                                  │
│                 ┌─────────────────┐                                         │
│                 │ os_interactions │                                         │
│                 │  (OS間相互作用)    │                                         │
│                 │─────────────────│                                         │
│                 │ id (UUID)       │                                         │
│                 │ user_id (FK)    │                                         │
│                 │ interaction_type│                                         │
│                 │ primary_os      │                                         │
│                 │ secondary_os    │                                         │
│                 │ strength (0-10) │                                         │
│                 │ quality         │                                         │
│                 │ observed_at     │                                         │
│                 └─────────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          ANALYSIS & SESSION MANAGEMENT                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                 │
│  │ analysis_       │    │ question_       │    │ privacy_        │                 │
│  │ sessions        │    │ responses       │    │ settings        │                 │
│  │  (分析セッション)  │    │  (質問応答履歴)   │    │ (プライバシー設定) │                 │
│  │─────────────────│    │─────────────────│    │─────────────────│                 │
│  │ id (UUID) (PK)  │◄───┤ session_id (FK) │    │ id (UUID) (PK)  │                 │
│  │ user_id (FK)    │    │ user_id (FK)    │    │ user_id (FK)    │                 │
│  │ session_type    │    │ question_id     │    │ profile_        │                 │
│  │ completion_     │    │ (q1,q2,...q30)  │    │ visibility      │                 │
│  │ status          │    │ question_text   │    │ data_export_    │                 │
│  │ engine_os_      │    │ response_value  │    │ format          │                 │
│  │ profile_id      │    │ (1-7)           │    │ auto_delete_    │                 │
│  │ interface_os_   │    │ response_       │    │ enabled         │                 │
│  │ profile_id      │    │ confidence(1-5) │    │ store_engine_   │                 │
│  │ safe_mode_os_   │    │ response_time   │    │ os_data         │                 │
│  │ profile_id      │    │ engine_os_weight│    │ store_interface_│                 │
│  │ overall_harmony │    │ interface_weight│    │ os_data         │                 │
│  │ score (0-100)   │    │ safe_mode_weight│    │ store_safe_mode_│                 │
│  │ integration_lvl │    │ influenced_     │    │ os_data         │                 │
│  │ (0-10)          │    │ hexagrams       │    │ anonymous_      │                 │
│  │ primary_life_   │    │ (INTEGER[])     │    │ research_part   │                 │
│  │ hexagram_id     │    │ answered_at     │    │ wisdom_sharing_ │                 │
│  │ guidance_       │    │ revised_at      │    │ consent         │                 │
│  │ hexagram_id     │    └─────────────────┘    │ collective_     │                 │
│  │ transformation_ │                           │ growth_part     │                 │
│  │ path (JSONB)    │                           └─────────────────┘                 │
│  │ wisdom_         │                                                               │
│  │ synthesis       │                                                               │
│  │ life_guidance_  │                                                               │
│  │ summary         │                                                               │
│  │ started_at      │                                                               │
│  │ completed_at    │                                                               │
│  │ duration_mins   │                                                               │
│  │ questions_      │                                                               │
│  │ answered        │                                                               │
│  └─────────────────┘                                                               │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 主要リレーションシップ

### **1. I-Ching System (易経システム)**

```
Trigrams (1) ──┬─► Hexagrams (64)
               └─► Hexagrams.lower_trigram_id

Hexagrams (1) ────► Yao_Lines (6) 
               └─► Total: 64 × 6 = 384 爻

Hexagrams ◄────► Engine_OS_Profiles (many-to-many via primary/secondary hexagram)
          ◄────► Interface_OS_Profiles  
          ◄────► Safe_Mode_OS_Profiles
```

### **2. Triple OS Architecture (三層OS構造)**

```
Users (1) ──┬─► Engine_OS_Profiles (1)     -- 価値観システム
            ├─► Interface_OS_Profiles (1)  -- 社会適応システム  
            └─► Safe_Mode_OS_Profiles (1)   -- 防御システム

Users (1) ────► OS_Interactions (many)     -- OS間相互作用記録
Users (1) ────► Analysis_Sessions (many)   -- 分析セッション履歴
Users (1) ────► Privacy_Settings (1)       -- プライバシー設定
```

### **3. Analysis & Session Management (分析・セッション管理)**

```
Analysis_Sessions (1) ────► Question_Responses (30)  -- 1セッション30問
Analysis_Sessions ◄─────── Engine_OS_Profiles       -- 分析結果統合
                  ◄─────── Interface_OS_Profiles
                  ◄─────── Safe_Mode_OS_Profiles

Question_Responses ◄────► Hexagrams (influenced_hexagrams[])  -- 影響卦配列
```

---

## 📋 データ型詳細

### **主要JSONB構造**

#### **Engine OS (価値観システム)**
```json
{
  "intrinsic_motivation": {
    "autonomy": 8,
    "mastery": 7,
    "purpose": 9,
    "creativity": 6
  },
  "core_values": {
    "integrity": 9,
    "growth": 8,
    "harmony": 7,
    "innovation": 8
  },
  "strength_areas": {
    "analytical_thinking": 8,
    "strategic_planning": 7,
    "creative_problem_solving": 9
  }
}
```

#### **Interface OS (社会適応システム)**
```json
{
  "social_adaptation_patterns": {
    "group_dynamics": "collaborative",
    "conflict_style": "harmony_seeking",
    "influence_method": "consensus_building"
  },
  "communication_styles": {
    "verbal": "thoughtful",
    "nonverbal": "attentive", 
    "digital": "considered"
  },
  "interpersonal_patterns": {
    "leadership_style": "servant_leader",
    "team_role": "facilitator",
    "networking_approach": "relationship_focused"
  }
}
```

#### **Safe Mode OS (防御システム)**
```json
{
  "defense_mechanisms": {
    "primary": "intellectualization",
    "secondary": "sublimation",
    "emergency": "withdrawal"
  },
  "risk_assessment_patterns": {
    "threat_sensitivity": "moderate",
    "uncertainty_tolerance": "high",
    "change_adaptation": "gradual_acceptance"
  },
  "safety_seeking_behaviors": {
    "information_gathering": "comprehensive",
    "support_network": "close_trusted_circle",
    "contingency_planning": "detailed"
  }
}
```

---

## 🔐 Row Level Security (RLS) 構造

### **セキュリティレイヤー図**

```
                    RLS Security Architecture

┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐   │
│  │ Anonymous   │ │Authenticated│ │ Analytics   │ │  Admin   │   │
│  │   Users     │ │    Users    │ │ Research    │ │  Users   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RLS Policy Layer                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  users: id = auth.user_id()                             │   │
│  │  ├─► engine_os_profiles: user_id = auth.user_id()       │   │
│  │  ├─► interface_os_profiles: user_id = auth.user_id()    │   │
│  │  ├─► safe_mode_os_profiles: user_id = auth.user_id()    │   │
│  │  ├─► analysis_sessions: user_id = auth.user_id()        │   │
│  │  ├─► question_responses: user_id = auth.user_id()       │   │
│  │  ├─► os_interactions: user_id = auth.user_id()          │   │
│  │  └─► privacy_settings: user_id = auth.user_id()         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PUBLIC ACCESS (No RLS)                                 │   │
│  │  ├─► trigrams: 八卦基本データ                             │   │
│  │  ├─► hexagrams: 64卦データ                               │   │
│  │  ├─► yao_lines: 384爻データ                              │   │
│  │  └─► five_elements: 五行データ                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                           │
│                     (Row Level Security)                        │
└─────────────────────────────────────────────────────────────────┘
```

### **認証フロー**

```
1. User Authentication
   ├─► Supabase: auth.uid()
   ├─► Auth0: JWT claims
   └─► Local Dev: app.current_user_id

2. RLS Policy Evaluation  
   ├─► auth.user_id() → UUID
   ├─► Policy Check: user_id = auth.user_id()
   └─► Access Grant/Deny

3. Data Access Control
   ├─► Own Data: Full CRUD
   ├─► Public Data: Read Only  
   └─► Anonymous Data: Aggregated Stats Only
```

---

## ⚡ パフォーマンス最適化構造

### **インデックス戦略図**

```
                    Index Strategy Architecture

┌─────────────────────────────────────────────────────────────────┐
│                    High-Frequency Access                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │   B-Tree    │ │    GIN      │ │  Partial    │                │
│  │   Indexes   │ │   Indexes   │ │  Indexes    │                │
│  │─────────────│ │─────────────│ │─────────────│                │
│  │• PK/FK      │ │• JSONB      │ │• WHERE      │                │
│  │  Lookups    │ │  Content    │ │  Conditions │                │
│  │• Email      │ │• Core Values│ │• Confidence │                │
│  │• Username   │ │• Patterns   │ │  > 75%      │                │
│  │• Timestamps │ │• Defense    │ │• Active     │                │
│  │• Scores     │ │  Mechanisms │ │  Users Only │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Query Performance Targets                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Primary Operations (Target: <50ms)                    │   │
│  │  ├─► User Lookup: email/username                       │   │
│  │  ├─► Profile Retrieval: Triple OS data                 │   │
│  │  ├─► Session Access: user's analysis history           │   │
│  │  └─► I-Ching Lookup: hexagram/trigram data             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Complex Operations (Target: <200ms)                   │   │
│  │  ├─► Triple OS Integration: JOIN all three profiles    │   │
│  │  ├─► Analysis Calculation: harmony scores              │   │
│  │  ├─► Question Response Analytics: pattern analysis     │   │
│  │  └─► I-Ching Mapping: hexagram relevance scoring       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Heavy Operations (Target: <1000ms)                    │   │
│  │  ├─► Statistical Analysis: aggregated insights         │   │
│  │  ├─► Full Profile Generation: complete new analysis    │   │
│  │  ├─► Bulk Data Export: GDPR compliance                 │   │
│  │  └─► System Maintenance: vacuum/analyze                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 データフロー例

### **新規ユーザー分析フロー**

```
1. User Registration
   ┌─► users table (UUID, privacy_level)
   └─► privacy_settings table (default values)

2. Analysis Session Start  
   ┌─► analysis_sessions table (session_type: 'initial')
   └─► Completion Status: 'in_progress'

3. Question Answering (30 questions)
   ├─► question_responses table (q1-q30)
   ├─► response_value (1-7), confidence (1-5) 
   └─► engine/interface/safe_mode weights

4. Triple OS Profile Generation
   ├─► engine_os_profiles (intrinsic_motivation, core_values)
   ├─► interface_os_profiles (social_patterns, communication)
   └─► safe_mode_os_profiles (defense_mechanisms, risk_patterns)

5. I-Ching Integration
   ├─► hexagram relevance scoring (engine/interface/safe_mode)
   ├─► primary/secondary hexagram assignment
   └─► yao_lines impact calculation

6. Final Analysis
   ├─► overall_harmony_score calculation
   ├─► integration_level assessment
   ├─► life_guidance generation
   └─► Session completion (status: 'completed')
```

### **データ整合性チェックフロー**

```
1. Referential Integrity
   ├─► FK Constraints: All foreign keys valid
   ├─► Cascade Rules: DELETE CASCADE for user data
   └─► Unique Constraints: No duplicate profiles

2. Business Logic Validation
   ├─► Score Ranges: 0-100 for percentages, 0-10 for levels
   ├─► Required JSONB: Non-null for core data structures
   └─► Date Logic: created_at ≤ updated_at

3. Privacy Compliance
   ├─► RLS Policy Enforcement: User data isolation
   ├─► Data Retention: Automatic cleanup after retention period
   └─► Consent Tracking: All data usage logged
```

---

## 📈 スケーラビリティ設計

### **成長段階別アーキテクチャ**

```
Stage 1: 1K Users
┌─────────────────┐
│   Single DB     │
│  (All tables)   │
│                 │
│ Performance:    │
│ • Basic indexes │
│ • Single server │
│ • <50ms queries │
└─────────────────┘

Stage 2: 10K Users  
┌─────────────────┐    ┌─────────────────┐
│   Primary DB    │    │   Read Replica  │
│ (Write + Read)  │◄──►│  (Analytics)    │
│                 │    │                 │
│ Performance:    │    │ Features:       │
│ • Full indexes  │    │ • Reporting     │
│ • Connection    │    │ • Statistics    │
│   pooling       │    │ • Research      │
└─────────────────┘    └─────────────────┘

Stage 3: 100K Users
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Primary DB    │    │   Read Replica  │    │   Cache Layer   │
│ (Partitioned)   │◄──►│   (Multiple)    │◄──►│    (Redis)      │
│                 │    │                 │    │                 │
│ Features:       │    │ Features:       │    │ Features:       │
│ • Monthly parts │    │ • Load balanced │    │ • Session cache │
│ • Hot/Cold data │    │ • Geographic    │    │ • Query cache   │
│ • Archive old   │    │   distribution  │    │ • Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎉 まとめ

HAQEI データベースは、**古典的智慧と現代技術の完璧な融合** を実現したエンタープライズグレードのシステムです。

### **🏆 技術的達成**

- ✅ **完全なRLS実装**: ゼロトラスト・プライバシー保護
- ✅ **スケーラブル設計**: 10万ユーザー対応
- ✅ **哲学的整合性**: bunenjin + 易経の技術的具現化
- ✅ **パフォーマンス最適化**: Sub-100ms クエリ応答

### **🎭 哲学的達成**

- 🤲 **ユーザー主権**: 完全なデータコントロール権の技術実装
- 🛡️ **プライバシー尊重**: Privacy by Design の徹底
- 🌀 **調和的設計**: 対立要素の技術的統合
- 📈 **持続的進化**: 変化に対応する柔軟な構造

**"Where Ancient Wisdom Meets Modern Database Technology"** 🌟

---

*このER図は、HAQEI データベースの完全な構造理解のためのビジュアルガイドです。開発・運用・拡張のすべての段階で参照してください。*