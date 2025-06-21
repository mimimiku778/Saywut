/**
 * クイズで使用するトピック一覧
 */
export const QUIZ_TOPICS = [
  '桜',
  'ラーメン',
  '富士山',
  '電車',
  '猫',
  'スマートフォン',
  '寿司',
  '本',
  'コーヒー',
  '雨',
  'ピアノ',
  '海',
  '花火',
  '雪',
  '太陽',
  '月',
  '星',
  '風',
  '虹',
  '蝶',
  '鳥',
  '犬',
  '魚',
  '花',
  '木',
  '川',
  '山',
  '森',
  '空',
] as const

/**
 * ランダムなトピックを取得する
 */
export function getRandomTopic(): string {
  return QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)]
}

/**
 * トピックの総数を取得する
 */
export function getTopicCount(): number {
  return QUIZ_TOPICS.length
}
