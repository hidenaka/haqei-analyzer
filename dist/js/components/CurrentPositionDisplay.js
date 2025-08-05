/**
 * 現在地表示コンポーネント - CurrentPositionDisplay.js
 * 
 * 易経の現在地（本卦・爻）を正確に表示
 * - 卦の視覚的表現
 * - 爻辞の詳細表示
 * - 現在の状況解釈
 * - bunenjin分人間分析
 * 
 * Author: HAQEI I Ching Expert Agent
 * Created: 2025-08-04
 */

class CurrentPositionDisplay {
  constructor(container, iChingEngine) {
    this.container = container;
    this.engine = iChingEngine;
    this.currentData = null;
    
    this.initializeDisplay();
    
    console.log("🎯 現在地表示コンポーネント初期化完了");
  }

  /**
   * 表示システムの初期化
   */
  initializeDisplay() {
    this.container.innerHTML = this.createDisplayStructure();
    this.attachEventListeners();
  }

  /**
   * 表示構造の作成
   */
  createDisplayStructure() {
    return `
      <div class="current-position-container">
        <!-- ヘッダー -->
        <div class="position-header">
          <h2 class="position-title">
            <span class="icon">🎯</span>
            あなたの現在地
          </h2>
          <div class="position-subtitle">
            易経による現在の状況分析
          </div>
        </div>

        <!-- メイン表示エリア -->
        <div class="position-main" id="positionMain">
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>現在地を分析中...</p>
          </div>
        </div>

        <!-- 詳細情報エリア -->
        <div class="position-details" id="positionDetails" style="display: none;">
          <!-- 詳細内容は動的に生成 -->
        </div>

        <!-- bunenjin分人間分析 -->
        <div class="bunenjin-analysis" id="bunenjinAnalysis" style="display: none;">
          <!-- bunenjin分析は動的に生成 -->
        </div>
      </div>
    `;
  }

  /**
   * 現在地の表示更新
   */
  updatePosition(analysisResult) {
    console.log("🔄 現在地表示を更新:", analysisResult);
    
    this.currentData = analysisResult;
    
    // メイン表示の更新
    this.updateMainDisplay(analysisResult);
    
    // 詳細情報の更新
    this.updateDetailsDisplay(analysisResult);
    
    // bunenjin分析の更新
    this.updateBunenjinDisplay(analysisResult);
    
    // アニメーション効果
    this.animateUpdate();
  }

