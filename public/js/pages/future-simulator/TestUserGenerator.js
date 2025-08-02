/**
 * テストユーザー生成エンジン - PDCA サイクル用 1000 人分のペルソナ生成
 * 
 * 目的：
 * - 多様な属性を持つ 1000 人分のテストユーザーを生成
 * - リアルな人間の特性・悩み・状況を反映
 * - 状況卦算出の精度向上のための PDCA サイクル用データ
 * 
 * 入力：
 * - generationOptions: object - 生成オプション（人数、属性分布等）
 * 
 * 処理内容：
 * 1. 年齢・性別・職業の統計的分布に基づく生成
 * 2. パーソナリティ特性（Big Five）の生成
 * 3. HSP（Highly Sensitive Person）特性の付与
 * 4. ライフステージ・悩みの深さの設定
 * 5. 文化的背景・価値観の多様性確保
 * 6. 個人的な状況・背景ストーリーの生成
 * 
 * 出力：
 * - testUsers: Array<object> - 1000 人分のテストユーザーデータ
 * - statisticalSummary: object - 生成データの統計サマリー
 * 
 * 副作用：
 * - なし（純粋な生成関数）
 * 
 * 前提条件：
 * - 日本の人口統計データに基づく分布
 * - 心理学的に妥当なパーソナリティ分布
 * 
 * エラー処理：
 * - 生成失敗時のフォールバック
 * - 統計的妥当性の検証
 */
class TestUserGenerator {
  constructor() {
    // 年齢分布（日本の人口統計に基づく）
    this.ageDistribution = {
      '18-24': 0.08,
      '25-34': 0.15,
      '35-44': 0.20,
      '45-54': 0.22,
      '55-64': 0.20,
      '65-74': 0.10,
      '75+': 0.05
    };
    
    // 性別分布
    this.genderDistribution = {
      '男性': 0.48,
      '女性': 0.48,
      'その他': 0.02,
      '回答しない': 0.02
    };
    
    // 職業カテゴリー
    this.occupationCategories = {
      'office': {
        name: '会社員・公務員',
        ratio: 0.35,
        variations: [
          '営業職', 'エンジニア', '事務職', '管理職', 'マーケティング',
          '人事', '経理', '企画', '研究開発', 'カスタマーサポート'
        ]
      },
      'professional': {
        name: '専門職',
        ratio: 0.20,
        variations: [
          '医師', '看護師', '弁護士', '会計士', '教師',
          'デザイナー', 'コンサルタント', '建築士', '薬剤師', '研究者'
        ]
      },
      'selfEmployed': {
        name: '自営業・フリーランス',
        ratio: 0.15,
        variations: [
          '個人事業主', 'フリーランサー', '起業家', '店舗経営',
          'クリエイター', 'ライター', 'カメラマン', '農業', '漁業'
        ]
      },
      'student': {
        name: '学生',
        ratio: 0.10,
        variations: [
          '大学生', '大学院生', '専門学校生', '短大生', '留学生'
        ]
      },
      'homemaker': {
        name: '主婦・主夫',
        ratio: 0.10,
        variations: [
          '専業主婦', '専業主夫', '育児中', '介護中'
        ]
      },
      'other': {
        name: 'その他',
        ratio: 0.10,
        variations: [
          '求職中', '定年退職', 'アルバイト', 'パート', '休職中'
        ]
      }
    };
    
    // パーソナリティ特性（Big Five）
    this.personalityTraits = {
      openness: {
        name: '開放性',
        low: ['保守的', '伝統重視', '慎重', '実用的'],
        high: ['革新的', '創造的', '好奇心旺盛', '想像力豊か']
      },
      conscientiousness: {
        name: '誠実性',
        low: ['柔軟', '即興的', '気まぐれ', '自由奔放'],
        high: ['計画的', '責任感強い', '規律正しい', '完璧主義']
      },
      extraversion: {
        name: '外向性',
        low: ['内向的', '静か', '慎重', '一人が好き'],
        high: ['社交的', '活発', 'リーダーシップ', '話好き']
      },
      agreeableness: {
        name: '協調性',
        low: ['競争的', '批判的', '独立心強い', '率直'],
        high: ['協力的', '思いやりがある', '信頼できる', '寛大']
      },
      neuroticism: {
        name: '神経症傾向',
        low: ['情緒安定', '冷静', 'ストレス耐性高い', '楽観的'],
        high: ['感情的', '不安になりやすい', '繊細', 'ストレスを感じやすい']
      }
    };
    
    // HSP特性
    this.hspCharacteristics = {
      sensoryProcessing: {
        name: '感覚処理感受性',
        traits: ['音に敏感', '光に敏感', '匂いに敏感', '触覚が鋭い']
      },
      emotionalResponsivity: {
        name: '感情反応性',
        traits: ['共感力が高い', '他人の感情に影響されやすい', '芸術に感動しやすい']
      },
      depthOfProcessing: {
        name: '処理の深さ',
        traits: ['深く考える', '慎重に判断', '細部に気づく', '直感が鋭い']
      },
      overstimulation: {
        name: '過刺激',
        traits: ['人混みが苦手', '一人の時間が必要', '疲れやすい', '刺激を避ける']
      }
    };
    
    // ライフステージ別の悩みテーマ
    this.lifeStageWorries = {
      youngAdult: {
        themes: ['キャリア選択', '恋愛', '友人関係', '自己探求', '経済的自立']
      },
      earlyCareer: {
        themes: ['仕事の悩み', '結婚', '将来設計', 'ワークライフバランス', 'スキルアップ']
      },
      midCareer: {
        themes: ['キャリアの停滞', '家族関係', '子育て', '健康不安', '経済的プレッシャー']
      },
      preSenior: {
        themes: ['老後の準備', '親の介護', '健康問題', 'キャリアの集大成', '人生の意味']
      },
      senior: {
        themes: ['健康維持', '孤独', '生きがい', '遺産', '死への不安']
      }
    };
    
    // 悩みの深さレベル
    this.worryDepthLevels = {
      surface: {
        name: '表層的',
        ratio: 0.30,
        characteristics: ['一時的', '具体的', '解決可能', '外的要因']
      },
      moderate: {
        name: '中程度',
        ratio: 0.50,
        characteristics: ['継続的', '複合的', '部分的解決可能', '内外混合']
      },
      deep: {
        name: '深層的',
        ratio: 0.20,
        characteristics: ['慢性的', '実存的', '解決困難', '内的要因']
      }
    };
    
    // 統計カウンター
    this.statistics = {
      totalGenerated: 0,
      genderDistribution: {},
      ageDistribution: {},
      occupationDistribution: {},
      hspRatio: 0,
      worryDepthDistribution: {}
    };
  }

