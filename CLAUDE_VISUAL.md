# Claude Code Visual Development Guidelines

## 🎨 HTML/CSS開発ルール

### 1. 必須確認事項
- [ ] 既存のCSSクラスを確認してから新規作成
- [ ] デザイントークン（色、spacing）を使用
- [ ] レスポンシブ対応（mobile-first）
- [ ] アクセシビリティ（ARIA属性）

### 2. 開発フロー
```
1. 既存コンポーネント確認
2. スタイルガイド参照
3. 実装
4. スクリーンショット確認
5. 修正
```

### 3. 検証コマンド
```bash
# 開発サーバー起動
npm run dev

# ビジュアルテスト
npm run test:visual

# スクリーンショット生成
npm run screenshot
```

### 4. よくある間違いと対策

#### ❌ 間違い例
```css
/* 絶対値使用 */
.container {
  width: 1200px;
  margin: 20px;
}
```

#### ✅ 正しい例
```css
/* 相対値・CSS変数使用 */
.container {
  width: 100%;
  max-width: var(--max-width, 1200px);
  margin: var(--spacing-md);
}
```

### 5. Tailwind CSS使用時
```jsx
// 必ず既存のユーティリティクラスを優先
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  {/* カスタムCSSは最小限に */}
</div>
```

### 6. 必須テスト
- Chrome DevTools（モバイル表示）
- クロスブラウザ（Chrome, Safari, Firefox）
- ダークモード対応
- print CSS確認

### 7. パフォーマンス
- CSS in JSは避ける
- 不要なre-renderを防ぐ
- CSSアニメーションは`transform`と`opacity`のみ