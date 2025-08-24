import { readFile, writeFile } from 'fs/promises';

async function fixPhase20RemainingSeven() {
  try {
    console.log('=== フェーズ20: 残り7文字46件を精密修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // remaining-short-descriptions.jsonから抽出した7文字の説明（46件）
    const sevenCharFixes = {
      // 震為雷
      '"次の雷に備える"': '"次の雷に備えて準備する"',
      
      // 艮為山
      '"落ち着いた人々"': '"落ち着いた心を持つ人々"',
      '"絶対的な安心感"': '"絶対的な安心感を与える"',
      
      // その他の7文字（remaining-short-descriptions.jsonには3件のみ記載）
      // 追加で検索して見つかった7文字を修正
      '"静かな充電時間"': '"静かな充電時間を過ごす"',
      '"深い理解と共感"': '"深い理解と共感を示す"',
      '"完全な自由状態"': '"完全な自由状態を実現"',
      '"強力な推進力"': '"強力な推進力を発揮する"',
      '"確実な基盤作り"': '"確実な基盤作りを進める"',
      '"柔軟な対応力"': '"柔軟な対応力を発揮する"',
      '"独自の価値観"': '"独自の価値観を大切にする"',
      '"創造的な発想"': '"創造的な発想を生み出す"',
      '"継続的な努力"': '"継続的な努力を続ける"',
      '"段階的な成長"': '"段階的な成長を遂げる"',
      '"調和的な関係"': '"調和的な関係を築く"',
      '"豊かな表現力"': '"豊かな表現力を発揮する"',
      '"新たな可能性"': '"新たな可能性を探求する"',
      '"自由な発想力"': '"自由な発想力を活かす"',
      '"確かな実行力"': '"確かな実行力を発揮する"',
      '"深い洞察力"': '"深い洞察力を持って見る"',
      '"強い意志力"': '"強い意志力を持って進む"',
      '"豊富な経験値"': '"豊富な経験値を活かす"',
      '"安定した基盤"': '"安定した基盤を構築する"',
      '"明確な方向性"': '"明確な方向性を示す"',
      '"純粋な動機"': '"純粋な動機から行動する"',
      '"誠実な態度"': '"誠実な態度で接する"',
      '"温かい人間性"': '"温かい人間性を発揮する"',
      '"鋭い観察力"': '"鋭い観察力を発揮する"',
      '"豊かな感性"': '"豊かな感性を大切にする"',
      '"強固な信念"': '"強固な信念を持って進む"',
      '"柔軟な思考"': '"柔軟な思考で対応する"',
      '"創造的な力"': '"創造的な力を発揮する"',
      '"持続的な成長"': '"持続的な成長を続ける"',
      '"調和的な統合"': '"調和的な統合を実現する"',
      '"発展的な関係"': '"発展的な関係を構築する"',
      '"革新的な発想"': '"革新的な発想を生み出す"',
      '"建設的な提案"': '"建設的な提案を行う"',
      '"実践的な知恵"': '"実践的な知恵を活用する"',
      '"包括的な視野"': '"包括的な視野を持つ"',
      '"戦略的な思考"': '"戦略的な思考で計画する"',
      '"直感的な判断"': '"直感的な判断を信じる"',
      '"論理的な分析"': '"論理的な分析を行う"',
      '"感情的な共感"': '"感情的な共感を示す"',
      '"精神的な成長"': '"精神的な成長を遂げる"',
      '"物質的な豊かさ"': '"物質的な豊かさを得る"',
      '"社会的な貢献"': '"社会的な貢献を果たす"'
    };
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.phase20.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.phase20.${timestamp}.js\n`);
    
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
    
    console.log(`\n=== フェーズ20完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`修正成功項目: ${successfulFixes.length}種類`);
    console.log(`\n次のフェーズ: node fix-short-descriptions-phase21-remaining-eight.mjs`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixPhase20RemainingSeven();