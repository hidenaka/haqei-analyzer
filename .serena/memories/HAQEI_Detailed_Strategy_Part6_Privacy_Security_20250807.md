# HAQEI詳細戦略 Part6: データ・プライバシー・セキュリティ方針

## 基本方針・設計原則

### Privacy by Design原則の採用
```
1. Proactive not Reactive（事前対策）
2. Privacy as the Default Setting（プライバシーファースト）
3. Full Functionality（機能性の確保）
4. End-to-End Security（エンドツーエンド保護）
5. Visibility and Transparency（透明性）
6. Respect for User Privacy（利用者プライバシーの尊重）
```

### データ最小化原則
- **必要最小限のデータ**: サービス提供に必要な最小限のデータのみ収集
- **目的制限**: 収集目的以外での利用禁止
- **保存期間制限**: 必要最小限の期間のみ保存
- **仮名化・匿名化**: 個人を特定できない形での処理

## 法的コンプライアンス対応

### 日本国内法対応

#### 個人情報保護法対応
```javascript
const PERSONAL_DATA_CATEGORIES = {
  // 基本個人情報
  basic_personal_info: {
    types: ['email', 'name', 'birth_date'],
    legal_basis: 'consent',
    retention_period: '2_years',
    deletion_trigger: 'account_closure'
  },
  
  // センシティブ個人情報（要配慮個人情報）
  sensitive_personal_info: {
    types: ['psychological_analysis', 'personality_traits', 'behavioral_patterns'],
    legal_basis: 'explicit_consent',
    special_protection: true,
    retention_period: '1_year',
    anonymization_required: true
  },
  
  // 利用データ
  usage_data: {
    types: ['service_usage', 'interaction_logs', 'preference_settings'],
    legal_basis: 'legitimate_interest',
    retention_period: '6_months',
    anonymization_after: '3_months'
  }
};

class PersonalDataProtectionCompliance {
  constructor() {
    this.dataCategories = PERSONAL_DATA_CATEGORIES;
    this.consentManager = new ConsentManager();
    this.retentionManager = new DataRetentionManager();
  }

  async collectPersonalData(dataType, data, userId, purpose) {
    // 1. 法的根拠の確認
    const legalBasis = this.dataCategories[dataType].legal_basis;
    const consentStatus = await this.consentManager.checkConsent(userId, dataType, purpose);
    
    if (legalBasis === 'explicit_consent' && !consentStatus.explicit_consent) {
      throw new Error('Explicit consent required for sensitive data');
    }

    // 2. データ最小化チェック
    const minimizedData = this.minimizeData(data, purpose);
    
    // 3. 暗号化して保存
    const encryptedData = await this.encryptSensitiveData(minimizedData, dataType);
    
    // 4. 保存期間の設定
    const retentionPeriod = this.dataCategories[dataType].retention_period;
    await this.retentionManager.setRetentionSchedule(userId, dataType, retentionPeriod);
    
    // 5. アクセスログ記録
    await this.logDataAccess('collect', userId, dataType, purpose);
    
    return encryptedData;
  }

  async handleDataSubjectRights(request) {
    const supportedRights = [
      'access',           // 開示請求
      'rectification',    // 訂正請求
      'erasure',          // 削除請求
      'portability',      // データポータビリティ
      'objection'         // 処理停止請求
    ];

    if (!supportedRights.includes(request.right)) {
      throw new Error('Unsupported data subject right');
    }

    switch (request.right) {
      case 'access':
        return await this.provideDataAccess(request.userId);
      case 'erasure':
        return await this.eraseUserData(request.userId);
      case 'portability':
        return await this.exportUserData(request.userId);
      // ... その他の権利
    }
  }
}
```

### GDPR対応（海外展開準備）

