// BehavioralInsightEngine.js - 行動パターン気づき＆提案エンジン
// 「なぜあの行動をしたのか？」→「今日から何ができるか？」への橋渡し

class BehavioralInsightEngine {
  constructor() {
    this.insightTemplates = this.initializeInsightTemplates();
    this.actionSuggestions = this.initializeActionSuggestions();
  }

  // メイン機能：3つのOSから行動パターンの気づきを生成
  generateBehavioralInsights(tripleOSResult) {
    const engineOS = tripleOSResult.engineOS;
    const interfaceOS = tripleOSResult.interfaceOS;
    const safeModeOS = tripleOSResult.safeModeOS;

    return {
      keyInsight: this.generateKeyInsight(engineOS, interfaceOS, safeModeOS),
      behavioralPatterns: this.generateBehavioralPatterns(engineOS, interfaceOS, safeModeOS),
      actionSuggestions: this.generateActionSuggestions(engineOS, interfaceOS, safeModeOS),
      situationalExamples: this.generateSituationalExamples(engineOS, interfaceOS, safeModeOS)
    };
  }

  // 核心的気づきの生成
  generateKeyInsight(engineOS, interfaceOS, safeModeOS) {
    const engineName = engineOS?.osName || engineOS?.hexagramInfo?.name || "価値観重視";
    const interfaceName = interfaceOS?.osName || interfaceOS?.hexagramInfo?.name || "社会適応";
    const safeModeName = safeModeOS?.osName || safeModeOS?.hexagramInfo?.name || "防御";

    return {
      title: "あなたの行動パターンの核心",
      content: `あなたは「${engineName}」な価値観を持ちながら、人前では「${interfaceName}」として振る舞い、困った時は「${safeModeName}」で自分を守る傾向があります。`,
      explanation: "この3つのパターンを理解することで、「なぜあの時あんな行動をしたのか？」の理由が明確になります。"
    };
  }

  // 具体的な行動パターンの説明
  generateBehavioralPatterns(engineOS, interfaceOS, safeModeOS) {
    return [
      {
        situation: "一人の時や信頼できる人といる時",
        pattern: `「${engineOS?.osName || "本来の価値観"}」が出やすく、${this.getEnginePattern(engineOS)}な行動を取りがちです。`,
        example: "家族との時間、趣味の時間、重要な決断の時など"
      },
      {
        situation: "職場や社交の場面",
        pattern: `「${interfaceOS?.osName || "社会的な面"}」が前面に出て、${this.getInterfacePattern(interfaceOS)}な振る舞いをします。`,
        example: "会議、初対面の人との会話、公的な場面など"
      },
      {
        situation: "ストレスや困難に直面した時",
        pattern: `「${safeModeOS?.osName || "防御モード"}」が発動し、${this.getSafeModePattern(safeModeOS)}な対応を取ります。`,
        example: "プレッシャーを感じた時、批判された時、不安な時など"
      }
    ];
  }

  // 今日から試せる行動提案
  generateActionSuggestions(engineOS, interfaceOS, safeModeOS) {
    return [
      {
        title: "🎯 価値観を活かす",
        action: this.getEngineActionSuggestion(engineOS),
        why: "本来の自分を大切にし、価値観に基づいた行動を意識的に取ることで、自己一致感が高まります。"
      },
      {
        title: "🤝 社会的バランスを取る", 
        action: this.getInterfaceActionSuggestion(interfaceOS),
        why: "社会的な面も自分の一部として受け入れ、適切に使い分けることで人間関係が改善します。"
      },
      {
        title: "🛡️ 防御を理解し活用する",
        action: this.getSafeModeActionSuggestion(safeModeOS),
        why: "防御パターンを「悪いもの」ではなく「自分を守る智慧」として理解し、適切に活用しましょう。"
      }
    ];
  }

  // 状況別の例
  generateSituationalExamples(engineOS, interfaceOS, safeModeOS) {
    return [
      {
        situation: "重要な決断をする時",
        insight: `あなたの「${engineOS?.osName || "価値観"}」が強く働くため、${this.getDecisionPattern(engineOS)}な判断をしがちです。`,
        tip: "この傾向を理解した上で、他の視点も考慮してみてください。"
      },
      {
        situation: "人間関係でトラブルがある時",
        insight: `「${safeModeOS?.osName || "防御モード"}」が発動し、${this.getRelationshipPattern(safeModeOS)}な対応を取る可能性があります。`,
        tip: "一度深呼吸して、防御モードから抜け出してから対応を考えてみてください。"
      }
    ];
  }

  // エンジンOSのパターン取得
  getEnginePattern(engineOS) {
    if (!engineOS) return "自分らしい";
    const osName = engineOS.osName || engineOS.hexagramInfo?.name || "";
    
    // 八卦に基づいたパターンマッピング
    if (osName.includes("乾") || osName.includes("創造")) return "創造的で積極的";
    if (osName.includes("坤") || osName.includes("受容")) return "受容的で協調的";
    if (osName.includes("震") || osName.includes("行動")) return "エネルギッシュで行動的";
    if (osName.includes("巽") || osName.includes("適応")) return "柔軟で適応的";
    if (osName.includes("坎") || osName.includes("探求")) return "深く考える探求的";
    if (osName.includes("離") || osName.includes("表現")) return "表現豊かで情熱的";
    if (osName.includes("艮") || osName.includes("安定")) return "慎重で安定的";
    if (osName.includes("兌") || osName.includes("調和")) return "調和を重視する";
    return "独自の価値観に基づいた";
  }

  // インターフェースOSのパターン取得
  getInterfacePattern(interfaceOS) {
    if (!interfaceOS) return "社会に合わせた";
    // 同様のロジック（省略）
    return "社会的に適応した";
  }

  // セーフモードOSのパターン取得
  getSafeModePattern(safeModeOS) {
    if (!safeModeOS) return "自分を守る";
    // 同様のロジック（省略）
    return "防御的で慎重";
  }

  // 行動提案の生成
  getEngineActionSuggestion(engineOS) {
    return "今日1つ、本当に大切だと思う価値観に基づいた小さな行動を取ってみてください。";
  }

  getInterfaceActionSuggestion(interfaceOS) {
    return "人との関わりの中で、「本来の自分」と「社会的な自分」の両方を意識してみてください。";
  }

  getSafeModeActionSuggestion(safeModeOS) {
    return "ストレスを感じた時、「今、防御モードになっているな」と気づく練習をしてみてください。";
  }

  getDecisionPattern(engineOS) {
    return "価値観を重視した";
  }

  getRelationshipPattern(safeModeOS) {
    return "距離を置いたり避けたりする";
  }

  // テンプレート初期化（今後拡張予定）
  initializeInsightTemplates() {
    return {
      // 今後、より詳細なテンプレートを追加
    };
  }

  initializeActionSuggestions() {
    return {
      // 今後、より詳細な行動提案を追加
    };
  }

  // 🌟 新機能：Behavioral Flow Timeline生成
  // bunenjin哲学に基づく時系列行動フロー分析
  generateBehavioralFlowTimeline(tripleOSResult, situationContext = null) {
    const engineOS = tripleOSResult.engineOS;
    const interfaceOS = tripleOSResult.interfaceOS;
    const safeModeOS = tripleOSResult.safeModeOS;

    // 代表的な行動シナリオの生成
    const scenarios = this.generateRepresentativeScenarios(engineOS, interfaceOS, safeModeOS);
    
    return scenarios.map(scenario => ({
      scenarioId: scenario.id,
      title: scenario.title,
      description: scenario.description,
      flowSteps: this.createFlowStepsForScenario(scenario, engineOS, interfaceOS, safeModeOS),
      alternativeOutcomes: this.generateAlternativeScenarios(scenario, engineOS, interfaceOS, safeModeOS),
      bunenjinInsight: this.generateFlowInsights(scenario, engineOS, interfaceOS, safeModeOS)
    }));
  }

