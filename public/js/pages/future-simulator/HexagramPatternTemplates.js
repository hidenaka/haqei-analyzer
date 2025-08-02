/**
 * 384爻の本質的特徴テンプレート管理クラス
 * 
 * 目的：
 * - 64卦×6爻＝384の各状況の本質的特徴を定義
 * - SNS文章生成のための構造化されたテンプレート提供
 * - 各爻の固有性と普遍性のバランス管理
 * 
 * 構造：
 * - 各爻は状況構造、感情パターン、キーフレーズで定義
 * - Triple OSとの関連性も考慮
 * - 易経の伝統的解釈を現代的文脈に翻訳
 * 
 * 前提条件：
 * - 易経64卦の基本理解
 * - 各爻の変化の意味の把握
 * - 現代的な悩みとの対応関係
 */
class HexagramPatternTemplates {
  constructor() {
    this.templates = this.initializeTemplates();
    this.emotionCategories = this.defineEmotionCategories();
    this.situationTypes = this.defineSituationTypes();
    this.totalLines = 386; // 64卦×6爻 + 乾為天の用九 + 坤為地の用六
  }

  /**
   * 感情カテゴリの定義
   * 
   * 目的：
   * - SNS文章で表現される感情の分類
   * - 各爻と感情の対応関係明確化
   * 
   * 処理内容：
   * - 基本感情と複合感情の定義
   * - 強度レベルの設定
   * - 表現パターンの例示
   */
  defineEmotionCategories() {
    return {
      anxiety: {
        name: "不安・心配",
        expressions: ["不安", "心配", "怖い", "どうしよう"],
        intensity: { low: 0.3, medium: 0.6, high: 0.9 }
      },
      frustration: {
        name: "苛立ち・焦燥",
        expressions: ["イライラ", "もどかしい", "焦る", "うざい"],
        intensity: { low: 0.2, medium: 0.5, high: 0.8 }
      },
      sadness: {
        name: "悲しみ・落胆",
        expressions: ["悲しい", "辛い", "寂しい", "虚しい"],
        intensity: { low: 0.3, medium: 0.6, high: 0.9 }
      },
      confusion: {
        name: "困惑・迷い",
        expressions: ["わからない", "迷う", "混乱", "どっち"],
        intensity: { low: 0.2, medium: 0.5, high: 0.8 }
      },
      hope: {
        name: "希望・期待",
        expressions: ["期待", "楽しみ", "ワクワク", "きっと"],
        intensity: { low: 0.3, medium: 0.6, high: 0.9 }
      },
      determination: {
        name: "決意・覚悟",
        expressions: ["やるしかない", "決めた", "覚悟", "頑張る"],
        intensity: { low: 0.4, medium: 0.7, high: 0.95 }
      }
    };
  }

  /**
   * 状況タイプの定義
   * 
   * 目的：
   * - 384爻を状況パターンで分類
   * - 共通性の高い構造を抽出
   * 
   * 処理内容：
   * - 困難、成長、停滞、変化等の基本パターン
   * - 時間軸での分類
   * - 主体性レベルの考慮
   */
  defineSituationTypes() {
    return {
      beginning: "始まり・スタート地点",
      growth: "成長・発展過程",
      peak: "頂点・最高潮",
      decline: "衰退・下降",
      stagnation: "停滞・膠着",
      transformation: "変革・転換点",
      completion: "完成・終結",
      repetition: "繰り返し・ループ"
    };
  }

