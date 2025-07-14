// public/js/questions.js

export const WORLDVIEW_QUESTIONS = [
  {
    id: "wvq1",
    text: "チームを率いる時、あなたのスタイルは？",
    options: [
      {
        text: "明確なビジョンと強いリーダーシップで、自ら先頭に立って全体を引っ張っていく。",
        scoring_tags: [
          { type: "TRIGRAM", key: "乾", value: 2 },
          { type: "THEME", key: "革新性", value: 2 },
          { type: "THEME", key: "リーダーシップ", value: 2 },
        ],
      },
      {
        text: "メンバー一人ひとりの意見に耳を傾け、皆が能力を発揮できる土台や環境を整える。",
        scoring_tags: [
          { type: "TRIGRAM", key: "坤", value: 2 },
          { type: "THEME", key: "調和性", value: 2 },
          { type: "THEME", key: "貢献性", value: 1 },
        ],
      },
    ],
  },
  {
    id: "wvq2",
    text: "複雑で、答えのない問題に直面した時、どうする？",
    options: [
      {
        text: "まず情報を集め、論理的に分析することで、問題の構造や本質を明らかにする。",
        scoring_tags: [
          { type: "TRIGRAM", key: "離", value: 2 },
          { type: "THEME", key: "探求性", value: 2 },
        ],
      },
      {
        text: "焦らず、困難な状況を耐えながら、物事の真理や核心が見えてくるのを待つ。",
        scoring_tags: [
          { type: "TRIGRAM", key: "坎", value: 2 },
          { type: "THEME", key: "安定性", value: 2 },
        ],
      },
    ],
  },
  {
    id: "wvq3",
    text: "チームが停滞し、活気を失っている時、どうする？",
    options: [
      {
        text: "まず、インパクトのある「行動」を起こすことで、停滞した空気を打ち破り、チームに刺激を与える。",
        scoring_tags: [
          { type: "TRIGRAM", key: "震", value: 2 },
          { type: "THEME", key: "革新性", value: 2 },
        ],
      },
      {
        text: "まず、なぜ停滞しているのか、その根本原因を一人で静かに考え、内省する時間をとる。",
        scoring_tags: [
          { type: "TRIGRAM", key: "艮", value: 2 },
          { type: "THEME", key: "安定性", value: 2 },
        ],
      },
    ],
  },
  {
    id: "wvq4",
    text: "新しい人との関係を築く時、あなたの得意な方法は？",
    options: [
      {
        text: "相手の心に寄り添い、丁寧な対話を重ねることで、時間をかけて徐々に信頼を浸透させていく。",
        scoring_tags: [
          { type: "TRIGRAM", key: "巽", value: 2 },
          { type: "THEME", key: "調和性", value: 2 },
        ],
      },
      {
        text: "ユーモアを交え、喜びや楽しみをオープンに分かち合うことで、一気に心の距離を縮める。",
        scoring_tags: [
          { type: "TRIGRAM", key: "兌", value: 2 },
          { type: "THEME", key: "表現性", value: 2 },
        ],
      },
    ],
  },
  {
    id: "wvq5",
    text: "あなたが社会に貢献するなら、どちらのアプローチを選ぶ？",
    options: [
      {
        text: "古い常識やシステムを大胆に刷新する「革命」によって、全く新しい社会を創造する。",
        scoring_tags: [
          { type: "TRIGRAM", key: "離", value: 1 },
          { type: "THEME", key: "革新性", value: 3 },
        ],
      },
      {
        text: "人々が安心して暮らせる「器」の中で、豊かな文化や人間関係を、時間をかけてじっくりと育む。",
        scoring_tags: [
          { type: "TRIGRAM", key: "坤", value: 1 },
          { type: "THEME", key: "安定性", value: 3 },
        ],
      },
    ],
  },
];

