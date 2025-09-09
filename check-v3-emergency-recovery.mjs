import { readFile } from 'fs/promises';

async function checkEmergencyAndRecovery() {
  try {
    // V3データベースファイルを読み込む
    const fileContent = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // windowオブジェクトとエクスポートを模擬
    const window = {};
    const module = { exports: {} };
    const exports = module.exports;
    
    // ファイル内容を評価してデータを取得
    eval(fileContent);
    
    const hexagramTraitsV3 = window.HexagramHumanTraitsV3 || module.exports.HexagramHumanTraitsV3;
    
    if (!hexagramTraitsV3) {
      console.error('hexagramTraitsV3が見つかりません');
      return;
    }
    
    console.log('=== V3データベース emergencyMode と howToRecover 検査 ===\n');
    
    const hexagrams = Object.keys(hexagramTraitsV3);
    console.log(`総卦数: ${hexagrams.length}\n`);
    
    let hasEmergencyCount = 0;
    let hasRecoveryCount = 0;
    let missingEmergency = [];
    let missingRecovery = [];
    
    hexagrams.forEach((hexName, index) => {
      const hex = hexagramTraitsV3[hexName];
      const hasEmergency = !!hex.asSafeModeOS?.emergencyMode;
      const hasRecovery = !!hex.asSafeModeOS?.howToRecover;
      
      console.log(`${index + 1}. ${hexName} (${hex.nickname}):`);
      console.log(`   - emergencyMode: ${hasEmergency ? '✅' : '❌'}`);
      console.log(`   - howToRecover: ${hasRecovery ? '✅' : '❌'}`);
      
      if (hasEmergency) {
        hasEmergencyCount++;
        // emergencyModeの内容も確認
        const em = hex.asSafeModeOS.emergencyMode;
        const emFields = Object.keys(em);
        console.log(`     emergencyMode fields: ${emFields.join(', ')}`);
      } else {
        missingEmergency.push(hexName);
      }
      
      if (hasRecovery) {
        hasRecoveryCount++;
        // howToRecoverの内容も確認
        const hr = hex.asSafeModeOS.howToRecover;
        const hrFields = Object.keys(hr);
        console.log(`     howToRecover fields: ${hrFields.join(', ')}`);
      } else {
        missingRecovery.push(hexName);
      }
      
      console.log('');
    });
    
    console.log('\n=== 集計結果 ===');
    console.log(`emergencyMode を持つ卦: ${hasEmergencyCount}/${hexagrams.length}`);
    console.log(`howToRecover を持つ卦: ${hasRecoveryCount}/${hexagrams.length}`);
    
    if (missingEmergency.length > 0) {
      console.log(`\n❌ emergencyMode が欠落している卦 (${missingEmergency.length}個):`);
      missingEmergency.forEach(name => console.log(`   - ${name}`));
    }
    
    if (missingRecovery.length > 0) {
      console.log(`\n❌ howToRecover が欠落している卦 (${missingRecovery.length}個):`);
      missingRecovery.forEach(name => console.log(`   - ${name}`));
    }
    
    if (hasEmergencyCount === hexagrams.length && hasRecoveryCount === hexagrams.length) {
      console.log('\n✅ 全ての卦にemergencyModeとhowToRecoverが存在します！');
    }
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkEmergencyAndRecovery();