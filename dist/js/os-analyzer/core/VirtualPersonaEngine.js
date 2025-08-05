/**
 * VirtualPersonaEngine.js
 * 仮想人格対話型自己理解プラットフォーム - コアエンジン
 * 
 * 目的:
 * - ユーザーの回答から仮想人格を動的に生成
 * - 3つのOS（本質的価値観・社会的側面・防衛的側面）の人格化
 * - 易経メタファーと分人思想の統合
 * - 動的相互作用システムの構築
 * 
 * 処理内容:
 * 1. 回答データから3つのOSの特性抽出
 * 2. 各OSを人格的存在として定義（精霊・守護者・賢者）
 * 3. OS間の相互作用パターンの生成
 * 4. 易経卦による象意メタファーの適用
 * 5. 動的な対話シナリオの構築
 * 
 * bunenjin哲学統合:
 * - 分人思想による多面的人格の肯定
 * - 易経による変化と調和の智慧
 * - 複雑性を美学として表現
 */

class VirtualPersonaEngine {
  constructor() {
    this.personas = {
      essence: null,      // 本質的価値観OS - 本質的自己
      social: null,       // 社会的側面OS - 社会的自己
      defense: null       // 防衛的側面OS - 防衛的自己
    };
    
    this.interactions = [];
    this.narrativeStyle = 'poetic'; // poetic, analytical, conversational
    
    console.log('🎭 VirtualPersonaEngine initialized - 仮想人格システム起動');
  }

  /**
   * メイン処理：回答データから仮想人格を生成
   * 
   * @param {Object} analysisResult - 分析結果データ
   * @param {Array} rawAnswers - 生の回答データ
   * @returns {Object} 生成された仮想人格システム
   */
  async generateVirtualPersona(analysisResult, rawAnswers) {
    console.log('🌱 仮想人格生成開始...');
    
    try {
      // Phase 1: 基本人格特性の抽出
      const coreTraits = this._extractCoreTraits(analysisResult, rawAnswers);
      
      // Phase 2: 3つのOSを人格化
      this.personas.essence = this._createEssencePersona(coreTraits.essence);
      this.personas.social = this._createSocialPersona(coreTraits.social);
      this.personas.defense = this._createDefensePersona(coreTraits.defense);
      
      // Phase 3: 相互作用パターンの生成
      this.interactions = this._generateInteractionPatterns();
      
      // Phase 4: 物語的統合
      const narrative = this._createPersonaNarrative();
      
      // Phase 5: 成長の示唆
      const growthSuggestions = this._generateGrowthSuggestions();
      
      console.log('✨ 仮想人格生成完了');
      
      return {
        personas: this.personas,
        interactions: this.interactions,
        narrative: narrative,
        growthSuggestions: growthSuggestions,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: 'VirtualPersonaEngine v1.0',
          philosophy: 'bunenjin + I-Ching integration'
        }
      };
      
    } catch (error) {
      console.error('❌ 仮想人格生成エラー:', error);
      return this._createFallbackPersona();
    }
  }

  /**
   * 基本人格特性の抽出
   * 
   * @param {Object} analysisResult - 分析結果
   * @param {Array} rawAnswers - 生の回答データ
   * @returns {Object} 抽出された特性
   */
  _extractCoreTraits(analysisResult, rawAnswers) {
    const traits = {
      essence: {
        dominantElement: this._findDominantElement(analysisResult, 'engine'),
        intensity: this._calculateIntensity(analysisResult.engineOS),
        conflictPatterns: this._identifyConflictPatterns(rawAnswers, 'worldview'),
        hexagram: analysisResult.engineOS?.hexagramInfo
      },
      social: {
        dominantElement: this._findDominantElement(analysisResult, 'interface'),
        adaptability: this._calculateAdaptability(analysisResult.interfaceOS),
        harmonySeeking: this._assessHarmonySeeking(rawAnswers, 'scenario'),
        hexagram: analysisResult.interfaceOS?.hexagramInfo
      },
      defense: {
        dominantElement: this._findDominantElement(analysisResult, 'safemode'),
        resilience: this._calculateResilience(analysisResult.safeModeOS),
        cautionLevel: this._assessCautionLevel(rawAnswers, 'safemode'),
        hexagram: analysisResult.safeModeOS?.hexagramInfo
      }
    };
    
    console.log('🔍 基本特性抽出完了:', Object.keys(traits));
    return traits;
  }

  /**
   * 本質的価値観OS（本質的自己）の人格化
   * 
   * @param {Object} essenceTraits - 本質特性
   * @returns {Object} 本質的自己人格
   */
  _createEssencePersona(essenceTraits) {
    const essenceTypes = {
      '乾': { name: '創造への衝動', nature: '新しい可能性を追求する内なる力', aspect: 'creativity' },
      '兌': { name: '調和への願い', nature: '美と喜びを求める本質', aspect: 'harmony' },
      '離': { name: '真理への探求', nature: '明晰さと理解を求める意志', aspect: 'clarity' },
      '震': { name: '行動への決意', nature: '前進し実現する原動力', aspect: 'action' },
      '巽': { name: '適応への智慧', nature: '変化に柔軟に対応する本能', aspect: 'adaptation' },
      '坎': { name: '深層への洞察', nature: '本質を見抜く洞察力', aspect: 'insight' },
      '艮': { name: '安定への意志', nature: '確固とした基盤を築く力', aspect: 'stability' },
      '坤': { name: '受容への愛', nature: '全てを包み込む包容力', aspect: 'acceptance' }
    };
    
    const hexagramKey = essenceTraits.hexagram?.number || 1;
    const primaryElement = this._mapHexagramToElement(hexagramKey);
    const essenceType = essenceTypes[primaryElement] || essenceTypes['乾'];
    
    return {
      name: essenceType.name,
      nature: essenceType.nature,
      aspect: essenceType.aspect,
      intensity: essenceTraits.intensity,
      hexagram: essenceTraits.hexagram,
      voice: this._generateEssenceVoice(essenceType, essenceTraits),
      desires: this._generateEssenceDesires(essenceType, essenceTraits),
      fears: this._generateEssenceFears(essenceType, essenceTraits),
      motto: this._generateEssenceMotto(essenceType)
    };
  }

  /**
   * 社会的側面OS（社会的自己）の人格化
   * 
   * @param {Object} socialTraits - 社会特性
   * @returns {Object} 社会的自己人格
   */
  _createSocialPersona(socialTraits) {
    const socialTypes = {
      '乾': { name: '指導的な社会的自己', nature: '人々を導き影響を与える力', role: 'leader' },
      '兌': { name: '調和的な社会的自己', nature: '喜びと協調を生み出す力', role: 'harmonizer' },
      '離': { name: '啓発的な社会的自己', nature: '知識と洞察を分かち合う力', role: 'guide' },
      '震': { name: '行動的な社会的自己', nature: '積極的に関わり影響する力', role: 'activator' },
      '巽': { name: '適応的な社会的自己', nature: '柔軟に人と調和する力', role: 'mediator' },
      '坎': { name: '洞察的な社会的自己', nature: '深く理解し助言する力', role: 'advisor' },
      '艮': { name: '安定的な社会的自己', nature: '信頼できる基盤となる力', role: 'stabilizer' },
      '坤': { name: '支援的な社会的自己', nature: '人を支え育む力', role: 'supporter' }
    };
    
    const hexagramKey = socialTraits.hexagram?.number || 58;
    const primaryElement = this._mapHexagramToElement(hexagramKey);
    const socialType = socialTypes[primaryElement] || socialTypes['兌'];
    
    return {
      name: socialType.name,
      nature: socialType.nature,
      role: socialType.role,
      adaptability: socialTraits.adaptability,
      hexagram: socialTraits.hexagram,
      voice: this._generateSocialVoice(socialType, socialTraits),
      concerns: this._generateSocialConcerns(socialType, socialTraits),
      strengths: this._generateSocialStrengths(socialType, socialTraits),
      advice: this._generateSocialAdvice(socialType)
    };
  }

  /**
   * 防衛的側面OS（防衛的自己）の人格化
   * 
   * @param {Object} defenseTraits - 防衛特性
   * @returns {Object} 防衛的自己人格
   */
  _createDefensePersona(defenseTraits) {
    const defenseTypes = {
      '乾': { name: '不屈の防衛的自己', nature: '困難に屈しない強固な意志', strategy: 'persistence' },
      '兌': { name: '楽観的な防衛的自己', nature: '希望を保ち続ける力', strategy: 'optimism' },
      '離': { name: '洞察的な防衛的自己', nature: '真実を見抜き危険を察知する力', strategy: 'clarity' },
      '震': { name: '決断的な防衛的自己', nature: '迅速かつ的確な判断力', strategy: 'decisiveness' },
      '巽': { name: '柔軟な防衛的自己', nature: '変化に適応し生き抜く力', strategy: 'flexibility' },
      '坎': { name: '慎重な防衛的自己', nature: 'リスクを見抜き準備する智慧', strategy: 'caution' },
      '艮': { name: '忍耐的な防衛的自己', nature: '時を待ち耐え抜く力', strategy: 'patience' },
      '坤': { name: '受容的な防衛的自己', nature: '全てを受け入れ包み込む力', strategy: 'acceptance' }
    };
    
    const hexagramKey = defenseTraits.hexagram?.number || 52;
    const primaryElement = this._mapHexagramToElement(hexagramKey);
    const defenseType = defenseTypes[primaryElement] || defenseTypes['艮'];
    
    return {
      name: defenseType.name,
      nature: defenseType.nature,
      strategy: defenseType.strategy,
      resilience: defenseTraits.resilience,
      hexagram: defenseTraits.hexagram,
      voice: this._generateDefenseVoice(defenseType, defenseTraits),
      warnings: this._generateDefenseWarnings(defenseType, defenseTraits),
      protections: this._generateDefenseProtections(defenseType, defenseTraits),
      philosophy: this._generateDefensePhilosophy(defenseType)
    };
  }

  /**
   * 相互作用パターンの生成
   * 
   * @returns {Array} 相互作用シナリオ
   */
  _generateInteractionPatterns() {
    const patterns = [];
    
    // パターン1: 創造と調和の対話
    patterns.push({
      type: 'creative_harmony',
      participants: ['essence', 'social'],
      scenario: this._createCreativeHarmonyScenario(),
      outcome: 'balanced_innovation'
    });
    
    // パターン2: 調和と安定の協調
    patterns.push({
      type: 'harmony_stability',
      participants: ['social', 'defense'],
      scenario: this._createHarmonyStabilityScenario(),
      outcome: 'sustainable_growth'
    });
    
    // パターン3: 創造と慎重さの緊張
    patterns.push({
      type: 'creative_caution',
      participants: ['essence', 'defense'],
      scenario: this._createCreativeCautionScenario(),
      outcome: 'wise_innovation'
    });
    
    // パターン4: 三者統合の瞬間
    patterns.push({
      type: 'triple_integration',
      participants: ['essence', 'social', 'defense'],
      scenario: this._createTripleIntegrationScenario(),
      outcome: 'authentic_action'
    });
    
    return patterns;
  }

  /**
   * 人格物語の生成
   * 
   * @returns {Object} 統合された物語
   */
  _createPersonaNarrative() {
    return {
      introduction: this._generateIntroductionNarrative(),
      dailyLife: this._generateDailyLifeNarrative(),
      challenges: this._generateChallengeNarrative(),
      growth: this._generateGrowthNarrative(),
      essence: this._generateEssenceNarrative()
    };
  }

  // ========== ヘルパーメソッド ==========
  
  _findDominantElement(analysisResult, osType) {
    // 実装：各OSの主要元素を特定
    return '乾'; // 仮実装
  }
  
  _calculateIntensity(osData) {
    return osData?.strength || 0.5;
  }
  
  _identifyConflictPatterns(rawAnswers, type) {
    // 実装：回答パターンから内的葛藤を特定
    return [];
  }
  
  _mapHexagramToElement(hexagramNumber) {
    const mapping = {
      1: '乾', 2: '坤', 3: '震', 4: '艮', 5: '坎', 6: '離', 7: '兌', 8: '巽'
    };
    return mapping[hexagramNumber % 8 + 1] || '乾';
  }
  
  _generateEssenceVoice(essenceType, traits) {
    return `私はこの人の${essenceType.name}。${essenceType.nature}として、この人の核となる価値観を体現しています。`;
  }
  
  _generateEssenceDesires(essenceType, traits) {
    return ['価値の実現', '本質的な成長', '意味ある創造'];
  }
  
  _generateEssenceFears(essenceType, traits) {
    return ['価値観の妥協', '本質からの逸脱', '意味の喪失'];
  }
  
  _generateEssenceMotto(essenceType) {
    return '本質に忠実であることが、最も力強い生き方';
  }
  
  _generateSocialVoice(socialType, traits) {
    return `私はこの人の${socialType.name}。${socialType.nature}を通じて、人との関わりの中でこの人らしさを表現します。`;
  }
  
  _generateSocialConcerns(socialType, traits) {
    return ['人間関係の質', '社会での役割', '他者への影響'];
  }
  
  _generateSocialStrengths(socialType, traits) {
    return ['人との繋がり', '協調性', '社会的感受性'];
  }
  
  _generateSocialAdvice(socialType) {
    return '真の社会性は、自分らしさを保ったまま他者と調和すること';
  }
  
  _generateDefenseVoice(defenseType, traits) {
    return `私はこの人の${defenseType.name}。${defenseType.nature}により、この人を様々なリスクから守り、最適な選択を支援します。`;
  }
  
  _generateDefenseWarnings(defenseType, traits) {
    return ['過度のリスク', '準備不足の行動', '感情的な判断'];
  }
  
  _generateDefenseProtections(defenseType, traits) {
    return ['慎重な計画', 'リスクの評価', '長期的視点'];
  }
  
  _generateDefensePhilosophy(defenseType) {
    return '真の強さとは、時を知り、適切に行動すること';
  }
  
  // シナリオ生成メソッド群
  _createCreativeHarmonyScenario() {
    return {
      setting: '新しいプロジェクトを始める時',
      dialogue: [
        { speaker: 'essence', text: '素晴らしいアイデアが浮かんだ！すぐに始めよう！' },
        { speaker: 'social', text: '良いアイデアですね。ただ、チームの皆さんとの協調も考えませんか？' },
        { speaker: 'essence', text: 'そうか、みんなと一緒に創造するともっと素晴らしくなるかもしれない' }
      ],
      resolution: '創造力と協調性のバランスの取れた行動'
    };
  }
  
  _createHarmonyStabilityScenario() {
    return {
      setting: '重要な決断を迫られた時',
      dialogue: [
        { speaker: 'social', text: 'みんなが納得する解決策を見つけましょう' },
        { speaker: 'defense', text: '急がずに、リスクも考慮しましょう' },
        { speaker: 'social', text: '確かに。慎重さも大切ですね' }
      ],
      resolution: '調和と安定性を両立した判断'
    };
  }
  
  _createCreativeCautionScenario() {
    return {
      setting: '大きな挑戦に直面した時',
      dialogue: [
        { speaker: 'essence', text: 'この機会を逃してはならない！' },
        { speaker: 'defense', text: 'ちょっと待って。リスクが大きすぎませんか？' },
        { speaker: 'essence', text: '確かに...でも、安全な道ばかりでは成長できない' },
        { speaker: 'defense', text: 'それなら、準備を整えてから挑戦しましょう' }
      ],
      resolution: '計画的で賢明な挑戦'
    };
  }
  
  _createTripleIntegrationScenario() {
    return {
      setting: '人生の重要な選択をする時',
      dialogue: [
        { speaker: 'essence', text: '心の奥底から湧き上がる情熱に従いたい' },
        { speaker: 'social', text: '大切な人たちとの絆も考慮に入れましょう' },
        { speaker: 'defense', text: '長期的な安定性も見据えて慎重に' },
        { speaker: 'integration', text: '3つの智慧を統合して、真に自分らしい選択を' }
      ],
      resolution: '本質・調和・安定が統合された authentic な行動'
    };
  }
  
  // 物語生成メソッド群
  _generateIntroductionNarrative() {
    return `この人格の内面には、3つの異なる自己が存在しています。

**${this.personas.essence.name}**は、${this.personas.essence.nature}として、
この人の核となる価値観と理想を体現しています。

**${this.personas.social.name}**は、${this.personas.social.nature}として、
人との関わりの中でその人らしさを表現しています。

**${this.personas.defense.name}**は、${this.personas.defense.nature}として、
この人を様々なリスクから守り、最適な選択を支援しています。

この3つの自己が互いに対話し、協調し、時には葛藤しながら、
この人という複雑で豊かな人格を形作っているのです。`;
  }
  
  _generateDailyLifeNarrative() {
    return `日常生活において、この3つの自己はどのように現れるでしょうか？

朝目覚めた時、**${this.personas.essence.name}**は「今日は自分の価値観に忠実に生きよう！」と提案し、
**${this.personas.social.name}**は「人との関わりを大切にし、意味ある一日にしよう」と考え、
**${this.personas.defense.name}**は「リスクを考慮し、最適な選択をしよう」と助言します。

この3つの声の対話が、この人の一日の選択を形作っているのです。`;
  }
  
  _generateChallengeNarrative() {
    return `困難に直面した時、3つの自己の真価が発揮されます。

**${this.personas.essence.name}**は「この困難を通じて、自分の価値観をより深く理解しよう」と力強く語りかけ、
**${this.personas.social.name}**は「一人で抱え込まず、信頼できる人たちと連携しよう」と提案し、
**${this.personas.defense.name}**は「急がず焦らず、リスクを評価して最適な時を待とう」と智慧を与えます。

3つの視点が統合された時、この人にとって最適な解決策を導き出すことができます。`;
  }
  
  _generateGrowthNarrative() {
    return `成長の道において、3つの存在は互いに学び合います。

${this.personas.essence.name}の情熱は、${this.personas.social.name}の調和の智慧によって磨かれ、
${this.personas.social.name}の協調性は、${this.personas.defense.name}の慎重さによって深められ、
${this.personas.defense.name}の安定性は、${this.personas.essence.name}の創造力によって活性化されます。

この相互作用が、この人の継続的な成長を支えています。`;
  }
  
  _generateEssenceNarrative() {
    return `易経の智慧は語ります：

「天地人の三才が調和する時、真の力が現れる」

あなたの中の3つの存在も、この宇宙の原理に従っています。
${this.personas.essence.name}は天の創造力を、
${this.personas.social.name}は人の調和を、
${this.personas.defense.name}は地の安定性を表しています。

この3つが調和する時、この人は最も本質的でバランスの取れた状態で行動することができます。`;
  }
  
  _generateGrowthSuggestions() {
    return {
      essence: {
        title: `${this.personas.essence.name}を育むために`,
        suggestions: [
          '毎日10分、新しいことに挑戦する時間を作る',
          '創造的な活動（絵、音楽、文章など）を始める',
          '固定観念を疑い、新しい視点を探求する'
        ]
      },
      social: {
        title: `${this.personas.social.name}を深めるために`,
        suggestions: [
          '他者の立場に立って考える練習をする',
          '対話の質を高める努力をする',
          'コミュニティ活動に参加する'
        ]
      },
      defense: {
        title: `${this.personas.defense.name}の智慧を活かすために`,
        suggestions: [
          '瞑想や内省の時間を持つ',
          '長期的な視点で物事を考える習慣をつける',
          '感情と論理のバランスを意識する'
        ]
      },
      integration: {
        title: '3つの存在を統合するために',
        suggestions: [
          '重要な決断前に3つの視点で検討する',
          '日記で内なる対話を記録する',
          '自分の複雑さを肯定的に受け入れる'
        ]
      }
    };
  }
  
  _createFallbackPersona() {
    return {
      personas: {
        essence: { name: '探求の精霊', nature: '新しい可能性を求める' },
        social: { name: '調和の守護者', nature: '人との絆を大切にする' },
        defense: { name: '智慧の賢者', nature: '慎重に道を選ぶ' }
      },
      interactions: [],
      narrative: { introduction: '仮想人格を生成中です...' },
      growthSuggestions: {},
      metadata: { error: 'fallback_persona_used' }
    };
  }
}

// グローバル登録
if (typeof window !== 'undefined') {
  window.VirtualPersonaEngine = VirtualPersonaEngine;
}

console.log('🎭 VirtualPersonaEngine loaded - 仮想人格対話型自己理解システム');