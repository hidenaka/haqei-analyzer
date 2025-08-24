import { readFile, writeFile } from 'fs/promises';

async function fixInappropriateContent() {
  try {
    // V3データベースを読み込む
    const content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 修正が必要な箇所のマッピング
    const corrections = {
      // 震為雷の修正
      '"description": "雷で反撃する"': '"description": "瞬発的な反応で自己防衛する"',
      '"metaphor": "触れたら感電"': '"metaphor": "強い防御反応を示す"',
      '"example": "攻撃 → 即座に雷撃"': '"example": "批判に対して即座に反論する"',
      '"example": "最大出力で反撃"': '"example": "全力で自分の立場を守る"',
      '"whatHappens": "エネルギーを蓄積"': '"whatHappens": "静かに力を蓄えている"',
      '"whatHappens": "完全に静止"': '"whatHappens": "完全に休息モードに入る"',
      '"warning": "暴発に注意"': '"warning": "衝動的な反応に注意が必要"',
      '"description": "強烈な印象を与える"': '"description": "一瞬で強い印象を残す人"',
      '"metaphor": "忘れられない衝撃"': '"metaphor": "忘れられない出会いを作る"',
      '"example": "一言で核心を突く"': '"example": "短い言葉で本質を伝える"',
      '"whatYouDo": "瞬間的に爆発"': '"whatYouDo": "瞬間的に強く反応する"',
      '"whatHappens": "全エネルギー放出"': '"whatHappens": "持てる力を全て出し切る"',
      
      // 離為火の修正
      '"metaphor": "怒りの炎で敵を焼き尽くす"': '"metaphor": "強い感情で自分を守る"',
      '"description": "感情の炎で全てを燃やす"': '"description": "感情を強く表現して対処する"',
      '"example": "怒り → 爆発的な感情表出"': '"example": "ストレスを感情表現で発散する"',
      '"whatHappens": "全てを燃やし尽くす"': '"whatHappens": "感情を完全に出し切る"',
      '"example": "破壊的な情熱の爆発"': '"example": "抑えきれない感情の表出"',
      '"metaphor": "永遠に燃え続ける炎"': '"metaphor": "尽きることのない情熱を持つ"',
      '"whatHappens": "次の燃料を探す"': '"whatHappens": "次の情熱の対象を探している"',
      '"warning": "燃え尽きに注意"': '"warning": "燃え尽き症候群に注意が必要"',
      '"metaphor": "炎のような感染力"': '"metaphor": "情熱が周りに伝わりやすい"',
      '"whatYouDo": "激しく燃えて発散"': '"whatYouDo": "情熱的に感情を表現する"',
      
      // その他の攻撃的表現の修正
      '"example": "攻撃 → 論理的矛盾を指摘して防御"': '"example": "批判に対して論理的に反論する"',
      '"example": "外部からの攻撃 → チーム一丸で防御"': '"example": "困難に対してチーム一丸で対処する"',
      '"example": "どんな攻撃も無言で受ける"': '"example": "どんな批判も黙って受け止める"',
      
      // 短すぎる説明の修正（例）
      '"whatHappens": "一時的な撤退と内省"': '"whatHappens": "一時的に距離を置いて自分と向き合う時間を作る"',
      '"whatHappens": "一人で静かに過ごす"': '"whatHappens": "一人の時間を大切にしてエネルギーを回復する"',
      '"warning": "急激な変化は苦手"': '"warning": "急激な変化に対応するのが苦手な傾向がある"',
      '"whatHappens": "守りを固めて耐える"': '"whatHappens": "守りの姿勢を固めて困難に耐える"',
      '"whatHappens": "考える前に体が動く"': '"whatHappens": "直感的に行動して後から考えるタイプ"',
      '"whatHappens": "次の行動の準備運動"': '"whatHappens": "次の行動に向けて心身の準備をしている"',
      '"description": "動いて打開する"': '"description": "行動することで問題を打開しようとする"',
      '"whatYouDo": "とにかく動いて解決"': '"whatYouDo": "考えるより先に行動して解決を図る"',
      '"whatHappens": "全力で動き回る"': '"whatHappens": "全力で行動して状況を変えようとする"',
      
      // 地味な説明の充実
      '"whatHappens": "常に学ぶ姿勢を持つ"': '"whatHappens": "常に謙虚に学ぶ姿勢を持ち続けている"',
      '"whatHappens": "ひたすら耐える"': '"whatHappens": "どんな困難もひたすら耐え抜く強さを持つ"',
      '"whatHappens": "楽しいことを考える"': '"whatHappens": "楽しいことを考えて気持ちを前向きに保つ"',
      '"whatYouDo": "抵抗せず流れに乗る"': '"whatYouDo": "無理に抵抗せず状況の流れに身を任せる"',
      '"whatHappens": "環境に完全に同化"': '"whatHappens": "環境に完全に適応して溶け込む"',
      '"whatHappens": "次の改善対象を探す"': '"whatHappens": "次に改善すべき対象を探し続けている"',
      '"whatHappens": "緊急修復モード起動"': '"whatHappens": "緊急事態に対して修復モードで対応する"',
      '"warning": "行動が遅れがち"': '"warning": "慎重すぎて行動が遅れがちになることがある"',
      '"whatHappens": "完全に引きこもる"': '"whatHappens": "外界から完全に身を引いて内省する"'
    };
    
    // 一括置換
    let fixedContent = content;
    Object.entries(corrections).forEach(([old, newText]) => {
      const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      fixedContent = fixedContent.replace(regex, newText);
    });
    
    // より自然な表現への一括修正
    fixedContent = fixedContent
      // 攻撃的な表現を防御的な表現に
      .replace(/攻撃/g, '批判')
      .replace(/敵を/g, '困難を')
      .replace(/反撃/g, '対応')
      .replace(/雷撃/g, '強い反応')
      .replace(/放電/g, 'エネルギー放出')
      .replace(/暴発/g, '衝動的な行動')
      .replace(/電撃/g, '瞬発的')
      .replace(/爆発的な/g, '非常に強い')
      .replace(/破壊的な/g, '激しい')
      .replace(/全てを燃やし尽くす/g, '感情を完全に出し切る')
      .replace(/触れたら感電/g, '強い防御反応を示す')
      .replace(/雷で反撃/g, '瞬発的に対応');
    
    // バックアップを作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.${timestamp}.js`, content);
    
    // 修正版を保存
    await writeFile('./public/js/data/hexagram-human-traits-v3-fixed.js', fixedContent);
    
    console.log('✅ V3データベースの不適切な表現を修正しました');
    console.log(`📁 バックアップ: hexagram-human-traits-v3.backup.${timestamp}.js`);
    console.log('📁 修正版: hexagram-human-traits-v3-fixed.js');
    
    // 修正箇所の統計
    let changeCount = 0;
    Object.keys(corrections).forEach(old => {
      const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) changeCount += matches.length;
    });
    
    console.log(`\n📊 修正統計:`);
    console.log(`   - 直接修正: ${Object.keys(corrections).length}箇所`);
    console.log(`   - 実際の変更: ${changeCount}箇所以上`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixInappropriateContent();