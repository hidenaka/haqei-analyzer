import { readFile, writeFile } from 'fs/promises';

async function fixRemainingOneByOne() {
  try {
    console.log('=== 残り149件を一行一行丁寧に修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.final.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.final.${timestamp}.js\n`);
    
    // 残りの短い説明を一行一行修正（remaining-short-descriptions.jsonから）
    const fixes = [
      // 雷澤帰妹 & 風澤中孚 (9文字)
      { old: '"支援を得やすい状況"', new: '"支援を得やすい状況にある"', hexagram: '雷澤帰妹/風澤中孚' },
      
      // 雷火豊 (7-9文字)
      { old: '"質も量も大切にする"', new: '"質も量も大切にして進める"', hexagram: '雷火豊' },
      { old: '"次の収穫を待つ"', new: '"次の収穫を待って準備する"', hexagram: '雷火豊' },
      { old: '"分かち合える仲間"', new: '"分かち合える仲間と共に"', hexagram: '雷火豊' },
      { old: '"枯渇、または過剰"', new: '"枯渇または過剰になりやすい"', hexagram: '雷火豊' },
      
      // 火山旅 (7-9文字)
      { old: '"次の目的地を探す"', new: '"次の目的地を探して進む"', hexagram: '火山旅' },
      { old: '"新しい世界を発見"', new: '"新しい世界を発見する"', hexagram: '火山旅' },
      { old: '"冒険心を全開にする"', new: '"冒険心を全開にして挑戦"', hexagram: '火山旅' },
      { old: '"また旅立つために"', new: '"また旅立つために準備する"', hexagram: '火山旅' },
      { old: '"時には定住も考える"', new: '"時には定住も考えてみる"', hexagram: '火山旅' },
      { old: '"開放的で自由な会話"', new: '"開放的で自由な会話をする"', hexagram: '火山旅' },
      { old: '"『世界は広いよ』"', new: '"『世界は広いよ』と伝える"', hexagram: '火山旅' },
      { old: '"新しい視点、柔軟性"', new: '"新しい視点と柔軟性を持つ"', hexagram: '火山旅' },
      { old: '"定着、深い関係"', new: '"定着や深い関係が苦手"', hexagram: '火山旅' },
      { old: '"新しい風を運ぶ"', new: '"新しい風を運んでくる"', hexagram: '火山旅' },
      { old: '"大切な場所も作ろう"', new: '"大切な場所も作っていこう"', hexagram: '火山旅' },
      { old: '"新しい視点を得る"', new: '"新しい視点を得ることができる"', hexagram: '火山旅' },
      { old: '"完全に旅立つ決意"', new: '"完全に旅立つ決意をする"', hexagram: '火山旅' },
      { old: '"全てを捨てて旅へ"', new: '"全てを捨てて旅へ出る"', hexagram: '火山旅' },
      { old: '"新天地で再起を図る"', new: '"新天地で再起を図っていく"', hexagram: '火山旅' },
      { old: '"旅先での出会い"', new: '"旅先での出会いを大切に"', hexagram: '火山旅' },
      { old: '"世界を広げる存在"', new: '"世界を広げる存在となる"', hexagram: '火山旅' },
      
      // 巽為風 (8-9文字)
      { old: '"静かに影響を広げる"', new: '"静かに影響を広げていく"', hexagram: '巽為風' },
      { old: '"流れを読む時間"', new: '"流れを読む時間を取る"', hexagram: '巽為風' },
      { old: '"次の浸透先を探す"', new: '"次の浸透先を探していく"', hexagram: '巽為風' },
      { old: '"浸透できる隙間"', new: '"浸透できる隙間を見つける"', hexagram: '巽為風' },
      { old: '"説得、影響、浸透"', new: '"説得と影響と浸透を行う"', hexagram: '巽為風' },
      { old: '"強制、命令、対立"', new: '"強制や命令や対立が苦手"', hexagram: '巽為風' },
      { old: '"開かれた心の人々"', new: '"開かれた心の人々と活動"', hexagram: '巽為風' },
      { old: '"自然に人を動かす"', new: '"自然に人を動かす力を持つ"', hexagram: '巽為風' },
      { old: '"影が薄いことも"', new: '"影が薄いこともある"', hexagram: '巽為風' },
      { old: '"時には存在感も必要"', new: '"時には存在感も必要となる"', hexagram: '巽為風' },
      { old: '"不要な摩擦を避ける"', new: '"不要な摩擦を避けて進む"', hexagram: '巽為風' },
      { old: '"形を失って逃げる"', new: '"形を失って逃げてしまう"', hexagram: '巽為風' },
      { old: '"少しずつ集まる"', new: '"少しずつ集まって回復"', hexagram: '巽為風/風水渙' },
      { old: '"自然な流れに任せる"', new: '"自然な流れに任せて進む"', hexagram: '巽為風' },
      { old: '"風の向きに従う"', new: '"風の向きに従って動く"', hexagram: '巽為風' },
      { old: '"開放的で自由な空間"', new: '"開放的で自由な空間で活動"', hexagram: '巽為風' },
      
      // 兌為澤 (8-9文字)
      { old: '"みんなを喜ばせる時"', new: '"みんなを喜ばせる時に発動"', hexagram: '兌為澤' },
      { old: '"最高の喜びを提供"', new: '"最高の喜びを提供する"', hexagram: '兌為澤' },
      { old: '"静かな喜びを味わう"', new: '"静かな喜びを味わって充電"', hexagram: '兌為澤' },
      { old: '"小さな幸せを感じる"', new: '"小さな幸せを感じて休む"', hexagram: '兌為澤' },
      { old: '"充電も楽しく行う"', new: '"充電も楽しく行っていく"', hexagram: '兌為澤' },
      { old: '"笑顔と喜びの共有"', new: '"笑顔と喜びの共有をする"', hexagram: '兌為澤' },
      { old: '"本物の喜びを大切に"', new: '"本物の喜びを大切にする"', hexagram: '兌為澤' },
      { old: '"明るく楽しい会話"', new: '"明るく楽しい会話をする"', hexagram: '兌為澤' },
      { old: '"雰囲気作り、励まし"', new: '"雰囲気作りと励ましを行う"', hexagram: '兌為澤' },
      { old: '"深刻な話、批判"', new: '"深刻な話や批判が苦手"', hexagram: '兌為澤' },
      { old: '"明るい雰囲気の環境"', new: '"明るい雰囲気の環境で活動"', hexagram: '兌為澤' },
      { old: '"ポジティブな人々"', new: '"ポジティブな人々と共に"', hexagram: '兌為澤' },
      { old: '"みんなを元気にする"', new: '"みんなを元気にする力"', hexagram: '兌為澤' },
      { old: '"真剣さも時には必要"', new: '"真剣さも時には必要となる"', hexagram: '兌為澤' },
      { old: '"無理に笑顔を作る"', new: '"無理に笑顔を作ってしまう"', hexagram: '兌為澤' },
      { old: '"周りを心配させない"', new: '"周りを心配させないように"', hexagram: '兌為澤' },
      { old: '"本心が伝わらない"', new: '"本心が伝わらないことがある"', hexagram: '兌為澤' },
      { old: '"過剰な明るさに注意"', new: '"過剰な明るさに注意が必要"', hexagram: '兌為澤' },
      { old: '"本当の感情を出す"', new: '"本当の感情を出していく"', hexagram: '兌為澤' },
      { old: '"本当の気持ちを話す"', new: '"本当の気持ちを話していく"', hexagram: '兌為澤' },
      { old: '"信頼できる人に本音"', new: '"信頼できる人に本音を話す"', hexagram: '兌為澤' },
      { old: '"本心を受け止める人"', new: '"本心を受け止めてくれる人"', hexagram: '兌為澤' },
      { old: '"本物の喜びを広げる"', new: '"本物の喜びを広げていく"', hexagram: '兌為澤' }
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
    console.log(`\n検証: node comprehensive-v3-review.mjs`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixRemainingOneByOne();