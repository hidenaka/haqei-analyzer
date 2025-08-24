import { readFile, writeFile } from 'fs/promises';

async function fixShortHexagramNames() {
  try {
    console.log('=== 1-3文字の卦名と短い説明を修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.hexagram-names.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.hexagram-names.${timestamp}.js\n`);
    
    // 1文字の要素名を詳細化
    const oneCharFixes = [
      { old: '"天"', new: '"天の力で道を開く"' },
      { old: '"地"', new: '"地の恵みを受け止める"' },
      { old: '"水"', new: '"水のように流れる柔軟性"' },
      { old: '"火"', new: '"火のような情熱と輝き"' },
      { old: '"雷"', new: '"雷のような衝撃と変革"' },
      { old: '"山"', new: '"山のような不動の強さ"' },
      { old: '"風"', new: '"風のように浸透する力"' },
      { old: '"澤"', new: '"澤のような豊かな恵み"' }
    ];
    
    // 2文字の組み合わせを詳細化
    const twoCharFixes = [
      { old: '"水雷"', new: '"水と雷の出会いが生む始まり"' },
      { old: '"山水"', new: '"山と水が教える学びの道"' },
      { old: '"水天"', new: '"水と天が示す待つべき時"' },
      { old: '"天水"', new: '"天と水が生む葛藤と調整"' },
      { old: '"地水"', new: '"地と水が導く統率の道"' },
      { old: '"水地"', new: '"水と地が結ぶ親和の縁"' },
      { old: '"風天"', new: '"風と天が育む小さな蓄積"' },
      { old: '"天澤"', new: '"天と澤が示す礼儀の道"' },
      { old: '"地天"', new: '"地と天が生む安泰の時"' },
      { old: '"天地"', new: '"天と地が示す閉塞の時"' },
      { old: '"天火"', new: '"天と火が結ぶ仲間の縁"' },
      { old: '"火天"', new: '"火と天が示す大いなる豊かさ"' },
      { old: '"地山"', new: '"地と山が導く謙虚な道"' },
      { old: '"雷地"', new: '"雷と地が生む豫楽の時"' },
      { old: '"澤雷"', new: '"澤と雷が示す随従の道"' },
      { old: '"山風"', new: '"山と風が教える蠱惑の戒め"' },
      { old: '"地澤"', new: '"地と澤が臨む接近の時"' },
      { old: '"風地"', new: '"風と地が示す観察の智慧"' },
      { old: '"火雷"', new: '"火と雷が噛み合う断罪の時"' },
      { old: '"山火"', new: '"山と火が飾る賁の美しさ"' },
      { old: '"地雷"', new: '"地と雷が示す復帰の道"' },
      { old: '"天雷"', new: '"天と雷が導く無妄の真実"' },
      { old: '"山天"', new: '"山と天が蓄える大いなる力"' },
      { old: '"山雷"', new: '"山と雷が養う頤の恵み"' },
      { old: '"澤風"', new: '"澤と風が超える大いなる試練"' },
      { old: '"風山"', new: '"風と山が教える漸進の道"' },
      { old: '"雷澤"', new: '"雷と澤が結ぶ帰妹の縁"' },
      { old: '"雷火"', new: '"雷と火が示す豊盛の時"' },
      { old: '"火山"', new: '"火と山が旅する遊歴の道"' },
      { old: '"風澤"', new: '"風と澤が渙散する新たな形"' },
      { old: '"水澤"', new: '"水と澤が節制する適度の道"' },
      { old: '"風雷"', new: '"風と雷が益する発展の時"' },
      { old: '"澤天"', new: '"澤と天が決断する夬の時"' },
      { old: '"天風"', new: '"天と風が邂逅する出会いの時"' },
      { old: '"澤地"', new: '"澤と地が萃める集合の時"' },
      { old: '"地風"', new: '"地と風が升る上昇の道"' },
      { old: '"澤水"', new: '"澤と水が困窮する試練の時"' },
      { old: '"水風"', new: '"水と風が井戸となり恵む"' },
      { old: '"澤火"', new: '"澤と火が革新する変革の時"' },
      { old: '"火風"', new: '"火と風が鼎立する調和の器"' },
      { old: '"山澤"', new: '"山と澤が損して益を得る道"' },
      { old: '"雷風"', new: '"雷と風が恒久に続く道"' },
      { old: '"雷山"', new: '"雷と山が示す小さな超越"' },
      { old: '"水火"', new: '"水と火が既済する完成の時"' },
      { old: '"火水"', new: '"火と水が未済のまま続く道"' }
    ];
    
    // 3文字の卦名と役割名を詳細化
    const threeCharFixes = [
      // 卦名
      { old: '"乾為天"', new: '"乾為天の創造的な力"' },
      { old: '"坤為地"', new: '"坤為地の受容的な力"' },
      { old: '"水雷屯"', new: '"水雷屯の困難を乗り越える力"' },
      { old: '"山水蒙"', new: '"山水蒙の学びと成長の道"' },
      { old: '"水天需"', new: '"水天需の待つことの智慧"' },
      { old: '"天水訟"', new: '"天水訟の対立を解決する力"' },
      { old: '"地水師"', new: '"地水師の統率と指導の道"' },
      { old: '"水地比"', new: '"水地比の親和と協調の力"' },
      { old: '"天澤履"', new: '"天澤履の実践と礼節の道"' },
      { old: '"地天泰"', new: '"地天泰の安泰と調和の時"' },
      { old: '"天地否"', new: '"天地否の閉塞を打破する力"' },
      { old: '"火天大有"', new: '"火天大有の大いなる豊かさ"' },
      { old: '"地山謙"', new: '"地山謙の謙虚さが生む成長"' },
      { old: '"雷地豫"', new: '"雷地豫の喜びと楽しみの時"' },
      { old: '"澤雷随"', new: '"澤雷随の柔軟に随う道"' },
      { old: '"山風蠱"', new: '"山風蠱の腐敗を正す力"' },
      { old: '"地澤臨"', new: '"地澤臨の接近と観察の時"' },
      { old: '"風地観"', new: '"風地観の洞察と理解の道"' },
      { old: '"山火賁"', new: '"山火賁の美しく飾る力"' },
      { old: '"地雷復"', new: '"地雷復の復活と再生の道"' },
      { old: '"山雷頤"', new: '"山雷頤の養い育てる力"' },
      { old: '"風山漸"', new: '"風山漸の着実な前進の道"' },
      { old: '"雷澤帰妹"', new: '"雷澤帰妹の縁結びの道"' },
      { old: '"雷火豊"', new: '"雷火豊の豊かさと充実の時"' },
      { old: '"火山旅"', new: '"火山旅の新天地を求める道"' },
      { old: '"風澤中孚"', new: '"風澤中孚の真心と信頼の道"' },
      { old: '"雷山小過"', new: '"雷山小過の小さな超越の道"' },
      { old: '"水火既済"', new: '"水火既済の完成と調和の時"' },
      { old: '"火水未済"', new: '"火水未済の未完成が生む可能性"' },
      
      // 役割名
      { old: '"育成者"', new: '"人を育てる教育者の資質"' },
      { old: '"戦略家"', new: '"戦略を立てる知恵者の才能"' },
      { old: '"交渉人"', new: '"対立を調整する交渉の達人"' },
      { old: '"指揮官"', new: '"集団を導く指揮官の統率力"' },
      { old: '"調和者"', new: '"人々を結ぶ調和の創造者"' },
      { old: '"蓄積者"', new: '"資源を蓄える堅実な蓄積者"' },
      { old: '"実践者"', new: '"理論を実践に移す行動派"' },
      { old: '"調整者"', new: '"バランスを保つ調整の達人"' },
      { old: '"変革者"', new: '"現状を打破する変革の推進者"' },
      { old: '"共感者"', new: '"他者の心を理解する共感者"' },
      { old: '"促進者"', new: '"物事を前進させる促進者"' },
      { old: '"謙虚者"', new: '"謙虚さを持つ成長者"' },
      { old: '"楽観者"', new: '"前向きな姿勢の楽観主義者"' },
      { old: '"随従者"', new: '"柔軟に従う協調的な随従者"' },
      { old: '"改革者"', new: '"問題を正す改革の実行者"' },
      { old: '"観察者"', new: '"深く見抜く鋭い観察者"' },
      { old: '"装飾者"', new: '"美しさを創る装飾の達人"' },
      { old: '"復活者"', new: '"再生の力を持つ復活者"' },
      { old: '"養育者"', new: '"愛情深く育てる養育者"' },
      { old: '"漸進者"', new: '"着実に進む堅実な前進者"' },
      { old: '"結縁者"', new: '"縁を結ぶ仲介者の役割"' },
      { old: '"豊穣者"', new: '"豊かさを生む創造者"' },
      { old: '"旅行者"', new: '"新しい世界を探す旅行者"' },
      { old: '"信頼者"', new: '"信頼を築く誠実な人"' },
      { old: '"超越者"', new: '"限界を超える挑戦者"' },
      { old: '"完成者"', new: '"物事を完成させる達成者"' },
      { old: '"継続者"', new: '"未完成を続ける探求者"' }
    ];
    
    // 修正を適用
    let totalFixCount = 0;
    
    console.log('【1文字の修正】');
    for (const fix of oneCharFixes) {
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        console.log(`✅ ${fix.old} → ${fix.new} (${matches.length}箇所)`);
      }
    }
    
    console.log('\n【2文字の修正】');
    for (const fix of twoCharFixes) {
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        console.log(`✅ ${fix.old} → ${fix.new} (${matches.length}箇所)`);
      }
    }
    
    console.log('\n【3文字の修正】');
    for (const fix of threeCharFixes) {
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        console.log(`✅ ${fix.old} → ${fix.new} (${matches.length}箇所)`);
      }
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`\n=== 修正完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`1文字: ${oneCharFixes.length}種類`);
    console.log(`2文字: ${twoCharFixes.length}種類`);
    console.log(`3文字: ${threeCharFixes.length}種類`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixShortHexagramNames();