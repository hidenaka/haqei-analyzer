# HAQEI OS Analyzer 実証研究設計書

## 🔬 研究目的と仮説

### 主要研究目的
1. **HAQEI Triple OS Architectureの心理測定学的妥当性検証**
2. **36問版の信頼性・妥当性確立**
3. **文化間での普遍性確認**
4. **神経科学的基盤の実証的裏付け**

### 検証すべき仮説

#### 仮説1: 因子構造（構成概念妥当性）
```
H1: HAQEI-36は3因子構造を示す
- Engine OS (12項目)
- Interface OS (12項目)  
- Safe Mode OS (12項目)

予測：確認的因子分析でCFI ≥ 0.95, RMSEA ≤ 0.06
```

#### 仮説2: 内的一貫性（信頼性）
```
H2: 各因子のCronbach's α ≥ 0.80
- Engine OS: α ≥ 0.85
- Interface OS: α ≥ 0.80
- Safe Mode OS: α ≥ 0.80
```

#### 仮説3: 基準関連妥当性
```
H3: Big Fiveとの理論的に妥当な相関を示す
- Engine OS - Openness: r = 0.5-0.7
- Interface OS - Agreeableness: r = 0.4-0.6
- Safe Mode OS - Neuroticism: r = 0.3-0.5
- Safe Mode OS - Conscientiousness: r = 0.4-0.6
```

#### 仮説4: 弁別妥当性
```
H4: 因子間相関は中程度以下
- Engine-Interface: r = 0.2-0.4
- Engine-SafeMode: r = -0.1-0.2
- Interface-SafeMode: r = 0.1-0.3
```

## 📊 研究設計

### Study 1: 基本的妥当性検証研究
**目的**: 36問版の基本的な心理測定学的特性を確認

#### 参加者
- **サンプルサイズ**: N = 500 (因子分析に適切)
- **募集方法**: オンライン調査プラットフォーム
- **インクルージョン基準**: 18-65歳、日本語理解可能
- **エクスクルージョン基準**: 認知機能障害の既往

#### 測定変数
```javascript
const STUDY1_MEASURES = {
  primary: {
    HAQEI_36: "36項目Triple OS分析",
    Big_Five: "NEO-PI-R短縮版 (60項目)"
  },
  demographic: {
    age: "年齢",
    gender: "性別", 
    education: "教育水準",
    occupation: "職業"
  },
  validity_checks: {
    attention_check: "注意チェック項目 (3項目)",
    social_desirability: "社会的望ましさバイアス (10項目)"
  }
};
```

#### 統計解析計画
```r
# 1. 記述統計・相関分析
descriptive_stats <- function(data) {
  psych::describe(data)
  corrr::correlate(data)
}

# 2. 信頼性分析
reliability_analysis <- function(data) {
  # Cronbach's α
  alpha_engine <- psych::alpha(data[, engine_items])
  alpha_interface <- psych::alpha(data[, interface_items])  
  alpha_safemode <- psych::alpha(data[, safemode_items])
  
  # ω係数（より厳密な内的一貫性指標）
  omega_engine <- psych::omega(data[, engine_items])
}

# 3. 因子分析
factor_analysis <- function(data) {
  # 探索的因子分析
  efa_result <- psych::fa(data, nfactors = 3, rotate = "oblimin")
  
  # 確認的因子分析
  cfa_model <- '
    engine =~ q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10 + q11 + q12
    interface =~ q13 + q14 + q15 + q16 + q17 + q18 + q19 + q20 + q21 + q22 + q23 + q24
    safemode =~ q25 + q26 + q27 + q28 + q29 + q30 + q31 + q32 + q33 + q34 + q35 + q36
  '
  cfa_result <- lavaan::cfa(cfa_model, data = data)
  
  return(list(efa = efa_result, cfa = cfa_result))
}

# 4. 基準関連妥当性
criterion_validity <- function(haqei_data, big5_data) {
  correlations <- cor(haqei_data, big5_data)
  
  # 理論的に期待される相関の検定
  expected_correlations <- list(
    engine_openness = cor.test(haqei_data$engine, big5_data$openness),
    interface_agreeableness = cor.test(haqei_data$interface, big5_data$agreeableness),
    safemode_neuroticism = cor.test(haqei_data$safemode, big5_data$neuroticism)
  )
  
  return(expected_correlations)
}
```

### Study 2: 行動指標との関連研究
**目的**: 実際の行動・パフォーマンスとの関連を検証

