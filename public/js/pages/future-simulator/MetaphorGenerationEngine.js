/**
 * Metaphor Generation Engine - HaQei Philosophy Implementation
 * Triple OS Architecture: Interface Layer Component
 * 
 * メタファー生成エンジン
 * - 易経的思考によるメタファー創出
 * - 状況の本質を象徴的に表現
 * - HaQei哲学による創造的統合システム
 */

class MetaphorGenerationEngine {
  constructor() {
    this.initialized = false;
    this.metaphorDatabase = null;
    this.generationRules = null;
    this.contextAnalyzer = null;
    
    // HaQei Philosophy: 創造的統合の調和
    this.integrativeHarmony = {
      wisdom_simplicity: true,      // 知恵の簡潔性
      clarity_depth: true,          // 明晰な深層性
      practical_profound: true,     // 実践的な深遠性
      accessible_mystery: true      // 親しみやすい神秘性
    };
    
    // Triple OS Architecture Components
    this.engineOS = null;
    this.interfaceOS = null;
    this.safeMode = null;
    
    this.init();
  }
  
  async init() {
    console.log('🎨 [MetaphorGenerationEngine] 初期化開始 - 易経メタファーシステム');
    
    try {
      // Triple OS Architecture Setup
      this.initializeTripleOS();
      
      // メタファーデータベース初期化
      await this.initializeMetaphorDatabase();
      
      // 生成ルール設定
      await this.setupGenerationRules();
      
      // コンテキスト分析器初期化
      await this.initializeContextAnalyzer();
      
      this.initialized = true;
      console.log('✅ [MetaphorGenerationEngine] メタファーシステム準備完了');
      
    } catch (error) {
      console.error('❌ [MetaphorGenerationEngine] 初期化エラー:', error);
      this.activateSafeMode();
    }
  }
  
  initializeTripleOS() {
    console.log('🔧 [MetaphorGenerationEngine] Triple OS Architecture 初期化');
    
    // Engine OS (Core Metaphor Generation Logic)
    this.engineOS = {
      name: 'Metaphor Engine OS',
      version: '1.0.0',
      philosophy: 'haqei-creative',
      
      async generateMetaphor(situationData, context = {}) {
        try {
          // 状況の本質要素を抽出
          const essenceElements = this.extractEssenceElements(situationData);
          
          // メタファー候補を生成
          const candidates = await this.generateCandidates(essenceElements, context);
          
          // 最適なメタファーを選択
          const selectedMetaphor = this.selectBestMetaphor(candidates, situationData);
          
          // メタファーを詳細化
          const detailedMetaphor = await this.elaborateMetaphor(selectedMetaphor, situationData);
          
          return {
            metaphor: detailedMetaphor,
            essence: essenceElements,
            confidence: this.calculateConfidence(selectedMetaphor, situationData),
            philosophy: 'haqei-metaphor'
          };
          
        } catch (error) {
          console.warn('⚠️ メタファー生成エラー - 基本メタファー使用:', error);
          return this.generateBasicMetaphor(situationData);
        }
      },
      
      extractEssenceElements(situationData) {
        // 状況の本質的要素を抽出
        const elements = {
          energy: this.analyzeEnergy(situationData),
          movement: this.analyzeMovement(situationData),
          relationships: this.analyzeRelationships(situationData),
          transformation: this.analyzeTransformation(situationData),
          timeQuality: this.analyzeTimeQuality(situationData),
          spaceQuality: this.analyzeSpaceQuality(situationData)
        };
        
        return elements;
      },
      
      analyzeEnergy(data) {
        // エネルギーの質を分析
        const keywords = data.keywords || [];
        let energyType = 'balanced';
        let intensity = 0.5;
        
        // エネルギー関連キーワードの分析
        const highEnergyWords = ['激しい', '強い', '急激', '爆発', '燃える', '熱い'];
        const lowEnergyWords = ['静か', '穏やか', '緩やか', '冷静', '落ち着く'];
        const dynamicWords = ['動く', '変化', '流れ', '進む', '発展'];
        const staticWords = ['止まる', '安定', '維持', '保つ', '固定'];
        
        const highCount = keywords.filter(k => highEnergyWords.some(w => k.includes(w))).length;
        const lowCount = keywords.filter(k => lowEnergyWords.some(w => k.includes(w))).length;
        const dynamicCount = keywords.filter(k => dynamicWords.some(w => k.includes(w))).length;
        const staticCount = keywords.filter(k => staticWords.some(w => k.includes(w))).length;
        
        if (highCount > lowCount) {
          energyType = dynamicCount > staticCount ? 'high-dynamic' : 'high-static';
          intensity = Math.min(0.7 + (highCount * 0.1), 1.0);
        } else if (lowCount > highCount) {
          energyType = staticCount > dynamicCount ? 'low-static' : 'low-dynamic';
          intensity = Math.max(0.3 - (lowCount * 0.1), 0.1);
        } else {
          energyType = 'balanced';
        }
        
        return { type: energyType, intensity: intensity };
      },
      
      analyzeMovement(data) {
        // 動きの質を分析
        const movementPatterns = {
          spiral: ['螺旋', '巻く', '回る', '循環'],
          linear: ['直進', '一直線', '真っ直ぐ', '一方向'],
          wave: ['波', '起伏', '上下', '波動'],
          stillness: ['静止', '動かない', '固定', '変わらない']
        };
        
        const keywords = data.keywords || [];
        const movements = {};
        
        Object.entries(movementPatterns).forEach(([pattern, words]) => {
          movements[pattern] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length;
        });
        
        const dominantMovement = Object.entries(movements)
          .reduce((max, [pattern, count]) => 
            count > max.count ? { pattern, count } : max, 
            { pattern: 'balanced', count: 0 }
          );
        
        return {
          type: dominantMovement.pattern,
          intensity: dominantMovement.count / keywords.length,
          direction: this.analyzeDirection(keywords)
        };
      },
      
      analyzeDirection(keywords) {
        const directions = {
          upward: ['上', '昇る', '向上', '成長', '発展'],
          downward: ['下', '降りる', '低下', '減少', '沈む'],
          inward: ['内', '中心', '集中', '内省', '深める'],
          outward: ['外', '拡大', '広がる', '外向', '展開']
        };
        
        const counts = {};
        Object.entries(directions).forEach(([dir, words]) => {
          counts[dir] = keywords.filter(k => words.some(w => k.includes(w))).length;
        });
        
        return Object.entries(counts)
          .reduce((max, [dir, count]) => count > max.count ? { dir, count } : max, 
                  { dir: 'neutral', count: 0 }).dir;
      },
      
      analyzeRelationships(data) {
        // 関係性の質を分析
        const relationshipTypes = {
          harmony: ['調和', '協力', '合意', '一致', '協調'],
          conflict: ['対立', '衝突', '争い', '競争', '摩擦'],
          distance: ['離れる', '距離', '孤立', '分離', '独立'],
          closeness: ['近づく', '親密', '結合', '統合', '融合']
        };
        
        const keywords = data.keywords || [];
        const relationships = {};
        
        Object.entries(relationshipTypes).forEach(([type, words]) => {
          relationships[type] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length / keywords.length;
        });
        
        return relationships;
      },
      
      analyzeTransformation(data) {
        // 変化の質を分析
        const transformationTypes = {
          gradual: ['徐々に', 'ゆっくり', '段階的', '漸進'],
          sudden: ['突然', '急に', '一気に', '瞬間'],
          cyclical: ['循環', '繰り返し', 'サイクル', '周期'],
          irreversible: ['不可逆', '戻らない', '永続', '根本']
        };
        
        const keywords = data.keywords || [];
        const transformations = {};
        
        Object.entries(transformationTypes).forEach(([type, words]) => {
          transformations[type] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length;
        });
        
        const dominantType = Object.entries(transformations)
          .reduce((max, [type, count]) => count > max.count ? { type, count } : max,
                  { type: 'gradual', count: 0 });
        
        return {
          type: dominantType.type,
          intensity: dominantType.count / keywords.length,
          direction: this.getTransformationDirection(data)
        };
      },
      
      getTransformationDirection(data) {
        // 変化の方向性
        const positiveWords = ['良く', '改善', '成長', '発展', '向上'];
        const negativeWords = ['悪く', '悪化', '衰退', '低下', '後退'];
        
        const keywords = data.keywords || [];
        const positiveCount = keywords.filter(k => positiveWords.some(w => k.includes(w))).length;
        const negativeCount = keywords.filter(k => negativeWords.some(w => k.includes(w))).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
      },
      
      analyzeTimeQuality(data) {
        // 時間の質を分析
        const timeQualities = {
          kairos: ['機会', 'タイミング', '時機', '好機'],  // 質的時間
          chronos: ['期限', 'スケジュール', '時間', '期間'], // 量的時間
          eternal: ['永遠', '無限', '恒久', '不変'],
          momentary: ['瞬間', '一時', '短期', '刹那']
        };
        
        const keywords = data.keywords || [];
        const qualities = {};
        
        Object.entries(timeQualities).forEach(([quality, words]) => {
          qualities[quality] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length;
        });
        
        return qualities;
      },
      
      analyzeSpaceQuality(data) {
        // 空間の質を分析
        const spaceQualities = {
          expansive: ['広い', '大きい', '拡大', '無限'],
          intimate: ['狭い', '小さい', '密接', '親密'],
          structured: ['整理', '秩序', '構造', '体系'],
          fluid: ['流動', '柔軟', '変化', '適応']
        };
        
        const keywords = data.keywords || [];
        const qualities = {};
        
        Object.entries(spaceQualities).forEach(([quality, words]) => {
          qualities[quality] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length;
        });
        
        return qualities;
      },
      
      async generateCandidates(essenceElements, context) {
        // メタファー候補を生成
        const candidates = [];
        
        // 自然界のメタファー
        candidates.push(...this.generateNatureMetaphors(essenceElements));
        
        // 人間活動のメタファー  
        candidates.push(...this.generateHumanActivityMetaphors(essenceElements));
        
        // 抽象概念のメタファー
        candidates.push(...this.generateAbstractMetaphors(essenceElements));
        
        // 易経的メタファー
        candidates.push(...this.generateIChingMetaphors(essenceElements));
        
        return candidates;
      },
      
      generateNatureMetaphors(elements) {
        const metaphors = [];
        
        // エネルギーレベルによる自然メタファー
        const energy = elements.energy;
        
        if (energy.type === 'high-dynamic') {
          metaphors.push({
            category: 'nature',
            type: 'weather',
            metaphor: '嵐の中を進む船',
            essence: 'turbulent_progress',
            imagery: '激しい風と波の中でも目的地に向かう',
            wisdom: '困難な状況も進歩の機会となる'
          });
          
          metaphors.push({
            category: 'nature',
            type: 'fire',
            metaphor: '山火事から生まれる新緑',
            essence: 'destructive_renewal',
            imagery: '古いものが燃え尽きた後に新しい生命が芽吹く',
            wisdom: '破壊と創造は表裏一体'
          });
        }
        
        if (energy.type === 'low-static') {
          metaphors.push({
            category: 'nature',
            type: 'earth',
            metaphor: '深い地層で育つ鉱物',
            essence: 'slow_formation',
            imagery: '長い時間をかけて美しい結晶が形成される',
            wisdom: '時間をかけることで真の価値が生まれる'
          });
          
          metaphors.push({
            category: 'nature',
            type: 'water',
            metaphor: '静かな深い湖',
            essence: 'profound_stillness',
            imagery: '表面は穏やかでも深部には豊かな生命がある',
            wisdom: '静寂の中に無限の可能性が宿る'
          });
        }
        
        // 動きのパターンによる追加
        const movement = elements.movement;
        
        if (movement.type === 'spiral') {
          metaphors.push({
            category: 'nature',
            type: 'cosmic',
            metaphor: '銀河の螺旋腕',
            essence: 'cosmic_evolution',
            imagery: '巨大な渦の中で星々が生まれ育つ',
            wisdom: '成長は螺旋状に進む'
          });
        }
        
        if (movement.type === 'wave') {
          metaphors.push({
            category: 'nature',
            type: 'ocean',
            metaphor: '潮の満ち引き',
            essence: 'natural_rhythm',
            imagery: '絶え間ない波の動きが海岸を形作る',
            wisdom: '自然のリズムに従うことの重要性'
          });
        }
        
        return metaphors;
      },
      
      generateHumanActivityMetaphors(elements) {
        const metaphors = [];
        
        // 関係性による人間活動メタファー
        const relationships = elements.relationships;
        
        if (relationships.harmony > 0.6) {
          metaphors.push({
            category: 'human',
            type: 'music',
            metaphor: 'オーケストラの演奏',
            essence: 'harmonious_cooperation',
            imagery: '異なる楽器が一つの美しい音楽を創造する',
            wisdom: '調和は多様性の中から生まれる'
          });
        }
        
        if (relationships.conflict > 0.6) {
          metaphors.push({
            category: 'human',
            type: 'craft',
            metaphor: '鍛冶屋の鉄打ち',
            essence: 'forging_through_conflict',
            imagery: '激しい打撃によって金属が美しい形に変わる',
            wisdom: '対立は成長の機会'
          });
        }
        
        // 変化のパターンによる追加
        const transformation = elements.transformation;
        
        if (transformation.type === 'gradual') {
          metaphors.push({
            category: 'human',
            type: 'art',
            metaphor: '陶芸家の作品づくり',
            essence: 'patient_shaping',
            imagery: 'ろくろの上で少しずつ形を整えていく',
            wisdom: '忍耐強い努力が美を生み出す'
          });
        }
        
        if (transformation.type === 'sudden') {
          metaphors.push({
            category: 'human',
            type: 'discovery',
            metaphor: '発明家のひらめき',
            essence: 'breakthrough_moment',
            imagery: '長い試行錯誤の末に突然解決策が見える',
            wisdom: '準備された心に洞察が訪れる'
          });
        }
        
        return metaphors;
      },
      
      generateAbstractMetaphors(elements) {
        const metaphors = [];
        
        // 時間の質による抽象メタファー
        const timeQuality = elements.timeQuality;
        
        if (timeQuality.kairos > timeQuality.chronos) {
          metaphors.push({
            category: 'abstract',
            type: 'opportunity',
            metaphor: '扉が開く瞬間',
            essence: 'perfect_timing',
            imagery: '無数の扉の中で一つだけが光って開かれる',
            wisdom: 'タイミングがすべてを決める'
          });
        }
        
        if (timeQuality.eternal > 0.3) {
          metaphors.push({
            category: 'abstract',
            type: 'cycle',
            metaphor: '永遠に回る円環',
            essence: 'eternal_return',
            imagery: '始まりと終わりが一つになった完全な円',
            wisdom: 'すべては永遠の循環の中にある'
          });
        }
        
        // 空間の質による追加
        const spaceQuality = elements.spaceQuality;
        
        if (spaceQuality.expansive > spaceQuality.intimate) {
          metaphors.push({
            category: 'abstract',
            type: 'horizon',
            metaphor: '地平線の彼方',
            essence: 'infinite_possibility',
            imagery: 'どこまでも続く広大な景色',
            wisdom: '可能性は無限に広がっている'
          });
        }
        
        if (spaceQuality.intimate > spaceQuality.expansive) {
          metaphors.push({
            category: 'abstract',
            type: 'essence',
            metaphor: '種の中の大樹',
            essence: 'concentrated_potential',
            imagery: '小さな種に巨大な木の可能性が込められている',
            wisdom: '真の力は本質に集約される'
          });
        }
        
        return metaphors;
      },
      
      generateIChingMetaphors(elements) {
        const metaphors = [];
        
        // 易経の基本概念によるメタファー
        
        // 陰陽の概念
        metaphors.push({
          category: 'iching',
          type: 'yinyang',
          metaphor: '陰陽の太極図',
          essence: 'dynamic_balance',
          imagery: '対立する力が完璧な調和を保ちながら回転する',
          wisdom: '矛盾する要素の統合が真の調和を生む'
        });
        
        // 五行の概念
        if (elements.energy.type === 'high-dynamic') {
          metaphors.push({
            category: 'iching',
            type: 'five_elements',
            metaphor: '火が木を助け土を生む',
            essence: 'supportive_transformation',
            imagery: '要素同士が互いを支え合いながら変化する',
            wisdom: '相互支援により大きな力が生まれる'
          });
        }
        
        // 八卦の概念
        metaphors.push({
          category: 'iching',
          type: 'bagua',
          metaphor: '八方位の羅針盤',
          essence: 'directional_wisdom',
          imagery: 'あらゆる方向への可能性を示す神聖な図形',
          wisdom: 'すべての方向に道がある'
        });
        
        return metaphors;
      },
      
      selectBestMetaphor(candidates, situationData) {
        if (candidates.length === 0) {
          return this.getDefaultMetaphor();
        }
        
        // スコアリングによる最適メタファー選択
        const scoredCandidates = candidates.map(metaphor => ({
          ...metaphor,
          score: this.scoreMetaphor(metaphor, situationData)
        }));
        
        // 最高スコアのメタファーを選択
        return scoredCandidates.reduce((best, current) => 
          current.score > best.score ? current : best
        );
      },
      
      scoreMetaphor(metaphor, situationData) {
        let score = 0.5; // ベーススコア
        
        // カテゴリー適合性
        if (metaphor.category === 'nature' && situationData.naturalAffinity > 0.6) {
          score += 0.2;
        }
        
        if (metaphor.category === 'iching' && situationData.philosophicalDepth > 0.7) {
          score += 0.3;
        }
        
        // エッセンス適合性
        const keywords = situationData.keywords || [];
        const metaphorWords = metaphor.imagery.split(/\s+/);
        const commonWords = keywords.filter(k => 
          metaphorWords.some(w => w.includes(k) || k.includes(w))
        );
        
        score += commonWords.length * 0.1;
        
        // HaQei Philosophy: 統合的調和を価値として加点
        if (metaphor.essence.includes('integration') || metaphor.essence.includes('harmony')) {
          score += 0.15;
        }
        
        return Math.min(score, 1.0);
      },
      
      async elaborateMetaphor(selectedMetaphor, situationData) {
        // 選択されたメタファーを詳細化
        const elaborated = {
          ...selectedMetaphor,
          
          // 状況への具体的適用
          applicationToSituation: this.applyToSituation(selectedMetaphor, situationData),
          
          // 行動指針
          actionGuidance: this.generateActionGuidance(selectedMetaphor, situationData),
          
          // 時間的展開
          temporalUnfolding: this.generateTemporalUnfolding(selectedMetaphor),
          
          // 深層メッセージ
          deepMessage: this.extractDeepMessage(selectedMetaphor, situationData),
          
          // 補完的視点
          alternativePerspectives: this.generateAlternativePerspectives(selectedMetaphor)
        };
        
        return elaborated;
      },
      
      applyToSituation(metaphor, situationData) {
        // メタファーを具体的状況に適用
        const application = {
          currentPhase: this.identifyCurrentPhase(metaphor, situationData),
          keyElements: this.mapKeyElements(metaphor, situationData),
          dynamics: this.describeDynamics(metaphor, situationData)
        };
        
        return application;
      },
      
      generateActionGuidance(metaphor, situationData) {
        // メタファーから行動指針を生成
        const guidance = [];
        
        switch (metaphor.essence) {
          case 'turbulent_progress':
            guidance.push('嵐の中でも舵を握り続ける');
            guidance.push('一時的な避難港を見つける');
            guidance.push('天候の変化を注意深く観察する');
            break;
            
          case 'slow_formation':
            guidance.push('焦らずに時間をかける');
            guidance.push('小さな変化を大切にする');
            guidance.push('内側での成長に注目する');
            break;
            
          case 'harmonious_cooperation':
            guidance.push('他者との調和を重視する');
            guidance.push('全体の利益を考える');
            guidance.push('自分の役割を明確にする');
            break;
            
          default:
            guidance.push('メタファーの智慧を日常に活かす');
            guidance.push('象徴的意味を実践的行動に変換する');
        }
        
        return guidance;
      },
      
      generateTemporalUnfolding(metaphor) {
        // メタファーの時間的展開
        return {
          past: `${metaphor.metaphor}が形成された背景`,
          present: `現在の${metaphor.metaphor}の状態`,
          future: `${metaphor.metaphor}が向かう方向`
        };
      },
      
      extractDeepMessage(metaphor, situationData) {
        // 深層メッセージの抽出
        const deepMessages = {
          'turbulent_progress': '困難な状況こそが真の成長をもたらす',
          'slow_formation': '時間は最も偉大な創造者である',
          'harmonious_cooperation': '個の完成は全体の調和の中にある',
          'dynamic_balance': '調和の統合こそが真の智慧'
        };
        
        return deepMessages[metaphor.essence] || 
               `${metaphor.metaphor}は、生きることの根源的意味を教えてくれる`;
      },
      
      generateAlternativePerspectives(metaphor) {
        // 補完的視点の生成
        return [
          `${metaphor.metaphor}を逆の角度から見ると...`,
          `もし${metaphor.metaphor}が人間だったら...`,
          `${metaphor.metaphor}の隠れた側面は...`
        ];
      },
      
      generateBasicMetaphor(situationData) {
        // エラー時の基本メタファー
        return {
          category: 'basic',
          type: 'journey',
          metaphor: '人生の旅路',
          essence: 'universal_journey',
          imagery: '山あり谷ありの道を一歩ずつ進んでいく',
          wisdom: 'すべての体験が成長の糧となる',
          confidence: 0.5,
          philosophy: 'haqei-basic'
        };
      },
      
      getDefaultMetaphor() {
        // デフォルトメタファー
        return {
          category: 'default',
          type: 'river',
          metaphor: '大河の流れ',
          essence: 'natural_flow',
          imagery: '源流から海へと向かう壮大な旅',
          wisdom: '自然の流れに身を任せることの大切さ'
        };
      }
    };
    
    // Interface OS (User Presentation Layer)
    this.interfaceOS = {
      name: 'Metaphor Interface OS',
      
      formatMetaphorResult(result) {
        return {
          display: {
            title: result.metaphor.metaphor,
            category: this.formatCategory(result.metaphor.category),
            imagery: result.metaphor.imagery,
            wisdom: result.metaphor.wisdom,
            essence: result.metaphor.essence,
            elaboration: this.formatElaboration(result.metaphor)
          },
          confidence: result.confidence,
          philosophy: result.philosophy
        };
      },
      
      formatCategory(category) {
        const categoryNames = {
          nature: '🌿 自然界',
          human: '👥 人間活動',
          abstract: '🎭 抽象概念',
          iching: '☯️ 易経',
          basic: '🛤️ 基本',
          default: '🌊 デフォルト'
        };
        
        return categoryNames[category] || category;
      },
      
      formatElaboration(metaphor) {
        if (!metaphor.applicationToSituation) {
          return null;
        }
        
        return {
          application: {
            title: '現在の状況への適用',
            content: metaphor.applicationToSituation
          },
          guidance: {
            title: '行動指針',
            actions: metaphor.actionGuidance || []
          },
          temporal: {
            title: '時間的展開',
            content: metaphor.temporalUnfolding
          },
          deepMessage: {
            title: '深層メッセージ',
            content: metaphor.deepMessage
          }
        };
      }
    };
    
    // Safe Mode OS (Emergency Fallback)
    this.safeMode = {
      name: 'Metaphor Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ [MetaphorGenerationEngine] Safe Mode 起動');
        this.active = true;
        
        return {
          basicMetaphors: true,
          fullElaboration: false,
          philosophy: 'haqei-safe'
        };
      },
      
      generateSafeMetaphor(situationData) {
        // 安全な基本メタファー
        const safeMetaphors = [
          {
            metaphor: '季節の変化',
            imagery: '春夏秋冬の自然なサイクル',
            wisdom: 'すべてには適切な時がある'
          },
          {
            metaphor: '木の成長',
            imagery: '種から大樹へと育つ過程',
            wisdom: '根を深く張ることの大切さ'
          },
          {
            metaphor: '川の流れ',
            imagery: '山から海への水の旅',
            wisdom: '障害を乗り越えて進む力'
          }
        ];
        
        const selected = safeMetaphors[Math.floor(Math.random() * safeMetaphors.length)];
        
        return {
          metaphor: selected,
          confidence: 0.6,
          philosophy: 'haqei-safe'
        };
      }
    };
    
    console.log('✅ [MetaphorGenerationEngine] Triple OS Architecture 準備完了');
  }
  
  async initializeMetaphorDatabase() {
    console.log('📚 [MetaphorGenerationEngine] メタファーデータベース初期化');
    
    this.metaphorDatabase = {
      naturalElements: this.createNaturalElementsDB(),
      humanActivities: this.createHumanActivitiesDB(),
      abstractConcepts: this.createAbstractConceptsDB(),
      ichingSymbols: this.createIChingSymbolsDB(),
      culturalArchetypes: this.createCulturalArchetypesDB()
    };
  }
  
  createNaturalElementsDB() {
    return {
      weather: ['嵐', '雨', '虹', '風', '雪', '雷', '霧', '雲'],
      water: ['川', '海', '湖', '滝', '泉', '波', '潮', '氷'],
      earth: ['山', '谷', '岩', '土', '砂', '洞窟', '丘', '平原'],
      fire: ['炎', '太陽', '星', '稲妻', '光', '熱', '燃焼', '灯'],
      plants: ['木', '花', '草', '森', '葉', '根', '種', '実'],
      animals: ['鳥', '魚', '獣', '虫', '蝶', '鷹', '亀', '龍']
    };
  }
  
  createHumanActivitiesDB() {
    return {
      crafts: ['陶芸', '織物', '鍛冶', '木工', '絵画', '彫刻'],
      music: ['演奏', '合唱', '作曲', 'ハーモニー', 'リズム', 'メロディー'],
      sports: ['登山', '航海', '競走', '格闘', '舞踊', '体操'],
      learning: ['読書', '研究', '発見', '実験', '教育', '瞑想'],
      social: ['会話', '協力', '競争', '支援', '指導', '従順']
    };
  }
  
  createAbstractConceptsDB() {
    return {
      time: ['永遠', '瞬間', '循環', '線形', '過去', '未来', '現在'],
      space: ['無限', '境界', '中心', '周縁', '上下', '内外', '遠近'],
      relation: ['統一', '分離', '調和', '対立', '包含', '排除', '平衡'],
      change: ['進化', '革命', '成長', '衰退', '変身', '復活', '循環']
    };
  }
  
  createIChingSymbolsDB() {
    return {
      trigrams: ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'],
      concepts: ['陰陽', '太極', '無極', '道', '德', '気', '理', '象'],
      patterns: ['螺旋', '円環', '波動', '脈動', '共鳴', '反響', '循環']
    };
  }
  
  createCulturalArchetypesDB() {
    return {
      roles: ['賢者', '戦士', '治療者', '創造者', '案内者', '保護者'],
      journeys: ['冒険', '帰還', '探求', '試練', '変身', '覚醒'],
      relationships: ['師弟', '友情', '恋愛', '親子', '兄弟', '敵対']
    };
  }
  
  async setupGenerationRules() {
    console.log('📋 [MetaphorGenerationEngine] 生成ルール設定');
    
    this.generationRules = {
      contextMapping: {
        emotional: {
          anger: ['fire', 'thunder', 'storm'],
          sadness: ['water', 'autumn', 'descent'],
          joy: ['light', 'spring', 'flight'],
          fear: ['darkness', 'cave', 'maze'],
          love: ['warmth', 'garden', 'embrace']
        },
        
        situational: {
          beginning: ['dawn', 'seed', 'birth'],
          progress: ['journey', 'growth', 'building'],
          obstacle: ['mountain', 'storm', 'labyrinth'],
          completion: ['harvest', 'sunset', 'circle'],
          transformation: ['butterfly', 'fire', 'alchemy']
        },
        
        relational: {
          harmony: ['orchestra', 'dance', 'ecosystem'],
          conflict: ['battle', 'forge', 'earthquake'],
          separation: ['island', 'winter', 'exile'],
          union: ['river_meeting', 'wedding', 'synthesis']
        }
      },
      
      elaborationPatterns: {
        temporal: ['past_formation', 'present_state', 'future_direction'],
        spatial: ['center_essence', 'boundary_limits', 'surrounding_context'],
        dynamic: ['static_foundation', 'moving_forces', 'transformation_potential']
      },
      
      wisdomExtraction: {
        practical: '実践的な行動指針',
        philosophical: '人生の深い洞察',
        spiritual: '魂の成長への道',
        social: '人間関係の智慧'
      }
    };
  }
  
  async initializeContextAnalyzer() {
    console.log('🔍 [MetaphorGenerationEngine] コンテキスト分析器初期化');
    
    this.contextAnalyzer = {
      analyzeEmotionalTone: (data) => {
        // 感情的トーンを分析
        const emotions = {};
        const keywords = data.keywords || [];
        
        // 感情語彙の検出
        const emotionWords = {
          joy: ['嬉しい', '楽しい', '幸せ', '喜び'],
          sadness: ['悲しい', '寂しい', '辛い', '苦しい'],
          anger: ['怒り', '腹立つ', '憤り', 'イライラ'],
          fear: ['不安', '恐怖', '心配', '怖い'],
          love: ['愛', '好き', '大切', '愛情']
        };
        
        Object.entries(emotionWords).forEach(([emotion, words]) => {
          emotions[emotion] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length;
        });
        
        return emotions;
      },
      
      identifyArchetype: (data) => {
        // 元型パターンの識別
        const archetypes = {};
        const keywords = data.keywords || [];
        
        const archetypePatterns = {
          hero: ['勇気', '冒険', '挑戦', '戦い'],
          sage: ['知恵', '学習', '理解', '洞察'],
          caregiver: ['世話', '保護', '支援', '愛情'],
          creator: ['創造', '芸術', '作品', '表現'],
          explorer: ['探求', '発見', '旅', '未知']
        };
        
        Object.entries(archetypePatterns).forEach(([archetype, words]) => {
          archetypes[archetype] = keywords.filter(k => 
            words.some(w => k.includes(w))
          ).length;
        });
        
        return archetypes;
      }
    };
  }
  
  activateSafeMode() {
    console.log('🛡️ [MetaphorGenerationEngine] Safe Mode 起動');
    this.safeMode.activate();
    this.initialized = true;
  }
  
  // Public API
  async generateMetaphorForSituation(situationData, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.generateSafeMetaphor(situationData);
      }
      
      const result = await this.engineOS.generateMetaphor(situationData, options);
      return this.interfaceOS.formatMetaphorResult(result);
      
    } catch (error) {
      console.error('❌ [MetaphorGenerationEngine] メタファー生成エラー:', error);
      return this.safeMode.generateSafeMetaphor(situationData);
    }
  }
  
  getStatus() {
    return {
      initialized: this.initialized,
      safeModeActive: this.safeMode?.active || false,
      databaseReady: !!this.metaphorDatabase,
      rulesReady: !!this.generationRules,
      analyzerReady: !!this.contextAnalyzer,
      philosophy: 'haqei',
      architecture: 'triple-os'
    };
  }
}

// Global instance with HaQei Philosophy
if (typeof window !== 'undefined') {
  window.MetaphorGenerationEngine = new MetaphorGenerationEngine();
}

console.log('✅ [MetaphorGenerationEngine] HaQei Philosophy Implementation Loaded');