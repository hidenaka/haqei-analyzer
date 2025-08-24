import { readFile } from 'fs/promises';

async function checkMockMissingFields() {
  try {
    // V3データベースファイルを読み込む
    const v3Content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // windowオブジェクトを模擬
    const window = {};
    eval(v3Content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    // mockで使用している6つの卦
    const mockHexagrams = ["乾為天", "坤為地", "水雷屯", "山水蒙", "水天需", "兌為澤"];
    
    console.log('=== Mock定義済み卦のV3データ完全性チェック ===\n');
    
    mockHexagrams.forEach(hexName => {
      const hex = v3Data[hexName];
      console.log(`\n【${hexName}（${hex.nickname}）】`);
      console.log('=====================================');
      
      // 基本情報
      console.log('\n基本情報:');
      console.log(`  id: ${hex.id}`);
      console.log(`  symbol: ${hex.symbol}`);
      console.log(`  element: ${hex.element}`);
      console.log(`  emoji: ${hex.emoji}`);
      
      // Engine OS
      if (hex.asEngineOS) {
        console.log('\n🚀 Engine OS:');
        console.log('  Profile:');
        console.log(`    - type: ${hex.asEngineOS.profile?.type || '❌ なし'}`);
        console.log(`    - description: ${hex.asEngineOS.profile?.description ? '✅' : '❌'}`);
        console.log(`    - metaphor: ${hex.asEngineOS.profile?.metaphor || '❌ なし'}`);
        
        console.log('  Normal State:');
        console.log(`    - whatHappens: ${hex.asEngineOS.normalState?.whatHappens ? '✅' : '❌'}`);
        console.log(`    - example: ${hex.asEngineOS.normalState?.example ? '✅' : '❌'}`);
        console.log(`    - energyLevel: ${hex.asEngineOS.normalState?.energyLevel || '❌'}`);
        
        console.log('  Super Mode:');
        console.log(`    - when: ${hex.asEngineOS.superMode?.when ? '✅' : '❌'}`);
        console.log(`    - whatHappens: ${hex.asEngineOS.superMode?.whatHappens ? '✅' : '❌'}`);
        console.log(`    - example: ${hex.asEngineOS.superMode?.example || '❌ なし'}`);
        console.log(`    - energyLevel: ${hex.asEngineOS.superMode?.energyLevel || '❌ なし'}`);
        
        console.log('  Rest Mode:');
        console.log(`    - whatHappens: ${hex.asEngineOS.restMode?.whatHappens || '❌ なし'}`);
        console.log(`    - howToRest: ${hex.asEngineOS.restMode?.howToRest || '❌ なし'}`);
        console.log(`    - note: ${hex.asEngineOS.restMode?.note || '❌ なし'}`);
        
        console.log('  Maintenance:');
        console.log(`    - whatYouNeed: ${hex.asEngineOS.maintenance?.whatYouNeed || '❌ なし'}`);
        console.log(`    - howToCharge: ${hex.asEngineOS.maintenance?.howToCharge || '❌ なし'}`);
        console.log(`    - warning: ${hex.asEngineOS.maintenance?.warning ? '✅' : '❌'}`);
        console.log(`    - tip: ${hex.asEngineOS.maintenance?.tip ? '✅' : '❌'}`);
      }
      
      // Interface OS
      if (hex.asInterfaceOS) {
        console.log('\n🔗 Interface OS:');
        console.log('  Profile:');
        console.log(`    - type: ${hex.asInterfaceOS.profile?.type || '❌ なし'}`);
        console.log(`    - description: ${hex.asInterfaceOS.profile?.description ? '✅' : '❌'}`);
        console.log(`    - metaphor: ${hex.asInterfaceOS.profile?.metaphor || '❌ なし'}`);
        
        console.log('  How to Talk:');
        console.log(`    - style: ${hex.asInterfaceOS.howToTalk?.style ? '✅' : '❌'}`);
        console.log(`    - example: ${hex.asInterfaceOS.howToTalk?.example ? '✅' : '❌'}`);
        console.log(`    - goodAt: ${hex.asInterfaceOS.howToTalk?.goodAt ? '✅' : '❌'}`);
        console.log(`    - notGoodAt: ${hex.asInterfaceOS.howToTalk?.notGoodAt || '❌ なし'}`);
        
        console.log('  Best Environment:');
        console.log(`    - where: ${hex.asInterfaceOS.bestEnvironment?.where || '❌ なし'}`);
        console.log(`    - example: ${hex.asInterfaceOS.bestEnvironment?.example || '❌ なし'}`);
        console.log(`    - withWho: ${hex.asInterfaceOS.bestEnvironment?.withWho || '❌ なし'}`);
        console.log(`    - avoid: ${hex.asInterfaceOS.bestEnvironment?.avoid || '❌ なし'}`);
        
        console.log('  Relationship Tips:');
        console.log(`    - strength: ${hex.asInterfaceOS.relationshipTips?.strength || '❌ なし'}`);
        console.log(`    - weakness: ${hex.asInterfaceOS.relationshipTips?.weakness || '❌ なし'}`);
        console.log(`    - advice: ${hex.asInterfaceOS.relationshipTips?.advice || '❌ なし'}`);
      }
      
      // SafeMode OS
      if (hex.asSafeModeOS) {
        console.log('\n🛡️ SafeMode OS:');
        console.log('  Profile:');
        console.log(`    - type: ${hex.asSafeModeOS.profile?.type || '❌ なし'}`);
        console.log(`    - description: ${hex.asSafeModeOS.profile?.description ? '✅' : '❌'}`);
        console.log(`    - metaphor: ${hex.asSafeModeOS.profile?.metaphor || '❌ なし'}`);
        
        console.log('  Stress Response:');
        console.log(`    - whatYouDo: ${hex.asSafeModeOS.stressResponse?.whatYouDo ? '✅' : '❌'}`);
        console.log(`    - example: ${hex.asSafeModeOS.stressResponse?.example ? '✅' : '❌'}`);
        console.log(`    - goodPoint: ${hex.asSafeModeOS.stressResponse?.goodPoint ? '✅' : '❌'}`);
        console.log(`    - badPoint: ${hex.asSafeModeOS.stressResponse?.badPoint ? '✅' : '❌'}`);
        
        console.log('  Emergency Mode:');
        console.log(`    - whatHappens: ${hex.asSafeModeOS.emergencyMode?.whatHappens ? '✅' : '❌'}`);
        console.log(`    - example: ${hex.asSafeModeOS.emergencyMode?.example ? '✅' : '❌'}`);
        console.log(`    - recovery: ${hex.asSafeModeOS.emergencyMode?.recovery ? '✅' : '❌'}`);
        console.log(`    - timeToRecover: ${hex.asSafeModeOS.emergencyMode?.timeToRecover ? '✅' : '❌'}`);
        
        console.log('  How to Recover:');
        console.log(`    - bestWay: ${hex.asSafeModeOS.howToRecover?.bestWay ? '✅' : '❌'}`);
        console.log(`    - example: ${hex.asSafeModeOS.howToRecover?.example ? '✅' : '❌'}`);
        console.log(`    - environment: ${hex.asSafeModeOS.howToRecover?.environment ? '✅' : '❌'}`);
        console.log(`    - support: ${hex.asSafeModeOS.howToRecover?.support ? '✅' : '❌'}`);
      }
      
      // OS Balance
      console.log('\n⚖️ OS Balance:');
      console.log(`  - idealBalance: ${hex.osBalance?.idealBalance || '❌ なし'}`);
      console.log(`  - whenBalanced: ${hex.osBalance?.whenBalanced || '❌ なし'}`);
      console.log(`  - whenImbalanced: ${hex.osBalance?.whenImbalanced || '❌ なし'}`);
      console.log(`  - tip: ${hex.osBalance?.tip || '❌ なし'}`);
    });
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkMockMissingFields();