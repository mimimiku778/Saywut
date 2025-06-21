import { AIResponse } from '../types/gameTypes'
import { IAIService } from './types'
import { getRandomTopic } from '../data/topics'
import { createReasoningGamePrompt, createInputValidationPrompt } from '../prompts/gamePrompts'
import { ERROR_MESSAGES } from '../constants/gameConstants'

/**
 * AIサービスの基底クラス
 */
export abstract class BaseAIService implements IAIService {
  abstract generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse>
  abstract getServiceName(): string
  abstract isAvailable(): Promise<boolean>

  /**
   * ユーザー入力値を検証する
   */
  abstract validateUserInput(userInput: string, correctAnswer: string): Promise<AIResponse>

  getRandomTopic(): string {
    return getRandomTopic()
  }

  /**
   * AIへのプロンプトを作成する（簡素版）
   */
  protected createPrompt(userInput: string): string {
    return createReasoningGamePrompt(userInput)
  }

  /**
   * 入力値検証用のプロンプトを作成する
   */
  protected createValidationPrompt(userInput: string, correctAnswer: string): string {
    console.log(createInputValidationPrompt(userInput, correctAnswer))
    return createInputValidationPrompt(userInput, correctAnswer)
  }

  /**
   * AIの応答を解析する
   */
  protected parseAIResponse(responseText: string): AIResponse {
    return {
      response: responseText.trim(),
    }
  }

  /**
   * 入力値検証結果を解析する
   */
  protected parseValidationResponse(responseText: string): { isValid: boolean; reason?: string } {
    const trimmedResponse = responseText.trim()
    if (trimmedResponse.startsWith('OK')) {
      return { isValid: true }
    } else if (trimmedResponse.startsWith('NG')) {
      const reason = trimmedResponse.replace(/^NG[：:]?\s*/, '')
      return { isValid: false, reason: reason || '入力内容がルールに適合していません。' }
    }
    // 判定が不明な場合はNGとして扱う
    return { isValid: false, reason: '入力内容の判定ができませんでした。' }
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
