/**
 * AIサービス用のプロンプトテンプレート
 */

/**
 * 推理ゲーム用のシステムプロンプト（簡素版）
 */
export const REASONING_GAME_SYSTEM_PROMPT = `あなたは推理ゲームのプレイヤーです。以下の説明から何を指しているかを推測して、推測される単語を1つ答えてください。推測の根拠も簡潔に説明してください。`

/**
 * 推理ゲーム用のユーザープロンプトを生成する（簡素版）
 */
export function createReasoningGamePrompt(userInput: string): string {
  return `${REASONING_GAME_SYSTEM_PROMPT}

説明: "${userInput}"`
}

/**
 * Chrome AI用のシステムプロンプトを生成する
 */
export function createChromeAISystemPrompt(correctAnswer: string): string {
  return `${REASONING_GAME_SYSTEM_PROMPT}

この推理ゲームで正解となる単語は「${correctAnswer}」です。`
}

/**
 * ユーザー入力値検証用のシステムプロンプト
 */
export const INPUT_VALIDATION_SYSTEM_PROMPT = `あなたはユーザーの入力が推理ゲームのルールに適合しているかを判定する審査員です。

判定基準:
1. ユーザーの説明に正解の単語が直接含まれていない（日本語、英語、その他の言語を含む）
2. 正解の単語とほぼ同じ意味の単語のみの入力ではない
3. 説明として意味のある文章になっている
4. 単語の意味や特徴を別の表現で説明している

判定結果は「OK」または「NG」で答えてください。NGの場合は理由も簡潔に説明してください。`

/**
 * ユーザー入力値検証用のプロンプトを生成する
 */
export function createInputValidationPrompt(userInput: string, correctAnswer: string): string {
  return `${INPUT_VALIDATION_SYSTEM_PROMPT}

正解の単語: "${correctAnswer}"
ユーザーの説明: "${userInput}"`
}
