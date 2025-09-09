import { readFile, writeFile } from 'fs/promises';

async function fixAllRemainingShort() {
  try {
    console.log('=== すべての残り短い説明文を一括修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.all-remaining.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.all-remaining.${timestamp}.js\n`);
    
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
    
    // 大量の修正リスト
    const fixes = [
      // 3文字の役割名
      { old: '"再生者"', new: '"再生の力を持つ復活者"' },
      { old: '"純粋者"', new: '"純粋な心を持つ清らかな人"' },
      { old: '"養生者"', new: '"養生を重視する健康的な人"' },
      { old: '"流動者"', new: '"流動的に動く柔軟な人"' },
      { old: '"情熱者"', new: '"情熱を燃やす熱い人"' },
      { old: '"感応者"', new: '"感応する敏感な人"' },
      { old: '"退避者"', new: '"戦略的に退避する賢者"' },
      { old: '"圧倒型"', new: '"圧倒的な力を持つ強者型"' },
      { old: '"内光者"', new: '"内なる光を持つ啓発者"' },
      { old: '"家族人"', new: '"家族を大切にする愛情深い人"' },
      { old: '"忍耐者"', new: '"忍耐強く待つ辛抱強い人"' },
      { old: '"解放者"', new: '"束縛から解放する自由の人"' },
      { old: '"奉仕者"', new: '"奉仕の心を持つ献身的な人"' },
      { old: '"増幅者"', new: '"力を増幅させる強化者"' },
      { old: '"決定者"', new: '"決定を下す決断力のある人"' },
      { old: '"集結者"', new: '"人々を集結させる統率者"' },
      { old: '"成長者"', new: '"成長を続ける向上心の高い人"' },
      { old: '"克服者"', new: '"困難を克服する強い意志の人"' },
      { old: '"創造者"', new: '"新しいものを創造する革新者"' },
      { old: '"衝撃者"', new: '"衝撃を与える変革者"' },
      { old: '"段階者"', new: '"段階的に進む計画的な人"' },
      { old: '"浸透者"', new: '"静かに浸透する影響力の人"' },
      { old: '"喜悦者"', new: '"喜びを分かち合う明るい人"' },
      { old: '"拡散者"', new: '"広く拡散させる伝播者"' },
      { old: '"節度者"', new: '"節度を保つ自制心の強い人"' },
      { old: '"誠実型"', new: '"誠実さを大切にする信頼型"' },
      { old: '"慎重者"', new: '"慎重に行動する思慮深い人"' },
      { old: '"確認型"', new: '"確認を重視する確実性型"' },
      
      // 5文字の型名
      { old: '"感情表出型"', new: '"感情を表出する表現型"' },
      { old: '"共感察知型"', new: '"共感を察知する感受性型"' },
      { old: '"鈍感な環境"', new: '"感受性の鈍い無神経な環境"' },
      { old: '"感覚遮断型"', new: '"感覚を遮断する防御型"' },
      { old: '"忍耐継続型"', new: '"忍耐強く継続する持続型"' },
      { old: '"距離調整型"', new: '"距離を調整する適応型"' },
      { old: '"完全撤退型"', new: '"完全に撤退する防御型"' },
      { old: '"出世街道型"', new: '"出世街道を進む野心型"' },
      { old: '"地位防衛型"', new: '"地位を防衛する保守型"' },
      { old: '"潜伏保護型"', new: '"潜伏して保護する慎重型"' },
      { old: '"家族依存型"', new: '"家族に依存する愛情型"' },
      { old: '"独立独歩型"', new: '"独立独歩で進む自立型"' },
      { old: '"孤高防衛型"', new: '"孤高を保つ防衛型"' },
      { old: '"耐久防衛型"', new: '"耐久的に防衛する堅固型"' },
      { old: '"自由推進型"', new: '"自由を推進する開放型"' },
      { old: '"脱出逃走型"', new: '"脱出して逃走する回避型"' },
      { old: '"破壊回復型"', new: '"破壊後に回復する再生型"' },
      { old: '"平和解決型"', new: '"平和的に解決する調和型"' },
      { old: '"内部調整型"', new: '"内部を調整する改善型"' },
      { old: '"増大発展型"', new: '"増大し発展する成長型"' },
      { old: '"集合統合型"', new: '"集合し統合する結集型"' },
      { old: '"収束集中型"', new: '"収束し集中する集約型"' },
      { old: '"洗練昇華型"', new: '"洗練し昇華する向上型"' },
      { old: '"硬化防壁型"', new: '"硬化した防壁を築く型"' },
      { old: '"分配共有型"', new: '"分配し共有する公平型"' },
      { old: '"革新改革型"', new: '"革新的に改革する変革型"' },
      { old: '"調理調和型"', new: '"調理し調和する創造型"' },
      { old: '"刺激活性型"', new: '"刺激し活性化する促進型"' },
      { old: '"安定堅固型"', new: '"安定した堅固な基盤型"' },
      { old: '"段階前進型"', new: '"段階的に前進する計画型"' },
      { old: '"早期結実型"', new: '"早期に結実する成果型"' },
      { old: '"充実完成型"', new: '"充実し完成する達成型"' },
      { old: '"旅路探索型"', new: '"旅路を探索する冒険型"' },
      { old: '"風通改善型"', new: '"風通しを改善する開放型"' },
      { old: '"分散拡散型"', new: '"分散し拡散する展開型"' },
      { old: '"制限節制型"', new: '"制限し節制する自制型"' },
      { old: '"信頼構築型"', new: '"信頼を構築する誠実型"' },
      { old: '"突出超越型"', new: '"突出し超越する卓越型"' },
      { old: '"完了終結型"', new: '"完了し終結する完成型"' },
      { old: '"継続未完型"', new: '"継続する未完の探求型"' },
      { old: '"役割分担型"', new: '"役割を分担する協力型"' },
      { old: '"成果達成型"', new: '"成果を達成する実現型"' },
      { old: '"時間待機型"', new: '"時間を待機する忍耐型"' },
      { old: '"関係構築型"', new: '"関係を構築する社交型"' },
      { old: '"調和維持型"', new: '"調和を維持する安定型"' },
      
      // 7-9文字の説明（追加修正）
      { old: '"雷の衝撃的な変革力"', new: '"雷のような衝撃的な変革力"' },
      { old: '"山の不動の安定感"', new: '"山のような不動の安定感"' },
      { old: '"風の浸透する影響力"', new: '"風のように浸透する影響力"' },
      { old: '"澤の豊かな喜び"', new: '"澤のような豊かな喜びの力"' },
      { old: '"美しく飾る美化者"', new: '"美しく飾る芸術的な美化者"' },
      { old: '"決断を下す実行者"', new: '"決断を下す強い意志の実行者"' },
      { old: '"周囲から支援を得やすい人徳"', new: '"周囲から支援を得やすい人徳の持ち主"' },
      { old: '"地と火が明夷する暗闇"', new: '"地と火が明夷する困難な暗闇"' },
      { old: '"風と澤が中孚する信頼"', new: '"風と澤が中孚する深い信頼"' }
    ];
    
    // 修正を適用
    let totalFixCount = 0;
    const appliedFixes = [];
    
    console.log('残りの短い説明文を一括修正中...\n');
    
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
        if (appliedFixes.length <= 20) {
          console.log(`✅ ${fix.old} → ${fix.new} (${matches.length}箇所)`);
        }
      }
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`\n=== 修正完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`修正項目数: ${appliedFixes.length}種類`);
    
    console.log('\n📝 修正済みファイル: ./public/js/data/hexagram-human-traits-v3.js');
    console.log(`📁 バックアップ: hexagram-human-traits-v3.backup.all-remaining.${timestamp}.js`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixAllRemainingShort();