// public/js/questions.js

export const WORLDVIEW_QUESTIONS = [
  {
    id: "wvq1",
    text: "チームプロジェクトで最も重要だと思うのは？",
    options: [
      {
        value: "A",
        text: "明確なリーダーと目標",
        scoring_tags: [
          { key: "リーダーシップ", value: 2 },
          { key: "権威・支配", value: 1.5 },
          { key: "実行・達成", value: 1 },
        ],
      },
      {
        value: "B",
        text: "メンバー間の信頼と協力",
        scoring_tags: [
          { key: "調和・平和", value: 2 },
          { key: "共感・受容", value: 1.5 },
          { key: "社交性・人脈", value: 1 },
        ],
      },
    ],
  },
  {
    id: "wvq2",
    text: "新しいスキルを学ぶとき、あなたのスタイルは？",
    options: [
      {
        value: "A",
        text: "まず全体像を把握し、理論から入る",
        scoring_tags: [
          { key: "探求・分析", value: 2 },
          { key: "慎重・計画", value: 1.5 },
          { key: "知的・論理", value: 1 },
        ],
      },
      {
        value: "B",
        text: "とりあえず実践してみて、失敗から学ぶ",
        scoring_tags: [
          { key: "行動・実行", value: 2 },
          { key: "挑戦・冒険", value: 1.5 },
          { key: "適応・柔軟", value: 1 },
        ],
      },
    ],
  },
  {
    id: "wvq3",
    text: "ストレスを感じた時、どうやって解消する？",
    options: [
      {
        value: "A",
        text: "一人で静かに内省し、問題の原因を探る",
        scoring_tags: [
          { key: "内省・分析", value: 2 },
          { key: "慎重・計画", value: 1.5 },
          { key: "独立・自立", value: 1 },
        ],
      },
      {
        value: "B",
        text: "友人と話したり、楽しいことで発散する",
        scoring_tags: [
          { key: "社交性・人脈", value: 2 },
          { key: "表現・創造", value: 1.5 },
          { key: "共感・受容", value: 1 },
        ],
      },
    ],
  },
  {
    id: "wvq4",
    text: "あなたが理想とする社会は？",
    options: [
      {
        value: "A",
        text: "個々の才能が輝く、活気ある競争社会",
        scoring_tags: [
          { key: "革新・変化", value: 2 },
          { key: "権威・支配", value: 1.5 },
          { key: "行動・実行", value: 1 },
        ],
      },
      {
        value: "B",
        text: "誰もが支え合う、穏やかで平和な社会",
        scoring_tags: [
          { key: "調和・平和", value: 2 },
          { key: "共感・受容", value: 1.5 },
          { key: "安定・継続", value: 1 },
        ],
      },
    ],
  },
];

export const SCENARIO_QUESTIONS = [
  {
    id: "scq1",
    scenario:
      "あなたのプロジェクトが、予期せぬ外部要因で大炎上。非難の矛先があなたに向かっています。",
    inner_q: "この時、あなたの心の中で最も強くなる感情は？",
    outer_q: "この状況で、あなたが最初にとる行動は？",
    options: {
      inner: [
        {
          text: "「なぜだ！」という怒りと、状況をコントロールしたい欲求",
          scoring_tags: [
            { key: "権威・支配", value: 2 },
            { key: "行動・実行", value: 1.5 },
            { key: "革新・変化", value: 1 },
          ],
        },
        {
          text: "「どうしよう…」という不安と、誰かに助けを求める気持ち",
          scoring_tags: [
            { key: "内省・分析", value: 2 },
            { key: "共感・受容", value: 1.5 },
            { key: "安定・継続", value: 1 },
          ],
        },
      ],
      outer: [
        {
          text: "即座に関係者を集め、対策会議を開き、主導権を握る",
          scoring_tags: [
            { key: "リーダーシップ", value: 2 },
            { key: "探求・分析", value: 1.5 },
            { key: "権威・支配", value: 1 },
          ],
        },
        {
          text: "信頼できる人に個別に連絡を取り、状況を共有し、意見を求める",
          scoring_tags: [
            { key: "社交性・人脈", value: 2 },
            { key: "共感・受容", value: 1.5 },
            { key: "調和・平和", value: 1 },
          ],
        },
      ],
    },
  },
  {
    id: "scq2",
    scenario:
      "あなたはチームリーダーとして、重要な決断を迫られています。A案はハイリスク・ハイリターン、B案はローリスク・ローリターンです。",
    inner_q: "この時、あなたの心はどちらに傾きやすい？",
    outer_q: "最終的に、あなたがチームに提案する可能性が高いのは？",
    options: {
      inner: [
        {
          text: "「一発逆転を狙いたい！」という興奮と、挑戦への魅力",
          scoring_tags: [
            { key: "行動・実行", value: 2 },
            { key: "革新・変化", value: 1.5 },
            { key: "挑戦・冒険", value: 1 },
          ],
        },
        {
          text: "「失敗は避けたい…」という慎重さと、安定への欲求",
          scoring_tags: [
            { key: "慎重・計画", value: 2 },
            { key: "安定・継続", value: 1.5 },
            { key: "内省・分析", value: 1 },
          ],
        },
      ],
      outer: [
        {
          text: "A案の魅力を熱弁し、チームを鼓舞して挑戦を促す",
          scoring_tags: [
            { key: "探求・分析", value: 2 },
            { key: "行動・実行", value: 1.5 },
            { key: "革新・変化", value: 1 },
          ],
        },
        {
          text: "B案の堅実さを強調し、リスクを避ける方向で合意形成を図る",
          scoring_tags: [
            { key: "慎重・計画", value: 2 },
            { key: "調和・平和", value: 1.5 },
            { key: "安定・継続", value: 1 },
          ],
        },
      ],
    },
  },
];
