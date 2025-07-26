# Requirements Document

## Introduction

現在の診断結果表示は横並びカード型レイアウトで情報を比較しやすいが、物語性に欠けている。ユーザーが診断結果を見るとき、自分の「人格 OS」が起動し、解析されていくプロセスを追体験するような流れをデザインすることで、単なる情報の受け取りではなく「発見と驚きのある体験」へと昇華させる。

この実装では、TripleOSResultsView を縦長の単一スクロールページとして再構築し、以下の 5 つのセクションを上から順に配置する：

1. 起動画面（Boot Screen）
2. コアエンジン分析（Core Engine Analysis）
3. GUI（Interface OS）
4. セーフモード（Safe Mode / Firewall）
5. 統合と結論（Integration & Conclusion）

スクロールに連動したアニメーションを導入し、「起動」の感覚を演出する。

## Requirements

### Requirement 1: 起動画面（Boot Screen）の実装

**User Story:** 診断完了後のユーザーとして、自分の人格 OS が起動していく体験を味わいたい。単なる情報表示ではなく、発見と驚きのある物語的な体験をしたい。

#### Acceptance Criteria

1. WHEN 診断が完了した時 THEN システムは画面全体の高さ(100vh)を占める起動画面を表示する
2. WHEN 起動画面が表示される時 THEN 「あなたは『${engineOS.osName}』の OS を搭載しています」という巨大なタイポグラフィを中央に表示する
3. WHEN 起動画面が表示される時 THEN 背面に薄く卦の SVG アニメーションを表示し、stroke-dasharray と stroke-dashoffset を使って線が描画されるアニメーションを実行する
4. WHEN ユーザーがスクロールする時 THEN 各セクションが上から順に物語的なシーケンスで表示される
5. WHEN 各セクションが画面に入る時 THEN opacity: 0 と translateY(30px)から始まり、is-visible クラス付与で opacity: 1 と translateY(0)にアニメーションする

### Requirement 2: コアエンジン分析（Core Engine Analysis）の実装

**User Story:** 診断結果を見るユーザーとして、自分の根源的な人格ドライブを理解するために、コアエンジン分析を最も目立つセクションとして見たい。

#### Acceptance Criteria

1. WHEN コアエンジンセクションが表示される時 THEN 「コアエンジン: ${engineOS.osName} (${Math.round(engineOS.strength \* 100)}%)」という見出しを高い視覚的優先度で表示する
2. WHEN コアエンジンセクションが表示される時 THEN 既存のレーダーチャート描画ロジックを統合し、「OS スペック」として提示する
3. WHEN 核心的特徴が表示される時 THEN 箇条書きではなく魅力的なキャッチフレーズとして提示する
4. WHEN 詳細情報が利用可能な時 THEN 情報過多を防ぐため、展開可能なアコーディオン UI の後ろに隠す
5. WHEN エンジン OS の名前がハイライトされる時 THEN OS テーマカラーを使用して強調表示する

### Requirement 3: GUI（Interface OS）の実装

**User Story:** 自分の人格構造を探求するユーザーとして、異なる OS コンポーネントがどのように相互作用するかを理解し、内的な動機と外的な行動の関係を見たい。

#### Acceptance Criteria

1. WHEN GUI セクションが表示される時 THEN 「GUI: ${interfaceOS.osName} (${interfaceOS.matchScore}%)」という見出しを表示する
2. WHEN GUI セクションが表示される時 THEN 「あなたの『${engineOS.osName}』エンジンは、社会と関わる際、『${interfaceOS.osName}』というインターフェースを介してその能力を発揮します」という物語的説明を表示する
3. WHEN OS 間の力学が表示される時 THEN エンジンアイコン（🔧）とインターフェースアイコン（🖥️）の間に視覚的コネクタを表示する
4. WHEN OSs 間にハーモニーが存在する時 THEN スムーズで接続された視覚要素を表示し、.dynamics-connector に harmony クラスを適用する
5. WHEN OSs 間にテンションが存在する時 THEN 衝突や摩擦を示す視覚的インジケータを表示する
6. WHEN 力学スコアが表示される時 THEN アニメーション付きプログレスバーまたは視覚的メタファーを使用する

### Requirement 4: セーフモード（Safe Mode / Firewall）の実装

**User Story:** ストレス反応について学ぶユーザーとして、セーフモード OS を保護システムとして理解し、自分の防御パターンを認識したい。

#### Acceptance Criteria

1. WHEN セーフモードセクションが表示される時 THEN 保護的なファイアウォールシステムとして紹介する
2. WHEN セーフモードの力学が表示される時 THEN エンジン OS との関係を表示し、GUI セクションと類似した構造を使用する
3. WHEN テンションが存在する時 THEN 保護的だが衝突するエネルギーを伝える視覚要素（少しショートしているようなアニメーション）を使用する
4. WHEN セーフモードの特徴が提示される時 THEN ストレス反応の文脈でフレーム化する
5. WHEN セーフモード OS の情報が表示される時 THEN safeModeOS のデータを使用し、テンションを表現する視覚的コネクタを実装する

### Requirement 5: 統合と結論（Integration & Conclusion）の実装

**User Story:** OS 発見の旅を完了するユーザーとして、すべての OS コンポーネントが自分の異なる側面としてどのように連携するかを見て、自分の多面的な性質を理解したい。

#### Acceptance Criteria

1. WHEN 結論セクションが表示される時 THEN 「『分人』としてのあなたへ」という見出しを表示する
2. WHEN 統合メッセージが表示される時 THEN 「これら 3 つの OS は、固定された人格ではなく、状況に応じて顔を出す異なる『分人』です。その多面性こそが、あなたの豊かさです。」という分人主義の思想を説明する
3. WHEN OS サマリーが表示される時 THEN 3 つの OS を別々のエンティティではなく、補完的な側面として表示する
4. WHEN 体験が終了する時 THEN 明確な次のアクション（結果をシェア、他のタイプも見る）を提供する
5. WHEN アクションコンテナが表示される時 THEN シェアボタンと探索ボタンを含む actions-container を実装する