#### GDPR準拠データ処理
```javascript
class GDPRCompliance extends PersonalDataProtectionCompliance {
  constructor() {
    super();
    this.lawfulBases = [
      'consent',              // 同意（Article 6(1)(a)）
      'contract',             // 契約履行（Article 6(1)(b)）
      'legal_obligation',     // 法的義務（Article 6(1)(c)）
      'vital_interests',      // 生命に関わる利益（Article 6(1)(d)）
      'public_task',          // 公的業務（Article 6(1)(e)）
      'legitimate_interests'  // 正当な利益（Article 6(1)(f)）
    ];
  }

  async processPersonalData(data, purpose, lawfulBasis) {
    // GDPR Article 5準拠チェック
    const gdprPrinciples = await this.checkGDPRPrinciples(data, purpose);
    
    if (!gdprPrinciples.compliant) {
      throw new Error(`GDPR violation: ${gdprPrinciples.violations.join(', ')}`);
    }

    // Data Protection Impact Assessment（DPIA）
    if (await this.requiresDPIA(data, purpose)) {
      const dpia = await this.conductDPIA(data, purpose);
      if (dpia.risk_level === 'high') {
        await this.consultDataProtectionAuthority(dpia);
      }
    }

    return await this.processWithGDPRSafeguards(data, purpose, lawfulBasis);
  }

  async checkGDPRPrinciples(data, purpose) {
    const principles = {
      lawfulness: await this.checkLawfulness(data, purpose),
      fairness: await this.checkFairness(data, purpose), 
      transparency: await this.checkTransparency(data, purpose),
      purpose_limitation: await this.checkPurposeLimitation(data, purpose),
      data_minimization: await this.checkDataMinimization(data, purpose),
      accuracy: await this.checkAccuracy(data),
      storage_limitation: await this.checkStorageLimitation(data),
      security: await this.checkSecurity(data)
    };

    const violations = Object.entries(principles)
      .filter(([key, compliant]) => !compliant)
      .map(([key]) => key);

    return {
      compliant: violations.length === 0,
      violations: violations
    };
  }
}
```

## データガバナンス・ライフサイクル管理

### データ分類・ラベリング
```javascript
const DATA_CLASSIFICATION = {
  // 公開情報
  public: {
    classification_level: 'public',
    encryption_required: false,
    access_control: 'none',
    examples: ['service_description', 'pricing_info', 'faq']
  },
  
  // 内部情報
  internal: {
    classification_level: 'internal',
    encryption_required: true,
    access_control: 'employee_only',
    examples: ['system_logs', 'aggregated_metrics', 'business_intelligence']
  },
  
  // 機密情報
  confidential: {
    classification_level: 'confidential',
    encryption_required: true,
    access_control: 'role_based',
    audit_required: true,
    examples: ['user_profiles', 'payment_info', 'api_keys']
  },
  
  // 極秘情報
  highly_confidential: {
    classification_level: 'highly_confidential',
    encryption_required: true,
    access_control: 'strict_role_based',
    audit_required: true,
    dwp_required: true, // Data Loss Prevention
    examples: ['personality_analysis', 'private_conversations', 'sensitive_user_data']
  }
};

class DataLifecycleManager {
  constructor() {
    this.classification = DATA_CLASSIFICATION;
    this.retentionPolicies = new Map();
    this.anonymizationScheduler = new AnonymizationScheduler();
  }

  async classifyData(data, context) {
    const classification = await this.determineClassification(data, context);
    const label = this.generateDataLabel(classification);
    
    return {
      ...data,
      classification: classification,
      label: label,
      created_at: Date.now(),
      retention_policy: await this.getRetentionPolicy(classification)
    };
  }

  async applyRetentionPolicy(dataId, classification) {
    const policy = this.retentionPolicies.get(classification);
    
    const schedule = {
      anonymization_date: Date.now() + policy.anonymization_period,
      deletion_date: Date.now() + policy.retention_period,
      review_date: Date.now() + policy.review_period
    };

    await this.scheduleDataActions(dataId, schedule);
  }

  async anonymizeExpiredData() {
    const expiredData = await this.getDataForAnonymization();
    
    for (const data of expiredData) {
      try {
        const anonymizedData = await this.performAnonymization(data);
        await this.replaceWithAnonymizedData(data.id, anonymizedData);
        await this.logAnonymization(data.id);
      } catch (error) {
        await this.logAnonymizationFailure(data.id, error);
      }
    }
  }
}
```

### 同意管理システム
```javascript
class ConsentManager {
  constructor() {
    this.consentTypes = [
      'service_usage',        // サービス利用
      'marketing',           // マーケティング
      'analytics',           // 分析・統計
      'third_party_sharing', // 第三者提供
      'sensitive_data'       // 機微情報処理
    ];
  }

  async requestConsent(userId, consentTypes, purpose) {
    const consentRequest = {
      userId: userId,
      requestId: this.generateRequestId(),
      timestamp: Date.now(),
      consentTypes: consentTypes,
      purpose: purpose,
      status: 'pending',
      expiry: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1年後
    };

    // 同意UI表示
    const consentUI = await this.generateConsentUI(consentRequest);
    await this.displayConsentRequest(userId, consentUI);
    
    return consentRequest.requestId;
  }

  async recordConsent(requestId, userChoices) {
    const request = await this.getConsentRequest(requestId);
    
    const consentRecord = {
      userId: request.userId,
      requestId: requestId,
      timestamp: Date.now(),
      choices: userChoices,
      ip_address: await this.getClientIP(),
      user_agent: await this.getClientUserAgent(),
      version: '1.0'
    };

    // 同意の証跡を改ざん防止で保存
    await this.storeConsentRecord(consentRecord);
    
    // 同意状況を更新
    await this.updateConsentStatus(request.userId, userChoices);
    
    return consentRecord;
  }

  async checkConsentValid(userId, consentType, purpose) {
    const consent = await this.getUserConsent(userId, consentType);
    
    if (!consent) return { valid: false, reason: 'no_consent' };
    if (consent.expired) return { valid: false, reason: 'expired' };
    if (!consent.purposes.includes(purpose)) return { valid: false, reason: 'purpose_mismatch' };
    
    return { valid: true, consent: consent };
  }

  async withdrawConsent(userId, consentType) {
    const withdrawal = {
      userId: userId,
      consentType: consentType,
      timestamp: Date.now(),
      ip_address: await this.getClientIP()
    };

    await this.processConsentWithdrawal(withdrawal);
    
    // 関連データの処理停止
    await this.stopDataProcessing(userId, consentType);
    
    // データ削除が必要な場合
    if (this.requiresDataDeletion(consentType)) {
      await this.scheduleDataDeletion(userId, consentType);
    }
  }
}
```

## 技術的セキュリティ対策

### 暗号化戦略
```javascript
class EncryptionManager {
  constructor() {
    this.encryptionAlgorithms = {
      symmetric: 'AES-256-GCM',
      asymmetric: 'RSA-4096',
      hashing: 'SHA-256',
      key_derivation: 'PBKDF2'
    };
    this.keyRotationInterval = 90 * 24 * 60 * 60 * 1000; // 90日
  }

  async encryptSensitiveData(data, classification) {
    const encryptionKey = await this.getEncryptionKey(classification);
    
    switch (classification) {
      case 'highly_confidential':
        // 二重暗号化
        const firstEncryption = await this.encryptAES256(data, encryptionKey.primary);
        const secondEncryption = await this.encryptAES256(firstEncryption, encryptionKey.secondary);
        return secondEncryption;
        
      case 'confidential':
        return await this.encryptAES256(data, encryptionKey.primary);
        
      default:
        return data; // 低分類は暗号化なし
    }
  }

  async rotateEncryptionKeys() {
    const activeKeys = await this.getActiveKeys();
    
    for (const key of activeKeys) {
      if (this.shouldRotateKey(key)) {
        const newKey = await this.generateNewKey(key.algorithm);
        
        // 新キーでデータを再暗号化
        await this.reencryptData(key.id, newKey);
        
        // 古いキーを無効化
        await this.deactivateKey(key.id);
        
        // 新キーを有効化
        await this.activateKey(newKey);
      }
    }
  }
}

class AccessControlManager {
  constructor() {
    this.roles = {
      'system_admin': ['*'],
      'data_processor': ['read:user_data', 'process:analytics'],
      'support_agent': ['read:public_data', 'read:support_tickets'],
      'anonymous_user': ['read:public_data']
    };
  }

  async authorizeAccess(userId, resource, action) {
    const userRole = await this.getUserRole(userId);
    const requiredPermission = `${action}:${resource}`;
    
    // ロールベースアクセス制御
    const hasRolePermission = this.checkRolePermission(userRole, requiredPermission);
    
    // 属性ベースアクセス制御（ABAC）
    const attributeCheck = await this.checkAttributes(userId, resource, action);
    
    // 時間・場所ベースアクセス制御
    const contextCheck = await this.checkContext(userId, action);
    
    const authorized = hasRolePermission && attributeCheck && contextCheck;
    
    // アクセスログ記録
    await this.logAccessAttempt({
      userId: userId,
      resource: resource,
      action: action,
      authorized: authorized,
      timestamp: Date.now()
    });
    
    return authorized;
  }

  async checkAttributes(userId, resource, action) {
    const attributes = await this.getUserAttributes(userId);
    const resourceAttributes = await this.getResourceAttributes(resource);
    
    // データ所有者チェック
    if (resourceAttributes.owner === userId) return true;
    
    // 地理的制限チェック
    if (resourceAttributes.geo_restricted) {
      const userLocation = await this.getUserLocation(userId);
      if (!resourceAttributes.allowed_regions.includes(userLocation.region)) {
        return false;
      }
    }
    
    // 時間制限チェック
    if (resourceAttributes.time_restricted) {
      const currentTime = new Date();
      if (!this.isWithinAllowedHours(currentTime, resourceAttributes.allowed_hours)) {
        return false;
      }
    }
    
    return true;
  }
}
```