  /**
   * 384爻テンプレートの初期化
   * 
   * 目的：
   * - 全384爻の特徴定義
   * - 構造化されたデータ形式
   * 
   * 処理内容：
   * - 64卦×6爻の網羅的定義
   * - 各爻の本質的特徴抽出
   * - SNS文章生成用パラメータ設定
   * 
   * 注意事項：
   * - ここでは代表的な爻のみ詳細定義
   * - 実装時は全384爻を定義する必要あり
   */
  initializeTemplates() {
    const templates = {};
    
    // 1.乾為天（けんいてん）- 創造的な力
    templates[1] = {
      name: "乾為天",
      theme: "創造と主導",
      lines: {
        1: this.createLineTemplate(1, 1, {
          situation: "潜龍（せんりゅう）- 隠れた龍",
          essence: {
            type: "beginning",
            state: "潜在的な力を蓄える時期",
            challenge: "時期尚早な行動への誘惑",
            opportunity: "準備と学習"
          },
          emotions: ["anxiety", "hope", "frustration"],
          emotionWeight: { anxiety: 0.4, hope: 0.4, frustration: 0.2 },
          keyPhrases: [
            "まだ早い", "準備中", "タイミング待ち",
            "力を溜める", "我慢の時", "もうすぐ"
          ],
          snsPatterns: {
            young: ["まだ準備中だけど、ワクワクしてる", "タイミング見計らってる最中"],
            adult: ["今は力を蓄える時期だと理解している", "焦らず準備を進めています"],
            senior: ["若い頃なら飛び出していたが、今は待つことも知っている"]
          }
        }),
        2: this.createLineTemplate(1, 2, {
          situation: "見龍（けんりゅう）- 現れる龍",
          essence: {
            type: "growth",
            state: "才能が表に現れ始める",
            challenge: "周囲の期待と圧力",
            opportunity: "実力を示すチャンス"
          },
          emotions: ["hope", "anxiety", "determination"],
          emotionWeight: { hope: 0.5, anxiety: 0.3, determination: 0.2 },
          keyPhrases: [
            "チャンス到来", "実力発揮", "期待される",
            "プレッシャー", "やっと", "見てもらえる"
          ],
          snsPatterns: {
            young: ["やっとチャンス来た！でもちょっと緊張", "期待に応えたい💪"],
            adult: ["実力を発揮する機会が訪れた", "責任を感じるが、やりがいもある"],
            senior: ["若手に負けていられない。経験を活かす時"]
          }
        }),
        3: this.createLineTemplate(1, 3, {
          situation: "君子終日乾乾（くんししゅうじつけんけん）",
          essence: {
            type: "growth",
            state: "終日努力を続ける",
            challenge: "継続の困難さ",
            opportunity: "着実な成長"
          },
          emotions: ["determination", "frustration", "hope"],
          emotionWeight: { determination: 0.5, frustration: 0.3, hope: 0.2 },
          keyPhrases: [
            "毎日コツコツ", "地道に", "継続は力",
            "疲れるけど", "頑張り続ける", "少しずつ前進"
          ],
          snsPatterns: {
            young: ["毎日頑張ってるけど、たまに疲れる😅", "コツコツ続けるの大変"],
            adult: ["日々の積み重ねが大切だと実感", "継続することの難しさと価値を知る"],
            senior: ["若い頃はもっと楽だったが、今も頑張り続ける"]
          }
        }),
        4: this.createLineTemplate(1, 4, {
          situation: "或躍在淵（わくやくざいえん）",
          essence: {
            type: "transformation",
            state: "飛躍か留まるかの選択",
            challenge: "決断の重さ",
            opportunity: "大きな変化の可能性"
          },
          emotions: ["anxiety", "hope", "confusion"],
          emotionWeight: { anxiety: 0.4, hope: 0.3, confusion: 0.3 },
          keyPhrases: [
            "迷う", "どうしよう", "チャンスだけど",
            "リスクもある", "決断の時", "飛躍するか"
          ],
          snsPatterns: {
            young: ["大きなチャンス来たけど、正直迷ってる", "リスク取るべき？安全策？"],
            adult: ["キャリアの分岐点に立っている", "家族のことも考えると決断が難しい"],
            senior: ["この年齢で大きな挑戦をするべきか"]
          }
        }),
        5: this.createLineTemplate(1, 5, {
          situation: "飛龍在天（ひりゅうざいてん）",
          essence: {
            type: "peak",
            state: "最高の状態で活躍",
            challenge: "責任の重さ",
            opportunity: "大きな影響力"
          },
          emotions: ["determination", "hope", "anxiety"],
          emotionWeight: { determination: 0.5, hope: 0.3, anxiety: 0.2 },
          keyPhrases: [
            "絶好調", "リーダーとして", "責任重大",
            "みんなを導く", "プレッシャーも", "やりがい最高"
          ],
          snsPatterns: {
            young: ["今最高に調子いい！責任も感じるけど", "リーダー任されて頑張ってる"],
            adult: ["組織を導く立場として全力を尽くす", "大きな責任だが、やりがいを感じる"],
            senior: ["経験を活かして後進を導いている", "まだまだ現役で頑張れる"]
          }
        }),
        6: this.createLineTemplate(1, 6, {
          situation: "亢龍有悔（こうりゅうゆうかい）",
          essence: {
            type: "decline",
            state: "行き過ぎへの警告",
            challenge: "謙虚さの喪失",
            opportunity: "自省と調整"
          },
          emotions: ["frustration", "anxiety", "sadness"],
          emotionWeight: { frustration: 0.4, anxiety: 0.3, sadness: 0.3 },
          keyPhrases: [
            "調子に乗りすぎた", "反省", "やりすぎた",
            "批判される", "見直し必要", "謙虚に"
          ],
          snsPatterns: {
            young: ["調子乗りすぎて失敗した...反省", "もっと謙虚にならないと"],
            adult: ["成功に驕っていたことを痛感", "初心に戻る必要がある"],
            senior: ["年齢を重ねても謙虚さを忘れてはいけない"]
          }
        }),
        7: this.createLineTemplate(1, '用九', {
          situation: "群龍無首吉（ぐんりゅうむしゅきち）",
          essence: {
            type: "transformation",
            state: "全ての龍が首領なしに協調する",
            challenge: "個々の自律性の確立",
            opportunity: "理想的な協力体制"
          },
          emotions: ["hope", "determination", "anxiety"],
          emotionWeight: { hope: 0.5, determination: 0.4, anxiety: 0.1 },
          keyPhrases: [
            "協力", "自律", "理想的",
            "リーダー不要", "自然な調和", "成熟した組織"
          ],
          snsPatterns: {
            young: ["みんなが自立して協力できる理想的なチーム", "リーダーなしでも回る組織"],
            adult: ["成熟した組織では、特定のリーダーに依存しない", "自律的な協力体制の実現"],
            senior: ["長年の経験が、自然な協調を生む"]
          }
        })
      }
    };

    // 2.坤為地（こんいち）- 受容的な力
    templates[2] = {
      name: "坤為地",
      theme: "受容と従順",
      lines: {
        1: this.createLineTemplate(2, 1, {
          situation: "履霜堅氷至（りそうけんぴょういたる）",
          essence: {
            type: "beginning",
            state: "小さな兆候から大きな変化を察知",
            challenge: "微細な変化への注意",
            opportunity: "早期の対応"
          },
          emotions: ["anxiety", "confusion", "hope"],
          emotionWeight: { anxiety: 0.5, confusion: 0.3, hope: 0.2 },
          keyPhrases: [
            "なんか違う", "嫌な予感", "小さな変化",
            "気をつけないと", "早めに対処", "兆候"
          ],
          snsPatterns: {
            young: ["最近なんか雰囲気違うんだよね", "嫌な予感がする..."],
            adult: ["小さな変化を見逃さないようにしている", "早期対応が大切"],
            senior: ["経験から、この兆候は要注意だと分かる"]
          }
        }),
        // ... 他の爻も同様に定義
      }
    };

    // 29.坎為水（かんいすい）- 困難と危険
    templates[29] = {
      name: "坎為水",
      theme: "困難の中での学び",
      lines: {
        1: this.createLineTemplate(29, 1, {
          situation: "習坎入于坎窞（しゅうかんにゅうかんたん）",
          essence: {
            type: "beginning",
            state: "困難に慣れ、さらに深い困難へ",
            challenge: "連続する困難",
            opportunity: "困難への適応力"
          },
          emotions: ["anxiety", "frustration", "sadness"],
          emotionWeight: { anxiety: 0.4, frustration: 0.3, sadness: 0.3 },
          keyPhrases: [
            "また問題", "次から次へ", "慣れてきた",
            "どんどん深く", "抜け出せない", "覚悟決めた"
          ],
          snsPatterns: {
            young: ["問題が次から次へと...もう慣れたけど", "どんどん深みにハマってる感"],
            adult: ["困難が連続しているが、対処法も身についてきた", "この状況も学びと捉える"],
            senior: ["人生、困難の連続だが、それも含めて人生"]
          }
        }),
        2: this.createLineTemplate(29, 2, {
          situation: "坎有険求小得（かんけんありしょうしょうをもとめてう）",
          essence: {
            type: "stagnation",
            state: "危険の中で小さな成果",
            challenge: "大きな成果への焦り",
            opportunity: "着実な前進"
          },
          emotions: ["frustration", "hope", "anxiety"],
          emotionWeight: { frustration: 0.4, hope: 0.3, anxiety: 0.3 },
          keyPhrases: [
            "少しずつ", "小さな成果", "焦るけど",
            "危ない中でも", "前進してる", "地道に"
          ],
          snsPatterns: {
            young: ["ちょっとずつだけど前に進んでる", "もっと早く結果出したいけど"],
            adult: ["困難な状況でも小さな成果を積み重ねる", "焦らず着実に進む"],
            senior: ["若い頃は焦ったが、小さな一歩も大切"]
          }
        }),
        3: this.createLineTemplate(29, 3, {
          situation: "来之坎坎険且枕（きたるもかんかんけんかつちん）",
          essence: {
            type: "repetition",
            state: "困難が繰り返し訪れる",
            challenge: "精神的疲労",
            opportunity: "忍耐力の獲得"
          },
          emotions: ["frustration", "sadness", "anxiety"],
          emotionWeight: { frustration: 0.5, sadness: 0.3, anxiety: 0.2 },
          keyPhrases: [
            "また同じ", "繰り返し", "デジャブ",
            "疲れた", "いつまで", "堂々巡り"
          ],
          snsPatterns: {
            young: ["また同じ問題...デジャブかよ😔", "もう疲れた、いつまで続くの"],
            adult: ["同じ困難が繰り返される。根本解決が必要か", "精神的に疲労が蓄積している"],
            senior: ["人生、同じような困難の繰り返しだと悟った"]
          }
        }),
        // ... 残りの爻も定義
      }
    };

    // 30.離為火（りいか）- 明るさと依存
    templates[30] = {
      name: "離為火",
      theme: "明晰と執着",
      lines: {
        1: this.createLineTemplate(30, 1, {
          situation: "履錯然敬之無咎（りさくぜんこれをうやまえばとがなし）",
          essence: {
            type: "beginning",
            state: "慎重な始まり、足元に注意",
            challenge: "性急な行動への誘惑",
            opportunity: "慎重さが安全をもたらす"
          },
          emotions: ["anxiety", "hope", "confusion"],
          emotionWeight: { anxiety: 0.4, hope: 0.3, confusion: 0.3 },
          keyPhrases: [
            "慎重に", "足元注意", "ゆっくり",
            "様子見", "一歩ずつ", "確認しながら"
          ],
          snsPatterns: {
            young: ["新しいこと始めるけど、めっちゃ慎重になってる", "ゆっくり進もう"],
            adult: ["焦らず着実に進むことの大切さを実感", "慎重な姿勢が求められる"],
            senior: ["若い頃なら突っ走ったが、今は慎重に"]
          }
        }),
        2: this.createLineTemplate(30, 2, {
          situation: "黄離元吉（こうりげんきち）",
          essence: {
            type: "growth",
            state: "穏やかな光、中庸の美徳",
            challenge: "地味さへの不満",
            opportunity: "安定した成長"
          },
          emotions: ["hope", "determination", "frustration"],
          emotionWeight: { hope: 0.5, determination: 0.3, frustration: 0.2 },
          keyPhrases: [
            "順調", "地道に", "派手じゃないけど",
            "安定してる", "コツコツ", "確実に前進"
          ],
          snsPatterns: {
            young: ["派手じゃないけど、着実に成果出てる", "地味だけど大事なことやってる"],
            adult: ["中庸の大切さを理解し、着実に進む", "派手さより確実性を重視"],
            senior: ["若い頃の派手さより、今の安定が心地よい"]
          }
        }),
        3: this.createLineTemplate(30, 3, {
          situation: "日昃之離不鼓缶而歌（にっしょくのりふをうたずしてうたう）",
          essence: {
            type: "decline",
            state: "日没の寂しさ、人生の黄昏",
            challenge: "老いへの不安",
            opportunity: "人生の知恵の獲得"
          },
          emotions: ["sadness", "anxiety", "confusion"],
          emotionWeight: { sadness: 0.4, anxiety: 0.3, confusion: 0.3 },
          keyPhrases: [
            "寂しい", "もう遅い", "黄昏時",
            "振り返る", "昔は", "今更"
          ],
          snsPatterns: {
            young: ["なんか寂しい気分...青春終わった感", "もう戻れないんだな"],
            adult: ["人生の折り返し地点を意識する", "若さが懐かしくなる時がある"],
            senior: ["人生の黄昏を感じるが、それも悪くない"]
          }
        })
      }
    };

    // 4.山水蒙（さんすいもう）- 蒙昧と教育
    templates[4] = {
      name: "山水蒙",
      theme: "無知と学び",
      lines: {
        1: this.createLineTemplate(4, 1, {
          situation: "発蒙利用刑人（はつもうけいじんをもちいるによろし）",
          essence: {
            type: "beginning",
            state: "無知からの脱却、厳しい指導",
            challenge: "厳格さへの反発",
            opportunity: "根本的な学び"
          },
          emotions: ["frustration", "confusion", "hope"],
          emotionWeight: { frustration: 0.4, confusion: 0.4, hope: 0.2 },
          keyPhrases: [
            "わからない", "難しい", "厳しい",
            "基礎から", "怒られた", "勉強しなきゃ"
          ],
          snsPatterns: {
            young: ["めっちゃ怒られた...でも確かに自分が悪い", "基礎からやり直しだ😓"],
            adult: ["厳しい指導だが、必要なことだと理解", "無知を認めて学び直す"],
            senior: ["今更ながら基本の大切さを痛感"]
          }
        }),
        2: this.createLineTemplate(4, 2, {
          situation: "包蒙吉納婦吉（ほうもうきちふをいれてきち）",
          essence: {
            type: "growth",
            state: "寛容な指導、包容力",
            challenge: "甘やかしの誘惑",
            opportunity: "優しさによる成長"
          },
          emotions: ["hope", "determination", "anxiety"],
          emotionWeight: { hope: 0.5, determination: 0.3, anxiety: 0.2 },
          keyPhrases: [
            "優しく教えて", "包み込まれる", "安心",
            "ゆっくり学ぶ", "理解してくれる", "感謝"
          ],
          snsPatterns: {
            young: ["優しく教えてもらえて嬉しい😊", "こういう先生最高"],
            adult: ["包容力のある指導者に出会えた幸運", "優しさの中で成長できる"],
            senior: ["若い人を優しく導くことの大切さ"]
          }
        })
      }
    };

    // 41.山沢損（さんたくそん）- 減少と誠実
    templates[41] = {
      name: "山沢損",
      theme: "損失と真心",
      lines: {
        1: this.createLineTemplate(41, 1, {
          situation: "已事遄往無咎酌損之（やめてことすみやかにゆけばとがなしこれをはかりてそんず）",
          essence: {
            type: "beginning",
            state: "素早い撤退、損切りの決断",
            challenge: "執着を捨てる困難",
            opportunity: "迅速な対応による被害最小化"
          },
          emotions: ["anxiety", "determination", "sadness"],
          emotionWeight: { anxiety: 0.4, determination: 0.4, sadness: 0.2 },
          keyPhrases: [
            "損切り", "早めに撤退", "諦める",
            "見切りをつける", "もったいないけど", "決断"
          ],
          snsPatterns: {
            young: ["もったいないけど、ここで損切り", "早めに諦めるのも大事だよね"],
            adult: ["ビジネスでの損切り判断。苦渋の決断だが必要", "執着を捨てる勇気"],
            senior: ["長年の経験から、早めの撤退の重要性を知る"]
          }
        }),
        3: this.createLineTemplate(41, 3, {
          situation: "三人行則損一人一人行則得其友（さんにんゆけばすなわちいちにんをそんずいちにんゆけばすなわちそのともをう）",
          essence: {
            type: "transformation",
            state: "人数の調整、適切な関係",
            challenge: "グループダイナミクスの難しさ",
            opportunity: "真の友を得る"
          },
          emotions: ["confusion", "sadness", "hope"],
          emotionWeight: { confusion: 0.4, sadness: 0.3, hope: 0.3 },
          keyPhrases: [
            "三人は多い", "二人がちょうどいい", "友達関係",
            "グループの難しさ", "一対一", "本当の友"
          ],
          snsPatterns: {
            young: ["3人グループって難しい...誰か疎外感感じちゃう", "やっぱ親友は1人"],
            adult: ["チーム編成の難しさ。人数が多すぎても少なすぎても", "適切な人間関係の距離感"],
            senior: ["人生経験から、真の友は少数でいいと悟る"]
          }
        }),
        7: this.createLineTemplate(2, '用六', {
          situation: "利永貞（えいていによろし）",
          essence: {
            type: "completion",
            state: "永続的な貞節を保つ",
            challenge: "一貫性の維持",
            opportunity: "長期的な安定"
          },
          emotions: ["determination", "hope", "anxiety"],
          emotionWeight: { determination: 0.5, hope: 0.3, anxiety: 0.2 },
          keyPhrases: [
            "永続", "一貫性", "貞節",
            "変わらない", "続ける", "安定"
          ],
          snsPatterns: {
            young: ["ずっと変わらないものを大切にしたい", "一貫性って大事"],
            adult: ["長期的な視点で、一貫した姿勢を保つ", "永続的な価値を追求"],
            senior: ["人生を通じて変わらない価値観がある"]
          }
        })
      }
    };

    // 3.水雷屯（すいらいちゅん）- 創始の困難
    templates[3] = {
      name: "水雷屯",
      theme: "始まりの困難と成長",
      lines: {
        1: this.createLineTemplate(3, 1, {
          situation: "磐桓利居貞利建侯（ばんかんていにおるによろしこうをたつるによろし）",
          essence: {
            type: "beginning",
            state: "始動の躊躇、基礎固めの時",
            challenge: "前進への不安",
            opportunity: "堅実な基盤構築"
          },
          emotions: ["anxiety", "hope", "confusion"],
          emotionWeight: { anxiety: 0.5, hope: 0.3, confusion: 0.2 },
          keyPhrases: [
            "まだ動けない", "準備が必要", "基礎固め",
            "慎重に", "焦らない", "土台作り"
          ],
          snsPatterns: {
            young: ["新しいこと始めたいけど、まだ準備不足かな", "焦っても仕方ない、基礎から"],
            adult: ["起業準備中。まずは基盤をしっかり固める", "急がば回れを実感中"],
            senior: ["若い頃は焦ったが、今は準備の大切さがわかる"]
          }
        }),
        2: this.createLineTemplate(3, 2, {
          situation: "屯如邅如乗馬班如（ちゅんじょてんじょばにのりてはんじょたり）",
          essence: {
            type: "stagnation",
            state: "進退に迷う、方向性の模索",
            challenge: "選択の困難",
            opportunity: "慎重な判断"
          },
          emotions: ["confusion", "anxiety", "frustration"],
          emotionWeight: { confusion: 0.5, anxiety: 0.3, frustration: 0.2 },
          keyPhrases: [
            "どっちに行けば", "迷走中", "方向性",
            "進むべきか戻るべきか", "選択肢多すぎ", "決められない"
          ],
          snsPatterns: {
            young: ["進路選択マジで迷う...どうしよう", "選択肢ありすぎて決められない😵"],
            adult: ["キャリアの岐路。慎重に検討中", "大きな決断の前で立ち止まっている"],
            senior: ["人生の分かれ道。経験を活かして判断したい"]
          }
        })
      }
    };

    // 6.天水訟（てんすいしょう）- 争いと調停
    templates[6] = {
      name: "天水訟",
      theme: "対立と調和",
      lines: {
        1: this.createLineTemplate(6, 1, {
          situation: "不永所事小有言終吉（ながくところのことをせずしょうげんありおわりにきち）",
          essence: {
            type: "beginning",
            state: "小さな対立、早期解決",
            challenge: "感情的になりやすい",
            opportunity: "早期の和解"
          },
          emotions: ["frustration", "anxiety", "hope"],
          emotionWeight: { frustration: 0.4, anxiety: 0.3, hope: 0.3 },
          keyPhrases: [
            "ちょっとした言い合い", "すぐ解決", "大事にしない",
            "早めに謝る", "引きずらない", "和解"
          ],
          snsPatterns: {
            young: ["友達とケンカしちゃった...でもすぐ仲直りしたい", "言い過ぎた、謝ろう"],
            adult: ["職場での小さな対立。早期解決を心がける", "感情的にならず冷静に対処"],
            senior: ["些細なことで争うのは時間の無駄。早く和解を"]
          }
        }),
        4: this.createLineTemplate(6, 4, {
          situation: "不克訟復即命渝安貞吉（うつたえにかたずもとにかえりてめいにつきかうていにやすんじてきち）",
          essence: {
            type: "transformation",
            state: "争いを諦め、運命を受け入れる",
            challenge: "プライドを捨てる困難",
            opportunity: "内なる平和"
          },
          emotions: ["sadness", "determination", "hope"],
          emotionWeight: { sadness: 0.3, determination: 0.4, hope: 0.3 },
          keyPhrases: [
            "もう争わない", "受け入れる", "諦めも大事",
            "平和が一番", "無駄な戦い", "心の安定"
          ],
          snsPatterns: {
            young: ["もう争うの疲れた。受け入れることにした", "勝ち負けじゃないって気づいた"],
            adult: ["訴訟を取り下げ。心の平和を選択", "争いより和解。それが成熟した判断"],
            senior: ["年を重ねて、争いの無意味さを知った"]
          }
        })
      }
    };

    // 7.地水師（ちすいし）- 統率と組織
    templates[7] = {
      name: "地水師",
      theme: "統率と組織化",
      lines: {
        1: this.createLineTemplate(7, 1, {
          situation: "師出以律否臧凶（しいずるにりつをもってすひぞうきょう）",
          essence: {
            type: "beginning",
            state: "規律による出発、組織の基礎",
            challenge: "規律の厳格さ",
            opportunity: "強固な組織作り"
          },
          emotions: ["determination", "anxiety", "hope"],
          emotionWeight: { determination: 0.5, anxiety: 0.2, hope: 0.3 },
          keyPhrases: [
            "ルール大事", "規律正しく", "組織化",
            "リーダーシップ", "責任重大", "統率"
          ],
          snsPatterns: {
            young: ["チームリーダー任された！規律大事にしよう", "みんなをまとめるの大変だけど頑張る"],
            adult: ["組織運営の基本は規律。しっかり整備する", "リーダーとしての責任を感じる"],
            senior: ["若い世代を導く立場。規律と優しさのバランスが大切"]
          }
        }),
        5: this.createLineTemplate(7, 5, {
          situation: "田有禽利執言無咎（でんにきんありことをとらうるによろしとがなし）",
          essence: {
            type: "peak",
            state: "成果の収穫、適切な判断",
            challenge: "公平な分配",
            opportunity: "信頼の獲得"
          },
          emotions: ["hope", "determination", "frustration"],
          emotionWeight: { hope: 0.5, determination: 0.3, frustration: 0.2 },
          keyPhrases: [
            "成果出た", "公平に分配", "リーダーの判断",
            "信頼される", "実績", "責任ある決定"
          ],
          snsPatterns: {
            young: ["プロジェクト成功！みんなの頑張りのおかげ", "成果を公平に評価するのも大事"],
            adult: ["チームで大きな成果。適切な評価と分配を実施", "リーダーとして信頼を得られた"],
            senior: ["長年の経験を活かし、若手の成果を正当に評価"]
          }
        })
      }
    };

    // 8.水地比（すいちひ）- 親和と協調
    templates[8] = {
      name: "水地比",
      theme: "親和と協調",
      lines: {
        1: this.createLineTemplate(8, 1, {
          situation: "有孚比之無咎（まことありこれにしたしむとがなし）",
          essence: {
            type: "beginning",
            state: "誠実な関係の始まり",
            challenge: "信頼構築の時間",
            opportunity: "真の友情"
          },
          emotions: ["hope", "anxiety", "determination"],
          emotionWeight: { hope: 0.5, anxiety: 0.2, determination: 0.3 },
          keyPhrases: [
            "信頼関係", "誠実に", "仲良くなりたい",
            "心を開く", "親しみ", "友情の始まり"
          ],
          snsPatterns: {
            young: ["新しい友達できそう！誠実に接しよう", "信頼関係って大事だよね"],
            adult: ["新しいチームで信頼関係構築中", "誠実さが一番の近道"],
            senior: ["新しい出会いも大切に。誠実に接する"]
          }
        }),
        5: this.createLineTemplate(8, 5, {
          situation: "顕比王用三駆失前禽（けんぴおうさんくをもちいてぜんきんをうしなう）",
          essence: {
            type: "peak",
            state: "寛容な統治、自由を尊重",
            challenge: "統制の緩さ",
            opportunity: "自発的な協力"
          },
          emotions: ["hope", "confusion", "determination"],
          emotionWeight: { hope: 0.4, confusion: 0.3, determination: 0.3 },
          keyPhrases: [
            "自由にさせる", "縛らない", "信頼して任せる",
            "寛容", "自主性尊重", "ゆるやかな統治"
          ],
          snsPatterns: {
            young: ["みんなの自主性を大事にしたい", "縛りすぎないマネジメント"],
            adult: ["部下を信頼して自由に任せる方針", "マイクロマネジメントは避ける"],
            senior: ["若い人の自主性を尊重。それが成長につながる"]
          }
        })
      }
    };

    // 51.震為雷（しんいらい）- 衝撃と覚醒
    templates[51] = {
      name: "震為雷",
      theme: "衝撃と覚醒",
      lines: {
        1: this.createLineTemplate(51, 1, {
          situation: "震来虩虩後笑言啞啞（しんきたりてげきげきたりのちにしょうげんあくあくたり）",
          essence: {
            type: "beginning",
            state: "突然の衝撃、初期の混乱",
            challenge: "パニックへの対処",
            opportunity: "冷静さの回復"
          },
          emotions: ["anxiety", "confusion", "hope"],
          emotionWeight: { anxiety: 0.5, confusion: 0.3, hope: 0.2 },
          keyPhrases: [
            "びっくりした", "突然", "パニック",
            "でも大丈夫", "落ち着いて", "笑い話になる"
          ],
          snsPatterns: {
            young: ["マジでビビった！でももう大丈夫w", "突然すぎてパニったけど、今は冷静"],
            adult: ["予想外の出来事に動揺したが、すぐに冷静さを取り戻した", "衝撃的だったが、良い経験になった"],
            senior: ["人生色々あるが、最後は笑い話になるものだ"]
          }
        }),
        3: this.createLineTemplate(51, 3, {
          situation: "震蘇蘇震行無眚（しんそそたりしんゆきてわざわいなし）",
          essence: {
            type: "growth",
            state: "衝撃からの覚醒、行動開始",
            challenge: "恐れを超える",
            opportunity: "新たな行動"
          },
          emotions: ["anxiety", "determination", "hope"],
          emotionWeight: { anxiety: 0.3, determination: 0.4, hope: 0.3 },
          keyPhrases: [
            "目が覚めた", "気づいた", "動き出す",
            "もう怖くない", "行動あるのみ", "覚醒"
          ],
          snsPatterns: {
            young: ["ショックだったけど、逆に目が覚めた", "もう迷わない、行動する！"],
            adult: ["衝撃的な出来事が転機に。新たな道を歩み始める", "危機が覚醒のきっかけになった"],
            senior: ["老いてなお、新たな気づきと行動の機会がある"]
          }
        })
      }
    };

    // 52.艮為山（ごんいざん）- 静止と内省
    templates[52] = {
      name: "艮為山",
      theme: "静止と内省",
      lines: {
        1: this.createLineTemplate(52, 1, {
          situation: "艮其趾無咎利永貞（そのあしをとどむとがなしえいていによろし）",
          essence: {
            type: "beginning",
            state: "足を止める、動かない決断",
            challenge: "行動への誘惑",
            opportunity: "内省の時間"
          },
          emotions: ["anxiety", "confusion", "determination"],
          emotionWeight: { anxiety: 0.3, confusion: 0.3, determination: 0.4 },
          keyPhrases: [
            "止まる", "動かない", "じっとする",
            "内省", "考える時間", "行動しない勇気"
          ],
          snsPatterns: {
            young: ["今は動かない。じっくり考える時", "行動したいけど、まだ待つ"],
            adult: ["戦略的に動かない選択。内省の時間を大切に", "止まることも前進"],
            senior: ["若い頃は動き回ったが、今は静止の価値を知る"]
          }
        }),
        6: this.createLineTemplate(52, 6, {
          situation: "敦艮吉（とんごんきち）",
          essence: {
            type: "completion",
            state: "完全な静止、深い内省",
            challenge: "社会からの孤立",
            opportunity: "究極の自己理解"
          },
          emotions: ["determination", "hope", "sadness"],
          emotionWeight: { determination: 0.4, hope: 0.4, sadness: 0.2 },
          keyPhrases: [
            "完全な静寂", "深い内省", "自分と向き合う",
            "悟り", "平穏", "究極の静止"
          ],
          snsPatterns: {
            young: ["完全に自分と向き合う時間。SNSも少し離れて", "静寂の中で本当の自分を見つめる"],
            adult: ["深い内省により、人生の本質が見えてきた", "静止の中にこそ真実がある"],
            senior: ["人生の終盤、静かに自己と向き合う豊かな時間"]
          }
        })
      }
    };

    // 57.巽為風（そんいふう）- 浸透と柔軟
    templates[57] = {
      name: "巽為風",
      theme: "浸透と柔軟",
      lines: {
        1: this.createLineTemplate(57, 1, {
          situation: "進退利武人之貞（しんたいぶじんのていによろし）",
          essence: {
            type: "beginning",
            state: "進退の迷い、方向性の模索",
            challenge: "優柔不断",
            opportunity: "柔軟な対応"
          },
          emotions: ["confusion", "anxiety", "hope"],
          emotionWeight: { confusion: 0.4, anxiety: 0.3, hope: 0.3 },
          keyPhrases: [
            "どっちつかず", "迷う", "柔軟に",
            "様子を見る", "風向きを読む", "適応"
          ],
          snsPatterns: {
            young: ["進むべきか退くべきか...風向き見てる", "柔軟に対応していくしかない"],
            adult: ["市場の風向きを読みながら慎重に判断", "柔軟性が今は大切"],
            senior: ["風のように柔軟に。それが処世術"]
          }
        }),
        5: this.createLineTemplate(57, 5, {
          situation: "貞吉悔亡無不利（ていきちくいほろぶふりなし）",
          essence: {
            type: "peak",
            state: "正しい浸透、影響力の拡大",
            challenge: "一貫性の維持",
            opportunity: "広範な影響"
          },
          emotions: ["hope", "determination", "anxiety"],
          emotionWeight: { hope: 0.5, determination: 0.4, anxiety: 0.1 },
          keyPhrases: [
            "浸透していく", "影響広がる", "正しい道",
            "一貫性", "信念貫く", "広がり"
          ],
          snsPatterns: {
            young: ["自分の考えがじわじわ広まってる！", "信念持って続けてよかった"],
            adult: ["一貫した方針が徐々に組織に浸透", "影響力が着実に拡大している"],
            senior: ["長年の信念が若い世代にも浸透。継承の喜び"]
          }
        })
      }
    };

    // 58.兌為沢（だいたく）- 喜びと交流
    templates[58] = {
      name: "兌為沢",
      theme: "喜びと交流",
      lines: {
        1: this.createLineTemplate(58, 1, {
          situation: "和兌吉（わだいきち）",
          essence: {
            type: "beginning",
            state: "調和的な喜び、穏やかな交流",
            challenge: "表面的になりやすい",
            opportunity: "真の親和"
          },
          emotions: ["hope", "determination", "anxiety"],
          emotionWeight: { hope: 0.6, determination: 0.2, anxiety: 0.2 },
          keyPhrases: [
            "楽しい", "和やか", "みんなと仲良く",
            "笑顔", "喜び分かち合う", "ハーモニー"
          ],
          snsPatterns: {
            young: ["みんなと楽しく過ごせて幸せ😊", "笑顔が一番！"],
            adult: ["チームの和やかな雰囲気が生産性を向上", "喜びを共有できる環境"],
            senior: ["人生の喜びは分かち合うことにある"]
          }
        }),
        6: this.createLineTemplate(58, 6, {
          situation: "引兌（いんだい）",
          essence: {
            type: "decline",
            state: "過度の喜び、制御不能",
            challenge: "享楽への耽溺",
            opportunity: "節度の学習"
          },
          emotions: ["frustration", "anxiety", "sadness"],
          emotionWeight: { frustration: 0.4, anxiety: 0.3, sadness: 0.3 },
          keyPhrases: [
            "やりすぎた", "調子に乗った", "後悔",
            "節度", "反省", "ほどほどに"
          ],
          snsPatterns: {
            young: ["昨日飲みすぎた...反省😵", "楽しすぎて調子乗っちゃった"],
            adult: ["享楽に溺れることの危険性を実感", "節度を持つことの大切さ"],
            senior: ["若い頃の過ちを思い出す。節度は大切"]
          }
        })
      }
    };

    // 12.天地否（てんちひ）- 閉塞と停滞
    templates[12] = {
      name: "天地否",
      theme: "閉塞と停滞",
      lines: {
        1: this.createLineTemplate(12, 1, {
          situation: "拔茅茹以其彙貞吉亨（ぼうをぬくにじょをもってそのいをもってすていきちこう）",
          essence: {
            type: "beginning",
            state: "困難の始まり、仲間との結束",
            challenge: "孤立への恐れ",
            opportunity: "同志との連帯"
          },
          emotions: ["anxiety", "hope", "determination"],
          emotionWeight: { anxiety: 0.4, hope: 0.3, determination: 0.3 },
          keyPhrases: [
            "閉塞感", "仲間が必要", "一人じゃ無理",
            "協力", "結束", "困難の始まり"
          ],
          snsPatterns: {
            young: ["なんか息苦しい環境...仲間が欲しい", "一人じゃ乗り越えられない"],
            adult: ["組織の閉塞感を感じる。同志との連携が必要", "困難な時期こそチームワーク"],
            senior: ["昔も今も、困難は仲間と乗り越えるもの"]
          }
        }),
        5: this.createLineTemplate(12, 5, {
          situation: "休否大人吉其亡其亡繋于苞桑（ひをやすんずたいじんきちそれほろびんそれほろびんとほうそうにかかる）",
          essence: {
            type: "transformation",
            state: "危機意識による転換",
            challenge: "常に警戒が必要",
            opportunity: "危機回避の知恵"
          },
          emotions: ["anxiety", "determination", "hope"],
          emotionWeight: { anxiety: 0.4, determination: 0.4, hope: 0.2 },
          keyPhrases: [
            "危機感", "常に警戒", "油断できない",
            "転換点", "慎重に", "生き残り"
          ],
          snsPatterns: {
            young: ["ヤバい状況だけど、なんとか切り抜ける", "常に危機感持ってないと"],
            adult: ["経営危機を乗り越える。油断は禁物", "危機意識が組織を救う"],
            senior: ["長年の経験から、危機の兆候を察知"]
          }
        })
      }
    };

    // 11.地天泰（ちてんたい）- 調和と平和
    templates[11] = {
      name: "地天泰",
      theme: "調和と平和",
      lines: {
        1: this.createLineTemplate(11, 1, {
          situation: "拔茅茹以其彙征吉（ぼうをぬくにじょをもってそのいをもってすせいきち）",
          essence: {
            type: "beginning",
            state: "良い流れの始まり、仲間と共に",
            challenge: "慢心への警戒",
            opportunity: "共同での成功"
          },
          emotions: ["hope", "determination", "anxiety"],
          emotionWeight: { hope: 0.5, determination: 0.3, anxiety: 0.2 },
          keyPhrases: [
            "いい感じ", "流れ来てる", "みんなで",
            "チャンス", "協力", "上昇気流"
          ],
          snsPatterns: {
            young: ["最近調子いい！みんなのおかげ", "いい流れ来てる〜"],
            adult: ["チーム全体が上昇気流に乗っている", "この好機を活かしたい"],
            senior: ["良い時期は皆で分かち合うもの"]
          }
        }),
        3: this.createLineTemplate(11, 3, {
          situation: "無平不陂無往不復（たいらかならざるなくかたむかざるなくゆきてかえらざるなし）",
          essence: {
            type: "transformation",
            state: "変化の必然性を理解",
            challenge: "永続への執着",
            opportunity: "変化への準備"
          },
          emotions: ["confusion", "hope", "determination"],
          emotionWeight: { confusion: 0.3, hope: 0.3, determination: 0.4 },
          keyPhrases: [
            "永遠じゃない", "変化は必然", "準備しとく",
            "循環", "今を大切に", "次に備える"
          ],
          snsPatterns: {
            young: ["今がずっと続くわけじゃないよね", "変化に備えておこう"],
            adult: ["好調も永遠ではない。次の準備を始める", "循環の法則を意識"],
            senior: ["人生は循環。良い時も悪い時も過ぎ去る"]
          }
        })
      }
    };

    // 23.山地剥（さんちはく）- 衰退と崩壊
    templates[23] = {
      name: "山地剥",
      theme: "衰退と崩壊",
      lines: {
        1: this.createLineTemplate(23, 1, {
          situation: "剥牀以足蔑貞凶（しょうをはぐにあしをもってすべつていきょう）",
          essence: {
            type: "beginning",
            state: "基盤の崩壊開始",
            challenge: "現実を直視する困難",
            opportunity: "早期の対策"
          },
          emotions: ["anxiety", "sadness", "confusion"],
          emotionWeight: { anxiety: 0.5, sadness: 0.3, confusion: 0.2 },
          keyPhrases: [
            "土台が崩れる", "ヤバい兆候", "基礎が危ない",
            "早く対処", "見て見ぬふり", "現実直視"
          ],
          snsPatterns: {
            young: ["なんか土台からヤバくなってきた...", "基礎が崩れ始めてる気がする"],
            adult: ["組織の基盤に亀裂。早急な対策が必要", "問題の根は深い"],
            senior: ["基礎が崩れる時は早い。経験から分かる"]
          }
        }),
        6: this.createLineTemplate(23, 6, {
          situation: "碩果不食君子得輿小人剥廬（せきかくらわれずくんしくるまをうしょうじんろをはぐ）",
          essence: {
            type: "transformation",
            state: "最後の希望、再生の種",
            challenge: "絶望的状況",
            opportunity: "新たな始まりの種"
          },
          emotions: ["sadness", "hope", "determination"],
          emotionWeight: { sadness: 0.3, hope: 0.4, determination: 0.3 },
          keyPhrases: [
            "最後の希望", "種を残す", "再生への道",
            "どん底から", "新しい始まり", "希望の光"
          ],
          snsPatterns: {
            young: ["どん底だけど、まだ希望はある", "ここから這い上がる"],
            adult: ["組織崩壊の中、再生の種を守る", "最悪の中に最善の種がある"],
            senior: ["人生最大の危機が最大の転機になることもある"]
          }
        })
      }
    };

    // 24.地雷復（ちらいふく）- 回復と再生
    templates[24] = {
      name: "地雷復",
      theme: "回復と再生",
      lines: {
        1: this.createLineTemplate(24, 1, {
          situation: "不遠復無祇悔元吉（とおからずしてかえるまことにくいなければげんきち）",
          essence: {
            type: "beginning",
            state: "素早い回復、早期の修正",
            challenge: "プライドを捨てる",
            opportunity: "迅速な立ち直り"
          },
          emotions: ["hope", "determination", "anxiety"],
          emotionWeight: { hope: 0.5, determination: 0.3, anxiety: 0.2 },
          keyPhrases: [
            "すぐ戻る", "早めの修正", "立ち直り",
            "反省して前へ", "回復", "やり直し"
          ],
          snsPatterns: {
            young: ["失敗したけど、すぐやり直す！", "転んでもすぐ立ち上がる"],
            adult: ["早期の軌道修正で大事に至らず", "素早い回復力が強み"],
            senior: ["年を取っても立ち直りは早い方がいい"]
          }
        }),
        5: this.createLineTemplate(24, 5, {
          situation: "敦復無悔（とんぷくくいなし）",
          essence: {
            type: "growth",
            state: "着実な回復、自己反省",
            challenge: "時間がかかる",
            opportunity: "確実な成長"
          },
          emotions: ["determination", "hope", "sadness"],
          emotionWeight: { determination: 0.5, hope: 0.3, sadness: 0.2 },
          keyPhrases: [
            "じっくり回復", "反省を活かす", "着実に",
            "後悔しない", "学びに変える", "成長"
          ],
          snsPatterns: {
            young: ["時間かかるけど、確実に成長してる", "過去の失敗も糧になる"],
            adult: ["着実な回復プロセス。焦らず確実に", "深い反省が真の成長につながる"],
            senior: ["人生の回復には時間も必要。それでいい"]
          }
        })
      }
    };

    // 44.天風姤（てんぷうこう）- 遭遇と誘惑
    templates[44] = {
      name: "天風姤",
      theme: "遭遇と誘惑",
      lines: {
        1: this.createLineTemplate(44, 1, {
          situation: "繋于金柅貞吉有攸往見凶（きんじにつなぐていきちゆくところありきょうをみる）",
          essence: {
            type: "beginning",
            state: "誘惑との遭遇、自制の必要",
            challenge: "衝動的行動",
            opportunity: "自己制御の学習"
          },
          emotions: ["anxiety", "confusion", "hope"],
          emotionWeight: { anxiety: 0.4, confusion: 0.4, hope: 0.2 },
          keyPhrases: [
            "誘惑", "危ない出会い", "自制必要",
            "ブレーキかける", "冷静に", "罠かも"
          ],
          snsPatterns: {
            young: ["ヤバい誘惑きた...でも冷静に", "甘い話には裏がある"],
            adult: ["ビジネスでの危険な誘惑。慎重に判断", "魅力的だが、リスクも大きい"],
            senior: ["年を取っても誘惑はある。経験で見抜く"]
          }
        }),
        3: this.createLineTemplate(44, 3, {
          situation: "臀無膚其行次且（でんにはだえなくそのゆくことししょたり）",
          essence: {
            type: "stagnation",
            state: "進退窮まる、身動き取れない",
            challenge: "焦燥感",
            opportunity: "忍耐の学習"
          },
          emotions: ["frustration", "anxiety", "confusion"],
          emotionWeight: { frustration: 0.5, anxiety: 0.3, confusion: 0.2 },
          keyPhrases: [
            "身動き取れない", "進めない", "焦る",
            "八方塞がり", "耐えるしか", "じっと待つ"
          ],
          snsPatterns: {
            young: ["完全に詰んだ...動けない", "焦っても仕方ないけど焦る"],
            adult: ["進退窮まる状況。忍耐が試される", "今は耐える時期と理解"],
            senior: ["人生にはこういう時期もある。耐えるのみ"]
          }
        })
      }
    };

    // 注意: 実際の実装では全64卦×6爻=384の定義が必要
    // ここでは構造を示すため、代表的な卦のみを記載

    return templates;
  }