### Requirement 6: OS テーマカラーシステムの実装

**User Story:** OS 起動シーケンスを体験するユーザーとして、各 OS タイプが独自の視覚的テーマを持つことで、自分の人格の異なる側面を区別し、つながりを感じたい。

#### Acceptance Criteria

1. WHEN エンジン OS が特定される時 THEN システムは TripleOSEngine で算出されたエンジン OS に基づき、JavaScript で body タグに data-theme="keniten"のような属性を付与する
2. WHEN OS の名前がハイライトされる時 THEN .os-name-highlight クラスでテーマカラーを使用して強調表示する
3. WHEN チャートやグラフが表示される時 THEN [data-theme="keniten"]セレクタを使って OS ごとのテーマカラーに切り替える
4. WHEN 卦のシンボルが表示される時 THEN 各卦の構造を SVG で描き、stroke-dasharray と stroke-dashoffset をアニメーションさせる
5. WHEN テーマが適用される時 THEN CSS 側で.os-name-highlight やグラフの色などを、OS ごとのテーマカラーに動的に変更する

### Requirement 7: スクロール連動アニメーションの実装

**User Story:** 人格分析をスクロールして見るユーザーとして、スムーズなアニメーションとマイクロインタラクションを体験し、実際に OS が起動していく感覚を味わいたい。

#### Acceptance Criteria

1. WHEN セクションがビューポートに入る時 THEN システムは Intersection Observer API を利用し、各セクション（.core-engine-section など）に is-visible クラスを付与してフェードインアニメーションをトリガーする
2. WHEN 数値が表示される時 THEN システムはカウントアップエフェクトをアニメーションで表示する
3. WHEN OS 接続が表示される時 THEN システムはコネクタ要素をアニメーションさせ、2 つのアイコンと、その間を繋ぐコネクタの SVG アニメーションを実行する
4. WHEN 卦の背景が表示される時 THEN システムは微細な描画アニメーションを表示し、stroke-dasharray と stroke-dashoffset を使った線描画を実行する
5. WHEN ユーザーがスクロールする時 THEN システムはラグなしでスムーズなパフォーマンスを維持し、60fps のフレームレートを目指す

### Requirement 8: レスポンシブデザインとパフォーマンスの実装

**User Story:** 異なるデバイスを使用するユーザーとして、デスクトップでもモバイルでも OS 起動シーケンスがシームレスに動作し、デバイスに関係なく同じ没入感のある体験をしたい。

#### Acceptance Criteria

1. WHEN モバイルデバイスでアクセスされる時 THEN システムは縦スクロールの物語構造を維持する
2. WHEN 異なる画面サイズで表示される時 THEN システムはタイポグラフィとスペーシングを適切に調整し、clamp()関数を使用してレスポンシブなフォントサイズを実現する
3. WHEN アニメーションがトリガーされる時 THEN システムはデスクトップとモバイルの両方でスムーズに実行する
4. WHEN タッチインタラクションが使用される時 THEN システムはモバイルジェスチャーに適切に応答する
5. WHEN 結果ページが読み込まれる時 THEN システムは LCP（Largest Contentful Paint）で Google Core Web Vitals の「Good」スコアを達成する
6. WHEN ユーザーがスクロールする時 THEN システムは理想的には 60fps のスムーズなアニメーションフレームレートを維持し、低い CLS（Cumulative Layout Shift）スコアを保つ

### Requirement 9: アクセシビリティの実装

**User Story:** 視覚障害や運動障害を持つユーザーとして、支援技術を使用して診断結果をナビゲートし理解できるようにし、他の人と同じ洞察に満ちた体験をしたい。

#### Acceptance Criteria

1. WHEN コンテンツが表示される時 THEN システムは WCAG 2.1 AA 基準を満たす十分な色のコントラストを持つ
2. WHEN ユーザーがサイトをナビゲートする時 THEN システムはすべてのインタラクティブ要素がキーボードのみで完全に操作可能であることを保証する
3. WHEN スクリーンリーダーが使用される時 THEN システムは画像、アイコン、チャートに適切な代替テキストを提供する
4. WHEN アニメーションが存在する時 THEN システムはモーションに敏感なユーザーのためにモーションを減らすまたは無効にするオプション（prefers-reduced-motion）を提供する
5. WHEN 卦の SVG アニメーションが表示される時 THEN システムは aria-label や role 属性を適切に設定し、スクリーンリーダーでの理解を支援する

### Requirement 10: ソーシャルシェア機能の実装

**User Story:** 人格 OS の結果をシェアしたいユーザーとして、他の人に診断を試してもらうための魅力的なソーシャルメディアコンテンツを生成し、自分の発見をシェアして他の人の発見を手助けしたい。

#### Acceptance Criteria

1. WHEN ユーザーがシェアボタンをクリックする時 THEN システムは OGP を使用してソーシャルメディア用のユニークなサマリー画像を生成する
2. WHEN サマリー画像が生成される時 THEN ユーザーのプライマリ OS タイプ、卦のシンボル、魅力的なキャッチフレーズを含む
3. WHEN シェアされたリンクがアクセスされる時 THEN 新しいユーザーにテストを受けてもらうため診断ランディングページに誘導する
4. WHEN ソーシャルメディアプレビューが表示される時 THEN 視覚的に魅力的で価値提案を明確に伝える
5. WHEN 結論セクションのアクションコンテナが表示される時 THEN 「結果をシェア」ボタンと「他のタイプも見る」ボタンを実装する
