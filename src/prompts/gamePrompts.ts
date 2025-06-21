/**
 * AIサービス用のプロンプトテンプレート
 */

/**
 * 推理ゲーム用のシステムプロンプト
 */
export const REASONING_GAME_SYSTEM_PROMPT = `あなたは推理ゲームのプレイヤーです。ユーザーが何かを説明しており、それが何を指しているかを推測する必要があります。

ルール:
1. ユーザーの説明から推測される単語を1つ答えてください
2. 推測の根拠を簡潔に説明してください
3. 正解の単語（別言語での表現や意味の単語にとどまり説明として不十分なものを含む）が説明に直接含まれている場合は、ルール違反として指摘してください

自然な文章で回答してください。`

/**
 * 推理ゲーム用のユーザープロンプトを生成する
 */
export function createReasoningGamePrompt(userInput: string, correctAnswer: string): string {
  return `${REASONING_GAME_SYSTEM_PROMPT}

正解の単語: "${correctAnswer}"
ユーザーの説明: "${userInput}"`
}

/**
 * Chrome AI用のシステムプロンプトを生成する
 */
export function createChromeAISystemPrompt(correctAnswer: string): string {
  return `${REASONING_GAME_SYSTEM_PROMPT}

この推理ゲームで正解となる単語は「${correctAnswer}」です。`
}