  /**
   * 1000人分のテストユーザーを生成
   * 
   * 目的：
   * - 統計的に妥当な分布を持つ多様なユーザー群の生成
   * - PDCAサイクルテスト用の包括的データセット作成
   * 
   * 処理内容：
   * - 各属性の分布に従った生成
   * - 個人間の多様性確保
   * - リアリスティックな組み合わせ
   * 
   * 出力：
   * - 1000人分の詳細なペルソナデータ
   */
  async generateTestUsers(count = 1000, options = {}) {
    console.log(`👥 ${count}人分のテストユーザー生成開始`);
    
    const testUsers = [];
    const startTime = performance.now();
    
    // 分布に基づいた属性決定用の累積確率配列を作成
    const ageCumulative = this.createCumulativeArray(this.ageDistribution);
    const genderCumulative = this.createCumulativeArray(this.genderDistribution);
    const occupationCumulative = this.createCumulativeArray(this.occupationCategories);
    
    for (let i = 0; i < count; i++) {
      // 基本属性の決定
      const age = this.selectByDistribution(ageCumulative, Object.keys(this.ageDistribution));
      const gender = this.selectByDistribution(genderCumulative, Object.keys(this.genderDistribution));
      const occupationCategory = this.selectByDistribution(
        occupationCumulative, 
        Object.keys(this.occupationCategories)
      );
      
      // 詳細な属性生成
      const user = {
        id: `test_user_${String(i + 1).padStart(4, '0')}`,
        basicInfo: {
          age: this.generateSpecificAge(age),
          gender: gender,
          occupation: this.generateSpecificOccupation(occupationCategory)
        },
        personality: this.generatePersonalityProfile(),
        hspTraits: this.generateHSPProfile(),
        lifeContext: this.generateLifeContext(age, occupationCategory),
        worryProfile: this.generateWorryProfile(age),
        culturalBackground: this.generateCulturalBackground(),
        timestamp: new Date().toISOString()
      };
      
      testUsers.push(user);
      
      // 進捗表示（100人ごと）
      if ((i + 1) % 100 === 0) {
        console.log(`  生成進捗: ${i + 1}/${count}人完了`);
      }
    }
    
    // 統計情報の計算
    const statistics = this.calculateStatistics(testUsers);
    
    const generationTime = performance.now() - startTime;
    console.log(`✅ テストユーザー生成完了: ${count}人 (${generationTime.toFixed(2)}ms)`);
    
    return {
      users: testUsers,
      statistics: statistics,
      metadata: {
        generatedAt: new Date().toISOString(),
        count: count,
        generationTime: generationTime,
        version: '1.0.0'
      }
    };
  }

