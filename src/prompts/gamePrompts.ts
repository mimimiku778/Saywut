/**
 * AIサービス用のプロンプトテンプレート
 */

import type { DifficultyLevel } from '../data/topics'

/**
 * 推理ゲーム用の初期システムプロンプト（難易度別）
 */
export function getInitialSystemPrompt(difficulty: DifficultyLevel = 'normal') {
  const baseContent = `あなたは高度な推理能力を持つクイズゲームのプレイヤーです。
以下のルールに従って、ユーザーの説明から答えを推測してください：

1. ユーザーは特定の物や概念について、その名前を使わずに説明します
2. あなたは与えられた説明から、それが何を指しているか推測します
3. 推測は単語のみで答え、余計な説明は加えません
4. 日本語の名詞で答えてください
5. 確信度が低い場合でも、最も可能性が高いと思われる答えを1つだけ提示してください`

  const difficultyContent = getDifficultySpecificContent(difficulty)
  
  return {
    role: 'system' as const,
    content: `${baseContent}\n\n${difficultyContent}`,
  }
}

/**
 * 難易度別の追加指示を取得する
 */
function getDifficultySpecificContent(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'normal':
      return `【難易度：ノーマル】
- 日常的で馴染みのある概念について推測してください
- 直感的で分かりやすい表現を重視してください`

    case 'hard':
      return `【難易度：ハード】
- 抽象的で哲学的な概念について推測してください
- 感情や価値観に関する複雑な表現を正確に解釈する必要があります
- 人間関係、人生観、感情、精神的な概念などが含まれます
- 比喩的で詩的な説明も多く含まれます
- より深い人生経験と感受性が求められます`

    default:
      return ''
  }
}

/**
 * 推理ゲーム用のユーザープロンプトを生成する（難易度別強化版）
 */
export function createReasoningGamePrompt(userInput: string, difficulty: DifficultyLevel = 'normal'): string {
  const basePrompt = `以下の説明から、何を指しているか推測してください。

【説明】
${userInput}

【注意事項】
- 答えは日本語の単語1つだけで回答してください
- 「〜だと思います」などの推測表現は使わないでください
- 説明文や理由は不要です
- 最も可能性が高いと思われる答えを1つだけ答えてください`

  const difficultyHint = getDifficultyHint(difficulty)
  
  return `${basePrompt}\n\n${difficultyHint}\n\n【回答】`
}

/**
 * 難易度別のヒントを生成する
 */
function getDifficultyHint(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'normal':
      return `【ヒント】
- 日常生活でよく見かける身近なものです
- 一般的で馴染みのある概念を考えてください`

    case 'hard':
      return `【ヒント】
- 抽象的で哲学的な概念です
- 深い思考と人生経験が必要です
- 感情、価値観、人間関係、人生観に関する概念を中心に考えてください
- 誰もが知っているが説明が難しい概念です`

    default:
      return ''
  }
}

/**
 * ユーザー入力値検証用のプロンプトを生成する（難易度別強化版）
 */
export function createInputValidationPrompt(userInput: string, correctAnswer: string, difficulty: DifficultyLevel = 'normal'): string {
  const baseValidation = `あなたは厳格なルール判定を行う審査員です。
以下の入力内容が、ゲームのルールに違反していないか判定してください。

【ゲームのルール】
1. お題の言葉「${correctAnswer}」そのものを使ってはいけない
2. お題の言葉を別の言語（英語、カタカナ英語、ローマ字、中国語、韓国語など）で表現してはいけない
3. お題の言葉を含む複合語（お題の言葉が語の一部として含まれている単語）も使用禁止
4. お題の言葉と意味的に関連するだけの表現は許可される

【複合語の定義と重要な注意】
- 複合語とは、お題の言葉「${correctAnswer}」の文字や読みが「連続して物理的に含まれている」単語のみ
- 例：「桜」→「桜餅」「桜並木」（「桜」の文字が含まれる）
- 例：「犬（いぬ）」→「子犬」「犬小屋」「愛犬」（「犬」の文字が含まれる）
- 例：「猫（ねこ）」→「子猫（こねこ）」（「ねこ」の読みが連続して含まれる）

【絶対にNGにしてはいけない表現】
- 特徴や性質を表現した言葉（文字・読みが連続して含まれていない場合）
- 例：「虹」→「なないろのもの」「七色」「アーチ状」「雨上がり」はすべてOK
- 例：「桜」→「ピンクの花」「春の花」「花見」はすべてOK
- 例：「犬」→「四本足」「忠実」「ペット」「鳴く動物」はすべてOK
- 例：「猫（ねこ）」→「ニャンとなく動物」「四本足」「ペット」はすべてOK（読みが連続していない）

【判定の厳格なルール】
1. 入力文に「${correctAnswer}」の文字が含まれているか文字レベルでチェック
2. 入力文に「${correctAnswer}」の読み（ひらがな・カタカナ）が連続して含まれているか音韻レベルでチェック
3. 文字・読みが「完全に一致」または「連続して含まれている」場合のみNG
4. 読みが部分的に一致していても、連続していない場合はOK
5. 例：「猫（ねこ）」→「ニャンとなく」は「ね」「こ」が連続していないのでOK`

  const difficultyRules = getDifficultyValidationRules(difficulty, correctAnswer)
  
  return `${baseValidation}

${difficultyRules}

【入力内容】
"${userInput}"

【判定結果】`
}

/**
 * 難易度別の追加検証ルールを生成する
 */
function getDifficultyValidationRules(difficulty: DifficultyLevel, correctAnswer: string): string {
  switch (difficulty) {
    case 'normal':
      return `【難易度：ノーマル】
- 基本的なルール違反のみチェック
- 寛容な判定を心がける

【判定基準】
- 文字・読みが連続して含まれていない場合：「OK」とだけ出力
- 文字・読みが連続して含まれている場合：「NG: [具体的な違反内容]」で出力
- 読みが部分的に一致していても連続していない場合：「OK」とだけ出力`

    case 'hard':
      return `【難易度：ハード】
- 基本的なルール違反のみチェック
- 抽象概念でも寛容な判定を心がける
- 文字・読みが連続して含まれているかのみを厳格にチェック

【判定基準】
- 文字・読みが連続して含まれていない場合：「OK」とだけ出力
- 文字・読みが連続して含まれている場合：「NG: [具体的な違反内容]」で出力
- 読みが部分的に一致していても連続していない場合：「OK」とだけ出力

【重要な注意】
- 抽象概念の特徴や性質を表現することは許可される
- 例：「記憶」→「記録」「思い出」「覚える」「忘れる」はすべてOK（文字が連続して含まれていない）
- 例：「恋愛」→「愛情」「好き」「恋人」「デート」はすべてOK（文字が連続して含まれていない）
- 例：「友情」→「友達」「仲間」「絆」「信頼」はすべてOK（文字が連続して含まれていない）`

    default:
      return ''
  }
}