### セキュリティ監視・ログ管理
```javascript
class SecurityMonitoringSystem {
  constructor() {
    this.anomalyDetectionRules = [
      {
        name: 'multiple_failed_logins',
        pattern: 'failed_login_count > 5 within 5_minutes',
        severity: 'medium',
        action: 'account_lockout'
      },
      {
        name: 'unusual_data_access',
        pattern: 'data_access_volume > normal_baseline * 3',
        severity: 'high',
        action: 'alert_admin'
      },
      {
        name: 'suspicious_api_calls',
        pattern: 'api_calls_per_minute > 100',
        severity: 'high',
        action: 'rate_limit'
      }
    ];
  }

  async detectAnomalies() {
    const currentLogs = await this.getRecentLogs();
    
    for (const rule of this.anomalyDetectionRules) {
      const matches = await this.evaluateRule(rule, currentLogs);
      
      if (matches.length > 0) {
        await this.handleAnomaly(rule, matches);
      }
    }
  }

  async handleAnomaly(rule, matches) {
    const incident = {
      id: this.generateIncidentId(),
      rule: rule.name,
      severity: rule.severity,
      matches: matches,
      timestamp: Date.now(),
      status: 'open'
    };

    // 即座対応アクション
    await this.executeSecurityAction(rule.action, matches);
    
    // インシデント記録
    await this.recordSecurityIncident(incident);
    
    // アラート送信
    await this.sendSecurityAlert(incident);
  }

  async executeSecurityAction(action, targets) {
    switch (action) {
      case 'account_lockout':
        for (const target of targets) {
          await this.lockUserAccount(target.userId, '1_hour');
        }
        break;
        
      case 'rate_limit':
        for (const target of targets) {
          await this.applyRateLimit(target.ip, '10_minutes');
        }
        break;
        
      case 'alert_admin':
        await this.sendAdminAlert(targets);
        break;
    }
  }
}
```

## プライバシー透明性・ユーザーコントロール

### プライバシーダッシュボード
```javascript
class PrivacyDashboard {
  constructor(userId) {
    this.userId = userId;
    this.dataExportManager = new DataExportManager();
    this.consentManager = new ConsentManager();
  }

  async generatePrivacyOverview() {
    const overview = {
      personal_data_summary: await this.getPersonalDataSummary(),
      consent_status: await this.getConsentStatus(),
      data_sharing_info: await this.getDataSharingInfo(),
      retention_schedule: await this.getRetentionSchedule(),
      privacy_controls: await this.getAvailableControls()
    };

    return overview;
  }

  async getPersonalDataSummary() {
    const dataTypes = await this.getUserDataTypes();
    const summary = {};

    for (const dataType of dataTypes) {
      const data = await this.getUserData(dataType);
      summary[dataType] = {
        record_count: data.length,
        last_updated: Math.max(...data.map(d => d.updated_at)),
        purpose: await this.getProcessingPurpose(dataType),
        retention_period: await this.getRetentionPeriod(dataType)
      };
    }

    return summary;
  }

  async exportUserData(format = 'json') {
    const exportRequest = {
      userId: this.userId,
      format: format,
      timestamp: Date.now(),
      status: 'processing'
    };

    // バックグラウンドでデータ準備
    this.dataExportManager.prepareExport(exportRequest);

    return exportRequest;
  }

  async deleteUserData(dataTypes) {
    const deletionRequest = {
      userId: this.userId,
      dataTypes: dataTypes,
      timestamp: Date.now(),
      verification_required: true
    };

    // 削除前の確認プロセス
    const verificationToken = await this.initiateDeleteVerification(deletionRequest);
    
    return {
      message: '削除確認メールを送信しました',
      verification_token: verificationToken,
      expires_in: 24 * 60 * 60 // 24時間
    };
  }
}
```