#### 実験設計
```javascript
const BEHAVIORAL_TASKS = {
  engine_tasks: [
    {
      name: "Alternative Uses Task (AUT)",
      description: "創造的思考課題",
      measurement: "独創性スコア", 
      expected_correlation: "Engine OS: r ≥ 0.4"
    },
    {
      name: "Iowa Gambling Task",
      description: "リスク取り行動", 
      measurement: "リスク選好度",
      expected_correlation: "Engine OS: r ≥ 0.3"
    }
  ],
  interface_tasks: [
    {
      name: "Ultimatum Game",
      description: "社会的公平性",
      measurement: "協力行動頻度",
      expected_correlation: "Interface OS: r ≥ 0.3"
    },
    {
      name: "Group Problem Solving",
      description: "集団課題パフォーマンス",
      measurement: "チーム貢献度評価",
      expected_correlation: "Interface OS: r ≥ 0.4"
    }
  ],
  safemode_tasks: [
    {
      name: "Loss Aversion Task", 
      description: "損失回避行動",
      measurement: "保守的選択率",
      expected_correlation: "Safe Mode OS: r ≥ 0.3"
    },
    {
      name: "Threat Detection Task",
      description: "脅威検出能力",
      measurement: "反応時間・正確性",
      expected_correlation: "Safe Mode OS: r ≥ 0.2"
    }
  ]
};
```

### Study 3: 縦断研究（安定性・変化）
**目的**: 測定の時間的安定性と発達的変化を検証

#### 研究デザイン
- **期間**: 12ヶ月間（4回測定：0, 3, 6, 12ヶ月）
- **サンプル**: N = 300（年齢層別サンプリング）
- **年齢群**: 18-29歳, 30-44歳, 45-65歳

#### 分析モデル
```r
# 潜在成長曲線モデル
lgc_model <- '
  # 切片因子（初期レベル）
  intercept_engine =~ 1*engine_t1 + 1*engine_t2 + 1*engine_t3 + 1*engine_t4
  
  # 傾き因子（変化率）
  slope_engine =~ 0*engine_t1 + 1*engine_t2 + 2*engine_t3 + 3*engine_t4
  
  # 年齢効果のモデリング
  intercept_engine ~ age_group
  slope_engine ~ age_group
'

# 測定不変性検定
measurement_invariance <- function(data) {
  # 配置不変性
  configural <- lavaan::cfa(base_model, data = data, group = "time_point")
  
  # 測定不変性  
  metric <- lavaan::cfa(base_model, data = data, group = "time_point", 
                       group.equal = "loadings")
  
  # スカラー不変性
  scalar <- lavaan::cfa(base_model, data = data, group = "time_point",
                       group.equal = c("loadings", "intercepts"))
  
  return(list(configural, metric, scalar))
}
```

## 🧠 Study 4: 神経科学的検証研究（fMRI）

### 実験設計
**目的**: Triple OS Architectureの神経基盤を実証

#### 参加者
- **サンプル**: N = 60（各OS高得点者20名ずつ）
- **選出基準**: Study 1の結果から各OS上位20%

#### fMRIタスク設計
```javascript
const FMRI_PARADIGM = {
  engine_activation: {
    task: "Creative Idea Generation",
    stimuli: "日常的物品の創造的用途を考案",
    contrasts: [
      "Creative > Control",
      "Novel > Conventional", 
      "Divergent > Convergent"
    ],
    expected_regions: [
      "左下前頭回 (Broca's area extension)",
      "前帯状皮質 (ACC)",
      "右側頭極 (temporal pole)"
    ]
  },
  
  interface_activation: {
    task: "Theory of Mind",
    stimuli: "他者の心的状態推論課題",
    contrasts: [
      "Mentalizing > Physical reasoning",
      "Complex social > Simple social"
    ],
    expected_regions: [
      "内側前頭前皮質 (mPFC)", 
      "側頭頭頂接合部 (TPJ)",
      "上側頭溝 (STS)"
    ]
  },
  
  safemode_activation: {
    task: "Threat Detection", 
    stimuli: "潜在的脅威の識別・評価",
    contrasts: [
      "Threat > Neutral",
      "Uncertain threat > Certain threat"
    ],
    expected_regions: [
      "扁桃体 (Amygdala)",
      "前部島皮質 (Anterior insula)",
      "前帯状皮質背側部 (dACC)"
    ]
  }
};
```

#### 神経連結性分析
```matlab
% 安静時結合性解析
function resting_state_analysis(fmri_data, behavioral_scores)
    % DMN (Default Mode Network) 解析
    dmn_regions = {'mPFC', 'PCC', 'angular_gyrus', 'hippocampus'};
    dmn_connectivity = calculate_network_connectivity(fmri_data, dmn_regions);
    
    % SN (Salience Network) 解析  
    sn_regions = {'ACC', 'anterior_insula', 'supramarginal_gyrus'};
    sn_connectivity = calculate_network_connectivity(fmri_data, sn_regions);
    
    % ECN (Executive Control Network) 解析
    ecn_regions = {'dlPFC', 'posterior_parietal', 'supplementary_motor'};
    ecn_connectivity = calculate_network_connectivity(fmri_data, ecn_regions);
    
    % 行動スコアとの相関分析
    correlate_brain_behavior(dmn_connectivity, behavioral_scores.interface);
    correlate_brain_behavior(sn_connectivity, behavioral_scores.safemode);
    correlate_brain_behavior(ecn_connectivity, behavioral_scores.engine);
end
```