  // 代表的な行動シナリオの生成
  generateRepresentativeScenarios(engineOS, interfaceOS, safeModeOS) {
    return [
      {
        id: 'workplace_challenge',
        title: '職場での重要な提案の場面',
        description: '会議で新しいアイデアを提案するかどうかの判断',
        triggerType: 'social_pressure',
        complexity: 'high'
      },
      {
        id: 'personal_conflict',
        title: '人間関係でのトラブル対応',
        description: '友人との意見の相違で関係がギクシャクした時',
        triggerType: 'interpersonal_stress',
        complexity: 'medium'
      },
      {
        id: 'life_decision',
        title: '人生の重要な選択',
        description: '転職や引っ越しなどの大きな決断を迫られた時',
        triggerType: 'life_change',
        complexity: 'high'
      }
    ];
  }

  // シナリオ別フローステップの生成
  createFlowStepsForScenario(scenario, engineOS, interfaceOS, safeModeOS) {
    const baseFlow = this.getBaseFlowStructure();
    
    return baseFlow.map((step, index) => {
      switch (step.type) {
        case 'situation':
          return this.createSituationStep(scenario, step);
        case 'emotion':
          return this.createEmotionStep(scenario, engineOS, interfaceOS, safeModeOS, step);
        case 'os_selection':
          return this.createOSSelectionStep(scenario, engineOS, interfaceOS, safeModeOS, step);
        case 'behavior':
          return this.createBehaviorStep(scenario, engineOS, interfaceOS, safeModeOS, step);
        case 'outcome':
          return this.createOutcomeStep(scenario, engineOS, interfaceOS, safeModeOS, step);
        case 'reflection':
          return this.createReflectionStep(scenario, engineOS, interfaceOS, safeModeOS, step);
        default:
          return step;
      }
    });
  }

  // 基本フロー構造の定義
  getBaseFlowStructure() {
    return [
      {
        type: 'situation',
        icon: '🎯',
        title: '状況認識',
        order: 1
      },
      {
        type: 'emotion',
        icon: '💭',
        title: '感情的反応',
        order: 2
      },
      {
        type: 'os_selection',
        icon: '🔄',
        title: 'OS選択',
        order: 3
      },
      {
        type: 'behavior',
        icon: '⚡',
        title: '行動表出',
        order: 4
      },
      {
        type: 'outcome',
        icon: '📈',
        title: '結果評価',
        order: 5
      },
      {
        type: 'reflection',
        icon: '💡',
        title: '学習・気づき',
        order: 6
      }
    ];
  }

  // 状況認識ステップの生成
  createSituationStep(scenario, baseStep) {
    const situationDescriptions = {
      'workplace_challenge': {
        description: '会議室で「何か新しいアイデアはありませんか？」と上司から問いかけられた瞬間',
        context: '周りには同僚たちが座っており、みんなの視線がこちらに向いている',
        pressure: 'high'
      },
      'personal_conflict': {
        description: '友人から「最近あなたの態度が冷たい」と指摘された瞬間',
        context: 'いつものカフェで二人きり、相手の表情は真剣で少し悲しそう',
        pressure: 'medium'
      },
      'life_decision': {
        description: '転職のオファーを受けて、返事の期限が迫っている状況',
        context: '今の職場への不満と新しい挑戦への期待が入り混じっている',
        pressure: 'high'
      }
    };

    const desc = situationDescriptions[scenario.id] || situationDescriptions['workplace_challenge'];

    return {
      ...baseStep,
      content: {
        description: desc.description,
        context: desc.context,
        pressure: desc.pressure,
        timeframe: '瞬間的な判断が求められる'
      },
      insights: [
        'この瞬間、あなたの脳は自動的に「どのOSで対応するか」を選択しています',
        '状況の認識方法によって、その後の行動が大きく変わります'
      ]
    };
  }

