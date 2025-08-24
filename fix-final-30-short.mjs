import { readFile, writeFile } from 'fs/promises';

async function fixFinal30Short() {
  try {
    console.log('=== 最後の30個の5文字以下の説明を修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // バックアップ作成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`./public/js/data/hexagram-human-traits-v3.backup.final30.${timestamp}.js`, content);
    console.log(`📁 バックアップ作成: hexagram-human-traits-v3.backup.final30.${timestamp}.js\n`);
    
    // 最後の30個の5文字説明を修正
    const fixes = [
      { old: '"自己消去型"', new: '"自己を消去する防御型"' },
      { old: '"逆転増幅型"', new: '"逆転して増幅する強化型"' },
      { old: '"断定指示型"', new: '"断定的に指示する指導型"' },
      { old: '"切断防衛型"', new: '"関係を切断して防衛する型"' },
      { old: '"集団防衛型"', new: '"集団で防衛する協力型"' },
      { old: '"育成支援型"', new: '"人材を育成し支援する型"' },
      { old: '"退行防衛型"', new: '"退行して防衛する保護型"' },
      { old: '"困難共有型"', new: '"困難を共有する連帯型"' },
      { old: '"安楽な環境"', new: '"安楽で快適な居心地の良い環境"' },
      { old: '"困難直面型"', new: '"困難に直面する挑戦型"' },
      { old: '"変革促進型"', new: '"変革を促進する革新型"' },
      { old: '"全面改革型"', new: '"全面的に改革する変革型"' },
      { old: '"創造逃避型"', new: '"創造的に逃避する防御型"' },
      { old: '"安定供給型"', new: '"安定的に供給する提供型"' },
      { old: '"完全停止型"', new: '"完全に停止する休止型"' },
      { old: '"段階後退型"', new: '"段階的に後退する慎重型"' },
      { old: '"関係依存型"', new: '"関係に依存する協調型"' },
      { old: '"蓄積防衛型"', new: '"蓄積して防衛する備蓄型"' },
      { old: '"自由交流型"', new: '"自由に交流する開放型"' },
      { old: '"逃走流浪型"', new: '"逃走して流浪する放浪型"' },
      { old: '"回避浸透型"', new: '"回避しながら浸透する型"' },
      { old: '"笑顔防御型"', new: '"笑顔で防御する柔和型"' },
      { old: '"緊張緩和型"', new: '"緊張を緩和する調整型"' },
      { old: '"厳格な環境"', new: '"厳格で規律の厳しい環境"' },
      { old: '"分散逃避型"', new: '"分散して逃避する回避型"' },
      { old: '"極端な環境"', new: '"極端に偏った不安定な環境"' },
      { old: '"制限防御型"', new: '"制限して防御する抑制型"' },
      { old: '"過剰確認型"', new: '"過剰に確認する慎重型"' },
      { old: '"完成固執型"', new: '"完成に固執する完璧型"' },
      { old: '"永続逃避型"', new: '"永続的に逃避する回避型"' }
    ];
    
    // 修正を適用
    let totalFixCount = 0;
    const appliedFixes = [];
    
    console.log('最後の5文字以下の説明を修正中...\n');
    
    for (const fix of fixes) {
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
    
    console.log('\n📝 修正済みファイル: ./public/js/data/hexagram-human-traits-v3.js');
    console.log(`📁 バックアップ: hexagram-human-traits-v3.backup.final30.${timestamp}.js`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixFinal30Short();