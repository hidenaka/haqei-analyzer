# HAQEI セキュリティ・プライバシー仕様書

## セキュリティ概要

HAQEI は**bunenjin哲学**に基づき、世界最高レベルのプライバシー保護とセキュリティを実装しています。

## プライバシー・セキュリティアーキテクチャ

### 多層防御システム
```
Layer 1: Transport Security (TLS 1.3)
├── 完全暗号化通信
├── Perfect Forward Secrecy
└── HSTS強制適用

Layer 2: Application Security
├── OWASP Top 10対策完全実装
├── CSP (Content Security Policy)
└── XSS/CSRF/SQLi完全防御

Layer 3: Database Security (RLS)
├── Row Level Security完全実装
├── ユーザー分離保証
└── 管理者権限最小化

Layer 4: bunenjin Philosophy
├── プライバシー・バイ・デザイン
├── データ最小化原則
└── ユーザー完全制御
```

## データ保護実装

### 1. データ分類・管理

#### 個人情報レベル分類
```typescript
enum DataSensitivityLevel {
  PUBLIC = 0,        // 公開情報（サービス紹介等）
  INTERNAL = 1,      // 内部情報（システム設定）
  CONFIDENTIAL = 2,  // 機密情報（診断回答）
  RESTRICTED = 3     // 最高機密（個人識別情報）
}

// 各レベルでの保護措置
const protectionMeasures = {
  [DataSensitivityLevel.RESTRICTED]: {
    encryption: 'AES-256-GCM',
    access: 'user_only',
    retention: 'user_defined',
    backup: 'encrypted_offsite',
    deletion: 'immediate_secure_wipe'
  }
}
```

#### データライフサイクル管理
```
Data Creation → Encryption → Processing → Storage → Deletion
     ↓              ↓           ↓          ↓         ↓
  同意確認     即座暗号化   最小処理   分離保存   完全削除
```

### 2. 暗号化実装

#### 保存時暗号化（Encryption at Rest）
```typescript
// ローカルストレージ暗号化
class LocalEncryption {
  private static readonly ALGORITHM = 'AES-256-GCM'
  private static readonly KEY_DERIVATION = 'PBKDF2'
  
  async encryptData(data: any, userKey: string): Promise<EncryptedData> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      await crypto.subtle.importKey('raw', new TextEncoder().encode(userKey), 'PBKDF2', false, ['deriveKey']),
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    )
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    )
    
    return {
      data: Array.from(new Uint8Array(encrypted)),
      salt: Array.from(salt),
      iv: Array.from(iv)
    }
  }
}
```

#### 通信時暗号化（Encryption in Transit）
```nginx
# Nginx SSL/TLS設定
ssl_protocols TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS設定
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 3. Row Level Security (RLS) 実装

#### データベースレベル分離
```sql
-- analysis_results テーブルRLS
CREATE POLICY "user_isolation_policy" ON analysis_results
  FOR ALL USING (
    auth.uid() = user_id 
    AND 
    auth.jwt() ->> 'aud' = 'authenticated'
  );

-- 管理者アクセス制限
CREATE POLICY "admin_limited_access" ON analysis_results
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
    AND
    auth.jwt() ->> 'email' IN (
      'admin@haqei.com',
      'security@haqei.com'
    )
    AND
    -- 緊急時のみアクセス可能
    current_setting('app.emergency_access', true)::boolean = true
  );