export const SCENARIO_QUESTIONS = [
  {
    id: "q1",
    scenario:
      "友人たちとの楽しい旅行計画が、予期せぬトラブルで完全に白紙に戻ってしまいました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる行動」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「残念すぎる…」という喪失感や悲しみに沈む",
          scoring_tags: [
            { type: "TRIGRAM", key: "坎", value: 2 },
            { type: "TRIGRAM", key: "艮", value: 1 },
            { type: "THEME", key: "安定性", value: 2 },
          ],
        },
        {
          text: "「なぜこうなった？」と原因を分析し、状況を知的に理解しようとする",
          scoring_tags: [
            { type: "TRIGRAM", key: "離", value: 2 },
            { type: "TRIGRAM", key: "艮", value: 1 },
            { type: "THEME", key: "探求性", value: 2 },
          ],
        },
        {
          text: "「まあ仕方ない、次どうするか考えよう」と、すぐに気持ちを切り替える",
          scoring_tags: [
            { type: "TRIGRAM", key: "震", value: 2 },
            { type: "TRIGRAM", key: "乾", value: 1 },
            { type: "THEME", key: "革新性", value: 2 },
          ],
        },
      ],
      outer: [
        {
          text: "「私が新しい計画を立てる！」と率先してリーダーシップを発揮する",
          scoring_tags: [
            { type: "TRIGRAM", key: "乾", value: 3 },
            { type: "TRIGRAM", key: "震", value: 1 },
            { type: "THEME", key: "リーダーシップ", value: 2 },
          ],
        },
        {
          text: "「皆がっかりしてるだろう」と、まずメンバーのケアや慰めを優先する",
          scoring_tags: [
            { type: "TRIGRAM", key: "坤", value: 2 },
            { type: "TRIGRAM", key: "巽", value: 2 },
            { type: "TRIGRAM", key: "乾", value: -1 },
            { type: "THEME", key: "貢献性", value: 2 },
          ],
        },
        {
          text: "一旦「どうするかは、また後で考えよう」と、状況を静観する",
          scoring_tags: [
            { type: "TRIGRAM", key: "艮", value: 3 },
            { type: "TRIGRAM", key: "坎", value: 1 },
            { type: "TRIGRAM", key: "震", value: -2 },
            { type: "THEME", key: "安定性", value: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "q2",
    scenario:
      "あなたは全く新しい分野のスキルを、ゼロから学ぶことになりました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる学び方」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「面白そう！」という好奇心と、新しい自分になれることへの期待感",
          scoring_tags: [
            { type: "TRIGRAM", key: "震", value: 2 },
            { type: "TRIGRAM", key: "離", value: 2 },
            { type: "TRIGRAM", key: "艮", value: -1 },
            { type: "THEME", key: "革新性", value: 2 },
          ],
        },
        {
          text: "「本当に自分にできるだろうか…」という不安と、失敗への恐れ",
          scoring_tags: [
            { type: "TRIGRAM", key: "坎", value: 2 },
            { type: "TRIGRAM", key: "艮", value: 1 },
            { type: "TRIGRAM", key: "乾", value: -2 },
            { type: "THEME", key: "安定性", value: 2 },
          ],
        },
        {
          text: "「どうせやるなら完璧に」という、知的な探求心と向上心",
          scoring_tags: [
            { type: "TRIGRAM", key: "乾", value: 2 },
            { type: "TRIGRAM", key: "坎", value: 1 },
            { type: "TRIGRAM", key: "兌", value: -1 },
            { type: "THEME", key: "探求性", value: 2 },
          ],
        },
      ],
      outer: [
        {
          text: "まず全体像を把握するため、関連書籍を何冊も読んで体系的に学ぶ",
          scoring_tags: [
            { type: "TRIGRAM", key: "艮", value: 2 },
            { type: "TRIGRAM", key: "離", value: 1 },
            { type: "TRIGRAM", key: "震", value: -1 },
            { type: "THEME", key: "探求性", value: 2 },
          ],
        },
        {
          text: "とにかく実践！専門家や経験者に積極的に質問し、試行錯誤しながら学ぶ",
          scoring_tags: [
            { type: "TRIGRAM", key: "震", value: 3 },
            { type: "TRIGRAM", key: "兌", value: 1 },
            { type: "TRIGRAM", key: "艮", value: -2 },
            { type: "THEME", key: "革新性", value: 2 },
          ],
        },
        {
          text: "同じ目標を持つ仲間を見つけ、勉強会を開くなど、協調しながら学ぶ",
          scoring_tags: [
            { type: "TRIGRAM", key: "巽", value: 2 },
            { type: "TRIGRAM", key: "坤", value: 2 },
            { type: "TRIGRAM", key: "乾", value: -1 },
            { type: "THEME", key: "調和性", value: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "q3",
    scenario:
      "あなたの意見が、会議で他のメンバーから真っ向から反対されました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる行動」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「なぜ理解できないんだ！」という怒りや、自分の正しさへの確信",
          scores: { 1: 2, 3: 1, 8: -2 },
        },
        {
          text: "「私の説明が悪かったのかも…」という自己反省と、関係悪化への不安",
          scores: { 8: 2, 5: 1, 1: -1 },
        },
        {
          text: "「なるほど、そういう視点もあるのか」という知的な興味",
          scores: { 6: 2, 7: 1, 4: -1 },
        },
      ],
      outer: [
        {
          text: "感情的にならず、データや論理を用いて、冷静に相手を説得しようと試みる",
          scores: { 3: 2, 1: 1, 2: -1 },
        },
        {
          text: "一旦相手の意見を受け入れ、共通の落としどころを探る対話的なアプローチをとる",
          scores: { 5: 3, 8: 1, 1: -1 },
        },
        {
          text: "議論を中断し、時間を置いて、別の角度から再度アプローチする",
          scores: { 7: 2, 6: 1, 4: -1 },
        },
      ],
    },
  },
  {
    id: "q4",
    scenario:
      "あなたはプロジェクトで大きな成功を収め、周囲から絶賛されています。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる行動」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「最高に気持ちいい！」という達成感と、さらなる成功への意欲",
          scores: { 3: 2, 4: 2, 8: -1 },
        },
        {
          text: "「皆のおかげだ」という、周囲への感謝と謙虚な気持ち",
          scores: { 8: 2, 2: 1, 1: -2 },
        },
        {
          text: "「なぜ成功したのか」を冷静に分析し、次への再現性を考える",
          scores: { 7: 2, 1: 1, 3: -1 },
        },
      ],
      outer: [
        {
          text: "成功を祝う盛大なパーティーを開き、喜びを仲間と分かち合う",
          scores: { 2: 3, 3: 1, 7: -1 },
        },
        {
          text: "すぐに次の目標を設定し、休みなく次の挑戦へと向かう",
          scores: { 1: 2, 4: 1, 8: -1 },
        },
        {
          text: "成功体験をマニュアル化し、後進の育成や組織の発展に貢献する",
          scores: { 5: 2, 8: 1, 4: -1 },
        },
      ],
    },
  },
  {
    id: "q5",
    scenario:
      "あなたと親友が、些細なことから気まずい雰囲気になってしまいました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる行動」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「自分が何か悪いことをしたかも…」と、自分を責め、不安になる",
          scores: { 8: 2, 6: 1 },
        },
        {
          text: "「面倒なことになったな…」と、問題から目をそらし、距離を置きたくなる",
          scores: { 7: 2, 5: -1 },
        },
        {
          text: "「早く仲直りしたい」と、解決を焦る気持ちが強くなる",
          scores: { 4: 2, 2: 1 },
        },
      ],
      outer: [
        {
          text: "自分から「あの時はごめん」と率直に謝り、関係修復を図る",
          scores: { 2: 2, 4: 1 },
        },
        {
          text: "しばらく時間を置き、相手からの連絡を待つ",
          scores: { 7: 2, 8: 1 },
        },
        {
          text: "共通の友人に相談し、間を取り持ってもらおうとする",
          scores: { 5: 3, 2: -1 },
        },
      ],
    },
  },
  {
    id: "q6",
    scenario:
      "あなたは、丸一日、誰にも邪魔されない完全な自由時間が与えられました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際に過ごす時間」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「何をしようか？」とワクワクし、やりたいことが次々と思い浮かぶ",
          scores: { 3: 2, 4: 2 },
        },
        {
          text: "「やっと休める…」と、心身の休息を最優先にしたいと感じる",
          scores: { 8: 2, 7: 1 },
        },
        {
          text: "「どうせなら有意義に」と、普段できない自己投資や勉強を計画する",
          scores: { 1: 2, 6: 2 },
        },
      ],
      outer: [
        {
          text: "結局、家でゴロゴロしたり、特に何もせずに過ごしてしまう",
          scores: { 8: 2, 7: -1 },
        },
        {
          text: "溜まっていた趣味や創作活動に、時間を忘れて没頭する",
          scores: { 6: 2, 3: 1 },
        },
        {
          text: "友人を誘って食事に行ったり、イベントに出かけたりして、積極的に人と交流する",
          scores: { 2: 3, 5: 1 },
        },
      ],
    },
  },
  {
    id: "q7",
    scenario:
      "これまで順調だった物事が、急に停滞し、先の見えない状況になりました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる行動」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「やり方が悪かったのか？」と、過去の行動を分析し、問題点を探す",
          scores: { 7: 2, 6: 1 },
        },
        {
          text: "「これも一つの流れだ」と、状況をあるがままに受け入れ、静観する",
          scores: { 8: 2, 5: 1 },
        },
        {
          text: "「このままではダメだ！」と、強い危機感と、変化への渇望を感じる",
          scores: { 4: 2, 1: 1 },
        },
      ],
      outer: [
        {
          text: "根本的な原因が分かるまで、全ての行動を一旦ストップする",
          scores: { 7: 3, 6: -1 },
        },
        {
          text: "停滞を打破するため、全く新しいアプローチや、奇抜なアイデアを試す",
          scores: { 4: 2, 3: 1 },
        },
        {
          text: "周囲の意見を広く聞き、協力体制を再構築しようと試みる",
          scores: { 5: 2, 8: 1 },
        },
      ],
    },
  },
  {
    id: "q8",
    scenario:
      "あなたは、全く興味のなかった分野に、偶然触れる機会がありました。",
    inner_q: "この時、あなたの「心の中」で、最初に強く湧き上がる感情や思考は？",
    outer_q: "そして、あなたが「実際にとる行動」に、最も近いのは？",
    options: {
      inner: [
        {
          text: "「意外と面白いかも」と、新しい世界への好奇心が刺激される",
          scores: { 2: 2, 5: 1 },
        },
        {
          text: "「自分の専門とは違う」と、知的な壁を作り、深く関わることを避ける",
          scores: { 7: 2, 1: -1 },
        },
        {
          text: "「なぜ今まで知らなかったんだろう」と、その分野の歴史や背景を知りたくなる",
          scores: { 6: 2, 8: 1 },
        },
      ],
      outer: [
        {
          text: "その場でSNSでシェアしたり、誰かにその面白さを話したりする",
          scores: { 2: 2, 3: 1 },
        },
        {
          text: "その分野の入門書を数冊購入し、自分の知識体系に組み込もうとする",
          scores: { 6: 2, 1: 1 },
        },
        {
          text: "一度きりの体験として楽しみ、それ以上深入りはしない",
          scores: { 5: -1, 7: 1 },
        },
      ],
    },
  },
];
