import { readFile, writeFile } from 'fs/promises';

async function fixFinalThree() {
  try {
    console.log('=== 最後の3件を一行一行丁寧に修正 ===\n');
    
    // データベース読み込み
    let content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // 最後の3件を修正
    const fixes = [
      { 
        old: '"影が薄いこともある"', 
        new: '"影が薄いこともあるが大切な役割"',
        hexagram: '巽為風',
        path: 'asInterfaceOS.relationshipTips.weakness'
      },
      { 
        old: '"資源を最適配分する"', 
        new: '"資源を最適配分して効率化する"',
        hexagram: '水澤節',
        path: 'asEngineOS.superMode.example'
      },
      { 
        old: '"確信を得て安心する"', 
        new: '"確信を得て安心して回復する"',
        hexagram: '雷山小過',
        path: 'asSafeModeOS.emergencyMode.recovery'
      }
    ];
    
    // 修正を一行ずつ適用
    let totalFixCount = 0;
    console.log('最後の3件を修正中...\n');
    
    for (const fix of fixes) {
      console.log(`処理中: ${fix.hexagram} - ${fix.path}`);
      const regex = new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, fix.new);
        totalFixCount += matches.length;
        console.log(`✅ [${fix.hexagram}] ${fix.old} → ${fix.new} (${matches.length}箇所)`);
        console.log(`   パス: ${fix.path}\n`);
      } else {
        console.log(`❌ [${fix.hexagram}] ${fix.old} - 見つかりませんでした`);
        console.log(`   パス: ${fix.path}\n`);
      }
    }
    
    // ファイル保存
    await writeFile('./public/js/data/hexagram-human-traits-v3.js', content);
    
    console.log(`=== 最終修正完了 ===`);
    console.log(`総修正件数: ${totalFixCount}件`);
    console.log(`\n最終検証: node comprehensive-v3-review.mjs`);
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

fixFinalThree();