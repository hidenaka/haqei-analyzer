import { readFile, writeFile } from 'fs/promises';

async function fixPhase14FinalSeven() {
  try {
    console.log('=== フェーズ14: 最終7文字58件を一行一行修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 7文字の説明を一行一行丁寧に修正（58件）
    const sevenCharFixes = {
      // 環境・場所系
      '"良縁に恵まれる"': '"良縁に恵まれる幸運な状態"',
      '"集団活動の環境"': '"集団活動に適した環境"',
      '"要求のない環境"': '"要求や圧力のない環境"',
      '"変化を感じる場"': '"変化を敏感に感じる場"',
      '"人々が集まる場"': '"多くの人々が集まる場"',
      '"交流の中心地"': '"活発な交流の中心地"',
      '"感覚的な環境"': '"感覚を刺激する環境"',
      '"緊張感ある環境"': '"適度な緊張感がある環境"',
      '"静的な環境"': '"静かで落ち着いた環境"',
      '"波動の共鳴場"': '"波動が共鳴する特別な場"',
      '"困難な環境"': '"困難だが成長できる環境"',
      '"制限のある環境"': '"制限があるが安全な環境"',
      '"解放的な環境"': '"解放的で自由な環境"',
      '"損得抜きの環境"': '"損得を超えた純粋な環境"',
      '"益を生む環境"': '"益を生み出す生産的な環境"',
      '"拡大する環境"': '"活動が拡大する環境"',
      '"危険な環境"': '"危険だが刺激的な環境"',
      '"決断を促す環境"': '"決断を促進する環境"',
      '"拡散する環境"': '"エネルギーが拡散する環境"',
      '"求心力ある環境"': '"求心力が働く環境"',
      '"交流が盛んな場"': '"交流が盛んで活気ある場"',
      '"完成を目指す場"': '"完成を目指して努力する場"',
      '"バランスの良い場"': '"バランスの取れた場"',
      '"細やかな環境"': '"細やかな配慮がある環境"',
      '"大胆な環境"': '"大胆な挑戦ができる環境"',
      '"変革的な環境"': '"変革を促進する環境"',
      '"安定した環境"': '"変化の少ない安定した環境"',
      '"流動的な環境"': '"常に変化する流動的な環境"',
      
      // 時間・活動系
      '"整理整頓の時間"': '"整理整頓をする貴重な時間"',
      '"破壊と創造の時"': '"破壊と創造を同時に行う時"',
      '"振り返りの時間"': '"過去を振り返る大切な時間"',
      '"準備と計画の時"': '"準備と計画を立てる時"',
      '"解放される時間"': '"束縛から解放される時間"',
      '"与える時間"': '"惜しみなく与える時間"',
      '"成長の時間"': '"着実に成長する時間"',
      '"決断の時間"': '"重要な決断を下す時間"',
      '"交流の時間"': '"人と交流する楽しい時間"',
      '"完成の時間"': '"物事を完成させる時間"',
      '"調整の時間"': '"バランスを調整する時間"',
      '"変革の時間"': '"大きな変革を起こす時間"',
      
      // 対象・目的系
      '"集める対象と場"': '"集めるべき対象と適切な場"',
      '"次の革命を計画"': '"次の革命を綿密に計画する"',
      '"新しい井戸探し"': '"新しい水源を探し求める"',
      '"次の旅の準備"': '"次の旅に向けて準備する"',
      '"次のサイクルへ"': '"次のサイクルへ移行する"',
      
      // 言葉・コミュニケーション系
      '"成長を促す言葉"': '"成長を促す励ましの言葉"',
      '"楽しさと笑顔"': '"楽しさと笑顔を大切にする"',
      '"信頼の言葉"': '"信頼を築く誠実な言葉"',
      
      // 能力・強み系
      '"着実な信頼構築"': '"着実に信頼を構築する力"',
      '"交流の活性化"': '"交流を活性化させる能力"',
      
      // 成長・回復系
      '"小さな成長から"': '"小さな成長から始める"',
      '"成長を見守る人"': '"成長を温かく見守る人"',
      '"発展的な縁から"': '"発展的な縁から始まる"',
      '"新たなサイクル"': '"新たなサイクルを始める"',
      
      // その他
      '"誰も傷つけない"': '"誰も傷つけない優しさ"',
      '"安全な立ち位置"': '"安全で確実な立ち位置"',
      '"小さな正確さ"': '"小さなことも正確に行う"'
    };
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.phase14.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.phase14.${timestamp}.js\n`);
    
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
    
    console.log(`\n=== フェーズ14完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`修正成功項目: ${successfulFixes.length}種類`);
    console.log(`\n次のフェーズ: node fix-short-descriptions-phase15-final-eight.mjs`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixPhase14FinalSeven();