  /**
   * 爻テンプレート作成ヘルパー
   * 
   * 目的：
   * - 統一されたフォーマットで爻情報を構造化
   * - Triple OSとの関連性も含む
   * 
   * 入力：
   * - hexagramNum: 卦番号(1-64)
   * - lineNum: 爻番号(1-6)
   * - config: 爻の特徴設定
   * 
   * 出力：
   * - 構造化された爻テンプレート
   */
  createLineTemplate(hexagramNum, lineNum, config) {
    return {
      hexagram: hexagramNum,
      line: lineNum,
      situation: config.situation,
      essence: config.essence,
      emotions: config.emotions,
      emotionWeight: config.emotionWeight,
      keyPhrases: config.keyPhrases,
      snsPatterns: config.snsPatterns,
      tripleOS: this.calculateTripleOSRelevance(config),
      metadata: {
        createdAt: new Date().toISOString(),
        version: "1.0"
      }
    };
  }

  /**
   * Triple OSとの関連性計算
   * 
   * 目的：
   * - 各爻とEngine/Interface/SafeMode OSの関連度算出
   * - SNS文章生成時の参考指標
   * 
   * 処理内容：
   * - 状況タイプから基本関連度設定
   * - 感情パターンによる調整
   * - 主体性レベルの反映
   */
  calculateTripleOSRelevance(config) {
    const { essence, emotions, emotionWeight } = config;
    
    let engineOS = 0.33;
    let interfaceOS = 0.33;
    let safeModeOS = 0.34;

    // 状況タイプによる基本設定
    switch (essence.type) {
      case "beginning":
      case "growth":
        engineOS += 0.2;
        break;
      case "peak":
      case "transformation":
        interfaceOS += 0.2;
        break;
      case "decline":
      case "stagnation":
      case "repetition":
        safeModeOS += 0.2;
        break;
    }

    // 感情による調整
    if (emotions.includes("determination") || emotions.includes("hope")) {
      engineOS += 0.1;
    }
    if (emotions.includes("anxiety") || emotions.includes("confusion")) {
      safeModeOS += 0.1;
    }
    if (emotions.includes("frustration")) {
      interfaceOS += 0.1;
    }

    // 正規化
    const total = engineOS + interfaceOS + safeModeOS;
    
    return {
      engineOS: engineOS / total,
      interfaceOS: interfaceOS / total,
      safeModeOS: safeModeOS / total
    };
  }

