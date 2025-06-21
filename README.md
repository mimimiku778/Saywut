# 🤖 AIクイズゲーム (React版)

AIに言葉を当てさせるシンプルなクイズゲーム - React(Typescript) + Viteで完全リニューアル

## ✨ 特徴

- **シンプルな操作**: お題の言葉を使わずに特徴を説明するだけ
- **デュアルAIサポート**: OpenAI API と Chrome Built-in AI (Gemini Nano) の両方に対応
- **AIサービス切り替え**: リアルタイムでAIサービスを切り替え可能
- **自動フォールバック**: Chrome AIが利用できない場合は自動的にOpenAI APIに切り替え
- **完全分離設計**: 各AIサービスが独立しており、追加・削除が容易
- **レスポンシブデザイン**: PC・スマホ両対応
- **Apple風UI**: 美しく直感的なデザイン
- **リアルタイム分析**: AIが理由付きで回答

## 🤖 AIエンジン

### Chrome Built-in AI (Gemini Nano) - デフォルト
- ローカル環境での推奨オプション
- インターネット接続不要
- プライバシー保護
- 高速応答
- **デフォルトで選択されます**

### OpenAI API (GPT-4)
- 本番環境での推奨オプション  
- 高精度な推論
- 豊富な知識ベース
- APIキーが必要

## 🎮 遊び方

1. **AIサービスを選択**: 画面上部でGemini NanoまたはOpenAI GPT-4を選択
2. **お題を確認**: 画面に表示されたお題の言葉を確認
3. **特徴を説明**: お題の言葉を使わずに特徴を入力
4. **AIが推測**: AIがユーザーの説明から答えを推測
5. **結果を確認**: AIの推測が正解かどうかを確認

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
- **アーキテクチャ**: 完全分離設計、ファクトリーパターン

## 🚀 セットアップ

### 環境設定

1. `.env`ファイルを作成（`.env.example`を参考に）:
```bash
# デフォルトでChrome Built-in AIを使用
VITE_USE_CHROME_AI=true

# OpenAI API設定（オプション）
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

2. Chrome Built-in AIを使用する場合:
   - Chrome Canary または Dev版を使用
   - `chrome://flags/#prompt-api-for-gemini-nano` を有効化
   - `chrome://flags/#optimization-guide-on-device-model` を有効化

3. OpenAI APIを使用する場合:
   - [OpenAI Platform](https://platform.openai.com/api-keys)でAPIキーを取得
   - `.env`ファイルまたはUI上でAPIキーを設定

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
├── components/           # Reactコンポーネント
│   ├── Header.tsx       # ヘッダー・スコア表示
│   ├── GameBoard.tsx    # メインゲーム画面
│   ├── ResultDisplay.tsx # 結果表示
│   ├── GameRules.tsx    # ルール説明
│   └── AIServiceSelector.tsx # AIサービス選択UI
├── hooks/
│   └── useGameState.ts  # ゲーム状態管理
├── services/            # AIサービス管理
│   ├── types.ts         # 共通インターフェース
│   ├── baseAIService.ts # 基底クラス
│   ├── chromeAIService.ts # Chrome AI実装
│   ├── openAIService.ts # OpenAI API実装
│   └── aiService.ts     # シンプルなファクトリー関数群
├── types/
│   └── index.ts         # 型定義
├── App.tsx              # メインアプリ
├── main.tsx             # エントリーポイント
└── index.css            # スタイル
```

## ✨ 実装済み機能

- ✅ レスポンシブなApple風UI
- ✅ **シンプルなAIサービス設計（毎回新しいインスタンス作成）**
- ✅ **リアルタイムAIサービス切り替え**
- ✅ **Chrome Built-in AI (Gemini Nano) サポート**
- ✅ **OpenAI API (GPT-4) サポート**
- ✅ **自動フォールバック機能**
- ✅ ゲーム状態管理
- ✅ スコア・正答率の追跡
- ✅ リアルタイムフィードバック
- ✅ 複数のお題（30種類）
- ✅ ルール違反の検出（お題の言葉を使用した場合）
- ✅ アニメーション・トランジション効果
- ✅ 確信度表示
- ✅ **UI上でのAPIキー設定**

## 🔮 今後の拡張予定

- [ ] 他のAIサービス追加（Anthropic Claude、Google Gemini API等）
- [ ] 難易度レベル選択
- [ ] お題カテゴリー選択
- [ ] ゲーム履歴の保存
- [ ] マルチプレイヤー対応
- [ ] プラグイン形式でのAIサービス追加機能