  // 感情的反応ステップの生成
  createEmotionStep(scenario, engineOS, interfaceOS, safeModeOS, baseStep) {
    const emotionPatterns = this.analyzeEmotionalResponse(scenario, engineOS, interfaceOS, safeModeOS);
    
    return {
      ...baseStep,
      content: {
        primaryEmotion: emotionPatterns.primary,
        secondaryEmotions: emotionPatterns.secondary,
        physicalReaction: emotionPatterns.physical,
        cognitiveResponse: emotionPatterns.cognitive
      },
      insights: [
        `あなたの${engineOS?.osName || 'Engine OS'}は「${emotionPatterns.engineResponse}」と感じています`,
        `しかし社会的な面では「${emotionPatterns.interfaceResponse}」という反応も生まれています`,
        '複数の感情が同時に存在することで、OS選択の複雑さが生まれます'
      ]
    };
  }

  // OS選択ステップの生成
  createOSSelectionStep(scenario, engineOS, interfaceOS, safeModeOS, baseStep) {
    const osActivation = this.analyzeOSActivationPattern(scenario, engineOS, interfaceOS, safeModeOS);
    
    return {
      ...baseStep,
      content: {
        primaryOS: osActivation.primary,
        secondaryOS: osActivation.secondary,
        suppressedOS: osActivation.suppressed,
        selectionReason: osActivation.reason,
        conflictLevel: osActivation.conflict
      },
      osActivationDisplay: {
        primary: {
          name: osActivation.primary.name,
          strength: osActivation.primary.strength,
          reason: osActivation.primary.activationReason
        },
        secondary: {
          name: osActivation.secondary.name,
          strength: osActivation.secondary.strength,
          reason: osActivation.secondary.activationReason
        },
        suppressed: {
          name: osActivation.suppressed.name,
          strength: osActivation.suppressed.strength,
          reason: osActivation.suppressed.suppressionReason
        }
      },
      insights: [
        `この状況では「${osActivation.primary.name}」が最も強く反応しています`,
        `「${osActivation.suppressed.name}」は意識的または無意識的に抑制されています`,
        'bunenjin哲学：どのOSも「本当のあなた」ではなく、状況に応じた戦略です'
      ]
    };
  }

  // 行動表出ステップの生成
  createBehaviorStep(scenario, engineOS, interfaceOS, safeModeOS, baseStep) {
    const behaviorPattern = this.analyzeBehaviorPattern(scenario, engineOS, interfaceOS, safeModeOS);
    
    return {
      ...baseStep,
      content: {
        actualBehavior: behaviorPattern.actual,
        internalExperience: behaviorPattern.internal,
        externalObservation: behaviorPattern.external,
        energyLevel: behaviorPattern.energy,
        satisfaction: behaviorPattern.satisfaction
      },
      insights: [
        `選択されたOSにより「${behaviorPattern.actual}」という行動を取りました`,
        `内面では「${behaviorPattern.internal}」という体験をしています`,
        '行動と内面の一致度が、エネルギーレベルと満足度に影響します'
      ]
    };
  }

  // 結果評価ステップの生成
  createOutcomeStep(scenario, engineOS, interfaceOS, safeModeOS, baseStep) {
    const outcome = this.analyzeOutcome(scenario, engineOS, interfaceOS, safeModeOS);
    
    return {
      ...baseStep,
      content: {
        immediateResult: outcome.immediate,
        longTermImpact: outcome.longTerm,
        relationshipEffect: outcome.relationship,
        selfEsteem: outcome.selfEsteem,
        learningOpportunity: outcome.learning
      },
      insights: [
        `即座の結果：${outcome.immediate}`,
        `長期的影響：${outcome.longTerm}`,
        '結果の評価は、次回の類似状況でのOS選択に影響を与えます'
      ]
    };
  }