  /**
   * 特定の爻のテンプレート取得
   * 
   * 目的：
   * - 卦番号と爻番号から該当テンプレート返却
   * - 存在チェックとエラーハンドリング
   * - 用九・用六への対応
   */
  getLineTemplate(hexagramNum, lineNum) {
    if (!this.templates[hexagramNum]) {
      throw new Error(`卦${hexagramNum}のテンプレートが存在しません`);
    }
    
    // 数値または文字列（用九・用六）の両方に対応
    if (!this.templates[hexagramNum].lines[lineNum]) {
      throw new Error(`卦${hexagramNum}の爻${lineNum}のテンプレートが存在しません`);
    }
    
    return this.templates[hexagramNum].lines[lineNum];
  }

  /**
   * 感情パターンに基づくSNS表現取得
   * 
   * 目的：
   * - 指定された感情と強度からSNS表現候補を生成
   * - ペルソナに応じた表現調整
   */
  getEmotionExpressions(emotion, intensity, persona = 'young') {
    const category = this.emotionCategories[emotion];
    if (!category) return [];

    const expressions = [...category.expressions];
    
    // 強度による表現の調整
    if (intensity >= 0.7) {
      expressions.push(...this.getIntenseExpressions(emotion, persona));
    }
    
    return expressions;
  }

  /**
   * 強い感情表現の生成
   */
  getIntenseExpressions(emotion, persona) {
    const intenseMap = {
      anxiety: {
        young: ["マジやばい", "詰んだ", "オワタ"],
        adult: ["深刻な状況", "かなり厳しい", "困難を極める"],
        senior: ["人生最大の危機", "これまでにない不安", "途方に暮れる"]
      },
      frustration: {
        young: ["ムカつく", "イラつきMAX", "キレそう"],
        adult: ["限界に近い", "我慢の限界", "ストレス最高潮"],
        senior: ["堪忍袋の緒が切れそう", "もう我慢ならない", "怒りを抑えきれない"]
      }
      // ... 他の感情も同様
    };

    return intenseMap[emotion]?.[persona] || [];
  }

  /**
   * 統計情報の取得
   * 
   * 目的：
   * - テンプレートの完成度確認
   * - 未定義の爻の特定
   */
  getStatistics() {
    let totalDefined = 0;
    let totalExpected = 386; // 384 + 用九 + 用六
    const undefinedList = [];

    // 通常の爻（1-64卦の各6爻）
    for (let hex = 1; hex <= 64; hex++) {
      for (let line = 1; line <= 6; line++) {
        if (this.templates[hex]?.lines[line]) {
          totalDefined++;
        } else {
          undefinedList.push(`${hex}-${line}`);
        }
      }
    }

    // 用九（乾為天）
    if (this.templates[1]?.lines['用九']) {
      totalDefined++;
    } else {
      undefinedList.push('1-用九');
    }

    // 用六（坤為地）
    if (this.templates[2]?.lines['用六']) {
      totalDefined++;
    } else {
      undefinedList.push('2-用六');
    }

    return {
      totalDefined,
      totalExpected,
      completionRate: (totalDefined / totalExpected * 100).toFixed(2) + '%',
      undefinedList
    };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.HexagramPatternTemplates = HexagramPatternTemplates;
}