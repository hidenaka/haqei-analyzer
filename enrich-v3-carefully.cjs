#!/usr/bin/env node

/**
 * 各卦の既存データを丁寧に読み取り、それに基づいた新規フィールドを追加
 */

const fs = require('fs');
const path = require('path');

// V3データベースファイルを読み込み
const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
let fileContent = fs.readFileSync(v3FilePath, 'utf-8');

// V3データをパースして取得
function parseV3Data() {
    const hexagrams = {};
    
    // 各卦のデータを抽出
    const hexagramPattern = /"([^"]+)": \{[\s\S]*?"id": (\d+),[\s\S]*?"asEngineOS": \{[\s\S]*?"profile": \{[\s\S]*?"type": "([^"]+)",[\s\S]*?"description": "([^"]+)",[\s\S]*?"metaphor": "([^"]+)"[\s\S]*?\},[\s\S]*?"normalState": \{[\s\S]*?"whatHappens": "([^"]+)",[\s\S]*?"example": "([^"]+)",[\s\S]*?"energyLevel": "([^"]+)"[\s\S]*?\},[\s\S]*?"superMode": \{[\s\S]*?"when": "([^"]+)",[\s\S]*?"whatHappens": "([^"]+)",[\s\S]*?"example": "([^"]+)",[\s\S]*?"energyLevel": "([^"]+)"[\s\S]*?\},[\s\S]*?"restMode": \{[\s\S]*?"whatHappens": "([^"]+)",[\s\S]*?"howToRest": "([^"]+)",[\s\S]*?"note": "([^"]+)"[\s\S]*?\},[\s\S]*?"maintenance": \{[\s\S]*?"whatYouNeed": "([^"]+)",[\s\S]*?"howToCharge": "([^"]+)",[\s\S]*?"warning": "([^"]+)",[\s\S]*?"tip": "([^"]+)"[\s\S]*?\}/g;
    
    // 簡易的な方法: 各卦のセクションを個別に取得
    const hexagramNames = [
        '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
        '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有',
        '地山謙', '雷地豫', '澤雷随', '山風蠱', '地澤臨', '風地観',
        '火雷噬嗑', '山火賁', '山地剝', '地雷復', '天雷无妄', '山天大畜',
        '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
        '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽',
        '水山蹇', '雷水解', '山澤損', '風雷益', '澤天夬', '天風姤',
        '澤地萃', '地風升', '澤水困', '水風井', '澤火革', '火風鼎',
        '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
        '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過',
        '水火既済', '火水未済'
    ];
    
    hexagramNames.forEach(name => {
        // 各卦のセクションを探す
        const hexagramRegex = new RegExp(`"${name}": \\{[\\s\\S]*?"osBalance"[\\s\\S]*?\\}\\s*\\}`, 'g');
        const match = fileContent.match(hexagramRegex);
        
        if (match && match[0]) {
            try {
                // セクション内のデータを抽出
                const section = match[0];
                
                // Engine OSのprofile.typeを取得
                const typeMatch = section.match(/"asEngineOS"[\s\S]*?"profile"[\s\S]*?"type": "([^"]+)"/);
                const descMatch = section.match(/"asEngineOS"[\s\S]*?"profile"[\s\S]*?"description": "([^"]+)"/);
                const metaphorMatch = section.match(/"asEngineOS"[\s\S]*?"profile"[\s\S]*?"metaphor": "([^"]+)"/);
                const whatYouNeedMatch = section.match(/"asEngineOS"[\s\S]*?"maintenance"[\s\S]*?"whatYouNeed": "([^"]+)"/);
                const warningMatch = section.match(/"asEngineOS"[\s\S]*?"maintenance"[\s\S]*?"warning": "([^"]+)"/);
                const tipMatch = section.match(/"asEngineOS"[\s\S]*?"maintenance"[\s\S]*?"tip": "([^"]+)"/);
                
                // Interface OSのデータ
                const interfaceTypeMatch = section.match(/"asInterfaceOS"[\s\S]*?"profile"[\s\S]*?"type": "([^"]+)"/);
                const interfaceDescMatch = section.match(/"asInterfaceOS"[\s\S]*?"profile"[\s\S]*?"description": "([^"]+)"/);
                const styleMatch = section.match(/"asInterfaceOS"[\s\S]*?"howToTalk"[\s\S]*?"style": "([^"]+)"/);
                const goodAtMatch = section.match(/"asInterfaceOS"[\s\S]*?"howToTalk"[\s\S]*?"goodAt": "([^"]+)"/);
                
                // SafeMode OSのデータ
                const safeModeTypeMatch = section.match(/"asSafeModeOS"[\s\S]*?"profile"[\s\S]*?"type": "([^"]+)"/);
                const safeModeDescMatch = section.match(/"asSafeModeOS"[\s\S]*?"profile"[\s\S]*?"description": "([^"]+)"/);
                const stressResponseMatch = section.match(/"asSafeModeOS"[\s\S]*?"stressResponse"[\s\S]*?"whatYouDo": "([^"]+)"/);
                
                hexagrams[name] = {
                    engineOS: {
                        type: typeMatch ? typeMatch[1] : '',
                        description: descMatch ? descMatch[1] : '',
                        metaphor: metaphorMatch ? metaphorMatch[1] : '',
                        whatYouNeed: whatYouNeedMatch ? whatYouNeedMatch[1] : '',
                        warning: warningMatch ? warningMatch[1] : '',
                        tip: tipMatch ? tipMatch[1] : ''
                    },
                    interfaceOS: {
                        type: interfaceTypeMatch ? interfaceTypeMatch[1] : '',
                        description: interfaceDescMatch ? interfaceDescMatch[1] : '',
                        style: styleMatch ? styleMatch[1] : '',
                        goodAt: goodAtMatch ? goodAtMatch[1] : ''
                    },
                    safeModeOS: {
                        type: safeModeTypeMatch ? safeModeTypeMatch[1] : '',
                        description: safeModeDescMatch ? safeModeDescMatch[1] : '',
                        stressResponse: stressResponseMatch ? stressResponseMatch[1] : ''
                    }
                };
            } catch (e) {
                console.log(`  ⚠️ ${name} のデータ解析に失敗`);
            }
        }
    });
    
    return hexagrams;
}