### Cookie・トラッキング管理
```javascript
class CookieManager {
  constructor() {
    this.cookieCategories = {
      essential: {
        name: '必須Cookie',
        description: 'サービスの基本機能に必要',
        consent_required: false,
        examples: ['session_id', 'security_token']
      },
      functional: {
        name: '機能性Cookie',
        description: 'ユーザー体験向上のため',
        consent_required: true,
        examples: ['language_preference', 'theme_setting']
      },
      analytics: {
        name: '分析Cookie',
        description: 'サービス改善のための統計',
        consent_required: true,
        examples: ['google_analytics', 'usage_statistics']
      },
      marketing: {
        name: 'マーケティングCookie',
        description: '広告配信の最適化',
        consent_required: true,
        examples: ['ad_personalization', 'conversion_tracking']
      }
    };
  }

  async requestCookieConsent(userId) {
    const consentBanner = {
      categories: this.cookieCategories,
      user_choices: await this.getExistingChoices(userId),
      granular_control: true,
      easy_rejection: true
    };

    return consentBanner;
  }

  async applyCookieSettings(userId, choices) {
    // Cookie設定を適用
    for (const [category, enabled] of Object.entries(choices)) {
      if (enabled) {
        await this.enableCookieCategory(category);
      } else {
        await this.disableCookieCategory(category);
        await this.deleteCookiesByCategory(category);
      }
    }

    // 設定を保存
    await this.saveCookiePreferences(userId, choices);
  }
}
```

## インシデント対応・セキュリティ計画

### データ侵害対応計画
```javascript
class DataBreachResponsePlan {
  constructor() {
    this.severityLevels = {
      low: { response_time: '72_hours', notification_required: false },
      medium: { response_time: '24_hours', notification_required: true },
      high: { response_time: '6_hours', notification_required: true },
      critical: { response_time: '1_hour', notification_required: true }
    };
  }

  async handleDataBreach(incident) {
    const severity = await this.assessBreachSeverity(incident);
    const responseTime = this.severityLevels[severity].response_time;
    
    // 1. 即座封じ込め
    await this.containBreach(incident);
    
    // 2. 影響評価
    const impact = await this.assessBreachImpact(incident);
    
    // 3. 法的通知要件の確認
    if (this.requiresLegalNotification(severity, impact)) {
      await this.notifyDataProtectionAuthorities(incident, impact);
    }
    
    // 4. ユーザー通知
    if (this.requiresUserNotification(severity, impact)) {
      await this.notifyAffectedUsers(incident, impact);
    }
    
    // 5. 復旧・改善
    await this.recoverFromBreach(incident);
    await this.implementPreventiveMeasures(incident);
    
    return {
      incident_id: incident.id,
      severity: severity,
      impact: impact,
      response_actions: await this.getResponseActions(incident.id)
    };
  }

  async assessBreachSeverity(incident) {
    const factors = {
      data_volume: this.assessDataVolume(incident.affected_records),
      data_sensitivity: this.assessDataSensitivity(incident.data_types),
      access_scope: this.assessAccessScope(incident.breach_method),
      potential_harm: this.assessPotentialHarm(incident.data_types)
    };

    const weightedScore = 
      factors.data_volume * 0.2 +
      factors.data_sensitivity * 0.4 +
      factors.access_scope * 0.2 +
      factors.potential_harm * 0.2;

    if (weightedScore >= 0.8) return 'critical';
    if (weightedScore >= 0.6) return 'high';
    if (weightedScore >= 0.4) return 'medium';
    return 'low';
  }

  async notifyAffectedUsers(incident, impact) {
    const affectedUsers = impact.affected_users;
    
    for (const user of affectedUsers) {
      const notification = {
        userId: user.id,
        incident_id: incident.id,
        data_types: user.affected_data_types,
        recommended_actions: this.getRecommendedUserActions(user.affected_data_types),
        support_contact: 'privacy@haqei.com',
        free_credit_monitoring: impact.severity === 'high' || impact.severity === 'critical'
      };

      await this.sendBreachNotification(notification);
    }
  }
}
```