  // 振り返り・学習ステップの生成
  createReflectionStep(scenario, engineOS, interfaceOS, safeModeOS, baseStep) {
    const reflection = this.generateReflectionInsights(scenario, engineOS, interfaceOS, safeModeOS);
    
    return {
      ...baseStep,
      content: {
        whatWorked: reflection.positives,
        whatChallenged: reflection.challenges,
        alternativeApproaches: reflection.alternatives,
        futureStrategy: reflection.strategy,
        bunenjinWisdom: reflection.wisdom
      },
      insights: [
        '行動パターンを理解することで、より戦略的な選択が可能になります',
        '「正しいOS」は存在せず、状況に応じた「最適なOS」を選ぶことが重要です',
        'bunenjin思想：多面的な自分を受け入れ、戦略的に活用しましょう'
      ]
    };
  }

  // 代替シナリオの生成
  generateAlternativeScenarios(scenario, engineOS, interfaceOS, safeModeOS) {
    const alternatives = [];
    
    // Engine OS主導のシナリオ
    alternatives.push({
      osType: 'engine',
      title: `もし「${engineOS?.osName || 'Engine OS'}」で対応していたら...`,
      description: this.generateEngineScenario(scenario, engineOS),
      outcome: this.predictEngineOutcome(scenario, engineOS),
      pros: this.getEngineScenarioPros(scenario, engineOS),
      cons: this.getEngineScenarioCons(scenario, engineOS)
    });

    // Interface OS主導のシナリオ
    alternatives.push({
      osType: 'interface',
      title: `もし「${interfaceOS?.osName || 'Interface OS'}」で対応していたら...`,
      description: this.generateInterfaceScenario(scenario, interfaceOS),
      outcome: this.predictInterfaceOutcome(scenario, interfaceOS),
      pros: this.getInterfaceScenarioPros(scenario, interfaceOS),
      cons: this.getInterfaceScenarioCons(scenario, interfaceOS)
    });

    // Safe Mode OS主導のシナリオ
    alternatives.push({
      osType: 'safe',
      title: `もし「${safeModeOS?.osName || 'Safe Mode OS'}」で対応していたら...`,
      description: this.generateSafeModeScenario(scenario, safeModeOS),
      outcome: this.predictSafeModeOutcome(scenario, safeModeOS),
      pros: this.getSafeModeScenarioPros(scenario, safeModeOS),
      cons: this.getSafeModeScenarioCons(scenario, safeModeOS)
    });

    return alternatives;
  }

  // OSアクティベーションパターンの分析
  analyzeOSActivationPattern(scenario, engineOS, interfaceOS, safeModeOS) {
    // シナリオタイプに基づくOS優先度の決定
    let primary, secondary, suppressed;
    
    switch (scenario.triggerType) {
      case 'social_pressure':
        primary = { name: interfaceOS?.osName || 'Interface OS', strength: 0.8, activationReason: '社会的適応の必要性' };
        secondary = { name: safeModeOS?.osName || 'Safe Mode OS', strength: 0.6, activationReason: '失敗への不安' };
        suppressed = { name: engineOS?.osName || 'Engine OS', strength: 0.3, suppressionReason: 'リスク回避のため' };
        break;
      case 'interpersonal_stress':
        primary = { name: safeModeOS?.osName || 'Safe Mode OS', strength: 0.9, activationReason: '関係性の保護' };
        secondary = { name: interfaceOS?.osName || 'Interface OS', strength: 0.5, activationReason: '調和の維持' };
        suppressed = { name: engineOS?.osName || 'Engine OS', strength: 0.2, suppressionReason: '対立の回避' };
        break;
      case 'life_change':
        primary = { name: engineOS?.osName || 'Engine OS', strength: 0.7, activationReason: '価値観との照合' };
        secondary = { name: safeModeOS?.osName || 'Safe Mode OS', strength: 0.6, activationReason: '慎重な検討' };
        suppressed = { name: interfaceOS?.osName || 'Interface OS', strength: 0.4, suppressionReason: '個人的決断のため' };
        break;
      default:
        primary = { name: interfaceOS?.osName || 'Interface OS', strength: 0.7, activationReason: '一般的適応' };
        secondary = { name: engineOS?.osName || 'Engine OS', strength: 0.5, activationReason: '個人的価値観' };
        suppressed = { name: safeModeOS?.osName || 'Safe Mode OS', strength: 0.3, suppressionReason: '積極的対応' };
    }

    return {
      primary,
      secondary,
      suppressed,
      reason: this.getOSSelectionReason(scenario.triggerType),
      conflict: this.calculateOSConflictLevel(primary, secondary, suppressed)
    };
  }

  // フロー洞察の生成
  generateFlowInsights(scenario, engineOS, interfaceOS, safeModeOS) {
    return {
      title: 'bunenjin哲学による洞察',
      mainInsight: this.generateMainFlowInsight(scenario, engineOS, interfaceOS, safeModeOS),
      strategicAdvice: this.generateStrategicAdvice(scenario, engineOS, interfaceOS, safeModeOS),
      nextTimeStrategy: this.generateNextTimeStrategy(scenario, engineOS, interfaceOS, safeModeOS),
      philosophicalNote: 'あなたには「真の自分」は存在しません。状況に応じて最適なOSを戦略的に選択することが、bunenjin哲学の本質です。'
    };
  }

  // 感情的反応の分析
  analyzeEmotionalResponse(scenario, engineOS, interfaceOS, safeModeOS) {
    const emotionMappings = {
      'workplace_challenge': {
        primary: '緊張と期待',
        secondary: ['不安', '興奮', '責任感'],
        physical: '心拍数の上昇、手の震え',
        cognitive: '瞬時にリスクと機会を評価',
        engineResponse: '自分のアイデアを伝えたい',
        interfaceResponse: '場の空気を読まなければ'
      },
      'personal_conflict': {
        primary: '困惑と防御感',
        secondary: ['罪悪感', '怒り', '悲しみ'],
        physical: '胸の詰まり、体の緊張',
        cognitive: '相手の気持ちと自分の立場を整理',
        engineResponse: '誤解を解きたい',
        interfaceResponse: '関係を悪化させたくない'
      },
      'life_decision': {
        primary: '期待と不安',
        secondary: ['希望', '恐れ', '迷い'],
        physical: '睡眠不足、食欲の変化',
        cognitive: '長期的影響を深く検討',
        engineResponse: '成長の機会として捉えたい',
        interfaceResponse: '周囲への影響も考慮したい'
      }
    };

    return emotionMappings[scenario.id] || emotionMappings['workplace_challenge'];
  }

  // 行動パターンの分析
  analyzeBehaviorPattern(scenario, engineOS, interfaceOS, safeModeOS) {
    // 実装の詳細は状況に応じて調整
    return {
      actual: '控えめに様子を見る発言',
      internal: '本当はもっと言いたいことがある',
      external: '慎重で責任感のある対応に見える',
      energy: 'medium',
      satisfaction: 'low-medium'
    };
  }

  // 結果の分析
  analyzeOutcome(scenario, engineOS, interfaceOS, safeModeOS) {
    return {
      immediate: '安全だが印象に残らない結果',
      longTerm: '機会の見逃しによる後悔の可能性',
      relationship: '関係は維持されるが深化しない',
      selfEsteem: '一時的な安心感と物足りなさ',
      learning: 'より積極的なアプローチの必要性を認識'
    };
  }

  // 振り返り洞察の生成
  generateReflectionInsights(scenario, engineOS, interfaceOS, safeModeOS) {
    return {
      positives: ['関係性を傷つけずに済んだ', '慎重な判断ができた'],
      challenges: ['自分の意見を十分に伝えられなかった', '機会を活かしきれなかった'],
      alternatives: ['Engine OSでより積極的に', 'Interface OSでバランス良く'],
      strategy: '次回は状況を見極めて、より戦略的なOS選択を',
      wisdom: '完璧なOSは存在しない。状況に応じた最適解を見つけることが成長につながる'
    };
  }