// 各卦の既存データに基づいて新規フィールドを生成
function generateFieldsBasedOnExisting(hexagramName, existingData) {
    const engine = existingData.engineOS || {};
    const interface = existingData.interfaceOS || {};
    const safeMode = existingData.safeModeOS || {};
    
    const fields = {
        engineOS: {
            deepInsight: generateEngineDeepInsightFromData(hexagramName, engine),
            dailyPatterns: generateDailyPatternsFromData(hexagramName, engine),
            strengthWeakness: generateStrengthWeaknessFromData(hexagramName, engine)
        },
        interfaceOS: {
            deepInsight: generateInterfaceDeepInsightFromData(hexagramName, interface),
            communicationPatterns: generateCommunicationPatternsFromData(hexagramName, interface)
        },
        safeModeOS: {
            deepInsight: generateSafeModeDeepInsightFromData(hexagramName, safeMode),
            stressPatterns: generateStressPatternsFromData(hexagramName, safeMode)
        }
    };
    
    return fields;
}

// Engine OS deepInsight生成（既存データベース）
function generateEngineDeepInsightFromData(hexagramName, engineData) {
    const type = engineData.type || '';
    const description = engineData.description || '';
    const whatYouNeed = engineData.whatYouNeed || '';
    const warning = engineData.warning || '';
    const tip = engineData.tip || '';
    
    // タイプに応じた核心価値の生成
    let coreValue = '';
    let lifeMission = '';
    let innerConflict = '';
    let growthPath = '';
    
    // タイプから価値観を推測
    if (type.includes('開拓') || type.includes('創始')) {
        coreValue = `開拓と創造 - ${description}。新しい道を切り開くことに最高の価値を見出す`;
        lifeMission = `未踏の領域を開拓し、${whatYouNeed}を実現することで世界に貢献`;
        innerConflict = `${warning}。理想と現実のギャップに苦しむこともある`;
        growthPath = `1. ${tip} 2. 小さな成功を積み重ねる 3. 協力者と共に進む`;
    } else if (type.includes('学習') || type.includes('成長')) {
        coreValue = `学びと成長 - ${description}。継続的な成長に価値を見出す`;
        lifeMission = `${whatYouNeed}を通じて、自己と他者の成長を促進すること`;
        innerConflict = `${warning}。完璧を求めすぎて前に進めないことも`;
        growthPath = `1. ${tip} 2. 失敗を学びとする 3. 成長を実感する`;
    } else if (type.includes('調和') || type.includes('バランス')) {
        coreValue = `調和とバランス - ${description}。全体の調和を保つことに価値を見出す`;
        lifeMission = `${whatYouNeed}を実現し、すべてが調和する環境を創ること`;
        innerConflict = `${warning}。バランスを求めすぎて決断が遅れることも`;
        growthPath = `1. ${tip} 2. 柔軟性を保つ 3. 中庸の道を歩む`;
    } else if (type.includes('実行') || type.includes('達成')) {
        coreValue = `実行と達成 - ${description}。確実に成果を出すことに価値を見出す`;
        lifeMission = `${whatYouNeed}を確実に実現し、具体的な成果で貢献すること`;
        innerConflict = `${warning}。成果を急ぐあまり大切なものを見失うことも`;
        growthPath = `1. ${tip} 2. プロセスも大切にする 3. 長期的視点を持つ`;
    } else {
        // デフォルト: 既存データから生成
        coreValue = `${type}の本質 - ${description}ことに深い価値を見出す`;
        lifeMission = `${whatYouNeed}を実現し、独自の価値を世界に提供すること`;
        innerConflict = `${warning}という課題を抱えることがある`;
        growthPath = `1. ${tip} 2. 自己理解を深める 3. バランスを保つ`;
    }
    
    return { coreValue, lifeMission, innerConflict, growthPath };
}

