/**
 * ゲーム全体で使用する定数
 */

/**
 * 信頼度の範囲
 */
export const CONFIDENCE = {
  MIN: 0.0,
  MAX: 1.0,
  DEFAULT: 0.5,
  ERROR: 0.1,
  FALLBACK: 0.3,
} as const

/**
 * ゲーム設定
 */
export const GAME_CONFIG = {
  DEFAULT_SCORE: 0,
  DEFAULT_TOTAL_QUESTIONS: 0,
} as const

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES = {
  AI_RESPONSE_PARSE_ERROR: 'AIの応答を解析できませんでした。',
  AI_REQUEST_FAILED: 'AI リクエストに失敗しました。',
  UNKNOWN_ERROR: '判断できませんでした。',
  OPENAI_API_KEY_MISSING: 'OpenAI APIキーが設定されていません。',
  OPENAI_API_KEY_INVALID: 'OpenAI APIキーが無効です。',
  OPENAI_QUOTA_EXCEEDED: 'OpenAI APIの使用量上限に達しています。',
  OPENAI_INITIALIZATION_FAILED: 'OpenAI サービスの初期化に失敗しました。',
  CHROME_AI_UNAVAILABLE: 'Chrome AI が利用できません',
  CHROME_AI_ERROR: 'Chrome AIでエラーが発生しました。',
} as const
