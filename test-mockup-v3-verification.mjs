import puppeteer from 'puppeteer';

async function testMockupV3Verification() {
  console.log('=== V3データベースを使用したモックアップの動作確認 ===\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // コンソールメッセージを取得
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // エラーを検出
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.toString());
    });
    
    console.log('📄 モックアップページを読み込み中...');
    const filePath = `file://${process.cwd()}/results-dynamic-mockup-v3-refined.html`;
    await page.goto(filePath, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // V3データベースが読み込まれているか確認
    const v3DataLoaded = await page.evaluate(() => {
      return typeof window.HexagramHumanTraitsV3 !== 'undefined';
    });
    
    if (!v3DataLoaded) {
      console.error('❌ V3データベースが読み込まれていません');
      return;
    }
    
    console.log('✅ V3データベースが正しく読み込まれました\n');
    
    // サンプルデータで各OSのデータを取得テスト
    const testResults = await page.evaluate(() => {
      const results = {
        dataAvailable: false,
        engineOS: null,
        interfaceOS: null,
        safeModeOS: null,
        errors: []
      };
      
      try {
        // データベースが存在するか
        if (typeof window.HexagramHumanTraitsV3 === 'undefined') {
          results.errors.push('HexagramHumanTraitsV3が未定義');
          return results;
        }
        
        results.dataAvailable = true;
        
        // サンプル卦名でデータ取得
        const testHexagrams = {
          engine: '乾為天',
          interface: '坤為地',
          safeMode: '水雷屯'
        };
        
        // Engine OSデータ
        const engineData = window.HexagramHumanTraitsV3[testHexagrams.engine];
        if (engineData) {
          results.engineOS = {
            hexagram: testHexagrams.engine,
            nickname: engineData.nickname,
            hasEngineData: !!engineData.asEngineOS,
            persona: engineData.asEngineOS?.persona,
            type: engineData.asEngineOS?.type,
            descriptionLength: engineData.asEngineOS?.description?.length || 0,
            shortDescriptionLength: engineData.asEngineOS?.shortDescription?.length || 0
          };
        }
        
        // Interface OSデータ
        const interfaceData = window.HexagramHumanTraitsV3[testHexagrams.interface];
        if (interfaceData) {
          results.interfaceOS = {
            hexagram: testHexagrams.interface,
            nickname: interfaceData.nickname,
            hasInterfaceData: !!interfaceData.asInterfaceOS,
            persona: interfaceData.asInterfaceOS?.persona,
            type: interfaceData.asInterfaceOS?.type,
            descriptionLength: interfaceData.asInterfaceOS?.description?.length || 0,
            shortDescriptionLength: interfaceData.asInterfaceOS?.shortDescription?.length || 0
          };
        }
        
        // SafeMode OSデータ
        const safeData = window.HexagramHumanTraitsV3[testHexagrams.safeMode];
        if (safeData) {
          results.safeModeOS = {
            hexagram: testHexagrams.safeMode,
            nickname: safeData.nickname,
            hasSafeData: !!safeData.asSafeModeOS,
            strategy: safeData.asSafeModeOS?.strategy,
            type: safeData.asSafeModeOS?.type,
            descriptionLength: safeData.asSafeModeOS?.description?.length || 0,
            shortDescriptionLength: safeData.asSafeModeOS?.shortDescription?.length || 0
          };
        }
        
        // 64卦すべて存在するか確認
        const allHexagrams = Object.keys(window.HexagramHumanTraitsV3);
        results.totalHexagrams = allHexagrams.length;
        
        // 短い説明文（10文字未満）を検出
        let shortDescriptions = [];
        allHexagrams.forEach(hex => {
          const data = window.HexagramHumanTraitsV3[hex];
          
          // Engine OS
          if (data.asEngineOS?.shortDescription && data.asEngineOS.shortDescription.length < 10) {
            shortDescriptions.push({
              hexagram: hex,
              os: 'Engine',
              text: data.asEngineOS.shortDescription,
              length: data.asEngineOS.shortDescription.length
            });
          }
          
          // Interface OS
          if (data.asInterfaceOS?.shortDescription && data.asInterfaceOS.shortDescription.length < 10) {
            shortDescriptions.push({
              hexagram: hex,
              os: 'Interface',
              text: data.asInterfaceOS.shortDescription,
              length: data.asInterfaceOS.shortDescription.length
            });
          }
          
          // SafeMode OS
          if (data.asSafeModeOS?.shortDescription && data.asSafeModeOS.shortDescription.length < 10) {
            shortDescriptions.push({
              hexagram: hex,
              os: 'SafeMode',
              text: data.asSafeModeOS.shortDescription,
              length: data.asSafeModeOS.shortDescription.length
            });
          }
        });
        
        results.shortDescriptions = shortDescriptions;
        
      } catch (error) {
        results.errors.push(error.toString());
      }
      
      return results;
    });
    
    // 結果表示
    console.log('【V3データベース接続テスト結果】');
    console.log('データベース利用可能:', testResults.dataAvailable ? '✅' : '❌');
    console.log('総卦数:', testResults.totalHexagrams, '/ 64\n');
    
    if (testResults.engineOS) {
      console.log('【Engine OS - 乾為天】');
      console.log('  ニックネーム:', testResults.engineOS.nickname);
      console.log('  データ存在:', testResults.engineOS.hasEngineData ? '✅' : '❌');
      console.log('  ペルソナ:', testResults.engineOS.persona);
      console.log('  タイプ:', testResults.engineOS.type);
      console.log('  説明文文字数:', testResults.engineOS.descriptionLength);
      console.log('  短い説明文字数:', testResults.engineOS.shortDescriptionLength);
    }
    
    if (testResults.interfaceOS) {
      console.log('\n【Interface OS - 坤為地】');
      console.log('  ニックネーム:', testResults.interfaceOS.nickname);
      console.log('  データ存在:', testResults.interfaceOS.hasInterfaceData ? '✅' : '❌');
      console.log('  ペルソナ:', testResults.interfaceOS.persona);
      console.log('  タイプ:', testResults.interfaceOS.type);
      console.log('  説明文文字数:', testResults.interfaceOS.descriptionLength);
      console.log('  短い説明文字数:', testResults.interfaceOS.shortDescriptionLength);
    }
    
    if (testResults.safeModeOS) {
      console.log('\n【SafeMode OS - 水雷屯】');
      console.log('  ニックネーム:', testResults.safeModeOS.nickname);
      console.log('  データ存在:', testResults.safeModeOS.hasSafeData ? '✅' : '❌');
      console.log('  ストラテジー:', testResults.safeModeOS.strategy);
      console.log('  タイプ:', testResults.safeModeOS.type);
      console.log('  説明文文字数:', testResults.safeModeOS.descriptionLength);
      console.log('  短い説明文字数:', testResults.safeModeOS.shortDescriptionLength);
    }
    
    // 10文字未満の説明文チェック
    console.log('\n【短い説明文チェック（10文字未満）】');
    if (testResults.shortDescriptions && testResults.shortDescriptions.length > 0) {
      console.log(`⚠️ ${testResults.shortDescriptions.length}個の短い説明文が見つかりました:`);
      testResults.shortDescriptions.slice(0, 5).forEach(item => {
        console.log(`  ${item.hexagram} (${item.os}): "${item.text}" (${item.length}文字)`);
      });
      if (testResults.shortDescriptions.length > 5) {
        console.log(`  ... 他 ${testResults.shortDescriptions.length - 5}個`);
      }
    } else {
      console.log('✅ すべての説明文が10文字以上です');
    }
    
    // エラーチェック
    if (errors.length > 0) {
      console.log('\n⚠️ ページエラー:', errors);
    }
    
    if (testResults.errors.length > 0) {
      console.log('\n⚠️ 実行エラー:', testResults.errors);
    }
    
    // 総合判定
    console.log('\n【総合判定】');
    const isSuccess = 
      testResults.dataAvailable && 
      testResults.totalHexagrams === 64 &&
      testResults.engineOS?.hasEngineData &&
      testResults.interfaceOS?.hasInterfaceData &&
      testResults.safeModeOS?.hasSafeData &&
      (!testResults.shortDescriptions || testResults.shortDescriptions.length === 0) &&
      errors.length === 0;
    
    if (isSuccess) {
      console.log('✅ モックアップは正常にV3データベースからデータを取得できています');
      console.log('✅ すべての説明文が10文字以上に改善されています');
    } else {
      console.log('⚠️ 一部問題が検出されました。上記の詳細を確認してください。');
    }
    
  } catch (error) {
    console.error('テストエラー:', error);
  } finally {
    await browser.close();
  }
}

// 実行
testMockupV3Verification().catch(console.error);