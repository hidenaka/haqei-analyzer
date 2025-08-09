import { createI18n } from 'vue-i18n'

// 日本語翻訳
const ja = {
  app: {
    title: 'HaQei Analyzer'
  },
  HaQei: {
    title: 'HaQei哲学',
    facets: {
      primary: '主要側面',
      primaryDesc: 'あなたの中核的な人格の側面',
      secondary: '副次側面', 
      secondaryDesc: 'サブ的な人格の表現',
      tertiary: '第三側面',
      tertiaryDesc: '隠れた人格の要素',
      quaternary: '第四側面',
      quaternaryDesc: '潜在的な人格の可能性'
    },
    pillars: {
      multifaceted: {
        title: '多面性受容',
        description: '複数の矛盾する側面を同時に受け入れる能力'
      },
      harmony: {
        title: '調和追求',
        description: '対立する要素間のバランスを見つける智慧'
      },
      change: {
        title: '変化受容',
        description: '流動的な状況に適応する柔軟性'
      },
      strategy: {
        title: '戦略ナビゲーション',
        description: '複雑な状況を読み解く洞察力'
      }
    },
    harmony: {
      balance: 'バランス',
      balanceDesc: '調和の取れた状態を保つ',
      acceptance: '受容',
      acceptanceDesc: '変化を受け入れる姿勢'
    }
  },
  tripleOS: {
    engine: {
      title: 'Engine OS'
    },
    interface: {
      title: 'Interface OS'
    },
    safemode: {
      title: 'SafeMode OS'
    },
    balance: 'バランス',
    strength: '強度',
    adaptability: '適応性',
    protection: '防御力',
    interactions: {
      title: '相互作用',
      engine: 'Engine → Interface',
      interface: 'Interface → SafeMode', 
      safemode: 'SafeMode → Engine'
    },
    balance: {
      title: 'Triple OSバランス',
      harmony: '調和',
      stability: '安定性',
      flexibility: '柔軟性'
    }
  },
  iching: {
    navigation: {
      title: '易経64卦ナビゲーション'
    },
    sancai: {
      heaven: '天',
      human: '人',
      earth: '地'
    },
    guidance: {
      title: 'ガイダンス'
    }
  },
  navigation: {
    main: 'メインナビゲーション',
    home: 'ホーム',
    homeDesc: 'メインページに戻る',
    analysis: '分析',
    analysisDesc: 'パーソナリティ分析',
    wisdom: '智慧',
    wisdomDesc: '易経の智慧',
    community: 'コミュニティ',
    communityDesc: 'コミュニティに参加'
  },
  sections: {
    easternWisdom: '東洋の智慧',
    westernTheory: '西洋の理論',
    HaQeiCore: 'HaQei核心',
    culturalExploration: '文化的探索'
  },
  wisdom: {
    title: '東洋の智慧'
  },
  theory: {
    title: '西洋の理論',
    subtitle: '科学的アプローチ'
  },
  examples: {
    title: '具体例'
  },
  exploration: {
    title: '文化的探索',
    valuesTitle: '価値観の比較',
    adaptabilityTitle: '適応性テスト',
    responseOptions: '回答選択肢',
    culturalInsight: '文化的洞察'
  },
  dimensions: {
    individualism: '個人主義',
    hierarchy: '階層志向',
    uncertainty: '不確実性回避',
    longterm: '長期志向'
  },
  scenarios: {
    conflict: {
      title: '対立解決シナリオ',
      description: '職場で意見の対立が生じた場合、どのように対処しますか？',
      options: {
        direct: '直接的な対話',
        mediated: '第三者仲裁',
        indirect: '間接的アプローチ',
        avoidance: '回避・時間解決'
      }
    },
    decision: {
      title: '意思決定シナリオ',
      description: '重要な決断を下す必要がある時、どのようなプロセスを取りますか？',
      options: {
        individual: '個人で決断',
        consensus: '全員の合意',
        authority: '権威者に委任',
        intuitive: '直感に従う'
      }
    }
  },
  feedback: {
    generic: '選択した {option} は興味深いアプローチです。'
  },
  accessibility: {
    title: 'アクセシビリティ設定',
    settings: 'アクセシビリティ設定',
    selectLanguage: '言語を選択',
    selectCulture: '文化圏を選択',
    highContrast: 'ハイコントラスト',
    largeText: '大きなテキスト',
    reducedMotion: 'アニメーション削減',
    audioGuide: '音声ガイド',
    keyboardHelp: 'キーボードヘルプ',
    keyboardShortcuts: 'キーボードショートカット',
    pauseAudio: '音声を停止',
    playAudio: '音声を再生',
    transcript: '音声テキスト',
    valuesChart: '価値観チャート'
  },
  shortcuts: {
    tab: '次の要素に移動',
    enter: '選択・実行',
    space: 'チェックボックス切り替え',
    escape: 'ダイアログを閉じる',
    language: '言語選択',
    culture: '文化選択', 
    help: 'ヘルプ表示'
  },
  announcements: {
    languageChanged: '言語が {language} に変更されました',
    cultureChanged: '文化圏が {culture} に変更されました',
    navigated: '{item} に移動しました',
    optionSelected: 'オプションが選択されました',
    accessibilityUpdated: 'アクセシビリティ設定が更新されました'
  },
  audio: {
    welcome: 'HaQei Analyzerへようこそ。音声ガイダンスが有効になりました。'
  }
}

// 英語翻訳（基本版）
const en = {
  app: {
    title: 'HaQei Analyzer'
  },
  HaQei: {
    title: 'Bunenjin Philosophy',
    facets: {
      primary: 'Primary Facet',
      primaryDesc: 'Your core personality aspect',
      secondary: 'Secondary Facet',
      secondaryDesc: 'Sub-personality expression',
      tertiary: 'Tertiary Facet', 
      tertiaryDesc: 'Hidden personality elements',
      quaternary: 'Quaternary Facet',
      quaternaryDesc: 'Potential personality possibilities'
    },
    pillars: {
      multifaceted: {
        title: 'Multifaceted Acceptance',
        description: 'Ability to accept multiple contradictory aspects simultaneously'
      },
      harmony: {
        title: 'Harmony Pursuit',
        description: 'Wisdom to find balance between opposing elements'
      },
      change: {
        title: 'Change Acceptance',
        description: 'Flexibility to adapt to fluid situations'
      },
      strategy: {
        title: 'Strategic Navigation',
        description: 'Insight to read complex situations'
      }
    },
    harmony: {
      balance: 'Balance',
      balanceDesc: 'Maintaining harmonious state',
      acceptance: 'Acceptance',
      acceptanceDesc: 'Attitude of embracing change'
    }
  },
  tripleOS: {
    engine: {
      title: 'Engine OS'
    },
    interface: {
      title: 'Interface OS'
    },
    safemode: {
      title: 'SafeMode OS'
    },
    balance: 'Balance',
    strength: 'Strength',
    adaptability: 'Adaptability',
    protection: 'Protection',
    interactions: {
      title: 'Interactions',
      engine: 'Engine → Interface',
      interface: 'Interface → SafeMode',
      safemode: 'SafeMode → Engine'
    },
    balance: {
      title: 'Triple OS Balance',
      harmony: 'Harmony',
      stability: 'Stability',
      flexibility: 'Flexibility'
    }
  },
  iching: {
    navigation: {
      title: 'I Ching 64 Hexagrams Navigation'
    },
    sancai: {
      heaven: 'Heaven',
      human: 'Human',
      earth: 'Earth'
    },
    guidance: {
      title: 'Guidance'
    }
  },
  navigation: {
    main: 'Main Navigation',
    home: 'Home',
    homeDesc: 'Return to main page',
    analysis: 'Analysis',
    analysisDesc: 'Personality analysis',
    wisdom: 'Wisdom',
    wisdomDesc: 'I Ching wisdom',
    community: 'Community',
    communityDesc: 'Join community'
  },
  sections: {
    easternWisdom: 'Eastern Wisdom',
    westernTheory: 'Western Theory',
    HaQeiCore: 'Bunenjin Core',
    culturalExploration: 'Cultural Exploration'
  },
  wisdom: {
    title: 'Eastern Wisdom'
  },
  theory: {
    title: 'Western Theory',
    subtitle: 'Scientific Approach'
  },
  examples: {
    title: 'Examples'
  },
  exploration: {
    title: 'Cultural Exploration',
    valuesTitle: 'Values Comparison',
    adaptabilityTitle: 'Adaptability Test',
    responseOptions: 'Response Options',
    culturalInsight: 'Cultural Insight'
  },
  dimensions: {
    individualism: 'Individualism',
    hierarchy: 'Hierarchy',
    uncertainty: 'Uncertainty Avoidance',
    longterm: 'Long-term Orientation'
  },
  scenarios: {
    conflict: {
      title: 'Conflict Resolution Scenario',
      description: 'When conflicts arise at work, how do you handle them?',
      options: {
        direct: 'Direct dialogue',
        mediated: 'Third-party mediation',
        indirect: 'Indirect approach',
        avoidance: 'Avoidance & time resolution'
      }
    },
    decision: {
      title: 'Decision Making Scenario',
      description: 'When you need to make important decisions, what process do you follow?',
      options: {
        individual: 'Individual decision',
        consensus: 'Group consensus',
        authority: 'Delegate to authority',
        intuitive: 'Follow intuition'
      }
    }
  },
  feedback: {
    generic: 'Your choice of {option} is an interesting approach.'
  },
  accessibility: {
    title: 'Accessibility Settings',
    settings: 'Accessibility Settings',
    selectLanguage: 'Select Language',
    selectCulture: 'Select Culture',
    highContrast: 'High Contrast',
    largeText: 'Large Text',
    reducedMotion: 'Reduced Motion',
    audioGuide: 'Audio Guide',
    keyboardHelp: 'Keyboard Help',
    keyboardShortcuts: 'Keyboard Shortcuts',
    pauseAudio: 'Pause Audio',
    playAudio: 'Play Audio',
    transcript: 'Audio Transcript',
    valuesChart: 'Values Chart'
  },
  shortcuts: {
    tab: 'Move to next element',
    enter: 'Select/Execute',
    space: 'Toggle checkbox',
    escape: 'Close dialog',
    language: 'Language selection',
    culture: 'Culture selection',
    help: 'Show help'
  },
  announcements: {
    languageChanged: 'Language changed to {language}',
    cultureChanged: 'Culture changed to {culture}',
    navigated: 'Navigated to {item}',
    optionSelected: 'Option selected',
    accessibilityUpdated: 'Accessibility settings updated'
  },
  audio: {
    welcome: 'Welcome to HaQei Analyzer. Audio guidance is now enabled.'
  }
}

const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
    ja,
    en
  }
})

export default i18n