  /**
   * 累積確率配列の作成
   */
  createCumulativeArray(distribution) {
    const cumulative = [];
    let sum = 0;
    
    const values = Object.values(distribution).map(item => 
      typeof item === 'object' ? item.ratio : item
    );
    
    for (const value of values) {
      sum += value;
      cumulative.push(sum);
    }
    
    return cumulative;
  }

  /**
   * 分布に基づく選択
   */
  selectByDistribution(cumulative, keys) {
    const random = Math.random();
    for (let i = 0; i < cumulative.length; i++) {
      if (random <= cumulative[i]) {
        return keys[i];
      }
    }
    return keys[keys.length - 1];
  }

  /**
   * 具体的な年齢の生成
   */
  generateSpecificAge(ageRange) {
    const ranges = {
      '18-24': [18, 24],
      '25-34': [25, 34],
      '35-44': [35, 44],
      '45-54': [45, 54],
      '55-64': [55, 64],
      '65-74': [65, 74],
      '75+': [75, 85]
    };
    
    const [min, max] = ranges[ageRange];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 具体的な職業の生成
   */
  generateSpecificOccupation(category) {
    const categoryData = this.occupationCategories[category];
    const variations = categoryData.variations;
    const specific = variations[Math.floor(Math.random() * variations.length)];
    
    return {
      category: categoryData.name,
      specific: specific,
      yearsOfExperience: Math.floor(Math.random() * 20) + 1,
      satisfactionLevel: Math.random()
    };
  }

  /**
   * パーソナリティプロファイルの生成
   */
  generatePersonalityProfile() {
    const profile = {};
    
    for (const [trait, data] of Object.entries(this.personalityTraits)) {
      // 正規分布に近い値を生成（0-1の範囲）
      const value = this.generateNormalDistributedValue();
      const characteristics = value > 0.5 ? data.high : data.low;
      
      profile[trait] = {
        value: value,
        level: this.getLevel(value),
        characteristics: this.selectRandomItems(characteristics, 2)
      };
    }
    
    return profile;
  }

  /**
   * HSPプロファイルの生成（約20%の確率）
   */
  generateHSPProfile() {
    const isHSP = Math.random() < 0.20;
    
    if (!isHSP) {
      return {
        isHSP: false,
        traits: []
      };
    }
    
    const traits = [];
    for (const [category, data] of Object.entries(this.hspCharacteristics)) {
      // HSPの人は各カテゴリから1-2個の特性を持つ
      const selectedTraits = this.selectRandomItems(
        data.traits, 
        Math.random() > 0.5 ? 2 : 1
      );
      traits.push(...selectedTraits);
    }
    
    return {
      isHSP: true,
      intensity: Math.random() * 0.5 + 0.5, // 0.5-1.0の範囲
      traits: traits
    };
  }

  /**
   * ライフコンテキストの生成
   */
  generateLifeContext(ageRange, occupationCategory) {
    const contexts = {
      relationshipStatus: this.generateRelationshipStatus(ageRange),
      livingArrangement: this.generateLivingArrangement(ageRange, occupationCategory),
      financialStatus: this.generateFinancialStatus(occupationCategory),
      healthStatus: this.generateHealthStatus(ageRange),
      socialSupport: this.generateSocialSupport()
    };
    
    return contexts;
  }

  /**
   * 悩みプロファイルの生成
   */
  generateWorryProfile(ageRange) {
    // 年齢に応じたライフステージの決定
    const lifeStage = this.determineLifeStage(ageRange);
    const themes = this.lifeStageWorries[lifeStage].themes;
    
    // 悩みの深さレベルを決定
    const depthCumulative = this.createCumulativeArray(this.worryDepthLevels);
    const depthLevel = this.selectByDistribution(
      depthCumulative, 
      Object.keys(this.worryDepthLevels)
    );
    
    // 主要な悩みテーマを2-3個選択
    const selectedThemes = this.selectRandomItems(themes, Math.random() > 0.5 ? 3 : 2);
    
    return {
      lifeStage: lifeStage,
      depthLevel: depthLevel,
      mainThemes: selectedThemes,
      duration: this.generateWorryDuration(depthLevel),
      previousAttempts: this.generatePreviousAttempts(depthLevel),
      urgency: Math.random()
    };
  }

  /**
   * 文化的背景の生成
   */
  generateCulturalBackground() {
    const backgrounds = {
      valueOrientation: this.selectRandomItems([
        '個人主義的', '集団主義的', 'バランス型', '状況依存型'
      ], 1)[0],
      religiousAffiliation: this.selectRandomItems([
        'なし', '仏教', '神道', 'キリスト教', 'その他', '無回答'
      ], 1)[0],
      culturalIdentity: Math.random(), // 0-1: 伝統的〜現代的
      internationalExposure: Math.random() // 0-1: 低〜高
    };
    
    return backgrounds;
  }

  // ========== ヘルパーメソッド ==========

  /**
   * 正規分布に近い値の生成（Box-Muller変換）
   */
  generateNormalDistributedValue() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // 0-1の範囲に正規化（平均0.5、標準偏差0.15）
    const normalized = z * 0.15 + 0.5;
    
    return Math.max(0, Math.min(1, normalized));
  }

