/**
 * 正統易経8変化パターンシステム - Authentic8ScenariosSystem.js
 * 
 * 易経の変化理論に基づく8つの正統変化パターン
 * - 爻辞に従う/逆らう基本パターン
 * - 互卦・錯卦・綜卦による変化パターン
 * - 急速・漸進変化パターン
 * - 序卦伝論理による変化パターン
 * 
 * Author: HAQEI I Ching Expert Agent
 * Created: 2025-08-04
 */

class Authentic8ScenariosSystem {
  constructor(container, iChingEngine) {
    this.container = container;
    this.engine = iChingEngine;
    this.currentScenarios = null;
    this.selectedScenario = null;
    
    this.initializeScenarioSystem();
    
    console.log("🌟 正統易経8変化パターンシステム初期化完了");
  }

  /**
   * シナリオシステムの初期化
   */
  initializeScenarioSystem() {
    this.container.innerHTML = this.createScenarioStructure();
    this.attachEventListeners();
  }

  /**
   * シナリオシステムの構造作成
   */
  createScenarioStructure() {
    return `
      <div class="authentic-scenarios-container">
        <!-- ヘッダー -->
        <div class="scenarios-header">
          <h2 class="scenarios-title">
            <span class="icon">🌟</span>
            8つの変化パターン
          </h2>
          <div class="scenarios-subtitle">
            易経の変化理論に基づく正統な未来の可能性
          </div>
        </div>

        <!-- 変化の分類説明 -->
        <div class="transformation-categories" id="transformationCategories">
          <!-- 動的に生成 -->
        </div>

        <!-- シナリオグリッド -->
        <div class="scenarios-grid" id="scenariosGrid">
          <!-- 動的に生成 -->
        </div>

        <!-- 選択されたシナリオの詳細 -->
        <div class="scenario-detail" id="scenarioDetail" style="display: none;">
          <!-- 動的に生成 -->
        </div>
      </div>
    `;
  }

  /**
   * 8つの変化パターンを生成
   */
  generate8TransformationPatterns(currentHexagram, currentLine, baseLineData) {
    console.log("🔮 8変化パターン生成開始:", { currentHexagram, currentLine });
    
    try {
      const patterns = [
        // パターン1: 爻辞に従う正統変化
        this.generateOrthodoxyPattern(currentHexagram, currentLine, baseLineData),
        
        // パターン2: 爻辞に逆らう逆行変化  
        this.generateContradictionPattern(currentHexagram, currentLine, baseLineData),
        
        // パターン3: 互卦による隠れた変化
        this.generateMutualHexagramPattern(currentHexagram, baseLineData),
        
        // パターン4: 錯卦による対極変化
        this.generateOppositeHexagramPattern(currentHexagram, baseLineData),
        
        // パターン5: 綜卦による視点転換変化
        this.generateReversedHexagramPattern(currentHexagram, baseLineData),
        
        // パターン6: 急速変化（革卦的）
        this.generateRapidTransformationPattern(currentHexagram, currentLine, baseLineData),
        
        // パターン7: 漸進変化（漸卦的）
        this.generateGradualTransformationPattern(currentHexagram, currentLine, baseLineData),
        
        // パターン8: 循環変化（序卦伝論理）
        this.generateSequentialTransformationPattern(currentHexagram, baseLineData)
      ];
      
      this.currentScenarios = patterns;
      this.displayTransformationCategories();
      this.displayScenarios(patterns);
      
      console.log("✅ 8変化パターン生成完了:", patterns);
      return patterns;
      
    } catch (error) {
      console.error("❌ 8変化パターン生成エラー:", error);
      return this.generateFallbackPatterns(currentHexagram, currentLine);
    }
  }

