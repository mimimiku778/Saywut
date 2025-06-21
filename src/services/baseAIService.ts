import { AIResponse } from '../types'
import { IAIService } from './types'
import { getRandomTopic } from '../data'
import { createReasoningGamePrompt } from '../prompts'
import { CONFIDENCE, ERROR_MESSAGES } from '../constants'

/**
 * AIサービスの基底クラス
 */
export abstract class BaseAIService implements IAIService {

  abstract generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse>
  abstract getServiceName(): string
  abstract isAvailable(): Promise<boolean>

  getRandomTopic(): string {
    return getRandomTopic()
  }

  /**
   * AIへのプロンプトを作成する
   */
  protected createPrompt(userInput: string, correctAnswer: string): string {
    return createReasoningGamePrompt(userInput, correctAnswer)
  }

  /**
   * AIの応答を解析する
   */
  protected parseAIResponse(responseText: string): AIResponse {
    try {
      // JSONレスポンスの抽出を試行
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          guess: parsed.guess || '不明',
          reasoning: parsed.reasoning || ERROR_MESSAGES.UNKNOWN_ERROR,
          confidence: Math.max(CONFIDENCE.MIN, Math.min(CONFIDENCE.MAX, parsed.confidence || CONFIDENCE.DEFAULT)),
        }
      }

      // JSONが見つからない場合のフォールバック
      return this.createFallbackResponse()
    } catch (error) {
      console.error('AIレスポンス解析エラー:', error)
      return this.createFallbackResponse()
    }
  }

  /**
   * フォールバック応答を作成する
   */
  protected createFallbackResponse(): AIResponse {
    return {
      guess: getRandomTopic(),
      reasoning: ERROR_MESSAGES.AI_RESPONSE_PARSE_ERROR,
      confidence: CONFIDENCE.FALLBACK,
    }
  }

  /**
   * エラー応答を作成する
   */
  protected createErrorResponse(errorMessage: string): AIResponse {
    return {
      guess: getRandomTopic(),
      reasoning: errorMessage,
      confidence: CONFIDENCE.ERROR,
    }
  }
}