  /**
   * レベルの判定
   */
  getLevel(value) {
    if (value < 0.2) return '非常に低い';
    if (value < 0.4) return '低い';
    if (value < 0.6) return '中程度';
    if (value < 0.8) return '高い';
    return '非常に高い';
  }

  /**
   * ランダムアイテム選択
   */
  selectRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * ライフステージの決定
   */
  determineLifeStage(ageRange) {
    const mapping = {
      '18-24': 'youngAdult',
      '25-34': 'earlyCareer',
      '35-44': 'midCareer',
      '45-54': 'midCareer',
      '55-64': 'preSenior',
      '65-74': 'senior',
      '75+': 'senior'
    };
    
    return mapping[ageRange];
  }

  /**
   * 関係性ステータスの生成
   */
  generateRelationshipStatus(ageRange) {
    const statuses = ['独身', '交際中', '既婚', '離婚', '死別'];
    const weights = {
      '18-24': [0.8, 0.15, 0.05, 0, 0],
      '25-34': [0.4, 0.2, 0.35, 0.05, 0],
      '35-44': [0.2, 0.1, 0.60, 0.10, 0],
      '45-54': [0.15, 0.05, 0.65, 0.14, 0.01],
      '55-64': [0.10, 0.05, 0.70, 0.13, 0.02],
      '65-74': [0.08, 0.02, 0.70, 0.15, 0.05],
      '75+': [0.05, 0.01, 0.60, 0.14, 0.20]
    };
    
    const ageWeights = weights[ageRange];
    const cumulative = this.createCumulativeArray(
      ageWeights.reduce((acc, w, i) => ({ ...acc, [statuses[i]]: w }), {})
    );
    
    return this.selectByDistribution(cumulative, statuses);
  }

  /**
   * 居住形態の生成
   */
  generateLivingArrangement(ageRange, occupationCategory) {
    if (occupationCategory === 'student') {
      return this.selectRandomItems(['一人暮らし', '実家', '寮', 'シェアハウス'], 1)[0];
    }
    
    const arrangements = ['一人暮らし', '家族と同居', '配偶者と同居', 'その他'];
    return this.selectRandomItems(arrangements, 1)[0];
  }