// Daily Patterns生成（既存データベース）
function generateDailyPatternsFromData(hexagramName, engineData) {
    const type = engineData.type || '';
    const description = engineData.description || '';
    const metaphor = engineData.metaphor || '';
    
    return {
        morning: `${type}の精神で目覚め、${description.substring(0, 20)}...という意識で1日を始める`,
        decision: `${metaphor}のように、状況を見極めて判断する`,
        problemSolving: `${type}のアプローチで問題に取り組み、独自の解決策を見出す`,
        creativity: `${description}時に、最も創造的なアイデアが生まれる`
    };
}

// Strength/Weakness生成（既存データベース）
function generateStrengthWeaknessFromData(hexagramName, engineData) {
    const type = engineData.type || '';
    const description = engineData.description || '';
    const warning = engineData.warning || '';
    const tip = engineData.tip || '';
    
    return {
        topStrength: `${type}における卓越性 - ${description}という強み`,
        hiddenTalent: `${type}の奥に眠る、まだ開花していない才能`,
        blindSpot: `${warning} - これが盲点となることがある`,
        improvement: `${tip}を実践し、継続的に成長する`
    };
}

// Interface OS deepInsight生成（既存データベース）
function generateInterfaceDeepInsightFromData(hexagramName, interfaceData) {
    const type = interfaceData.type || '';
    const description = interfaceData.description || '';
    const style = interfaceData.style || '';
    
    return {
        coreValue: `${type}的関係性 - ${description}ことで人間関係を築くことに価値を見出す`,
        socialMission: `${style}なコミュニケーションで、社会に独自の価値を提供すること`,
        relationshipPattern: `${description}というスタイルで人と関わる`,
        connectionPath: `1. ${type}を活かす 2. 相手を理解する 3. 互恵的な関係を築く`
    };
}

// Communication Patterns生成（既存データベース）
function generateCommunicationPatternsFromData(hexagramName, interfaceData) {
    const type = interfaceData.type || '';
    const style = interfaceData.style || '';
    const goodAt = interfaceData.goodAt || '';
    
    return {
        firstImpression: `${type}な人物として、${style}な印象を与える`,
        presentation: `${goodAt}を活かしたプレゼンテーション`,
        listening: `${style}な姿勢で相手の話を聞く`,
        conflict: `${type}のアプローチで対立を解決する`
    };
}

// SafeMode OS deepInsight生成（既存データベース）
function generateSafeModeDeepInsightFromData(hexagramName, safeModeData) {
    const type = safeModeData.type || '';
    const description = safeModeData.description || '';
    const stressResponse = safeModeData.stressResponse || '';
    
    return {
        coreValue: `${type}による自己防衛 - ${description}ことで安全を確保することに価値を見出す`,
        defenseMechanism: `${stressResponse}という防御反応`,
        vulnerablePoint: `${type}の限界点。過度のストレスで機能不全になる危険`,
        healingPath: `1. ${description}を理解する 2. 適切な対処法を学ぶ 3. サポートを受ける`
    };
}