```

#### アクセス監視・ログ
```sql
-- アクセス監査テーブル
CREATE TABLE access_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- アクセス監査関数
CREATE OR REPLACE FUNCTION audit_data_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO access_audit_log (
    user_id, action, table_name, record_id, 
    ip_address, user_agent, success
  ) VALUES (
    auth.uid(), 
    TG_OP, 
    TG_TABLE_NAME, 
    COALESCE(NEW.id, OLD.id),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent',
    true
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## bunenjin哲学セキュリティ実装

### 1. プライバシー・バイ・デザイン

#### デフォルト設定
```typescript
// デフォルトプライバシー設定
const DEFAULT_PRIVACY_SETTINGS = {
  privacyLevel: 'maximum',
  dataSharing: false,
  analytics: false,
  cookies: 'essential_only',
  offlineFirst: true,
  cloudBackup: false,
  thirdPartyServices: false,
  locationTracking: false,
  behaviorTracking: false,
  advertisingId: false
} as const
```

#### 同意管理
```typescript
interface ConsentManagement {
  // 細かい粒度での同意管理
  granularConsent: {
    [key: string]: {
      granted: boolean
      timestamp: Date
      version: string
      explicit: boolean  // 明示的同意か
    }
  }
  
  // 同意撤回
  revokeConsent(category: string): Promise<void>
  
  // 同意状況確認
  checkConsent(category: string): boolean
  
  // 同意履歴
  getConsentHistory(): ConsentRecord[]
}
```

### 2. データ最小化実装

#### 必要最小限データ収集
```typescript
// 診断に必要な最小限データのみ
interface MinimalUserData {
  // 個人識別情報は一切保存しない
  sessionId: string           // 匿名セッションID
  answers: DiagnosisAnswer[]   // 診断回答のみ
  preferences: UserPreferences // 必要な設定のみ
  // name, email, phone等は保存しない
}

// データ保持期間制限
class DataRetentionManager {
  private readonly DEFAULT_RETENTION_DAYS = 365
  
  async cleanupExpiredData(): Promise<void> {
    // ユーザー指定期間経過後自動削除
    await this.deleteExpiredAnalysisResults()
    await this.cleanupSessionData()
    await this.purgeTemporaryFiles()
  }
}
```

### 3. 透明性・説明可能性

#### データ処理フロー可視化
```typescript
class TransparencyDashboard {
  // 現在の処理状況をリアルタイム表示
  async getCurrentProcessingStatus(): Promise<ProcessingStatus> {
    return {
      activeProcesses: [
        {
          type: 'local_analysis',
          description: 'あなたのデバイス内で診断分析中',
          dataUsed: ['質問回答'],
          location: 'ローカル（あなたのデバイス内）',
          duration: '推定15秒'
        }
      ],
      dataFlow: [
        { step: 1, description: '質問回答を暗号化', location: 'ローカル' },
        { step: 2, description: 'Triple OS分析実行', location: 'ローカル' },
        { step: 3, description: '結果をローカル保存', location: 'ローカル' }
      ],
      noCloudProcessing: true,
      noThirdPartySharing: true
    }
  }
}
```

## セキュリティ監査・テスト

### 1. 自動セキュリティテスト

#### CI/CDパイプライン統合
```yaml
# .github/workflows/security.yml
name: Security Audit
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: OWASP ZAP Security Scan
        uses: zaproxy/action-full-scan@v0.4.0
        
      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        
      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        
      - name: RLS Policy Test
        run: npm run test:rls-security
```

#### ペネトレーションテスト
```typescript
// RLS セキュリティテスト
describe('Row Level Security Tests', () => {
  test('ユーザーは自分のデータのみアクセス可能', async () => {
    const user1 = await createTestUser()
    const user2 = await createTestUser()
    
    // user1のデータ作成
    const analysis1 = await createAnalysis(user1.id)
    
    // user2からuser1のデータアクセス試行（失敗するべき）
    await expect(
      getAnalysisAsUser(analysis1.id, user2.id)
    ).rejects.toThrow('RLS: Access denied')
  })
  
  test('SQLインジェクション攻撃防御', async () => {
    const maliciousInput = "'; DROP TABLE analysis_results; --"
    
    await expect(
      searchAnalysis(maliciousInput)
    ).not.toThrow()
    
    // テーブルが削除されていないことを確認
    const tableExists = await checkTableExists('analysis_results')
    expect(tableExists).toBe(true)
  })
})
```

### 2. 脆弱性管理

#### 依存関係セキュリティ
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "outdated": "npm outdated",
    "update:security": "npm update --only=prod"
  },
  "auditConfig": {
    "report-type": "summary",
    "audit-level": "moderate"
  }
}
```

#### 定期セキュリティレビュー
```typescript
// セキュリティチェックリスト自動実行
class SecurityAudit {
  async runFullAudit(): Promise<SecurityReport> {
    const results = await Promise.all([
      this.checkDependencyVulnerabilities(),
      this.testRLSPolicies(),
      this.validateEncryptionImplementation(),
      this.checkAccessControls(),
      this.auditUserDataHandling(),
      this.testPrivacySettings()
    ])
    
    return this.generateSecurityReport(results)
  }
}
```

## インシデント対応

### 1. セキュリティインシデント対応計画

#### 対応体制
```
Level 1 - 軽微（情報漏洩なし）
├── 1時間以内: 初期対応開始
├── 4時間以内: 原因特定・修正
└── 24時間以内: 事後レポート

Level 2 - 重要（限定的データ影響）
├── 30分以内: 緊急対応チーム招集
├── 2時間以内: 影響範囲特定・隔離
├── 8時間以内: 修正・復旧完了
└── 72時間以内: 当局・ユーザー通知

