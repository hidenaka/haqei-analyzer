/**
 * シナリオ設問データ（q26-q30）専用ファイル
 * 
 * 目的：
 * - 極限状況での行動パターン分析
 * - 内面と外面の行動の整合性測定
 * - Triple OS の動的な相互作用の観察
 * 
 * 特徴：
 * - 具体的な状況設定（scenario）
 * - 内面の反応（inner）と外面の行動（outer）を分離
 * - 易経の卦との対応による深層心理分析
 */

import type { ScenarioQuestion } from './types'

export const SCENARIO_QUESTIONS_EXTENDED: ScenarioQuestion[] = [
  {
    id: "q26",
    text: "シナリオ質問：友人の裏切り",
    scenario: "信頼していた友人が、あなたの知らないところで批判的なことを言っていたことを知ってしまいました。",
    situation_hexagram: "風天小畜",
    hexagram_number: 9,
    hexagram_meaning: "風が天を制止する、小さな力で大きな流れを阻む。信頼関係の微細な亀裂を問う",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（その人への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「これも経験だ」と前向きに捉える",
          scoring_tags: [
            { key: "乾_創造性", value: 1.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "兌_調和性", value: 1.0 },
          ],
        },
        {
          value: "B",
          text: "怒りと裏切られた悲しみを感じる",
          scoring_tags: [
            { key: "震_行動性", value: 2.0 },
            { key: "離_表現性", value: 1.5 },
            { key: "坤_受容性", value: -2.0 },
          ],
        },
        {
          value: "C",
          text: "「何か理由があるはずだ」と冷静に考える",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "坤_受容性", value: 1.0 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "深く傷つき、人間関係への不安を感じる",
          scoring_tags: [
            { key: "坤_受容性", value: -1.5 },
            { key: "艮_安定性", value: -1.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "ショックだが、関係を修復したいと思う",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "直接本人に話して、はっきりさせる",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 2.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "何事もなかったように、普段通りに接する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "巽_適応性", value: 1.5 },
            { key: "離_表現性", value: -1.5 },
          ],
        },
        {
          value: "C",
          text: "第三者を交えて冷静に話し合う",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "兌_調和性", value: 2.0 },
            { key: "艮_安定性", value: 1.5 },
          ],
        },
        {
          value: "D",
          text: "距離を置いて、関係を自然に薄くしていく",
          scoring_tags: [
            { key: "艮_安定性", value: 2.0 },
            { key: "坎_探求性", value: 1.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "率直に傷ついた気持ちを伝える",
          scoring_tags: [
            { key: "離_表現性", value: 2.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
      ],
    },
  },
  {
    id: "q27",
    text: "シナリオ質問：家族との対立",
    scenario: "あなたの重要な決断（進路、転職、結婚、住む場所など）について、家族や親しい人が強く反対しています。",
    situation_hexagram: "火山旅",
    hexagram_number: 56,
    hexagram_meaning: "山の上の火、一時的で不安定な状況。家族関係の離散状態での行動指針を問う",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（家族への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「自分の人生だから」と自分の意志を貫こうとする",
          scoring_tags: [
            { key: "乾_創造性", value: 2.5 },
            { key: "震_行動性", value: 2.0 },
            { key: "坤_受容性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "家族の心配も理解できるが、自分の決断に確信を持つ",
          scoring_tags: [
            { key: "兌_調和性", value: 2.0 },
            { key: "艮_安定性", value: 1.5 },
            { key: "離_表現性", value: 1.0 },
          ],
        },
        {
          value: "C",
          text: "家族を悲しませたくない気持ちと自分の願いの間で揺れる",
          scoring_tags: [
            { key: "坤_受容性", value: 2.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "どうすれば家族に理解してもらえるか冷静に考える",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "巽_適応性", value: 1.5 },
            { key: "震_行動性", value: 0.5 },
          ],
        },
        {
          value: "E",
          text: "時間をかければきっと理解してもらえると信じる",
          scoring_tags: [
            { key: "艮_安定性", value: 2.0 },
            { key: "坤_受容性", value: 1.5 },
            { key: "兌_調和性", value: 1.0 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "毅然とした態度で自分の決意を表明する",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 2.0 },
            { key: "坤_受容性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "時間をかけて丁寧に説明し、理解を求める",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "離_表現性", value: 2.0 },
            { key: "艮_安定性", value: 1.0 },
          ],
        },
        {
          value: "C",
          text: "一時的に距離を置いて、お互い冷静になる時間を作る",
          scoring_tags: [
            { key: "艮_安定性", value: 2.0 },
            { key: "巽_適応性", value: 1.5 },
            { key: "兌_調和性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "家族の意見も聞き入れて、妥協点を探る",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "兌_調和性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "E",
          text: "第三者の意見も取り入れて、客観的に話し合う",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "巽_適応性", value: 1.5 },
            { key: "兌_調和性", value: 1.5 },
          ],
        },
      ],
    },
  },
  {
    id: "q28",
    text: "シナリオ質問：緊急事態",
    scenario: "突然の事故や災害、急病など、予想外の緊急事態が発生しました。迅速な判断と行動が求められています。",
    situation_hexagram: "水雷屯",
    hexagram_number: 3,
    hexagram_meaning: "雷が水中にあり、動きが困難な状況。初動期の混乱への対処を問う",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（周囲への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "パニックになりそうだが、「冷静にならなければ」と自分に言い聞かせる",
          scoring_tags: [
            { key: "艮_安定性", value: 2.0 },
            { key: "震_行動性", value: 1.0 },
            { key: "坤_受容性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "アドレナリンが出て、むしろ頭がクリアになる感覚",
          scoring_tags: [
            { key: "震_行動性", value: 3.0 },
            { key: "坎_探求性", value: 1.5 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "周りの人の安全を第一に考える",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "兌_調和性", value: 2.0 },
            { key: "乾_創造性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "まずは状況を正確に把握しようとする",
          scoring_tags: [
            { key: "坎_探求性", value: 3.0 },
            { key: "艮_安定性", value: 1.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "E",
          text: "「こういう時こそ自分の力を発揮する時だ」と奮起する",
          scoring_tags: [
            { key: "乾_創造性", value: 2.5 },
            { key: "震_行動性", value: 2.0 },
            { key: "坤_受容性", value: -0.5 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "大声で周囲に指示を出し、人々を誘導する",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 2.5 },
            { key: "坤_受容性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "専門家や責任者を探して、適切な判断を仰ぐ",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "艮_安定性", value: 2.0 },
            { key: "震_行動性", value: 1.0 },
          ],
        },
        {
          value: "C",
          text: "できる範囲で周りの人をサポートし、協力して対処する",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: 1.0 },
          ],
        },
        {
          value: "D",
          text: "状況に応じて臨機応変に行動する",
          scoring_tags: [
            { key: "巽_適応性", value: 3.0 },
            { key: "震_行動性", value: 1.5 },
            { key: "艮_安定性", value: -1.0 },
          ],
        },
        {
          value: "E",
          text: "マニュアルや手順を思い出して、確実に実行する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "坎_探求性", value: 1.0 },
            { key: "巽_適応性", value: -0.5 },
          ],
        },
      ],
    },
  },
  {
    id: "q29",
    text: "シナリオ質問：激しい競争",
    scenario: "あなたが参加している競技やコンテスト、選考などで、他の参加者と競争する状況になりました。結果によって今後が大きく左右されます。",
    situation_hexagram: "地水師",
    hexagram_number: 7,
    hexagram_meaning: "地の下に水あり、統率と戦略が必要。競争状況での戦略的思考を問う",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（他の参加者への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「絶対に負けたくない」という強い闘志を燃やす",
          scoring_tags: [
            { key: "震_行動性", value: 3.0 },
            { key: "乾_創造性", value: 1.5 },
            { key: "坤_受容性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "「自分らしく精一杯やろう」と自分に集中する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "離_表現性", value: 1.5 },
            { key: "兌_調和性", value: 1.0 },
          ],
        },
        {
          value: "C",
          text: "他の参加者のレベルの高さに刺激を受ける",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "巽_適応性", value: 1.5 },
            { key: "坤_受容性", value: 1.5 },
          ],
        },
        {
          value: "D",
          text: "「結果より過程が大事」と自分を落ち着かせる",
          scoring_tags: [
            { key: "坤_受容性", value: 2.0 },
            { key: "艮_安定性", value: 1.5 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "E",
          text: "戦略的に相手の弱点を分析し、勝機を探る",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "巽_適応性", value: 2.0 },
            { key: "兌_調和性", value: -1.0 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "フレンドリーに接しながらも、決して気を抜かない",
          scoring_tags: [
            { key: "兌_調和性", value: 2.0 },
            { key: "巽_適応性", value: 2.0 },
            { key: "震_行動性", value: 1.5 },
          ],
        },
        {
          value: "B",
          text: "堂々と自信を持って、実力を存分に発揮する",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "乾_創造性", value: 2.0 },
            { key: "坤_受容性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "相手を尊重しつつ、正々堂々と競い合う",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "離_表現性", value: 1.0 },
          ],
        },
        {
          value: "D",
          text: "他の参加者から学べることを積極的に吸収する",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "震_行動性", value: 0.5 },
          ],
        },
        {
          value: "E",
          text: "心理戦も含めて、あらゆる手段で勝利を目指す",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "巽_適応性", value: 1.5 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
      ],
    },
  },
  {
    id: "q30",
    text: "シナリオ質問：道徳的ジレンマ",
    scenario: "あなたは正しいと思うことと、周囲の期待や利益が相反する状況に置かれました。どちらを選んでも何かを犠牲にしなければなりません。",
    situation_hexagram: "水風井",
    hexagram_number: 48,
    hexagram_meaning: "風が水を汲み上げる、相互扶助の象徴。道徳的判断での共同体配慮を問う",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（周囲への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「正しいことを貫くべきだ」という信念を持つ",
          scoring_tags: [
            { key: "乾_創造性", value: 2.5 },
            { key: "離_表現性", value: 2.0 },
            { key: "坤_受容性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "周囲との関係を壊したくない気持ちが強い",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "C",
          text: "「本当に正しいのは何か」を深く考え込む",
          scoring_tags: [
            { key: "坎_探求性", value: 3.0 },
            { key: "艮_安定性", value: 1.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "どちらを選んでも後悔しそうで、迷いが深い",
          scoring_tags: [
            { key: "坤_受容性", value: 1.0 },
            { key: "艮_安定性", value: -1.0 },
            { key: "震_行動性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "第三の道はないか、創造的な解決策を模索する",
          scoring_tags: [
            { key: "乾_創造性", value: 3.0 },
            { key: "巽_適応性", value: 2.0 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "自分の信念を率直に表明し、理解を求める",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 2.0 },
            { key: "兌_調和性", value: -0.5 },
          ],
        },
        {
          value: "B",
          text: "時間をかけて、みんなが納得できる解決策を探る",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "艮_安定性", value: 1.5 },
          ],
        },
        {
          value: "C",
          text: "一時的に判断を保留し、より多くの意見を聞く",
          scoring_tags: [
            { key: "坤_受容性", value: 2.0 },
            { key: "坎_探求性", value: 1.5 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "状況に応じて柔軟に対応し、最適解を見つける",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "離_表現性", value: 1.0 },
          ],
        },
        {
          value: "E",
          text: "責任を持って決断し、その結果を受け入れる",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "震_行動性", value: 2.0 },
            { key: "坤_受容性", value: 1.0 },
          ],
        },
      ],
    },
  },
]