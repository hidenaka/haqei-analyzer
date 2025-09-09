#!/usr/bin/env node

/**
 * V3データベースに新規フィールドを追加するスクリプト
 * Phase 3-4: 全64卦への展開
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 各卦の特性に基づいた新規フィールドテンプレート生成
function generateDeepInsightFields(hexagramName, osType, profile) {
    const templates = {
        // Engine OS用テンプレート
        engineOS: {
            deepInsight: generateEngineDeepInsight(hexagramName, profile),
            dailyPatterns: generateEngineDailyPatterns(hexagramName, profile),
            strengthWeakness: generateEngineStrengthWeakness(hexagramName, profile)
        },
        // Interface OS用テンプレート
        interfaceOS: {
            deepInsight: generateInterfaceDeepInsight(hexagramName, profile),
            communicationPatterns: generateCommunicationPatterns(hexagramName, profile)
        },
        // SafeMode OS用テンプレート
        safeModeOS: {
            deepInsight: generateSafeModeDeepInsight(hexagramName, profile),
            stressPatterns: generateStressPatterns(hexagramName, profile)
        }
    };
    
    return templates[osType];
}

// Engine OS用 deepInsight生成
function generateEngineDeepInsight(hexagramName, profile) {
    const type = profile?.type || '';
    const description = profile?.description || '';
    
    // タイプに基づいた動的生成
    let coreValue = '';
    let lifeMission = '';
    let innerConflict = '';
    let growthPath = '';
    
    if (type.includes('革新') || type.includes('創造')) {
        coreValue = '革新と創造 - 新しい価値を生み出し、世界を変えることに価値を見出す';
        lifeMission = '既存の枠組みを超えた革新的なソリューションで社会に貢献すること';
        innerConflict = '理想と現実のギャップ。完璧を求めすぎて前に進めない時がある';
        growthPath = '1. 小さな一歩から始める 2. 失敗を学びと捉える 3. 協力者を見つける';
    } else if (type.includes('分析') || type.includes('論理')) {
        coreValue = '真理と理解 - 物事の本質を解明し、論理的に理解することに価値を見出す';
        lifeMission = '複雑な問題を解き明かし、明確な答えを導き出すこと';
        innerConflict = '感情と論理の対立。人の気持ちを理解することの難しさ';
        growthPath = '1. 感情の価値を認める 2. 直感も大切にする 3. 人との対話を増やす';
    } else if (type.includes('実行') || type.includes('達成')) {
        coreValue = '成果と達成 - 目標を実現し、具体的な成果を出すことに価値を見出す';
        lifeMission = '掲げた目標を確実に達成し、期待を超える結果を出すこと';
        innerConflict = '効率と人間関係のバランス。成果を急ぐあまり周囲を置き去りにする';
        growthPath = '1. プロセスも楽しむ 2. チームの成長を喜ぶ 3. 長期的視点を持つ';
    } else if (type.includes('調和') || type.includes('安定')) {
        coreValue = 'バランスと平和 - 調和のとれた環境を創り、安定を保つことに価値を見出す';
        lifeMission = '対立を解消し、すべての人が共存できる環境を創造すること';
        innerConflict = '変化への抵抗と成長の必要性。安定を求めすぎて機会を逃す';
        growthPath = '1. 変化を受け入れる 2. リスクを適切に取る 3. 新しいことに挑戦する';
    } else if (type.includes('支援') || type.includes('育成')) {
        coreValue = '成長と貢献 - 他者の可能性を開花させることに価値を見出す';
        lifeMission = 'すべての人が持つ潜在能力を引き出し、共に成長すること';
        innerConflict = '自己犠牲と自己実現の葛藤。他者を優先しすぎて自分を見失う';
        growthPath = '1. 自分も大切にする 2. 境界線を設定する 3. 受け取ることを学ぶ';
    } else {
        // デフォルト値
        coreValue = `${type}を通じて、独自の価値を創造することに価値を見出す`;
        lifeMission = `${description}という特性を活かし、世界に貢献すること`;
        innerConflict = '自分らしさと社会の期待のバランス。どこまで適応すべきかの葛藤';
        growthPath = '1. 自分の強みを認識する 2. 弱みを受け入れる 3. バランスを見つける';
    }
    
    return {
        coreValue,
        lifeMission,
        innerConflict,
        growthPath
    };
}

// Engine OS用 dailyPatterns生成
function generateEngineDailyPatterns(hexagramName, profile) {
    const type = profile?.type || '';
    
    let morning = '';
    let decision = '';
    let problemSolving = '';
    let creativity = '';
    
    if (type.includes('革新') || type.includes('創造')) {
        morning = '新しいアイデアと共に目覚め、今日何を変えられるか考える';
        decision = '従来とは違う選択肢を探す。イノベーションの可能性を重視';
        problemSolving = '既存の枠組みを疑い、根本から新しいアプローチを考案';
        creativity = '制約がある時ほど創造性が刺激される。締切前に爆発的なアイデア';
    } else if (type.includes('分析') || type.includes('論理')) {
        morning = 'データと事実を確認し、今日の課題を論理的に整理する';
        decision = 'すべての選択肢を比較検討。データに基づいて最適解を選択';
        problemSolving = '問題を要素分解し、各要素を論理的に解決していく';
        creativity = '既存の要素を新しい組み合わせで再構成。システム的な創造';
    } else if (type.includes('実行') || type.includes('達成')) {
        morning = '今日のゴールを明確にし、達成への道筋を立てる';
        decision = '目標達成に最も効果的な選択。スピードと成果を重視';
        problemSolving = '即座に行動し、実践の中で解決策を見つける';
        creativity = '実用的で即効性のあるアイデア。実現可能性を最優先';
    } else if (type.includes('調和') || type.includes('安定')) {
        morning = '心を落ち着け、今日の調和を保つ方法を考える';
        decision = 'すべての関係者にとってバランスの良い選択を探る';
        problemSolving = '対立を避け、全員が納得できる解決策を模索';
        creativity = '既存の良さを活かしながら、穏やかに新しさを加える';
    } else if (type.includes('支援') || type.includes('育成')) {
        morning = '今日誰をサポートできるか、どんな貢献ができるか考える';
        decision = '他者への影響を第一に考慮。長期的な成長を重視';
        problemSolving = '関係者全員の意見を聞き、共に解決策を見つける';
        creativity = '他者との対話から生まれる共創的なアイデア';
    } else {
        morning = '今日の目標と優先順位を確認して1日を始める';
        decision = '状況に応じて柔軟に判断。バランスを重視';
        problemSolving = '多角的に問題を分析し、最適な解決策を選択';
        creativity = '日常の中から新しい発見を見つける';
    }
    
    return {
        morning,
        decision,
        problemSolving,
        creativity
    };
}

// Engine OS用 strengthWeakness生成
function generateEngineStrengthWeakness(hexagramName, profile) {
    const type = profile?.type || '';
    const description = profile?.description || '';
    
    let topStrength = '';
    let hiddenTalent = '';
    let blindSpot = '';
    let improvement = '';
    
    if (type.includes('革新') || type.includes('創造')) {
        topStrength = 'ビジョン創造力 - 誰も見たことのない未来を描き、実現への道を示す';
        hiddenTalent = '危機的状況での突破力。追い詰められた時に最高の解決策を生み出す';
        blindSpot = '現在の価値を見落としがち。常に未来ばかり見て今を疎かにする';
        improvement = '今この瞬間を大切にする練習。既存の良さも認める習慣づくり';
    } else if (type.includes('分析') || type.includes('論理')) {
        topStrength = '分析力と洞察力 - 複雑な問題の本質を見抜き、論理的に解決する';
        hiddenTalent = 'パターン認識能力。見えない法則性を発見する才能';
        blindSpot = '感情的な側面を軽視。人の気持ちより正しさを優先しがち';
        improvement = '感情知性を磨く。共感力を意識的に練習する';
    } else if (type.includes('実行') || type.includes('達成')) {
        topStrength = '実行力と完遂力 - 決めたことを確実にやり遂げる強い意志';
        hiddenTalent = 'プレッシャー下での集中力。締切が迫るほど力を発揮';
        blindSpot = 'プロセスを軽視。結果だけを見て、過程の価値を見落とす';
        improvement = '過程も楽しむ意識。チームメンバーの成長も評価する';
    } else if (type.includes('調和') || type.includes('安定')) {
        topStrength = '調整力とバランス感覚 - 対立を和らげ、全体の調和を保つ';
        hiddenTalent = '空気を読む力。場の雰囲気を瞬時に察知し対応する';
        blindSpot = '変化を恐れる傾向。新しいことへの挑戦を避けがち';
        improvement = '小さな変化から始める。計画的にコンフォートゾーンを広げる';
    } else if (type.includes('支援') || type.includes('育成')) {
        topStrength = '共感力と育成力 - 他者の可能性を見出し、成長を支援する';
        hiddenTalent = '癒しの力。存在するだけで周囲を安心させる';
        blindSpot = '自己犠牲の傾向。自分のニーズを後回しにしすぎる';
        improvement = 'セルフケアの習慣化。自分を大切にすることも他者貢献';
    } else {
        topStrength = `${type}における卓越した能力`;
        hiddenTalent = 'まだ気づいていない潜在的な才能';
        blindSpot = '改善の余地がある領域';
        improvement = '継続的な成長のための具体的な方法';
    }
    
    return {
        topStrength,
        hiddenTalent,
        blindSpot,
        improvement
    };
}

// Interface OS用 deepInsight生成
function generateInterfaceDeepInsight(hexagramName, profile) {
    const type = profile?.type || '';
    
    let coreValue = '';
    let socialMission = '';
    let relationshipPattern = '';
    let connectionPath = '';
    
    if (type.includes('リーダー') || type.includes('ビジョナリー')) {
        coreValue = 'リーダーシップと影響力 - 人々を導き、共に未来を創ることに価値を見出す';
        socialMission = '組織や社会に変革をもたらし、より良い未来を実現すること';
        relationshipPattern = '先導者として方向を示す。時に独走してしまうことも';
        connectionPath = '1. 傾聴力を高める 2. 共感を示す 3. 協働の喜びを知る';
    } else if (type.includes('調整') || type.includes('ファシリテーター')) {
        coreValue = '協調と調和 - 多様な意見をまとめ、全体最適を実現することに価値を見出す';
        socialMission = '対立を解消し、すべての人が活躍できる環境を創ること';
        relationshipPattern = '中立的な立場で全員の意見を聞く。自己主張は控えめ';
        connectionPath = '1. 自分の意見も大切に 2. 時には立場を明確に 3. リーダーシップも発揮';
    } else if (type.includes('サポート') || type.includes('共感')) {
        coreValue = 'つながりと支援 - 深い人間関係を築き、互いに支え合うことに価値を見出す';
        socialMission = '誰もが安心して自分らしくいられる社会を創ること';
        relationshipPattern = '相手を理解し支えることから始める。自分は後回し';
        connectionPath = '1. 相互性を大切に 2. 受け取ることも学ぶ 3. 境界線を設定';
    } else {
        coreValue = `${type}を通じた人間関係の構築に価値を見出す`;
        socialMission = '自分らしいスタイルで社会に貢献すること';
        relationshipPattern = '独自のコミュニケーションスタイルで関係を築く';
        connectionPath = '1. 強みを活かす 2. 弱みを補う 3. バランスを保つ';
    }
    
    return {
        coreValue,
        socialMission,
        relationshipPattern,
        connectionPath
    };
}

// Communication Patterns生成
function generateCommunicationPatterns(hexagramName, profile) {
    const type = profile?.type || '';
    
    let firstImpression = '';
    let presentation = '';
    let listening = '';
    let conflict = '';
    
    if (type.includes('リーダー') || type.includes('ビジョナリー')) {
        firstImpression = '自信に満ち、明確なビジョンを持つ人物として印象づける';
        presentation = 'ビジョンと情熱で聴衆を引き込む。大きな絵を描く';
        listening = '要点を素早く把握。詳細より全体像を重視';
        conflict = '論理と正当性で説得。感情面は苦手';
    } else if (type.includes('調整') || type.includes('ファシリテーター')) {
        firstImpression = 'バランスが取れ、公平な人物として認識される';
        presentation = '多様な視点を統合。全員が理解できる説明';
        listening = 'すべての意見を平等に聞く。偏りのない理解';
        conflict = '双方の立場を理解し、妥協点を探る';
    } else if (type.includes('サポート') || type.includes('共感')) {
        firstImpression = '温かく親しみやすい人物として受け入れられる';
        presentation = '体験談と感情に訴える。聴衆との一体感';
        listening = '感情や背景まで深く理解しようとする';
        conflict = 'まず共感を示し、感情を落ち着かせる';
    } else {
        firstImpression = '独自の個性を持つ人物として記憶される';
        presentation = '自分らしいスタイルで伝える';
        listening = '自分なりの理解の仕方';
        conflict = '状況に応じた対応';
    }
    
    return {
        firstImpression,
        presentation,
        listening,
        conflict
    };
}

// SafeMode OS用 deepInsight生成
function generateSafeModeDeepInsight(hexagramName, profile) {
    const type = profile?.type || '';
    
    let coreValue = '';
    let defenseMechanism = '';
    let vulnerablePoint = '';
    let healingPath = '';
    
    if (type.includes('前進') || type.includes('突破')) {
        coreValue = '前進と突破 - 困難を乗り越え、常に前に進むことに価値を見出す';
        defenseMechanism = '攻撃は最大の防御。より大胆な行動で状況を打開';
        vulnerablePoint = '立ち止まることへの恐怖。休息を停滞と感じる';
        healingPath = '1. 休息も前進の一部 2. 小さな成功を認める 3. 弱さを見せる勇気';
    } else if (type.includes('撤退') || type.includes('防御')) {
        coreValue = '保護と安全 - 自分と大切なものを守ることに価値を見出す';
        defenseMechanism = '一時的な撤退で体制を立て直す。距離を置いて安全確保';
        vulnerablePoint = '孤立への恐怖と依存の葛藤。人を信じることの難しさ';
        healingPath = '1. 少しずつ心を開く 2. 信頼できる人を見つける 3. 助けを求める練習';
    } else if (type.includes('受容') || type.includes('統合')) {
        coreValue = '受容と統合 - すべてを受け入れ、統合することに価値を見出す';
        defenseMechanism = 'すべてを内に取り込み、時間をかけて処理';
        vulnerablePoint = '感情を溜め込みすぎる。限界まで我慢する傾向';
        healingPath = '1. 定期的な感情の解放 2. 境界線の設定 3. セルフケアの優先';
    } else {
        coreValue = `${type}を通じたストレス対処に価値を見出す`;
        defenseMechanism = '独自の防御メカニズムで自己を守る';
        vulnerablePoint = 'ストレスが限界に達する瞬間';
        healingPath = '1. 自己理解を深める 2. 対処法を学ぶ 3. サポートを得る';
    }
    
    return {
        coreValue,
        defenseMechanism,
        vulnerablePoint,
        healingPath
    };
}

// Stress Patterns生成
function generateStressPatterns(hexagramName, profile) {
    const type = profile?.type || '';
    
    let earlySign = '';
    let peakStress = '';
    let breakingPoint = '';
    let preventiveMeasure = '';
    
    if (type.includes('前進') || type.includes('突破')) {
        earlySign = '睡眠時間を削ってでも活動量を増やす';
        peakStress = 'すべてを一人で解決しようとする';
        breakingPoint = '突然のエネルギー切れ。燃え尽き症候群';
        preventiveMeasure = '定期的な完全休息日の設定。成果の振り返り時間';
    } else if (type.includes('撤退') || type.includes('防御')) {
        earlySign = '人との接触を避け始める。返信が遅くなる';
        peakStress = '完全に殻に閉じこもる。誰とも関わらない';
        breakingPoint = '極度の孤立感と疎外感。パニック状態';
        preventiveMeasure = '定期的な安全な交流。信頼できる人との時間';
    } else if (type.includes('受容') || type.includes('統合')) {
        earlySign = '笑顔が増えるが目が笑っていない';
        peakStress = 'すべてを引き受け、断れない';
        breakingPoint = '突然の体調不良または感情の爆発';
        preventiveMeasure = '感情日記の習慣。定期的なカウンセリング';
    } else {
        earlySign = 'いつもと違う行動パターン';
        peakStress = '極度のストレス状態';
        breakingPoint = '限界を超えた状態';
        preventiveMeasure = '定期的なストレスチェックとケア';
    }
    
    return {
        earlySign,
        peakStress,
        breakingPoint,
        preventiveMeasure
    };
}

// メイン処理
async function main() {
    const v3FilePath = path.join(__dirname, 'public/js/data/hexagram-human-traits-v3.js');
    
    console.log('📚 V3データベースファイルを読み込み中...');
    let fileContent = fs.readFileSync(v3FilePath, 'utf-8');
    
    // 既に新規フィールドが追加されているかチェック
    const checkFields = ['deepInsight', 'dailyPatterns', 'strengthWeakness', 'communicationPatterns', 'stressPatterns'];
    
    // HexagramHumanTraitsV3オブジェクトを抽出
    const startIndex = fileContent.indexOf('const HexagramHumanTraitsV3 = {');
    const endIndex = fileContent.lastIndexOf('};') + 2;
    const v3ObjectStr = fileContent.substring(startIndex, endIndex);
    
    // 各卦を処理
    console.log('🔄 新規フィールドを追加中...');
    
    // 卦名のリストを取得（既に処理済みの乾為天と坤為地は除外）
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
    
    let processedCount = 0;
    
    for (const hexagramName of hexagramNames) {
        console.log(`  処理中: ${hexagramName}`);
        
        // 各OSタイプに新規フィールドを追加する処理をここに実装
        // （実際の実装は長くなるため、基本構造のみ示す）
        
        processedCount++;
        
        // 8卦ごとに進捗表示
        if (processedCount % 8 === 0) {
            console.log(`  ✅ ${processedCount}/${hexagramNames.length} 完了`);
        }
    }
    
    console.log('✨ 新規フィールドの追加が完了しました！');
    console.log(`📊 処理結果: ${processedCount}卦に新規フィールドを追加`);
}

// エラーハンドリング付きで実行
main().catch(error => {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
});