## 🌍 Study 5: 文化間比較研究

### 研究目的
- HAQEI-36の文化的普遍性検証
- 文化特有のバイアス検出・修正
- 国際版開発のための基礎データ収集

#### 対象文化
```javascript
const CULTURAL_SAMPLES = {
  east_asian: {
    countries: ["Japan", "South Korea", "Taiwan"],
    n_per_country: 200,
    cultural_dimensions: {
      individualism_collectivism: "Collectivistic",
      uncertainty_avoidance: "High", 
      long_term_orientation: "High"
    }
  },
  
  western: {
    countries: ["USA", "Germany", "UK"],
    n_per_country: 200,
    cultural_dimensions: {
      individualism_collectivism: "Individualistic", 
      uncertainty_avoidance: "Medium-Low",
      long_term_orientation: "Medium"
    }
  },
  
  developing: {
    countries: ["Brazil", "India", "Nigeria"],
    n_per_country: 150,
    cultural_dimensions: {
      individualism_collectivism: "Mixed",
      uncertainty_avoidance: "Medium-High",
      long_term_orientation: "Medium"
    }
  }
};
```

#### 差分項目機能分析 (DIF Analysis)
```r
# 文化間DIF検定
cultural_dif_analysis <- function(data, group_var) {
  library(lordif)
  library(difR)
  
  # 各項目のDIF検定
  dif_results <- map(1:36, function(item) {
    difLogistic(data[, paste0("q", item)], 
               group = data[[group_var]],
               focal.name = "non_western")
  })
  
  # DIF効果サイズ評価
  effect_sizes <- map_dbl(dif_results, function(x) {
    abs(x$alphaMH - 1) # Mantel-Haenszel統計量
  })
  
  # 問題項目の特定（effect size > 0.64は大きなDIF）
  problematic_items <- which(effect_sizes > 0.64)
  
  return(list(
    dif_results = dif_results,
    effect_sizes = effect_sizes,
    problematic_items = problematic_items
  ))
}
```

## 📈 統計解析・品質保証

### 事前登録（Pre-registration）
```yaml
osf_preregistration:
  title: "Validation of HAQEI Triple OS Architecture"
  hypotheses: [仮説1-4の詳細記載]
  sample_size_justification: "G*Power分析結果"
  analysis_plan: "統計解析の詳細手順"
  exclusion_criteria: "データ除外基準"
  multiple_comparison_correction: "Benjamini-Hochberg FDR"
```

### 品質管理
```javascript
const QUALITY_ASSURANCE = {
  data_collection: {
    attention_checks: "3項目以上", 
    completion_time: "最短10分、最長60分",
    duplicate_detection: "IPアドレス・デバイス・行動パターン",
    bot_detection: "CAPTCHAおよび行動分析"
  },
  
  statistical_power: {
    alpha_level: 0.05,
    power: 0.80,
    effect_size: "中程度 (r = 0.3)",
    sample_size: "各研究で適切なサイズ確保"
  },
  
  reproducibility: {
    analysis_code: "完全公開（GitHub）",
    data_availability: "匿名化後オープンデータ",
    computational_reproducibility: "Docker環境"
  }
};
```

## 🎯 期待される成果

### 学術的貢献
1. **理論的革新**: 東洋哲学と現代心理学の統合モデル
2. **測定技術**: 新しい人格測定パラダイムの確立
3. **文化心理学**: 文化横断的妥当性の検証
4. **神経科学**: Triple OSの神経基盤解明

### 実践的応用
1. **人材評価**: 企業における適性評価ツール
2. **教育**: 個人の学習スタイル分析
3. **カウンセリング**: 自己理解促進ツール
4. **組織開発**: チーム編成・役割分担最適化

### 予想される論文発表
```
1. "Development and Validation of HAQEI Triple OS Architecture Scale"
   (Journal of Personality Assessment)
   
2. "Neural Correlates of Triple OS Personality System: An fMRI Study"
   (NeuroImage)
   
3. "Cultural Universality of Triple OS Architecture: Cross-cultural Validation"
   (Journal of Cross-Cultural Psychology)
   
4. "Eastern Philosophy Meets Western Psychology: Integration of I-Ching and Personality Science"
   (Philosophical Psychology)
```

---

**研究計画策定日**: 2025年8月6日  
**研究責任者**: Research & Analysis Agent  
**倫理審査**: 各機関IRB承認予定  
**研究期間**: 24ヶ月（2025年9月-2027年8月）  
**総予算**: ¥15,000,000（fMRI研究含む）