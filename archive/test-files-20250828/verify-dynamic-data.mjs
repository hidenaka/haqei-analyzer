/**
 * V3データベースから動的にデータを取得しているか検証
 * 複数の異なる卦の組み合わせでテストし、固定文ではないことを確認
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// テスト用の複数の卦の組み合わせ
const testCombinations = [
    {
        name: "組み合わせ1: 乾・兌・坤",
        engineOS: { hexagramName: '乾為天', score: 75 },
        interfaceOS: { hexagramName: '兌為澤', score: 68 },
        safeModeOS: { hexagramName: '坤為地', score: 82 }
    },
    {
        name: "組み合わせ2: 震・巽・坎",
        engineOS: { hexagramName: '震為雷', score: 70 },
        interfaceOS: { hexagramName: '巽為風', score: 65 },
        safeModeOS: { hexagramName: '坎為水', score: 78 }
    },
    {
        name: "組み合わせ3: 艮・離・天地否",
        engineOS: { hexagramName: '艮為山', score: 62 },
        interfaceOS: { hexagramName: '離為火', score: 85 },
        safeModeOS: { hexagramName: '天地否', score: 71 }
    },
    {
        name: "組み合わせ4: 地天泰・水火既済・火水未済",
        engineOS: { hexagramName: '地天泰', score: 88 },
        interfaceOS: { hexagramName: '水火既済', score: 77 },
        safeModeOS: { hexagramName: '火水未済', score: 66 }
    },
    {
        name: "組み合わせ5: 山水蒙・水山蹇・澤山咸",
        engineOS: { hexagramName: '山水蒙', score: 55 },
        interfaceOS: { hexagramName: '水山蹇', score: 60 },
        safeModeOS: { hexagramName: '澤山咸', score: 90 }
    }
];

async function verifyDynamicData() {
    console.log('🔍 V3データベース動的データ取得検証開始');
    console.log('=====================================\n');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        const resultsPath = join(__dirname, 'public', 'results.html');
        await page.goto(`file://${resultsPath}`);
        await page.waitForTimeout(2000);
        
        // 全テスト結果を格納
        const allResults = [];
        
        for (const testData of testCombinations) {
            console.log(`\n📊 ${testData.name}`);
            console.log('-'.repeat(50));
            
            // SummaryGeneratorで各組み合わせをテスト
            const result = await page.evaluate((data) => {
                if (typeof window.SummaryGenerator === 'undefined') {
                    return { error: 'SummaryGeneratorが見つかりません' };
                }
                
                const generator = new window.SummaryGenerator();
                
                // 4行要約を生成
                const fourLine = generator.generateFourLineSummary(data);
                
                // 各OSのプロファイルを取得
                const engineProfile = generator.getOSProfile(data.engineOS.hexagramName, 'engineOS');
                const interfaceProfile = generator.getOSProfile(data.interfaceOS.hexagramName, 'interfaceOS');
                const safeModeProfile = generator.getOSProfile(data.safeModeOS.hexagramName, 'safeModeOS');
                
                // V3データベースから直接データを取得
                const v3Direct = {
                    engine: window.HexagramHumanTraitsV3[data.engineOS.hexagramName]?.asEngineOS,
                    interface: window.HexagramHumanTraitsV3[data.interfaceOS.hexagramName]?.asInterfaceOS,
                    safeMode: window.HexagramHumanTraitsV3[data.safeModeOS.hexagramName]?.asSafeModeOS
                };
                
                return {
                    fourLineSummary: {
                        line1: fourLine.line1,
                        line2: fourLine.line2,
                        line3: fourLine.line3,
                        line4: fourLine.line4
                    },
                    profiles: {
                        engine: engineProfile?.type || 'なし',
                        interface: interfaceProfile?.type || 'なし',
                        safeMode: safeModeProfile?.type || 'なし'
                    },
                    v3Data: {
                        engine: v3Direct.engine?.profile?.type || 'データなし',
                        interface: v3Direct.interface?.profile?.type || 'データなし',
                        safeMode: v3Direct.safeMode?.profile?.type || 'データなし'
                    },
                    descriptions: {
                        engine: engineProfile?.description?.substring(0, 50) || 'なし',
                        interface: interfaceProfile?.description?.substring(0, 50) || 'なし',
                        safeMode: safeModeProfile?.description?.substring(0, 50) || 'なし'
                    }
                };
            }, testData);
            
            // 結果を表示
            console.log('\n📝 4行要約:');
            console.log(`  行1: ${result.fourLineSummary.line1?.substring(0, 60)}...`);
            console.log(`  行2: ${result.fourLineSummary.line2?.substring(0, 60)}...`);
            console.log(`  行3: ${result.fourLineSummary.line3?.substring(0, 60)}...`);
            console.log(`  行4: ${result.fourLineSummary.line4?.substring(0, 60)}...`);
            
            console.log('\n🎯 プロファイルタイプ:');
            console.log(`  Engine OS (${testData.engineOS.hexagramName}): ${result.profiles.engine}`);
            console.log(`  Interface OS (${testData.interfaceOS.hexagramName}): ${result.profiles.interface}`);
            console.log(`  SafeMode OS (${testData.safeModeOS.hexagramName}): ${result.profiles.safeMode}`);
            
            console.log('\n✅ V3データベース直接取得:');
            console.log(`  Engine: ${result.v3Data.engine}`);
            console.log(`  Interface: ${result.v3Data.interface}`);
            console.log(`  SafeMode: ${result.v3Data.safeMode}`);
            
            // 結果を保存
            allResults.push({
                combination: testData.name,
                profiles: result.profiles,
                v3Data: result.v3Data,
                line1: result.fourLineSummary.line1
            });
        }
        
        // 📊 重複チェック
        console.log('\n\n📊 ========== 重複チェック結果 ==========');
        console.log('各組み合わせで異なるデータが生成されているか確認:\n');
        
        // Line1の重複チェック
        const line1Set = new Set(allResults.map(r => r.line1));
        const line1Unique = line1Set.size === allResults.length;
        console.log(`✅ 4行要約Line1の多様性: ${line1Set.size}/${allResults.length} 種類`);
        console.log(`   ${line1Unique ? '✅ 全て異なる内容' : '⚠️ 重複あり'}`);
        
        // プロファイルの重複チェック
        const engineProfiles = allResults.map(r => r.profiles.engine);
        const engineSet = new Set(engineProfiles);
        console.log(`\n✅ Engine OSプロファイル多様性: ${engineSet.size} 種類`);
        console.log(`   種類: ${Array.from(engineSet).join(', ')}`);
        
        const interfaceProfiles = allResults.map(r => r.profiles.interface);
        const interfaceSet = new Set(interfaceProfiles);
        console.log(`\n✅ Interface OSプロファイル多様性: ${interfaceSet.size} 種類`);
        console.log(`   種類: ${Array.from(interfaceSet).join(', ')}`);
        
        const safeModeProfiles = allResults.map(r => r.profiles.safeMode);
        const safeModeSet = new Set(safeModeProfiles);
        console.log(`\n✅ SafeMode OSプロファイル多様性: ${safeModeSet.size} 種類`);
        console.log(`   種類: ${Array.from(safeModeSet).join(', ')}`);
        
        // V3データベースとの一致確認
        console.log('\n\n🔍 ========== V3データベース整合性 ==========');
        let matchCount = 0;
        let totalChecks = 0;
        
        for (const result of allResults) {
            if (result.profiles.engine === result.v3Data.engine) matchCount++;
            if (result.profiles.interface === result.v3Data.interface) matchCount++;
            if (result.profiles.safeMode === result.v3Data.safeMode) matchCount++;
            totalChecks += 3;
        }
        
        const matchRate = Math.round((matchCount / totalChecks) * 100);
        console.log(`✅ プロファイルとV3データベースの一致率: ${matchRate}%`);
        console.log(`   ${matchCount}/${totalChecks} 項目が一致`);
        
        // 最終評価
        console.log('\n\n🎯 ========== 最終評価 ==========');
        
        if (matchRate === 100 && line1Unique) {
            console.log('🌟 優秀: データベースから完全に動的にデータを取得しています！');
            console.log('   - 全ての組み合わせで異なる要約を生成');
            console.log('   - V3データベースとの完全な整合性');
            console.log('   - 固定文ではなく、実際のデータベースを使用');
        } else if (matchRate >= 80) {
            console.log('✅ 良好: データベースから概ね動的にデータを取得しています');
            console.log(`   - 整合性: ${matchRate}%`);
            console.log(`   - 改善点: 一部のデータ取得に問題がある可能性`);
        } else {
            console.log('⚠️ 要改善: データベース接続に問題があります');
            console.log(`   - 整合性: ${matchRate}%`);
            console.log('   - 固定文を使用している可能性があります');
        }
        
        // 特定の卦のデータを詳細確認
        console.log('\n\n📋 ========== サンプル詳細データ ==========');
        const sampleCheck = await page.evaluate(() => {
            const hexagram = '震為雷';
            const data = window.HexagramHumanTraitsV3[hexagram];
            
            if (!data) return { error: `${hexagram}のデータが見つかりません` };
            
            return {
                hexagram: hexagram,
                engineOS: {
                    type: data.asEngineOS?.profile?.type,
                    description: data.asEngineOS?.profile?.description?.substring(0, 100),
                    normalState: data.asEngineOS?.normalState?.whatHappens?.substring(0, 100)
                },
                interfaceOS: {
                    type: data.asInterfaceOS?.profile?.type,
                    style: data.asInterfaceOS?.howToTalk?.style?.substring(0, 100),
                    environment: data.asInterfaceOS?.bestEnvironment?.where
                },
                safeModeOS: {
                    type: data.asSafeModeOS?.profile?.type,
                    stressResponse: data.asSafeModeOS?.stressResponse?.whatYouDo?.substring(0, 100),
                    recovery: data.asSafeModeOS?.howToRecover?.bestWay?.substring(0, 100)
                }
            };
        });
        
        console.log(`\n${sampleCheck.hexagram}の詳細データ:`);
        console.log('\nEngine OS:');
        console.log(`  タイプ: ${sampleCheck.engineOS.type}`);
        console.log(`  説明: ${sampleCheck.engineOS.description}...`);
        console.log(`  通常状態: ${sampleCheck.engineOS.normalState}...`);
        
        console.log('\nInterface OS:');
        console.log(`  タイプ: ${sampleCheck.interfaceOS.type}`);
        console.log(`  話し方: ${sampleCheck.interfaceOS.style}...`);
        console.log(`  環境: ${sampleCheck.interfaceOS.environment}`);
        
        console.log('\nSafeMode OS:');
        console.log(`  タイプ: ${sampleCheck.safeModeOS.type}`);
        console.log(`  ストレス反応: ${sampleCheck.safeModeOS.stressResponse}...`);
        console.log(`  回復方法: ${sampleCheck.safeModeOS.recovery}...`);
        
    } catch (error) {
        console.error('💥 テスト実行エラー:', error.message);
    } finally {
        await browser.close();
        console.log('\n\n🔚 V3データベース動的データ取得検証完了');
    }
}

// テスト実行
verifyDynamicData().catch(console.error);