// Stress Patterns生成（既存データベース）
function generateStressPatternsFromData(hexagramName, safeModeData) {
    const type = safeModeData.type || '';
    const stressResponse = safeModeData.stressResponse || '';
    
    return {
        earlySign: `${type}の兆候が現れ始める。いつもと違う行動パターン`,
        peakStress: `${stressResponse}という状態がピークに達する`,
        breakingPoint: `${type}が限界を超え、完全に機能不全になる`,
        preventiveMeasure: `定期的なストレスチェックと、${type}に適したケア方法の実践`
    };
}

// メイン処理
function main() {
    console.log('🚀 各卦の既存データに基づいた新規フィールド追加を開始\n');
    
    // 既存データを解析
    console.log('📖 既存データを読み込み中...');
    const existingData = parseV3Data();
    console.log(`  ✅ ${Object.keys(existingData).length}卦のデータを取得\n`);
    
    let updatedCount = 0;
    
    // 各卦を処理
    Object.keys(existingData).forEach(hexagramName => {
        console.log(`📝 ${hexagramName} を処理中...`);
        
        const data = existingData[hexagramName];
        const fields = generateFieldsBasedOnExisting(hexagramName, data);
        
        // Engine OSに新規フィールドを追加
        let engineUpdated = false;
        const engineRegex = new RegExp(
            `("${hexagramName}"[\\s\\S]*?"asEngineOS"[\\s\\S]*?"maintenance"[\\s\\S]*?\\})`,
            'g'
        );
        
        fileContent = fileContent.replace(engineRegex, (match) => {
            if (!match.includes('"deepInsight"')) {
                engineUpdated = true;
                return match.replace(/(\})$/, `,
            "deepInsight": ${JSON.stringify(fields.engineOS.deepInsight, null, 16)},
            "dailyPatterns": ${JSON.stringify(fields.engineOS.dailyPatterns, null, 16)},
            "strengthWeakness": ${JSON.stringify(fields.engineOS.strengthWeakness, null, 16)}
            }`);
            }
            return match;
        });
        
        // Interface OSに新規フィールドを追加
        let interfaceUpdated = false;
        const interfaceRegex = new RegExp(
            `("${hexagramName}"[\\s\\S]*?"asInterfaceOS"[\\s\\S]*?"relationshipTips"[\\s\\S]*?\\})`,
            'g'
        );
        
        fileContent = fileContent.replace(interfaceRegex, (match) => {
            if (!match.includes('"deepInsight"')) {
                interfaceUpdated = true;
                return match.replace(/(\})$/, `,
            "deepInsight": ${JSON.stringify(fields.interfaceOS.deepInsight, null, 16)},
            "communicationPatterns": ${JSON.stringify(fields.interfaceOS.communicationPatterns, null, 16)}
            }`);
            }
            return match;
        });
        
        // SafeMode OSに新規フィールドを追加
        let safeModeUpdated = false;
        const safeModeRegex = new RegExp(
            `("${hexagramName}"[\\s\\S]*?"asSafeModeOS"[\\s\\S]*?"howToRecover"[\\s\\S]*?\\})`,
            'g'
        );
        
        fileContent = fileContent.replace(safeModeRegex, (match) => {
            if (!match.includes('"deepInsight"')) {
                safeModeUpdated = true;
                return match.replace(/(\})$/, `,
            "deepInsight": ${JSON.stringify(fields.safeModeOS.deepInsight, null, 16)},
            "stressPatterns": ${JSON.stringify(fields.safeModeOS.stressPatterns, null, 16)}
            }`);
            }
            return match;
        });
        
        if (engineUpdated || interfaceUpdated || safeModeUpdated) {
            updatedCount++;
            console.log(`  ✅ ${hexagramName} - 更新完了`);
        } else {
            console.log(`  ⏭️  ${hexagramName} - 既に更新済み`);
        }
    });
    
    // ファイルに書き戻し
    fs.writeFileSync(v3FilePath, fileContent);
    
    console.log(`\n✨ 完了！ ${updatedCount}卦を更新しました。`);
    
    // 最終確認
    const deepInsightCount = (fileContent.match(/"deepInsight"/g) || []).length;
    console.log(`\n📈 deepInsightフィールド数: ${deepInsightCount}/192`);
}

// 実行
main();