Level 3 - 最高（大規模データ侵害）
├── 15分以内: 全社緊急体制
├── 1時間以内: システム一時停止判断
├── 4時間以内: 緊急修正・復旧
└── 72時間以内: 公式発表・法的対応
```

#### 自動対応システム
```typescript
class AutoIncidentResponse {
  // 異常検知時の自動対応
  async handleSecurityEvent(event: SecurityEvent): Promise<void> {
    switch (event.severity) {
      case 'CRITICAL':
        await this.lockdownSystem()
        await this.notifySecurityTeam('immediate')
        await this.preserveEvidence()
        break
        
      case 'HIGH':
        await this.isolateAffectedComponents()
        await this.notifySecurityTeam('urgent')
        break
        
      case 'MEDIUM':
        await this.enhanceMonitoring()
        await this.logDetailedEvent()
        break
    }
  }
}
```

### 2. データ侵害対応

#### 影響評価・通知
```typescript
interface DataBreachResponse {
  // 72時間以内の法的通知要件対応
  assessImpact(): Promise<BreachImpactAssessment>
  notifyAuthorities(): Promise<void>  // GDPR等法的要件
  notifyAffectedUsers(): Promise<void>
  provideRemediation(): Promise<void>
  
  // bunenjin哲学に基づく追加対応
  providefullTransparency(): Promise<void>
  enhanceUserControls(): Promise<void>
  improvePrivacyMeasures(): Promise<void>
}
```

## コンプライアンス・法的対応

### 1. 国際プライバシー法準拠

#### GDPR (欧州一般データ保護規則)
```typescript
class GDPRCompliance {
  // Article 7: 同意の条件
  async obtainValidConsent(purpose: string): Promise<ConsentRecord> {
    return {
      freely_given: true,
      specific: true,
      informed: true,
      unambiguous: true,
      withdrawable: true,
      purpose,
      timestamp: new Date(),
      evidence: 'explicit_user_action'
    }
  }
  
  // Article 17: 忘れられる権利
  async exerciseRightToErasure(userId: string): Promise<ErasureResult> {
    await this.deleteAllUserData(userId)
    await this.deleteBackups(userId)
    await this.notifyProcessors(userId)
    
    return {
      deleted: true,
      timestamp: new Date(),
      verification: await this.verifyDeletion(userId)
    }
  }
}
```

#### CCPA (カリフォルニア州消費者プライバシー法)
```typescript
class CCPACompliance {
  // 消費者の権利実装
  async exerciseConsumerRights(request: ConsumerRequest): Promise<void> {
    switch (request.type) {
      case 'know':
        await this.provideDataInventory(request.userId)
        break
      case 'delete':
        await this.deletePersonalInformation(request.userId)
        break
      case 'opt_out':
        await this.optOutOfSale(request.userId)
        break
    }
  }
}
```

### 2. 業界標準準拠

#### ISO 27001 情報セキュリティ管理
```typescript
class ISO27001Compliance {
  // 情報セキュリティ管理システム
  async implementISMS(): Promise<void> {
    await this.establishSecurityPolicy()
    await this.conductRiskAssessment()
    await this.implementControls()
    await this.monitorAndReview()
  }
}
```

## 継続的セキュリティ改善

### 1. セキュリティメトリクス

#### 監視指標
```typescript
interface SecurityMetrics {
  // 技術指標
  vulnerability_count: number
  patch_deployment_time: number
  incident_response_time: number
  encryption_coverage: number
  
  // bunenjin指標
  privacy_satisfaction_score: number
  user_control_utilization: number
  transparency_engagement: number
  offline_usage_percentage: number
}
```

### 2. 定期改善計画
```
月次:
├── 脆弱性スキャン実行
├── セキュリティパッチ適用
├── アクセスログ分析
└── ユーザープライバシー満足度調査

四半期:
├── ペネトレーションテスト実施
├── セキュリティ教育・訓練
├── 法的要件更新確認
└── インシデント対応演習

年次:
├── 包括的セキュリティ監査
├── プライバシー影響評価
├── コンプライアンス認証更新
└── セキュリティ戦略見直し
```

---

**セキュリティ責任者**: Chief Security Officer  
**プライバシー責任者**: Data Protection Officer  
**最終更新**: 2025-08-03  
**準拠法**: GDPR, CCPA, 個人情報保護法  
**セキュリティレベル**: 最高（bunenjin準拠）