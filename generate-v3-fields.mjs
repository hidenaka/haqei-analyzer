#!/usr/bin/env node

/**
 * V3データベースの新規フィールドを生成するスクリプト
 * 各卦の既存データを基に、deepInsight、dailyPatterns、strengthWeakness、
 * communicationPatterns、stressPatternsを自動生成
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// V3データベースファイルを読み込み
const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
let fileContent = fs.readFileSync(v3FilePath, 'utf-8');

// HexagramHumanTraitsV3オブジェクトを抽出してパース
const startStr = 'const HexagramHumanTraitsV3 = ';
const startIndex = fileContent.indexOf(startStr) + startStr.length;
const endIndex = fileContent.indexOf('// グローバル公開');
const v3ObjectStr = fileContent.substring(startIndex, endIndex).trim().replace(/;$/, '');

// evalの代わりに安全な方法でオブジェクトを取得
let v3Data;
try {
    // 動的インポートを使用
    const tempFile = path.join(__dirname, 'temp-v3-data.mjs');
    const moduleContent = `export default ${v3ObjectStr}`;
    fs.writeFileSync(tempFile, moduleContent);
    const module = await import(tempFile);
    v3Data = module.default;
    fs.unlinkSync(tempFile); // 一時ファイルを削除
} catch (error) {
    console.error('❌ V3データの読み込みに失敗:', error);
    process.exit(1);
}

// 新規フィールド生成関数
function generateNewFields(hexagramName, hexagram) {
    const engineOS = hexagram.asEngineOS;
    const interfaceOS = hexagram.asInterfaceOS;
    const safeModeOS = hexagram.asSafeModeOS;
    
    // 既に新規フィールドがある場合はスキップ
    if (engineOS?.deepInsight) {
        console.log(`  ⏭️  ${hexagramName} - 既に新規フィールドあり（スキップ）`);
        return null;
    }
    
    console.log(`  📝 ${hexagramName} - 新規フィールド生成中...`);
    
    const newFields = {
        asEngineOS: {
            deepInsight: generateEngineDeepInsight(engineOS),
            dailyPatterns: generateDailyPatterns(engineOS),
            strengthWeakness: generateStrengthWeakness(engineOS)
        },
        asInterfaceOS: {
            deepInsight: generateInterfaceDeepInsight(interfaceOS),
            communicationPatterns: generateCommunicationPatterns(interfaceOS)
        },
        asSafeModeOS: {
            deepInsight: generateSafeModeDeepInsight(safeModeOS),
            stressPatterns: generateStressPatterns(safeModeOS)
        }
    };
    
    return newFields;
}

// Engine OS用 deepInsight生成
function generateEngineDeepInsight(engineOS) {
    const type = engineOS?.profile?.type || '';
    const description = engineOS?.profile?.description || '';
    const whatYouNeed = engineOS?.maintenance?.whatYouNeed || '';
    
    let coreValue = '';
    let lifeMission = '';
    let innerConflict = '';
    let growthPath = '';
    
    // タイプキーワードに基づいて生成
    if (type.includes('革新') || type.includes('創造') || type.includes('イノベ')) {
        coreValue = `革新と創造 - ${description}ことに最高の価値を見出す`;
        lifeMission = `既存の枠組みを超えた新しい価値を生み出し、世界に変革をもたらすこと`;
        innerConflict = `理想の高さと現実のギャップ。完璧を求めすぎて前進が遅れることも`;
        growthPath = `1. 小さな成功を積み重ねる 2. 協力者を見つけて共創する 3. 失敗を学びとして活かす`;
    } else if (type.includes('分析') || type.includes('論理') || type.includes('洞察')) {
        coreValue = `真理と理解 - ${description}ことに深い価値を見出す`;
        lifeMission = `物事の本質を解明し、複雑な問題に明確な答えを導き出すこと`;
        innerConflict = `論理と感情のバランス。正しさを追求するあまり人間味を失う危険`;
        growthPath = `1. 感情の価値も認める 2. 直感を大切にする 3. 他者の視点を取り入れる`;
    } else if (type.includes('実行') || type.includes('達成') || type.includes('成果')) {
        coreValue = `成果と達成 - ${description}ことで自己実現を果たす`;
        lifeMission = `掲げた目標を確実に達成し、具体的な成果で世界に貢献すること`;
        innerConflict = `効率と人間関係の両立。成果を急ぐあまり大切なものを見失う`;
        growthPath = `1. プロセスも楽しむ 2. チームの成長を喜ぶ 3. 長期的な視点を持つ`;
    } else if (type.includes('調和') || type.includes('安定') || type.includes('バランス')) {
        coreValue = `調和と安定 - ${description}ことで平和を実現する`;
        lifeMission = `すべての要素が調和し、持続可能な環境を創造すること`;
        innerConflict = `変化への抵抗と成長の必要性。安定を求めすぎて機会を逃す`;
        growthPath = `1. 変化も成長の一部と理解 2. 適度なリスクを取る 3. 新しい挑戦を楽しむ`;
    } else if (type.includes('支援') || type.includes('育成') || type.includes('サポート')) {
        coreValue = `奉仕と成長 - ${description}ことに生きがいを感じる`;
        lifeMission = `他者の可能性を最大限に引き出し、共に成長する環境を創ること`;
        innerConflict = `自己犠牲と自己実現の葛藤。他者優先で自分を見失う危険`;
        growthPath = `1. 自分も大切にする 2. 健全な境界線を設定 3. 与えることと受け取ることのバランス`;
    } else if (type.includes('観察') || type.includes('洞察') || type.includes('見守')) {
        coreValue = `観察と洞察 - ${description}ことで真実を見出す`;
        lifeMission = `深い観察から本質を見抜き、的確な判断で導くこと`;
        innerConflict = `観察と行動のタイミング。待ちすぎて機会を逃すことも`;
        growthPath = `1. 適切なタイミングで行動 2. 直感も信じる 3. 積極的な関与も必要`;
    } else if (type.includes('流動') || type.includes('適応') || type.includes('柔軟')) {
        coreValue = `流動と適応 - ${description}ことで可能性を広げる`;
        lifeMission = `どんな環境でも適応し、最適な形で価値を提供すること`;
        innerConflict = `自分の軸と柔軟性のバランス。適応しすぎて自分を見失う`;
        growthPath = `1. 核となる価値観を持つ 2. 必要な時は立ち止まる 3. 自分らしさを大切に`;
    } else {
        // デフォルト値
        coreValue = `${type}を通じて - ${description}ことに価値を見出す`;
        lifeMission = `${whatYouNeed}を実現し、独自の価値を世界に提供すること`;
        innerConflict = `自分らしさと社会の期待のバランス。どこまで適応すべきかの葛藤`;
        growthPath = `1. 自分の強みを認識 2. 弱みも受け入れる 3. 独自のバランスを見つける`;
    }
    
    return { coreValue, lifeMission, innerConflict, growthPath };
}

// Daily Patterns生成
function generateDailyPatterns(engineOS) {
    const type = engineOS?.profile?.type || '';
    const normalState = engineOS?.normalState?.whatHappens || '';
    
    let morning, decision, problemSolving, creativity;
    
    if (type.includes('革新') || type.includes('創造')) {
        morning = `新しいアイデアと共に目覚め、今日何を変革できるか考える`;
        decision = `従来とは異なる選択肢を探す。革新の可能性を最優先`;
        problemSolving = `既存の枠組みを疑い、全く新しいアプローチを開発`;
        creativity = `制約がある時ほど創造性が爆発。プレッシャーが刺激に`;
    } else if (type.includes('分析') || type.includes('論理')) {
        morning = `データと事実を確認し、今日の課題を論理的に整理`;
        decision = `すべての選択肢を比較検討。データに基づく最適解`;
        problemSolving = `問題を要素分解し、各要素を体系的に解決`;
        creativity = `既存要素の新しい組み合わせ。論理的な創造`;
    } else if (type.includes('実行') || type.includes('達成')) {
        morning = `今日の目標を明確にし、達成への道筋を立てる`;
        decision = `目標達成に最も効果的な選択。スピードと成果重視`;
        problemSolving = `即座に行動し、実践の中で解決策を見つける`;
        creativity = `実用的で即効性のあるアイデア。実現可能性を優先`;
    } else {
        morning = normalState ? `${normalState}ことから1日を始める` : `今日の優先順位を確認して始動`;
        decision = `状況に応じた柔軟な判断。バランスを重視`;
        problemSolving = `多角的に分析し、最適な解決策を選択`;
        creativity = `日常の中から新しい発見を見つける`;
    }
    
    return { morning, decision, problemSolving, creativity };
}

// Strength/Weakness生成
function generateStrengthWeakness(engineOS) {
    const type = engineOS?.profile?.type || '';
    const description = engineOS?.profile?.description || '';
    const warning = engineOS?.maintenance?.warning || '';
    
    let topStrength, hiddenTalent, blindSpot, improvement;
    
    // タイプに応じた強み・弱み生成
    const typePatterns = {
        '革新': {
            topStrength: 'ビジョン創造力 - 誰も見たことのない未来を描く',
            hiddenTalent: '危機での突破力 - 追い詰められた時の創造性',
            blindSpot: '現在を軽視 - 未来ばかり見て今を疎かに',
            improvement: '今この瞬間を大切にする練習'
        },
        '分析': {
            topStrength: '洞察力 - 複雑な問題の本質を見抜く',
            hiddenTalent: 'パターン認識 - 見えない法則を発見',
            blindSpot: '感情を軽視 - 論理優先で人間味不足',
            improvement: '感情知性を意識的に磨く'
        },
        '実行': {
            topStrength: '完遂力 - 決めたことを必ず成し遂げる',
            hiddenTalent: 'プレッシャー下の集中力',
            blindSpot: 'プロセス軽視 - 結果のみ重視',
            improvement: '過程も楽しむ意識を持つ'
        },
        '支援': {
            topStrength: '共感力 - 他者の可能性を引き出す',
            hiddenTalent: '癒しの力 - 存在が安心感を与える',
            blindSpot: '自己犠牲 - 自分を後回しに',
            improvement: 'セルフケアの習慣化'
        }
    };
    
    // マッチするパターンを探す
    for (const [key, pattern] of Object.entries(typePatterns)) {
        if (type.includes(key)) {
            return {
                topStrength: `${pattern.topStrength} - ${description}`,
                hiddenTalent: pattern.hiddenTalent,
                blindSpot: warning || pattern.blindSpot,
                improvement: pattern.improvement
            };
        }
    }
    
    // デフォルト
    return {
        topStrength: `${type}における卓越性 - ${description}`,
        hiddenTalent: `まだ気づいていない${type}の才能`,
        blindSpot: warning || `改善の余地がある領域`,
        improvement: `継続的な成長のための実践`
    };
}

// Interface OS用 deepInsight生成
function generateInterfaceDeepInsight(interfaceOS) {
    const type = interfaceOS?.profile?.type || '';
    const description = interfaceOS?.profile?.description || '';
    
    return {
        coreValue: `${type}を通じた関係構築 - ${description}ことに価値を見出す`,
        socialMission: `${type}として社会に貢献し、より良い関係性を創ること`,
        relationshipPattern: `${description}というスタイルで人と関わる`,
        connectionPath: `1. 強みを活かす 2. 弱みを補う 3. バランスを保つ`
    };
}

// Communication Patterns生成
function generateCommunicationPatterns(interfaceOS) {
    const style = interfaceOS?.howToTalk?.style || '';
    const goodAt = interfaceOS?.howToTalk?.goodAt || '';
    
    return {
        firstImpression: `${style}な人物として印象づける`,
        presentation: `${style}なプレゼンテーション`,
        listening: `${goodAt}を活かした傾聴`,
        conflict: `${style}な対立解決アプローチ`
    };
}

// SafeMode OS用 deepInsight生成
function generateSafeModeDeepInsight(safeModeOS) {
    const type = safeModeOS?.profile?.type || '';
    const description = safeModeOS?.profile?.description || '';
    
    return {
        coreValue: `${type}による自己防衛 - ${description}ことで安全を確保`,
        defenseMechanism: `${description}という防御メカニズム`,
        vulnerablePoint: `${type}の限界点と弱さ`,
        healingPath: `1. 自己理解 2. 適切な対処 3. サポート獲得`
    };
}

// Stress Patterns生成
function generateStressPatterns(safeModeOS) {
    const whatYouDo = safeModeOS?.stressResponse?.whatYouDo || '';
    const example = safeModeOS?.stressResponse?.example || '';
    
    return {
        earlySign: `ストレスの初期サイン：${whatYouDo}始める`,
        peakStress: `ピーク時の状態：${example}`,
        breakingPoint: `限界点：完全な${safeModeOS?.profile?.type || 'ストレス'}状態`,
        preventiveMeasure: `定期的なケアと予防策の実施`
    };
}

// メイン処理
async function main() {
    console.log('🚀 V3データベースへの新規フィールド追加開始\n');
    
    const updates = [];
    let processedCount = 0;
    let skippedCount = 0;
    
    // 各卦を処理
    for (const [hexagramName, hexagram] of Object.entries(v3Data)) {
        const newFields = generateNewFields(hexagramName, hexagram);
        
        if (newFields) {
            updates.push({ hexagramName, newFields });
            processedCount++;
        } else {
            skippedCount++;
        }
    }
    
    console.log(`\n📊 処理結果:`);
    console.log(`  ✅ 処理済み: ${processedCount}卦`);
    console.log(`  ⏭️  スキップ: ${skippedCount}卦`);
    
    // 更新内容を適用
    if (updates.length > 0) {
        console.log('\n📝 ファイルを更新中...');
        
        for (const update of updates) {
            const { hexagramName, newFields } = update;
            
            // Engine OS の更新
            const enginePattern = new RegExp(
                `("${hexagramName}"[\\s\\S]*?"asEngineOS"[\\s\\S]*?"maintenance"[\\s\\S]*?\\})`,
                'g'
            );
            fileContent = fileContent.replace(enginePattern, (match) => {
                return match.replace(/(\})$/, `,
            "deepInsight": ${JSON.stringify(newFields.asEngineOS.deepInsight, null, 16).replace(/\n/g, '\n            ')},
            "dailyPatterns": ${JSON.stringify(newFields.asEngineOS.dailyPatterns, null, 16).replace(/\n/g, '\n            ')},
            "strengthWeakness": ${JSON.stringify(newFields.asEngineOS.strengthWeakness, null, 16).replace(/\n/g, '\n            ')}
        }`);
            });
            
            // Interface OS の更新
            const interfacePattern = new RegExp(
                `("${hexagramName}"[\\s\\S]*?"asInterfaceOS"[\\s\\S]*?"relationshipTips"[\\s\\S]*?\\})`,
                'g'
            );
            fileContent = fileContent.replace(interfacePattern, (match) => {
                return match.replace(/(\})$/, `,
            "deepInsight": ${JSON.stringify(newFields.asInterfaceOS.deepInsight, null, 16).replace(/\n/g, '\n            ')},
            "communicationPatterns": ${JSON.stringify(newFields.asInterfaceOS.communicationPatterns, null, 16).replace(/\n/g, '\n            ')}
        }`);
            });
            
            // SafeMode OS の更新
            const safeModePattern = new RegExp(
                `("${hexagramName}"[\\s\\S]*?"asSafeModeOS"[\\s\\S]*?"howToRecover"[\\s\\S]*?\\})`,
                'g'
            );
            fileContent = fileContent.replace(safeModePattern, (match) => {
                return match.replace(/(\})$/, `,
            "deepInsight": ${JSON.stringify(newFields.asSafeModeOS.deepInsight, null, 16).replace(/\n/g, '\n            ')},
            "stressPatterns": ${JSON.stringify(newFields.asSafeModeOS.stressPatterns, null, 16).replace(/\n/g, '\n            ')}
        }`);
            });
        }
        
        // ファイルに書き戻し
        fs.writeFileSync(v3FilePath, fileContent);
        console.log('✅ ファイル更新完了！');
    }
}

// 実行
main().catch(error => {
    console.error('❌ エラー:', error);
    process.exit(1);
});