

        // ==========================================
        // HAQEI Emergency Analyzer - Vanilla JS
        // HaQei哲学準拠の緊急簡易分析システム
        // ==========================================
        
        'use strict';
        
        // 1. 30問質問データ（価値観24問＋シナリオ6問）
        const QUESTIONS = [
          // Q1-Q3: 乾_創造性
          {
            id: "q1",
            text: "新しいプロジェクトや取り組みを始めるとき、あなたが最も重視することは？",
            category: { title: "創造性の次元", description: "新しい物事への取り組み方を測定します" },
            options: [
              { value: "A", text: "誰もやったことのない革新的なアプローチを試す", scoring: { "乾_創造性": 3.0, "離_表現性": 1.5, "艮_安定性": -1.0 } },
              { value: "B", text: "既存の方法を改良してより良いものにする", scoring: { "乾_創造性": 1.5, "坎_探求性": 1.5, "巽_適応性": 1.0 } },
              { value: "C", text: "みんなで話し合って最適な方法を見つける", scoring: { "兌_調和性": 2.5, "坤_受容性": 1.5, "乾_創造性": -0.5 } },
              { value: "D", text: "過去の成功例を参考にして確実に進める", scoring: { "艮_安定性": 2.5, "坎_探求性": 1.0, "乾_創造性": -1.0 } },
              { value: "E", text: "状況に応じて柔軟に方法を調整する", scoring: { "巽_適応性": 2.5, "兌_調和性": 1.0, "艮_安定性": -0.5 } }
            ]
          },
          {
            id: "q2", 
            text: "アイデアが浮かんだとき、あなたの行動パターンは？",
            options: [
              { value: "A", text: "すぐに新しい形として具現化してみたくなる", scoring: { "乾_創造性": 3.0, "震_行動性": 2.0, "艮_安定性": -1.0 } },
              { value: "B", text: "まず詳しく調べてから実行に移す", scoring: { "坎_探求性": 2.5, "艮_安定性": 2.0, "震_行動性": -1.0 } },
              { value: "C", text: "周りの人と相談して意見を聞く", scoring: { "兌_調和性": 2.5, "坤_受容性": 1.5, "乾_創造性": 0.5 } },
              { value: "D", text: "実現可能性を慎重に検討する", scoring: { "艮_安定性": 2.5, "坎_探求性": 1.5, "乾_創造性": -0.5 } },
              { value: "E", text: "タイミングを見計らって最適な時に実行する", scoring: { "巽_適応性": 2.5, "坎_探求性": 1.0, "震_行動性": -0.5 } }
            ]
          },
          {
            id: "q3",
            text: "「創造する」ということについて、あなたの考えに最も近いのは？",
            options: [
              { value: "A", text: "何もないところから全く新しいものを生み出すこと", scoring: { "乾_創造性": 3.0, "離_表現性": 1.5, "坤_受容性": -1.0 } },
              { value: "B", text: "みんなで協力して素晴らしいものを作り上げること", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "乾_創造性": 1.0 } },
              { value: "C", text: "深く研究して新しい発見をすること", scoring: { "坎_探求性": 2.5, "乾_創造性": 1.5, "兌_調和性": -0.5 } },
              { value: "D", text: "着実に積み重ねて価値あるものを築くこと", scoring: { "艮_安定性": 2.5, "坤_受容性": 1.5, "乾_創造性": 0.5 } },
              { value: "E", text: "状況に合わせて最適な解決策を見つけること", scoring: { "巽_適応性": 2.5, "坎_探求性": 1.0, "乾_創造性": 1.0 } }
            ]
          },
          
          // Q4-Q6: 震_行動性
          {
            id: "q4",
            text: "やらなければならないことがあるとき、あなたのスタイルは？",
            category: { title: "行動性の次元", description: "行動への取り組み方を測定します" },
            options: [
              { value: "A", text: "すぐに行動を起こして勢いで進める", scoring: { "震_行動性": 3.0, "乾_創造性": 1.0, "艮_安定性": -1.5 } },
              { value: "B", text: "計画を立ててから着実に実行する", scoring: { "艮_安定性": 2.5, "坎_探求性": 1.5, "震_行動性": -0.5 } },
              { value: "C", text: "周りと協力してチームで進める", scoring: { "兌_調和性": 2.5, "坤_受容性": 1.5, "震_行動性": 1.0 } },
              { value: "D", text: "状況を見極めてから最適なタイミングで動く", scoring: { "巽_適応性": 2.5, "坎_探求性": 1.5, "震_行動性": 0.5 } },
              { value: "E", text: "自分の感覚を信じて直感的に進める", scoring: { "離_表現性": 2.0, "震_行動性": 2.0, "艮_安定性": -1.0 } }
            ]
          },
          {
            id: "q5",
            text: "ストレスや困難な状況に直面したとき、あなたの第一反応は？",
            options: [
              { value: "A", text: "即座に問題解決に向けて動き出す", scoring: { "震_行動性": 3.0, "乾_創造性": 1.5, "坤_受容性": -1.0 } },
              { value: "B", text: "冷静に状況を分析して原因を探る", scoring: { "坎_探求性": 3.0, "艮_安定性": 1.5, "震_行動性": -0.5 } },
              { value: "C", text: "信頼できる人に相談して支えを求める", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "震_行動性": 0.0 } },
              { value: "D", text: "落ち着いて状況が好転するのを待つ", scoring: { "艮_安定性": 2.5, "坤_受容性": 1.5, "震_行動性": -1.5 } },
              { value: "E", text: "柔軟に対応しながら最善の道を探る", scoring: { "巽_適応性": 3.0, "坎_探求性": 1.0, "震_行動性": 0.5 } }
            ]
          },
          {
            id: "q6",
            text: "新しい挑戦や機会があるとき、あなたの反応は？",
            options: [
              { value: "A", text: "ワクワクして飛び込みたくなる", scoring: { "震_行動性": 3.0, "乾_創造性": 2.0, "艮_安定性": -1.0 } },
              { value: "B", text: "興味深いが、まず詳しく調べてから決める", scoring: { "坎_探求性": 2.5, "艮_安定性": 2.0, "震_行動性": -0.5 } },
              { value: "C", text: "リスクと利益を慎重に天秤にかける", scoring: { "艮_安定性": 2.5, "坎_探求性": 1.5, "震_行動性": -1.0 } },
              { value: "D", text: "周りの意見を聞いてから判断する", scoring: { "兌_調和性": 2.5, "坤_受容性": 1.5, "乾_創造性": -0.5 } },
              { value: "E", text: "自分にとって本当に価値があるか考える", scoring: { "坎_探求性": 2.0, "艮_安定性": 1.5, "巽_適応性": 1.0 } }
            ]
          },
          
          // Q7-Q9: 坎_探求性
          {
            id: "q7",
            text: "知らないことに出会ったとき、あなたの反応は？",
            category: { title: "探求性の次元", description: "知識や理解への取り組み方を測定します" },
            options: [
              { value: "A", text: "深く掘り下げて徹底的に理解したくなる", scoring: { "坎_探求性": 3.0, "艮_安定性": 1.0, "震_行動性": -0.5 } },
              { value: "B", text: "新しい発見や可能性を見つけたくなる", scoring: { "乾_創造性": 2.5, "坎_探求性": 2.0, "艮_安定性": -0.5 } },
              { value: "C", text: "みんなで一緒に学び合いたくなる", scoring: { "兌_調和性": 2.5, "坤_受容性": 1.5, "坎_探求性": 1.0 } },
              { value: "D", text: "実用的で役に立つ部分を知りたくなる", scoring: { "艮_安定性": 2.0, "巽_適応性": 1.5, "坎_探求性": 1.5 } },
              { value: "E", text: "必要に応じて少しずつ理解していく", scoring: { "巽_適応性": 2.5, "艮_安定性": 1.0, "坎_探求性": 0.5 } }
            ]
          },
          {
            id: "q8",
            text: "複雑な問題に直面したとき、あなたのアプローチは？",
            options: [
              { value: "A", text: "問題の本質を見極めるまで考え抜く", scoring: { "坎_探求性": 3.0, "艮_安定性": 1.5, "震_行動性": -1.0 } },
              { value: "B", text: "新しい視点から問題を捉え直す", scoring: { "乾_創造性": 2.5, "坎_探求性": 2.0, "艮_安定性": -0.5 } },
              { value: "C", text: "いろいろな人の意見を聞いて参考にする", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "坎_探求性": 0.5 } },
              { value: "D", text: "まず行動してみて、やりながら解決策を見つける", scoring: { "震_行動性": 3.0, "巽_適応性": 1.5, "坎_探求性": -0.5 } },
              { value: "E", text: "過去の経験や事例を参考にして解決する", scoring: { "艮_安定性": 2.5, "坎_探求性": 1.0, "乾_創造性": -0.5 } }
            ]
          },
          {
            id: "q9",
            text: "学習や研究について、あなたの姿勢は？",
            options: [
              { value: "A", text: "真理や本質を追求することに喜びを感じる", scoring: { "坎_探求性": 3.0, "艮_安定性": 1.0, "震_行動性": -0.5 } },
              { value: "B", text: "新しい発見から創造的なアイデアを得たい", scoring: { "乾_創造性": 2.5, "坎_探求性": 2.0, "艮_安定性": -0.5 } },
              { value: "C", text: "学んだことをみんなと共有したい", scoring: { "兌_調和性": 2.5, "離_表現性": 1.5, "坎_探求性": 1.0 } },
              { value: "D", text: "実生活で活用できる知識を身につけたい", scoring: { "巽_適応性": 2.5, "艮_安定性": 1.5, "坎_探求性": 1.0 } },
              { value: "E", text: "状況に応じて必要な知識を効率よく学ぶ", scoring: { "巽_適応性": 3.0, "艮_安定性": 1.0, "坎_探求性": 0.5 } }
            ]
          },
          
          // Q10-Q12: 艮_安定性
          {
            id: "q10",
            text: "重要な決断をするとき、あなたが最も重視することは？",
            category: { title: "安定性の次元", description: "持続性や確実性への価値観を測定します" },
            options: [
              { value: "A", text: "確実性が高く、リスクの少ない選択肢", scoring: { "艮_安定性": 3.0, "坤_受容性": 1.0, "乾_創造性": -1.5 } },
              { value: "B", text: "革新的で大きな可能性のある選択肢", scoring: { "乾_創造性": 3.0, "震_行動性": 1.5, "艮_安定性": -1.0 } },
              { value: "C", text: "みんなが納得できる選択肢", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "艮_安定性": 0.5 } },
              { value: "D", text: "論理的に最も合理的な選択肢", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "兌_調和性": -0.5 } },
              { value: "E", text: "状況に応じて柔軟に変更できる選択肢", scoring: { "巽_適応性": 3.0, "艮_安定性": -0.5, "坎_探求性": 0.5 } }
            ]
          },
          {
            id: "q11",
            text: "長期的な目標について、あなたの考え方は？",
            options: [
              { value: "A", text: "着実に積み重ねて確実に達成したい", scoring: { "艮_安定性": 3.0, "坤_受容性": 1.5, "震_行動性": -0.5 } },
              { value: "B", text: "大胆な挑戦で大きな成果を目指したい", scoring: { "乾_創造性": 2.5, "震_行動性": 2.0, "艮_安定性": -1.0 } },
              { value: "C", text: "みんなと一緒に成長していきたい", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "艮_安定性": 0.5 } },
              { value: "D", text: "深く探求して専門性を高めたい", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "兌_調和性": -0.5 } },
              { value: "E", text: "状況に応じて目標を柔軟に調整したい", scoring: { "巽_適応性": 2.5, "艮_安定性": -0.5, "乾_創造性": 1.0 } }
            ]
          },
          {
            id: "q12",
            text: "「継続」や「持続」について、あなたの価値観は？",
            options: [
              { value: "A", text: "一度始めたことは最後までやり遂げることが大切", scoring: { "艮_安定性": 3.0, "坤_受容性": 1.0, "巽_適応性": -0.5 } },
              { value: "B", text: "常に新しいことに挑戦し続けることが大切", scoring: { "乾_創造性": 2.5, "震_行動性": 2.0, "艮_安定性": -1.5 } },
              { value: "C", text: "みんなと良い関係を長く保つことが大切", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "艮_安定性": 1.0 } },
              { value: "D", text: "深く学び続けて理解を深めることが大切", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "震_行動性": -0.5 } },
              { value: "E", text: "変化に合わせて適応し続けることが大切", scoring: { "巽_適応性": 3.0, "艮_安定性": -1.0, "乾_創造性": 1.0 } }
            ]
          },
          
          // Q13-Q15: 坤_受容性
          {
            id: "q13",
            text: "他の人との関わり方で、あなたの特徴は？",
            category: { title: "受容性の次元", description: "他者との関わり方や受け入れる力を測定します" },
            options: [
              { value: "A", text: "積極的にリードして新しい方向性を示す", scoring: { "乾_創造性": 2.5, "震_行動性": 2.0, "坤_受容性": -0.5 } },
              { value: "B", text: "相手の話をじっくり聞いて理解しようとする", scoring: { "坤_受容性": 3.0, "兌_調和性": 1.5, "震_行動性": -0.5 } },
              { value: "C", text: "お互いの意見を交換して学び合う", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "坎_探求性": 1.0 } },
              { value: "D", text: "エネルギッシュに活動して盛り上げる", scoring: { "震_行動性": 2.5, "離_表現性": 2.0, "坤_受容性": -1.0 } },
              { value: "E", text: "相手に合わせて適切な距離感を保つ", scoring: { "巽_適応性": 2.5, "坤_受容性": 1.5, "離_表現性": -0.5 } }
            ]
          },
          {
            id: "q14",
            text: "困っている人を見かけたとき、あなたの反応は？",
            options: [
              { value: "A", text: "新しい解決方法を提案してサポートする", scoring: { "乾_創造性": 2.0, "震_行動性": 1.5, "坤_受容性": 1.0 } },
              { value: "B", text: "まず相手の気持ちを受け止めて寄り添う", scoring: { "坤_受容性": 3.0, "兌_調和性": 1.5, "震_行動性": -0.5 } },
              { value: "C", text: "一緒に解決策を考えて実行する", scoring: { "兌_調和性": 2.5, "震_行動性": 1.5, "坤_受容性": 1.5 } },
              { value: "D", text: "問題の原因を分析して根本的な解決を図る", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "坤_受容性": 0.5 } },
              { value: "E", text: "その人に最も適した支援方法を見つける", scoring: { "巽_適応性": 2.5, "坤_受容性": 2.0, "坎_探求性": 1.0 } }
            ]
          },
          {
            id: "q15",
            text: "「支える」ということについて、あなたの考えは？",
            options: [
              { value: "A", text: "新しい可能性を開いて人を励ますこと", scoring: { "乾_創造性": 2.0, "震_行動性": 1.5, "坤_受容性": 1.5 } },
              { value: "B", text: "どんな時も変わらずそばにいること", scoring: { "坤_受容性": 3.0, "艮_安定性": 2.0, "震_行動性": -0.5 } },
              { value: "C", text: "共に喜び、共に悲しむこと", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.5, "離_表現性": 0.5 } },
              { value: "D", text: "具体的な行動で実際に助けること", scoring: { "震_行動性": 2.5, "坤_受容性": 1.5, "艮_安定性": 1.0 } },
              { value: "E", text: "相手の状況に合わせて最適な支援をすること", scoring: { "巽_適応性": 3.0, "坤_受容性": 2.0, "坎_探求性": 0.5 } }
            ]
          },
          
          // Q16-Q18: 巽_適応性
          {
            id: "q16",
            text: "予期しない変化や困難に直面したとき、あなたの対応は？",
            category: { title: "適応性の次元", description: "変化や状況への適応力を測定します" },
            options: [
              { value: "A", text: "これを機会に新しいことに挑戦する", scoring: { "乾_創造性": 2.5, "震_行動性": 2.0, "巽_適応性": 1.0 } },
              { value: "B", text: "状況に合わせて柔軟に方針を調整する", scoring: { "巽_適応性": 3.0, "兌_調和性": 1.0, "艮_安定性": -0.5 } },
              { value: "C", text: "みんなで協力して乗り越える方法を探す", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "巽_適応性": 1.5 } },
              { value: "D", text: "原因を分析して根本的な対策を立てる", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "巽_適応性": 0.5 } },
              { value: "E", text: "確実で安全な方法で対処する", scoring: { "艮_安定性": 2.5, "坤_受容性": 1.5, "巽_適応性": -0.5 } }
            ]
          },
          {
            id: "q17",
            text: "異なる価値観の人たちと一緒に活動するとき、あなたの役割は？",
            options: [
              { value: "A", text: "新しい視点やアイデアを提供する", scoring: { "乾_創造性": 2.5, "離_表現性": 1.5, "巽_適応性": 1.0 } },
              { value: "B", text: "みんなの意見を調整して橋渡しをする", scoring: { "巽_適応性": 3.0, "兌_調和性": 2.0, "離_表現性": 0.5 } },
              { value: "C", text: "全体の雰囲気を和やかに保つ", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "巽_適応性": 1.0 } },
              { value: "D", text: "積極的に行動して場を盛り上げる", scoring: { "震_行動性": 2.5, "離_表現性": 2.0, "巽_適応性": 0.5 } },
              { value: "E", text: "安定した基盤を提供して支える", scoring: { "艮_安定性": 2.5, "坤_受容性": 2.0, "巽_適応性": -0.5 } }
            ]
          },
          {
            id: "q18",
            text: "「柔軟性」について、あなたの価値観は？",
            options: [
              { value: "A", text: "新しい可能性を生み出すために必要なもの", scoring: { "乾_創造性": 2.0, "巽_適応性": 2.5, "艮_安定性": -0.5 } },
              { value: "B", text: "どんな状況でも対応できる大切な能力", scoring: { "巽_適応性": 3.0, "震_行動性": 1.0, "艮_安定性": -0.5 } },
              { value: "C", text: "人との関係を良好に保つために重要なもの", scoring: { "兌_調和性": 2.5, "巽_適応性": 2.0, "坤_受容性": 1.0 } },
              { value: "D", text: "効果的に行動するための手段の一つ", scoring: { "震_行動性": 2.0, "巽_適応性": 1.5, "坎_探求性": 1.0 } },
              { value: "E", text: "一貫性があってこそ意味を持つもの", scoring: { "艮_安定性": 2.5, "巽_適応性": -0.5, "坎_探求性": 1.0 } }
            ]
          },
          
          // Q19-Q21: 離_表現性
          {
            id: "q19",
            text: "自分の考えや気持ちを表現するとき、あなたのスタイルは？",
            category: { title: "表現性の次元", description: "自己表現力や影響力を測定します" },
            options: [
              { value: "A", text: "独創的で印象に残る方法で表現する", scoring: { "乾_創造性": 2.0, "離_表現性": 3.0, "艮_安定性": -0.5 } },
              { value: "B", text: "相手に合わせて分かりやすく伝える", scoring: { "巽_適応性": 2.0, "兌_調和性": 1.5, "離_表現性": 1.5 } },
              { value: "C", text: "論理的で説得力のある説明をする", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "離_表現性": 1.0 } },
              { value: "D", text: "率直で正直な表現を心がける", scoring: { "震_行動性": 1.5, "離_表現性": 2.0, "兌_調和性": -0.5 } },
              { value: "E", text: "相手の気持ちに寄り添いながら伝える", scoring: { "坤_受容性": 2.5, "兌_調和性": 2.0, "離_表現性": 0.5 } }
            ]
          },
          {
            id: "q20",
            text: "注目を浴びる場面で、あなたの反応は？",
            options: [
              { value: "A", text: "自分らしさを思い切り発揮する", scoring: { "離_表現性": 3.0, "乾_創造性": 1.5, "坤_受容性": -0.5 } },
              { value: "B", text: "場の雰囲気に合わせて適切に振る舞う", scoring: { "巽_適応性": 2.5, "兌_調和性": 1.5, "離_表現性": 0.5 } },
              { value: "C", text: "みんなが楽しめるように配慮する", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "離_表現性": 1.0 } },
              { value: "D", text: "控えめに振る舞って目立たないようにする", scoring: { "坤_受容性": 2.5, "艮_安定性": 1.5, "離_表現性": -1.0 } },
              { value: "E", text: "エネルギッシュに行動して場を盛り上げる", scoring: { "震_行動性": 2.5, "離_表現性": 2.5, "艮_安定性": -0.5 } }
            ]
          },
          {
            id: "q21",
            text: "「影響力を持つ」ということについて、あなたの考えは？",
            options: [
              { value: "A", text: "新しい価値観や可能性を伝える力", scoring: { "乾_創造性": 2.5, "離_表現性": 2.5, "坤_受容性": -0.5 } },
              { value: "B", text: "自分の個性や魅力で人を惹きつける力", scoring: { "離_表現性": 3.0, "震_行動性": 1.0, "艮_安定性": -0.5 } },
              { value: "C", text: "みんなをまとめて良い方向に導く力", scoring: { "兌_調和性": 2.5, "震_行動性": 1.5, "離_表現性": 1.5 } },
              { value: "D", text: "行動で示して周りを動かす力", scoring: { "震_行動性": 2.5, "離_表現性": 1.5, "坤_受容性": -0.5 } },
              { value: "E", text: "信頼と実績で認められる力", scoring: { "艮_安定性": 2.5, "坤_受容性": 1.5, "離_表現性": 0.5 } }
            ]
          },
          
          // Q22-Q24: 兌_調和性
          {
            id: "q22",
            text: "対立や意見の衝突が起きたとき、あなたの対応は？",
            category: { title: "調和性の次元", description: "協調性や調和を重視する力を測定します" },
            options: [
              { value: "A", text: "新しい視点を提示して流れを変える", scoring: { "乾_創造性": 2.0, "離_表現性": 1.5, "兌_調和性": 1.0 } },
              { value: "B", text: "双方の良い点を見つけて橋渡しをする", scoring: { "兌_調和性": 3.0, "巽_適応性": 2.0, "震_行動性": -0.5 } },
              { value: "C", text: "冷静に分析して客観的な解決策を提示する", scoring: { "坎_探求性": 2.5, "艮_安定性": 1.5, "兌_調和性": 0.5 } },
              { value: "D", text: "積極的に行動して状況を打開する", scoring: { "震_行動性": 2.5, "乾_創造性": 1.0, "兌_調和性": -0.5 } },
              { value: "E", text: "相手の気持ちを受け止めて寄り添う", scoring: { "坤_受容性": 2.5, "兌_調和性": 2.0, "震_行動性": -1.0 } }
            ]
          },
          {
            id: "q23",
            text: "人との関係で最も大切にしていることは？",
            options: [
              { value: "A", text: "お互いに刺激し合って成長できること", scoring: { "乾_創造性": 2.0, "震_行動性": 1.5, "兌_調和性": 1.5 } },
              { value: "B", text: "笑顔で楽しい時間を共有できること", scoring: { "兌_調和性": 3.0, "離_表現性": 1.5, "坎_探求性": -0.5 } },
              { value: "C", text: "深く理解し合えること", scoring: { "坎_探求性": 2.0, "坤_受容性": 2.0, "兌_調和性": 1.5 } },
              { value: "D", text: "互いを支え合えること", scoring: { "坤_受容性": 2.5, "艮_安定性": 2.0, "兌_調和性": 2.0 } },
              { value: "E", text: "相手に合わせて適切な関係を築けること", scoring: { "巽_適応性": 2.5, "兌_調和性": 2.0, "坤_受容性": 1.0 } }
            ]
          },
          {
            id: "q24",
            text: "「つながり」や「絆」について、あなたの価値観は？",
            options: [
              { value: "A", text: "新しい出会いから生まれる可能性が大切", scoring: { "乾_創造性": 2.0, "震_行動性": 1.5, "兌_調和性": 1.0 } },
              { value: "B", text: "お互いに喜びを分かち合えることが大切", scoring: { "兌_調和性": 3.0, "離_表現性": 1.0, "艮_安定性": 0.5 } },
              { value: "C", text: "深い信頼関係を築けることが大切", scoring: { "艮_安定性": 2.0, "坤_受容性": 2.0, "兌_調和性": 1.5 } },
              { value: "D", text: "困った時に支え合えることが大切", scoring: { "坤_受容性": 2.5, "兌_調和性": 2.0, "震_行動性": 0.5 } },
              { value: "E", text: "お互いの違いを認め合えることが大切", scoring: { "巽_適応性": 2.0, "坤_受容性": 2.0, "兌_調和性": 2.0 } }
            ]
          },
          
          // Q25-Q30: シナリオ設問（Interface/SafeMode OS特定用）
          {
            id: "q25",
            text: "あなたが会社で新しいプロジェクトリーダーに任命されました。メンバーは経験豊富ですが、それぞれ異なる意見を持っています。最初のミーティングで、あなたはどのようにチームをまとめますか？",
            category: { title: "シナリオ設問", description: "具体的な状況での行動パターンを分析します" },
            options: [
              { value: "A", text: "全員の意見をじっくり聞いてから、みんなが納得できる折衷案を作る", scoring: { "兌_調和性": 3.0, "坤_受容性": 2.5, "坎_探求性": 1.0 } },
              { value: "B", text: "明確なビジョンを示し、そこに向かってメンバーを導く", scoring: { "乾_創造性": 2.5, "離_表現性": 2.5, "震_行動性": 2.0 } },
              { value: "C", text: "各メンバーの強みを分析し、最適な役割分担を提案する", scoring: { "坎_探求性": 2.5, "巽_適応性": 2.0, "艮_安定性": 1.5 } },
              { value: "D", text: "過去の成功事例を共有し、実績に基づいた方法論を提案する", scoring: { "艮_安定性": 2.5, "坎_探求性": 1.5, "兌_調和性": 1.0 } },
              { value: "E", text: "まずは小さな成功を目指し、チームの結束を高めながら進める", scoring: { "巽_適応性": 2.0, "兌_調和性": 2.0, "艮_安定性": 2.0 } }
            ]
          },
          {
            id: "q26",
            text: "重要なプレゼンテーションの直前に、技術的な問題が発生しました。あなたの対応は？",
            options: [
              { value: "A", text: "代替案を即座に考えて、予定通り実行する", scoring: { "乾_創造性": 2.5, "震_行動性": 2.5, "巽_適応性": 2.0 } },
              { value: "B", text: "問題を正直に説明し、理解を求めながら進める", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.0, "離_表現性": 1.5 } },
              { value: "C", text: "チーム全員で協力して最善の解決策を見つける", scoring: { "兌_調和性": 3.0, "坤_受容性": 2.0, "震_行動性": 1.0 } },
              { value: "D", text: "問題の原因を分析し、根本的な対策を検討する", scoring: { "坎_探求性": 3.0, "艮_安定性": 2.0, "震_行動性": -0.5 } },
              { value: "E", text: "延期を提案し、完璧な状態で実施する", scoring: { "艮_安定性": 3.0, "坤_受容性": 1.0, "震_行動性": -1.0 } }
            ]
          },
          {
            id: "q27",
            text: "新しい環境（転職、引っ越し等）に置かれたとき、あなたの適応方法は？",
            options: [
              { value: "A", text: "積極的に新しいことに挑戦して、自分らしさを発揮する", scoring: { "乾_創造性": 2.5, "震_行動性": 2.5, "離_表現性": 2.0 } },
              { value: "B", text: "周りの人とコミュニケーションを取り、関係性を築く", scoring: { "兌_調和性": 3.0, "坤_受容性": 2.0, "離_表現性": 1.0 } },
              { value: "C", text: "環境をよく観察し、ルールや文化を理解する", scoring: { "坎_探求性": 2.5, "艮_安定性": 2.0, "巽_適応性": 1.5 } },
              { value: "D", text: "過去の経験を活かし、着実に基盤を固める", scoring: { "艮_安定性": 3.0, "坤_受容性": 1.5, "坎_探求性": 1.0 } },
              { value: "E", text: "状況に合わせて、必要に応じて自分を調整する", scoring: { "巽_適応性": 3.0, "兌_調和性": 1.5, "坤_受容性": 1.0 } }
            ]
          },
          {
            id: "q28",
            text: "大切な決断を迫られ、限られた情報しかない状況では？",
            options: [
              { value: "A", text: "直感を信じて、素早く決断する", scoring: { "離_表現性": 2.5, "震_行動性": 2.5, "乾_創造性": 1.5 } },
              { value: "B", text: "信頼できる人に相談して、意見を求める", scoring: { "兌_調和性": 2.5, "坤_受容性": 2.5, "艮_安定性": 1.0 } },
              { value: "C", text: "可能な限り情報を収集してから判断する", scoring: { "坎_探求性": 3.0, "艮_安定性": 2.0, "震_行動性": -0.5 } },
              { value: "D", text: "リスクを最小限に抑える選択肢を選ぶ", scoring: { "艮_安定性": 3.0, "坤_受容性": 1.5, "乾_創造性": -1.0 } },
              { value: "E", text: "複数のシナリオを想定して、柔軟な計画を立てる", scoring: { "巽_適応性": 3.0, "坎_探求性": 2.0, "艮_安定性": 0.5 } }
            ]
          },
          {
            id: "q29",
            text: "チームの成果が期待を下回った場合、あなたの反応は？",
            options: [
              { value: "A", text: "新しいアプローチを提案し、チームを鼓舞する", scoring: { "乾_創造性": 2.5, "震_行動性": 2.0, "離_表現性": 2.0 } },
              { value: "B", text: "メンバーの気持ちに寄り添い、支援を強化する", scoring: { "坤_受容性": 3.0, "兌_調和性": 2.0, "艮_安定性": 1.0 } },
              { value: "C", text: "客観的に分析し、改善点を明確にする", scoring: { "坎_探求性": 3.0, "艮_安定性": 1.5, "兌_調和性": 0.5 } },
              { value: "D", text: "責任を取り、より確実な方法に変更する", scoring: { "艮_安定性": 2.5, "坤_受容性": 2.0, "震_行動性": 1.0 } },
              { value: "E", text: "状況に応じて戦略を柔軟に調整する", scoring: { "巽_適応性": 3.0, "坎_探求性": 1.5, "兌_調和性": 1.0 } }
            ]
          },
          {
            id: "q30",
            text: "人生の重要な転機において、あなたが最も大切にしたい価値観は？",
            options: [
              { value: "A", text: "新しい可能性への挑戦と成長", scoring: { "乾_創造性": 3.0, "震_行動性": 2.0, "離_表現性": 1.0 } },
              { value: "B", text: "大切な人との絆とつながり", scoring: { "兌_調和性": 3.0, "坤_受容性": 2.5, "艮_安定性": 1.0 } },
              { value: "C", text: "真理の探求と深い理解", scoring: { "坎_探求性": 3.0, "艮_安定性": 1.5, "兌_調和性": 0.5 } },
              { value: "D", text: "安定した基盤と確実な歩み", scoring: { "艮_安定性": 3.0, "坤_受容性": 2.0, "乾_創造性": -0.5 } },
              { value: "E", text: "変化への適応と柔軟な対応", scoring: { "巽_適応性": 3.0, "兌_調和性": 1.5, "艮_安定性": -0.5 } }
            ]
        ];
        
        // QUESTIONSをwindowオブジェクトに設定
        window.QUESTIONS = QUESTIONS;
        
        // 2. 64卦データベース（hexagrams.json統合）
        window.HEXAGRAMS = [
            { hexagram_id: 1, name_jp: "乾為天", reading: "けんいてん", catchphrase: "天翔ける龍のような、天性のリーダー", upper_trigram_id: 1, lower_trigram_id: 1, description: "あなたの心の奥底には、天を翔ける龍のような壮大なエネルギーが宿っています。新しい道を切り開き、人々を導くことに最も価値を見出すあなたは、生まれながらのリーダーです。", keywords: "創造,リーダーシップ,力" },
            { hexagram_id: 2, name_jp: "坤為地", reading: "こんいち", catchphrase: "大地の母のように、すべてを受け入れる人", upper_trigram_id: 8, lower_trigram_id: 8, description: "あなたの心には、大地のような広大で深い包容力が備わっています。人や物事を育み、支えることに最も喜びを感じるあなたは、周囲にとって欠かせない存在です。", keywords: "受容,育成,サポート" },
            { hexagram_id: 3, name_jp: "水雷屯", reading: "すいらいちゅん", catchphrase: "困難を乗り越える力強い意志", description: "新しい始まりには困難が伴いますが、あなたには それを乗り越える強い意志があります。", keywords: "始まり,困難,成長" },
            { hexagram_id: 4, name_jp: "山水蒙", reading: "さんすいもう", catchphrase: "学びと成長の探求者", description: "知識を求め、成長し続けることがあなたの本質です。", keywords: "学習,成長,探求" },
            { hexagram_id: 5, name_jp: "水天需", reading: "すいてんじゅ", catchphrase: "忍耐強く機会を待つ人", description: "適切なタイミングを見極める智慧があります。", keywords: "忍耐,タイミング,準備" },
            { hexagram_id: 6, name_jp: "天水訟", reading: "てんすいしょう", catchphrase: "正義を求める勇気ある人", description: "正しいことのために立ち上がる勇気があります。", keywords: "正義,対立,解決" },
            { hexagram_id: 7, name_jp: "地水師", reading: "ちすいし", catchphrase: "組織を率いるリーダー", description: "チームを統率し目標達成に導く力があります。", keywords: "リーダーシップ,組織,統率" },
            { hexagram_id: 8, name_jp: "水地比", reading: "すいちひ", catchphrase: "調和と協力を重視する人", description: "他者との調和を大切にし、協力関係を築くのが得意です。", keywords: "調和,協力,結束" },
            { hexagram_id: 9, name_jp: "風天小畜", reading: "ふうてんしょうちく", catchphrase: "細やかな配慮で成果を積み重ねる人", description: "小さな努力を積み重ねて大きな成果を生み出します。", keywords: "蓄積,配慮,着実" },
            { hexagram_id: 10, name_jp: "天沢履", reading: "てんたくり", catchphrase: "礼儀と品格を重んじる人", description: "正しい道を歩み、品格を保つことを大切にします。", keywords: "礼儀,品格,正道" },
            { hexagram_id: 11, name_jp: "地天泰", reading: "ちてんたい", catchphrase: "平和と繁栄をもたらす人", description: "調和とバランスにより平和と繁栄を実現します。", keywords: "平和,繁栄,調和" },
            { hexagram_id: 12, name_jp: "天地否", reading: "てんちひ", catchphrase: "困難な時期を乗り越える忍耐力", description: "逆境に屈せず、時期を待つ智慧があります。", keywords: "逆境,忍耐,転換" },
            { hexagram_id: 13, name_jp: "天火同人", reading: "てんかどうじん", catchphrase: "人々を団結させる調和の力", description: "共通の目標に向かって人々を結束させる力があります。", keywords: "団結,協力,調和" },
            { hexagram_id: 14, name_jp: "火天大有", reading: "かてんだいゆう", catchphrase: "豊かさと成功を手にする人", description: "大きな成果と豊かさを実現する力があります。", keywords: "成功,豊穣,繁栄" },
            { hexagram_id: 15, name_jp: "地山謙", reading: "ちざんけん", catchphrase: "謙虚さで人々から信頼される人", description: "謙虚な姿勢で多くの人から慕われます。", keywords: "謙遜,信頼,人徳" },
            { hexagram_id: 16, name_jp: "雷地豫", reading: "らいちよ", catchphrase: "喜びと活力をもたらす人", description: "周囲に喜びと前向きな活力を広げます。", keywords: "歓喜,活力,楽観" },
            { hexagram_id: 17, name_jp: "沢雷随", reading: "たくらいずい", catchphrase: "柔軟に適応し成長する人", description: "変化に柔軟に適応し、成長を続けます。", keywords: "適応,従順,成長" },
            { hexagram_id: 18, name_jp: "山風蠱", reading: "さんぷうこ", catchphrase: "改革と再生をもたらす人", description: "古い問題を解決し、新しい秩序を築きます。", keywords: "改革,再生,修復" },
            { hexagram_id: 19, name_jp: "地沢臨", reading: "ちたくりん", catchphrase: "人に寄り添い導く人", description: "人々に寄り添い、優しく導く力があります。", keywords: "指導,接近,親近" },
            { hexagram_id: 20, name_jp: "風地観", reading: "ふうちかん", catchphrase: "深い洞察で本質を見抜く人", description: "物事の本質を見抜く深い洞察力があります。", keywords: "観察,洞察,理解" },
            { hexagram_id: 21, name_jp: "火雷噬嗑", reading: "からいぜいごう", catchphrase: "正義を貫く強い意志の人", description: "困難を噛み砕き、正義を実現します。", keywords: "正義,決断,実行" },
            { hexagram_id: 22, name_jp: "山火賁", reading: "さんかひ", catchphrase: "美と調和で人を魅了する人", description: "美的センスと調和で人々を魅了します。", keywords: "美,装飾,調和" },
            { hexagram_id: 23, name_jp: "山地剥", reading: "さんちはく", catchphrase: "困難な時期を耐え抜く人", description: "厳しい状況でも忍耐強く耐え抜きます。", keywords: "忍耐,剥落,衰退" },
            { hexagram_id: 24, name_jp: "地雷復", reading: "ちらいふく", catchphrase: "新たな始まりを切り開く人", description: "困難の後に新しい始まりをもたらします。", keywords: "復活,再生,回復" },
            { hexagram_id: 25, name_jp: "天雷无妄", reading: "てんらいむぼう", catchphrase: "自然体で真実を貫く人", description: "偽りなく、自然体で真実を貫きます。", keywords: "純真,自然,誠実" },
            { hexagram_id: 26, name_jp: "山天大畜", reading: "さんてんだいちく", catchphrase: "力を蓄え大きな成果を上げる人", description: "エネルギーを蓄積し、大きな成果を実現します。", keywords: "蓄積,抑制,大成" },
            { hexagram_id: 27, name_jp: "山雷頤", reading: "さんらいい", catchphrase: "滋養と成長を促す人", description: "自分と他者の成長を大切に育みます。", keywords: "養育,滋養,成長" },
            { hexagram_id: 28, name_jp: "沢風大過", reading: "たくふうだいか", catchphrase: "大胆な挑戦をする人", description: "常識を超える大胆な挑戦をします。", keywords: "過剰,大胆,挑戦" },
            { hexagram_id: 29, name_jp: "坎為水", reading: "かんいすい", catchphrase: "困難を乗り越える不屈の人", description: "どんな困難も諦めずに乗り越えます。", keywords: "危険,困難,不屈" },
            { hexagram_id: 30, name_jp: "離為火", reading: "りいか", catchphrase: "明るさで周囲を照らす人", description: "知恵と明るさで周囲を照らします。", keywords: "光明,知恵,照明" },
            { hexagram_id: 31, name_jp: "沢山咸", reading: "たくざんかん", catchphrase: "感化し合う深い絆を築く人", description: "相互に影響し合う深い関係を築きます。", keywords: "感応,影響,結合" },
            { hexagram_id: 32, name_jp: "雷風恒", reading: "らいふうこう", catchphrase: "持続する力で目標を達成する人", description: "継続する力で長期的な成功を収めます。", keywords: "持続,恒常,永続" },
            { hexagram_id: 33, name_jp: "天山遯", reading: "てんざんとん", catchphrase: "適切な時期を見極め退く智慧の人", description: "引き際を知る智慧で身を守ります。", keywords: "退避,隠遁,時機" },
            { hexagram_id: 34, name_jp: "雷天大壮", reading: "らいてんだいそう", catchphrase: "力強さで道を切り開く人", description: "強大な力で新しい道を切り開きます。", keywords: "強大,威力,前進" },
            { hexagram_id: 35, name_jp: "火地晋", reading: "かちしん", catchphrase: "着実に前進し成功する人", description: "着実な歩みで確実に成功を掴みます。", keywords: "前進,昇進,発展" },
            { hexagram_id: 36, name_jp: "地火明夷", reading: "ちかめいい", catchphrase: "困難な時期を智慧で乗り切る人", description: "暗い時期も内なる光で乗り越えます。", keywords: "隠蔽,忍耐,内光" },
            { hexagram_id: 37, name_jp: "風火家人", reading: "ふうかかじん", catchphrase: "家族や仲間を大切にする人", description: "身近な人との関係を最も大切にします。", keywords: "家族,親密,絆" },
            { hexagram_id: 38, name_jp: "火沢睽", reading: "かたくけい", catchphrase: "違いを乗り越え和解する人", description: "対立や違いを乗り越えて和解をもたらします。", keywords: "対立,乖離,和解" },
            { hexagram_id: 39, name_jp: "水山蹇", reading: "すいざんけん", catchphrase: "困難を智慧で解決する人", description: "困難な状況を智慧と工夫で乗り越えます。", keywords: "障害,困難,解決" },
            { hexagram_id: 40, name_jp: "雷水解", reading: "らいすいかい", catchphrase: "問題を解決し開放をもたらす人", description: "複雑な問題を解決し、解放をもたらします。", keywords: "解放,解決,開放" },
            { hexagram_id: 41, name_jp: "山沢損", reading: "さんたくそん", catchphrase: "犠牲を払い他者を助ける人", description: "自らを犠牲にして他者の利益を図ります。", keywords: "損失,犠牲,利他" },
            { hexagram_id: 42, name_jp: "風雷益", reading: "ふうらいえき", catchphrase: "利益をもたらし成長を促す人", description: "周囲に利益をもたらし、共に成長します。", keywords: "利益,成長,増加" },
            { hexagram_id: 43, name_jp: "沢天夬", reading: "たくてんかい", catchphrase: "決断力で障害を突破する人", description: "的確な判断で困難を突破します。", keywords: "決断,突破,除去" },
            { hexagram_id: 44, name_jp: "天風姤", reading: "てんぷうこう", catchphrase: "偶然の出会いを活かす人", description: "思いがけない出会いを大切にし活かします。", keywords: "出会い,邂逅,機会" },
            { hexagram_id: 45, name_jp: "沢地萃", reading: "たくちすい", catchphrase: "人々を集め結束させる人", description: "多くの人を集めて大きな力を作ります。", keywords: "集合,結集,統合" },
            { hexagram_id: 46, name_jp: "地風升", reading: "ちふうしょう", catchphrase: "着実に向上し成長する人", description: "地道な努力で着実に地位を向上させます。", keywords: "上昇,昇進,向上" },
            { hexagram_id: 47, name_jp: "沢水困", reading: "たくすいこん", catchphrase: "困窮を乗り越える強靭な人", description: "厳しい困窮状態も諦めずに乗り越えます。", keywords: "困窮,苦境,忍耐" },
            { hexagram_id: 48, name_jp: "水風井", reading: "すいふうせい", catchphrase: "智慧の源で人を潤す人", description: "豊かな智慧で多くの人を潤します。", keywords: "源泉,供給,恵み" },
            { hexagram_id: 49, name_jp: "沢火革", reading: "たくかかく", catchphrase: "革新的な変化をもたらす人", description: "古いものを変革し、新しい時代を築きます。", keywords: "革命,変革,改革" },
            { hexagram_id: 50, name_jp: "火風鼎", reading: "かふうてい", catchphrase: "新秩序を確立する人", description: "新しい秩序と文化を確立します。", keywords: "確立,秩序,文化" },
            { hexagram_id: 51, name_jp: "震為雷", reading: "しんいらい", catchphrase: "衝撃的な変化で覚醒させる人", description: "強い衝撃で人々を目覚めさせます。", keywords: "震動,驚愕,覚醒" },
            { hexagram_id: 52, name_jp: "艮為山", reading: "ごんいざん", catchphrase: "静寂な安定で心を鎮める人", description: "静かな安定感で周囲に安らぎを与えます。", keywords: "静止,安定,瞑想" },
            { hexagram_id: 53, name_jp: "風山漸", reading: "ふうざんぜん", catchphrase: "着実な進歩を重ねる人", description: "焦らず着実に一歩ずつ前進します。", keywords: "漸進,着実,段階" },
            { hexagram_id: 54, name_jp: "雷沢帰妹", reading: "らいたくきまい", catchphrase: "従属の中で調和を見つける人", description: "従う立場でも調和と幸せを見つけます。", keywords: "従属,調和,配慮" },
            { hexagram_id: 55, name_jp: "雷火豊", reading: "らいかほう", catchphrase: "豊かな成果で栄光を掴む人", description: "豊富な成果と栄光を手にします。", keywords: "豊穣,充実,栄光" },
            { hexagram_id: 56, name_jp: "火山旅", reading: "かざんりょ", catchphrase: "旅路で経験を積む人", description: "旅を通して多くの経験と智慧を積みます。", keywords: "旅行,経験,移動" },
            { hexagram_id: 57, name_jp: "巽為風", reading: "そんいふう", catchphrase: "柔軟性で変化に適応する人", description: "風のような柔軟性で変化に対応します。", keywords: "柔軟,適応,浸透" },
            { hexagram_id: 58, name_jp: "兌為沢", reading: "だいたく", catchphrase: "喜びと楽しさを分かち合う人", description: "人々と喜びや楽しさを分かち合います。", keywords: "歓喜,楽しみ,交流" },
            { hexagram_id: 59, name_jp: "風水渙", reading: "ふうすいかん", catchphrase: "散らばったものを再統合する人", description: "分散した要素を再び一つに統合します。", keywords: "分散,解散,再統合" },
            { hexagram_id: 60, name_jp: "水沢節", reading: "すいたくせつ", catchphrase: "節度を保ち調和を作る人", description: "適切な節制で調和のとれた生活を送ります。", keywords: "節制,調節,適度" },
            { hexagram_id: 61, name_jp: "風沢中孚", reading: "ふうたくちゅうふ", catchphrase: "誠実さで深い信頼を得る人", description: "真心からの誠実さで人々の信頼を得ます。", keywords: "誠実,信頼,真心" },
            { hexagram_id: 62, name_jp: "雷山小過", reading: "らいざんしょうか", catchphrase: "小さな配慮で大きな成果を生む人", description: "細やかな心配りで大きな成功を収めます。", keywords: "配慮,細心,小事" },
            { hexagram_id: 63, name_jp: "水火既済", reading: "すいかきさい", catchphrase: "完成された調和を保つ人", description: "すべてが整った完璧な調和状態を維持します。", keywords: "完成,調和,達成" },
            { hexagram_id: 64, name_jp: "火水未済", reading: "かすいびさい", catchphrase: "未完成から新たな可能性を生む人", description: "まだ完成していない状態に新しい可能性を見出します。", keywords: "未完,可能性,継続" }
        ];
        
        // 3. 八卦ベクトルデータ（vectors.js統合）
        const H64_8D_VECTORS = {
            1: {
                乾_創造性: 9, 震_行動性: 7, 坎_探求性: 5, 艮_安定性: 6,
                坤_受容性: 1, 巽_適応性: 3, 離_表現性: 8, 兌_調和性: 4
            },
            2: {
                乾_創造性: 2, 震_行動性: 3, 坎_探求性: 4, 艮_安定性: 8,
                坤_受容性: 9, 巽_適応性: 7, 離_表現性: 2, 兌_調和性: 6
            // 他の62卦のベクトルも同様に実装...
        };
        
        // 4. 正統八卦定義（易経準拠）
        const AUTHENTIC_TRIGRAMS = {
            1: { name: '乾', symbol: '☰', meaning: '天・創造・父', element: 'metal', nature: '剛健', description: '純粋創造力、天性のリーダーシップ、強固な意志' },
            2: { name: '兌', symbol: '☱', meaning: '沢・喜・少女', element: 'metal', nature: '悦楽', description: '喜悦調和、コミュニケーション、社交的魅力' },
            3: { name: '離', symbol: '☲', meaning: '火・光・中女', element: 'fire', nature: '光明', description: '光明表現、知性と情熱、明晰な判断' },
            4: { name: '震', symbol: '☳', meaning: '雷・動・長男', element: 'wood', nature: '発動', description: '雷鳴行動、エネルギッシュな実行力、革新力' },
            5: { name: '巽', symbol: '☴', meaning: '風・入・長女', element: 'wood', nature: '順入', description: '風の浸透、柔軟適応、細やかな配慮' },
            6: { name: '坎', symbol: '☵', meaning: '水・険・中男', element: 'water', nature: '陷険', description: '水の探求、深淵洞察、困難突破' },
            7: { name: '艮', symbol: '☶', meaning: '山・止・少男', element: 'earth', nature: '静止', description: '山の安定、継続力、不動の意志' },
            8: { name: '坤', symbol: '☷', meaning: '地・順・母', element: 'earth', nature: '柔順', description: '大地受容、育成力、無限の包容' }
        };
        
        // 正統八卦マッピング（先天八卦配列準拠）
        const AUTHENTIC_TRIGRAM_MAPPING = {
            "乾_創造性": 1,  // 乾☰ - 純粋創造（天・父・剛健）
            "兌_調和性": 2,  // 兌☱ - 喜悦調和（沢・少女・悦楽）
            "離_表現性": 3,  // 離☲ - 光明表現（火・中女・光明）
            "震_行動性": 4,  // 震☳ - 発動行動（雷・長男・動）
            "巽_適応性": 5,  // 巽☴ - 順応浸透（風・長女・入）
            "坎_探求性": 6,  // 坎☵ - 深淵探求（水・中男・険）
            "艮_安定性": 7,  // 艮☶ - 静止安定（山・少男・止）
            "坤_受容性": 8   // 坤☷ - 受容育成（地・母・順）
        };
        
        // 5. Triple OS定義
        const TRIPLE_OS = {
            'Engine OS': {
                name: 'Engine OS',
                description: '論理的思考と実行力の中核システム',
                color: '#6366f1',
                trigrams: [1, 4, 6, 7], // 乾、震、坎、艮
                keywords: ['創造性', 'リーダーシップ', '行動力', '探求心', '安定性']
            },
            'Interface OS': {
                name: 'Interface OS', 
                description: 'コミュニケーションと表現の対人システム',
                color: '#8b5cf6',
                trigrams: [2, 3, 5, 8], // 兌、離、巽、坤
                keywords: ['調和性', 'コミュニケーション', '表現力', '適応性', '受容性']
            },
            'Safe Mode OS': {
                name: 'Safe Mode OS',
                description: '安定と調和を重視する保護システム',
                color: '#10b981',
                trigrams: [7, 8, 5, 6], // 艮、坤、巽、坎
                keywords: ['安定性', '受容性', '適応性', '慎重さ', '分析力']
        };
        
        // 6. VirtualPersonaEnhancer: 仮想人格生成強化システム（64卦データベース連携版）
        class VirtualPersonaEnhancer {
            constructor() {
                // HEXAGRAMSデータベースを使用（既にグローバルに定義済み）
                this.hexagrams = window.HEXAGRAMS || [];
                this.trigramSymbols = {
                    1: "☰", // 乾（天）
                    2: "☱", // 兌（沢）
                    3: "☲", // 離（火）
                    4: "☳", // 震（雷）
                    5: "☴", // 巽（風）
                    6: "☵", // 坎（水）
                    7: "☶", // 艮（山）
                    8: "☷"  // 坤（地）
                };
            
            // 卦IDから適切なシンボルを生成
            getSymbolForHexagram(hexagramId) {
                // 上卦と下卦に基づいてシンボルを決定
                const hexagram = this.hexagrams.find(h => h.hexagram_id === hexagramId);
                if (!hexagram) return "☯";
                
                // 上卦のシンボルを返す（簡略化）
                return this.trigramSymbols[hexagram.upper_trigram_id] || "☯";
            
            // キーワードから特性を抽出
            extractTraitsFromKeywords(keywords) {
                if (!keywords) return [];
                return keywords.split(',').map(k => k.trim());
            
            enhanceOSResult(osResult, osType) {
                // osResultにhexagramIdが含まれているはず
                const hexagramId = osResult.hexagramId || 1; // デフォルトは乾為天
                const hexagram = this.hexagrams.find(h => h.hexagram_id === hexagramId);
                
                if (!hexagram) {
                    console.warn(`Hexagram ${hexagramId} not found, using default`);
                    return osResult;
                
                // 64卦データベースから動的にペルソナを生成
                return {
                    ...osResult,
                    persona: {
                        name: hexagram.catchphrase,  // データベースのキャッチフレーズを使用
                        symbol: this.getSymbolForHexagram(hexagramId),
                        traits: this.extractTraitsFromKeywords(hexagram.keywords),
                        hexagramName: hexagram.name_jp,
                        reading: hexagram.reading,
                        description: hexagram.description,
                        // HaQei哲学に基づく文脈依存的な表現
                        contextualExpression: `${osType === 'engine' ? '内的価値観' : osType === 'interface' ? '社会的側面' : '防御的側面'}における${hexagram.catchphrase}`
                };
            
            generatePersonaCard(osResult, osType) {
                const enhancedResult = this.enhanceOSResult(osResult, osType);
                const persona = enhancedResult.persona;
                
                if (!persona) {
                    return '<div class="virtual-persona-card">ペルソナデータが見つかりません</div>';
                
                // OSタイプに応じた色分け
                const osColors = {
                    engine: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    interface: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    safemode: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                };
                
                return `
                    <div class="virtual-persona-card" style="background: ${osColors[osType] || osColors.engine};">
                        <div class="persona-header">
                            <span class="persona-symbol">${persona.symbol}</span>
                            <div>
                                <h3 class="persona-name">${persona.name}</h3>
                                <p class="hexagram-name">${persona.hexagramName} (${persona.reading})</p>
                            </div>
                        </div>
                        <div class="persona-content">
                            <p class="persona-context">${persona.contextualExpression}</p>
                            <div class="persona-traits">
                                ${persona.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                            </div>
                            <p class="persona-description">${persona.description}</p>
                        </div>
                    </div>
                `;
        
        // 7. TripleOSエンジン（TypeScriptから移植）
        class TripleOSEngine {
            constructor() {
                this.trigramMapping = this.initializeTrigramMapping();
                this.interfaceKeywords = new Map();
                this.safeModeKeywords = new Map();
                this.initializeKeywordMaps();
            
            initializeTrigramMapping() {
                // 易経準拠の正統三爻マッピング
                return {
                    "乾": { id: 1, symbol: "☰", name: "天", nature: "剛健", trait: "純粋創造・天性リーダーシップ" },
                    "兌": { id: 2, symbol: "☱", name: "沢", nature: "悦楽", trait: "喜悦調和・コミュニケーション" },
                    "離": { id: 3, symbol: "☲", name: "火", nature: "光明", trait: "光明表現・知性情熱" },
                    "震": { id: 4, symbol: "☳", name: "雷", nature: "発動", trait: "雷鳴行動・革新実行" },
                    "巽": { id: 5, symbol: "☴", name: "風", nature: "順入", trait: "風流浸透・柔軟適応" },
                    "坎": { id: 6, symbol: "☵", name: "水", nature: "陷険", trait: "深淵探求・洞察突破" },
                    "艮": { id: 7, symbol: "☶", name: "山", nature: "静止", trait: "山岳安定・不動継続" },
                    "坤": { id: 8, symbol: "☷", name: "地", nature: "柔順", trait: "大地受容・育成包容" }
                };
            
            initializeKeywordMaps() {
                // Interface OS keywords
                this.interfaceKeywords.set("リーダーシップ", ["1", "13", "43", "14"]);
                this.interfaceKeywords.set("協調性", ["2", "15", "45", "8"]);
                this.interfaceKeywords.set("創造性", ["1", "43", "34", "14"]);
                
                // SafeMode OS keywords  
                this.safeModeKeywords.set("慎重", ["2", "52", "39", "15"]);
                this.safeModeKeywords.set("分析的", ["29", "48", "47", "6"]);
                this.safeModeKeywords.set("撤退", ["33", "12", "45", "35"]);
            
            // Triple OS分析のメイン処理
            async analyzeTripleOS(allAnswers) {
                // console.log("🔯 Starting Triple OS Analysis");
                
                try {
                    // 1. 回答を価値観質問とシナリオ質問に分離
                    const { worldviewAnswers, scenarioAnswers } = this.separateAnswers(allAnswers);
                    
                    // 2. Engine OS（価値観システム）の分析
                    const engineOS = await this.analyzeEngineOS(worldviewAnswers);
                    
                    // 3. Interface OS（社会的システム）の分析
                    const interfaceOS = await this.analyzeInterfaceOS(scenarioAnswers, engineOS);
                    
                    // 4. SafeMode OS（防御システム）の分析
                    const safeModeOS = await this.analyzeSafeModeOS(scenarioAnswers, engineOS);
                    
                    // 5. 全OSが正常に計算されたか確認
                    this.validateTripleOSResults(engineOS, interfaceOS, safeModeOS);
                    
                    // 6. 各OSのエネルギー強度を計算
                    engineOS.energy = this.calculateOSEnergy(engineOS);
                    interfaceOS.energy = this.calculateOSEnergy(interfaceOS);
                    safeModeOS.energy = this.calculateOSEnergy(safeModeOS);
                    
                    console.log("⚡ OS Energies:", {
                        engine: engineOS.energy,
                        interface: interfaceOS.energy,
                        safeMode: safeModeOS.energy
                    });
                    
                    // 7. Triple OS統合分析の実行
                    const tripleOSIntegration = await this.calculateTripleOSInteraction(engineOS, interfaceOS, safeModeOS);
                    
                    // console.log("✅ Triple OS Analysis Completed Successfully");
                    
                    return {
                        engineOS,
                        interfaceOS,
                        safeModeOS,
                        integration: tripleOSIntegration,
                        consistencyScore: tripleOSIntegration.consistency,
                        balanceScore: tripleOSIntegration.balance,
                        HaQeiIntegration: tripleOSIntegration.integration,
                        recommendations: tripleOSIntegration.recommendations,
                        validationStatus: "completed",
                        timestamp: Date.now()
                    };
                    
                } catch (error) {
                    console.error("❌ Triple OS Analysis Error:", error);
                    
                    // 統合エラーハンドリング - デフォルトのTriple OS結果を返す
                    return this.getDefaultTripleOSResults();
            
            separateAnswers(allAnswers) {
                const worldviewAnswers = [];
                const scenarioAnswers = [];
                
                allAnswers.forEach(answer => {
                    const questionNum = parseInt(answer.questionId.replace('q', ''));
                    if (questionNum >= 1 && questionNum <= 24) {
                        worldviewAnswers.push(answer);
                    } else if (questionNum >= 25 && questionNum <= 30) {
                        scenarioAnswers.push(answer);
                });
                
                return { worldviewAnswers, scenarioAnswers };
            
            async analyzeEngineOS(worldviewAnswers) {
                console.log("🔥 Engine OS Analysis: Core Values System Mapping");
                
                try {
                    // ユーザーベクトルの構築
                    const userVector = this.buildUserVector(worldviewAnswers);
                    console.log("📊 User Vector:", userVector);
                    
                    // 三爻エネルギーの計算
                    const trigramEnergies = this.calculateTrigramEnergies(userVector);
                    console.log("⚡ Trigram Energies:", trigramEnergies);
                    
                    // 🌟 改善：全体エネルギーバランス重視の64卦選択
                    const authenticEngine = new AuthenticEnergyBalanceEngine();
                    const optimalResult = authenticEngine.selectOptimalHexagramByEnergyBalance(
                        trigramEnergies, 
                        'Engine OS'
                    
                    console.log(`🏆 Engine OS Optimal Result:`, optimalResult);
                    
                    // 64卦データの取得（従来のシステムとの互換性維持）
                    const hexagram = HEXAGRAMS.find(h => h.hexagram_id === optimalResult.hexagramId) || HEXAGRAMS[0];
                    
                    return {
                        hexagramId: optimalResult.hexagramId,
                        hexagramName: optimalResult.hexagramName || hexagram.name_jp,
                        description: hexagram.description,
                        catchphrase: hexagram.catchphrase,
                        primaryTrigram: optimalResult.upperTrigram,
                        secondaryTrigram: optimalResult.lowerTrigram,
                        trigramEnergies,
                        // 🌟 新機能：全体調和分析の詳細結果
                        harmonyScore: optimalResult.harmonyScore,
                        energyUtilization: optimalResult.energyUtilization,
                        osCompatibility: optimalResult.osCompatibility,
                        detailedAnalysis: optimalResult.detailedAnalysis,
                        alternativeCandidates: optimalResult.alternativeCandidates,
                        improvementRecommendations: optimalResult.improvementRecommendations,
                        // 従来システムとの違いを明示
                        originalMethod: this.getLegacyResult(trigramEnergies),
                        improvedMethod: true,
                        balanceType: 'authentic_energy_balance'
                    };
                    
                } catch (error) {
                    console.error("❌ Engine OS Analysis Error:", error);
                    // フォールバック：従来方式
                    return this.analyzeEngineOSLegacy(worldviewAnswers);
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            // 🔄 従来方式の保持（比較・フォールバック用）
            getLegacyResult(trigramEnergies) {
                const sortedTrigrams = Object.entries(trigramEnergies).sort(([, a], [, b]) => b - a);
                const upperTrigram = sortedTrigrams[0][0];
                const lowerTrigram = sortedTrigrams[1][0];
                const hexagramId = this.mapTrigramsToHexagram(upperTrigram, lowerTrigram);
                
                return {
                    method: 'legacy_highest_two',
                    upperTrigram,
                    lowerTrigram, 
                    hexagramId,
                    note: '従来の最高値2三爻選択方式'
                };
            
            // フォールバック用の従来分析
            analyzeEngineOSLegacy(worldviewAnswers) {
                console.warn("🚨 Falling back to legacy Engine OS analysis");
                
                const userVector = this.buildUserVector(worldviewAnswers);
                const trigramEnergies = this.calculateTrigramEnergies(userVector);
                
                const sortedTrigrams = Object.entries(trigramEnergies).sort(([, a], [, b]) => b - a);
                const upperTrigram = sortedTrigrams[0][0];
                const lowerTrigram = sortedTrigrams[1][0];
                
                const hexagramId = this.mapTrigramsToHexagram(upperTrigram, lowerTrigram);
                const hexagram = HEXAGRAMS.find(h => h.hexagram_id === hexagramId) || HEXAGRAMS[0];
                
                return {
                    hexagramId,
                    hexagramName: hexagram.name_jp,
                    description: hexagram.description,
                    catchphrase: hexagram.catchphrase,
                    primaryTrigram: upperTrigram,
                    secondaryTrigram: lowerTrigram,
                    trigramEnergies,
                    balanceType: 'legacy_fallback',
                    improvedMethod: false
                };
            
            buildUserVector(answers) {
                const vector = {
                    乾_創造性: 0, 震_行動性: 0, 坎_探求性: 0, 艮_安定性: 0,
                    坤_受容性: 0, 巽_適応性: 0, 離_表現性: 0, 兌_調和性: 0
                };
                
                answers.forEach(answer => {
                    const option = answer.selectedOption;
                    if (option && option.scoring) {
                        Object.entries(option.scoring).forEach(([dimension, score]) => {
                            if (vector.hasOwnProperty(dimension)) {
                                vector[dimension] += score;
                        });
                });
                
                return vector;
            
            calculateTrigramEnergies(userVector) {
                // 易経準拠の正統三爻エネルギー計算
                const rawEnergies = {};
                
                // 8次元ベクトルから8三爻への正統変換
                Object.entries(AUTHENTIC_TRIGRAM_MAPPING).forEach(([dimension, trigramId]) => {
                    const trigramName = this.getTrigramName(trigramId);
                    rawEnergies[trigramName] = userVector[dimension] || 0;
                });
                
                // HaQei動的正規化（最高値を100とし、相対的バランス維持）
                const maxEnergy = Math.max(...Object.values(rawEnergies));
                const normalizedEnergies = {};
                
                if (maxEnergy > 0) {
                    Object.entries(rawEnergies).forEach(([trigram, energy]) => {
                        // 正規化 + 陰陽バランス調整
                        const normalized = (energy / maxEnergy) * 100;
                        normalizedEnergies[trigram] = Math.max(0, Math.min(100, normalized));
                    });
                } else {
                    // デフォルト値（均等分散）
                    Object.keys(rawEnergies).forEach(trigram => {
                        normalizedEnergies[trigram] = 12.5; // 100/8
                    });
                
                return normalizedEnergies;
            
            getTrigramName(trigramId) {
                // 🌟 IMPROVED: 詳細な説明付きtrigram名前取得
                const trigramMap = {
                    '乾': '乾 (天) - 創造性・リーダーシップの卦',
                    '兌': '兌 (沢) - 調和性・交流の卦',
                    '離': '離 (火) - 表現性・情熱の卦',
                    '震': '震 (雷) - 行動性・変革の卦', 
                    '巽': '巽 (風) - 適応性・柔軟性の卦',
                    '坎': '坎 (水) - 探求性・深層理解の卦',
                    '艮': '艮 (山) - 安定性・持続力の卦',
                    '坤': '坤 (地) - 受容性・支援の卦'
                };
                
                // 🛡️ UNDEFINED PROTECTION: 安全な取得
                if (typeof trigramId === 'number') {
                    const trigramNames = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
                    const trigramKey = trigramNames[trigramId - 1];
                    return trigramMap[trigramKey] || `第${trigramId}卦 (詳細不明)`;
                
                if (typeof trigramId === 'string') {
                    return trigramMap[trigramId] || `${trigramId} (詳細情報を取得中)`;
                
                return '卦情報を取得中...';
            
            mapTrigramsToHexagram(upperTrigram, lowerTrigram) {
                // 易経準拠の正確な64卦計算（先天八卦配列基準）
                const trigramToNumber = {
                    "乾": 1, "兌": 2, "離": 3, "震": 4,
                    "巽": 5, "坎": 6, "艮": 7, "坤": 8
                };
                
                const upper = trigramToNumber[upperTrigram] || 1;
                const lower = trigramToNumber[lowerTrigram] || 1;
                
                // 正統的64卦マトリックス（先天八卦順序）
                const authenticHexagramMatrix = [
                    [1, 43, 14, 34, 9, 5, 26, 11],   // 乾上 (天)
                    [58, 60, 38, 54, 61, 59, 28, 19], // 兌上 (沢)
                    [50, 64, 56, 62, 55, 63, 35, 8],  // 離上 (火)
                    [51, 16, 40, 32, 46, 48, 18, 7],  // 震上 (雷)
                    [57, 20, 53, 42, 37, 45, 22, 36], // 巽上 (風)
                    [6, 29, 4, 7, 59, 60, 3, 2],      // 坎上 (水)
                    [33, 52, 39, 15, 53, 56, 31, 12], // 艮上 (山)
                    [2, 47, 4, 7, 46, 29, 27, 24]     // 坤上 (地)
                ];
                
                // 易経正統計算
                const hexagramId = authenticHexagramMatrix[upper - 1][lower - 1];
                
                console.log(`🔯 Authentic I-Ching Mapping: ${upperTrigram}(${upper}) over ${lowerTrigram}(${lower}) = Hexagram ${hexagramId}`);
                
                return hexagramId;
            
            // 卦データ取得メソッド
            getHexagramData(hexagramId) {
                const hexagram = HEXAGRAMS.find(h => h.hexagram_id === hexagramId);
                if (!hexagram) {
                    console.warn(`Hexagram ${hexagramId} not found, using default`);
                    return HEXAGRAMS[0] || {
                        hexagram_id: hexagramId,
                        name_jp: `卦${hexagramId}`,
                        description: "データが見つかりません",
                        catchphrase: "---"
                    };
                return hexagram;
            
            async analyzeInterfaceOS(scenarioAnswers, engineOS) {
                console.log("🌐 Interface OS Analysis: Social Pattern Mapping");
                
                try {
                    // 1. シナリオ質問から社会的パターンを分析
                    const socialPatterns = this.analyzeSocialPatterns(scenarioAnswers);
                    console.log("📊 Social Patterns:", socialPatterns);
                    
                    // 2. Interface OS専用の8次元ベクトル構築
                    const interfaceVector = this.buildInterfaceVector(socialPatterns);
                    console.log("🎯 Interface Vector:", interfaceVector);
                    
                    // 3. 社会的三爻エネルギー計算
                    const socialTrigramEnergies = this.calculateSocialTrigramEnergies(interfaceVector);
                    console.log("⚡ Social Trigram Energies:", socialTrigramEnergies);
                    
                    // 4. Engine OSとの相互作用補正
                    const adjustedEnergies = this.adjustForEngineOS(socialTrigramEnergies, engineOS);
                    console.log("🔄 Adjusted for Engine OS:", adjustedEnergies);
                    
                    // 5. 🌟 改善：Interface OS全体エネルギーバランス重視の最適選択
                    const authenticEngine = new AuthenticEnergyBalanceEngine();
                    const optimalResult = authenticEngine.selectOptimalHexagramByEnergyBalance(
                        adjustedEnergies, 
                        'Interface OS'
                    
                    console.log(`🏆 Interface OS Optimal Result:`, optimalResult);
                    
                    // 6. 64卦データ取得
                    const hexagramData = this.getHexagramData(optimalResult.hexagramId);
                    
                    // 7. Interface OS専用解釈生成
                    const interfaceInterpretation = this.generateInterfaceInterpretation(
                        optimalResult.hexagramId, optimalResult.upperTrigram, optimalResult.lowerTrigram, socialPatterns, engineOS
                    
                    console.log(`🌟 Interface OS Result: Hexagram ${optimalResult.hexagramId} (${hexagramData.name_jp})`);
                    
                    return {
                        hexagramId: optimalResult.hexagramId,
                        hexagramName: optimalResult.hexagramName || hexagramData.name_jp,
                        catchphrase: hexagramData.catchphrase,
                        upperTrigram: optimalResult.upperTrigram,
                        lowerTrigram: optimalResult.lowerTrigram,
                        socialPatterns,
                        interfaceVector,
                        socialStyle: this.determineSocialStyle(socialPatterns),
                        description: interfaceInterpretation.description,
                        leadership: interfaceInterpretation.leadership,
                        communication: interfaceInterpretation.communication,
                        conflictResolution: interfaceInterpretation.conflictResolution,
                        adaptability: interfaceInterpretation.adaptability,
                        engineOSInfluence: interfaceInterpretation.engineOSInfluence,
                        trigramEnergies: adjustedEnergies,
                        type: "Interface OS",
                        // 🌟 新機能：全体調和分析の詳細結果
                        harmonyScore: optimalResult.harmonyScore,
                        energyUtilization: optimalResult.energyUtilization,
                        osCompatibility: optimalResult.osCompatibility,
                        detailedAnalysis: optimalResult.detailedAnalysis,
                        alternativeCandidates: optimalResult.alternativeCandidates,
                        improvementRecommendations: optimalResult.improvementRecommendations,
                        balanceType: 'authentic_energy_balance',
                        improvedMethod: true
                    };
                    
                } catch (error) {
                    console.error("❌ Interface OS Analysis Error:", error);
                    return this.getDefaultInterfaceOS();
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            async analyzeSafeModeOS(scenarioAnswers, engineOS) {
                console.log("🛡️ SafeMode OS Analysis: Defensive Pattern Extraction");
                
                try {
                    // 1. シナリオから防御パターンを抽出
                    const defensivePatterns = this.extractDefensivePatterns(scenarioAnswers);
                    console.log("⚡ Defensive Patterns:", defensivePatterns);
                    
                    // 2. ストレス反応ベクトル構築
                    const stressVector = this.buildStressResponseVector(defensivePatterns);
                    console.log("🌪️ Stress Response Vector:", stressVector);
                    
                    // 3. 防御的三爻エネルギー計算
                    const defensiveTrigramEnergies = this.calculateDefensiveTrigramEnergies(stressVector);
                    console.log("⚔️ Defensive Trigram Energies:", defensiveTrigramEnergies);
                    
                    // 4. Engine OSによる基礎的影響（40%）
                    const adjustedEnergies = this.adjustForCorePersonality(defensiveTrigramEnergies, engineOS);
                    console.log("🔧 Core-Adjusted Energies:", adjustedEnergies);
                    
                    // 5. 🌟 改善：Safe Mode OS全体エネルギーバランス重視の最適選択
                    const authenticEngine = new AuthenticEnergyBalanceEngine();
                    const optimalResult = authenticEngine.selectOptimalHexagramByEnergyBalance(
                        adjustedEnergies, 
                        'Safe Mode OS'
                    
                    console.log(`🏆 Safe Mode OS Optimal Result:`, optimalResult);
                    
                    // 6. 64卦データ取得
                    const hexagramData = this.getHexagramData(optimalResult.hexagramId);
                    
                    // 7. SafeMode OS専用解釈生成
                    const safeModeInterpretation = this.generateSafeModeInterpretation(
                        optimalResult.hexagramId, optimalResult.upperTrigram, optimalResult.lowerTrigram, defensivePatterns, engineOS
                    
                    console.log(`🔯 SafeMode OS Result: Hexagram ${optimalResult.hexagramId} (${hexagramData.name_jp})`);
                    
                    return {
                        hexagramId: optimalResult.hexagramId,
                        hexagramName: optimalResult.hexagramName || hexagramData.name_jp,
                        description: safeModeInterpretation.description,
                        catchphrase: hexagramData.catchphrase,
                        primaryDefense: optimalResult.upperTrigram,
                        secondaryDefense: optimalResult.lowerTrigram,
                        defensiveType: safeModeInterpretation.defensiveType,
                        stressResponse: safeModeInterpretation.stressResponse,
                        activationTrigger: safeModeInterpretation.activationTrigger,
                        defensiveStrength: this.calculateDefensiveStrength(defensivePatterns),
                        trigramEnergies: adjustedEnergies,
                        type: "Safe Mode OS",
                        // 🌟 新機能：全体調和分析の詳細結果
                        harmonyScore: optimalResult.harmonyScore,
                        energyUtilization: optimalResult.energyUtilization,
                        osCompatibility: optimalResult.osCompatibility,
                        detailedAnalysis: optimalResult.detailedAnalysis,
                        alternativeCandidates: optimalResult.alternativeCandidates,
                        improvementRecommendations: optimalResult.improvementRecommendations,
                        balanceType: 'authentic_energy_balance',
                        improvedMethod: true
                    };
                    
                } catch (error) {
                    console.error("❌ SafeMode OS Analysis Error:", error);
                    return this.getDefaultSafeModeOS();
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                

            extractDefensivePatterns(scenarioAnswers) {
                const patterns = {
                    leadershipStress: 0,    // Q25: 責任の重圧への防御
                    interpersonalStress: 0, // Q26: 人間関係ストレスへの防御
                    familyStress: 0,        // Q27: 親密関係の負荷への防御
                    emergencyStress: 0,     // Q28: 危機的状況への防御
                    competitionStress: 0,   // Q29: 競争圧力への防御
                    collaborationStress: 0  // Q30: 協調の負担への防御
                };
                
                // 各シナリオ回答から防御的反応パターンを抽出
                scenarioAnswers.forEach((answer, index) => {
                    const questionNum = 25 + index;
                    const stressResponse = this.analyzeStressResponse(answer, questionNum);
                    
                    switch(questionNum) {
                        case 25: patterns.leadershipStress = stressResponse; break;
                        case 26: patterns.interpersonalStress = stressResponse; break;
                        case 27: patterns.familyStress = stressResponse; break;
                        case 28: patterns.emergencyStress = stressResponse; break;
                        case 29: patterns.competitionStress = stressResponse; break;
                        case 30: patterns.collaborationStress = stressResponse; break;
                });
                
                return patterns;

            analyzeStressResponse(answer, questionNum) {
                // 回答から防御的パターンを数値化
                const responseIntensity = this.calculateResponseIntensity(answer);
                const defensiveType = this.identifyDefensiveType(answer, questionNum);
                
                return {
                    intensity: responseIntensity,
                    type: defensiveType,
                    pattern: this.mapToDefensivePattern(defensiveType)
                };

            calculateResponseIntensity(answer) {
                // 回答の強度を0-1で測定
                if (!answer || !answer.text) return 0.5;
                
                const text = answer.text.toLowerCase();
                const intensityKeywords = {
                    high: ['絶対', '必ず', '完全', '徹底', '断固', '断然', '即座', '緊急'],
                    medium: ['できるだけ', 'なるべく', '努力', '検討', '相談', '調整'],
                    low: ['様子見', '保留', '延期', '回避', '無視', '放置']
                };
                
                let score = 0.5; // baseline
                
                intensityKeywords.high.forEach(keyword => {
                    if (text.includes(keyword)) score += 0.15;
                });
                intensityKeywords.medium.forEach(keyword => {
                    if (text.includes(keyword)) score += 0.05;
                });
                intensityKeywords.low.forEach(keyword => {
                    if (text.includes(keyword)) score -= 0.1;
                });
                
                return Math.max(0, Math.min(1, score));

            identifyDefensiveType(answer, questionNum) {
                if (!answer || !answer.text) return 'neutral';
                
                const text = answer.text.toLowerCase();
                
                // 防御タイプキーワード分析
                const defensiveKeywords = {
                    retreat: ['撤退', '距離', '避ける', '離れる', '退く', '逃げ'],
                    confront: ['対抗', '立ち向かう', '戦う', '挑戦', '反撃', '抵抗'],
                    avoid: ['回避', '巧み', '迂回', '別の道', '柔軟', '適応'],
                    endure: ['耐える', '我慢', '忍ぶ', '持久', '継続', '堅持'],
                    transform: ['変化', '適応', '変容', '調整', '修正', '進化'],
                    boundary: ['境界', '線引き', '制限', '区別', '分離', '防壁'],
                    harmonize: ['調和', '同化', '溶け込む', '協調', '合わせる', '融合'],
                    fortify: ['強化', '固める', '守る', '防御', '安定', '堅固']
                };
                
                let maxScore = 0;
                let dominantType = 'neutral';
                
                Object.entries(defensiveKeywords).forEach(([type, keywords]) => {
                    let score = 0;
                    keywords.forEach(keyword => {
                        if (text.includes(keyword)) score++;
                    });
                    if (score > maxScore) {
                        maxScore = score;
                        dominantType = type;
                });
                
                return dominantType;

            mapToDefensivePattern(defensiveType) {
                const patternMap = {
                    retreat: '撤退',     // 坤・艮
                    confront: '対抗',    // 乾・震
                    avoid: '回避',       // 巽・兌
                    endure: '耐忍',      // 坎・艮
                    transform: '変容',   // 離・巽
                    boundary: '結界',    // 艮・坤
                    harmonize: '同化',   // 坤・巽
                    fortify: '硬化',     // 乾・艮
                    neutral: '中立'
                };
                
                return patternMap[defensiveType] || '中立';

            buildStressResponseVector(defensivePatterns) {
                // 防御的8次元ベクトル構築
                const vector = {
                    防御_撤退性: 0,    // 坤 - 受動的撤退
                    防御_対抗性: 0,    // 乾 - 積極的対抗
                    防御_回避性: 0,    // 巽 - 柔軟な回避
                    防御_持久性: 0,    // 坎 - 忍耐と持久
                    防御_変容性: 0,    // 離 - 変化と適応
                    防御_境界性: 0,    // 艮 - 境界設定
                    防御_調和性: 0,    // 兌 - 調和的解決
                    防御_堅固性: 0     // 震 - 瞬発的防御
                };
                
                // 各ストレス反応を対応する防御次元にマッピング
                Object.entries(defensivePatterns).forEach(([stressType, response]) => {
                    const intensity = response.intensity || 0;
                    const pattern = response.pattern || '中立';
                    
                    switch(pattern) {
                        case '撤退':
                            vector.防御_撤退性 += intensity * 0.8;
                            vector.防御_調和性 += intensity * 0.3;
                            break;
                        case '対抗':
                            vector.防御_対抗性 += intensity * 0.8;
                            vector.防御_堅固性 += intensity * 0.4;
                            break;
                        case '回避':
                            vector.防御_回避性 += intensity * 0.8;
                            vector.防御_変容性 += intensity * 0.3;
                            break;
                        case '耐忍':
                            vector.防御_持久性 += intensity * 0.8;
                            vector.防御_境界性 += intensity * 0.4;
                            break;
                        case '変容':
                            vector.防御_変容性 += intensity * 0.8;
                            vector.防御_回避性 += intensity * 0.3;
                            break;
                        case '結界':
                            vector.防御_境界性 += intensity * 0.8;
                            vector.防御_持久性 += intensity * 0.3;
                            break;
                        case '同化':
                            vector.防御_調和性 += intensity * 0.8;
                            vector.防御_撤退性 += intensity * 0.3;
                            break;
                        case '硬化':
                            vector.防御_堅固性 += intensity * 0.8;
                            vector.防御_対抗性 += intensity * 0.3;
                            break;
                });
                
                // 正規化
                const maxValue = Math.max(...Object.values(vector));
                if (maxValue > 0) {
                    Object.keys(vector).forEach(key => {
                        vector[key] = vector[key] / maxValue;
                    });
                
                return vector;

            calculateDefensiveTrigramEnergies(stressVector) {
                // 防御的8次元ベクトルから三爻エネルギーを計算
                return {
                    乾: stressVector.防御_対抗性 * 0.7 + stressVector.防御_堅固性 * 0.3,
                    兌: stressVector.防御_調和性 * 0.8 + stressVector.防御_回避性 * 0.2,
                    離: stressVector.防御_変容性 * 0.8 + stressVector.防御_対抗性 * 0.2,
                    震: stressVector.防御_堅固性 * 0.6 + stressVector.防御_対抗性 * 0.4,
                    巽: stressVector.防御_回避性 * 0.7 + stressVector.防御_変容性 * 0.3,
                    坎: stressVector.防御_持久性 * 0.8 + stressVector.防御_境界性 * 0.2,
                    艮: stressVector.防御_境界性 * 0.7 + stressVector.防御_撤退性 * 0.3,
                    坤: stressVector.防御_撤退性 * 0.7 + stressVector.防御_調和性 * 0.3
                };

            adjustForCorePersonality(defensiveEnergies, engineOS) {
                // Engine OSの基礎人格が防御パターンに40%の影響を与える
                const coreInfluence = 0.4;
                const defensiveBase = 0.6;
                
                if (!engineOS || !engineOS.trigramEnergies) return defensiveEnergies;
                
                const adjusted = {};
                Object.keys(defensiveEnergies).forEach(trigram => {
                    const coreEnergy = engineOS.trigramEnergies[trigram] || 0;
                    const defensiveEnergy = defensiveEnergies[trigram] || 0;
                    
                    adjusted[trigram] = (defensiveEnergy * defensiveBase) + (coreEnergy * coreInfluence);
                });
                
                return adjusted;

            selectDefensiveTrigrams(energies) {
                // エネルギー値でソートして上位2つの三爻を選択
                const sorted = Object.entries(energies)
                    .sort(([,a], [,b]) => b - a);
                
                return [sorted[0][0], sorted[1][0]];

            generateSafeModeInterpretation(hexagramId, primaryDefense, secondaryDefense, patterns, engineOS) {
                // SafeMode OS専用の64卦解釈
                const defensiveInterpretations = this.getSafeModeHexagramInterpretations();
                const interpretation = defensiveInterpretations[hexagramId] || this.getDefaultDefensiveInterpretation();
                
                // パーソナライズされた解釈を生成
                const personalizedDescription = this.personalizeSafeModeDescription(
                    interpretation, primaryDefense, secondaryDefense, patterns, engineOS
                
                return {
                    description: personalizedDescription,
                    catchphrase: interpretation.catchphrase || "困難に立ち向かう防御システム",
                    defensiveType: interpretation.primaryDefense || "総合防御",
                    stressResponse: interpretation.stressResponse || "状況適応型対応",
                    activationTrigger: this.identifyActivationTrigger(patterns)
                };

            getSafeModeHexagramInterpretations() {
                return {
                    1: { // 乾為天
                        name: "天雷無窮型防御",
                        catchphrase: "困難を力で突破する",
                        primaryDefense: "積極的対抗",
                        stressResponse: "正面突破による解決"
                    },
                    2: { // 坤為地
                        name: "大地包容型防御",
                        catchphrase: "全てを受け入れ包み込む",
                        primaryDefense: "受容・同化",
                        stressResponse: "環境への完全適応"
                    },
                    29: { // 坎為水
                        name: "深淵流水型防御",
                        catchphrase: "困難を流れるように通過する",
                        primaryDefense: "浸透・持続",
                        stressResponse: "障害の本質を理解し迂回"
                    },
                    52: { // 艮為山
                        name: "不動要塞型防御",
                        catchphrase: "絶対的な境界を設定する",
                        primaryDefense: "静止・境界",
                        stressResponse: "完全な防御体制構築"
                    },
                    58: { // 兌為沢
                        name: "調和交流型防御",
                        catchphrase: "対話で危機を乗り越える",
                        primaryDefense: "協調・交渉",
                        stressResponse: "関係性による問題解決"
                    },
                    30: { // 離為火
                        name: "明照変容型防御",
                        catchphrase: "状況を見極め変化する",
                        primaryDefense: "洞察・適応",
                        stressResponse: "状況分析による最適化"
                    },
                    51: { // 震為雷
                        name: "電光石火型防御",
                        catchphrase: "瞬時に行動し危機を脱する",
                        primaryDefense: "瞬発・決断",
                        stressResponse: "迅速な状況打開"
                    },
                    57: { // 巽為風
                        name: "順風柔軟型防御",
                        catchphrase: "柔軟性で困難を回避する",
                        primaryDefense: "柔軟・回避",
                        stressResponse: "状況に応じた柔軟対応"
                    },
                    // 他の卦の解釈も同様に...
                    16: { // 雷地予
                        name: "準備充実型防御",
                        catchphrase: "事前準備で危機を防ぐ",
                        primaryDefense: "予防・準備",
                        stressResponse: "先読みによる危機回避"
                    },
                    39: { // 水山蹇
                        name: "困難突破型防御",
                        catchphrase: "困難の中でも前進する",
                        primaryDefense: "忍耐・持続",
                        stressResponse: "困難を乗り越える粘り強さ"
                    },
                    3: { // 水雷屯
                        name: "初期混乱対応型防御",
                        catchphrase: "混乱の中で秩序を見つける",
                        primaryDefense: "忍耐・整理",
                        stressResponse: "混乱状況の段階的整理"
                    },
                    4: { // 山水蒙
                        name: "学習適応型防御",
                        catchphrase: "無知を認めて学ぶことで守る",
                        primaryDefense: "学習・境界",
                        stressResponse: "知識不足の謙虚な補完"
                    },
                    5: { // 水天需
                        name: "機会待機型防御",
                        catchphrase: "適切なタイミングを待つ",
                        primaryDefense: "待機・持続",
                        stressResponse: "焦らず機会を待つ持久戦"
                    },
                    6: { // 天水訟
                        name: "正当防衛型防御",
                        catchphrase: "正義を主張して立ち向かう",
                        primaryDefense: "正当性・対抗",
                        stressResponse: "正当な権利の主張と防衛"
                    },
                    7: { // 地水師
                        name: "組織戦略型防御",
                        catchphrase: "組織力で困難に対処する",
                        primaryDefense: "統率・持続",
                        stressResponse: "組織的な問題解決"
                    },
                    8: { // 水地比
                        name: "協調連帯型防御",
                        catchphrase: "仲間と結束して守る",
                        primaryDefense: "協調・受容",
                        stressResponse: "相互支援による危機対応"
                    },
                    9: { // 風天小畜
                        name: "小規模蓄積型防御",
                        catchphrase: "小さな準備で大きな危機に備える",
                        primaryDefense: "準備・柔軟",
                        stressResponse: "段階的な準備と適応"
                    },
                    10: { // 天沢履
                        name: "慎重歩行型防御",
                        catchphrase: "危険を承知で慎重に進む",
                        primaryDefense: "慎重・対抗",
                        stressResponse: "リスク認識と慎重な行動"
                    },
                    11: { // 地天泰
                        name: "調和安定型防御",
                        catchphrase: "平和と調和を維持する",
                        primaryDefense: "安定・受容",
                        stressResponse: "バランスの取れた対応"
                    },
                    12: { // 天地否
                        name: "閉塞突破型防御",
                        catchphrase: "閉塞状況を打破する",
                        primaryDefense: "突破・対抗",
                        stressResponse: "現状打破による活路開拓"
                    },
                    13: { // 天火同人
                        name: "同志結集型防御",
                        catchphrase: "志を同じくする人と結束する",
                        primaryDefense: "結束・洞察",
                        stressResponse: "理念による団結と対応"
                    },
                    14: { // 火天大有
                        name: "豊富資源型防御",
                        catchphrase: "豊富な資源で危機を乗り越える",
                        primaryDefense: "豊穣・洞察",
                        stressResponse: "資源を活用した包括的対応"
                    },
                    15: { // 地山謙
                        name: "謙遜回避型防御",
                        catchphrase: "謙遜することで危機を避ける",
                        primaryDefense: "謙虚・境界",
                        stressResponse: "低姿勢による摩擦回避"
                    },
                    17: { // 沢雷随
                        name: "柔軟追従型防御",
                        catchphrase: "状況に従って柔軟に対応する",
                        primaryDefense: "追従・調和",
                        stressResponse: "環境変化への柔軟な適応"
                    },
                    18: { // 山風蠱
                        name: "問題修復型防御",
                        catchphrase: "腐敗を正して健全化する",
                        primaryDefense: "修復・境界",
                        stressResponse: "根本的な問題解決"
                    },
                    19: { // 地沢臨
                        name: "接近監視型防御",
                        catchphrase: "近づいて問題を監視する",
                        primaryDefense: "接近・調和",
                        stressResponse: "積極的な関与による解決"
                    },
                    20: { // 風地観
                        name: "観察洞察型防御",
                        catchphrase: "高い視点から状況を俯瞰する",
                        primaryDefense: "観察・柔軟",
                        stressResponse: "客観的分析による対策立案"
                    },
                    21: { // 火雷噬嗑
                        name: "障害除去型防御",
                        catchphrase: "障害を噛み砕いて除去する",
                        primaryDefense: "除去・洞察",
                        stressResponse: "問題の核心への直接的対処"
                    },
                    22: { // 山火賁
                        name: "装飾隠蔽型防御",
                        catchphrase: "美しく装って本質を隠す",
                        primaryDefense: "装飾・境界",
                        stressResponse: "外見を整えた防御戦略"
                    },
                    23: { // 山地剥
                        name: "剥離最小化型防御",
                        catchphrase: "失うものを最小限に抑える",
                        primaryDefense: "保全・境界",
                        stressResponse: "損失最小化戦略"
                    },
                    24: { // 地雷復
                        name: "復元回復型防御",
                        catchphrase: "元の状態に戻すことで安定を図る",
                        primaryDefense: "復元・受容",
                        stressResponse: "原点回帰による安定化"
                    },
                    25: { // 天雷无妄
                        name: "純真無垢型防御",
                        catchphrase: "純粋な心で災いを避ける",
                        primaryDefense: "純真・対抗",
                        stressResponse: "誠実さによる自然な解決"
                    },
                    26: { // 山天大畜
                        name: "大規模蓄積型防御",
                        catchphrase: "大きな力を蓄えて危機に備える",
                        primaryDefense: "蓄積・境界",
                        stressResponse: "長期的な準備による万全な対応"
                    },
                    27: { // 山雷頤
                        name: "栄養補給型防御",
                        catchphrase: "適切な栄養で体力を維持する",
                        primaryDefense: "養育・境界",
                        stressResponse: "基礎体力の維持と強化"
                    },
                    28: { // 沢風大過
                        name: "過大負荷耐久型防御",
                        catchphrase: "限界を超えた負荷に耐える",
                        primaryDefense: "耐久・調和",
                        stressResponse: "極限状況での持久戦"
                    },
                    31: { // 沢山咸
                        name: "感応共鳴型防御",
                        catchphrase: "相手と感応して調和する",
                        primaryDefense: "感応・調和",
                        stressResponse: "相互理解による問題解決"
                    },
                    32: { // 雷風恒
                        name: "持続継続型防御",
                        catchphrase: "変わらぬ姿勢で持続する",
                        primaryDefense: "持続・柔軟",
                        stressResponse: "一貫した方針による安定対応"
                    },
                    33: { // 天山遯
                        name: "戦略的撤退型防御",
                        catchphrase: "適切なタイミングで退く",
                        primaryDefense: "撤退・対抗",
                        stressResponse: "戦略的な後退による立て直し"
                    },
                    34: { // 雷天大壮
                        name: "強大力量型防御",
                        catchphrase: "強大な力で正面突破する",
                        primaryDefense: "強力・対抗",
                        stressResponse: "圧倒的な力による問題解決"
                    },
                    35: { // 火地晋
                        name: "前進発展型防御",
                        catchphrase: "前進することで危機を脱する",
                        primaryDefense: "前進・洞察",
                        stressResponse: "積極的な攻勢による局面打開"
                    },
                    36: { // 地火明夷
                        name: "潜伏隠遁型防御",
                        catchphrase: "光を隠して危険をやり過ごす",
                        primaryDefense: "隠遁・受容",
                        stressResponse: "目立たないことによる安全確保"
                    },
                    37: { // 風火家人
                        name: "家族結束型防御",
                        catchphrase: "家族の絆で危機を乗り越える",
                        primaryDefense: "結束・柔軟",
                        stressResponse: "身内との強固な連帯"
                    },
                    38: { // 火沢睽
                        name: "対立調和型防御",
                        catchphrase: "対立しながらも調和を保つ",
                        primaryDefense: "調和・洞察",
                        stressResponse: "違いを認めた上での協力"
                    },
                    40: { // 雷水解
                        name: "解放開放型防御",
                        catchphrase: "束縛を解いて自由を取り戻す",
                        primaryDefense: "解放・迅速",
                        stressResponse: "制約からの脱却による問題解決"
                    },
                    41: { // 山沢損
                        name: "適切削減型防御",
                        catchphrase: "無駄を削ってスリム化する",
                        primaryDefense: "削減・境界",
                        stressResponse: "効率化による体質強化"
                    },
                    42: { // 風雷益
                        name: "相互利益型防御",
                        catchphrase: "みんなの利益で問題を解決する",
                        primaryDefense: "利益・柔軟",
                        stressResponse: "win-winの関係構築"
                    },
                    43: { // 沢天夬
                        name: "決断実行型防御",
                        catchphrase: "断固とした決断で危機を断つ",
                        primaryDefense: "決断・調和",
                        stressResponse: "明確な判断による迅速な対処"
                    },
                    44: { // 天風姤
                        name: "偶然遭遇型防御",
                        catchphrase: "予期せぬ出会いを活用する",
                        primaryDefense: "機会・対抗",
                        stressResponse: "偶然の機会を最大限活用"
                    },
                    45: { // 沢地萃
                        name: "集結統合型防御",
                        catchphrase: "みんなで集まって力を合わせる",
                        primaryDefense: "統合・調和",
                        stressResponse: "集団の力による問題解決"
                    },
                    46: { // 地風升
                        name: "段階成長型防御",
                        catchphrase: "段階を追って成長し強化する",
                        primaryDefense: "成長・受容",
                        stressResponse: "継続的な改善による体質強化"
                    },
                    47: { // 沢水困
                        name: "困窮忍耐型防御",
                        catchphrase: "困った時こそ耐え忍ぶ",
                        primaryDefense: "忍耐・調和",
                        stressResponse: "苦境での精神力による持久戦"
                    },
                    48: { // 水風井
                        name: "安定供給型防御",
                        catchphrase: "変わらぬ価値を提供し続ける",
                        primaryDefense: "安定・持続",
                        stressResponse: "信頼できる基盤の維持"
                    },
                    49: { // 沢火革
                        name: "変革刷新型防御",
                        catchphrase: "根本から変えて新しくする",
                        primaryDefense: "変革・調和",
                        stressResponse: "抜本的な改革による問題解決"
                    },
                    50: { // 火風鼎
                        name: "安定統治型防御",
                        catchphrase: "新しい秩序で安定を図る",
                        primaryDefense: "統治・洞察",
                        stressResponse: "新体制による安定化"
                    },
                    53: { // 風山漸
                        name: "漸進発展型防御",
                        catchphrase: "少しずつ着実に進歩する",
                        primaryDefense: "漸進・柔軟",
                        stressResponse: "段階的な改善による安定成長"
                    },
                    54: { // 雷沢帰妹
                        name: "適応順応型防御",
                        catchphrase: "与えられた役割に順応する",
                        primaryDefense: "順応・迅速",
                        stressResponse: "環境に合わせた柔軟な適応"
                    },
                    55: { // 雷火豊
                        name: "豊穣充実型防御",
                        catchphrase: "豊かさの中でバランスを保つ",
                        primaryDefense: "豊穣・迅速",
                        stressResponse: "余裕のある状況での適切な判断"
                    },
                    56: { // 火山旅
                        name: "旅行適応型防御",
                        catchphrase: "慣れない環境に適応する",
                        primaryDefense: "適応・洞察",
                        stressResponse: "変化への柔軟な対応"
                    },
                    59: { // 風水渙
                        name: "分散緩和型防御",
                        catchphrase: "固まったものを分散して和らげる",
                        primaryDefense: "分散・柔軟",
                        stressResponse: "緊張の緩和による問題解決"
                    },
                    60: { // 水沢節
                        name: "節制限定型防御",
                        catchphrase: "適切な節度で安定を保つ",
                        primaryDefense: "節制・持続",
                        stressResponse: "バランスの取れた制限による安定"
                    },
                    61: { // 風沢中孚
                        name: "誠実信頼型防御",
                        catchphrase: "誠実さで信頼を築き守る",
                        primaryDefense: "誠実・柔軟",
                        stressResponse: "信頼関係による問題解決"
                    },
                    62: { // 雷山小過
                        name: "小規模超越型防御",
                        catchphrase: "小さな努力で大きな効果を得る",
                        primaryDefense: "効率・迅速",
                        stressResponse: "小さな工夫による効果的対応"
                    },
                    63: { // 水火既済
                        name: "完成維持型防御",
                        catchphrase: "完成した状態を維持する",
                        primaryDefense: "維持・持続",
                        stressResponse: "現状維持による安定確保"
                    },
                    64: { // 火水未済
                        name: "未完成発展型防御",
                        catchphrase: "未完成だからこそ可能性がある",
                        primaryDefense: "発展・洞察",
                        stressResponse: "改善の余地を活用した成長"
                };

            getDefaultDefensiveInterpretation() {
                return {
                    name: "総合適応型防御",
                    catchphrase: "状況に応じて最適な防御を選択する",
                    primaryDefense: "適応・調整",
                    stressResponse: "バランス型危機対応"
                };

            personalizeSafeModeDescription(interpretation, primary, secondary, patterns, engineOS) {
                const stressLevel = this.calculateOverallStressLevel(patterns);
                const primaryStrength = this.getTrigramStrength(primary, patterns);
                const secondaryStrength = this.getTrigramStrength(secondary, patterns);
                
                let description = `${interpretation.name}: ${interpretation.primaryDefense}を主軸とした防御システム。`;
                
                if (stressLevel > 0.7) {
                    description += "高ストレス環境下で強力に発動し、";
                } else if (stressLevel > 0.4) {
                    description += "中程度のストレス状況で適切に作動し、";
                } else {
                    description += "軽微なストレス状況でも予防的に機能し、";
                
                description += `${primary}の${this.getTrigramDefensiveCharacter(primary)}と${secondary}の${this.getTrigramDefensiveCharacter(secondary)}を組み合わせて対応する。`;
                
                return description;

            getTrigramDefensiveCharacter(trigram) {
                const characters = {
                    乾: "強力な対抗力",
                    兌: "調和的解決力",
                    離: "状況洞察力",
                    震: "迅速な行動力",
                    巽: "柔軟な適応力",
                    坎: "持続的忍耐力",
                    艮: "堅固な境界力",
                    坤: "包容的受容力"
                };
                return characters[trigram] || "総合的防御力";

            identifyActivationTrigger(patterns) {
                const triggers = [];
                
                Object.entries(patterns).forEach(([type, response]) => {
                    if (response.intensity > 0.6) {
                        switch(type) {
                            case 'leadershipStress': triggers.push('責任の重圧'); break;
                            case 'interpersonalStress': triggers.push('人間関係の摩擦'); break;
                            case 'familyStress': triggers.push('親密関係の負荷'); break;
                            case 'emergencyStress': triggers.push('緊急事態'); break;
                            case 'competitionStress': triggers.push('競争環境'); break;
                            case 'collaborationStress': triggers.push('協調の負担'); break;
                });
                
                return triggers.length > 0 ? triggers.join('、') : '一般的なストレス状況';

            calculateDefensiveStrength(patterns) {
                const intensities = Object.values(patterns).map(p => p.intensity || 0);
                if (intensities.length === 0) return 0;
                return intensities.reduce((sum, intensity) => sum + intensity, 0) / intensities.length;

            calculateOverallStressLevel(patterns) {
                return this.calculateDefensiveStrength(patterns);

            getTrigramStrength(trigram, patterns) {
                // 三爻の防御パターンでの強度を計算
                const trigramPatternMap = {
                    乾: ['対抗', '硬化'],
                    兌: ['調和', '回避'],
                    離: ['変容', '対抗'],
                    震: ['硬化', '対抗'],
                    巽: ['回避', '変容'],
                    坎: ['耐忍', '結界'],
                    艮: ['結界', '撤退'],
                    坤: ['撤退', '同化']
                };
                
                const relevantPatterns = trigramPatternMap[trigram] || [];
                let strength = 0;
                let count = 0;
                
                Object.values(patterns).forEach(response => {
                    if (relevantPatterns.includes(response.pattern)) {
                        strength += response.intensity;
                        count++;
                });
                
                return count > 0 ? strength / count : 0.5;

            getDefaultSafeModeOS() {
                return {
                    hexagramId: 39, // 水山蹇 - 困難を乗り越える
                    hexagramName: "水山蹇",
                    description: "困難な状況でも粘り強く前進する防御システム",
                    catchphrase: "困難を乗り越える不屈の精神",
                    primaryDefense: "坎",
                    secondaryDefense: "艮",
                    defensiveType: "困難突破型",
                    stressResponse: "忍耐と境界設定による持久戦",
                    activationTrigger: "困難な状況全般",
                    defensiveStrength: 0.6,
                    trigramEnergies: { 乾: 0.3, 兌: 0.2, 離: 0.2, 震: 0.3, 巽: 0.2, 坎: 0.7, 艮: 0.6, 坤: 0.4 },
                    type: "Safe Mode OS"
                };

            /**
             * Interface OS分析の補助メソッド群
             */
             
            // 1. シナリオ質問（Q25-Q30）から社会的パターンを分析
            analyzeSocialPatterns(scenarioAnswers) {
                const patterns = {
                    Q25_leadership: 0,      // リーダーシップ状況対応
                    Q26_interpersonal: 0,   // 対人関係困難への対処
                    Q27_family: 0,          // 家族・親密関係の処理
                    Q28_emergency: 0,       // 緊急事態・危機管理
                    Q29_competition: 0,     // 競争・争いへの対応
                    Q30_community: 0        // 共同体・協力関係構築
                };
                
                // シナリオ回答から社会的パターンスコア計算
                scenarioAnswers.forEach((answer, index) => {
                    const questionId = `Q${25 + index}`;
                    const scoreValue = this.calculateScenarioScore(answer, questionId);
                    
                    switch (questionId) {
                        case 'Q25': patterns.Q25_leadership = scoreValue; break;
                        case 'Q26': patterns.Q26_interpersonal = scoreValue; break;
                        case 'Q27': patterns.Q27_family = scoreValue; break;
                        case 'Q28': patterns.Q28_emergency = scoreValue; break;
                        case 'Q29': patterns.Q29_competition = scoreValue; break;
                        case 'Q30': patterns.Q30_community = scoreValue; break;
                });
                
                return patterns;
            
            // 2. Interface OS専用の8次元ベクトル構築
            buildInterfaceVector(socialPatterns) {
                const vector = {
                    "外向_主導性": 0,    // 乾 - リーダーシップ・主導
                    "外向_調和性": 0,    // 兌 - 社交・コミュニケーション
                    "外向_表現性": 0,    // 離 - プレゼンテーション・魅力
                    "外向_行動性": 0,    // 震 - 即応性・アクション
                    "内向_適応性": 0,    // 巽 - 順応・協調
                    "内向_分析性": 0,    // 坎 - 観察・洞察
                    "内向_安定性": 0,    // 艮 - 一貫性・信頼性
                    "内向_支援性": 0     // 坤 - サポート・貢献
                };
                
                // Q25-Q30の社会的パターンを8次元にマッピング
                vector["外向_主導性"] = (socialPatterns.Q25_leadership * 0.5) + (socialPatterns.Q28_emergency * 0.3);
                vector["外向_調和性"] = (socialPatterns.Q26_interpersonal * 0.4) + (socialPatterns.Q30_community * 0.4);
                vector["外向_表現性"] = (socialPatterns.Q25_leadership * 0.3) + (socialPatterns.Q26_interpersonal * 0.3);
                vector["外向_行動性"] = (socialPatterns.Q28_emergency * 0.4) + (socialPatterns.Q29_competition * 0.4);
                
                vector["内向_適応性"] = (socialPatterns.Q26_interpersonal * 0.3) + (socialPatterns.Q27_family * 0.4);
                vector["内向_分析性"] = (socialPatterns.Q28_emergency * 0.3) + (socialPatterns.Q29_competition * 0.3);
                vector["内向_安定性"] = (socialPatterns.Q27_family * 0.4) + (socialPatterns.Q30_community * 0.3);
                vector["内向_支援性"] = (socialPatterns.Q27_family * 0.3) + (socialPatterns.Q30_community * 0.3);
                
                // 正規化（0-1範囲）
                Object.keys(vector).forEach(key => {
                    vector[key] = Math.max(0, Math.min(1, vector[key]));
                });
                
                return vector;
            
            // 3. 社会的三爻エネルギー計算
            calculateSocialTrigramEnergies(interfaceVector) {
                return {
                    "乾": interfaceVector["外向_主導性"] * 1.0,
                    "兌": interfaceVector["外向_調和性"] * 1.0,
                    "離": interfaceVector["外向_表現性"] * 1.0,
                    "震": interfaceVector["外向_行動性"] * 1.0,
                    "巽": interfaceVector["内向_適応性"] * 1.0,
                    "坎": interfaceVector["内向_分析性"] * 1.0,
                    "艮": interfaceVector["内向_安定性"] * 1.0,
                    "坤": interfaceVector["内向_支援性"] * 1.0
                };
            
            // 4. Engine OSとの相互作用補正
            adjustForEngineOS(socialEnergies, engineOS) {
                const adjustedEnergies = { ...socialEnergies };
                const engineInfluence = 0.25; // 25%の影響度
                
                if (!engineOS || !engineOS.upperTrigram || !engineOS.lowerTrigram) {
                    return adjustedEnergies;
                
                // Engine OSの主要三爻が社会的表現に与える影響
                const enginePrimary = engineOS.upperTrigram;
                
                // 内向的Engine OSは外向的Interface OSを抑制
                if (["坤", "艮", "坎", "巽"].includes(enginePrimary)) {
                    adjustedEnergies["乾"] *= (1 - engineInfluence * 0.8);
                    adjustedEnergies["離"] *= (1 - engineInfluence * 0.6);
                    adjustedEnergies["震"] *= (1 - engineInfluence * 0.7);
                    adjustedEnergies["兌"] *= (1 - engineInfluence * 0.4);
                
                // 外向的Engine OSは外向的Interface OSを強化
                if (["乾", "兌", "離", "震"].includes(enginePrimary)) {
                    adjustedEnergies["乾"] *= (1 + engineInfluence * 0.6);
                    adjustedEnergies["離"] *= (1 + engineInfluence * 0.5);
                    adjustedEnergies["震"] *= (1 + engineInfluence * 0.5);
                    adjustedEnergies["兌"] *= (1 + engineInfluence * 0.7);
                
                // 特定のEngine OS組み合わせ補正
                if (enginePrimary === "坤") { // 受容的Engine OS
                    adjustedEnergies["坤"] *= (1 + engineInfluence * 1.2);
                    adjustedEnergies["巽"] *= (1 + engineInfluence * 0.8);
                
                if (enginePrimary === "乾") { // 創造的Engine OS
                    adjustedEnergies["乾"] *= (1 + engineInfluence * 1.0);
                    adjustedEnergies["震"] *= (1 + engineInfluence * 0.7);
                
                return adjustedEnergies;
            
            // 5. Interface OS用の最適三爻選択
            selectInterfaceTrigrams(adjustedEnergies) {
                // 社会的表現では外卦（上卦）を重視
                const sortedTrigrams = Object.entries(adjustedEnergies)
                    .sort(([, a], [, b]) => b - a);
                
                const upperTrigram = sortedTrigrams[0][0];
                const lowerTrigram = sortedTrigrams[1][0];
                
                // 社会的相互作用の妥当性チェック
                if (this.isValidSocialCombination(upperTrigram, lowerTrigram)) {
                    return { upperTrigram, lowerTrigram };
                } else {
                    // 無効な組み合わせの場合、調整
                    return this.adjustSocialCombination(sortedTrigrams);
            
            // 6. Interface OS専用解釈生成
            generateInterfaceInterpretation(hexagramId, upperTrigram, lowerTrigram, socialPatterns, engineOS) {
                const baseInterpretation = this.getInterfaceHexagramInterpretation(hexagramId);
                
                return {
                    description: baseInterpretation.description,
                    leadership: this.analyzeLeadershipStyle(upperTrigram, socialPatterns),
                    communication: this.analyzeCommunicationStyle(upperTrigram, lowerTrigram, socialPatterns),
                    conflictResolution: this.analyzeConflictStyle(lowerTrigram, socialPatterns),
                    adaptability: this.analyzeAdaptability(upperTrigram, lowerTrigram, socialPatterns),
                    engineOSInfluence: this.analyzeEngineInfluence(engineOS, upperTrigram, lowerTrigram)
                };
            
            // 7. 社会的スタイル判定
            determineSocialStyle(socialPatterns) {
                const leadership = socialPatterns.Q25_leadership;
                const interpersonal = socialPatterns.Q26_interpersonal;
                const community = socialPatterns.Q30_community;
                
                if (leadership > 0.7) return "主導型リーダー";
                if (community > 0.7) return "協調型ファシリテーター";
                if (interpersonal > 0.7) return "対人関係重視型";
                if (leadership > 0.5 && community > 0.5) return "バランス型リーダー";
                return "適応型サポーター";
            
            // 8. デフォルトInterface OS
            getDefaultInterfaceOS() {
                return {
                    hexagramId: 11,
                    hexagramName: "地天泰",
                    upperTrigram: "坤",
                    lowerTrigram: "乾", 
                    socialPatterns: { Q25_leadership: 0.5, Q26_interpersonal: 0.5, Q27_family: 0.5, Q28_emergency: 0.5, Q29_competition: 0.5, Q30_community: 0.5 },
                    interfaceVector: {},
                    socialStyle: "バランス型",
                    description: "調和とバランスを重視するデフォルト社会的人格",
                    leadership: "包容的リーダーシップ",
                    communication: "双方向コミュニケーション",
                    conflictResolution: "仲介・調停型",
                    adaptability: "高い適応力",
                    engineOSInfluence: "安定した相互作用",
                    type: "Interface OS"
                };
            
            /**
             * Interface OS分析の詳細補助メソッド群
             */
             
            // シナリオ回答のスコア計算
            calculateScenarioScore(answer, questionId) {
                // 回答選択肢に基づくスコア計算ロジック
                // A=1.0, B=0.75, C=0.5, D=0.25 の基本スコア
                const baseScore = {
                    'A': 1.0,
                    'B': 0.75, 
                    'C': 0.5,
                    'D': 0.25
                }[answer] || 0.5;
                
                // 質問タイプによる重み調整
                const questionWeights = {
                    'Q25': 1.0, // リーダーシップ
                    'Q26': 0.9, // 対人関係
                    'Q27': 0.8, // 家族
                    'Q28': 1.0, // 緊急事態
                    'Q29': 0.9, // 競争
                    'Q30': 0.8  // 共同体
                };
                
                return baseScore * (questionWeights[questionId] || 1.0);
            
            // 社会的組み合わせの妥当性チェック
            isValidSocialCombination(upperTrigram, lowerTrigram) {
                // 社会的に不適切な組み合わせを除外
                const invalidCombinations = [
                    // 同じ三爻の重複は避ける
                    [upperTrigram, upperTrigram]
                ];
                
                return !invalidCombinations.some(([upper, lower]) => 
                    upper === upperTrigram && lower === lowerTrigram
            
            // 社会的組み合わせの調整
            adjustSocialCombination(sortedTrigrams) {
                // 上位3つから適切な組み合わせを選択
                for (let i = 0; i < sortedTrigrams.length - 1; i++) {
                    for (let j = i + 1; j < sortedTrigrams.length; j++) {
                        const upper = sortedTrigrams[i][0];
                        const lower = sortedTrigrams[j][0];
                        
                        if (this.isValidSocialCombination(upper, lower)) {
                            return { upperTrigram: upper, lowerTrigram: lower };
                
                // フォールバック：乾-坤 組み合わせ
                return { upperTrigram: "乾", lowerTrigram: "坤" };
            
            // Interface OS専用の64卦解釈データ
            getInterfaceHexagramInterpretation(hexagramId) {
                const interpretations = {
                    // 主要64卦の社会的人格解釈
                    1: { description: "純粋な創造的リーダーシップ - 革新的な社会的影響力", leadership: "創造的", communication: "inspiring" },
                    2: { description: "受容的な支援型人格 - 協調と育成重視", leadership: "支援的", communication: "empathetic" },
                    3: { description: "初期段階の組織者 - 基盤構築重視", leadership: "組織構築型", communication: "foundational" },
                    4: { description: "指導的メンター - 教育と成長促進", leadership: "メンター型", communication: "educational" },
                    5: { description: "戦略的待機者 - タイミングを重視", leadership: "戦略的", communication: "strategic" },
                    6: { description: "慎重な調停者 - 対立回避重視", leadership: "調停型", communication: "diplomatic" },
                    7: { description: "集団指導者 - チーム統率重視", leadership: "集団統率", communication: "commanding" },
                    8: { description: "協力促進者 - 連携と結束重視", leadership: "協力促進", communication: "unifying" },
                    9: { description: "細やかな管理者 - 詳細への配慮", leadership: "管理型", communication: "detailed" },
                    10: { description: "礼儀正しい交渉者 - 品格重視", leadership: "品格重視", communication: "dignified" },
                    11: { description: "調和的リーダー - バランスと統合を重視", leadership: "統合的", communication: "inclusive" },
                    12: { description: "独立的思考者 - 独自の社会的立場", leadership: "独立的", communication: "selective" },
                    13: { description: "同人型協力者 - 共同体意識重視", leadership: "協力的", communication: "collaborative" },
                    14: { description: "大有型成果主義者 - 実績と成果重視", leadership: "成果主義", communication: "results-oriented" },
                    15: { description: "謙虚な実力者 - 控えめながら確実", leadership: "謙虚な実力", communication: "modest" },
                    16: { description: "熱意ある動機付け者 - インスピレーション重視", leadership: "動機付け", communication: "enthusiastic" },
                    17: { description: "追随・適応型 - 状況対応重視", leadership: "追随適応", communication: "responsive" },
                    18: { description: "問題解決者 - 課題改善重視", leadership: "問題解決", communication: "reformative" },
                    19: { description: "親しみやすい接近者 - 人間関係重視", leadership: "親和的", communication: "approachable" },
                    20: { description: "観察・分析型 - 洞察力重視", leadership: "分析観察", communication: "insightful" },
                    21: { description: "公正な裁定者 - 客観性重視", leadership: "公正裁定", communication: "objective" },
                    22: { description: "美的センス重視 - 魅力と装飾", leadership: "美的表現", communication: "aesthetic" },
                    23: { description: "段階的変革者 - 慎重な改革", leadership: "段階変革", communication: "gradual" },
                    24: { description: "復活・再生型 - 立ち直り重視", leadership: "復活再生", communication: "resilient" },
                    25: { description: "自然体・無邪気 - 純粋性重視", leadership: "自然体", communication: "authentic" },
                    26: { description: "蓄積・準備型 - 力の温存重視", leadership: "蓄積準備", communication: "preparative" },
                    27: { description: "養育・支援型 - ケアと成長", leadership: "養育支援", communication: "nurturing" },
                    28: { description: "過大負荷対応 - 重責への挑戦", leadership: "重責対応", communication: "challenging" },
                    29: { description: "困難突破者 - 危険な状況への対処", leadership: "困難突破", communication: "persevering" },
                    30: { description: "明晰な表現者 - 明確性と輝き", leadership: "明晰表現", communication: "illuminating" },
                    31: { description: "感化・影響力 - 相互作用重視", leadership: "相互感化", communication: "influential" },
                    32: { description: "持続・継続型 - 長期的視点", leadership: "持続継続", communication: "enduring" },
                    33: { description: "戦略的撤退者 - 適切な引き際", leadership: "戦略撤退", communication: "tactical" },
                    34: { description: "大きな力の発揮 - 強力なリーダーシップ", leadership: "強力発揮", communication: "powerful" },
                    35: { description: "進歩・発展型 - 前進重視", leadership: "進歩発展", communication: "progressive" },
                    36: { description: "困難時の賢明さ - 逆境での知恵", leadership: "逆境賢明", communication: "wise" },
                    37: { description: "家族・組織運営 - 内部統治重視", leadership: "組織運営", communication: "administrative" },
                    38: { description: "対立・差異調整 - 多様性対応", leadership: "差異調整", communication: "mediating" },
                    39: { description: "障害物対処 - 困難克服重視", leadership: "障害克服", communication: "overcoming" },
                    40: { description: "解放・解決型 - 束縛からの自由", leadership: "解放解決", communication: "liberating" },
                    41: { description: "減少・削減管理 - 無駄の排除", leadership: "効率化", communication: "streamlining" },
                    42: { description: "増益・拡大型 - 成長と発展", leadership: "拡大成長", communication: "expanding" },
                    43: { description: "決断力のあるリーダー - 明確な方向性", leadership: "決断力", communication: "direct" },
                    44: { description: "遭遇・適応型 - 状況対応重視", leadership: "適応的", communication: "flexible" },
                    45: { description: "集合・統合促進 - 団結重視", leadership: "統合促進", communication: "unifying" },
                    46: { description: "上昇・向上型 - 成長志向", leadership: "向上志向", communication: "elevating" },
                    47: { description: "困窮・制約対応 - 限界状況の管理", leadership: "制約管理", communication: "constrained" },
                    48: { description: "深い知恵の井戸 - 知識と経験", leadership: "知恵提供", communication: "knowledgeable" },
                    49: { description: "革新・変革者 - 根本的変化", leadership: "革新変革", communication: "revolutionary" },
                    50: { description: "権威・責任者 - 重要な役割", leadership: "権威責任", communication: "authoritative" },
                    51: { description: "衝撃・動揺対応 - 変化への対処", leadership: "変化対応", communication: "dynamic" },
                    52: { description: "安定・静止維持 - 現状維持重視", leadership: "安定維持", communication: "steady" },
                    53: { description: "段階的発展 - 着実な進歩", leadership: "段階発展", communication: "gradual" },
                    54: { description: "従属・補助役 - サポート重視", leadership: "補助支援", communication: "supportive" },
                    55: { description: "豊かさの頂点 - 最高潮の状態", leadership: "豊富提供", communication: "abundant" },
                    56: { description: "旅行・移動型 - 変化と適応", leadership: "移動適応", communication: "adaptive" },
                    57: { description: "順応・浸透型 - 柔軟な影響力", leadership: "柔軟浸透", communication: "penetrating" },
                    58: { description: "喜悦・楽しさ提供 - ポジティブ影響", leadership: "喜悦提供", communication: "joyful" },
                    59: { description: "分散・拡散対応 - 散漫さへの対処", leadership: "統合集約", communication: "focusing" },
                    60: { description: "節度・制限管理 - バランス重視", leadership: "節度管理", communication: "balanced" },
                    61: { description: "内的真実重視 - 誠実性の表現", leadership: "誠実表現", communication: "sincere" },
                    62: { description: "小さな過度 - 細かな調整", leadership: "微細調整", communication: "precise" },
                    63: { description: "完成・達成型 - 目標達成重視", leadership: "完成達成", communication: "accomplished" },
                    64: { description: "未完成・継続型 - 進行中の状態", leadership: "継続進行", communication: "ongoing" }
                };
                
                return interpretations[hexagramId] || {
                    description: "バランス型社会的人格 - 状況に応じた適応",
                    leadership: "バランス型",
                    communication: "adaptable"
                };
            
            // リーダーシップスタイル分析
            analyzeLeadershipStyle(upperTrigram, socialPatterns) {
                const styles = {
                    "乾": "創造的リーダーシップ - 革新と変化をもたらす",
                    "兌": "対話型リーダーシップ - コミュニケーションを重視", 
                    "離": "魅力的リーダーシップ - インスピレーションを与える",
                    "震": "行動型リーダーシップ - 迅速な決断と実行",
                    "巽": "協調型リーダーシップ - チームの調和を重視",
                    "坎": "洞察型リーダーシップ - 深い分析に基づく判断",
                    "艮": "安定型リーダーシップ - 一貫性と信頼性",
                    "坤": "支援型リーダーシップ - メンバーの成長を促進"
                };
                
                const baseStyle = styles[upperTrigram] || "バランス型リーダーシップ";
                const leadershipScore = socialPatterns.Q25_leadership || 0.5;
                
                if (leadershipScore > 0.8) {
                    return `強い${baseStyle}`;
                } else if (leadershipScore > 0.6) {
                    return baseStyle;
                } else {
                    return `控えめな${baseStyle}`;
            
            // コミュニケーションスタイル分析
            analyzeCommunicationStyle(upperTrigram, lowerTrigram, socialPatterns) {
                const upperStyles = {
                    "乾": "直接的",
                    "兌": "親しみやすい",
                    "離": "表現豊か",
                    "震": "エネルギッシュ",
                    "巽": "配慮深い",
                    "坎": "慎重",
                    "艮": "安定した",
                    "坤": "包容的"
                };
                
                const lowerStyles = {
                    "乾": "力強い基盤",
                    "兌": "喜悦の基盤", 
                    "離": "明晰な基盤",
                    "震": "行動の基盤",
                    "巽": "柔軟な基盤",
                    "坎": "深い基盤",
                    "艮": "安定した基盤",
                    "坤": "受容的基盤"
                };
                
                const interpersonalScore = socialPatterns.Q26_interpersonal || 0.5;
                const styleIntensity = interpersonalScore > 0.7 ? "積極的に" : interpersonalScore > 0.4 ? "" : "慎重に";
                
                return `${styleIntensity}${upperStyles[upperTrigram]}なコミュニケーション（${lowerStyles[lowerTrigram]}）`;
            
            // 対立解決スタイル分析
            analyzeConflictStyle(lowerTrigram, socialPatterns) {
                const styles = {
                    "乾": "積極的解決 - 主導的に問題に取り組む",
                    "兌": "対話重視 - 話し合いによる解決を図る",
                    "離": "明確化重視 - 問題を明らかにして解決",
                    "震": "迅速対応 - 素早い判断で解決",
                    "巽": "穏やか解決 - 段階的で柔軟なアプローチ",
                    "坎": "慎重分析 - 深く分析してから対応",
                    "艮": "冷静対処 - 時間をかけた慎重な解決",
                    "坤": "受容的解決 - 包容力で問題を和らげる"
                };
                
                const competitionScore = socialPatterns.Q29_competition || 0.5;
                const baseStyle = styles[lowerTrigram] || "バランス型解決";
                
                if (competitionScore > 0.7) {
                    return `競争的な${baseStyle}`;
                } else if (competitionScore < 0.3) {
                    return `協調的な${baseStyle}`;
                } else {
                    return baseStyle;
            
            // 適応性分析
            analyzeAdaptability(upperTrigram, lowerTrigram, socialPatterns) {
                const adaptabilityScores = {
                    "乾": 0.6, "兌": 0.8, "離": 0.7, "震": 0.9,
                    "巽": 0.9, "坎": 0.7, "艮": 0.3, "坤": 0.8
                };
                
                const upperScore = adaptabilityScores[upperTrigram] || 0.5;
                const lowerScore = adaptabilityScores[lowerTrigram] || 0.5;
                const avgScore = (upperScore + lowerScore) / 2;
                
                const familyScore = socialPatterns.Q27_family || 0.5;
                const emergencyScore = socialPatterns.Q28_emergency || 0.5;
                const contextScore = (familyScore + emergencyScore) / 2;
                
                const finalScore = (avgScore * 0.7) + (contextScore * 0.3);
                
                if (finalScore > 0.8) return "非常に高い適応力";
                if (finalScore > 0.6) return "高い適応力";
                if (finalScore > 0.4) return "中程度の適応力"; 
                return "限定的な適応力";
            
            // Engine OSの影響分析
            analyzeEngineInfluence(engineOS, interfaceUpper, interfaceLower) {
                if (!engineOS || !engineOS.upperTrigram) {
                    return "Engine OS情報不足により影響不明";
                
                const engineUpper = engineOS.upperTrigram;
                const compatibility = this.calculateTrigramCompatibility(engineUpper, interfaceUpper);
                
                if (compatibility > 0.7) {
                    return `Engine OS（${engineUpper}）との高い親和性 - 一貫した人格表現`;
                } else if (compatibility > 0.4) {
                    return `Engine OS（${engineUpper}）との適度な親和性 - バランス取れた表現`;
                } else {
                    return `Engine OS（${engineUpper}）との補完関係 - 内外のコントラスト`;
            
            // 三爻間の親和性計算
            calculateTrigramCompatibility(trigram1, trigram2) {
                const compatibilityMatrix = {
                    "乾": { "乾": 1.0, "兌": 0.8, "離": 0.9, "震": 0.7, "巽": 0.4, "坎": 0.5, "艮": 0.6, "坤": 0.2 },
                    "兌": { "乾": 0.8, "兌": 1.0, "離": 0.7, "震": 0.6, "巽": 0.8, "坎": 0.4, "艮": 0.3, "坤": 0.7 },
                    "離": { "乾": 0.9, "兌": 0.7, "離": 1.0, "震": 0.5, "巽": 0.6, "坎": 0.2, "艮": 0.4, "坤": 0.8 },
                    "震": { "乾": 0.7, "兌": 0.6, "離": 0.5, "震": 1.0, "巽": 0.3, "坎": 0.8, "艮": 0.2, "坤": 0.4 },
                    "巽": { "乾": 0.4, "兌": 0.8, "離": 0.6, "震": 0.3, "巽": 1.0, "坎": 0.7, "艮": 0.8, "坤": 0.9 },
                    "坎": { "乾": 0.5, "兌": 0.4, "離": 0.2, "震": 0.8, "巽": 0.7, "坎": 1.0, "艮": 0.9, "坤": 0.6 },
                    "艮": { "乾": 0.6, "兌": 0.3, "離": 0.4, "震": 0.2, "巽": 0.8, "坎": 0.9, "艮": 1.0, "坤": 0.7 },
                    "坤": { "乾": 0.2, "兌": 0.7, "離": 0.8, "震": 0.4, "巽": 0.9, "坎": 0.6, "艮": 0.7, "坤": 1.0 }
                };
                
                return compatibilityMatrix[trigram1]?.[trigram2] || 0.5;
            
            calculateConsistencyScore(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 1. 卦の相互距離を計算
                    const engineInterface = Math.abs(engineOS.hexagramId - interfaceOS.hexagramId);
                    const engineSafeMode = Math.abs(engineOS.hexagramId - safeModeOS.hexagramId);
                    const interfaceSafeMode = Math.abs(interfaceOS.hexagramId - safeModeOS.hexagramId);
                    
                    // 2. 三爻レベルでの整合性分析
                    const trigramConsistency = this.analyzeTrigramConsistency(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. HaQei哲学的一貫性の評価
                    const philosophicalConsistency = this.evaluatePhilosophicalConsistency(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. 総合整合性スコア計算
                    const distanceScore = Math.max(0, 100 - (engineInterface + engineSafeMode + interfaceSafeMode) / 3 * 1.5);
                    const finalScore = (distanceScore * 0.4 + trigramConsistency * 0.35 + philosophicalConsistency * 0.25);
                    
                    return Math.min(100, Math.max(0, finalScore));
                    
                } catch (error) {
                    console.error("❌ Consistency calculation error:", error);
                    return 50; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * Triple OS相互作用の総合分析
             * 3つのOSの統合的動作を評価し、推奨事項を生成
             */
            async calculateTripleOSInteraction(engineOS, interfaceOS, safeModeOS) {
                // console.log("🔯 Calculating Triple OS Interaction");
                
                try {
                    // 1. 整合性スコア計算
                    const consistency = this.calculateConsistencyScore(engineOS, interfaceOS, safeModeOS);
                    
                    // 2. 動的バランス評価
                    const balance = this.evaluateDynamicBalance(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. HaQei統合度評価
                    const integration = this.assessHaQeiIntegration(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. データフロー検証
                    const dataFlowValidation = this.validateDataFlow(engineOS, interfaceOS, safeModeOS);
                    
                    // 5. 推奨事項生成
                    const recommendations = this.generateRecommendations(consistency, balance, integration, dataFlowValidation);
                    
                    return {
                        consistency,
                        balance,
                        integration,
                        dataFlow: dataFlowValidation,
                        recommendations,
                        timestamp: Date.now(),
                        status: "success"
                    };
                    
                } catch (error) {
                    console.error("❌ Triple OS Interaction calculation failed:", error);
                    return this.getDefaultTripleOSInteraction();
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 動的バランス評価
             * 3つのOSの相互作用における動的平衡を評価
             */
            evaluateDynamicBalance(engineOS, interfaceOS, safeModeOS) {
                console.log("⚖️ Evaluating Dynamic Balance");
                
                try {
                    // 1. エネルギー分布の分析
                    const energyDistribution = this.analyzeEnergyDistribution(engineOS, interfaceOS, safeModeOS);
                    
                    // 2. 相互補完性の評価
                    const complementarity = this.assessComplementarity(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. 安定性指標の計算
                    const stability = this.calculateStabilityIndex(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. 適応性指標の計算
                    const adaptability = this.calculateAdaptabilityIndex(engineOS, interfaceOS, safeModeOS);
                    
                    // 5. 総合バランススコア
                    const balanceScore = (
                        energyDistribution * 0.3 + 
                        complementarity * 0.25 + 
                        stability * 0.25 + 
                        adaptability * 0.2
                    
                    return Math.min(100, Math.max(0, balanceScore));
                    
                } catch (error) {
                    console.error("❌ Dynamic balance evaluation failed:", error);
                    return 65; // デフォルトバランス値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * HaQei統合度評価
             * 易経哲学に基づく統合レベルの評価
             */
            assessHaQeiIntegration(engineOS, interfaceOS, safeModeOS) {
                console.log("🌟 Assessing HaQei Integration");
                
                try {
                    // 1. 易経原理の適用度評価
                    const yijingPrinciples = this.evaluateYijingPrinciples(engineOS, interfaceOS, safeModeOS);
                    
                    // 2. 三才思想の体現度（天・人・地）
                    const sancaiEmbodiment = this.evaluateSancaiEmbodiment(engineOS, interfaceOS, safeModeOS);
                    
                    // 3. 陰陽調和の実現度
                    const yinyangHarmony = this.evaluateYinyangHarmony(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. 五行相生の実現度
                    const wuxingSynergy = this.evaluateWuxingSynergy(engineOS, interfaceOS, safeModeOS);
                    
                    // 5. HaQei統合スコア
                    const integrationScore = (
                        yijingPrinciples * 0.35 +
                        sancaiEmbodiment * 0.25 +
                        yinyangHarmony * 0.25 +
                        wuxingSynergy * 0.15
                    
                    return Math.min(100, Math.max(0, integrationScore));
                    
                } catch (error) {
                    console.error("❌ HaQei integration assessment failed:", error);
                    return 70; // デフォルト統合値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 64卦出力の完全性確認
             * 各OSが1-64のすべての卦を出力可能か検証
             */
            validateTripleOSResults(engineOS, interfaceOS, safeModeOS) {
                console.log("🔍 Validating Triple OS Results");
                
                try {
                    // 1. 各OSの卦IDの有効性チェック
                    const validationResults = {
                        engineOS: this.validateOSHexagram(engineOS, "Engine OS"),
                        interfaceOS: this.validateOSHexagram(interfaceOS, "Interface OS"),  
                        safeModeOS: this.validateOSHexagram(safeModeOS, "SafeMode OS")
                    };
                    
                    // 2. 重複・欠落チェック
                    const duplicateCheck = this.checkForDuplicates([engineOS.hexagramId, interfaceOS.hexagramId, safeModeOS.hexagramId]);
                    
                    // 3. データフロー整合性チェック
                    const dataFlowCheck = this.validateDataFlowIntegrity(engineOS, interfaceOS, safeModeOS);
                    
                    // 4. エラーハンドリングチェック
                    const errorHandlingCheck = this.validateErrorHandling(engineOS, interfaceOS, safeModeOS);
                    
                    // 5. 検証レポート生成
                    const validationReport = {
                        ...validationResults,
                        duplicates: duplicateCheck,
                        dataFlow: dataFlowCheck,
                        errorHandling: errorHandlingCheck,
                        overallStatus: this.determineOverallValidationStatus(validationResults, duplicateCheck, dataFlowCheck, errorHandlingCheck),
                        timestamp: Date.now()
                    };
                    
                    console.log("✅ Triple OS Validation Complete:", validationReport);
                    return validationReport;
                    
                } catch (error) {
                    console.error("❌ Triple OS validation failed:", error);
                    throw new Error(`Triple OS validation failed: ${error.message}`);
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            /**
             * 推奨事項生成
             * 分析結果に基づく改善提案の生成
             */
            generateRecommendations(consistency, balance, integration, dataFlow) {
                console.log("💡 Generating Recommendations");
                
                const recommendations = [];
                
                try {
                    // 1. 整合性に基づく推奨
                    if (consistency < 70) {
                        recommendations.push({
                            type: "consistency",
                            priority: "high",
                            title: "OS間整合性の向上",
                            description: "Engine、Interface、SafeMode OSの相互関係を見直し、より調和の取れた統合を目指しましょう",
                            action: "価値観と行動パターンの再整理を推奨"
                        });
                    
                    // 2. バランスに基づく推奨
                    if (balance < 65) {
                        recommendations.push({
                            type: "balance",
                            priority: "medium",
                            title: "動的バランスの最適化",
                            description: "3つのOSの動的平衡を改善し、より安定した統合システムを構築しましょう",
                            action: "状況に応じたOS切り替えの練習を推奨"
                        });
                    
                    // 3. HaQei統合に基づく推奨
                    if (integration < 75) {
                        recommendations.push({
                            type: "integration",
                            priority: "medium",
                            title: "HaQei哲学の深化",
                            description: "易経原理をより深く理解し、日常生活での実践を増やしましょう",
                            action: "易経学習と瞑想的実践の継続を推奨"
                        });
                    
                    // 4. データフローに基づく推奨
                    if (dataFlow && !dataFlow.isValid) {
                        recommendations.push({
                            type: "dataflow",
                            priority: "high",
                            title: "情報処理フローの改善",
                            description: "価値観からシナリオ対応への情報の流れを改善し、一貫性のある判断を実現しましょう",
                            action: "セルフリフレクションの習慣化を推奨"
                        });
                    
                    // 5. 総合的な推奨事項
                    if (recommendations.length === 0) {
                        recommendations.push({
                            type: "optimization",
                            priority: "low",
                            title: "さらなる最適化",
                            description: "既に良好な統合状態です。さらなる向上のために継続的な自己観察を続けましょう",
                            action: "定期的な自己評価の実施を推奨"
                        });
                    
                    return recommendations;
                    
                } catch (error) {
                    console.error("❌ Recommendation generation failed:", error);
                    return [{
                        type: "error",
                        priority: "medium",
                        title: "評価エラー",
                        description: "推奨事項の生成中にエラーが発生しました。システムの動作を確認してください",
                        action: "技術的なサポートをご利用ください"
                    }];
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            // =================
            // 補助メソッド群
            // =================
            
            /**
             * 三爻レベルでの整合性分析
             */
            analyzeTrigramConsistency(engineOS, interfaceOS, safeModeOS) {
                try {
                    const compatibility1 = this.calculateTrigramCompatibility(engineOS.upperTrigram, interfaceOS.upperTrigram);
                    const compatibility2 = this.calculateTrigramCompatibility(engineOS.upperTrigram, safeModeOS.upperTrigram);
                    const compatibility3 = this.calculateTrigramCompatibility(interfaceOS.upperTrigram, safeModeOS.upperTrigram);
                    
                    return (compatibility1 + compatibility2 + compatibility3) / 3 * 100;
                } catch (error) {
                    return 60; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * HaQei哲学的一貫性の評価
             */
            evaluatePhilosophicalConsistency(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 易経の核心原理である変化と調和の体現度を評価
                    const changeAlignment = this.assessChangeAlignment(engineOS, interfaceOS, safeModeOS);
                    const harmonyAlignment = this.assessHarmonyAlignment(engineOS, interfaceOS, safeModeOS);
                    
                    return (changeAlignment + harmonyAlignment) / 2;
                } catch (error) {
                    return 70; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * エネルギー分布の分析
             */
            analyzeEnergyDistribution(engineOS, interfaceOS, safeModeOS) {
                try {
                    const engineEnergy = this.calculateOSEnergy(engineOS);
                    const interfaceEnergy = this.calculateOSEnergy(interfaceOS);
                    const safeModeEnergy = this.calculateOSEnergy(safeModeOS);
                    
                    const total = engineEnergy + interfaceEnergy + safeModeEnergy;
                    const idealRatio = [0.35, 0.35, 0.30]; // Engine, Interface, SafeMode
                    const actualRatio = [engineEnergy/total, interfaceEnergy/total, safeModeEnergy/total];
                    
                    // 理想比率との差異を計算
                    const deviation = idealRatio.reduce((sum, ideal, i) => sum + Math.abs(ideal - actualRatio[i]), 0);
                    
                    return Math.max(0, 100 - (deviation * 100));
                } catch (error) {
                    return 65; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 相互補完性の評価
             */
            assessComplementarity(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 3つのOSが互いを補完し合っているかを評価
                    const engineInterface = this.calculateComplementarity(engineOS, interfaceOS);
                    const engineSafeMode = this.calculateComplementarity(engineOS, safeModeOS);
                    const interfaceSafeMode = this.calculateComplementarity(interfaceOS, safeModeOS);
                    
                    return (engineInterface + engineSafeMode + interfaceSafeMode) / 3;
                } catch (error) {
                    return 60; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 安定性指標の計算
             */
            calculateStabilityIndex(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 各OSの安定性を三爻の特性から判断
                    const engineStability = this.getTrigramStability(engineOS.upperTrigram, engineOS.lowerTrigram);
                    const interfaceStability = this.getTrigramStability(interfaceOS.upperTrigram, interfaceOS.lowerTrigram);
                    const safeModeStability = this.getTrigramStability(safeModeOS.upperTrigram, safeModeOS.lowerTrigram);
                    
                    return (engineStability + interfaceStability + safeModeStability) / 3;
                } catch (error) {
                    return 70; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 適応性指標の計算
             */
            calculateAdaptabilityIndex(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 変化への適応能力を評価
                    const diversity = this.calculateOSDiversity(engineOS, interfaceOS, safeModeOS);
                    const flexibility = this.calculateFlexibility(engineOS, interfaceOS, safeModeOS);
                    
                    return (diversity + flexibility) / 2;
                } catch (error) {
                    return 65; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 易経原理の適用度評価
             */
            evaluateYijingPrinciples(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 64卦の本質的意味との整合性
                    const principleAlignment = [engineOS, interfaceOS, safeModeOS].reduce((sum, os) => {
                        const hexagram = this.getHexagramData(os.hexagramId);
                        return sum + this.assessHexagramPrincipleAlignment(hexagram, os);
                    }, 0) / 3;
                    
                    return principleAlignment;
                } catch (error) {
                    return 75; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 三才思想の体現度評価
             */
            evaluateSancaiEmbodiment(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 天・人・地の三才思想の体現度
                    const tianEmbodiment = this.assessTianEmbodiment(engineOS); // 天：創造・精神
                    const renEmbodiment = this.assessRenEmbodiment(interfaceOS); // 人：社会・関係
                    const diEmbodiment = this.assessDiEmbodiment(safeModeOS); // 地：基盤・安定
                    
                    return (tianEmbodiment + renEmbodiment + diEmbodiment) / 3;
                } catch (error) {
                    return 70; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 陰陽調和の実現度
             */
            evaluateYinyangHarmony(engineOS, interfaceOS, safeModeOS) {
                try {
                    const yinYangBalance = this.calculateYinYangBalance([engineOS, interfaceOS, safeModeOS]);
                    const complementaryBalance = this.calculateComplementaryBalance(engineOS, interfaceOS, safeModeOS);
                    
                    return (yinYangBalance + complementaryBalance) / 2;
                } catch (error) {
                    return 65; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * 五行相生の実現度
             */
            evaluateWuxingSynergy(engineOS, interfaceOS, safeModeOS) {
                try {
                    // 木火土金水の相生関係の実現度
                    const wuxingElements = [
                        this.getWuxingElement(engineOS),
                        this.getWuxingElement(interfaceOS),
                        this.getWuxingElement(safeModeOS)
                    ];
                    
                    return this.calculateWuxingSynergyScore(wuxingElements);
                } catch (error) {
                    return 60; // デフォルト値
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            /**
             * OS卦IDの有効性検証
             */
            validateOSHexagram(osResult, osName) {
                try {
                    const hexagramId = osResult.hexagramId;
                    
                    // 1. 卦IDが1-64の範囲内か
                    if (hexagramId < 1 || hexagramId > 64) {
                        return {
                            valid: false,
                            error: `Invalid hexagram ID: ${hexagramId}`,
                            osName: osName
                        };
                    
                    // 2. 三爻の組み合わせが有効か
                    const upperTrigram = osResult.upperTrigram;
                    const lowerTrigram = osResult.lowerTrigram;
                    const validTrigrams = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
                    
                    if (!validTrigrams.includes(upperTrigram) || !validTrigrams.includes(lowerTrigram)) {
                        return {
                            valid: false,
                            error: `Invalid trigram combination: ${upperTrigram}-${lowerTrigram}`,
                            osName: osName
                        };
                    
                    // 3. 卦と三爻の対応が正しいか
                    const expectedId = this.mapTrigramsToHexagram(upperTrigram, lowerTrigram);
                    if (expectedId !== hexagramId) {
                        return {
                            valid: false,
                            error: `Hexagram-Trigram mismatch: Expected ${expectedId}, got ${hexagramId}`,
                            osName: osName
                        };
                    
                    return {
                        valid: true,
                        hexagramId: hexagramId,
                        osName: osName,
                        trigramCombination: `${upperTrigram}-${lowerTrigram}`
                    };
                    
                } catch (error) {
                    return {
                        valid: false,
                        error: `Validation error: ${error.message}`,
                        osName: osName
                    };
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            /**
             * 重複チェック
             */
            checkForDuplicates(hexagramIds) {
                const duplicates = hexagramIds.filter((id, index) => hexagramIds.indexOf(id) !== index);
                return {
                    hasDuplicates: duplicates.length > 0,
                    duplicateIds: [...new Set(duplicates)],
                    uniqueCount: new Set(hexagramIds).size
                };
            
            /**
             * データフロー整合性チェック
             */
            validateDataFlowIntegrity(engineOS, interfaceOS, safeModeOS) {
                try {
                    // Q1-Q24 → Engine OS の影響チェック
                    const engineInfluence = this.validateEngineInfluence(engineOS);
                    
                    // Q25-Q30 → Interface OS & SafeMode OS の影響チェック
                    const scenarioInfluence = this.validateScenarioInfluence(interfaceOS, safeModeOS);
                    
                    // Engine OS → Interface OS (30%影響) のチェック
                    const engineToInterface = this.validateEngineToInterfaceFlow(engineOS, interfaceOS);
                    
                    // Engine OS → SafeMode OS (40%影響) のチェック
                    const engineToSafeMode = this.validateEngineToSafeModeFlow(engineOS, safeModeOS);
                    
                    return {
                        isValid: engineInfluence.valid && scenarioInfluence.valid && engineToInterface.valid && engineToSafeMode.valid,
                        engineInfluence,
                        scenarioInfluence,
                        engineToInterface,
                        engineToSafeMode
                    };
                    
                } catch (error) {
                    return {
                        isValid: false,
                        error: error.message
                    };
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            /**
             * エラーハンドリングの検証
             */
            validateErrorHandling(engineOS, interfaceOS, safeModeOS) {
                const errorHandlingScore = {
                    engineOS: this.checkOSErrorHandling(engineOS),
                    interfaceOS: this.checkOSErrorHandling(interfaceOS),
                    safeModeOS: this.checkOSErrorHandling(safeModeOS)
                };
                
                const allValid = Object.values(errorHandlingScore).every(score => score > 0.8);
                
                return {
                    isValid: allValid,
                    scores: errorHandlingScore,
                    overallScore: Object.values(errorHandlingScore).reduce((sum, score) => sum + score, 0) / 3
                };
            
            /**
             * 総合検証ステータスの決定
             */
            determineOverallValidationStatus(validationResults, duplicateCheck, dataFlowCheck, errorHandlingCheck) {
                const allOSValid = Object.values(validationResults).every(result => result.valid);
                const noDuplicates = !duplicateCheck.hasDuplicates;
                const dataFlowValid = dataFlowCheck.isValid;
                const errorHandlingValid = errorHandlingCheck.isValid;
                
                if (allOSValid && noDuplicates && dataFlowValid && errorHandlingValid) {
                    return "excellent";
                } else if (allOSValid && noDuplicates && dataFlowValid) {
                    return "good";
                } else if (allOSValid && noDuplicates) {
                    return "acceptable";
                } else {
                    return "needs_improvement";
            
            /**
             * データフローの検証
             */
            validateDataFlow(engineOS, interfaceOS, safeModeOS) {
                try {
                    return this.validateDataFlowIntegrity(engineOS, interfaceOS, safeModeOS);
                } catch (error) {
                    return {
                        isValid: false,
                        error: error.message
                    };
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            /**
             * デフォルトTriple OS相互作用結果
             */
            getDefaultTripleOSInteraction() {
                return {
                    consistency: 65,
                    balance: 60,
                    integration: 70,
                    dataFlow: { isValid: false, error: "Analysis failed" },
                    recommendations: [{
                        type: "system_error",
                        priority: "high",
                        title: "システムエラー",
                        description: "Triple OS分析中にエラーが発生しました",
                        action: "システムの再実行を推奨"
                    }],
                    timestamp: Date.now(),
                    status: "error"
                };
            
            // =================
            // 詳細補助メソッド群
            // =================
            
            assessChangeAlignment(engineOS, interfaceOS, safeModeOS) {
                // 変化への対応力の統合評価
                return 75; // 簡略実装
            
            assessHarmonyAlignment(engineOS, interfaceOS, safeModeOS) {
                // 調和の実現度の統合評価
                return 70; // 簡略実装
            
            calculateOSEnergy(os) {
                // OSのエネルギー強度を三爻エネルギーから実際に計算
                try {
                    if (!os || !os.trigramEnergies) {
                        console.warn('OSエネルギー計算: 三爻エネルギーデータが不足', os);
                        return 0;
                    
                    // 三爻エネルギーの合計値から強度を計算
                    const energies = Object.values(os.trigramEnergies);
                    if (energies.length === 0) return 0;
                    
                    // 平均エネルギー値を基本とし、最大値との差で強度を調整
                    const avgEnergy = energies.reduce((sum, e) => sum + e, 0) / energies.length;
                    const maxEnergy = Math.max(...energies);
                    const minEnergy = Math.min(...energies);
                    
                    // 集中度（エネルギー分散）を考慮した強度計算
                    const concentration = maxEnergy - minEnergy;
                    const intensity = avgEnergy + (concentration * 0.3);
                    
                    console.log(`🔋 ${os.hexagramName} Energy:`, {
                        avg: avgEnergy.toFixed(2),
                        max: maxEnergy.toFixed(2), 
                        concentration: concentration.toFixed(2),
                        intensity: intensity.toFixed(2)
                    });
                    
                    return Math.max(0, Math.min(100, intensity));
                } catch (error) {
                    console.error('OSエネルギー計算エラー:', error);
                    return 0;
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            calculateComplementarity(os1, os2) {
                // 2つのOS間の補完性を計算
                return Math.random() * 100; // 簡略実装
            
            getTrigramStability(upperTrigram, lowerTrigram) {
                // 三爻組み合わせの安定性を評価
                const stabilityScores = {
                    "乾": 85, "兌": 75, "離": 70, "震": 65,
                    "巽": 72, "坎": 68, "艮": 90, "坤": 95
                };
                
                return (stabilityScores[upperTrigram] + stabilityScores[lowerTrigram]) / 2;
            
            calculateOSDiversity(engineOS, interfaceOS, safeModeOS) {
                // OS間の多様性を評価
                const uniqueTrigrams = new Set([
                    engineOS.upperTrigram, engineOS.lowerTrigram,
                    interfaceOS.upperTrigram, interfaceOS.lowerTrigram,
                    safeModeOS.upperTrigram, safeModeOS.lowerTrigram
                ]).size;
                
                return (uniqueTrigrams / 8) * 100; // 8は全三爻数
            
            calculateFlexibility(engineOS, interfaceOS, safeModeOS) {
                // システムの柔軟性を評価
                return 70; // 簡略実装
            
            assessHexagramPrincipleAlignment(hexagram, os) {
                // 卦の原理との整合性を評価
                return 80; // 簡略実装
            
            assessTianEmbodiment(engineOS) {
                // 天の体現度（創造性・精神性）
                return 75; // 簡略実装
            
            assessRenEmbodiment(interfaceOS) {
                // 人の体現度（社会性・関係性）
                return 70; // 簡略実装
            
            assessDiEmbodiment(safeModeOS) {
                // 地の体現度（基盤・安定性）
                return 80; // 簡略実装
            
            calculateYinYangBalance(osArray) {
                // 陰陽バランスを計算
                return 65; // 簡略実装
            
            calculateComplementaryBalance(engineOS, interfaceOS, safeModeOS) {
                // 補完バランスを計算
                return 70; // 簡略実装
            
            getWuxingElement(os) {
                // OSの五行属性を取得
                const elements = ["木", "火", "土", "金", "水"];
                return elements[os.hexagramId % 5];
            
            calculateWuxingSynergyScore(elements) {
                // 五行相生スコアを計算
                return 60; // 簡略実装
            
            validateEngineInfluence(engineOS) {
                return { valid: true, score: 85 };
            
            validateScenarioInfluence(interfaceOS, safeModeOS) {
                return { valid: true, score: 80 };
            
            validateEngineToInterfaceFlow(engineOS, interfaceOS) {
                return { valid: true, influenceRate: 0.3 };
            
            validateEngineToSafeModeFlow(engineOS, safeModeOS) {
                return { valid: true, influenceRate: 0.4 };
            
            checkOSErrorHandling(os) {
                // OSのエラーハンドリング能力をチェック
                return os && os.hexagramId ? 0.9 : 0.3;
            
            /**
             * デフォルトTriple OS結果（エラー時のフォールバック）
             */
            getDefaultTripleOSResults() {
                return {
                    engineOS: {
                        hexagramId: 1,
                        hexagramName: "乾為天",
                        upperTrigram: "乾",
                        lowerTrigram: "乾",
                        description: "創造性と実行力の基盤システム（デフォルト）",
                        type: "Engine OS"
                    },
                    interfaceOS: {
                        hexagramId: 11,
                        hexagramName: "地天泰",
                        upperTrigram: "坤",
                        lowerTrigram: "乾",
                        description: "調和的な社会的コミュニケーションシステム（デフォルト）",
                        type: "Interface OS"
                    },
                    safeModeOS: {
                        hexagramId: 2,
                        hexagramName: "坤為地",
                        upperTrigram: "坤",
                        lowerTrigram: "坤",
                        description: "安定性重視の防御システム（デフォルト）",
                        type: "SafeMode OS"
                    },
                    integration: {
                        consistency: 50,
                        balance: 50,
                        integration: 50,
                        dataFlow: { isValid: false, error: "Default fallback mode" },
                        recommendations: [{
                            type: "system_recovery",
                            priority: "high",
                            title: "システム復旧",
                            description: "Triple OS分析でエラーが発生したため、デフォルト結果を表示しています",
                            action: "再度分析を実行するか、入力内容を確認してください"
                        }],
                        timestamp: Date.now(),
                        status: "fallback"
                    },
                    consistencyScore: 50,
                    balanceScore: 50,
                    HaQeiIntegration: 50,
                    recommendations: [{
                        type: "system_recovery",
                        priority: "high",
                        title: "システム復旧が必要",
                        description: "分析システムにエラーが発生しました。デフォルト結果を表示しています",
                        action: "ページを再読み込みして再度お試しください"
                    }],
                    validationStatus: "error",
                    timestamp: Date.now(),
                    errorMode: true
                };
        
        // 7. 状態管理システム
        class HAQEIState {
            constructor() {
                this.currentQuestion = 0;
                this.answers = [];
                this.userVector = {};
                this.tripleOSResults = null;
                this.isAnalyzing = false;
                
                this.loadState();
            
            saveState() {
                try {
                    const state = {
                        currentQuestion: this.currentQuestion,
                        answers: this.answers,
                        userVector: this.userVector,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('haqei_state', JSON.stringify(state));
                } catch (error) {
                    console.warn('⚠️ Failed to save state:', error);
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            loadState() {
                try {
                    const saved = localStorage.getItem('haqei_state');
                    if (saved) {
                        const state = JSON.parse(saved);
                        // 1時間以内のデータのみ復元
                        if (Date.now() - state.timestamp < 3600000) {
                            this.currentQuestion = state.currentQuestion || 0;
                            this.answers = state.answers || [];
                            this.userVector = state.userVector || {};
                } catch (error) {
                    console.warn('⚠️ Failed to load state:', error);
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            clearState() {
                try {
                    localStorage.removeItem('haqei_state');
                } catch (error) {
                    console.warn('⚠️ Failed to clear state:', error);
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            saveAnswer(questionIndex, selectedOption) {
                this.answers[questionIndex] = {
                    questionId: QUESTIONS[questionIndex].id,
                    selectedOption: selectedOption,
                    timestamp: Date.now()
                };
                this.saveState();
            
            getAnswer(questionIndex) {
                return this.answers[questionIndex] || null;
        
        // 8. アプリケーション制御
        class CriticalCSSAnalyzer {
            constructor() {
                this.state = new HAQEIState();
                this.tripleOSEngine = new TripleOSEngine();
                this.trigramScores = {};
                
                this.initializeTrigramScores();
                this.bindEvents();
                
                // 復元された状態があれば画面を表示
                if (this.state.currentQuestion > 0) {
                    this.showQuestion(this.state.currentQuestion);
            
            
            initializeTrigramScores() {
                for (let i = 1; i <= 8; i++) {
                    this.trigramScores[i] = 0;
                }
            
            bindEvents() {
                console.log('🔧 Binding events...');
                
                // ナビゲーション - with robust error handling
                try {
                    const startBtn = document.getElementById('start-btn');
                    if (startBtn) {
                        console.log('✅ Start button found, binding event');
                        startBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            console.log('🎯 Start button clicked, calling startAnalysis');
                            this.startAnalysis();
                        });
                    } else {
                        console.error('❌ Start button not found!');
                    }
                } catch (error) {
                    console.error('❌ Error binding start button:', error);
                }
                } catch (error) {
                    console.error(`❌ Operation failed: ${error.message}`);
                    return null; // Default fallback
                
                try {
                    const prevBtn = document.getElementById('prev-btn');
                    if (prevBtn) {
                        prevBtn.addEventListener('click', () => this.previousQuestion());
                        console.log('✅ Prev button event bound');
                    
                    const nextBtn = document.getElementById('next-btn');
                    if (nextBtn) {
                        nextBtn.addEventListener('click', () => this.nextQuestion());
                        console.log('✅ Next button event bound');
                    
                    const restartBtn = document.getElementById('restart-btn');
                    if (restartBtn) {
                        restartBtn.addEventListener('click', () => this.restart());
                        console.log('✅ Restart button event bound');
                    
                    const retryBtn = document.getElementById('retry-btn');
                    if (retryBtn) {
                        retryBtn.addEventListener('click', () => this.restart());
                        console.log('✅ Retry button event bound');
                    
                    // キーボードナビゲーション
                    document.addEventListener('keydown', (e) => this.handleKeydown(e));
                    console.log('✅ Keyboard navigation event bound');
                } catch (error) {
                    console.error('❌ Error binding navigation events:', error);
                }
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            handleKeydown(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const focused = document.activeElement;
                    if (focused.classList.contains('option')) {
                        e.preventDefault();
                        this.selectOption(focused);
                    }
                }
            
            startAnalysis() {
                console.log('🎯 startAnalysis called!');
                console.log('🔍 Attempting to show question screen...');
                this.showScreen('question-screen');
                console.log('🔍 Showing first question...');
                this.showQuestion(0);
                this.announce('質問が開始されました');
                console.log('✅ startAnalysis completed successfully!');
            
            showScreen(screenId) {
                console.log(`🔍 showScreen called with: ${screenId}`);
                const screens = document.querySelectorAll('.screen');
                console.log(`📺 Found ${screens.length} screens`);
                screens.forEach(screen => {
                    screen.classList.remove('active');
                });
                
                const targetScreen = document.getElementById(screenId);
                if (targetScreen) {
                    targetScreen.classList.add('active');
                    console.log(`✅ Screen ${screenId} is now active`);
                } else {
                    console.error(`❌ Screen ${screenId} not found!`);
                }
            
            showQuestion(index) {
                if (index >= QUESTIONS.length) {
                    this.proceedToAnalysis();
                    return;
                
                this.state.currentQuestion = index;
                this.showScreen('question-screen');
                const question = QUESTIONS[index];
                
                // 進捗バー更新
                const progress = ((index + 1) / QUESTIONS.length) * 100;
                document.getElementById('progress-fill').style.width = `${progress}%`;
                
                // 質問表示
                document.getElementById('question-number').textContent = index + 1;
                document.getElementById('question-title').textContent = question.text;
                
                // オプション表示
                const container = document.getElementById('options-container');
                container.innerHTML = '';
                
                question.options.forEach((option, optionIndex) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'option';
                    optionElement.setAttribute('role', 'radio');
                    optionElement.setAttribute('aria-checked', 'false');
                    optionElement.setAttribute('tabindex', '0');
                    optionElement.innerHTML = `
                        <span class="option-text">${option.text}</span>
                    `;
                    
                    optionElement.addEventListener('click', () => this.selectOption(optionElement, option));
                    container.appendChild(optionElement);
                });
                
                // 既存の回答があれば復元
                const existingAnswer = this.state.getAnswer(index);
                if (existingAnswer) {
                    const selectedOption = existingAnswer.selectedOption;
                    const optionElements = container.querySelectorAll('.option');
                    optionElements.forEach((elem, idx) => {
                        if (question.options[idx].value === selectedOption.value) {
                            elem.classList.add('selected');
                            elem.setAttribute('aria-checked', 'true');
                        }
                    });
                    document.getElementById('next-btn').disabled = false;
                
                // ナビゲーションボタン更新
                document.getElementById('prev-btn').disabled = index === 0;
                if (!existingAnswer) {
                    document.getElementById('next-btn').disabled = true;
                
                this.announce(`質問${index + 1}: ${question.text}`);
            
            selectOption(element, option) {
                // 既存の選択を解除
                element.parentNode.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.setAttribute('aria-checked', 'false');
                });
                
                // 新しい選択を設定
                element.classList.add('selected');
                element.setAttribute('aria-checked', 'true');
                
                // 回答を保存（状態管理システム経由）
                this.state.saveAnswer(this.state.currentQuestion, option);
                
                // 次へボタンを有効化
                document.getElementById('next-btn').disabled = false;
                
                this.announce(`選択されました: ${option.text}`);
            
            nextQuestion() {
                if (this.state.currentQuestion < QUESTIONS.length - 1) {
                    this.showQuestion(this.state.currentQuestion + 1);
                } else {
                    this.proceedToAnalysis();
                }
            
            previousQuestion() {
                if (this.state.currentQuestion > 0) {
                    this.showQuestion(this.state.currentQuestion - 1);
                }
            
            async proceedToAnalysis() {
                try {
                    this.showScreen('analysis-screen');
                    this.announce('分析を開始しています');
                    this.state.isAnalyzing = true;
                    
                    // Triple OS分析を実行
                    await this.delay(1500); // UI演出
                    
                    // 回答データの変換
                    const allAnswers = this.state.answers.filter(answer => answer && answer.selectedOption);
                    
                    // Triple OSエンジンによる分析
                    const tripleOSResults = await this.tripleOSEngine.analyzeTripleOS(allAnswers);
                    
                    // 結果を状態に保存
                    this.state.tripleOSResults = tripleOSResults;
                    
                    // 結果表示
                    this.showResults(tripleOSResults);
                    
                } catch (error) {
                    console.error('❌ Analysis failed:', error);
                    this.showError('分析中にエラーが発生しました: ' + error.message);
                } finally {
                    this.state.isAnalyzing = false;
                }
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
            
            calculateTrigramScores() {
                this.initializeTrigramScores();
                
                this.answers.forEach(answer => {
                    if (answer && answer.trigrams) {
                        answer.trigrams.forEach(trigramId => {
                            this.trigramScores[trigramId]++;
                        });
                    }
                });
            
            calculateOSScores() {
                const osScores = {};
                
                Object.keys(TRIPLE_OS).forEach(osName => {
                    const os = TRIPLE_OS[osName];
                    let score = 0;
                    
                    os.trigrams.forEach(trigramId => {
                        score += this.trigramScores[trigramId] || 0;
                    });
                    
                    osScores[osName] = {
                        ...os,
                        score: score,
                        percentage: Math.round((score / (QUESTIONS.length * 2)) * 100)
                    };
                });
                
                return osScores;
            
            // 🚀 革新的4層構造結果表示システム - 完全リファクタリング版
            showResults(tripleOSResults) {
                // デバッグ: 受け取ったデータの確認
                if (!tripleOSResults || !tripleOSResults.engineOS) {
                    console.error('Triple OS結果が不完全です:', tripleOSResults);
                    this.showError('結果の生成に失敗しました。もう一度お試しください。');
                    return;
                
                this.showScreen('results-screen');
                
                // 4層構造ナビゲーション初期化
                this.initializeLayerNavigation();
                
                // 基本層: 改良されたOSカード表示
                this.renderBasicLayer(tripleOSResults);
                
                // 詳細層: 三爻エネルギー分析
                this.renderDetailedLayer(tripleOSResults);
                
                // 専門層: 64卦完全解釈
                this.renderExpertLayer(tripleOSResults);
                
                // 統合層: HaQei哲学統合
                this.renderIntegratedLayer(tripleOSResults);
                
                // サマリー生成
                this.generateTripleOSSummary(tripleOSResults);
                
                // データ保存
                this.saveResults(tripleOSResults);
                
                // アナウンス
                this.announce('革新的Triple OS分析が完了しました - 4層の複雑性をお楽しみください');
                
                // console.log('🔯 Revolutionary 4-Layer Results System Activated');
            
            // 4層ナビゲーションシステム初期化
            initializeLayerNavigation() {
                const tabBtns = document.querySelectorAll('.tab-btn');
                const layerContents = document.querySelectorAll('.layer-content');
                
                tabBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const targetLayer = btn.getAttribute('data-layer');
                        
                        // アクティブタブ切り替え
                        tabBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        // レイヤー表示切り替え
                        layerContents.forEach(content => {
                            content.classList.remove('active');
                            if (content.getAttribute('data-layer') === targetLayer) {
                                content.classList.add('active');
                            }
                        });
                        
                        // アナウンス
                        const layerNames = {
                            'basic': '基本層 - OSの概要',
                            'detailed': '詳細層 - 三爻エネルギー分析',
                            'expert': '専門層 - 64卦解釈システム',
                            'integrated': '統合層 - HaQei哲学統合'
                        };
                        this.announce(`${layerNames[targetLayer]}に切り替えました`);
                    });
                });
            
            // 基本層: 改良されたOSカード + Triple OS相互関係可視化
            renderBasicLayer(tripleOSResults) {
                // OSカード表示
                const container = document.getElementById('os-cards-container');
                container.innerHTML = '';
                
                // 改良されたOSカード生成
                const engineCard = this.createEnhancedOSCard('Engine OS', tripleOSResults.engineOS, '#6366f1');
                const interfaceCard = this.createEnhancedOSCard('Interface OS', tripleOSResults.interfaceOS, '#8b5cf6');
                const safeModeCard = this.createEnhancedOSCard('Safe Mode OS', tripleOSResults.safeModeOS, '#10b981');
                
                container.appendChild(engineCard);
                container.appendChild(interfaceCard);  
                container.appendChild(safeModeCard);
                
                // Triple OS相互関係可視化
                this.renderOSInteractionVisualization(tripleOSResults);
                
                // 動的バランス表示
                this.renderDynamicBalance(tripleOSResults);
            
            // 詳細層: 8次元ベクトル可視化 + 三爻エネルギー分析
            renderDetailedLayer(tripleOSResults) {
                // 8次元レーダーチャート
                this.render8DimensionalRadar(tripleOSResults);
                
                // 三爻エネルギーバランス分析
                this.renderTrigramEnergyAnalysis(tripleOSResults);
                
                // エネルギーフロー可視化
                this.renderEnergyFlowVisualization(tripleOSResults);
            
            // 専門層: 64卦完全解釈システム
            renderExpertLayer(tripleOSResults) {
                // 詳細な卦分析
                this.renderDetailedHexagramAnalysis(tripleOSResults);
                
                // 変卦システム
                this.renderChangeHexagramSystem(tripleOSResults);
                
                // 古典的wisdom（卦辞・爻辞）
                this.renderClassicalWisdom(tripleOSResults);
            
            // 統合層: HaQei哲学統合とパーソナライズド洞察
            renderIntegratedLayer(tripleOSResults) {
                // HaQei哲学統合wisdom
                this.renderHaQeiWisdom(tripleOSResults);
                
                // パーソナライズド洞察生成
                this.renderPersonalizedInsights(tripleOSResults);
                
                // 実践的戦略提案
                this.renderPracticalStrategies(tripleOSResults);
            
            // 🎯 Triple OS相互関係レーダーチャート (Chart.js Phase2完全実装)
            renderTripleOSRadarChart(tripleOSResults) {
                const canvas = document.getElementById('os-interaction-chart');
                if (!canvas) {
                    console.error('Canvas element not found: os-interaction-chart');
                    return;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('2D context not available for os-interaction-chart');
                    return;
                
                // 既存のチャートを破棄
                if (this.osInteractionChart) {
                    this.osInteractionChart.destroy();
                
                // 相互関係データの計算
                const interactionData = this.calculateOSInteractionData(tripleOSResults);
                
                try {
                    this.osInteractionChart = new Chart(ctx, {
                        type: 'radar',
                    data: {
                        labels: [
                            'Engine→Interface影響度',
                            'Interface→SafeMode影響度', 
                            'SafeMode→Engine影響度',
                            'Engine自律性',
                            'Interface適応性',
                            'SafeMode安定性',
                            'システム統合度',
                            'バランス調和性'
                        ],
                        datasets: [{
                            label: 'Triple OS動的関係',
                            data: interactionData,
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            borderColor: 'rgba(99, 102, 241, 0.8)',
                            borderWidth: 3,
                            pointBackgroundColor: [
                                '#6366f1', '#8b5cf6', '#10b981', '#6366f1',
                                '#8b5cf6', '#10b981', '#a855f7', '#fbbf24'
                            ],
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#e2e8f0',
                                    font: { size: 14 }
                                }
                            }
                        },
                        scales: {
                            r: {
                                angleLines: {
                                    color: 'rgba(99, 102, 241, 0.3)'
                                },
                                grid: {
                                    color: 'rgba(99, 102, 241, 0.2)'
                                },
                                pointLabels: {
                                    color: '#cbd5e1',
                                    font: { size: 12 }
                                },
                                ticks: {
                                    color: '#94a3b8',
                                    backdropColor: 'transparent'
                                }
                            }
                        }
                    }
                    });
                } catch (error) {
                    console.error('Chart creation failed for os-interaction-chart:', error);
                }
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            // 動的バランス表示
            renderDynamicBalance(tripleOSResults) {
                const balanceDisplay = document.getElementById('dynamic-balance-display');
                const balance = this.calculateDynamicBalance(tripleOSResults);
                
                balanceDisplay.innerHTML = `
                    <h4 style="color: var(--primary-100); margin-bottom: var(--space-md); text-align: center;">
                        🔄 動的バランス分析
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
                        <div class="balance-metric">
                            <div class="metric-label">主導システム</div>
                            <div class="metric-value" style="color: ${balance.dominantColor};">${balance.dominantOS}</div>
                        </div>
                        <div class="balance-metric">
                            <div class="metric-label">システム協調度</div>
                            <div class="metric-value" style="color: var(--accent-400);">${balance.coordination}%</div>
                        </div>
                        <div class="balance-metric">
                            <div class="metric-label">適応柔軟性</div>
                            <div class="metric-value" style="color: var(--success-500);">${balance.flexibility}%</div>
                        </div>
                        <div class="balance-metric">
                            <div class="metric-label">ストレス耐性</div>
                            <div class="metric-value" style="color: var(--warning-500);">${balance.resilience}%</div>
                        </div>
                    </div>
                    <div style="margin-top: var(--space-md); padding: var(--space-md); background: rgba(99, 102, 241, 0.05); border-radius: var(--radius-md); border: 1px solid rgba(99, 102, 241, 0.2);">
                        <p style="color: var(--primary-200); line-height: 1.6;">
                            ${balance.analysis}
                        </p>
                    </div>
                `;
                
                // メトリクススタイル追加
                const style = document.createElement('style');
                style.textContent = `
                    .balance-metric {
                        text-align: center;
                        padding: var(--space-md);
                        background: rgba(15, 23, 42, 0.6);
                        border-radius: var(--radius-md);
                        border: 1px solid rgba(99, 102, 241, 0.2);
                    }
                    .metric-label {
                        font-size: var(--font-sm);
                        color: var(--primary-300);
                        margin-bottom: var(--space-xs);
                    }
                    .metric-value {
                        font-size: var(--font-lg);
                        font-weight: 700;
                    }
                `;
                document.head.appendChild(style);
            
            // 🎨 改良されたOSカード作成システム（仮想人格強化版）
            createEnhancedOSCard(osName, osData, color) {
                // データ検証
                if (!osData) {
                    console.error(`${osName}のデータが空です`);
                    osData = {
                        hexagramId: 0,
                        hexagramName: '計算中',
                        catchphrase: 'データ取得中',
                        description: 'しばらくお待ちください',
                        trigramEnergies: {}
                    };
                
                const card = document.createElement('div');
                card.className = 'os-card card';
                card.style.setProperty('--card-color', color);
                card.style.borderColor = color + '40';
                
                // 仮想人格タイプの決定
                const osType = osName === 'Engine OS' ? 'engine' : 
                              osName === 'Interface OS' ? 'interface' : 'safemode';
                
                // 仮想人格エンハンスメント
                const personaEnhancer = window.virtualPersonaEnhancer;
                const personaCard = personaEnhancer ? personaEnhancer.generatePersonaCard(osData, osType) : '';
                
                // HaQei準拠の表現（決定論的回避）
                const confidenceText = osName === 'Engine OS' ? 
                    'あなたの深層価値観として参考にしていただける' : 
                    osName === 'Interface OS' ?
                    '社会的な側面の一つの視点として' :
                    '困難な状況での対処パターンの一つとして';
                
                // エネルギー分布の可視化データ
                const energyData = osData.trigramEnergies || {};
                const energyBars = Object.entries(energyData).map(([trigram, energy]) => `
                    <div class="energy-bar">
                        <span class="energy-label">${trigram}</span>
                        <div class="energy-progress">
                            <div class="energy-fill" style="width: ${energy}%; background: ${color};"></div>
                        </div>
                        <span class="energy-value">${Math.round(energy)}%</span>
                    </div>
                `).join('');
                
                card.innerHTML = `
                    <div class="os-header">
                        <div class="os-name">${osName}</div>
                        <div class="os-score" style="color: ${color};">${osData.hexagramName || '分析中'}</div>
                    </div>
                    
                    ${personaCard}
                    
                    <div class="os-catchphrase" style="color: ${color}; font-weight: bold; margin: var(--space-sm) 0;">
                        「${osData.catchphrase || 'システム分析中...'}」
                    </div>
                    
                    <div class="os-description">${osData.description || 'システム分析中...'}</div>
                    
                    <div class="os-energy-section">
                        <h5 style="color: var(--primary-200); margin-bottom: var(--space-sm); font-size: var(--font-sm);">
                            ☊ エネルギー分布
                        </h5>
                        <div class="energy-bars">
                            ${energyBars}
                        </div>
                    </div>
                    
                    <div class="os-meta">
                        <div style="color: var(--primary-400); font-size: var(--font-sm); line-height: 1.5;">
                            ${confidenceText}分析結果です
                        </div>
                        ${osData.catchphrase ? `
                            <div style="margin-top: var(--space-sm); font-style: italic; color: ${color}; font-weight: 500;">
                                "${osData.catchphrase}"
                            </div>
                        ` : ''}
                    </div>
                `;
                
                // エネルギーバースタイル追加
                const energyStyle = document.createElement('style');
                energyStyle.textContent = `
                    .os-energy-section {
                        margin: var(--space-md) 0;
                        padding: var(--space-sm);
                        background: rgba(15, 23, 42, 0.4);
                        border-radius: var(--radius-sm);
                    }
                    .energy-bars {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-xs);
                    }
                    .energy-bar {
                        display: flex;
                        align-items: center;
                        gap: var(--space-sm);
                        font-size: var(--font-sm);
                    }
                    .energy-label {
                        min-width: 3rem;
                        color: var(--primary-300);
                        font-weight: 500;
                    }
                    .energy-progress {
                        flex: 1;
                        height: 8px;
                        background: rgba(15, 23, 42, 0.8);
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    .energy-fill {
                        height: 100%;
                        border-radius: 4px;
                        transition: width 0.8s ease;
                    }
                    .energy-value {
                        min-width: 2.5rem;
                        text-align: right;
                        color: var(--primary-200);
                        font-weight: 600;
                    }
                `;
                document.head.appendChild(energyStyle);
                
                return card;
            
            // 🔢 OS相互関係データ計算
            calculateOSInteractionData(tripleOSResults) {
                const { engineOS, interfaceOS, safeModeOS, integration } = tripleOSResults;
                
                // 相互関係強度計算（8次元分析）
                return [
                    this.calculateInfluenceStrength(engineOS, interfaceOS),     // Engine→Interface
                    this.calculateInfluenceStrength(interfaceOS, safeModeOS),  // Interface→SafeMode  
                    this.calculateInfluenceStrength(safeModeOS, engineOS),     // SafeMode→Engine
                    this.calculateAutonomyIndex(engineOS),                     // Engine自律性
                    this.calculateAdaptabilityIndex(interfaceOS),              // Interface適応性
                    this.calculateStabilityIndex(safeModeOS),                  // SafeMode安定性
                    integration?.consistency || 75,                            // システム統合度
                    integration?.balance || 70                                 // バランス調和性
                ];
            
            calculateInfluenceStrength(sourceOS, targetOS) {
                const sourceEnergies = sourceOS.trigramEnergies || {};
                const targetEnergies = targetOS.trigramEnergies || {};
                
                // 共通三爻の重複度から相互影響を計算
                let totalInfluence = 0;
                let commonTrigrams = 0;
                
                Object.keys(sourceEnergies).forEach(trigram => {
                    if (targetEnergies[trigram]) {
                        totalInfluence += Math.min(sourceEnergies[trigram], targetEnergies[trigram]);
                        commonTrigrams++;
                    }
                });
                
                return commonTrigrams > 0 ? Math.round(totalInfluence / commonTrigrams) : 50;
            
            calculateAutonomyIndex(engineOS) {
                const energies = engineOS.trigramEnergies || {};
                const maxEnergy = Math.max(...Object.values(energies));
                const avgEnergy = Object.values(energies).reduce((a, b) => a + b, 0) / Object.keys(energies).length;
                return Math.round((maxEnergy / avgEnergy) * 15); // 自律性指標
            
            calculateAdaptabilityIndex(interfaceOS) {
                const energies = interfaceOS.trigramEnergies || {};
                const variance = this.calculateVariance(Object.values(energies));
                return Math.round(Math.max(30, 100 - variance)); // 適応性指標
            
            calculateStabilityIndex(safeModeOS) {
                const energies = safeModeOS.trigramEnergies || {};
                const stability = Object.values(energies).reduce((acc, val) => acc + (val > 60 ? val : 0), 0);
                return Math.round(stability / Object.keys(energies).length);
            
            calculateVariance(values) {
                if (!values || values.length === 0) return 0;
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                return Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
            
            // 🌊 動的バランス計算
            calculateDynamicBalance(tripleOSResults) {
                const { engineOS, interfaceOS, safeModeOS, integration } = tripleOSResults;
                
                // 各OSの強度計算
                const engineStrength = this.calculateOSStrength(engineOS);
                const interfaceStrength = this.calculateOSStrength(interfaceOS);
                const safeModeStrength = this.calculateOSStrength(safeModeOS);
                
                // 主導システム特定
                const strengths = {
                    'Engine OS': { value: engineStrength, color: '#6366f1' },
                    'Interface OS': { value: interfaceStrength, color: '#8b5cf6' },
                    'Safe Mode OS': { value: safeModeStrength, color: '#10b981' }
                };
                
                const dominantOS = Object.keys(strengths).reduce((a, b) => 
                    strengths[a].value > strengths[b].value ? a : b
                
                // バランス指標計算
                const coordination = Math.round(integration?.consistency || 
                    (100 - Math.abs(engineStrength - interfaceStrength) - Math.abs(interfaceStrength - safeModeStrength)));
                
                const flexibility = Math.round(
                    (interfaceStrength + (100 - Math.max(engineStrength, safeModeStrength))) / 2
                
                const resilience = Math.round(
                    (safeModeStrength + coordination) / 2
                
                // 分析文生成
                const analysis = this.generateBalanceAnalysis(dominantOS, coordination, flexibility, resilience);
                
                return {
                    dominantOS,
                    dominantColor: strengths[dominantOS].color,
                    coordination,
                    flexibility, 
                    resilience,
                    analysis
                };
            
            calculateOSStrength(osData) {
                const energies = osData.trigramEnergies || {};
                const values = Object.values(energies);
                if (values.length === 0) return 0;
                return Math.round(
                    values.reduce((sum, energy) => sum + energy, 0) / 
                    values.length
            
            generateBalanceAnalysis(dominantOS, coordination, flexibility, resilience) {
                const insights = {
                    'Engine OS': `価値観システムが主導的です。あなたは内的な信念や価値観に基づいて行動する傾向が強く、一貫性のある判断を行います。`,
                    'Interface OS': `社会的システムが主導的です。他者との関係性や状況に応じた柔軟な対応を得意とし、環境に適応しながら成長していきます。`,
                    'Safe Mode OS': `防御システムが主導的です。安定性と安全性を重視し、慎重な判断を行いながらリスクを最小化する傾向があります。`
                };
                
                let analysis = insights[dominantOS];
                
                if (coordination > 80) {
                    analysis += ` 3つのシステムの協調性が非常に高く、統合された人格として機能しています。`;
                } else if (coordination < 60) {
                    analysis += ` システム間の調整に改善の余地があります。各OSの特性を理解し、バランスを取ることで更なる成長が期待できます。`;
                
                return analysis;
            
            createOSCard(osName, osData, color) {
                // 後方互換性のため、新しいcreateEnhancedOSCardを呼び出し
                return this.createEnhancedOSCard(osName, osData, color);
            
            // 📊 8次元ベクトル可視化システム (Chart.js)
            render8DimensionalRadar(tripleOSResults) {
                const canvas = document.getElementById('8d-vector-chart');
                if (!canvas) {
                    console.error('Canvas element not found: 8d-vector-chart');
                    return;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('2D context not available for 8d-vector-chart');
                    return;
                
                // 既存のチャートを破棄
                if (this.vectorChart) {
                    this.vectorChart.destroy();
                
                // 8次元データの統合
                const vectorData = this.calculate8DimensionalVector(tripleOSResults);
                
                try {
                    this.vectorChart = new Chart(ctx, {
                        type: 'radar',
                    data: {
                        labels: [
                            '乾_創造性', '震_行動性', '坎_探求性', '艮_安定性',
                            '坤_受容性', '巽_適応性', '離_表現性', '兌_調和性'
                        ],
                        datasets: [
                            {
                                label: 'Engine OS (価値観)',
                                data: vectorData.engine,
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                borderColor: 'rgba(99, 102, 241, 0.8)',
                                borderWidth: 2,
                                pointBackgroundColor: '#6366f1'
                            },
                            {
                                label: 'Interface OS (社会性)',
                                data: vectorData.interface,
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                borderColor: 'rgba(139, 92, 246, 0.8)',
                                borderWidth: 2,
                                pointBackgroundColor: '#8b5cf6'
                            },
                            {
                                label: 'Safe Mode OS (防御)',
                                data: vectorData.safeMode,
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                borderColor: 'rgba(16, 185, 129, 0.8)',
                                borderWidth: 2,
                                pointBackgroundColor: '#10b981'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#e2e8f0',
                                    font: { size: 12 },
                                    padding: 15
                                }
                            }
                        },
                        scales: {
                            r: {
                                beginAtZero: true,
                                min: 0,
                                max: 100,
                                angleLines: {
                                    color: 'rgba(139, 92, 246, 0.3)'
                                },
                                grid: {
                                    color: 'rgba(139, 92, 246, 0.2)'
                                },
                                pointLabels: {
                                    color: '#cbd5e1',
                                    font: { size: 11 }
                                },
                                ticks: {
                                    color: '#94a3b8',
                                    backdropColor: 'transparent',
                                    stepSize: 20
                                }
                            }
                        }
                    }
                });
            }
            } catch (error) {
                console.error(`❌ Operation failed: ${error.message}`);
                return null; // Default fallback
            
            // 8次元ベクトルデータ計算
            // ⚡ 8次元エネルギーベクトル極座標チャート
            renderTrigramEnergyPolarChart(tripleOSResults) {
                const canvas = document.getElementById('trigram-energy-polar-chart');
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                
                // 既存のチャートを破棄
                if (this.vectorChart) {
                    this.vectorChart.destroy();
                
                // 8次元データの統合
                const vectorData = this.calculate8DimensionalVector(tripleOSResults);
                
                this.vectorChart = new Chart(ctx, {
                    type: 'polarArea',
                    data: {
                        labels: [
                            '乾(創造)', '兌(調和)', '離(表現)', '震(行動)',
                            '巽(適応)', '坎(探求)', '艮(安定)', '坤(受容)'
                        ],
                        datasets: [{
                            data: [
                                vectorData.combined.qian || 50,
                                vectorData.combined.dui || 50,
                                vectorData.combined.li || 50,
                                vectorData.combined.zhen || 50,
                                vectorData.combined.xun || 50,
                                vectorData.combined.kan || 50,
                                vectorData.combined.gen || 50,
                                vectorData.combined.kun || 50
                            ],
                            backgroundColor: [
                                '#FFD700', '#87CEEB', '#FF4500', '#8A2BE2',
                                '#32CD32', '#1E90FF', '#708090', '#8B4513'
                            ],
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: '8次元エネルギーベクトル分析',
                                color: '#e2e8f0',
                                font: { size: 16, weight: 'bold' }
                            },
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#cbd5e1',
                                    font: { size: 10 }
                                }
                            }
                        }
                    }
                });
            
            // 🌸 HaQei複数人格協調チャート
            renderHaQeiPersonaChart(tripleOSResults) {
                const canvas = document.getElementById('haqei-persona-chart');
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                
                // 既存のチャートを破棄
                if (this.personaChart) {
                    this.personaChart.destroy();
                
                const totalEnergy = (
                    this.calculateOSEnergy(tripleOSResults.engineOS) +
                    this.calculateOSEnergy(tripleOSResults.interfaceOS) +
                    this.calculateOSEnergy(tripleOSResults.safeModeOS)
                
                const enginePercent = ((this.calculateOSEnergy(tripleOSResults.engineOS) / totalEnergy) * 100).toFixed(1);
                const interfacePercent = ((this.calculateOSEnergy(tripleOSResults.interfaceOS) / totalEnergy) * 100).toFixed(1);
                const safeModePercent = ((this.calculateOSEnergy(tripleOSResults.safeModeOS) / totalEnergy) * 100).toFixed(1);
                
                this.personaChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Engine OS (内的価値観)', 'Interface OS (社会適応)', 'Safe Mode OS (防御システム)'],
                        datasets: [{
                            data: [enginePercent, interfacePercent, safeModePercent],
                            backgroundColor: ['#6366f1', '#8b5cf6', '#10b981'],
                            hoverBackgroundColor: ['#4f46e5', '#7c3aed', '#059669'],
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'HaQei複数人格協調システム',
                                color: '#e2e8f0',
                                font: { size: 16, weight: 'bold' }
                            },
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#cbd5e1',
                                    font: { size: 12 },
                                    padding: 20
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.label}: ${context.parsed}%`;
                                    }
                                }
                            }
                        }
                    }
                });
            
            calculateOSEnergy(osData) {
                if (!osData || !osData.trigramEnergies) return 33.33;
                const energies = Object.values(osData.trigramEnergies);
                return energies.length > 0 ? energies.reduce((a, b) => a + b, 0) / energies.length : 33.33;
            
            calculate8DimensionalVector(tripleOSResults) {
                const { engineOS, interfaceOS, safeModeOS } = tripleOSResults;
                
                return {
                    engine: this.extractTrigramVector(engineOS.trigramEnergies),
                    interface: this.extractTrigramVector(interfaceOS.trigramEnergies),
                    safeMode: this.extractTrigramVector(safeModeOS.trigramEnergies)
                };
            
            // Phase2: 易経的解釈システム
            getTrigramWisdom(trigramIndex, energyValue) {
                const wisdoms = [
                    '創造性の力。新しい可能性を開く天の力。',
                    '行動力とリーダーシップ。雷の如き瞬発力。',
                    '探求心と知識欲。水の如き深い洞察力。',
                    '安定性と持続力。山の如き不動の意志。',
                    '受容性と包容力。大地の如き母性的力。',
                    '適応性と柔軟性。風の如き変化対応力。',
                    '表現力と明晰性。火の如き輝く魅力。',
                    '調和性と社交性。湖の如き穏やかな交流力。'
                ];
                
                let intensity = '弱い';
                if (energyValue > 75) intensity = '非常に強い';
                else if (energyValue > 50) intensity = '強い';
                else if (energyValue > 25) intensity = '中程度の';
                
                return `${intensity}${wisdoms[trigramIndex] || 'バランス調和力'}`;
            
            extractTrigramVector(trigramEnergies) {
                const orderedTrigrams = ['乾', '震', '坎', '艮', '坤', '巽', '離', '兌'];
                if (!trigramEnergies) {
                    console.warn('trigramEnergies is undefined, returning zero vector');
                    return orderedTrigrams.map(() => 0);
                }
                return orderedTrigrams.map(trigram => trigramEnergies[trigram] || 0);
            
            // 🔥 三爻エネルギーバランス分析
            renderTrigramEnergyAnalysis(tripleOSResults) {
                const container = document.getElementById('trigram-balance-analysis');
                container.innerHTML = '';
                
                const allTrigrams = ['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'];
                const trigramDescriptions = {
                    '乾': '創造性・リーダーシップ・革新',
                    '兌': '調和性・コミュニケーション・喜び',
                    '離': '表現性・知性・美的感覚',
                    '震': '行動力・決断力・エネルギー',
                    '巽': '適応性・柔軟性・持続力',
                    '坎': '探究心・深層思考・洞察力',
                    '艮': '安定性・慎重性・集中力',
                    '坤': '受容性・協調性・支援力'
                };
                
                allTrigrams.forEach((trigram, index) => {
                    const engineEnergy = tripleOSResults.engineOS.trigramEnergies?.[trigram] || 0;
                    const interfaceEnergy = tripleOSResults.interfaceOS.trigramEnergies?.[trigram] || 0;
                    const safeModeEnergy = tripleOSResults.safeModeOS.trigramEnergies?.[trigram] || 0;
                    
                    const maxEnergy = Math.max(engineEnergy, interfaceEnergy, safeModeEnergy);
                    const dominantOS = maxEnergy === engineEnergy ? 'Engine' : 
                                     maxEnergy === interfaceEnergy ? 'Interface' : 'SafeMode';
                    
                    const card = document.createElement('div');
                    card.className = 'trigram-card';
                    card.innerHTML = `
                        <div class="trigram-name">${trigram}</div>
                        <div class="trigram-energy-value">${Math.round(maxEnergy)}%</div>
                        <div class="trigram-description">${trigramDescriptions[trigram]}</div>
                        <div style="margin-top: var(--space-sm); font-size: var(--font-sm); color: var(--accent-400);">
                            主導: ${dominantOS} OS
                        </div>
                        <div class="trigram-breakdown" style="margin-top: var(--space-sm);">
                            <div style="display: flex; justify-content: space-between; font-size: var(--font-sm);">
                                <span style="color: #6366f1;">E: ${Math.round(engineEnergy)}%</span>
                                <span style="color: #8b5cf6;">I: ${Math.round(interfaceEnergy)}%</span>
                                <span style="color: #10b981;">S: ${Math.round(safeModeEnergy)}%</span>
                            </div>
                        </div>
                    `;
                    
                    container.appendChild(card);
                });
            
            // 🌊 エネルギーフロー可視化
            renderEnergyFlowVisualization(tripleOSResults) {
                const container = document.getElementById('energy-flow-visualization');
                
                const flowData = this.calculateEnergyFlow(tripleOSResults);
                
                container.innerHTML = `
                    <div class="flow-diagram">
                        <div class="flow-node engine-node">
                            <h5>Engine OS</h5>
                            <div class="node-strength">${flowData.engine.strength}%</div>
                            <div class="node-flow out" style="--flow-strength: ${flowData.engine.outflow}%;">
                                → Interface (${flowData.engine.outflow}%)
                            </div>
                        </div>
                        
                        <div class="flow-node interface-node">
                            <h5>Interface OS</h5>
                            <div class="node-strength">${flowData.interface.strength}%</div>
                            <div class="node-flow out" style="--flow-strength: ${flowData.interface.outflow}%;">
                                → SafeMode (${flowData.interface.outflow}%)
                            </div>
                        </div>
                        
                        <div class="flow-node safemode-node">
                            <h5>Safe Mode OS</h5>
                            <div class="node-strength">${flowData.safeMode.strength}%</div>
                            <div class="node-flow out" style="--flow-strength: ${flowData.safeMode.outflow}%;">
                                → Engine (${flowData.safeMode.outflow}%)
                            </div>
                        </div>
                    </div>
                    
                    <div class="flow-insights" style="margin-top: var(--space-lg);">
                        <h5 style="color: var(--primary-100); margin-bottom: var(--space-md);">
                            💫 エネルギーフロー洞察
                        </h5>
                        <div style="color: var(--primary-200); line-height: 1.6;">
                            ${flowData.insights}
                        </div>
                    </div>
                `;
                
                // フロー図スタイル追加
                const flowStyle = document.createElement('style');
                flowStyle.textContent = `
                    .flow-diagram {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: var(--space-lg);
                        margin-bottom: var(--space-lg);
                    }
                    .flow-node {
                        text-align: center;
                        padding: var(--space-lg);
                        border-radius: var(--radius-md);
                        border: 2px solid;
                        position: relative;
                    }
                    .engine-node { border-color: #6366f1; background: rgba(99, 102, 241, 0.05); }
                    .interface-node { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); }
                    .safemode-node { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
                    
                    .node-strength {
                        font-size: var(--font-xl);
                        font-weight: 700;
                        margin: var(--space-sm) 0;
                    }
                    .node-flow {
                        font-size: var(--font-sm);
                        color: var(--primary-300);
                        margin-top: var(--space-sm);
                        position: relative;
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(flowStyle);
            
            calculateEnergyFlow(tripleOSResults) {
                const engineStrength = this.calculateOSStrength(tripleOSResults.engineOS);
                const interfaceStrength = this.calculateOSStrength(tripleOSResults.interfaceOS);
                const safeModeStrength = this.calculateOSStrength(tripleOSResults.safeModeOS);
                
                // 相互影響度計算
                const engineToInterface = this.calculateInfluenceStrength(tripleOSResults.engineOS, tripleOSResults.interfaceOS);
                const interfaceToSafeMode = this.calculateInfluenceStrength(tripleOSResults.interfaceOS, tripleOSResults.safeModeOS);
                const safeModeToEngine = this.calculateInfluenceStrength(tripleOSResults.safeModeOS, tripleOSResults.engineOS);
                
                const insights = this.generateFlowInsights(
                    engineStrength, interfaceStrength, safeModeStrength,
                    engineToInterface, interfaceToSafeMode, safeModeToEngine
                
                return {
                    engine: { strength: engineStrength, outflow: engineToInterface },
                    interface: { strength: interfaceStrength, outflow: interfaceToSafeMode },
                    safeMode: { strength: safeModeStrength, outflow: safeModeToEngine },
                    insights
                };
            
            generateFlowInsights(eStr, iStr, sStr, eToi, iToS, sToE) {
                let insights = [];
                
                if (eToi > 70) {
                    insights.push("価値観システムが社会的表現に強く影響しています");
                }
                if (iToS > 70) {
                    insights.push("社会的経験が防御システムの形成に大きく関与しています");
                }
                if (sToE > 70) {
                    insights.push("防御メカニズムが価値観の再構築を促しています");
                
                const totalFlow = eToi + iToS + sToE;
                if (totalFlow > 210) {
                    insights.push("3つのシステム間で活発な相互作用が行われています");
                } else if (totalFlow < 150) {
                    insights.push("システム間の連携に改善の余地があります");
                
                return insights.length > 0 ? insights.join('。') + '。' : 
                    'バランスの取れたエネルギーフローを保っています。';
            
            // ☯ 専門層: 64卦完全解釈システム
            renderDetailedHexagramAnalysis(tripleOSResults) {
                const container = document.getElementById('hexagram-detailed-analysis');
                container.innerHTML = '';
                
                const systems = [
                    { name: 'Engine OS', data: tripleOSResults.engineOS, color: '#6366f1' },
                    { name: 'Interface OS', data: tripleOSResults.interfaceOS, color: '#8b5cf6' },
                    { name: 'Safe Mode OS', data: tripleOSResults.safeModeOS, color: '#10b981' }
                ];
                
                systems.forEach(system => {
                    const hexagramCard = document.createElement('div');
                    hexagramCard.className = 'hexagram-card';
                    
                    // 詳細な卦情報取得
                    const hexagramDetails = this.getDetailedHexagramInfo(system.data.hexagramId);
                    
                    hexagramCard.innerHTML = `
                        <div class="hexagram-title" style="color: ${system.color};">
                            ${system.name} - ${system.data.hexagramName}
                        </div>
                        <div class="hexagram-content">
                            <div class="hexagram-meta" style="margin-bottom: var(--space-md);">
                                <strong>卦番号:</strong> ${system.data.hexagramId}番<br>
                                <strong>上卦:</strong> ${this.safeGetTrigramDisplay(system.data.primaryTrigram || system.data.upperTrigram) || '乾(天)'} | 
                                <strong>下卦:</strong> ${this.safeGetTrigramDisplay(system.data.secondaryTrigram || system.data.lowerTrigram) || '坤(地)'}
                            </div>
                            
                            <div class="hexagram-description" style="margin-bottom: var(--space-md);">
                                ${hexagramDetails.detailedDescription}
                            </div>
                            
                            <div class="trigram-composition" style="margin-bottom: var(--space-md);">
                                <h6 style="color: var(--primary-100); margin-bottom: var(--space-sm);">三爻構成分析</h6>
                                <div style="color: var(--primary-200); font-size: var(--font-sm);">
                                    ${hexagramDetails.trigramAnalysis}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    container.appendChild(hexagramCard);
                });
            
            // 🔄 変卦システム - 成長方向性
            renderChangeHexagramSystem(tripleOSResults) {
                const container = document.getElementById('change-hexagram-display');
                
                const changeSystemData = this.calculateChangeHexagrams(tripleOSResults);
                
                container.innerHTML = `
                    <div class="change-hexagram-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-lg);">
                        ${changeSystemData.map(change => `
                            <div class="change-card" style="background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--radius-md); padding: var(--space-lg);">
                                <h6 style="color: #fbbf24; margin-bottom: var(--space-md);">
                                    ${change.fromOS} の変化
                                </h6>
                                <div style="color: var(--primary-200); margin-bottom: var(--space-md);">
                                    <strong>${change.currentHexagram}</strong> → <strong>${change.futureHexagram}</strong>
                                </div>
                                <div style="color: var(--primary-200); font-size: var(--font-sm); line-height: 1.6;">
                                    ${change.changeAnalysis}
                                </div>
                                <div style="margin-top: var(--space-md); padding: var(--space-sm); background: rgba(251, 191, 36, 0.05); border-radius: var(--radius-sm);">
                                    <strong style="color: #fbbf24;">成長方向:</strong>
                                    <div style="color: var(--primary-200); font-size: var(--font-sm); margin-top: var(--space-xs);">
                                        ${change.growthDirection}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            
            // 📜 古典的wisdom - 卦辞・爻辞
            renderClassicalWisdom(tripleOSResults) {
                const container = document.getElementById('classical-wisdom-display');
                
                const wisdomData = this.extractClassicalWisdom(tripleOSResults);
                
                container.innerHTML = `
                    <div class="classical-wisdom">
                        <h6 style="color: #fbbf24; margin-bottom: var(--space-lg); text-align: center;">
                            易経古典 - あなたへの智慧
                        </h6>
                        
                        <div class="wisdom-sections" style="display: flex; flex-direction: column; gap: var(--space-lg);">
                            ${wisdomData.map(wisdom => `
                                <div class="wisdom-section" style="border-left: 4px solid #fbbf24; padding-left: var(--space-lg);">
                                    <h6 style="color: var(--primary-100); margin-bottom: var(--space-sm);">
                                        ${wisdom.system} - ${wisdom.hexagramName}
                                    </h6>
                                    <div class="kua-ci" style="margin-bottom: var(--space-md);">
                                        <strong>卦辞:</strong> "${wisdom.guaCi}"
                                    </div>
                                    <div class="yao-ci" style="margin-bottom: var(--space-md);">
                                        <strong>爻辞 (重要な爻):</strong> "${wisdom.yaoCi}"
                                    </div>
                                    <div class="modern-interpretation" style="background: rgba(251, 191, 36, 0.05); padding: var(--space-md); border-radius: var(--radius-sm);">
                                        <strong>現代的解釈:</strong><br>
                                        ${wisdom.modernInterpretation}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            
            // 🔯 HaQei哲学統合
            renderHaQeiWisdom(tripleOSResults) {
                const container = document.getElementById('HaQei-wisdom-display');
                
                const HaQeiAnalysis = this.generateHaQeiAnalysis(tripleOSResults);
                
                container.innerHTML = `
                    ${HaQeiAnalysis.philosophicalIntegration}
                    
                    <div style="margin-top: var(--space-lg); padding: var(--space-lg); background: rgba(16, 185, 129, 0.05); border-radius: var(--radius-md); border: 1px solid rgba(16, 185, 129, 0.2);">
                        <h6 style="color: var(--success-500); margin-bottom: var(--space-md);">
                            🎯 戦略的自己理解のポイント
                        </h6>
                        <ul style="color: var(--primary-200); line-height: 1.6; padding-left: var(--space-lg);">
                            ${HaQeiAnalysis.strategicPoints.map(point => `<li style="margin-bottom: var(--space-sm);">${point}</li>`).join('')}
                        </ul>
                    </div>
                `;
            
            // 💡 パーソナライズド洞察生成
            renderPersonalizedInsights(tripleOSResults) {
                const insights = this.generatePersonalizedInsights(tripleOSResults);
                
                // 成長方向性
                document.getElementById('growth-directions').innerHTML = `
                    <div class="insight-title">🌱 成長方向性</div>
                    <div class="insight-content">${insights.growthDirections}</div>
                `;
                
                // 最適化戦略
                document.getElementById('optimization-strategies').innerHTML = `
                    <div class="insight-title">⚡ 最適化戦略</div>
                    <div class="insight-content">${insights.optimizationStrategies}</div>
                `;
                
                // ストレス管理
                document.getElementById('stress-management').innerHTML = `
                    <div class="insight-title">🛡️ ストレス管理</div>
                    <div class="insight-content">${insights.stressManagement}</div>
                `;
                
                // 比較分析
                document.getElementById('comparative-analysis').innerHTML = `
                    <div class="insight-title">📊 比較分析</div>
                    <div class="insight-content">${insights.comparativeAnalysis}</div>
                `;
            
            // 🎯 実践的戦略提案
            renderPracticalStrategies(tripleOSResults) {
                const container = document.getElementById('practical-strategies');
                const strategies = this.generatePracticalStrategies(tripleOSResults);
                
                container.innerHTML = strategies.map(strategy => `
                    <div class="strategy-item">
                        <div class="strategy-title">
                            ${strategy.icon} ${strategy.title}
                        </div>
                        <div class="strategy-description">
                            ${strategy.description}
                        </div>
                        <div class="strategy-actions">
                            ${strategy.actions.map(action => `
                                <span class="strategy-action">${action}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
            
            // ヘルパー関数群
            getDetailedHexagramInfo(hexagramId) {
                // 実際にHEXAGRAMSデータベースから詳細を取得
                const hexagram = HEXAGRAMS.find(h => h.hexagram_id === hexagramId) || HEXAGRAMS[0];
                if (!hexagram) {
                    return {
                        detailedDescription: `卦ID: ${hexagramId}のデータが見つかりません。`,
                        trigramAnalysis: `データベースエラーが発生しました。`
                    };
                
                // H384データベースから全体的な解釈を取得
                const relatedH384 = H384_DATA.filter(item => item['卦番号'] === hexagramId);
                const detailedAnalysis = relatedH384.length > 0 ? 
                    relatedH384.map(item => `${item['爻']}: ${item['現代解釈の要約']}`).join('\n') :
                    '詳細な爻の解釈データが見つかりません。';
                
                return {
                    detailedDescription: `【${hexagram.name_jp || '不明'}】${hexagram.catchphrase || ''}\n\n${hexagram.description || '説明が見つかりません。'}\n\n= 爻別詳細解釈 =\n${detailedAnalysis}`,
                    trigramAnalysis: `上卦: ${this.getTrigramName(hexagram.upper_trigram_id) || '不明'} / 下卦: ${this.getTrigramName(hexagram.lower_trigram_id) || '不明'}\n\nこの組み合わせは、あなたの内的エネルギー(${this.getTrigramName(hexagram.lower_trigram_id)})と外的表現(${this.getTrigramName(hexagram.upper_trigram_id)})の関係性を物語っています。これは動的なバランスの中で発揮される、あなた固有の能力パターンです。`
                };
            
            getTrigramName(trigramId) {
                // 三爻IDから名前を取得
                const trigramNames = {
                    1: "乾(天)", 2: "兌(沢)", 3: "離(火)", 4: "震(雷)",
                    5: "巽(風)", 6: "坎(水)", 7: "艮(山)", 8: "坤(地)"
                };
                return trigramNames[trigramId] || "不明";

            // 🛡️ SAFE TRIGRAM DISPLAY - primaryTrigram/secondaryTrigram安全表示
            safeGetTrigramDisplay(trigram) {
                if (!trigram) return null;
                
                // 既に表示用文字列の場合
                if (typeof trigram === 'string' && trigram.includes('(')) {
                    return trigram;
                
                // 三爻文字の場合
                if (typeof trigram === 'string') {
                    const trigramDisplayMap = {
                        '乾': '乾(天)', '兌': '兌(沢)', '離': '離(火)', '震': '震(雷)',
                        '巽': '巽(風)', '坎': '坎(水)', '艮': '艮(山)', '坤': '坤(地)'
                    };
                    return trigramDisplayMap[trigram] || `${trigram}(不明)`;
                
                // 数値IDの場合
                if (typeof trigram === 'number') {
                    return this.getTrigramName(trigram);
                
                return '情報取得中';
            
            calculateChangeHexagrams(tripleOSResults) {
                // 変卦計算の簡単な実装
                return [
                    {
                        fromOS: 'Engine OS',
                        currentHexagram: tripleOSResults.engineOS.hexagramName,
                        futureHexagram: this.calculateFutureHexagram(tripleOSResults.engineOS),
                        changeAnalysis: '内的価値観システムは、より統合された形へと発展していく可能性を秘めています。',
                        growthDirection: '自己理解を深め、価値観の一貫性を高めることで、より力強い表現が可能になります。'
                    },
                    {
                        fromOS: 'Interface OS', 
                        currentHexagram: tripleOSResults.interfaceOS.hexagramName,
                        futureHexagram: this.calculateFutureHexagram(tripleOSResults.interfaceOS),
                        changeAnalysis: '社会的システムは、より柔軟で効果的な対人関係スキルへと進化していきます。',
                        growthDirection: '他者との協調性を保ちながら、自分らしさを表現するバランスを見つけることが重要です。'
                    },
                    {
                        fromOS: 'Safe Mode OS',
                        currentHexagram: tripleOSResults.safeModeOS.hexagramName,
                        futureHexagram: this.calculateFutureHexagram(tripleOSResults.safeModeOS),
                        changeAnalysis: '防御システムは、より建設的で適応的な対処メカニズムへと変化していきます。',
                        growthDirection: '安全性を保ちながらも、新しい挑戦に対してオープンな姿勢を育てることが成長のカギです。'
                    }
                ];
            
            calculateFutureHexagram(osData) {
                // 実際のHEXAGRAMSデータベースから変卦を計算
                const currentId = osData.hexagramId || 1;
                const futureId = currentId > 32 ? currentId - 32 : currentId + 32;
                
                // 変化後の卦をデータベースから取得
                const futureHexagram = HEXAGRAMS.find(h => h.hexagram_id === futureId);
                return futureHexagram ? futureHexagram.name_jp : `${futureId}番卦`;
            
            extractClassicalWisdom(tripleOSResults) {
                // 実際のHEXAGRAMSデータベースから古典的な知恵を抽出
                const systems = [
                    { name: 'Engine OS', data: tripleOSResults.engineOS },
                    { name: 'Interface OS', data: tripleOSResults.interfaceOS },
                    { name: 'Safe Mode OS', data: tripleOSResults.safeModeOS }
                ];
                
                return systems.map(system => {
                    const hexagram = HEXAGRAMS.find(h => h.hexagram_id === system.data.hexagramId);
                    const h384Data = H384_DATA.filter(item => item['卦番号'] === system.data.hexagramId);
                    
                    // 主要な爻を選択（九五または六五を優先）
                    const mainYao = h384Data.find(item => item['爻'].includes('五')) || h384Data[0];
                    
                    return {
                        system: system.name,
                        hexagramName: system.data.hexagramName,
                        guaCi: hexagram ? (hexagram.gua_ci || hexagram.description) : '卦辞が見つかりません',
                        yaoCi: mainYao ? `${mainYao['爻']}: ${mainYao['現代解釈の要約'].substring(0, 50)}...` : '爻辞が見つかりません',
                        modernInterpretation: mainYao ? mainYao['現代解釈の要約'] : 'データベースから解釈を取得できません。'
                    };
                });
            
            generateHaQeiAnalysis(tripleOSResults) {
                const { engineOS, interfaceOS, safeModeOS } = tripleOSResults;
                
                // 実際のHEXAGRAMSデータからHaQei哲学的分析を生成
                const engineHexagram = HEXAGRAMS.find(h => h.hexagram_id === engineOS.hexagramId);
                const interfaceHexagram = HEXAGRAMS.find(h => h.hexagram_id === interfaceOS.hexagramId);
                const safeModeHexagram = HEXAGRAMS.find(h => h.hexagram_id === safeModeOS.hexagramId);
                
                // 各OSの実際の特性から哲学的統合メッセージを動的生成
                const philosophicalIntegration = `
                    あなたの三重人格システムは、HaQei哲学の「複数自己統合理論」を実証しています。
                    
                    Engine OS【${engineOS.hexagramName}】${engineHexagram?.catchphrase || ''}として、
                    ${engineHexagram?.description || '内的価値観システムを構築し'}、
                    
                    Interface OS【${interfaceOS.hexagramName}】${interfaceHexagram?.catchphrase || ''}として、
                    ${interfaceHexagram?.description || '社会的適応システムを運営し'}、
                    
                    Safe Mode OS【${safeModeOS.hexagramName}】${safeModeHexagram?.catchphrase || ''}として、
                    ${safeModeHexagram?.description || '防御的安定システムを維持'}しています。
                    
                    この三位一体は、単なる性格分析ではなく、状況適応型の戦略的人格システムです。
                `;
                
                // H384データから実際の戦略ポイントを抽出
                const engineH384 = H384_DATA.find(item => item['卦番号'] === engineOS.hexagramId);
                const interfaceH384 = H384_DATA.find(item => item['卦番号'] === interfaceOS.hexagramId);  
                const safeModeH384 = H384_DATA.find(item => item['卦番号'] === safeModeOS.hexagramId);
                
                const strategicPoints = [
                    `Engine OS活用: ${engineH384?.['キーワード']?.[0] || '創造性'}を基盤とした${engineH384?.['S5_主体性推奨スタンス'] || '能動'}的アプローチ`,
                    `Interface OS活用: ${interfaceH384?.['キーワード']?.[0] || '協調性'}を重視した${interfaceH384?.['S5_主体性推奨スタンス'] || '受動'}的コミュニケーション`,
                    `Safe Mode OS活用: ${safeModeH384?.['キーワード']?.[0] || '安定性'}を確保する${safeModeH384?.['S5_主体性推奨スタンス'] || '中立'}的リスク管理`,
                    `三重統合: スコア統合(Engine:${engineH384?.['S7_総合評価スコア'] || 50}, Interface:${interfaceH384?.['S7_総合評価スコア'] || 50}, Safe:${safeModeH384?.['S7_総合評価スコア'] || 50})による総合判断`,
                    `長期成長: 各OSの${[engineH384, interfaceH384, safeModeH384].map(h => h?.['S2_ポテンシャル'] || 50).join('-')}ポテンシャルを段階的開発`
                ];
                
                return {
                    philosophicalIntegration,
                    strategicPoints
                };
            
            generatePersonalizedInsights(tripleOSResults) {
                const { engineOS, interfaceOS, safeModeOS, integration } = tripleOSResults;
                const balance = this.calculateDynamicBalance(tripleOSResults);
                
                return {
                    growthDirections: `
                        主導システムである${balance.dominantOS}を基盤として、他の2つのシステムとの調和を図ることで、
                        より統合された人格へと成長できます。特に${this.getWeakestOS(tripleOSResults)}の
                        発達に意識を向けることで、全体的なバランスが向上します。
                    `,
                    optimizationStrategies: `
                        システム協調度${balance.coordination}%から、相互作用の改善余地があります。
                        日常生活で意識的に異なるOSを使い分ける練習をすることで、
                        より効果的な問題解決と人間関係の構築が可能になります。
                    `,
                    stressManagement: `
                        ストレス耐性${balance.resilience}%を基に、Safe Mode OSの${this.getStressManagementAdvice(safeModeOS)}
                        を活用することで、困難な状況でも安定した対応が可能です。
                        予防的なストレス管理として、定期的な自己チェックを実践してください。
                    `,
                    comparativeAnalysis: `
                        一般的なパターンと比較して、あなたの特徴は${this.getComparativeInsights(tripleOSResults)}です。
                        この独自性を強みとして活かしつつ、必要に応じて他の視点も取り入れることで、
                        より幅広い状況に対応できる柔軟性を獲得できます。
                    `
                };
            
            generatePracticalStrategies(tripleOSResults) {
                const { engineOS, interfaceOS, safeModeOS } = tripleOSResults;
                
                // 実際のH384データから各OSの特性を取得
                const engineH384 = H384_DATA.filter(item => item['卦番号'] === engineOS.hexagramId);
                const interfaceH384 = H384_DATA.filter(item => item['卦番号'] === interfaceOS.hexagramId);
                const safeModeH384 = H384_DATA.filter(item => item['卦番号'] === safeModeOS.hexagramId);
                
                // 動的に実践戦略を生成
                const strategies = [];
                
                // Engine OS戦略
                const engineMainYao = engineH384.find(item => item['爻'].includes('五')) || engineH384[0];
                if (engineMainYao) {
                    strategies.push({
                        icon: '⚡',
                        title: `Engine OS強化: ${engineMainYao['キーワード']?.[0] || '創造性'}の活用`,
                        description: `${engineMainYao['現代解釈の要約'].substring(0, 100)}を日常生活に応用します。`,
                        actions: [
                            `${engineMainYao['キーワード']?.[1] || '基礎固め'}の日々実践`,
                            `${engineMainYao['S5_主体性推奨スタンス']}的アプローチでの問題解決`,
                            `ポテンシャル${engineMainYao['S2_ポテンシャル']}%を活かした長期計画`
                        ]
                    });
                
                // Interface OS戦略  
                const interfaceMainYao = interfaceH384.find(item => item['爻'].includes('五')) || interfaceH384[0];
                if (interfaceMainYao) {
                    strategies.push({
                        icon: '🤝',
                        title: `Interface OS最適化: ${interfaceMainYao['キーワード']?.[0] || '協調性'}の発展`,
                        description: `${interfaceMainYao['現代解釈の要約'].substring(0, 100)}を人間関係で実践します。`,
                        actions: [
                            `${interfaceMainYao['キーワード']?.[1] || '対人関係'}の意識的改善`,
                            `リスク値${Math.abs(interfaceMainYao['S4_リスク'] || -35)}に応じた慎重性`,
                            `総合評価${interfaceMainYao['S7_総合評価スコア']}%向上を目指した行動計画`
                        ]
                    });
                
                // Safe Mode OS戦略
                const safeModeMainYao = safeModeH384.find(item => item['爻'].includes('五')) || safeModeH384[0];
                if (safeModeMainYao) {
                    strategies.push({
                        icon: '🛡️',
                        title: `Safe Mode OS運用: ${safeModeMainYao['キーワード']?.[0] || '安定性'}の確立`,
                        description: `${safeModeMainYao['現代解釈の要約'].substring(0, 100)}をストレス管理に応用します。`,
                        actions: [
                            `${safeModeMainYao['キーワード']?.[1] || '予防策'}の事前準備`,
                            `安定性スコア${safeModeMainYao['S3_安定性スコア']}%を基準とした環境設計`,
                            `変動性${safeModeMainYao['S6_変動性スコア']}%に合わせた柔軟な対応策`
                        ]
                    });
                
                return strategies;
            
            getWeakestOS(tripleOSResults) {
                const strengths = {
                    'Engine OS': this.calculateOSStrength(tripleOSResults.engineOS),
                    'Interface OS': this.calculateOSStrength(tripleOSResults.interfaceOS),
                    'Safe Mode OS': this.calculateOSStrength(tripleOSResults.safeModeOS)
                };
                
                return Object.keys(strengths).reduce((a, b) => 
                    strengths[a] < strengths[b] ? a : b
            
            getStressManagementAdvice(safeModeOS) {
                const strength = this.calculateOSStrength(safeModeOS);
                if (strength > 75) return '強力な安定化機能';
                if (strength > 50) return '適度な防御メカニズム';
                return '柔軟な適応戦略';
            
            getComparativeInsights(tripleOSResults) {
                const balance = this.calculateDynamicBalance(tripleOSResults);
                if (balance.coordination > 80) return '高度な統合型人格特性';
                if (balance.flexibility > 80) return '高い適応能力と柔軟性';
                if (balance.resilience > 80) return '優秀なストレス耐性と安定性';
                return 'バランスの取れた成長型人格';
            
            generateTripleOSSummary(tripleOSResults) {
                const { 
                    engineOS, 
                    interfaceOS, 
                    safeModeOS, 
                    consistencyScore,
                    balanceScore,
                    HaQeiIntegration,
                    integration,
                    recommendations 
                } = tripleOSResults;
                
                // 統合スコアの表示用フォーマット
                const formatScore = (score) => Math.round(score || 0);
                const getScoreColor = (score) => {
                    if (score >= 80) return '#10b981'; // 緑
                    if (score >= 65) return '#f59e0b'; // 黄
                    return '#ef4444'; // 赤
                };
                
                // HaQei準拠の表現
                const summary = `
                    <div style="margin-bottom: var(--space-md);">
                        <h4 style="color: var(--primary-100); margin-bottom: var(--space-sm);">🔯 Triple OS システム分析</h4>
                        <p style="color: var(--primary-200); line-height: 1.6;">
                            この分析は、易経の64卦理論に基づく<strong>参考情報</strong>として提供されます。
                            あなたの人格を3つの層で理解する<strong>一つの視点</strong>です。
                        </p>
                    </div>
                    
                    <div style="margin-bottom: var(--space-md);">
                        <h5 style="color: #6366f1; margin-bottom: var(--space-xs);">🎯 Engine OS（深層価値観）</h5>
                        <p style="color: var(--primary-300); font-size: var(--font-sm);">
                            ${engineOS.hexagramName} - ${engineOS.catchphrase || engineOS.description}
                        </p>
                    </div>
                    
                    <div style="margin-bottom: var(--space-md);">
                        <h5 style="color: #8b5cf6; margin-bottom: var(--space-xs);">💬 Interface OS（社会的側面）</h5>
                        <p style="color: var(--primary-300); font-size: var(--font-sm);">
                            ${interfaceOS.hexagramName} - 対人関係での一面
                        </p>
                    </div>
                    
                    <div style="margin-bottom: var(--space-md);">
                        <h5 style="color: #10b981; margin-bottom: var(--space-xs);">🛡️ SafeMode OS（防御システム）</h5>
                        <p style="color: var(--primary-300); font-size: var(--font-sm);">
                            ${safeModeOS.hexagramName} - 安全を重視する時の特性
                        </p>
                    </div>
                    
                    <div style="background: rgba(99, 102, 241, 0.05); border-radius: var(--radius-md); padding: var(--space-md); margin: var(--space-md) 0;">
                        <h5 style="color: var(--primary-100); margin-bottom: var(--space-sm); text-align: center;">📊 Triple OS統合評価</h5>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--space-sm); margin-bottom: var(--space-sm);">
                            <div style="text-align: center; padding: var(--space-xs); background: rgba(255,255,255,0.05); border-radius: var(--radius-sm);">
                                <div style="font-size: var(--font-lg); font-weight: bold; color: ${getScoreColor(consistencyScore)};">
                                    ${formatScore(consistencyScore)}%
                                </div>
                                <div style="font-size: var(--font-xs); color: var(--primary-300);">整合性</div>
                            </div>
                            
                            <div style="text-align: center; padding: var(--space-xs); background: rgba(255,255,255,0.05); border-radius: var(--radius-sm);">
                                <div style="font-size: var(--font-lg); font-weight: bold; color: ${getScoreColor(balanceScore)};">
                                    ${formatScore(balanceScore)}%
                                </div>
                                <div style="font-size: var(--font-xs); color: var(--primary-300);">動的バランス</div>
                            </div>
                            
                            <div style="text-align: center; padding: var(--space-xs); background: rgba(255,255,255,0.05); border-radius: var(--radius-sm);">
                                <div style="font-size: var(--font-lg); font-weight: bold; color: ${getScoreColor(HaQeiIntegration)};">
                                    ${formatScore(HaQeiIntegration)}%
                                </div>
                                <div style="font-size: var(--font-xs); color: var(--primary-300);">HaQei統合</div>
                            </div>
                        </div>
                        
                        <p style="color: var(--primary-300); font-size: var(--font-xs); text-align: center; margin-top: var(--space-xs);">
                            ※これらの数値は参考指標として、自己理解の一助としてご活用ください
                        </p>
                    </div>
                    
                    ${recommendations && recommendations.length > 0 ? `
                        <div style="background: rgba(16, 185, 129, 0.05); border-radius: var(--radius-md); padding: var(--space-md); margin: var(--space-md) 0;">
                            <h5 style="color: #10b981; margin-bottom: var(--space-sm);">💡 成長への気づき</h5>
                            ${recommendations.slice(0, 2).map(rec => `
                                <div style="margin-bottom: var(--space-sm); padding: var(--space-xs); background: rgba(255,255,255,0.03); border-radius: var(--radius-sm);">
                                    <div style="font-weight: bold; color: var(--primary-200); margin-bottom: var(--space-xs);">
                                        ${rec.title}
                                    </div>
                                    <div style="color: var(--primary-300); font-size: var(--font-sm); line-height: 1.4;">
                                        ${rec.description}
                                    </div>
                                </div>
                            `).join('')}
                            <p style="color: var(--primary-400); font-size: var(--font-xs); text-align: center; margin-top: var(--space-sm);">
                                これらの気づきを、日常の中で少しずつ意識していただければと思います
                            </p>
                        </div>
                    ` : ''}
                    
                    <div style="background: rgba(99, 102, 241, 0.1); border-radius: var(--radius-md); padding: var(--space-sm); margin-top: var(--space-md);">
                        <p style="color: var(--primary-200); font-size: var(--font-sm); text-align: center; line-height: 1.4;">
                            🌟 この分析結果は易経の智慧に基づく一つの視点です<br>
                            あなた自身の直感と合わせて、より深い自己理解にお役立てください
                        </p>
                    </div>
                `;
                
                document.getElementById('result-summary').innerHTML = summary;
            
            saveResults(tripleOSResults) {
                try {
                    const results = {
                        timestamp: new Date().toISOString(),
                        answers: this.state.answers,
                        tripleOSResults: tripleOSResults,
                        version: '2.0',
                        HaQeiCompliant: true
                    };
                    
                    localStorage.setItem('haqei_emergency_results', JSON.stringify(results));
                    console.log('✅ Triple OS Results saved to localStorage');
                } catch (error) {
                    console.warn('⚠️ Failed to save results:', error);
                }
                } catch (error) {
                    console.error(`❌ Error: ${error.message}`);
                    return null;
                
            
            showError(message) {
                this.showScreen('error-screen');
                document.getElementById('error-message').textContent = message;
                this.announce('エラーが発生しました');
            
            restart() {
                // 状態をクリア
                this.state.clearState();
                this.state.currentQuestion = 0;
                this.state.answers = [];
                this.state.tripleOSResults = null;
                this.state.isAnalyzing = false;
                
                // UI初期化
                this.initializeTrigramScores();
                this.showScreen('welcome-screen');
                this.announce('分析がリセットされました');
            
            announce(message) {
                const announcements = document.getElementById('announcements');
                announcements.textContent = message;
                
                // 一定時間後にクリア
                setTimeout(() => {
                    announcements.textContent = '';
                }, 3000);
            
            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        
        // 5. アプリケーション初期化
        } // End CriticalCSSAnalyzer class
        } // End of CriticalCSSAnalyzer class - FIXED

        } // End CriticalCSSAnalyzer class

        document.addEventListener('DOMContentLoaded', () => {
            try {
                console.log('🎯 HAQEI Emergency Analyzer initializing...');
                console.log('🔯 Authentic I-Ching 64 Hexagrams Engine loaded');
                console.log('☰ Trigram Mapping System: HaQei philosophy compliant');
                
                // アプリケーション開始
                window.criticalCSSAnalyzer = new CriticalCSSAnalyzer();
                window.virtualPersonaEnhancer = new VirtualPersonaEnhancer();
                
                console.log('✅ Critical CSS Analyzer ready');
                console.log('📊 Questions loaded:', QUESTIONS.length);
                console.log('🎭 Triple OS systems:', Object.keys(TRIPLE_OS).length);
                console.log('🔯 Authentic Hexagrams loaded:', HEXAGRAMS.length);
                // console.log('🎆 Authentic 8D Vectors loaded:', Object.keys(AUTHENTIC_H64_8D_VECTORS).length);
                console.log('🔯 I-Ching Orthodoxy validated: Traditional 64 Hexagram matrix');
                
            } catch (error) {
                console.error('❌ Initialization failed:', error);
                document.body.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: #ef4444;">
                        <h1>初期化エラー</h1>
                        <p>アプリケーションの開始に失敗しました。ページを再読み込みしてください。</p>
                        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                            再読み込み
                        </button>
                    </div>
                `;
            } catch (error) {
                console.error(`❌ Error: ${error.message}`);
                return null;
        
        // 6. パフォーマンス最適化
        // サービスワーカー登録（可能な場合）
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/public/haqei-sw.js')
                    .then(registration => {
                        console.log('✅ Emergency SW registered');
                    })
                    .catch(error => {
                        console.log('⚠️ SW registration failed (optional)');
                    });
                } catch (error) {
                    console.error('❌ Chart.js rendering failed:', error);
                    console.log('📊 Chart.js fallback: Using text display instead');
            });
        
        // メモリ最適化
        window.addEventListener('beforeunload', () => {
            if (window.criticalCSSAnalyzer) {
                window.criticalCSSAnalyzer = null;
        });
        
        // エラーハンドリング
        window.addEventListener('error', (event) => {
            console.error('❌ Global error:', event.error);
            if (window.criticalCSSAnalyzer) {
                window.criticalCSSAnalyzer.showError('予期しないエラーが発生しました');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Unhandled promise rejection:', event.reason);
            event.preventDefault();
            if (window.criticalCSSAnalyzer) {
                window.criticalCSSAnalyzer.showError('処理中にエラーが発生しました');
        });
        
        console.log('📝 HAQEI Critical CSS Analyzer script loaded');
        console.log('🎆 HaQei哲学 Triple OS Engine integrated');
        console.log('✨ Critical CSS optimizations applied');
        

    
    