# コーディング規約

## バレルファイル（index.ts）の禁止

プロジェクト全体において、バレルファイル（index.ts）の使用を**禁止**します。

### 理由
- バンドルサイズの増大
- ビルド時間の増加
- 依存関係の複雑化
- デッドコードエリミネーションの阻害

### 代替方法
- 必要なファイルから直接インポートする
- 具体的なファイルパスを指定する

### 例

**禁止されるパターン:**
```typescript
// ❌ バレルファイルからのインポート
import { GameState } from '../types'
import { getRandomTopic } from '../data'
```

**推奨されるパターン:**
```typescript
// ✅ 直接ファイルからのインポート
import { GameState } from '../types/gameTypes'
import { getRandomTopic } from '../data/topics'
```

### 適用範囲
- 新規作成するすべてのファイル
- 既存ファイルの修正時
- リファクタリング時

このルールは厳格に適用し、コードレビュー時に必ずチェックすること。