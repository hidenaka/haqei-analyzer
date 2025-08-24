import { readFile, writeFile } from 'fs/promises';

async function fixRemainingPart2() {
  try {
    console.log('=== 残りの部分を一行一行丁寧に修正（パート2） ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // remaining-short-descriptions.jsonの続きから修正
    const fixes = [
      // 風水渙 (7-9文字)
      { old: '"氷を溶かす春風"', new: '"氷を溶かす春風のように"', hexagram: '風水渙' },
      { old: '"固定観念を溶かす"', new: '"固定観念を溶かしていく"', hexagram: '風水渙' },
      { old: '"全てを流動化させる"', new: '"全てを流動化させていく"', hexagram: '風水渙' },
      { old: '"組織の硬直を打破"', new: '"組織の硬直を打破する"', hexagram: '風水渙' },
      { old: '"リラックス、脱力"', new: '"リラックスと脱力を行う"', hexagram: '風水渙' },
      { old: '"固まらないように"', new: '"固まらないように注意する"', hexagram: '風水渙' },
      { old: '"流動性と柔軟性"', new: '"流動性と柔軟性を保つ"', hexagram: '風水渙' },
      { old: '"適度な集中も必要"', new: '"適度な集中も必要となる"', hexagram: '風水渙' },
      { old: '"締める、まとめる"', new: '"締めることやまとめることが苦手"', hexagram: '風水渙' },
      { old: '"柔軟性が必要な環境"', new: '"柔軟性が必要な環境で活動"', hexagram: '風水渙' },
      { old: '"注意を分散させる"', new: '"注意を分散させてしまう"', hexagram: '風水渙' },
      { old: '"問題が解決しない"', new: '"問題が解決しないことがある"', hexagram: '風水渙' },
      { old: '"存在感を消して休む"', new: '"存在感を消して休息する"', hexagram: '風水渙' },
      { old: '"落ち着いた環境"', new: '"落ち着いた環境で過ごす"', hexagram: '風水渙' },
      { old: '"まとめてくれる人"', new: '"まとめてくれる人と協力"', hexagram: '風水渙' },
      { old: '"適度な流動性を保つ"', new: '"適度な流動性を保って活動"', hexagram: '風水渙' },
      { old: '"散漫、または硬直"', new: '"散漫または硬直しやすい"', hexagram: '風水渙' },
      
      // 水澤節 (8-9文字)
      { old: '"常に適量を心がける"', new: '"常に適量を心がけて行動"', hexagram: '水澤節' },
      { old: '"絶妙な調整力を発揮"', new: '"絶妙な調整力を発揮する"', hexagram: '水澤節' },
      { old: '"資源を最適配分"', new: '"資源を最適配分する"', hexagram: '水澤節' },
      { old: '"『ほどほどが一番』"', new: '"『ほどほどが一番』と伝える"', hexagram: '水澤節' },
      { old: '"極端な主張、冒険"', new: '"極端な主張や冒険が苦手"', hexagram: '水澤節' },
      { old: '"節度を保つ人々"', new: '"節度を保つ人々と活動"', hexagram: '水澤節' },
      { old: '"活動を制限する"', new: '"活動を制限してしまう"', hexagram: '水澤節' },
      { old: '"燃え尽きを防ぐ"', new: '"燃え尽きを防ぐことができる"', hexagram: '水澤節' },
      { old: '"消極的になりがち"', new: '"消極的になりがちな傾向"', hexagram: '水澤節' },
      { old: '"必要最小限だけ動く"', new: '"必要最小限だけ動いて守る"', hexagram: '水澤節' },
      { old: '"ペースを理解する人"', new: '"ペースを理解してくれる人"', hexagram: '水澤節' },
      { old: '"窮屈、または無節制"', new: '"窮屈または無節制になりやすい"', hexagram: '水澤節' },
      
      // 風澤中孚 (8-9文字)
      { old: '"誠実に人と向き合う"', new: '"誠実に人と向き合っていく"', hexagram: '風澤中孚' },
      { old: '"約束は必ず守る"', new: '"約束は必ず守って信頼を築く"', hexagram: '風澤中孚' },
      { old: '"信頼が試される時"', new: '"信頼が試される時に力を発揮"', hexagram: '風澤中孚' },
      { old: '"絶対的な信頼を示す"', new: '"絶対的な信頼を示していく"', hexagram: '風澤中孚' },
      { old: '"大切な人との時間"', new: '"大切な人との時間を過ごす"', hexagram: '風澤中孚' },
      { old: '"大切な絆を確認する"', new: '"大切な絆を確認していく"', hexagram: '風澤中孚' },
      { old: '"深く信頼できる相手"', new: '"深く信頼できる相手と共に"', hexagram: '風澤中孚' },
      { old: '"正直で誠実な話し方"', new: '"正直で誠実な話し方をする"', hexagram: '風澤中孚' },
      { old: '"駆け引きや嘘が苦手"', new: '"駆け引きや嘘が苦手な性格"', hexagram: '風澤中孚' },
      { old: '"信頼が重要な環境"', new: '"信頼が重要な環境で活動"', hexagram: '風澤中孚' },
      { old: '"絶対的な信頼感"', new: '"絶対的な信頼感を与える"', hexagram: '風澤中孚' },
      { old: '"信頼できる人に相談"', new: '"信頼できる人に相談する"', hexagram: '風澤中孚' },
      { old: '"信頼の輪に守られる"', new: '"信頼の輪に守られて安心"', hexagram: '風澤中孚' },
      { old: '"仲間に全てを託す"', new: '"仲間に全てを託して進む"', hexagram: '風澤中孚' },
      { old: '"信頼関係の中で回復"', new: '"信頼関係の中で回復する"', hexagram: '風澤中孚' },
      { old: '"心を開いて話す"', new: '"心を開いて話していく"', hexagram: '風澤中孚' },
      { old: '"深い人間関係を築く"', new: '"深い人間関係を築いていく"', hexagram: '風澤中孚' },
      
      // 雷山小過 (8-9文字)
      { old: '"細部まで確認する"', new: '"細部まで確認していく"', hexagram: '雷山小過' },
      { old: '"完璧な精度で検証"', new: '"完璧な精度で検証する"', hexagram: '雷山小過' },
      { old: '"確認事項の見直し"', new: '"確認事項の見直しを行う"', hexagram: '雷山小過' },
      { old: '"万全の準備を整える"', new: '"万全の準備を整えていく"', hexagram: '雷山小過' },
      { old: '"確認すべき対象"', new: '"確認すべき対象を明確に"', hexagram: '雷山小過' },
      { old: '"ミスを防いだ実感"', new: '"ミスを防いだ実感を得る"', hexagram: '雷山小過' },
      { old: '"確認を重ねる話し方"', new: '"確認を重ねる話し方をする"', hexagram: '雷山小過' },
      { old: '"ミス防止、品質管理"', new: '"ミス防止と品質管理を行う"', hexagram: '雷山小過' },
      { old: '"スピード、大胆さ"', new: '"スピードや大胆さが不足"', hexagram: '雷山小過' },
      { old: '"心配性に見える"', new: '"心配性に見えることがある"', hexagram: '雷山小過' },
      { old: '"確認を繰り返す"', new: '"確認を繰り返してしまう"', hexagram: '雷山小過' },
      { old: '"何度確認しても不安"', new: '"何度確認しても不安が残る"', hexagram: '雷山小過' },
      { old: '"確信を得て安心"', new: '"確信を得て安心する"', hexagram: '雷山小過' },
      { old: '"十分な確認で安心"', new: '"十分な確認で安心を得る"', hexagram: '雷山小過' },
      { old: '"チェックリスト完了"', new: '"チェックリスト完了で安心"', hexagram: '雷山小過' },
      { old: '"確認できる環境"', new: '"確認できる環境で活動"', hexagram: '雷山小過' },
      
      // 水火既済 (8-9文字)
      { old: '"中途半端を許さない"', new: '"中途半端を許さない姿勢"', hexagram: '水火既済' },
      { old: '"次の目標を探す"', new: '"次の目標を探していく"', hexagram: '水火既済' },
      { old: '"完成させるべき対象"', new: '"完成させるべき対象を見つける"', hexagram: '水火既済' },
      { old: '"完成、締結、仕上げ"', new: '"完成と締結と仕上げを行う"', hexagram: '水火既済' },
      { old: '"物事を完成させる力"', new: '"物事を完成させる力を発揮"', hexagram: '水火既済' },
      { old: '"融通が利かない"', new: '"融通が利かないことがある"', hexagram: '水火既済' },
      { old: '"過程も大切にしよう"', new: '"過程も大切にしていこう"', hexagram: '水火既済' },
      { old: '"柔軟性を失いやすい"', new: '"柔軟性を失いやすい傾向"', hexagram: '水火既済' },
      { old: '"完成と共に解放"', new: '"完成と共に解放される"', hexagram: '水火既済' },
      { old: '"プロジェクト完了"', new: '"プロジェクト完了で達成感"', hexagram: '水火既済' },
      { old: '"完成を助ける人"', new: '"完成を助けてくれる人"', hexagram: '水火既済' },
      
      // 火水未済 (8-9文字)
      { old: '"休んでも探求は続く"', new: '"休んでも探求は続いていく"', hexagram: '火水未済' },
      { old: '"新しい挑戦と可能性"', new: '"新しい挑戦と可能性を求める"', hexagram: '火水未済' },
      { old: '"未知のものとの遭遇"', new: '"未知のものとの遭遇を楽しむ"', hexagram: '火水未済' },
      { old: '"過程を楽しもう"', new: '"過程を楽しんでいこう"', hexagram: '火水未済' },
      { old: '"可能性を語る話し方"', new: '"可能性を語る話し方をする"', hexagram: '火水未済' },
      { old: '"完結、確定、固定"', new: '"完結や確定や固定が苦手"', hexagram: '火水未済' },
      { old: '"革新を歓迎する環境"', new: '"革新を歓迎する環境で活動"', hexagram: '火水未済' },
      { old: '"挑戦を恐れない人々"', new: '"挑戦を恐れない人々と協働"', hexagram: '火水未済' },
      { old: '"完成を避けて逃げる"', new: '"完成を避けて逃げてしまう"', hexagram: '火水未済' },
      { old: '"新しいスタート"', new: '"新しいスタートを切る"', hexagram: '火水未済' },
      { old: '"次のプロジェクトへ"', new: '"次のプロジェクトへ進む"', hexagram: '火水未済' },
      { old: '"可能性を信じる人"', new: '"可能性を信じてくれる人"', hexagram: '火水未済' },
      { old: '"永続的な成長と進化"', new: '"永続的な成長と進化を続ける"', hexagram: '火水未済' }
    ];
    
    // 修正を一行ずつ適用
    let totalFixCount = 0;
    console.log('修正を一行ずつ適用中...\n');
    
    for (const fix of fixes) {
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        console.log(`✅ [${fix.hexagram}] ${fix.old} → ${fix.new} (${matches.length}箇所)`);
      }
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`\n=== 修正完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`\n最終検証: node comprehensive-v3-review.mjs`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixRemainingPart2();