  /**
   * パターン1: 爻辞に従う正統変化
   */
  generateOrthodoxyPattern(currentHex, currentLine, baseData) {
    const transformation = this.engine.calculateTransformation(currentHex, [currentLine]);
    
    return {
      id: 1,
      title: "正統の道",
      subtitle: "爻辞の教えに従う変化",
      type: "orthodox_transformation",
      category: "正統変化",
      confidence: 0.92,
      
      hexagramChange: {
        from: {
          number: currentHex,
          name: this.engine.hexagramNames[currentHex],
          binary: this.engine.hexagramBinary[currentHex]
        },
        to: transformation.toHexagram,
        changingLines: [currentLine],
        changeType: "正変化"
      },
      
      description: `${baseData?.現代解釈の要約 || '爻辞の教えに従い'}、自然な変化の流れに沿って進む道です。`,
      
      guidance: {
        immediate: "爻辞の教えを素直に受け入れ、実践する",
        preparation: "変化の準備を整え、心構えを固める", 
        execution: "適切なタイミングで積極的に行動する",
        completion: "変化を完成させ、新しい状況に適応する"
      },
      
      outcome: {
        risk: this.calculateRisk(baseData?.S4_リスク, true),
        potential: this.calculatePotential(baseData?.S2_ポテンシャル, true),
        stability: baseData?.S3_安定性スコア || 60,
        timeline: "3-6ヶ月"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("orthodox", baseData),
      
      iChingWisdom: `${this.engine.hexagramNames[currentHex]}から${transformation.toHexagram?.name || '新しい状況'}への正統な変化。古来より伝わる智慧の道です。`
    };
  }

  /**
   * パターン2: 爻辞に逆らう逆行変化
   */
  generateContradictionPattern(currentHex, currentLine, baseData) {
    const alternativeTransformation = this.calculateAlternativeTransformation(currentHex, currentLine);
    
    return {
      id: 2,
      title: "逆行の道",
      subtitle: "爻辞に逆らう変化",
      type: "contradiction_transformation", 
      category: "逆行変化",
      confidence: 0.65,
      
      hexagramChange: {
        from: {
          number: currentHex,
          name: this.engine.hexagramNames[currentHex],
          binary: this.engine.hexagramBinary[currentHex]
        },
        to: alternativeTransformation,
        changingLines: [currentLine],
        changeType: "逆変化"
      },
      
      description: "爻辞の警告を無視し、現状の姿勢を維持・強化する道です。短期的な利益はあっても、長期的にはリスクを伴います。",
      
      guidance: {
        immediate: "現状の方針を貫き、困難に抵抗する",
        preparation: "リスクを承知で強行突破の準備をする",
        execution: "反対や困難を力で押し切る", 
        completion: "結果の責任を受け入れる覚悟を持つ"
      },
      
      outcome: {
        risk: this.calculateRisk(baseData?.S4_リスク, false),
        potential: this.calculatePotential(baseData?.S2_ポテンシャル, false),
        stability: Math.max((baseData?.S3_安定性スコア || 50) - 20, 10),
        timeline: "1-3ヶ月（短期集中）"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("contradiction", baseData),
      
      iChingWisdom: "易経の教えに逆らう道。時として必要だが、その代償を理解して進むべき道です。"
    };
  }

  /**
   * パターン3: 互卦による隠れた変化
   */
  generateMutualHexagramPattern(currentHex, baseData) {
    const mutualHex = this.calculateMutualHexagram(currentHex);
    
    return {
      id: 3,
      title: "隠れた変化",
      subtitle: "互卦による潜在的変化",
      type: "mutual_hexagram_transformation",
      category: "関係変化",
      confidence: 0.78,
      
      hexagramChange: {
        from: {
          number: currentHex,
          name: this.engine.hexagramNames[currentHex],
          binary: this.engine.hexagramBinary[currentHex]
        },
        to: {
          number: mutualHex,
          name: this.engine.hexagramNames[mutualHex],
          binary: this.engine.hexagramBinary[mutualHex]
        },
        changingLines: [2, 3, 4], // 内卦の中心三爻
        changeType: "潜在変化"
      },
      
      description: "表面的には見えない、内在する可能性が徐々に現実化する変化です。隠れた才能や機会が開花します。",
      
      guidance: {
        immediate: "潜在的な可能性に目を向ける",
        preparation: "内面の充実と能力開発に努める",
        execution: "機会を見極めて潜在力を発揮する",
        completion: "隠れていた価値を顕在化させる"
      },
      
      outcome: {
        risk: (baseData?.S4_リスク || -30) * 0.7, // リスク軽減
        potential: Math.min((baseData?.S2_ポテンシャル || 50) + 20, 90),
        stability: (baseData?.S3_安定性スコア || 50) + 10,
        timeline: "6-12ヶ月（段階的）"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("mutual", baseData),
      
      iChingWisdom: `${this.engine.hexagramNames[currentHex]}の中に隠された${this.engine.hexagramNames[mutualHex]}の性質。内なる変化の道です。`
    };
  }

  /**
   * パターン4: 錯卦による対極変化
   */
  generateOppositeHexagramPattern(currentHex, baseData) {
    const oppositeHex = this.calculateOppositeHexagram(currentHex);
    
    return {
      id: 4,
      title: "対極への転換",
      subtitle: "錯卦による陰陽反転変化",
      type: "opposite_hexagram_transformation",
      category: "関係変化", 
      confidence: 0.70,
      
      hexagramChange: {
        from: {
          number: currentHex,
          name: this.engine.hexagramNames[currentHex],
          binary: this.engine.hexagramBinary[currentHex]
        },
        to: {
          number: oppositeHex,
          name: this.engine.hexagramNames[oppositeHex],
          binary: this.engine.hexagramBinary[oppositeHex]
        },
        changingLines: [1, 2, 3, 4, 5, 6], // 全爻反転
        changeType: "対極変化"
      },
      
      description: "現在の状況の完全な対極への変化。危機が転機となり、劣勢が優勢に転じる可能性を示します。",
      
      guidance: {
        immediate: "現状の限界を認識し、発想を転換する",
        preparation: "全く新しい視点と方法を模索する",
        execution: "思い切った方向転換を決断する",
        completion: "対極の状況に適応し、新しい強みを築く"
      },
      
      outcome: {
        risk: Math.abs(baseData?.S4_リスク || -30) + 20, // 高リスク
        potential: Math.min((baseData?.S2_ポテンシャル || 50) + 30, 95), // 高ポテンシャル
        stability: Math.max((baseData?.S3_安定性スコア || 50) - 30, 20), // 低安定性
        timeline: "6-18ヶ月（大変化）"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("opposite", baseData),
      
      iChingWisdom: `${this.engine.hexagramNames[currentHex]}の錯卦${this.engine.hexagramNames[oppositeHex]}。陰陽反転の大変化の道です。`
    };
  }

  /**
   * パターン5: 綜卦による視点転換変化
   */
  generateReversedHexagramPattern(currentHex, baseData) {
    const reversedHex = this.calculateReversedHexagram(currentHex);
    
    return {
      id: 5,
      title: "視点の転換",
      subtitle: "綜卦による上下反転変化",
      type: "reversed_hexagram_transformation",
      category: "関係変化",
      confidence: 0.74,
      
      hexagramChange: {
        from: {
          number: currentHex,
          name: this.engine.hexagramNames[currentHex],
          binary: this.engine.hexagramBinary[currentHex]
        },
        to: {
          number: reversedHex,
          name: this.engine.hexagramNames[reversedHex],
          binary: this.engine.hexagramBinary[reversedHex]
        },
        changingLines: [], // 構造的変化
        changeType: "視点変化"
      },
      
      description: "同じ状況を全く違う角度から見ることで生まれる変化。立場の逆転や価値観の転換を示します。",
      
      guidance: {
        immediate: "固定観念を手放し、多角的に物事を見る",
        preparation: "異なる立場の人の視点を理解する",
        execution: "役割や関係性の変化に対応する",
        completion: "新しい視点での価値創造を実現する"
      },
      
      outcome: {
        risk: (baseData?.S4_リスク || -30) * 0.8,
        potential: (baseData?.S2_ポテンシャル || 50) + 15,
        stability: baseData?.S3_安定性スコア || 50,
        timeline: "3-9ヶ月（視点転換）"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("reversed", baseData),
      
      iChingWisdom: `${this.engine.hexagramNames[currentHex]}の綜卦${this.engine.hexagramNames[reversedHex]}。視点転換による智慧の道です。`
    };
  }

  /**
   * パターン6: 急速変化（革卦的）
   */
  generateRapidTransformationPattern(currentHex, currentLine, baseData) {
    const rapidTransformation = this.calculateRapidTransformation(currentHex, currentLine);
    
    return {
      id: 6,
      title: "急速な変革",
      subtitle: "革卦的な急激な変化",
      type: "rapid_transformation",
      category: "時間変化",
      confidence: 0.68,
      
      hexagramChange: rapidTransformation,
      
      description: "短期間での劇的な変化。危機的状況からの突破口や、機会の急速な実現を示します。",
      
      guidance: {
        immediate: "変化のタイミングを逃さず迅速に行動する",
        preparation: "急激な変化に対する準備を整える",
        execution: "集中的に資源を投入し、一気に変革する",
        completion: "変化の成果を安定化させる"
      },
      
      outcome: {
        risk: Math.abs(baseData?.S4_リスク || -30) + 15,
        potential: Math.min((baseData?.S2_ポテンシャル || 50) + 25, 90),
        stability: Math.max((baseData?.S3_安定性スコア || 50) - 25, 15),
        timeline: "1-3ヶ月（急速）"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("rapid", baseData),
      
      iChingWisdom: "革卦の智慧による急速変化。時期を得た変革の道です。"
    };
  }

  /**
   * パターン7: 漸進変化（漸卦的）
   */
  generateGradualTransformationPattern(currentHex, currentLine, baseData) {
    const gradualTransformation = this.calculateGradualTransformation(currentHex, currentLine);
    
    return {
      id: 7,
      title: "漸進的発展",
      subtitle: "漸卦的な段階的変化",
      type: "gradual_transformation",
      category: "時間変化",
      confidence: 0.85,
      
      hexagramChange: gradualTransformation,
      
      description: "着実で安定した段階的変化。基盤を固めながら確実に前進する、持続可能な成長を示します。",
      
      guidance: {
        immediate: "現在の基盤を固め、次段階の準備をする",
        preparation: "長期的な視点で計画を立てる",
        execution: "段階的に着実に実行していく",
        completion: "持続可能な成長を実現する"
      },
      
      outcome: {
        risk: Math.abs(baseData?.S4_リスク || -30) * 0.6, // 低リスク
        potential: (baseData?.S2_ポテンシャル || 50) + 10,
        stability: Math.min((baseData?.S3_安定性スコア || 50) + 25, 90), // 高安定性
        timeline: "12-24ヶ月（漸進的）"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("gradual", baseData),
      
      iChingWisdom: "漸卦の智慧による段階的変化。着実な成長の道です。"
    };
  }

  /**
   * パターン8: 循環変化（序卦伝論理）
   */
  generateSequentialTransformationPattern(currentHex, baseData) {
    const nextHexInSequence = this.getNextHexagramInSequence(currentHex);
    
    return {
      id: 8,
      title: "循環的発展",
      subtitle: "序卦伝による必然的変化",
      type: "sequential_transformation",
      category: "時間変化",
      confidence: 0.90,
      
      hexagramChange: {
        from: {
          number: currentHex,
          name: this.engine.hexagramNames[currentHex],
          binary: this.engine.hexagramBinary[currentHex]
        },
        to: nextHexInSequence,
        changingLines: [],
        changeType: "序卦変化"
      },
      
      description: "序卦伝の論理に従った自然な発展段階。物事の本質的な流れに沿った必然的変化を示します。",
      
      guidance: {
        immediate: "自然な流れに身を委ね、無理に抗わない",
        preparation: "次の段階への準備を自然に整える",
        execution: "適切な時期に自然な変化を受け入れる",
        completion: "循環の一部として調和を保つ"
      },
      
      outcome: {
        risk: Math.abs(baseData?.S4_リスク || -30) * 0.5, // 最低リスク
        potential: (baseData?.S2_ポテンシャル || 50) + 5,
        stability: (baseData?.S3_安定性スコア || 50) + 15,
        timeline: "自然な流れに従って"
      },
      
      bunenjinAlignment: this.generateBunenjinAlignment("sequential", baseData),
      
      iChingWisdom: `序卦伝の智慧による${this.engine.hexagramNames[currentHex]}から${nextHexInSequence?.name || '次段階'}への必然的変化。宇宙の理に従う道です。`
    };
  }

  /**
   * 変化カテゴリーの表示
   */
  displayTransformationCategories() {
    const categoriesElement = document.getElementById('transformationCategories');
    
    categoriesElement.innerHTML = `
      <div class="categories-content">
        <h3>変化の分類</h3>
        <div class="category-grid">
          <div class="category-item orthodox">
            <h4>正統変化</h4>
            <p>爻辞の教えに基づく変化</p>
            <span class="category-count">2パターン</span>
          </div>
          <div class="category-item relational">
            <h4>関係変化</h4>
            <p>互・錯・綜卦による変化</p>
            <span class="category-count">3パターン</span>
          </div>
          <div class="category-item temporal">
            <h4>時間変化</h4>
            <p>変化速度による分類</p>
            <span class="category-count">3パターン</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * シナリオの表示
   */
  displayScenarios(scenarios) {
    const gridElement = document.getElementById('scenariosGrid');
    
    gridElement.innerHTML = scenarios.map(scenario => `
      <div class="scenario-card ${scenario.category.toLowerCase()}" data-scenario-id="${scenario.id}">
        <div class="scenario-header">
          <h3>${scenario.title}</h3>
          <div class="scenario-subtitle">${scenario.subtitle}</div>
          <div class="confidence-badge">信頼度 ${Math.round(scenario.confidence * 100)}%</div>
        </div>
        
        <div class="scenario-content">
          <div class="hexagram-change">
            <span class="from-hex">${scenario.hexagramChange.from.name}</span>
            <span class="change-arrow">→</span>
            <span class="to-hex">${scenario.hexagramChange.to.name}</span>
          </div>
          
          <div class="scenario-description">
            <p>${scenario.description}</p>
          </div>
          
          <div class="outcome-summary">
            <div class="outcome-item">
              <span class="label">リスク</span>
              <span class="value ${this.getRiskLevel(scenario.outcome.risk)}">${Math.round(Math.abs(scenario.outcome.risk))}</span>
            </div>
            <div class="outcome-item">
              <span class="label">可能性</span>
              <span class="value ${this.getPotentialLevel(scenario.outcome.potential)}">${Math.round(scenario.outcome.potential)}</span>
            </div>
            <div class="outcome-item">
              <span class="label">期間</span>
              <span class="value">${scenario.outcome.timeline}</span>
            </div>
          </div>
        </div>
        
        <div class="scenario-footer">
          <button class="view-detail-btn" data-scenario-id="${scenario.id}">
            詳細を見る
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * シナリオ詳細の表示
   */
  displayScenarioDetail(scenarioId) {
    const scenario = this.currentScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    this.selectedScenario = scenario;
    
    const detailElement = document.getElementById('scenarioDetail');
    
    detailElement.innerHTML = `
      <div class="detail-content">
        <div class="detail-header">
          <h3>${scenario.title}</h3>
          <button class="close-detail-btn" id="closeDetailBtn">×</button>
        </div>
        
        <div class="detail-body">
          <!-- 変化の詳細 -->
          <div class="transformation-detail">
            <h4>🔮 変化の詳細</h4>
            <div class="transformation-visual">
              ${this.createTransformationVisual(scenario.hexagramChange)}
            </div>
            <div class="transformation-type">
              <strong>変化の性質:</strong> ${scenario.hexagramChange.changeType}
            </div>
          </div>
          
          <!-- 実行ガイダンス -->
          <div class="guidance-detail">
            <h4>📋 実行ガイダンス</h4>
            <div class="guidance-phases">
              ${Object.entries(scenario.guidance).map(([phase, guide]) => `
                <div class="guidance-phase">
                  <div class="phase-title">${this.getPhaseTitle(phase)}</div>
                  <div class="phase-content">${guide}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- 結果予測 -->
          <div class="outcome-detail">
            <h4>📊 結果予測</h4>
            <div class="outcome-grid">
              <div class="outcome-metric">
                <span class="metric-label">リスクレベル</span>
                <span class="metric-value risk-${this.getRiskLevel(scenario.outcome.risk)}">
                  ${Math.round(Math.abs(scenario.outcome.risk))}
                </span>
              </div>
              <div class="outcome-metric">
                <span class="metric-label">成功可能性</span>
                <span class="metric-value potential-${this.getPotentialLevel(scenario.outcome.potential)}">
                  ${Math.round(scenario.outcome.potential)}%
                </span>
              </div>
              <div class="outcome-metric">
                <span class="metric-label">安定性</span>
                <span class="metric-value">${Math.round(scenario.outcome.stability)}</span>
              </div>
              <div class="outcome-metric">
                <span class="metric-label">実現期間</span>
                <span class="metric-value">${scenario.outcome.timeline}</span>
              </div>
            </div>
          </div>
          
          <!-- bunenjin分析 -->
          <div class="bunenjin-detail">
            <h4>👥 bunenjin分人間分析</h4>
            <div class="bunenjin-content">
              ${this.formatBunenjinAlignment(scenario.bunenjinAlignment)}
            </div>
          </div>
          
          <!-- 易経の智慧 -->
          <div class="iching-wisdom">
            <h4>☯️ 易経の智慧</h4>
            <div class="wisdom-content">
              <p>${scenario.iChingWisdom}</p>
            </div>
          </div>
        </div>
        
        <div class="detail-footer">
          <button class="select-scenario-btn" data-scenario-id="${scenario.id}">
            このシナリオを選択
          </button>
        </div>
      </div>
    `;
    
    detailElement.style.display = 'block';
    
    // 選択されたカードをハイライト
    this.highlightSelectedScenario(scenarioId);
  }

  /**
   * ヘルパーメソッド群
   */
  
  calculateMutualHexagram(hexagram) {
    const binary = this.engine.hexagramBinary[hexagram];
    const mutualLines = [
      binary[1], binary[2], binary[3], // 内卦の中心3爻
      binary[2], binary[3], binary[4]  // 外卦の中心3爻
    ];
    return this.binaryToHexagramNumber(mutualLines);
  }
  
  calculateOppositeHexagram(hexagram) {
    const binary = this.engine.hexagramBinary[hexagram];
    const opposite = binary.map(line => line === 1 ? 0 : 1);
    return this.binaryToHexagramNumber(opposite);
  }
  
  calculateReversedHexagram(hexagram) {
    const binary = this.engine.hexagramBinary[hexagram];
    const reversed = [...binary].reverse();
    return this.binaryToHexagramNumber(reversed);
  }
  
  binaryToHexagramNumber(binary) {
    const binaryStr = binary.join('');
    
    for (let [hexNum, hexBinary] of Object.entries(this.engine.hexagramBinary)) {
      if (hexBinary.join('') === binaryStr) {
        return parseInt(hexNum);
      }
    }
    
    return 1; // フォールバック
  }
  
  calculateRisk(baseRisk, isFollowing) {
    const risk = Math.abs(baseRisk || 30);
    return isFollowing ? risk * 0.7 : risk * 1.3;
  }
  
  calculatePotential(basePotential, isFollowing) {
    const potential = basePotential || 50;
    return isFollowing ? Math.min(potential * 1.2, 90) : Math.max(potential * 0.8, 20);
  }
  
  getRiskLevel(risk) {
    const riskValue = Math.abs(risk);
    if (riskValue >= 70) return 'high';
    if (riskValue >= 40) return 'medium';
    return 'low';
  }
  
  getPotentialLevel(potential) {
    if (potential >= 70) return 'high';
    if (potential >= 50) return 'medium';
    return 'low';
  }
  
  getPhaseTitle(phase) {
    const titles = {
      immediate: '即座の対応',
      preparation: '準備期間',
      execution: '実行期間',
      completion: '完成期間'
    };
    return titles[phase] || phase;
  }

  /**
   * イベントリスナーの設定
   */
  attachEventListeners() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-detail-btn')) {
        const scenarioId = parseInt(e.target.dataset.scenarioId);
        this.displayScenarioDetail(scenarioId);
      }
      
      if (e.target.id === 'closeDetailBtn') {
        document.getElementById('scenarioDetail').style.display = 'none';
      }
      
      if (e.target.classList.contains('select-scenario-btn')) {
        const scenarioId = parseInt(e.target.dataset.scenarioId);
        this.selectScenario(scenarioId);
      }
    });
  }

  /**
   * シナリオの選択
   */
  selectScenario(scenarioId) {
    const scenario = this.currentScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    console.log("✅ シナリオ選択:", scenario);
    
    // 選択イベントの発火
    const event = new CustomEvent('scenarioSelected', {
      detail: scenario,
      bubbles: true
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * bunenjin分人間調和スコア生成
   */
  generateBunenjinAlignment(patternType, baseData) {
    const alignmentPatterns = {
      orthodox: {
        engineOS: { score: 0.85, description: "内なる価値観との一致度が高い" },
        interfaceOS: { score: 0.90, description: "社会的表現として自然で調和的" },
        safeModeOS: { score: 0.75, description: "防御機能への負担が軽微" },
        overallAlignment: 0.83,
        navigationStrategy: "複数の分人が協調して自然な変化を受け入れる道"
      },
      contradiction: {
        engineOS: { score: 0.60, description: "内面的価値観との緊張が生じる" },
        interfaceOS: { score: 0.45, description: "社会的表現に矛盾やストレスが発生" },
        safeModeOS: { score: 0.90, description: "防御機能が活発に作動する" },
        overallAlignment: 0.65,
        navigationStrategy: "Safe Mode OSが主導し、リスクを承知の上で進む道"
      },
      mutual: {
        engineOS: { score: 0.80, description: "潜在的価値観が活性化される" },
        interfaceOS: { score: 0.75, description: "新しい表現の可能性が開かれる" },
        safeModeOS: { score: 0.70, description: "変化への不安は軽度" },
        overallAlignment: 0.75,
        navigationStrategy: "隠れた分人の側面を段階的に開花させる道"
      },
      opposite: {
        engineOS: { score: 0.40, description: "根本的価値観の転換を要求" },
        interfaceOS: { score: 0.35, description: "社会的アイデンティティの大幅変更" },
        safeModeOS: { score: 0.95, description: "強力な防御反応が予想される" },
        overallAlignment: 0.57,
        navigationStrategy: "全分人システムの再構築を要する大変化の道"
      },
      reversed: {
        engineOS: { score: 0.70, description: "価値観の視点転換が必要" },
        interfaceOS: { score: 0.65, description: "表現スタイルの柔軟な調整" },
        safeModeOS: { score: 0.60, description: "適度な警戒を維持" },
        overallAlignment: 0.65,
        navigationStrategy: "既存分人の新しい側面を発見する道"
      },
      rapid: {
        engineOS: { score: 0.65, description: "急速な価値観の適応が必要" },
        interfaceOS: { score: 0.55, description: "表現の急激な変化によるストレス" },
        safeModeOS: { score: 0.85, description: "変化への強い警戒反応" },
        overallAlignment: 0.68,
        navigationStrategy: "Interface OSが主導し、迅速な適応を図る道"
      },
      gradual: {
        engineOS: { score: 0.90, description: "価値観との調和を保った発展" },
        interfaceOS: { score: 0.85, description: "段階的で安定した表現の進化" },
        safeModeOS: { score: 0.65, description: "変化への不安は最小限" },
        overallAlignment: 0.80,
        navigationStrategy: "Engine OSが主導し、全分人が協調して成長する道"
      },
      sequential: {
        engineOS: { score: 0.95, description: "自然な流れとの完全な調和" },
        interfaceOS: { score: 0.90, description: "社会的文脈に最適化された表現" },
        safeModeOS: { score: 0.60, description: "自然な変化への信頼" },
        overallAlignment: 0.82,
        navigationStrategy: "宇宙の理に従い、全分人が自然に進化する道"
      }
    };
    
    return alignmentPatterns[patternType] || alignmentPatterns.orthodox;
  }

  /**
   * bunenjin調和分析のフォーマット
   */
  formatBunenjinAlignment(alignment) {
    return `
      <div class="bunenjin-analysis">
        <div class="os-alignment-grid">
          <div class="os-item engine">
            <div class="os-label">Engine OS</div>
            <div class="os-score">${Math.round(alignment.engineOS.score * 100)}%</div>
            <div class="os-description">${alignment.engineOS.description}</div>
          </div>
          <div class="os-item interface">
            <div class="os-label">Interface OS</div>
            <div class="os-score">${Math.round(alignment.interfaceOS.score * 100)}%</div>
            <div class="os-description">${alignment.interfaceOS.description}</div>
          </div>
          <div class="os-item safemode">
            <div class="os-label">Safe Mode OS</div>
            <div class="os-score">${Math.round(alignment.safeModeOS.score * 100)}%</div>
            <div class="os-description">${alignment.safeModeOS.description}</div>
          </div>
        </div>
        <div class="overall-alignment">
          <div class="alignment-score">
            総合調和度: ${Math.round(alignment.overallAlignment * 100)}%
          </div>
          <div class="navigation-strategy">
            <strong>戦略的ナビゲーション:</strong> ${alignment.navigationStrategy}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 変化ビジュアルの生成
   */
  createTransformationVisual(hexagramChange) {
    return `
      <div class="transformation-visual">
        <div class="hexagram-transition">
          <div class="from-hexagram">
            <div class="hex-name">${hexagramChange.from.name}</div>
            <div class="hex-number">#${hexagramChange.from.number}</div>
            <div class="hex-binary">${this.formatBinary(hexagramChange.from.binary)}</div>
          </div>
          <div class="transition-arrow">
            <span class="arrow">→</span>
            <div class="change-type">${hexagramChange.changeType}</div>
          </div>
          <div class="to-hexagram">
            <div class="hex-name">${hexagramChange.to.name || '新状況'}</div>
            <div class="hex-number">#${hexagramChange.to.number || ''}</div>
            <div class="hex-binary">${this.formatBinary(hexagramChange.to.binary)}</div>
          </div>
        </div>
        ${hexagramChange.changingLines?.length ? `
          <div class="changing-lines">
            <div class="lines-label">変化する爻:</div>
            <div class="lines-display">
              ${hexagramChange.changingLines.map(line => `<span class="line-${line}">${line}</span>`).join(', ')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * 二進表現のフォーマット
   */
  formatBinary(binary) {
    if (!binary || !Array.isArray(binary)) return '━━━━━━';
    return binary.map(bit => bit === 1 ? '━━━' : '━ ━').join('<br>');
  }

  /**
   * 欠落メソッドの実装
   */
  calculateAlternativeTransformation(hexagram, line) {
    // 爻辞の反対の変化を計算
    return {
      number: hexagram === 64 ? 1 : hexagram + 1,
      name: this.engine.hexagramNames?.[hexagram === 64 ? 1 : hexagram + 1] || '未知',
      binary: this.engine.hexagramBinary?.[hexagram === 64 ? 1 : hexagram + 1] || [1,1,1,1,1,1]
    };
  }

  calculateRapidTransformation(hexagram, line) {
    return {
      from: {
        number: hexagram,
        name: this.engine.hexagramNames?.[hexagram] || '乾為天',
        binary: this.engine.hexagramBinary?.[hexagram] || [1,1,1,1,1,1]
      },
      to: {
        number: 49, // 革卦
        name: '沢火革',
        binary: [0,1,1,1,0,1]
      },
      changingLines: [line],
      changeType: '急速変化'
    };
  }

  calculateGradualTransformation(hexagram, line) {
    return {
      from: {
        number: hexagram,
        name: this.engine.hexagramNames?.[hexagram] || '乾為天',
        binary: this.engine.hexagramBinary?.[hexagram] || [1,1,1,1,1,1]
      },
      to: {
        number: 53, // 漸卦
        name: '風山漸',
        binary: [0,0,1,1,0,1]
      },
      changingLines: [line],
      changeType: '漸進変化'
    };
  }

  getNextHexagramInSequence(hexagram) {
    // 序卦伝の順序に従った次の卦
    const nextHex = hexagram === 64 ? 1 : hexagram + 1;
    return {
      number: nextHex,
      name: this.engine.hexagramNames?.[nextHex] || '坤為地',
      binary: this.engine.hexagramBinary?.[nextHex] || [0,0,0,0,0,0]
    };
  }

  generateFallbackPatterns(hexagram, line) {
    return [
      {
        id: 1,
        title: "基本的な変化",
        subtitle: "安全な選択肢",
        type: "fallback_safe",
        category: "基本変化",
        confidence: 0.70,
        description: "現在の状況から可能な範囲での改善を目指します。リスクを最小限に抑えた安全な道です。",
        bunenjinAlignment: this.generateBunenjinAlignment("gradual", {}),
        outcome: { risk: 20, potential: 60, stability: 80, timeline: "6-12ヶ月" }
      },
      {
        id: 2,
        title: "現状維持",
        subtitle: "時期を待つ選択",
        type: "fallback_wait",
        category: "待機",
        confidence: 0.85,
        description: "今は動かず、より良いタイミングを待つことを選択します。忍耐による智慧の道です。",
        bunenjinAlignment: this.generateBunenjinAlignment("sequential", {}),
        outcome: { risk: 10, potential: 40, stability: 90, timeline: "適切な時期まで" }
      }
    ];
  }

  highlightSelectedScenario(scenarioId) {
    // 全てのカードからハイライトを削除
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // 選択されたカードをハイライト
    const selectedCard = document.querySelector(`[data-scenario-id="${scenarioId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
  }

  /**
   * パブリックAPI
   */
  getCurrentScenarios() {
    return this.currentScenarios;
  }

  getSelectedScenario() {
    return this.selectedScenario;
  }

  reset() {
    this.currentScenarios = null;
    this.selectedScenario = null;
    this.initializeScenarioSystem();
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.Authentic8ScenariosSystem = Authentic8ScenariosSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Authentic8ScenariosSystem;
}

console.log("🌟 Authentic8ScenariosSystem.js 読み込み完了");