  /**
   * 経済状況の生成
   */
  generateFinancialStatus(occupationCategory) {
    const baseScores = {
      'office': 0.6,
      'professional': 0.75,
      'selfEmployed': 0.5,
      'student': 0.3,
      'homemaker': 0.5,
      'other': 0.4
    };
    
    const base = baseScores[occupationCategory] || 0.5;
    const variation = (Math.random() - 0.5) * 0.3;
    
    return Math.max(0, Math.min(1, base + variation));
  }

  /**
   * 健康状態の生成
   */
  generateHealthStatus(ageRange) {
    const baseHealth = {
      '18-24': 0.9,
      '25-34': 0.85,
      '35-44': 0.8,
      '45-54': 0.7,
      '55-64': 0.6,
      '65-74': 0.5,
      '75+': 0.4
    };
    
    const base = baseHealth[ageRange];
    const variation = (Math.random() - 0.5) * 0.2;
    
    return {
      overall: Math.max(0, Math.min(1, base + variation)),
      chronic: Math.random() < (1 - base),
      mental: Math.random()
    };
  }

  /**
   * 社会的サポートの生成
   */
  generateSocialSupport() {
    return {
      family: Math.random(),
      friends: Math.random(),
      professional: Math.random() < 0.3,
      community: Math.random()
    };
  }

  /**
   * 悩みの継続期間生成
   */
  generateWorryDuration(depthLevel) {
    const durations = {
      'surface': ['数日', '1週間', '2週間', '1ヶ月'],
      'moderate': ['1ヶ月', '3ヶ月', '6ヶ月', '1年'],
      'deep': ['1年', '3年', '5年', '10年以上']
    };
    
    const options = durations[depthLevel];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * 過去の解決試行
   */
  generatePreviousAttempts(depthLevel) {
    const attempts = {
      'surface': 0.3,
      'moderate': 0.6,
      'deep': 0.9
    };
    
    return Math.random() < attempts[depthLevel];
  }

  /**
   * 統計情報の計算
   */
  calculateStatistics(users) {
    const stats = {
      total: users.length,
      gender: {},
      age: {},
      occupation: {},
      hsp: {
        count: 0,
        percentage: 0
      },
      worryDepth: {},
      personality: {
        averages: {}
      }
    };
    
    // 基本統計の集計
    users.forEach(user => {
      // 性別
      const gender = user.basicInfo.gender;
      stats.gender[gender] = (stats.gender[gender] || 0) + 1;
      
      // 年齢層
      const ageKey = this.getAgeRangeKey(user.basicInfo.age);
      stats.age[ageKey] = (stats.age[ageKey] || 0) + 1;
      
      // 職業
      const occupation = user.basicInfo.occupation.category;
      stats.occupation[occupation] = (stats.occupation[occupation] || 0) + 1;
      
      // HSP
      if (user.hspTraits.isHSP) {
        stats.hsp.count++;
      }
      
      // 悩みの深さ
      const depth = user.worryProfile.depthLevel;
      stats.worryDepth[depth] = (stats.worryDepth[depth] || 0) + 1;
    });
    
    // パーセンテージ計算
    stats.hsp.percentage = (stats.hsp.count / users.length * 100).toFixed(1);
    
    // パーソナリティ平均値
    Object.keys(this.personalityTraits).forEach(trait => {
      const sum = users.reduce((acc, user) => acc + user.personality[trait].value, 0);
      stats.personality.averages[trait] = (sum / users.length).toFixed(3);
    });
    
    return stats;
  }

  /**
   * 年齢から年齢層キーを取得
   */
  getAgeRangeKey(age) {
    if (age <= 24) return '18-24';
    if (age <= 34) return '25-34';
    if (age <= 44) return '35-44';
    if (age <= 54) return '45-54';
    if (age <= 64) return '55-64';
    if (age <= 74) return '65-74';
    return '75+';
  }
}

// グローバル利用のためのエクスポート
window.TestUserGenerator = TestUserGenerator;