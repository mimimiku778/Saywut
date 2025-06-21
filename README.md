# 🤖 AIクイズゲーム (React版)

AIに言葉を当てさせるシンプルなクイズゲーム - React(Typescript) + Viteで完全リニューアル

## ✨ 特徴

- **シンプルな操作**: お題の言葉を使わずに特徴を説明するだけ
- **デュアルAIサポート**: OpenAI API と Chrome Built-in AI (Gemini Nano) の両方に対応
- **自動フォールバック**: Chrome AIが利用できない場合は自動的にOpenAI APIに切り替え
- **レスポンシブデザイン**: PC・スマホ両対応
- **Apple風UI**: 美しく直感的なデザイン
- **リアルタイム分析**: AIが理由付きで回答

## 🤖 AIエンジン

### Chrome Built-in AI (Gemini Nano) 
- ローカル環境での推奨オプション
- インターネット接続不要
- プライバシー保護
- 高速応答

### OpenAI API (GPT-4)
- 本番環境での推奨オプション  
- 高精度な推論
- 豊富な知識ベース
- APIキーが必要

## 🎮 遊び方

1. **お題を確認**: 画面に表示されたお題の言葉を確認
2. **特徴を説明**: お題の言葉を使わずに特徴を入力
3. **AIが推測**: AIがユーザーの説明から答えを推測
4. **結果を確認**: AIの推測が正解かどうかを確認

### 例
- **お題**: 桜
- **良い説明**: "春に咲くピンクの美しい花"
- **悪い説明**: "桜は日本の花です" (お題の言葉を使用)

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **AIエンジン**: OpenAI API + Chrome Built-in AI
- **言語**: TypeScript

## 🚀 セットアップ

### 環境設定

1. `.env`ファイルを作成:
```bash
# OpenAI API設定
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_USE_CHROME_AI=true
```

2. Chrome Built-in AIを使用する場合:
   - Chrome Canary または Dev版を使用
   - `chrome://flags/#prompt-api-for-gemini-nano` を有効化
   - `chrome://flags/#optimization-guide-on-device-model` を有効化

### インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 📁 プロジェクト構成

```
src/
├── components/        # Reactコンポーネント
│   ├── Header.tsx    # ヘッダー・スコア表示
│   ├── GameBoard.tsx # メインゲーム画面
│   ├── ResultDisplay.tsx # 結果表示
│   └── GameRules.tsx # ルール説明
├── hooks/
│   └── useGameState.ts # ゲーム状態管理
├── services/
│   └── aiService.ts  # AIサービス（モック）
├── types/
│   └── index.ts      # 型定義
├── App.tsx           # メインアプリ
├── main.tsx          # エントリーポイント
└── index.css         # スタイル
```

## ✨ 実装済み機能

- ✅ レスポンシブなApple風UI
- ✅ ゲーム状態管理
- ✅ スコア・正答率の追跡
- ✅ モックAIによる推測システム
- ✅ リアルタイムフィードバック
- ✅ 複数のお題（12種類）
- ✅ ルール違反の検出（お題の言葉を使用した場合）
- ✅ アニメーション・トランジション効果
- ✅ 高度なパターンマッチング（複数レベルの推論）
- ✅ 確信度表示
- ✅ 多様なAI回答パターン

## 🔮 今後の拡張予定

- [ ] 実際のLLM API連携
- [ ] 難易度レベル選択
- [ ] お題カテゴリー選択
- [ ] ゲーム履歴の保存
- [ ] マルチプレイヤー対応
