import { AIResponse } from '../types'
import { IAIService } from './types'
import { getRandomTopic } from '../data'
import { createReasoningGamePrompt } from '../prompts'
import { ERROR_MESSAGES } from '../constants'

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
    return {
      response: responseText.trim()
    }
  }

  /**
   * フォールバック応答を作成する
   */
  protected createFallbackResponse(): AIResponse {
    return {
      response: ERROR_MESSAGES.AI_RESPONSE_PARSE_ERROR,
    }
  }

  /**
   * エラー応答を作成する
   */
  protected createErrorResponse(errorMessage: string): AIResponse {
    return {
      response: errorMessage,
    }
  }
}
