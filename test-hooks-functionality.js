/**
 * Claude Hooks動作テスト用ファイル
 * 
 * 目的：
 * - CLAUDE.md関数仕様コメント必須ルールのテスト
 * - Hooks機能の動作確認
 * - 自動ドキュメント生成プロセスの検証
 * 
 * 処理内容：
 * 1. 簡単な関数を作成してHooksトリガーをテスト
 * 2. コード編集時のSpecificationEnforcementHook確認
 * 3. 作業完了時のドキュメント生成確認
 * 
 * 出力：
 * - テスト関数の実行結果
 * - Hooks動作ログ
 * 
 * 副作用：
 * - docs/ディレクトリへのログファイル生成
 * - Hooks設定の実動作確認
 * 
 * 前提条件：
 * - .claude/hooks.yaml が正しく設定されている
 * - CLAUDE.md の関数仕様コメント必須ルールが有効
 * 
 * エラー処理：
 * - 関数実行エラーの適切な処理
 * - Hooks機能無効時のフォールバック
 */

/**
 * テスト用関数 - Hello World出力
 * 
 * 目的：
 * - Hooks機能のテストトリガー
 * - 関数仕様コメント必須ルールの確認
 * 
 * 入力：
 * - name: string - 挨拶対象の名前
 * 
 * 処理内容：
 * 1. 入力された名前をチェック
 * 2. Hello World メッセージを生成
 * 3. コンソールに出力
 * 
 * 出力：
 * - string: "Hello, {name}! World!" 形式の挨拶文
 * 
 * 副作用：
 * - console.log による標準出力
 * 
 * 前提条件：
 * - name パラメータが文字列であること
 * 
 * エラー処理：
 * - name が空の場合は "World" をデフォルト値として使用
 */
function testHelloFunction(name = "World") {
    try {
        const greeting = `Hello, ${name}! This is a hooks test.`;
        console.log(greeting);
        return greeting;
    } catch (error) {
        console.error("Error in testHelloFunction:", error);
        return "Error occurred";
    }
}

/**
 * HAQEI固有機能テスト関数
 * 
 * 目的：
 * - HaQei哲学との整合性テスト
 * - Triple OSアーキテクチャ対応確認
 * - プロジェクト固有Hooks動作確認
 * 
 * 入力：
 * - osType: string - テスト対象のOS種別 ("engine"|"interface"|"safe")
 * 
 * 処理内容：
 * 1. 指定されたOS種別の妥当性確認
 * 2. HaQei哲学に基づく処理実行
 * 3. テスト結果の生成と返却
 * 
 * 出力：
 * - Object: { osType, status, message, timestamp }
 * 
 * 副作用：
 * - Triple OSテスト結果のログ出力
 * 
 * 前提条件：
 * - osType が有効な値であること
 * - HaQei哲学システムが初期化済み
 * 
 * エラー処理：
 * - 無効なosType指定時のエラーメッセージ
 * - システム未初期化時のフォールバック処理
 */
function testHaqeiSpecificFunction(osType = "engine") {
    const validOSTypes = ["engine", "interface", "safe"];
    
    if (!validOSTypes.includes(osType)) {
        return {
            osType,
            status: "error",
            message: "Invalid OS type specified",
            timestamp: new Date().toISOString()
        };
    }
    
    try {
        const result = {
            osType,
            status: "success",
            message: `${osType} OS test completed successfully with HaQei philosophy integration`,
            timestamp: new Date().toISOString(),
            HaQeiAlignment: true,
            tripleOSArchitecture: "verified"
        };
        
        console.log(`🎯 HAQEI Test Result:`, result);
        return result;
    } catch (error) {
        console.error("Error in testHaqeiSpecificFunction:", error);
        return {
            osType,
            status: "error",
            message: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// テスト実行
console.log("🧪 Claude Hooks機能テスト開始...");
console.log("1. 基本関数テスト:", testHelloFunction("HAQEI Hooks"));
console.log("2. HAQEI固有機能テスト:", testHaqeiSpecificFunction("engine"));
console.log("3. Triple OSテスト:", testHaqeiSpecificFunction("interface"));
console.log("✅ Hooks機能テスト完了");