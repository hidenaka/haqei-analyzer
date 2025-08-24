# V3データベース 未使用フィールド一覧 - 2025-08-22

## 現在使用しているフィールド

### 基本情報
- `id` - 卦番号
- `symbol` - 卦の記号
- `element` - 五行
- `nickname` - ニックネーム  
- `emoji` - 絵文字

### OS別基本データ（Engine/Interface/SafeMode共通）
- `profile` - プロフィール（現在は文字列として使用）
- `cognition` - 認知パターン
- `action` - 行動パターン
- `decision` - 意思決定
- `advice` - アドバイス

## 未使用の豊富なフィールド

### Engine OS専用フィールド
1. **normalState** - 通常状態
   - `whatHappens` - 何が起きているか
   - `example` - 具体例
   - `energyLevel` - エネルギーレベル

2. **superMode** - スーパーモード
   - `when` - いつ発動するか
   - `whatHappens` - 何が起きるか
   - `example` - 具体例
   - `energyLevel` - エネルギーレベル

3. **restMode** - 休息モード
   - `whatHappens` - 何が起きているか
   - `howToRest` - 休み方
   - `note` - 注意点

4. **maintenance** - メンテナンス
   - `whatYouNeed` - 必要なもの
   - `howToCharge` - 充電方法
   - `warning` - 警告
   - `tip` - ヒント

### Interface OS専用フィールド
1. **howToTalk** - 話し方
   - `style` - スタイル
   - `example` - 例
   - `goodAt` - 得意なこと
   - `notGoodAt` - 苦手なこと

2. **bestEnvironment** - 最適環境
   - `where` - どこで
   - `example` - 例
   - `withWho` - 誰と
   - `avoid` - 避けるべきこと

3. **relationshipTips** - 関係性のヒント
   - `strength` - 強み
   - `weakness` - 弱み
   - `advice` - アドバイス

### SafeMode OS専用フィールド
1. **stressResponse** - ストレス反応
   - `whatYouDo` - 何をするか
   - `example` - 例
   - `goodPoint` - 良い点
   - `badPoint` - 悪い点

2. **emergencyMode** - 緊急モード
   - `whatHappens` - 何が起きるか
   - `example` - 例
   - `recovery` - 回復方法
   - `timeToRecover` - 回復時間

3. **howToRecover** - 回復方法
   - `bestWay` - 最良の方法
   - `example` - 例
   - `environment` - 環境
   - `support` - サポート

### 全体バランス
- **osBalance** - OSバランス
  - `idealBalance` - 理想的なバランス
  - `whenBalanced` - バランスが取れている時
  - `whenImbalanced` - バランスが崩れている時
  - `tip` - ヒント

## 活用可能性

これらの未使用フィールドを活用することで、以下のような機能拡張が可能：

1. **エネルギーレベル表示**
   - normalState, superMode のenergyLevelを視覚化
   - プログレスバーやゲージでの表現

2. **状況別アドバイス**
   - superMode のwhen条件を表示
   - emergencyMode の回復方法を提案

3. **環境適性診断**
   - bestEnvironment データから最適な職場環境を提案
   - avoid情報から注意すべき環境を警告

4. **メンテナンスガイド**
   - maintenance情報から日常のセルフケア方法を提案
   - warning情報から注意点を表示

5. **関係性アドバイス**
   - relationshipTips から人間関係の改善提案
   - howToTalk から効果的なコミュニケーション方法

6. **ストレス管理**
   - stressResponse からストレス時の行動パターン認識
   - howToRecover から個別の回復方法提案

7. **バランス診断**
   - osBalance から現在のバランス状態を診断
   - 理想的なバランスへの改善提案

これらのデータは非常に豊富で、まだ10%程度しか活用できていない状況です。