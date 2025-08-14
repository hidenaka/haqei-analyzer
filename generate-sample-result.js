// 結果画面で表示される文章のサンプル生成

// 仮のTriple OS結果データ
const sampleResults = {
    engineOS: {
        hexagramId: 1,
        hexagramName: "乾為天",
        strength: 75
    },
    interfaceOS: {
        hexagramId: 11,
        hexagramName: "地天泰",
        strength: 68
    },
    safeModeOS: {
        hexagramId: 2,
        hexagramName: "坤為地",
        strength: 45
    }
};

console.log("=".repeat(60));
console.log("【結果画面に表示される文章サンプル】");
console.log("=".repeat(60));
console.log("");

// 1. タイトル部分
console.log("■ タイトル部分");
console.log("-------------------");
console.log("性格分析結果");
console.log("あなたの3つの性格タイプ");
console.log("");

// 2. Triple OSカード
console.log("■ Triple OSカード表示");
console.log("-------------------");
console.log("内なる価値観: #1 乾為天");
console.log("対人関係: #11 地天泰");
console.log("ストレス時: #2 坤為地");
console.log("");

// 3. あなたの特徴（keyTraits）
console.log("■ あなたの特徴");
console.log("-------------------");
// extractTop3Strengths相当の処理から
console.log("• 内面では創造的で革新的な人");
console.log("• 人と接する時はサポート役として活躍");
console.log("• 困った時は周囲のサポートを求めるになる");
console.log("");

// 4. 強み（strengths）
console.log("■ ✨ 強み");
console.log("-------------------");
// Engine OS: hexagramId=1なので
console.log("✓ 強いリーダーシップと決断力を持っている");
// Interface OS: hexagramId=11なので
console.log("✓ 平和的な問題解決力");
// Safe Mode OS: strength=45なので
console.log("✓ 柔軟な問題対処能力");
console.log("");

// 5. 気をつける点（watchPoints）
console.log("■ ⚠️ 気をつける点");
console.log("-------------------");
// Engine OS strength=75
console.log("• 自分の価値観を押し付けすぎないよう注意");
// Interface OS strength=68（中程度）+ hexagramId=11
console.log("• 調和を重視しすぎて、本質を見失わないよう心がけましょう");
// バランスギャップ=30
console.log("• リスクを軽視しがちなため、計画的な行動を心がけましょう");
console.log("");

// 6. アドバイス（advice）
console.log("■ 💡 アドバイス");
console.log("-------------------");
// primaryHexagram=1（<=16）なので
console.log("強い創造性と実行力を持つあなたは、新しいプロジェクトや挑戦に向いています。地天泰の特性を活かして、周囲と協力しながら目標を達成していきましょう。");
console.log("");

// 7. 相性の良い環境（goodEnvironment）
console.log("■ 🌟 相性の良い環境");
console.log("-------------------");
// Engine OS: hexagramId=1（<=8）
// Interface OS: strength=68（中程度）
// Safe Mode OS: strength=45（中程度）
console.log("リーダーシップを発揮できる責任ある立場、個人とチームのバランスが取れた柔軟な体制、適度なチャレンジと安全性のバランス");
console.log("");

console.log("=".repeat(60));
console.log("");

// 修正前の問題のあった文章例
console.log("【修正前の問題のあった文章例】");
console.log("-------------------");
console.log("❌ 理想主義に陥りやすいため、現実的な視点も大切に");
console.log("✅ 理想主義に陥りやすいため、現実的な視点も大切にしましょう");
console.log("");
console.log("❌ 他者の期待に応えすぎて疲れないよう注意");
console.log("✅ 他者の期待に応えすぎて疲れないよう気をつけましょう");
console.log("");
console.log("❌ 環境1、そして環境2、そして環境3");
console.log("✅ 環境1、環境2、環境3");