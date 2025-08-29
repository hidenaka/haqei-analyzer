import { readFile, writeFile } from 'fs/promises';

async function fixPhase17SevenFinal() {
  try {
    console.log('=== フェーズ17: 最終7文字49件を一行一行修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 7文字の説明を一行一行丁寧に修正（49件）
    const sevenCharFixes = {
      // 逆境・変革系
      '"逆境を糧にする"': '"逆境を糧にして成長する"',
      '"熱く変革を語る"': '"熱く変革を語って人を動かす"',
      '"過激に見られる"': '"過激に見られることがある"',
      
      // 能力・特性系
      '"水のような柔軟性"': '"水のような柔軟性を持つ"',
      '"地のような安定感"': '"地のような安定感がある"',
      '"火のような情熱性"': '"火のような情熱性を持つ"',
      '"風のような自由度"': '"風のような自由度がある"',
      
      // 状態・環境系
      '"守りに入る状態"': '"守りに入る防御的な状態"',
      '"攻めに転じる時"': '"攻めに転じる積極的な時"',
      '"静かに待つ環境"': '"静かに待つ穏やかな環境"',
      '"動き出す準備期"': '"動き出すための準備期間"',
      
      // 対人関係系
      '"人との距離感覚"': '"人との適切な距離感覚"',
      '"信頼を築く過程"': '"信頼を築いていく過程"',
      '"共感力を発揮時"': '"共感力を発揮する時"',
      '"理解を深める場"': '"理解を深めていく場"',
      
      // 感情・心理系
      '"感情を整える時"': '"感情を整える大切な時"',
      '"心を開く準備中"': '"心を開く準備をする中"',
      '"思考を整理する"': '"思考を整理して明確にする"',
      '"直感を信じる時"': '"直感を信じて行動する時"',
      
      // 行動・実践系
      '"実行に移す段階"': '"実行に移していく段階"',
      '"計画を立てる時"': '"計画を立てる重要な時"',
      '"決断を下す瞬間"': '"決断を下す大切な瞬間"',
      '"行動を起こす時"': '"行動を起こすべき時"',
      
      // 成長・発展系
      '"成長の種を蒔く"': '"成長の種を蒔いて育てる"',
      '"発展への道筋作"': '"発展への道筋を作る"',
      '"進化を続ける道"': '"進化を続けていく道"',
      '"変化を受け入れ"': '"変化を受け入れて前進"',
      
      // エネルギー系
      '"力を蓄える期間"': '"力を蓄える重要な期間"',
      '"エネルギー充電中"': '"エネルギーを充電中"',
      '"活力を取り戻す"': '"活力を取り戻していく"',
      '"元気を回復する"': '"元気を回復させていく"',
      
      // 時間・タイミング系
      '"待つべき時期"': '"待つべき重要な時期"',
      '"動くべき時期"': '"動くべき大切な時期"',
      '"休むべき時期"': '"休むべき必要な時期"',
      '"始めるべき時"': '"始めるべき最適な時"',
      
      // 学習・理解系
      '"学びを深める時"': '"学びを深めていく時"',
      '"知識を吸収する"': '"知識を吸収していく"',
      '"理解を広げる場"': '"理解を広げていく場"',
      '"洞察を得る機会"': '"洞察を得る貴重な機会"',
      
      // 調整・バランス系
      '"バランスを取る"': '"バランスを取って安定"',
      '"調和を保つ努力"': '"調和を保つための努力"',
      '"均衡を維持する"': '"均衡を維持していく"',
      '"安定を求める心"': '"安定を求める心の状態"',
      
      // その他
      '"次への準備段階"': '"次への準備を進める段階"',
      '"新たな始まり時"': '"新たな始まりの時"',
      '"終わりと始まり"': '"終わりと始まりの転換点"',
      '"循環の中継点"': '"循環の中の重要な中継点"',
      '"転換期の入口"': '"転換期の入口に立つ"',
      '"変化の予兆期"': '"変化の予兆を感じる期"',
      '"静寂の中の力"': '"静寂の中に潜む力"'
    };
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.phase17.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.phase17.${timestamp}.js\n`);
    
    // 修正適用
    let totalFixCount = 0;
    let successfulFixes = [];
    
    console.log('7文字の修正を適用中...\n');
    
    Object.entries(sevenCharFixes).forEach(([old, newText]) => {
      const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newText);
        totalFixCount += matches.length;
        successfulFixes.push(`${old} → ${newText} (${matches.length}箇所)`);
      }
    });
    
    // 成功した修正を表示
    console.log('【修正成功項目】');
    if (successfulFixes.length > 0) {
      successfulFixes.slice(0, 20).forEach(fix => {
        console.log(`✅ ${fix}`);
      });
      if (successfulFixes.length > 20) {
        console.log(`... 他 ${successfulFixes.length - 20}件`);
      }
    } else {
      console.log('修正対象が見つかりませんでした。');
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`\n=== フェーズ17完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`修正成功項目: ${successfulFixes.length}種類`);
    console.log(`\n次のフェーズ: node fix-short-descriptions-phase18-eight-final.mjs`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixPhase17SevenFinal();