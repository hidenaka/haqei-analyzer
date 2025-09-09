import { readFile, writeFile } from 'fs/promises';

async function fixShortNonHexagramTexts() {
  try {
    console.log('=== 卦名以外の短い説明文を修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.non-hexagram.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.non-hexagram.${timestamp}.js\n`);
    
    // 64卦の名前（これらは絶対に変更しない）
    const hexagramNames = new Set([
      '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
      '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
      '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
      '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
      '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
      '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
      '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
      '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
    ]);
    
    // 修正リスト（卦名は含まない）
    const fixes = [
      // 1文字 - 八卦の要素
      { old: '"天"', new: '"天の創造的な力"', skip: hexagramNames },
      { old: '"地"', new: '"地の受容的な包容力"', skip: hexagramNames },
      { old: '"水"', new: '"水の流れる柔軟性"', skip: hexagramNames },
      { old: '"火"', new: '"火の明るい情熱"', skip: hexagramNames },
      { old: '"雷"', new: '"雷の衝撃的な変革力"', skip: hexagramNames },
      { old: '"山"', new: '"山の不動の安定感"', skip: hexagramNames },
      { old: '"風"', new: '"風の浸透する影響力"', skip: hexagramNames },
      { old: '"澤"', new: '"澤の豊かな喜び"', skip: hexagramNames },
      
      // 2文字 - 組み合わせ要素
      { old: '"水雷"', new: '"水と雷が生む始動の力"', skip: hexagramNames },
      { old: '"山水"', new: '"山と水が示す学びの道"', skip: hexagramNames },
      { old: '"水天"', new: '"水と天が教える待機の知恵"', skip: hexagramNames },
      { old: '"天水"', new: '"天と水が生む対立の調整"', skip: hexagramNames },
      { old: '"地水"', new: '"地と水が導く統率の道"', skip: hexagramNames },
      { old: '"水地"', new: '"水と地が結ぶ親和の力"', skip: hexagramNames },
      { old: '"風天"', new: '"風と天が育む蓄積の力"', skip: hexagramNames },
      { old: '"天澤"', new: '"天と澤が示す礼節の道"', skip: hexagramNames },
      { old: '"地天"', new: '"地と天が生む安泰の時"', skip: hexagramNames },
      { old: '"天地"', new: '"天と地が示す閉塞の時"', skip: hexagramNames },
      { old: '"豪傑"', new: '"豪傑のような力強さ"', skip: hexagramNames },
      { old: '"旅人"', new: '"旅人のような自由な精神"', skip: hexagramNames },
      
      // 3文字 - 役割名
      { old: '"育成者"', new: '"人を育てる教育者"', skip: hexagramNames },
      { old: '"戦略家"', new: '"戦略を立てる知恵者"', skip: hexagramNames },
      { old: '"交渉人"', new: '"対立を調整する交渉者"', skip: hexagramNames },
      { old: '"指揮官"', new: '"集団を導く指揮官"', skip: hexagramNames },
      { old: '"調和者"', new: '"人々を結ぶ調和の創造者"', skip: hexagramNames },
      { old: '"蓄積者"', new: '"資源を蓄える堅実な人"', skip: hexagramNames },
      { old: '"実践者"', new: '"理論を実践に移す人"', skip: hexagramNames },
      { old: '"調整者"', new: '"バランスを保つ調整役"', skip: hexagramNames },
      { old: '"変革者"', new: '"現状を打破する変革者"', skip: hexagramNames },
      { old: '"共感者"', new: '"他者の心を理解する共感者"', skip: hexagramNames },
      { old: '"統合者"', new: '"全体を統合する調整役"', skip: hexagramNames },
      { old: '"適応者"', new: '"環境に適応する柔軟な人"', skip: hexagramNames },
      { old: '"改善者"', new: '"問題を改善する実行者"', skip: hexagramNames },
      { old: '"俯瞰者"', new: '"全体を俯瞰する観察者"', skip: hexagramNames },
      { old: '"決断者"', new: '"決断を下す実行者"', skip: hexagramNames },
      { old: '"上昇者"', new: '"上昇を続ける成長者"', skip: hexagramNames },
      { old: '"供給者"', new: '"資源を供給する提供者"', skip: hexagramNames },
      { old: '"個性派"', new: '"独自の個性を持つ人"', skip: hexagramNames },
      { old: '"完成者"', new: '"物事を完成させる人"', skip: hexagramNames },
      { old: '"継続者"', new: '"継続する力を持つ人"', skip: hexagramNames },
      
      // 4-5文字 - タイプ名
      { old: '"サポーター"', new: '"仲間を支援するサポーター"', skip: hexagramNames },
      { old: '"パイオニア"', new: '"新しい道を切り開くパイオニア"', skip: hexagramNames },
      { old: '"イノベーター"', new: '"革新を生み出すイノベーター"', skip: hexagramNames },
      { old: '"司令官型"', new: '"強力な統率力を持つ司令官型"', skip: hexagramNames },
      { old: '"見守り人"', new: '"静かに見守る観察者"', skip: hexagramNames },
      { old: '"静観者型"', new: '"冷静に観察する静観者型"', skip: hexagramNames },
      { old: '"演出家型"', new: '"場を演出する創造者型"', skip: hexagramNames },
      { old: '"簡素化人"', new: '"物事を簡素化する実践者"', skip: hexagramNames },
      { old: '"前進突破型"', new: '"障害を突破して前進する型"', skip: hexagramNames },
      { old: '"受容統合型"', new: '"すべてを受容し統合する型"', skip: hexagramNames },
      { old: '"試行錯誤型"', new: '"試行錯誤で学ぶ成長型"', skip: hexagramNames },
      { old: '"メンター型"', new: '"人を導くメンター型"', skip: hexagramNames },
      { old: '"基本回帰型"', new: '"基本に立ち返る堅実型"', skip: hexagramNames },
      { old: '"待機観察型"', new: '"じっと待機し観察する型"', skip: hexagramNames },
      { old: '"論理武装型"', new: '"論理で武装する知性型"', skip: hexagramNames },
      { old: '"陣形防御型"', new: '"陣形を組んで防御する型"', skip: hexagramNames },
      { old: '"仲間依存型"', new: '"仲間との協力を重視する型"', skip: hexagramNames },
      { old: '"備蓄防御型"', new: '"資源を備蓄して防御する型"', skip: hexagramNames },
      { old: '"率先垂範型"', new: '"自ら率先して模範を示す型"', skip: hexagramNames },
      { old: '"突破行動型"', new: '"行動で突破する実践型"', skip: hexagramNames },
      { old: '"中庸調停型"', new: '"中庸を保ち調停する型"', skip: hexagramNames },
      { old: '"均衡維持型"', new: '"バランスを維持する安定型"', skip: hexagramNames },
      { old: '"改革提案型"', new: '"改革を提案する革新型"', skip: hexagramNames },
      { old: '"変革再生型"', new: '"変革により再生する型"', skip: hexagramNames },
      
      // エンジン名
      { old: '"革新追求エンジン"', new: '"革新を追求し続ける原動力"', skip: hexagramNames },
      { old: '"育成支援エンジン"', new: '"人材育成を支援する原動力"', skip: hexagramNames },
      { old: '"開拓挑戦エンジン"', new: '"新領域を開拓する挑戦力"', skip: hexagramNames },
      { old: '"教育啓発エンジン"', new: '"教育と啓発を推進する力"', skip: hexagramNames },
      { old: '"戦略立案エンジン"', new: '"戦略を立案する知的原動力"', skip: hexagramNames },
      { old: '"正義追求エンジン"', new: '"正義を追求する強い意志"', skip: hexagramNames },
      { old: '"統率指揮エンジン"', new: '"組織を統率する指揮力"', skip: hexagramNames },
      { old: '"協調促進エンジン"', new: '"協調を促進する調和の力"', skip: hexagramNames },
      
      // 環境名
      { old: '"保守的な環境"', new: '"変化を好まない保守的な環境"', skip: hexagramNames },
      { old: '"画一的な環境"', new: '"個性を認めない画一的な環境"', skip: hexagramNames },
      { old: '"合議制の環境"', new: '"合議で決める民主的な環境"', skip: hexagramNames },
      { old: '"装飾的な環境"', new: '"見た目重視の装飾的な環境"', skip: hexagramNames },
      { old: '"政治的な環境"', new: '"駆け引きの多い政治的な環境"', skip: hexagramNames },
      { old: '"硬直的な環境"', new: '"柔軟性に欠ける硬直的な環境"', skip: hexagramNames }
    ];
    
    // 修正を適用
    let totalFixCount = 0;
    const appliedFixes = [];
    
    console.log('修正を適用中...\n');
    
    for (const fix of fixes) {
      // 卦名と完全一致する場合はスキップ
      const cleanText = fix.old.replace(/"/g, '');
      if (hexagramNames.has(cleanText)) {
        console.log(`⏭️ スキップ（卦名）: ${fix.old}`);
        continue;
      }
      
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        appliedFixes.push({
          old: fix.old,
          new: fix.new,
          count: matches.length
        });
        console.log(`✅ ${fix.old} → ${fix.new} (${matches.length}箇所)`);
      }
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`\n=== 修正完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`修正項目数: ${appliedFixes.length}種類`);
    
    // サンプル報告
    console.log('\n【修正サンプル（最初の20件）】');
    appliedFixes.slice(0, 20).forEach((fix, i) => {
      console.log(`${i + 1}. ${fix.old} → ${fix.new} (${fix.count}箇所)`);
    });
    
    console.log('\n📝 修正済みファイル: ./public/js/data/hexagram-human-traits-v3.js');
    console.log(`📁 バックアップ: hexagram-human-traits-v3.backup.non-hexagram.${timestamp}.js`);
    console.log('\n元に戻す場合は以下のコマンドを実行してください:');
    console.log(`cp ./public/js/data/hexagram-human-traits-v3.backup.non-hexagram.${timestamp}.js ./public/js/data/hexagram-human-traits-v3.js`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixShortNonHexagramTexts();