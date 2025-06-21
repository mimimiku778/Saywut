import { AIResponse } from '../types/gameTypes'
import { BaseAIService } from './baseAIService'
import { ERROR_MESSAGES } from '../constants/gameConstants'
import { INITIAL_SYSTEM_PROMPT } from '../prompts/gamePrompts'

/**
 * Chrome Built-in AI (Gemini Nano) を使用するサービス
 */
export class ChromeAIService extends BaseAIService {
  private model: any = null
  private isInitialized = false

  getServiceName(): string {
    return 'Chrome Built-in AI (Gemini Nano)'
  }

  async isAvailable(): Promise<boolean> {
    try {
      // 新しい仕様ではLanguageModelグローバルオブジェクトを使用
      if (typeof (globalThis as any).LanguageModel === 'undefined') {
        return false
      }

      const availability = await (globalThis as any).LanguageModel.availability()
      return availability !== 'unavailable'
    } catch (error) {
      console.error('Chrome AI 利用可能性チェックエラー:', error)
      return false
    }
  }

  private async initializeModel(): Promise<boolean> {
    try {
      if (this.isInitialized && this.model) {
        return true
      }

      if (typeof (globalThis as any).LanguageModel === 'undefined') {
        return false
      }

      const availability = await (globalThis as any).LanguageModel.availability()
      if (availability === 'unavailable') {
        return false
      }

      // 新しいAPI仕様を使用してモデルを作成
      this.model = await (globalThis as any).LanguageModel.create({
        initialPrompts: [INITIAL_SYSTEM_PROMPT],
        temperature: 0.7,
        topK: 3,
      })

      this.isInitialized = true
      console.log('Chrome Built-in AI (Gemini Nano) が初期化されました')
      return true
    } catch (error) {
      console.error('Chrome AI初期化エラー:', error)
      this.isInitialized = false
      return false
    }
  }

  async generateResponse(userInput: string, _correctAnswer: string): Promise<AIResponse> {
    try {
      // モデルの初期化を確認
      const initialized = await this.initializeModel()
      if (!initialized) {
        return this.createErrorResponse(ERROR_MESSAGES.CHROME_AI_UNAVAILABLE)
      }

      const prompt = this.createPrompt(userInput)

      // 新しい仕様では単純にpromptメソッドを使用
      console.log(prompt)
      const responseText = await this.model.prompt(prompt)

      return this.parseAIResponse(responseText)
    } catch (error) {
      console.error('Chrome AI エラー:', error)
      return this.createErrorResponse(ERROR_MESSAGES.CHROME_AI_ERROR)
    }
  }

  async validateUserInput(userInput: string, correctAnswer: string): Promise<AIResponse> {
    try {
      // モデルの初期化を確認
      const initialized = await this.initializeModel()
      if (!initialized) {
        return this.createErrorResponse(ERROR_MESSAGES.CHROME_AI_UNAVAILABLE)
      }

      const validationPrompt = this.createValidationPrompt(userInput, correctAnswer)
      const responseText = await this.model.prompt(validationPrompt)

      return this.parseAIResponse(responseText)
    } catch (error) {
      console.error('Chrome AI 入力値検証エラー:', error)
      return this.createErrorResponse(ERROR_MESSAGES.CHROME_AI_ERROR)
    }
  }

  /**
   * モデルを破棄してリソースを解放する
   */
  destroy(): void {
    if (this.model && typeof this.model.destroy === 'function') {
      this.model.destroy()
    }
    this.model = null
    this.isInitialized = false
  }
}