## 監査・コンプライアンスチェック

### 自動コンプライアンス監査
```javascript
class ComplianceAuditor {
  constructor() {
    this.auditSchedule = {
      daily: ['access_logs', 'failed_login_attempts', 'data_retention'],
      weekly: ['consent_records', 'data_classification', 'security_patches'],
      monthly: ['privacy_policy_compliance', 'gdpr_compliance', 'vendor_assessment'],
      quarterly: ['penetration_testing', 'security_training', 'incident_review'],
      annually: ['full_compliance_audit', 'certification_renewal', 'policy_review']
    };
  }

  async runScheduledAudit(frequency) {
    const auditItems = this.auditSchedule[frequency];
    const results = {};

    for (const item of auditItems) {
      try {
        results[item] = await this.auditItem(item);
      } catch (error) {
        results[item] = {
          status: 'failed',
          error: error.message,
          requires_attention: true
        };
      }
    }

    // コンプライアンススコア計算
    const complianceScore = this.calculateComplianceScore(results);
    
    // 問題項目の特定
    const issues = this.identifyComplianceIssues(results);
    
    // レポート生成
    const report = {
      audit_date: Date.now(),
      frequency: frequency,
      compliance_score: complianceScore,
      results: results,
      issues: issues,
      recommendations: await this.generateRecommendations(issues)
    };

    await this.saveAuditReport(report);
    
    // 重要な問題がある場合はアラート
    if (complianceScore < 0.8 || issues.some(i => i.severity === 'high')) {
      await this.sendComplianceAlert(report);
    }

    return report;
  }

  async auditDataRetention() {
    const retentionPolicies = await this.getDataRetentionPolicies();
    const results = [];

    for (const policy of retentionPolicies) {
      const expiredData = await this.findExpiredData(policy);
      
      if (expiredData.length > 0) {
        results.push({
          policy: policy.name,
          status: 'violation',
          expired_records: expiredData.length,
          action_required: 'delete_expired_data'
        });
      } else {
        results.push({
          policy: policy.name,
          status: 'compliant'
        });
      }
    }

    return results;
  }
}
```

## セキュリティKPI・メトリクス

### セキュリティダッシュボード指標
```javascript
const SECURITY_KPI_DEFINITIONS = {
  // プライバシー関連
  privacy_compliance_score: {
    calculation: 'compliant_checks / total_checks',
    target: 0.95,
    frequency: 'daily'
  },
  
  consent_compliance_rate: {
    calculation: 'valid_consents / total_data_processing',
    target: 1.0,
    frequency: 'daily'
  },
  
  data_retention_compliance: {
    calculation: 'policies_complied / total_policies',
    target: 1.0,
    frequency: 'weekly'
  },
  
  // セキュリティ関連
  security_incident_count: {
    calculation: 'count(incidents)',
    target: 'minimize',
    frequency: 'daily'
  },
  
  mean_time_to_detection: {
    calculation: 'avg(detection_time - incident_start)',
    target: '<15_minutes',
    frequency: 'weekly'
  },
  
  mean_time_to_response: {
    calculation: 'avg(response_time - detection_time)',
    target: '<30_minutes',
    frequency: 'weekly'
  },
  
  // アクセス制御
  failed_authentication_rate: {
    calculation: 'failed_auths / total_auth_attempts',
    target: '<0.05',
    frequency: 'daily'
  }
};

class SecurityMetricsCollector {
  async generateSecurityReport() {
    const metrics = {};
    
    for (const [name, definition] of Object.entries(SECURITY_KPI_DEFINITIONS)) {
      metrics[name] = await this.calculateMetric(name, definition);
    }
    
    const report = {
      timestamp: Date.now(),
      metrics: metrics,
      overall_security_score: this.calculateOverallScore(metrics),
      recommendations: await this.generateSecurityRecommendations(metrics)
    };
    
    return report;
  }
}
```

記録日時：2025年8月7日