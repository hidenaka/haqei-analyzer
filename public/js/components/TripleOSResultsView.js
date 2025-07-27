class TripleOSResultsView extends BaseComponent {
  constructor(containerId, options) {
    super(containerId, options);

    this.analysisResult = options.analysisResult;
    this.insights = options.insights;
    this.compatibilityLoader = options.compatibilityLoader;
    this.dataManager = options.dataManager;
    this.compatibilityAnalysisData = null;
    this.radarChart = null;

    console.log("✅ [TripleOSResultsView] 対話型UI実装 - 初期化完了");
  }

  async init() {
    console.log("🚀 [TripleOSResultsView] 対話型UI実装開始");
    await this.render();
    console.log("✅ [TripleOSResultsView] 対話型UI実装完了");
  }

  async render() {
    console.log("🎨 [TripleOSResultsView] 対話型UI描画開始");

    if (!this.analysisResult) {
      this.container.innerHTML =
        '<div class="error">分析結果が見つかりません。</div>';
      console.error("❌ 分析結果データが存在しません");
      return;
    }

    const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;

    // データ検証の詳細ログ
    console.log('🔍 [TripleOSResultsView] データ検証開始');
    console.log('  - engineOS:', !!engineOS, engineOS?.osName || 'undefined');
    console.log('  - interfaceOS:', !!interfaceOS, interfaceOS?.osName || 'undefined');
    console.log('  - safeModeOS:', !!safeModeOS, safeModeOS?.osName || 'undefined');

    if (!engineOS || !interfaceOS || !safeModeOS) {
      console.error('❌ [TripleOSResultsView] データ検証失敗:', {
        hasEngineOS: !!engineOS,
        hasInterfaceOS: !!interfaceOS,
        hasSafeModeOS: !!safeModeOS,
        analysisResult: this.analysisResult
      });
      this.container.innerHTML =
        '<div class="error">分析結果データが不完全です。</div>';
      return;
    }

    console.log('✅ [TripleOSResultsView] データ検証成功');

    // メイン画面のHTML構造（対話型UI仕様）
    const html = `
          <div class="interactive-results-view">
              <!-- ヘルプボタン -->
              <button class="help-button" id="help-button" title="使い方ガイド">?</button>
              
              <!-- ヘルプモーダル -->
              <div class="help-modal" id="help-modal">
                  <div class="help-modal-content">
                      <button class="help-modal-close" id="help-modal-close">&times;</button>
                      <h2>HaQei Analyzer 使い方ガイド</h2>
                      <div class="help-content">
                          <h3>📊 レーダーチャート</h3>
                          <p>あなたの人格を8つの次元で可視化しています。各項目にマウスを合わせると詳細説明が表示されます。</p>
                          
                          <h3>🎯 OSカード</h3>
                          <p>3つのOSカードをクリックすると詳細情報が展開されます：</p>
                          <ul>
                              <li><strong>エンジンOS:</strong> あなたの核となる価値観と行動原理</li>
                              <li><strong>インターフェースOS:</strong> 他者との関わり方とコミュニケーションスタイル</li>
                              <li><strong>セーフモードOS:</strong> ストレス時や困難な状況での対処パターン</li>
                          </ul>
                          
                          <h3>📈 スコアの見方</h3>
                          <p>各スコアは以下の意味を持ちます：</p>
                          <ul>
                              <li><strong>90%以上:</strong> 極めて高い一致</li>
                              <li><strong>80-89%:</strong> 高い一致度</li>
                              <li><strong>70-79%:</strong> 良い一致度</li>
                              <li><strong>60-69%:</strong> 中程度の一致</li>
                              <li><strong>50-59%:</strong> 部分的一致</li>
                          </ul>
                          
                          <h3>💡 活用のヒント</h3>
                          <p>・エンジンOSは最も重要な要素です<br>
                          ・セーフモードは適度に活用し、過度に依存しないことが大切<br>
                          ・3つのOSのバランスを意識して自己理解を深めましょう</p>
                      </div>
                  </div>
              </div>
              <!-- ヒーローセクション -->
              <section class="hero-section">
                  <div class="hero-content">
                      <div class="archetype-type">${this.getPersonalityType(
                        engineOS.osName,
                        engineOS.hexagramInfo?.catchphrase
                      )}</div>
                      <h1 class="archetype-title">${engineOS.osName}の人</h1>
                      <p class="archetype-catchphrase">「${
                        engineOS.hexagramInfo?.catchphrase || "深い洞察を持つ人"
                      }」</p>
                      <div class="archetype-reading">${this.getReadingName(
                        engineOS.osName
                      )}</div>
                  </div>
                  <div class="interactive-chart-container">
                      <canvas id="interactive-radar-chart" width="400" height="400"></canvas>
                  </div>
              </section>
  
              <!-- 分人思想による3つの人格セクション -->
              <section class="interactive-os-section bunenjin-section">
                  <div class="bunenjin-concept-header">
                      <h2 class="section-title">🎭 あなたの中に住む3人の『分人』</h2>
                      <p class="bunenjin-philosophy">
                          平野啓一郎の「分人思想」によると、私たちには状況に応じて現れる複数の人格があります。<br>
                          「本当の自分探し」よりも、それぞれの分人を理解し、適切に使い分けることが豊かな人生への鍵です。
                      </p>
                  </div>
                  <div class="interactive-os-cards bunenjin-cards">
                      <div class="interactive-os-card" data-os="engine" data-hexagram="${
                        engineOS.hexagramId
                      }">
                          <div class="os-card-header">
                              <div class="os-icon">🔧</div>
                              <div class="os-info bunenjin-info">
                                  <h3>🔥 本音の分人 - あなたの核となる価値観</h3>
                                  <p class="os-catchphrase">${
                                    engineOS.hexagramInfo?.catchphrase ||
                                    "深い洞察を持つ人"
                                  }</p>
                                  <p class="os-description">${
                                    engineOS.hexagramInfo?.description || ""
                                  }</p>
                                  <div class="bunenjin-explanation">
                                      <small>一人でいる時や信頼できる人と一緒にいる時に現れる、最も純粋なあなたです</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-name-group">
                                      <div class="os-name">${
                                        engineOS.osName
                                      }</div>
                                      <div class="os-subtitle">（${this.getReadingName(
                                        engineOS.osName
                                      )}）</div>
                                  </div>
                                  <div class="os-score-group">
                                      <div class="score-container bunenjin-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🔥 本音の分人の影響力</span>
                                              <div class="score-help-icon" title="この分人（価値観）があなたの人生にどれだけ強く影響しているかを示します。高いほど、この価値観で判断・行動することが多いことを意味します。">❓</div>
                                          </div>
                                          <div class="score-explanation bunenjin-explanation">
                                              <p>人生の重要な場面で、<strong>${Math.round(
                                                engineOS.strength * 100
                                              )}%の確率</strong>でこの本音の分人が判断を主導します</p>
                                              <div class="bunenjin-insight">
                                                  <small>💡 この分人が強いほど、あなたらしい選択ができる可能性が高まります</small>
                                              </div>
                                          </div>
                                          <div class="score-display">
                                              <div class="os-score ${this.getScoreColorClass(
                                                Math.round(
                                                  engineOS.strength * 100
                                                )
                                              )}">${Math.round(
      engineOS.strength * 100
    )}%</div>
                                              <div class="os-score-label">${this.getEngineScoreDescription(
                                                Math.round(
                                                  engineOS.strength * 100
                                                )
                                              )}</div>
                                          </div>
                                          <div class="score-bar">
                                              <div class="score-fill ${this.getScoreColorClass(
                                                Math.round(
                                                  engineOS.strength * 100
                                                )
                                              )}" style="width: ${Math.round(
      engineOS.strength * 100
    )}%"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="expand-indicator">+</div>
                          </div>
                          <div class="os-card-details">
                              <div class="strengths-section">
                                  <h4>💪 潜在的な強み</h4>
                                  <div class="strengths-list" id="engine-strengths-list">読み込み中...</div>
                              </div>
                              <div class="challenges-section">
                                  <h4>🎯 成長の課題</h4>
                                  <div class="challenges-list" id="engine-challenges-list">読み込み中...</div>
                              </div>
                              <div class="core-drive-section">
                                  <h4>🔥 核となる動機</h4>
                                  <div class="core-drive-content" id="engine-core-drive">読み込み中...</div>
                              </div>
                          </div>
                      </div>
  
                      <div class="interactive-os-card" data-os="interface" data-hexagram="${
                        interfaceOS.hexagramId
                      }">
                          <div class="os-card-header">
                              <div class="os-icon">🖥️</div>
                              <div class="os-info bunenjin-info">
                                  <h3>🌐 社会的分人 - 他者との関わり方</h3>
                                  <p class="os-catchphrase">${
                                    interfaceOS.hexagramInfo?.catchphrase ||
                                    "社会の中での魅力的な表現"
                                  }</p>
                                  <p class="os-description">${
                                    interfaceOS.hexagramInfo?.description || ""
                                  }</p>
                                  <div class="bunenjin-explanation">
                                      <small>職場や友人関係など、社会的な役割を果たす時に活躍する分人です</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-name-group">
                                      <div class="os-name">${
                                        interfaceOS.osName
                                      }</div>
                                      <div class="os-subtitle">(コミュニケーションスタイル)</div>
                                  </div>
                                  <div class="os-score-group">
                                      <div class="score-container bunenjin-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🌐 社会的分人の表現頻度</span>
                                              <div class="score-help-icon" title="本音の分人の価値観が、社会的な場面でこのスタイルとして表現される頻度を示します。本音と社会的な顔の一致度とも言えます。">❓</div>
                                          </div>
                                          <div class="score-explanation bunenjin-explanation">
                                              <p>他者と関わる場面で、<strong>10回中${Math.round(
                                                interfaceOS.matchScore / 10
                                              )}回程度</strong>この社会的分人が現れます</p>
                                              <div class="bunenjin-insight">
                                                  <small>💡 ${interfaceOS.matchScore >= 70 ? '本音の分人と社会的分人がよく調和しています' : interfaceOS.matchScore >= 30 ? '状況に応じて使い分けができています' : '意識的に社会的分人を育てることで表現力が向上します'}</small>
                                              </div>
                                          </div>
                                          <div class="score-display">
                                              <div class="os-score ${this.getScoreColorClass(
                                                Math.round(
                                                  interfaceOS.matchScore
                                                )
                                              )}">${Math.round(
      interfaceOS.matchScore
    )}%</div>
                                              <div class="os-score-label">${this.getInterfaceScoreDescription(
                                                Math.round(
                                                  interfaceOS.matchScore
                                                )
                                              )}</div>
                                          </div>
                                          <div class="score-bar">
                                              <div class="score-fill ${this.getScoreColorClass(
                                                Math.round(
                                                  interfaceOS.matchScore
                                                )
                                              )}" style="width: ${Math.round(
      interfaceOS.matchScore
    )}%"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="expand-indicator">+</div>
                          </div>
                          <div class="os-card-details">
                              <div class="compatibility-analysis" id="interface-compatibility">
                                  <h4>🤝 エンジンOSとの組み合わせ分析</h4>
                                  <div class="compatibility-content" id="interface-compatibility-content">読み込み中...</div>
                              </div>
                              <div class="dynamics-visualization" id="interface-dynamics">
                                  <h4>🔄 内なる力学</h4>
                                  <div class="dynamics-explanation">
                                      <p><strong>力学分析について:</strong> インターフェースOSの5つの易経的評価軸で、対人関係での内面的な相互作用メカニズムを数値化しています。</p>
                                  </div>
                                  <div class="dynamics-metrics" id="interface-metrics">読み込み中...</div>
                              </div>
                          </div>
                      </div>
  
                      <div class="interactive-os-card" data-os="safemode" data-hexagram="${
                        safeModeOS.hexagramId
                      }">
                          <div class="os-card-header">
                              <div class="os-icon">🛡️</div>
                              <div class="os-info bunenjin-info">
                                  <h3>🛡️ 防御的分人 - ストレス時の対処法</h3>
                                  <p class="os-catchphrase">${
                                    safeModeOS.hexagramInfo?.catchphrase ||
                                    "自分を守る知恵を持つ人"
                                  }</p>
                                  <p class="os-description">${
                                    safeModeOS.hexagramInfo?.description || ""
                                  }</p>
                                  <div class="bunenjin-explanation">
                                      <small>困難な状況やストレスを感じた時に現れ、あなたを守ろうとする分人です</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-name-group">
                                      <div class="os-name">${
                                        safeModeOS.osName
                                      }</div>
                                      <div class="os-subtitle">(安全地帯)</div>
                                  </div>
                                  <div class="os-score-group">
                                      <div class="score-container bunenjin-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🛡️ 防御的分人の発動頻度</span>
                                              <div class="score-help-icon" title="困難やストレスに直面した時に、この防御的分人がどの程度現れるかを示します。この分人も大切な自分の一部です。">❓</div>
                                          </div>
                                          <div class="score-explanation bunenjin-explanation">
                                              <p>ストレスを感じた時、<strong>100回中${Math.round(
                                                safeModeOS.matchScore
                                              )}回程度</strong>この防御的分人が現れます</p>
                                              <div class="bunenjin-insight">
                                                  <small>💡 ${safeModeOS.matchScore >= 50 ? 'この分人をよく使います。適切にコントロールできれば強い味方になります' : safeModeOS.matchScore >= 10 ? 'バランス良く防御的分人を活用できています' : 'この分人はあまり使いませんが、必要な時の選択肢として覚えておきましょう'}</small>
                                              </div>
                                          </div>
                                          <div class="score-display">
                                              <div class="os-score ${this.getScoreColorClass(
                                                Math.round(
                                                  safeModeOS.matchScore
                                                )
                                              )}">${Math.round(
      safeModeOS.matchScore
    )}%</div>
                                              <div class="os-score-label">${this.getSafeModeScoreDescription(
                                                Math.round(
                                                  safeModeOS.matchScore
                                                )
                                              )}</div>
                                          </div>
                                          <div class="score-bar">
                                              <div class="score-fill ${this.getScoreColorClass(
                                                Math.round(
                                                  safeModeOS.matchScore
                                                )
                                              )}" style="width: ${Math.round(
      safeModeOS.matchScore
    )}%"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="expand-indicator">+</div>
                          </div>
                          <div class="os-card-details">
                              <div class="compatibility-analysis" id="safemode-compatibility">
                                  <h4>🛡️ エンジンOSとの組み合わせ分析</h4>
                                  <div class="compatibility-content" id="safemode-compatibility-content">読み込み中...</div>
                              </div>
                              <div class="dynamics-visualization" id="safemode-dynamics">
                                  <h4>🛡️ 防御機制の力学</h4>
                                  <div class="dynamics-explanation">
                                      <p><strong>力学分析について:</strong> セーフモードOSの5つの易経的評価軸で、ストレス時の内面的な防御メカニズムを数値化しています。</p>
                                  </div>
                                  <div class="dynamics-metrics" id="safemode-metrics">読み込み中...</div>
                              </div>
                              <div class="usage-advice" id="safemode-advice">
                                  <h4>💡 セーフモードの活用アドバイス</h4>
                                  <div class="advice-content" id="safemode-advice-content">読み込み中...</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          </div>
          `;

    this.container.innerHTML = html;
    console.log("✅ [TripleOSResultsView] 対話型HTML構造を描画完了");

    // 非同期で対話型機能を初期化
    setTimeout(() => this.initializeInteractiveFeatures(), 300);
  }

  async initializeInteractiveFeatures() {
    console.log("🔧 [TripleOSResultsView] 対話型機能を初期化中");

    // 1. インタラクティブレーダーチャート描画
    await this.renderInteractiveRadarChart();

    // 2. OSカードの詳細データ読み込み
    await this.loadOSCardDetails();

    // 3. 力学データの可視化
    await this.loadDynamicsVisualization();

    // 4. イベントリスナー設定
    this.bindInteractiveEventListeners();

    console.log("✅ [TripleOSResultsView] すべての対話型機能が初期化完了");
  }

  // セーフモード詳細モーダルを表示
  showSafeModeDetailModal(safeModeOS, osManualData) {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById("safemode-detail-modal");
    if (existingModal) {
      existingModal.remove();
    }

    const modalHTML = `
              <div class="detailed-content-modal" id="safemode-detail-modal">
                  <div class="detailed-modal-content">
                      <button class="detailed-modal-close" id="safemode-modal-close">&times;</button>
                      <div class="detailed-header">
                          <h2>🛡️ セーフモード実践ガイド</h2>
                          <div class="hexagram-name">${
                            osManualData.name || safeModeOS.osName
                          }</div>
                      </div>
                      
                      <div class="detailed-content">
                          <div class="detailed-section">
                              <h4>🚨 このセーフモードの発動パターン</h4>
                              <p>${
                                osManualData.defensive_use ||
                                "データを準備中です。"
                              }</p>
                          </div>
                          
                          <div class="detailed-section">
                              <h4>💡 適切な活用方法</h4>
                              <p>${
                                osManualData.proactive_use ||
                                "データを準備中です。"
                              }</p>
                          </div>
                          
                          <div class="detailed-section">
                              <h4>⚠️ 過度な依存を避けるために</h4>
                              <p>${
                                osManualData.debug_method ||
                                "データを準備中です。"
                              }</p>
                          </div>
                          
                          ${
                            osManualData.quests
                              ? `
                          <div class="detailed-section">
                              <h4>🎯 セーフモード改善のための実践課題</h4>
                              <div class="quest-list">
                                  ${
                                    Array.isArray(osManualData.quests)
                                      ? osManualData.quests
                                          .map(
                                            (quest) =>
                                              `<div class="quest-item">🛡️ ${quest}</div>`
                                          )
                                          .join("")
                                      : `<div class="quest-item">データを準備中です。</div>`
                                  }
                              </div>
                          </div>
                          `
                              : ""
                          }
                      </div>
                      
                      <div class="modal-footer">
                          <div class="iching-note">
                              <small>🌟 セーフモードは自己防衛の知恵です。適切に理解し活用することで、より強く成長できます</small>
                          </div>
                      </div>
                  </div>
              </div>
          `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // イベントリスナーを追加
    const modal = document.getElementById("safemode-detail-modal");
    const closeBtn = document.getElementById("safemode-modal-close");

    const closeModal = () => {
      modal.remove();
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // モーダル表示アニメーション
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });
  }

  // ヘルパーメソッドの追加
  getPersonalityType(osName, catchphrase) {
    const types = {
      風山漸: "着実な実行者",
      天澤履: "礼儀正しい実行者",
      坤為地: "包容力のある支援者",
      沢山咸: "共感型リーダー",
      乾為天: "創造的リーダー",
      震為雷: "エネルギッシュな行動者",
    };
    return types[osName] || "ユニークな個性";
  }

  getReadingName(kanjiName) {
    const readings = {
      風山漸: "ふうざんぜん",
      天澤履: "てんたくり",
      坤為地: "こんいち",
      沢山咸: "ざんざんかん",
      乾為天: "けんいてん",
      震為雷: "しんいらい",
      坎為水: "かんいすい",
      艮為山: "ごんいざん",
      巽為風: "そんいふう",
      離為火: "りいか",
      兌為沢: "だいたく",
    };
    return readings[kanjiName] || "";
  }

  getScoreColorClass(score) {
    if (score >= 90) return "score-excellent";
    if (score >= 80) return "score-high";
    if (score >= 70) return "score-good";
    if (score >= 60) return "score-medium";
    if (score >= 50) return "score-low";
    return "score-very-low";
  }

  getEngineScoreDescription(score) {
    if (score >= 90) return "この価値観で確実に行動する";
    if (score >= 80) return "この価値観で高い頻度で行動する";
    if (score >= 70) return "この価値観でよく行動する";
    if (score >= 60) return "この価値観で時々行動する";
    if (score >= 50) return "この価値観で稀に行動する";
    return "この価値観での行動は少ない";
  }

  getInterfaceScoreDescription(score) {
    if (score >= 70) return "このスタイルがよく表れる";
    if (score >= 50) return "このスタイルが時々表れる";
    if (score >= 30) return "このスタイルが稀に表れる";
    if (score >= 10) return "このスタイルがごく稀に表れる";
    if (score >= 1) return "このスタイルがほとんど表れない";
    return "このスタイルは表れない";
  }

  getSafeModeScoreDescription(score) {
    if (score >= 50) return "この対処法をよく使う";
    if (score >= 30) return "この対処法を時々使う";
    if (score >= 10) return "この対処法を稀に使う";
    if (score >= 1) return "この対処法をほとんど使わない";
    return "この対処法は使わない";
  }

  getCompatibilityScoreDescription(score) {
    if (score >= 80) return "お互いの強みが大きく発揮される";
    if (score >= 70) return "お互いの強みがよく発揮される";
    if (score >= 60) return "お互いの強みが発揮される";
    if (score >= 50) return "お互いの強みが部分的に発揮される";
    if (score >= 40) return "お互いの強みが相殺される傾向";
    if (score >= 30) return "お互いの強みが打ち消し合う";
    return "お互いの強みが大きく打ち消し合う";
  }

  async renderInteractiveRadarChart() {
    console.log("📊 [TripleOSResultsView] レーダーチャート描画開始");

    const canvas = document.getElementById("interactive-radar-chart");
    if (!canvas) {
      console.error("❌ レーダーチャートcanvas要素が見つかりません");
      return;
    }

    const ctx = canvas.getContext("2d");
    const { engineOS } = this.analysisResult;

    // エンジンOSの8次元データを取得
    const userVector = engineOS.userVector || {};
    console.log("🔍 [レーダーチャート] userVector データ:", userVector);
    console.log("🔍 [レーダーチャート] engineOS データ:", engineOS);

    const dimensions = this.getEightDimensionsWithDetails();

    // データマッピング（フォールバック付き）
    const data = dimensions.map((dim) => {
      let value = userVector[dim.key] || 0;
      // データが0の場合、hexagramIdベースでダミーデータを生成
      if (value === 0 && engineOS.hexagramId) {
        value = this.generateFallbackDimensionValue(
          engineOS.hexagramId,
          dim.key
        );
      }
      return value;
    });
    const labels = dimensions.map((dim) => dim.label);

    console.log("🔍 [レーダーチャート] 最終データ:", data);
    console.log("🔍 [レーダーチャート] ラベル:", labels);

    // 既存のチャートがあれば破棄
    if (this.radarChart) {
      this.radarChart.destroy();
    }

    this.radarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "人格プロファイル",
            data: data,
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgba(99, 102, 241, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(99, 102, 241, 1)",
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            titleColor: "#e2e8f0",
            bodyColor: "#f1f5f9",
            borderColor: "rgba(99, 102, 241, 0.8)",
            borderWidth: 2,
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 12, lineHeight: 1.4 },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function (context) {
                const dimension = dimensions[context[0].dataIndex];
                return `${dimension.label} (${context[0].parsed.r.toFixed(
                  1
                )}/10)`;
              },
              label: function (context) {
                return "";
              },
              afterLabel: function (context) {
                const dimension = dimensions[context.dataIndex];
                return [
                  dimension.iching_meaning,
                  "",
                  dimension.practical_application,
                ];
              },
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 2,
              color: "rgba(255, 255, 255, 0.6)",
              backdropColor: "transparent",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
            pointLabels: {
              color: "rgba(255, 255, 255, 0.9)",
              font: {
                size: 12,
                weight: "500",
              },
              callback: function (label, index) {
                return label;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "point",
        },
        onHover: (event, activeElements) => {
          event.native.target.style.cursor =
            activeElements.length > 0 ? "pointer" : "default";
        },
        onClick: (event, activeElements) => {
          if (activeElements.length > 0) {
            const index = activeElements[0].index;
            const dimension = dimensions[index];
            const actualValue = data[index]; // 実際にチャートに表示されている値を使用
            this.showDimensionDetailModal(dimension, actualValue);
          }
        },
      },
    });

    console.log("✅ [TripleOSResultsView] レーダーチャート描画完了");
  }

  // 8次元の詳細情報を取得
  getEightDimensionsWithDetails() {
    return [
      {
        key: "creation_power",
        label: "創造力",
        color: "#ff6b6b",
        iching_meaning: "乾為天の創造エネルギー - 無から有を生み出す天の龍の力",
        practical_application:
          "新しいアイデアの創出、イノベーション、芸術的表現において発揮される",
      },
      {
        key: "analytical_power",
        label: "分析力",
        color: "#4ecdc4",
        iching_meaning: "沢風大過の洞察力 - 複雑な事象を分解し本質を見抜く力",
        practical_application:
          "データ分析、問題解決、戦略立案において論理的思考を展開する",
      },
      {
        key: "social_power",
        label: "社交力",
        color: "#45b7d1",
        iching_meaning: "沢山咸の感応力 - 人の心に響き、つながりを生む力",
        practical_application:
          "チームワーク、ネットワーキング、リーダーシップにおいて人を動かす",
      },
      {
        key: "emotional_power",
        label: "感情力",
        color: "#96ceb4",
        iching_meaning: "水雷屯の情動エネルギー - 深い感情を理解し活用する力",
        practical_application:
          "共感力、モチベーション管理、人間関係の深化において発揮される",
      },
      {
        key: "intuitive_power",
        label: "直感力",
        color: "#ffeaa7",
        iching_meaning: "山風蠱の霊感力 - 見えない流れを感じ取る第六感の力",
        practical_application:
          "予測、タイミング判断、クリエイティブな発想において閃きを得る",
      },
      {
        key: "logical_power",
        label: "論理力",
        color: "#dda0dd",
        iching_meaning: "天水訟の弁論力 - 筋道立てて物事を組み立てる力",
        practical_application:
          "議論、説得、システム設計において論理的整合性を保つ",
      },
      {
        key: "aesthetic_power",
        label: "美的感覚",
        color: "#98d8c8",
        iching_meaning: "風雷益の調和力 - 美しさと調和を感じ創造する力",
        practical_application:
          "デザイン、美的判断、環境作りにおいて心を動かす美を創出する",
      },
      {
        key: "leadership_power",
        label: "リーダーシップ",
        color: "#f7dc6f",
        iching_meaning: "地水師の統率力 - 多様な人々を一つの目標に導く力",
        practical_application:
          "組織運営、方向性の提示、チームの統制において指導力を発揮する",
      },
    ];
  }

  // 次元詳細モーダルを表示
  showDimensionDetailModal(dimension, userValue) {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById("dimension-detail-modal");
    if (existingModal) {
      existingModal.remove();
    }

    const scoreLevel = this.getDimensionScoreLevel(userValue);
    const recommendations = this.getDimensionRecommendations(
      dimension.key,
      userValue
    );

    const modalHTML = `
              <div class="dimension-modal" id="dimension-detail-modal">
                  <div class="dimension-modal-content">
                      <button class="dimension-modal-close" id="dimension-modal-close">&times;</button>
                      <div class="dimension-header">
                          <h2>${dimension.label}</h2>
                          <div class="dimension-score-display">
                              <div class="score-circle" style="border-color: ${
                                dimension.color
                              }">
                                  <span class="score-value">${userValue.toFixed(
                                    1
                                  )}</span>
                                  <span class="score-max">/10</span>
                              </div>
                              <div class="score-level ${scoreLevel.class}">${
      scoreLevel.label
    }</div>
                          </div>
                      </div>
                      
                      <div class="dimension-content">
                          <div class="iching-section">
                              <h3>🌟 易経的な意味</h3>
                              <p>${dimension.iching_meaning}</p>
                          </div>
                          
                          <div class="practical-section">
                              <h3>🎯 実践的な活用場面</h3>
                              <p>${dimension.practical_application}</p>
                          </div>
                          
                          <div class="recommendations-section">
                              <h3>💡 あなたへの具体的アドバイス</h3>
                              ${recommendations}
                          </div>
                      </div>
                  </div>
              </div>
          `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // イベントリスナーを追加
    const modal = document.getElementById("dimension-detail-modal");
    const closeBtn = document.getElementById("dimension-modal-close");

    const closeModal = () => {
      modal.remove();
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // モーダル表示アニメーション
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });
  }

  // スコアレベルを判定
  getDimensionScoreLevel(value) {
    if (value >= 8.5) return { class: "excellent", label: "非常に優秀" };
    if (value >= 7.0) return { class: "high", label: "高い能力" };
    if (value >= 5.5) return { class: "good", label: "良好" };
    if (value >= 4.0) return { class: "medium", label: "平均的" };
    if (value >= 2.5) return { class: "developing", label: "発達中" };
    return { class: "low", label: "潜在的" };
  }

  // 次元別の推奨事項を取得
  getDimensionRecommendations(dimensionKey, value) {
    const recommendations = {
      creation_power: {
        high: "創造力が非常に高いあなたは、新しいプロジェクトの立ち上げや革新的なアイデアの創出において力を発揮できます。アートや発明、起業などの分野で才能を開花させましょう。",
        medium:
          "創造力を更に伸ばすために、日常的にブレインストーミングや新しい体験を積極的に取り入れましょう。異分野の知識を組み合わせることで、独創的なアイデアが生まれます。",
        low: "創造力は誰でも育てることができます。まずは小さな工夫から始め、「なぜ？」「もし～だったら？」という質問を習慣化しましょう。アートや音楽に触れることも効果的です。",
      },
      analytical_power: {
        high: "分析力に長けているあなたは、複雑な問題の解決やデータドリブンな意思決定において重要な役割を果たせます。コンサルティングや研究、戦略企画の分野で力を発揮しましょう。",
        medium:
          "分析スキルを更に向上させるために、論理的思考法やフレームワークを学習しましょう。数字やデータに慣れ親しみ、客観的な視点を養うことが重要です。",
        low: "分析力は練習によって向上します。まずは身近な問題を論理的に分解する習慣をつけましょう。「なぜそうなるのか？」を3回繰り返して原因を探る練習から始めてみてください。",
      },
      social_power: {
        high: "社交力が高いあなたは、チームリーダーや営業、人事などの人と関わる仕事で大きな成果を上げられます。ネットワーキングを活かし、多くの人とのつながりを築きましょう。",
        medium:
          "社交スキルを向上させるために、積極的に人との交流の機会を作りましょう。相手の立場に立って考える習慣や、効果的なコミュニケーション技術を身につけることが大切です。",
        low: "社交力は経験を積むことで必ず向上します。まずは一対一の関係から始め、相手の話をよく聞く練習をしましょう。小さな成功体験を積み重ねることで自信がつきます。",
      },
      emotional_power: {
        high: "感情力に優れているあなたは、カウンセラーや教師、クリエイターなど、人の心に寄り添う仕事で才能を発揮できます。共感力を活かし、周囲の人を支える存在になりましょう。",
        medium:
          "感情的知性を更に高めるために、自分の感情を観察し、言語化する練習をしましょう。他人の感情にも敏感になり、適切な反応ができるよう心がけることが重要です。",
        low: "感情力は意識的に育てることができます。まずは自分の感情に注意を向け、日記に書く習慣をつけましょう。映画や小説を通じて、様々な感情を体験することも効果的です。",
      },
      intuitive_power: {
        high: "直感力が鋭いあなたは、トレンドの先読みや新しい機会の発見において優れた能力を発揮できます。投資家やクリエイター、イノベーターとして活躍の場があります。",
        medium:
          "直感をより信頼できるものにするために、瞑想や内省の時間を作りましょう。直感と論理のバランスを取り、両方を活用する習慣を身につけることが大切です。",
        low: "直感力は静寂の中で育まれます。日常的に立ち止まって考える時間を作り、最初の印象や「なんとなく」の感覚にも注意を払ってみましょう。経験を積むことで精度が上がります。",
      },
      logical_power: {
        high: "論理力に長けているあなたは、法律家やエンジニア、研究者など、体系的思考が求められる分野で力を発揮できます。複雑な議論や問題解決において頼りになる存在です。",
        medium:
          "論理的思考力を更に鍛えるために、ディベートやロジカルシンキングの技法を学びましょう。前提条件や論理展開を意識的に確認する習慣をつけることが重要です。",
        low: "論理力は訓練によって向上します。まずは「なぜなら」「したがって」という接続詞を使って考えを整理する練習をしましょう。数学的思考や論理パズルも効果的です。",
      },
      aesthetic_power: {
        high: "美的感覚に優れているあなたは、デザイナーやアーティスト、建築家など、美を創造する分野で才能を開花させられます。環境づくりや空間演出においても力を発揮できます。",
        medium:
          "美的センスを磨くために、多様な芸術作品に触れ、美しいものを意識的に観察しましょう。色彩理論やデザインの基本原則を学ぶことで、感性を理論で補強できます。",
        low: "美的感覚は日常の中で育てることができます。美術館に足を運んだり、美しい風景を観察したりして、「なぜ美しいと感じるのか」を考える習慣をつけましょう。",
      },
      leadership_power: {
        high: "リーダーシップに長けているあなたは、管理職や起業家、チームリーダーとして組織を率いる役割で力を発揮できます。ビジョンを示し、人々を鼓舞する存在になりましょう。",
        medium:
          "リーダーシップスキルを向上させるために、小さなチームやプロジェクトで実践経験を積みましょう。コミュニケーション能力と意思決定スキルを意識的に磨くことが重要です。",
        low: "リーダーシップは誰でも身につけられるスキルです。まずは自分の意見をはっきりと表明し、小さな責任から引き受ける習慣をつけましょう。他者の手本となる行動を心がけることから始めてください。",
      },
    };

    const dimRec = recommendations[dimensionKey];
    if (!dimRec) return "<p>具体的なアドバイスを準備中です。</p>";

    let level = "medium";
    if (value >= 7.0) level = "high";
    else if (value < 4.0) level = "low";

    return `<p>${dimRec[level]}</p>`;
  }

  // フォールバック用の次元値を生成
  generateFallbackDimensionValue(hexagramId, dimensionKey) {
    // 卦IDに基づいて特徴的な値を生成
    const baseValue = 3 + (hexagramId % 5); // 3-7の範囲

    const dimensionModifiers = {
      creation_power: hexagramId === 1 ? 2 : hexagramId % 8 === 1 ? 1.5 : 0,
      analytical_power: hexagramId === 6 ? 2 : hexagramId % 8 === 6 ? 1.5 : 0,
      social_power: hexagramId === 8 ? 2 : hexagramId % 8 === 8 ? 1.5 : 0,
      emotional_power: hexagramId === 3 ? 2 : hexagramId % 8 === 3 ? 1.5 : 0,
      intuitive_power: hexagramId === 4 ? 2 : hexagramId % 8 === 4 ? 1.5 : 0,
      logical_power: hexagramId === 7 ? 2 : hexagramId % 8 === 7 ? 1.5 : 0,
      aesthetic_power: hexagramId === 2 ? 2 : hexagramId % 8 === 2 ? 1.5 : 0,
      leadership_power: hexagramId === 5 ? 2 : hexagramId % 8 === 5 ? 1.5 : 0,
    };

    const modifier = dimensionModifiers[dimensionKey] || 0;
    const finalValue = Math.min(baseValue + modifier, 10);

    console.log(
      `🔧 [フォールバック] ${dimensionKey}: ${finalValue} (hexagram: ${hexagramId})`
    );
    return finalValue;
  }

  // エンジンOS詳細のフォールバック処理
  loadEngineOSDetailsWithFallback(hexagramId) {
    console.log(
      `🔧 [フォールバック] hexagramId ${hexagramId} のフォールバックデータを生成中`
    );

    // hexagrams_masterからデータを取得
    const hexagramData =
      window.hexagrams_master &&
      window.hexagrams_master.find((h) => h.hexagram_id === hexagramId);

    const strengthsList = document.getElementById("engine-strengths-list");
    if (strengthsList) {
      strengthsList.innerHTML = `
                  <div class="strengths-content">
                      <div class="strength-item">
                          <span class="strength-icon">⭐</span>
                          <span class="strength-text">この卦の特性を活かした戦略的役割</span>
                      </div>
                      <div class="strength-item">
                          <span class="strength-icon">⭐</span>
                          <span class="strength-text">${
                            hexagramData?.name_jp || `第${hexagramId}卦`
                          }の深い洞察力</span>
                      </div>
                      <div class="strength-item">
                          <span class="strength-icon">⭐</span>
                          <span class="strength-text">独自の価値観に基づく判断力</span>
                      </div>
                      <div class="fallback-note">
                          <small>💫 詳細データを準備中です。基本的な特性を表示しています。</small>
                      </div>
                  </div>
              `;
    }

    const challengesList = document.getElementById("engine-challenges-list");
    if (challengesList) {
      challengesList.innerHTML = `
                  <div class="challenges-content">
                      <div class="challenge-item">
                          <span class="challenge-icon">⚠️</span>
                          <span class="challenge-text">過度な理想主義による現実とのギャップ</span>
                      </div>
                      <div class="challenge-item">
                          <span class="challenge-icon">⚠️</span>
                          <span class="challenge-text">他者との価値観の違いへの対処</span>
                      </div>
                      <div class="fallback-note">
                          <small>💫 詳細データを準備中です。一般的な傾向を表示しています。</small>
                      </div>
                  </div>
              `;
    }

    const coreDrive = document.getElementById("engine-core-drive");
    if (coreDrive) {
      coreDrive.innerHTML = `
                  <div class="core-drive-content">
                      <p class="summary-text">${
                        hexagramData?.description ||
                        `第${hexagramId}卦の深い智慧を持つあなたは、独自の価値観で世界を捉える特別な存在です。`
                      }</p>
                      <div class="fallback-note">
                          <small>💫 詳細データを準備中です。基本的な解釈を表示しています。</small>
                      </div>
                  </div>
              `;
    }
  }

  // 詳細表示ボタンのイベントリスナーを設定
  bindDetailedViewButtons(hexagramId, osManualData) {
    const detailedButtons = document.querySelectorAll(".detailed-view-btn");
    detailedButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const section = e.target.dataset.section;
        const hexagramId = e.target.dataset.hexagram;
        this.showDetailedContent(section, hexagramId, osManualData);
      });
    });
  }

  // 詳細コンテンツを表示
  showDetailedContent(section, hexagramId, osManualData) {
    // 既存のモーダルがあれば削除
    const existingModal = document.getElementById("detailed-content-modal");
    if (existingModal) {
      existingModal.remove();
    }

    let title, content;

    switch (section) {
      case "strengths":
        title = "⭐ 戦略的活用法 - 攻めの使い方";
        content = `
                      <div class="detailed-section">
                          <h4>🚀 このOSを攻めに使うと？</h4>
                          <p>${
                            osManualData.proactive_use || "データを準備中です。"
                          }</p>
                      </div>
                      <div class="detailed-section">
                          <h4>🎯 具体的な活用場面</h4>
                          <div class="role-examples">
                              ${
                                Array.isArray(osManualData.strategic_roles)
                                  ? osManualData.strategic_roles
                                      .map(
                                        (role) =>
                                          `<div class="role-item">• ${role}</div>`
                                      )
                                      .join("")
                                  : `<div class="role-item">${
                                      osManualData.strategic_roles ||
                                      "データを準備中です。"
                                    }</div>`
                              }
                          </div>
                      </div>
                  `;
        break;

      case "challenges":
        title = "🔧 デバッグ方法 - 暴走時の対処法";
        content = `
                      <div class="detailed-section">
                          <h4>⚠️ 暴走時の症状</h4>
                          <p>${
                            osManualData.debug_pattern || "データを準備中です。"
                          }</p>
                      </div>
                      <div class="detailed-section">
                          <h4>💊 デバッグ（修正）方法</h4>
                          <p>${
                            osManualData.debug_method || "データを準備中です。"
                          }</p>
                      </div>
                      <div class="detailed-section">
                          <h4>🛡️ 守りに入った時の特徴</h4>
                          <p>${
                            osManualData.defensive_use || "データを準備中です。"
                          }</p>
                      </div>
                  `;
        break;

      case "quest":
        title = "🎯 今週のクエスト - 実践課題";
        content = `
                      <div class="detailed-section">
                          <h4>🎯 今週のクエスト</h4>
                          <div class="quest-list">
                              ${
                                Array.isArray(osManualData.quests)
                                  ? osManualData.quests
                                      .map(
                                        (quest) =>
                                          `<div class="quest-item">📋 ${quest}</div>`
                                      )
                                      .join("")
                                  : `<div class="quest-item">データを準備中です。</div>`
                              }
                          </div>
                      </div>
                      <div class="detailed-section">
                          <h4>💡 このOSの本質</h4>
                          <p>${
                            osManualData.summary || "データを準備中です。"
                          }</p>
                      </div>
                  `;
        break;

      default:
        title = "詳細情報";
        content = "<p>詳細情報を準備中です。</p>";
    }

    const modalHTML = `
              <div class="detailed-content-modal" id="detailed-content-modal">
                  <div class="detailed-modal-content">
                      <button class="detailed-modal-close" id="detailed-modal-close">&times;</button>
                      <div class="detailed-header">
                          <h2>${title}</h2>
                          <div class="hexagram-name">${
                            osManualData.name || `第${hexagramId}卦`
                          }</div>
                      </div>
                      
                      <div class="detailed-content">
                          ${content}
                      </div>
                      
                      <div class="modal-footer">
                          <div class="iching-note">
                              <small>💫 これらの解説は易経の64卦と現代心理学を組み合わせた独自の分析に基づいています</small>
                          </div>
                      </div>
                  </div>
              </div>
          `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // イベントリスナーを追加
    const modal = document.getElementById("detailed-content-modal");
    const closeBtn = document.getElementById("detailed-modal-close");

    const closeModal = () => {
      modal.remove();
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // モーダル表示アニメーション
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });
  }

  async loadOSCardDetails() {
    console.log("📋 [TripleOSResultsView] OSカード詳細データ読み込み開始");

    const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;

    // エンジンOSの詳細データを読み込み
    await this.loadEngineOSDetails(engineOS);

    // インターフェースOSの組み合わせ分析を読み込み
    await this.loadInterfaceCompatibility(engineOS, interfaceOS);

    // セーフモードOSの組み合わせ分析を読み込み
    await this.loadSafeModeCompatibility(engineOS, safeModeOS);

    console.log("✅ [TripleOSResultsView] OSカード詳細データ読み込み完了");
  }

  async loadEngineOSDetails(engineOS) {
    try {
      const hexagramId = engineOS.hexagramId;
      console.log("🔍 [エンジンOS] hexagramId:", hexagramId);
      console.log("🔍 [エンジンOS] engineOS:", engineOS);
      console.log(
        "🔍 [エンジンOS] 利用可能なos_manual keys:",
        window.os_manual ? Object.keys(window.os_manual).slice(0, 10) : "なし"
      );

      const osManualData = window.os_manual && window.os_manual[hexagramId];

      if (!osManualData) {
        console.warn(`⚠️ os_manual[${hexagramId}]のデータが見つかりません`);
        // フォールバック処理を追加
        this.loadEngineOSDetailsWithFallback(hexagramId);
        return;
      }

      // 強みリストを更新（戦略的役割）
      const strengthsList = document.getElementById("engine-strengths-list");
      if (strengthsList && osManualData.strategic_roles) {
        const roles = Array.isArray(osManualData.strategic_roles)
          ? osManualData.strategic_roles
          : osManualData.strategic_roles
              .split("\n")
              .filter((role) => role.trim());

        strengthsList.innerHTML = `
                      <div class="strengths-content">
                          ${roles
                            .map(
                              (role) =>
                                `<div class="strength-item">
                                  <span class="strength-icon">⭐</span>
                                  <span class="strength-text">${role.replace(
                                    /^[•\-\*]\s*/,
                                    ""
                                  )}</span>
                              </div>`
                            )
                            .join("")}
                          <button class="detailed-view-btn" data-section="strengths" data-hexagram="${hexagramId}">
                              📖 戦略的活用法を詳しく見る
                          </button>
                      </div>
                  `;
      }

      // 課題リストを更新（デバッグパターン）
      const challengesList = document.getElementById("engine-challenges-list");
      if (challengesList && osManualData.debug_pattern) {
        const challenges = osManualData.debug_pattern
          .split("\n")
          .filter((item) => item.trim());
        challengesList.innerHTML = `
                      <div class="challenges-content">
                          ${challenges
                            .map(
                              (challenge) =>
                                `<div class="challenge-item">
                                  <span class="challenge-icon">⚠️</span>
                                  <span class="challenge-text">${challenge.replace(
                                    /^[•\-\*]\s*/,
                                    ""
                                  )}</span>
                              </div>`
                            )
                            .join("")}
                          <button class="detailed-view-btn" data-section="challenges" data-hexagram="${hexagramId}">
                              🔧 デバッグ方法を詳しく見る
                          </button>
                      </div>
                  `;
      }

      // 核となる動機を更新
      const coreDrive = document.getElementById("engine-core-drive");
      if (coreDrive && osManualData.summary) {
        coreDrive.innerHTML = `
                      <div class="core-drive-content">
                          <p class="summary-text">${osManualData.summary}</p>
                          <button class="detailed-view-btn" data-section="quest" data-hexagram="${hexagramId}">
                              🎯 今週のクエストを見る
                          </button>
                      </div>
                  `;
      }

      // 詳細表示ボタンにイベントリスナーを追加
      this.bindDetailedViewButtons(hexagramId, osManualData);
    } catch (error) {
      console.error("❌ エンジンOS詳細データ読み込みエラー:", error);
    }
  }

  async loadInterfaceCompatibility(engineOS, interfaceOS) {
    try {
      const compatibilityContent = document.getElementById(
        "interface-compatibility-content"
      );
      if (!compatibilityContent) return;

      // 本音の分人と社会的分人の相互作用分析
      const compatibility = this.calculateBunenjinCompatibility(
        engineOS.hexagramId,
        interfaceOS.hexagramId,
        "social"
      );

      if (compatibility) {
        const harmonyType = this.getBunenjinHarmonyType(compatibility.score);
        const harmonyColor = this.getBunenjinHarmonyColor(compatibility.score);
        const gapAnalysis = this.analyzeBunenjinGap(compatibility.score);

        compatibilityContent.innerHTML = `
                      <div class="bunenjin-compatibility-result">
                          <div class="bunenjin-harmony-header">
                              <div class="harmony-type-badge ${harmonyColor}">
                                  <span class="harmony-icon">${harmonyType.icon}</span>
                                  <span class="harmony-label">${harmonyType.label}</span>
                              </div>
                              <div class="compatibility-score">${Math.round(
                                compatibility.score
                              )}%</div>
                          </div>
                          
                          <div class="bunenjin-relationship-explanation">
                              <h5>🤝 本音と社会的な顔の関係</h5>
                              <p>あなたの本音の分人「${engineOS.osName}」と社会的分人「${interfaceOS.osName}」は<strong>${harmonyType.description}</strong>しています。</p>
                              
                              <div class="gap-insight">
                                  <div class="insight-header">
                                      <span class="insight-icon">🔍</span>
                                      <span class="insight-title">分人ギャップ分析</span>
                                  </div>
                                  <p>${gapAnalysis.description}</p>
                                  <div class="practical-advice">
                                      <strong>💡 実践的アドバイス:</strong>
                                      <p>${gapAnalysis.advice}</p>
                                  </div>
                              </div>
                              
                              <div class="bunenjin-synergy">
                                  <h6>✨ この組み合わせの活用法</h6>
                                  <p>${this.getBunenjinSynergyAdvice(compatibility.score, 'social')}</p>
                              </div>
                          </div>
                      </div>
                  `;
      } else {
        compatibilityContent.innerHTML = `
                      <div class="bunenjin-loading">
                          <div class="loading-icon">🤝</div>
                          <p>本音と社会的分人の関係を分析中...</p>
                      </div>
                  `;
      }
    } catch (error) {
      console.error("❌ 本音・社会的分人の相互作用分析エラー:", error);
    }
  }

  async loadSafeModeCompatibility(engineOS, safeModeOS) {
    try {
      const compatibilityContent = document.getElementById(
        "safemode-compatibility-content"
      );
      if (!compatibilityContent) return;

      // 本音の分人と防御的分人の相互作用分析
      const compatibility = this.calculateBunenjinCompatibility(
        engineOS.hexagramId,
        safeModeOS.hexagramId,
        "defense"
      );

      if (compatibility) {
        const protectionType = this.getBunenjinProtectionType(compatibility.score);
        const protectionColor = this.getBunenjinProtectionColor(compatibility.score);
        const defensePattern = this.analyzeDefensePattern(compatibility.score);

        compatibilityContent.innerHTML = `
                      <div class="bunenjin-compatibility-result defense-analysis">
                          <div class="bunenjin-protection-header">
                              <div class="protection-type-badge ${protectionColor}">
                                  <span class="protection-icon">${protectionType.icon}</span>
                                  <span class="protection-label">${protectionType.label}</span>
                              </div>
                              <div class="compatibility-score">${Math.round(
                                compatibility.score
                              )}%</div>
                          </div>
                          
                          <div class="bunenjin-defense-explanation">
                              <h5>🛡️ 本音と防御的分人の関係</h5>
                              <p>あなたの本音の分人「${engineOS.osName}」と防御的分人「${safeModeOS.osName}」は<strong>${protectionType.description}</strong>しています。</p>
                              
                              <div class="defense-pattern-insight">
                                  <div class="insight-header">
                                      <span class="insight-icon">🔍</span>
                                      <span class="insight-title">防御パターン分析</span>
                                  </div>
                                  <p><strong>ストレス時の特徴:</strong> ${defensePattern.description}</p>
                                  <div class="recovery-strategy">
                                      <strong>🌱 復帰戦略:</strong>
                                      <p>${defensePattern.recoveryAdvice}</p>
                                  </div>
                              </div>
                              
                              <div class="bunenjin-balance-strategy">
                                  <h6>⚖️ 健全なバランスの取り方</h6>
                                  <p>${this.getBunenjinDefenseAdvice(compatibility.score)}</p>
                                  
                                  <div class="integration-tips">
                                      <div class="tip-item">
                                          <span class="tip-icon">✨</span>
                                          <span class="tip-text">防御的分人は、あなたの大切な一部です</span>
                                      </div>
                                      <div class="tip-item">
                                          <span class="tip-icon">🏠</span>
                                          <span class="tip-text">必要な時に使い、安全になったら本音に戻る</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `;
      } else {
        compatibilityContent.innerHTML = `
                      <div class="bunenjin-loading">
                          <div class="loading-icon">🛡️</div>
                          <p>本音と防御的分人の関係を分析中...</p>
                      </div>
                  `;
      }
    } catch (error) {
      console.error("❌ 本音・防御的分人の相互作用分析エラー:", error);
    }
  }

  getRelationshipType(score) {
    if (score >= 80) return "SYNERGY";
    if (score >= 70) return "HARMONY";
    if (score >= 50) return "BALANCE";
    if (score >= 30) return "TENSION";
    return "CONFLICT";
  }

  getRelationshipColor(score) {
    if (score >= 80) return "synergy";
    if (score >= 70) return "harmony";
    if (score >= 50) return "balance";
    if (score >= 30) return "tension";
    return "conflict";
  }

  // 分人思想ベースの相互作用分析
  calculateBunenjinCompatibility(hexagramId1, hexagramId2, bunenjinType) {
    // 卦IDを8つの基本卦グループに分類
    const getTrigramGroup = (id) => ((id - 1) % 8) + 1;
    const group1 = getTrigramGroup(hexagramId1);
    const group2 = getTrigramGroup(hexagramId2);

    // 分人思想専用の相性マトリックス
    const bunenjinMatrix = {
      1: { 1: 85, 2: 65, 3: 90, 4: 75, 5: 60, 6: 45, 7: 70, 8: 55 }, // 乾 - 創造的リーダー
      2: { 1: 65, 2: 88, 3: 50, 4: 80, 5: 75, 6: 90, 7: 60, 8: 95 }, // 兌 - 調和型コミュニケーター
      3: { 1: 90, 2: 50, 3: 82, 4: 65, 5: 85, 6: 40, 7: 55, 8: 70 }, // 離 - 情熱的表現者
      4: { 1: 75, 2: 80, 3: 65, 4: 87, 5: 90, 6: 60, 7: 45, 8: 70 }, // 震 - 行動力溢れる実行者
      5: { 1: 60, 2: 75, 3: 85, 4: 90, 5: 84, 6: 65, 7: 50, 8: 75 }, // 巽 - 柔軟性を持つ適応者
      6: { 1: 45, 2: 90, 3: 40, 4: 60, 5: 65, 6: 83, 7: 85, 8: 98 }, // 坎 - 深い知恵を持つ思考者
      7: { 1: 70, 2: 60, 3: 55, 4: 45, 5: 50, 6: 85, 7: 92, 8: 75 }, // 艮 - 安定性を持つ守護者
      8: { 1: 55, 2: 95, 3: 70, 4: 70, 5: 75, 6: 98, 7: 75, 8: 89 }, // 坤 - 包容力ある支援者
    };

    const baseScore = bunenjinMatrix[group1]?.[group2] || 60;

    // 分人タイプ別の調整
    let adjustedScore = baseScore;
    if (bunenjinType === "social") {
      // 社会的分人は表現の一致性を重視
      adjustedScore = Math.min(baseScore + 8, 98);
    } else if (bunenjinType === "defense") {
      // 防御的分人は心理的安全性を重視
      adjustedScore = Math.max(baseScore - 15, 20);
    }

    return {
      score: adjustedScore,
      description: this.getBunenjinCompatibilityDescription(adjustedScore, bunenjinType),
    };
  }

  // 旧メソッドも保持（互換性のため）
  calculateSimpleCompatibility(hexagramId1, hexagramId2, type) {
    // 分人思想ベースにリダイレクト
    const bunenjinType = type === "interface" ? "social" : type === "safemode" ? "defense" : "authentic";
    return this.calculateBunenjinCompatibility(hexagramId1, hexagramId2, bunenjinType);
  }

  // 分人思想ベースの相互作用説明を生成
  getBunenjinCompatibilityDescription(score, bunenjinType) {
    const descriptions = {
      social: {
        high: "本音の分人と社会的分人が非常によく調和しています。あなたらしさが自然に表現され、真の魅力で人を引きつけます。",
        medium: "本音と社会的な面がバランス良く機能しています。状況に応じて上手く使い分けができています。",
        low: "本音と社会的な面にギャップがあります。意識的に本音を表現する練習をすることで、より自然な関係を築けます。"
      },
      defense: {
        high: "本音の分人と防御的分人がよく連携しています。ストレス時でも価値観を大切にしながら自分を守ることができます。",
        medium: "本音と防御的な面が適度にバランスを保っています。困難な状況でも最終的には本音に戻ることができます。",
        low: "本音と防御的な面の間に緊張関係があります。ストレス時に本来の自分とは異なる行動を取りがちですが、これも必要な知恵です。"
      },
      authentic: {
        high: "本音の分人が非常に安定し、一貫した価値観で行動できています。",
        medium: "本音の分人が適度に機能し、状況に応じて柔軟に対応できています。",
        low: "本音の分人が不安定で、価値観の確立や自己理解の深化が必要です。"
      }
    };

    const typeDesc = descriptions[bunenjinType] || descriptions.authentic;
    if (score >= 75) return typeDesc.high;
    if (score >= 50) return typeDesc.medium;
    return typeDesc.low;
  }

  // 互換性説明を生成（旧メソッド保持）
  getCompatibilityDescription(score, type) {
    const bunenjinType = type === "interface" ? "social" : type === "safemode" ? "defense" : "authentic";
    return this.getBunenjinCompatibilityDescription(score, bunenjinType);
  }

  // 8卦カラーカードの表示
  _renderBaguaCards() {
        console.log("🎴 [TripleOSResultsView] 8卦カラーカード表示開始");
        
        const container = document.getElementById('bagua-cards-container');
        if (!container) {
            console.error("❌ [TripleOSResultsView] Bagua cards container not found - DOM may not be ready");
            // フレームの最後で再試行
            setTimeout(() => this._renderBaguaCards(), 100);
            return;
        }

        const { engineOS } = this.analysisResult;
        if (!engineOS) {
            console.error("❌ [TripleOSResultsView] Engine OS data not found:", this.analysisResult);
            container.innerHTML = '<div style="color: red; text-align: center; padding: 2rem;">エンジンOSデータが見つかりません</div>';
            return;
        }
        
        if (!engineOS.vector) {
            console.error("❌ [TripleOSResultsView] Engine OS vector data not found:", engineOS);
            container.innerHTML = '<div style="color: red; text-align: center; padding: 2rem;">ベクトルデータが見つかりません</div>';
            return;
        }

        console.log("🔍 [TripleOSResultsView] Engine OS vector data:", engineOS.vector);

        // 8卦のデータ定義（色と名前）
        const baguaData = [
            { key: '乾_創造性', name: '創造性', color: '#ff6b6b', colorRgb: '255,107,107', icon: '☰', trigram: '乾' },
            { key: '震_行動性', name: '行動性', color: '#4ecdc4', colorRgb: '78,205,196', icon: '☳', trigram: '震' },
            { key: '坎_探求性', name: '探求性', color: '#45b7d1', colorRgb: '69,183,209', icon: '☵', trigram: '坎' },
            { key: '艮_安定性', name: '安定性', color: '#96ceb4', colorRgb: '150,206,180', icon: '☶', trigram: '艮' },
            { key: '坤_受容性', name: '受容性', color: '#ffeaa7', colorRgb: '255,234,167', icon: '☷', trigram: '坤' },
            { key: '巽_適応性', name: '適応性', color: '#fd79a8', colorRgb: '253,121,168', icon: '☴', trigram: '巽' },
            { key: '離_表現性', name: '表現性', color: '#fdcb6e', colorRgb: '253,203,110', icon: '☲', trigram: '離' },
            { key: '兌_調和性', name: '調和性', color: '#a29bfe', colorRgb: '162,155,254', icon: '☱', trigram: '兌' }
        ];

        // カードのHTML生成
        const cardsHTML = baguaData.map(bagua => {
            const value = engineOS.vector[bagua.key] || 0;
            const percentage = Math.round(Math.max(0, Math.min(100, value * 10)));
            const intensity = percentage / 100;
            
            return `
                <div class="bagua-card" style="--card-color: ${bagua.color}; --card-color-rgb: ${bagua.colorRgb}; --intensity: ${intensity}">
                    <div class="bagua-icon">${bagua.icon}</div>
                    <div class="bagua-name">${bagua.name}</div>
                    <div class="bagua-trigram">${bagua.trigram}</div>
                    <div class="bagua-score">${percentage}%</div>
                    <div class="bagua-bar">
                        <div class="bagua-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = cardsHTML;
        console.log("✅ [TripleOSResultsView] 8卦カラーカード表示完了");
        console.log("🔍 [TripleOSResultsView] Generated cards HTML length:", cardsHTML.length);
        console.log("🔍 [TripleOSResultsView] Container now has children:", container.children.length);
        
        // 追加の表示確認
        if (container.children.length === 0) {
            console.error("❌ [TripleOSResultsView] Warning: No cards were rendered to the container!");
            console.log("🔍 Container HTML after setting:", container.innerHTML);
        }
  }

  async loadDynamicsVisualization() {
    console.log("🔄 [TripleOSResultsView] 力学データ可視化開始");

    const { interfaceOS, safeModeOS } = this.analysisResult;

    // インターフェースOS力学データを可視化
    await this.visualizeInterfaceDynamics(interfaceOS);

    // セーフモードOS力学データを可視化
    await this.visualizeSafeModeDynamics(safeModeOS);

    console.log("✅ [TripleOSResultsView] 力学データ可視化完了");
  }

  async visualizeInterfaceDynamics(interfaceOS) {
    try {
      const metricsContainer = document.getElementById("interface-metrics");
      if (!metricsContainer) return;

      const hexagramData =
        window.hexagrams_master &&
        window.hexagrams_master.find(
          (h) => h.hexagram_id === interfaceOS.hexagramId
        );

      if (!hexagramData) {
        metricsContainer.innerHTML =
          "<p>インターフェース動力学データを読み込めませんでした。</p>";
        return;
      }

      // 5つの評価軸のデータを可視化
      const metrics = [
        {
          key: "innovation_score",
          label: "革新性",
          value: hexagramData.innovation_score || 0,
        },
        {
          key: "stability_score",
          label: "安定性",
          value: hexagramData.stability_score || 0,
        },
        {
          key: "cooperation_score",
          label: "協調性",
          value: hexagramData.cooperation_score || 0,
        },
        {
          key: "independence_score",
          label: "独立性",
          value: hexagramData.independence_score || 0,
        },
        {
          key: "intuition_score",
          label: "直感性",
          value: hexagramData.intuition_score || 0,
        },
      ];

      metricsContainer.innerHTML = `
                  <div class="dynamics-grid">
                      ${metrics
                        .map(
                          (metric) => `
                          <div class="metric-item">
                              <div class="metric-label">${metric.label}</div>
                              <div class="metric-bar">
                                  <div class="metric-fill" style="width: ${
                                    metric.value * 10
                                  }%; background: linear-gradient(135deg, #6366f1, #8b5cf6);"></div>
                              </div>
                              <div class="metric-value">${metric.value.toFixed(
                                1
                              )}</div>
                          </div>
                      `
                        )
                        .join("")}
                  </div>
                  <div class="dynamics-summary">
                      <p>インターフェースOSの内面的な力学構造を5つの軸で分析した結果です。これらの値が対人関係での行動パターンに影響します。</p>
                  </div>
              `;
    } catch (error) {
      console.error("❌ インターフェース力学データ可視化エラー:", error);
    }
  }

  async visualizeSafeModeDynamics(safeModeOS) {
    try {
      const metricsContainer = document.getElementById("safemode-metrics");
      const adviceContainer = document.getElementById(
        "safemode-advice-content"
      );

      if (!metricsContainer || !adviceContainer) return;

      const hexagramData =
        window.hexagrams_master &&
        window.hexagrams_master.find(
          (h) => h.hexagram_id === safeModeOS.hexagramId
        );

      if (!hexagramData) {
        metricsContainer.innerHTML =
          "<p>セーフモード動力学データを読み込めませんでした。</p>";
        return;
      }

      // セーフモード用の5つの評価軸
      const metrics = [
        {
          key: "resilience_score",
          label: "回復力",
          value:
            hexagramData.resilience_score || hexagramData.stability_score || 0,
        },
        {
          key: "adaptability_score",
          label: "適応力",
          value:
            hexagramData.adaptability_score ||
            hexagramData.innovation_score ||
            0,
        },
        {
          key: "protection_score",
          label: "防御力",
          value:
            hexagramData.protection_score ||
            hexagramData.independence_score ||
            0,
        },
        {
          key: "support_seeking_score",
          label: "支援希求",
          value:
            hexagramData.support_seeking_score ||
            hexagramData.cooperation_score ||
            0,
        },
        {
          key: "introspection_score",
          label: "内省力",
          value:
            hexagramData.introspection_score ||
            hexagramData.intuition_score ||
            0,
        },
      ];

      metricsContainer.innerHTML = `
                  <div class="dynamics-grid">
                      ${metrics
                        .map(
                          (metric) => `
                          <div class="metric-item">
                              <div class="metric-label">${metric.label}</div>
                              <div class="metric-bar">
                                  <div class="metric-fill" style="width: ${
                                    metric.value * 10
                                  }%; background: linear-gradient(135deg, #10b981, #34d399);"></div>
                              </div>
                              <div class="metric-value">${metric.value.toFixed(
                                1
                              )}</div>
                          </div>
                      `
                        )
                        .join("")}
                  </div>
                  <div class="dynamics-summary">
                      <p>セーフモードOSの防御機制を5つの軸で分析した結果です。ストレス時にこれらの特性が働きます。</p>
                  </div>
              `;

      // セーフモード活用アドバイスを生成（易経データ活用）
      const score = Math.round(safeModeOS.matchScore);
      const osManualData =
        window.os_manual && window.os_manual[safeModeOS.hexagramId];

      let advice = "";
      let practicalAdvice = "";

      if (osManualData) {
        // os_manualからの具体的なアドバイス
        practicalAdvice = osManualData.defensive_use || "";
      }

      if (score >= 50) {
        advice = `あなたはストレス時にこの防御機制をよく使います。「${safeModeOS.osName}」の特性を理解し、適度に活用しつつ、過度に依存しないよう注意しましょう。`;
      } else if (score >= 10) {
        advice = `この防御機制は時々使う程度です。「${safeModeOS.osName}」の特性を理解し、ストレス時の選択肢として覚えておくと良いでしょう。`;
      } else {
        advice = `この防御機制はほとんど使わないタイプです。「${safeModeOS.osName}」以外の対処法も探してみることをお勧めします。`;
      }

      adviceContainer.innerHTML = `
                  <div class="advice-content">
                      <div class="advice-main">
                          <p>${advice}</p>
                          ${
                            practicalAdvice
                              ? `<div class="iching-insight">
                              <h6>🌟 易経的洞察</h6>
                              <p>${practicalAdvice}</p>
                          </div>`
                              : ""
                          }
                      </div>
                      <div class="advice-tips">
                          <h5>💡 実践的活用ガイド</h5>
                          <div class="tips-grid">
                              <div class="tip-item">
                                  <span class="tip-icon">🚨</span>
                                  <div class="tip-content">
                                      <strong>緊急時の使い方</strong>
                                      <p>セーフモードは緊急時の一時的な対処法として活用</p>
                                  </div>
                              </div>
                              <div class="tip-item">
                                  <span class="tip-icon">🎯</span>
                                  <div class="tip-content">
                                      <strong>長期的な視点</strong>
                                      <p>エンジンOSの強みを活かした根本的解決法を模索</p>
                                  </div>
                              </div>
                              <div class="tip-item">
                                  <span class="tip-icon">🤗</span>
                                  <div class="tip-content">
                                      <strong>自己受容</strong>
                                      <p>セーフモード発動時は自分を責めず、まず安全を確保</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      ${
                        osManualData && osManualData.quests
                          ? `
                          <button class="detailed-view-btn" data-section="safemode-practice" data-hexagram="${safeModeOS.hexagramId}">
                              🛡️ セーフモード実践ガイドを見る
                          </button>
                      `
                          : ""
                      }
                  </div>
              `;

      // セーフモード用の詳細ボタンがあれば、イベントリスナーを追加
      const safeModeDetailBtn =
        adviceContainer.querySelector(".detailed-view-btn");
      if (safeModeDetailBtn && osManualData) {
        safeModeDetailBtn.addEventListener("click", () => {
          this.showSafeModeDetailModal(safeModeOS, osManualData);
        });
      }
    } catch (error) {
      console.error("❌ セーフモード力学データ可視化エラー:", error);
    }
  }

  bindInteractiveEventListeners() {
    console.log("🔗 [TripleOSResultsView] 対話型イベントリスナー設定");

    // OSカードの展開機能
    const cards = this.container.querySelectorAll(".interactive-os-card");
    cards.forEach((card) => {
      const header = card.querySelector(".os-card-header");
      const indicator = card.querySelector(".expand-indicator");

      header.addEventListener("click", () => {
        const isExpanded = card.classList.contains("expanded");

        // 他のカードを閉じる（アコーディオン効果）
        cards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove("expanded");
            otherCard.querySelector(".expand-indicator").textContent = "+";
          }
        });

        // 現在のカードをトグル
        card.classList.toggle("expanded");
        indicator.textContent = card.classList.contains("expanded") ? "-" : "+";
      });
    });

    // ヘルプモーダルのイベントリスナー
    const helpButton = document.getElementById("help-button");
    const helpModal = document.getElementById("help-modal");
    const helpClose = document.getElementById("help-modal-close");

    if (helpButton && helpModal && helpClose) {
      helpButton.addEventListener("click", () => {
        helpModal.classList.add("show");
      });

      helpClose.addEventListener("click", () => {
        helpModal.classList.remove("show");
      });

      // モーダル背景クリックで閉じる
      helpModal.addEventListener("click", (event) => {
        if (event.target === helpModal) {
          helpModal.classList.remove("show");
        }
      });

      // ESCキーで閉じる
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && helpModal.classList.contains("show")) {
          helpModal.classList.remove("show");
        }
      });
    }
  }

  // 分人思想専用のヘルパーメソッド群

  // 社会的分人との調和タイプを取得
  getBunenjinHarmonyType(score) {
    if (score >= 80) return { icon: '🌟', label: '高い調和', description: '非常によく調和' };
    if (score >= 65) return { icon: '✨', label: '良好な調和', description: 'よく調和' };
    if (score >= 50) return { icon: '⚖️', label: 'バランス型', description: 'バランスが取れて' };
    if (score >= 35) return { icon: '🔄', label: '補完関係', description: '補完し合って' };
    return { icon: '🔍', label: '成長の余地', description: 'ギャップがあるが成長の余地が' };
  }

  // 調和度に応じた色クラスを取得
  getBunenjinHarmonyColor(score) {
    if (score >= 80) return 'harmony-excellent';
    if (score >= 65) return 'harmony-good';
    if (score >= 50) return 'harmony-balanced';
    if (score >= 35) return 'harmony-complementary';
    return 'harmony-growth';
  }

  // 分人ギャップ分析
  analyzeBunenjinGap(score) {
    if (score >= 75) {
      return {
        description: '本音の分人と社会的分人がよく一致しており、自然体で人と関わることができています。',
        advice: 'この調和を活かして、リーダーシップやメンターの役割で力を発揮してみましょう。'
      };
    } else if (score >= 50) {
      return {
        description: '本音と社会的な顔の間に適度なバランスがあり、TPOに応じた使い分けができています。',
        advice: '状況に応じてより意識的に使い分けることで、さらに効果的なコミュニケーションが可能になります。'
      };
    } else {
      return {
        description: '本音の分人と社会的分人の間にギャップがあります。これは決して悪いことではありません。',
        advice: '小さな場面から本音を表現する練習をすることで、より自然で魅力的な人間関係を築けるでしょう。'
      };
    }
  }

  // 防御的分人の保護タイプを取得
  getBunenjinProtectionType(score) {
    if (score >= 75) return { icon: '🛡️', label: '強固な連携', description: '強固に連携' };
    if (score >= 55) return { icon: '🤝', label: '協力関係', description: '協力し合って' };
    if (score >= 40) return { icon: '⚖️', label: '独立関係', description: '独立して' };
    if (score >= 25) return { icon: '🔄', label: '時々対立', description: '時々対立しながらも' };
    return { icon: '⚡', label: '緊張関係', description: '緊張関係にありながらも' };
  }

  // 保護度に応じた色クラスを取得
  getBunenjinProtectionColor(score) {
    if (score >= 75) return 'protection-strong';
    if (score >= 55) return 'protection-cooperative';
    if (score >= 40) return 'protection-independent';
    if (score >= 25) return 'protection-occasional';
    return 'protection-tension';
  }

  // 防御パターン分析
  analyzeDefensePattern(score) {
    if (score >= 70) {
      return {
        description: 'ストレス時でも本音の価値観を保ちながら自分を守ろうとします。建設的な防御が得意です。',
        recoveryAdvice: '本音の分人の強みを意識的に思い出すことで、より早く安心状態に戻ることができます。'
      };
    } else if (score >= 40) {
      return {
        description: 'ストレス時は本音と防御的な面が時々対立しますが、最終的にはバランスを取り戻します。',
        recoveryAdvice: '防御的分人が働いている時は、まず安全を確保してから本音の分人に戻る順序を意識しましょう。'
      };
    } else {
      return {
        description: 'ストレス時は本音とは異なる行動を取りがちですが、これも自分を守るための大切な知恵です。',
        recoveryAdvice: '防御的分人も大切な一部です。批判せずに受け入れ、安全になったら本音に戻ることを心がけましょう。'
      };
    }
  }

  // 分人シナジー活用アドバイス
  getBunenjinSynergyAdvice(score, type) {
    if (type === 'social') {
      if (score >= 75) {
        return '本音の分人と社会的分人がよく連携しているので、リーダーシップやメンター役で力を発揮できます。人の成長を支援する場面で特に輝けるでしょう。';
      } else if (score >= 50) {
        return '状況に応じて使い分けができているので、多様な人間関係で活躍できます。意識的に本音を少しずつ表現することで、さらに魅力的になれます。';
      } else {
        return '本音と社会的な面のギャップを活かして、幅広い人との関係を築けます。まずは信頼できる人から本音を表現する練習をしてみましょう。';
      }
    } else {
      return '各分人の特性を理解し、適切に使い分けることで豊かな人生を送ることができます。';
    }
  }

  // 防御的分人のバランスアドバイス
  getBunenjinDefenseAdvice(score) {
    if (score >= 70) {
      return '本音の価値観と防御機制がよく調和しているので、ストレス時でも建設的な対処ができます。この強みを活かして、困難な状況でのリーダーシップを発揮することもできるでしょう。';
    } else if (score >= 40) {
      return '本音と防御的な面が適度にバランスを保っているので、状況に応じて柔軟に対応できます。ストレス時は一度立ち止まって、どの分人で対応するかを意識的に選択してみましょう。';
    } else {
      return '本音と防御的な面の間に緊張がありますが、これも多様性の表れです。防御的分人が働いている時は批判せず、まず安全を確保してから本音に戻ることを意識しましょう。';
    }
  }

  // クリーンアップメソッド
  destroy() {
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }
    console.log("🧹 [TripleOSResultsView] リソースをクリーンアップしました");
  }
}
