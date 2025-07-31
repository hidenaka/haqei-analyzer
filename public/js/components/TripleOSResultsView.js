/*
 * TripleOSResultsView.js
 * 
 * トリプルOSシステム（エンジンOS、インターフェースOS、セーフモードOS）の
 * 分析結果を表示するコンポーネント
 * 
 * 多面的自己理解（multi-faceted self-understanding）に基づく次世代パーソナリティ分析システム
 * 
 * 【実装状況メモ - 2025/01/28】
 * - エンジンOS詳細データ: os_manual未実装 → showNotImplementedMessage使用
 * - インターフェースOS詳細データ: 未実装 → showNotImplementedMessage使用  
 * - セーフモードOS詳細データ: 未実装 → showNotImplementedMessage使用
 * - 互換性データ: engine-interface/engine-safemode JSONファイルからの読み込み実装済み
 * - フォールバック処理: 誤解防止のため「まだ実装していません」と明示表示
 * 
 * 【今後の実装予定】
 * - os_manualデータベースの実装（各卦の詳細データ）
 * - インターフェースOS/セーフモードOS用詳細データの実装
 * - エラーハンドリングの改善
 */

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

  // 🚀 高速化されたTriple OSデータ抽出（デバッグログ最小化）
  // Supports I Ching wisdom by ensuring robust access to all three personality layers
  async extractTripleOSData(analysisResult) {
    const debugMode = this.options?.debugMode || false;
    
    if (debugMode) {
      console.log('🔧 [TripleOSResultsView] トリプルOSデータ抽出開始');
      console.log('🔍 [DEBUG] analysisResult type:', typeof analysisResult, 'keys:', analysisResult ? Object.keys(analysisResult) : 'N/A');
    }
    
    // JSON文字列の場合はパース
    if (typeof analysisResult === 'string') {
      try {
        analysisResult = JSON.parse(analysisResult);
        if (debugMode) console.log('✅ [TripleOSResultsView] JSON parsing successful');
      } catch (error) {
        console.error('❌ [TripleOSResultsView] JSON parsing failed:', error);
        return { engineOS: null, interfaceOS: null, safeModeOS: null };
      }
    }
    
    if (!analysisResult || typeof analysisResult !== 'object') {
      console.warn('⚠️ Invalid analysis result structure');
      return { engineOS: null, interfaceOS: null, safeModeOS: null };
    }

    // Strategy 1: Direct access (current expected structure)
    let engineOS = analysisResult.engineOS;
    let interfaceOS = analysisResult.interfaceOS;
    let safeModeOS = analysisResult.safeModeOS;
    
    if (debugMode) {
      console.log('🔍 [Strategy 1] Direct access:', { engineOS: !!engineOS, interfaceOS: !!interfaceOS, safeModeOS: !!safeModeOS });
    }

    // Strategy 2: Check for unified diagnosis data format
    if (!engineOS && analysisResult.tripleOS) {
      if (debugMode) console.log('🔄 [Strategy 2] Using tripleOS nested structure');
      engineOS = analysisResult.tripleOS.engineOS;
      interfaceOS = analysisResult.tripleOS.interfaceOS;
      safeModeOS = analysisResult.tripleOS.safeModeOS;
    }

    // Strategy 3: Check for legacy primary OS mapping
    if (!engineOS && analysisResult.primaryOS) {
      if (debugMode) console.log('🔄 [Strategy 3] Using primaryOS as engineOS fallback');
      engineOS = analysisResult.primaryOS;
    }

    // Strategy 4: Check for alternative property names
    if (!engineOS) {
      engineOS = analysisResult.engine_os || analysisResult.engineOs || analysisResult['engine-os'];
      console.log('🔍 [Strategy 4] Alternative engineOS:', !!engineOS);
    }
    if (!interfaceOS) {
      interfaceOS = analysisResult.interface_os || analysisResult.interfaceOs || analysisResult['interface-os'];
      console.log('🔍 [Strategy 4] Alternative interfaceOS:', !!interfaceOS);
    }
    if (!safeModeOS) {
      safeModeOS = analysisResult.safe_mode_os || analysisResult.safeModeOs || analysisResult['safe-mode-os'];
      console.log('🔍 [Strategy 4] Alternative safeModeOS:', !!safeModeOS);
    }

    // Strategy 5: Extract from array-based structures (if present)
    if (!engineOS && analysisResult.operatingSystems && Array.isArray(analysisResult.operatingSystems)) {
      console.log('🔄 [Strategy 5] Checking operatingSystems array:', analysisResult.operatingSystems.length);
      const osArray = analysisResult.operatingSystems;
      engineOS = osArray.find(os => os.type === 'engine' || os.osType === 'engine');
      interfaceOS = osArray.find(os => os.type === 'interface' || os.osType === 'interface');
      safeModeOS = osArray.find(os => os.type === 'safemode' || os.osType === 'safemode' || os.type === 'safe-mode');
      console.log('🔍 [Strategy 5] Array results:', { engineOS: !!engineOS, interfaceOS: !!interfaceOS, safeModeOS: !!safeModeOS });
    }

    // Strategy 6: トリプルOS理論専用 - hexagram-based structure search
    if (!engineOS || !interfaceOS || !safeModeOS) {
      console.log('🔄 [Strategy 6] トリプルOS理論 hexagram structure search');
      
      // Look for hexagram data in various locations
      const searchHexagramData = (data, osType) => {
        if (!data) return null;
        
        // Check for hexagram properties
        if (data.hexagramId || data.osId || data.hexagram || data.id) {
          console.log(`🔍 [Strategy 6] Found ${osType} hexagram data:`, data);
          return data;
        }
        
        // Check nested objects
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'object' && data[key] !== null) {
            const nested = searchHexagramData(data[key], osType);
            if (nested) return nested;
          }
        }
        return null;
      };
      
      // Search all properties for hexagram data
      if (!engineOS) {
        engineOS = searchHexagramData(analysisResult.engineOS, 'engineOS') ||
                  searchHexagramData(analysisResult.山雷頤, 'engineOS') ||
                  searchHexagramData(analysisResult.engine, 'engineOS');
      }
      if (!interfaceOS) {
        interfaceOS = searchHexagramData(analysisResult.interfaceOS, 'interfaceOS') ||
                     searchHexagramData(analysisResult.天澤履, 'interfaceOS') ||
                     searchHexagramData(analysisResult.interface, 'interfaceOS');
      }
      if (!safeModeOS) {
        safeModeOS = searchHexagramData(analysisResult.safeModeOS, 'safeModeOS') ||
                    searchHexagramData(analysisResult.坤為地, 'safeModeOS') ||
                    searchHexagramData(analysisResult.safemode, 'safeModeOS');
      }
      
      console.log('🔍 [Strategy 6] Hexagram search results:', { engineOS: !!engineOS, interfaceOS: !!interfaceOS, safeModeOS: !!safeModeOS });
    }

    // Data enrichment: Ensure consistent property names for Triple OS display
    if (engineOS && !engineOS.osName && engineOS.name) {
      engineOS.osName = engineOS.name;
    }
    if (interfaceOS && !interfaceOS.osName && interfaceOS.name) {
      interfaceOS.osName = interfaceOS.name;
    }
    if (safeModeOS && !safeModeOS.osName && safeModeOS.name) {
      safeModeOS.osName = safeModeOS.name;
    }

    // 🚨 最終検証: トリプルOSデータ抽出結果の詳細確認
    console.log('🔍 [FINAL] トリプルOSデータ抽出最終結果:');
    console.log('  - engineOS found:', !!engineOS);
    if (engineOS) {
      console.log('    engineOS.osName:', engineOS.osName);
      console.log('    engineOS.name:', engineOS.name);
      console.log('    engineOS.hexagramId:', engineOS.hexagramId);
      console.log('    engineOS.osId:', engineOS.osId);
      console.log('    engineOS keys:', Object.keys(engineOS));
    }
    console.log('  - interfaceOS found:', !!interfaceOS);
    if (interfaceOS) {
      console.log('    interfaceOS.osName:', interfaceOS.osName);
      console.log('    interfaceOS.name:', interfaceOS.name);
      console.log('    interfaceOS.hexagramId:', interfaceOS.hexagramId);
      console.log('    interfaceOS.osId:', interfaceOS.osId);
      console.log('    interfaceOS keys:', Object.keys(interfaceOS));
    }
    console.log('  - safeModeOS found:', !!safeModeOS);
    if (safeModeOS) {
      console.log('    safeModeOS.osName:', safeModeOS.osName);
      console.log('    safeModeOS.name:', safeModeOS.name);
      console.log('    safeModeOS.hexagramId:', safeModeOS.hexagramId);
      console.log('    safeModeOS.osId:', safeModeOS.osId);
      console.log('    safeModeOS keys:', Object.keys(safeModeOS));
    }

    // Validate extracted data quality
    const extractionQuality = this.validateExtractedOSData({ engineOS, interfaceOS, safeModeOS });
    
    console.log('✅ [TripleOSResultsView] トリプルOSデータ抽出完了:', {
      engineOS: !!engineOS,
      interfaceOS: !!interfaceOS, 
      safeModeOS: !!safeModeOS,
      quality: extractionQuality,
      SUCCESS: !!(engineOS && interfaceOS && safeModeOS)
    });

    // 🚨 エラー状態での緊急対策
    if (!engineOS || !interfaceOS || !safeModeOS) {
      console.error('❌ [CRITICAL] トリプルOSデータ抽出失敗 - 緊急対策実行');
      console.error('Missing:', {
        engineOS: !engineOS,
        interfaceOS: !interfaceOS,
        safeModeOS: !safeModeOS
      });
      
      // Try one more fallback - search entire object for any hexagram-like data
      console.log('🆘 [FALLBACK] 全体検索による緊急データ復旧試行');
      const fallbackSearch = await this.emergencyDataRecovery(analysisResult);
      if (fallbackSearch.found) {
        console.log('🎯 [RECOVERY] 緊急データ復旧成功!');
        return fallbackSearch.data;
      }
    }

    return { engineOS, interfaceOS, safeModeOS };
  }

  // 🆘 Emergency data recovery for Triple OS philosophy implementation - Phase 3強化版
  // Last resort method to find triple OS data when standard extraction fails
  async emergencyDataRecovery(analysisResult) {
    console.log('🆘 [EMERGENCY] Phase 3緊急データ復旧開始 - 強化探索モード');
    
    const recoveredData = { engineOS: null, interfaceOS: null, safeModeOS: null };
    let found = false;
    
    // 段階的復旧戦略を先に実行
    const advancedRecoverySteps = [
      () => this.tryStorageManagerRecovery(),
      () => this.tryLocalStorageRecovery(), 
      () => this.trySessionStorageRecovery(),
      () => this.tryIndexedDBRecovery(),
      () => this.tryOSAnalysisContextRecovery()
    ];
    
    // 強化復旧戦略を順次実行
    for (const [index, step] of advancedRecoverySteps.entries()) {
      try {
        console.log(`🔍 [RECOVERY Step ${index + 1}] 実行中...`);
        const result = step();
        
        // Promise対応
        const processResult = async (res) => {
          const resolvedResult = await res;
          if (resolvedResult && resolvedResult.found && resolvedResult.data) {
            console.log(`🎯 [RECOVERY] 段階${index + 1}で成功!`, resolvedResult.data);
            Object.assign(recoveredData, resolvedResult.data);
            found = true;
            return true;
          }
          return false;
        };
        
        if (result && typeof result.then === 'function') {
          // Async result
          if (await processResult(result)) {
            return { found: true, data: recoveredData };
          }
        } else {
          // Sync result
          if (await processResult(Promise.resolve(result))) {
            return { found: true, data: recoveredData };
          }
        }
      } catch (stepError) {
        console.warn(`⚠️ [RECOVERY Step ${index + 1}] エラー:`, stepError);
        continue;
      }
    }
    
    // Deep search function to find hexagram data anywhere in the object
    const deepSearch = (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return;
      
      // Check if current object looks like OS data
      const hasHexagramProperties = obj.hexagramId || obj.osId || obj.id || obj.hexagram;
      const hasNameProperties = obj.osName || obj.name;
      
      if (hasHexagramProperties || hasNameProperties) {
        console.log(`🔍 [EMERGENCY] 候補データ発見 at ${path}:`, obj);
        
        // Try to identify which OS this might be based on properties or known hexagram IDs
        const identifyOSType = (data) => {
          // Dynamic OS type identification based on data properties
          const hexagramId = data.hexagramId || data.osId || data.id;
          const name = data.osName || data.name || data.hexagram;
          
          // Check for explicit OS type markers in the data
          if (data.osType) {
            return data.osType;
          }
          
          // Identify by explicit property names or structure
          const lowerPath = path.toLowerCase();
          if (lowerPath.includes('engine') || data.type === 'engine') {
            return 'engineOS';
          }
          if (lowerPath.includes('interface') || data.type === 'interface') {
            return 'interfaceOS';
          }
          if (lowerPath.includes('safe') || lowerPath.includes('safemode') || data.type === 'safemode') {
            return 'safeModeOS';
          }
          
          // If we can't identify the type, return null to let the normal flow handle it
          return null;
        };
        
        const osType = identifyOSType(obj);
        if (osType && !recoveredData[osType]) {
          console.log(`🎯 [EMERGENCY] ${osType} データ復旧成功:`, obj);
          recoveredData[osType] = obj;
          found = true;
        }
      }
      
      // Continue deep search
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          deepSearch(value, path ? `${path}.${key}` : key);
        }
      }
    };
    
    // Start deep search
    deepSearch(analysisResult);
    
    // Additional search strategies for common data structures
    if (!found) {
      console.log('🔍 [EMERGENCY] 追加検索戦略実行');
      
      // Strategy: Look for arrays that might contain OS data
      const findInArrays = (obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (Array.isArray(value)) {
            console.log(`🔍 [EMERGENCY] 配列検索: ${key}`, value);
            value.forEach((item, index) => {
              if (item && typeof item === 'object') {
                deepSearch(item, `${key}[${index}]`);
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            findInArrays(value);
          }
        }
      };
      
      findInArrays(analysisResult);
    }
    
    const recoveryResult = {
      found: !!(recoveredData.engineOS || recoveredData.interfaceOS || recoveredData.safeModeOS),
      data: recoveredData,
      summary: {
        engineOS: !!recoveredData.engineOS,
        interfaceOS: !!recoveredData.interfaceOS,
        safeModeOS: !!recoveredData.safeModeOS
      }
    };
    
    console.log('✅ [EMERGENCY] 緊急データ復旧完了:', recoveryResult);
    return recoveryResult;
  }

  // Validate the quality of extracted OS data for Triple OS analysis
  validateExtractedOSData(osData) {
    const { engineOS, interfaceOS, safeModeOS } = osData;
    let score = 0;
    let maxScore = 9; // 3 OS types × 3 essential properties each

    // Check Value System (価値観システム：本質的自己)
    if (engineOS) {
      if (engineOS.osName || engineOS.name) score++;
      if (engineOS.hexagramId || engineOS.osId) score++;
      if (engineOS.strength || engineOS.score || engineOS.confidence) score++;
    }

    // Check Social System (社会的システム：対人的自己)
    if (interfaceOS) {
      if (interfaceOS.osName || interfaceOS.name) score++;
      if (interfaceOS.hexagramId || interfaceOS.osId) score++;
      if (interfaceOS.matchScore || interfaceOS.score || interfaceOS.confidence) score++;
    }

    // Check Defense System (防御システム：防護的自己)
    if (safeModeOS) {
      if (safeModeOS.osName || safeModeOS.name) score++;
      if (safeModeOS.hexagramId || safeModeOS.osId) score++;
      if (safeModeOS.matchScore || safeModeOS.score || safeModeOS.confidence) score++;
    }

    return Math.round((score / maxScore) * 100);
  }

  async render() {
    console.log("🎨 [TripleOSResultsView] 対話型UI描画開始");

    if (!this.analysisResult) {
      this.container.innerHTML =
        '<div class="error">分析結果が見つかりません。</div>';
      console.error("❌ 分析結果データが存在しません");
      return;
    }

    // 🔧 Enhanced data extraction with multiple fallbacks for Triple OS architecture compatibility
    console.log('🔍 [TripleOSResultsView] トリプルOSシステム対応データ検証開始');
    console.log('📊 [DEBUG] Complete analysisResult structure:', this.analysisResult);
    
    // Extract Triple OS data with robust fallback mechanisms
    const extractedData = await this.extractTripleOSData(this.analysisResult);
    const { engineOS, interfaceOS, safeModeOS } = extractedData;

    // Comprehensive data validation with detailed logging
    console.log('🔍 [TripleOSResultsView] トリプルOSデータ抽出結果:');
    console.log('  - engineOS:', !!engineOS, engineOS?.osName || engineOS?.name || 'undefined');
    console.log('  - interfaceOS:', !!interfaceOS, interfaceOS?.osName || interfaceOS?.name || 'undefined');
    console.log('  - safeModeOS:', !!safeModeOS, safeModeOS?.osName || safeModeOS?.name || 'undefined');

    if (!engineOS || !interfaceOS || !safeModeOS) {
      console.error('❌ [TripleOSResultsView] トリプルOSデータ検証失敗:', {
        hasEngineOS: !!engineOS,
        hasInterfaceOS: !!interfaceOS,
        hasSafeModeOS: !!safeModeOS,
        extractedData: extractedData,
        originalAnalysisResult: this.analysisResult
      });
      
      // Enhanced error message for Triple OS philosophy context
      this.container.innerHTML = `
        <div class="error" style="padding: 2rem; text-align: center; color: #ff6b6b; background: rgba(255,107,107,0.1); border-radius: 8px; margin: 1rem;">
          <h3>トリプルOS分析データが不完全です</h3>
          <p>価値観システム、社会的システム、防御システムのデータを読み込めませんでした。</p>
          <p><small>分析を再実行するか、データの整合性を確認してください。</small></p>
        </div>`;
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
                              <li><strong>価値観システム:</strong> 価値判断時に表れやすい、あなたの一つの側面</li>
                              <li><strong>社会的システム:</strong> 他者との関わりで使われる表現スタイルの一つ</li>
                              <li><strong>防御システム:</strong> ストレス時に現れやすい対処パターンの一つ</li>
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
                          <p>・価値観システムは最も重要な要素です<br>
                          ・セーフモードは適度に活用し、過度に依存しないことが大切<br>
                          ・3つのOSのバランスを意識して自己理解を深めましょう</p>
                      </div>
                  </div>
              </div>
              
              <!-- ユーザー主権を尊重するディスクレーマー -->
              <section class="wisdom-disclaimer">
                  <div class="disclaimer-content centered-content">
                      <div class="disclaimer-message">
                          <span class="disclaimer-icon">💡</span>
                          <p>これは易経の智慧に基づく一つの見方です。最終的な解釈と活用方法は、あなた自身が決めてください。</p>
                      </div>
                  </div>
              </section>

              <!-- 古代の智慧からの示唆セクション -->
              <section class="ancient-wisdom-intro">
                  <div class="wisdom-content centered-content">
                      <h2 class="wisdom-title">🌅 古代の智慧からの示唆</h2>
                      <p class="wisdom-message">
                          数千年の智慧である易経に照らし合わせると、あなたにはこのような傾向があるようです。
                          これを人生の参考の一つとしてお役立てください。
                      </p>
                      <div class="wisdom-note">
                          <p class="philosophy-note">
                              易経は古代中国の智慧の結晶であり、人生の様々な局面における指針を示してくれます。
                              このツールは易経をメタファーとして活用し、あなたの多面的な人格を理解するためのフレームワークを提供します。
                              固定的な性格診断ではなく、戦略的な人生選択のための思考材料としてご活用ください。
                          </p>
                      </div>
                  </div>
              </section>

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
                      <canvas id="interactive-radar-chart" style="max-width: 100%; max-height: 400px; width: 400px; height: 400px;"></canvas>
                  </div>
              </section>
  
              <!-- トリプルOS構成による3つのパーソナリティ・オペレーティングシステムセクション -->
              <section class="interactive-os-section triple-os-section">
                  <div class="triple-os-concept-header">
                      <h2 class="section-title">🎭 あなたの中にある3つのシステム</h2>
                      <p class="section-subtitle">易経の世界観をメタファーとして活用し、あなたの豊かな多面性を理解するためのフレームワークを提供します。価値観による判断・社会的な表現・防御的な対処、それぞれの特性を自己理解のきっかけとして活用できます。</p>
                      <div class="triple-os-philosophy-explanation">
                          <div class="philosophy-header">
                              <h4>🎭 Triple OS理論とは</h4>
                          </div>
                          <p class="philosophy-main">
                              「本当の自分」という単一の人格を探すのではなく、相手や環境によって表れる
                              <strong>複数の「あなた」</strong>が存在することを認める考え方です。
                          </p>
                          <div class="philosophy-examples">
                              <div class="example-item">
                                  <span class="example-icon">👔</span>
                                  <span>職場でのあなた</span>
                              </div>
                              <div class="example-item">
                                  <span class="example-icon">👨‍👩‍👧‍👦</span>
                                  <span>家族といるあなた</span>
                              </div>
                              <div class="example-item">
                                  <span class="example-icon">🎉</span>
                                  <span>友人といるあなた</span>
                              </div>
                              <div class="example-item">
                                  <span class="example-icon">😤</span>
                                  <span>ストレス時のあなた</span>
                              </div>
                          </div>
                          <p class="philosophy-value">
                              これらは全て「偽物」ではなく、<strong>どれも本物のあなた</strong>です。
                              その多様性こそが、あなたの豊かさと可能性を示しています。
                          </p>
                      </div>
                      <p class="triple-os-philosophy">
                          このツールは易経の知恵を現代的なフレームワークとして活用し、あなたの複数のOS側面を理解するためのガイドです。
                          「正解」を示すのではなく、自分らしい戦略的選択をするための思考の材料を提供します。
                      </p>
                      <div class="complexity-value-explanation">
                          <h3>🌟 一致度の低さが示す豊かな可能性</h3>
                          <p class="complexity-insight">
                              もし各システムの一致度が低く感じられても、それは「診断の精度が低い」のではありません。
                              <strong>あなたの内面の豊かな複雑さ</strong>を示しています。
                          </p>
                          <div class="complexity-benefits">
                              <div class="benefit-item">
                                  <span class="benefit-icon">🎭</span>
                                  <div class="benefit-content">
                                      <h4>多面的な適応力</h4>
                                      <p>状況に応じて異なるOS側面を使い分けられる柔軟性</p>
                                  </div>
                              </div>
                              <div class="benefit-item">
                                  <span class="benefit-icon">🌈</span>
                                  <div class="benefit-content">
                                      <h4>創造的な可能性</h4>
                                      <p>既存の型にはまらない、独自の価値観や表現方法を持つ可能性</p>
                                  </div>
                              </div>
                              <div class="benefit-item">
                                  <span class="benefit-icon">🔀</span>
                                  <div class="benefit-content">
                                      <h4>戦略的な選択肢</h4>
                                      <p>人生の様々な場面で、最適なOS側面を選んで活用できる自由度</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="interactive-os-cards triple-os-cards">
                      <div class="interactive-os-card" data-os="engine" data-hexagram="${
                        engineOS.hexagramId
                      }">
                          <div class="os-card-header">
                              <div class="os-icon">🔧</div>
                              <div class="os-info triple-os-info">
                                  <h3>🔥 価値観システム - 価値判断時の一つの視点</h3>
                                  <div class="os-name-group">
                                      <div class="os-name">${
                                        engineOS.osName
                                      }</div>
                                      <div class="os-subtitle">（${this.getReadingName(
                                        engineOS.osName
                                      )}）</div>
                                  </div>
                                  <p class="os-catchphrase">${
                                    engineOS.hexagramInfo?.catchphrase ||
                                    "深い洞察を持つ人"
                                  }</p>
                                  <p class="os-description">${
                                    engineOS.hexagramInfo?.description || ""
                                  }</p>
                                  <div class="triple-os-explanation">
                                      <small>🌟 価値判断が必要な場面で表れやすい、あなたのOS側面の一つです。重要な決断を迫られた時に参考になる視点として、戦略的選択の材料の一つとして活用できます。</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-score-group">
                                      <div class="score-container triple-os-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🔥 価値観システムの一致度</span>
                                              <div class="score-help-icon" title="あなたの価値観設問への回答パターンと64卦の価値観タイプとの関連性です。価値判断時に参考になる視点の一つを示しています。">❓</div>
                                          </div>
                                          <div class="score-explanation triple-os-explanation">
                                              ${(() => {
                                                const score = Math.round(engineOS.strength * 100);
                                                const complexityInsight = this.getComplexityInsight(score);
                                                return `
                                                  <p>あなたの価値観パターンは「${engineOS.osName}」タイプと<strong>${score}%の関連性</strong>を示しています</p>
                                                  <div class="os-aspect-insight-box">
                                                      <div class="insight-header">🌟 OS側面（Triple OS）としての解釈</div>
                                                      <p><strong>${complexityInsight.level}:</strong> ${complexityInsight.tripleOSView}</p>
                                                      <p class="insight-detail">${complexityInsight.insight}</p>
                                                  </div>
                                                `;
                                              })()}
                                              <div class="triple-os-insight detailed-explanation">
                                                  <div class="explanation-section">
                                                      <strong>📊 データの背景：</strong>
                                                      <ul>
                                                          <li>あなたの価値観設問への回答パターンが、64卦中の「${engineOS.osName}」の価値観ベクトルと${Math.round(engineOS.strength * 100)}%の関連性を示す</li>
                                                          <li>この数値は固定的な「あなたの正体」ではなく、<strong>現在の一面</strong>を表している</li>
                                                      </ul>
                                                  </div>
                                                  <div class="explanation-section">
                                                      <strong>🎯 戦略的活用のヒント：</strong>
                                                      <ul>
                                                          <li>価値判断が必要な場面で、<strong>このOS側面</strong>から考えてみる</li>
                                                          <li>「${engineOS.osName}」的な選択肢がしっくりくる場面や環境を意識する</li>
                                                          <li>これは複数ある可能性の一つであり、<strong>自己理解の出発点</strong>として活用する</li>
                                                      </ul>
                                                  </div>
                                              </div>
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
                          </div>
                          <div class="os-card-details">
                              <div class="strengths-section">
                                  <h4>💪 潜在的な強み</h4>
                                  <div class="strengths-list" id="engine-strengths-list">
                                      <div class="tactical-content">
                                          <h6>🎯 戦略的活用シーン</h6>
                                          <div class="loading-placeholder">戦略的活用法を読み込み中...</div>
                                      </div>
                                  </div>
                              </div>
                              <div class="challenges-section">
                                  <h4>🎯 成長の課題</h4>
                                  <div class="challenges-list" id="engine-challenges-list">
                                      <div class="tactical-content">
                                          <h6>⚡ 改善のための戦術</h6>
                                          <div class="loading-placeholder">改善戦術を読み込み中...</div>
                                      </div>
                                  </div>
                              </div>
                              <div class="core-drive-section">
                                  <h4>🔥 主要な動機パターン</h4>
                                  <div class="core-drive-content" id="engine-core-drive">
                                      <div class="tactical-content">
                                          <h6>🔥 戦略的価値観</h6>
                                          <div class="loading-placeholder">価値観フレームワークを読み込み中...</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
  
                      <div class="interactive-os-card" data-os="interface" data-hexagram="${
                        interfaceOS.hexagramId
                      }">
                          <div class="os-card-header">
                              <div class="os-icon">🖥️</div>
                              <div class="os-info triple-os-info">
                                  <h3>🌐 社会的システム - 他者との関わり方</h3>
                                  <div class="os-name-group">
                                      <div class="os-name">${
                                        interfaceOS.osName
                                      }</div>
                                      <div class="os-subtitle">(コミュニケーションスタイル)</div>
                                  </div>
                                  <p class="os-catchphrase">${
                                    interfaceOS.hexagramInfo?.catchphrase ||
                                    "社会の中での魅力的な表現"
                                  }</p>
                                  <p class="os-description">${
                                    interfaceOS.hexagramInfo?.description || ""
                                  }</p>
                                  <div class="triple-os-explanation">
                                      <small>🎭 あなたが「他者に見せる自分」を表すシステムです。職場、友人関係、初対面の人との交流など、社会的な場面で表現する行動パターンです。価値観システムとの違いを理解することで、より戦略的なコミュニケーションを築けます。</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-score-group">
                                      <div class="score-container triple-os-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🌐 社会的システムの一致度</span>
                                              <div class="score-help-icon" title="あなたの社会的な行動パターンと64の対人関係タイプとの一致度です。他者に向けて「どのような自分」を表現するかの傾向を示します。">❓</div>
                                          </div>
                                          <div class="score-explanation triple-os-explanation">
                                              ${(() => {
                                                const score = Math.round(interfaceOS.matchScore);
                                                const complexityInsight = this.getComplexityInsight(score);
                                                return `
                                                  <p>あなたの社会的行動パターンは「${interfaceOS.osName}」タイプと<strong>${score}%の関連性</strong>を示しています</p>
                                                  <div class="os-aspect-insight-box">
                                                      <div class="insight-header">🌟 OS側面（Triple OS）としての解釈</div>
                                                      <p><strong>${complexityInsight.level}:</strong> ${complexityInsight.tripleOSView}</p>
                                                      <p class="insight-detail">${complexityInsight.insight}</p>
                                                  </div>
                                                `;
                                              })()}
                                              <div class="triple-os-insight detailed-explanation">
                                                  <div class="explanation-section">
                                                      <strong>📊 データの背景：</strong>
                                                      <ul>
                                                          <li>あなたの社会的場面での行動選択パターンが、64卦中の「${interfaceOS.osName}」の対人関係ベクトルと${Math.round(interfaceOS.matchScore)}%の関連性を示す</li>
                                                          <li>この数値は社会的表現の<strong>一つの側面</strong>を表しており、固定的なものではない</li>
                                                      </ul>
                                                  </div>
                                                  <div class="explanation-section">
                                                      <strong>🎯 戦略的活用のヒント：</strong>
                                                      <ul>
                                                          <li>社会的な場面で、<strong>このOS側面のスタイル</strong>を意識的に活用してみる</li>
                                                          <li>「${interfaceOS.osName}」的なアプローチが効果的な場面や関係性を探る</li>
                                                          <li>他にも多様な表現方法があることを前提に、<strong>選択肢の一つ</strong>として捉える</li>
                                                      </ul>
                                                  </div>
                                              </div>
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
                              <div class="os-info triple-os-info">
                                  <h3>🛡️ 防御システム - ストレス時の対処法</h3>
                                  <div class="os-name-group">
                                      <div class="os-name">${
                                        safeModeOS.osName
                                      }</div>
                                      <div class="os-subtitle">(安全地帯)</div>
                                  </div>
                                  <p class="os-catchphrase">${
                                    safeModeOS.hexagramInfo?.catchphrase ||
                                    "自分を守る知恵を持つ人"
                                  }</p>
                                  <p class="os-description">${
                                    safeModeOS.hexagramInfo?.description || ""
                                  }</p>
                                  <div class="triple-os-explanation">
                                      <small>🛡️ あなたの「内なる自分の防御機制」を表すシステムです。困難、挫折、過度のストレスに直面した時に自動的に働く対処パターンです。他の2つのシステムとの違いを理解することで、状況に応じた最適な自分を戦略的に選択できます。</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-score-group">
                                      <div class="score-container triple-os-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🛡️ 防御システムの一致度</span>
                                              <div class="score-help-icon" title="あなたの防御システムと64の防御タイプとの一致度です。ストレス時にこのタイプの特性がどの程度表れるかを示します。高いほどこの防御機制が活性化しやすいことを意味します。">❓</div>
                                          </div>
                                          <div class="score-explanation triple-os-explanation">
                                              ${(() => {
                                                const score = Math.round(safeModeOS.matchScore);
                                                const complexityInsight = this.getComplexityInsight(score);
                                                return `
                                                  <p>あなたの防御システムは「${safeModeOS.osName}」タイプと<strong>${score}%の関連性</strong>を示しています</p>
                                                  <div class="os-aspect-insight-box">
                                                      <div class="insight-header">🌟 OS側面（Triple OS）としての解釈</div>
                                                      <p><strong>${complexityInsight.level}:</strong> ${complexityInsight.tripleOSView}</p>
                                                      <p class="insight-detail">${complexityInsight.insight}</p>
                                                  </div>
                                                `;
                                              })()}
                                              <div class="triple-os-insight detailed-explanation">
                                                  <div class="explanation-section">
                                                      <strong>📊 データの背景：</strong>
                                                      <ul>
                                                          <li>あなたのストレス・困難時の内面選択パターンが、64卦中の「${safeModeOS.osName}」の防御機制ベクトルと${Math.round(safeModeOS.matchScore)}%の関連性を示す</li>
                                                          <li>この数値は防御的対処の<strong>一つの可能性</strong>を表しており、変化し得るものです</li>
                                                      </ul>
                                                  </div>
                                                  <div class="explanation-section">
                                                      <strong>🎯 戦略的活用のヒント：</strong>
                                                      <ul>
                                                          <li>ストレス時に、<strong>このOS側面の対処スタイル</strong>が表れやすいことを意識する</li>
                                                          <li>「${safeModeOS.osName}」的なアプローチが有効な場面と、別の対処が必要な場面を見極める</li>
                                                          <li>複数の防御パターンを持つことが自然であり、<strong>状況に応じた選択肢</strong>として活用する</li>
                                                      </ul>
                                                  </div>
                                                  <div class="explanation-section">
                                                      <strong>⚖️ 価値観システムとの関係：</strong>
                                                      <small>${this.getSafeModeGapInsight(engineOS.strength * 100, safeModeOS.matchScore)}</small>
                                                  </div>
                                              </div>
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
                              <div class="safemode-advanced-analysis" id="safemode-advanced">
                                  <h4>🔍 セーフモード発動メカニズム解析</h4>
                                  <div class="advanced-analysis-content" id="safemode-advanced-content">読み込み中...</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
              
              <!-- 自己探求プロンプト -->
              <section class="self-reflection-prompt">
                  <div class="reflection-content centered-content">
                      <h4 class="reflection-title">🤔 自分自身との対話</h4>
                      <div class="reflection-questions">
                          <div class="question-group">
                              <h5>📝 分析結果について</h5>
                              <ul class="reflection-list">
                                  <li>この結果のどの部分が「確かにそうだ」と感じましたか？</li>
                                  <li>どの部分に「それは違う」という違和感を覚えましたか？</li>
                                  <li>結果で示されていない、あなたの別の側面はありますか？</li>
                              </ul>
                          </div>
                          <div class="question-group">
                              <h5>🎭 多面的な自己の発見</h5>
                              <ul class="reflection-list">
                                  <li>どんな場面で、どんな「あなた」が表れるでしょうか？</li>
                                  <li>仕事中の自分と、親しい友人といる時の自分は同じですか？</li>
                                  <li>ストレス時の自分に、普段とは違う特徴がありますか？</li>
                              </ul>
                          </div>
                          <div class="question-group">
                              <h5>⭐ 戦略的活用の検討</h5>
                              <ul class="reflection-list">
                                  <li>これらの結果を、今後どのような場面で活用してみたいですか？</li>
                                  <li>人間関係や仕事において、新たに意識してみたいことはありますか？</li>
                                  <li>自分の複数の側面を理解することで、どんな可能性が見えてきますか？</li>
                              </ul>
                          </div>
                      </div>
                      <div class="reflection-insight-box">
                          <p class="reflection-insight">🌟 これらの質問に「正解」はありません。</p>
                          <p class="reflection-detail">あなた自身が感じたことが、最も価値ある洞察です。違和感や疑問こそが、より深い自己理解への入り口になります。</p>
                      </div>
                      <div class="os-aspect-reminder">
                          <p class="philosophy-note">
                              易経の智慧では、固定された単一の人格を探すのではなく、状況や関係性に応じて現れる
                              様々な「OS側面」を理解し、戦略的に活用することを重視します。
                          </p>
                      </div>
                  </div>
              </section>

              <!-- Phase 4: 批判的・生産的視点対応システム -->
              <section class="critical-thinking-section" id="critical-thinking-section">
                  <div class="critical-thinking-header">
                      <h2 class="section-title">🧠 批判的・生産的視点</h2>
                      <p class="section-subtitle">診断結果を「答え」ではなく「問い」として活用する</p>
                  </div>
                  
                  <!-- Phase 5.3: 実践行動ブリッジセクション -->
                  <section class="action-bridge-section" id="action-bridge-section">
                      <!-- ActionBridgeViewがここに挿入される -->
                  </section>
                  
                  <div class="critical-tabs">
                      <button class="critical-tab active" data-tab="shadow">影の探求</button>
                      <button class="critical-tab" data-tab="challenge">自己挑戦</button>
                      <button class="critical-tab" data-tab="limitations">ツールの限界</button>
                  </div>
                  
                  <div class="critical-content">
                      <!-- 影の探求タブ -->
                      <div class="critical-tab-content active" id="shadow-tab">
                          <div class="shadow-analysis-container">
                              <div class="shadow-intro">
                                  <h3>🌑 「強み」の裏に隠れた影</h3>
                                  <p>すべての特性には光と影があります。影を理解することで、より統合的な自己理解が可能になります。</p>
                              </div>
                              <div id="shadow-analysis-content">
                                  <!-- シャドウ分析結果がここに動的に挿入される -->
                                  <div class="loading-shadow">分析中...</div>
                              </div>
                          </div>
                      </div>
                      
                      <!-- 自己挑戦タブ -->
                      <div class="critical-tab-content" id="challenge-tab">
                          <div class="self-challenge-container">
                              <div class="challenge-intro">
                                  <h3>🤔 診断結果への挑戦的質問</h3>
                                  <p>以下の質問は、あなたが診断結果に対してより深く考えるためのものです。</p>
                              </div>
                              <div id="challenge-questions-content">
                                  <!-- 挑戦的質問がここに動的に挿入される -->
                                  <div class="loading-challenge">生成中...</div>
                              </div>
                          </div>
                      </div>
                      
                      <!-- ツールの限界タブ -->
                      <div class="critical-tab-content" id="limitations-tab">
                          <div class="limitations-container">
                              <div class="limitations-intro">
                                  <h3>⚠️ この診断ツールの限界</h3>
                                  <p>適切な活用のために、このツールの限界を理解しておきましょう。</p>
                              </div>
                              <div id="limitations-content">
                                  <!-- ツール限界の説明がここに動的に挿入される -->
                                  <div class="loading-limitations">準備中...</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              <!-- 批判的・生産的視点カード -->
              <section class="critical-productive-section">
                  <div id="critical-productive-card-container"></div>
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

    // 4. セーフモード発動メカニズム解析の表示
    if (this.insights) {
      await this.displaySafeModeAdvancedAnalysis(this.insights);
    }

    // 5. Phase 4: 批判的思考機能の初期化
    await this.initializeCriticalThinkingFeatures();

    // 6. 批判的・生産的視点カードの初期化
    await this.initializeCriticalProductiveCard();

    // 7. Phase 5.3: 実践行動ブリッジの初期化
    await this.initializeActionBridge();

    // 7. イベントリスナー設定
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
    // Use catchphrase or derive from OS name dynamically
    if (catchphrase) {
      return this.derivePersonalityTypeFromCatchphrase(catchphrase);
    }
    return "ユニークな個性";
  }

  derivePersonalityTypeFromCatchphrase(catchphrase) {
    if (catchphrase.includes('リーダー') || catchphrase.includes('導')) return "創造的リーダー";
    if (catchphrase.includes('支え') || catchphrase.includes('包容')) return "包容力のある支援者";
    if (catchphrase.includes('実行') || catchphrase.includes('着実')) return "着実な実行者";
    if (catchphrase.includes('礼儀') || catchphrase.includes('調和')) return "礼儀正しい実行者";
    if (catchphrase.includes('共感') || catchphrase.includes('感情')) return "共感型リーダー";
    if (catchphrase.includes('エネルギー') || catchphrase.includes('行動')) return "エネルギッシュな行動者";
    return "ユニークな個性";
  }

  getReadingName(kanjiName) {
    // Get reading from hexagram data dynamically
    const hexagramData = this.dataManager?.getAllHexagramData();
    if (hexagramData) {
      const hexagram = hexagramData.find(h => h.name_jp === kanjiName);
      if (hexagram && hexagram.reading) {
        return hexagram.reading;
      }
    }
    
    // Fallback: basic readings for common hexagrams
    const basicReadings = {
      乾為天: "けんいてん",
      坤為地: "こんいち",
      離為火: "りいか",
      兌為沢: "だいたく",
    };
    return basicReadings[kanjiName] || "";
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
    if (score >= 1) return "このスタイルは微細に存在します";
    return "現在このスタイルは検出されていません";
  }

  getSafeModeScoreDescription(score) {
    if (score >= 70) return "このタイプの防御機制が強く表れます";
    if (score >= 50) return "このタイプの防御機制がよく表れます";
    if (score >= 30) return "このタイプの防御機制が時々表れます";
    if (score >= 15) return "このタイプの防御機制が稀に表れます";
    if (score >= 5) return "このタイプの防御機制はごく微細に存在します";
    if (score >= 1) return "このタイプの防御機制は潜在的に存在します";
    return "現在このタイプの防御機制は検出されていません";
  }

  getSafeModeGapInsight(engineScore, safeModeScore) {
    const gap = Math.abs(engineScore - safeModeScore);
    
    if (gap >= 60) {
      return 'エンジンOSとセーフモードOSの差が大きく、ストレス時は「いつもと違う人みたい」と言われることがあるかもしれません。この変化は自然な防御反応です';
    } else if (gap >= 30) {
      return 'エンジンOSとのバランスが取れており、ストレス時でも一定の一貫性を保てています。周囲からは安定感のある人と見られるでしょう';
    } else {
      return 'エンジンOSとセーフモードOSがよく調和しており、困難な状況でも「いつも落ち着いているね」と言われることが多いでしょう。内面の一貫性が高い状態です';
    }
  }

  getInterfaceCombinationInsight(matchScore) {
    if (matchScore >= 70) {
      return 'この組み合わせでは本音と表現が調和し、自然な魅力で力を発揮できます。リーダーシップやチームワークで特に輝けるでしょう';
    } else if (matchScore >= 40) {
      return 'この組み合わせでは状況に応じた適応力を発揮できます。多様な人間関係において柔軟性を示せる反面、時には本音をもう少し表現すると更に力を発揮できます';
    } else {
      return 'この組み合わせでは力を発揮しにくい可能性があります。他のインターフェースOSを意識的に活用するか、段階的に本音を表現することで改善できるでしょう';
    }
  }

  async loadEngineInterfaceCompatibilityData(engineId, interfaceId) {
    try {
      const fileName = `hexagram_${String(engineId).padStart(2, '0')}.json`;
      const url = `/js/data/compatibility/engine-interface/${fileName}`;
      console.log(`🔍 [データ読み込み] 試行中: ${url}`);
      
      const response = await fetch(url);
      console.log(`📄 [レスポンス] ステータス: ${response.status}, OK: ${response.ok}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ [データ取得成功] エンジンOS ${engineId}, データ件数: ${data?.interface_combinations?.length || 0}`);
        return data;
      } else {
        console.error(`❌ [HTTPエラー] ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("❌ [互換性データ読み込みエラー]:", error);
      console.error("❌ [エラー詳細]:", {
        engineId,
        interfaceId,
        expectedUrl: `/js/data/compatibility/engine-interface/hexagram_${String(engineId).padStart(2, '0')}.json`
      });
    }
    return null;
  }

  getCombinationTypeColor(type) {
    const typeColors = {
      'SYNERGY': 'synergy-type',
      'COMPLEMENTARY': 'complementary-type',
      'TENSION': 'tension-type',
      'CONFLICT': 'conflict-type',
      'CHAOS': 'chaos-type'
    };
    return typeColors[type] || 'default-type';
  }

  getCombinationTypeIcon(type) {
    const typeIcons = {
      'SYNERGY': '✨',
      'COMPLEMENTARY': '🤝',
      'TENSION': '⚡',
      'CONFLICT': '🔥',
      'CHAOS': '🌪️'
    };
    return typeIcons[type] || '🔄';
  }

  async loadEngineSafeModeCompatibilityData(engineId, safemodeId) {
    try {
      const fileName = `hexagram_${String(engineId).padStart(2, '0')}.json`;
      const url = `/js/data/compatibility/engine-safemode/${fileName}`;
      console.log(`🔍 [セーフモードデータ読み込み] 試行中: ${url}`);
      
      const response = await fetch(url);
      console.log(`📄 [セーフモードレスポンス] ステータス: ${response.status}, OK: ${response.ok}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ [セーフモードデータ取得成功] エンジンOS ${engineId}, データ件数: ${data?.safemode_combinations?.length || 0}`);
        return data;
      } else {
        console.error(`❌ [セーフモードHTTPエラー] ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("❌ [セーフモード互換性データ読み込みエラー]:", error);
      console.error("❌ [セーフモードエラー詳細]:", {
        engineId,
        safemodeId,
        expectedUrl: `/js/data/compatibility/engine-safemode/hexagram_${String(engineId).padStart(2, '0')}.json`
      });
    }
    return null;
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
    const { engineOS } = await this.extractTripleOSData(this.analysisResult);

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

    // 全体的な正規化：最大値を10にスケール
    const maxValue = Math.max(...data);
    const normalizedData = data.map(value => {
      if (maxValue > 10) {
        return (value / maxValue) * 10;
      }
      return value;
    });
    const labels = dimensions.map((dim) => dim.label);

    console.log("🔍 [レーダーチャート] 元データ:", data);
    console.log("🔍 [レーダーチャート] 正規化データ:", normalizedData);
    console.log("🔍 [レーダーチャート] ラベル:", labels);
    console.log("🔍 [レーダーチャート] データとラベルの対応:");
    dimensions.forEach((dim, index) => {
      console.log(`  ${index}: ${dim.label} = ${data[index]} → ${normalizedData[index]} (key: ${dim.key})`);
    });

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
            data: normalizedData,
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
        maintainAspectRatio: true,
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
                const originalValue = data[context[0].dataIndex];
                const normalizedValue = normalizedData[context[0].dataIndex];
                return `${dimension.label} (${normalizedValue.toFixed(1)}/10)`;
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

  // 8次元の詳細情報を取得 - レーダーチャートの視覚的位置に対応
  getEightDimensionsWithDetails() {
    // レーダーチャートは12時位置から時計回りに描画されるため、それに合わせた順序
    return [
      {
        key: "乾_創造性",
        label: "創造性（天）",
        color: "#ff6b6b",
        iching_meaning: "乾為天 - 天の力、リーダーシップ、創造的エネルギー",
        practical_application:
          "新しいアイデアの創出、イノベーション、指導力において発揮される",
      },
      {
        key: "兌_調和性",
        label: "調和性（沢）",
        color: "#45b7d1",
        iching_meaning: "兌為沢 - 喜び、コミュニケーション、人との調和",
        practical_application:
          "チームワーク、対話、人間関係の構築において発揮される",
      },
      {
        key: "離_表現性",
        label: "表現性（火）",
        color: "#ffa500",
        iching_meaning: "離為火 - 明るさ、知性、表現力",
        practical_application:
          "プレゼンテーション、教育、芸術的表現において発揮される",
      },
      {
        key: "震_行動性",
        label: "行動性（雷）",
        color: "#4ecdc4",
        iching_meaning: "震為雷 - 雷の力、動き、積極的な行動",
        practical_application:
          "実行力、スピード、変化への対応において発揮される",
      },
      {
        key: "巽_適応性",
        label: "適応性（風）",
        color: "#98d8c8",
        iching_meaning: "巽為風 - 風の力、柔軟性、適応力",
        practical_application:
          "状況対応、柔軟な思考、環境適応において発揮される",
      },
      {
        key: "坎_探求性",
        label: "探求性（水）",
        color: "#6c5ce7",
        iching_meaning: "坎為水 - 水の力、深さ、探求心",
        practical_application:
          "研究、分析、本質を見抜く力において発揮される",
      },
      {
        key: "艮_安定性",
        label: "安定性（山）",
        color: "#a29bfe",
        iching_meaning: "艮為山 - 山の力、堅実性、安定感",
        practical_application:
          "忍耐力、集中力、長期的視点において発揮される",
      },
      {
        key: "坤_受容性",
        label: "受容性（地）",
        color: "#dfe6e9",
        iching_meaning: "坤為地 - 地の力、包容性、受け入れる力",
        practical_application:
          "サポート力、育成、多様性の受容において発揮される",
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
    // 卦IDに基づいて特徴的な値を生成（全64卦対応）
    const baseValue = 5 + (hexagramId % 6); // 5-10の範囲
    
    // 8つの次元に対するハッシュベースの値生成
    const dimensionHash = {
      "乾_創造性": 0,
      "兌_調和性": 1, 
      "離_表現性": 2,
      "震_行動性": 3,
      "巽_適応性": 4,
      "坎_探求性": 5,
      "艮_安定性": 6,
      "坤_受容性": 7
    };
    
    const dimIndex = dimensionHash[dimensionKey] || 0;
    
    // 各卦と各次元の組み合わせで一意な値を生成
    const seed = (hexagramId * 8 + dimIndex) % 64;
    const variance = (seed % 10) - 5; // -5から+4の範囲
    const finalValue = Math.max(1, Math.min(baseValue + variance, 25));
    
    console.log(
      `🔧 [フォールバック] 卦${hexagramId} ${dimensionKey}: ${finalValue} (seed: ${seed})`
    );
    return finalValue;
  }

  // 共通エラーハンドリング: データ品質チェック
  validateHexagramData(hexagramData, hexagramId) {
    const validation = {
      isValid: false,
      hasBasicInfo: false,
      hasScores: false,
      hasKeywords: false,
      fallbackLevel: 'full'
    };

    if (!hexagramData) {
      console.warn(`⚠️ hexagramData for ID ${hexagramId} is null or undefined`);
      validation.fallbackLevel = 'full';
      return validation;
    }

    // 基本情報チェック
    if (hexagramData.name_jp || hexagramData.description) {
      validation.hasBasicInfo = true;
    }

    // スコアデータチェック
    const scoreFields = ['innovation_score', 'resilience_score', 'cooperation_score', 'independence_score'];
    if (scoreFields.some(field => typeof hexagramData[field] === 'number')) {
      validation.hasScores = true;
    }

    // キーワードチェック
    if (hexagramData.keywords && hexagramData.keywords.trim()) {
      validation.hasKeywords = true;
    }

    // 総合判定
    if (validation.hasBasicInfo && validation.hasScores && validation.hasKeywords) {
      validation.isValid = true;
      validation.fallbackLevel = 'minimal';
    } else if (validation.hasBasicInfo || validation.hasKeywords) {
      validation.isValid = true;
      validation.fallbackLevel = 'partial';
    } else {
      validation.fallbackLevel = 'full';
    }

    console.log(`🔍 [データ品質チェック] hexagramId: ${hexagramId}`, validation);
    return validation;
  }

  // 共通エラーハンドリング: 安全な文字列生成
  safeStringGenerate(generator, fallback, context = '') {
    try {
      const result = generator();
      if (Array.isArray(result) && result.length === 0) {
        console.warn(`⚠️ Empty array generated for ${context}, using fallback`);
        return fallback;
      }
      if (typeof result === 'string' && result.trim() === '') {
        console.warn(`⚠️ Empty string generated for ${context}, using fallback`);
        return fallback;
      }
      return result;
    } catch (error) {
      console.error(`❌ Error in ${context} generation:`, error);
      return fallback;
    }
  }

  // 共通エラーハンドリング: DOM要素の安全な更新
  safeUpdateElement(elementId, htmlContent, fallbackMessage = '') {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`⚠️ Element with ID '${elementId}' not found`);
        return false;
      }
      
      if (!htmlContent || htmlContent.trim() === '') {
        console.warn(`⚠️ Empty content for element '${elementId}', using fallback`);
        element.innerHTML = fallbackMessage || `<div class="error-note"><small>❌ データの読み込みに失敗しました</small></div>`;
        return false;
      }

      element.innerHTML = htmlContent;
      return true;
    } catch (error) {
      console.error(`❌ Error updating element '${elementId}':`, error);
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `<div class="error-note"><small>❌ 表示エラーが発生しました</small></div>`;
      }
      return false;
    }
  }

  // ヘルパー: hexagramデータから動的な強みを生成
  generateDynamicStrengths(hexagramData, hexagramId) {
    if (!hexagramData) {
      return [
        "戦略的な思考力",
        "独自の価値観による判断力",
        "深い洞察力"
      ];
    }

    const strengths = [];
    const keywords = hexagramData.keywords ? hexagramData.keywords.split(',') : [];
    
    // キーワードから強みを生成
    keywords.forEach(keyword => {
      switch(keyword.trim()) {
        case '創造':
        case 'リーダーシップ':
          strengths.push(`${hexagramData.name_jp}特有の創造的リーダーシップ`);
          break;
        case '受容':
        case 'サポート':
          strengths.push(`深い包容力と人を育てる才能`);
          break;
        case '力':
          strengths.push(`困難を打破する強靭な精神力`);
          break;
        case '探求':
        case '洞察':
          strengths.push(`物事の本質を見抜く洞察力`);
          break;
        default:
          strengths.push(`${keyword}を活かした独自の強み`);
      }
    });

    // 各卦の特性スコアから強みを追加
    if (hexagramData.innovation_score > 7) {
      strengths.push("革新的なアイデアを生み出す力");
    }
    if (hexagramData.resilience_score > 7) {
      strengths.push("逆境を乗り越える回復力");
    }
    if (hexagramData.independence_score > 7) {
      strengths.push("自立した判断力と行動力");
    }

    return strengths.slice(0, 3); // 最大3つ
  }

  // ヘルパー: hexagramデータから動的な課題を生成
  generateDynamicChallenges(hexagramData, hexagramId) {
    if (!hexagramData) {
      return [
        "価値観の違いへの対処",
        "理想と現実のバランス調整"
      ];
    }

    const challenges = [];
    
    // 各卦の特性スコアから課題を推定
    if (hexagramData.independence_score > 8) {
      challenges.push("独立性が強すぎて孤立しやすい傾向");
    }
    if (hexagramData.innovation_score > 8) {
      challenges.push("革新的すぎて周囲とのペースが合わないリスク");
    }
    if (hexagramData.support_seeking_score < 4) {
      challenges.push("人に頼ることの難しさ");
    }
    if (hexagramData.adaptability_score < 6) {
      challenges.push("変化への適応に時間がかかる傾向");
    }

    // 基本的な課題も追加
    challenges.push("自分の強みを過信するリスク");

    return challenges.slice(0, 2); // 最大2つ
  }

  // ヘルパー: hexagramデータから動的なコアドライブを生成
  generateDynamicCoreDrive(hexagramData, hexagramId) {
    if (!hexagramData) {
      return `第${hexagramId}卦の深い智慧を持つあなたは、独自の価値観で世界を捉える特別な存在です。`;
    }

    // descriptionまたはcatchphraseを活用
    let coreDrive = hexagramData.description || hexagramData.catchphrase || '';
    
    if (!coreDrive) {
      const keywords = hexagramData.keywords ? hexagramData.keywords.split(',') : [];
      if (keywords.length > 0) {
        coreDrive = `${hexagramData.name_jp}として、${keywords.join('、')}を核とした独自の価値観で人生を切り開いていく存在です。`;
      } else {
        coreDrive = `${hexagramData.name_jp}の特性を持つあなたは、この卦が持つ深い智慧を現代に活かす貴重な存在です。`;
      }
    }

    return coreDrive;
  }

  // 未実装データの明示的メッセージ表示
  showNotImplementedMessage(osType, hexagramId) {
    const osTypeName = {
      'engine': 'エンジンOS',
      'interface': 'インターフェースOS', 
      'safemode': 'セーフモードOS'
    }[osType] || osType;

    const strengthsElementId = `${osType}-strengths-list`;
    const challengesElementId = `${osType}-challenges-list`;
    const coreDriveElementId = `${osType}-core-drive`;

    const notImplementedHTML = `
      <div class="not-implemented-content">
          <div class="not-implemented-item">
              <span class="not-implemented-icon">🚧</span>
              <span class="not-implemented-text">まだ実装していません</span>
          </div>
          <div class="not-implemented-note">
              <small>💻 ${osTypeName}（hexagram ${hexagramId}）の詳細データは今後実装予定です</small>
          </div>
      </div>
    `;

    this.safeUpdateElement(strengthsElementId, notImplementedHTML);
    this.safeUpdateElement(challengesElementId, notImplementedHTML);
    this.safeUpdateElement(coreDriveElementId, notImplementedHTML);

    console.log(`📝 [未実装表示] ${osTypeName} hexagram ${hexagramId} - 今後実装予定`);
  }

  // エンジンOS詳細のフォールバック処理（動的コンテンツ生成版・エラーハンドリング強化）
  // 注意: このフォールバック処理は誤解を招くため使用停止 - showNotImplementedMessage を使用
  loadEngineOSDetailsWithFallback(hexagramId) {
    console.log(
      `🔧 [Engine OS フォールバック] hexagramId ${hexagramId} のフォールバックデータを動的生成中`
    );

    try {
      // hexagrams_masterからデータを取得
      const hexagramData =
        window.hexagrams_master &&
        window.hexagrams_master.find((h) => h.hexagram_id === hexagramId);

      // データ品質チェック
      const validation = this.validateHexagramData(hexagramData, hexagramId);

      // 動的コンテンツを安全に生成
      const dynamicStrengths = this.safeStringGenerate(
        () => this.generateDynamicStrengths(hexagramData, hexagramId),
        ["戦略的な思考力", "独自の価値観による判断力", "深い洞察力"],
        'Engine OS Strengths'
      );

      const dynamicChallenges = this.safeStringGenerate(
        () => this.generateDynamicChallenges(hexagramData, hexagramId),
        ["価値観の違いへの対処", "理想と現実のバランス調整"],
        'Engine OS Challenges'
      );

      const dynamicCoreDrive = this.safeStringGenerate(
        () => this.generateDynamicCoreDrive(hexagramData, hexagramId),
        `第${hexagramId}卦の深い智慧を持つあなたは、独自の価値観で世界を捉える特別な存在です。`,
        'Engine OS Core Drive'
      );

      // 品質レベルに応じたメッセージ調整
      const qualityMessage = this.getQualityMessage(validation, hexagramData, hexagramId);

      // 安全にDOM要素を更新
      const strengthsHTML = `
        <div class="strengths-content">
            ${dynamicStrengths.map(strength => `
                <div class="strength-item">
                    <span class="strength-icon">⭐</span>
                    <span class="strength-text">${strength}</span>
                </div>
            `).join('')}
            <div class="not-implemented-note">
                <small>🚧 まだ実装していません - 今後実装予定です</small>
            </div>
        </div>
      `;

      const challengesHTML = `
        <div class="challenges-content">
            ${dynamicChallenges.map(challenge => `
                <div class="challenge-item">
                    <span class="challenge-icon">⚠️</span>
                    <span class="challenge-text">${challenge}</span>
                </div>
            `).join('')}
            <div class="not-implemented-note">
                <small>🚧 まだ実装していません - 今後実装予定です</small>
            </div>
        </div>
      `;

      const coreDriveHTML = `
        <div class="core-drive-content">
            <p class="summary-text">${dynamicCoreDrive}</p>
            <div class="not-implemented-note">
                <small>🚧 まだ実装していません - 今後実装予定です</small>
            </div>
        </div>
      `;

      // DOM更新の実行
      this.safeUpdateElement("engine-strengths-list", strengthsHTML);
      this.safeUpdateElement("engine-challenges-list", challengesHTML);
      this.safeUpdateElement("engine-core-drive", coreDriveHTML);

      console.log(`✅ [Engine OS フォールバック完了] hexagramId: ${hexagramId}, Quality: ${validation.fallbackLevel}`);

    } catch (error) {
      console.error(`❌ [Engine OS フォールバック失敗] hexagramId: ${hexagramId}`, error);
      
      // 最終フォールバック（緊急時）
      const emergencyHTML = `
        <div class="error-content">
            <div class="error-item">
                <span class="error-icon">⚠️</span>
                <span class="error-text">データの読み込みに失敗しました</span>
            </div>
            <div class="not-implemented-note">
                <small>🚧 まだ実装していません - 今後実装予定です</small>
            </div>
        </div>
      `;
      
      this.safeUpdateElement("engine-strengths-list", emergencyHTML);
      this.safeUpdateElement("engine-challenges-list", emergencyHTML);
      this.safeUpdateElement("engine-core-drive", emergencyHTML);
    }
  }

  // 品質レベルに応じたメッセージ生成
  getQualityMessage(validation, hexagramData, hexagramId) {
    const hexagramName = hexagramData?.name_jp || `第${hexagramId}卦`;
    
    switch(validation.fallbackLevel) {
      case 'minimal':
        return {
          strengths: `💫 ${hexagramName}の詳細な特性分析に基づく結果です`,
          challenges: `💫 ${hexagramName}の特性から推定された注意点です`,
          coreDrive: `💫 ${hexagramName}の本質的特性を現代的に解釈した内容です`
        };
      case 'partial':
        return {
          strengths: `💫 ${hexagramName}の基本特性に基づく分析結果です`,
          challenges: `💫 ${hexagramName}の一般的な傾向から推定した注意点です`,
          coreDrive: `💫 ${hexagramName}の基本的な解釈を現代的に表現しました`
        };
      case 'full':
      default:
        return {
          strengths: `💫 多面的な人格の一般的な特性を表示しています`,
          challenges: `💫 一般的な人間の傾向を表示しています`,
          coreDrive: `💫 多面的自己理解の基本的な考え方を表示しています`
        };
    }
  }

  // Interface OS用の動的フォールバック処理
  loadInterfaceOSDetailsWithFallback(hexagramId) {
    console.log(
      `🔧 [Interface OS フォールバック] hexagramId ${hexagramId} のフォールバックデータを動的生成中`
    );

    // hexagrams_masterからデータを取得
    const hexagramData =
      window.hexagrams_master &&
      window.hexagrams_master.find((h) => h.hexagram_id === hexagramId);

    // Interface OS特有の動的コンテンツを生成
    const dynamicStrengths = this.generateInterfaceStrengths(hexagramData, hexagramId);
    const dynamicChallenges = this.generateInterfaceChallenges(hexagramData, hexagramId);
    const dynamicCoreDrive = this.generateInterfaceCoreDrive(hexagramData, hexagramId);

    const strengthsList = document.getElementById("interface-strengths-list");
    if (strengthsList) {
      strengthsList.innerHTML = `
                  <div class="strengths-content">
                      ${dynamicStrengths.map(strength => `
                          <div class="strength-item">
                              <span class="strength-icon">🤝</span>
                              <span class="strength-text">${strength}</span>
                          </div>
                      `).join('')}
                      <div class="not-implemented-note">
                          <small>🚧 インターフェースOS詳細データは今後実装予定です</small>
                      </div>
                  </div>
              `;
    }

    const challengesList = document.getElementById("interface-challenges-list");
    if (challengesList) {
      challengesList.innerHTML = `
                  <div class="challenges-content">
                      ${dynamicChallenges.map(challenge => `
                          <div class="challenge-item">
                              <span class="challenge-icon">⚠️</span>
                              <span class="challenge-text">${challenge}</span>
                          </div>
                      `).join('')}
                      <div class="not-implemented-note">
                          <small>🚧 インターフェースOS詳細データは今後実装予定です</small>
                      </div>
                  </div>
              `;
    }

    const coreDrive = document.getElementById("interface-core-drive");
    if (coreDrive) {
      coreDrive.innerHTML = `
                  <div class="core-drive-content">
                      <p class="summary-text">${dynamicCoreDrive}</p>
                      <div class="not-implemented-note">
                          <small>🚧 インターフェースOS詳細データは今後実装予定です</small>
                      </div>
                  </div>
              `;
    }
  }

  // Interface OS用の強み生成
  generateInterfaceStrengths(hexagramData, hexagramId) {
    if (!hexagramData) {
      return [
        "他者との調和的な関係構築",
        "状況に応じたコミュニケーション",
        "協調性を活かしたチームワーク"
      ];
    }

    const strengths = [];
    const keywords = hexagramData.keywords ? hexagramData.keywords.split(',') : [];
    
    // キーワードから対人関係の強みを生成
    keywords.forEach(keyword => {
      switch(keyword.trim()) {
        case 'リーダーシップ':
          strengths.push("自然な指導力で人々を導く能力");
          break;
        case '受容':
        case 'サポート':
          strengths.push("相手を受け入れ支える包容力");
          break;
        case '調和':
          strengths.push("場の雰囲気を和やかにする調整力");
          break;
        case '協力':
          strengths.push("チームワークを重視した協働スタイル");
          break;
        default:
          strengths.push(`${keyword}を活かした独自の対人スキル`);
      }
    });

    // 各卦の特性スコアから対人強みを追加
    if (hexagramData.cooperation_score > 7) {
      strengths.push("高い協調性と柔軟なコミュニケーション");
    }
    if (hexagramData.protection_score > 7) {
      strengths.push("他者を守る責任感の強さ");
    }

    return strengths.slice(0, 3);
  }

  // Interface OS用の課題生成
  generateInterfaceChallenges(hexagramData, hexagramId) {
    if (!hexagramData) {
      return [
        "自分の意見を表現することの難しさ",
        "他者に合わせすぎる傾向"
      ];
    }

    const challenges = [];
    
    if (hexagramData.cooperation_score > 8) {
      challenges.push("協調性を重視しすぎて自分を抑え込むリスク");
    }
    if (hexagramData.independence_score < 5) {
      challenges.push("他者への依存度が高くなる傾向");
    }
    if (hexagramData.support_seeking_score > 7) {
      challenges.push("支援を求めすぎて負担に感じられるリスク");
    }

    // 基本的な対人課題も追加
    challenges.push("相手に合わせすぎて本音を隠しがち");

    return challenges.slice(0, 2);
  }

  // Interface OS用のコアドライブ生成
  generateInterfaceCoreDrive(hexagramData, hexagramId) {
    if (!hexagramData) {
      return `第${hexagramId}卦の対人関係パターンを持つあなたは、他者との調和を重視した独特なコミュニケーションスタイルを築いています。`;
    }

    const cooperation = hexagramData.cooperation_score || 5;
    const independence = hexagramData.independence_score || 5;
    
    let style = "";
    if (cooperation > 7 && independence > 7) {
      style = "自立性と協調性のバランスが取れた理想的な";
    } else if (cooperation > 7) {
      style = "他者との調和を最優先とする協調的な";
    } else if (independence > 7) {
      style = "自分らしさを大切にする独立的な";
    } else {
      style = "独自のペースを大切にする";
    }

    return `${hexagramData.name_jp}として、${style}コミュニケーションスタイルで人間関係を築いていきます。この特性は現代社会における貴重な資質です。`;
  }

  // Safe Mode OS用の動的フォールバック処理
  loadSafeModeOSDetailsWithFallback(hexagramId) {
    console.log(
      `🔧 [Safe Mode OS フォールバック] hexagramId ${hexagramId} のフォールバックデータを動的生成中`
    );

    // hexagrams_masterからデータを取得
    const hexagramData =
      window.hexagrams_master &&
      window.hexagrams_master.find((h) => h.hexagram_id === hexagramId);

    // Safe Mode OS特有の動的コンテンツを生成
    const dynamicStrengths = this.generateSafeModeStrengths(hexagramData, hexagramId);
    const dynamicChallenges = this.generateSafeModeChallenges(hexagramData, hexagramId);
    const dynamicCoreDrive = this.generateSafeModeCoreDrive(hexagramData, hexagramId);

    const strengthsList = document.getElementById("safemode-strengths-list");
    if (strengthsList) {
      strengthsList.innerHTML = `
                  <div class="strengths-content">
                      ${dynamicStrengths.map(strength => `
                          <div class="strength-item">
                              <span class="strength-icon">🛡️</span>
                              <span class="strength-text">${strength}</span>
                          </div>
                      `).join('')}
                      <div class="not-implemented-note">
                          <small>🚧 セーフモードOS詳細データは今後実装予定です</small>
                      </div>
                  </div>
              `;
    }

    const challengesList = document.getElementById("safemode-challenges-list");
    if (challengesList) {
      challengesList.innerHTML = `
                  <div class="challenges-content">
                      ${dynamicChallenges.map(challenge => `
                          <div class="challenge-item">
                              <span class="challenge-icon">⚠️</span>
                              <span class="challenge-text">${challenge}</span>
                          </div>
                      `).join('')}
                      <div class="not-implemented-note">
                          <small>🚧 セーフモードOS詳細データは今後実装予定です</small>
                      </div>
                  </div>
              `;
    }

    const coreDrive = document.getElementById("safemode-core-drive");
    if (coreDrive) {
      coreDrive.innerHTML = `
                  <div class="core-drive-content">
                      <p class="summary-text">${dynamicCoreDrive}</p>
                      <div class="not-implemented-note">
                          <small>🚧 セーフモードOS詳細データは今後実装予定です</small>
                      </div>
                  </div>
              `;
    }
  }

  // Safe Mode OS用の強み生成
  generateSafeModeStrengths(hexagramData, hexagramId) {
    if (!hexagramData) {
      return [
        "危険を察知する鋭い直感力",
        "困難な状況での冷静な判断",
        "自己防衛の知恵"
      ];
    }

    const strengths = [];
    const keywords = hexagramData.keywords ? hexagramData.keywords.split(',') : [];
    
    // キーワードから防御的強みを生成
    keywords.forEach(keyword => {
      switch(keyword.trim()) {
        case '安定':
        case '慎重':
          strengths.push("慎重さによるリスク回避能力");
          break;
        case '探求':
        case '洞察':
          strengths.push("潜在的な問題を見抜く洞察力");
          break;
        case '受容':
          strengths.push("困難を受け入れ乗り越える柔軟性");
          break;
        default:
          strengths.push(`${keyword}を活かした自己保護能力`);
      }
    });

    // 各卦の特性スコアから防御的強みを追加
    if (hexagramData.resilience_score > 7) {
      strengths.push("困難から立ち直る強い回復力");
    }
    if (hexagramData.protection_score > 7) {
      strengths.push("自他を守る強い防御本能");
    }
    if (hexagramData.introspection_score > 6) {
      strengths.push("内省による自己理解の深さ");
    }

    return strengths.slice(0, 3);
  }

  // Safe Mode OS用の課題生成
  generateSafeModeChallenges(hexagramData, hexagramId) {
    if (!hexagramData) {
      return [
        "過度な警戒心による機会損失",
        "変化への抵抗が強すぎる傾向"
      ];
    }

    const challenges = [];
    
    if (hexagramData.adaptability_score < 5) {
      challenges.push("変化に対する過度な抵抗");
    }
    if (hexagramData.support_seeking_score < 3) {
      challenges.push("助けを求めることへの強い抵抗");
    }
    if (hexagramData.introspection_score > 8) {
      challenges.push("内向きになりすぎて孤立するリスク");
    }

    // 基本的な防御的課題も追加
    challenges.push("警戒心が強すぎて新しいチャンスを逃しがち");

    return challenges.slice(0, 2);
  }

  // Safe Mode OS用のコアドライブ生成
  generateSafeModeCoreDrive(hexagramData, hexagramId) {
    if (!hexagramData) {
      return `第${hexagramId}卦の防御パターンを持つあなたは、慎重さと自己防衛の知恵で困難な状況を乗り越えていく力を持っています。`;
    }

    const resilience = hexagramData.resilience_score || 5;
    const protection = hexagramData.protection_score || 5;
    
    let defensiveStyle = "";
    if (resilience > 7 && protection > 7) {
      defensiveStyle = "強い回復力と防御力を兼ね備えた";
    } else if (resilience > 7) {
      defensiveStyle = "困難から立ち直る力に長けた";
    } else if (protection > 7) {
      defensiveStyle = "自他を守る強い意志を持った";
    } else {
      defensiveStyle = "独自のペースで自分を守る";
    }

    return `${hexagramData.name_jp}として、${defensiveStyle}セーフモードで人生の困難に対処していきます。この防御的知恵は現代の不確実な世界を生きる上で非常に価値のある資質です。`;
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

    const { engineOS, interfaceOS, safeModeOS } = await this.extractTripleOSData(this.analysisResult);

    // エンジンOSの詳細データを読み込み
    await this.loadEngineOSDetails(engineOS);

    // インターフェースOSの組み合わせ分析を読み込み
    await this.loadInterfaceCompatibility(engineOS, interfaceOS);

    // セーフモードOSの組み合わせ分析を読み込み
    await this.loadSafeModeCompatibility(engineOS, safeModeOS);

    console.log("✅ [TripleOSResultsView] OSカード詳細データ読み込み完了");
  }

  // 戦略的活用シーンを生成する
  generateTacticalScenarios(hexagramId, osManualData) {
    const scenarioPatterns = {
      // 乾系 (リーダーシップ中心)
      "1": [
        { context: "新しいプロジェクトを率いる時", action: "明確なビジョンを示して積極的にリードする" },
        { context: "意思決定が必要な場面", action: "責任を持って迅速に判断を下す" },
        { context: "チームが迷っている時", action: "方向性を示して士気を高める" }
      ],
      "43": [
        { context: "重要な発表の場", action: "確信を持って決断を伝える" },
        { context: "変革が求められる時", action: "古い慣習を断ち切り新しい道を示す" },
        { context: "対立が生じた時", action: "明確な立場で調整を図る" }
      ],
      // 震系 (行動力中心)
      "51": [
        { context: "変化が必要な状況", action: "率先して行動を起こし変革をリードする" },
        { context: "停滞している時", action: "新しいアプローチで活気を呼び起こす" },
        { context: "緊急事態の時", action: "迅速な対応で事態を打開する" }
      ],
      "25": [
        { context: "自然体で取り組む時", action: "無理をせず持ち前の直感を信じる" },
        { context: "創造性が求められる時", action: "型にはまらないアイデアを提案する" },
        { context: "純粋な動機で進む時", action: "邪念を捨てて本質的な価値を追求する" }
      ],
      // 坎系 (深さ・洞察中心)
      "29": [
        { context: "複雑な問題に直面した時", action: "本質を見抜いて根本的な解決策を提示する" },
        { context: "情報が不足している時", action: "直感と経験で的確な判断を行う" },
        { context: "困難な状況の時", action: "冷静さを保ち粘り強く取り組む" }
      ],
      "60": [
        { context: "制約の中で工夫する時", action: "限られた条件下で最適解を見つける" },
        { context: "規則やルールがある時", action: "枠組みを活かして効率的に進める" },
        { context: "計画的に進める時", action: "段階的なアプローチで確実に成果を上げる" }
      ],
      // 艮系 (堅実性中心)
      "52": [
        { context: "じっくり考える必要がある時", action: "立ち止まって状況を冷静に分析する" },
        { context: "基盤を固める時", action: "確実な土台作りに集中する" },
        { context: "継続が重要な時", action: "着実な積み重ねを大切にする" }
      ],
      "18": [
        { context: "問題を修正する時", action: "根本原因を特定して丁寧に改善する" },
        { context: "質を高める時", action: "細部にこだわり完成度を追求する" },
        { context: "伝統を活かす時", action: "既存の良さを継承しつつ発展させる" }
      ],
      // 坤系 (包容性中心)
      "2": [
        { context: "チームをサポートする時", action: "メンバーの強みを活かす環境を整える" },
        { context: "受け入れが必要な時", action: "相手の立場を理解して柔軟に対応する" },
        { context: "育成に取り組む時", action: "忍耐強く成長を見守り支援する" }
      ],
      "19": [
        { context: "新たな発展の機会", action: "積極的に前進して成長の波に乗る" },
        { context: "関係性を深める時", action: "相手に歩み寄り信頼関係を築く" },
        { context: "影響力を拡げる時", action: "包容力で周囲を巻き込む" }
      ]
    };

    // hexagramIdに対応するパターンを取得、なければ汎用パターンを生成
    if (scenarioPatterns[hexagramId]) {
      return scenarioPatterns[hexagramId];
    }

    // 汎用的な戦略シーンを生成
    return [
      { context: "新しい挑戦に取り組む時", action: "自分の強みを活かしたアプローチを選択する" },
      { context: "困難な状況に遭遇した時", action: "持ち前の特性を信じて乗り越える" },
      { context: "重要な決断を迫られた時", action: "本来の価値観に従って判断する" }
    ];
  }

  // 改善のための戦術を生成する
  generateImprovementTactics(hexagramId, osManualData) {
    const tacticPatterns = {
      "1": [
        { situation: "独断的になりがちな時", method: "他者の意見を積極的に聞く習慣をつける" },
        { situation: "プレッシャーを感じる時", method: "完璧主義を手放し段階的な改善を心がける" },
        { situation: "孤立感を感じる時", method: "サポートチームとの連携を強化する" }
      ],
      "43": [
        { situation: "性急になりがちな時", method: "タイミングを見極めてから決断する" },
        { situation: "対立を恐れる時", method: "建設的な議論として前向きに捉える" },
        { situation: "頑固になりすぎる時", method: "柔軟性も大切にしてバランスを取る" }
      ],
      "51": [
        { situation: "衝動的になりがちな時", method: "一呼吸置いて状況を整理してから行動する" },
        { situation: "継続が困難な時", method: "小さな目標を設定して達成感を積み重ねる" },
        { situation: "エネルギーが分散する時", method: "優先順位を明確にして集中力を保つ" }
      ],
      "25": [
        { situation: "計算的になりすぎる時", method: "時には直感を信じて自然体で進む" },
        { situation: "他人の期待に縛られる時", method: "本来の価値観に立ち戻る" },
        { situation: "複雑に考えすぎる時", method: "シンプルな解決策を探す" }
      ],
      "29": [
        { situation: "考えすぎて行動できない時", method: "期限を設けて「まず始める」ことを重視する" },
        { situation: "悲観的になりがちな時", method: "小さな成功体験を意識的に見つける" },
        { situation: "完璧を求めすぎる時", method: "80%の完成度で進める勇気を持つ" }
      ],
      "60": [
        { situation: "制約に不満を感じる時", method: "制限を創造性の源と捉え直す" },
        { situation: "自由度が欲しい時", method: "枠組みの中での最適解を探る" },
        { situation: "息苦しさを感じる時", method: "適度な休息とリフレッシュを心がける" }
      ],
      "52": [
        { situation: "動きが遅くなる時", method: "適切なタイミングを見極めて行動に移す" },
        { situation: "頑固になりすぎる時", method: "新しい視点を取り入れる柔軟性を持つ" },
        { situation: "変化を拒む時", method: "安定の中にも成長要素を見つける" }
      ],
      "18": [
        { situation: "細かすぎて進まない時", method: "重要度の高い部分に焦点を絞る" },
        { situation: "批判的になりすぎる時", method: "建設的な改善提案を心がける" },
        { situation: "過去にとらわれる時", method: "良い部分を活かして前進する" }
      ],
      "2": [
        { situation: "自己主張が足りない時", method: "適切な場面では意見を明確に伝える" },
        { situation: "依存的になりがちな時", method: "自立性と協調性のバランスを取る" },
        { situation: "遠慮しすぎる時", method: "価値ある貢献として積極性を発揮する" }
      ],
      "19": [
        { situation: "エネルギーが続かない時", method: "持続可能なペースで進める" },
        { situation: "期待に応えすぎる時", method: "自分の限界を適切に設定する" },
        { situation: "散漫になりがちな時", method: "重要な目標に集中力を向ける" }
      ]
    };

    if (tacticPatterns[hexagramId]) {
      return tacticPatterns[hexagramId];
    }

    return [
      { situation: "バランスを崩しがちな時", method: "自分の特性を客観視して調整する" },
      { situation: "ストレスを感じる時", method: "本来の強みに立ち戻って自信を回復する" },
      { situation: "迷いが生じる時", method: "重要な価値観を思い出して方向性を確認する" }
    ];
  }

  // Triple OS哲学に基づく一致度解釈
  getComplexityInsight(percentage) {
    if (percentage >= 80) {
      return {
        level: "特定傾向が強い",
        insight: "このパターンが比較的明確に表れています",
        tripleOSView: "このOS側面が活性化しやすい状態です"
      };
    }
    if (percentage >= 60) {
      return {
        level: "適度な傾向",
        insight: "このパターンが部分的に表れています",
        tripleOSView: "このOS側面が時々顔を出す状態です"
      };
    }
    if (percentage >= 40) {
      return {
        level: "潜在的可能性",
        insight: "このパターンが潜在的に存在しています",
        tripleOSView: "このOS側面は環境次第で表出する可能性があります"
      };
    }
    return {
      level: "複雑な多面性",
      insight: "あなたの豊かな複雑性を示しています",
      tripleOSView: "多様なOS側面が混在する豊かな状態です"
    };
  }

  // 従来の一致度レベル（下位互換のため保持）
  getAccuracyLevel(percentage) {
    if (percentage >= 90) return "極めて高い";
    if (percentage >= 80) return "高い";
    if (percentage >= 70) return "やや高い";
    if (percentage >= 60) return "中程度";
    if (percentage >= 50) return "やや低い";
    return "低い";
  }

  // 戦略的価値観を生成する
  generateStrategicValues(hexagramId, osManualData) {
    const valuePatterns = {
      "1": [
        { principle: "率先垂範", application: "自ら模範を示すことで周囲を動かす" },
        { principle: "明確な方向性", application: "曖昧さを排除して具体的な目標を設定する" },
        { principle: "責任の重視", application: "決断に責任を持ち最後まで貫く" }
      ],
      "43": [
        { principle: "果断な決断", application: "迷いを断ち切り明確な選択をする" },
        { principle: "変革の推進", application: "古い慣習を見直し新しい価値を創造する" },
        { principle: "透明性の重視", application: "隠し事をせず正直に意図を伝える" }
      ],
      "51": [
        { principle: "変化への対応", application: "変化を恐れず新しい可能性を探る" },
        { principle: "スピード重視", application: "機会を逃さず迅速に行動する" },
        { principle: "革新的思考", application: "従来の枠にとらわれない発想を大切にする" }
      ],
      "25": [
        { principle: "自然体の重視", application: "無理をせず本来の姿で価値を発揮する" },
        { principle: "純粋な動機", application: "打算ではなく本質的な価値を追求する" },
        { principle: "直感の信頼", application: "理屈を超えた感覚を大切にする" }
      ],
      "29": [
        { principle: "根本的思考", application: "表面的でなく根本的な解決を目指す" },
        { principle: "継続的努力", application: "一時的な困難に屈せず長期的視点を保つ" },
        { principle: "深い理解", application: "物事の背景を理解してから判断する" }
      ],
      "60": [
        { principle: "秩序の活用", application: "ルールや制約を創造性の土台とする" },
        { principle: "計画的実行", application: "段階的なアプローチで確実に成果を得る" },
        { principle: "効率性の追求", application: "限られた資源で最大の効果を生み出す" }
      ],
      "52": [
        { principle: "安定性の重視", application: "確実な基盤の上に発展を築く" },
        { principle: "慎重な判断", application: "性急さを避けて適切なタイミングを待つ" },
        { principle: "継続の力", application: "着実な積み重ねによって目標を達成する" }
      ],
      "18": [
        { principle: "質の重視", application: "妥協せず高い完成度を目指す" },
        { principle: "改善の継続", application: "現状に満足せず常により良い方法を探る" },
        { principle: "伝統と革新", application: "良いものは活かし必要な変化は受け入れる" }
      ],
      "2": [
        { principle: "支援の精神", application: "他者の成長と成功を積極的にサポートする" },
        { principle: "受容の力", application: "多様性を認め包容力で関係を築く" },
        { principle: "協調の重視", application: "個人の利益より全体の調和を大切にする" }
      ],
      "19": [
        { principle: "発展の志向", application: "現状に留まらず常に成長を目指す" },
        { principle: "積極的関与", application: "受動的でなく能動的に関わりを持つ" },
        { principle: "影響力の拡大", application: "良い変化を周囲に広げていく" }
      ]
    };

    if (valuePatterns[hexagramId]) {
      return valuePatterns[hexagramId];
    }

    return [
      { principle: "自己理解", application: "自分の特性を理解して適切に活用する" },
      { principle: "バランス重視", application: "強みと課題のバランスを保つ" },
      { principle: "成長志向", application: "常に学び続ける姿勢を大切にする" }
    ];
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

      // os_manualデータを取得（まずwindow.os_manualから、次にHAQEI_DATAから）
      let osManualData = null;
      if (window.os_manual && window.os_manual[hexagramId]) {
        osManualData = window.os_manual[hexagramId];
        console.log("🔍 [エンジンOS] window.os_manualから取得成功");
      } else if (window.HAQEI_DATA && window.HAQEI_DATA.os_manual && window.HAQEI_DATA.os_manual[hexagramId]) {
        osManualData = window.HAQEI_DATA.os_manual[hexagramId];
        console.log("🔍 [エンジンOS] HAQEI_DATA.os_manualから取得成功");
      } else {
        console.log("🔍 [DEBUG] 利用可能なデータソース:", {
          "window.os_manual": window.os_manual ? Object.keys(window.os_manual).length : "未定義",
          "window.HAQEI_DATA.os_manual": window.HAQEI_DATA?.os_manual ? Object.keys(window.HAQEI_DATA.os_manual).length : "未定義"
        });
      }

      if (!osManualData) {
        console.warn(`⚠️ os_manual[${hexagramId}]のデータが見つかりません - データベース未実装`);
        // エンジンOS詳細データの未実装を明示
        this.showNotImplementedMessage("engine", hexagramId);
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

        // 戦略的活用シーンを生成
        const tacticalScenarios = this.generateTacticalScenarios(hexagramId, osManualData);

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
                      </div>
                      <div class="tactical-content">
                          <h6>🎯 戦略的活用シーン</h6>
                          <div class="tactical-scenarios">
                              ${tacticalScenarios.map(scenario => 
                                `<div class="scenario-item">
                                    <span class="scenario-context">${scenario.context}</span>
                                    <span class="scenario-action">→ ${scenario.action}</span>
                                 </div>`
                              ).join('')}
                          </div>
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

        // 改善のための戦術を生成
        const improvementTactics = this.generateImprovementTactics(hexagramId, osManualData);

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
                      </div>
                      <div class="tactical-content">
                          <h6>⚡ 改善のための戦術</h6>
                          <div class="improvement-tactics">
                              ${improvementTactics.map(tactic => 
                                `<div class="tactic-item">
                                    <span class="tactic-situation">${tactic.situation}</span>
                                    <span class="tactic-method">→ ${tactic.method}</span>
                                 </div>`
                              ).join('')}
                          </div>
                          <button class="detailed-view-btn" data-section="challenges" data-hexagram="${hexagramId}">
                              🔧 デバッグ方法を詳しく見る
                          </button>
                      </div>
                  `;
      }

      // 主要な動機パターンを更新
      const coreDrive = document.getElementById("engine-core-drive");
      if (coreDrive && osManualData.summary) {
        // 戦略的価値観を生成
        const strategicValues = this.generateStrategicValues(hexagramId, osManualData);

        coreDrive.innerHTML = `
                      <div class="core-drive-content">
                          <p class="summary-text">${osManualData.summary}</p>
                      </div>
                      <div class="tactical-content">
                          <h6>🔥 戦略的価値観</h6>
                          <div class="strategic-values">
                              ${strategicValues.map(value => 
                                `<div class="value-item">
                                    <span class="value-principle">${value.principle}</span>
                                    <span class="value-application">→ ${value.application}</span>
                                 </div>`
                              ).join('')}
                          </div>
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

      // engine-interfaceディレクトリから詳細なデータを読み込む
      const compatibilityData = await this.loadEngineInterfaceCompatibilityData(
        engineOS.hexagramId,
        interfaceOS.hexagramId
      );

      // 互換性データの構造を正しく取得（internal_team_analysis経由）
      const interfaceCombinations = compatibilityData?.internal_team_analysis?.interface_combinations || 
                                   compatibilityData?.interface_combinations;
                                   
      if (interfaceCombinations && interfaceCombinations.length > 0) {
        const combination = interfaceCombinations.find(
          c => c.interface_id === interfaceOS.hexagramId
        );
        
        console.log(`🔍 [互換性] Engine ${engineOS.hexagramId} × Interface ${interfaceOS.hexagramId}の組み合わせを検索中...`);
        console.log(`📊 [互換性] 利用可能な組み合わせ数: ${interfaceCombinations.length}`);
        console.log(`🎯 [互換性] 発見した組み合わせ:`, combination ? "あり" : "なし");

        if (combination) {
          const typeColor = this.getCombinationTypeColor(combination.type);
          const typeIcon = this.getCombinationTypeIcon(combination.type);

          compatibilityContent.innerHTML = `
                      <div class="os-aspect-compatibility-result">
                          <div class="os-aspect-harmony-header">
                              <div class="harmony-type-badge ${typeColor}">
                                  <span class="harmony-icon">${typeIcon}</span>
                                  <span class="harmony-label">${combination.type}</span>
                              </div>
                              <div class="compatibility-score">${Math.round(
                                combination.overall_score * 100
                              )}%</div>
                          </div>
                          
                          <div class="os-aspect-relationship-explanation">
                              <h5>🤝 ${engineOS.osName} × ${interfaceOS.osName}</h5>
                              <p class="combination-summary">${combination.summary}</p>
                              
                              <div class="evaluation-details">
                                  <h6>📊 詳細評価</h6>
                                  <div class="evaluation-grid">
                                      <div class="eval-item">
                                          <span class="eval-label">機能効率性:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.functional_efficiency.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.functional_efficiency.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">成長可能性:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.growth_potential.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.growth_potential.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">ストレス耐性:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.stress_resilience.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.stress_resilience.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">創造性:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.creativity.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.creativity.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">統合の難易度:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.integration_challenge.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.integration_challenge.description}</p>
                                      </div>
                                  </div>
                              </div>
                              
                              <div class="combination-advice">
                                  <h6>💡 活用のアドバイス</h6>
                                  <div class="advice-section">
                                      <strong>強み:</strong>
                                      <ul>
                                          ${combination.advice.strengths.map(s => `<li>${s}</li>`).join('')}
                                      </ul>
                                  </div>
                                  <div class="advice-section">
                                      <strong>課題:</strong>
                                      <ul>
                                          ${combination.advice.challenges.map(c => `<li>${c}</li>`).join('')}
                                      </ul>
                                  </div>
                                  <div class="advice-section">
                                      <strong>推奨アクション:</strong>
                                      <ul>
                                          ${combination.advice.recommendations.map(r => `<li>${r}</li>`).join('')}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `;
        }
      } else {
        // フォールバック: データベース読み込み失敗時のエラー表示
        console.error(`❌ [インターフェース互換性] データ読み込み失敗: エンジンOS ${engineOS.hexagramId}, インターフェースOS ${interfaceOS.hexagramId}`);
        
        compatibilityContent.innerHTML = `
                      <div class="os-aspect-compatibility-result">
                          <div class="os-aspect-harmony-header">
                              <div class="harmony-type-badge harmony-error">
                                  <span class="harmony-icon">❌</span>
                                  <span class="harmony-label">データ読み込み失敗</span>
                              </div>
                              <div class="compatibility-score">--</div>
                          </div>
                          
                          <div class="os-aspect-relationship-explanation">
                              <h5>🤝 エンジンOSとインターフェースOSの関係</h5>
                              <p>データの読み込みに失敗しました。しばらく後にお試しください。</p>
                              
                              <div class="gap-insight">
                                  <div class="insight-header">
                                      <span class="insight-icon">⚠️</span>
                                      <span class="insight-title">エラー詳細</span>
                                  </div>
                                  <p>互換性データファイル（hexagram_${String(engineOS.hexagramId).padStart(2, '0')}.json）からのデータ取得に失敗しました。</p>
                              </div>
                          </div>
                      </div>
                  `;
        }
      }
    catch (error) {
      console.error("❌ エンジンOS・インターフェースOSの相互作用分析エラー:", error);
    }
  }

  async loadSafeModeCompatibility(engineOS, safeModeOS) {
    try {
      const compatibilityContent = document.getElementById(
        "safemode-compatibility-content"
      );
      if (!compatibilityContent) return;

      // engine-safemodeディレクトリから詳細なデータを読み込む
      const compatibilityData = await this.loadEngineSafeModeCompatibilityData(
        engineOS.hexagramId,
        safeModeOS.hexagramId
      );

      // セーフモード互換性データの構造を正しく取得（typo対応含む）
      const safemodeCombinations = compatibilityData?.internal_team_analysis?.safemode_combinations || 
                                  compatibilityData?.internal_team_analysis?.safemagroup_combinations ||
                                  compatibilityData?.safemode_combinations;
                                  
      if (safemodeCombinations && safemodeCombinations.length > 0) {
        const combination = safemodeCombinations.find(
          c => c.safemode_id === safeModeOS.hexagramId
        );
        
        console.log(`🔍 [セーフモード互換性] Engine ${engineOS.hexagramId} × SafeMode ${safeModeOS.hexagramId}の組み合わせを検索中...`);
        console.log(`📊 [セーフモード互換性] 利用可能な組み合わせ数: ${safemodeCombinations.length}`);
        console.log(`🎯 [セーフモード互換性] 発見した組み合わせ:`, combination ? "あり" : "なし");

        if (combination) {
          const typeColor = this.getCombinationTypeColor(combination.type);
          const typeIcon = this.getCombinationTypeIcon(combination.type);

          compatibilityContent.innerHTML = `
                      <div class="os-aspect-compatibility-result defense-analysis">
                          <div class="os-aspect-protection-header">
                              <div class="protection-type-badge ${typeColor}">
                                  <span class="protection-icon">${typeIcon}</span>
                                  <span class="protection-label">${combination.type}</span>
                              </div>
                              <div class="compatibility-score">${Math.round(
                                combination.overall_score * 100
                              )}%</div>
                          </div>
                          
                          <div class="os-aspect-defense-explanation">
                              <h5>🛡️ ${engineOS.osName} × ${safeModeOS.osName}</h5>
                              <p class="combination-summary">${combination.summary}</p>
                              
                              <div class="evaluation-details">
                                  <h6>📊 危機対応パターン分析</h6>
                                  <div class="evaluation-grid">
                                      <div class="eval-item">
                                          <span class="eval-label">危機耐性:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.crisis_resilience.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.crisis_resilience.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">回復可能性:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.recovery_potential.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.recovery_potential.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">周囲への影響:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.collateral_damage.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.collateral_damage.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">学びの深さ:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.lesson_learned.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.lesson_learned.description}</p>
                                      </div>
                                      <div class="eval-item">
                                          <span class="eval-label">統合の難易度:</span>
                                          <span class="eval-score">${Math.round(combination.evaluation.integration_difficulty.score * 100)}%</span>
                                          <p class="eval-desc">${combination.evaluation.integration_difficulty.description}</p>
                                      </div>
                                  </div>
                              </div>
                              
                              <div class="safemode-advice">
                                  <h6>⚠️ 危機管理アドバイス</h6>
                                  <div class="advice-section">
                                      <strong>トリガー警告:</strong>
                                      <p>${combination.advice.trigger_warning}</p>
                                  </div>
                                  <div class="advice-section">
                                      <strong>メルトダウン症状:</strong>
                                      <p>${combination.advice.meltdown_symptoms}</p>
                                  </div>
                                  <div class="advice-section">
                                      <strong>回復戦略:</strong>
                                      <p>${combination.advice.recovery_strategies}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `;
        }
      } else {
        // フォールバック: データベース読み込み失敗時のエラー表示
        console.error(`❌ [セーフモード互換性] データ読み込み失敗: エンジンOS ${engineOS.hexagramId}, セーフモードOS ${safeModeOS.hexagramId}`);
        
        compatibilityContent.innerHTML = `
                      <div class="os-aspect-compatibility-result defense-analysis">
                          <div class="os-aspect-protection-header">
                              <div class="protection-type-badge protection-error">
                                  <span class="protection-icon">❌</span>
                                  <span class="protection-label">データ読み込み失敗</span>
                              </div>
                              <div class="compatibility-score">--</div>
                          </div>
                          
                          <div class="os-aspect-defense-explanation">
                              <h5>🛡️ エンジンOSとセーフモードOSの関係</h5>
                              <p>データの読み込みに失敗しました。しばらく後にお試しください。</p>
                              
                              <div class="defense-pattern-insight">
                                  <div class="insight-header">
                                      <span class="insight-icon">⚠️</span>
                                      <span class="insight-title">エラー詳細</span>
                                  </div>
                                  <p>互換性データファイル（hexagram_${String(engineOS.hexagramId).padStart(2, '0')}.json）からのデータ取得に失敗しました。</p>
                              </div>
                          </div>
                        </div>
                    `;
        }
      }
    catch (error) {
      console.error("❌ エンジンOS・セーフモードOSの相互作用分析エラー:", error);
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

  // トリプルOS理論ベースの相互作用分析
  calculateCompatibility(hexagramId1, hexagramId2, aspectType) {
    // 卦IDを8つの基本卦グループに分類
    const getTrigramGroup = (id) => ((id - 1) % 8) + 1;
    const group1 = getTrigramGroup(hexagramId1);
    const group2 = getTrigramGroup(hexagramId2);

    // トリプルOS理論専用の相性マトリックス
    const compatibilityMatrix = {
      1: { 1: 85, 2: 65, 3: 90, 4: 75, 5: 60, 6: 45, 7: 70, 8: 55 }, // 乾 - 創造的リーダー
      2: { 1: 65, 2: 88, 3: 50, 4: 80, 5: 75, 6: 90, 7: 60, 8: 95 }, // 兌 - 調和型コミュニケーター
      3: { 1: 90, 2: 50, 3: 82, 4: 65, 5: 85, 6: 40, 7: 55, 8: 70 }, // 離 - 情熱的表現者
      4: { 1: 75, 2: 80, 3: 65, 4: 87, 5: 90, 6: 60, 7: 45, 8: 70 }, // 震 - 行動力溢れる実行者
      5: { 1: 60, 2: 75, 3: 85, 4: 90, 5: 84, 6: 65, 7: 50, 8: 75 }, // 巽 - 柔軟性を持つ適応者
      6: { 1: 45, 2: 90, 3: 40, 4: 60, 5: 65, 6: 83, 7: 85, 8: 98 }, // 坎 - 深い知恵を持つ思考者
      7: { 1: 70, 2: 60, 3: 55, 4: 45, 5: 50, 6: 85, 7: 92, 8: 75 }, // 艮 - 安定性を持つ守護者
      8: { 1: 55, 2: 95, 3: 70, 4: 70, 5: 75, 6: 98, 7: 75, 8: 89 }, // 坤 - 包容力ある支援者
    };

    const baseScore = compatibilityMatrix[group1]?.[group2] || 60;

    // パーソナリティOSタイプ別の調整
    let adjustedScore = baseScore;
    if (aspectType === "social") {
      // インターフェースOSは表現の一致性を重視
      adjustedScore = Math.min(baseScore + 8, 98);
    } else if (aspectType === "defense") {
      // セーフモードOSは心理的安全性を重視
      adjustedScore = Math.max(baseScore - 15, 20);
    }

    return {
      score: adjustedScore,
      description: this.getCompatibilityDescription(adjustedScore, aspectType),
    };
  }

  // 旧メソッドも保持（互換性のため）
  calculateSimpleCompatibility(hexagramId1, hexagramId2, type) {
    // トリプルOS理論ベースにリダイレクト
    const aspectType = type === "interface" ? "social" : type === "safemode" ? "defense" : "authentic";
    return this.calculateCompatibility(hexagramId1, hexagramId2, aspectType);
  }

  // トリプルOS理論ベースの相互作用説明を生成
  getCompatibilityDescription(score, aspectType) {
    const descriptions = {
      social: {
        high: "エンジンOSとインターフェースOSが非常によく調和しています。あなたらしさが自然に表現され、真の魅力で人を引きつけます。",
        medium: "本音と社会的な面がバランス良く機能しています。状況に応じて上手く使い分けができています。",
        low: "本音と社会的な面にギャップがあります。意識的に本音を表現する練習をすることで、より自然な関係を築けます。"
      },
      defense: {
        high: "エンジンOSとセーフモードOSがよく連携しています。ストレス時でも価値観を大切にしながら自分を守ることができます。",
        medium: "本音と防御的な面が適度にバランスを保っています。困難な状況でも最終的には本音に戻ることができます。",
        low: "本音と防御的な面の間に緊張関係があります。ストレス時に本来の自分とは異なる行動を取りがちですが、これも必要な知恵です。"
      },
      authentic: {
        high: "エンジンOSが非常に安定し、一貫した価値観で行動できています。",
        medium: "エンジンOSが適度に機能し、状況に応じて柔軟に対応できています。",
        low: "エンジンOSが不安定で、価値観の確立や自己理解の深化が必要です。"
      }
    };

    const typeDesc = descriptions[aspectType] || descriptions.authentic;
    if (score >= 75) return typeDesc.high;
    if (score >= 50) return typeDesc.medium;
    return typeDesc.low;
  }

  // 互換性説明を生成（旧メソッド保持）
  getCompatibilityDescription(score, type) {
    const aspectType = type === "interface" ? "social" : type === "safemode" ? "defense" : "authentic";
    return this.getCompatibilityDescription(score, aspectType);
  }

  // 8卦カラーカードの表示
  async _renderBaguaCards() {
        console.log("🎴 [TripleOSResultsView] 8卦カラーカード表示開始");
        
        const container = document.getElementById('bagua-cards-container');
        if (!container) {
            console.error("❌ [TripleOSResultsView] Bagua cards container not found - DOM may not be ready");
            // フレームの最後で再試行
            setTimeout(() => this._renderBaguaCards(), 100);
            return;
        }

        const { engineOS } = await this.extractTripleOSData(this.analysisResult);
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
            { key: '乾_リーダーシップ', name: 'リーダーシップ', color: '#ff6b6b', colorRgb: '255,107,107', icon: '☰', trigram: '乾' },
            { key: '震_動き', name: '動き', color: '#4ecdc4', colorRgb: '78,205,196', icon: '☳', trigram: '震' },
            { key: '坎_深さ', name: '深さ', color: '#45b7d1', colorRgb: '69,183,209', icon: '☵', trigram: '坎' },
            { key: '艮_堅実性', name: '堅実性', color: '#96ceb4', colorRgb: '150,206,180', icon: '☶', trigram: '艮' },
            { key: '坤_包容性', name: '包容性', color: '#ffeaa7', colorRgb: '255,234,167', icon: '☷', trigram: '坤' },
            { key: '巽_柔軟性', name: '柔軟性', color: '#fd79a8', colorRgb: '253,121,168', icon: '☴', trigram: '巽' },
            { key: '離_明るさ', name: '明るさ', color: '#fdcb6e', colorRgb: '253,203,110', icon: '☲', trigram: '離' },
            { key: '兌_コミュニケーション', name: 'コミュニケーション', color: '#a29bfe', colorRgb: '162,155,254', icon: '☱', trigram: '兌' }
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

    const { interfaceOS, safeModeOS } = await this.extractTripleOSData(this.analysisResult);

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
          description: "困難な状況から立ち直る力。ストレス後の心の回復速度を示します。",
          value:
            hexagramData.resilience_score || hexagramData.stability_score || 0,
        },
        {
          key: "adaptability_score",
          label: "適応力",
          description: "環境変化に柔軟に対応する力。状況に合わせて自分を調整する能力です。",
          value:
            hexagramData.adaptability_score ||
            hexagramData.innovation_score ||
            0,
        },
        {
          key: "protection_score",
          label: "防御力",
          description: "自分を守る意識の強さ。外的脅威から心を守る防護壁の厚さです。",
          value:
            hexagramData.protection_score ||
            hexagramData.independence_score ||
            0,
        },
        {
          key: "support_seeking_score",
          label: "支援希求",
          description: "他者に助けを求める傾向。困った時に人に頼る意欲の高さです。",
          value:
            hexagramData.support_seeking_score ||
            hexagramData.cooperation_score ||
            0,
        },
        {
          key: "introspection_score",
          label: "内省力",
          description: "自分を客観視する力。ストレス時に冷静に自己分析する能力です。",
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
                              <div class="metric-header">
                                  <div class="metric-label">${metric.label}</div>
                                  <div class="metric-value">${metric.value.toFixed(1)}</div>
                              </div>
                              <div class="metric-bar">
                                  <div class="metric-fill" style="width: ${
                                    metric.value * 10
                                  }%; background: linear-gradient(135deg, #10b981, #34d399);"></div>
                              </div>
                              <div class="metric-description">${metric.description}</div>
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
        advice = `あなたの防御システムは「${safeModeOS.osName}」タイプと高い一致度を示しています。ストレス時にこの特性が強く表れる傾向があります。適度に活用しつつ、過度に依存しないよう注意しましょう。`;
      } else if (score >= 15) {
        advice = `あなたの防御システムは「${safeModeOS.osName}」タイプと部分的に一致しています。この特性を理解し、ストレス時の選択肢として意識しておくと良いでしょう。`;
      } else {
        advice = `あなたの防御システムは「${safeModeOS.osName}」タイプとは現在の一致度が低く、この特性は潜在的な状態にあります。環境や状況の変化により、この防御機制が活性化する可能性があります。`;
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

  // セーフモード発動メカニズム解析の表示
  async displaySafeModeAdvancedAnalysis(insights) {
    try {
      const advancedContainer = document.getElementById("safemode-advanced-content");
      if (!advancedContainer || !insights.safeModeAnalysis) return;

      const safeModeAnalysis = insights.safeModeAnalysis;
      const { misalignmentData, activationTriggers, chronificationEffects, runawayPatterns, riskAssessment } = safeModeAnalysis;

      const riskLevelColors = {
        'low': 'green',
        'medium': 'orange', 
        'high': 'red'
      };

      advancedContainer.innerHTML = `
        <div class="safemode-mechanism-analysis">
          <div class="risk-overview">
            <div class="risk-card">
              <div class="risk-header">
                <h5>🚨 セーフモード発動リスク</h5>
                <div class="risk-level ${riskLevelColors[riskAssessment.activationRisk]}">${this.getRiskLevelText(riskAssessment.activationRisk)}</div>
              </div>
              <div class="risk-details">
                <p>エンジンOSとインターフェースOSの不一致度: <strong>${Math.round(misalignmentData.misalignmentScore)}%</strong></p>
                <p>セーフモード発動可能性: <strong>${Math.round(misalignmentData.safeModeActivationRisk)}%</strong></p>
              </div>
            </div>
            
            <div class="risk-card">
              <div class="risk-header">
                <h5>⚠️ 長期化・暴走リスク</h5>
                <div class="risk-level ${riskLevelColors[riskAssessment.chronificationRisk]}">${this.getRiskLevelText(riskAssessment.chronificationRisk)}</div>
              </div>
              <div class="risk-details">
                <p>セーフモード慢性化リスク: <strong>${Math.round(misalignmentData.safeModeChronificationRisk)}%</strong></p>
              </div>
            </div>
          </div>

          ${activationTriggers.length > 0 ? `
          <div class="activation-triggers">
            <h5>🔍 セーフモード発動トリガー</h5>
            <div class="triggers-list">
              ${activationTriggers.map(trigger => `
                <div class="trigger-item severity-${trigger.severity}">
                  <div class="trigger-header">
                    <span class="trigger-icon">${this.getTriggerIcon(trigger.type)}</span>
                    <span class="trigger-type">${this.getTriggerTypeName(trigger.type)}</span>
                  </div>
                  <p class="trigger-description">${trigger.description}</p>
                  <div class="trigger-advice">
                    <strong>対処法:</strong> ${trigger.advice}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${chronificationEffects.length > 0 ? `
          <div class="chronification-effects">
            <h5>⏱️ セーフモード長期化の影響</h5>
            <div class="effects-list">
              ${chronificationEffects.map(effect => `
                <div class="effect-item severity-${effect.severity}">
                  <div class="effect-header">
                    <span class="effect-icon">${this.getEffectIcon(effect.type)}</span>
                    <span class="effect-type">${this.getEffectTypeName(effect.type)}</span>
                  </div>
                  <p class="effect-description">${effect.description}</p>
                  <div class="effect-manifestation">
                    <strong>現れ方:</strong> ${effect.manifestation}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${runawayPatterns.length > 0 ? `
          <div class="runaway-patterns">
            <h5>💥 暴走パターンと予防策</h5>
            <div class="patterns-list">
              ${runawayPatterns.map(pattern => `
                <div class="pattern-item">
                  <div class="pattern-header">
                    <span class="pattern-icon">${this.getPatternIcon(pattern.type)}</span>
                    <span class="pattern-type">${this.getPatternTypeName(pattern.type)}</span>
                  </div>
                  <p class="pattern-description">${pattern.description}</p>
                  <div class="pattern-warning">
                    <strong>⚠️ 警告:</strong> ${pattern.warning}
                  </div>
                  <div class="pattern-prevention">
                    <strong>💡 予防策:</strong> ${pattern.prevention}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          <div class="overall-assessment">
            <h5>📊 総合評価</h5>
            <div class="assessment-card level-${riskAssessment.overallAssessment.level}">
              <div class="assessment-summary">
                <p>${riskAssessment.overallAssessment.summary}</p>
              </div>
              
              <div class="assessment-key-points">
                <h6>重要なポイント:</h6>
                <ul>
                  ${riskAssessment.overallAssessment.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
              </div>
              
              <div class="assessment-recommendations">
                <h6>推奨アクション:</h6>
                <ul>
                  ${riskAssessment.overallAssessment.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("❌ セーフモード発動メカニズム解析表示エラー:", error);
    }
  }

  // ヘルパーメソッド群
  getRiskLevelText(level) {
    const levelMap = {
      'low': '低リスク',
      'medium': '注意が必要',  
      'high': '高リスク'
    };
    return levelMap[level] || '不明';
  }

  getTriggerIcon(type) {
    const iconMap = {
      'value_conflict': '⚔️',
      'authenticity_suppression': '😶',
      'role_overload': '🎭'
    };
    return iconMap[type] || '🔍';
  }

  getTriggerTypeName(type) {
    const nameMap = {
      'value_conflict': '価値観の対立',
      'authenticity_suppression': '本来性の抑圧',
      'role_overload': '役割過多'
    };
    return nameMap[type] || '不明なトリガー';
  }

  getEffectIcon(type) {
    const iconMap = {
      'identity_confusion': '🤔',
      'emotional_numbing': '😶‍🌫️',
      'relationship_difficulty': '💔',
      'decision_paralysis': '🤷'
    };
    return iconMap[type] || '⚠️';
  }

  getEffectTypeName(type) {
    const nameMap = {
      'identity_confusion': 'アイデンティティの混乱',
      'emotional_numbing': '感情の麻痺',
      'relationship_difficulty': '人間関係の困難',
      'decision_paralysis': '決断麻痺'
    };
    return nameMap[type] || '不明な影響';
  }

  getPatternIcon(type) {
    const iconMap = {
      'impulsive_escape': '🏃',
      'emotional_explosion': '💥',
      'self_destructive_behavior': '⚡'
    };
    return iconMap[type] || '💥';
  }

  getPatternTypeName(type) {
    const nameMap = {
      'impulsive_escape': '衝動的な逃避',
      'emotional_explosion': '感情の爆発',
      'self_destructive_behavior': '自己破壊的行動'
    };
    return nameMap[type] || '不明なパターン';
  }

  bindInteractiveEventListeners() {
    console.log("🔗 [TripleOSResultsView] 対話型イベントリスナー設定");

    // OSカードの展開機能（リファクタリング済み）
    const cards = this.container.querySelectorAll(".interactive-os-card");
    cards.forEach((card) => {
      const header = card.querySelector(".os-card-header");
      const indicator = card.querySelector(".expand-indicator");

      header.addEventListener("click", () => {
        this.handleCardExpansion(card, cards, indicator);
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

  // トリプルOS理論専用のヘルパーメソッド群

  // インターフェースOSとの調和タイプを取得
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

  // パーソナリティOSギャップ分析
  analyzeBunenjinGap(score) {
    if (score >= 75) {
      return {
        description: 'エンジンOSとインターフェースOSがよく一致しており、自然体で人と関わることができています。',
        advice: 'この調和を活かして、リーダーシップやメンターの役割で力を発揮してみましょう。'
      };
    } else if (score >= 50) {
      return {
        description: '本音と社会的な顔の間に適度なバランスがあり、TPOに応じた使い分けができています。',
        advice: '状況に応じてより意識的に使い分けることで、さらに効果的なコミュニケーションが可能になります。'
      };
    } else {
      return {
        description: 'エンジンOSとインターフェースOSの間にギャップがあります。これは決して悪いことではありません。',
        advice: '小さな場面から本音を表現する練習をすることで、より自然で魅力的な人間関係を築けるでしょう。'
      };
    }
  }

  // セーフモードOSの保護タイプを取得
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
        recoveryAdvice: 'エンジンOSの強みを意識的に思い出すことで、より早く安心状態に戻ることができます。'
      };
    } else if (score >= 40) {
      return {
        description: 'ストレス時は本音と防御的な面が時々対立しますが、最終的にはバランスを取り戻します。',
        recoveryAdvice: 'セーフモードOSが働いている時は、まず安全を確保してからエンジンOSに戻る順序を意識しましょう。'
      };
    } else {
      return {
        description: 'ストレス時は本音とは異なる行動を取りがちですが、これも自分を守るための大切な知恵です。',
        recoveryAdvice: 'セーフモードOSも大切な一部です。批判せずに受け入れ、安全になったらエンジンOSに戻ることを心がけましょう。'
      };
    }
  }

  // パーソナリティOSシナジー活用アドバイス
  getBunenjinSynergyAdvice(score, type) {
    if (type === 'social') {
      if (score >= 75) {
        return 'エンジンOSとインターフェースOSがよく連携しているので、リーダーシップやメンター役で力を発揮できます。人の成長を支援する場面で特に輝けるでしょう。';
      } else if (score >= 50) {
        return '状況に応じて使い分けができているので、多様な人間関係で活躍できます。意識的に本音を少しずつ表現することで、さらに魅力的になれます。';
      } else {
        return '本音と社会的な面のギャップを活かして、幅広い人との関係を築けます。まずは信頼できる人から本音を表現する練習をしてみましょう。';
      }
    } else {
      return '各パーソナリティOSの特性を理解し、最適な選択をすることで戦略的な人生ナビゲーションが可能になります。';
    }
  }

  // セーフモードOSのバランスアドバイス
  getBunenjinDefenseAdvice(score) {
    if (score >= 70) {
      return '本音の価値観と防御機制がよく調和しているので、ストレス時でも建設的な対処ができます。この強みを活かして、困難な状況でのリーダーシップを発揮することもできるでしょう。';
    } else if (score >= 40) {
      return 'エンジンOSとセーフモードOSが適度にバランスを保っているので、状況に応じて柔軟に対応できます。ストレス時は一度立ち止まって、どのパーソナリティOSで対応するかを意識的に選択してみましょう。';
    } else {
      return 'エンジンOSとセーフモードOSの間に緊張がありますが、これも多様性の表れです。セーフモードOSが働いている時は批判せず、まず安全を確保してからエンジンOSに戻ることを意識しましょう。';
    }
  }

  // 🧹 カード展開処理をリファクタリング（見切れ問題解決）
  handleCardExpansion(targetCard, allCards, indicator) {
    const wasExpanded = targetCard.classList.contains("expanded");
    
    // 🔄 すべてのカードを閉じる（アコーディオン効果）
    allCards.forEach((card) => {
      card.classList.remove("expanded");
      const cardIndicator = card.querySelector(".expand-indicator");
      if (cardIndicator) cardIndicator.textContent = "+";
    });

    // 🎯 クリックされたカードが閉じていた場合のみ展開
    if (!wasExpanded) {
      targetCard.classList.add("expanded");
      indicator.textContent = "-";
      
      // ✨ 安全なスクロール処理
      this.ensureCardVisibility(targetCard);
    }
  }

  // 🎯 カードの完全表示を保証するスクロール処理（完全修正版）
  ensureCardVisibility(card) {
    // CSS transition完了後に安全にスクロール
    const performScroll = () => {
      try {
        const cardRect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportTop = window.pageYOffset;
        const cardTop = cardRect.top + viewportTop;
        const cardBottom = cardTop + cardRect.height;
        
        console.log(`🔍 Card visibility check:`, {
          cardHeight: cardRect.height,
          viewportHeight: viewportHeight,
          cardTop: cardTop,
          cardBottom: cardBottom,
          currentScrollY: viewportTop
        });
        
        // カードのサイズに応じた最適スクロール
        if (cardRect.height > viewportHeight * 0.9) {
          // 非常に大きなカード: カードの上部を画面上端に
          window.scrollTo({
            top: cardTop - 20,
            behavior: 'smooth'
          });
          console.log(`📍 Large card scroll to top: ${cardTop - 20}`);
        } else if (cardRect.height > viewportHeight * 0.6) {
          // 大きなカード: カードの上部を画面の1/4位置に
          window.scrollTo({
            top: cardTop - (viewportHeight * 0.25),
            behavior: 'smooth'
          });
          console.log(`📍 Medium card scroll: ${cardTop - (viewportHeight * 0.25)}`);
        } else {
          // 通常サイズ: カード全体が見えるよう中央寄りに
          const optimalScrollTop = cardTop - (viewportHeight - cardRect.height) / 2;
          window.scrollTo({
            top: Math.max(0, optimalScrollTop),
            behavior: 'smooth'
          });
          console.log(`📍 Normal card scroll to center: ${Math.max(0, optimalScrollTop)}`);
        }
      } catch (error) {
        console.error('❌ Error in card visibility adjustment:', error);
      }
    };
    
    // DOM更新とCSS transition完了を確実に待つ
    requestAnimationFrame(() => {
      setTimeout(() => {
        // さらに安全のため、もう一度確認
        requestAnimationFrame(performScroll);
      }, 350); // CSS transition (通常300ms) + 50ms余裕
    });
  }

  // StorageManagerからの復旧 - Phase 3追加メソッド
  tryStorageManagerRecovery() {
    try {
      if (window.storageManager) {
        const analysisResult = window.storageManager.getAnalysisResult();
        if (analysisResult && (analysisResult.engineOS || analysisResult.interfaceOS || analysisResult.safeModeOS)) {
          console.log('✅ [RECOVERY] StorageManagerから復旧成功');
          return {
            found: true,
            data: {
              engineOS: analysisResult.engineOS,
              interfaceOS: analysisResult.interfaceOS,
              safeModeOS: analysisResult.safeModeOS
            }
          };
        }
      }
      return { found: false };
    } catch (error) {
      console.warn('⚠️ [RECOVERY] StorageManager復旧失敗:', error);
      return { found: false };
    }
  }

  // LocalStorageからの復旧 - Phase 3追加メソッド
  tryLocalStorageRecovery() {
    try {
      const keys = ['haqei_analysis_result', 'os_analyzer_result', 'triple_os_data'];
      
      for (const key of keys) {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.engineOS || parsed.interfaceOS || parsed.safeModeOS) {
            console.log(`✅ [RECOVERY] LocalStorage(${key})から復旧成功`);
            return {
              found: true,
              data: {
                engineOS: parsed.engineOS,
                interfaceOS: parsed.interfaceOS,
                safeModeOS: parsed.safeModeOS
              }
            };
          }
        }
      }
      return { found: false };
    } catch (error) {
      console.warn('⚠️ [RECOVERY] LocalStorage復旧失敗:', error);
      return { found: false };
    }
  }

  // SessionStorageからの復旧 - Phase 3追加メソッド
  trySessionStorageRecovery() {
    try {
      const keys = ['haqei_session_analysis', 'current_os_analysis'];
      
      for (const key of keys) {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.engineOS || parsed.interfaceOS || parsed.safeModeOS) {
            console.log(`✅ [RECOVERY] SessionStorage(${key})から復旧成功`);
            return {
              found: true,
              data: {
                engineOS: parsed.engineOS,
                interfaceOS: parsed.interfaceOS,
                safeModeOS: parsed.safeModeOS
              }
            };
          }
        }
      }
      return { found: false };
    } catch (error) {
      console.warn('⚠️ [RECOVERY] SessionStorage復旧失敗:', error);
      return { found: false };
    }
  }

  // IndexedDBからの復旧 - Phase 3追加メソッド
  async tryIndexedDBRecovery() {
    try {
      if (!window.indexedDB) return { found: false };
      
      return new Promise((resolve) => {
        const request = indexedDB.open('HaQeiAnalyzerDB', 1);
        
        request.onsuccess = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('analysis_results')) {
            resolve({ found: false });
            return;
          }
          
          const transaction = db.transaction(['analysis_results'], 'readonly');
          const store = transaction.objectStore('analysis_results');
          const getRequest = store.get('current_analysis');
          
          getRequest.onsuccess = () => {
            if (getRequest.result && getRequest.result.data) {
              const data = getRequest.result.data;
              if (data.engineOS || data.interfaceOS || data.safeModeOS) {
                console.log('✅ [RECOVERY] IndexedDBから復旧成功');
                resolve({
                  found: true,
                  data: {
                    engineOS: data.engineOS,
                    interfaceOS: data.interfaceOS,
                    safeModeOS: data.safeModeOS
                  }
                });
                return;
              }
            }
            resolve({ found: false });
          };
          
          getRequest.onerror = () => resolve({ found: false });
        };
        
        request.onerror = () => resolve({ found: false });
      });
    } catch (error) {
      console.warn('⚠️ [RECOVERY] IndexedDB復旧失敗:', error);
      return { found: false };
    }
  }

  // OS分析コンテキストからの復旧 - Phase 3追加メソッド  
  tryOSAnalysisContextRecovery() {
    try {
      // グローバルな分析コンテキストを検索
      if (window.TRIPLE_OS_ANALYSIS_CONTEXT) {
        const context = window.TRIPLE_OS_ANALYSIS_CONTEXT;
        if (context.engineOS || context.interfaceOS || context.safeModeOS) {
          console.log('✅ [RECOVERY] OS分析コンテキストから復旧成功');
          return {
            found: true,
            data: {
              engineOS: context.engineOS,
              interfaceOS: context.interfaceOS,
              safeModeOS: context.safeModeOS
            }
          };
        }
      }
      
      // 戦略ナビゲーターからの復旧
      if (window.strategyNavigator) {
        const analysisData = window.strategyNavigator.getCurrentAnalysis?.();
        if (analysisData && (analysisData.engineOS || analysisData.interfaceOS || analysisData.safeModeOS)) {
          console.log('✅ [RECOVERY] 戦略ナビゲーターから復旧成功');
          return {
            found: true,
            data: {
              engineOS: analysisData.engineOS,
              interfaceOS: analysisData.interfaceOS,
              safeModeOS: analysisData.safeModeOS
            }
          };
        }
      }
      
      return { found: false };
    } catch (error) {
      console.warn('⚠️ [RECOVERY] OS分析コンテキスト復旧失敗:', error);
      return { found: false };
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

  // ========================================
  // Phase 4: 批判的・生産的視点対応システム
  // ========================================

  /**
   * 批判的思考機能の初期化
   */
  async initializeCriticalThinkingFeatures() {
    console.log("🧠 [Phase4] 批判的思考機能を初期化中...");

    try {
      // Phase 4エンジンの初期化
      this.shadowAnalyzer = new ShadowAnalyzer();
      this.criticalThinkingEngine = new CriticalThinkingEngine();

      // データの準備
      const extractedData = await this.extractTripleOSData(this.analysisResult);
      const { engineOS, interfaceOS, safeModeOS } = extractedData;

      // 各タブのコンテンツを生成
      await Promise.all([
        this.initializeShadowAnalysis(engineOS, interfaceOS, safeModeOS),
        this.initializeChallengeQuestions(this.analysisResult),
        this.initializeToolLimitations()
      ]);

      // タブ切り替え機能を初期化
      this.initializeCriticalTabs();

      console.log("✅ [Phase4] 批判的思考機能の初期化完了");
    } catch (error) {
      console.error("❌ [Phase4] 批判的思考機能の初期化エラー:", error);
      this.displayCriticalThinkingError();
    }
  }

  /**
   * 批判的・生産的視点カードの初期化
   */
  async initializeCriticalProductiveCard() {
    console.log("🧠 [CriticalProductiveCard] 初期化開始");

    try {
      // コンテナの存在確認
      const container = document.getElementById('critical-productive-card-container');
      if (!container) {
        console.warn("⚠️ [CriticalProductiveCard] コンテナが見つかりません");
        return;
      }

      // データ抽出
      const extractedData = await this.extractTripleOSData(this.analysisResult);
      const { engineOS, interfaceOS, safeModeOS } = extractedData;

      if (!engineOS) {
        console.warn("⚠️ [CriticalProductiveCard] エンジンOSデータがありません");
        return;
      }

      // 各OSの批判的・生産的視点カードを作成
      const criticalCards = [];

      // エンジンOS用カード
      if (engineOS && engineOS.score !== undefined) {
        await this._createCriticalProductiveCardForOS(container, engineOS, 'engine', '価値観システム');
        criticalCards.push('engine');
      }

      // インターフェースOS用カード
      if (interfaceOS && interfaceOS.score !== undefined) {
        await this._createCriticalProductiveCardForOS(container, interfaceOS, 'interface', '社会的システム');
        criticalCards.push('interface');
      }

      // セーフモードOS用カード
      if (safeModeOS && safeModeOS.score !== undefined) {
        await this._createCriticalProductiveCardForOS(container, safeModeOS, 'safemode', '防御システム');
        criticalCards.push('safemode');
      }

      console.log(`✅ [CriticalProductiveCard] ${criticalCards.length}個のカード初期化完了:`, criticalCards);

    } catch (error) {
      console.error("❌ [CriticalProductiveCard] 初期化エラー:", error);
      this._renderCriticalProductiveCardError(error.message);
    }
  }

  /**
   * 個別OSの批判的・生産的視点カードを作成
   */
  async _createCriticalProductiveCardForOS(parentContainer, osData, osType, osTypeName) {
    try {
      // カード用のコンテナを作成
      const cardContainer = document.createElement('div');
      cardContainer.id = `critical-productive-${osType}`;
      cardContainer.className = `critical-productive-wrapper ${osType}-card`;
      
      // セクションタイトルを追加
      const titleDiv = document.createElement('div');
      titleDiv.className = 'critical-productive-title';
      titleDiv.innerHTML = `<h3>🧠 ${osTypeName}への批判的・生産的視点</h3>`;
      cardContainer.appendChild(titleDiv);

      // カードコンテナを追加
      const cardDiv = document.createElement('div');
      cardDiv.id = `critical-productive-card-${osType}`;
      cardContainer.appendChild(cardDiv);

      parentContainer.appendChild(cardContainer);

      // CriticalProductiveCardインスタンスを作成
      const criticalProductiveCard = new CriticalProductiveCard(`critical-productive-card-${osType}`, {
        shadowAnalyzer: this.shadowAnalyzer,
        criticalThinkingEngine: this.criticalThinkingEngine,
        analysisResult: this.analysisResult,
        osData: osData,
        score: this._calculateScore(osData),
        hexagramDetails: this._getHexagramDetails(osData)
      });

      // カードを初期化
      await criticalProductiveCard.init();

      console.log(`✅ [CriticalProductiveCard] ${osType}カード作成完了`);

    } catch (error) {
      console.error(`❌ [CriticalProductiveCard] ${osType}カード作成エラー:`, error);
    }
  }

  /**
   * スコア計算（既存のメソッドを利用）
   */
  _calculateScore(osData) {
    if (osData.score !== undefined) {
      return osData.score;
    }
    
    // フォールバック: 回答データから計算
    if (osData.answers && Array.isArray(osData.answers)) {
      const totalScore = osData.answers.reduce((sum, answer) => sum + (answer.value || 0), 0);
      const maxScore = osData.answers.length * 5; // 仮定: 最大5点
      return Math.round((totalScore / maxScore) * 100);
    }
    
    return 50; // デフォルト値
  }

  /**
   * 易経詳細データの取得
   */
  _getHexagramDetails(osData) {
    const hexagramId = osData.hexagramId || osData.osId;
    if (hexagramId && window.HEXAGRAM_DETAILS) {
      return window.HEXAGRAM_DETAILS[hexagramId];
    }
    return null;
  }

  /**
   * エラー表示
   */
  _renderCriticalProductiveCardError(message) {
    const container = document.getElementById('critical-productive-card-container');
    if (container) {
      container.innerHTML = `
        <div class="critical-productive-error">
          <h3>🧠 批判的・生産的視点</h3>
          <p>申し訳ございません。カードの読み込みに失敗しました。</p>
          <p class="error-details">${message}</p>
        </div>
      `;
    }
  }

  /**
   * シャドウ分析の初期化
   */
  async initializeShadowAnalysis(engineOS, interfaceOS, safeModeOS) {
    console.log("🌑 [Phase4] シャドウ分析を初期化中...");

    const shadowContent = document.getElementById('shadow-analysis-content');
    if (!shadowContent) return;

    try {
      // 各OSのシャドウ分析を実行
      const shadowAnalyses = [];

      if (engineOS && engineOS.strength > 0.3) {
        const engineShadow = this.shadowAnalyzer.analyzeShadow(engineOS, Math.round(engineOS.strength * 100));
        shadowAnalyses.push({
          type: 'engine',
          title: '価値観システムの影',
          analysis: engineShadow
        });
      }

      if (interfaceOS && interfaceOS.strength > 0.3) {
        const interfaceShadow = this.shadowAnalyzer.analyzeShadow(interfaceOS, Math.round(interfaceOS.strength * 100));
        shadowAnalyses.push({
          type: 'interface',
          title: '社会的システムの影',
          analysis: interfaceShadow
        });
      }

      if (safeModeOS && safeModeOS.strength > 0.3) {
        const safeModeShadow = this.shadowAnalyzer.analyzeShadow(safeModeOS, Math.round(safeModeOS.strength * 100));
        shadowAnalyses.push({
          type: 'safemode',
          title: '防御システムの影',
          analysis: safeModeShadow
        });
      }

      // 統合シャドウ分析
      const integratedShadow = this.shadowAnalyzer.analyzeIntegratedShadow(engineOS, interfaceOS, safeModeOS);

      // HTMLの生成
      const shadowHTML = this.generateShadowAnalysisHTML(shadowAnalyses, integratedShadow);
      shadowContent.innerHTML = shadowHTML;

    } catch (error) {
      console.error("❌ [Phase4] シャドウ分析エラー:", error);
      shadowContent.innerHTML = `<div class="error">シャドウ分析中にエラーが発生しました。</div>`;
    }
  }

  /**
   * 自己挑戦質問の初期化
   */
  async initializeChallengeQuestions(analysisResult) {
    console.log("🤔 [Phase4] 挑戦的質問を初期化中...");

    const challengeContent = document.getElementById('challenge-questions-content');
    if (!challengeContent) return;

    try {
      // 批判的分析の実行
      const criticalAnalysis = this.criticalThinkingEngine.generateCriticalAnalysis(analysisResult);

      // HTMLの生成
      const challengeHTML = this.generateChallengeQuestionsHTML(criticalAnalysis);
      challengeContent.innerHTML = challengeHTML;

    } catch (error) {
      console.error("❌ [Phase4] 挑戦的質問エラー:", error);
      challengeContent.innerHTML = `<div class="error">質問生成中にエラーが発生しました。</div>`;
    }
  }

  /**
   * ツールの限界説明の初期化
   */
  async initializeToolLimitations() {
    console.log("⚠️ [Phase4] ツール限界説明を初期化中...");

    const limitationsContent = document.getElementById('limitations-content');
    if (!limitationsContent) return;

    try {
      const limitations = this.criticalThinkingEngine._highlightToolLimitations(this.analysisResult);
      const limitationsHTML = this.generateToolLimitationsHTML(limitations);
      limitationsContent.innerHTML = limitationsHTML;

    } catch (error) {
      console.error("❌ [Phase4] ツール限界説明エラー:", error);
      limitationsContent.innerHTML = `<div class="error">限界説明の生成中にエラーが発生しました。</div>`;
    }
  }

  /**
   * シャドウ分析HTMLの生成
   */
  generateShadowAnalysisHTML(shadowAnalyses, integratedShadow) {
    let html = '';

    // 個別OSのシャドウ分析
    shadowAnalyses.forEach(({ type, title, analysis }) => {
      html += `
        <div class="shadow-os-analysis">
          <h4>${title}</h4>
          <div class="shadow-aspects">
            <div class="shadow-aspect">
              <h5>🌑 影の側面</h5>
              <p>${analysis.shadowAspects.primary_shadow}</p>
              <p class="shadow-intensity">強度: ${analysis.shadowAspects.intensity_level}</p>
            </div>
            
            <div class="shadow-questions">
              <h5>🔍 自己探求質問</h5>
              ${analysis.selfInquiryQuestions.map(q => `
                <div class="inquiry-question">
                  <p class="question-text">${q.question}</p>
                  <p class="question-purpose">目的: ${q.purpose}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="integration-guidance">
              <h5>🔗 統合のガイダンス</h5>
              <p>${analysis.integrationGuidance.shadow_acceptance.message}</p>
              <div class="practical-steps">
                <h6>実践的ステップ：</h6>
                <ol>
                  ${analysis.integrationGuidance.practical_steps.map(step => 
                    `<li><strong>${step.action}:</strong> ${step.description}</li>`
                  ).join('')}
                </ol>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // 統合的メッセージ
    if (integratedShadow) {
      html += `
        <div class="integrated-shadow-guidance">
          <h4>🌈 統合的な視点</h4>
          <p>${integratedShadow.holistic_guidance.core_message}</p>
          <p class="integration-approach">${integratedShadow.holistic_guidance.integration_approach}</p>
          <p class="practical-wisdom">${integratedShadow.holistic_guidance.practical_wisdom}</p>
        </div>
      `;
    }

    return html;
  }

  /**
   * 挑戦的質問HTMLの生成
   */
  generateChallengeQuestionsHTML(criticalAnalysis) {
    let html = '';

    // 各OSに対する質問
    Object.entries(criticalAnalysis.self_challenge_questions).forEach(([osType, questions]) => {
      if (questions.length > 0) {
        const osTitle = {
          engine_os: '価値観システム',
          interface_os: '社会的システム',
          safemode_os: '防御システム',
          integrated: '統合的視点'
        }[osType] || osType;

        html += `
          <div class="challenge-os-section">
            <h4>${osTitle}への挑戦的質問</h4>
            ${questions.map(q => `
              <div class="challenge-question">
                <div class="question-header">
                  <span class="intensity-badge intensity-${q.intensity}">${q.intensity}</span>
                  <span class="question-purpose">${q.purpose}</span>
                </div>
                <p class="question-text">${q.question}</p>
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    // バイアス認識
    if (criticalAnalysis.bias_awareness) {
      html += `
        <div class="bias-awareness-section">
          <h4>🧠 認知バイアスへの注意</h4>
          ${Object.entries(criticalAnalysis.bias_awareness).map(([biasType, biasInfo]) => `
            <div class="bias-item">
              <h5>${biasInfo.name}</h5>
              <p>${biasInfo.description}</p>
              <div class="bias-questions">
                ${biasInfo.detection_questions.map(q => 
                  `<p class="bias-question">• ${q}</p>`
                ).join('')}
              </div>
              <p class="mitigation-advice"><strong>対策:</strong> ${biasInfo.mitigation_advice}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    return html;
  }

  /**
   * ツール限界HTMLの生成
   */
  generateToolLimitationsHTML(limitations) {
    let html = '';

    Object.entries(limitations).forEach(([category, categoryInfo]) => {
      html += `
        <div class="limitation-category">
          <h4>${categoryInfo.title}</h4>
          <ul>
            ${categoryInfo.points.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    return html;
  }

  /**
   * 批判的思考タブの初期化
   */
  initializeCriticalTabs() {
    const tabs = this.container.querySelectorAll('.critical-tab');
    const contents = this.container.querySelectorAll('.critical-tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // タブの切り替え
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetContent = this.container.querySelector(`#${targetTab}-tab`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  /**
   * 批判的思考機能のエラー表示
   */
  displayCriticalThinkingError() {
    const section = this.container.querySelector('#critical-thinking-section');
    if (section) {
      section.innerHTML = `
        <div class="critical-thinking-error">
          <h3>⚠️ 批判的思考機能の読み込みエラー</h3>
          <p>Phase 4機能の初期化中にエラーが発生しました。ページを再読み込みしてください。</p>
        </div>
      `;
    }
  }

  /**
   * Phase 5.3: 実践行動ブリッジの初期化
   */
  async initializeActionBridge() {
    console.log("🌉 [ActionBridge] Phase 5.3 実践行動ブリッジ初期化開始");

    try {
      // ActionBridgeViewが利用可能かチェック
      if (typeof ActionBridgeView === 'undefined') {
        console.warn("⚠️ [ActionBridge] ActionBridgeView クラスが利用できません");
        return;
      }

      // コンテナの存在確認
      const container = document.getElementById('action-bridge-section');
      if (!container) {
        console.warn("⚠️ [ActionBridge] action-bridge-section コンテナが見つかりません");
        return;
      }

      // ActionBridgeView専用のコンテナを作成
      const actionBridgeContainer = document.createElement('div');
      actionBridgeContainer.id = 'action-bridge-container';
      actionBridgeContainer.className = 'action-bridge-main-container';
      container.appendChild(actionBridgeContainer);

      // OS分析データの準備
      const osAnalysisData = await this.prepareOSAnalysisData();
      if (!osAnalysisData) {
        console.warn("⚠️ [ActionBridge] OS分析データが利用できません");
        this.renderActionBridgeError("OS分析データが不足しています");
        return;
      }

      // ActionBridgeViewインスタンスの作成と初期化
      this.actionBridgeView = new ActionBridgeView('action-bridge-container');
      await this.actionBridgeView.render(osAnalysisData);

      console.log("✅ [ActionBridge] Phase 5.3 実践行動ブリッジ初期化完了");

    } catch (error) {
      console.error("❌ [ActionBridge] 初期化エラー:", error);
      this.renderActionBridgeError("実践行動ブリッジの初期化に失敗しました");
    }
  }

  /**
   * OS分析データの準備（ActionBridge用）
   */
  async prepareOSAnalysisData() {
    try {
      const { engineOS, interfaceOS, safeModeOS } = await this.extractTripleOSData(this.analysisResult);

      if (!engineOS && !interfaceOS && !safeModeOS) {
        console.warn("⚠️ [ActionBridge] 有効なOS分析データがありません");
        return null;
      }

      const osAnalysisData = {
        engine_score: engineOS?.score || 0.5,
        interface_score: interfaceOS?.score || 0.5,
        safemode_score: safeModeOS?.score || 0.5,
        engineOS,
        interfaceOS,
        safeModeOS,
        timestamp: new Date().toISOString(),
        source: 'TripleOSResultsView'
      };

      console.log("📊 [ActionBridge] OS分析データ準備完了:", {
        engine: osAnalysisData.engine_score,
        interface: osAnalysisData.interface_score,
        safemode: osAnalysisData.safemode_score
      });

      return osAnalysisData;

    } catch (error) {
      console.error("❌ [ActionBridge] OS分析データ準備エラー:", error);
      return null;
    }
  }

  /**
   * ActionBridgeエラー表示
   */
  renderActionBridgeError(message) {
    const container = document.getElementById('action-bridge-section');
    if (container) {
      container.innerHTML = `
        <div class="action-bridge-error">
          <div class="error-icon">⚠️</div>
          <h3>実践行動ブリッジ</h3>
          <p class="error-message">${message}</p>
          <p class="error-detail">このセクションは開発中です。基本的な分析結果は上記で確認できます。</p>
        </div>
      `;
    }
  }
}
