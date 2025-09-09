import { readFile } from 'fs/promises';

async function checkV3FieldsUsage() {
  try {
    // mockファイルを読み込む
    const mockContent = await readFile('./results-dynamic-mockup.html', 'utf-8');
    
    // V3データベースファイルを読み込む
    const v3Content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // windowオブジェクトを模擬
    const window = {};
    eval(v3Content);
    
    const sampleHex = window.HexagramHumanTraitsV3["乾為天"];
    
    // 全てのフィールドパスを取得する関数
    function getAllFieldPaths(obj, parentPath = '') {
      let paths = [];
      for (const key in obj) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          paths = paths.concat(getAllFieldPaths(obj[key], currentPath));
        } else {
          paths.push(currentPath);
        }
      }
      return paths;
    }
    
    // V3データベースの全フィールドパスを取得
    const allFieldPaths = getAllFieldPaths(sampleHex);
    
    // mockで使用されているフィールドをチェック
    const usedFields = new Map();
    
    // チェック対象のフィールドパターン
    const checkPatterns = [
      // 基本情報
      { path: 'id', pattern: /hex\.id|hexData\.id/ },
      { path: 'symbol', pattern: /hex\.symbol|hexData\.symbol/ },
      { path: 'element', pattern: /hex\.element|hexData\.element/ },
      { path: 'nickname', pattern: /nickname["\]}\s]|hexData\.nickname|engineData\.nickname|interfaceData\.nickname|safeData\.nickname/ },
      { path: 'emoji', pattern: /emoji["\]}\s]|hexData\.emoji|engineData\.emoji|interfaceData\.emoji|safeData\.emoji/ },
      
      // asEngineOS
      { path: 'asEngineOS.profile.type', pattern: /asEngineOS\.profile\.type|engineData\.asEngineOS\.profile\.type/ },
      { path: 'asEngineOS.profile.description', pattern: /asEngineOS\.profile\.description|engineData\.asEngineOS\.profile\.description/ },
      { path: 'asEngineOS.profile.metaphor', pattern: /asEngineOS\.profile\.metaphor|engineData\.asEngineOS\.profile\.metaphor/ },
      
      { path: 'asEngineOS.normalState.whatHappens', pattern: /asEngineOS\.normalState\.whatHappens|engineData\.asEngineOS\.normalState\.whatHappens/ },
      { path: 'asEngineOS.normalState.example', pattern: /asEngineOS\.normalState\.example|engineData\.asEngineOS\.normalState\.example/ },
      { path: 'asEngineOS.normalState.energyLevel', pattern: /asEngineOS\.normalState\.energyLevel|engineData\.asEngineOS\.normalState\.energyLevel/ },
      
      { path: 'asEngineOS.superMode.when', pattern: /asEngineOS\.superMode\.when|engineData\.asEngineOS\.superMode\.when/ },
      { path: 'asEngineOS.superMode.whatHappens', pattern: /asEngineOS\.superMode\.whatHappens|engineData\.asEngineOS\.superMode\.whatHappens/ },
      { path: 'asEngineOS.superMode.example', pattern: /asEngineOS\.superMode\.example|engineData\.asEngineOS\.superMode\.example/ },
      { path: 'asEngineOS.superMode.energyLevel', pattern: /asEngineOS\.superMode\.energyLevel|engineData\.asEngineOS\.superMode\.energyLevel/ },
      
      { path: 'asEngineOS.restMode.whatHappens', pattern: /asEngineOS\.restMode\.whatHappens|engineData\.asEngineOS\.restMode\.whatHappens/ },
      { path: 'asEngineOS.restMode.howToRest', pattern: /asEngineOS\.restMode\.howToRest|engineData\.asEngineOS\.restMode\.howToRest/ },
      { path: 'asEngineOS.restMode.note', pattern: /asEngineOS\.restMode\.note|engineData\.asEngineOS\.restMode\.note/ },
      
      { path: 'asEngineOS.maintenance.whatYouNeed', pattern: /asEngineOS\.maintenance\.whatYouNeed|engineData\.asEngineOS\.maintenance\.whatYouNeed/ },
      { path: 'asEngineOS.maintenance.howToCharge', pattern: /asEngineOS\.maintenance\.howToCharge|engineData\.asEngineOS\.maintenance\.howToCharge/ },
      { path: 'asEngineOS.maintenance.warning', pattern: /asEngineOS\.maintenance\.warning|engineData\.asEngineOS\.maintenance\.warning/ },
      { path: 'asEngineOS.maintenance.tip', pattern: /asEngineOS\.maintenance\.tip|engineData\.asEngineOS\.maintenance\.tip/ },
      
      // asInterfaceOS
      { path: 'asInterfaceOS.profile.type', pattern: /asInterfaceOS\.profile\.type|interfaceData\.asInterfaceOS\.profile\.type/ },
      { path: 'asInterfaceOS.profile.description', pattern: /asInterfaceOS\.profile\.description|interfaceData\.asInterfaceOS\.profile\.description/ },
      { path: 'asInterfaceOS.profile.metaphor', pattern: /asInterfaceOS\.profile\.metaphor|interfaceData\.asInterfaceOS\.profile\.metaphor/ },
      
      { path: 'asInterfaceOS.howToTalk.style', pattern: /asInterfaceOS\.howToTalk\.style|interfaceData\.asInterfaceOS\.howToTalk\.style/ },
      { path: 'asInterfaceOS.howToTalk.example', pattern: /asInterfaceOS\.howToTalk\.example|interfaceData\.asInterfaceOS\.howToTalk\.example/ },
      { path: 'asInterfaceOS.howToTalk.goodAt', pattern: /asInterfaceOS\.howToTalk\.goodAt|interfaceData\.asInterfaceOS\.howToTalk\.goodAt/ },
      { path: 'asInterfaceOS.howToTalk.notGoodAt', pattern: /asInterfaceOS\.howToTalk\.notGoodAt|interfaceData\.asInterfaceOS\.howToTalk\.notGoodAt/ },
      
      { path: 'asInterfaceOS.bestEnvironment.where', pattern: /asInterfaceOS\.bestEnvironment\.where|interfaceData\.asInterfaceOS\.bestEnvironment\.where/ },
      { path: 'asInterfaceOS.bestEnvironment.example', pattern: /asInterfaceOS\.bestEnvironment\.example|interfaceData\.asInterfaceOS\.bestEnvironment\.example/ },
      { path: 'asInterfaceOS.bestEnvironment.withWho', pattern: /asInterfaceOS\.bestEnvironment\.withWho|interfaceData\.asInterfaceOS\.bestEnvironment\.withWho/ },
      { path: 'asInterfaceOS.bestEnvironment.avoid', pattern: /asInterfaceOS\.bestEnvironment\.avoid|interfaceData\.asInterfaceOS\.bestEnvironment\.avoid/ },
      
      { path: 'asInterfaceOS.relationshipTips.strength', pattern: /asInterfaceOS\.relationshipTips\.strength|interfaceData\.asInterfaceOS\.relationshipTips\.strength/ },
      { path: 'asInterfaceOS.relationshipTips.weakness', pattern: /asInterfaceOS\.relationshipTips\.weakness|interfaceData\.asInterfaceOS\.relationshipTips\.weakness/ },
      { path: 'asInterfaceOS.relationshipTips.advice', pattern: /asInterfaceOS\.relationshipTips\.advice|interfaceData\.asInterfaceOS\.relationshipTips\.advice/ },
      
      // asSafeModeOS
      { path: 'asSafeModeOS.profile.type', pattern: /asSafeModeOS\.profile\.type|safeData\.asSafeModeOS\.profile\.type/ },
      { path: 'asSafeModeOS.profile.description', pattern: /asSafeModeOS\.profile\.description|safeData\.asSafeModeOS\.profile\.description/ },
      { path: 'asSafeModeOS.profile.metaphor', pattern: /asSafeModeOS\.profile\.metaphor|safeData\.asSafeModeOS\.profile\.metaphor/ },
      
      { path: 'asSafeModeOS.stressResponse.whatYouDo', pattern: /asSafeModeOS\.stressResponse\.whatYouDo|safeData\.asSafeModeOS\.stressResponse\.whatYouDo/ },
      { path: 'asSafeModeOS.stressResponse.example', pattern: /asSafeModeOS\.stressResponse\.example|safeData\.asSafeModeOS\.stressResponse\.example/ },
      { path: 'asSafeModeOS.stressResponse.goodPoint', pattern: /asSafeModeOS\.stressResponse\.goodPoint|safeData\.asSafeModeOS\.stressResponse\.goodPoint/ },
      { path: 'asSafeModeOS.stressResponse.badPoint', pattern: /asSafeModeOS\.stressResponse\.badPoint|safeData\.asSafeModeOS\.stressResponse\.badPoint/ },
      
      { path: 'asSafeModeOS.emergencyMode.whatHappens', pattern: /asSafeModeOS\.emergencyMode\.whatHappens|safeData\.asSafeModeOS\.emergencyMode\.whatHappens/ },
      { path: 'asSafeModeOS.emergencyMode.example', pattern: /asSafeModeOS\.emergencyMode\.example|safeData\.asSafeModeOS\.emergencyMode\.example/ },
      { path: 'asSafeModeOS.emergencyMode.recovery', pattern: /asSafeModeOS\.emergencyMode\.recovery|safeData\.asSafeModeOS\.emergencyMode\.recovery/ },
      { path: 'asSafeModeOS.emergencyMode.timeToRecover', pattern: /asSafeModeOS\.emergencyMode\.timeToRecover|safeData\.asSafeModeOS\.emergencyMode\.timeToRecover/ },
      
      { path: 'asSafeModeOS.howToRecover.bestWay', pattern: /asSafeModeOS\.howToRecover\.bestWay|safeData\.asSafeModeOS\.howToRecover\.bestWay/ },
      { path: 'asSafeModeOS.howToRecover.example', pattern: /asSafeModeOS\.howToRecover\.example|safeData\.asSafeModeOS\.howToRecover\.example/ },
      { path: 'asSafeModeOS.howToRecover.environment', pattern: /asSafeModeOS\.howToRecover\.environment|safeData\.asSafeModeOS\.howToRecover\.environment/ },
      { path: 'asSafeModeOS.howToRecover.support', pattern: /asSafeModeOS\.howToRecover\.support|safeData\.asSafeModeOS\.howToRecover\.support/ },
      
      // osBalance
      { path: 'osBalance.idealBalance', pattern: /osBalance\.idealBalance/ },
      { path: 'osBalance.whenBalanced', pattern: /osBalance\.whenBalanced/ },
      { path: 'osBalance.whenImbalanced', pattern: /osBalance\.whenImbalanced/ },
      { path: 'osBalance.tip', pattern: /osBalance\.tip/ }
    ];
    
    // 各フィールドの使用状況をチェック
    checkPatterns.forEach(({ path, pattern }) => {
      const isUsed = pattern.test(mockContent);
      usedFields.set(path, isUsed);
    });
    
    console.log('=== V3データベース フィールド使用状況チェックリスト ===\n');
    
    // カテゴリー別に表示
    const categories = {
      '【基本情報】': ['id', 'symbol', 'element', 'nickname', 'emoji'],
      '【Engine OS - プロファイル】': [
        'asEngineOS.profile.type',
        'asEngineOS.profile.description', 
        'asEngineOS.profile.metaphor'
      ],
      '【Engine OS - 通常状態】': [
        'asEngineOS.normalState.whatHappens',
        'asEngineOS.normalState.example',
        'asEngineOS.normalState.energyLevel'
      ],
      '【Engine OS - スーパーモード】': [
        'asEngineOS.superMode.when',
        'asEngineOS.superMode.whatHappens',
        'asEngineOS.superMode.example',
        'asEngineOS.superMode.energyLevel'
      ],
      '【Engine OS - 休息モード】': [
        'asEngineOS.restMode.whatHappens',
        'asEngineOS.restMode.howToRest',
        'asEngineOS.restMode.note'
      ],
      '【Engine OS - メンテナンス】': [
        'asEngineOS.maintenance.whatYouNeed',
        'asEngineOS.maintenance.howToCharge',
        'asEngineOS.maintenance.warning',
        'asEngineOS.maintenance.tip'
      ],
      '【Interface OS - プロファイル】': [
        'asInterfaceOS.profile.type',
        'asInterfaceOS.profile.description',
        'asInterfaceOS.profile.metaphor'
      ],
      '【Interface OS - 話し方】': [
        'asInterfaceOS.howToTalk.style',
        'asInterfaceOS.howToTalk.example',
        'asInterfaceOS.howToTalk.goodAt',
        'asInterfaceOS.howToTalk.notGoodAt'
      ],
      '【Interface OS - 最適環境】': [
        'asInterfaceOS.bestEnvironment.where',
        'asInterfaceOS.bestEnvironment.example',
        'asInterfaceOS.bestEnvironment.withWho',
        'asInterfaceOS.bestEnvironment.avoid'
      ],
      '【Interface OS - 関係性のコツ】': [
        'asInterfaceOS.relationshipTips.strength',
        'asInterfaceOS.relationshipTips.weakness',
        'asInterfaceOS.relationshipTips.advice'
      ],
      '【SafeMode OS - プロファイル】': [
        'asSafeModeOS.profile.type',
        'asSafeModeOS.profile.description',
        'asSafeModeOS.profile.metaphor'
      ],
      '【SafeMode OS - ストレス対処】': [
        'asSafeModeOS.stressResponse.whatYouDo',
        'asSafeModeOS.stressResponse.example',
        'asSafeModeOS.stressResponse.goodPoint',
        'asSafeModeOS.stressResponse.badPoint'
      ],
      '【SafeMode OS - 緊急モード】': [
        'asSafeModeOS.emergencyMode.whatHappens',
        'asSafeModeOS.emergencyMode.example',
        'asSafeModeOS.emergencyMode.recovery',
        'asSafeModeOS.emergencyMode.timeToRecover'
      ],
      '【SafeMode OS - 回復方法】': [
        'asSafeModeOS.howToRecover.bestWay',
        'asSafeModeOS.howToRecover.example',
        'asSafeModeOS.howToRecover.environment',
        'asSafeModeOS.howToRecover.support'
      ],
      '【OSバランス】': [
        'osBalance.idealBalance',
        'osBalance.whenBalanced',
        'osBalance.whenImbalanced',
        'osBalance.tip'
      ]
    };
    
    Object.entries(categories).forEach(([categoryName, fields]) => {
      console.log(categoryName);
      fields.forEach(field => {
        const isUsed = usedFields.get(field);
        const status = isUsed ? '✅' : '❌';
        console.log(`  ${status} ${field}`);
      });
      console.log('');
    });
    
    // 統計
    const totalFields = checkPatterns.length;
    const usedCount = Array.from(usedFields.values()).filter(v => v).length;
    const unusedCount = totalFields - usedCount;
    
    console.log('=== 統計サマリー ===');
    console.log(`✅ 使用中: ${usedCount}/${totalFields} (${Math.round(usedCount/totalFields*100)}%)`);
    console.log(`❌ 未使用: ${unusedCount}/${totalFields} (${Math.round(unusedCount/totalFields*100)}%)`);
    
    // 未使用フィールドのリスト
    console.log('\n【未使用フィールド一覧】');
    checkPatterns.forEach(({ path }) => {
      if (!usedFields.get(path)) {
        console.log(`  - ${path}`);
      }
    });
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

checkV3FieldsUsage();