  // ヘルパーメソッド群
  getOSSelectionReason(triggerType) {
    const reasons = {
      'social_pressure': '社会的期待への対応が優先された',
      'interpersonal_stress': '関係性の保護が最重要となった',
      'life_change': '個人的価値観との照合が必要となった'
    };
    return reasons[triggerType] || '状況に応じた自動的な判断';
  }

  calculateOSConflictLevel(primary, secondary, suppressed) {
    const strengthDiff = Math.abs(primary.strength - suppressed.strength);
    if (strengthDiff < 0.3) return 'high';
    if (strengthDiff < 0.5) return 'medium';
    return 'low';
  }

  generateMainFlowInsight(scenario, engineOS, interfaceOS, safeModeOS) {
    return `この行動パターンは、あなたの「${interfaceOS?.osName || 'Interface OS'}」が主導した結果です。社会的な調和を重視する一方で、内なる「${engineOS?.osName || 'Engine OS'}」の声が抑制されたことで、複雑な感情が生まれています。`;
  }

  generateStrategicAdvice(scenario, engineOS, interfaceOS, safeModeOS) {
    return `今後同様の状況では、まず「どのOSが反応しているか？」を意識してみてください。そして「今回は別のOSで試してみよう」という戦略的思考を持つことで、より多様な結果を経験できます。`;
  }

  generateNextTimeStrategy(scenario, engineOS, interfaceOS, safeModeOS) {
    return `次回のアクション：最初の3秒で感情を観察し、「${engineOS?.osName || 'Engine OS'}の視点では？」「${interfaceOS?.osName || 'Interface OS'}なら？」「${safeModeOS?.osName || 'Safe Mode OS'}だと？」と問いかけてから行動を選択してみましょう。`;
  }

  // 代替シナリオ生成メソッド群（簡略版）
  generateEngineScenario(scenario, engineOS) {
    return `「${engineOS?.osName || 'Engine OS'}」の価値観に従って、率直に自分の考えを表現する`;
  }

  generateInterfaceScenario(scenario, interfaceOS) {
    return `「${interfaceOS?.osName || 'Interface OS'}」の社会的スキルを活用して、バランス良く対応する`;
  }

  generateSafeModeScenario(scenario, safeModeOS) {
    return `「${safeModeOS?.osName || 'Safe Mode OS'}」の慎重さを活かして、リスクを最小化しながら対応する`;
  }

  predictEngineOutcome(scenario, engineOS) {
    return '自己一致感は高いが、社会的リスクが増加する可能性';
  }

  predictInterfaceOutcome(scenario, interfaceOS) {
    return '社会的調和は保たれるが、個人的満足度は中程度';
  }

  predictSafeModeOutcome(scenario, safeModeOS) {
    return 'リスクは最小化されるが、成長機会を逃す可能性';
  }

  getEngineScenarioPros(scenario, engineOS) {
    return ['自己表現の満足感', '創造的解決策の提示', '長期的な信頼関係構築'];
  }

  getEngineScenarioCons(scenario, engineOS) {
    return ['短期的な摩擦の可能性', '理解されないリスク', '期待外れの結果'];
  }

  getInterfaceScenarioPros(scenario, interfaceOS) {
    return ['円滑な人間関係', 'チームワークの向上', '安定した成果'];
  }

  getInterfaceScenarioCons(scenario, interfaceOS) {
    return ['個性の抑制', '表面的な関係', '内面的ストレス'];
  }

  getSafeModeScenarioPros(scenario, safeModeOS) {
    return ['リスク回避', '安全な選択', '失敗の防止'];
  }

  getSafeModeScenarioCons(scenario, safeModeOS) {
    return ['成長機会の逸失', '消極的印象', '後悔の可能性'];
  }
}

// グローバルに登録
window.BehavioralInsightEngine = BehavioralInsightEngine;