  /**
   * メイン表示の更新
   */
  updateMainDisplay(result) {
    const mainElement = document.getElementById('positionMain');
    
    const hexagramData = this.engine.findLineData(result.卦番号, this.parseLinePosition(result.爻));
    
    mainElement.innerHTML = `
      <div class="hexagram-display fade-in">
        <!-- 卦の視覚表現 -->
        <div class="hexagram-visual">
          <div class="hexagram-symbol">
            ${this.createHexagramVisual(result.卦番号, this.parseLinePosition(result.爻))}
          </div>
          <div class="hexagram-info">
            <div class="hexagram-number">第${result.卦番号}卦</div>
            <div class="hexagram-name">${result.卦名}</div>
            <div class="current-line">${result.爻}</div>
          </div>
        </div>

        <!-- 爻辞表示 -->
        <div class="line-text-display">
          <div class="line-text-header">
            <h3>爻辞</h3>
          </div>
          <div class="line-text-content">
            <div class="classical-text">
              ${this.getClassicalLineText(result.卦番号, result.爻)}
            </div>
            <div class="modern-interpretation">
              <h4>現代解釈</h4>
              <p>${hexagramData?.現代解釈の要約 || '状況を分析中...'}</p>
            </div>
          </div>
        </div>

        <!-- 現在の状況サマリー -->
        <div class="situation-summary">
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">基本スコア</span>
              <span class="stat-value">${hexagramData?.S1_基本スコア || 50}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">ポテンシャル</span>
              <span class="stat-value">${hexagramData?.S2_ポテンシャル || 50}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">安定性</span>
              <span class="stat-value">${hexagramData?.S3_安定性スコア || 50}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">リスク</span>
              <span class="stat-value risk">${Math.abs(hexagramData?.S4_リスク || 30)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 卦の視覚的表現を作成
   */
  createHexagramVisual(hexagramNumber, currentLine) {
    const binary = this.engine.hexagramBinary[hexagramNumber];
    if (!binary) return '<div class="error">卦データエラー</div>';
    
    const lines = binary.map((bit, index) => {
      const lineNumber = 6 - index; // 上爻から表示
      const isYang = bit === 1;
      const isCurrent = lineNumber === currentLine;
      
      return `
        <div class="hexagram-line ${isYang ? 'yang' : 'yin'} ${isCurrent ? 'current' : ''}">
          <div class="line-symbol">
            ${isYang ? '━━━━━━' : '━━  ━━'}
          </div>
          <div class="line-label">
            ${this.getLineLabel(lineNumber)}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="hexagram-lines">
        ${lines}
      </div>
    `;
  }

  /**
   * 爻のラベルを取得
   */
  getLineLabel(lineNumber) {
    const labels = {
      6: '上爻', 5: '五爻', 4: '四爻',
      3: '三爻', 2: '二爻', 1: '初爻'
    };
    return labels[lineNumber] || '';
  }

  /**
   * 古典的爻辞を取得（実際の実装では詳細な爻辞データが必要）
   */
  getClassicalLineText(hexagramNumber, linePosition) {
    // 主要な爻辞の例（実際の実装では完全なデータベースが必要）
    const classicalTexts = {
      '1-1': '潜龍勿用（せんりゅう もちいるなかれ）',
      '1-2': '見龍在田、利見大人（けんりゅう でんにあり、たいじんにあうによろし）',
      '1-3': '君子終日乾乾、夕惕若、厲无咎（くんし しゅうじつけんけん）',
      '1-4': '或躍在淵、无咎（あるいはおどってふちにあり、とがなし）',
      '1-5': '飛龍在天、利見大人（ひりゅう てんにあり、たいじんにあう）',
      '1-6': '亢龍有悔（こうりゅう くいあり）',
      '12-3': '包羞（ほうしゅう）'
    };
    
    const key = `${hexagramNumber}-${this.parseLinePosition(linePosition)}`;
    return classicalTexts[key] || '爻辞を確認中...';
  }

  /**
   * 詳細情報の表示更新
   */
  updateDetailsDisplay(result) {
    const detailsElement = document.getElementById('positionDetails');
    const hexagramData = this.engine.findLineData(result.卦番号, this.parseLinePosition(result.爻));
    
    detailsElement.innerHTML = `
      <div class="details-content">
        <h3>詳細分析</h3>
        
        <!-- キーワード分析 -->
        <div class="keyword-analysis">
          <h4>関連キーワード</h4>
          <div class="keyword-tags">
            ${(hexagramData?.キーワード || []).map(keyword => 
              `<span class="keyword-tag">${keyword}</span>`
            ).join('')}
          </div>
        </div>

        <!-- 状況の性質 -->
        <div class="situation-nature">
          <h4>状況の性質</h4>
          <div class="nature-grid">
            <div class="nature-item">
              <span class="nature-label">主体性</span>
              <span class="nature-value">${hexagramData?.S5_主体性推奨スタンス || '中立'}</span>
            </div>
            <div class="nature-item">
              <span class="nature-label">変動性</span>
              <span class="nature-value">${hexagramData?.S6_変動性スコア || 50}</span>
            </div>
            <div class="nature-item">
              <span class="nature-label">総合評価</span>
              <span class="nature-value">${hexagramData?.S7_総合評価スコア || 50}</span>
            </div>
          </div>
        </div>

        <!-- 易経の教え -->
        <div class="iching-teaching">
          <h4>易経の教え</h4>
          <div class="teaching-content">
            <p>${this.generateTeachingContent(result, hexagramData)}</p>
          </div>
        </div>
      </div>
    `;
    
    detailsElement.style.display = 'block';
  }

  /**
   * bunenjin分析の表示更新
   */
  updateBunenjinDisplay(result) {
    const bunenjinElement = document.getElementById('bunenjinAnalysis');
    const hexagramData = this.engine.findLineData(result.卦番号, this.parseLinePosition(result.爻));
    
    // bunenjin分人間分析の生成
    const personaAnalyses = this.generatePersonaAnalyses(result, hexagramData);
    
    bunenjinElement.innerHTML = `
      <div class="bunenjin-content">
        <h3>bunenjin分人間分析</h3>
        <div class="bunenjin-subtitle">
          あなたの中の異なる分人から見た、この状況の意味
        </div>
        
        <div class="persona-analyses">
          ${Object.entries(personaAnalyses).map(([personaName, analysis]) => `
            <div class="persona-analysis">
              <div class="persona-header">
                <h4>${analysis.title}</h4>
                <div class="persona-icon">${analysis.icon}</div>
              </div>
              <div class="persona-content">
                <div class="persona-perspective">
                  <strong>この分人の視点：</strong>
                  <p>${analysis.perspective}</p>
                </div>
                <div class="persona-guidance">
                  <strong>推奨される行動：</strong>
                  <p>${analysis.guidance}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 分人間の調和 -->
        <div class="persona-harmony">
          <h4>分人間の調和</h4>
          <div class="harmony-content">
            <p>${this.generateHarmonyGuidance(personaAnalyses, result)}</p>
          </div>
        </div>
      </div>
    `;
    
    bunenjinElement.style.display = 'block';
  }

  /**
   * 分人間分析の生成
   */
  generatePersonaAnalyses(result, hexagramData) {
    return {
      analytical: {
        title: '分析的な分人',
        icon: '🧠',
        perspective: `第${result.卦番号}卦${result.爻}の状況を、データと論理から分析します。現在のスコア（基本${hexagramData?.S1_基本スコア || 50}、安定性${hexagramData?.S3_安定性スコア || 50}）から見て、${this.getAnalyticalPerspective(hexagramData)}`,
        guidance: this.getAnalyticalGuidance(hexagramData)
      },
      emotional: {
        title: '感情的な分人',
        icon: '❤️',
        perspective: `この状況に対して、心の奥深くで感じていること。${this.getEmotionalPerspective(result, hexagramData)}`,
        guidance: this.getEmotionalGuidance(hexagramData)
      },
      social: {
        title: '社会的な分人',
        icon: '👥',
        perspective: `周囲との関係性や社会的な文脈から見た、この状況の位置づけ。${this.getSocialPerspective(result, hexagramData)}`,
        guidance: this.getSocialGuidance(hexagramData)
      },
      spiritual: {
        title: '精神的な分人',
        icon: '🌟',
        perspective: `より深い智慧や精神的な成長の観点から。易経の教えとして、${this.getSpiritualPerspective(result, hexagramData)}`,
        guidance: this.getSpiritualGuidance(result, hexagramData)
      }
    };
  }

  /**
   * 各分人の視点を生成するヘルパーメソッド
   */
  getAnalyticalPerspective(hexagramData) {
    const score = hexagramData?.S7_総合評価スコア || 50;
    if (score >= 60) return '客観的に見て改善の余地がある状況です。';
    if (score >= 40) return '注意深い分析と戦略的な判断が必要な状況です。';
    return '現実的なリスク管理が最優先の状況です。';
  }

  getAnalyticalGuidance(hexagramData) {
    const stance = hexagramData?.S5_主体性推奨スタンス || '中立';
    if (stance === '能動') return 'データに基づいた積極的な行動計画を立てましょう。';
    if (stance === '受動') return '情報収集と状況分析を徹底し、慎重に判断しましょう。';
    return 'バランスの取れた分析的アプローチで臨みましょう。';
  }

  getEmotionalPerspective(result, hexagramData) {
    const keywords = hexagramData?.キーワード || [];
    if (keywords.includes('不安') || keywords.includes('心配')) {
      return '不安や心配を感じるのは自然なことです。';
    }
    if (keywords.includes('希望') || keywords.includes('期待')) {
      return '心の中で新しい可能性への期待を感じているでしょう。';
    }
    return '複雑な感情を抱えながらも、内なる智慧が答えを知っています。';
  }

  getEmotionalGuidance(hexagramData) {
    return '自分の感情を否定せず、そこから得られるメッセージに耳を傾けましょう。';
  }

  getSocialPerspective(result, hexagramData) {
    return '周囲の人々や社会的な期待との関係において、この状況がどのような意味を持つかを考えてみましょう。';
  }

  getSocialGuidance(hexagramData) {
    return '他者との調和を保ちながら、自分らしい道を歩む方法を探しましょう。';
  }

  getSpiritualPerspective(result, hexagramData) {
    return `${result.卦名}の教えは、人生の深い智慧を示しています。この経験を通じて、より大きな理解に到達する機会です。`;
  }

  getSpiritualGuidance(result, hexagramData) {
    return '易経の智慧に導かれ、この状況から学ぶべき真理を受け取りましょう。';
  }

  /**
   * 分人間調和のガイダンス生成
   */
  generateHarmonyGuidance(personaAnalyses, result) {
    return `あなたの中の4つの分人それぞれが、この${result.卦名}の状況に対して異なる視点を持っています。これらの視点すべてが「あなた」であり、状況に応じて最適な分人を前面に出すことで、より調和の取れた判断と行動が可能になります。統一された単一の自己にこだわるのではなく、状況に応じた柔軟な対応を心がけましょう。`;
  }

  /**
   * 教えの内容生成
   */
  generateTeachingContent(result, hexagramData) {
    const risk = Math.abs(hexagramData?.S4_リスク || 30);
    const potential = hexagramData?.S2_ポテンシャル || 50;
    
    let teaching = `第${result.卦番号}卦「${result.卦名}」の${result.爻}は、`;
    
    if (risk > 50) {
      teaching += 'リスクの高い状況であることを示しています。慎重な判断と準備が必要です。';
    } else if (potential > 60) {
      teaching += '大きな可能性を秘めた状況です。適切なタイミングで行動すれば良い結果が期待できます。';
    } else {
      teaching += 'バランスの取れた状況です。現状を維持しながら、機会を見極めることが大切です。';
    }
    
    return teaching;
  }

  /**
   * 爻位置の解析
   */
  parseLinePosition(lineText) {
    const lineMap = {
      '初九': 1, '初六': 1,
      '九二': 2, '六二': 2,
      '九三': 3, '六三': 3,
      '九四': 4, '六四': 4,
      '九五': 5, '六五': 5,
      '上九': 6, '上六': 6
    };
    
    return lineMap[lineText] || 1;
  }

  /**
   * アニメーション効果
   */
  animateUpdate() {
    const elements = this.container.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 200);
    });
  }

  /**
   * イベントリスナーの設定
   */
  attachEventListeners() {
    // 詳細表示の切り替え
    const toggleButtons = this.container.querySelectorAll('.toggle-details');
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const targetId = e.target.dataset.target;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.style.display = 
            targetElement.style.display === 'none' ? 'block' : 'none';
        }
      });
    });
  }

  /**
   * パブリックAPI
   */
  getCurrentData() {
    return this.currentData;
  }

  reset() {
    this.currentData = null;
    this.initializeDisplay();
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.CurrentPositionDisplay = CurrentPositionDisplay;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CurrentPositionDisplay;
}

console.log("🎯 CurrentPositionDisplay.js 読み込み完了");