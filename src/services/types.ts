import { AIResponse } from '../types'

/**
 * AIサービスの基本インターフェース
 */
export interface IAIService {
  /**
   * AIの応答を生成する
   * @param userInput ユーザーの入力
   * @param correctAnswer 正解
   * @returns AI応答
   */
  generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse>

  /**
   * ランダムなトピックを取得する
   * @returns ランダムなトピック
   */
  getRandomTopic(): string

  /**
   * サービスの名前を取得する
   * @returns サービス名
   */
  getServiceName(): string

  /**
   * サービスが利用可能かどうかを確認する
   * @returns 利用可能な場合はtrue
   */
  isAvailable(): Promise<boolean>
}

/**
 * AIサービスの種類
 */
export type AIServiceType = 'chrome-ai' | 'openai'

/**
 * AIサービスの設定
 */
export interface AIServiceConfig {
  defaultService: AIServiceType
  openaiApiKey?: string
  enableChromeAI: boolean
}
