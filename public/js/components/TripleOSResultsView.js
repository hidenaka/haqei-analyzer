/*
 * TripleOSResultsView.js
 * 
 * トリプルOSシステム（エンジンOS、インターフェースOS、セーフモードOS）の
 * 分析結果を表示するコンポーネント
 * 
 * 分人思想（bunenjin philosophy）に基づく次世代パーソナリティ分析システム
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
  // Supports bunenjin philosophy by ensuring robust access to all three personality layers
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

    // Data enrichment: Ensure consistent property names for bunenjin display
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

  // 🆘 Emergency data recovery for bunenjin philosophy implementation - Phase 3強化版
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

  // Validate the quality of extracted OS data for bunenjin analysis
  validateExtractedOSData(osData) {
    const { engineOS, interfaceOS, safeModeOS } = osData;
    let score = 0;
    let maxScore = 9; // 3 OS types × 3 essential properties each

    // Check Engine OS (エンジンOS：本質的自己)
    if (engineOS) {
      if (engineOS.osName || engineOS.name) score++;
      if (engineOS.hexagramId || engineOS.osId) score++;
      if (engineOS.strength || engineOS.score || engineOS.confidence) score++;
    }

    // Check Interface OS (インターフェースOS：対人的自己)
    if (interfaceOS) {
      if (interfaceOS.osName || interfaceOS.name) score++;
      if (interfaceOS.hexagramId || interfaceOS.osId) score++;
      if (interfaceOS.matchScore || interfaceOS.score || interfaceOS.confidence) score++;
    }

    // Check SafeMode OS (セーフモードOS：防護的自己)
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

    // 🔧 Enhanced data extraction with multiple fallbacks for bunenjin architecture compatibility
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
      
      // Enhanced error message for bunenjin philosophy context
      this.container.innerHTML = `
        <div class="error" style="padding: 2rem; text-align: center; color: #ff6b6b; background: rgba(255,107,107,0.1); border-radius: 8px; margin: 1rem;">
          <h3>トリプルOS分析データが不完全です</h3>
          <p>エンジンOS、インターフェースOS、セーフモードOSのデータを読み込めませんでした。</p>
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
                      <canvas id="interactive-radar-chart" style="max-width: 100%; max-height: 400px; width: 400px; height: 400px;"></canvas>
                  </div>
              </section>
  
              <!-- トリプルOS構成による3つのパーソナリティ・オペレーティングシステムセクション -->
              <section class="interactive-os-section triple-os-section">
                  <div class="triple-os-concept-header">
                      <h2 class="section-title">🎭 あなたの心に宿る3つの『パーソナリティOS』</h2>
                      <p class="section-subtitle">古来から続く易経の知恵を現代に蘇らせ、あなたの多面性を科学的に解析。本音・社会的な顔・防御時の姿、それぞれがどのように調和し、あなたらしさを創り上げているかを明らかにします。</p>
                      <p class="triple-os-philosophy">
                          HaQei独自の「トリプルOS理論」によると、私たちには状況に応じて稼働する3つのパーソナリティ・オペレーティングシステムがあります。<br>
                          「真の自分探し」よりも、それぞれのパーソナリティOSを理解し、最適な選択をすることが戦略的人生ナビゲーションの鍵です。
                      </p>
                  </div>
                  <div class="interactive-os-cards triple-os-cards">
                      <div class="interactive-os-card" data-os="engine" data-hexagram="${
                        engineOS.hexagramId
                      }">
                          <div class="os-card-header">
                              <div class="os-icon">🔧</div>
                              <div class="os-info triple-os-info">
                                  <h3>🔥 エンジンOS - あなたの核となる本質的自己</h3>
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
                                      <small>🌟 あなたが最も自然体でいられる時に稼働する、人生の羅針盤となるパーソナリティOSです。一人でいる時や心から信頼できる人といる時に、この本質的な価値観が自然に現れます。人生の重要な決断の基準となり、あなたらしさの源泉です。</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-score-group">
                                      <div class="score-container triple-os-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🔥 エンジンOSの影響度</span>
                                              <div class="score-help-icon" title="このエンジンOSの価値観が、あなたの人生全体にどの程度の影響を与えているかを示します。数値が高いほど価値観の軸がしっかりしています。">❓</div>
                                          </div>
                                          <div class="score-explanation triple-os-explanation">
                                              <p>この価値観の<strong>明確度は${Math.round(
                                                engineOS.strength * 100
                                              )}%</strong>です。あなたの価値観の軸としての強さを表します</p>
                                              <div class="triple-os-insight">
                                                  <small>💡 数値が高いほど自分軸がしっかりしており、迷いの少ない選択ができます</small>
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
                              <div class="os-info triple-os-info">
                                  <h3>🌐 インターフェースOS - 他者との関わり方</h3>
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
                                      <small>🎭 社会の舞台であなたの魅力を表現する、コミュニケーションの専門OSです。職場、友人関係、初対面の人との交流など、様々な社会的場面であなたの内なる価値観を適切に翻訳し、相手に伝える役割を担います。エンジンOSとの調和度が高いほど、自然で魅力的な人間関係を築けます。</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-score-group">
                                      <div class="score-container triple-os-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🌐 インターフェースOSの表現頻度</span>
                                              <div class="score-help-icon" title="エンジンOSの価値観が、社会的な場面でこのスタイルとして表現される頻度を示します。エンジンOSとインターフェースOSの一致度とも言えます。">❓</div>
                                          </div>
                                          <div class="score-explanation triple-os-explanation">
                                              <p>社会的な場面では複数のインターフェースOSを使い分けており、この組み合わせは<strong>一例</strong>です（${Math.round(
                                                interfaceOS.matchScore
                                              )}%の稼働率）</p>
                                              <div class="triple-os-insight">
                                                  <small>💡 ${this.getInterfaceCombinationInsight(interfaceOS.matchScore)}</small>
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
                              <div class="os-info triple-os-info">
                                  <h3>🛡️ セーフモードOS - ストレス時の対処法</h3>
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
                                      <small>🛡️ あなたの心を守る賢い防衛システムです。困難、挫折、過度のストレスに直面した時に自動的に起動し、心の安全を確保します。このOSも大切なあなたの一部であり、適切にコントロールできれば強力な味方となります。エンジンOSとの差が大きいほど、周囲は「いつもと違う」と感じ、差が小さいほど「安定している」と評価されます。</small>
                                  </div>
                              </div>
                              <div class="os-stats">
                                  <div class="os-score-group">
                                      <div class="score-container triple-os-score-container">
                                          <div class="score-header">
                                              <span class="score-title">🛡️ セーフモードOSの発動頻度</span>
                                              <div class="score-help-icon" title="困難やストレスに直面した時に、このセーフモードOSがどの程度稼働するかを示します。このパーソナリティOSも大切な自分の一部です。">❓</div>
                                          </div>
                                          <div class="score-explanation triple-os-explanation">
                                              <p>ストレスを感じた時、<strong>${Math.round(
                                                safeModeOS.matchScore
                                              )}%の確率</strong>でこのセーフモードOSが稼働します</p>
                                              <div class="triple-os-insight">
                                                  <small>💡 ${this.getSafeModeGapInsight(engineOS.strength * 100, safeModeOS.matchScore)}</small>
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
          strengths: `💫 分人思想の一般的な特性を表示しています`,
          challenges: `💫 一般的な人間の傾向を表示しています`,
          coreDrive: `💫 分人思想の基本的な考え方を表示しています`
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

      // engine-interfaceディレクトリから詳細なデータを読み込む
      const compatibilityData = await this.loadEngineInterfaceCompatibilityData(
        engineOS.hexagramId,
        interfaceOS.hexagramId
      );

      if (compatibilityData && compatibilityData.interface_combinations) {
        const combination = compatibilityData.interface_combinations.find(
          c => c.interface_id === interfaceOS.hexagramId
        );

        if (combination) {
          const typeColor = this.getCombinationTypeColor(combination.type);
          const typeIcon = this.getCombinationTypeIcon(combination.type);

          compatibilityContent.innerHTML = `
                      <div class="bunenjin-compatibility-result">
                          <div class="bunenjin-harmony-header">
                              <div class="harmony-type-badge ${typeColor}">
                                  <span class="harmony-icon">${typeIcon}</span>
                                  <span class="harmony-label">${combination.type}</span>
                              </div>
                              <div class="compatibility-score">${Math.round(
                                combination.overall_score * 100
                              )}%</div>
                          </div>
                          
                          <div class="bunenjin-relationship-explanation">
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
                      <div class="bunenjin-compatibility-result">
                          <div class="bunenjin-harmony-header">
                              <div class="harmony-type-badge harmony-error">
                                  <span class="harmony-icon">❌</span>
                                  <span class="harmony-label">データ読み込み失敗</span>
                              </div>
                              <div class="compatibility-score">--</div>
                          </div>
                          
                          <div class="bunenjin-relationship-explanation">
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
    } catch (error) {
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

      if (compatibilityData && compatibilityData.safemode_combinations) {
        const combination = compatibilityData.safemode_combinations.find(
          c => c.safemode_id === safeModeOS.hexagramId
        );

        if (combination) {
          const typeColor = this.getCombinationTypeColor(combination.type);
          const typeIcon = this.getCombinationTypeIcon(combination.type);

          compatibilityContent.innerHTML = `
                      <div class="bunenjin-compatibility-result defense-analysis">
                          <div class="bunenjin-protection-header">
                              <div class="protection-type-badge ${typeColor}">
                                  <span class="protection-icon">${typeIcon}</span>
                                  <span class="protection-label">${combination.type}</span>
                              </div>
                              <div class="compatibility-score">${Math.round(
                                combination.overall_score * 100
                              )}%</div>
                          </div>
                          
                          <div class="bunenjin-defense-explanation">
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
                      <div class="bunenjin-compatibility-result defense-analysis">
                          <div class="bunenjin-protection-header">
                              <div class="protection-type-badge protection-error">
                                  <span class="protection-icon">❌</span>
                                  <span class="protection-label">データ読み込み失敗</span>
                              </div>
                              <div class="compatibility-score">--</div>
                          </div>
                          
                          <div class="bunenjin-defense-explanation">
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
    } catch (error) {
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
  calculateBunenjinCompatibility(hexagramId1, hexagramId2, bunenjinType) {
    // 卦IDを8つの基本卦グループに分類
    const getTrigramGroup = (id) => ((id - 1) % 8) + 1;
    const group1 = getTrigramGroup(hexagramId1);
    const group2 = getTrigramGroup(hexagramId2);

    // トリプルOS理論専用の相性マトリックス
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

    // パーソナリティOSタイプ別の調整
    let adjustedScore = baseScore;
    if (bunenjinType === "social") {
      // インターフェースOSは表現の一致性を重視
      adjustedScore = Math.min(baseScore + 8, 98);
    } else if (bunenjinType === "defense") {
      // セーフモードOSは心理的安全性を重視
      adjustedScore = Math.max(baseScore - 15, 20);
    }

    return {
      score: adjustedScore,
      description: this.getBunenjinCompatibilityDescription(adjustedScore, bunenjinType),
    };
  }

  // 旧メソッドも保持（互換性のため）
  calculateSimpleCompatibility(hexagramId1, hexagramId2, type) {
    // トリプルOS理論ベースにリダイレクト
    const bunenjinType = type === "interface" ? "social" : type === "safemode" ? "defense" : "authentic";
    return this.calculateBunenjinCompatibility(hexagramId1, hexagramId2, bunenjinType);
  }

  // トリプルOS理論ベースの相互作用説明を生成
  getBunenjinCompatibilityDescription(score, bunenjinType) {
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
      
      // bunenjin戦略ナビゲーターからの復旧
      if (window.bunenjinStrategyNavigator) {
        const bunenjinData = window.bunenjinStrategyNavigator.getCurrentAnalysis?.();
        if (bunenjinData && (bunenjinData.engineOS || bunenjinData.interfaceOS || bunenjinData.safeModeOS)) {
          console.log('✅ [RECOVERY] bunenjin戦略ナビゲーターから復旧成功');
          return {
            found: true,
            data: {
              engineOS: bunenjinData.engineOS,
              interfaceOS: bunenjinData.interfaceOS,
              safeModeOS: bunenjinData.safeModeOS
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
}
