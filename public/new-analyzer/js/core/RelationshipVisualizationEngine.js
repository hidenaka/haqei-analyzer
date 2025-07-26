// RelationshipVisualizationEngine.js - 関係性可視化エンジン
// HaQei Analyzer - Relationship Visualization Engine
//
// 依存関係:
// - CompatibilityType (グローバル変数として compatibility_definition.js から提供される必要があります)
// - InternalCompatibilityEngine (コンストラクタで注入)
//
// 使用方法:
// const engine = new RelationshipVisualizationEngine(internalCompatibilityEngineInstance);

class RelationshipVisualizationEngine {
  constructor(internalCompatibilityEngine) {
    if (!internalCompatibilityEngine) {
      throw new Error(
        "RelationshipVisualizationEngineにはInternalCompatibilityEngineインスタンスが必要です。"
      );
    }

    // CompatibilityType の依存関係チェック
    if (typeof CompatibilityType === "undefined") {
      console.warn(
        "⚠️ CompatibilityType が定義されていません。compatibility_definition.js が読み込まれていることを確認してください。"
      );
      // フォールバック定義
      window.CompatibilityType = {
        CONFLICT: "CONFLICT",
        TENSION: "TENSION",
        HARMONY: "HARMONY",
        SYNERGY: "SYNERGY",
        CHAOS: "CHAOS",
      };
    }

    this.internalCompatibilityEngine = internalCompatibilityEngine;
  }

  /**
   * 3つのOS間の関係性を分析し、可視化に必要なデータを生成する
   * @param {number} engineOsId - エンジンOSの卦ID
   * @param {number} interfaceOsId - インターフェースOSの卦ID
   * @param {number} safeModeOsId - セーフモードOSの卦ID
   * @returns {Object} 可視化データ
   */
  analyzeRelationships(engineOsId, interfaceOsId, safeModeOsId) {
    const compatibility =
      this.internalCompatibilityEngine.analyzeTripleOSCompatibility(
        engineOsId,
        interfaceOsId,
        safeModeOsId
      );

    const { engineInterface, engineSafeMode, interfaceSafeMode } =
      compatibility;

    // 相互作用図データ
    const interactionData = [
      { source: "Engine", target: "Interface", compatibility: engineInterface },
      { source: "Engine", target: "SafeMode", compatibility: engineSafeMode },
      {
        source: "Interface",
        target: "SafeMode",
        compatibility: interfaceSafeMode,
      },
    ];

    // バランスチャートデータ（例：三角形の頂点座標や円のセグメントデータ）
    // これは抽象的なデータであり、具体的な描画はUI側で行う
    const balanceChartData = this._generateBalanceChartData(compatibility);

    // 状況による切り替わりパターン（ここでは簡略化）
    const switchingPatterns = this._generateSwitchingPatterns(compatibility);

    return {
      interactionData,
      balanceChartData,
      switchingPatterns,
      overallCompatibility: compatibility.overallSummary,
      overallAdvice: compatibility.overallAdvice,
    };
  }

  /**
   * バランスチャートのデータを生成するヘルパーメソッド
   * @param {Object} compatibility - 相性分析結果
   * @returns {Object} バランスチャートデータ
   */
  _generateBalanceChartData(compatibility) {
    // 例: 各OSの相性スコアを正規化してバランスポイントを計算
    const eiScore =
      compatibility.engineInterface.synergy -
      compatibility.engineInterface.conflict;
    const esScore =
      compatibility.engineSafeMode.synergy -
      compatibility.engineSafeMode.conflict;
    const isScore =
      compatibility.interfaceSafeMode.synergy -
      compatibility.interfaceSafeMode.conflict;

    // スコアを0-1の範囲に正規化
    const normalize = (score) => (score + 1) / 2; // -1から1のスコアを0から1に変換

    return {
      enginePoint: normalize(eiScore + esScore) / 2, // 例示的な計算
      interfacePoint: normalize(eiScore + isScore) / 2,
      safeModePoint: normalize(esScore + isScore) / 2,
      // 将来的にはより複雑な幾何学的計算や、レーダーチャート用のデータなどを生成
    };
  }

  /**
   * 状況によるOSの切り替わりパターンを生成するヘルパーメソッド
   * @param {Object} compatibility - 相性分析結果
   * @returns {Array<Object>} 切り替わりパターン
   */
  _generateSwitchingPatterns(compatibility) {
    const patterns = [];

    // 例: 葛藤がある場合に、どのようにOSが切り替わるか
    if (compatibility.engineInterface.type === CompatibilityType.CONFLICT) {
      patterns.push({
        situation: "エンジンとインターフェースの間に意見の対立がある場合",
        description:
          "エンジンOSが主導権を握ろうとし、インターフェースOSが抵抗するパターンが見られます。セーフモードOSが過剰に反応し、内向的になる可能性があります。",
        advice:
          "互いの視点を理解し、共通の目標に焦点を当てることで、建設的な解決策を見出すことができます。",
      });
    }

    if (compatibility.engineSafeMode.type === CompatibilityType.TENSION) {
      patterns.push({
        situation: "エンジンとセーフモードの間に緊張がある場合",
        description:
          "内的な不安や自己防衛が、本来のエンジンの力を抑制する可能性があります。",
        advice:
          "セーフモードOSのメッセージに耳を傾け、その根源にある感情を理解することで、より健全な自己表現が可能になります。",
      });
    }

    // 全体的な相性に基づくパターン
    if (compatibility.overallAdvice.includes("大胆な挑戦")) {
      patterns.push({
        situation: "新しい挑戦に直面した時",
        description:
          "エンジンOSが先導し、インターフェースOSが柔軟に対応、セーフモードOSが安定を保ち、全体としてスムーズに前進します。",
        advice: "この好循環を意識し、積極的に行動範囲を広げましょう。",
      });
    }

    return patterns;
  }
}
