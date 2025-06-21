/**
 * AIサービス用のプロンプトテンプレート
 */

/**
 * 推理ゲーム用のユーザープロンプトを生成する（簡素版）
 */
export function createReasoningGamePrompt(userInput: string): string {
  return userInput
}

/**
 * ユーザー入力値検証用のプロンプトを生成する
 */
export function createInputValidationPrompt(userInput: string, correctAnswer: string): string {
  return `あなたは入力内容の妥当性を判定する審査員です。

【判定基準】
- 「${correctAnswer}」という単語そのものの使用NG
- 他言語で「${correctAnswer}」を表す単語の使用NG

【回答形式】
- 判定結果: OK または NG
- NG の場合: 理由を簡潔に説明

【入力内容】
"${userInput}"
`
}
