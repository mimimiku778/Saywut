/**
 * クイズで使用するトピック一覧（難易度別）
 */

export const NORMAL_TOPICS = [
  '猫',
  '犬',
  '花',
  '魚',
  '鳥',
  '雨',
  '雪',
  '風',
  '太陽',
  '月',
  '星',
  '空',
  '海',
  '川',
  '山',
  '木',
  '森',
  '桜',
  '蝶',
  '虹',
  'コーヒー',
  '本',
  'ラーメン',
  '寿司',
  '電車',
  'ピアノ',
  '花火',
  '富士山',
  'スマートフォン',
] as const

export const HARD_TOPICS = [
  '美',
  '夢',
  '希望',
  '幸福',
  '成功',
  '勇気',
  '友情',
  '家族',
  '恋愛',
  '平和',
  '自由',
  '信頼',
  '音楽',
  '芸術',
  '正義',
  '責任',
  '生',
  '時間',
  '記憶',
  '失敗',
  '挫折',
  '孤独',
  '絶望',
  '裏切り',
  '忘却',
  '戦争',
  '死',
  '文学',
  '哲学',
  '宗教',
] as const

export const QUIZ_TOPICS = [...NORMAL_TOPICS, ...HARD_TOPICS] as const

export type DifficultyLevel = 'normal' | 'hard'

/**
 * 指定した難易度のランダムなトピックを取得する
 */
export function getRandomTopic(difficulty: DifficultyLevel = 'normal'): string {
  const topics = getTopicsByDifficulty(difficulty)
  return topics[Math.floor(Math.random() * topics.length)]
}

/**
 * 難易度別のトピック配列を取得する
 */
export function getTopicsByDifficulty(difficulty: DifficultyLevel): readonly string[] {
  switch (difficulty) {
    case 'normal':
      return NORMAL_TOPICS
    case 'hard':
      return HARD_TOPICS
    default:
      return NORMAL_TOPICS
  }
}

/**
 * 全トピックの総数を取得する
 */
export function getTopicCount(): number {
  return QUIZ_TOPICS.length
}

/**
 * 指定した難易度のトピック数を取得する
 */
export function getTopicCountByDifficulty(difficulty: DifficultyLevel): number {
  return getTopicsByDifficulty(difficulty).length
}
