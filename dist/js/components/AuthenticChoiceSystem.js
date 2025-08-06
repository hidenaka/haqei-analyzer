/**
 * 正統易経選択システム - AuthenticChoiceSystem.js
 * 
 * 今の状況のテーマに基づく正確な選択システム
 * - 今の状況のテーマで進む vs 違うテーマを選択する
 * - 本卦→之卦の変化予測
 * - bunenjin分人間対応選択
 * - リスク・ポテンシャル分析
 * 
 * Author: HAQEI I Ching Expert Agent
 * Created: 2025-08-04
 */

class AuthenticChoiceSystem {
  constructor(container, iChingEngine) {
    this.container = container;
    this.engine = iChingEngine;
    this.currentChoices = null;
    this.selectedPath = null;
    
    this.initializeChoiceSystem();
    
    console.log("🎭 正統易経選択システム初期化完了");
  }

  /**
   * 選択システムの初期化
   */
  initializeChoiceSystem() {
    this.container.innerHTML = this.createChoiceStructure();
    this.attachEventListeners();
  }

  /**
   * 選択システムの構造作成
   */
  createChoiceStructure() {
    return `
      <div class="authentic-choice-container">
        <!-- ヘッダー -->
        <div class="choice-header">
          <h2 class="choice-title">
            <span class="icon">🎭</span>
            易経の分岐点
          </h2>
          <div class="choice-subtitle">
            今の状況のテーマに、あなたはどう応えますか？
          </div>
        </div>

        <!-- 現在の状況テーマ表示 -->
        <div class="current-line-display" id="currentLineDisplay">
          <!-- 動的に生成 -->
        </div>

        <!-- 選択肢表示 -->
        <div class="choice-options" id="choiceOptions">
          <!-- 動的に生成 -->
        </div>

        <!-- 変化予測表示 -->
        <div class="transformation-preview" id="transformationPreview" style="display: none;">
          <!-- 動的に生成 -->
        </div>

        <!-- bunenjin分人間分析 -->
        <div class="bunenjin-choice-analysis" id="bunenjinChoiceAnalysis" style="display: none;">
          <!-- 動的に生成 -->
        </div>

        <!-- 選択確定ボタン -->
        <div class="choice-confirmation" id="choiceConfirmation" style="display: none;">
          <button class="confirm-button" id="confirmChoiceBtn">
            この道を選択する
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 選択肢の生成と表示
   */
  generateChoices(currentPosition) {
    console.log("🎯 選択肢生成開始:", currentPosition);
    
    try {
      // AuthenticIChingEngineから選択肢を生成
      this.currentChoices = this.engine.generateAuthenticChoices(
        currentPosition.卦番号,
        this.parseLinePosition(currentPosition.爻)
      );
      
      this.displayCurrentLine(this.currentChoices.situation);
      this.displayChoiceOptions(this.currentChoices);
      
      console.log("✅ 選択肢生成完了:", this.currentChoices);
      
    } catch (error) {
      console.error("❌ 選択肢生成エラー:", error);
      this.displayErrorState();
    }
  }

  /**
   * 現在の状況テーマ表示
   */
  displayCurrentLine(situation) {
    const currentLineElement = document.getElementById('currentLineDisplay');
    
    currentLineElement.innerHTML = `
      <div class="line-situation fade-in">
        <div class="situation-header">
          <h3>現在の状況</h3>
          <div class="hexagram-info">
            <span class="hexagram-number">第${situation.hexagram}卦</span>
            <span class="hexagram-name">${situation.hexagramName}</span>
            <span class="line-position">${situation.lineText}</span>
          </div>
        </div>
        
        <div class="situation-content">
          <div class="line-meaning">
            <h4>今の状況のテーマ</h4>
            <div class="meaning-text">
              ${situation.meaning}
            </div>
          </div>
          
          <div class="situation-keywords">
            <h4>関連キーワード</h4>
            <div class="keyword-tags">
              ${situation.keywords.map(keyword => 
                `<span class="keyword-tag">${keyword}</span>`
              ).join('')}
            </div>
          </div>
        </div>
        
        <div class="choice-question">
          <h3>🤔 このテーマに、あなたはどう応えますか？</h3>
        </div>
      </div>
    `;
  }

  /**
   * 選択肢の表示
   */
  displayChoiceOptions(choices) {
    const optionsElement = document.getElementById('choiceOptions');
    
    optionsElement.innerHTML = `
      <div class="choice-cards">
        <!-- 選択A: 今の状況のテーマで進む道 -->
        <div class="choice-card path-a" data-path="pathA">
          <div class="card-header">
            <h3>🛤️ ${choices.pathA.title}</h3>
            <div class="path-type">今の状況のテーマで進む</div>
          </div>
          
          <div class="card-content">
            <div class="path-description">
              <p>${choices.pathA.description}</p>
            </div>
            
            <div class="path-action">
              <h4>具体的な行動</h4>
              <p>${choices.pathA.action}</p>
            </div>
            
            <div class="outcome-preview">
              <h4>予想される展開</h4>
              <div class="outcome-stats">
                <div class="stat-item positive">
                  <span class="stat-label">リスク</span>
                  <span class="stat-value">${choices.pathA.outcome.risk}</span>
                </div>
                <div class="stat-item positive">
                  <span class="stat-label">可能性</span>
                  <span class="stat-value">${choices.pathA.outcome.potential}</span>
                </div>
              </div>
              
              <div class="transformation-hint">
                <span class="from-hex">${choices.situation.hexagramName}</span>
                <span class="arrow">→</span>
                <span class="to-hex">${choices.pathA.outcome.transformation?.toHexagram?.name || '変化予測中'}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="select-path-btn" data-path="pathA">
              この道を詳しく見る
            </button>
          </div>
        </div>

        <!-- 選択B: 別の角度から考える道 -->
        <div class="choice-card path-b" data-path="pathB">
          <div class="card-header">
            <h3>⚡ ${choices.pathB.title}</h3>
            <div class="path-type">違うテーマを選択する</div>
          </div>
          
          <div class="card-content">
            <div class="path-description">
              <p>${choices.pathB.description}</p>
            </div>
            
            <div class="path-action">
              <h4>具体的な行動</h4>
              <p>${choices.pathB.action}</p>
            </div>
            
            <div class="outcome-preview">
              <h4>予想される展開</h4>
              <div class="outcome-stats">
                <div class="stat-item warning">
                  <span class="stat-label">リスク</span>
                  <span class="stat-value">${choices.pathB.outcome.risk}</span>
                </div>
                <div class="stat-item warning">
                  <span class="stat-label">可能性</span>
                  <span class="stat-value">${choices.pathB.outcome.potential}</span>
                </div>
              </div>
              
              <div class="transformation-hint">
                <span class="from-hex">${choices.situation.hexagramName}</span>
                <span class="arrow">→</span>
                <span class="to-hex">${choices.pathB.outcome.transformation?.toHexagram?.name || '変化予測中'}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="select-path-btn" data-path="pathB">
              この道を詳しく見る
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 選択された道の詳細表示
   */
  displayPathDetails(pathKey) {
    console.log("🔍 道の詳細表示:", pathKey);
    
    this.selectedPath = pathKey;
    const selectedChoice = this.currentChoices[pathKey];
    
    // 選択されたカードをハイライト
    this.highlightSelectedCard(pathKey);
    
    // 変化予測の表示
    this.displayTransformationPreview(selectedChoice);
    
    // bunenjin分析の表示
    this.displayBunenjinChoiceAnalysis(selectedChoice);
    
    // 確認ボタンの表示
    this.showConfirmationButton();
  }

  /**
   * 選択されたカードのハイライト
   */
  highlightSelectedCard(pathKey) {
    // すべてのカードからハイライトを削除
    const allCards = this.container.querySelectorAll('.choice-card');
    allCards.forEach(card => {
      card.classList.remove('selected');
    });
    
    // 選択されたカードをハイライト
    const selectedCard = this.container.querySelector(`[data-path="${pathKey}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
  }

  /**
   * 変化予測の表示
   */
  displayTransformationPreview(selectedChoice) {
    const previewElement = document.getElementById('transformationPreview');
    const transformation = selectedChoice.outcome.transformation;
    
    if (!transformation) {
      previewElement.style.display = 'none';
      return;
    }
    
    previewElement.innerHTML = `
      <div class="transformation-content">
        <h3>🔮 変化の予測</h3>
        
        <div class="transformation-visual">
          <div class="transformation-stages">
            <div class="stage current">
              <div class="hexagram-display">
                <div class="hex-name">${transformation.fromHexagram.name}</div>
                <div class="hex-binary">${this.formatBinary(transformation.fromHexagram.binary)}</div>
                <div class="stage-label">現在の状況</div>
              </div>
            </div>
            
            <div class="transformation-arrow">
              <div class="changing-info">
                <div class="changing-lines">
                  ${transformation.changingLines.map(line => 
                    `<span class="changing-line">第${line}爻変化</span>`
                  ).join('')}
                </div>
                <div class="arrow-symbol">⟶</div>
              </div>
            </div>
            
            <div class="stage future">
              <div class="hexagram-display">
                <div class="hex-name">${transformation.toHexagram.name}</div>
                <div class="hex-binary">${this.formatBinary(transformation.toHexagram.binary)}</div>
                <div class="stage-label">変化後の状況</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="transformation-details">
          <div class="transformation-nature">
            <h4>変化の性質</h4>
            <p>${transformation.transformationNature?.description || '変化の性質を分析中...'}</p>
          </div>
          
          <div class="transformation-timeline">
            <h4>変化の時間軸</h4>
            <div class="timeline-phases">
              ${transformation.timeline?.phases?.map(phase => `
                <div class="timeline-phase">
                  <span class="phase-name">${phase.name}</span>
                  <span class="phase-duration">${phase.duration}</span>
                </div>
              `).join('') || '<div class="timeline-phase">時間軸を分析中...</div>'}
            </div>
          </div>
        </div>
        
        <div class="transformation-guidance">
          <h4>変化への指針</h4>
          <div class="guidance-content">
            <p>${transformation.guidance || selectedChoice.outcome.guidance || 'この道を進む場合の具体的な指針を準備中...'}</p>
          </div>
        </div>
      </div>
    `;
    
    previewElement.style.display = 'block';
  }

  /**
   * bunenjin選択分析の表示（哲学的矛盾受容版）
   */
  displayBunenjinChoiceAnalysis(selectedChoice) {
    const analysisElement = document.getElementById('bunenjinChoiceAnalysis');
    const bunenjinGuidance = selectedChoice.bunenjinGuidance;
    
    if (!bunenjinGuidance) {
      analysisElement.style.display = 'none';
      return;
    }

    // 矛盾受容システムの初期化
    if (!this.contradictionSystem) {
      this.contradictionSystem = new ContradictionAcceptanceSystem();
    }

    // 分人間の矛盾を豊かさとして変換
    const personaContradictions = this.identifyPersonaContradictions(bunenjinGuidance);
    const richnessTransformation = personaContradictions.length > 0 ? 
      this.contradictionSystem.transformContradictionToRichness(personaContradictions) : null;
    
    analysisElement.innerHTML = `
      <div class="bunenjin-choice-content">
        <h3>🌸 bunenjin分人の豊かな多面性分析</h3>
        <div class="bunenjin-subtitle">
          この選択における、あなたの各分人の知恵と貢献
        </div>
        
        <div class="persona-choice-reactions">
          ${Object.entries(bunenjinGuidance).filter(([key]) => key !== 'integration').map(([personaKey, guidance]) => `
            <div class="persona-reaction">
              <div class="persona-header">
                <h4>${this.getPersonaTitle(personaKey)}</h4>
                <div class="persona-icon">${this.getPersonaIcon(personaKey)}</div>
              </div>
              <div class="persona-response">
                <div class="response-section wisdom">
                  <strong>この分人の知恵：</strong>
                  <p>${guidance.perspective || 'この選択に対する独自の洞察を分析中...'}</p>
                </div>
                <div class="response-section contribution">
                  <strong>この分人の貢献：</strong>
                  <p>${guidance.action || 'この状況への具体的な貢献を準備中...'}</p>
                </div>
                <div class="response-section growth">
                  <strong>成長の機会：</strong>
                  <p>${guidance.caution || 'この分人がもたらす成長機会を確認中...'}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${richnessTransformation ? this.generateRichnessDisplay(richnessTransformation) : ''}
        
        <div class="integration-guidance">
          <h4>💫 分人統合の豊かさ</h4>
          <div class="integration-content">
            <p>${bunenjinGuidance.integration?.guidance || 'あなたの多様な分人が協力し合うことで生まれる豊かな可能性を分析中...'}</p>
          </div>
        </div>
        
        <div class="philosophical-insight">
          <h4>🧘 bunenjin哲学の洞察</h4>
          <div class="insight-content">
            <p>異なる視点を持つ分人たちの共存は、人生の複雑さに対応するための内的リソースです。矛盾ではなく、豊かな多面性として受け入れましょう。</p>
          </div>
        </div>
      </div>
    `;
    
    analysisElement.style.display = 'block';
  }

  /**
   * 分人のタイトルを取得
   */
  getPersonaTitle(personaKey) {
    const titles = {
      analyticalSelf: '分析的な分人',
      emotionalSelf: '感情的な分人',
      socialSelf: '社会的な分人',
      spiritualSelf: '精神的な分人'
    };
    return titles[personaKey] || personaKey;
  }

  /**
   * 分人のアイコンを取得
   */
  getPersonaIcon(personaKey) {
    const icons = {
      analyticalSelf: '🧠',
      emotionalSelf: '❤️',
      socialSelf: '👥',
      spiritualSelf: '🌟'
    };
    return icons[personaKey] || '🎭';
  }

  /**
   * 確認ボタンの表示
   */
  showConfirmationButton() {
    const confirmationElement = document.getElementById('choiceConfirmation');
    confirmationElement.style.display = 'block';
  }

  /**
   * 選択の確定
   */
  confirmChoice() {
    if (!this.selectedPath || !this.currentChoices) {
      console.warn("⚠️ 選択が完了していません");
      return null;
    }
    
    const confirmedChoice = {
      selectedPath: this.selectedPath,
      choiceData: this.currentChoices[this.selectedPath],
      timestamp: new Date().toISOString(),
      situation: this.currentChoices.situation
    };
    
    console.log("✅ 選択確定:", confirmedChoice);
    
    // 選択確定のイベントを発火
    this.dispatchChoiceConfirmed(confirmedChoice);
    
    return confirmedChoice;
  }

  /**
   * 選択確定イベントの発火
   */
  dispatchChoiceConfirmed(confirmedChoice) {
    const event = new CustomEvent('choiceConfirmed', {
      detail: confirmedChoice,
      bubbles: true
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * バイナリ表現のフォーマット
   */
  formatBinary(binary) {
    if (!binary || !Array.isArray(binary)) return '';
    
    return binary.map(bit => bit === 1 ? '━━━' : '━ ━').reverse().join('<br>');
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
   * エラー状態の表示
   */
  displayErrorState() {
    const optionsElement = document.getElementById('choiceOptions');
    optionsElement.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>選択肢の生成に失敗しました</h3>
        <p>システムエラーが発生しました。しばらく待ってから再試行してください。</p>
        <button class="retry-button" onclick="location.reload()">
          再試行
        </button>
      </div>
    `;
  }

  /**
   * イベントリスナーの設定
   */
  /**
   * 分人間矛盾の識別（哲学的受容版）
   */
  identifyPersonaContradictions(bunenjinGuidance) {
    const contradictions = [];
    const personas = Object.keys(bunenjinGuidance).filter(key => key !== 'integration');
    
    // 異なる分人間の視点の違いを「豊かさ」として識別
    for (let i = 0; i < personas.length; i++) {
      for (let j = i + 1; j < personas.length; j++) {
        const persona1 = personas[i];
        const persona2 = personas[j];
        const guidance1 = bunenjinGuidance[persona1];
        const guidance2 = bunenjinGuidance[persona2];
        
        if (this.detectRichnessInDifference(guidance1, guidance2)) {
          contradictions.push({
            persona1,
            persona2,
            difference: this.extractDifference(guidance1, guidance2),
            richnessPotential: this.assessRichnessPotential(guidance1, guidance2)
          });
        }
      }
    }
    
    return contradictions;
  }

  /**
   * 違いの中の豊かさを検出
   */
  detectRichnessInDifference(guidance1, guidance2) {
    // 異なる視点を持つことは豊かさの源
    return guidance1.perspective !== guidance2.perspective ||
           guidance1.action !== guidance2.action;
  }

  /**
   * 豊かさの表示生成
   */
  generateRichnessDisplay(richnessTransformation) {
    return `
      <div class="richness-transformation">
        <h4>🌺 多面性の豊かさ</h4>
        <div class="richness-content">
          ${richnessTransformation.transformations.map(transformation => `
            <div class="transformation-item">
              <div class="richness-insight">
                <strong>豊かな視点：</strong>
                <p>${transformation.reframe}</p>
              </div>
              <div class="growth-opportunity">
                <strong>成長の機会：</strong>
                <p>${transformation.wisdom.insight}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 違いの抽出（豊かさとして）
   */
  extractDifference(guidance1, guidance2) {
    return {
      perspectiveDifference: guidance1.perspective !== guidance2.perspective,
      actionDifference: guidance1.action !== guidance2.action,
      enrichmentType: this.classifyEnrichmentType(guidance1, guidance2)
    };
  }

  /**
   * 豊かさのポテンシャル評価
   */
  assessRichnessPotential(guidance1, guidance2) {
    return {
      complementarity: this.calculateComplementarity(guidance1, guidance2),
      synergy: this.calculateSynergy(guidance1, guidance2),
      growthPotential: this.calculateGrowthPotential(guidance1, guidance2)
    };
  }

  /**
   * 豊かさタイプの分類
   */
  classifyEnrichmentType(guidance1, guidance2) {
    // 視点の違いによる分類
    if (guidance1.perspective && guidance2.perspective) {
      return "perspective_enrichment";
    }
    if (guidance1.action && guidance2.action) {
      return "action_enrichment";
    }
    return "holistic_enrichment";
  }

  /**
   * 補完性の計算
   */
  calculateComplementarity(guidance1, guidance2) {
    // 分人の相互補完性を0-1で評価
    return Math.random() * 0.3 + 0.7; // 仮実装：高い補完性
  }

  /**
   * シナジーの計算
   */
  calculateSynergy(guidance1, guidance2) {
    // 分人の協働による相乗効果を評価
    return Math.random() * 0.2 + 0.8; // 仮実装：高いシナジー
  }

  /**
   * 成長ポテンシャルの計算
   */
  calculateGrowthPotential(guidance1, guidance2) {
    // 矛盾から生まれる成長可能性を評価
    return Math.random() * 0.25 + 0.75; // 仮実装：高い成長ポテンシャル
  }

  attachEventListeners() {
    this.container.addEventListener('click', (e) => {
      // 道の選択ボタン
      if (e.target.classList.contains('select-path-btn')) {
        const pathKey = e.target.dataset.path;
        this.displayPathDetails(pathKey);
      }
      
      // 選択確定ボタン
      if (e.target.id === 'confirmChoiceBtn') {
        this.confirmChoice();
      }
    });
  }

  /**
   * パブリックAPI
   */
  getCurrentChoices() {
    return this.currentChoices;
  }

  getSelectedPath() {
    return this.selectedPath;
  }

  reset() {
    this.currentChoices = null;
    this.selectedPath = null;
    this.initializeChoiceSystem();
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.AuthenticChoiceSystem = AuthenticChoiceSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticChoiceSystem;
}

console.log("🎭 AuthenticChoiceSystem.js 読み込み完了");